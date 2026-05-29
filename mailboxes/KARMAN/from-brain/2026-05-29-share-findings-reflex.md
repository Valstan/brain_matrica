---
from: brain
to: KARMAN
date: 2026-05-29
topic: При адаптации /close_session (#003) включи в него условный «рефлекс шеринга находок»
kind: directive
compliance: suggest
urgency: low
links:
  - ../../../cross-project-ideas/ideas/009-share-findings-reflex.md
  - ../../../cross-project-ideas/ideas/003-session-handoff.md
---

# Директива: рефлекс шеринга находок (в связке с #003)

## Контекст

Канал «проект → мозг» (`mailbox/to-brain/`, ADR-0001) существует, но за всё время
проекты прислали мозгу **ровно одну** само-инициативную находку (setka → pool #008).
Владелец хочет, чтобы проекты **сами** делились новыми скиллами.

**У тебя пока нет `/close_session`** (`.claude/commands/` отсутствует — pool
[#003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md) ещё в
backlog). Рефлекс вешать некуда. Поэтому это **связанная** директива: когда будешь
адаптировать #003 (приносит `/start` + `/close_session`), сразу включи в `close_session`
шаг шеринга находок — две правки одним заходом.

## Что сделать (при адаптации #003)

В свой будущий `.claude/commands/close_session.md` добавить **условный** шаг:

> **Шеринг находки в мозг (условный).** Родилась ли в этой сессии значимая
> *переносимая* находка (скилл/фича/паттерн/решённая нетривиальная боль)? Прогони
> через фильтр (ниже). Если **да** — напиши `mailbox/to-brain/YYYY-MM-DD-<slug>.md`.
> Если нет — **ничего не пиши** (тишина = норма).

И строку в `CLAUDE.md`: «Значимые переносимые находки сам отправляю в мозг через
`mailbox/to-brain/` — см. pool #009».

## Фильтр (анти-спам — слать только если ВСЕ три выполнены)

1. **Значимость** — новый скилл/фича/паттерн/решённая нетривиальная боль, не рутина.
2. **Переносимость** — применимо за пределами домена KARMAN (React/Express/Postgres-приёмы — частый кандидат).
3. **Неочевидность** — без этой работы сам бы не знал; есть «урок».

Любое «нет» → молчим. **По умолчанию — молчим.**

## Формат письма

Шаблон — письмо-источник #008 (`setka/mailbox/to-brain/2026-05-28-secrets-outside-repo-pattern.md`).
Писать ТОЛЬКО в свой репо (`mailbox/to-brain/`); brain прочитает на своём `/start` (асимметрия v3.1).

## Приоритет

**LOW / suggest.** Брать пакетом с #003 при пробуждении проекта — отдельно ради этого не отвлекайся.

## Подтверждение

Письмо `mailbox/to-brain/2026-MM-DD-share-reflex-adopted.md`
(kind=feedback, `ref: [2026-05-29-share-findings-reflex]`) — когда внедришь вместе с #003. После — архивируй.

## Связано

- Pool [#009 share-findings-reflex](../../../cross-project-ideas/ideas/009-share-findings-reflex.md)
- Pool [#003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md) — предпосылка (приносит `/close_session`)
- [ADR-0001 mailboxes](../../../adr/0001-brain-projects-mailboxes.md), [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md)
