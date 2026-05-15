Remaining work checklist for Next.js migration

1) Input validation
 - We added minimal validateString helpers and applied them to public APIs (appointments, contact, reviews).
 - Extend validation with Zod or Joi for richer schemas.

2) API tests
 - Add Jest/Playwright tests to cover create/read flows. (Not yet added.)

3) Manual smoke tests
 - Exercise create/approve/reject/delete flows and CSV export (admin/export endpoint exists).

4) Logging & error handling
 - A small structured logger (src/lib/logger.ts) and API helpers (src/lib/api.ts) were added.

5) Cookie/security
 - Admin auth sets HttpOnly/SameSite and Secure when NODE_ENV=production. Review cookie scopes in src/app/api/admin/auth/route.ts

6) CSRF & rate-limiting
 - Basic in-memory rate limiter added in src/lib/api.ts and wired into public endpoints.
 - Admin endpoints optionally require ADMIN_CSRF_TOKEN (set in env) via header x-csrf-token.

7) DB reconciliation & migrations
 - Added migrations/001_reconcile_appointments.sql to migrate legacy bookings -> appointments and create a bookings_view

8) Finish PHP migration
 - Legacy PHP admin pages are still in the repo. Decide whether to archive or reimplement. See archived_php/.

9) Create branch & commit
 - Will create a migration branch and push next.

10) Automation
 - Add CI (lint/tests) and DB migration execution in CI.

Next steps I can take on request:
 - Copy static assets to public/
 - Implement full CSRF tokens (double-submit cookies) and persistent rate limiting (Redis)
 - Add Jest tests and CI workflow
 - Migrate admin endpoints and reimplement approval flows as API routes
