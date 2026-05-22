# brain_matrica — Session Handoff

> Sticky-note для непрерывности meta-сессий. Перезаписывается командой `/close_session`. История через `git log -- docs/SESSION_HANDOFF.md`.

**Status:** ACTIVE
**Updated:** 2026-05-22 (Claude sonnet 4.7 session, инициализация brain_matrica)
**Branch:** main

## Текущая нитка

**Инициализация brain_matrica и миграция кросс-проектной инфраструктуры из `~/.claude/` в этот git-репо.** Repo создан 2026-05-22 на GitHub (`Valstan/brain_matrica`, private). Базовая структура заложена (см. секцию «Что уже сделано» ниже). Осталось:

1. Подключить три проекта (MatricaRMZ, GONBA, setka) к brain_matrica через ссылки в их CLAUDE.md.
2. Заполнить реальные метаданные в `projects/GONBA.md` и `projects/setka.md` (сейчас плейсхолдеры).
3. Перевести pool идей в источник истины: `~/.claude/cross-project-ideas/` → редирект-README указывающий на этот repo.
4. Подумать про auto-update: как `/start` других проектов будет узнавать локальный путь до brain_matrica на каждом компе (env var или относительный путь).

## Следующий шаг (первый в новой brain_matrica-сессии)

**Соединить три проекта с brain_matrica.** Конкретно:

1. **MatricaRMZ:** в `D:\GitHubReps\MatricaRMZ\CLAUDE.md` добавить раздел «Cross-project knowledge base» с ссылкой:
   ```markdown
   ## Cross-project knowledge base
   Кросс-проектный pool идей, tech-radar, реестр проектов — в приватном git-репо `brain_matrica` (https://github.com/Valstan/brain_matrica). Локально: `../brain_matrica` (или `D:\GitHubReps\brain_matrica\` на Windows).

   При предложении переносимых улучшений / новых идей читай `<абс путь>/brain_matrica/cross-project-ideas/INDEX.md`. Новые идеи добавляй туда (открой brain_matrica отдельной сессией).
   ```

2. **GONBA:** в его `CLAUDE.md` — аналогичный раздел. Локальный путь подсказать или искать через ENV.

3. **setka:** то же самое.

4. **`~/.claude/cross-project-ideas/INDEX.md`:** заменить содержимое на редирект-README:
   ```markdown
   # Moved
   Pool переехал в git-репо `brain_matrica`. Источник истины: https://github.com/Valstan/brain_matrica/tree/main/cross-project-ideas
   Локально: `D:\GitHubReps\brain_matrica\cross-project-ideas\` (или `~/dev/brain_matrica/cross-project-ideas/`).
   Старые файлы в `ideas/` оставлены для истории — синхронизируется через git, не через эту папку.
   ```

5. **Заполнить `projects/GONBA.md` и `projects/setka.md`** — спросить пользователя метаданные или сделать в каждой соответствующей сессии:
   - Repo URL, local clone path, SSH alias prod
   - Стек, прод-URL, owner
   - Текущая фаза разработки

6. **Решить вопрос с локальным путём** к brain_matrica на разных компах. Варианты:
   - **Hard-coded абсолютный путь** — простой, но ломается при смене компа. CLAUDE.md делает per-machine override.
   - **Относительный путь** `../brain_matrica` — работает если все репо в одной папке (стандартный `~/dev/` или `D:\GitHubReps\`).
   - **ENV var** `BRAIN_MATRICA_PATH` — гибко, но требует настройки на каждом компе.
   - **Авто-поиск** — поиск по типичным локациям (`./brain_matrica`, `../brain_matrica`, `~/dev/brain_matrica`, `~/.claude/brain_matrica`). Hack, но юзер-френдли.

   **Рекомендация для первой реализации:** относительный путь `../brain_matrica` (работает если все клонированы в одну родительскую папку). Документировать в CLAUDE.md каждого проекта.

## Контекст

- **Repo:** https://github.com/Valstan/brain_matrica (private)
- **Local clone:** `D:\GitHubReps\brain_matrica\` (Windows)
- **Создано:** 2026-05-22 в MatricaRMZ-сессии (история: см. `docs/SESSION_HANDOFF.md` в MatricaRMZ на ту же дату)
- **Текущее состояние pool идей:** 3 идеи (001-003) скопированы из `~/.claude/cross-project-ideas/`
- **Реестр проектов:** MatricaRMZ заполнен с реальными данными; GONBA, setka — плейсхолдеры

## Что уже сделано (этим инициализационным commit'ом)

- ✅ Repo создан на GitHub, склонирован локально
- ✅ `CLAUDE.md` — инструкции работы с meta-репо
- ✅ `README.md` — общее описание
- ✅ `projects/` — `INDEX.md`, `_template.md`, `MatricaRMZ.md` (реальные данные), `GONBA.md`, `setka.md` (плейсхолдеры)
- ✅ `cross-project-ideas/` — `README.md`, `INDEX.md`, 3 файла идей скопированы
- ✅ `tech-radar/` — `INDEX.md` (пустой, формат описан)
- ✅ `adr/` — `INDEX.md` (пустой, формат описан)
- ✅ `inbox/` — `INDEX.md` (пустой, формат описан)
- ✅ `.claude/commands/start.md` — мета-адаптация
- ✅ `.claude/commands/close_session.md` — мета-адаптация
- ✅ `docs/SESSION_HANDOFF.md` (этот файл)

## Открытые вопросы для пользователя

1. Какой путь к brain_matrica на втором компе пользователя? Нужно для решения вопроса локального пути в CLAUDE.md проектов.
2. Заполнить `projects/GONBA.md` и `projects/setka.md` — сейчас в соседних проектах или сначала собрать минимум метаданных?
3. Идея для tech-radar: что **уже сейчас** актуально для записи как стартовое наполнение? (Drizzle ORM в эксплуатации, electron-builder в эксплуатации, etc.) Или дождаться когда естественно возникнет?

## Не забыть (low-priority)

- В CLAUDE.md MatricaRMZ хорошо бы пояснить: «Phase 1 миграции Directories→Nomenclature и Phase 2.x миграции warehouse_locations — это **per-project** stratagems, в brain_matrica не дублируются».
- После того как pool переедет полностью — можно удалить `~/.claude/cross-project-ideas/ideas/*.md` оставив только редирект README. Но не торопись: пока пользователь не привык — пусть оба места работают.
- Когда появится первая «надпроектная» проблема (типа «выбрать между Bun и Node для нового проекта») — это будет первый адекватный ADR для записи в `adr/`.
- Подумать про идею auto-discovery brain_matrica на другом компе через `~/.claude/settings.json` env (`BRAIN_MATRICA_PATH` глобально).
