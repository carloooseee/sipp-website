import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

export default function Projects() {
  const [projects, setProjects] = useState([
    {
      id: 'default-1',
      title: "Digital Business Directory Launch",
      type: "Past",
      description: "Developed and launched the KDBM digital portal connecting local professionals and businesses.",
      date: "January 2024"
    },
    {
      id: 'default-2',
      title: "Annual Professional Workshop Series",
      type: "Upcoming",
      description: "A series of lectures and mentorship sessions for local entrepreneurs and professionals.",
      date: "Q3 2024"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProjects(fetched);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
