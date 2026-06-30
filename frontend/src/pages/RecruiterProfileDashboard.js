import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://127.0.0.1:5000/api";

function RecruiterProfileDashboard({ userProfile, setUserProfile }) {
  // Edit mode toggle karne ke liye state
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form inputs ko handle karne ke liye local state
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    companyName: '',
    workEmail: '',
    designation: '',
    website: '',
    about: '',
    profilePhoto: null,
  });

  // 📥 1. Initial Load par Backend se saved data fetch karna
  useEffect(() => {
    const fetchBackendProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`);
        if (response.ok) {
          const data = await response.json();
          // Backend keys ko local form state me map karna
          setFormData({
            fullName: userProfile?.fullName || 'John Doe', // Agar login session se naam aa raha ho
            companyName: data.companyName || 'TechCorp Solutions',
            workEmail: data.officialEmail || 'recruiter@techcorp.com',
            designation: data.designation || 'Senior Talent Acquisition',
            website: data.website || 'https://techcorp.com',
            about: data.aboutCompany || 'Leading innovators in software development and AI driven staffing infrastructure.',
            profilePhoto: userProfile?.profilePhoto || null,
          });
        }
      } catch (error) {
        console.error("Dashboard profile load karne me dikkat:", error);
      }
    };
    fetchBackendProfile();
  }, [userProfile]);

  // Form values change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Profile Photo Upload Handler
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 💾 2. Save Changes ko Backend API se connect karna
  const handleSave = async (e) => {
    if (e) e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: formData.companyName,
          officialEmail: formData.workEmail, // Syncing back with backend expected key
          designation: formData.designation,
          website: formData.website,
          aboutCompany: formData.about
        })
      });

      if (response.ok) {
        if (typeof setUserProfile === 'function') {
          setUserProfile(formData); 
        }
        setIsEditing(false);       // Edit mode band hoga
        setShowSuccessModal(true);  // Success popup box dikhayega
      }
    } catch (error) {
      console.error("Profile update save karne me dikkat:", error);
    }
  };

  // Cancel handler
  const handleCancel = async () => {
    // Wapas backend se fresh data reload karna configuration clear karne ke liye
    try {
      const response = await fetch(`${API_BASE_URL}/profile`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          fullName: userProfile?.fullName || 'John Doe',
          companyName: data.companyName || 'TechCorp Solutions',
          workEmail: data.officialEmail || 'recruiter@techcorp.com',
          designation: data.designation || 'Senior Talent Acquisition',
          website: data.website || 'https://techcorp.com',
          about: data.aboutCompany || 'Leading innovators in software development and AI driven staffing infrastructure.',
          profilePhoto: userProfile?.profilePhoto || null,
        });
      }
    } catch (e) {
      console.error(e);
    }
    setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      
      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
        <h2 style={{ margin: 0, color: '#0f2c59', fontSize: '26px', fontWeight: '800' }}>Profile</h2>
        
        {!isEditing ? (
          <button 
            type="button" 
            onClick={() => setIsEditing(true)}
            style={{ padding: '8px 20px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <button 
            type="button" 
            onClick={handleSave} 
            style={{ padding: '8px 22px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 5px rgba(16,185,129,0.2)' }}
          >
            💾 Save Changes
          </button>
        )}
      </div>

      <form style={{ backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* PROFILE PHOTO PANEL */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div style={{ position: 'relative', width: '130px', height: '130px' }}>
            {formData.profilePhoto ? (
              <img 
                src={formData.profilePhoto} 
                alt="Profile" 
                style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0f2c59' }} 
              />
            ) : (
              <div style={{ width: '130px', height: '130px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #cbd5e1' }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                  <line x1="9" y1="22" x2="9" y2="16"></line>
                  <line x1="15" y1="22" x2="15" y2="16"></line>
                  <line x1="9" y1="16" x2="15" y2="16"></line>
                  <path d="M9 6h.01"></path>
                  <path d="M15 6h.01"></path>
                  <path d="M9 10h.01"></path>
                  <path d="M15 10h.01"></path>
                </svg>
              </div>
            )}

            {isEditing && (
              <label style={{ 
                position: 'absolute', bottom: '5px', right: '5px', backgroundColor: '#10b981', color: 'white', 
                width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', cursor: 'pointer', fontSize: '22px', fontWeight: 'bold', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)', lineHeight: '0', paddingBottom: '4px', boxSizing: 'border-box'
              }}>
                +
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>
        </div>

        {/* INPUT FIELDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>FULL NAME</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              disabled={!isEditing} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditing ? '#fff' : '#f8fafc', color: '#1e293b', fontSize: '15px', outline: 'none' }} 
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>RECRUITER DESIGNATION</label>
            <input 
              type="text" 
              name="designation" 
              value={formData.designation} 
              onChange={handleChange} 
              disabled={!isEditing} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditing ? '#fff' : '#f8fafc', color: '#1e293b', fontSize: '15px', outline: 'none' }} 
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>COMPANY NAME</label>
            <input 
              type="text" 
              name="companyName" 
              value={formData.companyName} 
              onChange={handleChange} 
              disabled={!isEditing} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditing ? '#fff' : '#f8fafc', color: '#1e293b', fontSize: '15px', outline: 'none' }} 
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>OFFICIAL WORK EMAIL</label>
            <input 
              type="email" 
              name="workEmail" 
              value={formData.workEmail} 
              onChange={handleChange} 
              disabled={!isEditing} 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditing ? '#fff' : '#f8fafc', color: '#1e293b', fontSize: '15px', outline: 'none' }} 
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>COMPANY WEBSITE (OPTIONAL)</label>
          <input 
            type="url" 
            name="website" 
            value={formData.website} 
            onChange={handleChange} 
            disabled={!isEditing} 
            placeholder="https://example.com"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditing ? '#fff' : '#f8fafc', color: '#1e293b', fontSize: '15px', outline: 'none' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>ABOUT COMPANY</label>
          <textarea 
            name="about" 
            value={formData.about} 
            onChange={handleChange} 
            disabled={!isEditing} 
            rows="4" 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: isEditing ? '#fff' : '#f8fafc', color: '#1e293b', fontSize: '15px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} 
            required
          />
        </div>

        {/* Cancel Button */}
        {isEditing && (
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={handleCancel}
              style={{ padding: '12px 25px', backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 25px rgba(0,0,0,0.15)', textAlign: 'center', width: '360px' }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#e6f4ea', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: '#137333', fontSize: '24px', fontWeight: 'bold' }}>
              ✓
            </div>
            <h3 style={{ margin: '0 0 10px 0', color: '#0f2c59', fontSize: '20px', fontWeight: '700' }}>Success!</h3>
            <p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '15px', fontWeight: '500' }}>Changes saved successfully</p>
            
            <button 
              type="button"
              onClick={() => setShowSuccessModal(false)}
              style={{ padding: '10px 30px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', width: '100%', boxShadow: '0 2px 5px rgba(15,44,89,0.2)' }}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default RecruiterProfileDashboard;