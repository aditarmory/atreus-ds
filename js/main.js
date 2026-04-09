// ─────────────────────────────────────────────
// ROUTER — Page loader
// ─────────────────────────────────────────────
const pageCache = {};
let currentPage = null;

async function showPage(id, el) {
  if (currentPage === id) return;
  currentPage = id;

  // Update sidebar active state
  document.querySelectorAll('.sb-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');

  const container = document.getElementById('page-container');

  // Show loading state
  container.innerHTML = '<div class="page-loading"><div class="loading-spinner"></div></div>';

  // Check cache first
  if (pageCache[id]) {
    container.innerHTML = pageCache[id];
    initPage(id);
    return;
  }

  // Fetch the page
  try {
    const res = await fetch(`pages/${id}.html`);
    if (!res.ok) throw new Error(`Page not found: ${id}`);
    const html = await res.text();
    pageCache[id] = html;
    container.innerHTML = html;
    initPage(id);
  } catch (err) {
    container.innerHTML = `<div class="content" style="padding-top:80px">
      <div class="page-label">Error</div>
      <h1 class="page-title">Page not found</h1>
      <p class="page-desc">Could not load <code>${id}</code>. Make sure you're running this from a local server or GitHub Pages — not by opening the HTML file directly.</p>
      <div style="margin-top:24px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:20px;font-family:'DM Mono',monospace;font-size:12px;color:var(--text-muted)">
        <strong style="color:var(--text-primary)">How to run locally:</strong><br><br>
        Option 1 — VS Code: Install "Live Server" extension, right-click index.html → Open with Live Server<br><br>
        Option 2 — Terminal: <code style="background:#1a1a1a;color:#87CCA9;padding:2px 6px;border-radius:4px">npx serve .</code>
      </div>
    </div>`;
  }
}

// Called after each page loads — runs page-specific init
function initPage(id) {
  window.scrollTo(0, 0);
  switch(id) {
    case 'colors':
      ['gray','orange','teal','red','green'].forEach(buildSwatches);
      renderAdaptive();
      break;
    case 'typography':
      renderAllTypeGroups();
      buildCSSPreview();
      break;
    case 'spacing':
      buildSpacing();
      break;
    case 'icons':
      buildIconography();
      break;
    case 'buttons':
      updateBtnPreview();
      break;
      case 'chips':
  // JS sudah embedded di chips.html, tidak perlu inisialisasi tambahan
  break;
    case 'controls':
  updateCtrlPreview();
  break;
    case 'bottomsheets':
      if (typeof renderBlocker === 'function') renderBlocker('rekening');
      break;
    case 'list-item':
  // JS already embedded in list-item.html
  break;
  }
}

// Load default page on startup
document.addEventListener('DOMContentLoaded', () => {
  showPage('colors', document.querySelector('.sb-item.active'));
});

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const COLORS = {
  gray:   [{step:0,hex:'#FFFFFF'},{step:5,hex:'#F6F6F6'},{step:10,hex:'#F3F3F3'},{step:20,hex:'#DADADA'},{step:30,hex:'#CDCDCD'},{step:40,hex:'#B4B4B4'},{step:50,hex:'#9B9B9B'},{step:60,hex:'#828282'},{step:70,hex:'#686868'},{step:80,hex:'#333333'},{step:90,hex:'#1A1A1A'}],
  orange: [{step:0,hex:'#FEF6F1'},{step:10,hex:'#FEEDDF'},{step:20,hex:'#FEEDDF'},{step:30,hex:'#FEC7A5'},{step:40,hex:'#FEB07F'},{step:50,hex:'#FF9B00'},{step:60,hex:'#FE8133'},{step:70,hex:'#FE6201'},{step:80,hex:'#CC4F01'},{step:90,hex:'#993B01'}],
  teal:   [{step:0,hex:'#E9F7FA'},{step:10,hex:'#D8ECED'},{step:20,hex:'#77C8D9'},{step:30,hex:'#30AEC7'},{step:40,hex:'#269DB5'},{step:50,hex:'#1C95AD'},{step:60,hex:'#138CA6'},{step:70,hex:'#007E99'},{step:80,hex:'#006980'},{step:90,hex:'#005566'}],
  red:    [{step:0,hex:'#FFF2F2'},{step:10,hex:'#FFE5E5'},{step:20,hex:'#FDCACA'},{step:30,hex:'#FCA4A4'},{step:40,hex:'#FB7E7E'},{step:50,hex:'#FC5858'},{step:60,hex:'#FC3232'},{step:70,hex:'#CE0101'},{step:80,hex:'#CE0101'},{step:90,hex:'#A10101'}],
  green:  [{step:0,hex:'#E9F7F3'},{step:10,hex:'#CCE9DF'},{step:20,hex:'#CBFEEC'},{step:30,hex:'#85CCB3'},{step:40,hex:'#87CCA9'},{step:50,hex:'#5DBF96'},{step:60,hex:'#3BAF78'},{step:70,hex:'#2C9A65'},{step:80,hex:'#1E8550'},{step:90,hex:'#238453'}]
};

// ─────────────────────────────────────────────
// ADAPTIVE — synced to Figma (node 111-7571)
// ─────────────────────────────────────────────
const ADAPTIVE = {
  background:{label:'Background',sub:'UI-1, UI-2, UI-3 — Base surface and container layers',tokens:[
    {token:'$background-ui-1',usage:'Default application surface',hex:'#FFFFFF',ref:'Gray 0'},
    {token:'$background-ui-2',usage:'Components surface above background 1',hex:'#F3F3F3',ref:'Gray 10'},
    {token:'$background-ui-3',usage:'Components surface above background 2',hex:'#DADADA',ref:'Gray 20'},
  ]},
  button_primary:{label:'Button / Primary',sub:'Background tokens for primary CTA button states',tokens:[
    {token:'$button-primary-default',usage:'Default background color of Primary Button',hex:'#87CCA9',ref:'Green 40'},
    {token:'$button-primary-disabled',usage:'Default background color of Disabled Button',hex:'#F3F3F3',ref:'Gray 10'},
  ]},
  border:{label:'Border',sub:'Dividers, outlines, focus rings, separators',tokens:[
    {token:'$border-vibrant',usage:'Default primary color of Outlined Component',hex:'#FE6201',ref:'Orange 70'},
    {token:'$border-soft',usage:'Default primary color of Outlined Component',hex:'#007E99',ref:'Teal 70'},
    {token:'$border-harmony',usage:'Default primary color of Outlined Component',hex:'#238453',ref:'Green 90'},
    {token:'#border-primary',usage:'Decorative color of Outlined Component',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'#border-decorative-1',usage:'Decorative color of Outlined Component',hex:'#CDCDCD',ref:'Gray 30'},
    {token:'#border-decorative-2',usage:'Decorative color of Outlined Component',hex:'#DADADA',ref:'Gray 20'},
    {token:'#border-decorative 3',usage:'Decorative color of Outlined Component',hex:'#F3F3F3',ref:'Gray 10'},
    {token:'#border-decorative 4',usage:'Decorative color of Outlined Component',hex:'#F6F6F6',ref:'Gray 5'},
    {token:'#border-decorative-adaptive',usage:'Decorative adaptive neutral color of Outlined/Border Component',hex:'rgba(26,26,26,0.08)',ref:'Gray 90 · 8%'},
  ]},
  border_button_outlined:{label:'Border / Button / Outlined',sub:'Border tokens for outlined button variant',tokens:[
    {token:'$border-button-outlined-primary',usage:'Default button border color of Outlined Button',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'$border-button-outlined-disabled',usage:'Default disabled button border color of Outlined Button',hex:'#DADADA',ref:'Gray 20'},
  ]},
  border_button_primary:{label:'Border / Button / Primary',sub:'Border tokens for primary button variant',tokens:[
    {token:'$border-button-primary',usage:'Default button border color of Outlined Button',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'$border-button-primary-disabled',usage:'Default disabled button border color of Outlined Button',hex:'#DADADA',ref:'Gray 20'},
  ]},
  foreground:{label:'Foreground',sub:'Vibrant (Orange), Soft (Teal), and Harmony (Green) surface colors',tokens:[
    {token:'$foreground-vibrant-1',usage:'Default orange surface',hex:'#FE6201',ref:'Orange 70'},
    {token:'$foreground-vibrant-2',usage:'Default soft orange surface',hex:'#FF9B00',ref:'Orange 50'},
    {token:'$foreground-vibrant-3',usage:'Default soft orange surface',hex:'#FEDFCB',ref:'Orange 20'},
    {token:'$foreground-vibrant-4',usage:'Default soft orange surface',hex:'#FEEDDF',ref:'Orange 10'},
    {token:'$foreground-soft-1',usage:'Default teal surface',hex:'#007E99',ref:'Teal 70'},
    {token:'$foreground-soft-2',usage:'Default soft teal surface',hex:'#77CBD9',ref:'Teal 20'},
    {token:'$foreground-soft-3',usage:'Default soft teal surface',hex:'#D8ECED',ref:'Teal 10'},
    {token:'$foreground-harmony-1',usage:'Default teal surface',hex:'#85CCB3',ref:'Green 30'},
    {token:'$foreground-harmony-2',usage:'Default soft teal surface',hex:'#C8FEEC',ref:'Green 20'},
    {token:'$foreground-harmony-3',usage:'Default soft teal surface',hex:'#CCE9DF',ref:'Green 10'},
  ]},
  foreground_icon:{label:'Foreground / Icon',sub:'Clickable and decorative icon colors',tokens:[
    {token:'$foreground-icon-primary',usage:'Default clickable icon',hex:'#238453',ref:'Green 90'},
    {token:'$foreground-icon-secondary',usage:'Default orange icon',hex:'#FE6201',ref:'Orange 70'},
  ]},
  foreground_icon_neutral:{label:'Foreground / Icon / Neutral',sub:'Neutral icon colors across all states',tokens:[
    {token:'$foreground-icon-neutral-primary',usage:'Default primary icon color',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'$foreground-icon-neutral-secondary',usage:'Default secondary icon color',hex:'#828282',ref:'Gray 60'},
    {token:'$foreground-icon-neutral-disabled',usage:'Disabled icon',hex:'#CDCDCD',ref:'gray 30'},
    {token:'$foreground-icon-neutral-inverse',usage:'Default primary icon color in dark background',hex:'#FFFFFF',ref:'Gray 0'},
  ]},
  text_primary:{label:'Text / Primary',sub:'Primary text color tokens',tokens:[
    {token:'$text-primary',usage:'Default primary text on white/bright background',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'$text-primary-inverse',usage:'Default primary text on black/dark background',hex:'#FFFFFF',ref:'Gray 0'},
  ]},
  text:{label:'Text',sub:'Full branded and neutral text token set',tokens:[
    {token:'$text-secondary',usage:'Default secondary text',hex:'#828282',ref:'Gray 60'},
    {token:'$text-placeholder',usage:'placeholder text',hex:'#B4B4B4',ref:'Green 40'},
    {token:'$text-link',usage:'Default hyperlink text',hex:'#238453',ref:'Green 90'},
    {token:'$ttext-title',usage:'Default Title text for better highlight',hex:'#FE6201',ref:'Orange 70'},
    {token:'$text-helper',usage:'Helper text on function as a caption or help text',hex:'#B4B4B4',ref:'Gray 40'},
    {token:'$text-disabled',usage:'Disabled text',hex:'#CDCDCD',ref:'Gray 30'},
    {token:'$text-success',usage:'Success message text',hex:'#01B274',ref:'Green 80'},
    {token:'$text-error',usage:'Error message text',hex:'#CE0101',ref:'Red 70'},
  ]},
  overlay:{label:'Overlay',sub:'Scrim and overlay surface tokens',tokens:[
    {token:'$overlay-primary',usage:'for overlay content need to focus example; bottom sheets',hex:'rgba(51,51,51,0.7)',ref:'Gray 80 · 70%'},
    {token:'$overlay-decorative',usage:'for overlay content need to focus example; bottom sheets',hex:'rgba(133,204,179,0.5)',ref:'Green 30 · 50%'},
  ]},
  semantic:{label:'Semantic',sub:'Feedback and status state colors',tokens:[
    {token:'$semantic-warning',usage:'Semantic color for warning indicator include background, text, etc',hex:'#FBD330',ref:'Warning'},
    {token:'$semantic-informative',usage:'Semantic color for informative indicator include background, text, etc',hex:'#FBD330',ref:'Informative'},
    {token:'$semantic-success',usage:'Semantic color for success indicator include background, text, etc',hex:'#01B274',ref:'Green 80'},
    {token:'$semantic-error',usage:'Semantic color for negative indicator include background, text, etc',hex:'#CE0101',ref:'Red 70'},
  ]},
};



