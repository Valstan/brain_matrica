# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-29 (Claude Opus 4.8 — оформлен pool #009 share-findings-reflex + 4 директивы; PR #34 merged)
**Branch:** main

## Текущая нитка

Две параллельные нитки на мета-уровне:

1. **🆕 Pool #009 «Рефлекс шеринга находок» — только что запущен.** По запросу @valstan: проекты должны **сами** делиться новыми переносимыми скиллами/фишками, а не ждать явной просьбы. Раньше канал `to-brain` существовал, но само-инициативная находка прилетела **1 раз за всё время** (setka → #008). Решение: условный шаг в проектном `/close_session` (само-проверка «родилось ли значимое переносимое?») + 3-частный анти-спам фильтр (значимость + переносимость + неочевидность; **тишина = норма**). Раскатано директивами всем 4 сразу (PR [#34](https://github.com/Valstan/brain_matrica/pull/34) merged). setka — pioneer (формализует то, что уже делал спонтанно), KARMAN — в связке с #003.

2. **Token-economy program — ждём вторую точку замера ≈2026-06-07.** Пилот в MatricaRMZ (главный cost driver, 66% baseline) применён. Замер `/audit-usage 14d` сравнить с baseline (см. «Контекст»). Если -20%+ → снять `(ждём)` с pool #005 CODEBASE_MAP, раскатать на GONBA/setka.

## Следующий шаг

Зависит от даты входа в следующую meta-сессию:

### Вариант A — раньше 2026-06-07
1. `/start` подберёт ack'и из `to-brain/` проектов. **Ожидается первым — ack от setka на #009** (он уже в теме шеринга).
2. Обработать любые новые письма (форвард в pool, ack-архивация по правилам `/start` 2.5/2.6).
3. По token-economy замеру ничего не делать — рано.

### Вариант B — на/после 2026-06-07
1. `/audit-usage 14d` — вторая точка, сравнить с baseline.
2. Ревью эффекта MatricaRMZ-пакета (tactical practices + CODEBASE_MAP применены одновременно — мерить совокупно).
3. -20%+ → снять `(ждём 2026-06-07)` с [pool #005](../cross-project-ideas/ideas/005-codebase-map.md), директива CODEBASE_MAP в GONBA/setka; tactical practices оформить отдельной pool-идеей. Слабо/нет → пересмотреть гипотезу, changelog ADR-0003.
4. Записать вторую точку в [token-economy roadmap](plans/token-economy-program.md).

## Контекст

- **Pool:** 9 идей (#001–#009). Свежее: **#009 share-findings-reflex** (born in brain, setka pioneer). #008 secrets-outside-repo (setka pioneer, 3 директивы в полёте). #007 close_session auto-merge (setka pioneer). #005 CODEBASE_MAP (MatricaRMZ pilot, остальные `ждём 2026-06-07`).
- **Inbox:** пуст.
- **Tech-radar / ADRs:** без изменений в этой сессии.
- **Связанные коммиты сессии:** `6800e4c` (PR [#34](https://github.com/Valstan/brain_matrica/pull/34) — #009 + 4 директивы).
- **Baseline token-economy (2026-05-16..05-23):** Total \$491.25 · 705M tok · 27 sessions · cache 97%. MatricaRMZ \$325.60 (66%). Top-сессии — обе MatricaRMZ ~\$113 (cold-start антипаттерн). Цель: top-сессии → <\$80, средний -20%.

## Открытые вопросы для пользователя

_n/a_ — обе нитки в режиме ожидания (ack'и на директивы + накопление 14-дневных данных к 2026-06-07).

## Не забыть (low-priority)

### Директивы в полёте (ждут ack от проектов)

- **#009 share-findings-reflex** → все 4: `mailboxes/{MatricaRMZ,GONBA,setka,KARMAN}/from-brain/2026-05-29-share-findings-reflex.md`. setka — formalize; MatricaRMZ — после BOM deep flow; GONBA — окно between threads; KARMAN — в связке с #003.
- **#008 secrets-outside-repo** → GONBA (подтверждён скан: `.env` в дереве репо, мигрировать в `/etc/gonba/`), MatricaRMZ (сначала проверить posture), KARMAN (в связке с #003). setka — pioneer, done.
- **#006 full-session SSH opt-in** → GONBA/KARMAN (`recommend`/`low`). MatricaRMZ done, setka pioneer.
- **MatricaRMZ install/update architecture audit** (`2026-05-28-install-update-architecture-audit.md`) — отдельная нитка, не смешивать с secrets.
- **GONBA prod-redesign-followup** (`2026-05-23`) — **partial**: SQL в [GONBA#35](https://github.com/Valstan/Gonba/pull/35) merged, ждёт применения с dev-машины.
- **KARMAN #003 adopt SESSION_HANDOFF** (`2026-05-24`) — `suggest`/backlog, тянет за собой #009 и часть #008. Взять при пробуждении проекта пакетом.

### Connectivity

- `/health` skill даёт mailbox-connectivity таблицу (возраст awaiting + last-reply, флаги 🟢/🟡/🟠/🔴). **Запускать раз в неделю.** Последний полный аудит — 2026-05-24 (все 4 🟢).

### Технические долги brain

- **`letter.md` skill** — `git mv DRAFTS/→from-brain/` не работает для untracked draft; обход — писать сразу в `from-brain/`. Применялся и в этой сессии (#009 писал напрямую).
- **PowerShell here-string в commit** — `git commit -m @'...'@` просачивает разделители `@` в тело сообщения. Обход: писать сообщение во временный файл + `git commit -F`. Применено при #34.
- **`/weekly-audit` skill** — [план](plans/weekly-environment-audit.md), не путать с `/audit-usage`. Не приоритет.

### Quarterly audit Q3 2026

- август-сентябрь 2026 — совпадает с этапом 4 token economy. Триггер ставится в handoff первой meta-сессии нового квартала.
