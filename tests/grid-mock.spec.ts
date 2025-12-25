import { test, expect } from "@playwright/test";
import { join } from "path";
import { pathToFileURL } from "url";

const gridUrl = pathToFileURL(join(process.cwd(), "public", "grid.html")).toString();

const treeScript = `{
  "rows": [
    {
      "id": "root",
      "name": "Père Noël",
      "path": ["racine"],
      "type": "object",
      "format": "",
      "definition": "Sommets des demandes et du flux de vœux",
      "sample": "",
      "source": "référence",
      "relation": "1..1"
    },
    {
      "id": "wishlist",
      "name": "Vœux des enfants",
      "path": ["racine", "Vœux des enfants"],
      "type": "array",
      "format": "",
      "definition": "Liste structurée des souhaits reçus",
      "sample": "",
      "source": "référence",
      "relation": "1..n"
    },
    {
      "id": "child_ava",
      "name": "Ava",
      "path": ["racine", "Vœux des enfants", "Ava"],
      "type": "object",
      "format": "",
      "definition": "Souhaits exprimés par Ava",
      "sample": "",
      "source": "saisie",
      "relation": "1..1"
    },
    {
      "id": "child_chloe",
      "name": "Chloé",
      "path": ["racine", "Vœux des enfants", "Chloé"],
      "type": "object",
      "format": "",
      "definition": "Souhaits exprimés par Chloé",
      "sample": "",
      "source": "saisie",
      "relation": "1..1"
    },
    {
      "id": "child_leo",
      "name": "Léo",
      "path": ["racine", "Vœux des enfants", "Léo"],
      "type": "object",
      "format": "",
      "definition": "Souhaits exprimés par Léo",
      "sample": "",
      "source": "saisie",
      "relation": "1..1"
    },
    {
      "id": "child_mia",
      "name": "Mia",
      "path": ["racine", "Vœux des enfants", "Mia"],
      "type": "object",
      "format": "",
      "definition": "Souhaits exprimés par Mia",
      "sample": "",
      "source": "saisie",
      "relation": "1..1"
    },
    {
      "id": "child_noah",
      "name": "Noah",
      "path": ["racine", "Vœux des enfants", "Noah"],
      "type": "object",
      "format": "",
      "definition": "Souhaits exprimés par Noah",
      "sample": "",
      "source": "saisie",
      "relation": "1..1"
    }
  ]
}`;

const mockScript = `{"type":"header","columns":[{"field":"id","headerName":"ID","cellDataType":"number","editable":false},{"field":"nom","headerName":"Nom","cellDataType":"text","editable":true},{"field":"actif","headerName":"Actif","cellDataType":"boolean","editable":true},{"field":"dateNaissance","headerName":"Date de naissance","cellDataType":"date","editable":true},{"field":"dernierContact","headerName":"Dernier contact","cellDataType":"dateTime","editable":true},{"field":"score","headerName":"Score","cellDataType":"number","editable":true}]}
{"type":"row","data":{"id":1,"nom":"Alice Dupont","actif":true,"dateNaissance":"1991-04-04","dernierContact":"2025-12-19T18:42:10Z","score":87}}
{"type":"row","data":{"id":2,"nom":"Jacques Durand","actif":false,"dateNaissance":"1988-11-23","dernierContact":"2025-12-20T09:15:00Z","score":42}}
{"type":"row","data":{"id":3,"nom":"Marc Dupuis","actif":true,"dateNaissance":null,"dernierContact":null,"score":null}}
{"type":"done","summary":{"rows":3}}`;

test.describe.skip("Grid templates", () => {
  test("tree and mock templates render their grids without touching other pages", async ({ page }) => {
    await page.goto(gridUrl, { waitUntil: "load" });
    await page.waitForSelector("#gridScript");

    await page.waitForSelector("#gtTemplateModal.open");
    await page.locator("#gtTemplateModalList .gt-template-card:has-text('Structure de données')").click();
    await page.click("#gtTemplateModalApply");
    await page.waitForSelector("#gtTemplateModal.open", { state: "detached" });
    await page.evaluate(() => {
      const modal = document.getElementById("gtTemplateModal");
      if (modal) modal.style.pointerEvents = "none";
    });
    await page.click("#addPageBtn");
    await page.evaluate(() => {
      const modal = document.getElementById("gtTemplateModal");
      if (modal) modal.style.pointerEvents = "";
    });
    await page.waitForSelector("#gtTemplateModal.open");
    await page.locator("#gtTemplateModalList .gt-template-card:has-text('Structure de données')").click();
    await page.click("#gtTemplateModalApply");
    await page.waitForSelector("#gtTemplateModal.open", { state: "detached" });
    await page.fill("#gridScript", treeScript);
    await page.locator("#gridScript").blur();
    await expect(page.locator(".ag-center-cols-container .ag-row")).toHaveCount(7);
    const treeScriptValue = treeScript;

    await page.click("#addPageBtn");
    await page.click("#addPageBtn", { force: true });
    await page.waitForSelector("#gtTemplateModal.open");
    await page.locator("#gtTemplateModalList .gt-template-card:has-text('Données fictives')").click();
    await page.click("#gtTemplateModalApply");
    await page.waitForSelector("#gtTemplateModal.open", { state: "detached" });
    await page.fill("#gridScript", mockScript);
    await page.locator("#gridScript").blur();
    await expect(page.locator(".ag-center-cols-container .ag-row")).toHaveCount(3);
    await expect(page.locator(".ag-header-cell-text")).toContainText("ID");
    await expect(page.locator(".ag-header-cell-text")).toContainText("Nom");

    const tabs = page.locator("#pageTabs button");
    await tabs.nth(1).click(); // return to tree page
    await page.waitForTimeout(200);
    await expect(page.locator(".ag-center-cols-container .ag-row")).toHaveCount(7);
    await expect(page.locator("#gridScript")).toHaveValue(treeScriptValue);
  });
});
