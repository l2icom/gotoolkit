import { test, expect, Page } from "@playwright/test";

const STREAMING_LINES = [
  `{"type":"header","schema":{"tables":[{"id":"products","title":"Produits test","primaryKey":"id","columns":[{"field":"id","headerName":"Id","editable":false,"cellDataType":"number"},{"field":"name","headerName":"Nom","editable":true,"cellDataType":"text"}],"relations":[]}]}}\n`,
  `{"type":"row","table":"products","data":{"id":1,"name":"Alpha"}}\n`,
  `{"type":"row","table":"products","data":{"id":2,"name":"Beta"}}\n`,
  `{"type":"done","summary":{"tables":{"products":2}}}\n`
];

const TREE_SAMPLE = `{
  "rows": [
    {
      "id": "contract",
      "name": "contract",
      "path": ["contract"],
      "type": "object",
      "format": "object",
      "definition": "Contrat principal",
      "sample": "",
      "source": "Src",
      "relation": "1..1"
    },
    {
      "id": "contract_id",
      "name": "contract_id",
      "path": ["contract", "contract_id"],
      "type": "varchar",
      "format": "varchar",
      "definition": "Identifiant du contrat",
      "sample": "1-XXXX",
      "source": "SAP",
      "relation": "1..1"
    },
    {
      "id": "payment_terms",
      "name": "payment_terms",
      "path": ["contract", "payment_terms"],
      "type": "object",
      "format": "object",
      "definition": "Modalités de paiement",
      "sample": "",
      "source": "Src",
      "relation": "1..n"
    },
    {
      "id": "invoice_type",
      "name": "invoice_type",
      "path": ["contract", "payment_terms", "invoice_type"],
      "type": "varchar",
      "format": "varchar",
      "definition": "Type de facture",
      "sample": "ex: email",
      "source": "Src",
      "relation": "1..1"
    },
    {
      "id": "value",
      "name": "value",
      "path": ["contract", "payment_terms", "value"],
      "type": "varchar",
      "format": "varchar",
      "definition": "Pourcentage à appliquer",
      "sample": "ex: email",
      "source": "Src",
      "relation": "1..1"
    }
  ]
}`;

async function closeTemplateModalIfPresent(page: Page) {
  await page.waitForTimeout(80);
  const modal = page.locator("#templateModal");
  if (await modal.isVisible()) {
    await page.locator("#templateApplyBtn").click();
  }
}

