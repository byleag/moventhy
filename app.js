/* MOVENTHY — application (prototype privé, données stockées uniquement sur l'appareil) */
"use strict";
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY = "moventhy.v1", VERSION = "0.2.0";
let S;
const fresh = () => ({v:1, adult:false, onboarded:false, discovery:false, account:null, loggedIn:false, profile:null, plan:null, sessions:[], log:[], favs:[], myEvents:[], simOffset:0, lastMsgs:[],
 settings:{scale:1, theme:"dark", hc:false, motion:true, voice:true, vibrate:true, sound:true}});
function load(){ try { S = JSON.parse(localStorage.getItem(KEY)); } catch(e){ S = null; }
 if (!S || S.v!==1) S = fresh(); S.settings = Object.assign(fresh().settings, S.settings||{});
 if (S.loggedIn===undefined) S.loggedIn = !!S.onboarded; }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
const T = () => todayOf(S);
const clone = o => JSON.parse(JSON.stringify(o));

/* ================= ICÔNES ================= */
const IC = {
 home:"M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z",
 plan:"M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3 10h18M8 3v4M16 3v4",
 explore:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z",
 progress:"M5 20V12M10 20V5M15 20v-9M20 20v-5M3 20h19",
 profile:"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
 play:"M7 4.5v15l12-7.5z", pause:"M8 5v14M16 5v14", next:"M6 5l9 7-9 7zM18 5v14", prev:"M18 5l-9 7 9 7zM6 5v14",
 x:"M6 6l12 12M18 6L6 18", back:"M15 5l-7 7 7 7", chev:"M9 5l7 7-7 7", check:"M5 12.5l4.5 4.5L19 7.5",
 clock:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2", pin:"M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
 dumb:"M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11", bars:"M5 20v-6M12 20V9M19 20V4",
 walk:"M13 5a1.6 1.6 0 1 0 0-.1M10 21l1.6-6.5L9 12l1.5-4 3 1 2 3.5M11.6 14.5 14 17v4M10.5 8 8 10.5V13",
 run:"M15 4.5a1.6 1.6 0 1 0 0-.1M5 20l4.5-4.5 2.5 1.5 1.5-4.5-3.5-2-3 2.5M12.5 12.5l3.5.5 2.5 3",
 flex:"M12 5.5a1.7 1.7 0 1 0 0-.1M4 18c3.5-.5 5.5-1.5 8-4.5 2.5 3 4.5 4 8 4.5M12 9v4.5M7 11l5-2 5 2",
 bolt:"M13 3 5 14h6l-1 7 8-11h-6z", pulse:"M3 12h4l2-5 4 10 2-5h6", flag:"M5 21V4M5 4h11l-2 4 2 4H5",
 shield:"M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z", info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.5",
 plus:"M12 5v14M5 12h14", minus:"M5 12h14", search:"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
 star:"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
 trash:"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13", download:"M12 4v11M7 10l5 5 5-5M5 20h14",
 phone:"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z",
 swap:"M4 8h14l-3-3M20 16H6l3 3", move:"M8 3v4M16 3v4M4 9h16M12 13v6M9 16h6", moon:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
 list:"M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01", ext:"M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
 lock:"M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4", heart:"M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
 filter:"M4 5h16l-6 8v6l-4-2v-4z", pause2:"M10 4H6v16h4zM18 4h-4v16h4z"
};
const ic = (n, cls="") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const typeIcon = t => ({marche:"walk", course:"run", renfo:"dumb", mobilite:"flex", hybride:"bolt", cardio:"pulse"}[t] || "bolt");
const MARK = `<img class="mk" src="icons/icon-192.png" alt="" width="46" height="46">`;
const logoImg = dark => `<img class="logo" src="icons/logo-${dark ? "dark" : "light"}.png" alt="MOVENTHY" width="1465" height="255">`;
const isLight = () => document.documentElement.classList.contains("light");
/* ================= OUTILS D'AFFICHAGE ================= */
let toastT;
function toast(t){ const e = $("toast"); e.textContent = t; e.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove("on"), 2600); }
const pad2 = n => String(n).padStart(2,"0");
const clockStr = s => { s = Math.max(0, Math.ceil(s)); return `${Math.floor(s/60)}:${pad2(s%60)}`; };
const durStr = s => { const m = Math.floor(s/60), r = s%60; return m && r ? `${m} min ${pad2(r)}` : m ? `${m} min` : `${r} s`; };
const levelText = s => `Palier ${s.stage}/10 · ${LVL_T[stageLvl(s.stage)]}`;
const equipText = s => s.equipUsed && s.equipUsed.length ? s.equipUsed.map(e => EQUIP[e]).join(", ") : "Sans matériel";
const plural = (n, w) => `${n} ${w}${n>1 ? "s" : ""}`;
function goalText(p){
 const i = INTENTS.find(x => x.id===p.intent), i2 = INTENTS.find(x => x.id===p.intent2);
 return (i ? i.t : "Bouger") + (i2 ? ` + ${i2.t.toLowerCase()}` : "");
}
function horizonText(p){
 const h = p.horizon || {type:"none"}, t = T();
 if (h.type==="duration") return `${h.weeks} semaines indicatives`;
 if (h.type==="date" || h.type==="event"){
  const d = diffD(t, h.date), name = h.type==="event" ? h.name : (h.name || `Objectif ${DISC[h.sport] ? DISC[h.sport].t.toLowerCase() : ""}${h.dist ? " "+h.dist+" km" : ""}`);
  const when = d > 0 ? `dans ${d >= 14 ? plural(Math.floor(d/7),"semaine") : plural(d,"jour")}` : d===0 ? "aujourd'hui" : "passé";
  return `${name} · ${fmtLong(h.date)} (${when})${h.mode==="decouverte" ? " · en mode découverte" : ""}`;
 }
 return "Sans date de fin · cycles de 4 semaines";
}
function allEvents(){
 const t = T();
 return DEMO_EVENTS.map(e => Object.assign({demo:true, date: e.off==null ? null : addD(t, e.off)}, e))
  .concat((S.myEvents||[]).map(e => Object.assign({mine:true}, e)));
}
const evById = id => allEvents().find(e => e.id===id);
function statusPill(s){
 if (s.status==="planned") return s.mod ? `<span class="pill acc">Modifiée</span>` : "";
 const cls = s.status==="done" ? "acc" : s.status==="partial" ? "warn" : "";
 return `<span class="pill ${cls}">${STATUS[s.status]}</span>`;
}

/* ================= RÉGLAGES ================= */
const SCALES = [0.9, 1, 1.12, 1.25, 1.4, 1.6];
function applySettings(){
 const s = S.settings, h = document.documentElement;
 const dark = s.theme==="dark" || (s.theme==="auto" && matchMedia("(prefers-color-scheme: dark)").matches);
 h.classList.toggle("light", !dark); h.classList.toggle("hc", !!s.hc);
 h.classList.toggle("nomotion", !s.motion || matchMedia("(prefers-reduced-motion: reduce)").matches);
 h.style.setProperty("--scale", s.scale);
 document.querySelectorAll('meta[name="theme-color"]').forEach(m => { m.setAttribute("content", dark ? "#090E11" : "#EFEDEA"); m.removeAttribute("media"); });
}

/* ================= NAVIGATION ================= */
let TAB = "today"; let OV = []; let lastOvRef = null;
const TABS = [["today","Accueil","home"],["plan","Plan","plan"],["explore","Explorer","explore"],["progress","Progrès","progress"],["profile","Profil","profile"]];
const OVC = {welcome:"splash", player:"pl", ready:"ready"};
function renderTabs(){ $("tabs").innerHTML = `<div>${TABS.map(([id,l,i]) => `<button data-a="tab" data-v="${id}" ${TAB===id ? 'aria-current="page"' : ""}>${ic(i)}<span>${l}</span></button>`).join("")}</div>`; }
function render(){
 applySettings();
 if (!S.loggedIn && !S.discovery && !OV.length) OV.push({k:"welcome"});
 renderTabs();
 const V = {today:vToday, plan:vPlan, explore:vExplore, progress:vProgress, profile:vProfile}[TAB];
 $("view").innerHTML = V();
 renderOv();
}
function renderOv(){
 const o = OV[OV.length-1], el = $("ov");
 if (!o){ el.hidden = true; el.innerHTML = ""; el.className = "ov"; document.body.style.overflow = ""; lastOvRef = null; return; }
 const keep = o===lastOvRef ? el.scrollTop : 0;
 el.hidden = false; document.body.style.overflow = "hidden";
 el.className = "ov " + (OVC[o.k] || "");
 el.innerHTML = o.k==="ready" ? OVK.ready(o) : `<div class="inner">${OVK[o.k](o)}</div>`;
 el.scrollTop = keep;
 if (o!==lastOvRef){ const h = el.querySelector("h1,h2,[data-focus]"); if (h){ h.setAttribute("tabindex","-1"); h.focus({preventScroll:true}); } }
 lastOvRef = o;
 if (OVA[o.k]) OVA[o.k](o);
}
function pushOv(k, extra){ OV.push(Object.assign({k}, extra||{})); renderOv(); }
function popOv(){ stopAnim(); OV.pop(); render(); }
function openSheet(html){ $("sheet").innerHTML = `<div class="grab" aria-hidden="true"></div>${html}`; $("sheetWrap").hidden = false; const h = $("sheet").querySelector("h2,h3"); if (h){ h.setAttribute("tabindex","-1"); h.focus(); } }
function closeSheet(){ $("sheetWrap").hidden = true; $("sheet").innerHTML = ""; }
const backBtn = (a, label) => `<button class="ib" data-a="${a||"back"}" aria-label="${label||"Retour"}">${ic("back")}</button>`;

/* ================= ACCUEIL (SPLASH) / ONBOARDING ================= */
const OVK = {}, OVA = {};
OVK.welcome = () => `
 <div class="mid">
  ${logoImg(true)}
  <p class="tl">Move. Grow. Evolve.</p>
  <p class="tl2">Le sport qui s'adapte à ta vie, et non l'inverse.</p>
 </div>
 <button class="btn" data-a="signup">Créer un compte</button>
 <button class="btn ghost" data-a="login">J'ai déjà un compte</button>
 <button class="link" style="align-self:center;color:#8C9C9A;margin-top:6px" data-a="discoverAsk">Explorer sans compte</button>
 <p class="fine">Réservé aux 18 ans et plus · ne remplace pas un avis médical.</p>`;

/* ================= COMPTE ================= */
let SU = null, PRESET = null;
const newSU = () => ({first:"", last:"", email:"", pw:"", birth:"", cgu:false, news:false, show:false, err:{}});
const ageOf = b => { const d = pd(b), t = pd(T()); let a = t.getFullYear()-d.getFullYear(); if (t.getMonth()<d.getMonth() || (t.getMonth()===d.getMonth() && t.getDate()<d.getDate())) a--; return a; };
async function hashPw(pw, email){
 const txt = "moventhy|" + email.toLowerCase() + "|" + pw;
 try { const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt)); return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,"0")).join(""); }
 catch(e){ let h = 5381; for (const c of txt) h = ((h<<5)+h+c.charCodeAt(0))|0; return "f" + (h>>>0).toString(16); }
}
const fld = (k, label, type, extra) => `<label class="field"><span>${label}</span><input class="input" id="su_${k}" type="${type}" data-in="su:${k}" value="${esc(SU[k])}" ${extra||""} ${SU.err[k] ? `aria-invalid="true" aria-describedby="er_${k}"` : ""}>${SU.err[k] ? `<span class="xs" id="er_${k}" style="color:var(--danger);display:block;margin-top:6px">${esc(SU.err[k])}</span>` : ""}</label>`;
const ckb = (k, html) => `<button class="toggle" role="checkbox" aria-checked="${SU[k]}" data-a="suT" data-k="${k}" style="align-items:flex-start"><span class="cb" style="flex:none;width:28px;height:28px;border-radius:9px;background:${SU[k] ? "var(--acc)" : "transparent"};border:1.5px solid ${SU[k] ? "var(--acc)" : "var(--sub)"};display:grid;place-items:center;color:var(--acc-tx)">${SU[k] ? ic("check","s") : ""}</span><span class="t small">${html}</span></button>`;
OVK.signup = () => `<div class="ovh">${backBtn("suBack")}</div>
 <p class="eyebrow">Inscription</p><h1>Crée ton compte</h1>
 <div class="row" style="gap:10px"><div style="flex:1">${fld("first","Prénom","text",'autocomplete="given-name" maxlength="30"')}</div><div style="flex:1">${fld("last","Nom","text",'autocomplete="family-name" maxlength="40"')}</div></div>
 ${fld("email","E-mail","email",'autocomplete="email" inputmode="email" maxlength="80"')}
 <label class="field"><span>Mot de passe</span><div style="position:relative"><input class="input" id="su_pw" type="${SU.show ? "text" : "password"}" data-in="su:pw" value="${esc(SU.pw)}" autocomplete="new-password" minlength="8" style="padding-right:110px" ${SU.err.pw ? 'aria-invalid="true" aria-describedby="er_pw"' : 'aria-describedby="hint_pw"'}><button class="link" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);padding:0" data-a="suShow">${SU.show ? "Masquer" : "Afficher"}</button></div>
  ${SU.err.pw ? `<span class="xs" id="er_pw" style="color:var(--danger);display:block;margin-top:6px">${esc(SU.err.pw)}</span>` : `<span class="xs sub" id="hint_pw" style="display:block;margin-top:6px">8 caractères minimum, dont un chiffre</span>`}</label>
 ${fld("birth","Date de naissance","date",`max="${T()}"`)}
 <div class="card flat" style="margin-top:8px">
  ${ckb("cgu", `J'accepte les <button class="link" style="padding:0;color:inherit" data-a="cgu">conditions d'utilisation</button> et j'ai lu la <button class="link" style="padding:0;color:inherit" data-a="privacy">politique de confidentialité</button>`)}
  ${ckb("news", "Je veux recevoir les nouveautés MOVENTHY par e-mail <span class='sub'>(facultatif)</span>")}
 </div>
 ${SU.err.cgu ? `<p class="xs" style="color:var(--danger);margin-top:8px">${esc(SU.err.cgu)}</p>` : ""}
 <p class="xs sub mt">Version de test : ton compte est créé sur ce téléphone uniquement, sans serveur. Ton mot de passe n'est jamais enregistré en clair. L'abonnement MOVENTHY Plus sera proposé plus tard.</p>
 <div class="foot"><button class="btn" data-a="suOk">Créer mon compte</button><button class="link" style="display:block;margin:8px auto 0" data-a="login">J'ai déjà un compte</button></div>`;
OVK.login = o => `<div class="ovh">${backBtn("suBack")}</div>
 <p class="eyebrow">Connexion</p><h1>Content·e de te revoir</h1>
 ${fld("email","E-mail","email",'autocomplete="email" inputmode="email"')}
 <label class="field"><span>Mot de passe</span><input class="input" id="su_pw" type="password" data-in="su:pw" value="${esc(SU.pw)}" autocomplete="current-password"></label>
 ${SU.err.login ? `<div class="note warn">${ic("info")}<div>${esc(SU.err.login)}</div></div>` : ""}
 <button class="link" data-a="forgot">Mot de passe oublié ?</button>
 <div class="foot"><button class="btn" data-a="loginOk">Se connecter</button><button class="link" style="display:block;margin:8px auto 0" data-a="signup">Créer un compte</button></div>`;

let ONB = null;
const newDraft = () => ({name:"", intent:null, intent2:null, disc:[], level:null, recent:[], ease:3, days:[], minutes:20, places:[],
 equip:{maison:[], exterieur:[], salle:GYM_DEFAULT.slice()}, dayPlace:{}, perDay:false, prefs:{noImpact:false, noFloor:false}, horizon:{type:"none"}});
