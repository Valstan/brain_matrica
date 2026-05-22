# Dispatch — очередь заявок

> Заявки от brain_matrica к проектам. Подробно — [PROTOCOL.md](PROTOCOL.md).

**Легенда статусов:**
- 🟡 **pending** — черновик, ждёт одобрения в brain_matrica-сессии
- 🟢 **approved** — одобрено, формируется бриф
- 📤 **sent** — бриф положен в `<проект>/docs/inbox-from-brain/`
- 📦 **pending-delivery** — auto-classifier заблокировал прямую доставку, бриф ждёт в `dispatch/pending-delivery/`; при следующей проектной сессии — скопировать в inbox-from-brain
- ✅ **done** — проектная сессия применила
- ⛔ **rejected** — проектная сессия отклонила
- 🕒 **superseded** — устарела / заменена другой заявкой

## Активные заявки

| # | Target | Title | Status | Created | Updated |
|---|---|---|---|---|---|
| [0001](items/0001-unify-session-close-command-name.md) | MatricaRMZ + GONBA + setka | Единое имя команды закрытия сессии (`/close_session` vs `/finish`) | 📤 sent | 2026-05-22 | 2026-05-22 |
| [0002](items/0002-setka-link-to-brain-matrica.md) | setka | Добавить ссылку на brain_matrica в `CLAUDE.md` (источник правды) | 📤 sent | 2026-05-22 | 2026-05-22 |
| [0003](items/0003-matricarmz-untracked-brain-matrica-folder.md) | MatricaRMZ | Untracked папка `brain_matrica/` внутри репо — разобраться | 📤 sent | 2026-05-22 | 2026-05-22 |
| [0004](items/0004-setka-session-handoff-pattern.md) | setka | Применить идею #003 (SESSION_HANDOFF.md) полностью | 📤 sent | 2026-05-22 | 2026-05-22 |
| [0005](items/0005-setka-log-path-env-var.md) | setka | `LOG_PATH` env var вместо hardcoded пути логов | 📦 pending-delivery ([snippet](pending-delivery/setka-0005-log-path-env-var.md)) | 2026-05-22 | 2026-05-22 |

## Архив

_(сюда переезжают done / rejected / superseded — для истории)_

---

## Метрики «здоровья» очереди

- **Текущая нагрузка на проекты:**
  - MatricaRMZ: 2 sent (0001, 0003)
  - GONBA: 1 sent (0001)
  - setka: 4 sent (0001, 0002, 0004, 0005) — **близко к лимиту в 3 активных**, новые заявки в setka **придержать** до закрытия минимум двух текущих.
- **Самая старая sent-заявка:** 2026-05-22 (0 дней). Лимит 30 дней.
