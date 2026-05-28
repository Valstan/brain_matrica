# Cross-project ideas — index

Свежее сверху. Полная инструкция — в [README.md](README.md).

**Легенда статуса в проекте:**
- ✅ применено
- ⚠️ применимо, но не применено (предложить)
- ⛔ обсуждалось, не подходит (см. файл идеи → `not_applicable_for`)
- ❓ ещё не оценивалось

| # | Идея | GONBA | MatricaRMZ | setka | KARMAN |
|---|---|---|---|---|---|
| [007](ideas/007-close-session-auto-merge.md) | **`/close_session` авто-мерж готовых PR + sync веток** — multi-machine workflow, чтобы нить не рвалась между компами (auto-merge зелёных PR + финальный `git fetch --prune` + verify `main=origin/main`). | ❓ кандидат | ✅ pioneer 2026-05-26 | ❓ кандидат | ❓ кандидат |
| [006](ideas/006-full-session-ssh-optin.md) | **Full-session SSH opt-in в `/start`** — третий вариант `AskUserQuestion` «дай полный SSH-доступ на эту сессию», Claude не переспрашивает на каждый ssh-вызов в рамках сессии. | ⚠️ директива 2026-05-24 | ✅ 2026-05-24 | ✅ pioneer | ⚠️ директива 2026-05-24 |
| [005](ideas/005-codebase-map.md) | **`docs/CODEBASE_MAP.md` — куратируемая карта монорепо** для узкого cold-start (≤2 экрана, где живёт что + когда сюда лезть). Пилот token economy этап 3. | ⚠️ candidate (ждём 2026-06-07) | ✅ 2026-05-24 (pilot) | ⚠️ candidate (ждём 2026-06-07) | ⚠️ candidate (ждём 2026-06-07) |
| [004](ideas/004-minimalist-ai-docs-2026.md) | **Минимализм AI-docs 2026** — упразднение `DEV_HISTORY` / `DEVELOPMENT_LOG`, их роль покрывает `SESSION_HANDOFF` + Failed approaches + `git log` + ADR. Артефакт эры слабых LLM. | ⚠️ кандидат | ⚠️ кандидат | ✅ 2026-05-24 | ⚠️ кандидат |
| [003](ideas/003-session-handoff.md) | `docs/SESSION_HANDOFF.md` + `/close_session` skill для непрерывности разработки между сессиями (многоэтапные рефакторинги) | ✅ 2026-05-22 | ✅ 2026-05-22 | ✅ 2026-05-23 | ⚠️ директива 2026-05-24 (suggest, backlog) |
| [001](ideas/001-isolated-deploy-ssh-key.md) | Изолированный per-project SSH-deploy-ключ (отдельный `id_ed25519_<proj>_deploy` вместо общего ключа) | ✅ 2026-05-22 | ⚠️ ack 2026-05-24 (окно после блока C v1.22.0) | ✅ 2026-05-22 | ⚠️ кандидат |
| [002](ideas/002-ssh-deploy-key-rotation.md) | Периодическая ротация SSH-deploy-ключей с напоминанием от `/start` | ✅ 2026-05-22 (90д) | ❓ (после #001) | ⚠️ кандидат | ❓ (после #001) |

> Идея #005 (Weekly environment audit) перенесена в [`docs/plans/weekly-environment-audit.md`](../docs/plans/weekly-environment-audit.md) 2026-05-23 — признано: это инфра-план brain_matrica, не переносимая идея между проектами.

---

## Как обновлять эту таблицу

- При создании новой идеи — добавь строку с `❓` для всех проектов, кроме того, где идея родилась.
- При применении в проекте — поменяй на `✅ YYYY-MM-DD`.
- При обсуждении и отказе — поменяй на `⛔` и зафиксируй причину в файле идеи (`not_applicable_for`).
- При предложении (не применено пока) — `⚠️`.

Краткость важнее красоты — это индекс, не дока.
