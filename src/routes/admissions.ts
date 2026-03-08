import express from 'express';
import db from '../db';
import { sendAdmissionEmail } from '../services/email';

const router = express.Router();

// Get all admissions
router.get('/', (req, res) => {
  try {
    const admissions = db.prepare('SELECT * FROM admissions ORDER BY created_at DESC').all();
    res.json(admissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit admission enquiry
router.post('/', async (req, res) => {
  const { applicant_name, phone, message, email } = req.body;
  
  if (!applicant_name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required' });
  }

  try {
    // Save to database first
    const stmt = db.prepare('INSERT INTO admissions (applicant_name, phone, message) VALUES (?, ?, ?)');
    const info = stmt.run(applicant_name, phone, message || '');
    
    // Send email notification
    try {
      await sendAdmissionEmail({
        name: applicant_name,
        phone: phone,
        message: message || 'No additional message provided',
        email: email || undefined
      });
      console.log('Admission email notification sent successfully');
    } catch (emailError) {
      console.error('Failed to send admission email:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({ id: info.lastInsertRowid, message: 'Admission enquiry submitted' });
  } catch (error) {
    console.error('Error submitting admission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update status
router.put('/:id', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const stmt = db.prepare('UPDATE admissions SET status = ? WHERE id = ?');
    const info = stmt.run(status, id);

    if (info.changes === 0) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete admission
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const stmt = db.prepare('DELETE FROM admissions WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ message: 'Admission not found' });
    }

    res.json({ message: 'Admission deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
