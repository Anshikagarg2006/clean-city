import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SocialFeed } from './components/SocialFeed';
import { PostComposer } from './components/PostComposer';
import { CityMap } from './components/CityMap';
import { LocationPickerModal } from './components/LocationPickerModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Footer } from './components/Footer';
import { MessageSquare } from 'lucide-react';
import { generateSyntheticReports } from './data/syntheticReports';
import { useGeolocation } from './hooks/useGeolocation';

const STORAGE_POSTS_KEY = 'cleancity_social_posts_v2';
const STORAGE_SAVED_KEY = 'cleancity_saved_posts_v2';
const STORAGE_NOTIF_KEY = 'cleancity_notifications_v2';

export function App() {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'create' | 'map' | 'saved'
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  // Live Automatic Geolocation Hook
  const { 
    location, 
    loading: loadingLocation, 
    error: locationError, 
    requestLocation, 
    setManualLocation 
  } = useGeolocation();

  // Request browser geolocation once on initial app load if supported
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200';
    }
  }, [darkMode]);

  // Initialize Posts State from localStorage or synthetic generation
  const [posts, setPosts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_POSTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          // Automatic migration: Ensure Dark Streetlight post uses the real streetlight photo, never the gaming controller
          let needsUpdate = false;
          const migrated = parsed.map((p) => {
            if (p.photo && p.photo.includes('photo-1509198397868-475647b2a1e5')) {
              needsUpdate = true;
              return { ...p, photo: '/assets/dark-streetlight.jpg' };
            }
            return p;
          });
          if (needsUpdate) {
            localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(migrated));
          }
          return migrated;
        }
      }
    } catch (e) {
      console.warn("Could not load stored posts, generating fresh synthetic set:", e);
    }

    const initial = generateSyntheticReports();
    try {
      localStorage.setItem(STORAGE_POSTS_KEY, JSON.stringify(initial));
    } catch (e) {
      console.warn("Could not persist initial posts to localStorage:", e);
    }
    return initial;
  });

  // Initialize Saved Post IDs from localStorage
  const [savedPostIds, setSavedPostIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_SAVED_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read saved post IDs:", e);
    }
    return [];
  });

  // Initialize Simulated Notifications State from localStorage
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_NOTIF_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read notifications:", e);
    }

    // Default seed notifications for initial demo richness
    const seed = [
      {
        id: "seed-notif-1",
        postId: "CC-PB-POST-101",
        recipientName: "Amanpreet Singh (Local Resident)",
        recipientLocality: "Model Town",
        recipientCity: "Phagwara",
        issueCategory: "Potholes & Damaged Road",
        issueLocality: "Model Town",
        issueCity: "Phagwara",
        distanceKm: 0.35,
        distanceFormatted: "350 m away",
        radiusKm: 1.0,
        message: "A new civic issue (Potholes & Damaged Road) was posted near your selected area at Model Town, Phagwara.",
        timestamp: "10m ago",
        read: false
      },
      {
        id: "seed-notif-2",
        postId: "CC-PB-POST-102",
        recipientName: "Simranjit Singh (Ward Volunteer)",
        recipientLocality: "Civil Lines",
        recipientCity: "Jalandhar",
        issueCategory: "Garbage Dump & Waste Accumulation",
        issueLocality: "Civil Lines",
        issueCity: "Jalandhar",
        distanceKm: 0.82,
        distanceFormatted: "820 m away",
        radiusKm: 1.0,
        message: "A new civic issue (Garbage Dump & Waste Accumulation) was posted near your selected area at Civil Lines, Jalandhar.",
        timestamp: "25m ago",
        read: false
      }
    ];

    try {
      localStorage.setItem(STORAGE_NOTIF_KEY, JSON.stringify(seed));
    } catch (e) {
      // safe fallback
    }

    return seed;
  });

  // Safe localStorage helper to handle quota exceeded errors
  const safePersist = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.warn(`localStorage save failed for ${key} (storage limit or disabled):`, err);
    }
  };

  // Publish Post Handler
  const handlePublishPost = useCallback((newPost, simulatedNotifications = []) => {
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      safePersist(STORAGE_POSTS_KEY, updated);
      return updated;
    });

    if (simulatedNotifications.length > 0) {
      setNotifications((prev) => {
        const updatedNotifs = [...simulatedNotifications, ...prev].slice(0, 50);
        safePersist(STORAGE_NOTIF_KEY, updatedNotifs);
        return updatedNotifs;
      });
    }

    // Switch to feed and scroll to top
    setActiveTab('feed');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, []);

  // Toggle Like Handler
  const handleToggleLike = useCallback((postId) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLikedByUser;
          const likesCount = isLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 1) - 1);
          return {
            ...p,
            isLikedByUser: isLiked,
            likes: likesCount
          };
        }
        return p;
      });
      safePersist(STORAGE_POSTS_KEY, updated);
      return updated;
    });
  }, []);

  // Toggle Save Post Handler
  const handleToggleSave = useCallback((postId) => {
    setSavedPostIds((prev) => {
      const isSaved = prev.includes(postId);
      const updated = isSaved ? prev.filter((id) => id !== postId) : [...prev, postId];
      safePersist(STORAGE_SAVED_KEY, updated);
      return updated;
    });
  }, []);

  // Add Comment Handler
  const handleAddComment = useCallback((postId, comment) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), comment]
          };
        }
        return p;
      });
      safePersist(STORAGE_POSTS_KEY, updated);
      return updated;
    });
  }, []);

  // Delete Comment Handler
  const handleDeleteComment = useCallback((postId, commentId) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: (p.comments || []).filter((c) => c.id !== commentId)
          };
        }
        return p;
      });
      safePersist(STORAGE_POSTS_KEY, updated);
      return updated;
    });
  }, []);

  // Add Community Information / Observation Handler
  const handleAddInformation = useCallback((postId, info) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            additionalInfo: [...(p.additionalInfo || []), info]
          };
        }
        return p;
      });
      safePersist(STORAGE_POSTS_KEY, updated);
      return updated;
    });
  }, []);

  // Notifications handlers
  const handleMarkNotificationAsRead = useCallback((notifId) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => n.id === notifId ? { ...n, read: true } : n);
      safePersist(STORAGE_NOTIF_KEY, updated);
      return updated;
    });
  }, []);

  const handleClearNotifications = useCallback(() => {
    setNotifications([]);
    safePersist(STORAGE_NOTIF_KEY, []);
  }, []);

  const handleSelectPostFromNotification = useCallback((targetPostId) => {
    setActiveTab('feed');
    setTimeout(() => {
      const el = document.getElementById(`post-${targetPostId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-emerald-400');
        setTimeout(() => el.classList.remove('ring-2', 'ring-emerald-400'), 3000);
      }
    }, 150);
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        postsCount={posts.length}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
        location={location}
        loadingLocation={loadingLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero 
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          postsCount={posts.length}
        />

        {/* Tab-driven Core Feature Modules */}
        <section id="module-container" className="scroll-mt-24 pb-12">
          
          {/* Main Civic Social Feed & Saved Tab */}
          {(activeTab === 'feed' || activeTab === 'saved') && (
            <SocialFeed 
              posts={posts}
              darkMode={darkMode}
              userLocation={location}
              onRequestGps={requestLocation}
              loadingLocation={loadingLocation}
              locationError={locationError}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              onPublishPost={handlePublishPost}
              onToggleLike={handleToggleLike}
              onToggleSave={handleToggleSave}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onAddInformation={handleAddInformation}
              savedPostIds={savedPostIds}
              initialTab={activeTab === 'saved' ? 'saved' : 'all'}
            />
          )}

          {/* Dedicated Create Post Page / Tab */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
              <PostComposer 
                darkMode={darkMode}
                onPublishPost={handlePublishPost}
                userLocation={location}
                onRequestGps={requestLocation}
                loadingLocation={loadingLocation}
                locationError={locationError}
                onOpenLocationModal={() => setIsLocationModalOpen(true)}
              />
            </div>
          )}

          {/* Regional GIS Incident Map Tab */}
          {activeTab === 'map' && (
            <CityMap 
              reports={posts}
              onSelectReport={(report) => {
                setActiveTab('feed');
                handleSelectPostFromNotification(report.id);
              }}
              darkMode={darkMode}
            />
          )}

        </section>
      </main>

      {/* Location Picker & Live GPS Modal */}
      <LocationPickerModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        location={location}
        loading={loadingLocation}
        error={locationError}
        onRequestGps={requestLocation}
        onSetManualLocation={setManualLocation}
        darkMode={darkMode}
      />

      {/* Notifications Modal (Simulated Radius Alerts) */}
      <NotificationsModal 
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onClearAll={handleClearNotifications}
        onSelectPost={handleSelectPostFromNotification}
        darkMode={darkMode}
      />

      {/* Footer */}
      <Footer 
        darkMode={darkMode}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}

export default App;
