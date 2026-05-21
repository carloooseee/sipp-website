import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { User, Mail, Phone, MapPin, Calendar, Heart, Shield, Award, Edit, Save, X, Plus, Trash2, CheckCircle2, Briefcase } from 'lucide-react';

export default function Profile({ user, userData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [surname, setSurname] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [philhealthNo, setPhilhealthNo] = useState('');
  const [familyInformation, setFamilyInformation] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  // Initialize form with userData (excluding business info)
  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setMiddleName(userData.middleName || '');
      setSurname(userData.lastName || userData.surname || '');
      setAddress(userData.address || '');
      setPhone(userData.phone || '');
      setBirthday(userData.birthday || '');
      setBloodType(userData.bloodType || '');
      setPhilhealthNo(userData.philhealthNo || userData.philhealth || '');
      setFamilyInformation(userData.familyInformation || []);
    }
  }, [userData]);

  // Fetch business details from bulletinBoard collection by user.email
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (user?.email) {
        try {
          const snap = await getDoc(doc(db, 'bulletinBoard', user.email));
          if (snap.exists()) {
            const data = snap.data();
            setBusinessName(data.businessName || '');
            setBusinessType(data.businessType || '');
            setBusinessDescription(data.businessDescription || '');
          } else {
            setBusinessName('');
            setBusinessType('');
            setBusinessDescription('');
          }
        } catch (err) {
          console.error("Error fetching business details from bulletinBoard:", err);
        }
      }
    };
    if (!isEditing) {
      fetchBusinessDetails();
    }
  }, [user, isEditing]);

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

  const handleCancel = async () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    // Reset fields to userData
    if (userData) {
      setFirstName(userData.firstName || '');
      setMiddleName(userData.middleName || '');
      setSurname(userData.lastName || userData.surname || '');
      setAddress(userData.address || '');
      setPhone(userData.phone || '');
      setBirthday(userData.birthday || '');
      setBloodType(userData.bloodType || '');
      setPhilhealthNo(userData.philhealthNo || userData.philhealth || '');
      setFamilyInformation(userData.familyInformation || []);
    }
    
    // Re-fetch business details from bulletinBoard
    if (user?.email) {
      try {
        const snap = await getDoc(doc(db, 'bulletinBoard', user.email));
        if (snap.exists()) {
          const data = snap.data();
          setBusinessName(data.businessName || '');
          setBusinessType(data.businessType || '');
          setBusinessDescription(data.businessDescription || '');
        } else {
          setBusinessName('');
          setBusinessType('');
          setBusinessDescription('');
        }
      } catch (err) {
        console.error("Error loading business details on cancel:", err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!surname.trim()) {
      setError('Surname is required.');
      setLoading(false);
      return;
    }
    if (!firstName.trim()) {
      setError('First Name is required.');
      setLoading(false);
      return;
    }

    try {
      // 1. Update Firestore doc
      const userRef = doc(db, 'members', user.uid);
      await updateDoc(userRef, {
        firstName,
        middleName,
        lastName: surname, // Match DB schema
        address,
        phone,
        birthday,
        bloodType,
        philhealthNo,
        philhealth: philhealthNo, // Maintain legacy support
        familyInformation
      });

      // 2. Update or delete listing in bulletinBoard
      const bizRef = doc(db, 'bulletinBoard', user.email);
      if (businessName.trim()) {
        await setDoc(bizRef, {
          email: user.email,
          ownerId: user.uid,
          businessName,
          businessType,
          businessDescription,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } else {
        await deleteDoc(bizRef);
      }

      // 2. Update Firebase Auth Display Name if changed
      const fullDisplayName = `${firstName} ${middleName ? middleName + ' ' : ''}${surname}`.trim();
      if (user.displayName !== fullDisplayName) {
        await updateProfile(user, { displayName: fullDisplayName });
      }

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get Initials for Avatar
  const getInitials = () => {
    const f = firstName.trim().charAt(0) || '';
    const s = surname.trim().charAt(0) || '';
    return (f + s).toUpperCase() || 'U';
  };

  if (!userData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', fontFamily: 'Inter, sans-serif', color: 'var(--primary)', fontWeight: '600' }}>
        Loading profile details...
      </div>
    );
  }

  const formattedSignupDate = userData.signupDate || (userData.createdAt ? (userData.createdAt.toMillis ? new Date(userData.createdAt.toMillis()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })) : 'N/A');

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Profile Header Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(194, 24, 21, 0.25)',
          border: '3px solid white',
          outline: '1px solid var(--border)'
        }}>
          {getInitials()}
        </div>
        
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>
              {firstName} {middleName ? middleName + ' ' : ''}{surname}
            </h1>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              backgroundColor: userData.role === 'Admin' ? '#FEF3C7' : '#FFEDD5',
              color: userData.role === 'Admin' ? '#92400E' : '#C2410C',
              border: `1px solid ${userData.role === 'Admin' ? '#FDE68A' : '#FED7AA'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Award size={12} /> {userData.role || 'Member'}
            </span>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '700',
              backgroundColor: userData.status === 'Approved' ? '#D1FAE5' : '#FEF3C7',
              color: userData.status === 'Approved' ? '#065F46' : '#92400E',
              border: `1px solid ${userData.status === 'Approved' ? '#A7F3D0' : '#FDE68A'}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <CheckCircle2 size={12} /> {userData.status || 'Pending'}
            </span>
          </div>
          <p style={{ color: '#666', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Mail size={16} /> {userData.email}
          </p>
        </div>

        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="btn" 
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <Edit size={14} /> EDIT PROFILE
          </button>
        )}
      </div>

      {error && (
        <div className="auth-error" style={{ borderRadius: '4px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <X size={16} /> {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#D1FAE5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} /> {success}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Personal & Contact Details Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Personal Identity */}
          <div className="card" style={{ margin: 0, padding: '1.75rem' }}>
            <h3 style={{ 
              color: 'var(--primary)', 
              fontSize: '1rem', 
              fontWeight: '700', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              borderBottom: '1px solid var(--border)', 
              paddingBottom: '0.75rem',
              marginBottom: '1.25rem' 
            }}>
              <User size={18} /> Personal Identity
            </h3>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Surname</label>
                  <input type="text" className="form-control" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Middle Name</label>
                  <input type="text" className="form-control" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Birthday</label>
                  <input type="date" className="form-control" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Blood Type</label>
                  <input type="text" className="form-control" value={bloodType} onChange={(e) => setBloodType(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Philhealth No.</label>
                  <input type="text" className="form-control" value={philhealthNo} onChange={(e) => setPhilhealthNo(e.target.value)} required />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
                <div><strong>Surname:</strong> {surname || 'N/A'}</div>
                <div><strong>First Name:</strong> {firstName || 'N/A'}</div>
                <div><strong>Middle Name:</strong> {middleName || 'N/A'}</div>
                <div><strong>Birthday:</strong> {birthday || 'N/A'}</div>
                <div><strong>Blood Type:</strong> {bloodType || 'N/A'}</div>
                <div><strong>Philhealth No.:</strong> {philhealthNo || 'N/A'}</div>
              </div>
            )}
          </div>

          {/* Contact Details & Info */}
          <div className="card" style={{ margin: 0, padding: '1.75rem' }}>
            <h3 style={{ 
              color: 'var(--primary)', 
              fontSize: '1rem', 
              fontWeight: '700', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              borderBottom: '1px solid var(--border)', 
              paddingBottom: '0.75rem',
              marginBottom: '1.25rem' 
            }}>
              <Phone size={18} /> Contact & Info
            </h3>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Contact No.</label>
                  <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Complete Address</label>
                  <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">E-mail Address <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#888' }}>(Read-only)</span></label>
                  <input type="email" className="form-control" value={userData.email} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }} />
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>Signup Date:</strong> {formattedSignupDate}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
                <div><strong>Contact No.:</strong> {phone || 'N/A'}</div>
                <div><strong>Complete Address:</strong> {address || 'N/A'}</div>
                <div><strong>E-mail Address:</strong> {userData.email || 'N/A'}</div>
                <div><strong>Signup Date:</strong> {formattedSignupDate}</div>
              </div>
            )}
          </div>

        </div>

        {/* Business Information Section */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <h3 style={{ 
            color: 'var(--primary)', 
            fontSize: '1rem', 
            fontWeight: '700', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            borderBottom: '1px solid var(--border)', 
            paddingBottom: '0.75rem',
            marginBottom: '1.25rem' 
          }}>
            <Briefcase size={18} /> Business Directory Listing
          </h3>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Business Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)} 
                  placeholder="e.g. Acme Corp (leave blank if none)"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Business Type / Category</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={businessType} 
                  onChange={(e) => setBusinessType(e.target.value)} 
                  placeholder="e.g. Services, Retail, Food"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Business Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={businessDescription} 
                  onChange={(e) => setBusinessDescription(e.target.value)} 
                  placeholder="Describe your business offerings..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          ) : (
            <div>
              {!businessName.trim() ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <p style={{ fontSize: '0.95rem', color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>
                    You have not registered a business listing on the Bulletin Board yet.
                  </p>
                  <Link to="/register" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}>
                    <Plus size={14} /> Register Business
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
                  <div><strong>Business Name:</strong> {businessName}</div>
                  <div>
                    <strong>Category / Type: </strong>
                    <span className="badge" style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {businessType || 'General'}
                    </span>
                  </div>
                  <div><strong>Description:</strong> {businessDescription || 'No description provided.'}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Family Information Section */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h3 style={{ color: 'var(--primary)', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Shield size={18} /> Family Information
            </h3>
            {isEditing && (
              <button 
                type="button" 
                onClick={handleAddFamilyMember} 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}
              >
                <Plus size={14} /> Add Family Info
              </button>
            )}
          </div>

          {familyInformation.length === 0 ? (
            <p style={{ fontSize: '0.95rem', color: '#666', fontStyle: 'italic', margin: 0 }}>No family information added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {familyInformation.map((member, index) => (
                <div 
                  key={index} 
                  style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: '6px', 
                    padding: '1.25rem', 
                    backgroundColor: isEditing ? '#fbfcfd' : '#f8fafc',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                >
                  {isEditing && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveFamilyMember(index)}
                      style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        right: '1rem', 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--error)', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  )}

                  {isEditing ? (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            style={{ padding: '0.4rem' }} 
                            value={member.name} 
                            onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Relationship</label>
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
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Contact No.</label>
                          <input 
                            type="tel" 
                            className="form-control" 
                            style={{ padding: '0.4rem' }} 
                            value={member.phone} 
                            onChange={(e) => handleFamilyMemberChange(index, 'phone', e.target.value)} 
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.8rem' }}>Address</label>
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
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <div><strong>Name:</strong> {member.name || 'N/A'}</div>
                      <div><strong>Relationship:</strong> {member.relationship || 'N/A'}</div>
                      <div><strong>Contact No.:</strong> {member.phone || 'N/A'}</div>
                      <div><strong>Address:</strong> {member.address || 'N/A'}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit mode controls */}
        {isEditing && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn btn-secondary" 
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: '120px' }}
              disabled={loading}
            >
              <X size={16} /> Cancel
            </button>
            <button 
              type="submit" 
              className="btn" 
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minWidth: '150px' }}
              disabled={loading}
            >
              <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
