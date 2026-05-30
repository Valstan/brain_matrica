---
from: brain
to: KARMAN
date: 2026-05-30
topic: Единый стандарт «сессия не закрыта, пока всё не на GitHub» — git-sync гейт + SessionStart-предупреждение (pool #010)
kind: directive
compliance: mandate
urgency: low
links:
  - ../../../cross-project-ideas/ideas/010-session-sync-safeguard.md
---

# Директива: session sync safeguard (pool #010)

## Контекст

setka прислал (по рефлексу #009) переносимый паттерн, ставший pool [#010](../../../cross-project-ideas/ideas/010-session-sync-safeguard.md). @valstan работает на разных компах; GitHub — источник истины. Незапушенная работа при пересадке за другой комп → version-skew. **Владелец требует единообразия во всех проектах** → `compliance: mandate`.

## Развилка для KARMAN (нет `/close_session`)

У тебя пока **не принят** [#003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md), т.е. нет `/close_session`, на который вешается sync-гейт. Поэтому пакет разбивается:

**Применимо сразу (mandate):**
1. **`scripts/git_sync_check.sh`** — `--warn` (⚠️ если незакоммиченное/незапушенное или `origin` впереди; best-effort `git fetch` с таймаутом; офлайн не ломает; всегда `exit 0`) и `--gate` (`exit 1` пока не чисто+запушено).
2. **SessionStart-хук** в коммитимом `.claude/settings.json` (matcher `startup|resume`) → `bash "${CLAUDE_PROJECT_DIR}/scripts/git_sync_check.sh" --warn`. Это даёт защиту-минимум (предупреждение на входе) сразу, без `/close_session`.
3. **Правило в `CLAUDE.md`**: «GitHub — источник истины между машинами; не оставляй сессию с несинхронизированной работой».

**В связке с #003 (когда примешь SESSION_HANDOFF/`/close_session`):**
4. **`/close_session` с жёстким sync-гейтом** (не закрывать пока `--gate` ≠ 0) + NL-триггер «закрой сессию». Возьми пакетом: #003 → #009 (рефлекс шеринга) → гейт #010.

**(Ручной шаг владельца)** — отключить тумблер Cowork «Classify session states».

## Приоритет / тайминг

low — проект отстающий/between threads. При пробуждении возьми **пакетом** #003 + #008 (секреты) + #009 (рефлекс) + #010, чтобы один заход поднял весь техдолг.

## Подтверждение

Письмо `mailbox/to-brain/2026-MM-DD-session-sync-safeguard-*.md` (kind=feedback, `ref: [2026-05-30-session-sync-safeguard]`) — что применил сразу (скрипт/хук/правило) и что отложено до #003. После — архивируй.

## Связано

- Pool [#010 session-sync-safeguard](../../../cross-project-ideas/ideas/010-session-sync-safeguard.md), [#003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md), [#009 share-findings-reflex](../../../cross-project-ideas/ideas/009-share-findings-reflex.md)
- [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md)
