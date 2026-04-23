import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Briefcase, User } from 'lucide-react';

export default function BulletinBoard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // Query members who have a business name provided
        const q = query(
          collection(db, "members"), 
          where("businessName", "!=", ""),
          orderBy("businessName", "asc")
        );
        const querySnapshot = await getDocs(q);
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setBusinesses(fetched);
      } catch (err) {
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Member Business Directory</h1>
        <p className="page-subtitle">Supporting and promoting our local member-owned businesses.</p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>Loading business board...</div>
      ) : (
        <div className="grid">
          {businesses.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', borderStyle: 'dotted' }}>
              <h3 style={{ color: '#999' }}>No businesses promoted yet.</h3>
              <p style={{ color: '#ccc' }}>Businesses will automatically appear here once registered.</p>
            </div>
          ) : (
            businesses.map((biz) => (
              <div key={biz.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: '4px' }}>
                    <Briefcase size={24} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.1rem' }}>
                      {biz.businessName}
                    </h3>
                    <span className="badge" style={{ backgroundColor: 'transparent', borderColor: 'var(--primary)', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                      {biz.businessType}
                    </span>
                  </div>
                </div>
                
                <p style={{ color: '#555', fontSize: '0.95rem', flexGrow: 1, marginBottom: '2rem' }}>
                  {biz.businessDescription || "A valuable member of our business community."}
                </p>
                
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                  <User size={16} />
                  <span>Owned by {biz.firstName} {biz.lastName}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
