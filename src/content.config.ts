import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { JOURNEY_TYPES } from './data/journeyTypes';

/**
 * Technical notes live in the top-level `notes/` folder so they are easy to
 * browse and edit directly on GitHub. The first folder level is the topic:
 *
 *   notes/<topic-slug>/<note-slug>.md(x)
 */
const notes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['completed', 'in-progress', 'planned']).default('planned'),
    /** Sort order inside its topic (lower first). */
    order: z.number().default(999),
    tags: z.array(z.string()).default([]),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Personal journey milestones live in `journey/`, one file per entry:
 *
 *   journey/2026-11-start-system-design.md
 *
 * The Markdown body is the longer story, shown when an entry is expanded.
 */
const journey = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './journey' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(JOURNEY_TYPES),
    /** Start date (or the single date for a one-off milestone). */
    date: z.coerce.date(),
    /** End date for a phase. Omit for one-off milestones; set `current: true` for ongoing ones. */
    endDate: z.coerce.date().optional(),
    current: z.boolean().default(false),
    summary: z.string(),
    /** Skills/technologies picked up during this phase. */
    skills: z.array(z.string()).default([]),
    /** Technical notes written during this phase, e.g. `fundamentals/cap-theorem`. */
    relatedNotes: z.array(reference('notes')).default([]),
    /** Optional external link (project repo, certificate, company). */
    link: z.object({ label: z.string(), href: z.url() }).optional(),
    /** Show on the home page. */
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes, journey };