const TYPO = {
  title:[
    {name:'Title 1',usage:'Screen title / primary heading',weight:'Bold',weightNum:700,size:24,lineHeight:36,font:'Sora'},
    {name:'Title 2',usage:'Section heading',weight:'Bold',weightNum:700,size:21,lineHeight:32,font:'Sora'},
    {name:'Title 3',usage:'Sub-section heading',weight:'Bold',weightNum:700,size:18,lineHeight:28,font:'Sora'},
    {name:'Title 4',usage:'Card title',weight:'Bold',weightNum:700,size:16,lineHeight:24,font:'Sora'},
  ],
  body:[
    {name:'Body 1',usage:'Primary body copy',weight:'Regular',weightNum:400,size:16,lineHeight:24,font:'Sora'},
    {name:'Body 2',usage:'Secondary body text',weight:'Regular',weightNum:400,size:14,lineHeight:20,font:'Sora'},
  ],
  smallTitle:[
    {name:'Small Title 1',usage:'Labels, button text, tabs',weight:'Bold',weightNum:700,size:14,lineHeight:20,font:'Sora'},
    {name:'Small Title 2',usage:'Smaller labels, chips',weight:'Bold',weightNum:700,size:12,lineHeight:18,font:'Sora'},
    {name:'Small Title 3',usage:'Micro labels, badge text',weight:'Bold',weightNum:700,size:10,lineHeight:15,font:'Sora'},
  ],
  caption:[
    {name:'Caption 1',usage:'Helper text, field description',weight:'Regular',weightNum:400,size:12,lineHeight:18,font:'Sora'},
    {name:'Caption 2',usage:'Metadata, timestamps',weight:'Regular',weightNum:400,size:10,lineHeight:15,font:'Sora'},
  ]
};

const SPACING = [
  {token:'$spacing-01',px:2,  rem:0.125,usage:'Micro gap — icon inner padding'},
  {token:'$spacing-02',px:4,  rem:0.25, usage:'Tight spacing — badge padding'},
  {token:'$spacing-03',px:8,  rem:0.5,  usage:'Small gap — between icon and label'},
  {token:'$spacing-04',px:12, rem:0.75, usage:'Compact padding — chips, tags'},
  {token:'$spacing-05',px:16, rem:1,    usage:'Base unit — default padding'},
  {token:'$spacing-06',px:20, rem:1.25, usage:'Comfortable gap — list items'},
  {token:'$spacing-07',px:24, rem:1.5,  usage:'Section gap — form fields'},
  {token:'$spacing-08',px:32, rem:2,    usage:'Medium section — card padding'},
  {token:'$spacing-09',px:40, rem:2.5,  usage:'Large gap — between sections'},
  {token:'$spacing-10',px:48, rem:3,    usage:'Page padding — screen edges'},
  {token:'$spacing-11',px:64, rem:4,    usage:'Layout spacing — major sections'},
  {token:'$spacing-12',px:80, rem:5,    usage:'Max gap — hero and banner areas'},
];

const ICONOGRAPHY_STYLE_COUNTS = [
  ['Outlined', 56],
  ['Filled', 53],
  ['Outline', 45],
  ['Default', 29],
  ['Round-Filled', 11],
  ['Round-Outlined', 8],
  ['Square-Filled', 1],
  ['Square-Outlined', 1],
  ['Outlined thin', 1],
  ['Filled thin', 1],
  ['Outline2', 1],
  ['Style3', 1],
  ['Pulsa', 1],
  ['Prepaid', 1],
  ['Internet', 1]
];

const ICONOGRAPHY_GROUP_LINES = [
  'C: Calculator (2), Card (6), Calendar (2), Camera (2), Cancel (1), Check (1), Contact (2), Contact photo (1), Copy (2), Chevron (12), Customer service (2), Cart (2), Coins (2), Currency (1), Celengan (1), Chart (1)',
  'S: Search (1), Sender (1), Scan (1), School (1), Setting (2), Sell (1), Share (2), Shop (2), Star (3), Success (2), Speaker (2), Sound (1), Storefront (1), Shield (1)',
  'A: Arrow (1), Add (5), Account (4), Account Virtual (2)',
  'F: Favorite (2), Failed (1), Fingerprint (2), Flag (9), Flash (4), Flip Camera (3), Filter (1)',
  'H: Help (3), Hibank (2), History (1), Headset (1), Home (2)',
  'I: Information (3), Invoice (1), Internet (1)',
  'N: Notification (4)',
  'V: Visibility (4), Video (8)',
  'W: Warning (2), Water (2), Wallet (1)',
  'Z: Zoom (2)',
  'D: Delete (2), Docs (1), Download (3), Deposito (1)',
  'L: Language (1), Link (1), Lock (4), Location (2), Log (2), page navigation (2)',
  'U: Upload (1)',
  'P: Payment (2), Password (2), Phonebook (1), Phone (3), PIN (2), Proxy (2)',
  'B: Bank (2), Bookmark (2), BI Fast (1), Biometric (3), Business (2), Beranda (2), Bluetooth (1)',
  'E: Edit (4), E-Wallet (2), Email (2), Electronic (2)',
  'M: Money (2), Menu (1), Mute (2), More (2), Minimize (2), Minus (1), Mobile (3), Mobile-Pembelian (3), Medical (2)',
  'T: Transfer (6), Top up (1), Trash (2), Thumb (4), Theme (1)',
  'R: Recipient (1), Reload (1)',
  'G: Gallery (2), Gas (2), Gift (1)'
];

