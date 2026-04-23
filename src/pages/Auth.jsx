import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, collection, addDoc } from 'firebase/firestore';
import loginBg from '../assets/loginsignup.jpg';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "members", user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      const firstName = user.displayName?.split(' ')[0] || displayName.split(' ')[0] || '';
      const lastName = user.displayName?.split(' ').slice(1).join(' ') || displayName.split(' ').slice(1).join(' ') || '';
      
      await setDoc(userRef, {
        firstName,
        lastName,
        email: user.email,
        phone: phone || '',
        address: address || '',
        role: 'Member',
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      if (businessName) {
        await addDoc(collection(db, "bulletinBoard"), {
          ownerId: user.uid,
          firstName,
          lastName,
          businessName: businessName,
          businessType: businessType || '',
          businessDescription: '', // Can be updated later
          createdAt: serverTimestamp()
        });
      }
    }
  };

  const handleAuth = async (e, type) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName });
        await saveUserToFirestore(userCredential.user);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container-v2 ${isLogin ? 'is-login' : ''}`}>
      <div className="auth-content">
        {/* Sign Up Form Section */}
        <div className="auth-form-section sign-up-container">
          <div className="auth-form-wrapper">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join the professional KDBM network today.</p>
            {error && !isLogin && <div className="auth-error">{error}</div>}
            
            <form onSubmit={(e) => handleAuth(e, 'signup')} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Full Name</label>
                  <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Email</label>
                  <input type="email" className="form-control" style={{ padding: '0.5rem' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Password</label>
                  <input type="password" className="form-control" style={{ padding: '0.5rem' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Phone</label>
                  <input type="tel" className="form-control" style={{ padding: '0.5rem' }} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Complete Address</label>
                <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Business Name</label>
                  <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Industry Type</label>
                  <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="btn btn-full btn-primary" style={{ padding: '0.6rem' }} disabled={loading}>
                {loading ? 'Processing...' : 'CREATE ACCOUNT'}
              </button>
            </form>
            
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={handleGoogleSignIn} className="btn btn-google btn-full" style={{ padding: '0.5rem', marginTop: 0 }} disabled={loading}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '16px', height: '16px' }} />
                Sign up with Google
              </button>
            </div>

            <div className="auth-mobile-toggle">
              Already have an account? <button type="button" className="btn-link" onClick={() => setIsLogin(true)}>Sign in</button>
            </div>
          </div>
        </div>

        {/* Sign In Form Section */}
        <div className="auth-form-section sign-in-container">
          <div className="auth-form-wrapper">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to manage your professional records.</p>
            {error && isLogin && <div className="auth-error">{error}</div>}
            
            <form onSubmit={(e) => handleAuth(e, 'login')} style={{ marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-full btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'SIGN IN'}
              </button>
            </form>

            <div>
              <button onClick={handleGoogleSignIn} className="btn btn-google btn-full" disabled={loading}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                Sign in with Google
              </button>
            </div>

            <div className="auth-mobile-toggle">
              Don't have an account? <button type="button" className="btn-link" onClick={() => setIsLogin(false)}>Sign up</button>
            </div>
          </div>
        </div>

        {/* Sliding Overlay Panel */}
        <div className="auth-overlay-container">
          <div className="auth-overlay" style={{ backgroundImage: `url(${loginBg})` }}>
            <div className="auth-overlay-panel overlay-left">
              <h1>New here?</h1>
              <p>Join the KDBM community and share your artwork today.</p>
              <button className="btn btn-secondary btn-ghost" onClick={() => setIsLogin(false)}>SIGN UP</button>
            </div>
            <div className="auth-overlay-panel overlay-right">
              <h1>Already have an account?</h1>
              <p>Keep your business profile up to date by signing in.</p>
              <button className="btn btn-secondary btn-ghost" onClick={() => setIsLogin(true)}>SIGN IN</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
