/**
 * Seeds the 6 core engineering pillars, their initial learning modules, and
 * the first journey milestones.
 *
 * Idempotent and non-destructive:
 *   - Pillars are upserted by slug (definitions here are the source of truth).
 *   - Modules are only created if missing; existing ones (and your notes) are never touched.
 *   - Milestones are only inserted when the table is empty.
 *
 * Run: bun run db:seed
 */
import 'dotenv/config';
import { createPrismaClient } from '../src/lib/prisma-client';
import type { MilestoneType, ModuleStatus } from '../src/generated/prisma/client';

const prisma = createPrismaClient();

type SeedModule = { title: string; summary: string; status?: ModuleStatus; tags?: string[] };
type SeedPillar = { slug: string; title: string; description: string; modules: SeedModule[] };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const PILLARS: SeedPillar[] = [
  {
    slug: 'system-design',
    title: 'System Design & Software Architecture',
    description: 'Designing systems that scale: architecture styles, distributed systems, and the trade-offs between them.',
    modules: [
      {
        title: 'Monolith vs Modular Monolith vs Microservices',
        summary: 'Architecture styles, their trade-offs, and when each one fits.',
        status: 'IN_PROGRESS',
        tags: ['architecture'],
      },
      {
        title: 'Monorepo vs Polyrepo',
        summary: 'Organizing code for one or many services, and the tooling each approach needs.',
        status: 'IN_PROGRESS',
        tags: ['architecture', 'tooling'],
      },
      { title: 'Event-Driven Architecture', summary: 'Events, producers and consumers, choreography vs orchestration.' },
      { title: 'Message Queues', summary: 'Queues vs pub/sub, delivery guarantees, ordering, and backpressure.' },
      { title: 'Caching', summary: 'Cache-aside, write-through, eviction policies, and cache invalidation.' },
      { title: 'Distributed Systems', summary: 'CAP, consistency models, replication, partitioning, and consensus.' },
      { title: 'API Gateway', summary: 'Routing, aggregation, auth offloading, and the BFF pattern.' },
      { title: 'Scalability', summary: 'Vertical vs horizontal scaling, load balancing, and stateless services.' },
    ],
  },
  {
    slug: 'devops-cloud',
    title: 'DevOps & Cloud Engineering',
    description: 'Shipping and running software reliably: containers, pipelines, infrastructure, and the cloud.',
    modules: [
      { title: 'Linux', summary: 'Processes, filesystems, permissions, networking, and shell tooling for servers.' },
      { title: 'Docker', summary: 'Images, containers, multi-stage builds, and Compose for local environments.' },
      { title: 'CI/CD with GitHub Actions', summary: 'Automated testing, building, and deploying on every push.' },
      { title: 'Nginx', summary: 'Reverse proxying, TLS termination, load balancing, and static serving.' },
      { title: 'Cloud (GCP / AWS)', summary: 'Core compute, storage, networking, and IAM building blocks.' },
      { title: 'Kubernetes', summary: 'Pods, deployments, services, ingress, and configuration management.' },
      { title: 'Terraform', summary: 'Infrastructure as code: providers, state, modules, and plans.' },
    ],
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Building secure systems by default: common vulnerabilities, identity, and API security.',
    modules: [
      { title: 'OWASP Top 10', summary: 'The most critical web application security risks and their mitigations.' },
      { title: 'SQL Injection & XSS', summary: 'How injection and cross-site scripting work, and how to prevent them.' },
      { title: 'JWT & OAuth 2.0', summary: 'Tokens, flows, scopes, and common implementation pitfalls.' },
      { title: 'Secrets Management', summary: 'Keeping credentials out of code: vaults, rotation, and least privilege.' },
      { title: 'Rate Limiting', summary: 'Token bucket, sliding window, and protecting APIs from abuse.' },
      { title: 'Secure API Design', summary: 'Authentication, authorization, validation, and safe error handling.' },
    ],
  },
  {
    slug: 'ai-engineering',
    title: 'AI Engineering',
    description: 'Building production systems on top of LLMs: retrieval, agents, tooling, and guardrails.',
    modules: [
      { title: 'LLMs & APIs', summary: 'How LLMs work at a practical level, prompting, and provider APIs.' },
      { title: 'RAG & Vector Databases', summary: 'Embeddings, chunking, retrieval, and grounding answers in your data.' },
      { title: 'AI Agents & Tool Calling', summary: 'Agent loops, tool definitions, and orchestrating multi-step tasks.' },
      { title: 'Model Context Protocol (MCP)', summary: 'Exposing tools and data to AI applications through a standard protocol.' },
      { title: 'n8n Workflow Automation', summary: 'Visual workflow automation and integrating AI steps into business flows.' },
      { title: 'Local LLMs with Ollama', summary: 'Running open models locally for privacy, cost, and experimentation.' },
      { title: 'Guardrails', summary: 'Input/output validation, safety checks, and evaluating AI behavior.' },
    ],
  },
  {
    slug: 'observability-reliability',
    title: 'Monitoring, Performance & Reliability',
    description: 'Knowing what your system is doing and keeping it fast and available.',
    modules: [
      { title: 'Logging', summary: 'Structured logs, log levels, correlation IDs, and centralized logging.' },
      { title: 'Metrics & Tracing', summary: 'The three pillars of observability and what each one answers.' },
      { title: 'Prometheus & Grafana', summary: 'Scraping metrics, PromQL, dashboards, and alerting.' },
      { title: 'OpenTelemetry', summary: 'Vendor-neutral instrumentation for traces, metrics, and logs.' },
      { title: 'Load Testing', summary: 'Finding limits with realistic load: tools, scenarios, and reading results.' },
      { title: 'Incident Response', summary: 'On-call, runbooks, SLOs/error budgets, and blameless postmortems.' },
    ],
  },
  {
    slug: 'product-business',
    title: 'Product & Business Understanding',
    description: 'Connecting engineering decisions to users, business goals, and cost.',
    modules: [
      { title: 'Requirement Analysis', summary: 'Turning stakeholder needs into clear functional and non-functional requirements.' },
      { title: 'Business Process', summary: 'Mapping how work flows through an organization before automating it.' },
      { title: 'Product Thinking', summary: 'Problems over features: users, outcomes, and prioritization.' },
      { title: 'Cost Optimization', summary: 'Understanding and reducing infrastructure and operational cost.' },
      { title: 'Technical Documentation', summary: 'ADRs, design docs, READMEs, and writing for different audiences.' },
    ],
  },
];

