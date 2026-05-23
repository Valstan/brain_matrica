---
description: Сгенерировать draft директивы/идеи/вопроса в mailboxes/<P>/from-brain/DRAFTS/ из шаблона
argument-hint: <project> [<topic-slug>]
---

Генератор draft-письма от brain к проекту. Создаёт файл в `mailboxes/<P>/from-brain/DRAFTS/YYYY-MM-DD-<slug>.md` с заполненным frontmatter и шаблоном секций. Пользователь дальше дописывает содержимое и просит вынести в `from-brain/` через PR.

## Аргументы

```
/letter <project>                  # спросит slug + kind/compliance/urgency интерактивно
/letter <project> <topic-slug>     # сразу с slug, остальное спросит
```

`<project>` — case-sensitive имя из реестра: `MatricaRMZ`, `GONBA`, `setka`, `KARMAN`. Если имя неточное (`matricarmz`, `gonba`) — нормализуй и подтверди у пользователя.

## Workflow

### 1. Уточни параметры письма (если не указаны)

Через AskUserQuestion одним блоком:

- **kind:** `directive` | `idea` | `question` | `feedback` | `report`
- **compliance** (только если kind=directive или idea):
  - `suggest` (MAY) — попробуй, можно проигнорировать
  - `recommend` (SHOULD) — применить с адаптацией, отказ обосновать
  - `mandate` (MUST) — безусловно
- **urgency:** `low` | `normal` | `high`
- **topic** (1 строка) — если не давался slug

Если slug не давался — сгенерируй из topic kebab-case (например, `Изолировать SSH-deploy-ключ` → `isolate-ssh-deploy-key`).

### 2. Сгенерируй файл

Путь: `mailboxes/<P>/from-brain/DRAFTS/<YYYY-MM-DD>-<slug>.md`

Шаблон:

```markdown
---
from: brain
to: <PROJECT>
date: YYYY-MM-DD
topic: <topic 1 строка>
kind: <kind>
compliance: <compliance, опускается если kind не directive/idea>
urgency: <urgency>
links:
  - <если есть — относительные пути к pool/ADR>
ref:
  - <если ответ на письмо проекта — slug оригинала>
---

# <Заголовок, например "Директива: <topic>" или "Идея: <topic>" или "Вопрос: <topic>">

## Контекст

<Зачем поднимаем тему. 2-5 предложений. Должно быть понятно Claude в проектной сессии без предзнания.>

## <Что делать | Что предлагается | На что нужен ответ>

<Конкретные шаги / варианты / вопросы.>

## Что НЕ делать

<Только если есть очевидные anti-patterns. Если нет — секцию можно удалить.>

## Подтверждение (для kind=directive/idea)

Когда применишь — пришли в свой `mailbox/to-brain/` файл `YYYY-MM-DD-<slug>-<result>.md` (kind=feedback) с:

- <список того что должно быть в acknowledgement>

После этого можешь архивировать данное письмо.

## Follow-up для brain

<Опционально: что brain сделает после ack. Например — обновит pool статус, обновит реестр, зафиксирует milestone.>

## Связано

<Опционально: ссылки на pool ideas, ADR, предыдущие письма.>
```

### 3. Доложи пользователю

```
📝 Draft создан: mailboxes/<P>/from-brain/DRAFTS/YYYY-MM-DD-<slug>.md

Frontmatter:
- kind: <...>
- compliance: <...>
- urgency: <...>

Дальше:
- Открой файл и допиши содержимое секций
- Когда готово — попроси «вынеси в from-brain/», я переношу в from-brain/ и делаю PR
- Или скажи «удалить draft» если передумал
```

## Что НЕ делает

- ❌ **Не выносит** автоматически в `from-brain/` — draft нужен явный «вынеси». Это безопасность от ложных писем в проект.
- ❌ **Не делает commit/push** — draft остаётся uncommitted локально, пользователь решает.
- ❌ **Не пишет содержимое секций** — только шаблон. Содержимое — это смысл письма, генерируется в обсуждении с пользователем (или другим механизмом — например, можно дать Claude'у развернуть из 1-абзацного описания).
- ❌ **Не создаёт kind=feedback/report от brain'а** — feedback/report идут от проекта к brain, не наоборот. Если выбран один из них для brain → projects — предупреди и переспроси.

## Когда использовать

- Знаешь что хочешь сказать проекту, нужен «скелет» письма с правильным frontmatter
- Хочешь не забыть про правильные секции (Контекст / Что делать / НЕ делать / Подтверждение)
- Скорость: вместо «вспомни формат, открой пример, скопируй, отредактируй» — `/letter MatricaRMZ ssh-key-rotation` + ответы на 3 вопроса

## Когда НЕ использовать

- Сложная многоэтапная директива со специфическим контекстом — пиши вручную, шаблон будет мешать
- Ответ на письмо проекта (`ref:`) — лучше вручную, чтобы привязка была точная
- Письма в pool / inbox / ADR — этот skill только для mailbox писем

## Пример

```
/letter setka session-handoff-adoption
→ AskUserQuestion: kind/compliance/urgency
→ kind=directive, compliance=recommend, urgency=normal
→ создан mailboxes/setka/from-brain/DRAFTS/2026-05-25-session-handoff-adoption.md
→ пользователь открывает, дописывает Контекст + шаги
→ «вынеси в from-brain» → я делаю git mv DRAFTS/file → ../file + PR
```
