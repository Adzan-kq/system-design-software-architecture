/**
 * Roadmap topics, in learning order. `slug` must match a folder in `notes/`.
 * A topic with no notes yet still shows up on the roadmap as "Planned".
 */
export interface Topic {
  slug: string;
  title: string;
  description: string;
}

export const TOPICS: Topic[] = [
  {
    slug: 'fundamentals',
    title: 'Fundamentals',
    description: 'Networking basics, latency numbers, CAP theorem, consistency models.',
  },
  {
    slug: 'architecture',
    title: 'Architecture Styles',
    description: 'Monolith, modular monolith, microservices, and monorepo vs polyrepo.',
  },
  {
    slug: 'scalability',
    title: 'Scalability',
    description: 'Load balancing, caching, horizontal scaling, rate limiting, CDNs.',
  },
  {
    slug: 'databases',
    title: 'Databases',
    description: 'SQL vs NoSQL, indexing, replication, sharding, transactions.',
  },
  {
    slug: 'messaging',
    title: 'Messaging & Async',
    description: 'Queues, pub/sub, event-driven architecture, delivery guarantees.',
  },
  {
    slug: 'case-studies',
    title: 'System Design Cases',
    description: 'End-to-end designs: URL shortener, chat app, news feed, and more.',
  },
];
