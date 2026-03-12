-- Update existing admin user with the correct password hash
UPDATE admin_users 
SET password = '$2a$12$RRAJREbvFykwNEXzs3N41OMWL5Jr6WjgA69Tu/SWRUcIFyehcoP6S'
WHERE email = 'thechoiceiconschools@gmail.com';

-- Verify the update
SELECT * FROM admin_users WHERE email = 'thechoiceiconschools@gmail.com';
