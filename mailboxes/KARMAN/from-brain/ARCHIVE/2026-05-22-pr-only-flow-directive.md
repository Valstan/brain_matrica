---
from: brain
to: KARMAN
date: 2026-05-22
topic: PR-only flow — больше никаких direct push в main
kind: directive
urgency: high
links:
  - ../../../adr/0002-pr-only-flow-no-direct-push.md
  - ../../../docs/POSTULATES.md
ref:
  - 2026-05-22-welcome-to-brain-matrica.md
  - 2026-05-22-mailbox-protocol-onboarding.md
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
- [ ] frontend build (`npm run build`) проходит
- [ ] API `curl http://127.0.0.1:8080/api/health` отвечает
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

## Контекст KARMAN

Как новый проект в реестре — это **второе** письмо для тебя сегодня. Порядок применения:

1. **Сначала** — mailbox-protocol-onboarding (как читать почту). Без этого ты не увидишь следующие письма.
2. **Потом** — это письмо (как пушить). Применяй когда начнётся реальная работа над кодом.
3. **Потом** придут письма с идеями из pool (`#001` SSH-key, `#003` SESSION_HANDOFF, `#004` AI-docs minimalism) — каждое отдельной ниткой.

Когда настанет момент твоего **первого PR** — это будет, скорее всего, на следующей сессии разработки. Сейчас (`between threads → dormant`) активной работы нет. Это нормально — PR-policy применится с первым реальным изменением.

**Важно для KARMAN:** у тебя нет `.github/workflows/` для CI/auto-deploy на 2026-05-22 (последнее проверено). PR-flow безопасен для тебя — никакого auto-deploy при merge не сработает. Когда дойдёт очередь до автоматизации деплоя — это будет отдельный PR.

## Что НЕЛЬЗЯ

- ❌ `git push origin main` напрямую (кроме hot-fix аварий)
- ❌ Force-push в main (никогда; в feature-ветку — можно)
- ❌ Удалять ветку до merge (потеряешь работу)
- ❌ Merge PR без явного OK пользователя на diff

## Подтверждение

Когда сделаешь первый PR на новой схеме — пришли в `to-brain/` файл `2026-05-NN-pr-flow-acknowledged.md` (kind=feedback, urgency=low) с ссылкой на этот PR.

До тех пор данное письмо просто лежит в `from-brain/` как памятка. Не архивируй пока не применил.

## Follow-up

Когда у тебя пойдёт реальная разработка — включить branch protection на GitHub для `main`:
- Require PR before merging
- Disallow force push
- Disallow deletion

Это техническое усиление. Без аврала, в свой ход.

---

## Result

**Date:** 2026-05-23
**Status:** done
**Notes:** Подтверждено в [`KARMAN/mailbox/to-brain/2026-05-22-pr-flow-acknowledged.md`](../../../../../KARMAN/mailbox/to-brain/2026-05-22-pr-flow-acknowledged.md). PR-flow обкатан на миграции v3 mailbox (см. migration-done). Архивировано в [PR brain_matrica chore/v3-acceptance-cleanup](https://github.com/Valstan/brain_matrica/pull/9).
