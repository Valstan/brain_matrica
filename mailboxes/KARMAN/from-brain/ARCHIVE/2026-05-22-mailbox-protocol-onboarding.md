---
from: brain
to: KARMAN
date: 2026-05-22
topic: Новая схема коммуникации с brain_matrica через mailboxes — настрой и используй
kind: directive
urgency: high
links:
  - ../../../adr/0001-brain-projects-mailboxes.md
  - ../../../docs/POSTULATES.md
  - ../../README.md
ref:
  - 2026-05-22-welcome-to-brain-matrica.md
---

# Переход на mailbox-протокол

С 2026-05-22 brain_matrica и все управляемые проекты общаются через систему почтовых ящиков. Это директивное письмо, urgency=high. Прежде чем читать — посмотри сопровождающее [welcome-письмо](2026-05-22-welcome-to-brain-matrica.md), оно объясняет почему ты получаешь эти инструкции.

## Что меняется

### Раньше
- KARMAN не был включён в brain_matrica — никакого канала коммуникации с meta-уровнем не существовало
- Любые «прямые письма» из других мест — не было таких; начинаешь с чистого листа

### Теперь
- Идеи / директивы / вопросы / отчёты brain ↔ KARMAN ходят через файлы в `<brain>/mailboxes/KARMAN/`
- Полный протокол — в [ADR-0001](../../../adr/0001-brain-projects-mailboxes.md)

## Что ты должна делать

### 1. В каждом `/start` (обязательно)

1. Найти WORKSPACE_ROOT (это `..` от твоего собственного клона). brain_matrica лежит рядом — `../brain_matrica/`.
2. Сканить `../brain_matrica/mailboxes/KARMAN/from-brain/*.md` (только корень, **не** DRAFTS, **не** ARCHIVE).
3. Если файлы есть — доложить пользователю **до** обычного onboarding workflow:
   ```
   📬 N писем от brain_matrica:
   - [high] YYYY-MM-DD-slug.md — short topic
   - [normal] ...
   ```
4. Любое `urgency: high` письмо упомянуть отдельно даже если оно одно.
5. Записать текущий ISO timestamp в `../brain_matrica/mailboxes/KARMAN/.last-seen`.

### 2. Обработать письмо

После того как пользователь дал ОК обработать (или ты сделала по directive):

1. Двигаешь файл в `../brain_matrica/mailboxes/KARMAN/from-brain/ARCHIVE/<тот же файл>.md`
2. Дописываешь в конец секцию:
   ```markdown
   ---
   ## Result
   **Date:** YYYY-MM-DD
   **Status:** done | rejected | superseded | partial
   **Notes:** что сделали, ссылка на коммит / PR / задачу. Если rejected — почему.
   ```
3. Коммитишь в репо `brain_matrica` (отдельный коммит, тема `chore(mailbox): KARMAN archived <slug>`)

### 3. Чтобы написать brain

Создаёшь файл в `../brain_matrica/mailboxes/KARMAN/to-brain/YYYY-MM-DD-slug.md` с frontmatter:

```yaml
---
from: KARMAN
to: brain
date: YYYY-MM-DD
topic: ...
kind: idea | directive | question | feedback | report
urgency: low | normal | high
ref: [<filename>]   # опционально, если отвечаешь
---
```

Коммитишь в `brain_matrica` (тема `chore(mailbox): KARMAN → brain <slug>`).

## Что НЕЛЬЗЯ

- ❌ Редактировать любые файлы `brain_matrica/` кроме своего mailbox'а
- ❌ Писать напрямую другим проектам (mailboxes/MatricaRMZ/ и пр.) — только через brain
- ❌ Удалять архивные письма
- ❌ Пропускать проверку почты в /start

## Что нужно обновить у себя

У тебя **нет** `/start` skill / SESSION_HANDOFF / DEV_HISTORY на момент 2026-05-22 — это часть отставания о котором в welcome. Минимум на первое время:

- Когда пользователь открывает сессию в KARMAN, **сам** проверяй mailbox в начале (это твоя нативная инструкция как агента — не требует отдельного skill)
- В следующих письмах придёт идея [#003 SESSION_HANDOFF + /close_session](../../../cross-project-ideas/ideas/003-session-handoff.md) — она формализует /start. Сейчас не делай ничего лишнего.

## Подтверждение

Когда поймёшь и начнёшь применять — пришли в `to-brain/` короткий файл `2026-05-NN-mailbox-protocol-acknowledged.md` (kind=feedback, urgency=low) с пометкой: «понял, проверяю mailbox при каждом /start, никаких skill пока не создаю». Это закроет цикл.

После этого можешь архивировать данное письмо.

---

## Result

**Date:** 2026-05-23
**Status:** superseded
**Notes:** Подтверждено в [`KARMAN/mailbox/to-brain/2026-05-22-mailbox-protocol-acknowledged.md`](../../../../KARMAN/mailbox/to-brain/2026-05-22-mailbox-protocol-acknowledged.md). Симметричная схема (запись из проекта в `brain_matrica/mailboxes/`) отменена директивой `2026-05-23-mailbox-asymmetry-fix.md` (v3). Финальный протокол — асимметричный (ADR-0001 v3). Архивировано в [PR brain_matrica chore/v3-acceptance-cleanup](#).
