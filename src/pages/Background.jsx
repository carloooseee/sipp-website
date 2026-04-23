import React from 'react';
import { History, BookOpen, Landmark } from 'lucide-react';

export default function Background() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Background of the Organization</h1>
        <p className="page-subtitle">The foundation and history that built the KDBM Professional Network.</p>
      </div>

      <div className="card" style={{ marginBottom: '3rem', padding: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Landmark size={32} color="var(--primary)" />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Foundational History</h2>
        </div>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            The KDBM organization was founded on the principles of community solidarity and economic resilience. Originally conceived as a small collective of independent business owners, the organization has grown into a cornerstone of professional life in the region.
          </p>
          <p style={{ marginBottom: '1.5rem' }}>
            In its early years, KDBM focused on informal networking and knowledge sharing. As the professional landscape evolved, the need for a more structured database and a formal system of member advocacy became clear. This led to the development of our current digital infrastructure and membership system.
          </p>
          <p>
            Today, our background serves as a testament to what professionals can achieve when they collaborate. We continue to honor our roots while embracing modern technologies to serve our members better.
          </p>
        </div>
      </div>

      <div className="grid">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#F0F7FF', borderRadius: '50%', marginBottom: '1rem' }}>
            <History size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Established</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Over a decade of service to the local professional community.</p>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '1rem', backgroundColor: '#F0F7FF', borderRadius: '50%', marginBottom: '1rem' }}>
            <BookOpen size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Core Values</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Integrity, collaboration, and professional excellence.</p>
        </div>
      </div>
    </div>
  );
}
