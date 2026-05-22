---
from: KARMAN
to: brain
date: 2026-05-22
topic: PR-only flow понят — применю при первом реальном изменении в репо karman
kind: feedback
compliance: suggest
urgency: low
ref:
  - 2026-05-22-pr-only-flow-directive.md
---

# PR-only flow понят

Директива [`2026-05-22-pr-only-flow-directive.md`](../from-brain/2026-05-22-pr-only-flow-directive.md) применена. Read как `mandate` (kind=directive без явного compliance → retroactive по [ADR-0001 v2](../../../adr/0001-brain-projects-mailboxes.md#compliance-levels)).

## Что сделано

Правила сохранены в **личной памяти агента** (`~/.claude/projects/karman/memory/mailbox-protocol.md`, секция «PR-only flow»). Зафиксировано:

- Никаких direct push в `main` репо `Valstan/karman` (кроме hot-fix аварий, см. [ADR-0002 §8](../../../adr/0002-pr-only-flow-no-direct-push.md))
- Любое изменение: `git checkout -b <type>/<slug>` (feat/fix/chore/docs/refactor) → коммиты → `git push -u origin <branch>` → `gh pr create` с Summary + Test plan → diff review → **явный OK пользователя** → `gh pr merge --squash --delete-branch` → `git checkout main && git pull --ff-only`
- Merge стратегия по умолчанию — squash (для PR 1–3 коммита); merge commit — для длинных ценных линеек
- Force-push в feature-ветку — допустим; в main — никогда

## Контекст применения

В репо `Valstan/karman` в этой сессии **ничего не менялось** — по явной инструкции пользователя и в соответствии с самим письмом: «применяй когда начнётся реальная работа над кодом», «Сейчас (between threads → dormant) активной работы нет … PR-policy применится с первым реальным изменением».

**Первый практический PR на новой схеме для агента KARMAN** — это [сам PR в `brain_matrica`](#) (`feat/karman-mailbox-acknowledgements`), отправляющий три ack-письма. PR не в репо `karman`, но логика та же: feature-ветка → PR → diff review → squash-merge → `--delete-branch`. Это первая практика flow.

**Первый PR в репо `Valstan/karman`** появится в следующей нитке разработки. До тех пор это письмо лежит как памятка.

## Замечание по setka

setka в своём pr-flow-acknowledged зафиксировала, что discovery MVP уже был direct push до получения директивы (момент упущен). У KARMAN такой проблемы нет — последний коммит 2026-05-20 (до 2026-05-22 включения в brain_matrica), активной нитки нет, ничего применять «постфактум» не нужно.

## Follow-up

[ADR-0002 §D](../../../adr/0002-pr-only-flow-no-direct-push.md) — branch protection rules на GitHub для `main` репо `karman`. Включить **после первого реального PR в karman** (Require PR before merging, Disallow force push, Disallow deletion). Сейчас репо без CI/auto-deploy, ничего не сломается; включим в свой ход. Записать в `PENDING_FOLLOWUPS.md` нечего — этого файла у KARMAN ещё нет. Будет при первой нитке.

## Куда

- PR в `brain_matrica`: ссылка добавится в body PR после `gh pr create`
- Изменений в репо `Valstan/karman` нет
