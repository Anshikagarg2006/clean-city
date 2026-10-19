import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  MapPin, 
  RefreshCw, 
  Radio, 
  Users, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Sparkles, 
  X,
  AlertTriangle,
  Info,
  ShieldCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CITIES_CONFIG, CATEGORIES_CONFIG } from '../data/syntheticReports';
import { 
  countUsersInRadius, 
  approximateCoordinates, 
  LOCALITY_COORDS, 
  PUNJAB_CITIES_COORDS 
} from '../utils/geoUtils';
import { validateAuthorityContact, sanitizeUrl } from '../utils/authorityUtils';

const SAMPLE_DEMO_PHOTOS = [
  { label: "Pothole Hazard", url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80" },
  { label: "Garbage Pile", url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80" },
  { label: "Water Leak", url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80" },
  { label: "Dark Streetlight", url: "/assets/dark-streetlight.jpg" }
];

const RADIUS_OPTIONS = [
  { value: 0.5, label: "500 metres", desc: "Immediate street & neighbors" },
  { value: 1.0, label: "1 kilometre", desc: "Local ward & neighborhood" },
  { value: 2.0, label: "2 kilometres", desc: "Wider area" },
  { value: 5.0, label: "5 kilometres", desc: "Surrounding zone" }
];

export function PostComposer({
  darkMode,
  onPublishPost,
  userLocation,
  onRequestGps,
  loadingLocation,
  locationError,
  onOpenLocationModal
}) {
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState(CATEGORIES_CONFIG[0]);
  const [authorName, setAuthorName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_DEMO_PHOTOS[0].url);
  const [photoFileName, setPhotoFileName] = useState("Sample Pothole");
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const fileInputRef = useRef(null);

  // Location state
  const [city, setCity] = useState(userLocation?.city || "Phagwara");
  const [locality, setLocality] = useState(userLocation?.locality || "Model Town");
  const [latitude, setLatitude] = useState(userLocation?.lat || 31.2240);
  const [longitude, setLongitude] = useState(userLocation?.lng || 75.7708);
  const [manualLocationMode, setManualLocationMode] = useState(false);

  // Notification radius (default 1 km)
  const [notificationRadius, setNotificationRadius] = useState(1.0);

  // Optional Authority Contact Details
  const [showAuthorityFields, setShowAuthorityFields] = useState(false);
  const [authorityName, setAuthorityName] = useState("");
  const [authorityPhone, setAuthorityPhone] = useState("");
  const [authorityEmail, setAuthorityEmail] = useState("");
  const [authorityWebsite, setAuthorityWebsite] = useState("");
  const [authorityErrors, setAuthorityErrors] = useState({});

  // Feedback states
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize when live location updates
  useEffect(() => {
    if (userLocation && !manualLocationMode) {
      if (userLocation.city) setCity(userLocation.city);
      if (userLocation.locality) setLocality(userLocation.locality);
      if (userLocation.lat) setLatitude(userLocation.lat);
      if (userLocation.lng) setLongitude(userLocation.lng);
    }
  }, [userLocation, manualLocationMode]);

  // Dynamic calculation of community reach using Haversine formula
  const nearbyCommunity = useMemo(() => {
    return countUsersInRadius(latitude, longitude, notificationRadius);
  }, [latitude, longitude, notificationRadius]);

  // Handle City Change for manual fallback
  const handleCityChange = (newCity) => {
    setCity(newCity);
    const locs = CITIES_CONFIG[newCity] || [];
    const newLoc = locs[0] || "Center";
    setLocality(newLoc);
    setManualLocationMode(true);

    const coords = (LOCALITY_COORDS[newCity] && LOCALITY_COORDS[newCity][newLoc]) || PUNJAB_CITIES_COORDS[newCity];
    if (coords) {
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    }
  };

  // Handle Locality Change
  const handleLocalityChange = (newLoc) => {
    setLocality(newLoc);
    setManualLocationMode(true);
    const coords = (LOCALITY_COORDS[city] && LOCALITY_COORDS[city][newLoc]) || PUNJAB_CITIES_COORDS[city];
    if (coords) {
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    }
  };

  // Client-side image resize & compression to prevent storage quota issues
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError("Please choose an image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setValidationError("Uploaded image is too large (maximum 8MB).");
      return;
    }

    setValidationError("");
    setPhotoFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 800;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoUrl(compressedDataUrl);
        setIsCustomUpload(true);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setPhotoUrl("");
    setPhotoFileName("");
    setIsCustomUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Publish Post Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      setValidationError("Please write a short description of the problem.");
      return;
    }

    if (!photoUrl) {
      setValidationError("Please add a photo (upload your own or choose a demo sample photo).");
      return;
    }

    // Validate optional authority contact details if provided
    let authorityContact = null;
    if (authorityName.trim() || authorityPhone.trim() || authorityEmail.trim() || authorityWebsite.trim()) {
      const authValidation = validateAuthorityContact({
        phone: authorityPhone,
        email: authorityEmail,
        websiteUrl: authorityWebsite
      });

      if (!authValidation.isValid) {
        setAuthorityErrors(authValidation.errors);
        setValidationError("Please check the authority contact details below.");
        return;
      }

      authorityContact = {
        name: authorityName.trim() || "Local Municipal Department",
        phone: authorityPhone.trim() ? authorityPhone.trim() : null,
        email: authorityEmail.trim() ? authorityEmail.trim() : null,
        websiteUrl: authorityWebsite.trim() ? sanitizeUrl(authorityWebsite.trim()) : null,
        isVerified: false
      };
    }

    setIsSubmitting(true);
    setValidationError("");
    setAuthorityErrors({});

    const approx = approximateCoordinates(latitude, longitude);
    const postId = `CC-PB-POST-${Date.now()}`;
    const authorDisplayName = authorName.trim() || "You (Local Resident)";

    const newPost = {
      id: postId,
      isSynthetic: false,
      author: {
        name: authorDisplayName,
        handle: `@${authorDisplayName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorDisplayName)}`
      },
      title: `${category} at ${locality}`,
      caption: caption.trim(),
      category: category,
      city: city,
      locality: locality,
      latitude: latitude,
      longitude: longitude,
      approxLatitude: approx.lat,
      approxLongitude: approx.lng,
      photo: photoUrl,
      postedAt: "Just now",
      notificationRadiusKm: notificationRadius,
      notifiedCommunityCount: nearbyCommunity.count,
      likes: 0,
      isLikedByUser: false,
      isSavedByUser: false,
      comments: [],
      additionalInfo: [],
      authorityContact: authorityContact,
      description: caption.trim(),
      urgency: "High",
      status: "Community Alerted",
      reportedAt: new Date().toISOString().split('T')[0]
    };

    // Calculate eligible community members for in-app simulated notifications
    const matchedUsers = nearbyCommunity.users || [];
    const simulatedNotifications = matchedUsers.slice(0, 10).map((u) => ({
      id: `notif-${Date.now()}-${u.id}`,
      postId: postId,
      recipientName: u.name,
      recipientLocality: u.locality,
      recipientCity: u.city,
      issueCategory: category,
      issueLocality: locality,
      issueCity: city,
      distanceKm: u.distanceKm,
      distanceFormatted: u.distanceFormatted,
      radiusKm: notificationRadius,
      message: `A new issue (${category}) was posted near your area at ${locality}, ${city}.`,
      timestamp: "Just now",
      read: false
    }));

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // safe fallback
    }

    onPublishPost(newPost, simulatedNotifications);

    // Reset Form
    setCaption("");
    setPhotoUrl(SAMPLE_DEMO_PHOTOS[0].url);
    setPhotoFileName("Sample Pothole");
    setIsCustomUpload(false);
    setShowAuthorityFields(false);
    setAuthorityName("");
    setAuthorityPhone("");
    setAuthorityEmail("");
    setAuthorityWebsite("");
    setIsSubmitting(false);
  };

  return (
    <div className={`p-5 sm:p-6 rounded-3xl border shadow-xl transition-all duration-200 ${
      darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-800/60 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm ring-2 ring-emerald-500/30">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h3 className={`font-black text-base sm:text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Share a Local Issue
          </h3>
          <p className="text-xs text-slate-400">
            Post potholes, garbage, water leaks, or broken streetlights to notify people nearby.
          </p>
        </div>
      </div>

      {validationError && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Author Name (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">
            Your Name (Optional)
          </label>
          <input 
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Jaspreet Singh"
            className={`w-full px-3.5 py-2 rounded-2xl text-xs sm:text-sm border transition-colors ${
              darkMode 
                ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
            }`}
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">
            What's the issue? *
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Describe what happened, exact street or landmark, and how long it has been there..."
            className={`w-full px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm border transition-colors leading-relaxed ${
              darkMode 
                ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' 
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
            }`}
            required
          />
        </div>

        {/* Issue Category */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">
            Category (Optional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES_CONFIG.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : darkMode
                      ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload & Preview Section */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">
            Photo *
          </label>

          {/* Photo Preview if loaded */}
          {photoUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 aspect-[16/9] sm:aspect-[21/9] bg-slate-950 max-h-56">
              <img 
                src={photoUrl} 
                alt="Selected issue" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-sm text-[11px] text-white font-medium">
                {isCustomUpload ? `Uploaded: ${photoFileName}` : `Sample: ${photoFileName}`}
              </div>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/70 hover:bg-rose-600 text-white transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                darkMode ? 'border-slate-700 hover:border-emerald-500 bg-slate-950/40' : 'border-slate-300 hover:border-emerald-500 bg-slate-50'
              }`}
            >
              <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-bold text-slate-300">Click to upload photo</p>
              <p className="text-[11px] text-slate-500 mt-1">JPEG, PNG, or WebP up to 8MB</p>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Quick Demo Sample Photos */}
          <div className="mt-2.5 flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-slate-500 shrink-0 font-medium">Or choose a sample photo:</span>
            {SAMPLE_DEMO_PHOTOS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setPhotoUrl(sample.url);
                  setPhotoFileName(sample.label);
                  setIsCustomUpload(false);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold shrink-0 transition-all ${
                  photoUrl === sample.url
                    ? 'bg-emerald-500 text-white font-bold'
                    : darkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div className={`p-4 rounded-2xl border space-y-3 ${
          darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Location</span>
              {userLocation?.isLiveGps && !manualLocationMode ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Location
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Manual
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onRequestGps}
              disabled={loadingLocation}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${loadingLocation ? 'animate-spin' : ''}`} />
              <span>{loadingLocation ? 'Detecting...' : 'Find My Live Location'}</span>
            </button>
          </div>

          {locationError && (
            <p className="text-[11px] text-amber-400">
              {locationError.message || 'Location access is unavailable. Please choose your location manually.'}
            </p>
          )}

          {/* Current Attached Locality */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1">
            <span>
              <strong>Area:</strong> {locality}, {city}
            </span>
            <span className="font-mono text-[11px] text-emerald-400">
              Approx. {latitude.toFixed(3)}° N, {longitude.toFixed(3)}° E
            </span>
          </div>

          {/* Manual Fallback Dropdowns */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Select City
              </label>
              <select
                value={city}
                onChange={(e) => handleCityChange(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl border ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {Object.keys(CITIES_CONFIG).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Neighborhood
              </label>
              <select
                value={locality}
                onChange={(e) => handleLocalityChange(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl border ${
                  darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                {(CITIES_CONFIG[city] || []).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notify People Nearby (Radius Selection) */}
        <div className={`p-4 rounded-2xl border space-y-2.5 ${
          darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Notify People Nearby</span>
            </div>
            
            {/* Dynamic Calculated Reach */}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              📡 Notifies ~{nearbyCommunity.count} community members nearby
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Choose how far around this issue you want to alert community members:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNotificationRadius(opt.value)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  notificationRadius === opt.value
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-sm'
                    : darkMode
                      ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="font-bold text-xs block">{opt.label}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Your Local Authority (Optional) */}
        <div className={`rounded-2xl border overflow-hidden ${
          darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => setShowAuthorityFields(!showAuthorityFields)}
            className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold transition-colors hover:bg-emerald-500/5"
          >
            <div className="flex items-center space-x-2 text-slate-300">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Contact Your Local Authority (Optional)</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {showAuthorityFields ? '— Click to collapse' : '— Add contact info if known'}
              </span>
            </div>
            {showAuthorityFields ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showAuthorityFields && (
            <div className="p-4 pt-0 space-y-3 text-xs border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 leading-relaxed pt-2">
                If you know the municipal department responsible, you can add their contact details so neighbors can reach out directly. You can leave this blank.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Department or Authority Name
                </label>
                <input
                  type="text"
                  value={authorityName}
                  onChange={(e) => setAuthorityName(e.target.value)}
                  placeholder="e.g. Municipal Corporation Phagwara - Roads Department"
                  className={`w-full px-3 py-1.5 rounded-xl border ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={authorityPhone}
                    onChange={(e) => setAuthorityPhone(e.target.value)}
                    placeholder="e.g. +91 1824 260232"
                    className={`w-full px-3 py-1.5 rounded-xl border ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  {authorityErrors.phone && (
                    <span className="text-[10px] text-rose-400 block mt-0.5">{authorityErrors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={authorityEmail}
                    onChange={(e) => setAuthorityEmail(e.target.value)}
                    placeholder="e.g. commissioner@mcphagwara.gov.in"
                    className={`w-full px-3 py-1.5 rounded-xl border ${
                      darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  {authorityErrors.email && (
                    <span className="text-[10px] text-rose-400 block mt-0.5">{authorityErrors.email}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Website Link (Optional)
                </label>
                <input
                  type="url"
                  value={authorityWebsite}
                  onChange={(e) => setAuthorityWebsite(e.target.value)}
                  placeholder="e.g. https://mcphagwara.punjab.gov.in"
                  className={`w-full px-3 py-1.5 rounded-xl border ${
                    darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                {authorityErrors.websiteUrl && (
                  <span className="text-[10px] text-rose-400 block mt-0.5">{authorityErrors.websiteUrl}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Share Post Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Share Post</span>
          </button>
        </div>

      </form>
    </div>
  );
}
