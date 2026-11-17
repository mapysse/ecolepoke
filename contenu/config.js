// =============================================================
//  RÉGLAGES DU SITE
//  Tu peux modifier ces valeurs sans toucher au reste du code.
// =============================================================
window.SITE = window.SITE || {};

window.SITE.config = {
  nomDuSite: "École Pokémon",

  seuilQuiz: 1.0,      // quiz de leçon : 100 % de bonnes réponses pour passer à la leçon suivante
  seuilExamen: 0.8,    // examen de cours : 80 % pour débloquer le cours suivant
  questionsParExamen: 10,  // nombre de questions tirées au hasard dans la banque de l'examen
  piegesMinParExamen: 3    // nombre minimum de questions pièges (marquées  piege: true) dans chaque examen
};
