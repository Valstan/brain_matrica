# brain_matrica

Meta-репозиторий управления всеми персональными проектами разработчика @valstan. «Мозг» поверх отдельных кодовых репо.

## Что здесь

- **`projects/`** — реестр всех проектов с метаданными (стек, статус, прод-URL, repo URL, owner, версия)
- **`cross-project-ideas/`** — pool переносимых идей между проектами (миграция из `~/.claude/cross-project-ideas/`)
- **`tech-radar/`** — какие технологии в эксплуатации, на радаре (попробовать), отвергнуты
- **`adr/`** — Cross-project Architecture Decision Records (решения которые касаются нескольких проектов)
- **`inbox/`** — сырые идеи, новости индустрии, черновики «прежде чем оформить в pool/radar»
- **`docs/`** — `SESSION_HANDOFF.md` для непрерывности meta-сессий
- **`.claude/commands/`** — per-project skills (`/start`, `/close_session` адаптированные под мета-контекст)

## Что НЕ здесь

- Код приложений — каждое в своём репо (MatricaRMZ, GONBA, setka, ...)
- Per-project tactical notes (PENDING_FOLLOWUPS, DEVELOPMENT_LOG) — это в каждом проекте свои `docs/`
- Auto-memory Claude'а — `~/.claude/projects/<proj>/memory/` per машина

## Как этим пользоваться

### Открывая сессию в одном из проектов (MatricaRMZ, GONBA, setka)

Их `CLAUDE.md` указывает на `brain_matrica/cross-project-ideas/`. Claude в `/start` шагом проверяет применимые идеи. При новой идее — пишет сюда в pool.

### Открывая сессию в самом `brain_matrica`

`/start` подхватывает `docs/SESSION_HANDOFF.md` — что обсуждали в прошлый раз на мета-уровне. Сюда приходишь для:
- Стратегических обсуждений («какой проект сейчас в долгой паузе и почему?»)
- Обновления tech-radar («появился Bun 2.0 — стоит попробовать в новых проектах?»)
- Inbox-разбора (сырые идеи → pool / radar / archive)
- Cross-project ADRs («везде уходим от axios на fetch»)
- Обновления реестра проектов (новый прод-URL, смена стека)

## Локальный путь и интеграция с проектами

Каждый комп: клонируй приватный repo `Valstan/brain_matrica` в **ту же родительскую папку**, где лежат остальные проекты. Стандартные раскладки:

- Windows: `D:\GitHubReps\brain_matrica\` (рядом с `MatricaRMZ\`, `GONBA\`, `setka\`)
- macOS / Linux: `~/dev/brain_matrica/` (рядом с `~/dev/MatricaRMZ/` и т.д.)

### Стратегия пути в CLAUDE.md проектов

В CLAUDE.md каждого код-проекта ссылка на brain_matrica дана как **относительный путь `../brain_matrica/`** (а не абсолютный или ENV var). Причины:

1. **Работает кросс-платформенно** без per-machine настройки — пока стандартная раскладка соблюдается.
2. **Не зависит от ENV vars** (которые легко забыть проставить на новом компе).
3. **Видна в git** — пользователь сразу понимает где искать, без чтения `~/.bashrc` / `.zshenv`.

**Fallback при несовпадении:** `~/.claude/cross-project-ideas/` помечен как legacy (там `INDEX.md` — редирект сюда). Если в каком-то проекте Claude вдруг не находит `../brain_matrica/` — он использует legacy с предупреждением и поднимает вопрос «куда я клонировал brain_matrica на этом компе?».

**Если раскладка нестандартная:** добавь в локальный `~/.claude/CLAUDE.md` своего компа абсолютный путь как override:

```markdown
## Local override
brain_matrica локально: `/absolute/path/to/brain_matrica`
```

Это не уходит в git проектов, остаётся per-machine.

## История создания

Создан 2026-05-22 после того, как pool идей в `~/.claude/cross-project-ideas/` показал проблему рассинхронизации между компами (outside-repo). См. SESSION_HANDOFF и первый ADR.
