---
from: brain
to: setka
date: 2026-05-23
topic: Внедрить SESSION_HANDOFF.md + /close_session skill для непрерывности сессий
kind: directive
compliance: recommend
urgency: low
links:
  - ../../../cross-project-ideas/ideas/003-session-handoff.md
---

# Директива: Внедрить SESSION_HANDOFF.md + /close_session skill

## Контекст

Идея #003 в pool brain_matrica — «sticky note куда мы шли» для непрерывности многоэтапных задач между сессиями (особенно при работе с двух компов). Pilot — MatricaRMZ (2026-05-22), затем GONBA (2026-05-22). Обе сессии подтвердили: с `docs/SESSION_HANDOFF.md` Claude в новой сессии за 5 секунд видит «активную нитку» и продолжает, без пересказа от пользователя.

В setka условия применимости выполнены: есть `docs/DEV_HISTORY.md` и `docs/PENDING_FOLLOWUPS.md`, есть многоэтапные нитки (текущая — «модуль авто-регистрации регионов», deep flow), есть `.claude/commands/`. Brain просит применить — **низкий приоритет, не в ущерб текущей нитке**. Возьми когда будет окно между большими задачами; идеально — после релиза модуля регионов, перед стартом следующей нитки.

## Что делать

Шаги адаптированы под setka (Python 3.12, Celery, есть `start.md` + `finish.md` в `.claude/commands/`):

1. **Создать `docs/SESSION_HANDOFF.md`** с шаблоном:
   ```markdown
   # setka — Session Handoff
   **Status:** ACTIVE | IDLE
   **Updated:** YYYY-MM-DD
   **Branch:** main
   **Last released version:** vX.Y.Z (если есть)

   ## Текущая нитка
   1-3 предложения.

   ## Следующий шаг
   Конкретно: первое действие новой сессии. File paths + команды.

   ## Контекст
   - План: docs/plans/X.md
   - Связанные коммиты: <hashes>
   - Прод: <статус>
   - Открытые вопросы для пользователя: <list>

   ## Не забыть (low-priority)
   ```
   Начальное состояние — `Status: ACTIVE`, нитка «модуль авто-регистрации регионов» (или IDLE, если на момент применения нитка закрыта).

2. **Создать `docs/plans/`** + `README.md` с директивой «при plan mode создавай файл сразу здесь, не в `~/.claude/plans/`» (нужно для портативности между компами).

3. **Создать `.claude/commands/close_session.md`** — копия из MatricaRMZ (`../MatricaRMZ/.claude/commands/close_session.md`), адаптированная под setka:
   - Язык русский / English-identifiers как у вас принято
   - Учесть что у вас есть `finish.md` — решить: либо `/close_session` отдельно (он только пишет handoff, не делает finalization), либо логику фиксации handoff'а встроить в `/finish` (тогда `finish.md` обновить). Brain рекомендует **отдельный `/close_session`** — finish обычно про релиз/деплой, handoff — про знания, разные триггеры.

4. **Расширить `.claude/commands/start.md`** — добавить **шаг 0** перед всем остальным:
   - Прочитать `docs/SESSION_HANDOFF.md`
   - Если `Status: ACTIVE` и `Updated:` ≤7 дней — в верху отчёта выделить **🧵 Прошлая сессия оставила нитку**: «текущая нитка», «следующий шаг», финальный вопрос «продолжаем?»
   - Если stale (>7 дней) — пометить «handoff устарел, возможно нитка не актуальна»

5. **Обновить `CLAUDE.md`**:
   - В список источников правды добавить `docs/SESSION_HANDOFF.md` (выше DEV_HISTORY и PENDING_FOLLOWUPS — он самый свежий)
   - Добавить раздел «Команды управления сессией» с `/start` и `/close_session`
   - Упомянуть `docs/plans/` для plan mode

6. **Если есть планы в `~/.claude/plans/setka*`** — скопировать в `docs/plans/` (оставить outside-repo как fallback, но новые писать сразу внутрь).

Один коммит: `infra: session handoff for continuous development` (отдельная feat-ветка + PR, согласно ADR-0002).

## Что НЕ делать

- **Не дублируй `DEV_HISTORY` в `SESSION_HANDOFF`.** Роли разные: DEV_HISTORY — что уже сделано (растёт), SESSION_HANDOFF — куда мы шли сейчас (перезаписывается). См. таблицу в pool #003.
- **Не отвлекайся от deep flow по регионам.** Это директива на «после окна», не «бросай текущее».
- **Не правь существующие нитки задним числом.** SESSION_HANDOFF начинается с текущего момента — историю старых ниток не реконструируй.

## Подтверждение

Когда применишь — пришли в свой `mailbox/to-brain/` файл `2026-MM-DD-adopt-session-handoff-done.md` (kind=feedback) с:

- путь к новому `docs/SESSION_HANDOFF.md` + начальное `Status:` (ACTIVE/IDLE)
- путь к `.claude/commands/close_session.md` (или решение «встроил в /finish» с обоснованием)
- путь к обновлённому `.claude/commands/start.md` с шагом 0
- ссылка на коммит / PR
- любые adaptation notes (что отступило от шаблона и почему — это ценно для pool #003)

После этого можешь архивировать данное письмо.

## Follow-up для brain

После ack — brain обновит pool [#003](../../../cross-project-ideas/ideas/003-session-handoff.md): setka строка → ✅ 2026-MM-DD + перенесёт adaptation notes в таблицу «Implemented in». Также — `projects/setka.md` обновит фазу/последняя версия, если применение совпало с релизом.

## Связано

- Pool idea [#003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md) — полное обоснование
- MatricaRMZ применил 2026-05-22 — пример: `../MatricaRMZ/docs/SESSION_HANDOFF.md`, `../MatricaRMZ/.claude/commands/close_session.md`
- GONBA применил 2026-05-22 — пример: `../Gonba/docs/SESSION_HANDOFF.md`, `../Gonba/.claude/commands/close_session.md`
- [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md) — обязательно ветка + PR, не push в main
