# zachgracia.com: AI-slop audit

**Date:** 2026-11-26 · **Scope:** every HTML page, `css/styles.css`, `js/main.js`, all at commit `ef6f4e3`. This was read-only: no site files were changed.

**Method:** I read the source line by line. I didn't render the pages. The repo has **no image files at all**, so I couldn't judge your artwork itself. That matters for item 1 below.

---

## 0. The short version

The site is a well-built example of the standard "dark cinematic portfolio" template. It uses a near-black background, one teal accent, grain, radial glows, Barlow Condensed 900 in all caps, tracked micro-labels on everything, cards that zoom on hover with a gradient overlay, a stats strip, a ghosted monogram and a vertical "Scroll" cue. None of it is wrong, but none of it is *yours*. Three things carry nearly all of the "made by a machine" feeling:

1. **Not a single piece of your art is on the site.** There are 65 grey grid boxes labelled `[ TAD — Hero Brand Image ]`.
2. **The copy repeats a handful of stock phrases.** "At the intersection of art, culture, and play" appears 4 times, "at the edge of…" 3 times, "not a portfolio piece" 3 times, and "$500M" 5 times.
3. **Every case study uses the same mould:** label, then a giant title, then a 680px paragraph, then a grid of boxes with 3px gaps.

Also, **"Artist, Designer, World Builder" appears nowhere.** The site currently sells "Creative Director · Toy Designer · Illustrator · Original IP Creator".

---

## 1. Page inventory

| # | Page | File | What it is |
|---|------|------|-----------|
| 1 | Home | `index.html` | Hero, 3 featured cards, stats strip, about teaser |
| 2 | Work | `portfolio.html` | Filterable grid of 11 cards (all link to 3 pages) |
| 3 | About | `about.html` | Bio, credentials column, portrait slot, 15-item exhibitions list |
| 4 | Publications | `publications.html` | 6 cards (4 unpublished newsletter pitches, 2 press notes) and a newsletter signup |
| 5 | Contact | `contact.html` | Email, social links, form |
| 6 | Shop TAD | `cart.html` | Waitlist form, 3 "Coming Soon" drops, brand statement |
| 7 | TAD case study | `projects/tad.html` | Brand, figures, apparel, packaging |
| 8 | VNCE case study | `projects/vnce.html` | Character, specs, world, illustration, merch |
| 9 | Disney & Beyond | `projects/disney.html` | 6 numbered sub-projects |
| – | Shared | `css/styles.css` (1,380 lines), `js/main.js` | Tokens, components, nav and filter and form JS |

---

## 2. Findings

Each finding gives the location, what's wrong and a one-line fix. **Rank** is one of: **F1** (Fix first), **F2** (Fix next) or **L** (Leave it).

### 2a. Shared CSS: `css/styles.css`

