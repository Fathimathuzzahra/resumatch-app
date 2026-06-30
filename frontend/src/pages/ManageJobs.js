import React, { useState } from 'react';
const API_BASE_URL = "http://127.0.0.1:5000/api";
function ManageJobs({ jobs, setJobs }) {
  // Manage Jobs feature workflow states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Search filter implementation
  const filteredJobs = (jobs || []).filter(job =>
    job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsEditing(false);
  };

  const toggleJobStatus = async (id, currentStatus) => {
    const updatedStatus = currentStatus === 'Active' ? 'Closed' : 'Active';
    
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus })
      });

      if (response.ok) {
        const updatedJobs = jobs.map(j => j.id === id ? { ...j, status: updatedStatus } : j);
        setJobs(updatedJobs);
        if (selectedJob && selectedJob.id === id) {
          setSelectedJob({ ...selectedJob, status: updatedStatus });
        }
      }
    } catch (error) {
      console.error("Status update karne me dikkat aayi:", error);
    }
  };

  const triggerDeleteConfirm = (job, e) => {
    e.stopPropagation();
    setJobToDelete(job);
    setShowDeleteConfirm(true);
  };

 const executeDeleteJob = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobToDelete.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        const updatedJobs = jobs.filter(j => j.id !== jobToDelete.id);
        setJobs(updatedJobs);
        setShowDeleteConfirm(false);
        setJobToDelete(null);
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Job delete karne me dikkat aayi:", error);
    }
  };

  const startEditing = () => {
    setEditForm({ ...selectedJob });
    setIsEditing(true);
  };

  const saveJobChanges = () => {
    const updatedJobs = jobs.map(j => j.id === editForm.id ? editForm : j);
    setJobs(updatedJobs);
    setSelectedJob(editForm);
    setIsEditing(false);
  };

  return (
    <div style={{ width: '100%' }}>
      {selectedJob ? (
        <div style={{ maxWidth: '850px', margin: '0 auto', backgroundColor: 'white', padding: '30px 40px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'relative' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
            <button 
              onClick={() => setSelectedJob(null)} 
              style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '50%', 
                border: 'none', 
                backgroundColor: '#0f2c59', 
                fontSize: '18px', 
                fontWeight: 'bold',
                cursor: 'pointer', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#1e3a8a'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = '#0f2c59'; }}
            >
              ←
            </button>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', color: '#1e40af' }}>
                Applications: {selectedJob.applicationsCount}
              </span>
              {!isEditing && (
                <button onClick={startEditing} style={{ padding: '8px 18px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', color: '#0f2c59' }}>
                  Edit
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Job Title</label>
                  <input type="text" value={editForm.jobTitle} onChange={e => setEditForm({...editForm, jobTitle: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Company Name</label>
                  <input type="text" value={editForm.companyName} onChange={e => setEditForm({...editForm, companyName: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Job Location</label>
                  <input type="text" value={editForm.jobLocation} onChange={e => setEditForm({...editForm, jobLocation: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Job Type</label>
                  <select value={editForm.jobType} onChange={e => setEditForm({...editForm, jobType: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', boxSizing: 'border-box' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Job Requirements and Details</label>
                <textarea rows="4" value={editForm.jobDescription} onChange={e => setEditForm({...editForm, jobDescription: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Required Skills</label>
                <input type="text" value={editForm.requiredSkills} onChange={e => setEditForm({...editForm, requiredSkills: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Education Requirement</label>
                  <input type="text" value={editForm.education} onChange={e => setEditForm({...editForm, education: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Minimum ATS passing score</label>
                  <input type="number" value={editForm.minAtsScore} onChange={e => setEditForm({...editForm, minAtsScore: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontWeight: '600', fontSize: '14px', color: '#334155' }}>Required AI Keywords</label>
                <input type="text" value={editForm.requiredKeywords} onChange={e => setEditForm({...editForm, requiredKeywords: e.target.value})} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={saveJobChanges} style={{ padding: '10px 20px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Save Changes</button>
                <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                <div><strong style={{ color: '#64748b' }}>Job Title:</strong> <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f2c59', marginTop: '2px' }}>{selectedJob.jobTitle}</div></div>
                <div><strong style={{ color: '#64748b' }}>Company Name:</strong> <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f2c59', marginTop: '2px' }}>{selectedJob.companyName}</div></div>
                <div><strong style={{ color: '#64748b' }}>Job Location:</strong> <div style={{ fontSize: '15px', marginTop: '2px' }}>{selectedJob.jobLocation}</div></div>
                <div><strong style={{ color: '#64748b' }}>Job Type:</strong> <div style={{ fontSize: '15px', marginTop: '2px' }}>{selectedJob.jobType}</div></div>
                <div><strong style={{ color: '#64748b' }}>Date Posted:</strong> <div style={{ fontSize: '14px', marginTop: '2px' }}>{selectedJob.datePosted}</div></div>
                <div>
                  <strong style={{ color: '#64748b' }}>Status:</strong> 
                  <div style={{ marginTop: '2px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: selectedJob.status === 'Active' ? '#dcfce7' : '#fee2e2', color: selectedJob.status === 'Active' ? '#15803d' : '#b91c1c' }}>
                      {selectedJob.status === 'Active' ? 'Active' : 'Closed'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#0f2c59', fontWeight: '700' }}>Job requirements and Details</h4>
                <p style={{ margin: 0, color: '#334155', backgroundColor: '#fafafa', padding: '15px', borderRadius: '8px', border: '1px solid #f1f5f9', lineHeight: '1.6' }}>{selectedJob.jobDescription}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div><strong style={{ color: '#64748b', fontSize: '14px' }}>Required Skills:</strong> <p style={{ margin: '3px 0 0 0' }}>{selectedJob.requiredSkills}</p></div>
                <div><strong style={{ color: '#64748b', fontSize: '14px' }}>Applicant Standards:</strong> <p style={{ margin: '3px 0 0 0' }}>{selectedJob.applicantStandard} {selectedJob.applicantStandard === 'Experienced' && `(${selectedJob.experienceYears} Years)`}</p></div>
                <div><strong style={{ color: '#64748b', fontSize: '14px' }}>Education Requirement:</strong> <p style={{ margin: '3px 0 0 0' }}>{selectedJob.education || 'N/A'}</p></div>
                <div><strong style={{ color: '#64748b', fontSize: '14px' }}>Minimum ATS passing score:</strong> <p style={{ margin: '3px 0 0 0' }}>{selectedJob.minAtsScore}%</p></div>
              </div>

              <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '8px', border: '1px dashed #bfdbfe' }}>
                <strong style={{ color: '#1e40af', fontSize: '14px' }}>Required AI Keywords:</strong>
                <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#1e3a8a' }}>{selectedJob.requiredKeywords || 'None'}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <button 
                  onClick={(e) => triggerDeleteConfirm(selectedJob, e)} 
                  style={{ padding: '10px 20px', backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                >
                  Delete Job
                </button>

                {selectedJob.status === 'Active' ? (
                  <button 
                    onClick={() => toggleJobStatus(selectedJob.id, 'Active')} 
                    style={{ padding: '10px 20px', backgroundColor: '#fff7ed', color: '#c2410c', border: '1px solid #fdba74', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Close Job
                  </button>
                ) : (
                  <button 
                    onClick={() => toggleJobStatus(selectedJob.id, 'Closed')} 
                    style={{ padding: '10px 20px', backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Reopen Job
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Search by Job Title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} style={{ backgroundColor: 'white', padding: '20px 25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', color: '#0f2c59', fontSize: '18px', fontWeight: '700' }}>{job.jobTitle}</h3>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      <span>Date Posted: {job.datePosted}</span>
                      <span style={{ marginLeft: '15px', fontWeight: '600', color: job.status === 'Active' ? '#10b981' : '#b91c1c' }}>
                        ({job.status === 'Active' ? 'Open' : 'Closed'})
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <button 
                      onClick={() => handleViewDetails(job)} 
                      style={{ background: 'none', border: 'none', color: '#0f2c59', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
                No jobs found.
              </div>
            )}
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px 35px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxWidth: '380px', width: '90%' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#0f2c59', fontWeight: '700' }}>Do you want to delete the job post?</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button onClick={executeDeleteJob} style={{ padding: '8px 25px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>yes</button>
              <button onClick={() => { setShowDeleteConfirm(false); setJobToDelete(null); }} style={{ padding: '8px 25px', backgroundColor: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>no</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;