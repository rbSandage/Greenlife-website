// ─────────────────────────────────────────────────────────────────────────────
// FIRESTORE SECURITY RULES
// Paste these in: Firebase Console → Firestore → Rules
// ─────────────────────────────────────────────────────────────────────────────

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Products: anyone can read, only authenticated admin can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Enquiries: anyone can create, only admin can read/delete
    match /enquiries/{enquiryId} {
      allow create: if true;
      allow read, delete: if request.auth != null;
    }
  }
}
*/

// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE STORAGE RULES
// Paste these in: Firebase Console → Storage → Rules
// ─────────────────────────────────────────────────────────────────────────────

/*
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
// 
*/
