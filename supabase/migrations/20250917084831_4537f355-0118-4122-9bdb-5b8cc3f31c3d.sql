-- Fix security warnings by restricting policies to authenticated users only

-- Drop existing policies
DROP POLICY "Users can view their own preferences" ON public.user_preferences;
DROP POLICY "Users can create their own preferences" ON public.user_preferences;
DROP POLICY "Users can update their own preferences" ON public.user_preferences;
DROP POLICY "Users can view their own reports" ON public.parent_reports;

-- Create secure policies that require authentication
CREATE POLICY "Authenticated users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own preferences" 
ON public.user_preferences 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own reports" 
ON public.parent_reports 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);