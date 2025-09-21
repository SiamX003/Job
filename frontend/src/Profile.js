// import React, { useEffect, useState } from 'react';
// import { useAuth } from './AuthContext';
// import API from './api';

// function Profile() {
//   const { user } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [loadingJobs, setLoadingJobs] = useState(true);
//   const [loadingApplications, setLoadingApplications] = useState(true);
//   const [activeTab, setActiveTab] = useState('profile');
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     if (user?.role === 'recruiter') {
//       fetchMyJobs();
//       fetchApplicationStats();
//     } else if (user?.role === 'candidate') {
//       fetchMyApplications();
//     }
//   }, [user]);

//   const fetchMyJobs = async () => {
//     try {
//       setLoadingJobs(true);
//       const token = localStorage.getItem('token');
//       const res = await API.get('/jobs', { headers: { Authorization: `Bearer ${token}` } });
//       // Filter only jobs posted by this user
//       const myJobs = res.data.filter(job => job.postedBy._id === user.id);
//       setJobs(myJobs);
//     } catch (err) {
//       console.error('Failed to fetch jobs', err);
//     } finally {
//       setLoadingJobs(false);
//     }
//   };

//   const fetchMyApplications = async () => {
//     try {
//       setLoadingApplications(true);
//       const res = await API.get('/applications/my-applications');
//       setApplications(res.data.applications || res.data);
//     } catch (err) {
//       console.error('Failed to fetch applications', err);
//     } finally {
//       setLoadingApplications(false);
//     }
//   };

//   const fetchApplicationStats = async () => {
//     try {
//       const res = await API.get('/applications/recruiter/stats');
//       setStats(res.data);
//     } catch (err) {
//       console.error('Failed to fetch stats', err);
//     }
//   };

//   const handleWithdrawApplication = async (applicationId) => {
//     if (!window.confirm('Are you sure you want to withdraw this application?')) {
//       return;
//     }

//     try {
//       await API.delete(`/applications/${applicationId}`);
//       await fetchMyApplications(); // Refresh the list
//       alert('Application withdrawn successfully');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to withdraw application');
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'applied': return '#007bff';
//       case 'reviewed': return '#ffc107';
//       case 'accepted': return '#28a745';
//       case 'rejected': return '#dc3545';
//       default: return '#6c757d';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const TabButton = ({ tabName, displayName, isActive, onClick }) => (
//     <button
//       onClick={() => onClick(tabName)}
//       style={{
//         padding: '0.75rem 1.5rem',
//         border: 'none',
//         backgroundColor: isActive ? '#007bff' : '#f8f9fa',
//         color: isActive ? 'white' : '#666',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         marginRight: '0.5rem',
//         fontWeight: isActive ? '600' : '400'
//       }}
//     >
//       {displayName}
//     </button>
//   );

//   return (
//     <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
//       <h1>Profile</h1>
      
//       {/* Tab Navigation */}
//       <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '1rem' }}>
//         <TabButton 
//           tabName="profile" 
//           displayName="Profile Info" 
//           isActive={activeTab === 'profile'} 
//           onClick={setActiveTab} 
//         />
//         {user?.role === 'candidate' && (
//           <TabButton 
//             tabName="applications" 
//             displayName="My Applications" 
//             isActive={activeTab === 'applications'} 
//             onClick={setActiveTab} 
//           />
//         )}
//         {user?.role === 'recruiter' && (
//           <>
//             <TabButton 
//               tabName="jobs" 
//               displayName="My Jobs" 
//               isActive={activeTab === 'jobs'} 
//               onClick={setActiveTab} 
//             />
//             <TabButton 
//               tabName="recruiter-applications" 
//               displayName="Job Applications" 
//               isActive={activeTab === 'recruiter-applications'} 
//               onClick={setActiveTab} 
//             />
//           </>
//         )}
//       </div>

//       {/* Profile Info Tab */}
//       {activeTab === 'profile' && (
//         <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
//           <h2>Profile Information</h2>
//           <div style={{ display: 'grid', gap: '1rem' }}>
//             <div>
//               <strong>Name:</strong> {user?.name}
//             </div>
//             <div>
//               <strong>Email:</strong> {user?.email}
//             </div>
//             <div>
//               <strong>Role:</strong> {user?.role}
//             </div>
//             {user?.resumeLink && (
//               <div>
//                 <strong>Resume:</strong> 
//                 <a 
//                   href={user.resumeLink} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   style={{ marginLeft: '0.5rem', color: '#007bff', textDecoration: 'none' }}
//                 >
//                   📄 View Resume
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Candidate Applications Tab */}
//       {activeTab === 'applications' && user?.role === 'candidate' && (
//         <div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//             <h2>My Applications</h2>
//             <span style={{ color: '#666' }}>
//               Total: {applications.length}
//             </span>
//           </div>

