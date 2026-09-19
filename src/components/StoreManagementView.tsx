import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Users,
  Clock,
  Phone,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Building,
  Coffee,
  Factory,
  ShoppingBag
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { StoreLocationId } from '../types';

export const StoreManagementView: React.FC = () => {
  const {
    locations,
    employees,
    attendanceRecords,
    currentRole,
    currentUser,
    setSelectedLocationFilter,
    setActiveTab
  } = useHRMS();

  const [activeStoreId, setActiveStoreId] = useState<StoreLocationId>('loc_cafe_brooklyn');

  const activeStore = locations.find(l => l.id === activeStoreId) || locations[0];
  const storeEmployees = employees.filter(e => e.locationId === activeStoreId);

  const todayStr = '2026-09-18';
  const storeTodayAttendance = attendanceRecords.filter(r => r.locationId === activeStoreId && r.date === todayStr);
  const presentCount = storeTodayAttendance.filter(r => r.status === 'present' || r.status === 'late').length;

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'Corporate Office': return Building;
      case 'Factory': return Factory;
      case 'Candy Café': return Coffee;
      case 'Boutique': return Sparkles;
      default: return Store;
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#201D1A] font-display">Store & Team Management</h1>
        <p className="text-xs text-[#6B655D] mt-0.5">
          Organize staff across Corporate Headquarters, Factory, Candy Café, Retail Stores, and Boutiques.
        </p>
      </div>

      {/* Locations Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {locations.map(loc => {
          const Icon = getLocationIcon(loc.type);
          const isSelected = loc.id === activeStoreId;
          const locHeadcount = employees.filter(e => e.locationId === loc.id).length;

          return (
            <button
              key={loc.id}
              id={`select-location-card-${loc.id}`}
              onClick={() => setActiveStoreId(loc.id)}
              className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#E66A1F] bg-[#FEF4ED] shadow-xs ring-1 ring-[#E66A1F]'
                  : 'border-[#E5E0D2] bg-white hover:border-[#A4CDBD]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#E66A1F] text-white' : 'bg-[#FAF8F2] text-[#6B655D]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDEAD9] text-[#6B655D]">
                    {loc.type}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#201D1A] line-clamp-1">{loc.name}</h3>
                <p className="text-[11px] text-[#6B655D] mt-0.5">{loc.city}</p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#EDEAD9] flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#201D1A]">{locHeadcount} Staff</span>
                <span className="text-[10px] font-bold text-[#396B5A]">Active</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Store Detail & Roster */}
      <div className="bg-white rounded-3xl border border-[#E5E0D2] p-6 shadow-xs space-y-6">
        
        {/* Store Profile Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EDEAD9]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E66A1F]/10 flex items-center justify-center text-[#E66A1F] shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#201D1A] font-display">{activeStore.name}</h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF7F4] text-[#396B5A]">
                  Geofence Radius: {activeStore.geofenceRadiusMeters}m
                </span>
              </div>
              <p className="text-xs text-[#6B655D] mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E66A1F]" />
                {activeStore.address}, {activeStore.city}
              </p>
              <p className="text-xs text-[#6B655D] mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#6B655D]" />
                {activeStore.phone} · Hours: {activeStore.openTime} - {activeStore.closeTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] text-center min-w-[100px]">
              <span className="text-[10px] text-[#6B655D] block uppercase font-bold">Store Lead</span>
              <span className="text-xs font-bold text-[#201D1A]">{activeStore.managerName}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] text-center min-w-[100px]">
              <span className="text-[10px] text-[#6B655D] block uppercase font-bold">On Shift Today</span>
              <span className="text-xs font-bold text-[#396B5A]">{presentCount} / {storeEmployees.length}</span>
            </div>
          </div>
        </div>

        {/* Store Team Roster */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E66A1F]" />
              <h3 className="text-sm font-bold text-[#201D1A]">Store Staff Roster ({storeEmployees.length})</h3>
            </div>
            <span className="text-xs text-[#6B655D]">
              Direct reporting to {activeStore.managerName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {storeEmployees.map(emp => (
              <div key={emp.id} className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.fullName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#EDEAD9]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#201D1A]">{emp.fullName}</h4>
                    <p className="text-[11px] text-[#6B655D] font-medium">{emp.designation}</p>
                    <span className="text-[10px] text-[#E66A1F] font-semibold">{emp.department}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F4] text-[#396B5A] block mb-1">
                    {emp.employmentStatus}
                  </span>
                  <span className="text-[10px] font-mono text-[#6B655D]">{emp.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
