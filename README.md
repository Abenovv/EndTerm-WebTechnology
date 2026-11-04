# SIDEQUEST — Endterm

A five-page continuation of our Web Technologies 1 Midterm, group **IT-2511**. The original three game worlds, artwork, local Bootstrap, DM Sans font, page structure and orange/dark theme are retained.

Open **index.html** directly, or run `npm start` from this folder and visit http://127.0.0.1:8768. Opening the website needs no installation, backend or internet connection. These are game concepts; the planners save local choices and do not book real events or send emails.

## Team and responsibilities

| Member                     | Pages and logic                                                                                                                 | Owned tests                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Yerkebulan Abenov, IT-2511 | Home mood/time recommendations, persistent session shortlist; Community activity search/filter, evening total, preferences form | `tests/yerkebulan.test.cjs`, corresponding browser scenarios |
| Assan Nurbergen, IT-2511   | Games search/filter/sort/comparison; Emberwake route ribbon, optional stops, group estimate and expedition form                 | `tests/assan.test.cjs`, corresponding browser scenarios      |
| Kuvandyk Bekarys, IT-2511  | Studio roadmap filter, task estimate, collaboration brief and weekly estimate; final integration of browser checks/report       | `tests/bekarys.test.cjs`, corresponding browser scenarios    |

These are prepared responsibilities for review and individual development. Packages and assigned files do not prove personal authorship or completed defense. Each member must review, explain and commit their own work using their own account.

## Changes since the Midterm

The three static game cards become eight DOM-rendered concept sessions, each with seven properties. Search, genre and duration sorting combine without reloading. Up to three sessions can be compared; saved sessions persist across pages. Home finds up to three sessions within a time budget and handles an empty result.

Emberwake calculates route minutes plus optional photo/lore stops and participant-minutes. Community renders eight activities, filters by format/text and calculates a saved evening duration. Studio renders eight production tasks, keeps selections across filters and estimates collaboration weeks using `Math.ceil(taskHours / weeklyHours)`.

Every member has a Bootstrap form with at least six controls. Required fields, email, numeric boundaries, dates and phone/message rules are checked with JavaScript. Errors appear below the field, update as it is corrected and are absent on first load. A successful submission clears the form. Storage failures preserve entered values and prior stored data. Emails and phone numbers are validated but not saved.

The shared navigation now exposes all five pages, including Emberwake. Its current page is highlighted. Keyboard focus, skip links, labelled fields, descriptive image alternatives and reduced motion are supported. The trail ribbon provides a visual itinerary using the existing design.

No Midterm defense feedback was supplied. These are verified improvements found by inspecting the source; specific instructor remarks still need to be checked with the team.

## Requirement map

| Requirement                                      | Implementation                                                                               | Evidence / demonstration                                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Five pages for three members                     | `index.html`, `games.html`, `emberwake.html`, `community.html`, `studio.html`                | Browser checks at 375, 768 and 1280px; internal links and fragments                   |
| Bootstrap forms, inline validation and reset     | Three `data-form` forms; `js/shared.js` → `bindForm`; `js/data.js` → `validate`              | Submit empty; correct fields; save; reload; block storage                             |
| Array of at least eight objects and DOM creation | `js/data.js`: sessions, activities, tasks; page scripts call `UI.element` / `UI.sessionCard` | 8 catalogue cards, 8 activities and 8 roadmap tasks                                   |
| Two interactive features per member              | Recommendation + evening planner; catalogue + expedition; roadmap + collaboration estimator  | Browser and member-owned calculation tests                                            |
| Calculated values and events                     | Duration totals, participant-minutes, weeks; `click`, `input`, `change`, `submit`, `keydown` | First-light route with both stops = 55min; two participants = 110 participant-minutes |
| Three useful jQuery effects                      | `js/shared.js`: `slideDown`/`slideUp` help, `fadeIn` results/success, `animate` back-to-top  | Help on every page; form success / Home finder; Back to top                           |
| Repeated clicks and reduced motion               | `.stop(true,true)` clears effect queues; media preference sets duration to zero              | Repeated accordion clicks and reduced-motion browser scenarios                        |
| Empty/error states                               | Empty catalogue/finder/planner, numeric validation, storage failures                         | Dedicated browser scenarios                                                           |
| Credits on website and report                    | `studio.html#credits`, report, asset license files                                           | Local Bootstrap, jQuery, fonts; credited inherited AI artwork and Codex assistance    |
| GitHub Pages and individual history              | Inherited `.github/workflows/static.yml`                                                     | Publication and authentic member activity remain pending                              |

## Tests

Node.js 22 or newer is used for the verification tools. Run from the extracted project root:

```text
npm ci
npx playwright install chromium
npm test
```

On Windows, tests automatically use installed Chrome or Edge when present. On other systems they use Playwright Chromium. `SIDEQUEST_BROWSER` can point to another Chromium executable. `npm run test:domain` runs calculations and validation without a browser. The latest exact result and environment are recorded in `docs/verification.json` after final extraction checks. No production build is needed for this static website.

The browser suite checks all pages at three widths, local links and fragments, image loading, heading order, navigation, focusability, searches, totals, comparison limits, reload persistence, form correction/reset, storage failure, corrupted data, animation queues and reduced motion. Width checks detect horizontal overflow; automated checks do not replace visual review.

## Continuity, publication and submission

Midterm source: https://github.com/Abenovv/Midterm-Web_Technologies-1stTerm at `0c5ff8a8bb1e3792fc80e502bcdec1942a2f10e3`.

Requested Endterm target: https://github.com/Abenovv/EndTerm-WebTechnology.

Planned Pages URL: https://abenovv.github.io/EndTerm-WebTechnology/ — **not published or verified live by this preparation**. The supplied rubric requires the same repository as the Midterm. Obtain the instructor's approval for the requested new repository or publish the continuation to the Midterm repository instead. Helpers target the repository supplied by the user and preserve the Midterm history when bootstrapping. They do not push until explicitly invoked.

No commits, pushes, merges or deployment were performed on GitHub. No deadline was supplied; check it before committing. Real member commits, instructor feedback and the final live URL must be confirmed before LMS submission.

Each member must upload **both** `Endterm_YerkebulanAbenov_AssanNurbergen_KuvandykBekarys.zip` and the separately supplied `.pdf` with the same stem. The assignment's naming overrides the playbook's generic Assignment-number names. Teammate outer packages and `Contribution.zip` are not LMS submissions.

## Credits

- Bootstrap 5.3.8, MIT: https://getbootstrap.com/ — inherited local layout, navigation and form components; license in `assets/vendor/`.
- jQuery 3.7.1, MIT: https://jquery.com/ — local help accordion, fade feedback and smooth scrolling; license in `assets/vendor/`.
- DM Sans by Colophon Foundry, SIL Open Font License: https://fonts.google.com/specimen/DM+Sans — inherited local font and license in `assets/fonts/`.
- Original Midterm concept artwork was made with OpenAI image generation. Session variants reuse the artwork for their corresponding original worlds; images are concepts, not gameplay screenshots.
- OpenAI Codex assisted with Endterm code, automated checks, report and packages. No downloaded website template was used. Prepared work still requires each member's review and understanding.
- Playwright (Apache-2.0) and Prettier (MIT) are development tools only, not runtime dependencies; versions are pinned in `package-lock.json`.
