// =============================================================
//  COURS DU FORMAT 3v3 (Combat Solo, Pokémon Champions)
//  Même structure que les Fondamentaux : cours -> leçons -> examen
//  Les ids de cours et de leçons : lettres et chiffres uniquement.
// =============================================================
window.SITE = window.SITE || {};
window.SITE.parcoursFormats = window.SITE.parcoursFormats || {};

window.SITE.parcoursFormats["3v3"] = {
  titre: "Format 3v3",
  intro: "Le combat simple en 3 contre 3, le Combat Solo de Pokémon Champions, illustré par une vraie équipe.",
  cours: [

  {
    id: "solo3v3",
    titre: "Le combat en 3 contre 3",
    objectifs: [
      "Connaître les règles du format 3v3",
      "Jouer en 1 contre 1 : anticiper, changer, garder l'avantage",
      "Comprendre le rôle de chaque Pokémon d'une équipe",
      "Choisir ses 3 Pokémon et son Pokémon de départ"
    ],
    lecons: [
      // ---------------- Leçon 1 ----------------
      {
        id: "format",
        titre: "Le format 3v3",
        texte: `
<p>Le <strong>3v3</strong> est le <strong>Combat Solo</strong> de Pokémon Champions : un combat <strong>simple</strong>, avec un seul Pokémon de chaque côté du terrain.</p>
${capture({
  src: "images/3v3/combat3v3-choix-action.webp",
  alt: "Un combat simple : Floréclat face à Élecsprint",
  reperes: [
    { x: 14, y: 90, texte: "<strong>Ton Pokémon</strong> sur le terrain (ici Floréclat)." },
    { x: 87, y: 10, texte: "<strong>Le Pokémon adverse</strong> (ici Élecsprint)." },
    { x: 92, y: 72, texte: "Une seule décision par tour : <strong>attaquer</strong> ou changer de <strong>Pokémon</strong>." }
  ],
  legende: "Un tour de Combat Solo : 1 contre 1, une seule décision à prendre."
})}
<h2>Les règles du format</h2>
<table>
<tr><th>Règle</th><th>En 3v3</th></tr>
<tr><td>Taille de l'équipe</td><td>6 Pokémon</td></tr>
<tr><td>Pokémon joués par combat</td><td><strong>3</strong>, choisis après l'aperçu des équipes</td></tr>
<tr><td>Sur le terrain</td><td><strong>1</strong> par camp (les 2 autres attendent en réserve)</td></tr>
<tr><td>Niveau</td><td>50</td></tr>
<tr><td>Victoire</td><td>Mettre K.O. les <strong>3</strong> Pokémon adverses</td></tr>
</table>
<h2>Ce qui change par rapport au VGC</h2>
<ul>
<li><strong>Pas de partenaire :</strong> personne pour t'aider, te protéger ou attirer les coups. Chaque Pokémon doit se débrouiller seul.</li>
<li><strong>Les changements de Pokémon comptent beaucoup plus :</strong> en 1 contre 1, changer au bon moment est souvent la meilleure action du tour.</li>
<li><strong>Peu de Pokémon, peu d'erreurs permises :</strong> avec 3 Pokémon, chaque K.O. pèse lourd. Perdre ton premier Pokémon sans rien faire, c'est déjà un tiers de ton équipe.</li>
<li><strong>Les capacités de soutien en double</strong> (Coup d'Main, Poudre Fureur, capacités de zone) n'ont plus d'intérêt.</li>
</ul>
<div class="astuce"><b>À retenir :</b> en 3v3, la question n'est plus « quel duo bat quel duo ? », mais « lequel de mes 3 Pokémon gagne ce 1 contre 1, et que faire quand ce n'est pas le cas ? ».</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque nombre à ce qu'il représente en 3v3.",
            paires: [["6", "Pokémon dans l'équipe"], ["3", "Pokémon joués par combat"], ["1", "Pokémon de chaque camp sur le terrain"], ["50", "Niveau des Pokémon"]],
            commentaire: "On construit une équipe de 6, on en choisit 3, et un seul est sur le terrain à la fois."
          }
        ],
        quiz: [
          { type: "nombre", question: "Combien de Pokémon joues-tu dans un combat 3v3 ?", reponse: 3,
            explication: "Tu choisis 3 Pokémon parmi tes 6." },
          { type: "nombre", question: "Combien de Pokémon de chaque camp sont sur le terrain en même temps ?", reponse: 1,
            explication: "C'est un combat simple : 1 contre 1." },
          { type: "vf", question: "En 3v3, Coup d'Main est une capacité très utile.", reponse: false,
            explication: "Coup d'Main renforce un partenaire. En combat simple, il n'y en a pas." },
          { type: "choix", question: "Comment gagne-t-on une partie de 3v3 ?",
            options: ["En mettant K.O. les 3 Pokémon adverses", "En mettant K.O. les 6 Pokémon adverses", "En mettant K.O. 2 Pokémon adverses", "Aux points, à la fin du temps"], reponse: 0,
            explication: "L'adversaire joue 3 Pokémon : il faut les mettre K.O. tous les 3." }
        ]
      },

      // ---------------- Leçon 2 ----------------
      {
        id: "unvsun",
        titre: "Jouer en 1 contre 1",
        texte: `
<p>Comme les choix sont simultanés, chaque tour est un jeu d'anticipation : tu dois deviner si l'adversaire va attaquer… ou changer de Pokémon.</p>
<h2>Changer de Pokémon au bon moment</h2>
<p>Si ton Pokémon est en mauvaise posture, tu peux le faire sortir. Le Pokémon qui entre <strong>encaisse la capacité adverse à sa place</strong> : choisis-en un qui y résiste ou y est immunisé.</p>
<div class="piege"><b>Piège à éviter :</b> changer à chaque tour. Chaque changement donne un tour « gratuit » à l'adversaire, qui peut en profiter pour se renforcer ou poser des pièges. Change quand c'est nécessaire, pas par réflexe.</div>
<h2>Garder l'avantage avec les capacités de pivot</h2>
<p>Certaines capacités infligent des dégâts <strong>puis</strong> font sortir le lanceur : <strong>Eau Revoir</strong> (Paragruel) et <strong>Change-Éclair</strong> (Raichu). Tu attaques et tu changes dans le même tour, sans subir de coup « gratuit ».</p>
<div class="boutons-caps"><img src="images/capacites/bouton-eau-revoir.webp" alt="Eau Revoir"></div>
<h2>Les pièges d'entrée</h2>
<p>En 1 contre 1, les Pokémon entrent et sortent souvent. <strong>Piège de Roc</strong> blesse chaque Pokémon adverse qui entre sur le terrain, d'autant plus s'il est faible face à la Roche. Poser un piège tôt, c'est faire des dégâts tout le reste du combat.</p>
${capture({
  src: "images/3v3/combat3v3-floreclat-capacites.webp",
  alt: "Les capacités de Floréclat face à Élecsprint",
  reperes: [
    { x: 71, y: 55, texte: "<strong>Piège de Roc</strong> : rien à afficher sur l'efficacité, il vise le camp adverse et pas le Pokémon." },
    { x: 71, y: 79, texte: "Tir de Boue est « Super efficace » contre Élecsprint (Électrik)." }
  ],
  legende: "Floréclat peut poser Piège de Roc, ou attaquer avec Tir de Boue."
})}
<h2>Survivre au premier coup</h2>
<p>La <strong>Ceinture Force</strong> permet de survivre à 1 PV à une capacité qui aurait mis K.O., <strong>si le Pokémon avait tous ses PV</strong>. Parfait pour un Pokémon de départ qui doit absolument agir au moins une fois (poser Piège de Roc, par exemple).</p>
<h2>Finir le combat</h2>
<p>Certains Pokémon deviennent plus forts quand leurs alliés tombent : <strong>Général Suprême</strong> (Scalpereur) renforce son Attaque et son Atq. Spé. pour chaque allié K.O., et <strong>Hommage Posthume</strong> (Paragruel) gagne en puissance de la même façon. Ce sont des <strong>conditions de victoire</strong> parfaites en fin de partie : on les garde pour la fin.</p>
<div class="astuce"><b>Astuce :</b> une capacité prioritaire comme <strong>Coup Bas</strong> (Scalpereur), <strong>Pisto-Poing</strong> (Métalosse) ou <strong>Aqua-Jet</strong> (Paragruel) achève un adversaire affaibli avant qu'il agisse. En fin de partie, c'est souvent elle qui décide du vainqueur.</div>`,
        exercices: [
          {
            type: "situation",
            enonce: "Ton Métalosse (Acier / Psy) fait face à Carmadura (Feu / Psy), qui va sûrement attaquer avec une capacité Feu. Tu as Paragruel (Eau / Spectre) en réserve. Que fais-tu ?",
            options: [
              { texte: "Changer pour Paragruel, qui résiste au Feu", bon: true, commentaire: "Oui : Paragruel encaisse le coup Feu (×0,5) et menace en retour avec ses capacités Eau." },
              { texte: "Rester et attaquer avec Tête de Fer", bon: false, commentaire: "Risqué : Métalosse est faible face au Feu (×2) et Tête de Fer n'est pas efficace contre le Feu." },
              { texte: "Changer pour un Pokémon faible au Feu", bon: false, commentaire: "Non : le Pokémon qui entre encaisse la capacité. Choisis-en un qui y résiste." }
            ]
          },
          {
            type: "situation",
            enonce: "Ton Paragruel n'a plus d'alliés K.O. et l'adversaire est en pleine forme. Est-ce le bon moment pour Hommage Posthume ?",
            options: [
              { texte: "Pas idéal : Hommage Posthume est faible tant qu'aucun allié n'est K.O.", bon: true, commentaire: "Oui : sa puissance augmente avec chaque allié K.O. C'est une capacité de fin de partie." },
              { texte: "Oui, c'est toujours sa meilleure capacité", bon: false, commentaire: "Non : sans allié K.O., sa puissance reste basse." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Que font Eau Revoir et Change-Éclair ?",
            options: ["Infligent des dégâts puis font sortir le lanceur", "Protègent le lanceur", "Posent un piège", "Soignent le lanceur"], reponse: 0,
            explication: "Ce sont des capacités de pivot : tu attaques et tu changes dans le même tour." },
          { type: "choix", question: "Quand la Ceinture Force fait-elle survivre un Pokémon à 1 PV ?",
            options: ["Quand il avait tous ses PV avant le coup", "À chaque coup", "Seulement contre les capacités spéciales", "Quand il a moins de la moitié de ses PV"], reponse: 0,
            explication: "Elle ne fonctionne que si le Pokémon avait tous ses PV." },
          { type: "vf", question: "Le Pokémon qui entre lors d'un changement encaisse la capacité adverse à la place de celui qui sort.", reponse: true,
            explication: "Les changements sont effectués avant les capacités." },
          { type: "choix", question: "Pourquoi garder Scalpereur (Général Suprême) pour la fin du combat ?",
            options: ["Il devient plus fort pour chaque allié K.O.", "Il est le plus rapide", "Il pose Piège de Roc", "Il soigne ses alliés"], reponse: 0,
            explication: "Général Suprême renforce son Attaque et son Atq. Spé. pour chaque allié K.O." }
        ]
      },

      // ---------------- Leçon 3 ----------------
      {
        id: "equipe",
        titre: "Une équipe 3v3, Pokémon par Pokémon",
        texte: `
<p>Voici une vraie équipe de Combat Solo. Sur 6 Pokémon, seuls 3 joueront chaque combat : l'équipe doit donc proposer <strong>plusieurs plans</strong>, choisis selon l'adversaire.</p>
${capture({
  src: "images/3v3/equipe3v3-capacites.webp",
  alt: "L'équipe 3v3, onglet Capacités",
  legende: "L'équipe sur l'écran d'équipe de Pokémon Champions."
})}
<h2>Le rôle de chaque Pokémon</h2>
<table>
<tr><th>Pokémon</th><th>Rôle</th><th>Pourquoi il est là</th></tr>
<tr><td><strong>Floréclat</strong></td><td>Pokémon de départ, poseur de pièges</td><td>Il pose <strong>Piège de Roc</strong> dès le début. Sa <strong>Ceinture Force</strong> lui garantit de survivre au premier coup, et son talent <strong>Dépôt Toxique</strong> pose des Pics Toxik chez l'adversaire quand il est touché par une capacité physique.</td></tr>
<tr><td><strong>Sorcilence</strong></td><td>Autre départ possible, Pokémon solide qui se renforce</td><td><strong>Miroir Magik</strong> renvoie les capacités de statut et les pièges adverses. Elle se renforce avec <strong>Plénitude</strong>, se soigne avec Vampibaiser et les Restes, et paralyse avec Frotte-Frimousse.</td></tr>
<tr><td><strong>Métalosse</strong></td><td>Attaquant physique (Méga possible)</td><td>En Méga, il gagne <strong>Griffe Dure</strong> qui renforce ses capacités de contact. Ses poings couvrent beaucoup de types : Poing Glace contre les Dragon, Poing Éclair contre les Vol, et <strong>Pisto-Poing</strong>, prioritaire, pour finir.</td></tr>
<tr><td><strong>Raichu</strong></td><td>Attaquant spécial rapide (Méga possible)</td><td>Rapide et offensif en Méga. <strong>Paratonnerre</strong> le rend immunisé contre les capacités Électrik (et augmente son Atq. Spé. quand il en reçoit). <strong>Change-Éclair</strong> lui permet d'attaquer puis de laisser sa place.</td></tr>
<tr><td><strong>Paragruel</strong></td><td>Nettoyeur de fin de partie</td><td>Avec le <strong>Mouchoir Choix</strong>, il dépasse beaucoup d'adversaires. <strong>Adaptabilité</strong> renforce encore ses capacités Eau et Spectre, et <strong>Hommage Posthume</strong> devient redoutable quand des alliés sont K.O. Eau Revoir lui permet de sortir quand il est bloqué sur une mauvaise capacité.</td></tr>
<tr><td><strong>Scalpereur</strong></td><td>Nettoyeur de fin de partie</td><td><strong>Général Suprême</strong> le rend plus fort pour chaque allié K.O. <strong>Coup Bas</strong> achève les adversaires plus rapides, et sa Baie Pomroz l'aide à tenir.</td></tr>
</table>
<h2>Une équipe, plusieurs plans</h2>
<ul>
<li><strong>Le départ :</strong> Floréclat (pour poser Piège de Roc) ou Sorcilence (pour se renforcer et bloquer les pièges adverses), selon l'équipe en face.</li>
<li><strong>La Méga-Évolution :</strong> Métalosse ou Raichu, selon les Pokémon adverses et les match-ups.</li>
<li><strong>La fin de partie :</strong> Paragruel ou Scalpereur, là aussi selon l'adversaire.</li>
</ul>
<div class="astuce"><b>À retenir :</b> en 3v3, une bonne équipe n'est pas 6 Pokémon qui jouent toujours ensemble, mais une réserve dans laquelle tu pioches les 3 qui répondent le mieux à l'équipe adverse.</div>`,
        exercices: [
          {
            type: "assoc",
            enonce: "Associe chaque Pokémon de l'équipe à son rôle principal.",
            image: "images/3v3/equipe3v3-capacites.webp", alt: "L'équipe 3v3, onglet Capacités",
            paires: [["Floréclat", "Pose Piège de Roc au départ"], ["Sorcilence", "Se renforce et renvoie les pièges"], ["Paragruel", "Nettoyeur rapide avec Mouchoir Choix"], ["Raichu", "Attaquant spécial rapide, Méga possible"]],
            commentaire: "Deux départs, deux Méga possibles, deux nettoyeurs : on choisit selon l'adversaire."
          },
          {
            type: "situation",
            enonce: "Élecsprint (Électrik) utilise une capacité Électrik au moment où tu fais entrer Raichu. Que se passe-t-il ?",
            image: "images/3v3/combat3v3-choix-action.webp", alt: "Élecsprint en face",
            options: [
              { texte: "Raichu ne subit rien, et son Atq. Spé. augmente grâce à Paratonnerre", bon: true, commentaire: "Exactement : Paratonnerre rend Raichu immunisé et le renforce." },
              { texte: "Raichu subit des dégâts réduits", bon: false, commentaire: "Non : c'est une immunité totale grâce à Paratonnerre." },
              { texte: "Raichu est paralysé", bon: false, commentaire: "Non, Paratonnerre le protège complètement des capacités Électrik." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Quel est le rôle de Floréclat dans cette équipe ?",
            options: ["Poser Piège de Roc au début du combat", "Finir le combat", "Soigner ses alliés", "Lancer Distorsion"], reponse: 0,
            explication: "C'est un Pokémon de départ, protégé par sa Ceinture Force." },
          { type: "choix", question: "Que fait Paratonnerre pour Raichu ?",
            options: ["Immunité contre l'Électrik et Atq. Spé. augmentée quand il en reçoit", "Double sa Vitesse", "Le soigne à chaque tour", "Paralyse l'adversaire au contact"], reponse: 0,
            explication: "Les capacités Électrik ne lui font rien, et le renforcent." },
          { type: "choix", question: "Pourquoi Eau Revoir est-il utile à Paragruel, qui tient un Mouchoir Choix ?",
            options: ["Il peut attaquer puis sortir quand il est bloqué sur une mauvaise capacité", "Il change de type", "Il annule le Mouchoir Choix", "Il soigne Paragruel"], reponse: 0,
            explication: "Avec le Mouchoir Choix, il reste bloqué sur une capacité. Eau Revoir lui permet de sortir en attaquant." },
          { type: "vf", question: "Dans cette équipe, la Méga-Évolution se fait toujours sur Métalosse.", reponse: false,
            explication: "Métalosse ou Raichu, selon l'équipe adverse et les match-ups." },
          { type: "choix", question: "Quels sont les deux Pokémon de départ possibles de cette équipe ?",
            options: ["Floréclat ou Sorcilence", "Paragruel ou Scalpereur", "Métalosse ou Raichu", "Raichu ou Floréclat"], reponse: 0,
            explication: "Floréclat pour Piège de Roc, Sorcilence pour se renforcer et bloquer les pièges." }
        ]
      },

      // ---------------- Leçon 4 ----------------
      {
        id: "selection",
        titre: "Choisir ses 3 Pokémon",
        texte: `
<p>Avant le combat, tu vois les 6 Pokémon adverses (pas leurs sets) et tu as un temps limité pour choisir <strong>tes 3 Pokémon</strong>. Le premier choisi (n° 1) commence le combat.</p>
${capture({
  src: "images/3v3/selection3v3-avantages.webp",
  alt: "Écran de sélection avec les symboles d'avantage",
  reperes: [
    { x: 11, y: 18, texte: "Le Pokémon sélectionné : ici Métalosse." },
    { x: 78, y: 20, texte: "Flèche orange vers le bas : Métalosse est <strong>désavantagé</strong> face à Carmadura (Feu / Psy)." },
    { x: 78, y: 43, texte: "Flèche verte vers le haut : Métalosse est <strong>avantagé</strong> face à ce Pokémon." }
  ],
  legende: "Les flèches s'affichent pour le Pokémon que tu survoles."
})}
<h2>Le symbole « ! »</h2>
<p>Une fois tes 3 Pokémon choisis, le jeu signale par un <strong>« ! »</strong> les adversaires face auxquels <strong>tes 3 Pokémon sont tous désavantagés</strong>. C'est une alerte : si l'adversaire amène ce Pokémon, tu n'as pas de réponse évidente.</p>
${capture({
  src: "images/3v3/selection3v3-ordre.webp",
  alt: "Sélection de 3 Pokémon, avec un adversaire marqué d'un point d'exclamation",
  reperes: [
    { x: 4, y: 77, texte: "Les numéros : le <strong>n° 1</strong> (Floréclat) commence, les deux autres attendent en réserve." },
    { x: 83, y: 54, texte: "Le <strong>« ! »</strong> : Floréclat, Paragruel et Métalosse sont tous désavantagés face à ce Trioxhydre (Ténèbres / Dragon)." }
  ],
  legende: "Floréclat, Paragruel et Métalosse : une sélection avec une alerte sur Trioxhydre."
})}
<p>Une alerte ne veut pas dire qu'il faut tout changer : tu peux l'accepter si tu as un plan. Ici, Métalosse a <strong>Poing Glace</strong>, super efficace contre Trioxhydre (Dragon). Le jeu regarde surtout les types, pas toutes tes capacités.</p>
${capture({
  src: "images/3v3/combat3v3-metalosse-trioxhydre.webp",
  alt: "Métalosse face à Trioxhydre, Poing Glace est super efficace",
  petite: true,
  legende: "En combat, Poing Glace de Métalosse est « Super efficace » contre Trioxhydre."
})}
<h2>En 3 questions</h2>
<ol>
<li><strong>Quelles sont les menaces ?</strong> Repère les adversaires les plus dangereux, et les « ! ».</li>
<li><strong>Qui répond à chaque menace ?</strong> Tes 3 Pokémon doivent pouvoir tenir face aux plus dangereux.</li>
<li><strong>Quel Pokémon de départ ?</strong> Celui qui met ton plan en place : ici Floréclat pour Piège de Roc, ou Sorcilence pour se renforcer.</li>
</ol>
<h2>Et la Méga-Évolution ?</h2>
<p>Pendant le combat, le bouton <strong>Méga-Évolution</strong> apparaît au moment de choisir la capacité. Un seul Pokémon peut méga-évoluer par combat : choisis dès la sélection lequel tu emmènes selon les match-ups.</p>
${capture({
  src: "images/3v3/combat3v3-metalosse-mega.webp",
  alt: "Métalosse avec le bouton Méga-Évolution face à Brutalibré",
  petite: true,
  reperes: [ { x: 63, y: 91, texte: "Le bouton <strong>Méga-Évolution</strong>, à activer en plus de la capacité." } ],
  legende: "Métalosse peut méga-évoluer. Poing Éclair est « Super efficace » contre Brutalibré (Combat / Vol)."
})}
<div class="astuce"><b>Astuce :</b> avec seulement 3 Pokémon, évite d'en prendre deux qui ont la même faiblesse. Un seul adversaire pourrait alors battre les deux.</div>`,
        exercices: [
          {
            type: "zones",
            enonce: "Sur cet écran de sélection, clique sur l'adversaire signalé par le « ! ».",
            image: "images/3v3/selection3v3-ordre.webp", alt: "Écran de sélection 3v3",
            zones: { trioxhydre: { nom: "l'adversaire signalé par le « ! »", rect: [81, 49, 97, 58] } },
            cibles: ["trioxhydre"],
            commentaire: "Trioxhydre (Ténèbres / Dragon) : tes 3 Pokémon choisis sont tous désavantagés face à lui."
          },
          {
            type: "situation",
            enonce: "L'adversaire a un Pokémon qui pose beaucoup de pièges et lance des capacités de statut. Quel départ choisis-tu ?",
            options: [
              { texte: "Sorcilence", bon: true, commentaire: "Oui : Miroir Magik renvoie les pièges et les capacités de statut à l'envoyeur." },
              { texte: "Floréclat", bon: false, commentaire: "Possible, mais Sorcilence bloque directement le plan adverse." },
              { texte: "Scalpereur", bon: false, commentaire: "Scalpereur est un nettoyeur de fin de partie : on le garde pour la fin." }
            ]
          }
        ],
        quiz: [
          { type: "choix", question: "Que signifie le « ! » à côté d'un adversaire pendant la sélection ?",
            image: "images/3v3/selection3v3-ordre.webp", alt: "Écran de sélection 3v3",
            options: ["Tes 3 Pokémon choisis sont tous désavantagés face à lui", "Il a une Méga-Gemme", "Il est le plus rapide", "Il commencera le combat"], reponse: 0,
            explication: "C'est une alerte : tu n'as pas de réponse évidente à ce Pokémon." },
          { type: "choix", question: "Quel Pokémon commence le combat ?",
            options: ["Celui qui porte le n° 1", "Le plus rapide des 3", "Celui du haut de la liste", "Le jeu le choisit au hasard"], reponse: 0,
            explication: "Le n° 1 entre en premier, les deux autres attendent en réserve." },
          { type: "vf", question: "Un « ! » oblige à changer sa sélection.", reponse: false,
            explication: "C'est une alerte, pas une interdiction. Une capacité de couverture, comme Poing Glace, peut suffire." },
          { type: "choix", question: "Pourquoi éviter de choisir deux Pokémon avec la même faiblesse ?",
            options: ["Un seul adversaire pourrait battre les deux", "Le jeu l'interdit", "Ils ne peuvent pas méga-évoluer", "Ils perdent leur talent"], reponse: 0,
            explication: "Avec 3 Pokémon seulement, une faiblesse partagée coûte très cher." }
        ]
      }
    ],
    examen: [
      { type: "nombre", question: "Combien de Pokémon joues-tu par combat en 3v3 ?", reponse: 3, explication: "3 Pokémon choisis parmi tes 6." },
      { type: "nombre", question: "Combien de Pokémon amènes-tu dans ton équipe ?", reponse: 6, explication: "6 Pokémon, dont 3 joués par combat." },
      { type: "nombre", question: "Combien de Pokémon de chaque camp sont sur le terrain en même temps ?", reponse: 1, explication: "Combat simple : 1 contre 1." },
      { type: "choix", question: "Sur cet écran, combien de décisions dois-tu prendre ce tour-ci ?",
        image: "images/3v3/combat3v3-choix-action.webp", alt: "Combat 3v3",
        options: ["1", "2", "3", "4"], reponse: 0, explication: "Un seul Pokémon sur le terrain, donc une seule décision." },
      { type: "choix", question: "Laquelle de ces capacités perd tout son intérêt en 3v3 ?",
        options: ["Coup d'Main", "Piège de Roc", "Coup Bas", "Eau Revoir"], reponse: 0, explication: "Coup d'Main renforce un partenaire : il n'y en a pas en combat simple." },
      { type: "choix", question: "Que fait la capacité de ce bouton ?",
        image: "images/capacites/bouton-eau-revoir.webp", alt: "Eau Revoir", imagePetite: true,
        options: ["Inflige des dégâts puis fait sortir le lanceur", "Protège le lanceur", "Soigne le lanceur", "Pose un piège"], reponse: 0, explication: "Eau Revoir est une capacité de pivot." },
      { type: "choix", question: "Quel est l'intérêt de poser Piège de Roc tôt dans le combat ?",
        options: ["Chaque Pokémon adverse qui entre ensuite est blessé", "Il met K.O. immédiatement", "Il protège ton équipe", "Il augmente ta Vitesse"], reponse: 0, explication: "Le piège reste et blesse chaque Pokémon adverse qui entre." },
      { type: "choix", question: "Quand la Ceinture Force protège-t-elle d'un K.O. ?",
        options: ["Quand le Pokémon avait tous ses PV", "Toujours", "Quand il a moins de la moitié de ses PV", "Contre les capacités prioritaires seulement"], reponse: 0, explication: "Seulement à PV pleins : il survit alors à 1 PV." },
      { type: "choix", question: "Que fait Général Suprême (Scalpereur) ?",
        options: ["Renforce son Attaque et son Atq. Spé. pour chaque allié K.O.", "Le soigne à chaque tour", "Rend ses capacités prioritaires", "Renvoie les capacités de statut"], reponse: 0, explication: "Plus ses alliés tombent, plus il est dangereux." },
      { type: "choix", question: "Que fait Miroir Magik (Sorcilence) ?",
        options: ["Renvoie les capacités de statut et les pièges à l'envoyeur", "Renvoie toutes les capacités", "Rend immunisé contre la Fée", "Double la Défense"], reponse: 0, explication: "Seulement les capacités de statut, pièges compris." },
      { type: "choix", question: "Quelle capacité de ce Floréclat est super efficace contre Élecsprint ?",
        image: "images/3v3/combat3v3-floreclat-capacites.webp", alt: "Capacités de Floréclat face à Élecsprint",
        options: ["Tir de Boue", "Piège de Roc", "Rayon Gemme", "Cradovague"], reponse: 0, explication: "Sol contre Électrik : ×2." },
      { type: "choix", question: "Que montre cet écran ?",
        image: "images/3v3/combat3v3-resume.webp", alt: "Résumé de Floréclat en combat",
        options: ["Le résumé de Floréclat : types, capacités, talent et objet", "Le choix du Pokémon de départ", "L'historique du tour", "L'équipe adverse complète avec ses sets"], reponse: 0, explication: "En combat, le résumé rappelle les informations de ton Pokémon." },
      { type: "choix", question: "D'après ce résumé, quel objet tient Floréclat ?",
        image: "images/3v3/combat3v3-resume.webp", alt: "Résumé de Floréclat en combat",
        options: ["Ceinture Force", "Restes", "Mouchoir Choix", "Baie Pomroz"], reponse: 0, explication: "« Objet tenu : Ceinture Force »." },
      { type: "zone", question: "Sur cet écran de sélection, clique sur le Pokémon qui commencera le combat.",
        image: "images/3v3/selection3v3-ordre.webp", alt: "Écran de sélection 3v3",
        zones: {
          metalosse: { nom: "Métalosse (n° 3)", rect: [4, 14, 31, 24] },
          paragruel: { nom: "Paragruel (n° 2)", rect: [4, 50, 31, 59] },
          floreclat: { nom: "Floréclat (n° 1)", rect: [4, 73, 31, 83] }
        }, reponse: "floreclat",
        explication: "Le n° 1 commence : ici Floréclat." },
      { type: "zone", question: "Clique sur l'adversaire face auquel tes 3 Pokémon choisis sont tous désavantagés.",
        image: "images/3v3/selection3v3-ordre.webp", alt: "Écran de sélection 3v3",
        zones: {
          carmadura: { nom: "Carmadura", rect: [81, 14, 97, 23] },
          trioxhydre: { nom: "Trioxhydre", rect: [81, 49, 97, 58] },
          brutalibre: { nom: "Brutalibré", rect: [81, 61, 97, 71] },
          elecsprint: { nom: "Élecsprint", rect: [81, 73, 97, 83] }
        }, reponse: "trioxhydre",
        explication: "Trioxhydre porte le « ! »." },
      { type: "choix", question: "Que signifie la flèche orange vers le bas à côté du premier adversaire ?",
        image: "images/3v3/selection3v3-avantages.webp", alt: "Écran de sélection, Métalosse survolé",
        options: ["Métalosse est désavantagé face à lui", "Métalosse est avantagé face à lui", "Cet adversaire est K.O.", "Cet adversaire commence"], reponse: 0, explication: "Orange vers le bas : désavantage. Ici, Métalosse (Acier) face à Carmadura (Feu / Psy)." },
      { type: "choix", question: "Quel est le rôle de Paragruel dans cette équipe ?",
        options: ["Nettoyeur de fin de partie", "Poseur de pièges", "Pokémon de départ", "Soutien"], reponse: 0, explication: "Mouchoir Choix, Adaptabilité et Hommage Posthume : il finit le combat." },
      { type: "choix", question: "Quels sont les deux Pokémon qui peuvent méga-évoluer dans cette équipe ?",
        image: "images/3v3/equipe3v3-capacites.webp", alt: "L'équipe 3v3",
        options: ["Métalosse et Raichu", "Floréclat et Sorcilence", "Paragruel et Scalpereur", "Raichu et Paragruel"], reponse: 0, explication: "Métalossite et Raichuïte Y." },
      { type: "choix", question: "Comment choisit-on lequel des deux méga-évolue ?",
        options: ["Selon l'équipe adverse et les match-ups", "Toujours Métalosse", "Toujours Raichu", "Au hasard"], reponse: 0, explication: "On choisit celui qui répond le mieux à l'adversaire." },
      { type: "choix", question: "Quelle capacité prioritaire de Métalosse peut finir un adversaire affaibli ?",
        options: [{ img: "images/capacites/bouton-pisto-poing.webp", alt: "Pisto-Poing" }, { img: "images/capacites/bouton-poing-glace.webp", alt: "Poing Glace" }, { img: "images/capacites/bouton-tete-de-fer.webp", alt: "Tête de Fer" }], reponse: 0,
        explication: "Pisto-Poing est prioritaire : il passe avant les capacités normales." },
      { type: "choix", question: "Pourquoi Métalosse peut-il quand même affronter Trioxhydre (Ténèbres / Dragon) ?",
        image: "images/3v3/combat3v3-metalosse-trioxhydre.webp", alt: "Métalosse face à Trioxhydre",
        options: ["Poing Glace est super efficace contre lui", "Métalosse est immunisé contre les Ténèbres", "Trioxhydre ne peut pas attaquer l'Acier", "Pisto-Poing est super efficace"], reponse: 0, explication: "Glace contre Dragon : ×2." },
      { type: "multi", question: "Quels Pokémon de cette équipe sont des Pokémon de départ ?",
        options: ["Floréclat", "Sorcilence", "Scalpereur", "Paragruel"], reponses: [0, 1], explication: "Floréclat ou Sorcilence, selon l'adversaire. Scalpereur et Paragruel sont gardés pour la fin." },

      // ----- Questions pièges -----
      { piege: true, type: "choix", question: "Floréclat n'a plus que 84 PV sur 159 et reçoit une capacité qui devrait le mettre K.O. Que fait sa Ceinture Force ?",
        image: "images/3v3/combat3v3-resume.webp", alt: "Résumé de Floréclat à 84/159 PV",
        options: ["Rien : elle ne marche qu'à PV pleins", "Il survit à 1 PV", "Elle réduit les dégâts de moitié", "Elle le soigne"], reponse: 0,
        explication: "Piège : la Ceinture Force ne protège que si le Pokémon a tous ses PV." },
      { piege: true, type: "choix", question: "Élecsprint utilise Tonnerre sur Raichu (Paratonnerre). Que se passe-t-il ?",
        options: ["Aucun dégât, et l'Atq. Spé. de Raichu augmente", "Dégâts normaux", "Dégâts réduits de moitié", "Raichu est paralysé"], reponse: 0,
        explication: "Piège : Raichu est Électrik, mais c'est son talent Paratonnerre qui le rend immunisé et le renforce." },
      { piege: true, type: "choix", question: "L'adversaire pose Piège de Roc face à Sorcilence (Miroir Magik). Où finit le piège ?",
        options: ["Dans le camp de l'adversaire", "Dans ton camp", "Nulle part, il échoue", "Sur Sorcilence seulement"], reponse: 0,
        explication: "Piège : Miroir Magik renvoie aussi les pièges, qui sont des capacités de statut." },
      { piege: true, type: "vf", question: "Hommage Posthume est la meilleure capacité de Paragruel dès le premier tour.", reponse: false,
        explication: "Piège : sa puissance augmente avec chaque allié K.O. Sans allié K.O., elle reste faible." },
      { piege: true, type: "choix", question: "Paragruel (Mouchoir Choix) a utilisé Hommage Posthume. L'adversaire fait entrer un Pokémon Normal. Que fais-tu ?",
        options: ["Changer de Pokémon : il est bloqué sur une capacité Spectre sans effet", "Utiliser Aqua-Jet à la place", "Utiliser Hommage Posthume quand même", "Méga-évoluer Paragruel"], reponse: 0,
        explication: "Piège : le Mouchoir Choix le bloque sur Hommage Posthume (Spectre), sans effet sur un Normal. Il doit sortir." },
      { piege: true, type: "choix", question: "Dépôt Toxique (Floréclat) pose des Pics Toxik quand Floréclat est touché par :",
        options: ["Une capacité physique", "N'importe quelle capacité", "Une capacité spéciale", "Une capacité de statut"], reponse: 0,
        explication: "Piège : seulement les capacités physiques déclenchent Dépôt Toxique." }
    ]
  }

  ]
};
