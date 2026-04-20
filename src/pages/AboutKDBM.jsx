import React from 'react';
import { Info } from 'lucide-react';

export default function AboutKDBM() {
  return (
    <div className="animate-fade-in">
      <h1 className="page-title">About KDBM</h1>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', borderStyle: 'dashed' }}>
        <Info size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
          Information will be added here.
        </p>
      </div>
    </div>
  );
}
