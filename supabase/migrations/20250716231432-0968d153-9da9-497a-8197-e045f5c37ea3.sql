-- Create settings table for storing system configurations
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings (only developers can access)
CREATE POLICY "Only developers can read settings"
ON public.settings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'developer'
  )
);

CREATE POLICY "Only developers can insert settings"
ON public.settings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'developer'
  )
);

CREATE POLICY "Only developers can update settings"
ON public.settings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'developer'
  )
);

-- Create trigger for timestamp updates
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (setting_key, setting_value, description, category) VALUES
('theme_primary_color', '"#ef4444"', 'Primary color for the application theme', 'theme'),
('theme_dark_mode', 'false', 'Enable dark mode by default', 'theme'),
('theme_compact_mode', 'false', 'Enable compact mode for UI elements', 'theme'),
('system_auto_backup', 'true', 'Enable automatic daily backups', 'system'),
('system_maintenance_mode', 'false', 'Enable maintenance mode to block user access', 'system'),
('system_debug_mode', 'false', 'Enable detailed logging for debugging', 'system'),
('system_log_level', '"info"', 'System logging level', 'system')
ON CONFLICT (setting_key) DO NOTHING;