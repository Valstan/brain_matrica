# MatricaRMZ

**Repo:** https://github.com/Valstan/MatricaRMZ
**Local clone:** `D:\GitHubReps\MatricaRMZ` (Windows dev машины)
**Owner:** valstan
**SSH alias (prod):** `matricarmz` (см. `~/.ssh/config`)

## Стек
- Язык: TypeScript (`exactOptionalPropertyTypes: true`)
- Runtime: Node 22 + Electron (клиент)
- Backend: Express REST API
- БД: PostgreSQL 16 на проде, SQLite на клиенте, Drizzle ORM
- Frontend: React 18 (electron-vite сборка)
- Deploy: SSH systemd + nginx (dual instance: primary :3001 + secondary :3002)
- Package manager: pnpm 10 (monorepo: electron-app/, backend-api/, shared/, web-admin/, scripts/, ledger/)
- Builds: GitHub Actions для Windows installer (`.exe` + `latest.yml` + torrent)

## Прод
- URL: https://195.161.41.30/ (jino.ru VPS, Moscow RU)
- Текущая версия: **v1.21.1** (2026-05-22)
- Health check: `curl -fsk https://127.0.0.1/health`
- Updates status: `curl -fsSk https://127.0.0.1/updates/status`
- Дата последнего релиза: 2026-05-22
- Сервисы: `matricarmz-backend-primary.service`, `matricarmz-backend-secondary.service`
- Updates dir: `/opt/matricarmz/updates/`
- Ledger publish: `corepack pnpm release:ledger-publish X.Y.Z`
- ⚠️ fail2ban активен (aggressive mode) — после неудачного SSH login не повторять подряд

## Текущая фаза разработки

Многоэтапный рефакторинг цепочки BOM сборки двигателя (план в `docs/plans/bom-refactor-2026-05.md`, релизы 1.21.0 → 1.22.0):

- v1.21.0 ✅ 2026-05-22 — фундамент: не-мутирующий UI карточки BOM + snapshot без priority
- v1.21.1 ✅ 2026-05-22 — колонка «Вариантов» вместо «Строк» в списке BOM
- v1.21.2 ❌ next — объединённый виджет `GroupedSearchSelect` «тип+компонент» (см. `docs/SESSION_HANDOFF.md`)
- v1.21.3 ❌ pending — удаление `BOM_SKELETON_KNOWN_COMPONENT_TYPES` whitelist + pre-check дублей INSERT
- v1.22.0 ❌ pending — forecast edge cases + part↔nomenclature mirror + DDL `component_type_id`

## Ссылки на per-project документацию
- [SESSION_HANDOFF.md](https://github.com/Valstan/MatricaRMZ/blob/main/docs/SESSION_HANDOFF.md) — текущая нитка
- [DEVELOPMENT_LOG.md](https://github.com/Valstan/MatricaRMZ/blob/main/docs/DEVELOPMENT_LOG.md) — история релизов
- [PENDING_FOLLOWUPS.md](https://github.com/Valstan/MatricaRMZ/blob/main/docs/PENDING_FOLLOWUPS.md) — открытые задачи
- [PROJECT_STATE.md](https://github.com/Valstan/MatricaRMZ/blob/main/docs/PROJECT_STATE.md) — архитектурное состояние
- [docs/plans/bom-refactor-2026-05.md](https://github.com/Valstan/MatricaRMZ/blob/main/docs/plans/bom-refactor-2026-05.md) — план рефакторинга BOM

## Применённые идеи из pool
- **#003** SESSION_HANDOFF + `/close_session` skill — ✅ 2026-05-22, pilot

## Известные блокеры стратегического уровня
- **Anthropic API geo-block** — РФ-IP режется CloudFront edge'ом. AI-фичи на проде отключены (`AI_ENABLED=false`). Решается forward-proxy через зарубежный VPS — не реализовано.

## Особенности
- EAV-система: атрибуты сущностей в таблице `attribute_values`, новые атрибуты регистрируются в `ensureAttributeDefs` (SimpleMasterdataDetailsPage.tsx) — без DDL миграций
- Ledger encryption: keyring format (enc:v2) с множеством ключей, backward-compat с enc:v1
- Phase 1 миграции Directories→Nomenclature не завершена (см. PENDING_FOLLOWUPS)
- Phase 2.x миграция складов на FK `warehouse_locations` — в работе (2.4.4 финал DROP COLUMN ждёт неделю стабильности)
