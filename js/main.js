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
    case 'buttons':
      updateBtnPreview();
      break;
    case 'bottomsheets':
      if (typeof renderBlocker === 'function') renderBlocker('rekening');
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

const ADAPTIVE = {
  background:{label:'Background',sub:'UI-1, UI-2, UI-3 — Base surface and container layers',tokens:[
    {token:'$background-ui-1',usage:'Default application surface',hex:'#FFFFFF',ref:'Gray 0'},
    {token:'$background-ui-2',usage:'Components surface above background 1',hex:'#F3F3F3',ref:'Gray 10'},
    {token:'$background-ui-3',usage:'Components surface above background 2',hex:'#DADADA',ref:'Gray 20'},
  ]},
  button_primary:{label:'Button / Primary',sub:'Background tokens for primary CTA button states',tokens:[
    {token:'$button-primary-default',usage:'Default background color of Primary Button',hex:'#87CCA9',ref:'Green 40'},
    {token:'$button-primary-disabled',usage:'Background color of Disabled Button',hex:'#F3F3F3',ref:'Gray 10'},
  ]},
  button_outlined:{label:'Button / Outlined',sub:'Border token for outlined button variant',tokens:[
    {token:'$button-outlined-default',usage:'Default border color of Outlined Button',hex:'#238453',ref:'Green 90'},
    {token:'$button-outlined-disabled',usage:'Disabled border of Outlined Button',hex:'#CBFEEC',ref:'Green 20'},
  ]},
  border:{label:'Border',sub:'Dividers, outlines, focus rings, separators',tokens:[
    {token:'$border-vibrant',usage:'Default primary color of Outlined Component',hex:'#FE6201',ref:'Orange 70'},
    {token:'$border-soft',usage:'Default secondary color of Outlined Component',hex:'#007E99',ref:'Teal 70'},
    {token:'$border-harmony',usage:'Default tertiary color of Outlined Component',hex:'#238453',ref:'Green 90'},
    {token:'$border-primary',usage:'Decorative primary border',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'$border-decorative-1',usage:'Decorative border level 1',hex:'#CDCDCD',ref:'Gray 30'},
    {token:'$border-decorative-2',usage:'Decorative border level 2',hex:'#DADADA',ref:'Gray 20'},
    {token:'$border-decorative-3',usage:'Decorative border level 3',hex:'#F3F3F3',ref:'Gray 10'},
    {token:'$border-decorative-4',usage:'Decorative border level 4',hex:'#F6F6F6',ref:'Gray 5'},
    {token:'$border-decorative-adaptive',usage:'Adaptive neutral border for Outlined/Border components',hex:'rgba(26,26,26,0.08)',ref:'Gray 90 · 8%'},
  ]},
  foreground:{label:'Foreground',sub:'Vibrant (Orange), Soft (Teal), and Harmony (Green) surface colors',tokens:[
    {token:'$foreground-vibrant-1',usage:'Default orange surface',hex:'#FE6201',ref:'Orange 70'},
    {token:'$foreground-vibrant-2',usage:'Soft orange surface',hex:'#FF9B00',ref:'Orange 50'},
    {token:'$foreground-vibrant-3',usage:'Softer orange surface',hex:'#FEDFCB',ref:'Orange 20'},
    {token:'$foreground-vibrant-4',usage:'Lightest orange surface',hex:'#FEEDDF',ref:'Orange 10'},
    {token:'$foreground-soft-1',usage:'Default teal surface',hex:'#007E99',ref:'Teal 70'},
    {token:'$foreground-soft-2',usage:'Soft teal surface',hex:'#77C8D9',ref:'Teal 20'},
    {token:'$foreground-soft-3',usage:'Lightest teal surface',hex:'#D8ECED',ref:'Teal 10'},
    {token:'$foreground-harmony-1',usage:'Default green surface',hex:'#85CCB3',ref:'Green 30'},
    {token:'$foreground-harmony-2',usage:'Soft green surface',hex:'#CBFEEC',ref:'Green 20'},
    {token:'$foreground-harmony-3',usage:'Lightest green surface',hex:'#CCE9DF',ref:'Green 10'},
  ]},
  foreground_icon:{label:'Foreground / Icon',sub:'Clickable and decorative icon colors',tokens:[
    {token:'$foreground-icon-primary',usage:'Default clickable icon',hex:'#238453',ref:'Green 90'},
    {token:'$foreground-icon-secondary',usage:'Default orange icon',hex:'#FE6201',ref:'Orange 70'},
  ]},
  foreground_icon_neutral:{label:'Foreground / Icon / Neutral',sub:'Neutral icon colors across all states',tokens:[
    {token:'$foreground-icon-neutral-primary',usage:'Default primary icon color',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'$foreground-icon-neutral-secondary',usage:'Default secondary icon color',hex:'#828282',ref:'Gray 60'},
    {token:'$foreground-icon-neutral-disabled',usage:'Disabled icon',hex:'#CDCDCD',ref:'Gray 30'},
    {token:'$foreground-icon-neutral-inverse',usage:'Primary icon on dark background',hex:'#FFFFFF',ref:'Gray 0'},
  ]},
  text_primary:{label:'Text / Primary',sub:'Primary text color tokens',tokens:[
    {token:'$text-primary',usage:'Default primary text',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'$text-secondary',usage:'Default secondary text',hex:'#828282',ref:'Gray 60'},
  ]},
  text:{label:'Text',sub:'Full branded and neutral text token set',tokens:[
    {token:'$text-vibrant',usage:'Orange branded text',hex:'#FE6201',ref:'Orange 70'},
    {token:'$text-vibrant-alt',usage:'Secondary orange text',hex:'#FF9B00',ref:'Orange 50'},
    {token:'$text-soft',usage:'Teal branded text',hex:'#007E99',ref:'Teal 70'},
    {token:'$text-soft-alt',usage:'Secondary teal text',hex:'#77C8D9',ref:'Teal 20'},
    {token:'$text-harmony',usage:'Green branded text',hex:'#238453',ref:'Green 90'},
    {token:'$text-harmony-alt',usage:'Secondary green text',hex:'#85CCB3',ref:'Green 30'},
    {token:'$text-neutral',usage:'Neutral body text',hex:'#1A1A1A',ref:'Gray 90'},
    {token:'$text-neutral-secondary',usage:'Neutral secondary body text',hex:'#828282',ref:'Gray 60'},
  ]},
  overlay:{label:'Overlay',sub:'Scrim and overlay surface tokens',tokens:[
    {token:'$overlay-primary',usage:'Default overlay scrim',hex:'rgba(26,26,26,0.32)',ref:'Gray 90 · 32%'},
    {token:'$overlay-secondary',usage:'Secondary lighter overlay',hex:'rgba(26,26,26,0.16)',ref:'Gray 90 · 16%'},
  ]},
  semantic:{label:'Semantic',sub:'Feedback and status state colors',tokens:[
    {token:'$semantic-error',usage:'Error state color',hex:'#CE0101',ref:'Red 70'},
    {token:'$semantic-warning',usage:'Warning state color',hex:'#FF9B00',ref:'Orange 50'},
    {token:'$semantic-success',usage:'Success state color',hex:'#238453',ref:'Green 90'},
    {token:'$semantic-info',usage:'Info / informational state',hex:'#007E99',ref:'Teal 70'},
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