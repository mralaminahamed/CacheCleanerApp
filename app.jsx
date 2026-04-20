// Cache Cleaner — Interactive macOS-style prototype
// Builds all core screens, wired with state. Keep components small.

const { useState, useEffect, useRef, useMemo } = React;

// ───────── Tokens ─────────
const FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", "Helvetica Neue", sans-serif';
const MONO = '"SF Mono", ui-monospace, Menlo, Monaco, "Cascadia Mono", monospace';

const TOKENS = {
  light: {
    winBg: '#ECECEE',
    sidebar: 'rgba(235,238,244,0.85)',
    content: '#FFFFFF',
    card: '#F6F6F8',
    cardHover: '#EEEEF1',
    border: 'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(0,0,0,0.14)',
    divider: 'rgba(0,0,0,0.06)',
    text: '#1D1D1F',
    textMuted: '#6E6E73',
    textFaint: '#8E8E93',
    rowAlt: '#FAFAFB',
    rowHover: 'rgba(0,0,0,0.035)',
    input: '#FFFFFF',
    inputBorder: 'rgba(0,0,0,0.12)',
    focusRing: 'rgba(0,160,160,0.35)',
    buttonBg: '#FFFFFF',
    buttonText: '#1D1D1F',
    infoBg: '#E8F5FB',
    infoBorder: 'rgba(0,160,160,0.35)',
  },
  dark: {
    winBg: '#1E1E20',
    sidebar: 'rgba(40,40,44,0.92)',
    content: '#242427',
    card: '#2C2C2F',
    cardHover: '#343439',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.16)',
    divider: 'rgba(255,255,255,0.06)',
    text: '#F5F5F7',
    textMuted: '#A1A1A6',
    textFaint: '#8E8E93',
    rowAlt: '#29292C',
    rowHover: 'rgba(255,255,255,0.045)',
    input: '#1C1C1E',
    inputBorder: 'rgba(255,255,255,0.12)',
    focusRing: 'rgba(50,212,224,0.45)',
    buttonBg: '#38383B',
    buttonText: '#F5F5F7',
    infoBg: '#15272D',
    infoBorder: 'rgba(50,212,224,0.35)',
  },
};

const ACCENTS = {
  teal:   { light: '#00A0A0', dark: '#32D4E0' },
  indigo: { light: '#3E5BD9', dark: '#7A95FF' },
  graphite: { light: '#2B2B2F', dark: '#D9D9DB' },
};

const SAFETY = {
  safe:      { l: { bg: '#E4F6EA', fg: '#1B7F3E', dot: '#22A555' }, d: { bg: 'rgba(52,199,89,0.14)', fg: '#70DC8E', dot: '#34C759' }, label: 'Safe' },
  caution:   { l: { bg: '#FDF4DC', fg: '#8A5A00', dot: '#E4A700' }, d: { bg: 'rgba(255,204,0,0.14)', fg: '#FFD84D', dot: '#FFCC00' }, label: 'Caution' },
  dangerous: { l: { bg: '#FBE4E6', fg: '#9B1C28', dot: '#DC3545' }, d: { bg: 'rgba(255,85,85,0.18)', fg: '#FF8A8A', dot: '#FF5555' }, label: 'Dangerous' },
};

const CATEGORIES = {
  Browser:  { hue: 210 },
  System:   { hue: 280 },
  Temp:     { hue: 32 },
  App:      { hue: 145 },
  Xcode:    { hue: 0 },
};

// ───────── Icons (simple inline SVGs, no brand glyphs) ─────────
const I = {
  search: (s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke={c} strokeWidth="1.5"/><path d="M10.5 10.5l3 3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>),
  drive: (s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="2" stroke={c} strokeWidth="1.4"/><circle cx="11.5" cy="8" r="0.9" fill={c}/></svg>),
  recycle: (s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 10l-1.5 2 2 2M12 6l1.5-2-2-2M3 12h5l2-3.5M13 4H8L6 7.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  check: (s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={c} strokeWidth="1.4"/><path d="M5 8.2l2 2 4-4" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  dot: (s=10,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 10 10"><circle cx="5" cy="5" r="4.2" fill={c}/></svg>),
  chev: (s=10,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 10 10" fill="none"><path d="M3 4l2 2 2-2" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  chevRight: (s=10,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 10 10" fill="none"><path d="M4 3l2 2-2 2" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  home:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2.5 7.5L8 3l5.5 4.5v5a1 1 0 01-1 1h-2.5v-4h-4v4H3.5a1 1 0 01-1-1v-5z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/></svg>),
  list:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 4h10M3 8h10M3 12h10" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  gear:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.2" stroke={c} strokeWidth="1.3"/><path d="M8 2v1.5M8 12.5V14M14 8h-1.5M3.5 8H2M12.2 3.8l-1 1M4.8 11.2l-1 1M12.2 12.2l-1-1M4.8 4.8l-1-1" stroke={c} strokeWidth="1.3" strokeLinecap="round"/></svg>),
  chart:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2.5 13V8M6 13V4M9.5 13V9M13 13V6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>),
  folder:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M2 5a1 1 0 011-1h3l1.5 1.5H13a1 1 0 011 1V12a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/></svg>),
  doc:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 2.5h5L12 5v8a0.5 0.5 0 01-0.5 0.5h-7A0.5 0.5 0 014 13V3a0.5 0.5 0 010-0.5z" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/><path d="M9 2.5V5h3" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/></svg>),
  img:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke={c} strokeWidth="1.3"/><circle cx="6" cy="7" r="1.2" stroke={c} strokeWidth="1.3"/><path d="M2.5 12l3.5-3 3 2.5 2-2 3 2.5" stroke={c} strokeWidth="1.3" strokeLinejoin="round"/></svg>),
  code:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M5.5 5L3 8l2.5 3M10.5 5L13 8l-2.5 3M9 4l-2 8" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  warn:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2.5L14.5 13.5H1.5L8 2.5z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/><path d="M8 7v3M8 11.8v.4" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  info:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={c} strokeWidth="1.3"/><path d="M8 7.5v3.5M8 5.3v.4" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  lock:(s=14,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 16 16" fill="none"><rect x="3.5" y="7" width="9" height="6.5" rx="1.3" stroke={c} strokeWidth="1.3"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke={c} strokeWidth="1.3"/></svg>),
  xMark:(s=10,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  plus:(s=10,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5h6" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>),
  refresh:(s=12,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M12 6a5 5 0 10-1 3.5M12 3v3h-3" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  sort:(s=10,c='currentColor')=>(<svg width={s} height={s} viewBox="0 0 10 10" fill="none"><path d="M3 3l2-2 2 2M3 7l2 2 2-2" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

// ───────── Utils ─────────
function fmtBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024*1024) return `${(b/1024).toFixed(1)} KB`;
  if (b < 1024*1024*1024) return `${(b/1024/1024).toFixed(1)} MB`;
  return `${(b/1024/1024/1024).toFixed(2)} GB`;
}
function fmtNum(n) { return n.toLocaleString('en-US'); }
function relTime(min) {
  if (min < 1) return 'just now';
  if (min < 60) return `${Math.floor(min)} min ago`;
  const h = Math.floor(min/60);
  if (h < 24) return `${h} hour${h>1?'s':''} ago`;
  const d = Math.floor(h/24);
  return `${d} day${d>1?'s':''} ago`;
}

// Deterministic demo data
const DEMO_FILES = (() => {
  const cats = [
    { k:'Browser', paths:[
      '~/Library/Caches/com.apple.Safari/WebKitCache','~/Library/Caches/com.brave.Browser/Default','~/Library/Caches/com.google.Chrome/Default/Code Cache','~/Library/Caches/org.mozilla.firefox/Profiles/default.cache2','~/Library/Caches/com.apple.Safari/Downloads','~/Library/Caches/com.google.Chrome/Default/GPUCache',
    ]},
    { k:'System', paths:[
      '/Library/Caches/com.apple.dt.Xcode','/Library/Caches/com.apple.iconservices','/System/Library/Caches/com.apple.IntlDataCache','/Library/Caches/com.apple.dock','/private/var/folders/_cache/BridgeOS','/Library/Caches/com.apple.iconservices.store',
    ]},
    { k:'Temp', paths:[
      '/private/tmp/node-build.tmp','/private/tmp/packer-build-1847','/private/var/folders/kp/.TemporaryItems','/private/tmp/homebrew-curl','/private/tmp/cc-dump-a8f','/private/tmp/yarn-cache',
    ]},
    { k:'App', paths:[
      '~/Library/Application Support/Slack/Cache','~/Library/Application Support/Notion/cache','~/Library/Application Support/Spotify/PersistentCache','~/Library/Application Support/Figma/Desktop/Cache','~/Library/Application Support/Discord/Cache','~/Library/Application Support/Linear/Cache',
    ]},
    { k:'Xcode', paths:[
      '~/Library/Developer/Xcode/DerivedData/Project-abc/Build','~/Library/Developer/Xcode/iOS DeviceSupport/17.4','~/Library/Developer/Xcode/Archives/2025-03-14','~/Library/Developer/CoreSimulator/Caches','~/Library/Developer/Xcode/DerivedData/ModuleCache.noindex','~/Library/Developer/Xcode/UserData/IDEPreferencesController.xcuserstate',
    ]},
  ];
  const safeties = ['safe','safe','safe','safe','caution','caution','dangerous'];
  const types = ['folder','folder','doc','folder','img','code'];
  const seed = (i) => ((i*2654435761) % 2**32) / 2**32;
  const rows = [];
  let id = 0;
  cats.forEach((cat, ci) => {
    cat.paths.forEach((p, pi) => {
      const rep = 3 + Math.floor(seed(ci*31+pi)*3);
      for (let r=0; r<rep; r++) {
        const s = seed(id*17+3);
        const size = Math.floor(100_000 + s * 2_500_000_000); // 100KB .. 2.5GB
        const mins = Math.floor(10 + seed(id*11+7) * 60*24*14);
        const safety = safeties[Math.floor(seed(id*13+2)*safeties.length)];
        const type = types[Math.floor(seed(id*19+5)*types.length)];
        const suffix = r>0 ? `/shard-${r.toString(16)}.dat` : '';
        rows.push({
          id: id++,
          path: p + suffix,
          size, mins,
          category: cat.k,
          safety,
          type,
        });
      }
    });
  });
  return rows;
})();

const TOTAL_BYTES = DEMO_FILES.reduce((a,b)=>a+b.size,0);
const SAFE_BYTES = DEMO_FILES.filter(f=>f.safety==='safe').reduce((a,b)=>a+b.size,0);

// ───────── Primitives ─────────
function Pressable({ children, onClick, style, disabled, title, ariaLabel }) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  return (
    <div
      role="button"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      tabIndex={disabled?-1:0}
      title={title}
      onClick={(e)=>!disabled && onClick && onClick(e)}
      onKeyDown={(e)=>{ if(!disabled && (e.key==='Enter'||e.key===' ')){e.preventDefault(); onClick && onClick(e);} }}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>{setHover(false); setDown(false);}}
      onMouseDown={()=>setDown(true)} onMouseUp={()=>setDown(false)}
      style={{
        userSelect:'none', cursor: disabled?'not-allowed':'pointer',
        opacity: disabled?0.45:1,
        transform: down?'translateY(0.5px)':'none',
        transition:'background 120ms, transform 80ms, box-shadow 120ms',
        outline:'none',
        ...style,
        ...(hover && !disabled ? style?.__hover || {} : {}),
      }}
    >{children}</div>
  );
}

