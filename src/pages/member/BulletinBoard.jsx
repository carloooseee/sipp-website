import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Briefcase, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { communityBanner, galleryImages } from '../../assets/pictures';

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
      <section
        className="page-hero"
        style={{ backgroundImage: `url(${communityBanner})` }}
        aria-labelledby="bulletin-hero-title"
      >
        <h1 id="bulletin-hero-title" className="page-hero-title">Member Business Directory</h1>
        <p className="page-hero-subtitle">Supporting and promoting our local member-owned businesses.</p>
      </section>

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
            businesses.map((biz, index) => {
              const cardImage = galleryImages[index % galleryImages.length];
              return (
              <div key={biz.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
                <div className="card-image-header">
                  <img src={cardImage} alt="" className="img-cover" style={{ height: '120px' }} />
                </div>
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
              </div>
            );
            })
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
    padding: 0,
    overflow: 'hidden',
    textAlign: 'center', 
    color: 'white',
    borderRadius: '8px',
    position: 'relative',
    minHeight: '280px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <img
      src={communityBanner}
      alt=""
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, rgba(194, 24, 21, 0.9), rgba(194, 65, 12, 0.75))',
    }} />
    <div style={{ position: 'relative', zIndex: 1, padding: '4rem 2rem' }}>
    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Grow Your Business with KDBM</h2>
    <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', opacity: '0.9' }}>
      Are you a local business owner? Join our professional network to list your business in this directory and connect with other industry leaders.
    </p>
    <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
      REGISTER YOUR BUSINESS
    </Link>
    </div>
  </div>
);
