import React, { useState } from 'react';

const API_BASE_URL = "http://127.0.0.1:5000/api";

function JobApplications({ jobs, setJobs }) {
  // Workflow Navigation States: 'list' | 'applications' | 'deep-dive' | 'pdf-view'
  const [currentView, setCurrentView] = useState('list');
  
  // Selection States
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Search and Filter States
  const [jobSearch, setJobSearch] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');
  
  // Loading & Matching Trigger State
  const [isMatching, setIsMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);

  // --- 1. Dynamic Applicants Extraction & Filtering ---
  const currentApplicants = selectedJob && selectedJob.applicants ? selectedJob.applicants : [];

  const filteredJobs = (jobs || []).filter(job =>
    job.jobTitle.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredCandidates = currentApplicants
    .filter(applicant => applicant.name.toLowerCase().includes(candidateSearch.toLowerCase()))
    .map(applicant => {
      return {
        id: applicant.id || Math.random().toString(),
        name: applicant.name,
        email: applicant.email || `${applicant.name.toLowerCase().replace(' ', '.')}@example.com`,
        phone: applicant.phone || '+91 9999999999',
        status: applicant.status || 'Applied',
        atsScore: applicant.atsScore || (applicant.status === 'Shortlisted' ? 88 : 64),
        education: applicant.education || 'B.Tech / Graduate',
        experience: applicant.experience || (applicant.status === 'Shortlisted' ? '2 Years' : 'Fresher'),
        skills: applicant.skills || 'React, JavaScript, Python, SQL',
        projects: applicant.projects || 'Project Dashboard System',
        certifications: applicant.certifications || 'Verified Technical Professional',
        matchingKeywords: applicant.matchingKeywords || ['React', 'Python'],
        missingKeywords: applicant.missingKeywords || ['Node.js'],
        strengths: applicant.strengths || 'Strong analytical mindset and domain foundation.',
        weaknesses: applicant.weaknesses || 'Lacks enterprise-level framework exposure.',
        actions: applicant.actions || 'Recommend interviewing for core evaluation.'
      };
    })
    .sort((a, b) => (hasMatched ? b.atsScore - a.atsScore : 0));

  // --- 2. Action Handlers with Backend Sync ---
  const handleMatchApplicants = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      setHasMatched(true);
    }, 1500);
  };

  const handleStatusUpdate = async (candidateId, newStatus) => {
    if (!selectedJob) return;

    try {
      // Hit backend API to save state permanently
      const response = await fetch(`${API_BASE_URL}/jobs/${selectedJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_name: selectedCandidate.name,
          applicant_status: newStatus
        })
      });

      if (response.ok) {
        // Immediate local state feedback
        setSelectedCandidate(prev => ({ ...prev, status: newStatus }));

        if (typeof setJobs === 'function') {
          const updatedJobs = jobs.map(j => {
            if (j.id === selectedJob.id) {
              const updatedApplicants = j.applicants.map(app => 
                app.name === selectedCandidate.name ? { ...app, status: newStatus } : app
              );
              return { ...j, applicants: updatedApplicants };
            }
            return j;
          });
          setJobs(updatedJobs);
        }
      }
    } catch (error) {
      console.error("Applicant status save karne me error aaya:", error);
    }
  };

  return (
    <div style={{ width: '100%', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      
      {/* VIEW 1: JOB APPLICATIONS (MAIN LIST) */}
      {currentView === 'list' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ color: '#0f2c59', marginBottom: '20px' }}>Job Applications Dashboard</h2>
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Search by Job Title..." 
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} style={{ backgroundColor: 'white', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', color: '#0f2c59', fontSize: '18px', fontWeight: '700' }}>{job.jobTitle}</h3>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      <span>Company: {job.companyName}</span>
                      <span style={{ marginLeft: '15px' }}>Location: {job.jobLocation}</span>
                    </div>
                  </div>
                  <div>
                    <button 
                      onClick={() => { setSelectedJob(job); setCandidateSearch(''); setHasMatched(false); setCurrentView('applications'); }} 
                      style={{ padding: '10px 18px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      View Applications
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
                No posted jobs found. Post a job first!
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: VIEW APPLICATIONS (SELECTED JOB) */}
      {currentView === 'applications' && selectedJob && (
        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
            <button 
              onClick={() => setCurrentView('list')} 
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: '#0f2c59', fontSize: '18px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ←
            </button>
            <h2 style={{ margin: 0, color: '#0f2c59', fontSize: '24px', fontWeight: '700' }}>{selectedJob.jobTitle}</h2>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search by Applicant Name..." 
              value={candidateSearch}
              onChange={(e) => setCandidateSearch(e.target.value)}
              style={{ flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
            />
            <button 
              onClick={handleMatchApplicants}
              disabled={isMatching}
              style={{ padding: '12px 22px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', minWidth: '160px' }}
            >
              {isMatching ? 'Processing...' : 'Match Applicants'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate) => (
                <div key={candidate.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {hasMatched && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: candidate.atsScore >= 80 ? '#dcfce7' : '#fef9c3', border: `2px solid ${candidate.atsScore >= 80 ? '#22c55e' : '#eab308'}`, fontWeight: 'bold', color: candidate.atsScore >= 80 ? '#16a34a' : '#ca8a04', fontSize: '14px' }}>
                        {candidate.atsScore}%
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '16px' }}>{candidate.name}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Status: <span style={{ fontWeight: '600', color: '#0f2c59' }}>{candidate.status}</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedCandidate(candidate); setCurrentView('deep-dive'); }}
                    style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', color: '#0f2c59', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Dive Deep
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No applicants found for this job.</div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: DIVE DEEP (CANDIDATE ANALYSIS) */}
      {currentView === 'deep-dive' && selectedCandidate && (
        <div style={{ maxWidth: '950px', margin: '0 auto', backgroundColor: 'white', padding: '30px 40px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
            <button 
              onClick={() => setCurrentView('applications')} 
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: '#0f2c59', fontSize: '18px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ←
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => handleStatusUpdate(selectedCandidate.id, 'Under Review')}
                style={{ 
                  padding: '10px 18px', 
                  backgroundColor: selectedCandidate.status === 'Under Review' ? '#10b981' : '#f3f4f6', 
                  color: selectedCandidate.status === 'Under Review' ? 'white' : '#4b5563', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer' 
                }}
              >
                {selectedCandidate.status === 'Under Review' ? 'Under Review' : 'Review'}
              </button>
              <button 
                onClick={() => handleStatusUpdate(selectedCandidate.id, 'Shortlisted')}
                style={{ 
                  padding: '10px 18px', 
                  backgroundColor: selectedCandidate.status === 'Shortlisted' ? '#10b981' : '#dcfce7', 
                  color: selectedCandidate.status === 'Shortlisted' ? 'white' : '#16a34a', 
                  border: '1px solid #86efac', 
                  borderRadius: '8px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer' 
                }}
              >
                {selectedCandidate.status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '30px', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#eff6ff', border: '4px solid #3b82f6' }}>
                  <span style={{ fontSize: '22px', fontWeight: '800', color: '#1d4ed8' }}>{selectedCandidate.atsScore}%</span>
                </div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f2c59', fontSize: '20px' }}>{selectedCandidate.name}</h3>
                <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#64748b' }}>Current Status: <b>{selectedCandidate.status}</b></p>
                <div style={{ textAlign: 'left', fontSize: '13px', borderTop: '1px solid #e2e8f0', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><b>Email:</b> {selectedCandidate.email}</div>
                  <div><b>Phone:</b> {selectedCandidate.phone}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#0f2c59' }}>Matching Keywords</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedCandidate.matchingKeywords.map((kw, i) => (
                    <span key={i} style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>✓ {kw}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#0f2c59', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Candidate Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div><h5 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px' }}>EDUCATION</h5><p style={{ margin: 0 }}>{selectedCandidate.education}</p></div>
                  <div><h5 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px' }}>EXPERIENCE</h5><p style={{ margin: 0 }}>{selectedCandidate.experience}</p></div>
                  <div><h5 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px' }}>SKILLS</h5><p style={{ margin: 0 }}>{selectedCandidate.skills}</p></div>
                  <div><h5 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px' }}>PROJECTS</h5><p style={{ margin: 0 }}>{selectedCandidate.projects}</p></div>
                  <div><h5 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '12px' }}>CERTIFICATIONS</h5><p style={{ margin: 0 }}>{selectedCandidate.certifications}</p></div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#16a34a' }}>ATS Comprehensive Analysis</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <div><b>Resume Strengths:</b> {selectedCandidate.strengths}</div>
                  <div><b>Resume Weaknesses:</b> {selectedCandidate.weaknesses}</div>
                  <div>
                    <b>Missing Keywords:</b>{' '}
                    {selectedCandidate.missingKeywords.map((kw, i) => (
                      <span key={i} style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', margin: '0 4px', fontSize: '11px', fontWeight: 'bold' }}>✕ {kw}</span>
                    ))}
                  </div>
                  <div><b>Resume Actions:</b> {selectedCandidate.actions}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setCurrentView('pdf-view')}
                  style={{ padding: '12px 24px', backgroundColor: '#0f2c59', color: 'white', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}
                >
                  Open Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: OPEN RESUME (PDF VIEWER CONTEXT) */}
      {currentView === 'pdf-view' && selectedCandidate && (
        <div style={{ maxWidth: '850px', margin: '0 auto', backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
            <button 
              onClick={() => setCurrentView('deep-dive')} 
              style={{ width: '38px', height: '38px', borderRadius: '50%', border: 'none', backgroundColor: '#0f2c59', fontSize: '18px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ←
            </button>
            <h3 style={{ margin: 0, color: '#0f2c59' }}>{selectedCandidate.name}'s Resume Document</h3>
          </div>

          <div style={{ width: '100%', height: '600px', backgroundColor: '#525659', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', padding: '20px 0' }}>
            <div style={{ width: '80%', minHeight: '750px', backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', padding: '40px', boxSizing: 'border-box', fontFamily: 'serif', color: '#000' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: '0 0 5px 0', fontSize: '28px' }}>{selectedCandidate.name}</h1>
                <p style={{ margin: 0, fontSize: '13px' }}>{selectedCandidate.email} | {selectedCandidate.phone} | Delhi, India</p>
              </div>
              <hr style={{ border: '0', borderTop: '1px solid #000', marginBottom: '15px' }} />
              
              <h3 style={{ textTransform: 'uppercase', fontSize: '16px', margin: '15px 0 5px 0' }}>Education</h3>
              <p style={{ margin: 0, fontSize: '14px' }}><b>{selectedCandidate.education}</b> — Universal Engineering College</p>
              
              <h3 style={{ textTransform: 'uppercase', fontSize: '16px', margin: '20px 0 5px 0' }}>Experience</h3>
              <p style={{ margin: 0, fontSize: '14px' }}><b>{selectedCandidate.experience}</b></p>
              <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', fontSize: '13px', lineHeight: '1.5' }}>
                <li>Developed scalable UI architectural elements serving client requests.</li>
                <li>Collaborated with optimization cross-teams to resolve frontend lag bottlenecks.</li>
              </ul>

              <h3 style={{ textTransform: 'uppercase', fontSize: '16px', margin: '20px 0 5px 0' }}>Core Skills</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>{selectedCandidate.skills}</p>

              <h3 style={{ textTransform: 'uppercase', fontSize: '16px', margin: '20px 0 5px 0' }}>Academic & Personal Projects</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>{selectedCandidate.projects}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default JobApplications;