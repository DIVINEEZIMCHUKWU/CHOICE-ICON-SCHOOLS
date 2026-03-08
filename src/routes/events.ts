import express from 'express';
import db from '../db';

const router = express.Router();

// Get all events
router.get('/', (req, res) => {
  try {
    const events = db.prepare('SELECT * FROM events ORDER BY event_date ASC').all();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', (req, res) => {
  const { title, description, event_date, location, image_url } = req.body;
  
  if (!title || !event_date) {
    return res.status(400).json({ message: 'Title and date are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO events (title, description, event_date, location, image_url) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(title, description || '', event_date, location || '', image_url || '');
    res.status(201).json({ id: info.lastInsertRowid, message: 'Event created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', (req, res) => {
  const { title, description, event_date, location, image_url } = req.body;
  const { id } = req.params;

  try {
    const stmt = db.prepare('UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, image_url = ? WHERE id = ?');
    const info = stmt.run(title, description, event_date, location, image_url, id);

    if (info.changes === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
