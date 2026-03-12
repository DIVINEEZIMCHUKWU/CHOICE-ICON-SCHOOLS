import { Router, Request, Response } from 'express';
import supabase from './supabase';
import { sendAdminEmail, sendConfirmationEmail } from './email';
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

// GET /api/admin/messages - Fetch all messages (admin only)
router.get('/admin/messages', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware to verify admin
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Admin messages error:', error);
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

    // Check if cvFile is already a URL (from frontend upload to documents bucket)
    if (cvFile.startsWith('http')) {
      console.log('📋 CV is already uploaded - using provided URL');
      cvUrl = cvFile;
      console.log('🔗 Using CV URL:', cvUrl);
    } else {
      // cvFile is base64 data - upload to Supabase storage
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

      } catch (uploadError: any) {
        console.error('❌ CV upload failed:', uploadError);
        return res.status(500).json({ error: `Failed to upload CV: ${uploadError.message}` });
      }
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
      { count: admissionsCount },
      { count: announcementsCount },
      { count: enquiriesCount },
      { count: eventsCount },
      { count: blogPostsCount },
      { count: jobApplicationsCount }
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
        admissions: admissionsCount.count || 0,
        announcements: announcementsCount.count || 0,
        enquiries: enquiriesCount.count || 0,
        events: eventsCount.count || 0,
        posts: blogPostsCount.count || 0,
        jobs: jobApplicationsCount.count || 0
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

// GET /api/settings - Get general settings
router.get('/settings', async (req: Request, res: Response) => {
  try {
    console.log('⚙️ Fetching settings...');
    
    const { data, error } = await supabase
      .from('settings')
      .select('key, value');

    console.log('⚙️ Raw settings data:', data);
    console.log('⚙️ Settings error:', error);

    if (error) {
      console.error('❌ Settings fetch error:', error);
      console.log('⚙️ Table might not exist. Please run setup_admin.sql');
      // Return default settings if table doesn't exist
      const defaultSettings = {
        phone: '+234-806-9077-937 / +234-810-7601-537',
        email: 'thechoiceiconschools@gmail.com',
        address: 'ICON Avenue, off Delta State Polytechnic Road, Behind Joanchim Filling Station, Ogwashi-Uku, Delta State',
        facebook: 'https://www.facebook.com/thechoiceiconschools',
        instagram: '#',
        announcement_bar: 'Admissions Now Open for Early Years, Nursery, Primary and Secondary'
      };
      return res.status(200).json(defaultSettings);
    }

    // Convert array to object
    const settings: Record<string, string> = {};
    (data || []).forEach(item => {
      settings[item.key] = item.value;
    });

    return res.status(200).json(settings);
  } catch (error) {
    console.error('❌ Settings fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// POST /api/settings - Update general settings
router.post('/settings', async (req: Request, res: Response) => {
  try {
    console.log('⚙️ Updating settings...');
    const { key, value } = req.body;
    
    console.log('⚙️ Setting update:', { key, value });

    if (!key || value === undefined) {
      console.log('⚙️ Validation failed: Missing key or value');
      return res.status(400).json({ error: 'Key and value are required' });
    }

    // Update setting in database
    const { data, error } = await supabase
      .from('settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      })
      .select();

    console.log('⚙️ Database response:', { data, error });

    if (error) {
      console.error('❌ Settings update error:', error);
      return res.status(500).json({ error: 'Failed to update setting' });
    }

    console.log('⚙️ Setting updated successfully');
    
    return res.status(200).json({
      success: true,
      message: 'Setting updated successfully',
      data: { key, value }
    });
  } catch (error) {
    console.error('❌ Settings update error:', error);
    return res.status(500).json({ error: 'Failed to update setting' });
  }
});

// POST /api/settings/change-password - Update admin password
router.post('/settings/change-password', async (req: Request, res: Response) => {
  try {
    console.log('🔐 Password change request');
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get the current admin user
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'thechoiceiconschools@gmail.com')
      .single();

    if (fetchError || !adminUser) {
      console.error('❌ Admin user not found:', fetchError);
      return res.status(401).json({ error: 'Admin user not found' });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, adminUser.password);
    
    if (!passwordMatch) {
      console.log('❌ Current password verification failed');
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    const { data: updateData, error: updateError } = await supabase
      .from('admin_users')
      .update({ password: hashedNewPassword })
      .eq('email', 'thechoiceiconschools@gmail.com')
      .select();

    if (updateError) {
      console.error('❌ Password update error:', updateError);
      return res.status(500).json({ error: 'Failed to update password' });
    }

    console.log('✅ Password updated successfully');
    
    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('❌ Password change error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/announcements - Get all announcements for admin
router.get('/announcements', async (req: Request, res: Response) => {
  try {
    console.log('📢 Fetching announcements...');
    
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📢 Raw announcements data:', data);
    console.log('📢 Announcements error:', error);

    if (error) {
      console.error('❌ Announcements fetch error:', error);
      console.log('📢 Table might not exist. Please run setup_admin.sql');
      // Return empty array if table doesn't exist
      return res.status(200).json([]);
    }

    // Return data directly without wrapping in success object
    return res.status(200).json(data || []);
  } catch (error) {
    console.error('❌ Announcements fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST /api/announcements - Create new announcement
router.post('/announcements', async (req: Request, res: Response) => {
  try {
    console.log('📢 Creating announcement...');
    console.log('📢 Request body:', req.body);
    const { title, content, is_active } = req.body;

    if (!title || !content) {
      console.log('📢 Validation failed: Missing title or content');
      return res.status(400).json({ error: 'Title and content are required' });
    }

    console.log('📢 Inserting announcement:', { title, content, is_active });
    const { data, error } = await supabase
      .from('announcements')
      .insert([{
        title,
        content,
        is_active: is_active ? 1 : 0,
        created_at: new Date().toISOString()
      }])
      .select();

    console.log('📢 Supabase response:', { data, error });

    if (error) {
      console.error('❌ Announcement creation error:', error);
      return res.status(500).json({ error: 'Failed to create announcement' });
    }

    console.log('📢 Announcement created successfully:', data);
    return res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: data?.[0]
    });
  } catch (error) {
    console.error('❌ Announcement creation error:', error);
    return res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// PUT /api/announcements/:id - Update announcement
router.put('/announcements/:id', async (req: Request, res: Response) => {
  try {
    console.log('📢 Updating announcement...');
    const { id } = req.params;
    const { title, content, is_active } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data, error } = await supabase
      .from('announcements')
      .update({
        title,
        content,
        is_active: is_active ? 1 : 0
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Announcement update error:', error);
      return res.status(500).json({ error: 'Failed to update announcement' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('❌ Announcement update error:', error);
    return res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// DELETE /api/announcements/:id - Delete announcement
router.delete('/announcements/:id', async (req: Request, res: Response) => {
  try {
    console.log('📢 Deleting announcement...');
    const { id } = req.params;

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Announcement deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete announcement' });
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('❌ Announcement deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

// GET /api/events - Get all events for admin
router.get('/events', async (req: Request, res: Response) => {
  try {
    console.log('📅 Fetching events...');
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    console.log('📅 Raw events data:', data);
    console.log('📅 Events error:', error);

    if (error) {
      console.error('❌ Events fetch error:', error);
      console.log('📅 Table might not exist. Please run setup_admin.sql');
      // Return empty array if table doesn't exist
      return res.status(200).json([]);
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('❌ Events fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// POST /api/events - Create new event
router.post('/events', upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('📅 Creating event...');
    console.log('📅 Request body:', req.body);
    console.log('📅 Request file:', req.file);
    
    const { title, description, event_date, location } = req.body;
    
    if (!title || !description || !event_date || !location) {
      console.log('📅 Validation failed: Missing required fields');
      console.log('📅 Title:', title);
      console.log('📅 Description:', description);
      console.log('📅 Event Date:', event_date);
      console.log('📅 Location:', location);
      return res.status(400).json({ error: 'All fields are required' });
    }

    let imageUrl = '';
    
    // Handle image upload if file is provided
    if (req.file) {
      console.log('📅 Processing file upload...');
      const file = req.file;
      const timestamp = Date.now();
      const fileExt = file.originalname.split('.').pop();
      const uniqueFileName = `${timestamp}_${file.originalname}`;
      
      console.log('📅 Uploading file:', uniqueFileName);
      
      try {
        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(uniqueFileName, file.buffer, {
            contentType: file.mimetype
          });

        if (uploadError) {
          console.error('❌ Event image upload error:', uploadError);
          console.log('📅 Image upload failed, continuing without image...');
          // Continue without image - don't return error
        } else {
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('event-images')
            .getPublicUrl(uniqueFileName);

          imageUrl = publicUrlData.publicUrl;
          console.log('📅 Image uploaded successfully:', imageUrl);
        }
      } catch (storageError) {
        console.error('❌ Storage error:', storageError);
        console.log('📅 Storage not available, continuing without image...');
        // Continue without image - don't return error
      }
    }

    // Save to database
    console.log('📅 Saving to database...');
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title,
        description,
        event_date,
        location,
        image_url: imageUrl,
        created_at: new Date().toISOString()
      }])
      .select();

    console.log('📅 Database response:', { data, error });

    if (error) {
      console.error('❌ Event creation error:', error);
      return res.status(500).json({ error: 'Failed to create event: ' + error.message });
    }

    console.log('📅 Event created successfully:', data);
    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: data?.[0]
    });
  } catch (error) {
    console.error('❌ Event creation error:', error);
    return res.status(500).json({ error: 'Failed to create event' });
  }
});

// PUT /api/events/:id - Update event
router.put('/events/:id', upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('📅 Updating event...');
    const { id } = req.params;
    const { title, description, event_date, location } = req.body;

    if (!title || !description || !event_date || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let imageUrl = req.body.image_url || '';
    
    // Handle image upload if new file is provided
    if (req.file) {
      const file = req.file;
      const timestamp = Date.now();
      const fileExt = file.originalname.split('.').pop();
      const uniqueFileName = `${timestamp}_${file.originalname}`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(uniqueFileName, file.buffer, {
          contentType: file.mimetype
        });

      if (uploadError) {
        console.error('❌ Event image upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image: ' + uploadError.message });
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(uniqueFileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        event_date,
        location,
        image_url: imageUrl
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Event update error:', error);
      return res.status(500).json({ error: 'Failed to update event' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: data[0]
    });
  } catch (error) {
    console.error('❌ Event update error:', error);
    return res.status(500).json({ error: 'Failed to update event' });
  }
});

// DELETE /api/events/:id - Delete event
router.delete('/events/:id', async (req: Request, res: Response) => {
  try {
    console.log('📅 Deleting event...');
    const { id } = req.params;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Event deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete event' });
    }

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('❌ Event deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete event' });
  }
});

// GET /api/gallery - Get all gallery items for admin
router.get('/gallery', async (req: Request, res: Response) => {
  try {
    console.log('🖼️ Fetching gallery...');
    
    // Fetch both images and videos
    const [imagesData, videosData] = await Promise.all([
      supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('gallery_videos')
        .select('*')
        .order('created_at', { ascending: false })
    ]);

    if (imagesData.error || videosData.error) {
      console.error('❌ Gallery fetch error:', imagesData.error || videosData.error);
      return res.status(500).json({ error: 'Failed to fetch gallery items' });
    }

    const combinedData = [
      ...(imagesData.data || []).map(item => ({ ...item, type: 'image' })),
      ...(videosData.data || []).map(item => ({ ...item, type: 'video' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return res.status(200).json({
      success: true,
      data: combinedData
    });
  } catch (error) {
    console.error('❌ Gallery fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery items' });
  }
});

// POST /api/gallery/image - Add gallery image
router.post('/gallery/image', upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('🖼️ Adding gallery image...');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, category } = req.body;
    const file = req.file;
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.originalname.split('.').pop();
    const uniqueFileName = `${timestamp}_${file.originalname}`;
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('gallery-images')
      .upload(uniqueFileName, file.buffer, {
        contentType: file.mimetype
      });

    if (uploadError) {
      console.error('❌ Gallery image upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image: ' + uploadError.message });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(uniqueFileName);

    // Save to database
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([{
        title: title || 'Gallery Image',
        category: category || 'General',
        image_url: publicUrlData.publicUrl,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Gallery image save error:', error);
      return res.status(500).json({ error: 'Failed to save image to database' });
    }

    return res.status(201).json({
      success: true,
      message: 'Gallery image added successfully',
      data: data?.[0]
    });
  } catch (error) {
    console.error('❌ Gallery image upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
});

// POST /api/gallery/video - Add gallery video
router.post('/gallery/video', async (req: Request, res: Response) => {
  try {
    console.log('🎬 Adding gallery video...');
    const { title, url, type } = req.body;

    if (!title || !url || !type) {
      return res.status(400).json({ error: 'Title, URL, and type are required' });
    }

    const { data, error } = await supabase
      .from('gallery_videos')
      .insert([{
        title,
        url,
        type,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Gallery video save error:', error);
      return res.status(500).json({ error: 'Failed to save video to database' });
    }

    return res.status(201).json({
      success: true,
      message: 'Gallery video added successfully',
      data: data?.[0]
    });
  } catch (error) {
    console.error('❌ Gallery video error:', error);
    return res.status(500).json({ error: 'Failed to add video' });
  }
});

// DELETE /api/gallery/image/:id - Delete gallery image
router.delete('/gallery/image/:id', async (req: Request, res: Response) => {
  try {
    console.log('🖼️ Deleting gallery image...');
    const { id } = req.params;

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Gallery image deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete image' });
    }

    return res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('❌ Gallery image deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete image' });
  }
});

// DELETE /api/gallery/video/:id - Delete gallery video
router.delete('/gallery/video/:id', async (req: Request, res: Response) => {
  try {
    console.log('🎬 Deleting gallery video...');
    const { id } = req.params;

    const { error } = await supabase
      .from('gallery_videos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Gallery video deletion error:', error);
      return res.status(500).json({ error: 'Failed to delete video' });
    }

    return res.status(200).json({
      success: true,
      message: 'Gallery video deleted successfully'
    });
  } catch (error) {
    console.error('❌ Gallery video deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete video' });
  }
});

// POST /api/upload - Handle image uploads
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('📤 Uploading image...');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const bucket = req.body.bucket || 'blog-images';
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.originalname.split('.').pop();
    const uniqueFileName = `${timestamp}_${file.originalname}`;
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, file.buffer, {
        contentType: file.mimetype
      });

    if (uploadError) {
      console.error('❌ Image upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload image: ' + uploadError.message });
    }

    console.log('✅ Image uploaded successfully:', uploadData);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: publicUrlData.publicUrl
    });
  } catch (error) {
    console.error('❌ Image upload error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
