// =============================================================
//  BLOC-NOTES (bouton en bas à droite, réservé aux comptes)
//  Une fenêtre flottante, déplaçable et redimensionnable, avec un
//  éditeur de texte mis en forme et plusieurs feuilles en onglets
//  (comme les feuilles d'un classeur).
//  Utilisation (dans app.js) :
//    const notes = BlocNotes({ charger: () => Promise<notes|null>, sauver: notes => Promise });
//    notes.activer();  notes.desactiver();
//  Format des notes : { feuilles: { <id>: { titre, html, ordre } }, active: <id> }
// =============================================================
window.BlocNotes = function ({ charger, sauver }) {
  let pos = null;   // position de la fenêtre, gardée en mémoire le temps de la visite
  let notes = null, actif = false, minuteur = null, ouvert = false;

  // ---------- nettoyage du HTML (seules quelques balises sont gardées) ----------
  const BALISES = ["B", "STRONG", "I", "EM", "U", "S", "STRIKE", "H1", "H2", "H3", "P", "DIV", "BR", "UL", "OL", "LI", "SPAN", "MARK", "FONT", "BLOCKQUOTE"];
  function nettoyer(html) {
    const doc = new DOMParser().parseFromString(`<div>${html || ""}</div>`, "text/html");
    const racine = doc.body.firstChild;
    (function parcourir(n) {
      [...n.childNodes].forEach(c => {
        if (c.nodeType === 3) return;
        if (c.nodeType !== 1 || !BALISES.includes(c.tagName)) { c.replaceWith(...(c.nodeType === 1 ? c.childNodes : [])); return; }
        const style = c.getAttribute("style") || "", couleur = c.getAttribute("color");
        [...c.attributes].forEach(a => c.removeAttribute(a.name));
        const garde = (style.match(/(background-color|color)\s*:\s*(#[0-9a-f]{3,6}|rgb\([\d,\s]+\))/gi) || []).join(";");
        if (garde) c.setAttribute("style", garde);
        if (couleur && /^#[0-9a-f]{3,6}$/i.test(couleur)) c.setAttribute("color", couleur);
        parcourir(c);
      });
    })(racine);
    return racine.innerHTML;
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nouvelId = () => "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const feuillesTriees = () => Object.entries(notes.feuilles).sort((a, b) => a[1].ordre - b[1].ordre);
  function notesVides() {
    const id = nouvelId();
    return { feuilles: { [id]: { titre: "Feuille 1", html: "", ordre: 0 } }, active: id };
  }

  // ---------- éléments ----------
  const bouton = document.createElement("button");
  bouton.type = "button"; bouton.className = "btn-notes"; bouton.hidden = true;
  bouton.setAttribute("aria-label", "Ouvrir mes notes");
  bouton.innerHTML = `<svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
    <rect x="9" y="4" width="17" height="22" rx="2.5" fill="#fff" opacity=".45"/>
    <rect x="6" y="7" width="17" height="22" rx="2.5" fill="#fff"/>
    <path d="M10 13h9M10 17h9M10 21h6" stroke="#1b1846" stroke-width="2" stroke-linecap="round"/>
    <path d="M23 7v5h0" stroke="none"/></svg><span>Notes</span>`;

  const fen = document.createElement("section");
  fen.className = "fen-notes"; fen.hidden = true;
  fen.setAttribute("role", "dialog"); fen.setAttribute("aria-label", "Mes notes");
  fen.innerHTML = `
    <header class="fn-tete">
      <span class="fn-titre">Mes notes</span>
      <span class="fn-etat" aria-live="polite"></span>
      <button type="button" class="fn-fermer" aria-label="Fermer les notes">×</button>
    </header>
    <div class="fn-outils" role="toolbar" aria-label="Mise en forme">
      <select class="fn-style" aria-label="Style du paragraphe">
        <option value="P">Texte</option><option value="H1">Titre 1</option><option value="H2">Titre 2</option><option value="H3">Titre 3</option><option value="BLOCKQUOTE">Citation</option>
      </select>
      <span class="fn-sep"></span>
      <button type="button" data-cmd="bold" title="Gras (Ctrl+B)"><b>G</b></button>
      <button type="button" data-cmd="italic" title="Italique (Ctrl+I)"><i>I</i></button>
      <button type="button" data-cmd="underline" title="Souligné (Ctrl+U)"><u>S</u></button>
      <button type="button" data-cmd="strikeThrough" title="Barré"><s>ab</s></button>
      <span class="fn-sep"></span>
      <button type="button" data-cmd="insertUnorderedList" title="Liste à puces">
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle cx="4" cy="5" r="1.6"/><circle cx="4" cy="10" r="1.6"/><circle cx="4" cy="15" r="1.6"/><path d="M8 5h9M8 10h9M8 15h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      <button type="button" data-cmd="insertOrderedList" title="Liste numérotée">
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><text x="1" y="7" font-size="6" font-weight="700" fill="currentColor">1</text><text x="1" y="12.5" font-size="6" font-weight="700" fill="currentColor">2</text><text x="1" y="18" font-size="6" font-weight="700" fill="currentColor">3</text><path d="M8 5h9M8 10h9M8 15h9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
      <span class="fn-sep"></span>
      <span class="fn-couleurs" aria-label="Surligner">
        <button type="button" data-surligne="#fff3a3" title="Surligner en jaune" style="--s:#fff3a3"></button>
        <button type="button" data-surligne="#c9f2d6" title="Surligner en vert" style="--s:#c9f2d6"></button>
        <button type="button" data-surligne="#ffd4d8" title="Surligner en rouge" style="--s:#ffd4d8"></button>
        <button type="button" data-surligne="#dcd6ff" title="Surligner en violet" style="--s:#dcd6ff"></button>
        <button type="button" data-surligne="transparent" title="Retirer le surlignage" class="fn-sans">⌀</button>
      </span>
      <span class="fn-sep"></span>
      <button type="button" data-cmd="undo" title="Annuler (Ctrl+Z)">↶</button>
      <button type="button" data-cmd="redo" title="Rétablir">↷</button>
    </div>
    <div class="fn-page-zone"><div class="fn-page" contenteditable="true" spellcheck="true" aria-label="Texte de la feuille"></div></div>
    <footer class="fn-feuilles">
      <div class="fn-onglets" role="tablist" aria-label="Feuilles"></div>
      <button type="button" class="fn-ajout" title="Nouvelle feuille" aria-label="Nouvelle feuille">+</button>
    </footer>`;
  document.body.append(bouton, fen);

  const page = fen.querySelector(".fn-page"), onglets = fen.querySelector(".fn-onglets"), etat = fen.querySelector(".fn-etat");
  const styleSel = fen.querySelector(".fn-style");

  // ---------- position et taille de la fenêtre (gardées dans le navigateur) ----------
  function placer() {
    const p = pos;
    const l = Math.min(innerWidth - 120, Math.max(0, p ? p.x : innerWidth - 560 - 24));
    const t = Math.min(innerHeight - 80, Math.max(64, p ? p.y : innerHeight - 560 - 96));
    fen.style.left = l + "px"; fen.style.top = t + "px";
    if (p && p.w) { fen.style.width = p.w + "px"; fen.style.height = p.h + "px"; }
  }
  const memoriser = () => { pos = { x: fen.offsetLeft, y: fen.offsetTop, w: fen.offsetWidth, h: fen.offsetHeight }; };
  new ResizeObserver(() => { if (!fen.hidden) memoriser(); }).observe(fen);
  const tete = fen.querySelector(".fn-tete");
  tete.addEventListener("pointerdown", e => {
    if (e.target.closest("button") || innerWidth < 640) return;
    const dx = e.clientX - fen.offsetLeft, dy = e.clientY - fen.offsetTop;
    tete.setPointerCapture(e.pointerId); fen.classList.add("deplace");
    const bouger = ev => {
      fen.style.left = Math.min(innerWidth - 120, Math.max(0, ev.clientX - dx)) + "px";
      fen.style.top = Math.min(innerHeight - 50, Math.max(0, ev.clientY - dy)) + "px";
    };
    const lacher = () => { fen.classList.remove("deplace"); tete.removeEventListener("pointermove", bouger); memoriser(); };
    tete.addEventListener("pointermove", bouger);
    tete.addEventListener("pointerup", lacher, { once: true });
  });

  // ---------- feuilles ----------
  function dessinerOnglets() {
    onglets.innerHTML = feuillesTriees().map(([id, f]) => `<div class="fn-onglet${id === notes.active ? " on" : ""}" data-id="${id}">
        <button type="button" role="tab" aria-selected="${id === notes.active}" class="fn-nom" title="Double-clic pour renommer">${esc(f.titre)}</button>
        ${Object.keys(notes.feuilles).length > 1 ? `<button type="button" class="fn-suppr" aria-label="Supprimer la feuille ${esc(f.titre)}">×</button>` : ""}
      </div>`).join("");
    onglets.querySelectorAll(".fn-onglet").forEach(o => {
      const id = o.dataset.id;
      o.querySelector(".fn-nom").onclick = () => { if (id !== notes.active) { enregistrerPage(); notes.active = id; afficherFeuille(true); } };
      o.querySelector(".fn-nom").ondblclick = () => renommer(o, id);
      const s = o.querySelector(".fn-suppr");
      if (s) s.onclick = () => {
        if (!s.classList.contains("arme")) { s.classList.add("arme"); s.textContent = "Supprimer ?"; setTimeout(() => { if (s.isConnected) { s.classList.remove("arme"); s.textContent = "×"; } }, 3000); return; }
        delete notes.feuilles[id];
        if (notes.active === id) notes.active = feuillesTriees()[0][0];
        afficherFeuille(true); planifier();
      };
    });
    const on = onglets.querySelector(".on"); if (on) on.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function renommer(o, id) {
    const nom = o.querySelector(".fn-nom");
    const inp = document.createElement("input");
    inp.className = "fn-renomme"; inp.value = notes.feuilles[id].titre; inp.maxLength = 40;
    nom.replaceWith(inp); inp.focus(); inp.select();
    const valider = () => { const v = inp.value.trim(); if (v) notes.feuilles[id].titre = v; dessinerOnglets(); planifier(); };
    inp.addEventListener("blur", valider, { once: true });
    inp.addEventListener("keydown", e => { if (e.key === "Enter") inp.blur(); if (e.key === "Escape") { inp.value = notes.feuilles[id].titre; inp.blur(); } });
  }
  function afficherFeuille(animer) {
    page.innerHTML = nettoyer(notes.feuilles[notes.active].html);
    dessinerOnglets();
    if (animer) { page.classList.remove("fn-glisse"); void page.offsetWidth; page.classList.add("fn-glisse"); }
  }
  function enregistrerPage() { if (notes && notes.feuilles[notes.active]) notes.feuilles[notes.active].html = nettoyer(page.innerHTML); }
  fen.querySelector(".fn-ajout").onclick = () => {
    enregistrerPage();
    const id = nouvelId(), n = Object.keys(notes.feuilles).length + 1;
    const ordre = Math.max(...Object.values(notes.feuilles).map(f => f.ordre)) + 1;
    notes.feuilles[id] = { titre: "Feuille " + n, html: "", ordre };
    notes.active = id; afficherFeuille(true); planifier();
    renommer(onglets.querySelector(`[data-id="${id}"]`), id);
  };

  // ---------- mise en forme ----------
  fen.querySelectorAll("[data-cmd]").forEach(b => {
    b.addEventListener("mousedown", e => e.preventDefault());   // garde la sélection dans le texte
    b.onclick = () => { page.focus(); document.execCommand(b.dataset.cmd); majOutils(); planifier(); };
  });
  fen.querySelectorAll("[data-surligne]").forEach(b => {
    b.addEventListener("mousedown", e => e.preventDefault());
    b.onclick = () => { page.focus(); document.execCommand("styleWithCSS", false, true); document.execCommand("hiliteColor", false, b.dataset.surligne); document.execCommand("styleWithCSS", false, false); planifier(); };
  });
  styleSel.onchange = () => { page.focus(); document.execCommand("formatBlock", false, styleSel.value); planifier(); };
  function majOutils() {
    fen.querySelectorAll("[data-cmd]").forEach(b => {
      if (["undo", "redo"].includes(b.dataset.cmd)) return;
      let on = false; try { on = document.queryCommandState(b.dataset.cmd); } catch (e) {}
      b.classList.toggle("on", on);
    });
    let bloc = ""; try { bloc = String(document.queryCommandValue("formatBlock") || "").toUpperCase(); } catch (e) {}
    styleSel.value = ["H1", "H2", "H3", "BLOCKQUOTE"].includes(bloc) ? bloc : "P";
  }
  document.addEventListener("selectionchange", () => { if (!fen.hidden && document.activeElement === page) majOutils(); });
  page.addEventListener("input", planifier);
  page.addEventListener("paste", e => {   // on colle du texte simple, sans la mise en forme du site d'origine
    e.preventDefault();
    document.execCommand("insertText", false, (e.clipboardData || window.clipboardData).getData("text/plain"));
  });

  // ---------- enregistrement ----------
  function planifier() {
    etat.textContent = "Modifications…";
    clearTimeout(minuteur);
    minuteur = setTimeout(envoyer, 900);
  }
  function envoyer() {
    if (!notes) return;
    enregistrerPage();
    etat.textContent = "Enregistrement…";
    sauver(notes).then(() => etat.textContent = "Enregistré", () => etat.textContent = "Non enregistré, réessai bientôt");
  }

  // ---------- ouvrir / fermer ----------
  function ouvrir(o) {
    ouvert = o;
    fen.hidden = !o; bouton.classList.toggle("ouvert", o);
    bouton.setAttribute("aria-expanded", String(o));
    if (o) {
      placer();
      fen.classList.remove("fn-apparait"); void fen.offsetWidth; fen.classList.add("fn-apparait");
      if (!notes) {
        etat.textContent = "Chargement…"; page.innerHTML = "";
        charger().then(n => {
          notes = n && n.feuilles && Object.keys(n.feuilles).length ? n : notesVides();
          if (!notes.feuilles[notes.active]) notes.active = feuillesTriees()[0][0];
          etat.textContent = ""; afficherFeuille(false); page.focus();
        }, () => { etat.textContent = "Impossible de charger tes notes"; });
      } else page.focus();
    } else { clearTimeout(minuteur); if (notes) envoyer(); }
  }
  bouton.onclick = () => ouvrir(!ouvert);
  fen.querySelector(".fn-fermer").onclick = () => { ouvrir(false); bouton.focus(); };
  fen.addEventListener("keydown", e => { if (e.key === "Escape" && !e.target.classList.contains("fn-renomme")) { ouvrir(false); bouton.focus(); } });
  addEventListener("beforeunload", () => { if (minuteur && notes) { clearTimeout(minuteur); enregistrerPage(); sauver(notes); } });

  return {
    activer() { actif = true; bouton.hidden = false; },
    desactiver() { actif = false; if (ouvert) ouvrir(false); notes = null; bouton.hidden = true; }
  };
};
