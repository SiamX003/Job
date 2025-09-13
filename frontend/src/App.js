import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

import CreateJob from "./CreateJob";
import Jobs from "./Jobs";
import Register from './Register';
import Login from './Login';
import Home from './home';
import Contact from './Contact';
import Profile from "./Profile";

// Navigation Component
const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>

      {!isAuthenticated ? (
        <>
          <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
        </>
      ) : (
        <>
          <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
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
          </Routes>



          {/* <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<div>Profile page coming soon</div>} />
            <Route path="/create-job" element={<div>Create job page coming soon</div>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/profile" element={<Profile />} />
          </Routes> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