function startOnb(step, edit, preset){
 ONB = {step: step||1, from: step||1, edit: !!edit, d: edit ? clone(S.profile) : Object.assign(newDraft(), preset||{})};
 ONB.d.equip = Object.assign({maison:[], exterieur:[], salle:GYM_DEFAULT.slice()}, ONB.d.equip||{});
 ONB.d.prefs = Object.assign({noImpact:false, noFloor:false}, ONB.d.prefs||{});
 ONB.d.dayPlace = ONB.d.dayPlace || {};
 OV = OV.filter(o => o.k!=="welcome" && o.k!=="onb"); pushOv("onb");
}
const getP = (o, path) => path.split(".").reduce((a,k) => a==null ? a : a[k], o);
const setP = (o, path, v) => { const ks = path.split("."), last = ks.pop(); const t = ks.reduce((a,k) => (a[k] = a[k]==null ? {} : a[k]), o); t[last] = v; };
function chip(path, v, label, mode, extra){
 const cur = getP(ONB.d, path);
 const on = mode==="multi" ? (cur||[]).includes(v) : mode==="toggle" ? !!cur : String(cur ?? "")===String(v);
 return `<button class="chip ${extra||""}" aria-pressed="${on}" data-a="d" data-f="${path}" data-v="${esc(v)}" data-m="${mode}">${label}</button>`;
}
function opt(path, v, title, sub){
 const on = String(getP(ONB.d, path))===String(v);
 return `<button class="opt" role="radio" aria-checked="${on}" data-a="d" data-f="${path}" data-v="${esc(v)}" data-m="single"><span><b>${title}</b>${sub ? `<span class="s">${sub}</span>` : ""}</span><span class="ck">${on ? ic("check","s") : ""}</span></button>`;
}
function tog(path, label, sub){
 const on = !!getP(ONB.d, path);
 return `<button class="toggle" role="switch" aria-checked="${on}" data-a="d" data-f="${path}" data-v="1" data-m="toggle"><span class="t"><b>${label}</b>${sub ? `<br><span>${sub}</span>` : ""}</span><span class="sw"></span></button>`;
}
function onbValid(){
 const d = ONB.d;
 switch (ONB.step){
  case 1: return !!d.intent && d.disc.length > 0;
  case 2: return !!d.level && d.days.length > 0 && !!d.minutes;
  case 3: return d.places.length > 0;
  case 4: { const h = d.horizon; if (h.type==="none") return true; if (h.type==="duration") return !!h.weeks;
   if (h.type==="date") return !!h.date && h.date >= T() && !!h.sport; if (h.type==="event") return !!h.id && !!h.date; return false; }
  default: return true;
 }
}
OVK.onb = () => {
 const st = ONB.step, d = ONB.d;
 const titles = ["","Qu'est-ce qui te motive ?","Où en es-tu ?","Où tu bouges","Ton horizon","Ton programme"];
 let body = "";
 if (st===1){
  body = `<p class="sub" style="margin:-8px 0 18px">${S.account ? esc(S.account.first) + ", c" : "C"}hoisis ton objectif principal. Tu pourras en changer.</p>
  ${INTENTS.map(i => opt("intent", i.id, i.t, i.s)).join("")}
  <h2>Ce qui t'attire</h2>
  <div class="chips">${DISC_ORDER.map(k => chip("disc", k, `${ic(typeIcon(k),"s")} ${DISC[k].t}`, "multi")).join("")}</div>
  ${d.disc.length > 1 ? `<p class="small sub mt">Priorité : ${DISC[d.disc[0]].t.toLowerCase()}</p>` : ""}
  ${d.intent ? `<h2>Et aussi… <span class="sub small">(facultatif)</span></h2><div class="chips">${INTENTS.filter(i => i.id!==d.intent).map(i => chip("intent2", i.id, i.t, "single2","sm")).join("")}</div>` : ""}`;
 }
 if (st===2){
  body = `${LEVELS.map(l => opt("level", l.id, l.t, l.s)).join("")}
  <h2>Tes jours</h2>
  <div class="chips">${DOWS.map((l,i) => chip("days", i, l, "multi")).join("")}</div>
  <h2>Temps par séance</h2>
  <div class="chips">${DURATIONS.map(m => chip("minutes", m, `${m} min`, "single")).join("")}</div>
  <h2>Ton aisance</h2>
  <div class="chips">${[[1,"Faible"],[2,"Moyenne-"],[3,"Moyenne"],[4,"Bonne"],[5,"Très bonne"]].map(([v,l]) => chip("ease", v, l, "single","sm")).join("")}</div>
  <h2>Préférences <span class="sub small">(facultatif)</span></h2>
  <div class="card flat">${tog("prefs.noImpact","Sans sauts ni course","Marche et exercices doux à la place")}${tog("prefs.noFloor","Sans passage au sol","Tout debout ou sur une chaise")}</div>
  <p class="xs sub mt">Aucun questionnaire médical. En cas de doute sur ta santé, demande l'avis d'un professionnel.</p>`;
 }
 if (st===3){
  const eqBlock = (pl, list) => d.places.includes(pl) ? `<h2>Matériel · ${PLACES[pl].toLowerCase()}</h2><div class="chips">${pl==="maison" ? `<button class="chip sm" aria-pressed="${!d.equip.maison.length}" data-a="noEquip">Aucun</button>` : ""}${list.map(e => chip("equip."+pl, e, EQUIP[e], "multi","sm")).join("")}</div>` : "";
  body = `<div class="chips">${Object.entries(PLACES).map(([k,l]) => chip("places", k, l, "multi")).join("")}</div>
  ${eqBlock("maison", EQUIP_HOME)}${eqBlock("exterieur", EQUIP_OUT)}${eqBlock("salle", GYM_DEFAULT)}
  ${d.places.length > 1 && d.days.length ? `<div class="card flat mt" style="margin-top:24px">${tog("perDay","Un lieu différent selon le jour")}</div>
   ${d.perDay ? [...d.days].sort().map(i => `<div class="row wrap mt"><b style="width:44px">${DOWS[i]}</b>${chip("dayPlace."+i, "", "Auto", "single","sm")}${d.places.map(pl => chip("dayPlace."+i, pl, PLACES[pl], "single","sm")).join("")}</div>`).join("") : ""}` : ""}`;
 }
 if (st===4){
  const h = d.horizon;
  body = `${opt("horizon.type","none","Sans date","On avance par cycles, sans fin imposée")}
  ${opt("horizon.type","duration","Une durée","4, 8 ou 12 semaines")}
  ${opt("horizon.type","date","Une date cible","Un objectif perso")}
  ${opt("horizon.type","event","Un événement","Une course, une marche, une fitness race")}`;
  if (h.type==="duration") body += `<div class="chips mt">${[4,8,12].map(w => chip("horizon.weeks", w, `${w} semaines`, "single")).join("")}</div>`;
  if (h.type==="date") body += `<label class="field mt"><span>Date</span><input class="input" type="date" min="${T()}" value="${esc(h.date||"")}" data-in="hdate"></label>
   <div class="chips">${["course","marche","hybride"].map(k => chip("horizon.sport", k, DISC[k].t, "single","sm")).join("")}</div>
   ${h.sport==="course" || h.sport==="marche" ? `<div class="chips mt">${(h.sport==="course" ? [5,10] : [5,10,15]).map(k => chip("horizon.dist", k, `${k} km`, "single","sm")).join("")}</div>` : ""}`;
  if (h.type==="event"){
   const evs = allEvents().filter(e => e.status!=="cancelled" && e.date && e.date >= T()).sort((a,b) => a.date.localeCompare(b.date));
   body += `<h2>Choisis ton événement</h2>` + evs.map(e => `<button class="ev" data-a="pickEv" data-id="${e.id}" aria-pressed="${h.id===e.id}" style="${h.id===e.id ? "border-color:var(--acc);box-shadow:inset 0 0 0 1px var(--acc)" : ""}">${evDate(e)}<span class="t"><b>${esc(e.t)}</b><span>${esc(e.fmt||"")} · ${esc(e.city)}</span>${e.demo ? `<span class="st">Exemple fictif</span>` : ""}</span>${h.id===e.id ? `<span class="ck" style="color:var(--acc-ink)">${ic("check")}</span>` : ""}</button>`).join("")
    + `<button class="btn ghost sm" data-a="addEvent">${ic("plus","s")} Ajouter le mien</button>`;
  }
  if ((h.type==="date" || h.type==="event") && h.date) body += feasBox(d, h);
 }
 if (st===5) body = onbSummary();
 const nav = st===5
  ? `<div class="btns"><button class="btn ghost" data-a="onbGo" data-v="1">Modifier</button><button class="btn" data-a="onbDone">${ONB.edit ? "Appliquer" : "C'est parti"}</button></div>`
  : `<button class="btn" data-a="onbNext" ${onbValid() ? "" : "disabled"}>Continuer</button>`;
 return `<div class="ovh"><button class="ib" data-a="onbBack" aria-label="${st>1 ? "Étape précédente" : "Fermer"}">${ic(st>1 ? "back" : "x")}</button><div class="prog" role="progressbar" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${st}" aria-label="Étape ${st} sur 5"><i style="width:${st*20}%"></i></div></div>
 <p class="eyebrow">${ONB.edit ? "Modifier" : "Étape " + st + " sur 5"}</p><h1>${titles[st]}</h1>${body}<div class="foot">${nav}</div>`;
};
function feasBox(d, h){
 const f = feasibility(S, d, h.sport || "course", h.dist, h.date);
 if (f.past) return `<div class="note warn">${ic("info")}<div><b>Date passée</b>Choisis une date à venir.</div></div>`;
 if (f.ok) return `<div class="note">${ic("check")}<div><b>Délai réaliste</b>${plural(f.weeks,"semaine")} devant toi, il en faut environ ${f.need}. Sans promesse de chrono.</div></div>`;
 if (h.mode==="decouverte") return `<div class="note">${ic("check")}<div><b>Mode découverte</b>Objectif : y participer à ton rythme, en marchant ou en alternant.</div></div>`;
 return `<div class="note warn">${ic("info")}<div><b>${f.tooClose ? "C'est dans moins d'une semaine" : "Délai un peu court"}</b>${f.tooClose ? "" : `${plural(f.weeks,"semaine")} disponibles, il en faudrait environ ${f.need}.`}
  <div class="stack" style="margin-top:12px"><button class="btn sm" data-a="feasOpt" data-v="decouverte">Y aller en mode découverte</button>
   ${h.type==="date" ? `<button class="btn sm ghost" data-a="feasOpt" data-v="later">Viser le ${fmtD(f.later)}</button>` : `<button class="btn sm ghost" data-a="feasOpt" data-v="other">Choisir un autre événement</button>`}
   <button class="btn sm ghost" data-a="feasOpt" data-v="nodate">Sans date</button></div></div></div>`;
}
function previewPlan(d){
 const tmp = {simOffset: S.simOffset, sessions: [], log: [], profile: d};
 createPlan(tmp);
 if (ONB && ONB.edit && S.plan){ tmp.plan.stage = clone(S.plan.stage); tmp.sessions = []; generateWeek(tmp, monday(T()), T()); }
 return tmp;
}
const COMPLEMENT_WHY = {course:"il aide à encaisser la progression en course.", marche:"elle entretient les articulations.", renfo:"elle ajoute de l'endurance en douceur.", mobilite:"elle complète en douceur.", hybride:"elle prépare la partie cardio des ateliers."};
function reasons(p, tmp){
 const r = [], n = sessionsPerWeek(p), wt = weekTypes(p, n);
 r.push(`${plural(n,"séance")} par semaine${n < p.days.length ? ", les autres jours restent libres pour récupérer" : ""}.`);
 r.push(`${TYPES[wt.prim].t} en priorité${(p.horizon.type==="event" || p.horizon.type==="date") ? " pour ton échéance" : ""}.`);
 if (wt.complementAdded) r.push(`${TYPES[wt.complement].t} en complément : ${COMPLEMENT_WHY[wt.prim]}`);
 r.push(`${p.minutes} min maximum, échauffement et retour au calme compris.`);
 r.push("Jamais deux séances intenses d'affilée quand c'est évitable.");
 r.push("Uniquement des exercices faisables avec ton matériel.");
 if (p.prefs.noImpact) r.push("Sans sauts ni course, comme demandé.");
 if (p.prefs.noFloor) r.push("Sans passage au sol, comme demandé.");
 const ph = phaseFor(p, tmp.plan, monday(T()));
 r.push(`Phase actuelle : ${PHASES[ph].t.toLowerCase()}.`);
 if (p.horizon.type==="none") r.push("Sans date de fin : des cycles de 4 semaines, dont 1 plus légère.");
 [...new Set(tmp.sessions.flatMap(s => s.notes))].forEach(x => r.push(x));
 return r;
}
function onbSummary(){
 const d = ONB.d, tmp = previewPlan(d);
 const eqs = d.places.map(pl => `${PLACES[pl]} : ${(d.equip[pl]||[]).length ? d.equip[pl].map(e => EQUIP[e].toLowerCase()).join(", ") : "sans matériel"}`).join(" · ");
 const item = (step, label, val) => `<button class="rowi" data-a="onbGo" data-v="${step}"><span class="t"><span>${label}</span><b>${val}</b></span>${ic("chev","s")}</button>`;
 return `<h2 style="margin-top:0">Ta semaine</h2>
 ${tmp.sessions.length ? tmp.sessions.map(s => `<div class="dayc"><span class="d">${DOWS[dow(s.date)]}<b>${pd(s.date).getDate()}</b></span><span class="ic">${ic(typeIcon(s.type))}</span><span class="t"><b>${esc(s.title)}</b><span>${s.minutes} min · ${PLACES[s.place]}</span></span></div>`).join("")
   : `<div class="note">${ic("info")}<div>Plus de jour disponible cette semaine : ton programme démarre lundi. En attendant, une séance découverte t'attend dans Explorer.</div></div>`}
 <h2>Pourquoi</h2><div class="card"><ul class="checks">${reasons(d, tmp).map(x => `<li><span class="c">${ic("check","s")}</span><span>${esc(x)}</span></li>`).join("")}</ul></div>
 <h2>Tes réglages</h2><div class="card flat">
  ${item(1,"Objectif", esc(goalText(d)) + " · " + d.disc.map(k => DISC[k].t).join(", "))}
  ${item(2,"Rythme", `${LEVELS.find(l => l.id===d.level).t} · ${[...d.days].sort().map(i => DOWS[i]).join(", ")} · ${d.minutes} min`)}
  ${item(3,"Lieux", esc(eqs))}
  ${item(4,"Horizon", esc(horizonText(d)))}
 </div>
 <p class="small sub mt">Tout reste modifiable à tout moment.</p>`;
}

/* ================= ACCUEIL ================= */
const weekCache = {};
function previewWeek(ws){
 const key = ws + "|" + S.sessions.length + "|" + JSON.stringify(S.plan.stage) + JSON.stringify(S.profile).length;
 if (weekCache[key]) return weekCache[key];
 const tmp = {simOffset: S.simOffset, sessions: [], log: [], profile: S.profile, plan: clone(S.plan)};
 generateWeek(tmp, ws, ws); return (weekCache[key] = tmp.sessions);
}
const realOn = d => S.sessions.filter(s => s.date===d && s.status!=="cancelled" && (s.plan || s.status!=="planned"));
const STRONG = {course_facile:.85, course_vive:1, marche_active:.45, marche_vive:.6, marche_lente:.3};
function structHTML(s){
 const last = s.blocks.length-1; const parts = [];
 s.blocks.forEach((b,bi) => {
  if (bi===0 || bi===last){ parts.push({w: b.steps.reduce((a,x)=>a+x.dur,0), h:.3, o:.45}); return; }
  b.steps.forEach(st => { if (st.rest) parts.push({w:st.dur, h:.2, o:.45}); else { const v = STRONG[st.ex]; parts.push({w:st.dur, h: v || .9, o: v && v < .7 ? .55 : 1}); } });
 });
 return `<div class="struct" aria-hidden="true">${parts.map(p => `<i style="flex:${p.w} 1 0;height:${Math.round(p.h*100)}%;background:currentColor;opacity:${p.o}"></i>`).join("")}</div>`;
}
function heroCard(s){
 const t = T(), open = s.status==="planned";
 const when = s.date===t ? "Aujourd'hui" : DOWL[dow(s.date)];
 return `<div class="hero">
  <span class="tag">${ic(typeIcon(s.type),"s")} ${when} · ${TYPES[s.type].t}</span>
  <div class="ttl">${esc(s.title)}</div>
  <p class="meta">${s.minutes} min · ${PLACES[s.place]} · ${esc(equipText(s))}</p>
  ${structHTML(s)}
  ${open ? `<button class="btn" data-a="start" data-id="${s.id}">${ic("play")} Démarrer la séance</button>
   <div class="between" style="margin-top:10px"><button class="link" data-a="sess" data-id="${s.id}">Voir le détail</button><button class="link" data-a="adapt" data-id="${s.id}">Adapter</button></div>`
   : `<p class="meta" style="margin-top:16px">${ic("check","s")} ${STATUS[s.status]}${s.doneMin ? " · " + s.doneMin + " min" : ""}${s.rpe ? " · " + RPE[s.rpe-1].toLowerCase() : ""}</p>`}
 </div>`;
}
function weekPills(){
 const t = T(), ws = monday(t);
 return `<div class="week">${DOWS.map((l,i) => {
  const d = addD(ws,i), ss = S.plan.paused ? [] : realOn(d), s = ss[0];
  const done = s && (s.status==="done" || s.status==="partial"), today = d===t;
  const cls = today ? "today" : done ? "done" : s && s.status==="planned" ? "plan" : "rest";
  const m = done ? ic("check","s") : s && s.status==="planned" ? `<span class="dot"></span>` : "";
  return `<div class="w ${cls}" ${s ? `role="button" tabindex="0" data-a="sess" data-id="${s.id}"` : ""}><span>${l.charAt(0)}</span><b>${pd(d).getDate()}</b><span class="m">${m}</span><span class="sr">${s ? TYPES[s.type].t + ", " + STATUS[s.status] : "repos"}</span></div>`;
 }).join("")}</div>`;
}
function noticeHTML(n){
 if (n.id==="comeback") return `<div class="note warn">${ic("info")}<div><b>Content·e de te revoir</b>Ça fait ${n.days} jours. On reprend plus doucement, sans rien rattraper.
  <div class="btns"><button class="btn sm" data-a="comeback">Reprendre en douceur</button><button class="btn sm ghost" data-a="dismiss" data-v="comeback" data-k="${n.key}">Garder mon plan</button></div></div></div>`;
 if (n.id==="passed") return `<div class="note">${ic("flag")}<div><b>Échéance passée, bravo !</b>Une semaine plus légère, puis tu choisis la suite.
  <div class="stack" style="margin-top:12px"><button class="btn sm" data-a="afterGoal" data-v="new">Nouvel objectif</button><button class="btn sm ghost" data-a="afterGoal" data-v="keep">Continuer sans date</button></div></div></div>`;
 if (n.id==="duration") return `<div class="note">${ic("flag")}<div><b>${n.key} semaines bouclées</b>Tu continues sans date, ou un nouvel objectif ?
  <div class="btns"><button class="btn sm" data-a="afterGoal" data-v="keep">Continuer</button><button class="btn sm ghost" data-a="afterGoal" data-v="new">Nouvel objectif</button></div></div></div>`;
 return "";
}
function topBar(){
 const t = T(), name = (S.account && S.account.first) || (S.profile && S.profile.name);
 return `<div class="top">${MARK}<div class="hi"><span>${fmtLong(t).replace(/^./, c => c.toUpperCase())}${S.simOffset ? " · simulé" : ""}</span><b>${name ? "Bonjour " + esc(name) : "Bonjour"}</b></div><button class="ib" data-a="safety" aria-label="Sécurité">${ic("shield")}</button></div>`;
}
function vToday(){
 const t = T();
 let h = topBar();
 if (!S.onboarded) return h + discoveryHome();
 const p = S.profile, ws = monday(t), we = addD(ws,6);
 h += notices(S).map(noticeHTML).join("");
 if (S.lastMsgs && S.lastMsgs.length) h += `<div class="note">${ic("progress")}<div><b>Bilan de la semaine</b>${S.lastMsgs.map(esc).join("<br>")}</div><button class="ib" style="width:36px;height:36px;background:transparent;border:0" data-a="clearMsgs" aria-label="Masquer">${ic("x","s")}</button></div>`;
 if (S.plan.paused){
  h += `<div class="hero"><span class="tag">${ic("pause","s")} En pause</span><div class="ttl">Programme en pause</div><p class="meta">Ton historique est gardé, rien à rattraper.</p><button class="btn" data-a="resume">Reprendre</button></div>`;
 } else {
  const todays = realOn(t), nx = S.sessions.find(s => s.plan && s.status==="planned" && s.date > t);
  if (todays.length) h += todays.map(heroCard).join("");
  else h += `<div class="hero"><span class="tag">${ic("moon","s")} Aujourd'hui · Repos</span><div class="ttl">Récupère</div><p class="meta">Le repos fait partie du programme.${nx ? ` Prochaine séance ${DOWL[dow(nx.date)].toLowerCase()}.` : ""}</p><button class="btn" data-a="quick" data-v="mobilite" data-m="10">${ic("flex")} Mobilité douce · 10 min</button></div>`;
 }
 const wk = S.sessions.filter(s => s.plan && s.date >= ws && s.date <= we && s.status!=="cancelled");
 const doneN = wk.filter(s => s.status==="done" || s.status==="partial").length;
 const mins = S.sessions.filter(s => (s.status==="done" || s.status==="partial") && s.date >= ws && s.date <= we).reduce((a,s) => a + (s.doneMin ?? s.minutes), 0);
 const hz = p.horizon, dleft = (hz.type==="event" || hz.type==="date") && hz.date ? diffD(t, hz.date) : null;
 h += `<div class="between" style="margin-top:28px;margin-bottom:14px"><h2 style="margin:0">Cette semaine</h2><button class="link" data-a="tab" data-v="plan">Voir le plan</button></div>${weekPills()}
 <div class="tiles" style="margin-top:12px">
  <div class="tile">${ic("dumb")}<b>${doneN}<small>/${wk.length}</small></b><span>Séances</span></div>
  <div class="tile">${ic("clock")}<b>${mins}</b><span>Minutes</span></div>
  ${dleft!=null && dleft >= 0 ? `<div class="tile hi">${ic("flag")}<b>J-${dleft}</b><span>${esc((hz.name||"Objectif").split(" ").slice(0,3).join(" "))}</span></div>`
   : `<div class="tile">${ic("bars")}<b>${S.plan.stage[primaryDisc(p)]}<small>/10</small></b><span>Palier</span></div>`}
 </div>`;
 h += `<button class="card" style="display:flex;align-items:center;gap:14px;width:100%;text-align:left;margin-top:12px;color:inherit" data-a="tab" data-v="profile"><span style="flex:1"><span class="sub small">Objectif</span><b style="display:block;font-weight:600">${esc(goalText(p))}</b><span class="sub small">${esc(horizonText(p))}</span></span>${ic("chev")}</button>`;
 return h;
}
function discoveryHome(){
 return `<div class="hero"><span class="tag">Mode découverte</span><div class="ttl">Le sport qui s'adapte à ta vie</div><p class="meta">Crée ton programme en 1 minute : tes jours, ton matériel, ton objectif.</p><button class="btn" data-a="startOnb">Créer mon programme</button></div>
 <h2>Essayer une séance</h2>
 <div class="card flat">${["marche","renfo","mobilite","course","hybride"].map(k => `<button class="rowi" data-a="quick" data-v="${k}" data-m="15"><span class="dayc" style="all:unset"><span class="ic" style="width:46px;height:46px;border-radius:50%;background:var(--card2);color:var(--acc-ink);display:grid;place-items:center">${ic(typeIcon(k))}</span></span><span class="t"><b>${DISC[k].t}</b><span>15 min · sans matériel</span></span><span class="go">${ic("chev","s")}</span></button>`).join("")}</div>`;
}

