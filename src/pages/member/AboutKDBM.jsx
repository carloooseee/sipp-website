import React from 'react';
import { Target, Eye, Users } from 'lucide-react';
import { pic1 } from '../../assets/pictures';

export default function AboutKDBM() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '3rem' }}>
        <h1 className="page-title">About KDBM</h1>
        <p className="page-subtitle">Kababaihan ng Dasmariñas sa Bagong Milenyo — women-led volunteer service in Dasmariñas.</p>
      </div>

      <p
        style={{
          fontSize: '0.9rem',
          color: '#666',
          lineHeight: 1.6,
          marginBottom: '2rem',
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--secondary)',
          borderLeft: '4px solid var(--accent-orange)',
          borderRadius: '4px',
        }}
      >
        No official Vision and Mission statement was found in publicly reviewed sources. The statements below are proposed based on KDBM's described community role (e.g. UCLG ASPAC and related public write-ups).
      </p>

      <div className="grid-2-cols-uneven" style={{ alignItems: 'stretch', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', marginBottom: '2rem' }}>
            <p style={{ marginBottom: '1.25rem' }}>
              KDBM serves as a women-led volunteer organization that supports community welfare, livelihood-related efforts, and local public service participation in Dasmariñas. Its publicly documented role includes helping communities, supporting livelihood programs, and participating in local activities connected with women and family welfare.
            </p>
            <p style={{ marginBottom: '1.25rem' }}>
              The organization represents and mobilizes women, including mothers and community volunteers, who contribute to neighborhood-level service and welfare activities. Public write-ups describe KDBM members as women volunteers involved in activities such as community cleaning, feeding programs, assistance for families, gift-giving, and livelihood training for housewives. Many of these examples come from the Barangay Salawag context and should not be treated as a complete official list of programs citywide.
            </p>
            <p style={{ margin: 0 }}>
              Today, KDBM remains relevant as a platform for women's participation in community service and local development in Dasmariñas. Public references connect KDBM with women empowerment, livelihood support, community welfare, and cooperation with local government initiatives.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
              <Eye size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: '800', marginBottom: '0.35rem' }}>Vision</h3>
              <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', margin: 0 }}>
                To be a community-centered women's organization in Dasmariñas that empowers women through volunteerism, livelihood support, and active participation in programs that promote the welfare of families and communities.
              </p>
            </div>
            <div className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
              <Target size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: '800', marginBottom: '0.35rem' }}>Mission</h3>
              <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', margin: 0 }}>
                KDBM aims to encourage women's participation in community service, support livelihood and welfare initiatives, and help strengthen cooperation between women volunteers, local communities, and local government programs in Dasmariñas.
              </p>
            </div>
            <div className="card" style={{ marginBottom: 0, padding: '1.5rem' }}>
              <Users size={24} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>Who We Serve</h3>
              <p style={{ fontSize: '0.95rem', color: '#666', lineHeight: '1.6', margin: 0 }}>
                Women, mothers, and community volunteers in Dasmariñas who contribute to neighborhood-level
                service and welfare activities across chapter communities.
              </p>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', minHeight: '350px' }}>
          <img
            src={pic1}
            alt="About KDBM"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '350px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '-12px',
              bottom: '-12px',
              left: '12px',
              border: '2px solid var(--accent-orange)',
              borderRadius: '8px',
              zIndex: -1,
            }}
          />
        </div>
      </div>
    </div>
  );
}
