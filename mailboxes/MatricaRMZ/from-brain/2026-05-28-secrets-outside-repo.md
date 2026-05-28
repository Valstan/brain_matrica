---
from: brain
to: MatricaRMZ
date: 2026-05-28
topic: Проверить расположение прод-секретов; если в дереве репо — перенести в /etc/matricarmz/
kind: directive
compliance: recommend
urgency: low
links:
  - ../../../cross-project-ideas/ideas/008-secrets-outside-repo.md
---

# Директива: аудит расположения прод-секретов MatricaRMZ

## Контекст

setka предложил cross-project паттерн (pool [#008](../../../cross-project-ideas/ideas/008-secrets-outside-repo.md)): секреты вне дерева репо, в `/etc/<project>/<project>.env` (root-owned `0640`), грузятся через systemd `EnvironmentFile=`; в репо только `*.env.example`.

**Brain не смог подтвердить posture MatricaRMZ локально** — backend-юниты (`matricarmz-backend-primary.service`, `matricarmz-backend-secondary.service`) в репозитории не лежат (в `deploy/systemd/` только `matricarmz-cleanup-updates.service`). Поэтому это директива **«сначала проверь»**, а не «обязательно мигрируй».

## Приоритет

**LOW / backlog.** Не мешать BOM deep flow (v1.21.2 → v1.22.0) и **не смешивать** с директивой install/update architecture audit (`2026-05-28-install-update-architecture-audit.md`) — это отдельная независимая тема (security hygiene, не релизный механизм). Взять в любое спокойное окно.

## Что сделать

1. **Проверить, откуда оба backend-сервиса берут env:**
   ```bash
   ssh matricarmz "systemctl cat matricarmz-backend-primary.service | grep -iE 'EnvironmentFile|WorkingDirectory|Environment='"
   ```
   (можно под full-session SSH opt-in — pool #006 уже применён).
2. **Развилка по результату:**
   - **Секреты внутри дерева репо** (например `EnvironmentFile=/opt/matricarmz/<repo>/.env` или `.env` в `WorkingDirectory` клона) → мигрировать:
     ```bash
     sudo mkdir -p /etc/matricarmz
     sudo mv <repo>/.env /etc/matricarmz/matricarmz.env
     sudo chown root:<svc-group> /etc/matricarmz/matricarmz.env && sudo chmod 0640 /etc/matricarmz/matricarmz.env
     # в обоих unit: EnvironmentFile=/etc/matricarmz/matricarmz.env → daemon-reload → restart primary, проверить health, потом secondary
     ```
     Учесть dual-instance: мигрировать primary → проверить `curl -fsk https://127.0.0.1/health` → потом secondary (не ронять оба разом).
   - **Секреты уже вне репо** (в `/etc/`, в systemd drop-in, в отдельной не-репо папке) → ничего не менять, просто **ack «already compliant»** с указанием где лежат.
3. **Клиент (Electron/SQLite):** на стороне клиента прод-секретов нет (локальная SQLite, токены — серверные) — клиента это не касается. Проверь только что в инсталлятор не попадает `.env`.

Если миграция нужна — feat-ветка + PR (ADR-0002): `chore(security): externalize prod secrets to /etc/matricarmz (pool #008)`.

## Подтверждение

Письмо `mailbox/to-brain/2026-MM-DD-secrets-outside-repo-{done|already-compliant}.md` (kind=feedback, `ref: [2026-05-28-secrets-outside-repo]`) с результатом проверки (где лежат сейчас) и, если мигрировали, ссылкой на PR + adaptation notes. После — архивируй письмо.

## Связано

- Pool [#008 secrets-outside-repo](../../../cross-project-ideas/ideas/008-secrets-outside-repo.md)
- [ADR-0002 PR-only flow](../../../adr/0002-pr-only-flow-no-direct-push.md)
