import {
  Application,
  ApplicationStatus,
  BusinessProfile,
  Job,
  JobFilterState,
  NotificationItem,
  ReportItem,
  SavedJob,
  UserRole,
  WorkerProfile,
} from '../types';
import { notificationService } from './notificationService';

const STORAGE_KEYS = {
  CURRENT_ROLE: 'mychowk_current_role',
  CURRENT_USER_ID: 'mychowk_current_user_id',
  CURRENT_WORKER_ID: 'mychowk_current_worker_id',
  CURRENT_BUSINESS_ID: 'mychowk_current_business_id',
  WORKERS: 'mychowk_workers',
  BUSINESSES: 'mychowk_businesses',
  JOBS: 'mychowk_jobs',
  APPLICATIONS: 'mychowk_applications',
  SAVED_JOBS: 'mychowk_saved_jobs',
  NOTIFICATIONS: 'mychowk_notifications',
  REPORTS: 'mychowk_reports',
  INITIALIZED: 'mychowk_initialized_v2',
};

// Nagpur Localities for accurate local market matching
export const NAGPUR_LOCALITIES = [
  'All Nagpur',
  'Sitabuldi',
  'Dharampeth',
  'Sadar',
  'Itwari',
  'Mahal',
  'Gandhibagh',
  'Pratap Nagar',
  'Trimurti Nagar',
  'Manewada',
  'Hingna MIDC',
  'Wardha Road',
  'Ramdaspeth',
  'Khamla',
  'Jaripatka',
  'Nandanvan',
] as const;

export const JOB_CATEGORIES = [
  { id: 'all', label: 'All Jobs', labelHi: 'सभी नौकरियां' },
  { id: 'kirana', label: 'Grocery & Kirana', labelHi: 'किराना दुकान' },
  { id: 'hotel', label: 'Hotel & Restaurant', labelHi: 'होटल व ढाबा' },
  { id: 'retail', label: 'Retail & Counter Sales', labelHi: 'दुकान व सेल्स' },
  { id: 'delivery', label: 'Delivery & Logistics', labelHi: 'डिलीवरी बॉय' },
  { id: 'technician', label: 'Electrician & Trades', labelHi: 'इलेक्ट्रीशियन व प्लम्बर' },
  { id: 'office', label: 'Office Helper & Peon', labelHi: 'ऑफिस हेल्पर / चपरासी' },
  { id: 'workshop', label: 'Workshop & Garage', labelHi: 'गैराज व कारीगर' },
  { id: 'cleaning', label: 'Housekeeping & Cleaning', labelHi: 'सफाई कर्मचारी' },
] as const;

