import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Briefcase, Calendar, Trash2, Plus, AlertCircle, CheckCircle2, User, Coins, Activity } from 'lucide-react';

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
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [projectLead, setProjectLead] = useState('');
  const [status, setStatus] = useState('Planning');
  const [budget, setBudget] = useState('');

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

    if (!title.trim() || !description.trim() || !date.trim() || !shortDescription.trim() || !projectLead.trim()) {
      setError('Title, timeline, short description, description, and project lead are required.');
      setSubmitLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'projects'), {
        title: title.trim(),
        type,
        date: date.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        projectLead: projectLead.trim(),
        status,
        budget: budget.trim(),
        createdAt: new Date()
      });

      setSuccess('Project added successfully!');
      setTitle('');
      setType('Upcoming');
      setDate('');
      setShortDescription('');
      setDescription('');
      setProjectLead('');
      setStatus('Planning');
      setBudget('');
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

      <div className="grid">
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

            <div className="grid-2-cols">
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

            <div className="grid-2-cols">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> Project Lead</label>
                <input type="text" className="form-control" placeholder="e.g. Jane Doe" value={projectLead} onChange={(e) => setProjectLead(e.target.value)} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Activity size={12} /> Status</label>
                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Coins size={12} /> Budget (Optional)</label>
              <input type="text" className="form-control" placeholder="e.g. $10,000 or Community Funded" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Short Description (For Card Preview)</label>
              <input type="text" className="form-control" placeholder="Short teaser summary" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Detailed Description</label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
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
                      <span style={{ 
                        padding: '0.2rem 0.6rem', 
                        backgroundColor: 
                          proj.status === 'Completed' ? '#D1FAE5' :
                          proj.status === 'In Progress' ? '#DBEAFE' :
                          proj.status === 'Delayed' ? '#FEE2E2' : '#FEF3C7',
                        color: 
                          proj.status === 'Completed' ? '#065F46' :
                          proj.status === 'In Progress' ? '#1E40AF' :
                          proj.status === 'Delayed' ? '#991B1B' : '#92400E',
                        borderRadius: '999px',
                        fontSize: '0.7rem', 
                        fontWeight: 'bold', 
                        textTransform: 'uppercase' 
                      }}>
                        {proj.status || 'Planning'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#888', fontSize: '0.75rem' }}>
                        <Calendar size={12} /> {proj.date}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{proj.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', marginBottom: '0.5rem' }}>{proj.shortDescription}</p>
                    <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.5', whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>{proj.description}</p>
                    
                    {/* Optional metadata preview */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.75rem', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fcfcfc', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.75rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={12} color="var(--primary)" /> <strong>Lead:</strong> {proj.projectLead || 'N/A'}
                      </span>
                      {proj.budget && (
                        <span style={{ fontSize: '0.75rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Coins size={12} color="var(--primary)" /> <strong>Budget:</strong> {proj.budget}
                        </span>
                      )}
                    </div>
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
