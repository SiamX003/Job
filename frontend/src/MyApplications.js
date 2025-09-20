// MyApplications.js - Standalone component for candidates to view their applications
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from './api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const response = await API.get('/applications/my-applications');
      setApplications(response.data.applications || response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    try {
      await API.delete(`/applications/${applicationId}`);
      await fetchMyApplications(); // Refresh the list
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

  const getStatusMessage = (status) => {
    switch (status) {
      case 'applied': return 'Your application has been submitted and is waiting for review.';
      case 'reviewed': return 'Your application is being reviewed by the recruiter.';
      case 'accepted': return 'Congratulations! Your application has been accepted.';
      case 'rejected': return 'Unfortunately, your application was not selected.';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredApplications = statusFilter 
    ? applications.filter(app => app.status === statusFilter)
    : applications;

  // Group applications by status for stats
  const statusStats = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 2s linear infinite',
          margin: '0 auto'
        }}></div>
        <p style={{ marginTop: '1rem' }}>Loading your applications...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>My Applications</h1>
        <p style={{ margin: '0', color: '#666' }}>
          Track the status of all your job applications
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ margin: '0', color: '#007bff', fontSize: '2rem' }}>
            {applications.length}
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>
            Total Applications
          </p>
        </div>
        
        {Object.entries(statusStats).map(([status, count]) => (
          <div key={status} style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #e9ecef'
          }}>
            <h2 style={{ margin: '0', color: getStatusColor(status), fontSize: '2rem' }}>
              {count}
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem', textTransform: 'capitalize' }}>
              {status}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <label htmlFor="statusFilter" style={{ marginRight: '0.5rem', fontWeight: '500' }}>
            Filter by status:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '0.9rem'
            }}
          >
            <option value="">All Status</option>
            <option value="applied">Applied</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            Showing {filteredApplications.length} of {applications.length} applications
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={fetchMyApplications}
            style={{
              marginLeft: '1rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          {applications.length === 0 ? (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>No Applications Yet</h3>
              <p style={{ margin: '0 0 2rem 0', color: '#888' }}>
                You haven't applied for any jobs yet. Start your job search now!
              </p>
              <a 
                href="/jobs"
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Browse Jobs
              </a>
            </>
          ) : (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ margin: '0 0 1rem 0', color: '#666' }}>No Applications Found</h3>
              <p style={{ margin: '0', color: '#888' }}>
                No applications match the selected filter.
              </p>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {filteredApplications.map((application) => (
            <div
              key={application._id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '2rem',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              {/* Application Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#333' }}>
                    {application.jobId?.title || 'Job Title Not Available'}
                  </h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '1rem', fontWeight: '500' }}>
                    {application.jobId?.company || 'Company Not Available'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <p style={{ margin: '0', color: '#888', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                      <i className="bx bx-calendar" style={{ marginRight: '0.25rem' }}></i>
                      Applied on {formatDate(application.createdAt)}
                    </p>
                    {application.jobId?.location && (
                      <p style={{ margin: '0', color: '#888', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                        <i className="bx bx-map" style={{ marginRight: '0.25rem' }}></i>
                        {application.jobId.location}
                      </p>
                    )}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      backgroundColor: getStatusColor(application.status),
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                      display: 'inline-block',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {application.status}
                  </span>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.8rem', maxWidth: '200px' }}>
                    {getStatusMessage(application.status)}
                  </p>
                </div>
              </div>

              {/* Cover Letter */}
              {application.coverLetter && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <h4 style={{
                    margin: '0 0 0.75rem 0',
                    fontSize: '0.95rem',
                    color: '#495057',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="bx bx-message-detail" style={{ marginRight: '0.5rem' }}></i>
                    Cover Letter
                  </h4>
                  <p style={{
                    margin: '0',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#495057'
                  }}>
                    {application.coverLetter}
                  </p>
                </div>
              )}

              {/* Recruiter Notes */}
              {application.notes && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#fff3cd',
                  borderRadius: '6px',
                  border: '1px solid #ffeaa7'
                }}>
                  <h4 style={{
                    margin: '0 0 0.75rem 0',
                    fontSize: '0.95rem',
                    color: '#856404',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="bx bx-note" style={{ marginRight: '0.5rem' }}></i>
                    Recruiter Notes
                  </h4>
                  <p style={{
                    margin: '0',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#856404'
                  }}>
                    {application.notes}
                  </p>
                </div>
              )}

              {/* Action Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #e9ecef',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {(application.resumeLink || user?.resumeLink) && (
                    <a 
                      href={application.resumeLink || user?.resumeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem 1rem',
                        border: '1px solid #007bff',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#007bff';
                      }}
                    >
                      <i className="bx bx-file" style={{ marginRight: '0.5rem' }}></i>
                      View Resume
                    </a>
                  )}
                  
                  {application.jobId?._id && (
                    <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                      Job ID: {application.jobId._id.slice(-6)}
                    </span>
                  )}
                </div>
                
                {(application.status === 'applied' || application.status === 'reviewed') && (
                  <button
                    onClick={() => handleWithdraw(application._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#c82333';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#dc3545';
                    }}
                  >
                    <i className="bx bx-x" style={{ marginRight: '0.5rem' }}></i>
                    Withdraw Application
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Message */}
      {applications.length > 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p style={{ margin: '0', color: '#666' }}>
            Keep applying to increase your chances! 
            <a href="/jobs" style={{ marginLeft: '0.5rem', color: '#007bff', textDecoration: 'none' }}>
              Browse more jobs →
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default MyApplications;