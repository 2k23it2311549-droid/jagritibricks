-- Create site_content table for CMS
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access" ON site_content FOR SELECT USING (true);

-- Allow authenticated users (admins) to insert/update/delete
CREATE POLICY "Admin full access" ON site_content FOR ALL USING (
  auth.role() = 'authenticated'
) WITH CHECK (
  auth.role() = 'authenticated'
);

-- Insert default data
INSERT INTO site_content (section, key, value, type) VALUES
('hero', 'title_1', 'Build Stronger.', 'text'),
('hero', 'subtitle_1', 'Build Smarter.', 'text'),
('hero', 'image_1', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1920', 'image'),
('announcement', 'text', 'Factory-Direct Pricing • Save up to 30%', 'text')
ON CONFLICT (section, key) DO NOTHING;
