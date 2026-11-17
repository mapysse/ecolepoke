// =============================================================
//  FONDAMENTAUX (communs à tous les formats)
// =============================================================
//
//  Structure :  cours -> leçons -> { texte, exercices, quiz }  +  examen (banque de questions)
//
//  TYPES DE QUESTIONS (quiz et examens)
//    { type: "choix",   question, options: [...], reponse: 1, explication }          une seule bonne réponse (index à partir de 0)
//    { type: "multi",   question, options: [...], reponses: [0, 2], explication }    plusieurs bonnes réponses
//    { type: "vf",      question, reponse: true / false, explication }               vrai ou faux
//    { type: "ordre",   question, elements: [...dans le BON ordre...], explication } le site les mélange
//    { type: "assoc",   question, paires: [["gauche", "droite"], ...], explication } associer
//    { type: "nombre",  question, reponse: 6, explication }                          réponse chiffrée
//    { type: "zone",    question, image, alt, zones: {...}, reponse: "cle", explication }  cliquer au bon endroit d'une capture
//
//  Question piège : ajouter  piege: true  (l'examen en contient toujours au moins config.piegesMinParExamen)
//  Toute question (ou exercice « situation ») peut afficher une capture : ajouter  image: "images/...webp", alt: "..."
//
//  TYPES D'EXERCICES PRATIQUES (non bloquants, avec correction commentée)
//    { type: "situation", enonce, options: [{ texte, bon: true/false, commentaire }] }
//    { type: "ordre" / "assoc", enonce, ...comme les questions..., commentaire }
//    { type: "libre", enonce, corrige }
//    { type: "zones", enonce, image, alt, zones: { cle: { nom, rect: [gauche, haut, droite, bas] } }, cibles: [cles...], commentaire }
//                                                       cliquer au bon endroit sur une capture (coordonnées en %)
//
//  DIAPORAMA dans les textes :         ${diaporama({ etapes: [{ src, alt, titre, texte }] })}
//  CAPTURES D'ÉCRAN dans les textes :  ${capture({ src, alt, reperes: [{ x, y, texte }], legende, petite })}
//
//  Encadrés possibles dans les textes :
//    <div class="astuce">...</div>   <div class="piege">...</div>   <div class="format">...</div>
// =============================================================
window.SITE = window.SITE || {};

// Petite aide pour les leçons pas encore rédigées
function squelette(titre, points) {
  return {
    id: titre.id, titre: titre.titre, aRediger: true,
    texte: `<div class="a-rediger"><b>Leçon à rédiger.</b> Points prévus :<ul>${points.map(p => `<li>${p}</li>`).join("")}</ul></div>`,
    exercices: [], quiz: []
  };
}

// Capture d'écran annotée : repères numérotés posés sur l'image + légende.
//   reperes : [{ x: 12, y: 40, texte: "..." }]   (x et y en % de la largeur / hauteur de l'image)
function capture({ src, alt, reperes = [], legende = "", petite = false }) {
  return `<figure class="capture${petite ? " petite" : ""}">
  <button type="button" class="capture-img" data-zoom="${src}" aria-label="Agrandir l'image : ${alt}">
    <img src="${src}" alt="${alt}" loading="lazy">
    ${reperes.map((r, i) => `<span class="repere" style="left:${r.x}%;top:${r.y}%">${i + 1}</span>`).join("")}
  </button>
  ${legende ? `<figcaption>${legende}</figcaption>` : ""}
  ${reperes.length ? `<ol class="legende">${reperes.map(r => `<li><span>${r.texte}</span></li>`).join("")}</ol>` : ""}
</figure>`;
}

// Diaporama : plusieurs captures à faire défiler, avec une légende par étape.
//   etapes : [{ src, alt, titre, texte }]
function diaporama({ etapes }) {
  return `<div class="diapo" data-diapo>
  ${etapes.map((e, i) => `<figure class="diapo-etape" data-i="${i}"${i ? " hidden" : ""}>
    <button type="button" class="capture-img" data-zoom="${e.src}" aria-label="Agrandir l'image : ${e.alt}"><img src="${e.src}" alt="${e.alt}"></button>
    <figcaption><b>Étape ${i + 1} sur ${etapes.length} : ${e.titre}</b><span>${e.texte}</span></figcaption>
  </figure>`).join("")}
  <div class="diapo-nav">
    <button type="button" class="btn sec sm" data-dir="-1">Étape précédente</button>
    <div class="diapo-points">${etapes.map((e, i) => `<button type="button" data-aller="${i}" aria-label="Étape ${i + 1} : ${e.titre}"></button>`).join("")}</div>
    <button type="button" class="btn pri sm" data-dir="1">Étape suivante</button>
  </div>
</div>`;
}

// Zones cliquables réutilisables (en % de l'image : [gauche, haut, droite, bas])
// Fiche individuelle d'un Pokémon dans Champions (même mise en page pour tous les Pokémon)
const ZONES_FICHE = {
  types:    { nom: "les types",        rect: [58, 85, 79, 90.5] },
  talent:   { nom: "le talent",        rect: [72, 64, 94, 73.5] },
  stats:    { nom: "les statistiques", rect: [2, 31.5, 34, 59] },
  nature:   { nom: "la nature",        rect: [2, 59, 34, 64.5] },
  capacites: { nom: "les capacités",     rect: [68, 16.5, 97.5, 57.5] }
};
// Historique d'un tour (combat-historique-tour.webp)
const ZONES_HISTORIQUE = {
  capacite:     { nom: "la ligne « Capacité » de Sarmuraï",     rect: [6, 9, 90, 22.2] },
  baisse:       { nom: "la ligne « Baisse de PV »",            rect: [6, 22.2, 90, 35.6] },
  objet:        { nom: "la ligne « Objet tenu »",              rect: [6, 35.6, 90, 48.9] },
  recuperation: { nom: "la ligne « Récupération de PV »",      rect: [6, 48.9, 90, 62.2] },
  distorsion:   { nom: "la ligne de Distorsion (priorité −7)", rect: [6, 62.2, 90, 75.5] }
};

