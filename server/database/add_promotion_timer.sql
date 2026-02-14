-- Ensure unique constraint exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_content_section_key_key') THEN
        ALTER TABLE site_content ADD CONSTRAINT site_content_section_key_key UNIQUE (section, key);
    END IF;
END $$;

-- Add promotion timer to site_content
INSERT INTO site_content (section, key, value, type) VALUES
('announcement', 'promotion_ends_at', '', 'datetime')
ON CONFLICT (section, key) DO UPDATE SET type = 'datetime';
