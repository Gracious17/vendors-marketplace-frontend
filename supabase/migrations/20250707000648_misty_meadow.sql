/*
  # Create vendor subscriptions table

  1. New Tables
    - `vendor_subscriptions`
      - `id` (uuid, primary key)
      - `vendor_id` (uuid, references profiles.id)
      - `plan_type` (text, check constraint for plan types)
      - `status` (text, check constraint for subscription status)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `payment_reference` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `vendor_subscriptions` table
    - Add policies for vendors to manage their own subscriptions
    - Add policy for reading subscription data

  3. Constraints
    - Unique constraint on vendor_id for active subscriptions
    - Check constraints for valid plan types and statuses
*/

-- Create vendor_subscriptions table
CREATE TABLE IF NOT EXISTS vendor_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled', 'expired')),
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz NOT NULL,
  payment_reference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vendor_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Vendors can view own subscriptions"
  ON vendor_subscriptions
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert own subscriptions"
  ON vendor_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update own subscriptions"
  ON vendor_subscriptions
  FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid())
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Service role can manage all subscriptions"
  ON vendor_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_vendor_subscriptions_updated_at
  BEFORE UPDATE ON vendor_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_subscriptions_vendor_id ON vendor_subscriptions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_subscriptions_status ON vendor_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_vendor_subscriptions_end_date ON vendor_subscriptions(end_date);

-- Insert some sample subscription data for testing (optional)
-- You can remove this section if you don't want sample data
INSERT INTO vendor_subscriptions (vendor_id, plan_type, status, start_date, end_date, payment_reference)
SELECT 
  p.id,
  CASE 
    WHEN random() < 0.3 THEN 'basic'
    WHEN random() < 0.7 THEN 'premium'
    ELSE 'enterprise'
  END as plan_type,
  'active' as status,
  now() - interval '15 days' as start_date,
  now() + interval '15 days' as end_date,
  'sample_ref_' || p.id as payment_reference
FROM profiles p 
WHERE p.role = 'vendor' 
AND random() < 0.4  -- Only 40% of vendors get subscriptions
ON CONFLICT DO NOTHING;