//           {loadingApplications ? (
//             <div style={{ textAlign: 'center', padding: '2rem' }}>Loading applications...</div>
//           ) : applications.length === 0 ? (
//             <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//               <p>You haven't applied for any jobs yet.</p>
//               <p style={{ color: '#666' }}>Start applying to see your applications here!</p>
//               <a href="/jobs" style={{ color: '#007bff', textDecoration: 'none' }}>Browse Jobs →</a>
//             </div>
//           ) : (
//             <div style={{ display: 'grid', gap: '1rem' }}>
//               {applications.map((application) => (
//                 <div
//                   key={application._id}
//                   style={{
//                     border: '1px solid #e0e0e0',
//                     borderRadius: '8px',
//                     padding: '1.5rem',
//                     backgroundColor: 'white'
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
//                     <div>
//                       <h3 style={{ margin: '0 0 0.5rem 0' }}>
//                         {application.jobId?.title || 'Job Title Not Available'}
//                       </h3>
//                       <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
//                         {application.jobId?.company || 'Company Not Available'}
//                       </p>
//                       <p style={{ margin: '0', color: '#888', fontSize: '0.9rem' }}>
//                         Applied on {formatDate(application.createdAt)}
//                       </p>
//                     </div>
//                     <span
//                       style={{
//                         backgroundColor: getStatusColor(application.status),
//                         color: 'white',
//                         padding: '0.25rem 0.75rem',
//                         borderRadius: '12px',
//                         fontSize: '0.85rem',
//                         fontWeight: '500',
//                         textTransform: 'capitalize'
//                       }}
//                     >
//                       {application.status}
//                     </span>
//                   </div>

//                   {application.coverLetter && (
//                     <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
//                       <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>Cover Letter:</h4>
//                       <p style={{ margin: '0', fontSize: '0.9rem' }}>{application.coverLetter}</p>
//                     </div>
//                   )}

//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div style={{ fontSize: '0.9rem', color: '#666' }}>
//                       {application.resumeLink && (
//                         <a 
//                           href={application.resumeLink} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           style={{ color: '#007bff', textDecoration: 'none' }}
//                         >
//                           📄 View Resume
//                         </a>
//                       )}
//                     </div>
                    
//                     {(application.status === 'applied' || application.status === 'reviewed') && (
//                       <button
//                         onClick={() => handleWithdrawApplication(application._id)}
//                         style={{
//                           backgroundColor: '#dc3545',
//                           color: 'white',
//                           border: 'none',
//                           padding: '0.5rem 1rem',
//                           borderRadius: '4px',
//                           cursor: 'pointer',
//                           fontSize: '0.85rem'
//                         }}
//                       >
//                         Withdraw
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Recruiter Jobs Tab */}
//       {activeTab === 'jobs' && user?.role === 'recruiter' && (
//         <div>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//             <h2>My Job Postings</h2>
//             <div>
//               <a href="/create-job" style={{ 
//                 backgroundColor: '#007bff', 
//                 color: 'white', 
//                 padding: '0.5rem 1rem', 
//                 borderRadius: '4px', 
//                 textDecoration: 'none' 
//               }}>
//                 + Post New Job
//               </a>
//             </div>
//           </div>