const SAMPLE_MULTI_TABLE_DATASET = `{
  "schema": {
    "tables": [
      {
        "id": "customers",
        "title": "Clients",
        "primaryKey": "id",
        "columns": [],
        "relations": []
      },
      {
        "id": "orders",
        "title": "Commandes",
        "primaryKey": "id",
        "columns": [],
        "relations": [
          {
            "type": "many-to-one",
            "fromTable": "orders",
            "fromColumn": "customerId",
            "toTable": "customers",
            "toColumn": "id",
            "label": "Client"
          }
        ]
      },
      {
        "id": "order_items",
        "title": "Articles",
        "primaryKey": "id",
        "columns": [],
        "relations": [
          {
            "type": "one-to-many",
            "fromTable": "order_items",
            "fromColumn": "orderId",
            "toTable": "orders",
            "toColumn": "id",
            "label": "Commande"
          }
        ]
      }
    ]
  },
  "data": {
    "customers": {
      "columnDefs": [
        {
          "editable": false,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": "number",
          "cellEditor": "agNumberCellEditor",
          "field": "id",
          "headerName": "Id",
          "pinned": "left",
          "colId": "id",
          "width": 128.79999999999995,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": "text",
          "field": "name",
          "headerName": "Nom",
          "pinned": "left",
          "colId": "name",
          "width": 195,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": false,
          "field": "email",
          "headerName": "Email",
          "colId": "email",
          "width": 313,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "pinned": null,
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": false,
          "field": "signupDate",
          "headerName": "Date d'inscription",
          "colId": "signupDate",
          "width": 306,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "pinned": null,
          "sort": null,
          "sortIndex": null
        }
      ],
      "rowData": [
        {
          "id": 1,
          "name": "Alice Dupont",
          "email": "alice.dupont@example.com",
          "signupDate": "2024-01-15"
        },
        {
          "id": 2,
          "name": "Benoît Martin",
          "email": "benoit.martin@example.com",
          "signupDate": "2024-03-22"
        },
        {
          "id": 3,
          "name": "Caroline Leroy",
          "email": "caroline.leroy@example.com",
          "signupDate": "2024-06-08"
        }
      ]
    },
    "orders": {
      "columnDefs": [
        {
          "editable": false,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": "number",
          "cellEditor": "agNumberCellEditor",
          "field": "id",
          "headerName": "Id",
          "pinned": "left",
          "colId": "id",
          "width": 106.79999999999995,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": false,
          "field": "customerId",
          "headerName": "Client Id",
          "colId": "customerId",
          "width": 142,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "pinned": "left",
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": "text",
          "field": "name",
          "headerName": "Nom de la commande",
          "pinned": "left",
          "colId": "name",
          "width": 231,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": false,
          "field": "orderDate",
          "headerName": "Date de commande",
          "colId": "orderDate",
          "width": 220,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "pinned": null,
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": false,
          "type": "numericColumn",
          "headerClass": "ag-right-aligned-header",
          "cellClass": "ag-right-aligned-cell",
          "field": "amount",
          "headerName": "Montant",
          "colId": "amount",
          "width": 145,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "pinned": null,
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": false,
          "field": "status",
          "headerName": "Statut",
          "cellEditor": "agSelectCellEditor",
          "cellEditorParams": {
            "values": ["pending", "paid", "cancelled"]
          },
          "colId": "status",
          "width": 128,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "pinned": null,
          "sort": null,
          "sortIndex": null
        }
      ],
      "rowData": [
        {
          "id": 101,
          "name": "Commande A",
          "orderDate": "2024-07-01",
          "amount": 150,
          "status": "paid",
          "customerId": 1
        },
        {
          "id": 102,
          "name": "Commande B",
          "orderDate": "2024-07-03",
          "amount": 85,
          "status": "pending",
          "customerId": 2
        },
        {
          "id": 103,
          "name": "Commande C",
          "orderDate": "2024-07-04",
          "amount": 230,
          "status": "paid",
          "customerId": 3
        },
        {
          "id": 104,
          "name": "Commande D",
          "orderDate": "2024-07-10",
          "amount": 60,
          "status": "cancelled",
          "customerId": 1
        }
      ]
    },
    "order_items": {
      "columnDefs": [
        {
          "editable": false,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": "number",
          "cellEditor": "agNumberCellEditor",
          "field": "id",
          "headerName": "Id",
          "pinned": "left",
          "colId": "id",
          "width": 79,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": false,
          "field": "orderId",
          "headerName": "Commande Id",
          "colId": "orderId",
          "width": 140,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "pinned": "left",
          "sort": null,
          "sortIndex": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": "text",
          "field": "productName",
          "headerName": "Nom du produit",
          "colId": "productName",
          "width": 210,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "sort": null,
          "sortIndex": null,
          "pinned": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": "text",
          "field": "quantity",
          "headerName": "Quantité",
          "colId": "quantity",
          "width": 110,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "sort": null,
          "sortIndex": null,
          "pinned": null
        },
        {
          "editable": true,
          "sortable": true,
          "filter": true,
          "resizable": true,
          "cellDataType": false,
          "field": "unitPrice",
          "headerName": "Prix unité",
          "colId": "unitPrice",
          "width": 120,
          "rowGroup": false,
          "rowGroupIndex": null,
          "pivot": false,
          "pivotIndex": null,
          "aggFunc": null,
          "sort": null,
          "sortIndex": null,
          "pinned": null
        }
      ],
      "rowData": [
        {
          "id": 1,
          "orderId": 101,
          "productName": "T-Shirt Blanc",
          "quantity": 2,
          "unitPrice": 25
        },
        {
          "id": 2,
          "orderId": 101,
          "productName": "Pantalon Jeans",
          "quantity": 1,
          "unitPrice": 40
        },
        {
          "id": 3,
          "orderId": 102,
          "productName": "Casquette",
          "quantity": 1,
          "unitPrice": 15
        },
        {
          "id": 4,
          "orderId": 103,
          "productName": "Livre Robotique",
          "quantity": 2,
          "unitPrice": 20
        }
      ]
    }
  }
}`;

