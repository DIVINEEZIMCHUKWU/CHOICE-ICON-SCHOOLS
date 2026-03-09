import { Router, Request, Response } from 'express';
import supabase from './supabase';
import { sendAdminEmail, sendConfirmationEmail } from './email';

const router = Router();

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
    const { name, email, phone, message }: CareerFormData = req.body;

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
      await sendAdminEmail({ name, email, phone, message: `CAREER APPLICATION: ${message}`, type: 'Career' });
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

export default router;
