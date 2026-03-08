import { Resend } from 'resend';

const SCHOOL_EMAILS = [
  'divinetonyezimchukwu@gmail.com' // Testing recipient only
];
const FROM_EMAIL = 'notifications@choiceiconschools.com';

export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

// Initialize Resend only when needed
const getResendInstance = () => {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set in environment variables');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export const sendEmail = async (data: EmailData) => {
  const resend = getResendInstance();
  if (!resend) {
    console.error('Resend is not initialized. Make sure RESEND_API_KEY is set and running in server environment.');
    return { success: false, error: 'Email service not available' };
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(data.to) ? data.to : [data.to],
      subject: data.subject,
      html: data.html,
      replyTo: data.replyTo,
    });

    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error };
  }
};

// WhatsApp link generator
const generateWhatsAppLink = (phone: string, message?: string) => {
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};

// Email templates
export const emailTemplates = {
  admission: (data: { name: string; phone: string; message: string; email?: string }) => ({
    subject: 'New Admission Enquiry — Choice Icon Schools Website',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Choice Icon Schools</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">New Admission Enquiry Submitted</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Admission Enquiry Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Name:</p>
            <p style="margin: 0 0 20px; color: #6b7280;">${data.name}</p>
            
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Phone:</p>
            <p style="margin: 0 0 10px; color: #6b7280;">${data.phone}</p>
            <a href="${generateWhatsAppLink(data.phone, 'Hello! I received your admission enquiry from Choice Icon Schools website. How can I help you?')}" 
               style="display: inline-block; background: #25D366; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; margin-bottom: 20px; font-weight: bold;">
               📱 Chat on WhatsApp
            </a>
            
            ${data.email ? `
            <p style="margin: 20px 0 10px; font-weight: bold; color: #374151;">Email:</p>
            <p style="margin: 0 0 20px; color: #6b7280;">${data.email}</p>
            ` : ''}
            
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Message:</p>
            <p style="margin: 0 0 20px; color: #6b7280; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Submitted from: <strong>Choice Icon Schools Website</strong>
            </p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">
              ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Choice Icon Schools. All rights reserved.</p>
        </div>
      </div>
    `,
    replyTo: data.email || undefined
  }),

  admissionConfirmation: (data: { name: string; phone: string }) => ({
    subject: 'Your Admission Enquiry - Choice Icon Schools',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Choice Icon Schools</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Thank You for Your Admission Enquiry</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Dear ${data.name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
              Thank you for your interest in Choice Icon Schools! We have received your admission enquiry and our admissions team will contact you shortly.
            </p>
            
            <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              • Our admissions team will review your enquiry<br>
              • We'll contact you within 24-48 hours<br>
              • We'll provide information about admission requirements<br>
              • We'll schedule a school visit if needed
            </p>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #1e3a8a; font-weight: bold;">Need immediate assistance?</p>
              <p style="margin: 5px 0; color: #6b7280;">Call us: +234-806-9077-937 / +234-810-7601-537</p>
              <p style="margin: 5px 0 0; color: #6b7280;">Email: thechoiceiconschools@gmail.com</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #16a34a;">
              <strong>We look forward to welcoming you to the Icon Family!</strong>
            </p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Choice Icon Schools. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  contact: (data: { name: string; phone?: string; email?: string; message: string }) => ({
    subject: 'New Website Enquiry — Choice Icon Schools Website',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Choice Icon Schools</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">New Website Enquiry Submitted</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Enquiry Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Name:</p>
            <p style="margin: 0 0 20px; color: #6b7280;">${data.name}</p>
            
            ${data.phone ? `
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Phone:</p>
            <p style="margin: 0 0 10px; color: #6b7280;">${data.phone}</p>
            <a href="${generateWhatsAppLink(data.phone, 'Hello! I received your enquiry from Choice Icon Schools website. How can I help you?')}" 
               style="display: inline-block; background: #25D366; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; margin-bottom: 20px; font-weight: bold;">
               📱 Chat on WhatsApp
            </a>
            ` : ''}
            
            ${data.email ? `
            <p style="margin: 20px 0 10px; font-weight: bold; color: #374151;">Email:</p>
            <p style="margin: 0 0 20px; color: #6b7280;">${data.email}</p>
            ` : ''}
            
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Message:</p>
            <p style="margin: 0 0 20px; color: #6b7280; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Submitted from: <strong>Choice Icon Schools Website</strong>
            </p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">
              ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Choice Icon Schools. All rights reserved.</p>
        </div>
      </div>
    `,
    replyTo: data.email || undefined
  }),

  contactConfirmation: (data: { name: string; phone?: string }) => ({
    subject: 'Your Enquiry - Choice Icon Schools',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Choice Icon Schools</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Thank You for Your Enquiry</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Dear ${data.name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
              Thank you for contacting Choice Icon Schools! We have received your enquiry and our team will get back to you shortly.
            </p>
            
            <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              • Our team will review your enquiry<br>
              • We'll respond within 24-48 hours<br>
              • We'll provide the information you requested<br>
              • We'll guide you through next steps
            </p>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #1e3a8a; font-weight: bold;">Need immediate assistance?</p>
              <p style="margin: 5px 0; color: #6b7280;">Call us: +234-806-9077-937 / +234-810-7601-537</p>
              <p style="margin: 5px 0 0; color: #6b7280;">Email: thechoiceiconschools@gmail.com</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #16a34a;">
              <strong>We look forward to assisting you!</strong>
            </p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Choice Icon Schools. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  jobApplication: (data: { name: string; email: string; phone?: string; position: string; coverLetter?: string; cvUrl?: string }) => ({
    subject: 'New Job Application Submitted — Choice Icon Schools Website',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Choice Icon Schools</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">New Job Application Submitted</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Application Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Applicant Name:</p>
            <p style="margin: 0 0 20px; color: #6b7280;">${data.name}</p>
            
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Email:</p>
            <p style="margin: 0 0 10px; color: #6b7280;">${data.email}</p>
            
            ${data.phone ? `
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Phone:</p>
            <p style="margin: 0 0 10px; color: #6b7280;">${data.phone}</p>
            <a href="${generateWhatsAppLink(data.phone, 'Hello! I received your job application from Choice Icon Schools website. How can I help you?')}" 
               style="display: inline-block; background: #25D366; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; margin-bottom: 20px; font-weight: bold;">
               📱 Chat on WhatsApp
            </a>
            ` : ''}
            
            <p style="margin: 20px 0 10px; font-weight: bold; color: #374151;">Position:</p>
            <p style="margin: 0 0 20px; color: #6b7280;">${data.position}</p>
            
            ${data.coverLetter ? `
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Cover Letter:</p>
            <p style="margin: 0 0 20px; color: #6b7280; white-space: pre-wrap;">${data.coverLetter}</p>
            ` : ''}
            
            ${data.cvUrl ? `
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">CV:</p>
            <p style="margin: 0 0 20px;">
              <a href="${data.cvUrl}" style="color: #3b82f6; text-decoration: none; background: #eff6ff; padding: 8px 16px; border-radius: 6px;" target="_blank">📄 View CV</a>
            </p>
            ` : ''}
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Submitted from: <strong>Choice Icon Schools Website</strong>
            </p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">
              ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Choice Icon Schools. All rights reserved.</p>
        </div>
      </div>
    `,
    replyTo: data.email
  }),

  jobApplicationConfirmation: (data: { name: string; position: string }) => ({
    subject: 'Your Job Application - Choice Icon Schools',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Choice Icon Schools</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Thank You for Your Job Application</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Dear ${data.name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
              Thank you for your interest in joining the Choice Icon Schools team! We have received your application for the <strong>${data.position}</strong> position.
            </p>
            
            <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              • Our HR team will review your application<br>
              • Shortlisted candidates will be contacted within 5-7 business days<br>
              • We'll schedule interviews for qualified candidates<br>
              • All applications will be kept on file for future opportunities
            </p>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #1e3a8a; font-weight: bold;">Questions about your application?</p>
              <p style="margin: 5px 0; color: #6b7280;">Call us: +234-806-9077-937 / +234-810-7601-537</p>
              <p style="margin: 5px 0 0; color: #6b7280;">Email: thechoiceiconschools@gmail.com</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #16a34a;">
              <strong>We appreciate your interest in joining our mission!</strong>
            </p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Choice Icon Schools. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  general: (data: { name: string; phone?: string; email?: string; message: string; type?: string }) => ({
    subject: `New ${data.type || 'General'} Enquiry — Choice Icon Schools Website`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Choice Icon Schools</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">New ${data.type || 'General'} Enquiry Submitted</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Enquiry Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Name:</p>
            <p style="margin: 0 0 20px; color: #6b7280;">${data.name}</p>
            
            ${data.phone ? `
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Phone:</p>
            <p style="margin: 0 0 10px; color: #6b7280;">${data.phone}</p>
            <a href="${generateWhatsAppLink(data.phone, 'Hello! I received your enquiry from Choice Icon Schools website. How can I help you?')}" 
               style="display: inline-block; background: #25D366; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; margin-bottom: 20px; font-weight: bold;">
               📱 Chat on WhatsApp
            </a>
            ` : ''}
            
            ${data.email ? `
            <p style="margin: 20px 0 10px; font-weight: bold; color: #374151;">Email:</p>
            <p style="margin: 0 0 20px; color: #6b7280;">${data.email}</p>
            ` : ''}
            
            <p style="margin: 0 0 10px; font-weight: bold; color: #374151;">Message:</p>
            <p style="margin: 0 0 20px; color: #6b7280; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Submitted from: <strong>Choice Icon Schools Website</strong>
            </p>
            <p style="margin: 5px 0 0; font-size: 12px; color: #9ca3af;">
              ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Choice Icon Schools. All rights reserved.</p>
        </div>
      </div>
    `,
    replyTo: data.email || undefined
  }),

  generalConfirmation: (data: { name: string; type?: string }) => ({
    subject: `Your ${data.type || 'General'} Enquiry - Choice Icon Schools`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Choice Icon Schools</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Thank You for Your Enquiry</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Dear ${data.name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
              Thank you for contacting Choice Icon Schools! We have received your ${data.type || 'general'} enquiry and our team will respond shortly.
            </p>
            
            <p style="margin: 0 0 15px; color: #374151; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              • Our team will review your enquiry<br>
              • We'll respond within 24-48 hours<br>
              • We'll provide the information you need<br>
              • We'll guide you through next steps
            </p>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #1e3a8a; font-weight: bold;">Need immediate assistance?</p>
              <p style="margin: 5px 0; color: #6b7280;">Call us: +234-806-9077-937 / +234-810-7601-537</p>
              <p style="margin: 5px 0 0; color: #6b7280;">Email: thechoiceiconschools@gmail.com</p>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #16a34a;">
              <strong>We look forward to assisting you!</strong>
            </p>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
          <p style="margin: 0;">© 2024 Choice Icon Schools. All rights reserved.</p>
        </div>
      </div>
    `
  })
};

export const sendAdmissionEmail = async (data: { name: string; phone: string; message: string; email?: string }) => {
  const template = emailTemplates.admission(data);
  const result = await sendEmail({
    to: SCHOOL_EMAILS,
    subject: template.subject,
    html: template.html,
    replyTo: template.replyTo
  });

  // Send confirmation to parent if email provided
  if (data.email) {
    try {
      const confirmationTemplate = emailTemplates.admissionConfirmation({ name: data.name, phone: data.phone });
      await sendEmail({
        to: data.email,
        subject: confirmationTemplate.subject,
        html: confirmationTemplate.html
      });
      console.log('Admission confirmation email sent to parent');
    } catch (confirmationError) {
      console.error('Failed to send admission confirmation email:', confirmationError);
    }
  }

  return result;
};

export const sendContactEmail = async (data: { name: string; phone?: string; email?: string; message: string }) => {
  const template = emailTemplates.contact(data);
  const result = await sendEmail({
    to: SCHOOL_EMAILS,
    subject: template.subject,
    html: template.html,
    replyTo: template.replyTo
  });

  // Send confirmation to parent if email provided
  if (data.email) {
    try {
      const confirmationTemplate = emailTemplates.contactConfirmation({ name: data.name, phone: data.phone });
      await sendEmail({
        to: data.email,
        subject: confirmationTemplate.subject,
        html: confirmationTemplate.html
      });
      console.log('Contact confirmation email sent to parent');
    } catch (confirmationError) {
      console.error('Failed to send contact confirmation email:', confirmationError);
    }
  }

  return result;
};

export const sendJobApplicationEmail = async (data: { name: string; email: string; phone?: string; position: string; coverLetter?: string; cvUrl?: string }) => {
  const template = emailTemplates.jobApplication(data);
  const result = await sendEmail({
    to: SCHOOL_EMAILS,
    subject: template.subject,
    html: template.html,
    replyTo: template.replyTo
  });

  // Send confirmation to applicant
  try {
    const confirmationTemplate = emailTemplates.jobApplicationConfirmation({ name: data.name, position: data.position });
    await sendEmail({
      to: data.email,
      subject: confirmationTemplate.subject,
      html: confirmationTemplate.html
    });
    console.log('Job application confirmation email sent to applicant');
  } catch (confirmationError) {
    console.error('Failed to send job application confirmation email:', confirmationError);
  }

  return result;
};

export const sendGeneralEmail = async (data: { name: string; phone?: string; email?: string; message: string; type?: string }) => {
  const template = emailTemplates.general(data);
  const result = await sendEmail({
    to: SCHOOL_EMAILS,
    subject: template.subject,
    html: template.html,
    replyTo: template.replyTo
  });

  // Send confirmation to parent if email provided
  if (data.email) {
    try {
      const confirmationTemplate = emailTemplates.generalConfirmation({ name: data.name, type: data.type });
      await sendEmail({
        to: data.email,
        subject: confirmationTemplate.subject,
        html: confirmationTemplate.html
      });
      console.log('General enquiry confirmation email sent to parent');
    } catch (confirmationError) {
      console.error('Failed to send general enquiry confirmation email:', confirmationError);
    }
  }

  return result;
};
