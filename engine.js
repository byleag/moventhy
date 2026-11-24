/* MOVENTHY — moteur de coaching déterministe (aucune génération libre d'exercices).
   1. sécurité/faisabilité  2. bloc adapté à l'objectif  3. répartition séances/repos
   4. exercices du catalogue compatibles  5. contrôle charges et conflits  6. explication + validation */
"use strict";

/* ---------- Dates (chaînes AAAA-MM-JJ, heure locale) ---------- */
const DAY = 864e5;
const pad = n => String(n).padStart(2,"0");
const iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const pd = s => { const [y,m,d] = s.split("-").map(Number); return new Date(y,m-1,d); };
const addD = (s,n) => { const d = pd(s); d.setDate(d.getDate()+n); return iso(d); };
const diffD = (a,b) => Math.round((pd(b)-pd(a))/DAY);
const dow = s => (pd(s).getDay()+6)%7;
const monday = s => addD(s,-dow(s));
const DOWS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const DOWL = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const MONTHS = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const MONTHL = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const fmtD = s => { const d = pd(s); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
const fmtLong = s => { const d = pd(s); return `${DOWL[dow(s)].toLowerCase()} ${d.getDate()} ${MONTHL[d.getMonth()]}`; };
const todayOf = st => { const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+(st.simOffset||0)); return iso(d); };
const hash = s => { let h = 7; for (const c of s) h = (h*31 + c.charCodeAt(0))|0; return Math.abs(h); };
const clamp = (x,a,b) => Math.max(a, Math.min(b, x));
const uid = () => Math.random().toString(36).slice(2,9);

/* ---------- Libellés ---------- */
const TYPES = {
 marche:{t:"Marche", hard:false}, course:{t:"Course à pied", hard:true}, renfo:{t:"Renforcement", hard:true},
 mobilite:{t:"Mobilité", hard:false}, hybride:{t:"Fitness hybride", hard:true}, cardio:{t:"Cardio doux", hard:false}
};
const PHASES = {
 initiation:{t:"Initiation", s:"Découvrir les gestes et installer l'habitude"},
 construction:{t:"Construction", s:"Augmenter progressivement"},
 preparation:{t:"Préparation", s:"Se rapprocher du format de l'objectif"},
 recuperation:{t:"Récupération", s:"Volume allégé pour assimiler", light:true},
 affutage:{t:"Affûtage", s:"Moins de volume pour arriver frais", light:true},
 evenement:{t:"Semaine de l'événement", s:"Séances légères, profite du jour J", light:true},
 maintien:{t:"Maintien", s:"Garder le rythme, sans échéance"}
};
const STATUS = {planned:"Prévue", done:"Terminée", partial:"Partielle", skipped:"Non effectuée", missed:"Non effectuée", cancelled:"Retirée"};
const RPE = ["Très facile","Facile","Correct","Difficile","Trop difficile"];
const stageLvl = st => st<=3 ? 1 : st<=7 ? 2 : 3;
const LVL_T = ["","Accessible","Intermédiaire","Soutenu"];

/* ---------- Contexte matériel ---------- */
function availEquip(profile, place, missing){
 const e = profile.equip || {};
 const list = place==="salle" ? (e.salle || GYM_DEFAULT) : place==="maison" ? (e.maison || []) : (e.exterieur || []);
 return list.filter(x => !(missing||[]).includes(x));
}
function makeCtx(profile, place, missing){
 const pr = profile.prefs || {};
 return {place, equip: availEquip(profile, place, missing), noImpact: !!pr.noImpact, noFloor: !!pr.noFloor};
}
function compatible(ex, ctx){
 if (ex.eq && !ex.eq.every(q => ctx.equip.includes(q))) return false;
 if (ex.any && !ex.any.some(q => ctx.equip.includes(q))) return false;
 if (ex.sol && (ctx.noFloor || ctx.place==="exterieur")) return false;
 if (ex.imp && ctx.noImpact) return false;
 return true;
}
const canRun = ctx => ctx.place==="exterieur" || ctx.equip.includes("tapis_course");

