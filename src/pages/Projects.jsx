import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "GABGABGAB GAB GAB",
      type: "Past",
      description: "GABGABGAB GAB GAB",
      date: "GABGABGAB GAB GAB"
    },
        {
      id: 1,
      title: "GABGABGAB GAB GAB",
      type: "Upcoming",
      description: "GABGABGAB GAB GAB",
      date: "GABGABGAB GAB GAB"
    },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Projects</h1>
        <p className="page-subtitle">Past and future initiatives driving our community forward.</p>
      </div>

      <div className="grid">
        {projects.map((project) => (
          <div key={project.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ 
              position: 'absolute', 
              top: '1rem', 
              right: '1rem', 
              padding: '0.25rem 0.75rem', 
              backgroundColor: project.type === 'Past' ? '#E2E8F0' : '#C6F6D5',
              color: project.type === 'Past' ? '#4A5568' : '#22543D',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              {project.type.toUpperCase()}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--secondary)', borderRadius: '4px' }}>
                {project.type === 'Past' ? <Briefcase size={24} color="var(--primary)" /> : <Calendar size={24} color="var(--primary)" />}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                {project.title}
              </h3>
            </div>
            
            <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {project.description}
            </p>
            
            <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: '600' }}>
              Date: {project.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
