# Идея #004: Минимализм AI-docs 2026 — упразднение DEV_HISTORY/DEVELOPMENT_LOG

**Created:** 2026-05-22
**Origin:** Наблюдение пользователя в meta-сессии brain_matrica 2026-05-22 — про смену парадигмы документирования между «эрой слабых LLM» (2020-2024) и «эрой мощных LLM» (2025-26+).

## Суть

Документация для проекта в эру мощных AI-ассистентов (1M context, sub-agents, MCP integrations, семантический поиск по коммитам) **не нуждается** в детальном слое «история разработки» — `DEV_HISTORY.md` / `DEVELOPMENT_LOG.md`. Их роль распределяется по другим, уже существующим документам / источникам:

| Что было в DEV_HISTORY | Где живёт без неё |
|---|---|
| «Что сделано в каждой итерации» | git log с описательными commit messages |
| «Контекст релиза» | git tag + tag annotations + ChangeLog в release notes на GitHub |
| «Уроки извлечённые / что попробовали» | **Failed approaches** секция в `SESSION_HANDOFF.md` (см. идею #003 + дополнение) + ADR «Alternatives considered» |
| «Куда мы шли» | `SESSION_HANDOFF.md` (нить между сессиями) |
| «Архитектурные решения» | `docs/adr/` ADRs |
| «Открытые задачи» | `docs/PENDING_FOLLOWUPS.md` |

## Минимальный набор docs для проекта (2026)

- `CLAUDE.md` — entry point, источники правды, технические уроки уровня **проекта** (не сессии)
- `docs/SESSION_HANDOFF.md` — нить между сессиями + Failed approaches секция
- `docs/PENDING_FOLLOWUPS.md` — открытые задачи с приоритетами
- `docs/adr/` — Architectural Decision Records где есть архитектурные развилки
- `docs/PROJECT_STATE.md` (опционально) — стабильное «как устроено сейчас» для быстрого онбординга

Всё остальное (DEV_HISTORY, DEVELOPMENT_LOG, RELEASE_NOTES.md, FAQ_for_AI, prompt-templates как файлы) — **артефакты эры компенсации слабости моделей**, безопасно упраздняются.

## Почему сейчас можно (а 2 года назад — нельзя)

1. **Context window** — Claude / GPT-5 / Gemini могут читать `git log --since='3 months ago'` без проблем; раньше — нет
2. **Sub-agents** — динамически вычитывают git/file-state, не нужен «pre-baked» сводный документ
3. **Семантический поиск** — `gh search`, `gh pr list --search`, MCP-серверы дают живые данные
4. **Лучшая память моделей** — не теряют контекст между шагами длинной сессии
5. **Лучшие commit messages** — Conventional Commits + Claude-suggested messages = коммиты сами по себе informative

## Что **не** становится избыточным

- **Failed approaches** — уроки которые не попадают в коммиты (там только успехи). Должны где-то жить. **Лучшее место** — секция в SESSION_HANDOFF.md (как часть идеи #003 в pool)
- **ADR** — архитектурные решения с «почему именно так», полезны независимо от мощности AI
- **PENDING_FOLLOWUPS** — открытые задачи, чтобы не забыть

## Применимость по проектам

| Проект | DEV_HISTORY/LOG | Решение |
|---|---|---|
| **setka** | ~~`DEV_HISTORY.md`~~ упразднена | ✅ 2026-05-24 — `git rm DEV_HISTORY.md`, решение зафиксировано в setka `docs/adr/0001-archive-dev-history.md`. Хронология теперь в `git log` + `gh pr view` + `SESSION_HANDOFF`. История файла доступна через `git log --follow -- docs/DEV_HISTORY.md`. |
| **MatricaRMZ** | `DEVELOPMENT_LOG.md` | Кандидат на упразднение. Хорошие commit messages + есть SESSION_HANDOFF + ADR. DEVELOPMENT_LOG дублирует |
| **GONBA** | `DEVELOPMENT_LOG.md` | Кандидат на упразднение, по аналогии с MatricaRMZ |

## Что НЕ делать одномоментно

- **Не удалять файлы немедленно.** Если в проекте за DEV_HISTORY стоит много ссылок (из CLAUDE.md, ADR, git hooks, скриптов) — расцепить надо аккуратно.
- **Не упразднять без замены.** Failed approaches секция в SESSION_HANDOFF должна работать **до** упразднения DEV_HISTORY, не после.
- **Не унифицировать насильно.** Если проект говорит «нам DEV_HISTORY всё ещё нужна» (например, для команды, не только AI) — оставить.

## Как разворачивать

1. Применить в проекте идею #003 (SESSION_HANDOFF + `/close_session` skill) — **обязательно**
2. Добавить Failed approaches секцию в SESSION_HANDOFF (см. заявку #0006)
3. Пожить **хотя бы 2-3 нитки** с новой структурой — убедиться что уроки реально попадают в Failed approaches, а не теряются
4. Тогда — упразднить DEV_HISTORY:
   - Сделать финальный коммит «archive DEV_HISTORY at 2026-XX-XX state» (исторический snapshot)
   - Удалить файл из активного использования
   - Удалить ссылки на DEV_HISTORY из CLAUDE.md / других docs
   - Записать ADR «Архивирована DEV_HISTORY — переход на минималистичный AI-docs паттерн»

## Связано

- [Идея #003](003-session-handoff.md) — SESSION_HANDOFF.md + `/close_session` skill (фундамент)
- Заявка [#0004](../../dispatch/items/0004-setka-session-handoff-pattern.md) — применение #003 в setka
- Заявка [#0006](../../dispatch/items/0006-failed-approaches-section.md) — Failed approaches секция
- Возможный будущий cross-project ADR — «Документация-для-AI 2026: минималистичная»

## Статусы по проектам

| Проект | Статус |
|---|---|
| MatricaRMZ | ⚠️ применимо, не применено — кандидат после применения #003 + #0006 |
| GONBA | ⚠️ применимо, не применено — кандидат после применения #0006 |
| setka | ✅ применено 2026-05-24 — `DEV_HISTORY.md` упразднена, setka ADR-0001. Adaptation: прожита 1 нитка с SESSION_HANDOFF (не 2-3 как рекомендовал pool), но пользователь дал прямую команду; контекст после 5 рефакторных PR показал преимущество git-хронологии. Исторические markers «закрыто YYYY-MM-DD, см. DEV_HISTORY» в PENDING оставлены намеренно — теперь работают как pointers в `git show <commit>~N:docs/DEV_HISTORY.md`. |
