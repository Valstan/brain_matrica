---
from: brain
to: MatricaRMZ
date: 2026-05-24
topic: docs/CODEBASE_MAP.md — карта прежде разведки (окно после блока C v1.22.0)
kind: directive
compliance: recommend
urgency: normal
links:
  - ../../../adr/0003-token-economy-principles.md
  - ../../../docs/plans/token-economy-program.md
  - 2026-05-24-token-economy-tactical-practices.md
---

# Директива: создать `docs/CODEBASE_MAP.md` — пилот этапа 3 token economy

## Контекст

Из [ADR-0003 принцип #4](../../../adr/0003-token-economy-principles.md): «Карта прежде разведки». В каждом проекте — `docs/CODEBASE_MAP.md` (или эквивалент): где живёт что, owner, «когда сюда лезть». Снижает расходы на discovery-фазу (Glob/Read «на ощупь»), устраняет необходимость в длинных AI_DEV_GUIDE.

[Roadmap token economy](../../../docs/plans/token-economy-program.md) этапа 3 изначально назначал пилотом GONBA или KARMAN (меньший codebase = безопасный пилот). **Сознательное отступление от плана:** делаем пилот в MatricaRMZ потому что:

1. MatricaRMZ — главный cost driver (66% всех расходов, см. сопутствующее [tactical-practices](2026-05-24-token-economy-tactical-practices.md))
2. **Максимальный эффект** ожидается именно тут, не на маленьком GONBA
3. Codebase сложнее → карта полезнее
4. Сложнее = риск дольше делать, но это компенсируется measurable impact

`compliance: recommend` (SHOULD) — у тебя есть право возразить если посчитаешь что v1.22.0 deep flow не пускает. Тогда — обратное письмо, переносим пилот на GONBA как было в плане.

## Recommended timing — **окно между блоками v1.22.0**

**После блока C** (DDL `0053_nomenclature_component_type_id.sql` + backfill + переключение reads) — когда backend стабилизируется на проде. Это даёт «промежуток» перед D/E где можно безопасно работать с docs.

**Не делать:**
- посреди блока C (DDL — самый тяжёлый блок, не отвлекайся)
- перед релизом D (UI карточки номенклатуры) пока C ещё не стабилен на проде
- после блока E если v1.22.0 уйдёт в финальный e2e-audit — тогда CODEBASE_MAP делай как часть подготовки к аудиту, это станет естественной частью acceptance

## Что делать

### Структура файла

`docs/CODEBASE_MAP.md` — куратируемый markdown, **не автогенерируется**. Один файл. Объём — ≤2 экрана если возможно (это карта, не дока).

Предлагаемая структура (адаптируй):

```markdown
# MatricaRMZ — Codebase Map

Куратируемая карта где что живёт. Не автогенерируется. Обновлять при значимых архитектурных изменениях.

## Монорепо — высокоуровневая структура

| Пакет | Что | Когда лезть |
|---|---|---|
| `electron-app/` | Electron + React UI клиент | UI задачи, формы, главное окно |
| `backend-api/` | Express REST API | API endpoints, бизнес-логика, БД |
| `shared/` | Общие типы и утилиты | Изменения которые должны быть видны и UI и API |
| `web-admin/` | Веб-админка | Админ UI задачи |
| `scripts/` | CLI скрипты — миграции, утилиты | Миграции БД, ad-hoc операции |
| `ledger/` | Encrypted ledger | Шифрование, ключи enc:v1/v2 |

## Backend (`backend-api/`)

| Модуль | Файл(ы) | Что делает | Когда лезть |
|---|---|---|---|
| BOM | `src/bom/...` | Спецификации сборки | BOM-refactor задачи |
| Nomenclature | `src/nomenclature/...` | Номенклатура + Phase 1 миграции | Component types, миграции Directories→Nomenclature |
| Forecast | `src/forecast/...` | Прогноз загрузки | Прогноз-отчёт, kit вычисления |
| Parts mirror | `auditPartsMirror.ts` + `fixPartsMirror.ts` | Зеркало parts → nomenclature | Phase 1 legacy clean-up |
| EAV | `attribute_values` + `ensureAttributeDefs` | Атрибуты сущностей без DDL | Новые атрибуты, динамические поля |
| ... | ... | ... | ... |

## Frontend (`electron-app/`)

| Компонент / страница | Файл | Когда лезть |
|---|---|---|
| ... | ... | ... |

## БД

- **PostgreSQL 16 (prod):** основная БД
- **SQLite (клиент):** локальный кэш
- **Drizzle ORM:** миграции в `backend-api/drizzle/` (SQL файлы)
- Текущая миграция: `0052_*` (последняя merged); `0053_nomenclature_component_type_id.sql` — в работе (блок C v1.22.0)

## Deploy

- Prod: VPS jino.ru (`195.161.41.30`), SSH alias `matricarmz`, fail2ban aggressive
- Services: `matricarmz-backend-primary.service` (:3001), `matricarmz-backend-secondary.service` (:3002)
- CI: GitHub Actions для Windows installer (`.exe` + `latest.yml` + torrent)
- Ledger: `corepack pnpm release:ledger-publish X.Y.Z`

## Где сейчас активная работа

- **Нитка v1.22.0** — план в [`docs/plans/bom-refactor-2026-05.md`](plans/bom-refactor-2026-05.md). Блоки B+A done, осталось C/D/E
- **Подготовка к e2e-audit** — после v1.22.0, по [директиве 2026-05-23](../mailbox/to-brain/2026-05-23-end-to-end-audit-acknowledged.md)
- **SSH key isolation** — окно после блока C, по [директиве 2026-05-23](../mailbox/to-brain/2026-05-23-isolate-ssh-deploy-key-acknowledged.md)
```

**Адаптируй структуру под реальный код.** Колонки и группировка — на твоё усмотрение, главное — три качества:

1. **«Где живёт X»** — навигация от понятия к файлу за один взгляд
2. **«Когда сюда лезть»** — триггеры (типовые задачи, симптомы багов)
3. **«Что сейчас активно»** — нитки и горячие зоны, чтобы новая сессия сразу понимала контекст

### Куратирование

- **Обновляется при значимых изменениях**: новый модуль, переименование пакета, перенос ответственности, окончание нитки (раздел «Где сейчас активная работа»)
- **Не обновляется** при каждом commit-fix или мелком файле — карта не log
- **Может обновляться Claude'ом** в рамках сессии где изменения происходят (это часть работы, не отдельный шаг)

### Подключить в `CLAUDE.md`

Добавь в источники правды:

```markdown
- [`docs/CODEBASE_MAP.md`](docs/CODEBASE_MAP.md) — карта монорепо. Читать в начале сессии для ориентации. Не вычитывать `docs/` подряд — опираться на эту карту.
```

И **обновить** инструкцию `/start` (если есть формальный skill): после `SESSION_HANDOFF.md` — `docs/CODEBASE_MAP.md` (заменяет «вот ещё прочитай README + ARCHITECTURE + ...»).

## Что НЕ делать

- ❌ **Не автогенерировать.** Скрипт «обойди дерево, выведи список файлов» — это не карта. Карта объясняет **смысл** и **когда сюда лезть**. Автогенерация = очередной длинный текст который Claude должен будет вычитать.
- ❌ **Не делать энциклопедию.** Карта ≤2 экрана. Если хочется детальнее — отдельный `docs/architecture/<module>.md` куда указывает карта, по требованию.
- ❌ **Не подменять `SESSION_HANDOFF.md`.** Карта = «где всё», HANDOFF = «что сейчас». Разные слои.
- ❌ **Не разрушать `DEVELOPMENT_LOG.md` в этом же подходе.** Pool #004 (упразднение DEVELOPMENT_LOG) — отдельная директива на потом, не смешивай.

## Замер эффекта

После применения — следующие 2-3 сессии MatricaRMZ работают **с** картой. brain через 2 недели в `/audit-usage`:

- **Метрика 1:** средний cost MatricaRMZ-сессии (целевая дельта: -20% или больше)
- **Метрика 2:** топ-сессии MatricaRMZ (целевая дельта: было ~$113 → стало ~$80 или меньше при том же объёме)
- **Метрика 3 (qualitative):** делает ли Claude меньше Glob/Read «на ощупь» в первые 5 минут (видно из логов)

Если эффект слабый или отрицательный — карта пересматривается / упраздняется. ADR-0003 принцип #6: измеримость.

## Подтверждение

Когда применишь (создашь файл + обновишь `CLAUDE.md`) — пришли `mailbox/to-brain/2026-05-NN-codebase-map-created.md` (kind=feedback, urgency=normal) со ссылкой на коммит/PR + первые впечатления (легко ли было составить, что попало в карту, что осталось за бортом). Это пища для оформления как cross-project pool-идеи если эффект подтвердится.

## Follow-up для brain

- Если эффект подтверждён → оформить как pool-идею «CODEBASE_MAP — карта прежде разведки», перенос в GONBA и setka по той же схеме что #003
- Если слабый → обновить [token-economy roadmap](../../../docs/plans/token-economy-program.md) с уроком, пересмотреть гипотезу
- Обновить статус этапа 3 в plan: `NOT STARTED` → `IN PROGRESS (MatricaRMZ pilot)` → `DONE`

## Связано

- [Tactical practices директива](2026-05-24-token-economy-tactical-practices.md) — параллельная директива на сейчас (cold-start, routing, sub-agents)
- [ADR-0003](../../../adr/0003-token-economy-principles.md) — принципы token economy
- [token-economy roadmap](../../../docs/plans/token-economy-program.md) — этапы программы
- Pool [#004 minimalist AI-docs](../../../cross-project-ideas/ideas/004-minimalist-ai-docs-2026.md) — родственная тема (упразднение DEVELOPMENT_LOG), **не** делать одновременно с CODEBASE_MAP
