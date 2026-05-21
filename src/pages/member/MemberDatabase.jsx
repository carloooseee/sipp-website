import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Search } from 'lucide-react';

export default function MemberDatabase() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
        setError("Could not load directory at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => {
    const searchStr = searchTerm.toLowerCase();
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const businessName = (member.businessName || "").toLowerCase();
    const email = (member.email || "").toLowerCase();
    
    return fullName.includes(searchStr) || businessName.includes(searchStr) || email.includes(searchStr);
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Member Directory</h1>
        <p className="page-subtitle">Search and connect with local professionals and businesses.</p>
        
        <div style={{ position: 'relative', maxWidth: '500px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#999' }} />
          <input 
            type="text" 
            placeholder="Search by name, business, or email..." 
            className="form-control" 
            style={{ paddingLeft: '3rem', height: '3.5rem', fontSize: '1.1rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '0', borderStyle: 'solid' }}>
        {error && <div style={{ padding: '2rem', color: 'var(--error)' }}>{error}</div>}
        
        {!error && loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>Loading directory records...</div>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Business Details</th>
                  <th>Contact Information</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
                      No members matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => (
                    <tr key={member.id}>
                      <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                        {member.firstName} {member.lastName}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{member.businessName || "Individual Member"}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{member.businessType || "-"}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.9rem' }}>{member.email}</div>
                        <div style={{ fontSize: '0.85rem', color: '#999' }}>{member.phone || "No phone provided"}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#999' }}>
                        {member.createdAt && member.createdAt.toDate() ? member.createdAt.toDate().toLocaleDateString() : 'Recent'}
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
