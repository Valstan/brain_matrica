# KARMAN

**Repo:** https://github.com/Valstan/karman
**Local clone:** `<WORKSPACE_ROOT>/karman` (см. [BOOTSTRAP](../docs/BOOTSTRAP.md))
**Owner:** valstan
**SSH alias (prod):** _(уточнить — см. `~/.ssh/config`)_
**Статус:** active, **отстающий** — мало активной разработки в последние месяцы, технологически нужно подтягивать

## Стек

- **Frontend:** React 18 + TypeScript 5.6 + Vite 6 + Ant Design 5 + react-router-dom 6
- **API:** Express 5 + node-postgres (`pg` 8) — лёгкий Node.js слой
- **БД:** PostgreSQL (`karman_db`)
- **Web server:** nginx (SPA + reverse proxy на API)
- **Сервис API:** `karman-api.service` (systemd, локальный порт 8080)
- **Auth:** session cookie (`karman_session`), users в `auth_user`
- **Package manager:** npm (на момент 2026-05-22 — не pnpm, в отличие от MatricaRMZ/GONBA)
- **Tests:** ⚠️ нет (`"test": "echo \"Error: no test specified\" && exit 1"`)

## История

В прошлом был Django + Celery — backend удалён, остался React SPA + лёгкий Node-API. Документация в `karman/README.md` фиксирует этот факт.

## Прод

- **URL:** _(уточнить — публичного URL в README нет, доступ через nginx-домен)_
- **Прод-путь:** `/home/valstan/karman/`
- **Health check:** `curl -sS http://127.0.0.1:8080/api/health`
- **Главные скрипты:** `scripts/build_spa.sh`, `deploy_spa.sh`, `deploy_api.sh`, `restart_api.sh`, `check_ssl_renewal.sh`

## Текущая фаза разработки

`between threads` → фактически близко к `dormant`. Последний коммит 2026-05-20 (Refactor UI and split frontend into modules). До этого активной нитки не было. Под наблюдением brain_matrica для подтягивания технологически (см. welcome-письмо).

## Environment / Setup on new machine

Чтобы развернуть KARMAN на новом компе:

```bash
# 1. Клонировать в стандартную родительскую папку
git clone https://github.com/Valstan/karman.git

# 2. Frontend
cd karman/frontend
npm install
npm run dev     # dev (Vite)
# или
npm run build   # prod-сборка в ../frontend_dist/

# 3. API
cd ../api
npm install
node server.js  # требует PostgreSQL + env vars (см. ниже)
```

**Системные пререквизиты:**
- Node.js ≥ 18 (Vite 6 + Express 5)
- npm (corepack не нужен — pnpm не используется)
- PostgreSQL 14+ с базой `karman_db` и пользователем
- На проде: nginx + systemd (`karman-api.service`)

**Env vars (для API, см. `api/.env.cursor-model-monitor.example`):**
- `DATABASE_URL` — подключение к PostgreSQL
- `CURSOR_MODEL_MONITOR_ENABLED` (true/false) — фоновой мониторинг моделей Cursor
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` (или `CURSOR_MODEL_*` варианты) — для отчётов
- `CURSOR_MODEL_*` параметры (см. README) — интервалы сбора и отчёта

## Ссылки на per-project документацию

- [README.md](https://github.com/Valstan/karman/blob/main/README.md) — описание и операционные команды
- [docs/](https://github.com/Valstan/karman/tree/main/docs) — архитектура и операции

> На момент включения в brain_matrica (2026-05-22) проект **не имеет** `SESSION_HANDOFF.md`, `DEV_HISTORY.md`, `PENDING_FOLLOWUPS.md`. Это часть «отставания» — кандидат на применение идей [#003](../cross-project-ideas/ideas/003-session-handoff.md) и [#004](../cross-project-ideas/ideas/004-minimalist-ai-docs-2026.md).

## Применённые идеи из pool

_(пока ни одной — проект только что включён в brain_matrica 2026-05-22)_

## Связанные cross-project ADRs

- [ADR-0001](../adr/0001-brain-projects-mailboxes.md) — brain ↔ projects communication via mailboxes (применяется ко всем)

## Особенности / стратегические долги

- **Нет автотестов** — `npm test` возвращает ошибку. Приоритет, но не блокер.
- **Особенность Cursor Model Monitor** — встроенный фоновый сервис, делает HTTP-запросы к `cursor.com/docs/models`, `cursor.com/changelog`, шлёт ежедневные отчёты в Telegram. Не основной функционал, но окружение требует TELEGRAM_BOT_TOKEN.
- **Стек слегка отстаёт** — npm вместо pnpm, нет TypeScript на API. Кандидат на унификацию с другими проектами.
- **Auth примитивная** — таблица `auth_user`, session cookie. Безопасность пересмотреть при оживлении проекта.
