import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 className="page-title" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>SIPP</h1>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
          Register Now <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
        </Link>
      </div>
    </div>
  );
}
