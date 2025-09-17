-- Create user preferences table for parent reporting (enum already exists)
CREATE TABLE public.user_preferences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    privacy_level privacy_level NOT NULL DEFAULT 'none',
    parent_email TEXT,
    report_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create table to track sent reports
CREATE TABLE public.parent_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    report_date DATE NOT NULL,
    privacy_level privacy_level NOT NULL,
    parent_email TEXT NOT NULL,
    report_data JSONB,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, report_date)
);

-- Enable RLS for parent_reports
ALTER TABLE public.parent_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for parent_reports
CREATE POLICY "Users can view their own reports" 
ON public.parent_reports 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates on user_preferences
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();