# Los Amigos · Seating App — v2

Now with sections, server rotation, round robin, handoffs, and walk tracking.

## Files

- **`seating-app.html`** — the app. One file.
- **`apps_script.gs`** — the backend.
- **`README.md`** — this file.

---

## If this is your first time setting up

Follow the steps in the original setup section below. Takes 5 minutes.

## If you're updating from v1

The script has new sheets to add. Just paste the new `apps_script.gs` over the old code in your existing Apps Script project, save, and **re-deploy a new version**:

1. In Apps Script editor: paste new code, save (disk icon).
2. **Deploy → Manage deployments**.
3. Pencil icon next to your existing deployment.
4. Version dropdown → **New version**.
5. Click **Deploy**.
6. Web App URL stays the same — no need to change anything in the app.

The script will auto-create the new tabs (`Layouts`, `Servers`, `Shift`, `Log`) on next sync.

---

## How the new stuff works

### Layouts (one-time setup per layout)

Go to **Layouts tab → New layout**. Name it (e.g. "Friday 4-server"), pick how many servers it's for. Then tap each table to cycle it through Section 1 → 2 → 3 → 4 → Floater → unassigned.

You probably want at least three layouts: 2-server, 3-server, 4-server. Set them up once, reuse forever.

### Starting a shift

**Shift tab** → tap a layout → fill in tonight's server names and assign them to sections → **Start shift**.

The Floor tab now shows:
- A **server bar** at the top with each person's load (tables, covers, skips).
- The server who's **NEXT UP** highlighted in red/orange.
- Anyone **SKIPPED** highlighted in dark red, jumped to the front of the line.
- Each table shows its section badge in the corner and the server's name.

### Seating someone

Tap **Seat** on a waitlist or reservation entry. The picker highlights the **recommended table** (green border, "Up" tag) — that's whoever's next in rotation. You can pick any table though.

The app auto-detects skips: if you seat someone in section 3 when section 1 was up, section 1 gets marked skipped. They jump to the front of the line and stay there until they get seated.

### When a guest moves

Tap the seated table → **Move party** → tap the new (open) table.

- Original server's rotation position is restored (they're put at the front of the line).
- New section's server gets the cover.

### When a server gives away their table

Tap the seated table → **Hand off to another server** → pick the receiving server.

- Receiving server takes the table on their floor (shown as "h" for handoff).
- Receiving server is **not** penalized in rotation — their last-seated time doesn't move.
- Their dashboard shows "tables: 4 (2 own + 2 h)" so you can see at a glance who has what.

### When a guest walks

Tap **Walked** on a waitlist entry → pick a reason (wait too long, changed mind, etc).

The server who was up gets credited as skipped (not their fault the guest left). Walks count is shown on the dashboard.

### Floater tables

Tables marked floater (★) belong to no section. When you seat at a floater table, the rotation server who was up gets skipped (since they didn't get a seat). Use floaters for tables that don't belong to anyone — bar seating, host's discretion, overflow.

### Ending the shift

**Shift tab → End shift**. Stats stay in your Sheet for the night. Starting a new shift zeros out all the counters.

---

## What's in the Sheet

Seven tabs, all human-readable:

| Tab | Purpose |
|---|---|
| Tables | Your floor plan |
| Waitlist | Walk-ins, current and recent |
| Reservations | Bookings |
| Layouts | Section presets per staffing level |
| Servers | Tonight's roster + live stats |
| Shift | Current shift state (active layout, started time) |
| Log | Skip events, walks, handoffs (for end-of-shift review) |

You can open the Sheet anytime to see what's happening, export to CSV, or fix something by hand.

---

## Original setup (first time only)

### 1. Create the Sheet
[sheets.google.com](https://sheets.google.com) → blank spreadsheet. Name it "Los Amigos Seating".

### 2. Open script editor
**Extensions → Apps Script**.

### 3. Paste the script
Delete existing code. Paste the entire contents of `apps_script.gs`. Save (disk icon).

### 4. Deploy as Web App
**Deploy → New deployment** → gear icon → **Web app**:
- Description: Seating app
- Execute as: **Me**
- Who has access: **Anyone**

Click **Deploy**.

### 5. Authorize
Click through the warnings:
- Authorize access → pick your Google account
- "Hasn't verified this app" → **Advanced → Go to (project name) (unsafe)**
- **Allow**

Copy the **Web app URL** ending in `/exec`.

### 6. Open the app
Open `seating-app.html` in a browser. Settings will pop up. Paste the URL. Save.

Done.

---

## Hosting the HTML

To use it on phones, the HTML needs to be on the web. Easiest:

**Netlify Drop** (free, 30 seconds):
1. [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag `seating-app.html` onto the page
3. Bookmark the URL on every device

Each device you bookmark on needs the Web App URL pasted into Settings (one-time).

---

## FAQ

**My old data is gone after updating!** It's not — your Tables, Waitlist, and Reservations sheets are untouched. The new Layouts/Servers/Shift sheets are added alongside.

**Sections aren't showing on the floor.** Either you haven't started a shift, or the layout you picked doesn't have section assignments yet. Go to Layouts tab and tap tables to assign them.

**A server got marked skipped but shouldn't have.** Just seat someone in their section and the skip clears. There's no manual override — by design, the principle is "actions speak louder than buttons."

**I want to see who got skipped tonight.** Open the Sheet → Log tab. Every skip, walk, and handoff is timestamped.

**Can two devices be doing different things?** Yes — within ~5 seconds the sync catches up. Just don't both edit the layout in Edit Mode at the same time, since drag-and-drop changes can race.

**Can I change a server's section mid-shift?** Yes, on the Shift tab. Tables they had won't reassign automatically — they keep their existing tables until those are marked open and re-seated.
