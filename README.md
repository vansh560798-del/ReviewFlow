# ReviewFlow

Starter SaaS for NFC + dynamic QR Google Review cards.

## Setup
1. In Supabase Authentication, create your admin user (disable public signups for an admin-only installation).
2. Copy `.env.example` to `.env.local`, and set your Supabase publishable key from Project Settings > API Keys.
3. Run `npm install` and `npm run dev`.
4. Sign in and add a shop.
5. Generate its QR and program the matching NFC URL.
6. Deploy to hosting that permits your intended commercial usage, then configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` there.

**Important:** Set your final stable hosting URL before printing QR codes or programming NFC cards. QR codes encode the URL at generation time. Use HTTPS. Don't print QR codes from localhost.

This is an MVP, not production-ready. Add rate limiting, robust input validation, monitoring, order and batch management, analytics dashboard, automated tests and a privacy policy before commercial launch. Scan counts measure redirects, not verified Google reviews.
