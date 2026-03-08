import express from 'express';
import db from '../db';

const router = express.Router();

// Get all enquiries
router.get('/', (req, res) => {
  try {
    const enquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC').all();
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit enquiry
router.post('/', (req, res) => {
  const { name, phone, email, message, type } = req.body;
  
  if (!name || !message) {
    return res.status(400).json({ message: 'Name and message are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO enquiries (name, phone, email, message, type) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, phone || '', email || '', message, type || 'General');
    
    res.status(201).json({ id: info.lastInsertRowid, message: 'Enquiry submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete enquiry
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM enquiries WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
