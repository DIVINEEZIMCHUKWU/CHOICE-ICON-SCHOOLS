import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import routes from './api/routes.js';

dotenv.config();

const app = express();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Make upload middleware available to routes
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// API Routes
app.use('/api', routes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root path handler
app.get('/', (req, res) => {
  res.json({
    message: 'Choice Icon Schools API Server',
    status: 'running',
    api_endpoints: {
      health: '/api/health',
      contact: 'POST /api/contact',
      admission: 'POST /api/admission',
      feedback: 'POST /api/feedback',
      career: 'POST /api/career-upload',
      auth: {
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      admin: {
        stats: 'GET /api/stats',
        enquiries: 'GET /api/enquiries',
        admissions: 'GET /api/admissions',
        jobs: 'GET /api/jobs',
        blog: 'GET /api/blog'
      }
    },
    frontend_url: 'https://your-truehost-frontend-url.com',
    note: 'Frontend is deployed separately on Truehost'
  });
});

export default app;
