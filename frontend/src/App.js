import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import CandidateProfile from './pages/CandidateProfile';
import RecruiterProfile from './pages/RecruiterProfile';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard'; // ✅ Recruiter Dashboard Import
import JobApplications from './pages/JobApplications'; // Path apne folder ke hisab se check kar lein


function App() {
  // 1. Pages ki single state management
  const [currentPage, setCurrentPage] = useState('landing');
  
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    headline: "",
    experienceStatus: "",
    aboutMe: ""
  });
  // 3. 🆕 YEH CODE YAHAN PASTE KAREIN: Page load hote hi Flask backend se data layega
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/candidate/profile') 
      .then(response => response.json())
      .then(data => {
        if (data) {
          // Backend ke keys ko aapke state ke keys ke sath match kar rahe hain
          setUserProfile({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            headline: data.professionalHeadline || "", // Backend me professionalHeadline hai
            experienceStatus: data.experienceStatus || "Fresher",
            aboutMe: data.aboutMe || ""
          });
        }
      })
      .catch(err => console.error("Backend se profile data laane me error:", err));
  }, []);

  // ✅ Centralized state linked safely for Manage Jobs data stream
  const [jobs, setJobs] = useState([
    {
      id: 1,
      jobTitle: "Sample Frontend Developer",
      companyName: "Tech Solution Ltd",
      jobLocation: "Hyderabad, India",
      jobType: "Full-time",
      jobDescription: "Explain roles, duties...",
      requiredSkills: "React, Node.js, SQL",
      applicantStandard: "Experienced",
      experienceYears: "3",
      education: "B.Tech, MCA",
      requiredKeywords: "Python, React, SQL",
      minAtsScore: "70",
      datePosted: "2026-06-29",
      status: "Active",
      applicationsCount: 0
    }
  ]);

  return (
    <div className="App">
      {/* 2. Page Routing aur Conditions */}
      {currentPage === 'landing' && <LandingPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'auth' && <Auth setCurrentPage={setCurrentPage} />}
      
      {currentPage === 'candidate-profile' && (
        <CandidateProfile setCurrentPage={setCurrentPage} userProfile={userProfile} setUserProfile={setUserProfile} />
      )}
      
      {currentPage === 'dashboard-candidate' && (
        <CandidateDashboard setCurrentPage={setCurrentPage} userProfile={userProfile} setUserProfile={setUserProfile} />
      )}
      
      {currentPage === 'recruiter-profile' && <RecruiterProfile setCurrentPage={setCurrentPage} />}
      
      {/* ✅ RECRUITER DASHBOARD KI CONDITION YAHA ADD HO GAYI HAI */}
      {currentPage === 'recruiter-dashboard' && (
  <RecruiterDashboard 
    jobs={jobs} 
    setJobs={setJobs} 
    setCurrentPage={setCurrentPage} 
    userProfile={userProfile} 
    setUserProfile={setUserProfile} 
  />
)}
      {currentPage === 'job-applications' && (
        <JobApplications jobs={jobs} setJobs={setJobs} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === 'recruiter-profile' && (
  <RecruiterProfile userProfile={userProfile} setUserProfile={setUserProfile} />
)}
    </div>
  );
}

export default App;