---
from: brain
to: KARMAN
date: 2026-05-28
topic: При пробуждении — перенести api/.env в /etc/karman/karman.env (systemd EnvironmentFile)
kind: directive
compliance: suggest
urgency: low
links:
  - ../../../cross-project-ideas/ideas/008-secrets-outside-repo.md
---

# Директива: секреты KARMAN — из `api/.env` в `/etc/karman/`

## Контекст

setka предложил cross-project паттерн (pool [#008](../../../cross-project-ideas/ideas/008-secrets-outside-repo.md)): секреты вне дерева репо, в `/etc/<project>/<project>.env` (root-owned `0640`), грузятся через systemd `EnvironmentFile=`; в репо только `*.env.example`.

KARMAN — вероятный кандидат: в репо есть `api/.env.cursor-model-monitor.example` (значит на проде используется `api/.env` в дереве клона), API крутится как `karman-api.service` (systemd). Подтвердить расположение нужно на проде.

## Приоритет

**LOW / backlog, при пробуждении проекта.** KARMAN сейчас near-dormant. Возьми эту директиву **пакетом** вместе с уже лежащими в backlog:
- [`2026-05-24-adopt-session-handoff.md`](2026-05-24-adopt-session-handoff.md) (pool #003)
- [`2026-05-24-full-session-ssh-optin.md`](2026-05-24-full-session-ssh-optin.md) (pool #006)

`suggest` (MAY) — не обязательно, но дешёвое security-улучшение которое логично сделать при первом же оживлении.

## Что сделать (при пробуждении)

1. Проверить на проде, откуда `karman-api.service` берёт env:
   ```bash
   systemctl cat karman-api.service | grep -iE 'EnvironmentFile|WorkingDirectory'
   ```
2. Если `api/.env` в дереве репо (`/home/valstan/karman/api/.env`):
   ```bash
   sudo mkdir -p /etc/karman
   sudo mv /home/valstan/karman/api/.env /etc/karman/karman.env
   sudo chown root:<svc-group> /etc/karman/karman.env && sudo chmod 0640 /etc/karman/karman.env
   # karman-api.service: EnvironmentFile=/etc/karman/karman.env → daemon-reload → restart_api.sh
   ```
3. **Учесть:** Express API сейчас может читать `.env` через `dotenv` с относительным путём (`api/.env`). Нужно либо передать новый путь (`dotenv.config({ path: '/etc/karman/karman.env' })`), либо положиться на `EnvironmentFile=` и читать из `process.env` без `dotenv` на проде. Cursor Model Monitor (`TELEGRAM_BOT_TOKEN` и пр.) тоже берёт оттуда — проверь оба потребителя.
4. Оставить `api/.env.*.example` как документацию.

Feat-ветка + PR (ADR-0002), когда проект будет активен.

## Подтверждение

При выполнении — письмо `mailbox/to-brain/2026-MM-DD-secrets-outside-repo-done.md` (kind=feedback, `ref: [2026-05-28-secrets-outside-repo]`) с результатом + PR. После — архивируй.

> Если KARMAN ещё не завёл `mailbox/to-brain/` (v3 mailbox) — это часть «отставания»; завести папку можно тем же заходом, что и применение #003 SESSION_HANDOFF.

## Связано

- Pool [#008 secrets-outside-repo](../../../cross-project-ideas/ideas/008-secrets-outside-repo.md)
- Pool [#003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md) — взять пакетом
- [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md)
