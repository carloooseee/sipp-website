import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import loginBg from '../assets/loginsignup.jpg';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Custom Registration Fields
  const [surname, setSurname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [philhealthNo, setPhilhealthNo] = useState('');
  const [familyInformation, setFamilyInformation] = useState([]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const saveUserToFirestore = async (user, additionalData = null) => {
    const userRef = doc(db, "members", user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      let role = 'Member';
      let status = 'Pending';
      if (user.email) {
        const existing = await getDocs(
          query(collection(db, 'members'), where('email', '==', user.email))
        );
        const existingAdmin = existing.docs.find(
          (d) => String(d.data().role ?? '').trim().toLowerCase() === 'admin'
        );
        if (existingAdmin) {
          role = 'Admin';
          status = existingAdmin.data().status ?? 'Approved';
        }
      }

      const today = new Date();
      const signupDateStr = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (additionalData) {
        await setDoc(userRef, {
          firstName: additionalData.firstName || '',
          middleName: additionalData.middleName || '',
          lastName: additionalData.surname || '', // Maintain compatibility with older records
          address: additionalData.address || '',
          phone: additionalData.phone || '',
          email: user.email || '',
          birthday: additionalData.birthday || '',
          bloodType: additionalData.bloodType || '',
          philhealthNo: additionalData.philhealthNo || '',
          philhealth: additionalData.philhealthNo || '', // Support legacy queries
          familyInformation: additionalData.familyInformation || [],
          role,
          status,
          createdAt: serverTimestamp(),
          signupDate: signupDateStr
        });
      } else {
        const gFirstName = user.displayName?.split(' ')[0] || '';
        const gLastName = user.displayName?.split(' ').slice(1).join(' ') || '';
        await setDoc(userRef, {
          firstName: gFirstName,
          middleName: '',
          lastName: gLastName,
          address: '',
          phone: '',
          email: user.email || '',
          birthday: '',
          bloodType: '',
          philhealthNo: '',
          philhealth: '',
          familyInformation: [],
          role,
          status,
          createdAt: serverTimestamp(),
          signupDate: signupDateStr
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
        const fullDisplayName = `${firstName} ${middleName ? middleName + ' ' : ''}${surname}`.trim();
        await updateProfile(userCredential.user, { displayName: fullDisplayName });
        await saveUserToFirestore(userCredential.user, {
          firstName,
          middleName,
          surname,
          address,
          phone,
          birthday,
          bloodType,
          philhealthNo,
          familyInformation
        });
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

  const handleAddFamilyMember = () => {
    setFamilyInformation(prev => [...prev, { name: '', address: '', relationship: '', phone: '' }]);
  };

  const handleRemoveFamilyMember = (index) => {
    setFamilyInformation(prev => prev.filter((_, i) => i !== index));
  };

  const handleFamilyMemberChange = (index, field, value) => {
    setFamilyInformation(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
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
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Surname</label>
                  <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={surname} onChange={(e) => setSurname(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>First Name</label>
                  <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Middle Name</label>
                  <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Birthday</label>
                  <input type="date" className="form-control" style={{ padding: '0.5rem' }} value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Complete Address</label>
                <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Contact No.</label>
                  <input type="tel" className="form-control" style={{ padding: '0.5rem' }} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>E-mail Address</label>
                  <input type="email" className="form-control" style={{ padding: '0.5rem' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Password</label>
                  <input type="password" className="form-control" style={{ padding: '0.5rem' }} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Blood Type</label>
                  <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={bloodType} onChange={(e) => setBloodType(e.target.value)} required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Philhealth No.</label>
                <input type="text" className="form-control" style={{ padding: '0.5rem' }} value={philhealthNo} onChange={(e) => setPhilhealthNo(e.target.value)} required />
              </div>

              {/* Family Information Section */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)' }}>Family Information</label>
                  <button 
                    type="button" 
                    onClick={handleAddFamilyMember} 
                    className="btn btn-secondary" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                  >
                    + Add Family Information
                  </button>
                </div>

                {familyInformation.map((member, index) => (
                  <div key={index} style={{ border: '1px solid var(--border)', borderRadius: '4px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#fdfdfd', position: 'relative' }}>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFamilyMember(index)}
                      style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                    >
                      Remove
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          style={{ padding: '0.4rem' }} 
                          value={member.name} 
                          onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)} 
                          required 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Relationship</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          style={{ padding: '0.4rem' }} 
                          value={member.relationship} 
                          onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Contact No.</label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          style={{ padding: '0.4rem' }} 
                          value={member.phone} 
                          onChange={(e) => handleFamilyMemberChange(index, 'phone', e.target.value)} 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Address</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          style={{ padding: '0.4rem' }} 
                          value={member.address} 
                          onChange={(e) => handleFamilyMemberChange(index, 'address', e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
