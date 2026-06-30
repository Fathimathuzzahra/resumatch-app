import React, { useState, useEffect } from 'react';
import PostJob from './PostJob';
import ManageJobs from './ManageJobs';
import JobApplications from './JobApplications';
import RecruiterProfileDashboard from './RecruiterProfileDashboard';

// 👈 Is base URL ko component function ke upar paste kariye
const API_BASE_URL = "http://127.0.0.1:5000/api";
function RecruiterDashboard({jobs,setJobs,setCurrentPage,userProfile,setUserProfile}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // 👈 Yeh block data fetch karega backend se
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/jobs`);
        const data = await response.json();
        if (setJobs) {
          setJobs(data); // Jo data backend se milega wo state me save ho jayega
        }
      } catch (error) {
        console.error("Backend se data lane me dikkat aayi:", error);
      }
    };

    fetchJobs();
  }, [setJobs]);

  // ========================================================
  // 🆕 DASHBOARD SUB-PAGES STATE
  // ========================================================
  const [dashboardSubView, setDashboardSubView] = useState('main'); // 'main' | 'new-apps' | 'shortlisted' | 'under-review'

  // --- Analytics Logic ---
  const totalJobPosts = jobs ? jobs.length : 0;
  
  const activeJobsCount = jobs ? jobs.filter(j => j.status === 'Active' || j.status === 'Open').length : 0;

  const allApplicants = jobs ? jobs.flatMap(job => 
    (job.applicants || []).map(app => ({ ...app, jobId: job.id, jobTitle: job.title }))
  ) : [];

  const totalApplicationsCount = allApplicants.length;

  const newApplicantsList = allApplicants.filter(app => app.isNew || app.status === 'New');
  const totalNewAppsCount = newApplicantsList.length;

  const shortlistedList = allApplicants.filter(app => app.status === 'Shortlisted');
  const underReviewList = allApplicants.filter(app => app.status === 'Under Review');

  const handleViewJobApplicationsRoute = (jobId) => {
    if (setJobs && jobs) {
      const updatedJobs = jobs.map(job => {
        if (job.id === jobId) {
          const updatedApplicants = (job.applicants || []).map(app => ({
            ...app,
            isNew: false,
            status: app.status === 'New' ? 'Reviewed' : app.status
          }));
          return { ...job, applicants: updatedApplicants };
        }
        return job;
      });
      setJobs(updatedJobs);
    }
    
    setDashboardSubView('main');
    setActiveTab('job-applications');
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'sans-serif', minHeight: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* ======================================================== */}
      {/* 1. LEFT SIDEBAR                                         */}
      {/* ======================================================== */}
      <div style={{ 
        width: '260px', 
        backgroundColor: '#0f2c59', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        flexShrink: 0
      }}>
        {/* LOGO SECTION */}
        <div style={{ 
          backgroundColor: '#e2f5f7', 
          width: '230px', 
          height: '65px', 
          borderRadius: '15px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '15px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
          margin: '15px auto 10px auto' 
        }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            backgroundColor: '#0f2c59', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontWeight: 'bold', 
            fontSize: '16px' 
          }}>RM</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', color: '#0f2c59', fontSize: '20px', lineHeight: '1.1' }}>ResuMatch</span>
            <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', fontWeight: '500' }}>AI Driven Applicant Tracking</span>
          </div>
        </div>

        {/* DESIGNATION */}
        <div style={{ 
          padding: '5px 25px 20px 25px', 
          fontSize: '12px', 
          color: '#93c5fd', 
          fontWeight: 'bold', 
          letterSpacing: '0.05em' 
        }}>JOB RECRUITER</div> 

        {/* CLICKABLE NAVIGATION */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1, padding: '0 10px' }}>
          <button 
            onClick={() => { setActiveTab('dashboard'); setDashboardSubView('main'); }} 
            style={{ 
              textAlign: 'left', 
              padding: '12px 15px', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: activeTab === 'dashboard' ? '#1e3a8a' : 'transparent', 
              color: 'white', 
              fontWeight: '600', 
              cursor: 'pointer', 
              fontSize: '15px',
              width: '100%'
            }}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('post-job')} 
            style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'post-job' ? '#1e3a8a' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px', width: '100%' }}
          >
            💼 Post Job
          </button>
          <button 
            onClick={() => setActiveTab('manage-jobs')} 
            style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'manage-jobs' ? '#1e3a8a' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px', width: '100%' }}
          >
            ⚙️ Manage Jobs
          </button>
          <button 
            onClick={() => setActiveTab('job-applications')} 
            style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px', width: '100%' }}
          >
            📄 Job Applicants
          </button>
          <button 
            onClick={() => setActiveTab('recruiter-profile')} 
            style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'recruiter-profile' ? '#1e3a8a' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px', width: '100%' }}
          >
            👤 Profile
          </button>
          <button 
            onClick={() => setShowLogoutModal(true)} 
            style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#f87171', fontWeight: '600', cursor: 'pointer', fontSize: '15px', width: '100%', marginTop: 'auto' }}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* ======================================================== */}
      {/* 2. RIGHT MAIN CONTENT AREA                               */}
      {/* ======================================================== */}
      <div style={{ 
        flexGrow: 1, 
        padding: '25px 40px', 
        boxSizing: 'border-box', 
        backgroundColor: '#f4f6f9', 
        height: '100vh', 
        overflowY: 'auto' 
      }}>
        
        {activeTab === 'dashboard' && (
          <div>
            
            {/* SUB VIEW 1: MAIN METRICS & CARDS OVERVIEW */}
            {dashboardSubView === 'main' && (
              <div>
                <h2 style={{ color: '#0f2c59', margin: '0 0 5px 0', fontSize: '28px', fontWeight: '800' }}>Welcome to ResuMatch</h2>
                <p style={{ color: '#64748b', margin: '0 0 25px 0', fontWeight: '500' }}>Here's your Hiring overview today</p>
                
                {/* Top Metrics Rows */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '6px solid #2563eb' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb', marginBottom: '8px', letterSpacing: '0.05em' }}>TOTAL JOB POSTS</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f2c59' }}>{totalJobPosts}</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '6px solid #0d9488' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0d9488', marginBottom: '8px', letterSpacing: '0.05em' }}>👥 TOTAL APPLICATIONS</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f2c59' }}>{totalApplicationsCount}</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', borderLeft: '6px solid #ea580c' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#ea580c', marginBottom: '8px', letterSpacing: '0.05em' }}>📌 ACTIVE JOBS</div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#0f2c59' }}>{activeJobsCount}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f2c59', margin: '30px 0 15px 0' }}>
                  Check job Applications Overview here
                </h3>

                {/* Grid Container split for Panels */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '25px', alignItems: 'start' }}>
                  
                  {/* 1) FIXED: LEFT PANEL (New Applications) Length/Width Reduced significantly according to Drawing */}
                  <div style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #cbd5e1', 
                    borderTop: '5px solid #0f2c59', 
                    borderRadius: '14px', 
                    padding: '22px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height:'100%',
                    boxSizing:'border-box', 
                    justifyContent: 'space-between', 
                    boxShadow: '0 4px 12px rgba(15, 44, 89, 0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '19px', fontWeight: '800', color: '#0f2c59' }}>New Applications</h4>
                        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: '500', lineHeight: '1.4' }}>
                          {totalNewAppsCount} new candidates applied
                        </p>
                      </div>
                      
                      {totalNewAppsCount > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#ef4444', color: 'white', padding: '4px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', gap: '3px', flexShrink: 0 }}>
                          <span>🔥</span>
                          <span>{totalNewAppsCount}</span>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => setDashboardSubView('new-apps')}
                      style={{ marginTop: '15px', padding: '10px 28px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', width: 'fit-content' }}
                    >
                      View List
                    </button>
                  </div>

                  {/* RIGHT PANEL: Shortlisted & Under Review rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* 2) FIXED: Darker Colored Button Indicator & Perfect Centering for Shortlisted */}
                    <div 
                      onClick={() => setDashboardSubView('shortlisted')}
                      style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '6px solid #0d9488', borderRadius: '12px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '0 3px 6px rgba(0,0,0,0.02)' }}
                    >
                      <div>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#0d9488', display: 'block', marginBottom: '2px' }}>Shortlisted Status</span>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Candidates: <strong>{shortlistedList.length}</strong></span>
                      </div>
                      {/* Dark Teal Circular Arrow Button with precise alignment */}
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: '#0d9488', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        lineHeight: '1',
                        paddingBottom: '3px',
                        boxSizing: 'border-box'
                      }}>
                        &rarr;
                      </div>
                    </div>

                    {/* 2) FIXED: Darker Colored Button Indicator & Perfect Centering for Under Review */}
                    <div 
                      onClick={() => setDashboardSubView('under-review')}
                      style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderLeft: '6px solid #ea580c', borderRadius: '12px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '0 3px 6px rgba(0,0,0,0.02)' }}
                    >
                      <div>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#ea580c', display: 'block', marginBottom: '2px' }}>Under Review Status</span>
                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total Candidates: <strong>{underReviewList.length}</strong></span>
                      </div>
                      {/* Dark Orange Circular Arrow Button with precise alignment */}
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: '#ea580c', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        lineHeight: '1',
                        paddingBottom: '3px',
                        boxSizing: 'border-box'
                      }}>
                        &rarr;
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* SUB VIEW 2: NEW APPLICATIONS INNER VIEW */}
            {dashboardSubView === 'new-apps' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  {/* 3) FIXED: Colorful Left Back Arrow Button (Navy Theme) */}
                  <button 
                    type="button"
                    onClick={() => setDashboardSubView('main')}
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      border: 'none', 
                      backgroundColor: '#0f2c59', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '16px', 
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(15,44,89,0.2)',
                      paddingRight: '2px'
                    }}
                  >
                    &larr;
                  </button>
                  <h3 style={{ margin: 0, color: '#0f2c59', fontSize: '22px', fontWeight: '800' }}>New Dynamic Applications</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {jobs && jobs.map(job => {
                    const jobNewCount = (job.applicants || []).filter(a => a.isNew || a.status === 'New').length;
                    if (jobNewCount === 0) return null;

                    return (
                      <div key={job.id} style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '5px solid #ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                        <div>
                          <h4 style={{ margin: '0 0 6px 0', color: '#0f2c59', fontSize: '17px', fontWeight: '700' }}>{job.title}</h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
                            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>Status Badge: {jobNewCount} New Entries Found</span>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleViewJobApplicationsRoute(job.id)}
                          style={{ padding: '10px 22px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}
                        >
                          View Applications
                        </button>
                      </div>
                    );
                  })}
                  {totalNewAppsCount === 0 && (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>No new entries found at this moment.</div>
                  )}
                </div>
              </div>
            )}

            {/* SUB VIEW 3: SHORTLISTED INNER VIEW */}
            {dashboardSubView === 'shortlisted' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  {/* 3) FIXED: Colorful Left Back Arrow Button (Teal Theme) */}
                  <button 
                    type="button"
                    onClick={() => setDashboardSubView('main')}
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      border: 'none', 
                      backgroundColor: '#0d9488', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '16px', 
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(13,148,136,0.2)',
                      paddingRight: '2px'
                    }}
                  >
                    &larr;
                  </button>
                  <h3 style={{ margin: 0, color: '#0f2c59', fontSize: '22px', fontWeight: '800' }}>Shortlisted Candidates Panel</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {shortlistedList.map((candidate, idx) => (
                    <div key={idx} style={{ backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeft: '4px solid #0d9488', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>{candidate.name}</h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Target Profile: <strong style={{ color: '#0f2c59' }}>{candidate.jobTitle}</strong></p>
                      </div>
                      <span style={{ padding: '6px 14px', backgroundColor: '#e6f4ea', color: '#137333', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Shortlisted</span>
                    </div>
                  ))}
                  {shortlistedList.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No candidates listed under shortlist.</div>
                  )}
                </div>
              </div>
            )}

            {/* SUB VIEW 4: UNDER REVIEW INNER VIEW */}
            {dashboardSubView === 'under-review' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  {/* 3) FIXED: Colorful Left Back Arrow Button (Orange Theme) */}
                  <button 
                    type="button"
                    onClick={() => setDashboardSubView('main')}
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      border: 'none', 
                      backgroundColor: '#ea580c', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '16px', 
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(234,88,12,0.2)',
                      paddingRight: '2px'
                    }}
                  >
                    &larr;
                  </button>
                  <h3 style={{ margin: 0, color: '#0f2c59', fontSize: '22px', fontWeight: '800' }}>Under Review Profiles</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {underReviewList.map((candidate, idx) => (
                    <div key={idx} style={{ backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeft: '4px solid #ea580c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>{candidate.name}</h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Target Profile: <strong style={{ color: '#0f2c59' }}>{candidate.jobTitle}</strong></p>
                      </div>
                      <span style={{ padding: '6px 14px', backgroundColor: '#fff7ed', color: '#c2410c', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Under Review</span>
                    </div>
                  ))}
                  {underReviewList.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No entries found under evaluation.</div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* --- OTHER VIEWS (REMAINS UNTOUCHED) --- */}
        {activeTab === 'post-job' && <PostJob setActiveTab={setActiveTab} />}
        {activeTab === 'manage-jobs' && <ManageJobs jobs={jobs} setJobs={setJobs} />}
        {activeTab === 'job-applications' && <JobApplications jobs={jobs} setJobs={setJobs} />}
        {activeTab === 'recruiter-profile' && <RecruiterProfileDashboard userProfile={userProfile} setUserProfile={setUserProfile} />}
      </div>

      {/* CUSTOM LOGOUT MODAL */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px 30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', textAlign: 'center', width: '350px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f2c59', fontSize: '20px' }}>Logout</h3>
            <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '15px' }}>Do you want to logout?</p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                type="button"
                onClick={() => setShowLogoutModal(false)}
                style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', minWidth: '80px' }}
              >
                No
              </button>
              <button 
                type="button"
                onClick={() => setCurrentPage('landing')} 
                style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', minWidth: '80px' }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default RecruiterDashboard;