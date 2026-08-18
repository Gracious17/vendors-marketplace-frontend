/*
  # Add profile image support and storage bucket

  1. New Features
    - Add profile_image column to profiles table
    - Add profile_image column to vendor_profiles table
    - Create storage bucket for vendor profile images
    - Set up storage policies for secure image access

  2. Security
    - Vendors can upload/update/delete their own images
    - Public read access for profile images
    - Proper folder structure based on user ID
*/

-- Add profile_image column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profile_image'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_image text;
  END IF;
END $$;

-- Add profile_image column to vendor_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vendor_profiles' AND column_name = 'profile_image'
  ) THEN
    ALTER TABLE vendor_profiles ADD COLUMN profile_image text;
  END IF;
END $$;

-- Create storage bucket for vendor profile images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'vendor-profiles'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'vendor-profiles',
      'vendor-profiles',
      true,
      5242880, -- 5MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;
END $$;

-- Storage policies for vendor-profiles bucket
DO $$
BEGIN
  -- Policy for uploading images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Vendors can upload their own profile images'
  ) THEN
    CREATE POLICY "Vendors can upload their own profile images"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'vendor-profiles' AND
        auth.uid()::text = (string_to_array(name, '/'))[1]
      );
  END IF;

  -- Policy for updating images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Vendors can update their own profile images'
  ) THEN
    CREATE POLICY "Vendors can update their own profile images"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'vendor-profiles' AND
        auth.uid()::text = (string_to_array(name, '/'))[1]
      );
  END IF;

  -- Policy for deleting images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Vendors can delete their own profile images'
  ) THEN
    CREATE POLICY "Vendors can delete their own profile images"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'vendor-profiles' AND
        auth.uid()::text = (string_to_array(name, '/'))[1]
      );
  END IF;

  -- Policy for viewing images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view profile images'
  ) THEN
    CREATE POLICY "Anyone can view profile images"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'vendor-profiles');
  END IF;
END $$;