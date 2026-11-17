// =============================================================
//  PARCOURS VGC (combat double, Pokémon Champions)
//  Même structure que les Fondamentaux : cours -> leçons -> examen
//  Les ids de cours et de leçons : lettres et chiffres uniquement.
// =============================================================
window.SITE = window.SITE || {};
window.SITE.parcoursFormats = window.SITE.parcoursFormats || {};

window.SITE.parcoursFormats.vgc = {
  titre: "Parcours VGC",
  intro: "Le combat double, format officiel sur Pokémon Champions. Un cours pour maîtriser les bases du combat double, illustré par une vraie équipe Distorsion.",
  cours: [

  // ===========================================================
  //  COURS 1 · LE COMBAT DOUBLE
  // ===========================================================
  {
    id: "vgcdouble",
    titre: "Le combat double",
    objectifs: [
      "Connaître les règles du format VGC",
      "Bien choisir ses cibles en combat double",
      "Comprendre le rôle de chaque Pokémon d'une équipe",
      "Choisir ses 4 Pokémon et son duo de départ"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "format",
        titre: "Le format VGC",
        texte: `
<p>Le <strong>VGC</strong> (<em>Video Game Championships</em>) est le format officiel des compétitions Pokémon. Depuis 2026, il se joue sur <strong>Pokémon Champions</strong>. C'est un format en <strong>combat double</strong> : deux Pokémon de chaque côté.</p>
${capture({
  src: "images/combat-choix-action.webp",
  alt: "Un combat double sur Pokémon Champions",
  reperes: [
    { x: 21, y: 89, texte: "<strong>Tes 2 Pokémon</strong> sur le terrain (ici Farigiraf et Sarmuraï)." },
    { x: 76, y: 7, texte: "<strong>Les 2 Pokémon adverses</strong> (ici Minotaupe et Milobellus)." },
    { x: 89, y: 64, texte: "Pour <strong>chacun</strong> de tes Pokémon, tu choisis une action : attaquer ou changer." }
  ],
  legende: "Un tour de combat double : 2 contre 2, et deux choix à faire à chaque tour."
})}
<h2>Les règles du format</h2>
<table>
<tr><th>Règle</th><th>En VGC</th></tr>
<tr><td>Taille de l'équipe</td><td>6 Pokémon</td></tr>
<tr><td>Pokémon joués par combat</td><td><strong>4</strong>, choisis après l'aperçu des équipes</td></tr>
<tr><td>Sur le terrain</td><td><strong>2</strong> par camp (les 2 autres attendent en réserve)</td></tr>
<tr><td>Niveau</td><td>50</td></tr>
<tr><td>Objets</td><td>Deux Pokémon ne peuvent pas tenir le même objet</td></tr>
</table>
<p>La <strong>réglementation</strong> (les Pokémon et mécaniques autorisés) change au fil de la saison. Vérifie toujours celle en vigueur dans le jeu avant de construire ton équipe.</p>
<h2>Ce qui change par rapport au combat simple</h2>
<ul>
<li><strong>Deux décisions par tour</strong>, une pour chaque Pokémon.</li>
<li><strong>Le partenaire compte :</strong> on peut l'aider (Coup d'Main, soins), le protéger (Poudre Fureur)… ou le blesser par erreur (Séisme).</li>
<li><strong>Le soutien devient roi :</strong> Bluff, Intimidation, Distorsion, Abri… des capacités secondaires en simple deviennent essentielles en double.</li>
<li><strong>On change moins de Pokémon</strong> qu'en simple, mais chaque changement compte.</li>
</ul>
<div class="astuce"><b>Astuce :</b> en double, on pense en <strong>duos</strong>. La question n'est pas « quel Pokémon bat quel Pokémon ? », mais « quel duo bat quel duo ? ».</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque nombre à ce qu'il représente en VGC.",
            paires: [["6", "Pokémon dans l'équipe"], ["4", "Pokémon joués par combat"], ["2", "Pokémon de chaque camp sur le terrain"], ["50", "Niveau des Pokémon"]],
            commentaire: "On construit une équipe de 6, on en choisit 4, et 2 sont sur le terrain en même temps."
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien de Pokémon de chaque camp sont sur le terrain en même temps en VGC ?", reponse: 2,
            explication: "C'est un combat double : 2 contre 2." },
          { type: "nombre", question: "Combien de Pokémon joues-tu dans un combat VGC ?", reponse: 4,
            explication: "Tu choisis 4 Pokémon parmi tes 6." },
          { type: "vf", question: "En VGC, tu fais un seul choix d'action par tour.", reponse: false,
            explication: "Tu fais un choix pour chacun de tes 2 Pokémon sur le terrain." },
          { type: "choix", question: "Combien de Pokémon adverses faut-il mettre K.O. pour gagner une partie de VGC ?",
            options: ["4", "2", "6", "3"], reponse: 0,
            explication: "L'adversaire joue 4 Pokémon : il faut les mettre K.O. tous les 4." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "cibler",
        titre: "Cibler en double",
        texte: `
<p>En combat simple, une capacité vise forcément l'adversaire. En double, <strong>c'est toi qui choisis</strong> la cible, et ce choix change tout.</p>
<h2>Les capacités à cible unique</h2>
<p>Tu choisis quel adversaire tu vises. Tu peux même viser ton partenaire (pour lui lancer Coup d'Main, par exemple).</p>
${capture({
  src: "images/combat-choix-attaque.webp",
  alt: "Choix de la capacité de Farigiraf, avec l'efficacité sur la cible",
  reperes: [ { x: 92, y: 56, texte: "Le jeu affiche l'<strong>efficacité</strong> de chaque capacité sur la cible visée : regarde-la avant de valider." } ],
  legende: "Farigiraf choisit sa capacité : Tonnerre est « Super efficace » sur la cible."
})}
<h2>Les capacités de zone</h2>
<p>Certaines capacités touchent plusieurs Pokémon d'un coup. Leurs dégâts sont réduits à <strong>×0,75</strong> sur chaque cible, mais elles mettent la pression sur tout le camp adverse.</p>
<table>
<tr><th>Cible</th><th>Exemples dans l'équipe</th><th>À retenir</th></tr>
<tr><td>Les deux adversaires</td><td>Éboulement (Tyranocif), Mégaphone (Oratoria)</td><td>Sans danger pour ton partenaire</td></tr>
<tr><td>Tous les Pokémon</td><td>Séisme</td><td><strong>Touche aussi ton partenaire !</strong></td></tr>
</table>
<div class="boutons-caps"><img src="images/capacites/bouton-eboulement.webp" alt="Éboulement"><img src="images/capacites/bouton-megaphone.webp" alt="Mégaphone"></div>
<h2>Le double ciblage</h2>
<p>Viser <strong>le même adversaire avec tes deux Pokémon</strong>, c'est le double ciblage. Ça permet de mettre K.O. un Pokémon qui aurait survécu à un seul coup. Mais attention : si l'adversaire utilise Abri, tes deux capacités sont perdues.</p>
<div class="piege"><b>Piège à éviter :</b> viser un adversaire qui sera mis K.O. avant que ta capacité parte. Si ton partenaire, plus rapide, le met K.O. d'abord, ta capacité se reporte sur l'autre adversaire… qui y résiste peut-être.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Ton partenaire est Métalosse (Acier / Psy). Tu veux toucher les deux adversaires avec Tyranocif. Laquelle choisis-tu ?",
            options: [
              { texte: "Éboulement", bon: true, commentaire: "Oui : il touche les deux adversaires, et pas ton partenaire." },
              { texte: "Séisme", bon: false, commentaire: "Non : Séisme touche tous les Pokémon, Métalosse compris, et l'Acier est faible face au Sol !" },
              { texte: "Sabotage", bon: false, commentaire: "Sabotage ne vise qu'une seule cible." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "En double, une capacité qui touche les deux adversaires inflige :",
            options: ["×0,75 de dégâts sur chacun", "×1 sur chacun", "×0,5 sur chacun", "×1,5 sur chacun"], reponse: 0,
            explication: "Les capacités à plusieurs cibles sont réduites à ×0,75." },
          { type: "vf", question: "En double, Séisme touche aussi ton partenaire.", reponse: true,
            explication: "Sa cible est « Tous les Pokémon »." },
          { type: "choix", question: "Qu'est-ce que le double ciblage ?",
            options: ["Viser le même adversaire avec tes deux Pokémon", "Utiliser deux fois la même capacité", "Viser les deux adversaires avec une capacité de zone", "Changer deux Pokémon en même temps"], reponse: 0,
            explication: "Deux capacités sur la même cible pour la mettre K.O." },
          { type: "choix", question: "Lesquelles de ces capacités de l'équipe touchent les deux adversaires ?",
            options: [{ img: "images/capacites/bouton-eboulement.webp", alt: "Éboulement" }, { img: "images/capacites/bouton-sabotage.webp", alt: "Sabotage" }, { img: "images/capacites/bouton-pouvoir-lunaire.webp", alt: "Pouvoir Lunaire" }], reponse: 0,
            explication: "Éboulement touche les deux adversaires. Sabotage et Pouvoir Lunaire visent une seule cible." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "equipe",
        titre: "Une équipe Distorsion, Pokémon par Pokémon",
        texte: `
<p>Pour illustrer le combat double, on s'appuie sur une vraie équipe de compétition, construite autour de <strong>Distorsion</strong> : pendant 5 tours, les Pokémon les plus lents agissent en premier.</p>
${capture({
  src: "images/equipe-capacites.webp",
  alt: "L'équipe Distorsion, onglet Capacités",
  legende: "L'équipe sur l'écran d'équipe de Pokémon Champions."
})}
<h2>Le plan de jeu</h2>
<ol>
<li><strong>Poser Distorsion</strong> dès le début, en protégeant le lanceur.</li>
<li><strong>Frapper fort</strong> pendant les 5 tours avec des attaquants lents, qui passent alors en premier.</li>
<li><strong>Relancer Distorsion</strong> si besoin, grâce au deuxième lanceur.</li>
</ol>
<h2>Le rôle de chaque Pokémon</h2>
<table>
<tr><th>Pokémon</th><th>Rôle</th><th>Pourquoi il est là</th></tr>
<tr><td><strong>Farigiraf</strong></td><td>Lanceur de Distorsion n° 1</td><td>Son talent <strong>Armure Caudale</strong> bloque les capacités prioritaires adverses (Bluff, Provoc avec Farceur…) contre lui et son partenaire : Distorsion passe presque à coup sûr. Il aide aussi avec Coup d'Main.</td></tr>
<tr><td><strong>Félinferno</strong></td><td>Soutien et pivot</td><td><strong>Intimidation</strong> affaiblit les attaquants physiques adverses, <strong>Bluff</strong> fait reculer une menace au premier tour, et <strong>Dernier Mot</strong> baisse l'Attaque et l'Atq. Spé. de l'adversaire avant de laisser sa place : sous Distorsion, c'est un changement très efficace. Son Casque Brut punit les capacités de contact.</td></tr>
<tr><td><strong>Théffroyable</strong></td><td>Lanceur de Distorsion n° 2</td><td>Relance Distorsion si besoin, attire les coups avec <strong>Poudre Fureur</strong> et soigne son partenaire à l'entrée avec <strong>Aux Petits Soins</strong>.</td></tr>
<tr><td><strong>Tyranocif</strong></td><td>Attaquant physique et contrôle du climat</td><td>Très lent et très fort sous Distorsion. Sa <strong>Méga-Évolution relance la tempête de sable</strong> : c'est l'arme pour gagner la guerre des climats, dans un méta où la pluie et le soleil sont très présents.</td></tr>
<tr><td><strong>Oratoria</strong></td><td>Attaquante spéciale</td><td>La seule attaquante <strong>spéciale</strong> de l'équipe : elle passe les <strong>murs physiques</strong> (gros PV et grosse Défense) sur lesquels Tyranocif et Sarmuraï butent. Lente, avec un Mégaphone renforcé par Hydrata-Son qui touche les deux adversaires. Elle élimine en priorité les menaces comme <strong>Ténéfix</strong> avec Pouvoir Lunaire, et <strong>Aqua-Jet</strong>, prioritaire, achève un adversaire qui a survécu grâce à une <strong>Ceinture Force</strong>.</td></tr>
<tr><td><strong>Sarmuraï</strong></td><td>Attaquant physique (Méga)</td><td>Lent et puissant, il se joue en <strong>Méga-Évolution</strong>. Son talent devient alors <strong>Griffe Dure</strong>, qui renforce les capacités de contact : Tête de Fer, Vampirisme et Coup Bas en profitent toutes. Coup Bas sert à finir un adversaire.</td></tr>
</table>
<h2>Deux Méga-Gemmes, une seule Méga-Évolution</h2>
<p>Tyranocif et Sarmuraï tiennent tous les deux leur Méga-Gemme, mais <strong>un seul Pokémon peut méga-évoluer par combat</strong>. On choisit donc selon l'adversaire :</p>
<ul>
<li><strong>Méga-Tyranocif</strong> quand l'adversaire joue la pluie ou le soleil, pour relancer la tempête de sable ;</li>
<li><strong>Méga-Sarmuraï</strong> sinon, pour profiter de Griffe Dure et frapper fort au contact.</li>
</ul>
<h2>Les réponses aux menaces</h2>
<ul>
<li><strong>Un Vent Arrière adverse ?</strong> Il double la Vitesse de l'adversaire… donc sous Distorsion, il le fait passer encore plus tard. Ta Distorsion devient encore plus stable.</li>
<li><strong>La pluie ou le soleil adverse ?</strong> Tyranocif méga-évolue et relance la tempête de sable, qui remplace leur climat.</li>
<li><strong>Ténéfix (Farceur + Provoc) ?</strong> Tant que Farigiraf est là, Armure Caudale bloque sa Provoc prioritaire. Et Oratoria l'élimine vite : Pouvoir Lunaire (Fée) fait ×2 contre Ténèbres, plus le STAB.</li>
</ul>
<div class="astuce"><b>À retenir :</b> chaque Pokémon a une raison précise d'être dans l'équipe. Quand tu construiras la tienne, tu dois pouvoir dire en une phrase à quoi sert chacun de tes Pokémon.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque Pokémon de l'équipe à son rôle principal.",
            image: "images/equipe-capacites.webp", alt: "L'équipe, onglet Capacités",
            paires: [["Farigiraf", "Lanceur de Distorsion protégé"], ["Félinferno", "Soutien et pivot"], ["Tyranocif", "Attaquant et contrôle du climat"], ["Oratoria", "Attaquante spéciale"]],
            commentaire: "Farigiraf et Théffroyable lancent Distorsion, Félinferno soutient, les autres frappent."
          },
          {
            type: "situation",
            enonce: "L'adversaire lance Vent Arrière alors que ta Distorsion est active. Que se passe-t-il ?",
            image: "images/combat-effets-terrain.webp", alt: "Distorsion active",
            options: [
              { texte: "Ses Pokémon, plus rapides, agissent encore plus tard : c'est bon pour toi.", bon: true, commentaire: "Exactement : sous Distorsion, les plus rapides passent en dernier." },
              { texte: "Ses Pokémon passent en premier : c'est mauvais pour toi.", bon: false, commentaire: "Non : Distorsion inverse l'ordre, plus de Vitesse = agir plus tard." },
              { texte: "Vent Arrière annule Distorsion.", bon: false, commentaire: "Non, ce sont deux effets différents qui cohabitent." }
            ]
          },
          {
            type: "situation",
            enonce: "L'adversaire a amené la pluie. Quel Pokémon de l'équipe peut la remplacer par la tempête de sable ?",
            options: [
              { texte: "Tyranocif, en méga-évoluant", bon: true, commentaire: "Oui : sa Méga-Évolution relance la tempête de sable, qui remplace la pluie." },
              { texte: "Farigiraf, avec Distorsion", bon: false, commentaire: "Distorsion n'est pas un climat." },
              { texte: "Oratoria, avec Mégaphone", bon: false, commentaire: "Non, Mégaphone ne change pas le climat." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Pourquoi Farigiraf est-il un excellent lanceur de Distorsion ?",
            options: ["Armure Caudale bloque les capacités prioritaires adverses", "Il est très rapide", "Il a une Méga-Évolution", "Il est immunisé contre Bluff grâce à son type"], reponse: 0,
            explication: "Armure Caudale empêche l'adversaire de le gêner avec Bluff ou une Provoc prioritaire." },
          { type: "choix", question: "Que fait Dernier Mot, la capacité de Félinferno ?",
            options: ["Baisse l'Attaque et l'Atq. Spé. de la cible, puis Félinferno sort", "Met K.O. en un coup", "Soigne le partenaire", "Lance Distorsion"], reponse: 0,
            explication: "Il affaiblit l'adversaire et laisse sa place à un partenaire." },
          { type: "choix", question: "Dans quel cas méga-évoluer Tyranocif plutôt que Sarmuraï ?",
            options: ["Quand l'adversaire joue la pluie ou le soleil", "Quand l'adversaire a un Ténéfix", "Toujours, Méga-Sarmuraï est moins forte", "Quand Farigiraf est K.O."], reponse: 0,
            explication: "Dans un méta plein de pluie et de soleil, reprendre le contrôle du climat est essentiel." },
          { type: "choix", question: "En face, un Pokémon avec énormément de Défense encaisse tout ce que font Tyranocif et Sarmuraï. Qui envoies-tu ?",
            options: ["Oratoria, qui attaque sur le spécial", "Félinferno, avec Casque Brut", "Farigiraf, avec Coup d'Main sur Tyranocif", "Personne, on l'ignore"], reponse: 0,
            explication: "Un mur physique a une grosse Défense, pas forcément une grosse Défense Spéciale : Oratoria attaque sur le spécial." },
          { type: "vf", question: "Sous Distorsion, un Vent Arrière adverse avantage l'adversaire.", reponse: false,
            explication: "Il le rend plus rapide, donc il agit encore plus tard sous Distorsion." }
        ]
      },

      // ---------------- Leçon 4 ----------------
      {
        id: "apercu",
        titre: "L'aperçu des équipes",
        texte: `
<p>Avant chaque combat, tu vois les 6 Pokémon adverses (pas leurs sets) et tu as un temps limité pour choisir <strong>tes 4 Pokémon</strong> et <strong>ton duo de départ</strong>.</p>
${capture({
  src: "images/combat-selection-avantages.webp",
  alt: "Écran de sélection avec les flèches d'avantage",
  reperes: [
    { x: 9, y: 9, texte: "Le <strong>chronomètre</strong> : le temps est limité, prépare tes réflexes." },
    { x: 77, y: 37, texte: "Les flèches : avantage (vers le haut) ou désavantage (vers le bas) du Pokémon sélectionné face à chaque adversaire." }
  ],
  legende: "L'aperçu des équipes dans Pokémon Champions."
})}
<h2>En 3 questions</h2>
<ol>
<li><strong>Quelles sont les menaces ?</strong> Repère les 2 ou 3 adversaires les plus dangereux pour ton plan (un Ténéfix, un lanceur de pluie…).</li>
<li><strong>Qui répond à chaque menace ?</strong> Tes 4 Pokémon doivent avoir une réponse à chacune.</li>
<li><strong>Quel duo de départ ?</strong> Celui qui met ton plan en place dès le premier tour.</li>
</ol>
<h2>Le départ de l'équipe Distorsion</h2>
<p>Le départ habituel est <strong>Farigiraf + Félinferno</strong> :</p>
<ul>
<li>Félinferno entre avec <strong>Intimidation</strong> et peut utiliser <strong>Bluff</strong> pour faire reculer la menace la plus dangereuse ;</li>
<li>Farigiraf lance <strong>Distorsion</strong>, protégé par Armure Caudale contre les capacités prioritaires ;</li>
<li>ensuite, Félinferno utilise <strong>Dernier Mot</strong> pour laisser sa place à un attaquant lent, en affaiblissant l'adversaire au passage.</li>
</ul>
<p>Les deux Pokémon de réserve dépendent de l'adversaire : <strong>Tyranocif</strong> s'il y a de la pluie ou du soleil en face, <strong>Oratoria</strong> s'il y a un Ténéfix ou un mur physique, etc.</p>
${capture({
  src: "images/combat-ordre-depart.webp",
  alt: "Les 4 Pokémon choisis et leur ordre",
  reperes: [ { x: 18, y: 26.5, texte: "Les numéros : <strong>1 et 2</strong> commencent, 3 et 4 attendent en réserve." } ],
  legende: "Dans ce combat-là, le départ choisi était Farigiraf (1) et Sarmuraï (2) : le départ s'adapte à l'adversaire."
})}
<div class="astuce"><b>Astuce :</b> prépare à l'avance 2 ou 3 départs types selon les équipes que tu croises souvent. Le chronomètre ne laisse pas le temps de tout réfléchir.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "En face : un lanceur de pluie, un Ténéfix et quatre autres Pokémon. Qui mets-tu dans tes 4 ?",
            options: [
              { texte: "Farigiraf, Félinferno, Tyranocif et Oratoria", bon: true, commentaire: "Oui : le départ habituel, Tyranocif pour reprendre le climat, et Oratoria pour Ténéfix." },
              { texte: "Farigiraf, Théffroyable, Sarmuraï et Félinferno", bon: false, commentaire: "Il manque une réponse à la pluie (Tyranocif) et à Ténéfix (Oratoria). Méga-Sarmuraï est forte, mais elle ne change pas le climat." },
              { texte: "Les 4 plus puissants, peu importe l'adversaire", bon: false, commentaire: "Non : la sélection doit répondre aux menaces adverses." }
            ]
          },
          {
            type: "ordre",
            enonce: "Remets dans l'ordre le début de partie typique de l'équipe.",
            elements: ["Félinferno et Farigiraf entrent (Intimidation s'active)", "Bluff de Félinferno et Distorsion de Farigiraf", "Dernier Mot de Félinferno, un attaquant lent entre", "Les attaquants frappent en premier sous Distorsion"],
            commentaire: "On installe d'abord Distorsion, puis on fait entrer les attaquants au bon moment."
          }
        ],
        quiz: [
          { type: "choix", question: "Quel est le duo de départ habituel de l'équipe Distorsion ?",
            options: ["Farigiraf + Félinferno", "Tyranocif + Oratoria", "Sarmuraï + Théffroyable", "Oratoria + Félinferno"], reponse: 0,
            explication: "Félinferno soutient (Intimidation, Bluff) pendant que Farigiraf lance Distorsion." },
          { type: "choix", question: "Pendant l'aperçu, que vois-tu de l'équipe adverse ?",
            options: ["Les 6 Pokémon, mais pas leurs sets", "Leurs 4 Pokémon choisis", "Les sets complets", "Rien"], reponse: 0,
            explication: "Tu vois les espèces, pas les talents, objets ou capacités." },
          { type: "vf", question: "Le duo de départ doit toujours être le même, quel que soit l'adversaire.", reponse: false,
            explication: "On a un départ habituel, mais on l'adapte à l'équipe adverse." },
          { type: "choix", question: "Que signifie une flèche vers le haut pendant la sélection ?",
            image: "images/combat-selection-avantages.webp", alt: "Écran de sélection",
            options: ["Ton Pokémon sélectionné est avantagé face à cet adversaire", "L'adversaire est plus rapide", "L'adversaire a une Méga-Gemme", "Ton Pokémon est K.O."], reponse: 0,
            explication: "Flèche vers le haut : avantage. Vers le bas : désavantage." }
        ]
      }
    ],
    examen: [
      { type: "nombre", question: "Combien de Pokémon amènes-tu dans ton équipe en VGC ?", reponse: 6, explication: "6 Pokémon, dont 4 joués par combat." },
      { type: "nombre", question: "Combien de Pokémon joues-tu par combat ?", reponse: 4, explication: "4 Pokémon choisis après l'aperçu." },
      { type: "nombre", question: "À quel niveau sont les Pokémon en VGC sur Champions ?", reponse: 50, explication: "Niveau 50." },
      { type: "vf", question: "En VGC, deux Pokémon de l'équipe peuvent tenir le même objet.", reponse: false, explication: "Un objet ne peut être tenu qu'une fois par équipe." },
      { type: "vf", question: "En VGC, tu choisis tes 4 Pokémon avant de voir l'équipe adverse.", reponse: false, explication: "Tu choisis tes 4 après l'aperçu des 6 Pokémon adverses." },
      { type: "choix", question: "Sur cet écran, combien de choix d'action dois-tu faire ce tour-ci ?",
        image: "images/combat-choix-action.webp", alt: "Combat double",
        options: ["2, un par Pokémon", "1", "4", "6"], reponse: 0, explication: "Un choix pour chacun de tes 2 Pokémon sur le terrain." },
      { type: "choix", question: "Quel multiplicateur pour une capacité qui touche les deux adversaires ?",
        options: ["×0,75", "×1", "×0,5", "×1,5"], reponse: 0, explication: "Réduite à ×0,75 sur chaque cible." },
      { type: "choix", question: "Laquelle de ces capacités ne vise qu'une seule cible ?",
        options: [{ img: "images/capacites/bouton-eboulement.webp", alt: "Éboulement" }, { img: "images/capacites/bouton-megaphone.webp", alt: "Mégaphone" }, { img: "images/capacites/bouton-sabotage.webp", alt: "Sabotage" }], reponse: 2,
        explication: "Sabotage vise un seul Pokémon. Éboulement et Mégaphone touchent les deux adversaires." },
      { type: "vf", question: "Cradovague touche aussi ton partenaire.", image: "images/capacites/bouton-cradovague.webp", alt: "Cradovague", imagePetite: true, reponse: true,
        explication: "Comme Séisme, Cradovague touche tous les Pokémon autour du lanceur, partenaire compris." },
      { type: "choix", question: "Qu'est-ce que le double ciblage ?",
        options: ["Viser le même adversaire avec tes deux Pokémon", "Lancer deux capacités de zone", "Changer tes deux Pokémon", "Utiliser Abri deux fois"], reponse: 0, explication: "Deux capacités sur la même cible." },
      { type: "choix", question: "Quel est le risque du double ciblage ?",
        options: ["Si la cible utilise Abri, tes deux capacités sont perdues", "Il blesse ton partenaire", "Il baisse tes stats", "Aucun"], reponse: 0, explication: "Abri bloque les deux capacités d'un coup." },
      { type: "choix", question: "Quel est le plan de jeu de l'équipe de ce parcours ?",
        image: "images/equipe-capacites.webp", alt: "L'équipe",
        options: ["Poser Distorsion et frapper avec des attaquants lents", "Être plus rapide que tout le monde", "Gagner par la pluie", "Empoisonner l'adversaire"], reponse: 0, explication: "Une équipe Distorsion." },
      { type: "choix", question: "Quel Pokémon de l'équipe est le lanceur de Distorsion protégé par son talent ?",
        options: ["Farigiraf", "Tyranocif", "Oratoria", "Sarmuraï"], reponse: 0, explication: "Armure Caudale bloque les capacités prioritaires adverses." },
      { type: "choix", question: "Quel est le second lanceur de Distorsion de l'équipe ?",
        options: ["Théffroyable", "Félinferno", "Oratoria", "Tyranocif"], reponse: 0, explication: "Théffroyable a aussi Distorsion, avec Poudre Fureur et Aux Petits Soins." },
      { type: "choix", question: "À quoi sert Dernier Mot pour Félinferno ?",
        options: ["Affaiblir l'adversaire en sortant, pour faire entrer un attaquant", "Mettre K.O. un adversaire", "Lancer Distorsion", "Soigner Farigiraf"], reponse: 0, explication: "Baisse l'Attaque et l'Atq. Spé. de la cible, puis Félinferno laisse sa place." },
      { type: "choix", question: "Pourquoi Tyranocif méga-évolue-t-il dans cette équipe ?",
        image: "images/combat-mega-evolution.webp", alt: "Bouton Méga-Évolution de Tyranocif",
        options: ["Pour relancer la tempête de sable et gagner la guerre des climats", "Pour devenir plus rapide", "Pour changer de type en Eau", "Pour lancer Distorsion"], reponse: 0, explication: "La pluie et le soleil sont très présents : reprendre le climat est essentiel." },
      { type: "choix", question: "Quel Pokémon de l'équipe se charge de Ténéfix ?",
        options: ["Oratoria, avec Pouvoir Lunaire", "Tyranocif, avec Éboulement", "Félinferno, avec Bluff", "Théffroyable, avec Ball'Ombre"], reponse: 0, explication: "Pouvoir Lunaire (Fée) : ×2 contre Ténèbres, plus le STAB." },
      { type: "choix", question: "Quel est le duo de départ habituel ?",
        options: ["Farigiraf + Félinferno", "Tyranocif + Oratoria", "Sarmuraï + Farigiraf", "Théffroyable + Tyranocif"], reponse: 0, explication: "Félinferno soutient, Farigiraf lance Distorsion." },
      { type: "zone", question: "Sur cet écran, clique sur le Pokémon qui commence le combat aux côtés de Farigiraf (n° 1).",
        image: "images/combat-ordre-depart.webp", alt: "Les 4 Pokémon choisis, numérotés",
        zones: { sarmurai: { nom: "Sarmuraï (n° 2)", rect: [15, 16, 31, 27] }, theffroyable: { nom: "Théffroyable (non choisi)", rect: [15, 28, 31, 38] }, oratoria: { nom: "Oratoria (n° 3)", rect: [15, 51, 31, 62] }, felinferno: { nom: "Félinferno (n° 4)", rect: [15, 63, 31, 73] } }, reponse: "sarmurai",
        explication: "Les numéros 1 et 2 commencent : ici Farigiraf (1) et Sarmuraï (2). Oratoria et Félinferno attendent en réserve, Théffroyable n'a pas été choisi." },
      { type: "choix", question: "Pendant la sélection, que vois-tu de l'équipe adverse ?",
        image: "images/combat-selection.webp", alt: "Écran de sélection",
        options: ["Les 6 Pokémon, mais pas leurs sets", "Les sets complets", "Seulement 4 Pokémon", "Rien"], reponse: 0, explication: "Les espèces, pas les talents, objets ni capacités." },
      { type: "choix", question: "Lequel de ces talents de l'équipe s'active à l'entrée et aide au premier tour ?",
        options: ["Intimidation (Félinferno)", "Griffe Dure (Méga-Sarmuraï)", "Hydrata-Son (Oratoria)", "Armure Caudale (Farigiraf)"], reponse: 0, explication: "Intimidation baisse l'Attaque des adversaires dès l'entrée." },

      { type: "choix", question: "Quel talent a Sarmuraï une fois méga-évolué ?",
        options: ["Griffe Dure", "Repli Tactique", "Intimidation", "Sable Volant"], reponse: 0, explication: "Griffe Dure renforce ses capacités de contact." },
      { type: "multi", question: "Quelles capacités de Méga-Sarmuraï profitent de Griffe Dure ?",
        options: ["Tête de Fer", "Vampirisme", "Coup Bas", "Abri"], reponses: [0, 1, 2], explication: "Les trois sont des capacités de contact. Abri n'inflige pas de dégâts." },
      { type: "choix", question: "Pourquoi Oratoria est-elle utile contre un mur physique ?",
        options: ["Elle attaque sur le spécial, avec l'Atq. Spé.", "Elle a Intimidation", "Elle est la plus rapide", "Elle bloque les capacités prioritaires"], reponse: 0,
        explication: "Un mur physique résiste à l'Attaque, pas forcément à l'Atq. Spé." },
      { type: "choix", question: "Un adversaire survit à 1 PV grâce à sa Ceinture Force. Quelle capacité d'Oratoria l'achève avant qu'il agisse ?",
        options: [{ img: "images/capacites/bouton-aqua-jet.webp", alt: "Aqua-Jet" }, { img: "images/capacites/bouton-megaphone.webp", alt: "Mégaphone" }, { img: "images/capacites/bouton-pouvoir-lunaire.webp", alt: "Pouvoir Lunaire" }], reponse: 0,
        explication: "Aqua-Jet est prioritaire : il part avant les capacités normales, même faible, il suffit à finir 1 PV." },
      // ----- Questions pièges -----
      { piege: true, type: "vf", question: "Sous Distorsion, un Vent Arrière adverse fait agir ses Pokémon plus tôt.", reponse: false,
        explication: "Piège : Vent Arrière double leur Vitesse, et sous Distorsion les plus rapides agissent en dernier." },
      { piege: true, type: "choix", question: "Ténéfix (Farceur) veut lancer Provoc sur Farigiraf. Que se passe-t-il ?",
        options: ["Provoc échoue, bloquée par Armure Caudale", "Provoc passe en premier", "Provoc est renvoyée", "Farigiraf est mis K.O."], reponse: 0,
        explication: "Piège : Farceur rend Provoc prioritaire, et Armure Caudale bloque justement les capacités prioritaires adverses." },
      { piege: true, type: "vf", question: "Sous Distorsion, l'Aqua-Jet d'Oratoria part après les capacités des Pokémon lents.", reponse: false,
        explication: "Piège : Distorsion n'inverse l'ordre qu'entre capacités de même priorité. Aqua-Jet, prioritaire, part toujours avant les capacités normales." },
      { piege: true, type: "vf", question: "Une capacité qui touche « tous les Pokémon » épargne ton partenaire.", reponse: false,
        explication: "Piège : elle le touche aussi, comme Séisme." },
      { piege: true, type: "choix", question: "Tu veux méga-évoluer Tyranocif et Sarmuraï dans le même combat. C'est possible ?",
        options: ["Non, un seul Pokémon peut méga-évoluer par combat", "Oui, puisqu'ils tiennent tous les deux leur Méga-Gemme", "Oui, mais pas au même tour", "Seulement si les deux Méga-Gemmes sont différentes"], reponse: 0,
        explication: "Piège : avoir deux Méga-Gemmes ne permet pas deux Méga-Évolutions. Il faut choisir." },
      { piege: true, type: "choix", question: "Pouvoir Lunaire (Fée) d'Oratoria contre Ténéfix (Ténèbres / Spectre) : quel multiplicateur au total ?",
        options: ["×3", "×2", "×4", "×1,5"], reponse: 0,
        explication: "Piège : Fée est ×2 contre Ténèbres, ×1 contre Spectre, donc ×2… puis le STAB ×1,5 : ×3." }
    ]
  }

  ]
};
