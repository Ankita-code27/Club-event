import { Hammer, Users, PartyPopper, Sparkles } from 'lucide-react';
import IconFeature from './IconFeature.jsx';
import './MissionSection.css';

const FEATURES = [
  {
    icon: Hammer,
    title: 'Build together',
    description: 'Hands-on workshops and hackathons where you ship something real, not just watch a demo.',
  },
  {
    icon: Users,
    title: 'Find your people',
    description: 'A community of students across majors who show up for each other, on and off campus.',
  },
  {
    icon: PartyPopper,
    title: 'Celebrate the wins',
    description: 'From a first pull request to a finished project, every milestone gets marked.',
  },
];

export default function MissionSection() {
  return (
    <section className="mission-section">
      <div className="container">
        <div className="mission__header">
          <div className="kicker-tag">
            <span className="kicker-tag__dot" />
            Our Community & Mission
          </div>
          <h2 className="mission__title">What NEXORA is about</h2>
          <p className="mission__subtitle">
            We're a student-run club for anyone who wants to make things — code, design, events,
            or a bit of everything. NEXORA exists to give that work a place to happen and people
            to do it with.
          </p>
        </div>

        <div className="mission__grid">
          {FEATURES.map((f) => (
            <IconFeature key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