/* ---------- Construction d'une séance ---------- */
const STEP = (ex, dur, extra) => Object.assign({ex, dur}, extra||{});
function fill(list, budget, ctx){
 const items = list.filter(([id]) => compatible(EXI[id], ctx));
 if (!items.length) items.push(["respiration", 60]);
 const out = []; let rem = budget, i = 0, guard = 0;
 while (rem > 0 && guard++ < 60){
  const [id, d] = items[i % items.length]; let dur = Math.min(d, rem);
  if (rem - dur < 25) dur = rem;
  if (out.length && out[out.length-1].ex===id) out[out.length-1].dur += dur; else out.push(STEP(id, dur));
  rem -= dur; i++;
 }
 return out;
}
function warmup(type, budget, ctx){
 if ((type==="course" || type==="marche") && canRun(ctx)){
  if (budget < 150) return [STEP("marche_lente", budget)];
  const extra = [["genoux_hauts",30],["talons_fesses",30]].filter(([id]) => compatible(EXI[id],ctx));
  const used = extra.reduce((a,[,d])=>a+d,0);
  return [STEP("marche_lente", budget-used), ...extra.map(([id,d]) => STEP(id,d))];
 }
 const list = [];
 if (type==="hybride"){ if (ctx.equip.includes("rameur")) list.push(["rameur",120]); else if (ctx.equip.includes("velo")) list.push(["velo",120]); }
 list.push(["genoux_hauts",60],["cercles_bras",45],["squat_bras",45],["talons_fesses",45],["rotation_buste",45]);
 return fill(list, budget, ctx);
}
function cooldown(type, budget, ctx){
 const list = [];
 if ((type==="course" || type==="marche") && canRun(ctx)) list.push(["marche_lente", Math.min(150, Math.max(60, Math.round(budget/2/15)*15))]);
 list.push(["ischios_debout",45],["fente_etirement",45],["mollets_etirement",45],["enfant",45],["respiration",45]);
 return fill(list, budget, ctx);
}
const RUN = [null,[30,90],[60,90],[60,60],[90,60],[120,60],[180,90],[300,90],[480,90],[600,60],[0,0]];
function mainRun(stage, budget, variant){
 const out = [];
 if (stage >= 10){
  if (variant==="fartlek" && budget >= 600){ let rem = budget;
   while (rem >= 180){ out.push(STEP("course_vive",60)); out.push(STEP("course_facile",120)); rem -= 180; }
   if (rem) out.push(STEP("course_facile", rem)); return out; }
  return [STEP("course_facile", budget)];
 }
 const [r,w] = RUN[stage]; let rem = budget;
 while (rem >= r + 30){ out.push(STEP("course_facile", r)); rem -= r; const wd = Math.min(w, rem); if (wd>0){ out.push(STEP("marche_active", wd)); rem -= wd; } }
 if (rem > 0){ if (out.length) out[out.length-1].dur += rem; else out.push(STEP("marche_active", rem)); }
 return out;
}
function mainWalk(stage, budget){
 if (stage < 5) return [STEP("marche_active", budget)];
 const out = []; let rem = budget;
 while (rem >= 180){ out.push(STEP("marche_active",120)); out.push(STEP("marche_vive",60)); rem -= 180; }
 if (rem) out.push(STEP("marche_active", rem)); return out;
}
function pickEx(pool, ctx, lvl, seed, used){
 const c = pool.filter(e => compatible(e, ctx) && !used.has(e.id));
 if (!c.length) return null;
 const score = e => Math.abs(e.l - lvl) + (e.l > lvl ? .6 : 0) - ((e.eq||e.any) ? .3 : 0);
 c.sort((a,b) => score(a)-score(b) || a.id.localeCompare(b.id));
 const best = c.filter(e => score(e) - score(c[0]) < .05);
 return best[seed % best.length];
}
function circuit(stations, budget, work, rest, roundRest){
 let n = stations.length;
 const unit = k => k*work + (k-1)*rest;
 while (n > 2 && unit(n) > budget) n--;
 let st = stations.slice(0, n), w = work, r = rest;
 if (unit(n) > budget){ const k = budget / unit(n); w = Math.max(20, Math.floor(work*k/5)*5); r = Math.max(10, Math.floor(rest*k/5)*5); }
 const u = n*w + (n-1)*r;
 const rounds = clamp(Math.floor((budget + roundRest)/(u + roundRest)), 1, 5);
 // Répartir le temps restant sur le travail (+15 s max par atelier)
 const spare = budget - (rounds*u + (rounds-1)*roundRest);
 if (spare > 0) w = Math.min(w + 15, w + Math.floor(spare/(n*rounds)/5)*5);
 const blocks = [];
 for (let t=0; t<rounds; t++){
  const steps = [];
  st.forEach((e,i) => { steps.push(STEP(e.id, w, {round:t+1})); if (i < n-1) steps.push({rest:true, dur:r}); });
  if (t < rounds-1) steps.push({rest:true, dur:roundRest, between:true});
  blocks.push({name: rounds>1 ? `Circuit · tour ${t+1}/${rounds}` : "Circuit", steps});
 }
 return blocks;
}
function mainStrength(stage, budget, ctx, seed){
 const lvl = stageLvl(stage), used = new Set(), out = [];
 const zones = ["bas","pousser","charniere","tirer","gainage","mollets"];
 for (const z of zones){
  let pool = EX.filter(e => e.d==="renfo" && e.z===z);
  if (z==="charniere" && !pool.some(e => compatible(e,ctx))) pool = EX.filter(e => e.d==="renfo" && e.z==="bas");
  if (z==="tirer" && !pool.some(e => compatible(e,ctx))) pool = EX.filter(e => e.id==="equilibre");
  const e = pickEx(pool, ctx, lvl, seed + out.length, used);
  if (e){ used.add(e.id); out.push(e); }
 }
 const n = budget < 360 ? 3 : budget < 720 ? 4 : budget < 1200 ? 5 : 6;
 const [w,r] = stage<=3 ? [30,30] : stage<=7 ? [40,20] : [45,15];
 return circuit(out.slice(0, n), budget, w, r, stage<=3 ? 75 : 60);
}
function mainHybrid(stage, budget, ctx, seed){
 const lvl = stageLvl(stage), used = new Set();
 const cardioOrder = ["rameur","velo", stage>=4 ? "course_place" : null, "genoux_hauts","squat_bras","talons_fesses"].filter(Boolean)
  .map(id => EXI[id]).filter(e => compatible(e,ctx));
 const strength = [];
 for (const z of ["bas","pousser","porter","tirer","gainage","charniere"]){
  const e = pickEx(EX.filter(x => x.d==="renfo" && x.z===z), ctx, lvl, seed+strength.length, used);
  if (e){ used.add(e.id); strength.push(e); }
 }
 const n = budget < 480 ? 4 : 6, st = [];
 let ci = 0, si = 0;
 for (let i=0; i<n; i++){
  if (i%2===0 && cardioOrder.length) st.push(cardioOrder[(seed + ci++) % cardioOrder.length]);
  else if (strength[si]) st.push(strength[si++]);
 }
 const [w,r] = stage<=3 ? [40,20] : [45,15];
 return circuit(st, budget, w, r, 60);
}
function mainCardio(budget, ctx, seed){
 const ids = ["genoux_hauts","squat_bras","talons_fesses","cercles_bras","rameur","velo"].filter(id => compatible(EXI[id],ctx));
 const st = ids.slice(0,4).map(id => EXI[id]);
 return circuit(st, budget, 40, 20, 60);
}
function mainMobility(budget, ctx){
 return [{name:"Mobilité", steps: fill([["cercles_bras",60],["rotation_buste",60],["chat_vache",60],["fente_etirement",60],["ischios_debout",60],["enfant",60],["mollets_etirement",60]], budget, ctx)}];
}
const CAPS = {course:[30,40,60], marche:[40,60,60], renfo:[30,45,60], hybride:[25,40,50], mobilite:[30,30,45], cardio:[30,40,45]};
const capFor = (type, stage) => CAPS[type][stage<=3 ? 0 : stage<=6 ? 1 : 2];

