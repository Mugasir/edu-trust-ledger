
-- Staff roles within institutions (HM, Dean, Registrar, etc.)
CREATE TYPE public.staff_role AS ENUM ('headmaster', 'dean', 'registrar', 'teacher', 'admin_staff');

-- Track which staff member belongs to which institution
CREATE TABLE public.institution_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  institution_id uuid NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  staff_role staff_role NOT NULL DEFAULT 'teacher',
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, institution_id)
);

ALTER TABLE public.institution_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own institution staff"
  ON public.institution_staff FOR SELECT
  USING (institution_id IN (SELECT id FROM public.institutions WHERE user_id = auth.uid()));

CREATE POLICY "Institution owner can manage staff"
  ON public.institution_staff FOR INSERT
  WITH CHECK (institution_id IN (SELECT id FROM public.institutions WHERE user_id = auth.uid()));

CREATE POLICY "Institution owner can update staff"
  ON public.institution_staff FOR UPDATE
  USING (institution_id IN (SELECT id FROM public.institutions WHERE user_id = auth.uid()));

CREATE POLICY "Institution owner can delete staff"
  ON public.institution_staff FOR DELETE
  USING (institution_id IN (SELECT id FROM public.institutions WHERE user_id = auth.uid()));

-- Add audit columns to learners table
ALTER TABLE public.learners 
  ADD COLUMN uploaded_by text,
  ADD COLUMN last_modified_by text;
