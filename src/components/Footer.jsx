import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  PlusCircle, 
  Compass, 
  Info, 
  Heart,
  Bookmark
} from 'lucide-react';

export function Footer({ darkMode, setActiveTab }) {
  return (
    <footer className={`border-t transition-colors duration-200 ${
      darkMode 
        ? 'bg-slate-950 border-slate-800 text-slate-400' 
        : 'bg-slate-900 border-slate-800 text-slate-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                CleanCity <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 font-semibold italic">
              "Your Neighborhood. Your Voice. Your Community."
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              A civic social networking platform for sharing local civic problems, alerting neighbors within a notification radius, and taking community action.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('feed')} className="hover:text-emerald-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-emerald-400 transition-colors">
                  Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('saved')} className="hover:text-emerald-400 transition-colors">
                  Saved
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('create')} className="hover:text-emerald-400 transition-colors text-emerald-400 font-semibold">
                  Share an Issue
                </button>
              </li>
            </ul>
          </div>

          {/* Covered Municipalities */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Covered Cities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Phagwara</li>
              <li>• Jalandhar</li>
              <li>• Ludhiana</li>
              <li>• Amritsar</li>
            </ul>
          </div>

          {/* Prototype Transparency Notice */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Project Transparency</span>
            </h4>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              CleanCity AI is a community demonstration platform. Baseline posts, community profiles, and nearby notification alerts are simulated for demonstration. Local authority contact links let you connect with relevant municipal offices directly.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} CleanCity AI • Your Neighborhood. Your Voice. Your Community.
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <span>Built for community action with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>in Punjab</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
