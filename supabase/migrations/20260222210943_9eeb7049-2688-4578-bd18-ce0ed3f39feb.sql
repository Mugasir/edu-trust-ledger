
-- Create learners table for student records
CREATE TABLE public.learners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  edutrack_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  level TEXT NOT NULL DEFAULT 'P1',
  status TEXT NOT NULL DEFAULT 'Active',
  guardian_name TEXT,
  guardian_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;

-- Institutions can manage their own learners
CREATE POLICY "Institutions can view own learners"
  ON public.learners FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Institutions can insert own learners"
  ON public.learners FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Institutions can update own learners"
  ON public.learners FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Institutions can delete own learners"
  ON public.learners FOR DELETE
  USING (auth.uid() = user_id);

-- Organizations can search learners (read-only)
CREATE POLICY "Organizations can view learners"
  ON public.learners FOR SELECT
  USING (public.has_role(auth.uid(), 'organization'));

-- Sequence for auto-incrementing EduTrack IDs
CREATE SEQUENCE IF NOT EXISTS public.edutrack_id_seq START WITH 1;

-- Trigger for updated_at
CREATE TRIGGER update_learners_updated_at
  BEFORE UPDATE ON public.learners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
