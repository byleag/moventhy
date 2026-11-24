/* MOVENTHY — application (prototype privé, données stockées uniquement sur l'appareil) */
"use strict";
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const KEY = "moventhy.v1", VERSION = "0.1.1";
let S;
const fresh = () => ({v:1, adult:false, onboarded:false, discovery:false, profile:null, plan:null, sessions:[], log:[], favs:[], myEvents:[], simOffset:0, lastMsgs:[],
 settings:{scale:1, theme:"auto", hc:false, motion:true, voice:true, vibrate:true, sound:true}});
function load(){ try { S = JSON.parse(localStorage.getItem(KEY)); } catch(e){ S = null; }
 if (!S || S.v!==1) S = fresh(); S.settings = Object.assign(fresh().settings, S.settings||{}); }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
const T = () => todayOf(S);
const clone = o => JSON.parse(JSON.stringify(o));

/* ================= ICÔNES ================= */
const IC = {
 today:"M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M17.7 6.3l1.4-1.4M4.9 19.1l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
 plan:"M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM3 10h18M8 3v4M16 3v4",
 explore:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z",
 progress:"M3 17l6-6 4 4 8-8M15 7h6v6",
 profile:"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
 play:"M7 4.5v15l12-7.5z", pause:"M8 5v14M16 5v14", next:"M6 5l9 7-9 7zM18 5v14", prev:"M18 5l-9 7 9 7zM6 5v14",
 x:"M6 6l12 12M18 6L6 18", back:"M15 5l-7 7 7 7", chev:"M9 5l7 7-7 7", check:"M5 12l5 5 9-10",
 clock:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2", pin:"M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
 dumb:"M3 10v4M6.5 7v10M17.5 7v10M21 10v4M6.5 12h11", bars:"M5 20v-6M12 20V9M19 20V4",
 walk:"M13 5a1.6 1.6 0 1 0 0-.1M10 21l1.6-6.5L9 12l1.5-4 3 1 2 3.5M11.6 14.5 14 17v4M10.5 8 8 10.5V13",
 run:"M15 4.5a1.6 1.6 0 1 0 0-.1M5 20l4.5-4.5 2.5 1.5 1.5-4.5-3.5-2-3 2.5M12.5 12.5l3.5.5 2.5 3",
 flex:"M12 5.5a1.7 1.7 0 1 0 0-.1M4 18c3.5-.5 5.5-1.5 8-4.5 2.5 3 4.5 4 8 4.5M12 9v4.5M7 11l5-2 5 2",
 bolt:"M13 3 5 14h6l-1 7 8-11h-6z", pulse:"M3 12h4l2-5 4 10 2-5h6",
 shield:"M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z", info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.5",
 plus:"M12 5v14M5 12h14", minus:"M5 12h14", search:"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
 star:"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
 edit:"M4 20h4L19 9l-4-4L4 16zM14 6l4 4", trash:"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13", download:"M12 4v11M7 10l5 5 5-5M5 20h14",
 phone:"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z",
 swap:"M4 8h14l-3-3M20 16H6l3 3", move:"M8 3v4M16 3v4M4 9h16M12 13v6M9 16h6", moon:"M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
 list:"M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01", ext:"M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
 eye:"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", lock:"M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
 text:"M4 7V5h16v2M12 5v14M9 19h6", sun:"M12 3v2M12 19v2M5 12H3M21 12h-2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", flask:"M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"
};
const ic = (n, cls="") => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const typeIcon = t => ({marche:"walk", course:"run", renfo:"dumb", mobilite:"flex", hybride:"bolt", cardio:"pulse"}[t] || "bolt");
const LOGO = `<img class="logo-m" src="icons/icon-192.png" alt="" width="84" height="84">`;
const brandLogo = () => `<img class="brandimg" src="icons/logo-${document.documentElement.classList.contains("light") ? "light" : "dark"}.png" alt="MOVENTHY" width="1465" height="255">`;

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
const TABS = [["today","Aujourd'hui","today"],["plan","Plan","plan"],["explore","Explorer","explore"],["progress","Progression","progress"],["profile","Profil","profile"]];
function renderTabs(){ $("tabs").innerHTML = `<div>${TABS.map(([id,l,i]) => `<button data-a="tab" data-v="${id}" ${TAB===id ? 'aria-current="page"' : ""}>${ic(i)}<span>${l}</span></button>`).join("")}</div>`; }
function render(){
 applySettings();
 if (!S.onboarded && !S.discovery && !OV.length) OV.push({k:"welcome"});
 renderTabs();
 const V = {today:vToday, plan:vPlan, explore:vExplore, progress:vProgress, profile:vProfile}[TAB];
 $("view").innerHTML = V();
 renderOv();
}
function renderOv(){
 const o = OV[OV.length-1], el = $("ov");
 if (!o){ el.hidden = true; el.innerHTML = ""; document.body.style.overflow = ""; lastOvRef = null; return; }
 const keep = o===lastOvRef ? el.scrollTop : 0;
 el.hidden = false; document.body.style.overflow = "hidden";
 el.innerHTML = `<div class="inner">${OVK[o.k](o)}</div>`;
 el.scrollTop = keep;
 if (o!==lastOvRef){ const h = el.querySelector("h1,h2"); if (h){ h.setAttribute("tabindex","-1"); h.focus({preventScroll:true}); } }
 lastOvRef = o;
 if (OVA[o.k]) OVA[o.k](o);
}
function pushOv(k, extra){ OV.push(Object.assign({k}, extra||{})); renderOv(); }
function popOv(){ stopAnim(); OV.pop(); render(); }
function openSheet(html){ $("sheet").innerHTML = `<div class="grab" aria-hidden="true"></div>${html}`; $("sheetWrap").hidden = false; const h = $("sheet").querySelector("h2,h3"); if (h){ h.setAttribute("tabindex","-1"); h.focus(); } }
function closeSheet(){ $("sheetWrap").hidden = true; $("sheet").innerHTML = ""; }

/* ================= ACCUEIL / ONBOARDING ================= */
const OVK = {}, OVA = {};
OVK.welcome = () => `
 <div class="welcome">
  <h1 class="brand">${brandLogo()}</h1>
  <p class="brand-sub">MOVEMENT + HEALTHY</p>
  <p class="sig">Move. Grow. Evolve.</p>
  <p class="sig2">Bouger. Grandir. Évoluer.</p>
  <div class="card" style="text-align:left">
   <p style="margin:0">Le sport qui s'adapte à ta vie, et non l'inverse. Avec ou sans salle, avec ou sans compétition, avec un agenda stable ou imprévisible.</p>
  </div>
 </div>
 <div class="stack" style="margin-top:16px">
  <button class="check" role="checkbox" aria-checked="${S.adult}" data-a="adult"><span class="bx">${S.adult ? ic("check","s") : ""}</span><span><b>J'ai 18 ans ou plus</b><br><span class="small sub">Cette première version est réservée aux adultes.</span></span></button>
  <p class="xs sub">Prototype de test : pas de compte, tes réponses restent sur ce téléphone. MOVENTHY ne remplace pas un avis médical.</p>
 </div>
 <div class="foot stack">
  <button class="btn" data-a="startOnb" ${S.adult ? "" : "disabled"}>Créer mon programme</button>
  <button class="btn ghost" data-a="discover" ${S.adult ? "" : "disabled"}>Explorer sans programme</button>
 </div>`;

