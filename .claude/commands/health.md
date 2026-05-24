---
description: Быстрый health-дашборд brain_matrica + всех проектов + connectivity-check mailbox-канала (без полного /start, без коммитов)
---

Быстрый снимок состояния. Лёгкая альтернатива `/start` когда нужно просто посмотреть «всё ли в порядке» без полной meta-сессии. **Не пишет в git, не делает fetch, не подтягивает sibling-репо** — только локальное состояние.

Цель — 5-10 секунд + одна таблица.

**Двойная функция:**
1. **Daily quick-check** — статус brain/проектов/PR на глаз.
2. **Weekly connectivity-check** — слышат ли проекты brain, не оборвалась ли связь. См. секцию «Connectivity thresholds» — раз в неделю запускай этот skill именно ради колонок «📤 awaiting» и «📥 last reply» с возрастом.

## Что собрать

### brain_matrica локально

```bash
git branch --show-current
git status --short | head -5
git log --oneline -3
```

Зафиксируй:
- Ветка (`main` ожидается)
- Есть ли uncommitted (если да — что)
- Последние 3 коммита

### Открытые PR в brain_matrica

```bash
gh pr list --state open --limit 5
```

### Для каждого проекта (read-only локально, без `cd`)

Для каждого из MatricaRMZ / Gonba / setka / karman (имя локального клона; brain-side mailbox использует канонические `GONBA`/`KARMAN` uppercase):

```bash
git -C ../<proj> log -1 --format='%cI %h %s'
git -C ../<proj> branch --show-current
```

И прочитай:
- `../<proj>/docs/SESSION_HANDOFF.md` если есть — Status (ACTIVE/IDLE) + Updated date
- **Структура mailbox** — есть ли `../<proj>/mailbox/to-brain/` директория. Если нет — `🔴 NOT CONNECTED` (проект не мигрирован на v3 mailbox).
- **`.last-seen` дрейф** — сравни последний коммит в `../<proj>/mailbox/to-brain/` с `mailboxes/<brain-proj>/.last-seen`:

```bash
remote=$(git -C ../<proj> log -1 --format=%cI -- mailbox/to-brain/ 2>/dev/null)
seen=$(cat mailboxes/<brain-proj>/.last-seen 2>/dev/null)
# если remote > seen → 📬 NEW mail flag
```

### Connectivity — возраст коммуникации

**📤 awaiting reply (oldest):** найди самое старое письмо в `mailboxes/<P>/from-brain/*.md` (без ARCHIVE/DRAFTS), посчитай возраст в днях от сегодня.

**📥 last project reply:** возраст последнего коммита проекта в `mailbox/to-brain/`. Это последний раз когда проект что-то ответил brain'у — независимо от текущих директив.

```bash
today=$(date +%s)
# oldest awaiting
for f in mailboxes/<P>/from-brain/*.md; do
  [ -f "$f" ] || continue
  d=$(basename "$f" | grep -oE '^[0-9]{4}-[0-9]{2}-[0-9]{2}')
  [ -n "$d" ] && echo $(( (today - $(date -d "$d" +%s)) / 86400 ))
done | sort -n | tail -1   # max age in days

# last reply age
remote_ts=$(git -C ../<proj> log -1 --format=%cI -- mailbox/to-brain/)
last_reply_days=$(( (today - $(date -d "$remote_ts" +%s)) / 86400 ))
```

### Connectivity thresholds (флаги тревоги)

| Сигнал | Возраст | Флаг |
|---|---|---|
| 📤 awaiting reply (oldest) | 0-7 дней | 🟢 норма |
| | 8-14 дней | 🟡 внимание |
| | 15-30 дней | 🟠 проверить связь |
| | >30 дней | 🔴 связь под вопросом |
| 📥 last project reply | 0-14 дней | 🟢 активен |
| | 15-30 дней | 🟡 тишина |
| | 31-60 дней | 🟠 длительная тишина (если есть recommend+ директивы — серьёзный сигнал) |
| | >60 дней | 🔴 проект не отвечает |
| Структура | `to-brain/` есть | 🟢 |
| | `to-brain/` нет | 🔴 NOT CONNECTED |

Важные корректировки:
- **`suggest`/`low` директивы не считаются** в порогах awaiting — проект имеет право игнорировать. Если все ожидающие — `suggest`, флаг даун до 🟢.
- **Проект в `paused`/`dormant`** (см. `projects/INDEX.md`) — пороги «last project reply» удваиваются: 🔴 только при >120 дней.
- **Если есть `mandate` директива** без ответа >7 дней — сразу 🟠 независимо от других факторов.

