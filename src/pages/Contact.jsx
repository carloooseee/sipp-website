import React from 'react';
import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Contact</h1>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', borderStyle: 'dashed' }}>
        <Mail size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
          Contact information will be added here.
        </p>
      </div>
    </div>
  );
}
