// =============================================================
//  COMPTES ET SAUVEGARDE EN LIGNE (Firebase Realtime Database,
//  sans Firebase Auth)
//  - noms/<nom>                  : true quand le nom de compte est pris
//  - comptes/<empreinte>          : la progression d'un compte
//      <empreinte> = SHA-256 de « nom:code ». Le code n'est jamais
//      enregistré : seul le bon couple nom + code retrouve le compte.
//  - stats/<cours>/questions/<id> : combien de fois chaque question
//                                   d'examen est vue / ratée
//  - stats/<cours>/examens        : tentatives et réussites
//  Si Firebase ne répond pas, le site continue avec la sauvegarde
//  du navigateur.
// =============================================================
(function () {
  const conf = window.SITE && window.SITE.firebase;
  if (!conf || !window.firebase) return;
  let db;
  try {
    firebase.initializeApp(conf);
    db = firebase.database();
  } catch (e) { console.warn("Firebase indisponible", e); return; }

  // ---------- SHA-256 (en JavaScript, pour marcher partout, même hors https) ----------
  function sha256(texte) {
    const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const o = Array.from(new TextEncoder().encode(texte));
    const l = o.length * 8;
    o.push(0x80);
    while (o.length % 64 !== 56) o.push(0);
    for (let i = 7; i >= 0; i--) o.push(i >= 4 ? 0 : (l >>> (i * 8)) & 0xff);
    const w = new Array(64), r = (x, n) => (x >>> n) | (x << (32 - n));
    for (let i = 0; i < o.length; i += 64) {
      for (let t = 0; t < 16; t++) w[t] = (o[i + t * 4] << 24) | (o[i + t * 4 + 1] << 16) | (o[i + t * 4 + 2] << 8) | o[i + t * 4 + 3];
      for (let t = 16; t < 64; t++) {
        const s0 = r(w[t - 15], 7) ^ r(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        const s1 = r(w[t - 2], 17) ^ r(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const t1 = (h + (r(e, 6) ^ r(e, 11) ^ r(e, 25)) + ((e & f) ^ (~e & g)) + K[t] + w[t]) | 0;
        const t2 = ((r(a, 2) ^ r(a, 13) ^ r(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      [a, b, c, d, e, f, g, h].forEach((v, k) => H[k] = (H[k] + v) | 0);
    }
    return H.map(v => (v >>> 0).toString(16).padStart(8, "0")).join("");
  }

  // Nom de compte : 3 à 20 caractères. La clé ignore majuscules et accents :
  // « Sacha » et « sacha » sont le même compte.
  const cleNom = nom => String(nom || "").trim().normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "_");
  const nomValide = nom => /^[a-z0-9_-]{3,20}$/.test(cleNom(nom));
  const codeValide = code => /^\S{1,8}$/.test(String(code || ""));
  const empreinte = (nom, code) => sha256(cleNom(nom) + ":" + code);

  // Les clés Firebase ne peuvent pas contenir « / » : « cours/leçon » devient « cours__leçon »
  const versCloud = (nom, P) => {
    const lecons = {};
    Object.keys(P.lecons || {}).forEach(k => { if (P.lecons[k]) lecons[k.replace("/", "__")] = true; });
    return { nom: String(nom).trim().slice(0, 20), lecons, examens: P.examens || {}, historique: P.historique || {}, erreurs: P.erreurs || {}, maj: firebase.database.ServerValue.TIMESTAMP };
  };
  const depuisCloud = d => {
    const lecons = {};
    Object.keys((d && d.lecons) || {}).forEach(k => lecons[k.replace("__", "/")] = true);
    // Firebase peut renvoyer les listes sous forme d'objets : on les remet en tableaux
    const historique = {};
    Object.keys((d && d.historique) || {}).forEach(c => historique[c] = Object.values(d.historique[c] || {}));
    return { nom: d.nom, lecons, examens: (d && d.examens) || {}, historique, erreurs: (d && d.erreurs) || {} };
  };

  function idQuestion(texte) {
    let h = 5381;
    for (let i = 0; i < texte.length; i++) h = ((h << 5) + h + texte.charCodeAt(i)) >>> 0;
    return "q" + h.toString(36);
  }
  const plusUn = firebase.database.ServerValue.increment(1);

  window.CLOUD = {
    nomValide, codeValide, empreinte,
    // Connexion : résout { id, progression } ou null si le couple nom + code est faux
    connecter(nom, code) {
      const id = empreinte(nom, code);
      return db.ref("comptes/" + id).get().then(s => s.exists() ? { id, nom: s.val().nom || nom, progression: depuisCloud(s.val()) } : null);
    },
    // Création : résout { id } ou { erreur: "pris" } si le nom existe déjà
    creer(nom, code, P) {
      const id = empreinte(nom, code);
      return db.ref("noms/" + cleNom(nom)).transaction(v => v === null ? true : undefined)
        .then(r => {
          if (!r.committed) return { erreur: "pris" };
          return db.ref("comptes/" + id).set(versCloud(nom, P)).then(() => ({ id }));
        });
    },
    // Progression d'un compte déjà connecté (id gardé dans le navigateur)
    charger(id) {
      return db.ref("comptes/" + id).get().then(s => s.exists() ? depuisCloud(s.val()) : null);
    },
    // update (et non set) : on ne touche pas aux notes enregistrées à côté
    sauver(id, nom, P) {
      return db.ref("comptes/" + id).update(versCloud(nom, P));
    },
    chargerNotes(id) {
      return db.ref("comptes/" + id + "/notes").get().then(s => s.exists() ? s.val() : null);
    },
    sauverNotes(id, notes) {
      return db.ref("comptes/" + id + "/notes").set(notes);
    },
    // resultats : [{ question, juste }]
    statsExamen(coursId, resultats, reussi) {
      const maj = {};
      resultats.forEach(r => {
        const base = `stats/${coursId}/questions/${idQuestion(r.question)}`;
        maj[base + "/texte"] = r.question.slice(0, 300);
        maj[base + "/vus"] = plusUn;
        if (!r.juste) maj[base + "/erreurs"] = plusUn;
      });
      maj[`stats/${coursId}/examens/tentatives`] = plusUn;
      if (reussi) maj[`stats/${coursId}/examens/reussis`] = plusUn;
      return db.ref().update(maj).catch(e => console.warn("Stats non envoyées", e));
    }
  };
})();
