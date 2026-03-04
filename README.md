# 🌿 GreenLife Cropcare Website

A complete, production-ready agri chemical company website built with **React + Tailwind CSS + Firebase**.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js 18 | Website UI |
| Styling | Tailwind CSS 3 | Responsive design |
| Animations | Framer Motion | Smooth transitions |
| Database | Firebase Firestore | Product & enquiry data |
| Auth | Firebase Auth | Admin login |
| Storage | Firebase Storage | Product images |
| Hosting | Firebase Hosting | Free deployment |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Fixed responsive navbar
│   │   └── Footer.jsx          # Full footer with links
│   ├── pages/
│   │   ├── Home.jsx            # Full homepage (Hero, Features, Spotlight, Stats, CTA)
│   │   ├── Products.jsx        # Products grid with search + filter
│   │   ├── ProductDetail.jsx   # Individual product page
│   │   ├── About.jsx           # About, team, timeline, certifications
│   │   └── Contact.jsx         # Enquiry form → saves to Firestore
│   └── admin/
│       ├── AdminLogin.jsx      # Secure login page
│       ├── AdminDashboard.jsx  # Full CRUD + enquiry management
│       └── ProtectedRoute.jsx  # Auth guard
├── firebase/
│   ├── config.js               # Firebase initialization
│   └── rules.js                # Security rules reference
├── hooks/
│   └── index.js                # useAuth, useProducts, useProductCRUD, useEnquiries
├── data/
│   └── products.js             # Sample data + category constants
├── App.jsx                     # Router setup
├── index.js                    # React entry
└── index.css                   # Tailwind + global styles
```

---

## 🚀 Setup Guide

### Step 1 — Clone & Install

```bash
git clone <your-repo-url>
cd greenlife-cropcare
npm install
```

### Step 2 — Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g., `greenlife-cropcare`)
3. Add a **Web App** → copy the config keys
4. Enable **Firestore Database** → Start in production mode
5. Enable **Authentication** → Email/Password provider
6. Enable **Storage**
7. Create admin user: Authentication → Users → Add User

### Step 3 — Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase keys:

```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc
```

### Step 4 — Set Firestore Security Rules

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /enquiries/{id} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5 — Run Locally

```bash
npm start
# Opens at http://localhost:3000
```

### Step 6 — Add First Products

1. Visit `http://localhost:3000/admin`
2. Login with the admin email/password you created in Firebase
3. Click **Add Product** → fill in details → Save

---

## 🌐 Deployment (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select Hosting, build folder)
firebase init hosting
# → Public directory: build
# → Single-page app: Yes

# Build & Deploy
npm run build
firebase deploy

# Your site is live at: https://your-project.web.app
```

### Connect Custom Domain (GoDaddy)

1. Firebase Console → Hosting → Add custom domain
2. Enter `www.yoursite.com`
3. Add the DNS records Firebase gives you in GoDaddy DNS settings
4. Wait 10–30 minutes → SSL auto-activates ✅

---

## 🔒 Admin Panel

| URL | Action |
|---|---|
| `/admin` | Admin dashboard (requires login) |
| `/admin/login` | Login page |

**Features:**
- ➕ Add new products with image upload
- ✏️ Edit existing products
- 🗑️ Delete products
- ⭐ Toggle featured / active status
- 📋 View all enquiries (with unread badge)
- 💬 Quick WhatsApp / call buttons per enquiry

---

## 📄 Pages

| Route | Page |
|---|---|
| `/` | Home — Hero, Features, Products, Spotlight, Stats, Testimonials, CTA |
| `/products` | Products grid with live search + category filter |
| `/products/:id` | Product detail with specs, crops, enquiry CTA |
| `/about` | Company story, timeline, team, certifications |
| `/contact` | Enquiry form → saves to Firestore |
| `/admin` | Protected admin dashboard |

---

## 💰 Monthly Cost: ₹0

| Service | Plan | Cost |
|---|---|---|
| Firebase Hosting | Free (Google) | ₹0 |
| Firestore DB | Free Spark Plan | ₹0 |
| Firebase Storage | Free Spark Plan | ₹0 |
| Firebase Auth | Free | ₹0 |
| **Total** | | **₹0/month** |

> Domain renewal (~₹1,000/year on GoDaddy) is the only cost.

---

## 🛠️ Customization

### Change Company Name
Search & replace `GreenLife Cropcare` in all files.

### Change Colors
Edit `tailwind.config.js` → `theme.extend.colors.green`

### Add Products via Admin Panel
Visit `/admin` → Add Product → done. No code needed.

### Change Contact Info
Edit `src/components/layout/Footer.jsx` and `src/components/pages/Contact.jsx`

---

## 📞 Developer Contact

**Vision Craft** — Web Development  
📱 Your Phone Number  
📧 your@email.com  
Available: Monday–Saturday, 10 AM – 7 PM

---

*Built with ❤️ for Indian farmers*