/* ================= SÉANCE (DÉTAIL) ================= */
function findS(id){ return S.sessions.find(s => s.id===id) || (QUICK && QUICK.id===id ? QUICK : null) || Object.values(weekCache).flat().find(s => s.id===id); }
let QUICK = null;
function blockSummary(b){
 const map = new Map();
 b.steps.filter(x => !x.rest).forEach(x => { const m = map.get(x.ex) || {n:0, tot:0, durs:new Set()}; m.n++; m.tot += x.dur; m.durs.add(x.dur); map.set(x.ex, m); });
 return [...map.entries()].map(([id,m]) => { const e = EXI[id];
  const d = m.n > 1 && m.durs.size===1 ? `${m.n} × ${durStr([...m.durs][0])}` : durStr(m.tot);
  return `<button class="ex" data-a="ex" data-id="${id}"><span class="th">${exThumb(e)}</span><span class="nm">${esc(e.n)}${e.m==="r" ? `<small>≈ ${esc(e.r)} répétitions</small>` : ""}</span><span class="du">${d}</span></button>`; }).join("");
}
OVK.sess = o => {
 const s = o.s || findS(o.id); if (!s) return `<div class="ovh">${backBtn()}</div><p>Séance introuvable.</p>`;
 const t = T(), canStart = s.status==="planned" && !s.preview && (s.date===t || !s.plan);
 const blocks = []; let tours = 0;
 s.blocks.forEach(b => { if (/^Circuit · tour/.test(b.name)){ tours++; if (tours===1) blocks.push(b); } else blocks.push(b); });
 const blockDur = b => /^Circuit/.test(b.name) ? s.blocks.filter(x => /^Circuit/.test(x.name)).reduce((a,x) => a + x.steps.reduce((y,z)=>y+z.dur,0), 0) : b.steps.reduce((a,x)=>a+x.dur,0);
 return `<div class="shead"><div class="ovh" style="margin-bottom:6px">${backBtn()}<span class="sp"></span>${s.status!=="planned" ? `<span class="sub">${STATUS[s.status]}</span>` : ""}</div>
  <span class="tag">${s.plan ? (s.date===t ? "Aujourd'hui" : fmtLong(s.date).replace(/^./, c => c.toUpperCase())) : "Séance découverte"}${s.preview ? " · aperçu" : ""}</span>
  <h1>${esc(s.title)}</h1><p class="meta">${TYPES[s.type].t}${s.phase ? " · " + PHASES[s.phase].t : ""}</p>
  <div class="stats"><div><span>Durée</span><b>${s.minutes} min</b></div><div><span>Lieu</span><b>${PLACES[s.place]}</b></div><div><span>Niveau</span><b>${s.stage}/10</b></div></div></div>
 <h2>Structure</h2><div class="card" style="color:var(--acc-ink)">${structHTML(s)}<div class="between xs sub" style="margin-top:10px"><span>Échauffement</span><span>${tours>1 ? tours + " tours" : "Corps de séance"}</span><span>Retour au calme</span></div></div>
 ${s.notes.length || s.reason ? `<div class="note">${ic("info")}<div>${s.notes.concat(s.reason ? [s.reason] : []).map(esc).join("<br>")}</div></div>` : ""}
 <div class="tl" style="margin-top:22px">${blocks.map((b,i) => `<div class="st"><span class="n ${i>0 && i<blocks.length-1 ? "main" : ""}">${i+1}</span><div class="t"><b>${/^Circuit/.test(b.name) ? `Circuit${tours>1 ? " × " + tours + " tours" : ""}` : esc(b.name)}</b><span>${durStr(blockDur(b))}${equipText(s)!=="Sans matériel" && i>0 && i<blocks.length-1 ? " · " + esc(equipText(s)) : ""}</span>${blockSummary(b)}</div></div>`).join("")}</div>
 <div class="note">${ic("shield")}<div>Douleur inhabituelle ou malaise : arrête-toi. ${VALID}.</div></div>
 <div class="foot">${canStart ? `<button class="btn" data-a="start" data-id="${s.id}">${ic("play")} Démarrer</button>${s.plan ? `<button class="link" style="display:block;margin:8px auto 0" data-a="adapt" data-id="${s.id}">Adapter la séance</button>` : ""}`
  : s.status==="planned" && !s.preview ? `<button class="btn ghost" data-a="adapt" data-id="${s.id}">Adapter ou déplacer</button>` : ""}</div>`;
};

