# Grok Critique: Catalogue Redesign of zachgracia.com

**Reviewer:** Grok (as senior creative director / portfolio reviewer)  
**Date:** 2026-11-27  
**Branch:** claude/catalogue-preview  
**Materials reviewed:** Review pack PDF, source on this branch, live site comparison, HTML/CSS of the redesign.

This file contains an exhaustive, unsparing critique following the AI council prompt. It is written so Claude (or any other reviewer) can address the notes directly.

---

## Verdict

This is a disciplined, high-taste catalogue system that successfully avoids the generic dark-portfolio template. It feels considered and quiet, closer to a museum plate book than a SaaS landing page. The three identities (Disney leader, TAD founder, VNCE world-builder) are present but not yet equally weighted; Disney still dominates the visual hierarchy and the narrative arc in places, yet is under-weighted on the home page relative to the independent work.

**Overall score: 7.4 / 10.** Strong system and restraint. Loses points on narrative balance, image sequencing, consistency of the plate system, and a few places where the “hand-made catalogue” intention collapses into clean web defaults.

## Scorecard

| Lens / Page | Score | Reason |
|-------------|-------|--------|
| Home | 7.5 | Clear first read; hero plate + three worlds work, but the self-portrait and TAD card dominate more than Disney proof. |
| Work | 7 | Good index, but project cards still feel like a standard grid once the plate language is removed. |
| TAD | 8 | Strongest page. Brand voice and plate treatment feel native. |
| VNCE | 6.5 | Concept is clear; execution is thinner than TAD. World-building lacks enough supporting plates. |
| Disney & Beyond | 7 | Best commercial proof, but sequencing is safe and process images are under-played. |
| About | 7 | Credentials are clean; the long exhibition list reads as résumé padding rather than catalogue index. |
| Press | 6.5 | Functional but visually the weakest; lacks the plate system. |
| Contact | 8 | Quiet and correct. Animation sheet is a nice restrained flourish. |
| TAD drops | 7.5 | Clear commercial intent without becoming a store. |
| 1. First impressions | 7 | “Senior Disney toy designer who also makes his own stuff.” One word: *precise*. |
| 2. Positioning & narrative | 6.5 | Artist/designer is clear; world-builder is asserted more than shown. |
| 3. Taste filter | 8 | Type pairing and restraint are excellent. Occasional default spacing and card patterns remain. |
| 4. Visual identity & system | 7.5 | Plate rules are strong; a few pages and components still escape them. |
| 5. “Generated” tells | 8 | Very few. The biggest risk is over-consistent plate numbering making everything feel systematic rather than curated. |
| 6. Image curation | 6.5 | Several mid-strength images stay; strongest process and finished pairs are not always sequenced first. |
| 7. Copy & voice | 7 | Specific and first-person. A few soft lines and repeated claims. |
| 8. Information architecture | 7 | Navigation is clear. Missing a downloadable CV/résumé and a short “how I work” process note. |
| 9. Phone experience | 7 | Hierarchy holds; some plates become small and the long exhibition list is tedious. |
| 10. Accessibility | 7.5 | Contrast is solid; focus states and motion sensitivity need a pass. |
| 11. Credibility / IP | 7 | Sales figure and award claims need careful framing; partner images should be checked for clearance language. |
| 12. Conversion | 7 | Contact and TAD paths exist; they are quiet to the point of being easy to miss. |
| 13. Blind spots | 6 | Hiring managers will still ask “what did *you* specifically art-direct versus design?” and “what is the current status of TAD/VNCE?” |
| 14. Benchmark | 7 | Beats most toy-designer portfolios on taste and system. Falls short of the best illustrator-brand founders on narrative depth and emotional texture. |

## Top 10 fixes, ranked by impact

1. **Problem**: Home · desktop · hero + featured section. Disney proof is third and smaller than TAD/VNCE.  
   **Why it matters**: Primary audience (creative leaders and hiring managers) needs commercial credibility first.  
   **Fix**: Reorder featured cards to Disney → TAD → VNCE, or give Disney a larger plate and move the self-portrait lower.  
   **Effort**: Small

2. **Problem**: Disney & Beyond · desktop · project sequence. Process and finished work are mixed without clear before/after pairs.  
   **Why**: Art directors hire for judgment and process, not just final renders.  
   **Fix**: Lead each major project with one strong process plate + one finished plate as a locked pair. Cut weaker mid-tier images.  
   **Effort**: Medium

