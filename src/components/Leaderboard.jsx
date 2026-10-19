import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Medal, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Train, 
  Zap, 
  Trees, 
  ShoppingBag,
  Gift,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEADERBOARD, REDEEMABLE_REWARDS } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

export function Leaderboard({ 
  darkMode, 
  language, 
  userKarma, 
  setUserKarma 
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [claimedReward, setClaimedReward] = useState(null);

  const iconMap = {
    Train: Train,
    Zap: Zap,
    Trees: Trees,
    ShoppingBag: ShoppingBag
  };

  const handleRedeem = (reward) => {
    if (userKarma < reward.cost) {
      alert(`You need ${reward.cost - userKarma} more EcoKarma points to redeem this perk! Report waste incidents or join cleanup drives to earn points.`);
      return;
    }

    setUserKarma((prev) => prev - reward.cost);
    setClaimedReward(reward);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4" />
          <span>Civic Gamification & Eco-Karma</span>
        </div>
        <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {t.leaderboardTitle}
        </h2>
        <p className={`mt-2 text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Every verified AI waste report earns EcoKarma points redeemable for municipal transit, clean energy utility discounts, and tree planting initiatives.
        </p>
      </div>

      {/* User's EcoKarma Balance Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border mb-10 shadow-xl relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-amber-500/30' 
          : 'bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border-amber-300'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>YOUR CIVIC BALANCE</span>
            </div>
            <div className="flex items-baseline space-x-3">
              <span className={`text-4xl sm:text-5xl font-black font-mono ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {userKarma.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-amber-400 uppercase tracking-wide">
                EcoKarma Points
              </span>
            </div>
            <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Ranked <strong className="text-emerald-400">#42 in City Sector 4</strong> • Next milestone: <em>"Urban Forest Patron"</em> at 3,000 pts
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Reports Filed</div>
              <div className="text-xl font-black text-emerald-400 font-mono">14 Verified</div>
            </div>
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Active Streak</div>
              <div className="text-xl font-black text-amber-400 font-mono">7 Days 🔥</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Columns: Left Leaderboard Champions | Right Redeemable Perks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Top Champions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>TOP CIVIC GUARDIANS</span>
            <span>THIS MONTH</span>
          </div>

          <div className="space-y-3">
            {LEADERBOARD.map((item) => (
              <div
                key={item.rank}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                  item.rank === 1
                    ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : darkMode
                      ? 'border-slate-800 bg-slate-800/40'
                      : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs font-mono ${
                    item.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-md' :
                    item.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    item.rank === 3 ? 'bg-amber-700 text-white' :
                    darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.rank}
                  </div>

                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400/40"
                  />

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.handle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">{item.badge}</span>
                      <span>•</span>
                      <span>{item.district}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-sm sm:text-base text-amber-400">
                    {item.points.toLocaleString()} pts
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {item.verifiedReports} verified • {item.streakDays}d streak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Redeemable Rewards Shop */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>REDEEM CIVIC REWARDS</span>
            <span>POWERED BY CITY PARTNERS</span>
          </div>

          <div className="space-y-3">
            {REDEEMABLE_REWARDS.map((rew) => {
              const Icon = iconMap[rew.icon] || Gift;
              const canAfford = userKarma >= rew.cost;

              return (
                <div
                  key={rew.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 shrink-0 border border-emerald-500/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {rew.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Sponsored by {rew.sponsor}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="font-mono text-xs font-black text-amber-400">
                            {rew.cost} EcoKarma
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({rew.claimed} claimed by citizens)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRedeem(rew)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 active:scale-95'
                          : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Redeem Perk
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Claimed Receipt Modal Banner */}
          {claimedReward && (
            <div className={`p-4 rounded-2xl border animate-bounce ${
              darkMode ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-xs">
                  <strong>Voucher Issued!</strong> Your digital voucher for "{claimedReward.title}" has been sent to your digital civic wallet.
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
