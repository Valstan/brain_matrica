# 008 — Секреты вне репозитория (`/etc/<project>/<project>.env` + systemd `EnvironmentFile`)

**Status (overall):** ⚠️ in adoption (setka pioneer; **GONBA + MatricaRMZ ✅ 2026-05-30**; KARMAN — директива 2026-05-28, в связке с #003)
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
| GONBA | ✅ применено | 2026-05-30 | `/etc/gonba/gonba.env` (`root:valstan` 0640); 3 юнита → `EnvironmentFile=`. **Прод=systemd зафиксирован в ADR-0005**, docker-compose = dev-only. Adaptation: **Next.js build-time gotcha** (см. ниже). PR [Gonba#53](https://github.com/Valstan/Gonba/pull/53). |
| MatricaRMZ | ✅ применено | 2026-05-30 | `/etc/matricarmz/matricarmz.env` (`root:valstan` 0640); оба backend-юнита → `EnvironmentFile=`, рестарт по одному без простоя. Adaptation: **in-tree симлинк для dotenv-CLI** (см. ниже). Найдены+удалены 3 stale `.env.bak*`. PR `chore/secrets-externalize-etc-008`. |
| KARMAN | ⚠️ директива 2026-05-28 | 2026-05-28 | `api/.env` + `karman-api.service` — вероятно в дереве репо. Мигрировать в `/etc/karman/karman.env`. suggest/low, взять при пробуждении проекта пакетом с [#003](003-session-handoff.md). |

## Как переносить (одноразовая миграция)

1. `sudo mkdir -p /etc/<project>`
2. `sudo mv <repo>/.env /etc/<project>/<project>.env`
3. `sudo chown root:<svc-group> /etc/<project>/<project>.env && sudo chmod 0640 /etc/<project>/<project>.env`
4. В unit-файле: `EnvironmentFile=/etc/<project>/<project>.env` → `systemctl daemon-reload` → restart.
5. Убедиться, что код читает из окружения (или указать dotenv-path на новый файл, если используется `load_dotenv`).
6. Оставить `*.env.example` в репо; при необходимости подчистить `.env` из git-истории.

## Adaptation notes (от адоптеров)

Уроки из реальных миграций — для будущих проектов, применяющих #008:

1. **Dual-consumer (systemd + dotenv-CLI) → симлинк, а не «убрать целиком»** *(MatricaRMZ, 2026-05-30).* Если секреты на проде читает И systemd (`EnvironmentFile=`), И dotenv-скрипты из cwd (релизные `db:migrate`, seed, и т.п. через `import 'dotenv/config'`), то простое удаление in-tree `.env` ломает CLI-шаг релиза. Решение: `/etc/<project>/<project>.env` = single source of truth + **in-tree `.env` → симлинк на него**. Тогда `dotenv` идёт по симлинку, `git clean -fdx` сносит ссылку (а не секрет), кода/runbook менять не надо. Тонкость: сам сервис не упал бы и без симлинка (`EnvironmentFile` инжектит env до `dotenv`, который не перезаписывает заданное) — симлинк нужен именно ради ручных CLI без systemd-env.
2. **Next.js: проверять И runtime, И build-путь к env** *(GONBA, 2026-05-30).* Next.js автозагружает `.env` из cwd **на build'е** (печёт `NEXT_PUBLIC_*` + prerender с подключением к БД). После выноса `.env` из дерева build-автозагрузка ломается, даже если runtime-юнит починен. Фикс: явный `systemd-run -p EnvironmentFile=/etc/<project>/<project>.env` для transient build-юнита (тот же парсер, что у runtime — кавычки/спецсимволы совпадают). Дешёвый pre-check без утечки значений: transient unit печатает `${VAR:+set}`.
3. **Установленные прод-юниты — копии, дрейфуют от репо.** И GONBA, и MatricaRMZ нашли inline `Environment=`/пути, которых нет в репо-версии юнита → правили `sed`'ом in-place, а не `cp` из репо (перезатёрло бы prod-only vars). Репо = source of truth, но прод-копии править осознанно.
4. **Stale `.env.bak*` мимо `.gitignore`** *(MatricaRMZ).* Паттерн `.env` в `.gitignore` НЕ ловит `.env.bak-20260520`/`.env.bak-pre-X` → их мог захватить `git add -A`. При миграции: `find -name '.env*bak*'` + удалить + ужесточить `.gitignore` (`.env.bak*`, `.env.*.bak*`).

## Связано

- Pool [#001 isolated deploy SSH key](001-isolated-deploy-ssh-key.md) — тоже про изоляцию секретов (ключей), смежная гигиена.
- [ADR-0002 PR-only flow](../../adr/0002-pr-only-flow-no-direct-push.md) — миграция оформляется веткой + PR.
- Письмо-источник: `setka/mailbox/to-brain/2026-05-28-secrets-outside-repo-pattern.md`.
