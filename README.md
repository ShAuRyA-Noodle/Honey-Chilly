# Vibely

Vibely is a focused professional social network MVP built with Next.js, TypeScript, Clerk, MongoDB, Cloudinary, and Tailwind CSS.

## Features

- Clerk sign-up and sign-in routes
- Onboarding for persistent Vibely profiles
- Editable profile pages with subscriber, subscribing, and post counts
- One-way subscribe/unsubscribe relationship model
- Feed with text posts, image uploads, video uploads, likes, comments, quote reposts, plain repost toggles, and author-only deletes
- Suggested profiles backed by MongoDB instead of static news/demo data
- Cursor-based feed API and signed Cloudinary direct uploads
- Old demo posts hidden through `schemaVersion: 2`

## Run Locally

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```bash
MONGO_URI=YOUR_MONGO_URL
CLOUD_NAME=YOUR_CLOUDINARY_NAME
API_KEY=YOUR_CLOUDINARY_API_KEY
API_SECRET=YOUR_CLOUDINARY_API_SECRET
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
```

Start the development server:

```bash
npm run dev
```

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run build
```
