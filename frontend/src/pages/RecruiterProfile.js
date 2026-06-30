import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://127.0.0.1:5000/api";

function RecruiterProfile({ setCurrentPage }) {
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [website, setWebsite] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Initial Load par Backend se existing profile details fetch karna
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`);
        if (response.ok) {
          const data = await response.json();
          if (data.companyName) setCompanyName(data.companyName);
          if (data.officialEmail) setOfficialEmail(data.officialEmail);
          if (data.designation) setDesignation(data.designation);
          if (data.website) setWebsite(data.website);
          if (data.aboutCompany) setAboutCompany(data.aboutCompany);
        }
      } catch (error) {
        console.error("Profile load karne me dikkat aayi:", error);
      }
    };
    fetchProfileData();
  }, []);

  // Form Validation Check
  useEffect(() => {
    const isCompanyAdded = companyName.trim() !== '';
    const isEmailAdded = officialEmail.trim() !== '';
    const isDesignationAdded = designation.trim() !== '';
    const isAboutAdded = aboutCompany.trim().length >= 10 && aboutCompany.trim().length <= 500;

    if (isCompanyAdded && isEmailAdded && isDesignationAdded && isAboutAdded) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [companyName, officialEmail, designation, aboutCompany]);

  // 🚀 ENTER KEY NAVIGATION LOGIC: Agle input box me bhejne ke liye
  const handleKeyDown = (e, nextFieldId) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Default submit behavior ko roko
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus(); // Cursor ko agle field me bhejo
      }
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files.length > 0) {
      setCompanyLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          officialEmail,
          designation,
          website,
          aboutCompany
        })
      });

      if (response.ok) {
        setSuccessMessage('Your recruiter profile saved successfully and you are directed to dashboard...');
        setTimeout(() => {
          setCurrentPage('recruiter-dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error("Profile save karne me dikkat aayi:", error);
    }
  };

  return (
    <div style={{ 
      fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#bfe3e6', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px'
    }}>
      
      <div style={{
        backgroundColor: 'white', width: '550px', padding: '30px 40px', borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', boxSizing: 'border-box'
      }}>
        
        <h2 style={{ color: '#0f2c59', margin: '0 0 25px 0', fontSize: '26px', fontWeight: '800', textAlign: 'center' }}>
          Complete Recruiter Profile
        </h2>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Logo Section */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px' }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#f1f5f9',
                border: '3px solid #0f2c59', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {companyLogo ? (
                  <img src={companyLogo} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '35px', color: '#64748b' }}>🏢</span>
                )}
              </div>
              <label style={{
                position: 'absolute', bottom: '2px', right: '2px', backgroundColor: '#0f2c59',
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold',
                cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', border: '2px solid white'
              }}>
                +
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Company Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Company Name</label>
            <input 
              id="companyNameInput"
              type="text" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, 'emailInput')}
              placeholder="e.g., Tech Mahindra, Google" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {/* Official Work Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Official Work Email</label>
            <input 
              id="emailInput"
              type="email" 
              value={officialEmail} 
              onChange={(e) => setOfficialEmail(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, 'designationInput')}
              placeholder="hr@company.com" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {/* Recruiter Designation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Recruiter Designation</label>
            <input 
              id="designationInput"
              type="text" 
              value={designation} 
              onChange={(e) => setDesignation(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, 'websiteInput')}
              placeholder="e.g., HR Executive, Talent Acquisition Manager" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {/* Company Website (Optional) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Company Website (Optional)</label>
            <input 
              id="websiteInput"
              type="url" 
              value={website} 
              onChange={(e) => setWebsite(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, 'aboutCompanyInput')}
              placeholder="https://www.company.com" 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {/* About Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>About Company</label>
              <span style={{ fontSize: '12px', color: aboutCompany.length >= 10 && aboutCompany.length <= 500 ? 'green' : '#64748b' }}>
                {aboutCompany.length} / 500 chars (Min 10)
              </span>
            </div>
            <textarea 
              id="aboutCompanyInput"
              rows="4" 
              value={aboutCompany} 
              onChange={(e) => setAboutCompany(e.target.value)}
              placeholder="Briefly describe your company's domain, culture, and products (Min 10 characters)..." 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', resize: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={!isFormValid}
            style={{ 
              padding: '14px', 
              backgroundColor: isFormValid ? '#0f2c59' : '#cbd5e1', 
              color: isFormValid ? 'white' : '#94a3b8', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: isFormValid ? 'pointer' : 'not-allowed', 
              marginTop: '10px', 
              boxShadow: isFormValid ? '0 4px 6px rgba(15, 44, 89, 0.2)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            Save Details
          </button>
        </form>

        {successMessage && (
          <div style={{ 
            marginTop: '20px', padding: '12px', backgroundColor: '#dcfce7', 
            color: '#15803d', borderRadius: '8px', fontSize: '14px', 
            fontWeight: '600', textAlign: 'center', border: '1px solid #bbf7d0' 
          }}>
            {successMessage}
          </div>
        )}

      </div>
    </div>
  );
}

export default RecruiterProfile;