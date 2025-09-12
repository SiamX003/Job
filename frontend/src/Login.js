import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      alert('Please fill in all fields');
      return;
    }

    const result = await login(form.email, form.password);
    
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            fontSize: '1rem', 
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;


// import React from 'react';

// function Login() {
//     return(
//         <div>
//             <h2>Login Page</h2>
//             <p>Login form will go here</p>
//         </div>
//     ) ;
        
    
// }

// export default Login;