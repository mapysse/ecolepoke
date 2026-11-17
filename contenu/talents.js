// =============================================================
//  RÉPERTOIRE DES TALENTS (cours « Les talents »)
//  Descriptions rédigées pour le site. Pour la liste complète :
//  https://www.pokepedia.fr/Liste_des_talents
// =============================================================
window.SITE = window.SITE || {};

window.SITE.talents = {
  lienListeComplete: "https://www.pokepedia.fr/Liste_des_talents",
  familles: ["À l'entrée sur le terrain", "Immunité", "Bonus offensif", "Protection", "Réagit en combat"],
  liste: [
    { nom: "Intimidation", famille: "À l'entrée sur le terrain", effet: "Baisse l'Attaque des adversaires de 1 cran quand le Pokémon arrive.", exemple: "Félinferno" },
    { nom: "Sable Volant", famille: "À l'entrée sur le terrain", effet: "Déclenche une tempête de sable de 5 tours quand le Pokémon arrive.", exemple: "Tyranocif" },
    { nom: "Créa-Herbe", famille: "À l'entrée sur le terrain", effet: "Crée un champ herbu de 5 tours quand le Pokémon arrive.", exemple: "Gorythmic" },
    { nom: "Aux Petits Soins", famille: "À l'entrée sur le terrain", effet: "Restaure 1/4 des PV max de l'allié quand le Pokémon arrive (combat double).", exemple: "Théffroyable" },
    { nom: "Tension", famille: "À l'entrée sur le terrain", effet: "Tant que le Pokémon est sur le terrain, les adversaires ne peuvent pas manger leurs baies.", exemple: "Tyranocif (talent caché)" },
    { nom: "Lévitation", famille: "Immunité", effet: "Immunisé contre les capacités Sol et les pièges posés au sol.", exemple: "" },
    { nom: "Absorb Eau", famille: "Immunité", effet: "Immunisé contre les capacités Eau, et soigné quand il en reçoit.", exemple: "" },
    { nom: "Torche", famille: "Immunité", effet: "Immunisé contre les capacités Feu ; s'il en reçoit, ses propres capacités Feu deviennent plus fortes.", exemple: "" },
    { nom: "Herbivore", famille: "Immunité", effet: "Immunisé contre les capacités Plante ; s'il en reçoit, son Attaque augmente.", exemple: "" },
    { nom: "Paratonnerre", famille: "Immunité", effet: "Attire les capacités Électrik ciblées, est immunisé contre elles et augmente son Atq. Spé. quand il en reçoit.", exemple: "" },
    { nom: "Hydrata-Son", famille: "Bonus offensif", effet: "Les capacités sonores du Pokémon deviennent de type Eau.", exemple: "Oratoria" },
    { nom: "Farceur", famille: "Bonus offensif", effet: "Ses capacités de statut deviennent prioritaires. Elles échouent contre les Pokémon Ténèbres qu'elles visent.", exemple: "" },
    { nom: "Général Suprême", famille: "Bonus offensif", effet: "Attaque et Atq. Spé. augmentées de 10 % pour chaque allié K.O. (jusqu'à 5).", exemple: "Scalpereur" },
    { nom: "Brasier", famille: "Bonus offensif", effet: "Quand il lui reste peu de PV, ses capacités Feu deviennent plus fortes.", exemple: "Félinferno (talent de base)" },
    { nom: "Corps Sain", famille: "Protection", effet: "Les adversaires ne peuvent pas baisser ses statistiques.", exemple: "Métalosse" },
    { nom: "Miroir Magik", famille: "Protection", effet: "Renvoie à l'envoyeur les capacités de statut qui le visent.", exemple: "Sorcilence" },
    { nom: "Armure Caudale", famille: "Protection", effet: "Les adversaires ne peuvent pas utiliser de capacités prioritaires sur le Pokémon et ses alliés.", exemple: "Farigiraf" },
    { nom: "Multiécaille", famille: "Protection", effet: "Quand ses PV sont au maximum, les dégâts reçus sont divisés par deux.", exemple: "" },
    { nom: "Point Poison", famille: "Réagit en combat", effet: "30 % de chances d'empoisonner un adversaire qui le touche avec une capacité de contact.", exemple: "Kravarech" },
    { nom: "Peau Dure", famille: "Réagit en combat", effet: "Un adversaire qui le touche avec une capacité de contact perd des PV.", exemple: "" },
    { nom: "Repli Tactique", famille: "Réagit en combat", effet: "Quand ses PV passent sous la moitié, il quitte automatiquement le terrain.", exemple: "Sarmuraï" }
  ]
};

// Bouton « Voir les talents » à placer dans un texte :  ${repertoireTalents()}
function repertoireTalents() {
  return `<details class="repertoire"><summary class="btn sec">Voir les talents</summary><div class="repertoire-corps" data-talents></div></details>`;
}
