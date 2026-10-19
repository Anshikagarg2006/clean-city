import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Filter, 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  ShieldCheck, 
  RefreshCw,
  Info,
  Calendar,
  Layers,
  Compass,
  ArrowUpDown
} from 'lucide-react';
import { CITIES_CONFIG, CATEGORIES_CONFIG, STATUSES_CONFIG } from '../data/syntheticReports';
import { haversineDistance, formatDistance } from '../utils/geoUtils';

const DISTANCE_OPTIONS = [
  { value: "All", label: "All Distances" },
  { value: "0.5", label: "Within 500 m", km: 0.5 },
  { value: "1.0", label: "Within 1 km", km: 1.0 },
  { value: "2.0", label: "Within 2 km", km: 2.0 },
  { value: "5.0", label: "Within 5 km", km: 5.0 },
  { value: "10.0", label: "Within 10 km", km: 10.0 },
  { value: "25.0", label: "Within 25 km", km: 25.0 }
];

export function CivicDashboard({ 
  reports, 
  onSelectReport, 
  darkMode,
  userLocation,
  onOpenLocationModal
}) {
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedLocality, setSelectedLocality] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("All");
  const [selectedDistance, setSelectedDistance] = useState("All");
  const [sortByNearest, setSortByNearest] = useState(true);

  // Dynamic localities for locality dropdown
  const availableLocalities = useMemo(() => {
    if (selectedCity === "All") {
      const allLocs = new Set();
      Object.values(CITIES_CONFIG).forEach(list => list.forEach(loc => allLocs.add(loc)));
      return Array.from(allLocs);
    }
    return CITIES_CONFIG[selectedCity] || [];
  }, [selectedCity]);

  // When city changes, reset locality filter if not in new city
  const handleCityFilterChange = (city) => {
    setSelectedCity(city);
    setSelectedLocality("All");
  };

  // Filtered and distance-annotated reports
  const filteredReports = useMemo(() => {
    const listWithDistance = reports.map((r) => {
      let distanceKm = null;
      if (userLocation && r.latitude && r.longitude) {
        distanceKm = haversineDistance(userLocation.lat, userLocation.lng, r.latitude, r.longitude);
      }
      return {
        ...r,
        distanceKm,
        distanceFormatted: formatDistance(distanceKm)
      };
    });

    const filtered = listWithDistance.filter((r) => {
      if (selectedCity !== "All" && r.city !== selectedCity) return false;
      if (selectedLocality !== "All" && r.locality !== selectedLocality) return false;
      if (selectedCategory !== "All" && r.category !== selectedCategory) return false;
      if (selectedStatus !== "All" && r.status !== selectedStatus) return false;
      if (selectedUrgency !== "All" && r.urgency !== selectedUrgency) return false;

      // Distance radius filter
      if (selectedDistance !== "All") {
        const maxKm = parseFloat(selectedDistance);
        if (r.distanceKm === null || r.distanceKm > maxKm) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = r.id.toLowerCase().includes(q);
        const matchLoc = r.locality.toLowerCase().includes(q);
        const matchDesc = r.description.toLowerCase().includes(q);
        const matchCat = r.category.toLowerCase().includes(q);
        if (!matchId && !matchLoc && !matchDesc && !matchCat) return false;
      }

      return true;
    });

    // Sort by nearest if enabled and userLocation is known
    if (sortByNearest && userLocation) {
      filtered.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return filtered;
  }, [reports, selectedCity, selectedLocality, selectedCategory, selectedStatus, selectedUrgency, selectedDistance, searchQuery, sortByNearest, userLocation]);

  // Dynamic Statistics calculated from filteredReports
  const stats = useMemo(() => {
    const total = filteredReports.length;
    
    // Status breakdown
    const statusCounts = {
      "Pending Review": 0,
      "Under Investigation": 0,
      "In Progress": 0,
      "Resolved": 0
    };

    // Category breakdown
    const categoryCounts = {};
    CATEGORIES_CONFIG.forEach(c => { categoryCounts[c] = 0; });

    // City breakdown
    const cityCounts = {
      Phagwara: 0,
      Jalandhar: 0,
      Ludhiana: 0,
      Amritsar: 0
    };

    // Urgency breakdown
    const urgencyCounts = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };

    filteredReports.forEach((r) => {
      if (statusCounts[r.status] !== undefined) statusCounts[r.status]++;
      if (categoryCounts[r.category] !== undefined) categoryCounts[r.category]++;
      if (cityCounts[r.city] !== undefined) cityCounts[r.city]++;
      if (urgencyCounts[r.urgency] !== undefined) urgencyCounts[r.urgency]++;
    });

    return {
      total,
      statusCounts,
      categoryCounts,
      cityCounts,
      urgencyCounts
    };
  }, [filteredReports]);

  const handleResetFilters = () => {
    setSelectedCity("All");
    setSelectedLocality("All");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSelectedUrgency("All");
    setSelectedDistance("All");
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header & Notice */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>Core Feature • Punjab Civic Dashboard</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Civic Reports & Governance Telemetry
            </h2>
            <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Tracking synthetic and citizen-saved issues across Phagwara, Jalandhar, Ludhiana, and Amritsar.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              Total Registry: <strong>{reports.length} Reports</strong>
            </span>
          </div>
        </div>

        {/* User Location Context Banner */}
        <div className={`mt-4 p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Distance Reference Point:</strong> {userLocation?.locality}, {userLocation?.city}
              {userLocation?.isLiveGps ? ' (GPS Live)' : ' (Manual Preset)'}
            </span>
          </div>
          <button
            onClick={onOpenLocationModal}
            className="text-xs font-bold text-emerald-400 hover:underline self-start sm:self-auto"
          >
            Adjust Reference Location
          </button>
        </div>

        {/* Clear Demonstration Data Notice */}
        <div className={`mt-3 p-3.5 rounded-2xl border text-xs flex items-start space-x-2.5 ${
          darkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>Synthetic Data Notice:</strong> The dashboard includes ~200 synthetic demonstration reports for academic simulation and evaluation. Any new report you file is saved in your local session. Status changes are demo actions that update the local state.
          </div>
        </div>
      </div>

      {/* Multi-Filter Control Console */}
      <div className={`p-5 rounded-3xl border shadow-xl mb-8 space-y-4 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Multi-Parameter Filters</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSortByNearest(!sortByNearest)}
              className={`text-xs font-semibold px-3 py-1 rounded-xl border transition-colors flex items-center space-x-1.5 ${
                sortByNearest
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700 text-slate-400'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{sortByNearest ? 'Sorting: Nearest First' : 'Default Order'}</span>
            </button>

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Distance Filter */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">Max Distance</label>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                selectedDistance !== "All"
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                  : darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {DISTANCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => handleCityFilterChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="All">All Cities (4)</option>
              {Object.keys(CITIES_CONFIG).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Locality Filter */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">Locality / Ward</label>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="All">All Localities</option>
              {availableLocalities.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="All">All Categories (6)</option>
              {CATEGORIES_CONFIG.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">Demo Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="All">All Statuses (4)</option>
              {STATUSES_CONFIG.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-slate-400 font-bold mb-1">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ID, locality, text..."
                className={`w-full px-3 py-2 pl-8 rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Status Metric Cards (Updates on Filter) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold">Pending Review</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-blue-400">{stats.statusCounts["Pending Review"]}</span>
            <span className="text-xs text-slate-500">
              ({stats.total > 0 ? Math.round((stats.statusCounts["Pending Review"] / stats.total) * 100) : 0}%)
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold">Under Investigation</span>
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-purple-400">{stats.statusCounts["Under Investigation"]}</span>
            <span className="text-xs text-slate-500">
              ({stats.total > 0 ? Math.round((stats.statusCounts["Under Investigation"] / stats.total) * 100) : 0}%)
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold">In Progress</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-amber-400">{stats.statusCounts["In Progress"]}</span>
            <span className="text-xs text-slate-500">
              ({stats.total > 0 ? Math.round((stats.statusCounts["In Progress"] / stats.total) * 100) : 0}%)
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold">Resolved (Demo)</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-emerald-400">{stats.statusCounts["Resolved"]}</span>
            <span className="text-xs text-slate-500">
              ({stats.total > 0 ? Math.round((stats.statusCounts["Resolved"] / stats.total) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Breakdown Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Category Distribution Bar Chart */}
        <div className={`lg:col-span-7 p-6 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Category Distribution ({filteredReports.length} Matching)
              </h4>
              <p className="text-[11px] text-slate-400">Dynamically updates as filters change</p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400">Real-time</span>
          </div>

          <div className="space-y-3">
            {CATEGORIES_CONFIG.map((catName) => {
              const count = stats.categoryCounts[catName] || 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={`font-medium truncate max-w-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {catName}
                    </span>
                    <span className="font-mono text-slate-400 shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${pct}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City & Urgency Breakdown */}
        <div className={`lg:col-span-5 p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div>
            <h4 className={`text-sm sm:text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Regional City Distribution
            </h4>
            <p className="text-[11px] text-slate-400 mb-4">Volume per municipal zone in active filter</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {Object.keys(stats.cityCounts).map((cityName) => (
                <div key={cityName} className={`p-3 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <span className="text-[11px] text-slate-400 block font-semibold">{cityName}</span>
                  <span className="text-xl font-black font-mono text-white">{stats.cityCounts[cityName]}</span>
                  <span className="text-[10px] text-slate-500 ml-1">reports</span>
                </div>
              ))}
            </div>

            <h4 className={`text-sm sm:text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Severity Profile
            </h4>
            <div className="flex items-center space-x-2 pt-1">
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-red-500/20 text-red-400">
                Critical: {stats.urgencyCounts.Critical}
              </span>
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400">
                High: {stats.urgencyCounts.High}
              </span>
              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400">
                Med/Low: {stats.urgencyCounts.Medium + stats.urgencyCounts.Low}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            * Charts dynamically synchronize with all selected filters and distance radius.
          </div>
        </div>

      </div>

      {/* Reports Table / Feed */}
      <div className={`p-6 rounded-3xl border shadow-xl ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-4">
          <div>
            <h3 className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Civic Incidents Registry
            </h3>
            <p className="text-xs text-slate-400">
              Showing {filteredReports.length} of {reports.length} total reports {selectedDistance !== "All" && `(within ${selectedDistance} km)`}
            </p>
          </div>

          <span className="text-xs text-slate-400">
            Click any report row to view full details, exact distance, and update demo status
          </span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-slate-400 text-sm">
              {selectedDistance !== "All"
                ? `No civic reports found within ${selectedDistance} km of your location.`
                : "No civic reports match your selected filter criteria."}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-slate-400 font-bold ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <th className="pb-3 pl-2">ID</th>
                  <th className="pb-3">Distance</th>
                  <th className="pb-3">City & Locality</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Urgency</th>
                  <th className="pb-3">Demo Status</th>
                  <th className="pb-3 pr-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredReports.slice(0, 50).map((r) => (
                  <tr 
                    key={r.id}
                    onClick={() => onSelectReport(r)}
                    className={`cursor-pointer transition-colors ${
                      darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 pl-2 font-mono font-bold text-cyan-400">
                      <div className="flex items-center space-x-1.5">
                        <span>{r.id}</span>
                        {!r.isSynthetic && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 whitespace-nowrap">
                      {r.distanceFormatted ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {r.distanceFormatted}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="font-bold text-white block">{r.locality}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{r.city}</span>
                    </td>
                    <td className="py-3 font-medium text-slate-300 max-w-[180px] truncate">
                      {r.category}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.urgency === 'Critical' ? 'bg-red-500/20 text-red-400' :
                        r.urgency === 'High' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400' :
                        r.status === 'In Progress' ? 'bg-amber-500/20 text-amber-400' :
                        r.status === 'Under Investigation' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReport(r);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white font-semibold transition-colors flex items-center space-x-1 ml-auto text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReports.length > 50 && (
              <div className="pt-4 text-center text-xs text-slate-500">
                Displaying nearest 50 matching reports out of {filteredReports.length} total. Adjust filters or search to narrow down.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
