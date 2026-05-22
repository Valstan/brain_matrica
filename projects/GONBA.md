# GONBA

**Repo:** https://github.com/Valstan/Gonba (private)
**Local clone:** `D:\GitHubReps\GONBA\` (Windows) или `~/dev/GONBA/` (UNIX-раскладка)
**Owner:** valstan
**SSH alias (prod):** `GONBA` (см. `~/.ssh/config`)

## Стек

- **Frontend / CMS:** Next.js 15 + Payload CMS
- **Language:** TypeScript
- **БД:** PostgreSQL (локально `postgres:postgres@127.0.0.1:5432/gonba`)
- **Package manager:** pnpm 10 через corepack (pnpm 11 несовместим)
- **Runtime:** Node.js
- **Deploy:** SSH systemd + nginx через `safe-build.sh` (`systemd-run --uid=valstan --gid=valstan`)
- **CI/CD:** GitHub Actions (`.github/workflows/deploy-prod.yml`) — auto-deploy after merge to `main`

## Прод

- **URL:** https://гоньба.рф/
- **Health check:** `curl -s -o /dev/null -w '%{http_code}\n' https://гоньба.рф/api/health`
- **Сервис:** `gonba` (systemd) на VPS
- **Деплой-путь:** `/home/valstan/GONBA/`
- **Текущая версия:** (см. `git tag` / последний релиз — версионирование не релизами, а коммитами `main`)
- **SSH deploy-ключ:** `id_ed25519_gonba_deploy` (изолированный, см. [идея #001](../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md))
- **Следующая ротация ключа:** не позднее **2026-08-20** (90 дней от 2026-05-22, см. [идея #002](../cross-project-ideas/ideas/002-ssh-deploy-key-rotation.md))

## Текущая фаза разработки

**Media → Я.Диск миграция** (ADR-0001, per-project). Этап планирования / proof-of-concept — выбор подхода (A / B / C, см. `GONBA/docs/PENDING_FOLLOWUPS.md → 🟢 Архитектура / Media`). Активная нитка с 2026-05-22.

Завершено в сессии 2026-05-22:
- AdminQuickLinks (dropdown «Меню» в шапке) — [PR #21](https://github.com/Valstan/Gonba/pull/21)
- `/admin/yadisk` как Payload Custom View — [PR #22](https://github.com/Valstan/Gonba/pull/22)
- Изоляция SSH deploy-key + cross-project ideas pool — [PR #20](https://github.com/Valstan/Gonba/pull/20)
- SESSION_HANDOFF + `/close_session` — [PR #23](https://github.com/Valstan/Gonba/pull/23)

## Ссылки на per-project документацию

- [SESSION_HANDOFF.md](https://github.com/Valstan/Gonba/blob/main/docs/SESSION_HANDOFF.md)
- [DEVELOPMENT_LOG.md](https://github.com/Valstan/Gonba/blob/main/docs/DEVELOPMENT_LOG.md)
- [PENDING_FOLLOWUPS.md](https://github.com/Valstan/Gonba/blob/main/docs/PENDING_FOLLOWUPS.md)
- [PROJECT_STATE.md](https://github.com/Valstan/Gonba/blob/main/docs/PROJECT_STATE.md)
- [adr/](https://github.com/Valstan/Gonba/tree/main/docs/adr) — per-project ADRs

## Применённые идеи из pool

- **#001** Изолированный per-project SSH-deploy-ключ — ✅ 2026-05-22
- **#002** Периодическая ротация SSH-deploy-ключей (90 дней) — ✅ 2026-05-22
- **#003** SESSION_HANDOFF + `/close_session` skill — ✅ 2026-05-22

## Связанные cross-project ADRs

_(пока нет — см. `../adr/INDEX.md`)_

## Особенности / стратегические долги

- `pnpm run build` использует watchdog idle 180s — Next.js 15 молчит дольше; использовать `build:raw` напрямую через `systemd-run`. Это **рабочий обход**, не настоящий fix — если перейдём с Next 15 на 16 / другой фреймворк, проблема исчезнет сама.
- `payload migrate` в headless подвисает на drizzle y/N — обёртка `scripts/run-migrate.sh`. Аналогично: артефакт Payload, не наш долг.
- На Windows: `corepack pnpm` требует `script-shell = C:\Program Files\Git\bin\bash.exe`.