/* ================= FICHE EXERCICE ================= */
function exFrames(ex){
 const poses = [...new Set(ex.anim)].slice(0,3), W = 225, n = poses.length;
 const vb = ex.hz ? `-110 -112 ${W*n} 124` : `-105 -200 ${W*n} 212`, top = ex.hz ? -95 : -170;
 let g = "";
 poses.forEach((k,i) => {
  g += `<g transform="translate(${i*W} 0)"><line x1="-95" y1="0" x2="110" y2="0" stroke="var(--line)" stroke-width="2.5" stroke-linecap="round"/>${scene(ex.sc)}${figSVG(POSES[k])}</g>`;
  if (i < n-1) g += `<path d="M${i*W+70} ${top+30} q42 -26 84 0" fill="none" stroke="var(--acc)" stroke-width="4" stroke-linecap="round"/><path d="M${i*W+146} ${top+20} l8 10 -12 3" fill="none" stroke="var(--acc)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
 });
 return {svg: `<svg viewBox="${vb}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="Étapes du mouvement">${g}</svg>`, labels: poses.map((k,i) => ex.ph[Math.min(i, ex.ph.length-1)])};
}
OVK.ex = o => {
 const e = EXI[o.id], cat = {allure:"Allure", cardio:"Cardio", renfo:"Renforcement", mobilite:"Mobilité"}[e.d];
 const eq = (e.eq||[]).map(q => EQUIP[q]).concat(e.any ? [e.any.map(q => EQUIP[q]).join(" ou ")] : []);
 const fr = exFrames(e);
 const v = (id, l) => id ? `<button class="swapbar" data-a="ex" data-id="${id}">${ic("swap")}<span class="t"><small>${l}</small>${esc(EXI[id].n)}</span>${ic("chev","s")}</button>` : "";
 return `<div class="demo"><div class="ovh" style="margin-bottom:0">${backBtn()}</div><div class="frames">${fr.svg}</div><div class="lbl">${fr.labels.map(l => `<span>${esc(l)}</span>`).join("")}</div></div>
 <p class="eyebrow" style="margin-top:24px">${cat}</p><h1 style="margin-bottom:14px">${esc(e.n)}</h1>
 <div class="info3"><div><span>Niveau</span><b>${LVL_T[e.l]}</b></div><div><span>Matériel</span><b>${eq.length ? esc(eq[0].split(" ")[0]) : "Aucun"}</b></div><div><span>${e.m==="r" ? "Répétitions" : "Position"}</span><b>${e.m==="r" ? esc(e.r) : e.sol ? "Au sol" : "Debout"}</b></div></div>
 <div class="card" style="margin-top:18px"><ul class="checks">${e.cues.map(c => `<li><span class="c">${ic("check","s")}</span><span>${esc(c)}</span></li>`).join("")}</ul></div>
 ${v(e.easy,"Plus facile")}${v(e.hard,"Plus difficile")}
 <h2>À éviter</h2><div class="card"><ul class="checks">${e.err.map(c => `<li><span class="c" style="color:var(--danger);background:var(--danger-soft)">${ic("x","s")}</span><span>${esc(c)}</span></li>`).join("")}</ul></div>
 <div class="note">${ic("shield")}<div>${esc(e.prec)}${e.imp ? " Cet exercice comporte des impacts." : ""}</div></div>
 <p class="xs sub" style="margin-top:6px">${eq.length ? "Matériel : " + esc(eq.join(", ")) + " · " : ""}${VALID}</p>`;
};

/* ================= PLAN ================= */
let PLANV = "week", WKOFF = 0, MOFF = 0;
function vPlan(){
 if (!S.onboarded) return `<p class="eyebrow">Mon plan</p><h1>Plan</h1><div class="hero"><div class="ttl">Ton plan arrive</div><p class="meta">Une semaine détaillée, des phases, et tout reste modifiable.</p><button class="btn" data-a="startOnb">Créer mon programme</button></div>`;
 const t = T(), p = S.profile, ws = addD(monday(t), WKOFF*7), ph = phaseFor(p, S.plan, ws);
 const list = PLANV==="week" ? (S.plan.paused ? [] : WKOFF===0 ? S.sessions.filter(s => s.date >= ws && s.date <= addD(ws,6) && (s.plan || s.status!=="planned")) : previewWeek(ws).map(s => Object.assign({preview:true}, s))) : [];
 const act = list.filter(s => s.status!=="cancelled"), done = act.filter(s => s.status==="done" || s.status==="partial").length;
 let h = `<p class="eyebrow">Mon plan · ${PHASES[ph].t}</p><h1>${PLANV==="month" ? "Ce mois-ci" : WKOFF===0 ? "Cette semaine" : "Semaine prochaine"}</h1>`;
 if (PLANV==="week") h += `<p class="phline">${fmtD(ws)} – ${fmtD(addD(ws,6))} · ${plural(act.length,"séance")}${WKOFF===0 ? ` · ${done} réalisée${done>1 ? "s" : ""}` : " · aperçu"}</p>`;
 h += `<div class="weeks" role="tablist"><button class="wk ${PLANV==="week" && WKOFF===0 ? "on" : ""}" data-a="planw" data-v="0">Cette semaine</button><button class="wk ${PLANV==="week" && WKOFF===1 ? "on" : ""}" data-a="planw" data-v="1">Suivante</button><button class="wk ${PLANV==="month" ? "on" : ""}" data-a="planv" data-v="month">Mois</button></div>`;
 if (S.plan.paused) h += `<div class="note warn">${ic("pause")}<div><b>Programme en pause</b><button class="link" data-a="resume" style="color:inherit">Reprendre</button></div></div>`;
 if (PLANV==="week"){
  h += `<div style="margin-top:12px">`;
  for (let i=0; i<7; i++){
   const d = addD(ws, i), ss = list.filter(s => s.date===d);
   if (!ss.length){ h += `<div class="dayc rest"><span class="d">${DOWS[i]}<b>${pd(d).getDate()}</b></span><span class="ic">${ic("moon")}</span><span class="t"><b>Repos</b>${p.days.includes(i) ? `<span>Jour libre gardé pour récupérer</span>` : ""}</span></div>`; continue; }
   ss.forEach(s => {
    const now = d===t && s.status==="planned" && !s.preview, ok = s.status==="done" || s.status==="partial", off = s.status==="cancelled" || s.status==="missed" || s.status==="skipped";
    h += `<button class="dayc ${now ? "now" : ""} ${off ? "off" : ""}" data-a="sess" data-id="${s.id}"><span class="d">${DOWS[i]}<b>${pd(d).getDate()}</b></span><span class="ic">${ic(typeIcon(s.type))}</span><span class="t"><b>${esc(s.title)}</b><span>${s.minutes} min · ${PLACES[s.place]}${off ? " · " + STATUS[s.status].toLowerCase() : s.mod && s.status==="planned" ? " · modifiée" : ""}</span></span>${ok ? `<span class="ok">${ic("check","s")}</span>` : now ? `<span class="gob" data-a="start" data-id="${s.id}" role="button">Go</span>` : ic("chev","s")}</button>`;
   });
  }
  h += `</div>`;
  if (WKOFF===1) h += `<p class="xs sub">Recalculée lundi selon ta semaine réelle.</p>`;
 } else h += monthView();
 h += `<h2>Phases</h2><div class="card flat">${phaseRows()}</div>`;
 const row = (a, v, t1, t2) => `<button class="rowi" data-a="${a}" ${v!=null ? `data-v="${v}"` : ""}><span class="t"><b>${t1}</b><span>${t2}</span></span><span class="go">${ic("chev","s")}</span></button>`;
 h += `<h2>Ajuster</h2><div class="card flat">
  ${row("edit",1,"Changer d'objectif", esc(goalText(p)))}
  ${row("edit",4,"Échéance", esc(horizonText(p)))}
  ${row("edit",2,"Jours et durée", `${[...p.days].sort().map(i => DOWS[i]).join(", ")} · ${p.minutes} min`)}
  ${row("edit",3,"Lieux et matériel", p.places.map(x => PLACES[x]).join(", "))}
  ${S.plan.paused ? row("resume",null,"Reprendre","Repart de ton niveau actuel") : row("pause",null,"Mettre en pause","Vacances, imprévu… rien à rattraper")}
  ${row("journal",null,"Historique des changements", plural(S.log.length,"modification"))}</div>`;
 return h;
}
function phaseRows(){
 const t = T(), p = S.profile, hz = p.horizon, out = [];
 for (let w=0; w<12; w++){
  const ws = addD(monday(t), w*7), ph = phaseFor(p, S.plan, ws);
  const tg = (hz.type==="event" || hz.type==="date") && hz.date && hz.date >= ws && hz.date <= addD(ws,6);
  const last = out[out.length-1];
  if (last && last.ph===ph && !tg && !last.tg) last.end = ws; else out.push({ph, start:ws, end:ws, tg});
 }
 return out.slice(0,5).map((r,i) => `<div class="rowi"><span class="t"><b>${PHASES[r.ph].t}${r.tg ? " · échéance" : ""}</b><span>${i===0 ? "Maintenant" : "Sem. du " + fmtD(r.start)}${r.end!==r.start ? " → " + fmtD(addD(r.end,6)) : ""}</span></span><span class="v">${esc(PHASES[r.ph].s)}</span></div>`).join("")
  + `<p class="xs sub" style="padding:4px 0 14px">Indicatif, réévalué chaque semaine.</p>`;
}
function monthView(){
 const t = T(), base = pd(t); base.setDate(1); base.setMonth(base.getMonth()+MOFF);
 const first = iso(base), start = monday(first), m = base.getMonth(), h = S.profile.horizon;
 let out = `<div class="between" style="margin:14px 0"><button class="ib" data-a="mo" data-v="-1" aria-label="Mois précédent">${ic("back")}</button><b style="font-size:1.15rem">${MONTHL[m]} ${base.getFullYear()}</b><button class="ib" data-a="mo" data-v="1" aria-label="Mois suivant">${ic("chev")}</button></div><div class="card"><div class="month">${DOWS.map(d => `<div class="h">${d.charAt(0)}</div>`).join("")}`;
 for (let i=0; i<42; i++){
  const d = addD(start, i); if (i>=35 && pd(d).getMonth()!==m) break;
  const ss = realOn(d), ok = ss.some(s => s.status==="done" || s.status==="partial"), pl = ss.some(s => s.status==="planned");
  const tg = (h.type==="event" || h.type==="date") && h.date===d;
  out += `<div class="c ${pd(d).getMonth()!==m ? "o" : ""} ${d===t ? "t" : ok ? "done" : ""} ${tg ? "tg" : ""}" aria-label="${fmtLong(d)}${ok ? ", séance faite" : pl ? ", séance prévue" : ""}${tg ? ", échéance" : ""}"><span>${pd(d).getDate()}</span>${pl && d!==t ? "<i></i>" : ""}</div>`;
 }
 return out + `</div><div class="legend"><span><i style="background:var(--card2);box-shadow:inset 0 0 0 3px var(--acc)"></i>Faite</span><span><i style="width:6px;height:6px;background:var(--tx)"></i>Prévue</span><span><i style="box-shadow:inset 0 0 0 2px var(--warn)"></i>Échéance</span></div></div>`;
}

/* ================= ADAPTER UNE SÉANCE ================= */
let ADP = null;
const srow = (a, i, t1, t2, extra) => `<button class="rowi" data-a="${a}" ${extra||""}><span class="go" style="width:44px;height:44px;border-radius:50%;color:var(--acc-ink)">${ic(i)}</span><span class="t"><b>${t1}</b><span>${t2}</span></span>${ic("chev","s")}</button>`;
function adaptMenu(s){
 ADP = {s};
 openSheet(`<h3>Adapter</h3><p class="lead">${esc(s.title)} · ${fmtLong(s.date)}</p><div class="card flat">
  ${srow("adTime","clock","Moins de temps","Version courte")}
  ${srow("adPlace","pin","Autre lieu","Maison, extérieur ou salle")}
  ${srow("adMiss","dumb","Matériel manquant","Variante compatible")}
  ${srow("adMove","move","Autre jour","Sans doubler une séance")}
  ${srow("adRep","swap","Autre activité","Même créneau")}
  ${srow("adCancel","x","Pas cette fois","Retirée, sans rattrapage")}</div>
  <button class="btn ghost mt" data-a="closeSheet">Fermer</button>`);
}
function previewSheet(newS, reason, extra){
 ADP.newS = newS; ADP.reason = reason;
 const s = ADP.s, box = (lab, x, hi) => `<div class="tile ${hi ? "hi" : ""}"><span style="margin:0">${lab}</span><b style="font-size:1.1rem;margin-top:8px;line-height:1.2">${esc(x.title)}</b><span>${fmtD(x.date)} · ${x.minutes} min · ${PLACES[x.place]}</span><span>${esc(equipText(x))}</span></div>`;
 openSheet(`<h3>Aperçu</h3><p class="lead">${esc(reason)}</p>
  <div class="tiles two">${box("Avant", s)}${box("Après", newS, true)}</div>
  ${newS.notes.length || extra ? `<div class="note">${ic("info")}<div>${[extra].concat(newS.notes).filter(Boolean).map(esc).join("<br>")}</div></div>` : ""}
  <p class="small sub" style="margin:12px 0 16px">Rien n'est doublé ni rattrapé. Le reste de la semaine ne bouge pas.</p>
  <div class="btns"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn" data-a="adOk">Valider</button></div>`);
}

/* ================= LECTEUR DE SÉANCE ================= */
let PL = null, PLT = null, WAKE = null, AC = null, READY = null;
function audio(){ try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state==="suspended") AC.resume(); } catch(e){} }
function beep(f, d){ if (!S.settings.sound || !AC) return; try { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f || 880; g.gain.value = .08; o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + (d || .12)); } catch(e){} }
function say(t){ if (!S.settings.voice || !window.speechSynthesis) return; try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "fr-FR"; u.rate = 1; speechSynthesis.speak(u); } catch(e){} }
function buzz(p){ if (S.settings.vibrate && navigator.vibrate) try { navigator.vibrate(p || 120); } catch(e){} }
async function wake(on){ try { if (on && "wakeLock" in navigator) WAKE = await navigator.wakeLock.request("screen"); else if (!on && WAKE){ await WAKE.release(); WAKE = null; } } catch(e){} }
function startPlayer(s, skipReady){
 const steps = []; s.blocks.forEach((b,bi) => b.steps.forEach(st => steps.push(Object.assign({block: b.name, bi}, st))));
 PL = {s, steps, i:0, acc:0, t0: performance.now(), paused:true, swap:{}, spent: steps.map(() => 0), beeped: -1};
 audio(); wake(true); OV = OV.filter(o => o.k!=="sess");
 clearInterval(PLT); clearInterval(READY);
 if (skipReady || document.documentElement.classList.contains("nomotion")) return goLive();
 let n = 3; pushOv("ready", {n}); say("Prêt ? 3");
 READY = setInterval(() => { n--; const top = OV[OV.length-1]; if (!top || top.k!=="ready"){ clearInterval(READY); return; }
  if (n <= 0){ clearInterval(READY); goLive(); return; } top.n = n; beep(660); renderOv(); }, 1000);
}
function goLive(){ clearInterval(READY); OV = OV.filter(o => o.k!=="ready"); PL.paused = false; PL.t0 = performance.now(); pushOv("player"); announce(); clearInterval(PLT); PLT = setInterval(tick, 200); }
OVK.ready = o => `<b>Prêt·e ?</b><div class="n" aria-live="assertive">${o.n}</div><p>${esc(PL.s.title)} · ${PL.s.minutes} min</p><button data-a="goLive">Passer</button>`;
const curEx = () => { const st = PL.steps[PL.i]; return st.rest ? null : EXI[PL.swap[PL.i] || st.ex]; };
const elapsed = () => PL.acc + (PL.paused ? 0 : (performance.now() - PL.t0)/1000);
function announce(){
 const st = PL.steps[PL.i], ex = curEx();
 const txt = st.rest ? `Récupération, ${durStr(st.dur)}` : `${ex.n}, ${durStr(st.dur)}`;
 say(txt.replace(" min ", " minutes ").replace(/ min$/," minutes").replace(/ s$/, " secondes"));
 const lr = $("plLive"); if (lr) lr.textContent = txt;
}
const RC = 2*Math.PI*46;
function tick(){
 if (!PL || PL.result) return;
 const st = PL.steps[PL.i], e = elapsed(), rem = st.dur - e, k = Math.max(0, Math.min(1, e/st.dur));
 PL.spent[PL.i] = Math.max(PL.spent[PL.i], Math.min(e, st.dur));
 const c = $("plClock"); if (c) c.textContent = clockStr(rem);
 const r = $("plRing"); if (r) r.setAttribute("stroke-dasharray", `${(RC*(1-k)).toFixed(1)} ${RC.toFixed(1)}`);
 const b = $("plBar"); if (b) b.style.width = (k*100).toFixed(1) + "%";
 const sec = Math.ceil(rem);
 if (!PL.paused && sec <= 3 && sec >= 1 && PL.beeped!==sec){ PL.beeped = sec; beep(660); }
 if (rem <= 0) goStep(PL.i + 1, true);
}
function goStep(i, auto){
 if (i < 0) i = 0;
 PL.i = i; PL.acc = 0; PL.t0 = performance.now(); PL.beeped = -1;
 if (i >= PL.steps.length) return finishPlayer(true);
 if (auto){ beep(990, .2); buzz(); }
 renderOv(); announce();
}
function finishPlayer(completed){
 clearInterval(PLT); stopAnim(); wake(false); try { speechSynthesis.cancel(); } catch(e){}
 const sec = Math.round(PL.spent.reduce((a,b) => a+b, 0));
 PL.result = {completed, sec, steps: PL.spent.filter((x,j) => x >= PL.steps[j].dur - 1 && !PL.steps[j].rest).length};
 FIN = {status: completed ? "done" : sec >= 60 ? "partial" : "skipped", rpe: null};
 OV = OV.filter(o => o.k!=="player"); pushOv("finish");
 if (completed) say("Séance terminée. Bravo !");
}
const LAB = {marche_lente:"Marche tranquille", marche_active:"Marche active", marche_vive:"Marche vive", course_facile:"Course facile", course_vive:"Plus vite"};
OVK.player = () => {
 const st = PL.steps[PL.i], ex = curEx(), n = PL.steps.length;
 const nxt = PL.steps.slice(PL.i+1).find(x => !x.rest), nxEx = nxt ? EXI[nxt.ex] : null;
 const base = st.rest ? null : EXI[st.ex];
 const ctx = makeCtx(S.profile || DEFAULT_P, PL.s.place, PL.s.missing);
 const varOk = id => id && compatible(EXI[id], ctx);
 const ringMode = st.rest || (ex && ex.d==="allure");
 const k = Math.max(0, Math.min(1, elapsed()/st.dur));
 const nb = PL.s.blocks.length;
 const segs = PL.s.blocks.map((b,bi) => `<i class="${bi < st.bi ? "d" : bi===st.bi ? "c" : ""}"></i>`).join("");
 const head = `<div class="hd"><button class="x" data-a="plStop" aria-label="Arrêter la séance">${ic("x")}</button><div class="t"><b>${esc(/^Circuit/.test(st.block) ? st.block.replace("Circuit · ","Circuit · ") : st.block)}</b>Étape ${PL.i+1} sur ${n} · ${esc(PL.s.title)}</div></div>`;
 let mid;
 if (ringMode){
  const lab = st.rest ? "Récupération" : LAB[ex.id] || ex.n;
  mid = `<div class="ringw"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="#1C2A2F" stroke-width="4"/><circle id="plRing" cx="50" cy="50" r="46" fill="none" stroke="#ACD1BB" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(RC*(1-k)).toFixed(1)} ${RC.toFixed(1)}"/></svg>
   <div class="ringc"><span class="lab">${esc(lab)}</span><span class="clock" id="plClock">${clockStr(st.dur - elapsed())}</span><span class="of">sur ${clockStr(st.dur)}${ex ? " · " + esc(ex.cues[0].toLowerCase()) : ""}</span></div></div>`;
 } else {
  mid = `<div class="stage"><svg id="plStage" role="img" aria-label="Démonstration : ${esc(ex.n)}"></svg></div>
   <div class="nm">${esc(ex.n)}</div>
   ${ex.m==="r" ? `<p class="rp">≈ ${esc(ex.r)} répétitions, à ton rythme</p>` : ""}
   <div class="tmr"><span class="clock" id="plClock">${clockStr(st.dur - elapsed())}</span><span class="rp">sur ${clockStr(st.dur)}</span></div>
   <div class="bar"><i id="plBar" style="width:${(k*100).toFixed(1)}%"></i></div>
   <div class="phs" id="plPh">${ex.ph.map((p,i) => `<span data-ph="${i}">${esc(p)}</span>`).join("")}</div>
   ${base && (varOk(base.easy) || varOk(base.hard) || PL.swap[PL.i]) ? `<div class="vars">${PL.swap[PL.i] ? `<button data-a="plVar" data-v="">Exercice prévu</button>` : `${varOk(base.easy) ? `<button data-a="plVar" data-v="${base.easy}">Plus facile</button>` : ""}${varOk(base.hard) ? `<button data-a="plVar" data-v="${base.hard}">Plus difficile</button>` : ""}`}</div>` : ""}
   <ul class="cues">${ex.cues.map(c => `<li>${esc(c)}</li>`).join("")}</ul>`;
 }
 return `${head}${mid}
 ${nxEx ? `<div class="nx"><div class="t"><span>Ensuite</span><b>${esc(nxEx.n)}</b></div><span class="th">${exThumb(nxEx)}</span></div>` : ""}
 <div class="segs" aria-hidden="true">${segs}</div>
 <div class="ctrl"><button class="rb" data-a="plPrev" aria-label="Étape précédente" ${PL.i===0 ? "disabled" : ""}>${ic("back")}</button><button class="rb big" data-a="plPause" aria-label="${PL.paused ? "Reprendre" : "Pause"}">${ic(PL.paused ? "play" : "pause")}</button><button class="rb" data-a="plNext" aria-label="Étape suivante">${ic("chev")}</button></div>
 <button class="stop" data-a="plStop">Douleur ou malaise ? Arrête-toi</button>
 <div id="plLive" class="sr" aria-live="assertive"></div>`;
};
OVA.player = () => { const st = PL.steps[PL.i], ex = curEx(); if (ex && !(ex.d==="allure")) animate($("plStage"), ex, phaseHL("plPh")); else stopAnim(); };