/* opts: {date, type, minutes, place, stage, phase, missing, variant, reason, forcedPlace} */
function buildSession(profile, opts){
 let {type, place} = opts; const notes = [];
 let ctx = makeCtx(profile, place, opts.missing);
 if (type==="course" && ctx.noImpact){ type = "marche"; notes.push("Course remplacée par de la marche : tu as choisi d'éviter les impacts."); }
 if ((type==="course" || type==="marche") && !canRun(ctx)){
  if (!opts.forcedPlace && (profile.places||[]).includes("exterieur")){ place = "exterieur"; ctx = makeCtx(profile, place, opts.missing); notes.push("Séance placée en extérieur : c'est le seul lieu où elle est possible."); }
  else { notes.push(`${TYPES[type].t} impossible ici sans tapis de course : cardio doux à la place.`); type = "cardio"; }
 }
 const light = opts.phase && PHASES[opts.phase] && PHASES[opts.phase].light;
 let stage = clamp(opts.stage || 1, 1, 10);
 if (light) stage = Math.max(1, stage-1);
 const cap = capFor(type, stage);
 let minutes = Math.max(10, Math.min(opts.minutes, cap));
 if (light) minutes = Math.max(10, Math.round(minutes*0.75/5)*5);
 if (minutes < opts.minutes && !light) notes.push(`Séance de ${minutes} min sur ton créneau de ${opts.minutes} : on augmente progressivement.`);
 const total = minutes*60;
 const wu = Math.max(120, Math.round(total*.15/15)*15), cdBase = Math.max(120, Math.round(total*.12/15)*15);
 const budget = total - wu - cdBase;
 const seed = hash((opts.date||"") + type);
 let main;
 if (type==="course") main = [{name: stage>=10 ? "Course" : "Alternance marche / course", steps: mainRun(stage, budget, opts.variant)}];
 else if (type==="marche") main = [{name:"Marche", steps: mainWalk(stage, budget)}];
 else if (type==="renfo") main = mainStrength(stage, budget, ctx, seed);
 else if (type==="hybride") main = mainHybrid(stage, budget, ctx, seed);
 else if (type==="cardio") main = mainCardio(budget, ctx, seed);
 else main = mainMobility(budget, ctx);
 const mainDur = main.reduce((a,b) => a + b.steps.reduce((x,s)=>x+s.dur,0), 0);
 const cd = cdBase + (budget - mainDur);
 const blocks = [{name:"Échauffement", steps: warmup(type, wu, ctx)}, ...main, {name:"Retour au calme", steps: cooldown(type, cd, ctx)}];
 const exIds = [...new Set(blocks.flatMap(b => b.steps.filter(s=>!s.rest).map(s => s.ex)))];
 const equipUsed = [...new Set(exIds.flatMap(id => { const e = EXI[id]; return (e.eq||[]).concat((e.any||[]).filter(q => ctx.equip.includes(q)).slice(0,1)); }))];
 return {
  id: "s" + uid(), date: opts.date, type, place, minutes: Math.round(blocks.reduce((a,b)=>a+b.steps.reduce((x,s)=>x+s.dur,0),0)/60),
  asked: opts.minutes, stage, phase: opts.phase || null, status: "planned", blocks, equipUsed, notes,
  title: sessionTitle(type, stage, opts.variant), variant: opts.variant || null, missing: opts.missing || [], reason: opts.reason || null, mod: !!opts.reason
 };
}
function sessionTitle(type, stage, variant){
 if (type==="course") return stage>=10 ? (variant==="fartlek" ? "Course avec variations" : "Course facile") : "Alternance marche / course";
 if (type==="marche") return stage>=5 ? "Marche avec accélérations" : "Marche active";
 if (type==="renfo") return "Renforcement tout le corps";
 if (type==="hybride") return "Circuit hybride";
 if (type==="cardio") return "Cardio doux sans impact";
 return "Mobilité et détente";
}

