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
  'chevron': ICONOGRAPHY_HERO_ICONS[2].svg,
  'add': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_15_4098\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<path d=\"M0 0H24V24H0V0Z\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_15_4098)\">\n<path d=\"M12 5.0127C12.2802 5.0127 12.5149 5.10669 12.7041 5.2959C12.8933 5.48511 12.9873 5.71981 12.9873 6V11.0127H18C18.2802 11.0127 18.5149 11.1067 18.7041 11.2959C18.8933 11.4851 18.9873 11.7198 18.9873 12C18.9873 12.2802 18.8933 12.5149 18.7041 12.7041C18.5149 12.8933 18.2802 12.9873 18 12.9873H12.9873V18C12.9873 18.2802 12.8933 18.5149 12.7041 18.7041C12.5149 18.8933 12.2802 18.9873 12 18.9873C11.7198 18.9873 11.4851 18.8933 11.2959 18.7041C11.1067 18.5149 11.0127 18.2802 11.0127 18V12.9873H6C5.71981 12.9873 5.48511 12.8933 5.2959 12.7041C5.10669 12.5149 5.0127 12.2802 5.0127 12C5.0127 11.7198 5.10669 11.4851 5.2959 11.2959C5.48511 11.1067 5.71981 11.0127 6 11.0127H11.0127V6C11.0127 5.71981 11.1067 5.48511 11.2959 5.2959C11.4851 5.10669 11.7198 5.0127 12 5.0127Z\" fill=\"#1A1A1A\" stroke=\"#1A1A1A\" stroke-width=\"0.025\"/>\n</g>\n</svg>\n',
  'account': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_15_4116\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<path d=\"M0 0H24V24H0V0Z\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_15_4116)\">\n<path d=\"M5.85 17.1C6.7 16.45 7.65 15.9375 8.7 15.5625C9.75 15.1875 10.85 15 12 15C13.15 15 14.25 15.1875 15.3 15.5625C16.35 15.9375 17.3 16.45 18.15 17.1C18.7333 16.4167 19.1875 15.6417 19.5125 14.775C19.8375 13.9083 20 12.9833 20 12C20 9.78333 19.2208 7.89583 17.6625 6.3375C16.1042 4.77917 14.2167 4 12 4C9.78333 4 7.89583 4.77917 6.3375 6.3375C4.77917 7.89583 4 9.78333 4 12C4 12.9833 4.1625 13.9083 4.4875 14.775C4.8125 15.6417 5.26667 16.4167 5.85 17.1ZM12 13C11.0167 13 10.1875 12.6625 9.5125 11.9875C8.8375 11.3125 8.5 10.4833 8.5 9.5C8.5 8.51667 8.8375 7.6875 9.5125 7.0125C10.1875 6.3375 11.0167 6 12 6C12.9833 6 13.8125 6.3375 14.4875 7.0125C15.1625 7.6875 15.5 8.51667 15.5 9.5C15.5 10.4833 15.1625 11.3125 14.4875 11.9875C13.8125 12.6625 12.9833 13 12 13ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C12.8833 20 13.7167 19.8708 14.5 19.6125C15.2833 19.3542 16 18.9833 16.65 18.5C16 18.0167 15.2833 17.6458 14.5 17.3875C13.7167 17.1292 12.8833 17 12 17C11.1167 17 10.2833 17.1292 9.5 17.3875C8.71667 17.6458 8 18.0167 7.35 18.5C8 18.9833 8.71667 19.3542 9.5 19.6125C10.2833 19.8708 11.1167 20 12 20ZM12 11C12.4333 11 12.7917 10.8583 13.075 10.575C13.3583 10.2917 13.5 9.93333 13.5 9.5C13.5 9.06667 13.3583 8.70833 13.075 8.425C12.7917 8.14167 12.4333 8 12 8C11.5667 8 11.2083 8.14167 10.925 8.425C10.6417 8.70833 10.5 9.06667 10.5 9.5C10.5 9.93333 10.6417 10.2917 10.925 10.575C11.2083 10.8583 11.5667 11 12 11Z\" fill=\"#1A1A1A\"/>\n</g>\n</svg>\n',
  'account virtual': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_15_4132\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<rect width=\"24\" height=\"24\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_15_4132)\">\n<path d=\"M17.55 12L14 8.45L15.425 7.05L17.55 9.175L21.8 4.925L23.2 6.35L17.55 12ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM1 20V17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C10.1 13 11.1833 13.1292 12.25 13.3875C13.3167 13.6458 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2708 15.1625 16.5625 15.6375C16.8542 16.1125 17 16.6333 17 17.2V20H1ZM3 18H15V17.2C15 17.0167 14.9542 16.85 14.8625 16.7C14.7708 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5625 11.775 15.3375C10.8583 15.1125 9.93333 15 9 15C8.06667 15 7.14167 15.1125 6.225 15.3375C5.30833 15.5625 4.4 15.9 3.5 16.35C3.35 16.4333 3.22917 16.55 3.1375 16.7C3.04583 16.85 3 17.0167 3 17.2V18ZM9 10C9.55 10 10.0208 9.80417 10.4125 9.4125C10.8042 9.02083 11 8.55 11 8C11 7.45 10.8042 6.97917 10.4125 6.5875C10.0208 6.19583 9.55 6 9 6C8.45 6 7.97917 6.19583 7.5875 6.5875C7.19583 6.97917 7 7.45 7 8C7 8.55 7.19583 9.02083 7.5875 9.4125C7.97917 9.80417 8.45 10 9 10Z\" fill=\"#1A1A1A\"/>\n</g>\n</svg>\n',
  'card': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-card" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-card)"><path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM4 12H20V8H4V12Z" fill="#1A1A1A"/></g></svg>`,
  'calendar': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-calendar" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-calendar)"><path d="M17 2.0127C17.2802 2.0127 17.5149 2.10669 17.7041 2.2959C17.8933 2.48511 17.9873 2.71981 17.9873 3V4.0127H19C19.5467 4.0127 20.014 4.20734 20.4033 4.59668C20.7927 4.98602 20.9873 5.45334 20.9873 6V20C20.9873 20.5467 20.7927 21.014 20.4033 21.4033C20.014 21.7927 19.5467 21.9873 19 21.9873H5C4.45334 21.9873 3.98602 21.7927 3.59668 21.4033C3.20734 21.014 3.0127 20.5467 3.0127 20V6C3.0127 5.45334 3.20734 4.98602 3.59668 4.59668C3.98602 4.20734 4.45334 4.0127 5 4.0127H6.0127V3C6.0127 2.71981 6.10669 2.48511 6.2959 2.2959C6.48511 2.10669 6.71981 2.0127 7 2.0127C7.28019 2.0127 7.51489 2.10669 7.7041 2.2959C7.89331 2.48511 7.9873 2.71981 7.9873 3V4.0127H16.0127V3C16.0127 2.71981 16.1067 2.48511 16.2959 2.2959C16.4851 2.10669 16.7198 2.0127 17 2.0127ZM4.9873 20.0127H19.0127V9.9873H4.9873V20.0127ZM8 16.0127C8.28019 16.0127 8.51489 16.1067 8.7041 16.2959C8.89331 16.4851 8.9873 16.7198 8.9873 17C8.9873 17.2802 8.89331 17.5149 8.7041 17.7041C8.51489 17.8933 8.28019 17.9873 8 17.9873C7.71981 17.9873 7.48511 17.8933 7.2959 17.7041C7.10669 17.5149 7.0127 17.2802 7.0127 17C7.0127 16.7198 7.10669 16.4851 7.2959 16.2959C7.48511 16.1067 7.71981 16.0127 8 16.0127ZM12 16.0127C12.2802 16.0127 12.5149 16.1067 12.7041 16.2959C12.8933 16.4851 12.9873 16.7198 12.9873 17C12.9873 17.2802 12.8933 17.5149 12.7041 17.7041C12.5149 17.8933 12.2802 17.9873 12 17.9873C11.7198 17.9873 11.4851 17.8933 11.2959 17.7041C11.1067 17.5149 11.0127 17.2802 11.0127 17C11.0127 16.7198 11.1067 16.4851 11.2959 16.2959C11.4851 16.1067 11.7198 16.0127 12 16.0127ZM16 16.0127C16.2802 16.0127 16.5149 16.1067 16.7041 16.2959C16.8933 16.4851 16.9873 16.7198 16.9873 17C16.9873 17.2802 16.8933 17.5149 16.7041 17.7041C16.5149 17.8933 16.2802 17.9873 16 17.9873C15.7198 17.9873 15.4851 17.8933 15.2959 17.7041C15.1067 17.5149 15.0127 17.2802 15.0127 17C15.0127 16.7198 15.1067 16.4851 15.2959 16.2959C15.4851 16.1067 15.7198 16.0127 16 16.0127ZM8 12.0127C8.28019 12.0127 8.51489 12.1067 8.7041 12.2959C8.89331 12.4851 8.9873 12.7198 8.9873 13C8.9873 13.2802 8.89331 13.5149 8.7041 13.7041C8.51489 13.8933 8.28019 13.9873 8 13.9873C7.71981 13.9873 7.48511 13.8933 7.2959 13.7041C7.10669 13.5149 7.0127 13.2802 7.0127 13C7.0127 12.7198 7.10669 12.4851 7.2959 12.2959C7.48511 12.1067 7.71981 12.0127 8 12.0127ZM12 12.0127C12.2802 12.0127 12.5149 12.1067 12.7041 12.2959C12.8933 12.4851 12.9873 12.7198 12.9873 13C12.9873 13.2802 12.8933 13.5149 12.7041 13.7041C12.5149 13.8933 12.2802 13.9873 12 13.9873C11.7198 13.9873 11.4851 13.8933 11.2959 13.7041C11.1067 13.5149 11.0127 13.2802 11.0127 13C11.0127 12.7198 11.1067 12.4851 11.2959 12.2959C11.4851 12.1067 11.7198 12.0127 12 12.0127ZM16 12.0127C16.2802 12.0127 16.5149 12.1067 16.7041 12.2959C16.8933 12.4851 16.9873 12.7198 16.9873 13C16.9873 13.2802 16.8933 13.5149 16.7041 13.7041C16.5149 13.8933 16.2802 13.9873 16 13.9873C15.7198 13.9873 15.4851 13.8933 15.2959 13.7041C15.1067 13.5149 15.0127 13.2802 15.0127 13C15.0127 12.7198 15.1067 12.4851 15.2959 12.2959C15.4851 12.1067 15.7198 12.0127 16 12.0127Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'camera': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-camera" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-camera)"><path d="M14.9951 3.0127L16.8408 5.00879L16.8369 5.0127H20C20.5467 5.0127 21.014 5.20734 21.4033 5.59668C21.7927 5.98602 21.9873 6.45334 21.9873 7V19C21.9873 19.5467 21.7927 20.014 21.4033 20.4033C21.014 20.7927 20.5467 20.9873 20 20.9873H4C3.45334 20.9873 2.98602 20.7927 2.59668 20.4033C2.20734 20.014 2.0127 19.5467 2.0127 19V7C2.0127 6.45334 2.20734 5.98602 2.59668 5.59668C2.98602 5.20734 3.45334 5.0127 4 5.0127H7.15039V5.01855L7.15918 5.00879L9.00488 3.0127H14.9951ZM9.86621 4.99121L8.04492 6.9873H3.9873V19.0127H20.0127V6.9873H15.9551L14.1338 4.99121L14.1387 4.9873H9.875V4.98145L9.86621 4.99121ZM12 8.5127C13.2467 8.5127 14.3061 8.94866 15.1787 9.82129C16.0513 10.6939 16.4873 11.7533 16.4873 13C16.4873 14.2467 16.0513 15.3061 15.1787 16.1787C14.3061 17.0513 13.2467 17.4873 12 17.4873C10.7533 17.4873 9.69392 17.0513 8.82129 16.1787C7.94866 15.3061 7.5127 14.2467 7.5127 13C7.5127 11.7533 7.94866 10.6939 8.82129 9.82129C9.69392 8.94866 10.7533 8.5127 12 8.5127ZM12 10.4873C11.2968 10.4873 10.7016 10.7301 10.2158 11.2158C9.73008 11.7016 9.4873 12.2968 9.4873 13C9.4873 13.7032 9.73008 14.2984 10.2158 14.7842C10.7016 15.2699 11.2968 15.5127 12 15.5127C12.7032 15.5127 13.2984 15.2699 13.7842 14.7842C14.2699 14.2984 14.5127 13.7032 14.5127 13C14.5127 12.2968 14.2699 11.7016 13.7842 11.2158C13.2984 10.7301 12.7032 10.4873 12 10.4873Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'cancel': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-cancel" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-cancel)"><path d="M17.5999 5.43768C17.8802 5.43768 18.1105 5.52841 18.2913 5.70917C18.4718 5.88981 18.5627 6.11952 18.5627 6.3996C18.5627 6.6799 18.472 6.91026 18.2913 7.091L13.3821 12.0002L13.3909 12.009L18.2913 16.9084C18.472 17.0891 18.5627 17.3195 18.5627 17.5998C18.5627 17.8801 18.472 18.1104 18.2913 18.2912C18.1105 18.472 17.8802 18.5627 17.5999 18.5627C17.3196 18.5626 17.0892 18.4719 16.9084 18.2912L12.009 13.3908L12.0002 13.382L7.09106 18.2912C6.91032 18.4719 6.67996 18.5627 6.39966 18.5627C6.11958 18.5626 5.88988 18.4717 5.70923 18.2912C5.52847 18.1104 5.43774 17.8801 5.43774 17.5998C5.43779 17.3195 5.52851 17.0891 5.70923 16.9084L10.6174 12.0002L10.6086 11.9914L5.70923 7.091C5.52847 6.91024 5.43774 6.67995 5.43774 6.3996C5.43783 6.11942 5.52855 5.88984 5.70923 5.70917C5.8899 5.52849 6.11948 5.43777 6.39966 5.43768C6.68001 5.43768 6.9103 5.52841 7.09106 5.70917L11.9915 10.6086L12.0002 10.6174L16.9084 5.70917C17.0892 5.52845 17.3196 5.43773 17.5999 5.43768Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'check': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-check" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-check)"><path d="M18.7372 6.41272C19.026 6.41272 19.2606 6.50352 19.4413 6.6842C19.6218 6.86482 19.7127 7.09873 19.7128 7.38733C19.7128 7.67613 19.622 7.91074 19.4413 8.09143L10.2411 17.2916C10.1423 17.3904 10.0354 17.4597 9.92078 17.5006C9.80556 17.5418 9.68169 17.5621 9.54968 17.5621C9.4179 17.5621 9.29461 17.5417 9.17957 17.5006C9.06503 17.4597 8.95801 17.3903 8.85925 17.2916L4.55847 12.9908C4.37814 12.8103 4.29144 12.5762 4.29968 12.2877C4.30797 11.9989 4.40311 11.7644 4.58386 11.5836C4.7646 11.4029 4.99497 11.3121 5.27527 11.3121C5.55552 11.3122 5.78597 11.4029 5.96667 11.5836L9.54089 15.1588L9.54968 15.1676L9.55847 15.1588L18.0341 6.6842C18.2147 6.50359 18.4485 6.41279 18.7372 6.41272Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'contact': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-contact" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-contact)"><path d="M5 18.85C5.9 17.9667 6.94583 17.2708 8.1375 16.7625C9.32917 16.2542 10.6167 16 12 16C13.3833 16 14.6708 16.2542 15.8625 16.7625C17.0542 17.2708 18.1 17.9667 19 18.85V6H5V18.85ZM12 14C11.0333 14 10.2083 13.6583 9.525 12.975C8.84167 12.2917 8.5 11.4667 8.5 10.5C8.5 9.53333 8.84167 8.70833 9.525 8.025C10.2083 7.34167 11.0333 7 12 7C12.9667 7 13.7917 7.34167 14.475 8.025C15.1583 8.70833 15.5 9.53333 15.5 10.5C15.5 11.4667 15.1583 12.2917 14.475 12.975C13.7917 13.6583 12.9667 14 12 14ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V3C6 2.71667 6.09583 2.47917 6.2875 2.2875C6.47917 2.09583 6.71667 2 7 2C7.28333 2 7.52083 2.09583 7.7125 2.2875C7.90417 2.47917 8 2.71667 8 3V4H16V3C16 2.71667 16.0958 2.47917 16.2875 2.2875C16.4792 2.09583 16.7167 2 17 2C17.2833 2 17.5208 2.09583 17.7125 2.2875C17.9042 2.47917 18 2.71667 18 3V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H5Z" fill="#1A1A1A"/></g></svg>`,
  'contact photo': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill="#00697F"/><rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#E6E6E6"/><path d="M11.2808 7.48H12.7448L15.9848 16H14.2808L13.4888 13.876H10.5128L9.73275 16H8.02875L11.2808 7.48ZM13.1888 12.712L12.0128 9.364L10.7888 12.712H13.1888Z" fill="white"/></svg>`,
  'copy': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="icon-mask-copy" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#icon-mask-copy)"><path d="M9 18C8.45 18 7.97917 17.8042 7.5875 17.4125C7.19583 17.0208 7 16.55 7 16V4C7 3.45 7.19583 2.97917 7.5875 2.5875C7.97917 2.19583 8.45 2 9 2H18C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V16C20 16.55 19.8042 17.0208 19.4125 17.4125C19.0208 17.8042 18.55 18 18 18H9ZM5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V7C3 6.71667 3.09583 6.47917 3.2875 6.2875C3.47917 6.09583 3.71667 6 4 6C4.28333 6 4.52083 6.09583 4.7125 6.2875C4.90417 6.47917 5 6.71667 5 7V20H15C15.2833 20 15.5208 20.0958 15.7125 20.2875C15.9042 20.4792 16 20.7167 16 21C16 21.2833 15.9042 21.5208 15.7125 21.7125C15.5208 21.9042 15.2833 22 15 22H5Z" fill="#1A1A1A"/></g></svg>`,
  'search': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_15_3974\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<rect width=\"24\" height=\"24\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_15_3974)\">\n<path d=\"M9.5 3.0127C11.3134 3.0127 12.8476 3.64055 14.1035 4.89648C15.3595 6.15242 15.9873 7.68657 15.9873 9.5C15.9873 10.2318 15.8714 10.9219 15.6387 11.5703C15.4058 12.219 15.0894 12.7932 14.6904 13.292L14.6836 13.3008L20.3164 18.9336C20.4972 19.1144 20.5878 19.3363 20.5879 19.5996C20.5879 19.8627 20.4888 20.0932 20.291 20.291C20.1103 20.4718 19.88 20.5625 19.5996 20.5625C19.3195 20.5624 19.0898 20.4716 18.9092 20.291L13.3086 14.6914L13.3008 14.6836L13.292 14.6904C12.7932 15.0894 12.219 15.4058 11.5703 15.6387C10.9219 15.8714 10.2318 15.9873 9.5 15.9873C7.68657 15.9873 6.15242 15.3595 4.89648 14.1035C3.64055 12.8476 3.0127 11.3134 3.0127 9.5C3.0127 7.68657 3.64055 6.15242 4.89648 4.89648C6.15242 3.64055 7.68657 3.0127 9.5 3.0127ZM9.5 4.9873C8.24672 4.9873 7.18108 5.42634 6.30371 6.30371C5.42634 7.18108 4.9873 8.24672 4.9873 9.5C4.9873 10.7533 5.42634 11.8189 6.30371 12.6963C7.18108 13.5737 8.24672 14.0127 9.5 14.0127C10.7533 14.0127 11.8189 13.5737 12.6963 12.6963C13.5737 11.8189 14.0127 10.7533 14.0127 9.5C14.0127 8.24672 13.5737 7.18108 12.6963 6.30371C11.8189 5.42634 10.7533 4.9873 9.5 4.9873Z\" fill=\"#1A1A1A\" stroke=\"#1A1A1A\" stroke-width=\"0.025\"/>\n</g>\n</svg>\n',
  'sender': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_15_3980\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<rect width=\"24\" height=\"24\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_15_3980)\">\n<path d=\"M11 11.825V21C11 21.2833 11.0958 21.5208 11.2875 21.7125C11.4792 21.9042 11.7167 22 12 22C12.2833 22 12.5208 21.9042 12.7125 21.7125C12.9042 21.5208 13 21.2833 13 21V11.825L14.9 13.7C15.0833 13.8833 15.3125 13.9792 15.5875 13.9875C15.8625 13.9958 16.1 13.9 16.3 13.7C16.4833 13.5167 16.575 13.2833 16.575 13C16.575 12.7167 16.4833 12.4833 16.3 12.3L12.7 8.7C12.5 8.5 12.2667 8.4 12 8.4C11.7333 8.4 11.5 8.5 11.3 8.7L7.7 12.3C7.51667 12.4833 7.42083 12.7125 7.4125 12.9875C7.40417 13.2625 7.5 13.5 7.7 13.7C7.88333 13.8833 8.11667 13.975 8.4 13.975C8.68333 13.975 8.91667 13.8833 9.1 13.7L11 11.825ZM12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 12.55 4.05417 13.0917 4.1625 13.625C4.27083 14.1583 4.43333 14.675 4.65 15.175C4.76667 15.4583 4.80417 15.7417 4.7625 16.025C4.72083 16.3083 4.59167 16.5583 4.375 16.775C4.175 16.975 3.92917 17.0208 3.6375 16.9125C3.34583 16.8042 3.125 16.5917 2.975 16.275C2.65833 15.5917 2.41667 14.8958 2.25 14.1875C2.08333 13.4792 2 12.75 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 12.75 21.9208 13.4875 21.7625 14.2125C21.6042 14.9375 21.3583 15.6417 21.025 16.325C20.875 16.625 20.6542 16.825 20.3625 16.925C20.0708 17.025 19.825 16.975 19.625 16.775C19.425 16.575 19.2958 16.3333 19.2375 16.05C19.1792 15.7667 19.2083 15.4917 19.325 15.225C19.5583 14.7083 19.7292 14.1792 19.8375 13.6375C19.9458 13.0958 20 12.55 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4Z\" fill=\"#1A1A1A\"/>\n</g>\n</svg>\n',
  'scan': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_15_3986\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<rect width=\"24\" height=\"24\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_15_3986)\">\n<path d=\"M3 7C2.71667 7 2.47917 6.90417 2.2875 6.7125C2.09583 6.52083 2 6.28333 2 6V3C2 2.71667 2.09583 2.47917 2.2875 2.2875C2.47917 2.09583 2.71667 2 3 2H6C6.28333 2 6.52083 2.09583 6.7125 2.2875C6.90417 2.47917 7 2.71667 7 3C7 3.28333 6.90417 3.52083 6.7125 3.7125C6.52083 3.90417 6.28333 4 6 4H4V6C4 6.28333 3.90417 6.52083 3.7125 6.7125C3.52083 6.90417 3.28333 7 3 7ZM3 22C2.71667 22 2.47917 21.9042 2.2875 21.7125C2.09583 21.5208 2 21.2833 2 21V18C2 17.7167 2.09583 17.4792 2.2875 17.2875C2.47917 17.0958 2.71667 17 3 17C3.28333 17 3.52083 17.0958 3.7125 17.2875C3.90417 17.4792 4 17.7167 4 18V20H6C6.28333 20 6.52083 20.0958 6.7125 20.2875C6.90417 20.4792 7 20.7167 7 21C7 21.2833 6.90417 21.5208 6.7125 21.7125C6.52083 21.9042 6.28333 22 6 22H3ZM18 22C17.7167 22 17.4792 21.9042 17.2875 21.7125C17.0958 21.5208 17 21.2833 17 21C17 20.7167 17.0958 20.4792 17.2875 20.2875C17.4792 20.0958 17.7167 20 18 20H20V18C20 17.7167 20.0958 17.4792 20.2875 17.2875C20.4792 17.0958 20.7167 17 21 17C21.2833 17 21.5208 17.0958 21.7125 17.2875C21.9042 17.4792 22 17.7167 22 18V21C22 21.2833 21.9042 21.5208 21.7125 21.7125C21.5208 21.9042 21.2833 22 21 22H18ZM21 7C20.7167 7 20.4792 6.90417 20.2875 6.7125C20.0958 6.52083 20 6.28333 20 6V4H18C17.7167 4 17.4792 3.90417 17.2875 3.7125C17.0958 3.52083 17 3.28333 17 3C17 2.71667 17.0958 2.47917 17.2875 2.2875C17.4792 2.09583 17.7167 2 18 2H21C21.2833 2 21.5208 2.09583 21.7125 2.2875C21.9042 2.47917 22 2.71667 22 3V6C22 6.28333 21.9042 6.52083 21.7125 6.7125C21.5208 6.90417 21.2833 7 21 7ZM17.5 17.5H19V19H17.5V17.5ZM17.5 14.5H19V16H17.5V14.5ZM16 16H17.5V17.5H16V16ZM14.5 17.5H16V19H14.5V17.5ZM13 16H14.5V17.5H13V16ZM16 13H17.5V14.5H16V13ZM14.5 14.5H16V16H14.5V14.5ZM13 13H14.5V14.5H13V13ZM19 5V11H13V5H19ZM11 13V19H5V13H11ZM11 5V11H5V5H11ZM9.5 17.5V14.5H6.5V17.5H9.5ZM9.5 9.5V6.5H6.5V9.5H9.5ZM17.5 9.5V6.5H14.5V9.5H17.5Z\" fill=\"#1A1A1A\"/>\n</g>\n</svg>\n',
  'school': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_1218_3199\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<rect width=\"24\" height=\"24\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_1218_3199)\">\n<path d=\"M6.05001 17.7749C5.71668 17.5916 5.45835 17.3457 5.27501 17.0374C5.09168 16.7291 5.00001 16.3832 5.00001 15.9999V11.1999L2.60001 9.8749C2.41668 9.7749 2.28335 9.6499 2.20001 9.4999C2.11668 9.3499 2.07501 9.18324 2.07501 8.9999C2.07501 8.81657 2.11668 8.6499 2.20001 8.4999C2.28335 8.3499 2.41668 8.2249 2.60001 8.1249L11.05 3.5249C11.2 3.44157 11.3542 3.37907 11.5125 3.3374C11.6708 3.29574 11.8333 3.2749 12 3.2749C12.1667 3.2749 12.3292 3.29574 12.4875 3.3374C12.6458 3.37907 12.8 3.44157 12.95 3.5249L22.475 8.7249C22.6417 8.80824 22.7708 8.92907 22.8625 9.0874C22.9542 9.24574 23 9.41657 23 9.5999V15.9999C23 16.2832 22.9042 16.5207 22.7125 16.7124C22.5208 16.9041 22.2833 16.9999 22 16.9999C21.7167 16.9999 21.4792 16.9041 21.2875 16.7124C21.0958 16.5207 21 16.2832 21 15.9999V10.0999L19 11.1999V15.9999C19 16.3832 18.9083 16.7291 18.725 17.0374C18.5417 17.3457 18.2833 17.5916 17.95 17.7749L12.95 20.4749C12.8 20.5582 12.6458 20.6207 12.4875 20.6624C12.3292 20.7041 12.1667 20.7249 12 20.7249C11.8333 20.7249 11.6708 20.7041 11.5125 20.6624C11.3542 20.6207 11.2 20.5582 11.05 20.4749L6.05001 17.7749ZM12 12.6999L18.85 8.9999L12 5.2999L5.15001 8.9999L12 12.6999ZM12 18.7249L17 16.0249V12.2499L12.975 14.4749C12.825 14.5582 12.6667 14.6207 12.5 14.6624C12.3333 14.7041 12.1667 14.7249 12 14.7249C11.8333 14.7249 11.6667 14.7041 11.5 14.6624C11.3333 14.6207 11.175 14.5582 11.025 14.4749L7.00001 12.2499V16.0249L12 18.7249Z\" fill=\"#1A1A1A\"/>\n</g>\n</svg>\n',
  'setting': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_15_3992\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<path d=\"M0 0H24V24H0V0Z\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_15_3992)\">\n<path d=\"M9.25001 22L8.85001 18.8C8.63335 18.7167 8.42918 18.6167 8.23751 18.5C8.04585 18.3833 7.85835 18.2583 7.67501 18.125L4.70001 19.375L1.95001 14.625L4.52501 12.675C4.50835 12.5583 4.50001 12.4458 4.50001 12.3375V11.6625C4.50001 11.5542 4.50835 11.4417 4.52501 11.325L1.95001 9.375L4.70001 4.625L7.67501 5.875C7.85835 5.74167 8.05001 5.61667 8.25001 5.5C8.45001 5.38333 8.65001 5.28333 8.85001 5.2L9.25001 2H14.75L15.15 5.2C15.3667 5.28333 15.5708 5.38333 15.7625 5.5C15.9542 5.61667 16.1417 5.74167 16.325 5.875L19.3 4.625L22.05 9.375L19.475 11.325C19.4917 11.4417 19.5 11.5542 19.5 11.6625V12.3375C19.5 12.4458 19.4833 12.5583 19.45 12.675L22.025 14.625L19.275 19.375L16.325 18.125C16.1417 18.2583 15.95 18.3833 15.75 18.5C15.55 18.6167 15.35 18.7167 15.15 18.8L14.75 22H9.25001ZM12.05 15.5C13.0167 15.5 13.8417 15.1583 14.525 14.475C15.2083 13.7917 15.55 12.9667 15.55 12C15.55 11.0333 15.2083 10.2083 14.525 9.525C13.8417 8.84167 13.0167 8.5 12.05 8.5C11.0667 8.5 10.2375 8.84167 9.56251 9.525C8.88751 10.2083 8.55001 11.0333 8.55001 12C8.55001 12.9667 8.88751 13.7917 9.56251 14.475C10.2375 15.1583 11.0667 15.5 12.05 15.5ZM12.05 13.5C11.6333 13.5 11.2792 13.3542 10.9875 13.0625C10.6958 12.7708 10.55 12.4167 10.55 12C10.55 11.5833 10.6958 11.2292 10.9875 10.9375C11.2792 10.6458 11.6333 10.5 12.05 10.5C12.4667 10.5 12.8208 10.6458 13.1125 10.9375C13.4042 11.2292 13.55 11.5833 13.55 12C13.55 12.4167 13.4042 12.7708 13.1125 13.0625C12.8208 13.3542 12.4667 13.5 12.05 13.5ZM11 20H12.975L13.325 17.35C13.8417 17.2167 14.3208 17.0208 14.7625 16.7625C15.2042 16.5042 15.6083 16.1917 15.975 15.825L18.45 16.85L19.425 15.15L17.275 13.525C17.3583 13.2917 17.4167 13.0458 17.45 12.7875C17.4833 12.5292 17.5 12.2667 17.5 12C17.5 11.7333 17.4833 11.4708 17.45 11.2125C17.4167 10.9542 17.3583 10.7083 17.275 10.475L19.425 8.85L18.45 7.15L15.975 8.2C15.6083 7.81667 15.2042 7.49583 14.7625 7.2375C14.3208 6.97917 13.8417 6.78333 13.325 6.65L13 4H11.025L10.675 6.65C10.1583 6.78333 9.67918 6.97917 9.23751 7.2375C8.79585 7.49583 8.39168 7.80833 8.02501 8.175L5.55001 7.15L4.57501 8.85L6.72501 10.45C6.64168 10.7 6.58335 10.95 6.55001 11.2C6.51668 11.45 6.50001 11.7167 6.50001 12C6.50001 12.2667 6.51668 12.525 6.55001 12.775C6.58335 13.025 6.64168 13.275 6.72501 13.525L4.57501 15.15L5.55001 16.85L8.02501 15.8C8.39168 16.1833 8.79585 16.5042 9.23751 16.7625C9.67918 17.0208 10.1583 17.2167 10.675 17.35L11 20Z\" fill=\"#1A1A1A\"/>\n</g>\n</svg>\n',
  'sell': '<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<mask id=\"mask0_1218_3183\" style=\"mask-type:alpha\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"24\" height=\"24\">\n<path d=\"M0 0H24V24H0V0Z\" fill=\"#D9D9D9\"/>\n</mask>\n<g mask=\"url(#mask0_1218_3183)\">\n<path d=\"M21.4 14.25L14.25 21.4C14.05 21.6 13.825 21.75 13.575 21.85C13.325 21.95 13.075 22 12.825 22C12.575 22 12.325 21.95 12.075 21.85C11.825 21.75 11.6 21.6 11.4 21.4L2.575 12.575C2.39167 12.3917 2.25 12.1792 2.15 11.9375C2.05 11.6958 2 11.4417 2 11.175V4C2 3.45 2.19583 2.97917 2.5875 2.5875C2.97917 2.19583 3.45 2 4 2H11.175C11.4417 2 11.7 2.05417 11.95 2.1625C12.2 2.27083 12.4167 2.41667 12.6 2.6L21.4 11.425C21.6 11.625 21.7458 11.85 21.8375 12.1C21.9292 12.35 21.975 12.6 21.975 12.85C21.975 13.1 21.9292 13.3458 21.8375 13.5875C21.7458 13.8292 21.6 14.05 21.4 14.25ZM12.825 20L19.975 12.85L11.15 4H4V11.15L12.825 20ZM6.5 8C6.91667 8 7.27083 7.85417 7.5625 7.5625C7.85417 7.27083 8 6.91667 8 6.5C8 6.08333 7.85417 5.72917 7.5625 5.4375C7.27083 5.14583 6.91667 5 6.5 5C6.08333 5 5.72917 5.14583 5.4375 5.4375C5.14583 5.72917 5 6.08333 5 6.5C5 6.91667 5.14583 7.27083 5.4375 7.5625C5.72917 7.85417 6.08333 8 6.5 8Z\" fill=\"#1A1A1A\"/>\n</g>\n</svg>\n',
  'share': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4004" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4004)"><path d="M18 2.0127C18.8301 2.0127 19.5352 2.30283 20.1162 2.88379C20.6972 3.46475 20.9873 4.16994 20.9873 5C20.9873 5.83006 20.6972 6.53525 20.1162 7.11621C19.5352 7.69717 18.8301 7.9873 18 7.9873C17.6182 7.9873 17.2528 7.91742 16.9043 7.77637C16.5557 7.63524 16.2402 7.43945 15.958 7.19043L15.9512 7.18457L15.9434 7.18945L8.89355 11.2891L8.88477 11.2939L8.8877 11.3037C8.9207 11.4027 8.94631 11.5145 8.96289 11.6387C8.97949 11.7632 8.9873 11.8839 8.9873 12C8.9873 12.1161 8.97949 12.2368 8.96289 12.3613C8.94631 12.4855 8.9207 12.5973 8.8877 12.6963L8.88477 12.7061L8.89355 12.7109L15.9434 16.8105L15.9512 16.8154L15.958 16.8096C16.2402 16.5605 16.5557 16.3648 16.9043 16.2236C17.2528 16.0826 17.6182 16.0127 18 16.0127C18.8301 16.0127 19.5352 16.3028 20.1162 16.8838C20.6972 17.4648 20.9873 18.1699 20.9873 19C20.9873 19.8301 20.6972 20.5352 20.1162 21.1162C19.5352 21.6972 18.8301 21.9873 18 21.9873C17.1699 21.9873 16.4648 21.6972 15.8838 21.1162C15.3028 20.5352 15.0127 19.8301 15.0127 19C15.0127 18.8839 15.0205 18.7632 15.0371 18.6387C15.0537 18.5145 15.0793 18.4027 15.1123 18.3037L15.1152 18.2939L15.1064 18.2891L8.05664 14.1895L8.04883 14.1846L8.04199 14.1904C7.75977 14.4395 7.44432 14.6352 7.0957 14.7764C6.74722 14.9174 6.38175 14.9873 6 14.9873C5.16994 14.9873 4.46475 14.6972 3.88379 14.1162C3.30283 13.5352 3.0127 12.8301 3.0127 12C3.0127 11.1699 3.30283 10.4648 3.88379 9.88379C4.46475 9.30283 5.16994 9.0127 6 9.0127C6.38175 9.0127 6.74722 9.08258 7.0957 9.22363C7.44432 9.36476 7.75977 9.56055 8.04199 9.80957L8.04883 9.81543L8.05664 9.81055L15.1064 5.71094L15.1152 5.70605L15.1123 5.69629C15.0793 5.59728 15.0537 5.48552 15.0371 5.36133C15.0205 5.23683 15.0127 5.11607 15.0127 5C15.0127 4.16994 15.3028 3.46475 15.8838 2.88379C16.4648 2.30283 17.1699 2.0127 18 2.0127Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'shop': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4010" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4010)"><path d="M5.02497 21C4.47497 21 4.00413 20.8042 3.61247 20.4125C3.2208 20.0208 3.02497 19.55 3.02497 19V11.05C2.64163 10.7 2.3458 10.25 2.13747 9.7C1.92913 9.15 1.92497 8.55 2.12497 7.9L3.17497 4.5C3.3083 4.06667 3.5458 3.70833 3.88747 3.425C4.22913 3.14167 4.62497 3 5.07497 3H18.975C19.425 3 19.8166 3.1375 20.15 3.4125C20.4833 3.6875 20.725 4.05 20.875 4.5L21.925 7.9C22.125 8.55 22.1208 9.14167 21.9125 9.675C21.7041 10.2083 21.4083 10.6667 21.025 11.05V19C21.025 19.55 20.8291 20.0208 20.4375 20.4125C20.0458 20.8042 19.575 21 19.025 21H5.02497ZM14.225 10C14.675 10 15.0166 9.84583 15.25 9.5375C15.4833 9.22917 15.575 8.88333 15.525 8.5L14.975 5H13.025V8.7C13.025 9.05 13.1416 9.35417 13.375 9.6125C13.6083 9.87083 13.8916 10 14.225 10ZM9.72497 10C10.1083 10 10.4208 9.87083 10.6625 9.6125C10.9041 9.35417 11.025 9.05 11.025 8.7V5H9.07497L8.52497 8.5C8.4583 8.9 8.5458 9.25 8.78747 9.55C9.02913 9.85 9.34163 10 9.72497 10ZM5.27497 10C5.57497 10 5.83747 9.89167 6.06247 9.675C6.28747 9.45833 6.42497 9.18333 6.47497 8.85L7.02497 5H5.07497L4.07497 8.35C3.97497 8.68333 4.02913 9.04167 4.23747 9.425C4.4458 9.80833 4.79163 10 5.27497 10ZM18.775 10C19.2583 10 19.6083 9.80833 19.825 9.425C20.0416 9.04167 20.0916 8.68333 19.975 8.35L18.925 5H17.025L17.575 8.85C17.625 9.18333 17.7625 9.45833 17.9875 9.675C18.2125 9.89167 18.475 10 18.775 10ZM5.02497 19H19.025V11.95C18.9416 11.9833 18.8875 12 18.8625 12H18.775C18.325 12 17.9291 11.925 17.5875 11.775C17.2458 11.625 16.9083 11.3833 16.575 11.05C16.275 11.35 15.9333 11.5833 15.55 11.75C15.1666 11.9167 14.7583 12 14.325 12C13.875 12 13.4541 11.9167 13.0625 11.75C12.6708 11.5833 12.325 11.35 12.025 11.05C11.7416 11.35 11.4125 11.5833 11.0375 11.75C10.6625 11.9167 10.2583 12 9.82497 12C9.34163 12 8.90413 11.9167 8.51247 11.75C8.1208 11.5833 7.77497 11.35 7.47497 11.05C7.12497 11.4 6.77913 11.6458 6.43747 11.7875C6.0958 11.9292 5.7083 12 5.27497 12H5.16247C5.1208 12 5.07497 11.9833 5.02497 11.95V19Z" fill="#1A1A1A"/></g></svg>`,
  'star': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4022" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4022)"><path d="M12 4.58789C12.1809 4.58789 12.3579 4.6373 12.5312 4.73633C12.7035 4.83478 12.8307 4.98227 12.9131 5.17969L14.7881 9.62988L14.7998 9.625L14.7754 9.63574L14.7988 9.6377L19.6484 10.0625C19.8798 10.0956 20.0605 10.1698 20.1914 10.2842C20.323 10.3993 20.4223 10.5479 20.4883 10.7295C20.5541 10.9106 20.5666 11.0958 20.5254 11.2852C20.4946 11.4266 20.4294 11.5569 20.3291 11.6758L20.2168 11.791L16.542 14.9658L16.5498 14.9756L16.5322 14.9551L16.5381 14.9785L17.6377 19.7031C17.6871 19.9174 17.6707 20.1102 17.5889 20.2822C17.5064 20.4555 17.3906 20.5994 17.2422 20.7148C17.0942 20.8299 16.9214 20.8966 16.7236 20.9131C16.5267 20.9294 16.3374 20.8799 16.1562 20.7646L12.0068 18.2646L12 18.2754L12.0137 18.252L11.9932 18.2646L7.84375 20.7646C7.66262 20.8799 7.47329 20.9294 7.27637 20.9131C7.07864 20.8966 6.90579 20.8299 6.75781 20.7148C6.60946 20.5994 6.49362 20.4554 6.41113 20.2822C6.32926 20.1102 6.31288 19.9174 6.3623 19.7031L7.46191 14.9785L7.47656 14.9814L7.45801 14.9658L3.7832 11.791C3.61824 11.6425 3.51565 11.4739 3.47461 11.2852C3.43344 11.0958 3.44588 10.9106 3.51172 10.7295C3.57774 10.5479 3.677 10.3993 3.80859 10.2842C3.9068 10.1984 4.03293 10.1349 4.1875 10.0947L4.35156 10.0625L9.20117 9.6377L9.20215 9.65137L9.21191 9.62988L11.0869 5.17969C11.1693 4.98227 11.2965 4.83479 11.4688 4.73633C11.642 4.6373 11.8191 4.58789 12 4.58789ZM11.9883 8.12012L10.541 11.4873L6.89844 11.8125L6.87012 11.8154L6.8916 11.835L9.66113 14.2539L8.83789 17.8223L8.83105 17.8516L8.85645 17.8359L11.999 15.9395L15.1436 17.8613L15.1689 17.876L15.1621 17.8477L14.3379 14.2539L17.1084 11.8594L17.1309 11.8408L17.1016 11.8379L13.458 11.5127L12.0117 8.12012L12 8.09375L11.9883 8.12012Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'success': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4031" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path d="M0 0H24V24H0V0Z" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4031)"><path d="M12 2.0127C13.3817 2.0127 14.6805 2.27453 15.8955 2.79883C17.1106 3.32321 18.1677 4.03484 19.0664 4.93359C19.9652 5.83235 20.6768 6.88936 21.2012 8.10449C21.7255 9.31953 21.9873 10.6183 21.9873 12C21.9873 13.3817 21.7255 14.6805 21.2012 15.8955C20.6768 17.1106 19.9652 18.1677 19.0664 19.0664C18.1677 19.9652 17.1106 20.6768 15.8955 21.2012C14.6805 21.7255 13.3817 21.9873 12 21.9873C10.6183 21.9873 9.31953 21.7255 8.10449 21.2012C6.88936 20.6768 5.83235 19.9652 4.93359 19.0664C4.03484 18.1677 3.32321 17.1106 2.79883 15.8955C2.27453 14.6805 2.0127 13.3817 2.0127 12C2.0127 10.6183 2.27453 9.31953 2.79883 8.10449C3.32321 6.88936 4.03484 5.83235 4.93359 4.93359C5.83235 4.03484 6.88936 3.32321 8.10449 2.79883C9.31953 2.27453 10.6183 2.0127 12 2.0127ZM12 3.9873C9.76342 3.9873 7.8688 4.76401 6.31641 6.31641C4.76401 7.8688 3.9873 9.76342 3.9873 12C3.9873 14.2366 4.76401 16.1312 6.31641 17.6836C7.8688 19.236 9.76342 20.0127 12 20.0127C14.2366 20.0127 16.1312 19.236 17.6836 17.6836C19.236 16.1312 20.0127 14.2366 20.0127 12C20.0127 9.76342 19.236 7.8688 17.6836 6.31641C16.1312 4.76401 14.2366 3.9873 12 3.9873ZM16.25 8.58789C16.5303 8.58789 16.7607 8.6777 16.9414 8.8584C17.1221 9.03912 17.2128 9.26954 17.2129 9.5498C17.2129 9.83011 17.1221 10.0605 16.9414 10.2412L11.291 15.8916C11.0933 16.0892 10.8626 16.1875 10.5996 16.1875C10.3368 16.1874 10.1068 16.0891 9.90918 15.8916L7.05859 13.041C6.87796 12.8603 6.78711 12.6299 6.78711 12.3496C6.78719 12.0696 6.87811 11.8398 7.05859 11.6592C7.23935 11.4784 7.46964 11.3877 7.75 11.3877C8.03036 11.3877 8.26065 11.4784 8.44141 11.6592L10.5996 13.8174L15.5586 8.8584C15.7393 8.6777 15.9697 8.58789 16.25 8.58789Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'speaker': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4040" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4040)"><path d="M19 11.975C19 10.5917 18.6333 9.32917 17.9 8.1875C17.1667 7.04583 16.1833 6.19167 14.95 5.625C14.7 5.50833 14.5167 5.32917 14.4 5.0875C14.2833 4.84583 14.2667 4.6 14.35 4.35C14.45 4.08333 14.6292 3.89167 14.8875 3.775C15.1458 3.65833 15.4083 3.65833 15.675 3.775C17.2917 4.49167 18.5833 5.5875 19.55 7.0625C20.5167 8.5375 21 10.175 21 11.975C21 13.775 20.5167 15.4125 19.55 16.8875C18.5833 18.3625 17.2917 19.4583 15.675 20.175C15.4083 20.2917 15.1458 20.2917 14.8875 20.175C14.6292 20.0583 14.45 19.8667 14.35 19.6C14.2667 19.35 14.2833 19.1042 14.4 18.8625C14.5167 18.6208 14.7 18.4417 14.95 18.325C16.1833 17.7583 17.1667 16.9042 17.9 15.7625C18.6333 14.6208 19 13.3583 19 11.975ZM7 15H4C3.71667 15 3.47917 14.9042 3.2875 14.7125C3.09583 14.5208 3 14.2833 3 14V10C3 9.71667 3.09583 9.47917 3.2875 9.2875C3.47917 9.09583 3.71667 9 4 9H7L10.3 5.7C10.6167 5.38333 10.9792 5.3125 11.3875 5.4875C11.7958 5.6625 12 5.975 12 6.425V17.575C12 18.025 11.7958 18.3375 11.3875 18.5125C10.9792 18.6875 10.6167 18.6167 10.3 18.3L7 15ZM16.5 12C16.5 12.7 16.3417 13.3625 16.025 13.9875C15.7083 14.6125 15.2917 15.125 14.775 15.525C14.6083 15.625 14.4375 15.6292 14.2625 15.5375C14.0875 15.4458 14 15.3 14 15.1V8.85C14 8.65 14.0875 8.50417 14.2625 8.4125C14.4375 8.32083 14.6083 8.325 14.775 8.425C15.2917 8.84167 15.7083 9.36667 16.025 10C16.3417 10.6333 16.5 11.3 16.5 12Z" fill="#1A1A1A"/></g></svg>`,
  'sound': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4049" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4049)"><path d="M6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V14C4 13.45 4.19583 12.9792 4.5875 12.5875C4.97917 12.1958 5.45 12 6 12C6.55 12 7.02083 12.1958 7.4125 12.5875C7.80417 12.9792 8 13.45 8 14V18C8 18.55 7.80417 19.0208 7.4125 19.4125C7.02083 19.8042 6.55 20 6 20ZM12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18V6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6V18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20ZM18 20C17.45 20 16.9792 19.8042 16.5875 19.4125C16.1958 19.0208 16 18.55 16 18V11C16 10.45 16.1958 9.97917 16.5875 9.5875C16.9792 9.19583 17.45 9 18 9C18.55 9 19.0208 9.19583 19.4125 9.5875C19.8042 9.97917 20 10.45 20 11V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20Z" fill="#1A1A1A"/></g></svg>`,
  'storefront': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_396_1418" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_396_1418)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.025 11.028V18.978C21.025 19.528 20.8291 19.9989 20.4375 20.3905C20.0458 20.7822 19.575 20.978 19.025 20.978H15.71V20.9785H13.71V15.6069H10.3403V20.9785H8.34033V20.978H5.02497C4.47497 20.978 4.00413 20.7822 3.61247 20.3905C3.2208 19.9989 3.02497 19.528 3.02497 18.978V11.028C2.64163 10.678 2.3458 10.228 2.13747 9.67803C1.92913 9.12803 1.92497 8.52803 2.12497 7.87803L3.17497 4.47803C3.3083 4.04469 3.5458 3.68636 3.88747 3.40303C4.22913 3.11969 4.62497 2.97803 5.07497 2.97803H18.975C19.425 2.97803 19.8166 3.11553 20.15 3.39053C20.4833 3.66553 20.725 4.02803 20.875 4.47803L21.925 7.87803C22.125 8.52803 22.1208 9.11969 21.9125 9.65303C21.7041 10.1864 21.4083 10.6447 21.025 11.028ZM8.34033 18.978H5.02497V11.928C5.07497 11.9614 5.1208 11.978 5.16247 11.978H5.27497C5.7083 11.978 6.0958 11.9072 6.43747 11.7655C6.77913 11.6239 7.12497 11.378 7.47497 11.028C7.77497 11.328 8.1208 11.5614 8.51247 11.728C8.90413 11.8947 9.34163 11.978 9.82497 11.978C10.2583 11.978 10.6625 11.8947 11.0375 11.728C11.4125 11.5614 11.7416 11.328 12.025 11.028C12.325 11.328 12.6708 11.5614 13.0625 11.728C13.4541 11.8947 13.875 11.978 14.325 11.978C14.7583 11.978 15.1666 11.8947 15.55 11.728C15.9333 11.5614 16.275 11.328 16.575 11.028C16.9083 11.3614 17.2458 11.603 17.5875 11.753C17.9291 11.903 18.325 11.978 18.775 11.978H18.8625C18.8875 11.978 18.9416 11.9614 19.025 11.928V18.978H15.71V13.6069H8.34033V18.978ZM14.225 9.97803C14.675 9.97803 15.0166 9.82386 15.25 9.51553C15.4833 9.20719 15.575 8.86136 15.525 8.47803L14.975 4.97803H13.025V8.67803C13.025 9.02803 13.1416 9.33219 13.375 9.59053C13.6083 9.84886 13.8916 9.97803 14.225 9.97803ZM9.72497 9.97803C10.1083 9.97803 10.4208 9.84886 10.6625 9.59053C10.9041 9.33219 11.025 9.02803 11.025 8.67803V4.97803H9.07497L8.52497 8.47803C8.4583 8.87803 8.5458 9.22803 8.78747 9.52803C9.02913 9.82803 9.34163 9.97803 9.72497 9.97803ZM5.27497 9.97803C5.57497 9.97803 5.83747 9.86969 6.06247 9.65303C6.28747 9.43636 6.42497 9.16136 6.47497 8.82803L7.02497 4.97803H5.07497L4.07497 8.32803C3.97497 8.66136 4.02913 9.01969 4.23747 9.40303C4.4458 9.78636 4.79163 9.97803 5.27497 9.97803ZM18.775 9.97803C19.2583 9.97803 19.6083 9.78636 19.825 9.40303C20.0416 9.01969 20.0916 8.66136 19.975 8.32803L18.925 4.97803H17.025L17.575 8.82803C17.625 9.16136 17.7625 9.43636 17.9875 9.65303C18.2125 9.86969 18.475 9.97803 18.775 9.97803Z" fill="#1A1A1A"/></g></svg>`,
  'shield': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_413_965" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect x="0.5" y="0.5" width="23" height="23" fill="#D9D9D9" stroke="#00697F"/></mask><g mask="url(#mask0_413_965)"><path d="M19.9873 5.00781V11.0996C19.9873 13.6302 19.2342 15.9321 17.7275 18.0049C16.2214 20.0768 14.3123 21.4043 12 21.9873C9.68774 21.4043 7.77856 20.0768 6.27246 18.0049C4.76578 15.9321 4.0127 13.6302 4.0127 11.0996V5.00781L12 2.0127L19.9873 5.00781ZM18.0127 6.36621L18.0039 6.36328L12.0039 4.11328L12.0059 4.10938L11.9961 4.11328L5.99609 6.36328L5.9873 6.36621V11.0996C5.9873 13.1188 6.55468 14.9553 7.68945 16.6074C8.82417 18.2594 10.2599 19.3612 11.9961 19.9121L11.9951 19.915L12.0039 19.9121C13.7401 19.3612 15.1758 18.2594 16.3105 16.6074C17.4453 14.9553 18.0127 13.1188 18.0127 11.0996V6.36621Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'arrow': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4086" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path d="M0 0H24V24H0V0Z" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4086)"><path d="M12 4.43769C12.2804 4.43769 12.5106 4.52842 12.6914 4.70918L19.292 11.3098C19.3901 11.3916 19.46 11.4936 19.501 11.6164C19.5422 11.7401 19.5625 11.8682 19.5625 12.0002C19.5625 12.1319 19.542 12.2553 19.501 12.3703C19.46 12.485 19.3899 12.5927 19.291 12.6916L12.6914 19.2912C12.5106 19.472 12.2804 19.5627 12 19.5627C11.7196 19.5627 11.4894 19.472 11.3086 19.2912C11.1278 19.1104 11.0337 18.8801 11.0254 18.5998C11.0171 18.3196 11.1035 18.0891 11.2842 17.9084L16.2051 12.9875H5C4.71981 12.9875 4.48511 12.8925 4.2959 12.7033C4.107 12.5142 4.01274 12.2801 4.0127 12.0002C4.0127 11.7201 4.10676 11.4853 4.2959 11.2961C4.48511 11.1069 4.71981 11.0129 5 11.0129H16.2051L16.1836 10.9914L11.2842 6.09101C11.1036 5.9104 11.0172 5.68074 11.0254 5.40059C11.0336 5.12027 11.1279 4.88999 11.3086 4.70918C11.4894 4.52842 11.7196 4.43769 12 4.43769Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'favorite': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4144" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4144)"><path d="M16.5 2.66272C18.0636 2.66272 19.3685 3.18649 20.416 4.23401C21.4635 5.28152 21.9873 6.58647 21.9873 8.15002C21.9873 10.0633 21.2801 11.8186 19.8652 13.4166C18.449 15.0161 16.8416 16.6245 15.042 18.2408L13.3418 19.7906C12.9607 20.1552 12.5134 20.3375 12 20.3375C11.4866 20.3375 11.0393 20.1552 10.6582 19.7906L8.93359 18.2155C7.16723 16.5991 5.57115 14.9952 4.14648 13.4039C2.72347 11.8144 2.0127 10.0631 2.0127 8.15002C2.0127 6.58647 2.53647 5.28152 3.58398 4.23401C4.6315 3.18649 5.93645 2.66272 7.5 2.66272C8.38142 2.66272 9.21258 2.85013 9.99414 3.22424C10.7759 3.5985 11.4414 4.1098 11.9902 4.75842L12 4.76917L12.0098 4.75842C12.5586 4.1098 13.2241 3.5985 14.0059 3.22424C14.7874 2.85013 15.6186 2.66272 16.5 2.66272ZM16.5 4.63733C15.7147 4.63733 15.0456 4.81747 14.4932 5.17737C13.9416 5.53676 13.4234 6.05858 12.9395 6.7428C12.8239 6.90784 12.6841 7.03159 12.5195 7.11389C12.3546 7.19637 12.1814 7.23792 12 7.23792C11.8186 7.23792 11.6454 7.19637 11.4805 7.11389C11.3159 7.03159 11.1761 6.90784 11.0605 6.7428C10.5766 6.05858 10.0584 5.53676 9.50684 5.17737C8.95444 4.81747 8.28528 4.63733 7.5 4.63733C6.49691 4.63733 5.66038 4.97207 4.99121 5.64124C4.32205 6.3104 3.9873 7.14693 3.9873 8.15002C3.9873 9.01972 4.29654 9.9432 4.91406 10.9196C5.53111 11.8951 6.26925 12.8414 7.12793 13.7584C7.98653 14.6754 8.87065 15.5343 9.7793 16.3346C10.6874 17.1344 11.4247 17.7927 11.9912 18.3092L12 18.317L12.0088 18.3092C12.5753 17.7927 13.3126 17.1344 14.2207 16.3346C15.1293 15.5343 16.0135 14.6754 16.8721 13.7584C17.7308 12.8414 18.4689 11.8951 19.0859 10.9196C19.7035 9.9432 20.0127 9.01972 20.0127 8.15002C20.0127 7.14693 19.678 6.3104 19.0088 5.64124C18.3396 4.97207 17.5031 4.63733 16.5 4.63733Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'failed': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_15_4151" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><path d="M0 0H24V24H0V0Z" fill="#D9D9D9"/></mask><g mask="url(#mask0_15_4151)"><path d="M12 2.0127C13.3817 2.0127 14.6805 2.27453 15.8955 2.79883C17.1106 3.32321 18.1677 4.03484 19.0664 4.93359C19.9652 5.83235 20.6768 6.88936 21.2012 8.10449C21.7255 9.31953 21.9873 10.6183 21.9873 12C21.9873 13.3817 21.7255 14.6805 21.2012 15.8955C20.6768 17.1106 19.9652 18.1677 19.0664 19.0664C18.1677 19.9652 17.1106 20.6768 15.8955 21.2012C14.6805 21.7255 13.3817 21.9873 12 21.9873C10.6183 21.9873 9.31953 21.7255 8.10449 21.2012C6.88936 20.6768 5.83235 19.9652 4.93359 19.0664C4.03484 18.1677 3.32321 17.1106 2.79883 15.8955C2.27453 14.6805 2.0127 13.3817 2.0127 12C2.0127 10.6183 2.27453 9.31953 2.79883 8.10449C3.32321 6.88936 4.03484 5.83235 4.93359 4.93359C5.83235 4.03484 6.88936 3.32321 8.10449 2.79883C9.31953 2.27453 10.6183 2.0127 12 2.0127ZM12 3.9873C9.76342 3.9873 7.8688 4.76401 6.31641 6.31641C4.76401 7.8688 3.9873 9.76342 3.9873 12C3.9873 14.2366 4.76401 16.1312 6.31641 17.6836C7.8688 19.236 9.76342 20.0127 12 20.0127C14.2366 20.0127 16.1312 19.236 17.6836 17.6836C19.236 16.1312 20.0127 14.2366 20.0127 12C20.0127 9.76342 19.236 7.8688 17.6836 6.31641C16.1312 4.76401 14.2366 3.9873 12 3.9873ZM15.5996 7.4375C15.88 7.4375 16.1103 7.52822 16.291 7.70898C16.4718 7.88974 16.5625 8.12003 16.5625 8.40039C16.5624 8.68052 16.4716 8.91016 16.291 9.09082L13.3916 11.9912L13.3818 12L13.3916 12.0088L16.291 14.9092C16.4716 15.0898 16.5624 15.3195 16.5625 15.5996C16.5625 15.88 16.4718 16.1103 16.291 16.291C16.1103 16.4718 15.88 16.5625 15.5996 16.5625C15.3195 16.5624 15.0898 16.4716 14.9092 16.291L12.0088 13.3916L12 13.3818L11.9912 13.3916L9.09082 16.291C8.91016 16.4716 8.68052 16.5624 8.40039 16.5625C8.12003 16.5625 7.88974 16.4718 7.70898 16.291C7.52822 16.1103 7.4375 15.88 7.4375 15.5996C7.43758 15.3195 7.52837 15.0898 7.70898 14.9092L10.6084 12.0088L10.6182 12L10.6084 11.9912L7.70898 9.09082C7.52837 8.91016 7.43758 8.68052 7.4375 8.40039C7.4375 8.12003 7.52822 7.88974 7.70898 7.70898C7.88974 7.52822 8.12003 7.4375 8.40039 7.4375C8.68052 7.43758 8.91016 7.52837 9.09082 7.70898L11.9912 10.6084L12 10.6182L12.0088 10.6084L14.9092 7.70898C15.0898 7.52837 15.3195 7.43758 15.5996 7.4375Z" fill="#1A1A1A" stroke="#1A1A1A" stroke-width="0.025"/></g></svg>`,
  'fingerprint': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 18.0489 19.9643" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="fingerprint" d="M0.22 7.625C0.103333 7.54167 0.0325 7.4375 0.0075 7.3125C-0.0175 7.1875 0.02 7.05833 0.12 6.925C1.15333 5.50833 2.44917 4.40833 4.0075 3.625C5.56583 2.84167 7.22833 2.45 8.995 2.45C10.7617 2.45 12.4283 2.82917 13.995 3.5875C15.5617 4.34583 16.87 5.44167 17.92 6.875C18.0367 7.025 18.0742 7.15833 18.0325 7.275C17.9908 7.39167 17.92 7.49167 17.82 7.575C17.72 7.65833 17.6033 7.69583 17.47 7.6875C17.3367 7.67917 17.22 7.60833 17.12 7.475C16.2033 6.175 15.0242 5.17917 13.5825 4.4875C12.1408 3.79583 10.6117 3.45 8.995 3.45C7.37833 3.45 5.86167 3.79583 4.445 4.4875C3.02833 5.17917 1.85333 6.175 0.92 7.475C0.82 7.625 0.703333 7.70833 0.57 7.725C0.436667 7.74167 0.32 7.70833 0.22 7.625ZM11.82 19.95C10.0867 19.5167 8.67 18.6542 7.57 17.3625C6.47 16.0708 5.92 14.4917 5.92 12.625C5.92 11.7917 6.22 11.0917 6.82 10.525C7.42 9.95833 8.145 9.675 8.995 9.675C9.845 9.675 10.57 9.95833 11.17 10.525C11.77 11.0917 12.07 11.7917 12.07 12.625C12.07 13.175 12.2783 13.6375 12.695 14.0125C13.1117 14.3875 13.6033 14.575 14.17 14.575C14.7367 14.575 15.22 14.3875 15.62 14.0125C16.02 13.6375 16.22 13.175 16.22 12.625C16.22 10.6917 15.5117 9.06667 14.095 7.75C12.6783 6.43333 10.9867 5.775 9.02 5.775C7.05333 5.775 5.36167 6.43333 3.945 7.75C2.52833 9.06667 1.82 10.6833 1.82 12.6C1.82 13 1.8575 13.5 1.9325 14.1C2.0075 14.7 2.18667 15.4 2.47 16.2C2.52 16.35 2.51583 16.4833 2.4575 16.6C2.39917 16.7167 2.30333 16.8 2.17 16.85C2.03667 16.9 1.9075 16.8958 1.7825 16.8375C1.6575 16.7792 1.57 16.6833 1.52 16.55C1.27 15.9 1.09083 15.2542 0.9825 14.6125C0.874167 13.9708 0.82 13.3083 0.82 12.625C0.82 10.4083 1.62417 8.55 3.2325 7.05C4.84083 5.55 6.76167 4.8 8.995 4.8C11.245 4.8 13.1783 5.55 14.795 7.05C16.4117 8.55 17.22 10.4083 17.22 12.625C17.22 13.4583 16.9242 14.1542 16.3325 14.7125C15.7408 15.2708 15.02 15.55 14.17 15.55C13.32 15.55 12.5908 15.2708 11.9825 14.7125C11.3742 14.1542 11.07 13.4583 11.07 12.625C11.07 12.075 10.8658 11.6125 10.4575 11.2375C10.0492 10.8625 9.56167 10.675 8.995 10.675C8.42833 10.675 7.94083 10.8625 7.5325 11.2375C7.12417 11.6125 6.92 12.075 6.92 12.625C6.92 14.2417 7.39917 15.5917 8.3575 16.675C9.31583 17.7583 10.5533 18.5167 12.07 18.95C12.22 19 12.32 19.0833 12.37 19.2C12.42 19.3167 12.4283 19.4417 12.395 19.575C12.3617 19.6917 12.295 19.7917 12.195 19.875C12.095 19.9583 11.97 19.9833 11.82 19.95ZM3.47 2.4C3.33667 2.48333 3.20333 2.50417 3.07 2.4625C2.93667 2.42083 2.83667 2.33333 2.77 2.2C2.70333 2.06667 2.68667 1.94583 2.72 1.8375C2.75333 1.72917 2.83667 1.63333 2.97 1.55C3.90333 1.05 4.87833 0.666667 5.895 0.4C6.91167 0.133333 7.945 0 8.995 0C10.0617 0 11.1033 0.129167 12.12 0.3875C13.1367 0.645833 14.12 1.01667 15.07 1.5C15.22 1.58333 15.3075 1.68333 15.3325 1.8C15.3575 1.91667 15.345 2.03333 15.295 2.15C15.245 2.26667 15.1617 2.35833 15.045 2.425C14.9283 2.49167 14.7867 2.48333 14.62 2.4C13.7367 1.95 12.8242 1.60417 11.8825 1.3625C10.9408 1.12083 9.97833 1 8.995 1C8.02833 1 7.07833 1.1125 6.145 1.3375C5.21167 1.5625 4.32 1.91667 3.47 2.4ZM6.42 19.6C5.43667 18.5667 4.6825 17.5125 4.1575 16.4375C3.6325 15.3625 3.37 14.0917 3.37 12.625C3.37 11.1083 3.92 9.82917 5.02 8.7875C6.12 7.74583 7.445 7.225 8.995 7.225C10.545 7.225 11.8783 7.74583 12.995 8.7875C14.1117 9.82917 14.67 11.1083 14.67 12.625C14.67 12.775 14.6242 12.8958 14.5325 12.9875C14.4408 13.0792 14.32 13.125 14.17 13.125C14.0367 13.125 13.92 13.0792 13.82 12.9875C13.72 12.8958 13.67 12.775 13.67 12.625C13.67 11.375 13.2075 10.3292 12.2825 9.4875C11.3575 8.64583 10.2617 8.225 8.995 8.225C7.72833 8.225 6.64083 8.64583 5.7325 9.4875C4.82417 10.3292 4.37 11.375 4.37 12.625C4.37 13.975 4.60333 15.1208 5.07 16.0625C5.53667 17.0042 6.22 17.95 7.12 18.9C7.22 19 7.27 19.1167 7.27 19.25C7.27 19.3833 7.22 19.5 7.12 19.6C7.02 19.7 6.90333 19.75 6.77 19.75C6.63667 19.75 6.52 19.7 6.42 19.6ZM13.97 17.9C12.4867 17.9 11.1992 17.4 10.1075 16.4C9.01583 15.4 8.47 14.1417 8.47 12.625C8.47 12.4917 8.51583 12.375 8.6075 12.275C8.69917 12.175 8.82 12.125 8.97 12.125C9.12 12.125 9.24083 12.175 9.3325 12.275C9.42417 12.375 9.47 12.4917 9.47 12.625C9.47 13.875 9.92 14.9 10.82 15.7C11.72 16.5 12.77 16.9 13.97 16.9C14.07 16.9 14.2117 16.8917 14.395 16.875C14.5783 16.8583 14.77 16.8333 14.97 16.8C15.12 16.7667 15.2492 16.7875 15.3575 16.8625C15.4658 16.9375 15.5367 17.05 15.57 17.2C15.6033 17.3333 15.5783 17.45 15.495 17.55C15.4117 17.65 15.3033 17.7167 15.17 17.75C14.87 17.8333 14.6075 17.8792 14.3825 17.8875C14.1575 17.8958 14.02 17.9 13.97 17.9Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'bank': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20 19.75" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="account_balance" d="M4 15.75C3.71667 15.75 3.47917 15.6542 3.2875 15.4625C3.09583 15.2708 3 15.0333 3 14.75V9.725C3 9.44167 3.09583 9.20833 3.2875 9.025C3.47917 8.84167 3.71667 8.75 4 8.75C4.28333 8.75 4.52083 8.84583 4.7125 9.0375C4.90417 9.22917 5 9.46667 5 9.75V14.775C5 15.0583 4.90417 15.2917 4.7125 15.475C4.52083 15.6583 4.28333 15.75 4 15.75ZM10 15.75C9.71667 15.75 9.47917 15.6542 9.2875 15.4625C9.09583 15.2708 9 15.0333 9 14.75V9.725C9 9.44167 9.09583 9.20833 9.2875 9.025C9.47917 8.84167 9.71667 8.75 10 8.75C10.2833 8.75 10.5208 8.84583 10.7125 9.0375C10.9042 9.22917 11 9.46667 11 9.75V14.775C11 15.0583 10.9042 15.2917 10.7125 15.475C10.5208 15.6583 10.2833 15.75 10 15.75ZM0.975 19.75C0.691667 19.75 0.458333 19.6542 0.275 19.4625C0.0916667 19.2708 0 19.0333 0 18.75C0 18.4667 0.0958333 18.2292 0.2875 18.0375C0.479167 17.8458 0.716667 17.75 1 17.75H19.025C19.3083 17.75 19.5417 17.8458 19.725 18.0375C19.9083 18.2292 20 18.4667 20 18.75C20 19.0333 19.9042 19.2708 19.7125 19.4625C19.5208 19.6542 19.2833 19.75 19 19.75H0.975ZM16 15.75C15.7167 15.75 15.4792 15.6542 15.2875 15.4625C15.0958 15.2708 15 15.0333 15 14.75V9.725C15 9.44167 15.0958 9.20833 15.2875 9.025C15.4792 8.84167 15.7167 8.75 16 8.75C16.2833 8.75 16.5208 8.84583 16.7125 9.0375C16.9042 9.22917 17 9.46667 17 9.75V14.775C17 15.0583 16.9042 15.2917 16.7125 15.475C16.5208 15.6583 16.2833 15.75 16 15.75ZM10.9 0.2L19.325 4.4C19.5417 4.51667 19.7083 4.67917 19.825 4.8875C19.9417 5.09583 20 5.325 20 5.575C20 5.90833 19.8792 6.1875 19.6375 6.4125C19.3958 6.6375 19.1083 6.75 18.775 6.75H1.25C0.916667 6.75 0.625 6.6375 0.375 6.4125C0.125 6.1875 0 5.90833 0 5.575C0 5.34167 0.0541667 5.11667 0.1625 4.9C0.270833 4.68333 0.441667 4.525 0.675 4.425L9.1 0.2C9.38333 0.0666667 9.68333 0 10 0C10.3167 0 10.6167 0.0666667 10.9 0.2Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'bookmark': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 14 17.4821" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="bookmark" d="M2 0.0126953H12C12.5467 0.0126953 13.014 0.207339 13.4033 0.59668C13.7927 0.986021 13.9873 1.45334 13.9873 2V16.4746C13.9873 16.8372 13.8392 17.1125 13.543 17.3018C13.2464 17.4912 12.9341 17.5205 12.6045 17.3887L7.00488 14.9883L7 15L7.00684 14.9834L6.99512 14.9883L1.39551 17.3887C1.06592 17.5205 0.753565 17.4912 0.457031 17.3018C0.160755 17.1125 0.0126953 16.8372 0.0126953 16.4746V2C0.0126953 1.45334 0.207339 0.986021 0.59668 0.59668C0.986021 0.207339 1.45334 0.0126953 2 0.0126953ZM1.9873 14.9688L2.00488 14.9619L7 12.8135L11.9951 14.9619L12.0127 14.9688V1.9873H1.9873V14.9688Z" fill="var(--fill-0, #1A1A1A)" stroke="var(--stroke-0, #1A1A1A)" stroke-width="0.025"/></svg>`,
  'bi fast': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Vector"><path d="M2 22C1.45 22 0.979167 21.8042 0.5875 21.4125C0.195833 21.0208 0 20.55 0 20V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V6H12V5H2V17H12V16H14V20C14 20.55 13.8042 21.0208 13.4125 21.4125C13.0208 21.8042 12.55 22 12 22H2ZM2 19V20H12V19H2ZM2 3H12V2H2V3Z" fill="var(--fill-0, #1A1A1A)"/><path d="M10.5814 9.5548H12.9942L12.4855 10.0574C12.3789 10.1691 12.328 10.3017 12.3328 10.4553C12.3377 10.6088 12.3934 10.7368 12.5 10.8392C12.6163 10.9509 12.7544 11.0044 12.9142 10.9997C13.0741 10.9951 13.2074 10.9416 13.314 10.8392L14.8256 9.38727C14.9419 9.27558 15 9.14528 15 8.99637C15 8.84746 14.9419 8.71716 14.8256 8.60547L13.314 7.15357C13.2074 7.05119 13.0717 7 12.907 7C12.7422 7 12.6066 7.05119 12.5 7.15357C12.3837 7.26525 12.3256 7.39788 12.3256 7.55145C12.3256 7.70501 12.3789 7.83298 12.4855 7.93536L12.9942 8.43795H10.5814C10.4167 8.43795 10.2786 8.49146 10.1672 8.59849C10.0557 8.70552 10 8.83815 10 8.99637C10 9.15459 10.0557 9.28722 10.1672 9.39425C10.2786 9.50128 10.4167 9.5548 10.5814 9.5548Z" fill="var(--fill-0, #1A1A1A)"/><path d="M13.4186 12.4452H11.0058L11.5145 11.9426C11.6211 11.8309 11.672 11.6983 11.6672 11.5447C11.6623 11.3912 11.6066 11.2632 11.5 11.1608C11.3837 11.0491 11.2456 10.9956 11.0858 11.0003C10.9259 11.0049 10.7926 11.0584 10.686 11.1608L9.17442 12.6127C9.05814 12.7244 9 12.8547 9 13.0036C9 13.1525 9.05814 13.2828 9.17442 13.3945L10.686 14.8464C10.7926 14.9488 10.9283 15 11.093 15C11.2578 15 11.3934 14.9488 11.5 14.8464C11.6163 14.7347 11.6744 14.6021 11.6744 14.4486C11.6744 14.295 11.6211 14.167 11.5145 14.0646L11.0058 13.5621H13.4186C13.5833 13.5621 13.7214 13.5085 13.8328 13.4015C13.9443 13.2945 14 13.1619 14 13.0036C14 12.8454 13.9443 12.7128 13.8328 12.6058C13.7214 12.4987 13.5833 12.4452 13.4186 12.4452Z" fill="var(--fill-0, #1A1A1A)"/></g></svg>`,
  'biometric': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20.0014 19.9992" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M16.4568 0C18.4123 0 20.0014 1.59138 20.0014 3.54464V5.60804C20.0014 5.91823 19.7496 6.16997 19.4395 6.16997C19.1293 6.16997 18.8775 5.91823 18.8775 5.60804V3.54464C18.8775 2.2095 17.7919 1.12386 16.4568 1.12386H14.4181C14.1079 1.12386 13.8562 0.872112 13.8562 0.561928C13.8562 0.251744 14.1079 0 14.4181 0H16.4568ZM0.000271237 3.54491V5.60831C0.000271237 5.9185 0.252015 6.17024 0.562198 6.17024C0.872382 6.17024 1.12413 5.9185 1.12413 5.60831V3.54491C1.12413 2.20977 2.20977 1.12413 3.54266 1.12413H5.58133C5.89152 1.12413 6.14326 0.872383 6.14326 0.562199C6.14326 0.252015 5.89152 0.000271237 5.58133 0.000271237H3.54266C1.5894 0.000271237 0.000271237 1.5894 0.000271237 3.54491ZM9.36645 12.6418C9.87668 12.6418 10.2835 12.5069 10.5802 12.2372C10.9848 11.8685 11.005 11.41 11.005 11.3201V7.1371C11.005 6.82691 10.7533 6.57517 10.4431 6.57517C10.1329 6.57517 9.88117 6.82691 9.88117 7.1371V11.3021C9.85645 11.4662 9.57773 11.5471 9.1664 11.5067C8.85621 11.4752 8.58199 11.7045 8.55277 12.0124C8.52355 12.3226 8.75057 12.5968 9.05851 12.626C9.1664 12.6373 9.26755 12.6418 9.36645 12.6418ZM6.16875 6.72138C6.47897 6.72138 6.73074 6.97315 6.73074 7.28337V8.93338C6.73074 9.2436 6.47897 9.49537 6.16875 9.49537C5.85853 9.49537 5.60675 9.2436 5.60675 8.93338V7.28337C5.60675 6.97315 5.85853 6.72138 6.16875 6.72138ZM14.87 7.28337V8.93338C14.87 9.2436 14.6182 9.49537 14.308 9.49537C13.9978 9.49537 13.746 9.2436 13.746 8.93338V7.28337C13.746 6.97315 13.9978 6.72138 14.308 6.72138C14.6182 6.72138 14.87 6.97315 14.87 7.28337ZM13.8919 14.4295C13.13 15.4454 11.7274 16.077 10.2304 16.077C8.73344 16.077 7.33087 15.4454 6.56889 14.4295C6.38233 14.1822 6.43403 13.8293 6.68128 13.6428C6.92853 13.4562 7.28142 13.5079 7.46798 13.7551C8.02316 14.4946 9.08183 14.9532 10.2304 14.9532C11.379 14.9532 12.4377 14.4946 12.9928 13.7551C13.1794 13.5057 13.5323 13.4562 13.7795 13.6428C14.029 13.8293 14.0785 14.1822 13.8919 14.4295ZM20.0014 14.4406C20.0014 14.1304 19.7496 13.8787 19.4395 13.8787C19.1293 13.8787 18.8775 14.1304 18.8775 14.4406V16.4568C18.8775 17.792 17.7919 18.8753 16.4568 18.8753H14.4181C14.1079 18.8753 13.8562 19.1271 13.8562 19.4373C13.8562 19.7475 14.1079 19.9992 14.4181 19.9992H16.4568C18.41 19.9992 20.0014 18.4101 20.0014 16.4568V14.4406ZM3.54239 19.9992C1.58913 19.9992 0 18.4101 0 16.4568V14.4406C0 14.1304 0.251743 13.8787 0.561927 13.8787C0.872111 13.8787 1.12385 14.1304 1.12385 14.4406V16.4568C1.12385 17.7897 2.20725 18.8753 3.54239 18.8753H5.58106C5.89124 18.8753 6.14299 19.1271 6.14299 19.4373C6.14299 19.7475 5.89124 19.9992 5.58106 19.9992H3.54239Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'business': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20.0939 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="storefront" d="M19.0469 8.05V16C19.0469 16.55 18.8511 17.0208 18.4594 17.4125C18.0678 17.8042 17.5969 18 17.0469 18H3.04694C2.49694 18 2.02611 17.8042 1.63444 17.4125C1.24277 17.0208 1.04694 16.55 1.04694 16V8.05C0.663605 7.7 0.367772 7.25 0.159439 6.7C-0.0488946 6.15 -0.0530612 5.55 0.146939 4.9L1.19694 1.5C1.33027 1.06667 1.56777 0.708333 1.90944 0.425C2.25111 0.141667 2.64694 0 3.09694 0H16.9969C17.4469 0 17.8386 0.1375 18.1719 0.4125C18.5053 0.6875 18.7469 1.05 18.8969 1.5L19.9469 4.9C20.1469 5.55 20.1428 6.14167 19.9344 6.675C19.7261 7.20833 19.4303 7.66667 19.0469 8.05ZM12.2469 7C12.6969 7 13.0386 6.84583 13.2719 6.5375C13.5053 6.22917 13.5969 5.88333 13.5469 5.5L12.9969 2H11.0469V5.7C11.0469 6.05 11.1636 6.35417 11.3969 6.6125C11.6303 6.87083 11.9136 7 12.2469 7ZM7.74694 7C8.13027 7 8.44277 6.87083 8.68444 6.6125C8.92611 6.35417 9.04694 6.05 9.04694 5.7V2H7.09694L6.54694 5.5C6.48027 5.9 6.56777 6.25 6.80944 6.55C7.05111 6.85 7.36361 7 7.74694 7ZM3.29694 7C3.59694 7 3.85944 6.89167 4.08444 6.675C4.30944 6.45833 4.44694 6.18333 4.49694 5.85L5.04694 2H3.09694L2.09694 5.35C1.99694 5.68333 2.05111 6.04167 2.25944 6.425C2.46777 6.80833 2.81361 7 3.29694 7ZM16.7969 7C17.2803 7 17.6303 6.80833 17.8469 6.425C18.0636 6.04167 18.1136 5.68333 17.9969 5.35L16.9469 2H15.0469L15.5969 5.85C15.6469 6.18333 15.7844 6.45833 16.0094 6.675C16.2344 6.89167 16.4969 7 16.7969 7ZM3.04694 16H17.0469V8.95C16.9636 8.98333 16.9094 9 16.8844 9H16.7969C16.3469 9 15.9511 8.925 15.6094 8.775C15.2678 8.625 14.9303 8.38333 14.5969 8.05C14.2969 8.35 13.9553 8.58333 13.5719 8.75C13.1886 8.91667 12.7803 9 12.3469 9C11.8969 9 11.4761 8.91667 11.0844 8.75C10.6928 8.58333 10.3469 8.35 10.0469 8.05C9.76361 8.35 9.43444 8.58333 9.05944 8.75C8.68444 8.91667 8.28027 9 7.84694 9C7.36361 9 6.92611 8.91667 6.53444 8.75C6.14277 8.58333 5.79694 8.35 5.49694 8.05C5.14694 8.4 4.80111 8.64583 4.45944 8.7875C4.11777 8.92917 3.73027 9 3.29694 9H3.18444C3.14277 9 3.09694 8.98333 3.04694 8.95V16Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'beranda': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 21.3333 21.3333" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="Vector" d="M11.1796 0C11.7071 0.169817 12.0832 0.544285 12.4626 0.925087C15.201 3.67383 17.9412 6.42078 20.6833 9.16596C20.871 9.35478 21.0582 9.57467 21.1587 9.81633C21.7169 11.1713 20.8825 12.551 19.4329 12.6096C19.3222 12.6142 19.2113 12.6096 19.0653 12.6096V12.8596C19.0653 14.9049 19.0688 16.9504 19.0637 18.9952C19.0607 20.1138 18.3506 21.0169 17.2821 21.2689C17.0993 21.3099 16.9124 21.3303 16.725 21.3296C15.627 21.3352 14.529 21.3332 13.431 21.3318C12.9877 21.3318 12.7316 21.0775 12.731 20.6326C12.729 19.0254 12.713 17.4179 12.7381 15.8112C12.749 15.106 12.2643 14.5936 11.5496 14.6171C10.9597 14.6369 10.3684 14.6199 9.7777 14.6217C9.0517 14.6239 8.62878 15.049 8.62878 15.7797C8.62759 17.3729 8.62759 18.9661 8.62878 20.5593C8.62878 21.102 8.39781 21.3322 7.85485 21.3322C6.79838 21.3322 5.74191 21.3322 4.68544 21.3322C3.28614 21.3302 2.29649 20.3426 2.29471 18.9429C2.29207 16.9253 2.29207 14.9077 2.29471 12.8901V12.6318C2.057 12.612 1.82722 12.612 1.60655 12.5694C0.862928 12.4242 0.353841 11.9834 0.11257 11.2685C-0.126325 10.5607 0.0202607 9.91114 0.502408 9.34013C0.565202 9.26591 0.635721 9.19822 0.704458 9.12934C3.42038 6.41003 6.13637 3.68946 8.85243 0.96764C9.24504 0.573974 9.62497 0.171796 10.1778 0H11.1796ZM13.9803 20.0814H14.2367C14.9803 20.0814 15.7259 20.0487 16.4671 20.0899C17.3148 20.137 17.8417 19.6833 17.825 18.7242C17.7872 16.5273 17.813 14.3276 17.8131 12.1292C17.8131 11.5897 18.0459 11.3595 18.5902 11.3589C18.8614 11.3589 19.1324 11.3631 19.4024 11.357C19.693 11.3506 19.9056 11.2091 20.03 10.9482C20.1591 10.6771 20.1167 10.42 19.9309 10.1874C19.8725 10.1185 19.8102 10.0528 19.7443 9.9909C16.9348 7.17671 14.1245 4.36259 11.3135 1.54854C10.8579 1.09213 10.5013 1.09095 10.0493 1.54439L2.50092 9.10104C2.15189 9.45018 1.79909 9.79575 1.4562 10.15C1.24326 10.3707 1.19136 10.6393 1.31219 10.9219C1.43303 11.2046 1.65667 11.3516 1.96588 11.3574C2.22994 11.3617 2.49419 11.3587 2.75824 11.3589C3.31447 11.3589 3.54405 11.5877 3.54405 12.1423C3.54405 14.4174 3.54405 16.6925 3.54405 18.9676C3.54405 19.6406 3.98282 20.0792 4.65157 20.0808C5.49252 20.0827 6.3334 20.0827 7.17422 20.0808C7.23484 20.0808 7.29525 20.074 7.37568 20.0691V19.8118C7.37568 18.4481 7.36993 17.0844 7.37746 15.7207C7.38459 14.4293 8.27321 13.4611 9.5598 13.3853C10.3006 13.3421 11.0455 13.375 11.7897 13.3791C11.9148 13.3819 12.0392 13.3979 12.1609 13.427C13.2536 13.6722 13.9724 14.57 13.9784 15.7132C13.9853 17.0769 13.9799 18.4406 13.9801 19.8043L13.9803 20.0814Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'bluetooth': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 11.85 19.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="Vector" d="M5.575 18.175V12L1.675 15.9C1.49167 16.0833 1.25833 16.175 0.975 16.175C0.691667 16.175 0.458333 16.0833 0.275 15.9C0.0916663 15.7167 0 15.4833 0 15.2C0 14.9167 0.0916663 14.6833 0.275 14.5L5.175 9.6L0.275 4.7C0.0916663 4.51667 0 4.28333 0 4C0 3.71667 0.0916663 3.48333 0.275 3.3C0.458333 3.11667 0.691667 3.025 0.975 3.025C1.25833 3.025 1.49167 3.11667 1.675 3.3L5.575 7.2V1.025C5.575 0.725 5.675 0.479333 5.875 0.288C6.075 0.0966665 6.30833 0.000666667 6.575 0C6.70833 0 6.83333 0.0249998 6.95 0.0749998C7.06667 0.125 7.175 0.2 7.275 0.3L11.575 4.6C11.675 4.7 11.746 4.80833 11.788 4.925C11.83 5.04167 11.8507 5.16667 11.85 5.3C11.8493 5.43333 11.8287 5.55833 11.788 5.675C11.7473 5.79167 11.6763 5.9 11.575 6L7.975 9.6L11.575 13.2C11.675 13.3 11.746 13.4083 11.788 13.525C11.83 13.6417 11.8507 13.7667 11.85 13.9C11.8493 14.0333 11.8287 14.1583 11.788 14.275C11.7473 14.3917 11.6763 14.5 11.575 14.6L7.275 18.9C7.175 19 7.06667 19.075 6.95 19.125C6.83333 19.175 6.70833 19.2 6.575 19.2C6.30833 19.2 6.075 19.104 5.875 18.912C5.675 18.72 5.575 18.4743 5.575 18.175ZM7.575 7.2L9.475 5.3L7.575 3.45V7.2ZM7.575 15.75L9.475 13.9L7.575 12V15.75Z" fill="var(--fill-0, black)"/></svg>`,
  'edit': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="edit"><mask id="mask0_0_16" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="var(--fill-0, #D9D9D9)"/></mask><g mask="url(#mask0_0_16)"><path id="edit_2" d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM4 21C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5208 3 20.2833 3 20V17.175C3 17.0417 3.025 16.9125 3.075 16.7875C3.125 16.6625 3.2 16.55 3.3 16.45L13.6 6.15L17.85 10.4L7.55 20.7C7.45 20.8 7.3375 20.875 7.2125 20.925C7.0875 20.975 6.95833 21 6.825 21H4Z" fill="var(--fill-0, #1A1A1A)"/></g></g></svg>`,
  'e-wallet': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="account_balance_wallet" d="M13 10.5C13.4333 10.5 13.7917 10.3583 14.075 10.075C14.3583 9.79167 14.5 9.43333 14.5 9C14.5 8.56667 14.3583 8.20833 14.075 7.925C13.7917 7.64167 13.4333 7.5 13 7.5C12.5667 7.5 12.2083 7.64167 11.925 7.925C11.6417 8.20833 11.5 8.56667 11.5 9C11.5 9.43333 11.6417 9.79167 11.925 10.075C12.2083 10.3583 12.5667 10.5 13 10.5ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V4.5H16V2H2V16H16V13.5H18V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM10 14C9.45 14 8.97917 13.8042 8.5875 13.4125C8.19583 13.0208 8 12.55 8 12V6C8 5.45 8.19583 4.97917 8.5875 4.5875C8.97917 4.19583 9.45 4 10 4H17C17.55 4 18.0208 4.19583 18.4125 4.5875C18.8042 4.97917 19 5.45 19 6V12C19 12.55 18.8042 13.0208 18.4125 13.4125C18.0208 13.8042 17.55 14 17 14H10ZM17 12V6H10V12H17Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'email': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="mail" d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V14V4Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'electronic': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="power" d="M5.5 16H6.5V14.15L10 10.65V6H2V10.65L5.5 14.15V16ZM3.5 15L0.575 12.075C0.391667 11.8917 0.25 11.6792 0.15 11.4375C0.05 11.1958 0 10.9417 0 10.675V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H3L2 5V1C2 0.716667 2.09583 0.479167 2.2875 0.2875C2.47917 0.0958333 2.71667 0 3 0C3.28333 0 3.52083 0.0958333 3.7125 0.2875C3.90417 0.479167 4 0.716667 4 1V4H8V1C8 0.716667 8.09583 0.479167 8.2875 0.2875C8.47917 0.0958333 8.71667 0 9 0C9.28333 0 9.52083 0.0958333 9.7125 0.2875C9.90417 0.479167 10 0.716667 10 1V5L9 4H10C10.55 4 11.0208 4.19583 11.4125 4.5875C11.8042 4.97917 12 5.45 12 6V10.675C12 10.9417 11.95 11.1958 11.85 11.4375C11.75 11.6792 11.6083 11.8917 11.425 12.075L8.5 15V17C8.5 17.2833 8.40417 17.5208 8.2125 17.7125C8.02083 17.9042 7.78333 18 7.5 18H4.5C4.21667 18 3.97917 17.9042 3.7875 17.7125C3.59583 17.5208 3.5 17.2833 3.5 17V15Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'money': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="payments" d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V4C0 3.71667 0.0958333 3.47917 0.2875 3.2875C0.479167 3.09583 0.716667 3 1 3C1.28333 3 1.52083 3.09583 1.7125 3.2875C1.90417 3.47917 2 3.71667 2 4V14H18C18.2833 14 18.5208 14.0958 18.7125 14.2875C18.9042 14.4792 19 14.7167 19 15C19 15.2833 18.9042 15.5208 18.7125 15.7125C18.5208 15.9042 18.2833 16 18 16H2Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'menu': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="menu" d="M1 12C0.716667 12 0.479167 11.9042 0.2875 11.7125C0.0958333 11.5208 0 11.2833 0 11C0 10.7167 0.0958333 10.4792 0.2875 10.2875C0.479167 10.0958 0.716667 10 1 10H17C17.2833 10 17.5208 10.0958 17.7125 10.2875C17.9042 10.4792 18 10.7167 18 11C18 11.2833 17.9042 11.5208 17.7125 11.7125C17.5208 11.9042 17.2833 12 17 12H1ZM1 7C0.716667 7 0.479167 6.90417 0.2875 6.7125C0.0958333 6.52083 0 6.28333 0 6C0 5.71667 0.0958333 5.47917 0.2875 5.2875C0.479167 5.09583 0.716667 5 1 5H17C17.2833 5 17.5208 5.09583 17.7125 5.2875C17.9042 5.47917 18 5.71667 18 6C18 6.28333 17.9042 6.52083 17.7125 6.7125C17.5208 6.90417 17.2833 7 17 7H1ZM1 2C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H1Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'mute': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 18.95 20.175" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="mic_off" d="M15.925 12.95L14.475 11.5C14.625 11.25 14.7542 10.9917 14.8625 10.725C14.9708 10.4583 15.05 10.1833 15.1 9.9C15.15 9.65 15.2708 9.4375 15.4625 9.2625C15.6542 9.0875 15.8667 9 16.1 9C16.4167 9 16.675 9.10833 16.875 9.325C17.075 9.54167 17.15 9.79167 17.1 10.075C17.0167 10.6083 16.875 11.1125 16.675 11.5875C16.475 12.0625 16.225 12.5167 15.925 12.95ZM12.975 9.95L7.175 4.15V3C7.175 2.16667 7.46667 1.45833 8.05 0.875C8.63333 0.291667 9.34167 0 10.175 0C11.0083 0 11.7167 0.291667 12.3 0.875C12.8833 1.45833 13.175 2.16667 13.175 3V9C13.175 9.18333 13.1542 9.35 13.1125 9.5C13.0708 9.65 13.025 9.8 12.975 9.95ZM17.275 19.9L0.275 2.9C0.0916667 2.71667 0 2.48333 0 2.2C0 1.91667 0.0916667 1.68333 0.275 1.5C0.458333 1.31667 0.691667 1.225 0.975 1.225C1.25833 1.225 1.49167 1.31667 1.675 1.5L18.675 18.5C18.8583 18.6833 18.95 18.9167 18.95 19.2C18.95 19.4833 18.8583 19.7167 18.675 19.9C18.4917 20.0833 18.2583 20.175 17.975 20.175C17.6917 20.175 17.4583 20.0833 17.275 19.9ZM9.175 18V15.9C7.625 15.7 6.30833 15.0583 5.225 13.975C4.14167 12.8917 3.48333 11.5917 3.25 10.075C3.2 9.79167 3.275 9.54167 3.475 9.325C3.675 9.10833 3.94167 9 4.275 9C4.50833 9 4.71667 9.0875 4.9 9.2625C5.08333 9.4375 5.2 9.65 5.25 9.9C5.46667 11.0667 6.03333 12.0417 6.95 12.825C7.86667 13.6083 8.94167 14 10.175 14C10.7417 14 11.2792 13.9125 11.7875 13.7375C12.2958 13.5625 12.7583 13.3167 13.175 13L14.6 14.425C14.1167 14.8083 13.5875 15.1292 13.0125 15.3875C12.4375 15.6458 11.825 15.8167 11.175 15.9V18C11.175 18.2833 11.0792 18.5208 10.8875 18.7125C10.6958 18.9042 10.4583 19 10.175 19C9.89167 19 9.65417 18.9042 9.4625 18.7125C9.27083 18.5208 9.175 18.2833 9.175 18Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'more': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="more_vert" d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14C0 13.45 0.195833 12.9792 0.5875 12.5875C0.979167 12.1958 1.45 12 2 12C2.55 12 3.02083 12.1958 3.4125 12.5875C3.80417 12.9792 4 13.45 4 14C4 14.55 3.80417 15.0208 3.4125 15.4125C3.02083 15.8042 2.55 16 2 16ZM2 10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6C2.55 6 3.02083 6.19583 3.4125 6.5875C3.80417 6.97917 4 7.45 4 8C4 8.55 3.80417 9.02083 3.4125 9.4125C3.02083 9.80417 2.55 10 2 10ZM2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'minimize': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="arrow_insert"><mask id="mask0_0_15" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect id="Bounding box" width="24" height="24" fill="var(--fill-0, #D9D9D9)"/></mask><g mask="url(#mask0_0_15)"><path id="arrow_insert_2" d="M8 8.4V16C8 16.2833 7.90417 16.5208 7.7125 16.7125C7.52083 16.9042 7.28333 17 7 17C6.71667 17 6.47917 16.9042 6.2875 16.7125C6.09583 16.5208 6 16.2833 6 16V6C6 5.71667 6.09583 5.47917 6.2875 5.2875C6.47917 5.09583 6.71667 5 7 5H17C17.2833 5 17.5208 5.09583 17.7125 5.2875C17.9042 5.47917 18 5.71667 18 6C18 6.28333 17.9042 6.52083 17.7125 6.7125C17.5208 6.90417 17.2833 7 17 7H9.4L18.3 15.9C18.4833 16.0833 18.575 16.3167 18.575 16.6C18.575 16.8833 18.4833 17.1167 18.3 17.3C18.1167 17.4833 17.8833 17.575 17.6 17.575C17.3167 17.575 17.0833 17.4833 16.9 17.3L8 8.4Z" fill="var(--fill-0, #1A1A1A)"/></g></g></svg>`,
  'minus': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="remove" d="M1 2C0.447716 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1C14 1.55228 13.5523 2 13 2H1Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'mobile': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 14 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="phone_iphone" d="M2 22C1.45 22 0.979167 21.8042 0.5875 21.4125C0.195833 21.0208 0 20.55 0 20V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V20C14 20.55 13.8042 21.0208 13.4125 21.4125C13.0208 21.8042 12.55 22 12 22H2ZM2 17V20H12V17H2ZM7 19.5C7.28333 19.5 7.52083 19.4042 7.7125 19.2125C7.90417 19.0208 8 18.7833 8 18.5C8 18.2167 7.90417 17.9792 7.7125 17.7875C7.52083 17.5958 7.28333 17.5 7 17.5C6.71667 17.5 6.47917 17.5958 6.2875 17.7875C6.09583 17.9792 6 18.2167 6 18.5C6 18.7833 6.09583 19.0208 6.2875 19.2125C6.47917 19.4042 6.71667 19.5 7 19.5ZM2 15H12V5H2V15ZM2 3H12V2H2V3Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'mobile-pembelian': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="mobile_friendly"><path d="M2 22C1.45 22 0.979167 21.8042 0.5875 21.4125C0.195833 21.0208 0 20.55 0 20V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V6H12V5H2V17H12V16H14V20C14 20.55 13.8042 21.0208 13.4125 21.4125C13.0208 21.8042 12.55 22 12 22H2ZM2 19V20H12V19H2ZM2 3H12V2H2V3Z" fill="var(--fill-0, #1A1A1A)"/><path d="M11.525 15C10.4083 15 9.45833 14.6125 8.675 13.8375C7.89167 13.0625 7.5 12.1167 7.5 11V10.9125L6.7 11.7125L6 11.0125L8 9.0125L10 11.0125L9.3 11.7125L8.5 10.9125V11C8.5 11.8333 8.79375 12.5417 9.38125 13.125C9.96875 13.7083 10.6833 14 11.525 14C11.7417 14 11.9542 13.975 12.1625 13.925C12.3708 13.875 12.575 13.8 12.775 13.7L13.525 14.45C13.2083 14.6333 12.8833 14.7708 12.55 14.8625C12.2167 14.9542 11.875 15 11.525 15ZM15 12.9875L13 10.9875L13.7 10.2875L14.5 11.0875V11C14.5 10.1667 14.2062 9.45833 13.6187 8.875C13.0312 8.29167 12.3167 8 11.475 8C11.2583 8 11.0458 8.025 10.8375 8.075C10.6292 8.125 10.425 8.2 10.225 8.3L9.475 7.55C9.79167 7.36667 10.1167 7.22917 10.45 7.1375C10.7833 7.04583 11.125 7 11.475 7C12.5917 7 13.5417 7.3875 14.325 8.1625C15.1083 8.9375 15.5 9.88333 15.5 11V11.0875L16.3 10.2875L17 10.9875L15 12.9875Z" fill="var(--fill-0, #1A1A1A)"/></g></svg>`,
  'medical': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="stethoscope" d="M11.5 20C9.7 20 8.16667 19.3667 6.9 18.1C5.63333 16.8333 5 15.3 5 13.5V12.925C3.56667 12.6917 2.375 12.0208 1.425 10.9125C0.475 9.80417 0 8.5 0 7V2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H3C3 0.716667 3.09583 0.479167 3.2875 0.2875C3.47917 0.0958333 3.71667 0 4 0C4.28333 0 4.52083 0.0958333 4.7125 0.2875C4.90417 0.479167 5 0.716667 5 1V3C5 3.28333 4.90417 3.52083 4.7125 3.7125C4.52083 3.90417 4.28333 4 4 4C3.71667 4 3.47917 3.90417 3.2875 3.7125C3.09583 3.52083 3 3.28333 3 3H2V7C2 8.1 2.39167 9.04167 3.175 9.825C3.95833 10.6083 4.9 11 6 11C7.1 11 8.04167 10.6083 8.825 9.825C9.60833 9.04167 10 8.1 10 7V3H9C9 3.28333 8.90417 3.52083 8.7125 3.7125C8.52083 3.90417 8.28333 4 8 4C7.71667 4 7.47917 3.90417 7.2875 3.7125C7.09583 3.52083 7 3.28333 7 3V1C7 0.716667 7.09583 0.479167 7.2875 0.2875C7.47917 0.0958333 7.71667 0 8 0C8.28333 0 8.52083 0.0958333 8.7125 0.2875C8.90417 0.479167 9 0.716667 9 1H11C11.2833 1 11.5208 1.09583 11.7125 1.2875C11.9042 1.47917 12 1.71667 12 2V7C12 8.5 11.525 9.80417 10.575 10.9125C9.625 12.0208 8.43333 12.6917 7 12.925V13.5C7 14.75 7.4375 15.8125 8.3125 16.6875C9.1875 17.5625 10.25 18 11.5 18C12.75 18 13.8125 17.5625 14.6875 16.6875C15.5625 15.8125 16 14.75 16 13.5V11.825C15.4167 11.6083 14.9375 11.2458 14.5625 10.7375C14.1875 10.2292 14 9.65 14 9C14 8.16667 14.2917 7.45833 14.875 6.875C15.4583 6.29167 16.1667 6 17 6C17.8333 6 18.5417 6.29167 19.125 6.875C19.7083 7.45833 20 8.16667 20 9C20 9.65 19.8125 10.2292 19.4375 10.7375C19.0625 11.2458 18.5833 11.6083 18 11.825V13.5C18 15.3 17.3667 16.8333 16.1 18.1C14.8333 19.3667 13.3 20 11.5 20ZM17 10C17.2833 10 17.5208 9.90417 17.7125 9.7125C17.9042 9.52083 18 9.28333 18 9C18 8.71667 17.9042 8.47917 17.7125 8.2875C17.5208 8.09583 17.2833 8 17 8C16.7167 8 16.4792 8.09583 16.2875 8.2875C16.0958 8.47917 16 8.71667 16 9C16 9.28333 16.0958 9.52083 16.2875 9.7125C16.4792 9.90417 16.7167 10 17 10Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'transfer': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16.5025 16.462" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="transfer"><path id="Vector" d="M16.2512 0.252028C16.1209 0.12645 15.9558 0.0430563 15.7774 0.0127304C15.599 -0.0175956 15.4156 0.00655413 15.2512 0.0820282L5.20116 3.63203L0.641164 5.24203C0.448729 5.29807 0.280843 5.41742 0.16469 5.58076C0.0485375 5.7441 -0.00908119 5.94186 0.00116407 6.14203C0.0179767 6.30759 0.0813923 6.465 0.184053 6.59598C0.286713 6.72696 0.424409 6.82615 0.581164 6.88203L6.58116 9.70203C6.65613 9.73684 6.71635 9.79707 6.75116 9.87203L9.56116 15.872C9.60626 15.9917 9.67579 16.1006 9.76532 16.1918C9.85485 16.2831 9.96242 16.3547 10.0812 16.402C10.1798 16.4412 10.285 16.4616 10.3912 16.462C10.509 16.4604 10.625 16.4331 10.7312 16.382C10.8552 16.3217 10.9655 16.2364 11.055 16.1314C11.1444 16.0264 11.2112 15.9041 11.2512 15.772L16.4212 1.26203C16.4961 1.09578 16.52 0.911015 16.4897 0.731184C16.4594 0.551354 16.3764 0.384575 16.2512 0.252028ZM9.88116 7.84203L10.1412 7.59203C10.2596 7.48459 10.3457 7.34626 10.3899 7.19258C10.4341 7.0389 10.4345 6.87595 10.3912 6.72203C10.3501 6.56371 10.2631 6.42108 10.1412 6.31203C10.0277 6.20382 9.88527 6.13087 9.73116 6.10203H9.55116C9.43049 6.10498 9.31164 6.13217 9.20169 6.18199C9.09175 6.23181 8.99294 6.30324 8.91116 6.39203L7.20116 8.08203L3.15116 6.19203L14.2312 2.27203L10.3212 13.362L10.1712 13.052C9.59116 11.812 9.00116 10.562 8.44116 9.28203C8.92116 8.81203 9.40116 8.32203 9.88116 7.84203Z" fill="var(--fill-0, #1A1A1A)"/></g></svg>`,
  'top up': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="assignment_add" d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.2C6.41667 1.4 6.77917 0.916667 7.2875 0.55C7.79583 0.183333 8.36667 0 9 0C9.63333 0 10.2042 0.183333 10.7125 0.55C11.2208 0.916667 11.5833 1.4 11.8 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V10.7C17.6833 10.55 17.3583 10.4208 17.025 10.3125C16.6917 10.2042 16.35 10.125 16 10.075V4H2V18H8.05C8.1 18.3667 8.17917 18.7167 8.2875 19.05C8.39583 19.3833 8.525 19.7 8.675 20H2ZM2 18V4V10.075V10V18ZM5 16H8.075C8.125 15.65 8.20417 15.3083 8.3125 14.975C8.42083 14.6417 8.54167 14.3167 8.675 14H5C4.71667 14 4.47917 14.0958 4.2875 14.2875C4.09583 14.4792 4 14.7167 4 15C4 15.2833 4.09583 15.5208 4.2875 15.7125C4.47917 15.9042 4.71667 16 5 16ZM5 12H10.1C10.6333 11.5 11.2292 11.0833 11.8875 10.75C12.5458 10.4167 13.25 10.1917 14 10.075V10H5C4.71667 10 4.47917 10.0958 4.2875 10.2875C4.09583 10.4792 4 10.7167 4 11C4 11.2833 4.09583 11.5208 4.2875 11.7125C4.47917 11.9042 4.71667 12 5 12ZM5 8H13C13.2833 8 13.5208 7.90417 13.7125 7.7125C13.9042 7.52083 14 7.28333 14 7C14 6.71667 13.9042 6.47917 13.7125 6.2875C13.5208 6.09583 13.2833 6 13 6H5C4.71667 6 4.47917 6.09583 4.2875 6.2875C4.09583 6.47917 4 6.71667 4 7C4 7.28333 4.09583 7.52083 4.2875 7.7125C4.47917 7.90417 4.71667 8 5 8ZM9 3.25C9.21667 3.25 9.39583 3.17917 9.5375 3.0375C9.67917 2.89583 9.75 2.71667 9.75 2.5C9.75 2.28333 9.67917 2.10417 9.5375 1.9625C9.39583 1.82083 9.21667 1.75 9 1.75C8.78333 1.75 8.60417 1.82083 8.4625 1.9625C8.32083 2.10417 8.25 2.28333 8.25 2.5C8.25 2.71667 8.32083 2.89583 8.4625 3.0375C8.60417 3.17917 8.78333 3.25 9 3.25ZM15 22C13.6167 22 12.4375 21.5125 11.4625 20.5375C10.4875 19.5625 10 18.3833 10 17C10 15.6167 10.4875 14.4375 11.4625 13.4625C12.4375 12.4875 13.6167 12 15 12C16.3833 12 17.5625 12.4875 18.5375 13.4625C19.5125 14.4375 20 15.6167 20 17C20 18.3833 19.5125 19.5625 18.5375 20.5375C17.5625 21.5125 16.3833 22 15 22ZM14.5 17.5V19.5C14.5 19.6333 14.55 19.75 14.65 19.85C14.75 19.95 14.8667 20 15 20C15.1333 20 15.25 19.95 15.35 19.85C15.45 19.75 15.5 19.6333 15.5 19.5V17.5H17.5C17.6333 17.5 17.75 17.45 17.85 17.35C17.95 17.25 18 17.1333 18 17C18 16.8667 17.95 16.75 17.85 16.65C17.75 16.55 17.6333 16.5 17.5 16.5H15.5V14.5C15.5 14.3667 15.45 14.25 15.35 14.15C15.25 14.05 15.1333 14 15 14C14.8667 14 14.75 14.05 14.65 14.15C14.55 14.25 14.5 14.3667 14.5 14.5V16.5H12.5C12.3667 16.5 12.25 16.55 12.15 16.65C12.05 16.75 12 16.8667 12 17C12 17.1333 12.05 17.25 12.15 17.35C12.25 17.45 12.3667 17.5 12.5 17.5H14.5Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'trash': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="delete" d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'thumb': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 21 19.4" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="thumb_up" d="M5 19.4V6.4L11 0.45C11.25 0.2 11.5458 0.0541667 11.8875 0.0125C12.2292 -0.0291667 12.5583 0.0333333 12.875 0.2C13.1917 0.366667 13.425 0.6 13.575 0.9C13.725 1.2 13.7583 1.50833 13.675 1.825L12.55 6.4H19C19.5333 6.4 20 6.6 20.4 7C20.8 7.4 21 7.86667 21 8.4V10.4C21 10.5167 20.9833 10.6417 20.95 10.775C20.9167 10.9083 20.8833 11.0333 20.85 11.15L17.85 18.2C17.7 18.5333 17.45 18.8167 17.1 19.05C16.75 19.2833 16.3833 19.4 16 19.4H5ZM7 7.25V17.4H16L19 10.4V8.4H10L11.35 2.9L7 7.25ZM2 19.4C1.45 19.4 0.979167 19.2042 0.5875 18.8125C0.195833 18.4208 0 17.95 0 17.4V8.4C0 7.85 0.195833 7.37917 0.5875 6.9875C0.979167 6.59583 1.45 6.4 2 6.4H5V8.4H2V17.4H5V19.4H2Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'theme': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="palette" d="M10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.270833 7.31667 0.8125 6.1C1.35417 4.88333 2.0875 3.825 3.0125 2.925C3.9375 2.025 5.01667 1.3125 6.25 0.7875C7.48333 0.2625 8.8 0 10.2 0C11.5333 0 12.7917 0.229167 13.975 0.6875C15.1583 1.14583 16.1958 1.77917 17.0875 2.5875C17.9792 3.39583 18.6875 4.35417 19.2125 5.4625C19.7375 6.57083 20 7.76667 20 9.05C20 10.9667 19.4167 12.4375 18.25 13.4625C17.0833 14.4875 15.6667 15 14 15H12.15C12 15 11.8958 15.0417 11.8375 15.125C11.7792 15.2083 11.75 15.3 11.75 15.4C11.75 15.6 11.875 15.8875 12.125 16.2625C12.375 16.6375 12.5 17.0667 12.5 17.55C12.5 18.3833 12.2708 19 11.8125 19.4C11.3542 19.8 10.75 20 10 20ZM4.5 11C4.93333 11 5.29167 10.8583 5.575 10.575C5.85833 10.2917 6 9.93333 6 9.5C6 9.06667 5.85833 8.70833 5.575 8.425C5.29167 8.14167 4.93333 8 4.5 8C4.06667 8 3.70833 8.14167 3.425 8.425C3.14167 8.70833 3 9.06667 3 9.5C3 9.93333 3.14167 10.2917 3.425 10.575C3.70833 10.8583 4.06667 11 4.5 11ZM7.5 7C7.93333 7 8.29167 6.85833 8.575 6.575C8.85833 6.29167 9 5.93333 9 5.5C9 5.06667 8.85833 4.70833 8.575 4.425C8.29167 4.14167 7.93333 4 7.5 4C7.06667 4 6.70833 4.14167 6.425 4.425C6.14167 4.70833 6 5.06667 6 5.5C6 5.93333 6.14167 6.29167 6.425 6.575C6.70833 6.85833 7.06667 7 7.5 7ZM12.5 7C12.9333 7 13.2917 6.85833 13.575 6.575C13.8583 6.29167 14 5.93333 14 5.5C14 5.06667 13.8583 4.70833 13.575 4.425C13.2917 4.14167 12.9333 4 12.5 4C12.0667 4 11.7083 4.14167 11.425 4.425C11.1417 4.70833 11 5.06667 11 5.5C11 5.93333 11.1417 6.29167 11.425 6.575C11.7083 6.85833 12.0667 7 12.5 7ZM15.5 11C15.9333 11 16.2917 10.8583 16.575 10.575C16.8583 10.2917 17 9.93333 17 9.5C17 9.06667 16.8583 8.70833 16.575 8.425C16.2917 8.14167 15.9333 8 15.5 8C15.0667 8 14.7083 8.14167 14.425 8.425C14.1417 8.70833 14 9.06667 14 9.5C14 9.93333 14.1417 10.2917 14.425 10.575C14.7083 10.8583 15.0667 11 15.5 11ZM10 18C10.15 18 10.2708 17.9583 10.3625 17.875C10.4542 17.7917 10.5 17.6833 10.5 17.55C10.5 17.3167 10.375 17.0417 10.125 16.725C9.875 16.4083 9.75 15.9333 9.75 15.3C9.75 14.6 9.99167 14.0417 10.475 13.625C10.9583 13.2083 11.55 13 12.25 13H14C15.1 13 16.0417 12.6792 16.825 12.0375C17.6083 11.3958 18 10.4 18 9.05C18 7.03333 17.2292 5.35417 15.6875 4.0125C14.1458 2.67083 12.3167 2 10.2 2C7.93333 2 6 2.775 4.4 4.325C2.8 5.875 2 7.76667 2 10C2 12.2167 2.77917 14.1042 4.3375 15.6625C5.89583 17.2208 7.78333 18 10 18Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'recipient': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20 19.575" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="output_circle" d="M11 16.175L12.9 14.3C13.0833 14.1167 13.3167 14.025 13.6 14.025C13.8833 14.025 14.1167 14.1167 14.3 14.3C14.4833 14.4833 14.575 14.7167 14.575 15C14.575 15.2833 14.4833 15.5167 14.3 15.7L10.7 19.3C10.5167 19.4833 10.2833 19.575 10 19.575C9.71667 19.575 9.48333 19.4833 9.3 19.3L5.7 15.7C5.51667 15.5167 5.425 15.2833 5.425 15C5.425 14.7167 5.51667 14.4833 5.7 14.3C5.88333 14.1167 6.11667 14.025 6.4 14.025C6.68333 14.025 6.91667 14.1167 7.1 14.3L9 16.175V7C9 6.71667 9.09583 6.47917 9.2875 6.2875C9.47917 6.09583 9.71667 6 10 6C10.2833 6 10.5208 6.09583 10.7125 6.2875C10.9042 6.47917 11 6.71667 11 7V16.175ZM10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 10.55 2.05417 11.0917 2.1625 11.625C2.27083 12.1583 2.43333 12.675 2.65 13.175C2.76667 13.4583 2.80417 13.7417 2.7625 14.025C2.72083 14.3083 2.59167 14.5583 2.375 14.775C2.175 14.975 1.92917 15.0208 1.6375 14.9125C1.34583 14.8042 1.125 14.5917 0.975 14.275C0.658333 13.5917 0.416667 12.8958 0.25 12.1875C0.0833333 11.4792 0 10.75 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 10.75 19.9208 11.4875 19.7625 12.2125C19.6042 12.9375 19.3583 13.6417 19.025 14.325C18.875 14.625 18.6542 14.825 18.3625 14.925C18.0708 15.025 17.825 14.975 17.625 14.775C17.425 14.575 17.2958 14.3333 17.2375 14.05C17.1792 13.7667 17.2083 13.4917 17.325 13.225C17.5583 12.7083 17.7292 12.1792 17.8375 11.6375C17.9458 11.0958 18 10.55 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'reload': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="refresh" d="M8 16C5.76667 16 3.875 15.225 2.325 13.675C0.775 12.125 0 10.2333 0 8C0 5.76667 0.775 3.875 2.325 2.325C3.875 0.775 5.76667 0 8 0C9.15 0 10.25 0.2375 11.3 0.7125C12.35 1.1875 13.25 1.86667 14 2.75V1C14 0.716667 14.0958 0.479167 14.2875 0.2875C14.4792 0.0958333 14.7167 0 15 0C15.2833 0 15.5208 0.0958333 15.7125 0.2875C15.9042 0.479167 16 0.716667 16 1V6C16 6.28333 15.9042 6.52083 15.7125 6.7125C15.5208 6.90417 15.2833 7 15 7H10C9.71667 7 9.47917 6.90417 9.2875 6.7125C9.09583 6.52083 9 6.28333 9 6C9 5.71667 9.09583 5.47917 9.2875 5.2875C9.47917 5.09583 9.71667 5 10 5H13.2C12.6667 4.06667 11.9375 3.33333 11.0125 2.8C10.0875 2.26667 9.08333 2 8 2C6.33333 2 4.91667 2.58333 3.75 3.75C2.58333 4.91667 2 6.33333 2 8C2 9.66667 2.58333 11.0833 3.75 12.25C4.91667 13.4167 6.33333 14 8 14C9.13333 14 10.1708 13.7125 11.1125 13.1375C12.0542 12.5625 12.7833 11.7917 13.3 10.825C13.4333 10.5917 13.6208 10.4292 13.8625 10.3375C14.1042 10.2458 14.35 10.2417 14.6 10.325C14.8667 10.4083 15.0583 10.5833 15.175 10.85C15.2917 11.1167 15.2833 11.3667 15.15 11.6C14.4667 12.9333 13.4917 14 12.225 14.8C10.9583 15.6 9.55 16 8 16Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'gallery': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="satellite" d="M3 9C4.66667 9 6.08333 8.41667 7.25 7.25C8.41667 6.08333 9 4.66667 9 3H7.3C7.3 4.2 6.88333 5.21667 6.05 6.05C5.21667 6.88333 4.2 7.3 3 7.3V9ZM3 5.6C3.71667 5.6 4.32083 5.34583 4.8125 4.8375C5.30417 4.32917 5.55 3.71667 5.55 3H3V5.6ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V2H2V16ZM4 14H14C14.2 14 14.35 13.9083 14.45 13.725C14.55 13.5417 14.5333 13.3667 14.4 13.2L11.65 9.525C11.55 9.39167 11.4167 9.325 11.25 9.325C11.0833 9.325 10.95 9.39167 10.85 9.525L8.25 13L6.4 10.525C6.3 10.3917 6.16667 10.325 6 10.325C5.83333 10.325 5.7 10.3917 5.6 10.525L3.6 13.2C3.46667 13.3667 3.45 13.5417 3.55 13.725C3.65 13.9083 3.8 14 4 14Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'gas': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="propane_tank" d="M4 20C2.9 20 1.95833 19.6083 1.175 18.825C0.391667 18.0417 0 17.1 0 16V8C0 7.05 0.283333 6.225 0.85 5.525C1.41667 4.825 2.13333 4.35833 3 4.125V2C3 1.45 3.19583 0.979167 3.5875 0.5875C3.97917 0.195833 4.45 0 5 0H11C11.55 0 12.0208 0.195833 12.4125 0.5875C12.8042 0.979167 13 1.45 13 2V4.125C13.8667 4.35833 14.5833 4.825 15.15 5.525C15.7167 6.225 16 7.05 16 8V16C16 17.1 15.6083 18.0417 14.825 18.825C14.0417 19.6083 13.1 20 12 20H4ZM2 11H14V8C14 7.45 13.8042 6.97917 13.4125 6.5875C13.0208 6.19583 12.55 6 12 6H4C3.45 6 2.97917 6.19583 2.5875 6.5875C2.19583 6.97917 2 7.45 2 8V11ZM4 18H12C12.55 18 13.0208 17.8042 13.4125 17.4125C13.8042 17.0208 14 16.55 14 16V13H2V16C2 16.55 2.19583 17.0208 2.5875 17.4125C2.97917 17.8042 3.45 18 4 18ZM9 4H11V2H5V4H7C7 3.71667 7.09583 3.47917 7.2875 3.2875C7.47917 3.09583 7.71667 3 8 3C8.28333 3 8.52083 3.09583 8.7125 3.2875C8.90417 3.47917 9 3.71667 9 4Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
  'gift': `<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path id="featured_seasonal_and_gifts" d="M2 19V10C1.45 10 0.979167 9.80417 0.5875 9.4125C0.195833 9.02083 0 8.55 0 8V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H5.2C5.11667 3.85 5.0625 3.69167 5.0375 3.525C5.0125 3.35833 5 3.18333 5 3C5 2.16667 5.29167 1.45833 5.875 0.875C6.45833 0.291667 7.16667 0 8 0C8.38333 0 8.74167 0.0708333 9.075 0.2125C9.40833 0.354167 9.71667 0.55 10 0.8C10.2833 0.533333 10.5917 0.333333 10.925 0.2C11.2583 0.0666667 11.6167 0 12 0C12.8333 0 13.5417 0.291667 14.125 0.875C14.7083 1.45833 15 2.16667 15 3C15 3.18333 14.9833 3.35417 14.95 3.5125C14.9167 3.67083 14.8667 3.83333 14.8 4H18C18.55 4 19.0208 4.19583 19.4125 4.5875C19.8042 4.97917 20 5.45 20 6V8C20 8.55 19.8042 9.02083 19.4125 9.4125C19.0208 9.80417 18.55 10 18 10V19C18 19.55 17.8042 20.0208 17.4125 20.4125C17.0208 20.8042 16.55 21 16 21H4C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19ZM12 2C11.7167 2 11.4792 2.09583 11.2875 2.2875C11.0958 2.47917 11 2.71667 11 3C11 3.28333 11.0958 3.52083 11.2875 3.7125C11.4792 3.90417 11.7167 4 12 4C12.2833 4 12.5208 3.90417 12.7125 3.7125C12.9042 3.52083 13 3.28333 13 3C13 2.71667 12.9042 2.47917 12.7125 2.2875C12.5208 2.09583 12.2833 2 12 2ZM7 3C7 3.28333 7.09583 3.52083 7.2875 3.7125C7.47917 3.90417 7.71667 4 8 4C8.28333 4 8.52083 3.90417 8.7125 3.7125C8.90417 3.52083 9 3.28333 9 3C9 2.71667 8.90417 2.47917 8.7125 2.2875C8.52083 2.09583 8.28333 2 8 2C7.71667 2 7.47917 2.09583 7.2875 2.2875C7.09583 2.47917 7 2.71667 7 3ZM2 6V8H9V6H2ZM9 19V10H4V19H9ZM11 19H16V10H11V19ZM18 8V6H11V8H18Z" fill="var(--fill-0, #1A1A1A)"/></svg>`,
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

const ICONOGRAPHY_MANIFEST_PATH = 'assets/icons/iconography-manifest.json';
let iconographyManifestPromise = null;
const iconographySvgCache = new Map();

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function escapeJsString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function loadIconographyManifest() {
  if (!iconographyManifestPromise) {
    iconographyManifestPromise = fetch(ICONOGRAPHY_MANIFEST_PATH).then(res => {
      if (!res.ok) throw new Error('Failed to load iconography manifest');
      return res.json();
    });
  }
  return iconographyManifestPromise;
}

async function loadIconAsset(file) {
  if (!file) return '';
  if (!iconographySvgCache.has(file)) {
    iconographySvgCache.set(file, fetch(file).then(res => {
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return res.text();
    }));
  }
  return iconographySvgCache.get(file);
}

async function buildIconography() {
  const hero = document.getElementById('iconography-hero-preview');
  const styles = document.getElementById('iconography-style-strip');
  const inventory = document.getElementById('iconography-groups');
  const totals = document.getElementById('iconography-totals');

  try {
    const manifest = await loadIconographyManifest();

    if (hero) {
      hero.innerHTML = manifest.hero.map(icon => `
        <div class="icon-hero-card">
          <div class="icon-hero-glyph">
            <img src="${escapeAttr(icon.file)}" alt="${escapeAttr(icon.label)}">
          </div>
          <div class="icon-hero-label">${icon.label}</div>
        </div>
      `).join('');
    }

    if (styles) {
      styles.innerHTML = [
        ['Available', manifest.totals.available],
        ['Missing', manifest.totals.missing],
        ['Variants', manifest.totals.variants]
      ].map(([label, count]) => `
        <span class="token-chip"><span class="chip-swatch icon-chip-swatch"></span>${label} · ${count}</span>
      `).join('');
    }

    if (inventory) {
      inventory.innerHTML = manifest.groups.map(group => {
        const readyCount = group.icons.filter(icon => icon.file).length;
        const variantCount = group.icons.reduce((sum, icon) => sum + icon.variants, 0);
        return `
          <section class="icon-group-section">
            <div class="icon-group-header">
              <div>
                <div class="icon-group-letter">${group.heading}</div>
                <div class="icon-group-meta">${group.icons.length} icon groups · ${variantCount} variants · ${readyCount} exported</div>
              </div>
            </div>
            <div class="icon-group-grid">
              ${group.icons.map(icon => {
                const hasFile = Boolean(icon.file);
                const statusLabel = hasFile ? 'SVG ready' : 'Figma only';
                return `
                  <article class="icon-item-card ${hasFile ? '' : 'is-missing'}">
                    <div class="icon-item-preview ${hasFile ? '' : 'is-missing'}">
                      ${hasFile ? `<img src="${escapeAttr(icon.file)}" alt="${escapeAttr(icon.name)}">` : 'Figma'}
                    </div>
                    <div class="icon-item-actions">
                      <button class="icon-action-btn" ${hasFile ? `onclick="copyIconAsset('${escapeJsString(icon.file)}','${escapeJsString(icon.name)}')"` : 'disabled'}>Copy SVG</button>
                      <button class="icon-action-btn" ${hasFile ? `onclick="downloadIconAsset('${escapeJsString(icon.file)}','${escapeJsString(icon.slug)}')"` : 'disabled'}>Download SVG</button>
                    </div>
                    <div class="icon-item-head">
                      <h3>${icon.name}</h3>
                      <span class="icon-item-count">${icon.variants}</span>
                    </div>
                    <p>${icon.variants === 1 ? 'Single documented Figma variant' : `${icon.variants} documented Figma variants`}</p>
                    <div class="icon-status">
                      <span class="icon-status-dot ${hasFile ? 'ready' : ''}"></span>${statusLabel}
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </section>
        `;
      }).join('');
    }

    if (totals) {
      totals.innerHTML = `
        <strong>${manifest.totals.groups} icon groups · ${manifest.totals.variants} variants</strong>
        <span>${manifest.totals.available} local SVG assets available now · ${manifest.totals.missing} groups still documented from Figma only.</span>
      `;
    }
  } catch (error) {
    if (totals) {
      totals.innerHTML = `
        <strong>Icon manifest unavailable</strong>
        <span>Could not load the generated iconography asset inventory.</span>
      `;
    }
    if (inventory) {
      inventory.innerHTML = `
        <div class="usage-card">
          <div class="usage-icon icon-usage-icon">!</div>
          <div class="usage-content">
            <strong>Unable to load iconography manifest</strong>
            <p>Make sure the generated asset files in <code>assets/icons</code> are available from the current local server.</p>
          </div>
        </div>
      `;
    }
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

async function exportIconTokens() {
  const manifest = await loadIconographyManifest();
  const payload = {
    iconography: manifest
  };
  const b = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'atreus-iconography-manifest.json';
  a.click();
}

async function copyIconInventory() {
  const manifest = await loadIconographyManifest();
  const payload = JSON.stringify({
    totals: manifest.totals,
    groups: manifest.groups
  }, null, 2);
  copyText(payload, 'Icon inventory copied!');
}

async function copyIconAsset(file, label) {
  const svg = await loadIconAsset(file);
  if (!svg) {
    copyText(label, `No SVG asset available for ${label}`);
    return;
  }
  copyText(svg, `${label} SVG copied!`);
}

async function downloadIconAsset(file, slug) {
  const svg = await loadIconAsset(file);
  if (!svg) return;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `icon-${slug}.svg`;
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