test("renders tree dataset via AI stub (Structure de données)", async ({ page }) => {
  const fixtureState = {
    pages: [
      {
        id: "page-structure",
        tableId: "structure",
        title: "Structure de données",
        primaryKey: "id",
        relations: [],
        templateId: "tree-structure",
        scenario: "",
        script: "",
        lastAiScript: "",
        data: { columnDefs: [], rowData: [] }
      }
    ],
    activeIndex: 0,
    promptTemplate: "",
    systemPrompt: "",
    reasoningEffort: "low",
    displayPreferences: {},
    activeTemplateId: "tree-structure",
    templateStates: {},
    schema: {
      tables: [
        {
          id: "structure",
          title: "Structure de données",
          primaryKey: "id",
          columns: [],
          relations: []
        }
      ]
    },
    datasetScript: "",
    lastAiDatasetScript: "",
    scenarioGeneratedTables: {}
  };

  await page.addInitScript(({ state, treeResponse }) => {
    window.localStorage.setItem("grid-ai-state", JSON.stringify(state));
    // Stub the AI client so "Répondre" returns a tree payload immediately (non-stream).
    (window as any).GoToolkitIA = {
      chatCompletion: async () => treeResponse
    };
    (window as any).GoToolkitIAConfig = { getOpenAiModel: () => "stub-tree-model" };
  }, { state: fixtureState, treeResponse: TREE_SAMPLE });

  await page.goto("http://127.0.0.1:8080/grid.html");
  await closeTemplateModalIfPresent(page);

  // Fill scenario and trigger generation.
  await page.locator("#promptInput").fill("demande de maintenance de moteur d'avion");
  await page.locator("#generateBtn").click();

  const gridRows = page.locator(".ag-center-cols-container .ag-row");
  await expect(gridRows.first()).toBeVisible({ timeout: 5000 });
  await expect(await gridRows.count()).toBeGreaterThan(0);
});

test("natural French filter narrows Clients to Alice Dupont", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");
  await closeTemplateModalIfPresent(page);

  await page.locator("#gridScript").fill(SAMPLE_MULTI_TABLE_DATASET);
  // gridScript applies on blur.
  await page.locator("#gridTitleInput").click();

  // Wait for the Clients tab to exist, then activate it.
  const clientsTab = page.getByRole("button", { name: "Clients" });
  await clientsTab.waitFor({ state: "visible", timeout: 10000 });
  await clientsTab.click();

  // Apply natural filter
  const filterInput = page.locator("#gridNaturalFilterInput");
  await filterInput.fill('Nom contient "Alice Dupont"');
  await page.waitForTimeout(1200);

  // Wait for the grid to narrow down to one row and contain Alice Dupont.
  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(1, { timeout: 10000 });
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Alice Dupont");
});

test("foreign key natural filter matches by related name", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");
  await closeTemplateModalIfPresent(page);

  await page.locator("#gridScript").fill(SAMPLE_MULTI_TABLE_DATASET);
  await page.locator("#gridTitleInput").click();

  const ordersTab = page.getByRole("button", { name: "Commandes" });
  await ordersTab.waitFor({ state: "visible", timeout: 10000 });
  await ordersTab.click();

  const filterInput = page.locator("#gridNaturalFilterInput");
  await filterInput.fill("Client est Alice Dupont");
  await page.waitForTimeout(1200);

  // Orders for customerId=1 should be 2 rows (Commande A, Commande D)
  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(2, { timeout: 10000 });
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Commande A");
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Commande D");
});

