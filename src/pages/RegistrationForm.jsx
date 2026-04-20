import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    businessDescription: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, "members"), {
        ...formData,
        role: 'Member',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(() => navigate('/directory'), 3000);
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Failed to register. Please check your connection.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <CheckCircle size={64} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
        <h2 className="page-title">Registration Complete</h2>
        <p className="page-subtitle">Your member details have been saved securely. Redirecting to the directory...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="steps-container">
        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>1. IDENTITY</div>
        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>2. CONTACT</div>
        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>3. BUSINESS</div>
      </div>

      <div className="card">
        <h2 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>
          {step === 1 && "Personal Identity"}
          {step === 2 && "Contact Details"}
          {step === 3 && "Business Information"}
        </h2>

        {error && <div style={{ color: 'var(--error)', marginBottom: '1.5rem', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="form-control" />
              </div>
              <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button type="button" onClick={nextStep} className="btn">
                  NEXT <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="form-control" />
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" onClick={prevStep} className="btn btn-secondary">
                  <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> BACK
                </button>
                <button type="button" onClick={nextStep} className="btn">
                  NEXT <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input type="text" name="businessName" required value={formData.businessName} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Business Type</label>
                <input type="text" name="businessType" required value={formData.businessType} onChange={handleChange} className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea 
                  name="businessDescription" 
                  rows="4" 
                  value={formData.businessDescription} 
                  onChange={handleChange} 
                  className="form-control" 
                  style={{ resize: 'none' }}
                />
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" onClick={prevStep} className="btn btn-secondary">
                  <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> BACK
                </button>
                <button type="submit" disabled={loading} className="btn">
                  {loading ? 'Processing...' : 'FINISH REGISTRATION'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
