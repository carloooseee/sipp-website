import React from 'react';
import { Megaphone, Calendar, ArrowRight } from 'lucide-react';

export default function Announcements() {
  const announcements = [
    {
      id: 1,
      title: "KDBM General Assembly 2024",
      date: "May 15, 2024",
      category: "Event",
      content: "Join us for our annual general assembly where we discuss future projects and community initiatives. All members are encouraged to attend."
    },
    {
      id: 2,
      title: "New Member Registration Open",
      date: "April 20, 2024",
      category: "News",
      content: "We are officially opening our digital registration system. New members can now join the KDBM network and promote their businesses online."
    },
    {
      id: 3,
      title: "Community Outreach Program",
      date: "April 10, 2024",
      category: "Project",
      content: "KDBM is launching a new outreach program to support local art and culture. Stay tuned for volunteer opportunities."
    }
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Announcements</h1>
        <p className="page-subtitle">Stay updated with the latest news and events from KDBM.</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {announcements.map((item) => (
          <div key={item.id} className="card" style={{ padding: '1.5rem', transition: 'transform 0.2s ease-in-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ 
                padding: '0.2rem 0.6rem', 
                backgroundColor: 'var(--secondary)', 
                color: 'var(--primary)', 
                borderRadius: '4px', 
                fontSize: '0.75rem', 
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {item.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
                <Calendar size={14} />
                {item.date}
              </div>
            </div>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.75rem' }}>
              {item.title}
            </h3>
            
            <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {item.content}
            </p>
            
            <button className="btn-link" style={{ color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Read More <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
