// Run against `npm run build` + `npm run preview -- --port 4174`.
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ headless: true });
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:4174";
await mkdir(".test-artifacts", { recursive: true });
const page = await browser.newPage({ viewport: { width: 360, height: 780 } });
page.setDefaultTimeout(20000);
page.setDefaultNavigationTimeout(20000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
let payload;
let calls = [];
let fail = false;
await page.route("**/rest/v1/rpc/get_public_invitation_content", async (route) => {
  calls.push(route.request().postDataJSON());
  if (fail) return route.abort();
  return route.fulfill({ json: payload });
});
// Valid remote image URLs are served locally during the test.
await page.route("https://example.com/*.png", (route) =>
  route.fulfill({ path: "public/android-icon-192x192.png", contentType: "image/png" }),
);

async function visit(slug, data) {
  console.log(`Checking route: /${slug}`);
  payload = data;
  calls = [];
  await page.goto(`${base}/${slug}`);
}
async function open() {
  await page.getByRole("button", { name: "Open the wedding invitation" }).click();
  await page.locator("main").waitFor({ state: "visible" });
  await page.waitForFunction(() => !document.querySelector("main")?.closest("[inert]"));
}
async function noOverflow() {
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "page must not scroll horizontally",
  );
}

try {
  const full = {
    state: "live",
    shop: { name: "Approved Studio", phone: "SHOP CONTACT MUST NOT APPEAR" },
    content: {
      groom_name: "Arian",
      bride_name: "Elara",
      invocation: "Together with our families",
      wedding_date: "2027-12-14",
      start_time: "11:00",
      end_time: "12:00",
      groom_qualification: "MBA",
      groom_occupation: "Designer",
      groom_parents: "Groom family",
      bride_parents: "Bride family",
      relatives: "Our relatives",
      groom_photo_url: "https://example.com/groom.png",
      gallery: [{ src: "https://example.com/moment.png", caption: "A memory" }],
      events: [
        {
          title: "Ceremony",
          event_date: "2027-12-14",
          venue_name: "Grand Hall",
          mapsUrl: "https://maps.google.com/",
        },
      ],
      venue_name: "Grand Hall",
      venue_address: "Garden Avenue",
      contacts: [{ name: "Family", phone: "+91 90000 00000" }],
      music_enabled: true,
    },
  };
  await visit("arian-elara-03", full);
  await page.getByRole("button", { name: "Open the wedding invitation" }).waitFor();
  assert.deepEqual(calls, [{ p_slug: "arian-elara-03" }]);
  await page.screenshot({ path: ".test-artifacts/envelope-mobile.png" });
  await open();
  await noOverflow();
  assert.deepEqual(await page.locator("#couple h1").allTextContents(), ["Arian", "&", "Elara"]);
  assert.equal(await page.getByRole("button", { name: /music/i }).count(), 0);
  assert.equal(await page.locator('a[href="tel:+91 90000 00000"]').count(), 1);
  assert.equal(await page.locator('a[href="https://wa.me/919000000000"]').count(), 1);
  assert.ok(!(await page.locator("body").innerText()).includes("SHOP CONTACT MUST NOT APPEAR"));
  const ribbon = page.locator(".brand-ribbon");
  assert.equal(await ribbon.evaluate((el) => getComputedStyle(el).position), "fixed");
  assert.ok((await ribbon.boundingBox()).height <= 16);
  await page.locator("#couple").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: ".test-artifacts/couple-mobile.png" });
  await page.locator("#families").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: ".test-artifacts/families-mobile.png" });
  await page.locator("#gallery button").first().click();
  await page.getByRole("button", { name: "Close photo" }).waitFor();
  await page.getByRole("button", { name: "Close photo" }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator("#couple").scrollIntoViewIfNeeded();
  await noOverflow();
  await page.screenshot({ path: ".test-artifacts/couple-desktop.png" });
  await page.setViewportSize({ width: 320, height: 568 });
  await visit("minimal", {
    state: "live",
    content: { groom_name: "A Very Long Name That Must Wrap Without Clipping" },
  });
  await open();
  assert.equal(await page.locator("#couple h1").count(), 1);
  for (const id of ["families", "countdown", "events", "gallery", "venue", "contact"])
    assert.equal(await page.locator(`#${id}`).count(), 0);
  await noOverflow();
  await page.locator("#couple").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: ".test-artifacts/minimal-mobile.png" });
  await visit("expired", {
    state: "fallback",
    shop: { name: "Approved Studio", phone: "+91 12345", business_contact: "Studio desk" },
    content: full.content,
  });
  await page.getByRole("heading", { name: "This invitation is unavailable" }).waitFor();
  assert.equal(await page.locator("main").count(), 0);
  assert.ok(!(await page.locator("body").innerText()).includes("Arian"));
  await noOverflow();
  await page.screenshot({ path: ".test-artifacts/fallback-mobile.png" });
  await page.reload();
  await page.getByRole("heading", { name: "This invitation is unavailable" }).waitFor();
  await visit("missing", { state: "not_found" });
  await page.getByText("Invitation Not Found", { exact: true }).waitFor();
  fail = true;
  await visit("error", null);
  await page.getByRole("button", { name: "Try again" }).waitFor();
  fail = false;
  payload = { state: "not_found" };
  await page.getByRole("button", { name: "Try again" }).click();
  await page.getByText("Invitation Not Found", { exact: true }).waitFor();
  assert.equal(calls.length, 2);
  await visit("%E0%A4%A", null);
  await page.getByText("Invitation Not Found", { exact: true }).waitFor();
  assert.equal(calls.length, 0);
  assert.ok(page.url().includes("%E0%A4%A"), "malformed URLs must not redirect");
  for (const invalid of ["%2F", "%5C", "nested/slug"]) {
    await visit(invalid, null);
    await page.getByText("Invitation Not Found", { exact: true }).waitFor();
    assert.equal(calls.length, 0);
  }
  await visit("", null);
  await page.getByText("Invitation Not Found", { exact: true }).waitFor();
  assert.equal(calls.length, 0);
  const assets = [
    "/favicon.ico",
    "/favicon-16x16.png",
    "/favicon-32x32.png",
    "/favicon-96x96.png",
    "/apple-icon-180x180.png",
    "/manifest.json",
    "/browserconfig.xml",
  ];
  for (const asset of assets) assert.equal((await page.request.get(base + asset)).status(), 200);
  assert.deepEqual(errors, []);
  console.log(
    "Browser smoke passed: mobile/desktop layout, live/minimal/fallback/not-found/error/retry, refresh, contacts, gallery, ribbon, favicon assets, malformed routes, no runtime errors.",
  );
} finally {
  await browser.close();
}
