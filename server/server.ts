import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import formRoutes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api', formRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 CHOICE ICON SCHOOLS API SERVER');
  console.log('========================================');
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📧 Admin email configured: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔑 Resend API Key: ${process.env.RESEND_API_KEY ? 'Configured ✓' : 'NOT SET ❌'}`);
  console.log(`🗄️  Supabase URL: ${process.env.SUPABASE_URL ? 'Configured ✓' : 'NOT SET ❌'}`);
  console.log('========================================\n');
});
