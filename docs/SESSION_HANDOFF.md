# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-22 (Claude Opus 4.7 — финал сессии, миграция на другой комп)
**Branch:** main

## Текущая нитка

**Пилот dispatch-механизма + парадигматический сдвиг по структуре docs.** Инфраструктура собрана (PROTOCOL, INDEX, items, briefings, permissions, project-auditor, kill-policy). 7 заявок отправлены. First briefing подтвердил value. Зафиксированы три решения пользователя:

1. **`/close_session` — единое имя команды** во всех трёх проектах (setka переименовывает `/finish`).
2. **`SESSION_HANDOFF.md` обязателен везде** («нитка между сессиями нужна везде»).
3. **`DEV_HISTORY` / `DEVELOPMENT_LOG` — артефакт эры слабых LLM**, безопасно упраздняется (записано в pool как **идея #004**). В современной парадигме `git log + SESSION_HANDOFF + PENDING_FOLLOWUPS + ADR` покрывает то же самое.

## Следующий шаг — продолжение на ДРУГОМ компе

Пользователь закрывает сессию на этом компе, переходит на другой. Все наработки сохранены в brain_matrica (запушено в origin/main). Inbox-from-brain копии в siblings — **uncommitted** (по правилу «не лезть в код-проекты из brain_matrica»), на втором компе их не будет.

**Первое действие на втором компе:**

1. `cd ~/dev/brain_matrica && claude` (или `D:\GitHubReps\brain_matrica\`)
2. `/start` — теперь содержит шаг **2.5 «Re-deliver inbox-from-brain в проекты»**, который автоматически разложит canonical заявки из `dispatch/items/` в `<проект>/docs/inbox-from-brain/` каждого из трёх sibling repos.
3. После этого — открыть проектные сессии и обработать заявки.

**Главные «новые наработки» которые ждут проектов:**

| Заявка | Куда | Суть |
|---|---|---|
| #0001 | все три | `/close_session` везде. Решено |
| #0003 | MatricaRMZ | Untracked `brain_matrica/` папка — разобраться |
| #0004 | setka | SESSION_HANDOFF (обязательно). DEV_HISTORY — на усмотрение, см. идея #004 |
| #0006 | все три | Failed approaches секция (полезно, не критично) |
| 🔴 #0007 | GONBA | Security: ключи MatricaRMZ + setka в `authorized_keys` GONBA-сервера |
| **Идея #004** | pool | Минимализм AI-docs 2026 — кандидат к рассмотрению во всех трёх |

## Состояние очереди (по target проектам)

- **MatricaRMZ:** 3 заявки sent (0001, 0003, 0006) — лимит
- **GONBA:** 3 заявки sent (0001, 0006, 🔴 0007) — лимит, security override
- **setka:** 5 заявок sent (0001, 0002, 0004, 0005, 0006) — стартовая партия, превышен лимит. **Стоп-лист**: setka в `deep flow` (MVP big idea, 21 staged file). Никаких новых до закрытия двух текущих + завершения `/reliz` MVP

## Реальные фазы проектов (из first briefing 2026-05-22)

- **MatricaRMZ** — `deep flow` (BOM-refactor 5 релизов, v1.21.3 выпущен, v1.21.4 next)
- **GONBA** — `between threads` (Media→Я.Диск закрыта 2026-05-22, ADR-0001 → Implemented)
- **setka** — `deep flow` (big idea «модуль авто-регистрации регионов» MVP, 21 staged file)

## Контекст

- **Repo:** https://github.com/Valstan/brain_matrica
- **Commits этой сессии:**
  - [`9efb60c`](https://github.com/Valstan/brain_matrica/commit/9efb60c) — интеграция с тремя проектами + метаданные
  - [`f8cdd4c`](https://github.com/Valstan/brain_matrica/commit/f8cdd4c) — dispatch-инфраструктура
  - [`6135740`](https://github.com/Valstan/brain_matrica/commit/6135740) — permission allow rules
  - [`eea0a04`](https://github.com/Valstan/brain_matrica/commit/eea0a04) — Tier 1 (auditor, kill-policy, #0006, briefing task)
  - [`ee617d9`](https://github.com/Valstan/brain_matrica/commit/ee617d9) — первый briefing + 🔴 #0007
  - [`e596d53`](https://github.com/Valstan/brain_matrica/commit/e596d53) — handoff в формате /close_session
  - [`09444e7`](https://github.com/Valstan/brain_matrica/commit/09444e7) — #0001/#0004/#0006 под решения пользователя
  - (этот коммит — идея #004 в pool + finalize)
- **Pool идей:** +1 за сессию (`004-minimalist-ai-docs-2026.md`)

## Открытые вопросы

1. **HANDOFF-устаревание во всех трёх** — системная боль паттерна #003. Handoff не самообновляется при «нитка дозакрыта внутри сессии». Возможная следующая итерация — hook на `git merge --no-ff` / `git tag`, который автоматически дёргает обновление SESSION_HANDOFF.
2. **Автоматизация morning briefing** — после недели использования решить про `/loop 24h` vs `/schedule cron` vs вручную при `/start`.
3. **Применить идею #004 (минимализм docs)** — кандидат для всех трёх проектов, **но** не одномоментно. После применения #0004 (setka получает SESSION_HANDOFF) + 2-3 ниток на новой структуре → упразднение DEV_HISTORY/DEVELOPMENT_LOG безопасно. Возможна заявка #0008 «архивировать DEV_HISTORY» для каждого проекта отдельно — оценивать осенью 2026.

## Не забыть (low-priority)

- **Tech-radar стартовое наполнение** (Drizzle, Payload, Celery, pnpm 10/11, Next.js 15, Groq) — можно в любой свободный момент.
- **ADR-0001 кандидат** — «brain_matrica ↔ проекты через файловые dispatch». Записать когда первый цикл с применёнными заявками завершится.
- **Custom subagent `project-auditor`** подхватится на втором компе при первом `/start` Claude Code (файл в git).
- **Проверка `.claude/settings.json` на втором компе** — правила должны подхватиться (в git). Если что-то блокируется — расширить allowlist.
- **MatricaRMZ — 14 stale `claude/*` веток** — мелкий побочный кандидат на чистку.
- **GONBA — заявки 0001/0006/0007 в inbox-from-brain на этом компе уже исчезли** (clean git status — видимо синхронизация откатила). На втором компе `/start` brain_matrica шаг 2.5 разложит их заново из canonical.
- **MatricaRMZ — 4 файла в inbox-from-brain uncommitted** на этом компе. На втором компе будут разложены заново из canonical.
- **setka — 6 файлов uncommitted в inbox-from-brain + 130+ MVP файлов staged**. На втором компе свежий клон, состояние «как в репо main».

## Архитектурное открытие сессии

**inbox-from-brain копии в siblings — это "кэш", не источник правды.** Источник правды — `brain_matrica/dispatch/items/`. На любом компе brain_matrica `/start` шаг 2.5 распределяет актуальные копии. Это снимает зависимость от состояния sibling worktrees между компами.