/* ---------- Programme : semaine glissante ---------- */
const startStage = (level, ease) => clamp(({debutant:1, reprise:2, regulier:4}[level]||1) + ((ease||3)-3), 1, 6);
function primaryDisc(profile){
 const h = profile.horizon || {};
 if ((h.type==="event" || h.type==="date") && h.sport) return h.sport==="hybride" ? "hybride" : h.sport;
 return (profile.disc && profile.disc[0]) || "marche";
}
const COMPLEMENT = {course:"renfo", marche:"mobilite", renfo:"marche", mobilite:"marche", hybride:"course"};
function sessionsPerWeek(profile){
 const cap = {debutant:3, reprise:3, regulier:5}[profile.level] || 3;
 return Math.min((profile.days||[]).length, profile.intent==="reprendre" ? Math.min(cap,3) : cap);
}
function chooseDays(days, n){
 const d = [...days].sort((a,b)=>a-b);
 if (n >= d.length) return d;
 if (n <= 0) return [];
 let best = null, bestScore = -1;
 const combos = (start, acc) => {
  if (acc.length===n){
   const gaps = acc.map((x,i) => (i<n-1 ? acc[i+1]-x : acc[0]+7-x));
   const sc = Math.min(...gaps)*100 - gaps.reduce((a,g)=>a+(g-7/n)**2,0);
   if (sc > bestScore){ bestScore = sc; best = acc.slice(); } return; }
  for (let i=start; i<d.length; i++){ acc.push(d[i]); combos(i+1, acc); acc.pop(); }
 };
 combos(0, []); return best;
}
function weekTypes(profile, n){
 const prim = primaryDisc(profile);
 let others = (profile.disc||[]).filter(x => x!==prim);
 const complementAdded = !others.length && n > 1;
 if (complementAdded) others = [COMPLEMENT[prim]];
 const out = []; let j = 0;
 for (let i=0; i<n; i++) out.push(i%2===0 ? prim : others[j++ % others.length]);
 if (n===4 && !(profile.disc||[]).includes("mobilite") && prim!=="mobilite" && profile.intent!=="evenement") out[3] = "mobilite";
 return {types: out, prim, complementAdded, complement: complementAdded ? others[0] : null};
}
function phaseFor(profile, plan, weekStart){
 const wi = Math.max(0, Math.floor(diffD(plan.cycleStart, weekStart)/7));
 const h = profile.horizon || {}, novice = profile.level!=="regulier";
 if ((h.type==="date" || h.type==="event") && h.date){
  const left = Math.floor(diffD(weekStart, h.date)/7), total = Math.max(1, Math.ceil(diffD(plan.cycleStart, h.date)/7));
  if (left < 0) return "maintien";
  if (left===0) return "evenement";
  if (left===1 && total >= 4) return "affutage";
  if (wi%4===3 && left > 2) return "recuperation";
  if (wi < 2 && novice) return "initiation";
  if (left <= Math.max(2, Math.round(total/3))) return "preparation";
  return "construction";
 }
 if (h.type==="duration" && h.weeks && wi >= h.weeks) return "maintien";
 if (wi%4===3) return "recuperation";
 if (wi < 3 && novice && !plan.cycled) return "initiation";
 return "construction";
}
function sessionsIn(st, from, to){ return st.sessions.filter(s => s.date >= from && s.date <= to); }

