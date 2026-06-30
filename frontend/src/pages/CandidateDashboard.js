import React, { useState, useEffect } from 'react';

function CandidateDashboard({ setCurrentPage, userProfile, setUserProfile }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: userProfile?.fullName || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
    professionalHeadline: userProfile?.headline || userProfile?.professionalHeadline || '',
    experienceStatus: userProfile?.experienceStatus || 'Fresher',
    experienceYears: userProfile?.experienceYears || '1',
    aboutMe: userProfile?.aboutMe || '',
    profilePic: userProfile?.profilePic || ''
  });
  
  const [tempProfile, setTempProfile] = useState({ ...profileData });

  // 1. Jobs Openings ke liye dynamic state aur backend fetch
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/jobs')
      .then(response => response.json())
      .then(data => {
        if (data) {
          setJobs(data);
        }
      })
      .catch(err => console.error("Jobs fetch karne me error:", err));
  }, []);

  // 2. User Profile sync karne ke liye useEffect
  useEffect(() => {
    if (userProfile) {
      const updatedData = {
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        professionalHeadline: userProfile.headline || userProfile.professionalHeadline || '',
        experienceStatus: userProfile.experienceStatus || 'Fresher',
        experienceYears: userProfile.experienceYears || '1',
        aboutMe: userProfile.aboutMe || '',
        profilePic: userProfile.profilePic || ''
      };
      setProfileData(updatedData);
      setTempProfile(updatedData);
    }
  }, [userProfile]);

  const handleEditClick = () => {
    setTempProfile({ ...profileData });
    setIsEditMode(true);
  };

  // 3. Backend connect karne wala save changes function (Clean & Fixed Structure)
  const handleSaveChanges = async () => {
    const dataToSend = {
      fullName: tempProfile.fullName,
      email: tempProfile.email,
      phone: tempProfile.phone,
      professionalHeadline: tempProfile.professionalHeadline,
      experienceStatus: tempProfile.experienceStatus,
      experienceYears: tempProfile.experienceYears,
      aboutMe: tempProfile.aboutMe,
      profilePic: tempProfile.profilePic
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/candidate/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setProfileData({ ...tempProfile });
        if (setUserProfile) {
          setUserProfile({
            ...userProfile,
            fullName: tempProfile.fullName,
            email: tempProfile.email,
            phone: tempProfile.phone,
            headline: tempProfile.professionalHeadline,
            experienceStatus: tempProfile.experienceStatus,
            experienceYears: tempProfile.experienceYears,
            aboutMe: tempProfile.aboutMe,
            profilePic: tempProfile.profilePic
          });
        }
        setIsEditMode(false);
        setShowSaveSuccessModal(true);
      } else {
        console.error("Server responded with an error.");
      }
    } catch (error) {
      console.error("Backend connection failed!", error);
    }
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Image = uploadEvent.target.result;
        setTempProfile(prev => ({ ...prev, profilePic: base64Image }));
        if (!isEditMode) {
          setProfileData(prev => ({ ...prev, profilePic: base64Image }));
          if (setUserProfile) {
            setUserProfile(prev => ({ ...prev, profilePic: base64Image }));
          }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // 🌐 Dynamic Resume Upload Handler
  const handleResumeUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (uploadEvent) => {
        const base64Resume = uploadEvent.target.result;
        try {
          const response = await fetch('http://127.0.0.1:5000/api/candidate/upload-resume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resume: base64Resume }),
          });

          if (response.ok) {
            alert("🎉 Resume uploaded successfully to backend!");
          } else {
            console.error("Resume upload failed on server.");
          }
        } catch (error) {
          console.error("Backend connection failed for resume:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 🟢 FIXED HANDLER FOR BACKEND JOB APPLICATION CONNECTIVITY
  const handleJobApplySubmit = async (job) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/candidate/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: job.company, title: job.title }),
      });

      if (response.ok) {
        setAppliedTarget({ company: job.company, title: job.title });
        setShowApplySuccessModal(true);
        
        // Dynamic list me naya entry add karna
        const newApp = {
          id: applications.length + 1,
          company: job.company,
          role: job.title,
          date: new Date().toLocaleDateString(),
          status: 'Under Review'
        };
        setApplications([newApp, ...applications]);
      } else {
        console.error("Job Application submission failed on server.");
      }
    } catch (error) {
      console.error("Backend connection failed for applying job:", error);
    }
  };

  // Navigation States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAnalysisPage, setShowAnalysisPage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Shared AI Standards Score
  const [resumeStandardsScore, setResumeStandardsScore] = useState(85);

  // Resume Upload State
  const [resume, setResume] = useState({
    fileName: '',
    uploadDate: '',
    isUploaded: false
  });

  // ================= NEW STATUS MODAL STATES =================
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showApplySuccessModal, setShowApplySuccessModal] = useState(false);
  const [appliedTarget, setAppliedTarget] = useState({ company: '', title: '' });
  const [showNotification, setShowNotification] = useState(false);
  const [searchSkill, setSearchSkill] = useState('');

  // ================= JOB OPENINGS STATES & DATA =================
  const [selectedJob, setSelectedJob] = useState(null); 
  const [isPrioritized, setIsPrioritized] = useState(false); 

  // Backend load fallback ke liye initial array list
  const initialJobs = jobs.length > 0 ? jobs : [
    {
      id: 1,
      company: 'TechInnovate Solutions',
      title: 'MERN Stack Developer',
      department: 'Engineering',
      type: 'Full-time',
      mode: 'Hybrid',
      location: 'Bangalore, India',
      description: 'We are looking for a robust MERN Stack Developer to join our core architecture group to manage heavy request streaming dashboards and state modules.',
      skills: 'React, Node.js, Express.js, MongoDB, JavaScript, Redux Toolkit',
      experience: '1 - 3 Years',
      education: 'B.Tech / B.E in Computer Science or related fields',
      matchScore: 95
    },
    {
      id: 2,
      company: 'CloudScale Global',
      title: 'Frontend Developer',
      department: 'Product UI',
      type: 'Full-time',
      mode: 'Remote',
      location: 'Hyderabad, India',
      description: 'Join our design system group to manage micro-frontends and beautiful components using reactive design layouts.',
      skills: 'React, JavaScript, HTML5, CSS3, REST APIs',
      experience: '0 - 2 Years',
      education: 'B.C.A / M.C.A / B.Tech',
      matchScore: 88
    },
    {
      id: 3,
      company: 'DataPrism Analytics',
      title: 'Python Developer',
      department: 'Data & Analytics',
      type: 'Full-time',
      mode: 'On-site',
      location: 'Mumbai, India',
      description: 'Build robust streaming pipelines and machine learning API ingestion servers using Flask and FastAPIs.',
      skills: 'Python, Django, Flask, PostgreSQL, Docker',
      experience: '2+ Years',
      education: 'Bachelor’s degree in technical line',
      matchScore: 40
    },
    {
      id: 4,
      company: 'NextGen Systems',
      title: 'React Native Developer',
      department: 'Mobile Apps',
      type: 'Internship',
      mode: 'Hybrid',
      location: 'Pune, India',
      description: 'Develop high-performance cross-platform Android and iOS applications leveraging structural components and native hooks.',
      skills: 'React Native, React, JavaScript, Redux, REST APIs',
      experience: 'Fresher / Internship',
      education: 'Pursuing Technical Degree',
      matchScore: 80
    }
  ];

  const filteredJobs = initialJobs.filter(job => 
    job.title.toLowerCase().includes(searchSkill.toLowerCase()) ||
    job.company.toLowerCase().includes(searchSkill.toLowerCase()) ||
    job.skills.toLowerCase().includes(searchSkill.toLowerCase())
  );

  const displayJobs = isPrioritized 
    ? [...filteredJobs].sort((a, b) => b.matchScore - a.matchScore)
    : filteredJobs;

  // ================= MY APPLICATIONS DATA =================
  const [applications, setApplications] = useState([
    { id: 1, company: 'TechInnovate Solutions', role: 'MERN Stack Developer', date: '28-06-2026', status: 'Under Review' },
    { id: 2, company: 'CloudScale Global', role: 'Frontend Developer', date: '25-06-2026', status: 'Shortlisted' },
    { id: 3, company: 'Global Tech Corp', role: 'React Developer', date: '20-06-2026', status: 'Under Review' }
  ]);

  return (
    <div style={{ display: 'flex', fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#0f2c59', color: 'white', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ backgroundColor: '#e2f5f7', width: '230px', height: '65px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', margin: '20px auto 10px auto' }}>
          <div style={{ width: '42px', height: '42px', backgroundColor: '#0f2c59', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
            RM
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', color: '#0f2c59', fontSize: '20px', lineHeight: '1.1' }}>ResuMatch</span>
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>AI-Driven Applicant Tracking</span>
          </div>
        </div>

        <div style={{ padding: '5px 25px 20px 25px', fontSize: '12px', color: '#93c5fd', fontWeight: 'bold', letterSpacing: '0.05em' }}>
          JOB APPLICANT
        </div> 

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexGrow: 1, padding: '0 10px' }}>
          <button onClick={() => { setActiveTab('dashboard'); setShowAnalysisPage(false); setSelectedJob(null); }} style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'dashboard' ? '#1e3a8a' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>📊 Dashboard</button>
          <button onClick={() => { setActiveTab('upload'); setSelectedJob(null); }} style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'upload' ? '#1e3a8a' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>📄 Upload Resume</button>
          <button onClick={() => { setActiveTab('jobs'); setShowAnalysisPage(false); setSelectedJob(null); }} style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'jobs' ? '#1e3a8a' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>💼 Job Openings</button>
          <button onClick={() => { setActiveTab('applications'); setShowAnalysisPage(false); setSelectedJob(null); }} style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'applications' ? '#1e3a8a' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>📋 My Applications</button>
          <button onClick={() => { setActiveTab('profile'); setShowAnalysisPage(false); setSelectedJob(null); setIsEditMode(false); }} style={{ textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'profile' ? '#1e3a8a' : 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>👤 My Profile</button>
        </nav>

        <div style={{ padding: '0 10px' }}>
          <button onClick={() => setShowLogoutModal(true)} style={{ width: '100%', textAlign: 'left', padding: '12px 15px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#fca5a5', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>🚪 Logout</button>
        </div>
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 40px', boxSizing: 'border-box', overflowY: 'auto', height: '100vh' }}>
          
          {/* ================= 1) TAB: DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ color: '#0f2c59', margin: '0 0 2px 0', fontSize: '28px', fontWeight: '800' }}>Welcome to ResuMatch</h2>
              <p style={{ color: '#000000', margin: '0 0 15px 0', fontWeight: '500' }}>Here's your job search overview today.</p>
              
              <div style={{ display: 'flex', gap: '25px', marginBottom: '25px', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: '25px 40px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', borderTop: '4px solid #10b981', minWidth: '240px' }}>
                  <div style={{ fontSize: '16px', color: '#10b981', fontWeight: 'bold', marginBottom: '4px', textAlign: 'center' }}>Resume Standards</div>
                  <div style={{ fontSize: '13px', color: '#000000', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>AI Match Rating</div>
                  
                  <div style={{ 
                    width: '110px', height: '110px', borderRadius: '50%', 
                    background: resume.isUploaded ? `conic-gradient(#10b981 0% 85%, #e2e8f0 85% 100%)` : '#e2e8f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '20px', color: '#0f2c59' }}>
                      {resume.isUploaded ? '85%' : '0%'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1, maxWidth: '400px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', borderTop: '4px solid #3b82f6', justifyContent: 'center' }}>
                    <div style={{ fontSize: '15px', color: '#3b82f6', fontWeight: 'bold' }}>Resume Status</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '6px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🟢</span>
                      <span>Uploaded</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#000000', marginTop: '4px', fontWeight: '600' }}>Date: {resume.uploadDate}</div>
                  </div>

                  <div 
                    onClick={() => setActiveTab('jobs')}
                    style={{ 
                      display: 'flex', flexDirection: 'column', backgroundColor: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', borderTop: '4px solid #e11d48', cursor: 'pointer', transition: 'transform 0.2s', justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ fontSize: '15px', color: '#e11d48', fontWeight: 'bold' }}>Latest Job Post</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '6px', color: '#0f2c59' }}>
                      🆕 View New Post
                    </div>
                    <div style={{ fontSize: '13px', color: '#000000', marginTop: '4px', fontWeight: '600' }}>
                      Updated: {resume.uploadDate}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', maxWidth: '850px' }}>
                <div style={{ flex: 1, backgroundColor: 'white', padding: '18px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', borderLeft: '5px solid #8b5cf6' }}>
                  <div style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '700' }}>Total Applications</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '5px', color: '#000000' }}>3</div>
                </div>
                <div style={{ flex: 1, backgroundColor: 'white', padding: '18px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', borderLeft: '5px solid #10b981' }}>
                  <div style={{ fontSize: '14px', color: '#10b981', fontWeight: '700' }}>Shortlisted</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '5px', color: '#000000' }}>1</div>
                </div>
                <div style={{ flex: 1, backgroundColor: 'white', padding: '18px 20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', borderLeft: '5px solid #f59e0b' }}>
                  <div style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '700' }}>Under Review</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '5px', color: '#000000' }}>2</div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2) TAB: UPLOAD RESUME ================= */}
          {activeTab === 'upload' && (
            <div>
              {!showAnalysisPage ? (
                <div style={{ maxWidth: '750px', backgroundColor: 'white', padding: '35px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', color: '#0f2c59' }}>📄 Upload Your Resume</h3>
                  <p style={{ color: '#000000', fontSize: '14px', margin: '0 0 25px 0', fontWeight: '500' }}>One-time resume upload used for future applications.</p>

                  <div style={{ border: '2px dashed #cbd5e1', padding: '25px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f8fafc', marginBottom: '35px' }}>
                    {resume.isUploaded ? (
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#0f2c59', margin: '0 0 5px 0' }}>📄 File: {resume.fileName}</p>
                        <p style={{ fontSize: '13px', color: '#000000', margin: '0 0 15px 0', fontWeight: '600' }}>Uploaded: {resume.uploadDate}</p>
                        <label>
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setResume({
                                  fileName: e.target.files[0].name,
                                  uploadDate: new Date().toLocaleDateString(),
                                  isUploaded: true
                                });
                                handleResumeUpload(e);
                              }
                            }} 
                          />
                          Replace Resume
                        </label>
                      </div>
                    ) : (
                      <div>
                        <label style={{ padding: '10px 20px', backgroundColor: '#0f2c59', color: 'white', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                          Choose File
                          <input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setResume({
                                  fileName: e.target.files[0].name,
                                  uploadDate: new Date().toLocaleDateString(),
                                  isUploaded: true
                                });
                                handleResumeUpload(e);
                              }
                            }} 
                          />
                        </label>
                      </div>
                    )}
                  </div>{resume.isUploaded && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f0fdf4', padding: '15px 25px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                      <span style={{ color: '#166534', fontWeight: '700', fontSize: '15px' }}>Analyze your resume standards with ResuMatch AI</span>
                      <button onClick={() => { setShowAnalysisPage(true); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 1200); }} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flexShrink: 0 }}>
                        ➔
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ backgroundColor: 'white', padding: '25px 35px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                    <button onClick={() => setShowAnalysisPage(false)} style={{ border: 'none', backgroundColor: '#0f2c59', color: 'white', width: '42px', height: '42px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', flexShrink: 0 }}>
                      ⬅
                    </button>
                    <h2 style={{ margin: '0', color: '#0f2c59', fontSize: '24px', fontWeight: '800' }}>Resume Standards Analysis</h2>
                  </div>

                  {isAnalyzing ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '5px solid #e2e8f0', borderTop: '5px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      <h3 style={{ color: '#0f2c59', marginTop: '15px' }}>✨ AI is processing parameters...</h3>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '25px', backgroundColor: '#f8fafc', padding: '20px 25px', borderRadius: '15px' }}>
                        <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: `conic-gradient(#10b981 0% 88%, #e2e8f0 88% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontWeight: '900', fontSize: '22px', color: '#0f2c59' }}>88%</span>
                          </div>
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 6px 0', color: '#0f2c59', fontSize: '20px', fontWeight: '700' }}>{resume.fileName}</h3>
                          <p style={{ margin: '0', color: '#000000', fontSize: '14px', fontWeight: '600' }}>Score evaluation calculated based on content matrix depth listed below.</p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#000000', fontWeight: '600' }}>
                          <strong>Structure Analysis:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>Professional</span>
                        </div>
                        <div style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#000000', fontWeight: '600' }}>
                          <strong>ATS Readability Score:</strong> <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>92/100</span>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                        <strong style={{ display: 'block', marginBottom: '10px', color: '#000000' }}>Session Integrity Check:</strong>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '14px', color: '#000000', fontWeight: '600' }}>
                          <span>📞 Contact Information ✅</span><span>📝 Summary ✅</span><span>🛠️ Skills ✅</span><span>💻 Projects ✅</span><span>💼 Experience ✅</span><span>🎓 Education ✅</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#000000', backgroundColor: '#ffffff', padding: '10px 5px' }}>
                        <div><strong>Formatting Issues:</strong> <span style={{ fontWeight: '500' }}>None detected. Line heights and standard structural fonts align perfectly.</span></div>
                        <div><strong>Resume Strengths:</strong> <span style={{ color: '#15803d', fontWeight: '500' }}>Strong descriptive framework with clear technical action markers.</span></div>
                        <div><strong>Areas for Improvement:</strong> <span style={{ color: '#b45309', fontWeight: '500' }}>Quantifiable impact points missing inside project performance lines.</span></div>
                        <div><strong>Missing Keywords:</strong> <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '3px 8px', borderRadius: '4px', marginLeft: '8px', fontWeight: 'bold', fontSize: '13px' }}>Redux Toolkit, REST APIs, Docker</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= 3) TAB: JOB OPENINGS ================= */}
          {activeTab === 'jobs' && (
            <div>
              {!selectedJob ? (
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', color: '#0f2c59' }}>💼 Job Openings Hub</h3>
                  <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', alignItems: 'center' }}>
                    <input type="text" placeholder="Search jobs by skills, designation or company..." value={searchSkill} onChange={(e) => setSearchSkill(e.target.value)} style={{ flexGrow: 1, padding: '14px 20px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none' }} />
                    <button onClick={() => setIsPrioritized(true)} style={{ padding: '14px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>✨ Find Best Fit Jobs</button>
                  </div>

                  {isPrioritized && (
                    <div style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '10px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Jobs Prioritized based on your Uploaded Resume: <strong>{resume.fileName}</strong></span>
                      <button onClick={() => setIsPrioritized(false)} style={{ background: 'none', border: 'none', color: '#1d4ed8', cursor: 'pointer', fontWeight: 'bold' }}>Clear Priority</button>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {displayJobs.map((job) => (
                      <div key={job.id} style={{ backgroundColor: 'white', padding: '20px 25px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f2c59', marginBottom: '4px' }}>{job.title}</div>
                          <div style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>🏢 {job.company}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          {isPrioritized && <span style={{ fontSize: '12px', backgroundColor: job.matchScore > 80 ? '#dcfce7' : '#f1f5f9', color: job.matchScore > 80 ? '#15803d' : '#475569', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>Match: {job.matchScore}%</span>}
                          <span onClick={() => setSelectedJob(job)} style={{ color: '#3b82f6', fontWeight: '700', fontSize: '15px', cursor: 'pointer', textDecoration: 'underline' }}>View Details</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                    <button onClick={() => setSelectedJob(null)} style={{ border: 'none', backgroundColor: '#0f2c59', color: 'white', width: '42px', height: '42px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyY: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⬅</button>
                    {/* 🟢 CONNECTED TO BACKEND SUBMIT PROCESS */}
                    <button onClick={() => handleJobApplySubmit(selectedJob)} style={{ padding: '12px 28px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>Apply Now</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h2 style={{ margin: '0 0 5px 0', color: '#0f2c59', fontSize: '26px', fontWeight: '800' }}>{selectedJob.title}</h2>
                      <h4 style={{ margin: '0', color: '#475569', fontSize: '18px', fontWeight: '700' }}>🏢 {selectedJob.company}</h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                      <div style={{ color: '#000000', fontSize: '15px' }}><strong>Department:</strong> <span style={{ fontWeight: '500' }}>{selectedJob.department}</span></div>
                      <div style={{ color: '#000000', fontSize: '15px' }}><strong>Job Type:</strong> <span style={{ fontWeight: '500' }}>{selectedJob.type}</span></div>
                      <div style={{ color: '#000000', fontSize: '15px' }}><strong>Work Mode:</strong> <span style={{ fontWeight: '500' }}>{selectedJob.mode}</span></div>
                      <div style={{ color: '#000000', fontSize: '15px' }}><strong>Location:</strong> <span style={{ fontWeight: '500' }}>{selectedJob.location}</span></div>
                    </div>
                    <div style={{ color: '#000000' }}><h4 style={{ margin: '0 0 8px 0', color: '#0f2c59' }}>Job Description</h4><p style={{ margin: '0', lineHeight: '1.6', fontWeight: '500' }}>{selectedJob.description}</p></div>
                    <div style={{ color: '#000000' }}><h4 style={{ margin: '0 0 8px 0', color: '#0f2c59' }}>Required Skills</h4><p style={{ margin: '0', color: '#1e3a8a', fontWeight: '500' }}>{selectedJob.skills}</p></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div><h4 style={{ margin: '0 0 6px 0', color: '#0f2c59' }}>Required Experience</h4><p style={{ margin: '0', fontWeight: '500' }}>{selectedJob.experience}</p></div>
                      <div><h4 style={{ margin: '0 0 6px 0', color: '#0f2c59' }}>Education Qualification</h4><p style={{ margin: '0', fontWeight: '500' }}>{selectedJob.education}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 4) TAB: MY APPLICATIONS ================= */}
          {activeTab === 'applications' && (
            <div>
              <h3 style={{ color: '#0f2c59', fontSize: '26px', fontWeight: '800', margin: '0 0 10px 0' }}>📋 My Applications</h3>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 20px 0', fontWeight: '500' }}>Track the operational workflow and status layers of submitted profiles.</p>
              
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.01)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '15px 20px', color: '#0f2c59', fontWeight: '700' }}>Company Name</th>
                      <th style={{ padding: '15px 20px', color: '#0f2c59', fontWeight: '700' }}>Job Title</th>
                      <th style={{ padding: '15px 20px', color: '#0f2c59', fontWeight: '700' }}>Applied Date</th>
                      <th style={{ padding: '15px 20px', color: '#0f2c59', fontWeight: '700' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '15px 20px', fontWeight: '700', color: '#334155' }}>{app.company}</td>
                        <td style={{ padding: '15px 20px', fontWeight: '600', color: '#475569' }}>{app.role}</td>
                        <td style={{ padding: '15px 20px', color: '#64748b', fontWeight: '500' }}>{app.date}</td>
                        <td style={{ padding: '15px 20px' }}>
                          <span style={{ 
                            padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700',
                            backgroundColor: app.status === 'Shortlisted' ? '#dcfce7' : '#fef3c7',
                            color: app.status === 'Shortlisted' ? '#15803d' : '#b45309'
                          }}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 5) TAB: MY PROFILE ================= */}
          {activeTab === 'profile' && (
            <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ color: '#0f2c59', fontSize: '24px', fontWeight: '800', margin: 0 }}>👤 My Profile Setup</h3>
                
                {isEditMode ? (
                  <button onClick={handleSaveChanges} style={{ padding: '10px 22px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                    Save Changes
                  </button>
                ) : (
                  <button onClick={handleEditClick} style={{ padding: '10px 22px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                    Edit Profile
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '50px', alignItems: 'flex-start' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                    {(isEditMode ? tempProfile.profilePic : profileData.profilePic) ? (
                      <img 
                        src={isEditMode ? tempProfile.profilePic : profileData.profilePic} 
                        alt="Profile Avatar" 
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0f2c59', padding: '3px', backgroundColor: 'white' }} 
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '3px solid #0f2c59', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                    )}
                    
                    <label style={{ position: 'absolute', bottom: '2px', right: '2px', width: '34px', height: '34px', backgroundColor: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', border: '2px solid white', transition: '0.2s' }}>
                      +
                      <input type="file" accept="image/*" onChange={handleProfilePicChange} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', fontWeight: '600' }}>(Optional Photo)</span>
                </div>

                <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Full Name</label>
                    <input type="text" disabled={!isEditMode} value={isEditMode ? tempProfile.fullName : profileData.fullName} onChange={(e) => setTempProfile({...tempProfile, fullName: e.target.value})} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditMode ? 'white' : '#f1f5f9', fontWeight: '600', color: '#0f2c59', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Email Address</label>
                    <input type="email" disabled={!isEditMode} value={isEditMode ? tempProfile.email : profileData.email} onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditMode ? 'white' : '#f1f5f9', fontWeight: '600', color: '#0f2c59', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Professional Headline</label>
                    <input type="text" disabled={!isEditMode} value={isEditMode ? tempProfile.professionalHeadline : profileData.professionalHeadline} onChange={(e) => setTempProfile({...tempProfile, professionalHeadline: e.target.value})} style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditMode ? 'white' : '#f1f5f9', fontWeight: '600', color: '#0f2c59', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Experience Status</label>
                      <select 
                        disabled={!isEditMode} 
                        value={isEditMode ? tempProfile.experienceStatus : profileData.experienceStatus} 
                        onChange={(e) => setTempProfile({...tempProfile, experienceStatus: e.target.value})} 
                        style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditMode ? 'white' : '#f1f5f9', fontWeight: '600', color: '#0f2c59', outline: 'none' }}
                      >
                        <option value="Fresher">Fresher</option>
                        <option value="Experienced">Experienced</option>
                      </select>
                    </div>

                    {((isEditMode ? tempProfile.experienceStatus : profileData.experienceStatus) === 'Experienced') && (
                      <div style={{ width: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>Years of Experience</label>
                        <select 
                          disabled={!isEditMode} 
                          value={isEditMode ? tempProfile.experienceYears : profileData.experienceYears} 
                          onChange={(e) => setTempProfile({...tempProfile, experienceYears: e.target.value})} 
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditMode ? 'white' : '#f1f5f9', fontWeight: '600', color: '#0f2c59', outline: 'none' }}
                        >
                          <option value="1">1 Year</option>
                          <option value="2">2 Years</option>
                          <option value="3">3 Years</option>
                          <option value="4">4 Years</option>
                          <option value="5+">5+ Years</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '700', color: '#475569' }}>About Me</label>
                    <textarea 
                      disabled={!isEditMode} 
                      rows="4" 
                      value={isEditMode ? tempProfile.aboutMe : profileData.aboutMe} 
                      onChange={(e) => setTempProfile({...tempProfile, aboutMe: e.target.value})} 
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditMode ? 'white' : '#f1f5f9', fontWeight: '600', color: '#0f2c59', outline: 'none', resize: 'vertical', fontFamily: 'sans-serif', boxSizing: 'border-box', lineHeight: '1.5' }} 
                    />
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ================= MIDDLE SCREEN BOX MODAL: CHANGES SAVED SUCCESSFULLY ================= */}
      {showSaveSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px 40px', borderRadius: '16px', maxWidth: '420px', width: '90%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '46px', marginBottom: '15px' }}>🎉</div>
            <h3 style={{ margin: '0 0 12px 0', color: '#0f2c59', fontSize: '20px', fontWeight: '800' }}>Changes Saved Successfully</h3>
            <p style={{ margin: '0 0 25px 0', color: '#475569', fontSize: '15px', fontWeight: '600', lineHeight: '1.4' }}>
              Your profile information has been securely updated inside the database.
            </p>
            <button 
              onClick={() => setShowSaveSuccessModal(false)} 
              style={{ padding: '11px 35px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', width: '100%', boxShadow: '0 4px 6px rgba(16,185,129,0.2)', transition: '0.2s' }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ================= MIDDLE SCREEN BOX MODAL: APPLY NOW JOB SUCCESS ================= */}
      {showApplySuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px 40px', borderRadius: '16px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '46px', marginBottom: '15px' }}>✅</div>
            <h3 style={{ margin: '0 0 12px 0', color: '#0f2c59', fontSize: '20px', fontWeight: '800' }}>Application Submitted</h3>
            <p style={{ margin: '0 0 20px 0', color: '#475569', fontSize: '15px' }}>Successfully applied to {appliedTarget.title} at {appliedTarget.company}.</p>
            <button onClick={() => { setShowApplySuccessModal(false); setSelectedJob(null); }} style={{ padding: '10px 35px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', width: '100%' }}>OK</button>
          </div>
        </div>
      )}

      {/* ================= MIDDLE SCREEN BOX MODAL: LOGOUT CONFIRMATION ================= */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', padding: '30px 35px', borderRadius: '16px', maxWidth: '400px', width: '95%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f2c59', fontSize: '20px', fontWeight: '800' }}>Confirm Logout</h3>
            <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '15px' }}>Do you want to logout?</p>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button 
                onClick={() => { 
                  setShowLogoutModal(false); 
                  setCurrentPage('landing'); 
                }} 
                style={{ padding: '10px 30px', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', flex: 1 }}
              >
                Yes
              </button>
              <button 
                onClick={() => setShowLogoutModal(false)} 
                style={{ padding: '10px 30px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', flex: 1 }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default CandidateDashboard;