let ONB = null;
const newDraft = () => ({intent:null, intent2:null, disc:[], level:null, recent:[], ease:3, days:[], minutes:20, places:[],
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
 return `<button class="opt" role="radio" aria-checked="${on}" data-a="d" data-f="${path}" data-v="${esc(v)}" data-m="single"><span class="dot"></span><span><b>${title}</b>${sub ? `<span>${sub}</span>` : ""}</span></button>`;
}
function tog(path, label, sub){
 const on = !!getP(ONB.d, path);
 return `<button class="toggle" role="switch" aria-checked="${on}" data-a="d" data-f="${path}" data-v="1" data-m="toggle"><span class="t"><b>${label}</b>${sub ? `<br><span class="small sub">${sub}</span>` : ""}</span><span class="sw"></span></button>`;
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
 const titles = ["","Ton intention","Ton profil sportif","Où tu pratiques","Ton horizon","Ton premier programme"];
 let body = "";
 if (st===1){
  body = `<p class="sub">Choisis ton objectif principal. Tu pourras en changer en cours de route.</p>
  ${INTENTS.map(i => opt("intent", i.id, i.t, i.s)).join("")}
  ${d.intent ? `<h2>Un objectif secondaire ? <span class="sub small">(facultatif)</span></h2><div class="chips">${INTENTS.filter(i => i.id!==d.intent).map(i => chip("intent2", i.id, i.t, "single2")).join("")}</div>` : ""}
  <h2>Quelles disciplines t'attirent ?</h2><p class="small sub">La première choisie sera ta priorité.</p>
  <div class="chips">${DISC_ORDER.map(k => chip("disc", k, `${ic(typeIcon(k),"s")} ${DISC[k].t}${d.disc[0]===k ? " · priorité" : ""}`, "multi")).join("")}</div>`;
 }
 if (st===2){
  body = `${LEVELS.map(l => opt("level", l.id, l.t, l.s)).join("")}
  <h2>Activités récentes <span class="sub small">(facultatif)</span></h2>
  <div class="chips">${["Marche","Course","Vélo","Natation","Renforcement","Danse","Sport collectif","Rien récemment"].map(a => chip("recent", a, a, "multi")).join("")}</div>
  <h2>Ton aisance aujourd'hui</h2><p class="small sub">Simple ressenti, aucun test demandé.</p>
  <div class="chips">${[[1,"Pas du tout"],[2,"Un peu"],[3,"Moyenne"],[4,"Bonne"],[5,"Très bonne"]].map(([v,l]) => chip("ease", v, l, "single")).join("")}</div>
  <h2>Tes jours disponibles</h2>
  <div class="chips">${DOWS.map((l,i) => chip("days", i, l, "multi")).join("")}</div>
  <h2>Temps disponible par séance</h2>
  <div class="chips">${DURATIONS.map(m => chip("minutes", m, `${m} min`, "single")).join("")}</div>
  <h2>Préférences de mouvement <span class="sub small">(facultatif)</span></h2>
  <div class="card" style="padding:4px 16px">${tog("prefs.noImpact","Éviter les sauts et la course","Marche et exercices sans impact à la place")}<div class="divider" style="margin:0"></div>${tog("prefs.noFloor","Éviter les exercices au sol","Tout se fait debout ou sur une chaise")}</div>
  <p class="xs sub">Pas de questionnaire médical. En cas de doute sur ta santé, demande l'avis d'un professionnel avant de commencer.</p>`;
 }
 if (st===3){
  const eqBlock = (pl, list) => d.places.includes(pl) ? `<h2>Matériel · ${PLACES[pl]}</h2><div class="chips">${pl==="maison" ? `<button class="chip" aria-pressed="${!d.equip.maison.length}" data-a="noEquip">Aucun matériel</button>` : ""}${list.map(e => chip("equip."+pl, e, EQUIP[e], "multi")).join("")}</div>` : "";
  body = `<p class="sub">Où peux-tu bouger ? Plusieurs choix possibles.</p>
  <div class="chips">${Object.entries(PLACES).map(([k,l]) => chip("places", k, l, "multi")).join("")}</div>
  ${eqBlock("maison", EQUIP_HOME)}${eqBlock("exterieur", EQUIP_OUT)}${eqBlock("salle", GYM_DEFAULT)}
  ${d.places.length > 1 && d.days.length ? `<h2>Lieux différents selon les jours ?</h2>
   <div class="card" style="padding:4px 16px">${tog("perDay","Oui, je précise jour par jour")}</div>
   ${d.perDay ? [...d.days].sort().map(i => `<div class="row wrap" style="margin-top:10px"><b style="width:44px">${DOWS[i]}</b>${chip("dayPlace."+i, "", "Auto", "single","sm")}${d.places.map(pl => chip("dayPlace."+i, pl, PLACES[pl], "single","sm")).join("")}</div>`).join("") : ""}` : ""}`;
 }
 if (st===4){
  const h = d.horizon;
  body = `<p class="sub">Tu peux commencer sans date de fin, et ajouter ou retirer une échéance à tout moment.</p>
  ${opt("horizon.type","none","Sans date","Le programme avance par cycles, sans fin imposée")}
  ${opt("horizon.type","duration","Une durée indicative","4, 8 ou 12 semaines")}
  ${opt("horizon.type","date","Une date cible","Un objectif personnel à une date")}
  ${opt("horizon.type","event","Un événement","Choisi dans Explorer ou ajouté par toi")}`;
  if (h.type==="duration") body += `<div class="chips">${[4,8,12].map(w => chip("horizon.weeks", w, `${w} semaines`, "single")).join("")}</div>`;
  if (h.type==="date") body += `<label class="field"><span>Date</span><input class="input" type="date" min="${T()}" value="${esc(h.date||"")}" data-in="hdate"></label>
   <div class="field"><span>Type d'objectif</span><div class="chips">${["course","marche","hybride"].map(k => chip("horizon.sport", k, DISC[k].t, "single")).join("")}</div></div>
   ${h.sport==="course" || h.sport==="marche" ? `<div class="field"><span>Distance <span class="sub">(facultatif)</span></span><div class="chips">${(h.sport==="course" ? [5,10] : [5,10,15]).map(k => chip("horizon.dist", k, `${k} km`, "single")).join("")}</div></div>` : ""}`;
  if (h.type==="event"){
   const evs = allEvents().filter(e => e.status!=="cancelled").sort((a,b) => (a.date||"9").localeCompare(b.date||"9"));
   body += `<p class="small sub" style="margin-top:12px">Exemples fictifs pour tester, et tes propres événements.</p>` + evs.map(e => e.date && e.date >= T()
    ? `<button class="opt" role="radio" aria-checked="${h.id===e.id}" data-a="pickEv" data-id="${e.id}"><span class="dot"></span><span><b>${esc(e.t)}${e.demo ? " (démo)" : ""}</b><span>${esc(e.fmt||"")} · ${esc(e.city)} · ${fmtLong(e.date)}</span></span></button>`
    : `<div class="opt" aria-disabled="true" style="opacity:.6"><span class="dot"></span><span><b>${esc(e.t)}${e.demo ? " (démo)" : ""}</b><span>Date à confirmer : on ne l'invente pas. Choisis « Sans date » pour t'y préparer.</span></span></div>`).join("")
    + `<button class="btn ghost sm" data-a="addEvent" style="margin-top:6px">${ic("plus","s")} Ajouter mon événement</button>`;
  }
  if ((h.type==="date" || h.type==="event") && h.date) body += feasBox(d, h);
 }
 if (st===5) body = onbSummary();
 const nav = st===5
  ? `<div class="btns"><button class="btn ghost" data-a="onbGo" data-v="1">Modifier</button><button class="btn" data-a="onbDone">${ONB.edit ? "Appliquer" : "Démarrer"}</button></div>`
  : `<button class="btn" data-a="onbNext" ${onbValid() ? "" : "disabled"}>Continuer</button>`;
 return `<div class="ovh"><button class="ib" data-a="onbBack" aria-label="${st>1 ? "Étape précédente" : "Fermer"}">${ic(st>1 ? "back" : "x")}</button><div class="prog" role="progressbar" aria-valuemin="1" aria-valuemax="5" aria-valuenow="${st}" aria-label="Étape ${st} sur 5"><i style="width:${st*20}%"></i></div><span class="small sub">${st}/5</span></div>
 <div class="eyebrow">${ONB.edit ? "Modifier mon programme" : "Étape " + st}</div><h1>${titles[st]}</h1>${body}<div class="foot">${nav}</div>`;
};
function feasBox(d, h){
 const f = feasibility(S, d, h.sport || "course", h.dist, h.date);
 if (f.past) return `<div class="banner warn"><b>Cette date est passée.</b>Choisis une date à venir.</div>`;
 if (f.ok) return `<div class="banner ok"><b>Délai réaliste</b>${plural(f.weeks,"semaine")} devant toi ; à ton niveau, il en faut environ ${f.need}. Le plan progressera pas à pas, sans promesse de temps.</div>`;
 if (h.mode==="decouverte") return `<div class="banner ok"><b>Mode découverte</b>Objectif : y participer à ton rythme (marche ou alternance), sans chrono. Tu peux changer d'avis à tout moment.</div>`;
 return `<div class="banner warn"><b>${f.tooClose ? "C'est dans moins d'une semaine." : "Le délai semble court."}</b>${f.tooClose ? "" : `Il reste ${plural(f.weeks,"semaine")}, il en faudrait environ ${f.need} à ton niveau actuel. `}Voici des options plus réalistes :
  <div class="stack" style="margin-top:10px">
   <button class="btn sm ghost" style="width:100%" data-a="feasOpt" data-v="decouverte">Garder la date et y aller en mode découverte</button>
   ${h.type==="date" ? `<button class="btn sm ghost" style="width:100%" data-a="feasOpt" data-v="later">Viser plus tard : à partir du ${fmtD(f.later)}</button>` : `<button class="btn sm ghost" style="width:100%" data-a="feasOpt" data-v="other">Choisir un événement plus lointain</button>`}
   <button class="btn sm ghost" style="width:100%" data-a="feasOpt" data-v="nodate">Préparer sans date</button>
  </div></div>`;
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
 r.push(`${plural(n,"séance")} par semaine sur tes ${plural(p.days.length,"jour")} disponibles${n < p.days.length ? " : les autres jours restent libres pour récupérer" : ""}.`);
 if (n < p.days.length && p.level!=="regulier") r.push("Volume modéré pour commencer : plus facile à tenir, on augmente ensuite.");
 r.push(`${TYPES[wt.prim].t} en priorité${(p.horizon.type==="event" || p.horizon.type==="date") ? " pour préparer ton échéance" : ""}.`);
 if (wt.complementAdded) r.push(`${TYPES[wt.complement].t} ajouté${wt.complement==="mobilite" || wt.complement==="marche" ? "e" : ""} en complément : ${COMPLEMENT_WHY[wt.prim]}`);
 r.push(`Chaque séance tient dans ${p.minutes} min maximum, échauffement et retour au calme compris.`);
 r.push("Jamais deux séances intenses d'affilée quand c'est évitable.");
 r.push("Aucun exercice ne demande du matériel que tu n'as pas dans le lieu prévu.");
 if (p.prefs.noImpact) r.push("Pas de sauts ni de course : tu as choisi d'éviter les impacts.");
 if (p.prefs.noFloor) r.push("Pas d'exercice au sol : tout se fait debout ou sur une chaise.");
 const ph = phaseFor(p, tmp.plan, monday(T()));
 r.push(`Phase actuelle : ${PHASES[ph].t.toLowerCase()} (${PHASES[ph].s.toLowerCase()}).`);
 if (p.horizon.type==="none") r.push("Sans date de fin : cycles de 4 semaines (3 de progression, 1 plus légère), réévalués chaque semaine.");
 [...new Set(tmp.sessions.flatMap(s => s.notes))].forEach(x => r.push(x));
 return r;
}
function onbSummary(){
 const d = ONB.d, tmp = previewPlan(d);
 const eqs = d.places.map(pl => `${PLACES[pl]} : ${(d.equip[pl]||[]).length ? d.equip[pl].map(e => EQUIP[e]).join(", ") : "sans matériel"}`).join(" · ");
 const item = (step, label, val) => `<div class="st"><div class="t"><span>${label}</span><b>${val}</b></div><button class="link small" data-a="onbGo" data-v="${step}">Modifier</button></div>`;
 return `<div class="card">
  ${item(1,"Intention", esc(goalText(d)) + " · " + d.disc.map(k => DISC[k].t).join(", "))}
  ${item(2,"Profil et disponibilités", `${LEVELS.find(l => l.id===d.level).t} · ${[...d.days].sort().map(i => DOWS[i]).join(", ")} · ${d.minutes} min`)}
  ${item(3,"Lieux et matériel", esc(eqs))}
  ${item(4,"Horizon", esc(horizonText(d)))}
 </div>
 <h2>Aperçu de ta semaine</h2>
 ${tmp.sessions.length ? `<div class="card">${tmp.sessions.map(s => `<div class="st"><div class="th" style="display:grid;place-items:center;color:var(--acc)">${ic(typeIcon(s.type))}</div><div class="t"><b>${DOWL[dow(s.date)]} · ${esc(s.title)}</b><span>${s.minutes} min · ${PLACES[s.place]} · ${esc(equipText(s))}</span></div></div>`).join("")}</div>`
   : `<div class="banner">Plus de jour disponible cette semaine : ton programme commence lundi prochain. En attendant, tu peux faire une séance découverte depuis Explorer.</div>`}
 <h2>Pourquoi ces choix</h2>
 <div class="card"><ul class="dots">${reasons(d, tmp).map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>
 <p class="small sub">Tout reste modifiable à tout moment depuis Plan et Profil. Tes données restent sur ce téléphone.</p>`;
}

/* ================= AUJOURD'HUI ================= */
const TIPS = ["Bois un peu d'eau dans l'heure qui suit ta séance.", "Le sommeil est ton meilleur allié pour progresser.", "Une marche tranquille de 10 minutes aide à récupérer les jours de repos.",
 "Des courbatures légères sont normales. Une douleur vive ou inhabituelle : stop, et avis médical.", "Un jour de repos n'est pas un jour perdu : c'est là que le corps s'adapte.", "Mange quelque chose de simple après l'effort si tu as faim : pas besoin de produits spéciaux."];
const weekCache = {};
function previewWeek(ws){
 const key = ws + "|" + S.sessions.length + "|" + JSON.stringify(S.plan.stage) + JSON.stringify(S.profile).length;
 if (weekCache[key]) return weekCache[key];
 const tmp = {simOffset: S.simOffset, sessions: [], log: [], profile: S.profile, plan: clone(S.plan)};
 generateWeek(tmp, ws, ws); return (weekCache[key] = tmp.sessions);
}
function sessionsOn(date){
 const t = T(), cw = addD(monday(t), 6);
 const real = S.sessions.filter(s => s.date===date && s.status!=="cancelled" && (s.plan || s.status!=="planned"));
 if (real.length || date <= cw || !S.plan || S.plan.paused) return real;
 return previewWeek(monday(date)).filter(s => s.date===date).map(s => Object.assign({preview:true}, s));
}
function sessionCard(s, o){
 o = o || {};
 const open = s.status==="planned";
 return `<div class="hero ${o.today && open ? "acc" : ""}">
  <div class="row"><span class="eyebrow">${ic(typeIcon(s.type),"s")} ${TYPES[s.type].t}</span><span class="sp"></span>${statusPill(s)}</div>
  <div class="stitle">${esc(s.title)}</div>
  <div class="pills"><span class="pill">${ic("clock","s")} ${s.minutes} min</span><span class="pill">${ic("pin","s")} ${PLACES[s.place]}</span><span class="pill">${ic("bars","s")} ${levelText(s)}</span><span class="pill">${ic("dumb","s")} ${esc(equipText(s))}</span></div>
  ${s.notes && s.notes.length ? `<p class="small sub">${s.notes.map(esc).join("<br>")}</p>` : ""}
  ${s.reason ? `<p class="small sub">${esc(s.reason)}</p>` : ""}
  ${!open && s.status!=="missed" && s.status!=="cancelled" ? `<p class="small sub">${s.doneMin ? s.doneMin + " min d'activité" : ""}${s.rpe ? ` · ressenti : ${RPE[s.rpe-1].toLowerCase()}` : ""}</p>` : ""}
  ${o.actions && open ? `<div class="btns"><button class="btn" data-a="start" data-id="${s.id}">${ic("play")} Démarrer</button><button class="btn ghost" data-a="adapt" data-id="${s.id}">Adapter</button></div>` : ""}
  <button class="link small" data-a="sess" data-id="${s.id}">Voir le déroulé</button>
 </div>`;
}
function noticeHTML(n){
 if (n.id==="comeback") return `<div class="banner warn"><b>Content·e de te revoir !</b>Ça fait ${n.days} jours. On te propose une reprise plus facile, sans rattraper les séances passées${(S.profile.horizon.type==="event" || S.profile.horizon.type==="date") ? ", et de revoir ta date cible" : ""}.
  <div class="btns"><button class="btn sm" data-a="comeback">Reprendre en douceur</button><button class="btn sm ghost" data-a="dismiss" data-v="comeback" data-k="${n.key}">Garder mon plan</button></div></div>`;
 if (n.id==="passed") return `<div class="banner ok"><b>Ton échéance est passée.</b>Bravo pour le chemin parcouru, quel que soit le résultat. On te propose une semaine plus légère, puis tu choisis la suite.
  <div class="stack" style="margin-top:10px"><button class="btn sm" style="width:100%" data-a="afterGoal" data-v="new">Récupérer puis choisir un nouvel objectif</button><button class="btn sm ghost" style="width:100%" data-a="afterGoal" data-v="keep">Maintenir mon niveau, sans date</button></div></div>`;
 if (n.id==="duration") return `<div class="banner ok"><b>Tes ${n.key} semaines indicatives sont terminées.</b>Tu continues sans date, ou tu te fixes un nouvel objectif.
  <div class="btns"><button class="btn sm" data-a="afterGoal" data-v="keep">Continuer sans date</button><button class="btn sm ghost" data-a="afterGoal" data-v="new">Nouvel objectif</button></div></div>`;
 return "";
}
function nextAction(todays){
 const t = T(), nx = S.sessions.find(s => s.plan && s.status==="planned" && s.date > t);
 const nxt = nx ? `${DOWL[dow(nx.date)].toLowerCase()} : ${nx.title.toLowerCase()}` : "la semaine prochaine, prête lundi";
 const open = todays.find(s => s.status==="planned");
 if (open) return `<p style="margin:0">Prépare ${open.equipUsed.length ? esc(equipText(open).toLowerCase()) + " et " : ""}une tenue confortable${open.place==="exterieur" ? ", jette un œil à la météo" : ""}. Puis appuie sur <b>Démarrer</b>.</p>`;
 if (todays.some(s => s.status==="done" || s.status==="partial")) return `<p style="margin:0">C'est fait pour aujourd'hui. Prochaine séance ${nxt}.</p>`;
 return `<p style="margin:0">Aujourd'hui, récupération. Prochaine séance ${nxt}.</p>`;
}
function strip(){
 const t = T(); let h = `<div class="strip">`;
 for (let i=0; i<7; i++){
  const d = addD(t, i), ss = S.plan && S.plan.paused ? [] : sessionsOn(d), s = ss[0];
  const m = !s ? `<span class="m">${ic("moon")}</span>` : s.status==="done" || s.status==="partial" ? `<span class="m ok">${ic("check")}</span>` : `<span class="m p">${ic(typeIcon(s.type))}</span>`;
  h += `<div class="d ${i===0 ? "today" : ""}"><span>${DOWS[dow(d)]}</span><b>${pd(d).getDate()}</b>${m}<span class="sr">${s ? TYPES[s.type].t : "Repos"}</span></div>`;
 }
 return h + `</div><p class="xs sub">Les jours au-delà de cette semaine sont un aperçu, recalculé selon ta semaine réelle.</p>`;
}
function vToday(){
 const t = T();
 let h = `<div class="row"><div><div class="eyebrow">${fmtLong(t)}${S.simOffset ? " · date simulée" : ""}</div><h1>Aujourd'hui</h1></div><span class="sp"></span><button class="ib" data-a="safety" aria-label="Consignes de sécurité">${ic("shield")}</button></div>`;
 if (!S.onboarded) return h + discoveryHome();
 const p = S.profile, nx = S.sessions.find(s => s.plan && s.status==="planned" && s.date > t);
 h += `<div class="card"><div class="eyebrow">Objectif actuel</div><b>${esc(goalText(p))}</b><p class="small sub" style="margin-bottom:0">${esc(horizonText(p))}</p>
  ${nx && !S.plan.paused ? `<div class="divider"></div><div class="row small"><span class="sub">Prochain rendez-vous</span><span class="sp"></span><b>${DOWL[dow(nx.date)]} · ${TYPES[nx.type].t}</b></div>` : ""}</div>`;
 if (S.lastMsgs && S.lastMsgs.length) h += `<div class="banner ok"><div class="row"><b style="flex:1">Bilan de la semaine</b><button class="ib" style="width:36px;height:36px" data-a="clearMsgs" aria-label="Masquer le bilan">${ic("x","s")}</button></div>${S.lastMsgs.map(esc).join("<br>")}</div>`;
 h += notices(S).map(noticeHTML).join("");
 let todays = [];
 if (S.plan.paused){
  h += `<h2>Programme en pause</h2><div class="hero"><p>Rien de prévu tant que tu es en pause. Ton historique est conservé et rien ne sera à rattraper.</p><button class="btn" data-a="resume">Reprendre mon programme</button></div>`;
 } else {
  todays = S.sessions.filter(s => s.date===t && s.status!=="cancelled" && (s.plan || s.status!=="planned"));
  if (todays.length) h += `<h2>Ta séance du jour</h2>` + todays.map(s => sessionCard(s, {today:true, actions:true})).join("");
  else h += `<h2>Ta recommandation du jour</h2><div class="hero"><div class="eyebrow">${ic("moon","s")} Repos</div><div class="stitle">Récupération</div><p class="sub">Le repos fait partie du programme : c'est là que le corps assimile le travail.</p><p class="small sub">Envie de bouger quand même ? Une séance légère, facultative :</p><button class="btn ghost" data-a="quick" data-v="mobilite" data-m="10">${ic("flex")} Mobilité · 10 min</button></div>`;
 }
 h += `<h2>Prochaine action</h2><div class="card">${S.plan.paused ? `<p style="margin:0">Reprends quand tu veux, ton programme repartira de ton niveau actuel.</p>` : nextAction(todays)}</div>`;
 h += `<h2>Récupération</h2><div class="card"><p style="margin:0">${TIPS[hash(t) % TIPS.length]}</p></div>`;
 h += `<h2>Les prochains jours</h2>${strip()}`;
 h += `<button class="li" style="margin-top:20px" data-a="safety"><span class="ico">${ic("shield")}</span><span class="t"><b>Sécurité</b><span>Douleur inhabituelle, malaise, douleur thoracique ou essoufflement anormal : arrête-toi.</span></span>${ic("chev")}</button>`;
 return h;
}
function discoveryHome(){
 return `<div class="hero acc"><div class="eyebrow">Mode découverte</div><div class="stitle">Tu explores sans programme</div><p class="sub">Essaie une séance, parcours les exercices et les événements. Quand tu veux, crée ton programme : il s'adaptera à tes jours, ton matériel et ton objectif.</p><button class="btn" data-a="startOnb">Créer mon programme</button></div>
 <h2>Séances découverte</h2>
 ${["marche","renfo","mobilite","course","hybride"].map(k => `<button class="li" data-a="quick" data-v="${k}" data-m="15"><span class="ico">${ic(typeIcon(k))}</span><span class="t"><b>${DISC[k].t} · 15 min</b><span>${DISC[k].s}</span></span>${ic("chev")}</button>`).join("")}
 <p class="xs sub">Les séances découverte utilisent des exercices sans matériel. Ton historique reste sur ce téléphone.</p>`;
}

/* ================= SÉANCE (DÉTAIL) ================= */
function findS(id){ return S.sessions.find(s => s.id===id) || (QUICK && QUICK.id===id ? QUICK : null) || Object.values(weekCache).flat().find(s => s.id===id); }
let QUICK = null;
function stepRow(st){
 if (st.rest) return `<div class="st"><div class="th" style="display:grid;place-items:center;color:var(--sub)">${ic("clock")}</div><div class="t"><b>${st.between ? "Récupération entre les tours" : "Récupération"}</b></div><span class="du">${durStr(st.dur)}</span></div>`;
 const e = EXI[st.ex];
 return `<button class="st" style="width:100%;background:none;border-left:0;border-right:0;border-top:0;text-align:left;color:inherit" data-a="ex" data-id="${e.id}"><div class="th">${exThumb(e)}</div><div class="t"><b>${esc(e.n)}</b><span>${e.m==="r" ? `≈ ${e.r} répétitions à ton rythme` : esc(e.cues[0])}</span></div><span class="du">${durStr(st.dur)}</span></button>`;
}
OVK.sess = o => {
 const s = o.s || findS(o.id); if (!s) return `<div class="ovh"><button class="ib" data-a="back" aria-label="Retour">${ic("back")}</button></div><p>Séance introuvable.</p>`;
 const t = T(), canStart = s.status==="planned" && !s.preview && (s.date===t || !s.plan);
 return `<div class="ovh"><button class="ib" data-a="back" aria-label="Retour">${ic("back")}</button><span class="sp"></span>${statusPill(s)}</div>
 <div class="eyebrow">${s.plan ? fmtLong(s.date) : "Séance découverte"}${s.preview ? " · aperçu" : ""}</div><h1>${esc(s.title)}</h1>
 <div class="pills"><span class="pill">${ic("clock","s")} ${s.minutes} min</span><span class="pill">${ic("pin","s")} ${PLACES[s.place]}</span><span class="pill">${ic("bars","s")} ${levelText(s)}</span><span class="pill">${ic("dumb","s")} ${esc(equipText(s))}</span>${s.phase ? `<span class="pill">${PHASES[s.phase].t}</span>` : ""}</div>
 ${s.notes.length || s.reason ? `<div class="banner">${s.notes.concat(s.reason ? [s.reason] : []).map(esc).join("<br>")}</div>` : ""}
 ${s.blocks.map(b => `<h2>${esc(b.name)} <span class="sub small">· ${durStr(b.steps.reduce((a,x) => a+x.dur, 0))}</span></h2><div class="card" style="padding:4px 14px">${b.steps.map(stepRow).join("")}</div>`).join("")}
 <p class="xs sub" style="margin-top:14px">${VALID}. Arrête-toi en cas de douleur inhabituelle ou de malaise.</p>
 <div class="foot">${canStart ? `<div class="btns"><button class="btn" data-a="start" data-id="${s.id}">${ic("play")} Démarrer</button>${s.plan ? `<button class="btn ghost" data-a="adapt" data-id="${s.id}">Adapter</button>` : ""}</div>`
  : s.status==="planned" && !s.preview ? `<button class="btn ghost" data-a="adapt" data-id="${s.id}">Adapter ou déplacer</button>` : ""}</div>`;
};

/* ================= FICHE EXERCICE ================= */
OVK.ex = o => {
 const e = EXI[o.id], cat = {allure:"Allure", cardio:"Cardio", renfo:"Renforcement", mobilite:"Mobilité"}[e.d];
 const eq = (e.eq||[]).map(q => EQUIP[q]).concat(e.any ? [e.any.map(q => EQUIP[q]).join(" ou ")] : []);
 const v = (id, l) => id ? `<button class="li" data-a="ex" data-id="${id}"><span class="t"><span>${l}</span><b>${esc(EXI[id].n)}</b></span>${ic("chev")}</button>` : "";
 return `<div class="ovh"><button class="ib" data-a="back" aria-label="Retour">${ic("back")}</button></div>
 <div class="demo"><svg id="exStage" role="img" aria-label="Démonstration animée : ${esc(e.n)}"></svg></div>
 <div class="pl"><div class="phs" id="exPh">${e.ph.map((p,i) => `<span data-ph="${i}">${esc(p)}</span>`).join("")}</div></div>
 <div class="eyebrow">${cat}</div><h1>${esc(e.n)}</h1>
 <div class="pills"><span class="pill">${LVL_T[e.l]}</span><span class="pill">${eq.length ? esc(eq.join(", ")) : "Sans matériel"}</span>${e.sol ? `<span class="pill">Au sol</span>` : `<span class="pill">Debout</span>`}${e.imp ? `<span class="pill warn">Impacts</span>` : `<span class="pill">Sans impact</span>`}${e.m==="r" ? `<span class="pill">≈ ${e.r} répétitions</span>` : ""}</div>
 <h2>Consignes</h2><div class="card"><ul class="dots">${e.cues.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>
 ${e.easy || e.hard ? `<h2>Variantes</h2>${v(e.easy,"Plus facile")}${v(e.hard,"Plus difficile")}` : ""}
 <h2>Erreurs fréquentes</h2><div class="card"><ul class="dots">${e.err.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>
 <h2>Précautions</h2><div class="card"><p style="margin:0">${esc(e.prec)}</p></div>
 <p class="xs sub" style="margin-top:14px">Fiche ${esc(e.id)} · ${VALID}.</p>`;
};
const phaseHL = cont => i => { const box = $(cont); if (box) box.querySelectorAll("[data-ph]").forEach((p,j) => p.classList.toggle("on", j===i)); };
OVA.ex = o => animate($("exStage"), EXI[o.id], phaseHL("exPh"));

/* ================= PLAN ================= */
let PLANV = "week", WKOFF = 0, MOFF = 0;
function vPlan(){
 let h = `<h1>Plan</h1>`;
 if (!S.onboarded) return h + `<div class="hero acc"><p>Ton plan apparaîtra ici : une semaine détaillée, des phases indicatives, et tout reste modifiable.</p><button class="btn" data-a="startOnb">Créer mon programme</button></div>`;
 const t = T(), p = S.profile;
 h += `<div class="seg" role="tablist"><button role="tab" aria-selected="${PLANV==="week"}" data-a="planv" data-v="week">Semaine</button><button role="tab" aria-selected="${PLANV==="month"}" data-a="planv" data-v="month">Mois</button></div>`;
 if (S.plan.paused) h += `<div class="banner warn"><b>Programme en pause</b>Aucune séance prévue. <button class="link" data-a="resume">Reprendre</button></div>`;
 if (PLANV==="week"){
  const ws = addD(monday(t), WKOFF*7), ph = phaseFor(p, S.plan, ws);
  h += `<div class="row"><button class="ib" data-a="wk" data-v="-1" ${WKOFF<=0 ? "disabled" : ""} aria-label="Semaine précédente">${ic("back")}</button><div class="sp center"><b>Semaine du ${fmtD(ws)}</b><br><span class="small sub">${WKOFF===0 ? "Cette semaine" : "Aperçu indicatif"} · ${PHASES[ph].t}</span></div><button class="ib" data-a="wk" data-v="1" ${WKOFF>=1 ? "disabled" : ""} aria-label="Semaine suivante">${ic("chev")}</button></div>`;
  h += `<div class="wk" style="margin-top:14px">`;
  for (let i=0; i<7; i++){
   const d = addD(ws, i), ss = S.plan.paused ? [] : (WKOFF===0 ? S.sessions.filter(s => s.date===d && (s.plan || s.status!=="planned")) : previewWeek(ws).filter(s => s.date===d).map(s => Object.assign({preview:true}, s)));
   h += `<div class="day"><div class="dl ${d===t ? "today" : ""}">${DOWS[i]}<b>${pd(d).getDate()}</b></div><div class="slot">${ss.length ? ss.map(s => `<button class="li ${s.status==="cancelled" || s.status==="missed" ? "off" : ""}" style="margin-bottom:6px" data-a="sess" data-id="${s.id}"><span class="ico">${ic(typeIcon(s.type))}</span><span class="t"><b>${esc(s.title)}</b><span>${s.minutes} min · ${PLACES[s.place]}${s.status!=="planned" ? " · " + STATUS[s.status] : s.mod ? " · modifiée" : ""}</span></span>${ic("chev")}</button>`).join("") : `<div class="rest">${ic("moon","s")}&nbsp; Repos${p.days.includes(i) ? " · jour disponible gardé libre" : ""}</div>`}</div></div>`;
  }
  h += `</div>`;
  if (WKOFF===1) h += `<p class="xs sub">Aperçu : la semaine prochaine sera recalculée lundi selon ce que tu auras réellement fait.</p>`;
 } else h += monthView();
 h += `<h2>Phases de progression</h2>${phasesTimeline()}`;
 h += `<h2>Ajuster</h2>
  <button class="li" data-a="edit" data-v="1"><span class="ico">${ic("swap")}</span><span class="t"><b>Changer de cible</b><span>${esc(goalText(p))}</span></span>${ic("chev")}</button>
  <button class="li" data-a="edit" data-v="4"><span class="ico">${ic("plan")}</span><span class="t"><b>Échéance</b><span>${esc(horizonText(p))}</span></span>${ic("chev")}</button>
  <button class="li" data-a="edit" data-v="2"><span class="ico">${ic("clock")}</span><span class="t"><b>Jours et durée</b><span>${[...p.days].sort().map(i => DOWS[i]).join(", ")} · ${p.minutes} min</span></span>${ic("chev")}</button>
  <button class="li" data-a="edit" data-v="3"><span class="ico">${ic("dumb")}</span><span class="t"><b>Lieux et matériel</b><span>${p.places.map(x => PLACES[x]).join(", ")}</span></span>${ic("chev")}</button>
  ${S.plan.paused ? `<button class="li" data-a="resume"><span class="ico">${ic("play")}</span><span class="t"><b>Reprendre le programme</b><span>Repart de ton niveau actuel</span></span>${ic("chev")}</button>`
   : `<button class="li" data-a="pause"><span class="ico">${ic("pause")}</span><span class="t"><b>Mettre en pause</b><span>Vacances, imprévu… sans rien à rattraper</span></span>${ic("chev")}</button>`}
  <button class="li" data-a="journal"><span class="ico">${ic("list")}</span><span class="t"><b>Journal des modifications</b><span>${plural(S.log.length,"entrée")}</span></span>${ic("chev")}</button>`;
 return h;
}
function phasesTimeline(){
 const t = T(), p = S.profile, h = p.horizon; let out = `<div class="phases">`;
 for (let w=0; w<10; w++){
  const ws = addD(monday(t), w*7), ph = phaseFor(p, S.plan, ws);
  const isT = (h.type==="event" || h.type==="date") && h.date && h.date >= ws && h.date <= addD(ws,6);
  out += `<div class="ph ${w===0 ? "cur" : ""} ${isT ? "target" : ""}"><b>${PHASES[ph].t}</b>${w===0 ? "Cette semaine" : "Sem. du " + fmtD(ws)}${isT ? `<br><span style="color:var(--warn)">Échéance</span>` : ""}</div>`;
 }
 return out + `</div><p class="xs sub">Phases indicatives, réévaluées chaque semaine selon ta pratique réelle.</p>`;
}
function monthView(){
 const t = T(), base = pd(t); base.setDate(1); base.setMonth(base.getMonth()+MOFF);
 const first = iso(base), start = monday(first), m = base.getMonth(), h = S.profile.horizon;
 let out = `<div class="row"><button class="ib" data-a="mo" data-v="-1" aria-label="Mois précédent">${ic("back")}</button><b class="sp center">${MONTHL[m]} ${base.getFullYear()}</b><button class="ib" data-a="mo" data-v="1" aria-label="Mois suivant">${ic("chev")}</button></div><div class="month" style="margin-top:12px">${DOWS.map(d => `<div class="h">${d}</div>`).join("")}`;
 for (let i=0; i<42; i++){
  const d = addD(start, i); if (i>=35 && pd(d).getMonth()!==m) break;
  const ss = S.sessions.filter(s => s.date===d && s.status!=="cancelled" && (s.plan || s.status!=="planned"));
  const marks = ss.map(s => `<i class="${s.status==="done" ? "done" : s.status==="partial" ? "partial" : s.status==="planned" ? "planned" : ""}"></i>`).join("") + ((h.type==="event" || h.type==="date") && h.date===d ? `<i class="target"></i>` : "");
  out += `<div class="c ${pd(d).getMonth()!==m ? "o" : ""} ${d===t ? "t" : ""}" aria-label="${fmtLong(d)} : ${ss.length ? ss.map(s => TYPES[s.type].t + " " + STATUS[s.status].toLowerCase()).join(", ") : "rien"}"><span>${pd(d).getDate()}</span><span class="row" style="gap:2px">${marks}</span></div>`;
 }
 return out + `</div><div class="row wrap small sub" style="margin-top:10px;gap:14px"><span class="row" style="gap:5px"><i style="width:9px;height:9px;border-radius:50%;background:var(--acc);display:inline-block"></i>Terminée</span><span class="row" style="gap:5px"><i style="width:9px;height:9px;border-radius:50%;background:var(--warn);display:inline-block"></i>Partielle</span><span class="row" style="gap:5px"><i style="width:9px;height:9px;border-radius:50%;border:1.5px solid var(--acc);display:inline-block"></i>Prévue</span><span class="row" style="gap:5px"><i style="width:9px;height:9px;background:var(--warn);display:inline-block"></i>Échéance</span></div>`;
}

/* ================= ADAPTER UNE SÉANCE ================= */
let ADP = null;
function adaptMenu(s){
 ADP = {s};
 const it = (a, i, t, sub) => `<button class="li" data-a="${a}"><span class="ico">${ic(i)}</span><span class="t"><b>${t}</b><span>${sub}</span></span>${ic("chev")}</button>`;
 openSheet(`<h3>Adapter la séance</h3><p class="small sub">${esc(s.title)} · ${fmtLong(s.date)} · ${s.minutes} min</p>
  ${it("adTime","clock","J'ai moins de temps","Version courte, échauffement compris")}
  ${it("adPlace","pin","Je change de lieu","Maison, extérieur ou salle")}
  ${it("adMiss","dumb","Il me manque du matériel","Variante compatible")}
  ${it("adMove","move","Déplacer à un autre jour","Sans doubler une autre séance")}
  ${it("adRep","swap","Remplacer par une autre activité","Garder le créneau, changer de discipline")}
  ${it("adCancel","x","Je ne peux pas cette fois","Retirée, sans rattrapage")}
  <button class="btn ghost" data-a="closeSheet" style="margin-top:6px">Fermer</button>`);
}
function previewSheet(newS, reason, extra){
 ADP.newS = newS; ADP.reason = reason;
 const s = ADP.s, box = (lab, x) => `<div class="card"><div class="eyebrow">${lab}</div><b>${esc(x.title)}</b><p class="small sub" style="margin:4px 0 0">${x.date!==s.date || lab==="Après" ? fmtD(x.date) + " · " : ""}${x.minutes} min · ${PLACES[x.place]}<br>${esc(equipText(x))}</p></div>`;
 openSheet(`<h3>Aperçu avant validation</h3><p class="small sub">${esc(reason)}</p>
  <div class="cmp">${box("Avant", s)}${box("Après", newS)}</div>
  ${newS.notes.length || extra ? `<div class="banner">${[extra].concat(newS.notes).filter(Boolean).map(esc).join("<br>")}</div>` : ""}
  <p class="small sub">Rien n'est doublé ni rattrapé automatiquement. Le reste de ta semaine ne change pas.</p>
  <div class="btns"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn" data-a="adOk">Confirmer</button></div>`);
}
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
 openSheet(`<h3>Déplacer à quel jour ?</h3><p class="small sub">Uniquement cette semaine, sur un jour libre.</p>${opts.length ? opts.map(o => `<button class="li ${o.busy ? "off" : ""}" ${o.busy ? "disabled" : `data-a="adMoveSel" data-v="${o.date}"`}><span class="t"><b>${DOWL[dow(o.date)]} ${pd(o.date).getDate()}${o.date===T() ? " · aujourd'hui" : ""}</b><span>${o.busy ? "Déjà une séance ce jour-là" : o.warn ? "Possible, mais à côté d'une autre séance intense" : "Compatible avec la récupération"}</span></span></button>`).join("") : `<p class="sub">Plus de jour libre cette semaine. Tu peux retirer la séance sans rattrapage.</p>`}<button class="btn ghost" data-a="adBack">Retour</button>`); };
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

