import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const emailDomain = process.env.SUPABASE_RLS_EMAIL_DOMAIN ?? 'skyelandersolutions.com';
const generatedUserPassword = process.env.SUPABASE_RLS_TEST_PASSWORD ?? 'Secure-test-1234';
const localDate = process.env.SUPABASE_RLS_LOCAL_DATE ?? '2026-06-10';

const testUserA = {
  email: process.env.SUPABASE_RLS_USER_A_EMAIL,
  password: process.env.SUPABASE_RLS_USER_A_PASSWORD,
};
const testUserB = {
  email: process.env.SUPABASE_RLS_USER_B_EMAIL,
  password: process.env.SUPABASE_RLS_USER_B_PASSWORD,
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase RLS verification env.');
  console.error('Required: VITE_SUPABASE_URL or SUPABASE_URL.');
  console.error('Required: VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY.');
  process.exit(2);
}

function makeClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

async function getSmokeUser(label, configuredUser) {
  if (configuredUser.email && configuredUser.password) {
    return signInExistingUser(label, configuredUser.email, configuredUser.password);
  }

  return signUpGeneratedUser(label);
}

async function signInExistingUser(label, email, password) {
  const client = makeClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`${label} signIn failed: ${error.message}`);
  if (!data.session?.user) throw new Error(`${label} signIn did not return a session.`);
  return { client, email, userId: data.session.user.id };
}

async function signUpGeneratedUser(label) {
  const client = makeClient();
  const email = `rls-${label}-${Date.now()}-${Math.floor(Math.random() * 100000)}@${emailDomain}`;
  const { data, error } = await client.auth.signUp({ email, password: generatedUserPassword });
  if (error) throw new Error(`${label} signUp failed: ${error.message}`);
  if (!data.session?.user) {
    throw new Error(`${label} signUp did not return a session. Disable email confirmations for local smoke or sign in with a confirmed test user.`);
  }
  return { client, email, userId: data.session.user.id };
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
  console.log(`PASS ${message}`);
}

async function cleanupUserRows(user, dates) {
  const { data: practices, error: practiceReadError } = await user.client
    .from('daily_practices')
    .select('id')
    .eq('user_id', user.userId)
    .in('local_date', dates);
  if (practiceReadError) throw practiceReadError;

  const practiceIds = (practices ?? []).map((practice) => practice.id);
  if (practiceIds.length > 0) {
    const { error: poaDeleteError } = await user.client
      .from('poa_entries')
      .delete()
      .eq('user_id', user.userId)
      .in('daily_practice_id', practiceIds);
    if (poaDeleteError) throw poaDeleteError;
  }

  const { error: feedbackDeleteError } = await user.client
    .from('feedback')
    .delete()
    .eq('user_id', user.userId);
  if (feedbackDeleteError) throw feedbackDeleteError;

  const { error: practiceDeleteError } = await user.client
    .from('daily_practices')
    .delete()
    .eq('user_id', user.userId)
    .in('local_date', dates);
  if (practiceDeleteError) throw practiceDeleteError;
}

async function run() {
  const userA = await getSmokeUser('user-a', testUserA);
  const userB = await getSmokeUser('user-b', testUserB);

  await cleanupUserRows(userA, [localDate]);
  await cleanupUserRows(userB, [localDate]);

  const { data: profileA, error: profileError } = await userA.client
    .from('profiles')
    .select('id,email')
    .eq('id', userA.userId)
    .single();
  if (profileError) throw profileError;
  expect(profileA.id === userA.userId, 'profile trigger creates/selects only user A profile');

  const selectedTool = {
    categoryId: 'archetypal-gestures',
    categoryName: 'Archetypal Gestures',
    parentToolName: 'Push',
    childToolName: 'Press',
    scaleValue: null,
    unveiledValue: null,
  };

  const { data: practiceA, error: practiceAError } = await userA.client
    .from('daily_practices')
    .insert({
      user_id: userA.userId,
      local_date: localDate,
      source: 'random',
      status: 'started',
      category_id: selectedTool.categoryId,
      category_name: selectedTool.categoryName,
      parent_tool_name: selectedTool.parentToolName,
      child_tool_name: selectedTool.childToolName,
      selected_tool: selectedTool,
      started_at: new Date().toISOString(),
    })
    .select('id,user_id,local_date,status')
    .single();
  if (practiceAError) throw practiceAError;
  expect(practiceA.user_id === userA.userId, 'user A inserts own daily practice');

  const { error: poaError } = await userA.client
    .from('poa_entries')
    .insert({
      user_id: userA.userId,
      daily_practice_id: practiceA.id,
      mode: 'journal',
      journal_text: 'RLS smoke POA note for user A',
    });
  if (poaError) throw poaError;
  expect(true, 'user A inserts own POA entry');

  const { error: feedbackError } = await userA.client
    .from('feedback')
    .insert({ user_id: userA.userId, message: 'RLS smoke feedback', context: { source: 'rls-smoke' } });
  if (feedbackError) throw feedbackError;
  expect(true, 'user A inserts own feedback');

  const { data: bReadsA, error: bReadError } = await userB.client
    .from('daily_practices')
    .select('id')
    .eq('id', practiceA.id);
  if (bReadError) throw bReadError;
  expect(Array.isArray(bReadsA) && bReadsA.length === 0, 'user B cannot read user A daily practice');

  const { data: bUpdatesA, error: bUpdateError } = await userB.client
    .from('daily_practices')
    .update({ status: 'preview' })
    .eq('id', practiceA.id)
    .select('id');
  if (bUpdateError) throw bUpdateError;
  expect(Array.isArray(bUpdatesA) && bUpdatesA.length === 0, 'user B cannot update user A daily practice');

  const { error: bPoaAError } = await userB.client
    .from('poa_entries')
    .insert({
      user_id: userB.userId,
      daily_practice_id: practiceA.id,
      mode: 'journal',
      journal_text: 'Should be denied by owner FK/RLS',
    });
  expect(Boolean(bPoaAError), 'user B cannot attach POA to user A daily practice');

  const { data: anonLibrary, error: anonLibraryError } = await makeClient()
    .from('library_items')
    .select('id');
  if (anonLibraryError) throw anonLibraryError;
  expect(Array.isArray(anonLibrary) && anonLibrary.length === 0, 'anonymous user cannot read beta library rows');

  const { data: authLibrary, error: authLibraryError } = await userA.client
    .from('library_items')
    .select('id,title');
  if (authLibraryError) throw authLibraryError;
  expect(Array.isArray(authLibrary) && authLibrary.length >= 2, 'authenticated tester can read minimal library skeleton');

  await cleanupUserRows(userA, [localDate]);
  await cleanupUserRows(userB, [localDate]);

  console.log('RLS smoke complete');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
