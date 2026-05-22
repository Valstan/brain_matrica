# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-22 (Claude Opus 4.7 — dispatch + Tier 1 orchestration + первый briefing)
**Branch:** main

## Текущая нитка

**Пилот dispatch-механизма как асинхронного канала «brain_matrica → проекты».** Инфраструктура собрана (PROTOCOL, INDEX, items, briefings, permissions, project-auditor sub-agent, kill-policy). Первая партия из 7 заявок отправлена. Первый briefing через project-auditor подтвердил value инфры: реестр был неточен через час после создания, нашлась 🔴 security-проблема в GONBA. Дальше — **проживать цикл** (заявки → проектные сессии → решения → ✅/⛔ → новые заявки).

## Следующий шаг

1. **При следующем `/start` — прогнать morning briefing** через project-auditor (теперь он custom subagent: `Agent(subagent_type="project-auditor", prompt="audit D:/GitHubReps/<name>")` × 3 параллельно). Результат сохранить в `dispatch/briefings/morning-2026-XX-XX.md`.
2. **Проверить применение заявок** — `git log` каждого из трёх репо: ищу пометки `brain_matrica dispatch #NNNN`. Применённые → `✅ done` в `dispatch/INDEX.md`, отклонённые → `⛔ rejected`, переехавшие в архив таблицы.
3. **Если есть консенсус по #0001** (унификация имени `/close_session` vs `/finish`) — сформулировать конкретную заявку «переименовать в X».
4. **Если #0007 (🔴 security) применена** — обновить идею #001 в pool с пометкой «применять и к историческим ключам, не только новым деплоям».
5. **Если setka закрыл `/reliz` big idea MVP** — стоп-лист setka снимается, можно отправлять новые заявки.

## Контекст

- **Repo:** https://github.com/Valstan/brain_matrica
- **Local clone:** `D:\GitHubReps\brain_matrica\`
- **Commits этой сессии:**
  - [`9efb60c`](https://github.com/Valstan/brain_matrica/commit/9efb60c) — интеграция с тремя проектами + метаданные GONBA/setka
  - [`f8cdd4c`](https://github.com/Valstan/brain_matrica/commit/f8cdd4c) — dispatch-инфраструктура (PROTOCOL, INDEX, 5 заявок, pending-delivery)
  - [`6135740`](https://github.com/Valstan/brain_matrica/commit/6135740) — `.claude/settings.json` allow rules для siblings
  - [`eea0a04`](https://github.com/Valstan/brain_matrica/commit/eea0a04) — Tier 1 (project-auditor, kill-policy, #0006, morning briefing задача)
  - [`ee617d9`](https://github.com/Valstan/brain_matrica/commit/ee617d9) — первый briefing через smoke-test + #0007 security
- **Inbox:** пусто
- **Pool идей за сессию:** не добавлено новых файлов (есть **кандидат** на #004 — `componentTypeByNomenclatureId` паттерн из MatricaRMZ, см. briefing)

## Текущее состояние очереди

- **MatricaRMZ:** 3 sent (0001, 0003, 0006) — лимит
- **GONBA:** 3 sent (0001, 0006, 0007 🔴) — лимит, security override допустим
- **setka:** 5 sent (0001, 0002, 0004, 0005, 0006) — превышен лимит. **Стоп-лист**: setka в `deep flow` (MVP big idea, 21 staged file). Никаких новых до `/reliz` и закрытия двух из текущих.

## Реальные фазы проектов (по first briefing)

| Проект | Фаза | Источник |
|---|---|---|
| MatricaRMZ | **deep flow** | BOM-refactor 5 релизов, v1.21.3 выпущен, v1.21.4 next |
| GONBA | **between threads** | Media→Я.Диск нитка закрыта 2026-05-22 (PR #24-#29 смержены, ADR-0001 → Implemented). Окно для входящих заявок. |
| setka | **deep flow** | Big idea «модуль авто-регистрации регионов» MVP, 21 staged file, перед `/reliz` |

## Открытые вопросы для пользователя

1. **Заявка #0004 — нужен пересмотр.** First briefing показал: паттерн setka (DEV_HISTORY-newest-on-top) скорее **образцовый**, MatricaRMZ/GONBA должны взять у setka, а не наоборот. Текущая формулировка #0004 предлагает обратное. Нужно либо отозвать #0004 (status → 🕒 superseded), либо переадресовать (заявка для GONBA «оценить DEV_HISTORY паттерн setka»).
2. **HANDOFF-устаревание во всех трёх** — системная боль паттерна #003. Заявка #0006 (Failed approaches) частично адресует, но **корень** в том что handoff не самообновляется при «нитка дозакрыта внутри сессии». Возможно — идея в pool «handoff обновляется не только при `/close_session`, но и при значимом `git merge` / `git tag` через hook».
3. **Автоматизация morning briefing** — `/loop 24h` (требует открытой сессии) vs `/schedule "0 9 * * 1-5"` (cron remote, проверить доступность в подписке) vs остаться вручную при `/start`. Решение после недели использования.

## Не забыть (low-priority)

- **Tech-radar стартовое наполнение:** Drizzle (adopt, MatricaRMZ), Payload CMS (adopt, GONBA), Celery+Redis (adopt, setka), pnpm 10 (adopt), pnpm 11 (hold), electron-builder (adopt), Next.js 15 (adopt с caveat'ом про watchdog), Groq llama-3.1 (adopt, setka). Можно в любой свободный момент.
- **ADR-0001 кандидат:** «brain_matrica ↔ проекты через файловые dispatch без realtime канала». Записать когда устаканится паттерн (после первого «полного цикла» с применёнными заявками).
- **Идея #004 в pool — кандидат:** `componentTypeByNomenclatureId` header-поле для UI-диагностики рассинхрона данных перед save (origin MatricaRMZ, применимо к EAV-проектам). Записать когда чёткое описание сформирую.
- **Параллельность как явный паттерн** — пользователь подтвердил, что brain_matrica создан **специально** для параллельной работы (не пауз). Идея в pool «параллельность × N проектов требует жёсткой dispatch-дисциплины» — записать после квартала эксплуатации.
- **Custom subagent `project-auditor`** подхватится при следующем `/start` Claude Code. Сегодня тестировался через `general-purpose` fallback — отчёт идентичный.
- **Проверка `.claude/settings.json` на втором компе** — правила в git, должны подхватиться. Если что-то блокируется — расширить allowlist.
- **Заявка #0001 у GONBA первая для приёма** — GONBA сейчас в `between threads`, и в очереди только 3 заявки (включая 🔴 #0007). Идеальный кандидат «возьмём первую короткую сессию».
- **MatricaRMZ — 14 stale `claude/*` веток** — мелкий побочный кандидат на чистку при удобном случае.
