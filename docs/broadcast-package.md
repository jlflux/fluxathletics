# Flux Athletics — broadcast graphics package

A design spec for the on-air package shown on the Broadcaster's Toolkit page.
A working prototype lives at `broadcast/preview.html` — open it and drive the
elements with the controls underneath.

This file is written to be handed to a designer, to Claude Design, or to a new
chat, with enough detail that the result matches without further explanation.

---

## 1. The idea in one line

The Flux mark is three bars leaning 4 across for every 8 down. **Every element
in the package is cut at that same angle**, so a score bug, a lower third and a
sponsor billboard read as pieces of one system rather than three templates that
happen to share a colour.

---

## 2. Tokens

| Token | Value | Use |
|---|---|---|
| Ink | `#0B0B0C` | Element backgrounds, always at 88–94% opacity over video |
| Paper | `#F5F3EF` | Primary text |
| Primary | `#0DF786` | Clock segment, rules, accent numerals, wipes |
| Support | `#889165` | Secondary labels, row numbers, muted metadata |
| Lean angle | `-26.57deg` | `skewX()` on every element. This is `atan(4/8)` — the mark's own slant |

**Type**

- Display: **Archivo 800**, uppercase, letter-spacing `-0.02em` — team names,
  titles, scores, headers
- Mono: system monospace, `letter-spacing 0.16em`, uppercase — clocks, kickers,
  sponsor lines, row numbers
- Never use a third family. The mono/display contrast is the whole voice.

**Applying the skew.** Skew the container, counter-skew the text:

```css
.element      { transform: skewX(-26.57deg); }
.element > *  { transform: skewX(26.57deg); }   /* keeps type upright */
```

---

## 3. Canvas

- **1920 × 1080**, transparent background, 60fps target
- **Title safe: 4.2% inset** on all sides — every element anchors to that, never
  to the frame edge
- Base unit: `1em = 1.55%` of frame width (≈30px at 1920). All sizes below are
  in that em so the package scales to 720p or 4K untouched
- Elements anchored to the bottom share one `--bottom` baseline. Raising the
  ticker lifts all of them together — they must never stack

---

## 4. Element inventory

### 4.1 Score bug — bottom left, persistent
Segmented row, each segment skewed, 1px gaps:

`[TEAM][SCORE][TEAM][SCORE][PERIOD + CLOCK]`

- Team segments: ink background, 0.32em team-colour bar inset on the leading
  edge, min-width 6.2em, display 800 at 1.02em
- Score segments: `#17181c`, min-width 3.1em, display 800 at 1.28em. The home
  score is tinted primary
- Clock segment: **primary fill, ink text** — the only saturated block in the
  normal state, so the eye lands on game state first. Period in display, clock
  in mono tabular numerals
- Possession: 0.55em primary square, centred above the team segment
- Timeouts: row of 0.38em dots, filled primary, spent dots at 28% paper
- Motion: in/out on `translateY(160%)`, 550ms

States needed: pre-game, in-play, timeout, period break, overtime, final.

### 4.2 Lower third — bottom left
- 0.34em primary rule across the top, ink body at 93% under a 6px blur
- Title: display 800, 1.62em, uppercase
- Sponsor/subtitle: mono 0.72em, `0.16em` tracking, primary
- Width `min(46%, 34em)`
- Sits **4.9em above** the score bug when both are live
- Motion: `translateY(150%)`, 500ms

Variants: name key, matchup, quote, sponsor read.

### 4.3 Stat card — bottom right
- Primary header bar, ink text, display 800 uppercase
- Rows: 1px paper-10% dividers, mono index in support, display name, primary value
- Width `min(38%, 26em)`, 3–5 rows
- Motion: `translateX(130%)`, 550ms

### 4.4 Full-frame sponsor billboard
- Ink at 93% over the whole frame
- Kicker: mono, `0.3em` tracking, support
- Logo lockup: display 800 at 3.4em, one word in primary
- 0.3em primary rule, 7em wide, skewed, centred beneath
- Motion: cross-fade 450ms. Hold 4–6s

### 4.5 Corner sponsor bug — top right
- Ink 82%, 1px primary-32% border, skewed
- `PRESENTED BY` in mono support + partner in display
- Rotates on a fixed interval, logs each appearance for as-run reporting

### 4.6 Ticker — full width, bottom
- 2.6em tall, ink 94%
- Label block: primary fill, ink text, clipped at the lean angle on its trailing
  edge, `z-index` above the scroll window
- Scroll window clips the track; track loops on a duplicated list

### 4.7 Transition wipe
- Full-bleed primary panel, skewed, sweeping left→right
- 1s total: 0–45% in, 45–55% hold, 55–100% out. Cut under the hold

---

## 5. Motion rules

- One easing curve everywhere: `cubic-bezier(0.22, 1, 0.36, 1)`
- In 500–550ms, out 400ms. Nothing slower — this is live sport
- Elements enter from the edge they are anchored to
- Never animate two elements in at once; stagger by 120ms
- Respect a "reduced motion" build for venue boards that cannot cope

---

## 6. Data bindings

Each field should read from a feed, not be typed between whistles:

| Field | Source |
|---|---|
| Score, period, clock, possession, timeouts | Scoring console / clock feed |
| Team names, abbreviations, colours | Season config |
| Player names and stat values | Stat provider or manual stat entry |
| Sponsor name, artwork, rotation order | Sponsorship schedule |
| Ticker items | Scores feed + manual promo entries |

---

## 7. Deliverables

1. **Browser-source overlay** (HTML/CSS/JS, transparent) for any switcher that
   accepts a browser input
2. **Operator control surface** — a separate page driving the overlay
3. **Static exports** — PNG/SVG of each element for edit and social
4. **Brand config** — one JSON of colours, team list and sponsor rotation

---

## 8. What the prototype does not yet do

`broadcast/preview.html` is a real implementation of the design, not a
production tool. To run a live show it still needs:

- **A control channel.** The overlay runs inside the switcher's own browser;
  a control page in your browser cannot reach it through `localStorage` or
  `BroadcastChannel`. That needs a small WebSocket or HTTP server both ends
  connect to.
- **A data feed.** Clock and score have to arrive from the scoring system.
- **Per-sport variants.** The current build is scoped to a clock-and-period
  sport. Baseball, volleyball, tennis and track each need their own bug.

---

## 9. Prompt to continue this elsewhere

> Design a live sports broadcast graphics package for Flux Athletics.
>
> Brand: ink `#0B0B0C`, paper `#F5F3EF`, primary `#0DF786`, support `#889165`.
> Display type Archivo 800 uppercase with `-0.02em` tracking; monospace for
> clocks, kickers and sponsor lines with `0.16em` tracking. No third typeface.
>
> The signature move: every element is skewed `-26.57deg` on the X axis, with
> text counter-skewed to stay upright. That angle comes from the Flux mark,
> whose bars lean 4 across for every 8 down. It must appear in every element.
>
> Canvas 1920×1080, transparent, 4.2% title-safe inset. Base unit 1em = 1.55%
> of frame width.
>
> Produce: score bug (segmented, with the clock segment as the only saturated
> block), lower third, stat card, full-frame sponsor billboard, corner sponsor
> bug, ticker, and a diagonal transition wipe. Bottom-anchored elements share
> one baseline and must never overlap. One easing curve throughout:
> `cubic-bezier(0.22, 1, 0.36, 1)`, in 500–550ms, out 400ms.

---

## 10. Honest note on the sample content

Team names, player names and scores in the prototype are invented placeholders.
Nothing in it represents a real game, a real partner, or work delivered for a
real client. Replace all of it before showing it to anyone as a credential.
