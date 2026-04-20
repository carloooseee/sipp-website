import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    position: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const docRef = await addDoc(collection(db, "members"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSuccess("Member registered successfully!");
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        position: ''
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Failed to register member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Member Registration</h2>
        
        {success && <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid var(--success)' }}>{success}</div>}
        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', border: '1px solid var(--error)' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">First Name</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group" style={{ marginBottom: '0' }}>
              <label className="form-label">Last Name</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="form-control" />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="form-control" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
             <div className="form-group" style={{ marginBottom: '0' }}>
               <label className="form-label">Role</label>
               <select name="role" required value={formData.role} onChange={handleChange} className="form-control">
                 <option value="" disabled>Select Role</option>
                 <option value="Admin">Admin</option>
                 <option value="Member">Member</option>
                 <option value="Guest">Guest</option>
               </select>
             </div>
             <div className="form-group" style={{ marginBottom: '0' }}>
               <label className="form-label">Position / Occupation</label>
               <input type="text" name="position" value={formData.position} onChange={handleChange} className="form-control" />
             </div>
          </div>
          
          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
            {loading ? 'Registering...' : 'Register Member'}
          </button>
        </form>
      </div>
    </div>
  );
}
