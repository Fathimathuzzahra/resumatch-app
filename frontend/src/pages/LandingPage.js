import React from 'react';

function LandingPage({ setCurrentPage }) {
  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      minHeight: '100vh', 
      backgroundColor: '#bfe3e6', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 20px', // Left aur right ka extra space bilkul kam kar diya
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      
      {/* LEFT SIDE: Content Area (Iska margin left badal kar gap theek kiya) */}
      <div style={{ 
        maxWidth: '650px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '25px',
        marginLeft: '15px' // Logo aur content ko screen ke edge ke paas lane ke liye
      }}>
        
        {/* Logo Badge Container */}
        <div style={{ 
          backgroundColor: '#e2f5f7', 
          width: '260px',          // Aapne jo width badhane ko kaha
          height: '65px',          // Height bhi thodi badha di
          borderRadius: '15px', 
          display: 'flex',         // Isse andar ki cheezein align hongi
          alignItems: 'center', 
          justifyContent: 'center', // Text aur icon ko perfectly center karne ke liye
          gap: '15px',             // Logo aur text ke beech ka gap
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          {/* RM Icon (Iska size bhi badha diya taaki naye width/height me fit lage) */}
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
            fontSize: '16px'       // Font thoda bada kiya
          }}>
            RM
          </div>
          {/* Logo Text Block */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 'bold', color: '#0f2c59', fontSize: '20px', lineHeight: '1.1' }}>ResuMatch</span>
            <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>AI-Driven Applicant Tracking</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 style={{ 
          fontSize: '44px', 
          color: '#0f2c59', 
          lineHeight: '1.2', 
          margin: 0,
          fontWeight: '800'
        }}>
          AI-Driven<br />
          <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Applicant Tracking<br /> System</span>
        </h1>

        {/* Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <p style={{ color: '#0f2c59', fontSize: '16px', margin: 0, fontWeight: '600' }}>
            Advanced Matching Platform
          </p>
          <p style={{ color: '#334155', fontSize: '14px', margin: 0, opacity: 0.8 }}>
            <b>Bridging gap between Talent and Opportunity</b>
          </p>
        </div>
        
        {/* Get Started Button */}
        <button 
          onClick={() => setCurrentPage('auth')} 
          style={{ 
            padding: '12px 35px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: 'white', 
            backgroundColor: '#0f2c59', 
            border: 'none', 
            borderRadius: '25px', 
            cursor: 'pointer',
            width: 'fit-content',
            boxShadow: '0 4px 10px rgba(15, 44, 89, 0.3)',
            marginTop: '10px'
          }}
        >
          Get Started
        </button>
      </div>

      {/* RIGHT SIDE: Dashboard Preview Card */}
      <div style={{
        backgroundColor: '#1b3b6f',
        width: '460px',
        height: '290px',
        borderRadius: '20px',
        padding: '25px',
        boxSizing: 'border-box',
        color: 'white',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginRight: '15px'
      }}>
        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', opacity: 0.9 }}>Matched Candidates</span>
          <span style={{ fontSize: '10px', color: '#38bdf8', cursor: 'pointer' }}>See All Fleet</span>
        </div>

        {/* Progress Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginTop: '10px' }}>
          <div style={{ 
            width: '65px', 
            height: '65px', 
            borderRadius: '50%', 
            border: '4px solid #38bdf8', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            81%
          </div>
          {/* Wave/Bar Indicator */}
          <div style={{ flex: 1, height: '35px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '35%', height: '12px', backgroundColor: '#2563eb', borderRadius: '4px' }}></div>
            <div style={{ width: '40%', height: '24px', backgroundColor: '#dc2626', borderRadius: '4px' }}></div>
            <div style={{ width: '25%', height: '12px', backgroundColor: '#2563eb', borderRadius: '4px' }}></div>
          </div>
        </div>

        {/* Candidate List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            <span style={{ opacity: 0.9 }}>👤 John Doe</span>
            <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>85 %</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ opacity: 0.9 }}>👤 Jane Smith</span>
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>78 %</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default LandingPage;