import express from 'express';
import { Resend } from 'resend';

const router = express.Router();

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn('RESEND_API_KEY environment variable is missing');
    }
    // Initialize with key or a dummy string to prevent crash if missing
    resendClient = new Resend(key || 'missing_key');
  }
  return resendClient;
}

router.post('/send', async (req, res) => {
  try {
    const resend = getResend();
    const SCHOOL_EMAIL = (process.env.SCHOOL_EMAIL || 'achukaonyi@gmail.com').replace(/['"]/g, '');

    const { formType, data } = req.body;

    let subject = '';
    let content = '';
    let parentEmail = data.email;
    let parentName = data.name || data.fullName || `${data.firstName} ${data.surname}`;
    let parentPhone = data.phone;

    // Format WhatsApp link
    const whatsappLink = parentPhone ? `https://wa.me/${parentPhone.replace(/[^0-9]/g, '')}` : '';

    // INLINE STYLES FOR EMAIL CLIENT COMPATIBILITY (Replies/Forwards)
    const s = {
      body: "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333;",
      container: "max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #f9fafb;",
      header: "background-color: #0B1B3D; color: #ffffff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;",
      h1: "margin: 0; font-size: 24px;",
      content: "background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #eaeaea; border-top: none;",
      field: "margin-bottom: 15px;",
      label: "font-weight: bold; color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;",
      value: "margin-top: 4px; font-size: 15px; color: #111;",
      footer: "margin-top: 20px; text-align: center; font-size: 12px; color: #888;",
      badge: "display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px;",
      btn: "display: inline-block; background-color: #25D366; color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 14px; margin-top: 5px;"
    };

    const fieldHtml = (label: string, value: string, customValueStyle: string = '') => `
      <div style="${s.field}">
        <div style="${s.label}">${label}</div>
        <div style="${s.value} ${customValueStyle}">${value}</div>
      </div>
    `;

    const buildEmail = (badgeStyle: string, badgeText: string, fields: string) => `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"></head>
        <body style="${s.body}">
          <div style="${s.container}">
            <div style="${s.header}">
              <h1 style="${s.h1}">Choice Icon Schools</h1>
            </div>
            <div style="${s.content}">
              <span style="${s.badge} ${badgeStyle}">${badgeText}</span>
              ${fields}
            </div>
            <div style="${s.footer}">This email was automatically generated from the Choice Icon Schools website.</div>
          </div>
        </body>
      </html>
    `;

    if (formType === 'Admission') {
      subject = 'New Admission Enquiry - Choice Icon Schools';
      content = buildEmail(
        "background-color: #e0f2fe; color: #0284c7;",
        "Admission Enquiry",
        fieldHtml("Applicant Name", parentName) +
        fieldHtml("Phone Number", `${parentPhone} <br/><a href="${whatsappLink}" style="${s.btn}">Chat on WhatsApp</a>`) +
        fieldHtml("Email Address", parentEmail) +
        fieldHtml("Reason", data.reason) +
        fieldHtml("How they heard about us", `${data.source} ${data.referralName ? `(${data.referralName})` : ''} ${data.otherSource ? `(${data.otherSource})` : ''}`) +
        fieldHtml("Additional Notes", data.note, "background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #0B1B3D;")
      );
    } else if (formType === 'Contact') {
      subject = 'New Website Contact Message - Choice Icon Schools';
      content = buildEmail(
        "background-color: #fce7f3; color: #db2777;",
        "Contact Form Message",
        fieldHtml("Sender Name", parentName) +
        fieldHtml("Phone Number", `${parentPhone} <br/><a href="${whatsappLink}" style="${s.btn}">Chat on WhatsApp</a>`) +
        fieldHtml("Email Address", parentEmail) +
        fieldHtml("Message", data.message, "background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #db2777;")
      );
    } else if (formType === 'Job') {
      subject = `New Job Application: ${data.surname} ${data.firstName} - Choice Icon Schools`;
      content = buildEmail(
        "background-color: #f3e8ff; color: #9333ea;",
        "Job Application",
        fieldHtml("Applicant Name", parentName) +
        fieldHtml("Phone Number", `${parentPhone} <br/><a href="${whatsappLink}" style="${s.btn}">Chat on WhatsApp</a>`) +
        fieldHtml("Email Address", parentEmail) +
        fieldHtml("Position", data.position || 'General Application') +
        fieldHtml("Applicant Details", data.coverLetter, "background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #9333ea; white-space: pre-line;") +
        fieldHtml("Resume / CV", `<a href="${data.cvUrl}" style="display: inline-block; background: #0B1B3D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Download CV (PDF)</a>`)
      );
    } else if (formType === 'General') {
      subject = 'New Feedback / General Enquiry - Choice Icon Schools';
      content = buildEmail(
        "background-color: #dcfce7; color: #16a34a;",
        "Feedback / General Enquiry",
        fieldHtml("Sender Name", parentName) +
        fieldHtml("Phone Number", `${parentPhone} <br/><a href="${whatsappLink}" style="${s.btn}">Chat on WhatsApp</a>`) +
        fieldHtml("Email Address", parentEmail) +
        fieldHtml("Message", data.message, "background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #16a34a;")
      );
    }

    // 1. Send email to School
    const { data: schoolData, error: schoolError } = await resend.emails.send({
      from: 'Choice Icon Schools <info@choiceiconschools.com>',
      to: SCHOOL_EMAIL,
      replyTo: parentEmail,
      subject: subject,
      html: content,
    });

    if (schoolError) {
      console.error('Resend API Error (School Email):', schoolError);
      return res.status(400).json({ error: schoolError.message });
    }

    // 2. Send confirmation email to Parent
    if (parentEmail) {
      const { error: confirmError } = await resend.emails.send({
        from: 'Choice Icon Schools <info@choiceiconschools.com>',
        to: parentEmail,
        subject: 'We have received your submission - Choice Icon Schools',
        html: `
          <!DOCTYPE html>
          <html>
            <head><meta charset="utf-8"></head>
            <body style="${s.body}">
              <div style="${s.container}">
                <div style="${s.header}">
                  <h1 style="${s.h1}">Choice Icon Schools</h1>
                </div>
                <div style="${s.content}">
                  <p style="margin-top: 0;">Dear <strong style="color: #0B1B3D;">${parentName}</strong>,</p>
                  <p>Thank you for reaching out to Choice Icon Schools.</p>
                  <p>We have successfully received your submission and our team will get back to you shortly.</p>
                  <br/>
                  <p style="${s.label}">Your Details:</p>
                  <p style="${s.value}">Phone: ${parentPhone} <br/><br/><a href="${whatsappLink}" style="${s.btn}">Chat on WhatsApp</a></p>
                  <br/>
                  <p style="margin-bottom: 0;">Best Regards,</p>
                  <p style="margin-top: 4px;"><strong style="color: #0B1B3D;">Choice Icon Schools</strong></p>
                </div>
                <div style="${s.footer}">This is an automated message. Please do not reply directly to this email.</div>
              </div>
            </body>
          </html>
        `,
      });
      
      if (confirmError) {
        console.error('Error sending confirmation email:', confirmError);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