const ICONOGRAPHY_HERO_ICONS = [
  {
    label: 'Calculator / Outline',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-calculator-outline" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-calculator-outline)"><path d="M7 9.2H10.5C10.7167 9.2 10.8958 9.12917 11.0375 8.9875C11.1792 8.84583 11.25 8.66667 11.25 8.45C11.25 8.23333 11.1792 8.05417 11.0375 7.9125C10.8958 7.77083 10.7167 7.7 10.5 7.7H7C6.78333 7.7 6.60417 7.77083 6.4625 7.9125C6.32083 8.05417 6.25 8.23333 6.25 8.45C6.25 8.66667 6.32083 8.84583 6.4625 8.9875C6.60417 9.12917 6.78333 9.2 7 9.2ZM13.75 17.25H17.25C17.4667 17.25 17.6458 17.1792 17.7875 17.0375C17.9292 16.8958 18 16.7167 18 16.5C18 16.2833 17.9292 16.1042 17.7875 15.9625C17.6458 15.8208 17.4667 15.75 17.25 15.75H13.75C13.5333 15.75 13.3542 15.8208 13.2125 15.9625C13.0708 16.1042 13 16.2833 13 16.5C13 16.7167 13.0708 16.8958 13.2125 17.0375C13.3542 17.1792 13.5333 17.25 13.75 17.25ZM13.75 14.75H17.25C17.4667 14.75 17.6458 14.6792 17.7875 14.5375C17.9292 14.3958 18 14.2167 18 14C18 13.7833 17.9292 13.6042 17.7875 13.4625C17.6458 13.3208 17.4667 13.25 17.25 13.25H13.75C13.5333 13.25 13.3542 13.3208 13.2125 13.4625C13.0708 13.6042 13 13.7833 13 14C13 14.2167 13.0708 14.3958 13.2125 14.5375C13.3542 14.6792 13.5333 14.75 13.75 14.75ZM8.75 18C8.96667 18 9.14583 17.9292 9.2875 17.7875C9.42917 17.6458 9.5 17.4667 9.5 17.25V16H10.75C10.9667 16 11.1458 15.9292 11.2875 15.7875C11.4292 15.6458 11.5 15.4667 11.5 15.25C11.5 15.0333 11.4292 14.8542 11.2875 14.7125C11.1458 14.5708 10.9667 14.5 10.75 14.5H9.5V13.25C9.5 13.0333 9.42917 12.8542 9.2875 12.7125C9.14583 12.5708 8.96667 12.5 8.75 12.5C8.53333 12.5 8.35417 12.5708 8.2125 12.7125C8.07083 12.8542 8 13.0333 8 13.25V14.5H6.75C6.53333 14.5 6.35417 14.5708 6.2125 14.7125C6.07083 14.8542 6 15.0333 6 15.25C6 15.4667 6.07083 15.6458 6.2125 15.7875C6.35417 15.9292 6.53333 16 6.75 16H8V17.25C8 17.4667 8.07083 17.6458 8.2125 17.7875C8.35417 17.9292 8.53333 18 8.75 18ZM13.575 10.425C13.725 10.575 13.9 10.65 14.1 10.65C14.3 10.65 14.475 10.575 14.625 10.425L15.5 9.55L16.4 10.45C16.5333 10.5833 16.7 10.65 16.9 10.65C17.1 10.65 17.275 10.575 17.425 10.425C17.5583 10.2917 17.625 10.1208 17.625 9.9125C17.625 9.70417 17.5583 9.525 17.425 9.375L16.55 8.45L17.45 7.55C17.5833 7.41667 17.65 7.25 17.65 7.05C17.65 6.85 17.575 6.675 17.425 6.525C17.275 6.375 17.1 6.3 16.9 6.3C16.7 6.3 16.525 6.375 16.375 6.525L15.5 7.4L14.6 6.5C14.4667 6.36667 14.3 6.3 14.1 6.3C13.9 6.3 13.725 6.375 13.575 6.525C13.425 6.675 13.35 6.85 13.35 7.05C13.35 7.25 13.425 7.425 13.575 7.575L14.45 8.45L13.55 9.375C13.4167 9.525 13.35 9.7 13.35 9.9C13.35 10.1 13.425 10.275 13.575 10.425ZM5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5ZM5 19H19V5H5V19Z" fill="#1A1A1A"/></g></svg>`
  },
  {
    label: 'Calculator / Filled',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-calculator-filled" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-calculator-filled)"><path d="M7 9.2H10.5C10.7167 9.2 10.8958 9.12917 11.0375 8.9875C11.1792 8.84583 11.25 8.66667 11.25 8.45C11.25 8.23333 11.1792 8.05417 11.0375 7.9125C10.8958 7.77083 10.7167 7.7 10.5 7.7H7C6.78333 7.7 6.60417 7.77083 6.4625 7.9125C6.32083 8.05417 6.25 8.23333 6.25 8.45C6.25 8.66667 6.32083 8.84583 6.4625 8.9875C6.60417 9.12917 6.78333 9.2 7 9.2ZM13.75 17.25H17.25C17.4667 17.25 17.6458 17.1792 17.7875 17.0375C17.9292 16.8958 18 16.7167 18 16.5C18 16.2833 17.9292 16.1042 17.7875 15.9625C17.6458 15.8208 17.4667 15.75 17.25 15.75H13.75C13.5333 15.75 13.3542 15.8208 13.2125 15.9625C13.0708 16.1042 13 16.2833 13 16.5C13 16.7167 13.0708 16.8958 13.2125 17.0375C13.3542 17.1792 13.5333 17.25 13.75 17.25ZM13.75 14.75H17.25C17.4667 14.75 17.6458 14.6792 17.7875 14.5375C17.9292 14.3958 18 14.2167 18 14C18 13.7833 17.9292 13.6042 17.7875 13.4625C17.6458 13.3208 17.4667 13.25 17.25 13.25H13.75C13.5333 13.25 13.3542 13.3208 13.2125 13.4625C13.0708 13.6042 13 13.7833 13 14C13 14.2167 13.0708 14.3958 13.2125 14.5375C13.3542 14.6792 13.5333 14.75 13.75 14.75ZM8.75 18C8.96667 18 9.14583 17.9292 9.2875 17.7875C9.42917 17.6458 9.5 17.4667 9.5 17.25V16H10.75C10.9667 16 11.1458 15.9292 11.2875 15.7875C11.4292 15.6458 11.5 15.4667 11.5 15.25C11.5 15.0333 11.4292 14.8542 11.2875 14.7125C11.1458 14.5708 10.9667 14.5 10.75 14.5H9.5V13.25C9.5 13.0333 9.42917 12.8542 9.2875 12.7125C9.14583 12.5708 8.96667 12.5 8.75 12.5C8.53333 12.5 8.35417 12.5708 8.2125 12.7125C8.07083 12.8542 8 13.0333 8 13.25V14.5H6.75C6.53333 14.5 6.35417 14.5708 6.2125 14.7125C6.07083 14.8542 6 15.0333 6 15.25C6 15.4667 6.07083 15.6458 6.2125 15.7875C6.35417 15.9292 6.53333 16 6.75 16H8V17.25C8 17.4667 8.07083 17.6458 8.2125 17.7875C8.35417 17.9292 8.53333 18 8.75 18ZM13.575 10.425C13.725 10.575 13.9 10.65 14.1 10.65C14.3 10.65 14.475 10.575 14.625 10.425L15.5 9.55L16.4 10.45C16.5333 10.5833 16.7 10.65 16.9 10.65C17.1 10.65 17.275 10.575 17.425 10.425C17.5583 10.2917 17.625 10.1208 17.625 9.9125C17.625 9.70417 17.5583 9.525 17.425 9.375L16.55 8.45L17.45 7.55C17.5833 7.41667 17.65 7.25 17.65 7.05C17.65 6.85 17.575 6.675 17.425 6.525C17.275 6.375 17.1 6.3 16.9 6.3C16.7 6.3 16.525 6.375 16.375 6.525L15.5 7.4L14.6 6.5C14.4667 6.36667 14.3 6.3 14.1 6.3C13.9 6.3 13.725 6.375 13.575 6.525C13.425 6.675 13.35 6.85 13.35 7.05C13.35 7.25 13.425 7.425 13.575 7.575L14.45 8.45L13.55 9.375C13.4167 9.525 13.35 9.7 13.35 9.9C13.35 10.1 13.425 10.275 13.575 10.425ZM5 21C4.45 21 3.97917 20.8042 3.5875 20.4125C3.19583 20.0208 3 19.55 3 19V5C3 4.45 3.19583 3.97917 3.5875 3.5875C3.97917 3.19583 4.45 3 5 3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H5Z" fill="#1A1A1A"/></g></svg>`
  },
  {
    label: 'Chevron / Outlined',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-chevron-outlined" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path d="M0 0H24V24H0V0Z" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-chevron-outlined)"><path d="M9.39966 6.43768C9.68001 6.43768 9.9103 6.52841 10.0911 6.70917L14.6917 11.3088C14.7904 11.4076 14.8597 11.5145 14.9006 11.6291C14.9418 11.7443 14.9622 11.8682 14.9622 12.0002C14.9621 12.132 14.9417 12.2552 14.9006 12.3703C14.8597 12.485 14.7905 12.5927 14.6917 12.6916L10.0911 17.2912C9.91032 17.4719 9.67996 17.5627 9.39966 17.5627C9.11958 17.5626 8.88988 17.4717 8.70923 17.2912C8.52847 17.1104 8.43774 16.8801 8.43774 16.5998C8.43779 16.3195 8.52851 16.0891 8.70923 15.9084L12.6174 12.0002L12.6086 11.9914L8.70923 8.091C8.52847 7.91024 8.43774 7.67995 8.43774 7.3996C8.43783 7.11942 8.52855 6.88984 8.70923 6.70917C8.8899 6.52849 9.11948 6.43777 9.39966 6.43768Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`
  },
  {
    label: 'Chevron / Round Filled',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-chevron-filled" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path d="M24 0L24 24L2.86197e-07 24L0 2.86197e-07L24 0Z" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-chevron-filled)"><path d="M12 2.0127C13.3817 2.0127 14.6805 2.27453 15.8955 2.79883C17.1106 3.32321 18.1677 4.03484 19.0664 4.93359C19.9652 5.83235 20.6768 6.88936 21.2012 8.10449C21.7255 9.31953 21.9873 10.6183 21.9873 12C21.9873 13.3817 21.7255 14.6805 21.2012 15.8955C20.6768 17.1106 19.9652 18.1677 19.0664 19.0664C18.1677 19.9652 17.1106 20.6768 15.8955 21.2012C14.6805 21.7255 13.3817 21.9873 12 21.9873C10.6183 21.9873 9.31953 21.7255 8.10449 21.2012C6.88936 20.6768 5.83235 19.9652 4.93359 19.0664C4.03484 18.1677 3.32321 17.1106 2.79883 15.8955C2.27453 14.6805 2.0127 13.3817 2.0127 12C2.0127 10.6183 2.27453 9.31953 2.79883 8.10449C3.32321 6.88936 4.03484 5.83235 4.93359 4.93359C5.83235 4.03484 6.88936 3.32321 8.10449 2.79883C9.31953 2.27453 10.6183 2.0127 12 2.0127ZM11 7.90039C10.73 7.90883 10.4931 8.01378 10.291 8.21582V8.2168C10.1057 8.41896 10.0084 8.6551 10 8.9248C9.99161 9.19502 10.0889 9.43158 10.291 9.63379L12.6572 12L10.291 14.3662C10.1052 14.552 10.0127 14.7845 10.0127 15.0625C10.0127 15.3406 10.1055 15.5809 10.291 15.7832V15.7842C10.4933 15.9864 10.7343 16.0879 11.0127 16.0879C11.2909 16.0878 11.5313 15.9861 11.7334 15.7842L14.8086 12.709C15.0108 12.5068 15.1123 12.2702 15.1123 12C15.1123 11.7298 15.0108 11.4932 14.8086 11.291L11.709 8.19141C11.5068 7.98923 11.2702 7.89205 11 7.90039Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`
  },
  {
    label: 'Setting / Outlined',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-setting-outline" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path d="M0 0H24V24H0V0Z" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-setting-outline)"><path d="M9.25001 22L8.85001 18.8C8.63335 18.7167 8.42918 18.6167 8.23751 18.5C8.04585 18.3833 7.85835 18.2583 7.67501 18.125L4.70001 19.375L1.95001 14.625L4.52501 12.675C4.50835 12.5583 4.50001 12.4458 4.50001 12.3375V11.6625C4.50001 11.5542 4.50835 11.4417 4.52501 11.325L1.95001 9.375L4.70001 4.625L7.67501 5.875C7.85835 5.74167 8.05001 5.61667 8.25001 5.5C8.45001 5.38333 8.65001 5.28333 8.85001 5.2L9.25001 2H14.75L15.15 5.2C15.3667 5.28333 15.5708 5.38333 15.7625 5.5C15.9542 5.61667 16.1417 5.74167 16.325 5.875L19.3 4.625L22.05 9.375L19.475 11.325C19.4917 11.4417 19.5 11.5542 19.5 11.6625V12.3375C19.5 12.4458 19.4833 12.5583 19.45 12.675L22.025 14.625L19.275 19.375L16.325 18.125C16.1417 18.2583 15.95 18.3833 15.75 18.5C15.55 18.6167 15.35 18.7167 15.15 18.8L14.75 22H9.25001ZM12.05 15.5C13.0167 15.5 13.8417 15.1583 14.525 14.475C15.2083 13.7917 15.55 12.9667 15.55 12C15.55 11.0333 15.2083 10.2083 14.525 9.525C13.8417 8.84167 13.0167 8.5 12.05 8.5C11.0667 8.5 10.2375 8.84167 9.56251 9.525C8.88751 10.2083 8.55001 11.0333 8.55001 12C8.55001 12.9667 8.88751 13.7917 9.56251 14.475C10.2375 15.1583 11.0667 15.5 12.05 15.5ZM12.05 13.5C11.6333 13.5 11.2792 13.3542 10.9875 13.0625C10.6958 12.7708 10.55 12.4167 10.55 12C10.55 11.5833 10.6958 11.2292 10.9875 10.9375C11.2792 10.6458 11.6333 10.5 12.05 10.5C12.4667 10.5 12.8208 10.6458 13.1125 10.9375C13.4042 11.2292 13.55 11.5833 13.55 12C13.55 12.4167 13.4042 12.7708 13.1125 13.0625C12.8208 13.3542 12.4667 13.5 12.05 13.5ZM11 20H12.975L13.325 17.35C13.8417 17.2167 14.3208 17.0208 14.7625 16.7625C15.2042 16.5042 15.6083 16.1917 15.975 15.825L18.45 16.85L19.425 15.15L17.275 13.525C17.3583 13.2917 17.4167 13.0458 17.45 12.7875C17.4833 12.5292 17.5 12.2667 17.5 12C17.5 11.7333 17.4833 11.4708 17.45 11.2125C17.4167 10.9542 17.3583 10.7083 17.275 10.475L19.425 8.85L18.45 7.15L15.975 8.2C15.6083 7.81667 15.2042 7.49583 14.7625 7.2375C14.3208 6.97917 13.8417 6.78333 13.325 6.65L13 4H11.025L10.675 6.65C10.1583 6.78333 9.67918 6.97917 9.23751 7.2375C8.79585 7.49583 8.39168 7.80833 8.02501 8.175L5.55001 7.15L4.57501 8.85L6.72501 10.45C6.64168 10.7 6.58335 10.95 6.55001 11.2C6.51668 11.45 6.50001 11.7167 6.50001 12C6.50001 12.2667 6.51668 12.525 6.55001 12.775C6.58335 13.025 6.64168 13.275 6.72501 13.525L4.57501 15.15L5.55001 16.85L8.02501 15.8C8.39168 16.1833 8.79585 16.5042 9.23751 16.7625C9.67918 17.0208 10.1583 17.2167 10.675 17.35L11 20Z" fill="#1A1A1A"/></g></svg>`
  },
  {
    label: 'Setting / Filled',
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-setting-filled" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path d="M0 0H24V24H0V0Z" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-setting-filled)"><path d="M9.25001 22L8.85001 18.8C8.63335 18.7167 8.42918 18.6167 8.23751 18.5C8.04585 18.3833 7.85835 18.2583 7.67501 18.125L4.70001 19.375L1.95001 14.625L4.52501 12.675C4.50835 12.5583 4.50001 12.4458 4.50001 12.3375V11.6625C4.50001 11.5542 4.50835 11.4417 4.52501 11.325L1.95001 9.375L4.70001 4.625L7.67501 5.875C7.85835 5.74167 8.05001 5.61667 8.25001 5.5C8.45001 5.38333 8.65001 5.28333 8.85001 5.2L9.25001 2H14.75L15.15 5.2C15.3667 5.28333 15.5708 5.38333 15.7625 5.5C15.9542 5.61667 16.1417 5.74167 16.325 5.875L19.3 4.625L22.05 9.375L19.475 11.325C19.4917 11.4417 19.5 11.5542 19.5 11.6625V12.3375C19.5 12.4458 19.4833 12.5583 19.45 12.675L22.025 14.625L19.275 19.375L16.325 18.125C16.1417 18.2583 15.95 18.3833 15.75 18.5C15.55 18.6167 15.35 18.7167 15.15 18.8L14.75 22H9.25001ZM12.05 15.5C13.0167 15.5 13.8417 15.1583 14.525 14.475C15.2083 13.7917 15.55 12.9667 15.55 12C15.55 11.0333 15.2083 10.2083 14.525 9.525C13.8417 8.84167 13.0167 8.5 12.05 8.5C11.0667 8.5 10.2375 8.84167 9.56251 9.525C8.88751 10.2083 8.55001 11.0333 8.55001 12C8.55001 12.9667 8.88751 13.7917 9.56251 14.475C10.2375 15.1583 11.0667 15.5 12.05 15.5Z" fill="#1A1A1A"/></g></svg>`
  }
];

