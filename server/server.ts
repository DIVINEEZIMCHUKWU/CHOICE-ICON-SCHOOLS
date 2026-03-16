import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import formRoutes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware
app.use(cors({
  origin: [
    "https://choiceiconschools.com",
    "https://www.choiceiconschools.com",
    "http://localhost:3000",
    "http://localhost:3001"
  ],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Make upload middleware available to routes
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// API Routes
app.use('/api', formRoutes);

// Base API route
app.get('/api', (req, res) => {
  res.json({
    status: "ok",
    message: "Choice Icon Schools API is running"
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(' CHOICE ICON SCHOOLS API SERVER');
  console.log('========================================');
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`📧 Admin email configured: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔑 Resend API Key: ${process.env.RESEND_API_KEY ? 'Configured ✓' : 'NOT SET ❌'}`);
  console.log(`🗄️  Supabase URL: ${process.env.SUPABASE_URL ? 'Configured ✓' : 'NOT SET ❌'}`);
  console.log('========================================\n');
});
