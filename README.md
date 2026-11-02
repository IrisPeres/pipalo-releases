# Pipalo

**Meet Pip, your pal.**

Pip is a tiny pixel blob for your Mac's screen corner. It fills with water as you use your AI budget. It reminds you to drink, sit up straight and log off. It works with Claude Code. Everything stays on your Mac.

![Pip, a pixel blob, in seven short scenes. The orange water in its body rises as the budget is used and Pip gets nervous. A context gauge fills beside it. Pip cheers for a tip, stands tall, takes sips of water, and puts on sunglasses to stroll on a sun walk.](assets/pip-tour.gif)

This repository holds **downloads, release notes and feedback** for Pipalo. The app's source code is not published here.

## Status

Pre-release. There is no download yet, so there is nothing to install from here. Homebrew (`brew install --cask pipalo`) is coming soon.

Needs macOS on Apple silicon. Claude Code is optional: without it the wellbeing features still work, and the token features have nothing to show.

## What Pip does

**Token water.** The water level is your monthly budget, read from the files Claude Code already keeps on your machine. Pip is calm when there is plenty of room, and nervous when you burn tokens fast.

**Context gauge.** A small bar beside Pip shows how full your active session's context window is.

**Wellbeing nudges.** Skipping is always allowed and never nags.

- **Hourly movement:** stand up and walk every hour.
- **20-20-20 eye rest:** look 20 feet away for 20 seconds, with a live countdown.
- **Hydration:** a drink of water every 45 minutes, and Pip drinks along.
- **Sun walk:** a lunchtime walk suggestion, only when the forecast is sunny.
- **Pomodoro:** optional focus sessions that hold every other nudge.

Pip also has micro-breaks, fruit and lunch reminders, a screen-time nudge, an end-of-day yawn, and settings to switch off or retime each reminder.

## Privacy

- No account to create and no sign-in.
- No telemetry, analytics, crash reporting or auto-update.
- Usage comes from the local files Claude Code writes, never from a server of ours.
- It reads token counts, model names, file sizes and timestamps. It never reads what you type or what Claude writes back.
- A Permissions panel lists everything Pipalo reads and where anything is sent, with a switch for each.

## Feedback

Found a bug or have an idea? [Open an issue](../../issues/new). Please do not paste tokens, customer data or anything private.

## Rights

Copyright (c) 2026 Iris Peres. All rights reserved. The name, mascot and artwork may not be reused.

Pipalo is an independent project, not affiliated with or endorsed by Anthropic. "Claude" and "Claude Code" are trademarks of Anthropic.
