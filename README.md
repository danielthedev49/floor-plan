# Floor Plan

A simple restaurant floor plan and waitlist tool for one host stand / one device.

**Live site:** https://danielthedev49.github.io/floor-plan/floor-plan.html

---

## What this does

- Shows the restaurant floor plan with all tables
- Tap a table to mark it seated/open
- Drag tables and walls around in edit mode to rearrange the floor
- Track a waitlist (names + party size)
- Assign waiters to sections and see a live scoreboard of who's seated what

---

## How to use it

1. Open the live site URL above on whatever device you're using for the shift (phone, tablet, laptop).
2. Bookmark it on the home screen so it's one tap away.
3. Tap tables to seat/clear them. Use the waitlist drawer for the queue.

---

## Important: how the data works

All data (table positions, who's seated, the waitlist) is saved in **the browser on the device you're using**. It does NOT sync across devices.

That means:
- ✅ If you use the same phone/tablet every shift, everything saves automatically.
- ❌ If you open the site on a different device, it'll start blank.
- ❌ If you clear your browser data, your floor plan layout resets.
- ❌ Two people on two phones won't see each other's changes.

**Pick one device and stick with it.**

---

## How to update the file

If I want to change the floor plan code:

1. Go to this repo on github.com.
2. Click `floor-plan.html`.
3. Click the pencil icon (top right of the file) to edit.
4. Make changes, scroll down, click **Commit changes**.
5. Wait ~1 minute — GitHub Pages rebuilds the live site automatically.

Or, easier: edit the file on my computer, then drag-and-drop the new version into the repo via the **Add file → Upload files** button.

---

## How this is hosted

- Hosted on **GitHub Pages** (free, owned by Microsoft).
- The repository is public, but the URL is obscure — nobody's going to find it unless I share it.
- No backend, no database, no costs. Just a single HTML file.

---

## If something breaks

- The original working file is preserved in the repo's commit history (the "History" button on the file page lets me roll back to any previous version).
- Worst case, I can re-upload a fresh copy of `floor-plan.html`.
