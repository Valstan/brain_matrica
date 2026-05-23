## ccusage

**Category:** ai (monitoring)
**Ring:** trial
**Used in:** brain_matrica (источник данных для `/audit-usage`)
**First adopted:** 2026-05-23 (token economy program, этап 1)

## What

Open-source CLI для трекинга расходов LLM coding agents (Claude Code, Codex, Qwen, Gemini, Copilot CLI и десяток других). Читает локальные jsonl-логи в `~/.claude/projects/*/` (для Claude Code) и аналогичные для других агентов. Даёт срезы `daily`, `weekly`, `monthly`, `session`, `blocks` (billing windows). Поддерживает фильтрацию по агенту через subcommand (`ccusage claude` → только Claude). JSON output через `-j`. Запуск: `npx -y ccusage@latest <command>`.

## Why

- **Видимость прежде оптимизации** ([ADR-0003](../../adr/0003-token-economy-principles.md) принцип #1) — без данных «сколько тратим» оптимизация — догадки.
- **Локальные данные** — ноль задержки, ноль зависимости от Anthropic Console (который лагает на часы).
- **JSON** — машиночитаемо, можно строить свой агрегатор (для нас — brain skill `/audit-usage`).
- **Cost корректный** — считает по моделям и cache discount.

## Alternatives considered

- **`/cost` (built-in Claude Code)** — показывает только текущую сессию, нет агрегации за период. Дополняющий, не заменяющий.
- **Anthropic Console** — агрегированно, но: (а) лагает на часы, (б) нет привязки к проекту, (в) не различает агентов. Хорошо для месячного счёта, плохо для «что было вчера».
- **Самописный парсер jsonl** — рассматривается как fallback если ccusage сломается. Pricing нужно поддерживать руками — это работа. Пока ccusage активно поддерживается — не нужно.

## Notes

- **Нет per-project group-by** — `ccusage session` показывает по UUID, без cwd/project. В `/audit-usage` маппинг UUID→project делаем сами через каталоги `~/.claude/projects/<dir>/<uuid>.jsonl`.
- **Worktrees** — Claude Code держит worktree-сессии в отдельных каталогах (`<project>--claude-worktrees-<name>`). `/audit-usage` нормализует — сворачивает в основной проект.
- **Quirk 2026-05-17/19:** в эти дни видим ~190M токенов Haiku-4-5 в день — явно фоновая активность, не интерактивные сессии. Проверить когда будет `/audit-usage` с per-project breakdown.
- **Версия не пинуется** — `@latest` чтобы получать pricing updates автоматически. Если станет нестабильным — закрепить версию в `/audit-usage`.

## Workflow с ccusage

1. Раз в неделю (или после крупной сессии) — запустить `/audit-usage`
2. `/audit-usage` под капотом → `ccusage claude --json --since YYYY-MM-DD` + per-project mapping
3. Отчёт в чат: проект × неделя, dailу breakdown, аномалии

## References

- https://github.com/ryoppippi/ccusage
- npm: https://www.npmjs.com/package/ccusage
- ADR-0003 — token economy principles
- [docs/plans/token-economy-program.md](../../docs/plans/token-economy-program.md) — roadmap (этап 1)
