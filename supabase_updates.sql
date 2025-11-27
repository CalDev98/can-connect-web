-- Add subscription column to profiles table to store Web Push subscription
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription JSONB;

-- Comment on the column
COMMENT ON COLUMN public.profiles.subscription IS 'Web Push subscription object for notifications';