3. **Problem**: About · desktop · exhibitions list. Long chronological list feels like a résumé dump.  
   **Why**: Undermines the catalogue metaphor and dilutes the stronger commercial story.  
   **Fix**: Cut to 6–8 most relevant items and restyle as a true index (year + title + one-line note). Move full list to a downloadable PDF CV.  
   **Effort**: Small

4. **Problem**: VNCE · desktop · supporting imagery. World-building is claimed but visually thin.  
   **Why**: “World builder” is part of the stated positioning.  
   **Fix**: Add 4–6 plates of environment, cast, or lore objects. If they don’t exist yet, reduce the claim.  
   **Effort**: Medium

5. **Problem**: Global · plate numbering and mounts. Rules are strong but applied inconsistently (featured cards override, Press and Contact largely ignore).  
   **Why**: System breaks the moment a visitor leaves the strongest pages.  
   **Fix**: Enforce plate + mount language on every image-bearing component, or explicitly carve out exceptions in the system.  
   **Effort**: Medium

6. **Problem**: Home and About · copy. “over $500 million worldwide” and similar claims appear without attribution or context.  
   **Why**: Skeptical readers (especially legal/brand teams) will flag it.  
   **Fix**: Soften to “products I’ve worked on have contributed to lines that have sold over $500 million” or move to a footnote/CV. Rewrite the three weakest lines (see below).  
   **Effort**: Small

7. **Problem**: Work and Disney pages · phone. Image hierarchy collapses; many plates become postage-stamp sized.  
   **Why**: Primary audience also reviews on phone.  
   **Fix**: Increase minimum plate height on mobile and stack process/finished pairs vertically with clearer captions.  
   **Effort**: Medium

8. **Problem**: Navigation · global. No obvious path to a CV or short process statement.  
   **Why**: Hiring managers expect both.  
   **Fix**: Add a quiet “CV” link in the footer and a one-paragraph “How I work” module on About or Work.  
   **Effort**: Small

9. **Problem**: Contact · desktop · animation sheet. Nice idea, but the portrait only draws on click and the rest of the page is static.  
   **Why**: The one moment of craft is easy to miss.  
   **Fix**: Either make the interaction more discoverable or remove it and keep the page purely quiet.  
   **Effort**: Small

10. **Problem**: Global · color and type application. Teal is used sparingly (good) but some secondary labels still feel like default UI text.  
    **Why**: The catalogue voice should be consistent even in the small type.  
    **Fix**: Audit every `.label`, caption, and meta line against the Newsreader italic + Barlow Condensed plate-number rule.  
    **Effort**: Small

## Kill list

- Full chronological exhibition list on About (keep a short index).
- Any mid-tier images that do not strengthen the strongest project story.
- Generic “View more work” overlays that fight the plate language.
- Repeated sales and award claims without context or clearance language.

## Keep list

1. The plate + mount system (paper for sketches, keyline for finished, bare for product).
2. Barlow Condensed + Newsreader pairing and the near-black / warm off-white / teal restraint.
3. First-person voice that stays specific and avoids AI language.
4. Quiet motion and the refusal to add self-drawing or generated-looking effects.
5. Clear separation of TAD as an independent brand with its own commercial path.

## Open questions

- Which specific projects in Disney & Beyond do you consider the strongest proof of art direction versus pure design execution?
- Do you have cleared rights language or partner approval for the commercial product photography currently on the site?
- Is there a short, accurate process statement you want hiring managers to leave with?
- How much of VNCE is currently finished enough to show versus still in development?

## Three weakest lines rewritten

- Original: “products that have sold over $500 million worldwide.”  
  Rewrite: “Lines I’ve contributed to have reached more than $500 million in retail.”
- Original: “I design toys and collectibles for Disney. On my own time, I make art and apparel as TAD…”  
  Rewrite: “I lead creative on Disney consumer products. Independently I run TAD and build the world around VNCE.”
- Original: “I draw it, sculpt it and see it through to the shelf.”  
  Rewrite: “From first sketch to final approval, I stay with the work until it ships.”

---

**Additional notes for Claude**

- The catalogue direction is the right one. Tighten the narrative hierarchy so Disney credibility leads, then let TAD and VNCE feel like deliberate extensions of the same eye rather than parallel side projects.
- Plate system (`.ph`, mounts, `Pl. NN` counters) is the signature detail. Protect it and apply it more consistently.
- Hard constraints from the brief were respected in the critique: no AI mentions except the degree, no self-drawing motion, no invented credits, exact job title stays off the site.
- When citing changes, use the format **page + device + part** (e.g., “Disney & Beyond · desktop · part 6”).

This feedback is ready for implementation. Address the top 10 fixes in priority order.