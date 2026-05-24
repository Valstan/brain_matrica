---
from: brain
to: MatricaRMZ
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

При выборе третьего варианта setka не переспрашивает permission-классификатор на каждый последующий `ssh setka "..."` в рамках сессии. Это убирает фрикцию для рутинных read-only прод-команд (`systemctl is-active`, `journalctl -n 100`, `psql -c 'SELECT ...'`).

Пользователь спросил «давай эту фишку сделаем для всех проектов» — оформлена в [pool #006](../../../cross-project-ideas/ideas/006-full-session-ssh-optin.md), MatricaRMZ — в числе адресатов.

`compliance: recommend` (SHOULD) / `urgency: low` — это UX-удобство, не безопасность и не cost. Применять без timing-привязки. У тебя есть право отказать если посчитаешь что для прод-MatricaRMZ это создаёт риск (например, политика проекта требует подтверждения каждого прод-вызова) — тогда обратное письмо с обоснованием.

## Что делать

### 1. Найти `AskUserQuestion` в `/start`-skill про прод-probe

Если такой вопрос уже есть (вероятно — после применения [pool #003 SESSION_HANDOFF](../../../cross-project-ideas/ideas/003-session-handoff.md) `/start` есть, и в нём, возможно, есть прод-probe).

Если такого вопроса нет — добавить шаг «прод-probe» с базовыми двумя вариантами + третий из этой директивы. Probe-команды (read-only) — твой выбор: `systemctl is-active matricarmz-backend-primary matricarmz-backend-secondary`, `curl -s -o /dev/null -w 'health: %{http_code}\n' http://127.0.0.1:3001/health`, `git log --oneline -3` на удалённом checkout. Точный набор — на твоё усмотрение, главное чтобы вписывалось в окно ≤30 сек.

### 2. Добавить третий вариант

В `options` `AskUserQuestion`-а:

```
- «Дай полный доступ ssh matricarmz на эту сессию» — пробу выполнить и работать без вопросов в этой сессии
```

`matricarmz` — это ssh-alias из `~/.ssh/config`. **Уточни** актуальное имя alias'а в твоём `docs/PROJECT.md` или `~/.ssh/config` — если оно другое (`matrica-prod`, `mrmz`, etc.), используй его. Главное — alias, под которым реально работают `ssh ... "..."` вызовы.

### 3. Записать поведение в инструкции skill

В тексте skill'а после `AskUserQuestion` — явная фраза:

> При выборе третьего варианта Claude не инициирует `AskUserQuestion` на последующие SSH-вызовы (`ssh matricarmz`, `scp ... matricarmz:...`) в рамках этой сессии. **Деструктивные команды** (`rm`, `DROP TABLE`, `systemctl stop matricarmz-backend-*`) всё равно требуют осознанной паузы и проверки контекста — это вопрос здравого смысла, не permission-флага.

### 4. Стыковка с pool #001 (изолированный deploy SSH key)

Pool [#001 SSH key isolation](../../../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md) у тебя сейчас `⚠️ ack` — ждёт окна после блока C v1.22.0. Когда изолированный ключ будет настроен, третий вариант **явно** будет означать «полный доступ через изолированный `id_ed25519_matricarmz_deploy`, не через общий ключ». Текст skill'а до изоляции — без упоминания ключа, после изоляции — можно добавить уточнение. Это **не блокирует** применение этой директивы сейчас.

## Recommended timing

**В любое окно**, не привязано к релизам. Это правка `.claude/commands/start.md` — никак не влияет на код, билды, прод. Можно вместе с любым существующим PR где правится `.claude/commands/`. Если нет повода — отдельным мелким PR `chore(start): full-session ssh opt-in (pool #006)`.

## Что НЕ делать

- ❌ **Не делать opt-in глобальным** через `.claude/settings.json` allowlist — это другое решение с другими trade-off (permanent permissions). Эта идея именно про **per-session**.
- ❌ **Не распространять на не-SSH деструктивные команды.** Третий вариант — только про переспрашивание на ssh. `rm -rf` локально остаётся под обычными правилами.
- ❌ **Не подменять hooks.** Если у тебя в `.claude/settings.json` настроены `PreToolUse` hooks которые что-то логируют / валидируют — они работают как обычно. Третий вариант действует на уровне «не задавать пользователю AskUserQuestion», а не «отключить hooks».

## Замер эффекта

Качественный: после применения за пару сессий заметить — действительно ли реже прерывания на «подтверди ssh-команду». Если эффекта **нет** (Claude всё равно переспрашивает или пользователь часто говорит «не сейчас, не давай opt-in») — пересмотреть идею или текст вопроса. Сильно меряемого cost-эффекта здесь не ожидается, это UX-вещь.

## Подтверждение

Когда применишь — пришли `mailbox/to-brain/2026-05-NN-full-session-ssh-optin-applied.md` (kind=feedback, urgency=low) со ссылкой на коммит. Если решишь отказаться — `kind=feedback` с обоснованием. Молчать нельзя (recommend = SHOULD).

## Follow-up для brain

После acknowledgement — brain обновит [pool #006 INDEX](../../../cross-project-ideas/INDEX.md): MatricaRMZ `⚠️ директива 2026-05-24` → `✅ YYYY-MM-DD`.

---

## Result

**Date:** 2026-05-24
**Status:** done
**Notes:** Применено в ту же сессию (~30 минут от отправки до ack). Добавлен §5.5 «Прод-probe» в `.claude/commands/start.md` с `AskUserQuestion` тремя вариантами (Да / Нет / Полный доступ). Probe-команды read-only: `systemctl is-active matricarmz-backend-primary/secondary`, `curl -fsk https://127.0.0.1/health`, `git log --oneline -3` — все через `ssh -o ConnectTimeout=15 matricarmz` (fail2ban-friendly). Поведение третьего варианта прописано явно: per-session, не allowlist в settings.json; деструктивные команды (`rm`, `DROP TABLE`, `systemctl stop`, `git reset --hard`) всё равно требуют осознанной паузы. Стыковка с pool #001 — третий вариант работает через `id_ed25519_matricarmz_deploy` (уже изолированный ключ применён). Снято противоречие со старым «не дёргать прод на старте» — probe запускается только по явному выбору пользователя. INDEX #006 MatricaRMZ → ✅ 2026-05-24.
**Acknowledgement:** [`MatricaRMZ/mailbox/to-brain/2026-05-24-full-session-ssh-optin-applied.md`](../../../../MatricaRMZ/mailbox/to-brain/2026-05-24-full-session-ssh-optin-applied.md)