/* ================= LECTEUR DE SÉANCE ================= */
let PL = null, PLT = null, WAKE = null, AC = null;
function audio(){ try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state==="suspended") AC.resume(); } catch(e){} }
function beep(f, d){ if (!S.settings.sound || !AC) return; try { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f || 880; g.gain.value = .08; o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + (d || .12)); } catch(e){} }
function say(t){ if (!S.settings.voice || !window.speechSynthesis) return; try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "fr-FR"; u.rate = 1; speechSynthesis.speak(u); } catch(e){} }
function buzz(p){ if (S.settings.vibrate && navigator.vibrate) try { navigator.vibrate(p || 120); } catch(e){} }
async function wake(on){ try { if (on && "wakeLock" in navigator) WAKE = await navigator.wakeLock.request("screen"); else if (!on && WAKE){ await WAKE.release(); WAKE = null; } } catch(e){} }
function startPlayer(s){
 const steps = []; s.blocks.forEach(b => b.steps.forEach(st => steps.push(Object.assign({block: b.name}, st))));
 PL = {s, steps, i:0, acc:0, t0: performance.now(), paused:false, swap:{}, spent: steps.map(() => 0), beeped: -1};
 audio(); wake(true); OV = OV.filter(o => o.k!=="sess"); pushOv("player"); announce();
 clearInterval(PLT); PLT = setInterval(tick, 200);
}
const curEx = () => { const st = PL.steps[PL.i]; return st.rest ? null : EXI[PL.swap[PL.i] || st.ex]; };
const elapsed = () => PL.acc + (PL.paused ? 0 : (performance.now() - PL.t0)/1000);
function announce(){
 const st = PL.steps[PL.i], ex = curEx();
 const txt = st.rest ? `Récupération, ${durStr(st.dur)}` : `${ex.n}, ${durStr(st.dur)}`;
 say(txt.replace(" min ", " minutes ").replace(/ min$/," minutes").replace(/ s$/, " secondes"));
 const lr = $("plLive"); if (lr) lr.textContent = txt;
}
function tick(){
 if (!PL || PL.result) return;
 const st = PL.steps[PL.i], e = elapsed(), rem = st.dur - e;
 PL.spent[PL.i] = Math.max(PL.spent[PL.i], Math.min(e, st.dur));
 const c = $("plClock"); if (c) c.textContent = clockStr(rem);
 const r = $("plRing"); if (r){ const C = 2*Math.PI*27; r.setAttribute("stroke-dasharray", `${(C*Math.max(0, Math.min(1, e/st.dur))).toFixed(1)} ${C.toFixed(1)}`); }
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
 PL.result = {completed, sec};
 FIN = {status: completed ? "done" : sec >= 60 ? "partial" : "skipped", rpe: null};
 OV = OV.filter(o => o.k!=="player"); pushOv("finish");
 if (completed) say("Séance terminée. Bravo !");
}
OVK.player = () => {
 const st = PL.steps[PL.i], ex = curEx(), n = PL.steps.length;
 const nxt = PL.steps.slice(PL.i+1).find(x => !x.rest);
 const nxEx = nxt ? EXI[nxt.ex] : null;
 const base = st.rest ? null : EXI[st.ex];
 const ctx = makeCtx(S.profile || DEFAULT_P, PL.s.place, PL.s.missing);
 const varOk = id => id && compatible(EXI[id], ctx);
 const C = 2*Math.PI*27;
 return `<div class="pl">
 <div class="ovh"><button class="ib" data-a="plStop" aria-label="Arrêter la séance">${ic("x")}</button><div style="flex:1"><div class="small sub">${esc(st.block)} · étape ${PL.i+1}/${n}</div><div class="prog" style="margin-top:6px"><i style="width:${(PL.i/n*100).toFixed(1)}%"></i></div></div></div>
 <div class="stage">${st.rest ? `<div class="restv"><span class="eyebrow">Récupération</span><b>Respire, détends-toi</b>${nxEx ? `<span class="sub">Ensuite : ${esc(nxEx.n)}</span><div style="width:140px;height:110px">${exThumb(nxEx)}</div>` : ""}</div>` : `<svg id="plStage" role="img" aria-label="Démonstration animée : ${esc(ex.n)}"></svg>`}</div>
 <div class="nm">${st.rest ? "Récupération" : esc(ex.n)}</div>
 ${ex ? `<div class="phs" id="plPh">${ex.ph.map((p,i) => `<span data-ph="${i}">${esc(p)}</span>`).join("")}</div>${ex.m==="r" ? `<p class="small sub">≈ ${esc(ex.r)} répétitions, à ton rythme. Passe à la suite quand tu as fini.</p>` : ""}` : ""}
 <div class="timer"><svg class="ring2" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="var(--card2)" stroke-width="7"/><circle id="plRing" cx="32" cy="32" r="27" fill="none" stroke="var(--acc)" stroke-width="7" stroke-linecap="round" stroke-dasharray="0 ${C.toFixed(1)}" transform="rotate(-90 32 32)"/></svg><div><div class="clock" id="plClock" aria-hidden="true">${clockStr(st.dur - elapsed())}</div><div class="small sub">${PL.paused ? "En pause" : "restant · " + durStr(st.dur) + " au total"}</div></div></div>
 <div class="ctrl"><button class="btn ghost" data-a="plPrev" aria-label="Étape précédente" ${PL.i===0 ? "disabled" : ""}>${ic("prev")}</button><button class="btn" data-a="plPause">${PL.paused ? ic("play") + " Reprendre" : ic("pause") + " Pause"}</button><button class="btn ghost" data-a="plNext" aria-label="Étape suivante">${ic("next")}</button></div>
 ${base && (varOk(base.easy) || varOk(base.hard) || PL.swap[PL.i]) ? `<div class="btns">${PL.swap[PL.i] ? `<button class="btn sm ghost" style="flex:1" data-a="plVar" data-v="">Revenir à l'exercice prévu</button>` : `${varOk(base.easy) ? `<button class="btn sm ghost" style="flex:1" data-a="plVar" data-v="${base.easy}">Plus facile</button>` : ""}${varOk(base.hard) ? `<button class="btn sm ghost" style="flex:1" data-a="plVar" data-v="${base.hard}">Plus difficile</button>` : ""}`}</div>` : ""}
 ${ex ? `<ul class="cues">${ex.cues.map(c => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
 ${nxEx && !st.rest ? `<p class="next">Ensuite : ${esc(nxEx.n)}</p>` : ""}
 <button class="link small" data-a="plStop" style="margin-top:10px">Douleur ou malaise ? Arrête la séance</button>
 <div id="plLive" class="sr" aria-live="assertive"></div>
 </div>`;
};
OVA.player = () => { const ex = curEx(); if (ex) animate($("plStage"), ex, phaseHL("plPh")); };
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

/* ================= FIN DE SÉANCE ================= */
let FIN = null;
OVK.finish = () => {
 const r = PL.result, min = Math.round(r.sec/60);
 const stb = (v, l) => `<button class="chip" role="radio" aria-checked="${FIN.status===v}" aria-pressed="${FIN.status===v}" data-a="finSt" data-v="${v}">${l}</button>`;
 return `<div class="ovh"></div><div class="center">${LOGO}</div>
 <h1 class="center">${r.completed ? "Séance terminée" : "Séance arrêtée"}</h1>
 <p class="center sub">${esc(PL.s.title)} · ${min ? plural(min,"minute") + " d'activité" : "moins d'une minute"}</p>
 <h2>Comment ça s'est passé ?</h2><div class="chips" role="radiogroup">${stb("done","Terminée")}${stb("partial","Partielle")}${stb("skipped","Non effectuée")}</div>
 <h2>Difficulté ressentie <span class="sub small">(facultatif)</span></h2>
 <div class="rpe" role="radiogroup">${RPE.map((l,i) => `<button role="radio" aria-checked="${FIN.rpe===i+1}" data-a="finRpe" data-v="${i+1}"><b>${i+1}</b>${l}</button>`).join("")}</div>
 <p class="xs sub">Ton ressenti sert uniquement à ajuster les prochaines séances. Il reste sur ce téléphone.</p>
 <div class="foot"><button class="btn" data-a="finSave">Enregistrer</button></div>`;
};
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
  <div class="stack"><button class="btn" data-a="hard" data-v="lighten" data-id="${s.id}">Alléger les prochaines séances de ${TYPES[s.type].t.toLowerCase()}</button><button class="btn ghost" data-a="hard" data-v="rest" data-id="${s.id}">Ajouter de la récupération</button><button class="btn line" data-a="closeSheet">Garder le programme tel quel</button></div>
  <p class="xs sub" style="margin-top:12px">Douleur inhabituelle, malaise ou essoufflement anormal : demande un avis médical. Urgence : 15 ou 112.</p>`);
 } else toast(s.status==="skipped" ? "C'est noté, sans rattrapage" : "Séance enregistrée. Bravo !");
};
A.hard = el => { const s = findS(el.dataset.id);
 if (el.dataset.v==="lighten"){ lightenAfterHard(S, s); toast("Prochaines séances allégées"); }
 else { toast(restAfterHard(S, s) ? "Récupération ajoutée" : "Pas de séance dans les 2 jours : repos déjà prévu"); }
 save(); closeSheet(); render(); };

