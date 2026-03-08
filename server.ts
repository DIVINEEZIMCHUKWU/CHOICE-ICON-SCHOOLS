import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './src/routes/auth';
import admissionRoutes from './src/routes/admissions';
import enquiryRoutes from './src/routes/enquiries';
import galleryRoutes from './src/routes/gallery';
import statsRoutes from './src/routes/stats';
import jobRoutes from './src/routes/jobs';
import announcementRoutes from './src/routes/announcements';
import eventRoutes from './src/routes/events';
import mediaRoutes from './src/routes/media';
import settingRoutes from './src/routes/settings';
import { initDb } from './src/db';
import { authMiddleware } from './src/middleware/auth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB
  initDb();

  // Middleware
  app.use(cors({
    origin: true, // Reflect request origin
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admissions', admissionRoutes);
  app.use('/api/enquiries', enquiryRoutes);
  app.use('/api/gallery', galleryRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/settings', authMiddleware, settingRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
