---
description: Ознакомься с состоянием brain_matrica и начни новую meta-сессию управления проектами
---

Начало новой meta-сессии в `brain_matrica`. Это **не** работа с кодом — это управление поверх отдельных проектов. Цель — собрать актуальное состояние и доложить пользователю, **ничего не меняя**.

## 0. Подхватить нитку из прошлой meta-сессии

1. Прочитай `docs/SESSION_HANDOFF.md`.
2. Если `Status: ACTIVE` и `Updated:` не старше 14 дней:
   - В верху отчёта выдели **🧵 Прошлая meta-сессия оставила нитку**: «Текущая нитка» + «Следующий шаг».
   - Если упомянут план в `docs/plans/` — прочитай его.
   - Финальный вопрос пользователю: **«Продолжаем нитку?»**
3. Если `Status: ACTIVE` и `Updated:` старше 14 дней — отметь «handoff устарел, может быть не актуален».
4. Если `Status: IDLE` — пропусти, переходи дальше.

## 1. Документация brain_matrica

1. Прочитай `CLAUDE.md` — правила работы meta-репо.
2. Прочитай `projects/INDEX.md` — реестр всех проектов под управлением.
3. Прочитай `cross-project-ideas/INDEX.md` — pool с легендой статусов.
4. Прочитай `tech-radar/INDEX.md` — какие технологии в эксплуатации, на радаре, отвергнуты.
5. Прочитай `adr/INDEX.md` — Cross-project Architecture Decision Records.
6. Прочитай `inbox/INDEX.md` — если есть необработанные сырые идеи.

## 2. Синхронизация с GitHub

1. `git fetch --all --tags`.
2. `git status` — есть ли незакоммиченное.
3. `git log --oneline HEAD..origin/main | head -10` — что не подтянуто.
4. Если working tree чистый и отстаёт от origin — `git pull --ff-only`.

## 2.5. Read-only sync sibling-репо + сканирование <project>/mailbox/to-brain/ (v3 mailbox)

По ADR-0001 v3 ответы проектов лежат в их собственных репо (`<project>/mailbox/to-brain/`). brain читает их **read-only**, никаких записей в чужой репо.

```bash
for proj in MatricaRMZ GONBA setka KARMAN; do
  test -d "../$proj" || continue
  (cd "../$proj" && git pull --ff-only 2>&1 | tail -1)
done
```

Для каждого проекта проверь `../$proj/mailbox/to-brain/*.md` (без `ARCHIVE/`):
1. Если есть новые письма (по дате `git log` или по списку файлов) — прочти, добавь в отчёт пользователю.
2. **Не модифицируй** ничего в sibling-репо — только чтение.
3. Если в `mailbox/to-brain/` пусто или папки не существует — отметь это как `проект ещё не мигрировал на v3 mailbox` (см. ADR-0001 v3).

### `.last-seen` (новое в v3.1)

Для каждого проекта определи timestamp последнего проектного коммита в `mailbox/to-brain/`:

```bash
cd ../$proj && git log -1 --format=%cI -- mailbox/to-brain/
```

Сравни с `mailboxes/$proj/.last-seen` (если есть). Если новее — обнови файл (одна строка ISO timestamp, без trailing newline). Изменения `.last-seen` коммитятся вместе с обработкой новых писем тем же PR.

Обработка писем (форвард в pool, ack-письма в `mailboxes/<P>/from-brain/`, архивация в `from-brain/ARCHIVE/`, обновление `.last-seen`) — делается в **brain_matrica** через PR (ADR-0002).

## 2.6. Auto-archive ack'нутых писем (consensus-safe)

После сканирования `<P>/mailbox/to-brain/` — для **каждого** прочитанного ack-письма попытайся найти соответствующий оригинал в `mailboxes/<P>/from-brain/` (не в `ARCHIVE/`) и подвинуть его в `ARCHIVE/` с заполнением секции `## Result`.

### Логика matching

