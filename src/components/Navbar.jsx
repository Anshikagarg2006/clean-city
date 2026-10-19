import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Moon, 
  Sun, 
  Globe, 
  Menu, 
  X, 
  Home, 
  Compass,
  Bookmark,
  Bell
} from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode, 
  postsCount,
  unreadNotificationsCount = 0,
  onOpenNotificationsModal,
  location,
  loadingLocation,
  onOpenLocationModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Compass },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount }
  ];

  const handleNavClick = (id) => {
    if (id === 'notifications') {
      onOpenNotificationsModal();
    } else {
      setActiveTab(id);
    }
  };

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
      darkMode 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
        : 'bg-white/90 border-slate-200 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('feed')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-200">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  CleanCity AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Community Hub
                </span>
              </div>
              <p className={`text-[11px] font-medium hidden sm:block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Your Neighborhood. Your Voice. Your Community.
              </p>
            </div>
          </div>

          {/* Desktop Navigation (Home, Map, Saved, Notifications) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 font-bold'
                      : darkMode
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Location Pill, Notification Bell, Theme */}
          <div className="hidden lg:flex items-center space-x-2.5">
            
            {/* Location Pill */}
            <button
              onClick={onOpenLocationModal}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                loadingLocation
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 animate-pulse'
                  : location?.isLiveGps
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    : darkMode
                      ? 'border-slate-800 bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Click to view or adjust location"
            >
              <MapPin className={`w-3.5 h-3.5 ${location?.isLiveGps ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="max-w-[130px] truncate">
                {loadingLocation 
                  ? 'Finding...' 
                  : location 
                    ? `${location.locality}, ${location.city}` 
                    : 'Set Location'}
              </span>
              {location?.isLiveGps && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={onOpenNotificationsModal}
              className={`relative p-2 rounded-xl border transition-colors ${
                unreadNotificationsCount > 0
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : darkMode
                    ? 'border-slate-800 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-colors ${
                darkMode 
                  ? 'border-slate-800 bg-slate-800/50 text-amber-300 hover:bg-slate-800' 
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Theme"
              aria-label="Toggle Dark / Light Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>

          {/* Mobile Right Controls: Notification bell + Menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            
            <button
              onClick={onOpenNotificationsModal}
              className="relative p-2 rounded-xl border border-slate-700 bg-slate-800/80 text-emerald-400"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                darkMode 
                  ? 'border-slate-800 bg-slate-800/60 text-slate-200' 
                  : 'border-slate-200 bg-slate-100 text-slate-800'
              }`}
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-3 pb-5 space-y-3 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Mobile Location Banner */}
          <div 
            onClick={() => {
              onOpenLocationModal();
              setMobileMenuOpen(false);
            }}
            className="p-3 rounded-xl border border-slate-800 bg-slate-800/40 text-xs flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{location?.locality}, {location?.city}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">Change</span>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-white font-bold'
                      : darkMode
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center space-x-2 text-xs font-semibold text-slate-400"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
            </button>
          </div>

        </div>
      )}

    </header>
  );
}
