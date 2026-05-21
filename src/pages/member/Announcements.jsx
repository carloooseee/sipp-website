import React, { useEffect, useState } from 'react';
import { Megaphone, Calendar, ArrowRight, X, MapPin, Clock, User, Mail } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAnnouncements(fetched);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
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
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Announcements</h1>
        <p className="page-subtitle">Stay updated with the latest news and events from KDBM.</p>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
          <p>Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>No announcements published yet.</h3>
          <p style={{ color: '#666' }}>Check back later for news and events.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {announcements.map((item) => (
            <div 
              key={item.id} 
              className="card" 
              style={{ 
                padding: '1.5rem', 
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedAnnouncement(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ 
                  padding: '0.2rem 0.6rem', 
                  backgroundColor: 'var(--secondary)', 
                  color: 'var(--primary)', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  {item.category}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
                  <Calendar size={14} />
                  {item.date}
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.75rem' }}>
                {item.title}
              </h3>
              
              <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {item.summary || item.content}
              </p>
              
              <button 
                className="btn-link" 
                style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnouncement(item);
                }}
              >
                Read More <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

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
                {selectedAnnouncement.category}
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

