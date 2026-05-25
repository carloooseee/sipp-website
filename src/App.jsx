import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Menu, X } from 'lucide-react';

// Pages
import HomePage from './pages/member/HomePage';
import RegistrationForm from './pages/member/RegistrationForm';
import AdminDashboard from './pages/admin/AdminDashboard';
import Announcements from './pages/member/Announcements';
import AboutKDBM from './pages/member/AboutKDBM';
import Contact from './pages/member/Contact';
import Auth from './pages/Auth';

import BulletinBoard from './pages/member/BulletinBoard';
import Projects from './pages/member/Projects';
import SeedDatabase from './pages/SeedDatabase';
import Background from './pages/member/Background';
import Profile from './pages/member/Profile';
import kdbmLogo from './assets/kdbm_logo.png';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBulletinBoard from './pages/admin/AdminBulletinBoard';

import { db } from './firebase';
import { onSnapshot, doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';

const isAdminRole = (role) => String(role ?? '').trim().toLowerCase() === 'admin';

/**
 * Loads the member profile from Firestore and mirrors it onto members/{auth.uid}
 * so the app can read role/status under typical security rules.
 */
const syncMemberProfileToUid = async (currentUser, uidSnap) => {
  const uidRef = doc(db, 'members', currentUser.uid);
  const uidData = uidSnap?.exists() ? uidSnap.data() : null;

  if (isAdminRole(uidData?.role)) {
    return { id: currentUser.uid, ...uidData };
  }

  const email = (currentUser.email || '').trim();
  if (email) {
    const emailSnap = await getDocs(
      query(collection(db, 'members'), where('email', '==', email))
    );
    const adminDoc = emailSnap.docs.find((d) => isAdminRole(d.data().role));
    const primaryDoc = adminDoc ?? emailSnap.docs[0];

    if (adminDoc) {
      const adminData = adminDoc.data();
      const merged = {
        ...adminData,
        ...uidData,
        email: currentUser.email,
        role: 'Admin',
        status: adminData.status ?? uidData?.status ?? 'Approved',
      };
      try {
        await setDoc(uidRef, merged, { merge: true });
      } catch (error) {
        console.error('Could not sync admin profile to members/{uid}:', error);
      }
      return { id: currentUser.uid, ...merged };
    }

    if (!uidSnap?.exists() && primaryDoc) {
      const data = primaryDoc.data();
      try {
        await setDoc(uidRef, { ...data, email: currentUser.email }, { merge: true });
      } catch (error) {
        console.error('Could not create member profile at members/{uid}:', error);
      }
      return { id: currentUser.uid, ...data };
    }
  }

  if (uidData) return { id: currentUser.uid, ...uidData };
  return null;
};

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`} onClick={onClick}>
      {children}
    </Link>
  );
};

const AuthRedirectHandler = ({ isAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      const isAllowedAdminPath = location.pathname.startsWith('/admin') || location.pathname === '/profile';
      if (!isAllowedAdminPath) {
        navigate('/admin', { replace: true });
      }
    }
  }, [isAdmin, location.pathname, navigate]);

  return null;
};

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    let unsubscribeUid = null;
    let latestUidSnap = null;
    let profileRequestId = 0;

    const applyProfile = async (currentUser) => {
      if (!currentUser) return;
      const requestId = ++profileRequestId;
      try {
        const profile = await syncMemberProfileToUid(currentUser, latestUidSnap);
        if (requestId === profileRequestId) {
          setUserData(profile);
        }
      } catch (error) {
        console.error('Error syncing member profile:', error);
        if (requestId === profileRequestId) {
          const uidData = latestUidSnap?.exists() ? latestUidSnap.data() : null;
          setUserData(uidData ? { id: currentUser.uid, ...uidData } : null);
        }
      }
      if (requestId === profileRequestId) {
        setUser(currentUser);
        setLoading(false);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (unsubscribeUid) unsubscribeUid();
      unsubscribeUid = null;
      latestUidSnap = null;

      if (currentUser) {
        setLoading(true);

        unsubscribeUid = onSnapshot(
          doc(db, 'members', currentUser.uid),
          (uidSnap) => {
            latestUidSnap = uidSnap;
            applyProfile(currentUser);
          },
          (error) => {
            console.error('Error fetching member by UID:', error);
            applyProfile(currentUser);
          }
        );
      } else {
        setUserData(null);
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUid) unsubscribeUid();
    };
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter, sans-serif', color: 'var(--primary)', fontWeight: 'bold' }}>
        LOADING...
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  const isAdmin = isAdminRole(userData?.role);

  return (
    <Router>
      <AuthRedirectHandler isAdmin={isAdmin} />
      <header className="header">
        <div className="container nav">
          <div className="nav-left">
            <Link to={isAdmin ? '/admin' : '/'} className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img src={kdbmLogo} alt="KDBM Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
              <span>{isAdmin ? 'KDBM ADMIN' : 'KDBM'}</span>
            </Link>
            
            <button 
              className="nav-menu-toggle" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            
            <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              {isAdmin ? (
                <>
                  <NavLink to="/admin" onClick={closeMenu}>MEMBERS</NavLink>
                  <NavLink to="/admin/bulletin" onClick={closeMenu}>BULLETIN BOARD</NavLink>
                  <NavLink to="/admin/projects" onClick={closeMenu}>PROJECTS</NavLink>
                  <NavLink to="/admin/announcements" onClick={closeMenu}>ANNOUNCEMENTS</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/" onClick={closeMenu}>HOME</NavLink>
                  <NavLink to="/about" onClick={closeMenu}>ABOUT</NavLink>
                  <NavLink to="/background" onClick={closeMenu}>BACKGROUND</NavLink>
                  <NavLink to="/projects" onClick={closeMenu}>PROJECTS</NavLink>
                  <NavLink to="/bulletin" onClick={closeMenu}>BULLETIN BOARD</NavLink>
                  <NavLink to="/announcements" onClick={closeMenu}>ANNOUNCEMENTS</NavLink>
                </>
              )}
            </nav>
          </div>
          <div className={`nav-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/profile" className="user-display" title="View Profile" style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={closeMenu}>
              {user.displayName || user.email}
            </Link>
            <button onClick={() => { handleLogout(); closeMenu(); }} className="btn-secondary btn btn-logout">LOGOUT</button>
          </div>
        </div>
      </header>

      <main className="container content-wrapper">
        <Routes>
          <Route path="/profile" element={<Profile user={user} userData={userData} />} />
          {isAdmin ? (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/bulletin" element={<AdminBulletinBoard />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutKDBM />} />
              <Route path="/background" element={<Background />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/bulletin" element={<BulletinBoard />} />
              <Route path="/register" element={<RegistrationForm user={user} userData={userData} />} />
              <Route path="/seed" element={<SeedDatabase />} />
              <Route path="/admin" element={<Navigate to="/" replace />} />
              <Route path="/database" element={<Navigate to="/" replace />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
