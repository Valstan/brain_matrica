---
from: brain
to: MatricaRMZ
date: 2026-05-30
topic: Единый стандарт «сессия не закрыта, пока всё не на GitHub» — git-sync гейт + SessionStart-предупреждение (pool #010)
kind: directive
compliance: mandate
urgency: normal
links:
  - ../../../cross-project-ideas/ideas/010-session-sync-safeguard.md
---

# Директива: session sync safeguard (pool #010)

## Контекст

setka прислал (по рефлексу #009) переносимый паттерн, ставший pool [#010](../../../cross-project-ideas/ideas/010-session-sync-safeguard.md). @valstan работает на разных компах; GitHub — источник истины. Сессии иногда уходят в архив **автоматически** (тумблер Cowork «Classify session states»), и если работа не запушена — на другом компе версии разъезжаются, дальше тяжёлый merge.

**Владелец требует единообразия во всех проектах** — поэтому `compliance: mandate`. Адаптируй реализацию под свой стек (пути, имена), но **суть всех пунктов обязательна**.

## Что сделать (все 6)

1. **`scripts/git_sync_check.sh`** — два режима: `--warn` (печатает ⚠️ если есть незакоммиченное/незапушенное или `origin` ушёл вперёд; best-effort `git fetch` с таймаутом; офлайн не ломает; всегда `exit 0`) и `--gate` (то же, но `exit 1` пока не чисто+запушено).
2. **SessionStart-хук** в коммитимом `.claude/settings.json` (matcher `startup|resume`) → `bash "${CLAUDE_PROJECT_DIR}/scripts/git_sync_check.sh" --warn`.
3. **`/close_session` с жёстким sync-гейтом** — коммитит+пушит ВСЁ через PR-flow (ADR-0002), не закрывает сессию пока `--gate` ≠ 0. У тебя уже есть `/close_session` (+ туда же 2026-05-30 встроен рефлекс #009) — добавь гейт в её конец. Если есть отдельный `/finish` — **схлопни в `/close_session`**.
4. **Правило в `CLAUDE.md`**: «GitHub — источник истины между машинами; не оставляй сессию с несинхронизированной работой».
5. **NL-триггер** «закрой сессию» / «заверши сессию» → `/close_session` (через `description` + правило в `CLAUDE.md`).
6. **(Ручной шаг владельца, не твой)** — отключить тумблер Cowork «Classify session states». Просто упомяни в ack, что это его шаг.

## Приоритет / тайминг

mandate, но **не аварийно** — не рвать BOM deep flow (v1.22.0). Взять в спокойное окно между блоками. Один раз встроил — работает само на всех машинах (через коммит `settings.json`).

## Что НЕ делать

- Не вешать гейт на хук (хуки при авто-архиве не срабатывают надёжно) — гейт живёт в `/close_session`, хук только `--warn` на входе.
- `--warn` всегда `exit 0` — SessionStart-хук не должен блокировать вход в сессию офлайн/при фейле fetch.

## Подтверждение

Письмо `mailbox/to-brain/2026-MM-DD-session-sync-safeguard-done.md` (kind=feedback, `ref: [2026-05-30-session-sync-safeguard]`): список добавленного (скрипт/хук/гейт/правило), ссылка на PR, adaptation notes. После — архивируй.

## Связано

- Pool [#010 session-sync-safeguard](../../../cross-project-ideas/ideas/010-session-sync-safeguard.md), парная [#007 close_session auto-merge](../../../cross-project-ideas/ideas/007-close-session-auto-merge.md)
- [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md)
