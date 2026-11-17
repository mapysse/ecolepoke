// =============================================================
//  FORMATS (VGC, 3v3, 6v6 OU)
//  Chaque format a :
//    parcours      : le cours du format (avec examen), ouvert après les Fondamentaux
//  disponible: false  ->  affiché avec le badge « Bientôt »
// =============================================================
window.SITE = window.SITE || {};

window.SITE.formats = [
  {
    id: "vgc",
    nom: "VGC",
    sousTitre: "Combat double, le format officiel sur Pokémon Champions",
    description: "Deux Pokémon de chaque côté du terrain. Tu amènes 6 Pokémon et tu en choisis 4 pour chaque combat.",
    couleur: "#5ad1ff",
    badge: { couleur: "#0e7fb8", texte: "VGC" },
    cours: { disponible: true }
  },
  {
    id: "3v3",
    nom: "3v3",
    sousTitre: "Combat simple, le format solo sur Pokémon Champions",
    description: "Un Pokémon de chaque côté du terrain. Tu amènes 6 Pokémon et tu en choisis 3 pour chaque combat.",
    couleur: "#ff8a5c",
    badge: { couleur: "#d9542a", texte: "3v3" },
    cours: { disponible: true }
  },
  {
    id: "ou",
    nom: "6v6 OU",
    sousTitre: "Combat simple, le format classique sur Pokémon Showdown",
    description: "Un Pokémon de chaque côté du terrain, et tes 6 Pokémon jouent. Le format le plus joué sur Showdown.",
    couleur: "#b48cff",
    badge: { couleur: "#7048d4", texte: "OU" },
    cours: { disponible: true }
  }
];
