import React from 'react';
import { Megaphone } from 'lucide-react';

export default function Announcements() {
  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Announcements</h1>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', borderStyle: 'dashed' }}>
        <Megaphone size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
          Announcements will be posted here.
        </p>
      </div>
    </div>
  );
}
