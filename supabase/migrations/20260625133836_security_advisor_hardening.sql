-- Security advisor hardening for secure-beta Supabase project.
-- Keeps app behavior unchanged while reducing exposed function surface.

-- Supabase advisor: function_search_path_mutable on public.set_updated_at.
-- Pin to the empty search path because the function only assigns NEW.updated_at.
alter function public.set_updated_at() set search_path = '';

-- Supabase advisor: public.handle_new_auth_user() is SECURITY DEFINER and
-- should only fire as an auth.users trigger, not be callable through PostgREST
-- RPC by anonymous or signed-in clients.
revoke execute on function public.handle_new_auth_user() from public;
revoke execute on function public.handle_new_auth_user() from anon;
revoke execute on function public.handle_new_auth_user() from authenticated;
