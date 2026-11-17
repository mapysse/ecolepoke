// =============================================================
//  RÉPERTOIRE DES CAPACITÉS (cours « Les capacités »)
//  Descriptions rédigées pour le site. Pour la liste complète :
//  https://www.pokepedia.fr/Liste_des_capacit%C3%A9s
//  type : id d'un type (voir contenu/types.js) — categorie : "Physique", "Spéciale" ou "Statut"
// =============================================================
window.SITE = window.SITE || {};

window.SITE.capacites = {
  lienListeComplete: "https://www.pokepedia.fr/Liste_des_capacit%C3%A9s",
  categories: ["Physique", "Spéciale", "Statut"],
  liste: [
    { nom: "Abri", type: "normal", categorie: "Statut", puissance: "-", precision: "-", effet: "Protège le lanceur de toutes les capacités pendant le tour. Échoue de plus en plus souvent si on l'enchaîne. Priorité +4." },
    { nom: "Aqua-Jet", type: "eau", categorie: "Physique", puissance: "40", precision: "100", effet: "Priorité +1. Contact." },
    { nom: "Balayage", type: "combat", categorie: "Physique", puissance: "-", precision: "100", effet: "Plus la cible est lourde, plus les dégâts sont élevés. Contact." },
    { nom: "Balayette", type: "combat", categorie: "Physique", puissance: "65", precision: "100", effet: "Baisse la Vitesse de la cible de 1 cran. Contact." },
    { nom: "Bluff", type: "normal", categorie: "Physique", puissance: "40", precision: "100", effet: "Fait reculer la cible. Ne fonctionne qu'au premier tour du lanceur sur le terrain. Priorité +3. Contact." },
    { nom: "Cage-Éclair", type: "electrik", categorie: "Statut", puissance: "-", precision: "90", effet: "Paralyse la cible. Sans effet sur les Pokémon Sol et Électrik." },
    { nom: "Clonage", type: "normal", categorie: "Statut", puissance: "-", precision: "-", effet: "Le lanceur perd 1/4 de ses PV max et crée un clone qui encaisse à sa place. Les capacités de son le traversent." },
    { nom: "Coup Bas", type: "tenebres", categorie: "Physique", puissance: "70", precision: "100", effet: "Priorité +1. Échoue si la cible ne s'apprête pas à utiliser une capacité offensive. Contact." },
    { nom: "Cradovague", type: "poison", categorie: "Spéciale", puissance: "95", precision: "100", effet: "Touche tous les Pokémon autour du lanceur, partenaire compris. Peut empoisonner." },
    { nom: "Danse Lames", type: "normal", categorie: "Statut", puissance: "-", precision: "-", effet: "Augmente l'Attaque du lanceur de 2 crans. Danse." },
    { nom: "Dissonance Psy", type: "psy", categorie: "Spéciale", puissance: "75", precision: "100", effet: "Empêche la cible de récupérer des PV pendant 2 tours. Capacité de son." },
    { nom: "Eau Revoir", type: "eau", categorie: "Physique", puissance: "60", precision: "100", effet: "Après l'attaque, le lanceur retourne dans l'équipe et est remplacé. Contact." },
    { nom: "Frotte-Frimousse", type: "electrik", categorie: "Physique", puissance: "20", precision: "100", effet: "Paralyse la cible à coup sûr. Contact." },
    { nom: "Génusection", type: "tenebres", categorie: "Physique", puissance: "85", precision: "-", effet: "Ne peut pas rater. Contact." },
    { nom: "Distorsion", type: "psy", categorie: "Statut", puissance: "-", precision: "-", effet: "Pendant 5 tours, les Pokémon les plus lents agissent en premier. Priorité −7." },
    { nom: "Draco-Météore", type: "dragon", categorie: "Spéciale", puissance: "130", precision: "90", effet: "Baisse l'Atq. Spé. du lanceur de 2 crans." },
    { nom: "Éboulement", type: "roche", categorie: "Physique", puissance: "75", precision: "90", effet: "Touche les deux adversaires. Peut les faire reculer." },
    { nom: "Feu Follet", type: "feu", categorie: "Statut", puissance: "-", precision: "85", effet: "Brûle la cible." },
    { nom: "Mégaphone", type: "normal", categorie: "Spéciale", puissance: "90", precision: "100", effet: "Touche les deux adversaires. Capacité de son : devient Eau avec Hydrata-Son." },
    { nom: "Pics Toxik", type: "poison", categorie: "Statut", puissance: "-", precision: "-", effet: "Pose un piège dans le camp adverse : les Pokémon qui y entrent sont empoisonnés." },
    { nom: "Piège de Roc", type: "roche", categorie: "Statut", puissance: "-", precision: "-", effet: "Pose un piège dans le camp adverse. Les dégâts dépendent de l'efficacité du type Roche." },
    { nom: "Pisto-Poing", type: "acier", categorie: "Physique", puissance: "40", precision: "100", effet: "Priorité +1. Contact." },
    { nom: "Plénitude", type: "psy", categorie: "Statut", puissance: "-", precision: "-", effet: "Augmente l'Atq. Spé. et la Déf. Spé. du lanceur de 1 cran." },
    { nom: "Poing Éclair", type: "electrik", categorie: "Physique", puissance: "75", precision: "100", effet: "Peut paralyser. Contact." },
    { nom: "Poing Glace", type: "glace", categorie: "Physique", puissance: "75", precision: "100", effet: "Peut geler. Contact." },
    { nom: "Poudre Fureur", type: "insecte", categorie: "Statut", puissance: "-", precision: "-", effet: "Attire sur le lanceur les capacités adverses ciblées pendant le tour. Sans effet sur les Pokémon Plante. Priorité +2." },
    { nom: "Pouvoir Lunaire", type: "fee", categorie: "Spéciale", puissance: "95", precision: "100", effet: "Peut baisser l'Atq. Spé. de la cible." },
    { nom: "Sabotage", type: "tenebres", categorie: "Physique", puissance: "65", precision: "100", effet: "Fait perdre son objet à la cible, et frappe plus fort si elle en tient un. Contact." },
    { nom: "Séisme", type: "sol", categorie: "Physique", puissance: "100", precision: "100", effet: "Touche tous les Pokémon autour du lanceur, partenaire compris." },
    { nom: "Synthèse", type: "plante", categorie: "Statut", puissance: "-", precision: "-", effet: "Le lanceur récupère la moitié de ses PV max (2/3 au soleil, 1/4 sous une autre météo)." },
    { nom: "Tête de Fer", type: "acier", categorie: "Physique", puissance: "80", precision: "100", effet: "Peut faire reculer la cible. Contact." },
    { nom: "Vampibaiser", type: "fee", categorie: "Spéciale", puissance: "50", precision: "100", effet: "Le lanceur récupère les 3/4 des dégâts infligés. Contact." },
    { nom: "Tonnerre", type: "electrik", categorie: "Spéciale", puissance: "90", precision: "100", effet: "Peut paralyser." },
    { nom: "Vitesse Extrême", type: "normal", categorie: "Physique", puissance: "80", precision: "100", effet: "Priorité +2. Contact." },
    { nom: "Zénith", type: "feu", categorie: "Statut", puissance: "-", precision: "-", effet: "Invoque le soleil pendant 5 tours." }
  ]
};

// Bouton « Voir les capacités » à placer dans un texte :  ${repertoireCapacites()}
function repertoireCapacites() {
  return `<details class="repertoire"><summary class="btn sec">Voir les capacités</summary><div class="repertoire-corps" data-capacites></div></details>`;
}
