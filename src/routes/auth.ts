import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'choiceicon-secret-key';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email) as any;

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Required for SameSite=None and HTTPS
      sameSite: 'none', // Required for cross-origin iframe
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ message: 'Login successful', token, user: { email: admin.email, name: admin.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

router.get('/me', (req, res) => {
  let token = req.cookies.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const admin = db.prepare('SELECT id, email, name FROM admins WHERE id = ?').get(decoded.id);

    if (!admin) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user: admin });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
