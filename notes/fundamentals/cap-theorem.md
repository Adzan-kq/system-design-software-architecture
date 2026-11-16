---
title: CAP Theorem
description: Why a distributed system can only guarantee two of Consistency, Availability, and Partition tolerance.
status: completed
order: 1
tags: [distributed-systems, consistency]
updated: 2026-11-10
---

## The three properties

- **Consistency (C)** — every read receives the most recent write or an error.
- **Availability (A)** — every request receives a (non-error) response, without the guarantee that it contains the most recent write.
- **Partition tolerance (P)** — the system keeps operating despite messages being dropped or delayed between nodes.

## Why you must pick two

Network partitions *will* happen, so in practice the choice is between **CP** and **AP** during a partition.

```mermaid
flowchart TB
  P{Network partition?}
  P -- No --> CA[Serve consistent + available responses]
  P -- Yes --> Choice{Prefer?}
  Choice -- Consistency --> CP[Reject / block some requests<br/>e.g. HBase, etcd]
  Choice -- Availability --> AP[Serve possibly stale data<br/>e.g. Cassandra, DynamoDB]
```

## PACELC: the fuller picture

> If there is a **P**artition, choose **A** or **C**; **E**lse, choose **L**atency or **C**onsistency.

| System    | During partition | Normal operation |
| --------- | ---------------- | ---------------- |
| DynamoDB  | AP               | EL               |
| Cassandra | AP               | EL               |
| MongoDB   | CP               | EC               |
| Spanner   | CP               | EC               |

## Key takeaways

1. CAP is about behaviour **during a partition**, not all the time.
2. "CA" is not a real option for a distributed system.
3. Many databases let you tune consistency per request (e.g. quorum reads).
