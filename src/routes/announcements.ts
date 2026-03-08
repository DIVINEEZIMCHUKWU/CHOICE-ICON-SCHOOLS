import express from 'express';
import db from '../db';

const router = express.Router();

// Get all announcements
router.get('/', (req, res) => {
  try {
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC').all();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create announcement
router.post('/', (req, res) => {
  const { title, content, is_active } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO announcements (title, content, is_active) VALUES (?, ?, ?)');
    const info = stmt.run(title, content, is_active === undefined ? 1 : is_active);
    res.status(201).json({ id: info.lastInsertRowid, message: 'Announcement created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update announcement
router.put('/:id', (req, res) => {
  const { title, content, is_active } = req.body;
  const { id } = req.params;

  try {
    const stmt = db.prepare('UPDATE announcements SET title = ?, content = ?, is_active = ? WHERE id = ?');
    const info = stmt.run(title, content, is_active, id);

    if (info.changes === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete announcement
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM announcements WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
