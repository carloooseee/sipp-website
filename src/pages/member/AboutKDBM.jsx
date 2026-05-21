import React from 'react';
import { Target, Users } from 'lucide-react';
import { pic1 } from '../../assets/pictures';

export default function AboutKDBM() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">About KDBM</h1>
        <p className="page-subtitle">Understanding our roots and our vision for the professional community.</p>
      </div>

      <div className="grid-2-cols-uneven" style={{ alignItems: 'stretch', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', marginBottom: '2rem' }}>
            <p>
              KDBM is a premier professional network dedicated to excellence and community growth. We provide the tools and connections necessary for local businesses to thrive in an ever-changing economy.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
              <Target size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Our Mission</h3>
              <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
                To create a transparent and accessible database of professionals that encourages local trade and professional development.
              </p>
            </div>
            <div className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
              <Users size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Our Community</h3>
              <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6' }}>
                A diverse network of business owners, freelancers, and experts across various industries in the KDBM region.
              </p>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', minHeight: '350px' }}>
          <img 
            src={pic1} 
            alt="About KDBM" 
            style={{ 
              width: '100%', 
              height: '100%', 
              minHeight: '350px',
              objectFit: 'cover', 
              borderRadius: '8px', 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }} 
          />
          {/* Subtle orange decorative background accent box */}
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '-12px',
            bottom: '-12px',
            left: '12px',
            border: '2px solid var(--accent-orange)',
            borderRadius: '8px',
            zIndex: -1
          }}></div>
        </div>
      </div>
    </div>
  );
}
