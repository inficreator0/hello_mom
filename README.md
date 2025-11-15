# Hello Mom - Parenting & Baby Care Community App

A comprehensive React Native application built with Expo, designed to support new and expecting mothers through their pregnancy and postpartum journey.

## Features

### 🏘️ Community Section
- Reddit-like community interface with posts, comments, and voting
- Multiple sub-communities (Postpartum Recovery, Breastfeeding, Sleep Training, etc.)
- Search and filter functionality
- Interactive upvoting and bookmarking

### 👩‍⚕️ Healthcare Consultation
- Doctor directory with detailed profiles
- Search and filter by specialization
- Book consultations (Video, Voice, or Chat)
- View doctor availability and ratings

### 📊 Health Trackers
- **Baby Tracker**: Growth, feeding, sleep, diapers, milestones, vaccinations
- **Mother Tracker**: Postpartum recovery, mood, sleep, breastfeeding, goals
- Quick action buttons for logging activities
- Visual progress tracking

## Tech Stack

- **Framework**: Expo React Native
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Styling**: React Native StyleSheet with warm theme
- **Icons**: Expo Vector Icons (Ionicons)
- **Gradients**: Expo Linear Gradient

## Getting Started

### Prerequisites
- Node.js (v20+)
- npm or yarn
- Expo CLI (installed globally or via npx)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
# For web
npm start -- --web

# For iOS
npm start -- --ios

# For Android
npm start -- --android
```

Or use Expo CLI directly:
```bash
npx expo start
```

Then press `w` for web, `i` for iOS, or `a` for Android.

## Project Structure

```
hello_mom/
├── App.js                 # Main app component with navigation
├── theme.js              # Theme configuration (colors, typography, spacing)
├── data/
│   └── mockData.js       # Mock data for all features
├── screens/
│   ├── CommunityScreen.js
│   ├── PostDetailScreen.js
│   ├── DoctorsScreen.js
│   ├── DoctorDetailScreen.js
│   ├── BookingScreen.js
│   ├── TrackersScreen.js
│   ├── BabyTrackerScreen.js
│   └── MotherTrackerScreen.js
└── components/
    └── PostCard.js       # Reusable post card component
```

## Theme

The app uses a warm, welcoming color palette:
- **Primary**: Soft Pink (#FF6B9D)
- **Secondary**: Peach (#FFB88C)
- **Accent**: Warm Yellow (#FFD93D)
- **Background**: Warm Off-White (#FFF9F5)

## Mock Data

All features currently use mock data stored in `data/mockData.js`. This includes:
- Community posts and comments
- Doctor profiles and availability
- Baby and mother tracking data

## Features in Development

- Backend integration
- User authentication
- Real-time updates
- Push notifications
- Data persistence
- Image uploads
- Video consultation integration

## Notes

- The app is currently running with mock data only
- All interactions are simulated (upvotes, comments, bookings)
- Asset files (icons, splash screens) need to be added for production

## License

This project is for demonstration purposes.

