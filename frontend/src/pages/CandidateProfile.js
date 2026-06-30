import React, { useState, useEffect, useRef } from 'react';

function CandidateProfile({ setCurrentPage, userProfile, setUserProfile }) {
  const [profileImage, setProfileImage] = useState(null);
  
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [experienceType, setExperienceType] = useState(userProfile?.experienceStatus === 'Experienced' ? 'experienced' : 'fresher'); 
  const [experienceYears, setExperienceYears] = useState('');
  const [headline, setHeadline] = useState(userProfile?.headline || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [about, setAbout] = useState(userProfile?.aboutMe || '');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // References for handling focus traversal via Enter key
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const headlineRef = useRef(null);
  const aboutRef = useRef(null);

  // Focus traversal function to intercept Enter key press
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents accidental form submission
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  // Form Validation Check
  useEffect(() => {
    const isNameAdded = fullName.trim() !== '';
    const isEmailAdded = email.trim() !== '';
    const isPhoneAdded = phone.trim() !== '';
    const isHeadlineAdded = headline.trim() !== '';
    const isAboutValid = about.trim().length >= 10 && about.trim().length <= 500; 
    
    let isExpValid = false;
    if (experienceType === 'fresher') isExpValid = true;
    if (experienceType === 'experienced' && experienceYears !== '') isExpValid = true;

    if (isNameAdded && isEmailAdded && isPhoneAdded && isHeadlineAdded && isAboutValid && isExpValid) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [fullName, email, phone, headline, experienceType, experienceYears, about]);

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setUserProfile({
      ...userProfile,
      fullName: fullName,
      email: email,
      phone: phone,
      headline: headline,
      experienceStatus: experienceType === 'fresher' ? 'Fresher' : 'Experienced',
      experienceYears: experienceType === 'fresher' ? '1' : experienceYears,
      aboutMe: about
    });

    setSuccessMessage('Your profile saved successfully and you are directed to dashboard...');
    
    setTimeout(() => {
      setCurrentPage('dashboard-candidate');
    }, 2500);
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
          Complete Your Profile
        </h2>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Profile Image Component */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ position: 'relative', width: '110px', height: '110px' }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#f1f5f9',
                border: '3px solid #0f2c59', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {profileImage ? (
                  <img src={profileImage} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '35px', color: '#64748b' }}>👤</span>
                )}
              </div>
              <label style={{
                position: 'absolute', bottom: '2px', right: '2px', backgroundColor: '#0f2c59',
                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: 'bold',
                cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', border: '2px solid white'
              }}>
                +
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Full Name</label>
            <input 
              type="text" 
              ref={nameRef}
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, emailRef)}
              placeholder="Enter your full name" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {/* Email Address */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Email Address</label>
            <input 
              type="email" 
              ref={emailRef}
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, phoneRef)}
              placeholder="Enter your email address" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {/* Phone Number */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Phone Number</label>
            <input 
              type="tel" 
              ref={phoneRef}
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, headlineRef)}
              placeholder="Enter your mobile number" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {/* Professional Headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Professional Headline</label>
            <input 
              type="text" 
              ref={headlineRef}
              value={headline} 
              onChange={(e) => setHeadline(e.target.value)} 
              onKeyDown={(e) => handleKeyDown(e, aboutRef)}
              placeholder="e.g., Full Stack Developer | Software Engineer" 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {/* Experience Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Experience Status</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ fontSize: '15px', color: '#334155', cursor: 'pointer' }}>
                <input type="radio" name="expType" value="fresher" checked={experienceType === 'fresher'} onChange={() => { setExperienceType('fresher'); setExperienceYears(''); }} style={{ marginRight: '6px' }} />
                Fresher
              </label>
              <label style={{ fontSize: '15px', color: '#334155', cursor: 'pointer' }}>
                <input type="radio" name="expType" value="experienced" checked={experienceType === 'experienced'} onChange={() => setExperienceType('experienced')} style={{ marginRight: '6px' }} />
                Experienced
              </label>
            </div>

            {experienceType === 'experienced' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                <select value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', backgroundColor: 'white' }}>
                  <option value="">Select Years of Experience</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="4">4 Years</option>
                  <option value="5+">5+ Years</option>
                </select>
              </div>
            )}
          </div>

          {/* About Me */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>About Me</label>
              <span style={{ fontSize: '12px', color: about.length >= 10 && about.length <= 500 ? 'green' : '#64748b' }}>
                {about.length} / 500 chars (Min 10)
              </span>
            </div>
            <textarea 
              rows="4" 
              ref={aboutRef}
              value={about} 
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell recruiters about your background, projects, and career goals..." 
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', resize: 'none' }}
            />
          </div>

          {/* Save Button */}
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

export default CandidateProfile;