import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Briefcase, Trash2, User, AlertCircle, CheckCircle2, Mail } from 'lucide-react';

export default function AdminBulletinBoard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBusinesses = async () => {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'bulletinBoard'), orderBy('businessName', 'asc'));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBusinesses(fetched);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError('Failed to fetch business directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDelete = async (id, bizName) => {
    if (!window.confirm(`Are you sure you want to remove "${bizName}" from the Bulletin Board?`)) return;
    setError('');
    setSuccess('');
    try {
      await deleteDoc(doc(db, 'bulletinBoard', id));
      setSuccess(`Business "${bizName}" removed successfully.`);
      fetchBusinesses();
    } catch (err) {
      console.error('Error deleting business:', err);
      setError('Failed to delete business listing.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Manage Bulletin Board</h1>
        <p className="page-subtitle">View and moderate member-owned business listings in the public directory.</p>
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

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', margin: 0 }}>
            <Briefcase size={20} /> Registered Business Listings ({businesses.length})
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>Loading businesses...</div>
        ) : businesses.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#999' }}>No businesses registered on the Bulletin Board.</div>
        ) : (
          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Business Details</th>
                  <th>Category / Type</th>
                  <th>Owner</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((biz) => (
                  <tr key={biz.id}>
                    <td>
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--primary)' }}>{biz.businessName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.25rem' }}>
                        {biz.businessDescription || 'No description provided.'}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 'bold', backgroundColor: 'var(--secondary)', color: 'var(--primary)', border: '1px solid var(--border)', textTransform: 'uppercase' }}>
                        {biz.businessType || 'General'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: '600' }}>
                        <Mail size={14} color="#666" /> {biz.email}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button onClick={() => handleDelete(biz.id, biz.businessName)} className="btn btn-secondary" style={{ padding: '0.5rem', borderColor: 'var(--border)', color: 'var(--error)' }} title="Remove Listing">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
