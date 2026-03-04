# Atreus Design System — hibank

Design system documentation site for hibank's Atreus DS.

## Structure

```
atreus-ds/
├── index.html          ← Shell: sidebar + nav only
├── css/
│   └── styles.css      ← All styles (tokens, layout, components)
├── js/
│   └── main.js         ← Router + all page logic & data
└── pages/
    ├── colors.html     ← Colors page content
    ├── typography.html ← Typography page content
    ├── spacing.html    ← Spacing page content
    └── buttons.html    ← Buttons component page
```

## How to Run Locally

**Option 1 — VS Code (recommended)**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**
3. Browser opens at `http://localhost:5500`

**Option 2 — Terminal**
```bash
npx serve .
# opens at http://localhost:3000
```

> ⚠️ Do NOT open `index.html` directly as a file (`file://...`).
> The page router uses `fetch()` which requires a local server or GitHub Pages.

## Adding a New Component

1. Create `pages/your-component.html` with the page content
2. Add a sidebar link in `index.html`:
   ```html
   <a class="sb-item" onclick="showPage('your-component', this)">
     <span class="sb-dot" style="background:#87CCA9"></span> Your Component
   </a>
   ```
3. Add an init case in `main.js` inside `initPage()`:
   ```js
   case 'your-component':
     // any JS init needed after page loads
     break;
   ```
4. Add component-specific CSS to `css/styles.css` under a clear comment block

## Deployment (GitHub Pages)

1. Push this folder to a GitHub repository
2. Go to repo **Settings → Pages**
3. Source: **Deploy from branch** → `main` → `/ (root)`
4. Save → your site is live at `https://username.github.io/atreus-ds`

Every `git push` auto-deploys within ~1 minute.

## Design Tokens

All tokens are defined as CSS custom properties in `css/styles.css` and as data objects in `js/main.js`.

To export tokens as JSON, use the export buttons in each section of the DS.

---

**hibank Design Team** · Atreus DS v1.0
