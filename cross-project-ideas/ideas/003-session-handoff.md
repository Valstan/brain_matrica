# 003 — SESSION_HANDOFF.md + `/close_session` skill для непрерывности разработки между сессиями

**Status (overall):** ⚠️ proposed
**Born in:** MatricaRMZ, 2026-05-22 session
**Born from:** пользователь спросил «как сделать чтобы ниточки разработок не прерывались и не забывались между сессиями, особенно при работе с двух компов».

---

## Проблема

Многоэтапные задачи (рефакторинги, миграции) длятся 3-5 сессий разработки. Между сессиями может пройти час или неделя; может смениться комп. Без явного «sticky note куда мы шли» Claude в новой сессии:

- Прочитает `docs/PENDING_FOLLOWUPS.md` — увидит длинный список открытых задач, не поймёт какая «текущая».
- Прочитает `docs/DEVELOPMENT_LOG.md` — увидит **что уже сделано**, но не **что было следующим**.
- План в `~/.claude/plans/<slug>.md` (outside-repo) — на другом компе **не виден**, git не передаёт.
- TaskList Claude — не сохраняется между сессиями (in-memory).

Результат — пользователю приходится каждый раз пересказывать контекст: «я на чём-то остановился, план там-то, следующее — то-то». Это потеря времени и риск забыть детали.

## Решение

Три части — все три **в git репозитории** (видно с любого компа):

### 1. `docs/SESSION_HANDOFF.md` — sticky note

Один короткий файл (≤1 экран). Перезаписывается целиком в конце каждой значимой сессии. История — через `git log -- docs/SESSION_HANDOFF.md`.

Структура:
```markdown
# Session Handoff
**Status:** ACTIVE | IDLE
**Updated:** YYYY-MM-DD
**Branch:** main
**Last released version:** vX.Y.Z

## Текущая нитка
1-3 предложения

## Следующий шаг
Конкретно: первое действие новой сессии. File paths + команды.

## Контекст
- План: docs/plans/X.md
- Связанные коммиты: <hashes>
- Прод: <статус>
- Открытые вопросы для пользователя: <list>

## Не забыть (low-priority)
```

### 2. `/close_session` skill (per-project, `.claude/commands/close_session.md`)

Собирает контекст последней работы (git log, TaskList, текущий handoff), пишет новый handoff, обновляет PENDING_FOLLOWUPS если нужно, делает commit + push отдельным коммитом `chore(session): handoff <task>`.

Не выполняет прод-операции, билды, тесты — это инструмент фиксации, не финализации.

### 3. Расширение `/start` skill (per-project, `.claude/commands/start.md`)

**Шаг 0** (перед всем остальным): читает `docs/SESSION_HANDOFF.md`. Если `Status: ACTIVE` и `Updated:` ≤7 дней — в самом верху отчёта выделяет **🧵 Прошлая сессия оставила нитку**: <текущая нитка>, следующий шаг = <...>, **продолжаем?**

Если stale (>7 дней) — отмечает «handoff устарел, возможно нитка не актуальна».

## Соотношение с существующими файлами

| Файл | Объём | Когда пишется | Что хранит |
|---|---|---|---|
| DEVELOPMENT_LOG.md | Растёт | После релиза | История |
| PENDING_FOLLOWUPS.md | Длинный | Постоянно | Все открытые задачи |
| PROJECT_STATE.md | Стабильный | При смене архитектуры | Правила |
| **SESSION_HANDOFF.md** | **Короткий, ≤1 экран** | **В конце значимой сессии** | **Одна текущая нитка** |

SESSION_HANDOFF ссылается на пункт в PENDING_FOLLOWUPS — не дублирует данные. Так избегаем дрейфа.

## Применимость

### applicable_when
- Проект где встречаются многоэтапные задачи (рефакторинги, миграции на несколько релизов)
- Работа идёт с двух+ компов через git
- Есть `.claude/commands/` для per-project skills (стандартно для Claude Code)
- Есть `docs/` папка с документацией процесса

### not_applicable_when
- Проект — одноразовый скрипт или mvp
- Все задачи завершаются за одну сессию
- Нет привычки вести `docs/PENDING_FOLLOWUPS.md` или аналог — handoff повиснет в воздухе
- Команда из нескольких разработчиков работает параллельно — handoff станет источником конфликтов (нужны per-developer handoffs или другая схема)

## Implemented in / not_applicable_for

| Проект | Статус | Дата | Заметка |
|---|---|---|---|
| MatricaRMZ | ✅ применено | 2026-05-22 | Pilot. Файл `docs/SESSION_HANDOFF.md`, skill `/close_session`, расширен `/start` шагом 0, директива в CLAUDE.md «планы создавать в docs/plans/». |
| GONBA | ✅ применено | 2026-05-22 | Перенесено из MatricaRMZ. Файл `docs/SESSION_HANDOFF.md` создан с активной ниткой «Media → Я.Диск», skill `/close_session` в `.claude/commands/`, `/start` расширен шагом 0, CLAUDE.md обновлён (источники правды + lifecycle + директива про `docs/plans/`), создан `docs/plans/README.md`. |
| setka | ⚠️ применимо, не применено | 2026-05-23 | Pool-фиксация: применимо (есть `DEV_HISTORY.md`, нитки, многоэтапные рефакторинги). Brain директиву не отправлял — взять в работу когда у setka будет окно между большими нитками (текущая «модуль авто-регистрации регионов» — deep flow, не отвлекать). |
| KARMAN | ⚠️ применимо, не применено | 2026-05-23 | Pool-фиксация: применимо. KARMAN сейчас в between threads → close to dormant, нет ничего из `docs/` — отличное окно чтобы заложить SESSION_HANDOFF до старта следующей нитки. Brain директиву не отправлял (low priority до пробуждения проекта). |

## Как переносить в новый проект

1. Создать `docs/SESSION_HANDOFF.md` с шаблоном выше + начальное состояние (`Status: IDLE` если нет активной нитки).
2. Создать `.claude/commands/close_session.md` — копия из MatricaRMZ адаптирована под язык/правила проекта.
3. Расширить `.claude/commands/start.md` — добавить **шаг 0** «прочитать SESSION_HANDOFF.md и выделить нитку в отчёте».
4. Обновить `CLAUDE.md`:
   - Добавить `docs/SESSION_HANDOFF.md` в список источников правды.
   - Добавить `docs/plans/` с директивой «при plan mode создавай файл сразу здесь, не в `~/.claude/plans/`».
   - Добавить раздел «Команды управления сессией».
5. Если есть существующие планы в `~/.claude/plans/` — скопировать в `docs/plans/` и оставить outside-repo как fallback.
6. Commit + push: один коммит `infra: session handoff for continuous development`.

## Возможные расширения (на потом)

- **Multi-developer mode**: per-developer handoff'ы (`docs/.handoffs/<dev>.md`) если несколько людей работают параллельно.
- **Auto-handoff hook**: settings.json post-stop hook, который сам генерирует handoff из TaskList и git log при `Stop` — для случаев когда пользователь закрывает сессию без явной `/close_session`.
- **Handoff staleness alert**: cron-задача еженедельно проверяет все проекты на stale handoff'ы и шлёт пользователю напоминание.
- **Handoff в GitHub Issues**: для команды можно автозеркалить активный handoff в pinned issue репо.
