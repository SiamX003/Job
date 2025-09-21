// Profile.js
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import API from './api';

function Profile() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'recruiter') {
      fetchMyJobs();
    }
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      setLoadingJobs(true);
      setError('');
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token missing. Please log in again.');
        return;
      }

      const res = await API.get('/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure backend sends postedBy properly
      const myJobs = res.data.filter((job) => job.postedBy?._id === user?.id);
      setJobs(myJobs);
    } catch (err) {
      console.error('❌ Failed to fetch jobs', err);
      setError('Failed to load your jobs. Please try again later.');
    } finally {
      setLoadingJobs(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Profile</h1>

      <div style={{ marginBottom: '2rem' }}>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>

      {user?.role === 'recruiter' && (
        <div>
          <h2>My Job Postings</h2>

          {loadingJobs && <p>Loading jobs...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {!loadingJobs && !error && jobs.length === 0 && (
            <p>You haven&apos;t posted any jobs yet.</p>
          )}

          {!loadingJobs && !error && jobs.length > 0 && (
            <ul>
              {jobs.map((job) => (
                <li key={job._id}>
                  <strong>{job.title}</strong> — {job.company} ({job.location})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
