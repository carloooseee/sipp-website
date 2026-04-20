import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <h1 className="page-title" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>SIPP</h1>
      
      <p className="page-subtitle" style={{ marginTop: '2rem' }}>Welcome to the SIPP Professional Network</p>
    </div>
  );
}
