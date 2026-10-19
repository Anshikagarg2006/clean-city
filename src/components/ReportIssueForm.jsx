import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  MapPin, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Camera, 
  Send, 
  RefreshCw,
  Info,
  Radio,
  Users,
  Compass,
  Sliders,
  Building2,
  Phone,
  Mail,
  Globe,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CITIES_CONFIG, CATEGORIES_CONFIG, URGENCIES_CONFIG } from '../data/syntheticReports';
import { generateProfessionalComplaint } from '../utils/complaintGenerator';
import { countUsersInRadius, approximateCoordinates, LOCALITY_COORDS, PUNJAB_CITIES_COORDS } from '../utils/geoUtils';
import { validateAuthorityContact, sanitizeUrl, MUNICIPAL_AUTHORITIES_PUNJAB } from '../utils/authorityUtils';

const SAMPLE_PHOTOS = [
  { label: "Pothole Road", url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80" },
  { label: "Garbage Pile", url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80" },
  { label: "Open Drain", url: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80" },
  { label: "Dark Streetlight", url: "/assets/dark-streetlight.jpg" }
];

const RADIUS_OPTIONS = [
  { value: 0.5, label: "500 metres", desc: "Immediate street & neighbors" },
  { value: 1.0, label: "1 kilometre", desc: "Local ward & sub-sector" },
  { value: 2.0, label: "2 kilometres", desc: "Wider neighborhood zone" },
  { value: 5.0, label: "5 kilometres", desc: "Municipal zonal perimeter" }
];

export function ReportIssueForm({ 
  darkMode, 
  onSaveReport, 
  onViewDashboard,
  userLocation,
  onRequestGps,
  loadingLocation,
  locationError
}) {
  const [city, setCity] = useState(userLocation?.city || "Phagwara");
  const [locality, setLocality] = useState(userLocation?.locality || (CITIES_CONFIG["Phagwara"] ? CITIES_CONFIG["Phagwara"][0] : "Model Town"));
  const [customLocality, setCustomLocality] = useState("");
  const [latitude, setLatitude] = useState(userLocation?.lat || 31.2240);
  const [longitude, setLongitude] = useState(userLocation?.lng || 75.7708);
  const [notificationRadius, setNotificationRadius] = useState(1.0); // 1 km default
  
  const [category, setCategory] = useState(CATEGORIES_CONFIG[0]);
  const [urgency, setUrgency] = useState("Medium");
  const [description, setDescription] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_PHOTOS[0].url);
  const [photoFileName, setPhotoFileName] = useState("sample_pothole.jpg");
  
  // Complaint Generation State
  const [complaintDraft, setComplaintDraft] = useState("");
  const [complaintSource, setComplaintSource] = useState("");
  const [isGeneratingComplaint, setIsGeneratingComplaint] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form submission state
  const [savedSuccess, setSavedSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state whenever userLocation changes via GPS or manual picker
  useEffect(() => {
    if (userLocation) {
      if (userLocation.city) setCity(userLocation.city);
      if (userLocation.locality) setLocality(userLocation.locality);
      if (userLocation.lat) setLatitude(userLocation.lat);
      if (userLocation.lng) setLongitude(userLocation.lng);
    }
  }, [userLocation]);

  // Calculate nearby community members falling within selected radius using Haversine formula
  const nearbyCommunity = useMemo(() => {
    return countUsersInRadius(latitude, longitude, notificationRadius);
  }, [latitude, longitude, notificationRadius]);

  const handleCityChange = (newCity) => {
    setCity(newCity);
    const localities = CITIES_CONFIG[newCity] || [];
    const newLoc = localities[0] || "";
    setLocality(newLoc);
    setCustomLocality("");

    // Update coordinates for locality center
    const coords = (LOCALITY_COORDS[newCity] && LOCALITY_COORDS[newCity][newLoc]) || PUNJAB_CITIES_COORDS[newCity];
    if (coords) {
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    }
  };

  const handleLocalityChange = (newLoc) => {
    setLocality(newLoc);
    const coords = (LOCALITY_COORDS[city] && LOCALITY_COORDS[city][newLoc]) || PUNJAB_CITIES_COORDS[city];
    if (coords) {
      setLatitude(coords.lat);
      setLongitude(coords.lng);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateComplaint = async () => {
    if (!description.trim()) {
      setErrorMsg("Please enter a short description of the civic problem before generating a formal complaint.");
      return;
    }
    setErrorMsg("");
    setIsGeneratingComplaint(true);

    const activeLocality = customLocality.trim() || locality;
    const result = await generateProfessionalComplaint({
      category,
      description,
      city,
      locality: activeLocality,
      urgency,
      citizenName: citizenName.trim() || "Concerned Citizen",
      photoAttached: Boolean(photoUrl)
    });

    setComplaintDraft(result.text);
    setComplaintSource(result.source);
    setIsGeneratingComplaint(false);
  };

  const handleCopyComplaint = () => {
    if (complaintDraft) {
      navigator.clipboard.writeText(complaintDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg("Please provide a description of the issue.");
      return;
    }

    const activeLocality = customLocality.trim() || locality;
    const newReportId = `CC-PB-${Math.floor(2000 + Math.random() * 8000)}`;
    const today = new Date().toISOString().split('T')[0];
    const approx = approximateCoordinates(latitude, longitude);

    const newReport = {
      id: newReportId,
      isSynthetic: false, // Real user submitted!
      title: `${category} at ${activeLocality}`,
      category,
      city,
      locality: activeLocality,
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
      approxLatitude: approx.lat,
      approxLongitude: approx.lng,
      notificationRadiusKm: notificationRadius,
      notifiedCommunityCount: nearbyCommunity.count,
      description: description.trim(),
      photo: photoUrl,
      urgency,
      status: "Pending Review",
      reportedAt: today,
      citizenName: citizenName.trim() || "Local Citizen",
      complaintDraft: complaintDraft || `Formal complaint draft pending generation.`,
      statusHistory: [
        { time: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, text: "Report submitted by citizen and saved to local registry." }
      ]
    };

    onSaveReport(newReport);
    setSavedSuccess(newReport);
    setErrorMsg("");
  };

  const handleResetForm = () => {
    setDescription("");
    setCitizenName("");
    setCustomLocality("");
    setComplaintDraft("");
    setSavedSuccess(null);
    setErrorMsg("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Title & Honest Framing */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Core Feature • Civic Grievance Intake</span>
        </div>
        <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Report a Civic Issue with Live Location
        </h2>
        <p className={`mt-2 text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Automatic GPS coordinates attach directly to your report. Select a community notification radius to alert nearby residents, and generate a formal complaint letter.
        </p>

        {/* Prominent Legal / Prototype Disclosure */}
        <div className={`mt-4 p-3.5 rounded-2xl border text-xs flex items-start space-x-2.5 ${
          darkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>Demonstration & Notification Notice:</strong> Reports are stored in your local session registry. Community alerts are simulated using the Haversine radius model. CleanCity AI does not send real external push notifications or directly file complaints into municipal government portals without authorized integration.
          </div>
        </div>
      </div>

      {savedSuccess ? (
        /* Success Screen */
        <div className={`p-8 rounded-3xl border shadow-xl text-center space-y-5 ${
          darkMode ? 'bg-slate-900 border-emerald-500/40 text-slate-100' : 'bg-white border-emerald-300 text-slate-900'
        }`}>
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              REPORT ID: {savedSuccess.id}
            </span>
            <h3 className="text-2xl font-black mt-2">Civic Report Saved Successfully!</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Your issue for <strong>{savedSuccess.locality}, {savedSuccess.city}</strong> has been stored in the CleanCity AI registry and added to the live municipal dashboard.
            </p>
          </div>

          {/* Simulated Notification Confirmation Banner */}
          <div className={`max-w-md mx-auto p-4 rounded-2xl border text-left text-xs space-y-2 ${
            darkMode ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200' : 'bg-cyan-50 border-cyan-300 text-cyan-950'
          }`}>
            <div className="flex items-center space-x-2 font-bold text-cyan-400">
              <Users className="w-4 h-4" />
              <span>Simulated Community Alert Triggered</span>
            </div>
            <p className="leading-relaxed">
              <strong>{savedSuccess.notifiedCommunityCount} nearby demo community members</strong> within <strong>{savedSuccess.notificationRadiusKm >= 1 ? `${savedSuccess.notificationRadiusKm} km` : `${savedSuccess.notificationRadiusKm * 1000} m`}</strong> would receive a simulated civic push alert. (Demo simulation - no real SMS or notifications sent).
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl border text-left text-xs space-y-2 bg-slate-800/40 border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Category:</span>
              <span className="font-semibold text-white">{savedSuccess.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="font-semibold text-white">{savedSuccess.locality}, {savedSuccess.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">GPS Coordinates:</span>
              <span className="font-mono font-semibold text-emerald-400">{savedSuccess.approxLatitude}° N, {savedSuccess.approxLongitude}° E (approx)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Urgency:</span>
              <span className="font-semibold text-amber-400">{savedSuccess.urgency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Demo Status:</span>
              <span className="font-semibold text-cyan-400">{savedSuccess.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onViewDashboard(savedSuccess.id)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 active:scale-95 transition-all text-sm"
            >
              View in Live Dashboard
            </button>
            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors text-sm"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* Main Report Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            {/* Step 1: Automatic Live Location & Jurisdiction */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>1. Live Location & Jurisdiction</span>
                </div>

                {/* GPS Trigger / Refresh Button */}
                <button
                  type="button"
                  onClick={onRequestGps}
                  disabled={loadingLocation}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingLocation ? 'animate-spin' : ''}`} />
                  <span>{loadingLocation ? 'Detecting your location...' : 'Re-Detect GPS'}</span>
                </button>
              </div>

              {/* Live Location Feedback Banner */}
              <div className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                userLocation?.isLiveGps
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : darkMode
                    ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    <strong>Attached Coordinates:</strong> {latitude?.toFixed(4)}° N, {longitude?.toFixed(4)}° E
                    {userLocation?.isLiveGps ? ' (GPS Live)' : ' (Locality Preset)'}
                  </span>
                </div>
                <span className="text-[11px] font-mono opacity-80">
                  Auto-populated into report
                </span>
              </div>

              {locationError && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{locationError.message}</span>
                </div>
              )}

              {/* City & Locality inputs (pre-filled, fully editable) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City Selector */}
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    City (Punjab) <span className="text-emerald-400 font-normal">(Auto-detected)</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {Object.keys(CITIES_CONFIG).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Locality Selector */}
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Locality / Ward <span className="text-emerald-400 font-normal">(Auto-detected)</span>
                  </label>
                  <select
                    value={locality}
                    onChange={(e) => handleLocalityChange(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {(CITIES_CONFIG[city] || []).map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Or enter custom street/locality */}
              <div>
                <input
                  type="text"
                  value={customLocality}
                  onChange={(e) => setCustomLocality(e.target.value)}
                  placeholder="Or refine exact street, chowk, or landmark name if different from above"
                  className={`w-full px-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800/60 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Step 2: Community Notification Radius */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>2. Community Notification Radius</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  Haversine Spherical Model
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {RADIUS_OPTIONS.map((opt) => {
                  const isSelected = notificationRadius === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setNotificationRadius(opt.value)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/15 shadow-md shadow-cyan-500/10'
                          : darkMode
                            ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700 text-slate-400'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-extrabold text-sm text-white">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Live Nearby Community Calculation Pill */}
              <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
                darkMode ? 'bg-slate-950 border-cyan-500/30' : 'bg-cyan-50/50 border-cyan-200'
              }`}>
                <div className="flex items-center space-x-2.5">
                  <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong>{nearbyCommunity.count} community members</strong> within {notificationRadius >= 1 ? `${notificationRadius} km` : `${notificationRadius * 1000} m`} of coordinates.
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Demo Simulated
                </span>
              </div>
            </div>

            {/* Step 3: Category & Urgency */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>3. Classification & Severity</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Issue Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    {CATEGORIES_CONFIG.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Urgency Rating
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {URGENCIES_CONFIG.map((urg) => (
                      <button
                        type="button"
                        key={urg}
                        onClick={() => setUrgency(urg)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          urgency === urg
                            ? urg === 'Critical'
                              ? 'bg-red-500 text-white border-red-400 shadow-md'
                              : urg === 'High'
                                ? 'bg-amber-500 text-white border-amber-400 shadow-md'
                                : 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                            : darkMode
                              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {urg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Description & Citizen Info */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>4. Description of Public Problem</span>
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Factual Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue (e.g. Deep crater pothole 2 feet wide opposite Gurudwara entrance, causing vehicles to veer into oncoming traffic for the past 5 days)..."
                  className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Complainant Name (Optional)
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Gurpreet Singh / Local Resident"
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Step 5: Photo Attachment */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Camera className="w-4 h-4 text-purple-400" />
                <span>5. Photographic Evidence</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Upload or Choose Sample */}
                <div className="space-y-3">
                  <label className="cursor-pointer flex items-center justify-center space-x-2 p-4 rounded-2xl border-2 border-dashed hover:border-emerald-500 transition-colors border-slate-700 bg-slate-800/40">
                    <Upload className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-300">Upload Photo from Device</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>

                  <div>
                    <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                      Or select sample test photo:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {SAMPLE_PHOTOS.map((sp) => (
                        <button
                          type="button"
                          key={sp.label}
                          onClick={() => {
                            setPhotoUrl(sp.url);
                            setPhotoFileName(sp.label);
                          }}
                          className={`p-2 rounded-xl text-xs font-medium border text-left truncate transition-colors ${
                            photoUrl === sp.url
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          📷 {sp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Photo Preview */}
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-500">No photo selected</span>
                  )}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-slate-300">
                    {photoFileName}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 6: Professional Complaint Generator */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>6. Automated Grievance Drafting Engine</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate an administrative complaint formatted according to municipal standards.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateComplaint}
                  disabled={isGeneratingComplaint}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md hover:from-cyan-400 hover:to-emerald-400 transition-all flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingComplaint ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingComplaint ? 'Drafting Grievance...' : 'Draft Formal Complaint'}</span>
                </button>
              </div>

              {complaintDraft && (
                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-emerald-400">
                      SOURCE: {complaintSource}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyComplaint}
                      className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Letter'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={complaintDraft}
                    onChange={(e) => setComplaintDraft(e.target.value)}
                    className="w-full bg-transparent font-mono text-xs leading-relaxed focus:outline-none text-slate-300 resize-y"
                  />

                  <div className="text-[11px] text-slate-500 italic">
                    * You can edit this text directly or copy it for your municipal records.
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Saves to CleanCity AI Demo Registry with {latitude?.toFixed(4)}° N, {longitude?.toFixed(4)}° E
              </span>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Save Report to Dashboard</span>
              </button>
            </div>

          </div>
        </form>
      )}

    </div>
  );
}
