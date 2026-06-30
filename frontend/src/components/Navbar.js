import React from 'react';

function Navbar({ setCurrentPage }) {
  return (
    <nav style={{ 
      padding: '15px 30px', 
      background: '#1e293b', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <h2 style={{ margin: 0, color: '#38bdf8' }}>ResuMatch AI</h2>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <button 
          onClick={() => setCurrentPage('candidate')} 
          style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: 'none' }}
        >
          Candidate Area
        </button>
        <button 
          onClick={() => setCurrentPage('recruiter')} 
          style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', border: 'none' }}
        >
          Recruiter Panel
        </button>
      </div>
    </nav>
  );
}

export default Navbar;