function Button({ variant='default', size='md', icon, children, onClick, disabled, style, full, T, A }) {
  const pad = size==='sm' ? '0 10px' : size==='lg' ? '0 18px' : '0 14px';
  const h = size==='sm' ? 26 : size==='lg' ? 44 : 30;
  const fs = size==='lg' ? 15 : 13;
  let bg, color, border, shadow;
  if (variant==='primary') {
    bg = A; color = '#fff'; border = `0.5px solid ${A}`;
    shadow = `inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 0 rgba(0,0,0,0.08)`;
  } else if (variant==='destructive') {
    bg = '#DC3545'; color = '#fff'; border = '0.5px solid #C02232';
    shadow = `inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 0 rgba(0,0,0,0.12)`;
  } else if (variant==='ghost') {
    bg = 'transparent'; color = T.text; border = '0.5px solid transparent';
    shadow = 'none';
  } else {
    bg = T.buttonBg; color = T.buttonText; border = `0.5px solid ${T.borderStrong}`;
    shadow = `inset 0 0.5px 0 rgba(255,255,255,0.3), 0 1px 0 rgba(0,0,0,0.04)`;
  }
  return (
    <Pressable onClick={onClick} disabled={disabled} style={{
      height: h, padding: pad, display:'inline-flex', alignItems:'center', gap: 6,
      background: bg, color, border, borderRadius: 7, boxShadow: shadow,
      fontFamily: FONT, fontSize: fs, fontWeight: 500,
      width: full ? '100%' : 'auto', justifyContent:'center',
      whiteSpace: 'nowrap', flexShrink: 0,
      ...style,
    }}>
      {icon}
      {children}
    </Pressable>
  );
}

function Checkbox({ checked, indeterminate, onChange, T, A, size=14 }) {
  return (
    <div role="checkbox" aria-checked={indeterminate?'mixed':checked}
      onClick={(e)=>{e.stopPropagation(); onChange && onChange(!checked);}}
      style={{
        width:size, height:size, borderRadius:4,
        border: `1px solid ${checked||indeterminate ? A : T.borderStrong}`,
        background: checked||indeterminate ? A : T.input,
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', flexShrink:0, transition:'background 120ms, border-color 120ms',
      }}>
      {checked && !indeterminate && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5.2l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {indeterminate && <div style={{ width: 7, height: 1.5, background:'#fff', borderRadius:1 }}/>}
    </div>
  );
}

function Toggle({ on, onChange, A, T }) {
  return (
    <div role="switch" aria-checked={on}
      onClick={()=>onChange(!on)}
      style={{
        width: 36, height: 22, borderRadius: 11,
        background: on ? A : (T===TOKENS.dark?'#48484A':'#D1D1D6'),
        position:'relative', cursor:'pointer',
        transition:'background 160ms',
        boxShadow: on ? 'inset 0 1px 2px rgba(0,0,0,0.15)' : 'inset 0 1px 2px rgba(0,0,0,0.1)',
      }}>
      <div style={{
        position:'absolute', top:2, left: on ? 16 : 2,
        width: 18, height: 18, borderRadius: '50%', background:'#fff',
        boxShadow:'0 1px 2px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.15)',
        transition:'left 180ms cubic-bezier(.4,.2,.2,1)',
      }}/>
    </div>
  );
}

function Select({ value, options, onChange, T, style }) {
  return (
    <div style={{ position:'relative', display:'inline-block', ...style }}>
      <select value={value} onChange={(e)=>onChange(e.target.value)}
        style={{
          appearance:'none', background: T.input, color: T.text,
          border:`0.5px solid ${T.inputBorder}`, borderRadius:6,
          padding:'0 26px 0 10px', height:26, fontFamily: FONT, fontSize: 13,
          outline:'none', cursor:'pointer', minWidth: 120,
        }}>
        {options.map(o => <option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
      <div style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color: T.textMuted, display:'flex' }}>
        {I.chev(10, T.textMuted)}
      </div>
    </div>
  );
}

function Badge({ kind='safe', dark, children }) {
  const s = SAFETY[kind][dark?'d':'l'];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'2px 8px 2px 6px', borderRadius: 10,
      background: s.bg, color: s.fg,
      fontFamily: FONT, fontSize: 11, fontWeight: 600,
      lineHeight: '16px',
    }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background: s.dot }}/>
      {children || SAFETY[kind].label}
    </span>
  );
}

function CategoryTag({ cat, dark }) {
  const hue = CATEGORIES[cat]?.hue ?? 200;
  const bg = dark ? `oklch(0.35 0.08 ${hue})` : `oklch(0.94 0.04 ${hue})`;
  const fg = dark ? `oklch(0.85 0.08 ${hue})` : `oklch(0.38 0.12 ${hue})`;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      padding:'1px 8px', borderRadius: 5,
      background: bg, color: fg,
      fontFamily: FONT, fontSize: 11, fontWeight: 500,
    }}>{cat}</span>
  );
}

// ───────── Window chrome ─────────
function TrafficLights({ onClose, onMin, onMax }) {
  const [hover, setHover] = useState(false);
  const dot = (bg, border, glyph) => (
    <div style={{
      width:12, height:12, borderRadius:'50%', background:bg,
      border:`0.5px solid ${border}`,
      display:'flex', alignItems:'center', justifyContent:'center',
      color: 'rgba(0,0,0,0.55)',
    }}>
      {hover && glyph}
    </div>
  );
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ display:'flex', gap:8, alignItems:'center' }}>
      <div onClick={onClose} style={{cursor:'pointer'}}>{dot('#ff5f57','#e0443e', <svg width="6" height="6" viewBox="0 0 6 6"><path d="M1 1l4 4M5 1l-4 4" stroke="rgba(0,0,0,0.55)" strokeWidth="1" strokeLinecap="round"/></svg>)}</div>
      <div onClick={onMin} style={{cursor:'pointer'}}>{dot('#febc2e','#dea123', <div style={{width:6, height:1, background:'rgba(0,0,0,0.55)'}}/>)}</div>
      <div onClick={onMax} style={{cursor:'pointer'}}>{dot('#28c840','#1aac29', <svg width="6" height="6" viewBox="0 0 6 6"><path d="M1.5 1.5h3v3" stroke="rgba(0,0,0,0.55)" strokeWidth="1" fill="none"/></svg>)}</div>
    </div>
  );
}

