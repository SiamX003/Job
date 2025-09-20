
// Jobs.js - Enhanced version of your existing Jobs page
import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API from "./api";
//import "../style.css";
import "boxicons/css/boxicons.min.css";

// Application Modal Component
const ApplyJobModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    resumeLink: '',
    coverLetter: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const applicationData = {
        jobId: job._id,
        resumeLink: formData.resumeLink.trim() || undefined,
        coverLetter: formData.coverLetter.trim() || undefined
      };

      await API.post('/applications', applicationData);
      
      if (onSuccess) onSuccess();
      onClose();
      
      // Reset form
      setFormData({ resumeLink: '', coverLetter: '' });
      
      alert('Application submitted successfully!');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content" style={{ maxWidth: '600px', margin: '5% auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Apply for {job.title}</h2>
          <span className="close" onClick={onClose} style={{ fontSize: '2rem', cursor: 'pointer' }}>
            &times;
          </span>
        </div>

        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>{job.company}</h4>
          <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
            <i className="bx bx-map"></i> {job.location || 'Location not specified'}
          </p>
          <p style={{ margin: '0', color: '#666' }}>
            <i className="bx bx-dollar-circle"></i> 
            {job.salaryMin && job.salaryMax 
              ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
              : 'Salary not specified'
            }
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="resumeLink" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Resume Link (Optional)
            </label>
            <input
              type="url"
              id="resumeLink"
              name="resumeLink"
              value={formData.resumeLink}
              onChange={handleChange}
              placeholder={user?.resumeLink ? `Default: ${user.resumeLink}` : "https://your-resume-link.com"}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              {user?.resumeLink 
                ? 'Leave empty to use your default resume link from profile'
                : 'Provide a link to your resume (Google Drive, Dropbox, etc.)'
              }
            </small>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="coverLetter" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={6}
              maxLength={2000}
              placeholder="Write a brief cover letter explaining why you're interested in this position..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
            <small style={{ color: '#666', fontSize: '0.85rem' }}>
              {formData.coverLetter.length}/2000 characters
            </small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                color: '#666',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              id="w-btn"
              style={{ fontSize: '1rem' }}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, onApply, showApplyButton }) => {
  const formatSalary = (min, max) => {
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Salary not specified';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '1.5rem',
      backgroundColor: 'white',
      margin: '1rem 0',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333', fontSize: '1.25rem' }}>
            {job.title}
          </h3>
          <p style={{ margin: '0', color: '#666', fontSize: '1rem', fontWeight: '500' }}>
            {job.company}
          </p>
        </div>
        <span style={{ 
          backgroundColor: job.jobType === 'full-time' ? '#28a745' : job.jobType === 'part-time' ? '#ffc107' : '#17a2b8',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}>
          {job.jobType?.replace('-', ' ') || 'Not specified'}
        </span>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.5rem 0', color: '#555', display: 'flex', alignItems: 'center' }}>
          <i className="bx bx-map" style={{ marginRight: '0.5rem', color: '#666' }}></i>
          {job.location || 'Location not specified'}
        </p>
        <p style={{ margin: '0 0 0.5rem 0', color: '#555', display: 'flex', alignItems: 'center' }}>
          <i className="bx bx-dollar-circle" style={{ marginRight: '0.5rem', color: '#666' }}></i>
          {formatSalary(job.salaryMin, job.salaryMax)}
        </p>
      </div>

      {job.description && (
        <p style={{ 
          margin: '0 0 1rem 0', 
          color: '#666', 
          fontSize: '0.9rem',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {job.description}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#888' }}>
          Posted {getTimeAgo(job.createdAt)}
        </span>
        
        {showApplyButton && (
          <button
            onClick={() => onApply(job)}
            id="w-btn"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

const Jobs = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  
  // Filters
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salaryMin: '',
    salaryMax: ''
  });

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/jobs');
      setJobs(response.data.jobs || response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchJobs();
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/jobs/search?q=${encodeURIComponent(searchQuery)}`);
      setJobs(response.data.jobs || response.data);
    } catch (err) {
      setError('Search failed');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    if (!isAuthenticated) {
      alert('Please login to apply for jobs');
      return;
    }
    
    if (user?.role !== 'candidate') {
      alert('Only candidates can apply for jobs');
      return;
    }

    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    // Optionally refresh jobs or show success message
    console.log('Application submitted successfully');
  };

  // Handle join form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsJoinModalOpen(false);
  };

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocation = !filters.location || 
      (job.location && job.location.toLowerCase().includes(filters.location.toLowerCase()));
    
    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
    
    const matchesSalaryMin = !filters.salaryMin || 
      (job.salaryMin && job.salaryMin >= parseInt(filters.salaryMin));
    
    const matchesSalaryMax = !filters.salaryMax || 
      (job.salaryMax && job.salaryMax <= parseInt(filters.salaryMax));

    return matchesSearch && matchesLocation && matchesJobType && matchesSalaryMin && matchesSalaryMax;
  });

  return (
    <div>
      {/* Header */}
      <header>
        <div id="navbar" className="obj-width">
          <a href="/">
            <img className="logo" src="/images/logo.png" alt="JobHunt" />
          </a>
          <ul id="menu">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/jobs">Browse</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            {isAuthenticated ? (
              <li>
                <a href="/profile">Profile</a>
              </li>
            ) : (
              <button id="w-btn" onClick={() => setIsJoinModalOpen(true)}>
                Join
              </button>
            )}
          </ul>
        </div>
      </header>

      {/* Jobs Section */}
      <section className="jobs sec-space obj-width">
        <h2>Jobs in Demand</h2>
        <p>Most viewed and all time top selling services</p>

        <form onSubmit={handleSearch}>
          <i className="bx bx-search-alt-2"></i>
          <input
            type="text"
            placeholder="Search Jobs"
            id="searchBar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" style={{ display: 'none' }}>Search</button>
        </form>

        {/* Filters */}
        <div style={{ 
          margin: '2rem 0', 
          padding: '1rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <input
            type="text"
            placeholder="Filter by location"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          
          <select
            value={filters.jobType}
            onChange={(e) => setFilters({...filters, jobType: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">All Job Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
          </select>
          
          <input
            type="number"
            placeholder="Min Salary"
            value={filters.salaryMin}
            onChange={(e) => setFilters({...filters, salaryMin: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          
          <input
            type="number"
            placeholder="Max Salary"
            value={filters.salaryMax}
            onChange={(e) => setFilters({...filters, salaryMax: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        {/* Job Results */}
        <div className="jobs-container" id="root">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading jobs...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
              <p>{error}</p>
              <button onClick={fetchJobs} id="w-btn">Try Again</button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No jobs found matching your criteria.</p>
              <button onClick={() => {
                setSearchQuery('');
                setFilters({ location: '', jobType: '', salaryMin: '', salaryMax: '' });
                fetchJobs();
              }} id="w-btn">
                Show All Jobs
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>
                {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
              </h3>
              {filteredJobs.map(job => (
                <JobCard 
                  key={job._id} 
                  job={job} 
                  onApply={handleApply}
                  showApplyButton={isAuthenticated && user?.role === 'candidate'}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="obj-width">
          <div className="top">
            <img className="logo" src="/images/logo.png" alt="Logo" />
            <div>
              <a
                href="https://www.facebook.com/profile.php?id=61579876076360"
                aria-label="Facebook"
              >
                <i className="bx bxl-facebook-square"></i>
              </a>
              <a href="https://x.com/i/lists/1959288678146294126" aria-label="Twitter">
                <i className="bx bxl-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com/jobhunter749?igsh=dThtb3ozdzVpZHlv"
                aria-label="Instagram"
              >
                <i className="bx bxl-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/ahnaf-hossain-3b4b2521b/"
                aria-label="LinkedIn"
              >
                <i className="bx bxl-linkedin-square"></i>
              </a>
            </div>
          </div>

          <div>
            <p>JobHunt is a global online platform for freelance services</p>
          </div>

          <div className="bottom">
            <div>
              <h3>Project</h3>
              <a href="#">Change log</a>
              <a href="#">Status</a>
              <a href="#">License</a>
              <a href="#">All versions</a>
            </div>
            <div>
              <h3>Community</h3>
              <a href="https://github.com">Github</a>
              <a href="#">Your Problems</a>
              <a href="https://twitter.com">Twitter</a>
              <a href="https://linkedin.com">LinkedIn</a>
            </div>
            <div>
              <h3>Help</h3>
              <a href="#">Support</a>
              <a href="#">Troubleshooting</a>
              <a href="#">Contact us</a>
              <a href="#">FAQ</a>
            </div>
            <div>
              <h3>Others</h3>
              <a href="#">Terms and services</a>
              <a href="#">Privacy</a>
              <a href="#">Licence</a>
              <a href="#">Cookie policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Join Modal */}
      {isJoinModalOpen && (
        <div id="joinModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsJoinModalOpen(false)}>
              &times;
            </span>
            <h2>Join JobHunt</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <button type="submit">Sign Up</button>
            </form>
          </div>
        </div>
      )}

      {/* Apply Job Modal */}
      {isApplyModalOpen && selectedJob && (
        <ApplyJobModal
          job={selectedJob}
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSelectedJob(null);
          }}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default Jobs;

// // Jobs.js
// import React, { useState, useEffect } from 'react';
// import API from './api';
// import { useAuth } from './AuthContext';

// function Jobs() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const response = await API.get('/jobs');
//       setJobs(response.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to fetch jobs');
//       console.error('Error fetching jobs:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteJob = async (jobId) => {
//     if (!window.confirm('Are you sure you want to delete this job?')) {
//       return;
//     }

//     try {
//       await API.delete(`/jobs/${jobId}`);
//       setJobs(jobs.filter(job => job._id !== jobId));
//       alert('Job deleted successfully');
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to delete job');
//     }
//   };

//   if (loading) {
//     return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading jobs...</div>;
//   }

//   if (error) {
//     return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>;
//   }

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
//         <h2>Available Jobs</h2>
//         <button onClick={fetchJobs} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
//           Refresh
//         </button>
//       </div>

//       {jobs.length === 0 ? (
//         <p style={{ textAlign: 'center', color: '#666' }}>No jobs available at the moment.</p>
//       ) : (
//         <div style={{ display: 'grid', gap: '1rem' }}>
//           {jobs.map(job => (
//             <div 
//               key={job._id} 
//               style={{ 
//                 border: '1px solid #ddd', 
//                 borderRadius: '8px', 
//                 padding: '1.5rem',
//                 backgroundColor: '#f9f9f9'
//               }}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                 <div style={{ flex: 1 }}>
//                   <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{job.title}</h3>
//                   <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontWeight: 'bold' }}>
//                     {job.company} - {job.location}
//                   </p>
//                   {job.salary && (
//                     <p style={{ margin: '0 0 0.5rem 0', color: '#28a745', fontWeight: 'bold' }}>
//                       {job.salary}
//                     </p>
//                   )}
//                   <p style={{ margin: '0 0 1rem 0', lineHeight: '1.5' }}>{job.description}</p>
                  
//                   {job.postedBy && (
//                     <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
//                       Posted by: {job.postedBy.name} ({job.postedBy.email})
//                     </p>
//                   )}
                  
//                   <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#999' }}>
//                     Posted on: {new Date(job.createdAt || job.updatedAt).toLocaleDateString()}
//                   </p>
//                 </div>

//                 {user?.role === 'recruiter' && user?.id === job.postedBy?._id && (
//                   <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
//                     <button
//                       onClick={() => deleteJob(job._id)}
//                       style={{
//                         padding: '0.5rem 1rem',
//                         backgroundColor: '#dc3545',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer',
//                         fontSize: '0.9rem'
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Jobs;