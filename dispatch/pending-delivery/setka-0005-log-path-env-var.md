# Pending delivery: setka заявка #0005

> Этот файл — **зеркало** заявки #0005, которое не удалось положить в `D:\GitHubReps\setka\docs\inbox-from-brain\` напрямую из brain_matrica-сессии (auto-mode classifier Claude Code заблокировал write в sibling repo как scope escalation).
>
> **Что сделать в следующей setka-сессии:**
> 1. Скопировать содержимое ниже (от строки `# Заявка #0005:`) в `D:\GitHubReps\setka\docs\inbox-from-brain\0005-log-path-env-var.md`.
> 2. Удалить **этот** файл из brain_matrica (`rm D:\GitHubReps\brain_matrica\dispatch\pending-delivery\setka-0005-log-path-env-var.md`).
> 3. Обработать заявку как обычно по протоколу.

---

# Заявка #0005: `LOG_PATH` env var вместо hardcoded пути логов

> 🧠 **Заявка от brain_matrica.** Сформулирована meta-сессией, у которой нет полного контекста этого проекта (видит только git log, CLAUDE.md, SESSION_HANDOFF, PENDING_FOLLOWUPS — не видит код, тесты, work-in-progress).
>
> Это **предложение, не задача.** Проанализируй с точки зрения текущего состояния проекта: подходит ли структурно, не дублирует ли уже существующее, не утяжелит ли, есть ли побочные эффекты. Можешь отклонить без объяснений или вернуть встречное «вот как лучше».
>
> Источник: brain_matrica session 2026-05-22, оригинал — [`../items/0005-setka-log-path-env-var.md`](../items/0005-setka-log-path-env-var.md).

**Target:** setka
**Created:** 2026-05-22
**Status:** sent (через pending-delivery)

## Контекст у brain_matrica

Видел в `setka/docs/PENDING_FOLLOWUPS.md` запись (приоритет 🟡, секция «Запуск и окружение»):

> **`main.py:25` хардкодит `/home/valstan/SETKA/logs/app.log`.** Локально на Windows запустить приложение нельзя — только тесты. Стоит вынести путь в env (`LOG_PATH`) с дефолтом на прод-значение.

Также в git log 2026-05-22 видел коммит `c7bc45f`: `chore(dx): pre-commit on py3.11 + LOG_PATH env + setup-dev scripts` — **возможно уже сделано**.

## Предложение

Сначала проверь не закрыто ли:

```bash
git show c7bc45f --stat
grep -n "LOG_PATH\|logs/app.log" main.py
```

Дальше:
1. Уже сделано → обновить `PENDING_FOLLOWUPS.md`, перенести запись в `DEV_HISTORY.md` как done.
2. Нет или частично → доделать: `os.environ.get('LOG_PATH', '/home/valstan/SETKA/logs/app.log')` в `main.py:25`, smoke-test `python -c "import main"` локально.

## Зачем

Сейчас невозможно запустить `main.py` локально на Windows. Это разрыв в DX (зафиксирован в `CLAUDE.md` setka).

## Возможные «нет»

- `c7bc45f` уже всё закрыл → просто обновить PENDING_FOLLOWUPS.
- Архитектурное решение «main.py только на проде» → LOG_PATH не нужен.

## Что записать обратно

В `docs/DEV_HISTORY.md`:

```markdown
### 2026-XX-XX — техдолги
- `brain_matrica dispatch #0005`: `LOG_PATH` env — <уже сделано в c7bc45f / доделали / отклонили>.
```

И в `docs/PENDING_FOLLOWUPS.md` — если done, удалить запись.
