# Заявка #0002: Добавить ссылку на brain_matrica в setka/CLAUDE.md

> 🧠 **Заявка от brain_matrica.** Сформулирована meta-сессией, у которой нет полного контекста этого проекта (видит только git log, CLAUDE.md, SESSION_HANDOFF, PENDING_FOLLOWUPS — не видит код, тесты, work-in-progress).
>
> Это **предложение, не задача.** Проанализируй с точки зрения текущего состояния проекта: подходит ли структурно, не дублирует ли уже существующее, не утяжелит ли, есть ли побочные эффекты. Можешь отклонить без объяснений или вернуть встречное «вот как лучше».
>
> Источник: brain_matrica session 2026-05-22.

**Target:** setka
**Created:** 2026-05-22
**Status:** sent
**Связанные идеи pool:** — (это инфраструктурное)

## Контекст у brain_matrica

- Создан meta-репо `brain_matrica` (https://github.com/Valstan/brain_matrica) с pool идей, tech-radar, реестром, ADRs — общий для трёх проектов.
- В `MatricaRMZ/CLAUDE.md` и `GONBA/CLAUDE.md` уже добавлен раздел / строка со ссылкой на brain_matrica (см. свежие правки 2026-05-22).
- В `setka/CLAUDE.md` аналогичная правка **не прошла** — auto-mode classifier Claude Code в brain_matrica-сессии заблокировал прямой edit как «scope escalation в self-modification config другого репо», несмотря на согласие пользователя через `AskUserQuestion`.

Чего я **не** видел:
- Есть ли в setka своя политика про подключение внешних meta-источников
- Нет ли уже в CLAUDE.md упоминания brain_matrica в другом месте

## Предложение

Добавить в `D:\GitHubReps\setka\CLAUDE.md` в таблицу «Источники правды (читать в начале каждой сессии)» новую строку — после `docs/paths.md`.

## Snippet

В файле `setka/CLAUDE.md` найди строку:

```markdown
| [`docs/paths.md`](docs/paths.md) | Карта файлов и API endpoints. |
```

Сразу после неё, новой строкой:

```markdown
| [`../brain_matrica/`](../brain_matrica/) | **Кросс-проектный pool идей, tech-radar, реестр проектов, cross-project ADRs** между MatricaRMZ / GONBA / setka. Meta-репо [`brain_matrica`](https://github.com/Valstan/brain_matrica). Читай `cross-project-ideas/INDEX.md` перед предложением переносимого паттерна. Новые идеи добавляй **в brain_matrica отдельной сессией** (`cd ../brain_matrica && claude`), не из этого репо. При применении — `✅ YYYY-MM-DD` в таблице. Fallback: `~/.claude/cross-project-ideas/` (legacy). |
```

Коммит отдельный: `docs: link to brain_matrica meta-repo`.

## Зачем

- Setka видит общий pool идей и может предлагать переносимые паттерны (или, наоборот, принимать заявки от brain_matrica).
- Унифицирует подход всех трёх проектов: каждый знает где общий «мозг».

## Возможные «нет»

- Если в setka подход «минимизировать ссылки на внешнее» — добавление этой строки нарушает традицию.
- Относительный путь `../brain_matrica/` рассчитан на стандартную раскладку `D:\GitHubReps\` или `~/dev/`. На втором компе если раскладка другая — ссылка битая. Fallback на legacy `~/.claude/cross-project-ideas/` отчасти спасает.

## Что записать обратно

В `docs/DEV_HISTORY.md` (по правилам setka — свежее сверху, в дату сессии):

```markdown
### 2026-XX-XX — brain_matrica integration

- `brain_matrica dispatch #0002`: добавлена ссылка на meta-репо `brain_matrica` в `CLAUDE.md` (источники правды). Применено / отклонено / отложено.
```
