# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-23 (Claude Opus 4.7 — асимметричная mailbox v3)
**Branch:** main

## Текущая нитка

**Mailbox v3 — асимметричная схема.** Сессия 2026-05-23 закрыла архитектурную проблему «проекты лезут в чужой репо и пишут в `brain_matrica/mailboxes/`» (кросс-репо коммиты → конфликты, дубли, размытая ответственность). [ADR-0001 v3](../adr/0001-brain-projects-mailboxes.md) формализует: **каждая сторона пишет/коммитит только в свой репо**. Brain пишет в `brain_matrica/mailboxes/<P>/from-brain/`, проект пишет в собственный `<project>/mailbox/to-brain/`. Чтение — через `git pull --ff-only` (read-only).

PR [#7](https://github.com/Valstan/brain_matrica/pull/7) merged. 4 директивы (compliance=mandate, urgency=high) разосланы во все проекты: GONBA / MatricaRMZ / setka / KARMAN. Ждём миграции в каждом.

## Следующий шаг

**В следующей meta-сессии — приёмка миграции v3 mailbox:**

1. `cd ../<P> && git pull --ff-only` для каждого из 4 проектов (read-only, как описано в обновлённом `/start` шаге 2.5).
2. Проверить наличие `<P>/mailbox/to-brain/2026-05-23-asymmetry-migration-done.md` (kind=feedback) от каждого проекта.
3. Если у проекта мигрировано — заархивировать старые 3 директивы 2026-05-22 (compliance / mailbox-protocol / pr-flow) в `mailboxes/<P>/from-brain/ARCHIVE/` со ссылкой на migration-done feedback. Закоммитить в brain_matrica через PR.
4. Если проект НЕ мигрировал — пинговать, kill-policy по таймауту (директива mandate просрочена).
5. После закрытия цикла во всех 4 — пометить `mailboxes/<P>/to-brain/` (старую папку в brain'е) как «v2 archive only» и зафиксировать в pool идею «v3 mailbox опыт перехода» если набралось интересного.

## Контекст

- **Главный коммит:** [`bc4770e`](https://github.com/Valstan/brain_matrica/commit/bc4770e) — v3 asymmetric scheme (522 insertions, 51 deletions)
- **Merge:** [`222e20c`](https://github.com/Valstan/brain_matrica/commit/222e20c) — PR #7 merged в main
- **Изменённые источники правды:** [ADR-0001](../adr/0001-brain-projects-mailboxes.md) (+v3), [POSTULATES §I.2](POSTULATES.md), [mailboxes/README.md](../mailboxes/README.md), [.claude/commands/start.md](../.claude/commands/start.md) (шаг 2.5)
- **4 директивы:** `mailboxes/<P>/from-brain/2026-05-23-mailbox-asymmetry-fix.md` × 4 (одинаковый текст, разный `to:`)
- **Pool:** без новых идей
- **Inbox:** пуст
- **Reset:** в начале сессии — `git restore --staged .` + удаление uncommitted ack-писем GONBA/KARMAN, что были «бардаком» от прежней симметричной схемы; полностью переделали через v3

## Открытые вопросы для пользователя

1. **Старая папка `mailboxes/<P>/to-brain/`** — оставляем deprecated read-only архивом, или удаляем после успешного migration во всех 4 проектах? Сейчас в ней могут остаться следы старых acknowledgements (зависит от того, что прислали проекты в свои сессии после v3 директивы). Решить когда будем закрывать цикл.
2. **`.last-seen`** в v3 обновляется brain'ом по фактическому состоянию sibling-репо — но конкретная формула («дата последнего коммита в `<P>/mailbox/to-brain/`» vs «дата последнего тега» vs «git log -1 sibling-репо целиком») в ADR-0001 не зафиксирована. Зафиксировать после первого реального reflection-прохода.
3. **Архивация ответов проектов** — MVP без неё. Решать когда накопится 10-20 файлов в `<P>/mailbox/to-brain/` у любого проекта.

## Не забыть (low-priority)

- **4 локальные feature-ветки без origin** на этом компе: `feat/gonba-acknowledgement`, `feat/karman-mailbox-acknowledgements`, `feat/matricarmz-acknowledgement`, `feat/setka-acknowledgement-and-archive` — реликты старой симметричной схемы, безопасно удалить (`git branch -D <name>`). Не сейчас, при следующей чистке.
- **Tech-radar** — стартовое наполнение (Drizzle, Payload, Celery, pnpm, Next.js 15, Groq) всё ещё не сделано. Когда будет свободная сессия.
- **Идея #004 «Минимализм AI-docs 2026»** — кандидат во все 4 проекта. Применять не одномоментно; раньше Q3 2026 — преждевременно.
- **Pool идей сейчас 5 (#001–#005)** — без изменений в этой сессии.
- **Старая `dispatch/` инфраструктура** (items/, briefings/, PROTOCOL.md) — полностью legacy после v3 mailbox. Кандидат на архивацию в `_archive/dispatch/` когда закроем приёмку миграции v3.
- **`/start` шаг 2.5** теперь делает read-only sync через `git pull --ff-only` 4 sibling-репо. Если какой-то проект не клонирован локально на компе — шаг пропустит его (есть `test -d ../$proj || continue`).
