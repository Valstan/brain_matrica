# Celery

**Category:** frameworks (task queue)
**Ring:** adopt
**Used in:** setka
**First adopted:** ~2025 (setka, Redis broker)

## What
Distributed task queue для Python. Workers потребляют задачи из broker'а (Redis/RabbitMQ), beat scheduler для cron-задач.

## Why
- Зрелый стандарт de-facto для async background jobs в Python.
- Богатые возможности: retries, rate limits, periodic tasks, chains/groups.
- Хорошо работает с долгоиграющими VK API задачами.

## Alternatives considered
- **RQ (Redis Queue)** — проще, но беднее: нет beat, слабее retries.
- **Dramatiq** — современнее, но малая экосистема, меньше готовых интеграций.
- **APScheduler + threading** — не масштабируется, нет распределённого воркера.

## Notes
_(заполняется по мере накопления опыта — pitfalls, релизы, ADRs)_

## References
- https://docs.celeryq.dev/
