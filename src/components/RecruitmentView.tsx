import React, { useState } from 'react';
import {
  Briefcase,
  UserCheck,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  Sparkles,
  Award,
  X
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { Candidate, CandidateStage, JobOpening, DepartmentType } from '../types';

export const RecruitmentView: React.FC = () => {
  const {
    jobOpenings,
    candidates,
    updateCandidateStage,
    updateOnboardingItem,
    addJobOpening,
    addCandidate,
    locations,
    triggerConfetti
  } = useHRMS();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'openings'>('pipeline');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showAddOpeningModal, setShowAddOpeningModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);

  // New Opening Form
  const [newJob, setNewJob] = useState({
    title: '',
    department: 'Confectionery Production' as DepartmentType,
    locationName: 'Artisan Confectionery Factory',
    type: 'Full-Time' as const,
    openingsCount: 1,
    status: 'Active' as const,
    description: '',
    requirements: 'Food safety awareness, team enthusiasm, high precision.'
  });

  // New Candidate Form
  const [newCand, setNewCand] = useState({
    jobId: jobOpenings[0]?.id || 'job-1',
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    rating: 5,
    resumeSummary: '',
    notes: ''
  });

  const stages: CandidateStage[] = [
    'Applied',
    'Screening',
    'Tasting & Trial',
    'Store Manager Round',
    'Offer Extended',
    'Hired'
  ];

  const handleStageChange = (candId: string, newStage: CandidateStage) => {
    updateCandidateStage(candId, newStage);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    addJobOpening({
      title: newJob.title,
      department: newJob.department,
      locationName: newJob.locationName,
      type: newJob.type,
      openingsCount: Number(newJob.openingsCount),
      status: 'Active',
      description: newJob.description,
      requirements: newJob.requirements.split(',').map(s => s.trim())
    });
    setShowAddOpeningModal(false);
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobOpenings.find(j => j.id === newCand.jobId);
    addCandidate({
      jobId: newCand.jobId,
      jobTitle: job ? job.title : 'Artisan Confectioner',
      fullName: newCand.fullName,
      email: newCand.email,
      phone: newCand.phone,
      experience: newCand.experience,
      currentStage: 'Applied',
      rating: newCand.rating,
      resumeSummary: newCand.resumeSummary,
      notes: newCand.notes,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
    setShowAddCandidateModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#201D1A] font-display">Recruitment & Talent Pipeline</h1>
            <span className="text-xs font-bold text-[#E66A1F] bg-[#FEF4ED] px-2.5 py-0.5 rounded-full">
              {candidates.length} Active Applicants
            </span>
          </div>
          <p className="text-xs text-[#6B655D] mt-0.5">
            Artisan candidate trials, kitchen tastings, store supervisor interviews, and onboarding checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-candidate-trigger-btn"
            onClick={() => setShowAddCandidateModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5E0D2] hover:bg-[#FAF8F2] text-xs font-bold text-[#201D1A] shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#396B5A]" />
            <span>Add Candidate</span>
          </button>
          <button
            id="post-job-trigger-btn"
            onClick={() => setShowAddOpeningModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold shadow-xs shadow-[#E66A1F]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Job Opening</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EDEAD9] gap-4 text-xs font-bold text-[#6B655D]">
        <button
          id="tab-recruitment-pipeline-btn"
          onClick={() => setActiveTab('pipeline')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeTab === 'pipeline'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          Hiring Pipeline (Kanban)
        </button>
        <button
          id="tab-job-openings-btn"
          onClick={() => setActiveTab('openings')}
          className={`py-2.5 border-b-2 font-semibold transition-colors ${
            activeTab === 'openings'
              ? 'border-[#E66A1F] text-[#E66A1F]'
              : 'border-transparent hover:text-[#201D1A]'
          }`}
        >
          Job Openings ({jobOpenings.length})
        </button>
      </div>

      {/* TAB 1: KANBAN PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1100px]">
            {stages.map(stage => {
              const stageCandidates = candidates.filter(c => c.currentStage === stage);

              return (
                <div key={stage} className="w-72 shrink-0 bg-[#FAF8F2] rounded-2xl border border-[#E5E0D2] p-3 flex flex-col max-h-[750px]">
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#EDEAD9]">
                    <span className="text-xs font-bold text-[#201D1A]">{stage}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#EDEAD9] text-[#6B655D]">
                      {stageCandidates.length}
                    </span>
                  </div>

                  {/* Candidate Cards */}
                  <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                    {stageCandidates.map(cand => (
                      <div
                        key={cand.id}
                        id={`candidate-card-${cand.id}`}
                        onClick={() => setSelectedCandidate(cand)}
                        className="p-3.5 bg-white rounded-xl border border-[#EDEAD9] hover:border-[#E66A1F] shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={cand.avatar}
                              alt={cand.fullName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-[#201D1A]">{cand.fullName}</h4>
                              <p className="text-[10px] text-[#E66A1F] font-semibold line-clamp-1">{cand.jobTitle}</p>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#E66A1F] font-bold flex items-center gap-0.5">
                            ★ {cand.rating}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#6B655D] line-clamp-2 leading-tight">
                          {cand.resumeSummary}
                        </p>

                        <div className="pt-2 border-t border-[#FAF8F2] flex items-center justify-between">
                          <span className="text-[9px] text-[#6B655D]">Applied {cand.appliedDate}</span>
                          <button
                            id={`stage-move-btn-${cand.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextIdx = stages.indexOf(stage) + 1;
                              if (nextIdx < stages.length) {
                                handleStageChange(cand.id, stages[nextIdx]);
                              }
                            }}
                            className="text-[10px] font-bold text-[#E66A1F] hover:underline"
                          >
                            Advance →
                          </button>
                        </div>
                      </div>
                    ))}

                    {stageCandidates.length === 0 && (
                      <div className="p-4 text-center text-[11px] text-[#6B655D] border border-dashed border-[#EDEAD9] rounded-xl">
                        No candidates in {stage}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: JOB OPENINGS */}
      {activeTab === 'openings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobOpenings.map(job => (
            <div key={job.id} className="p-5 bg-white rounded-2xl border border-[#E5E0D2] shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF4ED] text-[#E66A1F]">
                    {job.type}
                  </span>
                  <h3 className="text-base font-bold text-[#201D1A] mt-1.5 font-display">{job.title}</h3>
                  <p className="text-xs text-[#6B655D]">{job.department} · {job.locationName}</p>
                </div>

                <span className="text-xs font-bold text-[#396B5A] bg-[#EEF7F4] px-2.5 py-1 rounded-full">
                  {job.openingsCount} Slot{job.openingsCount > 1 ? 's' : ''} Open
                </span>
              </div>

              <p className="text-xs text-[#6B655D] leading-relaxed">{job.description}</p>

              <div className="pt-2 border-t border-[#EDEAD9]">
                <span className="text-[11px] font-bold text-[#201D1A] block mb-1">Key Requirements</span>
                <div className="flex flex-wrap gap-1.5">
                  {job.requirements.map((req, i) => (
                    <span key={i} className="text-[10px] bg-[#FAF8F2] border border-[#EDEAD9] px-2 py-0.5 rounded text-[#6B655D]">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Profile & Onboarding Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#E5E0D2] shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between pb-3 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.fullName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#201D1A]">{selectedCandidate.fullName}</h3>
                  <p className="text-xs text-[#E66A1F] font-semibold">{selectedCandidate.jobTitle}</p>
                  <p className="text-[11px] text-[#6B655D]">{selectedCandidate.email} · {selectedCandidate.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-[#6B655D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="text-xs font-bold text-[#6B655D] block mb-1">Current Hiring Stage</label>
              <select
                id="select-candidate-stage"
                value={selectedCandidate.currentStage}
                onChange={(e) => handleStageChange(selectedCandidate.id, e.target.value as CandidateStage)}
                className="w-full text-xs p-2 bg-[#FAF8F2] rounded-xl border border-[#EDEAD9] font-bold text-[#201D1A]"
              >
                {stages.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Resume / Background */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9] text-xs space-y-1">
              <span className="font-bold text-[#201D1A] block">Candidate Background</span>
              <p className="text-[#6B655D]">{selectedCandidate.resumeSummary}</p>
              <p className="text-[11px] text-[#E66A1F] font-semibold mt-1">Experience: {selectedCandidate.experience}</p>
            </div>

            {/* Onboarding Checklist (If Hired or in Offer stage) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#FEF4ED] to-[#FAF8F2] border border-[#E66A1F]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#E66A1F]">Sugartown Onboarding Checklist</span>
                <span className="text-[10px] text-[#396B5A] font-semibold">Ready for Day 1</span>
              </div>

              <div className="space-y-1.5 text-xs">
                {[
                  { key: 'welcomeKitSent', label: 'Sugartown Sweet Welcome Kit & Apron Dispatched' },
                  { key: 'uniformFitted', label: 'Store Uniform & Hairnet Fitting Completed' },
                  { key: 'foodSafetyCompleted', label: 'Food Safety & Allergen Training Verified' },
                  { key: 'bankDetailsSubmitted', label: 'Direct Deposit Banking Form Submitted' },
                  { key: 'recipeHandbookGiven', label: 'Confidential Recipe Handbook & Tasting Guide' }
                ].map(item => {
                  const isChecked = selectedCandidate.onboardingChecklist 
                    ? (selectedCandidate.onboardingChecklist as any)[item.key]
                    : false;

                  return (
                    <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => updateOnboardingItem(selectedCandidate.id, item.key, e.target.checked)}
                        className="rounded border-[#EDEAD9] text-[#E66A1F] focus:ring-[#E66A1F]"
                      />
                      <span className={isChecked ? 'line-through text-[#6B655D]' : 'text-[#201D1A]'}>
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#E5E0D2] text-xs font-bold text-[#201D1A]"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Job Opening Modal */}
      {showAddOpeningModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E0D2] shadow-2xl space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEAD9]">
              <h3 className="text-sm font-bold text-[#201D1A]">Post New Job Opening</h3>
              <button onClick={() => setShowAddOpeningModal(false)}><X className="w-4 h-4 text-[#6B655D]" /></button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Job Title</label>
                <input
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g. Master Truffle Decorator"
                  className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Store / Location</label>
                  <select
                    value={newJob.locationName}
                    onChange={(e) => setNewJob({ ...newJob, locationName: e.target.value })}
                    className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                  >
                    {locations.map(l => (
                      <option key={l.id} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">Slots Open</label>
                  <input
                    type="number"
                    value={newJob.openingsCount}
                    onChange={(e) => setNewJob({ ...newJob, openingsCount: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Job Description</label>
                <textarea
                  rows={3}
                  required
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Responsibilities & flavor craft expectations..."
                  className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddOpeningModal(false)} className="px-3 py-1.5 text-[#6B655D]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E66A1F] text-white rounded-xl font-bold shadow-xs">Publish Opening</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E0D2] shadow-2xl space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEAD9]">
              <h3 className="text-sm font-bold text-[#201D1A]">Enroll Job Applicant</h3>
              <button onClick={() => setShowAddCandidateModal(false)}><X className="w-4 h-4 text-[#6B655D]" /></button>
            </div>
            <form onSubmit={handleCreateCandidate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Applying For Position</label>
                <select
                  value={newCand.jobId}
                  onChange={(e) => setNewCand({ ...newCand, jobId: e.target.value })}
                  className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                >
                  {jobOpenings.map(j => (
                    <option key={j.id} value={j.id}>{j.title} ({j.locationName})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Candidate Name</label>
                <input
                  required
                  value={newCand.fullName}
                  onChange={(e) => setNewCand({ ...newCand, fullName: e.target.value })}
                  placeholder="e.g. Leo Vance"
                  className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Email</label>
                  <input
                    required
                    type="email"
                    value={newCand.email}
                    onChange={(e) => setNewCand({ ...newCand, email: e.target.value })}
                    placeholder="leo@gmail.com"
                    className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Phone</label>
                  <input
                    required
                    type="tel"
                    value={newCand.phone}
                    onChange={(e) => setNewCand({ ...newCand, phone: e.target.value })}
                    placeholder="+1 (917) 555-0911"
                    className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Resume Summary & Specialty</label>
                <textarea
                  rows={2}
                  value={newCand.resumeSummary}
                  onChange={(e) => setNewCand({ ...newCand, resumeSummary: e.target.value })}
                  placeholder="Key background, past bakeries, craft highlights..."
                  className="w-full p-2 rounded-xl bg-[#FAF8F2] border border-[#EDEAD9]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddCandidateModal(false)} className="px-3 py-1.5 text-[#6B655D]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#E66A1F] text-white rounded-xl font-bold shadow-xs">Add to Pipeline</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