const MILESTONES: {
  title: string;
  type: MilestoneType;
  summary: string;
  startDate: string;
  isCurrent?: boolean;
  skills: string[];
  featured?: boolean;
  linkLabel?: string;
  linkUrl?: string;
}[] = [
  {
    title: 'Architecture styles: monolith, modular monolith, microservices & monorepo',
    type: 'LEARNING',
    summary:
      "Studied how monolith, modular monolith, and microservices architectures differ, and how a monorepo approach fits into organizing a project's codebase.",
    startDate: '2026-11-16',
    isCurrent: true,
    skills: ['Monolith', 'Modular Monolith', 'Microservices', 'Monorepo'],
    featured: true,
  },
  {
    title: 'Built this digital garden',
    type: 'PROJECT',
    summary: 'Built Adzan.dev to document my engineering learning and developer journey in one place.',
    startDate: '2026-11-16',
    skills: ['Next.js', 'Neon PostgreSQL', 'Prisma', 'Tailwind CSS'],
    featured: true,
    linkLabel: 'Source on GitHub',
    linkUrl: 'https://github.com/Adzan-kq/system-design-software-architecture',
  },
];

async function main() {
  let createdModules = 0;

  for (const [i, p] of PILLARS.entries()) {
    const pillar = await prisma.pillar.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, title: p.title, description: p.description, order: i + 1 },
      update: { title: p.title, description: p.description, order: i + 1 },
    });

    for (const [j, m] of p.modules.entries()) {
      const slug = slugify(m.title);
      const exists = await prisma.module.findUnique({ where: { pillarId_slug: { pillarId: pillar.id, slug } } });
      if (exists) continue;
      await prisma.module.create({
        data: {
          pillarId: pillar.id,
          slug,
          title: m.title,
          summary: m.summary,
          status: m.status ?? 'PLANNED',
          tags: m.tags ?? [],
          order: (j + 1) * 10,
        },
      });
      createdModules++;
    }
  }

  let createdMilestones = 0;
  if ((await prisma.journeyMilestone.count()) === 0) {
    const { count } = await prisma.journeyMilestone.createMany({
      data: MILESTONES.map((m) => ({ ...m, startDate: new Date(m.startDate) })),
    });
    createdMilestones = count;
  }

  console.log(`✔ ${PILLARS.length} pillars upserted, ${createdModules} modules created, ${createdMilestones} milestones created`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
