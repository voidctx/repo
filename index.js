"use strict";

const list = document.querySelector("#package-list");
const count = document.querySelector("#package-count");
const error = document.querySelector("#error");

async function loadCatalog() {
  try {
    const response = await fetch("./meta.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Catalog request failed: HTTP ${response.status}`);
    }

    const packages = await response.json();

    if (!Array.isArray(packages)) {
      throw new Error("Invalid catalog format");
    }

    list.replaceChildren();
    count.textContent = `${packages.length} package(s)`;

    for (const pkg of packages) {
      const row = document.createElement("tr");

      const name = document.createElement("td");
      name.textContent = pkg.name;

      const asset = document.createElement("td");
      asset.textContent = pkg.asset;

      const source = document.createElement("td");
      const link = document.createElement("a");
      link.href = pkg.url;
      link.textContent = "GitHub ↗";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      source.append(link);

      row.append(name, asset, source);
      list.append(row);
    }

    if (packages.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 3;
      cell.textContent = "No packages configured.";
      row.append(cell);
      list.append(row);
    }
  } catch (err) {
    count.textContent = "Unavailable";
    list.replaceChildren();
    error.hidden = false;
    error.textContent = err.message;
  }
}

document.querySelector("#copy-config").addEventListener("click", async () => {
  const config = "[voidctx]\nServer = https://repo.voidctx.dev/$arch";
  const button = document.querySelector("#copy-config");

  try {
    await navigator.clipboard.writeText(config);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Copy unavailable";
  }
});

loadCatalog();
