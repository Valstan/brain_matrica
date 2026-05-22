# Morning briefing — задача для scheduled run

> Эту задачу запускать **из brain_matrica-сессии** по cron'у (через `/schedule`) или вручную (`/loop 24h` если хочется через текущую сессию).

## Цель

Каждое утро (или раз в N часов) — собрать снимок состояния всех трёх проектов и положить в `dispatch/briefings/morning-YYYY-MM-DD.md`. Чтобы при заходе в brain_matrica-сессию ты сразу увидел: «вот что произошло за ночь / выходные / неделю».

## Что делать

### 1. Запустить project-auditor для трёх проектов параллельно

```
Agent("project-auditor") × 3 (в одном сообщении):
  - D:/GitHubReps/MatricaRMZ
  - D:/GitHubReps/GONBA
  - D:/GitHubReps/setka
```

Каждый возвращает 1-page summary (см. `.claude/agents/project-auditor.md`).

### 2. Прочитать состояние dispatch

```
Read brain_matrica/dispatch/INDEX.md
```

Сосчитать:
- Сколько 📤 sent заявок старше 7 дней (предупреждать на 7, помечать `🕒 superseded` на 30)
- Сколько ✅ done закрылось за последние сутки (положительный сигнал)
- Сколько ⛔ rejected (надо понять причины)

### 3. GitHub-обзор через `gh` CLI

```bash
gh pr list --state open --author @me --repo Valstan/MatricaRMZ
gh pr list --state open --author @me --repo Valstan/Gonba
gh pr list --state open --author @me --repo Valstan/setka
```

Если есть открытые PR > 24 часов без активности — флаг.

### 4. Применение kill-policy

Из `projects/INDEX.md` секция Kill-policy:
- Для каждого проекта проверь `git log -1 --format=%ai` — давность последнего коммита
- Сравни с трешхолдами (30/60/90 дней)
- Если переход — предложи фазовый сдвиг (active → paused, paused → dormant, dormant → archive candidate)

### 5. Сохранить briefing

Создать `dispatch/briefings/morning-YYYY-MM-DD.md`:

```markdown
# Morning briefing — YYYY-MM-DD

**Generated:** YYYY-MM-DD HH:MM
**Активных проектов:** 3 (MatricaRMZ, GONBA, setka)

## Audit results

### MatricaRMZ
<copy summary from auditor>

### GONBA
<copy summary from auditor>

### setka
<copy summary from auditor>

## Dispatch state

- 📤 active sent: N (из них старше 7 дней: M)
- ✅ closed since last briefing: K
- ⛔ rejected since last briefing: L

## GitHub open PRs

| Project | PR | Title | Age |
|---|---|---|---|
| ... | ... | ... | ... |

## Phase changes triggered by kill-policy

<если есть автоматические переходы — список>

## Что заслуживает внимания

<1-3 пункта: важное за прошедший период, новые кандидаты на заявки, аномалии. Если штатно — «штатно».>
```

### 6. Отчёт в чате

Если есть аномалии или что-то важное (новые PR ожидают review, проект перешёл в dormant, заявка протухла) — вернуть короткое summary в чат сессии (1-5 строк). Если всё штатно — «🟢 Утренний обзор: штатно, briefing сохранён в `dispatch/briefings/morning-YYYY-MM-DD.md`».

## Когда запускать

Варианты:
- **`/loop 24h`** в открытой brain_matrica-сессии — Claude самовоспроизводится каждые 24 часа пока сессия живёт.
- **`/schedule "0 9 * * 1-5"`** — cron remote routine, работает без открытой сессии (нужно проверить, доступно ли в твоей подписке).
- **Вручную** в начале brain_matrica-сессии (`/start` уже похожее делает) — самый простой вариант, не требует автоматизации.

**Рекомендация для пилота:** начать с **«вручную при `/start`»** — добавить в `start.md` шаг «опционально запустить morning briefing» через ссылку на этот файл. После недели использования — решить, нужна ли автоматизация.

## Что НЕ делать

- ❌ Не вызывать project-auditor для архивированных / paused проектов (зря тратит токены)
- ❌ Не запускать тесты / build'ы — это не CI
- ❌ Не делать commit/push автоматически — briefings создаются как working files, ты сам решаешь их коммитить или нет
