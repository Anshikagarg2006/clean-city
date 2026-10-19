import React, { useState } from 'react';
import { 
  MapPin, 
  X, 
  Compass, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  Info
} from 'lucide-react';
import { CITIES_CONFIG } from '../data/syntheticReports';
import { PUNJAB_CITIES_COORDS, LOCALITY_COORDS } from '../utils/geoUtils';

export function LocationPickerModal({
  isOpen,
  onClose,
  location,
  loading,
  error,
  onRequestGps,
  onSetManualLocation,
  darkMode
}) {
  const [selectedCity, setSelectedCity] = useState(location?.city || "Phagwara");
  const [selectedLocality, setSelectedLocality] = useState(location?.locality || "Model Town");
  const [customStreet, setCustomStreet] = useState("");

  if (!isOpen) return null;

  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    const locs = CITIES_CONFIG[newCity] || [];
    setSelectedLocality(locs[0] || "");
  };

  const handleSaveManual = () => {
    const activeLocality = customStreet.trim() || selectedLocality;
    onSetManualLocation(selectedCity, activeLocality);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between sticky top-0 z-10 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md' : 'bg-white/90 border-slate-200 backdrop-blur-md'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black">Your Location</h3>
              <p className="text-xs text-slate-400">Set your city and neighborhood to see local issues</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
              darkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs sm:text-sm">
          
          {/* Current Status Box */}
          <div className={`p-4 rounded-2xl border ${
            darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Current Area
            </span>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  {location?.locality}, {location?.city}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {location?.approxLat}° N, {location?.approxLng}° E • {location?.isLiveGps ? '📍 Live Location' : '✏️ Chosen Manually'}
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                location?.isLiveGps 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {location?.isLiveGps ? 'Live Location' : 'Manual'}
              </span>
            </div>
          </div>

          {/* Location Request Button & Loading State */}
          <div className="space-y-2">
            <button
              onClick={onRequestGps}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-75"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Finding your location...' : 'Find My Live Location'}</span>
            </button>

            {loading && (
              <p className="text-center text-xs text-cyan-400 animate-pulse">
                Looking up your neighborhood...
              </p>
            )}

            {error && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Notice:</strong> {error.message || 'Location access is unavailable. Please choose your location manually.'}
                </div>
              </div>
            )}
          </div>

          {/* Privacy Statement */}
          <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
            darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center space-x-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Your Location Privacy</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              We only check your location when you ask. Your exact street address is never shown publicly—posts only show approximate neighborhood areas to protect your privacy.
            </p>
          </div>

          {/* Manual Selection Fallback */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Or Choose Your Area Manually
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {Object.keys(CITIES_CONFIG).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Neighborhood</label>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {(CITIES_CONFIG[selectedCity] || []).map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={customStreet}
                onChange={(e) => setCustomStreet(e.target.value)}
                placeholder="Optional street or landmark name"
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  darkMode ? 'bg-slate-800/60 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <button
              onClick={handleSaveManual}
              className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Use This Location
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
