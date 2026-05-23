# Groq

**Category:** ai (LLM inference)
**Ring:** assess
**Used in:** _(нигде из 4 управляемых проектов)_
**First noted:** 2026-05-23 (handoff упомянул как кандидат для tech-radar)

## What
LLM inference провайдер на собственных LPU (Language Processing Units). Гонит open-source модели (Llama 3.x, Mixtral, Gemma) на скоростях, недостижимых для GPU-провайдеров — сотни tokens/sec.

## Why interesting
- Очень быстрый inference → real-time UX для AI-фич (стриминг ощущается мгновенным).
- OpenAI-совместимое API → легко вставить в существующий код.
- Бесплатный tier для прототипов.
- Альтернатива Anthropic/OpenAI там, где скорость > качество (классификация, экстракция, простые трансформации).

## Alternatives considered (still in assess)
- **Anthropic Claude API** — наш основной AI-стек (через Claude Code); качество > скорость.
- **OpenAI API** — мейнстрим, но дороже и медленнее Groq на open-source моделях.
- **Local Ollama / llama.cpp** — control + privacy, но требует своего железа.

## Open questions
- Где может пригодиться: классификация писем в mailbox-сценарии? Парсинг неструктурированных VK-данных (setka)? Авто-теги в Payload (GONBA)?
- Стабильность SLA для прод-задач (Groq всё ещё young).

## Notes
_(не пробовали — assess. При первом эксперименте перевести в `trial`.)_

## References
- https://groq.com/
- https://console.groq.com/docs
