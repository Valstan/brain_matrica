# ADR 0002: PR-only flow на default branch — никаких direct push

**Date:** 2026-05-22
**Status:** Accepted
**Applies to:** brain_matrica, MatricaRMZ, GONBA, setka, KARMAN (и все будущие проекты под управлением)

## Context

Исторически @valstan и AI-агенты пушили коммиты напрямую в `main` всех проектов. Это работало пока проектов было мало и сессии были короткие. Сейчас:

- Проектов под управлением brain_matrica — 4 активных + новые на подходе
- Часть работы выполняют AI-агенты (Claude Code) автономно
- Auto-mode classifier в Claude Code специально блокирует прямые push в main как небезопасные
- Ошибки в `main` — это срабатывание прод (например, для GONBA: merge в main → auto-deploy через GitHub Actions)

Возникла дилемма: оставлять прямой push или вводить обязательный PR-flow?

## Decision

**Принимаем PR-only flow для всех проектов под управлением brain_matrica.**

1. **Никаких прямых push в `main` / `master` / default branch.** Любые изменения проходят через feature-ветку → PR → merge.
2. **Имя ветки — feature/префиксное:** `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`, `refactor/<slug>`. Slug — kebab-case, описательный.
3. **PR создаётся через `gh pr create`** с описанием (Summary + Test plan). Title — короткий, под 70 символов; детали — в body.
4. **Self-merge разрешён** — @valstan единственный коллаборатор; PR не требует ревьюера, но требует:
   - все CI checks зелёные (если CI настроен)
   - явное чтение diff'а перед merge (в Claude-сессии: `gh pr diff` + summary пользователю)
5. **Merge стратегия — по умолчанию `squash`** для коротких PR (1-3 коммита), `merge commit` для длинных линеек коммитов которые ценны в истории.
6. **Ветка удаляется после merge** (`gh pr merge --delete-branch`).
7. **Force-push в ветку — разрешён** (для rebase / amend перед merge). Force-push в `main` — **запрещён**.
8. **Hot-fix исключение** — продакшн упал, нужно зафиксить в течение часа? Допустим прямой push в main, **но с обязательным follow-up**: создать PR постфактум с описанием инцидента (для audit trail). Это редкий случай, не норма.

## Consequences

**Что даёт:**
- Audit trail: каждое изменение проходит через PR с описанием
- Точка контроля для AI-агентов: классификатор Claude Code блокирует push в main — мы превращаем баг в feature
- Возможность откатить серию изменений через `git revert <merge-commit>` атомарно
- Лучшая cross-проектная дисциплина: одно правило для всех 5+ проектов

**Что это стоит:**
- Каждое изменение требует ещё одного шага (PR создание + merge)
- Для tactical hot-fix'ов небольшое замедление (хотя §8 даёт лазейку для аварий)
- branch'и нужно периодически чистить (но `--delete-branch` при merge решает большинство)
- Если CI не настроен на проекте — теряем преимущество автопроверок (зелёные / красные просто не запускаются)

## Alternatives considered

- **A. Сохранить direct push** — отвергнут, см. Context (масштаб, AI-агенты, прод-зависимости).
- **B. PR-only только для main, force-push в main разрешён** — отвергнут, обнуляет audit trail.
- **C. PR + обязательный ревьюер** — пока отвергнут (@valstan один, ревьюер не доступен; вернёмся когда появится).
- **D. Branch protection rules на GitHub** — **рекомендуется как follow-up.** ADR фиксирует правило, branch protection на GitHub его enforce'ит технически. Применить когда настроим (отдельная задача).

## Реализация

- POSTULATES.md §VI — фиксирует правило кратко со ссылкой сюда
- Каждый проект получает письмо через mailbox с инструкцией: «больше никаких push в main, работаем через ветку + PR»
- brain_matrica сама применяет это правило начиная с этого commit'а (этот ADR — часть PR `feat/brain-mailboxes-and-pr-policy`, не direct push)

## Связанные

- [ADR-0001](0001-brain-projects-mailboxes.md) — schema коммуникации (через какой канал доводится эта директива до проектов)
- [POSTULATES.md](../docs/POSTULATES.md) §VI — короткая фиксация