function Sidebar({ active, onNav, T, A }) {
  const items = [
    { k:'dashboard', label:'Dashboard', icon: I.home },
    { k:'results',   label:'Scan Results', icon: I.list },
    { k:'stats',     label:'Statistics', icon: I.chart },
    { k:'settings',  label:'Settings', icon: I.gear },
  ];
  const cats = [
    { k:'Browser', count: 3280_000_000 },
    { k:'System',  count: 4120_000_000 },
    { k:'Temp',    count: 2810_000_000 },
    { k:'App',     count: 2330_000_000 },
    { k:'Xcode',   count: 4590_000_000 },
  ];
  return (
    <div style={{
      width: 210, flexShrink:0, height:'100%',
      background: T.sidebar,
      backdropFilter: 'blur(30px) saturate(160%)',
      WebkitBackdropFilter: 'blur(30px) saturate(160%)',
      borderRight: `0.5px solid ${T.border}`,
      display:'flex', flexDirection:'column',
    }}>
      <div style={{ height: 38, display:'flex', alignItems:'center', padding:'0 12px' }}>
        <TrafficLights onClose={()=>{}} onMin={()=>{}} onMax={()=>{}}/>
      </div>
      <div style={{ padding: '4px 10px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 8px 10px' }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: `linear-gradient(135deg, ${A} 0%, oklch(from ${A} calc(l - 0.15) c h) 100%)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M4 4v8a1 1 0 001 1h6a1 1 0 001-1V4M6 2h4v2H6z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text }}>Cache Cleaner</div>
        </div>
        {items.map(it => {
          const on = active === it.k;
          return (
            <Pressable key={it.k} onClick={()=>onNav(it.k)} style={{
              display:'flex', alignItems:'center', gap:8,
              height: 28, padding:'0 10px', borderRadius: 6,
              background: on ? A : 'transparent',
              color: on ? '#fff' : T.text,
              fontFamily: FONT, fontSize: 13, fontWeight: on?500:400,
              marginBottom: 1,
            }}>
              {it.icon(13, on?'#fff':T.textMuted)}
              <span>{it.label}</span>
            </Pressable>
          );
        })}
      </div>
      <div style={{ padding:'0 16px 6px', fontFamily: FONT, fontSize: 10.5, fontWeight: 600, color: T.textFaint, textTransform:'uppercase', letterSpacing: 0.4 }}>Categories</div>
      <div style={{ padding:'0 10px', flex: 1, overflow:'auto' }}>
        {cats.map(c => (
          <Pressable key={c.k} onClick={()=>onNav('results', c.k)} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            height: 26, padding:'0 10px', borderRadius: 6,
            color: T.text, fontFamily: FONT, fontSize: 12,
          }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
              <span style={{ width:8, height:8, borderRadius:2, background: `oklch(0.7 0.14 ${CATEGORIES[c.k].hue})` }}/>
              {c.k}
            </span>
            <span style={{ color: T.textFaint, fontFamily: MONO, fontSize: 11 }}>{fmtBytes(c.count)}</span>
          </Pressable>
        ))}
      </div>
      <div style={{ padding: 10, borderTop: `0.5px solid ${T.border}` }}>
        <div style={{
          display:'flex', gap:8, padding:'6px 8px', borderRadius:6,
          background: 'rgba(127,127,127,0.08)',
          fontFamily: FONT, fontSize: 11, color: T.textMuted,
        }}>
          <div style={{ color: SAFETY.safe[TOKENS.light===T?'l':'d'].dot, display:'flex' }}>{I.info(12)}</div>
          <div>Last scan: 3h ago · 8.2 GB safe</div>
        </div>
      </div>
    </div>
  );
}

// ───────── Dashboard ─────────
function SummaryCard({ label, value, sub, accent, icon, onClick, T, A, valueColor }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        flex: 1, cursor:'pointer',
        background: hover ? T.cardHover : T.card,
        border: `0.5px solid ${T.border}`,
        borderRadius: 10, padding: 16,
        transition:'background 140ms, transform 140ms',
        transform: hover ? 'translateY(-1px)' : 'none',
      }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: accent ? `${accent}22` : 'rgba(127,127,127,0.1)',
          color: accent || T.textMuted,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>{icon}</div>
        <div style={{ color: T.textFaint }}>{I.chevRight(10, T.textFaint)}</div>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: T.textMuted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 600, color: valueColor || T.text, letterSpacing: -0.5, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted, marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function MiniBar({ data, T, dark }) {
  const max = Math.max(...data.map(d=>d.v));
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap: 6, height: 56 }}>
      {data.map((d,i)=>(
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4 }}>
          <div style={{
            width: '100%', height: `${Math.max(6, (d.v/max)*44)}px`,
            background: `oklch(0.7 0.14 ${CATEGORIES[d.k]?.hue ?? 200})`,
            borderRadius: 3, opacity: 0.9,
          }}/>
          <div style={{ fontFamily: FONT, fontSize: 10, color: T.textFaint }}>{d.k}</div>
        </div>
      ))}
    </div>
  );
}

function Dashboard({ onScan, onNav, T, A, dark, accentColor }) {
  const recent = [
    { date:'Apr 20, 2026 · 2:34 PM', found: 12.4e9, cleaned: 2.1e9, files: 1542 },
    { date:'Apr 17, 2026 · 9:12 AM', found: 9.8e9, cleaned: 4.3e9, files: 2104 },
    { date:'Apr 12, 2026 · 7:44 PM', found: 15.1e9, cleaned: 6.8e9, files: 3411 },
    { date:'Apr 08, 2026 · 11:08 AM', found: 8.2e9, cleaned: 1.9e9, files: 978 },
    { date:'Apr 03, 2026 · 3:22 PM', found: 11.5e9, cleaned: 3.5e9, files: 1854 },
  ];
  const breakdown = [
    { k:'Browser', v: 3.28 },
    { k:'System',  v: 4.12 },
    { k:'Temp',    v: 2.81 },
    { k:'App',     v: 2.33 },
    { k:'Xcode',   v: 4.59 },
  ];

  return (
    <div style={{ padding: '20px 28px 40px', maxWidth: 1100 }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 4 }}>
        <h1 style={{ fontFamily: FONT, fontSize: 26, fontWeight: 600, color: T.text, margin: 0, letterSpacing: -0.5 }}>Dashboard</h1>
        <div style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted }}>
          Updated {new Date().toLocaleTimeString('en-US',{hour:'numeric', minute:'2-digit'})}
        </div>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 13, color: T.textMuted, marginBottom: 20 }}>Review cached data, scan, and reclaim space.</div>

      <div style={{ display:'flex', gap: 12, marginBottom: 22 }}>
        <SummaryCard label="Total Cache Found" value="12.4 GB" sub="across 2,847 files"
          icon={I.drive(16, accentColor)} accent={accentColor} valueColor={accentColor}
          onClick={()=>onNav('results')} T={T} A={accentColor}/>
        <SummaryCard label="Safe to Reclaim" value="8.2 GB" sub="excluding system-critical caches"
          icon={I.recycle(16, SAFETY.safe[dark?'d':'l'].dot)} accent={SAFETY.safe[dark?'d':'l'].dot} valueColor={SAFETY.safe[dark?'d':'l'].dot}
          onClick={()=>onNav('results')} T={T} A={accentColor}/>
        <SummaryCard label="Last Cleanup" value="3h ago" sub="Freed 2.1 GB · 1,542 files"
          icon={I.check(16, T.textMuted)} accent={T.textMuted}
          onClick={()=>onNav('results')} T={T} A={accentColor}/>
      </div>

      {/* Primary scan CTA + breakdown */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 12, marginBottom: 22 }}>
        <div style={{
          background: T.card, border: `0.5px solid ${T.border}`,
          borderRadius: 10, padding: 20,
          display:'flex', flexDirection:'column', gap: 12,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: T.text }}>Run a full scan</div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                Scans ~/Library, /Library/Caches, /private/tmp, and developer dirs
              </div>
            </div>
            <Button variant="primary" size="lg" onClick={onScan} T={T} A={accentColor}
              icon={<span style={{display:'inline-flex'}}>{I.search(14,'#fff')}</span>}>
              Scan for Cache
            </Button>
          </div>
          <div style={{ display:'flex', gap: 10, flexWrap:'wrap' }}>
            {['Browser','System','Temp Files','App Leftovers','Xcode'].map(c => (
              <span key={c} style={{
                display:'inline-flex', alignItems:'center', gap:6,
                padding:'4px 10px', borderRadius: 12,
                background: T.content, border:`0.5px solid ${T.border}`,
                fontFamily: FONT, fontSize: 12, color: T.textMuted,
              }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:`oklch(0.7 0.14 ${CATEGORIES[c.split(' ')[0]==='App'?'App':c.split(' ')[0]==='Temp'?'Temp':c.split(' ')[0]]?.hue ?? 200})` }}/>
                {c}
              </span>
            ))}
          </div>
        </div>
        <div style={{
          background: T.card, border: `0.5px solid ${T.border}`,
          borderRadius: 10, padding: 16,
        }}>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 12, textTransform:'uppercase', letterSpacing: 0.4 }}>Breakdown by category</div>
          <MiniBar data={breakdown} T={T} dark={dark}/>
          <div style={{ marginTop: 12, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 4 }}>
            {breakdown.map(b => (
              <div key={b.k} style={{ fontFamily: FONT, fontSize: 11, color: T.textMuted, display:'flex', justifyContent:'space-between' }}>
                <span>{b.k}</span>
                <span style={{ fontFamily: MONO, color: T.text }}>{b.v.toFixed(1)} GB</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent scans */}
      <div style={{ marginBottom: 8, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
        <h2 style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: T.text, margin: 0 }}>Recent scans</h2>
        <span style={{ fontFamily: FONT, fontSize: 12, color: accentColor, cursor:'pointer' }}>View all</span>
      </div>
      <div style={{
        background: T.card, border: `0.5px solid ${T.border}`,
        borderRadius: 10, overflow:'hidden',
      }}>
        <div style={{
          display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 100px',
          padding:'8px 16px', background: T.content,
          borderBottom: `0.5px solid ${T.border}`,
          fontFamily: FONT, fontSize: 11, fontWeight: 600, color: T.textMuted,
          textTransform:'uppercase', letterSpacing: 0.3,
        }}>
          <div>Date</div>
          <div style={{ textAlign:'right' }}>Cache Found</div>
          <div style={{ textAlign:'right' }}>Cleaned</div>
          <div style={{ textAlign:'right' }}>Files Removed</div>
          <div style={{ textAlign:'right' }}>Action</div>
        </div>
        {recent.map((r, i) => (
          <Pressable key={i} onClick={()=>onNav('results')} style={{
            display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 100px',
            padding:'10px 16px',
            background: i % 2 === 1 ? T.rowAlt : 'transparent',
            borderBottom: i === recent.length-1 ? 'none' : `0.5px solid ${T.divider}`,
            fontFamily: FONT, fontSize: 13,
            alignItems:'center',
          }}>
            <div style={{ color: T.text }}>{r.date}</div>
            <div style={{ textAlign:'right', color: accentColor, fontFamily: MONO, fontSize: 12 }}>{fmtBytes(r.found)}</div>
            <div style={{ textAlign:'right', color: SAFETY.safe[dark?'d':'l'].dot, fontFamily: MONO, fontSize: 12 }}>{fmtBytes(r.cleaned)}</div>
            <div style={{ textAlign:'right', color: T.textMuted, fontFamily: MONO, fontSize: 12 }}>{fmtNum(r.files)}</div>
            <div style={{ textAlign:'right', color: accentColor, fontSize: 12 }}>Details</div>
          </Pressable>
        ))}
      </div>
    </div>
  );
}

// ───────── Scan Progress Modal ─────────
function ScanModal({ onCancel, onDone, T, A, dark }) {
  const phases = [
    { k:'browser', label:'Browser caches (Safari, Chrome, Firefox)', dur: 1.2 },
    { k:'system',  label:'System temporary files', dur: 1.3 },
    { k:'app',     label:'Application support directories', dur: 1.6 },
    { k:'dev',     label:'Developer build artifacts', dur: 1.4 },
    { k:'dup',     label:'Duplicate frameworks & modules', dur: 1.1 },
  ];
  const total = phases.reduce((a,b)=>a+b.dur, 0);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);
  const startRef = useRef(null);
  useEffect(()=>{
    startRef.current = performance.now();
    let raf;
    const tick = (t)=>{
      const e = (t - startRef.current) / 1000;
      setElapsed(e);
      if (e >= total) { setDone(true); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  let acc = 0;
  const phaseStates = phases.map(p => {
    const s = { ...p, start: acc, end: acc+p.dur };
    acc += p.dur;
    if (elapsed >= s.end) s.state = 'done';
    else if (elapsed >= s.start) s.state = 'progress';
    else s.state = 'pending';
    return s;
  });
  const progress = Math.min(1, elapsed / total);
  const filesFound = Math.floor(progress * 2847);
  const bytesFound = progress * 12.4e9;
  const speed = 180 + Math.floor(Math.sin(elapsed*2)*60 + 60);
  const eta = Math.max(0, Math.ceil(total - elapsed));
  const curPhase = phaseStates.find(p=>p.state==='progress');
  const curPath = curPhase ? {
    browser:'~/Library/Caches/com.apple.Safari/WebKitCache',
    system:'/Library/Caches/com.apple.iconservices',
    app:'~/Library/Application Support/Slack/Cache',
    dev:'~/Library/Developer/Xcode/DerivedData',
    dup:'/Library/Frameworks/shared',
  }[curPhase.k] : '/Library/Caches';

  return (
    <div style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.35)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex: 50, animation:'fadeIn 160ms ease-out',
    }}>
      <div style={{
        width: 500, background: T.content, borderRadius: 12,
        boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.2)',
        overflow:'hidden', animation:'slideDown 240ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {/* Header */}
        <div style={{
          padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom: `0.5px solid ${T.border}`,
        }}>
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: T.text }}>
            {done ? 'Scan complete' : 'Scanning system cache'}
          </div>
          <Pressable onClick={onCancel} style={{
            width: 22, height: 22, borderRadius:'50%',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: T.textMuted,
          }}>{I.xMark(10, T.textMuted)}</Pressable>
        </div>

        {/* Progress bar */}
        <div style={{ padding:'14px 18px 0' }}>
          <div style={{ height: 4, background: T.card, borderRadius: 2, overflow:'hidden' }}>
            <div style={{
              width: `${progress*100}%`, height:'100%', background: A,
              transition:'width 80ms linear',
            }}/>
          </div>
        </div>

        {/* Phases */}
        <div style={{ padding: '14px 18px 6px' }}>
          {phaseStates.map(p => (
            <div key={p.k} style={{
              display:'flex', alignItems:'center', gap: 10,
              padding:'6px 0', fontFamily: FONT, fontSize: 13,
              color: p.state==='pending' ? T.textFaint : T.text,
            }}>
              <div style={{ width: 16, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {p.state==='done' && I.check(14, SAFETY.safe[dark?'d':'l'].dot)}
                {p.state==='progress' && (
                  <div style={{
                    width: 12, height: 12, borderRadius:'50%',
                    border: `1.5px solid ${A}`, borderTopColor:'transparent',
                    animation:'spin 0.9s linear infinite',
                  }}/>
                )}
                {p.state==='pending' && <div style={{ width: 10, height: 10, borderRadius:'50%', border:`1.5px solid ${T.borderStrong}` }}/>}
              </div>
              <span>{p.label}</span>
              {p.state==='done' && <span style={{ marginLeft:'auto', color: T.textFaint, fontSize: 11, fontFamily: MONO }}>✓</span>}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          margin:'8px 18px', padding:'10px 12px',
          background: T.card, borderRadius: 8,
          fontFamily: MONO, fontSize: 11, color: T.textMuted, lineHeight: 1.7,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span>Files found</span>
            <span style={{ color: T.text }}>{fmtNum(filesFound)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span>Size</span>
            <span style={{ color: A }}>{fmtBytes(bytesFound)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span>Speed</span>
            <span style={{ color: T.text }}>{speed} files/sec</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span>ETA</span>
            <span style={{ color: T.text }}>{done ? '—' : `~${eta}s remaining`}</span>
          </div>
          <div style={{ marginTop: 6, paddingTop: 6, borderTop: `0.5px dashed ${T.border}`, display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ color: T.textFaint, flexShrink:0 }}>Scanning</span>
            <span style={{ color: T.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{curPath}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding:'12px 18px', display:'flex', justifyContent:'flex-end', gap: 8,
          borderTop: `0.5px solid ${T.border}`, background: T.card,
        }}>
          {!done && <Button onClick={onCancel} T={T} A={A}>Cancel Scan</Button>}
          {done && <>
            <Button onClick={onCancel} T={T} A={A}>Close</Button>
            <Button variant="primary" onClick={onDone} T={T} A={A}>View Results</Button>
          </>}
        </div>
      </div>
    </div>
  );
}

// ───────── Results View ─────────
function ResultsView({ onBack, onDelete, onExclude, initialCategory, T, A, dark, accentColor }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState(initialCategory || 'All');
  const [selected, setSelected] = useState(() => new Set(DEMO_FILES.filter(f=>f.safety==='safe').slice(0, 42).map(f=>f.id)));
  const [sortKey, setSortKey] = useState('size');
  const [sortDir, setSortDir] = useState('desc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(()=>{ if (initialCategory) setCat(initialCategory); }, [initialCategory]);

  const filtered = useMemo(()=>{
    let r = DEMO_FILES;
    if (cat !== 'All') r = r.filter(f=>f.category===cat);
    if (search.trim()) {
      const s = search.toLowerCase();
      r = r.filter(f => f.path.toLowerCase().includes(s));
    }
    r = [...r].sort((a,b)=>{
      let v = 0;
      if (sortKey==='size') v = a.size - b.size;
      else if (sortKey==='path') v = a.path.localeCompare(b.path);
      else if (sortKey==='mins') v = a.mins - b.mins;
      else if (sortKey==='category') v = a.category.localeCompare(b.category);
      else if (sortKey==='safety') v = ['safe','caution','dangerous'].indexOf(a.safety) - ['safe','caution','dangerous'].indexOf(b.safety);
      return sortDir==='desc' ? -v : v;
    });
    return r;
  }, [cat, search, sortKey, sortDir]);

  const selBytes = useMemo(()=>DEMO_FILES.filter(f=>selected.has(f.id)).reduce((a,b)=>a+b.size,0), [selected]);
  const shown = filtered.length;
  const shownBytes = filtered.reduce((a,b)=>a+b.size,0);

  const allShownSelected = filtered.length>0 && filtered.every(f=>selected.has(f.id));
  const someShownSelected = filtered.some(f=>selected.has(f.id));

  const toggleAll = () => {
    const next = new Set(selected);
    if (allShownSelected) filtered.forEach(f=>next.delete(f.id));
    else filtered.forEach(f=>{ if (f.safety!=='dangerous') next.add(f.id); });
    setSelected(next);
  };
  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const onSort = (key) => {
    if (sortKey === key) setSortDir(sortDir==='asc'?'desc':'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const catBreakdown = useMemo(()=>{
    const map = {};
    DEMO_FILES.forEach(f => { map[f.category] = (map[f.category]||0) + f.size; });
    return map;
  }, []);

  const catChips = ['All', ...Object.keys(CATEGORIES)];
  const typeIcon = (t) => {
    const c = T.textMuted;
    if (t==='folder') return I.folder(13, c);
    if (t==='img') return I.img(13, c);
    if (t==='code') return I.code(13, c);
    return I.doc(13, c);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Top bar */}
      <div style={{ padding: '20px 28px 12px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 4, gap: 12 }}>
          <h1 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: T.text, margin: 0, letterSpacing: -0.3, whiteSpace:'nowrap' }}>Scan Results</h1>
          <div style={{ display:'flex', gap: 8, alignItems:'center', flexShrink: 0 }}>
            <span style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted, whiteSpace:'nowrap' }}>Apr 20, 2026 · 2:34 PM</span>
            <Button size="sm" icon={I.refresh(12, T.textMuted)} T={T} A={accentColor}>Rescan</Button>
          </div>
        </div>

        {/* Search + categories */}
        <div style={{ display:'flex', gap: 10, marginTop: 14, alignItems:'center' }}>
          <div style={{
            flex:1, height: 30, display:'flex', alignItems:'center', gap: 8,
            padding: '0 10px', background: T.input, borderRadius: 7,
            border: `0.5px solid ${T.inputBorder}`,
          }}>
            {I.search(13, T.textMuted)}
            <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search results…"
              style={{ flex:1, border:'none', outline:'none', background:'transparent', color: T.text, fontFamily: FONT, fontSize: 13 }}/>
            {search && <Pressable onClick={()=>setSearch('')} style={{ color: T.textFaint, display:'flex' }}>{I.xMark(10, T.textFaint)}</Pressable>}
          </div>
          <Button size="sm" onClick={onExclude} T={T} A={accentColor} icon={I.plus(10, T.text)}>Exclude Pattern</Button>
        </div>

        <div style={{ display:'flex', gap: 6, marginTop: 12, flexWrap:'wrap' }}>
          {catChips.map(c => {
            const on = cat === c;
            return (
              <Pressable key={c} onClick={()=>setCat(c)} style={{
                display:'inline-flex', alignItems:'center', gap: 6,
                height: 26, padding: '0 10px', borderRadius: 13,
                background: on ? accentColor : T.card,
                color: on ? '#fff' : T.text,
                border: `0.5px solid ${on ? accentColor : T.border}`,
                fontFamily: FONT, fontSize: 12, fontWeight: on?500:400,
              }}>
                {c !== 'All' && <span style={{ width: 7, height: 7, borderRadius:'50%', background: on ? '#fff' : `oklch(0.7 0.14 ${CATEGORIES[c].hue})` }}/>}
                {c}
                {c !== 'All' && <span style={{ color: on?'rgba(255,255,255,0.7)':T.textMuted, fontFamily: MONO, fontSize: 11 }}>{fmtBytes(catBreakdown[c]||0)}</span>}
              </Pressable>
            );
          })}
        </div>

        {/* Summary line */}
        <div style={{ marginTop: 12, display:'flex', alignItems:'center', gap: 14, flexWrap:'wrap' }}>
          <div style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            Showing <span style={{ color: T.text, fontWeight: 500 }}>{fmtNum(shown)}</span> files · <span style={{ color: T.text, fontFamily: MONO }}>{fmtBytes(shownBytes)}</span> total · <span style={{ color: SAFETY.safe[dark?'d':'l'].dot, fontWeight: 500 }}>{fmtBytes(DEMO_FILES.filter(f=>f.safety==='safe' && (cat==='All'||f.category===cat)).reduce((a,b)=>a+b.size,0))}</span> marked safe
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{
        flex: 1, overflow:'auto', margin: '0 28px',
        border: `0.5px solid ${T.border}`, borderRadius: 10,
        background: T.card,
      }}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'28px 24px 1fr 100px 120px 100px 100px',
          padding:'6px 14px',
          background: T.content,
          borderBottom: `0.5px solid ${T.border}`,
          position:'sticky', top:0, zIndex: 1,
          fontFamily: FONT, fontSize: 11, fontWeight: 600, color: T.textMuted,
          textTransform:'uppercase', letterSpacing: 0.3,
        }}>
          <div><Checkbox checked={allShownSelected} indeterminate={!allShownSelected && someShownSelected} onChange={toggleAll} T={T} A={accentColor}/></div>
          <div></div>
          <Pressable onClick={()=>onSort('path')} style={{display:'inline-flex',alignItems:'center',gap:4}}>Path {I.sort(8, T.textFaint)}</Pressable>
          <Pressable onClick={()=>onSort('size')} style={{display:'inline-flex',alignItems:'center',gap:4,justifyContent:'flex-end'}}>Size {I.sort(8, T.textFaint)}</Pressable>
          <Pressable onClick={()=>onSort('mins')} style={{display:'inline-flex',alignItems:'center',gap:4,justifyContent:'flex-end'}}>Modified {I.sort(8, T.textFaint)}</Pressable>
          <Pressable onClick={()=>onSort('category')} style={{display:'inline-flex',alignItems:'center',gap:4,justifyContent:'center'}}>Category {I.sort(8, T.textFaint)}</Pressable>
          <Pressable onClick={()=>onSort('safety')} style={{display:'inline-flex',alignItems:'center',gap:4,justifyContent:'center'}}>Safety {I.sort(8, T.textFaint)}</Pressable>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign:'center', color: T.textMuted, fontFamily: FONT, fontSize: 13 }}>
            No matching files.
          </div>
        )}
        {filtered.map((f, i) => (
          <ResultRow key={f.id} f={f} i={i} selected={selected.has(f.id)} onToggle={()=>toggleOne(f.id)} typeIcon={typeIcon} T={T} A={accentColor} dark={dark}/>
        ))}
      </div>

      {/* Bottom action bar */}
      <div style={{
        flexShrink:0, padding:'12px 28px', background: T.content,
        borderTop: `0.5px solid ${T.border}`,
        display:'flex', alignItems:'center', gap: 12,
      }}>
        <div style={{ fontFamily: FONT, fontSize: 13, color: T.text }}>
          <span style={{ color: accentColor, fontWeight: 600 }}>{fmtNum(selected.size)}</span> files selected ·
          <span style={{ fontFamily: MONO, color: T.text }}> {fmtBytes(selBytes)}</span>
          {selected.size > 0 && <Pressable onClick={()=>setSelected(new Set())} style={{ display:'inline', color: accentColor, fontSize: 12, marginLeft: 8 }}>Clear</Pressable>}
        </div>
        <div style={{ flex: 1 }}/>
        <Button size="sm" onClick={()=>setShowAdvanced(!showAdvanced)} T={T} A={accentColor} icon={I.gear(12, T.text)}>Advanced</Button>
        <Button size="sm" T={T} A={accentColor}>Save Preset</Button>
        <Button variant="destructive" size="md" disabled={selected.size===0} onClick={onDelete} T={T} A={accentColor}
          icon={I.recycle(12,'#fff')}
        >Delete Selected</Button>
      </div>

      {showAdvanced && (
        <div style={{
          position:'absolute', right: 28, bottom: 68,
          width: 280, padding: 14, background: T.content,
          border:`0.5px solid ${T.border}`, borderRadius: 10,
          boxShadow:'0 12px 32px rgba(0,0,0,0.18)', zIndex: 20,
        }}>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 10 }}>Advanced Options</div>
          {[
            ['Hide system daemon caches', true],
            ['Only files older than 7 days', false],
            ['Require elevated permission', true],
            ['Preview 10 files before deleting', false],
          ].map(([l, v]) => (
            <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0' }}>
              <span style={{ fontFamily: FONT, fontSize: 12, color: T.text }}>{l}</span>
              <Toggle on={v} onChange={()=>{}} A={accentColor} T={T}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultRow({ f, i, selected, onToggle, typeIcon, T, A, dark }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      onClick={onToggle}
      style={{
        display:'grid', gridTemplateColumns:'28px 24px 1fr 100px 120px 100px 100px',
        padding:'0 14px', alignItems:'center',
        height: 38,
        background: hover ? T.rowHover : (i%2===1 ? T.rowAlt : 'transparent'),
        borderBottom: `0.5px solid ${T.divider}`,
        fontFamily: FONT, fontSize: 12.5, cursor:'pointer',
      }}>
      <Checkbox checked={selected} onChange={()=>onToggle()} T={T} A={A}/>
      <div style={{ color: T.textMuted, display:'flex' }}>{typeIcon(f.type)}</div>
      <div style={{ color: T.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight: 10 }} title={f.path}>{f.path}</div>
      <div style={{ textAlign:'right', fontFamily: MONO, fontSize: 11.5, color: T.text }}>{fmtBytes(f.size)}</div>
      <div style={{ textAlign:'right', color: T.textMuted, fontSize: 12 }}>{relTime(f.mins)}</div>
      <div style={{ textAlign:'center' }}><CategoryTag cat={f.category} dark={dark}/></div>
      <div style={{ textAlign:'center' }}><Badge kind={f.safety} dark={dark}/></div>
    </div>
  );
}

// ───────── Exclusion Modal ─────────
function ExclusionModal({ onClose, T, A, dark }) {
  const [pattern, setPattern] = useState('');
  const [rules, setRules] = useState([
    { p:'*.tmp', on:true },
    { p:'/Library/Caches/daemon*', on:true },
    { p:'~/Library/Application Support/Vault*', on:true },
    { p:'/Library/Saved*', on:false },
  ]);
  return (
    <div style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.35)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex: 60,
      animation:'fadeIn 140ms ease-out',
    }}>
      <div style={{
        width: 600, background: T.content, borderRadius: 12,
        boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.2)',
        overflow:'hidden', animation:'slideDown 220ms cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ padding:'16px 20px 10px', borderBottom:`0.5px solid ${T.border}` }}>
          <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: T.text }}>Exclusion Rules</div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted, marginTop: 4 }}>
            Patterns matched against file paths. Supports <code style={{fontFamily:MONO, background: T.card, padding:'1px 4px', borderRadius: 3}}>*</code> wildcard.
          </div>
        </div>
        <div style={{ padding:'14px 20px' }}>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: T.textMuted, marginBottom: 6 }}>Add new pattern</div>
          <div style={{ display:'flex', gap: 8 }}>
            <input value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="~/Library/Caches/MyApp/*"
              style={{ flex:1, height: 30, padding:'0 10px', background: T.input, color: T.text,
                border:`0.5px solid ${T.inputBorder}`, borderRadius:7, outline:'none',
                fontFamily: MONO, fontSize: 12.5 }}/>
            <Button variant="primary" onClick={()=>{ if(pattern) { setRules([{p:pattern,on:true},...rules]); setPattern(''); } }} T={T} A={A}>Add</Button>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: T.textMuted, margin:'16px 0 6px' }}>Current rules · {rules.length}</div>
          <div style={{ border:`0.5px solid ${T.border}`, borderRadius: 8, overflow:'hidden' }}>
            {rules.map((r, i) => (
              <div key={i} style={{
                display:'flex', alignItems:'center', gap: 10,
                padding:'8px 12px', height: 36,
                background: i%2===1 ? T.card : 'transparent',
                borderBottom: i===rules.length-1 ? 'none' : `0.5px solid ${T.divider}`,
                opacity: r.on ? 1 : 0.5,
              }}>
                <Checkbox checked={r.on} onChange={()=>setRules(rules.map((x,j)=>j===i?{...x,on:!x.on}:x))} T={T} A={A}/>
                <code style={{ flex:1, fontFamily: MONO, fontSize: 12, color: T.text }}>{r.p}</code>
                <Pressable onClick={()=>setRules(rules.filter((_,j)=>j!==i))} style={{
                  width: 22, height: 22, borderRadius: 4, display:'flex', alignItems:'center', justifyContent:'center',
                  color: T.textMuted,
                }}>{I.xMark(10, T.textMuted)}</Pressable>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:'12px 20px', display:'flex', justifyContent:'flex-end', gap: 8,
          background: T.card, borderTop:`0.5px solid ${T.border}`,
        }}>
          <Button onClick={onClose} T={T} A={A}>Cancel</Button>
          <Button variant="primary" onClick={onClose} T={T} A={A}>Save Rules</Button>
        </div>
      </div>
    </div>
  );
}

// ───────── Confirm Delete Modal ─────────
function ConfirmDelete({ count, bytes, onCancel, onConfirm, T, A, dark, requiresAuth }) {
  const [showPwd, setShowPwd] = useState(false);
  const [skip, setSkip] = useState(false);
  if (requiresAuth && !showPwd) {
    // first: confirm, then auth
  }
  return (
    <div style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.45)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex: 70,
      animation:'fadeIn 140ms ease-out',
    }}>
      <div style={{
        width: 420, background: T.content, borderRadius: 14,
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(0,0,0,0.3)',
        overflow:'hidden', animation:'slideDown 200ms cubic-bezier(.2,.7,.2,1)',
      }}>
        {!showPwd ? (
          <>
            <div style={{ padding:'22px 24px 14px', display:'flex', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius:'50%',
                background: 'rgba(220,53,69,0.12)', color: '#DC3545',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>{I.warn(20, '#DC3545')}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>
                  Delete {fmtNum(count)} files?
                </div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: T.textMuted, lineHeight: 1.4 }}>
                  This will move <strong style={{ color: T.text }}>{fmtBytes(bytes)}</strong> to the Trash.
                  Files remain recoverable for 30 days unless you empty the Trash.
                </div>
                <label style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 14, cursor:'pointer' }}>
                  <Checkbox checked={skip} onChange={setSkip} T={T} A={A}/>
                  <span style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted }}>Don't show this confirmation again</span>
                </label>
              </div>
            </div>
            <div style={{ padding:'12px 20px', display:'flex', justifyContent:'flex-end', gap: 8,
              background: T.card, borderTop:`0.5px solid ${T.border}`,
            }}>
              <Button onClick={onCancel} T={T} A={A}>Cancel</Button>
              {requiresAuth
                ? <Button variant="destructive" onClick={()=>setShowPwd(true)} T={T} A={A}>Continue…</Button>
                : <Button variant="destructive" onClick={onConfirm} T={T} A={A}>Delete</Button>}
            </div>
          </>
        ) : (
          <>
            <div style={{ padding:'22px 24px 14px', display:'flex', gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius:'50%',
                background: 'rgba(127,127,127,0.12)', color: T.text,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>{I.lock(20, T.text)}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>
                  Administrator permission required
                </div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: T.textMuted, lineHeight: 1.4 }}>
                  Cache Cleaner needs access to <code style={{fontFamily:MONO, background:T.card, padding:'1px 5px', borderRadius:3, fontSize: 12}}>/Library/Caches/</code> and other protected locations. Enter your password to continue.
                </div>
                <input type="password" autoFocus placeholder="Password"
                  defaultValue="••••••••••••"
                  style={{
                    marginTop: 14, width:'100%', height: 32,
                    padding:'0 12px', background: T.input, color: T.text,
                    border: `1px solid ${A}`, borderRadius: 7, outline:'none',
                    boxShadow: `0 0 0 3px ${T.focusRing}`,
                    fontFamily: FONT, fontSize: 13,
                  }}/>
                <div style={{ marginTop: 10, display:'flex', alignItems:'center', gap: 6, fontFamily: FONT, fontSize: 11.5, color: T.textMuted }}>
                  {I.info(12, T.textMuted)} Your password is not stored.
                </div>
              </div>
            </div>
            <div style={{ padding:'12px 20px', display:'flex', justifyContent:'flex-end', gap: 8,
              background: T.card, borderTop:`0.5px solid ${T.border}`,
            }}>
              <Button onClick={onCancel} T={T} A={A}>Cancel</Button>
              <Button variant="primary" onClick={onConfirm} T={T} A={A}>Continue</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ───────── Settings ─────────
const SETTINGS_DEFAULTS = {
  launch: true, menubar: true, dockicon: false,
  notif: true, largeNotif: true, schedule: true, telemetry: false,
  debugLogging: false, betaFeatures: false,
  indexDepth: 'standard', logLevel: 'info',
};
function loadSettings() {
  try {
    const s = localStorage.getItem('cc-settings');
    if (s) return { ...SETTINGS_DEFAULTS, ...JSON.parse(s) };
  } catch {}
  return { ...SETTINGS_DEFAULTS };
}
function saveSettings(s) {
  try { localStorage.setItem('cc-settings', JSON.stringify(s)); } catch {}
}

function SettingsView({ T, A, accentColor, dark, tweaks, setTweaks }) {
  const tabs = ['General','Privacy','Notifications','Scheduling','Advanced'];
  const [tab, setTab] = useState('General');
  const [s, setS] = useState(loadSettings);
  const set = (k, v) => { const next = {...s, [k]: v}; setS(next); saveSettings(next); };
  const { launch, menubar, dockicon, notif, largeNotif, schedule, telemetry, debugLogging, betaFeatures, indexDepth, logLevel } = s;

  // Advanced-tab operational state
  const [toast, setToast] = useState(null); // { kind: 'info'|'success'|'warn', text }
  const [confirmKind, setConfirmKind] = useState(null); // 'reset' | 'clearIndex' | 'clearLogs' | null
  const [cacheIndexSize, setCacheIndexSize] = useState(248.7); // MB
  const [logSize, setLogSize] = useState(12.4); // MB
  const [busy, setBusy] = useState(null); // string name of busy action
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const flash = (kind, text) => setToast({ kind, text });

  const doExport = () => {
    setBusy('export');
    const payload = {
      generatedAt: new Date().toISOString(),
      app: 'Cache Cleaner',
      version: '1.4.2',
      settings: s,
      tweaks,
      cleanupHistory: [
        { date:'2026-04-20T14:34:00Z', found: 12.4e9, cleaned: 2.1e9, files: 1542 },
        { date:'2026-04-17T09:12:00Z', found: 9.8e9, cleaned: 4.3e9, files: 2104 },
        { date:'2026-04-12T19:44:00Z', found: 15.1e9, cleaned: 6.8e9, files: 3411 },
        { date:'2026-04-08T11:08:00Z', found: 8.2e9, cleaned: 1.9e9, files: 978 },
        { date:'2026-04-03T15:22:00Z', found: 11.5e9, cleaned: 3.5e9, files: 1854 },
      ],
      exclusionRules: [
        { pattern:'*.tmp', enabled:true },
        { pattern:'/Library/Caches/daemon*', enabled:true },
        { pattern:'~/Library/Application Support/Vault*', enabled:true },
        { pattern:'/Library/Saved*', enabled:false },
      ],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cache-cleaner-export-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setTimeout(() => { setBusy(null); flash('success', 'Exported cleanup history'); }, 450);
  };

  const doImport = (file) => {
    if (!file) return;
    setBusy('import');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.settings) { setS({ ...SETTINGS_DEFAULTS, ...parsed.settings }); saveSettings({ ...SETTINGS_DEFAULTS, ...parsed.settings }); }
        flash('success', `Imported “${file.name}”`);
      } catch {
        flash('warn', 'File isn’t a valid Cache Cleaner export');
      }
      setBusy(null);
    };
    reader.onerror = () => { setBusy(null); flash('warn', 'Couldn’t read file'); };
    reader.readAsText(file);
  };

  const doClearIndex = () => {
    setBusy('clearIndex');
    setTimeout(() => {
      setCacheIndexSize(0);
      setBusy(null);
      flash('success', 'Scan index cleared');
    }, 700);
  };
  const doClearLogs = () => {
    setBusy('clearLogs');
    setTimeout(() => {
      setLogSize(0);
      setBusy(null);
      flash('success', 'Diagnostic logs cleared');
    }, 500);
  };
  const doReset = () => {
    setS({ ...SETTINGS_DEFAULTS });
    saveSettings({ ...SETTINGS_DEFAULTS });
    if (setTweaks) setTweaks({ theme:'light', accent:'teal', requireAuth:true, showDesktop:true });
    flash('success', 'All settings restored to defaults');
  };
  const doRebuildIndex = () => {
    setBusy('rebuild');
    setTimeout(() => {
      setCacheIndexSize(187.2);
      setBusy(null);
      flash('success', 'Scan index rebuilt');
    }, 1400);
  };
  const doRevealLogs = () => flash('info', 'Revealed ~/Library/Logs/CacheCleaner in Finder');

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform:'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{title}</div>
      <div style={{ background: T.card, border:`0.5px solid ${T.border}`, borderRadius: 10, overflow:'hidden' }}>
        {children}
      </div>
    </div>
  );
  const Row = ({ label, desc, control, last }) => (
    <div style={{
      display:'flex', alignItems:'center', padding:'10px 14px',
      borderBottom: last ? 'none' : `0.5px solid ${T.divider}`,
    }}>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily: FONT, fontSize: 13, color: T.text }}>{label}</div>
        {desc && <div style={{ fontFamily: FONT, fontSize: 11.5, color: T.textMuted, marginTop: 2 }}>{desc}</div>}
      </div>
      {control}
    </div>
  );

  return (
    <div style={{ display:'flex', height:'100%' }}>
      <div style={{ width: 160, padding: '22px 10px', background: T.card, borderRight: `0.5px solid ${T.border}`, flexShrink:0 }}>
        <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: T.textMuted, padding: '0 10px 8px', textTransform:'uppercase', letterSpacing: 0.4 }}>Settings</div>
        {tabs.map(t => (
          <Pressable key={t} onClick={()=>setTab(t)} style={{
            display:'flex', alignItems:'center', height: 28, padding:'0 10px',
            borderRadius: 6,
            background: tab===t ? accentColor : 'transparent',
            color: tab===t ? '#fff' : T.text,
            fontFamily: FONT, fontSize: 13, fontWeight: tab===t?500:400,
            marginBottom: 1,
          }}>{t}</Pressable>
        ))}
      </div>
      <div style={{ flex:1, overflow:'auto', padding: '24px 32px 40px' }}>
        <h1 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: T.text, margin:'0 0 20px', letterSpacing:-0.3 }}>{tab}</h1>

        {tab==='General' && (<>
          <Section title="Startup & Behavior">
            <Row label="Launch at startup" desc="Open Cache Cleaner when you log in." control={<Toggle on={launch} onChange={(v)=>set('launch',v)} A={accentColor} T={T}/>}/>
            <Row label="Show menu bar icon" desc="Quick access from the menu bar." control={<Toggle on={menubar} onChange={(v)=>set('menubar',v)} A={accentColor} T={T}/>}/>
            <Row label="Show dock icon" desc="Hide to run as menu-bar-only app." last control={<Toggle on={dockicon} onChange={(v)=>set('dockicon',v)} A={accentColor} T={T}/>}/>
          </Section>
          <Section title="Cleanup Defaults">
            <Row label="Minimum file age before deletion" desc="Skip files modified more recently than this." control={<Select value="30" options={[{value:'7',label:'7 days'},{value:'14',label:'14 days'},{value:'30',label:'30 days'},{value:'60',label:'60 days'}]} onChange={()=>{}} T={T}/>}/>
            <Row label="File size threshold" desc="Hide small files to reduce noise." control={<Select value="1" options={[{value:'0.1',label:'100 KB'},{value:'1',label:'1 MB'},{value:'10',label:'10 MB'},{value:'100',label:'100 MB'}]} onChange={()=>{}} T={T}/>}/>
            <Row label="Default delete method" desc="" last control={<Select value="trash" options={[{value:'trash',label:'Move to Trash'},{value:'secure',label:'Secure erase'}]} onChange={()=>{}} T={T}/>}/>
          </Section>
          <div style={{
            display:'flex', gap: 10, padding:'10px 12px',
            background: T.infoBg, border:`0.5px solid ${T.infoBorder}`,
            borderRadius: 8, fontFamily: FONT, fontSize: 12, color: T.text,
          }}>
            <div style={{ color: accentColor, display:'flex', flexShrink:0, marginTop: 1 }}>{I.info(14, accentColor)}</div>
            <div>Trash allows recovery for 30 days. Secure erase is permanent and cannot be reversed.</div>
          </div>
        </>)}

        {tab==='Privacy' && (
          <Section title="Analytics">
            <Row label="Help improve Cache Cleaner" desc="Anonymously share cleanup statistics — no paths, no personal data." last control={<Toggle on={telemetry} onChange={(v)=>set('telemetry',v)} A={accentColor} T={T}/>}/>
          </Section>
        )}

        {tab==='Notifications' && (
          <Section title="Alerts">
            <Row label="Notify when cleanup completes" desc="Banner summary with bytes reclaimed." control={<Toggle on={notif} onChange={(v)=>set('notif',v)} A={accentColor} T={T}/>}/>
            <Row label="Large cache detected" desc="Alert when any category exceeds 5 GB." control={<Toggle on={largeNotif} onChange={(v)=>set('largeNotif',v)} A={accentColor} T={T}/>}/>
            <Row label="Notification style" last control={<Select value="banner" options={[{value:'banner',label:'Banner'},{value:'alert',label:'Alert'}]} onChange={()=>{}} T={T}/>}/>
          </Section>
        )}

        {tab==='Scheduling' && (<>
          <Section title="Automatic cleanup">
            <Row label="Auto-cleanup weekly" desc="Runs in the background and sends a summary." control={<Toggle on={schedule} onChange={(v)=>set('schedule',v)} A={accentColor} T={T}/>}/>
            <Row label="Run on" control={
              <div style={{display:'flex', gap:6}}>
                <Select value="mon" options={[{value:'mon',label:'Monday'},{value:'wed',label:'Wednesday'},{value:'fri',label:'Friday'},{value:'sun',label:'Sunday'}]} onChange={()=>{}} T={T}/>
                <Select value="9" options={[{value:'6',label:'6:00 AM'},{value:'9',label:'9:00 AM'},{value:'18',label:'6:00 PM'},{value:'22',label:'10:00 PM'}]} onChange={()=>{}} T={T}/>
              </div>
            }/>
            <Row label="Categories to auto-clean" last control={<Select value="all" options={[{value:'all',label:'All categories'},{value:'browser',label:'Browser only'},{value:'dev',label:'Developer only'}]} onChange={()=>{}} T={T}/>}/>
          </Section>
        </>)}

        {tab==='Advanced' && (<>
          <Section title="Scan Engine">
            <Row label="Index depth" desc="Deeper indexing finds more candidates but takes longer." control={
              <Select value={indexDepth} options={[{value:'fast',label:'Fast (top levels)'},{value:'standard',label:'Standard'},{value:'deep',label:'Deep (recursive)'}]} onChange={(v)=>set('indexDepth', v)} T={T}/>
            }/>
            <Row label="Rebuild scan index"
              desc={`Current index: ${cacheIndexSize.toFixed(1)} MB. Rebuilding re-scans the filesystem from scratch.`}
              last
              control={<Button size="sm" T={T} A={accentColor} disabled={busy==='rebuild'} onClick={doRebuildIndex}>
                {busy==='rebuild' ? 'Rebuilding…' : 'Rebuild'}
              </Button>}/>
          </Section>

          <Section title="Data & Diagnostics">
            <Row label="Export cleanup history" desc="Download a JSON snapshot of settings, exclusion rules, and cleanup log."
              control={<Button size="sm" T={T} A={accentColor} disabled={busy==='export'} onClick={doExport}>
                {busy==='export' ? 'Exporting…' : 'Export…'}
              </Button>}/>
            <Row label="Import from backup" desc="Restore settings from a previously exported JSON file."
              control={<>
                <input ref={fileInputRef} type="file" accept=".json,application/json"
                  style={{ display:'none' }}
                  onChange={(e)=>{ const f = e.target.files?.[0]; if (f) doImport(f); e.target.value=''; }}/>
                <Button size="sm" T={T} A={accentColor} disabled={busy==='import'} onClick={()=>fileInputRef.current?.click()}>
                  {busy==='import' ? 'Importing…' : 'Choose File…'}
                </Button>
              </>}/>
            <Row label="Debug logging" desc="Write verbose output to ~/Library/Logs/CacheCleaner."
              control={<Toggle on={debugLogging} onChange={(v)=>set('debugLogging', v)} A={accentColor} T={T}/>}/>
            <Row label="Log level"
              control={<Select value={logLevel} options={[{value:'error',label:'Errors only'},{value:'warn',label:'Warnings'},{value:'info',label:'Info'},{value:'debug',label:'Debug (verbose)'}]} onChange={(v)=>set('logLevel', v)} T={T}/>}/>
            <Row label="Reveal log folder" desc="Opens the log directory in Finder."
              control={<Button size="sm" T={T} A={accentColor} onClick={doRevealLogs}>Reveal…</Button>}/>
            <Row label="Clear diagnostic logs"
              desc={logSize > 0 ? `${logSize.toFixed(1)} MB of logs will be removed.` : 'No logs to clear.'}
              last
              control={<Button size="sm" T={T} A={accentColor} disabled={logSize===0 || busy==='clearLogs'}
                onClick={()=>setConfirmKind('clearLogs')}>
                {busy==='clearLogs' ? 'Clearing…' : 'Clear…'}
              </Button>}/>
          </Section>

          <Section title="Experimental">
            <Row label="Beta features" desc="Opt into new features that may be unstable." last
              control={<Toggle on={betaFeatures} onChange={(v)=>set('betaFeatures', v)} A={accentColor} T={T}/>}/>
          </Section>

          <Section title="Danger Zone">
            <Row label="Clear scan index"
              desc={`Free ${cacheIndexSize.toFixed(1)} MB used by the app's own on-disk cache. Next scan will be slower.`}
              control={<Button size="sm" T={T} A={accentColor} disabled={cacheIndexSize===0 || busy==='clearIndex'}
                onClick={()=>setConfirmKind('clearIndex')}>
                {busy==='clearIndex' ? 'Clearing…' : 'Clear'}
              </Button>}/>
            <Row label="Reset all settings" desc="Restore every preference on every tab to defaults." last
              control={<Button size="sm" variant="destructive" T={T} A={accentColor}
                onClick={()=>setConfirmKind('reset')}>Reset…</Button>}/>
          </Section>

          <div style={{
            marginTop: 6, padding:'10px 12px',
            background: T.card, border:`0.5px solid ${T.border}`, borderRadius: 8,
            fontFamily: MONO, fontSize: 11, color: T.textMuted,
            display:'flex', justifyContent:'space-between', gap: 12, flexWrap:'wrap',
          }}>
            <span>Cache Cleaner 1.4.2 (build 20426)</span>
            <span>macOS 14.5 · arm64</span>
            <span>Settings stored in localStorage</span>
          </div>
        </>)}
      </div>

      {/* Advanced-tab confirmation dialog */}
      {confirmKind && (
        <AdvancedConfirm
          kind={confirmKind}
          T={T} A={accentColor} dark={dark}
          onCancel={()=>setConfirmKind(null)}
          onConfirm={()=>{
            const k = confirmKind; setConfirmKind(null);
            if (k==='reset') doReset();
            else if (k==='clearIndex') doClearIndex();
            else if (k==='clearLogs') doClearLogs();
          }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position:'absolute', bottom: 20, left:'50%', transform:'translateX(-50%)',
          padding:'8px 14px', borderRadius: 8,
          background: T===TOKENS.dark ? 'rgba(40,40,44,0.95)' : 'rgba(30,30,34,0.95)',
          color:'#fff', fontFamily: FONT, fontSize: 12.5, fontWeight: 500,
          boxShadow:'0 12px 32px rgba(0,0,0,0.3)',
          display:'flex', alignItems:'center', gap: 8, zIndex: 80,
          animation:'slideDown 220ms cubic-bezier(.2,.7,.2,1)',
        }}>
          <span style={{
            width: 16, height: 16, borderRadius:'50%', display:'inline-flex', alignItems:'center', justifyContent:'center',
            background: toast.kind==='success' ? '#34C759' : toast.kind==='warn' ? '#FF9F0A' : accentColor,
          }}>
            {toast.kind==='success'
              ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : toast.kind==='warn'
                ? <span style={{color:'#fff', fontSize:10, fontWeight:700}}>!</span>
                : <span style={{color:'#fff', fontSize:10, fontWeight:700}}>i</span>}
          </span>
          {toast.text}
        </div>
      )}
    </div>
  );
}

