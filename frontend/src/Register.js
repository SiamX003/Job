import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    resumeLink: '',
  });

  const { register, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert('⚠️ Please fill in all required fields');
      return;
    }

    const result = await register(form);

    if (result.success) {
      navigate('/');
    } else {
      console.error('Registration failed:', result.error);
      alert(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Register</h2>

      {error && (
        <div
          style={{
            color: 'red',
            marginBottom: '1rem',
            padding: '0.5rem',
            border: '1px solid red',
            borderRadius: '4px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Full Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            required
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            required
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Password *"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            required
          />
        </div>

        {/* Role */}
        <div style={{ marginBottom: '1rem' }}>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          >
            <option value="candidate">Job Seeker</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        {/* Resume link (only for candidates) */}
        {form.role === 'candidate' && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="url"
              placeholder="Resume Link (optional)"
              value={form.resumeLink}
              onChange={(e) => setForm({ ...form, resumeLink: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Register;
