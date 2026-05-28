# 007 — `/close_session` авто-мерж готовых PR + финальная sync веток с GitHub

**Status (overall):** ⚠️ proposed (MatricaRMZ pioneer 2026-05-26)
**Born in:** MatricaRMZ, `.claude/commands/close_session.md` (commit `39f9632e`).
**Born from:** письмо [`MatricaRMZ/mailbox/to-brain/2026-05-26-close-session-auto-merge-idea.md`](../../mailboxes/MatricaRMZ/.last-seen) — работа с двух компов (PC40 + domashniy), 5-9 PR/день, и без явного финального шага sync нить разработки рвётся при переходе на другую машину.

---

## Проблема

В multi-machine workflow (один проект, два+ компа через git) к концу длинной сессии состояние «грязное»:

- `main` свежий локально, но часть мержей прошла через UI и локально не подтянута (`git pull` забыт);
- висят локальные feature-ветки (часть смержена, часть с un-pushed коммитами);
- открытые PR в смешанном состоянии (зелёные ждут merge, красные требуют доделки);
- handoff пишется, но не отражает «что осталось в обороте».

При переходе на другой комп `git pull` подтянет **только закоммиченное в main**. Остальное остаётся на брошенной машине → нить рвётся, пользователь тратит 10-20 минут на ручную сверку.

## Решение

Расширить `/close_session` **двумя шагами** до записи handoff'а:

### Шаг A — Закрыть готовые открытые PR (auto-merge безопасных)

`gh pr merge --squash --delete-branch` **только если все условия одновременно**:

1. Base = main (или релизная ветка проекта).
2. CI зелёный (либо явное одобрение пользователя в сессии при отсутствии CI — например, GitHub Outage).
3. `mergeable: MERGEABLE`, нет conflicts.
4. Не draft.
5. Содержимое **уже обсуждено и одобрено в сессии** (пользователь явно сказал «merge»).
6. Нет нерешённых review-комментариев.

При сомнениях — **один** `AskUserQuestion` со всем списком сомнительных PR (не по каждому отдельно).

### Шаг B — Финальная синхронизация веток

```bash
git fetch --all --prune
git checkout main && git pull --ff-only
# для каждой локальной ветки кроме main:
#   - смержена в origin/main → git branch -d
#   - есть un-pushed коммиты → НЕ ТРОГАТЬ, упомянуть в handoff (WIP пользователя)
git status   # clean (или известные untracked, объявленные в handoff)
```

Handoff пишется уже на финальное состояние и коммитится через PR (ADR-0002).

### Гарантия результата

После корректного `/close_session`: `main` на новой машине после `git pull` = полный снимок; никаких висящих веток без причины в handoff'е; все «брошенные» состояния (red CI, un-pushed WIP, conflicts) явно перечислены.

## Применимость

### applicable_when
- Multi-machine workflow (проект разрабатывается с двух+ компов через git).
- PR-only flow ([ADR-0002](../../adr/0002-pr-only-flow-no-direct-push.md)) — иначе нечего auto-merge'ить.
- Есть `.claude/commands/close_session.md` (pool [#003](003-session-handoff.md) применён) — шаги встраиваются в него.
- `gh` CLI настроен.

### not_applicable_when
- Один комп — выигрыш минимален (нить и так не «застревает» на другой машине), но шаг B всё равно полезен для гигиены веток.
- Строгий code review (финтех и т.п.) — auto-merge даже зелёных PR нежелателен; тогда шаг A вырождается в «список зелёных + ask user merge each».
- Нет PR-only flow.

## Параметры адаптации (per-project)

- **Критерий «зелёного CI»** — у каждого проекта свой набор checks (typecheck/tests/lint/build). У setka проще, чем у MatricaRMZ.
- **Базовая ветка** — main / master / develop.
- **Релизные ветки** — если есть `release/*`, auto-merge может работать и для них.
- **Draft / WIP convention** — draft-PR игнорировать; если convention через label `WIP` — фильтр по labels.
- **Merge strategy** — squash / rebase (линейная история) / merge — параметр.

## Implemented in / not_applicable_for

| Проект | Статус | Дата | Заметка |
|---|---|---|---|
| MatricaRMZ | ✅ применено | 2026-05-26 | Pioneer. `close_session.md` стал 10-шаговым (было 7): +шаг 3 auto-merge безопасных PR, +шаг 4 закрытие смерженных локальных веток, +шаг 9 финальный `git fetch --all --prune` + verify `main = origin/main`. Консервативно: stacked-PR (base != main) не auto-merge'ит. Секция «Что НЕ делать» расширена (не мержить без явного одобрения, не push'ить чужие ветки, не удалять ветки с un-pushed коммитами). |
| setka | ❓ кандидат | — | Уже есть `/close_session` (#003 ✅) + `/finish`, 5-9 PR/день — главный кандидат на auto-merge. MatricaRMZ интересуется их паттерном обработки draft-PR / stacked branches, если setka реализует агрессивнее. |
| GONBA | ❓ кандидат | — | Есть `/close_session` (#003 ✅). Multi-machine? — уточнить. |
| KARMAN | ❓ кандидат | — | После пробуждения проекта + применения #003. |

## Возможные расширения (предложены MatricaRMZ, все опциональны)

1. **Smart merge order** — stacked PR мержить bottom→top (сейчас MatricaRMZ просто не трогает stacked).
2. **Rebase before merge** — для проектов с линейной историей.
3. **Auto-rebase stale branches** — `gh pr update-branch` если base сместился.
4. **Release-candidate trigger** — если раскатан релиз, но build/installer pending — пометить в handoff `[BLOCKED-ON: external]`, чтобы `/start` поднял первой строкой.
5. **Stash protection** — warn если `git stash list` непуст / stash старше N дней.
6. **Auto-archive ветки с PR=closed-not-merged** — предложить удалить локальную ветку отвергнутого PR.

## Связано

- Pool [#003 SESSION_HANDOFF](003-session-handoff.md) — `/close_session` skill, в который встраиваются шаги A/B; без него идея неприменима.
- [ADR-0002 PR-only flow](../../adr/0002-pr-only-flow-no-direct-push.md) — предпосылка (есть что мержить через PR).
- Письмо-источник: `MatricaRMZ/mailbox/to-brain/2026-05-26-close-session-auto-merge-idea.md`.
