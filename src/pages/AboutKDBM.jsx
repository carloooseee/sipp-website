import React from 'react';
import { History, Target, Users } from 'lucide-react';

export default function AboutKDBM() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">About KDBM</h1>
        <p className="page-subtitle">Understanding our roots and our vision for the professional community.</p>
      </div>

      <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', marginBottom: '3rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          KDBM is a premier professional network dedicated to excellence and community growth. We provide the tools and connections necessary for local businesses to thrive in an ever-changing economy.
        </p>
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
