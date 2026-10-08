# Lavu POS Menu Exporter

A simple, free script for exporting menu items, prices, categories, and other menu information from the **Lavu POS Admin Control Panel** into a CSV file.

No API keys, third-party services, or additional software required.

This tool was created to address a limitation in the Lavu POS Control Panel, which does not provide a straightforward way to export a complete menu, including items that have never been sold.

## Features

- **Export multiple menu groups** — Automatically processes the menu groups available at the selected location.
- **CSV format** — Compatible with Microsoft Excel, Google Sheets, LibreOffice Calc, and other spreadsheet applications.
- **Item details** — Exports item names, prices, categories, descriptions, and item IDs.
- **Menu organization** — Preserves menu group and category information.
- **Active/inactive status** — Includes both active and inactive menu items.
- **Multi-location support** — Can be run separately for each Lavu POS location.
- **No API credentials required** — Uses your existing authenticated Lavu browser session.
- **No installation required** — Runs directly in your browser's JavaScript Console.
- **No external data transmission** — The script does not intentionally send menu data to third-party services.

## Requirements

- An active Lavu POS account.
- Administrative access to the Lavu POS Control Panel.
- A modern web browser with Developer Tools, such as Firefox, Chrome, or Edge.
- The `LavuMenuExporter.js` script included in this repository.

## Installation

1. Download or clone this GitHub repository.
2. Locate the `LavuMenuExporter.js` file.
3. Save the file somewhere convenient on your computer.

No dependencies, package managers, or additional installations are required.

## Usage

### Step 1: Sign in to Lavu

Open your browser and navigate to:

https://cp.poslavu.com

Sign in using your existing Lavu POS administrator credentials.

### Step 2: Select your location

If your Lavu account manages multiple locations, select the location whose menu you want to export.

The script exports menu data for the currently selected location.

### Step 3: Navigate to Menu Items

From the Lavu Control Panel, navigate to:

**Menus → Menu Items**

The menu editor should display your existing menu groups, categories, and items.

### Step 4 **Important**: Open the menu editor in a separate tab

In **most** versions of the Lavu Control Panel, the menu editor is embedded inside an iframe.

To access it directly:

1. Right-click anywhere inside the menu editor.
2. Select **This Frame → Open Frame in New Tab** (Firefox).
3. Confirm that the new tab displays the menu editor.

The URL should resemble:

`https://cp0.poslavu.com/cp/index.php?mode=menu_edit_menu&react=1`

The hostname may vary depending on your Lavu environment.

**Important:** Run the script within the actual menu editor page, not the parent Control Panel page.

### Step 5: Open Developer Tools

Open the browser's JavaScript Console.

| Browser | Shortcut |
|---|---|
| Firefox | F12 → Console |
| Chrome | F12 → Console |
| Edge | F12 → Console |

### Step 6: Run the exporter

1. Open `LavuMenuExporter.js` in any text editor.
2. Copy the entire contents of the file.
3. Paste the JavaScript into the browser Console.
4. Press **Enter**.

Some browsers may require you to explicitly enable pasting into the developer Console.

Only run scripts you have reviewed and trust.

### Step 7: Wait for the export

The exporter will attempt to process each available numeric menu-group ID.

During execution, the Console will display messages similar to:

```text
Loading Concessions...
Concessions: 63 items
Loading Vending...
Vending: 4 items
Loading Barista...
Barista: 21 items
...
Total items: 535
Failed groups: []
CSV export complete.
```

*The example above is illustrative. Menu groups and item counts will vary by location.*

Once processing finishes, the browser will automatically download a CSV file.

The generated filename follows this format:

`Lavu_All_Menu_Groups_<location>.csv`

### Step 8: Open your CSV

Open the downloaded file using Microsoft Excel, Google Sheets, LibreOffice Calc, or another CSV-compatible application.

The export contains columns for:

| Column | Description |
|---|---|
| Location | Lavu's internal location/database identifier |
| Menu Group | Name of the menu group |
| Category | Item category |
| Item Name | Menu item name |
| Price | Configured item price |
| Item ID | Internal Lavu item identifier |
| Active | Whether the item is marked active |
| Description | Configured item description |