Сначала по `ref:` в frontmatter ack-письма (наивысший приоритет):

```yaml
---
from: <PROJECT>
to: brain
kind: feedback
ref:
  - 2026-05-23-isolate-ssh-deploy-key   # slug оригинала без .md
---
```

Если `ref:` есть и указывает на файл в `mailboxes/<P>/from-brain/` (не ARCHIVE) — это однозначный match.

Если `ref:` отсутствует — fallback по slug в имени файла:
- ack-письмо `2026-05-25-pr-flow-acknowledged.md` → ищу `*-pr-flow-*.md` (по slug-середине) в `from-brain/`
- ack-письмо `2026-05-25-ssh-deploy-key-isolated.md` → ищу `*-ssh-deploy-key-*.md`

Логика fuzzy-match: вырежи дату (`YYYY-MM-DD-`) и `-acknowledged.md` / `-done.md` / `-applied.md` / `-isolated.md` суффикс — получишь slug-core. Сматчи с slug-core оригинала.

### Когда **не** двигать (conservative defaults)

- **0 матчей** в `from-brain/` — пропусти, доложи пользователю «не нашёл оригинал для ack-письма X» (может быть письмо от проекта по своей инициативе, не ответ).
- **≥2 матча** — пропусти, доложи «неоднозначный match», пусть пользователь решит вручную.
- **`ref:` указывает на несуществующий файл** — пропусти, доложи «битый ref в ack-письме X».
- **Оригинал уже в `ARCHIVE/`** — ничего не делай, всё уже архивировано (повторный ack).

### Что записать в Result

Дописать в конец оригинала **перед** перемещением:

```markdown
---

## Result

**Date:** YYYY-MM-DD (дата ack-письма)
**Status:** acknowledged | done | partially-done | rejected   ← из ack-письма kind / контента
**Notes:** <1-2 строки выжимки из ack-письма>
**Acknowledgement:** [`<P>/mailbox/to-brain/<ack-file>.md`](../../<P>/mailbox/to-brain/<ack-file>.md)
```

Затем `git mv` оригинал в `from-brain/ARCHIVE/`.

### Важно

- **Только перемещение, не удаление.** `git mv`, не `rm`.
- **Никогда не пишу в проектный репо.** Ack-письмо остаётся в `<P>/mailbox/to-brain/` как было (по v3.1 asymmetry).
- **Все изменения коммитятся одним PR с обработкой почты этой meta-сессии.**

## 3. Снапшоты проектов (опционально)

Если в этой meta-сессии планируется работа с конкретными проектами — сходи в их репо (read-only):
- `(cd ../<project> && git log --oneline -5 && git tag --sort=-v:refname | head -1)` — что нового
- Прочитай их `docs/SESSION_HANDOFF.md` — что у них в работе сейчас

Не делай это для **всех** проектов всегда — только если ясно что обсуждение будет про них. По умолчанию — реестр в `projects/<name>.md` достаточен.

## 4. Отчёт пользователю

Краткий отчёт (8-12 строк), на русском:
- 🧵 нитка из handoff (если есть)
- Состояние brain_matrica (push/pull статус, есть ли inbox для разбора)
- Проекты под управлением (1 строка на каждый: статус + последняя версия)
- Свежие идеи в pool (за последний месяц)
- Если есть pending в inbox — упомянуть число

Закончи **подходящим под контекст** вопросом:
- Если нитка ACTIVE → «Продолжаем?»
- Если IDLE → «Что обсудим? Идеи / реестр / tech-radar / inbox / новая стратегия?»

## Что НЕ делать в brain_matrica

- Не лезть в код конкретных проектов из этой сессии — открой соответствующий проект отдельно
- Не делать commit/push в код-проекты отсюда — это meta-репо, оно про метаданные
- Не дублировать DEVELOPMENT_LOG / PENDING_FOLLOWUPS из проектов — здесь стратегия, не история их разработки
- Не запускать прод-команды, билды, тесты — нечего здесь запускать
