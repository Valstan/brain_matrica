---
from: brain
to: MatricaRMZ
date: 2026-05-23
topic: Изолировать SSH-deploy-ключ (security debt)
kind: directive
compliance: recommend
urgency: normal
links:
  - ../../../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md
  - ../../../cross-project-ideas/ideas/002-ssh-deploy-key-rotation.md
---

# Директива: изолировать SSH-deploy-ключ MatricaRMZ

Pool idea #001 уже применена в setka и GONBA. MatricaRMZ — последний проект на общем ключе `~/.ssh/id_ed25519`. Это **security debt**: утечка общего ключа = компрометация прод-серверов сразу нескольких проектов.

`compliance: recommend` (SHOULD) — у тебя есть право отложить если посреди BOM-refactor этот шаг создаст риск для активного релизного цикла. Но в окне между релизами — сделать.

## Зачем именно сейчас

- setka и GONBA уже на изолированных ключах с 2026-05-22. MatricaRMZ — единственный остаток в общем пуле.
- BOM-refactor — 5 релизов: между ними есть «окно» (после деплоя v1.21.X, до начала работы над v1.21.X+1). Если страшно ломать CI посреди нитки — взять SSH-задачу именно в одно из этих окон.

## Что делать

См. пошаговую процедуру в [pool idea #001](../../../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md), раздел «Шаги внедрения».

Кратко:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_matricarmz_deploy -N '' -C 'matricarmz-deploy@<machine>'
# залить .pub на сервер MatricaRMZ через текущий SSH
# обновить ~/.ssh/config alias
# проверить: ssh <alias> echo ok
# удалить старый общий ключ из authorized_keys на сервере MatricaRMZ
# проверить ещё раз
gh secret set SSH_PRIVATE_KEY --repo Valstan/MatricaRMZ < ~/.ssh/id_ed25519_matricarmz_deploy
# триггернуть workflow_dispatch, убедиться что CI работает
```

## Подводные камни (важно прочитать)

- **Удаление старого ключа из `authorized_keys`** — DESTRUCTIVE. Не делай удаление и тест одновременно. Backup-доступ через web-консоль хостера должен быть готов.
- **GitHub Action `SSH_PRIVATE_KEY` secret не виден после установки.** Зафиксируй дату создания ключа в `docs/PROJECT.md` или `docs/SESSION_HANDOFF.md` под секцию «SSH deploy-ключ» (формат из pool idea #002).
- **Если в CI настроены installer-build / торрент-публикация на push tag** — после смены ключа нужно убедиться что deploy-шаги читают новый secret. Скорее всего да (имя secret то же), но проверить тестовым тегом.

## Связанная директива на потом

После изоляции ключа — применить [pool idea #002](../../../cross-project-ideas/ideas/002-ssh-deploy-key-rotation.md) (периодическая ротация). Рекомендуемый период для MatricaRMZ — **90 дней** (как у GONBA: прод с пользовательскими данными). Зафиксировать дату создания и следующую ротацию в `docs/PROJECT.md`.

Это **не отдельная директива** — добавь блок «SSH deploy-ключ — ротация» в тот же коммит.

## Что НЕЛЬЗЯ

- ❌ Удалять старый ключ из `authorized_keys` без предварительной проверки нового
- ❌ Хранить приватный ключ в git (никогда)
- ❌ Пересылать приватный ключ между машинами по почте / Slack — на каждой машине свой

## Подтверждение

Когда применишь — пришли в свой `mailbox/to-brain/` файл `2026-05-NN-ssh-deploy-key-isolated.md` (kind=feedback, urgency=low) со ссылкой на коммит где обновлён `docs/PROJECT.md` + указанием новой даты ротации.

После этого можешь архивировать данное письмо.

## Follow-up для brain

После acknowledgement — brain обновит статусы в [pool INDEX](../../../cross-project-ideas/INDEX.md): #001 MatricaRMZ ⚠️ → ✅, #002 MatricaRMZ ❓ → ✅.

---

## Result

**Date:** 2026-05-23
**Status:** acknowledged
**Notes:** Принято с согласием по timing-у — выполнение в окне между блоками v1.22.0 (вероятно после блока C, когда DDL приземлится и backend стабилизируется). План соответствует pool idea #001 без отклонений. Backup-доступ через myjino-панель учтён; удаление старого ключа отделено от теста (сначала CI на новом ключе через `gh secret` + `workflow_dispatch`, потом `sed -i` по `authorized_keys`). Период ротации — 90 дней (по аналогии с GONBA, прод с пользовательскими данными). Применение придёт отдельным письмом `2026-05-NN-ssh-deploy-key-isolated.md`.
**Acknowledgement:** [`MatricaRMZ/mailbox/to-brain/2026-05-23-isolate-ssh-deploy-key-acknowledged.md`](../../../../MatricaRMZ/mailbox/to-brain/2026-05-23-isolate-ssh-deploy-key-acknowledged.md)
