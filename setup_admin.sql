-- Create admin_users table for production-ready authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert your admin user with the provided hash
INSERT INTO admin_users (email, password) 
VALUES ('thechoiceiconschools@gmail.com', '$2a$12$RRAJREbvFykwNEXzs3N41OMWL5Jr6WjgA69Tu/SWRUcIFyehcoP6S');

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for announcements
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for events
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC);

-- Create settings table for dynamic content management
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('phone', '+234-806-9077-937 / +234-810-7601-537'),
  ('email', 'thechoiceiconschools@gmail.com'),
  ('address', 'ICON Avenue, off Delta State Polytechnic Road, Behind Joanchim Filling Station, Ogwashi-Uku, Delta State'),
  ('facebook', 'https://www.facebook.com/thechoiceiconschools'),
  ('instagram', '#'),
  ('announcement_bar', 'Admissions Now Open for Early Years, Nursery, Primary and Secondary'),
  ('hero_title', 'Nurturing the Next Generation of Global Icons'),
  ('hero_subtitle', 'An Institution with a mandate to steer our young ones away from moral and intellectual decadence.')
ON CONFLICT (key) DO NOTHING;

-- Create index for settings
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Optional: Create additional admin users if needed
-- INSERT INTO admin_users (email, password) VALUES ('another_admin@example.com', '$2b$12$another_hash_here');
