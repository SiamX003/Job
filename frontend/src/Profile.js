// Profile.js
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import API from './api';

function Profile() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    if (user?.role === 'recruiter') {
      fetchMyJobs();
    }
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      setLoadingJobs(true);
      const token = localStorage.getItem('token');
      const res = await API.get('/jobs', { headers: { Authorization: `Bearer ${token}` } });
      // Filter only jobs posted by this user
      const myJobs = res.data.filter(job => job.postedBy._id === user.id);
      setJobs(myJobs);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
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
          {loadingJobs ? (
            <p>Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p>You haven't posted any jobs yet.</p>
          ) : (
            <ul>
              {jobs.map(job => (
                <li key={job._id}>
                  {job.title} - {job.company} ({job.location})
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
