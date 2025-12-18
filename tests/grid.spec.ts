import { test, expect } from "@playwright/test";

async function freezeTime(page: any, isoString: string) {
  await page.addInitScript(({ iso }) => {
    const fixed = new Date(iso).getTime();
    const OriginalDate = Date;
    class MockDate extends OriginalDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super(fixed);
        } else {
          // @ts-ignore
          super(...args);
        }
      }
      static now() {
        return fixed;
      }
    }
    // @ts-ignore
    MockDate.UTC = OriginalDate.UTC;
    // @ts-ignore
    MockDate.parse = OriginalDate.parse;
    // @ts-ignore
    MockDate.prototype = OriginalDate.prototype;
    // @ts-ignore
    window.Date = MockDate;
  }, { iso: isoString });
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

test("natural French filter narrows Clients to Alice Dupont", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");

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

test("natural French filter supports multi-word equality without quotes", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");

  await page.locator("#gridScript").fill(SAMPLE_MULTI_TABLE_DATASET);
  await page.locator("#gridTitleInput").click();

  const clientsTab = page.getByRole("button", { name: "Clients" });
  await clientsTab.waitFor({ state: "visible", timeout: 10000 });
  await clientsTab.click();

  const filterInput = page.locator("#gridNaturalFilterInput");
  await filterInput.fill("Nom est Alice Dupont");
  await page.waitForTimeout(1200);

  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(1, { timeout: 10000 });
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Alice Dupont");
});

test("natural French filter supports OR between values and comma AND between conditions", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");

  await page.locator("#gridScript").fill(SAMPLE_MULTI_TABLE_DATASET);
  await page.locator("#gridTitleInput").click();

  const clientsTab = page.getByRole("button", { name: "Clients" });
  await clientsTab.waitFor({ state: "visible", timeout: 10000 });
  await clientsTab.click();

  const filterInput = page.locator("#gridNaturalFilterInput");
  await filterInput.fill('Nom est Alice Dupont ou Benoît Martin, Email contient "example.com"');
  await page.waitForTimeout(1200);

  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(2, { timeout: 10000 });
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Alice Dupont");
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Benoît Martin");
});

test("natural French filter supports ', ou' between conditions", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");

  await page.locator("#gridScript").fill(SAMPLE_MULTI_TABLE_DATASET);
  await page.locator("#gridTitleInput").click();

  const clientsTab = page.getByRole("button", { name: "Clients" });
  await clientsTab.waitFor({ state: "visible", timeout: 10000 });
  await clientsTab.click();

  const filterInput = page.locator("#gridNaturalFilterInput");
  await filterInput.fill('Nom est Alice Dupont, ou Nom est "Benoît Martin"');
  await page.waitForTimeout(1200);

  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(2, { timeout: 10000 });
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Alice Dupont");
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Benoît Martin");
});

test("natural French filter ignores incomplete 'ou' value list", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/grid.html");

  await page.locator("#gridScript").fill(SAMPLE_MULTI_TABLE_DATASET);
  await page.locator("#gridTitleInput").click();

  const clientsTab = page.getByRole("button", { name: "Clients" });
  await clientsTab.waitFor({ state: "visible", timeout: 10000 });
  await clientsTab.click();

  const filterInput = page.locator("#gridNaturalFilterInput");
  await filterInput.fill("Nom est Alice Dupont ou");
  await page.waitForTimeout(1200);

  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(3, { timeout: 10000 });
});

test("natural French filter supports relative date keywords (hier/demain) in between", async ({ page }) => {
  await freezeTime(page, "2024-03-23T12:00:00.000Z");
  await page.goto("http://127.0.0.1:8080/grid.html");

  await page.locator("#gridScript").fill(SAMPLE_MULTI_TABLE_DATASET);
  await page.locator("#gridTitleInput").click();

  const clientsTab = page.getByRole("button", { name: "Clients" });
  await clientsTab.waitFor({ state: "visible", timeout: 10000 });
  await clientsTab.click();

  const filterInput = page.locator("#gridNaturalFilterInput");
  await filterInput.fill("Date d'inscription entre hier et demain");
  await page.waitForTimeout(1200);

  const rows = page.locator(".ag-center-cols-container .ag-row");
  await expect(rows).toHaveCount(1, { timeout: 10000 });
  await expect(page.locator(".ag-pinned-left-cols-container")).toContainText("Benoît Martin");
});