| Rank | Selector / line | What's wrong | Fix |
|---|---|---|---|
| F1 | `.ph`, `.ph::before`, `.ph-label` L272–304 | A grid-paper placeholder with `[ … ]` labels is what visitors see in 65 places. It reads as an unfinished template. | Replace every `.ph` with your real work (`<img>`/`<video>`). Delete `.ph` once none are left. |
| F1 | `:root` colours L7–18 | `#080808` with one desaturated teal (`#468C8C`) and white at 7% and 13% for borders is the default "dark premium" palette. Nothing in it comes from your art. | Build the palette from your TAD and VNCE artwork: one ground, one ink and 2–3 colours sampled from the work itself. |
| F1 | `--text-muted: #444444` L13 | This is about 2.2:1 on `#080808`. It fails WCAG and is used for stat labels, footer links, form labels and pub-card text. | Raise it to at least `#8a8a8a`-equivalent (4.5:1) or drop the muted tier. |
| F1 | `@import` and font tokens L1, L23–25 | Barlow Condensed with Space Grotesk and Inter is three stock Google fonts doing one job. The condensed 900 caps is the most common "bold portfolio" choice there is. | Use one display face with character (or your own hand-lettered wordmark for names and titles) and one text face. Drop the third. |
| F2 | `.label` L71–78 and its ~20 clones (`.hero-eyebrow` L363, `.featured-card-brand` L530, `.project-card-brand` L763, `.project-meta-label` L854, `.project-section-label` L875, `.credential-group-label` L962, `.form-label` L1090, `.pub-card-type` L1135, `.cart-hero-eyebrow` L1184…) | Every section starts with a 0.6–0.7rem, 0.18–0.2em-tracked, uppercase teal label. It's the most recognisable AI-template tic, and it flattens the hierarchy because everything gets announced. | Keep labels only where they help someone find their way (meta, dates). Cut the rest, and merge what's left into one `.label` class. |
| F2 | `body::after` grain L52–61 | Fixed grain at 2.8% opacity is a stock "cinematic" filter. | Remove it, or use a real scanned texture from your own paper or sketchbook. |
| F2 | `.hero-bg-text` L327–342 | A ghosted giant "ZG" behind the hero is a template trope. | Remove it, or replace with a real mark of yours (signature, sketch, character silhouette). |
| F2 | `.hero-accent-line` L344–352, `.hero-scroll*` L441–465 | Vertical gradient hairline and a vertical "Scroll" cue are both stock decoration. | Delete both. Let a piece of art fill the hero instead. |
| F2 | Staggered `fadeUp` on hero L371–438, keyframes L1330–1341 | Five-step 0.1s–0.55s stagger fade-up is the default intro animation, and there's no `prefers-reduced-motion` guard. | Cut it to one deliberate reveal (or none), and add a reduced-motion media query. |
| F2 | `.featured-card:hover … scale(1.04)` L511, `.project-card` L753, `.drop-card` L1254; overlay gradient L513–519 | Zoom-on-hover with a bottom-dark gradient on every card is the template card. | Show the work flat and uncropped. Use a caption under it, not an overlay on it. |
| F2 | `.featured-card-desc { opacity: 0 }` L553–557, `.project-card-arrow { opacity: 0 }` L781 | Descriptions and arrows only show on hover, so touch users never see them. | Show them always, or drop them. |
| F2 | `gap: 3px` L485, L735, L900–903, L1123, L1250 | The same 3px gutter in every grid makes every page look like the same tiled layout. | Vary the rhythm: give hero pieces room, cluster sketches tightly and let some images break the column. |
| F2 | `.stats` L575–604 | A centred 4-up "big number + tiny caps label" strip is boilerplate. | Remove it (see `index.html` below). |
| F2 | `.btn-ghost:hover { gap }` L255–267, "→" on ~20 CTAs | Every link is uppercase teal text with an arrow that slides. | Use plain sentence-case links, and keep the arrow only for "next project". |
| L | `--transition*` L28–30, reset L39–66, nav L93–218 | These are solid and invisible. | Leave them. |
| L | `.container` L83 | Unused. | Delete it whenever. |

### 2b. `index.html`: Home

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L41–52 | The positioning is "Product Design Manager · Disney" and then 4 roles. "Artist, Designer, World Builder" is missing, and the employer is billed above you. | Make the hero say **Artist · Designer · World Builder**. Move Disney to the credentials. |
| F1 | L53–56 | "Designing across dimensions … at the intersection of art, culture, and play" is filler (the first of 4 uses of that phrase). | Write one first-person sentence about what you actually make. |
| F1 | L78–80, L93–95, L108–110 | The three featured cards are placeholders. | Use one real hero image per world. |
| F1 | L125–144 | The stats include "∞ Worlds to Build" and "2D/3D Design Disciplines", which are filler, and "$500M" appears twice on this page alone. | Delete the strip. Mention $500M once, in the bio. |
| F2 | L38, L39, L62–65 | Ghost "ZG", accent line and Scroll cue (see CSS). | Remove them. |
| F2 | L101 | "Not just a portfolio piece — a world unto itself." This "not X, it's Y" construction is repeated on 3 pages. | Describe VNCE concretely: who it is and what world it lives in. |
| F2 | L152 | "Blending *2D and 3D design* to create worlds at the intersection of art, culture, and play" is the second use of the stock phrase. | Replace it with a real line of yours (a quote, a motto, a sketchbook note). |
| F2 | L157 | "dynamic Latino artist and designer" is a press-release adjective plus a client list. | Rewrite it in first person, with one specific story. |
| F2 | L6–7 `<title>`, meta | "Creative Director" is off-positioning. | Use "Zach Gracia — Artist, Designer, World Builder". |
| F2 | L175–176 | Instagram and LinkedIn link to the site homepages, not your profiles. | Use your real profile URLs (this repeats on every page). |
| F2 | L180 | "©2024". | Use the current year. |

