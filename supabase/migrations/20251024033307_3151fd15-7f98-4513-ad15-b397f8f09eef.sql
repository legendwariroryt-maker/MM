-- Create table for storing MBTI personality results
CREATE TABLE IF NOT EXISTS public.mbti_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  personality_type TEXT NOT NULL CHECK (length(personality_type) = 4),
  e_i_score INTEGER NOT NULL CHECK (e_i_score >= -10 AND e_i_score <= 10),
  s_n_score INTEGER NOT NULL CHECK (s_n_score >= -10 AND s_n_score <= 10),
  t_f_score INTEGER NOT NULL CHECK (t_f_score >= -10 AND t_f_score <= 10),
  j_p_score INTEGER NOT NULL CHECK (j_p_score >= -10 AND j_p_score <= 10),
  test_answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mbti_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own MBTI results"
ON public.mbti_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own MBTI results"
ON public.mbti_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MBTI results"
ON public.mbti_results
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mbti_results_updated_at
BEFORE UPDATE ON public.mbti_results
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_mbti_results_user_id ON public.mbti_results(user_id);
CREATE INDEX idx_mbti_results_created_at ON public.mbti_results(created_at DESC);