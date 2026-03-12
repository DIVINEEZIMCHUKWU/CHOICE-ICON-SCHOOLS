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
