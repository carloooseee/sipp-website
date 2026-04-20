import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import loginBg from '../assets/loginsignup.jpg';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "members", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        email: user.email,
        role: 'Member',
        createdAt: serverTimestamp()
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
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
    <div className={`auth-split-wrapper ${isLogin ? 'is-login' : ''}`}>
      {/* Image Panel */}
      <div className="auth-panel auth-image-panel" style={{ backgroundImage: `url(${loginBg})` }}>
        <div className="auth-image-content">
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            {isLogin ? "Welcome Back to SIPP" : "Create your Free Account"}
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>
            Continue managing your member database effortlessly.
          </p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-panel auth-form-panel">
        <div className="auth-form-container">
          <h2 className="page-title" style={{ fontSize: '2.5rem', textTransform: 'none', marginBottom: '0.5rem' }}>
            {isLogin ? 'Sign in' : 'Sign up'}
          </h2>
          
          <p className="auth-link-text">
            {isLogin ? "Don't have an account ?" : "Already have an account ?"}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          {error && (
            <div style={{ color: 'var(--error)', border: '1px solid var(--error)', padding: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  required 
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-full btn-primary" style={{ background: '#0d1e1c', color: 'white', borderColor: '#0d1e1c', padding: '1rem' }} disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create an Account')}
            </button>
          </form>

          <button onClick={handleGoogleSignIn} className="btn btn-google btn-full" disabled={loading}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" alt="Google" style={{ width: '18px' }} />
            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}
