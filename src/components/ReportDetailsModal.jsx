import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { STATUSES_CONFIG } from '../data/syntheticReports';
import { haversineDistance, formatDistance } from '../utils/geoUtils';

export function ReportDetailsModal({ 
  report, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  darkMode,
  userLocation
}) {
  const [copied, setCopied] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(report?.status || "Pending Review");
  const [statusUpdatedFeedback, setStatusUpdatedFeedback] = useState(false);

  if (!isOpen || !report) return null;

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    onUpdateStatus(report.id, newStatus);
    setStatusUpdatedFeedback(true);
    setTimeout(() => setStatusUpdatedFeedback(false), 2500);
  };

  const handleCopyComplaint = () => {
    if (report.complaintDraft) {
      navigator.clipboard.writeText(report.complaintDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto ${
        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between sticky top-0 z-10 ${
          darkMode ? 'bg-slate-900/90 border-slate-800 backdrop-blur-md' : 'bg-white/90 border-slate-200 backdrop-blur-md'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-cyan-400 font-bold text-sm">{report.id}</span>
                {report.isSynthetic ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                    Synthetic Demo Report
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    User Submitted Report
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black truncate max-w-sm mt-0.5">
                {report.title}
              </h3>
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
          
          {/* Key Metas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">City</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400">{report.city}</span>
            </div>
            <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Locality</span>
              <span className="text-xs sm:text-sm font-bold truncate block">{report.locality}</span>
            </div>
            <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Category</span>
              <span className="text-xs sm:text-sm font-bold truncate block">{report.category}</span>
            </div>
            <div className={`p-3 rounded-2xl border ${darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Urgency</span>
              <span className={`text-xs sm:text-sm font-bold ${
                report.urgency === 'Critical' ? 'text-red-400' :
                report.urgency === 'High' ? 'text-amber-400' : 'text-emerald-400'
              }`}>{report.urgency}</span>
            </div>
          </div>

          {/* Location & Distance Privacy Info Banner */}
          <div className={`p-3.5 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
            darkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Approximate Coordinates:</strong> {report.approxLatitude || (report.latitude ? report.latitude.toFixed(3) : '31.224')}° N, {report.approxLongitude || (report.longitude ? report.longitude.toFixed(3) : '75.771')}° E
              </span>
            </div>
            {userLocation && report.latitude && report.longitude && (
              <span className="font-mono text-emerald-400 font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] self-start sm:self-auto">
                {formatDistance(haversineDistance(userLocation.lat, userLocation.lng, report.latitude, report.longitude))}
              </span>
            )}
          </div>

          {/* Demo Status Management Section */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-300'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Update Demo Status (Interactive)</span>
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Simulate municipal workflow transitions. Updates are stored in local session storage and reflect on all dashboard charts.
                </p>
              </div>

              {statusUpdatedFeedback && (
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Status Updated!</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUSES_CONFIG.map((statusName) => (
                <button
                  key={statusName}
                  type="button"
                  onClick={() => handleStatusChange(statusName)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                    report.status === statusName
                      ? statusName === 'Resolved'
                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-md'
                        : statusName === 'In Progress'
                          ? 'bg-amber-500 text-white border-amber-400 shadow-md'
                          : statusName === 'Under Investigation'
                            ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                            : 'bg-blue-600 text-white border-blue-400 shadow-md'
                      : darkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {statusName}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Photo */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Citizen Statement
              </span>
              <p className={`p-3.5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                darkMode ? 'bg-slate-800/30 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                "{report.description}"
              </p>
            </div>

            {report.photo && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Photographic Evidence
                </span>
                <div className="h-48 sm:h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img src={report.photo} alt="Civic issue" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Formal Complaint Draft */}
          {report.complaintDraft && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Generated Formal Complaint Letter
                </span>
                <button
                  onClick={handleCopyComplaint}
                  className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Letter'}</span>
                </button>
              </div>

              <div className={`p-4 rounded-2xl border font-mono text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                {report.complaintDraft}
              </div>
            </div>
          )}

          {/* Status History Audit Trail */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Local Audit History
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              {(report.statusHistory || []).map((log, i) => (
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
  );
}