/* ================= SÉCURITÉ ================= */
OVK.safety = o => `<div class="ovh"><button class="ib" data-a="back" aria-label="Fermer">${ic("x")}</button></div>
 <div class="eyebrow">Sécurité</div><h1>${o.urgent ? "Arrête-toi maintenant" : "Écoute ton corps"}</h1>
 <div class="banner danger"><b>Arrête la séance si tu ressens :</b>une douleur inhabituelle, un malaise, une douleur dans la poitrine, ou un essoufflement anormal.</div>
 <p>Demande un avis médical. En cas d'urgence, appelle :</p>
 <div class="stack"><a class="btn danger" href="tel:15">${ic("phone")} 15 · SAMU</a><a class="btn ghost" href="tel:112">${ic("phone")} 112 · Urgences (Europe)</a></div>
 <h2>Bon à savoir</h2><div class="card"><ul class="dots"><li>Des courbatures légères 24 à 48 h après une séance sont fréquentes.</li><li>MOVENTHY ne remplace pas un avis médical et ne propose pas de programme de rééducation.</li><li>Arrêter une séance n'est jamais bloqué, et rien n'est à rattraper.</li></ul></div>
 ${o.urgent ? `<div class="foot"><button class="btn ghost" data-a="back">Continuer vers le bilan</button></div>` : ""}`;

