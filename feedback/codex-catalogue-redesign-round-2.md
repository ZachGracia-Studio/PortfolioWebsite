# Codex critique, feedback and audit — round 2

Date: 2026-11-27  
Reviewed branch: `claude/catalogue-preview`  
Reviewed implementation: [`6c646b7`](https://github.com/ZachGracia-Studio/PortfolioWebsite/commit/6c646b719782a1bc48f6f2fad274ceb0d2834ebb)  
Previous review: [Codex catalogue redesign critique](codex-catalogue-redesign-critique.md)

## Verdict and grade

**Overall grade: 6.3/10, up from 6/10.**

This is a useful repair pass, with several fixes verified in the browser. It is not yet a substantive editorial or design revision: the main audience hierarchy, project evidence, curation and factual-credibility issues remain. The portfolio works more reliably, but it still underexplains why a studio should hire Zach for senior creative responsibility.

**Technical audit: 14/20 (7/10), a good foundation with important content and integration work outstanding.** This measures implementation health; it is not a second overall design grade or a WCAG certification.

The next round should prioritize truth, contribution and selection. More small CSS fixes will not materially improve the argument while the incorrect award claim and unsupported Press page remain.

## Scope and freshness

- Compared the exact revision commit against the previous reviewed implementation. The implementation change touches seven files and primarily repairs labels, metadata, navigation, target dimensions and Press image switching.
- Independently reassessed design/content and technical implementation.
- Browser-tested the pinned source locally. Inspected Press desktop, TAD and Work at 390 × 844, Home at 1440 × 900, and horizontal document reflow on all nine pages with a 320-pixel viewport.
- Rechecked all nine production HTML pages for local link/fragment/asset integrity, declared image dimensions and srcset descriptors.
- The committed 45-page review PDF is unchanged. Its page/device/part citations remain evidence for unchanged compositions; it does not show the new labels or menu dimensions. Browser tests establish those changes.
- The original critique's Claude/Zach answers and ranked-fix response table are still Pending at this commit. No new contextual answers were available there.
- No form submissions, deployment, website code changes or external messages were performed. This report is the requested GitHub deliverable.
- Temporary test viewport was reset; review tab and local server were closed.

## What improved — verified and accepted

| Change | Verification | Disposition |
|---|---|---|
| Press responsive source synchronization | Selecting Snow White now produces a Snow White `src`, `srcset`, `currentSrc`, caption and alt text. Visible screenshot also shows Snow White. | Resolved. Do not repeat the old image-switch defect as open. |
| Project-page Work indicator | On TAD, the Work link now has the active class and `aria-current`. Prefix normalization matches the other project nav URLs in source. | Visual orientation defect resolved. Parent-section semantics can be refined later. |
| Phone hamburger target | Measured **44 × 44 CSS px** at 390 × 844. Menu opens, moves focus to Work, and Escape closes it and returns focus to the trigger. | Resolved. |
| Work category name | Disney & Beyond replaces Disney and Pixar. Clicking it shows the six matching professional cards. | Label mismatch resolved. |
| TAD hero action | Get drop updates replaces Shop TAD; metadata says Drops / Next drop and archive. | Misleading purchase expectation resolved. |
| Drops metadata | Description and OG title/description now describe next drop plus sold-out archive. | Accepted. |
| Disney relationship label | Studios and partners replaces Clients. | Accepted. Individual project responsibilities remain to be documented. |

Implementation references: [Press](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/publications.html#L124), [navigation](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/js/main.js#L68), [menu target](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/css/catalogue.css#L918), [TAD CTA](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/projects/tad.html#L97), [Work filter](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/portfolio.html#L50), [drops metadata](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/cart.html#L4), [Disney metadata](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/projects/disney.html#L111).

The longer Work label still wraps Illustration onto a second line at phone width. It no longer creates a naming inconsistency, but it does not resolve the filter group's layout or the mixed project granularity.

## Previous top-10 findings: actual status

| Previous fix | Status in round 2 |
|---|---|
| 1. Correct award claim | **Open.** Winner wording remains on Home, Disney and Press; About retains the ambiguous award listing. |
| 2. Rebalance Home/Work hierarchy | **Open.** Same images, order and prominence. |
| 3. Explain individual contribution | **Open.** Studios and partners is better relationship wording; it does not document project responsibility. |
| 4. Press sources and image mismatch | **Partially resolved.** Image mismatch fixed; neither entry links to coverage. |
| 5. Tighten TAD curation | **Open.** Identity/graphics sequence unchanged. |
| 6. Demonstrate VNCE's world | **Open.** No new canon, environments, cast or story evidence. |
| 7. Disney hero / Snow White verification | **Open.** Same hero and unresolved final-art labeling question. |
| 8. CTA labels and form delivery | **Partially resolved.** Labels fixed; deployed receipt/success behavior unverified. |
| 9. Phone selection/detail access | **Partially resolved.** Menu target fixed; archive depth and annotation readability unchanged. |
| 10. About and public CV | **Open.** No public CV or shortened chronology added. |

## Page grades

| Page | Previous /10 | Current /10 | Critique |
|---|---:|---:|---|
| Home | 6 | 6 | Attractive personal introduction; little immediate evidence of senior responsibility. TAD/VNCE still precede the strongest professional proof. |
| Work | 6 | 6.2 | Category name is clearer and filtering works. Whole practices, projects and individual images still compete as equivalent entries. |
| TAD | 6.5 | 6.7 | Truthful CTA improves trust. Six identity/palette boards and eight graphics still weaken selectivity and delay production evidence. |
| VNCE | 5.5 | 5.5 | Character is memorable; a world remains promised more than shown. |
| Disney & Beyond | 7 | 7.1 | Relationship label and navigation improve. Strong process evidence remains buried in a long mixed collection. |
| About | 6 | 6 | Same repetitive introduction and historical exhibition tail; current direction and responsibility remain insufficiently specific. |
| Press | 2 | 3 | Preview now works, but this still cannot substantiate its own claims. |
| Contact | 7 | 7 | Clear email, good keyboard foundations; phone form is secondary to the portrait. Delivery not verified. |
| TAD drops | 5.5 | 6 | Incoming action and metadata are more honest. Signup proposition and production capture still need evidence. |

These are editorial assessments, not an arithmetic formula for the overall grade. A factual problem has greater weight than several minor UI improvements.

## All 14 critique lenses

| Lens | /10 | Round-two judgment and specific next step |
|---|---:|---|
| 1. First impressions | 6 | Home still says artist with personal brands before it demonstrates senior product leadership. Put an exceptional product/process pairing in the opening work sequence. |
| 2. Positioning and narrative | 5 | Artist is visible; designer becomes clear deeper in the archive; world builder remains underproved. Assign each practice a distinct evidentiary job. |
| 3. Taste | 7 | Barlow Condensed / Newsreader, dark ground and bounded artwork color remain sound. More specific selection will distinguish this better than additional catalogue decoration. |
| 4. Identity and system | 7 | Naming and navigation are more consistent. Plate exceptions, mount semantics and mixed index units remain unresolved. |
| 5. Generated/template tells | 6.5 | No image-generation provenance can be inferred visually. Generic bridge copy, repeated paper tilts and familiar editorial compositions still weaken authorship. |
| 6. Image curation | 6 | No substantive cuts, resequencing or enlargement added. Prior project-by-project recommendations still apply. |
| 7. Copy and voice | 6.2 | Get drop updates and Studios and partners are better. Repeated introductions, unsupported award wording and vague world claims remain. |
| 8. Information architecture | 5.8 | Filter naming improves orientation, but the index still mixes practices and pictures while Disney contains nine projects in one page. |
| 9. Phone experience | 6.5 | Menu target improved; no document-level overflow in the 320-pixel sweep. Optional archive depth and readable process details remain necessary. |
| 10. Accessibility | 7.8 | Fixed image/description mismatch and larger menu target are real gains. Full conformance is untested; preserve focus, labels and component reduced-motion alternatives. |
| 11. Credibility and IP presentation | 4 | The most damaging verified factual issue is unchanged. Contribution, sales scope and permissions remain questions, not findings of wrongdoing. |
| 12. Conversion | 6.2 | TAD action is now accurate. Press still cannot lead to evidence; form capture and a meaningful signup promise remain open. |
| 13. Blind spots | 5 | Recognizable Disney properties still substitute for explicit explanation of Zach's decisions. |
| 14. Benchmark | 6 | Coherent presentation remains competitive; attribution and production specificity still lag the specialist examples cited in round 1. No new benchmark research was necessary for this small delta. |

## Ranked remaining feedback

### 1. Correct the award claim before launch — P1, small

Current text still states that Doorables won 2019 Collectible of the Year:
- [Home: line 133](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/index.html#L133)
- [Disney: line 159](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/projects/disney.html#L159)
- [Press: line 72](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/publications.html#L72)
- [About listing: line 153](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/about.html#L153)

The [Toy Association's official 2019 winners release](https://toyfair.vporoom.com/ToyFair/L-O-L-Surprise-by-MGA-Entertainment-Wins-Prestigious-Toy-of-the-Year-Award) names LEGO Harry Potter and Fantastic Beasts Minifigure Series. [Moose's announcement](https://www.prnewswire.com/news-releases/moose-toys-dominates-with-five-toty-nominations-300748878.html) identifies Doorables as a nominee.

Use a documented nominee designation consistently. If a different award was intended, provide that award's exact name, year and source and correct the copy accordingly. Do not preserve the current false TOTY winner formulation.

Review-pack references: Home · desktop · parts 1–2; Disney & Beyond · desktop · part 2; Press · desktop/phone · part 1; About · desktop · part 2.

### 2. Turn Press into evidence — P1, small to medium

The entries are still focusable DIVs with no article destination. Browser inspection confirms both href values are null. A working preview does not resolve that central failure.

Add real publication links, title, date and author where available. If the original coverage cannot be sourced, remove the unsupported press framing and put supported recognition on About. Focusable static cards should not imply an unavailable article interaction.

Source: [publications.html:66](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/publications.html#L66) and [line 78](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/publications.html#L78). Review pack: Press · desktop/phone · part 1.

### 3. Surface professional judgment early — high editorial impact, medium

Home and Work still give the giant hooded TAD image and VNCE the strongest early placement. This does not match the stated first audience: studio/licensor leaders and hiring managers.

Lead with a shipped product plus the actual drawing or revision that changed it. Keep original work prominent immediately afterward. Explain one verified design decision in the entry itself. Preserve the quiet catalogue identity.

Review pack: Home · desktop · part 1; Home · phone · parts 1–2; Work · desktop · part 1.

### 4. Make contribution visible in the main cases — high editorial impact, large

For Doorables, Toy Story Minis, Incredibles, Coco and the licensed products, state the verified responsibility, collaborators, design decision, artifact ownership and production status.

“Studios and partners” fixes a relationship label; it does not establish whether a campaign image represents drawing, concept origin, art direction, approval or broader oversight. The strongest case material is already here: redlines, model sheets and finished products. Connect them.

Review pack: Disney & Beyond · desktop · parts 2–7.

### 5. Curate TAD and make deep detail optional — medium

Keep primary identity, one useful alternate, three graphics, two wear photographs and the best annotated tech pack in the main sequence. Preserve the remainder in an optional archive if completeness matters.

Pair a readable artwork detail with its physical application. Move the spec sheet earlier. Keep Edition Zero explicitly labeled as a concept unless physical evidence exists.

The 320-pixel browser sweep measured TAD at approximately 11,268 CSS pixels and Disney at 14,426 at observation time. These are layout snapshots, not fixed performance metrics or proof that long pages are inherently wrong. They make the cost of unedited stacking tangible.

Review pack: TAD · desktop · parts 2–5; phone · parts 3–8.

### 6. Show VNCE's world or narrow the presentation — medium to large

The World still promises places, cast and lore while showing a floating-character illustration. “Animation-ready,” sculpture and screen span more than the supplied evidence demonstrates.

If world material already exists, select one environment/cast/story artifact and a short factual canon passage. If it is not ready to show, present character development honestly. Do not invent lore to satisfy the critique.

Source: [VNCE copy](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/projects/vnce.html#L119). Review pack: VNCE · desktop · parts 1–2; phone · parts 1–3.

### 7. Resolve image meaning and destinations — medium

- Verify whether the Snow White hero really is the final lithograph; the visible construction-line image differs from the painted final in the later composite. This remains a verification question.
- Stop cropping Snow White's head away in Work.
- Noir's link reaches an existing illustration anchor, but the selected image is absent there. This is a semantic destination mismatch, not a broken URL.
- Keep the Frozen process/production comparison; preserve watermark/credit or obtain an approved replacement.
- Enlarge one Mickey camper mechanism comparison and make concept status explicit.

Review pack: Work · desktop · parts 1–2; Disney & Beyond · desktop · parts 1, 5–8.

### 8. Finish delivery verification and the hiring path — medium

Verify contact and waitlist receipt on the actual deployment host, including user success/error behavior. These forms rely on Netlify processing; local source cannot prove that production capture is active.

Add a public CV respecting the exact-title constraint. Shorten the main About chronology to selected relevant distinctions. Put Contact's form earlier on phone if it remains a principal contact method.

Sources: [Contact form](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/contact.html#L72), [waitlist](https://github.com/ZachGracia-Studio/PortfolioWebsite/blob/6c646b719782a1bc48f6f2fad274ceb0d2834ebb/cart.html#L54). Review pack: About · desktop · parts 1–2; Contact · phone · parts 1–2.

## Technical audit

### Health score

| Dimension | /4 | Evidence and limitation |
|---|---:|---|
| Accessibility | 3 | Labels, focus, keyboard and reduced-motion foundations; fixed responsive-image mismatch. Press interaction semantics remain weak. No full assistive-technology certification. |
| Performance | 3 | WebP, matching descriptors/dimensions, extensive lazy loading. Redundant font stylesheet imports and broad sizes values merit cleanup. No field/Lighthouse performance score measured. |
| Responsive design | 3 | Shared 44px hamburger, working filter, nine-page narrow-width sweep without document horizontal overflow. Not every interactive target or 200% text scaling tested. |
| Theming | 3 | Coherent intentional dark theme and useful tokens; legacy/override layers and hard-coded exceptions remain. A light mode is not required by the brief. |
| Implementation integrity | 2 | Mechanical fixes accepted. Incorrect factual copy, unlinked coverage and unverified deployment integration remain. |
| **Total** | **14/20** | **Good technical foundation; significant content/integration work remains.** |

### Specific audit findings

| ID | Severity | Location | Impact | Recommendation |
|---|---|---|---|---|
| A1 | P1 | index.html:133; projects/disney.html:159; publications.html:72; about.html:153 | Incorrect distinction undermines trust. | Correct consistently to sourced award status. |
| A2 | P1 | publications.html:66,78 | Readers cannot open the claimed evidence. | Add genuine source links or remove unsupported press framing. |
| A3 | P2, verification required | contact.html:72; cart.html:54 | Submission capture depends on intended hosting. Failure is not established by source alone. | Verify deployed receipt and accessible success/error path. |
| A4 | P2 | css/catalogue.css:119,449–464 | Other small links/filters lack a consistent practical target floor. | Check hit boxes and spacing; enlarge where needed. This is not an automatic WCAG 2.1 AA violation. |
| A5 | P3 | css/styles.css:1; css/catalogue.css:9 | Two Google Fonts imports and redundant face definitions complicate loading/maintenance. | Consolidate the accepted catalogue families/weights. Do not assume unused font binaries all download. |
| A6 | P3 | page head OG image metadata, e.g. projects/vnce.html:11 | Generic relative previews do not distinguish shared projects. | Use absolute, project-specific sharing images and verify actual crawled previews. |

Six tracked audit findings: **0 P0, 2 P1, 2 P2, 2 P3.** Editorial recommendations above are separate, not extra duplicate defect counts. A1/A2 are portfolio-release priorities; this is not a claim of a total site outage.

### Checks that passed

Across the nine production pages:
- No missing local linked files, fragment anchors, image sources or scripts.
- No missing srcset candidates.
- Checked WebP widths match their w descriptors.
- Declared HTML image width/height values match actual image dimensions.
- 84 image elements: 81 lazy, 74 with srcset; all have alt attributes.
- Contact's fallback lacks intrinsic width/height, but no layout-shift failure was established.
- At the 320-pixel viewport sweep, each document's scrollWidth matched clientWidth. The desktop scrollbar left 305 CSS pixels of document space. This is a document-width check, not proof of every internal crop or text-zoom behavior.
- Work's Disney & Beyond filter returns the six expected matching cards.
- Phone menu opens, moves focus, closes with Escape and returns focus.
- The repaired Press preview displays the selected responsive asset.
- Global focus styling and component reduced-motion alternatives remain.
- No new forbidden job-title or disallowed AI site copy was introduced.

Core text contrast remains approximately 16.4:1 primary, 8.02:1 secondary, 5.74:1 muted and 5.05:1 teal on near-black. Control border/surface contrast is approximately 3.37:1. These ratios do not by themselves establish whole-site WCAG conformance.

### Detector results, interpreted

One production-only scan returned **134 raw flags: 124 warnings and 10 advisories**:
- cramped-padding: 86
- clipped-overflow-container: 26
- low-contrast: 10
- decorative grid: 9
- tight-leading: 2
- em-dash overuse: 1

These are not 134 verified defects. Base grid rules are disabled by catalogue overrides; gray keylines were incorrectly inferred as Press backgrounds; artwork frames trigger text-card padding heuristics; many overflow containers intentionally crop photographs. The narrow-browser sweep found no document-level horizontal overflow.

The old scan included audit mockups and dynamic image templates; its 139-versus-134 count is not a like-for-like quality trend. No mutable detector overlay was injected because browser evaluation was read-only.

## Keep and remove

Keep:
1. Genuine redlines and revision overlays beside production.
2. Barlow Condensed / Newsreader tension.
3. Committed dark ground and bounded artwork color.
4. Visible email and keyboard-accessible controls.
5. VNCE's recognizable silhouette and strongest gesture.

Remove or replace:
- False winner wording.
- Unsupported/unlinked Press framing.
- Redundant identity boards in the primary TAD sequence.
- Repeated generic introductions and unproved world/medium claims.
- Unfulfilled thumbnail destinations.

The old Shop TAD kill-list item is resolved and should stay closed.

## Recommended next sequence

1. Correct and source the award and Press claims.
2. Answer existing contribution/sales/asset questions from Claude's established context.
3. Reorder Home/Work and build three principal professional cases.
4. Curate TAD; show existing VNCE world evidence or narrow its presentation.
5. Verify deployed forms and public hiring/CV path.
6. Consolidate CSS/font imports and perform final responsive/accessibility polish.

Useful workflow mapping: clarify for factual/CTA copy, distill for curation, shape for project hierarchy, harden for deployed form behavior, adapt for remaining phone targets, optimize for imports, then polish. These are proposed next tasks, not source changes performed by this review.

## Questions and response area for Claude / Zach

The earlier questions remain unanswered in the original file. Please answer from existing project context first rather than requiring Zach to repeat information.

1. Which record explains the current Doorables winner claim? Options: correct to documented nominee / supply a different exact award and source.
2. What press URLs and verifiable contribution artifacts are already available? Supply exact links and asset paths.
3. Which site priority is established: senior leadership / hands-on product direction / independent licensing? If unchanged from the brief, use that brief's audience order to guide Home.
4. Which content direction is preferred: tight principal cases with optional archives / full catalogue with improved index and detail access?
5. What already exists for VNCE canon, supporting cast, environments, sculpture or animation? Identify publishable assets without inventing new facts.
6. What defines the $500 million figure, and what publication permissions and current-work evidence are already documented?
7. What is the actual intended host, and what proves both forms deliver and show a usable success state?
8. Is Snow White's hero asset mislabeled? Which exact asset is the final painted lithograph?

### Claude / Zach response

Date / author: Pending.

| Item | Answer or accept/revise/disagree | Evidence / asset / commit |
|---|---|---|
| Award wording and evidence | Pending | |
| Press sources | Pending | |
| Individual contribution | Pending | |
| Home/Work hierarchy | Pending | |
| TAD curation | Pending | |
| VNCE evidence | Pending | |
| Sales scope / permissions | Pending | |
| Snow White and Noir | Pending | |
| Form delivery / public CV | Pending | |

### Follow-up for Codex

Pending.
