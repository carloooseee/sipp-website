import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, X, User, Coins, Activity, ArrowRight } from 'lucide-react';
import { db } from '../../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { projectImages } from '../../assets/pictures';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

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

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const projectsHero = projectImages[0];

  return (
    <div className="animate-fade-in">
      <section
        className="page-hero"
        style={{ backgroundImage: `url(${projectsHero})` }}
        aria-labelledby="projects-hero-title"
      >
        <h1 id="projects-hero-title" className="page-hero-title">Projects</h1>
        <p className="page-hero-subtitle">Past and future initiatives driving our community forward.</p>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#666', gridColumn: '1 / -1' }}>
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#999', gridColumn: '1 / -1' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>No projects registered yet.</h3>
          <p style={{ color: '#666' }}>Check back later for community initiatives.</p>
        </div>
      ) : (
        <div className="grid">
          {projects.map((project, index) => {
            const projectImg = projectImages[index % projectImages.length];
            return (
              <div 
                key={project.id} 
                className="card" 
                style={{ 
                  position: 'relative', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  marginBottom: 0
                }}
                onClick={() => setSelectedProject(project)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px -3px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                }}
              >
                {/* Banner Image */}
                <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                  <img 
                    src={projectImg} 
                    alt={project.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    display: 'flex',
                    gap: '0.35rem',
                    zIndex: 2
                  }}>
                    <span style={{ 
                      padding: '0.2rem 0.6rem', 
                      backgroundColor: project.type === 'Past' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(198, 246, 213, 0.9)',
                      color: project.type === 'Past' ? '#4A5568' : '#22543D',
                      borderRadius: '999px',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {project.type.toUpperCase()}
                    </span>
                    {project.status && (
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        backgroundColor: 
                          project.status === 'Completed' ? 'rgba(209, 250, 229, 0.9)' :
                          project.status === 'In Progress' ? 'rgba(219, 234, 254, 0.9)' :
                          project.status === 'Delayed' ? 'rgba(254, 226, 226, 0.9)' : 'rgba(254, 243, 199, 0.9)',
                        color: 
                          project.status === 'Completed' ? '#065F46' :
                          project.status === 'In Progress' ? '#1E40AF' :
                          project.status === 'Delayed' ? '#991B1B' : '#92400E',
                        borderRadius: '999px',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {project.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ padding: '0.4rem', backgroundColor: 'var(--secondary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {project.type === 'Past' ? <Briefcase size={16} color="var(--primary)" /> : <Calendar size={16} color="var(--primary)" />}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '850', color: 'var(--primary)', lineHeight: '1.2' }}>
                        {project.title}
                      </h3>
                    </div>
                    
                    <p style={{ color: '#555', lineHeight: '1.5', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                      {project.shortDescription || project.description}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: 'auto' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: '600' }}>
                      Timeline: {project.date}
                    </div>
                    <span className="btn-link" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}>
                      Details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Overlay */}
      {selectedProject && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid var(--border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--secondary)'
            }}>
              <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>PROJECT DETAILS</span>
              <button 
                onClick={() => setSelectedProject(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Banner Image in Modal */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
              <img 
                src={projectImages[projects.indexOf(selectedProject) % projectImages.length]} 
                alt={selectedProject.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))'
              }}></div>
              
              <div style={{ position: 'absolute', bottom: '1rem', left: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <span style={{ 
                  padding: '0.2rem 0.6rem', 
                  backgroundColor: selectedProject.type === 'Past' ? 'rgba(226, 232, 240, 0.95)' : 'rgba(198, 246, 213, 0.95)',
                  color: selectedProject.type === 'Past' ? '#4A5568' : '#22543D',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  backdropFilter: 'blur(4px)'
                }}>
                  {selectedProject.type.toUpperCase()}
                </span>
                {selectedProject.status && (
                  <span style={{ 
                    padding: '0.2rem 0.6rem', 
                    backgroundColor: 
                      selectedProject.status === 'Completed' ? 'rgba(209, 250, 229, 0.95)' :
                      selectedProject.status === 'In Progress' ? 'rgba(219, 234, 254, 0.95)' :
                      selectedProject.status === 'Delayed' ? 'rgba(254, 226, 226, 0.95)' : 'rgba(254, 243, 199, 0.95)',
                    color: 
                      selectedProject.status === 'Completed' ? '#065F46' :
                      selectedProject.status === 'In Progress' ? '#1E40AF' :
                      selectedProject.status === 'Delayed' ? '#991B1B' : '#92400E',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {selectedProject.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1 }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.25rem', lineHeight: '1.3' }}>
                {selectedProject.title}
              </h2>

              {/* Stats Card */}
              <div style={{
                backgroundColor: '#FFFDF9',
                border: '1px solid #FEF3C7',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                  <Calendar size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span><strong>Timeline:</strong> {selectedProject.date}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                  <User size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span><strong>Project Lead:</strong> {selectedProject.projectLead || 'N/A'}</span>
                </div>

                {selectedProject.budget && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                    <Coins size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span><strong>Budget:</strong> {selectedProject.budget}</span>
                  </div>
                )}
                
                {selectedProject.status && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#555' }}>
                    <Activity size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span><strong>Current Status:</strong> {selectedProject.status}</span>
                  </div>
                )}
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#777', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                Project Scope & Details
              </h4>
              <p style={{ 
                color: '#333', 
                lineHeight: '1.7', 
                fontSize: '1rem', 
                whiteSpace: 'pre-wrap'
              }}>
                {selectedProject.description}
              </p>
            </div>

            {/* Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: 'var(--secondary)'
            }}>
              <button 
                onClick={() => setSelectedProject(null)} 
                className="btn"
                style={{ padding: '0.5rem 1.5rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