//           {loadingJobs ? (
//             <div style={{ textAlign: 'center', padding: '2rem' }}>Loading jobs...</div>
//           ) : jobs.length === 0 ? (
//             <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//               <p>You haven't posted any jobs yet.</p>
//               <a href="/create-job" style={{ color: '#007bff', textDecoration: 'none' }}>Post Your First Job →</a>
//             </div>
//           ) : (
//             <div style={{ display: 'grid', gap: '1rem' }}>
//               {jobs.map(job => (
//                 <div 
//                   key={job._id}
//                   style={{
//                     border: '1px solid #e0e0e0',
//                     borderRadius: '8px',
//                     padding: '1.5rem',
//                     backgroundColor: 'white'
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                     <div>
//                       <h3 style={{ margin: '0 0 0.5rem 0' }}>{job.title}</h3>
//                       <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
//                         {job.company} • {job.location}
//                       </p>
//                       <p style={{ margin: '0', color: '#888', fontSize: '0.9rem' }}>
//                         Posted on {formatDate(job.createdAt)}
//                       </p>
//                     </div>
//                     <span style={{
//                       backgroundColor: job.jobType === 'full-time' ? '#28a745' : '#ffc107',
//                       color: 'white',
//                       padding: '0.25rem 0.5rem',
//                       borderRadius: '12px',
//                       fontSize: '0.75rem',
//                       textTransform: 'uppercase'
//                     }}>
//                       {job.jobType}
//                     </span>
//                   </div>
                  
//                   <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
//                     <button
//                       onClick={() => window.location.href = `/applications/job/${job._id}`}
//                       style={{
//                         backgroundColor: '#17a2b8',
//                         color: 'white',
//                         border: 'none',
//                         padding: '0.5rem 1rem',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         fontSize: '0.85rem'
//                       }}
//                     >
//                       View Applications
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Recruiter Applications Tab */}
//       {activeTab === 'recruiter-applications' && user?.role === 'recruiter' && (
//         <div>
//           <h2>Job Applications Overview</h2>
          
//           {stats && (
//             <div style={{ 
//               display: 'grid', 
//               gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
//               gap: '1rem', 
//               marginBottom: '2rem' 
//             }}>
//               <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
//                 <h3 style={{ margin: '0', color: '#007bff' }}>{stats.totalApplications || 0}</h3>
//                 <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>Total Applications</p>
//               </div>
//               {stats.breakdown && stats.breakdown.map(stat => (
//                 <div key={stat.status} style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
//                   <h3 style={{ margin: '0', color: getStatusColor(stat.status) }}>{stat.count}</h3>
//                   <p style={{ margin: '0.5rem 0 0 0', color: '#666', textTransform: 'capitalize' }}>{stat.status}</p>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//             <p>Select a specific job from "My Jobs" tab to view and manage applications.</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import API from './api';
import './Profile.css'; // We'll use a separate CSS file for elegance

