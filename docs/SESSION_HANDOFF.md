# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-22 (Claude Opus 4.7 session, продолжение инициализации)
**Branch:** main

## Текущая нитка

**Завершение интеграционного слоя brain_matrica ↔ три код-проекта.** Базовая структура заложена в первой сессии 2026-05-22 (Sonnet). Во второй сессии 2026-05-22 (Opus) подключены три проекта и заполнены метаданные.

## Что сделано во второй сессии 2026-05-22

- ✅ `D:\GitHubReps\MatricaRMZ\CLAUDE.md` — добавлен раздел «Cross-project knowledge base» (после блока «Источники правды», перед «Команды управления сессией»). Изменения unstaged в репо MatricaRMZ — закоммитить при следующей MatricaRMZ-сессии.
- ✅ `D:\GitHubReps\GONBA\CLAUDE.md` — старая строка про `C:\Users\valstan\.claude\cross-project-ideas\` в таблице «Источники правды» заменена на строку про `../brain_matrica/`. Изменения unstaged в GONBA — закоммитить при следующей GONBA-сессии.
- ⚠️ `D:\GitHubReps\setka\CLAUDE.md` — **не отредактирован** (auto-mode classifier Claude Code заблокировал правку как scope escalation, даже после явного согласия пользователя через AskUserQuestion). Готовый snippet положен в [`docs/integration-snippets/setka-CLAUDE.md.snippet.md`](integration-snippets/setka-CLAUDE.md.snippet.md) — применить при следующей setka-сессии. После применения — удалить snippet.
- ✅ `~/.claude/cross-project-ideas/INDEX.md` — заменён на редирект (содержимое legacy сохранено в `ideas/*.md` как замороженный архив).
- ✅ `README.md` brain_matrica — добавлен раздел «Локальный путь и интеграция с проектами» с обоснованием выбора `../brain_matrica/` относительного пути и инструкцией fallback / override.
- ✅ `projects/GONBA.md` — заполнен реальными данными (Next.js 15 + Payload CMS + PostgreSQL, прод `https://гоньба.рф/`, активная нитка Media→Я.Диск).
- ✅ `projects/setka.md` — заполнен (Python 3.12 + Celery + Redis + VK API, `setka-prod`, рефакторинг VK-уведомлений завершён 2026-05-21). Спорное помечено `(уточнить)`: framework setka, public URL.
- ✅ `projects/INDEX.md` — обновлены строки GONBA и setka реальным стеком и URL.

## Следующий шаг (первый в следующей brain_matrica-сессии)

1. **Проверить применение snippet'а в setka.** При следующей setka-сессии пользователь применит `docs/integration-snippets/setka-CLAUDE.md.snippet.md`, после чего snippet удаляется. В brain_matrica `/start` проверь — если snippet ещё на месте, напомни пользователю применить.
2. **Уточнить «(уточнить)» в `projects/setka.md`:** какой framework (FastAPI? Flask?), есть ли public URL.
3. **Рассмотреть стратегический вопрос:** унифицировать `SESSION_HANDOFF + /close_session` (MatricaRMZ, GONBA) vs `DEV_HISTORY + /finish` (setka), или оставить разные подходы. Если унифицировать — это **идея №004** в pool.
4. **Подумать про auto-discovery brain_matrica.** Сейчас принят относительный путь `../brain_matrica/`. Если у пользователя другая раскладка на втором компе — нужен fallback (через `~/.claude/CLAUDE.md` local override). Подтвердить рабочесть на втором компе при первой сессии оттуда.

## Контекст

- **Repo:** https://github.com/Valstan/brain_matrica (private)
- **Local clone:** `D:\GitHubReps\brain_matrica\` (Windows)
- **Соседние проекты:**
  - MatricaRMZ: https://github.com/Valstan/MatricaRMZ → `D:\GitHubReps\MatricaRMZ\`
  - GONBA (Gonba): https://github.com/Valstan/Gonba → `D:\GitHubReps\GONBA\`
  - setka: https://github.com/Valstan/setka → `D:\GitHubReps\setka\`

## Открытые вопросы

1. **Auto-mode classifier vs setka/CLAUDE.md:** Если хотим иметь возможность править CLAUDE.md соседних проектов из brain_matrica-сессии — нужно добавить разрешение в `D:\GitHubReps\brain_matrica\.claude\settings.json` (или global `~/.claude/settings.json`). Пока решено через snippet-механизм (workaround, не идеальный).
2. **Унификация подходов** к session continuity (см. «следующий шаг» #3).
3. **Стартовое наполнение tech-radar** — Drizzle ORM (adopt, MatricaRMZ), electron-builder (adopt, MatricaRMZ), Payload CMS (adopt, GONBA), Celery+Redis (adopt, setka), pnpm 10 (adopt), pnpm 11 (hold, несовместим). Это можно сделать в любой свободной сессии — не блокер.

## Не забыть (low-priority)

- При первой возникшей надпроектной дилемме («Bun vs Node для нового проекта», «Drizzle vs Prisma для нового», «monorepo vs polyrepo») — записать ADR-0001 в `adr/`.
- Когда snippet setka применится и удалится — обновить этот handoff (убрать пункт про setka из «следующий шаг» #1).
- Когда `~/.claude/cross-project-ideas/` будет полностью неиспользуем (через месяц-два) — оставить только редирект, удалить `ideas/*.md` чтобы не путал.
- Кейс `MatricaRMZ.worktrees/` рядом с MatricaRMZ в `D:\GitHubReps\` — относительный путь `../brain_matrica/` отсюда тоже работает (это `D:\GitHubReps\brain_matrica\`), проверить при следующей сессии в worktree.