/* Génère (ou régénère) la semaine à partir de fromDate. Ne touche jamais aux séances passées ou réalisées. */
function generateWeek(st, weekStart, fromDate, reason){
 const p = st.profile, plan = st.plan; if (!p || !plan || plan.paused) return [];
 const weekEnd = addD(weekStart, 6), from = fromDate > weekStart ? fromDate : weekStart;
 st.sessions = st.sessions.filter(s => !(s.status==="planned" && s.date >= from && s.date <= weekEnd && s.plan));
 const phase = phaseFor(p, plan, weekStart);
 const n = sessionsPerWeek(p);
 const days = chooseDays(p.days || [], n);
 const {types} = weekTypes(p, n);
 const slots = days.map((d,i) => ({d, type: types[i]}));
 // Éviter deux séances intenses consécutives : échange avec une séance légère si possible
 for (let i=1; i<slots.length; i++){
  const a = slots[i-1], b = slots[i];
  if (b.d - a.d === 1 && TYPES[a.type].hard && TYPES[b.type].hard){
   const k = slots.findIndex((x,j) => j>i && !TYPES[x.type].hard);
   if (k > 0){ const t = b.type; b.type = slots[k].type; slots[k].type = t; } else b.easy = true;
  }
 }
 const out = []; let courseCount = 0;
 for (const sl of slots){
  const date = addD(weekStart, sl.d);
  if (date < from) { if (sl.type==="course") courseCount++; continue; }
  if (st.sessions.some(s => s.date===date && s.plan)) continue; // pas de doublon
  const place = (p.dayPlace && p.dayPlace[sl.d]) || defaultPlace(p, sl.type);
  let stage = (plan.stage[sl.type] || 1) - (sl.easy ? 1 : 0);
  const variant = sl.type==="course" && courseCount++ >= 1 && stage >= 10 && p.level==="regulier" ? "fartlek" : null;
  const s = buildSession(p, {date, type: sl.type, minutes: p.minutes, place, stage: Math.max(1,stage), phase, variant, forcedPlace: !!(p.dayPlace && p.dayPlace[sl.d])});
  s.plan = true; if (sl.easy) s.notes.push("Version plus facile : la veille est déjà une séance intense.");
  out.push(s); st.sessions.push(s);
 }
 st.sessions.sort((a,b) => a.date.localeCompare(b.date));
 plan.weekStart = weekStart;
 if (reason) logChange(st, reason);
 return out;
}
function defaultPlace(p, type){
 const pl = p.places && p.places.length ? p.places : ["maison"];
 if ((type==="course" || type==="marche") && pl.includes("exterieur")) return "exterieur";
 if ((type==="renfo" || type==="hybride") && pl.includes("salle")) return "salle";
 return pl.includes("maison") ? "maison" : pl[0];
}
function logChange(st, reason){ st.log.unshift({at: todayOf(st), t: reason}); st.log = st.log.slice(0, 60); }

