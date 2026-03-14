import { useState, useCallback, createContext, useContext } from "react";

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ─── SHARED INITIAL DATA ──────────────────────────────────────────────────────
const INIT_CLICKS = [
  {id:"c1", userId:"u_demo", userName:"Vikram J.", store:"Amazon",  emoji:"📦", ts:"2025-12-03 14:22", refCode:null},
  {id:"c2", userId:"u_demo", userName:"Priya K.",  store:"Myntra",  emoji:"👗", ts:"2025-12-03 14:18", refCode:"NXAB1234"},
  {id:"c3", userId:"u_demo", userName:"Rahul S.",  store:"Flipkart",emoji:"🛒", ts:"2025-12-03 14:11", refCode:null},
  {id:"c4", userId:"u_demo", userName:"Ananya M.", store:"Nykaa",   emoji:"💄", ts:"2025-12-03 13:58", refCode:"NXCD5678"},
];

const INIT_REFERRALS = [
  {id:"rf1", referrer:"Vikram J.", referrerCode:"NXEF9012", referred:"Ananya M.", referredEmail:"ananya@example.com", status:"confirmed", bonus:50, date:"2025-11-10"},
  {id:"rf2", referrer:"Rahul S.",  referrerCode:"NXAB1234", referred:"Priya K.",  referredEmail:"priya@example.com",  status:"confirmed", bonus:50, date:"2025-11-15"},
  {id:"rf3", referrer:"Priya K.",  referrerCode:"NXCD5678", referred:"Deepa N.",  referredEmail:"deepa@example.com",  status:"pending",   bonus:50, date:"2025-12-01"},
  {id:"rf4", referrer:"Vikram J.", referrerCode:"NXEF9012", referred:"Suhas R.",  referredEmail:"suhas@example.com",  status:"pending",   bonus:50, date:"2025-12-02"},
];

const fmt = (n) => new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 }).format(n);
const fmtPts = (n) => new Intl.NumberFormat("en-IN").format(n) + " pts";

const STORES = [
  { id:"1",  name:"Amazon",           emoji:"📦", reward:5,  category:"General",     visits:2400000, featured:true  },
  { id:"2",  name:"Flipkart",         emoji:"🛒", reward:6,  category:"General",     visits:1800000, featured:true  },
  { id:"3",  name:"Myntra",           emoji:"👗", reward:8,  category:"Fashion",     visits:900000,  featured:true  },
  { id:"4",  name:"Ajio",             emoji:"✨", reward:10, category:"Fashion",     visits:650000,  featured:true  },
  { id:"5",  name:"Nykaa",            emoji:"💄", reward:7,  category:"Beauty",      visits:780000,  featured:true  },
  { id:"6",  name:"Meesho",           emoji:"🏷️", reward:9,  category:"Fashion",     visits:540000,  featured:false },
  { id:"7",  name:"MakeMyTrip",       emoji:"✈️", reward:6,  category:"Travel",      visits:420000,  featured:false },
  { id:"8",  name:"Swiggy Instamart", emoji:"🛵", reward:4,  category:"Grocery",     visits:1200000, featured:false },
  { id:"9",  name:"Zomato",           emoji:"🍕", reward:3,  category:"Food",        visits:1500000, featured:false },
  { id:"10", name:"Croma",            emoji:"⚡", reward:5,  category:"Electronics", visits:310000,  featured:false },
  { id:"11", name:"boAt Lifestyle",   emoji:"🎧", reward:8,  category:"Electronics", visits:280000,  featured:false },
  { id:"12", name:"1mg",              emoji:"💊", reward:6,  category:"Health",      visits:190000,  featured:false },
];

const LB_WEEKLY = [
  { rank:1,  display:"Rah***", spend:84200,  confirmed:4210,  badge:"🏆 Top Spender", isCurrent:false },
  { rank:2,  display:"Pri***", spend:71500,  confirmed:3575,  badge:"⚡ Power Buyer", isCurrent:false },
  { rank:3,  display:"Vik***", spend:68900,  confirmed:3445,  badge:"🔥 On Fire",     isCurrent:true  },
  { rank:4,  display:"Anu***", spend:55400,  confirmed:2770,  badge:"",               isCurrent:false },
  { rank:5,  display:"Suh***", spend:49800,  confirmed:2490,  badge:"",               isCurrent:false },
  { rank:6,  display:"Dee***", spend:42100,  confirmed:2105,  badge:"",               isCurrent:false },
  { rank:7,  display:"Man***", spend:38700,  confirmed:1935,  badge:"",               isCurrent:false },
  { rank:8,  display:"Kal***", spend:31200,  confirmed:1560,  badge:"",               isCurrent:false },
  { rank:9,  display:"Tan***", spend:28900,  confirmed:1445,  badge:"",               isCurrent:false },
  { rank:10, display:"Ish***", spend:24600,  confirmed:1230,  badge:"",               isCurrent:false },
];

const LB_MONTHLY = [
  { rank:1,  display:"Pri***", spend:312400, confirmed:15620, badge:"🏆 Top Spender", isCurrent:false },
  { rank:2,  display:"Rah***", spend:289600, confirmed:14480, badge:"⚡ Power Buyer", isCurrent:false },
  { rank:3,  display:"Anu***", spend:241800, confirmed:12090, badge:"🔥 On Fire",     isCurrent:false },
  { rank:4,  display:"Vik***", spend:198400, confirmed:9920,  badge:"",               isCurrent:true  },
  { rank:5,  display:"Suh***", spend:176500, confirmed:8825,  badge:"",               isCurrent:false },
  { rank:6,  display:"Dee***", spend:154200, confirmed:7710,  badge:"",               isCurrent:false },
  { rank:7,  display:"Tan***", spend:132800, confirmed:6640,  badge:"",               isCurrent:false },
  { rank:8,  display:"Man***", spend:119400, confirmed:5970,  badge:"",               isCurrent:false },
  { rank:9,  display:"Kal***", spend:98700,  confirmed:4935,  badge:"",               isCurrent:false },
  { rank:10, display:"Ish***", spend:84300,  confirmed:4215,  badge:"",               isCurrent:false },
];

const REWARDS_INIT = [
  { id:"r1", store:"Myntra",   emoji:"👗", amount:840,  order_value:10500, status:"confirmed", date:"2025-11-28" },
  { id:"r2", store:"Amazon",   emoji:"📦", amount:380,  order_value:7600,  status:"confirmed", date:"2025-11-25" },
  { id:"r3", store:"Nykaa",    emoji:"💄", amount:560,  order_value:8000,  status:"pending",   date:"2025-12-01" },
  { id:"r4", store:"Flipkart", emoji:"🛒", amount:720,  order_value:12000, status:"pending",   date:"2025-12-02" },
  { id:"r5", store:"Ajio",     emoji:"✨", amount:1200, order_value:12000, status:"confirmed", date:"2025-11-20" },
  { id:"r6", store:"Meesho",   emoji:"🏷️", amount:270,  order_value:3000,  status:"confirmed", date:"2025-11-18" },
];

const CATS = ["All","General","Fashion","Beauty","Travel","Grocery","Food","Electronics","Health"];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = ({ n, s=18, c="currentColor", sw=2 }) => {
  const d = {
    home:    <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    store:   <><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></>,
    grid:    <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    trophy:  <><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/></>,
    user:    <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    logout:  <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    arrow:   <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    ext:     <><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    search:  <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    check:   <polyline points="20 6 9 17 4 12"/>,
    clock:   <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    shield:  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    edit:    <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:   <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    menu:    <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    info:    <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    eye:     <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    copy:    <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    gift:    <><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></>,
    users:   <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      {d[n]}
    </svg>
  );
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0a0612;
  --p1:#a78bfa;--p2:#7c3aed;--p3:#c4b5fd;
  --g1:rgba(139,92,246,.08);--g2:rgba(139,92,246,.15);
  --b1:rgba(167,139,250,.12);--b2:rgba(167,139,250,.28);
  --t1:#ede9fe;--t2:#c4b5fd;--t3:#7c6fa8;
  --gold:#f59e0b;--grn:#10b981;--red:#ef4444;
  --r:16px;
  --f:'Plus Jakarta Sans',sans-serif;
}
html{scroll-behavior:smooth}
body{
  font-family:var(--f);
  background:var(--bg);
  background-image:
    radial-gradient(ellipse 80% 55% at 15% 5%, rgba(124,58,237,.22) 0%, transparent 60%),
    radial-gradient(ellipse 60% 45% at 85% 95%, rgba(167,139,250,.14) 0%, transparent 55%);
  background-attachment:fixed;
  color:var(--t1);
  -webkit-font-smoothing:antialiased;
}
button,input{font-family:var(--f)}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:#0e0a1a}
::-webkit-scrollbar-thumb{background:rgba(139,92,246,.35);border-radius:3px}

@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 22px rgba(124,58,237,.3)}50%{box-shadow:0 0 52px rgba(124,58,237,.7)}}
@keyframes tin{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}

.f0{animation:fu .45s both}.f1{animation:fu .45s .1s both}
.f2{animation:fu .45s .2s both}.f3{animation:fu .45s .32s both}
.f4{animation:fu .45s .44s both}

/* NAV */
.nav{background:rgba(10,6,18,.8);backdrop-filter:blur(28px) saturate(160%);border-bottom:1px solid var(--b1);position:sticky;top:0;z-index:200}
.ni{max-width:1280px;margin:0 auto;padding:0 20px;height:66px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.logo{display:flex;align-items:center;gap:9px;cursor:pointer}
.lic{width:34px;height:34px;background:linear-gradient(135deg,var(--p1),var(--p2));border-radius:9px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px rgba(124,58,237,.5)}
.ltx{font-size:18px;font-weight:800;letter-spacing:-.3px;color:var(--t1)}
.ltx span{color:var(--p1)}
.nl{display:flex;align-items:center;gap:2px}
.nb{display:flex;align-items:center;gap:6px;padding:8px 13px;border-radius:9px;border:none;background:none;color:var(--t2);font-size:13px;font-weight:500;transition:all .2s;cursor:pointer}
.nb:hover{background:var(--g2);color:var(--t1)}
.nb.act{background:rgba(167,139,250,.16);color:var(--p1)}
.nr{display:flex;align-items:center;gap:8px}
.hb{display:none;background:none;border:none;color:var(--t1);padding:5px;cursor:pointer}
.uc{display:flex;align-items:center;gap:8px;background:var(--g2);border:1px solid var(--b2);border-radius:9px;padding:5px 12px;font-size:13px;font-weight:500}
.av{width:27px;height:27px;border-radius:7px;background:linear-gradient(135deg,var(--p1),var(--p2));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff}
.mob{display:none;position:fixed;inset:66px 0 0 0;background:rgba(10,6,18,.95);backdrop-filter:blur(24px);z-index:199;padding:16px;border-top:1px solid var(--b1);overflow-y:auto}
.mob.open{display:block}
.mnb{display:flex;align-items:center;gap:10px;width:100%;padding:13px 14px;border-radius:10px;border:none;background:none;color:var(--t2);font-size:15px;font-weight:500;margin-bottom:3px;transition:all .2s;cursor:pointer}
.mnb.act{background:rgba(167,139,250,.12);color:var(--p1)}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:none;border-radius:11px;font-size:14px;font-weight:600;transition:all .2s;padding:11px 22px;cursor:pointer;font-family:var(--f)}
.bp{background:linear-gradient(135deg,var(--p1),var(--p2));color:#fff;box-shadow:0 4px 18px rgba(124,58,237,.4)}
.bp:hover{opacity:.88;transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,.55)}
.bo{background:transparent;color:var(--p1);border:1px solid rgba(167,139,250,.4)}
.bo:hover{background:rgba(167,139,250,.1)}
.bg_{background:var(--g2);color:var(--t1);border:1px solid var(--b1)}
.bg_:hover{background:rgba(139,92,246,.22);border-color:var(--b2)}
.bdr{background:rgba(239,68,68,.1);color:var(--red);border:1px solid rgba(239,68,68,.2)}
.bdr:hover{background:rgba(239,68,68,.18)}
.blg{padding:14px 28px;font-size:15px;border-radius:13px}
.bsm{padding:7px 13px;font-size:13px;border-radius:8px}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none !important;box-shadow:none !important}

/* CARD — glass */
.card{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);backdrop-filter:blur(18px)}
.ch{transition:all .25s}
.ch:hover{border-color:rgba(167,139,250,.42);transform:translateY(-3px);box-shadow:0 0 38px rgba(139,92,246,.18)}

/* BADGE */
.bdg{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:100px;font-size:11px;font-weight:700}
.bgg{background:rgba(16,185,129,.12);color:var(--grn);border:1px solid rgba(16,185,129,.22)}
.bgy{background:rgba(245,158,11,.12);color:var(--gold);border:1px solid rgba(245,158,11,.22)}
.bgb{background:rgba(167,139,250,.14);color:var(--p1);border:1px solid rgba(167,139,250,.3)}

/* FORM */
.fi{background:rgba(139,92,246,.07);border:1px solid var(--b2);border-radius:10px;padding:11px 15px;color:var(--t1);font-size:14px;outline:none;transition:all .2s;width:100%}
.fi:focus{border-color:var(--p1);box-shadow:0 0 0 3px rgba(167,139,250,.18)}
.fi::placeholder{color:var(--t3)}
.fl{font-size:12px;font-weight:600;color:var(--t2);margin-bottom:5px;display:block}

