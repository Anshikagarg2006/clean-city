import React from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  MapPin, 
  Users, 
  AlertCircle, 
  ExternalLink,
  Info,
  Radio
} from 'lucide-react';

export function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  onSelectPost,
  darkMode
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="relative p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center space-x-2">
                <span>Nearby Notifications</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear all alerts"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Friendly Transparency Notice */}
        <div className={`p-3.5 border-b text-xs flex items-start space-x-2.5 ${
          darkMode ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}>
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <div className="leading-relaxed">
            <strong>How Nearby Notifications Work:</strong> When a neighbor shares an issue and sets an alert area (e.g. 1 km), community members within that distance receive an alert in this feed.
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Radio className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No notifications yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                When someone shares a problem near your location, alerts will appear here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onMarkAsRead(n.id);
                  if (onSelectPost && n.postId) {
                    onSelectPost(n.postId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                  !n.read
                    ? darkMode
                      ? 'bg-slate-800/90 border-emerald-500/40 text-slate-100 shadow-md'
                      : 'bg-emerald-50/60 border-emerald-300 text-slate-900 shadow-sm'
                    : darkMode
                      ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className={!n.read ? 'text-emerald-400' : 'text-slate-400'}>
                      Nearby Alert • {n.recipientName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {n.timestamp || 'Recent'}
                  </span>
                </div>

                <p className="leading-relaxed my-1 font-medium">
                  {n.message || `A new issue was posted near your area.`}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-700/40 mt-1.5 flex-wrap gap-1">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{n.issueLocality}, {n.issueCity}</span>
                  </span>
                  {n.distanceFormatted && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                      {n.distanceFormatted}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className={`p-3 border-t text-center text-xs ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <button
              onClick={() => notifications.forEach(n => onMarkAsRead(n.id))}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              Mark all as read
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