test("tree template renders hierarchical rows", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");
  await closeTemplateModalIfPresent(page);

  // Open prompt modal and switch to tree template
  await page.locator("#aiSettingsBtn").click();
  await page.locator("#aiTemplateSelect").selectOption("tree-structure");
  await page.locator("#applyAiSettingsBtn").click();

  // Fill script with tree sample and blur to apply
  await page.locator("#gridScript").fill(TREE_SAMPLE);
  await page.locator("#gridTitleInput").click();

  await page.waitForTimeout(300);
  const debug = await page.evaluate(() => {
    // @ts-ignore
    return window.goToolkitGridApi?.getDisplayedRowCount?.() || 0;
  });
  console.log("DEBUG displayed rows", debug);

  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(5, { timeout: 10000 });
  await expect(page.locator(".ag-body-viewport")).toContainText("contract");
  await expect(page.locator(".ag-body-viewport")).toContainText("payment_terms");
  await expect(page.locator(".ag-body-viewport")).toContainText("invoice_type");
});

test("tree template applies AI response into grid", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.goto("http://127.0.0.1:8080/grid.html");
  await closeTemplateModalIfPresent(page);

  // Force template to tree via UI
  await page.locator("#aiSettingsBtn").click();
  await page.locator("#aiTemplateSelect").selectOption("tree-structure");
  await page.locator("#applyAiSettingsBtn").click();

  await page.evaluate(sample => {
    // @ts-ignore
    window.GoToolkitIA = {
      chatCompletion: async () => sample
    };
  }, TREE_SAMPLE);

  await page.locator("#generateBtn").click();

  await page.waitForTimeout(500); // allow parsing

  const rowsViaApi = await page.evaluate(() => {
    // @ts-ignore
    const api = window.goToolkitGridApi;
    if (!api) return 0;
    try {
      const model = api.getModel();
      return typeof model.getRowCount === "function" ? model.getRowCount() : 0;
    } catch (e) {
      return 0;
    }
  });
  const datasetScript = await page.evaluate(() => {
    const script = document.getElementById("gridScript") as HTMLTextAreaElement | null;
    return script ? script.value : "";
  });
  expect(datasetScript.trim().length).toBeGreaterThan(0);
  expect(rowsViaApi).toBeGreaterThanOrEqual(5);

  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(5, { timeout: 10000 });
  await expect(page.locator(".ag-body-viewport")).toContainText("contract");
  await expect(page.locator(".ag-body-viewport")).toContainText("payment_terms");
});

test("streams update ag-Grid incrementally", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  await page.goto("http://127.0.0.1:8080/grid.html");
  await closeTemplateModalIfPresent(page);
  await page.evaluate(({ lines }) => {
    // @ts-ignore
    // @ts-ignore
    window.__streamChunks = [];
    const mockCompletion = async ({ onChunk }: any) =>
      await new Promise(resolve => {
        let aggregated = "";
        const delay = 400;
        lines.forEach((line, idx) => {
          setTimeout(() => {
            aggregated += line;
            // @ts-ignore
            window.__streamChunks.push({ line, ts: Date.now() });
            if (typeof onChunk === "function") {
              try {
                onChunk(line);
              } catch (err) {
                console.warn("onChunk mock failed", err);
              }
            }
            if (idx === lines.length - 1) {
              resolve(aggregated);
            }
          }, idx * delay);
        });
      });
    // @ts-ignore
    window.GoToolkitIA = { chatCompletion: mockCompletion };
    // @ts-ignore
    window.GoToolkitIAClient = { chatCompletion: mockCompletion, supportsStreaming: () => true };
  }, { lines: STREAMING_LINES });
  await page.locator("#generateBtn").click();

  const produitsTab = page.getByRole("button", { name: "Produits test" });
  await produitsTab.waitFor({ state: "visible", timeout: 8000 });
  await produitsTab.click();

  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(2, { timeout: 10000 });

  const chunkTimes = await page.evaluate(() => {
    // @ts-ignore
    const chunks = Array.isArray(window.__streamChunks) ? window.__streamChunks : [];
    return chunks
      .filter(item => typeof item?.line === "string" && item.line.includes('"type":"row"'))
      .map(item => item.ts);
  });
  expect(chunkTimes.length).toBe(2);
  expect(chunkTimes[1] - chunkTimes[0]).toBeGreaterThanOrEqual(250);
});
