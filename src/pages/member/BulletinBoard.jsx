import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Briefcase, User, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BulletinBoard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        // Query members who have a business name provided
        const q = query(
          collection(db, "bulletinBoard"), 
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
                  <Mail size={16} />
                  <span>Contact: {biz.email}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      <JoinUsSection />
    </div>
  );
}

const JoinUsSection = () => (
  <div className="card" style={{ 
    marginTop: '5rem', 
    padding: '4rem 2rem', 
    textAlign: 'center', 
    backgroundColor: 'var(--primary)', 
    color: 'white',
    borderRadius: '8px'
  }}>
    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Grow Your Business with KDBM</h2>
    <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', opacity: '0.9' }}>
      Are you a local business owner? Join our professional network to list your business in this directory and connect with other industry leaders.
    </p>
    <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
      REGISTER YOUR BUSINESS
    </Link>
  </div>
);
