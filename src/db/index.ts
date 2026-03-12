import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('school.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDb() {
  console.log('📊 Creating database tables...');

  try {
    // Admins
    db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT
      )
    `);
    console.log('  ✓ Admins table created/verified');

    // Admissions
    db.exec(`
      CREATE TABLE IF NOT EXISTS admissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        applicant_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Admissions table created/verified');

    // Enquiries
    db.exec(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'General',
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Enquiries table created/verified');

    // Job Applications
    db.exec(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surname TEXT NOT NULL,
        first_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        qualification TEXT,
        cv_path TEXT,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Job Applications table created/verified');

    // Blog Posts
    db.exec(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT,
        image_url TEXT,
        category TEXT,
        is_published INTEGER DEFAULT 0,
        publish_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Blog Posts table created/verified');

    // Gallery Images
    db.exec(`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        image_url TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Gallery Images table created/verified');

    // Testimonials
    db.exec(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_name TEXT NOT NULL,
        message TEXT NOT NULL,
        photo_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Testimonials table created/verified');

    // FAQs
    db.exec(`
      CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ FAQs table created/verified');

    // Announcements
    db.exec(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Announcements table created/verified');

    // Media (Videos)
    db.exec(`
      CREATE TABLE IF NOT EXISTS media_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Media Links table created/verified');

    // Events
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        event_date DATETIME,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Events table created/verified');

    // Staff
    db.exec(`
      CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        bio TEXT,
        photo_url TEXT,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✓ Staff table created/verified');

    // Website Settings
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
    console.log('  ✓ Settings table created/verified');

    // Seed Admin Users
    console.log('\n📝 Seeding admin users...');
    const adminEmail = 'thechoiceiconschools@gmail.com';
    const adminExists = db.prepare('SELECT * FROM admins WHERE email = ?').get(adminEmail);

    if (!adminExists) {
      const hashedPassword = bcrypt.hashSync('Choiceicon123', 10);
      db.prepare('INSERT INTO admins (email, password, name) VALUES (?, ?, ?)').run(
        adminEmail,
        hashedPassword,
        'Administrator'
      );
      console.log(`  ✓ Created admin: ${adminEmail}`);
    } else {
      console.log(`  ✓ Admin exists: ${adminEmail}`);
    }

    // Verify admin was created/exists
    const finalAdmin = db.prepare('SELECT email, name FROM admins WHERE email = ?').get(adminEmail);
    if (finalAdmin) {
      console.log(`  ✓ Verified admin account: ${finalAdmin.email} (${finalAdmin.name})`);
    }

    console.log('\n✅ Database initialization complete\n');
  } catch (error: any) {
    console.error('❌ Database initialization error:', error.message);
    throw error;
  }
}

export default db;
