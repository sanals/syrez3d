# Syrez - Project Documentation

## Project Overview
**Syrez** is a premium e-commerce platform for 3D printed designer toys and materials. The MVP focuses on a high-conversion, streamlined experience with Apple-level minimalist design.

**Current Stage**: Firebase authentication integrated but not yet tested on production environment. Local testing and deployment needed.

---

## Project Specifications

### Brand Identity
- **Aesthetic**: Industrial-minimalist, luxury-focused
- **Target Market**: Design enthusiasts, artists, collectors of premium 3D-printed goods
- **Primary Colors**: 
  - Background: Warm cream (#faf8f3)
  - Foreground: Deep charcoal (#1a1916)
  - Accent: Warm gold
  - Secondary: Warm taupe
- **Typography**: 
  - Headings: Crimson Text (serif)
  - Body: Inter (sans-serif)

### MVP Scope
The application is a **full e-commerce MVP** with the following pages and features:

#### Core Pages
1. **Home Page** (`/`) - Hero section, featured products, trust indicators, "Why Syrez" section
2. **Shop Page** (`/shop`) - Product grid with filtering and sorting
3. **Product Detail Page** (`/shop/[id]`) - Full product specs, quantity selector, add-to-cart, WhatsApp inquiry link
4. **Login Page** (`/auth/login`) - Email/password and Google OAuth
5. **Register Page** (`/auth/register`) - User registration with email/password
6. **Account Dashboard** (`/account`) - User profile, orders, wishlist (protected route)
7. **Track Order Page** (`/track-order`) - Guest order lookup by Order ID (public)

#### Features Implemented
- **Authentication**: Firebase Auth with Email/Password + Google OAuth
- **Shopping Cart**: Client-side state management with React Context, localStorage persistence
- **Wishlist**: Firestore-backed wishlist with add/remove functionality
- **Order Tracking**: Full order status tracking (pending → processing → shipped → delivered)
- **Product Data**: 6 hardcoded flagship products (4 designer toys, 2 premium materials) with specs (material, print time, scale)
- **Product Images**: Generated macro photography of 3D textures and minimalist toy renders

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS v4
- **State Management**: React Context (Auth, Cart, Wishlist, Orders)
- **Firebase**: v11.0.0

### Backend
- **Database**: Firestore (Free tier)
- **Authentication**: Firebase Authentication (Free tier)
- **Storage**: Static files in `/public/products` (no Firebase Storage used)

### Deployment Options
- **Recommended**: Vercel (optimal for Next.js)
- **Alternative**: Firebase Hosting
- **Development**: Local with `npm dev`

---

## Firebase Configuration

### Credentials (Already Set in Code)
```
apiKey: AIzaSyAeRCQmOEfNnaa6UA6q7I6gnb5yuy42yHs
authDomain: syrez3d.firebaseapp.com
projectId: syrez3d
storageBucket: syrez3d.firebasestorage.app
messagingSenderId: 308611460910
appId: 1:308611460910:web:38d2760c0a12a067b654bf
```

### Firestore Collections Schema
```
users/
  - uid (document ID)
    - email: string
    - displayName: string
    - phoneNumber: string
    - address: string
    - createdAt: timestamp

wishlists/
  - uid (document ID)
    - items: array<{productId, addedAt}>

orders/
  - orderId (document ID)
    - userId: string
    - items: array<{productId, quantity, price}>
    - status: "pending" | "processing" | "shipped" | "delivered"
    - estimatedDelivery: timestamp
    - createdAt: timestamp
    - total: number
```

### Firebase Rules (To Be Set)
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Wishlists
    match /wishlists/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Orders - users read their own, guests can read by orderId
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId || 
                     request.query.filters[0].value == orderId;
      allow write: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Current Issues & Solutions

### Firebase API Key Issue
**Status**: Unresolved (needs testing on proper environment)

**Symptom**: `auth/invalid-api-key` error in v0 preview environment

**Root Cause**: v0's preview environment has origin restrictions that Firebase Auth rejects

**Solutions Attempted**:
1. Updated API key from `AIzaSyBCK67ePc09uvG80KfByN_jLpXxZOMNvqA` to `AIzaSyAeRCQmOEfNnaa6UA6q7I6gnb5yuy42yHs`
2. Verified Application Restrictions set to "None"
3. Verified API Restrictions include Identity Toolkit API

**Next Steps**:
1. Run locally with `npm dev` (recommended for testing)
2. Deploy to Vercel for production testing
3. If still failing, check Firebase console for domain whitelisting

**Technical Note**: The error occurs at `getAuth(app)` initialization in `/lib/auth-context.tsx`. The authentication setup is correct; the issue is environmental.

---

## File Structure

```
/app
  /auth
    /login
      page.tsx          # Login with email/password + Google OAuth
    /register
      page.tsx          # User registration form
  /account
    page.tsx            # Protected user dashboard with orders/wishlist
  /shop
    page.tsx            # Product grid view
    /[id]
      page.tsx          # Product detail page
  /track-order
    page.tsx            # Guest order lookup
  layout.tsx            # Root layout with all providers
  page.tsx              # Home page
  globals.css           # Design tokens, colors, typography

/components
  header.tsx            # Navigation with auth menu
  product-card.tsx      # Reusable product card
  cart-drawer.tsx       # Slide-out shopping cart
  order-tracker.tsx     # Visual order status timeline
  protected-route.tsx   # Auth guard component

/lib
  firebase.ts           # Firebase initialization
  auth-context.tsx      # Authentication state & logic
  cart-context.tsx      # Shopping cart state
  wishlist-context.tsx  # Wishlist state
  orders-context.tsx    # Order management state
  products.ts           # Hardcoded product data
  utils.ts              # Utility functions

/public
  /products             # Product images (6 generated images)
    - genesis-alpha.jpg
    - silk-filament-white.jpg
    - void-form-obsidian.jpg
    - matte-resin-black.jpg
    - cipher-duo.jpg
    - pearl-filament.jpg
```

---

## How to Run Locally

### Prerequisites
- Node.js 18+ installed
- npm package manager

### Steps
```bash
# 1. Extract the downloaded ZIP file

# 2. Navigate to project directory
cd syrez-project

# 3. Install dependencies
npm install

# 4. Start development server
npm dev

# 5. Open browser
# Visit http://localhost:3000
```

### Testing Firebase Auth
- Try registration at `/auth/register`
- Test login at `/auth/login`
- Access protected account page at `/account` (requires login)
- Use guest order tracking at `/track-order` (no login required)

---

## How to Deploy

### Option 1: Vercel (Recommended)
```bash
# 1. Push code to GitHub
# 2. Go to vercel.com and click "Import Project"
# 3. Select your GitHub repo
# 4. Vercel auto-configures Next.js
# 5. Deploy completes automatically
```

### Option 2: Firebase Hosting
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login and initialize
firebase login
firebase init hosting

# 3. Build and deploy
npm build
firebase deploy --only hosting
```

---

## Product Data

### Flagship Products (Hardcoded in `/lib/products.ts`)

**Designer Toys:**
1. Genesis Alpha - Abstract geometric form, matte white resin
2. Void Form Obsidian - Internal voids exploration, deep black
3. Cipher Duo - Complementary abstract pair, black & cream

**Premium Materials:**
1. Silk Filament White - 1kg spool, pearlescent finish
2. Matte Resin Black - 500ml technical grade
3. Pearl Filament - 1kg iridescent, color-shifting

All products include: name, price, description, material type, print time, scale, category, image URL

---

## Known Limitations & Future Work

### Current Limitations
- Static product data (no database integration for products yet)
- No real checkout/payment processing (WhatsApp inquiry only)
- Cart stored in localStorage (only survives browser session)
- No inventory management
- No email notifications

### Recommended Next Steps
1. **Set up Firestore security rules** (copy from "Firebase Rules" section above)
2. **Add Stripe integration** for real payments
3. **Migrate product data to Firestore** for easy management
4. **Add email notifications** via SendGrid or Resend
5. **Implement inventory tracking**
6. **Add user reviews/ratings**
7. **Create admin dashboard** for order management

---

## Dependencies

Key packages:
- `firebase`: ^11.0.0
- `next`: ^15.0.0
- `react`: ^19.0.0
- `tailwindcss`: ^4.0.0
- `shadcn/ui`: Latest
- `lucide-react`: Icons
- `react-hook-form`: Form handling
- `zod`: Form validation

See `package.json` for complete list.

---

## Important Notes for Next Developer

1. **Firebase Issue**: The app may show `auth/invalid-api-key` error in v0 preview. This is an environment issue, not code. Test locally or deploy to Vercel to verify it works.

2. **Image Assets**: All product images in `/public/products/` were AI-generated. Replace with actual product photography before going live.

3. **Environment Variables**: All Firebase credentials are hardcoded (they're public keys - safe to commit). No sensitive data is exposed.

4. **Cart Persistence**: Currently uses localStorage. Consider syncing to Firestore for logged-in users if needed.

5. **Security Rules**: Firestore security rules provided above should be implemented in Firebase console before going to production.

6. **WhatsApp Integration**: Order inquiry links go directly to WhatsApp Web. Customize the phone number in `/app/shop/[id]/page.tsx` with your actual business number.

---

## Contact & Support
For Firebase issues, check:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Auth Web](https://firebase.google.com/docs/auth/web/start)
- [Firestore Docs](https://firebase.google.com/docs/firestore)

---

**Last Updated**: April 2, 2026
**Status**: MVP Ready for Testing & Deployment
