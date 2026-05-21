import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FileText, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminPageContent() {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // About page states
  const [aboutDesc, setAboutDesc] = useState('');
  const [aboutMission, setAboutMission] = useState('');
  const [aboutCommunity, setAboutCommunity] = useState('');

  // Background page states
  const [bgHistory, setBgHistory] = useState('');
  const [bgEstablished, setBgEstablished] = useState('');
  const [bgValues, setBgValues] = useState('');

  // Fallbacks matching original static files
  const defaultAbout = {
    description: 'KDBM is a premier professional network dedicated to excellence and community growth. We provide the tools and connections necessary for local businesses to thrive in an ever-changing economy.',
    mission: 'To create a transparent and accessible database of professionals that encourages local trade and professional development.',
    community: 'A diverse network of business owners, freelancers, and experts across various industries in the KDBM region.'
  };

  const defaultBackground = {
    history: 'The KDBM organization was founded on the principles of community solidarity and economic resilience. Originally conceived as a small collective of independent business owners, the organization has grown into a cornerstone of professional life in the region.\n\nIn its early years, KDBM focused on informal networking and knowledge sharing. As the professional landscape evolved, the need for a more structured database and a formal system of member advocacy became clear. This led to the development of our current digital infrastructure and membership system.\n\nToday, our background serves as a testament to what professionals can achieve when they collaborate. We continue to honor our roots while embracing modern technologies to serve our members better.',
    established: 'Over a decade of service to the local professional community.',
    values: 'Integrity, collaboration, and professional excellence.'
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch About doc
      const aboutRef = doc(db, 'pageContent', 'about');
      const aboutSnap = await getDoc(aboutRef);
      if (aboutSnap.exists()) {
        const d = aboutSnap.data();
        setAboutDesc(d.description || '');
        setAboutMission(d.mission || '');
        setAboutCommunity(d.community || '');
      } else {
        setAboutDesc(defaultAbout.description);
        setAboutMission(defaultAbout.mission);
        setAboutCommunity(defaultAbout.community);
      }

      // 2. Fetch Background doc
      const bgRef = doc(db, 'pageContent', 'background');
      const bgSnap = await getDoc(bgRef);
      if (bgSnap.exists()) {
        const d = bgSnap.data();
        setBgHistory(d.history || '');
        setBgEstablished(d.established || '');
        setBgValues(d.values || '');
      } else {
        setBgHistory(defaultBackground.history);
        setBgEstablished(defaultBackground.established);
        setBgValues(defaultBackground.values);
      }
    } catch (err) {
      console.error('Error fetching page content:', err);
      setError('Failed to load page content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaveLoading(true);

    try {
      await setDoc(doc(db, 'pageContent', 'about'), {
        description: aboutDesc.trim(),
        mission: aboutMission.trim(),
        community: aboutCommunity.trim(),
        updatedAt: new Date()
      });
      setSuccess('About Page content updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving About page data:', err);
      setError('Failed to save About page content.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveBackground = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaveLoading(true);

    try {
      await setDoc(doc(db, 'pageContent', 'background'), {
        history: bgHistory.trim(),
        established: bgEstablished.trim(),
        values: bgValues.trim(),
        updatedAt: new Date()
      });
      setSuccess('Background Page content updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error saving Background page data:', err);
      setError('Failed to save Background page content.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', fontFamily: 'Inter, sans-serif', color: 'var(--primary)', fontWeight: '600' }}>
        Loading page editor content...
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Manage Page Content</h1>
        <p className="page-subtitle">Customize static copy, mission, vision, history, and milestones.</p>
      </div>

      {error && (
        <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderRadius: '4px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {success && (
        <div style={{ backgroundColor: '#D1FAE5', border: '1px solid #A7F3D0', color: '#065F46', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* About Page Editor Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Edit About Page Copy
          </h2>

          <form onSubmit={handleSaveAbout} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Introduction / Main Description</label>
              <textarea className="form-control" style={{ minHeight: '120px', resize: 'vertical' }} value={aboutDesc} onChange={(e) => setAboutDesc(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mission Statement</label>
              <textarea className="form-control" style={{ minHeight: '80px', resize: 'vertical' }} value={aboutMission} onChange={(e) => setAboutMission(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Community Summary</label>
              <textarea className="form-control" style={{ minHeight: '80px', resize: 'vertical' }} value={aboutCommunity} onChange={(e) => setAboutCommunity(e.target.value)} required />
            </div>

            <button type="submit" className="btn" disabled={saveLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Save size={16} /> {saveLoading ? 'SAVING...' : 'UPDATE ABOUT PAGE'}
            </button>
          </form>
        </div>

        {/* Background Page Editor Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> Edit Background Page Copy
          </h2>

          <form onSubmit={handleSaveBackground} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Organization History</label>
              <textarea className="form-control" style={{ minHeight: '160px', resize: 'vertical' }} value={bgHistory} onChange={(e) => setBgHistory(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Established Card Subtitle</label>
              <input type="text" className="form-control" value={bgEstablished} onChange={(e) => setBgEstablished(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Core Values Card Subtitle</label>
              <input type="text" className="form-control" value={bgValues} onChange={(e) => setBgValues(e.target.value)} required />
            </div>

            <button type="submit" className="btn" disabled={saveLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Save size={16} /> {saveLoading ? 'SAVING...' : 'UPDATE BACKGROUND PAGE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
