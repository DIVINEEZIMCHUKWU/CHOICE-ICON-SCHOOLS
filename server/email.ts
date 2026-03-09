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
  type?: 'Contact' | 'Admission' | 'Career';
}

export async function sendAdminEmail(data: EmailData) {
  try {
    console.log('🔧 Preparing admin email for:', data.email);
    console.log('📧 Admin email destination:', adminEmail);
    console.log('🔑 Resend API Key configured:', !!process.env.RESEND_API_KEY);

    const typeLabel = data.type || 'Contact';
    const typeColor = data.type === 'Admission' ? '#EF4444' : data.type === 'Career' ? '#F59E0B' : '#EC4899';

    const response = await resend.emails.send({
      from: 'Choice Icon Schools <noreply@choiceiconschools.com>',
      to: adminEmail,
      replyTo: data.email,
      subject: `New ${typeLabel} Form Submission - Choice Icon Schools`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
              .wrapper { background-color: #f5f5f5; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
              .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
              .badge { display: inline-block; background-color: ${typeColor}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-top: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
              .content { padding: 30px 20px; }
              .form-section { margin-bottom: 25px; }
              .form-section h3 { color: #1e40af; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; border-bottom: 2px solid ${typeColor}; padding-bottom: 8px; }
              .field { margin-bottom: 15px; }
              .field-label { font-weight: 600; color: #1e40af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; display: block; }
              .field-value { background-color: #f9fafb; padding: 12px 15px; border-left: 4px solid ${typeColor}; border-radius: 4px; word-wrap: break-word; }
              .field-value a { color: #1e40af; text-decoration: none; }
              .field-value a:hover { text-decoration: underline; }
              .divider { border-top: 1px solid #e5e7eb; margin: 25px 0; }
              .footer { background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; }
              .footer p { margin: 5px 0; }
              .button { display: inline-block; background-color: #1e40af; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: 600; margin-top: 10px; }
              .note { font-size: 12px; color: #666; font-style: italic; text-align: center; padding: 15px; background-color: #f0f9ff; border-left: 3px solid #1e40af; margin-top: 20px; }
              table { width: 100%; border-collapse: collapse; }
              td { padding: 8px 0; }
              td:first-child { color: #1e40af; font-weight: 600; width: 35%; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; vertical-align: top; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="container">
                <div class="header">
                  <h1>Choice Icon Schools</h1>
                  <p>New Message Notification</p>
                  <div class="badge">${typeLabel} Form</div>
                </div>

                <div class="content">
                  <div class="form-section">
                    <h3>📋 Sender Information</h3>
                    <table>
                      <tr>
                        <td>Name:</td>
                        <td>${escapeHtml(data.name)}</td>
                      </tr>
                      <tr>
                        <td>Email:</td>
                        <td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
                      </tr>
                      <tr>
                        <td>Phone:</td>
                        <td><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></td>
                      </tr>
                    </table>
                  </div>

                  <div class="divider"></div>

                  <div class="form-section">
                    <h3>💬 Message</h3>
                    <div class="field-value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
                  </div>

                  <div class="note">
                    💡 Click "Reply" in your email client to respond directly to this sender
                  </div>
                </div>

                <div class="footer">
                  <p><strong>Choice Icon Schools</strong></p>
                  <p>Ogwashi-Uku, Delta State | Nigeria</p>
                  <p>© 2024 Choice Icon Schools. All rights reserved.</p>
                  <p style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 11px;">
                    This is an automated message from the school website. Please do not reply with sensitive information.
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
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

    const typeLabel = data.type || 'Contact';

    const response = await resend.emails.send({
      from: 'Choice Icon Schools <noreply@choiceiconschools.com>',
      to: data.email,
      subject: `We received your ${typeLabel} message - Choice Icon Schools`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { margin: 0; font-size: 32px; font-weight: 600; }
              .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }
              .checkmark { font-size: 48px; margin: 15px 0; }
              .content { padding: 40px 20px; }
              .content-section { margin-bottom: 30px; }
              .content-section h2 { color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 15px 0; }
              .content-section p { margin: 10px 0; line-height: 1.8; }
              .info-box { background-color: #eff6ff; border-left: 4px solid #1e40af; padding: 15px; border-radius: 4px; margin: 15px 0; }
              .contact-info { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .contact-info h3 { color: #1e40af; margin: 0 0 15px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; }
              .contact-item { margin: 12px 0; }
              .contact-item strong { color: #1e40af; display: block; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
              .contact-item a { color: #1e40af; text-decoration: none; font-weight: 600; }
              .contact-item a:hover { text-decoration: underline; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 20px 0; }
              .footer { background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
              .footer p { margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You!</h1>
                <p>Your ${typeLabel} message has been received</p>
                <div class="checkmark">✓</div>
              </div>

              <div class="content">
                <div class="content-section">
                  <h2>We've Got Your Message</h2>
                  <p>Dear ${escapeHtml(data.name)},</p>
                  <p>Thank you for reaching out to <strong>Choice Icon Schools</strong>. We have successfully received your ${typeLabel.toLowerCase()} message and truly appreciate your interest in our institution.</p>
                  <div class="info-box">
                    <strong>📋 What happens next?</strong>
                    <p>Our dedicated team will review your message and respond to you shortly. We typically reply within 24-48 hours during business days.</p>
                  </div>
                </div>

                <div class="contact-info">
                  <h3>📞 Get in Touch Directly</h3>
                  <div class="contact-item">
                    <strong>Call Us</strong>
                    <a href="tel:+234-806-9077-937">+234-806-9077-937</a> | <a href="tel:+234-810-7601-537">+234-810-7601-537</a>
                  </div>
                  <div class="contact-item">
                    <strong>WhatsApp</strong>
                    <a href="https://wa.me/2348069077937" target="_blank">Chat with us on WhatsApp</a>
                  </div>
                  <div class="contact-item">
                    <strong>Visit Us</strong>
                    <p style="margin: 4px 0;">ICON Avenue, off Delta State Polytechnic Road<br>Ogwashi-Uku, Delta State, Nigeria</p>
                  </div>
                  <div class="contact-item">
                    <strong>Website</strong>
                    <a href="https://choiceiconschools.com" target="_blank">choiceiconschools.com</a>
                  </div>
                </div>

                <div style="text-align: center; border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
                  <p style="color: #666; font-size: 13px;">If you need to reply to this message, simply reply to this email. Your message will be sent directly to our team.</p>
                </div>
              </div>

              <div class="footer">
                <p><strong>Choice Icon Schools</strong></p>
                <p>Excellence in Education | Nurturing Tomorrow's Leaders</p>
                <p>Ogwashi-Uku, Delta State | Nigeria</p>
                <p>© 2024 Choice Icon Schools. All rights reserved.</p>
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