function createPlan(st){
 const p = st.profile, t = todayOf(st);
 const s0 = startStage(p.level, p.ease);
 st.plan = {start: t, cycleStart: monday(t), weekStart: monday(t), paused: false, cycled: false,
  stage: {marche: Math.min(10, s0+1), course: s0, renfo: s0, mobilite: s0, hybride: s0, cardio: s0}, dismissed: {}};
 generateWeek(st, monday(t), t, "Premier programme créé");
}

/* Passage de semaine : bilan sans culpabilisation, progression ou maintien */
function rollover(st){
 if (!st.plan || !st.profile) return [];
 const t = todayOf(st), msgs = [];
 st.sessions.forEach(s => { if (s.status==="planned" && s.date < t) s.status = "missed"; });
 const cur = monday(t);
 let guard = 0;
 while (st.plan.weekStart < cur && guard++ < 200){
  const ws = st.plan.weekStart, we = addD(ws, 6);
  const wk = sessionsIn(st, ws, we).filter(s => s.plan && s.status!=="cancelled");
  if (wk.length){
   const score = wk.reduce((a,s) => a + (s.status==="done" ? 1 : s.status==="partial" ? .5 : 0), 0) / wk.length;
   const tooHard = wk.some(s => s.rpe===5);
   const phase = phaseFor(st.profile, st.plan, ws);
   if (score >= .7 && !tooHard && !PHASES[phase].light){
    const ups = [...new Set(wk.filter(s => s.status==="done").map(s => s.type))];
    ups.forEach(ty => { st.plan.stage[ty] = Math.min(10, (st.plan.stage[ty]||1) + 1); });
    if (ups.length) msgs.push(`Semaine du ${fmtD(ws)} bien remplie : progression sur ${ups.map(x=>TYPES[x].t.toLowerCase()).join(", ")}.`);
   }
  }
  st.plan.weekStart = addD(ws, 7);
  if (Math.floor(diffD(st.plan.cycleStart, st.plan.weekStart)/7) >= 4) st.plan.cycled = true;
 }
 if (!st.sessions.some(s => s.plan && s.date >= cur && s.date <= addD(cur,6) && (s.status!=="missed"))){
  generateWeek(st, cur, t);
 }
 msgs.forEach(m => logChange(st, m));
 return msgs;
}

/* ---------- Alertes et propositions ---------- */
function lastActive(st){
 const d = st.sessions.filter(s => s.status==="done" || s.status==="partial").map(s => s.date).sort().pop();
 return d || (st.plan && st.plan.start);
}
function notices(st){
 const out = [], t = todayOf(st), p = st.profile, plan = st.plan; if (!p || !plan) return out;
 const la = lastActive(st);
 if (la && diffD(la, t) >= 14 && !plan.paused && plan.dismissed.comeback !== la) out.push({id:"comeback", key: la, days: diffD(la, t)});
 const h = p.horizon || {};
 if ((h.type==="date" || h.type==="event") && h.date && h.date < t && plan.dismissed.passed !== h.date) out.push({id:"passed", key: h.date});
 if (h.type==="duration" && h.weeks && Math.floor(diffD(plan.cycleStart, monday(t))/7) >= h.weeks && plan.dismissed.duration !== String(h.weeks)) out.push({id:"duration", key: String(h.weeks)});
 return out;
}
function applyComeback(st){
 const t = todayOf(st);
 Object.keys(st.plan.stage).forEach(k => st.plan.stage[k] = Math.max(1, st.plan.stage[k]-2));
 st.plan.cycleStart = monday(t); st.plan.cycled = false;
 st.plan.dismissed.comeback = lastActive(st);
 generateWeek(st, monday(t), t, "Reprise en douceur après une pause : niveau allégé, sans rattrapage des séances passées");
}

