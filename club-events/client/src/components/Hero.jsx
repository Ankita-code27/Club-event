import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Calendar, Users, Award } from 'lucide-react';
import Button from './Button.jsx';
import './Hero.css';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero-section">
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="hero-ambient-glow-secondary" aria-hidden="true" />

      <div className="container hero-container">
        <div className="hero-badge-wrapper animate-fade-in">
          <div className="hero-live-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">Discover Campus Life</span>
            <span className="hero-badge-divider">•</span>
            <span className="hero-badge-sub">Spring 2026</span>
          </div>
        </div>

        <h1 className="hero-title animate-fade-in-up">
          Connect, Innovate & <br className="hero-title-break" />
          <span className="hero-gradient-text">Discover Events</span>
        </h1>

        <p className="hero-subtitle animate-fade-in-up">
          Explore upcoming college events, workshops, and student community meetups all in one place.
          Never miss out on what's happening around you.
        </p>

        <div className="hero-actions animate-fade-in-up">
          {onExploreClick ? (
            <Button variant="primary" size="lg" onClick={onExploreClick}>
              Explore Events <ArrowRight size={18} />
            </Button>
          ) : (
            <Link to="/events" className="btn btn--primary btn--lg">
              Explore Events <ArrowRight size={18} />
            </Link>
          )}
          <a href="#featured-section" className="btn btn--secondary btn--lg">
            View Featured
          </a>
        </div>

        {/* Club Highlights Strip */}
        <div className="hero-stats-strip animate-fade-in-up">
          <div className="hero-stat-item">
            <div className="hero-stat-icon">
              <Users size={20} />
            </div>
            <div className="hero-stat-content">
              <span className="hero-stat-num">500+</span>
              <span className="hero-stat-label">Active Members</span>
            </div>
          </div>
          <div className="hero-stat-divider" aria-hidden="true" />
          <div className="hero-stat-item">
            <div className="hero-stat-icon">
              <Calendar size={20} />
            </div>
            <div className="hero-stat-content">
              <span className="hero-stat-num">20+</span>
              <span className="hero-stat-label">Events & Workshops</span>
            </div>
          </div>
          <div className="hero-stat-divider" aria-hidden="true" />
          <div className="hero-stat-item">
            <div className="hero-stat-icon">
              <Award size={20} />
            </div>
            <div className="hero-stat-content">
              <span className="hero-stat-num">100%</span>
              <span className="hero-stat-label">Student Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