const ICONOGRAPHY_ICON_MAP = {
  'calculator': ICONOGRAPHY_HERO_ICONS[0].svg,
  'card': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-card" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-card)"><path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 12H20V8H4V12Z" fill="#1A1A1A"/></g></svg>`,
  'calendar': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-calendar" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-calendar)"><path d="M17 2.0127C17.2802 2.0127 17.5149 2.10669 17.7041 2.2959C17.8933 2.48511 17.9873 2.71981 17.9873 3V4.0127H19C19.5467 4.0127 20.014 4.20734 20.4033 4.59668C20.7927 4.98602 20.9873 5.45334 20.9873 6V20C20.9873 20.5467 20.7927 21.014 20.4033 21.4033C20.014 21.7927 19.5467 21.9873 19 21.9873H5C4.45334 21.9873 3.98602 21.7927 3.59668 21.4033C3.20734 21.014 3.0127 20.5467 3.0127 20V6C3.0127 5.45334 3.20734 4.98602 3.59668 4.59668C3.98602 4.20734 4.45334 4.0127 5 4.0127H6.0127V3C6.0127 2.71981 6.10669 2.48511 6.2959 2.2959C6.48511 2.10669 6.71981 2.0127 7 2.0127C7.28019 2.0127 7.51489 2.10669 7.7041 2.2959C7.89331 2.48511 7.9873 2.71981 7.9873 3V4.0127H16.0127V3C16.0127 2.71981 16.1067 2.48511 16.2959 2.2959C16.4851 2.10669 16.7198 2.0127 17 2.0127ZM4.9873 20.0127H19.0127V9.9873H4.9873V20.0127ZM8 16.0127C8.28019 16.0127 8.51489 16.1067 8.7041 16.2959C8.89331 16.4851 8.9873 16.7198 8.9873 17C8.9873 17.2802 8.89331 17.5149 8.7041 17.7041C8.51489 17.8933 8.28019 17.9873 8 17.9873C7.71981 17.9873 7.48511 17.8933 7.2959 17.7041C7.10669 17.5149 7.0127 17.2802 7.0127 17C7.0127 16.7198 7.10669 16.4851 7.2959 16.2959C7.48511 16.1067 7.71981 16.0127 8 16.0127ZM12 16.0127C12.2802 16.0127 12.5149 16.1067 12.7041 16.2959C12.8933 16.4851 12.9873 16.7198 12.9873 17C12.9873 17.2802 12.8933 17.5149 12.7041 17.7041C12.5149 17.8933 12.2802 17.9873 12 17.9873C11.7198 17.9873 11.4851 17.8933 11.2959 17.7041C11.1067 17.5149 11.0127 17.2802 11.0127 17C11.0127 16.7198 11.1067 16.4851 11.2959 16.2959C11.4851 16.1067 11.7198 16.0127 12 16.0127ZM16 16.0127C16.2802 16.0127 16.5149 16.1067 16.7041 16.2959C16.8933 16.4851 16.9873 16.7198 16.9873 17C16.9873 17.2802 16.8933 17.5149 16.7041 17.7041C16.5149 17.8933 16.2802 17.9873 16 17.9873C15.7198 17.9873 15.4851 17.8933 15.2959 17.7041C15.1067 17.5149 15.0127 17.2802 15.0127 17C15.0127 16.7198 15.1067 16.4851 15.2959 16.2959C15.4851 16.1067 15.7198 16.0127 16 16.0127ZM8 12.0127C8.28019 12.0127 8.51489 12.1067 8.7041 12.2959C8.89331 12.4851 8.9873 12.7198 8.9873 13C8.9873 13.2802 8.89331 13.5149 8.7041 13.7041C8.51489 13.8933 8.28019 13.9873 8 13.9873C7.71981 13.9873 7.48511 13.8933 7.2959 13.7041C7.10669 13.5149 7.0127 13.2802 7.0127 13C7.0127 12.7198 7.10669 12.4851 7.2959 12.2959C7.48511 12.1067 7.71981 12.0127 8 12.0127ZM12 12.0127C12.2802 12.0127 12.5149 12.1067 12.7041 12.2959C12.8933 12.4851 12.9873 12.7198 12.9873 13C12.9873 13.2802 12.8933 13.5149 12.7041 13.7041C12.5149 13.8933 12.2802 13.9873 12 13.9873C11.7198 13.9873 11.4851 13.8933 11.2959 13.7041C11.1067 13.5149 11.0127 13.2802 11.0127 13C11.0127 12.7198 11.1067 12.4851 11.2959 12.2959C11.4851 12.1067 11.7198 12.0127 12 12.0127ZM16 12.0127C16.2802 12.0127 16.5149 12.1067 16.7041 12.2959C16.8933 12.4851 16.9873 12.7198 16.9873 13C16.9873 13.2802 16.8933 13.5149 16.7041 13.7041C16.5149 13.8933 16.2802 13.9873 16 13.9873C15.7198 13.9873 15.4851 13.8933 15.2959 13.7041C15.1067 13.5149 15.0127 13.2802 15.0127 13C15.0127 12.7198 15.1067 12.4851 15.2959 12.2959C15.4851 12.1067 15.7198 12.0127 16 12.0127Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'camera': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-camera" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-camera)"><path d="M14.9951 3.0127L16.8408 5.00879L16.8369 5.0127H20C20.5467 5.0127 21.014 5.20734 21.4033 5.59668C21.7927 5.98602 21.9873 6.45334 21.9873 7V19C21.9873 19.5467 21.7927 20.014 21.4033 20.4033C21.014 20.7927 20.5467 20.9873 20 20.9873H4C3.45334 20.9873 2.98602 20.7927 2.59668 20.4033C2.20734 20.014 2.0127 19.5467 2.0127 19V7C2.0127 6.45334 2.20734 5.98602 2.59668 5.59668C2.98602 5.20734 3.45334 5.0127 4 5.0127H7.15039V5.01855L7.15918 5.00879L9.00488 3.0127H14.9951ZM9.86621 4.99121L8.04492 6.9873H3.9873V19.0127H20.0127V6.9873H15.9551L14.1338 4.99121L14.1387 4.9873H9.875V4.98145L9.86621 4.99121ZM12 8.5127C13.2467 8.5127 14.3061 8.94866 15.1787 9.82129C16.0513 10.6939 16.4873 11.7533 16.4873 13C16.4873 14.2467 16.0513 15.3061 15.1787 16.1787C14.3061 17.0513 13.2467 17.4873 12 17.4873C10.7533 17.4873 9.69392 17.0513 8.82129 16.1787C7.94866 15.3061 7.5127 14.2467 7.5127 13C7.5127 11.7533 7.94866 10.6939 8.82129 9.82129C9.69392 8.94866 10.7533 8.5127 12 8.5127ZM12 10.4873C11.2968 10.4873 10.7016 10.7301 10.2158 11.2158C9.73008 11.7016 9.4873 12.2968 9.4873 13C9.4873 13.7032 9.73008 14.2984 10.2158 14.7842C10.7016 15.2699 11.2968 15.5127 12 15.5127C12.7032 15.5127 13.2984 15.2699 13.7842 14.7842C14.2699 14.2984 14.5127 13.7032 14.5127 13C14.5127 12.2968 14.2699 11.7016 13.7842 11.2158C13.2984 10.7301 12.7032 10.4873 12 10.4873Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'cancel': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-cancel" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-cancel)"><path d="M17.5999 5.43768C17.8802 5.43768 18.1105 5.52841 18.2913 5.70917C18.4718 5.88981 18.5627 6.11952 18.5627 6.3996C18.5627 6.6799 18.472 6.91026 18.2913 7.091L13.3821 12.0002L13.3909 12.009L18.2913 16.9084C18.472 17.0891 18.5627 17.3195 18.5627 17.5998C18.5627 17.8801 18.472 18.1104 18.2913 18.2912C18.1105 18.472 17.8802 18.5627 17.5999 18.5627C17.3196 18.5626 17.0892 18.4719 16.9084 18.2912L12.009 13.3908L12.0002 13.382L7.09106 18.2912C6.91032 18.4719 6.67996 18.5627 6.39966 18.5627C6.11958 18.5626 5.88988 18.4717 5.70923 18.2912C5.52847 18.1104 5.43774 17.8801 5.43774 17.5998C5.43779 17.3195 5.52851 17.0891 5.70923 16.9084L10.6174 12.0002L10.6086 11.9914L5.70923 7.091C5.52847 6.91024 5.43774 6.67995 5.43774 6.3996C5.43783 6.11942 5.52855 5.88984 5.70923 5.70917C5.8899 5.52849 6.11948 5.43777 6.39966 5.43768C6.68001 5.43768 6.9103 5.52841 7.09106 5.70917L11.9915 10.6086L12.0002 10.6174L16.9084 5.70917C17.0892 5.52845 17.3196 5.43773 17.5999 5.43768Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'check': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-check" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-check)"><path d="M18.7372 6.41272C19.026 6.41272 19.2606 6.50352 19.4413 6.6842C19.6218 6.86482 19.7127 7.09873 19.7128 7.38733C19.7128 7.67613 19.622 7.91074 19.4413 8.09143L10.2411 17.2916C10.1423 17.3904 10.0354 17.4597 9.92078 17.5006C9.80556 17.5418 9.68169 17.5621 9.54968 17.5621C9.4179 17.5621 9.29461 17.5417 9.17957 17.5006C9.06503 17.4597 8.95801 17.3903 8.85925 17.2916L4.55847 12.9908C4.37814 12.8103 4.29144 12.5762 4.29968 12.2877C4.30797 11.9989 4.40311 11.7644 4.58386 11.5836C4.7646 11.4029 4.99497 11.3121 5.27527 11.3121C5.55552 11.3122 5.78597 11.4029 5.96667 11.5836L9.54089 15.1588L9.54968 15.1676L9.55847 15.1588L18.0341 6.6842C18.2147 6.50359 18.4485 6.41279 18.7372 6.41272Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'contact': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-contact" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-contact)"><path d="M5 18.85C5.9 17.9667 6.94583 17.2708 8.1375 16.7625C9.32917 16.2542 10.6167 16 12 16C13.3833 16 14.6708 16.2542 15.8625 16.7625C17.0542 17.2708 18.1 17.9667 19 18.85V6H5V18.85ZM12 14C11.0333 14 10.2083 13.6583 9.525 12.975C8.84167 12.2917 8.5 11.4667 8.5 10.5C8.5 9.53333 8.84167 8.70833 9.525 8.025C10.2083 7.34167 11.0333 7 12 7C12.9667 7 13.7917 7.34167 14.475 8.025C15.1583 8.70833 15.5 9.53333 15.5 10.5C15.5 11.4667 15.1583 12.2917 14.475 12.975C13.7917 13.6583 12.9667 14 12 14ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V3C6 2.71667 6.09583 2.47917 6.2875 2.2875C6.47917 2.09583 6.71667 2 7 2C7.28333 2 7.52083 2.09583 7.7125 2.2875C7.90417 2.47917 8 2.71667 8 3V4H16V3C16 2.71667 16.0958 2.47917 16.2875 2.2875C16.4792 2.09583 16.7167 2 17 2C17.2833 2 17.5208 2.09583 17.7125 2.2875C17.9042 2.47917 18 2.71667 18 3V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H5Z" fill="#1A1A1A"/></g></svg>`,
  'contact photo': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill="#00697F"/><rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#E6E6E6"/><path d="M11.2808 7.48H12.7448L15.9848 16H14.2808L13.4888 13.876H10.5128L9.73275 16H8.02875L11.2808 7.48ZM13.1888 12.712L12.0128 9.364L10.7888 12.712H13.1888Z" fill="white"/></svg>`,
  'copy': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-copy" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-copy)"><path d="M9 18C8.45 18 7.97917 17.8042 7.5875 17.4125C7.19583 17.0208 7 16.55 7 16V4C7 3.45 7.19583 2.97917 7.5875 2.5875C7.97917 2.19583 8.45 2 9 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H9ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V7C3 6.71667 3.09583 6.47917 3.2875 6.2875C3.47917 6.09583 3.71667 6 4 6C4.28333 6 4.52083 6.09583 4.7125 6.2875C4.90417 6.47917 5 6.71667 5 7V20H15C15.2833 20 15.5208 20.0958 15.7125 20.2875C15.9042 20.4792 16 20.7167 16 21C16 21.2833 15.9042 21.5208 15.7125 21.7125C15.5208 21.9042 15.2833 22 15 22H5Z" fill="#1A1A1A"/></g></svg>`,
  'customer service': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-cs" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-cs)"><path d="M13 23C12.7167 23 12.4792 22.9042 12.2875 22.7125C12.0958 22.5208 12 22.2833 12 22C12 21.7167 12.0958 21.4792 12.2875 21.2875C12.4792 21.0958 12.7167 21 13 21H19V20H17C16.45 20 15.9792 19.8042 15.5875 19.4125C15.1958 19.0208 15 18.55 15 18V14C15 13.45 15.1958 12.9792 15.5875 12.5875C15.9792 12.1958 16.45 12 17 12H19V11C19 9.06667 18.3167 7.41667 16.95 6.05C15.5833 4.68333 13.9333 4 12 4C10.0667 4 8.41667 4.68333 7.05 6.05C5.68333 7.41667 5 9.06667 5 11V12H7C7.55 12 8.02083 12.1958 8.4125 12.5875C8.80417 12.9792 9 13.45 9 14V18C9 18.55 8.80417 19.0208 8.4125 19.4125C8.02083 19.8042 7.55 20 7 20H5C4.45 20 3.97917 19.8042 3.5875 19.4125C3.19583 19.0208 3 18.55 3 18V11C3 9.76667 3.2375 8.60417 3.7125 7.5125C4.1875 6.42083 4.83333 5.46667 5.65 4.65C6.46667 3.83333 7.42083 3.1875 8.5125 2.7125C9.60417 2.2375 10.7667 2 12 2C13.2333 2 14.3958 2.2375 15.4875 2.7125C16.5792 3.1875 17.5333 3.83333 18.35 4.65C19.1667 5.46667 19.8125 6.42083 20.2875 7.5125C20.7625 8.60417 21 9.76667 21 11V21C21 21.55 20.8042 22.0208 20.4125 22.4125C20.0208 22.8042 19.55 23 19 23H13ZM5 18H7V14H5V18ZM17 18H19V14H17V18Z" fill="#1A1A1A"/></g></svg>`,
  'cart': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-cart" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-cart)"><path d="M7 22C6.45 22 5.97917 21.8042 5.5875 21.4125C5.19583 21.0208 5 20.55 5 20C5 19.45 5.19583 18.9792 5.5875 18.5875C5.97917 18.1958 6.45 18 7 18C7.55 18 8.02083 18.1958 8.4125 18.5875C8.80417 18.9792 9 19.45 9 20C9 20.55 8.80417 21.0208 8.4125 21.4125C8.02083 21.8042 7.55 22 7 22ZM17 22C16.45 22 15.9792 21.8042 15.5875 21.4125C15.1958 21.0208 15 20.55 15 20C15 19.45 15.1958 18.9792 15.5875 18.5875C15.9792 18.1958 16.45 18 17 18C17.55 18 18.0208 18.1958 18.4125 18.5875C18.8042 18.9792 19 19.45 19 20C19 20.55 18.8042 21.0208 18.4125 21.4125C18.0208 21.8042 17.55 22 17 22ZM6.15 6L8.55 11H15.55L18.3 6H6.15ZM7 17C6.25 17 5.68333 16.6708 5.3 16.0125C4.91667 15.3542 4.9 14.7 5.25 14.05L6.6 11.6L3 4H1.975C1.69167 4 1.45833 3.90417 1.275 3.7125C1.09167 3.52083 1 3.28333 1 3C1 2.71667 1.09583 2.47917 1.2875 2.2875C1.47917 2.09583 1.71667 2 2 2H3.625C3.80833 2 3.98333 2.05 4.15 2.15C4.31667 2.25 4.44167 2.39167 4.525 2.575L5.2 4H19.95C20.4 4 20.7083 4.16667 20.875 4.5C21.0417 4.83333 21.0333 5.18333 20.85 5.55L17.3 11.95C17.1167 12.2833 16.875 12.5417 16.575 12.725C16.275 12.9083 15.9333 13 15.55 13H8.1L7 15H18.025C18.3083 15 18.5417 15.0958 18.725 15.2875C18.9083 15.4792 19 15.7167 19 16C19 16.2833 18.9042 16.5208 18.7125 16.7125C18.5208 16.9042 18.2833 17 18 17H7Z" fill="#1A1A1A"/></g></svg>`,
  'coins': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-coins" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-coins)"><path d="M12 11C14.5 11 16.625 10.6083 18.375 9.825C20.125 9.04167 21 8.1 21 7C21 5.9 20.125 4.95833 18.375 4.175C16.625 3.39167 14.5 3 12 3C9.5 3 7.375 3.39167 5.625 4.175C3.875 4.95833 3 5.9 3 7C3 8.1 3.875 9.04167 5.625 9.825C7.375 10.6083 9.5 11 12 11ZM12 13.5C12.6833 13.5 13.5375 13.4292 14.5625 13.2875C15.5875 13.1458 16.575 12.9167 17.525 12.6C18.475 12.2833 19.2917 11.8708 19.975 11.3625C20.6583 10.8542 21 10.2333 21 9.5V12C21 12.7333 20.6583 13.3542 19.975 13.8625C19.2917 14.3708 18.475 14.7833 17.525 15.1C16.575 15.4167 15.5875 15.6458 14.5625 15.7875C13.5375 15.9292 12.6833 16 12 16C11.3167 16 10.4625 15.9292 9.4375 15.7875C8.4125 15.6458 7.425 15.4167 6.475 15.1C5.525 14.7833 4.70833 14.3708 4.025 13.8625C3.34167 13.3542 3 12.7333 3 12V9.5C3 10.2333 3.34167 10.8542 4.025 11.3625C4.70833 11.8708 5.525 12.2833 6.475 12.6C7.425 12.9167 8.4125 13.1458 9.4375 13.2875C10.4625 13.4292 11.3167 13.5 12 13.5ZM12 18.5C12.6833 18.5 13.5375 18.4292 14.5625 18.2875C15.5875 18.1458 16.575 17.9167 17.525 17.6C18.475 17.2833 19.2917 16.8708 19.975 16.3625C20.6583 15.8542 21 15.2333 21 14.5V17C21 17.7333 20.6583 18.3542 19.975 18.8625C19.2917 19.3708 18.475 19.7833 17.525 20.1C16.575 20.4167 15.5875 20.6458 14.5625 20.7875C13.5375 20.9292 12.6833 21 12 21C11.3167 21 10.4625 20.9292 9.4375 20.7875C8.4125 20.6458 7.425 20.4167 6.475 20.1C5.525 19.7833 4.70833 19.3708 4.025 18.8625C3.34167 18.3542 3 17.7333 3 17V14.5C3 15.2333 3.34167 15.8542 4.025 16.3625C4.70833 16.8708 5.525 17.2833 6.475 17.6C7.425 17.9167 8.4125 18.1458 9.4375 18.2875C10.4625 18.4292 11.3167 18.5 12 18.5Z" fill="#1A1A1A"/></g></svg>`,
  'currency': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-currency" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-currency)"><path d="M4 17.94V8H8.396C8.85333 8 9.27333 8.09333 9.656 8.28C10.048 8.46667 10.384 8.71867 10.664 9.036C10.9533 9.35333 11.1727 9.708 11.322 10.1C11.4807 10.492 11.56 10.8933 11.56 11.304C11.56 11.724 11.4853 12.13 11.336 12.522C11.196 12.9047 10.9907 13.2407 10.72 13.53C10.4493 13.8193 10.132 14.0433 9.768 14.202L12.036 17.94H9.908L7.864 14.608H5.932V17.94H4ZM5.932 12.914H8.354C8.59667 12.914 8.81133 12.844 8.998 12.704C9.18467 12.5547 9.334 12.3587 9.446 12.116C9.558 11.8733 9.614 11.6027 9.614 11.304C9.614 10.9867 9.54867 10.7113 9.418 10.478C9.28733 10.2353 9.11933 10.044 8.914 9.904C8.718 9.764 8.50333 9.694 8.27 9.694H5.932V12.914Z" fill="#1A1A1A"/><path d="M17.4562 18.08C16.8869 18.08 16.3829 17.954 15.9442 17.702C15.5149 17.4407 15.1789 17.0907 14.9362 16.652V20.922H13.0602V10.604H14.6982V11.864C14.9782 11.4347 15.3329 11.0987 15.7622 10.856C16.1915 10.604 16.6815 10.478 17.2322 10.478C17.7269 10.478 18.1795 10.576 18.5902 10.772C19.0102 10.968 19.3742 11.2433 19.6822 11.598C19.9902 11.9433 20.2282 12.3447 20.3962 12.802C20.5735 13.25 20.6622 13.7353 20.6622 14.258C20.6622 14.9673 20.5222 15.6113 20.2422 16.19C19.9715 16.7687 19.5935 17.2307 19.1082 17.576C18.6322 17.912 18.0815 18.08 17.4562 18.08ZM16.8262 16.484C17.1155 16.484 17.3769 16.4233 17.6102 16.302C17.8435 16.1807 18.0442 16.0173 18.2122 15.812C18.3895 15.5973 18.5202 15.3593 18.6042 15.098C18.6975 14.8273 18.7442 14.5473 18.7442 14.258C18.7442 13.95 18.6929 13.6653 18.5902 13.404C18.4969 13.1427 18.3569 12.914 18.1702 12.718C17.9835 12.5127 17.7642 12.354 17.5122 12.242C17.2695 12.13 17.0035 12.074 16.7142 12.074C16.5369 12.074 16.3549 12.1067 16.1682 12.172C15.9909 12.228 15.8182 12.312 15.6502 12.424C15.4822 12.536 15.3329 12.6667 15.2022 12.816C15.0809 12.9653 14.9922 13.1287 14.9362 13.306V15.028C15.0482 15.2987 15.1975 15.546 15.3842 15.77C15.5802 15.994 15.8042 16.1713 16.0562 16.302C16.3082 16.4233 16.5649 16.484 16.8262 16.484Z" fill="#1A1A1A"/></g></svg>`,
  'celengan': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-celengan" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-celengan)"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.48665 4.49983C4.07933 3.85562 4.96856 3.34045 6.17428 3.34045C7.39149 3.34045 8.46273 3.93888 9.19874 4.60047C9.57411 4.93788 9.89443 5.31937 10.1276 5.70533C10.3291 6.0389 10.515 6.45761 10.544 6.89912L11.2339 10.3748C12.5032 10.4672 13.5173 10.7638 14.3582 11.0949C14.8007 11.2691 15.1978 11.4542 15.5355 11.6117C15.5774 11.6312 15.6183 11.6503 15.6583 11.6689C15.729 11.7017 15.7962 11.7328 15.8603 11.7619C16.0444 11.303 16.3015 10.7628 16.6269 10.2572C17.1317 9.47299 18.0462 8.39186 19.3918 8.39186C20.4081 8.39186 21.1413 8.89857 21.5338 9.62898C21.8239 10.1687 21.9052 10.78 21.8759 11.3196C22.5199 11.5313 22.9673 12.0641 23.1602 12.7585C23.3583 13.4718 23.3041 14.3716 23.0386 15.4337C22.5969 17.2005 21.1297 18.7161 19.7454 19.729C19.0332 20.2501 18.2906 20.6771 17.6178 20.9681C17.1335 21.1776 16.5901 21.3593 16.0858 21.3983C15.676 21.681 15.0706 22.0732 14.0837 22.3094C12.9175 22.5884 11.2699 22.648 8.70947 22.2822C5.86985 21.8765 4.12626 20.3266 3.14648 18.5527C2.19158 16.8238 1.96946 14.9068 2.05378 13.642L2.05433 13.6338L2.49767 8.31375L2.49766 6.47194L2.51709 6.37484C2.62221 5.84922 2.91836 5.11754 3.48665 4.49983Z" fill="#1A1A1A"/><circle cx="6" cy="7" r="1" fill="#1A1A1A"/></g></svg>`,
  'chart': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.4458 4.19775C9.6471 4.16268 9.79225 4.176 10.0425 4.33838L10.0444 4.34033C10.2309 4.4609 10.334 4.59239 10.4058 4.94385C10.4949 5.38009 10.4995 5.9881 10.4995 7.00049V8.50049C10.4995 9.41491 10.4983 10.2011 10.5825 10.8276C10.6707 11.4833 10.8688 12.112 11.3784 12.6216C11.888 13.1312 12.5167 13.3293 13.1724 13.4175C13.7989 13.5018 14.5851 13.5005 15.4995 13.5005H16.9995C18.0118 13.5005 18.6198 13.5052 19.0562 13.5942C19.4082 13.6661 19.5402 13.7694 19.6606 13.9556V13.9565C19.8232 14.2074 19.8372 14.3521 19.8022 14.5532C19.7623 14.7823 19.6599 15.0558 19.4731 15.4858L19.2573 15.9731C18.4705 17.7301 17.1103 19.1679 15.3999 20.0513C13.6896 20.9346 11.7303 21.2117 9.84229 20.8364C8.19351 20.5084 6.67845 19.6989 5.48975 18.5103C4.30109 17.3216 3.49158 15.8064 3.16357 14.1577C2.83571 12.5092 3.00394 10.8004 3.64697 9.24756C4.29021 7.69441 5.38014 6.36619 6.77783 5.43213C7.07467 5.23389 7.38347 5.05431 7.70264 4.89502L8.02588 4.74268C8.75585 4.41546 9.14031 4.25106 9.4458 4.19775Z" stroke="#1A1A1A" stroke-width="2"/><path d="M21.446 7.06901C21.0422 6.04768 20.4332 5.12004 19.6566 4.34345C18.88 3.56686 17.9523 2.95782 16.931 2.55401C15.389 1.94701 14 3.34401 14 5.00001V9.00001C14 9.26523 14.1054 9.51958 14.2929 9.70712C14.4804 9.89465 14.7348 10 15 10H19C20.657 10 22.053 8.61001 21.446 7.06901Z" stroke="#1A1A1A" stroke-width="2"/></svg>`
};

