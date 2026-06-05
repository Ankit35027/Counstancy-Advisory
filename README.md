# Mittal's Consultancy & Advisory Platform

Consultancy and advisory client-intake platform, built step by step from the supplied service brief and full-stack roadmap.

## Current Slice: Phase 1 Foundation

- React + Vite + TypeScript app scaffold
- Premium homepage with dark blue and gold corporate direction
- Service catalogue covering ITR, GST, tax planning, notices, NRI tax, TDS/TCS, business registration, and capital gains
- Conversion workflow section
- First enquiry form UI for consultation requests

## Product Phases

1. UI and branding foundation
2. Dedicated service landing pages
3. Multi-step lead capture with validation
4. Backend APIs, database schema, and document upload
5. Admin dashboard for leads, statuses, notes, and documents
6. Testing, SEO, analytics, and deployment

## Local Commands

```bash
npm install
npm run server
npm run dev -- --host 127.0.0.1
npm run build
npm start
```

## Backend Setup

The backend is a small Express API connected to MongoDB with Mongoose.

- `POST /api/enquiries` saves a client enquiry with name, phone, service, urgency, requirement, and status.
- `POST /api/admin/login` verifies admin credentials from `.env`.
- `GET /api/admin/enquiries` returns dashboard stats and the latest 100 enquiries for logged-in admins.
- `PATCH /api/admin/enquiries/:id` updates an enquiry status for logged-in admins.
- `DELETE /api/admin/enquiries/:id` deletes an enquiry for logged-in admins.
- `GET /api/health` checks whether the API is running.

Set MongoDB in `.env`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/mittal_consultancy
PORT=5050
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-strong-password
ADMIN_TOKEN_SECRET=replace-with-at-least-32-random-characters
```

Use a MongoDB Atlas connection string in `MONGODB_URI` when deploying.
Open the admin portal at `#admin` after the frontend is running.

## Google Cloud Security Checklist

- Build the app with `npm run build`, then run production with `NODE_ENV=production npm start`.
- Do not deploy `.env`; configure secrets in Google Cloud environment variables or Secret Manager.
- Set `CLIENT_ORIGIN` to the exact production URL, for example `https://your-domain.com`.
- Leave `VITE_API_URL` empty when frontend and API are served from the same Express service.
- Use a MongoDB Atlas URI or private database connection. Do not expose local MongoDB to the public internet.
- Replace `ADMIN_PASSWORD` and use an `ADMIN_TOKEN_SECRET` with at least 32 random characters.
- Do not run `npm run dev` on Google Cloud; it starts the Vite development server.

## Next Build Slice

Create dedicated service detail pages using the existing catalogue data. Each page should include overview, benefits, process, required documents, FAQ, and a consultation CTA.
