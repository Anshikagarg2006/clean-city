import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  SlidersHorizontal, 
  UserCheck, 
  ArrowRight, 
  Calendar, 
  Filter, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { MUNICIPAL_TICKETS } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export function MunicipalDashboard({ darkMode, language, onTrackTicket }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [tickets, setTickets] = useState(MUNICIPAL_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState(MUNICIPAL_TICKETS[0]);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeTabFilter, setActiveTabFilter] = useState('All');

  const handleUpdateStatus = (ticketId, nextStatus) => {
    setTickets((prev) =>
      prev.map((tic) => {
        if (tic.id === ticketId) {
          const updated = { ...tic, status: nextStatus };
          if (selectedTicket.id === ticketId) setSelectedTicket(updated);
          return updated;
        }
        return tic;
      })
    );
  };

  const filteredTickets = activeTabFilter === 'All'
    ? tickets
    : tickets.filter(t => t.status.toLowerCase().includes(activeTabFilter.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Civic Operations Center</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.commandCenter}
          </h2>
          <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Triage citizen alerts, monitor fleet deployment, and verify photographic cleanliness using differential AI vision.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {['All', 'Dispatched', 'In Progress', 'Verified Cleaned'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTabFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeTabFilter === status
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : darkMode
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Ticket Triage List | Right Ticket Detail & Before/After Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Ticket List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>ACTIVE INCIDENTS ({filteredTickets.length})</span>
            <span>SORT: BY PRIORITY</span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {filteredTickets.map((tic) => {
              const isSelected = selectedTicket.id === tic.id;
              return (
                <div
                  key={tic.id}
                  onClick={() => setSelectedTicket(tic)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 text-xs ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                      : darkMode
                        ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700 text-slate-300'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-cyan-400">{tic.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      tic.status === 'Verified Cleaned'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : tic.status === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {tic.status}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold truncate mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {tic.title}
                  </h4>

                  <p className="text-slate-400 truncate mb-2">{tic.address}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/40">
                    <span>{tic.assignedVehicle}</span>
                    <span className="text-emerald-400 font-semibold font-mono">ETA {tic.eta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Ticket Inspector & Before/After Slider */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-6 rounded-3xl border shadow-xl ${
            darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/40 gap-2 mb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-cyan-400 font-bold text-sm">
                    {selectedTicket.id}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-semibold text-slate-400">
                    Reported {selectedTicket.reportedAt}
                  </span>
                </div>
                <h3 className={`text-xl font-black mt-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedTicket.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTicket.address}</p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center space-x-2">
                {selectedTicket.status !== 'Verified Cleaned' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'Verified Cleaned')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-400 active:scale-95 transition-all flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AI Verify Cleaned</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resolution Certified</span>
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Before / After Split Slider */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-red-400 uppercase tracking-wider font-mono">BEFORE: HAZARD DETECTED</span>
                <span className="text-slate-400 font-mono text-[11px]">DRAG TO INSPECT</span>
                <span className="text-emerald-400 uppercase tracking-wider font-mono">AFTER: AI VERIFIED CLEAN</span>
              </div>

              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg select-none">
                {/* AFTER Image (Full width background) */}
                <img 
                  src={selectedTicket.afterImage} 
                  alt="After cleanup" 
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* BEFORE Image (Clipped by slider position) */}
                <div 
                  style={{ width: `${sliderPosition}%` }}
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl z-10"
                >
                  <img 
                    src={selectedTicket.beforeImage} 
                    alt="Before cleanup" 
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 text-[10px] font-mono text-red-400 font-bold">
                    ORIGINAL REPORT
                  </span>
                </div>

                <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/75 text-[10px] font-mono text-emerald-400 font-bold z-0">
                  CLEANED SITE
                </span>

                {/* Draggable Divider Handle */}
                <div 
                  style={{ left: `${sliderPosition}%` }}
                  className="absolute inset-y-0 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none"
                >
                  <div className="w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-emerald-500 text-slate-800">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                {/* Native Range input for slider movement */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
                  aria-label="Before and after comparison slider"
                />
              </div>
            </div>

            {/* Crew Details & Live Audit Log */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className={`p-3.5 rounded-2xl border ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[11px] font-semibold text-slate-400 mb-1">
                  Assigned Municipal Unit
                </div>
                <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedTicket.assignedCrew}
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-1">
                  Vehicle: {selectedTicket.assignedVehicle}
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[11px] font-semibold text-slate-400 mb-1">
                  Reporter & Civic Points
                </div>
                <div className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {selectedTicket.reportedBy}
                </div>
                <div className="text-xs text-amber-400 font-semibold mt-1">
                  {selectedTicket.ecoKarmaAwarded || "+50 EcoKarma Pts"}
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Automated Incident Audit Trail
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {selectedTicket.logs?.map((log, i) => (
                  <div key={i} className="flex items-start space-x-2 text-slate-400">
                    <span className="text-cyan-400 font-bold shrink-0">[{log.time}]</span>
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
