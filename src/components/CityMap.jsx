import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Compass, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import { CITIES_CONFIG } from '../data/syntheticReports';

export function CityMap({ 
  reports, 
  onSelectReport, 
  darkMode 
}) {
  const [selectedCity, setSelectedCity] = useState("All");

  // Regional geographic approximate positions for the 4 Punjab cities on canvas
  const cityCoordinates = {
    Amritsar: { x: 26, y: 28, color: "#06b6d4", desc: "Heritage Street, Ranjit Avenue, Majitha Rd" },
    Jalandhar: { x: 50, y: 44, color: "#10b981", desc: "Model Town, Rama Mandi, Cantt" },
    Phagwara: { x: 64, y: 56, color: "#8b5cf6", desc: "Law Gate, Model Town, Hadiabad" },
    Ludhiana: { x: 74, y: 72, color: "#f59e0b", desc: "Sarabha Nagar, Focal Point, Dugri" }
  };

  const cityCounts = useMemo(() => {
    const counts = { Amritsar: 0, Jalandhar: 0, Phagwara: 0, Ludhiana: 0 };
    reports.forEach((r) => {
      if (counts[r.city] !== undefined) counts[r.city]++;
    });
    return counts;
  }, [reports]);

  const displayedReports = useMemo(() => {
    if (selectedCity === "All") return reports.slice(0, 30);
    return reports.filter(r => r.city === selectedCity).slice(0, 30);
  }, [reports, selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Regional GIS Demonstration</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Punjab Regional Civic Incident Map
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Spatial distribution of ~200 synthetic and user-filed reports across the GT Road civic corridor.
          </p>
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {["All", "Phagwara", "Jalandhar", "Ludhiana", "Amritsar"].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCity === c
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c} {c !== "All" && `(${cityCounts[c] || 0})`}
            </button>
          ))}
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className={`p-3.5 rounded-2xl border text-xs mb-6 flex items-start space-x-2.5 ${
        darkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900'
      }`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>Map Demonstration Notice:</strong> This interactive visual canvas represents synthetic spatial clustering along the Amritsar–Jalandhar–Phagwara–Ludhiana corridor. It does not interface with live municipality GPS hardware.
        </div>
      </div>

      {/* City Hub Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {Object.keys(cityCoordinates).map((cName) => {
          const info = cityCoordinates[cName];
          const count = cityCounts[cName] || 0;
          return (
            <div
              key={cName}
              onClick={() => setSelectedCity(cName)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedCity === cName
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                  : darkMode
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sm text-white">{cName}</span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400">
                  {count} Reports
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{info.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Map Vector Graphic Canvas */}
      <div className={`relative rounded-3xl border overflow-hidden shadow-2xl h-[480px] sm:h-[540px] select-none ${
        darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-300'
      }`}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="punjab-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#punjab-grid)" />

          {/* GT Road Highway Corridor (NH44) Connecting Amritsar -> Jalandhar -> Phagwara -> Ludhiana */}
          <path
            d="M 260,150 L 500,240 L 640,300 L 740,390"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
          <path
            d="M 260,150 L 500,240 L 640,300 L 740,390"
            fill="none"
            stroke="#34d399"
            strokeWidth="2"
            strokeDasharray="6 8"
          />
          <text x="440" y="215" fill="#34d399" fontSize="11" fontWeight="bold" opacity="0.6">
            NH-44 (GT Road Corridor)
          </text>

          {/* City Nodes */}
          {Object.keys(cityCoordinates).map((cName) => {
            const coords = cityCoordinates[cName];
            const isHighlight = selectedCity === "All" || selectedCity === cName;
            return (
              <g key={cName} opacity={isHighlight ? 1 : 0.4}>
                <circle cx={`${coords.x}%`} cy={`${coords.y}%`} r="34" fill={coords.color} fillOpacity="0.15" />
                <circle cx={`${coords.x}%`} cy={`${coords.y}%`} r="12" fill={coords.color} />
                <text 
                  x={`${coords.x}%`} 
                  y={`${coords.y + 7}%`} 
                  fill="#ffffff" 
                  fontSize="13" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  {cName} ({cityCounts[cName]})
                </text>
              </g>
            );
          })}
        </svg>

        {/* Incident Pins overlaid on canvas */}
        {displayedReports.map((rep, idx) => {
          const cityBase = cityCoordinates[rep.city] || { x: 50, y: 50 };
          // Offset each pin deterministically around its city center
          const angle = (idx * 47) % 360;
          const dist = 3 + (idx % 5) * 2.2;
          const pinX = cityBase.x + dist * Math.cos((angle * Math.PI) / 180);
          const pinY = cityBase.y + dist * Math.sin((angle * Math.PI) / 180);

          return (
            <div
              key={rep.id}
              style={{ left: `${pinX}%`, top: `${pinY}%` }}
              onClick={() => onSelectReport(rep)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              title={`${rep.id}: ${rep.title}`}
            >
              <div className={`p-1.5 rounded-full shadow-lg border transition-transform group-hover:scale-125 ${
                rep.status === 'Resolved'
                  ? 'bg-emerald-500 border-white text-white'
                  : rep.urgency === 'Critical'
                    ? 'bg-red-500 border-white text-white animate-pulse'
                    : 'bg-amber-500 border-white text-white'
              }`}>
                <MapPin className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}

        {/* Bottom Legend */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-xs text-slate-300 gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Critical Urgency</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Pending / Active</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Resolved (Demo)</span>
            </span>
          </div>

          <span className="text-slate-400 font-mono text-[11px]">
            Click pin to inspect report & update demo status
          </span>
        </div>
      </div>

    </div>
  );
}
