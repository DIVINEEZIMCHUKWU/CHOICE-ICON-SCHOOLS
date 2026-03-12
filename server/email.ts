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
  cvUrl?: string;
}

export async function sendAdminEmail(data: EmailData) {
  try {
    console.log('🔧 Preparing admin email for:', data.email);
    console.log('📧 Admin email destination:', adminEmail);
    console.log('�🔑 Resend API Key configured:', !!process.env.RESEND_API_KEY);
    console.log('📝 Email content preview:', {
      name: data.name,
      phone: data.phone,
      message: data.message.substring(0, 100) + '...',
      type: data.type
    });

    const typeLabel = data.type || 'Contact';
    const typeColor = data.type === 'Admission' ? '#EF4444' : data.type === 'Career' ? '#F59E0B' : '#EC4899';

    const response = await resend.emails.send({
      from: 'Choice Icon Schools <info@choiceiconschools.com>',
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
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; line-height: 1.6 !important; color: #333 !important; margin: 0 !important; padding: 0 !important; background-color: #f5f5f5 !important; }
              .wrapper { background-color: #f5f5f5 !important; padding: 20px !important; }
              .container { max-width: 600px !important; margin: 0 auto !important; background-color: #ffffff !important; border-radius: 8px !important; overflow: hidden !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important; color: white !important; padding: 30px 20px !important; text-align: center !important; }
              .header h1 { margin: 0 !important; font-size: 28px !important; font-weight: 600 !important; }
              .header p { margin: 5px 0 0 0 !important; font-size: 14px !important; opacity: 0.9 !important; }
              .badge { display: inline-block !important; background-color: ${typeColor} !important; color: white !important; padding: 6px 16px !important; border-radius: 20px !important; font-size: 12px !important; font-weight: 600 !important; margin-top: 10px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; }
              .content { padding: 30px 20px !important; }
              .form-section { margin-bottom: 25px !important; }
              .form-section h3 { color: #1e40af !important; font-size: 14px !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; margin: 0 0 10px 0 !important; border-bottom: 2px solid ${typeColor} !important; padding-bottom: 8px !important; }
              .field { margin-bottom: 15px !important; }
              .field-label { font-weight: 600 !important; color: #1e40af !important; font-size: 12px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; margin-bottom: 5px !important; display: block !important; }
              .field-value { background-color: #f9fafb !important; padding: 12px 15px !important; border-left: 4px solid ${typeColor} !important; border-radius: 4px !important; word-wrap: break-word !important; word-break: break-word !important; overflow-wrap: break-word !important; }
              .field-value a { color: #1e40af !important; text-decoration: none !important; word-break: break-word !important; }
              .field-value a:hover { text-decoration: underline !important; }
              .divider { border-top: 1px solid #e5e7eb !important; margin: 25px 0 !important; }
              .footer { background-color: #f3f4f6 !important; padding: 20px !important; text-align: center !important; border-top: 1px solid #e5e7eb !important; font-size: 12px !important; color: #666 !important; }
              .footer p { margin: 5px 0 !important; }
              .button { display: inline-block !important; background-color: #1e40af !important; color: white !important; padding: 10px 20px !important; border-radius: 4px !important; text-decoration: none !important; font-weight: 600 !important; margin-top: 10px !important; }
              .note { font-size: 12px !important; color: #666 !important; font-style: italic !important; text-align: center !important; padding: 15px !important; background-color: #f0f9ff !important; border-left: 3px solid #1e40af !important; margin-top: 20px !important; }
              table { width: 100% !important; border-collapse: collapse !important; table-layout: fixed !important; }
              td { padding: 8px 0 !important; word-break: break-word !important; overflow-wrap: break-word !important; }
              td:first-child { color: #1e40af !important; font-weight: 600 !important; width: 35% !important; text-transform: uppercase !important; font-size: 11px !important; letter-spacing: 0.5px !important; vertical-align: top !important; }
              td:last-child { width: 65% !important; word-break: break-word !important; }
              a { word-break: break-word !important; }
              .reply-section { background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 20px !important; margin-top: 20px !important; }
              .reply-section h4 { color: #1e40af !important; margin: 0 0 10px 0 !important; font-size: 16px !important; }
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

                  ${
                    data.cvUrl
                      ? `
                  <div class="divider"></div>
                  <div class="form-section">
                    <h3>📄 Curriculum Vitae</h3>
                    <div style="text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                      <a href="${escapeHtml(data.cvUrl)}" style="display: inline-block; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
                        📥 Download CV
                      </a>
                    </div>
                  </div>
                  `
                      : ''
                  }

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
      from: 'Choice Icon Schools <info@choiceiconschools.com>',
      to: data.email,
      subject: `We received your ${typeLabel} message - Choice Icon Schools`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important; line-height: 1.6 !important; color: #333 !important; margin: 0 !important; padding: 0 !important; background-color: #f5f5f5 !important; }
              .container { max-width: 600px !important; margin: 0 auto !important; padding: 20px !important; background-color: #ffffff !important; }
              .header { background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important; color: white !important; padding: 40px 20px !important; text-align: center !important; border-radius: 8px 8px 0 0 !important; }
              .header h1 { margin: 0 !important; font-size: 32px !important; font-weight: 600 !important; }
              .header p { margin: 10px 0 0 0 !important; font-size: 16px !important; opacity: 0.95 !important; }
              .checkmark { font-size: 48px !important; margin: 15px 0 !important; }
              .content { padding: 40px 20px !important; }
              .content-section { margin-bottom: 30px !important; }
              .content-section h2 { color: #1e40af !important; font-size: 18px !important; font-weight: 600 !important; margin: 0 0 15px 0 !important; }
              .content-section p { margin: 10px 0 !important; line-height: 1.8 !important; }
              .info-box { background-color: #eff6ff !important; border-left: 4px solid #1e40af !important; padding: 15px !important; border-radius: 4px !important; margin: 15px 0 !important; }
              .contact-info { background-color: #f0f9ff !important; padding: 20px !important; border-radius: 8px !important; margin: 20px 0 !important; }
              .contact-info h3 { color: #1e40af !important; margin: 0 0 15px 0 !important; font-size: 14px !important; font-weight: 600 !important; text-transform: uppercase !important; }
              .contact-item { margin: 12px 0 !important; }
              .contact-item strong { color: #1e40af !important; display: block !important; font-size: 12px !important; text-transform: uppercase !important; margin-bottom: 4px !important; }
              .contact-item a { color: #1e40af !important; text-decoration: none !important; font-weight: 600 !important; }
              .contact-item a:hover { text-decoration: underline !important; }
              .cta-button { display: inline-block !important; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%) !important; color: white !important; padding: 12px 30px !important; border-radius: 6px !important; text-decoration: none !important; font-weight: 600 !important; margin: 20px 0 !important; }
              .footer { background-color: #f3f4f6 !important; padding: 20px !important; text-align: center !important; border-radius: 0 0 8px 8px !important; font-size: 12px !important; color: #666 !important; }
              .footer p { margin: 5px 0 !important; }
              .reply-section { background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; border-radius: 8px !important; padding: 20px !important; margin-top: 20px !important; }
              .reply-section h4 { color: #1e40af !important; margin: 0 0 10px 0 !important; font-size: 16px !important; }
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

