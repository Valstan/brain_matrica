# Cross-Project ADRs

Architecture Decision Records которые касаются **нескольких** проектов (или принимаются как стратегический выбор для всех будущих).

Per-project ADRs живут в `<project>/docs/adr/` если проект их ведёт. Здесь — только cross-project.

## Формат

`adr/NNNN-<slug>.md` со структурой:

```markdown
# ADR NNNN: <Title>

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Superseded by ADR-NNNN | Deprecated
**Applies to:** MatricaRMZ, GONBA, setka (или подмножество)

## Context
Что нас сюда привело? Какая дилемма?

## Decision
Что мы решили?

## Consequences
Что это даёт, что это стоит?

## Alternatives considered
Что рассматривали, почему не выбрали?
```

## Реестр

| # | Title | Status | Applies to | File |
|---|---|---|---|---|
| 0001 | brain ↔ projects communication via mailboxes | Accepted | brain_matrica, MatricaRMZ, GONBA, setka, KARMAN | [0001-brain-projects-mailboxes.md](0001-brain-projects-mailboxes.md) |
| 0002 | PR-only flow на default branch — no direct push | Accepted | brain_matrica, MatricaRMZ, GONBA, setka, KARMAN | [0002-pr-only-flow-no-direct-push.md](0002-pr-only-flow-no-direct-push.md) |
| 0003 | Token economy principles | Accepted | brain_matrica, MatricaRMZ, GONBA, setka, KARMAN | [0003-token-economy-principles.md](0003-token-economy-principles.md) |

## Когда писать ADR

- ✅ Решение касается двух+ проектов («везде Drizzle вместо Prisma»)
- ✅ Решение «всех будущих проектов» («новый проект на Bun, не Node»)
- ✅ Отказ от технологии в широком смысле («больше не используем Express в новых backend»)
- ❌ Per-project tech choice — это PROJECT_STATE.md того проекта
- ❌ Tactical changes — это PENDING_FOLLOWUPS того проекта