/* ================= EXPLORER ================= */
let EXV = {tab:"events", q:"", sport:"all", period:"all", free:false, beginner:false, dep:"all", cat:"all", noEq:false, noFloor:false};
function vExplore(){
 let h = `<h1>Explorer</h1><div class="seg" role="tablist">${[["events","Événements"],["ex","Exercices"],["disc","Disciplines"]].map(([k,l]) => `<button role="tab" aria-selected="${EXV.tab===k}" data-a="exv" data-v="${k}">${l}</button>`).join("")}</div>`;
 if (EXV.tab==="events") h += eventsView();
 else if (EXV.tab==="ex") h += exercisesView();
 else h += disciplinesView();
 return h;
}
function evFilterChip(key, v, l){ return `<button class="chip sm" aria-pressed="${String(EXV[key])===String(v)}" data-a="exf" data-k="${key}" data-v="${v}">${l}</button>`; }
function eventsView(){
 const t = T(), evs = allEvents().filter(e => {
  if (EXV.sport!=="all" && e.sport!==EXV.sport) return false;
  if (EXV.free && e.price) return false;
  if (EXV.beginner && !/bienvenu|tous niveaux/i.test(e.lvl||"")) return false;
  if (EXV.dep!=="all" && e.dep!==EXV.dep) return false;
  if (EXV.period!=="all" && e.date){ const d = diffD(t, e.date); if (d > +EXV.period) return false; }
  if (EXV.period!=="all" && !e.date) return false;
  if (e.date && e.date < t) return false;
  if (EXV.q){ const q = EXV.q.toLowerCase(); if (!`${e.t} ${e.city} ${e.fmt} ${e.kind}`.toLowerCase().includes(q)) return false; }
  return true;
 }).sort((a,b) => (a.date||"9999").localeCompare(b.date||"9999"));
 const deps = [...new Set(allEvents().map(e => e.dep).filter(d => d && d!=="—"))].sort();
 return `<label class="field"><span class="sr">Rechercher</span><input class="input" type="search" placeholder="Rechercher une ville, un format…" value="${esc(EXV.q)}" data-in="q"></label>
 <div class="chips" style="margin-bottom:8px">${evFilterChip("sport","all","Tous")}${evFilterChip("sport","course","Course")}${evFilterChip("sport","marche","Marche")}${evFilterChip("sport","hybride","Hybride")}</div>
 <div class="chips" style="margin-bottom:8px">${evFilterChip("period","all","Toutes dates")}${evFilterChip("period","30","30 jours")}${evFilterChip("period","90","3 mois")}
  <button class="chip sm" aria-pressed="${EXV.free}" data-a="exft" data-k="free">Gratuit</button><button class="chip sm" aria-pressed="${EXV.beginner}" data-a="exft" data-k="beginner">Débutant bienvenu</button></div>
 <label class="field"><span>Département</span><select class="input" data-in="dep"><option value="all">Tous</option>${deps.map(d => `<option value="${d}" ${EXV.dep===d ? "selected" : ""}>${d}</option>`).join("")}</select></label>
 <div class="banner"><b>Exemples fictifs</b>Ces événements servent à tester le parcours : ils n'existent pas. Ajoute les tiens, ou consulte les calendriers officiels ci-dessous.</div>
 ${evs.length ? evs.map(evCard).join("") : `<p class="sub">Aucun événement avec ces filtres.</p>`}
 <button class="btn ghost" data-a="addEvent" style="margin-top:6px">${ic("plus")} Ajouter mon événement</button>
 <h2>Trouver de vrais événements</h2>
 ${REAL_SOURCES.map(s => `<a class="li" href="${s.u}" target="_blank" rel="noopener noreferrer"><span class="ico">${ic("ext")}</span><span class="t"><b>${esc(s.t)}</b><span>Site externe</span></span></a>`).join("")}
 <p class="xs sub">Vue carte, rappels et favoris synchronisés : prévus après la phase de test.</p>`;
}
function evCard(e){
 const d = e.date ? pd(e.date) : null, fav = S.favs.includes(e.id);
 return `<div class="row" style="gap:6px;align-items:stretch"><button class="ev ${e.status==="cancelled" ? "cancel" : ""}" style="margin:0 0 8px" data-a="evOpen" data-id="${e.id}">
  ${d ? `<span class="dt">${MONTHS[d.getMonth()]}<b>${d.getDate()}</b></span>` : `<span class="dt u">Date à confirmer</span>`}
  <span class="t"><b>${esc(e.t)}</b><span>${esc(e.fmt||"")} · ${esc(e.city)}${e.dep && e.dep!=="—" ? ` (${e.dep})` : ""} · ${e.price ? e.price + " €" : "gratuit"}</span><span class="row wrap" style="gap:4px;margin-top:4px">${e.demo ? `<span class="pill">Démo</span>` : `<span class="pill acc">Ajouté par toi</span>`}${e.status==="cancelled" ? `<span class="pill danger">Annulé</span>` : ""}${e.status==="unknown" ? `<span class="pill warn">Statut à confirmer</span>` : ""}</span></span></button>
  <button class="ib" style="align-self:center" data-a="fav" data-id="${e.id}" aria-label="${fav ? "Retirer des favoris" : "Ajouter aux favoris"}" aria-pressed="${fav}" ${fav ? 'style="align-self:center;color:var(--acc)"' : ""}>${ic("star")}</button></div>`;
}
OVK.event = o => {
 const e = evById(o.id); if (!e) return `<div class="ovh"><button class="ib" data-a="back" aria-label="Retour">${ic("back")}</button></div><p>Événement introuvable.</p>`;
 const row = (l, v) => `<div class="st"><div class="t"><span>${l}</span><b>${v}</b></div></div>`;
 return `<div class="ovh"><button class="ib" data-a="back" aria-label="Retour">${ic("back")}</button><span class="sp"></span>${e.demo ? `<span class="pill">Exemple fictif</span>` : `<span class="pill acc">Ajouté par toi</span>`}</div>
 <div class="eyebrow">${esc(e.kind || DISC[e.sport].t)}</div><h1>${esc(e.t)}</h1>
 ${e.status==="cancelled" ? `<div class="banner danger"><b>Événement annulé</b>Le statut a été mis à jour par la source.</div>` : ""}
 ${e.status==="unknown" || !e.date ? `<div class="banner warn"><b>Date non confirmée</b>On n'invente jamais une date. Tu peux préparer la discipline sans date et ajouter l'échéance une fois confirmée.</div>` : ""}
 <div class="card" style="padding:4px 14px">
  ${row("Date", e.date ? fmtLong(e.date) : "À confirmer")}${row("Lieu", esc(e.city) + (e.dep && e.dep!=="—" ? ` (${e.dep})` : ""))}${row("Format", esc(e.fmt || "—"))}
  ${row("Niveau indicatif", esc(e.lvl || "Non précisé"))}${row("Prix", e.price ? e.price + " €" : "Gratuit")}${row("Accessibilité déclarée", esc(e.access || "Non précisée"))}
  ${row("Source", e.demo ? "Exemple de démonstration · non vérifié" : "Saisi par toi")}
 </div>
 ${e.mine && e.url ? `<a class="btn ghost" style="margin-top:12px" href="${esc(e.url)}" target="_blank" rel="noopener noreferrer">${ic("ext")} Ouvrir le lien d'inscription</a><p class="xs sub">Lien saisi par toi : vérifie qu'il s'agit bien du site officiel.</p>`
  : `<p class="small sub" style="margin-top:12px">Inscription : ${e.demo ? "pas de lien pour un exemple fictif. Sur un vrai événement, le bouton renverra vers le site officiel vérifié." : "ajoute un lien en modifiant l'événement."}</p>`}
 ${e.mine ? `<button class="btn line sm" data-a="delEvent" data-id="${e.id}" style="margin-top:8px">${ic("trash","s")} Supprimer cet événement</button>` : ""}
 <div class="foot">${e.status==="cancelled" ? `<button class="btn" disabled>Préparer cet événement</button>` : `<button class="btn" data-a="prepEv" data-id="${e.id}">Préparer cet événement</button>`}</div>`;
};
function exercisesView(){
 const cats = [["all","Tous"],["renfo","Renforcement"],["cardio","Cardio"],["mobilite","Mobilité"],["allure","Allures"]];
 const list = EX.filter(e => (EXV.cat==="all" || e.d===EXV.cat) && (!EXV.noEq || (!e.eq && !e.any)) && (!EXV.noFloor || !e.sol));
 return `<div class="chips" style="margin-bottom:8px">${cats.map(([k,l]) => evFilterChip("cat", k, l)).join("")}</div>
 <div class="chips" style="margin-bottom:14px"><button class="chip sm" aria-pressed="${EXV.noEq}" data-a="exft" data-k="noEq">Sans matériel</button><button class="chip sm" aria-pressed="${EXV.noFloor}" data-a="exft" data-k="noFloor">Sans passage au sol</button></div>
 <div class="exg">${list.map(e => `<button class="exc" data-a="ex" data-id="${e.id}"><div class="th">${exThumb(e)}</div><b>${esc(e.n)}</b><span>${LVL_T[e.l]}${e.eq || e.any ? " · matériel" : ""}</span></button>`).join("")}</div>
 <p class="xs sub" style="margin-top:12px">${plural(list.length,"fiche")} · ${VALID}.</p>`;
}
function disciplinesView(){
 return `<p class="sub">Disciplines accompagnées par le coaching dans cette première version.</p>
 ${DISC_ORDER.map(k => `<div class="card"><div class="row"><span class="li" style="all:unset"><span class="ico" style="width:42px;height:42px;border-radius:12px;background:var(--card2);display:grid;place-items:center;color:var(--acc)">${ic(typeIcon(k))}</span></span><div style="flex:1"><b>${DISC[k].t}</b><br><span class="small sub">${DISC[k].s}</span></div></div><button class="btn ghost sm" style="width:100%;margin-top:12px" data-a="quick" data-v="${k}" data-m="15">${ic("play","s")} Séance découverte · 15 min</button></div>`).join("")}
 <h2>Bientôt</h2><div class="card"><p style="margin-top:0">Trail, semi-marathon, cyclisme, randonnée, fitness races, courses à obstacles, natation, triathlon, sports de raquette, escalade, danse…</p><p class="small sub" style="margin-bottom:0">Le coaching spécifique de chaque discipline sera construit avec des professionnels qualifiés, avant d'être proposé.</p></div>`;
}