function AdvancedConfirm({ kind, T, A, dark, onCancel, onConfirm }) {
  const config = {
    reset: {
      title: 'Reset all settings?',
      body: 'Every preference on every tab will return to its default value. Tweaks (theme, accent) will also reset. This cannot be undone.',
      confirmLabel: 'Reset Settings',
      destructive: true,
    },
    clearIndex: {
      title: 'Clear scan index?',
      body: 'The app’s on-disk scan index will be removed. Your next scan will be noticeably slower as the index rebuilds.',
      confirmLabel: 'Clear Index',
      destructive: true,
    },
    clearLogs: {
      title: 'Clear diagnostic logs?',
      body: 'All log files in ~/Library/Logs/CacheCleaner will be permanently removed.',
      confirmLabel: 'Clear Logs',
      destructive: false,
    },
  }[kind];
  return (
    <div style={{
      position:'absolute', inset:0, background:'rgba(0,0,0,0.45)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex: 70,
      animation:'fadeIn 140ms ease-out',
    }}>
      <div style={{
        width: 420, background: T.content, borderRadius: 14,
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(0,0,0,0.3)',
        overflow:'hidden', animation:'slideDown 200ms cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ padding:'22px 24px 14px', display:'flex', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius:'50%',
            background: config.destructive ? 'rgba(220,53,69,0.12)' : 'rgba(255,159,10,0.15)',
            color: config.destructive ? '#DC3545' : '#FF9F0A',
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>{I.warn(20, config.destructive ? '#DC3545' : '#FF9F0A')}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>{config.title}</div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: T.textMuted, lineHeight: 1.45 }}>{config.body}</div>
          </div>
        </div>
        <div style={{ padding:'12px 20px', display:'flex', justifyContent:'flex-end', gap: 8,
          background: T.card, borderTop:`0.5px solid ${T.border}`,
        }}>
          <Button onClick={onCancel} T={T} A={A}>Cancel</Button>
          <Button variant={config.destructive ? 'destructive' : 'primary'} onClick={onConfirm} T={T} A={A}>{config.confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

// ───────── Stats (lightweight placeholder) ─────────
function StatsView({ T, A, accentColor, dark }) {
  const weekly = [4.2, 3.1, 6.8, 2.4, 5.9, 7.3, 4.1, 3.8, 9.2, 5.5, 6.8, 4.3];
  const max = Math.max(...weekly);
  const categories = [
    ['Browser', 0.32], ['System', 0.24], ['Temp', 0.17], ['App', 0.15], ['Xcode', 0.12],
  ];
  return (
    <div style={{ padding: '22px 28px 40px' }}>
      <h1 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: T.text, margin:'0 0 4px', letterSpacing:-0.3 }}>Statistics</h1>
      <div style={{ fontFamily: FONT, fontSize: 13, color: T.textMuted, marginBottom: 20 }}>Last 12 cleanups · aggregated.</div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {[
          ['Total reclaimed','84.2 GB','last 90 days'],
          ['Average per run','6.1 GB','median 4.8 GB'],
          ['Files removed','28,417','across 12 runs'],
          ['Next scheduled','Mon 9:00 AM','weekly auto-clean'],
        ].map(([l,v,s])=>(
          <div key={l} style={{ background: T.card, border:`0.5px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform:'uppercase', letterSpacing: 0.3 }}>{l}</div>
            <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: T.text, marginTop: 6, letterSpacing:-0.3 }}>{v}</div>
            <div style={{ fontFamily: FONT, fontSize: 11.5, color: T.textMuted, marginTop: 2 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ background: T.card, border:`0.5px solid ${T.border}`, borderRadius: 10, padding: 18, marginBottom: 14 }}>
        <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform:'uppercase', letterSpacing: 0.3, marginBottom: 12 }}>Reclaimed over time (GB)</div>
        <div style={{ display:'flex', alignItems:'flex-end', gap: 6, height: 140 }}>
          {weekly.map((v,i)=>(
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap: 4 }}>
              <div style={{
                width:'100%', height:`${(v/max)*120}px`,
                background: `linear-gradient(180deg, ${accentColor} 0%, oklch(from ${accentColor} calc(l - 0.15) c h) 100%)`,
                borderRadius: 4,
              }}/>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textFaint }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: T.card, border:`0.5px solid ${T.border}`, borderRadius: 10, padding: 18 }}>
        <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform:'uppercase', letterSpacing: 0.3, marginBottom: 12 }}>Category share</div>
        <div style={{ display:'flex', height: 22, borderRadius: 6, overflow:'hidden', marginBottom: 12 }}>
          {categories.map(([k,v])=>(
            <div key={k} style={{ flex: v, background: `oklch(0.7 0.14 ${CATEGORIES[k].hue})` }}/>
          ))}
        </div>
        <div style={{ display:'flex', gap: 18, flexWrap:'wrap' }}>
          {categories.map(([k,v])=>(
            <div key={k} style={{ display:'inline-flex', alignItems:'center', gap: 6, fontFamily: FONT, fontSize: 12, color: T.text }}>
              <span style={{ width:10, height:10, borderRadius:2, background:`oklch(0.7 0.14 ${CATEGORIES[k].hue})` }}/>
              {k} <span style={{ color: T.textMuted, fontFamily: MONO }}>{Math.round(v*100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────── Root App ─────────
function App({ tweaks, setTweaks }) {
  const dark = tweaks.theme === 'dark';
  const T = dark ? TOKENS.dark : TOKENS.light;
  const accentColor = ACCENTS[tweaks.accent][dark?'dark':'light'];
  const [screen, setScreen] = useState('dashboard');
  const [scanOpen, setScanOpen] = useState(false);
  const [excludeOpen, setExcludeOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [initialCat, setInitialCat] = useState(null);

  const nav = (s, cat) => {
    setScreen(s);
    if (cat) setInitialCat(cat);
    else setInitialCat(null);
  };

  useEffect(() => {
    const onNav = (e) => { setScreen(e.detail.screen); setInitialCat(null); };
    const onModal = (e) => {
      const n = e.detail.name;
      if (n === 'scan') setScanOpen(true);
      else if (n === 'exclude') setExcludeOpen(true);
      else if (n === 'confirm') setConfirmOpen(true);
    };
    const onFilter = (e) => { setScreen('results'); setInitialCat(e.detail.cat); };
    window.addEventListener('cc-nav', onNav);
    window.addEventListener('cc-open-modal', onModal);
    window.addEventListener('cc-filter', onFilter);
    return () => {
      window.removeEventListener('cc-nav', onNav);
      window.removeEventListener('cc-open-modal', onModal);
      window.removeEventListener('cc-filter', onFilter);
    };
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%', background: T.winBg,
      color: T.text, fontFamily: FONT,
      display:'flex', position:'relative', overflow:'hidden',
    }} data-screen-label={`Cache Cleaner – ${screen}`}>
      <Sidebar active={screen} onNav={nav} T={T} A={accentColor}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', position:'relative', background: T.content }}>
        {/* Title bar (toolbar) */}
        <div style={{
          height: 38, flexShrink:0, display:'flex', alignItems:'center',
          padding:'0 14px',
          borderBottom: `0.5px solid ${T.border}`,
          background: T.content,
        }}>
          <div style={{ flex:1, textAlign:'center', fontFamily: FONT, fontSize: 13, fontWeight: 500, color: T.text }}>
            Cache Cleaner
          </div>
          <Pressable onClick={()=>setTweaks({...tweaks, theme: dark?'light':'dark'})} style={{
            width: 28, height: 24, borderRadius: 6, display:'flex', alignItems:'center', justifyContent:'center',
            color: T.textMuted,
          }} title="Toggle theme">
            {dark ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.5 9.5A5.5 5.5 0 116.5 2.5a4.5 4.5 0 007 7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>
            )}
          </Pressable>
        </div>
        <div style={{ flex:1, overflow:'auto', position:'relative' }}>
          {screen==='dashboard' && <Dashboard onScan={()=>setScanOpen(true)} onNav={nav} T={T} A={accentColor} dark={dark} accentColor={accentColor}/>}
          {screen==='results' && <ResultsView onBack={()=>setScreen('dashboard')} onDelete={()=>setConfirmOpen(true)} onExclude={()=>setExcludeOpen(true)} initialCategory={initialCat} T={T} A={accentColor} dark={dark} accentColor={accentColor}/>}
          {screen==='settings' && <SettingsView T={T} A={accentColor} accentColor={accentColor} dark={dark} tweaks={tweaks} setTweaks={setTweaks}/>}
          {screen==='stats' && <StatsView T={T} A={accentColor} accentColor={accentColor} dark={dark}/>}
        </div>
        {scanOpen && <ScanModal onCancel={()=>setScanOpen(false)} onDone={()=>{setScanOpen(false); setScreen('results');}} T={T} A={accentColor} dark={dark}/>}
        {excludeOpen && <ExclusionModal onClose={()=>setExcludeOpen(false)} T={T} A={accentColor} dark={dark}/>}
        {confirmOpen && <ConfirmDelete count={1542} bytes={2.1e9} onCancel={()=>setConfirmOpen(false)} onConfirm={()=>setConfirmOpen(false)} T={T} A={accentColor} dark={dark} requiresAuth={tweaks.requireAuth}/>}
      </div>
    </div>
  );
}

Object.assign(window, { App });
