import React, { useState } from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  AlertTriangle,
  QrCode,
  Calendar
} from 'lucide-react';
import { MUNICIPAL_TICKETS } from '../data/mockData';

export function TicketTrackerModal({ 
  isOpen, 
  onClose, 
  darkMode,
  initialTicketId = "CC-9042"
}) {
  const [searchId, setSearchId] = useState(initialTicketId);
  const [foundTicket, setFoundTicket] = useState(
    MUNICIPAL_TICKETS.find(t => t.id === initialTicketId) || MUNICIPAL_TICKETS[0]
  );
  const [searchError, setSearchError] = useState("");

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    const match = MUNICIPAL_TICKETS.find(t => t.id.toUpperCase() === query);
    if (match) {
      setFoundTicket(match);
      setSearchError("");
    } else {
      setSearchError(`Ticket "${query}" not found in current civic registry. Try searching CC-9042, CC-9038, CC-9029, or CC-9014.`);
    }
  };

  const steps = [
    { title: "Citizen Report Filed", desc: "AI Computer Vision classified hazard", time: foundTicket.reportedAt, done: true },
    { title: "Automated Depot Routing", desc: "Routed to nearest sanitation division", time: "2m after report", done: true },
    { title: "Sanitation Vehicle Dispatched", desc: `${foundTicket.assignedVehicle} en route`, time: "5m after report", done: true },
    { title: "On-Scene Remediation", desc: "Crew physically clearing hazard", time: foundTicket.status === 'Dispatched' ? 'Pending Arrival' : 'Active / Completed', done: foundTicket.status !== 'Dispatched' },
    { title: "AI Visual Cleanliness Certification", desc: "Before/after comparative score confirmed clean", time: foundTicket.resolvedAt || 'Pending Crew Finish', done: foundTicket.status === 'Verified Cleaned' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between sticky top-0 z-10 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md' : 'bg-white/90 border-slate-200 backdrop-blur-md'
        }`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Track Municipal Ticket</h3>
              <p className="text-xs text-slate-400">Real-time GPS dispatch & verification timeline</p>
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

        <div className="p-6 space-y-6">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Ticket ID (e.g. CC-9042)"
                className={`w-full px-4 py-3 rounded-xl text-sm font-mono font-bold bg-transparent border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  darkMode ? 'border-slate-700 text-white' : 'border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 rounded-xl text-xs font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-400 transition-all shrink-0"
            >
              Search
            </button>
          </form>

          {searchError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {searchError}
            </div>
          )}

          {foundTicket && (
            <>
              {/* Ticket Summary Card */}
              <div className={`p-5 rounded-2xl border ${
                darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="font-mono text-cyan-400 font-bold text-sm">
                      {foundTicket.id}
                    </span>
                    <h4 className={`text-base font-extrabold mt-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {foundTicket.title}
                    </h4>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1.5 self-start sm:self-auto ${
                    foundTicket.status === 'Verified Cleaned'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : foundTicket.status === 'In Progress'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span>{foundTicket.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-700/40">
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <p className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {foundTicket.address}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned Unit:</span>
                    <p className="font-semibold text-emerald-400">
                      {foundTicket.assignedCrew}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Estimated Arrival / Status:</span>
                    <p className="font-semibold text-amber-400 font-mono">
                      {foundTicket.eta}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Real-time Operational Milestones
                </span>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                  {steps.map((st, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        st.done 
                          ? 'bg-emerald-500 border-emerald-400 text-white' 
                          : 'bg-slate-800 border-slate-600 text-slate-500'
                      }`}>
                        {st.done ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs sm:text-sm font-bold ${
                            st.done ? (darkMode ? 'text-white' : 'text-slate-900') : 'text-slate-400'
                          }`}>
                            {st.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">({st.time})</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos Comparison Preview */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase">Original Hazard Photo</span>
                  <div className="h-32 rounded-xl overflow-hidden border border-slate-700">
                    <img src={foundTicket.beforeImage} alt="Before" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Cleaned Site Photo</span>
                  <div className="h-32 rounded-xl overflow-hidden border border-slate-700">
                    <img src={foundTicket.afterImage} alt="After" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
