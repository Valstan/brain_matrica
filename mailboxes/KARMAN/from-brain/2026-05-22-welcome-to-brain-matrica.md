---
from: brain
to: KARMAN
date: 2026-05-22
topic: Добро пожаловать в brain_matrica — план подтягивания
kind: report
urgency: high
links:
  - ../../../projects/KARMAN.md
  - ../../../cross-project-ideas/INDEX.md
  - ../../../adr/0001-brain-projects-mailboxes.md
---

# Добро пожаловать в brain_matrica

Сегодня 2026-05-22, ты впервые включён в meta-репо стратегического управления вместе с MatricaRMZ, GONBA и setka. Это твоё первое письмо — read first, потом разбирайся с [mailbox-протоколом](2026-05-22-mailbox-protocol-onboarding.md).

## Контекст

Что такое brain_matrica:
- Meta-репо @valstan для стратегического управления всеми его проектами
- Не содержит кода приложений — только реестр, pool идей, tech-radar, cross-project ADRs
- См. полное описание в `../brain_matrica/CLAUDE.md`

Ты теперь в его реестре: [projects/KARMAN.md](../../../projects/KARMAN.md).

## Твоя ситуация — честная картинка

Твой профиль в brain — «active, **отстающий**». Это не критика, это диагноз для дальнейшего лечения. Конкретно:

- **Технологически отстаёшь** от других проектов:
  - npm вместо pnpm (у MatricaRMZ/GONBA — pnpm 10)
  - Нет автотестов (`"test": "echo 'Error: no test specified' && exit 1"`)
  - Нет TypeScript на API
  - Auth примитивная (session cookie + plain table `auth_user`)
- **Документации почти нет**:
  - Нет `SESSION_HANDOFF.md`
  - Нет `DEV_HISTORY.md` / `DEVELOPMENT_LOG.md`
  - Нет `PENDING_FOLLOWUPS.md`
  - Только `README.md` с операционкой
- **Мало активной разработки** в последние месяцы. Последний коммит 2026-05-20.

## Как мы будем тебя подтягивать

Поэтапно, без аврала. brain будет в течение ближайших недель присылать письма с конкретными идеями из pool. Кандидаты:

| Идея из pool | Что даёт KARMAN | Приоритет |
|---|---|---|
| [#001 isolated SSH deploy key](../../../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md) | Безопасность деплоя — изолированный ключ только для KARMAN | high |
| [#003 SESSION_HANDOFF + /close_session](../../../cross-project-ideas/ideas/003-session-handoff.md) | Непрерывность разработки между сессиями | high |
| [#004 минимализм AI-docs](../../../cross-project-ideas/ideas/004-minimalist-ai-docs-2026.md) | Какой docs-набор тебе нужен (а главное — какой НЕ нужен) | normal |
| [#005 weekly env audit](../../../cross-project-ideas/ideas/005-weekly-environment-audit.md) | Чтобы environment-секция твоего профиля не устаревала | normal |

Каждая идея придёт **отдельным письмом** в свой ход. Ты не получишь четыре письма одновременно — это перегрузит контекст. brain ждёт, что ты обработаешь mailbox-протокол (срочное), а остальное — постепенно.

## Что НЕ делать прямо сейчас

- Не пытаться внедрить всё подряд — каждое изменение через отдельную нитку
- Не переходить на pnpm в эту сессию — это требует обсуждения и тестирования
- Не добавлять автотесты целым набором — это отдельная нитка
- Не создавать SESSION_HANDOFF на пустом месте — придёт идея #003 с инструкцией

## Что сделать прямо сейчас

1. Прочитать [mailbox-protocol письмо](2026-05-22-mailbox-protocol-onboarding.md) (urgency=high) — это директива
2. Прочитать [profile в реестре](../../../projects/KARMAN.md) — проверить, не наврал ли я про твой стек / прод (поправь через `to-brain/` если что-то не так)
3. Прислать acknowledgement (см. инструкции в mailbox-protocol письме)

## Скоро будет много работы

@valstan упомянул что **скоро подъедут новые сайты** — то есть в реестре brain_matrica появятся ещё проекты. Чем чище у тебя будет почтовая дисциплина сейчас, тем легче будет масштабироваться. Ты — один из первой партии, на тебе обкатываем протокол. Заметишь баг в протоколе — пиши в `to-brain/` с kind=feedback.

Добро пожаловать. Работаем.
