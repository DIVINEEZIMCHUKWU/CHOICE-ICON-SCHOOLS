import express from 'express';
import db from '../db';

const router = express.Router();

// Get all media files
router.get('/', (req, res) => {
  try {
    const media = db.prepare('SELECT * FROM media_links ORDER BY created_at DESC').all();
    res.json(media);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add media file
router.post('/', (req, res) => {
  const { title, url, type } = req.body;
  
  if (!title || !url || !type) {
    return res.status(400).json({ message: 'Title, URL and type are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO media_links (title, url, type) VALUES (?, ?, ?)');
    const info = stmt.run(title, url, type);
    
    res.status(201).json({ id: info.lastInsertRowid, message: 'Media file added' });
  } catch (error) {
    console.error('Error adding media file:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete media file
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM media_links WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ message: 'Media file not found' });
    }

    res.json({ message: 'Media file deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