### 2c. `portfolio.html`: Work

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L57, 73, 89, 105, 121, 137, 153, 169, 185, 201, 217 (all `.ph-label`s) | All 11 thumbnails are placeholders. | Use real thumbnails, each cropped intentionally. |
| F2 | L41–47 | The filter splits "Disney" from "Professional", but the Frozen castle and Mickey camper are Disney work filed as "pro". | Filter by world (TAD / VNCE / Disney / Illustration) or drop the filter. |
| F2 | L54–230 | 11 cards link to only 3 pages, so 6 different cards open the same `disney.html`. That feels padded. | Link each card to an anchor (`disney.html#doorables`) or cut it to one card per world. |
| F2 | L39–40 | "Selected Work" plus a giant "WORK" is a label that repeats its heading. | Keep one. |
| L | L54/134/198 `span-2` | Mixing wide and normal cards is fine once the real art drives the sizes. | Leave it. |

### 2d. `about.html`: About

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L44 | "Creative Director · Product Design Manager" is off-positioning. | Use "Artist · Designer · World Builder". |
| F1 | L46, L59, L67–71 | "dynamic Latino artist" (twice), "hailing from", "world-class creativity and category innovation", "his knack for", "tech giants … trendsetters … household names … just to name a few". This is LinkedIn-generator prose. | Rewrite it in your own voice, in first person, and keep the Charlotte, Beau and Kelsey line, which is the only line that sounds like you. |
| F1 | L127–131 | Portrait slot is a placeholder. | Use a real studio photo of you working. |
| F2 | L75–77 | The bio is third person ("Zach thrives on collaboration") but Contact is first person ("Tell me about it"). | Pick first person site-wide. |
| F2 | L90–122 | The credentials column repeats the bio (Disney role, collaborators, TAD, VNCE). | Keep the collaborators list, and drop what's already in the bio. |
| L | L133–214 | The exhibitions list is real, specific and the most hand-made thing on the site. | Leave it, and consider adding a thumbnail or a flyer per show. |

### 2e. `publications.html`: Publications

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L64, 75, 86, 119 | **"Add link when published"** is an internal note showing on the live page. | Hide unpublished entries until they ship. |
| F1 | L56–120 | 4 of 6 cards are unpublished newsletter *pitches* with blurb-style descriptions ("cuts through the noise", "What works, what doesn't"). They read like a content plan, not a body of work. | Show only published pieces. If there are none yet, fold the page into About as "Press". |
| F1 | L46–50, L57–63, L112–118, L133 | AI-themed copy (see §5). | Decide whether AI writing belongs on an artist's site. If yes, use real links. If not, cut it. |
| F2 | L89–108 | The two "press" cards restate your awards, with no link, outlet or quote. | Link the actual coverage or merge it into the About achievements. |
| F2 | L125–150 | "Get the Newsletter … No fluff." is a stock CTA, and the form is fake (`onsubmit` only changes the button text, so emails are dropped). | Remove it until a real list exists, or wire it to Netlify Forms or your mail provider. |
| F2 | 11 inline `style=""` blocks (L45–46, L125–148) | The intro, CTA and form are styled inline, which bypasses the system. | Move them into classes when this page is reworked. |

