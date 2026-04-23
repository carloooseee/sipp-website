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
import Projects from './pages/Projects';
import SeedDatabase from './pages/SeedDatabase';

import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

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
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, "members", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          } else {
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
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

  if (!user) {
    return <Auth />;
  }

  const isAdmin = userData?.role === 'Admin';

  return (
    <Router>
      <header className="header">
        <div className="container nav">
          <div className="nav-left">
            <Link to="/" className="nav-logo">
              {isAdmin ? 'KDBM ADMIN' : 'KDBM'}
            </Link>
            <nav className="nav-links">
              <NavLink to="/">HOME</NavLink>
              <NavLink to="/about">ABOUT</NavLink>
              <NavLink to="/projects">PROJECTS</NavLink>
              <NavLink to="/bulletin">BULLETIN BOARD</NavLink>
              {isAdmin ? (
                <NavLink to="/admin">DASHBOARD</NavLink>
              ) : (
                <NavLink to="/register">JOIN US</NavLink>
              )}
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
          <Route path="/" element={isAdmin ? <Navigate to="/admin" /> : <HomePage />} />
          <Route path="/about" element={<AboutKDBM />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/bulletin" element={<BulletinBoard />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/seed" element={<SeedDatabase />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/database" element={isAdmin ? <MemberDatabase /> : <Navigate to="/" />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
