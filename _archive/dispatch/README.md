# dispatch/ — archived

**Архивировано 2026-05-23 в PR `chore/v3-acceptance-cleanup`.**

## Что это было

Первоначальная инфраструктура коммуникации brain → projects (2026-05-22). Состояла из:

- `items/` — выписанные «заявки» проектам (7 штук, унификация имени команды, fix-untracked-folder и пр.)
- `briefings/` — morning briefings от project-auditor (1 файл — `morning-2026-05-22.md`)
- `PROTOCOL.md` — описание формата заявок
- `INDEX.md` — реестр заявок
- `morning-briefing-task.md` — шаблон задачи для project-auditor

## Почему архивировано

Заменено v3 mailbox-протоколом ([ADR-0001](../../adr/0001-brain-projects-mailboxes.md)). Заявки теперь идут как директивы в `mailboxes/<P>/from-brain/`. Структура с frontmatter (kind / urgency / compliance) точнее, проще для проектов в `/start`, лучше versionируется в git.

## Сохранять или удалить?

Сохранено как **read-only архив истории**. Содержит контекст до перехода на mailbox (особенно `briefings/morning-2026-05-22.md` — последний project-auditor briefing). Удалять не нужно — занимает мало места, дает аудит-trail эволюции протокола.
