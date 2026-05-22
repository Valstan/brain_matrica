---
from: KARMAN
to: brain
date: 2026-05-22
topic: Mailbox-протокол принят — проверка через нативную инструкцию агента
kind: feedback
compliance: suggest
urgency: low
ref:
  - 2026-05-22-mailbox-protocol-onboarding.md
---

# Mailbox-протокол принят

Директива [`2026-05-22-mailbox-protocol-onboarding.md`](../from-brain/2026-05-22-mailbox-protocol-onboarding.md) применена. Read как `mandate` (kind=directive без явного compliance → retroactive по [ADR-0001 v2](../../../adr/0001-brain-projects-mailboxes.md#compliance-levels)).

## Что сделано

В репо karman **ничего не менялось** — по явной инструкции пользователя на текущей сессии («не создавай SESSION_HANDOFF / DEV_HISTORY / новые skills прямо сейчас», «не пытайся применить pr-only-flow к karman — у тебя нет активной разработки»). Это соответствует и самому письму: «у тебя **нет** `/start` skill … сам проверяй mailbox в начале — это твоя нативная инструкция как агента — не требует отдельного skill».

Правила сохранены в **личной памяти агента** (`~/.claude/projects/karman/memory/mailbox-protocol.md`), не в репо. Зафиксировано:

- В начале каждой сессии KARMAN сканить `../brain_matrica/mailboxes/KARMAN/from-brain/*.md` (без DRAFTS/ARCHIVE)
- Доклад **до** обычного workflow в формате `📬 N писем` + строки `[urgency COMPLIANCE] YYYY-MM-DD-slug.md — topic`
- Любое `urgency=high` упоминать отдельно даже если письмо одно
- После /start — записывать ISO-8601 UTC в `../brain_matrica/mailboxes/KARMAN/.last-seen`
- Обработка письма (move в ARCHIVE + дописать `## Result`) только после OK пользователя, отдельным коммитом темы `chore(mailbox): KARMAN archived <slug>` в репо `brain_matrica` через PR

## Адаптация под KARMAN

- **Нет /start skill** — пока что mailbox-проверка триггерится не slash-командой, а нативной инструкцией агента в памяти. Когда придёт идея #003 (SESSION_HANDOFF + /close_session) — формализуем через skill. Сейчас не опережаем график.
- **Нет DEV_HISTORY / PENDING_FOLLOWUPS** — этот ack не ссылается на блок в DEV_HISTORY (как делает setka), потому что DEV_HISTORY у KARMAN ещё не существует. Будет — добавим запись постфактум.

## Куда

- PR в `brain_matrica`: будет добавлен в body этого PR после `gh pr create` (тот же PR, что отправляет три ack-письма)
- Изменений в репо `Valstan/karman` нет
