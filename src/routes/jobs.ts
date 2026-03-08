import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../db';
import { sendJobApplicationEmail } from '../services/email';

const router = express.Router();

// Configure multer for CVs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads/cvs';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  }
});

// Get all job applications
router.get('/', (req, res) => {
  try {
    const applications = db.prepare('SELECT * FROM job_applications ORDER BY created_at DESC').all();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit job application
router.post('/', upload.single('cv'), async (req, res) => {
  const { full_name, email, phone, position, cover_letter } = req.body;
  const cv_url = req.file ? `/uploads/cvs/${req.file.filename}` : null;

  if (!full_name || !email || !position) {
    return res.status(400).json({ message: 'Name, email and position are required' });
  }

  try {
    // Save to database first
    const stmt = db.prepare('INSERT INTO job_applications (full_name, email, phone, position, cover_letter, cv_url) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(full_name, email, phone || '', position, cover_letter || '', cv_url);
    
    // Send email notification
    try {
      await sendJobApplicationEmail({
        name: full_name,
        email: email,
        phone: phone,
        position: position,
        coverLetter: cover_letter,
        cvUrl: cv_url ? `${process.env.APP_URL || 'http://localhost:3000'}${cv_url}` : undefined
      });
      console.log('Job application email notification sent successfully');
    } catch (emailError) {
      console.error('Failed to send job application email:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting job application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete application
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const app = db.prepare('SELECT cv_url FROM job_applications WHERE id = ?').get(id) as { cv_url: string };
    
    if (app && app.cv_url) {
      const filePath = path.join(process.cwd(), 'public', app.cv_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const stmt = db.prepare('DELETE FROM job_applications WHERE id = ?');
    stmt.run(id);

    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