/* ================= PROGRESSION ================= */
function vProgress(){
 const t = T(), cw = monday(t);
 const hist = S.sessions.filter(s => s.status==="done" || s.status==="partial");
 const minOf = s => s.doneMin != null ? s.doneMin : s.minutes;
 let h = `<h1>Progression</h1>`;
 if (!hist.length && !S.onboarded) return h + `<div class="hero"><p>Tes séances apparaîtront ici : régularité, minutes, paliers.</p><button class="btn" data-a="quick" data-v="marche" data-m="15">Faire une première séance</button></div>`;
 const wk = S.sessions.filter(s => s.plan && s.date >= cw && s.date <= addD(cw,6) && s.status!=="cancelled");
 const wkDone = wk.filter(s => s.status==="done" || s.status==="partial").length;
 const wkMin = hist.filter(s => s.date >= cw).reduce((a,s) => a+minOf(s), 0);
 const weeks = []; for (let i=7; i>=0; i--){ const ws = addD(cw, -7*i); const ss = hist.filter(s => s.date >= ws && s.date <= addD(ws,6)); weeks.push({ws, min: ss.reduce((a,s) => a+minOf(s),0), n: ss.length}); }
 const max = Math.max(30, ...weeks.map(w => w.min));
 h += `<div class="kpi"><div class="card"><b>${wkDone}${wk.length ? "/" + wk.length : ""}</b><span>séances cette semaine</span></div><div class="card"><b>${wkMin}</b><span>minutes cette semaine</span></div><div class="card"><b>${hist.length}</b><span>séances au total</span></div><div class="card"><b>${hist.reduce((a,s) => a+minOf(s),0)}</b><span>minutes au total</span></div></div>`;
 h += `<h2>Minutes par semaine</h2><div class="card"><div class="bars" role="img" aria-label="Minutes par semaine sur 8 semaines : ${weeks.map(w => w.min).join(", ")}">${weeks.map((w,i) => `<div class="b ${i===7 ? "cur" : ""}"><span>${w.min || ""}</span><i style="height:${(w.min/max*100).toFixed(0)}%"></i><span>${pd(w.ws).getDate()}/${pd(w.ws).getMonth()+1}</span></div>`).join("")}</div></div>`;
 h += `<h2>Régularité</h2><div class="card"><div class="reg" aria-label="Semaines actives sur les 8 dernières">${weeks.map(w => `<i class="${w.n ? "on" : ""}"></i>`).join("")}</div><p class="small sub" style="margin-bottom:0">${weeks.filter(w => w.n).length} semaine${weeks.filter(w => w.n).length>1 ? "s" : ""} active${weeks.filter(w => w.n).length>1 ? "s" : ""} sur les 8 dernières. Une semaine vide n'est pas un échec : le programme repart simplement d'où tu en es.</p></div>`;
 if (S.plan){
  const types = [...new Set((S.profile.disc||[]).concat(S.sessions.filter(s => s.plan).map(s => s.type)))].filter(k => TYPES[k]);
  h += `<h2>Paliers de progression</h2><div class="card">${types.map(k => `<div class="lv"><span class="n">${TYPES[k].t}</span><span class="tr"><i style="width:${S.plan.stage[k]*10}%"></i></span><span class="v">${S.plan.stage[k]}/10</span></div>`).join("")}<p class="xs sub" style="margin-bottom:0">Un palier augmente après une semaine bien remplie et sans séance trop difficile. Il baisse si tu le demandes ou après une longue pause.</p></div>`;
  const hz = S.profile.horizon;
  if ((hz.type==="event" || hz.type==="date") && hz.date){
   const tot = Math.max(1, diffD(S.plan.cycleStart, hz.date)), done = clamp(diffD(S.plan.cycleStart, t), 0, tot);
   h += `<h2>Vers ton objectif</h2><div class="card"><b>${esc(hz.name || "Date cible")}</b><p class="small sub">${fmtLong(hz.date)}</p><div class="prog"><i style="width:${(done/tot*100).toFixed(0)}%"></i></div><p class="xs sub" style="margin-bottom:0">Aucune promesse de temps ni de résultat : l'objectif est d'y arriver en forme.</p></div>`;
  }
 }
 const past = S.sessions.filter(s => s.status!=="planned").sort((a,b) => b.date.localeCompare(a.date)).slice(0, 30);
 h += `<h2>Historique</h2>${past.length ? `<div class="card" style="padding:4px 14px">${past.map(s => `<button class="st" style="width:100%;background:none;border-left:0;border-right:0;border-top:0;text-align:left;color:inherit" data-a="sess" data-id="${s.id}"><div class="th" style="display:grid;place-items:center;color:var(--acc)">${ic(typeIcon(s.type))}</div><div class="t"><b>${esc(s.title)}</b><span>${fmtD(s.date)} · ${STATUS[s.status]}${s.status==="done" || s.status==="partial" ? " · " + minOf(s) + " min" : ""}${s.rpe ? " · " + RPE[s.rpe-1].toLowerCase() : ""}</span></div></button>`).join("")}</div>` : `<p class="sub">Rien pour l'instant.</p>`}`;
 return h;
}

