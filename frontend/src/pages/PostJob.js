import React, { useState } from 'react';
const API_BASE_URL = "http://127.0.0.1:5000/api";
function PostJob({ setActiveTab, jobs, setJobs }) {
  // --- Form States ---
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [jobDescription, setJobDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  
  // ✅ New State for Applicant Standards & Experience
  const [applicantStandard, setApplicantStandard] = useState('Fresher'); 
  const [experienceYears, setExperienceYears] = useState('');
  const [education, setEducation] = useState('');
  
  // --- ATS AI Settings States ---
  const [requiredKeywords, setRequiredKeywords] = useState('');
  const [minAtsScore, setMinAtsScore] = useState('');

  // --- Custom Modal State ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (jobTitle && companyName && jobLocation && jobDescription && requiredSkills) {
      
      const today = new Date().toISOString().split('T')[0];

      // Backend ko bhejne ke liye data packet taiyar kiya
      const newJobObj = {
        title: jobTitle, // Backend schema ke hisab se 'title' rakha hai
        companyName,
        jobLocation,
        jobType,
        jobDescription,
        requiredSkills,
        applicantStandard,
        experienceYears: applicantStandard === 'Experienced' ? experienceYears : '0',
        education,
        requiredKeywords,
        minAtsScore,
        datePosted: today,
        status: 'Active'
      };

      try {
        // Backend API par network hit kiya
        const response = await fetch(`${API_BASE_URL}/jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newJobObj),
        });

        if (response.ok) {
          const result = await response.json();
          
          // Agar database list refresh karni ho toh local state update karein
          if (typeof setJobs === 'function') {
            setJobs([result.job, ...jobs]);
          }
          
          // Aapka pyara custom success modal show hoga
          setShowSuccessModal(true);
        }
      } catch (error) {
        console.error("Backend me job post karne me dikkat aayi:", error);
      }
    }
  };

  // ✅ FIXED: Enter click karne par automatically next box me focus bhejega!
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Agar text area me enter dabayein toh new line banni chahiye, use skip karenge
      if (e.target.tagName === 'TEXTAREA') return; 

      e.preventDefault(); // Default submit ya sound alert rokega
      
      // Saare scan karne layak inputs ki list
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form.elements, e.target);
      
      // Agle available enabled input box ko dhoondh kar focus karega
      for (let i = index + 1; i < form.elements.length; i++) {
        const nextElement = form.elements[i];
        if (nextElement && nextElement.tabIndex !== -1 && !nextElement.disabled && nextElement.type !== 'submit') {
          nextElement.focus();
          break;
        }
      }
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    
    // Clear fields
    setJobTitle(''); setCompanyName(''); setJobLocation(''); setJobType('Full-time'); setJobDescription('');
    setRequiredSkills(''); setApplicantStandard('Fresher'); setExperienceYears('');
    setEducation(''); setRequiredKeywords(''); setMinAtsScore('');
    
    if (typeof setActiveTab === 'function') {
      setActiveTab('manage-jobs'); // Directs to Manage Jobs automatically
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', backgroundColor: 'white', padding: '30px 40px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative' }}>
      
      {/* CUSTOM CENTER MODAL POPUP */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px 40px', borderRadius: '12px',
            textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            maxWidth: '400px', width: '90%'
          }}>
            <div style={{ fontSize: '45px', marginBottom: '15px' }}>🎉</div>
            <h3 style={{ color: '#0f2c59', margin: '0 0 10px 0', fontSize: '22px', fontWeight: '700' }}>Success!</h3>
            <p style={{ color: '#475569', fontSize: '15px', margin: '0 0 25px 0', lineHeight: '1.5' }}>
              Job "{jobTitle}" successfully posted!
            </p>
            <button 
              onClick={handleModalClose}
              style={{
                padding: '10px 30px', backgroundColor: '#0f2c59', color: 'white',
                border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold',
                cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <h2 style={{ color: '#0f2c59', margin: '0 0 5px 0', fontSize: '26px', fontWeight: '800' }}>Create a New Job Posting</h2>
      <p style={{ color: '#64748b', margin: '0 0 25px 0', fontWeight: '500' }}>Fill out the info and set your AI parsing triggers below.</p>
      
      <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* SECTION: Basic Info */}
        <div>
          <h3 style={{ color: '#0f2c59', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Basic Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Job Title</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., Senior MERN Stack Developer" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., Tech Solution Ltd" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Job Location</label>
              <input type="text" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., Hyderabad, India or Remote" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Job Type</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)} onKeyDown={handleKeyDown} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION: Job Details */}
        <div>
          <h3 style={{ color: '#0f2c59', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Job Requirements & Details</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Job Description</label>
              <textarea rows="5" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Explain roles, duties..." required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Required Skills (comma-separated)</label>
              <input type="text" value={requiredSkills} onChange={(e) => setRequiredSkills(e.target.value)} onKeyDown={handleKeyDown} placeholder="React, Node.js, SQL" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
              
              {/* ✅ REPLACED: Applicant Standards with Round Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Applicant Standards</label>
                <div style={{ display: 'flex', gap: '20px', marginTop: '5px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: '#334155', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="applicantStandard" 
                      value="Fresher" 
                      checked={applicantStandard === 'Fresher'} 
                      onChange={(e) => setApplicantStandard(e.target.value)}
                      style={{ width: '18px', height: '18px', accentColor: '#0f2c59' }}
                    />
                    Fresher
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: '#334155', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="applicantStandard" 
                      value="Experienced" 
                      checked={applicantStandard === 'Experienced'} 
                      onChange={(e) => setApplicantStandard(e.target.value)}
                      style={{ width: '18px', height: '18px', accentColor: '#0f2c59' }}
                    />
                    Experienced
                  </label>
                </div>

                {/* Conditional rendering: custom input pops open when Experienced is checked */}
                {applicantStandard === 'Experienced' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                    <label style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>Years of Experience</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={experienceYears} 
                      onChange={(e) => setExperienceYears(e.target.value)} 
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., 3" 
                      required 
                      style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }} 
                    />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Education Requirement</label>
                <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., B.Tech, MCA" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: ATS Settings */}
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <h3 style={{ color: '#0f2c59', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700' }}>
            ⭐ ATS Engine Configuration (AI Feature)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Required AI Keywords (Strict Scanning)</label>
              <input type="text" value={requiredKeywords} onChange={(e) => setRequiredKeywords(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., Python, React, SQL" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Minimum ATS Passing Score (%)</label>
              <input type="number" value={minAtsScore} onChange={(e) => setMinAtsScore(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g., 70" min="0" max="100" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white' }} />
            </div>
          </div>
        </div>

        {/* SECTION: Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
          <button type="submit" style={{ padding: '12px 35px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(15, 44, 89, 0.15)' }}>
            Post Job 🚀
          </button>
        </div>

      </form>
    </div>
  );
}

export default PostJob;