-- Run this SQL in your Supabase SQL Editor to create the admin_users table

-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user with password "Choiceicon123" (hashed)
INSERT INTO admin_users (email, password) 
VALUES ('thechoiceiconschools@gmail.com', '$2a$12$RRAJREbvFykwNEXzs3N41OMWL5Jr6WjgA69Tu/SWRUcIFyehcoP6S')
ON CONFLICT (email) DO NOTHING;

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Verify the admin user was created
SELECT * FROM admin_users WHERE email = 'thechoiceiconschools@gmail.com';