/* ================= PROFIL ================= */
const PERSONAS = {
 camille:{t:"Camille, 23 ans · reprise", s:"Débutante, 20 min chez elle, sans matériel, sans échéance",
  p:{intent:"reprendre", intent2:null, disc:["renfo","mobilite"], level:"debutant", recent:[], ease:2, days:[0,2,5], minutes:20, places:["maison"], equip:{maison:[], exterieur:[], salle:GYM_DEFAULT.slice()}, dayPlace:{}, perDay:false, prefs:{noImpact:false, noFloor:false}, horizon:{type:"none"}}},
 alex:{t:"Alex, 34 ans · premier défi", s:"Reprise, quelques haltères, vise un 5 km dans 9 semaines",
  p:{intent:"evenement", intent2:null, disc:["course","renfo"], level:"reprise", recent:["Course"], ease:3, days:[1,3,5,6], minutes:30, places:["maison","exterieur"], equip:{maison:["halteres"], exterieur:[], salle:GYM_DEFAULT.slice()}, dayPlace:{}, perDay:false, prefs:{noImpact:false, noFloor:false}, horizon:{type:"event", id:"d1"}}},
 morgan:{t:"Morgan, 49 ans · activité durable", s:"Marche et mobilité, sans impact ni sol, sans compétition",
  p:{intent:"bouger", intent2:null, disc:["marche","mobilite"], level:"debutant", recent:["Marche"], ease:3, days:[0,2,4,6], minutes:30, places:["exterieur","maison"], equip:{maison:["chaise"], exterieur:[], salle:GYM_DEFAULT.slice()}, dayPlace:{}, perDay:false, prefs:{noImpact:true, noFloor:true}, horizon:{type:"none"}}}
};
const DEFAULT_P = {equip:{maison:[], exterieur:[], salle:GYM_DEFAULT}, prefs:{}, places:["maison","exterieur"], level:"debutant", ease:3};
function vProfile(){
 const s = S.settings, p = S.profile;
 const tg = (k, l, sub) => `<button class="toggle" role="switch" aria-checked="${!!s[k]}" data-a="set" data-k="${k}"><span class="t"><b>${l}</b>${sub ? `<br><span class="small sub">${sub}</span>` : ""}</span><span class="sw"></span></button>`;
 let h = `<h1>Profil</h1>`;
 if (p){
  h += `<h2>Mon programme</h2>
  <button class="li" data-a="edit" data-v="1"><span class="ico">${ic("swap")}</span><span class="t"><b>Objectifs</b><span>${esc(goalText(p))} · ${p.disc.map(k => DISC[k].t).join(", ")}</span></span>${ic("chev")}</button>
  <button class="li" data-a="edit" data-v="2"><span class="ico">${ic("clock")}</span><span class="t"><b>Niveau, jours et durée</b><span>${LEVELS.find(l => l.id===p.level).t} · ${p.days.length} jours · ${p.minutes} min</span></span>${ic("chev")}</button>
  <button class="li" data-a="edit" data-v="3"><span class="ico">${ic("dumb")}</span><span class="t"><b>Lieux et matériel</b><span>${p.places.map(x => PLACES[x]).join(", ")}</span></span>${ic("chev")}</button>
  <button class="li" data-a="edit" data-v="4"><span class="ico">${ic("plan")}</span><span class="t"><b>Échéance</b><span>${esc(horizonText(p))}</span></span>${ic("chev")}</button>`;
 } else h += `<div class="hero acc"><p>Pas encore de programme.</p><button class="btn" data-a="startOnb">Créer mon programme</button></div>`;
 h += `<h2>Affichage et accessibilité</h2><div class="card">
  <div class="row"><span style="flex:1"><b>Taille du texte</b><br><span class="small sub">${Math.round(s.scale*100)} %</span></span><button class="ib" data-a="scale" data-v="-1" aria-label="Réduire le texte">${ic("minus")}</button><button class="ib" data-a="scale" data-v="1" aria-label="Agrandir le texte">${ic("plus")}</button></div>
  <div class="divider"></div><b>Thème</b>
  <div class="seg" role="radiogroup">${[["auto","Auto"],["light","Clair"],["dark","Sombre"]].map(([k,l]) => `<button role="radio" aria-selected="${s.theme===k}" aria-checked="${s.theme===k}" data-a="theme" data-v="${k}">${l}</button>`).join("")}</div>
  ${tg("hc","Contraste renforcé")}${tg("motion","Animations","Démonstrations animées des exercices")}${tg("voice","Annonces vocales","Le nom de chaque étape est annoncé pendant la séance")}${tg("sound","Bips de fin d'étape")}${tg("vibrate","Vibrations")}
 </div>
 <h2>Notifications</h2><div class="card"><p style="margin:0"><b>Rappels de séance</b></p><p class="small sub" style="margin-bottom:0">Prévus dans une prochaine version. Aucune notification n'est envoyée pendant le test.</p></div>
 <h2>Abonnement</h2><div class="card"><p style="margin:0"><b>Version de test</b></p><p class="small sub" style="margin-bottom:0">Toutes les fonctions sont ouvertes pendant le test. La sécurité, l'arrêt d'une séance et la suppression des données resteront toujours gratuits.</p></div>
 <h2>Confidentialité</h2>
 <button class="li" data-a="privacy"><span class="ico">${ic("lock")}</span><span class="t"><b>Mes données</b><span>Ce qui est enregistré, où, et pourquoi</span></span>${ic("chev")}</button>
 <button class="li" data-a="export"><span class="ico">${ic("download")}</span><span class="t"><b>Exporter mes données</b><span>Fichier JSON lisible</span></span>${ic("chev")}</button>
 <button class="li" data-a="wipe"><span class="ico" style="color:var(--danger)">${ic("trash")}</span><span class="t"><b>Supprimer toutes mes données</b><span>Efface tout de ce téléphone</span></span>${ic("chev")}</button>
 <button class="li" data-a="safety"><span class="ico">${ic("shield")}</span><span class="t"><b>Sécurité</b><span>Quand arrêter, qui appeler</span></span>${ic("chev")}</button>
 <h2>Mode test</h2><div class="card">
  <p style="margin-top:0" class="small sub">Profils fictifs du dossier et simulation du temps, pour tester les adaptations sans attendre.</p>
  ${Object.entries(PERSONAS).map(([k,v]) => `<button class="li" data-a="persona" data-v="${k}"><span class="ico">${ic("profile")}</span><span class="t"><b>${v.t}</b><span>${v.s}</span></span>${ic("chev")}</button>`).join("")}
  <div class="divider"></div>
  <p class="small"><b>Date ${S.simOffset ? "simulée" : "réelle"} :</b> ${fmtLong(T())}</p>
  <div class="row wrap"><button class="btn sm ghost" data-a="sim" data-v="1">+1 jour</button><button class="btn sm ghost" data-a="sim" data-v="7">+1 semaine</button><button class="btn sm ghost" data-a="sim" data-v="14">+2 semaines</button>${S.simOffset ? `<button class="btn sm line" data-a="sim" data-v="0">Revenir à aujourd'hui</button>` : ""}</div>
 </div>
 <h2>À propos</h2><div class="card small"><p style="margin-top:0"><b>MOVENTHY</b> · version ${VERSION} · prototype privé</p><p class="sub">Nom de travail. Contenus en version 0.1, en attente de validation par un coach qualifié. Ne remplace pas un avis médical. Réservé aux adultes.</p><p class="sub" style="margin-bottom:0">Move. Grow. Evolve. — Bouger. Grandir. Évoluer.</p></div>`;
 return h;
}

/* ================= ACTIONS ================= */
A.tab = el => { TAB = el.dataset.v; WKOFF = 0; render(); window.scrollTo(0,0); $("view").focus({preventScroll:true}); };
A.back = () => popOv();
A.closeSheet = () => closeSheet();
A.adult = () => { S.adult = !S.adult; save(); renderOv(); };
A.startOnb = () => { if (!S.adult){ OV = []; S.discovery = false; render(); return; } startOnb(1, false); };
A.discover = () => { S.discovery = true; save(); OV = []; render(); };
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
 <p><b>Quoi ?</b> Tes préférences (objectif, jours, durée, lieux, matériel), ton plan, tes séances et le ressenti que tu choisis de donner.</p>
 <p><b>Ce qu'on ne demande pas :</b> poids, fréquence cardiaque, blessures, état de santé, position GPS.</p>
 <p><b>Pourquoi ?</b> Uniquement pour construire et adapter ton programme.</p>
 <p><b>Tes droits :</b> tu peux tout exporter ou tout supprimer à tout moment depuis Profil. Le ressenti est facultatif ; le refuser ne limite pas le coaching.</p>
 <p class="small sub">Prototype de test. Une version avec compte et synchronisation fera l'objet d'une notice détaillée (finalités, bases légales, durées, droits, réclamation auprès de la CNIL).</p>
 <button class="btn ghost" data-a="closeSheet">Fermer</button>`);