window.SITE.fondamentaux = {
  titre: "Fondamentaux",
  intro: "Les bases communes à tous les formats. Réussis les examens des 7 cours pour débloquer le parcours de chaque format.",
  cours: [

  // ===========================================================
  //  COURS 1 · POKÉMON : VUE D'ENSEMBLE   (rédigé)
  // ===========================================================
  {
    id: "pokemon",
    titre: "Pokémon : vue d'ensemble",
    objectifs: [
      "Savoir de quoi est composé un Pokémon de combat",
      "Comprendre comment est construite une équipe",
      "Connaître le déroulé d'un tour de combat",
      "Savoir comment on gagne une partie"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "composition",
        titre: "De quoi est composé un Pokémon",
        texte: `
${capture({
  src: "images/oratoria-fiche.webp",
  alt: "Fiche d'Oratoria dans Pokémon Champions",
  reperes: [
    { x: 55.8, y: 87.5, texte: "<strong>Types</strong> : Eau et Fée" },
    { x: 72.3, y: 68.8, texte: "<strong>Talent</strong> : Hydrata-Son" },
    { x: 3.2, y: 34.4, texte: "<strong>Statistiques</strong> : les 6 stats (PV, Attaque, Défense, Atq. Spé., Déf. Spé., Vitesse)" },
    { x: 4.6, y: 61.1, texte: "<strong>Nature</strong> : Modeste (Champions l'appelle « Ajust. de stats »)" },
    { x: 67.6, y: 21.9, texte: "<strong>Capacités</strong> : Mégaphone, Pouvoir Lunaire, Aqua-Jet et Abri" }
  ],
  legende: "La fiche d'Oratoria dans Pokémon Champions. Clique sur l'image pour l'agrandir."
})}
<p>Un Pokémon de combat, ce n'est pas seulement une espèce : c'est un ensemble d'éléments, dont la plupart sont choisis par toi. On appelle cet ensemble un <strong>set</strong>. La fiche d'Oratoria ci-dessus en montre presque tous les éléments.</p>
<h2>Les éléments d'un Pokémon</h2>
<table>
<tr><th>Élément</th><th>Ce que c'est</th><th>Combien</th></tr>
<tr><td>Types</td><td>Définissent ses forces et ses faiblesses</td><td>1 ou 2</td></tr>
<tr><td>Talent</td><td>Un effet passif, actif en permanence</td><td>1</td></tr>
<tr><td>Statistiques</td><td>PV, Attaque, Défense, Attaque Spéciale, Défense Spéciale, Vitesse</td><td>6</td></tr>
<tr><td>Nature</td><td>Augmente une statistique de 10 % et en baisse une autre de 10 %</td><td>1</td></tr>
<tr><td>Capacités</td><td>Choisies parmi toutes celles qu'il peut apprendre : son <strong>movepool</strong>. Ce sont les « attaques » du Pokémon.</td><td>4 maximum</td></tr>
<tr><td>Objet</td><td>Un objet tenu qui lui apporte un effet</td><td>0 ou 1 (fortement recommandé)</td></tr>
<tr><td>Niveau</td><td>Fixé par le format</td><td>—</td></tr>
</table>
<h2>Et l'objet ?</h2>
<p>Il n'apparaît pas sur la fiche individuelle. Pour le voir, il faut regarder l'<strong>écran d'équipe</strong>, qui résume chaque Pokémon : son talent, son objet et ses capacités.</p>
${capture({
  src: "images/oratoria-equipe-capacites.webp",
  alt: "Oratoria sur l'écran d'équipe, onglet Capacités",
  petite: true,
  legende: "Écran d'équipe, onglet « Capacités, etc. » : sous le talent (Hydrata-Son), on voit l'objet d'Oratoria, des <strong>Restes</strong>."
})}
<p>En combat, l'objet agit tout seul, sans que tu aies à le choisir. Ici, la Baie Sitrus de Farigiraf s'active dès que ses PV passent sous la moitié, et lui rend des PV :</p>
${capture({
  src: "images/combat-baie-sitrus.webp",
  alt: "La Baie Sitrus de Farigiraf s'active en combat",
  reperes: [
    { x: 20.2, y: 38.8, texte: "Le jeu annonce l'objet qui s'active : <strong>Baie Sitrus de Farigiraf</strong>." },
    { x: 23.8, y: 91.1, texte: "Farigiraf vient de tomber à <strong>50 PV sur 224</strong>, sous la moitié : c'est ce qui déclenche la baie." }
  ],
  legende: "Une Baie Sitrus qui s'active pendant un combat."
})}
<h2>Lire la nature sur l'écran</h2>
<p>L'onglet Stats de l'écran d'équipe montre aussi l'effet de la nature, grâce à deux flèches :</p>
<ul>
<li><strong>flèche rouge vers le haut</strong> : la statistique augmentée de 10 % (ici l'Atq. Spé.) ;</li>
<li><strong>flèche bleue vers le bas</strong> : la statistique baissée de 10 % (ici l'Attaque).</li>
</ul>
${capture({
  src: "images/oratoria-equipe-stats.webp",
  alt: "Oratoria sur l'écran d'équipe, onglet Stats",
  petite: true,
  legende: "Écran d'équipe, onglet « Stats ». Les nombres à droite de chaque barre (21, 21, 24) sont les points investis dans chaque statistique : on les verra dans le cours « Statistiques »."
})}
<p>C'est logique : Oratoria attaque avec des capacités spéciales comme Pouvoir Lunaire. La nature Modeste renforce ce qui lui sert et baisse l'Attaque, dont elle n'a pas besoin.</p>
<h2>Sur Showdown</h2>
<p>Sur Showdown, un set s'écrit sous forme de texte. Le même Oratoria donnerait ceci (traduit en français) :</p>
<pre class="fiche">Oratoria @ Restes
Talent : Hydrata-Son
Nature : Modeste
- Mégaphone
- Pouvoir Lunaire
- Aqua-Jet
- Abri</pre>
<div class="format"><b>Ça dépend du format :</b> les Pokémon sont au niveau 50 sur Pokémon Champions (VGC et 3v3) et au niveau 100 en 6v6 OU sur Showdown. La façon de répartir les statistiques change aussi : on la verra dans le cours « Statistiques ».</div>
<div class="astuce"><b>Astuce :</b> chaque élément a son propre cours dans les Fondamentaux (Types, Talents, Statistiques, Capacités, Objets). Pour l'instant, retiens simplement la liste.</div>`,
        exercices: [
          {
            type: "zones",
            enonce: "Trouve chaque élément sur la fiche d'Oratoria, en cliquant directement sur l'image.",
            image: "images/oratoria-fiche.webp",
            alt: "Fiche d'Oratoria dans Pokémon Champions",
            zones: ZONES_FICHE,
            cibles: ["talent", "nature", "types", "capacites"],
            commentaire: "Sur Champions, la nature s'affiche sous le nom « Ajust. de stats », juste sous les statistiques."
          },
          {
            type: "situation",
            enonce: "Voici la fiche de Tyranocif. D'après les flèches à côté des statistiques, quel est l'effet de sa nature, Rigide ?",
            image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif dans Pokémon Champions",
            options: [
              { texte: "Elle augmente l'Attaque et baisse l'Atq. Spé.", bon: true,
                commentaire: "Oui : la flèche rouge vers le haut est sur l'Attaque, la bleue vers le bas sur l'Atq. Spé. Parfait pour un attaquant physique comme Tyranocif." },
              { texte: "Elle augmente l'Atq. Spé. et baisse l'Attaque.", bon: false,
                commentaire: "C'est l'inverse : regarde où se trouve la flèche rouge vers le haut." },
              { texte: "Elle augmente la Vitesse.", bon: false,
                commentaire: "Non, la Vitesse n'a aucune flèche sur cette fiche." }
            ]
          },
          {
            type: "assoc",
            enonce: "Associe chaque élément du set d'Oratoria à ce qu'il représente.",
            paires: [["Eau / Fée", "Types"], ["Hydrata-Son", "Talent"], ["Modeste", "Nature"], ["Pouvoir Lunaire", "Attaque"], ["Restes", "Objet"]],
            commentaire: "Les types dépendent de l'espèce. Le talent, la nature, les capacités et l'objet font partie du set, et c'est toi qui les choisis."
          }
        ],
        quiz: [
          { type: "choix", question: "Combien de capacités un Pokémon peut-il avoir au maximum en combat ?",
            options: ["2", "4", "6", "Toutes celles de son movepool"], reponse: 1,
            explication: "Un Pokémon combat avec 4 capacités au maximum, choisies dans son movepool." },
          { type: "choix", question: "Combien de types un Pokémon peut-il avoir ?",
            options: ["1 seulement", "1 ou 2", "Jusqu'à 3", "Toujours 2"], reponse: 1,
            explication: "Un Pokémon a un ou deux types." },
          { type: "vf", question: "Un Pokémon peut avoir deux talents actifs en même temps.", reponse: false,
            explication: "Un Pokémon n'a qu'un seul talent à la fois." },
          { type: "vf", question: "Un Pokémon doit obligatoirement tenir un objet pour combattre.", reponse: false,
            explication: "L'objet est facultatif, mais fortement recommandé : sans objet, on se prive d'un avantage." },
          { type: "multi", question: "Lesquels font partie des 6 statistiques ?",
            options: ["PV", "Précision", "Vitesse", "Attaque Spéciale", "Talent"], reponses: [0, 2, 3],
            explication: "Les 6 statistiques sont : PV, Attaque, Défense, Attaque Spéciale, Défense Spéciale et Vitesse." },
          { type: "zone", question: "Clique sur le talent d'Oratoria.",
            image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria", zones: ZONES_FICHE, reponse: "talent",
            explication: "Le talent (Hydrata-Son) est affiché en bas à droite, sous les capacités." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "equipe",
        titre: "De quoi est composée une équipe",
        texte: `
${capture({
  src: "images/equipe-capacites.webp",
  alt: "Une équipe de 6 Pokémon dans Pokémon Champions, onglet Capacités",
  reperes: [
    { x: 17.6, y: 15.9, texte: "<strong>L'espèce</strong>, avec ses types à droite (ici Sarmuraï)" },
    { x: 70.2, y: 22.2, texte: "<strong>Le talent</strong> (ici Aux Petits Soins, pour Théffroyable)" },
    { x: 17.6, y: 58.8, texte: "<strong>L'objet</strong> (ici Tyranocivite, pour Tyranocif)" },
    { x: 43, y: 16.1, texte: "<strong>Les 4 capacités</strong> (ici celles de Sarmuraï)" }
  ],
  legende: "Une équipe complète sur l'écran d'équipe de Pokémon Champions, onglet « Capacités, etc. ». Chaque carte se lit de la même façon : les repères sont répartis sur plusieurs Pokémon pour rester lisibles."
})}
<p>En combat, tu n'utilises pas un Pokémon seul mais une <strong>équipe de 6 Pokémon</strong>. L'écran d'équipe ci-dessus en montre une, avec le set de chaque Pokémon.</p>
<h2>Les règles de base</h2>
<ul>
<li>Une équipe compte <strong>6 Pokémon</strong> au maximum.</li>
<li><strong>Clause espèce :</strong> une même espèce ne peut pas apparaître deux fois dans l'équipe.</li>
<li>Chaque Pokémon a son propre set : talent, nature, capacités, objet.</li>
</ul>
<p>L'équipe ci-dessus respecte aussi la règle des objets du VGC : ses 6 Pokémon tiennent <strong>6 objets différents</strong> (Sarmuraïte, Baie Lampou, Tyranocivite, Restes, Casque Brut et Baie Sitrus).</p>
<div class="format"><b>Ça dépend du format :</b> tu construis toujours une équipe de 6, mais tu n'en joues pas autant : 4 en VGC, 3 en 3v3, les 6 en 6v6 OU. Pour les objets, en VGC, deux Pokémon d'une même équipe ne peuvent pas tenir le même objet. En 6v6 OU sur Showdown, cette restriction n'existe pas.</div>
<h2>Des rôles complémentaires</h2>
<table>
<tr><th>Rôle</th><th>Ce qu'il fait</th></tr>
<tr><td>Attaquant physique</td><td>Frappe fort grâce à son Attaque</td></tr>
<tr><td>Attaquant spécial</td><td>Frappe fort grâce à son Attaque Spéciale</td></tr>
<tr><td>Défensif</td><td>Encaisse les coups et use l'adversaire</td></tr>
<tr><td>Soutien</td><td>Aide l'équipe : soins, statuts, contrôle de la Vitesse...</td></tr>
</table>
<h2>Reconnaître les rôles sur l'écran</h2>
<p>Les statistiques et les capacités d'un Pokémon trahissent son rôle. Sur l'onglet Stats de la même équipe :</p>
${capture({
  src: "images/equipe-stats.webp",
  alt: "La même équipe dans Pokémon Champions, onglet Stats",
  reperes: [
    { x: 18.6, y: 45.8, texte: "<strong>Tyranocif</strong> : tout en Attaque (204), avec des capacités physiques comme Éboulement. C'est un <strong>attaquant physique</strong>." },
    { x: 68.4, y: 45.8, texte: "<strong>Oratoria</strong> : grosse Atq. Spé. (187), renforcée par sa nature. C'est une <strong>attaquante spéciale</strong>." },
    { x: 19.6, y: 75.8, texte: "<strong>Félinferno</strong> : ses points vont en PV, Défense et Déf. Spé., et il a Intimidation et Bluff. C'est un <strong>soutien</strong> fait pour encaisser." }
  ],
  legende: "La même équipe, onglet « Stats »."
})}
<p>Côté capacités, on repère aussi les soutiens : Théffroyable a Poudre Fureur, qui attire les capacités adverses sur lui pour protéger son partenaire.</p>
<div class="astuce"><b>Une équipe a un plan :</b> ici, Théffroyable et Farigiraf connaissent tous les deux <strong>Distorsion</strong>, une capacité qui fait agir les Pokémon les plus lents en premier pendant quelques tours. Les attaquants de l'équipe (Tyranocif, Oratoria, Sarmuraï) sont plutôt lents : toute l'équipe est construite autour de ce plan. Tu l'étudieras en détail dans le format VGC.</div>
<h2>Éviter les faiblesses communes</h2>
<p>Si trois de tes Pokémon sont faibles au même type, un seul adversaire de ce type peut mettre en danger la moitié de ton équipe. Vérifie que chaque type dangereux a au moins une réponse dans ton équipe.</p>
<div class="piege"><b>Piège à éviter :</b> six Pokémon très forts ne font pas forcément une bonne équipe. Une bonne équipe, ce sont des Pokémon qui se couvrent les uns les autres.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "D'après les captures de l'équipe, associe chaque Pokémon à son rôle.",
            paires: [["Tyranocif", "Attaquant physique"], ["Oratoria", "Attaquant spécial"], ["Théffroyable", "Soutien"], ["Félinferno", "Soutien"]],
            commentaire: "Tyranocif mise tout sur l'Attaque, Oratoria sur l'Atq. Spé. Théffroyable (Poudre Fureur, Distorsion) et Félinferno (Intimidation, Bluff) aident leur partenaire plutôt que de frapper fort."
          },
          {
            type: "situation",
            enonce: "Dans cette équipe, tu veux donner des Restes à Félinferno à la place de son Casque Brut. En VGC, est-ce possible ?",
            image: "images/equipe-capacites.webp", alt: "L'équipe sur l'écran d'équipe, onglet Capacités",
            options: [
              { texte: "Oui, sans rien changer d'autre.", bon: false,
                commentaire: "Non : Oratoria tient déjà des Restes, et en VGC deux Pokémon ne peuvent pas tenir le même objet." },
              { texte: "Non, sauf si Oratoria change d'objet.", bon: true,
                commentaire: "Exactement : en VGC, un objet ne peut être tenu que par un seul Pokémon de l'équipe. Il faudrait d'abord retirer les Restes à Oratoria." },
              { texte: "Oui, la règle ne concerne que les baies.", bon: false,
                commentaire: "Non, la règle concerne tous les objets." }
            ]
          },
          {
            type: "situation",
            enonce: "Tu montes ton équipe et tu remarques que 3 de tes 6 Pokémon sont faibles au type Glace. Que fais-tu ?",
            options: [
              { texte: "Rien, ce n'est qu'un type parmi 18.", bon: false,
                commentaire: "Risqué : un seul Pokémon Glace adverse pourrait menacer la moitié de ton équipe." },
              { texte: "Je remplace un des trois par un Pokémon qui résiste à la Glace.", bon: true,
                commentaire: "Bonne réponse : tu réduis la faiblesse commune et tu gagnes un Pokémon capable d'encaisser les capacités Glace." },
              { texte: "J'ajoute deux exemplaires d'un même Pokémon qui résiste à la Glace.", bon: false,
                commentaire: "Impossible : la clause espèce interdit d'avoir deux fois la même espèce." }
            ]
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien de Pokémon compte une équipe complète ?", reponse: 6,
            explication: "Une équipe compte 6 Pokémon, quel que soit le format." },
          { type: "vf", question: "Tu peux mettre deux Carchacrok dans ton équipe.", reponse: false,
            explication: "La clause espèce interdit d'avoir deux fois la même espèce." },
          { type: "choix", question: "En VGC, combien de Pokémon de ton équipe joues-tu dans un combat ?",
            options: ["3", "4", "6", "2"], reponse: 1,
            explication: "En VGC, tu amènes 6 Pokémon et tu en choisis 4." },
          { type: "multi", question: "Lesquels sont des rôles possibles dans une équipe ?",
            options: ["Attaquant spécial", "Soutien", "Défensif", "Arbitre"], reponses: [0, 1, 2],
            explication: "Attaquant (physique ou spécial), défensif et soutien sont les grands rôles. « Arbitre » n'en est pas un." },
          { type: "vf", question: "Dans cette équipe, deux Pokémon tiennent le même objet.",
            image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités", reponse: false,
            explication: "Les 6 objets sont tous différents : Sarmuraïte, Baie Lampou, Tyranocivite, Restes, Casque Brut et Baie Sitrus." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "combat",
        titre: "Déroulé d'un combat",
        texte: `
<p>Voici un combat en double (format VGC) sur Pokémon Champions, de la sélection des Pokémon jusqu'au choix des capacités. Avance étape par étape avec les boutons. Chaque étape est expliquée en détail plus bas.</p>
${diaporama({ etapes: [
  { src: "images/combat-selection.webp", alt: "Écran de sélection des 4 Pokémon avant le combat",
    titre: "L'aperçu des équipes",
    texte: "Tu vois les 6 Pokémon de l'adversaire, à droite, mais pas leurs sets. Tu as un temps limité pour choisir les 4 que tu vas jouer." },
  { src: "images/combat-selection-avantages.webp", alt: "Flèches d'avantage et de désavantage pendant la sélection",
    titre: "Le jeu t'aide à choisir",
    texte: "Quand tu places le curseur sur un de tes Pokémon (ici Félinferno), des flèches apparaissent : vers le haut, il est avantagé face à cet adversaire ; vers le bas, il est désavantagé." },
  { src: "images/combat-ordre-depart.webp", alt: "Les 4 Pokémon choisis, numérotés de 1 à 4",
    titre: "L'ordre de départ",
    texte: "Les numéros donnent l'ordre : 1 et 2 commencent sur le terrain, 3 et 4 restent en réserve. Il ne reste qu'à attendre que l'adversaire confirme sa sélection." },
  { src: "images/combat-choix-action.webp", alt: "Début du combat, choix entre Attaque et Pokémon",
    titre: "Attaquer ou changer",
    texte: "Le combat commence : Farigiraf et Sarmuraï (les numéros 1 et 2) face à Minotaupe et Milobellus. Pour chacun de tes Pokémon, tu choisis « Attaque » ou « Pokémon » pour le remplacer." },
  { src: "images/combat-choix-attaque.webp", alt: "Choix de la capacité avec l'indication d'efficacité",
    titre: "Choisir la capacité",
    texte: "Le jeu indique l'efficacité de chaque capacité sur la cible (« Efficace », « Super efficace »…). Les nombres à droite sont les PP restants." },
  { src: "images/combat-resume.webp", alt: "Résumé de l'équipe pendant le combat",
    titre: "Consulter le résumé",
    texte: "Pendant le combat, tu peux ouvrir le résumé : les capacités, le talent et l'objet de tes Pokémon, et à droite les 6 Pokémon de l'adversaire." },
  { src: "images/combat-attente.webp", alt: "Message Communication en cours pendant l'attente de l'adversaire",
    titre: "Attendre l'adversaire",
    texte: "Une fois tes choix validés, tu attends ceux de l'adversaire (« Communication en cours… »). Personne ne voit le choix de l'autre : le tour se joue ensuite automatiquement." }
] })}
<h2>Avant le combat : l'aperçu des équipes</h2>
<p>Les deux joueurs voient les 6 Pokémon de l'adversaire, mais pas leurs sets. Selon le format, chacun choisit ensuite les Pokémon qu'il va jouer et ceux qui commencent sur le terrain.</p>
<p>Sur Pokémon Champions, tu donnes un numéro à chaque Pokémon choisi : en VGC, les numéros 1 et 2 commencent le combat, les numéros 3 et 4 attendent en réserve.</p>
<h2>Un tour de combat</h2>
<ol>
<li><strong>Choix simultanés :</strong> chaque joueur choisit, pour chacun de ses Pokémon sur le terrain, une capacité ou un changement. Personne ne voit le choix de l'autre.</li>
<li><strong>Les changements de Pokémon</strong> sont effectués en premier.</li>
<li><strong>Les capacités</strong> sont ensuite exécutées selon leur <strong>priorité</strong>. Certaines passent avant les autres (Abri, Vive-Attaque) ; d'autres ont une priorité négative et passent après tout le monde (Distorsion).</li>
<li>À priorité égale, le Pokémon le plus <strong>rapide</strong> agit en premier. En cas d'égalité parfaite de Vitesse, c'est le hasard qui décide.</li>
<li><strong>Fin de tour :</strong> les effets qui durent s'appliquent (météo, dégâts de brûlure ou de poison, soin des Restes...).</li>
<li><strong>Remplacement :</strong> chaque Pokémon mis K.O. est remplacé par un Pokémon de réserve, s'il en reste.</li>
</ol>
<h2>Une action spéciale : la Méga-Évolution</h2>
<p>Sur Pokémon Champions, un Pokémon qui tient <strong>sa Méga-Gemme</strong> peut méga-évoluer pendant le combat. Au moment de choisir sa capacité, un bouton <strong>Méga-Évolution</strong> apparaît : tu l'actives en plus de la capacité. Le Pokémon méga-évolue au début du tour, avant que les capacités ne soient lancées.</p>
${capture({
  src: "images/combat-mega-evolution.webp",
  alt: "Choix de la capacité de Tyranocif avec le bouton Méga-Évolution",
  reperes: [
    { x: 65.8, y: 78.5, texte: "Le bouton <strong>Méga-Évolution</strong> (touche R) : il apparaît parce que Tyranocif tient sa Tyranocivite." },
    { x: 88.3, y: 71.1, texte: "L'<strong>efficacité</strong> de chaque capacité sur la cible : « Pas très efficace », « Super efficace », « Efficace »." },
    { x: 45.4, y: 7.1, texte: "Un <strong>effet qui dure</strong> : la tempête de sable, déclenchée par Sable Volant, avec ses tours restants (4/5)." }
  ],
  legende: "Le choix de la capacité de Tyranocif, avec le bouton Méga-Évolution."
})}
<p>Attention : en méga-évoluant, certains Pokémon <strong>changent de talent</strong>. Tu verras ça dans le cours « Les talents ».</p>
<div class="format"><b>Ça dépend du format :</b> la Méga-Évolution existe sur Pokémon Champions (VGC et 3v3). En 6v6 OU sur Showdown, c'est la Téracristallisation qui joue ce rôle d'action spéciale. Tu verras ces mécaniques en détail dans le cours « Les objets ».</div>
<h2>Ce qui peut se passer pendant un tour</h2>
<p>Pendant le combat, le bouton <strong>+</strong> ouvre l'<strong>historique</strong>, qui liste tout ce qui s'est passé depuis le début. Il montre bien les différentes actions et événements d'un tour :</p>
${capture({
  src: "images/combat-historique-tour.webp",
  alt: "Historique du tour 1 dans Pokémon Champions",
  reperes: [
    { x: 17.7, y: 15.6, texte: "<strong>Capacité</strong> : un Pokémon utilise une capacité (ici Sarmuraï utilise Vampirisme)." },
    { x: 17.7, y: 28.9, texte: "<strong>Baisse de PV</strong> : la cible perd des PV (Milobellus passe de 100 % à 40 %)." },
    { x: 17.7, y: 42.2, texte: "<strong>Objet tenu</strong> : un objet s'active tout seul (la Baie Sitrus de Milobellus)." },
    { x: 17.7, y: 55.6, texte: "<strong>Récupération de PV</strong> : le Pokémon regagne des PV (40 % → 65 %)." },
    { x: 33.5, y: 71.9, texte: "<strong>Priorité</strong> : quand une capacité a une priorité, l'historique l'indique (ici −7 pour Distorsion)." }
  ],
  legende: "L'historique, ouvert avec le bouton + pendant le combat."
})}
<p>On y voit aussi l'ordre d'action : Distorsion, avec sa priorité de −7, passe après toutes les autres actions du tour.</p>
<h2>Les effets qui durent</h2>
<p>Certains effets restent actifs pendant plusieurs tours. Le jeu les affiche dans l'écran d'informations :</p>
${capture({
  src: "images/combat-effets-terrain.webp",
  alt: "Effets sur le Pokémon et le terrain : Distorsion active",
  reperes: [
    { x: 87.6, y: 33.3, texte: "<strong>Distorsion est active</strong>, avec le nombre de tours restants (4 sur 5). Le jeu rappelle son effet : les Pokémon agissent du plus lent au plus rapide." },
    { x: 45.6, y: 71.6, texte: "<strong>Les modifications de stats</strong> du Pokémon : ici, la Vitesse de Farigiraf a été baissée (×0,67). On les verra dans le cours « Statistiques »." }
  ],
  legende: "Écran « Effets sur le Pokémon et le terrain »."
})}
<div class="astuce"><b>Astuce :</b> comme les choix sont simultanés, le combat Pokémon est un jeu d'anticipation. Tu dois deviner ce que l'adversaire va faire.</div>
<div class="format"><b>Ça dépend du format :</b> en VGC, deux Pokémon par camp sont sur le terrain, tu fais donc deux choix par tour. En 3v3 et en 6v6 OU, un seul.</div>`,
        exercices: [
          {
            type: "zones",
            enonce: "Retrouve chaque événement dans l'historique du tour 1, en cliquant sur la bonne ligne.",
            image: "images/combat-historique-tour.webp",
            alt: "Historique du tour 1 dans Pokémon Champions",
            zones: {
              capacite:     { nom: "la capacité utilisée par Sarmuraï", rect: ZONES_HISTORIQUE.capacite.rect },
              baisse:       { nom: "la perte de PV de Milobellus",    rect: ZONES_HISTORIQUE.baisse.rect },
              objet:        { nom: "l'objet qui s'active",            rect: ZONES_HISTORIQUE.objet.rect },
              recuperation: { nom: "les PV regagnés",                 rect: ZONES_HISTORIQUE.recuperation.rect },
              distorsion:   { nom: "la capacité avec une priorité",     rect: ZONES_HISTORIQUE.distorsion.rect }
            },
            cibles: ["objet", "distorsion", "baisse"],
            commentaire: "L'historique (bouton +) liste chaque événement du tour dans l'ordre où il s'est produit."
          },
          {
            type: "situation",
            enonce: "C'est à Farigiraf d'attaquer. Pour faire le plus de dégâts possible à la cible, quelle capacité choisis-tu ?",
            image: "images/combat-choix-attaque.webp", alt: "Choix de la capacité de Farigiraf",
            options: [
              { texte: "Psyko", bon: false, commentaire: "Le jeu indique « Efficace » : c'est correct, mais il y a mieux." },
              { texte: "Tonnerre", bon: true, commentaire: "Oui : le jeu indique « Super efficace ». Les dégâts sont doublés." },
              { texte: "Coup d'Main", bon: false, commentaire: "Coup d'Main ne fait pas de dégâts : elle renforce la capacité de ton partenaire." }
            ]
          },
          {
            type: "situation",
            enonce: "Dans l'historique du tour 1, Farigiraf (Vitesse 72) agit après Sarmuraï (Vitesse 60). Pourquoi ?",
            options: [
              { texte: "Parce que Farigiraf est plus lent que Sarmuraï.", bon: false,
                commentaire: "Non : avec 72 de Vitesse, Farigiraf est plus rapide que Sarmuraï (60)." },
              { texte: "Parce que Distorsion a une priorité de −7.", bon: true,
                commentaire: "Exactement : la priorité passe avant la Vitesse. Avec −7, Distorsion agit après toutes les autres actions du tour." },
              { texte: "C'est le hasard.", bon: false,
                commentaire: "Non : le hasard ne décide qu'en cas d'égalité parfaite de Vitesse, à priorité égale." }
            ]
          },
          {
            type: "ordre",
            enonce: "Remets les étapes d'un tour de combat dans l'ordre.",
            elements: [
              "Choix des actions des deux joueurs",
              "Changements de Pokémon",
              "Capacités prioritaires",
              "Autres capacités, du plus rapide au plus lent",
              "Effets de fin de tour",
              "Remplacement des Pokémon K.O."
            ],
            commentaire: "On choisit d'abord, puis les changements passent avant tout. Viennent ensuite les capacités (priorité puis Vitesse), les effets de fin de tour, et enfin le remplacement des Pokémon K.O."
          }
        ],
        quiz: [
          { type: "choix", question: "Ton Pokémon lent utilise Vive-Attaque (priorité +1). Le Pokémon adverse, plus rapide, utilise Séisme. Qui agit en premier ?",
            options: ["Ton Pokémon", "Le Pokémon adverse", "C'est le hasard"], reponse: 0,
            explication: "La priorité passe avant la Vitesse : Vive-Attaque agit avant une capacité sans priorité." },
          { type: "choix", question: "Tu changes de Pokémon et l'adversaire attaque. Que se passe-t-il en premier ?",
            options: ["Ton changement", "Son capacité", "Le plus rapide agit d'abord"], reponse: 0,
            explication: "Les changements de Pokémon sont effectués avant les capacités." },
          { type: "vf", question: "Tu vois l'action choisie par l'adversaire avant de choisir la tienne.", reponse: false,
            explication: "Les choix sont simultanés : personne ne voit le choix de l'autre." },
          { type: "choix", question: "Deux Pokémon ont exactement la même Vitesse et utilisent une capacité sans priorité. Qui agit en premier ?",
            options: ["Celui qui a le plus de PV", "Celui du joueur qui a choisi en premier", "C'est le hasard"], reponse: 2,
            explication: "En cas d'égalité parfaite de Vitesse, l'ordre est tiré au hasard." },
          { type: "vf", question: "Une capacité peut avoir une priorité négative et passer après toutes les autres.", reponse: true,
            explication: "Oui, comme Distorsion (priorité −7) : elle agit après toutes les autres actions du tour." },
          { type: "choix", question: "Sur cet écran, quels Pokémon vont commencer le combat ?",
            image: "images/combat-ordre-depart.webp", alt: "Les 4 Pokémon choisis, numérotés",
            options: ["Ceux qui portent les numéros 1 et 2", "Ceux qui portent les numéros 3 et 4", "Les 2 premiers de la liste"], reponse: 0,
            explication: "Les numéros 1 et 2 commencent sur le terrain (ici Farigiraf et Sarmuraï), même s'ils ne sont pas en haut de la liste." }
        ]
      },

      // ---------------- Leçon 4 ----------------
      {
        id: "victoire",
        titre: "Comment gagner",
        texte: `
<h2>Gagner une partie</h2>
<p>La règle de base est simple : tu gagnes quand <strong>tous les Pokémon adverses engagés dans le combat sont K.O.</strong></p>
<table>
<tr><th>Format</th><th>Pokémon adverses à mettre K.O.</th></tr>
<tr><td>VGC</td><td>4</td></tr>
<tr><td>3v3</td><td>3</td></tr>
<tr><td>6v6 OU</td><td>6</td></tr>
</table>
<h2>Les autres façons de gagner (ou de perdre)</h2>
<ul>
<li><strong>L'abandon :</strong> un joueur peut déclarer forfait, et son adversaire gagne.</li>
<li><strong>Le temps :</strong> les combats ont un chronomètre. Si tu n'agis pas à temps, tu peux perdre la partie. Le détail dépend du format et du règlement en vigueur.</li>
</ul>
<h2>Ta condition de victoire</h2>
<p>Les joueurs parlent souvent de <strong>condition de victoire</strong> (ou <em>wincon</em>) : le Pokémon ou le plan qui peut finir le combat. Tout au long des formats, tu apprendras à repérer la tienne et celle de l'adversaire.</p>
<div class="astuce"><b>Astuce :</b> dès l'aperçu des équipes, pose-toi la question : « Quel Pokémon peut me faire gagner ce combat ? Et lequel peut faire gagner l'adversaire ? »</div>`,
        exercices: [
          {
            type: "libre",
            enonce: "Avec tes propres mots, explique les trois façons dont une partie peut se terminer.",
            corrige: "Le plus souvent, un joueur met <strong>K.O. tous les Pokémon</strong> que l'adversaire a engagés (4 en VGC, 3 en 3v3, 6 en 6v6 OU). Une partie peut aussi se terminer par un <strong>abandon</strong>, ou parce qu'un joueur a dépassé le <strong>temps</strong>."
          }
        ],
        quiz: [
          { type: "choix", question: "En 3v3, combien de Pokémon adverses dois-tu mettre K.O. pour gagner la partie ?",
            options: ["3", "4", "6"], reponse: 0,
            explication: "En 3v3, chaque joueur joue 3 Pokémon : il faut mettre les 3 K.O." },
          { type: "vf", question: "Un joueur peut gagner une partie parce que son adversaire abandonne.", reponse: true,
            explication: "L'abandon donne la victoire à l'adversaire." },
          { type: "choix", question: "Qu'est-ce qu'une condition de victoire (wincon) ?",
            options: ["Le Pokémon ou le plan qui peut finir le combat", "Le nombre de K.O. nécessaires", "La règle de temps"], reponse: 0,
            explication: "La condition de victoire, c'est ce qui peut te faire gagner : un Pokémon ou un plan de jeu." }
        ]
      }
    ],

    // Banque de questions de l'examen (le site en tire config.questionsParExamen au hasard)
    examen: [
      { type: "choix", question: "Quel élément d'un Pokémon est un effet passif, actif en permanence ?",
        options: ["Le talent", "La nature", "L'objet", "Le niveau"], reponse: 0,
        explication: "Le talent est un effet passif permanent." },
      { type: "nombre", question: "Combien de statistiques a un Pokémon ?", reponse: 6,
        explication: "PV, Attaque, Défense, Attaque Spéciale, Défense Spéciale et Vitesse." },
      { type: "vf", question: "La nature augmente une statistique de 10 % et en baisse une autre de 10 %.", reponse: true,
        explication: "C'est exactement le rôle de la nature." },
      { type: "choix", question: "Que désigne le movepool d'un Pokémon ?",
        options: ["Toutes les capacités qu'il peut apprendre", "Les 4 capacités choisies pour le combat", "Ses capacités prioritaires"], reponse: 0,
        explication: "Le movepool, c'est la liste complète des capacités qu'il peut apprendre. Les 4 choisies font partie de son set." },
      { type: "nombre", question: "À quel niveau combattent les Pokémon sur Pokémon Champions ?", reponse: 50,
        explication: "Sur Champions (VGC et 3v3), les Pokémon sont au niveau 50." },
      { type: "nombre", question: "À quel niveau combattent les Pokémon en 6v6 OU sur Showdown ?", reponse: 100,
        explication: "En 6v6 OU, les Pokémon sont au niveau 100." },
      { type: "assoc", question: "Associe chaque format au nombre de Pokémon que tu joues dans un combat.",
        paires: [["VGC", "4"], ["3v3", "3"], ["6v6 OU", "6"]],
        explication: "On amène toujours 6 Pokémon, mais on en joue 4 en VGC, 3 en 3v3 et 6 en OU." },
      { type: "vf", question: "La clause espèce interdit d'avoir deux fois la même espèce dans une équipe.", reponse: true,
        explication: "Chaque espèce ne peut apparaître qu'une fois." },
      { type: "choix", question: "En VGC, deux Pokémon de ton équipe peuvent-ils tenir le même objet ?",
        options: ["Non", "Oui", "Seulement s'il s'agit de baies"], reponse: 0,
        explication: "En VGC, chaque objet ne peut être tenu que par un seul Pokémon de l'équipe." },
      { type: "multi", question: "Lesquels font partie du set d'un Pokémon ?",
        options: ["Talent", "Nature", "Objet", "Couleur", "Adversaire"], reponses: [0, 1, 2],
        explication: "Le set regroupe le talent, la nature, les capacités et l'objet." },
      { type: "choix", question: "Pourquoi éviter que plusieurs Pokémon de l'équipe partagent la même faiblesse ?",
        options: ["Un seul adversaire pourrait menacer une grande partie de l'équipe", "C'est interdit par les règles", "Ça baisse leur Vitesse"], reponse: 0,
        explication: "Une faiblesse commune permet à un seul Pokémon adverse de mettre plusieurs des tiens en danger." },
      { type: "ordre", question: "Remets ces étapes d'un tour dans l'ordre.",
        elements: ["Changements de Pokémon", "Capacités prioritaires", "Autres capacités, du plus rapide au plus lent", "Effets de fin de tour"],
        explication: "Changements, puis capacités par priorité, puis par Vitesse, puis effets de fin de tour." },
      { type: "choix", question: "Un Pokémon rapide et un Pokémon lent utilisent une capacité sans priorité. Qui agit en premier ?",
        options: ["Le rapide", "Le lent", "C'est le hasard"], reponse: 0,
        explication: "À priorité égale, le plus rapide agit en premier." },
      { type: "vf", question: "Une capacité prioritaire peut passer avant un Pokémon plus rapide.", reponse: true,
        explication: "La priorité passe avant la Vitesse." },
      { type: "choix", question: "Quand un Pokémon mis K.O. est-il remplacé ?",
        options: ["À la fin du tour", "Immédiatement, avant les autres capacités", "Au tour suivant, s'il reste du temps"], reponse: 0,
        explication: "Les Pokémon K.O. sont remplacés à la fin du tour." },
      { type: "multi", question: "Que peut-il se passer en fin de tour ?",
        options: ["Dégâts de brûlure ou de poison", "Soin des Restes", "Effets de la météo", "Choix des actions"], reponses: [0, 1, 2],
        explication: "Les effets qui durent s'appliquent en fin de tour. Le choix des actions se fait au début du tour." },
      { type: "nombre", question: "En VGC, combien de Pokémon adverses faut-il mettre K.O. pour gagner une partie ?", reponse: 4,
        explication: "En VGC, chaque joueur joue 4 Pokémon." },
      { type: "choix", question: "Quel est un moyen de gagner une partie sans mettre K.O. tous les Pokémon adverses ?",
        options: ["L'abandon de l'adversaire", "Avoir plus de PV restants à un moment donné", "Utiliser Abri trois fois"], reponse: 0,
        explication: "Si l'adversaire abandonne, tu gagnes la partie." },
      { type: "assoc", question: "Associe chaque rôle à sa description.",
        paires: [["Attaquant physique", "Frappe grâce à son Attaque"], ["Attaquant spécial", "Frappe grâce à son Attaque Spéciale"], ["Défensif", "Encaisse et use l'adversaire"], ["Soutien", "Aide l'équipe (soins, statuts, Vitesse)"]],
        explication: "Ce sont les quatre grands rôles d'une équipe." },

      // ----- Questions avec captures d'écran -----
      { type: "zone", question: "Clique sur la nature d'Oratoria.",
        image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria", zones: ZONES_FICHE, reponse: "nature",
        explication: "Sur Champions, la nature s'affiche sous le nom « Ajust. de stats », juste sous les statistiques." },
      { type: "zone", question: "Clique sur le talent de Tyranocif.",
        image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif", zones: ZONES_FICHE, reponse: "talent",
        explication: "Le talent (ici Sable Volant) est affiché en bas à droite, sous les capacités." },
      { type: "zone", question: "Clique sur les types de Tyranocif.",
        image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif", zones: ZONES_FICHE, reponse: "types",
        explication: "Les types (Roche et Ténèbres) sont affichés dans la barre du bas, à côté du nom." },
      { type: "choix", question: "D'après cette capture, quelle statistique la nature d'Oratoria augmente-t-elle ?",
        image: "images/oratoria-equipe-stats.webp", alt: "Statistiques d'Oratoria",
        options: ["L'Atq. Spé.", "L'Attaque", "La Vitesse", "Les PV"], reponse: 0,
        explication: "La flèche rouge vers le haut est à côté de l'Atq. Spé. : c'est la stat augmentée par la nature Modeste." },
      { type: "choix", question: "Sur la fiche de Tyranocif, quelle est sa nature ?",
        image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif",
        options: ["Rigide", "Modeste", "Sable Volant", "Roche"], reponse: 0,
        explication: "La nature apparaît sur la ligne « Ajust. de stats » : Rigide. Sable Volant est son talent, Roche un de ses types." },
      { type: "choix", question: "Dans cette équipe, quel objet tient Félinferno ?",
        image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
        options: ["Casque Brut", "Restes", "Baie Sitrus", "Tyranocivite"], reponse: 0,
        explication: "L'objet est affiché sous le talent, avec son icône : Félinferno tient un Casque Brut." },
      { type: "vf", question: "Cette équipe respecte la règle des objets du VGC.",
        image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités", reponse: true,
        explication: "Les 6 Pokémon tiennent 6 objets différents : la règle est respectée." },
      { type: "choix", question: "D'après ses statistiques, quel Pokémon de cette équipe est un attaquant physique ?",
        image: "images/equipe-stats.webp", alt: "L'équipe, onglet Stats",
        options: ["Tyranocif", "Oratoria", "Théffroyable", "Farigiraf"], reponse: 0,
        explication: "Tyranocif a 204 en Attaque et sa nature l'augmente : c'est l'attaquant physique." },
      { type: "nombre", question: "Sur cet écran de sélection d'un combat VGC, combien de Pokémon dois-tu choisir ?",
        image: "images/combat-selection.webp", alt: "Écran de sélection des Pokémon",
        reponse: 4, explication: "En VGC, tu choisis 4 Pokémon parmi tes 6 (le jeu affiche « 4/4 » quand c'est fait)." },
      { type: "choix", question: "Sur cet écran, quels Pokémon vont commencer le combat ?",
        image: "images/combat-ordre-depart.webp", alt: "Les 4 Pokémon choisis, numérotés",
        options: ["Farigiraf et Sarmuraï", "Oratoria et Félinferno", "Sarmuraï et Oratoria", "Les 4 en même temps"], reponse: 0,
        explication: "Les numéros 1 (Farigiraf) et 2 (Sarmuraï) commencent sur le terrain. Les numéros 3 et 4 restent en réserve." },
      { type: "choix", question: "Pendant la sélection, que signifie une flèche orange vers le bas à côté d'un adversaire ?",
        image: "images/combat-selection-avantages.webp", alt: "Flèches d'avantage pendant la sélection",
        options: ["Ton Pokémon sélectionné est désavantagé face à lui", "Cet adversaire est K.O.", "Cet adversaire est plus lent"], reponse: 0,
        explication: "Flèche vers le haut : ton Pokémon est avantagé. Flèche vers le bas : il est désavantagé." },
      { type: "choix", question: "Sur cet écran, à quoi sert le bouton « Pokémon » ?",
        image: "images/combat-choix-action.webp", alt: "Choix entre Attaque et Pokémon",
        options: ["À remplacer un de tes Pokémon sur le terrain", "À voir les statistiques adverses", "À abandonner le combat"], reponse: 0,
        explication: "Pour chaque Pokémon sur le terrain, tu choisis d'attaquer ou de le remplacer par un Pokémon de réserve." },
      { type: "choix", question: "Quelle capacité de Farigiraf est super efficace contre la cible ?",
        image: "images/combat-choix-attaque.webp", alt: "Choix de la capacité de Farigiraf",
        options: ["Tonnerre", "Psyko", "Coup d'Main", "Distorsion"], reponse: 0,
        explication: "Le jeu indique « Super efficace » sous Tonnerre, et « Efficace » sous Psyko." },
      { type: "choix", question: "Que signifie le message « Communication en cours… » ?",
        image: "images/combat-attente.webp", alt: "Message Communication en cours",
        options: ["Tu attends le choix de l'adversaire", "Le combat est terminé", "Ton capacité a échoué"], reponse: 0,
        explication: "Tes choix sont validés : le jeu attend ceux de l'adversaire avant de jouer le tour." },
      { type: "zone", question: "Dans cet historique, clique sur la ligne qui montre qu'un objet s'est activé.",
        image: "images/combat-historique-tour.webp", alt: "Historique du tour 1", zones: ZONES_HISTORIQUE, reponse: "objet",
        explication: "La ligne « Objet tenu » montre que la Baie Sitrus de Milobellus s'est activée." },
      { type: "choix", question: "Dans cet historique, pourquoi Distorsion passe-t-elle après la capacité de Sarmuraï ?",
        image: "images/combat-historique-tour.webp", alt: "Historique du tour 1",
        options: ["Sa priorité est de −7", "Farigiraf est plus lent que Sarmuraï", "C'est le hasard"], reponse: 0,
        explication: "La priorité passe avant la Vitesse : avec −7, Distorsion agit après toutes les autres actions." },
      { type: "multi", question: "Que nous apprend cet écran ?",
        image: "images/combat-effets-terrain.webp", alt: "Effets sur le Pokémon et le terrain",
        options: ["Distorsion est active sur le terrain", "La Vitesse de Farigiraf a été baissée", "L'Attaque de Farigiraf a été augmentée", "Farigiraf est K.O."], reponses: [0, 1],
        explication: "Distorsion apparaît dans les effets du terrain, et la Vitesse de Farigiraf est à ×0,67. Ses autres stats sont à ×1,0." },
      { type: "choix", question: "Que se passe-t-il sur cet écran ?",
        image: "images/combat-baie-sitrus.webp", alt: "La Baie Sitrus de Farigiraf s'active",
        options: ["La Baie Sitrus de Farigiraf s'active et lui rend des PV", "Farigiraf change d'objet", "Farigiraf utilise une capacité"], reponse: 0,
        explication: "L'objet agit tout seul : ses PV sont passés sous la moitié, la Baie Sitrus s'active." },
      { type: "vf", question: "En combat, il faut choisir une action pour utiliser l'objet tenu, comme une capacité.",
        image: "images/combat-baie-sitrus.webp", alt: "La Baie Sitrus de Farigiraf s'active", reponse: false,
        explication: "L'objet tenu agit automatiquement, quand ses conditions sont remplies." },
      { type: "choix", question: "Pourquoi le bouton « Méga-Évolution » apparaît-il pour Tyranocif ?",
        image: "images/combat-mega-evolution.webp", alt: "Choix de la capacité de Tyranocif avec le bouton Méga-Évolution",
        options: ["Parce qu'il tient sa Méga-Gemme (Tyranocivite)", "Parce que la tempête de sable est active", "Parce que c'est le 4e tour"], reponse: 0,
        explication: "Il faut tenir la Méga-Gemme de son espèce : ici, la Tyranocivite." },
      { type: "zone", question: "Clique sur le bouton qui permet de méga-évoluer.",
        image: "images/combat-mega-evolution.webp", alt: "Choix de la capacité de Tyranocif",
        zones: { mega: { nom: "le bouton Méga-Évolution", rect: [52, 74, 70, 97] }, capacites: { nom: "les capacités", rect: [70, 48, 99, 97] } }, reponse: "mega",
        explication: "Le bouton Méga-Évolution se trouve à gauche des capacités, avec la touche R." }
    ]
  },

  // ===========================================================
  //  COURS 2 à 6   (squelettes à rédiger)
  // ===========================================================
  {
    id: "types", titre: "Les types",
    objectifs: [
      "Reconnaître les 18 types et leurs logos",
      "Lire la table des types",
      "Calculer les faiblesses et résistances d'un Pokémon à deux types",
      "Connaître les immunités qui ne concernent pas les dégâts"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "table",
        titre: "Les 18 types et la table",
        texte: `
<p>Il existe <strong>18 types</strong>. Chaque Pokémon en a un ou deux, et chaque capacité en a un. Voici leurs logos, tels qu'on les voit dans les jeux :</p>
${grilleTypes()}
<h2>Le principe</h2>
<p>Quand une capacité touche un Pokémon, on compare <strong>le type de la capacité</strong> au <strong>type du Pokémon qui la reçoit</strong>. Du point de vue du Pokémon qui reçoit la capacité, il y a quatre cas :</p>
<table>
<tr><th>Le Pokémon qui reçoit…</th><th>Dégâts</th><th>Exemple</th></tr>
<tr><td><strong>est faible</strong></td><td>×2</td><td>${type("feu")} est faible face à ${type("eau")}</td></tr>
<tr><td><strong>est neutre</strong></td><td>×1</td><td>${type("normal")} est neutre face à ${type("eau")}</td></tr>
<tr><td><strong>est résistant</strong></td><td>×0,5</td><td>${type("eau")} est résistant face au ${type("feu")}</td></tr>
<tr><td><strong>est immunisé</strong></td><td>×0</td><td>${type("sol")} est immunisé contre l'${type("electrik")}</td></tr>
</table>
<p>Côté capacité, le jeu parle de capacité « super efficace » quand le Pokémon qui la reçoit est faible, et « pas très efficace » quand il est résistant.</p>
<div class="piege"><b>Piège à éviter :</b> la relation ne marche pas forcément dans les deux sens. ${type("sol")} est immunisé contre l'${type("electrik")}, mais ${type("electrik")} est faible face au ${type("sol")}. Demande-toi toujours : « qui capacité, et qui reçoit ? »</div>
<h2>La table des types</h2>
<p>Elle se lit <strong>ligne par ligne</strong> : choisis le type de la capacité à gauche, puis le type du Pokémon qui reçoit en haut. La case indique le multiplicateur. Une case vide signifie que le Pokémon est neutre (×1). Survole une case pour voir la phrase correspondante.</p>
${tableauTypes()}
<h2>Les faiblesses et résistances d'un Pokémon</h2>
<p>Pour lire la table dans l'autre sens (« face à quoi ce Pokémon est-il faible ? »), utilise le sélecteur : choisis un ou deux types, il donne directement ses faiblesses, résistances et immunités.</p>
${calculateurTypes(["feu"])}
<h2>Comment le retenir</h2>
<p>Inutile de tout apprendre d'un coup. Commence par les relations qui ont une logique :</p>
<ul>
<li><strong>Le trio de départ :</strong> ${type("plante")} est faible face au ${type("feu")}, ${type("eau")} est faible face à la ${type("plante")}, ${type("feu")} est faible face à l'${type("eau")}.</li>
<li><strong>Les éléments :</strong> ${type("eau")} et ${type("vol")} sont faibles face à l'${type("electrik")}, mais ${type("sol")} est immunisé contre lui. ${type("dragon")}, ${type("vol")}, ${type("plante")} et ${type("sol")} sont faibles face à la ${type("glace")}.</li>
<li><strong>Les immunités :</strong> il n'y en a que 8, on les retient vite.
<ul>
<li>${type("spectre")} est immunisé contre ${type("normal")} et ${type("combat")} ;</li>
<li>${type("normal")} est immunisé contre ${type("spectre")} ;</li>
<li>${type("sol")} est immunisé contre ${type("electrik")} ;</li>
<li>${type("vol")} est immunisé contre ${type("sol")} ;</li>
<li>${type("tenebres")} est immunisé contre ${type("psy")} ;</li>
<li>${type("fee")} est immunisé contre ${type("dragon")} ;</li>
<li>${type("acier")} est immunisé contre ${type("poison")}.</li>
</ul></li>
</ul>
<div class="astuce"><b>Astuce :</b> un type peut être fort en attaque mais fragile en défense. Quatre types sont faibles face à la ${type("glace")}, mais ${type("glace")} n'est résistant qu'à lui-même. À l'inverse, ${type("acier")} est résistant face à 10 types et immunisé contre le Poison.</div>
<div class="format"><b>Sur Pokémon Champions :</b> en choisissant une capacité, le jeu t'indique directement son efficacité sur la cible (« Super efficace »…). Mais en compétition, il faut le savoir à l'avance pour anticiper les capacités de l'adversaire.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque logo à son type.",
            paires: [
              [{ img: "images/types/spectre.webp", alt: "Logo violet foncé" }, "Spectre"],
              [{ img: "images/types/tenebres.webp", alt: "Logo gris foncé" }, "Ténèbres"],
              [{ img: "images/types/acier.webp", alt: "Logo bleu-gris" }, "Acier"],
              [{ img: "images/types/fee.webp", alt: "Logo rose" }, "Fée"],
              [{ img: "images/types/psy.webp", alt: "Logo rose foncé" }, "Psy"],
              [{ img: "images/types/dragon.webp", alt: "Logo bleu foncé" }, "Dragon"]
            ],
            commentaire: "Ces six logos sont ceux qu'on confond le plus souvent. Petit repère : le fantôme pour Spectre, l'œil pour Ténèbres, la tête de dragon pour Dragon, le nœud pour Fée."
          },
          {
            type: "situation",
            enonce: "Le Pokémon adverse est de type Eau. Quelle capacité choisis-tu pour lui faire le plus de dégâts ?",
            options: [
              { texte: "Une capacité Plante", bon: true, commentaire: "Oui : Plante est super efficace (×2) contre Eau." },
              { texte: "Une capacité Feu", bon: false, commentaire: "Non : Feu est pas très efficace (×0,5) contre Eau. L'eau éteint le feu." },
              { texte: "Une capacité Sol", bon: false, commentaire: "Sol est neutre (×1) contre Eau : ce n'est pas le meilleur choix." }
            ]
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien de types existe-t-il ?", reponse: 18,
            explication: "Il existe 18 types." },
          { type: "choix", question: "Par combien sont multipliés les dégâts d'une capacité super efficace ?",
            options: ["×1,5", "×2", "×3", "×4"], reponse: 1,
            explication: "Une capacité super efficace fait ×2. Le ×4 n'arrive que sur un Pokémon à deux types, comme tu le verras dans la leçon suivante." },
          { type: "vf", question: "Une capacité Électrik n'a aucun effet sur un Pokémon Sol.", reponse: true,
            explication: "Le type Sol est immunisé contre les capacités Électrik (×0)." },
          { type: "choix", question: "Contre quel type les capacités Feu sont-elles super efficaces ?",
            options: ["Plante", "Eau", "Roche", "Dragon"], reponse: 0,
            explication: "Feu est super efficace contre Plante, Glace, Insecte et Acier. Il est pas très efficace contre Eau, Roche, Dragon et Feu." },
          { type: "choix", question: "Quel type représente ce logo ?",
            image: "images/types/spectre.webp", alt: "Un logo de type", imagePetite: true,
            options: ["Spectre", "Psy", "Ténèbres", "Poison"], reponse: 0,
            explication: "Le petit fantôme sur fond violet, c'est le type Spectre." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "doubles",
        titre: "Les doubles types",
        texte: `
<p>Beaucoup de Pokémon ont <strong>deux types</strong>. Dans ce cas, on calcule l'efficacité contre chacun des deux types, puis on <strong>multiplie</strong> les deux résultats.</p>
<h2>On multiplie</h2>
<table>
<tr><th>Contre le 1<sup>er</sup> type</th><th>Contre le 2<sup>e</sup> type</th><th>Résultat</th></tr>
<tr><td>×2</td><td>×2</td><td><strong>×4</strong> (très faible)</td></tr>
<tr><td>×2</td><td>×1</td><td>×2</td></tr>
<tr><td>×2</td><td>×0,5</td><td>×1 (neutre : ça s'annule)</td></tr>
<tr><td>×0,5</td><td>×0,5</td><td><strong>×0,25</strong> (très résistant)</td></tr>
<tr><td>n'importe quoi</td><td>×0</td><td><strong>×0</strong> (immunisé)</td></tr>
</table>
<p>Exemple : un Pokémon ${type("dragon")} ${type("vol")} reçoit une capacité ${type("glace")}. Glace contre Dragon : ×2. Glace contre Vol : ×2. Résultat : <strong>×4</strong>.</p>
<h2>L'immunité l'emporte toujours</h2>
<p>Farigiraf est ${type("normal")} ${type("psy")}. Une capacité ${type("spectre")} serait super efficace contre Psy (×2)… mais Normal est immunisé contre Spectre (×0). Résultat : 2 × 0 = <strong>×0</strong>. Farigiraf ne craint pas du tout les capacités Spectre.</p>
<h2>Lire les faiblesses d'un Pokémon</h2>
<p>Prenons deux Pokémon de l'équipe du cours 1 :</p>
<ul>
<li><strong>Tyranocif</strong> ${type("roche")} ${type("tenebres")} est très faible (×4) face au ${type("combat")}, faible (×2) face à ${type("eau")} ${type("plante")} ${type("sol")} ${type("insecte")} ${type("acier")} ${type("fee")}, et immunisé contre ${type("psy")}.</li>
<li><strong>Oratoria</strong> ${type("eau")} ${type("fee")} est faible (×2) face à ${type("plante")} ${type("electrik")} ${type("poison")}, et immunisée contre ${type("dragon")}.</li>
</ul>
<h2>D'autres Pokémon à analyser</h2>
<p>Quatre autres Pokémon, avec à chaque fois un piège à repérer :</p>
${diaporama({ etapes: [
  { src: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse", titre: "Métalosse (Acier / Psy)",
    texte: `Faible face à ${type("feu")} ${type("sol")} ${type("spectre")} ${type("tenebres")}. Très résistant face au ${type("psy")} (×0,25) et immunisé contre le ${type("poison")}. <strong>Piège :</strong> le type Acier est faible face au Combat, mais le type Psy y est résistant. Métalosse est donc neutre face au ${type("combat")}.` },
  { src: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence", titre: "Sorcilence (Psy / Fée)",
    texte: `Faible face à ${type("poison")} ${type("spectre")} ${type("acier")}. Très résistante face au ${type("combat")} (×0,25) et immunisée contre le ${type("dragon")}. <strong>Piège :</strong> le type Psy est faible face aux Ténèbres et à l'Insecte, mais le type Fée y est résistant. Sorcilence est neutre face aux ${type("tenebres")} et à l'${type("insecte")}.` },
  { src: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur", titre: "Scalpereur (Ténèbres / Acier)",
    texte: `Très faible face au ${type("combat")} (×4), faible face au ${type("feu")} et au ${type("sol")}. Résistant face à 9 types, immunisé contre le ${type("psy")} et le ${type("poison")}. <strong>Piège :</strong> le type Ténèbres est faible face à la Fée, mais le type Acier y est résistant. Scalpereur est neutre face à la ${type("fee")}.` },
  { src: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech", titre: "Kravarech (Poison / Dragon)",
    texte: `Faible face à ${type("glace")} ${type("sol")} ${type("psy")} ${type("dragon")}. Très résistant face à la ${type("plante")} (×0,25). <strong>Piège :</strong> le type Dragon est faible face à la Fée, mais le type Poison y est résistant. Kravarech est neutre face à la ${type("fee")}.` }
] })}
<p>Pas besoin de tout calculer de tête : le <a href="#lecon-types-table">sélecteur de la leçon 1</a> fait ce calcul pour toi. Choisis deux types (par exemple Roche et Ténèbres pour Tyranocif) et il applique la multiplication automatiquement.</p>
<div class="astuce"><b>Astuce :</b> retiens surtout les <strong>faiblesses ×4</strong> de tes Pokémon et de ceux du méta. Une capacité ×4 met presque toujours K.O. en un coup, même un Pokémon très résistant.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque situation au bon multiplicateur.",
            paires: [
              ["Glace contre Dragon / Vol", "×4"],
              ["Plante contre Dragon / Vol", "×0,25"],
              ["Spectre contre Normal / Psy", "×0"],
              ["Combat contre Normal / Psy", "×1"]
            ],
            commentaire: "Glace : ×2 × ×2. Plante : ×0,5 × ×0,5. Spectre : ×2 × ×0, l'immunité gagne. Combat : ×2 contre Normal, ×0,5 contre Psy, ça s'annule."
          },
          {
            type: "situation",
            enonce: "Sorcilence (Psy / Fée) fait face à un Pokémon qui utilise une capacité Ténèbres. Que risque-t-elle ?",
            image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
            options: [
              { texte: "Des dégâts doublés (×2), car le type Psy est faible face aux Ténèbres.", bon: false,
                commentaire: "C'est le piège : il faut aussi regarder le type Fée, qui est résistant face aux Ténèbres (×0,5)." },
              { texte: "Des dégâts normaux (×1).", bon: true,
                commentaire: "Oui : ×2 (Psy) × ×0,5 (Fée) = ×1. Sorcilence est neutre face aux Ténèbres." },
              { texte: "Rien, elle est immunisée.", bon: false,
                commentaire: "Non : c'est contre le Dragon que le type Fée est immunisé, pas contre les Ténèbres." }
            ]
          },
          {
            type: "situation",
            enonce: "Ton Tyranocif (Roche / Ténèbres) fait face à un Pokémon qui connaît une capacité Combat. Que risque-t-il ?",
            image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif",
            options: [
              { texte: "Des dégâts doublés (×2).", bon: false, commentaire: "Pas tout à fait : Combat est super efficace contre ses deux types." },
              { texte: "Des dégâts quadruplés (×4).", bon: true, commentaire: "Oui : Combat contre Roche ×2, Combat contre Ténèbres ×2, donc ×4. C'est la grosse faiblesse de Tyranocif." },
              { texte: "Rien, il résiste au Combat.", bon: false, commentaire: "Non, c'est même sa pire faiblesse." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Une capacité Glace touche un Pokémon Dragon / Vol. Quel est le multiplicateur ?",
            options: ["×4", "×2", "×1", "×0,5"], reponse: 0,
            explication: "Glace est super efficace contre Dragon (×2) et contre Vol (×2) : 2 × 2 = ×4." },
          { type: "choix", question: "Une capacité est super efficace contre le 1er type d'un Pokémon et pas très efficace contre le 2e. Quel est le résultat ?",
            options: ["×1", "×2", "×0,5", "×4"], reponse: 0,
            explication: "×2 × ×0,5 = ×1 : les deux effets s'annulent." },
          { type: "vf", question: "Si l'un des deux types d'un Pokémon est immunisé, la capacité n'a aucun effet.", reponse: true,
            explication: "Tout multiplié par ×0 donne ×0 : l'immunité l'emporte toujours." },
          { type: "choix", question: "Quelle est la faiblesse ×4 de Tyranocif (Roche / Ténèbres) ?",
            options: ["Combat", "Eau", "Fée", "Sol"], reponse: 0,
            explication: "Combat est super efficace contre Roche et contre Ténèbres : ×4. Eau, Fée et Sol ne font que ×2." },
          { type: "choix", question: "Une capacité Plante touche un Pokémon Dragon / Vol. Quel est le multiplicateur ?",
            options: ["×0,25", "×0,5", "×1", "×2"], reponse: 0,
            explication: "Plante est pas très efficace contre Dragon (×0,5) et contre Vol (×0,5) : ×0,25." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "immunites",
        titre: "Les immunités hors dégâts",
        texte: `
<p>Les types ne servent pas qu'à calculer les dégâts. Ils protègent aussi contre certains <strong>statuts</strong>, la <strong>météo</strong> et les <strong>pièges</strong> posés sur le terrain.</p>
<h2>Les statuts</h2>
<table>
<tr><th>Effet</th><th>Types protégés</th></tr>
<tr><td>Brûlure</td><td>${type("feu")}</td></tr>
<tr><td>Paralysie</td><td>${type("electrik")}</td></tr>
<tr><td>Poison et poison grave</td><td>${type("poison")} ${type("acier")}</td></tr>
<tr><td>Gel</td><td>${type("glace")}</td></tr>
<tr><td>Capacités « poudre » (Poudre Dodo, Spore, Poudre Fureur…) et Vampigraine</td><td>${type("plante")}</td></tr>
</table>
<p>Exemple : Théffroyable, dans l'équipe du cours 1, utilise Poudre Fureur pour attirer les capacités adverses sur lui. Un Pokémon ${type("plante")} adverse, lui, n'est pas attiré : il peut toujours viser qui il veut.</p>
<div class="astuce"><b>Astuce :</b> les immunités de type aux capacités fonctionnent aussi pour les capacités de statut. Cage-Éclair, une capacité ${type("electrik")} qui paralyse, n'a aucun effet sur un Pokémon ${type("sol")}.</div>
<h2>Une immunité à un talent : Ténèbres contre Farceur</h2>
<p>Le talent <strong>Farceur</strong> rend prioritaires les capacités de statut d'un Pokémon (Cage-Éclair, Provoc, Vent Arrière…). Mais le type ${type("tenebres")} est immunisé contre ces capacités : si une capacité de statut rendue prioritaire par Farceur vise un Pokémon Ténèbres, elle échoue.</p>
<div class="piege"><b>Piège à éviter :</b> seules les capacités qui <strong>visent</strong> le Pokémon Ténèbres échouent. Un Vent Arrière lancé grâce à Farceur, qui ne vise que son propre camp, fonctionne normalement. Et sans Farceur, le Pokémon Ténèbres peut être touché par ces capacités comme les autres.</div>
<h2>La météo</h2>
<p>La <strong>tempête de sable</strong> inflige des dégâts à chaque fin de tour, sauf aux Pokémon ${type("roche")} ${type("sol")} et ${type("acier")}. C'est justement ce que déclenche le talent Sable Volant de Tyranocif : lui, étant Roche, ne subit rien.</p>
<h2>Les pièges</h2>
<p>Certaines capacités posent des pièges dans le camp adverse. Ils blessent ou gênent chaque Pokémon qui entre sur le terrain :</p>
<ul>
<li><strong>Picots, Pics Toxik et Toile Gluante</strong> n'affectent que les Pokémon qui touchent le sol. Les Pokémon ${type("vol")} (et ceux qui ont le talent Lévitation) les ignorent.</li>
<li><strong>Pics Toxik</strong> empoisonnent, donc ne font rien aux ${type("poison")} et ${type("acier")}. Mieux : un Pokémon ${type("poison")} qui touche le sol les fait disparaître en entrant.</li>
<li><strong>Piège de Roc</strong> touche tout le monde, mais ses dégâts dépendent de l'efficacité du type ${type("roche")} sur le Pokémon : de 3 % des PV (résistance ×0,25) à 50 % (faiblesse ×4).</li>
</ul>
${capture({
  src: "images/kravarech-fiche.webp",
  alt: "Fiche de Kravarech",
  petite: true,
  reperes: [
    { x: 67.4, y: 52.6, texte: "Kravarech connaît <strong>Pics Toxik</strong> : il peut poser ce piège chez l'adversaire." },
    { x: 55.6, y: 87.5, texte: "Il est de type <strong>Poison</strong> et touche le sol : s'il entre sur des Pics Toxik adverses, il les fait disparaître." }
  ],
  legende: "Kravarech, à la fois poseur et « nettoyeur » de Pics Toxik."
})}
<p>Les Pokémon ${type("acier")}, comme Métalosse ou Scalpereur, ne craignent pas non plus les Pics Toxik : ils ne peuvent pas être empoisonnés. Ils ne les retirent pas pour autant.</p>
<div class="format"><b>Ça dépend du format :</b> les pièges sont au cœur du 6v6 OU, où les Pokémon changent souvent de place. En VGC, ils sont beaucoup plus rares.</div>
<h2>Les talents qui donnent une immunité</h2>
<p>Certains talents ajoutent une immunité que le type n'a pas : Lévitation (contre ${type("sol")}), Absorb Eau (contre ${type("eau")}), Torche (contre ${type("feu")}), Herbivore (contre ${type("plante")})… Tu les verras en détail dans le cours « Les talents ».</p>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque effet au type qui en est protégé.",
            paires: [["Brûlure", "Feu"], ["Paralysie", "Électrik"], ["Gel", "Glace"], ["Poudre Dodo", "Plante"]],
            commentaire: "Le Feu ne brûle pas, l'Électrik ne se paralyse pas, la Glace ne gèle pas et la Plante ignore les capacités poudre."
          },
          {
            type: "situation",
            enonce: "La tempête de sable est active. Lequel de ces Pokémon de l'équipe ne subira aucun dégât à la fin du tour ?",
            image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
            options: [
              { texte: "Sarmuraï (Insecte / Eau)", bon: false, commentaire: "Non : ni Insecte ni Eau ne protègent du sable." },
              { texte: "Tyranocif (Roche / Ténèbres)", bon: true, commentaire: "Oui : le type Roche protège de la tempête de sable." },
              { texte: "Félinferno (Feu / Ténèbres)", bon: false, commentaire: "Non : seuls Roche, Sol et Acier sont protégés." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Quel type ne peut pas être brûlé ?",
            options: ["Feu", "Eau", "Glace", "Roche"], reponse: 0,
            explication: "Les Pokémon Feu sont protégés de la brûlure." },
          { type: "multi", question: "Quels types ne peuvent pas être empoisonnés ?",
            options: ["Poison", "Acier", "Fée", "Sol"], reponses: [0, 1],
            explication: "Les Pokémon Poison et Acier ne peuvent pas être empoisonnés." },
          { type: "vf", question: "Un Pokémon Vol ne subit pas les dégâts des Picots.", reponse: true,
            explication: "Les Picots n'affectent que les Pokémon qui touchent le sol." },
          { type: "choix", question: "Quels types ne subissent pas les dégâts de la tempête de sable ?",
            options: ["Roche, Sol et Acier", "Roche seulement", "Sol et Vol", "Eau et Glace"], reponse: 0,
            explication: "Roche, Sol et Acier sont protégés de la tempête de sable." },
          { type: "vf", question: "Le Piège de Roc fait les mêmes dégâts à tous les Pokémon.", reponse: false,
            explication: "Ses dégâts dépendent de l'efficacité du type Roche sur le Pokémon : de 3 % à 50 % des PV." }
        ]
      }
    ],
    examen: [
      { type: "choix", question: "Quel type représente ce logo ?", image: "images/types/tenebres.webp", alt: "Un logo de type", imagePetite: true,
        options: ["Ténèbres", "Spectre", "Poison", "Psy"], reponse: 0, explication: "L'œil sur fond gris foncé, c'est le type Ténèbres." },
      { type: "choix", question: "Quel type représente ce logo ?", image: "images/types/acier.webp", alt: "Un logo de type", imagePetite: true,
        options: ["Acier", "Glace", "Vol", "Roche"], reponse: 0, explication: "C'est le logo du type Acier." },
      { type: "choix", question: "Quel type représente ce logo ?", image: "images/types/fee.webp", alt: "Un logo de type", imagePetite: true,
        options: ["Fée", "Psy", "Insecte", "Normal"], reponse: 0, explication: "Le nœud sur fond rose, c'est le type Fée." },
      { type: "choix", question: "Quel type représente ce logo ?", image: "images/types/dragon.webp", alt: "Un logo de type", imagePetite: true,
        options: ["Dragon", "Ténèbres", "Eau", "Spectre"], reponse: 0, explication: "La tête de dragon sur fond bleu foncé, c'est le type Dragon." },
      { type: "choix", question: "Quel type représente ce logo ?", image: "images/types/insecte.webp", alt: "Un logo de type", imagePetite: true,
        options: ["Insecte", "Plante", "Sol", "Combat"], reponse: 0, explication: "C'est le logo du type Insecte." },
      { type: "choix", question: "Quel type représente ce logo ?", image: "images/types/psy.webp", alt: "Un logo de type", imagePetite: true,
        options: ["Psy", "Fée", "Feu", "Poison"], reponse: 0, explication: "C'est le logo du type Psy." },
      { type: "assoc", question: "Associe chaque logo à son type.",
        paires: [[{ img: "images/types/sol.webp", alt: "Logo marron" }, "Sol"], [{ img: "images/types/roche.webp", alt: "Logo beige" }, "Roche"], [{ img: "images/types/poison.webp", alt: "Logo violet" }, "Poison"], [{ img: "images/types/vol.webp", alt: "Logo bleu clair" }, "Vol"]],
        explication: "Sol : les couches de terre. Roche : le rocher. Poison : les bulles. Vol : l'aile." },
      { type: "nombre", question: "Combien de types existe-t-il ?", reponse: 18, explication: "Il existe 18 types." },
      { type: "choix", question: "Quel est le multiplicateur d'une capacité Eau contre un Pokémon Feu ?",
        options: ["×2", "×1", "×0,5", "×0"], reponse: 0, explication: "L'eau éteint le feu : ×2." },
      { type: "choix", question: "Quel est le multiplicateur d'une capacité Feu contre un Pokémon Eau ?",
        options: ["×0,5", "×1", "×2", "×0"], reponse: 0, explication: "Feu est pas très efficace contre Eau : ×0,5." },
      { type: "multi", question: "Contre quels types une capacité Combat est-elle sans effet ou pas très efficace ?",
        options: ["Spectre", "Psy", "Fée", "Normal", "Acier"], reponses: [0, 1, 2],
        explication: "Combat n'a aucun effet sur Spectre et est pas très efficace contre Psy, Fée, Poison, Vol et Insecte. Il est super efficace contre Normal et Acier." },
      { type: "vf", question: "Une capacité Sol n'a aucun effet sur un Pokémon Vol.", reponse: true, explication: "Le type Vol est immunisé contre les capacités Sol." },
      { type: "vf", question: "Comme l'Électrik n'a aucun effet sur le Sol, le Sol n'a aucun effet sur l'Électrik.", reponse: false,
        explication: "La table ne marche pas dans les deux sens : Sol est même super efficace (×2) contre Électrik." },
      { type: "assoc", question: "Associe chaque situation au bon multiplicateur.",
        paires: [["Glace contre Dragon / Vol", "×4"], ["Plante contre Dragon / Vol", "×0,25"], ["Spectre contre Normal / Psy", "×0"], ["Combat contre Normal / Psy", "×1"]],
        explication: "On multiplie les deux résultats. Un ×0 donne toujours ×0." },
      { type: "choix", question: "Une capacité Combat touche Tyranocif (Roche / Ténèbres). Quel est le multiplicateur ?",
        image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif",
        options: ["×4", "×2", "×1", "×0,5"], reponse: 0, explication: "Combat est super efficace contre Roche et Ténèbres : ×4." },
      { type: "choix", question: "D'après ses types (Eau / Fée), contre quel type de capacité Oratoria est-elle immunisée ?",
        image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria",
        options: ["Dragon", "Feu", "Électrik", "Combat"], reponse: 0, explication: "Le type Fée est immunisé contre Dragon." },
      { type: "multi", question: "Quelles sont les faiblesses (×2) d'Oratoria (Eau / Fée) ?",
        options: ["Plante", "Électrik", "Poison", "Feu", "Acier"], reponses: [0, 1, 2],
        explication: "Plante et Électrik (à cause d'Eau), Poison (à cause de Fée). Acier est ×2 contre Fée mais ×0,5 contre Eau : ×1." },
      { type: "choix", question: "Farigiraf est Normal / Psy. Quel est l'effet d'une capacité Spectre sur lui ?",
        options: ["×0", "×2", "×1", "×0,5"], reponse: 0, explication: "Spectre est ×2 contre Psy, mais ×0 contre Normal : l'immunité l'emporte." },
      { type: "choix", question: "Sur cet écran, Tonnerre (Électrik) est indiqué « Super efficace » contre Milobellus. Pourquoi ?",
        image: "images/combat-choix-attaque.webp", alt: "Choix de la capacité de Farigiraf",
        options: ["Milobellus est de type Eau", "Milobellus est de type Sol", "Tonnerre est une capacité prioritaire"], reponse: 0,
        explication: "Électrik est super efficace contre Eau. Contre un Pokémon Sol, Tonnerre n'aurait eu aucun effet." },
      { type: "choix", question: "Quel type ne peut pas être paralysé ?",
        options: ["Électrik", "Sol", "Acier", "Vol"], reponse: 0, explication: "Les Pokémon Électrik ne peuvent pas être paralysés." },
      { type: "choix", question: "Quel type est protégé du gel ?",
        options: ["Glace", "Eau", "Feu", "Acier"], reponse: 0, explication: "Les Pokémon Glace ne peuvent pas être gelés." },
      { type: "multi", question: "Quels types ne peuvent pas être empoisonnés ?",
        options: ["Poison", "Acier", "Plante", "Fée"], reponses: [0, 1], explication: "Poison et Acier sont protégés de l'empoisonnement." },
      { type: "vf", question: "Un Pokémon Plante n'est pas affecté par Poudre Dodo.", reponse: true,
        explication: "Les Pokémon Plante ignorent les capacités « poudre »." },
      { type: "vf", question: "Cage-Éclair peut paralyser un Pokémon Sol.", reponse: false,
        explication: "Cage-Éclair est une capacité Électrik : elle n'a aucun effet sur un Pokémon Sol." },
      { type: "choix", question: "Dans cette équipe, quel Pokémon ne subit pas les dégâts de la tempête de sable ?",
        image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
        options: ["Tyranocif", "Oratoria", "Félinferno", "Farigiraf"], reponse: 0,
        explication: "Tyranocif est de type Roche, qui protège de la tempête de sable." },
      { type: "choix", question: "Quels Pokémon ignorent les Picots ?",
        options: ["Les Pokémon Vol", "Les Pokémon Acier", "Les Pokémon Roche", "Tous les Pokémon"], reponse: 0,
        explication: "Les Picots n'affectent que les Pokémon qui touchent le sol : les Vol (et ceux qui ont Lévitation) les ignorent." },
      { type: "choix", question: "De quoi dépendent les dégâts du Piège de Roc ?",
        options: ["De l'efficacité du type Roche sur le Pokémon", "De la Vitesse du Pokémon", "Du niveau du Pokémon"], reponse: 0,
        explication: "De 3 % des PV (×0,25) à 50 % (×4) selon l'efficacité du type Roche." },
      { type: "choix", question: "Quel talent rend un Pokémon immunisé contre les capacités Sol ?",
        options: ["Lévitation", "Torche", "Absorb Eau", "Intimidation"], reponse: 0,
        explication: "Lévitation protège des capacités Sol (et des pièges au sol)." },

      // ----- Questions pièges -----
      { piege: true, type: "choix", question: "Une capacité Sol touche un Pokémon Électrik / Vol. Quel est le multiplicateur ?",
        options: ["×0", "×2", "×4", "×1"], reponse: 0,
        explication: "Piège : le type Électrik est faible face au Sol (×2), mais le type Vol est immunisé contre le Sol (×0). 2 × 0 = ×0." },
      { piege: true, type: "choix", question: "Oratoria (Eau / Fée) reçoit une capacité Acier. Quel est le multiplicateur ?",
        image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria",
        options: ["×1", "×2", "×4", "×0,5"], reponse: 0,
        explication: "Piège : le type Fée est faible face à l'Acier (×2), mais le type Eau est résistant face à l'Acier (×0,5). Les deux s'annulent : Oratoria est neutre." },
      { piege: true, type: "vf", question: "Le type Fée est immunisé contre le Dragon. Donc le type Dragon est immunisé contre la Fée.", reponse: false,
        explication: "Piège : la relation ne marche pas dans les deux sens. Le type Dragon est même faible face à la Fée (×2)." },
      { piege: true, type: "multi", question: "Face aux capacités Normal, quels types sont résistants ou immunisés ?",
        options: ["Spectre", "Roche", "Acier", "Combat", "Ténèbres"], reponses: [0, 1, 2],
        explication: "Spectre est immunisé, Roche et Acier sont résistants. Piège : Combat est neutre face au Normal, même si le Normal est faible face au Combat." },
      { piege: true, type: "choix", question: "En haut à droite de cet écran, Laggron est de type Eau / Sol. Que lui fait une capacité Électrik ?",
        image: "images/combat-mega-evolution.webp", alt: "Combat contre Pondralugon et Laggron",
        options: ["Rien du tout (×0)", "Des dégâts doublés (×2)", "Des dégâts normaux (×1)", "Des dégâts quadruplés (×4)"], reponse: 0,
        explication: "Piège : le type Eau est faible face à l'Électrik, mais le type Sol est immunisé contre lui. L'immunité l'emporte : ×0." },
      { piege: true, type: "choix", question: "Une capacité Psy touche un Pokémon Poison / Ténèbres. Quel est le multiplicateur ?",
        options: ["×0", "×2", "×1", "×4"], reponse: 0,
        explication: "Piège : le type Poison est faible face au Psy (×2), mais le type Ténèbres est immunisé contre lui (×0). Résultat : ×0." },
      { piege: true, type: "choix", question: "Laggron (Eau / Sol) reçoit une capacité Glace. Quel est le multiplicateur ?",
        options: ["×1", "×2", "×4", "×0,5"], reponse: 0,
        explication: "Piège : le type Sol est faible face à la Glace (×2), mais le type Eau est résistant (×0,5). Laggron est neutre." },
      { piege: true, type: "choix", question: "Un Pokémon Insecte / Acier reçoit une capacité Feu. Quel est le multiplicateur ?",
        options: ["×4", "×1", "×2", "×0,5"], reponse: 0,
        explication: "Piège : l'Acier résiste à beaucoup de types, mais pas au Feu. Insecte et Acier sont tous les deux faibles face au Feu : ×4." },
      { piege: true, type: "choix", question: "Un Pokémon Psy / Fée reçoit une capacité Ténèbres. Quel est le multiplicateur ?",
        options: ["×1", "×2", "×0", "×0,5"], reponse: 0,
        explication: "Piège : le type Psy est faible face aux Ténèbres (×2), mais le type Fée est résistant (×0,5). Résultat : neutre." },
      { piege: true, type: "vf", question: "Le type Spectre est immunisé contre le Combat. Donc le type Combat est immunisé contre le Spectre.", reponse: false,
        explication: "Piège : la relation ne marche pas dans les deux sens. Le type Combat est neutre face aux capacités Spectre." },
      { piege: true, type: "choix", question: "Félinferno utilise Bluff (une capacité Normal) sur Théffroyable (Plante / Spectre). Que se passe-t-il ?",
        image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
        options: ["Rien : Théffroyable est immunisé", "Théffroyable recule et ne peut pas agir", "Théffroyable perd beaucoup de PV"], reponse: 0,
        explication: "Piège : Bluff est une capacité Normal, et le type Spectre est immunisé contre le Normal. La capacité échoue complètement." },
      { piege: true, type: "choix", question: "Pondralugon (Acier / Dragon), en haut de cet écran, reçoit une capacité Feu. Quel est le multiplicateur ?",
        image: "images/combat-mega-evolution.webp", alt: "Combat contre Pondralugon et Laggron",
        options: ["×1", "×2", "×4", "×0,5"], reponse: 0,
        explication: "Piège : le type Acier est faible face au Feu (×2), mais le type Dragon est résistant (×0,5). Pondralugon est neutre." },
      { piege: true, type: "vf", question: "Le type Vol est faible face à l'Électrik, donc Cage-Éclair ne peut pas paralyser un Pokémon Vol.", reponse: false,
        explication: "Piège : être faible face à un type ne protège de rien. Seuls les Pokémon Sol (immunisés contre l'Électrik) et Électrik échappent à Cage-Éclair." },
      { piege: true, type: "choix", question: "Un Pokémon Poison / Vol entre sur un terrain couvert de Pics Toxik. Que se passe-t-il ?",
        options: ["Rien : il les ignore, mais ne les retire pas", "Il les retire du terrain", "Il est empoisonné"], reponse: 0,
        explication: "Piège : un Pokémon Poison retire les Pics Toxik seulement s'il touche le sol. Un Pokémon Vol ne touche pas le sol : il les ignore, et ils restent en place." },

      { piege: true, type: "choix", question: "Un Pokémon avec le talent Farceur utilise Cage-Éclair sur Scalpereur (Ténèbres / Acier). Que se passe-t-il ?",
        image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur",
        options: ["La capacité échoue", "Scalpereur est paralysé", "La capacité passe, mais en dernier", "Scalpereur est paralysé et perd des PV"], reponse: 0,
        explication: "Piège : rien à voir avec Électrik contre Acier. Le type Ténèbres est immunisé contre les capacités de statut rendues prioritaires par Farceur." },
      { piege: true, type: "vf", question: "Un Pokémon avec Farceur ne peut pas utiliser Vent Arrière s'il y a un Pokémon Ténèbres en face.", reponse: false,
        explication: "Piège : Vent Arrière ne vise que son propre camp. Seules les capacités de statut qui visent le Pokémon Ténèbres échouent." },

      // ----- Fiches de Métalosse, Sorcilence, Scalpereur et Kravarech -----
      { type: "zone", question: "Clique sur les types de Kravarech.",
        image: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech", zones: ZONES_FICHE, reponse: "types",
        explication: "Les types (Poison et Dragon) sont dans la barre du bas, à côté du nom." },
      { type: "choix", question: "Quelle est la faiblesse ×4 de Scalpereur ?",
        image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur",
        options: ["Combat", "Feu", "Sol", "Fée"], reponse: 0,
        explication: "Ténèbres et Acier sont tous les deux faibles face au Combat : ×4. Feu et Sol ne font que ×2." },
      { piege: true, type: "choix", question: "Scalpereur (Ténèbres / Acier) reçoit une capacité Fée. Quel est le multiplicateur ?",
        image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur",
        options: ["×1", "×2", "×0,5", "×4"], reponse: 0,
        explication: "Piège : le type Ténèbres est faible face à la Fée (×2), mais le type Acier y est résistant (×0,5). Scalpereur est neutre." },
      { piege: true, type: "choix", question: "Sorcilence (Psy / Fée) reçoit une capacité Ténèbres. Quel est le multiplicateur ?",
        image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
        options: ["×1", "×2", "×0", "×4"], reponse: 0,
        explication: "Piège : le type Psy est faible face aux Ténèbres (×2), mais le type Fée y est résistant (×0,5). Sorcilence est neutre." },
      { piege: true, type: "choix", question: "Kravarech (Poison / Dragon) reçoit une capacité Fée. Quel est le multiplicateur ?",
        image: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech",
        options: ["×1", "×2", "×4", "×0,5"], reponse: 0,
        explication: "Piège : le type Dragon est faible face à la Fée (×2), mais le type Poison y est résistant (×0,5). Kravarech est neutre." },
      { type: "choix", question: "Contre quel type de capacité Métalosse est-il immunisé ?",
        image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
        options: ["Poison", "Psy", "Combat", "Spectre"], reponse: 0,
        explication: "Le type Acier est immunisé contre le Poison. Face au Psy, Métalosse est très résistant (×0,25), mais pas immunisé." },
      { piege: true, type: "multi", question: "Face à quels types Métalosse (Acier / Psy) est-il faible ?",
        image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
        options: ["Feu", "Sol", "Combat", "Ténèbres", "Eau"], reponses: [0, 1, 3],
        explication: "Feu, Sol, Spectre et Ténèbres. Piège : le type Acier est faible face au Combat, mais le type Psy y est résistant : Métalosse est neutre face au Combat." },
      { type: "choix", question: "Sorcilence (Psy / Fée) reçoit une capacité Combat. Quel est le multiplicateur ?",
        image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
        options: ["×0,25", "×0,5", "×1", "×2"], reponse: 0,
        explication: "Psy et Fée sont tous les deux résistants face au Combat : ×0,5 × ×0,5 = ×0,25." }
    ]
  },
  {
    id: "talents", titre: "Les talents",
    objectifs: [
      "Savoir ce qu'est un talent et où le voir",
      "Reconnaître les grandes familles de talents",
      "Anticiper les talents adverses et leurs interactions"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "definition",
        titre: "Qu'est-ce qu'un talent",
        texte: `
${capture({
  src: "images/metalosse-fiche.webp",
  alt: "Fiche de Métalosse",
  reperes: [ { x: 71.6, y: 68.8, texte: "Le <strong>talent</strong> de Métalosse : Corps Sain." } ],
  legende: "Sur la fiche d'un Pokémon, le talent est affiché en bas à droite, sous les capacités."
})}
<p>Le <strong>talent</strong> est un effet passif : il agit tout seul, sans que tu aies à le choisir pendant le combat. Certains s'activent en permanence, d'autres à un moment précis (quand le Pokémon entre sur le terrain, quand il est touché…).</p>
<h2>Les règles de base</h2>
<ul>
<li>Un Pokémon a <strong>un seul talent</strong> à la fois.</li>
<li>Chaque espèce a une <strong>liste de talents possibles</strong>, en général 1 à 3. L'un d'eux est parfois un <strong>talent caché</strong>, plus rare.</li>
<li>Le talent fait partie du <strong>set</strong> : tu le choisis parmi ceux de l'espèce, comme la nature ou les capacités.</li>
<li><strong>Exception : la Méga-Évolution.</strong> Une méga-évolution a son propre talent, qui remplace celui du Pokémon dès qu'il méga-évolue. Parfois c'est le même, parfois non.</li>
</ul>
<table>
<tr><th>Pokémon</th><th>Talent avant</th><th>Talent après la Méga-Évolution</th></tr>
<tr><td>Tyranocif → Méga-Tyranocif</td><td>Sable Volant</td><td>Sable Volant (inchangé)</td></tr>
<tr><td>Métalosse → Méga-Métalosse</td><td>Corps Sain</td><td><strong>Griffe Dure</strong> (renforce ses capacités de contact)</td></tr>
<tr><td>Dracaufeu → Méga-Dracaufeu Y</td><td>Brasier</td><td><strong>Sécheresse</strong> (déclenche un soleil intense)</td></tr>
</table>
<p>Exemple : Félinferno peut avoir Brasier ou Intimidation. En compétition, on lui donne presque toujours Intimidation, beaucoup plus utile.</p>
<div class="format"><b>Important :</b> il existe près de 300 talents. Ce cours ne peut pas tous les présenter : il t'apprend à les comprendre et à les reconnaître, avec les plus courants comme exemples. Quand tu crées ton équipe, c'est à toi de bien te renseigner sur les talents de tes Pokémon et de ceux que tu risques d'affronter.</div>
<h2>Où voir le talent</h2>
<p>Sur l'écran d'équipe, le talent est la première ligne sous le nom de chaque Pokémon :</p>
${capture({
  src: "images/equipe-capacites.webp",
  alt: "L'équipe, onglet Capacités",
  reperes: [ { x: 17.8, y: 82, texte: "Le talent de Félinferno : <strong>Intimidation</strong>." } ],
  legende: "Écran d'équipe, onglet « Capacités, etc. »."
})}
<p>Et pendant le combat, le résumé (touche Y) rappelle le talent de chacun de tes Pokémon :</p>
${capture({
  src: "images/combat-resume.webp",
  alt: "Résumé pendant le combat",
  petite: true,
  reperes: [ { x: 74.6, y: 73.3, texte: "Le talent de Farigiraf : <strong>Armure Caudale</strong>." } ],
  legende: "Le résumé en combat : capacités, talent et objet tenu."
})}
<h2>Lire la description d'un talent</h2>
<p>Depuis la fiche d'un Pokémon, le jeu peut afficher la description complète de son talent :</p>
${capture({
  src: "images/talent-sable-volant.webp",
  alt: "Description du talent Sable Volant",
  reperes: [
    { x: 61, y: 22, texte: "Le <strong>nom</strong> du talent." },
    { x: 25.5, y: 33.5, texte: "Sa <strong>description</strong> : ce qu'il fait, et quand il s'active." },
    { x: 43, y: 94.3, texte: "Le bouton <strong>Glossaire</strong> explique les termes du jeu (tempête de sable, cran…)." }
  ],
  legende: "La description de Sable Volant, le talent de Tyranocif."
})}
<p>Deux mots du jeu à connaître : une <strong>capacité</strong>, c'est une « attaque » du Pokémon (cours « Les capacités »), et un <strong>cran</strong>, c'est un niveau de modification d'une statistique (on les verra dans le cours « Statistiques »).</p>
<div class="astuce"><b>Astuce :</b> le talent change souvent la façon de jouer un Pokémon. Avant de choisir un Pokémon pour ton équipe, lis toujours la description de ses talents possibles.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "D'après l'écran d'équipe, associe chaque Pokémon à son talent.",
            image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
            paires: [["Sarmuraï", "Repli Tactique"], ["Théffroyable", "Aux Petits Soins"], ["Tyranocif", "Sable Volant"], ["Oratoria", "Hydrata-Son"], ["Farigiraf", "Armure Caudale"]],
            commentaire: "Sur chaque carte, le talent est la ligne juste sous le nom du Pokémon. La ligne d'en dessous, avec une icône, c'est l'objet."
          },
          {
            type: "zones",
            enonce: "Trouve le talent sur la fiche de Sorcilence, puis ses types et ses capacités.",
            image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
            zones: ZONES_FICHE,
            cibles: ["talent", "types", "capacites"],
            commentaire: "Le talent de Sorcilence est Miroir Magik. Tu verras son effet dans la leçon suivante."
          }
        ],
        quiz: [
          { type: "choix", question: "Combien de talents un Pokémon a-t-il en combat ?",
            options: ["Un seul", "Deux", "Trois", "Autant que son espèce en possède"], reponse: 0,
            explication: "Un Pokémon a un seul talent, choisi parmi ceux de son espèce." },
          { type: "vf", question: "Il faut choisir une action pour utiliser le talent pendant le combat.", reponse: false,
            explication: "Le talent est passif : il agit tout seul." },
          { type: "choix", question: "Qu'est-ce qu'un talent caché ?",
            options: ["Un talent possible de l'espèce, plus rare à obtenir", "Un talent que l'adversaire ne peut jamais voir", "Un deuxième talent actif en même temps"], reponse: 0,
            explication: "C'est un des talents possibles de l'espèce, simplement plus rare." },
          { type: "zone", question: "Clique sur le talent de Scalpereur.",
            image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur", zones: ZONES_FICHE, reponse: "talent",
            explication: "Le talent de Scalpereur, Général Suprême, est affiché en bas à droite." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "familles",
        titre: "Les grandes familles de talents",
        texte: `
<p>Il existe des centaines de talents, mais ils se rangent dans quelques grandes familles. Tous les exemples de cette leçon viennent des Pokémon que tu as déjà vus.</p>
<h2>1. À l'entrée sur le terrain</h2>
<p>Ils s'activent dès que le Pokémon arrive en combat, au début ou après un changement.</p>
<ul>
<li><strong>Intimidation</strong> (Félinferno) : baisse l'Attaque des Pokémon adverses de 1 cran.</li>
<li><strong>Sable Volant</strong> (Tyranocif) : déclenche une tempête de sable pendant 5 tours.</li>
<li><strong>Aux Petits Soins</strong> (Théffroyable) : restaure 1/4 des PV max de son allié, en combat double.</li>
<li><strong>Créa-Herbe</strong> (Gorythmic) : crée un champ herbu sur tout le terrain pendant 5 tours. Ce terrain renforce les capacités Plante et soigne un peu, à chaque tour, les Pokémon qui touchent le sol.</li>
</ul>
${capture({
  src: "images/combat-mega-evolution.webp",
  alt: "Tempête de sable déclenchée par Sable Volant",
  petite: true,
  reperes: [ { x: 45.4, y: 7.1, texte: "La <strong>tempête de sable</strong> lancée par Sable Volant, avec ses tours restants (4 sur 5)." } ],
  legende: "Tyranocif est entré sur le terrain : son talent a déclenché la tempête de sable."
})}
<h2>2. Les immunités</h2>
<p>Tu les as vus dans le cours sur les types : ils ajoutent une immunité que le type n'a pas.</p>
<ul>
<li><strong>Lévitation</strong> : immunisé contre le ${type("sol")}.</li>
<li><strong>Absorb Eau</strong> : immunisé contre l'${type("eau")}, et soigné quand il en reçoit.</li>
<li><strong>Torche</strong> : immunisé contre le ${type("feu")} ; s'il en reçoit, ses propres capacités Feu deviennent plus fortes.</li>
<li><strong>Herbivore</strong> : immunisé contre la ${type("plante")}, et son Attaque augmente quand il en reçoit.</li>
</ul>
<h2>3. Les bonus offensifs</h2>
<ul>
<li><strong>Hydrata-Son</strong> (Oratoria) : ses capacités sonores deviennent de type ${type("eau")}. Son Mégaphone, normalement ${type("normal")}, devient une capacité Eau et profite du STAB.</li>
<li><strong>Général Suprême</strong> (Scalpereur) : son Attaque et son Atq. Spé. augmentent de 10 % pour chaque allié déjà K.O. (jusqu'à 5).</li>
<li><strong>Farceur</strong> : ses capacités de statut deviennent prioritaires. Attention, elles échouent contre les Pokémon ${type("tenebres")}.</li>
</ul>
<h2>4. La protection</h2>
<ul>
<li><strong>Corps Sain</strong> (Métalosse) : les adversaires ne peuvent pas baisser ses statistiques. Intimidation ne lui fait rien.</li>
<li><strong>Miroir Magik</strong> (Sorcilence) : renvoie à l'envoyeur les capacités de statut (Cage-Éclair, Pics Toxik…).</li>
<li><strong>Armure Caudale</strong> (Farigiraf) : les adversaires ne peuvent pas utiliser de capacités prioritaires sur lui ni sur son partenaire.</li>
</ul>
<h2>5. Les talents qui réagissent</h2>
<ul>
<li><strong>Point Poison</strong> (Kravarech) : un adversaire qui le touche avec une capacité de contact a 30 % de chances d'être empoisonné.</li>
<li><strong>Repli Tactique</strong> (Sarmuraï) : quand ses PV passent sous la moitié, il quitte automatiquement le terrain.</li>
</ul>
<p>Retrouve ces talents sur les fiches :</p>
${diaporama({ etapes: [
  { src: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria", titre: "Oratoria : Hydrata-Son", texte: "Bonus offensif. Regarde ses capacités : Mégaphone est une capacité sonore, elle devient de type Eau." },
  { src: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif", titre: "Tyranocif : Sable Volant", texte: "À l'entrée sur le terrain. Comme il est de type Roche, Tyranocif ne subit pas les dégâts de sa propre tempête." },
  { src: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse", titre: "Métalosse : Corps Sain", texte: "Protection. Ses statistiques ne peuvent pas être baissées par l'adversaire." },
  { src: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence", titre: "Sorcilence : Miroir Magik", texte: "Protection. Les capacités de statut lancées contre elle repartent vers l'adversaire." },
  { src: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur", titre: "Scalpereur : Général Suprême", texte: "Bonus offensif. Il devient de plus en plus dangereux à mesure que son équipe perd des Pokémon." },
  { src: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech", titre: "Kravarech : Point Poison", texte: "Talent qui réagit. Le toucher avec une capacité de contact, c'est risquer l'empoisonnement." }
] })}
<p>Et voici les descriptions officielles de quelques-uns de ces talents, telles que le jeu les affiche :</p>
${diaporama({ etapes: [
  { src: "images/talent-intimidation.webp", alt: "Description d'Intimidation", titre: "Intimidation (Félinferno)", texte: "« Quand le Pokémon arrive sur le terrain, il baisse l'Attaque des adversaires de 1 cran. » Un talent d'entrée sur le terrain, qui vise tous les adversaires." },
  { src: "images/talent-sable-volant.webp", alt: "Description de Sable Volant", titre: "Sable Volant (Tyranocif)", texte: "La tempête dure 5 tours. Pour la relancer, il faut faire sortir Tyranocif puis le faire revenir." },
  { src: "images/talent-crea-herbe.webp", alt: "Description de Créa-Herbe", titre: "Créa-Herbe (Gorythmic)", texte: "Même principe que Sable Volant, mais avec un terrain : un champ herbu pendant 5 tours." },
  { src: "images/talent-aux-petits-soins.webp", alt: "Description d'Aux Petits Soins", titre: "Aux Petits Soins (Théffroyable)", texte: "1/4 des PV max de l'allié : c'est le soin que reçoit le partenaire quand Théffroyable entre. Inutile en combat simple, où il n'a pas d'allié sur le terrain." },
  { src: "images/talent-armure-caudale.webp", alt: "Description d'Armure Caudale", titre: "Armure Caudale (Farigiraf)", texte: "Le jeu dit « capacités prioritaires » : ce sont les capacités prioritaires. Le talent protège Farigiraf et ses alliés." }
] })}
<h2>Tous les talents du cours</h2>
<p>Retrouve les talents de ce cours, classés par famille, avec une recherche. Ce répertoire ne contient qu'une petite partie des talents : pour tous les autres, utilise la liste complète de Poképédia (lien en bas du répertoire).</p>
${repertoireTalents()}
<div class="format"><b>Ça dépend du format :</b> certains talents ne servent qu'en combat double, comme Aux Petits Soins (il soigne le partenaire) ou Armure Caudale (il protège aussi le partenaire). En 3v3 ou en 6v6 OU, ils perdent une grande partie de leur intérêt.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque talent à sa famille.",
            paires: [["Intimidation", "À l'entrée sur le terrain"], ["Créa-Herbe", "À l'entrée sur le terrain"], ["Lévitation", "Immunité"], ["Hydrata-Son", "Bonus offensif"], ["Corps Sain", "Protection"], ["Point Poison", "Réagit quand on le touche"]],
            commentaire: "Intimidation s'active à l'entrée, Lévitation donne une immunité au Sol, Hydrata-Son change le type des capacités sonores, Corps Sain protège les stats et Point Poison réagit au contact."
          },
          {
            type: "situation",
            enonce: "Oratoria, avec son talent Hydrata-Son, utilise Mégaphone. De quel type est la capacité ?",
            image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria",
            options: [
              { texte: "Normal, comme d'habitude", bon: false, commentaire: "Normalement oui, mais Hydrata-Son change le type des capacités sonores." },
              { texte: "Eau", bon: true, commentaire: "Oui : avec Hydrata-Son, Mégaphone devient une capacité Eau. Comme Oratoria est de type Eau, elle profite en plus du STAB (×1,5)." },
              { texte: "Fée", bon: false, commentaire: "Non : Hydrata-Son transforme les capacités sonores en capacités Eau, pas Fée." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Que fait Intimidation quand le Pokémon entre sur le terrain ?",
            options: ["Baisse l'Attaque des adversaires", "Baisse l'Atq. Spé. des adversaires", "Augmente sa propre Défense", "Empêche les adversaires d'attaquer"], reponse: 0,
            explication: "Intimidation baisse l'Attaque des Pokémon adverses. Elle ne touche pas l'Atq. Spé." },
          { type: "choix", question: "Quel talent déclenche une tempête de sable ?",
            options: ["Sable Volant", "Corps Sain", "Lévitation", "Point Poison"], reponse: 0,
            explication: "Sable Volant, le talent de Tyranocif, lance une tempête de sable pendant 5 tours." },
          { type: "vf", question: "Avec Corps Sain, les adversaires ne peuvent pas baisser les statistiques du Pokémon.", reponse: true,
            explication: "C'est l'effet de Corps Sain : Intimidation, par exemple, ne lui fait rien." },
          { type: "choix", question: "Que fait Miroir Magik ?",
            options: ["Renvoie les capacités de statut à l'envoyeur", "Renvoie toutes les capacités", "Copie le talent adverse", "Rend immunisé contre le Psy"], reponse: 0,
            explication: "Miroir Magik renvoie les capacités de statut (Cage-Éclair, Pics Toxik…), pas les capacités qui font des dégâts." },
          { type: "choix", question: "D'après sa fiche, quel est le talent de Kravarech ?",
            image: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech",
            options: ["Point Poison", "Pics Toxik", "Discret", "Dragon"], reponse: 0,
            explication: "Point Poison est son talent. Pics Toxik est une capacité, Discret sa nature et Dragon un de ses types." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "anticiper",
        titre: "Anticiper le talent adverse",
        texte: `
<p>Pendant l'aperçu des équipes, tu vois les Pokémon adverses, mais pas leurs talents. Pourtant, il est souvent possible de les deviner.</p>
<h2>Deviner le talent</h2>
<ul>
<li><strong>Connais les talents possibles :</strong> une espèce n'en a que 1 à 3. Félinferno, par exemple, a Brasier ou Intimidation.</li>
<li><strong>Pense au talent le plus joué :</strong> en compétition, un talent est souvent bien meilleur que les autres. Face à un Félinferno, attends-toi à Intimidation.</li>
<li><strong>Observe le combat :</strong> la plupart des talents se dévoilent quand ils s'activent (une tempête de sable qui apparaît, une Attaque qui baisse…).</li>
<li><strong>Méfie-toi des Méga-Gemmes :</strong> si un Pokémon adverse peut méga-évoluer, son talent peut changer en plein combat. Un Métalosse perd Corps Sain en devenant Méga-Métalosse : ton Intimidation, inutile contre lui avant, fonctionnera sur sa forme Méga si tu la relances (en faisant sortir puis revenir Félinferno).</li>
</ul>
<div class="format"><b>Ça dépend du format :</b> sur Showdown, en survolant un Pokémon adverse, le site affiche la liste de ses talents possibles. Sur Pokémon Champions, il faut les connaître.</div>
<h2>Les interactions à connaître</h2>
<p>Un talent peut annuler un plan adverse. Voici trois exemples avec les Pokémon de ce cours :</p>
<table>
<tr><th>Situation</th><th>Ce qui se passe</th></tr>
<tr><td>Félinferno entre avec <strong>Intimidation</strong> face à Métalosse</td><td>Rien : <strong>Corps Sain</strong> empêche la baisse d'Attaque.</td></tr>
<tr><td>Scalpereur utilise <strong>Coup Bas</strong> (capacité prioritaire) sur le partenaire de Farigiraf</td><td>La capacité échoue : <strong>Armure Caudale</strong> bloque les capacités prioritaires adverses.</td></tr>
<tr><td>Kravarech lance <strong>Pics Toxik</strong> dans le camp de Sorcilence</td><td>Les Pics Toxik sont renvoyés : <strong>Miroir Magik</strong> les pose dans le camp de Kravarech.</td></tr>
<tr><td>Un Pokémon avec <strong>Farceur</strong> lance Cage-Éclair sur Scalpereur</td><td>La capacité échoue : le type <strong>Ténèbres</strong> est immunisé contre les capacités de statut rendues prioritaires par Farceur.</td></tr>
</table>
<div class="piege"><b>Piège à éviter :</b> un talent protège seulement contre ce qu'il décrit. Corps Sain bloque les baisses de stats causées par l'adversaire, mais pas celles que le Pokémon s'inflige lui-même (par exemple avec Draco-Météore). Miroir Magik renvoie les capacités de statut, mais pas les capacités qui font des dégâts.</div>
<div class="astuce"><b>Astuce :</b> avant chaque combat, repère les talents adverses qui peuvent gêner ton plan, et ceux de tes Pokémon qui peuvent gêner le sien.</div>
<h2>Se renseigner : c'est à toi de jouer</h2>
<p>Ce cours ne peut pas couvrir tous les talents, ni toutes leurs interactions : il y en a beaucoup trop, et de nouveaux arrivent avec les jeux. Lors de la création de ton équipe, prends l'habitude de :</p>
<ul>
<li>lire la description complète du talent de chacun de tes Pokémon, dans le jeu ou sur Poképédia ;</li>
<li>regarder les talents possibles des Pokémon les plus joués du format, pour savoir à quoi t'attendre ;</li>
<li>vérifier les interactions qui peuvent gêner ton plan (un Corps Sain face à ton Intimidation, un Pokémon Ténèbres face à ton Farceur…).</li>
</ul>
<p>Besoin de vérifier un talent ? Ouvre le répertoire :</p>
${repertoireTalents()}`,
        exercices: [
          {
            type: "situation",
            enonce: "Ton Félinferno entre sur le terrain avec Intimidation. En face, il y a Métalosse (Corps Sain) et un autre Pokémon. Que se passe-t-il ?",
            image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
            options: [
              { texte: "L'Attaque des deux adversaires baisse.", bon: false, commentaire: "Pas pour Métalosse : Corps Sain empêche l'adversaire de baisser ses stats." },
              { texte: "Seule l'Attaque de l'autre adversaire baisse.", bon: true, commentaire: "Oui : Métalosse est protégé par Corps Sain, mais son partenaire subit Intimidation normalement." },
              { texte: "Rien du tout pour les deux.", bon: false, commentaire: "Non : Corps Sain ne protège que Métalosse lui-même." }
            ]
          },
          {
            type: "situation",
            enonce: "Scalpereur veut utiliser Coup Bas (capacité prioritaire) sur Farigiraf, qui a le talent Armure Caudale. Que se passe-t-il ?",
            image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur",
            options: [
              { texte: "Coup Bas échoue.", bon: true, commentaire: "Oui : Armure Caudale empêche les adversaires d'utiliser des capacités prioritaires sur Farigiraf et son partenaire." },
              { texte: "Coup Bas passe en premier, comme d'habitude.", bon: false, commentaire: "Non : c'est justement ce que bloque Armure Caudale." },
              { texte: "Coup Bas passe, mais en dernier.", bon: false, commentaire: "Non : la capacité échoue complètement." }
            ]
          },
          {
            type: "situation",
            enonce: "Kravarech lance Pics Toxik dans le camp de Sorcilence (Miroir Magik). Où finissent les Pics Toxik ?",
            image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
            options: [
              { texte: "Dans le camp de Sorcilence.", bon: false, commentaire: "Non : Miroir Magik renvoie les capacités de statut." },
              { texte: "Dans le camp de Kravarech.", bon: true, commentaire: "Oui : Miroir Magik renvoie Pics Toxik à l'envoyeur. Mais comme Kravarech est un Pokémon Poison qui touche le sol, il pourra les retirer en entrant." },
              { texte: "Nulle part, la capacité échoue.", bon: false, commentaire: "Non : elle n'échoue pas, elle est renvoyée." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Pendant l'aperçu des équipes, que vois-tu des Pokémon adverses ?",
            options: ["Les espèces, mais pas les talents", "Les espèces et les talents", "Seulement les talents", "Rien du tout"], reponse: 0,
            explication: "Tu vois les espèces, mais pas leurs sets : talents, objets et capacités restent cachés." },
          { type: "choix", question: "Félinferno entre avec Intimidation face à Métalosse (Corps Sain). Que se passe-t-il pour Métalosse ?",
            options: ["Rien", "Son Attaque baisse", "Son Atq. Spé. baisse", "Il change de place"], reponse: 0,
            explication: "Corps Sain empêche l'adversaire de baisser les stats de Métalosse." },
          { type: "vf", question: "Armure Caudale empêche les adversaires d'utiliser des capacités prioritaires sur le Pokémon et son partenaire.", reponse: true,
            explication: "C'est l'effet d'Armure Caudale : Coup Bas ou Bluff, par exemple, échouent." },
          { piege: true, type: "vf", question: "Miroir Magik renvoie toutes les capacités, y compris celles qui font des dégâts.", reponse: false,
            explication: "Piège : Miroir Magik ne renvoie que les capacités de statut." }
        ]
      }
    ],
    examen: [
      { type: "zone", question: "Clique sur le talent de Métalosse.",
        image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse", zones: ZONES_FICHE, reponse: "talent",
        explication: "Le talent (Corps Sain) est en bas à droite de la fiche." },
      { type: "zone", question: "Clique sur le talent de Kravarech.",
        image: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech", zones: ZONES_FICHE, reponse: "talent",
        explication: "Le talent (Point Poison) est en bas à droite de la fiche." },
      { type: "choix", question: "Quel est le talent de Sorcilence ?",
        image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
        options: ["Miroir Magik", "Plénitude", "Calme", "Fée"], reponse: 0,
        explication: "Miroir Magik est son talent. Plénitude est une capacité, Calme sa nature et Fée un de ses types." },
      { type: "choix", question: "Quel est le talent de Félinferno dans cette équipe ?",
        image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
        options: ["Intimidation", "Casque Brut", "Bluff", "Brasier"], reponse: 0,
        explication: "Le talent est la ligne sous le nom : Intimidation. Casque Brut est son objet, Bluff une capacité." },
      { type: "assoc", question: "Associe chaque Pokémon à son talent.",
        paires: [["Tyranocif", "Sable Volant"], ["Oratoria", "Hydrata-Son"], ["Scalpereur", "Général Suprême"], ["Farigiraf", "Armure Caudale"]],
        explication: "Ce sont les talents vus sur leurs fiches et sur l'écran d'équipe." },
      { type: "vf", question: "Un Pokémon peut avoir deux talents actifs en même temps.", reponse: false,
        explication: "Un Pokémon n'a qu'un seul talent à la fois." },
      { type: "vf", question: "Le talent fait partie du set : on le choisit parmi les talents possibles de l'espèce.", reponse: true,
        explication: "Comme la nature, les capacités et l'objet." },
      { type: "choix", question: "Que fait Sable Volant ?",
        image: "images/combat-mega-evolution.webp", alt: "Tempête de sable en combat",
        options: ["Il déclenche une tempête de sable quand le Pokémon entre", "Il rend immunisé contre le Sol", "Il augmente la Vitesse sous le sable", "Il soigne le Pokémon sous le sable"], reponse: 0,
        explication: "Sable Volant lance une tempête de sable de 5 tours à l'entrée du Pokémon (on voit « Tempête de sable 4/5 » en haut de l'écran)." },
      { type: "choix", question: "Que fait Aux Petits Soins ?",
        options: ["Restaure 1/4 des PV max de l'allié quand le Pokémon arrive", "Soigne le Pokémon à chaque tour", "Empêche les statuts", "Augmente la Défense"], reponse: 0,
        explication: "À son entrée, le Pokémon restaure 1/4 des PV max de son allié. C'est utile en combat double." },
      { type: "choix", question: "Que fait Repli Tactique ?",
        options: ["Le Pokémon quitte le terrain quand ses PV passent sous la moitié", "Le Pokémon change de place à chaque tour", "Le Pokémon esquive la première capacité", "Le Pokémon se soigne en changeant"], reponse: 0,
        explication: "Sarmuraï se retire automatiquement dès que ses PV tombent sous la moitié." },
      { type: "choix", question: "Que fait Général Suprême ?",
        options: ["Augmente l'Attaque et l'Atq. Spé. pour chaque allié K.O.", "Baisse l'Attaque des adversaires", "Rend le Pokémon prioritaire", "Protège les alliés"], reponse: 0,
        explication: "+10 % par allié K.O., jusqu'à 5 : Scalpereur devient dangereux en fin de combat." },
      { type: "choix", question: "Oratoria a le talent Hydrata-Son. De quel type devient sa capacité Mégaphone ?",
        image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria",
        options: ["Eau", "Normal", "Fée", "Psy"], reponse: 0,
        explication: "Hydrata-Son transforme les capacités sonores en capacités Eau." },
      { type: "choix", question: "Quand Point Poison peut-il empoisonner un adversaire ?",
        options: ["Quand l'adversaire touche le Pokémon avec une capacité de contact", "À chaque fin de tour", "Quand le Pokémon entre sur le terrain", "Quand le Pokémon attaque"], reponse: 0,
        explication: "30 % de chances d'empoisonner un adversaire qui le touche avec une capacité de contact." },
      { type: "assoc", question: "Associe chaque talent à sa famille.",
        paires: [["Sable Volant", "À l'entrée sur le terrain"], ["Absorb Eau", "Immunité"], ["Général Suprême", "Bonus offensif"], ["Miroir Magik", "Protection"]],
        explication: "Sable Volant s'active à l'entrée, Absorb Eau donne une immunité, Général Suprême renforce les capacités et Miroir Magik protège." },
      { type: "choix", question: "Quel talent rend immunisé contre les capacités Eau ?",
        options: ["Absorb Eau", "Hydrata-Son", "Lévitation", "Torche"], reponse: 0,
        explication: "Absorb Eau : immunisé contre l'Eau, et soigné quand il en reçoit." },
      { type: "choix", question: "Quel talent rend immunisé contre les capacités Feu ?",
        options: ["Torche", "Absorb Eau", "Herbivore", "Corps Sain"], reponse: 0,
        explication: "Torche : immunisé contre le Feu ; s'il en reçoit, ses propres capacités Feu deviennent plus fortes." },
      { type: "choix", question: "Scalpereur utilise Coup Bas (capacité prioritaire) sur Farigiraf (Armure Caudale). Que se passe-t-il ?",
        image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur",
        options: ["La capacité échoue", "La capacité passe en premier", "La capacité passe en dernier", "Scalpereur est empoisonné"], reponse: 0,
        explication: "Armure Caudale bloque les capacités prioritaires adverses." },
      { type: "choix", question: "Kravarech lance Pics Toxik contre Sorcilence (Miroir Magik). Que se passe-t-il ?",
        options: ["Les Pics Toxik sont renvoyés dans le camp de Kravarech", "Les Pics Toxik sont posés dans le camp de Sorcilence", "Sorcilence est empoisonnée", "Rien du tout"], reponse: 0,
        explication: "Miroir Magik renvoie les capacités de statut à l'envoyeur." },
      { type: "choix", question: "Pendant l'aperçu des équipes, comment deviner le talent d'un Félinferno adverse ?",
        options: ["Il a presque toujours Intimidation en compétition", "Impossible, il faut attendre la fin du combat", "Il est affiché sous son nom", "Il a toujours Brasier"], reponse: 0,
        explication: "Une espèce n'a que 1 à 3 talents possibles, et en compétition un talent est souvent bien plus joué que les autres." },

      // ----- Descriptions du jeu -----
      { type: "nombre", question: "D'après cette description, combien de tours dure la tempête de sable de Sable Volant ?",
        image: "images/talent-sable-volant.webp", alt: "Description de Sable Volant", reponse: 5,
        explication: "La description indique une tempête de sable pendant 5 tours." },
      { type: "nombre", question: "De combien de crans Intimidation baisse-t-elle l'Attaque des adversaires ?",
        image: "images/talent-intimidation.webp", alt: "Description d'Intimidation", reponse: 1,
        explication: "La description indique : « il baisse l'Attaque des adversaires de 1 cran »." },
      { type: "choix", question: "D'après cette description, que restaure Aux Petits Soins ?",
        image: "images/talent-aux-petits-soins.webp", alt: "Description d'Aux Petits Soins",
        options: ["1/4 des PV max de l'allié", "1/4 des PV max du Pokémon lui-même", "La moitié des PV de l'allié", "Les statuts de l'allié"], reponse: 0,
        explication: "Le soin va à l'allié, pas au Pokémon lui-même : 1/4 de ses PV max." },
      { type: "choix", question: "Que crée Créa-Herbe quand le Pokémon arrive sur le terrain ?",
        image: "images/talent-crea-herbe.webp", alt: "Description de Créa-Herbe",
        options: ["Un champ herbu pendant 5 tours", "Une tempête de sable pendant 5 tours", "Un champ herbu pour tout le combat", "Des Picots dans le camp adverse"], reponse: 0,
        explication: "Créa-Herbe crée un champ herbu sur tout le terrain pendant 5 tours." },
      { type: "choix", question: "D'après cette description, qu'est-ce qu'Armure Caudale empêche ?",
        image: "images/talent-armure-caudale.webp", alt: "Description d'Armure Caudale",
        options: ["Les capacités prioritaires adverses sur le Pokémon et ses alliés", "Toutes les capacités adverses", "Les baisses de statistiques", "Les changements de Pokémon"], reponse: 0,
        explication: "Armure Caudale bloque les capacités prioritaires adverses visant le Pokémon et ses alliés." },

      { type: "choix", question: "Que fait le talent Farceur ?",
        options: ["Rend prioritaires les capacités de statut", "Rend prioritaires toutes les capacités", "Renvoie les capacités de statut", "Baisse l'Attaque des adversaires"], reponse: 0,
        explication: "Farceur donne la priorité aux capacités de statut (Cage-Éclair, Provoc, Vent Arrière…)." },

      { type: "vf", question: "Un Pokémon peut changer de talent en méga-évoluant.", reponse: true,
        explication: "Une méga-évolution a son propre talent, qui remplace celui du Pokémon. Par exemple, Méga-Métalosse a Griffe Dure à la place de Corps Sain." },

      // ----- Questions pièges -----
      { piege: true, type: "choix", question: "Métalosse (Corps Sain) méga-évolue. Quel est son talent ensuite ?",
        image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
        options: ["Griffe Dure", "Corps Sain, il le garde", "Il n'a plus de talent", "Corps Sain et Griffe Dure"], reponse: 0,
        explication: "Piège : le talent de la fiche ne reste pas forcément après la Méga-Évolution. Méga-Métalosse a Griffe Dure, et perd Corps Sain." },
      { piege: true, type: "vf", question: "Toutes les méga-évolutions changent le talent du Pokémon.", reponse: false,
        explication: "Piège : certaines gardent le même talent. Méga-Tyranocif garde Sable Volant, par exemple." },
      { piege: true, type: "choix", question: "Quel type est immunisé contre les capacités de statut rendues prioritaires par Farceur ?",
        options: ["Ténèbres", "Psy", "Spectre", "Acier"], reponse: 0,
        explication: "Piège : on pense souvent au Psy ou au Spectre, mais c'est le type Ténèbres qui fait échouer les capacités de statut lancées grâce à Farceur." },
      { piege: true, type: "vf", question: "D'après sa description, Armure Caudale protège seulement Farigiraf.",
        image: "images/talent-armure-caudale.webp", alt: "Description d'Armure Caudale", reponse: false,
        explication: "Piège : la description dit « sur le Pokémon et ses alliés ». Le partenaire de Farigiraf est protégé aussi." },
      { piege: true, type: "vf", question: "Aux Petits Soins soigne Théffroyable quand il arrive sur le terrain.",
        image: "images/talent-aux-petits-soins.webp", alt: "Description d'Aux Petits Soins", reponse: false,
        explication: "Piège : c'est son allié qui est soigné, pas Théffroyable lui-même." },
      { piege: true, type: "choix", question: "Félinferno entre avec Intimidation. Quelle statistique des adversaires baisse ?",
        options: ["L'Attaque", "L'Atq. Spé.", "La Défense", "L'Attaque et l'Atq. Spé."], reponse: 0,
        explication: "Piège : Intimidation baisse seulement l'Attaque. Un attaquant spécial comme Oratoria n'est pas gêné." },
      { piege: true, type: "vf", question: "Corps Sain empêche Draco-Météore de baisser l'Atq. Spé. de son propre utilisateur.", reponse: false,
        explication: "Piège : Corps Sain bloque les baisses causées par l'adversaire, pas celles que le Pokémon s'inflige lui-même." },
      { piege: true, type: "vf", question: "Miroir Magik renvoie Tonnerre à l'envoyeur.", reponse: false,
        explication: "Piège : Tonnerre fait des dégâts. Miroir Magik ne renvoie que les capacités de statut, comme Cage-Éclair." },
      { piege: true, type: "vf", question: "Armure Caudale empêche l'adversaire d'utiliser Abri.", reponse: false,
        explication: "Piège : Abri est prioritaire, mais il ne vise pas Farigiraf ni son partenaire. Armure Caudale ne bloque que les capacités prioritaires dirigées contre eux." },
      { piege: true, type: "choix", question: "Félinferno entre avec Intimidation face à Métalosse (Corps Sain) et Oratoria. Quelle Attaque baisse ?",
        image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
        options: ["Seulement celle d'Oratoria", "Celles des deux", "Aucune", "Seulement celle de Métalosse"], reponse: 0,
        explication: "Piège : Corps Sain ne protège que Métalosse. L'Attaque d'Oratoria baisse normalement (même si, en attaquante spéciale, elle s'en moque)." },
      { piege: true, type: "choix", question: "Tyranocif lance une tempête de sable avec Sable Volant. Subit-il les dégâts de sa propre tempête ?",
        image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif",
        options: ["Non, car il est de type Roche", "Oui, comme tout le monde", "Non, car c'est son propre talent", "Oui, mais seulement au premier tour"], reponse: 0,
        explication: "Piège : ce n'est pas parce que c'est son talent, c'est parce qu'il est de type Roche. Un Pokémon non Roche, Sol ou Acier subirait les dégâts de son propre sable." },
      { piege: true, type: "choix", question: "Oratoria utilise Mégaphone grâce à Hydrata-Son contre un Pokémon Spectre. Que se passe-t-il ?",
        options: ["La capacité touche normalement", "La capacité échoue : Spectre est immunisé contre le Normal", "La capacité fait ×2", "La capacité fait ×0,5"], reponse: 0,
        explication: "Piège : avec Hydrata-Son, Mégaphone devient de type Eau. Le type Spectre est neutre face à l'Eau : la capacité touche normalement." }
    ]
  },
  {
    id: "statistiques", titre: "Les statistiques",
    objectifs: [
      "Relier les 6 statistiques au rôle d'un Pokémon",
      "Comprendre les statistiques de base d'une espèce",
      "Choisir une nature et répartir ses points de stats",
      "Connaître les modifications de stats en combat (les crans)"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "roles",
        titre: "Les 6 statistiques et les rôles",
        texte: `
<p>Chaque Pokémon a 6 statistiques. Ensemble, elles décident de ce qu'il fait bien… et de ce qu'il fait mal.</p>
<table>
<tr><th>Statistique</th><th>À quoi elle sert</th></tr>
<tr><td><strong>PV</strong></td><td>Les points de vie : à 0, le Pokémon est K.O.</td></tr>
<tr><td><strong>Attaque</strong></td><td>La force des capacités <strong>physiques</strong></td></tr>
<tr><td><strong>Défense</strong></td><td>La résistance aux capacités physiques</td></tr>
<tr><td><strong>Atq. Spé.</strong></td><td>La force des capacités <strong>spéciales</strong></td></tr>
<tr><td><strong>Déf. Spé.</strong></td><td>La résistance aux capacités spéciales</td></tr>
<tr><td><strong>Vitesse</strong></td><td>L'ordre d'action : le plus rapide agit en premier (à priorité égale)</td></tr>
</table>
${capture({
  src: "images/stats-entrainement.webp",
  alt: "Écran d'entraînement de Carchacrok dans Pokémon Champions",
  reperes: [
    { x: 5.5, y: 42, texte: "Les <strong>6 statistiques</strong> et leur valeur finale (PV 185, Attaque 182…)." },
    { x: 48.5, y: 17.8, texte: "Les <strong>points de stats</strong> utilisés : 66 sur 66 (leçon 4)." },
    { x: 38, y: 79.9, texte: "L'<strong>ajustement de stats</strong>, c'est-à-dire la nature : Jovial (leçon 3)." }
  ],
  legende: "L'écran d'entraînement de Carchacrok dans Pokémon Champions."
})}
<h2>Les stats décident du rôle</h2>
<p>En regardant ses stats, on devine ce qu'un Pokémon doit faire :</p>
<ul>
<li><strong>Grosse Attaque :</strong> attaquant physique. Il utilise surtout des capacités physiques.</li>
<li><strong>Grosse Atq. Spé. :</strong> attaquant spécial.</li>
<li><strong>Gros PV et défenses :</strong> Pokémon défensif, qui encaisse.</li>
<li><strong>Grosse Vitesse :</strong> il frappe avant les autres. <strong>Faible Vitesse :</strong> il frappe après, mais peut briller sous Distorsion.</li>
</ul>
<p>Exemple : Carchacrok a 182 en Attaque mais seulement 90 en Atq. Spé. Ses capacités offensives (Séisme, Draco-Queue, Tomberoche) sont donc toutes physiques.</p>
<div class="piege"><b>Piège à éviter :</b> donner une capacité spéciale à un attaquant physique (ou l'inverse). Elle sera calculée avec sa mauvaise statistique et fera peu de dégâts.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "D'après l'onglet Stats de l'équipe, associe chaque Pokémon à son rôle principal.",
            image: "images/equipe-stats.webp", alt: "L'équipe, onglet Stats",
            paires: [["Tyranocif", "Attaquant physique"], ["Oratoria", "Attaquant spécial"], ["Félinferno", "Défensif"]],
            commentaire: "Tyranocif met tout en Attaque, Oratoria en Atq. Spé., et Félinferno renforce ses PV et ses défenses."
          },
          {
            type: "situation",
            enonce: "Carchacrok a 182 en Attaque et 90 en Atq. Spé. Quelle capacité lui donnes-tu ?",
            image: "images/stats-entrainement.webp", alt: "Écran d'entraînement de Carchacrok",
            options: [
              { texte: "Séisme (physique)", bon: true, commentaire: "Oui : une capacité physique profite de sa grosse Attaque." },
              { texte: "Draco-Météore (spéciale)", bon: false, commentaire: "Non : elle serait calculée avec son Atq. Spé., bien plus faible." },
              { texte: "Peu importe, les deux font pareil.", bon: false, commentaire: "Non : la catégorie de la capacité décide de la statistique utilisée." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Quelle statistique décide qui agit en premier (à priorité égale) ?",
            options: ["La Vitesse", "L'Attaque", "Les PV", "La Défense"], reponse: 0,
            explication: "La Vitesse décide de l'ordre d'action." },
          { type: "choix", question: "Quelle statistique réduit les dégâts des capacités spéciales ?",
            options: ["La Déf. Spé.", "La Défense", "Les PV", "L'Atq. Spé."], reponse: 0,
            explication: "La Déf. Spé. protège des capacités spéciales, la Défense des capacités physiques." },
          { type: "vf", question: "Un Pokémon avec une très grosse Attaque doit plutôt utiliser des capacités physiques.", reponse: true,
            explication: "Les capacités physiques utilisent l'Attaque." },
          { type: "nombre", question: "Combien de statistiques a un Pokémon ?", reponse: 6,
            explication: "PV, Attaque, Défense, Atq. Spé., Déf. Spé. et Vitesse." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "base",
        titre: "Les statistiques de base",
        texte: `
<p>Chaque espèce a des <strong>statistiques de base</strong> : ses valeurs naturelles, identiques pour tous les Pokémon de cette espèce. On ne peut pas les changer. C'est le point de départ, avant la nature et les points de stats.</p>
<table>
<tr><th>Espèce</th><th>PV</th><th>Atq.</th><th>Déf.</th><th>Atq. Spé.</th><th>Déf. Spé.</th><th>Vit.</th></tr>
<tr><td>Carchacrok</td><td>108</td><td><strong>130</strong></td><td>95</td><td>80</td><td>85</td><td>102</td></tr>
<tr><td>Tyranocif</td><td>100</td><td><strong>134</strong></td><td>110</td><td>95</td><td>100</td><td>61</td></tr>
<tr><td>Oratoria</td><td>80</td><td>74</td><td>74</td><td><strong>126</strong></td><td>116</td><td>60</td></tr>
<tr><td>Métalosse</td><td>80</td><td><strong>135</strong></td><td>130</td><td>95</td><td>90</td><td>70</td></tr>
</table>
<h2>Ce qu'on en déduit</h2>
<ul>
<li>Carchacrok, Tyranocif et Métalosse ont une énorme Attaque : ce sont des attaquants physiques.</li>
<li>Oratoria est une attaquante spéciale, avec une bonne Déf. Spé.</li>
<li>Tyranocif et Oratoria sont <strong>lents</strong> (61 et 60) : c'est pour ça qu'ils fonctionnent si bien dans une équipe avec Distorsion, comme celle du cours 1.</li>
</ul>
<div class="astuce"><b>Astuce :</b> les stats de base ne s'affichent pas directement dans Pokémon Champions. Pour les connaître, consulte une fiche Pokémon sur un site comme Poképédia. C'est indispensable pour construire une équipe.</div>
<div class="piege"><b>Piège à éviter :</b> ne confonds pas stats de base et stats finales. Carchacrok a 130 en Attaque de base, mais 182 sur son écran d'entraînement : la différence vient du niveau, de la nature et des points investis.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Ton équipe utilise Distorsion (les plus lents agissent en premier). Lequel de ces Pokémon en profite le plus ?",
            options: [
              { texte: "Tyranocif (Vitesse de base 61)", bon: true, commentaire: "Oui : sous Distorsion, être lent devient un avantage." },
              { texte: "Carchacrok (Vitesse de base 102)", bon: false, commentaire: "Non : sous Distorsion, Carchacrok agira parmi les derniers." },
              { texte: "Les deux pareil", bon: false, commentaire: "Non : Distorsion inverse l'ordre de Vitesse, le plus lent passe en premier." }
            ]
          }
        ],
        quiz: [
          { type: "vf", question: "Les statistiques de base sont les mêmes pour tous les Pokémon d'une espèce.", reponse: true,
            explication: "C'est ce qui définit une espèce. Le reste (nature, points) change d'un Pokémon à l'autre." },
          { type: "choix", question: "D'après ses stats de base, quel est le rôle d'Oratoria ?",
            options: ["Attaquante spéciale", "Attaquante physique", "Pokémon très rapide", "Aucun rôle"], reponse: 0,
            explication: "126 en Atq. Spé., contre 74 en Attaque." },
          { type: "choix", question: "Lequel de ces Pokémon est le plus lent ?",
            options: ["Oratoria (60)", "Tyranocif (61)", "Métalosse (70)", "Carchacrok (102)"], reponse: 0,
            explication: "Oratoria a 60 en Vitesse de base, Tyranocif 61." },
          { piege: true, type: "vf", question: "Carchacrok a 182 en Attaque sur son écran : c'est sa stat de base.", reponse: false,
            explication: "Piège : sa stat de base est 130. Le 182 est la valeur finale, après niveau, nature et points." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "natures",
        titre: "Les natures",
        texte: `
<p>La <strong>nature</strong> (dans Pokémon Champions : l'<strong>ajustement de stats</strong>) augmente une statistique de <strong>10 %</strong> et en baisse une autre de <strong>10 %</strong>. Elle ne touche jamais les PV.</p>
${capture({
  src: "images/stats-natures.webp",
  alt: "Tableau des ajustements de stats dans Pokémon Champions",
  reperes: [
    { x: 2.8, y: 55.9, texte: "Les <strong>lignes</strong> : la statistique augmentée (flèches rouges)." },
    { x: 97.5, y: 26.3, texte: "Les <strong>colonnes</strong> : la statistique baissée (flèches bleues)." },
    { x: 66, y: 74.7, texte: "<strong>Jovial</strong> : ligne Vitesse, colonne Atq. Spé. Il augmente la Vitesse et baisse l'Atq. Spé." }
  ],
  legende: "Le tableau des 25 natures. Sur la diagonale, la nature augmente et baisse la même stat : elle n'a aucun effet (comme Sérieux)."
})}
<h2>Les natures les plus utilisées</h2>
<table>
<tr><th>Nature</th><th>Augmente</th><th>Baisse</th><th>Pour qui ?</th></tr>
<tr><td>Rigide</td><td>Attaque</td><td>Atq. Spé.</td><td>Attaquant physique (Tyranocif)</td></tr>
<tr><td>Jovial</td><td>Vitesse</td><td>Atq. Spé.</td><td>Attaquant physique rapide (Carchacrok)</td></tr>
<tr><td>Modeste</td><td>Atq. Spé.</td><td>Attaque</td><td>Attaquant spécial (Oratoria)</td></tr>
<tr><td>Timide</td><td>Vitesse</td><td>Attaque</td><td>Attaquant spécial rapide</td></tr>
<tr><td>Calme / Assuré</td><td>Déf. Spé. / Défense</td><td>Attaque</td><td>Pokémon défensif spécial / physique</td></tr>
<tr><td>Discret / Brave</td><td>Atq. Spé. / Attaque</td><td>Vitesse</td><td>Pokémon lent, pour Distorsion</td></tr>
</table>
<h2>Comment choisir</h2>
<ol>
<li><strong>Baisse la stat inutile.</strong> Un attaquant physique n'a pas besoin de son Atq. Spé. : c'est elle qu'on sacrifie.</li>
<li><strong>Augmente ce qui compte le plus</strong> : la force de frappe, ou la Vitesse pour dépasser un adversaire précis.</li>
<li><strong>Pense à ton équipe :</strong> sous Distorsion, on veut être lent. On baisse alors la Vitesse.</li>
</ol>
<div class="astuce"><b>Rappel :</b> sur les écrans du jeu, une flèche rouge vers le haut marque la stat augmentée, une flèche bleue vers le bas la stat baissée.</div>`,
        exercices: [
          {
            type: "zones",
            enonce: "Dans le tableau des natures, trouve chacune de ces natures.",
            image: "images/stats-natures.webp", alt: "Tableau des ajustements de stats",
            zones: {
              rigide:  { nom: "la nature qui augmente l'Attaque et baisse l'Atq. Spé. (Rigide)", rect: [51.7, 33.7, 64.1, 40.3] },
              modeste: { nom: "la nature qui augmente l'Atq. Spé. et baisse l'Attaque (Modeste)", rect: [21.7, 52.6, 34.1, 59.2] },
              jovial:  { nom: "la nature qui augmente la Vitesse et baisse l'Atq. Spé. (Jovial)", rect: [51.7, 71.4, 64.1, 78] },
              calme:   { nom: "la nature qui augmente la Déf. Spé. et baisse l'Attaque (Calme)", rect: [21.7, 62, 34.1, 68.6] }
            },
            cibles: ["rigide", "modeste", "jovial", "calme"],
            commentaire: "Ligne = stat augmentée, colonne = stat baissée."
          },
          {
            type: "situation",
            enonce: "Oratoria attaque avec des capacités spéciales et n'utilise jamais son Attaque. Quelle nature lui donnes-tu ?",
            image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria",
            options: [
              { texte: "Modeste (+Atq. Spé., −Attaque)", bon: true, commentaire: "Oui : on renforce sa stat utile et on baisse celle qui ne sert à rien." },
              { texte: "Rigide (+Attaque, −Atq. Spé.)", bon: false, commentaire: "C'est l'inverse de ce qu'il lui faut !" },
              { texte: "Sérieux (aucun effet)", bon: false, commentaire: "Possible, mais on se prive d'un bonus de 10 %." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "De combien une nature augmente-t-elle une statistique ?",
            options: ["10 %", "20 %", "50 %", "5 %"], reponse: 0,
            explication: "+10 % sur une stat, −10 % sur une autre." },
          { type: "choix", question: "Que fait la nature Jovial ?",
            image: "images/stats-natures.webp", alt: "Tableau des natures",
            options: ["Augmente la Vitesse, baisse l'Atq. Spé.", "Augmente l'Attaque, baisse la Vitesse", "Augmente l'Atq. Spé., baisse l'Attaque", "Aucun effet"], reponse: 0,
            explication: "Jovial est sur la ligne Vitesse et dans la colonne Atq. Spé." },
          { type: "vf", question: "Une nature peut augmenter les PV.", reponse: false,
            explication: "Les natures ne touchent jamais les PV." },
          { type: "choix", question: "Dans Pokémon Champions, comment s'appelle la nature ?",
            options: ["L'ajustement de stats", "Le talent", "Les points de stats", "Le cran"], reponse: 0,
            explication: "Le jeu l'appelle « Ajustement de stats »." }
        ]
      },

      // ---------------- Leçon 4 ----------------
      {
        id: "investissement",
        titre: "L'investissement",
        texte: `
<p>En plus de la nature, tu peux renforcer certaines statistiques en y <strong>investissant</strong> des points. C'est ce qui permet de spécialiser deux Pokémon de la même espèce de façon différente.</p>
<h2>Sur Pokémon Champions : les points de stats</h2>
<ul>
<li>Tu as <strong>66 points</strong> à répartir.</li>
<li>Une statistique peut recevoir <strong>32 points au maximum</strong>.</li>
<li>Au niveau 50, <strong>chaque point ajoute 1</strong> à la statistique (avant l'effet de la nature).</li>
</ul>
${capture({
  src: "images/stats-entrainement.webp",
  alt: "Répartition des points de stats de Carchacrok",
  reperes: [
    { x: 48.5, y: 17.8, texte: "Total : <strong>66 / 66</strong> points utilisés." },
    { x: 45, y: 33.5, texte: "Les points de chaque stat : <strong>32</strong> en Attaque, <strong>32</strong> en Vitesse, <strong>2</strong> en PV." },
    { x: 69.5, y: 91.6, texte: "Le bouton <strong>Entraîner</strong> pour modifier la répartition." }
  ],
  legende: "Carchacrok : 32 en Attaque, 32 en Vitesse, et les 2 points restants en PV."
})}
<h2>Les répartitions classiques</h2>
<table>
<tr><th>Rôle</th><th>Répartition</th><th>Exemple</th></tr>
<tr><td>Attaquant physique rapide</td><td>32 Attaque, 32 Vitesse, 2 PV</td><td>Carchacrok, Métalosse</td></tr>
<tr><td>Attaquant lent (Distorsion)</td><td>32 PV, 32 Attaque, 2 Défense</td><td>Tyranocif</td></tr>
<tr><td>Défensif</td><td>32 PV, puis les défenses</td><td>Félinferno, Sorcilence</td></tr>
</table>
<div class="format"><b>Ça dépend du format :</b> sur Showdown (6v6 OU), le système est différent. Les Pokémon sont au niveau 100, on répartit <strong>510 EV</strong> (252 au maximum par stat), et chaque statistique a aussi un <strong>IV</strong> (de 0 à 31), en général laissé à 31. Le principe reste le même : renforcer les stats utiles à son rôle.</div>
<div class="astuce"><b>Astuce :</b> mettre tous ses points en Vitesse n'est pas toujours utile. Il suffit souvent d'être juste un peu plus rapide qu'un adversaire précis : le reste peut aller ailleurs. On approfondira ça dans les formats.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Tu veux que ton attaquant physique rapide frappe fort et avant les autres. Comment répartis-tu ses 66 points ?",
            image: "images/stats-entrainement.webp", alt: "Écran d'entraînement de Carchacrok",
            options: [
              { texte: "32 Attaque, 32 Vitesse, 2 PV", bon: true, commentaire: "Oui : c'est la répartition classique, celle de Carchacrok." },
              { texte: "66 en Attaque", bon: false, commentaire: "Impossible : une stat ne peut pas recevoir plus de 32 points." },
              { texte: "11 points dans chaque stat", bon: false, commentaire: "Possible, mais ton Pokémon ne serait bon en rien : mieux vaut se spécialiser." }
            ]
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien de points de stats a-t-on à répartir sur Pokémon Champions ?", reponse: 66,
            explication: "66 points au total." },
          { type: "nombre", question: "Combien de points une seule statistique peut-elle recevoir au maximum ?", reponse: 32,
            explication: "32 points au maximum par stat." },
          { type: "choix", question: "Au niveau 50, combien ajoute chaque point de stat ?",
            options: ["1", "2", "4", "10"], reponse: 0,
            explication: "Chaque point ajoute 1 à la statistique, avant l'effet de la nature." },
          { piege: true, type: "vf", question: "On peut mettre 66 points dans l'Attaque.", reponse: false,
            explication: "Piège : le maximum est de 32 points par statistique." }
        ]
      },

      // ---------------- Leçon 5 ----------------
      {
        id: "modifications",
        titre: "Les modifications en combat",
        texte: `
<p>Pendant un combat, les statistiques peuvent monter ou baisser par <strong>crans</strong>, de −6 à +6. Tu as déjà croisé ce mot dans les descriptions du jeu :</p>
<ul>
<li><strong>Danse Lames</strong> augmente l'Attaque du lanceur de 2 crans.</li>
<li><strong>Intimidation</strong> baisse l'Attaque des adversaires de 1 cran.</li>
<li><strong>Draco-Météore</strong> baisse l'Atq. Spé. du lanceur de 2 crans.</li>
</ul>
<table>
<tr><th>Crans</th><th>−6</th><th>−3</th><th>−2</th><th>−1</th><th>0</th><th>+1</th><th>+2</th><th>+3</th><th>+6</th></tr>
<tr><td>Multiplicateur</td><td>×0,25</td><td>×0,4</td><td>×0,5</td><td>×0,67</td><td>×1</td><td>×1,5</td><td>×2</td><td>×2,5</td><td>×4</td></tr>
</table>
${capture({
  src: "images/combat-effets-terrain.webp",
  alt: "Effets sur Farigiraf : Vitesse baissée",
  reperes: [ { x: 45.6, y: 71.6, texte: "La Vitesse de Farigiraf a perdu 1 cran : <strong>×0,67</strong>. La flèche bleue indique une baisse." } ],
  legende: "En combat, l'écran d'informations affiche les crans de chaque statistique."
})}
<h2>Les règles à connaître</h2>
<ul>
<li>Les crans <strong>disparaissent quand le Pokémon quitte le terrain</strong>. Changer de Pokémon est donc un moyen d'effacer une baisse… mais aussi de perdre une hausse.</li>
<li>Les PV n'ont pas de crans.</li>
<li>Il existe aussi des crans de <strong>précision</strong> et d'<strong>esquive</strong>, visibles sur le même écran.</li>
</ul>
<div class="piege"><b>Piège à éviter :</b> les crans ne s'additionnent pas comme des pourcentages. +1 cran, c'est ×1,5 ; +2 crans, c'est ×2, pas ×3.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque situation au bon multiplicateur.",
            paires: [["Après une Danse Lames (+2)", "×2"], ["Après une Intimidation (−1)", "×0,67"], ["Après deux Draco-Météore (−4 au total)", "×0,33"], ["Après un changement de Pokémon", "×1"]],
            commentaire: "+2 donne ×2, −1 donne ×0,67, −4 donne ×0,33, et un changement remet tout à zéro."
          },
          {
            type: "situation",
            enonce: "Ton attaquant physique vient de subir une Intimidation (−1 Attaque). Que peux-tu faire pour effacer cette baisse ?",
            image: "images/talent-intimidation.webp", alt: "Description d'Intimidation",
            options: [
              { texte: "Le faire sortir puis revenir plus tard", bon: true, commentaire: "Oui : les crans disparaissent quand le Pokémon quitte le terrain." },
              { texte: "Attendre la fin du tour", bon: false, commentaire: "Non : les crans restent tant que le Pokémon est sur le terrain." },
              { texte: "Utiliser Abri", bon: false, commentaire: "Non : Abri protège des attaques, mais n'efface pas les crans." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Quel est le multiplicateur d'une statistique à +2 crans ?",
            options: ["×2", "×1,5", "×3", "×2,5"], reponse: 0,
            explication: "+1 = ×1,5 ; +2 = ×2 ; +3 = ×2,5…" },
          { type: "choix", question: "Quel est le multiplicateur d'une statistique à −1 cran ?",
            image: "images/combat-effets-terrain.webp", alt: "Effets sur Farigiraf",
            options: ["×0,67", "×0,5", "×0,9", "×0,25"], reponse: 0,
            explication: "−1 cran = ×0,67, comme la Vitesse de Farigiraf sur cet écran." },
          { type: "vf", question: "Les crans disparaissent quand le Pokémon quitte le terrain.", reponse: true,
            explication: "Changer de Pokémon remet ses crans à zéro." },
          { piege: true, type: "choix", question: "Danse Lames utilisée deux fois de suite (+4 crans). Quel multiplicateur pour l'Attaque ?",
            options: ["×3", "×4", "×6", "×2"], reponse: 0,
            explication: "Piège : +4 crans donne ×3, pas ×4. Le ×4, c'est à +6." }
        ]
      }
    ],
    examen: [
      // ----- Lire les stats -----
      { type: "zone", question: "Sur cet écran, clique sur le nombre de points de stats utilisés.",
        image: "images/stats-entrainement.webp", alt: "Écran d'entraînement de Carchacrok",
        zones: { points: { nom: "le total des points (66/66)", rect: [36, 14, 47, 21] }, nature: { nom: "la nature", rect: [15, 75, 36, 85] }, stats: { nom: "les statistiques", rect: [8, 22, 43, 69] } }, reponse: "points",
        explication: "Le total 66/66 est en haut à droite du cadre « Points de stats »." },
      { type: "zone", question: "Sur cet écran, clique sur l'ajustement de stats (la nature).",
        image: "images/stats-entrainement.webp", alt: "Écran d'entraînement de Carchacrok",
        zones: { points: { nom: "le total des points", rect: [36, 14, 47, 21] }, nature: { nom: "la nature (Jovial)", rect: [15, 75, 36, 85] }, stats: { nom: "les statistiques", rect: [8, 22, 43, 69] } }, reponse: "nature",
        explication: "La nature est affichée sous « Ajustement de stats » : Jovial." },
      { type: "choix", question: "D'après ses flèches, quelle statistique la nature de Carchacrok augmente-t-elle ?",
        image: "images/stats-entrainement.webp", alt: "Écran d'entraînement de Carchacrok",
        options: ["La Vitesse", "L'Attaque", "L'Atq. Spé.", "Les PV"], reponse: 0,
        explication: "La flèche rouge vers le haut est à côté de la Vitesse. La bleue vers le bas est à côté de l'Atq. Spé." },
      { type: "nombre", question: "Combien de points Carchacrok a-t-il mis dans sa Vitesse ?",
        image: "images/stats-entrainement.webp", alt: "Écran d'entraînement de Carchacrok", reponse: 32,
        explication: "Le nombre à droite de la barre : 32, le maximum." },
      { type: "choix", question: "D'après ses stats et sa nature, quel est le rôle de Métalosse ?",
        image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
        options: ["Attaquant physique rapide", "Attaquant spécial", "Pokémon défensif", "Pokémon lent pour Distorsion"], reponse: 0,
        explication: "32 points en Attaque et en Vitesse, nature Jovial (+Vitesse) : attaquant physique rapide." },
      { type: "choix", question: "D'après ses points et sa nature, quel est le rôle de Kravarech ?",
        image: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech",
        options: ["Attaquant spécial lent et résistant", "Attaquant physique rapide", "Attaquant physique lent", "Pokémon très rapide"], reponse: 0,
        explication: "32 points en PV et Déf. Spé., nature Discret (+Atq. Spé., −Vitesse) : un attaquant spécial lent et résistant." },
      { type: "choix", question: "Quelle nature a Sorcilence ?",
        image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
        options: ["Calme", "Modeste", "Jovial", "Miroir Magik"], reponse: 0,
        explication: "« Ajust. de stats : Calme ». Miroir Magik est son talent." },
      { type: "choix", question: "Que fait la nature Calme de Sorcilence ?",
        image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
        options: ["Augmente la Déf. Spé., baisse l'Attaque", "Augmente l'Atq. Spé., baisse l'Attaque", "Augmente la Vitesse", "Aucun effet"], reponse: 0,
        explication: "Flèche rouge sur la Déf. Spé., flèche bleue sur l'Attaque." },
      { type: "choix", question: "Quelle est la nature de Scalpereur ?",
        image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur",
        options: ["Rigide", "Jovial", "Discret", "Brave"], reponse: 0,
        explication: "Rigide : +Attaque, −Atq. Spé." },

      // ----- Natures -----
      { type: "zone", question: "Dans ce tableau, clique sur la nature qui augmente la Vitesse et baisse l'Attaque.",
        image: "images/stats-natures.webp", alt: "Tableau des natures",
        zones: { timide: { nom: "Timide", rect: [21.7, 71.4, 34.1, 78] }, jovial: { nom: "Jovial", rect: [51.7, 71.4, 64.1, 78] }, modeste: { nom: "Modeste", rect: [21.7, 52.6, 34.1, 59.2] }, brave: { nom: "Brave", rect: [81.7, 33.7, 94.1, 40.3] } }, reponse: "timide",
        explication: "Ligne Vitesse (augmentée), colonne Attaque (baissée) : Timide." },
      { type: "zone", question: "Dans ce tableau, clique sur la nature qui augmente l'Attaque et baisse la Vitesse.",
        image: "images/stats-natures.webp", alt: "Tableau des natures",
        zones: { brave: { nom: "Brave", rect: [81.7, 33.7, 94.1, 40.3] }, rigide: { nom: "Rigide", rect: [51.7, 33.7, 64.1, 40.3] }, timide: { nom: "Timide", rect: [21.7, 71.4, 34.1, 78] }, discret: { nom: "Discret", rect: [81.7, 52.6, 94.1, 59.2] } }, reponse: "brave",
        explication: "Ligne Attaque, colonne Vitesse : Brave. Utile pour un attaquant lent sous Distorsion." },
      { type: "choix", question: "Quelle nature donner à un attaquant spécial lent qui joue sous Distorsion ?",
        options: ["Discret (+Atq. Spé., −Vitesse)", "Timide (+Vitesse, −Attaque)", "Rigide (+Attaque, −Atq. Spé.)", "Jovial (+Vitesse, −Atq. Spé.)"], reponse: 0,
        explication: "Sous Distorsion, on veut être lent : on baisse la Vitesse et on renforce l'Atq. Spé." },
      { type: "choix", question: "Quelle stat sacrifie-t-on en général pour un attaquant physique ?",
        options: ["L'Atq. Spé.", "L'Attaque", "La Vitesse", "Les PV"], reponse: 0,
        explication: "Il n'utilise pas son Atq. Spé. : c'est la stat qu'on baisse." },
      { type: "vf", question: "Sérieux est une nature sans effet.",
        image: "images/stats-natures.webp", alt: "Tableau des natures", reponse: true,
        explication: "Sur la diagonale du tableau, la nature augmente et baisse la même stat : aucun effet." },

      // ----- Stats de base et investissement -----
      { type: "choix", question: "Qu'est-ce qu'une statistique de base ?",
        options: ["La valeur naturelle d'une espèce, la même pour tous ses Pokémon", "La stat après la nature", "Le nombre de points investis", "La stat au niveau 1"], reponse: 0,
        explication: "Elle définit l'espèce et ne peut pas être modifiée." },
      { type: "choix", question: "Avec une Vitesse de base de 61, Tyranocif est plutôt :",
        image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif",
        options: ["Lent, idéal sous Distorsion", "Très rapide", "Dans la moyenne haute", "Le plus rapide de l'équipe"], reponse: 0,
        explication: "61, c'est lent. D'où son intérêt dans une équipe avec Distorsion." },
      { type: "nombre", question: "Combien de points de stats faut-il répartir au total ?", reponse: 66,
        explication: "66 points sur Pokémon Champions." },
      { type: "nombre", question: "Une statistique peut recevoir au maximum combien de points ?", reponse: 32,
        explication: "32 points au maximum par statistique." },
      { type: "choix", question: "Quelle répartition correspond à un attaquant physique rapide ?",
        options: ["32 Attaque, 32 Vitesse, 2 PV", "32 PV, 32 Défense, 2 Déf. Spé.", "32 Atq. Spé., 32 PV, 2 Vitesse", "22 partout"], reponse: 0,
        explication: "On maximise l'Attaque et la Vitesse." },
      { type: "choix", question: "Sur Showdown (6v6 OU), comment s'appellent les points à répartir ?",
        options: ["Les EV", "Les crans", "Les PdV", "Les PP"], reponse: 0,
        explication: "510 EV, avec 252 au maximum par stat. Sur Champions, ce sont les points de stats." },

      // ----- Crans -----
      { type: "choix", question: "Quel multiplicateur pour une stat à +1 cran ?",
        options: ["×1,5", "×2", "×1,1", "×1,25"], reponse: 0, explication: "+1 cran = ×1,5." },
      { type: "choix", question: "Quel multiplicateur pour une stat à −2 crans ?",
        options: ["×0,5", "×0,67", "×0,25", "×0,8"], reponse: 0, explication: "−2 crans = ×0,5." },
      { type: "nombre", question: "De combien de crans Danse Lames augmente-t-elle l'Attaque ?",
        image: "images/capacites/apprendre-danse-lames.webp", alt: "Détail de Danse Lames", reponse: 2,
        explication: "Danse Lames : +2 crans d'Attaque." },
      { type: "choix", question: "Que se passe-t-il pour les crans d'un Pokémon qui quitte le terrain ?",
        options: ["Ils disparaissent", "Ils restent pour son retour", "Ils passent au Pokémon suivant", "Ils doublent"], reponse: 0,
        explication: "Les crans sont remis à zéro quand le Pokémon sort." },
      { type: "choix", question: "Sur cet écran, que signifie le ×0,67 à côté de la Vitesse de Farigiraf ?",
        image: "images/combat-effets-terrain.webp", alt: "Effets sur Farigiraf",
        options: ["Sa Vitesse a perdu 1 cran", "Sa Vitesse a perdu 67 %", "Sa Vitesse a gagné 1 cran", "Il lui reste 67 % de ses PV"], reponse: 0,
        explication: "−1 cran = ×0,67 : il ne lui reste que les deux tiers de sa Vitesse." },

      // ----- Questions pièges -----
      { piege: true, type: "vf", question: "La nature peut augmenter les PV d'un Pokémon.", reponse: false,
        explication: "Piège : les natures touchent 5 stats, jamais les PV." },
      { piege: true, type: "choix", question: "Danse Lames utilisée deux fois de suite (+4 crans). Quel multiplicateur pour l'Attaque ?",
        options: ["×3", "×4", "×5", "×2,5"], reponse: 0,
        explication: "Piège : +4 crans = ×3. Le ×4 n'arrive qu'à +6." },
      { piege: true, type: "vf", question: "Le 182 en Attaque affiché pour Carchacrok est sa statistique de base.",
        image: "images/stats-entrainement.webp", alt: "Écran d'entraînement de Carchacrok", reponse: false,
        explication: "Piège : sa stat de base est 130. 182 est la valeur finale, avec le niveau et les 32 points investis." },
      { piege: true, type: "choix", question: "Intimidation, puis Danse Lames. Où en est l'Attaque du Pokémon ?",
        options: ["+1 cran (×1,5)", "+2 crans (×2)", "+3 crans", "0 cran"], reponse: 0,
        explication: "Piège : −1 puis +2, ça fait +1 cran au total, donc ×1,5." },
      { piege: true, type: "vf", question: "Avec 32 points en Vitesse, un Pokémon est forcément plus rapide qu'un Pokémon qui n'en a aucun.", reponse: false,
        explication: "Piège : les points s'ajoutent à la stat de base. Un Pokémon lent avec 32 points peut rester plus lent qu'un Pokémon très rapide qui n'en a aucun." },
      { piege: true, type: "choix", question: "Quelle nature est inutile pour Oratoria (attaquante spéciale) ?",
        image: "images/oratoria-equipe-stats.webp", alt: "Stats d'Oratoria",
        options: ["Rigide", "Modeste", "Calme", "Discret"], reponse: 0,
        explication: "Piège : Rigide augmente l'Attaque (inutile pour elle) et baisse l'Atq. Spé., sa stat la plus importante." }
    ]
  },
  {
    id: "attaques", titre: "Les capacités",
    objectifs: [
      "Distinguer movepool et set",
      "Reconnaître les catégories physique, spéciale et statut",
      "Lire la fiche d'une capacité : puissance, précision, PP, effets",
      "Comprendre le STAB, la priorité et les cibles"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "movepool",
        titre: "Movepool et set",
        texte: `
<p>Les « attaques » d'un Pokémon s'appellent des <strong>capacités</strong> : c'est le terme du jeu, et celui qu'on utilise dans tous les cours. Chaque Pokémon peut en apprendre beaucoup, mais il n'en utilise que <strong>4</strong> en combat.</p>
<ul>
<li>Le <strong>movepool</strong>, c'est la liste de toutes les capacités qu'un Pokémon peut apprendre.</li>
<li>Le <strong>set</strong>, ce sont les 4 capacités que tu choisis dans ce movepool (avec le talent, la nature et l'objet).</li>
</ul>
${capture({
  src: "images/apprendre-capacite.webp",
  alt: "Écran d'apprentissage d'une capacité dans Pokémon Champions",
  reperes: [
    { x: 4.5, y: 35.6, texte: "La liste des capacités que le Pokémon peut apprendre : c'est son <strong>movepool</strong>. On peut la trier par type." },
    { x: 95.5, y: 24, texte: "Le <strong>détail</strong> de la capacité sélectionnée (ici Danse Lames)." },
    { x: 52, y: 7.2, texte: "La capacité actuellement à cette place, qui sera remplacée (ici Séisme)." },
    { x: 33, y: 91.7, texte: "Le <strong>coût</strong> du changement, en PdV (la monnaie du jeu)." }
  ],
  legende: "L'écran « Choisissez la capacité à apprendre » de Pokémon Champions."
})}
<h2>Bien choisir ses 4 capacités</h2>
<p>Avec seulement 4 places, chaque capacité doit avoir une utilité claire. Un set équilibré contient souvent :</p>
<ul>
<li>une ou deux capacités offensives <strong>du type du Pokémon</strong> (tu verras pourquoi avec le STAB) ;</li>
<li>une capacité d'un autre type, pour toucher les Pokémon qui résistent aux premières : c'est la <strong>couverture</strong> ;</li>
<li>une capacité utilitaire : protection (Abri), statut, soutien…</li>
</ul>
<p>Exemple, Métalosse (Acier / Psy) : Tête de Fer et Pisto-Poing pour le type Acier, Poing Éclair et Poing Glace pour la couverture.</p>
<div class="boutons-caps">
<img src="images/capacites/bouton-poing-eclair.webp" alt="Poing Éclair"><img src="images/capacites/bouton-pisto-poing.webp" alt="Pisto-Poing"><img src="images/capacites/bouton-poing-glace.webp" alt="Poing Glace"><img src="images/capacites/bouton-tete-de-fer.webp" alt="Tête de Fer">
</div>
<div class="astuce"><b>Astuce :</b> le nombre à droite de chaque capacité, ce sont ses <strong>PP</strong> : combien de fois tu peux l'utiliser dans le combat. Tu les verras dans la leçon 3.</div>
<div class="format"><b>Important :</b> il existe plus de 900 capacités. Ce cours ne peut pas toutes les présenter : il t'apprend à les lire et à les comprendre, avec les plus courantes comme exemples. Quand tu crées ton équipe, c'est à toi de bien te renseigner sur les capacités de tes Pokémon et sur celles que tu risques d'affronter.</div>
<p>Retrouve les capacités vues dans ce cours, avec leur type, leur catégorie et leur effet :</p>
${repertoireCapacites()}`,
        exercices: [
          {
            type: "zones",
            enonce: "Sur l'écran d'apprentissage, trouve chaque élément.",
            image: "images/apprendre-capacite.webp", alt: "Écran d'apprentissage d'une capacité",
            zones: {
              liste: { nom: "la liste des capacités (le movepool)", rect: [4, 22, 41, 84] },
              detail: { nom: "le détail de la capacité sélectionnée", rect: [46, 21, 97, 80] },
              cout: { nom: "le coût du changement", rect: [32, 86, 68, 97] }
            },
            cibles: ["liste", "detail", "cout"],
            commentaire: "La liste à gauche, c'est le movepool. Le Pokémon n'en gardera que 4 dans son set."
          },
          {
            type: "situation",
            enonce: "Métalosse (Acier / Psy) a Tête de Fer, Pisto-Poing, Poing Éclair et Poing Glace. Pourquoi Poing Éclair et Poing Glace ?",
            image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
            options: [
              { texte: "Pour toucher les Pokémon qui résistent à l'Acier (couverture).", bon: true, commentaire: "Oui : par exemple Poing Éclair frappe les Pokémon Eau, qui résistent à l'Acier." },
              { texte: "Parce qu'il faut 4 types différents.", bon: false, commentaire: "Non, aucune règle n'impose ça. C'est un choix stratégique." },
              { texte: "Parce qu'elles sont prioritaires.", bon: false, commentaire: "Non : la seule capacité prioritaire de ce set est Pisto-Poing." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Qu'est-ce que le movepool d'un Pokémon ?",
            options: ["Toutes les capacités qu'il peut apprendre", "Les 4 capacités de son set", "Ses capacités prioritaires", "Les capacités de son type"], reponse: 0,
            explication: "Le movepool, c'est toute la liste. Le set, ce sont les 4 capacités choisies dedans." },
          { type: "nombre", question: "Combien de capacités un Pokémon peut-il avoir dans son set ?", reponse: 4,
            explication: "4 capacités, choisies dans son movepool." },
          { type: "vf", question: "Une capacité de statut occupe une des 4 places du set, comme une capacité offensive.", reponse: true,
            explication: "Abri, Plénitude ou Pics Toxik occupent une des 4 places, comme Séisme ou Draco-Météore." },
          { type: "choix", question: "Qu'appelle-t-on la « couverture » d'un set ?",
            options: ["Des capacités d'autres types pour toucher ceux qui résistent", "Les capacités de protection comme Abri", "Le nombre de PP", "Les capacités qui touchent plusieurs cibles"], reponse: 0,
            explication: "La couverture permet de toucher les Pokémon qui résistent aux capacités du type principal." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "categories",
        titre: "Physique, spécial, statut",
        texte: `
<p>Chaque capacité appartient à une <strong>catégorie</strong>. Le jeu l'indique avec une icône, en haut à gauche de sa fiche :</p>
<div class="cats">
<span class="cat"><img src="images/capacites/categorie-physique.webp" alt="">Physique</span>
<span class="cat"><img src="images/capacites/categorie-special.webp" alt="">Spéciale</span>
<span class="cat"><img src="images/capacites/categorie-statut.webp" alt="">Statut</span>
</div>
<table>
<tr><th>Catégorie</th><th>Dégâts calculés avec</th><th>Exemple</th></tr>
<tr><td><strong>Physique</strong></td><td>l'Attaque du lanceur contre la Défense de la cible</td><td>Séisme</td></tr>
<tr><td><strong>Spéciale</strong></td><td>l'Atq. Spé. du lanceur contre la Déf. Spé. de la cible</td><td>Draco-Météore</td></tr>
<tr><td><strong>Statut</strong></td><td>aucun dégât : elle a un autre effet (statut, stats, terrain, soin…)</td><td>Feu Follet</td></tr>
</table>
${diaporama({ etapes: [
  { src: "images/capacites/fiche-seisme.webp", alt: "Fiche de Séisme", titre: "Physique : Séisme", texte: "Icône en forme d'étoile. Les dégâts dépendent de l'Attaque du lanceur." },
  { src: "images/capacites/fiche-draco-meteore.webp", alt: "Fiche de Draco-Météore", titre: "Spéciale : Draco-Météore", texte: "Icône en forme de cercles. Les dégâts dépendent de l'Atq. Spé. du lanceur." },
  { src: "images/capacites/fiche-feu-follet.webp", alt: "Fiche de Feu Follet", titre: "Statut : Feu Follet", texte: "Pas de puissance : Feu Follet ne fait aucun dégât, il brûle l'adversaire." }
] })}
<h2>Pourquoi c'est important</h2>
<ul>
<li>Un Pokémon avec une grosse Attaque doit utiliser des capacités <strong>physiques</strong>, un Pokémon avec une grosse Atq. Spé. des capacités <strong>spéciales</strong>.</li>
<li>Certains effets ne touchent qu'une catégorie. <strong>Intimidation</strong> et la <strong>brûlure</strong> affaiblissent les capacités physiques, mais pas les spéciales.</li>
<li>Les capacités de <strong>statut</strong> ne font pas de dégâts, mais peuvent changer un combat : Danse Lames (+2 crans d'Attaque), Plénitude (+1 cran d'Atq. Spé. et de Déf. Spé.), Zénith (soleil), Pics Toxik (piège), Abri (protection)…</li>
</ul>
<h2>Les capacités des Pokémon de ce cours</h2>
<table>
<tr><th>Physiques</th><th>Spéciales</th><th>Statut</th></tr>
<tr><td>Aqua-Jet, Éboulement, Balayage, Sabotage, Poing Éclair, Pisto-Poing, Poing Glace, Tête de Fer, Frotte-Frimousse, Balayette, Génusection, Coup Bas, Eau Revoir</td><td>Mégaphone, Pouvoir Lunaire, Dissonance Psy, Vampibaiser, Draco-Météore, Cradovague</td><td>Abri, Plénitude, Pics Toxik</td></tr>
</table>
<div class="piege"><b>Piège à éviter :</b> la catégorie ne dépend pas du type. Une capacité Eau peut être physique (Aqua-Jet) ou spéciale (Surf). Il faut regarder l'icône de chaque capacité.</div>
<p>Dans le répertoire, tu peux filtrer les capacités par catégorie et par type :</p>
${repertoireCapacites()}`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque icône à sa catégorie.",
            paires: [
              [{ img: "images/capacites/categorie-physique.webp", alt: "Icône en étoile" }, "Physique"],
              [{ img: "images/capacites/categorie-special.webp", alt: "Icône en cercles" }, "Spéciale"],
              [{ img: "images/capacites/categorie-statut.webp", alt: "Icône en spirale" }, "Statut"]
            ],
            commentaire: "Étoile pour physique, cercles pour spéciale, spirale pour statut."
          },
          {
            type: "situation",
            enonce: "Félinferno vient d'entrer avec Intimidation. Lequel de ces Pokémon adverses est le moins gêné ?",
            options: [
              { texte: "Oratoria, qui attaque avec Pouvoir Lunaire et Mégaphone", bon: true, commentaire: "Oui : ce sont des capacités spéciales. Intimidation baisse l'Attaque, qui ne sert qu'aux capacités physiques." },
              { texte: "Tyranocif, qui attaque avec Éboulement et Sabotage", bon: false, commentaire: "Non : ce sont des capacités physiques, Tyranocif est très gêné." },
              { texte: "Scalpereur, qui attaque avec Génusection et Coup Bas", bon: false, commentaire: "Non : ce sont des capacités physiques." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Quelle catégorie représente cette icône ?",
            image: "images/capacites/categorie-special.webp", alt: "Icône de catégorie", imagePetite: true,
            options: ["Spéciale", "Physique", "Statut"], reponse: 0,
            explication: "Les cercles indiquent une capacité spéciale." },
          { type: "choix", question: "Avec quelle statistique du lanceur sont calculés les dégâts d'une capacité physique ?",
            options: ["L'Attaque", "L'Atq. Spé.", "La Défense", "La Vitesse"], reponse: 0,
            explication: "Physique : Attaque du lanceur contre Défense de la cible." },
          { type: "vf", question: "Une capacité de statut fait des dégâts.", reponse: false,
            explication: "Une capacité de statut ne fait aucun dégât : elle a un autre effet." },
          { piege: true, type: "vf", question: "Toutes les capacités de type Eau sont spéciales.", reponse: false,
            explication: "Piège : la catégorie ne dépend pas du type. Aqua-Jet est une capacité Eau physique." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "caracteristiques",
        titre: "Puissance, précision, PP et effets",
        texte: `
<p>Chaque capacité a une fiche qui résume ses caractéristiques. Voici celle de Draco-Météore :</p>
${capture({
  src: "images/capacites/fiche-draco-meteore.webp",
  alt: "Fiche de Draco-Météore",
  reperes: [
    { x: 27, y: 40, texte: "La <strong>catégorie</strong> (ici spéciale)." },
    { x: 57, y: 40, texte: "La <strong>puissance</strong> : plus elle est haute, plus la capacité fait de dégâts (ici 130, c'est énorme)." },
    { x: 86, y: 40, texte: "La <strong>précision</strong> : les chances de toucher, en % (ici 90 : elle rate 1 fois sur 10)." },
    { x: 92, y: 53.8, texte: "La <strong>cible</strong> : qui la capacité touche (leçon 6)." },
    { x: 76, y: 69.4, texte: "L'<strong>effet</strong> : ici, la contrepartie de sa grosse puissance, l'Atq. Spé. du lanceur baisse de 2 crans." }
  ],
  legende: "La fiche d'une capacité dans Pokémon Champions."
})}
<h2>Puissance et précision</h2>
<ul>
<li>Une puissance « - » signifie que la capacité ne fait pas de dégâts (statut) ou que ses dégâts sont calculés autrement (Balayage, par exemple, dépend du poids de la cible).</li>
<li>Une précision « - » signifie que la capacité ne peut pas rater, ou n'a pas besoin de toucher (comme Abri ou Piège de Roc).</li>
<li>Une capacité très puissante a souvent une contrepartie : une précision plus basse, ou un effet négatif pour le lanceur, comme Draco-Météore.</li>
</ul>
<h2>Les PP</h2>
<p>Les <strong>PP</strong> (points de pouvoir) indiquent combien de fois on peut utiliser la capacité dans un combat. Ils sont affichés à droite de chaque capacité : Draco-Météore 8, Abri 8, Mégaphone 12, Aqua-Jet 20…</p>
<h2>Les effets et les mentions</h2>
<p>Sous la description, le jeu affiche parfois des <strong>mentions</strong> qui comptent pour d'autres règles :</p>
${capture({
  src: "images/capacites/fiche-vitesse-extreme.webp",
  alt: "Fiche de Vitesse Extrême",
  petite: true,
  reperes: [
    { x: 17, y: 76, texte: "<strong>Contact</strong> : le lanceur touche la cible. Ça déclenche des talents comme Point Poison ou Peau Dure." },
    { x: 38.5, y: 76, texte: "<strong>Priorité +2</strong> : la capacité passe avant les autres (leçon 5)." }
  ],
  legende: "Vitesse Extrême : capacité physique de contact, avec une priorité de +2."
})}
<table>
<tr><th>Mention</th><th>Ce qu'elle implique</th></tr>
<tr><td>Contact</td><td>Déclenche Point Poison, Peau Dure, Casque Brut…</td></tr>
<tr><td>Son</td><td>Concernée par Hydrata-Son ; traverse le clone créé par Clonage</td></tr>
<tr><td>Priorité</td><td>Passe avant les capacités sans priorité</td></tr>
<tr><td>Soin</td><td>Soigne le lanceur, comme Synthèse</td></tr>
<tr><td>Danse</td><td>Une capacité de danse, comme Danse Lames</td></tr>
</table>`,
        exercices: [
          {
            type: "zones",
            enonce: "Sur la fiche de Draco-Météore, trouve chaque caractéristique.",
            image: "images/capacites/fiche-draco-meteore.webp", alt: "Fiche de Draco-Météore",
            zones: {
              categorie: { nom: "la catégorie", rect: [5, 30, 34, 48] },
              puissance: { nom: "la puissance", rect: [35, 30, 64, 48] },
              precision: { nom: "la précision", rect: [65, 30, 94, 48] },
              cible:     { nom: "la cible", rect: [35, 48, 94, 60] },
              effet:     { nom: "l'effet", rect: [5, 62, 95, 78] }
            },
            cibles: ["puissance", "precision", "effet"],
            commentaire: "Puissance 130, précision 90, et un effet : l'Atq. Spé. du lanceur baisse de 2 crans."
          },
          {
            type: "situation",
            enonce: "Feu Follet a une précision de 85. Qu'est-ce que ça veut dire ?",
            image: "images/capacites/fiche-feu-follet.webp", alt: "Fiche de Feu Follet",
            options: [
              { texte: "Elle touche 85 fois sur 100 en moyenne.", bon: true, commentaire: "Oui : elle rate environ 15 % du temps." },
              { texte: "Elle fait 85 de dégâts.", bon: false, commentaire: "Non : c'est la précision, pas la puissance. Feu Follet ne fait d'ailleurs aucun dégât (statut)." },
              { texte: "On peut l'utiliser 85 fois.", bon: false, commentaire: "Non : ce sont les PP qui indiquent le nombre d'utilisations." }
            ]
          }
        ],
        quiz: [
          { type: "nombre", question: "Quelle est la puissance de Séisme ?",
            image: "images/capacites/fiche-seisme.webp", alt: "Fiche de Séisme", reponse: 100,
            explication: "La fiche de Séisme indique une puissance de 100." },
          { type: "choix", question: "Que signifient les PP d'une capacité ?",
            options: ["Le nombre de fois qu'on peut l'utiliser", "Sa puissance", "Sa précision", "Sa priorité"], reponse: 0,
            explication: "Les PP indiquent combien de fois on peut utiliser la capacité dans un combat." },
          { type: "choix", question: "Que fait Draco-Météore au lanceur après la capacité ?",
            image: "images/capacites/fiche-draco-meteore.webp", alt: "Fiche de Draco-Météore",
            options: ["Baisse son Atq. Spé. de 2 crans", "Augmente son Atq. Spé. de 2 crans", "Le soigne", "Rien"], reponse: 0,
            explication: "C'est la contrepartie de sa puissance de 130." },
          { type: "vf", question: "Une capacité avec la mention « Contact » peut déclencher Point Poison.", reponse: true,
            explication: "Point Poison réagit aux capacités de contact." }
        ]
      },

      // ---------------- Leçon 4 ----------------
      {
        id: "stab",
        titre: "Le STAB",
        texte: `
<p>Le <strong>STAB</strong> (<em>Same Type Attack Bonus</em>) est un bonus de <strong>×1,5</strong> sur les dégâts d'une capacité du même type que le Pokémon qui l'utilise.</p>
<table>
<tr><th>Pokémon</th><th>Capacité</th><th>STAB ?</th></tr>
<tr><td>Dracolosse ${type("dragon")} ${type("vol")}</td><td>Draco-Météore ${type("dragon")}</td><td>Oui, ×1,5</td></tr>
<tr><td>Dracolosse ${type("dragon")} ${type("vol")}</td><td>Vitesse Extrême ${type("normal")}</td><td>Non</td></tr>
<tr><td>Métalosse ${type("acier")} ${type("psy")}</td><td>Tête de Fer ${type("acier")}</td><td>Oui, ×1,5</td></tr>
<tr><td>Métalosse ${type("acier")} ${type("psy")}</td><td>Poing Glace ${type("glace")}</td><td>Non</td></tr>
</table>
<h2>STAB et efficacité se multiplient</h2>
<p>Le STAB s'ajoute à l'efficacité du cours sur les types. Par exemple, Pouvoir Lunaire (${type("fee")}) lancé par Oratoria (Eau / Fée) sur un Pokémon ${type("dragon")} : ×1,5 (STAB) × ×2 (faible) = <strong>×3</strong>.</p>
<p>C'est pour ça qu'on donne en priorité à un Pokémon des capacités de son propre type : elles frappent plus fort. Les capacités d'autres types servent surtout à la couverture.</p>
<div class="astuce"><b>Rappel :</b> un talent peut changer le type d'une capacité. Avec Hydrata-Son, le Mégaphone d'Oratoria devient de type Eau… et profite donc du STAB.</div>
<div class="piege"><b>Piège à éviter :</b> le STAB dépend du type du <strong>lanceur</strong>, pas de la cible. Et une capacité de statut ne fait pas de dégâts : le STAB ne la concerne pas.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Métalosse affronte un Pokémon de type Glace. Quelle capacité lui fait le plus de dégâts ?",
            image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
            options: [
              { texte: "Poing Glace", bon: false, commentaire: "Non : la Glace est résistante face à la Glace (×0,5), et pas de STAB." },
              { texte: "Poing Éclair", bon: false, commentaire: "Neutre (×1), sans STAB : correct, mais il y a mieux." },
              { texte: "Tête de Fer", bon: true, commentaire: "Oui : la Glace est faible face à l'Acier (×2), et Métalosse est Acier (STAB ×1,5) : ×3." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Combien vaut le bonus de STAB ?",
            options: ["×1,5", "×2", "×1,2", "×3"], reponse: 0,
            explication: "Le STAB multiplie les dégâts par 1,5." },
          { type: "vf", question: "Vitesse Extrême (Normal) utilisée par Dracolosse (Dragon / Vol) profite du STAB.", reponse: false,
            explication: "Dracolosse n'est pas de type Normal : pas de STAB." },
          { type: "choix", question: "Pouvoir Lunaire (Fée), lancé par Oratoria (Eau / Fée) sur un Pokémon Dragon : quel multiplicateur au total ?",
            options: ["×3", "×2", "×1,5", "×4"], reponse: 0,
            explication: "×1,5 (STAB) × ×2 (Dragon faible face à la Fée) = ×3." },
          { piege: true, type: "vf", question: "Le STAB dépend du type de la cible.", reponse: false,
            explication: "Piège : le STAB dépend du type du lanceur. Le type de la cible, c'est l'efficacité." }
        ]
      },

      // ---------------- Leçon 5 ----------------
      {
        id: "priorite",
        titre: "La priorité",
        texte: `
<p>Tu l'as vu dans le cours 1 : à chaque tour, les capacités sont exécutées par ordre de <strong>priorité</strong>, puis de Vitesse. La plupart ont une priorité de 0, mais certaines ont un bonus (ou un malus).</p>
<table>
<tr><th>Priorité</th><th>Exemples</th></tr>
<tr><td>+4</td><td>Abri</td></tr>
<tr><td>+3</td><td>Bluff</td></tr>
<tr><td>+2</td><td>Vitesse Extrême</td></tr>
<tr><td>+1</td><td>Aqua-Jet, Pisto-Poing, Coup Bas, Vive-Attaque</td></tr>
<tr><td>0</td><td>La grande majorité des capacités</td></tr>
<tr><td>−7</td><td>Distorsion</td></tr>
</table>
<p>Le jeu l'indique sur la fiche de la capacité, avec une mention « Priorité » :</p>
${capture({
  src: "images/capacites/apprendre-abri.webp",
  alt: "Détail d'Abri sur l'écran d'apprentissage",
  reperes: [
    { x: 61.5, y: 62.7, texte: "<strong>Priorité +4</strong> : Abri passe avant presque tout." },
    { x: 96.5, y: 44, texte: "La règle d'Abri : à chaque utilisation consécutive, ses chances de réussite tombent à 1/3 de la fois précédente." }
  ],
  legende: "Le détail d'Abri : c'est pour ça qu'on évite de l'utiliser deux tours de suite."
})}
<h2>À quoi sert la priorité</h2>
<ul>
<li><strong>Achever</strong> un adversaire plus rapide qui n'a plus beaucoup de PV (Aqua-Jet, Pisto-Poing…).</li>
<li><strong>Se protéger</strong> à coup sûr avant la capacité adverse (Abri).</li>
<li><strong>Coup Bas</strong> est particulière : elle ne réussit que si la cible s'apprête à utiliser une capacité offensive.</li>
</ul>
<div class="piege"><b>Piège à éviter :</b> certains talents bloquent les capacités prioritaires. Armure Caudale (Farigiraf) les empêche contre son camp, et un Pokémon Ténèbres est immunisé contre les capacités de statut rendues prioritaires par Farceur.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "L'adversaire, plus rapide que Scalpereur, n'a presque plus de PV et s'apprête à attaquer. Quelle capacité choisis-tu ?",
            image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur",
            options: [
              { texte: "Génusection", bon: false, commentaire: "Puissante, mais sans priorité : l'adversaire, plus rapide, attaquera avant." },
              { texte: "Coup Bas", bon: true, commentaire: "Oui : priorité +1, elle passe avant l'adversaire. Et comme il s'apprête à attaquer, Coup Bas réussit." },
              { texte: "Balayette", bon: false, commentaire: "Sans priorité : trop tard." }
            ]
          }
        ],
        quiz: [
          { type: "nombre", question: "Quelle est la priorité de Vitesse Extrême ?",
            image: "images/capacites/fiche-vitesse-extreme.webp", alt: "Fiche de Vitesse Extrême", reponse: 2,
            explication: "La fiche indique « Priorité +2 »." },
          { type: "choix", question: "Que se passe-t-il si on utilise Abri plusieurs tours de suite ?",
            image: "images/capacites/apprendre-abri.webp", alt: "Détail d'Abri",
            options: ["Ses chances de réussite tombent à chaque fois", "Il dure plus longtemps", "Il protège aussi le partenaire", "Rien de spécial"], reponse: 0,
            explication: "À chaque utilisation consécutive, les chances tombent à 1/3 de la fois précédente." },
          { type: "choix", question: "Laquelle de ces capacités a la priorité la plus haute ?",
            options: ["Abri", "Vitesse Extrême", "Aqua-Jet", "Séisme"], reponse: 0,
            explication: "Abri +4, Vitesse Extrême +2, Aqua-Jet +1, Séisme 0." },
          { piege: true, type: "vf", question: "Coup Bas réussit toujours, puisqu'elle est prioritaire.", reponse: false,
            explication: "Piège : Coup Bas échoue si la cible ne s'apprête pas à utiliser une capacité offensive." }
        ]
      },

      // ---------------- Leçon 6 ----------------
      {
        id: "cibles",
        titre: "Les cibles",
        texte: `
<p>La fiche de chaque capacité indique sa <strong>cible</strong>. C'est surtout important en combat double, où il y a 4 Pokémon sur le terrain.</p>
<table>
<tr><th>Cible</th><th>Ce que ça touche</th><th>Exemple</th></tr>
<tr><td>Cible unique</td><td>Un seul Pokémon, choisi par toi</td><td>Draco-Météore, Feu Follet</td></tr>
<tr><td>Les adversaires</td><td>Les deux Pokémon adverses</td><td>Éboulement, Mégaphone</td></tr>
<tr><td>Tous les Pokémon</td><td>Tous les autres Pokémon, <strong>y compris ton partenaire</strong></td><td>Séisme, Cradovague</td></tr>
<tr><td>Côté adverse</td><td>Le camp adverse (pas un Pokémon précis)</td><td>Piège de Roc, Pics Toxik</td></tr>
<tr><td>Lanceur</td><td>Le Pokémon qui utilise la capacité</td><td>Abri, Synthèse, Danse Lames</td></tr>
<tr><td>Tout le terrain</td><td>Les deux camps</td><td>Zénith</td></tr>
</table>
${diaporama({ etapes: [
  { src: "images/capacites/fiche-seisme.webp", alt: "Fiche de Séisme", titre: "Tous les Pokémon : Séisme", texte: "Attention : en combat double, Séisme touche aussi ton partenaire ! Associe-le à un partenaire de type Vol, ou avec Lévitation." },
  { src: "images/capacites/fiche-piege-de-roc.webp", alt: "Fiche de Piège de Roc", titre: "Côté adverse : Piège de Roc", texte: "Pas de Pokémon visé : le piège est posé dans le camp adverse et touchera chaque Pokémon qui y entre." },
  { src: "images/capacites/fiche-synthese.webp", alt: "Fiche de Synthèse", titre: "Lanceur : Synthèse", texte: "Le lanceur se soigne lui-même. Note l'effet de la météo : 2/3 des PV au soleil, 1/4 sous une autre météo." },
  { src: "images/capacites/apprendre-zenith.webp", alt: "Détail de Zénith", titre: "Tout le terrain : Zénith", texte: "Le soleil touche tout le terrain, pendant 5 tours." },
  { src: "images/capacites/apprendre-clonage.webp", alt: "Détail de Clonage", titre: "Lanceur : Clonage", texte: "Le lanceur perd 1/4 de ses PV max et crée un clone qui encaisse à sa place. Mais les capacités de son (comme Mégaphone) le traversent." }
] })}
<h2>Les capacités à plusieurs cibles</h2>
<p>En combat double, une capacité qui touche <strong>plusieurs Pokémon</strong> voit ses dégâts réduits à <strong>×0,75</strong> sur chacun. Elles mettent la pression sur tout le camp adverse, mais frappent un peu moins fort qu'une capacité à cible unique.</p>
<h2>Se renseigner : c'est à toi de jouer</h2>
<p>Lors de la création de ton équipe, prends l'habitude de lire la fiche complète de chaque capacité (catégorie, puissance, précision, cible, effet), dans le jeu ou sur Poképédia. Une capacité qui touche ton partenaire ou qui baisse tes stats peut ruiner un plan.</p>
${repertoireCapacites()}
<div class="format"><b>Ça dépend du format :</b> en 3v3 et en 6v6 OU (combat simple), la question se pose beaucoup moins : il n'y a qu'un adversaire et pas de partenaire. Séisme ne touche alors que l'adversaire.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "En combat double, ton Carchacrok veut utiliser Séisme. Son partenaire est Métalosse (Acier / Psy). Quel est le problème ?",
            image: "images/capacites/fiche-seisme.webp", alt: "Fiche de Séisme",
            options: [
              { texte: "Séisme va aussi toucher Métalosse, qui est faible face au Sol.", bon: true, commentaire: "Exactement : « Tous les Pokémon » inclut le partenaire, et le type Acier est faible face au Sol." },
              { texte: "Aucun problème, Séisme ne touche que les adversaires.", bon: false, commentaire: "Non : regarde la cible, « Tous les Pokémon »." },
              { texte: "Séisme ne fera aucun dégât en combat double.", bon: false, commentaire: "Non : ses dégâts sont réduits (×0,75), pas annulés." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Quelle est la cible de Piège de Roc ?",
            image: "images/capacites/fiche-piege-de-roc.webp", alt: "Fiche de Piège de Roc",
            options: ["Le côté adverse", "Cible unique", "Le lanceur", "Tous les Pokémon"], reponse: 0,
            explication: "Piège de Roc se pose sur le côté adverse." },
          { type: "vf", question: "En combat double, Séisme touche aussi le partenaire du lanceur.", reponse: true,
            explication: "Sa cible est « Tous les Pokémon »." },
          { type: "choix", question: "En combat double, une capacité qui touche les deux adversaires fait :",
            options: ["×0,75 de dégâts sur chacun", "×1 sur chacun", "×0,5 sur chacun", "×1,5 sur chacun"], reponse: 0,
            explication: "Les dégâts des capacités à plusieurs cibles sont réduits à ×0,75." },
          { type: "choix", question: "Quelle est la cible de Synthèse ?",
            image: "images/capacites/fiche-synthese.webp", alt: "Fiche de Synthèse",
            options: ["Le lanceur", "Cible unique", "Tout le terrain", "Le partenaire"], reponse: 0,
            explication: "Synthèse soigne le lanceur lui-même." }
        ]
      }
    ],
    examen: [
      // ----- Choisir la bonne capacité (boutons) -----
      { type: "choix", question: "Kravarech veut poser un piège dans le camp adverse. Quelle capacité choisis-tu ?",
        image: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech",
        options: [{ img: "images/capacites/bouton-draco-meteore-k.webp", alt: "Draco-Météore" }, { img: "images/capacites/bouton-eau-revoir.webp", alt: "Eau Revoir" }, { img: "images/capacites/bouton-cradovague.webp", alt: "Cradovague" }, { img: "images/capacites/bouton-pics-toxik.webp", alt: "Pics Toxik" }], reponse: 3,
        explication: "Pics Toxik pose un piège dans le camp adverse : chaque Pokémon qui y entre est empoisonné." },
      { type: "choix", question: "Sorcilence veut augmenter son Atq. Spé. et sa Déf. Spé. Quelle capacité choisis-tu ?",
        image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
        options: [{ img: "images/capacites/bouton-frotte-frimousse.webp", alt: "Frotte-Frimousse" }, { img: "images/capacites/bouton-dissonance-psy.webp", alt: "Dissonance Psy" }, { img: "images/capacites/bouton-vampibaiser.webp", alt: "Vampibaiser" }, { img: "images/capacites/bouton-plenitude.webp", alt: "Plénitude" }], reponse: 3,
        explication: "Plénitude est une capacité de statut : +1 cran d'Atq. Spé. et de Déf. Spé." },
      { type: "choix", question: "Oratoria veut se protéger de toutes les capacités ce tour-ci. Quelle capacité choisis-tu ?",
        image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria",
        options: [{ img: "images/capacites/bouton-megaphone.webp", alt: "Mégaphone" }, { img: "images/capacites/bouton-pouvoir-lunaire.webp", alt: "Pouvoir Lunaire" }, { img: "images/capacites/bouton-aqua-jet.webp", alt: "Aqua-Jet" }, { img: "images/capacites/bouton-abri.webp", alt: "Abri" }], reponse: 3,
        explication: "Abri protège le lanceur de toutes les capacités adverses pendant le tour." },
      { type: "choix", question: "L'adversaire, plus rapide, n'a presque plus de PV et s'apprête à attaquer. Quelle capacité de Scalpereur passe avant lui ?",
        image: "images/scalpereur-fiche.webp", alt: "Fiche de Scalpereur",
        options: [{ img: "images/capacites/bouton-balayette.webp", alt: "Balayette" }, { img: "images/capacites/bouton-tete-de-fer-s.webp", alt: "Tête de Fer" }, { img: "images/capacites/bouton-genusection.webp", alt: "Génusection" }, { img: "images/capacites/bouton-coup-bas.webp", alt: "Coup Bas" }], reponse: 3,
        explication: "Coup Bas a une priorité de +1, et réussit puisque l'adversaire s'apprête à attaquer." },
      { type: "choix", question: "Métalosse affronte un Pokémon Glace. Quelle capacité lui fait le plus de dégâts ?",
        image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
        options: [{ img: "images/capacites/bouton-poing-eclair.webp", alt: "Poing Éclair" }, { img: "images/capacites/bouton-poing-glace.webp", alt: "Poing Glace" }, { img: "images/capacites/bouton-tete-de-fer.webp", alt: "Tête de Fer" }], reponse: 2,
        explication: "Tête de Fer : ×2 (Glace faible face à l'Acier) et STAB ×1,5." },
      { type: "choix", question: "Tyranocif affronte Métalosse (Acier / Psy). Quelle capacité lui fait le plus de dégâts ?",
        image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif",
        options: [{ img: "images/capacites/bouton-eboulement.webp", alt: "Éboulement" }, { img: "images/capacites/bouton-balayage.webp", alt: "Balayage" }, { img: "images/capacites/bouton-sabotage.webp", alt: "Sabotage" }], reponse: 2,
        explication: "Sabotage (Ténèbres) : ×2 contre Psy, ×1 contre Acier, et STAB car Tyranocif est Ténèbres. Éboulement ne fait que ×0,5, Balayage ×1." },
      { type: "choix", question: "Contre Métalosse, quelle capacité de Kravarech n'aura aucun effet ?",
        image: "images/metalosse-fiche.webp", alt: "Fiche de Métalosse",
        options: [{ img: "images/capacites/bouton-draco-meteore-k.webp", alt: "Draco-Météore" }, { img: "images/capacites/bouton-eau-revoir.webp", alt: "Eau Revoir" }, { img: "images/capacites/bouton-cradovague.webp", alt: "Cradovague" }], reponse: 2,
        explication: "Cradovague est de type Poison, et le type Acier est immunisé contre le Poison." },
      { type: "choix", question: "Intimidation vient de baisser l'Attaque de Scalpereur. Quelle capacité est affaiblie ?",
        options: [{ img: "images/capacites/bouton-genusection.webp", alt: "Génusection" }, { img: "images/capacites/bouton-dissonance-psy.webp", alt: "Dissonance Psy" }, { img: "images/capacites/bouton-cradovague.webp", alt: "Cradovague" }, { img: "images/capacites/bouton-plenitude.webp", alt: "Plénitude" }], reponse: 0,
        explication: "Génusection est physique : elle dépend de l'Attaque. Dissonance Psy et Cradovague sont spéciales, Plénitude est une capacité de statut." },
      { type: "multi", question: "Lesquelles de ces capacités sont des capacités de statut ?",
        options: [{ img: "images/capacites/bouton-abri.webp", alt: "Abri" }, { img: "images/capacites/bouton-plenitude.webp", alt: "Plénitude" }, { img: "images/capacites/bouton-pics-toxik.webp", alt: "Pics Toxik" }, { img: "images/capacites/bouton-coup-bas.webp", alt: "Coup Bas" }, { img: "images/capacites/bouton-pouvoir-lunaire.webp", alt: "Pouvoir Lunaire" }], reponses: [0, 1, 2],
        explication: "Abri, Plénitude et Pics Toxik ne font pas de dégâts. Coup Bas est physique, Pouvoir Lunaire spéciale." },
      { type: "multi", question: "Lesquelles de ces capacités sont prioritaires ?",
        options: [{ img: "images/capacites/bouton-aqua-jet.webp", alt: "Aqua-Jet" }, { img: "images/capacites/bouton-pisto-poing.webp", alt: "Pisto-Poing" }, { img: "images/capacites/bouton-coup-bas.webp", alt: "Coup Bas" }, { img: "images/capacites/bouton-tete-de-fer.webp", alt: "Tête de Fer" }, { img: "images/capacites/bouton-eboulement.webp", alt: "Éboulement" }], reponses: [0, 1, 2],
        explication: "Aqua-Jet, Pisto-Poing et Coup Bas ont une priorité de +1. Tête de Fer et Éboulement n'en ont pas." },
      { type: "multi", question: "En combat double, lesquelles de ces capacités touchent plusieurs Pokémon ?",
        options: [{ img: "images/capacites/bouton-eboulement.webp", alt: "Éboulement" }, { img: "images/capacites/bouton-megaphone.webp", alt: "Mégaphone" }, { img: "images/capacites/bouton-cradovague.webp", alt: "Cradovague" }, { img: "images/capacites/bouton-sabotage.webp", alt: "Sabotage" }, { img: "images/capacites/bouton-pouvoir-lunaire.webp", alt: "Pouvoir Lunaire" }], reponses: [0, 1, 2],
        explication: "Éboulement et Mégaphone touchent les deux adversaires, Cradovague touche même le partenaire. Sabotage et Pouvoir Lunaire visent une seule cible." },

      // ----- Fiches de capacités -----
      { type: "choix", question: "Quelle est la catégorie de cette capacité ?",
        image: "images/capacites/fiche-draco-meteore.webp", alt: "Fiche de Draco-Météore",
        options: ["Spéciale", "Physique", "Statut"], reponse: 0,
        explication: "L'icône en cercles indique une capacité spéciale." },
      { type: "choix", question: "Quelle est la catégorie de cette capacité ?",
        image: "images/capacites/fiche-seisme.webp", alt: "Fiche de Séisme",
        options: ["Physique", "Spéciale", "Statut"], reponse: 0,
        explication: "L'icône en étoile indique une capacité physique." },
      { type: "choix", question: "Quelle catégorie représente cette icône ?",
        image: "images/capacites/categorie-statut.webp", alt: "Icône de catégorie", imagePetite: true,
        options: ["Statut", "Physique", "Spéciale"], reponse: 0,
        explication: "La spirale indique une capacité de statut." },
      { type: "zone", question: "Sur cette fiche, clique sur la précision.",
        image: "images/capacites/fiche-draco-meteore.webp", alt: "Fiche de Draco-Météore",
        zones: { categorie: { nom: "la catégorie", rect: [5, 30, 34, 48] }, puissance: { nom: "la puissance", rect: [35, 30, 64, 48] }, precision: { nom: "la précision", rect: [65, 30, 94, 48] } }, reponse: "precision",
        explication: "La précision est la troisième case : 90." },
      { type: "nombre", question: "Quelle est la précision de Feu Follet ?",
        image: "images/capacites/fiche-feu-follet.webp", alt: "Fiche de Feu Follet", reponse: 85,
        explication: "La fiche indique une précision de 85." },
      { type: "nombre", question: "Quelle est la puissance de Vitesse Extrême ?",
        image: "images/capacites/fiche-vitesse-extreme.webp", alt: "Fiche de Vitesse Extrême", reponse: 80,
        explication: "La fiche indique une puissance de 80." },
      { type: "nombre", question: "De combien de crans Danse Lames augmente-t-elle l'Attaque du lanceur ?",
        image: "images/capacites/apprendre-danse-lames.webp", alt: "Détail de Danse Lames", reponse: 2,
        explication: "La description indique : « Augmente l'Attaque du lanceur de 2 crans »." },
      { type: "choix", question: "Quelle part de ses PV max Synthèse rend-elle quand le soleil brille ?",
        image: "images/capacites/fiche-synthese.webp", alt: "Fiche de Synthèse",
        options: ["2/3", "1/2", "1/4", "Tous"], reponse: 0,
        explication: "La moitié normalement, 2/3 au soleil, 1/4 sous une autre météo." },
      { type: "choix", question: "Combien de PV le lanceur perd-il en utilisant Clonage ?",
        image: "images/capacites/apprendre-clonage.webp", alt: "Détail de Clonage",
        options: ["1/4 de ses PV max", "La moitié", "Aucun", "1/8"], reponse: 0,
        explication: "Il perd 1/4 de ses PV max pour créer le clone." },
      { type: "choix", question: "Combien de tours dure le soleil invoqué par Zénith ?",
        image: "images/capacites/apprendre-zenith.webp", alt: "Détail de Zénith",
        options: ["5 tours", "3 tours", "8 tours", "Tout le combat"], reponse: 0,
        explication: "Zénith invoque le soleil pendant 5 tours." },
      { type: "choix", question: "Que signifie la mention « Contact » sur Vitesse Extrême ?",
        image: "images/capacites/fiche-vitesse-extreme.webp", alt: "Fiche de Vitesse Extrême",
        options: ["Le lanceur touche la cible, ce qui peut déclencher Point Poison ou Peau Dure", "La capacité ne peut pas rater", "La capacité touche les deux adversaires", "La capacité est prioritaire"], reponse: 0,
        explication: "Les capacités de contact déclenchent les talents et objets qui réagissent au contact." },
      { type: "choix", question: "Que vaut la priorité d'Abri ?",
        image: "images/capacites/apprendre-abri.webp", alt: "Détail d'Abri",
        options: ["+4", "+1", "+2", "0"], reponse: 0,
        explication: "Abri a une priorité de +4." },

      // ----- STAB, movepool -----
      { type: "vf", question: "Draco-Météore (Dragon) lancé par Kravarech (Poison / Dragon) profite du STAB.", reponse: true,
        explication: "Kravarech est de type Dragon : STAB ×1,5." },
      { type: "choix", question: "Qu'est-ce que le set d'un Pokémon, côté capacités ?",
        options: ["Les 4 capacités choisies dans son movepool", "Toutes les capacités qu'il peut apprendre", "Ses capacités de son type", "Ses capacités prioritaires"], reponse: 0,
        explication: "Le movepool, c'est toute la liste ; le set, ce sont les 4 choisies." },
      { type: "zone", question: "Sur cet écran, clique sur la liste des capacités que le Pokémon peut apprendre.",
        image: "images/apprendre-capacite.webp", alt: "Écran d'apprentissage",
        zones: { liste: { nom: "la liste (le movepool)", rect: [4, 22, 41, 84] }, detail: { nom: "le détail de la capacité", rect: [46, 21, 97, 80] } }, reponse: "liste",
        explication: "La liste de gauche, c'est le movepool." },

      // ----- Questions pièges -----
      { piege: true, type: "choix", question: "Scalpereur affronte Sorcilence (Psy / Fée). Quelle capacité lui fait le plus de dégâts ?",
        image: "images/sorcilence-fiche.webp", alt: "Fiche de Sorcilence",
        options: [{ img: "images/capacites/bouton-balayette.webp", alt: "Balayette" }, { img: "images/capacites/bouton-tete-de-fer-s.webp", alt: "Tête de Fer" }, { img: "images/capacites/bouton-genusection.webp", alt: "Génusection" }], reponse: 1,
        explication: "Piège : les Ténèbres frappent fort le Psy, mais le type Fée y est résistant (Génusection : ×1). Tête de Fer fait ×2 contre Fée, plus le STAB. Balayette ne fait que ×0,25." },
      { piege: true, type: "choix", question: "Oratoria affronte Kravarech (Poison / Dragon). Quelle capacité lui fait le plus de dégâts ?",
        image: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech",
        options: [{ img: "images/capacites/bouton-megaphone.webp", alt: "Mégaphone" }, { img: "images/capacites/bouton-pouvoir-lunaire.webp", alt: "Pouvoir Lunaire" }, { img: "images/capacites/bouton-aqua-jet.webp", alt: "Aqua-Jet" }], reponse: 1,
        explication: "Piège : Pouvoir Lunaire n'est que neutre (le Poison résiste à la Fée), mais Mégaphone (devenu Eau avec Hydrata-Son) et Aqua-Jet font ×0,5 contre le Dragon. Pouvoir Lunaire reste le meilleur choix." },
      { piege: true, type: "choix", question: "Sorcilence affronte Kravarech (Poison / Dragon). Quelle capacité lui fait le plus de dégâts ?",
        image: "images/kravarech-fiche.webp", alt: "Fiche de Kravarech",
        options: [{ img: "images/capacites/bouton-frotte-frimousse.webp", alt: "Frotte-Frimousse" }, { img: "images/capacites/bouton-dissonance-psy.webp", alt: "Dissonance Psy" }, { img: "images/capacites/bouton-vampibaiser.webp", alt: "Vampibaiser" }], reponse: 1,
        explication: "Piège : on pense à la Fée contre le Dragon, mais le Poison y est résistant. Dissonance Psy fait ×2 (le Poison est faible face au Psy), avec le STAB." },
      { piege: true, type: "vf", question: "Comme Aqua-Jet est de type Eau, c'est une capacité spéciale.", reponse: false,
        explication: "Piège : la catégorie ne dépend pas du type. Aqua-Jet est physique." },
      { piege: true, type: "vf", question: "En combat double, Séisme ne touche que les adversaires.",
        image: "images/capacites/fiche-seisme.webp", alt: "Fiche de Séisme", reponse: false,
        explication: "Piège : sa cible est « Tous les Pokémon », partenaire compris." },
      { piege: true, type: "vf", question: "Un clone créé par Clonage protège aussi des capacités de son, comme Mégaphone.",
        image: "images/capacites/apprendre-clonage.webp", alt: "Détail de Clonage", reponse: false,
        explication: "Piège : la description le dit, les capacités de son touchent la cible en ignorant le clone." },
      { piege: true, type: "vf", question: "Une précision « - » veut dire que la capacité rate toujours.", reponse: false,
        explication: "Piège : c'est l'inverse. « - » veut dire qu'elle ne peut pas rater, ou qu'elle n'a pas besoin de toucher (statut sur soi, piège…)." },
      { piege: true, type: "vf", question: "Le STAB s'applique aussi aux capacités de statut.", reponse: false,
        explication: "Piège : le STAB multiplie les dégâts. Une capacité de statut n'en fait pas." }
    ]
  },
  {
    id: "objets", titre: "Les objets",
    objectifs: [
      "Comprendre le rôle d'un objet tenu et ses règles",
      "Connaître les grandes familles d'objets",
      "Choisir un objet adapté au rôle d'un Pokémon",
      "Comprendre les Méga-Gemmes"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "role",
        titre: "Le rôle d'un objet",
        texte: `
<p>Chaque Pokémon peut tenir <strong>un seul objet</strong>. L'objet agit tout seul, sans action de ta part : il renforce le Pokémon, le protège, le soigne… ou lui permet de méga-évoluer.</p>
${capture({
  src: "images/objets/menu-orbe-vie.webp",
  alt: "Menu des objets dans Pokémon Champions",
  reperes: [
    { x: 2.5, y: 50, texte: "Les Pokémon de l'équipe, avec l'icône de l'objet qu'ils tiennent." },
    { x: 22, y: 14.9, texte: "Les <strong>catégories</strong> d'objets : Stats ↑, Puissance ↑, Défense, Soin… (on les suit dans ce cours)." },
    { x: 51, y: 40, texte: "La liste des objets de la catégorie." },
    { x: 96, y: 29, texte: "La <strong>description</strong> de l'objet sélectionné (ici Orbe Vie)." }
  ],
  legende: "Le menu de choix des objets dans Pokémon Champions, catégorie Puissance ↑."
})}
<h2>Les règles</h2>
<ul>
<li><strong>Un objet par Pokémon</strong>, au maximum.</li>
<li>L'objet est <strong>facultatif</strong>, mais un Pokémon sans objet se prive d'un avantage.</li>
<li>Certains objets ne servent <strong>qu'une fois</strong> par combat (baies, Ceinture Force…), d'autres agissent <strong>en continu</strong> (Restes, Orbe Vie…).</li>
</ul>
<div class="format"><b>Ça dépend du format :</b> en VGC, deux Pokémon de la même équipe ne peuvent pas tenir le même objet (tu l'as vu avec l'équipe du cours 1). En 6v6 OU sur Showdown, cette règle n'existe pas. Les objets disponibles changent aussi d'un jeu à l'autre : par exemple, le Bandeau Choix et les Lunettes Choix, très joués sur Showdown, n'existent pas sur Pokémon Champions : seul le Mouchoir Choix y est disponible.</div>
<div class="format"><b>Important :</b> il existe beaucoup d'objets, et ce cours présente les plus utiles. Quand tu crées ton équipe, lis la description de chaque objet dans le jeu ou dans la <a href="https://www.coupcritique.fr/entity/items" target="_blank" rel="noopener">liste complète sur Coup Critique</a> : c'est à toi de bien te renseigner, et de vérifier qu'un objet est disponible sur Pokémon Champions.</div>
${repertoireObjets()}`,
        exercices: [
          {
            type: "zones",
            enonce: "Sur le menu des objets, trouve chaque élément.",
            image: "images/objets/menu-orbe-vie.webp", alt: "Menu des objets",
            zones: {
              categories: { nom: "les catégories d'objets", rect: [23, 11.5, 97.5, 18.5] },
              liste:      { nom: "la liste des objets", rect: [23, 20, 52, 85] },
              description:{ nom: "la description de l'objet", rect: [53, 20, 97, 85] },
              equipe:     { nom: "les Pokémon de l'équipe", rect: [3, 11, 22, 96] }
            },
            cibles: ["description", "categories", "equipe"],
            commentaire: "Lis toujours la description : elle donne les chiffres exacts (×1,3, 1/10 des PV…)."
          },
          {
            type: "situation",
            enonce: "En VGC, Oratoria tient déjà des Restes. Peux-tu en donner aussi à Félinferno ?",
            image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
            options: [
              { texte: "Non, deux Pokémon ne peuvent pas tenir le même objet.", bon: true, commentaire: "Exactement : en VGC, chaque objet ne peut être tenu qu'une fois dans l'équipe." },
              { texte: "Oui, sans problème.", bon: false, commentaire: "Pas en VGC. En 6v6 OU sur Showdown, ce serait possible." },
              { texte: "Oui, mais seulement si Félinferno est de type Feu.", bon: false, commentaire: "Non, le type n'a rien à voir." }
            ]
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien d'objets un Pokémon peut-il tenir au maximum ?", reponse: 1,
            explication: "Un seul objet par Pokémon." },
          { type: "vf", question: "Il faut choisir une action en combat pour utiliser l'objet tenu.", reponse: false,
            explication: "L'objet agit tout seul, quand ses conditions sont remplies." },
          { type: "vf", question: "En VGC, deux Pokémon d'une même équipe peuvent tenir le même objet.", reponse: false,
            explication: "En VGC, chaque objet ne peut être tenu qu'une fois dans l'équipe." },
          { type: "choix", question: "Lequel de ces objets agit en continu, et pas une seule fois ?",
            options: [objet("restes", "Restes"), objet("ceinture-force", "Ceinture Force"), objet("baie-sitrus", "Baie Sitrus")], reponse: 0,
            explication: "Les Restes soignent à chaque fin de tour. Ceinture Force et Baie Sitrus disparaissent après une utilisation." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "baies",
        titre: "Les baies",
        texte: `
<p>Les <strong>baies</strong> s'activent une seule fois, dans une situation précise, puis disparaissent pour le reste du combat. Le Pokémon les mange tout seul.</p>
${capture({
  src: "images/objets/menu-baie-sitrus.webp",
  alt: "Description de la Baie Sitrus",
  reperes: [
    { x: 53.5, y: 37, texte: "Le <strong>déclencheur</strong> : quand les PV tombent à la moitié ou moins." },
    { x: 96, y: 40, texte: "L'<strong>effet</strong> : elle rend 1/4 des PV max." },
    { x: 68, y: 47.6, texte: "Une seule fois : elle disparaît ensuite." }
  ],
  legende: "La Baie Sitrus, catégorie Baie (et Soin)."
})}
<h2>Les familles de baies</h2>
<table>
<tr><th>Famille</th><th>Exemple</th><th>Effet</th></tr>
<tr><td>Soin des PV</td><td>Baie Sitrus</td><td>Rend 1/4 des PV max quand les PV passent sous la moitié</td></tr>
<tr><td>Soin du statut</td><td>Baie Prine</td><td>Soigne une fois une altération d'état (brûlure, paralysie…)</td></tr>
<tr><td>Réduction de dégâts</td><td>Baie Babiri</td><td>Réduit une fois les dégâts d'une capacité super efficace d'un type précis (ici Acier)</td></tr>
</table>
<p>Tu as déjà vu la Baie Sitrus en action dans le cours 1 : elle s'est activée quand Farigiraf est tombé à 50 PV sur 224.</p>
<div class="astuce"><b>Astuce :</b> une baie de réduction de dégâts sert à couvrir une faiblesse. Un Pokémon faible face à l'Acier peut tenir une Baie Babiri pour survivre à un coup qui l'aurait mis K.O.</div>
<div class="piege"><b>Piège à éviter :</b> le talent Tension (de Tyranocif, par exemple) empêche les adversaires de manger leurs baies. Ta Baie Sitrus ne s'activera pas tant qu'il est sur le terrain.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Farigiraf tient une Baie Sitrus. Il a 224 PV max et tombe à 100 PV. Que se passe-t-il ?",
            image: "images/combat-baie-sitrus.webp", alt: "La Baie Sitrus de Farigiraf s'active",
            options: [
              { texte: "La baie s'active et lui rend 56 PV (1/4 de 224).", bon: true, commentaire: "Oui : 100 PV, c'est moins de la moitié (112). La baie rend 224 ÷ 4 = 56 PV." },
              { texte: "Rien : il faut tomber sous 1/4 des PV.", bon: false, commentaire: "Non, le déclencheur de la Baie Sitrus, c'est la moitié des PV." },
              { texte: "La baie lui rend tous ses PV.", bon: false, commentaire: "Non, seulement 1/4 de ses PV max." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Combien de PV rend la Baie Sitrus ?",
            image: "images/objets/menu-baie-sitrus.webp", alt: "Description de la Baie Sitrus",
            options: ["1/4 des PV max", "1/16 des PV max", "La moitié des PV max", "Tous les PV"], reponse: 0,
            explication: "1/4 des PV max, quand les PV passent à la moitié ou moins." },
          { type: "vf", question: "Une baie peut s'activer plusieurs fois dans le même combat.", reponse: false,
            explication: "Elle disparaît pour le reste du combat après une utilisation." },
          { type: "choix", question: "Quelle baie soigne une altération d'état ?",
            options: [objet("baie-prine", "Baie Prine"), objet("baie-sitrus", "Baie Sitrus"), objet("baie-babiri", "Baie Babiri")], reponse: 0,
            explication: "La Baie Prine soigne le statut. La Sitrus soigne les PV, la Babiri réduit des dégâts." },
          { piege: true, type: "vf", question: "Avec la Baie Sitrus, le Pokémon choisit le moment où il la mange.", reponse: false,
            explication: "Piège : la baie s'active toute seule, dès que les PV passent à la moitié." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "offensifs",
        titre: "Les objets offensifs",
        texte: `
<p>Ces objets rendent le Pokémon plus dangereux. Dans Pokémon Champions, ils sont rangés dans les catégories <strong>Puissance ↑</strong> et <strong>Stats ↑</strong>.</p>
<h2>L'Orbe Vie : plus fort, mais ça coûte</h2>
${capture({
  src: "images/objets/menu-orbe-vie.webp",
  alt: "Description de l'Orbe Vie",
  petite: true,
  reperes: [
    { x: 96, y: 36, texte: "Toutes les capacités ×1,3, mais le Pokémon perd 1/10 de ses PV max à chaque capacité offensive réussie." }
  ],
  legende: "L'Orbe Vie, catégorie Puissance ↑."
})}
<h2>Le Mouchoir Choix : plus rapide, mais bloqué</h2>
${capture({
  src: "images/objets/menu-mouchoir-choix.webp",
  alt: "Description du Mouchoir Choix",
  petite: true,
  reperes: [ { x: 96, y: 36, texte: "Vitesse ×1,5, mais le Pokémon est bloqué sur sa première capacité tant qu'il reste sur le terrain." } ],
  legende: "Le Mouchoir Choix, catégorie Stats ↑."
})}
<p>Être bloqué sur une capacité est un vrai risque : si l'adversaire change pour un Pokémon qui y résiste, il faut sortir ton Pokémon pour en changer.</p>
<h2>Les autres objets de puissance</h2>
<table>
<tr><th>Objet</th><th>Effet</th><th>Pour qui ?</th></tr>
<tr><td>Bandeau Muscle</td><td>Renforce un peu les capacités physiques</td><td>Attaquant physique</td></tr>
<tr><td>Lunettes Sages</td><td>Renforce un peu les capacités spéciales</td><td>Attaquant spécial</td></tr>
<tr><td>Lunettes Noires</td><td>Renforce les capacités Ténèbres</td><td>Un Pokémon qui compte sur ses capacités Ténèbres</td></tr>
</table>
<div class="astuce"><b>Astuce :</b> un objet de puissance donne moins de bonus que l'Orbe Vie, mais sans contrepartie. À toi de choisir entre puissance maximale et longévité.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Métalosse tient un Mouchoir Choix et utilise Tête de Fer. Au tour suivant, il veut utiliser Poing Éclair. Que se passe-t-il ?",
            image: "images/objets/menu-mouchoir-choix.webp", alt: "Description du Mouchoir Choix",
            options: [
              { texte: "Impossible : il est bloqué sur Tête de Fer tant qu'il reste sur le terrain.", bon: true, commentaire: "Oui : pour changer de capacité, il doit d'abord quitter le terrain." },
              { texte: "Il utilise Poing Éclair normalement.", bon: false, commentaire: "Non : c'est la contrepartie du Mouchoir Choix." },
              { texte: "Il perd son Mouchoir Choix.", bon: false, commentaire: "Non, il le garde, mais reste bloqué." }
            ]
          },
          {
            type: "situation",
            enonce: "Ton Pokémon a 200 PV max et tient une Orbe Vie. Il utilise une capacité offensive qui touche. Combien de PV perd-il ?",
            options: [
              { texte: "20 PV (1/10)", bon: true, commentaire: "Oui : 200 ÷ 10 = 20 PV, à chaque capacité offensive réussie." },
              { texte: "Aucun", bon: false, commentaire: "Non, c'est la contrepartie de l'Orbe Vie." },
              { texte: "50 PV (1/4)", bon: false, commentaire: "Non, c'est 1/10 des PV max." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Par combien l'Orbe Vie multiplie-t-elle la puissance des capacités ?",
            options: ["×1,3", "×1,5", "×2", "×1,1"], reponse: 0,
            explication: "×1,3, au prix de 1/10 des PV max à chaque capacité offensive réussie." },
          { type: "choix", question: "Que fait le Mouchoir Choix ?",
            options: ["Vitesse ×1,5, mais bloque sur une capacité", "Attaque ×1,5", "Soigne à chaque tour", "Rend plus résistant"], reponse: 0,
            explication: "Vitesse ×1,5, et le Pokémon ne peut utiliser que sa première capacité tant qu'il reste sur le terrain." },
          { type: "choix", question: "Quel objet renforce un attaquant spécial sans contrepartie ?",
            options: [objet("lunettes-sages", "Lunettes Sages"), objet("bandeau-muscle", "Bandeau Muscle"), objet("orbe-vie", "Orbe Vie")], reponse: 0,
            explication: "Les Lunettes Sages renforcent les capacités spéciales. Le Bandeau Muscle, c'est pour le physique, et l'Orbe Vie a une contrepartie." },
          { piege: true, type: "vf", question: "Un Pokémon avec un Mouchoir Choix peut changer de capacité à chaque tour.", reponse: false,
            explication: "Piège : il est bloqué sur sa première capacité tant qu'il ne quitte pas le terrain." }
        ]
      },

      // ---------------- Leçon 4 ----------------
      {
        id: "survie",
        titre: "Les objets de défense, de soin et les autres",
        texte: `
<p>Ces objets aident le Pokémon à tenir plus longtemps, ou modifient le déroulement du combat.</p>
<h2>Défense : la Ceinture Force</h2>
${capture({
  src: "images/objets/menu-ceinture-force.webp",
  alt: "Description de la Ceinture Force",
  petite: true,
  reperes: [ { x: 96, y: 34, texte: "Le Pokémon survit avec 1 PV à un coup fatal, s'il avait <strong>tous ses PV</strong>. Une seule fois." } ],
  legende: "La Ceinture Force, catégorie Défense."
})}
<p>Idéale pour un Pokémon fragile qui doit absolument agir au moins une fois.</p>
<h2>Soin : les Restes</h2>
${capture({
  src: "images/objets/menu-restes.webp",
  alt: "Description des Restes",
  petite: true,
  reperes: [ { x: 96, y: 31, texte: "1/16 des PV max à la fin de <strong>chaque</strong> tour." } ],
  legende: "Les Restes, catégorie Soin."
})}
<h2>Durée des effets</h2>
<p>Certains objets prolongent un effet lancé par le Pokémon. La <strong>Roche Humide</strong> fait durer la pluie 8 tours au lieu de 5, et le <strong>Champ'Duit</strong> prolonge les terrains (comme le champ herbu de Créa-Herbe).</p>
<h2>Les objets « Autre »</h2>
${diaporama({ etapes: [
  { src: "images/objets/menu-casque-brut.webp", alt: "Description du Casque Brut", titre: "Casque Brut", texte: "Un adversaire qui touche le Pokémon avec une capacité de contact perd 1/6 de ses PV max. Félinferno en porte un dans l'équipe du cours 1." },
  { src: "images/objets/menu-ballon.webp", alt: "Description du Ballon", titre: "Ballon", texte: "Le Pokémon flotte : il est immunisé contre le Sol et les pièges au sol, comme avec Lévitation. Mais le Ballon éclate au premier dégât subi." },
  { src: "images/objets/menu-roche-humide.webp", alt: "Description de la Roche Humide", titre: "Roche Humide", texte: "Durée effets ↑ : la pluie lancée par le Pokémon dure 8 tours au total." },
  { src: "images/objets/menu-graine-herbe.webp", alt: "Description de la Graine Herbe", titre: "Graine Herbe", texte: "Stats ↑ : +1 cran de Défense quand un champ herbu est actif. Parfait avec un partenaire qui a Créa-Herbe." }
] })}
<div class="piege"><b>Piège à éviter :</b> la Ceinture Force ne marche que si le Pokémon a <strong>tous ses PV</strong>. Après Piège de Roc, une tempête de sable ou une Orbe Vie, elle ne protège plus.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque objet à son effet.",
            paires: [
              [objet("ceinture-force", "Ceinture Force"), "Survit à un coup fatal avec tous ses PV"],
              [objet("restes", "Restes"), "Rend 1/16 des PV chaque tour"],
              [objet("casque-brut", "Casque Brut"), "Blesse ceux qui le touchent au contact"],
              [objet("ballon", "Ballon"), "Immunisé contre le Sol jusqu'au premier dégât"]
            ],
            commentaire: "Défense, soin, et deux objets « Autre » qui changent le combat."
          },
          {
            type: "situation",
            enonce: "Ton Pokémon tient une Ceinture Force, mais il a perdu des PV à cause de Piège de Roc en entrant. L'adversaire lui envoie un coup fatal. Que se passe-t-il ?",
            image: "images/objets/menu-ceinture-force.webp", alt: "Description de la Ceinture Force",
            options: [
              { texte: "Il est mis K.O. : la Ceinture Force ne marche qu'avec tous ses PV.", bon: true, commentaire: "Exactement. C'est pour ça que Piège de Roc est redoutable contre la Ceinture Force." },
              { texte: "Il survit avec 1 PV.", bon: false, commentaire: "Non : il n'avait plus tous ses PV." },
              { texte: "Il survit avec la moitié de ses PV.", bon: false, commentaire: "Non, la Ceinture Force laisse au mieux 1 PV." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Combien de PV les Restes rendent-ils à chaque tour ?",
            image: "images/objets/menu-restes.webp", alt: "Description des Restes",
            options: ["1/16 des PV max", "1/4 des PV max", "1/10 des PV max", "1/8 des PV max"], reponse: 0,
            explication: "1/16 des PV max à la fin de chaque tour." },
          { type: "choix", question: "Combien de PV perd un adversaire qui touche un Pokémon tenant un Casque Brut avec une capacité de contact ?",
            image: "images/objets/menu-casque-brut.webp", alt: "Description du Casque Brut",
            options: ["1/6 de ses PV max", "1/16", "1/4", "La moitié"], reponse: 0,
            explication: "1/6 des PV max de l'adversaire." },
          { type: "nombre", question: "Avec la Roche Humide, combien de tours dure la pluie au total ?",
            image: "images/objets/menu-roche-humide.webp", alt: "Description de la Roche Humide", reponse: 8,
            explication: "3 tours de plus : 8 au total." },
          { piege: true, type: "vf", question: "La Ceinture Force protège même si le Pokémon a déjà perdu des PV.", reponse: false,
            explication: "Piège : il faut que ses PV soient au maximum." }
        ]
      },

      // ---------------- Leçon 5 ----------------
      {
        id: "mega",
        titre: "Méga-Gemmes et mécaniques spéciales",
        texte: `
<p>Une <strong>Méga-Gemme</strong> est un objet propre à une espèce : la Tyranocivite pour Tyranocif, la Sarmuraïte pour Sarmuraï, la Dracaufite Y pour Dracaufeu… Tenue par le bon Pokémon, elle lui permet de <strong>méga-évoluer</strong> pendant le combat.</p>
${capture({
  src: "images/objets/menu-tyranocivite.webp",
  alt: "Description de la Tyranocivite",
  reperes: [
    { x: 23, y: 33.5, texte: "La <strong>Tyranocivite</strong>, dans la liste de tous les objets." },
    { x: 96, y: 30, texte: "Sa description : elle permet à Tyranocif de méga-évoluer." },
    { x: 70, y: 36.6, texte: "Sa catégorie : <strong>Méga-Gemme</strong>." }
  ],
  legende: "Une Méga-Gemme dans le menu des objets."
})}
<h2>Ce qu'il faut savoir</h2>
<ul>
<li>Une Méga-Gemme ne marche qu'avec <strong>son</strong> espèce : la Tyranocivite ne fait rien sur un autre Pokémon.</li>
<li>Le Pokémon qui la tient <strong>n'a pas d'autre objet</strong> : pas de Restes ni de Ceinture Force pour lui.</li>
<li>En méga-évoluant, le Pokémon change de stats, parfois de type, et parfois de talent (cours « Les talents »).</li>
<li>Pour méga-évoluer, on active le bouton <strong>Méga-Évolution</strong> au moment de choisir sa capacité (cours 1).</li>
</ul>
<div class="format"><b>Ça dépend du format :</b> la Méga-Évolution existe sur Pokémon Champions (VGC et 3v3). Sur Showdown (6v6 OU), on trouve à la place la <strong>Téracristallisation</strong> : une fois par combat, un Pokémon peut changer de type pour son « type Téracristal ». Tu verras ces mécaniques en détail dans les formats.</div>
<div class="astuce"><b>Astuce :</b> donner une Méga-Gemme, c'est renoncer à un autre objet. Ça vaut le coup quand la forme Méga est nettement plus forte que le Pokémon de base.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Tu donnes la Tyranocivite à Métalosse. Que se passe-t-il en combat ?",
            image: "images/objets/menu-tyranocivite.webp", alt: "Description de la Tyranocivite",
            options: [
              { texte: "Rien : la Tyranocivite ne marche qu'avec Tyranocif.", bon: true, commentaire: "Oui : chaque Méga-Gemme est propre à une espèce." },
              { texte: "Métalosse méga-évolue en Méga-Tyranocif.", bon: false, commentaire: "Non, un Pokémon ne peut pas méga-évoluer avec la gemme d'une autre espèce." },
              { texte: "Métalosse méga-évolue en Méga-Métalosse.", bon: false, commentaire: "Non : il lui faudrait sa propre Méga-Gemme." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "À quoi sert la Tyranocivite ?",
            image: "images/objets/menu-tyranocivite.webp", alt: "Description de la Tyranocivite",
            options: ["À faire méga-évoluer Tyranocif", "À renforcer les capacités Roche", "À soigner Tyranocif", "À faire méga-évoluer n'importe quel Pokémon"], reponse: 0,
            explication: "C'est la Méga-Gemme de Tyranocif." },
          { type: "vf", question: "Un Pokémon qui tient une Méga-Gemme peut aussi tenir des Restes.", reponse: false,
            explication: "Un seul objet par Pokémon : la Méga-Gemme prend la place." },
          { type: "choix", question: "Quelle mécanique remplace la Méga-Évolution sur Showdown (6v6 OU) ?",
            options: ["La Téracristallisation", "Le Mouchoir Choix", "Distorsion", "Les crans"], reponse: 0,
            explication: "Sur Showdown, on joue avec la Téracristallisation." },
          { piege: true, type: "vf", question: "La Tyranocivite fait méga-évoluer n'importe quel Pokémon de type Roche.", reponse: false,
            explication: "Piège : une Méga-Gemme ne dépend pas du type, mais de l'espèce. Seul Tyranocif peut l'utiliser." }
        ]
      }
    ],
    examen: [
      // ----- Choisir le bon objet (boutons) -----
      { type: "choix", question: "Ton attaquant fragile doit absolument survivre à un premier coup pour agir. Quel objet lui donnes-tu ?",
        options: [objet("ceinture-force", "Ceinture Force"), objet("orbe-vie", "Orbe Vie"), objet("mouchoir-choix", "Mouchoir Choix"), objet("lunettes-noires", "Lunettes Noires")], reponse: 0,
        explication: "La Ceinture Force le laisse à 1 PV face à un coup fatal, s'il avait tous ses PV." },
      { type: "choix", question: "Ton Pokémon défensif veut récupérer des PV à chaque tour. Quel objet choisis-tu ?",
        options: [objet("restes", "Restes"), objet("baie-sitrus", "Baie Sitrus"), objet("casque-brut", "Casque Brut"), objet("orbe-vie", "Orbe Vie")], reponse: 0,
        explication: "Les Restes rendent 1/16 des PV à chaque fin de tour." },
      { type: "choix", question: "Ton attaquant est un peu trop lent pour dépasser un adversaire. Quel objet l'aide ?",
        options: [objet("mouchoir-choix", "Mouchoir Choix"), objet("bandeau-muscle", "Bandeau Muscle"), objet("restes", "Restes"), objet("roche-humide", "Roche Humide")], reponse: 0,
        explication: "Le Mouchoir Choix multiplie la Vitesse par 1,5." },
      { type: "choix", question: "Ton Pokémon est faible face au Sol et veut l'éviter. Quel objet lui donnes-tu ?",
        options: [objet("ballon", "Ballon"), objet("casque-brut", "Casque Brut"), objet("champ-duit", "Champ'Duit"), objet("vive-griffe", "Vive Griffe")], reponse: 0,
        explication: "Le Ballon le rend immunisé contre le Sol, jusqu'au premier dégât subi." },
      { type: "choix", question: "Ton Pokémon défensif encaisse beaucoup de capacités de contact. Quel objet punit l'adversaire ?",
        options: [objet("casque-brut", "Casque Brut"), objet("restes", "Restes"), objet("poudre-claire", "Poudre Claire"), objet("herbe-blanche", "Herbe Blanche")], reponse: 0,
        explication: "Le Casque Brut fait perdre 1/6 de ses PV max à l'adversaire qui le touche au contact." },
      { type: "choix", question: "Tyranocif veut méga-évoluer. Quel objet doit-il tenir ?",
        image: "images/tyranocif-fiche.webp", alt: "Fiche de Tyranocif",
        options: [objet("tyranocivite", "Tyranocivite"), objet("roche-royale", "Roche Royale"), objet("ceinture-force", "Ceinture Force")], reponse: 0,
        explication: "La Tyranocivite est la Méga-Gemme de Tyranocif." },
      { type: "choix", question: "Ton équipe joue sous la pluie. Quel objet donnes-tu au Pokémon qui la déclenche ?",
        options: [objet("roche-humide", "Roche Humide"), objet("champ-duit", "Champ'Duit"), objet("graine-herbe", "Graine Herbe"), objet("restes", "Restes")], reponse: 0,
        explication: "La Roche Humide fait durer la pluie 8 tours au lieu de 5." },
      { type: "choix", question: "Ton attaquant spécial veut plus de puissance sans perdre de PV. Quel objet choisis-tu ?",
        image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria",
        options: [objet("lunettes-sages", "Lunettes Sages"), objet("bandeau-muscle", "Bandeau Muscle"), objet("orbe-vie", "Orbe Vie")], reponse: 0,
        explication: "Les Lunettes Sages renforcent les capacités spéciales sans contrepartie. Le Bandeau Muscle est pour le physique, l'Orbe Vie coûte des PV." },
      { type: "multi", question: "Lesquels de ces objets disparaissent après une utilisation ?",
        options: [objet("baie-sitrus", "Baie Sitrus"), objet("ceinture-force", "Ceinture Force"), objet("herbe-blanche", "Herbe Blanche"), objet("restes", "Restes"), objet("orbe-vie", "Orbe Vie")], reponses: [0, 1, 2],
        explication: "Baie Sitrus, Ceinture Force et Herbe Blanche s'utilisent une fois. Restes et Orbe Vie agissent en continu." },

      // ----- Lire les descriptions -----
      { type: "choix", question: "D'après cette description, que fait l'Orbe Vie ?",
        image: "images/objets/menu-orbe-vie.webp", alt: "Description de l'Orbe Vie",
        options: ["Capacités ×1,3, mais −1/10 des PV à chaque capacité réussie", "Capacités ×1,5 sans contrepartie", "Soigne 1/10 des PV à chaque tour", "Vitesse ×1,3"], reponse: 0,
        explication: "×1,3 sur la puissance, mais 1/10 des PV max perdus à chaque capacité offensive réussie." },
      { type: "zone", question: "Sur ce menu, clique sur la description de l'objet sélectionné.",
        image: "images/objets/menu-restes.webp", alt: "Menu des objets, Restes",
        zones: { description: { nom: "la description", rect: [53, 20, 97, 85] }, liste: { nom: "la liste des objets", rect: [23, 20, 52, 85] }, categories: { nom: "les catégories", rect: [23, 11.5, 97.5, 18.5] } }, reponse: "description",
        explication: "La description est dans le grand cadre de droite." },
      { type: "choix", question: "Dans quelle catégorie du menu se trouve la Ceinture Force ?",
        image: "images/objets/menu-ceinture-force.webp", alt: "Menu des objets, Ceinture Force",
        options: ["Défense", "Soin", "Stats ↑", "Autre"], reponse: 0,
        explication: "Elle est dans la catégorie Défense." },
      { type: "choix", question: "Quand la Ceinture Force fonctionne-t-elle ?",
        image: "images/objets/menu-ceinture-force.webp", alt: "Description de la Ceinture Force",
        options: ["Quand le Pokémon a tous ses PV", "À chaque coup fatal", "Quand il reste moins de la moitié des PV", "Seulement contre les capacités spéciales"], reponse: 0,
        explication: "Il faut que les PV soient au maximum." },
      { type: "nombre", question: "D'après sa description, combien de tours dure la pluie avec la Roche Humide ?",
        image: "images/objets/menu-roche-humide.webp", alt: "Description de la Roche Humide", reponse: 8,
        explication: "Durée totale : 8 tours." },
      { type: "choix", question: "Que fait la Graine Herbe ?",
        image: "images/objets/menu-graine-herbe.webp", alt: "Description de la Graine Herbe",
        options: ["+1 cran de Défense quand un champ herbu est actif", "Soigne sur un champ herbu", "Crée un champ herbu", "+1 cran d'Attaque"], reponse: 0,
        explication: "Elle s'active une fois, si un champ herbu est actif." },
      { type: "choix", question: "Quand le Ballon éclate-t-il ?",
        image: "images/objets/menu-ballon.webp", alt: "Description du Ballon",
        options: ["Dès que le Pokémon subit des dégâts d'une capacité", "Après 5 tours", "Quand le Pokémon attaque", "Jamais"], reponse: 0,
        explication: "Il disparaît pour le reste du combat au premier dégât d'une capacité." },
      { type: "choix", question: "Combien de PV rend la Baie Sitrus, et quand ?",
        image: "images/objets/menu-baie-sitrus.webp", alt: "Description de la Baie Sitrus",
        options: ["1/4 des PV max, quand les PV passent à la moitié ou moins", "1/16 des PV max à chaque tour", "La moitié des PV quand ils passent sous 1/4", "Tous les PV une fois"], reponse: 0,
        explication: "1/4 des PV max, une fois, quand les PV tombent à la moitié ou moins." },
      { type: "choix", question: "Quel objet tient Félinferno dans cette équipe, et à quoi sert-il ?",
        image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
        options: ["Casque Brut : il blesse ceux qui le touchent au contact", "Restes : il se soigne", "Baie Sitrus : il se soigne une fois", "Ceinture Force : il survit à un coup"], reponse: 0,
        explication: "Le Casque Brut de Félinferno punit les capacités de contact." },

      // ----- Règles -----
      { type: "nombre", question: "Combien d'objets un Pokémon peut-il tenir ?", reponse: 1,
        explication: "Un seul." },
      { type: "vf", question: "En VGC, deux Pokémon de la même équipe peuvent tenir le même objet.", reponse: false,
        explication: "Non, chaque objet ne peut être tenu qu'une fois dans l'équipe." },
      { type: "choix", question: "Quelle mécanique spéciale existe sur Showdown (6v6 OU) à la place de la Méga-Évolution ?",
        options: ["La Téracristallisation", "Le Mouchoir Choix", "La Roche Humide", "Le Ballon"], reponse: 0,
        explication: "La Téracristallisation permet à un Pokémon de changer de type une fois par combat." },

      // ----- Questions pièges -----
      { piege: true, type: "vf", question: "La Ceinture Force protège encore après que le Pokémon a subi Piège de Roc.",
        image: "images/objets/menu-ceinture-force.webp", alt: "Description de la Ceinture Force", reponse: false,
        explication: "Piège : il n'a plus tous ses PV, la Ceinture Force ne fonctionne plus." },
      { piege: true, type: "vf", question: "Avec un Mouchoir Choix, le Pokémon peut changer de capacité au tour suivant.",
        image: "images/objets/menu-mouchoir-choix.webp", alt: "Description du Mouchoir Choix", reponse: false,
        explication: "Piège : il est bloqué tant qu'il ne quitte pas le terrain." },
      { piege: true, type: "choix", question: "Un Pokémon de 160 PV max tient une Orbe Vie. Il utilise Abri. Combien de PV perd-il ?",
        options: ["0", "16", "10", "40"], reponse: 0,
        explication: "Piège : l'Orbe Vie ne coûte des PV que pour une capacité offensive réussie. Abri n'en est pas une." },
      { piege: true, type: "vf", question: "Un Pokémon avec un Ballon est immunisé contre le Sol pour tout le combat.",
        image: "images/objets/menu-ballon.webp", alt: "Description du Ballon", reponse: false,
        explication: "Piège : le Ballon éclate dès que le Pokémon subit des dégâts d'une capacité." },
      { piege: true, type: "choix", question: "Quel Pokémon peut méga-évoluer avec la Tyranocivite ?",
        options: ["Seulement Tyranocif", "Tous les Pokémon Roche", "Tous les Pokémon Ténèbres", "N'importe quel Pokémon"], reponse: 0,
        explication: "Piège : une Méga-Gemme dépend de l'espèce, pas du type." },
      { piege: true, type: "choix", question: "Tyranocif (talent Tension) est sur le terrain. Ta Baie Sitrus va-t-elle s'activer ?",
        options: ["Non, Tension empêche les adversaires de manger leurs baies", "Oui, comme d'habitude", "Oui, mais elle rend moins de PV", "Seulement à la fin du tour"], reponse: 0,
        explication: "Piège : le talent Tension bloque les baies adverses tant que le Pokémon est sur le terrain." }
    ]
  },

  // ===========================================================
  //  COURS 7 · CLIMATS ET CHAMPS
  // ===========================================================
  {
    id: "climats", titre: "Climats et champs",
    objectifs: [
      "Connaître les 4 climats et leurs effets",
      "Connaître les 4 champs et leurs effets",
      "Savoir comment on les déclenche et combien de temps ils durent",
      "Les repérer pendant un combat"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "climats",
        titre: "Les climats",
        texte: `
<p>Un <strong>climat</strong> (on parle aussi de météo) touche <strong>tout le terrain</strong> : tous les Pokémon, des deux camps. Il en existe 4.</p>
<table>
<tr><th>Climat</th><th>Effets principaux</th></tr>
<tr><td><strong>Soleil</strong></td><td>Capacités ${type("feu")} ×1,5, capacités ${type("eau")} ×0,5. Synthèse rend 2/3 des PV.</td></tr>
<tr><td><strong>Pluie</strong></td><td>Capacités ${type("eau")} ×1,5, capacités ${type("feu")} ×0,5. Fatal-Foudre et Vent Violent ne ratent jamais.</td></tr>
<tr><td><strong>Tempête de sable</strong></td><td>Dégâts à chaque fin de tour (1/16 des PV max), sauf aux ${type("roche")} ${type("sol")} ${type("acier")}. Déf. Spé. des Pokémon ${type("roche")} ×1,5.</td></tr>
<tr><td><strong>Neige</strong></td><td>Défense des Pokémon ${type("glace")} ×1,5. Blizzard ne rate jamais.</td></tr>
</table>
${capture({
  src: "images/combat-mega-evolution.webp",
  alt: "Une tempête de sable active en combat",
  reperes: [ { x: 45.4, y: 7.1, texte: "Le climat actif (<strong>Tempête de sable</strong>) et ses tours restants (4 sur 5)." } ],
  legende: "En combat, le climat actif est affiché en haut de l'écran."
})}
<h2>Un climat aide… et gêne</h2>
<p>Le climat touche tout le monde, y compris l'adversaire. Et il peut aussi te desservir : sous le soleil, les capacités ${type("eau")} de ton propre Pokémon sont affaiblies.</p>
<p>Exemple avec les Pokémon du cours : sous la pluie, le Mégaphone d'Oratoria (devenu ${type("eau")} grâce à Hydrata-Son) est renforcé. Sous le soleil, il est affaibli.</p>
${capture({
  src: "images/capacites/fiche-synthese.webp",
  alt: "Description de Synthèse",
  petite: true,
  legende: "Synthèse change d'effet selon le climat : 1/2 des PV normalement, 2/3 au soleil, 1/4 sous un autre climat."
})}
<div class="piege"><b>Piège à éviter :</b> la tempête de sable blesse aussi tes propres Pokémon. Un Tyranocif qui lance le sable avec Sable Volant ne craint rien (il est Roche), mais son partenaire, s'il n'est pas Roche, Sol ou Acier, perdra des PV à chaque tour.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque climat à son effet.",
            paires: [["Soleil", "Feu ×1,5, Eau ×0,5"], ["Pluie", "Eau ×1,5, Feu ×0,5"], ["Tempête de sable", "Dégâts sauf Roche, Sol, Acier"], ["Neige", "Défense des Glace ×1,5"]],
            commentaire: "Soleil et pluie s'opposent, la tempête de sable blesse, la neige protège les Pokémon Glace."
          },
          {
            type: "situation",
            enonce: "La pluie est active. Oratoria utilise Mégaphone, qui devient une capacité Eau grâce à Hydrata-Son. Que se passe-t-il ?",
            image: "images/oratoria-fiche.webp", alt: "Fiche d'Oratoria",
            options: [
              { texte: "Mégaphone est renforcé (×1,5).", bon: true, commentaire: "Oui : la pluie renforce les capacités Eau. Avec le STAB en plus, ça fait mal." },
              { texte: "Mégaphone est affaibli (×0,5).", bon: false, commentaire: "Non, c'est sous le soleil que les capacités Eau sont affaiblies." },
              { texte: "Rien, la pluie ne touche que les capacités de type Normal.", bon: false, commentaire: "Non : avec Hydrata-Son, Mégaphone est une capacité Eau." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Sous le soleil, que deviennent les capacités Feu ?",
            options: ["×1,5", "×0,5", "×2", "Inchangées"], reponse: 0,
            explication: "Le soleil renforce le Feu (×1,5) et affaiblit l'Eau (×0,5)." },
          { type: "multi", question: "Quels types ne subissent pas les dégâts de la tempête de sable ?",
            options: ["Roche", "Sol", "Acier", "Eau", "Vol"], reponses: [0, 1, 2],
            explication: "Roche, Sol et Acier sont protégés de la tempête de sable." },
          { type: "vf", question: "Un climat ne touche que le camp du Pokémon qui l'a lancé.", reponse: false,
            explication: "Un climat touche tout le terrain, les deux camps." },
          { type: "choix", question: "Combien de PV Synthèse rend-elle au soleil ?",
            image: "images/capacites/fiche-synthese.webp", alt: "Description de Synthèse",
            options: ["2/3 des PV max", "1/2", "1/4", "Tous"], reponse: 0,
            explication: "2/3 au soleil, la moitié normalement, 1/4 sous un autre climat." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "lancerclimat",
        titre: "Déclencher et faire durer un climat",
        texte: `
<h2>Deux façons de lancer un climat</h2>
<ul>
<li><strong>Une capacité de statut :</strong> Zénith (soleil), Danse Pluie (pluie), Tempête de Sable… Elle prend une action.</li>
<li><strong>Un talent</strong> qui s'active à l'entrée sur le terrain : Sécheresse (soleil), Crachin (pluie), Sable Volant (sable), Alerte Neige (neige). Le climat arrive sans perdre d'action.</li>
</ul>
${diaporama({ etapes: [
  { src: "images/talent-sable-volant.webp", alt: "Description de Sable Volant", titre: "Par un talent : Sable Volant", texte: "Tyranocif lance une tempête de sable de 5 tours dès qu'il arrive sur le terrain." },
  { src: "images/capacites/apprendre-zenith.webp", alt: "Description de Zénith", titre: "Par une capacité : Zénith", texte: "Une capacité de statut qui invoque le soleil pendant 5 tours, sur tout le terrain." }
] })}
<h2>Combien de temps ça dure</h2>
<ul>
<li>Un climat dure <strong>5 tours</strong>.</li>
<li>Avec l'objet adapté, il dure <strong>8 tours</strong> : Roche Chaude (soleil), Roche Humide (pluie), Roche Lisse (sable), Roche Glace (neige).</li>
</ul>
${capture({
  src: "images/objets/menu-roche-humide.webp",
  alt: "Description de la Roche Humide",
  petite: true,
  legende: "La Roche Humide : la pluie lancée par le Pokémon dure 8 tours au total."
})}
<h2>La guerre des climats</h2>
<p>Il ne peut y avoir qu'<strong>un seul climat à la fois</strong>. Un nouveau climat remplace l'ancien. Si ton adversaire lance la pluie alors que ton soleil est actif, ton soleil disparaît.</p>
<div class="astuce"><b>Astuce :</b> un talent comme Sable Volant se réactive à chaque entrée. Faire sortir puis revenir Tyranocif relance une tempête de 5 tours… et efface le climat adverse.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Ton soleil est actif depuis 2 tours. L'adversaire fait entrer un Pokémon avec le talent Crachin. Que se passe-t-il ?",
            options: [
              { texte: "La pluie remplace le soleil.", bon: true, commentaire: "Oui : un seul climat à la fois, le nouveau remplace l'ancien." },
              { texte: "Les deux climats sont actifs en même temps.", bon: false, commentaire: "Non, il n'y a jamais deux climats à la fois." },
              { texte: "Rien : le soleil doit d'abord finir ses 5 tours.", bon: false, commentaire: "Non : un nouveau climat remplace immédiatement l'ancien." }
            ]
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien de tours dure un climat, sans objet ?", reponse: 5,
            explication: "5 tours." },
          { type: "nombre", question: "Combien de tours dure la pluie avec une Roche Humide ?",
            image: "images/objets/menu-roche-humide.webp", alt: "Description de la Roche Humide", reponse: 8,
            explication: "8 tours au total." },
          { type: "choix", question: "Quel talent lance la pluie à l'entrée sur le terrain ?",
            options: ["Crachin", "Sécheresse", "Sable Volant", "Créa-Herbe"], reponse: 0,
            explication: "Crachin lance la pluie, Sécheresse le soleil, Sable Volant la tempête de sable." },
          { type: "vf", question: "Deux climats peuvent être actifs en même temps.", reponse: false,
            explication: "Un seul climat à la fois : le nouveau remplace l'ancien." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "champs",
        titre: "Les champs",
        texte: `
<p>Un <strong>champ</strong> (on parle aussi de terrain) recouvre le sol de tout le terrain. Il en existe 4. Contrairement aux climats, un champ n'affecte que les <strong>Pokémon qui touchent le sol</strong>.</p>
<table>
<tr><th>Champ</th><th>Effets principaux (Pokémon au sol)</th></tr>
<tr><td><strong>Champ Herbu</strong></td><td>Capacités ${type("plante")} ×1,3. Soigne 1/16 des PV max à chaque fin de tour. Séisme est réduit de moitié.</td></tr>
<tr><td><strong>Champ Électrifié</strong></td><td>Capacités ${type("electrik")} ×1,3. Impossible de s'endormir.</td></tr>
<tr><td><strong>Champ Psychique</strong></td><td>Capacités ${type("psy")} ×1,3. Protège des capacités prioritaires adverses.</td></tr>
<tr><td><strong>Champ Brumeux</strong></td><td>Capacités ${type("dragon")} réduites de moitié contre eux. Protège des altérations d'état.</td></tr>
</table>
${capture({
  src: "images/capacites/fiche-seisme.webp",
  alt: "Description de Séisme",
  petite: true,
  legende: "La description de Séisme le précise : sa puissance est réduite de moitié sur un champ herbu."
})}
<h2>Qui touche le sol ?</h2>
<p>Presque tous les Pokémon. Sauf :</p>
<ul>
<li>les Pokémon ${type("vol")} ;</li>
<li>ceux qui ont le talent <strong>Lévitation</strong> ;</li>
<li>ceux qui tiennent un <strong>Ballon</strong> (tant qu'il n'a pas éclaté).</li>
</ul>
<div class="piege"><b>Piège à éviter :</b> un Pokémon Vol ne profite pas du champ… mais n'en subit pas non plus les effets. Sur un Champ Psychique, il peut être touché par une capacité prioritaire, et sur un Champ Brumeux, il peut être brûlé ou paralysé.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque champ à son effet.",
            paires: [["Champ Herbu", "Soigne un peu chaque tour"], ["Champ Électrifié", "Empêche de s'endormir"], ["Champ Psychique", "Bloque les capacités prioritaires"], ["Champ Brumeux", "Protège des altérations d'état"]],
            commentaire: "Et chacun renforce (ou affaiblit) un type de capacité."
          },
          {
            type: "situation",
            enonce: "Un Champ Psychique est actif. Oratoria utilise Aqua-Jet (priorité +1) sur un adversaire qui touche le sol. Que se passe-t-il ?",
            options: [
              { texte: "Aqua-Jet échoue.", bon: true, commentaire: "Oui : le Champ Psychique protège les Pokémon au sol des capacités prioritaires adverses." },
              { texte: "Aqua-Jet passe en premier, comme d'habitude.", bon: false, commentaire: "Non, c'est justement ce que bloque le Champ Psychique." },
              { texte: "Aqua-Jet est renforcé.", bon: false, commentaire: "Non : le Champ Psychique renforce les capacités Psy, pas Eau." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Qui est affecté par un champ ?",
            options: ["Les Pokémon qui touchent le sol", "Tous les Pokémon", "Seulement le lanceur", "Seulement l'adversaire"], reponse: 0,
            explication: "Un champ n'affecte que les Pokémon au sol." },
          { type: "choix", question: "Quel champ renforce les capacités Plante et soigne un peu chaque tour ?",
            options: ["Champ Herbu", "Champ Brumeux", "Champ Électrifié", "Champ Psychique"], reponse: 0,
            explication: "Le Champ Herbu." },
          { type: "vf", question: "Un Pokémon Vol profite des effets d'un champ.", reponse: false,
            explication: "Il ne touche pas le sol : le champ ne l'affecte pas." },
          { type: "choix", question: "Que devient Séisme sur un Champ Herbu ?",
            image: "images/capacites/fiche-seisme.webp", alt: "Description de Séisme",
            options: ["Sa puissance est réduite de moitié", "Il est renforcé", "Il échoue", "Rien ne change"], reponse: 0,
            explication: "La description de Séisme le précise." }
        ]
      },

      // ---------------- Leçon 4 ----------------
      {
        id: "lancerchamp",
        titre: "Déclencher et faire durer un champ",
        texte: `
<h2>Lancer un champ</h2>
<ul>
<li><strong>Par un talent</strong> à l'entrée sur le terrain : Créa-Herbe, Créa-Élec, Créa-Psy, Créa-Brume.</li>
<li><strong>Par une capacité</strong> de statut, qui porte le nom du champ (Champ Herbu, Champ Électrifié…).</li>
</ul>
${capture({
  src: "images/talent-crea-herbe.webp",
  alt: "Description de Créa-Herbe",
  legende: "Créa-Herbe (Gorythmic) : un champ herbu de 5 tours dès que le Pokémon arrive."
})}
<h2>Combien de temps ça dure</h2>
<ul>
<li>Un champ dure <strong>5 tours</strong>, ou <strong>8 tours</strong> si le lanceur tient un <strong>Champ'Duit</strong>.</li>
<li>Comme les climats : <strong>un seul champ à la fois</strong>, le nouveau remplace l'ancien.</li>
<li>Un champ et un climat peuvent être actifs <strong>en même temps</strong> : ce sont deux choses différentes.</li>
</ul>
<h2>Les objets liés</h2>
<p>Certains objets n'ont d'intérêt qu'avec un champ. La <strong>Graine Herbe</strong> augmente la Défense de 1 cran quand un champ herbu est actif : elle va très bien sur le partenaire d'un Pokémon qui a Créa-Herbe.</p>
${capture({
  src: "images/objets/menu-graine-herbe.webp",
  alt: "Description de la Graine Herbe",
  petite: true,
  legende: "La Graine Herbe, à associer à un champ herbu."
})}`,
        exercices: [
          {
            type: "situation",
            enonce: "La pluie est active. Gorythmic entre avec Créa-Herbe. Que se passe-t-il ?",
            image: "images/talent-crea-herbe.webp", alt: "Description de Créa-Herbe",
            options: [
              { texte: "Le champ herbu s'ajoute : pluie et champ herbu sont actifs en même temps.", bon: true, commentaire: "Oui : un climat et un champ peuvent coexister." },
              { texte: "Le champ herbu remplace la pluie.", bon: false, commentaire: "Non : un champ ne remplace qu'un autre champ." },
              { texte: "Rien, la pluie empêche les champs.", bon: false, commentaire: "Non, ils sont indépendants." }
            ]
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien de tours dure un champ avec un Champ'Duit ?", reponse: 8,
            explication: "5 tours normalement, 8 avec le Champ'Duit." },
          { type: "vf", question: "Un champ et un climat peuvent être actifs en même temps.", reponse: true,
            explication: "Ce sont deux effets différents." },
          { type: "choix", question: "Quel talent crée un champ herbu ?",
            image: "images/talent-crea-herbe.webp", alt: "Description de Créa-Herbe",
            options: ["Créa-Herbe", "Sécheresse", "Herbivore", "Sable Volant"], reponse: 0,
            explication: "Créa-Herbe. Herbivore, lui, rend immunisé contre les capacités Plante." },
          { type: "choix", question: "Quand la Graine Herbe s'active-t-elle ?",
            image: "images/objets/menu-graine-herbe.webp", alt: "Description de la Graine Herbe",
            options: ["Quand un champ herbu est actif", "Quand il pleut", "Quand les PV sont bas", "À chaque tour"], reponse: 0,
            explication: "+1 cran de Défense quand un champ herbu est actif." }
        ]
      },

      // ---------------- Leçon 5 ----------------
      {
        id: "lire",
        titre: "Lire le climat et le champ en combat",
        texte: `
<p>Pendant un combat, garde toujours un œil sur le climat et le champ : ils changent la puissance des capacités, les dégâts de fin de tour et même l'ordre d'action.</p>
${capture({
  src: "images/combat-mega-evolution.webp",
  alt: "Tempête de sable 4/5 en combat",
  reperes: [
    { x: 45.4, y: 7.1, texte: "Le climat actif et ses tours restants : 4 sur 5." },
    { x: 88.3, y: 71.1, texte: "L'efficacité affichée sous chaque capacité ne tient pas compte du climat : à toi de faire le calcul." }
  ],
  legende: "Tempête de sable active : Tyranocif (Roche) ne subit rien et sa Déf. Spé. est renforcée."
})}
<h2>Les bons réflexes</h2>
<ol>
<li><strong>Compte les tours restants.</strong> Un climat qui va finir au prochain tour ne vaut pas qu'on joue autour.</li>
<li><strong>Relance au bon moment.</strong> Un talent d'entrée (Sable Volant, Créa-Herbe…) se réactive si le Pokémon sort puis revient.</li>
<li><strong>Pense aux deux camps.</strong> Le climat et le champ profitent aussi à l'adversaire.</li>
<li><strong>Vérifie qui touche le sol</strong> avant de compter sur un champ.</li>
</ol>
<div class="format"><b>Ça dépend du format :</b> en VGC, des équipes entières sont construites autour d'un climat ou d'un champ. Renseigne-toi sur les équipes du méta avant de construire la tienne.</div>
<div class="format"><b>Important :</b> il existe d'autres effets de terrain et de nombreux talents liés aux climats et aux champs. Quand tu crées ton équipe, lis bien les descriptions dans le jeu et renseigne-toi : c'est à toi de jouer.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Sur cet écran, la tempête de sable est à 4/5. Dans combien de tours se termine-t-elle ?",
            image: "images/combat-mega-evolution.webp", alt: "Tempête de sable 4/5",
            options: [
              { texte: "Dans 1 tour : c'est son 4e tour sur 5, il en reste un.", bon: true, commentaire: "Oui : 4/5 veut dire 4e tour sur 5." },
              { texte: "Dans 4 tours.", bon: false, commentaire: "Non : 4/5, c'est le numéro du tour en cours, pas les tours restants." },
              { texte: "Elle ne se termine jamais.", bon: false, commentaire: "Si : un climat dure 5 tours, sauf objet qui le prolonge." }
            ]
          }
        ],
        quiz: [
          { type: "zone", question: "Sur cet écran, clique sur l'indicateur du climat.",
            image: "images/combat-mega-evolution.webp", alt: "Écran de combat sous la tempête de sable",
            zones: { climat: { nom: "le climat (Tempête de sable 4/5)", rect: [15, 2, 52, 12] }, capacites: { nom: "les capacités", rect: [70, 48, 99, 97] } }, reponse: "climat",
            explication: "Le climat est affiché en haut à gauche, avec ses tours." },
          { type: "vf", question: "Un talent comme Sable Volant se réactive quand le Pokémon sort puis revient.", reponse: true,
            explication: "Il s'active à chaque entrée sur le terrain." },
          { type: "vf", question: "Le climat ne profite qu'au camp qui l'a lancé.", reponse: false,
            explication: "Il touche les deux camps." },
          { piege: true, type: "choix", question: "Tempête de sable active. Lequel de ces Pokémon perd des PV à la fin du tour ?",
            options: ["Oratoria (Eau / Fée)", "Tyranocif (Roche / Ténèbres)", "Métalosse (Acier / Psy)", "Aucun"], reponse: 0,
            explication: "Piège : Oratoria n'est ni Roche, ni Sol, ni Acier. Tyranocif et Métalosse sont protégés." }
        ]
      }
    ],
    examen: [
      { type: "choix", question: "Sous la pluie, que deviennent les capacités Eau ?",
        options: ["×1,5", "×0,5", "×2", "Inchangées"], reponse: 0, explication: "La pluie renforce l'Eau et affaiblit le Feu." },
      { type: "choix", question: "Sous le soleil, que deviennent les capacités Eau ?",
        options: ["×0,5", "×1,5", "×2", "Inchangées"], reponse: 0, explication: "Le soleil affaiblit l'Eau." },
      { type: "choix", question: "Quel climat renforce la Défense des Pokémon Glace ?",
        options: ["La neige", "La pluie", "Le soleil", "La tempête de sable"], reponse: 0, explication: "Neige : Défense des Glace ×1,5." },
      { type: "choix", question: "Quel climat renforce la Déf. Spé. des Pokémon Roche ?",
        options: ["La tempête de sable", "La neige", "Le soleil", "La pluie"], reponse: 0, explication: "Tempête de sable : Déf. Spé. des Roche ×1,5." },
      { type: "choix", question: "Sous quel climat Fatal-Foudre ne rate jamais ?",
        options: ["La pluie", "Le soleil", "La neige", "La tempête de sable"], reponse: 0, explication: "Sous la pluie, Fatal-Foudre et Vent Violent touchent toujours." },
      { type: "choix", question: "Combien de PV max la tempête de sable fait-elle perdre à la fin de chaque tour ?",
        options: ["1/16", "1/8", "1/4", "1/10"], reponse: 0, explication: "1/16 des PV max, sauf aux Roche, Sol et Acier." },
      { type: "nombre", question: "Combien de tours dure un climat sans objet ?", reponse: 5, explication: "5 tours." },
      { type: "assoc", question: "Associe chaque objet au climat qu'il prolonge.",
        paires: [["Roche Chaude", "Soleil"], ["Roche Humide", "Pluie"], ["Roche Lisse", "Tempête de sable"], ["Roche Glace", "Neige"]],
        explication: "Chaque roche prolonge son climat jusqu'à 8 tours." },
      { type: "assoc", question: "Associe chaque talent au climat qu'il lance.",
        paires: [["Sécheresse", "Soleil"], ["Crachin", "Pluie"], ["Sable Volant", "Tempête de sable"], ["Alerte Neige", "Neige"]],
        explication: "Ces talents lancent leur climat à l'entrée sur le terrain." },
      { type: "choix", question: "Que fait la capacité Zénith ?",
        image: "images/capacites/apprendre-zenith.webp", alt: "Description de Zénith",
        options: ["Invoque le soleil pendant 5 tours", "Invoque la pluie", "Crée un champ", "Soigne le lanceur"], reponse: 0,
        explication: "Zénith invoque le soleil sur tout le terrain." },
      { type: "choix", question: "Que fait Sable Volant ?",
        image: "images/talent-sable-volant.webp", alt: "Description de Sable Volant",
        options: ["Une tempête de sable de 5 tours à l'entrée du Pokémon", "Une tempête permanente", "Protège du sable", "Renforce les capacités Sol"], reponse: 0,
        explication: "Le talent s'active à l'entrée sur le terrain." },
      { type: "choix", question: "Quel champ protège des capacités prioritaires ?",
        options: ["Champ Psychique", "Champ Brumeux", "Champ Herbu", "Champ Électrifié"], reponse: 0, explication: "Le Champ Psychique, pour les Pokémon au sol." },
      { type: "choix", question: "Quel champ protège des altérations d'état ?",
        options: ["Champ Brumeux", "Champ Psychique", "Champ Herbu", "Champ Électrifié"], reponse: 0, explication: "Le Champ Brumeux, pour les Pokémon au sol." },
      { type: "choix", question: "Quel champ empêche de s'endormir ?",
        options: ["Champ Électrifié", "Champ Brumeux", "Champ Herbu", "Champ Psychique"], reponse: 0, explication: "Le Champ Électrifié." },
      { type: "choix", question: "De combien les champs renforcent-ils leur type de capacité ?",
        options: ["×1,3", "×1,5", "×2", "×1,1"], reponse: 0, explication: "×1,3 (Plante, Électrik ou Psy selon le champ)." },
      { type: "nombre", question: "Combien de tours dure un champ avec un Champ'Duit ?", reponse: 8, explication: "8 tours au lieu de 5." },
      { type: "choix", question: "Que fait Créa-Herbe ?",
        image: "images/talent-crea-herbe.webp", alt: "Description de Créa-Herbe",
        options: ["Crée un champ herbu de 5 tours à l'entrée", "Rend immunisé contre la Plante", "Soigne à chaque tour", "Invoque le soleil"], reponse: 0,
        explication: "Créa-Herbe crée un champ herbu quand le Pokémon arrive." },
      { type: "zone", question: "Sur cet écran de combat, clique sur le climat actif.",
        image: "images/combat-mega-evolution.webp", alt: "Écran de combat",
        zones: { climat: { nom: "le climat", rect: [15, 2, 52, 12] }, capacites: { nom: "les capacités", rect: [70, 48, 99, 97] }, mega: { nom: "le bouton Méga-Évolution", rect: [52, 74, 70, 97] } }, reponse: "climat",
        explication: "Le climat et ses tours restants sont affichés en haut à gauche." },
      { type: "vf", question: "Un nouveau climat remplace celui qui était actif.", reponse: true, explication: "Un seul climat à la fois." },
      { type: "vf", question: "Un champ et un climat peuvent être actifs en même temps.", reponse: true, explication: "Ce sont deux effets indépendants." },

      // ----- Questions pièges -----
      { piege: true, type: "vf", question: "Un champ affecte tous les Pokémon sur le terrain.", reponse: false,
        explication: "Piège : seulement ceux qui touchent le sol. Les Vol, Lévitation et Ballon y échappent." },
      { piege: true, type: "choix", question: "Champ Psychique actif. Un adversaire utilise Coup Bas sur un Pokémon de type Vol. Que se passe-t-il ?",
        options: ["Coup Bas fonctionne normalement", "Coup Bas échoue", "Coup Bas est renforcé", "Le Pokémon Vol est soigné"], reponse: 0,
        explication: "Piège : le Pokémon Vol ne touche pas le sol, le Champ Psychique ne le protège pas." },
      { piege: true, type: "choix", question: "Tyranocif lance une tempête de sable. Son partenaire est Oratoria (Eau / Fée). Que subit Oratoria ?",
        image: "images/talent-sable-volant.webp", alt: "Description de Sable Volant",
        options: ["Des dégâts à chaque fin de tour", "Rien, c'est le sable de son allié", "Un bonus de Déf. Spé.", "Rien, elle est Eau"], reponse: 0,
        explication: "Piège : le sable blesse tous les Pokémon qui ne sont pas Roche, Sol ou Acier, alliés compris." },
      { piege: true, type: "choix", question: "Le soleil est actif. Ton Oratoria utilise Mégaphone (devenu Eau avec Hydrata-Son). Quel effet du climat ?",
        options: ["×0,5", "×1,5", "Aucun", "×2"], reponse: 0,
        explication: "Piège : le soleil affaiblit les capacités Eau, même celles de ton propre Pokémon." },
      { piege: true, type: "choix", question: "Tu utilises Séisme sur un champ herbu. Quelle puissance a-t-il ?",
        image: "images/capacites/fiche-seisme.webp", alt: "Description de Séisme",
        options: ["50", "100", "130", "0"], reponse: 0,
        explication: "Piège : le champ herbu réduit Séisme de moitié : 100 → 50." },
      { piege: true, type: "vf", question: "Sous un climat, Synthèse rend toujours plus de PV.",
        image: "images/capacites/fiche-synthese.webp", alt: "Description de Synthèse", reponse: false,
        explication: "Piège : seulement au soleil (2/3). Sous la pluie, le sable ou la neige, elle ne rend que 1/4." },
      { piege: true, type: "choix", question: "Tempête de sable à 4/5. Il reste combien de tours après celui-ci ?",
        image: "images/combat-mega-evolution.webp", alt: "Tempête de sable 4/5",
        options: ["1", "4", "5", "0"], reponse: 0,
        explication: "Piège : 4/5 signifie 4e tour sur 5. Il en reste un." }
    ]
  }
  ]
};
