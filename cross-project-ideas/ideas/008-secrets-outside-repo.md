# 008 — Секреты вне репозитория (`/etc/<project>/<project>.env` + systemd `EnvironmentFile`)

**Status (overall):** ⚠️ in adoption (setka pioneer; GONBA/MatricaRMZ/KARMAN — директивы 2026-05-28)
**Born in:** setka (письмо `setka/mailbox/to-brain/2026-05-28-secrets-outside-repo-pattern.md`).
**Born from:** setka хранит секреты только в `/etc/setka/setka.env` (root-owned, вне дерева репо), сервисы грузят через systemd `EnvironmentFile=`. Предложено рекомендовать паттерн проектам, у кого `.env` лежит в папке репо.

---

## Проблема

`.env` с секретами внутри дерева репозитория (`<repo>/.env`, `<repo>/web/.env`) — даже если он в `.gitignore` — это риск:

- защита держится только на аккуратности `.gitignore` (один промах `git add -f` / переименование / новый clone-скрипт → утечка);
- компрометация app-юзера или неудачная git-операция (reset, clean, checkout) могут затронуть секреты;
- код и конфиг смешаны: `git pull` / деплой / откат версии «ходят рядом» с секретами;
- секрет привязан к конкретному дереву репо, не к хосту.

## Решение

Секреты — **вне дерева репозитория**, грузятся менеджером процессов:

- файл `/etc/<project>/<project>.env`, владелец `root:<svc-group>`, mode `0640`;
- сервисы грузят через systemd `EnvironmentFile=/etc/<project>/<project>.env` (или supervisor / docker `--env-file` вне образа);
- код читает из **окружения процесса** (`os.getenv` / `process.env`), а не `load_dotenv(<repo>/.env)`;
- в репозитории остаётся только `*.env.example` — шаблон без значений (документирует список переменных);
- `.gitignore` (`*.env`) — подстраховка, но основная защита = расположение вне репо.

Это 12-factor (разделение кода и конфига) + FHS (`/etc/` для конфигурации хоста).

## Применимость

### applicable_when
- Прод управляется менеджером процессов с поддержкой env-файла (systemd `EnvironmentFile=`, supervisor, docker `--env-file`).
- Секреты сейчас лежат в дереве репо (`<repo>/.env`).
- Есть root-доступ к проду для создания `/etc/<project>/`.

### not_applicable_when
- Чисто контейнерный деплой без доступа к хост-FS — там аналог: docker/compose secrets или `--env-file` вне образа (не `COPY .env` в Dockerfile).
- Код жёстко завязан на `load_dotenv(<repo>/.env)` без возможности передать путь — сначала рефактор на чтение из окружения.

## Implemented in / not_applicable_for

| Проект | Статус | Дата | Заметка |
|---|---|---|---|
| setka | ✅ применено | (pioneer) | `/etc/setka/setka.env` root-owned; `setka` web + `setka-celery-worker` + `setka-celery-beat` → `EnvironmentFile=`. Код читает из окружения, `load_dotenv()` не вызывается. В репо — `config/setka.env.example`. |
| GONBA | ⚠️ директива 2026-05-28 | 2026-05-28 | **Подтверждено сканом brain:** `EnvironmentFile=-/home/valstan/GONBA/web/.env` в `gonba-web`/`gonba-vk-sync`/`gonba-media-cache` — секреты в дереве репо. Мигрировать в `/etc/gonba/gonba.env`. Учесть `web/docker-compose.yml` (`env_file: .env`). recommend/normal, окно between threads. |
| MatricaRMZ | ⚠️ директива 2026-05-28 | 2026-05-28 | Posture не подтверждён локально (backend-юниты не в репо). Директива: проверить где `matricarmz-backend-primary/secondary` берут env; если в дереве репо — мигрировать в `/etc/matricarmz/matricarmz.env`. recommend/low, backlog (не мешать BOM deep flow и install/update audit). |
| KARMAN | ⚠️ директива 2026-05-28 | 2026-05-28 | `api/.env` + `karman-api.service` — вероятно в дереве репо. Мигрировать в `/etc/karman/karman.env`. suggest/low, взять при пробуждении проекта пакетом с [#003](003-session-handoff.md). |

## Как переносить (одноразовая миграция)

1. `sudo mkdir -p /etc/<project>`
2. `sudo mv <repo>/.env /etc/<project>/<project>.env`
3. `sudo chown root:<svc-group> /etc/<project>/<project>.env && sudo chmod 0640 /etc/<project>/<project>.env`
4. В unit-файле: `EnvironmentFile=/etc/<project>/<project>.env` → `systemctl daemon-reload` → restart.
5. Убедиться, что код читает из окружения (или указать dotenv-path на новый файл, если используется `load_dotenv`).
6. Оставить `*.env.example` в репо; при необходимости подчистить `.env` из git-истории.

## Связано

- Pool [#001 isolated deploy SSH key](001-isolated-deploy-ssh-key.md) — тоже про изоляцию секретов (ключей), смежная гигиена.
- [ADR-0002 PR-only flow](../../adr/0002-pr-only-flow-no-direct-push.md) — миграция оформляется веткой + PR.
- Письмо-источник: `setka/mailbox/to-brain/2026-05-28-secrets-outside-repo-pattern.md`.