/* ================= FIN DE SÉANCE ================= */
let FIN = null;
OVK.finish = () => {
 const r = PL.result, min = Math.round(r.sec/60);
 const stb = (v, l) => `<button class="chip" role="radio" aria-checked="${FIN.status===v}" data-a="finSt" data-v="${v}">${l}</button>`;
 return `<div class="fin"><div class="ok"><span>${ic(r.completed ? "check" : "pause")}</span></div>
  <h1>${r.completed ? "Bien joué !" : "Séance arrêtée"}</h1><p>${esc(PL.s.title)}</p>
  <div class="stats"><div><b>${min || "<1"}</b><span>minutes</span></div><div><b>${r.steps}</b><span>exercices</span></div><div><b>${PL.s.stage}/10</b><span>palier</span></div></div></div>
 <h2>C'était comment ?</h2>
 <div class="rpe" role="radiogroup" aria-label="Difficulté ressentie, facultatif">${RPE.map((l,i) => `<button role="radio" aria-checked="${FIN.rpe===i+1}" aria-label="${l}" data-a="finRpe" data-v="${i+1}">${i+1}</button>`).join("")}</div>
 <div class="rpel"><span>Très facile</span><b>${FIN.rpe ? RPE[FIN.rpe-1] : "Facultatif"}</b><span>Trop dur</span></div>
 <h2>La séance</h2><div class="chips" role="radiogroup">${stb("done","Terminée")}${stb("partial","Partielle")}${stb("skipped","Pas faite")}</div>
 <p class="xs sub mt">Ton ressenti sert seulement à ajuster la suite. Il reste sur ce téléphone.</p>
 <div class="foot"><button class="btn" data-a="finSave">Enregistrer</button></div>`;
};

/* ================= SÉCURITÉ ================= */
OVK.safety = o => `<div class="ovh">${backBtn("back","Fermer")}</div>
 <p class="eyebrow">Sécurité</p><h1>${o.urgent ? "Arrête-toi maintenant" : "Écoute ton corps"}</h1>
 <div class="note danger">${ic("shield")}<div><b>Stop si tu ressens :</b>une douleur inhabituelle, un malaise, une douleur dans la poitrine ou un essoufflement anormal.</div></div>
 <p class="sub" style="margin:14px 0">Demande un avis médical. En cas d'urgence :</p>
 <div class="stack"><a class="btn danger" href="tel:15">${ic("phone")} Appeler le 15 · SAMU</a><a class="btn ghost" href="tel:112">${ic("phone")} Appeler le 112</a></div>
 <div class="card" style="margin-top:22px"><ul class="checks"><li><span class="c">${ic("info","s")}</span><span>Des courbatures légères 24 à 48 h après sont fréquentes.</span></li><li><span class="c">${ic("info","s")}</span><span>MOVENTHY ne remplace pas un avis médical et ne propose pas de rééducation.</span></li><li><span class="c">${ic("info","s")}</span><span>Arrêter une séance n'est jamais bloqué, rien n'est à rattraper.</span></li></ul></div>
 ${o.urgent ? `<div class="foot"><button class="btn ghost" data-a="back">Continuer vers le bilan</button></div>` : ""}`;

/* ================= EXPLORER ================= */
let EXV = {tab:"events", q:"", sport:"all", period:"all", free:false, beginner:false, dep:"all", cat:"all", noEq:false, noFloor:false};
function vExplore(){
 let h = `<p class="eyebrow">Courses, marches, exercices</p><h1>Explorer</h1><div class="seg" role="tablist">${[["events","Événements"],["ex","Exercices"],["disc","Séances"]].map(([k,l]) => `<button role="tab" aria-selected="${EXV.tab===k}" data-a="exv" data-v="${k}">${l}</button>`).join("")}</div>`;
 if (EXV.tab==="events") h += eventsView(); else if (EXV.tab==="ex") h += exercisesView(); else h += disciplinesView();
 return h;
}
const fchip = (key, v, l) => `<button class="chip sm" aria-pressed="${String(EXV[key])===String(v)}" data-a="exf" data-k="${key}" data-v="${v}">${l}</button>`;
const ftog = (key, l) => `<button class="chip sm" aria-pressed="${!!EXV[key]}" data-a="exft" data-k="${key}">${l}</button>`;
function evDate(e){ const d = e.date ? pd(e.date) : null; return d ? `<span class="dt">${MONTHS[d.getMonth()]}<b>${d.getDate()}</b></span>` : `<span class="dt u">Date à confirmer</span>`; }
function eventsView(){
 const t = T(), evs = allEvents().filter(e => {
  if (EXV.sport!=="all" && e.sport!==EXV.sport) return false;
  if (EXV.free && e.price) return false;
  if (EXV.beginner && !/bienvenu|tous niveaux/i.test(e.lvl||"")) return false;
  if (EXV.dep!=="all" && e.dep!==EXV.dep) return false;
  if (EXV.period!=="all"){ if (!e.date || diffD(t, e.date) > +EXV.period) return false; }
  if (e.date && e.date < t) return false;
  if (EXV.q){ const q = EXV.q.toLowerCase(); if (!`${e.t} ${e.city} ${e.fmt} ${e.kind}`.toLowerCase().includes(q)) return false; }
  return true;
 }).sort((a,b) => (a.date||"9999").localeCompare(b.date||"9999"));
 const deps = [...new Set(allEvents().map(e => e.dep).filter(d => d && d!=="—"))].sort();
 return `<label class="field" style="margin-top:0"><span class="sr">Rechercher</span><input class="input" type="search" placeholder="Ville, format…" value="${esc(EXV.q)}" data-in="q"></label>
 <div class="chips scroll">${fchip("sport","all","Tous")}${fchip("sport","course","Course")}${fchip("sport","marche","Marche")}${fchip("sport","hybride","Hybride")}${ftog("free","Gratuit")}${ftog("beginner","Débutant")}${fchip("period","30","30 jours")}${fchip("period","90","3 mois")}${EXV.period!=="all" ? fchip("period","all","Toutes dates") : ""}</div>
 <label class="field"><span class="sr">Département</span><select class="input" data-in="dep"><option value="all">Tous les départements</option>${deps.map(d => `<option value="${d}" ${EXV.dep===d ? "selected" : ""}>Département ${d}</option>`).join("")}</select></label>
 <div class="note">${ic("info")}<div>Exemples fictifs pour tester. Ajoute tes événements, ou consulte les calendriers officiels plus bas.</div></div>
 ${evs.length ? evs.map(evCard).join("") : `<p class="sub">Aucun événement avec ces filtres.</p>`}
 <button class="btn ghost" data-a="addEvent" style="margin-top:6px">${ic("plus")} Ajouter mon événement</button>
 <h2>Vrais calendriers</h2><div class="card flat">${REAL_SOURCES.map(s => `<a class="rowi" href="${s.u}" target="_blank" rel="noopener noreferrer"><span class="t"><b>${esc(s.t)}</b><span>Site externe</span></span><span class="go">${ic("ext","s")}</span></a>`).join("")}</div>`;
}
function evCard(e){
 const fav = S.favs.includes(e.id);
 return `<div style="position:relative"><button class="ev ${e.status==="cancelled" ? "cancel" : ""}" data-a="evOpen" data-id="${e.id}">${evDate(e)}
  <span class="t" style="padding-right:40px"><b>${esc(e.t)}</b><span>${esc(e.fmt||"")} · ${esc(e.city)} · ${e.price ? e.price + " €" : "gratuit"}</span>
  ${e.status==="cancelled" ? `<span class="st d">Annulé</span>` : e.status==="unknown" ? `<span class="st w">Date à confirmer</span>` : e.mine ? `<span class="st">Ajouté par toi</span>` : `<span class="st">Exemple</span>`}</span></button>
  <button class="ib fav ${fav ? "on" : ""}" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);width:40px;height:40px;background:transparent;border:0;color:${fav ? "var(--acc)" : "var(--sub)"}" data-a="fav" data-id="${e.id}" aria-label="${fav ? "Retirer des favoris" : "Ajouter aux favoris"}" aria-pressed="${fav}">${ic("star")}</button></div>`;
}
OVK.event = o => {
 const e = evById(o.id); if (!e) return `<div class="ovh">${backBtn()}</div><p>Événement introuvable.</p>`;
 const row = (l, v) => `<div class="rowi"><span class="t"><span>${l}</span><b>${v}</b></span></div>`;
 return `<div class="shead"><div class="ovh" style="margin-bottom:6px">${backBtn()}</div>
  <span class="tag">${e.demo ? "Exemple fictif" : "Ajouté par toi"}</span><h1>${esc(e.t)}</h1><p class="meta">${esc(e.city)}${e.dep && e.dep!=="—" ? ` (${e.dep})` : ""} · ${esc(e.kind || DISC[e.sport].t)}</p>
  <div class="stats"><div><span>Date</span><b>${e.date ? fmtD(e.date) : "À confirmer"}</b></div><div><span>Format</span><b>${esc(e.fmt || "—")}</b></div><div><span>Prix</span><b>${e.price ? e.price + " €" : "Gratuit"}</b></div></div></div>
 ${e.status==="cancelled" ? `<div class="note danger" style="margin-top:18px">${ic("x")}<div><b>Annulé</b>Le statut a été mis à jour par la source.</div></div>` : ""}
 ${e.status==="unknown" || !e.date ? `<div class="note warn" style="margin-top:18px">${ic("info")}<div><b>Date non confirmée</b>On n'invente jamais une date : prépare la discipline sans date en attendant.</div></div>` : ""}
 <div class="card flat" style="margin-top:18px">${row("Niveau indicatif", esc(e.lvl || "Non précisé"))}${row("Accessibilité déclarée", esc(e.access || "Non précisée"))}${row("Source", e.demo ? "Démonstration · non vérifié" : "Saisi par toi")}</div>
 ${e.mine && e.url ? `<a class="btn ghost mt" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${ic("ext")} Lien d'inscription</a><p class="xs sub mt">Lien saisi par toi : vérifie qu'il s'agit du site officiel.</p>`
  : `<p class="small sub mt">${e.demo ? "Pas de lien d'inscription pour un exemple. Sur un vrai événement, ce bouton mènera au site officiel vérifié." : ""}</p>`}
 ${e.mine ? `<button class="link" data-a="delEvent" data-id="${e.id}">Supprimer cet événement</button>` : ""}
 <div class="foot"><button class="btn" data-a="prepEv" data-id="${e.id}" ${e.status==="cancelled" ? "disabled" : ""}>${ic("flag")} Préparer cet événement</button></div>`;
};
function exercisesView(){
 const cats = [["all","Tous"],["renfo","Renfo"],["cardio","Cardio"],["mobilite","Mobilité"],["allure","Allures"]];
 const list = EX.filter(e => (EXV.cat==="all" || e.d===EXV.cat) && (!EXV.noEq || (!e.eq && !e.any)) && (!EXV.noFloor || !e.sol));
 return `<div class="chips scroll" style="margin-bottom:16px">${cats.map(([k,l]) => fchip("cat", k, l)).join("")}${ftog("noEq","Sans matériel")}${ftog("noFloor","Sans sol")}</div>
 <div class="exg">${list.map(e => `<button class="exc" data-a="ex" data-id="${e.id}"><div class="th">${exThumb(e)}</div><b>${esc(e.n)}</b><span>${LVL_T[e.l]}${e.eq || e.any ? " · matériel" : ""}</span></button>`).join("")}</div>
 <p class="xs sub mt">${plural(list.length,"fiche")} · ${VALID}.</p>`;
}
function disciplinesView(){
 return `<div class="hero" style="margin-bottom:12px"><span class="tag">15 minutes</span><div class="ttl">Une séance pour essayer</div><p class="meta">Sans matériel, sans engagement.</p></div>
 <div class="card flat">${DISC_ORDER.map(k => `<button class="rowi" data-a="quick" data-v="${k}" data-m="15"><span class="go" style="width:46px;height:46px;border-radius:50%;color:var(--acc-ink)">${ic(typeIcon(k))}</span><span class="t"><b>${DISC[k].t}</b><span>${DISC[k].s}</span></span>${ic("play","s")}</button>`).join("")}</div>
 <h2>Bientôt</h2><div class="card"><p>Trail, semi-marathon, vélo, randonnée, fitness races, natation, triathlon, raquettes, escalade, danse…</p><p class="small sub mt">Chaque discipline sera construite avec des professionnels qualifiés.</p></div>`;
}

/* ================= PROGRESSION ================= */
function vProgress(){
 const t = T(), cw = monday(t);
 const hist = S.sessions.filter(s => s.status==="done" || s.status==="partial");
 const minOf = s => s.doneMin != null ? s.doneMin : s.minutes;
 let h = `<p class="eyebrow">Semaine du ${fmtD(cw)}</p><h1>Ma progression</h1>`;
 if (!hist.length && !S.onboarded) return h + `<div class="hero"><div class="ttl">Tout commence ici</div><p class="meta">Tes minutes, ta régularité et tes paliers apparaîtront après ta première séance.</p><button class="btn" data-a="quick" data-v="marche" data-m="15">Première séance</button></div>`;
 const weeks = []; for (let i=7; i>=0; i--){ const ws = addD(cw, -7*i); const ss = hist.filter(s => s.date >= ws && s.date <= addD(ws,6)); weeks.push({ws, min: ss.reduce((a,s) => a+minOf(s),0), n: ss.length}); }
 const cur = weeks[7].min, prev = weeks[6].min, delta = cur - prev;
 const past = S.sessions.filter(s => s.plan && ["done","partial","missed","skipped"].includes(s.status));
 const ok = past.filter(s => s.status==="done" || s.status==="partial").length;
 const pct = past.length ? Math.round(ok/past.length*100) : null;
 const max = Math.max(30, ...weeks.map(w => w.min));
 h += `<div class="tiles two"><div class="tile hi"><span style="margin:0">Minutes</span><b>${cur}</b><span>${delta > 0 && prev ? "+" + delta + " vs sem. passée" : "cette semaine"}</span></div>
  <div class="tile"><span style="margin:0">Assiduité</span><b>${pct==null ? "—" : pct + " %"}</b><span>${pct==null ? "après ta 1re semaine" : `${ok} séances sur ${past.length}`}</span></div></div>`;
 h += `<div class="card" style="margin-top:12px"><h3>Minutes par semaine</h3><div class="bars" style="margin-top:16px" role="img" aria-label="Minutes par semaine sur 8 semaines : ${weeks.map(w => w.min).join(", ")}">${weeks.map((w,i) => `<div class="b ${i===7 ? "cur" : ""}"><em>${w.min || ""}</em><span class="tr"><i style="height:${(w.min/max*100).toFixed(0)}%"></i></span><span>${i===7 ? "Auj." : pd(w.ws).getDate() + "/" + (pd(w.ws).getMonth()+1)}</span></div>`).join("")}</div></div>`;
 if (S.plan){
  const types = [...new Set((S.profile.disc||[]).concat(S.sessions.filter(s => s.plan).map(s => s.type)))].filter(k => TYPES[k]);
  h += `<div class="card"><h3>Paliers</h3>${types.map(k => `<div class="lv"><span class="n">${TYPES[k].t}</span><span class="tr"><i style="width:${S.plan.stage[k]*10}%"></i></span><span class="v">${S.plan.stage[k]}</span></div>`).join("")}<p class="xs sub">Un palier monte après une semaine bien remplie sans séance trop dure.</p></div>`;
  const hz = S.profile.horizon;
  if ((hz.type==="event" || hz.type==="date") && hz.date){
   const tot = Math.max(1, diffD(S.plan.cycleStart, hz.date)), done = clamp(diffD(S.plan.cycleStart, t), 0, tot), p = done/tot;
   h += `<div class="card"><div class="ringk"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="42" fill="none" stroke="var(--card2)" stroke-width="10"/><circle cx="50" cy="50" r="42" fill="none" stroke="var(--acc)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${(2*Math.PI*42*p).toFixed(1)} 400"/></svg><div><span class="sub small">Vers ton objectif</span><h3 style="margin:2px 0">${esc(hz.name || "Date cible")}</h3><span class="sub small">${fmtLong(hz.date)} · ${Math.round(p*100)} % du chemin</span></div></div></div>`;
  }
 }
 const hl = S.sessions.filter(s => s.status!=="planned").sort((a,b) => b.date.localeCompare(a.date)).slice(0, 20);
 h += `<h2>Historique</h2>${hl.length ? `<div class="card flat">${hl.map(s => `<button class="rowi ${s.status==="cancelled" || s.status==="missed" || s.status==="skipped" ? "off" : ""}" data-a="sess" data-id="${s.id}"><span class="go" style="width:42px;height:42px;border-radius:50%;color:var(--acc-ink)">${ic(typeIcon(s.type))}</span><span class="t"><b>${esc(s.title)}</b><span>${fmtD(s.date)} · ${STATUS[s.status]}${s.rpe ? " · " + RPE[s.rpe-1].toLowerCase() : ""}</span></span><span class="v">${s.status==="done" || s.status==="partial" ? minOf(s) + " min" : ""}</span></button>`).join("")}</div>` : `<p class="sub">Rien pour l'instant.</p>`}
 <p class="xs sub mt">Une séance manquée n'est jamais rattrapée de force : on repart de la suivante.</p>`;
 return h;
}

