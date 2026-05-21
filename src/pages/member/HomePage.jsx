import React, { useEffect, useState } from 'react';
import { Megaphone, ArrowRight, ShieldCheck, TrendingUp, X, MapPin, Clock, User, Mail, Calendar } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { kdbmOverview, pic5, pic2, pic3, pic6 } from '../../assets/pictures';

export default function HomePage() {
  const [latestAnnouncements, setLatestAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(2));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setLatestAnnouncements(fetched);
        }
      } catch (err) {
        console.error('Error fetching homepage announcements:', err);
      }
    };
    fetchLatest();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedAnnouncement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedAnnouncement]);

  return (
    <div className="animate-fade-in">
      {/* Hero / Overview Section */}
      <section 
        className="hero-full-width" 
        style={{ 
          marginBottom: '4rem', 
          textAlign: 'center', 
          padding: '6rem 2rem', 
          backgroundImage: `linear-gradient(135deg, rgba(194, 65, 12, 0.85), rgba(194, 65, 12, 0.65)), url(${kdbmOverview})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white'
        }}
      >
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.05em', textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
          KDBM Overview
        </h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', opacity: '0.95', lineHeight: '1.6', textShadow: '0 1px 4px rgba(0, 0, 0, 0.4)' }}>
          The KDBM Professional Network is dedicated to fostering growth, collaboration, and professional excellence among our local community members.
        </p>
      </section>

      <section className="photo-gallery" aria-label="Community highlights">
        {[
          { src: pic6, alt: 'KDBM community gathering' },
          { src: pic3, alt: 'Professional networking' },
          { src: pic2, alt: 'Local business collaboration' },
        ].map((photo) => (
          <div key={photo.alt} className="photo-gallery-item">
            <img src={photo.src} alt={photo.alt} className="img-cover" />
          </div>
        ))}
      </section>

      <div className="grid-2-cols-uneven">
        {/* Main Content Area */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={24} /> OUR CORE FOCUS
          </h2>
          <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
            <div className="grid-2-cols" style={{ gap: '2rem', alignItems: 'center' }}>
              <div>
                <p style={{ lineHeight: '1.8', color: '#444', margin: 0 }}>
                  We provide a robust platform for professionals to showcase their businesses, connect with potential partners, and stay updated on local economic initiatives. Our goal is to build a self-sustaining ecosystem of excellence.
                </p>
              </div>
              <div>
                <img 
                  src={pic5} 
                  alt="Our Core Focus" 
                  style={{ 
                    width: '100%', 
                    height: '140px', 
                    objectFit: 'cover', 
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="grid-2-cols">
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '100px', overflow: 'hidden' }}>
                <img src={pic6} alt="" className="img-cover" style={{ height: '100px' }} />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <ShieldCheck color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Verified Members</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Ensuring all our professional records are accurate and reliable.</p>
              </div>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: '100px', overflow: 'hidden' }}>
                <img src={pic3} alt="" className="img-cover" style={{ height: '100px' }} />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <TrendingUp color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Growth Driven</h4>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Providing resources and networking opportunities for business expansion.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Announcements Area */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Megaphone size={24} /> LATEST UPDATES
          </h2>
          {latestAnnouncements.length === 0 ? (
            <p style={{ color: '#999', fontSize: '0.9rem', fontStyle: 'italic', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '6px', textAlign: 'center' }}>
              No updates available.
            </p>
          ) : (
            latestAnnouncements.map(announcement => (
              <div 
                key={announcement.id} 
                className="card" 
                style={{ 
                  marginBottom: '1.25rem', 
                  padding: '1.25rem', 
                  borderLeft: '4px solid var(--primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => setSelectedAnnouncement(announcement)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', textTransform: 'uppercase' }}>{announcement.date}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0.5rem 0' }}>{announcement.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>{announcement.summary || announcement.content}</p>
                <button 
                  className="btn-link" 
                  style={{ padding: 0, fontSize: '0.8rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAnnouncement(announcement);
                  }}
                >
                  READ MORE <ArrowRight size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedAnnouncement && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header section with category and close */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem 1.5rem 1rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--secondary)'
            }}>
              <span style={{ 
                padding: '0.2rem 0.6rem', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {selectedAnnouncement.category || 'Announcement'}
              </span>
              <button 
                onClick={() => setSelectedAnnouncement(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                <Calendar size={14} />
                {selectedAnnouncement.date}
              </div>
              
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem', lineHeight: '1.3' }}>
                {selectedAnnouncement.title}
              </h2>

              {/* Optional event/contact metadata card */}
              {(selectedAnnouncement.venue || selectedAnnouncement.time || selectedAnnouncement.contactPerson || selectedAnnouncement.contactEmail) && (
                <div style={{
                  backgroundColor: '#FFFDF9',
                  border: '1px solid #FEF3C7',
                  borderRadius: '6px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: '0.75rem'
                }}>
                  {selectedAnnouncement.venue && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                      <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span><strong>Venue:</strong> {selectedAnnouncement.venue}</span>
                    </div>
                  )}
                  {selectedAnnouncement.time && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                      <Clock size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span><strong>Time:</strong> {selectedAnnouncement.time}</span>
                    </div>
                  )}
                  {selectedAnnouncement.contactPerson && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                      <User size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span><strong>Contact:</strong> {selectedAnnouncement.contactPerson}</span>
                    </div>
                  )}
                  {selectedAnnouncement.contactEmail && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                      <Mail size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      <span><a href={`mailto:${selectedAnnouncement.contactEmail}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>{selectedAnnouncement.contactEmail}</a></span>
                    </div>
                  )}
                </div>
              )}

              <p style={{ 
                color: '#333', 
                lineHeight: '1.7', 
                fontSize: '1rem', 
                whiteSpace: 'pre-wrap'
              }}>
                {selectedAnnouncement.content}
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: 'var(--secondary)'
            }}>
              <button 
                onClick={() => setSelectedAnnouncement(null)} 
                className="btn"
                style={{ padding: '0.5rem 1.5rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