// Realistic initial sample businesses in Nagpur
const INITIAL_BUSINESSES: BusinessProfile[] = [
  {
    id: 'biz_sharma_kirana',
    ownerName: 'Rajesh Sharma',
    businessName: 'Sharma Kirana & Superstore',
    category: 'Grocery & General Store',
    phone: '+91 98231 44521',
    locality: 'Sitabuldi',
    city: 'Nagpur',
    fullAddress: 'Plot 42, Main Road, Near Variety Square, Sitabuldi, Nagpur, MH 440012',
    description: 'Trusted family-run grocery supermarket serving Nagpur for 18 years. We offer punctual monthly salary, tea and snack allowance, and Diwali bonus.',
    photoUrl: '/assets/aistudio/WhatsApp_Image_2026-10-20_at_3.29.08_PM_8c34b5f8.jpeg',
    verificationStatus: 'verified',
    verificationDocsSubmitted: true,
  },
  {
    id: 'biz_nagpur_rasoi',
    ownerName: 'Chef Vikas Deshmukh',
    businessName: 'Nagpur Rasoi & Thali',
    category: 'Hotel & Restaurant',
    phone: '+91 94228 11904',
    locality: 'Dharampeth',
    city: 'Nagpur',
    fullAddress: 'Shop 12, West High Court (WHC) Road, Dharampeth, Nagpur, MH 440010',
    description: 'Renowned authentic Maharashtrian & North Indian dining restaurant. Friendly kitchen team, duty meals provided twice daily, clean work environment.',
    verificationStatus: 'verified',
    verificationDocsSubmitted: true,
  },
  {
    id: 'biz_quickspeed',
    ownerName: 'Amit Verma',
    businessName: 'QuickSpeed Express Logistics',
    category: 'Delivery & Logistics',
    phone: '+91 88884 76231',
    locality: 'Hingna MIDC',
    city: 'Nagpur',
    fullAddress: 'Shed C-14, Industrial Area, Hingna MIDC, Nagpur, MH 440028',
    description: 'Local delivery hub for parcels and daily grocery supplies across Nagpur. Daily fuel allowance, helmet provided, prompt weekly payouts.',
    verificationStatus: 'verified',
    verificationDocsSubmitted: true,
  },
  {
    id: 'biz_modern_garments',
    ownerName: 'Sunil Agrawal',
    businessName: 'Modern Garments & Saree Depot',
    category: 'Retail & Clothing',
    phone: '+91 71227 65432',
    locality: 'Itwari',
    city: 'Nagpur',
    fullAddress: 'Sarafa Bazaar, Itwari, Nagpur, MH 440002',
    description: 'Traditional wholesale and retail cloth merchant with high footfall during festival seasons.',
    verificationStatus: 'unverified',
    verificationDocsSubmitted: false,
  },
  {
    id: 'biz_apex_cool',
    ownerName: 'Prashant Wankhede',
    businessName: 'Nagpur Cool Appliance Care',
    category: 'Electrician & Trades',
    phone: '+91 91583 00219',
    locality: 'Sadar',
    city: 'Nagpur',
    fullAddress: 'Residency Road, Sadar Bazar, Nagpur, MH 440001',
    description: 'Air conditioning, refrigerator, and domestic wiring service center across Central Nagpur.',
    verificationStatus: 'verified',
    verificationDocsSubmitted: true,
  },
];

