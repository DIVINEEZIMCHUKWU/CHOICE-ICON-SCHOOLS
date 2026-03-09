import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'thechoiceiconschools@gmail.com';

interface EmailData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function sendAdminEmail(data: EmailData) {
  try {
    console.log('🔧 Preparing admin email for:', data.email);
    console.log('📧 Admin email destination:', adminEmail);
    console.log('🔑 Resend API Key configured:', !!process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: 'Choice Icon Schools <noreply@choiceiconschools.com>',
      to: adminEmail,
      replyTo: data.email,
      subject: 'New Website Form Submission',
      html: `
        <h2>New Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log('✅ Admin email sent successfully. Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending admin email:', error);
    throw error;
  }
}

export async function sendConfirmationEmail(data: EmailData) {
  try {
    console.log('🔧 Preparing confirmation email for:', data.email);

    const response = await resend.emails.send({
      from: 'Choice Icon Schools <noreply@choiceiconschools.com>',
      to: data.email,
      subject: 'We received your message - Choice Icon Schools',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 5px; }
              .content { padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
              .closing { padding: 20px; text-align: center; color: #666; font-size: 14px; }
              .contact-info { margin: 15px 0; }
              .contact-info a { color: #1e40af; text-decoration: none; }
              .contact-info a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You!</h1>
              </div>
              <div class="content">
                <p>Dear ${escapeHtml(data.name)},</p>
                <p>Thank you for reaching out to Choice Icon Schools. We have received your message and appreciate your interest in our institution.</p>
                <p>We will review your inquiry and get back to you as soon as possible.</p>
                <div class="contact-info">
                  <p><strong>Choice Icon Schools</strong></p>
                  <p>Phone: <a href="tel:+234800000000">+234 800 000 0000</a></p>
                  <p>WhatsApp: <a href="https://wa.me/234800000000">Chat with us on WhatsApp</a></p>
                  <p>Website: <a href="https://choiceiconschools.com">Visit our website</a></p>
                </div>
              </div>
              <div class="closing">
                <p>&copy; 2024 Choice Icon Schools. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log('✅ Confirmation email sent successfully. Response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    throw error;
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
