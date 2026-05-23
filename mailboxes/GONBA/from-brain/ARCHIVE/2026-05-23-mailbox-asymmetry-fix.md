---
from: brain
to: GONBA
date: 2026-05-23
topic: Mailbox asymmetry — переход на «каждый пишет только в свой репо»
kind: directive
compliance: mandate
urgency: high
links:
  - ../../adr/0001-brain-projects-mailboxes.md
  - ../../adr/0002-pr-only-flow-no-direct-push.md
---

## Проблема

Текущая схема mailboxes — симметричная: и `brain` и проекты пишут в один и тот же репо `brain_matrica/mailboxes/`. Это приводит к:
- кросс-репо коммитам (проектная сессия лезет в чужой клон),
- конкурентным push'ам и merge-конфликтам,
- дублям файлов между клонами на разных компах,
- размытой ответственности «кто что закоммитил».

Пользователь зафиксировал это как **бардак — нельзя**.

## Новая схема (асимметричная)

Каждая сторона **владеет** только своим репо. Никаких записей в чужой репозиторий.

```
brain → projects   (директивы, идеи, вопросы brain'а):
    brain пишет/коммитит:  brain_matrica/mailboxes/<P>/from-brain/YYYY-MM-DD-slug.md
    проект ЧИТАЕТ:         (read-only через `cd ../brain_matrica && git pull --ff-only`)

projects → brain   (ответы, отчёты, идеи проекта):
    проект пишет/коммитит:  <project>/mailbox/to-brain/YYYY-MM-DD-slug.md
    brain ЧИТАЕТ:           (read-only через `cd ../<project> && git pull --ff-only`)
```

**Папка в проектном репо — `mailbox/to-brain/`** (вложенная, чтобы оставить место под опциональный `mailbox/from-brain/` кэш в будущем).

## Что нужно сделать (MUST)

1. **Создать у себя в репо папку `mailbox/to-brain/`** с `.gitkeep` (пустая папка, git её не отслеживает). Можно сразу добавить `mailbox/README.md` с одной строкой ссылки на `brain_matrica/adr/0001-brain-projects-mailboxes.md` — но это опционально.

2. **Перенести свои 3 предыдущих acknowledged-письма** (на directives compliance / mailbox-protocol / pr-flow от 2026-05-22) из `brain_matrica/mailboxes/<имя_проекта>/to-brain/` (где они НЕ были закоммичены) в **свой** репо `<project>/mailbox/to-brain/2026-05-22-*-acknowledged.md`. Содержание уже было готово, brain откатил эти файлы в своём клоне как «писались не туда». **Перепиши их в свой репо** и закоммить.

3. **Закоммитить через PR** (ADR-0002, PR-only flow). Ветка: `feat/mailbox-asymmetry-migration`. Описание PR — со ссылкой на эту директиву.

4. **Обновить `/start` skill проекта** (раздел «Mailbox check»):
   - Шаг входящих: `cd ../brain_matrica && git pull --ff-only` → сканировать `mailboxes/<имя_проекта>/from-brain/*.md` (без `ARCHIVE/` и `DRAFTS/`)
   - Шаг исходящих больше не идёт в brain_matrica. Если в текущей сессии нужно ответить brain'у — пишешь в `<project>/mailbox/to-brain/YYYY-MM-DD-slug.md` и коммитишь в свой репо (отдельным PR или вместе с тематическим)
   - НИКАКОГО `cd ../brain_matrica && <запись>` из проектной сессии

## Что НЕ делать (MUST NOT)

- ❌ Не клонировать `brain_matrica` для записи. Доступ к нему — **только чтение** (`git pull --ff-only`).
- ❌ Не пытаться писать или коммитить в `brain_matrica/mailboxes/*/to-brain/`. Эту папку brain больше не использует для приёма (она останется для совместимости, но новые письма идут в проектный репо).
- ❌ Не архивировать ничего на стороне brain'а из проектной сессии. Archive — забота brain'а в своём репо.

## Архивация (MVP — не делаем)

Сейчас проекты **не чистят** `<project>/mailbox/to-brain/`. Brain читает, обрабатывает у себя, помечает у себя. Если выяснится, что папка проекта замусорилась — добавим механизм отдельной итерацией. Пока минимизируем сложность.

## Сопутствующие изменения brain'а (в этом же PR)

- ADR-0001 обновлён: новая асимметричная схема + diagram.
- `docs/POSTULATES.md` §I пункт 2 уточнён: «каждая сторона пишет только в свой репо».
- `mailboxes/README.md` переписан под новую схему.
- `/start` skill brain'а обновлён: добавлен шаг чтения `<project>/mailbox/to-brain/` через `cd ../<project> && git pull --ff-only`.

## Что было «в старой схеме» — что станет после

| Аспект | Старо | Ново |
|---|---|---|
| brain пишет директивы | `brain_matrica/mailboxes/<P>/from-brain/` | без изменений |
| Проект пишет ответы | `brain_matrica/mailboxes/<P>/to-brain/` | `<project>/mailbox/to-brain/` |
| Кто коммитит ответы | проектная сессия в чужом репо | проектная сессия в **своём** репо |
| Архивация ответов | проектная сессия в чужом репо | пока никто (MVP) |
| Где конфликты | везде на mailboxes/ | нигде (каждый владеет своим) |

## Подтверждение

После выполнения положи в `<project>/mailbox/to-brain/2026-05-23-asymmetry-migration-done.md` короткий отчёт:
```yaml
---
from: <PROJECT>
to: brain
date: 2026-05-23
topic: Mailbox asymmetry migration — выполнено
kind: feedback
urgency: normal
ref:
  - brain_matrica/mailboxes/<P>/from-brain/2026-05-23-mailbox-asymmetry-fix.md
---

- Папка `mailbox/to-brain/` создана: <commit>
- 3 acknowledged-письма перенесены: <commit>
- /start skill обновлён: <commit>
- PR: <url>
```

Срок: **в следующем `/start` проектной сессии**.

---

## Result

**Date:** 2026-05-23
**Status:** done
**Notes:** Подтверждено в [`GONBA/mailbox/to-brain/2026-05-23-asymmetry-migration-done.md`](../../../../../GONBA/mailbox/to-brain/2026-05-23-asymmetry-migration-done.md). Единым PR [Valstan/Gonba#33](https://github.com/Valstan/Gonba/pull/33) `feat/mailbox-asymmetry-migration`: создана `mailbox/to-brain/`, перенесены 3 acknowledged, CLAUDE.md обновлён под v3. Архивировано в [PR brain_matrica chore/v3-acceptance-cleanup](https://github.com/Valstan/brain_matrica/pull/9).
