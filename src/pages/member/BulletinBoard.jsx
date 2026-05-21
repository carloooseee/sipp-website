import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Briefcase, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { communityBanner, galleryImages } from '../../assets/pictures';

const RegisterBusinessPanel = () => (
  <aside className="card bulletin-register-panel" aria-label="Register your business">
    <img src={communityBanner} alt="" className="bulletin-register-panel__bg" />
    <div className="bulletin-register-panel__overlay" />
    <div className="bulletin-register-panel__content">
      <h2>List Your Business</h2>
      <p>
        Join the KDBM directory and share your business with members and the community.
      </p>
      <Link to="/register" className="btn btn-secondary">
        REGISTER YOUR BUSINESS
      </Link>
    </div>
  </aside>
);

export default function BulletinBoard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const q = query(collection(db, 'bulletinBoard'), orderBy('businessName', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetched = [];
        querySnapshot.forEach((docSnap) => {
          fetched.push({ id: docSnap.id, ...docSnap.data() });
        });
        setBusinesses(fetched);
      } catch (err) {
        console.error('Error fetching businesses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div className="animate-fade-in">
      <section
        className="page-hero"
        style={{ backgroundImage: `url(${communityBanner})` }}
        aria-labelledby="bulletin-hero-title"
      >
        <h1 id="bulletin-hero-title" className="page-hero-title">Member Business Directory</h1>
        <p className="page-hero-subtitle">Supporting and promoting our local member-owned businesses.</p>
      </section>

      <div className="bulletin-board-layout">
        <div className="bulletin-board-main">
          {loading ? (
            <div className="bulletin-board-loading">Loading business board...</div>
          ) : (
            <div className="grid bulletin-board-grid">
              {businesses.length === 0 ? (
                <div className="card bulletin-board-empty">
                  <h3>No businesses promoted yet.</h3>
                  <p>Businesses will appear here once registered.</p>
                </div>
              ) : (
                businesses.map((biz, index) => {
                  const cardImage = galleryImages[index % galleryImages.length];
                  return (
                    <article key={biz.id} className="card bulletin-card">
                      <div className="card-image-header">
                        <img src={cardImage} alt="" className="img-cover bulletin-card__image" />
                      </div>
                      <div className="bulletin-card__body">
                        <div className="bulletin-card__header">
                          <div className="bulletin-card__icon">
                            <Briefcase size={24} color="var(--primary)" />
                          </div>
                          <div className="bulletin-card__meta">
                            <h3 className="bulletin-card__title">{biz.businessName}</h3>
                            <span className="badge bulletin-card__badge">{biz.businessType}</span>
                          </div>
                        </div>

                        <p className="bulletin-card__description">
                          {biz.businessDescription || 'A valuable member of our business community.'}
                        </p>

                        <div className="bulletin-card__contact">
                          <Mail size={16} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                          <span>Contact: {biz.email}</span>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}
        </div>

        <RegisterBusinessPanel />
      </div>
    </div>
  );
}
