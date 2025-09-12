import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

import Register from './Register';
import Login from './Login';
import Home from './home';

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
            <Route path="/profile" element={<div>Profile page coming soon</div>} />
            <Route path="/create-job" element={<div>Create job page coming soon</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

// import React from 'react';
// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { AuthProvider } from './AuthContext';  // Test this import

// import Register from './Register';
// import Login from './Login';
// import Home from './home';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div>
//           <nav>
//             <Link to="/">Home</Link> |{' '}
//             <Link to="/register">Register</Link> |{' '}
//             <Link to="/login">Login</Link>
//           </nav>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
// // App.js - Simplified for debugging
// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { AuthProvider } from './AuthContext';

// // Import only the files you're sure exist
// import Home from './home';  // Make sure this exists
// import Register from './Register';
// import Login from './Login';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <nav>
//           <Link to="/">Home</Link> |{" "}
//           <Link to="/register">Register</Link> |{" "}
//           <Link to="/login">Login</Link>
//         </nav>

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



// // App.js original
// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { AuthProvider, useAuth } from './AuthContext';
// import ProtectedRoute from './ProtectedRoute';

// // Components
// import Home from './home';
// import Contact from './Contact';
// import Register from './Register';
// import Login from './Login';
// import Profile from './Profile';
// import Jobs from './Jobs';
// import CreateJob from './CreateJob';

// // Navigation Component
// const Navigation = () => {
//   const { isAuthenticated, user, logout } = useAuth();

//   return (
//     <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
//       <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
//       <Link to="/jobs" style={{ marginRight: '1rem' }}>Jobs</Link>
      
//       {!isAuthenticated ? (
//         <>
//           <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
//           <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
//         </>
//       ) : (
//         <>
//           <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
//           {user?.role === 'recruiter' && (
//             <Link to="/create-job" style={{ marginRight: '1rem' }}>Create Job</Link>
//           )}
//           <button 
//             onClick={logout}
//             style={{ marginLeft: '1rem', cursor: 'pointer' }}
//           >
//             Logout ({user?.name})
//           </button>
//         </>
//       )}
//       <Link to="/contact" style={{ marginLeft: '1rem' }}>Contact</Link>
//     </nav>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navigation />
        
//         <div style={{ padding: '0 2rem' }}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/contact" element={<Contact />} />
//             <Route path="/jobs" element={<Jobs />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/login" element={<Login />} />
            
//             {/* Protected Routes */}
//             <Route 
//               path="/profile" 
//               element={
//                 <ProtectedRoute>
//                   <Profile />
//                 </ProtectedRoute>
//               } 
//             />
            
//             {/* Recruiter Only Routes */}
//             <Route 
//               path="/create-job" 
//               element={
//                 <ProtectedRoute requiredRole="recruiter">
//                   <CreateJob />
//                 </ProtectedRoute>
//               } 
//             />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// // React components
// import Home from './home';
// import Contact from './Contact';
// import Register from './Register';
// import Login from './Login';
// import Profile from './Profile';

// // Plain JS script (not a React component)
// import './Script.js'; // runs side effects, do NOT use <Script /> in JSX

// function App() {
//   return (
//     <Router>
//       {/* Optional: simple navigation menu */}
//       <nav>
//         <Link to="/">Home</Link> |{" "}
//         <Link to="/contact">Contact</Link> |{" "}
//         <Link to="/register">Register</Link> |{" "}
//         <Link to="/login">Login</Link> |{" "}
//         <Link to="/profile">Profile</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Home from './home';
// import Contact from './Contact';
// import Script from './Script';
// import Register from './Register';
// import Login from './Login';
// import Profile from './Profile';

// function App() {
//   return (
//     <Router>
//       {/* Optional: simple navigation menu */}
//       <nav>
//         <Link to="/">Home</Link> |{" "}
//         <Link to="/contact">Contact</Link> |{" "}
//         <Link to="/script">Script</Link> |{" "}
//         <Link to="/register">Register</Link> |{" "}
//         <Link to="/login">Login</Link> |{" "}
//         <Link to="/profile">Profile</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/script" element={<Script />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




// import logo from './logo.svg';
// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './home';
// import Contact from './Contact';
// import script from './script';
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/script" element={<script />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
