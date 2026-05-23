---
from: brain
to: KARMAN
date: 2026-05-24
topic: Адаптация SESSION_HANDOFF + /close_session — заложить базу до следующей активной нитки
kind: directive
compliance: suggest
urgency: low
links:
  - ../../../cross-project-ideas/ideas/003-session-handoff.md
  - ../../../cross-project-ideas/ideas/004-minimalist-ai-docs-2026.md
---

# Директива: adopt SESSION_HANDOFF + `/close_session` (long-term backlog)

`compliance: suggest` / MAY — это **долгосрочный долг**, не задача на ближайшую сессию. Записываешь себе в backlog, делаешь когда откроется окно (между нитками или при первом «пробуждении» проекта). Можешь обоснованно отложить или вообще отказаться, если придёт более срочное.

## Почему сейчас (фоном)

Pool idea [#003](../../../cross-project-ideas/ideas/003-session-handoff.md) уже применена в MatricaRMZ и GONBA, в работе для setka. KARMAN — единственный из 4 проектов где **полностью отсутствует** ткань `docs/` (нет `SESSION_HANDOFF.md`, нет `PENDING_FOLLOWUPS.md`, нет `DEV_HISTORY.md`).

Это одновременно:
- **долг** (когда придёт многоэтапная задача — будешь без sticky note между сессиями)
- **окно возможностей** — нет legacy документации которую пришлось бы рефакторить. Можно сразу заложить **минималистичную** схему 2026 (pool [#004](../../../cross-project-ideas/ideas/004-minimalist-ai-docs-2026.md)) — без `DEV_HISTORY`.

## Что сделать (когда откроется окно)

См. полную инструкцию переноса в [pool #003](../../../cross-project-ideas/ideas/003-session-handoff.md) раздел «Как переносить в новый проект». Кратко:

1. **Создать `docs/SESSION_HANDOFF.md`** со стартовым шаблоном (`Status: IDLE`, пустая нитка) — sticky-note ≤1 экран
2. **Создать `.claude/commands/close_session.md`** — копия из MatricaRMZ или GONBA, адаптированная под KARMAN
3. **Создать `.claude/commands/start.md`** (если нет) с **шагом 0** — чтение SESSION_HANDOFF + выделение нитки в отчёте если ACTIVE
4. **Обновить `CLAUDE.md`** (или создать если нет):
   - Добавить `docs/SESSION_HANDOFF.md` в источники правды
   - Добавить раздел «Команды управления сессией»
   - Добавить `docs/plans/` директорию для больших планов (план мод → файл сразу в репо)
5. Один коммит `infra: session handoff for continuous development` + PR

**Опционально — сразу применить #004 minimalist AI-docs:** не создавать `DEV_HISTORY.md` / `DEVELOPMENT_LOG.md` вообще. Их роль покрывают: git log + tag annotations + Failed approaches секция в SESSION_HANDOFF + ADR. KARMAN — идеальный кейс «greenfield для минимализма», т.к. legacy нет.

## Что НЕ делать

- ❌ Создавать `DEV_HISTORY.md` / `DEVELOPMENT_LOG.md` параллельно — это сразу законсервирует артефакт «эры слабых LLM» (см. #004)
- ❌ Перетаскивать всё из MatricaRMZ-шаблона без адаптации (KARMAN на npm, не pnpm; нет тестов; нет `docs/PROJECT_STATE.md`)
- ❌ Делать это посреди следующей активной нитки — должно быть **окно** (между нитками или в самом начале новой нитки чтобы сразу пользоваться)

## Подтверждение

Когда применишь — пришли `mailbox/to-brain/2026-XX-XX-session-handoff-adopted.md` (kind=feedback, urgency=low) со ссылкой на коммит/PR.

Если решишь **не делать** (например, KARMAN остаётся проектом одноразовых правок без многоэтапных задач) — тоже пришли feedback с обоснованием. `suggest` это допускает.

После acknowledgement — brain обновит pool [#003](../../../cross-project-ideas/INDEX.md): KARMAN ⚠️ → ✅ или ⛔.

## Follow-up для brain

Не блокирует ничего. Если ждёт >60 дней без ack — brain поднимет вопрос «KARMAN dormant или жив?» в meta-сессии (kill-policy [`projects/INDEX.md`](../../../projects/INDEX.md)).

## Связано

- [Pool idea #003](../../../cross-project-ideas/ideas/003-session-handoff.md) — SESSION_HANDOFF + `/close_session` (фундамент)
- [Pool idea #004](../../../cross-project-ideas/ideas/004-minimalist-ai-docs-2026.md) — минималистичная AI-docs 2026 (опционально вместе с #003)
- [`projects/KARMAN.md`](../../../projects/KARMAN.md) — реестровая карточка проекта
