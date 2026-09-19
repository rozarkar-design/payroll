import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  Timer,
  ChevronRight,
  Send,
  Sparkles,
  ArrowLeft,
  Search,
  Filter,
  Users,
  Award,
  RotateCcw,
  Check,
  X,
  FileText,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { useHRMS } from '../context/HRMSContext';
import { SugartownLogo } from './SugartownLogo';
import { SUGARTOWN_CORPORATE_INFO } from '../corporateInfo';
import { JobOpening, DepartmentType } from '../types';

interface IQQuestion {
  id: number;
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const IQ_QUESTIONS: IQQuestion[] = [
  {
    id: 1,
    question: 'Find the next number in the sequence: 2, 6, 12, 20, 30, ?',
    category: 'Numerical Pattern',
    options: ['38', '40', '42', '44'],
    correctIndex: 2, // 42 (+4, +6, +8, +10, +12)
    explanation: 'The difference between terms increases by 2 each step: +4, +6, +8, +10, +12. 30 + 12 = 42.'
  },
  {
    id: 2,
    question: 'Cocoa is to Chocolate as Grain is to...?',
    category: 'Verbal Analogy',
    options: ['Field', 'Flour / Bread', 'Water', 'Sugar'],
    correctIndex: 1,
    explanation: 'Cocoa is the raw staple processed into chocolate; grain is the raw staple processed into flour and bread.'
  },
  {
    id: 3,
    question: 'If all Confectioners wear aprons, and Sam is wearing an apron, is Sam definitely a Confectioner?',
    category: 'Logical Deduction',
    options: ['Yes, definitely', 'No, not necessarily', 'Only on weekends', 'Cannot be determined without a recipe'],
    correctIndex: 1,
    explanation: 'Wearing an apron is a necessary condition for confectioners, but others (painters, baristas) also wear aprons.'
  },
  {
    id: 4,
    question: 'Which word does NOT belong with the others?',
    category: 'Classification',
    options: ['Caramel', 'Truffle', 'Praline', 'Wrench'],
    correctIndex: 3,
    explanation: 'Caramel, Truffle, and Praline are confections; Wrench is a mechanical tool.'
  },
  {
    id: 5,
    question: 'Complete the pattern: A1, C3, F6, J10, ?',
    category: 'Alphanumeric Series',
    options: ['M13', 'N14', 'O15', 'P16'],
    correctIndex: 2, // O15 (+2, +3, +4, +5 letters and numbers)
    explanation: 'Letters advance by +2, +3, +4, +5 positions: A(1) -> C(3) -> F(6) -> J(10) -> O(15).'
  },
  {
    id: 6,
    question: 'A customer receives a 20% discount on a $50 luxury hamper. How much do they pay before tax?',
    category: 'Quantitative Reasoning',
    options: ['$35', '$40', '$42', '$45'],
    correctIndex: 1,
    explanation: '20% of $50 is $10. $50 - $10 = $40.'
  },
  {
    id: 7,
    question: 'If a store machine packages 120 fudge boxes in 15 minutes, how many does it package in 1 hour?',
    category: 'Rate & Proportion',
    options: ['360', '480', '520', '600'],
    correctIndex: 1,
    explanation: '1 hour = 4 periods of 15 minutes. 120 × 4 = 480 boxes.'
  },
  {
    id: 8,
    question: 'If South-East becomes North, and North-East becomes West, what will West become?',
    category: 'Spatial Orientation',
    options: ['South-East', 'South-West', 'North-West', 'East'],
    correctIndex: 0,
    explanation: 'The directions are rotated 135° counter-clockwise. West rotated 135° counter-clockwise becomes South-East.'
  },
  {
    id: 9,
    question: 'Three team members finish a task in 6 hours. Working at the same pace, how long would 6 members take?',
    category: 'Operational Logic',
    options: ['2 hours', '3 hours', '4 hours', '12 hours'],
    correctIndex: 1,
    explanation: 'Doubling the workforce halves the required duration: 6 hours ÷ 2 = 3 hours.'
  },
  {
    id: 10,
    question: 'Choose the conclusion that follows: No sweets are bitter. All caramels are sweets.',
    category: 'Syllogistic Reasoning',
    options: ['Some caramels are bitter', 'No caramels are bitter', 'All caramels are salty', 'Bitter items are caramels'],
    correctIndex: 1,
    explanation: 'Because all caramels are contained within sweets, and no sweets are bitter, no caramels can be bitter.'
  }
];

export const JobApplicationView: React.FC = () => {
  const { jobOpenings, submitJobApplication, triggerConfetti, setActiveTab } = useHRMS();

  // Selected Department Filter
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Job for Application
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  // Application Step: 1 = Candidate Info, 2 = 10-Min IQ Test, 3 = Test Results & Submit, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Candidate Info State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('2 years in boutique retail / hospitality');
  const [resumeSummary, setResumeSummary] = useState('');
  const [notes, setNotes] = useState('');

  // IQ Test State
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [testPassed, setTestPassed] = useState<boolean>(false);

  // 10-Minute Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval as NodeJS.Timeout);
            handleAutoSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start Application Modal
  const handleOpenApplication = (job: JobOpening) => {
    setSelectedJob(job);
    setStep(1);
    setTimeLeft(600);
    setIsTimerRunning(false);
    setUserAnswers({});
    setTestSubmitted(false);
    setScorePercentage(0);
    setTestPassed(false);
  };

  // Proceed to IQ Test (Step 2)
  const handleStartIQTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }
    setStep(2);
    setTimeLeft(600);
    setIsTimerRunning(true);
  };

  // Select Option for Question
  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    if (testSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  // Auto submit when 10 min timer expires
  const handleAutoSubmitTest = () => {
    calculateAndFinishTest();
  };

  // Calculate IQ Score
  const calculateAndFinishTest = () => {
    setIsTimerRunning(false);
    setTestSubmitted(true);

    let correctCount = 0;
    IQ_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / IQ_QUESTIONS.length) * 100);
    setScorePercentage(percentage);
    const passed = percentage >= 70;
    setTestPassed(passed);
    setStep(3);

    if (passed) {
      triggerConfetti();
    }
  };

  // Final Submit Application
  const handleFinalSubmitApplication = () => {
    if (!selectedJob) return;
    if (!testPassed) {
      alert('You must achieve a score of at least 70% on the IQ evaluation to submit your application.');
      return;
    }

    submitJobApplication({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      fullName,
      email,
      phone,
      experience,
      resumeSummary: resumeSummary || `Qualified candidate with ${experience}. Passed cognitive evaluation with score of ${scorePercentage}%.`,
      notes: notes || `IQ Assessment verified: ${scorePercentage}% (Threshold ≥ 70%).`,
      department: selectedJob.department,
      iqScore: scorePercentage,
      iqPassed: true
    });

    setStep(4);
    triggerConfetti();
  };

  // Retake test
  const handleRetakeTest = () => {
    setUserAnswers({});
    setTimeLeft(600);
    setTestSubmitted(false);
    setScorePercentage(0);
    setTestPassed(false);
    setStep(2);
    setIsTimerRunning(true);
  };

  // Filtered Job Openings
  const filteredJobs = jobOpenings.filter(job => {
    const matchesDept = selectedDept === 'All' || job.department.toLowerCase() === selectedDept.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  const departmentList = ['All', 'Operation', 'Sales', 'Marketing', 'Backend', 'Corporate', 'Confectionery Production', 'Kitchen & Barista'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#201D1A] via-[#2D2824] to-[#1A1816] text-white shadow-xl relative overflow-hidden border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E66A1F]/20 text-[#FF7A29] text-xs font-bold border border-[#E66A1F]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sugartown Talent & Careers Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Join the Sugartown Confectionery Family
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            Explore open opportunities across <strong>Store Staff, Store Manager, Cluster Manager, Sales, Marketing, Operation, Backend & Corporate</strong>.
            All applications include a standard 10-minute IQ and cognitive logic test (≥ 70% passing threshold).
          </p>
        </div>

        <div className="shrink-0">
          <button
            id="careers-back-to-dashboard-btn"
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors border border-white/15"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Official Legal Employer Notice */}
      <div className="bg-[#FAF8F2] rounded-2xl border border-[#E5E0D2] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[#201D1A]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E5E0D2] flex items-center justify-center text-[#E66A1F] shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#201D1A]">
              Hiring Entity: {SUGARTOWN_CORPORATE_INFO.legalName}
            </div>
            <div className="text-[11px] text-[#6B655D]">
              Registered Office: {SUGARTOWN_CORPORATE_INFO.registeredAddress.fullFormatted}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="font-mono text-[11px] font-bold text-[#E66A1F] bg-white px-2 py-0.5 rounded border border-[#EDEAD9]">
            CIN: {SUGARTOWN_CORPORATE_INFO.cin}
          </span>
          <a
            href={`mailto:${SUGARTOWN_CORPORATE_INFO.careersEmail}`}
            className="text-[11px] font-semibold text-[#396B5A] bg-[#EEF7F4] hover:bg-[#A4CDBD]/40 px-2 py-0.5 rounded border border-[#A4CDBD]/40 transition-colors"
          >
            Email: {SUGARTOWN_CORPORATE_INFO.careersEmail}
          </a>
        </div>
      </div>

      {/* Search and Department Filter Bar */}
      <div className="bg-white rounded-3xl border border-[#E5E0D2] p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B655D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="job-search-input"
              type="text"
              placeholder="Search positions (e.g. Store Staff, Store Manager, Cluster Manager, Backend)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EDEAD9] bg-[#FAF8F2] focus:bg-white focus:border-[#E66A1F] focus:outline-none text-xs font-medium text-[#201D1A]"
            />
          </div>

          <div className="text-xs font-bold text-[#6B655D] shrink-0 self-center">
            {filteredJobs.length} Open Positions
          </div>
        </div>

        {/* Department Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          {departmentList.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'bg-[#E66A1F] text-white shadow-xs'
                  : 'bg-[#FAF8F2] text-[#6B655D] hover:bg-[#EDEAD9]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className="bg-white rounded-3xl border border-[#E5E0D2] p-5 flex flex-col justify-between hover:border-[#E66A1F]/40 hover:shadow-md transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#FAF8F2] text-[#E66A1F] text-[10px] font-bold uppercase tracking-wider border border-[#EDEAD9]">
                  {job.department}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A]">
                  {job.type}
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-[#201D1A] font-display leading-snug">
                  {job.title}
                </h3>
                <p className="text-xs text-[#6B655D] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E66A1F] shrink-0" />
                  <span>{job.locationName}</span>
                </p>
              </div>

              <p className="text-xs text-[#6B655D] line-clamp-2">
                {job.description}
              </p>

              {/* Requirements */}
              <div className="space-y-1 pt-1 border-t border-[#EDEAD9]">
                <span className="text-[10px] font-bold text-[#201D1A] uppercase">Key Requirements:</span>
                <ul className="text-[11px] text-[#6B655D] space-y-0.5">
                  {job.requirements.slice(0, 3).map((req, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E66A1F]" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EDEAD9] flex items-center justify-between">
              <span className="text-[11px] text-[#6B655D]">
                {job.openingsCount} opening{job.openingsCount > 1 ? 's' : ''} · {job.applicantsCount} applied
              </span>

              <button
                id={`apply-job-btn-${job.id}`}
                onClick={() => handleOpenApplication(job)}
                className="py-2 px-4 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-98"
              >
                <span>Apply with IQ Test</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================== */}
      {/* MULTI-STEP APPLICATION & MANDATORY 10-MIN IQ TEST MODAL */}
      {/* ========================================================== */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-[#E5E0D2] shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EDEAD9] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#E66A1F] uppercase tracking-wider block">
                  Application Process · {selectedJob.department}
                </span>
                <h2 className="text-xl font-black text-[#201D1A] font-display">
                  {selectedJob.title}
                </h2>
                <p className="text-xs text-[#6B655D] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#E66A1F]" />
                  <span>{selectedJob.locationName}</span>
                </p>
              </div>

              {step !== 2 && (
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 rounded-xl border border-[#EDEAD9] text-[#6B655D] hover:text-[#201D1A]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Step Progress Indicator */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className={`p-2 rounded-xl border font-bold ${
                step === 1 ? 'bg-[#FEF4ED] text-[#E66A1F] border-[#E66A1F]' : 'bg-[#FAF8F2] text-[#6B655D] border-[#EDEAD9]'
              }`}>
                1. Candidate Info
              </div>
              <div className={`p-2 rounded-xl border font-bold flex items-center justify-center gap-1 ${
                step === 2 ? 'bg-[#FEF4ED] text-[#E66A1F] border-[#E66A1F]' : 'bg-[#FAF8F2] text-[#6B655D] border-[#EDEAD9]'
              }`}>
                <Brain className="w-3.5 h-3.5" />
                <span>2. 10-Min IQ Test</span>
              </div>
              <div className={`p-2 rounded-xl border font-bold ${
                step >= 3 ? 'bg-[#FEF4ED] text-[#E66A1F] border-[#E66A1F]' : 'bg-[#FAF8F2] text-[#6B655D] border-[#EDEAD9]'
              }`}>
                3. Verification & Submit
              </div>
            </div>

            {/* STEP 1: CANDIDATE INFO */}
            {step === 1 && (
              <form onSubmit={handleStartIQTest} className="space-y-4 text-xs">
                <div className="p-3.5 bg-[#FEF4ED] rounded-2xl border border-[#E66A1F]/30 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#E66A1F] shrink-0 mt-0.5" />
                  <p className="text-[#201D1A]">
                    <strong>Mandatory IQ Evaluation:</strong> Before submitting your application, you must complete a 10-minute cognitive logic assessment. You must score <strong>at least 70%</strong> to proceed with your submission.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#201D1A] mb-1">Full Legal Name</label>
                    <input
                      id="candidate-fullname-input"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jordan Miller"
                      className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#201D1A] mb-1">Email Address</label>
                    <input
                      id="candidate-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan.miller@example.com"
                      className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#201D1A] mb-1">Mobile Phone Number</label>
                    <input
                      id="candidate-phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#201D1A] mb-1">Relevant Experience</label>
                    <input
                      id="candidate-experience-input"
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 2 years in coffee shop or retail store"
                      className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#201D1A] mb-1">Resume Summary & Qualifications</label>
                  <textarea
                    id="candidate-resume-textarea"
                    rows={2}
                    value={resumeSummary}
                    onChange={(e) => setResumeSummary(e.target.value)}
                    placeholder="Brief highlights of past store, management, or technical accomplishments..."
                    className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#201D1A] mb-1">Why Sugartown? (Motivation)</label>
                  <textarea
                    id="candidate-notes-textarea"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us what excites you about crafting sweet moments with our team..."
                    className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    id="start-iq-test-btn"
                    type="submit"
                    className="py-3 px-6 bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md shadow-[#E66A1F]/25 transition-transform active:scale-98"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Proceed to 10-Min IQ Test (10 Questions)</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: 10-MINUTE IQ TEST */}
            {step === 2 && (
              <div className="space-y-5">
                
                {/* Fixed Timer Header */}
                <div className="sticky top-0 bg-white z-10 py-2 border-b border-[#EDEAD9] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#E66A1F]" />
                    <div>
                      <h3 className="font-black text-sm text-[#201D1A]">Cognitive Aptitude Evaluation</h3>
                      <p className="text-[10px] text-[#6B655D]">10 Questions · Passing Requirement ≥ 70%</p>
                    </div>
                  </div>

                  {/* 10-Minute Countdown Display */}
                  <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                    timeLeft < 120
                      ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                      : 'bg-[#FAF8F2] text-[#201D1A] border-[#EDEAD9]'
                  }`}>
                    <Timer className="w-4 h-4 text-[#E66A1F]" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {IQ_QUESTIONS.map((q, qIndex) => {
                    const selectedOpt = userAnswers[q.id];

                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl border border-[#EDEAD9] bg-[#FAF8F2] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold text-[#E66A1F] uppercase tracking-wider">
                            Q{qIndex + 1} · {q.category}
                          </span>
                          {selectedOpt !== undefined && (
                            <span className="text-[10px] font-bold text-[#396B5A] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Answered
                            </span>
                          )}
                        </div>

                        <p className="font-bold text-xs text-[#201D1A]">
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {q.options.map((opt, optIndex) => (
                            <button
                              key={optIndex}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, optIndex)}
                              className={`p-2.5 rounded-xl border text-left font-medium transition-all ${
                                selectedOpt === optIndex
                                  ? 'bg-[#E66A1F] text-white border-[#E66A1F] shadow-xs'
                                  : 'bg-white text-[#201D1A] border-[#EDEAD9] hover:bg-[#FEF4ED]'
                              }`}
                            >
                              <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIndex)}.</span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Finish Test Button */}
                <div className="pt-3 border-t border-[#EDEAD9] flex items-center justify-between">
                  <span className="text-xs text-[#6B655D]">
                    Answered: <strong>{Object.keys(userAnswers).length}</strong> / {IQ_QUESTIONS.length}
                  </span>

                  <button
                    id="finish-iq-test-btn"
                    onClick={calculateAndFinishTest}
                    className="py-2.5 px-6 bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md shadow-[#E66A1F]/25 transition-transform active:scale-98"
                  >
                    <span>Submit Evaluation & Calculate Score</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: RESULTS & SUBMIT GATEWAY */}
            {step === 3 && (
              <div className="space-y-6 text-center py-4">
                
                {/* Score Dial / Badge */}
                <div className={`w-28 h-28 mx-auto rounded-full flex flex-col items-center justify-center border-4 shadow-lg ${
                  testPassed
                    ? 'border-[#396B5A] bg-[#EEF7F4] text-[#396B5A]'
                    : 'border-red-500 bg-red-50 text-red-600'
                }`}>
                  <span className="text-3xl font-black font-display leading-tight">{scorePercentage}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{testPassed ? 'PASSED' : 'NOT PASSED'}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#201D1A] font-display">
                    {testPassed ? 'Cognitive Standard Qualified!' : 'Passing Threshold Not Reached'}
                  </h3>
                  <p className="text-xs text-[#6B655D] max-w-md mx-auto">
                    {testPassed
                      ? `Congratulations ${fullName}! Your score of ${scorePercentage}% exceeds our mandatory 70% passing bar. You are now cleared to submit your official application.`
                      : `You achieved a score of ${scorePercentage}%. Sugartown requires a minimum score of 70% across problem solving, numerical, and logic reasoning to submit an application.`}
                  </p>
                </div>

                {/* Gate Details */}
                <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#EDEAD9] text-xs text-left space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-[#6B655D]">Target Position</span>
                    <strong className="text-[#201D1A]">{selectedJob.title}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B655D]">Candidate</span>
                    <strong className="text-[#201D1A]">{fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B655D]">Score Achieved</span>
                    <strong className={testPassed ? 'text-[#396B5A]' : 'text-red-600'}>
                      {scorePercentage}% ({Object.values(userAnswers).filter((ans, idx) => ans === IQ_QUESTIONS[idx]?.correctIndex).length} / 10 correct)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B655D]">Submission Clearance</span>
                    <span className={`font-bold ${testPassed ? 'text-[#396B5A]' : 'text-red-600'}`}>
                      {testPassed ? 'Unlocked (≥ 70%)' : 'Locked (< 70%)'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  {!testPassed && (
                    <button
                      id="retake-iq-test-btn"
                      onClick={handleRetakeTest}
                      className="py-3 px-6 bg-[#201D1A] hover:bg-black text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-transform active:scale-98"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake 10-Minute Assessment</span>
                    </button>
                  )}

                  {testPassed && (
                    <button
                      id="submit-official-application-btn"
                      onClick={handleFinalSubmitApplication}
                      className="py-3.5 px-8 bg-[#E66A1F] hover:bg-[#D25A12] text-white text-sm font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-[#E66A1F]/30 transition-transform active:scale-98"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Official Application Now</span>
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION */}
            {step === 4 && (
              <div className="space-y-4 text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#EEF7F4] text-[#396B5A] flex items-center justify-center mx-auto border-2 border-[#A4CDBD]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-[#201D1A] font-display">
                    Application Successfully Submitted!
                  </h3>
                  <p className="text-xs text-[#6B655D] max-w-md mx-auto">
                    Thank you <strong>{fullName}</strong>. Your profile for <strong>{selectedJob.title}</strong> has been received with your verified IQ score of <strong>{scorePercentage}%</strong>.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] text-xs max-w-md mx-auto text-left space-y-1">
                  <p className="text-[#396B5A] font-bold">✓ Enrolled into Candidate Registry</p>
                  <p className="text-[#6B655D]">✓ Store Manager notified for tasting & interview round</p>
                  <p className="text-[#6B655D]">✓ Confirmation dispatched to {email}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="py-2.5 px-6 bg-[#201D1A] hover:bg-black text-white text-xs font-bold rounded-2xl"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
