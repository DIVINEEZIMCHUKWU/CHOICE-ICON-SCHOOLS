import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../db';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'public/uploads/gallery';
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  }
});

// Get all gallery images
router.get('/', (req, res) => {
  try {
    const images = db.prepare('SELECT * FROM gallery_images ORDER BY created_at DESC').all();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const { title, category } = req.body;
  const image_url = `/uploads/gallery/${req.file.filename}`;

  try {
    const stmt = db.prepare('INSERT INTO gallery_images (title, category, image_url) VALUES (?, ?, ?)');
    const info = stmt.run(title || 'Untitled', category || 'General', image_url);
    
    res.status(201).json({ 
      id: info.lastInsertRowid, 
      image_url, 
      title, 
      category,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete image
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const image = db.prepare('SELECT image_url FROM gallery_images WHERE id = ?').get(id) as { image_url: string };
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const stmt = db.prepare('DELETE FROM gallery_images WHERE id = ?');
    stmt.run(id);

    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
