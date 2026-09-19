import React, { useState, useEffect, useRef } from 'react';
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
  User,
  Upload,
  Paperclip,
  Trash2,
  DollarSign,
  Calendar,
  ShieldCheck,
  FileCheck,
  CheckSquare,
  Square
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

const STORE_LOCATIONS = [
  'Brooklyn Candy Café & Espresso Bar',
  'Broadway Heritage Sweet Flagship',
  'Uptown Artisan Chocolate Boutique',
  'Central Confectionery Factory & Bakery',
  'Corporate HQ & Design Center'
];

const SHIFT_OPTIONS = [
  'Flexible / Any Shift',
  'Morning Shift (7:00 AM - 3:30 PM)',
  'Afternoon / Evening Shift (2:00 PM - 10:30 PM)',
  'Night / Bakery Shift (10:00 PM - 6:30 AM)',
  'Weekend Shift (Saturday - Sunday)'
];

interface UploadedFileMeta {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

interface DocumentUploadItem {
  id: string;
  title: string;
  required: boolean;
  file: UploadedFileMeta | null;
}

export const JobApplicationView: React.FC = () => {
  const { jobOpenings, submitJobApplication, triggerConfetti, setActiveTab } = useHRMS();

  // Selected Department Filter
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Job for Application
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  // Application Step: 1 = Candidate Info, Locations, CV & Docs, 2 = 10-Min IQ Test, 3 = Test Results & Submit, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Candidate Info State (Fill Details)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState<string>("Bachelor's Degree");
  const [experience, setExperience] = useState('2 years in boutique retail / hospitality');
  const [expectedSalary, setExpectedSalary] = useState<string>('$3,800 / month');
  const [noticePeriod, setNoticePeriod] = useState<string>('Immediate (within 7 days)');
  const [currentCity, setCurrentCity] = useState<string>('New York, NY');
  const [linkedinUrl, setLinkedinUrl] = useState<string>('');
  const [resumeSummary, setResumeSummary] = useState('');
  const [notes, setNotes] = useState('');

  // Apply Locations
  const [appliedLocations, setAppliedLocations] = useState<string[]>(['Brooklyn Candy Café & Espresso Bar']);
  const [preferredShift, setPreferredShift] = useState<string>('Flexible / Any Shift');

  // Upload CV
  const [uploadedCv, setUploadedCv] = useState<UploadedFileMeta | null>({
    name: 'Jordan_Miller_CV_2026.pdf',
    size: '1.4 MB',
    type: 'application/pdf',
    uploadedAt: 'Attached'
  });
  const cvFileInputRef = useRef<HTMLInputElement>(null);

  // Upload Documents
  const [documentsList, setDocumentsList] = useState<DocumentUploadItem[]>([
    {
      id: 'gov_id',
      title: 'Government Photo ID (Aadhaar / Passport / DL)',
      required: true,
      file: { name: 'Government_Photo_ID_Aadhaar.pdf', size: '2.1 MB', type: 'application/pdf', uploadedAt: 'Attached' }
    },
    {
      id: 'edu_cert',
      title: 'Highest Education Certificate / Degree',
      required: true,
      file: { name: 'Bachelors_Degree_Certificate.pdf', size: '1.8 MB', type: 'application/pdf', uploadedAt: 'Attached' }
    },
    {
      id: 'exp_letter',
      title: 'Prior Experience Letter / Relieving Certificate',
      required: false,
      file: null
    },
    {
      id: 'hygiene_cert',
      title: 'Food Safety / Hygiene Certificate (FSSAI / ServSafe)',
      required: false,
      file: null
    }
  ]);

  // Form Subtab inside Step 1
  const [step1SubTab, setStep1SubTab] = useState<'details' | 'locations' | 'cv_documents'>('details');

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
    setStep1SubTab('details');
    setTimeLeft(600);
    setIsTimerRunning(false);
    setUserAnswers({});
    setTestSubmitted(false);
    setScorePercentage(0);
    setTestPassed(false);
  };

