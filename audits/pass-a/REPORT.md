# Pass A: accessibility (WCAG 2.1 AA)

**Date:** 2026-11-26 · **Scope:** contrast and form issues from `audits/2026-11-26-unslop-audit.md`, plus the AA failures that turned up while checking them. The palette, type and layout are unchanged except where a fix required a change.

## Fixed

| WCAG | Issue | Fix | Before → after |
|---|---|---|---|
| 1.4.3 Contrast | `--text-muted` `#444444` was used for stat labels, footer links, form labels, publication blurbs and placeholder captions | `#828282` | 2.06 → **5.21** on bg · 1.94 → **4.91** on surface · 1.79 → **4.53** on elevated |
| 1.4.3 Contrast | Placeholder text in form fields used the browser default | Set to `--text-secondary` | **5.33** on field background |
| 1.4.11 Non-text contrast | Form field edges were white at 7% (field barely distinguishable from the page) | New `--border-control: #666666` | 1.19 → **3.29** against the field, **3.49** against the page |
| 2.4.7 Focus visible | Inputs had `outline: none`, and focus only tinted the border at 28% teal | Global `:focus-visible` 2px teal ring, and the input border goes to full teal on focus | ring 1.42 → **5.14** |
| 4.1.2 / 3.3.2 Labels | The newsletter email had no label (placeholder only). The waitlist email had only `aria-label` | Real `<label>` elements, visually hidden | (not a ratio) |
| 1.3.5 Input purpose | No `autocomplete` on the name and email fields | `autocomplete="name"` / `"email"` | (not a ratio) |
| Forms (broken) | Contact, newsletter and waitlist forms showed "Sent", "Subscribed" or "You're on the list" but sent nothing | All three are wired to Netlify Forms (`contact`, `newsletter`, `tad-waitlist`), with a spam honeypot. The fake JS and inline `onsubmit` handlers are removed | (not a ratio) |
| 1.4.10 Reflow | The Publications heading and newsletter block ran 380px wide on a 320px screen, so the title was clipped | The long title scales down under 480px, and the newsletter block stacks | 80–299px overflow → **0** |
| 2.4.3 Focus order | The closed mobile menu's links were still reachable by Tab, so focus disappeared into an invisible overlay | `visibility: hidden` when closed. Escape closes it and returns focus to the button | (not a ratio) |
| 4.1.2 Name, role, value | The menu button had no expanded state, the filter tabs had no selected state, and the current page wasn't marked in the nav | `aria-expanded` / `aria-controls`, `aria-pressed`, `aria-current="page"` | (not a ratio) |
| 2.4.1 Bypass blocks | No skip link and no `<main>` | A "Skip to content" link (visible on focus) and a `<main id="main">` on all 9 pages | (not a ratio) |
| 2.1.1 / 1.4.13 | The featured-card text and project-card arrows only appeared on mouse hover | Keyboard focus now reveals them the same way | (not a ratio) |
| (beyond AA) | No reduced-motion support | `prefers-reduced-motion` turns off the intro animations and transitions | (not a ratio) |

## Not fixed: needs your call (brand colour)

**"Coming Soon" badges on the shop page** use teal text on a 12% teal tint over the grey placeholder, which gives **3.87:1** (needs 4.5). Fixing it means changing how the brand teal is used:

| Option | Change | Result |
|---|---|---|
| 1 | Badge gets a solid `#080808` background, and the teal stays as is | **5.14:1** |
| 2 | Badge text uses the existing lighter teal `--accent-light #52A5A5` | **5.23:1** |
| 3 | Shift the brand accent site-wide from `#468C8C` to `#509C9C` | **4.61:1** on the badge. Also lifts every other teal use (5.14 → 6.27 on bg) |

## Other things to know
- **Netlify Forms needs form detection turned on** in your Netlify site settings (Forms). After that, submissions appear in the Netlify dashboard. The newsletter and waitlist emails only collect there. Nothing sends mail yet.
- **The muted tier is now close to the secondary text** (`#828282` against `#888888`), so the three-level text hierarchy has flattened. Restoring it is a palette decision for Pass C.
- **Checked here:** contrast of every visible text element on all 9 pages (rendered in Chromium), reflow at 320px, and keyboard Tab order. **Not checked:** real screen readers (VoiceOver/NVDA) and 200% browser zoom on a device.
- **Left as is (passes AA or out of scope):** the teal accent as text (5.14 on the page, 4.85 on surfaces), the heading levels that jump from h1 to h3 (not an AA failure), and the exhibition venue column hidden on phones.

## Screenshots
`before-*` / `after-*`: contact form with focus on Email, the home stats labels, and Publications at 320px. `after-skip-link-320.png` shows the skip link on first Tab.
