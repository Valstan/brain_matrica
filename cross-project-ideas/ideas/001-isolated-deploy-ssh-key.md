---
name: isolated-deploy-ssh-key
title: Изолированный per-project SSH-deploy-ключ
description: Отдельный SSH-ключ на каждый прод-сервер, чтобы утечка одного не давала доступ ко всем
status: active
created: 2026-05-22
last_updated: 2026-05-22
implemented_in:
  - setka: 2025 (точную дату не нашёл, `id_ed25519_setka_prod` уже в `~/.ssh/config`)
  - GONBA: 2026-05-22 (эта сессия) — ключ `id_ed25519_gonba_deploy`
applicable_when:
  - У проекта есть прод-сервер с SSH-доступом
  - Используется CI deploy через SSH (или планируется)
  - Один и тот же ключ авторизован на нескольких серверах (общий blast radius)
not_applicable_when:
  - Проект без прод-сервера / без SSH-деплоя
  - Сервер один-единственный во всей инфраструктуре пользователя (изоляция бессмысленна — все так и так на одном ключе)
not_applicable_for:
  # формат: ProjectName: причина
---

# Изолированный per-project SSH-deploy-ключ

## Проблема

Когда один SSH-ключ (`~/.ssh/id_ed25519`) авторизован на нескольких прод-серверах, утечка этого ключа = компрометация всех серверов разом. Это амплифицирует blast radius любой утечки (GitHub Action secrets, потерянный ноут, скомпрометированный CI runner).

В частности, для GONBA: ключ был общим с MatricaRMZ, и `SSH_PRIVATE_KEY` в GitHub Action secrets открывал ВСЁ.

## Решение

На каждом сервере — свой ключ:

```
~/.ssh/id_ed25519                  # личный fallback / для разных мелочей
~/.ssh/id_ed25519_<project>_deploy # на конкретный сервер проекта
```

В `~/.ssh/config`:
```
Host <project-alias>
  HostName ...
  IdentityFile ~/.ssh/id_ed25519_<project>_deploy
  IdentitiesOnly yes
```

GitHub Action secret хранит **только** этот изолированный ключ.

В `~/.ssh/authorized_keys` на сервере — оставляем только тот ключ, который реально нужен для входа на этот сервер. Старый общий ключ — убрать.

## Шаги внедрения

1. `ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_<proj>_deploy -N '' -C '<proj>-deploy@<machine>'`
2. `cat ~/.ssh/id_ed25519_<proj>_deploy.pub` → залить на сервер в `~/.ssh/authorized_keys` (через текущий SSH).
3. Обновить `~/.ssh/config` — alias теперь использует новый ключ.
4. Проверить: `ssh <alias> echo ok` — должен пускать без пароля.
5. Удалить старый общий ключ из `authorized_keys` на этом сервере (DESTRUCTIVE — спросить пользователя). Проверить вход ещё раз.
6. Если есть GitHub Action deploy — обновить secret: `gh secret set SSH_PRIVATE_KEY --repo <owner>/<repo> < ~/.ssh/id_ed25519_<proj>_deploy`.
7. Триггернуть `workflow_dispatch` чтобы убедиться что CI всё ещё работает.
8. Зафиксировать дату в `docs/PROJECT.md` (для напоминаний про ротацию — см. [[002-ssh-deploy-key-rotation]]).

## Подводные камни

- **Удаление старого ключа из authorized_keys** — DESTRUCTIVE. Если новый ключ не работает, можно потерять доступ. Всегда:
  - сначала проверь `ssh <alias> echo ok` с НОВЫМ ключом
  - имей backup-доступ (web-console у хостера, например jino.ru у нас есть)
  - не делай удаление и тест одновременно
- **GH secret не виден после установки.** Если потом забудешь какой ключ туда залит — нет способа узнать кроме как пересоздать. Поэтому веди запись дат в `docs/PROJECT.md`.
- **Локальный приватный ключ** оставляется на диске разработчика (это нормально). Утечка диска = ротация. См. [[002-ssh-deploy-key-rotation]] про регулярную ротацию.
- **Несколько dev-машин** — на каждой свой ключ, public добавляется в `authorized_keys` отдельной строкой. Не пересылай приватный ключ между машинами.

## История

- **setka**: ключ был изолирован сразу (с самого начала проекта).
- **GONBA**: ключ был общий с MatricaRMZ. В сессии 2026-05-22 изолирован — `id_ed25519_gonba_deploy`. Старый общий ключ убран из authorized_keys на GONBA-сервере.
- **MatricaRMZ**: всё ещё на общем `id_ed25519`. 2026-05-23 brain направил директиву в [`mailboxes/MatricaRMZ/from-brain/2026-05-23-isolate-ssh-deploy-key.md`](../../mailboxes/MatricaRMZ/from-brain/2026-05-23-isolate-ssh-deploy-key.md) (compliance=recommend) — применить в окне между релизами BOM-refactor.
- **KARMAN**: применимо (есть прод-сервер + `karman-api.service`), не оценено в сессии проекта. ⚠️ кандидат.
