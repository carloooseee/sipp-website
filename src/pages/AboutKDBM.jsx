import React, { useEffect, useState } from 'react';
import { History, Target, Users } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AboutKDBM() {
  const [description, setDescription] = useState('KDBM is a premier professional network dedicated to excellence and community growth. We provide the tools and connections necessary for local businesses to thrive in an ever-changing economy.');
  const [mission, setMission] = useState('To create a transparent and accessible database of professionals that encourages local trade and professional development.');
  const [community, setCommunity] = useState('A diverse network of business owners, freelancers, and experts across various industries in the KDBM region.');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const snap = await getDoc(doc(db, 'pageContent', 'about'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.description) setDescription(d.description);
          if (d.mission) setMission(d.mission);
          if (d.community) setCommunity(d.community);
        }
      } catch (err) {
        console.error('Error fetching About content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">About KDBM</h1>
        <p className="page-subtitle">Understanding our roots and our vision for the professional community.</p>
      </div>

      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', marginBottom: '3rem' }}>
        <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
          {description}
        </p>
      </div>

      <div className="grid">
        <div className="card">
          <Target size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: '800', marginBottom: '0.75rem' }}>Our Mission</h3>
          <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {mission}
          </p>
        </div>
        <div className="card">
          <Users size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: '800', marginBottom: '0.75rem' }}>Our Community</h3>
          <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {community}
          </p>
        </div>
      </div>
    </div>
  );
}
