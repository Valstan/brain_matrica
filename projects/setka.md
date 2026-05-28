# setka

**Repo:** https://github.com/Valstan/setka (private)
**Local clone:** `D:\GitHubReps\setka\` (Windows) или `~/dev/setka/` (UNIX-раскладка)
**Owner:** valstan
**SSH alias (prod):** `setka-prod` (см. `~/.ssh/config`, путь на проде `/home/valstan/SETKA/`)

## Стек

- **Language:** Python 3.12 на проде / Python 3.11 локально для тестов (`py -3.11`)
- **Framework:** (уточнить — Flask / FastAPI?)
- **Очереди / scheduler:** Celery + Redis (workers, beat)
- **Tests:** pytest (159+ тестов)
- **Lint / format:** black, isort, flake8 через pre-commit
- **VK API integration:** токены по префиксу `VK_TOKEN_<NAME>` в `/etc/setka/setka.env` на проде
- **Deploy:** SSH systemd (`systemctl restart setka` через `setka-prod`)
- **Локальная разработка:** Windows 11 + PowerShell 5.1, venv в корне worktree, **не запускать `main.py`** локально (захардкожен путь к проду)

## Прод

- **Health check:** через `/check` skill (pytest + prod systemd + curl + Celery)
- **Сервисы:** `setka` (основной), Celery worker, Celery beat
- **Прод-путь:** `/home/valstan/SETKA/`
- **Логи:** `/home/valstan/SETKA/logs/app.log`
- **Env:** `/etc/setka/setka.env` (секреты — никогда не коммитить)
- **URL:** (уточнить — public-фронт есть?)
- **SSH deploy-ключ:** изолированный (см. [идея #001](../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md))

## Текущая фаза разработки

Рефакторинг модуля VK-уведомлений завершён (этапы 1-5, 2026-05-21). Свежая идея от 2026-05-22 — **модуль авто-регистрации регионов и сообществ** (см. последний коммит `67a606f`). Активной нитки на текущий момент — нужно подтвердить из `setka/docs/SESSION_HANDOFF.md`.

## Ссылки на per-project документацию

- [START_HERE.md](https://github.com/Valstan/setka/blob/main/docs/START_HERE.md) — быстрый старт
- [AI_DEV_GUIDE.md](https://github.com/Valstan/setka/blob/main/docs/AI_DEV_GUIDE.md) — архитектурный гайд
- [SESSION_HANDOFF.md](https://github.com/Valstan/setka/blob/main/docs/SESSION_HANDOFF.md) — нить между сессиями (#003, с 2026-05-23)
- ~~DEV_HISTORY.md~~ — упразднена 2026-05-24 (#004); хронология в `git log` / `gh pr view`
- [PENDING_FOLLOWUPS.md](https://github.com/Valstan/setka/blob/main/docs/PENDING_FOLLOWUPS.md) — открытые задачи
- [OPERATIONS.md](https://github.com/Valstan/setka/blob/main/docs/OPERATIONS.md) — эксплуатация
- [REMOTE_ACCESS.md](https://github.com/Valstan/setka/blob/main/docs/REMOTE_ACCESS.md) — **только SSH через `setka-prod`**, не MCP

## Применённые идеи из pool

- **#001** Изолированный per-project SSH-deploy-ключ — ✅ 2026-05-22
- **#003** SESSION_HANDOFF + `/close_session` — ✅ 2026-05-23 ([PR #20](https://github.com/Valstan/setka/pull/20)). Отдельный `/close_session` (не слит с `/finish`). `docs/plans/` не создавали — plan mode редок.
- **#004** Минимализм AI-docs (упразднение DEV_HISTORY) — ✅ 2026-05-24 (setka `docs/adr/0001-archive-dev-history.md`). Хронология → `git log` + `gh pr view` + SESSION_HANDOFF.

## Связанные cross-project ADRs

_(пока нет)_

## Особенности / стратегические долги

- ~~Свой стиль docs (DEV_HISTORY + /finish)~~ — **выровнен 2026-05-24**: применены #003 (SESSION_HANDOFF + `/close_session`) и #004 (упразднена DEV_HISTORY). Теперь как MatricaRMZ/GONBA: SESSION_HANDOFF + ADR + git log. `/finish` и `/close_session` сосуществуют (разные триггеры).
- Прод-доступ строго через `setka-prod` SSH-alias; **MCP не использовать** (auto-mode classifier блокирует, и правильно — путаются разные VPS).
- На проде нет push-миграции — изменения схемы вручную через `/sql` skill.
