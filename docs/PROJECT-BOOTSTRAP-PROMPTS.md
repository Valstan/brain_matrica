# Bootstrap-промпты для проектных нейронок

Когда новая проектная сессия (Claude Code в `MatricaRMZ/`, `Gonba/`, `setka/`, `karman/`) впервые открывается **после** внедрения brain_matrica-протоколов, нейронка не знает что искать в `../brain_matrica/`. Этот файл — **copy-paste промпты** для @valstan: один раз скармливаешь нужный блок проектной нейронке, дальше она сама подтягивается и продолжит подхватывать почту в каждом /start.

## Как использовать

1. **Открой сессию в проекте** (например, Claude Code в `C:\GitHubProjects\MatricaRMZ\` или эквивалентном WORKSPACE_ROOT). Важно — `brain_matrica/` должен быть **рядом** в той же родительской папке, иначе `../brain_matrica/` не сработает.
2. Скопируй блок ниже для нужного проекта.
3. Вставь как первое сообщение нейронке.
4. Нейронка прочитает контекст + почту, обновит свой /start и пришлёт acknowledgement в `to-brain/` через PR.
5. После этого первый bootstrap закрыт — следующие сессии будут проверять почту автоматически.

## Общие предположения для всех промптов

- WORKSPACE_ROOT определяется автоматически (это `..` от текущего проекта)
- `brain_matrica/` лежит рядом с проектом
- Все письма используют ADR-0002 — direct push в main запрещён, всё через PR

---

## MatricaRMZ — bootstrap-промпт

```
Ты теперь под управлением мета-репозитория brain_matrica (лежит в ../brain_matrica/). Это репо стратегического управления всеми моими проектами через систему почтовых ящиков. У тебя там личный mailbox: ../brain_matrica/mailboxes/MatricaRMZ/.

Прочитай в таком порядке (read-only, ничего не меняй в brain_matrica/ кроме своего mailbox'а):
1. ../brain_matrica/CLAUDE.md — общий контекст brain_matrica
2. ../brain_matrica/docs/POSTULATES.md — книга постулатов (21 правило)
3. ../brain_matrica/adr/0001-brain-projects-mailboxes.md — протокол mailbox v2
4. ../brain_matrica/adr/0002-pr-only-flow-no-direct-push.md — PR-only flow
5. ../brain_matrica/projects/MatricaRMZ.md — что brain думает о тебе
6. ВСЕ письма в ../brain_matrica/mailboxes/MatricaRMZ/from-brain/*.md — их 4 на 2026-05-22:
   - mailbox-protocol-onboarding (kind=directive, без compliance → читать как MUST)
   - pr-only-flow-directive (без compliance → MUST)
   - compliance-levels-update (compliance=mandate, MUST)

Применяй директивы согласно compliance каждого письма:
- mandate (MUST) — обязательно
- recommend (SHOULD) — с адаптацией под проект, отказ обосновать
- suggest (MAY) — на усмотрение

После прочтения:
1. Обнови свой /start skill (или CLAUDE.md проекта) чтобы при каждом старте сессии:
   - Проверять ../brain_matrica/mailboxes/MatricaRMZ/from-brain/*.md (не DRAFTS, не ARCHIVE)
   - Обновлять ../brain_matrica/mailboxes/MatricaRMZ/.last-seen текущим ISO timestamp
   - Докладывать письма с форматом: [urgency COMPLIANCE] slug — topic
2. Пришли acknowledgement-письма в ../brain_matrica/mailboxes/MatricaRMZ/to-brain/ (по одному на каждое полученное директивное письмо, kind=feedback, compliance не нужен для feedback)
3. После применения каждой директивы — двигай оригинал в ../brain_matrica/mailboxes/MatricaRMZ/from-brain/ARCHIVE/ с дописанной секцией ## Result в конце

ВАЖНО: все изменения в brain_matrica делай через PR (по ADR-0002):
- Создай ветку в brain_matrica типа feat/matricarmz-acknowledgement
- Push, gh pr create, gh pr merge --squash --delete-branch
- В своём собственном репо MatricaRMZ — тоже PR-only flow начиная с этого момента

Сначала покажи мне план действий, ничего не делай без явного OK.
```

---

## GONBA — bootstrap-промпт

```
Ты теперь под управлением мета-репозитория brain_matrica (лежит в ../brain_matrica/). Это репо стратегического управления всеми моими проектами через систему почтовых ящиков. У тебя там личный mailbox: ../brain_matrica/mailboxes/GONBA/.

Прочитай в таком порядке (read-only, ничего не меняй в brain_matrica/ кроме своего mailbox'а):
1. ../brain_matrica/CLAUDE.md — общий контекст brain_matrica
2. ../brain_matrica/docs/POSTULATES.md — книга постулатов (21 правило)
3. ../brain_matrica/adr/0001-brain-projects-mailboxes.md — протокол mailbox v2
4. ../brain_matrica/adr/0002-pr-only-flow-no-direct-push.md — PR-only flow
5. ../brain_matrica/projects/GONBA.md — что brain думает о тебе
6. ВСЕ письма в ../brain_matrica/mailboxes/GONBA/from-brain/*.md — их 3 на 2026-05-22:
   - mailbox-protocol-onboarding (kind=directive, без compliance → читать как MUST)
   - pr-only-flow-directive (без compliance → MUST)
   - compliance-levels-update (compliance=mandate, MUST)

Применяй директивы согласно compliance каждого письма:
- mandate (MUST) — обязательно
- recommend (SHOULD) — с адаптацией под проект, отказ обосновать
- suggest (MAY) — на усмотрение

После прочтения:
1. Обнови свой /start skill (или CLAUDE.md проекта) чтобы при каждом старте сессии:
   - Проверять ../brain_matrica/mailboxes/GONBA/from-brain/*.md (не DRAFTS, не ARCHIVE)
   - Обновлять ../brain_matrica/mailboxes/GONBA/.last-seen текущим ISO timestamp
   - Докладывать письма с форматом: [urgency COMPLIANCE] slug — topic
2. Пришли acknowledgement-письма в ../brain_matrica/mailboxes/GONBA/to-brain/ (по одному на каждое полученное директивное письмо, kind=feedback)
3. После применения каждой директивы — двигай оригинал в ../brain_matrica/mailboxes/GONBA/from-brain/ARCHIVE/ с дописанной секцией ## Result

ОСОБОЕ ВНИМАНИЕ для GONBA: у тебя auto-deploy через .github/workflows/deploy-prod.yml при push в main. PR-only flow становится критичным gate'ом перед prod. Включи branch protection на GitHub для main в первую очередь — это в pr-only-flow-directive письме описано как follow-up.

ВАЖНО: все изменения в brain_matrica делай через PR (по ADR-0002):
- Создай ветку в brain_matrica типа feat/gonba-acknowledgement
- Push, gh pr create, gh pr merge --squash --delete-branch
- В своём собственном репо GONBA — тоже PR-only flow начиная с этого момента (auto-deploy теперь зависит от merge PR в main)

Сначала покажи мне план действий, ничего не делай без явного OK.
```

---

## setka — bootstrap-промпт

```
Ты теперь под управлением мета-репозитория brain_matrica (лежит в ../brain_matrica/). Это репо стратегического управления всеми моими проектами через систему почтовых ящиков. У тебя там личный mailbox: ../brain_matrica/mailboxes/setka/.

Прочитай в таком порядке (read-only, ничего не меняй в brain_matrica/ кроме своего mailbox'а):
1. ../brain_matrica/CLAUDE.md — общий контекст brain_matrica
2. ../brain_matrica/docs/POSTULATES.md — книга постулатов (21 правило)
3. ../brain_matrica/adr/0001-brain-projects-mailboxes.md — протокол mailbox v2
4. ../brain_matrica/adr/0002-pr-only-flow-no-direct-push.md — PR-only flow
5. ../brain_matrica/projects/setka.md — что brain думает о тебе
6. ВСЕ письма в ../brain_matrica/mailboxes/setka/from-brain/*.md — их 3 на 2026-05-22:
   - mailbox-protocol-onboarding (kind=directive, без compliance → читать как MUST)
   - pr-only-flow-directive (без compliance → MUST)
   - compliance-levels-update (compliance=mandate, MUST)

Применяй директивы согласно compliance каждого письма:
- mandate (MUST) — обязательно
- recommend (SHOULD) — с адаптацией под проект, отказ обосновать
- suggest (MAY) — на усмотрение

После прочтения:
1. Обнови свой /start skill (или /finish если у тебя так — у setka свой стиль docs: START_HERE + AI_DEV_GUIDE + DEV_HISTORY + /finish). Добавь проверку mailbox в начале каждой сессии:
   - Сканить ../brain_matrica/mailboxes/setka/from-brain/*.md (не DRAFTS, не ARCHIVE)
   - Обновлять ../brain_matrica/mailboxes/setka/.last-seen
   - Докладывать с форматом: [urgency COMPLIANCE] slug — topic
2. Пришли acknowledgement-письма в ../brain_matrica/mailboxes/setka/to-brain/ (по одному на каждое полученное директивное письмо)
3. После применения каждой директивы — двигай оригинал в ../brain_matrica/mailboxes/setka/from-brain/ARCHIVE/ с дописанной секцией ## Result

ОСОБОЕ ВНИМАНИЕ для setka: у тебя сейчас в работе большая нитка «модуль авто-регистрации регионов» (21 staged file). Pr-only-flow директива говорит — это идеальный кандидат на твой ПЕРВЫЙ PR на новой схеме вместо одного большого push в main. Применяй PR-flow начиная с этой нитки.

ВАЖНО: все изменения в brain_matrica делай через PR (по ADR-0002):
- Создай ветку в brain_matrica типа feat/setka-acknowledgement
- Push, gh pr create, gh pr merge --squash --delete-branch
- В своём собственном репо setka — тоже PR-only flow начиная с этого момента

Сначала покажи мне план действий, ничего не делай без явного OK.
```

---

## KARMAN — bootstrap-промпт

```
Ты теперь под управлением мета-репозитория brain_matrica (лежит в ../brain_matrica/). Это репо стратегического управления всеми моими проектами через систему почтовых ящиков. У тебя там личный mailbox: ../brain_matrica/mailboxes/KARMAN/.

ВАЖНО: KARMAN — новый проект в реестре brain_matrica (включён 2026-05-22). У тебя пока нет SESSION_HANDOFF.md, DEV_HISTORY.md и кастомного /start skill — это часть «отставания» о котором тебе пришло welcome-письмо. Действуй осторожно, не пытайся внедрить всё сразу.

Прочитай в таком порядке (read-only, ничего не меняй в brain_matrica/ кроме своего mailbox'а):
1. ../brain_matrica/CLAUDE.md — общий контекст brain_matrica
2. ../brain_matrica/docs/POSTULATES.md — книга постулатов (21 правило)
3. ../brain_matrica/adr/0001-brain-projects-mailboxes.md — протокол mailbox v2
4. ../brain_matrica/adr/0002-pr-only-flow-no-direct-push.md — PR-only flow
5. ../brain_matrica/projects/KARMAN.md — что brain думает о тебе (включая environment-секцию)
6. ВСЕ письма в ../brain_matrica/mailboxes/KARMAN/from-brain/*.md — их 4 на 2026-05-22:
   - welcome-to-brain-matrica (kind=report) — прочти ПЕРВЫМ, объясняет контекст
   - mailbox-protocol-onboarding (kind=directive, без compliance → читать как MUST)
   - pr-only-flow-directive (без compliance → MUST)
   - compliance-levels-update (compliance=mandate, MUST)

Применяй директивы согласно compliance:
- mandate (MUST) — обязательно
- recommend (SHOULD) — с адаптацией под проект, отказ обосновать
- suggest (MAY) — на усмотрение

После прочтения сделай ТОЛЬКО минимум (не углубляйся, ты только начинаешь):
1. Запомни (в личной памяти или CLAUDE.md): проверять mailbox ../brain_matrica/mailboxes/KARMAN/from-brain/*.md в начале каждой сессии. Обновлять .last-seen. Докладывать формат: [urgency COMPLIANCE] slug — topic.
2. Пришли по одному короткому acknowledgement в ../brain_matrica/mailboxes/KARMAN/to-brain/ на каждое директивное письмо (3 шт). welcome — не требует ack.
3. Не пытайся сейчас применить pr-only-flow к своему репо karman — у тебя нет активной разработки, применишь при первом же изменении кода в будущем.
4. Не создавай SESSION_HANDOFF / DEV_HISTORY / новые skills прямо сейчас — это придёт отдельными письмами с идеями #003 #004 в следующие сессии.

ВАЖНО: все изменения в brain_matrica делай через PR (по ADR-0002):
- Создай ветку в brain_matrica типа feat/karman-acknowledgement
- Push, gh pr create, gh pr merge --squash --delete-branch

Сначала покажи мне план действий, ничего не делай без явного OK.
```

---

## Шаблон для будущих проектов

Когда в реестр добавится новый проект `<NEWPROJECT>` — взять этот шаблон, подставить имя и специфику:

```
Ты теперь под управлением мета-репозитория brain_matrica (лежит в ../brain_matrica/). У тебя там личный mailbox: ../brain_matrica/mailboxes/<NEWPROJECT>/.

Прочитай в таком порядке:
1. ../brain_matrica/CLAUDE.md
2. ../brain_matrica/docs/POSTULATES.md
3. ../brain_matrica/adr/*.md (все ADR в реестре)
4. ../brain_matrica/projects/<NEWPROJECT>.md
5. ВСЕ письма в ../brain_matrica/mailboxes/<NEWPROJECT>/from-brain/*.md

Применяй директивы согласно compliance. Обнови /start чтобы проверять mailbox каждый раз. Пришли acknowledgement в to-brain/. Все изменения в brain_matrica через PR (ADR-0002).

Сначала покажи план, ничего не делай без OK.
```

---

## Что происходит после первого bootstrap

После того как каждый проект **один раз** прошёл этот промпт:
- В его CLAUDE.md / /start skill теперь зафиксирована инструкция «проверять mailbox»
- В `to-brain/` лежит acknowledgement от каждой директивы
- В `from-brain/ARCHIVE/` лежат обработанные письма с `## Result`
- `.last-seen` обновляется
- Все будущие письма от brain автоматически подхватываются в /start

Bootstrap-paradox разорван. brain_matrica теперь может слать любые письма — они дойдут.

## Стратегия отправки промптов пользователем

Рекомендуемый порядок (от простого к сложному):

1. **MatricaRMZ** первым — у него уже есть SESSION_HANDOFF + /close_session, легче всего добавить mailbox-проверку
2. **GONBA** вторым — у него тоже есть SESSION_HANDOFF, плюс auto-deploy критичен, надо как можно раньше включить PR-gate
3. **setka** третьим — свой стиль docs, нужна адаптация под /finish-цепочку
4. **KARMAN** последним — отстающий, потребует больше работы; сделаем когда первые трое подтвердили работоспособность протокола

Между проектами — давай мне знать что получилось, я смогу скорректировать промпт для следующего на основе опыта предыдущего.
