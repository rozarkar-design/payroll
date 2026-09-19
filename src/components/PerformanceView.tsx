import React, { useState } from 'react';
import {
  Award,
  Target,
  Star,
  Flame,
  Sparkles,
  TrendingUp,
  Smile,
  CheckCircle2,
  Trophy,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { SUGARTOWN_BADGES } from '../mockData';

export const PerformanceView: React.FC = () => {
  const {
    employees,
    currentUser,
    currentRole,
    awardBadge,
    triggerConfetti
  } = useHRMS();

  const [activeSubTab, setActiveSubTab] = useState<'kpis' | 'badges' | 'leaderboard'>('kpis');
  const [selectedTargetEmployeeId, setSelectedTargetEmployeeId] = useState(currentUser.id);
  const [selectedBadge, setSelectedBadge] = useState(SUGARTOWN_BADGES[0].id);
  const [badgeNote, setBadgeNote] = useState('');

  const targetEmployee = employees.find(e => e.id === selectedTargetEmployeeId) || currentUser;

  // Mock KPIs for the active employee
  const kpis = [
    { title: 'Artisan Consistency & Taste Benchmarking', target: '98%', current: '99.2%', score: 99, status: 'Exceeding' },
    { title: 'Store Punctuality & Attendance Streak', target: '95%', current: `${targetEmployee.attendanceStreak} Days`, score: 96, status: 'On Track' },
    { title: 'Ingredient Waste Minimization', target: '< 2.5%', current: '1.8%', score: 94, status: 'Exceeding' },
    { title: 'Customer Sweet Smile Feedback Index', target: '4.8 / 5.0', current: '4.95 / 5.0', score: 98, status: 'Outstanding' }
  ];

  const handleConferBadge = () => {
    awardBadge(targetEmployee.id, selectedBadge, badgeNote);
    setBadgeNote('');
  };

  // Sort employees for leaderboard by streak and badges
  const leaderboard = [...employees].sort((a, b) => {
    return (b.attendanceStreak * 2 + b.badges.length * 5) - (a.attendanceStreak * 2 + a.badges.length * 5);
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#201D1A] font-display">Performance & Sugartown Pride</h1>
            <span className="text-xs font-bold text-[#E66A1F] bg-[#FEF4ED] px-2.5 py-0.5 rounded-full">
              Recognition & Excellence
            </span>
          </div>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Quarterly craftsmanship reviews, recipe precision KPIs, sweet badges, and store leaderboards.
          </p>
        </div>

        {/* Employee selector if manager */}
        {currentRole !== 'employee' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#6B655D]">Reviewing:</span>
            <select
              id="performance-employee-selector"
              value={selectedTargetEmployeeId}
              onChange={(e) => setSelectedTargetEmployeeId(e.target.value)}
              className="text-xs font-bold bg-white border border-[#E5E0D2] px-3 py-2 rounded-xl focus:outline-none"
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.fullName} ({emp.designation})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-[#EDEAD9] gap-4 text-xs font-bold text-[#6B655D]">
        <button
          id="tab-kpis-btn"
          onClick={() => setActiveSubTab('kpis')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeSubTab === 'kpis'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          Quarterly Craft KPIs
        </button>
        <button
          id="tab-badges-btn"
          onClick={() => setActiveSubTab('badges')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeSubTab === 'badges'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          Award Sugartown Badges 🍬
        </button>
        <button
          id="tab-leaderboard-btn"
          onClick={() => setActiveSubTab('leaderboard')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeSubTab === 'leaderboard'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          Sugartown Pride Leaderboard
        </button>
      </div>

      {/* TAB 1: CRAFT KPIS */}
      {activeSubTab === 'kpis' && (
        <div className="space-y-6">
          
          {/* Employee Hero Card */}
          <div className="bg-gradient-to-r from-[#FAF8F2] via-white to-[#FEF4ED] p-5 rounded-3xl border border-[#E5E0D2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={targetEmployee.avatar}
                alt={targetEmployee.fullName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#EDEAD9]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#201D1A] font-display">{targetEmployee.fullName}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#EDEAD9] text-[#6B655D]">
                    {targetEmployee.id}
                  </span>
                </div>
                <p className="text-xs text-[#E66A1F] font-bold">{targetEmployee.designation}</p>
                <p className="text-[11px] text-[#6B655D]">{targetEmployee.department} · {targetEmployee.locationName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#EDEAD9] text-center">
                <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Overall Score</span>
                <span className="text-base font-black text-[#396B5A]">4.9 / 5.0</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#EDEAD9] text-center">
                <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Badges Earned</span>
                <span className="text-base font-black text-[#E66A1F]">{targetEmployee.badges.length}</span>
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#201D1A]">{kpi.title}</h4>
                    <span className="text-[11px] text-[#6B655D]">Target standard: {kpi.target}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F4] text-[#396B5A]">
                    {kpi.status}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-[#201D1A]">Current Achievement: {kpi.current}</span>
                    <span className="font-bold text-[#396B5A]">{kpi.score}%</span>
                  </div>
                  <div className="w-full bg-[#FAF8F2] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#E66A1F] h-full rounded-full transition-all"
                      style={{ width: `${kpi.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: AWARD BADGES */}
      {activeSubTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Badge Gallery */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              Official Sugartown Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUGARTOWN_BADGES.map(badge => {
                const isSelected = selectedBadge === badge.id;
                return (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-[#E66A1F] bg-[#FEF4ED] shadow-xs'
                        : 'border-[#E5E0D2] bg-white hover:border-[#A4CDBD]'
                    }`}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: badge.color }}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#201D1A]">{badge.name}</h4>
                      <p className="text-[11px] text-[#6B655D] mt-0.5 leading-snug">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Awarding Action Box */}
          <div className="bg-white p-5 rounded-3xl border border-[#E5E0D2] shadow-xs space-y-4 h-fit">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EDEAD9]">
              <Sparkles className="w-5 h-5 text-[#E66A1F]" />
              <h3 className="text-sm font-bold text-[#201D1A]">Confer Recognition</h3>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#6B655D] block mb-1">Recipient</label>
                <div className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center gap-2">
                  <img src={targetEmployee.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-bold text-[#201D1A]">{targetEmployee.fullName}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B655D] block mb-1">Selected Badge</label>
                <div className="p-2.5 rounded-xl bg-[#FEF4ED] border border-[#E66A1F]/30 font-bold text-[#E66A1F]">
                  {SUGARTOWN_BADGES.find(b => b.id === selectedBadge)?.name}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#6B655D] block mb-1">Note of Praise</label>
                <textarea
                  rows={3}
                  value={badgeNote}
                  onChange={(e) => setBadgeNote(e.target.value)}
                  placeholder="Thank you for always putting the sweetest smile on customers' faces!"
                  className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] focus:outline-none"
                />
              </div>

              <button
                id="submit-confer-badge-btn"
                onClick={handleConferBadge}
                className="w-full py-2.5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white font-bold shadow-xs shadow-[#E66A1F]/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Award Badge to {targetEmployee.fullName.split(' ')[0]} 🎉</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: LEADERBOARD */}
      {activeSubTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl border border-[#E5E0D2] overflow-hidden shadow-2xs space-y-3">
          <div className="p-4 border-b border-[#EDEAD9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#E66A1F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
                Sugartown Confectionery Honor Roll
              </h3>
            </div>
            <span className="text-xs text-[#396B5A] font-bold">Updated Live Across All Locations</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-[#E5E0D2] text-[11px] font-bold text-[#6B655D] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Store Location</th>
                  <th className="py-3 px-4">Attendance Streak</th>
                  <th className="py-3 px-4">Badges Awarded</th>
                  <th className="py-3 px-4 text-right">Pride Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEAD9]">
                {leaderboard.map((emp, rank) => (
                  <tr key={emp.id} className="hover:bg-[#FAF8F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#201D1A]">
                      {rank === 0 ? '🥇 1st' : rank === 1 ? '🥈 2nd' : rank === 2 ? '🥉 3rd' : `#${rank + 1}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={emp.avatar} alt="" className="w-7 h-7 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-[#201D1A]">{emp.fullName}</p>
                          <p className="text-[10px] text-[#6B655D]">{emp.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#6B655D] font-medium">{emp.locationName}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#E66A1F] flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        {emp.attendanceStreak} days
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {emp.badges.map(bId => (
                          <span key={bId} className="w-5 h-5 rounded-full bg-[#E66A1F] text-white flex items-center justify-center text-[9px]" title="Badge">
                            🍬
                          </span>
                        ))}
                        {emp.badges.length === 0 && <span className="text-[#6B655D]">0</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#201D1A]">
                      {emp.attendanceStreak * 15 + emp.badges.length * 50} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
