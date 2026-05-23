# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-23 (Claude Opus 4.7 — этап 1 token economy реализован)
**Branch:** main

## Текущая нитка

**Token economy program** — продолжение. Этап 1 ([ADR-0003](../adr/0003-token-economy-principles.md) + [roadmap](plans/token-economy-program.md)) **завершён**: `ccusage` в trial, brain skill [`/audit-usage`](../.claude/commands/audit-usage.md) реализован и протестирован. PR [#20](https://github.com/Valstan/brain_matrica/pull/20) ждёт merge.

Дальше — **пассивное накопление данных** минимум 2 недели, без активной работы по программе. Этапы 2, 3, 4 в `NOT STARTED`, разморозятся когда будет вторая точка замера.

## Следующий шаг

**Entry-point для следующей meta-сессии (одна из веток в зависимости от даты):**

### Вариант A — раньше чем через ~7 дней после 2026-05-23

1. Merge PR #20 (если ещё не вмержен)
2. По существу program ничего не делать — рано
3. Можно заняться **«не забыть» из списка ниже** (4 директивы в полёте → проверить ack, KARMAN директива #003, и т.д.)

### Вариант B — через ~14+ дней после 2026-05-23 (≈ 2026-06-06)

1. Запустить `/audit-usage 14d` — вторая точка замера
2. Сравнить с baseline (см. ниже «Baseline 2026-05-16 .. 2026-05-23»)
3. **Ревью вопроса MatricaRMZ pilot**: подтверждает ли вторая неделя что MatricaRMZ — главный cost driver? Если да → [token-economy plan этап 3](plans/token-economy-program.md) переориентировать с GONBA/KARMAN на MatricaRMZ через ADR/обновление плана
4. Принять решение: переходим к этапу 2 (директивы pool #004) или этапу 3 (CODEBASE_MAP pilot)

**Критерий разморозки этапа 2/3:** есть две точки замера + понимание главного cost driver.

## Контекст

### Baseline 2026-05-16 .. 2026-05-23 (первый прогон `/audit-usage`)

- **Total:** $491.25 · 705M tokens · 27 sessions · cache rate **97%**
- **Top-проект:** MatricaRMZ **$325.60 (66%)** — 9 сессий, 2 worktree
- **Топ-сессии:** обе MatricaRMZ — `e18945ec` $113.76 (8.5ч, cold start «прочитай readme»), `6cc0759f` $113.62 (6ч, `/start` тактический)
- **Доли:** setka 15% / brain_matrica 8% / GONBA 6% / KARMAN 3% / mikrokredit (archived!) 1%
- **Гипотеза:** длинные cold-start сессии MatricaRMZ — главный cost driver. CODEBASE_MAP (этап 3) даст там больший эффект, чем на GONBA/KARMAN. **Проверить во второй точке.**

### Связанные коммиты этой сессии
- `c55309b` — feat(brain): /audit-usage skill (PR [#20](https://github.com/Valstan/brain_matrica/pull/20), pending merge)
- Открытые PR: **#20** (этот)

### Состояние ресурсов
- **Inbox:** пуст
- **Pool:** без изменений (4 идеи #001-#004)
- **Tech-radar:** +ccusage (trial) — в PR #20
- **ADRs:** без изменений (3 ADR)

## Открытые вопросы для пользователя

_n/a сейчас_ — все вопросы упираются в накопление данных. После 2-й точки замера откроется вопрос «pilot этапа 3 → MatricaRMZ или нет», который решается данными.

## Не забыть (low-priority)

- **PR #20 merge** — handoff упоминает merged-ветку как baseline; пока не merged, ссылки `tech-radar/tools/ccusage.md` на main не работают
- **mikrokredit ожил** — 2026-05-20 одна Claude-сессия $3.60 в archived проекте. Спросить пользователя что там делалось (может надо разархивировать?)
- **4 директивы в полёте, всё ещё ждут ack от проектов:**
  - MatricaRMZ → [`2026-05-23-isolate-ssh-deploy-key.md`](../mailboxes/MatricaRMZ/from-brain/2026-05-23-isolate-ssh-deploy-key.md)
  - MatricaRMZ → [`2026-05-23-end-to-end-audit-before-production.md`](../mailboxes/MatricaRMZ/from-brain/2026-05-23-end-to-end-audit-before-production.md)
  - GONBA → [`2026-05-23-prod-redesign-followup-config.md`](../mailboxes/GONBA/from-brain/2026-05-23-prod-redesign-followup-config.md)
  - setka → [`2026-05-23-adopt-session-handoff.md`](../mailboxes/setka/from-brain/2026-05-23-adopt-session-handoff.md)
- **KARMAN — следующий по pool #003** (`/letter KARMAN adopt-session-handoff`) — окно появится в варианте A entry-point
- **Уточнение в `letter.md` skill** — `git mv DRAFTS/file → from-brain/file` не работает для untracked draft
- **`/weekly-audit` skill** — [план](plans/weekly-environment-audit.md), не путать с `/audit-usage` (этап 1)
- **Quarterly audit tech-radar** — Q3 2026 (август-сентябрь), совпадает с этапом 4 token economy
