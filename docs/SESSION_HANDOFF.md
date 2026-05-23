# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-24 (Claude Opus 4.7 — MatricaRMZ token-economy пилот запущен)
**Branch:** main

## Текущая нитка

**Token economy program — пилот в MatricaRMZ.** Сознательно отступили от 2-точечного критерия (нужны были 2 замера прежде разморозки этапов 2/3) и направили программу в **главный cost driver** — MatricaRMZ (66% baseline-расходов). Этап 3 (CODEBASE_MAP) переориентирован с GONBA/KARMAN на MatricaRMZ.

Две директивы MatricaRMZ в полёте:
- **Tactical practices** (apply now, безопасно для v1.22.0) — узкий cold-start, routing моделей, sub-agents, `/compact`
- **`docs/CODEBASE_MAP.md`** (timing: окно после блока C v1.22.0) — куратируемая карта монорепо ≤2 экрана

Замер эффекта — `/audit-usage 14d` ≈ **2026-06-07**: сравнение с baseline. Цель — top-сессии MatricaRMZ \$113 → \$80, средний cost -20%.

## Следующий шаг

**Entry-point для следующей meta-сессии (одна из веток в зависимости от даты):**

### Вариант A — раньше 2026-06-07

1. Проверить ack'и (см. «Не забыть» — 5 директив в полёте)
2. По существу замера ничего не делать — рано
3. Если есть свежие письма `to-brain` — обработать (форвард в pool, ack обратно, архивация)

### Вариант B — на или после 2026-06-07

1. Запустить `/audit-usage 14d` — вторая точка замера
2. Сравнить с baseline (см. ниже «Baseline 2026-05-16 .. 2026-05-23»)
3. **Ревью результата MatricaRMZ-пакета:**
   - Top-сессии MatricaRMZ опустились ниже \$80? Tactical practices работают
   - CODEBASE_MAP уже создан (см. ack)? Если да — отдельная дельта; если нет (окно ещё не открылось) — отметить «ждём»
   - Сэкономлено -20% или больше? → оформить tactical practices как cross-project pool-идею, предложить GONBA/setka
   - Если эффект слабый / нет → пересмотреть гипотезу, обновить ADR-0003 changelog, возможно откатить часть практик
4. Записать вторую точку и решение в [token-economy roadmap](plans/token-economy-program.md) → история

## Контекст

### Baseline 2026-05-16 .. 2026-05-23 (первый прогон `/audit-usage`)

- **Total:** \$491.25 · 705M tokens · 27 sessions · cache rate **97%**
- **Top-проект:** MatricaRMZ **\$325.60 (66%)** — 9 сессий, 2 worktree
- **Топ-сессии:** обе MatricaRMZ — `e18945ec` \$113.76 (8.5ч, cold start «прочитай readme»), `6cc0759f` \$113.62 (6ч, `/start` тактический развернулся в энциклопедический обход)
- **Доли:** setka 15% / brain_matrica 8% / GONBA 6% / KARMAN 3% / mikrokredit (archived) 1%
- **Гипотеза подтверждена частично:** MatricaRMZ — главный driver, антипаттерн — длинные cold-start. Окончательно проверится во второй точке.

### Связанные коммиты / PR этой сессии

- `2889650` — PR [#22](https://github.com/Valstan/brain_matrica/pull/22): archive MatricaRMZ acks (SSH + e2e-audit) ✅ merged
- `5c0b5e7` — PR [#23](https://github.com/Valstan/brain_matrica/pull/23): KARMAN adopt SESSION_HANDOFF + закрытие mikrokredit ✅ merged
- `cf99df3` — PR [#24](https://github.com/Valstan/brain_matrica/pull/24): MatricaRMZ token-economy directives ✅ merged

Открытых PR — нет.

### Состояние ресурсов

- **Inbox:** пуст
- **Pool:** без изменений (4 идеи #001-#004; #003 теперь применяется в KARMAN по `suggest`-долгу)
- **Tech-radar:** без изменений
- **ADRs:** без изменений

## Открытые вопросы для пользователя

_n/a сейчас_ — пакет MatricaRMZ запущен по варианту «A+B», ждём ack от MatricaRMZ + накопление 14-дневных данных. После 2026-06-07 откроется вопрос «сработало или нет → масштабировать на GONBA/setka или откат».

## Не забыть (low-priority)

### 5 директив в полёте, ждут ack от проектов

- MatricaRMZ → [`2026-05-24-token-economy-tactical-practices.md`](../mailboxes/MatricaRMZ/from-brain/2026-05-24-token-economy-tactical-practices.md) (recommend, normal — apply now)
- MatricaRMZ → [`2026-05-24-codebase-map-create.md`](../mailboxes/MatricaRMZ/from-brain/2026-05-24-codebase-map-create.md) (recommend, normal — окно после блока C v1.22.0)
- GONBA → [`2026-05-23-prod-redesign-followup-config.md`](../mailboxes/GONBA/from-brain/2026-05-23-prod-redesign-followup-config.md)
- setka → [`2026-05-23-adopt-session-handoff.md`](../mailboxes/setka/from-brain/2026-05-23-adopt-session-handoff.md)
- KARMAN → [`2026-05-24-adopt-session-handoff.md`](../mailboxes/KARMAN/from-brain/2026-05-24-adopt-session-handoff.md) (suggest, low — backlog без срока)

### Технические долги brain

- **`letter.md` skill** — `git mv DRAFTS/file → from-brain/file` не работает для untracked draft; обходное решение применялось — пишем прямо в `from-brain/`. Починить когда руки дойдут.
- **`/weekly-audit` skill** — [план](plans/weekly-environment-audit.md), не путать с `/audit-usage` (этап 1 token economy). Отдельная история, не приоритет.

### Quarterly audit Q3 2026

- август-сентябрь 2026 — совпадает с этапом 4 token economy. Триггер ставится в handoff в первой meta-сессии нового квартала.

### MatricaRMZ-only напоминания

- Если MatricaRMZ пришлёт ack на CODEBASE_MAP с примечанием «трудно куратировать большую карту» — рассмотреть split на `docs/architecture/<module>.md` мелкие.
- Если CODEBASE_MAP не создан к 2026-06-07 (блок C v1.22.0 затянулся) — замер делаем **только по tactical practices**; CODEBASE_MAP-эффект меряем позже.
