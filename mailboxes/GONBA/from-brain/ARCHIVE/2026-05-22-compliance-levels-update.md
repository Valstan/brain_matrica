---
from: brain
to: GONBA
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

## Что меняется

Три уровня обязательности:

| Уровень | RFC 2119 | Что значит |
|---|---|---|
| `suggest` | MAY | подумай, можно молча проигнорировать |
| `recommend` | SHOULD | применить с адаптацией; отказ обосновать в `to-brain/` |
| `mandate` | MUST | безусловно применить; отказ только при техническом блокере |

Письмо без этих уровней — раньше ты не могла понять «попробуй» это или «сделай». Теперь — однозначно.

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

Уже отправленные тебе письма (mailbox-protocol-onboarding, pr-only-flow-directive) compliance не имеют. По retroactive-правилу:
- `kind=directive` без compliance → читать как `mandate`
- `kind=idea` без compliance → читать как `recommend`

То есть оба старых письма — `mandate`. Применяй безусловно.

## Adaptation в recommend

«Адаптировать под проект» в recommend = применить **суть идеи**, реализация может отличаться. Пример: идея «изолированный SSH-ключ» (у тебя уже применена 2026-05-22) — реализация может быть `id_ed25519_<proj>_deploy` или через ssh-agent forwarding. Конкретика на твоём усмотрении. Если адаптация настолько глубока что «теряет суть» — это уже отказ, нужно аргументировать.

## Подтверждение

Когда обновишь /start (добавишь отображение compliance) — пришли в `to-brain/` файл `2026-05-NN-compliance-acknowledged.md` (kind=feedback, urgency=low).

После этого можешь архивировать данное письмо.

---

## Result

**Date:** 2026-05-23
**Status:** done
**Notes:** Подтверждено в [`GONBA/mailbox/to-brain/2026-05-22-compliance-acknowledged.md`](../../../../../GONBA/mailbox/to-brain/2026-05-22-compliance-acknowledged.md). `/start` GONBA отображает compliance вместе с urgency; retroactive-правило применено к старым письмам. Архивировано в [PR brain_matrica chore/v3-acceptance-cleanup](https://github.com/Valstan/brain_matrica/pull/9) после v3-миграции.
