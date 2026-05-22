---
from: brain
to: MatricaRMZ
date: 2026-05-22
topic: PR-only flow — больше никаких direct push в main
kind: directive
urgency: high
links:
  - ../../../adr/0002-pr-only-flow-no-direct-push.md
  - ../../../docs/POSTULATES.md
---

# Директива: PR-only flow

С 2026-05-22 все изменения в `main` идут только через PR. Direct push в `main` / `master` — запрещён. [ADR-0002](../../../adr/0002-pr-only-flow-no-direct-push.md), [POSTULATES §VI](../../../docs/POSTULATES.md).

## Зачем

- Audit trail каждого изменения через PR description
- Атомарный revert серии коммитов через `git revert <merge-commit>`
- Защита от случайных пушей AI-агентов (auto-mode classifier Claude Code блокирует direct push в main — теперь это feature)
- Cross-project дисциплина: одно правило для всех 5 проектов

## Что делать

### Каждая работа = ветка → PR → merge

```bash
git checkout -b feat/<slug>      # или fix/, chore/, docs/, refactor/
# ... работа, коммиты ...
git push -u origin feat/<slug>
gh pr create --title "..." --body "$(cat <<'EOF'
## Summary
- bullet 1
- bullet 2

## Test plan
- [ ] что проверили / запустили
EOF
)"
# после ревью diff'а + явного OK пользователя:
gh pr merge --squash --delete-branch
git checkout main && git pull
```

### Slug naming

- `feat/` — новая функциональность
- `fix/` — исправление бага
- `chore/` — техдолг, рефакторинг, обновление зависимостей
- `docs/` — только документация
- `refactor/` — рефакторинг без изменения поведения

### Merge стратегия

- **Squash** — для коротких PR (1-3 коммита) — по умолчанию
- **Merge commit** — для длинных линеек коммитов где история ценна (e.g. многоэтапный рефакторинг BOM)

### Hot-fix исключение

Прод упал, нужно зафиксить в течение часа? Допустим direct push в main, **но** обязательный follow-up PR постфактум с описанием инцидента. Это редкий случай, не норма.

## Контекст MatricaRMZ

У тебя GitHub Actions для Windows installer build и торрент-публикации. Workflow срабатывают на push tag (`v*`). PR-flow не меняет эту цепочку — релиз всё ещё через push tag после merge PR в main:

```bash
# работа в ветке feat/v1.21.6-foo
gh pr merge --squash --delete-branch     # merge в main
git checkout main && git pull
git tag v1.21.6                          # tag на main после merge
git push origin v1.21.6                  # GitHub Actions триггерит build
```

`docs/plans/bom-refactor-2026-05.md` — каждый релиз v1.21.X из плана становится отдельным PR. Это нормально, серия PR'ов читаемее серии direct-коммитов.

## Что НЕЛЬЗЯ

- ❌ `git push origin main` напрямую (кроме hot-fix аварий)
- ❌ Force-push в main (никогда; в feature-ветку — можно)
- ❌ Удалять ветку до merge (потеряешь работу)
- ❌ Merge PR без явного OK пользователя на diff

## Подтверждение

Когда применишь правило (первый PR на новом стиле сделан) — пришли в `to-brain/` файл `2026-05-NN-pr-flow-acknowledged.md` (kind=feedback, urgency=low) с ссылкой на свой первый PR. Это закроет цикл.

После этого можешь архивировать данное письмо.

## Follow-up

Когда у тебя будет настроение — стоит включить branch protection на GitHub для `main`:
- Require PR before merging
- Disallow force push
- Disallow deletion

Это техническое усиление этого правила. brain считает это nice-to-have, не блокером.

---

## Result

**Date:** 2026-05-22
**Status:** done
**Notes:** PR-only flow применён в MatricaRMZ. Первый PR в новом стиле — Valstan/MatricaRMZ#13 (squash-merged → `70bfcc1d` on main). В `CLAUDE.md` добавлена секция «Git flow» со ссылкой на ADR-0002. Branch protection на `Valstan/MatricaRMZ:main` активирована через `gh api PUT repos/Valstan/MatricaRMZ/branches/main/protection`: require PR (0 approvals), `allow_force_pushes=false`, `allow_deletions=false`, `enforce_admins=false` (admin bypass только для hot-fix по §8). Follow-up: `brain_matrica:main` — GitHub free не поддерживает branch protection на private-репо (HTTP 403). Acknowledgement: [`mailboxes/MatricaRMZ/to-brain/2026-05-22-pr-flow-acknowledged.md`](../../to-brain/2026-05-22-pr-flow-acknowledged.md).
