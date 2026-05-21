import React from 'react';
import { History, BookOpen, Landmark } from 'lucide-react';
import { pic2, pic6 } from '../../assets/pictures';

export default function Background() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Background of the Organization</h1>
        <p className="page-subtitle">The foundation and history that built the KDBM Professional Network.</p>
      </div>

      <div className="card" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
        <div className="grid-2-cols-uneven" style={{ gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Landmark size={32} color="var(--primary)" />
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Foundational History</h2>
            </div>
            <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#444' }}>
              <p style={{ marginBottom: '1.25rem' }}>
                The KDBM organization was founded on the principles of community solidarity and economic resilience. Originally conceived as a small collective of independent business owners, the organization has grown into a cornerstone of professional life in the region.
              </p>
              <p style={{ marginBottom: '1.25rem' }}>
                In its early years, KDBM focused on informal networking and knowledge sharing. As the professional landscape evolved, the need for a more structured database and a formal system of member advocacy became clear. This led to the development of our current digital infrastructure and membership system.
              </p>
              <p>
                Today, our background serves as a testament to what professionals can achieve when they collaborate. We continue to honor our roots while embracing modern technologies to serve our members better.
              </p>
            </div>
          </div>
          <div>
            <img 
              src={pic2} 
              alt="Foundational History" 
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '400px', 
                objectFit: 'cover', 
                borderRadius: '6px', 
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' 
              }} 
            />
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '140px', overflow: 'hidden' }}>
            <img src={pic6} alt="KDBM through the years" className="img-cover" style={{ height: '140px' }} />
          </div>
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', backgroundColor: '#FFF7ED', borderRadius: '50%', marginBottom: '1rem', display: 'inline-flex' }}>
              <History size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Established</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Over a decade of service to the local professional community.</p>
          </div>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '140px', overflow: 'hidden' }}>
            <img src={pic2} alt="KDBM community values" className="img-cover" style={{ height: '140px' }} />
          </div>
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', backgroundColor: '#FFF7ED', borderRadius: '50%', marginBottom: '1rem', display: 'inline-flex' }}>
              <BookOpen size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Core Values</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>Integrity, collaboration, and professional excellence.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
