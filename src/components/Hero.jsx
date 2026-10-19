import React from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Radio, 
  PlusCircle, 
  MessageSquare,
  Users,
  Compass,
  Building2
} from 'lucide-react';

export function Hero({ 
  setActiveTab, 
  darkMode, 
  postsCount = 40
}) {
  const keyHighlights = [
    { label: "Community Feed", value: `${postsCount} Posts`, note: "Potholes, waste, streetlights, leaks", icon: MessageSquare, color: "text-emerald-400" },
    { label: "Covered Cities", value: "4 Cities", note: "Phagwara, Jalandhar, Ludhiana, Amritsar", icon: MapPin, color: "text-cyan-400" },
    { label: "Notify People Nearby", value: "500m – 5km", note: "Reach neighbors within chosen distance", icon: Radio, color: "text-amber-400" },
    { label: "Local Authority Info", value: "Direct Contact", note: "Call, email, or visit official site", icon: Building2, color: "text-purple-400" }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-800/60">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 blur-3xl pointer-events-none -z-10 rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-4">
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold shadow-sm transition-all ${
            darkMode 
              ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-300' 
              : 'bg-emerald-50 border-emerald-300 text-emerald-800'
          }`}>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide">CleanCity AI</span>
            <span className="text-slate-500">•</span>
            <span className="italic font-medium">Your Neighborhood. Your Voice. Your Community.</span>
          </div>
        </div>

        {/* Main Heading & Value Proposition */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
            <span className={darkMode ? 'text-white' : 'text-slate-900'}>
              Your Neighborhood. Your Voice.
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Your Community.
            </span>
          </h1>

          <p className={`text-sm sm:text-lg font-normal max-w-2xl mx-auto leading-relaxed ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            A neighborhood social network for sharing local civic problems. Post potholes, garbage dumps, broken streetlights, and water leakage. Alert nearby residents with a customizable notification radius and mobilize community action together.
          </p>

          {/* Action Button Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3">
            <button
              onClick={() => setActiveTab('feed')}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all group"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Explore Feed</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-bold border transition-all ${
                darkMode
                  ? 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300'
                  : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 shadow-sm'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Share an Issue</span>
            </button>
          </div>

        </div>

        {/* Feature Teasers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-10">
          {keyHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-[11px] font-semibold text-slate-400">{item.label}</span>
                </div>
                <div className={`text-base sm:text-lg font-black font-mono ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {item.value}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{item.note}</div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
