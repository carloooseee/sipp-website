import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Pages
import HomePage from './pages/HomePage';
import RegistrationForm from './pages/RegistrationForm';
import MemberDatabase from './pages/MemberDatabase';
import AdminDashboard from './pages/AdminDashboard';
import Announcements from './pages/Announcements';
import AboutKDBM from './pages/AboutKDBM';
import Contact from './pages/Contact';
import Auth from './pages/Auth';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif' }}>
        LOADING...
      </div>
    );
  }

  // Auth Gate: If not logged in, show Auth component only
  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <header className="header">
        <div className="container nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" className="nav-logo" style={{ fontWeight: 'bold', fontSize: '1.25rem', textDecoration: 'none', color: '#000', border: '2px solid #000', padding: '0.25rem 0.5rem' }}>
              SIPP
            </Link>
            <nav className="nav-links">
              <NavLink to="/register">REGISTER</NavLink>
              <NavLink to="/database">DATABASE</NavLink>
              <NavLink to="/announcements">NEWS</NavLink>
              <NavLink to="/about">ABOUT</NavLink>
              <NavLink to="/contact">CONTACT</NavLink>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{user.displayName || user.email}</span>
            <button onClick={handleLogout} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>LOGOUT</button>
          </div>
        </div>
      </header>

      <main className="container content-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/database" element={<MemberDatabase />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/about" element={<AboutKDBM />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
