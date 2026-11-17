// =============================================================
//  RÉPERTOIRE DES OBJETS (cours « Les objets »)
//  Catégories reprises du menu de Pokémon Champions.
//  Descriptions rédigées pour le site. Pour aller plus loin :
//  https://www.coupcritique.fr/entity/items
// =============================================================
window.SITE = window.SITE || {};

window.SITE.objets = {
  lienListeComplete: "https://www.coupcritique.fr/entity/items",
  familles: ["Stats ↑", "Puissance ↑", "Défense", "Soin", "Durée effets ↑", "Baie", "Méga-Gemme", "Autre"],
  liste: [
    { nom: "Mouchoir Choix", famille: "Stats ↑", effet: "Vitesse ×1,5, mais le Pokémon est bloqué sur la première capacité utilisée jusqu'à ce qu'il quitte le terrain.", img: "mouchoir-choix" },
    { nom: "Herbe Blanche", famille: "Stats ↑", effet: "Annule une fois les baisses de stats du Pokémon, puis disparaît.", img: "herbe-blanche" },
    { nom: "Graine Herbe", famille: "Stats ↑", effet: "+1 cran de Défense quand un champ herbu est actif, puis disparaît.", img: "graine-herbe" },
    { nom: "Orbe Vie", famille: "Puissance ↑", effet: "Capacités ×1,3, mais le Pokémon perd 1/10 de ses PV max à chaque capacité offensive réussie.", img: "orbe-vie" },
    { nom: "Bandeau Muscle", famille: "Puissance ↑", effet: "Renforce un peu les capacités physiques.", img: "bandeau-muscle" },
    { nom: "Lunettes Sages", famille: "Puissance ↑", effet: "Renforce un peu les capacités spéciales.", img: "lunettes-sages" },
    { nom: "Lunettes Noires", famille: "Puissance ↑", effet: "Renforce les capacités de type Ténèbres.", img: "lunettes-noires" },
    { nom: "Ceinture Force", famille: "Défense", effet: "Si le Pokémon a tous ses PV, il survit avec 1 PV à un coup qui devait le mettre K.O. Une seule fois.", img: "ceinture-force" },
    { nom: "Bandeau", famille: "Défense", effet: "Donne une petite chance de survivre avec 1 PV à un coup fatal.", img: "bandeau" },
    { nom: "Baie Babiri", famille: "Défense", effet: "Réduit une fois les dégâts d'une capacité Acier super efficace.", img: "baie-babiri" },
    { nom: "Restes", famille: "Soin", effet: "Rend 1/16 des PV max à la fin de chaque tour.", img: "restes" },
    { nom: "Baie Sitrus", famille: "Soin", effet: "Rend 1/4 des PV max quand les PV passent à la moitié ou moins. Une seule fois.", img: "baie-sitrus" },
    { nom: "Baie Prine", famille: "Soin", effet: "Soigne une fois le statut du Pokémon (brûlure, paralysie, sommeil…).", img: "baie-prine" },
    { nom: "Roche Humide", famille: "Durée effets ↑", effet: "La pluie lancée par le Pokémon dure 8 tours au lieu de 5.", img: "roche-humide" },
    { nom: "Champ'Duit", famille: "Durée effets ↑", effet: "Le terrain créé par le Pokémon dure plus longtemps.", img: "champ-duit" },
    { nom: "Tyranocivite", famille: "Méga-Gemme", effet: "Permet à Tyranocif de méga-évoluer.", img: "tyranocivite" },
    { nom: "Casque Brut", famille: "Autre", effet: "Un adversaire qui touche le Pokémon avec une capacité de contact perd 1/6 de ses PV max.", img: "casque-brut" },
    { nom: "Ballon", famille: "Autre", effet: "Le Pokémon flotte : immunisé contre le Sol, les Picots, Pics Toxik et Toile Gluante. Éclate dès qu'il subit des dégâts.", img: "ballon" },
    { nom: "Vive Griffe", famille: "Autre", effet: "Donne parfois au Pokémon la possibilité d'agir en premier.", img: "vive-griffe" },
    { nom: "Roche Royale", famille: "Autre", effet: "Les capacités offensives peuvent parfois faire reculer la cible.", img: "roche-royale" },
    { nom: "Poudre Claire", famille: "Autre", effet: "Baisse la précision des capacités adverses.", img: "poudre-claire" }
  ]
};

// Bouton « Voir les objets » à placer dans un texte :  ${repertoireObjets()}
function repertoireObjets() {
  return `<details class="repertoire"><summary class="btn sec">Voir les objets</summary><div class="repertoire-corps" data-objets></div></details>`;
}
// Bouton d'objet (image du jeu) pour les questions :  objet("orbe-vie", "Orbe Vie")
function objet(id, nom) { return { img: `images/objets/bouton-${id}.webp`, alt: nom }; }
