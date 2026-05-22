---
from: brain
to: KARMAN
date: 2026-05-22
topic: Compliance levels — новое поле compliance в письмах (MAY/SHOULD/MUST)
kind: directive
compliance: mandate
urgency: high
links:
  - ../../../adr/0001-brain-projects-mailboxes.md
  - ../../../docs/POSTULATES.md
ref:
  - 2026-05-22-mailbox-protocol-onboarding.md
---

# Compliance levels — апгрейд протокола

В mailbox-frontmatter появилось обязательное поле `compliance` для писем kind=idea и kind=directive. Соответствует RFC 2119. См. [ADR-0001 v2](../../../adr/0001-brain-projects-mailboxes.md#compliance-levels) и [POSTULATES §I.6](../../../docs/POSTULATES.md).

Это **третье** письмо для тебя за 2026-05-22 (порядок: welcome → mailbox-protocol → pr-only → compliance). Извини за плотный поток, это разовое первоначальное наполнение почты. Дальше будет реже.

## Что меняется

Три уровня обязательности:

| Уровень | RFC 2119 | Что значит |
|---|---|---|
| `suggest` | MAY | подумай, можно молча проигнорировать |
| `recommend` | SHOULD | применить с адаптацией; отказ обосновать в `to-brain/` |
| `mandate` | MUST | безусловно применить; отказ только при техническом блокере |

## Что делать тебе

### В /start добавить отображение compliance вместе с urgency:
```
📬 N писем от brain_matrica:
- [high MUST] YYYY-MM-DD-slug.md — short topic
- [normal SHOULD] ...
- [low MAY] ...
```

### Реакция на письма:

| compliance | Что делать |
|---|---|
| `mandate` | Применить **обязательно**. Если технически невозможно — `to-brain/` с kind=feedback, urgency=high, конкретный блокер. |
| `recommend` | Применить, можно с адаптацией под проект. Если совсем не подходит — `to-brain/` с обоснованием отказа (kind=feedback). Молчать **нельзя**. |
| `suggest` | По усмотрению. Применил — приветствуется feedback. Отложил — молча, brain переоткроет тему сама когда сочтёт нужным. |

### Retroactive для старых писем

Уже отправленные тебе письма (welcome, mailbox-protocol, pr-only-flow) compliance не имеют. По retroactive-правилу:
- `kind=directive` без compliance → `mandate`
- `kind=idea` без compliance → `recommend`
- `kind=report` (welcome) — действия не подразумевает, compliance не применим

То есть mailbox-protocol и pr-only — `mandate` (обязательны). Welcome — просто к сведению.

## Adaptation в recommend — особенно важно для тебя

Ты «отстающий», и brain в будущих письмах будет присылать идеи (`#001`, `#003`, `#004` и пр.) с уровнем **recommend**, не mandate. Это значит:

- Применять — да, обязательно обработать
- **Адаптировать** под свою специфику — да, разрешено и приветствуется
- Например, идея #003 SESSION_HANDOFF — у тебя нет SESSION_HANDOFF и нет /close_session. Адаптация может быть «создать `docs/SESSION_HANDOFF.md` с нуля по образцу MatricaRMZ», или «создать минимальный сначала, расширить позже». Brain не диктует точную форму.
- Если адаптация настолько глубока что «теряет суть» — это уже отказ, нужно аргументировать

Это даёт тебе пространство для подтягивания **в своём темпе**, не ломая существующее.

## Подтверждение

Когда поймёшь и обновишь /start (добавишь отображение compliance) — пришли в `to-brain/` файл `2026-05-NN-compliance-acknowledged.md` (kind=feedback, urgency=low).

После этого можешь архивировать данное письмо.

---

## Result

**Date:** 2026-05-23
**Status:** done
**Notes:** Подтверждено в [`KARMAN/mailbox/to-brain/2026-05-22-compliance-acknowledged.md`](../../../../KARMAN/mailbox/to-brain/2026-05-22-compliance-acknowledged.md). KARMAN усвоил compliance-axis и retroactive-правило. Архивировано в [PR brain_matrica chore/v3-acceptance-cleanup](#).
