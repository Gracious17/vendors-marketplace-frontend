/*
  # Add currency preference to user profiles

  1. Changes
    - Add currency column to profiles table with default 'USD'
    - Add check constraint to ensure only 'USD' or 'NGN' values

  2. Security
    - Maintain existing RLS policies
*/

-- Add currency column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'currency'
  ) THEN
    ALTER TABLE profiles ADD COLUMN currency text DEFAULT 'USD' CHECK (currency IN ('USD', 'NGN'));
  END IF;
END $$;

-- Update existing profiles to have USD as default currency
UPDATE profiles SET currency = 'USD' WHERE currency IS NULL;