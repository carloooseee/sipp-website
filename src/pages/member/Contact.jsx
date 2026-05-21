import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { pic4 } from '../../assets/pictures';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully! Thank you for contacting KDBM.');
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">Get in touch with the KDBM team. We'd love to hear from you.</p>
      </div>

      <div className="grid-2-cols" style={{ gap: '3rem', alignItems: 'stretch', marginBottom: '3rem' }}>
        {/* Left Column: Form */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)' }}>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input type="text" id="name" className="form-control" required placeholder="Enter your full name" style={{ backgroundColor: 'var(--white)' }} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input type="email" id="email" className="form-control" required placeholder="Enter your email address" style={{ backgroundColor: 'var(--white)' }} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="subject">Subject</label>
              <input type="text" id="subject" className="form-control" required placeholder="What is this regarding?" style={{ backgroundColor: 'var(--white)' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="message">Message</label>
              <textarea id="message" rows="5" className="form-control" required placeholder="Type your message here..." style={{ backgroundColor: 'var(--white)', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
            </div>
            <button type="submit" className="btn btn-full" style={{ gap: '0.5rem' }}>
              <Send size={18} /> SEND MESSAGE
            </button>
          </form>
        </div>

        {/* Right Column: Image with Orange Overlay and Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ 
            position: 'relative', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            minHeight: '220px', 
            flex: 1,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src={pic4} 
              alt="Our Office" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '220px' }} 
            />
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(194, 65, 12, 0.75), rgba(194, 24, 21, 0.5))',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2rem',
              color: 'white'
            }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '900', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '0.5rem' }}>KDBM HQ</h3>
              <p style={{ fontSize: '0.95rem', opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Connecting professionals daily.</p>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 0, padding: '2rem' }}>
            <h3 style={{ fontWeight: '800', marginBottom: '1.5rem', color: 'var(--primary)' }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#FFF7ED', borderRadius: '50%', color: 'var(--primary)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: '600' }}>EMAIL</div>
                  <a href="mailto:info@kdbm.org" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: '500' }}>info@kdbm.org</a>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#FFF7ED', borderRadius: '50%', color: 'var(--primary)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: '600' }}>PHONE</div>
                  <span style={{ fontWeight: '500' }}>+1 (555) 123-4567</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#FFF7ED', borderRadius: '50%', color: 'var(--primary)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: '600' }}>ADDRESS</div>
                  <span style={{ fontWeight: '500' }}>123 Professional Network Way, Suite 400</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
