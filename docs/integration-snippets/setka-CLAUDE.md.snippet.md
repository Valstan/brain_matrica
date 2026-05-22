# Snippet для setka/CLAUDE.md

**Контекст:** при попытке отредактировать `D:\GitHubReps\setka\CLAUDE.md` из brain_matrica-сессии (2026-05-22) auto-mode classifier Claude Code заблокировал правку как «scope escalation в self-modification конфиг другого репо», несмотря на согласие пользователя. MatricaRMZ и GONBA — успели до триггера и были отредактированы.

**Что делать:** при следующем заходе в setka (`cd D:\GitHubReps\setka && claude`) — вставить блок ниже в `CLAUDE.md`, в таблицу «Источники правды (читать в начале каждой сессии)», следующей строкой после `docs/paths.md`. Закоммитить отдельным коммитом «docs: link to brain_matrica meta-repo».

---

## Куда вставить

В файле `CLAUDE.md`, найди строку:

```markdown
| [`docs/paths.md`](docs/paths.md) | Карта файлов и API endpoints. |
```

Сразу после неё, новой строкой, добавь:

```markdown
| [`../brain_matrica/`](../brain_matrica/) | **Кросс-проектный pool идей, tech-radar, реестр проектов, cross-project ADRs** между MatricaRMZ / GONBA / setka. Meta-репо [`brain_matrica`](https://github.com/Valstan/brain_matrica). Читай `cross-project-ideas/INDEX.md` перед предложением переносимого паттерна. Новые идеи добавляй **в brain_matrica отдельной сессией** (`cd ../brain_matrica && claude`), не из этого репо. При применении — `✅ YYYY-MM-DD` в таблице. Fallback: `~/.claude/cross-project-ideas/` (legacy). |
```

## После применения

- Удалить этот snippet: `rm D:\GitHubReps\brain_matrica\docs\integration-snippets\setka-CLAUDE.md.snippet.md`
- (Если папка пуста — удалить и её)
- Зафиксировать факт применения в `docs/SESSION_HANDOFF.md` brain_matrica при следующем `/close_session`.
