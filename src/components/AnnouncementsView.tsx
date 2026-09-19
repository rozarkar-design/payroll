import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Send,
  Sparkles,
  Calendar,
  Gift,
  Heart,
  MessageSquare,
  Cake,
  Pin,
  X
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { Announcement } from '../types';

export const AnnouncementsView: React.FC = () => {
  const {
    announcements,
    addAnnouncement,
    currentRole,
    currentUser,
    employees,
    triggerConfetti
  } = useHRMS();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Announcement['category']>('Sweet Milestone');
  const [isPinned, setIsPinned] = useState(false);

  // Quick store shoutout message simulator
  const [shoutoutText, setShoutoutText] = useState('');
  const [shoutouts, setShoutouts] = useState([
    { id: '1', sender: 'Marco Rossi', location: 'DUMBO Candy Café', text: 'Huge shoutout to the morning pastry crew! Our raspberry tarts sold out before 11 AM! 🥐✨', time: '10:45 AM' },
    { id: '2', sender: 'Antoine Bell', location: 'Long Island City Factory', text: 'Vanilla caramel batch #402 passed laboratory viscosity test with 100% score! 🍯', time: '1:15 PM' }
  ]);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      title: newTitle,
      content: newContent,
      category: newCategory,
      author: currentUser.fullName,
      authorRole: currentUser.designation,
      pinned: isPinned
    });
    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  const handleSendShoutout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoutoutText.trim()) return;
    setShoutouts([
      {
        id: `shout-${Date.now()}`,
        sender: currentUser.fullName,
        location: currentUser.locationName,
        text: shoutoutText,
        time: 'Just now'
      },
      ...shoutouts
    ]);
    setShoutoutText('');
    triggerConfetti();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#201D1A] font-display">Communication & Store Pulse</h1>
            <span className="text-xs font-bold text-[#E66A1F] bg-[#FEF4ED] px-2.5 py-0.5 rounded-full">
              Real-Time SugarWire
            </span>
          </div>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Official executive bulletins, seasonal flavor launches, birthdays, anniversaries, and inter-store cheer.
          </p>
        </div>

        {currentRole !== 'employee' && (
          <button
            id="create-announcement-btn"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Official Announcements Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B655D]">
              Official Company Bulletin
            </h3>
            <span className="text-xs text-[#E66A1F] font-bold">
              {announcements.length} Active Bulletins
            </span>
          </div>

          <div className="space-y-3.5">
            {announcements.map(item => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.pinned
                    ? 'bg-gradient-to-br from-[#FEF4ED] to-white border-[#E66A1F]/30 shadow-xs'
                    : 'bg-white border-[#E5E0D2] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.category === 'Sweet Milestone' || item.category === 'Birthday' || item.category === 'Anniversary'
                        ? 'bg-[#EEF7F4] text-[#396B5A]'
                        : item.category === 'HR Update'
                        ? 'bg-[#EDEAD9] text-[#6B655D]'
                        : item.category === 'Store Update'
                        ? 'bg-[#FEF4ED] text-[#E66A1F]'
                        : 'bg-[#FAF8F2] text-[#201D1A]'
                    }`}>
                      {item.category}
                    </span>
                    {item.pinned && (
                      <span className="text-[10px] font-bold text-[#E66A1F] flex items-center gap-1">
                        <Pin className="w-3 h-3 rotate-45" />
                        Pinned Notice
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#6B655D]">{item.date}</span>
                </div>

                <h4 className="text-sm font-bold text-[#201D1A] mt-2 font-display">{item.title}</h4>
                <p className="text-xs text-[#6B655D] leading-relaxed mt-1.5">{item.content}</p>

                <div className="mt-4 pt-3 border-t border-[#FAF8F2] flex items-center justify-between text-[11px] text-[#6B655D]">
                  <span className="font-medium">Issued by <strong className="text-[#201D1A]">{item.author}</strong> ({item.authorRole})</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => triggerConfetti()} 
                      className="hover:text-[#E66A1F] flex items-center gap-1 font-semibold transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#E66A1F]" />
                      <span>Cheer!</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inter-Store Shoutouts & Celebrations */}
        <div className="space-y-4">
          
          {/* Birthdays & Anniversaries Card */}
          <div className="bg-white p-4.5 rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#EDEAD9]">
              <Cake className="w-4 h-4 text-[#E66A1F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#201D1A]">
                September Sweet Celebrations
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#FEF4ED] border border-[#E66A1F]/20 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#201D1A]">Elena Rostova 🎂</p>
                  <span className="text-[10px] text-[#6B655D]">Birthday on Sept 22 (Turning 27!)</span>
                </div>
                <button
                  onClick={() => triggerConfetti()}
                  className="px-2 py-1 rounded-lg bg-[#E66A1F] text-white text-[10px] font-bold"
                >
                  Send Cake 🎉
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EEF7F4] border border-[#A4CDBD]/40 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#201D1A]">Marco Rossi 🌟</p>
                  <span className="text-[10px] text-[#6B655D]">3-Year Sugartown Anniversary</span>
                </div>
                <button
                  onClick={() => triggerConfetti()}
                  className="px-2 py-1 rounded-lg bg-[#396B5A] text-white text-[10px] font-bold"
                >
                  Salute 👏
                </button>
              </div>
            </div>
          </div>

          {/* Inter-Store Chat Shoutout Stream */}
          <div className="bg-white p-4.5 rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3 flex flex-col h-[400px]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#EDEAD9]">
              <MessageSquare className="w-4 h-4 text-[#E66A1F]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#201D1A]">
                Cross-Store SugarWire
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {shoutouts.map(msg => (
                <div key={msg.id} className="p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#201D1A]">{msg.sender}</span>
                    <span className="text-[10px] text-[#6B655D]">{msg.time}</span>
                  </div>
                  <span className="text-[10px] text-[#E66A1F] block">{msg.location}</span>
                  <p className="text-[#6B655D] leading-snug">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendShoutout} className="pt-2 border-t border-[#EDEAD9] flex gap-2">
              <input
                id="shoutout-message-input"
                type="text"
                value={shoutoutText}
                onChange={(e) => setShoutoutText(e.target.value)}
                placeholder="Post sweet encouragement to team..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] focus:outline-none"
              />
              <button
                id="submit-shoutout-btn"
                type="submit"
                className="p-2 rounded-xl bg-[#E66A1F] text-white hover:bg-[#D25A12] transition-colors"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E0D2] shadow-2xl space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEAD9]">
              <h3 className="text-sm font-bold text-[#201D1A]">Broadcast Announcement</h3>
              <button onClick={() => setShowCreateModal(false)}><X className="w-4 h-4 text-[#6B655D]" /></button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Headline</label>
                <input
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mandatory Autumn Caramel Workshop"
                  className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]"
                  >
                    <option value="Sweet Milestone">Sweet Milestone</option>
                    <option value="HR Update">HR Update</option>
                    <option value="Store Update">Store Update</option>
                    <option value="Training">Training</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="rounded text-[#E66A1F]"
                    />
                    <span>Pin to top</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Message Content</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Details, dates, required attendance or store guidelines..."
                  className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-3 py-1.5 text-[#6B655D]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E66A1F] text-white rounded-xl font-bold shadow-xs">Publish Bulletin</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
