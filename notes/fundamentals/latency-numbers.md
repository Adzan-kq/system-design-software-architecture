---
title: Latency Numbers Every Engineer Should Know
description: Rough orders of magnitude for back-of-the-envelope estimates.
status: completed
order: 2
tags: [estimation, performance]
updated: 2026-11-12
---

## The numbers

| Operation                           | Latency     |
| ----------------------------------- | ----------- |
| L1 cache reference                  | ~1 ns       |
| Main memory reference               | ~100 ns     |
| Read 1 MB sequentially from memory  | ~3 µs       |
| SSD random read                     | ~16 µs      |
| Round trip within same datacenter   | ~500 µs     |
| Read 1 MB sequentially from SSD     | ~50 µs      |
| Round trip CA → Netherlands → CA    | ~150 ms     |

## Using them

A quick estimate in code:

```python
DAU = 10_000_000
requests_per_user = 20
seconds_per_day = 86_400

qps = DAU * requests_per_user / seconds_per_day
peak_qps = qps * 3  # rule of thumb: peak ≈ 2–3× average

print(f"avg ≈ {qps:,.0f} QPS, peak ≈ {peak_qps:,.0f} QPS")
```

## Takeaways

- Memory is ~100× faster than SSD; SSD is ~10–100× faster than network hops across regions.
- Avoid cross-region round trips on the hot path.
