import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function MemberDatabase() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedMembers = [];
        querySnapshot.forEach((doc) => {
          fetchedMembers.push({ id: doc.id, ...doc.data() });
        });
        setMembers(fetchedMembers);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Could not load database. Make sure Firebase is configured correctly and rules allow reads.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Member Database</h1>
        </div>
        <div className="badge" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          {members.length} Total Members
        </div>
      </div>

      <div className="card" style={{ padding: '0' }}>
        {error && <div style={{ padding: '2rem', color: 'var(--error)' }}>{error}</div>}
        
        {!error && loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading members context...</div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Position</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No members found.</td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td style={{ fontWeight: '500' }}>
                        {member.firstName} {member.lastName}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>{member.email}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{member.phone}</div>
                      </td>
                      <td>
                        <span className="badge">
                          {member.role || 'Member'}
                        </span>
                      </td>
                      <td>{member.position || '-'}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {member.createdAt && member.createdAt.toDate() ? member.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
