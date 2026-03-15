import { Router, Request, Response } from 'express';
import supabase from './supabase.js';
import { sendAdminEmail, sendConfirmationEmail } from './email.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Use a strong, unique key in production

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface CareerFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  cvUrl?: string;
}

// POST /api/contact - Handle contact form submissions
router.post('/contact', async (req: Request, res: Response) => {
  try {
    console.log('📝 Contact form received:', { name: req.body.name, email: req.body.email });
    const { name, email, phone, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      console.log('❌ Validation failed: missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to Supabase
    console.log('💾 Saving to Supabase enquiries table...');
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name,
          email,
          phone,
          message,
          type: 'Contact',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to save message to database' });
    }

    console.log('✅ Saved to Supabase:', data);

    // Send emails
    try {
      console.log('📧 Sending admin email to:', process.env.ADMIN_EMAIL);
      await sendAdminEmail({ name, email, phone, message, type: 'Contact' });
      console.log('✅ Admin email sent');

      console.log('📧 Sending confirmation email to:', email);
      await sendConfirmationEmail({ name, email, phone, message, type: 'Contact' });
      console.log('✅ Confirmation email sent');
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
      // Still return success since the message was saved
    }

    return res.status(201).json({
      success: true,
      message: 'Your message has been received',
      data,
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admission - Handle admission form submissions
router.post('/admission', async (req: Request, res: Response) => {
  try {
    console.log('📝 Admission form received:', { name: req.body.name, email: req.body.email });
    const { name, email, phone, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      console.log('❌ Validation failed: missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to Supabase (same table or custom one)
    console.log('💾 Saving to Supabase enquiries table...');
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name,
          email,
          phone,
          message: `ADMISSION INQUIRY: ${message}`,
          type: 'Admission',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to save message to database' });
    }

    console.log('✅ Saved to Supabase:', data);

    // Send emails
    try {
      console.log('📧 Sending admin email to:', process.env.ADMIN_EMAIL);
      await sendAdminEmail({ name, email, phone, message: `ADMISSION INQUIRY: ${message}`, type: 'Admission' });
      console.log('✅ Admin email sent');

      console.log('📧 Sending confirmation email to:', email);
      await sendConfirmationEmail({ name, email, phone, message, type: 'Admission' });
      console.log('✅ Confirmation email sent');
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Your admission inquiry has been received',
      data,
    });
  } catch (error) {
    console.error('❌ Admission form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/feedback - Handle feedback/complaints form submissions
router.post('/feedback', async (req: Request, res: Response) => {
  try {
    console.log('📝 Feedback form received:', { name: req.body.name, email: req.body.email });
    const { name, email, phone, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !phone || !message) {
      console.log('❌ Validation failed: missing required fields');
      return res.status(400).json({ error: 'Name, phone, and message are required' });
    }

    // Save to Supabase (same table or custom one)
    console.log('💾 Saving to Supabase enquiries table...');
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name,
          email: email || null,
          phone,
          message: `FEEDBACK/COMPLAINT: ${message}`,
          type: 'Feedback',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to save message to database' });
    }

    console.log('✅ Saved to Supabase:', data);

    // Send emails
    try {
      console.log('📧 Sending admin email to:', process.env.ADMIN_EMAIL);
      await sendAdminEmail({ name, email: email || '', phone, message: `FEEDBACK/COMPLAINT: ${message}`, type: 'Contact' });
      console.log('✅ Admin email sent');

      if (email) {
        console.log('📧 Sending confirmation email to:', email);
        await sendConfirmationEmail({ name, email, phone, message, type: 'Contact' });
        console.log('✅ Confirmation email sent');
      }
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Your feedback has been received',
      data,
    });
  } catch (error) {
    console.error('❌ Feedback form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/career - Handle career/job application submissions
router.post('/career', async (req: Request, res: Response) => {
  try {
    console.log('📝 Career form received:', { name: req.body.name, email: req.body.email });
    const { name, email, phone, message, cvUrl }: CareerFormData = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      console.log('❌ Validation failed: missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to Supabase
    console.log('💾 Saving to Supabase enquiries table...');
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name,
          email,
          phone,
          message: `CAREER APPLICATION: ${message}`,
          type: 'Career',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to save application to database' });
    }

    console.log('✅ Saved to Supabase:', data);

    // Send emails
    try {
      console.log('📧 Sending admin email to:', process.env.ADMIN_EMAIL);
      await sendAdminEmail({ name, email, phone, message: `CAREER APPLICATION: ${message}`, type: 'Career', cvUrl });
      console.log('✅ Admin email sent');

      console.log('📧 Sending confirmation email to:', email);
      await sendConfirmationEmail({ name, email, phone, message, type: 'Career' });
      console.log('✅ Confirmation email sent');
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Your career application has been received',
      data,
    });
  } catch (error) {
    console.error('❌ Career form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/career-upload - Handle career form with file upload
router.post('/career-upload', async (req: Request, res: Response) => {
  try {
    console.log('📝 Career upload request received');

    const { email, name, phone, gender, maritalStatus, dob, qualification, address, cvFileName, cvFile } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !gender || !maritalStatus || !dob || !qualification || !address) {
      console.log('❌ Validation failed: missing required fields');
      console.log('Received:', { name, email, phone, gender, maritalStatus, dob, qualification, address });
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!cvFileName || !cvFile) {
      console.log('❌ CV file not provided');
      return res.status(400).json({ error: 'CV file is required' });
    }

    let cvUrl = '';

    // Upload CV to Supabase storage
    try {
      console.log('📁 Uploading CV to Supabase storage...');

      // Check if bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'career_cvs');

      if (!bucketExists) {
        console.log('🪣 Creating career_cvs bucket...');
        const { error: createError } = await supabase.storage.createBucket('career_cvs', {
          public: true,
          allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          fileSizeLimit: 5242880 // 5MB
        });

        if (createError) {
          console.error('❌ Bucket creation error:', createError);
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
      }

      // Set up public access policy using SQL
      try {
        console.log('🔐 Setting up public access policy...');
        const { error: policyError } = await supabase.rpc('exec_sql', {
          sql: `
            -- Drop existing policies if they exist
            DROP POLICY IF EXISTS "Public Access" ON storage.objects;
            DROP POLICY IF EXISTS "Allow Insert" ON storage.objects;
            DROP POLICY IF EXISTS "Allow Update" ON storage.objects;
            DROP POLICY IF EXISTS "Allow Select" ON storage.objects;

            -- Create new policies for public access
            CREATE POLICY "Public Access" ON storage.objects
            FOR SELECT USING (bucket_id = 'career_cvs');

            CREATE POLICY "Allow Insert" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'career_cvs');

            CREATE POLICY "Allow Update" ON storage.objects
            FOR UPDATE USING (bucket_id = 'career_cvs');

            CREATE POLICY "Allow Select" ON storage.objects
            FOR SELECT USING (bucket_id = 'career_cvs');
          `
        });

        if (policyError) {
          console.log('⚠️ Policy setup note:', policyError.message);
        } else {
          console.log('✅ Public access policies set up successfully');
        }
      } catch (policyErr: any) {
        console.log('⚠️ Policy setup failed, continuing anyway:', policyErr.message);
      }

      // Convert base64 to buffer
      const base64Data = cvFile.replace(/^data:application\/(pdf|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|msword);base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${cvFileName}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('career_cvs')
        .upload(uniqueFileName, buffer, {
          contentType: cvFileName.endsWith('.pdf') ? 'application/pdf' :
                       cvFileName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                       'application/msword',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ CV upload error:', uploadError);
        throw new Error(`Failed to upload CV: ${uploadError.message}`);
      }

      console.log('✅ CV uploaded successfully:', uploadData);

      // Get public URL (more reliable than signed URL for email links)
      const { data: publicUrlData } = supabase.storage
        .from('career_cvs')
        .getPublicUrl(uniqueFileName);

      cvUrl = publicUrlData.publicUrl;
      console.log('🔗 CV public URL generated:', cvUrl);

      // Also create signed URL as backup (valid for 7 days)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('career_cvs')
        .createSignedUrl(uniqueFileName, 60 * 60 * 24 * 7); // 7 days

      if (signedUrlError) {
        console.log('⚠️ Signed URL creation failed, using public URL:', signedUrlError.message);
      } else {
        console.log('🔗 CV signed URL also generated as backup');
      }

    } catch (uploadError: any) {
      console.error('❌ CV upload failed:', uploadError);
      return res.status(500).json({ error: `Failed to upload CV: ${uploadError.message}` });
    }

    const applicationDetails = `
Gender: ${gender}
Marital Status: ${maritalStatus}
Date of Birth: ${dob}
Qualification: ${qualification}
Address: ${address}
CV File: ${cvFileName}
    `.trim();

    console.log('💾 Saving career application to database...');
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name,
          email,
          phone,
          message: `CAREER APPLICATION: ${applicationDetails}`,
          type: 'Career',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Failed to save application to database' });
    }

    console.log('✅ Application saved to database');

    // Send emails
    try {
      console.log('📧 Sending admin email...');
      await sendAdminEmail({
        name,
        email,
        phone,
        message: `CAREER APPLICATION: ${applicationDetails}`,
        type: 'Career',
        cvUrl,
      });
      console.log('✅ Admin email sent');

      console.log('📧 Sending confirmation email...');
      await sendConfirmationEmail({
        name,
        email,
        phone,
        message: applicationDetails,
        type: 'Career',
      });
      console.log('✅ Confirmation email sent');
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Your career application has been received successfully',
      data,
      cvUrl,
    });
  } catch (error) {
    console.error('❌ Career upload error:', error);
    return res.status(500).json({ error: 'Failed to process application' });
  }
});

// POST /api/auth/login - Handle admin authentication
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    console.log('🔐 Admin login attempt:', { email: req.body.email });
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('❌ Validation failed: missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check admin user in Supabase
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return res.status(401).json({
        error: 'Invalid email or password',
        message: 'Login failed. Please check your credentials.'
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, adminUser.password);

    if (!passwordMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({
        error: 'Invalid email or password',
        message: 'Login failed. Please check your credentials.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: adminUser.id,
        email: adminUser.email,
        name: 'Admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Admin login successful');

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: 'Admin'
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me - Verify token and get user info
router.get('/auth/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(200).json({
      user: {
        id: decoded.id,
        email: decoded.email,
        name: 'Admin'
      }
    });
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// GET /api/stats - Get dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    console.log('📊 Fetching dashboard stats...');

    // Fetch data from all tables
    const [
      admissionsResult,
      announcementsResult,
      enquiriesResult,
      eventsResult,
      blogPostsResult,
      jobApplicationsResult
    ] = await Promise.all([
      supabase.from('admissions').select('*', { count: 'exact', head: true }),
      supabase.from('announcements').select('*', { count: 'exact', head: true }),
      supabase.from('enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabase.from('job_applications').select('*', { count: 'exact', head: true })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        admissions: admissionsResult.count || 0,
        announcements: announcementsResult.count || 0,
        enquiries: enquiriesResult.count || 0,
        events: eventsResult.count || 0,
        posts: blogPostsResult.count || 0,
        jobs: jobApplicationsResult.count || 0
      }
    });
  } catch (error) {
    console.error('❌ Stats fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/enquiries - Get all enquiries for admin
router.get('/enquiries', async (req: Request, res: Response) => {
  try {
    console.log('📝 Fetching enquiries...');
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Enquiries fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch enquiries' });
    }

    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('❌ Enquiries fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// DELETE /api/enquiries/:id - Delete enquiry
router.delete('/enquiries/:id', async (req: Request, res: Response) => {
  try {
    console.log('📝 Deleting enquiry...');
    const { id } = req.params;

    const { error } = await supabase
      .from('enquiries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Enquiry deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete enquiry' });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    console.error('❌ Enquiry deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

// GET /api/admissions - Get all admissions for admin
router.get('/admissions', async (req: Request, res: Response) => {
  try {
    console.log('🎓 Fetching admissions...');
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('🎓 Supabase response:', { data, error });

    if (error) {
      console.error('❌ Admissions fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch admissions', details: error.message });
    }

    console.log('✅ Admissions fetched successfully:', data?.length || 0, 'records');
    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('❌ Admissions fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch admissions', details: error.message });
  }
});

// PUT /api/admissions/:id - Update admission status
router.put('/admissions/:id', async (req: Request, res: Response) => {
  try {
    console.log('🎓 Updating admission status...');
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const { data, error } = await supabase
      .from('admissions')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Admission update error:', error);
      return res.status(500).json({ error: 'Failed to update admission' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Admission updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('❌ Admission update error:', error);
    return res.status(500).json({ error: 'Failed to update admission' });
  }
});

// DELETE /api/admissions/:id - Delete admission
router.delete('/admissions/:id', async (req: Request, res: Response) => {
  try {
    console.log('🎓 Deleting admission...');
    const { id } = req.params;

    const { error } = await supabase
      .from('admissions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Admission deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete admission' });
    }

    return res.status(200).json({
      success: true,
      message: 'Admission deleted successfully'
    });
  } catch (error) {
    console.error('❌ Admission deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete admission' });
  }
});

// GET /api/jobs - Get all job applications for admin
router.get('/jobs', async (req: Request, res: Response) => {
  try {
    console.log('💼 Fetching job applications...');
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Jobs fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch job applications' });
    }

    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('❌ Jobs fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch job applications' });
  }
});

// GET /api/blog - Get all blog posts for admin
router.get('/blog', async (req: Request, res: Response) => {
  try {
    console.log('📝 Fetching blog posts...');
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Blog posts fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }

    return res.status(200).json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('❌ Blog posts fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// POST /api/blog - Create new blog post
router.post('/blog', async (req: Request, res: Response) => {
  try {
    console.log('📝 Creating blog post...');
    const { title, category, excerpt, content, image_url, additional_images } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        title,
        category: category || 'General',
        excerpt: excerpt || '',
        content,
        image_url: image_url || '',
        additional_images: additional_images || [],
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Blog post creation error:', error);
      return res.status(500).json({ error: 'Failed to create blog post' });
    }

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: data?.[0]
    });
  } catch (error) {
    console.error('❌ Blog post creation error:', error);
    return res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// PUT /api/blog/:id - Update blog post
router.put('/blog/:id', async (req: Request, res: Response) => {
  try {
    console.log('📝 Updating blog post...');
    const { id } = req.params;
    const { title, category, excerpt, content, image_url, additional_images } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title,
        category: category || 'General',
        excerpt: excerpt || '',
        content,
        image_url: image_url || '',
        additional_images: additional_images || []
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Blog post update error:', error);
      return res.status(500).json({ error: 'Failed to update blog post' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('❌ Blog post update error:', error);
    return res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// DELETE /api/blog/:id - Delete blog post
router.delete('/blog/:id', async (req: Request, res: Response) => {
  try {
    console.log('📝 Deleting blog post...');
    const { id } = req.params;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Blog post deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete blog post' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('❌ Blog post deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;
