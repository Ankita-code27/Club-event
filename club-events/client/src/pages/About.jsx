import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Calendar,
  CheckCircle2,
  Users,
} from "lucide-react";
import MissionSection from "../components/MissionSection.jsx";
import "./About.css";

export default function About() {
  return (
    <div className="about-page animate-fade-in">
      {/* Intro Header */}
      <section className="about-hero">
        <div className="container">
          <div className="kicker-tag">
            <Compass size={13} />
            About Nexora
          </div>
          <h1 className="about-hero__title">
            Uniting Campus Life Through Meaningful Experiences
          </h1>
          <p className="about-hero__desc">
            Nexora is the central hub for campus clubs, student initiatives, and
            extracurricular events. We bridge the gap between passionate
            organizers and enthusiastic attendees.
          </p>
        </div>
      </section>

      {/* Reusing Existing Mission Component */}
      <MissionSection />

      {/* How it Works / What Students Can Do */}
      <section className="home-section">
        <div className="container">
          <div className="home-section__head">
            <div>
              <div className="kicker-tag">
                <CheckCircle2 size={13} />
                Simple & Seamless
              </div>
              <h2 className="home-section__title">How Nexora Works</h2>
            </div>
          </div>

          <div className="about-steps-grid">
            <div className="about-step-card">
              <div className="about-step-number">1</div>
              <h3 className="about-step-title">Discover Events</h3>
              <p className="about-step-text">
                Browse upcoming workshops, hackathons, and guest lectures across
                all campus clubs from a single organized calendar.
              </p>
            </div>
            <div className="about-step-card">
              <div className="about-step-number">2</div>
              <h3 className="about-step-title">Register in One Click</h3>
              <p className="about-step-text">
                Sign up with your campus account instantly to reserve your slot
                and receive confirmation details.
              </p>
            </div>
            <div className="about-step-card">
              <div className="about-step-number">3</div>
              <h3 className="about-step-title">Attend & Connect</h3>
              <p className="about-step-text">
                Show up, participate, build projects with peers, and expand your
                network across various campus domains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Styled CTA Banner */}
      <section className="home-cta-section">
        <div className="container">
          <div className="home-cta-card">
            <div className="home-cta-content">
              <div className="home-cta-badge">Get Involved</div>
              <h2 className="home-cta-title">
                Ready to explore upcoming activities?
              </h2>
              <p className="home-cta-desc">
                Find events tailored to your interests and connect with student
                communities across campus.
              </p>
              <div className="home-cta-actions">
                <Link to="/events" className="btn btn--primary btn--lg">
                  Browse Events <ArrowRight size={18} />
                </Link>
                <Link
                  to="/contact"
                  className="btn btn--ghost btn--lg home-cta-ghost-btn"
                >
                  Contact Organizers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
