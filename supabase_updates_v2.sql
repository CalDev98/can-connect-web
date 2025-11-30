-- Add isPremium and conversations columns to profiles table

-- 1. Add isPremium column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS "isPremium" BOOLEAN DEFAULT FALSE;

-- 2. Add conversations column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS conversations TEXT[];

-- 3. Create a function to enforce the logic
CREATE OR REPLACE FUNCTION public.enforce_premium_conversations()
RETURNS TRIGGER AS $$
BEGIN
  -- If isPremium is false (or null), conversations must be null or empty
  IF (NEW."isPremium" IS NOT TRUE) AND (NEW.conversations IS NOT NULL AND array_length(NEW.conversations, 1) > 0) THEN
    -- Option 1: Raise an error
    -- RAISE EXCEPTION 'Conversations can only be saved for premium profiles.';
    
    -- Option 2: Silently clear conversations (as per "otherwise no conversation will be saved")
    NEW.conversations := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the trigger
DROP TRIGGER IF EXISTS check_premium_conversations ON public.profiles;

CREATE TRIGGER check_premium_conversations
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE public.enforce_premium_conversations();
