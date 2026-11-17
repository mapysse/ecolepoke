// =============================================================
//  COURS DU FORMAT 6v6 OU (Pokémon Showdown)
//  Même structure que les Fondamentaux : cours -> leçons -> examen
//  Les ids de cours et de leçons : lettres et chiffres uniquement.
// =============================================================
window.SITE = window.SITE || {};
window.SITE.parcoursFormats = window.SITE.parcoursFormats || {};

window.SITE.parcoursFormats.ou = {
  titre: "Format 6v6 OU",
  intro: "Le combat simple en 6 contre 6 sur Pokémon Showdown, illustré par une équipe de compétition et une partie commentée.",
  cours: [

  {
    id: "ou6v6",
    titre: "Le combat en 6 contre 6",
    objectifs: [
      "Connaître les règles du 6v6 OU et ses clauses",
      "Se repérer sur l'écran de combat de Showdown",
      "Comprendre le rôle de chaque Pokémon d'une équipe offensive",
      "Lire une partie tour par tour"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "format",
        titre: "Le format 6v6 OU",
        texte: `
<p>Le <strong>6v6 OU</strong> se joue sur <strong>Pokémon Showdown</strong>, un simulateur de combat gratuit dans le navigateur. « OU » (<em>OverUsed</em>) désigne le tiers principal : les Pokémon les plus joués, à l'exception de ceux jugés trop puissants, qui sont bannis.</p>
<h2>Les règles du format</h2>
<table>
<tr><th>Règle</th><th>En 6v6 OU</th><th>Sur Champions, pour comparer</th></tr>
<tr><td>Pokémon joués</td><td><strong>Les 6</strong>, tous</td><td>4 (VGC) ou 3 (3v3)</td></tr>
<tr><td>Sur le terrain</td><td>1 par camp</td><td>2 (VGC) ou 1 (3v3)</td></tr>
<tr><td>Niveau</td><td><strong>100</strong></td><td>50</td></tr>
<tr><td>Points de stats</td><td>Les <strong>EV</strong> : 252 au maximum par stat, 510 au total</td><td>66 points, 32 au maximum par stat</td></tr>
<tr><td>Mécanique spéciale</td><td>La <strong>Téracristallisation</strong></td><td>La Méga-Évolution</td></tr>
<tr><td>Objets</td><td>Deux Pokémon peuvent tenir le même objet</td><td>Un objet une seule fois par équipe</td></tr>
</table>
<h2>Les clauses</h2>
<p>Au début de chaque partie, Showdown affiche les <strong>clauses</strong>, des règles qui interdisent certaines stratégies jugées trop aléatoires ou anti-jeu.</p>
${capture({
  src: "images/6v6/showdown-lead.webp",
  alt: "Début de partie sur Showdown, avec les clauses affichées",
  reperes: [
    { x: 44, y: 14, texte: "Le <strong>format</strong> : [Gen 9] OU, en match classé." },
    { x: 44, y: 30, texte: "Les <strong>clauses</strong> de la partie." },
    { x: 44, y: 44, texte: "Les <strong>deux équipes complètes</strong>, visibles avant le combat." }
  ],
  legende: "Le début d'une partie de 6v6 OU sur Showdown."
})}
<table>
<tr><th>Clause</th><th>Ce qu'elle interdit</th></tr>
<tr><td>Species Clause</td><td>Avoir deux fois le même Pokémon dans l'équipe</td></tr>
<tr><td>OHKO Clause</td><td>Les capacités qui mettent K.O. en un coup (Glaciation, Abîme…)</td></tr>
<tr><td>Evasion Clauses</td><td>Les objets, capacités et talents qui augmentent l'Esquive</td></tr>
<tr><td>Sleep Moves Clause</td><td>Les capacités qui endorment</td></tr>
<tr><td>Endless Battle Clause</td><td>Les stratégies qui font durer un combat à l'infini</td></tr>
</table>
<h2>La Téracristallisation</h2>
<p>Une fois par combat, un Pokémon peut <strong>téracristalliser</strong> : il prend son <strong>type Téracristal</strong>, choisi à la création de l'équipe, à la place de ses types. On s'en sert de deux façons :</p>
<ul>
<li><strong>En défense, en cas d'urgence :</strong> changer de type pour échapper à une faiblesse. Dracolosse (Dragon / Vol) est faible ×4 face à la Glace ; en Téracristal Spectre, il n'est plus que neutre.</li>
<li><strong>En attaque :</strong> obtenir un STAB plus puissant sur la capacité qui compte.</li>
</ul>
<div class="astuce"><b>À retenir :</b> en 6v6, tes 6 Pokémon jouent. Il n'y a pas de sélection : ton équipe doit tenir face à tout, et c'est le choix du <strong>Pokémon de départ</strong> qui s'adapte à l'adversaire.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque clause à ce qu'elle interdit.",
            paires: [["Species Clause", "Deux fois le même Pokémon"], ["OHKO Clause", "Les K.O. en un coup"], ["Sleep Moves Clause", "Les capacités qui endorment"], ["Evasion Clause", "Augmenter l'Esquive"]],
            commentaire: "Les clauses retirent les stratégies trop aléatoires ou anti-jeu."
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien de Pokémon joues-tu dans une partie de 6v6 OU ?", reponse: 6,
            explication: "Tous les Pokémon de l'équipe jouent." },
          { type: "nombre", question: "À quel niveau sont les Pokémon en 6v6 OU ?", reponse: 100,
            explication: "Niveau 100, contre 50 sur Pokémon Champions." },
          { type: "vf", question: "La Species Clause interdit d'avoir deux fois le même Pokémon dans l'équipe.", reponse: true,
            explication: "Chaque Pokémon ne peut apparaître qu'une fois." },
          { type: "choix", question: "Combien de fois un Pokémon de ton équipe peut-il téracristalliser par combat ?",
            options: ["Un seul Pokémon, une seule fois", "Chaque Pokémon une fois", "Autant de fois qu'on veut", "Une fois par tour"], reponse: 0,
            explication: "La Téracristallisation est utilisable une seule fois par combat, comme la Méga-Évolution sur Champions." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "showdown",
        titre: "Se repérer sur Showdown",
        texte: `
<p>Showdown affiche tout ce qu'il faut pour jouer, mais l'écran est dense. Voici où trouver chaque information.</p>
<h2>Choisir son Pokémon de départ</h2>
<p>Après l'aperçu des deux équipes, Showdown te demande « Comment commencerez-vous le match ? » : tu choisis ton <strong>lead</strong>, le Pokémon qui entre en premier.</p>
${capture({
  src: "images/6v6/showdown-lead.webp",
  alt: "Le choix du Pokémon de départ sur Showdown",
  reperes: [ { x: 22, y: 54, texte: "Les boutons pour <strong>choisir ton lead</strong> parmi tes 6 Pokémon." } ],
  legende: "« Choisir un Lead » : le premier choix de la partie."
})}
<h2>L'écran de combat</h2>
${capture({
  src: "images/6v6/showdown-tour1.webp",
  alt: "L'écran de combat de Showdown au tour 1",
  reperes: [
    { x: 4, y: 56, texte: "<strong>Attaquer</strong> : tes 4 capacités, avec leur type et leurs PP." },
    { x: 30, y: 66, texte: "<strong>Terastallize</strong> : la case à cocher pour téracristalliser en même temps que la capacité." },
    { x: 4, y: 74, texte: "<strong>Switcher</strong> : changer de Pokémon." },
    { x: 37, y: 52, texte: "<strong>Timer</strong> : le minuteur, qui limite le temps de réflexion." },
    { x: 66, y: 57, texte: "L'<strong>historique</strong> : tout ce qui s'est passé, tour par tour." }
  ],
  legende: "Le tour 1 : Sorcilence face à Démétéros, dont l'Intimidation vient de baisser son Attaque (×0,67)."
})}
<h2>L'aide au survol</h2>
<p>En survolant une capacité, Showdown affiche sa puissance, sa précision, son effet et son <strong>efficacité</strong> contre le Pokémon adverse.</p>
${capture({
  src: "images/6v6/showdown-tour12.webp",
  alt: "L'aide au survol de Séisme, extrêmement efficace contre Mite-de-Fer",
  petite: true,
  reperes: [ { x: 24, y: 39, texte: "« Extremely effective (4×) » : Séisme (Sol) contre Mite-de-Fer (Feu / Poison)." } ],
  legende: "L'aide au survol de Séisme, au tour 12."
})}
<div class="piege"><b>Piège à éviter :</b> l'efficacité affichée correspond aux types <strong>actuels</strong> de l'adversaire. S'il téracristallise ce tour-ci, ses types changent avant que ta capacité le touche.</div>
<div class="astuce"><b>Astuce :</b> Showdown est en partie en anglais. Les types des capacités (Psychic, Fairy, Ground…) et l'aide au survol restent souvent en anglais, même avec l'interface en français.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Tu veux téracristalliser Dracolosse et utiliser Cryo-Pirouette dans le même tour. Que fais-tu ?",
            image: "images/6v6/showdown-tour2.webp", alt: "L'écran de combat avec Dracolosse",
            options: [
              { texte: "Cocher « Terastallize », puis cliquer sur Cryo-Pirouette", bon: true, commentaire: "Oui : la case se coche avant de choisir la capacité." },
              { texte: "Cliquer sur Cryo-Pirouette, puis sur « Terastallize » au tour suivant", bon: false, commentaire: "Non : il téracristalliserait seulement au tour suivant." },
              { texte: "Changer de Pokémon", bon: false, commentaire: "Changer de Pokémon ne téracristallise pas." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Comment s'appelle le Pokémon qui entre en premier dans la partie ?",
            options: ["Le lead", "Le pivot", "Le nettoyeur", "Le mur"], reponse: 0,
            explication: "On le choisit après l'aperçu des équipes." },
          { type: "choix", question: "Où retrouver tout ce qui s'est passé pendant la partie ?",
            options: ["Dans l'historique, à droite", "Dans le bouton Timer", "Dans le menu Switcher", "Nulle part"], reponse: 0,
            explication: "L'historique affiche chaque action, tour par tour." },
          { type: "choix", question: "Que signifie « Extremely effective (4×) » dans l'aide au survol ?",
            image: "images/6v6/showdown-tour12.webp", alt: "Aide au survol de Séisme",
            options: ["La capacité est super efficace sur les deux types : ×4", "La capacité touche 4 fois", "Elle a 4 PP", "Elle est 4 fois plus précise"], reponse: 0,
            explication: "Sol est super efficace contre le Feu et contre le Poison : ×2 × ×2 = ×4." },
          { type: "vf", question: "Sur Showdown, on choisit de téracristalliser en cochant une case avant de choisir sa capacité.", reponse: true,
            explication: "La case « Terastallize » se trouve sous les capacités." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "equipe",
        titre: "Une équipe offensive, Pokémon par Pokémon",
        texte: `
<p>Cette équipe de compétition est publiée sur <a href="https://www.coupcritique.fr/entity/teams/8085" target="_blank" rel="noopener">Coup Critique</a>. C'est une équipe <strong>hyper-offensive</strong> : elle met une pression constante sur l'adversaire avec des attaquants physiques, qui se renforcent avec Danse Lames ou Danse Draco.</p>
${capture({
  src: "images/6v6/equipe6v6.webp",
  alt: "L'équipe dans le constructeur d'équipes de Showdown",
  petite: true,
  legende: "L'équipe dans le constructeur d'équipes de Showdown : objet, talent, type Téracristal, capacités et EV."
})}
<h2>Le plan de jeu</h2>
<ul>
<li><strong>Garder la pression :</strong> chaque tour, l'adversaire doit répondre à une menace.</li>
<li><strong>Échanger intelligemment :</strong> accepter de perdre un Pokémon si c'est pour en faire tomber un plus important en face.</li>
<li><strong>Garder le Vœu Soin de Sorcilence pour la fin</strong>, pour remettre un attaquant en pleine forme au moment décisif.</li>
</ul>
<h2>Le rôle de chaque Pokémon</h2>
<table>
<tr><th>Pokémon</th><th>Rôle</th><th>Pourquoi il est là</th></tr>
<tr><td><strong>Dracolosse</strong></td><td>Condition de victoire principale</td><td>Il se renforce avec <strong>Danse Draco</strong> (Attaque et Vitesse). <strong>Multiécaille</strong> réduit les dégâts reçus tant qu'il a tous ses PV, et <strong>Encore</strong> bloque l'adversaire sur sa dernière capacité. Son Téracristal Spectre le sauve en fin de partie.</td></tr>
<tr><td><strong>Sorcilence</strong></td><td>Soutien défensif</td><td><strong>Miroir Magik</strong> renvoie les pièges adverses. Elle encaisse les coups physiques (Casque Brut), paralyse avec Frotte-Frimousse et garde <strong>Vœu Soin</strong> : elle est mise K.O., mais le Pokémon qui la remplace récupère tous ses PV.</td></tr>
<tr><td><strong>Dimoret</strong></td><td>Attaquant rapide</td><td>Souvent au départ grâce à sa <strong>Ceinture Force</strong>, sans que ce soit automatique. Il met la pression tôt pour ouvrir la voie aux autres attaquants. <strong>Chute Glace</strong> peut faire reculer l'adversaire.</td></tr>
<tr><td><strong>Ogerpon-Puits</strong></td><td>Attaquant avec Danse Lames</td><td>Son masque renforce ses capacités et <strong>Absorb Eau</strong> l'immunise contre l'Eau. Il encaisse aussi certains coups pour protéger les PV de Sorcilence.</td></tr>
<tr><td><strong>Scalpereur</strong></td><td>Nettoyeur de fin de partie</td><td><strong>Général Suprême</strong> le renforce pour chaque allié K.O., et <strong>Coup Bas</strong> achève les adversaires plus rapides. On le fait souvent entrer et sortir : il craint l'usure des pièges.</td></tr>
<tr><td><strong>Fort-Ivoire</strong></td><td>Encaisseur et contrôle des pièges</td><td>Sa <strong>Veste de Combat</strong> l'aide à encaisser les capacités spéciales. <strong>Tour Rapide</strong> retire les pièges quand Miroir Magik ne suffit pas.</td></tr>
</table>
<div class="format"><b>Pas de Piège de Roc ?</b> C'est un choix : l'équipe préfère attaquer à chaque tour. Pour les pièges adverses, elle compte sur Miroir Magik et Tour Rapide.</div>
<h2>Quand téracristalliser ?</h2>
<ul>
<li><strong>En défense, en cas d'extrême urgence :</strong> échapper à une faiblesse qui ferait perdre un Pokémon clé.</li>
<li><strong>En attaque :</strong> obtenir un gros STAB sur l'attaquant qui doit faire la différence.</li>
</ul>
<div class="astuce"><b>À retenir :</b> l'équipe est réputée difficile à piloter, avec peu de place pour l'erreur. Le choix du lead et la gestion du Vœu Soin décident souvent de la partie.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque Pokémon de l'équipe à son rôle principal.",
            image: "images/6v6/equipe6v6.webp", alt: "L'équipe dans le constructeur de Showdown",
            paires: [["Dracolosse", "Condition de victoire principale"], ["Sorcilence", "Soutien avec Vœu Soin"], ["Fort-Ivoire", "Retire les pièges"], ["Scalpereur", "Nettoyeur de fin de partie"]],
            commentaire: "Une équipe offensive a quand même besoin de soutien et de contrôle des pièges."
          },
          {
            type: "situation",
            enonce: "Dracolosse (Dragon / Vol) est menacé par une capacité Glace qui le mettrait K.O. C'est ton Pokémon clé. Que fais-tu ?",
            options: [
              { texte: "Téracristalliser en Spectre", bon: true, commentaire: "Oui : en Spectre, la Glace n'est plus que neutre (×1) au lieu de ×4. C'est l'usage défensif d'urgence." },
              { texte: "Utiliser Danse Draco", bon: false, commentaire: "Il risque d'être mis K.O. avant d'en profiter." },
              { texte: "Rien, Multiécaille suffit toujours", bon: false, commentaire: "Multiécaille aide à PV pleins, mais ne compense pas une faiblesse ×4." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Que fait Vœu Soin ?",
            options: ["Sorcilence est mise K.O., et son remplaçant récupère tous ses PV", "Soigne Sorcilence", "Soigne toute l'équipe", "Protège pendant un tour"], reponse: 0,
            explication: "C'est un sacrifice : on le garde pour remettre un attaquant en forme au bon moment." },
          { type: "choix", question: "Quand Multiécaille réduit-il les dégâts ?",
            options: ["Quand Dracolosse a tous ses PV", "Toujours", "Sous la pluie", "Contre les capacités spéciales"], reponse: 0,
            explication: "Dès que Dracolosse a perdu des PV, Multiécaille ne fait plus rien." },
          { type: "choix", question: "Quel Pokémon de l'équipe retire les pièges ?",
            options: ["Fort-Ivoire, avec Tour Rapide", "Dimoret", "Scalpereur", "Ogerpon-Puits"], reponse: 0,
            explication: "Tour Rapide retire les pièges de son camp." },
          { type: "vf", question: "Cette équipe pose Piège de Roc.", reponse: false,
            explication: "Elle préfère attaquer, et compte sur Miroir Magik et Tour Rapide contre les pièges adverses." },
          { type: "choix", question: "Quelle est la condition de victoire principale de l'équipe ?",
            options: ["Dracolosse", "Sorcilence", "Fort-Ivoire", "Ogerpon-Puits"], reponse: 0,
            explication: "L'équipe prépare souvent le terrain pour que Dracolosse nettoie la fin de partie." }
        ]
      },

      // ---------------- Leçon 4 ----------------
      {
        id: "partie",
        titre: "Une partie commentée",
        texte: `
<p>Voici une vraie partie avec cette équipe, du premier tour à la victoire. Avance étape par étape.</p>
${diaporama({ etapes: [
  { src: "images/6v6/showdown-tour1.webp", alt: "Tour 1 : Sorcilence face à Démétéros",
    titre: "Tour 1 : changer face au lead adverse",
    texte: "Sorcilence entre face à Démétéros, dont l'Intimidation baisse son Attaque. Démétéros ne posera pas Piège de Roc : Miroir Magik le lui renverrait. Il va donc attaquer, sûrement avec Séisme ou Demi-Tour. Sorcilence sort pour Dracolosse, qui encaisse parfaitement les deux : il est immunisé contre le Sol (type Vol), résiste à Demi-Tour, et Multiécaille réduit encore les dégâts. Démétéros utilise Demi-Tour, pas très efficace, et laisse sa place à Latias." },
  { src: "images/6v6/showdown-tour2.webp", alt: "Tour 2 : Dracolosse face à Latias",
    titre: "Tour 2 : se renforcer",
    texte: "Latias utilise Vampibaiser, super efficace. Dracolosse utilise Danse Draco : son Attaque et sa Vitesse augmentent d'un cran." },
  { src: "images/6v6/showdown-tour3.webp", alt: "Tour 3 : Latias K.O.",
    titre: "Tour 3 : frapper",
    texte: "Renforcé, Dracolosse met Latias K.O. avec Cryo-Pirouette, super efficace contre le Dragon. Les Restes lui rendent des PV à chaque fin de tour." },
  { src: "images/6v6/showdown-tour12.webp", alt: "Tour 12 : Dracolosse face à Mite-de-Fer",
    titre: "Tours 9 à 12 : le nettoyage",
    texte: "Après une deuxième Danse Draco, Dracolosse met K.O. Insécateur puis Ogerpon. Mite-de-Fer entre : Séisme est extrêmement efficace (×4) contre lui… mais il téracristallise en Feu et ne subit plus que ×2. Le Séisme le met quand même K.O., avec un coup critique." },
  { src: "images/6v6/showdown-tour15.webp", alt: "Tour 15 : Encore sur Rampe-Ailes",
    titre: "Tours 13 à 17 : Encore",
    texte: "Démétéros tombe à son tour. Rampe-Ailes entre et use Dracolosse avec Demi-Tour. Dracolosse utilise Encore : Rampe-Ailes est bloqué sur Demi-Tour, pas très efficace. Mais l'usure finit par mettre Dracolosse K.O." },
  { src: "images/6v6/showdown-victoire.webp", alt: "Tour 18 : victoire",
    titre: "Tour 18 : la victoire",
    texte: "Dimoret entre et achève Rampe-Ailes avec Chute Glace. Il reste 5 Pokémon à l'équipe : Dracolosse a fait presque tout le travail." }
] })}
<h2>Ce qu'il faut retenir</h2>
<ul>
<li><strong>L'anticipation du tour 1</strong> : Miroir Magik rendait Piège de Roc inutile pour Démétéros, donc il allait attaquer. Dracolosse, immunisé contre Séisme et résistant à Demi-Tour, est entré sans risque pour lancer son plan.</li>
<li><strong>Le renforcement au bon moment</strong> : une Danse Draco face à un adversaire qui ne peut pas le menacer suffisamment, et Dracolosse devient très difficile à arrêter.</li>
<li><strong>Lire l'historique</strong> : c'est là qu'on voit la Téracristallisation adverse, les coups critiques, les objets qui s'activent.</li>
<li><strong>Le contrôle avec Encore</strong> : bloquer l'adversaire sur une capacité peu dangereuse donne des tours gratuits.</li>
</ul>
<div class="astuce"><b>Astuce :</b> sur Showdown, tu peux revoir tes parties (les <em>replays</em>) avec les boutons « Tour précédent » et « Passer le tour ». C'est le meilleur moyen de comprendre tes erreurs.</div>`,
        exercices: [
          {
            type: "ordre",
            enonce: "Remets dans l'ordre les étapes de la partie.",
            elements: ["Sorcilence sort pour Dracolosse, qui encaisse Demi-Tour", "Dracolosse utilise Danse Draco", "Cryo-Pirouette met Latias K.O.", "Séisme met Mite-de-Fer K.O.", "Dimoret achève Rampe-Ailes"],
            commentaire: "Entrer, se renforcer, frapper, et finir avec un autre attaquant."
          }
        ],
        quiz: [
          { type: "choix", question: "Pourquoi Sorcilence sort-elle dès le tour 1 ?",
            image: "images/6v6/showdown-tour1.webp", alt: "Tour 1",
            options: ["Démétéros ne posera pas Piège de Roc (Miroir Magik) et va attaquer : Dracolosse encaisse Séisme et Demi-Tour", "Elle est K.O.", "Pour utiliser Vœu Soin", "Elle est bloquée par Encore"], reponse: 0,
            explication: "Miroir Magik a déjà fait son travail : Démétéros ne posera pas de piège. Il reste Séisme (Dracolosse est immunisé grâce au type Vol) ou Demi-Tour (résisté, et réduit par Multiécaille)." },
          { piege: true, type: "choix", question: "Au tour 1, Démétéros utilise Séisme au moment où Dracolosse entre. Que se passe-t-il ?",
            options: ["Aucun effet : Dracolosse est de type Vol", "×2", "×0,5", "Dégâts réduits par Multiécaille seulement"], reponse: 0,
            explication: "Le Vol est immunisé contre le Sol : c'est pour ça que Dracolosse entre sans risque." },
          { type: "choix", question: "Que fait Danse Draco ?",
            options: ["Augmente l'Attaque et la Vitesse d'un cran", "Augmente l'Attaque de deux crans", "Soigne Dracolosse", "Inflige des dégâts Dragon"], reponse: 0,
            explication: "Un cran d'Attaque et un cran de Vitesse (×1,5 chacun)." },
          { type: "choix", question: "Mite-de-Fer (Feu / Poison) téracristallise en Feu avant le Séisme. Quel multiplicateur ?",
            options: ["×2", "×4", "×1", "×0"], reponse: 0,
            explication: "En Téracristal Feu, il n'est plus que de type Feu : Sol contre Feu, ×2." },
          { type: "choix", question: "Que fait Encore sur Rampe-Ailes ?",
            options: ["Le bloque sur sa dernière capacité, Demi-Tour", "Le met K.O.", "Baisse son Attaque", "L'empêche de changer de Pokémon"], reponse: 0,
            explication: "Bloqué sur Demi-Tour, pas très efficace contre Dracolosse." }
        ]
      }
    ],
    examen: [
      { type: "nombre", question: "Combien de Pokémon joues-tu dans une partie de 6v6 OU ?", reponse: 6, explication: "Tous les 6." },
      { type: "nombre", question: "À quel niveau sont les Pokémon en 6v6 OU ?", reponse: 100, explication: "Niveau 100." },
      { type: "nombre", question: "Combien d'EV peut-on mettre au maximum dans une seule statistique ?", reponse: 252, explication: "252 par stat, 510 au total." },
      { type: "choix", question: "Sur quel site joue-t-on au 6v6 OU ?",
        options: ["Pokémon Showdown", "Pokémon Champions", "Coup Critique", "Poképédia"], reponse: 0, explication: "Showdown, un simulateur gratuit dans le navigateur." },
      { type: "choix", question: "Que désigne « OU » ?",
        options: ["Le tiers des Pokémon les plus joués (OverUsed)", "Un type de combat double", "Une clause", "Un objet"], reponse: 0, explication: "OverUsed : le tiers principal de Showdown." },
      { type: "choix", question: "Quelle mécanique remplace la Méga-Évolution en 6v6 OU ?",
        options: ["La Téracristallisation", "La Dynamax", "Les capacités Z", "Aucune"], reponse: 0, explication: "Une fois par combat, un Pokémon prend son type Téracristal." },
      { type: "choix", question: "Que dit la Species Clause ?",
        image: "images/6v6/showdown-lead.webp", alt: "Les clauses de la partie",
        options: ["Un seul exemplaire de chaque Pokémon par équipe", "Pas de capacités qui endorment", "Pas de K.O. en un coup", "Pas d'objet en double"], reponse: 0, explication: "« Limit one of each Pokemon »." },
      { type: "choix", question: "D'après les clauses affichées, lesquelles de ces capacités sont interdites ?",
        image: "images/6v6/showdown-lead.webp", alt: "Les clauses de la partie",
        options: ["Les capacités qui endorment", "Les capacités prioritaires", "Les capacités de pivot", "Les capacités de soin"], reponse: 0, explication: "Sleep Moves Clause : capacités infligeant sommeil bannies." },
      { type: "vf", question: "En 6v6 OU, deux Pokémon de l'équipe peuvent tenir le même objet.", reponse: true, explication: "Cette règle n'existe pas sur Showdown." },
      { type: "choix", question: "Sur cet écran, à quoi sert la case « Terastallize » ?",
        image: "images/6v6/showdown-tour1.webp", alt: "Écran de combat Showdown",
        options: ["Téracristalliser en même temps que la capacité choisie", "Changer de Pokémon", "Lancer le minuteur", "Abandonner"], reponse: 0, explication: "On la coche avant de cliquer sur la capacité." },
      { type: "choix", question: "Que signifie « 0.67× Atq » sous les PV de Sorcilence ?",
        image: "images/6v6/showdown-tour1.webp", alt: "Tour 1",
        options: ["Son Attaque a baissé d'un cran (Intimidation)", "Elle a perdu 67 % de ses PV", "Elle est paralysée", "Elle a téracristallisé"], reponse: 0, explication: "Intimidation de Démétéros : −1 cran d'Attaque, soit ×0,67." },
      { type: "choix", question: "Que montre « 1.5× Atq » et « 1.5× Vit » sous Dracolosse ?",
        image: "images/6v6/showdown-tour3.webp", alt: "Tour 3",
        options: ["Danse Draco a augmenté son Attaque et sa Vitesse d'un cran", "Il a téracristallisé", "Il tient un Mouchoir Choix", "Il est sous la pluie"], reponse: 0, explication: "+1 cran : ×1,5." },
      { type: "choix", question: "Quel est le rôle de Dracolosse dans l'équipe ?",
        options: ["Condition de victoire principale", "Poseur de pièges", "Soutien défensif", "Retirer les pièges"], reponse: 0, explication: "Danse Draco, Multiécaille et Encore en font la menace principale." },
      { type: "choix", question: "Quel est le rôle de Fort-Ivoire ?",
        options: ["Encaisser et retirer les pièges avec Tour Rapide", "Condition de victoire principale", "Soigner l'équipe", "Poser Piège de Roc"], reponse: 0, explication: "Veste de Combat et Tour Rapide." },
      { type: "choix", question: "Pourquoi garder le Vœu Soin de Sorcilence pour la fin ?",
        options: ["Pour remettre un attaquant en pleine forme au moment décisif", "Parce qu'il ne marche qu'au dernier tour", "Pour soigner Sorcilence", "Pour retirer les pièges"], reponse: 0, explication: "Sorcilence se sacrifie : il faut que ça compte." },
      { type: "choix", question: "Dans quels cas téracristalliser ?",
        options: ["En urgence pour échapper à une faiblesse, ou pour un gros STAB", "Toujours au premier tour", "Seulement sur le dernier Pokémon", "Jamais en défense"], reponse: 0, explication: "Défense d'urgence ou attaque décisive." },
      { type: "choix", question: "Quelle capacité de Dracolosse est super efficace contre Latias ?",
        image: "images/6v6/showdown-tour2.webp", alt: "Aide au survol de Cryo-Pirouette",
        options: ["Cryo-Pirouette", "Séisme", "Encore", "Danse Draco"], reponse: 0, explication: "Glace contre Dragon : ×2." },
      { type: "zone", question: "Sur cet écran, clique sur la zone où l'on change de Pokémon.",
        image: "images/6v6/showdown-tour1.webp", alt: "Écran de combat Showdown",
        zones: {
          attaquer: { nom: "Attaquer", rect: [0, 53, 42, 62] },
          tera: { nom: "Terastallize", rect: [15, 63, 28, 70] },
          switcher: { nom: "Switcher", rect: [0, 70.5, 42, 79] },
          historique: { nom: "L'historique", rect: [43, 0, 100, 100] }
        }, reponse: "switcher",
        explication: "« Switcher » : les boutons pour changer de Pokémon." },
      { type: "ordre", question: "Remets dans l'ordre le début de la partie.",
        elements: ["Sorcilence entre face à Démétéros", "Sorcilence sort pour Dracolosse", "Dracolosse utilise Danse Draco", "Dracolosse met Latias K.O."],
        explication: "Changer, se renforcer, frapper." },
      { type: "choix", question: "Qui achève la partie ?",
        image: "images/6v6/showdown-victoire.webp", alt: "Tour 18",
        options: ["Dimoret, avec Chute Glace", "Dracolosse, avec Séisme", "Scalpereur, avec Coup Bas", "Sorcilence"], reponse: 0, explication: "Dimoret achève Rampe-Ailes au tour 18." },

      { type: "choix", question: "Au tour 1, pourquoi Démétéros ne pose-t-il pas Piège de Roc face à Sorcilence ?",
        image: "images/6v6/showdown-tour1.webp", alt: "Tour 1",
        options: ["Miroir Magik le renverrait dans son propre camp", "Il ne connaît pas cette capacité", "Les pièges sont interdits en OU", "Intimidation l'en empêche"], reponse: 0,
        explication: "Miroir Magik renvoie les pièges : Démétéros va donc attaquer, et Sorcilence peut laisser sa place à Dracolosse." },
      // ----- Questions pièges -----
      { piege: true, type: "choix", question: "Dracolosse (Dragon / Vol) téracristallise en Spectre. Une capacité Glace lui fait :",
        options: ["×1", "×4", "×2", "×0"], reponse: 0,
        explication: "Piège : en Téracristal, il n'est plus que Spectre. La Glace est neutre contre le Spectre." },
      { piege: true, type: "choix", question: "Mite-de-Fer (Feu / Poison) téracristallise en Feu au moment où Séisme le touche. Quel multiplicateur ?",
        image: "images/6v6/showdown-tour12.webp", alt: "Aide au survol de Séisme (4×)",
        options: ["×2", "×4", "×1", "×0,5"], reponse: 0,
        explication: "Piège : l'aide affiche ×4 avant la Téracristallisation. En Feu seul, Séisme fait ×2." },
      { piege: true, type: "vf", question: "Vœu Soin soigne Sorcilence.", reponse: false,
        explication: "Piège : Sorcilence est mise K.O., c'est le Pokémon qui la remplace qui est soigné." },
      { piege: true, type: "vf", question: "Après le Demi-Tour de Démétéros, Multiécaille protège encore Dracolosse.", reponse: false,
        explication: "Piège : Multiécaille ne marche qu'à PV pleins. Demi-Tour lui a fait perdre des PV." },
      { piege: true, type: "choix", question: "Dracolosse (Dragon / Vol) utilise Séisme contre un Pokémon Électrik / Vol. Que se passe-t-il ?",
        options: ["Aucun effet : le Vol est immunisé contre le Sol", "×2 contre l'Électrik", "×1", "×4"], reponse: 0,
        explication: "Piège : le Sol est super efficace contre l'Électrik, mais le Vol est immunisé. Le résultat est ×0." },
      { piege: true, type: "choix", question: "Fort-Ivoire tient une Veste de Combat. Quelle capacité ne peut-il pas utiliser ?",
        options: ["Une capacité de statut, comme Danse Lames", "Close Combat", "Tour Rapide", "Assaut Frontal"], reponse: 0,
        explication: "Piège : la Veste de Combat interdit les capacités de statut. Tour Rapide inflige des dégâts : il est autorisé." }
    ]
  }

  ]
};
