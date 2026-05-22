# Заявка #0003: Untracked папка `brain_matrica/` внутри MatricaRMZ — разобраться

> 🧠 **Заявка от brain_matrica.** Сформулирована meta-сессией, у которой нет полного контекста этого проекта (видит только git log, CLAUDE.md, SESSION_HANDOFF, PENDING_FOLLOWUPS — не видит код, тесты, work-in-progress).
>
> Это **предложение, не задача.** Проанализируй с точки зрения текущего состояния проекта: подходит ли структурно, не дублирует ли уже существующее, не утяжелит ли, есть ли побочные эффекты. Можешь отклонить без объяснений или вернуть встречное «вот как лучше».
>
> Источник: brain_matrica session 2026-05-22.

**Target:** MatricaRMZ
**Created:** 2026-05-22
**Status:** sent

## Контекст у brain_matrica

В brain_matrica-сессии 2026-05-22 при `git -C "D:/GitHubReps/MatricaRMZ" status --short` обнаружено:

```
 M CLAUDE.md
?? brain_matrica/
```

То есть **внутри** репо MatricaRMZ (`D:\GitHubReps\MatricaRMZ\brain_matrica\`) есть untracked папка с именем `brain_matrica`. Это **не** правильная локация — настоящий клон brain_matrica лежит рядом, в `D:\GitHubReps\brain_matrica\`.

Чего я **не** видел:
- Что внутри этой папки (файлы / симлинк / копия meta-репо / случайно созданная структура)
- Когда она появилась (`git log` MatricaRMZ её не отслеживает по понятным причинам — она untracked)
- Намеренно ли это (вдруг это эксперимент / черновик / часть какого-то скрипта в MatricaRMZ)

## Предложение

В MatricaRMZ-сессии проверить:

```bash
ls -la D:\GitHubReps\MatricaRMZ\brain_matrica\
```

Принять решение:
1. **Случайная копия / артефакт первой инициализации brain_matrica 2026-05-22** → удалить (`rm -rf D:\GitHubReps\MatricaRMZ\brain_matrica\`). Настоящий brain_matrica при этом не пострадает — он в `D:\GitHubReps\brain_matrica\`.
2. **Симлинк** (например, чтобы из MatricaRMZ был удобный shortcut к brain_matrica) → возможно, оставить, но добавить в `.gitignore` MatricaRMZ как `brain_matrica/`, чтобы git не показывал untracked при каждом status.
3. **Что-то нужное / специально созданное** → задокументировать причину в `MatricaRMZ/CLAUDE.md` или `docs/PROJECT_STATE.md`, чтобы было понятно при следующем взгляде «зачем это здесь».

## Зачем

- Untracked в git status создаёт визуальный шум: каждый раз нужно «отбрасывать» эту строку глазом.
- Если это случайная копия — она дублирует данные и потенциально может рассинхронизироваться с настоящим brain_matrica.
- Чистый `git status` — критично для скриптов, которые проверяют «нет ли несохранённых изменений» перед деплоем.

## Возможные «нет»

- Может быть **прямая зависимость** какого-то скрипта в MatricaRMZ от наличия `./brain_matrica/`. Тогда удалять нельзя.
- Может быть **черновик миграции** инфраструктуры, который ещё не закоммичен.

## Что записать обратно

В `MatricaRMZ/docs/PENDING_FOLLOWUPS.md` (если ещё не там) — короткая запись «brain_matrica/ unstaged: разобрался, причина X, действие Y». Или сразу в `DEVELOPMENT_LOG.md`:

```markdown
### 2026-XX-XX — cleanup

- `brain_matrica dispatch #0003`: untracked `brain_matrica/` папка — <удалено / оставлено как симлинк / задокументировано>.
```
