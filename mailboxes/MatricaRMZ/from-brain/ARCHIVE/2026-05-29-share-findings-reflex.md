---
from: brain
to: MatricaRMZ
date: 2026-05-29
topic: Встроить условный «рефлекс шеринга находок» в /close_session — сам делись с мозгом значимыми переносимыми фишками
kind: directive
compliance: recommend
urgency: low
links:
  - ../../../cross-project-ideas/ideas/009-share-findings-reflex.md
---

# Директива: рефлекс шеринга находок в /close_session

## Контекст

Канал «проект → мозг» (`mailbox/to-brain/`, ADR-0001) существует, но за всё время
проекты прислали мозгу **ровно одну** само-инициативную находку (setka → паттерн
секретов, ставший pool #008). Всё остальное в `to-brain/` — ack'и и done-репорты на
запросы мозга. Владелец хочет, чтобы проекты **сами** делились новыми скиллами, а не
только по явной просьбе — иначе значимая фишка, рождённая у тебя (ты дал #001 isolated
SSH key, #005 CODEBASE_MAP, tactical token-economy), могла бы не дойти до других.

## Что сделать

Добавить в `.claude/commands/close_session.md` **условный** шаг (рядом с заполнением `SESSION_HANDOFF`):

> **Шеринг находки в мозг (условный).** Родилась ли в этой сессии значимая
> *переносимая* находка (скилл/фича/паттерн/решённая нетривиальная боль)? Прогони
> через фильтр (ниже). Если **да** — напиши `mailbox/to-brain/YYYY-MM-DD-<slug>.md`.
> Если нет — **ничего не пиши** (тишина = норма).

И строку в `CLAUDE.md` (раздел про связь с brain): «Значимые переносимые находки сам
отправляю в мозг через `mailbox/to-brain/` — см. pool #009».

## Фильтр (анти-спам — слать только если ВСЕ три выполнены)

1. **Значимость** — новый скилл/фича/паттерн/решённая нетривиальная боль, не рутинный фикс/бамп/локальный рефактор/релиз.
2. **Переносимость** — применимо за пределами домена MatricaRMZ (другой проект мог бы переиспользовать).
3. **Неочевидность** — без этой работы сам бы не знал; есть «урок».

Любое «нет» → молчим. **По умолчанию — молчим.**

### Калибровка
- ✅ Делиться: «CODEBASE_MAP для cold-start», «изоляция deploy-key», новый CI/деплой-паттерн, обход бага инструмента, удачный приём token-economy.
- ❌ Молчать: «пофиксил расчёт BOM», «обновил Drizzle», «отрефакторил Electron-окно», «выпустил v1.21.x».

## Формат письма

Шаблон — письмо-источник #008 (`setka/mailbox/to-brain/2026-05-28-secrets-outside-repo-pattern.md`):
frontmatter `from: MatricaRMZ`, `to: brain`, `date`, `kind: idea`, `topic`, `compliance`, `urgency`;
тело — TL;DR / как устроено у тебя / почему переносимо / что просишь от brain. Писать
ТОЛЬКО в свой репо; brain прочитает на своём `/start` и оформит pool (асимметрия v3.1).

## Приоритет

**LOW / backlog.** Правка процесса, не релизная работа — **не прерывать BOM deep flow**
(v1.21.x → v1.22.0). Встроить в любом спокойном окне; один раз встроил — работает само.

## Подтверждение

Письмо `mailbox/to-brain/2026-MM-DD-share-reflex-adopted.md`
(kind=feedback, `ref: [2026-05-29-share-findings-reflex]`) — встроил шаг + ссылка на PR. После — архивируй.

## Связано

- Pool [#009 share-findings-reflex](../../../cross-project-ideas/ideas/009-share-findings-reflex.md)
- [ADR-0001 mailboxes](../../../adr/0001-brain-projects-mailboxes.md), [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md)

---

## Result

**Date:** 2026-05-30
**Status:** done
**Notes:** Встроен условный §2.5 «Шеринг находки в мозг» в `.claude/commands/close_session.md` (между SESSION_HANDOFF и commit) + строка-якорь в `CLAUDE.md`. Анти-спам фильтр (значимость ∧ переносимость ∧ неочевидность), «по умолчанию молчим». PR `chore/share-findings-reflex-009`.
**Acknowledgement:** [`MatricaRMZ/mailbox/to-brain/2026-05-30-share-reflex-adopted.md`](../../../../../MatricaRMZ/mailbox/to-brain/2026-05-30-share-reflex-adopted.md)
