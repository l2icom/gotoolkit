const path = require("path");
const { chromium } = require("playwright");

(async () => {
    const defaultUrl = `file:///${path.resolve(__dirname, "../public/cardinal.html").replace(/\\/g, "/")}`;
    const targetUrl = process.argv[2] || defaultUrl;
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.addInitScript(() => {
        const elementType = typeof Element;
        const htmlElementType = typeof HTMLElement;
        const nodeType = typeof Node;
        console.log("[init] typeof Element:", elementType, "HTMLElement:", htmlElementType, "Node:", nodeType);
    });
    page.on("console", msg => {
        console.log(`[page:${msg.type()}]`, msg.text());
    });
    page.on("pageerror", error => {
        console.error("[pageerror]", error);
    });
    page.on("requestfailed", request => {
        console.warn("[requestfailed]", request.url(), request.failure()?.errorText);
    });
    console.log("Opening", targetUrl);
    try {
        await page.goto(targetUrl, { waitUntil: "load" });
        await page.waitForTimeout(8000);
    } catch (error) {
        console.error("Playwright navigation error", error);
    } finally {
        await browser.close();
    }
})();
