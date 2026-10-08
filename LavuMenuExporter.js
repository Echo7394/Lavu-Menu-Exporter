
(async () => {
  const selector = document.getElementById("menu_group_selector");

  if (!selector) {
    console.error("Menu group selector not found.");
    return;
  }

  const groups = [...selector.options]
    .filter(o => /^\d+$/.test(o.value))
    .map(o => ({
      id: o.value,
      name: o.text.trim()
    }));

  const location =
    document.querySelector('[name="posted_dataname"]')?.value ||
    "unknown";

  const allRows = [];
  const failures = [];

  function extract(doc, group) {
    const fields = new Map(
      [...doc.querySelectorAll("input[name]")]
        .map(el => [el.name, el.value])
    );

    const rows = [];

    for (const [field, name] of fields) {
      const match = field.match(/^ic_(\d+)_name_(\d+)$/);

      if (!match || !name.trim()) continue;

      const [, categoryIndex, itemIndex] = match;
      const prefix = `ic_${categoryIndex}_`;

      const get = key => fields.get(prefix + key) ?? "";

      rows.push({
        Location: location,
        "Menu Group": group.name,
        Category: get("category"),
        "Item Name": name.trim(),
        Price: get(`cost_${itemIndex}`),
        "Item ID": get(`id_${itemIndex}`),
        Active: get(`active_${itemIndex}`),
        Description: get(`description_${itemIndex}`)
      });
    }

    return rows;
  }

  for (const group of groups) {
    try {
      console.log(`Loading ${group.name}...`);

      const url =
        `index.php?mode=menu_edit_menu&set_groupid=${group.id}`;

      const response = await fetch(url, {
        credentials: "same-origin",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const doc = new DOMParser().parseFromString(
        html,
        "text/html"
      );

      const rows = extract(doc, group);

      if (!doc.querySelector('[name="posted_dataname"]')) {
        throw new Error("Menu editor not found in response");
      }

      if (rows.length === 0) {
        console.warn(`${group.name}: No items found`);
      }

      console.log(`${group.name}: ${rows.length} items`);
      allRows.push(...rows);

    } catch (err) {
      console.error(`${group.name}:`, err);
      failures.push(group.name);
    }
  }

  console.log("Total items:", allRows.length);
  console.log("Failed groups:", failures);

  if (failures.length) {
    console.warn("Export incomplete. Failed:", failures);
    return;
  }

  if (!allRows.length) {
    console.error("No menu items extracted.");
    return;
  }

  const headers = Object.keys(allRows[0]);
  const escapeCSV = v =>
    '"' + String(v ?? "").replace(/"/g, '""') + '"';

  const csv = [
    headers.map(escapeCSV).join(","),
    ...allRows.map(row =>
      headers.map(h => escapeCSV(row[h])).join(",")
    )
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8"
  });

  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = downloadUrl;
  a.download = `Lavu_All_Menu_Groups_${location}.csv`;

  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

  console.log("CSV export complete.");
})();
