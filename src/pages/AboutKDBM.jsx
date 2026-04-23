import React from 'react';
import { History, Target, Users } from 'lucide-react';

export default function AboutKDBM() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">About KDBM</h1>
        <p className="page-subtitle">Understanding our roots and our vision for the professional community.</p>
      </div>

      <div className="card" style={{ marginBottom: '3rem', padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <History size={32} color="var(--primary)" />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Our Background & History</h2>
        </div>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Established with the goal of unifying local professionals, KDBM began as a small networking group of business owners looking to support one another during economic shifts. Over the years, it has evolved into a structured organization dedicated to professional excellence.
          </p>
          <p>
            Our history is built on the success of our members. From the first registered business to our current expansive directory, every step has been taken with the community's best interests in mind. We believe that by documenting our background, we provide a foundation for future members to build upon.
          </p>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <Target size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: '800', marginBottom: '0.75rem' }}>Our Mission</h3>
          <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
            To create a transparent and accessible database of professionals that encourages local trade and professional development.
          </p>
        </div>
        <div className="card">
          <Users size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: '800', marginBottom: '0.75rem' }}>Our Community</h3>
          <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
            A diverse network of business owners, freelancers, and experts across various industries in the KDBM region.
          </p>
        </div>
      </div>
    </div>
  );
}
