import { test, expect } from "@playwright/test";
import { join } from "path";
import { pathToFileURL } from "url";

const APPS = [
  { id: "canvas", file: "canvas.html", defaultType: "bug-canvas" },
  { id: "draw", file: "draw.html", defaultType: "bug-draw" },
  { id: "grid", file: "grid.html", defaultType: "bug-grid" },
  { id: "timeline", file: "timeline.html", defaultType: "bug-timeline" },
  { id: "voice", file: "voice.html", defaultType: "bug-voice" }
];

test.describe("Feedback modal across apps", () => {
  test("opens, toggles sharing, and submits from each module", async ({ page }) => {
    await page.route("**/v1/feedback", async route => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "ok", id: "stub" })
      });
    });

    await page.addInitScript(() => {
      window.goToolkitShareWorker = {
        baseUrl: "https://share.gotoolkit.workers.dev",
        version: "v1",
        isReady: true,
        async saveSharePayload() {
          return { meta: { updatedAt: new Date().toISOString() } };
        }
      };
    });

    for (const app of APPS) {
      const url = pathToFileURL(join(process.cwd(), "public", app.file)).toString();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      const prefix = `feedback-app-${app.id}`;
      const openBtn = page.locator(`#${prefix}-openBtn`);
      await expect(openBtn).toBeVisible();
      await openBtn.click();
      const backdrop = page.locator(`#${prefix}-backdrop`);
      await expect(backdrop).toHaveClass(/open/);
      const typeField = page.locator(`#${prefix}-type`);
      await expect(typeField).toHaveValue(app.defaultType);
      await page.fill(`#${prefix}-message`, `Playwright feedback test for ${app.id}`);
      const shareCheckbox = page.locator(`#${prefix}-shareCheckbox`);
      await shareCheckbox.check();
      const shareLink = page.locator(`#${prefix}-shareLink`);
      await expect(shareLink).toHaveAttribute("href", /share\.gotoolkit\.workers\.dev/);
      await page.locator(`#${prefix}-form button[type="submit"]`).click();
      await expect(backdrop).not.toHaveClass(/open/);
    }
  });
});
