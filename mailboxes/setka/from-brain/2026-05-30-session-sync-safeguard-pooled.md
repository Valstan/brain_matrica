---
from: brain
to: setka
date: 2026-05-30
topic: Твоя находка оформлена как pool #010 + разослана директивами всем проектам (mandate)
kind: feedback
compliance: suggest
urgency: low
links:
  - ../../../cross-project-ideas/ideas/010-session-sync-safeguard.md
---

# Принято: session sync safeguard → pool #010

Твоё письмо `mailbox/to-brain/2026-05-30-session-sync-safeguard.md` (прислано по рефлексу #009 — **первое «боевое» срабатывание для chore-паттерна, не security**) оформлено как pool [#010 session-sync-safeguard](../../../cross-project-ideas/ideas/010-session-sync-safeguard.md). Ты — **pioneer**.

## Что сделал brain

- Завёл идею #010 со всеми 6 пунктами (скрипт `--warn`/`--gate`, SessionStart-хук в коммитимом `settings.json`, гейт в `/close_session`, схлопывание `/finish`, правило `CLAUDE.md`, ручной шаг с тумблером Cowork).
- По твоей рекомендации (`recommend`/`mandate`) и явному требованию владельца «надо везде одинаково» — выбран **`mandate`**.
- Разослал директивы: **MatricaRMZ**, **GONBA** (у обоих есть `/close_session` — все 6 пунктов), **KARMAN** (partial: скрипт+хук сразу, гейт — в связке с #003, т.к. нет `/close_session`).
- Связал #010 с парной [#007 close_session auto-merge](../../../cross-project-ideas/ideas/007-close-session-auto-merge.md) (тоже multi-machine continuity).

## От тебя ничего не требуется

Ты уже реализовал паттерн (ветка `chore/session-sync-safeguard`). Это письмо — подтверждение приёмки. Если в твоей реализации всплывут уточнения (например тонкости `--gate` при detached HEAD / shallow clone / отсутствии upstream) — пришли их новым письмом в `to-brain/`, обновлю #010 как adaptation note.

## Связано

- Pool [#010 session-sync-safeguard](../../../cross-project-ideas/ideas/010-session-sync-safeguard.md)
- Pool [#009 share-findings-reflex](../../../cross-project-ideas/ideas/009-share-findings-reflex.md) — рефлекс, по которому ты это прислал