### 2f. `contact.html`: Contact

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L55 + `js/main.js` L63–74 | **The form sends nothing.** `action="#"` with JS `preventDefault()` shows "Sent —", so every message is silently lost. | Add `name="contact" data-netlify="true"` (Netlify Forms) and remove the JS intercept. |
| F1 | L49–50 | Social links go to instagram.com and linkedin.com, not your profiles. | Use your real URLs. |
| F2 | L40–41, L45 | "Let's Talk" plus "HELLO." plus "If you're building something worth building, reach out" is template contact copy. | Say what you're actually open to, in your voice (commissions, toy collabs, licensing). |
| F2 | L64–66 | The Subject field adds friction and no value. | Drop it. |

### 2g. `cart.html`: Shop TAD

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L60 | The label says "Available Now & Coming Soon" but nothing is available. | Change it to "Coming drops". |
| F1 | L43 + `js/main.js` L76–87 | The waitlist form is fake (both the inline `onsubmit` and the JS just relabel the button). | Wire it to Netlify Forms or your mail tool, or remove it. |
| F2 | L68–102 | Three identical "Coming Soon / Price TBD" cards. | Show one real teaser image of Drop 001, with a date or a sketch. |
| F2 | Nav "Shop TAD" CTA (every page) | The only highlighted nav item points to an empty shop. | Rename it to "TAD Drops" until there's stock. |
| F2 | L111–131 | The brand statement repeats the TAD case study almost word for word ("Limited runs. No restocks. Made to be held, not just displayed."). | Link to the case study instead of repeating it. |
| L | L122–124 | "Things you can feel before you can explain them" is a good line and sounds like a voice. | Keep it. Use it **once**, as TAD's line. |

### 2h. `projects/tad.html`

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L93–94, 153–154, 167, 170–172, 186–187, 200–201 | 11 placeholders, so the brand page has no brand on it. | Use the logo, figures, packaging and apparel photos. |
| F1 | L103–106 | "TAD isn't a portfolio project. It's a brand philosophy…" uses the "isn't X, it's Y" formula. | Open with the object: what TAD is, what it looks like and why it exists. |
| F2 | L109 | "Built at the intersection of…" is the third use of the stock phrase. | Cut it. |
| F2 | L148–150, L181–183, L196–197 | "timeless without feeling borrowed", "isn't merch — it's an extension of the brand world", "feels like a gallery opening". These are claims about the work with no process shown. | Replace each with a process caption: a sketch, a sculpt, a material choice. |
| F2 | L82, `<style>` L10–16 | Teal radial glow hero background (same trope on VNCE and Disney). | Use TAD's own colour and texture. |
| L | `<style>` L17–37 `.tad-tagline`, `.brand-statement` | Unused CSS. | Delete it whenever. |

### 2i. `projects/vnce.html`

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L97–98, 106–107, 165–166, 198–203, 216–219, 233–235 | 14 placeholders, so the world-building page shows no world. | Show the character, turnarounds, environments and studies. |
| F1 | L91 | "Not a portfolio piece. / A world." is the third use of the formula, and it's the page's headline. | Give VNCE a real logline: who they are and where they live. |
| F2 | L116–128, L160–162 | "IP with intention", "built to carry its own mythology", "versatile without being generic". All abstract, with no lore shown. | Show one piece of lore: a place name, a rule of the world, a first sketch with the date on it. |
| F2 | L171–186 | A 3-cell "spec" table of generic attributes ("Bold line, graphic palette, animation-ready"). | Replace it with a real model-sheet excerpt or colour callouts. |
| F2 | L229 | "TAD  limited" is missing a colon or dash (typo; also TAD L114, L182). | Fix the punctuation. |

### 2j. `projects/disney.html`

