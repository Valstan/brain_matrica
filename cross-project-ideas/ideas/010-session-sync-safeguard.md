# 010 — Session sync safeguard («сессия не закрыта, пока всё не на GitHub»)

**Status (overall):** ⚠️ in adoption (setka pioneer; MatricaRMZ/GONBA/KARMAN — директивы 2026-05-30, **mandate**)
**Born in:** setka (письмо `setka/mailbox/to-brain/2026-05-30-session-sync-safeguard.md`, прислано по рефлексу [#009](009-share-findings-reflex.md)).
**Born from:** @valstan работает на разных компах (днём один, вечером другой); GitHub — источник истины. Сессии иногда уходят в архив **автоматически** (UI-тумблер Cowork «Classify session states»), и неясно, доехала ли вся работа на GitHub. Если сессия заархивировалась с незапушенной работой, а человек пересел на другой комп — версии разъезжаются, дальше тяжёлый merge / поломки. Владелец явно просит **единый стандарт во всех проектах** (единообразие критично, чтобы не путаться).

---

## Проблема

- Авто-архивацию сессии вызывает UI-тумблер Cowork «Classify session states» (Claude Desktop) — **его нет в `settings.json`**, отключается только вручную в UI.
- **Ни один хук не срабатывает надёжно при авто-архиве** (SessionEnd ловит лишь явные `/clear`/`logout`, его вывод не виден, завершение не блокирует).
- Значит «забыл запушить перед пересадкой за другой комп» ничем не ловится → version-skew между машинами.

## Решение

Git-sync сеть, работающая **независимо от тумблера** и разъезжающаяся на все машины через коммит `.claude/settings.json`:

1. **`scripts/git_sync_check.sh`** — детектор синхронизации, два режима:
   - `--warn`: печатает ⚠️ в stdout, если есть незакоммиченное/незапушенное или `origin` ушёл вперёд (best-effort `git fetch` с таймаутом; офлайн не ломает). Всегда `exit 0`.
   - `--gate`: то же, но **`exit 1`**, пока дерево не чистое и не запушено. `exit 0` = чисто.
   - Логика git-агностична — переносится копированием, адаптируются только пути.
2. **SessionStart-хук** в коммитимом `.claude/settings.json` (matcher `startup|resume`) → `bash "${CLAUDE_PROJECT_DIR}/scripts/git_sync_check.sh" --warn`. stdout хука надёжно вбрасывается в контекст → при входе сразу подсвечивает несинхрон. `settings.json` коммитится → хук авто-разъезжается на все машины (то, что нужно для единообразия).
3. **Единая команда закрытия `/close_session`** с жёстким sync-гейтом: коммитит+пушит ВСЁ (код+доки) через PR-flow (ADR-0002) и не считает сессию закрытой, пока `--gate` не вернёт 0. Если в проекте есть отдельные `finish`/`close` — **схлопнуть в одну** (убрать дубль-путаницу; setka удалил `/finish`).
4. **Правило в `CLAUDE.md`** (или аналоге): «GitHub — источник истины между машинами; никогда не оставляй сессию с несинхронизированной работой».
5. **NL-триггер** «закрой сессию» / «заверши сессию» → команда закрытия (через `description` команды + правило в `CLAUDE.md`).
6. **(Ручной шаг владельца, не проект)** отключить тумблер Cowork «Classify session states» — убирает сюрприз с авто-архивацией. Защита из пп.1–5 работает и без этого, но вместе надёжнее.

## Применимость

### applicable_when
- Проект под git с remote на GitHub (источник истины для multi-machine).
- Есть `.claude/settings.json` (коммитится) — для SessionStart-хука.

### not_applicable_when
- Нет `/close_session` — гейт п.3 вешать некуда. Скрипт (п.1) + SessionStart-warn (п.2) работают **независимо** и применимы сразу; гейт-часть — после принятия [#003](003-session-handoff.md) (приносит `/close_session`).

## Implemented in / not_applicable_for

| Проект | Статус | Дата | Заметка |
|---|---|---|---|
| setka | ✅ pioneer | 2026-05-30 | `scripts/git_sync_check.sh` (--warn/--gate), SessionStart-хук, `/close_session` с гейтом, **удалён `/finish`**, правило в `CLAUDE.md`. Ветка `chore/session-sync-safeguard`. |
| MatricaRMZ | ⚠️ директива 2026-05-30 | 2026-05-30 | mandate. Есть `/close_session` — все 6 пунктов применимы. Встроить в окно (не рвать BOM deep flow). |
| GONBA | ⚠️ директива 2026-05-30 | 2026-05-30 | mandate. Есть `/close_session` — все 6 пунктов применимы. Фаза between threads — удобное окно. |
| KARMAN | ⚠️ директива 2026-05-30 | 2026-05-30 | mandate (partial): скрипт + SessionStart-хук сразу; **гейт `/close_session` — в связке с [#003](003-session-handoff.md)** (нет `/close_session`). При пробуждении пакетом с #003/#008/#009. |

## Связано

- Pool [#009 share-findings-reflex](009-share-findings-reflex.md) — рефлекс, по которому setka прислал эту находку (первое «боевое» срабатывание для chore-паттерна).
- Pool [#007 close_session auto-merge](007-close-session-auto-merge.md) — **парная**: #007 авто-мержит зелёные PR + финальный sync при закрытии; #010 добавляет sync-**гейт** (не закрывать пока не запушено) + SessionStart-предупреждение. Вместе закрывают multi-machine continuity с двух сторон.
- Pool [#003 SESSION_HANDOFF](003-session-handoff.md) — приносит `/close_session`, на который вешается гейт (предпосылка для KARMAN).
- [ADR-0002 PR-only flow](../../adr/0002-pr-only-flow-no-direct-push.md) — гейт пушит через ветку + PR, не прямой push в main.
- Письмо-источник: `setka/mailbox/to-brain/2026-05-30-session-sync-safeguard.md`.
