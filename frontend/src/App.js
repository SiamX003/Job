import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

import CreateJob from "./CreateJob";
import Jobs from "./Jobs";
import Register from './Register';
import Login from './Login';
import Home from './home';
import Contact from './Contact';
import Profile from "./Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ padding: '0 0' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs" element={<Jobs />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
