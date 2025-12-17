import { test, expect } from "@playwright/test";

const SAMPLE_GRID_SCRIPT = `{
  "columnDefs": [
    {
      "field": "id",
      "headerName": "ID",
      "editable": false
    },
    {
      "field": "name",
      "headerName": "Name",
      "editable": true
    },
    {
      "field": "favoriteDrink",
      "headerName": "Favorite Drink",
      "editable": true
    },
    {
      "field": "sockColor",
      "headerName": "Sock Color",
      "editable": true
    }
  ],
  "rowData": [
    {
      "id": "ELF01",
      "name": "Lumin",
      "favoriteDrink": "hydromel",
      "sockColor": "rouge"
    },
    {
      "id": "ELF02",
      "name": "Brindin",
      "favoriteDrink": "infusion de menthe",
      "sockColor": "bleu"
    },
    {
      "id": "ELF03",
      "name": "Paillette",
      "favoriteDrink": "thé chaud",
      "sockColor": "vert"
    },
    {
      "id": "ELF04",
      "name": "Étoile",
      "favoriteDrink": "cacao",
      "sockColor": "jaune"
    },
    {
      "id": "ELF05",
      "name": "Noctis",
      "favoriteDrink": "jus de pomme",
      "sockColor": "noir"
    },
    {
      "id": "ELF06",
      "name": "Mistral",
      "favoriteDrink": "limonade légère",
      "sockColor": "bleu"
    },
    {
      "id": "ELF07",
      "name": "Flocon",
      "favoriteDrink": "eau pétillante au citron",
      "sockColor": "blanc"
    },
    {
      "id": "ELF08",
      "name": "Ondine",
      "favoriteDrink": "sirop d'érable",
      "sockColor": "rose"
    },
    {
      "id": "ELF09",
      "name": "Cendre",
      "favoriteDrink": "thé glacé",
      "sockColor": "violet"
    },
    {
      "id": "ELF10",
      "name": "Fern",
      "favoriteDrink": "café moka",
      "sockColor": "orange"
    },
    {
      "id": "ELF11",
      "name": "Iris",
      "favoriteDrink": "infusion de camomille",
      "sockColor": "gris"
    },
    {
      "id": "ELF12",
      "name": "Sylas",
      "favoriteDrink": "chaï latte",
      "sockColor": "rouge"
    },
    {
      "id": "ELF13",
      "name": "Thistle",
      "favoriteDrink": "jus de raisin",
      "sockColor": "bleu"
    },
    {
      "id": "ELF14",
      "name": "Clover",
      "favoriteDrink": "eau aromatisée",
      "sockColor": "vert"
    },
    {
      "id": "ELF15",
      "name": "Nébuleuse",
      "favoriteDrink": "infusion de menthe",
      "sockColor": "jaune"
    },
    {
      "id": "ELF16",
      "name": "Verdant",
      "favoriteDrink": "sirop d'érable chaud",
      "sockColor": "noir"
    },
    {
      "id": "ELF17",
      "name": "Carmin",
      "favoriteDrink": "thé noir",
      "sockColor": "blanc"
    },
    {
      "id": "ELF18",
      "name": "Azure",
      "favoriteDrink": "cocos chaud",
      "sockColor": "orange"
    },
    {
      "id": "ELF19",
      "name": "Pomme",
      "favoriteDrink": "jus de pomme",
      "sockColor": "rose"
    },
    {
      "id": "ELF20",
      "name": "Perle",
      "favoriteDrink": "eau plate",
      "sockColor": "violet"
    },
    {
      "id": "ELF21",
      "name": "Glacé",
      "favoriteDrink": "lait chaud",
      "sockColor": "gris"
    },
    {
      "id": "ELF22",
      "name": "Citrine",
      "favoriteDrink": "limonade",
      "sockColor": "rouge"
    },
    {
      "id": "ELF23",
      "name": "Orélie",
      "favoriteDrink": "játăr",
      "sockColor": "bleu"
    },
    {
      "id": "ELF24",
      "name": "Liora",
      "favoriteDrink": "thé matcha",
      "sockColor": "vert"
    },
    {
      "id": "ELF25",
      "name": "Solstice",
      "favoriteDrink": "café",
      "sockColor": "noir"
    }
  ]
}`;

test("grid draft save/load", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");
  await page.fill("#gridScript", SAMPLE_GRID_SCRIPT);
  await page.click("#applyScriptBtn");
  await page.click("#capsuleMenuBtn");
  await page.click("#saveDocumentBtn");
  await expect(page.locator("#statusToast")).toContainText("Capsule enregistrée localement.", {
    timeout: 5000
  });
  const savedUrl = page.url();
  expect(savedUrl).toContain("edit=");
  const savedRecords = await page.evaluate(async () => {
    const records = await window.goToolkitCapsuleDrafts?.getAllRecords?.();
    if (!records) return [];
    return records.map(record => ({ id: record.id, app: record.app, payload: Boolean(record.payload) }));
  });
  console.log("savedRecords:", savedRecords);
  const indexPage = await page.context().newPage();
  await indexPage.goto("http://127.0.0.1:8080/index.html");
  await indexPage.waitForTimeout(3000);
  const recordsOnIndex = await indexPage.evaluate(async () => {
    const records = await window.goToolkitCapsuleDrafts?.getAllRecords?.();
    if (!records) return [];
    return records.map(record => ({ id: record.id, app: record.app }));
  });
  console.log("records on index:", recordsOnIndex);
  const hasDocStore = await indexPage.evaluate(() => Boolean(window.goToolkitDocStore));
  console.log("has doc store on index:", hasDocStore);
  const storeSnapshot = await indexPage.evaluate(async () => {
    const store = window.goToolkitDocStore?.createStore("capsule-drafts");
    if (!store) return null;
    return store.get("records");
  });
  console.log("store snapshot on index:", storeSnapshot);
  const sharedPreviewKeys = await indexPage.evaluate(() => {
    const keys = window.__goToolkitSharedPreviewKeys;
    if (!keys) return [];
    return Array.from(keys);
  });
  console.log("shared preview keys:", sharedPreviewKeys);
  console.log("savedGallery html:", await indexPage.innerHTML("#savedGallery"));
  const savedCard = indexPage.locator('#savedGallery .share-card[data-app="grid"]');
  await savedCard.first().waitFor({ state: "visible", timeout: 20000 });
  await expect(savedCard.first()).toHaveAttribute("href", savedUrl);
  await indexPage.close();
  await page.goto(savedUrl);
  const scriptValue = await page.locator("#gridScript").inputValue();
  expect(scriptValue).toContain('"favoriteDrink": "hydromel"');
});
