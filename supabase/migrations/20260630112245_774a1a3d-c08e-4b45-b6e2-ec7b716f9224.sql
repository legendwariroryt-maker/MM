
-- chat_messages: scope policies to authenticated
DROP POLICY IF EXISTS "Users can create their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can view their own chat messages" ON public.chat_messages;
CREATE POLICY "Users can create their own chat messages" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat messages" ON public.chat_messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- mbti_results
DROP POLICY IF EXISTS "Users can create their own MBTI results" ON public.mbti_results;
DROP POLICY IF EXISTS "Users can update their own MBTI results" ON public.mbti_results;
DROP POLICY IF EXISTS "Users can view their own MBTI results" ON public.mbti_results;
CREATE POLICY "Users can create their own MBTI results" ON public.mbti_results
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own MBTI results" ON public.mbti_results
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own MBTI results" ON public.mbti_results
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- profiles: restrict to own, drop "view all"
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- parent_reports: add write policies, restrict select to authenticated
DROP POLICY IF EXISTS "Authenticated users can view their own reports" ON public.parent_reports;
CREATE POLICY "Users can view their own reports" ON public.parent_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reports" ON public.parent_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reports" ON public.parent_reports
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Revoke execute on security definer trigger function from public roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
