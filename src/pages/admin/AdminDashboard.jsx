import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, query, where, setDoc } from 'firebase/firestore';
import { ShieldCheck, UserCheck, Clock, Eye, CheckCircle, Database } from 'lucide-react';

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "members"),
        where("role", "==", "Member")
      );
      const querySnapshot = await getDocs(q);
      const fetched = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      fetched.sort((a, b) => {
        const dateA = a.createdAt?.toMillis() || 0;
        const dateB = b.createdAt?.toMillis() || 0;
        return dateB - dateA;
      });
      setMembers(fetched);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleApprove = async (memberId) => {
    setProcessingId(memberId);
    try {
      const userRef = doc(db, "members", memberId);
      await updateDoc(userRef, {
        status: 'Approved'
      });
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'Approved' } : m));
    } catch (err) {
      console.error("Error approving member:", err);
      alert("Failed to approve member.");
    } finally {
      setProcessingId(null);
    }
  };

  const generateSampleData = async () => {
    setLoading(true);
    const samples = [
      {
        id: "sample-1",
        firstName: "Jane", lastName: "Doe", email: "jane@example.com", phone: "555-0101",
        address: "123 Business Rd, KDBM", role: "Member", status: "Pending", createdAt: new Date()
      },
      {
        id: "sample-2",
        firstName: "John", lastName: "Smith", email: "john@example.com", phone: "555-0202",
        address: "456 Tech Ave, KDBM", role: "Member", status: "Approved", createdAt: new Date()
      }
    ];

    const bizSamples = [
      {
        email: "jane@example.com",
        ownerId: "sample-1",
        businessName: "Jane's Consulting", businessType: "Services", businessDescription: "Expert business consulting.", createdAt: new Date()
      },
      {
        email: "john@example.com",
        ownerId: "sample-2",
        businessName: "Smith Tech", businessType: "IT", businessDescription: "IT solutions provider.", createdAt: new Date()
      }
    ];

    try {
      for (const sample of samples) {
        const { id, ...data } = sample;
        await setDoc(doc(db, "members", id), data);
      }
      for (const biz of bizSamples) {
        await setDoc(doc(db, "bulletinBoard", biz.email), biz);
      }
      await fetchMembers();
    } catch (err) {
      console.error("Error generating sample data:", err);
      alert("Failed to generate sample data.");
    }
  };

  const pendingCount = members.filter(m => m.status === 'Pending').length;
  const approvedCount = members.filter(m => m.status === 'Approved').length;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle" style={{ marginBottom: 0 }}>Manage member registrations and submissions.</p>
        </div>
        <button onClick={generateSampleData} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Database size={16} /> GENERATE SAMPLES
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ marginBottom: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#FEF3C7', borderRadius: '8px' }}>
            <Clock size={32} color="#D97706" />
          </div>
          <div>
            <h3 style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase' }}>Pending Submissions</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>{pendingCount}</div>
          </div>
        </div>
        <div className="card" style={{ marginBottom: 0, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#D1FAE5', borderRadius: '8px' }}>
            <UserCheck size={32} color="#059669" />
          </div>
          <div>
            <h3 style={{ color: '#666', fontSize: '0.9rem', textTransform: 'uppercase' }}>Approved Members</h3>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text)' }}>{approvedCount}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--primary)" /> Member Directory Management
          </h2>
        </div>
        
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>Loading members...</div>
        ) : members.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>No members found.</div>
        ) : (
          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <React.Fragment key={member.id}>
                    <tr style={{ backgroundColor: selectedMember === member.id ? '#F8FAFC' : 'white' }}>
                      <td style={{ fontWeight: '600' }}>{member.firstName} {member.lastName}</td>
                      <td>{member.email}</td>
                      <td>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '999px', 
                          fontSize: '0.75rem', 
                          fontWeight: '700',
                          backgroundColor: member.status === 'Approved' ? '#D1FAE5' : '#FEF3C7',
                          color: member.status === 'Approved' ? '#065F46' : '#92400E'
                        }}>
                          {member.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            <Eye size={14} style={{ marginRight: '0.25rem' }} /> VIEW
                          </button>
                          {member.status !== 'Approved' && (
                            <button 
                              onClick={() => handleApprove(member.id)}
                              disabled={processingId === member.id}
                              className="btn" 
                              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', backgroundColor: '#059669', borderColor: '#059669' }}
                            >
                              <CheckCircle size={14} style={{ marginRight: '0.25rem' }} /> 
                              {processingId === member.id ? '...' : 'APPROVE'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {selectedMember === member.id && (
                      <tr style={{ backgroundColor: '#F8FAFC' }}>
                        <td colSpan="4" style={{ padding: '2rem', borderBottom: '2px solid var(--border)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                              <h4 style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Personal Identity</h4>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <div><strong>Surname:</strong> {member.lastName || 'N/A'}</div>
                                <div><strong>First Name:</strong> {member.firstName || 'N/A'}</div>
                                <div><strong>Middle Name:</strong> {member.middleName || 'N/A'}</div>
                                <div><strong>Birthday:</strong> {member.birthday || 'N/A'}</div>
                                <div><strong>Blood Type:</strong> {member.bloodType || 'N/A'}</div>
                                <div><strong>Philhealth No.:</strong> {member.philhealthNo || member.philhealth || 'N/A'}</div>
                                <div style={{ gridColumn: 'span 2' }}><strong>Signup Date:</strong> {member.signupDate || (member.createdAt ? (member.createdAt.toMillis ? new Date(member.createdAt.toMillis()).toLocaleDateString() : new Date(member.createdAt).toLocaleDateString()) : 'N/A')}</div>
                              </div>
                            </div>
                            <div>
                              <h4 style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Contact Details</h4>
                              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <p><strong>Contact No.:</strong> {member.phone || 'N/A'}</p>
                                <p><strong>E-mail Address:</strong> {member.email || 'N/A'}</p>
                                <p><strong>Complete Address:</strong> {member.address || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Family Information</h4>
                            {!member.familyInformation || member.familyInformation.length === 0 ? (
                              <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>No family information provided.</p>
                            ) : (
                              <div className="data-table-wrapper" style={{ borderRadius: '4px' }}>
                                <table className="data-table" style={{ fontSize: '0.85rem' }}>
                                  <thead>
                                    <tr>
                                      <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                                      <th style={{ padding: '0.75rem 1rem' }}>Relationship</th>
                                      <th style={{ padding: '0.75rem 1rem' }}>Contact No.</th>
                                      <th style={{ padding: '0.75rem 1rem' }}>Address</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {member.familyInformation.map((fam, fIdx) => (
                                      <tr key={fIdx} style={{ backgroundColor: 'white' }}>
                                        <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{fam.name || 'N/A'}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>{fam.relationship || 'N/A'}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>{fam.phone || 'N/A'}</td>
                                        <td style={{ padding: '0.75rem 1rem' }}>{fam.address || 'N/A'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
