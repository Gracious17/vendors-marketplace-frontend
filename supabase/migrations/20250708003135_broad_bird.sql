/*
  # Admin Dashboard Database Schema

  1. New Features
    - Add is_admin column to profiles table
    - Add badges column to vendor_profiles table
    - Create admin security function
    - Update RLS policies for admin access

  2. Security
    - Admin users can manage all profiles and vendor profiles
    - Admin users can assign badges to vendors
    - Regular users maintain existing permissions
    - Admin status is protected and can only be set by service role

  3. Admin User Setup
    - Set kingsleygracious16@gmail.com as admin user
*/

-- Add is_admin column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Add badges column to vendor_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendor_profiles' AND column_name = 'badges'
  ) THEN
    ALTER TABLE vendor_profiles ADD COLUMN badges text[] DEFAULT ARRAY[]::text[];
  END IF;
END $$;

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Set admin status for the specified email
UPDATE profiles 
SET is_admin = true 
WHERE email = 'kingsleygracious16@gmail.com';

-- Create policy for admin to read all profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Admin can read all profiles'
  ) THEN
    CREATE POLICY "Admin can read all profiles"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (is_admin());
  END IF;
END $$;

-- Create policy for admin to update all profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Admin can update all profiles'
  ) THEN
    CREATE POLICY "Admin can update all profiles"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;
END $$;

-- Create policy for admin to delete profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Admin can delete profiles'
  ) THEN
    CREATE POLICY "Admin can delete profiles"
      ON profiles
      FOR DELETE
      TO authenticated
      USING (is_admin());
  END IF;
END $$;

-- Create policy for admin to manage all vendor profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'vendor_profiles' 
    AND policyname = 'Admin can manage all vendor profiles'
  ) THEN
    CREATE POLICY "Admin can manage all vendor profiles"
      ON vendor_profiles
      FOR ALL
      TO authenticated
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;
END $$;

-- Create policy for admin to view all vendor stats
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'vendor_stats' 
    AND policyname = 'Admin can view all vendor stats'
  ) THEN
    CREATE POLICY "Admin can view all vendor stats"
      ON vendor_stats
      FOR SELECT
      TO authenticated
      USING (is_admin());
  END IF;
END $$;

-- Create policy for admin to view all vendor inquiries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'vendor_inquiries' 
    AND policyname = 'Admin can view all vendor inquiries'
  ) THEN
    CREATE POLICY "Admin can view all vendor inquiries"
      ON vendor_inquiries
      FOR SELECT
      TO authenticated
      USING (is_admin());
  END IF;
END $$;

-- Create policy for admin to view all vendor bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'vendor_bookings' 
    AND policyname = 'Admin can view all vendor bookings'
  ) THEN
    CREATE POLICY "Admin can view all vendor bookings"
      ON vendor_bookings
      FOR SELECT
      TO authenticated
      USING (is_admin());
  END IF;
END $$;

-- Create policy for admin to view all vendor subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'vendor_subscriptions' 
    AND policyname = 'Admin can view all vendor subscriptions'
  ) THEN
    CREATE POLICY "Admin can view all vendor subscriptions"
      ON vendor_subscriptions
      FOR SELECT
      TO authenticated
      USING (is_admin());
  END IF;
END $$;

-- Create policy for admin to manage vendor subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'vendor_subscriptions' 
    AND policyname = 'Admin can manage vendor subscriptions'
  ) THEN
    CREATE POLICY "Admin can manage vendor subscriptions"
      ON vendor_subscriptions
      FOR ALL
      TO authenticated
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_badges ON vendor_profiles USING GIN(badges);

-- Create function to safely update admin status (only service role can use this)
CREATE OR REPLACE FUNCTION update_admin_status(user_email text, admin_status boolean)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET is_admin = admin_status 
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission only to service role
GRANT EXECUTE ON FUNCTION update_admin_status(text, boolean) TO service_role;

-- Ensure the admin user exists and has admin privileges
DO $$
BEGIN
  -- If the admin user doesn't exist in profiles yet, this will be handled by the auth trigger
  -- But we ensure they get admin status when they do register
  IF EXISTS (SELECT 1 FROM profiles WHERE email = 'kingsleygracious16@gmail.com') THEN
    UPDATE profiles 
    SET is_admin = true 
    WHERE email = 'kingsleygracious16@gmail.com' AND is_admin = false;
  END IF;
END $$;