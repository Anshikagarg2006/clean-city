import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  PieChart, 
  Zap,
  Globe2
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export function AnalyticsSection({ darkMode, language }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeDay, setActiveDay] = useState('Today');

  const weeklyData = [
    { day: "Mon", diverted: 48, organic: 18, recyclables: 24, ewaste: 6 },
    { day: "Tue", diverted: 52, organic: 20, recyclables: 26, ewaste: 6 },
    { day: "Wed", diverted: 64, organic: 24, recyclables: 32, ewaste: 8 },
    { day: "Thu", diverted: 58, organic: 22, recyclables: 29, ewaste: 7 },
    { day: "Fri", diverted: 76, organic: 28, recyclables: 38, ewaste: 10 },
    { day: "Sat", diverted: 92, organic: 34, recyclables: 48, ewaste: 10 },
    { day: "Sun", diverted: 84, organic: 30, recyclables: 44, ewaste: 10 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>ESG & Sustainability Telemetry</span>
        </div>
        <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Municipal Environmental Impact
        </h2>
        <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Transparent, verifiable open-data metrics measuring landfill diversion, automated dispatch response velocity, and community engagement.
        </p>
      </div>

      {/* 4 Core ESG Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className={`p-6 rounded-3xl border transition-all ${
          darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Waste Diverted</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-black font-mono tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            1,480 Tons
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>+24% vs prior quarter</span>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border transition-all ${
          darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">CO₂e Abatement</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Globe2 className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-black font-mono tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            42,100 kg
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-cyan-400 font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Equivalent to 840 trees</span>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border transition-all ${
          darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Avg Response SLA</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-black font-mono tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            2.4 Hours
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
            <span>64% faster than phone 311</span>
          </div>
        </div>

        <div className={`p-6 rounded-3xl border transition-all ${
          darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase">Citizen Satisfaction</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-black font-mono tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            4.9 / 5.0
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-purple-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>18,400+ verified ratings</span>
          </div>
        </div>
      </div>

      {/* Weekly Waste Diversion Chart */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
        darkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Weekly Municipal Waste Diversion (Metric Tons)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Breakdown across organics composting, recyclable streams, and regulated electronic recycling.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Recyclables</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-teal-500" />
              <span className="text-slate-400">Organics</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-slate-400">E-Waste</span>
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="grid grid-cols-7 gap-2 sm:gap-6 items-end h-64 pt-6 pb-2 border-b border-slate-700/40">
          {weeklyData.map((item, idx) => {
            const maxVal = 100;
            const heightPct = (item.diverted / maxVal) * 100;
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono text-emerald-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.diverted}t
                </span>
                
                <div 
                  style={{ height: `${heightPct}%` }}
                  className="w-full sm:w-12 rounded-2xl flex flex-col justify-end overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-md"
                >
                  <div style={{ height: `${(item.ewaste / item.diverted) * 100}%` }} className="w-full bg-purple-500" />
                  <div style={{ height: `${(item.organic / item.diverted) * 100}%` }} className="w-full bg-teal-500" />
                  <div style={{ height: `${(item.recyclables / item.diverted) * 100}%` }} className="w-full bg-emerald-400" />
                </div>

                <span className="text-xs font-bold text-slate-400 mt-3">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400">
          <span>Data updated live from Municipal Scales & Smart Bin Telemetry</span>
          <span className="text-emerald-400 font-semibold">Total this week: 474 Tons diverted</span>
        </div>
      </div>

    </div>
  );
}