/* TABLE */
.tbl{width:100%;border-collapse:collapse}
.tbl th{font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.07em;padding:11px 16px;text-align:left;border-bottom:1px solid var(--b1)}
.tbl td{padding:13px 16px;font-size:14px;border-bottom:1px solid var(--b1);vertical-align:middle}
.tbl tbody tr:last-child td{border-bottom:none}
.tbl tbody tr{transition:background .15s}
.tbl tbody tr:hover{background:rgba(139,92,246,.06)}

/* PROGRESS */
.pt{background:rgba(139,92,246,.12);border-radius:100px;height:8px;overflow:hidden}
.pf{height:100%;background:linear-gradient(90deg,var(--p3),var(--p1),var(--p2));border-radius:100px;transition:width .8s cubic-bezier(.4,0,.2,1)}

/* SECTION */
.sec{padding:72px 20px}
.si{max-width:1280px;margin:0 auto}
.slbl{display:inline-flex;align-items:center;gap:6px;background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.25);color:var(--p1);border-radius:100px;padding:5px 13px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;margin-bottom:14px}
.stitle{font-size:clamp(26px,4vw,38px);font-weight:800;letter-spacing:-.5px;line-height:1.15;color:var(--t1)}
.ssub{font-size:15px;color:var(--t2);line-height:1.75;margin-top:10px}

/* STAT */
.stat{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:22px;backdrop-filter:blur(16px)}

/* GRID BG */
.gbg{background-image:linear-gradient(rgba(167,139,250,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,.06) 1px,transparent 1px);background-size:60px 60px}

/* FOOTER */
.foot{background:rgba(14,10,26,.85);backdrop-filter:blur(24px);border-top:1px solid var(--b1);padding:52px 20px 26px}
.fin{max-width:1280px;margin:0 auto}
.fgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;margin-bottom:40px}
.fct{font-size:12px;font-weight:700;color:var(--t1);text-transform:uppercase;letter-spacing:.07em;margin-bottom:13px}
.flk{display:block;color:var(--t3);font-size:13px;margin-bottom:9px;cursor:pointer;transition:color .2s}
.flk:hover{color:var(--t1)}
.fbot{border-top:1px solid var(--b1);padding-top:18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}

/* ADMIN */
.adl{display:grid;grid-template-columns:206px 1fr;min-height:calc(100vh - 66px)}
.ads{background:rgba(14,10,26,.75);backdrop-filter:blur(20px);border-right:1px solid var(--b1);padding:18px 0}
.anb{display:flex;align-items:center;gap:9px;width:100%;padding:11px 17px;background:none;color:var(--t2);border:none;border-left:3px solid transparent;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s}
.anb:hover{color:var(--t1);background:rgba(139,92,246,.07)}
.anb.act{color:var(--p1);background:rgba(167,139,250,.12);border-left-color:var(--p1)}
.adm{padding:28px;overflow-y:auto}

/* TOAST */
.tw{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px}
.ti{background:rgba(19,13,34,.88);backdrop-filter:blur(20px);border:1px solid var(--b2);color:var(--t1);border-radius:12px;padding:11px 16px;font-size:13px;cursor:pointer;max-width:310px;display:flex;align-items:center;gap:9px;box-shadow:0 8px 32px rgba(0,0,0,.5);animation:tin .3s ease}

