import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Briefcase, Calendar, Trash2, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Upcoming');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(fetched);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    if (!title.trim() || !description.trim() || !date.trim()) {
      setError('All fields are required.');
      setSubmitLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'projects'), {
        title: title.trim(),
        type,
        date: date.trim(),
        description: description.trim(),
        createdAt: new Date()
      });

      setSuccess('Project added successfully!');
      setTitle('');
      setDescription('');
      setDate('');
      fetchProjects();
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Failed to create project.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setError('');
    setSuccess('');
    try {
      await deleteDoc(doc(db, 'projects', id));
      setSuccess('Project deleted.');
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Manage Projects</h1>
        <p className="page-subtitle">Add or edit community initiatives and professional projects.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Create Project Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Project
          </h2>

          {error && (
            <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderRadius: '4px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: '#D1FAE5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Project Title</label>
              <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Type</label>
                <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past">Past</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Timeline/Date</label>
                <input type="text" className="form-control" placeholder="e.g. Q3 2026, Dec 2025" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Description</label>
              <textarea className="form-control" style={{ minHeight: '120px', resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <button type="submit" className="btn" disabled={submitLoading} style={{ marginTop: '0.5rem' }}>
              {submitLoading ? 'SAVING...' : 'SAVE PROJECT'}
            </button>
          </form>
        </div>

        {/* Existing Projects List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <h2 style={{ padding: '1.5rem', fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={18} /> Active Projects
          </h2>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>No projects registered yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {projects.map((proj, idx) => (
                <div key={proj.id} style={{ padding: '1.5rem', borderBottom: idx !== projects.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        backgroundColor: proj.type === 'Past' ? '#E2E8F0' : '#C6F6D5',
                        color: proj.type === 'Past' ? '#4A5568' : '#22543D',
                        borderRadius: '999px',
                        fontSize: '0.7rem', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase' 
                      }}>
                        {proj.type}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#888', fontSize: '0.75rem' }}>
                        <Calendar size={12} /> {proj.date}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{proj.description}</p>
                  </div>
                  <button onClick={() => handleDelete(proj.id)} className="btn btn-secondary" style={{ padding: '0.5rem', borderColor: 'var(--border)', color: 'var(--error)' }} title="Delete Project">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
