# SnapGallery Ethiopia

A full-stack wedding QR photo sharing application for Ethiopian weddings.

## Overview

- Organizers create wedding events and receive a QR code.
- Guests scan the QR and upload photos/videos without signing in.
- Organizer dashboard shows uploaded media, event stats, and download options.

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express, MongoDB, JWT auth, Cloudinary
- Database: MongoDB Atlas

## Folder Structure

- `backend/` - Express API, models, routes, controllers, utilities
- `frontend/` - React app, pages, components, services, auth

## Setup

### Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Fill values for `MONGO_URI`, `JWT_SECRET`, and Cloudinary credentials
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Start backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/events/create`
- `GET /api/events/:id`
- `GET /api/events/user/:userId`
- `POST /api/upload/:eventId`
- `GET /api/upload/:eventId`
- `DELETE /api/upload/:photoId`

## Deployment

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MongoDB Atlas
- Cloudinary for media storage

## Notes

- Use JWT tokens for protected organizer routes.
- Store secrets in environment variables.
- Event QR codes are generated with `qrcode` and link to `/event/:eventId/upload`.
