# How to write journey entries

One Markdown file per milestone or phase. Files starting with `_` are ignored.
Name files by date so they sort nicely on GitHub: `2026-11-start-system-design.md`.

```yaml
---
title: Started the System Design journey   # required
type: learning          # career | learning | project | certification | milestone
date: 2026-11-01        # start date (or the single date of a milestone)
endDate: 2027-03-01     # optional, for phases that ended
current: true           # optional, marks an ongoing phase ("Now")
summary: One or two sentences shown on the timeline.   # required
skills: [Distributed Systems, Caching]
relatedNotes:           # optional, ids of notes = path inside notes/ without extension
  - fundamentals/cap-theorem
link:                   # optional
  label: Certificate
  href: https://example.com
featured: true          # show on the home page
draft: false
---

The longer story goes here (shown when "Read the story" is expanded):
what you learned, what was hard, what you'd do differently.
```