| Rank | Line | What's wrong | Fix |
|---|---|---|---|
| F1 | L84–85 and all sub-project galleries | 18 placeholders. | Use the product photos, process sketches and lithographs. |
| F2 | L132, 149, 170, 191, 211, 231 `.sub-project-number` | Ghosted giant "01–06" numerals are another template trope. | Remove them, or use real dates and roles. |
| F2 | L138–139 | "Zach's work contributed to the design language that earned the line its award-winning status" is vague and reads as hedged. | State your actual role ("I designed X figures in waves Y–Z"). |
| F2 | L174–177, L195–198 | "A showcase of 3D design across the complete product development lifecycle" is filler. "Playset comes all the way with camping equipment" is garbled. | Write one concrete sentence per stage, and fix the grammar. |
| F2 | L172, L193 | "Frozen **8** Inflatable Castle" is unclear (8 ft? Frozen 2?). | Check the product name. |
| F2 | L102 | "design that earns its place in a world already saturated with product" is generic. | Cut it. |
| L | L130–249 structure | A numbered list of sub-projects with real process steps (concept, revision, overlay, final) is a good skeleton. | Keep the structure once the art is in. |

### 2k. Cross-cutting

| Rank | Where | What's wrong | Fix |
|---|---|---|---|
| F2 | `.tad-back` / `.vnce-back` / `.disney-back` (three identical inline `<style>` blocks) | Copy-pasted components. | Make one `.back-link` in `styles.css`. |
| F2 | 42 inline `style=""` attributes across 8 pages | Layout lives outside the system, so changes won't propagate. | Fold them into classes during the type and colour pass. |
| F2 | All `<head>`s | No favicon, no `og:image`, so shared links show a blank card. | Add a favicon from your mark and one OG image of real art. |
| L | Nav / mobile overlay / filter JS | They work and are clean. | Leave them. |

---

## 3. Priority summary

**Fix first:** these break trust or hide the art.
- Real artwork into all 65 placeholder slots, starting with the home hero, the 3 featured cards and each case-study hero.
- Contact form actually delivers (Netlify Forms). Same for the waitlist and newsletter, or remove them.
- Real Instagram and LinkedIn URLs on every page.
- Remove "Add link when published" and the unpublished pitch cards.
- Put **Artist · Designer · World Builder** in the home hero, the About hero and the `<title>`s.
- Raise `--text-muted` to pass contrast.
- Fix the false "Available Now" label on the shop.

**Fix next:** these are what make it read as a template.
- Palette from your art, a type system cut to two faces, labels cut by about 80%.
- Copy rewrite in first person, removing the repeated phrases.
- Remove stock decoration: grain, ghost "ZG", accent line, Scroll cue, ghost numerals, radial glows, hover-zoom with overlay.
- Break the identical case-study mould and the uniform 3px grid.
- Clean up the portfolio filter and card links, merge or hide Publications, fix the © year, typos and inline styles.

**Leave it:** nav and mobile menu, reset and transitions, the exhibitions list, the Disney sub-project structure, the "feel before you can explain" line.

### The 5 changes that would most make it feel hand-made

1. **Put your art on every page, uncropped and unzoomed, at real size.** Nothing else on this list matters as much. An artist's site with zero art reads as a template by definition.
2. **Show your hand in the interface.** Use your own lettering or signature for the wordmark, scanned sketch marks for dividers and arrows, and margin notes in your handwriting next to process images. Replace the ghost "ZG", the grain and the glows with these.
3. **Pull colour from the work, per world.** TAD, VNCE and Disney should each feel like a different room, painted from their own artwork, not all tinted teal.
4. **Rewrite every line in first person, in your voice, with specifics.** Cut "intersection", "edge of", "not a portfolio piece", "dynamic", "knack" and the $500M repetition. Say what you made, when, with what, and why.
5. **Give each case study its own layout and show process.** Sketches, sculpts, rejected versions and the moment an idea turned. Pair each image with a short gallery-label caption (title, year, medium), the way the exhibitions list already does.

---

## 4. Proposed direction: "The World Builder's Studio"

**The idea:** the site is your studio, and each IP is a world with its own room. Not a product page, not a dark agency reel.

