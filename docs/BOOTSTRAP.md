# BOOTSTRAP — развёртывание на новом компе

Этот файл — инструкция и контракт. brain_matrica использует его чтобы помогать пользователю развернуть все управляемые проекты на новой машине.

## Принцип

**Все клоны живут в одной родительской папке `WORKSPACE_ROOT`** на каждом компе. Имя клона = имя GitHub-репо (case-sensitive). brain_matrica — это **тоже клон в этой папке**.

Гарантия: относительные пути `../<project>/` всегда работают из любой проектной сессии, не нужны env vars и absolute paths в CLAUDE.md проектов.

## Допустимые WORKSPACE_ROOT

| Компьютер | WORKSPACE_ROOT |
|---|---|
| Текущая Windows-машина @valstan (2026-05-22) | `C:\GitHubProjects\` |
| Запасная Windows (исторически) | `D:\GitHubReps\` |
| UNIX-машины (Linux / macOS) | `~/dev/` или `~/GitHubProjects/` |

Любой из вариантов легитимен. brain при `/start` определяет фактический root через путь к своей собственной папке (`..` от brain_matrica).

## Bootstrap нового компа — шаги

### 1. Создать `WORKSPACE_ROOT`

Windows:
```powershell
New-Item -ItemType Directory -Force C:\GitHubProjects
Set-Location C:\GitHubProjects
```

UNIX:
```bash
mkdir -p ~/dev
cd ~/dev
```

### 2. Клонировать brain_matrica первым

```bash
git clone https://github.com/Valstan/brain_matrica.git
```

После клонирования открыть meta-сессию в `brain_matrica/`, запустить `/start`. brain прочитает реестр и предложит клонировать остальные проекты.

### 3. Клонировать все управляемые проекты

```bash
git clone https://github.com/Valstan/MatricaRMZ.git
git clone https://github.com/Valstan/Gonba.git
git clone https://github.com/Valstan/setka.git
git clone https://github.com/Valstan/karman.git
```

Архивные проекты (postopus, mikrokredit) на новый комп **не клонируем** — см. [projects/INDEX.md → Архив](../projects/INDEX.md).

### 4. Для каждого проекта — выполнить его Environment-секцию

В каждом `projects/<P>.md` есть секция **Environment / Setup on new machine** со списком пререквизитов и команд установки. brain в `/start` нового компа предложит пройти их по одному.

Сводка пререквизитов (по состоянию на 2026-05-22):

| Проект | Runtime | Package manager | БД | Прочее |
|---|---|---|---|---|
| MatricaRMZ | Node 22 + Electron | pnpm 10 (corepack) | PostgreSQL 16 | GitHub Actions для Windows installer |
| GONBA | Node.js (Next.js 15) | pnpm 10 (corepack, **не** pnpm 11) | PostgreSQL | Payload CMS; на Windows: `corepack pnpm` требует `script-shell = bash.exe` |
| setka | Python 3.12 прод / 3.11 локально для тестов | pip + venv | Redis + (БД?) | Celery worker+beat; **не запускать `main.py` локально** |
| KARMAN | Node ≥ 18 | npm | PostgreSQL (`karman_db`) | nginx; Cursor Model Monitor (env vars CURSOR_MODEL_*, TELEGRAM_*) |

### 5. SSH ключи

Каждый проект имеет **изолированный SSH deploy-ключ** (см. [идея #001](../cross-project-ideas/ideas/001-isolated-deploy-ssh-key.md)). При bootstrap нового dev-компа deploy-ключи **не переносятся** — это ключи продакшна. Dev-машина пушит в GitHub своим личным ключом разработчика.

SSH aliases для прода (`~/.ssh/config`):
- `matricarmz` — MatricaRMZ VPS
- `GONBA` — GONBA VPS
- `setka-prod` — setka VPS
- KARMAN — _(уточнить)_

### 6. Проверка после bootstrap

В meta-сессии brain_matrica:
- `/start` — должен корректно прочитать реестр, mailbox'ы, найти все клоны проектов
- В каждой проектной сессии — `/start` должен прочитать почту из `../brain_matrica/mailboxes/<self>/from-brain/`

## Принципы

См. [POSTULATES.md](POSTULATES.md):
- §III.12 — все клоны в одной WORKSPACE_ROOT
- §III.13 — имя локальной папки = имя GitHub-репо (case-sensitive)

## Weekly audit

Раз в неделю brain пробегается auditor-проходом по всем проектам и **обновляет** в `projects/<P>.md`:
- Стек (если что-то поменялось в `package.json` / `requirements.txt`)
- Environment-секцию (новые env vars, новые пререквизиты)
- Фазу разработки

Идея процесса формализована в [pool/005](../cross-project-ideas/ideas/005-weekly-environment-audit.md).
