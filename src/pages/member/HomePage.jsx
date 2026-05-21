import React, { useEffect, useState } from 'react';
import { Megaphone, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

export default function HomePage() {
  const [latestAnnouncements, setLatestAnnouncements] = useState([
    {
      id: 'default-1',
      title: "Annual General Meeting 2024",
      content: "Join us for our upcoming AGM on May 15th to discuss the future roadmap of KDBM.",
      date: "2024-04-20"
    },
    {
      id: 'default-2',
      title: "New Member Networking Night",
      content: "Meet and greet session for all new members registered in the first quarter.",
      date: "2024-04-18"
    }
  ]);

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

  return (
    <div className="animate-fade-in">
      {/* Hero / Overview Section */}
      <section style={{ marginBottom: '4rem', textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '8px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.05em' }}>KDBM Overview</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', opacity: '0.9', lineHeight: '1.6' }}>
          The KDBM Professional Network is dedicated to fostering growth, collaboration, and professional excellence among our local community members.
        </p>
      </section>

      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
        {/* Main Content Area */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={24} /> OUR CORE FOCUS
          </h2>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <p style={{ lineHeight: '1.8', color: '#444' }}>
              We provide a robust platform for professionals to showcase their businesses, connect with potential partners, and stay updated on local economic initiatives. Our goal is to build a self-sustaining ecosystem of excellence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
              <ShieldCheck color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Verified Members</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Ensuring all our professional records are accurate and reliable.</p>
            </div>
            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
              <TrendingUp color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Growth Driven</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Providing resources and networking opportunities for business expansion.</p>
            </div>
          </div>
        </div>

        {/* Sidebar / Announcements Area */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Megaphone size={24} /> LATEST UPDATES
          </h2>
          {latestAnnouncements.map(announcement => (
            <div key={announcement.id} className="card" style={{ marginBottom: '1.25rem', padding: '1.25rem', borderLeft: '4px solid var(--primary)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', textTransform: 'uppercase' }}>{announcement.date}</span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0.5rem 0' }}>{announcement.title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>{announcement.content}</p>
              <button className="btn-link" style={{ padding: 0, fontSize: '0.8rem' }}>READ MORE <ArrowRight size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
