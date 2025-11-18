-- 1. Create the profiles table
-- This table will store user-specific data that is not related to authentication.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Set up Row Level Security (RLS)
-- This ensures that users can only access their own profile data.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can read their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 3. Create a function to handle new user sign-ups
-- This function will be triggered every time a new user is created in the auth.users table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a trigger to call the function on new user creation
-- This trigger will fire after a new user is inserted into auth.users.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. (Optional) Create a function to get the current user's plan
-- This can be called from your application code using RPC.
CREATE OR REPLACE FUNCTION public.get_my_plan()
RETURNS TEXT AS $$
DECLARE
  user_plan TEXT;
BEGIN
  SELECT plan INTO user_plan FROM public.profiles WHERE id = auth.uid();
  RETURN user_plan;
END;
$$ LANGUAGE plpgsql;
