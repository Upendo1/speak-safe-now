-- Create table for saved evidence
CREATE TABLE public.saved_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('safe', 'harmful', 'dangerous')),
  guidance text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (no auth required for MVP)
CREATE POLICY "Anyone can save reports"
ON public.saved_reports
FOR INSERT
WITH CHECK (true);

-- Create policy to allow anyone to view their reports (no auth required for MVP)
CREATE POLICY "Anyone can view reports"
ON public.saved_reports
FOR SELECT
USING (true);