export type UserRole = 'worker' | 'business';

export type WorkType = 'full_time' | 'part_time' | 'daily_wage' | 'temporary';

export type SalaryPeriod = 'monthly' | 'daily' | 'weekly' | 'hourly';

export type ApplicationStatus = 'applied' | 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn';

export type JobStatus = 'active' | 'paused' | 'closed';

export type VerificationStatus = 'verified' | 'unverified' | 'pending_review';

export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  skills: string[];
  experienceYears: number;
  experienceDescription?: string;
  preferredLocation: string; // Locality in Nagpur (e.g. "Sitabuldi, Nagpur")
  expectedSalary: number;
  salaryPeriod: SalaryPeriod;
  workType: WorkType;
  availability: 'immediate' | 'within_7_days' | 'within_15_days';
  preferredHours?: string; // e.g. "Morning (8 AM - 4 PM)", "General (10 AM - 8 PM)", "Any"
  languages: string[];
  isPhoneVerified: boolean;
  hidePhoneUntilShortlist: boolean;
  aboutMe?: string;
}

export interface BusinessProfile {
  id: string;
  ownerName: string;
  businessName: string;
  category: string; // "Grocery & General Store", "Hotel & Restaurant", "Retail & Clothing", "Logistics & Delivery", etc.
  phone: string;
  locality: string; // e.g. "Dharampeth"
  city: string; // e.g. "Nagpur"
  fullAddress: string;
  description: string;
  photoUrl?: string;
  verificationStatus: VerificationStatus;
  verificationDocsSubmitted?: boolean;
}

export interface Job {
  id: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  vacancies: number;
  minSalary: number;
  maxSalary: number;
  salaryPeriod: SalaryPeriod;
  workType: WorkType;
  workingHours: string; // e.g. "9:30 AM - 8:00 PM"
  weeklyOff: string; // e.g. "Sunday" or "Tuesday"
  minExperienceYears: number; // 0 for fresher
  locality: string; // e.g. "Sitabuldi"
  city: string; // e.g. "Nagpur"
  fullAddress: string;
  contactPreference: 'call' | 'whatsapp' | 'both';
  status: JobStatus;
  createdAt: string; // ISO date
  deadline?: string;
  joiningDate?: string;
  isVerifiedBusiness: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  businessId: string;
  businessName: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerSkills: string[];
  workerExperienceYears: number;
  workerExpectedSalary: number;
  workerSalaryPeriod: SalaryPeriod;
  workerLocality: string;
  status: ApplicationStatus;
  appliedAt: string; // ISO string
  updatedAt: string;
  coverNote?: string;
  employerNotes?: string;
  interviewDate?: string;
}

export interface SavedJob {
  id: string;
  workerId: string;
  jobId: string;
  savedAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // workerId or businessId
  role: UserRole;
  title: string;
  message: string;
  type: 'application_submitted' | 'status_updated' | 'new_applicant' | 'job_alert' | 'system';
  isRead: boolean;
  createdAt: string;
  relatedJobId?: string;
  relatedApplicationId?: string;
}

export interface ReportItem {
  id: string;
  reportedBy: string;
  reporterRole: UserRole;
  targetType: 'job' | 'business' | 'worker';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  timestamp: string;
}

export interface JobFilterState {
  searchQuery: string;
  category: string;
  locality: string;
  workType: string;
  minSalary: number;
  maxExperience: number;
  sortBy: 'newest' | 'salary_high' | 'salary_low' | 'relevance';
}