/* ================= PROFIL ================= */
const PERSONAS = {
 camille:{t:"Camille, 23 ans", s:"Reprise · 20 min chez elle · sans matériel",
  p:{name:"Camille", intent:"reprendre", intent2:null, disc:["renfo","mobilite"], level:"debutant", recent:[], ease:2, days:[0,2,5], minutes:20, places:["maison"], equip:{maison:[], exterieur:[], salle:GYM_DEFAULT.slice()}, dayPlace:{}, perDay:false, prefs:{noImpact:false, noFloor:false}, horizon:{type:"none"}}},
 alex:{t:"Alex, 34 ans", s:"Premier défi · haltères · 5 km dans 9 semaines",
  p:{name:"Alex", intent:"evenement", intent2:null, disc:["course","renfo"], level:"reprise", recent:["Course"], ease:3, days:[1,3,5,6], minutes:30, places:["maison","exterieur"], equip:{maison:["halteres"], exterieur:[], salle:GYM_DEFAULT.slice()}, dayPlace:{}, perDay:false, prefs:{noImpact:false, noFloor:false}, horizon:{type:"event", id:"d1"}}},
 morgan:{t:"Morgan, 49 ans", s:"Marche et mobilité · sans impact ni sol",
  p:{name:"Morgan", intent:"bouger", intent2:null, disc:["marche","mobilite"], level:"debutant", recent:["Marche"], ease:3, days:[0,2,4,6], minutes:30, places:["exterieur","maison"], equip:{maison:["chaise"], exterieur:[], salle:GYM_DEFAULT.slice()}, dayPlace:{}, perDay:false, prefs:{noImpact:true, noFloor:true}, horizon:{type:"none"}}}
};
const DEFAULT_P = {equip:{maison:[], exterieur:[], salle:GYM_DEFAULT}, prefs:{}, places:["maison","exterieur"], level:"debutant", ease:3};
function vProfile(){
 const s = S.settings, p = S.profile;
 const tg = (k, l, sub) => `<button class="toggle" role="switch" aria-checked="${!!s[k]}" data-a="set" data-k="${k}"><span class="t"><b>${l}</b>${sub ? `<br><span>${sub}</span>` : ""}</span><span class="sw"></span></button>`;
 const row = (a, v, t1, t2, extra) => `<button class="rowi" data-a="${a}" ${v!=null ? `data-v="${v}"` : ""} ${extra||""}><span class="t"><b>${t1}</b>${t2 ? `<span>${t2}</span>` : ""}</span><span class="go">${ic("chev","s")}</span></button>`;
 const a = S.account;
 let h = `<div class="top">${MARK}<div class="hi"><span>Profil</span><b>${a ? esc(a.first + (a.last ? " " + a.last : "")) : "Sans compte"}</b></div></div>`;
 h += a && S.loggedIn ? `<div class="card flat">${row("account",null,"Mes informations", esc(a.email))}${row("logout",null,"Se déconnecter","Tes données restent sur ce téléphone")}</div><h2>Mon programme</h2>`
  : `<div class="hero" style="margin-bottom:12px"><div class="ttl">Crée ton compte</div><p class="meta">Pour un programme qui s'adapte à toi et garder ta progression.</p><button class="btn" data-a="signup">Créer un compte</button><button class="link" style="display:block;margin:8px auto 0" data-a="login">J'ai déjà un compte</button></div>`;
 if (p && S.loggedIn) h += `<div class="card flat">
  ${row("edit",1,"Objectif", esc(goalText(p)) + " · " + p.disc.map(k => DISC[k].t).join(", "))}
  ${row("edit",2,"Rythme", `${LEVELS.find(l => l.id===p.level).t} · ${p.days.length} jours · ${p.minutes} min`)}
  ${row("edit",3,"Lieux et matériel", p.places.map(x => PLACES[x]).join(", "))}
  ${row("edit",4,"Échéance", esc(horizonText(p)))}</div>`;
 else if (S.loggedIn) h += `<div class="hero"><div class="ttl">Pas encore de programme</div><button class="btn" data-a="startOnb">Créer mon programme</button></div>`;
 h += `<h2>Affichage</h2><div class="card">
  <div class="row"><span style="flex:1"><b>Taille du texte</b><br><span class="sub small">${Math.round(s.scale*100)} %</span></span><button class="ib" data-a="scale" data-v="-1" aria-label="Réduire le texte">${ic("minus")}</button><button class="ib" data-a="scale" data-v="1" aria-label="Agrandir le texte">${ic("plus")}</button></div>
  <div class="seg" role="radiogroup" style="margin:16px 0 4px">${[["dark","Sombre"],["light","Clair"],["auto","Auto"]].map(([k,l]) => `<button role="radio" aria-selected="${s.theme===k}" aria-checked="${s.theme===k}" data-a="theme" data-v="${k}">${l}</button>`).join("")}</div>
  ${tg("hc","Contraste renforcé")}${tg("motion","Animations","Démonstrations animées")}${tg("voice","Voix","Annonce de chaque étape")}${tg("sound","Bips")}${tg("vibrate","Vibrations")}</div>
 <h2>Données et sécurité</h2><div class="card flat">
  ${row("privacy",null,"Mes données","Sur ce téléphone uniquement")}
  ${row("export",null,"Exporter","Fichier JSON")}
  ${row("safety",null,"Sécurité","Quand arrêter, qui appeler")}
  ${row("wipe",null,S.account ? "Supprimer mon compte" : "Tout supprimer","Compte, programme et historique · définitif","style=\"color:var(--danger)\"")}</div>
 <div class="card mt"><b>Version de test</b><p class="small sub" style="margin-top:4px">Tout est ouvert pendant le test. Rappels de séance : bientôt.</p></div>
 <h2>Mode test</h2><div class="card flat">
  <p class="small sub" style="padding-top:14px">Chaque profil relance l'inscription (prénom, nom, e-mail, mot de passe, date de naissance), puis le questionnaire pré-rempli. Le compte de test remplace celui de ce téléphone.</p>
  ${row("persona","","Nouveau testeur","Parcours vierge, toutes les questions")}
  ${Object.entries(PERSONAS).map(([k,v]) => row("persona",k,v.t,v.s)).join("")}
  <div style="padding:14px 0"><p class="small"><b>${S.simOffset ? "Date simulée" : "Aujourd'hui"} :</b> ${fmtLong(T())}</p>
  <div class="chips mt"><button class="chip sm" data-a="sim" data-v="1">+1 jour</button><button class="chip sm" data-a="sim" data-v="7">+1 semaine</button><button class="chip sm" data-a="sim" data-v="14">+2 semaines</button>${S.simOffset ? `<button class="chip sm" data-a="sim" data-v="0">Revenir</button>` : ""}</div></div></div>
 <p class="xs sub" style="margin-top:22px;text-align:center">MOVENTHY ${VERSION} · prototype · nom de travail<br>Contenus en attente de validation par un coach · réservé aux adultes<br>Move. Grow. Evolve.</p>`;
 return h;
}

