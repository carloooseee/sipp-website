import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Database, ShieldAlert, CheckCircle } from 'lucide-react';

export default function SeedDatabase() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const seed = async () => {
    setLoading(true);
    setStatus("Seeding...");
    try {
      // 1. We will use a fixed ID for the admin doc so you can link it to your Auth account.
      const sampleAdminId = "admin-master-user"; 
      
      await setDoc(doc(db, "members", sampleAdminId), {
        firstName: "System",
        lastName: "Admin",
        email: "admin@kdbm.com",
        role: "Admin",
        status: "Approved",
        createdAt: serverTimestamp()
      });

      // 2. Create Sample Members
      const members = [
        { id: "member-1", firstName: "Alice", lastName: "Walker", email: "alice@example.com", role: "Member", status: "Approved" },
        { id: "member-2", firstName: "Bob", lastName: "Ross", email: "bob@example.com", role: "Member", status: "Pending" },
        { id: "member-3", firstName: "Charlie", lastName: "Brown", email: "charlie@example.com", role: "Member", status: "Pending" }
      ];

      for (const m of members) {
        const { id, ...data } = m;
        await setDoc(doc(db, "members", id), {
          ...data,
          phone: "555-0000",
          address: "123 KDBM St.",
          createdAt: serverTimestamp()
        });
      }

      // 3. Create Bulletin Board Listings
      const listings = [
        { ownerId: "member-1", firstName: "Alice", lastName: "Walker", businessName: "Alice's Arts", businessType: "Art Studio", businessDescription: "Beautiful landscape paintings." },
        { ownerId: "member-2", firstName: "Bob", lastName: "Ross", businessName: "Happy Trees", businessType: "Landscaping", businessDescription: "We paint your garden with nature." }
      ];

      for (const l of listings) {
        await setDoc(doc(collection(db, "bulletinBoard")), {
          ...l,
          createdAt: serverTimestamp()
        });
      }

      setStatus("Success! Database seeded.");
    } catch (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <Database size={64} color="var(--primary)" style={{ marginBottom: '2rem' }} />
      <h1 className="page-title">Database Initializer</h1>
      <p className="page-subtitle">Click below to seed your Firestore with an Admin account and sample member data.</p>
      
      <div className="card" style={{ padding: '2rem', border: '2px dashed var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#FFFBEB', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'left' }}>
          <ShieldAlert color="#D97706" size={24} />
          <p style={{ fontSize: '0.85rem', color: '#92400E', margin: 0 }}>
            <strong>IMPORTANT:</strong> This will create a Firestore record for <code>admin@kdbm.com</code>. 
            You still need to "Sign Up" with this email on the login page to create the Auth account.
          </p>
        </div>

        <button 
          onClick={seed} 
          disabled={loading}
          className="btn btn-full btn-primary"
        >
          {loading ? "SEEDING..." : "RUN DATABASE SEED"}
        </button>

        {status && (
          <div style={{ marginTop: '1.5rem', color: status.includes('Error') ? 'red' : 'green', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {status.includes('Success') && <CheckCircle size={18} />}
            {status}
          </div>
        )}
      </div>

      <p style={{ marginTop: '2rem', color: '#888', fontSize: '0.9rem' }}>
        After seeding, go to the <strong>Join Us</strong> page and sign up as <code>admin@kdbm.com</code>.
      </p>
    </div>
  );
}