@media(max-width:900px){
  .nl{display:none}.hb{display:flex}
  .fgrid{grid-template-columns:1fr 1fr;gap:26px}
  .adl{grid-template-columns:1fr}.ads{display:none}
}
@media(max-width:600px){
  .sec{padding:48px 14px}
  .fgrid{grid-template-columns:1fr}
  .tbl th:nth-child(n+4),.tbl td:nth-child(n+4){display:none}
}
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts, remove }) => (
  <div className="tw">
    {toasts.map(t => (
      <div key={t.id} className="ti" onClick={() => remove(t.id)}>
        <span style={{fontSize:15}}>{t.type==="error"?"⚠️":t.type==="success"?"✅":"ℹ️"}</span>
        {t.msg}
      </div>
    ))}
  </div>
);

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="lic">
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16l-1.5 9H5.5L4 7z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="9" cy="20" r="1.5" fill="#fff"/>
      <circle cx="16" cy="20" r="1.5" fill="#fff"/>
      <path d="M4 7L3 3H1" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 11h6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </div>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ page, go, user, logout }) => {
  const [open, setOpen] = useState(false);
  const nav = (p) => { go(p); setOpen(false); };
  const links = [
    {id:"home",label:"Home",icon:"home"},
    {id:"stores",label:"Stores",icon:"store"},
    {id:"leaderboard",label:"Leaderboard",icon:"trophy"},
    ...(user ? [{id:"dashboard",label:"Dashboard",icon:"grid"}] : []),
    ...(user?.isAdmin ? [{id:"admin",label:"Admin",icon:"settings"}] : []),
  ];
  return (
    <>
      <nav className="nav">
        <div className="ni">
          <div className="logo" onClick={() => nav("home")}>
            <Logo />
            <span className="ltx">Nex<span>cart</span></span>
          </div>
          <div className="nl">
            {links.map(l => (
              <button key={l.id} className={`nb${page===l.id?" act":""}`} onClick={() => nav(l.id)}>
                <Ico n={l.icon} s={14}/>{l.label}
              </button>
            ))}
          </div>
          <div className="nr">
            {user ? (
              <>
                <div className="uc"><div className="av">{user.name[0].toUpperCase()}</div><span>{user.name}</span></div>
                <button className="btn bg_ bsm" onClick={logout}><Ico n="logout" s={14}/></button>
              </>
            ) : (
              <>
                <button className="btn bg_ bsm" onClick={() => nav("auth")}>Sign In</button>
                <button className="btn bp bsm" onClick={() => nav("auth")}>Get Started</button>
              </>
            )}
            <button className="hb" onClick={() => setOpen(p => !p)}><Ico n={open?"x":"menu"} s={22}/></button>
          </div>
        </div>
      </nav>
      <div className={`mob${open?" open":""}`}>
        {links.map(l => (
          <button key={l.id} className={`mnb${page===l.id?" act":""}`} onClick={() => nav(l.id)}>
            <Ico n={l.icon} s={17}/>{l.label}
          </button>
        ))}
        <div style={{borderTop:"1px solid rgba(167,139,250,.12)",marginTop:12,paddingTop:12}}>
          {user
            ? <button className="mnb" onClick={() => {logout();setOpen(false);}}><Ico n="logout" s={17}/>Sign Out</button>
            : <button className="mnb" onClick={() => nav("auth")}><Ico n="user" s={17}/>Sign In / Register</button>
          }
        </div>
      </div>
    </>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({ go }) => (
  <footer className="foot">
    <div className="fin">
      <div className="fgrid">
        <div>
          <div className="logo" style={{marginBottom:12}}>
            <Logo />
            <span className="ltx">Nex<span>cart</span></span>
          </div>
          <p style={{color:"var(--t3)",fontSize:13,lineHeight:1.75,maxWidth:260}}>India's #1 rewards shopping platform. Shop top brands, earn points, redeem anytime.</p>
        </div>
        {[
          {t:"Platform", links:[["Stores","stores"],["Leaderboard","leaderboard"],["Dashboard","dashboard"]]},
          {t:"Company",  links:[["About Us",""],["How It Works",""],["Blog",""],["Careers",""]]},
          {t:"Support",  links:[["FAQ",""],["Contact",""],["Privacy",""],["Terms",""]]},
        ].map(col => (
          <div key={col.t}>
            <div className="fct">{col.t}</div>
            {col.links.map(([l,p]) => <span key={l} className="flk" onClick={() => p && go(p)}>{l}</span>)}
          </div>
        ))}
      </div>
      <div className="fbot">
        <span style={{fontSize:12,color:"var(--t3)"}}>© 2026 Nexcart. All rights reserved. Rewards subject to merchant confirmation.</span>
        <span className="bdg bgb"><Ico n="shield" s={10}/>SSL Encrypted</span>
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING
// ═══════════════════════════════════════════════════════════════════════════════
const LandingPage = ({ go }) => (
  <div>
    {/* HERO */}
    <section className="gbg" style={{padding:"92px 20px 68px",position:"relative",overflow:"hidden",background:"linear-gradient(160deg,#0a0612 0%,#0e0a1a 55%,#130d22 100%)"}}>
      <div style={{position:"absolute",top:-160,left:"15%",width:520,height:520,background:"radial-gradient(circle,rgba(139,92,246,.22) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-80,right:"8%",width:360,height:360,background:"radial-gradient(circle,rgba(167,139,250,.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div className="si" style={{textAlign:"center",position:"relative"}}>
        <div className="slbl f0">
          <span style={{width:6,height:6,borderRadius:"50%",background:"var(--p1)",display:"inline-block",animation:"pulse 2s infinite"}}/>
          India's #1 Rewards Platform
        </div>
        <h1 className="f1" style={{fontSize:"clamp(36px,6vw,68px)",fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.07,maxWidth:840,margin:"0 auto 16px"}}>
          Shop Smarter.<br/>
          <span style={{background:"linear-gradient(135deg,#c4b5fd,#a78bfa,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Earn Real Rewards.</span>
        </h1>
        <p className="f2" style={{fontSize:16,color:"var(--t2)",maxWidth:500,margin:"0 auto 34px",lineHeight:1.8}}>
          Shop Amazon, Flipkart, Myntra & 100+ stores. Every purchase earns you reward points — tracked automatically.
        </p>
        <div className="f3" style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn bp blg" style={{animation:"glow 3s infinite"}} onClick={() => go("auth")}>
            Start Earning Free <Ico n="arrow" s={15} c="#fff"/>
          </button>
          <button className="btn bo blg" onClick={() => go("stores")}>Browse Stores <Ico n="store" s={15} c="var(--p1)"/></button>
        </div>
        <div className="f4" style={{display:"flex",justifyContent:"center",marginTop:56,flexWrap:"wrap",borderTop:"1px solid rgba(167,139,250,.14)",paddingTop:36}}>
          {[["₹12Cr+","Rewards Paid","💰"],["8.5L+","Happy Members","👥"],["100+","Partner Stores","🏪"],["Up to 10%","Cashback Rate","🎯"]].map(([v,l,ic],i,a) => (
            <div key={l} style={{padding:"0 28px",borderRight:i<a.length-1?"1px solid rgba(167,139,250,.14)":"none",textAlign:"center"}}>
              <div style={{fontSize:10,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6,display:"flex",alignItems:"center",gap:5,justifyContent:"center"}}><span>{ic}</span>{l}</div>
              <div style={{fontSize:22,fontWeight:800,letterSpacing:"-.3px"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FEATURED STORES */}
    <section className="sec" style={{background:"rgba(14,10,26,.6)"}}>
      <div className="si">
        <div style={{textAlign:"center",marginBottom:40}}>
          <div className="slbl"><Ico n="store" s={11}/>Partner Stores</div>
          <h2 className="stitle">Top Stores with Best Rewards</h2>
          <p className="ssub">India's most popular shopping destinations</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",gap:13}}>
          {STORES.filter(s=>s.featured).map(s => (
            <div key={s.id} className="card ch" style={{padding:"20px 16px",textAlign:"center",cursor:"pointer"}} onClick={() => go("stores")}>
              <div style={{width:50,height:50,borderRadius:12,background:"rgba(139,92,246,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:25,margin:"0 auto 10px"}}>{s.emoji}</div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:7}}>{s.name}</div>
              <span style={{background:"rgba(16,185,129,.1)",color:"var(--grn)",border:"1px solid rgba(16,185,129,.22)",borderRadius:100,padding:"3px 9px",fontSize:11,fontWeight:700}}>Up to {s.reward}%</span>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:26}}>
          <button className="btn bo" onClick={() => go("stores")}>View All 100+ Stores <Ico n="arrow" s={14} c="var(--p1)"/></button>
        </div>
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="sec">
      <div className="si">
        <div style={{textAlign:"center",marginBottom:48}}>
          <div className="slbl"><Ico n="info" s={11}/>How It Works</div>
          <h2 className="stitle">Three Steps to Earning</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))",gap:18}}>
          {[
            {n:"01",ic:"🏪",t:"Choose a Store",d:"Browse 100+ partner stores across fashion, electronics, travel, beauty & more."},
            {n:"02",ic:"🔗",t:"Shop via Our Link",d:"Click 'Shop & Earn' — you'll be securely redirected to the official store website."},
            {n:"03",ic:"🎁",t:"Earn Reward Points",d:"Rewards appear as Pending after purchase. Confirmed once the return window closes."},
          ].map((s,i) => (
            <div key={i} className="card" style={{padding:"28px 24px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:14,right:18,fontWeight:900,fontSize:42,color:"rgba(139,92,246,.12)",lineHeight:1,userSelect:"none",fontFamily:"monospace"}}>{s.n}</div>
              <div style={{width:48,height:48,background:"rgba(139,92,246,.15)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:23,marginBottom:16}}>{s.ic}</div>
              <h3 style={{fontWeight:700,fontSize:16,marginBottom:8}}>{s.t}</h3>
              <p style={{color:"var(--t2)",fontSize:13,lineHeight:1.78}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* TRUST */}
    <section className="sec" style={{background:"rgba(14,10,26,.6)"}}>
      <div className="si">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:44,alignItems:"center"}}>
          <div>
            <div className="slbl"><Ico n="shield" s={11}/>Trust & Safety</div>
            <h2 className="stitle" style={{marginBottom:13}}>Your Redirects Are<br/>100% Secure</h2>
            <p style={{color:"var(--t2)",fontSize:14,lineHeight:1.8,marginBottom:22}}>
              When you click "Shop & Earn", we securely redirect you via a tracked affiliate link. <strong style={{color:"var(--t1)"}}>We never store your payment data.</strong>
            </p>
            {["No fake stores — only verified brands","Rewards shown as Pending until merchant confirms","SSL encrypted redirect — no data stored in transit","Full transparency in your rewards dashboard"].map((item,i) => (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:9,fontSize:13,color:"var(--t2)",marginBottom:10}}>
                <div style={{width:18,height:18,background:"rgba(16,185,129,.15)",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                  <Ico n="check" s={11} c="var(--grn)" sw={2.5}/>
                </div>
                {item}
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
            {[["🔒","Encrypted","All redirects use HTTPS"],["👁️","Transparent","See every click & reward"],["⏳","Honest","No fake instant cashback"],["🏦","Verified","Only official partner stores"]].map(([ic,t,d]) => (
              <div key={t} className="card" style={{padding:"17px"}}>
                <div style={{fontSize:25,marginBottom:7}}>{ic}</div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{t}</div>
                <div style={{fontSize:12,color:"var(--t3)"}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* LEADERBOARD PREVIEW */}
    <section className="sec">
      <div className="si">
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:26,flexWrap:"wrap",gap:12}}>
          <div>
            <div className="slbl"><Ico n="trophy" s={11}/>Rankings</div>
            <h2 className="stitle">Top Earners This Week</h2>
          </div>
          <button className="btn bo bsm" onClick={() => go("leaderboard")}>Full Leaderboard <Ico n="arrow" s={13} c="var(--p1)"/></button>
        </div>
        <div className="card" style={{overflow:"hidden"}}>
          {LB_WEEKLY.slice(0,5).map((u,i) => (
            <div key={u.rank} style={{display:"grid",gridTemplateColumns:"42px 1fr auto",padding:"13px 18px",alignItems:"center",gap:13,borderBottom:i<4?"1px solid rgba(167,139,250,.1)":"none",background:u.isCurrent?"rgba(167,139,250,.05)":"transparent"}}>
              <div style={{fontWeight:800,fontSize:u.rank<=3?19:14,color:u.rank===1?"var(--gold)":u.rank===2?"#c4b5fd":u.rank===3?"#cd7f32":"var(--t3)",textAlign:"center"}}>
                {u.rank<=3?["🥇","🥈","🥉"][u.rank-1]:`#${u.rank}`}
              </div>
              <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                {u.display}
                {u.badge&&<span className="bdg bgy" style={{fontSize:10}}>{u.badge}</span>}
                {u.isCurrent&&<span className="bdg bgb" style={{fontSize:10}}>You</span>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:700,color:"var(--grn)",fontSize:14}}>{fmt(u.confirmed)}</div>
                <div style={{fontSize:11,color:"var(--t3)"}}>{fmt(u.spend)} spend</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{padding:"68px 20px",background:"linear-gradient(135deg,rgba(14,10,26,.8),rgba(19,13,34,.9))",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 80% at 50% 50%,rgba(124,58,237,.09),transparent)",pointerEvents:"none"}}/>
      <div style={{textAlign:"center",position:"relative"}}>
        <h2 style={{fontSize:"clamp(24px,4vw,42px)",fontWeight:800,letterSpacing:"-.6px",marginBottom:13}}>Ready to Start Earning?</h2>
        <p style={{color:"var(--t2)",fontSize:15,marginBottom:26}}>Join 8.5 lakh+ shoppers who earn rewards every day.</p>
        <button className="btn bp blg" style={{animation:"glow 3s infinite"}} onClick={() => go("auth")}>
          Create Free Account <Ico n="arrow" s={15} c="#fff"/>
        </button>
      </div>
    </section>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════════
const AuthPage = ({ go, login }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:"", email:"demo@nexcart.in", password:"password123", ref:"" });
  const { addToast, recordReferral } = useApp();

  const handle = async () => {
    if (!form.email || !form.password) { addToast("Please fill required fields","error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const u = {
      name: form.name || form.email.split("@")[0],
      email: form.email,
      referral_code: "NX" + Math.random().toString(36).slice(2,8).toUpperCase(),
      total_rewards: 3970,
      isAdmin: form.email.toLowerCase().includes("admin"),
    };
    setLoading(false);
    if (!isLogin && form.ref) {
      recordReferral(form.ref.toUpperCase(), u);
      addToast(`Referral code ${form.ref.toUpperCase()} applied! You'll both earn ₹50 🎉`,"success");
    }
    login(u);
    if (!isLogin) { setStep("onboard"); } else { addToast("Welcome back! 🎉","success"); go("dashboard"); }
  };

  if (step === "onboard") return (
    <div style={{minHeight:"calc(100vh - 66px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div className="card" style={{maxWidth:480,width:"100%",padding:"40px 34px",textAlign:"center"}}>
        <div style={{fontSize:50,marginBottom:16}}>🎉</div>
        <h2 style={{fontSize:24,fontWeight:800,letterSpacing:"-.4px",marginBottom:9}}>Welcome to Nexcart!</h2>
        <p style={{color:"var(--t2)",fontSize:14,lineHeight:1.75,marginBottom:26}}>Here's how rewards work</p>
        <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:30,textAlign:"left"}}>
          {[["🏪","Browse & Click","Pick a store and click 'Shop & Earn'."],["⏳","Rewards go Pending","Appear within 24–48 hrs after purchase."],["✅","Rewards get Confirmed","Confirmed after the return window (7–30 days)."],["🏆","Climb the Leaderboard","More spending = higher rank = exclusive prizes!"]].map(([ic,t,d],i)=>(
            <div key={i} style={{display:"flex",gap:11,padding:"11px 13px",background:"rgba(139,92,246,.07)",borderRadius:10}}>
              <span style={{fontSize:19,flexShrink:0}}>{ic}</span>
              <div><div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{t}</div><div style={{fontSize:12,color:"var(--t3)"}}>{d}</div></div>
            </div>
          ))}
        </div>
        <button className="btn bp" style={{width:"100%",padding:"13px"}} onClick={() => go("stores")}>
          Start Shopping <Ico n="arrow" s={14} c="#fff"/>
        </button>
      </div>
    </div>
  );

  return (
    <div className="gbg" style={{minHeight:"calc(100vh - 66px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"rgba(14,10,26,.6)"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,maxWidth:900,width:"100%",alignItems:"center"}}>
        <div style={{display:"flex",flexDirection:"column",gap:17}}>
          <div>
            <div className="slbl">Join Free Today</div>
            <h1 style={{fontSize:32,fontWeight:800,letterSpacing:"-.6px",lineHeight:1.2,marginTop:9}}>Earn Rewards on<br/>Every Purchase</h1>
            <p style={{color:"var(--t2)",fontSize:14,lineHeight:1.75,marginTop:9}}>Shop 100+ top brands. Earn points automatically. Zero cost.</p>
          </div>
          {[["💰","Up to 10% Rewards","on every qualifying purchase"],["🏆","Weekly Leaderboard","compete & win exclusive prizes"],["👥","Refer & Earn ₹50","for every friend you bring in"]].map(([ic,t,d])=>(
            <div key={t} style={{display:"flex",gap:11,alignItems:"flex-start"}}>
              <div style={{width:37,height:37,background:"rgba(139,92,246,.15)",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{ic}</div>
              <div><div style={{fontWeight:600,fontSize:13}}>{t}</div><div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>{d}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{padding:"30px 26px"}}>
          <div style={{display:"flex",gap:0,marginBottom:22,background:"rgba(139,92,246,.07)",borderRadius:9,padding:3}}>
            {["Sign In","Sign Up"].map((t,i)=>(
              <button key={t} onClick={()=>setIsLogin(i===0)} style={{flex:1,padding:"9px",borderRadius:7,border:"none",fontWeight:600,fontSize:13,transition:"all .2s",background:isLogin===(i===0)?"rgba(139,92,246,.2)":"transparent",color:isLogin===(i===0)?"var(--t1)":"var(--t3)",cursor:"pointer"}}>{t}</button>
            ))}
          </div>
          <button className="btn bg_" style={{width:"100%",marginBottom:16}}>
            <span style={{fontWeight:900,color:"#4285F4",fontSize:14}}>G</span> Continue with Google
          </button>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{flex:1,height:1,background:"rgba(167,139,250,.14)"}}/><span style={{fontSize:11,color:"var(--t3)",fontWeight:700}}>OR</span><div style={{flex:1,height:1,background:"rgba(167,139,250,.14)"}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {!isLogin&&<div><label className="fl">Full Name</label><input className="fi" placeholder="Rahul Sharma" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>}
            <div><label className="fl">Email</label><input className="fi" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
            <div><label className="fl">Password</label><input className="fi" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}/></div>
            {!isLogin&&<div><label className="fl">Referral Code <span style={{color:"var(--t3)",fontWeight:400}}>(optional)</span></label><input className="fi" placeholder="e.g. NXABC123" value={form.ref} onChange={e=>setForm(p=>({...p,ref:e.target.value}))}/></div>}
            <button className="btn bp" style={{padding:"12px",width:"100%",marginTop:4}} onClick={handle} disabled={loading}>
              {loading?<span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⏳</span>:isLogin?"Sign In":"Create Account"}
            </button>
          </div>
          <p style={{fontSize:11,color:"var(--t3)",textAlign:"center",marginTop:13,lineHeight:1.6}}>
            Rewards are not instant. Subject to merchant confirmation.<br/>
            💡 Add "admin" to email for admin panel access.
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORES
// ═══════════════════════════════════════════════════════════════════════════════
const StoresPage = ({ user, go, stores }) => {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const { addToast, recordClick } = useApp();

  const filtered = stores.filter(s =>
    (cat==="All" || s.category===cat) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const shop = (store) => {
    if (!user) { go("auth"); addToast("Sign in to start earning!","info"); return; }
    const url = store.affiliate_url && store.affiliate_url.startsWith("http")
      ? store.affiliate_url
      : "https://www." + store.name.toLowerCase().replace(/\s+/g,"") + ".com";
    recordClick(store, user);
    // Use anchor click to bypass Claude sandbox popup blocker
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast("Opened " + store.name + ". Rewards appear as Pending after purchase ✅","success");
  };

  return (
    <section className="sec">
      <div className="si">
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:26,flexWrap:"wrap",gap:13}}>
          <div>
            <div className="slbl"><Ico n="store" s={11}/>{stores.length} Stores</div>
            <h1 className="stitle" style={{fontSize:28}}>Shop & Earn Rewards</h1>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:9,background:"var(--g2)",border:"1px solid var(--b2)",borderRadius:10,padding:"9px 14px",width:"clamp(190px,26%,270px)"}}>
            <Ico n="search" s={14} c="var(--t3)"/>
            <input style={{background:"none",border:"none",outline:"none",color:"var(--t1)",fontSize:13,width:"100%"}} placeholder="Search stores…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>
        <div style={{display:"flex",gap:7,marginBottom:22,flexWrap:"wrap"}}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{padding:"6px 14px",borderRadius:100,border:`1px solid ${cat===c?"var(--p1)":"rgba(167,139,250,.18)"}`,background:cat===c?"rgba(167,139,250,.16)":"var(--g1)",color:cat===c?"var(--p1)":"var(--t2)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>{c}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(205px,1fr))",gap:15}}>
          {filtered.map(s=>(
            <div key={s.id} className="card ch" style={{padding:"21px",display:"flex",flexDirection:"column",position:"relative"}}>
              {s.featured&&<div style={{position:"absolute",top:10,right:10,background:"linear-gradient(135deg,var(--gold),#f97316)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:100,textTransform:"uppercase",letterSpacing:".05em"}}>Hot</div>}
              <div style={{width:50,height:50,background:"rgba(139,92,246,.14)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:25,marginBottom:12}}>{s.emoji}</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>{s.name}</div>
              <div style={{fontSize:11,color:"var(--t3)",fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:9}}>{s.category}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:13}}>
                <span style={{background:"rgba(16,185,129,.1)",color:"var(--grn)",border:"1px solid rgba(16,185,129,.22)",borderRadius:7,padding:"4px 9px",fontSize:12,fontWeight:700}}>💰 Up to {s.reward}%</span>
                <span style={{fontSize:11,color:"var(--t3)"}}>{(s.visits/1000).toFixed(0)}K</span>
              </div>
              <button className="btn bp" style={{width:"100%",fontSize:13,padding:"10px",marginTop:"auto"}} onClick={()=>shop(s)}>
                  <Ico n="ext" s={13} c="#fff"/>Shop & Earn
              </button>
            </div>
          ))}
        </div>
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:"68px 24px"}}>
            <div style={{fontSize:42,marginBottom:13}}>🔍</div>
            <div style={{fontWeight:700,fontSize:18}}>No stores found</div>
            <p style={{color:"var(--t2)",marginTop:6}}>Try a different search or category</p>
          </div>
        )}
        <div style={{marginTop:32,padding:"13px 17px",background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:11,display:"flex",gap:10,alignItems:"flex-start"}}>
          <Ico n="info" s={14} c="var(--p1)"/>
          <p style={{fontSize:12,color:"var(--t2)",lineHeight:1.7}}>
            <strong style={{color:"var(--t1)"}}>Important:</strong> Rewards are not instant. They appear as "Pending" after your purchase and become "Confirmed" once the merchant's return window (7–30 days) closes.
          </p>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const DashboardPage = ({ user }) => {
  const [tab, setTab] = useState("overview");
  const [rewards, setRewards] = useState(REWARDS_INIT);
  const { addToast, referrals } = useApp();

  const myRefs = referrals.filter(r => r.referrerCode === user?.referral_code);
  const refEarned = myRefs.filter(r=>r.status==="confirmed").length * 50;
  const refPending = myRefs.filter(r=>r.status==="pending").length;

  const conf = rewards.filter(r=>r.status==="confirmed").reduce((a,r)=>a+r.amount,0);
  const pend = rewards.filter(r=>r.status==="pending").reduce((a,r)=>a+r.amount,0);
  const milestone = 5000;
  const prog = Math.min((conf/milestone)*100,100);

  return (
    <section className="sec">
      <div className="si">
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:26,flexWrap:"wrap"}}>
          <div style={{width:48,height:48,background:"linear-gradient(135deg,var(--p1),var(--p2))",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#fff"}}>{user?.name[0].toUpperCase()}</div>
          <div>
            <h1 style={{fontSize:20,fontWeight:800,letterSpacing:"-.3px"}}>Hey, {user?.name}! 👋</h1>
            <p style={{color:"var(--t3)",fontSize:13}}>Ref: <strong style={{color:"var(--p1)",letterSpacing:".05em"}}>{user?.referral_code}</strong></p>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:7,flexWrap:"wrap"}}>
            {["overview","history","referral"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 15px",borderRadius:9,border:"none",fontWeight:600,fontSize:12,background:tab===t?"var(--p1)":"var(--g2)",color:tab===t?"#fff":"var(--t2)",textTransform:"capitalize",cursor:"pointer",transition:"all .2s"}}>{t}</button>
            ))}
          </div>
        </div>

        {tab==="overview"&&<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(165px,1fr))",gap:13,marginBottom:18}}>
            {[
              {l:"Total Rewards",v:fmt(conf+pend),m:"All time",ic:"💰",col:"var(--t1)"},
              {l:"Confirmed",v:fmt(conf),m:"Ready to redeem",ic:"✅",col:"var(--grn)"},
              {l:"Pending",v:fmt(pend),m:"Awaiting confirmation",ic:"⏳",col:"var(--gold)"},
              {l:"Reward Points",v:fmtPts(user?.total_rewards||3970),m:"Lifetime earned",ic:"⭐",col:"var(--p1)"},
            ].map(s=>(
              <div key={s.l} className="stat" style={{position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:13,right:13,fontSize:21,opacity:.35}}>{s.ic}</div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:6}}>{s.l}</div>
                <div style={{fontSize:21,fontWeight:800,letterSpacing:"-.5px",color:s.col}}>{s.v}</div>
                <div style={{fontSize:12,color:"var(--t3)",marginTop:4}}>{s.m}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:"21px",marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>🎯 Next Milestone — Diamond Status</div>
                <div style={{fontSize:12,color:"var(--t3)",marginTop:3}}>Reach {fmt(milestone)} confirmed rewards</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:800,fontSize:17,color:"var(--p1)"}}>{Math.round(prog)}%</div>
                <div style={{fontSize:11,color:"var(--t3)"}}>{fmt(milestone-conf)} to go</div>
              </div>
            </div>
            <div className="pt"><div className="pf" style={{width:`${prog}%`}}/></div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}>
              <span style={{fontSize:11,color:"var(--t3)"}}>🥈 Silver (current)</span>
              <span style={{fontSize:11,color:"var(--t3)"}}>💎 Diamond • {fmt(milestone)}</span>
            </div>
          </div>
          <div className="card" style={{overflow:"hidden"}}>
            <div style={{padding:"13px 17px",borderBottom:"1px solid rgba(167,139,250,.12)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontWeight:700,fontSize:14}}>Recent Rewards</div>
              <button className="btn bg_ bsm" onClick={()=>setTab("history")}>View All</button>
            </div>
            <table className="tbl">
              <thead><tr><th>Store</th><th>Order Value</th><th>Reward</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {rewards.slice(0,4).map(r=>(
                  <tr key={r.id}>
                    <td><span style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{r.emoji}</span>{r.store}</span></td>
                    <td>{fmt(r.order_value)}</td>
                    <td style={{color:"var(--grn)",fontWeight:600}}>{fmt(r.amount)}</td>
                    <td style={{color:"var(--t3)"}}>{r.date}</td>
                    <td><span className={`bdg ${r.status==="confirmed"?"bgg":"bgy"}`}>{r.status==="confirmed"?<Ico n="check" s={9} sw={2.5}/>:<Ico n="clock" s={9}/>}{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {tab==="history"&&(
          <div className="card" style={{overflow:"hidden"}}>
            <div style={{padding:"13px 17px",borderBottom:"1px solid rgba(167,139,250,.12)"}}>
              <div style={{fontWeight:700,fontSize:14}}>Complete Reward History</div>
              <div style={{fontSize:12,color:"var(--t3)",marginTop:3}}>{rewards.length} transactions</div>
            </div>
            <table className="tbl">
              <thead><tr><th>Store</th><th>Order Value</th><th>Reward</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {rewards.map(r=>(
                  <tr key={r.id}>
                    <td><span style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:16}}>{r.emoji}</span><strong>{r.store}</strong></span></td>
                    <td>{fmt(r.order_value)}</td>
                    <td style={{color:"var(--grn)",fontWeight:700}}>{fmt(r.amount)}</td>
                    <td style={{color:"var(--t3)"}}>{r.date}</td>
                    <td><span className={`bdg ${r.status==="confirmed"?"bgg":"bgy"}`}>{r.status==="confirmed"?<Ico n="check" s={9} sw={2.5}/>:<Ico n="clock" s={9}/>}{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab==="referral"&&<>
          <div style={{background:"linear-gradient(135deg,rgba(139,92,246,.1),rgba(124,58,237,.16))",border:"1px solid var(--b2)",borderRadius:"var(--r)",padding:"26px",marginBottom:18}}>
            <div style={{display:"flex",gap:13,alignItems:"flex-start",flexWrap:"wrap"}}>
              <div style={{fontSize:36}}>🎁</div>
              <div style={{flex:1}}>
                <h3 style={{fontWeight:800,fontSize:18,marginBottom:5}}>Refer Friends, Earn ₹50</h3>
                <p style={{color:"var(--t2)",fontSize:13,lineHeight:1.75,marginBottom:16}}>Share your link. When your friend signs up and makes their first purchase, you both earn ₹50!</p>
                <div style={{background:"rgba(139,92,246,.08)",borderRadius:9,padding:"12px 15px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontSize:10,color:"var(--t3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>Your Referral Link</div>
                    <div style={{fontWeight:700,fontSize:14,color:"var(--p1)"}}>nexcart.in/ref/{user?.referral_code}</div>
                  </div>
                  <button className="btn bp bsm" onClick={()=>{navigator.clipboard?.writeText(`https://nexcart.in/ref/${user?.referral_code}`).catch(()=>{});addToast("Referral link copied! 🎉","success");}}><Ico n="copy" s={12} c="#fff"/>Copy</button>
                </div>
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:13,marginBottom:18}}>
            {[[myRefs.length,"Total Referrals","👥",""],[`₹${refEarned}`,"Earned from Refs","💰","var(--grn)"],[refPending,"Pending Refs","⏳","var(--gold)"],["₹50/ref","Bonus Rate","🎯",""]].map(([v,l,ic,c])=>(
              <div key={l} className="stat">
                <div style={{fontSize:21,marginBottom:5}}>{ic}</div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{l}</div>
                <div style={{fontSize:20,fontWeight:800,color:c||"var(--t1)"}}>{v}</div>
              </div>
            ))}
          </div>
          {myRefs.length>0&&(
            <div className="card" style={{overflow:"hidden",marginBottom:18}}>
              <div style={{padding:"13px 17px",borderBottom:"1px solid rgba(167,139,250,.12)",fontWeight:700,fontSize:14}}>Your Referral History</div>
              <table className="tbl">
                <thead><tr><th>Referred User</th><th>Email</th><th>Date</th><th>Bonus</th><th>Status</th></tr></thead>
                <tbody>
                  {myRefs.map(r=>(
                    <tr key={r.id}>
                      <td style={{fontWeight:600}}>{r.referred}</td>
                      <td style={{color:"var(--t3)",fontSize:12}}>{r.referredEmail}</td>
                      <td style={{color:"var(--t3)",fontSize:12}}>{r.date}</td>
                      <td style={{color:"var(--grn)",fontWeight:700}}>₹{r.bonus}</td>
                      <td><span className={`bdg ${r.status==="confirmed"?"bgg":"bgy"}`}>{r.status==="confirmed"?"✅ ":"⏳ "}{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {myRefs.length===0&&(
            <div className="card" style={{padding:"28px",textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:40,marginBottom:10}}>👥</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:5}}>No referrals yet</div>
              <p style={{color:"var(--t3)",fontSize:13}}>Share your link and start earning ₹50 for every friend who signs up!</p>
            </div>
          )}
          <div className="card" style={{padding:21}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:13}}>Share via</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["📱 WhatsApp","📧 Email","🐦 Twitter","📘 Facebook"].map(p=>(
                <button key={p} className="btn bg_ bsm" onClick={()=>addToast(`Sharing via ${p.split(" ")[1]}!`,"info")}>{p}</button>
              ))}
            </div>
          </div>
          </>}
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEADERBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const LeaderboardPage = () => {
  const [period, setPeriod] = useState("weekly");
  const data = period==="weekly"?LB_WEEKLY:LB_MONTHLY;
  const cur = data.find(u=>u.isCurrent);

  return (
    <section className="sec">
      <div className="si">
        <div style={{textAlign:"center",marginBottom:40}}>
          <div className="slbl"><Ico n="trophy" s={11}/>Rankings</div>
          <h1 className="stitle">Leaderboard</h1>
          <p className="ssub" style={{maxWidth:440,margin:"10px auto 0"}}>Top shoppers by confirmed rewards. Climb the ranks to win prizes!</p>
          <div style={{display:"inline-flex",gap:0,marginTop:20,background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:11,padding:4}}>
            {["weekly","monthly"].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{padding:"8px 22px",borderRadius:8,border:"none",fontWeight:600,fontSize:13,background:period===p?"var(--g2)":"transparent",color:period===p?"var(--t1)":"var(--t3)",textTransform:"capitalize",cursor:"pointer",transition:"all .2s"}}>{p==="weekly"?"This Week":"This Month"}</button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.12fr 1fr",gap:13,maxWidth:660,margin:"0 auto 32px",alignItems:"flex-end"}}>
          {[data[1],data[0],data[2]].map((u,i)=>{
            const isC=i===1;
            return (
              <div key={u.rank} className="card" style={{padding:"24px 17px",textAlign:"center",border:isC?"2px solid var(--gold)":"1px solid var(--b1)",background:isC?"rgba(245,158,11,.05)":"var(--g1)",order:isC?-1:0}}>
                <div style={{fontSize:isC?42:30,marginBottom:7}}>{["🥈","🥇","🥉"][i]}</div>
                <div style={{fontWeight:700,fontSize:14}}>{u.display}</div>
                {u.badge&&<div style={{fontSize:10,color:"var(--gold)",fontWeight:700,marginTop:3}}>{u.badge}</div>}
                <div style={{fontWeight:800,fontSize:isC?18:14,color:"var(--grn)",marginTop:8}}>{fmt(u.confirmed)}</div>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>rewards</div>
              </div>
            );
          })}
        </div>
        {cur&&(
          <div style={{background:"rgba(167,139,250,.07)",border:"1px solid rgba(167,139,250,.25)",borderRadius:11,padding:"13px 17px",marginBottom:17,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span className="bdg bgb">Your Rank</span>
              <span style={{fontWeight:700,fontSize:14}}>#{cur.rank} — {cur.display}</span>
            </div>
            <div style={{display:"flex",gap:20}}>
              <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"var(--t3)"}}>Confirmed</div><div style={{fontWeight:700,color:"var(--grn)"}}>{fmt(cur.confirmed)}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"var(--t3)"}}>Total Spend</div><div style={{fontWeight:700}}>{fmt(cur.spend)}</div></div>
            </div>
          </div>
        )}
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"13px 17px",borderBottom:"1px solid rgba(167,139,250,.12)",display:"flex",justifyContent:"space-between"}}>
            <div style={{fontWeight:700,fontSize:14}}>Full Rankings</div>
            <span style={{fontSize:12,color:"var(--t3)"}}>{period==="weekly"?"Resets every Monday":"Resets on 1st of month"}</span>
          </div>
          <table className="tbl">
            <thead><tr><th style={{width:54}}>Rank</th><th>User</th><th>Total Spend</th><th>Confirmed</th><th>Badge</th></tr></thead>
            <tbody>
              {data.map(u=>(
                <tr key={u.rank} style={{background:u.isCurrent?"rgba(167,139,250,.05)":"transparent"}}>
                  <td style={{fontWeight:800,fontSize:u.rank<=3?18:14,color:u.rank===1?"var(--gold)":u.rank===2?"#c4b5fd":u.rank===3?"#cd7f32":"var(--t3)",textAlign:"center"}}>
                    {u.rank<=3?["🥇","🥈","🥉"][u.rank-1]:`#${u.rank}`}
                  </td>
                  <td style={{fontWeight:600}}>{u.display}{u.isCurrent&&<span className="bdg bgb" style={{marginLeft:7,fontSize:10}}>You</span>}</td>
                  <td>{fmt(u.spend)}</td>
                  <td style={{color:"var(--grn)",fontWeight:700}}>{fmt(u.confirmed)}</td>
                  <td>{u.badge?<span className="bdg bgy" style={{fontSize:10}}>{u.badge}</span>:<span style={{color:"var(--t3)",fontSize:12}}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{marginTop:26,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:13}}>
          {[["🏆","Top Spender","#1 on weekly leaderboard"],["⚡","Power Buyer","#2 on weekly leaderboard"],["🔥","On Fire","#3 on weekly leaderboard"],["💎","Diamond Member","₹5,000+ confirmed rewards"]].map(([ic,t,d])=>(
            <div key={t} className="card" style={{padding:"13px 15px",display:"flex",gap:11,alignItems:"center"}}>
              <span style={{fontSize:25}}>{ic}</span>
              <div><div style={{fontWeight:600,fontSize:13}}>{t}</div><div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORE MODAL — Add / Edit
// ═══════════════════════════════════════════════════════════════════════════════
const EMOJIS = ["📦","🛒","👗","✨","💄","🏷️","✈️","🛵","🍕","⚡","🎧","💊","🏪","🎮","👟","📱","🛍️","🏠"];
const STORE_CATS = ["General","Fashion","Beauty","Travel","Grocery","Food","Electronics","Health","Other"];

const StoreModal = ({ store, onClose, onSave }) => {
  const blank = { name:"", category:"Other", affiliate_url:"", logo_url:"", reward:5, description:"", featured:false, active:true, emoji:"🏪" };
  const [form, setForm] = useState(store ? {...store, affiliate_url: store.affiliate_url||"", logo_url: store.logo_url||"", description: store.description||""} : blank);
  const [errors, setErrors] = useState({});

  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Store name is required";
    if (!form.reward || form.reward < 0 || form.reward > 100) e.reward = "Enter a valid % (0–100)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    // Normalize affiliate URL before saving
    let finalForm = {...form};
    const url = finalForm.affiliate_url.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      finalForm.affiliate_url = "https://" + url.replace(/^\/+/, "");
    }
    if (!finalForm.name.trim()) { setErrors({name:"Store name is required"}); return; }
    setErrors({});
    onSave(finalForm);
  };

  const inp = {
    background:"rgba(255,255,255,.06)",
    border:"1px solid rgba(167,139,250,.22)",
    borderRadius:9,
    padding:"11px 14px",
    color:"var(--t1)",
    fontSize:14,
    outline:"none",
    width:"100%",
    fontFamily:"var(--f)",
    transition:"border-color .2s, box-shadow .2s",
  };
  const inpFocus = (e) => { e.target.style.borderColor="var(--p1)"; e.target.style.boxShadow="0 0 0 3px rgba(167,139,250,.18)"; };
  const inpBlur  = (e) => { e.target.style.borderColor="rgba(167,139,250,.22)"; e.target.style.boxShadow="none"; };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(10px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:"#13103a",border:"1px solid rgba(167,139,250,.28)",borderRadius:18,width:"100%",maxWidth:620,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,.6),0 0 0 1px rgba(167,139,250,.1)",padding:"32px 36px",position:"relative"}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <div>
            <h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-.3px"}}>{store?"Edit Store":"Add New Store"}</h2>
            <p style={{fontSize:13,color:"var(--t3)",marginTop:3}}>{store?"Update store details below":"Fill in the details to add a new partner store"}</p>
          </div>
          <button onClick={onClose} style={{width:34,height:34,borderRadius:9,background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.2)",color:"var(--t2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,.15)";e.currentTarget.style.color="#ef4444";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(167,139,250,.1)";e.currentTarget.style.color="var(--t2)";}}>
            <Ico n="x" s={16}/>
          </button>
        </div>

        {/* Emoji picker row */}
        <div style={{marginBottom:22}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:8}}>Store Icon</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {EMOJIS.map(em=>(
              <button key={em} onClick={()=>set("emoji",em)} style={{width:38,height:38,borderRadius:9,border:`2px solid ${form.emoji===em?"var(--p1)":"rgba(167,139,250,.15)"}`,background:form.emoji===em?"rgba(167,139,250,.2)":"rgba(139,92,246,.07)",fontSize:18,cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center"}}>{em}</button>
            ))}
          </div>
        </div>

        {/* Row 1: Name + Category */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Store Name <span style={{color:"var(--p1)"}}>*</span></label>
            <input style={{...inp,borderColor:errors.name?"var(--red)":"rgba(167,139,250,.22)"}} placeholder="e.g., Amazon" value={form.name} onChange={e=>set("name",e.target.value)} onFocus={inpFocus} onBlur={inpBlur}/>
            {errors.name&&<span style={{fontSize:11,color:"var(--red)",marginTop:4,display:"block"}}>{errors.name}</span>}
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Category <span style={{color:"var(--p1)"}}>*</span></label>
            <select style={{...inp,cursor:"pointer",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 13px center"}} value={form.category} onChange={e=>set("category",e.target.value)} onFocus={inpFocus} onBlur={inpBlur}>
              {STORE_CATS.map(c=><option key={c} value={c} style={{background:"#13103a"}}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Affiliate URL */}
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Affiliate URL <span style={{color:"var(--p1)"}}>*</span></label>
          <input style={{...inp,borderColor:errors.affiliate_url?"var(--red)":"rgba(167,139,250,.22)"}} placeholder="https://... or paste any link" value={form.affiliate_url} onChange={e=>set("affiliate_url",e.target.value)} onFocus={inpFocus} onBlur={e=>{inpBlur(e);const v=form.affiliate_url.trim();if(v&&!/^https?:\/\//i.test(v))setForm(p=>({...p,affiliate_url:"https://"+v.replace(/^\/+/,"")}));}}/>
          {errors.affiliate_url&&<span style={{fontSize:11,color:"var(--red)",marginTop:4,display:"block"}}>{errors.affiliate_url}</span>}
        </div>

        {/* Row 2: Logo URL + Reward % */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Logo URL</label>
            <input style={inp} placeholder="https://..." value={form.logo_url} onChange={e=>set("logo_url",e.target.value)} onFocus={inpFocus} onBlur={inpBlur}/>
          </div>
          <div>
            <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Reward Percentage <span style={{color:"var(--p1)"}}>*</span></label>
            <input style={{...inp,borderColor:errors.reward?"var(--red)":"rgba(167,139,250,.22)"}} type="number" min="0" max="100" placeholder="5" value={form.reward} onChange={e=>set("reward",Number(e.target.value))} onFocus={inpFocus} onBlur={inpBlur}/>
            {errors.reward&&<span style={{fontSize:11,color:"var(--red)",marginTop:4,display:"block"}}>{errors.reward}</span>}
          </div>
        </div>

        {/* Description */}
        <div style={{marginBottom:22}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Description</label>
          <textarea style={{...inp,minHeight:90,resize:"vertical",lineHeight:1.6}} placeholder="Brief description of the store..." value={form.description} onChange={e=>set("description",e.target.value)} onFocus={inpFocus} onBlur={inpBlur}/>
        </div>

        {/* Toggles */}
        <div style={{display:"flex",gap:28,padding:"16px 18px",background:"rgba(139,92,246,.07)",borderRadius:11,border:"1px solid rgba(167,139,250,.12)",marginBottom:26}}>
          {[["featured","Featured"],["active","Active"]].map(([key,label])=>(
            <label key={key} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",userSelect:"none"}}>
              <div onClick={()=>set(key,!form[key])} style={{width:44,height:24,borderRadius:100,background:form[key]?"var(--p1)":"rgba(167,139,250,.18)",border:`1px solid ${form[key]?"var(--p2)":"rgba(167,139,250,.25)"}`,position:"relative",transition:"all .25s",flexShrink:0,cursor:"pointer"}}>
                <div style={{position:"absolute",top:3,left:form[key]?22:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
              </div>
              <span style={{fontSize:14,fontWeight:600,color:form[key]?"var(--t1)":"var(--t3)"}}>{label}</span>
            </label>
          ))}
        </div>

        {/* Footer buttons */}
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
          <button className="btn bg_ bsm" style={{padding:"10px 22px",fontSize:14}} onClick={onClose}>Cancel</button>
          <button className="btn bp bsm" style={{padding:"10px 26px",fontSize:14}} onClick={handleSave}>
            {store ? <><Ico n="check" s={14} c="#fff"/>{" "}Save Changes</> : <><Ico n="plus" s={14} c="#fff"/>{" "}Add Store</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN — REWARDS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const RewardsSection = ({ rewards, setRewards }) => {
  const { addToast } = useApp();
  const [rwFilter, setRwFilter] = useState("all");
  const [rwSearch, setRwSearch] = useState("");
  const [editReward, setEditReward] = useState(null);

  const total     = rewards.reduce((a,r)=>a+r.amount,0);
  const confirmed = rewards.filter(r=>r.status==="confirmed").reduce((a,r)=>a+r.amount,0);
  const pending   = rewards.filter(r=>r.status==="pending").reduce((a,r)=>a+r.amount,0);
  const rejected  = rewards.filter(r=>r.status==="rejected").reduce((a,r)=>a+r.amount,0);

  const visible = rewards.filter(r=>{
    const ms = rwFilter==="all"||r.status===rwFilter;
    const mq = r.store.toLowerCase().includes(rwSearch.toLowerCase())||r.id.toLowerCase().includes(rwSearch.toLowerCase());
    return ms&&mq;
  });

  return <>
    {editReward&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(10px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setEditReward(null)}>
        <div style={{background:"#13103a",border:"1px solid rgba(167,139,250,.28)",borderRadius:18,width:"100%",maxWidth:500,padding:"32px 36px",boxShadow:"0 24px 80px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <h2 style={{fontWeight:800,fontSize:19,letterSpacing:"-.3px"}}>Edit Reward</h2>
            <button onClick={()=>setEditReward(null)} style={{width:34,height:34,borderRadius:9,background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.2)",color:"var(--t2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico n="x" s={16}/></button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Store</label><input className="fi" value={editReward.store} onChange={e=>setEditReward(p=>({...p,store:e.target.value}))}/></div>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Status</label>
              <select className="fi" value={editReward.status} onChange={e=>setEditReward(p=>({...p,status:e.target.value}))} style={{cursor:"pointer"}}>
                <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="rejected">Rejected</option>
              </select>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Order Value (₹)</label><input className="fi" type="number" value={editReward.order_value} onChange={e=>setEditReward(p=>({...p,order_value:Number(e.target.value)}))}/></div>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Reward Amount (₹)</label><input className="fi" type="number" value={editReward.amount} onChange={e=>setEditReward(p=>({...p,amount:Number(e.target.value)}))}/></div>
          </div>
          <div style={{marginBottom:22}}><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Date</label><input className="fi" type="date" value={editReward.date} onChange={e=>setEditReward(p=>({...p,date:e.target.value}))}/></div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
            <button className="btn bg_ bsm" style={{padding:"10px 22px"}} onClick={()=>setEditReward(null)}>Cancel</button>
            <button className="btn bp bsm" style={{padding:"10px 26px"}} onClick={()=>{setRewards(p=>p.map(r=>r.id===editReward.id?editReward:r));addToast("Reward updated!","success");setEditReward(null);}}><Ico n="check" s={13} c="#fff"/> Save</button>
          </div>
        </div>
      </div>
    )}

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div><h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-.3px"}}>Reward Management</h2><p style={{fontSize:13,color:"var(--t3)",marginTop:2}}>{rewards.length} total transactions</p></div>
      <button className="btn bp bsm" onClick={()=>{const nr={id:"r"+Date.now(),store:"Manual Store",emoji:"💰",amount:500,order_value:10000,status:"pending",date:new Date().toISOString().slice(0,10)};setRewards(p=>[nr,...p]);setEditReward(nr);addToast("New reward created","info");}}><Ico n="plus" s={13} c="#fff"/>Add Reward</button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
      {[[fmt(total),"Total","💰","var(--p1)"],[fmt(confirmed),"Confirmed","✅","var(--grn)"],[fmt(pending),"Pending","⏳","var(--gold)"],[fmt(rejected),"Rejected","❌","var(--red)"]].map(([v,l,ic,col])=>(
        <div key={l} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:13,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:12,right:14,fontSize:22,opacity:.3}}>{ic}</div>
          <div style={{fontSize:18,fontWeight:800,color:col,letterSpacing:"-.3px"}}>{v}</div>
          <div style={{fontSize:12,color:"var(--t3)",marginTop:4,fontWeight:600}}>{l}</div>
        </div>
      ))}
    </div>

    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:9,padding:"8px 13px",flex:1,minWidth:200}}>
        <Ico n="search" s={13} c="var(--t3)"/>
        <input style={{background:"none",border:"none",outline:"none",color:"var(--t1)",fontSize:13,width:"100%"}} placeholder="Search by store or ID…" value={rwSearch} onChange={e=>setRwSearch(e.target.value)}/>
      </div>
      <div style={{display:"flex",gap:6}}>
        {["all","pending","confirmed","rejected"].map(f=>(
          <button key={f} onClick={()=>setRwFilter(f)} style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${rwFilter===f?"var(--p1)":"rgba(167,139,250,.18)"}`,background:rwFilter===f?"rgba(167,139,250,.16)":"var(--g1)",color:rwFilter===f?"var(--p1)":"var(--t2)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s",textTransform:"capitalize"}}>{f}</button>
        ))}
      </div>
    </div>

    <div className="card" style={{overflow:"hidden"}}>
      <table className="tbl">
        <thead><tr><th>ID</th><th>Store</th><th>Order Value</th><th>Reward</th><th>Date</th><th>Status</th><th style={{textAlign:"center"}}>Actions</th></tr></thead>
        <tbody>
          {visible.length===0
            ?<tr><td colSpan={7} style={{textAlign:"center",padding:"36px",color:"var(--t3)"}}>No rewards match your filter</td></tr>
            :visible.map(r=>(
              <tr key={r.id}>
                <td style={{fontSize:11,fontFamily:"monospace",color:"var(--t3)"}}>{r.id}</td>
                <td><div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:15}}>{r.emoji}</span><span style={{fontWeight:600}}>{r.store}</span></div></td>
                <td>{fmt(r.order_value)}</td>
                <td style={{color:"var(--grn)",fontWeight:700}}>{fmt(r.amount)}</td>
                <td style={{color:"var(--t3)",fontSize:12}}>{r.date}</td>
                <td><span className={`bdg ${r.status==="confirmed"?"bgg":r.status==="rejected"?"bdr":"bgy"}`} style={{textTransform:"capitalize"}}>{r.status==="confirmed"?"✅ ":r.status==="rejected"?"❌ ":"⏳ "}{r.status}</span></td>
                <td>
                  <div style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap"}}>
                    {r.status==="pending"&&<>
                      <button className="btn bsm" style={{background:"rgba(16,185,129,.1)",color:"var(--grn)",border:"1px solid rgba(16,185,129,.22)",fontSize:11,padding:"5px 10px"}} onClick={()=>{setRewards(p=>p.map(x=>x.id===r.id?{...x,status:"confirmed"}:x));addToast(`✅ Confirmed ${r.store}`,"success");}}>Confirm</button>
                      <button className="btn bsm" style={{background:"rgba(239,68,68,.08)",color:"var(--red)",border:"1px solid rgba(239,68,68,.2)",fontSize:11,padding:"5px 10px"}} onClick={()=>{setRewards(p=>p.map(x=>x.id===r.id?{...x,status:"rejected"}:x));addToast(`Rejected ${r.store}`,"info");}}>Reject</button>
                    </>}
                    {r.status!=="pending"&&<button className="btn bsm" style={{background:"rgba(167,139,250,.1)",color:"var(--p1)",border:"1px solid rgba(167,139,250,.2)",fontSize:11,padding:"5px 10px"}} onClick={()=>{setRewards(p=>p.map(x=>x.id===r.id?{...x,status:"pending"}:x));addToast("Reset to pending","info");}}>Reset</button>}
                    <button className="btn bg_ bsm" style={{fontSize:11,padding:"5px 10px"}} onClick={()=>setEditReward({...r})}><Ico n="edit" s={11}/></button>
                    <button className="btn bdr bsm" style={{fontSize:11,padding:"5px 10px"}} onClick={()=>{setRewards(p=>p.filter(x=>x.id!==r.id));addToast("Reward deleted","success");}}><Ico n="trash" s={11}/></button>
                  </div>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN — USERS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const USERS_INIT = [
  {id:"u1",name:"Rahul Sharma",  email:"rahul@example.com",  ref:"NXAB1234",rewards:4210,status:"active",  joined:"2025-10-01",role:"user"},
  {id:"u2",name:"Priya Kapoor",  email:"priya@example.com",  ref:"NXCD5678",rewards:3575,status:"active",  joined:"2025-10-12",role:"user"},
  {id:"u3",name:"Vikram Joshi",  email:"vikram@example.com", ref:"NXEF9012",rewards:3445,status:"active",  joined:"2025-10-18",role:"user"},
  {id:"u4",name:"Ananya Mehta",  email:"ananya@example.com", ref:"NXGH3456",rewards:2770,status:"active",  joined:"2025-10-21",role:"user"},
  {id:"u5",name:"Suhas Reddy",   email:"suhas@example.com",  ref:"NXIJ7890",rewards:2490,status:"banned",  joined:"2025-10-28",role:"user"},
  {id:"u6",name:"Deepa Nair",    email:"deepa@example.com",  ref:"NXKL2345",rewards:2105,status:"active",  joined:"2025-11-02",role:"user"},
  {id:"u7",name:"Admin User",    email:"admin@nexcart.in",   ref:"NXADMIN1",rewards:0,   status:"active",  joined:"2025-09-01",role:"admin"},
];

const UsersSection = () => {
  const { addToast } = useApp();
  const [users, setUsers] = useState(USERS_INIT);
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const visible = users.filter(u=>{
    const ms = userFilter==="all"||u.status===userFilter||u.role===userFilter;
    const mq = u.name.toLowerCase().includes(userSearch.toLowerCase())||u.email.toLowerCase().includes(userSearch.toLowerCase())||u.ref.toLowerCase().includes(userSearch.toLowerCase());
    return ms&&mq;
  });

  return <>
    {editUser&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(10px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setEditUser(null)}>
        <div style={{background:"#13103a",border:"1px solid rgba(167,139,250,.28)",borderRadius:18,width:"100%",maxWidth:500,padding:"32px 36px",boxShadow:"0 24px 80px rgba(0,0,0,.6)"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
            <h2 style={{fontWeight:800,fontSize:19,letterSpacing:"-.3px"}}>Edit User</h2>
            <button onClick={()=>setEditUser(null)} style={{width:34,height:34,borderRadius:9,background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.2)",color:"var(--t2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico n="x" s={16}/></button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Full Name</label><input className="fi" value={editUser.name} onChange={e=>setEditUser(p=>({...p,name:e.target.value}))}/></div>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Email</label><input className="fi" type="email" value={editUser.email} onChange={e=>setEditUser(p=>({...p,email:e.target.value}))}/></div>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Role</label>
              <select className="fi" value={editUser.role} onChange={e=>setEditUser(p=>({...p,role:e.target.value}))} style={{cursor:"pointer"}}>
                <option value="user">User</option><option value="admin">Admin</option>
              </select>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Status</label>
              <select className="fi" value={editUser.status} onChange={e=>setEditUser(p=>({...p,status:e.target.value}))} style={{cursor:"pointer"}}>
                <option value="active">Active</option><option value="banned">Banned</option><option value="suspended">Suspended</option>
              </select>
            </div>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Referral Code</label><input className="fi" value={editUser.ref} onChange={e=>setEditUser(p=>({...p,ref:e.target.value}))}/></div>
            <div><label style={{fontSize:12,fontWeight:600,color:"var(--t2)",display:"block",marginBottom:6}}>Total Rewards (₹)</label><input className="fi" type="number" value={editUser.rewards} onChange={e=>setEditUser(p=>({...p,rewards:Number(e.target.value)}))}/></div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
            <button className="btn bg_ bsm" style={{padding:"10px 22px"}} onClick={()=>setEditUser(null)}>Cancel</button>
            <button className="btn bp bsm" style={{padding:"10px 26px"}} onClick={()=>{setUsers(p=>p.map(u=>u.id===editUser.id?editUser:u));addToast(`${editUser.name} updated!`,"success");setEditUser(null);}}><Ico n="check" s={13} c="#fff"/> Save</button>
          </div>
        </div>
      </div>
    )}

    {deleteUser&&(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(8px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:"#13103a",border:"1px solid rgba(239,68,68,.3)",borderRadius:16,padding:"28px 32px",maxWidth:380,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}>
          <div style={{fontSize:44,marginBottom:14}}>⚠️</div>
          <h3 style={{fontWeight:800,fontSize:18,marginBottom:8}}>Delete {deleteUser.name}?</h3>
          <p style={{color:"var(--t3)",fontSize:13,lineHeight:1.6,marginBottom:22}}>This will permanently remove the user. This cannot be undone.</p>
          <div style={{display:"flex",gap:10,justifyContent:"center"}}>
            <button className="btn bg_ bsm" style={{padding:"10px 22px"}} onClick={()=>setDeleteUser(null)}>Cancel</button>
            <button style={{padding:"10px 22px",background:"var(--red)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer",fontSize:13}} onClick={()=>{setUsers(p=>p.filter(u=>u.id!==deleteUser.id));addToast(`${deleteUser.name} deleted`,"success");setDeleteUser(null);}}>Delete</button>
          </div>
        </div>
      </div>
    )}

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div><h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-.3px"}}>User Management</h2><p style={{fontSize:13,color:"var(--t3)",marginTop:2}}>{users.length} registered users</p></div>
      <button className="btn bp bsm" onClick={()=>{const nu={id:"u"+Date.now(),name:"New User",email:"newuser@nexcart.in",ref:"NX"+Math.random().toString(36).slice(2,8).toUpperCase(),rewards:0,status:"active",joined:new Date().toISOString().slice(0,10),role:"user"};setUsers(p=>[nu,...p]);setEditUser(nu);addToast("New user created","info");}}><Ico n="plus" s={13} c="#fff"/>Add User</button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
      {[[users.length,"Total Users","👥","var(--p1)"],[users.filter(u=>u.status==="active").length,"Active","✅","var(--grn)"],[users.filter(u=>u.status==="banned"||u.status==="suspended").length,"Restricted","🚫","var(--red)"],[users.filter(u=>u.role==="admin").length,"Admins","🛡️","var(--gold)"]].map(([v,l,ic,col])=>(
        <div key={l} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:13,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:12,right:14,fontSize:22,opacity:.3}}>{ic}</div>
          <div style={{fontSize:24,fontWeight:800,color:col,letterSpacing:"-.5px"}}>{v}</div>
          <div style={{fontSize:12,color:"var(--t3)",marginTop:4,fontWeight:600}}>{l}</div>
        </div>
      ))}
    </div>

    <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:9,padding:"8px 13px",flex:1,minWidth:200}}>
        <Ico n="search" s={13} c="var(--t3)"/>
        <input style={{background:"none",border:"none",outline:"none",color:"var(--t1)",fontSize:13,width:"100%"}} placeholder="Search by name, email or ref code…" value={userSearch} onChange={e=>setUserSearch(e.target.value)}/>
      </div>
      <div style={{display:"flex",gap:6}}>
        {["all","active","banned","admin"].map(f=>(
          <button key={f} onClick={()=>setUserFilter(f)} style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${userFilter===f?"var(--p1)":"rgba(167,139,250,.18)"}`,background:userFilter===f?"rgba(167,139,250,.16)":"var(--g1)",color:userFilter===f?"var(--p1)":"var(--t2)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s",textTransform:"capitalize"}}>{f}</button>
        ))}
      </div>
    </div>

    <div className="card" style={{overflow:"hidden"}}>
      <table className="tbl">
        <thead><tr><th>User</th><th>Email</th><th>Ref Code</th><th>Rewards</th><th>Role</th><th>Status</th><th style={{textAlign:"center"}}>Actions</th></tr></thead>
        <tbody>
          {visible.length===0
            ?<tr><td colSpan={7} style={{textAlign:"center",padding:"36px",color:"var(--t3)"}}>No users match your filter</td></tr>
            :visible.map(u=>(
              <tr key={u.id}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,var(--p1),var(--p2))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#fff",flexShrink:0}}>{u.name[0]}</div>
                    <div><div style={{fontWeight:600,fontSize:13}}>{u.name}</div><div style={{fontSize:11,color:"var(--t3)"}}>{u.joined}</div></div>
                  </div>
                </td>
                <td style={{color:"var(--t2)",fontSize:13}}>{u.email}</td>
                <td style={{fontFamily:"monospace",color:"var(--p1)",fontSize:12,fontWeight:600}}>{u.ref}</td>
                <td style={{color:"var(--grn)",fontWeight:700}}>{fmt(u.rewards)}</td>
                <td><span className={`bdg ${u.role==="admin"?"bgy":"bgb"}`}>{u.role==="admin"?"🛡️ ":"👤 "}{u.role}</span></td>
                <td>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 9px",borderRadius:100,fontSize:11,fontWeight:700,
                    background:u.status==="active"?"rgba(16,185,129,.12)":u.status==="banned"?"rgba(239,68,68,.12)":"rgba(245,158,11,.12)",
                    color:u.status==="active"?"var(--grn)":u.status==="banned"?"var(--red)":"var(--gold)",
                    border:`1px solid ${u.status==="active"?"rgba(16,185,129,.22)":u.status==="banned"?"rgba(239,68,68,.22)":"rgba(245,158,11,.22)"}`}}>
                    {u.status==="active"?"●":"■"} {u.status}
                  </span>
                </td>
                <td>
                  <div style={{display:"flex",gap:5,justifyContent:"center"}}>
                    <button className="btn bg_ bsm" style={{fontSize:11,padding:"5px 10px"}} onClick={()=>setEditUser({...u})}><Ico n="edit" s={11}/>Edit</button>
                    {u.status==="active"
                      ?<button style={{fontSize:11,padding:"5px 10px",background:"rgba(239,68,68,.08)",color:"var(--red)",border:"1px solid rgba(239,68,68,.2)",cursor:"pointer",borderRadius:8,fontWeight:600}} onClick={()=>{setUsers(p=>p.map(x=>x.id===u.id?{...x,status:"banned"}:x));addToast(`${u.name} banned`,"info");}}>Ban</button>
                      :<button style={{fontSize:11,padding:"5px 10px",background:"rgba(16,185,129,.08)",color:"var(--grn)",border:"1px solid rgba(16,185,129,.2)",cursor:"pointer",borderRadius:8,fontWeight:600}} onClick={()=>{setUsers(p=>p.map(x=>x.id===u.id?{...x,status:"active"}:x));addToast(`${u.name} unbanned`,"success");}}>Unban</button>
                    }
                    <button className="btn bdr bsm" style={{fontSize:11,padding:"5px 10px"}} onClick={()=>setDeleteUser(u)}><Ico n="trash" s={11}/></button>
                  </div>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN — CLICKS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const ClicksSection = () => {
  const { clicks, setClicks } = useApp();
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("All");

  const storeCounts = clicks.reduce((a,c)=>{a[c.store]=(a[c.store]||0)+1;return a;},{});
  const topStore = Object.entries(storeCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]||"—";
  const uniqueUsers = new Set(clicks.map(c=>c.userId)).size;
  const withRef = clicks.filter(c=>c.refCode).length;
  const convPct = clicks.length ? Math.round((withRef/clicks.length)*100) : 0;
  const storeOptions = ["All",...new Set(clicks.map(c=>c.store))];

  const visible = clicks.filter(c=>{
    const ms = storeFilter==="All"||c.store===storeFilter;
    const mq = c.store.toLowerCase().includes(search.toLowerCase())||c.userName.toLowerCase().includes(search.toLowerCase())||(c.refCode||"").toLowerCase().includes(search.toLowerCase());
    return ms&&mq;
  });

  return <>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div><h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-.3px"}}>Click Analytics</h2><p style={{fontSize:13,color:"var(--t3)",marginTop:2}}>Live affiliate link tracking — every Shop & Earn click</p></div>
      <button className="btn bdr bsm" onClick={()=>setClicks([])}><Ico n="trash" s={13}/>Clear Log</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
      {[[clicks.length,"Total Clicks","👆","var(--p1)"],[uniqueUsers,"Unique Users","👥","var(--t1)"],[convPct+"%","Ref Clicks","🔗","var(--grn)"],[topStore,"Top Store","🏆","var(--gold)"]].map(([v,l,ic,col])=>(
        <div key={l} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:13,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:12,right:14,fontSize:22,opacity:.3}}>{ic}</div>
          <div style={{fontSize:20,fontWeight:800,color:col,letterSpacing:"-.3px",wordBreak:"break-word"}}>{v}</div>
          <div style={{fontSize:12,color:"var(--t3)",marginTop:4,fontWeight:600}}>{l}</div>
        </div>
      ))}
    </div>
    {Object.keys(storeCounts).length>0&&(
      <div className="card" style={{padding:"18px 20px",marginBottom:18}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>Clicks by Store</div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {Object.entries(storeCounts).sort((a,b)=>b[1]-a[1]).map(([store,count])=>{
            const pct = Math.round((count/clicks.length)*100);
            return (
              <div key={store} style={{display:"grid",gridTemplateColumns:"120px 1fr 36px",alignItems:"center",gap:10}}>
                <span style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{store}</span>
                <div style={{background:"rgba(139,92,246,.1)",borderRadius:100,height:8,overflow:"hidden"}}>
                  <div style={{width:pct+"%",height:"100%",background:"linear-gradient(90deg,var(--p3),var(--p1))",borderRadius:100,transition:"width .6s ease"}}/>
                </div>
                <span style={{fontSize:12,color:"var(--t2)",textAlign:"right",fontWeight:600}}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}
    <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:9,padding:"8px 13px",flex:1,minWidth:180}}>
        <Ico n="search" s={13} c="var(--t3)"/>
        <input style={{background:"none",border:"none",outline:"none",color:"var(--t1)",fontSize:13,width:"100%"}} placeholder="Search by user, store, ref code…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <select value={storeFilter} onChange={e=>setStoreFilter(e.target.value)} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:9,padding:"8px 13px",color:"var(--t1)",fontSize:13,cursor:"pointer",outline:"none"}}>
        {storeOptions.map(s=><option key={s} value={s} style={{background:"#13103a"}}>{s}</option>)}
      </select>
    </div>
    <div className="card" style={{overflow:"hidden"}}>
      <div style={{padding:"12px 17px",borderBottom:"1px solid rgba(167,139,250,.12)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:14}}>Click Log</span>
        <span style={{fontSize:12,color:"var(--t3)"}}>{visible.length} entries</span>
      </div>
      {visible.length===0
        ?<div style={{textAlign:"center",padding:"40px",color:"var(--t3)"}}><div style={{fontSize:36,marginBottom:10}}>👆</div><div style={{fontWeight:600}}>No clicks yet</div><div style={{fontSize:13,marginTop:4}}>Clicks appear here when users hit "Shop & Earn"</div></div>
        :<table className="tbl">
          <thead><tr><th>User</th><th>Store</th><th>Timestamp</th><th>Via Referral</th><th>Action</th></tr></thead>
          <tbody>
            {visible.map(c=>(
              <tr key={c.id}>
                <td><div style={{fontWeight:600,fontSize:13}}>{c.userName}</div><div style={{fontSize:11,color:"var(--t3)",fontFamily:"monospace"}}>{c.userId}</div></td>
                <td><span style={{fontSize:16,marginRight:6}}>{c.emoji}</span><span style={{fontWeight:600}}>{c.store}</span></td>
                <td style={{color:"var(--t3)",fontSize:12}}>{c.ts}</td>
                <td>{c.refCode?<span style={{background:"rgba(16,185,129,.1)",color:"var(--grn)",border:"1px solid rgba(16,185,129,.22)",borderRadius:100,padding:"2px 9px",fontSize:11,fontWeight:700,fontFamily:"monospace"}}>🔗 {c.refCode}</span>:<span style={{color:"var(--t3)",fontSize:12}}>—</span>}</td>
                <td><button className="btn bdr bsm" style={{fontSize:11,padding:"4px 9px"}} onClick={()=>setClicks(p=>p.filter(x=>x.id!==c.id))}><Ico n="trash" s={11}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  </>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN — REFERRALS SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const ReferralsSection = () => {
  const { referrals, setReferrals } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const confirmed = referrals.filter(r=>r.status==="confirmed");
  const pending   = referrals.filter(r=>r.status==="pending");
  const totalPaid = confirmed.reduce((a,r)=>a+r.bonus*2,0);

  const topRefs = Object.entries(
    referrals.reduce((a,r)=>{
      if (!a[r.referrerCode]) a[r.referrerCode]={name:r.referrer,code:r.referrerCode,count:0,earned:0};
      a[r.referrerCode].count++;
      if (r.status==="confirmed") a[r.referrerCode].earned+=r.bonus;
      return a;
    },{})
  ).sort((a,b)=>b[1].count-a[1].count);

  const visible = referrals.filter(r=>{
    const ms = filter==="all"||r.status===filter;
    const mq = r.referrer.toLowerCase().includes(search.toLowerCase())||r.referred.toLowerCase().includes(search.toLowerCase())||r.referrerCode.toLowerCase().includes(search.toLowerCase())||r.referredEmail.toLowerCase().includes(search.toLowerCase());
    return ms&&mq;
  });

  return <>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div><h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-.3px"}}>Referral Tracking</h2><p style={{fontSize:13,color:"var(--t3)",marginTop:2}}>Track who referred whom and manage bonus payouts</p></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
      {[[referrals.length,"Total","👥","var(--p1)"],[confirmed.length,"Confirmed","✅","var(--grn)"],[pending.length,"Pending","⏳","var(--gold)"],[fmt(totalPaid),"Bonuses Paid","💰","var(--p3)"]].map(([v,l,ic,col])=>(
        <div key={l} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:13,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:12,right:14,fontSize:22,opacity:.3}}>{ic}</div>
          <div style={{fontSize:18,fontWeight:800,color:col,letterSpacing:"-.3px"}}>{v}</div>
          <div style={{fontSize:12,color:"var(--t3)",marginTop:4,fontWeight:600}}>{l}</div>
        </div>
      ))}
    </div>
    {topRefs.length>0&&(
      <div className="card" style={{padding:"18px 20px",marginBottom:18}}>
        <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>🏆 Top Referrers</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {topRefs.slice(0,5).map(([code,data],i)=>(
            <div key={code} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"rgba(139,92,246,.06)",borderRadius:10,border:"1px solid rgba(167,139,250,.12)"}}>
              <div style={{fontWeight:800,fontSize:16,color:i===0?"var(--gold)":i===1?"#c4b5fd":i===2?"#cd7f32":"var(--t3)",width:28,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13}}>{data.name}</div><div style={{fontFamily:"monospace",fontSize:11,color:"var(--p1)",marginTop:1}}>{data.code}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontWeight:700,fontSize:13}}>{data.count} referral{data.count!==1?"s":""}</div><div style={{fontSize:11,color:"var(--grn)",marginTop:1}}>{fmt(data.earned)} earned</div></div>
            </div>
          ))}
        </div>
      </div>
    )}
    <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:9,padding:"8px 13px",flex:1,minWidth:180}}>
        <Ico n="search" s={13} c="var(--t3)"/>
        <input style={{background:"none",border:"none",outline:"none",color:"var(--t1)",fontSize:13,width:"100%"}} placeholder="Search by name, email or ref code…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div style={{display:"flex",gap:6}}>
        {["all","pending","confirmed"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${filter===f?"var(--p1)":"rgba(167,139,250,.18)"}`,background:filter===f?"rgba(167,139,250,.16)":"var(--g1)",color:filter===f?"var(--p1)":"var(--t2)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s",textTransform:"capitalize"}}>{f}</button>
        ))}
      </div>
    </div>
    <div className="card" style={{overflow:"hidden"}}>
      <div style={{padding:"12px 17px",borderBottom:"1px solid rgba(167,139,250,.12)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:700,fontSize:14}}>Referral Log</span>
        <span style={{fontSize:12,color:"var(--t3)"}}>{visible.length} entries</span>
      </div>
      {visible.length===0
        ?<div style={{textAlign:"center",padding:"40px",color:"var(--t3)"}}><div style={{fontSize:36,marginBottom:10}}>👥</div><div style={{fontWeight:600}}>No referrals yet</div><div style={{fontSize:13,marginTop:4}}>Referrals appear when users sign up with a referral code</div></div>
        :<table className="tbl">
          <thead><tr><th>Referrer</th><th>Code</th><th>New User</th><th>Email</th><th>Date</th><th>Bonus</th><th>Status</th><th style={{textAlign:"center"}}>Actions</th></tr></thead>
          <tbody>
            {visible.map(r=>(
              <tr key={r.id}>
                <td style={{fontWeight:600}}>{r.referrer}</td>
                <td style={{fontFamily:"monospace",color:"var(--p1)",fontSize:12,fontWeight:700}}>{r.referrerCode}</td>
                <td style={{fontWeight:600}}>{r.referred}</td>
                <td style={{color:"var(--t3)",fontSize:12}}>{r.referredEmail}</td>
                <td style={{color:"var(--t3)",fontSize:12}}>{r.date}</td>
                <td style={{color:"var(--grn)",fontWeight:700}}>₹{r.bonus}+₹{r.bonus}</td>
                <td><span className={`bdg ${r.status==="confirmed"?"bgg":"bgy"}`} style={{textTransform:"capitalize"}}>{r.status==="confirmed"?"✅ ":"⏳ "}{r.status}</span></td>
                <td>
                  <div style={{display:"flex",gap:5,justifyContent:"center"}}>
                    {r.status==="pending"&&<button className="btn bsm" style={{background:"rgba(16,185,129,.1)",color:"var(--grn)",border:"1px solid rgba(16,185,129,.22)",fontSize:11,padding:"5px 10px"}} onClick={()=>setReferrals(p=>p.map(x=>x.id===r.id?{...x,status:"confirmed"}:x))}>Confirm</button>}
                    {r.status!=="pending"&&<button className="btn bsm" style={{background:"rgba(167,139,250,.1)",color:"var(--p1)",border:"1px solid rgba(167,139,250,.2)",fontSize:11,padding:"5px 10px"}} onClick={()=>setReferrals(p=>p.map(x=>x.id===r.id?{...x,status:"pending"}:x))}>Reset</button>}
                    <button className="btn bdr bsm" style={{fontSize:11,padding:"5px 10px"}} onClick={()=>setReferrals(p=>p.filter(x=>x.id!==r.id))}><Ico n="trash" s={11}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  </>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════════════════════
const AdminPage = ({ stores, setStores }) => {
  const [sec, setSec] = useState("stores");
  const [rewards, setRewards] = useState(REWARDS_INIT);
  const [modal, setModal] = useState(null); // null | "add" | store-object
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQ, setSearchQ] = useState("");
  const { addToast } = useApp();

  const sideItems = [
    {id:"stores",    label:"Stores",    icon:"store"},
    {id:"clicks",    label:"Clicks",    icon:"eye"},
    {id:"referrals", label:"Referrals", icon:"gift"},
    {id:"rewards",   label:"Rewards",   icon:"check"},
    {id:"users",     label:"Users",     icon:"users"},
    {id:"settings",  label:"Settings",  icon:"settings"},
  ];

  const saveStore = (form) => {
    if (modal === "add") {
      const newStore = {...form, id: String(Date.now())};
      setStores(p=>[...p, newStore]);
      addToast(`${form.name} added successfully! 🎉`,"success");
    } else {
      setStores(p=>p.map(s=>s.id===form.id?form:s));
      addToast(`${form.name} updated!`,"success");
    }
    setModal(null);
  };

  const filteredStores = stores.filter(s=>s.name.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <>
      {/* Modal */}
      {modal && <StoreModal store={modal==="add"?null:modal} onClose={()=>setModal(null)} onSave={saveStore}/>}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",backdropFilter:"blur(8px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"#13103a",border:"1px solid rgba(239,68,68,.3)",borderRadius:16,padding:"28px 32px",maxWidth:380,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,.5)"}}>
            <div style={{fontSize:44,marginBottom:14}}>🗑️</div>
            <h3 style={{fontWeight:800,fontSize:18,marginBottom:8}}>Delete {deleteConfirm.name}?</h3>
            <p style={{color:"var(--t3)",fontSize:13,lineHeight:1.6,marginBottom:22}}>This action cannot be undone. The store will be permanently removed from the platform.</p>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <button className="btn bg_ bsm" style={{padding:"10px 22px"}} onClick={()=>setDeleteConfirm(null)}>Cancel</button>
              <button className="btn bsm" style={{padding:"10px 22px",background:"var(--red)",color:"#fff",border:"none",borderRadius:8,fontWeight:600,cursor:"pointer"}} onClick={()=>{setStores(p=>p.filter(x=>x.id!==deleteConfirm.id));addToast(`${deleteConfirm.name} deleted`,"success");setDeleteConfirm(null);}}>Delete</button>
            </div>
          </div>
        </div>
      )}

    <div className="adl" style={{position:"relative"}}>
      <aside className="ads" style={{position:"relative"}}>
        <div style={{padding:"16px 18px 18px",borderBottom:"1px solid rgba(167,139,250,.12)",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:4}}>
            <div style={{width:28,height:28,background:"linear-gradient(135deg,var(--p1),var(--p2))",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 7h16l-1.5 9H5.5L4 7z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/><circle cx="9" cy="20" r="1.5" fill="#fff"/><circle cx="16" cy="20" r="1.5" fill="#fff"/></svg>
            </div>
            <span style={{fontWeight:800,color:"var(--t1)",fontSize:14}}>Nexcart</span>
          </div>
          <div style={{fontSize:11,color:"var(--t3)"}}>Admin Dashboard</div>
        </div>
        {sideItems.map(s=>(
          <button key={s.id} className={`anb${sec===s.id?" act":""}`} onClick={()=>setSec(s.id)}>
            <Ico n={s.icon} s={14}/>{s.label}
          </button>
        ))}
        <div style={{padding:"14px 18px",borderTop:"1px solid rgba(167,139,250,.12)",marginTop:16}}>
          <div style={{fontSize:11,color:"var(--t3)"}}>Nexcart v2.0 · Admin</div>
        </div>
      </aside>

      <main className="adm">
        {/* STORES */}
        {sec==="stores"&&<>
          {/* Top bar */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,flexWrap:"wrap",gap:12}}>
            <div>
              <h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-.3px"}}>Manage Stores</h2>
              <p style={{fontSize:13,color:"var(--t3)",marginTop:2}}>{stores.length} partner stores total</p>
            </div>
            <div style={{display:"flex",gap:9,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:9,padding:"8px 13px"}}>
                <Ico n="search" s={13} c="var(--t3)"/>
                <input style={{background:"none",border:"none",outline:"none",color:"var(--t1)",fontSize:13,width:150}} placeholder="Search stores…" value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
              </div>
              <button className="btn bp bsm" onClick={()=>setModal("add")} style={{whiteSpace:"nowrap"}}><Ico n="plus" s={13} c="#fff"/>Add Store</button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[
              {v:stores.length,l:"Total Stores",ic:"🏪",col:"var(--p1)"},
              {v:stores.filter(s=>s.featured).length,l:"Featured",ic:"⭐",col:"var(--gold)"},
              {v:stores.filter(s=>s.active).length,l:"Active",ic:"✅",col:"var(--grn)"},
              {v:new Set(stores.map(s=>s.category)).size,l:"Categories",ic:"🏷️",col:"var(--t1)"},
            ].map(s=>(
              <div key={s.l} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:13,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:12,right:14,fontSize:22,opacity:.35}}>{s.ic}</div>
                <div style={{fontSize:24,fontWeight:800,color:s.col,letterSpacing:"-.5px"}}>{s.v}</div>
                <div style={{fontSize:12,color:"var(--t3)",marginTop:4,fontWeight:600}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Store cards grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:13}}>
            {filteredStores.map(s=>(
              <div key={s.id} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:14,padding:"18px",position:"relative",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(167,139,250,.35)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--b1)";e.currentTarget.style.transform="none";}}>
                {/* Status badge */}
                <div style={{position:"absolute",top:12,right:12,display:"flex",gap:5}}>
                  {s.featured&&<span style={{background:"rgba(245,158,11,.15)",color:"var(--gold)",border:"1px solid rgba(245,158,11,.25)",borderRadius:100,padding:"2px 7px",fontSize:10,fontWeight:700}}>Featured</span>}
                  <span style={{background:s.active?"rgba(16,185,129,.12)":"rgba(239,68,68,.1)",color:s.active?"var(--grn)":"var(--red)",border:`1px solid ${s.active?"rgba(16,185,129,.22)":"rgba(239,68,68,.2)"}`,borderRadius:100,padding:"2px 7px",fontSize:10,fontWeight:700}}>{s.active?"Active":"Off"}</span>
                </div>
                {/* Store info */}
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:13}}>
                  <div style={{width:46,height:46,background:"rgba(139,92,246,.15)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:23,flexShrink:0}}>{s.emoji}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:15,lineHeight:1.2}}>{s.name}</div>
                    <div style={{fontSize:11,color:"var(--t3)",marginTop:2,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>{s.category}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,paddingBottom:13,borderBottom:"1px solid rgba(167,139,250,.1)"}}>
                  <span style={{fontSize:13,color:"var(--t2)"}}>Reward Rate</span>
                  <span style={{background:"rgba(16,185,129,.1)",color:"var(--grn)",border:"1px solid rgba(16,185,129,.2)",borderRadius:7,padding:"3px 10px",fontSize:12,fontWeight:800}}>💰 {s.reward}%</span>
                </div>
                {/* Action buttons */}
                <div style={{display:"flex",gap:8}}>
                  <button className="btn bg_ bsm" style={{flex:1,justifyContent:"center",fontSize:12}} onClick={()=>setModal(s)}>
                    <Ico n="edit" s={12}/>Edit
                  </button>
                  <button className="btn bdr bsm" style={{justifyContent:"center",padding:"7px 13px"}} onClick={()=>setDeleteConfirm(s)}>
                    <Ico n="trash" s={12}/>
                  </button>
                </div>
              </div>
            ))}
            {/* Empty state */}
            {filteredStores.length===0&&(
              <div style={{gridColumn:"1/-1",textAlign:"center",padding:"48px 24px",color:"var(--t3)"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                <div style={{fontWeight:600,fontSize:16,marginBottom:6}}>No stores found</div>
                <div style={{fontSize:13}}>Try a different search term</div>
              </div>
            )}
          </div>
        </>}

        {sec==="clicks"&&<ClicksSection/>}
        {sec==="referrals"&&<ReferralsSection/>}

        {sec==="rewards"&&<RewardsSection rewards={rewards} setRewards={setRewards}/>}
        {sec==="users"&&<UsersSection/>}

        {sec==="settings"&&<>
          <h2 style={{fontWeight:800,fontSize:19,letterSpacing:"-.3px",marginBottom:20}}>Platform Settings</h2>
          <div style={{display:"flex",flexDirection:"column",gap:13,maxWidth:500}}>
            {[["Platform Name","Nexcart","text"],["Default Reward Rate (%)","5","number"],["Min Withdrawal (₹)","500","number"],["Referral Bonus (₹)","50","number"],["Referee Bonus (₹)","50","number"],["Return Window (days)","30","number"]].map(([l,v,t])=>(
              <div key={l}><label className="fl">{l}</label><input className="fi" defaultValue={v} type={t}/></div>
            ))}
            <button className="btn bp" style={{padding:"12px"}} onClick={()=>addToast("Settings saved!","success")}>Save Settings</button>
          </div>
        </>}
      </main>
    </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [stores, setStores] = useState(STORES.map(s=>({...s, active:true, affiliate_url:"https://"+s.name.toLowerCase().replace(/\s/g,"")+".com", logo_url:"", description:""})));
  const [clicks, setClicks] = useState(INIT_CLICKS);
  const [referrals, setReferrals] = useState(INIT_REFERRALS);

  const addToast = useCallback((msg, type="info") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, {id,msg,type}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  const removeToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  const recordClick = useCallback((store, currentUser) => {
    const now = new Date();
    const ts = now.toISOString().slice(0,10) + " " + now.toTimeString().slice(0,5);
    setClicks(p => [{
      id: "c"+Date.now(),
      userId: currentUser ? "u_"+currentUser.name.split(" ")[0].toLowerCase() : "u_guest",
      userName: currentUser ? currentUser.name : "Guest",
      store: store.name,
      emoji: store.emoji,
      ts,
      refCode: currentUser?.referral_code || null,
    }, ...p]);
  }, []);

  const recordReferral = useCallback((referrerCode, newUser) => {
    if (!referrerCode) return;
    setReferrals(p => [{
      id: "rf"+Date.now(),
      referrer: "User",
      referrerCode,
      referred: newUser.name,
      referredEmail: newUser.email,
      status: "pending",
      bonus: 50,
      date: new Date().toISOString().slice(0,10),
    }, ...p]);
  }, []);

  const go = useCallback((p) => {
    setPage(p);
    window.scrollTo({top:0,behavior:"smooth"});
  }, []);

  const guardGo = useCallback((p) => {
    if (p==="dashboard" && !user) { go("auth"); addToast("Please sign in first","info"); return; }
    go(p);
  }, [go, user, addToast]);

  const login  = useCallback((u) => setUser(u), []);
  const logout = useCallback(() => { setUser(null); go("home"); addToast("Signed out","info"); }, [go, addToast]);

  return (
    <AppCtx.Provider value={{ addToast, clicks, setClicks, referrals, setReferrals, recordClick, recordReferral }}>
      <style>{CSS}</style>
      <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
        <Navbar page={page} go={guardGo} user={user} logout={logout}/>
        <main style={{flex:1}}>
          {page==="home"        && <LandingPage go={guardGo}/>}
          {page==="stores"      && <StoresPage user={user} go={guardGo} stores={stores}/>}
          {page==="auth"        && <AuthPage go={go} login={login}/>}
          {page==="leaderboard" && <LeaderboardPage/>}
          {page==="dashboard" && user  && <DashboardPage user={user}/>}
          {page==="dashboard" && !user && (
            <div style={{textAlign:"center",padding:"110px 24px"}}>
              <div style={{fontSize:50,marginBottom:16}}>🔒</div>
              <h2 style={{fontWeight:800,fontSize:23,marginBottom:10}}>Sign In Required</h2>
              <p style={{color:"var(--t2)",marginBottom:24}}>Please sign in to view your dashboard</p>
              <button className="btn bp blg" onClick={()=>go("auth")}>Sign In <Ico n="arrow" s={15} c="#fff"/></button>
            </div>
          )}
          {page==="admin" && user?.isAdmin  && <AdminPage stores={stores} setStores={setStores}/>}
          {page==="admin" && !user?.isAdmin && (
            <div style={{textAlign:"center",padding:"110px 24px"}}>
              <div style={{fontSize:50,marginBottom:16}}>⛔</div>
              <h2 style={{fontWeight:800,fontSize:23,marginBottom:10}}>Admin Access Only</h2>
              <p style={{color:"var(--t2)"}}>Sign in with an admin account to continue</p>
            </div>
          )}
        </main>
        {page!=="auth" && <Footer go={go}/>}
        <Toast toasts={toasts} remove={removeToast}/>
      </div>
    </AppCtx.Provider>
  );
}
