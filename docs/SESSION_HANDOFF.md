# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-23 (Claude Opus 4.7 — token economy program kickoff)
**Branch:** main

## Текущая нитка

**Token economy program** — cross-project дисциплина «экономия токенов без потери качества». Принципы зафиксированы в [ADR-0003](../adr/0003-token-economy-principles.md), roadmap в [docs/plans/token-economy-program.md](plans/token-economy-program.md). 4 этапа в порядке «сначала видимость, потом действия». Сейчас все 4 этапа в `NOT STARTED` — начинаем с этапа 1.

## Следующий шаг

**Этап 1 — Mass-monitoring setup.** Конкретный первый вход в новой meta-сессии:

1. `npx ccusage@latest` — посмотреть формат данных, какие срезы доступны (per-session / per-day / per-project)
2. Сравнить с `/cost` (built-in) и Anthropic Console
3. Создать `tech-radar/tools/ccusage.md` со статусом (assess / trial / adopt) — куратируемая запись
4. Спроектировать brain skill `/audit-usage` — что читает (`~/.claude/projects/*/`), как агрегирует, какой output
5. Реализовать `.claude/commands/audit-usage.md` — за одну сессию или две
6. Запускать вручную раз в неделю минимум 2 недели для накопления данных

**Критерий завершения этапа 1:** есть `/audit-usage` skill в brain + минимум 2 недели данных хотя бы по одному проекту. После этого можно переходить к этапу 2 (директивы по pool #004).

## Контекст

- **План:** [docs/plans/token-economy-program.md](plans/token-economy-program.md) — детальный roadmap всех 4 этапов
- **ADR:** [adr/0003-token-economy-principles.md](../adr/0003-token-economy-principles.md) — 6 принципов
- **Связанные коммиты этой сессии:**
  - `b67296e` — ADR-0003 + roadmap (#18)
  - `133802d` — setka SESSION_HANDOFF директива (#17, тест /letter)
- **Inbox:** пуст (seed 2026-05-23-token-economy-program удалён — оформлено в ADR + plan)
- **Pool:** без изменений (4 идеи #001-#004)
- **Tech-radar:** без изменений (6 файлов) — ccusage добавится в этапе 1

## Открытые вопросы для пользователя

_n/a_ — приоритеты согласованы через AskUserQuestion (слой E + слой A + ADR-0003 верхнеуровнево). Слои B/C/D/G/H — отложены до данных мониторинга.

## Не забыть (low-priority)

- **4 директивы в полёте, ждут ack от проектов:**
  - MatricaRMZ → [`2026-05-23-isolate-ssh-deploy-key.md`](../mailboxes/MatricaRMZ/from-brain/2026-05-23-isolate-ssh-deploy-key.md)
  - MatricaRMZ → [`2026-05-23-end-to-end-audit-before-production.md`](../mailboxes/MatricaRMZ/from-brain/2026-05-23-end-to-end-audit-before-production.md)
  - GONBA → [`2026-05-23-prod-redesign-followup-config.md`](../mailboxes/GONBA/from-brain/2026-05-23-prod-redesign-followup-config.md)
  - setka → [`2026-05-23-adopt-session-handoff.md`](../mailboxes/setka/from-brain/2026-05-23-adopt-session-handoff.md) (новая в этой сессии)
- **KARMAN — следующий в очереди по pool #003** — отдельная директива `/letter KARMAN adopt-session-handoff` когда будет окно. У него вообще нет `docs/`, директива будет шире (включая создание `docs/`).
- **Уточнение в `letter.md` skill** — `git mv DRAFTS/file → from-brain/file` не работает для untracked draft. Стоит документировать fallback (plain `mv` + `git add new_path`) либо в самом skill, либо в новом `/move-letter`.
- **Реализация `/weekly-audit` skill** — план в [docs/plans/weekly-environment-audit.md](plans/weekly-environment-audit.md). Не путать с `/audit-usage` (этап 1 token economy) — это разные skills.
- **Quarterly audit tech-radar** — Q3 2026 (август-сентябрь). Совпадает по триггеру с этапом 4 token economy — можно объединить в один quarterly review.
- **Вживую протестировать `/health` и `/letter`** — ✅ сделано в этой сессии (`/health` показал штатное состояние; `/letter setka adopt-session-handoff` → PR #17 → merged).
- **#003 SESSION_HANDOFF для KARMAN** — после ack setka.
