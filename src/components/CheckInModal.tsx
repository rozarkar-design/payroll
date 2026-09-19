import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    checkIn,
    isEmployeeCheckedIn,
    getTodayAttendance,
    triggerConfetti
  } = useHRMS();

  const [currentTime, setCurrentTime] = useState('');
  const [gpsSimulatedDistance, setGpsSimulatedDistance] = useState(14); // 14 meters from beacon
  const [selfieSnapped, setSelfieSnapped] = useState(false);
  const [isVerifyingGps, setIsVerifyingGps] = useState(false);
  const [selectedShift, setSelectedShift] = useState('Morning Sweet Shift (07:00 - 15:00)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const isCheckedIn = isEmployeeCheckedIn(currentUser.id);
  const todayRec = getTodayAttendance(currentUser.id);

  const handleSimulateGps = () => {
    setIsVerifyingGps(true);
    setTimeout(() => {
      setGpsSimulatedDistance(Math.floor(Math.random() * 20) + 8);
      setIsVerifyingGps(false);
    }, 600);
  };

  const handleSnapSelfie = () => {
    setSelfieSnapped(true);
    triggerConfetti();
  };

  const handleConfirmCheckIn = () => {
    const result = checkIn(
      currentUser.id,
      selfieSnapped ? currentUser.avatar : undefined,
      gpsSimulatedDistance
    );
    if (result.success) {
      triggerConfetti();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#E5E0D2] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#FAF8F2] via-white to-[#FEF4ED] p-5 border-b border-[#EDEAD9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E66A1F] text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#201D1A]">Store Clock-In & Verification</h3>
              <p className="text-[11px] text-[#6B655D]">Sugartown Smart Geofence Attendance</p>
            </div>
          </div>

          <button onClick={onClose} className="text-[#6B655D] hover:text-[#201D1A] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Employee & Time Banner */}
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#EDEAD9]"
              />
              <div>
                <span className="font-bold text-[#201D1A] block">{currentUser.fullName}</span>
                <span className="text-[10px] text-[#6B655D]">{currentUser.locationName}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#6B655D] uppercase font-bold block">Current Time</span>
              <span className="font-mono text-base font-black text-[#E66A1F]">{currentTime || '08:45:00 AM'}</span>
            </div>
          </div>

          {/* Shift Selection */}
          <div>
            <label className="text-[11px] font-bold text-[#6B655D] block mb-1">Assigned Shift</label>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] font-medium text-[#201D1A] focus:outline-none"
            >
              <option value="Morning Sweet Shift (07:00 - 15:00)">Morning Sweet Shift (07:00 - 15:00)</option>
              <option value="Mid Day Confectionery Rush (11:00 - 19:00)">Mid Day Confectionery Rush (11:00 - 19:00)</option>
              <option value="Evening Closing & Sanitation (14:00 - 22:00)">Evening Closing & Sanitation (14:00 - 22:00)</option>
              <option value="General Store Shift (09:00 - 18:00)">General Store Shift (09:00 - 18:00)</option>
            </select>
          </div>

          {/* GPS Geofence Check */}
          <div className="p-3.5 rounded-2xl border border-[#EDEAD9] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E66A1F]" />
                <span className="font-bold text-[#201D1A]">Store Geofence Beacon</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F4] text-[#396B5A] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified In-Store ({gpsSimulatedDistance}m)
              </span>
            </div>
            <p className="text-[11px] text-[#6B655D]">
              Hardware beacon at <strong className="text-[#201D1A]">{currentUser.locationName}</strong> requires proximity within 50m.
            </p>
            <button
              onClick={handleSimulateGps}
              className="text-[10px] font-semibold text-[#E66A1F] hover:underline"
            >
              {isVerifyingGps ? 'Pinging Beacon...' : 'Re-verify GPS Beacon Position'}
            </button>
          </div>

          {/* Selfie Smile Check */}
          <div className="p-3.5 rounded-2xl border border-[#EDEAD9] bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#E66A1F]" />
                <span className="font-bold text-[#201D1A]">Store Selfie Verification</span>
              </div>
              {selfieSnapped ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F4] text-[#396B5A] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Selfie Captured
                </span>
              ) : (
                <span className="text-[10px] text-[#6B655D] font-medium">Required for Store Open</span>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden bg-stone-100 aspect-video flex items-center justify-center border border-[#EDEAD9]">
              <img
                src={currentUser.avatar}
                alt="Selfie preview"
                className={`w-full h-full object-cover transition-opacity ${selfieSnapped ? 'opacity-100' : 'opacity-40 grayscale'}`}
              />
              {!selfieSnapped && (
                <button
                  onClick={handleSnapSelfie}
                  className="absolute px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs font-bold text-xs text-[#201D1A] shadow-sm hover:bg-white flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-[#E66A1F]" />
                  <span>Snap Sweet Smile 📸</span>
                </button>
              )}
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="text-[11px] font-bold text-[#6B655D] block mb-1">Shift Notes / Station</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Opening barista & brioche counter station"
              className="w-full p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] text-xs focus:outline-none"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF8F2] border-t border-[#EDEAD9] flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#6B655D] hover:bg-[#EDEAD9]"
          >
            Cancel
          </button>
          
          <button
            id="confirm-clock-in-btn"
            onClick={handleConfirmCheckIn}
            className="px-5 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/30 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Confirm Clock-In</span>
          </button>
        </div>

      </div>
    </div>
  );
};
