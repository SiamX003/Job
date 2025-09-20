import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from './api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardStats();
      fetchUsers();
      fetchJobs();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const response = await API.get('/admin/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await API.get('/admin/jobs');
      setJobs(response.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await API.delete(`/admin/jobs/${jobId}`);
        fetchJobs();
      } catch (err) {
        console.error('Error deleting job:', err);
      }
    }
  };
  //addding it to solve dashboard issue
  if (!user) {
    return <div>Loading...</div>; // wait until user info is available
  }
  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e0e0e0' }}>
        <button onClick={() => setActiveTab('dashboard')}
          style={{ padding: '1rem', backgroundColor: activeTab === 'dashboard' ? '#007bff' : '#f8f9fa', color: activeTab === 'dashboard' ? 'white' : '#666', border: 'none', marginRight: '0.5rem', cursor: 'pointer' }}>
          Dashboard
        </button>
        <button onClick={() => setActiveTab('users')}
          style={{ padding: '1rem', backgroundColor: activeTab === 'users' ? '#007bff' : '#f8f9fa', color: activeTab === 'users' ? 'white' : '#666', border: 'none', marginRight: '0.5rem', cursor: 'pointer' }}>
          Users
        </button>
        <button onClick={() => setActiveTab('jobs')}
          style={{ padding: '1rem', backgroundColor: activeTab === 'jobs' ? '#007bff' : '#f8f9fa', color: activeTab === 'jobs' ? 'white' : '#666', border: 'none', cursor: 'pointer' }}>
          Jobs
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div>
          <h2>Statistics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3>{stats.totalJobs}</h3>
              <p>Total Jobs</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3>{stats.totalApplications}</h3>
              <p>Total Applications</p>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2>Manage Users</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{user.name}</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{user.email}</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{user.role}</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                    <button onClick={() => deleteUser(user._id)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          <h2>Manage Jobs</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Title</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Company</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Posted By</th>
                <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id}>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{job.title}</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{job.company}</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>{job.postedBy?.name || 'Unknown'}</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>
                    <button onClick={() => deleteJob(job._id)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;