# Kriya model routing — recommendation

**Version 2026-07-02** · derived from measured runs, not vibes.
Source labs: [`sonnet5-vs-opus48-default`](../sonnet5-vs-opus48-default/) · [`sonnet5-vs-opus48-ultrathink`](../sonnet5-vs-opus48-ultrathink/) · [`fable5-vs-opus48-burnzone`](../fable5-vs-opus48-burnzone/).
Machine-readable: [`routing.json`](routing.json).

This is the actionable output of the model labs: **which model + effort tier each Kriya agent role should use**, with the evidence behind it. Wire it into Kriya's per-agent front-matter / tech-radar.

## Headline

**Opus 4.8 stays Kriya's backbone.** The BurnZone lab tested whether the most capable model — **Fable 5** — should take over the build. It shouldn't, for a mid-size brownfield: Fable **tied** Opus 4.8 on the build and design roles at **~2× the cost**, and on **both security roles its classifiers declined** and Claude Code **silently served Opus 4.8** anyway (slower and dearer). Reserve Fable 5 for genuinely frontier work above Opus's ceiling.

## The table

| Kriya role | Stage | Model | Effort | Why (evidence) |
|---|---|---|---|---|
| **Gate verifier** | verify · independent gate | `claude-opus-4-8` | `high` | Most exhaustive enumeration, fewest misses; verdict effort-robust. **Not Fable** — the BurnZone gate prompt tripped its classifiers and fell back to Opus. (Sonnet Task C: 11→14 findings, VETO both. BurnZone Task D: direct Opus caught the planted fail-open + a collation-bypass beyond the real fix.) |
| **Producer — design** | design · LLD · shift-left · strangler plan | `claude-opus-4-8` | `high` | On BurnZone Stage-0, **Fable & Opus both scored 16/16** with the same lone miss and both found the already-minted-JWT/key-rotation insight — a dead heat at **1.96× cost**. Opus is the value pick; Sonnet 5 is the cheaper alt (cap verbosity). Escalate to Fable only above Opus's ceiling. |
| **Producer — code** | build · brownfield | `claude-opus-4-8` | `high` | BurnZone booking-fix: **identical, textbook-correct fix from both** (same LEFT JOIN, 4/4 invariants, `b.*` collision insight) — a TIE. Fable was terser (0.64× tokens) but cost ~2×. |
| **Security critic** | security capture · threat model · auth audit | `claude-opus-4-8` | `high` | Route here **explicitly**. Fable's cyber classifiers declined the BurnZone audit prompt; Claude Code re-served it with Opus at a cost+latency premium ($0.47/394s vs direct $0.32/133s). Direct Opus: 8 findings, 2/2 seeded criticals, 0 false positives. |
| **High-volume worker** | drafts · triage · breadth | `claude-sonnet-5` | `default` | Cost-efficient, adequate recall for non-gate work. Fable is the wrong tier — 2× price for no measured gain. (~5% std / 37% intro cheaper than Opus.) |
| **Frontier build** *(conditional)* | novel · long-horizon · above-Opus-ceiling only | `claude-fable-5` | `high` | Where the Fable premium *could* pay off — but BurnZone was **not** such a case (Fable tied Opus). Re-run the head-to-head when Kriya hits a task Opus struggles with; only then justify 2×. Excludes security-flavoured tasks. |
| **Critical audit** | highest-stakes review | **ensemble** `opus-4-8` **+** `sonnet-5` | `max` | Complementary blind spots that effort doesn't close; union both. Fable isn't an audit ensemble member — classifiers decline the content. |

## Principles

1. **The most capable model isn't the default-right model.** On a mid-size brownfield, Fable 5 tied Opus 4.8 at 2× cost — capability you don't need is just spend. Escalate to Fable only when Opus's ceiling is the bottleneck.
2. **Never route security-critic or gate roles to Fable 5.** Its classifiers decline cyber content; via Claude Code you silently get Opus 4.8, and a raw API call could refuse outright. Make the routing match reality.
3. **Verify the *served* model, not the requested one.** 2 of 4 Fable requests here were served by Opus — invisible without billing telemetry.
4. **Pay for max effort on *enumeration*, not on *PASS/VETO*.** The binary gate decision was robust to effort.
5. **Cap Sonnet 5's output** (1.5–1.9× verbosity). Fable 5, by contrast, was *terser* than Opus.
6. **Front-load Sonnet-heavy work before 2026-08-31**, while intro pricing ($2/$10) makes it ~37–40% cheaper.

## Caveats

Single run per task (signal, not a benchmark) · only **2 of 4** BurnZone tasks are true Fable-vs-Opus (security tasks fell back to Opus) · the Fable→Opus fallback is a Claude Code behaviour (a raw API call could refuse outright) · graded vs real-commit/published keys by the author + independent grader agents, not a blind panel · effort held **equal** across arms · costs at official published rates.

---
*Regenerate after any new lab: `python3 harness/grade.py …` → update `routing.json`. See [`../harness/README.md`](../harness/README.md).*