// ─────────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────────
function isLight(hex) {
  if (!hex || !hex.startsWith('#')) return true;
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return (.299*r+.587*g+.114*b)>145;
}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}

function buildSwatches(key) {
  const sw=document.getElementById(key+'-swatch');
  const li=document.getElementById(key+'-list-inner');
  const steps=COLORS[key];
  sw.style.gridTemplateColumns=`repeat(${steps.length},1fr)`;
  steps.forEach(({step,hex})=>{
    const token=`--${key}-${step}`;
    const light=isLight(hex), tc=light?'#1a1a1a':'#fff';
    const d=document.createElement('div');
    d.className='swatch';
    d.innerHTML=`<div class="swatch-inner" style="background:${hex}"><span class="swatch-step" style="color:${tc}">${step}</span></div>
    <div class="swatch-tip"><div class="tip-name">${cap(key)} ${step}</div><div class="tip-hex">${hex}</div><div class="tip-token">var(${token})</div></div>`;
    d.onclick=()=>copyText(hex,`${cap(key)} ${step} · ${hex}`);
    sw.appendChild(d);
    const c=document.createElement('div');
    c.className='color-card';
    c.innerHTML=`<div class="cc-swatch" style="background:${hex}"></div><div><div class="cc-name">${cap(key)} ${step}</div><div class="cc-hex">${hex}</div><div class="cc-token">var(${token})</div></div>`;
    c.onclick=()=>copyText(hex,`Copied ${hex}`);
    li.appendChild(c);
  });
}

