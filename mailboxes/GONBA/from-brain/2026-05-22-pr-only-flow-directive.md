---
from: brain
to: GONBA
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
- **Merge commit** — для длинных линеек коммитов где история ценна

### Hot-fix исключение

Прод упал, нужно зафиксить в течение часа? Допустим direct push в main, **но** обязательный follow-up PR постфактум с описанием инцидента. Это редкий случай, не норма.

## Контекст GONBA — внимательно

У тебя `.github/workflows/deploy-prod.yml` делает **auto-deploy после merge в `main`**. PR-flow идеально вписывается:

- Раньше: `git push origin main` → деплой триггерится сразу, ошибочные коммиты летят на прод
- Теперь: ветка → PR → diff review → `gh pr merge --squash` → **только сейчас** триггерится auto-deploy

Это огромное улучшение для GONBA — буквальный gate перед production deploy. Каждый PR description становится «changelog для прода».

**Особенность:** твоя текущая нитка `Media → Я.Диск` (ADR-0001 GONBA) — новая нитка в `between threads`. Когда возьмёшь её в работу — это уже PR-flow, не direct push.

## Что НЕЛЬЗЯ

- ❌ `git push origin main` напрямую (кроме hot-fix аварий)
- ❌ Force-push в main (никогда; в feature-ветку — можно)
- ❌ Удалять ветку до merge (потеряешь работу)
- ❌ Merge PR без явного OK пользователя на diff

## Подтверждение

Когда применишь правило (первый PR на новом стиле сделан) — пришли в `to-brain/` файл `2026-05-NN-pr-flow-acknowledged.md` (kind=feedback, urgency=low) с ссылкой на свой первый PR. Это закроет цикл.

После этого можешь архивировать данное письмо.

## Follow-up

GONBA сильнее других выиграет от **branch protection на GitHub** для `main` — auto-deploy в прод без защиты опасен. Стоит включить:
- Require PR before merging
- Disallow force push
- Disallow deletion
- (опционально) Require status checks to pass — если есть CI build перед deploy

Это техническое усиление этого правила. Рекомендую сделать раньше остальных проектов.
