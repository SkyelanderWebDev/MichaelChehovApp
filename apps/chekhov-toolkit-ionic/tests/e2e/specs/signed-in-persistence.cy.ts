/// <reference types="cypress" />

import { createClient } from '@supabase/supabase-js';

const MOBILE_VIEWPORT = {
  width: 390,
  height: 844,
};

const ENV_REQUIREMENTS = [
  {
    cyName: 'RUN_AUTH_PERSISTENCE',
    displayName: 'CYPRESS_RUN_AUTH_PERSISTENCE=1',
    isPresent: (value: unknown) => String(value) === '1',
  },
  {
    cyName: 'SUPABASE_URL',
    displayName: 'CYPRESS_SUPABASE_URL',
    isPresent: hasStringValue,
  },
  {
    cyName: 'SUPABASE_ANON_KEY',
    displayName: 'CYPRESS_SUPABASE_ANON_KEY',
    isPresent: hasStringValue,
  },
  {
    cyName: 'TESTER_EMAIL',
    displayName: 'CYPRESS_TESTER_EMAIL',
    isPresent: hasStringValue,
  },
  {
    cyName: 'TESTER_PASSWORD',
    displayName: 'CYPRESS_TESTER_PASSWORD',
    isPresent: hasStringValue,
  },
];

const missingAuthPersistenceEnv = ENV_REQUIREMENTS
  .filter((requirement) => !requirement.isPresent(Cypress.env(requirement.cyName)))
  .map((requirement) => requirement.displayName);

describe('signed-in Today’s Practice persistence', () => {
  if (missingAuthPersistenceEnv.length > 0) {
    it.skip(
      `TODO gated receipt: set ${missingAuthPersistenceEnv.join(', ')} plus VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY to run A5 auth persistence`,
      () => undefined,
    );
    return;
  }

  beforeEach(() => {
    cy.viewport(MOBILE_VIEWPORT.width, MOBILE_VIEWPORT.height);
  });

  it('persists POA, keeps the started lock after navigation and reload, and scopes data to the local day', () => {
    const today = localDate();
    const yesterday = localDate(-1);
    const practiceNote = `A5 structured practice ${Date.now()}`;
    const observeNote = `A5 morning observe ${Date.now()}`;
    const freeResponse = `A5 free response should stay empty for structured mode ${Date.now()}`;

    cy.wrap(prepareTesterRows(today, yesterday));

    cy.visit('/journal', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.sessionStorage.clear();
      },
    });

    signInThroughUi();
    cy.contains('No practice selected yet. Use an entry path above to preview today’s tool.').should('be.visible');
    cy.contains(yesterday).should('not.exist');

    cy.contains('button', 'Draw Random').should('not.be.disabled').click();
    cy.get('.tool-preview-card').should('contain.text', 'Preview');
    cy.contains('ion-button', 'Start Today’s Practice').click();
    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
    cy.contains('button', 'Draw Random').should('be.disabled');

    cy.get('#poa-practice').clear().type(practiceNote);
    cy.get('#poa-observe-morning').clear().type(observeNote);
    cy.contains('button', 'Free response').click();
    cy.get('#daily-action-note').clear().type(freeResponse);
    cy.contains('button', 'Structured').click();
    cy.get('#poa-practice').should('have.value', practiceNote);
    cy.contains('ion-button', 'Save Daily Action').click();
    cy.contains('Daily Action saved.').should('be.visible');

    cy.visit('/library');
    cy.contains('Dive Deeper into the Tools').should('be.visible');
    cy.visit('/journal');
    cy.reload();

    cy.get('.tool-preview-card').should('contain.text', 'Today’s practice is started.');
    cy.contains('button', 'Draw Random').should('be.disabled');
    cy.get('#poa-practice').should('have.value', practiceNote);
    cy.get('#poa-observe-morning').should('have.value', observeNote);
    cy.contains('button', 'Free response').click();
    cy.get('#daily-action-note').should('have.value', freeResponse);
    cy.contains(yesterday).should('not.exist');

    cy.wrap(readTesterRows(today, yesterday)).then((snapshot) => {
      expect(snapshot.todayPractice?.local_date).to.equal(today);
      expect(snapshot.todayPractice?.status).to.equal('started');
      expect(snapshot.yesterdayPractice?.local_date).to.equal(yesterday);
      expect(snapshot.todayPoa?.mode).to.equal('structured');
      expect(snapshot.todayPoa?.practice_notes).to.equal(practiceNote);
      expect(snapshot.todayPoa?.observe_morning).to.equal(observeNote);
      expect(snapshot.todayPoa?.journal_text).to.equal(freeResponse);
    });
  });
});

