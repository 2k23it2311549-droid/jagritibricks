-- Run this in your Supabase SQL Editor

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT FALSE;

-- Update the existing row to ensure it has a value
UPDATE public.site_settings 
SET maintenance_mode = FALSE 
WHERE id = 1;
