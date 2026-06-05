# AI Usage Log

How AI tooling was used to build this project.

| Tool | Used for |
| --- | --- |
| **Claude Code** | Implementation: components, hooks, tests (TDD red → green → refactor), CSS, refactors, and the living [`SUMMARY.md`](SUMMARY.md). |
| **Claude** | Design: hero/handoff concepts, layout direction, copy and visual-language decisions. |
| **Vimeo** | Source of the ambient world video clips (optimized into WebM/MP4 + posters in `public/worlds/`). |
| **Codex** | Code reviews of changes. |

## Notes

- All AI-generated code is gated by the repo's quality bar: a covering test, `pnpm test` / `typecheck` / `lint` green, and the component rules in [`CLAUDE.md`](CLAUDE.md).
- Design handoffs were produced as written specs and implemented test-first; deviations from a handoff are recorded as decisions in `SUMMARY.md`.