  // Toggle location selection
  const toggleLocation = (loc: string) => {
    if (appliedLocations.includes(loc)) {
      if (appliedLocations.length === 1) {
        alert('Please keep at least one preferred store location selected.');
        return;
      }
      setAppliedLocations(prev => prev.filter(l => l !== loc));
    } else {
      setAppliedLocations(prev => [...prev, loc]);
    }
  };

  // Handle CV File Upload
  const handleCvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedCv({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'application/pdf',
        uploadedAt: 'Just now'
      });
      triggerConfetti();
    }
  };

  // Handle Document File Upload
  const handleDocumentFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentsList(prev => prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            file: {
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: file.type || 'application/pdf',
              uploadedAt: 'Just now'
            }
          };
        }
        return d;
      }));
    }
  };

  // Remove Document
  const removeDocument = (docId: string) => {
    setDocumentsList(prev => prev.map(d => d.id === docId ? { ...d, file: null } : d));
  };

  // Proceed from Step 1 to IQ Test (Step 2)
  const handleStartIQTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill in your full name, email, and phone number.');
      setStep1SubTab('details');
      return;
    }
    if (appliedLocations.length === 0) {
      alert('Please select at least one preferred store location.');
      setStep1SubTab('locations');
      return;
    }
    if (!uploadedCv) {
      alert('Please upload or attach your CV / Resume.');
      setStep1SubTab('cv_documents');
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
      resumeSummary: resumeSummary || `Qualified candidate with ${experience}. Passed cognitive evaluation with score of ${scorePercentage}%. Attached CV: ${uploadedCv?.name || 'Resume'}.`,
      notes: notes || `IQ Assessment verified: ${scorePercentage}% (Threshold ≥ 70%). Locations: ${appliedLocations.join(', ')}. Shift: ${preferredShift}.`,
      department: selectedJob.department,
      iqScore: scorePercentage,
      iqPassed: true,
      appliedLocations,
      preferredShift,
      cvFileName: uploadedCv?.name,
      cvFileSize: uploadedCv?.size,
      documentsCount: documentsList.filter(d => d.file !== null).length,
      qualification,
      expectedSalary
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
            Apply for positions across <strong>Store Staff, Store Manager, Cluster Manager, Sales, Marketing, Operation & Backend</strong>.
            Fill candidate details, choose preferred store locations, upload your CV and verification documents, and complete the standard 10-minute IQ evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {jobOpenings.length > 0 && (
            <button
              id="careers-fast-track-apply-btn"
              onClick={() => handleOpenApplication(jobOpenings[0])}
              className="px-4 py-2.5 rounded-xl bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Brain className="w-4 h-4" />
              <span>Apply for Job (Fast Track)</span>
            </button>
          )}

          <button
            id="careers-back-to-dashboard-btn"
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors border border-white/15"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Official Legal Employer Notice */}
      <div className="bg-[#FAF8F2] rounded-2xl border border-[#E5E0D2] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-[#201D1A]">
        <div className="flex items-center gap-3">
          <SugartownLogo size="sm" />
          <div>
            <p className="font-bold">{SUGARTOWN_CORPORATE_INFO.legalName}</p>
            <p className="text-[#6B655D] text-[11px]">
              CIN: {SUGARTOWN_CORPORATE_INFO.cin} · Registered HR & Talent Compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-[#6B655D]">
          <span>Helpline: {SUGARTOWN_CORPORATE_INFO.phone}</span>
          <span>·</span>
          <a
            href={`mailto:${SUGARTOWN_CORPORATE_INFO.careersEmail}`}
            className="text-[#E66A1F] font-semibold hover:underline"
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
                <h3 className="text-base font-bold text-[#201D1A] group-hover:text-[#E66A1F]">
                  {job.title}
                </h3>
                <p className="text-xs text-[#6B655D] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E66A1F]" />
                  <span>{job.locationName}</span>
                </p>
              </div>

              <p className="text-xs text-[#6B655D] line-clamp-2">
                {job.description}
              </p>

              {/* Requirements tags */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#6B655D] uppercase tracking-wider block">
                  Requirements:
                </span>
                <div className="flex flex-wrap gap-1">
                  {job.requirements.slice(0, 2).map((req, idx) => (
                    <span key={idx} className="text-[10px] bg-[#FAF8F2] text-[#6B655D] px-2 py-0.5 rounded-md border border-[#EDEAD9]">
                      {req}
                    </span>
                  ))}
                  {job.requirements.length > 2 && (
                    <span className="text-[10px] text-[#6B655D] self-center">
                      +{job.requirements.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EDEAD9] flex items-center justify-between">
              <div className="text-[11px] text-[#6B655D]">
                <strong className="text-[#201D1A]">{job.openingsCount}</strong> openings · {job.applicantsCount} applicants
              </div>

              <button
                id={`apply-job-btn-${job.id}`}
                onClick={() => handleOpenApplication(job)}
                className="py-2 px-4 bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ==================================================================== */}
      {/* MULTI-STEP JOB APPLICATION & COGNITIVE IQ TEST MODAL */}
      {/* ==================================================================== */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E5E0D2] shadow-2xl max-w-3xl w-full p-5 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EDEAD9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FEF4ED] text-[#E66A1F] flex items-center justify-center font-bold">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#201D1A]">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-[#6B655D]">
                    {selectedJob.department} Department · Sugartown Confectionery
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl text-[#6B655D] hover:text-[#201D1A] hover:bg-[#FAF8F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress Bar */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-2 rounded-xl border font-bold ${
                step === 1 ? 'bg-[#FEF4ED] text-[#E66A1F] border-[#E66A1F]' : 'bg-[#FAF8F2] text-[#6B655D] border-[#EDEAD9]'
              }`}>
                1. Fill Details
              </div>
              <div className={`p-2 rounded-xl border font-bold ${
                step === 1 && step1SubTab !== 'details' ? 'bg-[#FEF4ED] text-[#E66A1F] border-[#E66A1F]' : 'bg-[#FAF8F2] text-[#6B655D] border-[#EDEAD9]'
              }`}>
                2. Locations & CV
              </div>
              <div className={`p-2 rounded-xl border font-bold flex items-center justify-center gap-1 ${
                step === 2 ? 'bg-[#FEF4ED] text-[#E66A1F] border-[#E66A1F]' : 'bg-[#FAF8F2] text-[#6B655D] border-[#EDEAD9]'
              }`}>
                <Brain className="w-3.5 h-3.5" />
                <span>3. 10-Min IQ Test</span>
              </div>
              <div className={`p-2 rounded-xl border font-bold ${
                step >= 3 ? 'bg-[#FEF4ED] text-[#E66A1F] border-[#E66A1F]' : 'bg-[#FAF8F2] text-[#6B655D] border-[#EDEAD9]'
              }`}>
                4. Confirmation
              </div>
            </div>

            {/* ============================================================== */}
            {/* STEP 1: CANDIDATE INFO, APPLY LOCATIONS, CV & DOCUMENTS */}
            {/* ============================================================== */}
            {step === 1 && (
              <form onSubmit={handleStartIQTest} className="space-y-4 text-xs">
                
                {/* Notice banner */}
                <div className="p-3 bg-[#FEF4ED] rounded-2xl border border-[#E66A1F]/30 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#E66A1F] shrink-0 mt-0.5" />
                  <p className="text-[#201D1A]">
                    <strong>Required Steps:</strong> Fill candidate details, select applied store locations, attach your CV and verification documents, then complete the mandatory 10-minute online IQ test (minimum passing threshold ≥ 70%).
                  </p>
                </div>

                {/* Step 1 Sub Navigation */}
                <div className="flex items-center gap-2 border-b border-[#EDEAD9] pb-2">
                  <button
                    type="button"
                    onClick={() => setStep1SubTab('details')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      step1SubTab === 'details'
                        ? 'bg-[#201D1A] text-white'
                        : 'bg-[#FAF8F2] text-[#6B655D] hover:bg-[#EDEAD9]'
                    }`}
                  >
                    1. Personal Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep1SubTab('locations')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      step1SubTab === 'locations'
                        ? 'bg-[#201D1A] text-white'
                        : 'bg-[#FAF8F2] text-[#6B655D] hover:bg-[#EDEAD9]'
                    }`}
                  >
                    2. Store Locations & Shifts ({appliedLocations.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep1SubTab('cv_documents')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
                      step1SubTab === 'cv_documents'
                        ? 'bg-[#201D1A] text-white'
                        : 'bg-[#FAF8F2] text-[#6B655D] hover:bg-[#EDEAD9]'
                    }`}
                  >
                    <Paperclip className="w-3 h-3" />
                    <span>3. Upload CV & Documents</span>
                    {uploadedCv && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#396B5A]" />
                    )}
                  </button>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* SUBTAB A: CANDIDATE PERSONAL & PROFESSIONAL DETAILS */}
                {/* ------------------------------------------------------------ */}
                {step1SubTab === 'details' && (
                  <div className="space-y-3 animate-in fade-in duration-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Full Legal Name *</label>
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
                        <label className="block font-bold text-[#201D1A] mb-1">Email Address *</label>
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
                        <label className="block font-bold text-[#201D1A] mb-1">Mobile Phone Number *</label>
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
                        <label className="block font-bold text-[#201D1A] mb-1">Highest Qualification</label>
                        <select
                          id="candidate-qualification-select"
                          value={qualification}
                          onChange={(e) => setQualification(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        >
                          <option value="High School Diploma">High School Diploma</option>
                          <option value="Associate Degree / Diploma">Associate Degree / Diploma</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Master's Degree">Master's Degree</option>
                          <option value="Culinary Arts & Bakery Certification">Culinary Arts & Bakery Certification</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Relevant Experience</label>
                        <input
                          id="candidate-experience-input"
                          type="text"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          placeholder="e.g. 2 years in retail store or cafe"
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Expected Monthly CTC / Salary</label>
                        <input
                          id="candidate-expected-salary-input"
                          type="text"
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          placeholder="e.g. $3,800 / month"
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Notice Period / Earliest Join Date</label>
                        <select
                          id="candidate-notice-period-select"
                          value={noticePeriod}
                          onChange={(e) => setNoticePeriod(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        >
                          <option value="Immediate (within 7 days)">Immediate (within 7 days)</option>
                          <option value="15 Days Notice">15 Days Notice</option>
                          <option value="30 Days Notice">30 Days Notice</option>
                          <option value="Serving Notice (Available Soon)">Serving Notice (Available Soon)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#201D1A] mb-1">Current City / Location</label>
                        <input
                          id="candidate-city-input"
                          type="text"
                          value={currentCity}
                          onChange={(e) => setCurrentCity(e.target.value)}
                          placeholder="e.g. New York, NY"
                          className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#201D1A] mb-1">LinkedIn / Portfolio URL (Optional)</label>
                      <input
                        id="candidate-linkedin-input"
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/yourname"
                        className="w-full p-2.5 rounded-xl border border-[#EDEAD9] bg-[#FAF8F2] text-[#201D1A] font-medium focus:bg-white focus:outline-none focus:border-[#E66A1F]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#201D1A] mb-1">Resume Summary & Key Achievements</label>
                      <textarea
                        id="candidate-resume-textarea"
                        rows={2}
                        value={resumeSummary}
                        onChange={(e) => setResumeSummary(e.target.value)}
                        placeholder="Brief highlights of past store, management, culinary, or technical experience..."
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
                        type="button"
                        onClick={() => setStep1SubTab('locations')}
                        className="py-2.5 px-5 bg-[#201D1A] hover:bg-black text-white rounded-xl font-bold flex items-center gap-1.5"
                      >
                        <span>Next: Select Locations</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------ */}
                {/* SUBTAB B: APPLY LOCATIONS & SHIFT PREFERENCES */}
                {/* ------------------------------------------------------------ */}
                {step1SubTab === 'locations' && (
                  <div className="space-y-4 animate-in fade-in duration-100">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-[#201D1A] flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#E66A1F]" />
                          <span>Select Store & Office Locations You Wish to Apply For *</span>
                        </label>
                        <span className="text-[11px] text-[#6B655D]">
                          {appliedLocations.length} location(s) selected
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {STORE_LOCATIONS.map(loc => {
                          const isSelected = appliedLocations.includes(loc);
                          return (
                            <div
                              key={loc}
                              onClick={() => toggleLocation(loc)}
                              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                                isSelected
                                  ? 'bg-[#FEF4ED] border-[#E66A1F] text-[#201D1A] shadow-2xs'
                                  : 'bg-[#FAF8F2] border-[#EDEAD9] text-[#6B655D] hover:border-[#E66A1F]/50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-[#E66A1F] shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-[#6B655D] shrink-0" />
                                )}
                                <span className="font-semibold text-xs">{loc}</span>
                              </div>
                              {isSelected && (
                                <span className="text-[10px] font-bold bg-[#E66A1F] text-white px-2 py-0.5 rounded-md">
                                  Selected
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#201D1A] mb-1.5">
                        Preferred Shift Schedule
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {SHIFT_OPTIONS.map(shift => (
                          <label
                            key={shift}
                            className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs ${
                              preferredShift === shift
                                ? 'bg-[#EEF7F4] border-[#396B5A] text-[#201D1A] font-bold'
                                : 'bg-[#FAF8F2] border-[#EDEAD9] text-[#6B655D]'
                            }`}
                          >
                            <input
                              type="radio"
                              name="shift_preference"
                              value={shift}
                              checked={preferredShift === shift}
                              onChange={(e) => setPreferredShift(e.target.value)}
                              className="accent-[#396B5A]"
                            />
                            <span>{shift}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep1SubTab('details')}
                        className="py-2 px-4 rounded-xl border border-[#EDEAD9] text-[#6B655D] hover:bg-[#FAF8F2] font-semibold"
                      >
                        Back to Details
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep1SubTab('cv_documents')}
                        className="py-2.5 px-5 bg-[#201D1A] hover:bg-black text-white rounded-xl font-bold flex items-center gap-1.5"
                      >
                        <span>Next: Upload CV & Documents</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------ */}
                {/* SUBTAB C: UPLOAD CV & VERIFICATION DOCUMENTS */}
                {/* ------------------------------------------------------------ */}
                {step1SubTab === 'cv_documents' && (
                  <div className="space-y-4 animate-in fade-in duration-100">
                    
                    {/* CV / Resume Upload Box */}
                    <div className="bg-[#FAF8F2] p-4 rounded-2xl border border-[#EDEAD9] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#201D1A] flex items-center gap-1.5 text-xs">
                          <FileText className="w-4 h-4 text-[#E66A1F]" />
                          <span>Upload CV / Resume * (PDF, DOC, DOCX up to 10MB)</span>
                        </label>
                        {uploadedCv && (
                          <span className="text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A] px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> CV Attached
                          </span>
                        )}
                      </div>

                      {uploadedCv ? (
                        <div className="p-3 bg-white rounded-xl border border-[#A4CDBD]/50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#EEF7F4] text-[#396B5A] flex items-center justify-center font-bold">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-[#201D1A] text-xs">{uploadedCv.name}</p>
                              <p className="text-[10px] text-[#6B655D]">{uploadedCv.size} · Attached {uploadedCv.uploadedAt}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => cvFileInputRef.current?.click()}
                              className="px-2.5 py-1 text-[11px] font-bold text-[#396B5A] hover:bg-[#EEF7F4] rounded-lg"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={() => setUploadedCv(null)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                              title="Remove CV"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => cvFileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#E5E0D2] hover:border-[#E66A1F] p-5 rounded-2xl text-center bg-white cursor-pointer transition-colors"
                        >
                          <Upload className="w-6 h-6 text-[#E66A1F] mx-auto mb-1.5" />
                          <p className="font-bold text-xs text-[#201D1A]">Click to browse or drop your CV / Resume here</p>
                          <p className="text-[10px] text-[#6B655D] mt-0.5">Supported formats: PDF, DOC, DOCX</p>
                        </div>
                      )}

                      <input
                        ref={cvFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvFileChange}
                        className="hidden"
                      />
                    </div>

                    {/* Hiring Documents Upload Grid */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#201D1A] flex items-center gap-1.5 text-xs">
                          <ShieldCheck className="w-4 h-4 text-[#396B5A]" />
                          <span>Hiring & Verification Documents</span>
                        </label>
                        <span className="text-[10px] text-[#6B655D]">
                          {documentsList.filter(d => d.file !== null).length} / {documentsList.length} Uploaded
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {documentsList.map(doc => (
                          <div
                            key={doc.id}
                            className="p-3 bg-white rounded-2xl border border-[#EDEAD9] space-y-2 flex flex-col justify-between"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-bold text-xs text-[#201D1A]">
                                  {doc.title}
                                </p>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                  doc.required ? 'bg-[#FEF4ED] text-[#E66A1F]' : 'bg-[#FAF8F2] text-[#6B655D]'
                                }`}>
                                  {doc.required ? 'Mandatory' : 'Optional / Supporting'}
                                </span>
                              </div>

                              {doc.file ? (
                                <span className="text-[10px] font-bold bg-[#EEF7F4] text-[#396B5A] px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                                  <Check className="w-3 h-3" /> Attached
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#6B655D] shrink-0">
                                  Pending
                                </span>
                              )}
                            </div>

                            {doc.file ? (
                              <div className="flex items-center justify-between p-2 bg-[#FAF8F2] rounded-xl text-[11px]">
                                <span className="font-medium truncate max-w-[170px] text-[#201D1A]">
                                  {doc.file.name} ({doc.file.size})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(doc.id)}
                                  className="text-red-500 hover:text-red-700 p-0.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <label className="py-2 px-3 border border-[#EDEAD9] hover:border-[#E66A1F] rounded-xl text-center cursor-pointer bg-[#FAF8F2] hover:bg-white text-[11px] font-bold text-[#6B655D] hover:text-[#201D1A] flex items-center justify-center gap-1.5 transition-colors">
                                <Upload className="w-3 h-3 text-[#E66A1F]" />
                                <span>Upload {doc.required ? 'File *' : 'File'}</span>
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png,.doc"
                                  onChange={(e) => handleDocumentFileChange(doc.id, e)}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Submit Step 1 to enter IQ Test */}
                    <div className="pt-3 border-t border-[#EDEAD9] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep1SubTab('locations')}
                        className="py-2 px-4 rounded-xl border border-[#EDEAD9] text-[#6B655D] hover:bg-[#FAF8F2] font-semibold"
                      >
                        Back to Locations
                      </button>

                      <button
                        id="start-iq-test-btn"
                        type="submit"
                        className="py-3 px-6 bg-[#E66A1F] hover:bg-[#D25A12] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md shadow-[#E66A1F]/25 transition-transform active:scale-98"
                      >
                        <Brain className="w-4 h-4" />
                        <span>Proceed to 10-Min Cognitive IQ Test</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}

            {/* ============================================================== */}
            {/* STEP 2: 10-MINUTE IQ & COGNITIVE TEST */}
            {/* ============================================================== */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                
                {/* Timer Bar */}
                <div className="p-4 rounded-2xl bg-[#201D1A] text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <Timer className={`w-5 h-5 ${timeLeft <= 120 ? 'text-red-400 animate-pulse' : 'text-[#E66A1F]'}`} />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        Time Remaining
                      </span>
                      <span className={`text-lg font-black font-mono tracking-wider ${
                        timeLeft <= 120 ? 'text-red-400' : 'text-white'
                      }`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Required Passing Grade</span>
                    <span className="text-xs font-bold text-[#FF7A29]">≥ 70% (7 of 10 Correct)</span>
                  </div>
                </div>

                {/* Question List */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                  {IQ_QUESTIONS.map((q, qIndex) => {
                    const selectedOpt = userAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EDEAD9] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#201D1A]">
                            Question {qIndex + 1} of {IQ_QUESTIONS.length}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#EDEAD9] text-[#6B655D]">
                            {q.category}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-[#201D1A] leading-relaxed">
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleSelectAnswer(q.id, optIdx)}
                                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                                  isChosen
                                    ? 'bg-[#E66A1F] text-white border-[#E66A1F] shadow-xs'
                                    : 'bg-white text-[#201D1A] border-[#EDEAD9] hover:border-[#E66A1F]/40'
                                }`}
                              >
                                <span className="font-bold mr-2">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Submit Test Button */}
                <div className="pt-3 border-t border-[#EDEAD9] flex items-center justify-between">
                  <span className="text-xs text-[#6B655D]">
                    Answered: <strong className="text-[#201D1A]">{Object.keys(userAnswers).length}</strong> of {IQ_QUESTIONS.length}
                  </span>

                  <button
                    id="finish-iq-test-btn"
                    type="button"
                    onClick={calculateAndFinishTest}
                    className="py-3 px-6 bg-[#396B5A] hover:bg-[#2C5245] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md shadow-[#396B5A]/25 transition-transform active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit 10-Minute Assessment</span>
                  </button>
                </div>

              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: TEST RESULTS & FINAL SUBMIT */}
            {/* ============================================================== */}
            {step === 3 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                
                {/* Result Card */}
                <div className={`p-6 rounded-3xl border text-center space-y-3 ${
                  testPassed
                    ? 'bg-[#EEF7F4] border-[#396B5A]/40'
                    : 'bg-[#FEF4ED] border-[#E66A1F]/40'
                }`}>
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl font-black ${
                    testPassed ? 'bg-[#396B5A] text-white' : 'bg-[#E66A1F] text-white'
                  }`}>
                    {scorePercentage}%
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#201D1A]">
                      {testPassed ? 'Congratulations! Cognitive Evaluation Passed' : 'Evaluation Threshold Not Met'}
                    </h3>
                    <p className="text-xs text-[#6B655D] max-w-md mx-auto mt-1">
                      {testPassed
                        ? `You scored ${scorePercentage}% (Passing threshold: ≥ 70%). Your cognitive logic and confectionery aptitude qualification has been verified.`
                        : `You scored ${scorePercentage}%. A minimum score of 70% is required to qualify for Sugartown store and management openings.`
                      }
                    </p>
                  </div>
                </div>

                {/* Candidate & Application Summary */}
                <div className="bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] p-4 text-xs space-y-2">
                  <span className="font-bold text-[#201D1A] uppercase text-[10px] tracking-wider block">
                    Application Package Summary:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#6B655D]">
                    <div>Candidate: <strong className="text-[#201D1A]">{fullName}</strong> ({email})</div>
                    <div>Applied Role: <strong className="text-[#201D1A]">{selectedJob.title}</strong></div>
                    <div>Preferred Store: <strong className="text-[#201D1A]">{appliedLocations.join(', ')}</strong></div>
                    <div>Shift Schedule: <strong className="text-[#201D1A]">{preferredShift}</strong></div>
                    <div>Attached CV: <strong className="text-[#396B5A]">{uploadedCv?.name || 'CV Attached'}</strong></div>
                    <div>Verified Docs: <strong className="text-[#396B5A]">{documentsList.filter(d => d.file !== null).length} Files</strong></div>
                  </div>
                </div>

                {/* Questions Review */}
                <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                  <span className="text-[11px] font-bold text-[#6B655D] uppercase tracking-wider block">
                    Assessment Answer Review:
                  </span>
                  {IQ_QUESTIONS.map((q, idx) => {
                    const userAns = userAnswers[q.id];
                    const isCorrect = userAns === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-3 rounded-xl border text-xs ${
                          isCorrect ? 'bg-white border-[#396B5A]/30' : 'bg-white border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#201D1A]">
                            Q{idx + 1}: {q.question}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isCorrect ? 'bg-[#EEF7F4] text-[#396B5A]' : 'bg-red-50 text-red-600'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B655D] mt-1">
                          Rationale: {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
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

            {/* ============================================================== */}
            {/* STEP 4: SUCCESS CONFIRMATION */}
            {/* ============================================================== */}
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

                <div className="p-4 bg-[#FAF8F2] rounded-2xl border border-[#EDEAD9] text-xs max-w-md mx-auto text-left space-y-1.5">
                  <p className="text-[#396B5A] font-bold">✓ Enrolled into Candidate Registry</p>
                  <p className="text-[#6B655D]">✓ Locations Chosen: {appliedLocations.join(', ')}</p>
                  <p className="text-[#6B655D]">✓ CV & Verification Documents Attached ({uploadedCv?.name})</p>
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
