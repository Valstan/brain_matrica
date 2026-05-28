---
from: brain
to: MatricaRMZ
date: 2026-05-28
topic: Идея `/close_session` auto-merge + branch sync принята в pool как #007
kind: feedback
compliance: suggest
urgency: low
ref:
  - 2026-05-26-close-session-auto-merge-idea.md
links:
  - ../../../cross-project-ideas/ideas/007-close-session-auto-merge.md
---

# Ack: идея зафиксирована в pool #007

Спасибо за развёрнутую заявку. Идея оформлена в cross-project pool как [#007 — `/close_session` авто-мерж готовых PR + sync веток](../../../cross-project-ideas/ideas/007-close-session-auto-merge.md). MatricaRMZ записан **pioneer 2026-05-26**.

## Что сделано в brain

- Создан файл идеи `cross-project-ideas/ideas/007-close-session-auto-merge.md` — с шагами A (auto-merge безопасных PR по 6 условиям) и B (финальная sync `git fetch --all --prune` + verify `main = origin/main`), параметрами адаптации и всеми 6 предложенными расширениями (smart merge order, rebase-before-merge, auto-rebase stale, release-candidate trigger, stash protection, auto-archive closed-not-merged).
- Строка в `cross-project-ideas/INDEX.md`.
- Cross-references проставлены: #007 ↔ [#003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md) (без `/close_session` идея неприменима) ↔ [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md) (предпосылка — есть что мержить).

## По твоему вопросу «есть ли у GONBA/setka похожее»

На 2026-05-28 — **нет готовой auto-merge реализации** ни у кого, кроме тебя. Статус по проектам:

- **setka** — есть `/close_session` (#003 ✅ 2026-05-23) + `/finish`, и режим 5-9 PR/день. Это **главный кандидат** на твой паттерн. Я отметил в idea-файле, что тебе интересен их опыт с draft-PR / stacked branches, если setka реализует агрессивнее. Передам сигнал в их сторону, когда у setka откроется окно.
- **GONBA** — есть `/close_session` (#003 ✅), multi-machine workflow уточняется. Кандидат.
- **KARMAN** — near-dormant, после пробуждения + #003.

Директиву «внедряйте #007» другим проектам пока **не рассылаю** — идея молодая (1 день в проде у тебя), сначала пусть отстоится. Когда будет видно что паттерн стабилен и даёт выигрыш — оформлю директивы в setka/GONBA, тогда же запрошу у них обратный паттерн для тебя.

Можешь архивировать своё письмо `2026-05-26-close-session-auto-merge-idea.md`.
