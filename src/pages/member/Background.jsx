import React from 'react';
import { History, MapPin, Landmark } from 'lucide-react';
import { pic2, pic6 } from '../../assets/pictures';

export default function Background() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Background</h1>
        <p className="page-subtitle">Origins and community presence of Kababaihan ng Dasmariñas sa Bagong Milenyo (KDBM).</p>
      </div>

      <div className="card" style={{ marginBottom: '3rem', padding: '2.5rem' }}>
        <div className="grid-2-cols-uneven" style={{ gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Landmark size={32} color="var(--primary)" />
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Organizational Background</h2>
            </div>
            <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#444' }}>
              <p style={{ marginBottom: '1.25rem' }}>
                Kababaihan ng Dasmariñas sa Bagong Milenyo, commonly referred to as KDBM, is publicly described as an all-women volunteer organization based in Dasmariñas, Cavite. UCLG ASPAC states that Mayor Jennifer "Jenny" Austria-Barzaga established KDBM as an all-women volunteer organization that helps the community and supports livelihood programs for its members.
              </p>
              <p style={{ marginBottom: '1.25rem' }}>
                KDBM is associated with women volunteerism and community welfare in Dasmariñas. A public write-up about KDBM in Barangay Salawag describes the organization as composed of women volunteers who help the community and indigent residents, and as a non-government organization that supports good relations with local government projects for community welfare.
              </p>
              <p style={{ marginBottom: 0 }}>
                Public sources also show that KDBM has chapter-based community presence. One public write-up mentions chapters in Barangay Salawag, while a KDBM Sto. Niño 1 Chapter page describes the organization as a women's organization connected with local government projects for community welfare. KDBM has also been connected to community activities involving women leaders, including a 2015 activity intended for 165 KDBM chapter presidents in Dasmariñas.
              </p>
            </div>
          </div>
          <div>
            <img
              src={pic2}
              alt="KDBM organizational background"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '6px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '140px', overflow: 'hidden' }}>
            <img src={pic6} alt="KDBM women volunteers" className="img-cover" style={{ height: '140px' }} />
          </div>
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#FFF7ED',
                borderRadius: '50%',
                marginBottom: '1rem',
                display: 'inline-flex',
              }}
            >
              <History size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>All-Women Volunteers</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
              Established as an all-women volunteer organization in Dasmariñas to help the community and support
              livelihood programs for members.
            </p>
          </div>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '140px', overflow: 'hidden' }}>
            <img src={pic2} alt="KDBM chapters in Dasmariñas" className="img-cover" style={{ height: '140px' }} />
          </div>
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#FFF7ED',
                borderRadius: '50%',
                marginBottom: '1rem',
                display: 'inline-flex',
              }}
            >
              <MapPin size={32} color="var(--primary)" />
            </div>
            <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Chapter-Based Presence</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
              Public sources describe chapter communities such as Barangay Salawag and Sto. Niño 1, connected
              with local government projects for community welfare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
