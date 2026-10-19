# CleanCity AI — Civic Social Networking & Live Location Platform 🌿🏙️
> *"Your Neighborhood. Your Voice. Your Community."*

CleanCity AI is a responsive social networking web platform designed for sharing and mobilizing community action around local civic problems—such as **potholes, garbage dumps, broken streetlights, water leakage, drainage issues, and damaged public infrastructure**—focused on four Punjab municipalities: **Phagwara**, **Jalandhar**, **Ludhiana**, and **Amritsar**.

---

## 🌟 Core Concept & Workflow

CleanCity AI is styled like Instagram or Facebook, bringing modern social engagement to neighborhood infrastructure issues:

1. **Detect Location**: Requests user permission for live GPS, reverse-geocodes coordinates into a readable locality/city, and provides a manual fallback selector.
2. **Nearby Civic Feed**: Shows posts nearest to the user first, with real-time great-circle distance indicators (e.g. `"350 m away"`).
3. **Post Composer**: Allows citizens to upload issue photographs (with client-side compression to prevent storage limits), write captions, select an issue category, and adjust location.
4. **Customizable Notification Radius**: Choose from **500 metres**, **1 km**, **2 km**, or **5 km**. The spherical **Haversine formula** dynamically calculates how many synthetic community members are in range in real time.
5. **Simulated Radius Alerts**: Publishing a post calculates which synthetic users are within range and dispatches simulated in-app notifications with an updated bell badge.
6. **Community Interactions**: Citizens can like, comment (and delete their own comments), add additional observations/updates, share via Web Share API or copy link, and bookmark saved posts.
7. **Authority Direct Contact**: Optional municipal contact details (phone, email, website). Includes one-click `tel:` calling, prefilled `mailto:` email drafts with coordinates, and validated official links.

---

## 🛠️ Feature Highlights

### 1. Create Post & Post Composer
- **Photo Upload**: Supports image upload with live thumbnail preview, file format validation (JPEG, PNG, WebP), and automatic client-side canvas downscaling to ensure fast, persistent storage.
- **Quick Demo Pickers**: Instant sample photos for testing potholes, garbage piles, water leaks, and dark streetlights.
- **Caption & Category**: Clear citizen caption input with optional category tags (Potholes, Garbage Accumulation, Broken Streetlights, Water Leakage, Open Drains, Damaged Infrastructure).
- **Location & Geotagging**: Captures GPS coordinates, privacy-fuzzes them to ~100m (3 decimal places) for public display, and allows manual city/locality fallback.
- **Optional Authority Fields**: Department name, phone, email, and website URL are completely optional. Posts publish seamlessly with or without them.
- **Immediate Feed Placement**: Newly published posts are placed instantly at the very top of the social feed.

### 2. Live Location & Haversine Distance
- Browser Geolocation API with graceful permission handling (`PERMISSION_DENIED`, `POSITION_UNAVAILABLE`, `TIMEOUT`).
- In-memory reverse-geocoding cache to prevent redundant network calls.
- Shows approximate detected locality in the website header (`Navbar`). Clicking the location pill opens the **Location Picker Modal** to view coordinates, re-detect, or switch to manual input.
- Real-time great-circle distance calculation using the **Haversine formula** ($R = 6371\text{ km}$).
- Distance filter: `All Distances`, `Within 500 m`, `Within 1 km`, `Within 2 km`, `Within 5 km`, `Within 10 km`, or `Within 25 km`.

### 3. Radius-Based Simulated Notifications
- **160 Synthetic Demonstration Users** distributed across Phagwara, Jalandhar, Ludhiana, and Amritsar.
- Publishing a post with a selected radius (500m, 1km, 2km, 5km) evaluates Haversine distance to each synthetic user.
- Matching users receive simulated in-app notifications: *"A new civic issue was posted near your selected area."*
- Notification badge on the Navbar bell counter updates automatically.
- Clicking the notification bell opens the **Notifications Modal** showing simulated alerts with sender distance and locality.
- Post cards display the reach badge: e.g. `📡 1 km radius • 7 local demo users notified`.

### 4. Social Engagement & Community Interactions
- **Like / Unlike**: Toggle heart icon with live counter and localStorage persistence.
- **Comments**: Full discussion stream with author avatar, timestamp, and the ability to delete your own demo comments.
- **Community Observations**: Dedicated "Add Information" section where neighbors can submit situational updates (e.g., *"Municipal crew inspected at 2 PM"*).
- **Bookmarks**: Save and unsave posts, with a dedicated "Saved Posts" tab filter in the feed.
- **Sharing**: Integrated with the native Web Share API with an automatic clipboard copy fallback and toast confirmation.

### 5. Authority Direct Actions
- **Call Authority**: Direct `tel:` link with sanitized phone digits.
- **Email Authority**: Prefilled `mailto:` draft containing reference ID, category, resident caption, locality, and approximate coordinates.
- **Official Website**: Validated `https://` portal link with unsafe schemes blocked.
- **Clear Disclaimers**: Contact details are clearly badged as *Unverified Community Entry*. Users initiate all calls and emails directly—no false claims of automatic government dispatch.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Automated Test Suite
```bash
npm test
```
Runs 59 comprehensive verification tests covering:
- 40 synthetic social posts across Phagwara, Jalandhar, Ludhiana, and Amritsar.
- Haversine distance math and human-readable formatting.
- Notification radius reach model across 500m, 1km, 2km, and 5km.
- Reverse geocoding and Punjab spatial resolvers.
- Post creation, immediate top-of-feed display, and localStorage persistence.
- Likes, comments, comment deletion, observations, and bookmarks.
- Authority contact validation, telephone sanitization, and mailto draft generation.
- Publishing without authority details.
- Manual location fallback on GPS denial.
- Simulated in-app notification generation for eligible demo users.

### Production Build
```bash
npm run build
npm run preview
```

---

## ⚠️ Prototype & Academic Disclosures
- **Synthetic Data**: The baseline registry is initialized with **40 synthetic posts** (~10 per city) and **160 synthetic community users** generated for academic simulation and evaluation. All synthetic posts are explicitly flagged (`isSynthetic: true`).
- **Simulated Notifications**: Radius reach demonstrates the spatial distribution model using synthetic community members. No actual SMS or cross-device push notifications are transmitted.
- **Direct Citizen Action**: Authority contact buttons prepare calls and emails for the citizen to review and send directly; CleanCity AI does not claim tickets are transmitted automatically into municipal databases.
