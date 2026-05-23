# План: Weekly environment audit для всех проектов

**Status:** Proposed
**Created:** 2026-05-22 (как идея #005 в pool)
**Moved here:** 2026-05-23 (признано: это инфра-план brain_matrica, не переносимая идея между проектами)

## Зачем

brain_matrica хранит метаданные проектов в `projects/<P>.md`: стек, env vars, прод-URL, версии. Эта информация **дрейфует** — новые env vars в `.env.example`, обновление крупных deps, смена runtime версии. Без regular audit `projects/<P>.md` стареет за месяцы и теряет ценность для:

- [BOOTSTRAP.md](../BOOTSTRAP.md) — поднятие проектов на новом компе.
- Возврата к dormant-проекту через полгода («что было нужно чтобы запустить?»).
- Помощи Claude в /start-сессии конкретного проекта («подтверди что env корректен»).

## Что делать (план реализации)

### Skill `/weekly-audit` в brain_matrica

Новый slash-command `.claude/commands/weekly-audit.md`, который:

1. Обходит все 4 проекта реестра read-only.
2. Для каждого сравнивает реальный стек с зафиксированным:
   - `package.json` / `requirements.txt` / `pyproject.toml` — крупные deps, версии runtime
   - `.env.example` — новые / удалённые env vars
   - `package.json#scripts` — изменения в build/deploy commands
   - systemd-юниты / deploy-скрипты — если знаем где лежат
3. Diff кладёт **в mailbox проекта** (`mailboxes/<P>/from-brain/YYYY-MM-DD-env-audit-diff.md`) с `kind=feedback`, `compliance=suggest`, `urgency=low`.
4. Альтернатива: brain сам обновляет `projects/<P>.md` если diff тривиален (например, обновление patch-версии Node), но это требует осторожности — лучше отдельной итерацией.

### Триггер

- Cron в Claude Code (`mcp__scheduled-tasks__create_scheduled_task`) — раз в 7 дней. Или:
- В `/start` brain_matrica — если прошло > 7 дней с последнего audit (timestamp в `docs/.last-audit`).

Предпочтительный вариант — **триггер в `/start`**: меньше шансов забыть, нет зависимости от external cron которого может не быть на новом компе.

## Применимость по проектам

Для каждого проекта решение «включён ли audit» — отдельное. По умолчанию все 4 включаются, но проект может опт-аут через мета-поле в `projects/<P>.md`:

```yaml
weekly_audit: disabled  # default: enabled
```

| Проект | Польза |
|---|---|
| MatricaRMZ | Высокая: много env vars, ledger-publish, sub-services. |
| GONBA | Высокая: версии pnpm критичны (10 vs 11), Next.js версии. |
| setka | Высокая: Python версии 3.11 vs 3.12, токены VK_TOKEN_<NAME>. |
| KARMAN | Высокая: проект отстаёт, env-секция может быть неточна. |

## Подводные камни

- **False positives.** Bumped patch версии каждый день — diff будет шумный. Решение: report только major/minor + новые/удалённые deps, patch игнорировать.
- **Большие diff'ы парализуют.** Если в проекте сильно изменился `package.json`, письмо станет огромным. Решение: только diff агрегатно («появилось N deps, удалено M»), детали в attachment-секции.
- **Аудит на основе одной dev-машины.** Если у проекта несколько компов с разными состояниями — brain видит только тот, на котором запускается. Это не блокер для MVP — у разработчика одна машина.

## Чего НЕ делать

- Аудит во время активной нитки проекта — может отвлечь. Skill должен пропускать проекты с активной ниткой (`docs/SESSION_HANDOFF.md` → `Status: ACTIVE` и `Updated <7 days ago`).
- Аудит на dormant-проектах — нет смысла, информация всё равно устаревает быстрее чем её используют. Skill пропускает фазы `dormant` / `archived`.

## Связано

- [ADR-0001](../../adr/0001-brain-projects-mailboxes.md) — audit использует mailbox-протокол для доставки diff'ов.
- [BOOTSTRAP.md](../BOOTSTRAP.md) — bootstrap зависит от актуальных env-секций; audit поддерживает их свежесть.
- [`projects/INDEX.md`](../../projects/INDEX.md) — где живут метаданные, которые audit сверяет.

## История

- 2026-05-22: появилась как идея #005 в cross-project-ideas pool.
- 2026-05-23: вынесена из pool в `docs/plans/` (это не идея для проекта, а план для brain_matrica). Никто не реализовывал. Ждёт когда руки дойдут.
