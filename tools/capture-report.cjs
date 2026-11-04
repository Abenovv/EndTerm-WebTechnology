const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const serve = require("../tests/serve.cjs");
const root = path.resolve(__dirname, "..");
const docs = path.join(root, "docs");
const shots = path.join(docs, "screenshots");
const stem = "Endterm_YerkebulanAbenov_AssanNurbergen_KuvandykBekarys";
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
(async () => {
  fs.mkdirSync(shots, { recursive: true });
  const server = await serve(root);
  const chrome =
    process.env.SIDEQUEST_BROWSER ||
    [
      "C:/Program Files/Google/Chrome/Application/chrome.exe",
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    ].find(fs.existsSync);
  const browser = await chromium.launch(
    chrome ? { executablePath: chrome } : {},
  );
  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      reducedMotion: "reduce",
    });
    const base = `http://127.0.0.1:${server.address().port}`;
    const capture = async (file, name, selector, setup) => {
      await page.goto(`${base}/${file}`);
      await page.evaluate(() => {
        document.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
        return document.fonts.ready;
      });
      await page.waitForFunction(() =>
        [...document.images].every((i) => i.complete),
      );
      if (setup) await setup();
      await page
        .locator(selector)
        .screenshot({ path: path.join(shots, name + ".png") });
    };
    await capture("index.html", "home-finder", "#discover");
    await capture("games.html", "catalogue", "main", async () => {
      await page.getByLabel("Genre", { exact: true }).selectOption("adventure");
      await page
        .getByRole("button", {
          name: "Compare Emberwake: First light",
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name: "Compare Emberwake: Broken bridges",
          exact: true,
        })
        .click();
    });
    await capture("emberwake.html", "expedition", "#expedition", async () => {
      await page.getByLabel("Photo stop").check();
      await page.getByLabel("Read valley memories").check();
    });
    await capture("community.html", "evening", "#activities", async () => {
      await page.getByLabel("Activity format").selectOption("Online");
      await page
        .getByRole("button", { name: "Add Valley clue exchange", exact: true })
        .click();
    });
    await capture(
      "community.html",
      "validation",
      "#preferences-form",
      async () => {
        await page.getByRole("button", { name: "Save my preferences" }).click();
      },
    );
    await capture("studio.html", "roadmap", "#studio-roadmap", async () => {
      await page.getByLabel("Include Define the core loop").check();
      await page.getByLabel("Include Prototype movement").check();
    });
    await capture(
      "studio.html",
      "collaboration",
      "#collaboration-form",
      async () => {
        await page.getByLabel("Your name", { exact: true }).fill("Demo Player");
        await page.getByLabel("Email address").fill("demo@example.com");
        await page
          .getByLabel("Discipline", { exact: true })
          .selectOption("Code");
        await page.getByLabel("Hours per week").fill("5");
        const d = new Date();
        d.setDate(d.getDate() + 1);
        await page
          .getByLabel("Preferred start date")
          .fill(
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
          );
        await page
          .getByLabel("What would you contribute?")
          .fill("I would build keyboard movement and test the first puzzle.");
        await page.getByLabel("Save my choices on this device").check();
        await page
          .getByRole("button", { name: "Save collaboration brief" })
          .click();
      },
    );
    for (const width of [375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + "/games.html");
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: path.join(shots, `responsive-${width}.png`),
      });
    }
    const proof = JSON.parse(
      fs.readFileSync(path.join(docs, "verification.json"), "utf8"),
    );
    const sheet = (title, body) =>
      `<section class="sheet"><p class="label">SIDEQUEST / WEB TECHNOLOGIES 1 / ENDTERM</p><h1>${title}</h1>${body}<footer>IT-2511 · Yerkebulan Abenov · Assan Nurbergen · Kuvandyk Bekarys</footer></section>`;
    const image = (name, caption, cls = "") =>
      `<figure><img class="${cls}" src="screenshots/${name}.png" alt="${escape(caption)}"><figcaption>${escape(caption)}</figcaption></figure>`;
    const html =
      `<!doctype html><html lang="en"><meta charset="utf-8"><title>SIDEQUEST Endterm Report</title><style>
      @page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;color:#222b31;font:11pt Arial,sans-serif;line-height:1.45}.sheet{height:297mm;padding:16mm 18mm;position:relative;break-after:page;overflow:hidden}.sheet:last-child{break-after:auto}.label{color:#a44422;font-size:9pt;letter-spacing:1.5px}h1{font-size:27pt;line-height:1.12;margin:10mm 0 6mm}h2{font-size:15pt;margin:6mm 0 2mm}p{margin:0 0 3mm}a{color:#96401f;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;font-size:10pt}td,th{padding:3mm;border:1px solid #d4d7d9;text-align:left;vertical-align:top}th{background:#f4e9df}figure{margin:4mm 0}img{max-width:100%;max-height:90mm;object-fit:contain;object-position:left top}img.tall{max-height:178mm}figcaption{font-size:9pt;color:#555;margin-top:2mm}footer{position:absolute;bottom:10mm;left:18mm;font-size:8pt;color:#666}.note{padding:4mm;background:#fff2de;border-left:3px solid #c36b30}.pair{display:flex;gap:5mm;align-items:flex-start}.pair figure{flex:1}.pair img{max-height:150mm}.small{font-size:9pt}code{font-size:9pt}ul{padding-left:5mm}li{margin-bottom:2mm}
      </style><body>` +
      sheet(
        "Three worlds.<br>One working website.",
        `<h2>Endterm project report</h2><p>4 November 2026 · Group IT-2511 · Team of three</p><p>SIDEQUEST continues the five-page Midterm game-studio website. Visitors can search concept sessions, compare choices, save an expedition, build an evening and estimate a collaboration. No backend is used.</p><table><tr><th>Member</th><th>Prepared responsibility and tests</th></tr><tr><td>Yerkebulan Abenov<br>yerkebulanabenov7@gmail.com<br>GitHub: Abenovv</td><td>Home and Community: recommendations, saved shortlist, activity planner and preferences. tests/yerkebulan.test.cjs and matching browser scenarios.</td></tr><tr><td>Assan Nurbergen<br>nurbergenasan161@gmail.com<br>GitHub: nurbergenasan161-dotcom</td><td>Games and Emberwake: search/filter/sort, comparison, expedition route and form. tests/assan.test.cjs and matching browser scenarios.</td></tr><tr><td>Kuvandyk Bekarys<br>kuvandykbekarys@gmail.com<br>GitHub: kuvandykbekarys-star</td><td>Studio: roadmap, task hours, collaboration estimate/form; browser and report integration. tests/bekarys.test.cjs and matching browser scenarios.</td></tr></table><p class="small">This contribution map assigns prepared work for review. It does not claim that members already made the commits or completed the individual defense.</p><h2>Repository and deployment</h2><p>Requested target: <a href="https://github.com/Abenovv/EndTerm-WebTechnology">github.com/Abenovv/EndTerm-WebTechnology</a></p><p>Planned website: <a href="https://abenovv.github.io/EndTerm-WebTechnology/">abenovv.github.io/EndTerm-WebTechnology/</a></p><p class="note">Deployment is pending; the planned URL is not a verified live Endterm site. The rubric requires the Midterm repository. Obtain instructor approval for this new target or publish to the original repository.</p>`,
      ) +
      sheet(
        "What changed since the Midterm",
        `<p>Source: <a href="https://github.com/Abenovv/Midterm-Web_Technologies-1stTerm">Midterm-Web_Technologies-1stTerm</a><br><span class="small">Base revision: 0c5ff8a8bb1e3792fc80e502bcdec1942a2f10e3</span></p><table><tr><th>Midterm</th><th>Endterm</th></tr><tr><td>Three static game cards and simple genre buttons</td><td>Eight session objects rendered through the DOM; combined text/genre filters, time sorting and three-session comparison</td></tr><tr><td>Single saved Emberwake flag</td><td>A cross-page saved-session shortlist, total minutes and migration of the old flag</td></tr><tr><td>Static Emberwake information</td><td>Route selection, optional stops, trail ribbon, calculated duration and participant-minutes; validated local plan</td></tr><tr><td>Small community preference form and static meetup table</td><td>Eight searchable activities, persistent evening plan, duration total and expanded inline-validated preference form</td></tr><tr><td>Static team introduction and credits</td><td>Eight production tasks, discipline filter, task-hour estimate and validated collaboration form with weekly estimate</td></tr><tr><td>Bootstrap FAQ and browser-native form popups</td><td>jQuery help, fade feedback and smooth scroll; clear field-level errors, correction and reset</td></tr></table><h2>Inspection fixes</h2><p>Emberwake now has a direct navigation link. Only the current page is highlighted. All five pages share keyboard focus, mobile navigation and the existing design. Local storage errors keep prior data and entered values. Corrupted storage does not crash the pages.</p><p class="note">No instructor defense remarks were supplied. The team must compare these fixes with the actual Midterm feedback before submitting; this report does not claim unseen remarks were resolved.</p><h2>What remains a concept</h2><p>No game binaries, real event reservations, email delivery or account system are offered. The plans are useful local browser workflows; wording makes their scope clear.</p>`,
      ) +
      sheet(
        "Yerkebulan / discover and plan",
        `<p>Home filters sessions by mood and available minutes. It returns up to three choices and explains when none fit. A saved shortlist persists across pages and calculates a duration total.</p>${image("home-finder", "Home session finder: recommendations created from the shared session array.")}<p>Community filters eight activities by format and text. Adding or removing an activity updates a saved evening plan. For example, Valley clue exchange (20min) plus Write a space postcard (15min) equals 35min.</p>${image("evening", "Community activity results filtered to Online.")}<p class="small">Files: js/home.js, js/community.js; tests/yerkebulan.test.cjs. The preference form adds email, 15–180 minutes in steps of five, required choices and consent.</p>`,
      ) +
      sheet(
        "Assan / compare and explore",
        `<p>The catalogue combines search, genre and sorting without a reload. Comparison is limited to three sessions and calculates their combined duration. Empty results explain what to change.</p>${image("catalogue", "Adventure filter and comparison of First light and Broken bridges.", "tall")}<p class="small">Files: js/games.js, js/emberwake.js; tests/assan.test.cjs. A game card links to its corresponding world or preselected expedition route.</p>`,
      ) +
      sheet(
        "A trail with a calculated duration",
        `${image("expedition", "First light (30min) + photo stop (10min) + valley memories (15min) = 55min.")}<h2>Expedition validation</h2><p>The form requires a name, email, date within the next year, 1–6 participants, a phone containing 10–15 digits and consent. Two participants on the 55-minute route give 110 participant-minutes.</p><p>The plan stores name, date, route, people and duration. Email and phone are validated but not stored. Invalid fields get inline messages; successful saving resets the form. A blocked storage write preserves both the form and the previously saved plan.</p><h2>Shared effects on every member’s pages</h2><p>jQuery slideDown/slideUp expands help, fadeIn introduces finder results or form feedback, and animate scrolls back to the main heading. stop(true,true) clears queued effects after repeated clicks. Reduced-motion preferences set effect duration to zero. Buttons and cards have matching hover and focus styles.</p>`,
      ) +
      sheet(
        "Bekarys / estimate the work",
        `<p>Studio renders eight tasks from data. Filtering by discipline preserves selected tasks; the total covers every selected task, including those outside the current filter.</p>${image("roadmap", "Selected tasks: core loop (4h) + movement prototype (8h) = 12h.")}<p>The collaboration form validates discipline, 1–20 weekly hours, a date within the next year and a 20–500 character idea. Code has 18 estimated task hours; at five hours per week the result is ceil(18/5) = four weeks.</p>${image("collaboration", "Successful collaboration save: the form is cleared and a four-week estimate is shown.")}<p class="small">Files: js/studio.js; tests/bekarys.test.cjs. Prepared estimates are illustrative, not a promise of a released game or a message sent to the team.</p>`,
      ) +
      sheet(
        "Validation and responsive checks",
        `<div class="pair">${image("validation", "Inline errors after submitting an empty preference form.", "tall")}${image("responsive-375", "Catalogue at 375px.", "tall")}</div><p>Each field has a label, a dedicated error element and aria-describedby. Errors are absent on first load and disappear as fields are corrected. Form reset happens after a successful save.</p><p>All five pages were checked at 375, 768 and 1280 pixels in Chromium. The suite checks horizontal overflow, loaded images, heading order, navigation, focusability, local links and fragments. Actual screenshots are included in docs/screenshots. These checks do not claim a full accessibility audit.</p>`,
      ) +
      sheet(
        "Verification and credits",
        `<h2>Actual verification</h2><p>${proof.tests} automated tests passed, zero failures: ${proof.domainTests} domain/validation tests and ${proof.browserTests} browser scenarios. Environment: ${escape(proof.environment)}. Browser: ${escape(proof.browser)}.</p><p>Final archive extraction and contribution reconstruction outcomes are recorded in docs/verification.json and the team package’s PACKAGE-VERIFICATION.json. No production build is needed; the HTML/CSS/JS site opens directly.</p><p>Run from project root: <code>npm ci</code>, <code>npx playwright install chromium</code>, <code>npm test</code>. Or open <code>index.html</code> to use the site without development tools.</p><h2>Credits required by the course</h2><ul><li>Bootstrap 5.3.8 — local layout, responsive navigation and form components. MIT license. <a href="https://getbootstrap.com/">getbootstrap.com</a></li><li>jQuery 3.7.1 — local help, fade feedback and smooth scrolling. MIT license. <a href="https://jquery.com/">jquery.com</a></li><li>DM Sans, Colophon Foundry — inherited local font. SIL Open Font License. <a href="https://fonts.google.com/specimen/DM+Sans">Google Fonts / DM Sans</a></li><li>OpenAI image generation — three inherited Midterm world images. Variants reuse their world artwork. The images are concept art, not gameplay screenshots.</li><li>OpenAI Codex — assisted with Endterm HTML/CSS/JavaScript, tests, report and packaging. Members must review and understand their assigned work.</li><li>Playwright 1.56.1 and Prettier 3.6.2 — development verification and formatting. No downloaded website template was used.</li></ul><p>The same credits appear on studio.html#credits; asset licenses are included locally.</p><h2>Before submission</h2><p>Verify the course deadline, actual Midterm feedback, allowed repository, authentic individual commits and final live URL. Each student uploads the team project ZIP and this separate PDF using the required Endterm team filename. A local package does not establish member participation or complete the individual defense.</p>`,
      ) +
      "</body></html>";
    fs.writeFileSync(path.join(docs, "report.html"), html);
    await page.goto(base + "/docs/report.html");
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      document.querySelectorAll('.sheet').forEach(node => node.style.width='210mm');
      const sheets=[...document.querySelectorAll('.sheet')];
      for(const [index,title] of [[5,'A collaboration with a clear estimate'],[2,'An evening built around your interests']]) {
        const original=sheets[index], figures=original.querySelectorAll('figure');
        const start=figures[1].previousElementSibling;
        const extra=document.createElement('section');extra.className='sheet';extra.style.width='210mm';
        extra.append(original.querySelector('.label').cloneNode(true));
        const heading=document.createElement('h1');heading.textContent=title;extra.append(heading);
        let current=start;
        while(current&&current.tagName!=='FOOTER') {const next=current.nextElementSibling;extra.append(current);current=next;}
        extra.append(original.querySelector('footer').cloneNode(true));original.after(extra);
      }
    });
    fs.writeFileSync(path.join(docs,'report.html'),await page.content());
    await page.pdf({
      path: path.join(docs, stem + ".pdf"),
      printBackground: true,
      preferCSSPageSize: true,
    });
    const overflow = await page
      .locator(".sheet")
      .evaluateAll((nodes) =>
        nodes
          .map((n, i) => ({
            page: i + 1,
            overflow: n.scrollHeight > n.clientHeight + 1,
          }))
          .filter((x) => x.overflow),
      );
    if (overflow.length)
      throw new Error("Report pages overflow: " + JSON.stringify(overflow));
    await page.setViewportSize({ width: 794, height: 1123 });
    await page
      .locator(".sheet")
      .first()
      .screenshot({ path: path.join(shots, "report-preview.png") });
    console.log(
      JSON.stringify({
        report: path.join(docs, stem + ".pdf"),
        pages: 10,
        screenshots: fs.readdirSync(shots).length,
      }),
    );
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
