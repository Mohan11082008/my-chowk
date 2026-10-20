import React, { useState, useEffect } from 'react';
import {
  UserRole,
  Job,
  WorkerProfile,
  BusinessProfile,
  Application,
  JobFilterState,
} from './types';
import { appStorage, filterAndSortJobs, NAGPUR_LOCALITIES } from './services/storage';
import { Header } from './components/Header';
import { BottomNav, WorkerTab, BusinessTab } from './components/BottomNav';
import { WorkerHome } from './components/WorkerHome';
import { WorkerSearchTab } from './components/WorkerSearchTab';
import { MyApplications } from './components/MyApplications';
import { SavedJobs } from './components/SavedJobs';
import { WorkerProfileView } from './components/WorkerProfileView';
import { BusinessDashboard } from './components/BusinessDashboard';
import { BusinessJobs } from './components/BusinessJobs';
import { ApplicantManager } from './components/ApplicantManager';
import { BusinessProfileView } from './components/BusinessProfileView';
import { JobDetailsModal } from './components/JobDetailsModal';
import { PostJobModal } from './components/PostJobModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationToast } from './components/NotificationToast';
import { FilterDrawer } from './components/FilterDrawer';
import { ReportModal } from './components/ReportModal';

export default function App() {
  // Current Role & Profiles
  const [currentRole, setCurrentRole] = useState<UserRole>('worker');
  const [currentUserId, setCurrentUserId] = useState<string>('worker_ramesh_patil');
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);

  // Tabs
  const [workerTab, setWorkerTab] = useState<WorkerTab>('home');
  const [businessTab, setBusinessTab] = useState<BusinessTab>('dashboard');

  // Data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  // Filter state
  const [filters, setFilters] = useState<JobFilterState>({
    searchQuery: '',
    category: 'all',
    locality: 'All Nagpur',
    workType: 'all',
    minSalary: 0,
    maxExperience: -1,
    sortBy: 'relevance',
  });

  // Modals
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [jobToReport, setJobToReport] = useState<Job | null>(null);
  const [selectedJobIdForApplicantFilter, setSelectedJobIdForApplicantFilter] = useState<string | null>(null);

  // Load all data from storage
  const reloadData = () => {
    const role = appStorage.getCurrentRole();
    const userId = appStorage.getCurrentUserId();
    setCurrentRole(role);
    setCurrentUserId(userId);

    const worker = appStorage.getWorker(role === 'worker' ? userId : 'worker_ramesh_patil');
    const biz = appStorage.getBusiness(role === 'business' ? userId : 'biz_sharma_kirana');
    setWorkerProfile(worker);
    setBusinessProfile(biz);

    const allJobs = appStorage.getJobs();
    setJobs(allJobs);

    const allApps = appStorage.getApplications();
    setApplications(allApps);

    if (worker) {
      setSavedJobIds(appStorage.getSavedJobIds(worker.id));
    }

    const notifs = appStorage.getNotifications(userId, role);
    setUnreadNotificationsCount(notifs.filter((n) => !n.isRead).length);
  };

  useEffect(() => {
    reloadData();

    const handleRoleChange = () => reloadData();
    const handleJobsUpdate = () => {
      setJobs(appStorage.getJobs());
    };
    const handleAppsUpdate = () => {
      setApplications(appStorage.getApplications());
    };
    const handleSavedUpdate = () => {
      if (workerProfile) setSavedJobIds(appStorage.getSavedJobIds(workerProfile.id));
    };
    const handleNotifsUpdate = () => {
      const notifs = appStorage.getNotifications(currentUserId, currentRole);
      setUnreadNotificationsCount(notifs.filter((n) => !n.isRead).length);
    };

    window.addEventListener('mychowk-role-change', handleRoleChange);
    window.addEventListener('mychowk-jobs-update', handleJobsUpdate);
    window.addEventListener('mychowk-applications-update', handleAppsUpdate);
    window.addEventListener('mychowk-saved-update', handleSavedUpdate);
    window.addEventListener('mychowk-notifications-update', handleNotifsUpdate);
    window.addEventListener('mychowk-worker-update', reloadData);
    window.addEventListener('mychowk-business-update', reloadData);

    return () => {
      window.removeEventListener('mychowk-role-change', handleRoleChange);
      window.removeEventListener('mychowk-jobs-update', handleJobsUpdate);
      window.removeEventListener('mychowk-applications-update', handleAppsUpdate);
      window.removeEventListener('mychowk-saved-update', handleSavedUpdate);
      window.removeEventListener('mychowk-notifications-update', handleNotifsUpdate);
      window.removeEventListener('mychowk-worker-update', reloadData);
      window.removeEventListener('mychowk-business-update', reloadData);
    };
  }, [currentUserId, currentRole]);

  // Role switch handler
  const handleSelectRole = (newRole: UserRole) => {
    appStorage.setCurrentRole(newRole);
    setCurrentRole(newRole);
    if (newRole === 'worker') {
      setWorkerTab('home');
    } else {
      setBusinessTab('dashboard');
    }
    reloadData();
  };

  // Save bookmark handler
  const handleSaveToggle = (jobId: string) => {
    if (!workerProfile) return;
    const isSaved = appStorage.toggleSaveJob(workerProfile.id, jobId);
    setSavedJobIds(appStorage.getSavedJobIds(workerProfile.id));
  };

  // Toggle business verification for demo purposes
  const handleToggleVerification = () => {
    if (!businessProfile) return;
    const updated = appStorage.toggleBusinessVerification(businessProfile.id);
    if (updated) {
      setBusinessProfile(updated);
      setJobs(appStorage.getJobs());
    }
  };

  // Computed filtered jobs
  const displayedJobs = filterAndSortJobs(jobs, filters);

  const appliedJobIds = workerProfile
    ? applications.filter((a) => a.workerId === workerProfile.id && a.status !== 'withdrawn').map((a) => a.jobId)
    : [];

  const myWorkerApplications = workerProfile
    ? applications.filter((a) => a.workerId === workerProfile.id)
    : [];

  const myBusinessApplications = businessProfile
    ? applications.filter((a) => a.businessId === businessProfile.id)
    : [];

  const newBusinessApplicantsCount = myBusinessApplications.filter((a) => a.status === 'applied').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Real-time Notification Banner Toast */}
      <NotificationToast />

      {/* Main App Top Navigation Bar */}
      <Header
        currentRole={currentRole}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        currentLocality={filters.locality}
        onSelectLocalityClick={() => setIsFilterDrawerOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6">
        {currentRole === 'worker' ? (
          /* WORKER ROLE VIEWS */
          <>
            {workerTab === 'home' && (
              <WorkerHome
                jobs={displayedJobs}
                workerProfile={workerProfile}
                savedJobIds={savedJobIds}
                appliedJobIds={appliedJobIds}
                filters={filters}
                onUpdateFilters={setFilters}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onSaveToggle={handleSaveToggle}
                onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
                onNavigateToApplications={() => setWorkerTab('applications')}
              />
            )}

            {workerTab === 'search' && (
              <WorkerSearchTab
                jobs={displayedJobs}
                savedJobIds={savedJobIds}
                appliedJobIds={appliedJobIds}
                filters={filters}
                onUpdateFilters={setFilters}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onSaveToggle={handleSaveToggle}
                onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
              />
            )}

            {workerTab === 'applications' && (
              <MyApplications
                applications={myWorkerApplications}
                onSelectJob={(jobId) => {
                  const j = appStorage.getJobById(jobId);
                  if (j) setSelectedJobForDetails(j);
                }}
                onRefresh={reloadData}
              />
            )}

            {workerTab === 'saved' && (
              <SavedJobs
                jobs={jobs}
                savedJobIds={savedJobIds}
                appliedJobIds={appliedJobIds}
                onSelectJob={(job) => setSelectedJobForDetails(job)}
                onSaveToggle={handleSaveToggle}
              />
            )}

            {workerTab === 'profile' && workerProfile && (
              <WorkerProfileView
                worker={workerProfile}
                onUpdate={(updated) => setWorkerProfile(updated)}
                onSwitchRole={() => setIsRoleSwitcherOpen(true)}
              />
            )}
          </>
        ) : (
          /* BUSINESS OWNER ROLE VIEWS */
          <>
            {businessTab === 'dashboard' && businessProfile && (
              <BusinessDashboard
                business={businessProfile}
                jobs={jobs}
                applications={applications}
                onOpenPostJob={() => setIsPostJobOpen(true)}
                onNavigateToJobs={() => setBusinessTab('jobs')}
                onNavigateToApplicants={() => setBusinessTab('applicants')}
                onViewApplicantDetails={() => setBusinessTab('applicants')}
                onVerificationToggle={handleToggleVerification}
              />
            )}

            {businessTab === 'jobs' && businessProfile && (
              <BusinessJobs
                business={businessProfile}
                jobs={jobs}
                applications={applications}
                onOpenPostJob={() => setIsPostJobOpen(true)}
                onViewJobApplicants={(jobId) => {
                  setSelectedJobIdForApplicantFilter(jobId);
                  setBusinessTab('applicants');
                }}
                onRefresh={reloadData}
              />
            )}

            {businessTab === 'post' && businessProfile && (
              <div className="max-w-2xl mx-auto py-4">
                <PostJobModal
                  isOpen={true}
                  onClose={() => setBusinessTab('dashboard')}
                  business={businessProfile}
                  onJobCreated={() => {
                    reloadData();
                    setBusinessTab('jobs');
                  }}
                />
              </div>
            )}

            {businessTab === 'applicants' && businessProfile && (
              <ApplicantManager
                business={businessProfile}
                jobs={jobs}
                applications={applications}
                selectedJobId={selectedJobIdForApplicantFilter}
                onRefresh={reloadData}
              />
            )}

            {businessTab === 'profile' && businessProfile && (
              <BusinessProfileView
                business={businessProfile}
                onUpdate={(updated) => setBusinessProfile(updated)}
                onSwitchRole={() => setIsRoleSwitcherOpen(true)}
                onVerificationToggle={handleToggleVerification}
              />
            )}
          </>
        )}
      </main>

      {/* Fixed Bottom Ergonomic Touch Navigation Bar */}
      <BottomNav
        currentRole={currentRole}
        activeTab={currentRole === 'worker' ? workerTab : businessTab}
        onSelectTab={(tab) => {
          if (currentRole === 'worker') {
            setWorkerTab(tab as WorkerTab);
          } else {
            if (tab === 'post') {
              setIsPostJobOpen(true);
            } else {
              setBusinessTab(tab as BusinessTab);
            }
          }
        }}
        applicationsCount={myWorkerApplications.length}
        newApplicantsCount={newBusinessApplicantsCount}
      />

      {/* Modals */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentRole={currentRole}
        currentUserId={currentUserId}
        onSelectRole={handleSelectRole}
        onAccountSwitched={reloadData}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        currentRole={currentRole}
        currentUserId={currentUserId}
        onNavigateToJob={(jobId) => {
          const j = appStorage.getJobById(jobId);
          if (j) setSelectedJobForDetails(j);
        }}
        onNavigateToApplications={() => {
          if (currentRole === 'worker') setWorkerTab('applications');
          else setBusinessTab('applicants');
        }}
      />

      <JobDetailsModal
        job={selectedJobForDetails}
        isOpen={!!selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        workerProfile={workerProfile}
        isSaved={selectedJobForDetails ? savedJobIds.includes(selectedJobForDetails.id) : false}
        onSaveToggle={handleSaveToggle}
        onOpenReport={(job) => {
          setJobToReport(job);
        }}
        onApplicationSubmitted={reloadData}
      />

      {isPostJobOpen && businessProfile && (
        <PostJobModal
          isOpen={isPostJobOpen}
          onClose={() => setIsPostJobOpen(false)}
          business={businessProfile}
          onJobCreated={() => {
            reloadData();
          }}
        />
      )}

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onUpdateFilters={setFilters}
        onReset={() =>
          setFilters({
            searchQuery: '',
            category: 'all',
            locality: 'All Nagpur',
            workType: 'all',
            minSalary: 0,
            maxExperience: -1,
            sortBy: 'relevance',
          })
        }
      />

      <ReportModal
        job={jobToReport}
        isOpen={!!jobToReport}
        onClose={() => setJobToReport(null)}
        currentUserId={currentUserId}
        currentRole={currentRole}
      />
    </div>
  );
}
