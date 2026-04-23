import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, serverTimestamp, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { Database, ShieldAlert, CheckCircle, UserPlus } from 'lucide-react';

export default function SeedDatabase() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState('admin@kdbm.com');

  const promoteToAdmin = async () => {
    setLoading(true);
    setStatus("Searching for user...");
    try {
      const q = query(collection(db, "members"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`No user found with email ${email}. Please sign up first!`);
      }

      const userDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "members", userDoc.id), {
        role: "Admin",
        status: "Approved"
      });

      setStatus(`Success! ${email} is now an Admin.`);
    } catch (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const seedSamples = async () => {
    setLoading(true);
    setStatus("Seeding samples...");
    try {
      const members = [
        { firstName: "Alice", lastName: "Walker", email: "alice@example.com", role: "Member", status: "Approved" },
        { firstName: "Bob", lastName: "Ross", email: "bob@example.com", role: "Member", status: "Pending" }
      ];

      for (const m of members) {
        await setDoc(doc(collection(db, "members")), {
          ...m,
          phone: "555-0000",
          address: "123 KDBM St.",
          createdAt: serverTimestamp()
        });
      }
      setStatus("Samples seeded successfully!");
    } catch (error) {
      setStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <Database size={64} color="var(--primary)" style={{ marginBottom: '2rem' }} />
      <h1 className="page-title">Database Utility</h1>
      
      <div className="card" style={{ padding: '2rem', border: '2px dashed var(--border)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <UserPlus size={20} /> Promote User to Admin
        </h2>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label className="form-label">Enter Email to Promote</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <button 
          onClick={promoteToAdmin} 
          disabled={loading}
          className="btn btn-full btn-primary"
        >
          {loading ? "PROCESSING..." : "PROMOTE TO ADMIN"}
        </button>
      </div>

      <div className="card" style={{ padding: '2rem', border: '2px dashed var(--border)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Seed Sample Data</h2>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>Create dummy member records for testing.</p>
        <button 
          onClick={seedSamples} 
          disabled={loading}
          className="btn btn-full btn-secondary"
        >
          {loading ? "SEEDING..." : "SEED SAMPLE MEMBERS"}
        </button>
      </div>

      {status && (
        <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '8px', backgroundColor: status.includes('Error') ? '#FEE2E2' : '#D1FAE5', color: status.includes('Error') ? '#991B1B' : '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {status.includes('Success') && <CheckCircle size={18} />}
          {status}
        </div>
      )}
    </div>
  );
}
