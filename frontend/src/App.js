
// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { AuthProvider, useAuth } from './AuthContext';

// import CreateJob from "./CreateJob";

// import Jobs from "./Jobs";


// import Register from './Register';

// import Login from './Login';

// import Home from './home';

// import Contact from './Contact';

// import Profile from "./Profile";

// import MyApplications from "./MyApplications";
import React, { useState, useEffect } from 'react'; 
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import API from './api';   // ⬅️ this fixes the API not defined error

import CreateJob from "./CreateJob";
import Jobs from "./Jobs";
import Register from './Register';
import Login from './Login';
import Home from './home';  // check filename case!
import Contact from './Contact';
import Profile from "./Profile";
import MyApplications from "./MyApplications";



// New component for managing job applications (for recruiters)
const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { jobId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchJobApplications();
  }, [jobId]);

  const fetchJobApplications = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/applications/job/${jobId}`);
      setApplications(response.data.applications || response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status, notes = '') => {
    try {
      await API.put(`/applications/${applicationId}/status`, { status, notes });
      await fetchJobApplications(); // Refresh the list
      alert('Application status updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return '#007bff';
      case 'reviewed': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading applications...</div>;
  
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchJobApplications}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Job Applications</h1>
        <Link to="/profile" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Profile</Link>
      </div>

      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No applications received for this job yet.</p>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            {applications.length} application{applications.length !== 1 ? 's' : ''} received
          </p>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {applications.map((application) => (
              <div
                key={application._id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>
                      {application.candidateId?.name || 'Name Not Available'}
                    </h3>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                      {application.candidateId?.email || 'Email Not Available'}
                    </p>
                    <p style={{ margin: '0', color: '#888', fontSize: '0.9rem' }}>
                      Applied on {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    style={{
                      backgroundColor: getStatusColor(application.status),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}
                  >
                    {application.status}
                  </span>
                </div>

                {application.coverLetter && (
                  <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Cover Letter:</h4>
                    <p style={{ margin: '0', fontSize: '0.9rem' }}>{application.coverLetter}</p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {(application.resumeLink || application.candidateId?.resumeLink) && (
                      <a 
                        href={application.resumeLink || application.candidateId?.resumeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          color: '#007bff',
                          textDecoration: 'none',
                          padding: '0.5rem 1rem',
                          border: '1px solid #007bff',
                          borderRadius: '4px',
                          fontSize: '0.85rem'
                        }}
                      >
                        📄 View Resume
                      </a>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {application.status !== 'accepted' && application.status !== 'rejected' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(application._id, 'reviewed')}
                          style={{
                            backgroundColor: '#ffc107',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          Mark as Reviewed
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(application._id, 'accepted')}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(application._id, 'rejected')}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {application.notes && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#856404' }}>Recruiter Notes:</h4>
                    <p style={{ margin: '0', fontSize: '0.9rem', color: '#856404' }}>{application.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/jobs" style={{ marginRight: '1rem' }}>Jobs</Link>

      {!isAuthenticated ? (
        <>
          <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        </>
      ) : (
        <>
          <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
          {user?.role === 'candidate' && (
            <Link to="/my-applications" style={{ marginRight: '1rem' }}>My Applications</Link>
          )}
          {user?.role === 'recruiter' && (
            <Link to="/create-job" style={{ marginRight: '1rem' }}>Create Job</Link>
          )}
          <button
            onClick={logout}
            style={{
              marginLeft: '1rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Logout ({user?.name})
          </button>
        </>
      )}
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />

        <div style={{ padding: '0 2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/applications/job/:jobId" element={<JobApplications />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { AuthProvider, useAuth } from './AuthContext';

// import CreateJob from "./CreateJob";
// import Jobs from "./Jobs";
// import Register from './Register';
// import Login from './Login';
// import Home from './home';
// import Contact from './Contact';
// import Profile from "./Profile";

// // Navigation Component
// const Navigation = () => {
//   const { isAuthenticated, user, logout } = useAuth();

//   return (
//     <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
//       <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>

//       {!isAuthenticated ? (
//         <>
//           <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
//           <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
//         </>
//       ) : (
//         <>
//           <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
//           {user?.role === 'recruiter' && (
//             <Link to="/create-job" style={{ marginRight: '1rem' }}>Create Job</Link>
//           )}
//           <button
//             onClick={logout}
//             style={{
//               marginLeft: '1rem',
//               cursor: 'pointer',
//               padding: '0.25rem 0.5rem',
//               backgroundColor: '#dc3545',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px'
//             }}
//           >
//             Logout ({user?.name})
//           </button>
//         </>
//       )}
//     </nav>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navigation />

//         <div style={{ padding: '0 2rem' }}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/create-job" element={<CreateJob />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/jobs" element={<Jobs />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
// App.js - Updated with application routes