This information can be used for menu management, price comparisons, reporting, backups, and importing data into other systems.

## Exporting Multiple Locations

For businesses managing multiple Lavu POS locations:

1. Return to the main Lavu Control Panel.
2. Select a different location.
3. Navigate to **Menus → Menu Items**.
4. Open the menu editor in a separate tab.
5. Run the exporter again.

Each location generates a separate CSV file.

The resulting files can be combined into a single spreadsheet or database.

## How It Works

The exporter uses JavaScript to retrieve and parse the HTML menu editor pages made available through your authenticated Lavu session.

The process is:

1. Identify the menu-group dropdown (`menu_group_selector`).
2. Read the available numeric menu-group IDs.
3. Request each menu group's editor page using the browser's existing session.
4. Parse the returned HTML using `DOMParser`.
5. Extract item details from the editor's input fields.
6. Combine the results into a single dataset.
7. Generate and download a CSV file locally.

The exporter reads fields following conventions such as:

```text
ic_1_category
ic_1_name_1
ic_1_cost_1
ic_1_id_1
ic_1_active_1
```

These correspond to category names, item names, prices, internal IDs, and active status.

The script does not require access to Lavu's private database credentials or a separately issued API key.

## Limitations

**Menu-group behavior:** Lavu may use server-side session state to determine which group is returned. The exporter has been tested against a particular legacy Control Panel configuration, but behavior may differ between accounts or software versions.

**Empty groups:** Menu groups containing no items will be reported with an item count of zero. Verify unexpected empty groups manually.

**Multiple locations:** The script operates on the currently selected location. It does not automatically export every location in your account.

**Modifiers and advanced pricing:** Modifier choices, modifier prices, price tiers, discounts, taxes, and other advanced configuration may not be included.

**Compatibility:** The script relies on the HTML structure and field names used by the legacy Lavu menu editor. Future changes to the Control Panel could require updates.

**Verification:** Successful requests and nonzero item counts do not guarantee a complete or accurate export. Compare representative menu items, groups, and prices against the Control Panel before relying on the CSV.

## Troubleshooting

### No menu items found

Make sure you're running the script from the menu editor page rather than the parent Lavu Control Panel.

The menu editor URL will typically use `cp0.poslavu.com`, although this may vary.

### Menu group selector not found

The script requires an HTML element with the ID:

`menu_group_selector`

If the selector cannot be found, Lavu may have changed its editor interface or the script may be running in the wrong browser frame.

### A menu group returns zero items

The group may be empty, or the requested page may not have returned the expected group data.

Manually select the group in Lavu to confirm.

### Some menu groups are missing

Check the Console for failed requests.

A missing or incomplete group may be caused by authentication issues, session behavior, or changes to the Lavu editor.

### Prices or items are incorrect

Verify that each exported group contains the corresponding items shown in Lavu.

If data is repeated across multiple groups, your Lavu environment may handle menu-group selection through shared server-side session state.

## Security and Privacy

This script operates using the permissions of the currently authenticated Lavu user.

- Review the source code before execution.
- Only use it with accounts and locations you are authorized to access.
- Never share your Lavu login credentials or session cookies.
- Treat exported menus and pricing information as potentially confidential business data.
- Store generated CSV files securely.

The script makes authenticated requests to the Lavu menu editor to retrieve menu data.

It does not intentionally submit menu changes, click Save, or transmit exported CSV contents to external services.

However, requesting different menu groups may change the selected group maintained in your Lavu session.

## Disclaimer

**This project is an independent, solo-developed utility and is not affiliated with, endorsed by, sponsored by, or officially supported by Lavu, Inc.**

Lavu and related trademarks are the property of their respective owners.

This software is provided **as is**, without any warranty or guarantee of compatibility, completeness, or accuracy.

Users are responsible for ensuring that their use of this utility complies with applicable agreements, organizational policies, and laws.

## Contributing

Contributions, improvements, and bug reports are welcome.

If Lavu changes its Control Panel or menu structure, community contributions can help maintain compatibility.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Submit a pull request explaining the changes.

Please remove any private business information, credentials, and sensitive menu data from issue reports or screenshots.

**Lavu POS Menu Exporter** — A community utility for making your menu data easier to access and manage.
