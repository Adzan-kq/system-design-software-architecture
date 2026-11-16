---
title: Replication
description: Leader–follower, multi-leader, and leaderless replication.
status: completed
order: 1
tags: [databases]
updated: 2026-11-08
---

## Leader–follower

All writes go to the leader, which streams changes to followers. Reads can be served by followers (with possible replication lag).

```mermaid
sequenceDiagram
  participant C as Client
  participant L as Leader
  participant F as Follower
  C->>L: INSERT ...
  L-->>C: OK
  L-)F: replicate (async)
  C->>F: SELECT ...
  F-->>C: maybe stale result
```

## Sync vs async

- **Synchronous**: durable, but a slow follower blocks writes.
- **Asynchronous**: fast, but data can be lost if the leader fails before replicating.
