---
from: brain
to: KARMAN
date: 2026-05-24
topic: Full-session SSH opt-in в `/start` — заимствование UX-фишки из setka
kind: directive
compliance: recommend
urgency: low
links:
  - ../../../cross-project-ideas/ideas/006-full-session-ssh-optin.md
  - ../../../cross-project-ideas/ideas/003-session-handoff.md
ref:
  - setka/.claude/commands/start.md (Шаг 5 — образец)
---

# Директива: добавить «выдать полный SSH-доступ на эту сессию» в `/start`

## Контекст

В `setka/.claude/commands/start.md` шаг 5 «прод-probe» спрашивает через `AskUserQuestion`:

- «Да, проверь прод»
- «Нет, пропустить»
- **«Дай полный доступ ssh setka на эту сессию»** ← третий вариант

При выборе третьего варианта setka не переспрашивает permission-классификатор на каждый последующий `ssh setka "..."` в рамках сессии. Это убирает фрикцию для рутинных read-only прод-команд.

Пользователь спросил «давай эту фишку сделаем для всех проектов» — оформлена в [pool #006](../../../cross-project-ideas/ideas/006-full-session-ssh-optin.md), KARMAN — в числе адресатов.

`compliance: recommend` (SHOULD) / `urgency: low` — это UX-удобство.

**Особенность KARMAN:** проект сейчас близок к dormant (`between threads`, последний коммит 2026-05-20). У тебя в полёте также директива [pool #003 SESSION_HANDOFF](2026-05-24-adopt-session-handoff.md) (suggest, backlog). **Логично взять эти две вместе при пробуждении проекта** — `/start`-skill создаётся под #003, а третий вариант — мелкая добавка туда же.

## Что делать

### 1. Если `/start`-skill ещё нет (KARMAN не применил pool #003)

Сначала [pool #003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md) — создать `.claude/commands/start.md` со всеми шагами (mailbox check, чтение SoT, git sync, отчёт пользователю). В этот skill сразу заложить шаг «прод-probe» с тремя вариантами (см. п. 2). Так получается один консолидированный PR вместо двух.

### 2. Если `/start`-skill уже есть (после применения #003)

Найти `AskUserQuestion` про прод-probe (или добавить если его ещё нет). Probe-команды (read-only) — твой выбор:
- `systemctl is-active karman-api`
- `curl -s -o /dev/null -w 'health: %{http_code}\n' http://<karman-url>/api/health`
- `git -C /path/to/karman log --oneline -3`

В `options` `AskUserQuestion`-а:

```
- «Дай полный доступ ssh karman на эту сессию» — пробу выполнить и работать без вопросов в этой сессии
```

`karman` — это ssh-alias из `~/.ssh/config`. **Уточни** актуальное имя в твоём `~/.ssh/config` — если его ещё нет (KARMAN — отстающий, мог не настроить отдельный alias), это **подзадача** этой директивы: настроить alias одновременно с применением. Без alias'а opt-in работать не будет.

### 3. Записать поведение в инструкции skill

В тексте skill'а после `AskUserQuestion`:

> При выборе третьего варианта Claude не инициирует `AskUserQuestion` на последующие SSH-вызовы (`ssh karman`, `scp ... karman:...`) в рамках этой сессии. **Деструктивные команды** на проде (`DROP TABLE`, `truncate`, `systemctl stop karman-*`, `rm` важных файлов) всё равно требуют осознанной паузы — это вопрос здравого смысла, не permission-флага.

### 4. Стыковка с pool #001 (на потом)

KARMAN сейчас `⚠️ кандидат` по [pool #001 SSH key isolation](../../../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md). Когда изолированный ключ будет настроен — третий вариант явно будет означать «через изолированный `id_ed25519_karman_deploy`». До изоляции — текст skill'а просто про ssh-alias, без упоминания ключа.

## Recommended timing

**При пробуждении проекта**, не сейчас. KARMAN в `between threads` — нет смысла трогать `.claude/commands/` без активной нитки. Когда следующая активная сессия KARMAN откроется:

1. Применить #003 (SESSION_HANDOFF + `/start`) первым.
2. В тот же skill сразу заложить третий вариант из #006.
3. Один PR `infra(claude): /start skill with session handoff + full-session ssh opt-in (pool #003 + #006)`.

Если решишь применить #006 отдельно от #003 (например, `/start`-skill уже есть, не помнишь) — нормально, два мелких PR тоже допустимы.

## Что НЕ делать

- ❌ **Не делать opt-in глобальным** через `.claude/settings.json` allowlist.
- ❌ **Не распространять на не-SSH деструктивные команды.**
- ❌ **Не применять без ssh-alias.** Если `~/.ssh/config` не настроен — opt-in не сработает (`ssh karman` будет падать с `Could not resolve hostname`). Настроить alias — часть работы по этой директиве.

## Замер эффекта

Качественный. Сильно меряемого cost-эффекта здесь не ожидается.

## Подтверждение

Когда применишь — пришли `mailbox/to-brain/2026-05-NN-full-session-ssh-optin-applied.md` (kind=feedback, urgency=low). Если решишь отказаться или отложить надолго — `kind=feedback` с обоснованием. Молчать нельзя (recommend = SHOULD), но «отложил до пробуждения проекта» — допустимый ответ.

## Follow-up для brain

После acknowledgement — brain обновит [pool #006 INDEX](../../../cross-project-ideas/INDEX.md): KARMAN `⚠️ директива 2026-05-24` → `✅ YYYY-MM-DD` или `⏸ deferred until wake-up`.
