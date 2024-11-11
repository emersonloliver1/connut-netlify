-- Create sample_collections table
CREATE TABLE sample_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    client_id UUID REFERENCES clients NOT NULL,
    meal_name TEXT NOT NULL,
    collection_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    responsible TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_sample_collections_user_id ON sample_collections(user_id);
CREATE INDEX idx_sample_collections_client_id ON sample_collections(client_id);
CREATE INDEX idx_sample_collections_date ON sample_collections(collection_date);

-- Enable RLS
ALTER TABLE sample_collections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sample collections"
    ON sample_collections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sample collections"
    ON sample_collections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sample collections"
    ON sample_collections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sample collections"
    ON sample_collections FOR DELETE
    USING (auth.uid() = user_id);