## Формат отчёта (таблица + футер)

```markdown
## 🩺 brain_matrica health — YYYY-MM-DD HH:MM

**brain_matrica:** branch=main, clean | uncommitted (M files)
**Open PRs in brain:** N
**Inbox:** пуст | N items

| Project | Last commit | Phase | Session | 📬 to-brain | 📤 awaiting (oldest) | 📥 last reply | Connectivity |
|---|---|---|---|---|---|---|---|
| MatricaRMZ | <date> <hash> | deep flow | ACTIVE 2d ago | — / 1 new | 2 / 0d | 0d | 🟢 |
| GONBA | <date> <hash> | between threads | IDLE | — | 1 / 1d | 1d | 🟢 |
| setka | <date> <hash> | deep flow | — | — | 1 / 1d (suggest) | 1d | 🟢 |
| KARMAN | <date> <hash> | between threads | — | — | 2 / 0d | 1d | 🟢 |
```

Колонки:
- **📬 to-brain** — `—` если `.last-seen` в синке с проектом; `N new` если есть свежие письма не обработанные brain'ом.
- **📤 awaiting (oldest)** — `N / Md` — сколько писем висит без ответа в `from-brain/` (без ARCHIVE/DRAFTS) / возраст самого старого в днях. Если все `suggest` — добавить `(suggest)`.
- **📥 last reply** — сколько дней с последнего коммита проекта в `mailbox/to-brain/`. `—` если проект не подключён (нет директории).
- **Connectivity** — 🟢/🟡/🟠/🔴 по порогам выше. Композитный — берётся **худший** из awaiting / last reply / структуры с учётом корректировок (suggest даун; paused/dormant даблит пороги; mandate без ответа >7д = 🟠+).

```markdown
**Затыки:**
- <если что-то требует внимания — 1-3 пункта>
- если всё штатно — «🟢 штатно»

**Connectivity заметки** (показывать только если есть не-🟢):
- Если 🟡/🟠/🔴 проект — что именно сигнализирует, какое письмо висит, какая директива не получила ответ
- Если 🔴 NOT CONNECTED — какой проект и что нужно сделать (директива на миграцию `mailbox/to-brain/`)
```

## Что НЕ делает

- ❌ Не делает `git fetch` (быстрее, и не нужно для local snapshot)
- ❌ Не делает `git pull` нигде
- ❌ Не пишет файлы
- ❌ Не сохраняет briefing (используй `/morning-briefing` если нужен snapshot в файл — этот skill только в чат)
- ❌ Не открывает meta-сессию (используй `/start` для полноценной)

## Когда использовать

- В начале дня — посмотреть «что нового, есть ли что-то срочное»
- После закрытия другой сессии — проверить что всё чисто
- Перед `/start` — если есть сомнения нужна ли полная meta-сессия
- **Раз в неделю** — connectivity-check mailbox-канала. Смотрим именно колонки `📤 awaiting (oldest)` и `📥 last reply` с возрастом. Если все 🟢 — связь жива, можно не открывать meta-сессию. Если ≥1 🟠/🔴 — открыть meta-сессию (через `/start`) и разобраться.

## Когда НЕ использовать

- Если планируешь делать что-то в brain (тогда `/start` — он подтянет sibling-репо)
- Если нужен sync с origin (тогда `/start` или ручной `git fetch && git pull`)
- Если нужно делать обработку почты (форвард в pool, ack, архивация) — это работа сессии, не /health

## Weekly connectivity-check — рекомендованный flow

1. `/health` без аргументов.
2. Смотрим колонку `Connectivity` и `📤 awaiting (oldest)`:
   - Все 🟢 → связь жива, ничего не делаем.
   - Есть 🟡 → внимательно, но не критично. Можно подождать ещё неделю.
   - Есть 🟠/🔴 → открываем meta-сессию через `/start`, разбираемся почему проект молчит.
3. Если есть 📬 NEW флаги (свежие письма от проектов которые brain ещё не видел) → тоже `/start` для обработки через PR.

«Раз в неделю» — мягкая частота: если совсем нет meta-сессий, можно делать раз в 2 недели. Но дольше — нарастает риск пропустить оборвавшуюся связь надолго.
