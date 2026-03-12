import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'choiceicon-secret-key';

// Health check endpoint
router.get('/health', (req, res) => {
  try {
    const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get() as any;
    res.json({
      status: 'ok',
      database: 'connected',
      adminCount: adminCount?.count || 0,
      message: 'Auth service is operational'
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Debug endpoint - checks if default admin exists
router.get('/debug/admin', (req, res) => {
  try {
    const admins = db.prepare('SELECT id, email, name FROM admins').all();
    res.json({
      admins,
      total: admins.length,
      defaultAdminEmail: 'thechoiceiconschools@gmail.com'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Login endpoint with improved error handling
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  console.log(`🔐 Login attempt for email: ${email}`);

  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log('📊 Querying database for admin...');
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email) as any;

    if (!admin) {
      console.log(`❌ No admin found with email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`✓ Admin found: ${admin.email}`);

    const isMatch = bcrypt.compareSync(password, admin.password);

    if (!isMatch) {
      console.log('❌ Password mismatch for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✓ Password matched');

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1d' });

    console.log('✓ JWT token generated');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    console.log(`✅ Login successful for: ${email}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error: any) {
    console.error('❌ Auth error:', error);
    res.status(500).json({
      message: 'Server error: ' + (error.message || 'Unknown error'),
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  console.log('✓ User logged out');
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
