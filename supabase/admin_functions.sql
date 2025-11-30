-- Admin Database Functions for BloodPG
-- Run this in your Supabase SQL Editor

-- Function to get total count of all authenticated users
-- This can be called by admin users without service role key
CREATE OR REPLACE FUNCTION get_total_users_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count
  FROM auth.users;
  
  RETURN user_count;
END;
$$;

-- Function to get all user IDs (for admin dashboard)
-- Returns array of user IDs
CREATE OR REPLACE FUNCTION get_all_user_ids()
RETURNS TABLE(user_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT id as user_id
  FROM auth.users;
END;
$$;

-- Grant execute permissions (adjust as needed for your RLS setup)
-- Note: These functions use SECURITY DEFINER so they run with creator's privileges

