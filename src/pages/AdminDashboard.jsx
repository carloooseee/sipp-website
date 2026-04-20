import React from 'react';
import { Settings } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Admin Dashboard</h1>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', borderStyle: 'dashed' }}>
        <Settings size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
          Dashboard features will be added here.
        </p>
      </div>
    </div>
  );
}
