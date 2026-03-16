
-- Add approval status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Mark all existing profiles as approved so current users aren't locked out
UPDATE public.profiles SET status = 'approved';
