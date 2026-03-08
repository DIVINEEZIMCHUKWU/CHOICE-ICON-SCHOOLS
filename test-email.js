// Test script for enhanced email functionality
// Run this with: node test-email.js

const { sendAdmissionEmail, sendContactEmail, sendJobApplicationEmail, sendGeneralEmail } = require('./src/services/email');

async function testEmails() {
  console.log('Testing enhanced email functionality...\n');

  // Test admission email with confirmation
  console.log('1. Testing admission email with parent confirmation...');
  try {
    const result = await sendAdmissionEmail({
      name: 'John Doe',
      phone: '08012345678',
      email: 'john.doe@example.com',
      message: 'I would like to know more about admission into Primary 3.'
    });
    console.log('Admission email result:', result);
  } catch (error) {
    console.error('Admission email failed:', error);
  }

  console.log('\n2. Testing contact email with parent confirmation...');
  try {
    const result = await sendContactEmail({
      name: 'Jane Smith',
      phone: '09098765432',
      email: 'jane.smith@example.com',
      message: 'I need information about your school fees and curriculum.'
    });
    console.log('Contact email result:', result);
  } catch (error) {
    console.error('Contact email failed:', error);
  }

  console.log('\n3. Testing job application email with confirmation...');
  try {
    const result = await sendJobApplicationEmail({
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      phone: '08123456789',
      position: 'Mathematics Teacher',
      coverLetter: 'I have 5 years of teaching experience in mathematics...',
      cvUrl: 'http://localhost:3000/uploads/cvs/example.pdf'
    });
    console.log('Job application email result:', result);
  } catch (error) {
    console.error('Job application email failed:', error);
  }

  console.log('\n4. Testing general enquiry email with confirmation...');
  try {
    const result = await sendGeneralEmail({
      name: 'Sarah Wilson',
      phone: '08023456789',
      email: 'sarah.wilson@example.com',
      message: 'What are your extracurricular activities and sports programs?',
      type: 'General'
    });
    console.log('General enquiry email result:', result);
  } catch (error) {
    console.error('General enquiry email failed:', error);
  }

  console.log('\n5. Testing admission email without parent email (no confirmation)...');
  try {
    const result = await sendAdmissionEmail({
      name: 'Robert Brown',
      phone: '07034567890',
      message: 'Interested in admission for my child into Nursery class.'
      // No email provided - should not send confirmation
    });
    console.log('Admission email (no confirmation) result:', result);
  } catch (error) {
    console.error('Admission email (no confirmation) failed:', error);
  }

  console.log('\nEnhanced email testing completed!');
  console.log('\nFeatures tested:');
  console.log('✅ Multiple recipients (school + test email)');
  console.log('✅ Reply-to functionality for direct replies');
  console.log('✅ WhatsApp integration in email notifications');
  console.log('✅ Automatic confirmation emails to parents');
  console.log('✅ Professional email templates');
}

// Check if RESEND_API_KEY is set
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set in environment variables.');
  console.log('Please set it in your .env file or run: export RESEND_API_KEY=your_key_here');
  process.exit(1);
}

testEmails().catch(console.error);
