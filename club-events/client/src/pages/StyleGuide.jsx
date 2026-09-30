import { useState } from 'react';
import Button from '../components/Button.jsx';
import Badge from '../components/Badge.jsx';
import DateBlock from '../components/DateBlock.jsx';
import EventCard from '../components/EventCard.jsx';
import FormField from '../components/FormField.jsx';
import Spinner from '../components/Spinner.jsx';

const sampleEvent = {
  id: 'sample-1',
  name: 'Intro to Git & GitHub',
  category: 'Workshop',
  date: '2026-10-14',
  time: '5:00 PM',
  venue: 'Seminar Hall 2',
  description: 'A hands-on session covering version control basics, branching, and your first pull request.',
  status: 'open',
  featured: true,
};

export default function StyleGuide() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="container" style={{ paddingBlock: 'var(--space-7)' }}>
      <div className="kicker-tag" style={{ marginBottom: 'var(--space-2)' }}>
        System Reference
      </div>
      <h1>NEXORA Design System & Tokens</h1>
      <p style={{ maxWidth: 650, marginBottom: 'var(--space-7)' }}>
        Internal reference for NEXORA's modern, editorial design system inspired by Macbease.
      </p>

      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2>Color Palette</h2>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {[
            ['Primary', 'var(--color-primary)'],
            ['Secondary', 'var(--color-secondary)'],
            ['Accent', 'var(--color-accent)'],
            ['Obsidian', 'var(--color-obsidian)'],
            ['Surface', 'var(--color-surface)'],
            ['Background', 'var(--color-bg)'],
          ].map(([name, val]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 'var(--radius-md)',
                  background: val,
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-xs)',
                }}
              />
              <p style={{ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                {name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2>Typography Hierarchy</h2>
        <h1>Display Heading 1 — Bricolage / Sora</h1>
        <h2>Section Heading 2 — Bricolage / Sora</h2>
        <h3>Component Title 3 — Bricolage / Sora</h3>
        <p>Body paragraph with Figtree/Inter for optimal readability and editorial elegance.</p>
      </section>

      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2>Button System</h2>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Outline</Button>
          <Button variant="ghost">Ghost Option</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button
            variant="primary"
            loading={loading}
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 1500);
            }}
          >
            {loading ? 'Submitting…' : 'Test Async Loader'}
          </Button>
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2>Status Badges</h2>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Badge tone="accent">Workshop</Badge>
          <Badge tone="success">Registration Open</Badge>
          <Badge tone="warning">Registration Closed</Badge>
          <Badge tone="error">Cancelled</Badge>
          <Badge tone="neutral">Past Event</Badge>
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2>Date Block Badges</h2>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <DateBlock date="2026-10-14" />
          <DateBlock date="2026-12-25" size="lg" />
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2>Event Card Component</h2>
        <div style={{ maxWidth: 540 }}>
          <EventCard event={sampleEvent} />
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2>Form Fields</h2>
        <div style={{ maxWidth: 440 }}>
          <FormField label="Full name" placeholder="Ada Lovelace" required />
          <FormField
            label="Student Email"
            type="email"
            placeholder="ada@college.edu"
            error="Enter a valid email address"
            required
          />
          <FormField as="select" label="Academic Year">
            <option>1st year</option>
            <option>2nd year</option>
            <option>3rd year</option>
            <option>4th year</option>
          </FormField>
        </div>
      </section>

      <section>
        <h2>Spinner Indicator</h2>
        <Spinner label="Loading preview tokens..." />
      </section>
    </div>
  );
}
