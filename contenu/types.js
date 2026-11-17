// =============================================================
//  TYPES : données et petits outils d'affichage
//  (utilisés par le cours « Les types » et le calculateur)
// =============================================================
window.SITE = window.SITE || {};

// id (sans accent, pour les fichiers) -> nom affiché et couleur
const TYPES = [
  { id: "normal",   nom: "Normal",   couleur: "#9a9aa0" },
  { id: "feu",      nom: "Feu",      couleur: "#f2652b" },
  { id: "eau",      nom: "Eau",      couleur: "#2e8ff0" },
  { id: "plante",   nom: "Plante",   couleur: "#3fb52a" },
  { id: "electrik", nom: "Électrik", couleur: "#e6b800" },
  { id: "glace",    nom: "Glace",    couleur: "#3cc7e6" },
  { id: "combat",   nom: "Combat",   couleur: "#f39a00" },
  { id: "poison",   nom: "Poison",   couleur: "#9450cf" },
  { id: "sol",      nom: "Sol",      couleur: "#a56d32" },
  { id: "vol",      nom: "Vol",      couleur: "#7fb6ee" },
  { id: "psy",      nom: "Psy",      couleur: "#ef5f7d" },
  { id: "insecte",  nom: "Insecte",  couleur: "#91a019" },
  { id: "roche",    nom: "Roche",    couleur: "#b3a77a" },
  { id: "spectre",  nom: "Spectre",  couleur: "#6b4677" },
  { id: "dragon",   nom: "Dragon",   couleur: "#535fd4" },
  { id: "tenebres", nom: "Ténèbres", couleur: "#4a4146" },
  { id: "acier",    nom: "Acier",    couleur: "#5aa6cf" },
  { id: "fee",      nom: "Fée",      couleur: "#e88fd8" }
];

// Table des types : type de la capacité -> { défenseur: multiplicateur } (seules les valeurs différentes de ×1)
const TABLE_TYPES = {
  normal:   { roche: .5, spectre: 0, acier: .5 },
  feu:      { feu: .5, eau: .5, plante: 2, glace: 2, insecte: 2, roche: .5, dragon: .5, acier: 2 },
  eau:      { feu: 2, eau: .5, plante: .5, sol: 2, roche: 2, dragon: .5 },
  plante:   { feu: .5, eau: 2, plante: .5, poison: .5, sol: 2, vol: .5, insecte: .5, roche: 2, dragon: .5, acier: .5 },
  electrik: { eau: 2, plante: .5, electrik: .5, sol: 0, vol: 2, dragon: .5 },
  glace:    { feu: .5, eau: .5, plante: 2, glace: .5, sol: 2, vol: 2, dragon: 2, acier: .5 },
  combat:   { normal: 2, glace: 2, poison: .5, vol: .5, psy: .5, insecte: .5, roche: 2, spectre: 0, tenebres: 2, acier: 2, fee: .5 },
  poison:   { plante: 2, poison: .5, sol: .5, roche: .5, spectre: .5, acier: 0, fee: 2 },
  sol:      { feu: 2, plante: .5, electrik: 2, poison: 2, vol: 0, insecte: .5, roche: 2, acier: 2 },
  vol:      { plante: 2, electrik: .5, combat: 2, insecte: 2, roche: .5, acier: .5 },
  psy:      { combat: 2, poison: 2, psy: .5, tenebres: 0, acier: .5 },
  insecte:  { feu: .5, plante: 2, combat: .5, poison: .5, vol: .5, psy: 2, spectre: .5, tenebres: 2, acier: .5, fee: .5 },
  roche:    { feu: 2, glace: 2, combat: .5, sol: .5, vol: 2, insecte: 2, acier: .5 },
  spectre:  { normal: 0, psy: 2, spectre: 2, tenebres: .5 },
  dragon:   { dragon: 2, acier: .5, fee: 0 },
  tenebres: { combat: .5, psy: 2, spectre: 2, tenebres: .5, fee: .5 },
  acier:    { feu: .5, eau: .5, electrik: .5, glace: 2, roche: 2, acier: .5, fee: 2 },
  fee:      { feu: .5, combat: 2, poison: .5, dragon: 2, tenebres: 2, acier: .5 }
};

const typeParId = id => TYPES.find(t => t.id === id);

// Multiplicateur d'une capacité contre un Pokémon de un ou deux types
function efficacite(attaque, defenseurs) {
  return defenseurs.reduce((m, d) => m * (TABLE_TYPES[attaque][d] ?? 1), 1);
}

// Étiquette de type à glisser dans un texte :  ${type("feu")}
function type(id) {
  const t = typeParId(id);
  return `<span class="type" style="--c:${t.couleur}"><img src="images/types/${t.id}.webp" alt="">${t.nom}</span>`;
}

// Grille des 18 logos
function grilleTypes() {
  return `<div class="grille-types">${TYPES.map(t => `<figure><img src="images/types/${t.id}.webp" alt="Logo du type ${t.nom}"><figcaption>${t.nom}</figcaption></figure>`).join("")}</div>`;
}

// Table des types à double entrée : type de la capacité en ligne, type du Pokémon qui la reçoit en colonne
function tableauTypes() {
  const cellule = (a, d) => {
    const m = TABLE_TYPES[a][d] ?? 1;
    const cls = m === 2 ? "x2" : m === .5 ? "x05" : m === 0 ? "x0" : "x1";
    const txt = m === 2 ? "2" : m === .5 ? "½" : m === 0 ? "0" : "";
    const ta = typeParId(a).nom, td = typeParId(d).nom;
    const sens = m === 2 ? `${td} est faible face à ${ta}` : m === .5 ? `${td} est résistant face à ${ta}` : m === 0 ? `${td} est immunisé contre ${ta}` : `${td} est neutre face à ${ta}`;
    return `<td class="${cls}" data-a="${a}" data-d="${d}" title="${sens}">${txt}</td>`;
  };
  return `<div class="matrice-types" data-matrice>
<table>
<thead><tr><th class="coin"><span class="coin-d">Défense →</span><span class="coin-a">Capacité ↓</span></th>${TYPES.map(t => `<th class="col" data-d="${t.id}" title="${t.nom}"><img src="images/types/${t.id}.webp" alt="${t.nom}"></th>`).join("")}</tr></thead>
<tbody>
${TYPES.map(a => `<tr><th class="lig" data-a="${a.id}"><img src="images/types/${a.id}.webp" alt="">${a.nom}</th>${TYPES.map(d => cellule(a.id, d.id)).join("")}</tr>`).join("\n")}
</tbody></table></div>
<div class="matrice-legende">
  <span><i class="x2">2</i> le défenseur est faible (dégâts ×2)</span>
  <span><i class="x1"></i> neutre (×1)</span>
  <span><i class="x05">½</i> le défenseur est résistant (×0,5)</span>
  <span><i class="x0">0</i> le défenseur est immunisé (×0)</span>
</div>`;
}

// Calculateur interactif (rendu par le site, voir js/app.js)
function calculateurTypes(depart = []) {
  return `<div class="calculateur" data-calculateur="${depart.join(",")}"></div>`;
}

window.SITE.types = { TYPES, TABLE_TYPES, efficacite, typeParId };