/* ---------- Faisabilité d'une échéance ---------- */
function weeksNeeded(profile, plan, sport, dist){
 const stage = plan ? (plan.stage[sport==="hybride" ? "hybride" : sport] || 1) : startStage(profile.level, profile.ease);
 let need;
 if (sport==="course"){ need = Math.max(3, 11 - stage); if (dist && dist > 5) need += 4; if (dist && dist > 12) need += 8; }
 else if (sport==="hybride") need = {debutant:8, reprise:6, regulier:4}[profile.level] || 8;
 else need = dist && dist > 15 ? 6 : dist && dist > 8 ? 4 : 2;
 if ((profile.days||[]).length < 2) need = Math.ceil(need*1.3);
 return need;
}
function feasibility(st, profile, sport, dist, date){
 const t = todayOf(st);
 if (!date) return {ok:false, unknown:true};
 const days = diffD(t, date), weeks = Math.floor(days/7);
 if (days < 0) return {ok:false, past:true};
 const need = weeksNeeded(profile, st.plan, sport, dist);
 return {ok: weeks >= need, weeks, need, tooClose: days < 7, later: addD(t, need*7)};
}

/* ---------- Adaptations (aperçu avant validation) ---------- */
function rebuild(st, s, changes){
 const p = st.profile;
 const o = Object.assign({date: s.date, type: s.type, minutes: s.asked || s.minutes, place: s.place, stage: s.stage, phase: s.phase, missing: s.missing, variant: s.variant}, changes);
 const n = buildSession(p, o); n.plan = s.plan; return n;
}
function moveOptions(st, s){
 const t = todayOf(st), ws = monday(s.date), out = [];
 for (let i=0; i<7; i++){
  const d = addD(ws, i); if (d < t || d===s.date) continue;
  const busy = st.sessions.some(x => x.date===d && x.id!==s.id && x.status!=="cancelled" && x.status!=="missed");
  const nb = st.sessions.filter(x => x.id!==s.id && x.status==="planned" && Math.abs(diffD(x.date, d))===1 && TYPES[x.type].hard);
  out.push({date:d, busy, warn: !busy && TYPES[s.type].hard && nb.length>0});
 }
 return out;
}
function replaceSession(st, oldS, newS, reason){
 const i = st.sessions.findIndex(x => x.id===oldS.id);
 newS.reason = reason; newS.mod = true;
 if (i >= 0) st.sessions[i] = newS; else st.sessions.push(newS);
 st.sessions.sort((a,b) => a.date.localeCompare(b.date));
 logChange(st, reason);
}
function lightenAfterHard(st, s){
 st.plan.stage[s.type] = Math.max(1, (st.plan.stage[s.type]||1) - 1);
 const t = todayOf(st), we = addD(monday(t), 6);
 st.sessions.filter(x => x.status==="planned" && x.type===s.type && x.date > s.date && x.date <= we).forEach(x => {
  const n = rebuild(st, x, {stage: st.plan.stage[s.type]}); replaceSession(st, x, n, `Séance du ${fmtD(x.date)} allégée après une séance trop difficile`);
 });
}
function restAfterHard(st, s){
 const nx = st.sessions.find(x => x.status==="planned" && x.date > s.date && diffD(s.date, x.date) <= 2);
 if (!nx) return false;
 const n = rebuild(st, nx, {type:"mobilite", minutes: Math.min(15, nx.asked||nx.minutes)});
 replaceSession(st, nx, n, `Récupération : séance du ${fmtD(nx.date)} remplacée par de la mobilité`);
 return true;
}

if (typeof module !== "undefined") module.exports = {};
