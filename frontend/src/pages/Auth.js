import React, { useState } from 'react';

function Auth({ setCurrentPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('candidate');
  
  // 🟢 BACKEND CONNECTION KE LIYE STATES
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Sign Up validation: password match check karna
    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Backend URL (Flask default port 5000 par chalta hai)
    const endpoint = isLogin ? 'http://127.0.0.1:5000/api/login' : 'http://127.0.0.1:5000/api/signup';
    
    // Jo data backend ko bhejna hai
    const payload = isLogin 
      ? { email, password, role } 
      : { name, email, password, role };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message); // Success message dikhane ke liye

        // 🟢 BACKEND STATUS KE HISAB SE REDIRECTION
        if (role === 'candidate') {
          if (!isLogin) {
            setCurrentPage('candidate-profile');
          } else {
            setCurrentPage('dashboard-candidate');
          }
        } else if (role === 'recruiter') {
          if (!isLogin) {
            setCurrentPage('recruiter-profile');
          } else {
            setCurrentPage('recruiter-dashboard');
          }
        }
      } else {
        // Agar backend se koi error aata hai (jaise wrong password ya email already exists)
        alert(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Cannot connect to Flask server. Make sure it is running!");
    }
  };

  return (
    <div style={{ 
      fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#bfe3e6', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      
      <div style={{
        backgroundColor: 'white', width: '420px', padding: '20px 30px 35px 30px',
        borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', boxSizing: 'border-box'
      }}>
        
        <h2 style={{ textAlign: 'center', color: '#0f2c59', margin: '0 0 5px 0', fontSize: '28px', fontWeight: '800' }}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', margin: '0 0 20px 0' }}>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <span 
                onClick={() => setIsLogin(false)} 
                style={{ color: '#0f2c59', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Register here
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span 
                onClick={() => setIsLogin(true)} 
                style={{ color: '#0f2c59', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
              >
                SignIn here
              </span>
            </>
          )}
        </p>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#e2f5f7', borderRadius: '10px', padding: '5px', marginBottom: '25px' }}>
          <button 
            type="button"
            onClick={() => setRole('candidate')}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
              backgroundColor: role === 'candidate' ? '#0f2c59' : 'transparent',
              color: role === 'candidate' ? 'white' : '#0f2c59', transition: 'all 0.3s'
            }}
          >
            Job Applicant
          </button>
          <button 
            type="button"
            onClick={() => setRole('recruiter')}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
              backgroundColor: role === 'recruiter' ? '#0f2c59' : 'transparent',
              color: role === 'recruiter' ? 'white' : '#0f2c59', transition: 'all 0.3s'
            }}
          >
            Recruiter
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Register Fields */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="example@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
            />
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '14px', color: '#334155', fontWeight: '600' }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }} 
              />
            </div>
          )}

          <button 
            type="submit" 
            style={{ 
              padding: '14px', backgroundColor: '#0f2c59', color: 'white', border: 'none', borderRadius: '8px', 
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px rgba(15, 44, 89, 0.2)' 
            }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Auth;