// Realistic initial sample jobs in Nagpur
const INITIAL_JOBS: Job[] = [
  {
    id: 'job_kirana_sales',
    businessId: 'biz_sharma_kirana',
    businessName: 'Sharma Kirana & Superstore',
    businessCategory: 'Grocery & General Store',
    title: 'Counter Sales & Billing Assistant',
    category: 'kirana',
    description: 'Looking for a polite and attentive shop assistant for customer order packing, billing, and keeping inventory neat. Must know basic Marathi or Hindi.',
    requiredSkills: ['Counter Sales', 'Customer Service', 'Cash Handling', 'Stock Arranging'],
    vacancies: 2,
    minSalary: 14000,
    maxSalary: 17000,
    salaryPeriod: 'monthly',
    workType: 'full_time',
    workingHours: '9:30 AM - 8:30 PM (1.5 hr afternoon break)',
    weeklyOff: 'Tuesday',
    minExperienceYears: 0,
    locality: 'Sitabuldi',
    city: 'Nagpur',
    fullAddress: 'Plot 42, Main Road, Variety Square, Sitabuldi, Nagpur',
    contactPreference: 'both',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hrs ago
    deadline: '2026-11-15',
    joiningDate: 'Immediate',
    isVerifiedBusiness: true,
  },
  {
    id: 'job_rasoi_cook',
    businessId: 'biz_nagpur_rasoi',
    businessName: 'Nagpur Rasoi & Thali',
    businessCategory: 'Hotel & Restaurant',
    title: 'Tandoor & Curry Assistant Cook (हेल्पर कुक)',
    category: 'hotel',
    description: 'Urgent requirement for assistant cook for North Indian gravy preparation and tandoor roti. 2 hot duty meals included every day. Overtime pay on festival days.',
    requiredSkills: ['Cooking Helper', 'Tandoor', 'Vegetable Cutting', 'Kitchen Hygiene'],
    vacancies: 2,
    minSalary: 18000,
    maxSalary: 22000,
    salaryPeriod: 'monthly',
    workType: 'full_time',
    workingHours: '11:00 AM - 3:30 PM & 6:30 PM - 11:00 PM',
    weeklyOff: 'Monday',
    minExperienceYears: 1,
    locality: 'Dharampeth',
    city: 'Nagpur',
    fullAddress: 'Shop 12, WHC Road, Dharampeth, Nagpur',
    contactPreference: 'both',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(), // 18 hrs ago
    deadline: '2026-11-10',
    joiningDate: 'Within 3 days',
    isVerifiedBusiness: true,
  },
  {
    id: 'job_delivery_rider',
    businessId: 'biz_quickspeed',
    businessName: 'QuickSpeed Express Logistics',
    businessCategory: 'Delivery & Logistics',
    title: 'Local Bike Delivery Associate (Nagpur City)',
    category: 'delivery',
    description: 'Deliver e-commerce and local shop parcels within 5 km radius of Hingna and Wardha Road. Petrol allowance ₹3.50/km extra. Weekly Tuesday cash settlement.',
    requiredSkills: ['Two-Wheeler Driving', 'Smart Phone Maps', 'Local Route Knowledge'],
    vacancies: 5,
    minSalary: 550,
    maxSalary: 750,
    salaryPeriod: 'daily',
    workType: 'full_time',
    workingHours: '10:00 AM - 7:00 PM',
    weeklyOff: 'Sunday',
    minExperienceYears: 0,
    locality: 'Hingna MIDC',
    city: 'Nagpur',
    fullAddress: 'Shed C-14, Industrial Area, Hingna, Nagpur',
    contactPreference: 'whatsapp',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    joiningDate: 'Immediate',
    isVerifiedBusiness: true,
  },
  {
    id: 'job_garment_sales',
    businessId: 'biz_modern_garments',
    businessName: 'Modern Garments & Saree Depot',
    businessCategory: 'Retail & Clothing',
    title: 'Retail Salesperson (साड़ी एवं कपड़ा सेल्समैन)',
    category: 'retail',
    description: 'Show sarees and dress material to walk-in families. Polite communication and saree folding knowledge preferred. Freshers with enthusiasm welcome.',
    requiredSkills: ['Retail Sales', 'Saree Folding', 'Polite Communication'],
    vacancies: 3,
    minSalary: 13000,
    maxSalary: 16000,
    salaryPeriod: 'monthly',
    workType: 'full_time',
    workingHours: '10:30 AM - 8:30 PM',
    weeklyOff: 'Sunday',
    minExperienceYears: 0,
    locality: 'Itwari',
    city: 'Nagpur',
    fullAddress: 'Sarafa Bazaar, Itwari, Nagpur',
    contactPreference: 'call',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    joiningDate: 'Immediate',
    isVerifiedBusiness: false,
  },
  {
    id: 'job_ac_technician',
    businessId: 'biz_apex_cool',
    businessName: 'Nagpur Cool Appliance Care',
    businessCategory: 'Electrician & Trades',
    title: 'AC & Washing Machine Field Technician',
    category: 'technician',
    description: 'Doorstep repair and installation of split ACs and domestic electronics in Sadar and Civil Lines. Toolkit provided by company.',
    requiredSkills: ['AC Servicing', 'Electrical Wiring', 'Appliance Diagnosis'],
    vacancies: 2,
    minSalary: 16000,
    maxSalary: 21000,
    salaryPeriod: 'monthly',
    workType: 'full_time',
    workingHours: '9:30 AM - 7:00 PM',
    weeklyOff: 'Wednesday',
    minExperienceYears: 1,
    locality: 'Sadar',
    city: 'Nagpur',
    fullAddress: 'Residency Road, Sadar, Nagpur',
    contactPreference: 'both',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    joiningDate: 'Immediate',
    isVerifiedBusiness: true,
  },
  {
    id: 'job_office_helper',
    businessId: 'biz_sharma_kirana',
    businessName: 'Sharma Kirana & Superstore',
    businessCategory: 'Grocery & General Store',
    title: 'Warehouse Loader & Stock Helper',
    category: 'kirana',
    description: 'Loading, unloading grain sacks, arranging godown shelves, and maintaining cleanliness. Honest and hard-working candidate needed.',
    requiredSkills: ['Heavy Lifting', 'Inventory Counting', 'Store Maintenance'],
    vacancies: 2,
    minSalary: 450,
    maxSalary: 550,
    salaryPeriod: 'daily',
    workType: 'daily_wage',
    workingHours: '8:30 AM - 5:30 PM',
    weeklyOff: 'Sunday',
    minExperienceYears: 0,
    locality: 'Sitabuldi',
    city: 'Nagpur',
    fullAddress: 'Plot 42, Main Road, Variety Square, Sitabuldi, Nagpur',
    contactPreference: 'call',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    joiningDate: 'Immediate',
    isVerifiedBusiness: true,
  },
];

