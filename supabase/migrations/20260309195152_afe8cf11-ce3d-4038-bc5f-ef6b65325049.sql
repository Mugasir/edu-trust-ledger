
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE

-- ============ INSTITUTIONS ============
DROP POLICY IF EXISTS "Admin can insert institutions" ON public.institutions;
DROP POLICY IF EXISTS "Admin can update institutions" ON public.institutions;
DROP POLICY IF EXISTS "Admin can view all institutions" ON public.institutions;
DROP POLICY IF EXISTS "Institutions can insert own data" ON public.institutions;
DROP POLICY IF EXISTS "Institutions can update own data" ON public.institutions;
DROP POLICY IF EXISTS "Institutions can view own data" ON public.institutions;

CREATE POLICY "Admin can insert institutions" ON public.institutions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can update institutions" ON public.institutions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can view all institutions" ON public.institutions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Institutions can insert own data" ON public.institutions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Institutions can update own data" ON public.institutions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Institutions can view own data" ON public.institutions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ ORGANIZATIONS ============
DROP POLICY IF EXISTS "Admin can insert organizations" ON public.organizations;
DROP POLICY IF EXISTS "Admin can view all organizations" ON public.organizations;
DROP POLICY IF EXISTS "Orgs can insert own data" ON public.organizations;
DROP POLICY IF EXISTS "Orgs can update own data" ON public.organizations;
DROP POLICY IF EXISTS "Orgs can view own data" ON public.organizations;

CREATE POLICY "Admin can insert organizations" ON public.organizations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can view all organizations" ON public.organizations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Orgs can insert own data" ON public.organizations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Orgs can update own data" ON public.organizations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Orgs can view own data" ON public.organizations FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ LEARNERS ============
DROP POLICY IF EXISTS "Admin can update learners" ON public.learners;
DROP POLICY IF EXISTS "Admin can view all learners" ON public.learners;
DROP POLICY IF EXISTS "Institutions can delete own learners" ON public.learners;
DROP POLICY IF EXISTS "Institutions can insert own learners" ON public.learners;
DROP POLICY IF EXISTS "Institutions can update own learners" ON public.learners;
DROP POLICY IF EXISTS "Institutions can view own learners" ON public.learners;
DROP POLICY IF EXISTS "Organizations can view learners" ON public.learners;

CREATE POLICY "Admin can update learners" ON public.learners FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can view all learners" ON public.learners FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Institutions can delete own learners" ON public.learners FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Institutions can insert own learners" ON public.learners FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Institutions can update own learners" ON public.learners FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Institutions can view own learners" ON public.learners FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Organizations can view learners" ON public.learners FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'organization'));

-- ============ PROFILES ============
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Admin can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ TRANSCRIPTS ============
DROP POLICY IF EXISTS "Admin can delete transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Admin can insert transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Admin can view all transcripts" ON public.transcripts;
DROP POLICY IF EXISTS "Institutions can view own learner transcripts" ON public.transcripts;

CREATE POLICY "Admin can delete transcripts" ON public.transcripts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can insert transcripts" ON public.transcripts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin can view all transcripts" ON public.transcripts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Institutions can view own learner transcripts" ON public.transcripts FOR SELECT TO authenticated USING (learner_id IN (SELECT id FROM public.learners WHERE user_id = auth.uid()));

-- ============ INSTITUTION_STAFF ============
DROP POLICY IF EXISTS "Admin can view all staff" ON public.institution_staff;
DROP POLICY IF EXISTS "Institution owner can delete staff" ON public.institution_staff;
DROP POLICY IF EXISTS "Institution owner can manage staff" ON public.institution_staff;
DROP POLICY IF EXISTS "Institution owner can update staff" ON public.institution_staff;
DROP POLICY IF EXISTS "Staff can view own institution staff" ON public.institution_staff;

CREATE POLICY "Admin can view all staff" ON public.institution_staff FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Institution owner can delete staff" ON public.institution_staff FOR DELETE TO authenticated USING (institution_id IN (SELECT id FROM public.institutions WHERE user_id = auth.uid()));
CREATE POLICY "Institution owner can manage staff" ON public.institution_staff FOR INSERT TO authenticated WITH CHECK (institution_id IN (SELECT id FROM public.institutions WHERE user_id = auth.uid()));
CREATE POLICY "Institution owner can update staff" ON public.institution_staff FOR UPDATE TO authenticated USING (institution_id IN (SELECT id FROM public.institutions WHERE user_id = auth.uid()));
CREATE POLICY "Staff can view own institution staff" ON public.institution_staff FOR SELECT TO authenticated USING (institution_id IN (SELECT id FROM public.institutions WHERE user_id = auth.uid()));

-- ============ USER_ROLES ============
DROP POLICY IF EXISTS "Admin can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Admin can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
