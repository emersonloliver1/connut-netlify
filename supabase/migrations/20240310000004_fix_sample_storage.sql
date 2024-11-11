-- Update storage bucket policies
DO $$
BEGIN
    -- Drop existing policies
    DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
    DROP POLICY IF EXISTS "Allow authenticated downloads" ON storage.objects;
    
    -- Create new policies
    CREATE POLICY "Allow authenticated uploads"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'sample-photos' AND
        auth.uid() = owner
    );

    CREATE POLICY "Allow authenticated downloads"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'sample-photos'
    );
END $$;