function setView(key,view,btn){
  document.getElementById(key+'-swatch').classList.toggle('hidden',view==='list');
  document.getElementById(key+'-list').classList.toggle('visible',view==='list');
  btn.closest('.view-toggle').querySelectorAll('.view-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

// ─────────────────────────────────────────────
// ADAPTIVE
// ─────────────────────────────────────────────

function renderAdaptive(){
  const con=document.getElementById('adaptive-container');
  con.innerHTML='';
  Object.values(ADAPTIVE).forEach(g=>{
    const div=document.createElement('div');
    div.className='adaptive-group';
    div.innerHTML=`<div class="ag-title">${g.label}</div><div class="ag-sub">${g.sub}</div>
    <table class="token-table"><thead><tr><th style="width:240px">Token</th><th>Usage</th><th style="width:200px">Value</th></tr></thead>
    <tbody>${g.tokens.map(t=>{
      const hex=t.hex;
      const ref=t.ref;
      if(!hex)return '';
      return `<tr><td><span class="token-name">${t.token}</span></td><td><span class="token-usage">${t.usage}</span></td>
      <td><div class="tv-cell"><div class="tv-sw" style="background:${hex};border:1px solid rgba(0,0,0,0.08)" onclick="copyText('${hex}','Copied ${hex}')"></div>
      <div><div class="tv-val">${hex}</div><div class="tv-ref">${ref}</div></div></div></td></tr>`;
    }).join('')}</tbody></table>`;
    con.appendChild(div);
  });
}

// ─────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────
let previewText='The quick brown fox jumps over the lazy dog.';
function updatePreview(v){ previewText=v||previewText; renderAllTypeGroups(); }

function buildTypeRow(item){
  const bold=item.weightNum>=600;
  const key=item.name.toLowerCase().replace(/\s+/g,'-');
  return `<div class="type-row" style="cursor:pointer" onclick="copyText('--typo-${key}','Copied --typo-${key}')">
    <div>
      <div class="type-specimen" style="font-family:'Sora',sans-serif;font-size:${item.size}px;line-height:${item.lineHeight}px;font-weight:${item.weightNum}">${previewText}</div>
      <div class="type-copy-hint" style="margin-top:4px">copy token ↗</div>
    </div>
    <div><span class="type-name-badge">${item.name}</span></div>
    <div class="type-meta-cell" style="font-size:11px;color:var(--text-muted);font-family:inherit;font-weight:400">${item.usage}</div>
    <div><span class="type-weight-pill ${bold?'bold':''}">${item.weight}/${item.weightNum}</span></div>
    <div class="type-meta-cell">${item.size}<span style="color:var(--text-dim)">px</span></div>
    <div class="type-meta-cell">${item.lineHeight}<span style="color:var(--text-dim)">px</span></div>
  </div>`;
}

function renderAllTypeGroups(){
  document.getElementById('type-title').innerHTML=TYPO.title.map(buildTypeRow).join('');
  document.getElementById('type-body').innerHTML=TYPO.body.map(buildTypeRow).join('');
  document.getElementById('type-small-title').innerHTML=TYPO.smallTitle.map(buildTypeRow).join('');
  document.getElementById('type-caption').innerHTML=TYPO.caption.map(buildTypeRow).join('');
}

function buildCSSPreview(){
  const all=[...TYPO.title,...TYPO.body,...TYPO.smallTitle,...TYPO.caption];
  let out=':root {\n';
  all.forEach(t=>{
    const k=t.name.toLowerCase().replace(/\s+/g,'-');
    out+=`  <span style="color:#1C95AD">--typo-${k}-size</span>: <span style="color:#FE6201">${t.size}px</span>;\n`;
    out+=`  <span style="color:#1C95AD">--typo-${k}-lh</span>: <span style="color:#FE6201">${t.lineHeight}px</span>;\n`;
    out+=`  <span style="color:#1C95AD">--typo-${k}-weight</span>: <span style="color:#FE6201">${t.weightNum}</span>;\n`;
  });
  out+='}';
  document.getElementById('typo-css-preview').innerHTML=out;
}

// ─────────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────────
function buildSpacing(){
  // ruler
  const ruler=document.getElementById('spacing-ruler');
  SPACING.forEach(s=>{
    const col=document.createElement('div');
    col.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px;flex-shrink:0;cursor:pointer';
    const bar=document.createElement('div');
    const sz=Math.min(s.px,80);
    bar.style.cssText=`width:${sz}px;height:${sz}px;background:#FE6201;border-radius:3px;opacity:0.85;transition:opacity .15s`;
    bar.onmouseenter=()=>bar.style.opacity='1';
    bar.onmouseleave=()=>bar.style.opacity='0.85';
    const lbl=document.createElement('div');
    lbl.style.cssText='font-family:DM Mono,monospace;font-size:9px;color:#828282;white-space:nowrap';
    lbl.textContent=s.px+'px';
    col.appendChild(bar); col.appendChild(lbl);
    col.onclick=()=>copyText(s.token,'Copied '+s.token);
    ruler.appendChild(col);
  });

  // table
  const tbody=document.getElementById('spacing-tbody');
  SPACING.forEach(s=>{
    const sz=Math.min(s.px,80);
    const tr=document.createElement('tr');
    tr.style.cursor='pointer';
    tr.onclick=()=>copyText(s.token,'Copied '+s.token);
    tr.innerHTML=`
      <td class="sp-visual-cell"><div style="width:${sz}px;height:${sz}px;background:#FE6201;border-radius:3px;min-width:2px;min-height:2px"></div></td>
      <td><span class="sp-token">${s.token}</span></td>
      <td><span class="sp-px">${s.px}</span><span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text-muted)">px</span></td>
      <td><span class="sp-rem">${s.rem}</span><span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text-dim)">rem</span></td>
      <td><span class="sp-usage">${s.usage}</span></td>`;
    tbody.appendChild(tr);
  });
}

function parseIconographyGroups() {
  return ICONOGRAPHY_GROUP_LINES.map(line => {
    const [heading, rawEntries] = line.split(': ');
    const entries = rawEntries.split(', ').map(item => {
      const match = item.match(/^(.*)\s\((\d+)\)$/);
      return {
        name: match ? match[1] : item,
        count: match ? Number(match[2]) : 0
      };
    });
    return { heading, entries };
  });
}

function getIconographySvg(name) {
  return ICONOGRAPHY_ICON_MAP[name.toLowerCase()] || '';
}

function buildIconography() {
  const groups = parseIconographyGroups();
  const hero = document.getElementById('iconography-hero-preview');
  const styles = document.getElementById('iconography-style-strip');
  const inventory = document.getElementById('iconography-groups');
  const totalGroups = groups.reduce((sum, group) => sum + group.entries.length, 0);
  const totalSymbols = groups.reduce((sum, group) => sum + group.entries.reduce((acc, entry) => acc + entry.count, 0), 0);

  if (hero) {
    hero.innerHTML = ICONOGRAPHY_HERO_ICONS.map(icon => `
      <div class="icon-hero-card">
        <div class="icon-hero-glyph">${icon.svg}</div>
        <div class="icon-hero-label">${icon.label}</div>
      </div>
    `).join('');
  }

  if (styles) {
    styles.innerHTML = ICONOGRAPHY_STYLE_COUNTS.map(([label, count]) => `
      <span class="token-chip"><span class="chip-swatch icon-chip-swatch"></span>${label} · ${count}</span>
    `).join('');
  }

  if (inventory) {
    inventory.innerHTML = groups.map(group => `
      <section class="icon-group-section">
        <div class="icon-group-header">
          <div>
            <div class="icon-group-letter">${group.heading}</div>
            <div class="icon-group-meta">${group.entries.length} icon groups · ${group.entries.reduce((sum, entry) => sum + entry.count, 0)} variants</div>
          </div>
        </div>
        <div class="icon-group-grid">
          ${group.entries.map(entry => `
            <article class="icon-item-card">
              ${getIconographySvg(entry.name) ? `
                <div class="icon-item-preview">${getIconographySvg(entry.name)}</div>
                <div class="icon-item-actions">
                  <button class="icon-action-btn" onclick="copyIconSvg('${entry.name.replace(/'/g, "\\'")}')">Copy SVG</button>
                  <button class="icon-action-btn" onclick="downloadIconSvg('${entry.name.replace(/'/g, "\\'")}')">Download SVG</button>
                </div>
              ` : ''}
              <div class="icon-item-head">
                <h3>${entry.name}</h3>
                <span class="icon-item-count">${entry.count}</span>
              </div>
              <p>${entry.count === 1 ? 'Single source variant in Figma' : `${entry.count} source variants in Figma`}</p>
            </article>
          `).join('')}
        </div>
      </section>
    `).join('');
  }

  const totals = document.getElementById('iconography-totals');
  if (totals) {
    totals.innerHTML = `
      <strong>${totalGroups} icon groups · ${totalSymbols} variants pulled from Figma</strong>
      <span>Names and counts follow the <code>Iconography</code> foundation page in Figma.</span>
    `;
  }
}

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────
function copyText(text,msg){
  try{navigator.clipboard.writeText(text)}catch(e){}
  const t=document.getElementById('toast');
  t.textContent='✓ '+(msg||text);
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2200);
}

function copyAllCSS(){
  let out=':root {\n';
  Object.entries(COLORS).forEach(([k,s])=>{
    out+=`\n  /* ${cap(k)} */\n`;
    s.forEach(({step,hex})=>{out+=`  --${k}-${step}: ${hex};\n`;});
  });
  out+='}';
  copyText(out,'All color CSS vars copied!');
}

function exportTokensJSON(){
  const t={};
  Object.entries(COLORS).forEach(([k,s])=>{t[k]={};s.forEach(({step,hex})=>{t[k][step]={value:hex,type:'color'};});});
  const b=new Blob([JSON.stringify(t,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='atreus-color-tokens.json';a.click();
}

function exportTailwindConfig(){
  let out='module.exports = {\n  theme: { extend: { colors: {\n';
  Object.entries(COLORS).forEach(([k,s])=>{
    out+=`    ${k}: {\n`;s.forEach(({step,hex})=>{out+=`      '${step}': '${hex}',\n`;});out+=`    },\n`;
  });
  out+='  }}}\n};\n';
  const b=new Blob([out],{type:'text/javascript'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='tailwind.config.js';a.click();
}

function exportTypoTokens(){
  const all=[...TYPO.title,...TYPO.body,...TYPO.smallTitle,...TYPO.caption];
  const t={typography:{}};
  all.forEach(item=>{
    const k=item.name.toLowerCase().replace(/\s+/g,'-');
    t.typography[k]={value:{fontFamily:item.font,fontSize:`${item.size}px`,fontWeight:item.weightNum,lineHeight:`${item.lineHeight}px`},type:'typography'};
  });
  const b=new Blob([JSON.stringify(t,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='atreus-typography-tokens.json';a.click();
}

function exportTypoCSS(){
  const all=[...TYPO.title,...TYPO.body,...TYPO.smallTitle,...TYPO.caption];
  let out=':root {\n';
  all.forEach(t=>{
    const k=t.name.toLowerCase().replace(/\s+/g,'-');
    out+=`  --typo-${k}-size: ${t.size}px;\n  --typo-${k}-lh: ${t.lineHeight}px;\n  --typo-${k}-weight: ${t.weightNum};\n`;
  });
  out+='}';
  copyText(out,'Typography CSS vars copied!');
}

function exportSpacingTokens(){
  const t={spacing:{}};
  SPACING.forEach(s=>{
    const k=s.token.replace('$','');
    t.spacing[k]={value:`${s.px}px`,rem:`${s.rem}rem`,type:'spacing'};
  });
  const b=new Blob([JSON.stringify(t,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='atreus-spacing-tokens.json';a.click();
}

function exportSpacingCSS(){
  let out=':root {\n';
  SPACING.forEach(s=>{
    const k=s.token.replace('$','--');
    out+=`  ${k}: ${s.px}px; /* ${s.rem}rem */\n`;
  });
  out+='}';
  copyText(out,'Spacing CSS vars copied!');
}

function exportIconTokens() {
  const payload = {
    iconography: {
      totalGroups: 104,
      totalVariants: 226,
      sizes: ['24px'],
      styleCounts: Object.fromEntries(ICONOGRAPHY_STYLE_COUNTS),
      groups: parseIconographyGroups().map(group => ({
        heading: group.heading,
        icons: group.entries.map(entry => ({
          name: entry.name,
          variants: entry.count
        }))
      }))
    }
  };
  const b = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'atreus-iconography-tokens.json';
  a.click();
}

function copyIconInventory() {
  const payload = JSON.stringify({
    styles: Object.fromEntries(ICONOGRAPHY_STYLE_COUNTS),
    groups: parseIconographyGroups()
  }, null, 2);
  copyText(payload, 'Icon inventory copied!');
}

function copyIconSvg(name) {
  const svg = getIconographySvg(name);
  if (!svg) {
    copyText(name, `No embedded SVG yet for ${name}`);
    return;
  }
  copyText(svg, `${name} SVG copied!`);
}

function downloadIconSvg(name) {
  const svg = getIconographySvg(name);
  if (!svg) {
    copyText(name, `No embedded SVG yet for ${name}`);
    return;
  }
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
  a.click();
}



// ─────────────────────────────────────────────
// BUTTON INTERACTIVE PREVIEW
// ─────────────────────────────────────────────
const btnState = { type: 'filled', size: 'md', state: 'enable', icon: 'none' };

function setCtrl(key, el, val) {
  btnState[key] = val;
  el.closest('.ctrl-pills').querySelectorAll('.ctrl-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  updateBtnPreview();
}

function updateBtnPreview() {
  const stage = document.getElementById('btn-preview-stage');
  const sizeMap = { sm: 'btn-sm-size', md: 'btn-md-size', lg: 'btn-lg-size' };
  const typeMap = { filled: 'btn-filled', outline: 'btn-outline', ghost: 'btn-ghost' };
  const disabled = btnState.state === 'disabled' ? ' disabled' : '';
  const iconSz = btnState.size === 'lg' ? 24 : 16;
  const iconSvg = `<svg width="${iconSz}" height="${iconSz}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="${btnState.type==='ghost'?'#238453':'#1a1a1a'}" stroke-width="1.5"/><path d="M15 12H9m3-3-3 3 3 3" stroke="${btnState.type==='ghost'?'#238453':'#1a1a1a'}" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  const iconR = `<svg width="${iconSz}" height="${iconSz}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="${btnState.type==='ghost'?'#238453':'#1a1a1a'}" stroke-width="1.5"/><path d="M9 12h6m-3 3 3-3-3-3" stroke="${btnState.type==='ghost'?'#238453':'#1a1a1a'}" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  let inner = '';
  if (btnState.icon === 'leading') inner = iconSvg + ' Button';
  else if (btnState.icon === 'trailing') inner = 'Button ' + iconR;
  else inner = 'Button';
  stage.innerHTML = `<button class="btn-atreus ${typeMap[btnState.type]} ${sizeMap[btnState.size]}${disabled}">${inner}</button>`;
}

// ─────────────────────────────────────────────
// BUTTON EXPORTS
// ─────────────────────────────────────────────
function exportButtonTokens() {
  const tokens = {
    button: {
      "primary-default": { value: "#87CCA9", type: "color", description: "Default background of Filled button" },
      "primary-disabled": { value: "#F3F3F3", type: "color", description: "Disabled background" },
      "outlined-default": { value: "#1A1A1A", type: "color", description: "Default border of Outline button" },
      "outlined-disabled": { value: "#DADADA", type: "color", description: "Disabled border" },
      "text-ghost": { value: "#238453", type: "color", description: "Ghost button text color" },
      "text-disabled": { value: "#CDCDCD", type: "color", description: "Disabled text" },
      "radius": { value: "100px", type: "borderRadius", description: "Full pill shape" },
      "size-sm-h": { value: "auto", type: "dimension" },
      "size-sm-padding": { value: "8px 12px", type: "dimension" },
      "size-md-padding": { value: "9px 16px", type: "dimension" },
      "size-lg-height": { value: "48px", type: "dimension" },
      "size-lg-padding": { value: "12px 24px", type: "dimension" }
    }
  };
  const b = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'atreus-button-tokens.json'; a.click();
}

function copyButtonCSS() {
  const css = `:root {
  --btn-bg-filled: #87CCA9;        /* $button-primary-default */
  --btn-border-default: #1A1A1A;   /* $border-primary */
  --btn-bg-disabled: #F3F3F3;      /* $button-primary-disabled */
  --btn-border-disabled: #DADADA;  /* $button-outlined-disabled */
  --btn-text-ghost: #238453;       /* $text-harmony / $text-link */
  --btn-text-disabled: #CDCDCD;
  --btn-radius: 100px;
  --btn-floating-shadow: 0 4px 10px rgba(26,26,26,0.25);
}

/* Button Base */
.btn { display: inline-flex; align-items: center; justify-content: center;
  gap: 4px; border-radius: var(--btn-radius); font-family: 'Sora', sans-serif;
  font-weight: 700; border: 1px solid transparent; cursor: pointer; transition: all .18s; }

/* Sizes */
.btn-sm { padding: 8px 12px; font-size: 12px; line-height: 18px; }
.btn-md { padding: 9px 16px; font-size: 14px; line-height: 20px; }
.btn-lg { padding: 12px 24px; font-size: 14px; line-height: 20px; height: 48px; }

/* Types */
.btn-filled  { background: var(--btn-bg-filled); border-color: var(--btn-border-default); color: #1a1a1a; }
.btn-outline { background: transparent; border-color: var(--btn-border-default); color: #1a1a1a; }
.btn-ghost   { background: transparent; border-color: transparent; color: var(--btn-text-ghost); }

/* Disabled */
.btn-filled[disabled],  .btn-filled.disabled  { background: var(--btn-bg-disabled); border-color: var(--btn-border-disabled); color: var(--btn-text-disabled); }
.btn-outline[disabled], .btn-outline.disabled { border-color: var(--btn-border-disabled); color: var(--btn-text-disabled); }
.btn-ghost[disabled],   .btn-ghost.disabled   { color: var(--btn-text-disabled); }

/* Button Icon */
.btn-icon { width: 44px; height: 44px; border-radius: var(--btn-radius); display: inline-flex; align-items: center; justify-content: center; border: 1px solid transparent; cursor: pointer; }
.btn-icon-green    { background: var(--btn-bg-filled); border-color: var(--btn-border-default); }
.btn-icon-floating { background: #fff; box-shadow: var(--btn-floating-shadow); }
.btn-icon-floating-green { background: var(--btn-bg-filled); border-color: var(--btn-border-default); box-shadow: var(--btn-floating-shadow); }`;
  copyText(css, 'Button CSS vars copied!');
}
// ─────────────────────────────────────────────
// CONTROL INTERACTIVE PREVIEW
// ─────────────────────────────────────────────
const ictrlState = { type: 'radio', state: 'default', selected: 'off' };

function setICtrl(key, el, val) {
  ictrlState[key] = val;
  el.closest('.ctrl-pills').querySelectorAll('.ctrl-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  updateCtrlPreview();
}

function updateCtrlPreview() {
  const stage = document.getElementById('ctrl-preview-stage');
  if (!stage) return;
  const { type, state, selected } = ictrlState;

  let html = '';
  const isOn = selected === 'on';
  const isDisabled = state === 'disabled';
  const isActive = state === 'active';

  if (type === 'radio') {
    let cls = 'ctrl-radio';
    if (isDisabled) {
      cls += ' ctrl-disabled';
      if (isOn) cls += ' ctrl-disabled-on';
    } else if (isOn || isActive) {
      cls += ' ctrl-active';
    } else {
      cls += ' ctrl-default';
    }
    html = `<div class="${cls}"></div>`;
  } else if (type === 'checkbox') {
    let cls = 'ctrl-checkbox';
    if (isDisabled) {
      cls += ' ctrl-cb-disabled';
      if (isOn) cls += ' ctrl-cb-disabled-on';
    } else if (isOn || isActive) {
      cls += ' ctrl-cb-checked';
    } else {
      cls += ' ctrl-cb-default';
    }
    html = `<div class="${cls}"></div>`;
  } else if (type === 'switch') {
    let cls = 'ctrl-switch';
    if (isDisabled) {
      cls += ' ctrl-sw-disabled';
      if (isOn) cls += ' ctrl-sw-disabled-on';
    } else if (isOn || isActive) {
      cls += ' ctrl-sw-on';
    } else {
      cls += ' ctrl-sw-off';
    }
    html = `<div class="${cls}"></div>`;
  }

  stage.innerHTML = html;
}

// ─────────────────────────────────────────────
// CONTROL EXPORTS
// ─────────────────────────────────────────────
function exportControlTokens() {
  const tokens = {
    control: {
      "color-active":        { value: "#238453", type: "color", description: "$text-harmony — selected state fill & border" },
      "color-default-border":{ value: "#1A1A1A", type: "color", description: "$border-primary — unselected border" },
      "color-disabled":      { value: "#B4B4B4", type: "color", description: "$text-disabled — disabled state" },
      "color-switch-off":    { value: "#9B9B9B", type: "color", description: "$text-secondary — switch off track" },
      "color-thumb":         { value: "#FFFFFF", type: "color", description: "thumb/checkmark color" },
      "radio-size":          { value: "20px",    type: "dimension" },
      "checkbox-size":       { value: "16px",    type: "dimension" },
      "switch-width":        { value: "36px",    type: "dimension" },
      "switch-height":       { value: "20px",    type: "dimension" },
      "tap-target":          { value: "44px",    type: "dimension" }
    }
  };
  const b = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'atreus-control-tokens.json'; a.click();
}

function copyControlCSS() {
  const css = `:root {
  --ctrl-color-active: #238453;         /* $text-harmony */
  --ctrl-color-default-border: #1A1A1A; /* $border-primary */
  --ctrl-color-disabled: #B4B4B4;       /* $text-disabled */
  --ctrl-color-switch-off: #9B9B9B;     /* $text-secondary */
  --ctrl-thumb-color: #FFFFFF;
  --ctrl-radio-size: 20px;
  --ctrl-checkbox-size: 16px;
  --ctrl-switch-w: 36px;
  --ctrl-switch-h: 20px;
  --ctrl-tap-target: 44px;
}

/* Radio Button */
.ctrl-radio {
  width: var(--ctrl-radio-size); height: var(--ctrl-radio-size);
  border-radius: 100px; border: 2px solid var(--ctrl-color-default-border);
  background: transparent; position: relative; transition: all .18s;
}
.ctrl-radio.ctrl-active {
  border-color: var(--ctrl-color-active); background: var(--ctrl-color-active);
}
.ctrl-radio.ctrl-active::after {
  content: ''; position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%); width: 8px; height: 8px;
  border-radius: 100px; background: var(--ctrl-thumb-color);
}
.ctrl-radio.ctrl-disabled { border-color: var(--ctrl-color-disabled); cursor: not-allowed; }
.ctrl-radio.ctrl-disabled.ctrl-disabled-on { background: var(--ctrl-color-disabled); }
.ctrl-radio.ctrl-disabled.ctrl-disabled-on::after {
  content: ''; position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%); width: 8px; height: 8px;
  border-radius: 100px; background: var(--ctrl-thumb-color);
}

/* Checkbox */
.ctrl-checkbox {
  width: var(--ctrl-checkbox-size); height: var(--ctrl-checkbox-size);
  border-radius: 4px; border: 1.5px solid var(--ctrl-color-default-border);
  background: transparent; position: relative; transition: all .18s;
}
.ctrl-checkbox.ctrl-cb-checked {
  border-color: var(--ctrl-color-active); background: var(--ctrl-color-active);
}
.ctrl-checkbox.ctrl-cb-checked::after {
  content: ''; position: absolute; top: 47%; left: 50%;
  transform: translate(-50%,-50%) rotate(45deg);
  width: 5px; height: 8px;
  border-right: 2px solid var(--ctrl-thumb-color);
  border-bottom: 2px solid var(--ctrl-thumb-color);
}
.ctrl-checkbox.ctrl-cb-disabled { border-color: var(--ctrl-color-disabled); cursor: not-allowed; }

/* Switch */
.ctrl-switch {
  width: var(--ctrl-switch-w); height: var(--ctrl-switch-h);
  border-radius: 100px; background: var(--ctrl-color-switch-off);
  position: relative; transition: background .18s; cursor: pointer;
}
.ctrl-switch::after {
  content: ''; position: absolute; top: 2px; left: 2px;
  width: 16px; height: 16px; border-radius: 100px;
  background: var(--ctrl-thumb-color); transition: transform .18s;
}
.ctrl-switch.ctrl-sw-on { background: var(--ctrl-color-active); }
.ctrl-switch.ctrl-sw-on::after { transform: translateX(16px); }
.ctrl-switch.ctrl-sw-disabled { background: var(--ctrl-color-disabled); cursor: not-allowed; }
.ctrl-switch.ctrl-sw-disabled.ctrl-sw-disabled-on::after { transform: translateX(16px); }`;
  copyText(css, 'Control CSS vars copied!');
}