- **Home is an index of worlds, not a hero banner.** Open with the line **Artist · Designer · World Builder** set in your own lettering (or one expressive display face), then show three large windows, one per world (TAD, VNCE, Disney & licensed work). Each window is a real piece of art at full bleed, with a one-line handwritten-style caption. No stats, no "Scroll" cue.
- **Each world sets its own palette and texture.** The global shell (nav, footer, body type) stays neutral, a warm off-white or a deep ink, chosen once you've picked the art. Each case-study page takes 2–3 colours sampled straight from that world's artwork. Paper and sketchbook texture, if any, should be scanned from *your* paper.
- **Type:** one display face with personality for titles (or hand-lettered titles as SVG) and one readable text face. Sentence case for body and links. Uppercase only for small gallery-label metadata.
- **Layout:** a scrapbook rhythm, not a uniform tile grid. A big piece gets room. Sketches cluster tightly and can overlap or tilt slightly. Captions sit below the images like museum labels. The about page's exhibitions list becomes the visual model for captions site-wide.
- **Voice:** first person, warm and specific. Keep the Charlotte, Beau and Kelsey line, the Latino identity in your own words, and "things you can feel before you can explain them" as TAD's single tagline. Disney work is framed as craft ("what I designed, what I learned"), not revenue.
- **Commerce stays honest:** "TAD Drops" shows one teaser and a working waitlist, and becomes "Shop" only when there's something to buy.

**Caveat:** your artwork isn't in this repo, so the palette and texture choices have to be made in front of the real pieces. That should be the first step of the colour pass.

---

## 5. Copy that mentions AI or how the site was made

**Mentions AI** (all on `publications.html`):
- L7 meta description: "…AI, design, toy culture, and creative direction."
- L47–49: "Writing on AI and design… specifically how AI is reshaping the way designers and brands operate."
- L57–63: card "Newsletter · AI & Design / The Designer's Edge: What AI Actually Changes (And What It Doesn't)" and its blurb.
- L112–118: card "Newsletter · AI & Creative Work / Using AI as a Design Tool Without Losing Your Voice" and its blurb.
- L133: newsletter CTA, "Writing on AI, design, toy culture…"

None of these pieces are published (they all say "Add link when published"). On an artist's portfolio they make AI the headline topic of the only writing page. Your call whether that's the story you want to lead with.

**Mentions how the site was made:** none in the visible copy, meta tags or HTML comments. The only reference is the git commit message (`ef6f4e3`: "Initial portfolio redesign — dark/cinematic direction…"), which is not published.

**Copy that reads as machine-written** (not a claim about how it was written, just the pattern): the stock phrases listed in §2. "Intersection of art, culture, and play": index L55, L86 (variant), L152; about L46; publications L48; tad L109. "Edge of language / what can and can't be explained": about L82, cart L123, tad L104. "Not a portfolio piece": index L101, tad L103, vnce L91. "Dynamic Latino artist": index L157, about L46, L59. "No fluff": publications L134.

---

## 6. Passes you can pick from

| Pass | What it covers | Needs from you |
|---|---|---|
| **A: Trust fixes** | Working Netlify forms, real social URLs, remove internal notes and unpublished cards, © year, contrast, "Available Now" label, typos | Your Instagram and LinkedIn URLs, and a decision on the newsletter and waitlist |
| **B: Copy and positioning** | "Artist · Designer · World Builder" everywhere, first-person rewrite, stock phrases out, Publications decision | 10 minutes of your notes or voice memo per world, so the voice is yours |
| **C: Type, colour and decoration** | New palette, two-face type system, cut labels, remove grain, glows, ghosts and hover-zoom, consolidate inline styles | Pick the display face (or provide lettering), and 3–5 key artworks to sample colour from |
| **D: Layout and case studies** | Studio-index home, scrapbook galleries, per-world case-study layouts, captions as gallery labels | Image files and a rough order of what to show |
| **E: Artwork drop-in** | Replace the 65 placeholders with optimised images, plus alt text, favicon and OG image | The image files (this pass can run alongside any other) |

I'd suggest **A first** (it's small and fixes things that are broken right now), then **E with B**, then **C**, then **D**.
