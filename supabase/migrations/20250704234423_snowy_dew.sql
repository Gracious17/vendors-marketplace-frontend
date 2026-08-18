/*
  # Create vendor-related tables for dashboard data

  1. New Tables
    - `vendor_profiles` - Extended vendor information
    - `vendor_stats` - Dashboard statistics
    - `vendor_inquiries` - Client inquiries to vendors
    - `vendor_bookings` - Confirmed bookings

  2. Security
    - Enable RLS on all tables
    - Add policies for vendors to manage their own data
*/

-- Create vendor_profiles table
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text,
  category text,
  description text,
  services text[],
  location jsonb,
  pricing jsonb,
  images text[],
  verified boolean DEFAULT false,
  availability boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create vendor_stats table
CREATE TABLE IF NOT EXISTS vendor_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  profile_views integer DEFAULT 0,
  inquiries integer DEFAULT 0,
  bookings integer DEFAULT 0,
  revenue decimal DEFAULT 0,
  month_year text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(vendor_id, month_year)
);

-- Create vendor_inquiries table
CREATE TABLE IF NOT EXISTS vendor_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_name text,
  client_email text,
  event_type text,
  event_date date,
  message text,
  status text DEFAULT 'New' CHECK (status IN ('New', 'Responded', 'Booked', 'Declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vendor_bookings table
CREATE TABLE IF NOT EXISTS vendor_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_name text,
  event_type text,
  event_date date,
  amount decimal,
  status text DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending', 'Completed', 'Cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bookings ENABLE ROW LEVEL SECURITY;

-- Policies for vendor_profiles
CREATE POLICY "Vendors can manage own profile"
  ON vendor_profiles
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Anyone can view vendor profiles"
  ON vendor_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for vendor_stats
CREATE POLICY "Vendors can view own stats"
  ON vendor_stats
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can update own stats"
  ON vendor_stats
  FOR ALL
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Policies for vendor_inquiries
CREATE POLICY "Vendors can view own inquiries"
  ON vendor_inquiries
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

CREATE POLICY "Clients can create inquiries"
  ON vendor_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Vendors can update own inquiries"
  ON vendor_inquiries
  FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Policies for vendor_bookings
CREATE POLICY "Vendors can view own bookings"
  ON vendor_bookings
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can manage own bookings"
  ON vendor_bookings
  FOR ALL
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_vendor_profiles_updated_at
  BEFORE UPDATE ON vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_stats_updated_at
  BEFORE UPDATE ON vendor_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_inquiries_updated_at
  BEFORE UPDATE ON vendor_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_bookings_updated_at
  BEFORE UPDATE ON vendor_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert current month stats for existing vendors
INSERT INTO vendor_stats (vendor_id, month_year)
SELECT id, TO_CHAR(NOW(), 'YYYY-MM')
FROM profiles 
WHERE role = 'vendor'
ON CONFLICT (vendor_id, month_year) DO NOTHING;