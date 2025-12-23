-- 1. Add impressions column if it doesn't exist
ALTER TABLE public.campaign_stats 
ADD COLUMN IF NOT EXISTS impressions INT DEFAULT 0;

-- 2. Create the atomic RPC function
CREATE OR REPLACE FUNCTION increment_impressions(p_campaign_id UUID, p_date DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.campaign_stats (campaign_id, date, impressions, clicks)
    VALUES (p_campaign_id, p_date, 1, 0)
    ON CONFLICT (campaign_id, date)
    DO UPDATE SET impressions = public.campaign_stats.impressions + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ensure RLS allows the RPC to be called
-- Note: SECURITY DEFINER makes the function run with the privileges of the creator (usually postgres).
-- We just need to make sure the function is accessible.
GRANT EXECUTE ON FUNCTION increment_impressions(UUID, DATE) TO anon;
GRANT EXECUTE ON FUNCTION increment_impressions(UUID, DATE) TO authenticated;

-- 4. Atomic click function (optional but recommended for consistency)
CREATE OR REPLACE FUNCTION increment_clicks(p_campaign_id UUID, p_date DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.campaign_stats (campaign_id, date, impressions, clicks)
    VALUES (p_campaign_id, p_date, 0, 1)
    ON CONFLICT (campaign_id, date)
    DO UPDATE SET clicks = public.campaign_stats.clicks + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_clicks(UUID, DATE) TO anon;
GRANT EXECUTE ON FUNCTION increment_clicks(UUID, DATE) TO authenticated;
