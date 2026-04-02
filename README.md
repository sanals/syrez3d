# Syrez 3D - Premium Designer Toys & Materials

A modern, minimalist e-commerce platform built with Next.js and Firebase, specializing in 3D printed designer toys and high-quality materials.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Radix UI Primitives 
- **Database / Auth:** Firebase (Firestore & Authentication)
- **State Management:** React Context API (Cart, Wishlist, Auth)

## Initial Setup

### 1. Clone the repository
```bash
git clone https://github.com/sanals/syrez3d.git
cd syrez3d
```

### 2. Install dependencies
Ensure you are using `npm` as your package manager.
```bash
npm install
```

### 3. Environment Variables (Firebase)
To securely connect to the database, you need to set up your environment variables. 
1. In the root directory, create a file named exactly: `.env.local`
2. Open `.env.example` in your editor to see the required format.
3. Paste the following keys inside your new `.env.local` file:

```text
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyAeRCQmOEfNnaa6UA6q7I6gnb5yuy42yHs"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="syrez3d.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="syrez3d"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="syrez3d.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="308611460910"
NEXT_PUBLIC_FIREBASE_APP_ID="1:308611460910:web:38d2760c0a12a067b654bf"
```

*Note: Your `.env.local` file is automatically ignored by Git to protect your secrets from being pushed to public repositories.*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Core Features
1. **Interactive Cart:** Hybrid architecture merges guest-carts into Cloud Firestore automatically upon login.
2. **Wishlist System:** Fully synced to Firebase, instantly updating UI across multiple tabs.
3. **Optimized SEO:** Category-based URL parameters seamlessly filter content inside the Next.js router.
4. **Resilient Architecture:** Real-time graceful degradation if the database connection drops.
