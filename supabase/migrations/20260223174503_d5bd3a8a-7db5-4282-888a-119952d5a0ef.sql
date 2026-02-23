
-- Allow admin to view all institutions
CREATE POLICY "Admin can view all institutions"
ON public.institutions
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admin to view all learners
CREATE POLICY "Admin can view all learners"
ON public.learners
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admin to view all profiles
CREATE POLICY "Admin can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admin to view all organizations
CREATE POLICY "Admin can view all organizations"
ON public.organizations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admin to view all user_roles
CREATE POLICY "Admin can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admin to view all institution_staff
CREATE POLICY "Admin can view all staff"
ON public.institution_staff
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admin to update learner status
CREATE POLICY "Admin can update learners"
ON public.learners
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admin to update institutions
CREATE POLICY "Admin can update institutions"
ON public.institutions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));
