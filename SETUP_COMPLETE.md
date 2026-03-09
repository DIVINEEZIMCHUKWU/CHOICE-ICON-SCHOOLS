# Development Environment Setup - Complete

## ✅ Changes Made

### 1. **Server Architecture Restructured**
   - Created `/server` folder with modular Express backend
   - Separated concerns: server, routes, email, and Supabase modules
   - Fixed the critical vite.config.ts loading error

### 2. **Backend Server** (`server/server.ts`)
   - Express server running on port 5000
   - Uses body-parser for JSON parsing
   - CORS enabled for frontend communication
   - Health check endpoint at `/api/health`

### 3. **Supabase Integration** (`server/supabase.ts`)
   - Initializes Supabase client with service role key
   - Enables backend database operations
   - Ready for contact_messages table operations

### 4. **Email Service** (`server/email.ts`)
   - Resend email API integration
   - Sends admin notification emails
   - Sends professional HTML confirmation emails
   - Email replies go directly to sender (reply_to)

### 5. **API Routes** (`server/routes.ts`)
   - `POST /api/contact` - Contact form submissions
   - `POST /api/admission` - Admission inquiries
   - `GET /api/admin/messages` - Admin dashboard message retrieval
   - Automatic email notifications and confirmations

### 6. **Frontend Updates**
   - Contact.tsx: Updated to POST to `http://localhost:5000/api/contact`
   - Admissions.tsx: Updated to POST to `http://localhost:5000/api/admission`
   - Forms now use Express backend instead of direct Supabase access

### 7. **Configuration Files**
   - **vite.config.ts**: Fixed to use Vite dev server only (no middleware mode)
     - Added proxy to `/api` endpoints pointing to localhost:5000
     - Removed server middleware mode that caused the original error
   - **package.json**: Updated scripts and dependencies
     - `dev` script now uses concurrently to run Vite + Express
     - Added: body-parser, concurrently, nodemon
   - **.env**: Added SUPABASE_SERVICE_ROLE_KEY and ADMIN_EMAIL configuration
   - **nodemon.json**: Created for proper TypeScript file watching

### 8. **Dependency Updates**
   - Installed: `body-parser`, `concurrently`, `nodemon`
   - All required packages are now in place

## 🚀 How to Run

```bash
# Install dependencies (already done)
npm install

# Development mode (runs both frontend and backend)
npm run dev

# This starts:
# - Frontend: http://localhost:5173 (Vite dev server)
# - Backend: http://localhost:5000 (Express server)
```

## 📋 Form Submission Flow

1. **User submits form** on Contact or Admissions page
2. **Frontend sends POST** to `http://localhost:5000/api/contact` or `/api/admission`
3. **Backend validates** form data
4. **Database insert** to Supabase `contact_messages` table
5. **Admin email** sent to thechoiceiconschools@gmail.com
6. **Confirmation email** sent to user's email address
7. **Admin reply** capability via email reply-to

## 🔧 API Endpoints

### POST /api/contact
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+234-XXX-XXX-XXXX",
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Your message has been received",
  "data": { /* database record */ }
}
```

### POST /api/admission
Same format as contact form.

### GET /api/admin/messages
Returns all messages from the database.

## 📞 Email Configuration

- **Admin Email**: thechoiceiconschools@gmail.com
- **School Contact Phone**: +234-806-9077-937 / +234-810-7601-537
- **Admin can reply directly** to sender emails

## ⚠️ Important Notes

- The original error "TypeError [ERR_INVALID_URL_SCHEME]" was caused by:
  - Vite attempting to load itself via middleware mode in the same Express process
  - This created a circular dependency with the config file

- **Solution**: Separate Vite (frontend) and Express (backend) into independent processes running concurrently
  - Vite runs on 5173
  - Express runs on 5000
  - Frontend proxies `/api` calls to backend

## 🛡️ Security Considerations

- Supabase service role key should only be used server-side (✅ Correct in this setup)
- Frontend uses anon key (in VITE_SUPABASE_* env vars)
- Backend uses service role key (in SUPABASE_*env vars)
- Email confirmations prevent spam and validate addresses

## 📊 Database Schema

Ensure Supabase has `contact_messages` table with:
```sql
CREATE TABLE contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## ✨ What Works Now

✅ Frontend and backend run independently without conflicts
✅ Forms save to Supabase database
✅ Admin receives email notifications
✅ Users receive confirmation emails
✅ Email replies are enabled (reply-to sender)
✅ Admin dashboard can fetch messages via API
✅ Windows path issues resolved (using forward slashes)
✅ Hot reload works during development

## 🔍 Troubleshooting

**Port already in use?**
```bash
# Change in server/server.ts: PORT environment variable
PORT=YOUR_PORT npm run dev
```

**Emails not sending?**
- Check RESEND_API_KEY is valid
- Verify domain is configured in Resend

**Database not saving?**
- Verify SUPABASE_URL is correct
- Verify SUPABASE_SERVICE_ROLE_KEY is valid
- Check contact_messages table exists

**Frontend can't reach backend?**
- Ensure backend is running on 5000
- Check CORS configuration in server/server.ts
