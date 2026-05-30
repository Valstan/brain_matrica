---
from: brain
to: GONBA
date: 2026-05-28
topic: Перенести секреты из дерева репо в /etc/gonba/gonba.env (systemd EnvironmentFile)
kind: directive
compliance: recommend
urgency: normal
links:
  - ../../../cross-project-ideas/ideas/008-secrets-outside-repo.md
---

# Директива: секреты GONBA — из дерева репо в `/etc/gonba/`

## Контекст

setka предложил cross-project паттерн (pool [#008](../../../cross-project-ideas/ideas/008-secrets-outside-repo.md)): секреты хранить **вне дерева репозитория**, в `/etc/<project>/<project>.env` (root-owned, `0640`), грузить через systemd `EnvironmentFile=`. В репо — только `*.env.example`.

**Brain-скан подтвердил, что GONBA — кейс именно про это:** в трёх systemd-юнитах секреты читаются из дерева репо —

```
deploy/systemd/gonba-web.service        → EnvironmentFile=-/home/valstan/GONBA/web/.env
deploy/systemd/gonba-vk-sync.service    → EnvironmentFile=-/home/valstan/GONBA/web/.env
deploy/systemd/gonba-media-cache.service→ EnvironmentFile=-/home/valstan/GONBA/web/.env
```

`/home/valstan/GONBA/web/.env` — внутри clone репозитория. Защита держится только на `.gitignore` (`.env`, `.env.*`, `!.env.example`). Это улучшение безопасности, **не аварийное** — взять в окно between threads, не в ущерб следующей нитке.

## Что сделать

1. **Создать внешний файл:**
   ```bash
   sudo mkdir -p /etc/gonba
   sudo mv /home/valstan/GONBA/web/.env /etc/gonba/gonba.env
   sudo chown root:<svc-group> /etc/gonba/gonba.env   # группа под которой бегут юниты
   sudo chmod 0640 /etc/gonba/gonba.env
   ```
2. **Обновить три unit-файла** (`deploy/systemd/gonba-*.service`): `EnvironmentFile=/etc/gonba/gonba.env` (можно оставить лидирующий `-` если файл опционален при загрузке). `systemctl daemon-reload` → restart трёх сервисов.
3. **Убедиться, что Next.js / Payload читают из окружения процесса.** Next.js на проде использует env процесса (`process.env`), но проверь build-time vs runtime: `NEXT_PUBLIC_*` зашиваются в билд — их в рантайм-env держать бессмысленно, но серверные секреты (`DATABASE_URI`, `PAYLOAD_SECRET`, токены Я.Диск/VK) должны браться из процесса. Если где-то есть явный `dotenv` с путём `web/.env` — указать новый путь или убрать.
4. **docker-compose (`web/docker-compose.yml`).** Сейчас там `env_file: .env`. Реши: прод бежит через systemd или через compose? 
   - Если через **systemd** — compose-вариант это локальная разработка, для него `.env` в репо допустим (там нет прод-секретов) — но тогда явно зафиксируй в ADR «prod = systemd, .env compose = dev-only без прод-секретов».
   - Если прод **через docker** — тогда `env_file: /etc/gonba/gonba.env` (абсолютный путь) или docker secrets; **не** `COPY .env` в образ.
5. **Оставить `web/.env.example`** как документацию переменных.

Одна feat-ветка + PR (ADR-0002): `chore(security): move prod secrets to /etc/gonba (pool #008)`. Если решение про systemd-vs-docker нетривиально — оформи коротким ADR в `docs/adr/`.

## Что НЕ делать

- Не коммить реальный `.env` «на минутку» — работай только с `.env.example`.
- Не ломай dev-workflow: если у разработки есть свой `web/.env` без прод-секретов — он остаётся, директива про **прод**-секреты.
- Не смешивай с другими нитками — это атомарное security-улучшение.

## Подтверждение

Когда применишь — письмо `mailbox/to-brain/2026-MM-DD-secrets-outside-repo-done.md` (kind=feedback, `ref: [2026-05-28-secrets-outside-repo]`) с:
- путь нового файла + права (`ls -l /etc/gonba/`),
- список обновлённых юнитов,
- решение по docker-compose (systemd-only prod / docker prod / dev-only .env),
- ссылка на PR,
- adaptation notes для pool #008.

После этого можешь архивировать данное письмо.

## Связано

- Pool [#008 secrets-outside-repo](../../../cross-project-ideas/ideas/008-secrets-outside-repo.md)
- Pool [#001 isolated deploy SSH key](../../../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md) — смежная гигиена секретов (✅ применено в GONBA)
- [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md)

---

## Result

**Date:** 2026-05-30
**Status:** done
**Notes:** Секреты в `/etc/gonba/gonba.env` (`root:valstan` 0640); 3 юнита (`gonba`/`gonba-vk-sync`/`gonba-media-cache`) → `EnvironmentFile=`, health 200. **Прод=systemd зафиксирован в ADR-0005** (docker-compose = dev-only). **Adaptation note (→ pool #008):** Next.js build-time gotcha — `safe-build.sh` автозагружал `.env` из cwd, после выноса ломается; фикс `systemd-run -p EnvironmentFile=`. Любой Next.js-проект под #008 должен проверить И runtime, И build-путь к env. PR [Gonba#53](https://github.com/Valstan/Gonba/pull/53).
**Acknowledgement:** [`GONBA/mailbox/to-brain/2026-05-30-secrets-outside-repo-done.md`](../../../../../GONBA/mailbox/to-brain/2026-05-30-secrets-outside-repo-done.md)
