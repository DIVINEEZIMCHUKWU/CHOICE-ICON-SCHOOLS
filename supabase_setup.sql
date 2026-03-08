-- Enable necessary extensions (if needed later)
create extension if not exists "uuid-ossp";

-- 1. Blog Posts Table
create table public.blog_posts (
  id integer generated always as identity primary key,
  title text not null,
  category text,
  date date default current_date,
  excerpt text,
  content text,
  image_url text,
  additional_images text[], -- Array of image URLs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Gallery Images Table
create table public.gallery_images (
  id integer generated always as identity primary key,
  title text,
  category text,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Gallery Videos Table
create table public.gallery_videos (
  id integer generated always as identity primary key,
  title text,
  url text not null,
  type text check (type in ('youtube', 'googledrive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Admissions Table
create table public.admissions (
  id integer generated always as identity primary key,
  applicant_name text not null,
  phone text,
  message text,
  status text default 'New',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Enquiries Table
create table public.enquiries (
  id integer generated always as identity primary key,
  name text not null,
  phone text,
  email text,
  message text,
  type text, -- e.g., 'General', 'Admission', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Events Table
create table public.events (
  id integer generated always as identity primary key,
  title text not null,
  description text,
  event_date date,
  location text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Announcements Table
create table public.announcements (
  id integer generated always as identity primary key,
  title text not null,
  content text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Job Applications Table
create table public.job_applications (
  id integer generated always as identity primary key,
  full_name text not null,
  email text,
  phone text,
  position text,
  cover_letter text,
  cv_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table public.blog_posts enable row level security;
alter table public.gallery_images enable row level security;
alter table public.gallery_videos enable row level security;
alter table public.admissions enable row level security;
alter table public.enquiries enable row level security;
alter table public.events enable row level security;
alter table public.announcements enable row level security;
alter table public.job_applications enable row level security;

-- Policies

-- Public Read Access (Content that is visible to everyone)
create policy "Public can view blog posts" on public.blog_posts for select using (true);
create policy "Public can view gallery images" on public.gallery_images for select using (true);
create policy "Public can view gallery videos" on public.gallery_videos for select using (true);
create policy "Public can view events" on public.events for select using (true);
create policy "Public can view active announcements" on public.announcements for select using (is_active = true);

-- Public Insert Access (Forms)
create policy "Public can submit admissions" on public.admissions for insert with check (true);
create policy "Public can submit enquiries" on public.enquiries for insert with check (true);
create policy "Public can submit job applications" on public.job_applications for insert with check (true);

-- Admin Access (Full access for authenticated users - assuming admins are authenticated)
-- Note: For a real production app, you might want a specific 'admin' role check.
-- For now, we allow any authenticated user to manage content.
create policy "Authenticated users can manage blog posts" on public.blog_posts for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage gallery images" on public.gallery_images for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage gallery videos" on public.gallery_videos for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage admissions" on public.admissions for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage enquiries" on public.enquiries for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage events" on public.events for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage announcements" on public.announcements for all using (auth.role() = 'authenticated');
create policy "Authenticated users can manage job applications" on public.job_applications for all using (auth.role() = 'authenticated');

-- Storage Buckets Setup (You may need to create these manually in the dashboard if this script doesn't run in the SQL editor context correctly for storage)
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('gallery-images', 'gallery-images', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', true) on conflict do nothing; -- For CVs/Resumes

-- Storage Policies
create policy "Public can view blog images" on storage.objects for select using (bucket_id = 'blog-images');
create policy "Public can view gallery images" on storage.objects for select using (bucket_id = 'gallery-images');
create policy "Authenticated users can upload blog images" on storage.objects for insert with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');
create policy "Authenticated users can upload gallery images" on storage.objects for insert with check (bucket_id = 'gallery-images' and auth.role() = 'authenticated');
create policy "Public can upload documents" on storage.objects for insert with check (bucket_id = 'documents'); -- For job applicants
create policy "Authenticated users can view documents" on storage.objects for select using (bucket_id = 'documents' and auth.role() = 'authenticated');
