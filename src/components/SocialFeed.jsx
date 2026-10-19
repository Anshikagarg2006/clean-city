import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  MapPin, 
  Compass, 
  Bookmark, 
  Sparkles, 
  Radio, 
  AlertCircle,
  PlusCircle,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { PostCard } from './PostCard';
import { PostComposer } from './PostComposer';
import { CATEGORIES_CONFIG } from '../data/syntheticReports';
import { haversineDistance, formatDistance } from '../utils/geoUtils';

const DISTANCE_FILTER_OPTIONS = [
  { value: "All", label: "All Distances" },
  { value: "0.5", label: "Within 500 m", km: 0.5 },
  { value: "1.0", label: "Within 1 km", km: 1.0 },
  { value: "2.0", label: "Within 2 km", km: 2.0 },
  { value: "5.0", label: "Within 5 km", km: 5.0 },
  { value: "10.0", label: "Within 10 km", km: 10.0 },
  { value: "25.0", label: "Within 25 km", km: 25.0 }
];

export function SocialFeed({
  posts,
  darkMode,
  userLocation,
  onRequestGps,
  loadingLocation,
  locationError,
  onOpenLocationModal,
  onPublishPost,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onDeleteComment,
  onAddInformation,
  savedPostIds,
  initialTab = "all"
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'all' | 'nearest' | 'saved'
  const [selectedDistance, setSelectedDistance] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Keep activeTab in sync if parent passed initialTab
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Annotate all posts with distance from current userLocation
  const annotatedPosts = useMemo(() => {
    return posts.map((post) => {
      let distanceKm = null;
      if (userLocation && post.latitude && post.longitude) {
        distanceKm = haversineDistance(userLocation.lat, userLocation.lng, post.latitude, post.longitude);
      }
      return {
        ...post,
        distanceKm,
        distanceFormatted: formatDistance(distanceKm)
      };
    });
  }, [posts, userLocation]);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let list = annotatedPosts.filter((post) => {
      // Saved posts tab filter
      if (activeTab === "saved" && !savedPostIds.includes(post.id)) {
        return false;
      }

      // City filter
      if (selectedCity !== "All" && post.city !== selectedCity) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "All" && post.category !== selectedCategory) {
        return false;
      }

      // Distance filter
      if (selectedDistance !== "All") {
        const maxKm = parseFloat(selectedDistance);
        if (post.distanceKm === null || post.distanceKm > maxKm) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCaption = (post.caption || post.description || "").toLowerCase().includes(q);
        const matchLocality = (post.locality || "").toLowerCase().includes(q);
        const matchCity = (post.city || "").toLowerCase().includes(q);
        const matchCat = (post.category || "").toLowerCase().includes(q);
        const matchAuthor = (post.author?.name || "").toLowerCase().includes(q);
        if (!matchCaption && !matchLocality && !matchCity && !matchCat && !matchAuthor) {
          return false;
        }
      }

      return true;
    });

    // Sorting:
    // If "nearest" tab is selected, sort strictly by distance
    // Otherwise keep chronological (newest first, user post at top)
    if (activeTab === "nearest" && userLocation) {
      list.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return list;
  }, [annotatedPosts, activeTab, selectedDistance, selectedCategory, selectedCity, searchQuery, savedPostIds, userLocation]);

  const handleResetFilters = () => {
    setActiveTab("all");
    setSelectedDistance("All");
    setSelectedCategory("All");
    setSelectedCity("All");
    setSearchQuery("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      
      {/* Top Location Reference Banner */}
      <div className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm ${
        darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Your Location:</strong> {userLocation?.locality}, {userLocation?.city}
            {userLocation?.isLiveGps ? ' (Live)' : ' (Manual)'}
          </span>
        </div>
        <button
          onClick={onOpenLocationModal}
          className="text-xs font-bold text-emerald-400 hover:underline self-start sm:self-auto"
        >
          Change
        </button>
      </div>

      {/* Post Composer Card at Top of Feed */}
      <div className="space-y-3">
        <PostComposer 
          darkMode={darkMode}
          onPublishPost={onPublishPost}
          userLocation={userLocation}
          onRequestGps={onRequestGps}
          loadingLocation={loadingLocation}
          locationError={locationError}
          onOpenLocationModal={onOpenLocationModal}
        />
      </div>

      {/* Feed Controls: Search & Tabs */}
      <div className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
        darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts by street, neighborhood, or category..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm border transition-colors ${
              darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
            }`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab Switcher & Distance Filter Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          
          {/* Main Feed Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTab === "all"
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Posts ({posts.length})
            </button>

            <button
              onClick={() => setActiveTab("nearest")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1 ${
                activeTab === "nearest"
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Nearest First</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1 ${
                activeTab === "saved"
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                  : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({savedPostIds.length})</span>
            </button>
          </div>

          {/* Distance Filter Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400">Distance:</span>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${
                darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {DISTANCE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-colors ${
              selectedCategory === "All"
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES_CONFIG.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Feed Stream */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className={`p-12 rounded-3xl border text-center space-y-4 shadow-sm ${
            darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">No Posts Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {selectedDistance !== "All"
                  ? `No problems reported within ${selectedDistance} km of your selected area.`
                  : "No posts match your current search or filter criteria."}
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-400 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard 
              key={post.id}
              post={post}
              darkMode={darkMode}
              userLocation={userLocation}
              onToggleLike={onToggleLike}
              onToggleSave={onToggleSave}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              onAddInformation={onAddInformation}
              isSaved={savedPostIds.includes(post.id)}
              onOpenLocationModal={onOpenLocationModal}
            />
          ))
        )}
      </div>

      {/* Demonstration Notice */}
      <div className={`p-4 rounded-2xl border text-center text-xs space-y-1 ${
        darkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <p className="font-bold text-emerald-400">
          CleanCity AI Community Demonstration
        </p>
        <p className="text-[11px] leading-relaxed max-w-lg mx-auto text-slate-500">
          Sample posts and nearby community member counts are generated for demonstration purposes. CleanCity AI connects local residents to spread awareness and improve neighborhood infrastructure.
        </p>
      </div>

    </div>
  );
}
