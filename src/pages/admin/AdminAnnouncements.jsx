import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Megaphone, Calendar, Trash2, Plus, AlertCircle, CheckCircle2, MapPin, Clock, User, Mail } from 'lucide-react';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('News');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [venue, setVenue] = useState('');
  const [time, setTime] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(fetched);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to fetch announcements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    if (!title.trim() || !content.trim() || !summary.trim()) {
      setError('Title, summary, and content are required.');
      setSubmitLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'announcements'), {
        title: title.trim(),
        category,
        date: date.trim(),
        summary: summary.trim(),
        content: content.trim(),
        venue: venue.trim(),
        time: time.trim(),
        contactPerson: contactPerson.trim(),
        contactEmail: contactEmail.trim(),
        createdAt: new Date()
      });

      setSuccess('Announcement added successfully!');
      setTitle('');
      setCategory('News');
      setDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
      setSummary('');
      setContent('');
      setVenue('');
      setTime('');
      setContactPerson('');
      setContactEmail('');
      fetchAnnouncements();
    } catch (err) {
      console.error('Error adding announcement:', err);
      setError('Failed to create announcement.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    setError('');
    setSuccess('');
    try {
      await deleteDoc(doc(db, 'announcements', id));
      setSuccess('Announcement deleted.');
      fetchAnnouncements();
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Manage Announcements</h1>
        <p className="page-subtitle">Publish dynamic updates, events, and news for members.</p>
      </div>

      <div className="admin-layout">
        {/* Create Announcement Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Announcement
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
              <label className="form-label">Title</label>
              <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="grid-2-cols">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="News">News</option>
                  <option value="Event">Event</option>
                  <option value="Project">Project</option>
                  <option value="Alert">Alert</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date Label</label>
                <input type="text" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Brief Summary (For Card Preview)</label>
              <input type="text" className="form-control" placeholder="Short teaser/intro sentence" value={summary} onChange={(e) => setSummary(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Detailed Content</label>
              <textarea className="form-control" style={{ minHeight: '120px', resize: 'vertical' }} value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>

            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#666', borderBottom: '1px dashed var(--border)', paddingBottom: '0.25rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              Event / Contact Info (Optional)
            </h3>

            <div className="grid-2-cols">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} /> Venue</label>
                <input type="text" className="form-control" placeholder="e.g. Conference Room A" value={venue} onChange={(e) => setVenue(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Time</label>
                <input type="text" className="form-control" placeholder="e.g. 2:00 PM - 5:00 PM" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>

            <div className="grid-2-cols">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} /> Contact Person</label>
                <input type="text" className="form-control" placeholder="e.g. Jane Doe" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={12} /> Contact Email</label>
                <input type="email" className="form-control" placeholder="e.g. jane@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn" disabled={submitLoading} style={{ marginTop: '0.5rem' }}>
              {submitLoading ? 'PUBLISHING...' : 'PUBLISH ANNOUNCEMENT'}
            </button>
          </form>
        </div>

        {/* Existing Announcements List */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <h2 style={{ padding: '1.5rem', fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Megaphone size={18} /> Published Updates
          </h2>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>Loading announcements...</div>
          ) : announcements.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>No announcements published yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {announcements.map((ann, idx) => (
                <div key={ann.id} style={{ padding: '1.5rem', borderBottom: idx !== announcements.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', backgroundColor: 'var(--secondary)', color: 'var(--primary)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {ann.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#888', fontSize: '0.75rem' }}>
                        <Calendar size={12} /> {ann.date}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.25rem' }}>{ann.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', marginBottom: '0.5rem' }}>{ann.summary}</p>
                    <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.5', whiteSpace: 'pre-wrap', marginBottom: '0.75rem' }}>{ann.content}</p>
                    
                    {/* Optional metadata preview */}
                    {(ann.venue || ann.time || ann.contactPerson || ann.contactEmail) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 0.75rem', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fcfcfc', borderRadius: '4px', border: '1px solid var(--border)' }}>
                        {ann.venue && (
                          <span style={{ fontSize: '0.75rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={12} color="var(--primary)" /> <strong>Venue:</strong> {ann.venue}
                          </span>
                        )}
                        {ann.time && (
                          <span style={{ fontSize: '0.75rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Clock size={12} color="var(--primary)" /> <strong>Time:</strong> {ann.time}
                          </span>
                        )}
                        {ann.contactPerson && (
                          <span style={{ fontSize: '0.75rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <User size={12} color="var(--primary)" /> <strong>Contact:</strong> {ann.contactPerson}
                          </span>
                        )}
                        {ann.contactEmail && (
                          <span style={{ fontSize: '0.75rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Mail size={12} color="var(--primary)" /> {ann.contactEmail}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <button onClick={() => handleDelete(ann.id)} className="btn btn-secondary" style={{ padding: '0.5rem', borderColor: 'var(--border)', color: 'var(--error)' }} title="Delete Announcement">
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
