# System Design Journey

A digital garden with two parts: my **developer journey** (career and learning timeline) and a **knowledge base** of study notes and case studies on System Design & Software Architecture.

Built with [Astro](https://astro.build), Tailwind CSS v4, MDX, Shiki syntax highlighting, and Mermaid diagrams.

## Commands

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Dev server at `http://localhost:4321`   |
| `npm run build`   | Build the static site into `./dist/`    |
| `npm run preview` | Preview the production build            |
| `npm run check`   | Type-check `.astro` and `.ts` files     |

## Writing notes

Notes live in [`notes/`](./notes), one folder per roadmap topic. See [`notes/_README.md`](./notes/_README.md) for the frontmatter format.

```
notes/
├── fundamentals/cap-theorem.md      → /notes/fundamentals/cap-theorem/
├── databases/sharding.mdx           → /notes/databases/sharding/
└── case-studies/url-shortener.md    → /notes/case-studies/url-shortener/
```

The `status` field (`completed` | `in-progress` | `planned`) drives the roadmap progress bars and sidebar indicators. Topic order and descriptions are in [`src/data/topics.ts`](./src/data/topics.ts).

## Writing journey entries

Milestones live in [`journey/`](./journey), one Markdown file each, shown on `/journey/` as a timeline grouped by year.
See [`journey/_README.md`](./journey/_README.md) for the frontmatter format.

Link an entry to the notes you wrote during that phase with `relatedNotes: [fundamentals/cap-theorem]`.
The timeline shows those notes, and each note page links back to the phase. A typo in a reference fails the build.

## Deploying to GitHub Pages

Set these environment variables in the build step:

```bash
SITE_URL=https://<user>.github.io BASE_PATH=/<repo-name> npm run build
```
