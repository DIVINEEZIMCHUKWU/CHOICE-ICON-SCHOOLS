import express from 'express';
import db from '../db';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const admissionsCount = db.prepare('SELECT COUNT(*) as count FROM admissions').get() as { count: number };
    const enquiriesCount = db.prepare('SELECT COUNT(*) as count FROM enquiries').get() as { count: number };
    const jobApplicationsCount = db.prepare('SELECT COUNT(*) as count FROM job_applications').get() as { count: number };
    const blogPostsCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as { count: number };
    const eventsCount = db.prepare('SELECT COUNT(*) as count FROM events WHERE event_date >= date("now")').get() as { count: number };
    const announcementsCount = db.prepare('SELECT COUNT(*) as count FROM announcements WHERE is_active = 1').get() as { count: number };
    const mediaCount = db.prepare('SELECT COUNT(*) as count FROM media_links').get() as { count: number };

    res.json({
      admissions: admissionsCount.count,
      enquiries: enquiriesCount.count,
      jobApplications: jobApplicationsCount.count,
      blogPosts: blogPostsCount.count,
      upcomingEvents: eventsCount.count,
      activeAnnouncements: announcementsCount.count,
      mediaLinks: mediaCount.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