function hasStringValue(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function stringEnv(name: string): string {
  const value = Cypress.env(name);
  if (!hasStringValue(value)) throw new Error(`Missing Cypress env ${name}`);
  return String(value).trim();
}

function makeSupabaseClient() {
  return createClient(stringEnv('SUPABASE_URL'), stringEnv('SUPABASE_ANON_KEY'), {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

async function signInSupabase() {
  const client = makeSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: stringEnv('TESTER_EMAIL'),
    password: stringEnv('TESTER_PASSWORD'),
  });

  if (error) throw error;
  if (!data.user) throw new Error('Supabase sign-in did not return a user.');

  return { client, userId: data.user.id };
}

async function prepareTesterRows(today: string, yesterday: string): Promise<void> {
  const { client, userId } = await signInSupabase();
  await deletePracticeDates(client, userId, [today, yesterday]);

  const { data: practice, error: practiceError } = await client
    .from('daily_practices')
    .insert({
      user_id: userId,
      local_date: yesterday,
      source: 'random',
      status: 'started',
      category_id: yesterdaySelection.categoryId,
      category_name: yesterdaySelection.categoryName,
      parent_tool_name: yesterdaySelection.parentToolName,
      child_tool_name: yesterdaySelection.childToolName,
      selected_tool: yesterdaySelection,
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (practiceError) throw practiceError;

  const { error: poaError } = await client
    .from('poa_entries')
    .insert({
      user_id: userId,
      daily_practice_id: practice.id,
      mode: 'journal',
      journal_text: 'Yesterday seeded row proves Today only loads the local-day practice.',
    });

  if (poaError) throw poaError;
  await client.auth.signOut();
}

async function readTesterRows(today: string, yesterday: string) {
  const { client, userId } = await signInSupabase();
  const { data: practices, error: practiceError } = await client
    .from('daily_practices')
    .select('id, local_date, status')
    .eq('user_id', userId)
    .in('local_date', [today, yesterday]);

  if (practiceError) throw practiceError;

  const todayPractice = practices?.find((practice) => practice.local_date === today) ?? null;
  const yesterdayPractice = practices?.find((practice) => practice.local_date === yesterday) ?? null;
  let todayPoa = null;

  if (todayPractice) {
    const { data: poa, error: poaError } = await client
      .from('poa_entries')
      .select('mode, practice_notes, observe_morning, journal_text')
      .eq('user_id', userId)
      .eq('daily_practice_id', todayPractice.id)
      .maybeSingle();

    if (poaError) throw poaError;
    todayPoa = poa;
  }

  await client.auth.signOut();

  return {
    todayPractice,
    yesterdayPractice,
    todayPoa,
  };
}

async function deletePracticeDates(
  client: ReturnType<typeof createClient>,
  userId: string,
  dates: string[],
): Promise<void> {
  const { data: practices, error: practiceReadError } = await client
    .from('daily_practices')
    .select('id')
    .eq('user_id', userId)
    .in('local_date', dates);

  if (practiceReadError) throw practiceReadError;

  const practiceIds = (practices ?? []).map((practice) => practice.id);
  if (practiceIds.length > 0) {
    const { error: poaDeleteError } = await client
      .from('poa_entries')
      .delete()
      .eq('user_id', userId)
      .in('daily_practice_id', practiceIds);

    if (poaDeleteError) throw poaDeleteError;
  }

  const { error: practiceDeleteError } = await client
    .from('daily_practices')
    .delete()
    .eq('user_id', userId)
    .in('local_date', dates);

  if (practiceDeleteError) throw practiceDeleteError;
}

function signInThroughUi(): void {
  cy.contains('ion-button', 'Get tester access').click();
  cy.get('#tester-email').clear().type(stringEnv('TESTER_EMAIL'));
  cy.get('#tester-password').clear().type(stringEnv('TESTER_PASSWORD'), { log: false });
  cy.contains('ion-button', 'Sign in').click();
  cy.contains('Get tester access').should('not.exist');
}

function localDate(dayOffset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const yesterdaySelection = {
  categoryId: 'archetypal-gestures',
  categoryName: 'Archetypal Gestures',
  parentToolName: 'Push',
  childToolName: 'Press',
  scaleValue: null,
  unveiledValue: null,
};
