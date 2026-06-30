import React, { useState, useRef, useEffect } from 'react'; // FIXED: useEffect add kiya

function CandidateProfile({ onSaveSuccess }) {
  const [profileImage, setProfileImage] = useState(null);
  const [isExperienced, setIsExperienced] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    college: '',
    skills: '',
    yearsOfExp: '',
    summary: ''
  });

  // FIXED: Yeh hook ensures karega ki page open hote hi user bina scroll kiye sabse top par dikhe
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.qualification || !formData.college || !formData.skills || !formData.summary) {
      setSuccessMsg('⚠️ Please fill in all the details before saving your profile!');
      return;
    }

    if (isExperienced && !formData.yearsOfExp) {
      setSuccessMsg('⚠️ Please specify your years of experience!');
      return;
    }
    
    setSuccessMsg('✅ Profile Saved Successfully! Opening your Dashboard...');
    
    setTimeout(() => {
      onSaveSuccess(); 
    }, 2000);
  };

  const inputStyle = {
    width: '100%',
    padding: '7px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: '#f8fafc'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#334155',
    display: 'block',
    marginBottom: '4px',
    textAlign: 'left'
  };

  return (
    <div style={{ 
      maxWidth: '750px', 
      margin: '10px auto', 
      padding: '20px 30px', 
      backgroundColor: '#ffffff', 
      borderRadius: '16px', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      boxSizing: 'border-box',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '24px', margin: '0 0 4px 0', color: '#0f2d1e', fontWeight: '800' }}>Welcome to ResuMatch</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: '500' }}>Complete Your Profile</p>
      </div>

      <form onSubmit={handleSubmit}>
        
        {/* AVATAR SECTION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', background: '#f1f5f9', padding: '10px 15px', borderRadius: '12px' }}>
          <div style={{ position: 'relative', width: '65px', height: '65px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #113a29', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '24px', color: '#475569' }}>👤</span>
            )}
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: '#113a29', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>+</div>
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => { if(e.target.files[0]) setProfileImage(URL.createObjectURL(e.target.files[0])) }} style={{ display: 'none' }} />
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>Upload Profile Photo</span>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>Make your profile stand out (Optional)</p>
          </div>
        </div>

        {/* 2-COLUMN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input type="text" name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input type="tel" name="phone" placeholder="+1 234 567 890" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Highest Qualification *</label>
            <input type="text" name="qualification" placeholder="B.Tech / M.Tech / MCA" value={formData.qualification} onChange={handleInputChange} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>College / University *</label>
            <input type="text" name="college" placeholder="XYZ Institute of Technology" value={formData.college} onChange={handleInputChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Skills (Comma Separated) *</label>
            <input type="text" name="skills" placeholder="Python, React, SQL, Java" value={formData.skills} onChange={handleInputChange} style={inputStyle} />
          </div>
        </div>

        {/* EXPERIENCE TOGGLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={isExperienced} onChange={(e) => setIsExperienced(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            Are you an experienced professional?
          </label>
          
          {isExperienced && (
            <input type="number" name="yearsOfExp" placeholder="Years of Exp" value={formData.yearsOfExp} onChange={handleInputChange} style={{ ...inputStyle, width: '120px', padding: '5px 10px' }} />
          )}
        </div>

        {/* SUMMARY TEXT AREA */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Professional Summary *</label>
          <textarea name="summary" rows="2" placeholder="Briefly describe your profile and career objectives..." value={formData.summary} onChange={handleInputChange} style={{ ...inputStyle, resize: 'none', height: '55px' }}></textarea>
        </div>

        {/* SUBMIT BUTTON */}
        <button type="submit" style={{ 
          width: '100%', 
          padding: '12px', 
          backgroundColor: '#113a29', 
          color: '#ffffff', 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: '700', 
          fontSize: '15px', 
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(17, 58, 41, 0.15)'
        }}>
          Save Profile
        </button>

        {/* COLORFUL INLINE MESSAGE */}
        {successMsg && (
          <div style={{ 
            marginTop: '15px', 
            padding: '10px 15px', 
            borderRadius: '8px', 
            textAlign: 'center', 
            fontSize: '13px',
            fontWeight: '700', 
            color: successMsg.startsWith('✅') ? '#15803d' : '#b91c1c', 
            backgroundColor: successMsg.startsWith('✅') ? '#f0fdf4' : '#fef2f2',
            border: successMsg.startsWith('✅') ? '1px solid #bbf7d0' : '1px solid #fee2e2'
          }}>
            {successMsg}
          </div>
        )}
      </form>
    </div>
  );
}

export default CandidateProfile;