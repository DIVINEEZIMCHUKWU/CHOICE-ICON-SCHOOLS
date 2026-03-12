// Simple email test script
// Run this with: node email-test.js

const { sendAdminEmail } = require('./server/email.js');

async function testEmail() {
  try {
    console.log('🧪 Testing email sending...');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+234-123-456-7890',
      message: 'This is a test message to verify email sending is working properly. The form submission system should send this to both the school email and the test email.',
      type: 'Contact'
    };
    
    const result = await sendAdminEmail(testData);
    console.log('🎉 Test successful! Email sent to:');
    console.log('   📧 School: thechoiceiconschools@gmail.com');
    console.log('   📧 Test: divinetonyezimchukwu@gmail.com');
    console.log('📋 Check your inbox for the email!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmail();
