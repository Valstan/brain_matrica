# Заявка #0007: 🔴 Security — ключи MatricaRMZ + setka в `authorized_keys` GONBA-сервера

> 🧠 **Заявка от brain_matrica.** Сформулирована meta-сессией, у которой нет полного контекста этого проекта (видит только git log, CLAUDE.md, SESSION_HANDOFF, PENDING_FOLLOWUPS — не видит код, тесты, work-in-progress).
>
> Это **предложение, не задача.** Проанализируй с точки зрения текущего состояния проекта: подходит ли структурно, не дублирует ли уже существующее, не утяжелит ли, есть ли побочные эффекты. Можешь отклонить без объяснений или вернуть встречное «вот как лучше».
>
> Источник: brain_matrica session 2026-05-22, найдено через project-auditor smoke-test (см. [briefing](../briefings/morning-2026-05-22.md)).

**Target:** GONBA
**Created:** 2026-05-22
**Status:** sent
**Приоритет:** 🔴 **Security — высокий**
**Связанные идеи pool:** #001 (изолированный per-project SSH-deploy-ключ)

## Контекст у brain_matrica

Project-auditor обнаружил в `GONBA/docs/PENDING_FOLLOWUPS.md` (приоритет 🟡):

> `authorized_keys` на GONBA-сервере содержит ключи `valstan@a6fd55b8e0ae` (MatricaRMZ) и `valstan@setka` — цепочка компрометации, требует решения

Brain_matrica поднимает приоритет **до 🔴** потому что:

1. **Это уже не «техдолг», а активный security risk.** Если скомпрометирован любой из MatricaRMZ-машин или setka-машин (украден ключ, заражение сервера, скомпрометирован VPS) — атакующий **автоматически получает доступ к GONBA-серверу** с полными правами `valstan`.
2. **Идея #001 (изолированный per-project SSH-deploy-ключ)** уже применена в GONBA для **новых** деплоев. Но **исторические ключи остались** — изоляция работает только для будущих, не для прошлого.
3. Сегодня — 2026-05-22, через 90 дней (2026-08-20) запланирована ротация по идее #002. **Не нужно ждать ротацию** — это другая операция (per-key replacement, не cleanup).

Brain_matrica **не видит**:
- Точный список ключей в `authorized_keys` GONBA-сервера (нужен SSH-обход)
- Когда эти ключи появились (исторический backfill при первой настройке? намеренный shared-access?)
- Не используется ли какой-то из ключей **активно** (cron-jobs, scripts, beat tasks) — удаление может что-то сломать

## Предложение

### Шаг 1: Inventory (5 минут)

```bash
ssh GONBA "cat ~/.ssh/authorized_keys"
```

Сопоставить каждый ключ с источником:
- Какой из них `id_ed25519_gonba_deploy.pub` (новый изолированный, **оставить**)
- Какой `valstan@a6fd55b8e0ae` (MatricaRMZ) — **удалить или ограничить**
- Какой `valstan@setka` — **удалить или ограничить**
- Что-то ещё (личный ключ с laptop'а, public-доступ для CI, etc.) — оценить

### Шаг 2: Удаление чужих ключей (10 минут)

```bash
# Backup
ssh GONBA "cp ~/.ssh/authorized_keys ~/.ssh/authorized_keys.backup-$(date +%Y%m%d)"

# Edit — оставить только нужные
ssh GONBA "vi ~/.ssh/authorized_keys"
# или sed:
ssh GONBA "sed -i '/valstan@a6fd55b8e0ae/d; /valstan@setka/d' ~/.ssh/authorized_keys"

# Проверка
ssh GONBA "cat ~/.ssh/authorized_keys | wc -l"
ssh GONBA "test -f ~/.ssh/authorized_keys && echo OK"
```

### Шаг 3: Smoke-test после изменения (5 минут)

- Заход с твоей текущей машины: `ssh GONBA "echo OK"`
- Деплой через `safe-build.sh`: должен работать (использует `id_ed25519_gonba_deploy`)
- CI deploy в GitHub Actions: должен пройти (тоже через изолированный ключ)
- Никакие cron-jobs на GONBA не должны прервать работу (проверь `crontab -l` если что-то делает SSH-вызовы)

### Шаг 4: ADR (опционально, 10 минут)

Записать в `GONBA/docs/adr/NNNN-isolated-authorized-keys.md`: «принят принцип — на GONBA-сервере только GONBA-deploy-ключи + личный ключ разработчика. Cross-project ssh-доступ запрещён. Если нужен — через bastion/jump-host, не прямым ключом».

## Зачем

- **Снимает цепочку компрометации.** Каждый сервер должен иметь только свои ключи.
- **Активирует pull-through идею #001** для исторических ключей, не только новых.
- Это standalone security task, не блокирует никакую активную нитку — **GONBA сейчас в `between threads`** (Media→Я.Диск закрыт сегодня), идеальное окно.

## Возможные «нет»

- Если какой-то из «чужих» ключей реально используется (например, MatricaRMZ machine используется как **backup**-deploy point) — нужно решать иначе (явно документировать связь, не удалять).
- Если у тебя нет личного ключа с активного laptop'а в `authorized_keys` — удаление shared-ключей может **запереть тебя самого**. Backup `authorized_keys` **обязателен**.
- Если есть несколько компов (Windows-разработка + что-то ещё) — каждый ключ нужно сверить.

## Что записать обратно

В `GONBA/docs/DEVELOPMENT_LOG.md`:

```markdown
### 2026-XX-XX — security cleanup

- `brain_matrica dispatch #0007` (security): GONBA `authorized_keys` cleanup.
  Удалены ключи: `valstan@a6fd55b8e0ae` (MatricaRMZ), `valstan@setka`.
  Оставлены: `id_ed25519_gonba_deploy` + `<your-personal-key>`.
  Backup: `~/.ssh/authorized_keys.backup-2026-XX-XX`.
  Smoke-test: ssh GONBA / safe-build / CI — всё OK.
  Запись в PENDING_FOLLOWUPS перенесена в DEV_LOG (closed).
```

Если возникли побочные эффекты — фиксировать в **Failed approaches** (см. заявку #0006), потому что это сценарий где «полная очистка не сработала из-за зависимости X».

После — **удалить этот файл** из `docs/inbox-from-brain/`.
