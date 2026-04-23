import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import Projects from './pages/Projects';
import SeedDatabase from './pages/SeedDatabase';
import Background from './pages/Background';

import { db } from './firebase';
import { doc, getDoc, onSnapshot, query, collection, where } from 'firebase/firestore';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
};

const AuthRedirectHandler = ({ isAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Aggressively redirect Admins away from public landing pages directly to the dashboard
    if (isAdmin && (location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login')) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, location.pathname, navigate]);

  return null;
};

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);

      if (currentUser) {
        // Query by email to be more robust (handles cases where UID doesn't match Doc ID)
        const q = query(collection(db, "members"), where("email", "==", currentUser.email));
        
        unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          if (!querySnapshot.empty) {
            // Get the first matching document
            setUserData(querySnapshot.docs[0].data());
          } else {
            setUserData(null);
          }
          setUser(currentUser);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setUserData(null);
          setUser(currentUser);
          setLoading(false);
        });
        
      } else {
        if (unsubscribeSnapshot) {
          unsubscribeSnapshot();
        }
        setUserData(null);
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
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

  if (!user) {
    return <Auth />;
  }

  const isAdmin = userData?.role?.toLowerCase() === 'admin';

  return (
    <Router>
      <AuthRedirectHandler isAdmin={isAdmin} />
      <header className="header">
        <div className="container nav">
          <div className="nav-left">
            <Link to="/" className="nav-logo">
              {isAdmin ? 'KDBM ADMIN' : 'KDBM'}
            </Link>
            <nav className="nav-links">
              <NavLink to="/">HOME</NavLink>
              <NavLink to="/about">ABOUT</NavLink>
              <NavLink to="/background">BACKGROUND</NavLink>
              <NavLink to="/projects">PROJECTS</NavLink>
              <NavLink to="/bulletin">BULLETIN BOARD</NavLink>
              <NavLink to="/announcements">ANNOUNCEMENTS</NavLink>
              {isAdmin && <NavLink to="/admin">DASHBOARD</NavLink>}
            </nav>
          </div>
          <div className="nav-actions">
            <span className="user-display">{user.displayName || user.email}</span>
            <button onClick={handleLogout} className="btn-secondary btn btn-logout">LOGOUT</button>
          </div>
        </div>
      </header>

      <main className="container content-wrapper">
        <Routes>
          <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <HomePage />} />
          <Route path="/about" element={<AboutKDBM />} />
          <Route path="/background" element={<Background />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/bulletin" element={<BulletinBoard />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/seed" element={<SeedDatabase />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />} />
          <Route path="/database" element={isAdmin ? <MemberDatabase /> : <Navigate to="/" replace />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
