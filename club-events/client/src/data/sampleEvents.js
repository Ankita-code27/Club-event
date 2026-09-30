/**
 * SAMPLE DATA — placeholder events for development only.
 * Replace with real data from the backend API in Phase 9.
 * Dates are relative to "today" so the sample always looks current,
 * and include a couple of past-dated events to exercise that state.
 */
const today = new Date();
const inDays = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const CATEGORIES = ['Workshop', 'Talk', 'Hackathon', 'Social'];

export const sampleEvents = [
  {
    id: 'sample-1',
    name: 'Intro to Git & GitHub',
    category: 'Workshop',
    date: inDays(6),
    time: '5:00 PM',
    venue: 'Seminar Hall 2',
    description:
      'A hands-on session covering version control basics, branching, and opening your first pull request. No prior experience needed.',
    status: 'open',
    featured: true,
  },
  {
    id: 'sample-2',
    name: 'Design Systems 101',
    category: 'Talk',
    date: inDays(13),
    time: '4:30 PM',
    venue: 'Design Lab',
    description: 'An introduction to tokens, components, and building consistent interfaces at scale.',
    status: 'open',
    featured: false,
  },
  {
    id: 'sample-3',
    name: 'NEXORA Hack Night',
    category: 'Hackathon',
    date: inDays(20),
    time: '6:00 PM',
    venue: 'Innovation Hub',
    description: 'A relaxed overnight build session — bring a team or find one when you arrive.',
    status: 'open',
    featured: false,
  },
  {
    id: 'sample-4',
    name: 'Portfolio Review Circle',
    category: 'Workshop',
    date: inDays(27),
    time: '3:00 PM',
    venue: 'Room 214',
    description: 'Peer feedback on personal projects and portfolios, with tips from senior members.',
    status: 'open',
    featured: false,
  },
  {
    id: 'sample-5',
    name: 'Welcome Mixer',
    category: 'Social',
    date: inDays(3),
    time: '7:00 PM',
    venue: 'Courtyard',
    description: 'Meet the club over snacks and casual games. Open to anyone curious about NEXORA.',
    status: 'open',
    featured: false,
  },
  {
    id: 'sample-6',
    name: 'API Design Deep Dive',
    category: 'Talk',
    date: inDays(34),
    time: '5:30 PM',
    venue: 'Seminar Hall 1',
    description: 'A closer look at REST conventions, versioning, and designing APIs people enjoy using.',
    status: 'closed',
    featured: false,
  },
  {
    id: 'sample-7',
    name: 'Spring Kickoff Social',
    category: 'Social',
    date: inDays(-10),
    time: '6:00 PM',
    venue: 'Courtyard',
    description: 'Our first meetup of the semester — recap and photos from the night.',
    status: 'past',
    featured: false,
  },
  {
    id: 'sample-8',
    name: 'Intro to Figma',
    category: 'Workshop',
    date: inDays(-24),
    time: '4:00 PM',
    venue: 'Design Lab',
    description: 'A beginner walkthrough of frames, components, and prototyping in Figma.',
    status: 'past',
    featured: false,
  },
];

export const getFeaturedEvent = () => sampleEvents.find((e) => e.featured) || sampleEvents[0];
export const getUpcomingEvents = (limit = 3) =>
  sampleEvents
    .filter((e) => e.id !== getFeaturedEvent().id && e.status !== 'past')
    .slice(0, limit);
export const getEventById = (id) => sampleEvents.find((e) => e.id === id);
