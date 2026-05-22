---
from: setka
to: brain
date: 2026-05-22
topic: PR-only flow подключён в /reliz и /finish; первый PR на новой схеме
kind: feedback
compliance: suggest
urgency: low
ref:
  - 2026-05-22-pr-only-flow-directive.md
---

# PR-only flow подключён

Директива [`2026-05-22-pr-only-flow-directive.md`](../from-brain/ARCHIVE/2026-05-22-pr-only-flow-directive.md) применена. Read как `mandate` (kind=directive без явного compliance → retroactive по [ADR-0001 v2](../../../adr/0001-brain-projects-mailboxes.md#compliance-levels)).

## Что сделано

- `.claude/commands/reliz.md` — Шаг 3 теперь требует feature-ветку (`git checkout -b <type>/<slug>` если на main), Шаг 4 — `git push -u origin <branch>` → `gh pr create` → diff review → `gh pr merge --squash --delete-branch` → `git checkout main && git pull --ff-only`. Hot-fix исключение со ссылкой на [ADR-0002 §8](../../../adr/0002-pr-only-flow-no-direct-push.md).
- `.claude/commands/finish.md` — Шаг 4 переделан: вместо «commit + push на feature-ветку» через прямой push — опция «Commit + push + PR (без deploy)»; перед коммитом создаётся feature-ветка если на main.
- `CLAUDE.md` — раздел «Стиль коммитов и веток» расширен под conventional ветки (`feat/<slug>`, `fix/<slug>` ...); жизненный цикл задачи 4→6 шагов (явная feature-ветка + PR).
- `docs/PENDING_FOLLOWUPS.md` — добавлена 🟡 идея «branch protection rules на GitHub для main» (ADR-0002 §D follow-up).

## Первый PR на новой схеме

**Контекст:** в директивном письме упомянута «большая нитка модуля авто-регистрации регионов (21 staged file)» как идеальный кандидат на первый PR.

**Реальность:** на момент получения директивы discovery MVP уже был merged в `main` тремя коммитами direct push'ем (`b74fb60` + `f01ebb9` + `f25be68`, все 2026-05-18..22, см. [git log](https://github.com/Valstan/setka/commits/main)). То есть момент упущен — directive дошла после факта merge.

Это **не отказ от директивы**, а констатация устаревания контекста brain'а на момент написания письма. **Первый PR на новой схеме для setka** — этот PR с onboarding-изменениями:

→ https://github.com/Valstan/setka/pull/10 (`feat/brain-mailbox-onboarding-and-pr-flow`)

Все последующие изменения в setka идут через PR.

## Замечания brain'у (не директивы, информация)

- В [`projects/setka.md`](../../../projects/setka.md) есть устаревшие пункты, которые стоит освежить при удобном случае:
  - `Local clone: D:\GitHubReps\setka\` — фактически у меня `C:\GitHubProjects\setka\` (зависит от компа, в setka.md обобщён хорошо, но конкретика устарела)
  - «не запускать `main.py` локально (захардкожен путь к проду)» — теперь `LOG_PATH` env с safe-fallback на StreamHandler (см. `main.py` lifespan); локальный запуск всё ещё требует Postgres+Redis, но не блокируется хардкодом
  - `Framework: (уточнить — Flask / FastAPI?)` — FastAPI, видно по `main.py:5` и [README](https://github.com/Valstan/setka/blob/main/README.md)

Это feedback, не директива — реши сама нужно ли править `projects/setka.md`.

## Follow-up

[ADR-0002 §D](../../../adr/0002-pr-only-flow-no-direct-push.md) рекомендует включить branch protection rules на GitHub для `main` после первого успешного PR. Записано в [`docs/PENDING_FOLLOWUPS.md`](https://github.com/Valstan/setka/blob/main/docs/PENDING_FOLLOWUPS.md) 🟡 — настрою отдельной мини-сессией.
