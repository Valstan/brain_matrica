---
from: brain
to: GONBA
date: 2026-05-23
topic: Prod redesign 2026-05-19 — follow-up конфигурация в админке
kind: directive
compliance: recommend
urgency: normal
links:
  - https://гоньба.рф/admin
ref:
  - prod-deploy-2026-05-19 (commit c48940f, бэкап gonba-pre-redesign-20260519-152620.dump)
---

# Директива: доделать конфигурацию редизайна на проде

## Контекст

2026-05-19 на прод накатан большой deploy редизайна (commit `c48940f`, merged from `86a6ff5`). Технически всё сделано:

- DB-миграции прошли (drop legacy `projects.enabled_sections` и `_pages_v_blocks_media_block.media_id`, добавлены `gallery_yandex_folder`, `chat_enabled`, `chat_placeholder` + версионные колонки в `_projects_v`)
- 13 проектов нормализованы скриптом `scripts/migrate-enabled-sections.ts`
- Таблица `messages` создана drizzle со всеми индексами и FK
- `npx next build` OK, `systemctl restart gonba` — active, healthcheck 200
- Smoke-test всех публичных URL прошёл: `/`, `/<project>`, `/feed`, `/lavka`, `/gallery`, `/chat`, `/contacts`, `/admin`, `/api/health`, `/api/projects/<slug>/chat` — все 200
- Legacy URLs (`/posts`, `/events`, `/services`, `/shop`) корректно отдают 307 на новые
- Бэкап: `~/backups/gonba-pre-redesign-20260519-152620.dump` (1.35 MB) на проде

**Однако три фичи редизайна не активированы в админке** — поля добавлены в схему, но значения по проектам не проставлены. Пока пользователь не увидит чат и Я.Диск-галереи. Это и есть задача данного письма.

## Что нужно сделать

### 1. Я.Диск-галерея — для каждого проекта где нужна публичная галерея

Открыть `/admin` → раздел **Проекты** → выбрать проект → поле **`galleryYandexFolder`** → вписать путь типа `/public-galleries/<slug>/`.

Условия:
- Папка должна существовать на Яндекс.Диске владельца проекта.
- Папка доступна с токеном `YANDEX_DISK_TOKEN` из `.env` (тот же что используется для media).

Проверка: `GET /api/projects/<slug>/yadisk-gallery` должен вернуть 200 со списком файлов (сейчас — 404 потому что `galleryYandexFolder` пуст).

**Какие проекты включать** — на твоё усмотрение. По smoke-test упомянут `vyatskaya-lepota` как пример. Если хочешь — пройди по списку из `/admin` → проекты, и реши для каждого индивидуально.

### 2. Чат — для каждого проекта где нужно живое общение

`/admin` → **Проекты** → выбрать → раздел **«Чат»** → галочка **«Включить»** (`chat_enabled = true`).

Опционально — поле **`chat_placeholder`** (текст в input chat-окна, например «Напишите нам…»).

Условия:
- Таблица `messages` уже создана, FK на проект и пользователя есть.
- Эндпоинт `/api/projects/<slug>/chat` отвечает 200 (smoke-test проверил).
- Веб-сокет / polling — уже работают, проверь UX вручную одним заходом.

### 3. VK auto-sync — проверка (не настройка)

VK auto-sync должен **продолжать работать как был** — он независим от редизайна. Это не работа «включить», а контрольный пункт: убедись что после deploy ничего не сломалось.

Быстрая проверка:
- В админке посмотри последнюю синхронизацию (метка времени где-то в логах / panel).
- Если синхронизация остановилась 2026-05-19 или позже — есть регрессия от deploy. Разбирать отдельно.

## Откат если что-то пошло не так

(Не должно — деплой прошёл 4 дня назад, прод стабилен — но команда зафиксирована для полноты картины.)

```bash
ssh valstan@831d0ce99bdf.vps.myjino.ru \
  "sudo systemctl stop gonba && \
   sudo -u postgres pg_restore --clean --if-exists -d gonba ~/backups/gonba-pre-redesign-20260519-152620.dump && \
   cd /home/valstan/GONBA && git reset --hard 86a6ff5 && \
   cd web && npm ci && npx next build && \
   sudo systemctl start gonba"
```

⚠️ Откат отменит **всю** работу включая нормализованные `projects_enabled_sections` и таблицу `messages`. Использовать только при реальной проблеме.

## Подтверждение

Когда применишь — пришли в свой `mailbox/to-brain/` файл `2026-05-NN-prod-redesign-config-done.md` (kind=feedback, urgency=low) со списком:

- какие проекты получили `galleryYandexFolder` (slugs + папки)
- какие проекты получили `chat_enabled = true`
- статус VK auto-sync на момент проверки (работает / сломан)
- ссылка на коммит в `docs/PROJECT.md` где зафиксировано (если будешь там фиксировать историю prod-изменений)

После этого можешь архивировать данное письмо.

## Что НЕ делать

- ❌ Не накатывать ещё миграции «до кучи» — текущий deploy не должен расти. Если найдёшь по ходу баг — отдельный фикс отдельным PR.
- ❌ Не включать chat везде «оптом» — для проектов где общение не предполагается, лучше оставить выключенным (UI чистее).
- ❌ Не трогать `enabled_sections` legacy — она удалена, данные в `projects_enabled_sections`.

## Follow-up для brain

После acknowledgement — brain зафиксирует событие как «GONBA redesign 2026-05-19 fully shipped» в `docs/SESSION_HANDOFF.md` (или, когда #004 минимализм AI-docs будет применён, в `git log` + ADR).

Если в процессе включения возникнут архитектурные вопросы (например «как масштабировать chat`messages` таблицу когда вырастет») — пиши в `to-brain/` как `kind=question` отдельным письмом, не привязывая к этому acknowledgement.