// Initial default worker profile (active test worker: Ramesh Patil)
const INITIAL_WORKERS: WorkerProfile[] = [
  {
    id: 'worker_ramesh_patil',
    name: 'Rameshwar Patil',
    phone: '+91 97645 23891',
    skills: ['Counter Sales', 'Customer Service', 'Cash Handling', 'Cooking Helper'],
    experienceYears: 2,
    experienceDescription: 'Worked 2 years in general store counter sales and kitchen assistance in Nagpur.',
    preferredLocation: 'Sitabuldi',
    expectedSalary: 15000,
    salaryPeriod: 'monthly',
    workType: 'full_time',
    availability: 'immediate',
    preferredHours: 'General (9:30 AM - 8:00 PM)',
    languages: ['Hindi', 'Marathi', 'Basic English'],
    isPhoneVerified: true,
    hidePhoneUntilShortlist: false,
    aboutMe: 'Punctual, non-smoker, hardworking local resident of Sitabuldi, Nagpur.',
  },
  {
    id: 'worker_sunil_meshram',
    name: 'Sunil Meshram',
    phone: '+91 93251 88410',
    skills: ['Two-Wheeler Driving', 'Smart Phone Maps', 'Local Route Knowledge'],
    experienceYears: 1,
    preferredLocation: 'Hingna MIDC',
    expectedSalary: 600,
    salaryPeriod: 'daily',
    workType: 'full_time',
    availability: 'immediate',
    languages: ['Hindi', 'Marathi'],
    isPhoneVerified: true,
    hidePhoneUntilShortlist: false,
  },
];

// Initial demo applications
const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app_sample_1',
    jobId: 'job_kirana_sales',
    jobTitle: 'Counter Sales & Billing Assistant',
    businessId: 'biz_sharma_kirana',
    businessName: 'Sharma Kirana & Superstore',
    workerId: 'worker_ramesh_patil',
    workerName: 'Rameshwar Patil',
    workerPhone: '+91 97645 23891',
    workerSkills: ['Counter Sales', 'Customer Service', 'Cash Handling'],
    workerExperienceYears: 2,
    workerExpectedSalary: 15000,
    workerSalaryPeriod: 'monthly',
    workerLocality: 'Sitabuldi, Nagpur',
    status: 'shortlisted',
    appliedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    coverNote: 'Sir, I stay in Sitabuldi and can start immediately.',
    employerNotes: 'Good profile, called for counter interview on Wednesday at 11 AM.',
  },
];

// Initial demo notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_init_1',
    recipientId: 'worker_ramesh_patil',
    role: 'worker',
    title: 'Application Shortlisted!',
    message: 'Sharma Kirana & Superstore shortlisted your application for Counter Sales. Check details.',
    type: 'status_updated',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    relatedJobId: 'job_kirana_sales',
  },
  {
    id: 'notif_init_2',
    recipientId: 'biz_sharma_kirana',
    role: 'business',
    title: 'New Applicant Received',
    message: 'Rameshwar Patil applied for Counter Sales & Billing Assistant.',
    type: 'new_applicant',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    relatedJobId: 'job_kirana_sales',
  },
];

