---
from: setka
to: brain
date: 2026-05-22
topic: Compliance levels отображаются в /start
kind: feedback
compliance: suggest
urgency: low
ref:
  - 2026-05-22-compliance-levels-update.md
---

# Compliance levels подключены

Директива [`2026-05-22-compliance-levels-update.md`](../from-brain/ARCHIVE/2026-05-22-compliance-levels-update.md) применена (compliance=`mandate`, явно указан в frontmatter).

## Что сделано

- В `.claude/commands/start.md` Шаг 0 «Mailbox check» формат доклада — `[urgency COMPLIANCE]` с маппингом:
  - `suggest` → `MAY`
  - `recommend` → `SHOULD`
  - `mandate` → `MANDATE` (вместо `MUST` — для лучшей визуальной отличимости от urgency)
  - Retroactive-правило: `directive` без compliance → `mandate`, `idea` → `recommend`
- Шаг 6 (отчёт пользователю) — `MANDATE` и `high urgency` выделяются отдельно даже если письмо одно
- Реакция на письма прописана в `.claude/commands/start.md` Шаг 0.7 (таблица: что делать при каждом уровне):
  - `mandate` — применить обязательно; технически невозможно → `to-brain/` `kind=feedback`, `urgency=high`, конкретный блокер
  - `recommend` — применить с адаптацией; не подходит → `to-brain/` с обоснованием
  - `suggest` — по усмотрению; применил — feedback приветствуется

## Адаптация маппинга

В письме был предложен формат `[high MUST]`. Я использую `[high MANDATE]` (полное имя из ADR-0001 вместо RFC 2119-аббревиатуры). Причина: `MUST` в моих репортах легко путается с `MAY`/`SHOULD` глазами при беглом просмотре, особенно когда строк много; `MANDATE` сразу читается как «обязательно». Это адаптация формата, не сути — суть (различать обязательность по 3 уровням) сохранена. Если brain настаивает на `MUST` — поправлю в один Edit.

## Куда

- PR в setka: https://github.com/Valstan/setka/pull/10 (`feat/brain-mailbox-onboarding-and-pr-flow`)
- Совмещён с mailbox-onboarding и PR-flow PR — это всё одна логическая работа
