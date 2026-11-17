// =============================================================
//  FONCTIONNEMENT DU SITE
//  (pas besoin de modifier ce fichier pour ajouter du contenu)
// =============================================================
(function () {
  const S = window.SITE;
  const CFG = S.config;
  const F = S.fondamentaux;
  const app = document.getElementById("app");

  // ---------- Progression (navigateur, sans compte) ----------
  const progressionVide = () => ({ lecons: {}, examens: {}, historique: {}, erreurs: {}, });
  let P = null;
  P = { lecons: {}, examens: {}, historique: {}, erreurs: {} };
  P.historique = P.historique || {}; P.erreurs = P.erreurs || {};
  // ---------- Compte et sauvegarde en ligne (Firebase, voir js/cloud.js) ----------
  const CLOUD = window.CLOUD;
  // Rien n'est enregistré dans le navigateur : la progression vit sur le compte,
  // et il faut se reconnecter à chaque visite.
  let COMPTE = null;   // { id, nom } quand on est connecté
  let minuteurCloud = null, etatCloud = "";
  function envoyerCloud() {
    if (!CLOUD || !COMPTE) return;
    clearTimeout(minuteurCloud);
    minuteurCloud = setTimeout(() => {
      majEtatCloud("Enregistrement…");
      CLOUD.sauver(COMPTE.id, COMPTE.nom, P).then(() => majEtatCloud("Progression enregistrée en ligne")).catch(() => majEtatCloud("Enregistrement en ligne impossible pour l'instant"));
    }, 800);
  }
  function majEtatCloud(t) { etatCloud = t; const e = document.getElementById("compte-etat"); if (e) e.textContent = t; }
  // Fusion : on garde le meilleur des deux progressions
  function fusion(a, b) {
    const r = { lecons: Object.assign({}, a.lecons, b.lecons), examens: Object.assign({}, a.examens), historique: {}, erreurs: {} };
    // historique : toutes les tentatives des deux côtés, sans doublon, les 50 dernières par cours
    new Set([...Object.keys(a.historique || {}), ...Object.keys(b.historique || {})]).forEach(c => {
      const vu = {}, l = [...((a.historique || {})[c] || []), ...((b.historique || {})[c] || [])].filter(t => t && !vu[t.d] && (vu[t.d] = 1));
      r.historique[c] = l.sort((x, y) => x.d - y.d).slice(-50);
    });
    // erreurs : le plus grand nombre de chaque côté
    [a.erreurs || {}, b.erreurs || {}].forEach(src => Object.keys(src).forEach(c => {
      r.erreurs[c] = r.erreurs[c] || {};
      Object.keys(src[c]).forEach(q => {
        const x = r.erreurs[c][q], y = src[c][q];
        r.erreurs[c][q] = !x ? Object.assign({}, y) : { t: y.t || x.t, v: Math.max(x.v || 0, y.v || 0), n: Math.max(x.n || 0, y.n || 0) };
      });
    }));
    Object.keys(b.examens || {}).forEach(k => {
      const x = r.examens[k], y = b.examens[k];
      r.examens[k] = !x ? y : { reussi: !!(x.reussi || y.reussi), meilleur: Math.max(x.meilleur || 0, y.meilleur || 0), tentatives: Math.max(x.tentatives || 0, y.tentatives || 0) };
    });
    return r;
  }
  function save() { envoyerCloud(); }

  // ---------- Outils ----------
  function idQ(texte) { let h = 5381; for (let i = 0; i < texte.length; i++) h = ((h << 5) + h + texte.charCodeAt(i)) >>> 0; return "q" + h.toString(36); }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function melange(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const pct = x => Math.round(x * 100) + " %";
  const pluriel = (n, mot) => n + " " + mot + (n > 1 ? "s" : "");

  // ---------- Badges (un par cours, gagné à la réussite de l'examen) ----------
  const COULEURS = ["#2f5bea", "#e8524a", "#14935f", "#7445d6", "#e08a00", "#0e8fc4", "#db2777", "#475569"];
  const FORMES = [
    '<circle cx="32" cy="32" r="27"/>',
    '<polygon points="32,4 56,18 56,46 32,60 8,46 8,18"/>',
    '<polygon points="32,3 61,32 32,61 3,32"/>',
    '<path d="M32 4 L56 12 V31 C56 45 46 54 32 60 C18 54 8 45 8 31 V12 Z"/>',
    '<polygon points="21,4 43,4 60,21 60,43 43,60 21,60 4,43 4,21"/>',
    '<path d="M32 3 L40 22 L60 23 L45 37 L50 58 L32 47 L14 58 L19 37 L4 23 L24 22 Z"/>',
    '<path d="M32 5 L60 54 Q61 59 56 59 L8 59 Q3 59 4 54 Z"/>'
  ];
  // Relance une animation CSS sur un élément (après un clic)
  function anim(el, cls) {
    if (!el) return;
    el.classList.remove("a-page", "a-droite", "a-gauche", "a-bon", "a-faux", "a-pop");
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function badge(i, etat, taille) {
    taille = taille || 64;
    const c = COULEURS[i % COULEURS.length], f = FORMES[i % FORMES.length];
    const ty = i % FORMES.length === 5 ? 40 : i % FORMES.length === 6 ? 47 : 38;
    let corps;
    if (etat === "gagne") corps = `<g fill="${c}" stroke="#fff" stroke-width="3" stroke-linejoin="round">${f}</g><g fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2.5" stroke-linejoin="round" transform="translate(32 32) scale(.66) translate(-32 -32)">${f}</g><text x="32" y="${ty}" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="800" font-size="17" fill="#fff">${i + 1}</text>`;
    else if (etat === "ouvert") corps = `<g fill="#fff" stroke="${c}" stroke-width="3.5" stroke-linejoin="round">${f}</g><text x="32" y="${ty}" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="800" font-size="17" fill="${c}">${i + 1}</text>`;
    else corps = `<g fill="#eceef5" stroke="#c4c8da" stroke-width="2.5" stroke-dasharray="5 4" stroke-linejoin="round">${f}</g><text x="32" y="${ty}" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="700" font-size="16" fill="#a3a8c2">${i + 1}</text>`;
    return `<svg width="${taille}" height="${taille}" viewBox="0 0 64 64" aria-hidden="true">${corps}</svg>`;
  }

  // Badge d'un cours de format : un écusson aux couleurs du format
  function badgeFormat(fmt, etat, taille) {
    taille = taille || 64;
    const b = fmt.badge || { couleur: "#475569", texte: fmt.nom }, c = b.couleur;
    const forme = `<path d="M10 14 H54 Q60 14 60 20 V40 Q60 46 54 46 H40 L32 56 L24 46 H10 Q4 46 4 40 V20 Q4 14 10 14 Z"/>`;
    const fs = b.texte.length > 2 ? 16 : 18;
    let corps;
    if (etat === "gagne") corps = `<g fill="${c}" stroke="#fff" stroke-width="3" stroke-linejoin="round">${forme}</g><g fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2.5" transform="translate(32 32) scale(.7) translate(-32 -32)">${forme}</g><text x="32" y="36" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="800" font-size="${fs}" fill="#fff">${b.texte}</text>`;
    else if (etat === "ouvert") corps = `<g fill="#fff" stroke="${c}" stroke-width="3.5" stroke-linejoin="round">${forme}</g><text x="32" y="36" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="800" font-size="${fs}" fill="${c}">${b.texte}</text>`;
    else corps = `<g fill="#eceef5" stroke="#c4c8da" stroke-width="2.5" stroke-dasharray="5 4" stroke-linejoin="round">${forme}</g><text x="32" y="36" text-anchor="middle" font-family="Lexend,sans-serif" font-weight="700" font-size="${fs}" fill="#a3a8c2">${b.texte}</text>`;
    return `<svg width="${taille}" height="${taille}" viewBox="0 0 64 64" aria-hidden="true">${corps}</svg>`;
  }

  // ---------- Règles de déverrouillage ----------
  // ---------- Parcours : les Fondamentaux, puis un parcours par format ----------
  const fondamentauxFinisRaw = () => F.cours.every(c => !!(P.examens[c.id] && P.examens[c.id].reussi));
  const PARCOURS = [Object.assign({ id: "fondamentaux", href: "#fondamentaux", court: "Fondamentaux", ouvert: () => true }, F)];
  (S.formats || []).forEach(f => {
    const d = S.parcoursFormats && S.parcoursFormats[f.id];
    if (d) PARCOURS.push(Object.assign({ id: "parcours-" + f.id, href: "#cours-" + d.cours[0].id, court: "Format " + f.nom, format: f, ouvert: () => fondamentauxFinisRaw() }, d));
  });
  const parcoursDe = c => PARCOURS.find(p => p.cours.includes(c));
  const parcoursFormat = f => PARCOURS.find(p => p.format === f);
  const lienFormat = f => { const p = parcoursFormat(f); return p ? p.href : "#accueil"; };
  const filCours = c => { const par = parcoursDe(c), i = par.cours.indexOf(c); return par.format ? `<a href="#cours-${c.id}">${esc(par.court)}</a>` : `<a href="${par.href}">${esc(par.court)}</a> / <a href="#cours-${c.id}">Cours ${i + 1}</a>`; };
  const coursIndex = c => parcoursDe(c).cours.indexOf(c);
  const badgeCours = (c, etat, taille) => { const par = parcoursDe(c); return par.format ? badgeFormat(par.format, etat, taille) : badge(par.cours.indexOf(c), etat, taille); };
  const cleLecon = (c, l) => c.id + "/" + l.id;
  const leconFaite = (c, l) => !!P.lecons[cleLecon(c, l)];
  const examenReussi = c => !!(P.examens[c.id] && P.examens[c.id].reussi);
  const coursOuvert = c => { const par = parcoursDe(c), i = par.cours.indexOf(c); return i === 0 ? par.ouvert() : examenReussi(par.cours[i - 1]); };
  const leconOuverte = (c, j) => coursOuvert(c) && (j === 0 || leconFaite(c, c.lecons[j - 1]));
  const examenOuvert = c => coursOuvert(c) && c.lecons.every(l => leconFaite(c, l));
  const fondamentauxFinis = () => F.cours.every(examenReussi);
  const etatBadge = c => examenReussi(c) ? "gagne" : coursOuvert(c) ? "ouvert" : "ferme";
  function progression(c) {
    const total = c.lecons.length + 1;
    const n = c.lecons.filter(l => leconFaite(c, l)).length + (examenReussi(c) ? 1 : 0);
    return { n, total, p: n / total };
  }
  function progressionFonda() {
    let n = 0, t = 0;
    F.cours.forEach(c => { const p = progression(c); n += p.n; t += p.total; });
    return { n, t, p: t ? n / t : 0 };
  }
  const estRedige = c => c.lecons.some(l => !l.aRediger) || c.examen.length > 0;

  // =============================================================
  //  QUESTIONS : affichage, lecture, correction
  // =============================================================
  const imageQuestion = q => q.image && q.type !== "zone"
    ? `<div class="q-img${q.imagePetite ? " petite" : ""}"><button type="button" class="capture-img" data-zoom="${q.image}" aria-label="Agrandir l'image"><img src="${q.image}" alt="${esc(q.alt || "")}"></button></div>` : "";

  // élément de gauche d'une association : texte, ou { img, alt } pour un logo
  const gauche = g => typeof g === "object" ? `<img class="g-img" src="${g.img}" alt="${esc(g.alt)}"><span class="sr">${esc(g.alt)}</span>` : esc(g);

  // option de réponse : texte, ou { img, alt, texte } pour une image (bouton de capacité…)
  const optHtml = o => typeof o === "object"
    ? `<img class="opt-img" src="${o.img}" alt="${esc(o.alt)}">${o.texte ? `<span>${esc(o.texte)}</span>` : `<span class="sr">${esc(o.alt)}</span>`}`
    : esc(o);
  const optTexte = o => typeof o === "object" ? esc(o.texte || o.alt) : esc(o);
  const aDesImages = q => (q.options || []).some(o => typeof o === "object");

  function htmlQuestion(q, uid) {
    let h = `<h3>${esc(q.question || q.enonce)}</h3>` + imageQuestion(q);
    if (q.type === "zone") {
      h += `<p class="aide">Clique directement sur l'image.</p><div class="zones-img zone-q"><img src="${q.image}" alt="${esc(q.alt || "")}"></div>`;
    } else if (q.type === "choix" || q.type === "vf") {
      const opts = q.type === "vf" ? ["Vrai", "Faux"] : q.options;
      const ordre = q.type === "vf" ? [0, 1] : melange(opts.map((_, i) => i));
      h += `<div class="opts${aDesImages(q) ? " opts-grille" : ""}">` + ordre.map(i => `<label class="opt" data-i="${i}"><input type="radio" name="${uid}" value="${i}"> ${optHtml(opts[i])}</label>`).join("") + `</div>`;
    } else if (q.type === "multi") {
      h += `<p class="aide">Plusieurs réponses possibles.</p>`;
      h += `<div class="opts${aDesImages(q) ? " opts-grille" : ""}">` + melange(q.options.map((_, i) => i)).map(i => `<label class="opt" data-i="${i}"><input type="checkbox" value="${i}"> ${optHtml(q.options[i])}</label>`).join("") + `</div>`;
    } else if (q.type === "nombre") {
      h += `<input type="text" inputmode="decimal" class="num" placeholder="Ta réponse" aria-label="Ta réponse">`;
    } else if (q.type === "ordre") {
      h += `<p class="aide">Utilise les flèches pour remettre les étapes dans l'ordre.</p><ol class="ordre">`;
      let o = melange(q.elements.map((_, i) => i));
      if (o.every((v, i) => v === i) && o.length > 1) o = o.reverse();
      h += o.map(i => `<li data-i="${i}"><span class="pos"></span><span class="txt">${esc(q.elements[i])}</span><button type="button" data-m="-1" aria-label="Monter">↑</button><button type="button" data-m="1" aria-label="Descendre">↓</button></li>`).join("");
      h += `</ol>`;
    } else if (q.type === "assoc") {
      const droites = melange([...new Set(q.paires.map(p => p[1]))]);
      h += `<div class="assoc">` + q.paires.map((p, i) => `<div class="ln"><div class="g">${gauche(p[0])}</div><select data-i="${i}" aria-label="${esc(typeof p[0] === "object" ? p[0].alt : p[0])}"><option value="">Choisir…</option>${droites.map(d => `<option>${esc(d)}</option>`).join("")}</select></div>`).join("") + `</div>`;
    }
    h += `<div class="fb" aria-live="polite"></div>`;
    return h;
  }

  function brancherQuestion(el) {
    const zq = el.querySelector(".zone-q");
    if (zq) zq.addEventListener("click", e => {
      if (el.classList.contains("locked")) return;
      const r = zq.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
      zq.dataset.x = x; zq.dataset.y = y;
      let pt = zq.querySelector(".clic");
      if (!pt) { pt = document.createElement("span"); pt.className = "clic"; zq.appendChild(pt); }
      pt.style.left = x + "%"; pt.style.top = y + "%";
    });
    const ol = el.querySelector(".ordre");
    if (!ol) return;
    const maj = () => [...ol.children].forEach((li, k, arr) => {
      li.querySelector(".pos").textContent = (k + 1) + ".";
      li.querySelector('[data-m="-1"]').disabled = k === 0;
      li.querySelector('[data-m="1"]').disabled = k === arr.length - 1;
    });
    ol.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b || el.classList.contains("locked")) return;
      const li = b.closest("li");
      if (b.dataset.m === "-1" && li.previousElementSibling) ol.insertBefore(li, li.previousElementSibling);
      if (b.dataset.m === "1" && li.nextElementSibling) ol.insertBefore(li.nextElementSibling, li);
      maj();
    });
    maj();
  }

  // renvoie null si la question n'a pas de réponse
  function lireReponse(q, el) {
    if (q.type === "zone") { const z = el.querySelector(".zone-q"); return z.dataset.x === undefined ? null : { x: +z.dataset.x, y: +z.dataset.y }; }
    if (q.type === "choix" || q.type === "vf") { const r = el.querySelector("input:checked"); return r ? +r.value : null; }
    if (q.type === "multi") { const r = [...el.querySelectorAll("input:checked")].map(x => +x.value); return r.length ? r : null; }
    if (q.type === "nombre") { const v = el.querySelector("input").value.trim().replace(",", "."); return v === "" ? null : Number(v); }
    if (q.type === "ordre") return [...el.querySelectorAll(".ordre li")].map(li => +li.dataset.i);
    if (q.type === "assoc") { const r = [...el.querySelectorAll("select")].map(s => s.value); return r.some(v => !v) ? null : r; }
  }

  function estJuste(q, r) {
    if (r === null || r === undefined) return false;
    if (q.type === "zone") { const z = q.zones[q.reponse].rect; return r.x >= z[0] && r.x <= z[2] && r.y >= z[1] && r.y <= z[3]; }
    if (q.type === "choix") return r === q.reponse;
    if (q.type === "vf") return (r === 0) === q.reponse;
    if (q.type === "multi") return r.length === q.reponses.length && q.reponses.every(i => r.includes(i));
    if (q.type === "nombre") return r === Number(q.reponse);
    if (q.type === "ordre") return r.every((v, i) => v === i);
    if (q.type === "assoc") return r.every((v, i) => v === q.paires[i][1]);
    return false;
  }

  function bonneReponse(q) {
    if (q.type === "zone") return esc(q.zones[q.reponse].nom) + " (encadré en vert sur l'image)";
    if (q.type === "choix") return optTexte(q.options[q.reponse]);
    if (q.type === "vf") return q.reponse ? "Vrai" : "Faux";
    if (q.type === "multi") return q.reponses.map(i => optTexte(q.options[i])).join(", ");
    if (q.type === "nombre") return esc(q.reponse);
    if (q.type === "ordre") return "<br>" + q.elements.map((e, i) => `${i + 1}. ${esc(e)}`).join("<br>");
    if (q.type === "assoc") return "<br>" + q.paires.map(p => `${esc(typeof p[0] === "object" ? p[0].alt : p[0])} : ${esc(p[1])}`).join("<br>");
  }

  function corriger(q, el, texteExplication) {
    const r = lireReponse(q, el);
    const ok = estJuste(q, r);
    el.classList.add("locked", ok ? "good" : "bad");
    anim(el, ok ? "a-bon" : "a-faux");
    el.querySelectorAll("input,select,button").forEach(x => x.disabled = true);
    el.querySelectorAll(".ordre li").forEach((li, k) => li.querySelector(".pos").textContent = (k + 1) + ".");
    if (q.type === "zone") {
      const zq = el.querySelector(".zone-q"), z = q.zones[q.reponse].rect;
      const m = document.createElement("span"); m.className = "zone-ok";
      Object.assign(m.style, { left: z[0] + "%", top: z[1] + "%", width: (z[2] - z[0]) + "%", height: (z[3] - z[1]) + "%" });
      zq.appendChild(m);
      const pt = zq.querySelector(".clic"); if (pt) pt.classList.add(ok ? "bon" : "faux");
    }
    if (q.type === "choix" || q.type === "vf" || q.type === "multi") {
      const bonnes = q.type === "multi" ? q.reponses : [q.type === "vf" ? (q.reponse ? 0 : 1) : q.reponse];
      el.querySelectorAll(".opt").forEach(o => {
        const i = +o.dataset.i, coche = o.querySelector("input").checked;
        if (bonnes.includes(i)) o.classList.add("right"); else if (coche) o.classList.add("wrong");
      });
    }
    const fb = el.querySelector(".fb");
    fb.innerHTML = (ok ? `<b class="ok">Bonne réponse.</b> ` : `<b class="ko">Ce n'est pas ça.</b> La bonne réponse : ${bonneReponse(q)}<br>`) + (texteExplication ? esc(texteExplication) : "");
    fb.classList.add("show");
    return ok;
  }

  // Série de questions (quiz ou examen) avec bouton de validation
  // pasAPas : une question à la fois (examens), avec navigation et progression
  function serie(conteneur, questions, onFini, pasAPas) {
    const uid = "q" + Math.random().toString(36).slice(2, 8);
    const n = questions.length;
    conteneur.innerHTML = (pasAPas ? `<div class="pas-tete"><span class="pas-n"></span><div class="prog"><i></i></div></div>` : "")
      + questions.map((q, k) => `<div class="q" data-k="${k}">${pasAPas ? `<p class="q-num">Question ${k + 1} sur ${n}${q.piege ? "" : ""}</p>` : ""}${htmlQuestion(Object.assign({}, q, { question: pasAPas ? q.question : (k + 1) + ". " + q.question }), uid + k)}</div>`).join("")
      + `<p class="avert">Il reste des questions sans réponse.</p>`
      + (pasAPas ? `<div class="pas-nav"><button class="btn sec" type="button" data-pas="-1">Question précédente</button><button class="btn pri" type="button" data-pas="1">Question suivante</button><button class="btn pri valider" type="button">Valider mes réponses</button></div>` : `<button class="btn pri valider" type="button">Valider mes réponses</button>`);
    const boites = [...conteneur.querySelectorAll(".q")];
    boites.forEach(brancherQuestion);
    brancherZoom(conteneur);
    const btn = conteneur.querySelector(".valider");
    let cur = 0;
    const montrer = (k, animer) => {
      if (!pasAPas) return;
      const avant = cur;
      cur = Math.max(0, Math.min(n - 1, k));
      boites.forEach((b, x) => b.hidden = x !== cur);
      if (animer && cur !== avant) anim(boites[cur], cur > avant ? "a-droite" : "a-gauche");
      conteneur.querySelector(".pas-n").textContent = `Question ${cur + 1} sur ${n}`;
      conteneur.querySelector(".pas-tete .prog i").style.width = ((cur + 1) / n * 100) + "%";
      conteneur.querySelector('[data-pas="-1"]').disabled = cur === 0;
      conteneur.querySelector('[data-pas="1"]').hidden = cur === n - 1;
      btn.hidden = cur !== n - 1;
    };
    if (pasAPas) {
      conteneur.querySelectorAll("[data-pas]").forEach(b => b.addEventListener("click", () => {
        montrer(cur + +b.dataset.pas, true);
        conteneur.scrollIntoView({ behavior: "smooth", block: "start" });
      }));
      montrer(0);
    }
    btn.addEventListener("click", () => {
      const w = conteneur.querySelector(".avert");
      const vide = questions.findIndex((q, k) => lireReponse(q, boites[k]) === null);
      if (vide >= 0) {
        w.textContent = pasAPas ? `La question ${vide + 1} n'a pas de réponse.` : "Il reste des questions sans réponse.";
        w.style.display = "block";
        if (pasAPas) montrer(vide, true);
        anim(boites[vide], "a-faux");
        boites[vide].scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      w.style.display = "none";
      let bons = 0;
      const resultats = questions.map((q, k) => { const juste = corriger(q, boites[k], q.explication); if (juste) bons++; return { question: q.question, juste }; });
      if (pasAPas) {
        // correction : on montre toutes les questions
        boites.forEach(b => b.hidden = false);
        const t = conteneur.querySelector(".pas-tete"); if (t) t.remove();
        const nav = conteneur.querySelector(".pas-nav"); if (nav) nav.remove();
        conteneur.querySelectorAll(".q-num").forEach(e => e.classList.add("visible"));
      } else btn.remove();
      onFini(bons, questions.length, resultats);
    });
  }

  // =============================================================
  //  EXERCICES PRATIQUES (non bloquants)
  // =============================================================
  function exercice(el, ex) {
    if (ex.type === "situation") {
      el.innerHTML = `<h3>${esc(ex.enonce)}</h3>` + imageQuestion(ex) + ex.options.map((o, i) => `<button type="button" class="opt" data-i="${i}">${esc(o.texte)}</button>`).join("") + `<div class="fb" aria-live="polite"></div>`;
      el.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => {
        const o = ex.options[+b.dataset.i];
        el.querySelectorAll(".opt").forEach(x => x.classList.remove("right", "wrong"));
        b.classList.add(o.bon ? "right" : "wrong");
        anim(b, o.bon ? "a-bon" : "a-faux");
        const fb = el.querySelector(".fb");
        fb.innerHTML = `<b class="${o.bon ? "ok" : "ko"}">${o.bon ? "Bon choix." : "Pas le meilleur choix."}</b> ${esc(o.commentaire)}${o.bon ? "" : " Essaie une autre option."}`;
        fb.classList.add("show");
      }));
    } else if (ex.type === "libre") {
      el.innerHTML = `<h3>${esc(ex.enonce)}</h3><textarea rows="4" placeholder="Écris ta réponse ici" aria-label="Ta réponse"></textarea>
        <div class="row" style="margin-top:12px"><button type="button" class="btn sec sm">Voir le corrigé</button></div><div class="fb" aria-live="polite"></div>`;
      el.querySelector("button").addEventListener("click", () => {
        const fb = el.querySelector(".fb");
        fb.innerHTML = `<b class="ok">Corrigé.</b> ${ex.corrige}<br><span class="soft">Compare avec ta réponse : c'est l'idée qui compte, pas les mots exacts.</span>`;
        fb.classList.add("show");
      });
    } else if (ex.type === "zones") {
      exerciceZones(el, ex);
    } else { // ordre, assoc
      const lancer = () => {
        el.className = "q ex";
        el.innerHTML = htmlQuestion(ex, "ex" + Math.random().toString(36).slice(2, 7)) + `<div class="row" style="margin-top:12px"><button type="button" class="btn sec sm verif">Vérifier</button></div>`;
        brancherQuestion(el);
        brancherZoom(el);
        el.querySelector(".verif").addEventListener("click", () => {
          if (lireReponse(ex, el) === null) {
            const fb = el.querySelector(".fb"); fb.innerHTML = `<b class="ko">Complète l'exercice avant de vérifier.</b>`; fb.classList.add("show"); return;
          }
          corriger(ex, el, ex.commentaire);
          const b = el.querySelector(".verif"); b.disabled = false; b.textContent = "Recommencer l'exercice"; b.classList.remove("verif");
          b.onclick = lancer;
        });
      };
      lancer();
    }
  }

  // Exercice « Trouve sur l'image » : on clique sur la capture, une cible après l'autre
  function exerciceZones(el, ex) {
    let etape = 0;
    const dedans = (z, x, y) => x >= z.rect[0] && x <= z.rect[2] && y >= z.rect[1] && y <= z.rect[3];
    const lancer = () => {
      etape = 0;
      el.innerHTML = `<h3>${esc(ex.enonce)}</h3>
        <p class="zones-consigne" aria-live="polite"></p>
        <div class="zones-img"><img src="${ex.image}" alt="${esc(ex.alt)}"></div>
        <div class="fb" aria-live="polite"></div>`;
      const box = el.querySelector(".zones-img");
      majConsigne();
      box.addEventListener("click", e => {
        if (etape >= ex.cibles.length) return;
        const r = box.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100;
        const cible = ex.zones[ex.cibles[etape]];
        const touchee = Object.values(ex.zones).find(z => dedans(z, x, y));
        const fb = el.querySelector(".fb");
        fb.classList.add("show");
        if (touchee === cible) {
          const m = document.createElement("span");
          m.className = "zone-ok";
          Object.assign(m.style, { left: cible.rect[0] + "%", top: cible.rect[1] + "%", width: (cible.rect[2] - cible.rect[0]) + "%", height: (cible.rect[3] - cible.rect[1]) + "%" });
          m.innerHTML = `<b>${etape + 1}</b>`;
          box.appendChild(m);
          etape++;
          if (etape < ex.cibles.length) { fb.innerHTML = `<b class="ok">Bien vu, c'est ${esc(cible.nom)}.</b>`; majConsigne(); }
          else {
            el.querySelector(".zones-consigne").textContent = "";
            fb.innerHTML = `<b class="ok">Bravo, tu as tout trouvé.</b> ${esc(ex.commentaire || "")}<div class="row" style="margin-top:12px"><button type="button" class="btn sec sm">Recommencer l'exercice</button></div>`;
            fb.querySelector("button").onclick = lancer;
          }
        } else if (touchee) {
          fb.innerHTML = `<b class="ko">Non, ça, c'est ${esc(touchee.nom)}.</b> Cherche ${esc(cible.nom)}.`;
        } else {
          fb.innerHTML = `<b class="ko">Rien d'utile à cet endroit.</b> Cherche ${esc(cible.nom)}.`;
        }
      });
    };
    function majConsigne() {
      el.querySelector(".zones-consigne").innerHTML = `Étape ${etape + 1} sur ${ex.cibles.length} : clique sur <strong>${esc(ex.zones[ex.cibles[etape]].nom)}</strong>.`;
    }
    lancer();
  }

  // Diaporamas : une étape visible à la fois
  function brancherDiapos(racine) {
    racine.querySelectorAll("[data-diapo]").forEach(d => {
      const etapes = [...d.querySelectorAll(".diapo-etape")];
      const points = [...d.querySelectorAll("[data-aller]")];
      const prec = d.querySelector('[data-dir="-1"]'), suiv = d.querySelector('[data-dir="1"]');
      let i = 0;
      const montrer = (n, animer) => {
        const avant = i;
        i = Math.max(0, Math.min(etapes.length - 1, n));
        etapes.forEach((e, k) => e.hidden = k !== i);
        if (animer && i !== avant) anim(etapes[i], i > avant ? "a-droite" : "a-gauche");
        points.forEach((p, k) => { p.classList.toggle("on", k === i); p.setAttribute("aria-current", k === i ? "step" : "false"); });
        prec.disabled = i === 0; suiv.disabled = i === etapes.length - 1;
      };
      prec.onclick = () => montrer(i - 1, true);
      suiv.onclick = () => montrer(i + 1, true);
      points.forEach((p, k) => p.onclick = () => montrer(k, true));
      d.addEventListener("keydown", e => { if (e.key === "ArrowLeft") montrer(i - 1, true); if (e.key === "ArrowRight") montrer(i + 1, true); });
      montrer(0);
    });
  }

  // Calculateur de faiblesses (cours « Les types »)
  function brancherCalculateurs(racine) {
    const T = S.types;
    if (!T) return;
    racine.querySelectorAll("[data-calculateur]").forEach(box => {
      let choix = box.dataset.calculateur ? box.dataset.calculateur.split(",") : [];
      const etiquette = id => { const t = T.typeParId(id); return `<span class="type" style="--c:${t.couleur}"><img src="images/types/${t.id}.webp" alt="">${t.nom}</span>`; };
      const rendre = () => {
        const groupes = [[4, "Est très faible (×4) face à"], [2, "Est faible (×2) face à"], [.5, "Est résistant (×0,5) face à"], [.25, "Est très résistant (×0,25) face à"], [0, "Est immunisé (×0) contre"]];
        const res = choix.length ? groupes.map(([m, titre]) => {
          const ids = T.TYPES.filter(t => T.efficacite(t.id, choix) === m).map(t => etiquette(t.id));
          return ids.length ? `<div class="calc-groupe"><b>${titre}</b><div>${ids.join(" ")}</div></div>` : "";
        }).join("") : `<p class="soft">Choisis au moins un type.</p>`;
        box.innerHTML = `<p class="calc-consigne">Choisis le ou les types du Pokémon qui <strong>reçoit</strong> la capacité (deux au maximum) :</p>
          <div class="calc-types">${T.TYPES.map(t => `<button type="button" class="calc-type${choix.includes(t.id) ? " on" : ""}" data-t="${t.id}" aria-pressed="${choix.includes(t.id)}"><img src="images/types/${t.id}.webp" alt="">${t.nom}</button>`).join("")}</div>
          <div class="calc-res">${choix.length ? `<p class="calc-titre">Pokémon ${choix.map(etiquette).join(" ")}</p>` : ""}${res}</div>`;
        box.querySelectorAll(".calc-type").forEach(b => b.onclick = () => {
          const id = b.dataset.t;
          if (choix.includes(id)) choix = choix.filter(x => x !== id);
          else { choix.push(id); if (choix.length > 2) choix.shift(); }
          rendre();
          const nb = box.querySelector(`[data-t="${id}"]`); if (nb) nb.focus();
        });
      };
      rendre();
    });
  }

  // Table des types : surligne la ligne et la colonne survolées
  function brancherMatrices(racine) {
    racine.querySelectorAll("[data-matrice]").forEach(m => {
      const nettoyer = () => m.querySelectorAll(".hl").forEach(x => x.classList.remove("hl"));
      m.addEventListener("mouseover", e => {
        const td = e.target.closest("td[data-a]"); nettoyer(); if (!td) return;
        m.querySelectorAll(`[data-a="${td.dataset.a}"], [data-d="${td.dataset.d}"]`).forEach(x => x.classList.add("hl"));
        td.classList.add("hl-cell");
      });
      m.addEventListener("mouseleave", () => { nettoyer(); m.querySelectorAll(".hl-cell").forEach(x => x.classList.remove("hl-cell")); });
    });
  }

  // Répertoire des talents (bouton « Voir les talents »)
  function brancherTalents(racine) {
    const T = S.talents;
    if (!T) return;
    racine.querySelectorAll("[data-talents]").forEach(box => {
      let filtre = "", famille = "";
      box.innerHTML = `<div class="rep-outils">
          <input type="search" placeholder="Rechercher un talent ou un Pokémon" aria-label="Rechercher un talent">
          <div class="rep-familles"><button type="button" class="on" data-f="">Toutes</button>${T.familles.map(f => `<button type="button" data-f="${esc(f)}">${esc(f)}</button>`).join("")}</div>
        </div>
        <div class="rep-liste"></div>
        <p class="rep-pied">Ce répertoire ne contient que les talents vus dans le cours. Il en existe près de 300 : avant de créer ton équipe, renseigne-toi sur ceux de tes Pokémon et de tes adversaires dans la <a href="${T.lienListeComplete}" target="_blank" rel="noopener">liste complète sur Poképédia</a>.</p>`;
      const liste = box.querySelector(".rep-liste");
      const norm = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const rendre = () => {
        const f = norm(filtre);
        const res = T.liste.filter(t => (!famille || t.famille === famille) && (!f || norm(t.nom + " " + t.effet + " " + t.exemple).includes(f)));
        liste.innerHTML = res.length ? res.map(t => `<div class="rep-talent"><div class="rep-tete"><b>${esc(t.nom)}</b><span class="tag">${esc(t.famille)}</span></div><p>${esc(t.effet)}</p>${t.exemple ? `<small>Exemple : ${esc(t.exemple)}</small>` : ""}</div>`).join("")
          : `<p class="soft">Aucun talent du cours ne correspond. Cherche-le dans la <a href="${T.lienListeComplete}" target="_blank" rel="noopener">liste complète sur Poképédia</a>.</p>`;
      };
      box.querySelector("input").addEventListener("input", e => { filtre = e.target.value; rendre(); });
      box.querySelectorAll("[data-f]").forEach(b => b.onclick = () => {
        famille = b.dataset.f; box.querySelectorAll("[data-f]").forEach(x => x.classList.toggle("on", x === b)); rendre();
      });
      rendre();
    });
  }

  // Répertoire des capacités (bouton « Voir les capacités »)
  function brancherCapacites(racine) {
    const C = S.capacites, T = S.types;
    if (!C || !T) return;
    racine.querySelectorAll("[data-capacites]").forEach(box => {
      let filtre = "", cat = "", typ = "";
      const icones = { "Physique": "physique", "Spéciale": "special", "Statut": "statut" };
      box.innerHTML = `<div class="rep-outils">
          <input type="search" placeholder="Rechercher une capacité ou un effet" aria-label="Rechercher une capacité">
          <div class="rep-familles" data-g="cat"><button type="button" class="on" data-v="">Toutes</button>${C.categories.map(c => `<button type="button" data-v="${c}">${c}</button>`).join("")}</div>
          <select aria-label="Filtrer par type"><option value="">Tous les types</option>${T.TYPES.map(t => `<option value="${t.id}">${t.nom}</option>`).join("")}</select>
        </div>
        <div class="rep-liste"></div>
        <p class="rep-pied">Ce répertoire ne contient que les capacités vues dans les cours. Il en existe plus de 900 : avant de créer ton équipe, renseigne-toi sur celles de tes Pokémon et de tes adversaires dans la <a href="${C.lienListeComplete}" target="_blank" rel="noopener">liste complète sur Poképédia</a>.</p>`;
      const liste = box.querySelector(".rep-liste");
      const norm = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const rendre = () => {
        const f = norm(filtre);
        const res = C.liste.filter(c => (!cat || c.categorie === cat) && (!typ || c.type === typ) && (!f || norm(c.nom + " " + c.effet).includes(f)));
        liste.innerHTML = res.length ? res.map(c => {
          const t = T.typeParId(c.type);
          return `<div class="rep-talent"><div class="rep-tete"><b>${esc(c.nom)}</b><span class="rep-meta"><span class="type" style="--c:${t.couleur}"><img src="images/types/${t.id}.webp" alt="">${t.nom}</span><img class="rep-cat" src="images/capacites/categorie-${icones[c.categorie]}.webp" alt="${c.categorie}" title="${c.categorie}"></span></div><p>${esc(c.effet)}</p><small>Puissance ${esc(c.puissance)} · Précision ${esc(c.precision)}</small></div>`;
        }).join("") : `<p class="soft">Aucune capacité du cours ne correspond. Cherche-la dans la <a href="${C.lienListeComplete}" target="_blank" rel="noopener">liste complète sur Poképédia</a>.</p>`;
      };
      box.querySelector("input").addEventListener("input", e => { filtre = e.target.value; rendre(); });
      box.querySelector("select").addEventListener("change", e => { typ = e.target.value; rendre(); });
      box.querySelectorAll('[data-g="cat"] button').forEach(b => b.onclick = () => {
        cat = b.dataset.v; box.querySelectorAll('[data-g="cat"] button').forEach(x => x.classList.toggle("on", x === b)); rendre();
      });
      rendre();
    });
  }

  // Répertoire des objets (bouton « Voir les objets »)
  function brancherObjets(racine) {
    const O = S.objets;
    if (!O) return;
    racine.querySelectorAll("[data-objets]").forEach(box => {
      let filtre = "", famille = "";
      box.innerHTML = `<div class="rep-outils">
          <input type="search" placeholder="Rechercher un objet ou un effet" aria-label="Rechercher un objet">
          <div class="rep-familles"><button type="button" class="on" data-f="">Tous</button>${O.familles.map(f => `<button type="button" data-f="${esc(f)}">${esc(f)}</button>`).join("")}</div>
        </div>
        <div class="rep-liste"></div>
        <p class="rep-pied">Ce répertoire ne contient que les objets vus dans le cours, classés comme dans le menu de Pokémon Champions. Il en existe bien d'autres : avant de créer ton équipe, renseigne-toi dans le jeu (la description de chaque objet y est affichée) ou dans la <a href="${O.lienListeComplete}" target="_blank" rel="noopener">liste complète des objets sur Coup Critique</a>, qui indique ceux disponibles sur Pokémon Champions.</p>`;
      const liste = box.querySelector(".rep-liste");
      const norm = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const rendre = () => {
        const f = norm(filtre);
        const res = O.liste.filter(o => (!famille || o.famille === famille) && (!f || norm(o.nom + " " + o.effet).includes(f)));
        liste.innerHTML = res.length ? res.map(o => `<div class="rep-talent"><img class="rep-objet" src="images/objets/bouton-${o.img}.webp" alt="${esc(o.nom)}"><div class="rep-tete"><span class="tag">${esc(o.famille)}</span></div><p>${esc(o.effet)}</p></div>`).join("")
          : `<p class="soft">Aucun objet du cours ne correspond. Cherche-le dans la <a href="${O.lienListeComplete}" target="_blank" rel="noopener">liste complète sur Coup Critique</a>.</p>`;
      };
      box.querySelector("input").addEventListener("input", e => { filtre = e.target.value; rendre(); });
      box.querySelectorAll("[data-f]").forEach(b => b.onclick = () => {
        famille = b.dataset.f; box.querySelectorAll("[data-f]").forEach(x => x.classList.toggle("on", x === b)); rendre();
      });
      rendre();
    });
  }

  // Agrandissement des captures au clic
  function brancherZoom(racine) {
    racine.querySelectorAll("[data-zoom]:not([data-zoom-lie])").forEach(b => { b.setAttribute("data-zoom-lie", ""); b.addEventListener("click", () => {
      const fond = document.createElement("div");
      fond.className = "zoom";
      fond.setAttribute("role", "dialog");
      fond.setAttribute("aria-label", "Image agrandie");
      fond.innerHTML = `<img src="${b.dataset.zoom}" alt=""><button type="button" class="btn sec sm">Fermer</button>`;
      const fermer = () => { fond.remove(); document.removeEventListener("keydown", touche); b.focus(); };
      const touche = e => { if (e.key === "Escape") fermer(); };
      fond.addEventListener("click", fermer);
      document.addEventListener("keydown", touche);
      document.body.appendChild(fond);
      fond.querySelector("button").focus();
    }); });
  }

  // =============================================================
  //  VUES
  // =============================================================
  function tagNiveau(dispo, ouvert) {
    if (!dispo) return `<span class="tag bientot">Bientôt</span>`;
    return ouvert ? `<span class="tag ok">Ouvert</span>` : `<span class="tag lock">Verrouillé</span>`;
  }

  function prochainPas() {
    const deja = progressionFonda().n > 0;
    for (const c of F.cours) {
      if (!coursOuvert(c)) break;
      for (const l of c.lecons) if (!leconFaite(c, l)) return { href: `#lecon-${c.id}-${l.id}`, label: deja ? "Reprendre ma formation" : "Commencer les Fondamentaux" };
      if (!examenReussi(c)) return { href: `#examen-${c.id}`, label: "Passer mon prochain examen" };
    }
    return { href: "#fondamentaux", label: "Voir les Fondamentaux" };
  }

  function vueAccueil() {
    const pf = progressionFonda();
    const tousCours = PARCOURS.flatMap(p => p.cours);
    const nbBadges = tousCours.filter(examenReussi).length;
    const suite = prochainPas();
    const fondaOk = fondamentauxFinis();
    app.innerHTML = `
    <header class="hero"><div class="wrap">
      <div>
        <h1>Apprends à combattre comme un compétiteur.</h1>
        <p>Des formations gratuites pour progresser au combat Pokémon : d'abord les bases, puis le format de ton choix (VGC, 3v3 ou 6v6 OU).</p>
        <div class="row"><a class="btn pri" href="${suite.href}">${suite.label}</a><a class="btn sec" href="#fondamentaux">Voir le programme</a></div>
      </div>
      <div class="vitrine">
        <h2>Tes badges</h2>
        <p>${nbBadges ? `${nbBadges} sur ${tousCours.length} obtenus.` : "Réussis l'examen d'un cours pour gagner son badge."}</p>
        <div class="badges">${F.cours.map((c, i) => `<figure>${badge(i, etatBadge(c), 60)}<figcaption>${esc(c.titre)}</figcaption></figure>`).join("")}${PARCOURS.filter(p => p.format).map(p => `<figure>${badgeFormat(p.format, etatBadge(p.cours[0]), 60)}<figcaption>Format ${esc(p.format.nom)}</figcaption></figure>`).join("")}</div>
      </div>
    </div></header>

    <section class="blk"><div class="wrap">
      <div class="sec-h"><h2>Comment se déroule ta formation</h2></div>
      <div class="etapes">
        <div class="etape">
          <span class="n">1</span>
          <h3>Les Fondamentaux</h3>
          <p>${F.cours.length} cours pour maîtriser les bases communes à tous les formats : types, talents, statistiques, capacités, objets, climats et champs.</p>
          <div class="prog" title="${pct(pf.p)} terminé"><i style="width:${pf.p * 100}%"></i></div>
          <p style="font-size:14px">${pct(pf.p)} terminé</p>
          <div><a class="btn pri" href="#fondamentaux">${pf.n ? "Continuer" : "Commencer"}</a></div>
        </div>
        <div class="etape">
          <span class="n">2</span>
          <h3>Ton format</h3>
          <p>Une fois les Fondamentaux réussis, le cours de chaque format s'ouvre : VGC, 3v3 ou 6v6 OU. Il t'apprend les règles et la façon de jouer propres à ce format.</p>
        </div>
      </div>
    </div></section>

    <section class="blk"><div class="wrap">
      <div class="sec-h"><h2>Les formats</h2><p>Chaque format a son cours, ouvert une fois les Fondamentaux réussis.</p></div>
      <div class="formats">${S.formats.map(f => `
        <a class="fmt" href="${lienFormat(f)}" style="--c:${f.couleur}">
          <h3>${esc(f.nom)}</h3>
          <p>${esc(f.sousTitre)}.</p>
          <ul class="niveaux">
            <li>Cours du format ${tagNiveau(f.cours.disponible && !!parcoursFormat(f), fondaOk)}</li>
          </ul>
        </a>`).join("")}
      </div>
    </div></section>

    <section class="blk"><div class="wrap">
      <div class="sec-h"><h2>Les règles du jeu</h2></div>
      <div class="regles">
        <div><h3>Des leçons courtes</h3><p>Chaque leçon contient un texte, un exercice pour t'entraîner et un quiz.</p></div>
        <div><h3>Un quiz sans faute</h3><p>Il faut 100 % au quiz pour ouvrir la leçon suivante. Tu peux le refaire autant que tu veux.</p></div>
        <div><h3>Un examen par cours</h3><p>Réussis-le à ${pct(CFG.seuilExamen)} pour gagner le badge et ouvrir le cours suivant. Les questions changent à chaque tentative.</p></div>
        <div><h3>Pas besoin de compte</h3><p>Ta progression est enregistrée dans ce navigateur.</p></div>
      </div>
    </div></section>`;
  }

  function progressionParcours(par) {
    let n = 0, t = 0;
    par.cours.forEach(c => { const p = progression(c); n += p.n; t += p.total; });
    return { n, t, p: t ? n / t : 0 };
  }
  function vueParcours(par) {
    if (!par) return vueIntrouvable();
    if (!par.ouvert()) return vueVerrou("Réussis d'abord les examens des Fondamentaux pour ouvrir ce parcours.", "#fondamentaux", "Aller aux Fondamentaux");
    const pf = progressionParcours(par);
    const F = par;
    app.innerHTML = `<header class="bandeau"><div class="wrap">
      <div class="fil"><a href="#accueil">Accueil</a> / ${esc(par.court)}</div>
      <h1>${esc(F.titre)}</h1>
      <p class="chapo">${esc(F.intro)}</p>
      <div class="bandeau-prog"><div class="prog"><i style="width:${pf.p * 100}%"></i></div><span>${pct(pf.p)} terminé</span></div>
    </div></header>
    <div class="wrap page">
      <ol class="parcours">${F.cours.map((c, i) => {
        const ouvert = coursOuvert(c), p = progression(c), fini = examenReussi(c);
        const statut = !estRedige(c) ? `<span class="tag draft">En rédaction</span>` : fini ? `<span class="tag ok">Badge obtenu</span>` : "";
        const detail = !ouvert ? `Réussis l'examen du cours ${i} pour l'ouvrir` : `${pluriel(c.lecons.length, "leçon")} et un examen`;
        const carte = `<span class="t"><b>Cours ${i + 1} : ${esc(c.titre)}</b><small>${detail}</small>${ouvert && !fini ? `<div class="prog"><i style="width:${p.p * 100}%"></i></div>` : ""}</span>${statut}`;
        return `<li class="etapecours ${ouvert ? "" : "ferme"}"><span class="bd">${badgeCours(c, etatBadge(c), 72)}</span>${ouvert ? `<a class="carte" href="#cours-${c.id}">${carte}</a>` : `<div class="carte">${carte}</div>`}</li>`;
      }).join("")}</ol>
    </div>`;
  }

  function vueCours(c) {
    if (!c) return vueIntrouvable();
    const i = coursIndex(c), par = parcoursDe(c);
    if (!coursOuvert(c)) return i === 0 && par.format ? vueVerrou("Réussis d'abord les examens des 7 cours des Fondamentaux pour ouvrir ce cours.", "#fondamentaux", "Aller aux Fondamentaux") : vueVerrou(`Réussis l'examen du cours ${i} pour ouvrir ce cours.`, par.href, "Retour au parcours");
    const ex = P.examens[c.id];
    const ouvertEx = examenOuvert(c), finiEx = examenReussi(c);
    const infoEx = ex ? `Meilleur score : ${pct(ex.meilleur)}, ${pluriel(ex.tentatives, "tentative")}` : `Réussi à partir de ${pct(CFG.seuilExamen)}`;
    app.innerHTML = `<header class="bandeau"><div class="wrap">
      <div class="fil"><a href="#accueil">Accueil</a> / ${par.format ? esc(par.court) : `<a href="${par.href}">${esc(par.court)}</a> / Cours ${i + 1}`}</div>
      <div class="entete-cours">${badgeCours(c, etatBadge(c), 88)}<div><p class="surtitre">${esc(par.court)}${par.cours.length > 1 ? ` · cours ${i + 1} sur ${par.cours.length}` : ""}</p><h1>${esc(c.titre)}</h1><p class="chapo">${pluriel(c.lecons.length, "leçon")}, puis un examen. Réussis l'examen pour gagner le badge de ce cours.</p></div></div>
    </div></header>
    <div class="wrap page">
      ${c.objectifs ? `<div class="objectifs"><h2>À la fin de ce cours, tu sauras :</h2><ul>${c.objectifs.map(o => `<li>${esc(o)}</li>`).join("")}</ul></div>` : ""}
      <ol class="lecons">
        ${c.lecons.map((l, j) => {
          const ouvert = leconOuverte(c, j), fait = leconFaite(c, l);
          const inner = `<span class="rond">${fait ? "✓" : j + 1}</span><span class="t"><b>${esc(l.titre)}</b><small>${!ouvert ? "Réussis le quiz précédent pour l'ouvrir" : l.aRediger ? "Leçon à rédiger" : fait ? "Terminée" : "Texte, exercice et quiz"}</small></span>${l.aRediger && ouvert ? `<span class="tag draft">À rédiger</span>` : ""}`;
          return `<li>${ouvert ? `<a class="${fait ? "fait" : ""}" href="#lecon-${c.id}-${l.id}">${inner}</a>` : `<div class="ligne">${inner}</div>`}</li>`;
        }).join("")}
        <li>${(() => {
          const inner = `<span class="rond">★</span><span class="t"><b>Examen du cours</b><small>${!ouvertEx ? "Termine toutes les leçons pour l'ouvrir" : infoEx}</small></span>${finiEx ? `<span class="tag ok">Réussi</span>` : ouvertEx && !c.examen.length ? `<span class="tag draft">À rédiger</span>` : ""}`;
          return ouvertEx ? `<a class="examen ${finiEx ? "fait" : ""}" href="#examen-${c.id}">${inner}</a>` : `<div class="ligne examen">${inner}</div>`;
        })()}</li>
      </ol>
    </div>`;
  }

  function barreLaterale(c, actif) {
    return `<aside class="side"><p class="titre-cours">${parcoursDe(c).format ? esc(parcoursDe(c).court) : `Cours ${coursIndex(c) + 1}`}<b>${esc(c.titre)}</b></p><ol>
      ${c.lecons.map((l, j) => `<li>${leconOuverte(c, j)
        ? `<a href="#lecon-${c.id}-${l.id}" class="${actif === l.id ? "on" : ""} ${leconFaite(c, l) ? "fait" : ""}">${esc(l.titre)}</a>`
        : `<span>${esc(l.titre)}</span>`}</li>`).join("")}
      <li>${examenOuvert(c) ? `<a href="#examen-${c.id}" class="${actif === "examen" ? "on" : ""} ${examenReussi(c) ? "fait" : ""}">Examen</a>` : `<span>Examen</span>`}</li>
    </ol></aside>`;
  }

  function vueLecon(c, lid) {
    if (!c) return vueIntrouvable();
    const j = c.lecons.findIndex(l => l.id === lid);
    if (j < 0) return vueIntrouvable();
    if (!leconOuverte(c, j)) return vueVerrou("Réussis le quiz de la leçon précédente pour ouvrir celle-ci.", `#cours-${c.id}`, "Retour au cours");
    const l = c.lecons[j];
    const suivant = j < c.lecons.length - 1 ? { href: `#lecon-${c.id}-${c.lecons[j + 1].id}`, label: "Leçon suivante" } : { href: `#examen-${c.id}`, label: "Passer à l'examen" };

    app.innerHTML = `<div class="wrap page"><div class="lecon">${barreLaterale(c, l.id)}
      <article class="lecture">
        <div class="fil">${filCours(c)} / Leçon ${j + 1}</div>
        <h1>${esc(l.titre)}</h1>
        <p class="chapo">Leçon ${j + 1} sur ${c.lecons.length}${leconFaite(c, l) ? ", terminée" : ""}</p>
        <div class="texte">${l.texte}</div>
        ${l.exercices.length ? `<section class="partie"><h2>Exercice pratique</h2><p class="soft">Pour t'entraîner. Il ne compte pas pour la suite.</p>${l.exercices.map((_, k) => `<div class="q ex" data-k="${k}"></div>`).join("")}</section>` : ""}
        <section class="partie" id="bloc-quiz"><h2>Quiz</h2><p class="consigne">Réponds sans faute pour ouvrir la leçon suivante. Tu peux le refaire autant de fois que tu veux.</p><div id="quiz-res"></div><div id="quiz"></div></section>
      </article></div></div>`;

    app.querySelectorAll(".q.ex").forEach(el => exercice(el, l.exercices[+el.dataset.k]));
    brancherDiapos(app);
    brancherCalculateurs(app);
    brancherMatrices(app);
    brancherTalents(app);
    brancherCapacites(app);
    brancherObjets(app);
    brancherZoom(app);

    const zone = document.getElementById("quiz"), res = document.getElementById("quiz-res");
    const boutonSuite = () => `<a class="btn pri" href="${suivant.href}">${suivant.label}</a>`;

    if (!l.quiz.length) {
      zone.innerHTML = `<div class="a-rediger"><b>Quiz pas encore rédigé.</b> En attendant, tu peux marquer la leçon comme terminée.</div>
        <div class="row"><button class="btn sec" id="marquer">Marquer comme terminée</button>${leconFaite(c, l) ? boutonSuite() : ""}</div>`;
      document.getElementById("marquer").onclick = () => { P.lecons[cleLecon(c, l)] = true; save(); vueLecon(c, lid); };
      return;
    }

    const lancer = () => {
      res.innerHTML = "";
      serie(zone, melange(l.quiz), (bons, total) => {
        const ok = bons / total >= CFG.seuilQuiz;
        if (ok) { P.lecons[cleLecon(c, l)] = true; save(); }
        res.innerHTML = `<div class="resultat ${ok ? "ok" : "ko"}">
          <div class="score">${bons}/${total}<small>bonnes réponses</small></div>
          <div class="msg"><p>${ok ? "Quiz réussi. La suite est ouverte." : "Il faut toutes les bonnes réponses. Lis les explications sous chaque question, puis refais le quiz."}</p>
          <div class="row">${ok || leconFaite(c, l) ? boutonSuite() : ""}<button class="btn sec" id="refaire">Refaire le quiz</button></div></div></div>`;
        document.getElementById("refaire").onclick = () => { lancer(); document.getElementById("bloc-quiz").scrollIntoView({ behavior: "smooth" }); };
        res.scrollIntoView({ behavior: "smooth", block: "center" });
        const side = app.querySelector(".side"); if (side) side.outerHTML = barreLaterale(c, l.id);
      });
    };
    lancer();
  }

  function vueExamen(c) {
    if (!c) return vueIntrouvable();
    if (!examenOuvert(c)) return vueVerrou("Termine toutes les leçons du cours pour ouvrir l'examen.", `#cours-${c.id}`, "Retour au cours");
    const i = coursIndex(c);
    const nb = Math.min(CFG.questionsParExamen, c.examen.length);
    const par = parcoursDe(c);
    const suivantCours = par.cours[i + 1];

    app.innerHTML = `<div class="wrap page"><div class="lecon">${barreLaterale(c, "examen")}
      <article class="lecture">
        <div class="fil">${filCours(c)} / Examen</div>
        <h1>${par.format ? `Examen du format ${esc(par.format.nom)}` : `Examen du cours ${i + 1}`}</h1>
        <p class="chapo">${esc(c.titre)}</p>
        <div id="ex-zone"></div>
      </article></div></div>`;
    const zoneEl = document.getElementById("ex-zone");

    if (!c.examen.length) {
      zoneEl.innerHTML = `<div class="a-rediger"><b>Examen pas encore rédigé.</b> La banque de questions de ce cours est vide.</div>`;
      return;
    }

    const accueilExamen = () => {
      const ex = P.examens[c.id];
      zoneEl.innerHTML = `<div class="texte"><ul>
          <li>${nb} questions tirées au hasard parmi ${c.examen.length}.</li>
          <li>Il faut ${pct(CFG.seuilExamen)} de bonnes réponses pour réussir et gagner le badge.</li>
          <li>Tu peux le repasser autant de fois que tu veux, avec d'autres questions à chaque fois.</li>
        </ul></div>
        ${ex ? `<p class="soft" style="margin-bottom:20px">Meilleur score : ${pct(ex.meilleur)}, ${pluriel(ex.tentatives, "tentative")}${ex.reussi ? ", examen réussi" : ""}.</p>` : ""}
        <button class="btn pri" id="go">Commencer l'examen</button>`;
      document.getElementById("go").onclick = lancer;
    };

    const lancer = () => {
      // au moins N questions pièges (si le cours en a), le reste au hasard
      const pieges = melange(c.examen.filter(q => q.piege)).slice(0, Math.min(CFG.piegesMinParExamen || 0, nb));
      const reste = melange(c.examen.filter(q => !pieges.includes(q))).slice(0, nb - pieges.length);
      const tirage = melange([...pieges, ...reste]);
      zoneEl.innerHTML = `<div id="ex-res"></div><div id="ex-q"></div>`;
      serie(document.getElementById("ex-q"), tirage, (bons, total, resultats) => {
        const taux = bons / total, ok = taux >= CFG.seuilExamen;
        if (CLOUD) CLOUD.statsExamen(c.id, resultats, ok);
        // historique et points faibles du joueur (pour son espace compte)
        (P.historique[c.id] = P.historique[c.id] || []).push({ d: Date.now(), s: Math.round(taux * 100) / 100 });
        P.historique[c.id] = P.historique[c.id].slice(-50);
        const er = P.erreurs[c.id] = P.erreurs[c.id] || {};
        resultats.forEach(r => {
          const q = idQ(r.question), x = er[q] || { t: r.question.slice(0, 200), v: 0, n: 0 };
          x.v++; if (!r.juste) x.n++; er[q] = x;
        });
        const prev = P.examens[c.id] || { reussi: false, meilleur: 0, tentatives: 0 };
        const nouveauBadge = ok && !prev.reussi;
        P.examens[c.id] = { reussi: prev.reussi || ok, meilleur: Math.max(prev.meilleur, taux), tentatives: prev.tentatives + 1 };
        save();
        const erreurs = total - bons;
        let message;
        if (ok) message = nouveauBadge ? `Examen réussi. Tu gagnes le badge « ${esc(c.titre)} ».` : "Examen réussi.";
        else message = `Il faut ${pct(CFG.seuilExamen)} pour réussir.`;
        if (ok && !suivantCours && par.id === "fondamentaux" && fondamentauxFinis()) message += " Tu as terminé les Fondamentaux : le parcours de chaque format est ouvert.";
        if (ok && !suivantCours && par.id !== "fondamentaux") message += ` Tu as terminé le format ${esc(par.format.nom)} !`;
        if (erreurs) message += ` ${erreurs > 1 ? `Tes ${erreurs} erreurs sont expliquées` : "Ton erreur est expliquée"} ci-dessous.`;
        let suite = "";
        if (ok) suite = suivantCours ? `<a class="btn pri" href="#cours-${suivantCours.id}">Aller au cours ${i + 2}</a>` : par.format ? `<a class="btn pri" href="#accueil">Retour à l'accueil</a>` : `<a class="btn pri" href="#accueil">Choisir mon format</a>`;
        const r = document.getElementById("ex-res");
        r.innerHTML = `<div class="resultat ${ok ? "ok" : "ko"}">
          ${ok ? badgeCours(c, "gagne", 72) : ""}
          <div class="score">${bons}/${total}<small>${pct(taux)} de bonnes réponses</small></div>
          <div class="msg"><p>${message}</p><div class="row">${suite}<button class="btn sec" id="re">Repasser l'examen</button></div></div></div>`;
        document.getElementById("re").onclick = () => { lancer(); scrollTo(0, 0); };
        r.scrollIntoView({ behavior: "smooth", block: "start" });
        const side = app.querySelector(".side"); if (side) side.outerHTML = barreLaterale(c, "examen");
      }, true);
    };
    accueilExamen();
  }

  // #format-x : mène directement au cours du format
  function vueFormat(f) {
    if (!f) return vueIntrouvable();
    const p = parcoursFormat(f);
    location.replace(p ? p.href : "#accueil");
  }

  // =============================================================
  //  ESPACE COMPTE (#compte)
  // =============================================================
  const dateCourte = t => new Date(t).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  function nomCours(c) { const par = parcoursDe(c); return par.format ? par.court : `Cours ${par.cours.indexOf(c) + 1} : ${c.titre}`; }

  // Courbe des scores d'un cours : une seule série, seuil de réussite en pointillés
  function graphiqueScores(c) {
    const h = (P.historique[c.id] || []);
    const W = 640, H = 260, g = 44, d = 20, ht = 18, b = 38;
    const n = h.length, x = i => n === 1 ? (g + W - d) / 2 : g + i * (W - g - d) / (n - 1), y = v => ht + (1 - v) * (H - ht - b);
    const seuil = CFG.seuilExamen;
    const grille = [0, .25, .5, .75, 1].map(v => `<line x1="${g}" x2="${W - d}" y1="${y(v)}" y2="${y(v)}" class="gr-grille"/><text x="${g - 8}" y="${y(v) + 4}" class="gr-axe" text-anchor="end">${v * 100} %</text>`).join("");
    const pas = Math.ceil(n / 10);
    const ax = h.map((t, i) => i % pas === 0 || i === n - 1 ? `<text x="${x(i)}" y="${H - 14}" class="gr-axe" text-anchor="middle">${i + 1}</text>` : "").join("");
    const ligne = n > 1 ? `<polyline points="${h.map((t, i) => x(i) + "," + y(t.s)).join(" ")}" class="gr-ligne"/>` : "";
    const points = h.map((t, i) => `<circle cx="${x(i)}" cy="${y(t.s)}" r="5" class="gr-point${t.s >= seuil ? " ok" : ""}"/>`).join("");
    const cibles = h.map((t, i) => `<rect x="${x(i) - 16}" y="${ht}" width="32" height="${H - ht - b}" class="gr-cible" data-i="${i}" tabindex="0" aria-label="Tentative ${i + 1}, ${dateCourte(t.d)} : ${Math.round(t.s * 100)} %"/>`).join("");
    return `<div class="graphe" data-graphe="${c.id}">
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Scores aux examens de ${esc(nomCours(c))}">
        ${grille}
        <line x1="${g}" x2="${W - d}" y1="${y(seuil)}" y2="${y(seuil)}" class="gr-seuil"/>
        <text x="${W - d}" y="${y(seuil) - 6}" class="gr-seuil-txt" text-anchor="end">Réussite à ${Math.round(seuil * 100)} %</text>
        ${ax}<text x="${(g + W - d) / 2}" y="${H - 1}" class="gr-axe" text-anchor="middle">Tentatives</text>
        ${ligne}${points}<line class="gr-repere" y1="${ht}" y2="${H - b}" x1="0" x2="0" hidden/>${cibles}
      </svg>
      <div class="gr-bulle" hidden></div>
      <details class="gr-table"><summary>Voir les données</summary><table><tr><th>Tentative</th><th>Date</th><th>Score</th></tr>${h.map((t, i) => `<tr><td>${i + 1}</td><td>${dateCourte(t.d)}</td><td>${Math.round(t.s * 100)} %</td></tr>`).join("")}</table></details>
    </div>`;
  }
  function brancherGraphe(racine) {
    racine.querySelectorAll("[data-graphe]").forEach(gr => {
      const c = trouverCours(gr.dataset.graphe), h = P.historique[c.id] || [];
      const bulle = gr.querySelector(".gr-bulle"), rep = gr.querySelector(".gr-repere"), svg = gr.querySelector("svg");
      const montrer = el => {
        const i = +el.dataset.i, t = h[i], cx = +el.getAttribute("x") + 16;
        rep.setAttribute("x1", cx); rep.setAttribute("x2", cx); rep.hidden = false;
        bulle.innerHTML = `<b>${Math.round(t.s * 100)} %</b><span>Tentative ${i + 1} · ${dateCourte(t.d)}</span>${t.s >= CFG.seuilExamen ? `<em>Réussi</em>` : ""}`;
        bulle.hidden = false;
        const r = svg.getBoundingClientRect(), k = r.width / 640;
        bulle.style.left = Math.min(r.width - 150, Math.max(0, cx * k - 70)) + "px";
      };
      const cacher = () => { bulle.hidden = true; rep.hidden = true; };
      gr.querySelectorAll(".gr-cible").forEach(el => {
        el.addEventListener("mouseenter", () => montrer(el)); el.addEventListener("focus", () => montrer(el));
        el.addEventListener("mouseleave", cacher); el.addEventListener("blur", cacher);
      });
    });
  }

  function vueCompte() {
    if (!COMPTE) {
      app.innerHTML = `<header class="bandeau"><div class="wrap"><p class="surtitre">Mon espace</p><h1>Connecte-toi pour voir ton espace</h1>
        <p class="chapo">Ton espace réunit ta progression, la courbe de tes examens et tes points faibles. Il faut un compte : clique sur « Compte » en haut à droite.</p></div></header>
        <div class="wrap page"><button type="button" class="btn pri" id="ouvrir-compte">Me connecter ou créer un compte</button></div>`;
      document.getElementById("ouvrir-compte").onclick = e => { e.stopPropagation(); ouvrirPanneau(true); };
      return;
    }
    const tous = PARCOURS.flatMap(p => p.cours);
    const nbBadges = tous.filter(examenReussi).length;
    const nbLecons = tous.reduce((n, c) => n + c.lecons.filter(l => leconFaite(c, l)).length, 0);
    const totLecons = tous.reduce((n, c) => n + c.lecons.length, 0);
    const tentatives = Object.values(P.historique).reduce((n, l) => n + l.length, 0);
    const suite = prochainPas();

    // points faibles : taux d'erreur par cours, puis les questions les plus ratées
    const parCours = tous.map(c => {
      const q = Object.values(P.erreurs[c.id] || {}), v = q.reduce((a, x) => a + x.v, 0), n = q.reduce((a, x) => a + x.n, 0);
      return { c, v, n, taux: v ? n / v : 0 };
    }).filter(x => x.v > 0).sort((a, b) => b.taux - a.taux);
    const questions = [];
    tous.forEach(c => Object.values(P.erreurs[c.id] || {}).forEach(x => { if (x.n > 0) questions.push({ c, t: x.t, n: x.n, v: x.v, taux: x.n / x.v }); }));
    questions.sort((a, b) => b.taux - a.taux || b.n - a.n);

    const avecHisto = tous.filter(c => (P.historique[c.id] || []).length);
    let coursGraphe = avecHisto.find(c => c.id === vueCompte.choix) || avecHisto[avecHisto.length - 1];

    app.innerHTML = `<header class="bandeau"><div class="wrap">
        <p class="surtitre">Mon espace</p><h1>${esc(COMPTE.nom)}</h1>
        <p class="chapo">Ta progression, tes examens et ce qu'il te reste à revoir.</p>
        <div class="row" style="margin-top:20px"><a class="btn pri btn-or" href="${suite.href}">${suite.label}</a></div>
      </div></header>
      <div class="wrap page espace">
        <section class="es-bloc">
          <h2>Vue d'ensemble</h2>
          <div class="tuiles">
            <div class="tuile"><b>${nbBadges}<small> / ${tous.length}</small></b><span>badges obtenus</span></div>
            <div class="tuile"><b>${nbLecons}<small> / ${totLecons}</small></b><span>leçons terminées</span></div>
            <div class="tuile"><b>${tentatives}</b><span>examens passés</span></div>
          </div>
          <ul class="es-parcours">${PARCOURS.map(par => {
            const pr = progressionParcours(par), ouvert = par.ouvert();
            return `<li><a href="${par.href}"><span class="es-nom">${esc(par.format ? par.court : "Fondamentaux")}</span>
              <span class="prog"><i style="width:${pr.p * 100}%"></i></span><span class="es-pct">${ouvert ? pct(pr.p) : "Verrouillé"}</span></a></li>`;
          }).join("")}</ul>
        </section>

        <section class="es-bloc">
          <h2>Historique des examens</h2>
          ${avecHisto.length ? `<p class="soft">Ton score à chaque tentative. La ligne pointillée marque le seuil de réussite.</p>
            <div class="es-choix" role="tablist" aria-label="Cours">${avecHisto.map(c => `<button type="button" role="tab" data-c="${c.id}" aria-selected="${c === coursGraphe}" class="${c === coursGraphe ? "on" : ""}">${esc(nomCours(c))}</button>`).join("")}</div>
            <div id="es-graphe">${graphiqueScores(coursGraphe)}</div>`
          : `<div class="es-vide"><p>Tu n'as pas encore passé d'examen avec ce compte. Ta courbe de scores apparaîtra ici après ton premier examen.</p></div>`}
        </section>

        <section class="es-bloc">
          <h2>Points faibles</h2>
          ${parCours.length ? `<p class="soft">Part de réponses fausses à tes examens, par cours.</p>
            <ul class="barres">${parCours.map(x => `<li><a href="#cours-${x.c.id}" title="Revoir le cours"><span class="b-nom">${esc(nomCours(x.c))}</span>
              <span class="b-piste"><i style="width:${Math.max(x.taux * 100, 1.5)}%"></i></span><span class="b-val">${Math.round(x.taux * 100)} %<small>${x.n} sur ${x.v}</small></span></a></li>`).join("")}</ul>
            ${questions.length ? `<h3>Les questions que tu rates le plus</h3><ol class="es-questions">${questions.slice(0, 8).map(q => `<li><p>${esc(q.t)}</p>
              <span class="soft">Ratée ${q.n} fois sur ${q.v} · ${esc(nomCours(q.c))}</span><a href="#cours-${q.c.id}">Revoir le cours</a></li>`).join("")}</ol>` : `<p class="es-vide">Aucune erreur pour l'instant : bravo !</p>`}`
          : `<div class="es-vide"><p>Tes points faibles apparaîtront ici après tes premiers examens.</p></div>`}
        </section>
      </div>`;
    app.querySelectorAll(".es-choix button").forEach(b => b.onclick = () => {
      vueCompte.choix = b.dataset.c;
      app.querySelectorAll(".es-choix button").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
      const z = document.getElementById("es-graphe");
      z.innerHTML = graphiqueScores(trouverCours(b.dataset.c)); brancherGraphe(z); anim(z, "a-droite");
    });
    brancherGraphe(app);
  }

  // Page de connexion : tout le site (sauf l'accueil) demande un compte
  function vueConnexion() {
    app.innerHTML = `<header class="bandeau"><div class="wrap"><p class="surtitre">Compte requis</p><h1>Connecte-toi pour suivre la formation</h1>
      <p class="chapo">Ta progression, tes examens et tes notes sont enregistrés sur ton compte. Tu les retrouves sur n'importe quel appareil.</p></div></header>
      <div class="wrap page"><div class="carte-connexion" id="zone-connexion"></div></div>`;
    dessinerFormulaire(document.getElementById("zone-connexion"), () => {});
  }

  function vueVerrou(msg, retour, libelle) {
    app.innerHTML = `<div class="wrap page" style="max-width:640px"><h1>Pas encore ouvert</h1><p class="chapo">${msg}</p><a class="btn sec" href="${retour}">${libelle}</a></div>`;
  }
  function vueIntrouvable() {
    app.innerHTML = `<div class="wrap page"><h1>Page introuvable</h1><p class="chapo">Cette page n'existe pas, ou plus.</p><a class="btn sec" href="#accueil">Retour à l'accueil</a></div>`;
  }

  // =============================================================
  //  NAVIGATION (#accueil, #fondamentaux, #cours-x, #lecon-x-y, #examen-x, #format-x)
  // =============================================================
  const trouverCours = id => { for (const p of PARCOURS) { const c = p.cours.find(x => x.id === id); if (c) return c; } };
  function enFormat(h) {
    const m = h.match(/^(?:cours|lecon|examen)-([a-z0-9]+)/);
    if (!m) return null;
    const c = trouverCours(m[1]);
    return c && parcoursDe(c).format ? parcoursDe(c) : null;
  }
  function route() {
    const h = (location.hash || "#accueil").slice(1);
    let m;
    if (!COMPTE && h !== "accueil" && h !== "") vueConnexion();
    else if (h === "accueil" || h === "") vueAccueil();
    else if (h === "fondamentaux") vueParcours(PARCOURS[0]);
    else if ((m = h.match(/^parcours-([a-z0-9]+)$/))) vueFormat(S.formats.find(f => f.id === m[1]));
    else if ((m = h.match(/^cours-([a-z0-9]+)$/))) vueCours(trouverCours(m[1]));
    else if ((m = h.match(/^lecon-([a-z0-9]+)-([a-z0-9]+)$/))) vueLecon(trouverCours(m[1]), m[2]);
    else if ((m = h.match(/^examen-([a-z0-9]+)$/))) vueExamen(trouverCours(m[1]));
    else if ((m = h.match(/^format-([a-z0-9]+)$/))) vueFormat(S.formats.find(f => f.id === m[1]));
    else if (h === "compte") vueCompte();
    else vueIntrouvable();
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("on",
      (a.dataset.nav === "accueil" && (h === "accueil" || h === "")) ||
      (a.dataset.nav.startsWith("fmt-") && !!enFormat(h) && enFormat(h).format.id === a.dataset.nav.slice(4)) ||
      (a.dataset.nav === "fondamentaux" && (h === "fondamentaux" || (/^(cours-|lecon-|examen-)/.test(h) && !enFormat(h))))));
    anim(app, "a-page");
    scrollTo(0, 0);
  }



  // ---------- En-tête, pied de page ----------
  document.title = CFG.nomDuSite + " : formations Pokémon";
  document.getElementById("logo").innerHTML = `<svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true"><polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="#ffc93c"/><polygon points="32,18 44,25 44,39 32,46 20,39 20,25" fill="#1b1846"/></svg><span>${esc(CFG.nomDuSite)}</span>`;
  const nl = document.querySelector(".navlinks");
  PARCOURS.filter(p => p.format).forEach(p => { const a = document.createElement("a"); a.href = p.href; a.dataset.nav = "fmt-" + p.format.id; a.textContent = p.format.nom; nl.appendChild(a); });
  document.getElementById("footer-nom").textContent = "© " + CFG.nomDuSite;


  const rs = document.getElementById("reset");
  let arme = false;
  rs.addEventListener("click", () => {
    if (!arme) { arme = true; rs.textContent = "Cliquer encore pour confirmer"; setTimeout(() => { arme = false; rs.textContent = "Réinitialiser ma progression"; }, 4000); return; }
    P = progressionVide(); save(); arme = false; rs.textContent = "Progression effacée"; route();
    setTimeout(() => rs.textContent = "Réinitialiser ma progression", 2000);
  });

  // ---------- Compte (bouton en haut à droite) ----------
  const ICONE_COMPTE = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>`;
  const btnCompte = document.createElement("button");
  btnCompte.type = "button"; btnCompte.className = "btn-compte"; btnCompte.setAttribute("aria-haspopup", "dialog");
  document.querySelector("nav .wrap").appendChild(btnCompte);
  const panneau = document.createElement("div");
  panneau.className = "panneau-compte"; panneau.hidden = true; panneau.setAttribute("role", "dialog"); panneau.setAttribute("aria-label", "Compte");
  document.querySelector("nav .wrap").appendChild(panneau);
  let ongletCompte = "connexion";

  function majBoutonCompte() {
    btnCompte.innerHTML = ICONE_COMPTE + `<span>${COMPTE ? esc(COMPTE.nom) : "Compte"}</span>`;
    btnCompte.classList.toggle("connecte", !!COMPTE);
    btnCompte.setAttribute("aria-label", COMPTE ? "Compte : " + COMPTE.nom : "Se connecter ou créer un compte");
  }
  function ouvrirPanneau(ouvrir) {
    panneau.hidden = !ouvrir;
    btnCompte.setAttribute("aria-expanded", String(ouvrir));
    if (ouvrir) { dessinerPanneau(); anim(panneau, "a-page"); const f = panneau.querySelector("input"); if (f) f.focus(); }
  }
  function dessinerPanneau() {
    if (COMPTE) {
      panneau.innerHTML = `<p class="pc-titre">Connecté en tant que <b>${esc(COMPTE.nom)}</b></p>
        <p class="pc-texte">Ta progression est enregistrée sur ton compte : connecte-toi avec le même nom et le même code sur n'importe quel appareil pour la retrouver.</p>
        <p class="pc-etat" id="compte-etat">${esc(etatCloud)}</p>
        <div class="row"><a class="btn pri sm" href="#compte" id="pc-espace">Mon espace</a><button type="button" class="btn sec sm" id="pc-deco">Se déconnecter</button></div>`;
      panneau.querySelector("#pc-espace").onclick = () => ouvrirPanneau(false);
      panneau.querySelector("#pc-deco").onclick = () => {
        notesUI.desactiver();
        clearTimeout(minuteurCloud);
        COMPTE = null; P = progressionVide();
        majBoutonCompte(); ouvrirPanneau(false); route();
      };
      return;
    }
    dessinerFormulaire(panneau, () => { ouvrirPanneau(false); });
  }
  // Formulaire « Se connecter / Créer un compte » (dans le panneau ou sur la page de connexion)
  function dessinerFormulaire(zone, apres) {
    if (!CLOUD) {
      zone.innerHTML = `<p class="pc-titre">Connexion indisponible</p><p class="pc-texte">Le serveur ne répond pas pour le moment. Vérifie ta connexion à Internet, puis recharge la page.</p>`;
      return;
    }
    const creation = ongletCompte === "creation";
    zone.innerHTML = `<div class="pc-onglets" role="tablist">
        <button type="button" role="tab" data-o="connexion" aria-selected="${!creation}" class="${creation ? "" : "on"}">Se connecter</button>
        <button type="button" role="tab" data-o="creation" aria-selected="${creation}" class="${creation ? "on" : ""}">Créer un compte</button>
      </div>
      <form class="pc-form" novalidate>
        <label>Nom de compte<input type="text" name="nom" maxlength="20" autocomplete="username" required></label>
        <label>Code (8 caractères maximum)<input type="password" name="code" maxlength="8" autocomplete="${creation ? "new-password" : "current-password"}" required></label>
        <p class="pc-msg" aria-live="polite"></p>
        <button class="btn pri" type="submit">${creation ? "Créer mon compte" : "Me connecter"}</button>
        <p class="pc-aide">${creation ? "Choisis un nom que personne n'a pris. Le code n'est pas un vrai mot de passe : n'utilise pas un mot de passe important." : "Il faut le bon nom et le bon code. Pas encore de compte ? Crée-le dans l'autre onglet."}</p>
      </form>`;
    zone.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { ongletCompte = b.dataset.o; dessinerFormulaire(zone, apres); zone.querySelector("input").focus(); });
    const form = zone.querySelector("form"), msg = zone.querySelector(".pc-msg");
    const erreur = t => { msg.textContent = t; msg.className = "pc-msg ko"; anim(form, "a-faux"); };
    const connecte = (compte, progression, etat) => {
      COMPTE = compte; ongletCompte = "connexion";
      P = Object.assign(progressionVide(), progression || {});
      P.historique = P.historique || {}; P.erreurs = P.erreurs || {};
      etatCloud = etat;
      majBoutonCompte(); notesUI.activer(); apres(); route();
    };
    form.onsubmit = e => {
      e.preventDefault();
      const nom = form.nom.value.trim(), code = form.code.value;
      if (!CLOUD.nomValide(nom)) return erreur("Le nom doit faire de 3 à 20 caractères : lettres, chiffres, espaces, - ou _.");
      if (!CLOUD.codeValide(code)) return erreur("Le code doit faire de 1 à 8 caractères, sans espace.");
      const bouton = form.querySelector('button[type="submit"]'); bouton.disabled = true;
      msg.className = "pc-msg"; msg.textContent = creation ? "Création du compte…" : "Connexion…";
      const fin = () => { bouton.disabled = false; };
      if (creation) {
        CLOUD.creer(nom, code, progressionVide()).then(r => {
          fin();
          if (r.erreur === "pris") return erreur("Ce nom de compte est déjà pris. Choisis-en un autre.");
          connecte({ id: r.id, nom }, null, "Compte créé");
        }).catch(() => { fin(); erreur("Impossible de joindre le serveur. Réessaie dans un moment."); });
      } else {
        CLOUD.connecter(nom, code).then(r => {
          fin();
          if (!r) return erreur("Nom de compte ou code incorrect.");
          connecte({ id: r.id, nom: r.nom }, r.progression, "Connecté");
        }).catch(() => { fin(); erreur("Impossible de joindre le serveur. Réessaie dans un moment."); });
      }
    };
  }
  btnCompte.addEventListener("click", e => { e.stopPropagation(); ouvrirPanneau(panneau.hidden); });
  panneau.addEventListener("click", e => e.stopPropagation());
  document.addEventListener("click", () => { if (!panneau.hidden) ouvrirPanneau(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !panneau.hidden) { ouvrirPanneau(false); btnCompte.focus(); } });
  majBoutonCompte();

  // ---------- Bloc-notes (js/notes.js), réservé aux comptes ----------
  const notesUI = window.BlocNotes ? window.BlocNotes({
    charger: () => COMPTE && CLOUD ? CLOUD.chargerNotes(COMPTE.id) : Promise.resolve(null),
    sauver: n => COMPTE && CLOUD ? CLOUD.sauverNotes(COMPTE.id, n) : Promise.reject()
  }) : { activer() {}, desactiver() {} };

  addEventListener("hashchange", route);
  route();

})();