/* ================= GESTIONNAIRES ================= */
const phaseHL = cont => i => { const box = $(cont); if (box) box.querySelectorAll("[data-ph]").forEach((p,j) => p.classList.toggle("on", j===i)); };
const A = {};
A.adapt = el => { const s = findS(el.dataset.id); if (s) adaptMenu(s); };
A.adTime = () => { const s = ADP.s, opts = DURATIONS.filter(m => m < s.minutes);
 openSheet(`<h3>Combien de temps as-tu ?</h3><p class="small sub">L'échauffement et le retour au calme restent inclus.</p><div class="chips">${opts.length ? opts.map(m => `<button class="chip" data-a="adTimeSel" data-v="${m}">${m} min</button>`).join("") : `<p class="sub">C'est déjà la version la plus courte (10 min).</p>`}</div><button class="btn ghost" data-a="adBack" style="margin-top:14px">Retour</button>`); };
A.adTimeSel = el => { const m = +el.dataset.v; previewSheet(rebuild(S, ADP.s, {minutes: m}), `Version courte : ${m} min le ${fmtD(ADP.s.date)}`); };
A.adPlace = () => { const s = ADP.s;
 openSheet(`<h3>Où vas-tu pratiquer ?</h3><div class="chips">${Object.entries(PLACES).filter(([k]) => k!==s.place).map(([k,l]) => `<button class="chip" data-a="adPlaceSel" data-v="${k}">${l}</button>`).join("")}</div><p class="small sub" style="margin-top:10px">Les variantes sont choisies selon l'objectif de la séance et le matériel du lieu.</p><button class="btn ghost" data-a="adBack" style="margin-top:8px">Retour</button>`); };
A.adPlaceSel = el => { const v = el.dataset.v, s = ADP.s; const n = rebuild(S, s, {place: v, forcedPlace: true});
 const extra = v==="salle" && (s.type==="course" || s.type==="marche") && n.type===s.type ? "Version sur tapis de course." : null;
 previewSheet(n, `Lieu changé : ${PLACES[v].toLowerCase()} le ${fmtD(s.date)}`, extra); };
A.adMiss = () => { const s = ADP.s; ADP.miss = [];
 if (!s.equipUsed.length) return openSheet(`<h3>Matériel</h3><p>Cette séance ne demande aucun matériel.</p><button class="btn ghost" data-a="adBack">Retour</button>`);
 openSheet(`<h3>Qu'est-ce qui manque ?</h3><div class="chips" id="missChips">${s.equipUsed.map(e => `<button class="chip" aria-pressed="false" data-a="adMissT" data-v="${e}">${EQUIP[e]}</button>`).join("")}</div><div class="btns"><button class="btn ghost" data-a="adBack">Retour</button><button class="btn" data-a="adMissOk">Voir la variante</button></div>`); };
A.adMissT = el => { const v = el.dataset.v, i = ADP.miss.indexOf(v); if (i>=0) ADP.miss.splice(i,1); else ADP.miss.push(v); el.setAttribute("aria-pressed", i<0); };
A.adMissOk = () => { if (!ADP.miss.length) return toast("Choisis au moins un élément"); const s = ADP.s;
 previewSheet(rebuild(S, s, {missing: (s.missing||[]).concat(ADP.miss)}), `Variante sans ${ADP.miss.map(e => EQUIP[e].toLowerCase()).join(", ")}`); };
A.adMove = () => { const s = ADP.s, opts = moveOptions(S, s);
 openSheet(`<h3>Déplacer à quel jour ?</h3><p class="small sub">Uniquement cette semaine, sur un jour libre.</p>${opts.length ? opts.map(o => `<button class="rowi ${o.busy ? "off" : ""}" ${o.busy ? "disabled" : `data-a="adMoveSel" data-v="${o.date}"`}><span class="t"><b>${DOWL[dow(o.date)]} ${pd(o.date).getDate()}${o.date===T() ? " · aujourd'hui" : ""}</b><span>${o.busy ? "Déjà une séance ce jour-là" : o.warn ? "Possible, mais à côté d'une autre séance intense" : "Compatible avec la récupération"}</span></span></button>`).join("") : `<p class="sub">Plus de jour libre cette semaine. Tu peux retirer la séance sans rattrapage.</p>`}<button class="btn ghost" data-a="adBack">Retour</button>`); };
A.adMoveSel = el => { const d = el.dataset.v, o = moveOptions(S, ADP.s).find(x => x.date===d);
 const p = S.profile, place = (p.dayPlace && p.dayPlace[dow(d)]) || ADP.s.place;
 previewSheet(rebuild(S, ADP.s, {date: d, place}), `Séance déplacée du ${fmtD(ADP.s.date)} au ${fmtD(d)}`, o && o.warn ? "Attention : une séance intense est prévue la veille ou le lendemain. La version reste possible, écoute tes sensations." : null); };
A.adRep = () => { const s = ADP.s, types = ["marche","course","renfo","mobilite","hybride"].filter(k => k!==s.type && !(k==="course" && S.profile.prefs.noImpact));
 openSheet(`<h3>Remplacer par…</h3><div class="chips">${types.map(k => `<button class="chip" data-a="adRepSel" data-v="${k}">${ic(typeIcon(k),"s")} ${TYPES[k].t}</button>`).join("")}</div><button class="btn ghost" data-a="adBack" style="margin-top:14px">Retour</button>`); };
A.adRepSel = el => { const k = el.dataset.v; previewSheet(rebuild(S, ADP.s, {type: k, stage: S.plan.stage[k] || ADP.s.stage}), `${TYPES[ADP.s.type].t} remplacé par ${TYPES[k].t.toLowerCase()} le ${fmtD(ADP.s.date)}`); };
A.adCancel = () => openSheet(`<h3>Retirer cette séance ?</h3><p>Pas de culpabilité : elle ne sera pas rattrapée ni ajoutée ailleurs. Tu reprends simplement à la séance suivante.</p><div class="btns"><button class="btn ghost" data-a="adBack">Retour</button><button class="btn" data-a="adCancelOk">Retirer</button></div>`);
A.adCancelOk = () => { const s = ADP.s; s.status = "cancelled"; s.reason = "Retirée, sans rattrapage"; logChange(S, `Séance du ${fmtD(s.date)} retirée, sans rattrapage`); save(); closeSheet(); OV = OV.filter(o => o.k!=="sess"); render(); toast("Séance retirée"); };
A.adBack = () => adaptMenu(ADP.s);
A.adOk = () => { replaceSession(S, ADP.s, ADP.newS, ADP.reason); save(); closeSheet(); OV = OV.filter(o => o.k!=="sess"); render(); toast("Séance mise à jour"); };

A.plPause = () => { if (PL.paused){ PL.t0 = performance.now(); PL.paused = false; } else { PL.acc = elapsed(); PL.paused = true; try { speechSynthesis.cancel(); } catch(e){} } renderOv(); };
A.plNext = () => goStep(PL.i + 1);
A.plPrev = () => goStep(PL.i - 1);
A.plVar = el => { if (el.dataset.v) PL.swap[PL.i] = el.dataset.v; else delete PL.swap[PL.i]; renderOv(); announce(); };
A.plStop = () => { if (!PL.paused) A.plPause();
 openSheet(`<h3>Arrêter la séance ?</h3><p class="sub">Aucun souci, ce qui est fait compte.</p>
 <div class="stack"><button class="btn" data-a="plResume">Reprendre</button><button class="btn ghost" data-a="plQuit">J'arrête là, tout va bien</button><button class="btn danger" data-a="plHurt">${ic("shield")} Je ressens une douleur ou un malaise</button></div>`); };
A.plResume = () => { closeSheet(); A.plPause(); };
A.plQuit = () => { closeSheet(); finishPlayer(false); };
A.plHurt = () => { closeSheet(); finishPlayer(false); pushOv("safety", {urgent:true}); };

A.finSt = el => { FIN.status = el.dataset.v; renderOv(); };
A.finRpe = el => { const v = +el.dataset.v; FIN.rpe = FIN.rpe===v ? null : v; renderOv(); };
A.finSave = () => {
 const s = PL.s, sec = PL.result.sec;
 s.status = FIN.status; s.rpe = FIN.rpe; s.doneMin = Math.round(sec/60);
 if (!s.plan){ s.date = T(); if (s.status!=="skipped" && !S.sessions.includes(s)) S.sessions.push(s); QUICK = null; }
 S.sessions.sort((a,b) => a.date.localeCompare(b.date));
 save(); PL = null; OV = []; TAB = "today"; render();
 if (s.rpe===5 && s.plan){
  openSheet(`<h3>Séance trop difficile</h3><p>Merci de l'avoir signalé. On ajuste, sans pénalité.</p>
  <div class="stack"><button class="btn" data-a="hard" data-v="lighten" data-id="${s.id}">Alléger les prochaines séances de ${TYPES[s.type].t.toLowerCase()}</button><button class="btn ghost" data-a="hard" data-v="rest" data-id="${s.id}">Ajouter de la récupération</button><button class="btn ghost" data-a="closeSheet">Garder le programme tel quel</button></div>
  <p class="xs sub" style="margin-top:12px">Douleur inhabituelle, malaise ou essoufflement anormal : demande un avis médical. Urgence : 15 ou 112.</p>`);
 } else toast(s.status==="skipped" ? "C'est noté, sans rattrapage" : "Séance enregistrée. Bravo !");
};
A.hard = el => { const s = findS(el.dataset.id);
 if (el.dataset.v==="lighten"){ lightenAfterHard(S, s); toast("Prochaines séances allégées"); }
 else { toast(restAfterHard(S, s) ? "Récupération ajoutée" : "Pas de séance dans les 2 jours : repos déjà prévu"); }
 save(); closeSheet(); render(); };

A.goLive = () => goLive();
A.planw = el => { PLANV = "week"; WKOFF = +el.dataset.v; render(); };
/* ================= ACTIONS ================= */
A.tab = el => { TAB = el.dataset.v; WKOFF = 0; render(); window.scrollTo(0,0); $("view").focus({preventScroll:true}); };
A.back = () => popOv();
A.closeSheet = () => closeSheet();
A.startOnb = () => { if (!S.loggedIn) return A.signup(); startOnb(1, false, S.account ? {name: S.account.first} : null); };
let TEST = false;
A.signup = () => { if (!SU || !OV.some(o => o.k==="signup")) SU = newSU(); closeSheet(); OV = OV.filter(o => o.k!=="login" && o.k!=="signup"); pushOv("signup"); };
A.login = () => { SU = newSU(); if (S.account) SU.email = S.account.email; OV = OV.filter(o => o.k!=="login" && o.k!=="signup"); pushOv("login"); };
A.suBack = () => { OV = OV.filter(o => o.k!=="login" && o.k!=="signup"); PRESET = null; TEST = false; render(); };
A.suT = el => { const k = el.dataset.k; SU[k] = !SU[k]; if (k==="cgu") delete SU.err.cgu; renderOv(); };
A.suShow = () => { SU.show = !SU.show; renderOv(); const i = $("su_pw"); if (i){ i.focus(); const n = i.value.length; try { i.setSelectionRange(n,n); } catch(e){} } };
A.discoverAsk = () => openSheet(`<h3>Explorer sans compte</h3><p class="lead">Séances découverte, fiches exercices et événements sont ouverts sans compte. Ton programme personnalisé, lui, demande un compte.</p><div class="stack"><button class="btn" data-a="discover">J'ai 18 ans ou plus, continuer</button><button class="btn ghost" data-a="closeSheet">Retour</button></div>`);
A.discover = () => { S.adult = true; S.discovery = true; save(); closeSheet(); OV = []; render(); };
A.cgu = () => openSheet(`<h3>Conditions d'utilisation</h3><p class="lead">Version de test, document provisoire.</p>
 <div class="card"><ul class="checks">
 <li><span class="c">${ic("info","s")}</span><span>MOVENTHY est un prototype de coaching sportif réservé aux adultes. Il ne remplace pas un avis médical et ne propose pas de rééducation.</span></li>
 <li><span class="c">${ic("info","s")}</span><span>Les contenus sont en cours de validation par des coachs qualifiés. Arrête toute séance en cas de douleur ou de malaise.</span></li>
 <li><span class="c">${ic("info","s")}</span><span>Pendant le test, toutes les fonctions sont gratuites. Aucun paiement n'est demandé ni enregistré.</span></li>
 <li><span class="c">${ic("info","s")}</span><span>Tu peux exporter ou supprimer ton compte et tes données à tout moment depuis Profil.</span></li></ul></div>
 <button class="btn ghost mt" data-a="closeSheet">Fermer</button>`);
A.suOk = async () => {
 const e = {}, f = SU;
 if (!f.first.trim()) e.first = "Indique ton prénom.";
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Cette adresse e-mail ne semble pas valide.";
 if (f.pw.length < 8 || !/\d/.test(f.pw)) e.pw = "8 caractères minimum, dont au moins un chiffre.";
 if (!f.birth) e.birth = "Indique ta date de naissance.";
 else if (ageOf(f.birth) < 18) e.birth = "MOVENTHY est réservé aux adultes pour le moment.";
 else if (ageOf(f.birth) > 110) e.birth = "Vérifie l'année de naissance.";
 if (!f.cgu) e.cgu = "Accepte les conditions d'utilisation pour continuer.";
 if (!TEST && S.account && S.account.email.toLowerCase()!==f.email.trim().toLowerCase() && !e.email) e.email = "Un compte existe déjà sur ce téléphone. Connecte-toi, ou supprime-le depuis Profil.";
 SU.err = e;
 if (Object.keys(e).length){ renderOv(); const k = Object.keys(e)[0]; const el = $("su_" + k); if (el) el.focus(); toast("Vérifie les champs indiqués"); return; }
 const email = f.email.trim().toLowerCase();
 S.account = {first: f.first.trim(), last: f.last.trim(), email, birth: f.birth, pw: await hashPw(f.pw, email), news: f.news, cguAt: new Date().toISOString(), createdAt: T()};
 S.adult = true; S.loggedIn = true; S.discovery = false; save();
 const preset = Object.assign(PRESET ? clone(PRESET) : {}, {name: S.account.first});
 const wasTest = TEST; PRESET = null; TEST = false; SU = null;
 OV = []; startOnb(1, false, preset); ONB.test = wasTest; renderOv();
 toast(`Bienvenue ${S.account.first} !`);
};
A.loginOk = async () => {
 const email = SU.email.trim().toLowerCase();
 if (!S.account || S.account.email!==email || S.account.pw !== await hashPw(SU.pw, email)){ SU.err = {login: S.account ? "E-mail ou mot de passe incorrect." : "Aucun compte n'existe sur ce téléphone. Crée-en un pour commencer."}; renderOv(); return; }
 S.loggedIn = true; S.discovery = false; save(); SU = null;
 OV = []; if (S.onboarded && S.profile){ TAB = "today"; render(); toast(`Bonjour ${S.account.first}`); } else startOnb(1, false, {name: S.account.first});
};
A.forgot = () => openSheet(`<h3>Mot de passe oublié</h3><p class="lead">En version de test, le compte est stocké sur ce téléphone, sans serveur : pas de récupération par e-mail. Tu peux tout effacer et recréer un compte.</p><div class="stack"><button class="btn danger" data-a="wipeOk">Effacer et recommencer</button><button class="btn ghost" data-a="closeSheet">Retour</button></div>`);
A.logout = () => openSheet(`<h3>Se déconnecter ?</h3><p class="lead">Ton programme et ton historique restent sur ce téléphone. Tu les retrouveras en te reconnectant.</p><div class="btns"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn" data-a="logoutOk">Se déconnecter</button></div>`);
A.logoutOk = () => { S.loggedIn = false; S.discovery = false; save(); closeSheet(); OV = []; TAB = "today"; render(); };
A.account = () => { const a = S.account;
 openSheet(`<h3>Mes informations</h3>
 <div class="row" style="gap:10px"><label class="field" style="flex:1"><span>Prénom</span><input class="input" id="ac_first" value="${esc(a.first)}" maxlength="30" autocomplete="given-name"></label><label class="field" style="flex:1"><span>Nom</span><input class="input" id="ac_last" value="${esc(a.last)}" maxlength="40" autocomplete="family-name"></label></div>
 <label class="field"><span>E-mail</span><input class="input" id="ac_email" type="email" value="${esc(a.email)}" maxlength="80" autocomplete="email"></label>
 <button class="toggle" role="switch" aria-checked="${!!a.news}" data-a="acNews"><span class="t"><b>Nouveautés par e-mail</b><br><span>Facultatif, modifiable à tout moment</span></span><span class="sw"></span></button>
 <p class="xs sub">Date de naissance : ${fmtLong(a.birth)} · compte créé le ${fmtD(a.createdAt)}</p>
 <div class="btns mt"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn" data-a="acSave">Enregistrer</button></div>`); };
A.acNews = el => { const on = el.getAttribute("aria-checked")!=="true"; el.setAttribute("aria-checked", on); };
A.acSave = () => { const v = id => ($(id).value||"").trim(), email = v("ac_email").toLowerCase();
 if (!v("ac_first")) return toast("Indique ton prénom");
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast("E-mail non valide");
 if (email!==S.account.email) return toast("Pour changer d'e-mail, recrée un compte (version de test)");
 S.account.first = v("ac_first"); S.account.last = v("ac_last"); S.account.news = document.querySelector('[data-a="acNews"]').getAttribute("aria-checked")==="true";
 if (S.profile) S.profile.name = S.account.first; save(); closeSheet(); render(); toast("Informations enregistrées"); };
A.d = el => {
 const f = el.dataset.f, m = el.dataset.m, d = ONB.d; let v = el.dataset.v;
 const cur = getP(d, f), num = v!=="" && !isNaN(v) && !["intent","intent2","level","places","disc","horizon.type","horizon.sport"].includes(f) && !f.startsWith("equip") && !f.startsWith("dayPlace");
 if (num) v = +v;
 if (m==="multi"){ const a = (cur||[]).slice(), i = a.indexOf(v); if (i>=0) a.splice(i,1); else a.push(v); setP(d, f, a); }
 else if (m==="toggle") setP(d, f, !cur);
 else if (m==="single2") setP(d, f, cur===v ? null : v);
 else setP(d, f, v);
 if (f==="intent" && d.intent2===v) d.intent2 = null;
 if (f==="intent" && v==="evenement" && d.horizon.type==="none") d.horizon = {type:"event"};
 if (f==="horizon.type"){ const ty = v; d.horizon = {type: ty, weeks: ty==="duration" ? 8 : undefined}; }
 if (f==="horizon.sport") d.horizon.dist = null;
 if (f==="places") d.places.forEach(pl => { if (pl==="salle" && !d.equip.salle) d.equip.salle = GYM_DEFAULT.slice(); });
 if (f.startsWith("dayPlace.") && v==="") delete d.dayPlace[f.split(".")[1]];
 if (f==="perDay" && !d.perDay) d.dayPlace = {};
 if (f==="horizon.date" || f==="horizon.sport") d.horizon.mode = null;
 renderOv();
};
A.noEquip = () => { ONB.d.equip.maison = []; renderOv(); };
A.pickEv = el => { const e = evById(el.dataset.id); ONB.d.horizon = {type:"event", id:e.id, name:e.t, date:e.date, sport:e.sport, dist:e.dist}; renderOv(); };
A.feasOpt = el => { const v = el.dataset.v, h = ONB.d.horizon;
 if (v==="decouverte") h.mode = "decouverte";
 if (v==="later"){ const f = feasibility(S, ONB.d, h.sport || "course", h.dist, h.date); h.date = f.later; h.mode = null; }
 if (v==="other"){ h.id = null; h.date = null; toast("Choisis un événement plus lointain"); }
 if (v==="nodate") ONB.d.horizon = {type:"none"};
 renderOv(); };
A.onbNext = () => { if (!onbValid()) return; ONB.step = ONB.edit && ONB.from===4 && ONB.step===4 ? 5 : ONB.step + 1; renderOv(); $("ov").scrollTop = 0; };
A.onbBack = () => { if (ONB.step > 1 && !(ONB.edit && ONB.step===ONB.from)){ ONB.step--; renderOv(); $("ov").scrollTop = 0; } else { OV = OV.filter(o => o.k!=="onb"); ONB = null; render(); } };
A.onbGo = el => { ONB.step = +el.dataset.v; renderOv(); $("ov").scrollTop = 0; };
A.onbDone = () => {
 const d = ONB.d, t = T();
 if (!d.perDay) d.dayPlace = {};
 if (!ONB.edit){
  if (ONB.test){ S.sessions = []; S.log = []; S.lastMsgs = []; S.favs = []; }
  S.profile = d; S.sessions = S.sessions.filter(s => !s.plan); createPlan(S); S.onboarded = true; S.discovery = false; toast("Ton programme est prêt");
 } else {
  const oldH = JSON.stringify(S.profile.horizon); S.profile = d;
  if (JSON.stringify(d.horizon)!==oldH){ S.plan.cycleStart = monday(t); S.plan.cycled = false; }
  S.plan.paused = false;
  generateWeek(S, monday(t), t, "Préférences modifiées : semaine recalculée à partir d'aujourd'hui, historique conservé");
  toast("Programme mis à jour");
 }
 save(); ONB = null; OV = []; TAB = "today"; render(); window.scrollTo(0,0);
};
A.edit = el => { if (!S.profile) return startOnb(1, false); startOnb(+el.dataset.v, true); };
A.sess = el => { const s = findS(el.dataset.id); if (s) pushOv("sess", {id: s.id, s: s.preview || !s.plan ? s : null}); };
A.ex = el => pushOv("ex", {id: el.dataset.id});
A.start = el => { const s = findS(el.dataset.id); if (!s) return; if (s.preview) return; startPlayer(s); };
A.quick = el => {
 const type = el.dataset.v, m = +(el.dataset.m || 15), p = S.profile || DEFAULT_P;
 const place = type==="course" || type==="marche" ? ((p.places||[]).includes("exterieur") ? "exterieur" : "maison") : ((p.places||[]).includes("maison") ? "maison" : (p.places||["maison"])[0]);
 const stage = S.plan ? (S.plan.stage[type] || 1) : 1;
 QUICK = buildSession(p, {date: T(), type, minutes: m, place, stage, phase: null}); QUICK.plan = false; QUICK.title = (m <= 10 ? "Séance légère · " : "Découverte · ") + QUICK.title;
 pushOv("sess", {id: QUICK.id, s: QUICK});
};
A.safety = () => pushOv("safety");
A.planv = el => { PLANV = el.dataset.v; render(); };
A.wk = el => { WKOFF = clamp(WKOFF + +el.dataset.v, 0, 1); render(); };
A.mo = el => { MOFF += +el.dataset.v; render(); };
A.pause = () => openSheet(`<h3>Mettre le programme en pause ?</h3><p>Les séances prévues sont retirées. Ton historique est conservé, et rien ne sera à rattraper. Tu reprends quand tu veux.</p><div class="btns"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn" data-a="pauseOk">Mettre en pause</button></div>`);
A.pauseOk = () => { const t = T(); S.plan.paused = true; S.sessions = S.sessions.filter(s => !(s.plan && s.status==="planned" && s.date >= t)); logChange(S, "Programme mis en pause"); save(); closeSheet(); render(); };
A.resume = () => { const t = T(); S.plan.paused = false; generateWeek(S, monday(t), t, "Programme repris, à partir de ton niveau actuel"); save(); render(); toast("C'est reparti, à ton rythme"); };
A.journal = () => openSheet(`<h3>Journal des modifications</h3><p class="small sub">Chaque changement de plan est expliqué ici.</p>${S.log.length ? `<ul class="clean">${S.log.map(l => `<li><span class="small sub">${fmtD(l.at)}</span><br>${esc(l.t)}</li>`).join("")}</ul>` : `<p class="sub">Rien pour l'instant.</p>`}<button class="btn ghost" data-a="closeSheet" style="margin-top:12px">Fermer</button>`);
A.comeback = () => { applyComeback(S); save(); render(); toast("Reprise en douceur programmée");
 const h = S.profile.horizon; if ((h.type==="event" || h.type==="date") && h.date){ const f = feasibility(S, S.profile, h.sport || "course", h.dist, h.date); if (!f.ok) openSheet(`<h3>Et ta date cible ?</h3><p>Après cette pause, le délai jusqu'au ${fmtD(h.date)} semble court (${plural(f.weeks,"semaine")}, il en faudrait environ ${f.need}).</p><div class="stack"><button class="btn" data-a="edit" data-v="4">Revoir mon échéance</button><button class="btn ghost" data-a="keepDate">Garder la date en mode découverte</button></div>`); } };
A.keepDate = () => { S.profile.horizon.mode = "decouverte"; logChange(S, "Échéance conservée en mode découverte"); save(); closeSheet(); render(); };
A.dismiss = el => { S.plan.dismissed[el.dataset.v] = el.dataset.k; save(); render(); };
A.afterGoal = el => { const t = T(), old = S.profile.horizon;
 S.plan.dismissed.passed = old.date; S.plan.dismissed.duration = String(old.weeks);
 S.profile.horizon = {type:"none"}; S.plan.cycleStart = addD(monday(t), -21); S.plan.cycled = true;
 generateWeek(S, monday(t), t, "Échéance terminée : semaine de récupération, puis maintien sans date");
 save(); render(); if (el.dataset.v==="new") startOnb(1, true); };
A.clearMsgs = () => { S.lastMsgs = []; save(); render(); };
A.exv = el => { EXV.tab = el.dataset.v; render(); };
A.exf = el => { EXV[el.dataset.k] = el.dataset.v; render(); };
A.exft = el => { EXV[el.dataset.k] = !EXV[el.dataset.k]; render(); };
A.fav = el => { const id = el.dataset.id, i = S.favs.indexOf(id); if (i>=0) S.favs.splice(i,1); else S.favs.push(id); save(); render(); toast(i>=0 ? "Retiré des favoris" : "Ajouté aux favoris"); };
A.evOpen = el => pushOv("event", {id: el.dataset.id});
A.addEvent = () => openSheet(`<h3>Ajouter mon événement</h3><p class="small sub">Il reste sur ce téléphone. Seuls le nom et la discipline sont obligatoires.</p>
 <label class="field"><span>Nom</span><input class="input" id="ae_t" maxlength="80" placeholder="Ex. : 10 km de ma ville"></label>
 <label class="field"><span>Discipline</span><select class="input" id="ae_s"><option value="course">Course à pied</option><option value="marche">Marche / randonnée</option><option value="hybride">Fitness hybride</option></select></label>
 <label class="field"><span>Distance en km (facultatif)</span><input class="input" id="ae_d" type="number" min="1" max="100" inputmode="decimal"></label>
 <label class="field"><span>Date (laisse vide si elle n'est pas confirmée)</span><input class="input" id="ae_date" type="date" min="${T()}"></label>
 <label class="field"><span>Ville</span><input class="input" id="ae_c" maxlength="60"></label>
 <label class="field"><span>Lien d'inscription officiel (facultatif)</span><input class="input" id="ae_u" type="url" inputmode="url" placeholder="https://"></label>
 <div class="btns"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn" data-a="addEventOk">Ajouter</button></div>`);
A.addEventOk = () => {
 const v = id => ($(id).value || "").trim(), t = v("ae_t"); if (!t) return toast("Ajoute un nom");
 let u = v("ae_u"); if (u && !/^https:\/\/[^\s]+\.[^\s]+/.test(u)) return toast("Le lien doit commencer par https://");
 const dist = parseFloat(v("ae_d")) || null, date = v("ae_date") || null, sport = v("ae_s");
 const e = {id: "m" + uid(), t, sport, dist, fmt: dist ? `${dist} km` : DISC[sport].t, date, city: v("ae_c") || "—", dep: "—", price: 0, lvl: "", kind: DISC[sport].t, access: "", status: date ? "ok" : "unknown", url: u || null};
 S.myEvents.push(e); save(); closeSheet();
 if (ONB && OV.some(o => o.k==="onb") && date) { ONB.d.horizon = {type:"event", id:e.id, name:e.t, date, sport, dist}; renderOv(); } else { render(); renderOv(); }
 toast("Événement ajouté");
};
A.delEvent = el => { S.myEvents = S.myEvents.filter(e => e.id!==el.dataset.id); save(); popOv(); toast("Événement supprimé"); };
A.prepEv = el => {
 const e = evById(el.dataset.id);
 if (!e.date){ return openSheet(`<h3>Date non confirmée</h3><p>On n'invente pas de date. Tu peux te préparer à la discipline sans échéance, puis l'ajouter une fois la date officielle connue.</p><div class="btns"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn" data-a="prepNoDate" data-v="${e.sport}">Préparer sans date</button></div>`); }
 const prof = S.profile || Object.assign(newDraft(), {level:"debutant", days:[0,2,5]});
 const f = feasibility(S, prof, e.sport, e.dist, e.date);
 if (!S.onboarded){ startOnb(1, false, {intent:"evenement", disc:[e.sport], horizon:{type:"event", id:e.id, name:e.t, date:e.date, sport:e.sport, dist:e.dist}}); return; }
 openSheet(`<h3>Préparer « ${esc(e.t)} »</h3>
  ${f.ok ? `<div class="banner ok"><b>Délai réaliste</b>${plural(f.weeks,"semaine")} devant toi ; il en faut environ ${f.need} à ton niveau actuel.</div>`
   : `<div class="banner warn"><b>${f.tooClose ? "C'est dans moins d'une semaine." : "Le délai semble court."}</b>${f.tooClose ? "" : `${plural(f.weeks,"semaine")} disponibles, il en faudrait environ ${f.need}. `}Tu peux y aller en mode découverte (à ton rythme, sans chrono), ou choisir un autre événement.</div>`}
  <p class="small sub">Les phases futures seront recalculées. Ton historique est conservé.</p>
  <div class="stack">${f.ok ? `<button class="btn" data-a="prepOk" data-id="${e.id}">Préparer cet événement</button>` : `<button class="btn" data-a="prepOk" data-id="${e.id}" data-m="decouverte">Y aller en mode découverte</button>`}
  <button class="btn ghost" data-a="closeSheet">Annuler</button></div>`);
};
A.prepOk = el => { const e = evById(el.dataset.id), t = T();
 S.profile.horizon = {type:"event", id:e.id, name:e.t, date:e.date, sport:e.sport, dist:e.dist, mode: el.dataset.m || null};
 if (!S.profile.disc.includes(e.sport)) S.profile.disc.unshift(e.sport);
 S.profile.intent2 = S.profile.intent!=="evenement" ? S.profile.intent : S.profile.intent2; S.profile.intent = "evenement";
 S.plan.cycleStart = monday(t); S.plan.cycled = false; S.plan.paused = false;
 generateWeek(S, monday(t), t, `Nouvel objectif : ${e.t}. Phases futures recalculées, historique conservé`);
 save(); closeSheet(); OV = []; TAB = "today"; render(); toast("Objectif mis à jour"); };
A.prepNoDate = el => { const sp = el.dataset.v, t = T();
 if (!S.onboarded){ closeSheet(); startOnb(1, false, {intent:"decouvrir", disc:[sp]}); return; }
 S.profile.horizon = {type:"none"}; S.profile.disc = [sp].concat(S.profile.disc.filter(x => x!==sp));
 generateWeek(S, monday(t), t, `Préparation ${DISC[sp].t.toLowerCase()} sans date`); save(); closeSheet(); OV = []; TAB = "today"; render(); toast("Programme mis à jour"); };
A.set = el => { const k = el.dataset.k; S.settings[k] = !S.settings[k]; save(); render(); };
A.scale = el => { const i = SCALES.indexOf(S.settings.scale); S.settings.scale = SCALES[clamp((i<0 ? 1 : i) + +el.dataset.v, 0, SCALES.length-1)]; save(); render(); };
A.theme = el => { S.settings.theme = el.dataset.v; save(); render(); };
A.privacy = () => openSheet(`<h3>Mes données</h3>
 <p><b>Où ?</b> Uniquement sur ce téléphone, dans le stockage de l'application. Pas de compte, pas de serveur, pas de publicité, aucun traceur.</p>
 <p><b>Ton compte :</b> prénom, nom, e-mail, date de naissance (pour vérifier que tu es majeur·e) et une empreinte chiffrée de ton mot de passe, jamais le mot de passe lui-même.</p>
 <p><b>Quoi d'autre ?</b> Tes préférences (objectif, jours, durée, lieux, matériel), ton plan, tes séances et le ressenti que tu choisis de donner.</p>
 <p><b>Ce qu'on ne demande pas :</b> poids, fréquence cardiaque, blessures, état de santé, position GPS.</p>
 <p><b>Pourquoi ?</b> Uniquement pour construire et adapter ton programme.</p>
 <p><b>Tes droits :</b> tu peux tout exporter ou tout supprimer à tout moment depuis Profil. Le ressenti est facultatif ; le refuser ne limite pas le coaching.</p>
 <p class="small sub">Prototype de test. Une version avec compte et synchronisation fera l'objet d'une notice détaillée (finalités, bases légales, durées, droits, réclamation auprès de la CNIL).</p>
 <button class="btn ghost" data-a="closeSheet">Fermer</button>`);
A.export = async () => {
 const data = JSON.stringify({app:"MOVENTHY", version:VERSION, exportedAt:new Date().toISOString(), account: S.account ? Object.assign({}, S.account, {pw: undefined}) : null, profile:S.profile, plan:S.plan, sessions:S.sessions, log:S.log, myEvents:S.myEvents, favs:S.favs, settings:S.settings}, null, 2);
 const name = `moventhy-donnees-${T()}.json`;
 try { const file = new File([data], name, {type:"application/json"});
  if (navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:"Mes données MOVENTHY"}); return; } } catch(e){ if (e && e.name==="AbortError") return; }
 const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], {type:"application/json"})); a.download = name; document.body.appendChild(a); a.click(); a.remove(); toast("Export téléchargé");
};
A.wipe = () => openSheet(`<h3>Supprimer ton compte ?</h3><p class="lead">Ton compte, ton programme, ton historique, tes réglages et tes événements seront effacés de ce téléphone. C'est définitif.</p><div class="btns"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn danger" data-a="wipeOk">Tout supprimer</button></div>`);
A.wipeOk = () => { try { localStorage.removeItem(KEY); } catch(e){} S = fresh(); closeSheet(); OV = []; TAB = "today"; render(); toast("Données supprimées"); };
A.persona = el => {
 const k = el.dataset.v, P = k ? clone(PERSONAS[k].p) : newDraft();
 if (P.horizon.type==="event"){ const e = evById(P.horizon.id); P.horizon = {type:"event", id:e.id, name:e.t, date:e.date, sport:e.sport, dist:e.dist}; }
 delete P.name; PRESET = P; TEST = true; S.loggedIn = false; save();
 SU = newSU(); OV = []; pushOv("signup");
};
A.sim = el => { const v = +el.dataset.v; S.simOffset = v ? S.simOffset + v : 0;
 if (S.simOffset < 0) S.simOffset = 0;
 if (S.onboarded){ const m = rollover(S); if (m.length) S.lastMsgs = m; }
 save(); render(); toast(`Date : ${fmtLong(T())}`); };

