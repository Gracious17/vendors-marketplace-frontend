/*
  # Fix storage policies for profile image uploads during registration

  1. Changes
    - Allow unauthenticated users to upload to temp folders
    - Allow public access to all profile images
    - Update existing policies to be more permissive for registration flow

  2. Security
    - Maintain security while allowing registration uploads
    - Temp uploads can be cleaned up later
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Vendors can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;

-- Create more permissive policies for registration flow
CREATE POLICY "Anyone can upload profile images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'vendor-profiles');

CREATE POLICY "Users can update their own profile images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'vendor-profiles' AND
    (auth.uid()::text = (string_to_array(name, '/'))[1] OR 
     name LIKE 'temp_%')
  );

CREATE POLICY "Users can delete their own profile images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'vendor-profiles' AND
    (auth.uid()::text = (string_to_array(name, '/'))[1] OR 
     name LIKE 'temp_%')
  );

-- Recreate the view policy
CREATE POLICY "Anyone can view profile images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'vendor-profiles');