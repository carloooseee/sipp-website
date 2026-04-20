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

import BulletinBoard from './pages/BulletinBoard';

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: '#001F3F', fontWeight: 'bold' }}>
        LOADING...
      </div>
    );
  }

  // Auth Gate
  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <header className="header">
        <div className="container nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <Link to="/" className="nav-logo" style={{ fontWeight: '800', fontSize: '1.5rem', color: '#001F3F', textDecoration: 'none', letterSpacing: '-0.05em' }}>
              SIPP
            </Link>
            <nav className="nav-links">
              <NavLink to="/bulletin">ANNOUNCEMENT SECTION</NavLink>
              <NavLink to="/database">LIST OF MEMBERS</NavLink>
              <NavLink to="/about">ABOUT KDBM</NavLink>
              <NavLink to="/contact">CONTACT PAGE</NavLink>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#666' }}>{user.displayName || user.email}</span>
            <button onClick={handleLogout} className="btn-secondary btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>LOGOUT</button>
          </div>
        </div>
      </header>

      <main className="container content-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/database" element={<MemberDatabase />} />
          <Route path="/bulletin" element={<BulletinBoard />} />
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