/* ================= ÉVÉNEMENTS DOM ================= */
document.addEventListener("click", e => {
 const el = e.target.closest("[data-a]"); if (!el || el.disabled) return;
 const f = A[el.dataset.a]; if (!f) return;
 if (el.tagName!=="A") e.preventDefault();
 f(el);
});
document.addEventListener("input", e => {
 const k = e.target.dataset && e.target.dataset.in; if (!k) return;
 if (k==="q"){ EXV.q = e.target.value; const pos = e.target.selectionStart; render(); const n = document.querySelector('[data-in="q"]'); if (n){ n.focus(); try { n.setSelectionRange(pos,pos); } catch(_){} } }
 if (k.startsWith("su:") && SU){ const f = k.slice(3); SU[f] = e.target.value; if (SU.err[f]){ delete SU.err[f]; } }
 if (k==="name" && ONB){ ONB.d.name = e.target.value.trim().slice(0,30); const b = document.querySelector('[data-a="onbNext"]'); if (b) b.disabled = !onbValid(); }
 if (k==="hdate"){ ONB.d.horizon.date = e.target.value || null; ONB.d.horizon.mode = null; renderOv(); }
});
document.addEventListener("change", e => { const k = e.target.dataset && e.target.dataset.in; if (k==="dep"){ EXV.dep = e.target.value; render(); } });
document.addEventListener("keydown", e => { const rb = e.target.closest && e.target.closest('[role="button"][data-a]'); if (rb && (e.key==="Enter" || e.key===" ")){ e.preventDefault(); rb.click(); return; } if (e.key==="Escape"){ if (!$("sheetWrap").hidden) closeSheet(); else if (OV.length && !["welcome","player","finish","onb"].includes(OV[OV.length-1].k)) popOv(); } });
document.addEventListener("visibilitychange", () => {
 if (document.visibilityState==="visible"){ if (S.onboarded && !PL){ const m = rollover(S); if (m.length) S.lastMsgs = m; save(); render(); } if (PL && !PL.paused) wake(true); }
});
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => applySettings());

/* ================= DÉMARRAGE ================= */
load();
if (S.onboarded){ const m = rollover(S); if (m.length) S.lastMsgs = m; save(); }
render();
if ("serviceWorker" in navigator && location.protocol==="https:") navigator.serviceWorker.register("sw.js").catch(() => {});