class AppStorage {
  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return;
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
      localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(INITIAL_WORKERS));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(['job_rasoi_cook']));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, 'worker');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'worker_ramesh_patil');
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  // --- Auth & Role ---
  getCurrentRole(): UserRole {
    return (localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) as UserRole) || 'worker';
  }

  setCurrentRole(role: UserRole) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    if (role === 'worker') {
      const savedWorkerId = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKER_ID) || 'worker_ramesh_patil';
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, savedWorkerId);
    } else {
      const savedBizId = localStorage.getItem(STORAGE_KEYS.CURRENT_BUSINESS_ID) || 'biz_sharma_kirana';
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, savedBizId);
    }
    window.dispatchEvent(new Event('mychowk-role-change'));
  }

  getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'worker_ramesh_patil';
  }

  switchAccount(role: UserRole, accountId: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, accountId);
    if (role === 'worker') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_WORKER_ID, accountId);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_BUSINESS_ID, accountId);
    }
    window.dispatchEvent(new Event('mychowk-role-change'));
  }

  // --- Worker Profiles & Registration ---
  registerWorker(profileData: Omit<WorkerProfile, 'id'>): WorkerProfile {
    const workers = this.getWorkers();
    const newWorker: WorkerProfile = {
      ...profileData,
      id: `worker_${Date.now()}`,
      isPhoneVerified: true,
    };
    workers.unshift(newWorker);
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
    this.switchAccount('worker', newWorker.id);
    window.dispatchEvent(new Event('mychowk-worker-update'));
    return newWorker;
  }

  getWorker(id: string): WorkerProfile | null {
    const workers = this.getWorkers();
    return workers.find((w) => w.id === id) || workers[0] || null;
  }

  getWorkers(): WorkerProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKERS);
      return data ? JSON.parse(data) : INITIAL_WORKERS;
    } catch {
      return INITIAL_WORKERS;
    }
  }

  updateWorker(worker: WorkerProfile) {
    const workers = this.getWorkers();
    const index = workers.findIndex((w) => w.id === worker.id);
    if (index >= 0) {
      workers[index] = worker;
    } else {
      workers.push(worker);
    }
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
    window.dispatchEvent(new Event('mychowk-worker-update'));
  }

  // --- Business Profiles & Registration ---
  registerBusiness(profileData: Omit<BusinessProfile, 'id'>): BusinessProfile {
    const businesses = this.getBusinesses();
    const newBiz: BusinessProfile = {
      ...profileData,
      id: `biz_${Date.now()}`,
      verificationStatus: 'unverified',
      verificationDocsSubmitted: false,
    };
    businesses.unshift(newBiz);
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
    this.switchAccount('business', newBiz.id);
    window.dispatchEvent(new Event('mychowk-business-update'));
    return newBiz;
  }

  getBusiness(id: string): BusinessProfile | null {
    const businesses = this.getBusinesses();
    return businesses.find((b) => b.id === id) || businesses[0] || null;
  }

  getBusinesses(): BusinessProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
      return data ? JSON.parse(data) : INITIAL_BUSINESSES;
    } catch {
      return INITIAL_BUSINESSES;
    }
  }

  updateBusiness(business: BusinessProfile) {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex((b) => b.id === business.id);
    if (index >= 0) {
      businesses[index] = business;
    } else {
      businesses.push(business);
    }
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));

    // Also sync the verified badge across all this business's jobs!
    const jobs = this.getJobs();
    let jobsUpdated = false;
    jobs.forEach((j) => {
      if (j.businessId === business.id) {
        j.isVerifiedBusiness = business.verificationStatus === 'verified';
        j.businessName = business.businessName;
        jobsUpdated = true;
      }
    });
    if (jobsUpdated) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    }

    window.dispatchEvent(new Event('mychowk-business-update'));
  }

  // Manual toggle for demonstration as explicitly requested by user
  toggleBusinessVerification(businessId: string): BusinessProfile | null {
    const biz = this.getBusiness(businessId);
    if (!biz) return null;
    biz.verificationStatus = biz.verificationStatus === 'verified' ? 'unverified' : 'verified';
    biz.verificationDocsSubmitted = biz.verificationStatus === 'verified';
    this.updateBusiness(biz);
    return biz;
  }

  // --- Jobs ---
  getJobs(): Job[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS);
      return data ? JSON.parse(data) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  }

  getJobById(id: string): Job | null {
    const jobs = this.getJobs();
    return jobs.find((j) => j.id === id) || null;
  }

  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'status'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    jobs.unshift(newJob);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));

    // PUSH NOTIFICATION DISPATCH TO MATCHING WORKERS:
    this.notifyMatchingWorkersForNewJob(newJob);

    window.dispatchEvent(new Event('mychowk-jobs-update'));
    return newJob;
  }

  updateJob(job: Job) {
    const jobs = this.getJobs();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      jobs[index] = job;
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      window.dispatchEvent(new Event('mychowk-jobs-update'));
    }
  }

  toggleJobStatus(jobId: string, status: 'active' | 'paused' | 'closed') {
    const job = this.getJobById(jobId);
    if (job) {
      job.status = status;
      this.updateJob(job);
    }
  }

  deleteJob(jobId: string) {
    let jobs = this.getJobs();
    jobs = jobs.filter((j) => j.id !== jobId);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    window.dispatchEvent(new Event('mychowk-jobs-update'));
  }

  // --- Push Notification Trigger for Matching Workers ---
  private notifyMatchingWorkersForNewJob(newJob: Job) {
    const workers = this.getWorkers();

    workers.forEach((worker) => {
      const matchesSkill =
        worker.skills.some((skill) =>
          newJob.requiredSkills.some((req) => req.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(req.toLowerCase()))
        ) ||
        newJob.title.toLowerCase().includes(worker.skills[0]?.toLowerCase() || '') ||
        newJob.category === worker.skills[0]?.toLowerCase();

      const matchesLocation =
        !worker.preferredLocation ||
        worker.preferredLocation.toLowerCase().includes(newJob.locality.toLowerCase()) ||
        newJob.locality.toLowerCase().includes(worker.preferredLocation.toLowerCase()) ||
        worker.preferredLocation === 'All Nagpur';

      const matchesSalary = !worker.expectedSalary || newJob.maxSalary >= worker.expectedSalary * 0.8;

      if (matchesSkill || matchesLocation) {
        // Create in-app notification item
        const notif: NotificationItem = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          recipientId: worker.id,
          role: 'worker',
          title: `New Job Match: ${newJob.title}`,
          message: `₹${newJob.minSalary.toLocaleString('en-IN')}–₹${newJob.maxSalary.toLocaleString('en-IN')} at ${newJob.businessName} (${newJob.locality}). Matches your profile!`,
          type: 'job_alert',
          isRead: false,
          createdAt: new Date().toISOString(),
          relatedJobId: newJob.id,
        };
        this.addNotification(notif);

        // If the current active role/user is this worker, trigger Web Push & chime!
        if (this.getCurrentRole() === 'worker' && this.getCurrentUserId() === worker.id) {
          notificationService.sendPush(`New Job Match: ${newJob.title}`, {
            body: `₹${newJob.maxSalary.toLocaleString('en-IN')} at ${newJob.businessName}, ${newJob.locality}. Apply now on MY CHOWK!`,
            tag: `job-${newJob.id}`,
          });
        }
      }
    });
  }

  // --- Applications ---
  getApplications(): Application[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  }

  getApplicationsForWorker(workerId: string): Application[] {
    return this.getApplications().filter((a) => a.workerId === workerId);
  }

  getApplicationsForBusiness(businessId: string): Application[] {
    return this.getApplications().filter((a) => a.businessId === businessId);
  }

  getApplicationsForJob(jobId: string): Application[] {
    return this.getApplications().filter((a) => a.jobId === jobId);
  }

  hasApplied(workerId: string, jobId: string): boolean {
    return this.getApplications().some((a) => a.workerId === workerId && a.jobId === jobId && a.status !== 'withdrawn');
  }

  submitApplication(
    jobId: string,
    worker: WorkerProfile,
    coverNote?: string
  ): { success: boolean; application?: Application; error?: string } {
    const job = this.getJobById(jobId);
    if (!job) return { success: false, error: 'Job not found' };

    if (this.hasApplied(worker.id, jobId)) {
      return { success: false, error: 'You have already applied for this job.' };
    }

    const newApp: Application = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      businessId: job.businessId,
      businessName: job.businessName,
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      workerSkills: worker.skills,
      workerExperienceYears: worker.experienceYears,
      workerExpectedSalary: worker.expectedSalary,
      workerSalaryPeriod: worker.salaryPeriod,
      workerLocality: worker.preferredLocation,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      coverNote,
    };

    const apps = this.getApplications();
    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // Notify Business Owner:
    const bizNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientId: job.businessId,
      role: 'business',
      title: `New Applicant for ${job.title}!`,
      message: `${worker.name} (${worker.experienceYears} yrs exp, ${worker.preferredLocation}) just applied. Tap to review.`,
      type: 'new_applicant',
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedJobId: job.id,
      relatedApplicationId: newApp.id,
    };
    this.addNotification(bizNotif);

    // Send push notification to business owner:
    notificationService.sendPush(`New Applicant: ${worker.name}`, {
      body: `Applied for "${job.title}". Skills: ${worker.skills.slice(0, 3).join(', ')}.`,
      tag: `app-${newApp.id}`,
    });

    // Also notify worker of successful submission:
    const workerNotif: NotificationItem = {
      id: `notif_${Date.now()}_w`,
      recipientId: worker.id,
      role: 'worker',
      title: 'Application Submitted!',
      message: `Your application for "${job.title}" at ${job.businessName} was sent successfully.`,
      type: 'application_submitted',
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedJobId: job.id,
      relatedApplicationId: newApp.id,
    };
    this.addNotification(workerNotif);

    window.dispatchEvent(new Event('mychowk-applications-update'));
    return { success: true, application: newApp };
  }

  updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    employerNotes?: string
  ): Application | null {
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) return null;

    app.status = status;
    app.updatedAt = new Date().toISOString();
    if (employerNotes !== undefined) {
      app.employerNotes = employerNotes;
    }
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));

    // Push notification to worker:
    const statusText =
      status === 'shortlisted'
        ? 'Shortlisted! The employer would like to contact you.'
        : status === 'accepted'
        ? 'Accepted! Congratulations on being selected.'
        : status === 'rejected'
        ? 'Update on your job application.'
        : 'Status updated.';

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      recipientId: app.workerId,
      role: 'worker',
      title: `Application ${status.toUpperCase()}: ${app.jobTitle}`,
      message: `${app.businessName} has updated your status: ${statusText}`,
      type: 'status_updated',
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedJobId: app.jobId,
      relatedApplicationId: app.id,
    };
    this.addNotification(notif);

    // Trigger push notification:
    notificationService.sendPush(`Application ${status.charAt(0).toUpperCase() + status.slice(1)}!`, {
      body: `${app.businessName} (${app.jobTitle}): ${statusText}`,
      tag: `app-status-${app.id}`,
    });

    window.dispatchEvent(new Event('mychowk-applications-update'));
    return app;
  }

  withdrawApplication(applicationId: string): boolean {
    const apps = this.getApplications();
    const app = apps.find((a) => a.id === applicationId);
    if (!app) return false;
    app.status = 'withdrawn';
    app.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    window.dispatchEvent(new Event('mychowk-applications-update'));
    return true;
  }

  // --- Saved Jobs ---
  getSavedJobIds(workerId: string): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  toggleSaveJob(workerId: string, jobId: string): boolean {
    const saved = this.getSavedJobIds(workerId);
    let isSavedNow = false;
    let updated: string[];
    if (saved.includes(jobId)) {
      updated = saved.filter((id) => id !== jobId);
      isSavedNow = false;
    } else {
      updated = [...saved, jobId];
      isSavedNow = true;
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(updated));
    window.dispatchEvent(new Event('mychowk-saved-update'));
    return isSavedNow;
  }

  // --- Notifications ---
  getNotifications(userId: string, role: UserRole): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: NotificationItem[] = data ? JSON.parse(data) : [];
      return all
        .filter((n) => n.recipientId === userId || n.role === role)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      return [];
    }
  }

  addNotification(notif: NotificationItem) {
    const all = this.getAllNotifications();
    all.unshift(notif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all.slice(0, 50)));
    window.dispatchEvent(new Event('mychowk-notifications-update'));
  }

  private getAllNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  markNotificationAsRead(id: string) {
    const all = this.getAllNotifications();
    const n = all.find((item) => item.id === id);
    if (n) {
      n.isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
      window.dispatchEvent(new Event('mychowk-notifications-update'));
    }
  }

  markAllNotificationsAsRead(userId: string) {
    const all = this.getAllNotifications();
    all.forEach((n) => {
      if (n.recipientId === userId) n.isRead = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    window.dispatchEvent(new Event('mychowk-notifications-update'));
  }

  // --- Reports ---
  submitReport(report: Omit<ReportItem, 'id' | 'timestamp'>): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      const reports: ReportItem[] = data ? JSON.parse(data) : [];
      reports.push({
        ...report,
        id: `rep_${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      return true;
    } catch {
      return false;
    }
  }

  // --- Reset demo data ---
  resetToInitialDemo() {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    localStorage.removeItem(STORAGE_KEYS.WORKERS);
    localStorage.removeItem(STORAGE_KEYS.BUSINESSES);
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_JOBS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    this.ensureInitialized();
    window.dispatchEvent(new Event('mychowk-role-change'));
  }
}

export const appStorage = new AppStorage();

// Helper to filter and sort jobs based on user filters
export function filterAndSortJobs(jobs: Job[], filters: JobFilterState): Job[] {
  return jobs.filter((job) => {
    // Only show active jobs in public feed
    if (job.status !== 'active') return false;

    // Search query: match title, description, skills, business name
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchBiz = job.businessName.toLowerCase().includes(q);
      const matchLoc = job.locality.toLowerCase().includes(q);
      const matchSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(q));
      const matchDesc = job.description.toLowerCase().includes(q);
      if (!matchTitle && !matchBiz && !matchLoc && !matchSkills && !matchDesc) {
        return false;
      }
    }

    // Category
    if (filters.category && filters.category !== 'all') {
      if (job.category !== filters.category) return false;
    }

    // Locality
    if (filters.locality && filters.locality !== 'All Nagpur') {
      if (!job.locality.toLowerCase().includes(filters.locality.toLowerCase())) {
        return false;
      }
    }

    // Work Type
    if (filters.workType && filters.workType !== 'all') {
      if (job.workType !== filters.workType) return false;
    }

    // Min Salary (normalized for monthly/daily)
    if (filters.minSalary > 0) {
      const jobMaxNormalized = job.salaryPeriod === 'daily' ? job.maxSalary * 26 : job.maxSalary;
      if (jobMaxNormalized < filters.minSalary) return false;
    }

    // Experience
    if (filters.maxExperience !== undefined && filters.maxExperience >= 0) {
      if (job.minExperienceYears > filters.maxExperience) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sortBy === 'salary_high') {
      const aSal = a.salaryPeriod === 'daily' ? a.maxSalary * 26 : a.maxSalary;
      const bSal = b.salaryPeriod === 'daily' ? b.maxSalary * 26 : b.maxSalary;
      return bSal - aSal;
    }
    if (filters.sortBy === 'salary_low') {
      const aSal = a.salaryPeriod === 'daily' ? a.minSalary * 26 : a.minSalary;
      const bSal = b.salaryPeriod === 'daily' ? b.minSalary * 26 : b.minSalary;
      return aSal - bSal;
    }
    // relevance: verified first, then newest
    if (a.isVerifiedBusiness !== b.isVerifiedBusiness) {
      return a.isVerifiedBusiness ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
