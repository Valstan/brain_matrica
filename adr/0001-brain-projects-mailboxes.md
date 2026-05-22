# ADR 0001: brain ↔ projects communication via mailboxes

**Date:** 2026-05-22 (v1), 2026-05-22 (v2 — compliance field), 2026-05-23 (v3 — асимметричная схема), 2026-05-23 (v3.1 — `.last-seen` формула + удалена deprecated `to-brain/` brain-side)
**Status:** Accepted
**Applies to:** brain_matrica, MatricaRMZ, GONBA, setka, KARMAN (и все будущие проекты под управлением)

## Changelog

- **v3.1 (2026-05-23):** Зафиксирована формула `.last-seen` (см. [`.last-seen` semantics](#last-seen-semantics)). Удалена deprecated папка `brain_matrica/mailboxes/<P>/to-brain/` — пользовательское решение «удалить» после приёмки v3-миграции во всех 4 проектах. Архивирована старая `dispatch/` инфраструктура → `_archive/dispatch/`.
- **v3 (2026-05-23):** схема стала **асимметричной**. brain пишет только в свой репо (`brain_matrica/mailboxes/<P>/from-brain/`); проекты пишут только в свой репо (`<project>/mailbox/to-brain/`). Каждая сторона **владеет** только своими файлами — кросс-репо коммитов нет, конфликты исключены. См. [Asymmetric scheme](#asymmetric-scheme).
- **v2 (2026-05-22):** добавлено поле frontmatter `compliance` (suggest / recommend / mandate) для писем с действиями (kind=idea, kind=directive). Описание реакции проекта в зависимости от уровня. См. секцию [Compliance levels](#compliance-levels) ниже.
- **v1 (2026-05-22):** первоначальный протокол mailbox + DRAFTS/ARCHIVE + kind/urgency.

## Context

brain_matrica — meta-репо стратегического управления проектами. Возникла дилемма: как brain должна общаться с управляемыми проектами?

Варианты, которые рассматривались:

- **A. Прямое редактирование файлов проектов из сессии brain.** Минусы: размывает роль (brain становится «ещё одним разработчиком»), нарушает атомарность работы внутри проекта, конфликтует с одновременной работой в проектной сессии.
- **B. Просто читать проекты read-only и держать всю стратегию внутри brain.** Минусы: проект не узнаёт об идеях / директивах brain'а пока разработчик вручную их не перенесёт.
- **C. Async-обмен через файловые «почтовые ящики».** brain пишет, проект забирает в /start, отвечает в обратный ящик.

Цели:
1. **Read-only обход проектов** — brain не лезет в код, только смотрит метаданные / docs / git log
2. **Async коммуникация** — проект не блокируется brain'ом, работает в своём темпе
3. **Audit trail** — вся история обмена идеями версионируется в git
4. **Hub-роль brain** — все идеи проходят через куратора, нет peer-to-peer писем между проектами
5. **Подтягивание уровня** — идея, отработавшая в одном проекте, автоматически попадает в почту остальных

## Decision

Принимаем вариант **C** в **асимметричной** реализации (v3).

### Asymmetric scheme

**Главное правило:** каждая сторона пишет/коммитит только в свой репо. Кросс-репо записей нет.

```
brain → projects   (директивы, идеи, вопросы brain'а):
    brain пишет:    brain_matrica/mailboxes/<P>/from-brain/YYYY-MM-DD-slug.md
    brain коммитит: в brain_matrica
    проект ЧИТАЕТ:  read-only через `cd ../brain_matrica && git pull --ff-only`

projects → brain   (ответы, отчёты, идеи проекта):
    проект пишет:    <project>/mailbox/to-brain/YYYY-MM-DD-slug.md
    проект коммитит: в свой репо
    brain ЧИТАЕТ:    read-only через `cd ../<project> && git pull --ff-only`
```

### Структура (v3)

В brain_matrica:
```
mailboxes/<PROJECT>/
  .last-seen                   # ISO timestamp последнего проектного коммита в mailbox/to-brain/.
                               # Обновляется brain'ом в reflection-проходе. См. .last-seen semantics ниже.
  from-brain/                  # brain owns. Пишет/коммитит brain.
    DRAFTS/                    # черновики brain, ждут утверждения пользователя
    YYYY-MM-DD-slug.md         # отправленные. Проект читает read-only.
    ARCHIVE/                   # прочитанные брайном — двигает brain после обработки feedback от проекта
```

В каждом проектном репо:
```
<project>/
  mailbox/
    to-brain/                  # project owns. Пишет/коммитит проект.
      YYYY-MM-DD-slug.md       # ответы / идеи / отчёты для brain'а. Brain читает read-only.
```

### `.last-seen` semantics

**Файл:** `mailboxes/<P>/.last-seen` в brain_matrica.

**Содержимое:** ISO 8601 timestamp последнего коммита sibling-репо `<P>`, затронувшего папку `<P>/mailbox/to-brain/`. Одна строка, без trailing newline.

**Формула:**
```bash
cd ../<P> && git log -1 --format=%cI -- mailbox/to-brain/ > /dev/null
```

**Когда обновляется:** brain в своём reflection-проходе (обычно `/start` шаг 2.5 после `git pull --ff-only` sibling-репо) сравнивает текущий результат формулы с содержимым `.last-seen`. Если новее — обновляет файл и коммитит вместе с обработкой новых писем.

**Что значит:** «когда проект последний раз положил/коммитнул что-то в свой `mailbox/to-brain/`». **Не** «когда brain последний раз прочитал» (это derivable из git log самого `mailboxes/<P>/.last-seen`).

**Почему так:** напрямую отражает почтовую активность проекта, не зависит от общей активности репо (rolling-проекты без релизов вроде GONBA не дают полезного сигнала через `git describe --tags` или `git log -1 HEAD`). Если в `mailbox/to-brain/` ещё ни одного коммита не было — `.last-seen` пустой / отсутствует.

**Архивация ответов проектов (MVP):** не делается. Проекты пишут в свой `mailbox/to-brain/`, brain читает, обрабатывает у себя. Если папка проекта замусорится — добавим механизм отдельной итерацией.

### Формат письма (frontmatter)

```yaml
---
from: brain | <PROJECT>
to: <PROJECT> | brain
date: YYYY-MM-DD
topic: short subject line
kind: idea | directive | question | feedback | report
compliance: suggest | recommend | mandate   # required для kind=idea и kind=directive
urgency: low | normal | high
links: [...]      # опционально: ссылки на ideas / inbox / adr / per-project docs
ref: [...]        # опционально: имена файлов писем на которые отвечаем
---
```

`kind` (что это):
- **idea** — предложение, рассмотри
- **directive** — указание выполнить
- **question** — ответь когда сможешь
- **feedback** — вот результат / что вышло / что не зашло
- **report** — статус, ответа не требует

`urgency` (когда обратить внимание):
- **low** — без срочности
- **normal** — обычная очередь
- **high** — обязательно поднять в /start даже если письмо одно

См. [Compliance levels](#compliance-levels) ниже.

### Compliance levels

Это **отдельная ось** от `kind` и `urgency`: насколько обязательно выполнение. Соответствует RFC 2119 (MAY/SHOULD/MUST). Три уровня:

| compliance | RFC 2119 | Реакция получателя |
|---|---|---|
| **suggest** | MAY | «Подумай, может пригодится.» Получатель свободен применить, отложить или молча проигнорировать. Если решил — приветствуется feedback в обратном направлении, но не обязателен. |
| **recommend** | SHOULD | «Применить, адаптировать под проект. Если не подходит — аргументировать.» Получатель **обязан обработать**: либо применить (возможно с адаптацией), либо написать обоснование отказа в обратный mailbox. Молча игнорировать нельзя. |
| **mandate** | MUST | «Безусловное выполнение.» Получатель **обязан применить**. Если технически невозможно — эскалация в обратный mailbox с указанием конкретного блокера (kind=feedback, urgency=high). Применение должно произойти, отказ — только в случае реального технического барьера. |

**Required для:** `kind: idea` и `kind: directive` (где есть что выполнять).
**Не нужно для:** `kind: question`, `kind: feedback`, `kind: report` (там нет действия).

**Retroactive правило** для писем без поля `compliance` (отправленные до v2 этого ADR):
- `kind: directive` без compliance → читать как `mandate`
- `kind: idea` без compliance → читать как `recommend`

### Adaptation в recommend-режиме

«Адаптация под проект» в recommend означает:
- Применить **идею целиком**, но реализация может отличаться от описания
- Например, идея «изолированный SSH deploy-key» — реализация может быть `id_ed25519_<proj>_deploy` или `id_ed25519_<env>_<proj>_deploy` или через ssh-agent forwarding — конкретика на усмотрение проекта
- Если адаптация настолько глубока что «теряет суть идеи» — это уже отказ, нужно аргументировать

Аргументация отказа в recommend = файл `to-brain/YYYY-MM-DD-rejected-<slug>.md`:
```yaml
---
from: <PROJECT>
to: brain
date: YYYY-MM-DD
topic: Отказ от <slug>
kind: feedback
compliance: suggest    # отказ — не директива, brain свободен переоткрыть тему
urgency: normal
ref: [<original-letter>]
---

# Почему не применили
... 2-3 предложения почему. Не философия — конкретный технический / контекстный блокер.
```

### Правила

1. **brain ↔ projects только через mailbox.** Прямое редактирование файлов проекта из сессии brain запрещено (за исключением `projects/<P>.md` — это файл реестра brain'а, не файл проекта).
2. **Каждая сторона пишет/коммитит только в свой репо (v3).** brain — в `brain_matrica/mailboxes/<P>/from-brain/`. Проект — в `<project>/mailbox/to-brain/`. Никаких кросс-репо записей.
3. **Peer-to-peer запрещён.** Если MatricaRMZ хочет что-то передать setka — пишет в свой `mailbox/to-brain/`, brain читает и решает форвардить ли (созданием нового письма в `mailboxes/setka/from-brain/`).
4. **Каждый `/start` проекта** делает read-only sync brain'а (`cd ../brain_matrica && git pull --ff-only`), сканит `mailboxes/<self>/from-brain/*.md` (не DRAFTS, не ARCHIVE). При наличии писем — доклад до начала обычного workflow. `high-urgency` всегда поднимается в /start.
5. **После обработки письма** проект пишет feedback в свой `mailbox/to-brain/YYYY-MM-DD-<slug>-<result>.md`. **brain** в своей следующей meta-сессии читает feedback и двигает оригинальное письмо из `from-brain/` в `from-brain/ARCHIVE/`, дописывая `## Result` (со ссылкой на feedback-письмо). Архивирование на стороне brain'а — забота brain'а, не проекта.
6. **`.last-seen`** обновляется brain'ом по формуле `git log -1 --format=%cI -- mailbox/to-brain/` в sibling-репо (см. [`.last-seen` semantics](#last-seen-semantics)). Проект не пишет в brain_matrica.
7. **Гибрид-workflow для писем brain → project.** brain готовит draft в `DRAFTS/`, показывает пользователю summary, пользователь утверждает → brain переносит в `from-brain/`.
8. **ARCHIVE никогда не удаляется.** Это история обмена; чистка только через явное архивирование старых писем в `_old/` (раз в год если разрастётся).
9. **Большие планы — в `docs/plans/` brain'а.** В письме только ссылка. Mailbox для пинков и идей, не для документов.

### Что больше нельзя делать (v3 — MUST NOT)

- Проектная сессия больше **не клонирует** brain_matrica для записи. Только read-only `git pull --ff-only`.
- Проектная сессия больше **не коммитит** в `brain_matrica/mailboxes/`. Все ответы — в свой репо.
- Brain в meta-сессии больше **не коммитит** в чужие репо. Чтение sibling-репо — только `git pull --ff-only` + read.
- Папка `brain_matrica/mailboxes/<P>/to-brain/` **удалена** (v3.1, 2026-05-23). Любые ссылки на неё в документации — legacy.

## Consequences

**Что даёт:**
- Чёткое разделение ролей: brain = куратор-хаб, проекты = автономные исполнители
- Полный audit trail в git: видно когда что предложено, когда прочитано, какой результат
- Проекты подтягиваются друг за другом: успешная идея форвардится в почту остальных
- brain может масштабироваться: добавление 5-го, 6-го проекта не меняет протокол
- Снимается риск конфликта с одновременной проектной сессией
- (v3) **Нет кросс-репо коммитов** — конфликты на mailboxes/ исключены, каждая сторона владеет своими файлами

**Что это стоит:**
- Дополнительный шаг для пользователя: утверждение драфтов перед отправкой
- Лишние файлы в репо (письма + ARCHIVE) — но это feature, не bug
- Требует дисциплины: проект должен честно проверять почту в /start (риск игнорирования если skill `/start` не обновлён)
- `.last-seen` зависит от reflection-прохода brain'а (v3)
- (v3) Brain зависит от read-only sync sibling-репо — если проект не пушит свой `mailbox/to-brain/` в origin, brain их не увидит. Решение: проект коммитит и пушит ответы как обычный PR (ADR-0002)

## Alternatives considered

- **A. Прямое редактирование** — отвергнут (размывает роль brain'а, конфликтует с проектными сессиями).
- **B. Чисто read-only без обратной коммуникации** — отвергнут (теряется циркуляция идей между проектами).
- **D. Single shared queue** (один общий файл-лента вместо per-project mailbox) — отвергнут (теряется адресность, шум, сложнее ARCHIVE).
- **E. Peer-to-peer letters** — отвергнут (размывает hub-роль brain'а, идеи могут расходиться без курации).
- **F. Симметричная mailbox (v1/v2)** — обе стороны пишут в `brain_matrica/mailboxes/` — отвергнут в v3 (2026-05-23): кросс-репо коммиты приводят к конфликтам, дублям между клонами, размытой ответственности. Заменён асимметричной схемой.

## Связанные постулаты

- [POSTULATES.md](../docs/POSTULATES.md) — фиксирует операционные принципы, вытекающие из этого ADR.
