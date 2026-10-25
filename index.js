"use strict";

const list = document.querySelector("#package-list");
const count = document.querySelector("#package-count");
const updated = document.querySelector("#updated");
const error = document.querySelector("#error");

function cell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

function linkCell(text, href) {
  const td = document.createElement("td");
  const a = document.createElement("a");
  a.textContent = text;
  a.href = href;
  a.rel = "noopener noreferrer";
  td.append(a);
  return td;
}

async function loadIndex() {
  try {
    const response = await fetch("/metadata/index.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Index request failed: HTTP ${response.status}`);
    }

    const index = await response.json();

    if (!Array.isArray(index.packages)) {
      throw new Error("Invalid package index");
    }

    list.replaceChildren();
    count.textContent = `${index.packages.length} package(s)`;

    updated.textContent = index.updated_at
      ? `Last updated: ${new Date(index.updated_at).toLocaleString()}`
      : "Not yet published";

    for (const pkg of index.packages) {
      const tr = document.createElement("tr");

      tr.append(
        cell(pkg.name),
        cell(pkg.version),
        cell(index.architecture || "x86_64"),
        linkCell("Source ↗", pkg.url)
      );

      list.append(tr);
    }

    if (index.packages.length === 0) {
      list.append(cell("No packages published yet."));
    }
  } catch (err) {
    count.textContent = "Unavailable";
    error.hidden = false;
    error.textContent = err.message;
    list.replaceChildren();
  }
}

document.querySelector("#copy-config").addEventListener("click", async () => {
  const config = "[voidctx]\nServer = https://repo.voidctx.dev/$arch";

  try {
    await navigator.clipboard.writeText(config);
    document.querySelector("#copy-config").textContent = "Copied";
  } catch {
    document.querySelector("#copy-config").textContent = "Copy unavailable";
  }
});

loadIndex();
