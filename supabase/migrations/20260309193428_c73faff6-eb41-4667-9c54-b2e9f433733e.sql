
-- Allow admins to insert institutions
CREATE POLICY "Admin can insert institutions"
ON public.institutions FOR INSERT TO public
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to insert organizations
CREATE POLICY "Admin can insert organizations"
ON public.organizations FOR INSERT TO public
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create transcripts table
CREATE TABLE public.transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES public.learners(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  transcript_type text NOT NULL DEFAULT 'Final',
  academic_year text,
  uploaded_by text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can insert transcripts"
ON public.transcripts FOR INSERT TO public
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can view all transcripts"
ON public.transcripts FOR SELECT TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admin can delete transcripts"
ON public.transcripts FOR DELETE TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Institutions can view own learner transcripts"
ON public.transcripts FOR SELECT TO public
USING (
  learner_id IN (
    SELECT id FROM public.learners WHERE user_id = auth.uid()
  )
);

-- Create storage bucket for transcripts
INSERT INTO storage.buckets (id, name, public) VALUES ('transcripts', 'transcripts', false);

-- Storage RLS: admins can upload
CREATE POLICY "Admin can upload transcripts"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'transcripts' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage RLS: admins can read
CREATE POLICY "Admin can read transcripts"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'transcripts' AND has_role(auth.uid(), 'admin'::app_role));

-- Storage RLS: institutions can read their learners' transcripts
CREATE POLICY "Institutions can read own transcripts"
ON storage.objects FOR SELECT TO public
USING (
  bucket_id = 'transcripts' AND
  has_role(auth.uid(), 'institution'::app_role)
);
