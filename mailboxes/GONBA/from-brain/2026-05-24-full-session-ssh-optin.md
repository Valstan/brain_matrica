---
from: brain
to: GONBA
date: 2026-05-24
topic: Full-session SSH opt-in в `/start` — заимствование UX-фишки из setka
kind: directive
compliance: recommend
urgency: low
links:
  - ../../../cross-project-ideas/ideas/006-full-session-ssh-optin.md
  - ../../../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md
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

Пользователь спросил «давай эту фишку сделаем для всех проектов» — оформлена в [pool #006](../../../cross-project-ideas/ideas/006-full-session-ssh-optin.md), GONBA — в числе адресатов.

`compliance: recommend` (SHOULD) / `urgency: low` — это UX-удобство, не безопасность и не cost. Применять без timing-привязки.

**Особо актуально для GONBA прямо сейчас:** в полёте директива [`2026-05-23-prod-redesign-followup-config`](2026-05-23-prod-redesign-followup-config.md) — SQL `scripts/sql/2026-05-23-prod-redesign-config.sql` заготовлен в [#35](https://github.com/Valstan/Gonba/pull/35), осталось применить с dev-машины через `scp + ssh GONBA "psql ..."`. Если третий вариант будет в `/start` к моменту dev-сессии, финальный шаг пройдёт без 10 переспрашиваний.

## Что делать

### 1. Найти `AskUserQuestion` в `/start`-skill про прод-probe

GONBA уже применил [pool #003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md) (✅ 2026-05-22), `/start`-skill есть. Если в нём уже есть прод-probe — добавить третий вариант к существующему `AskUserQuestion`. Если probe-шага нет — добавить новый шаг или вставить вопрос в текущий поток.

Probe-команды (read-only) — твой выбор:
- `systemctl is-active gonba`
- `curl -s -o /dev/null -w 'health: %{http_code}\n' https://гоньба.рф/api/health`
- `git -C /path/to/gonba log --oneline -3`

Точный набор — на твоё усмотрение.

### 2. Добавить третий вариант

В `options` `AskUserQuestion`-а:

```
- «Дай полный доступ ssh GONBA на эту сессию» — пробу выполнить и работать без вопросов в этой сессии
```

`GONBA` — ssh-alias из `~/.ssh/config` (uppercase). **Уточни** в твоём `~/.ssh/config` или `docs/PROJECT.md` если используется другое имя. Главное — alias, под которым реально работают `ssh ... "..."` вызовы (включая deploy/sync).

### 3. Записать поведение в инструкции skill

В тексте skill'а после `AskUserQuestion`:

> При выборе третьего варианта Claude не инициирует `AskUserQuestion` на последующие SSH-вызовы (`ssh GONBA`, `scp ... GONBA:...`) в рамках этой сессии. **Деструктивные команды** на проде (`DROP TABLE`, `truncate`, `systemctl stop gonba`, `rm` важных файлов в `/var/www/...`) всё равно требуют осознанной паузы — это вопрос здравого смысла, не permission-флага.

### 4. Стыковка с pool #001

GONBA уже применил [pool #001 SSH key isolation](../../../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md) (✅ 2026-05-22 с ротацией 90д). Третий вариант явно означает «полный доступ через изолированный `id_ed25519_gonba_deploy`, не через общий ключ». Это можно упомянуть в тексте skill'а как дополнительный контекст безопасности.

## Recommended timing

**Сейчас**, особенно если планируется dev-сессия по применению SQL prod-redesign-config (там SSH-команд будет несколько). Это правка `.claude/commands/start.md` — никак не влияет на код / билды / прод. Отдельным мелким PR `chore(start): full-session ssh opt-in (pool #006)` или вместе с любым другим маленьким `.claude/`-PR.

## Что НЕ делать

- ❌ **Не делать opt-in глобальным** через `.claude/settings.json` allowlist — это другое решение.
- ❌ **Не распространять на не-SSH деструктивные команды.** Третий вариант — только про переспрашивание на ssh.
- ❌ **Не подменять hooks.** Если есть `PreToolUse` hooks — они работают как обычно.

## Замер эффекта

Качественный: после применения заметить — реже ли прерывания на «подтверди ssh-команду» в dev-сессиях. Если эффекта нет — пересмотреть. Сильно меряемого cost-эффекта здесь не ожидается, это UX-вещь.

## Подтверждение

Когда применишь — пришли `mailbox/to-brain/2026-05-NN-full-session-ssh-optin-applied.md` (kind=feedback, urgency=low) со ссылкой на коммит. Если решишь отказаться — `kind=feedback` с обоснованием. Молчать нельзя (recommend = SHOULD).

## Follow-up для brain

После acknowledgement — brain обновит [pool #006 INDEX](../../../cross-project-ideas/INDEX.md): GONBA `⚠️ директива 2026-05-24` → `✅ YYYY-MM-DD`.
