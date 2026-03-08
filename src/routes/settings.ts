import express from 'express';
import db from '../db';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all settings
router.get('/', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update setting
router.post('/', (req, res) => {
  const { key, value } = req.body;
  
  if (!key) {
    return res.status(400).json({ message: 'Key is required' });
  }

  try {
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    stmt.run(key, value || '');
    res.json({ message: 'Setting updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = (req as any).user?.id; // Assuming user is attached via auth middleware

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }

  try {
    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(hashedPassword, adminId);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
