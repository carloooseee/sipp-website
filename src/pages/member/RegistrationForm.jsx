import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Briefcase, Tag, FileText, User } from 'lucide-react';

export default function RegistrationForm({ user, userData }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessDescription: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExistingListing = async () => {
      if (user?.email) {
        try {
          const snap = await getDoc(doc(db, 'bulletinBoard', user.email));
          if (snap.exists()) {
            const data = snap.data();
            setFormData({
              businessName: data.businessName || '',
              businessType: data.businessType || '',
              businessDescription: data.businessDescription || ''
            });
          }
        } catch (err) {
          console.error("Error loading business listing:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadExistingListing();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error("You must be logged in to register.");
      }

      const bizRef = doc(db, "bulletinBoard", user.email);
      await setDoc(bizRef, {
        email: user.email,
        ownerId: user.uid,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessDescription: formData.businessDescription,
        createdAt: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => navigate('/bulletin'), 2000);
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Failed to register. Please check your connection.");
      setLoading(false);
    }
  };

  if (loading && !success) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', fontFamily: 'Inter, sans-serif', color: 'var(--primary)', fontWeight: '600' }}>
        Loading business registration...
      </div>
    );
  }

  if (success) {
    return (
      <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem', maxWidth: '600px', margin: '3rem auto' }}>
        <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
        <h2 className="page-title">Registration Complete</h2>
        <p className="page-subtitle">Your business has been successfully registered on the Bulletin Board. Redirecting...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto' }} className="animate-fade-in">
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 className="page-title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Register Your Business</h1>
        <p className="page-subtitle">Promote your business and services in the KDBM Professional Network.</p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {error && <div className="auth-error" style={{ marginBottom: '1.5rem', borderRadius: '4px' }}>{error}</div>}

        {/* Read-only Owner Information */}
        <div style={{ 
          backgroundColor: '#FFFBEB', 
          border: '1px solid #FDE68A', 
          padding: '1.25rem', 
          borderRadius: '6px', 
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <div style={{ padding: '0.5rem', backgroundColor: '#FEF3C7', borderRadius: '4px', color: '#D97706' }}>
            <User size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Listing Owner Details
            </div>
            <div className="grid-auto-fit" style={{ gap: '0.5rem', fontSize: '0.95rem', color: '#78350F' }}>
              <div><strong>Email:</strong> {user?.email || userData?.email || ''}</div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#D97706', marginTop: '0.5rem' }}>
              * These details are automatically linked from your member account.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={16} color="var(--primary)" /> Business Name
            </label>
            <input 
              type="text" 
              name="businessName" 
              required 
              value={formData.businessName} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="e.g. Acme Consulting Services"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={16} color="var(--primary)" /> Business Category / Type
            </label>
            <input 
              type="text" 
              name="businessType" 
              required 
              value={formData.businessType} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="e.g. Consulting, IT Support, Retail, Food Service"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} color="var(--primary)" /> Business Description
            </label>
            <textarea 
              name="businessDescription" 
              rows="5" 
              value={formData.businessDescription} 
              onChange={handleChange} 
              className="form-control" 
              style={{ resize: 'vertical' }}
              placeholder="Provide a short description of the products, services, or solutions your business offers..."
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn" 
            style={{ 
              marginTop: '1rem', 
              padding: '0.85rem', 
              fontWeight: 'bold', 
              fontSize: '1rem',
              letterSpacing: '0.05em'
            }}
          >
            {loading ? 'Processing Registration...' : 'SUBMIT DIRECTORY LISTING'}
          </button>
        </form>
      </div>
    </div>
  );
}
