# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-24 (Claude Opus 4.7 — пакет MatricaRMZ ack'нут + applied, pool #005 candidate оформлен)
**Branch:** main

## Текущая нитка

**Token economy program — пилот в MatricaRMZ.** Сознательно отступили от 2-точечного критерия (нужны были 2 замера прежде разморозки этапов 2/3) и направили программу в **главный cost driver** — MatricaRMZ (66% baseline-расходов). Этап 3 (CODEBASE_MAP) переориентирован с GONBA/KARMAN на MatricaRMZ.

**Статус пакета MatricaRMZ (на 2026-05-24):**
- ✅ **Tactical practices** — `acknowledged` (письмо `2026-05-24-token-economy-tactical-applied.md`). Применено уже в той же сессии (узкий `/start`, routing моделей, `Explore` sub-agents, `/compact`, параллельные tool calls, `/cost` в `/close_session`). Оригинал директивы архивирован.
- ✅ **`docs/CODEBASE_MAP.md`** — `done` (письмо `2026-05-24-codebase-map-acknowledged.md` + [MatricaRMZ#28](https://github.com/Valstan/MatricaRMZ/pull/28) merged). Карта создана, `CLAUDE.md` обновлён, `start.md` переписан. Оригинал директивы архивирован.

Cycle закрылся **в ту же сессию** — оба ack'а пришли быстрее ожидаемого.

**Cross-project pool-идея оформлена авансом:** [pool #005 CODEBASE_MAP](../cross-project-ideas/ideas/005-codebase-map.md) — `⚠️ candidate` для GONBA/setka/KARMAN с явным «ждём 2026-06-07». Применять к остальным проектам **только после подтверждения эффекта** в `/audit-usage 14d`.

Замер эффекта — `/audit-usage 14d` ≈ **2026-06-07**: сравнение с baseline. Цель — top-сессии MatricaRMZ \$113 → \$80, средний cost -20%.

## Следующий шаг

**Entry-point для следующей meta-сессии (одна из веток в зависимости от даты):**

### Вариант A — раньше 2026-06-07

1. Проверить ack'и (3 директивы остались в полёте: GONBA partial + setka + KARMAN — обе SESSION_HANDOFF)
2. По существу замера ничего не делать — рано
3. Если есть свежие письма `to-brain` — обработать (форвард в pool, ack обратно, архивация)
4. Если GONBA пришлёт финальное письмо «SQL applied to prod» — архивировать `2026-05-23-prod-redesign-followup-config.md`

### Вариант B — на или после 2026-06-07

1. Запустить `/audit-usage 14d` — вторая точка замера
2. Сравнить с baseline (см. ниже «Baseline 2026-05-16 .. 2026-05-23»)
3. **Ревью результата MatricaRMZ-пакета:**
   - Top-сессии MatricaRMZ опустились ниже \$80? Tactical practices работают
   - CODEBASE_MAP создан (✅ done 2026-05-24, [MatricaRMZ#28](https://github.com/Valstan/MatricaRMZ/pull/28)) — измерять отдельную дельту от карты vs от tactical practices сложно (применены одновременно), смотреть совокупный эффект
   - Сэкономлено -20% или больше? → **снять `(ждём 2026-06-07)`** с pool #005, отправить директиву CODEBASE_MAP в GONBA/setka (KARMAN при пробуждении). Tactical practices — оформить отдельной pool-идеей.
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
- PR (новый, эта сессия): MatricaRMZ token-economy acks архивированы + GONBA report acknowledged + pool #005 candidate

### Состояние ресурсов

- **Inbox:** пуст
- **Pool:** **5 идей** (#001-#005). Новая #005 «CODEBASE_MAP — куратируемая карта монорепо», MatricaRMZ ✅ 2026-05-24 (pilot), GONBA/setka/KARMAN — `candidate (ждём 2026-06-07)`
- **Tech-radar:** без изменений
- **ADRs:** без изменений

## Открытые вопросы для пользователя

_n/a сейчас_ — пакет MatricaRMZ запущен по варианту «A+B», ждём ack от MatricaRMZ + накопление 14-дневных данных. После 2026-06-07 откроется вопрос «сработало или нет → масштабировать на GONBA/setka или откат».

## Не забыть (low-priority)

### Директивы в полёте (после ингеста 2026-05-24)

- GONBA → [`2026-05-23-prod-redesign-followup-config.md`](../mailboxes/GONBA/from-brain/2026-05-23-prod-redesign-followup-config.md) — **partial**: SQL заготовлен в [GONBA#35](https://github.com/Valstan/Gonba/pull/35) merged, ждёт применения с dev-машины. Финальный ack будет письмом `kind=feedback` после `psql -f ... .sql`. Оригинал НЕ архивирован.
- setka → [`2026-05-23-adopt-session-handoff.md`](../mailboxes/setka/from-brain/2026-05-23-adopt-session-handoff.md) — без ответа, low priority (взять в окно между нитками setka).
- KARMAN → [`2026-05-24-adopt-session-handoff.md`](../mailboxes/KARMAN/from-brain/2026-05-24-adopt-session-handoff.md) — без ответа, `suggest`/`low`, backlog без срока.

### Архивировано в этой meta-сессии

- MatricaRMZ → `2026-05-24-token-economy-tactical-practices.md` → ARCHIVE (status: acknowledged)
- MatricaRMZ → `2026-05-24-codebase-map-create.md` → ARCHIVE (status: done, [MatricaRMZ#28](https://github.com/Valstan/MatricaRMZ/pull/28))

### Технические долги brain

- **`letter.md` skill** — `git mv DRAFTS/file → from-brain/file` не работает для untracked draft; обходное решение применялось — пишем прямо в `from-brain/`. Починить когда руки дойдут.
- **`/weekly-audit` skill** — [план](plans/weekly-environment-audit.md), не путать с `/audit-usage` (этап 1 token economy). Отдельная история, не приоритет.

### Quarterly audit Q3 2026

- август-сентябрь 2026 — совпадает с этапом 4 token economy. Триггер ставится в handoff в первой meta-сессии нового квартала.

### MatricaRMZ-only напоминания

- Если MatricaRMZ пришлёт ack на CODEBASE_MAP с примечанием «трудно куратировать большую карту» — рассмотреть split на `docs/architecture/<module>.md` мелкие.
- Если CODEBASE_MAP не создан к 2026-06-07 (блок C v1.22.0 затянулся) — замер делаем **только по tactical practices**; CODEBASE_MAP-эффект меряем позже.
