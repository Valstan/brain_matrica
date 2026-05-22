# mailboxes/ — почтовая система brain ↔ projects (v3, асимметричная)

См. [ADR-0001](../adr/0001-brain-projects-mailboxes.md) и [POSTULATES](../docs/POSTULATES.md) §I.

## Главное правило (v3)

**Каждая сторона пишет/коммитит только в свой репо.** Кросс-репо записей нет — конфликты исключены.

```
brain → projects:
    brain пишет:    brain_matrica/mailboxes/<P>/from-brain/YYYY-MM-DD-slug.md
    проект ЧИТАЕТ:  cd ../brain_matrica && git pull --ff-only (read-only)

projects → brain:
    проект пишет:   <project>/mailbox/to-brain/YYYY-MM-DD-slug.md  (в своём репо)
    brain ЧИТАЕТ:   cd ../<project> && git pull --ff-only (read-only)
```

## Структура

### В этом репо (`brain_matrica/`)

```
mailboxes/
  <PROJECT>/
    .last-seen                   # ISO timestamp последней активности проекта (обновляет brain в reflection)
    from-brain/                  # brain owns. Brain пишет/коммитит.
      DRAFTS/                    # черновики brain, ждут утверждения пользователя
      YYYY-MM-DD-slug.md         # отправленные. Проект читает read-only.
      ARCHIVE/                   # прочитанные брайном — двигает brain после feedback от проекта
    to-brain/                    # DEPRECATED (v3). Не писать. Сохраняется как read-only архив старых ответов до v3.
```

### В каждом проектном репо

```
<project>/
  mailbox/
    to-brain/                    # project owns. Проект пишет/коммитит.
      YYYY-MM-DD-slug.md         # ответы / идеи / отчёты для brain'а. Brain читает read-only.
```

## Жизненный цикл письма brain → project

1. brain в meta-сессии готовит draft в `mailboxes/<P>/from-brain/DRAFTS/YYYY-MM-DD-slug.md`
2. Пользователь смотрит summary, утверждает (или правит)
3. brain переносит draft в `mailboxes/<P>/from-brain/YYYY-MM-DD-slug.md`, коммит **в brain_matrica** (через PR — ADR-0002)
4. Проектная сессия в `/start` делает `cd ../brain_matrica && git pull --ff-only`, видит письмо, обрабатывает
5. Проектная сессия пишет feedback в **свой** `<project>/mailbox/to-brain/YYYY-MM-DD-<slug>-<result>.md`, коммит **в свой репо** (через PR)
6. brain в следующей meta-сессии делает `cd ../<project> && git pull --ff-only`, читает feedback, двигает оригинал в `mailboxes/<P>/from-brain/ARCHIVE/`, дописывает `## Result`, коммит **в brain_matrica**

## Жизненный цикл письма project → brain (инициирован проектом)

1. Проектная сессия пишет файл в **свой** `<project>/mailbox/to-brain/YYYY-MM-DD-slug.md`, коммит в свой репо
2. brain в следующей meta-сессии делает read-only sync sibling-репо, видит письмо, докладывает пользователю
3. brain обрабатывает у себя (форвардит другим проектам через `mailboxes/<P>/from-brain/`, добавляет в pool идей, делает ADR, и т.д.)
4. Архивация на стороне проекта — **не делается** (MVP). Если папка проекта замусорится — добавим механизм отдельной итерацией.

## Frontmatter писем

```yaml
---
from: brain | <PROJECT>
to: <PROJECT> | brain
date: YYYY-MM-DD
topic: short subject line
kind: idea | directive | question | feedback | report
compliance: suggest | recommend | mandate   # required для kind=idea и kind=directive
urgency: low | normal | high
links: [...]      # опционально
ref: [...]        # опционально, если ответ на другое письмо
---
```

`kind` (что это):
- **idea** — предложение, рассмотри
- **directive** — указание выполнить
- **question** — ответь когда сможешь
- **feedback** — результат / что вышло
- **report** — статус, ответа не требует

`urgency` (когда читать):
- **low / normal** — обычная очередь
- **high** → проект обязательно поднимает в начале /start, даже если одно

`compliance` (насколько обязательно — RFC 2119 mapping):

| Уровень | RFC 2119 | Реакция получателя |
|---|---|---|
| **suggest** | MAY | Подумай. Можно молча отложить или применить. |
| **recommend** | SHOULD | Применить с адаптацией. Отказ — обосновать в обратный mailbox. |
| **mandate** | MUST | Безусловно применить. Отказ только если технический блокер — эскалация. |

Поле **required** для kind=idea и kind=directive (там где есть действие).
Поле **не нужно** для kind=question/feedback/report.

**Retroactive:** старые письма без compliance (до 2026-05-22 v2) читаются как:
- kind=directive → mandate
- kind=idea → recommend

В /start доклад проекта должен показывать compliance вместе с urgency:
```
📬 N писем от brain_matrica:
- [high MUST] YYYY-MM-DD-slug.md — short topic
- [normal SHOULD] ...
- [low MAY] ...
```

## `.last-seen`

Один файл на проект в `mailboxes/<P>/.last-seen`, ISO timestamp:
```
2026-05-22T14:30:00+03:00
```
**Обновляется brain'ом** (v3) в reflection-проходе. Например, по дате последнего коммита в `<project>/mailbox/to-brain/` или по `git log -1 --format=%cI` sibling-репо. Используется в kill-policy.

## Legacy: старая `to-brain/` в brain_matrica

До v3 (до 2026-05-23) проекты писали в `brain_matrica/mailboxes/<P>/to-brain/`. С v3 эта папка **deprecated**:
- Не писать новых файлов
- Существующие файлы (если есть) остаются как read-only архив
- Все ответы проектов теперь — в `<project>/mailbox/to-brain/` в проектном репо

## Что НЕ кладём в mailbox

- Tactical баги проекта (это в `<P>/docs/PENDING_FOLLOWUPS.md` самого проекта)
- Большие планы (это `docs/plans/` brain'а, в письме только ссылка)
- Personal-memory вещи (это `~/.claude/projects/<slug>/memory/`)
- Дубли pool-идей (письмо может ссылаться на pool, но не дублировать содержимое)