A.export = async () => {
 const data = JSON.stringify({app:"MOVENTHY", version:VERSION, exportedAt:new Date().toISOString(), profile:S.profile, plan:S.plan, sessions:S.sessions, log:S.log, myEvents:S.myEvents, favs:S.favs, settings:S.settings}, null, 2);
 const name = `moventhy-donnees-${T()}.json`;
 try { const file = new File([data], name, {type:"application/json"});
  if (navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:"Mes données MOVENTHY"}); return; } } catch(e){ if (e && e.name==="AbortError") return; }
 const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], {type:"application/json"})); a.download = name; document.body.appendChild(a); a.click(); a.remove(); toast("Export téléchargé");
};
A.wipe = () => openSheet(`<h3>Supprimer toutes tes données ?</h3><p>Programme, historique, réglages et événements ajoutés seront effacés de ce téléphone. C'est définitif.</p><div class="btns"><button class="btn ghost" data-a="closeSheet">Annuler</button><button class="btn danger" data-a="wipeOk">Tout supprimer</button></div>`);
A.wipeOk = () => { try { localStorage.removeItem(KEY); } catch(e){} S = fresh(); closeSheet(); OV = []; TAB = "today"; render(); toast("Données supprimées"); };
A.persona = el => {
 const P = clone(PERSONAS[el.dataset.v].p);
 if (P.horizon.type==="event"){ const e = evById(P.horizon.id); P.horizon = {type:"event", id:e.id, name:e.t, date:e.date, sport:e.sport, dist:e.dist}; }
 S.profile = P; S.sessions = []; S.log = []; S.lastMsgs = []; S.adult = true; createPlan(S); S.onboarded = true; S.discovery = false;
 save(); TAB = "today"; render(); window.scrollTo(0,0); toast(`Profil test : ${PERSONAS[el.dataset.v].t.split(",")[0]}`);
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
 if (k==="hdate"){ ONB.d.horizon.date = e.target.value || null; ONB.d.horizon.mode = null; renderOv(); }
});
document.addEventListener("change", e => { const k = e.target.dataset && e.target.dataset.in; if (k==="dep"){ EXV.dep = e.target.value; render(); } });
document.addEventListener("keydown", e => { if (e.key==="Escape"){ if (!$("sheetWrap").hidden) closeSheet(); else if (OV.length && !["welcome","player","finish","onb"].includes(OV[OV.length-1].k)) popOv(); } });
document.addEventListener("visibilitychange", () => {
 if (document.visibilityState==="visible"){ if (S.onboarded && !PL){ const m = rollover(S); if (m.length) S.lastMsgs = m; save(); render(); } if (PL && !PL.paused) wake(true); }
});
matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => applySettings());

/* ================= DÉMARRAGE ================= */
load();
if (S.onboarded){ const m = rollover(S); if (m.length) S.lastMsgs = m; save(); }
render();
if ("serviceWorker" in navigator && location.protocol==="https:") navigator.serviceWorker.register("sw.js").catch(() => {});