function Profile() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === 'recruiter') {
      fetchMyJobs();
      fetchApplicationStats();
    } else if (user?.role === 'candidate') {
      fetchMyApplications();
    }
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      setLoadingJobs(true);
      const token = localStorage.getItem('token');
      const res = await API.get('/jobs', { headers: { Authorization: `Bearer ${token}` } });
      const myJobs = res.data.filter(job => job.postedBy._id === user.id);
      setJobs(myJobs);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      setLoadingApplications(true);
      const res = await API.get('/applications/my-applications');
      setApplications(res.data.applications || res.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoadingApplications(false);
    }
  };

  const fetchApplicationStats = async () => {
    try {
      const res = await API.get('/applications/recruiter/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await API.delete(`/applications/${applicationId}`);
      await fetchMyApplications();
      alert('Application withdrawn successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
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

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const TabButton = ({ tabName, displayName }) => (
    <button
      className={`tab-btn ${activeTab === tabName ? 'active' : ''}`}
      onClick={() => setActiveTab(tabName)}
    >
      {displayName}
    </button>
  );

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>

      <div className="tab-navigation">
        <TabButton tabName="profile" displayName="Profile Info" />
        {user?.role === 'candidate' && <TabButton tabName="applications" displayName="My Applications" />}
        {user?.role === 'recruiter' && <>
          <TabButton tabName="jobs" displayName="My Jobs" />
          <TabButton tabName="recruiter-applications" displayName="Job Applications" />
        </>}
      </div>

      {activeTab === 'profile' && (
        <div className="card profile-card">
          <h2>Profile Information</h2>
          <div className="profile-info">
            <div><strong>Name:</strong> {user?.name}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Role:</strong> {user?.role}</div>
            {user?.resumeLink && (
              <div>
                <strong>Resume:</strong> 
                <a href={user.resumeLink} target="_blank" rel="noopener noreferrer" className="resume-link">
                  📄 View Resume
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'applications' && user?.role === 'candidate' && (
        <div>
          <div className="tab-header">
            <h2>My Applications</h2>
            <span>Total: {applications.length}</span>
          </div>

          {loadingApplications ? (
            <div className="loading">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <p>You haven't applied for any jobs yet.</p>
              <p>Start applying to see your applications here!</p>
              <a href="/jobs" className="browse-jobs-link">Browse Jobs →</a>
            </div>
          ) : (
            <div className="grid-list">
              {applications.map(app => (
                <div key={app._id} className="card application-card">
                  <div className="card-header">
                    <div>
                      <h3>{app.jobId?.title || 'Job Title Not Available'}</h3>
                      <p>{app.jobId?.company || 'Company Not Available'}</p>
                      <p className="applied-date">Applied on {formatDate(app.createdAt)}</p>
                    </div>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(app.status) }}>
                      {app.status}
                    </span>
                  </div>

                  {app.coverLetter && (
                    <div className="cover-letter">
                      <h4>Cover Letter:</h4>
                      <p>{app.coverLetter}</p>
                    </div>
                  )}

                  <div className="card-footer">
                    {app.resumeLink && (
                      <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="resume-link">
                        📄 View Resume
                      </a>
                    )}
                    {(app.status === 'applied' || app.status === 'reviewed') && (
                      <button className="btn-withdraw" onClick={() => handleWithdrawApplication(app._id)}>Withdraw</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'jobs' && user?.role === 'recruiter' && (
        <div>
          <div className="tab-header">
            <h2>My Job Postings</h2>
            <a href="/create-job" className="btn-primary">+ Post New Job</a>
          </div>

          {loadingJobs ? (
            <div className="loading">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <p>You haven't posted any jobs yet.</p>
              <a href="/create-job" className="browse-jobs-link">Post Your First Job →</a>
            </div>
          ) : (
            <div className="grid-list">
              {jobs.map(job => (
                <div key={job._id} className="card job-card">
                  <div className="card-header">
                    <div>
                      <h3>{job.title}</h3>
                      <p>{job.company} • {job.location}</p>
                      <p className="applied-date">Posted on {formatDate(job.createdAt)}</p>
                    </div>
                    <span className={`job-type-badge ${job.type}`}>{job.type}</span>
                  </div>
                  <div className="card-footer">
                    <button className="btn-info" onClick={() => window.location.href = `/applications/job/${job._id}`}>
                      View Applications
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'recruiter-applications' && user?.role === 'recruiter' && (
        <div>
          <h2>Job Applications Overview</h2>
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="stat-number">{stats.totalApplications || 0}</h3>
                <p>Total Applications</p>
              </div>
              {stats.breakdown?.map(stat => (
                <div key={stat.status} className="stat-card">
                  <h3 className="stat-number" style={{ color: getStatusColor(stat.status) }}>{stat.count}</h3>
                  <p>{stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}</p>
                </div>
              ))}
            </div>
          )}
          <div className="empty-state">
            <p>Select a specific job from "My Jobs" tab to view and manage applications.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
