/* MOVENTHY — démonstrations animées (silhouettes vectorielles, aucun fichier vidéo) */
"use strict";
const HZ_VB = "-110 -112 225 124", VT_VB = "-105 -200 225 212";

function scene(sc){
 const c = "var(--fig3)";
 if (sc==="chair") return `<g stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none"><line x1="-54" y1="-48" x2="-10" y2="-48"/><line x1="-50" y1="-48" x2="-50" y2="0"/><line x1="-14" y1="-48" x2="-14" y2="0"/><line x1="-54" y1="-48" x2="-58" y2="-104"/></g>`;
 if (sc==="wall") return `<rect x="78" y="-185" width="8" height="185" rx="2" fill="${c}"/>`;
 if (sc==="step") return `<rect x="10" y="-30" width="50" height="30" rx="3" fill="${c}"/>`;
 if (sc==="rower") return `<g stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none"><line x1="-75" y1="-12" x2="72" y2="-12"/><line x1="50" y1="-30" x2="50" y2="-6"/><circle cx="70" cy="-30" r="13"/></g>`;
 if (sc==="bike") return `<g stroke="${c}" stroke-width="4" stroke-linecap="round" fill="none"><line x1="-14" y1="-82" x2="2" y2="-30"/><line x1="2" y1="-30" x2="44" y2="-92"/><line x1="44" y1="-92" x2="50" y2="-100"/><line x1="2" y1="-30" x2="-34" y2="0"/><line x1="2" y1="-30" x2="40" y2="0"/><circle cx="6" cy="-30" r="15"/><line x1="-26" y1="-84" x2="-2" y2="-84"/></g>`;
 return "";
}
function figSVG(P){
 const g = k => P[k] || (k==="k2" ? P.k : k==="f2" ? P.f : k==="e2" ? P.e : k==="a2" ? P.a : null);
 const L = (a,b,w,c) => { const A=g(a), B=g(b); return `<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
 const foot = (k,c) => { const F=g(k); return `<line x1="${F[0].toFixed(1)}" y1="${F[1].toFixed(1)}" x2="${(F[0]+12).toFixed(1)}" y2="${Math.min(0,F[1]+9).toFixed(1)}" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`; };
 const M = "var(--fig)", B2 = "var(--fig2)", A = "var(--acc)";
 let s = "";
 if (P.k2 || P.e2){ s += L("p","k2",12,B2) + L("k2","f2",10,B2) + foot("f2",B2); }
 if (P.e2) s += L("n","e2",8,B2) + L("e2","a2",7,B2);
 if (P.s){ const n=g("n"), p=g("p"), sp=P.s; const cx = 2*sp[0]-(n[0]+p[0])/2, cy = 2*sp[1]-(n[1]+p[1])/2;
  s += `<path d="M${n[0].toFixed(1)} ${n[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}" stroke="${M}" stroke-width="17" fill="none" stroke-linecap="round"/>`; }
 else s += L("n","p",17,M);
 s += L("p","k",13,M) + L("k","f",11,M) + foot("f",M);
 s += L("n","e",8,A) + L("e","a",7,A) + `<circle cx="${g("h")[0].toFixed(1)}" cy="${g("h")[1].toFixed(1)}" r="10" fill="${M}"/>`;
 const [ax,ay] = g("a"), O = "var(--fig3)";
 if (P.o==="kb") s += `<circle cx="${(ax+6).toFixed(1)}" cy="${(ay+7).toFixed(1)}" r="8" fill="${O}"/><path d="M${ax.toFixed(1)} ${(ay+2).toFixed(1)}q6 -10 12 0" stroke="${O}" stroke-width="3" fill="none"/>`;
 if (P.o==="db") s += `<rect x="${(ax-9).toFixed(1)}" y="${(ay-3).toFixed(1)}" width="18" height="6" rx="2" fill="${O}"/><rect x="${(ax-11).toFixed(1)}" y="${(ay-6).toFixed(1)}" width="5" height="12" rx="1.5" fill="${O}"/><rect x="${(ax+6).toFixed(1)}" y="${(ay-6).toFixed(1)}" width="5" height="12" rx="1.5" fill="${O}"/>`;
 if (P.o==="band") s = `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="112" y2="-122" stroke="${O}" stroke-width="3"/><rect x="108" y="-185" width="8" height="185" rx="2" fill="${O}" opacity=".5"/>` + s;
 return s;
}
const lerpP = (A,B,t) => { const o = {o:A.o};
 for (const k of ["h","n","p","k","f","k2","f2","e","a","e2","a2","s"]){
  const fb = (P,k) => P[k] || (k==="k2"?P.k : k==="f2"?P.f : k==="e2"?P.e : k==="a2"?P.a : k==="s" ? [(P.n[0]+P.p[0])/2,(P.n[1]+P.p[1])/2] : null);
  if (!A[k] && !B[k]) continue; const a = fb(A,k), b = fb(B,k); o[k] = [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t]; }
 return o; };
const ground = `<line x1="-120" y1="0" x2="130" y2="0" stroke="var(--line)" stroke-width="2.5" stroke-linecap="round"/>`;
function exThumb(ex){ const P = POSES[ex.anim[ex.anim.length>2 ? 2 : ex.anim.length-1]];
 return `<svg viewBox="${ex.hz ? HZ_VB : VT_VB}" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${ground}${scene(ex.sc)}${figSVG(P)}</svg>`; }

let animRAF = null;
function stopAnim(){ cancelAnimationFrame(animRAF); }
function animate(el, ex, onPhase){
 stopAnim(); if (!el) return;
 el.setAttribute("viewBox", ex.hz ? HZ_VB : VT_VB);
 const seq = ex.anim, slow = ex.id==="respiration", hold = slow ? 1400 : 550, move = slow ? 2600 : 850, step = hold+move; let t0 = null;
 const bg = ground + scene(ex.sc);
 const reduce = document.documentElement.classList.contains("nomotion");
 if (reduce || seq.length<2){ el.innerHTML = bg + figSVG(POSES[seq[Math.min(seq.length-1, 1)]]); onPhase && onPhase(Math.min(seq.length-1,1)); return; }
 let last = -1;
 const frame = ts => {
  if (!el.isConnected) return;
  if (t0===null) t0 = ts;
  const t = (ts-t0) % (step*seq.length), i = Math.floor(t/step), r = t - i*step;
  let k = r<hold ? 0 : (r-hold)/move; k = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
  el.innerHTML = bg + figSVG(lerpP(POSES[seq[i]], POSES[seq[(i+1)%seq.length]], k));
  const cur = Math.min(ex.ph.length-1, k>.5 ? (i+1)%seq.length : i);
  if (cur!==last && onPhase){ last = cur; onPhase(cur); }
  animRAF = requestAnimationFrame(frame);
 };
 animRAF = requestAnimationFrame(frame);
}
