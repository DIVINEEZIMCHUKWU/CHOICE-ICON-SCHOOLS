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

// POST /api/contact - Handle contact form submissions
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone,
          message,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save message' });
    }

    // Send emails
    try {
      await sendAdminEmail({ name, email, phone, message });
      await sendConfirmationEmail({ name, email, phone, message });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Still return success since the message was saved
    }

    return res.status(201).json({
      success: true,
      message: 'Your message has been received',
      data,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admission - Handle admission form submissions
router.post('/admission', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to Supabase (same table or custom one)
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name,
          email,
          phone,
          message: `ADMISSION INQUIRY: ${message}`,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save message' });
    }

    // Send emails
    try {
      await sendAdminEmail({ name, email, phone, message: `ADMISSION INQUIRY: ${message}` });
      await sendConfirmationEmail({ name, email, phone, message });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Your admission inquiry has been received',
      data,
    });
  } catch (error) {
    console.error('Admission form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/messages - Fetch all messages (admin only)
router.get('/admin/messages', async (req: Request, res: Response) => {
  try {
    // TODO: Add authentication middleware to verify admin
    const { data, error } = await supabase
      .from('contact_messages')
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

export default router;
