/* MOVENTHY — catalogue du prototype (disciplines, matériel, exercices, démonstrations, événements de démo)
   Toutes les fiches sont en version 0.1 et en attente de validation par un coach qualifié. */
"use strict";

const INTENTS = [
 {id:"reprendre", t:"Me remettre au sport", s:"Reprendre doucement, à mon rythme"},
 {id:"bouger", t:"Bouger régulièrement", s:"Installer une routine qui tient dans la durée"},
 {id:"progresser", t:"Progresser", s:"Aller un cran plus loin dans ce que je fais déjà"},
 {id:"evenement", t:"Préparer un événement", s:"Une course, une marche, une fitness race…"},
 {id:"decouvrir", t:"Découvrir une discipline", s:"Essayer quelque chose de nouveau"}
];

const DISC = {
 marche:   {t:"Marche", s:"Marche active, à ton allure", hard:false},
 course:   {t:"Course à pied", s:"Débuter, viser 5 km ou 10 km", hard:true},
 renfo:    {t:"Renforcement", s:"Tout le corps, avec ou sans matériel", hard:true},
 mobilite: {t:"Mobilité", s:"Souplesse, articulations, détente", hard:false},
 hybride:  {t:"Fitness hybride", s:"Cardio + renfo en circuit", hard:true}
};
const DISC_ORDER = ["marche","course","renfo","mobilite","hybride"];

const LEVELS = [
 {id:"debutant", t:"Débutant·e", s:"Je n'ai jamais vraiment pratiqué"},
 {id:"reprise", t:"En reprise", s:"J'ai déjà pratiqué, j'ai arrêté un moment"},
 {id:"regulier", t:"Pratiquant·e régulier·e", s:"Je bouge déjà au moins une fois par semaine"}
];

const EQUIP = {
 tapis:"Tapis de sol", chaise:"Chaise stable ou banc", step:"Marche d'escalier ou step", elastique:"Élastique",
 halteres:"Haltères", kettlebell:"Kettlebell", tapis_course:"Tapis de course", velo:"Vélo d'appartement", rameur:"Rameur"
};
const EQUIP_HOME = ["tapis","chaise","step","elastique","halteres","kettlebell","tapis_course","velo","rameur"];
const EQUIP_OUT = ["elastique"];
const GYM_DEFAULT = ["tapis","chaise","step","elastique","halteres","kettlebell","tapis_course","velo","rameur"];
const PLACES = {maison:"Maison", exterieur:"Extérieur", salle:"Salle"};
const DURATIONS = [10,15,20,30,45,60];

const VALID = "Version 0.1 · en attente de validation par un coach";

/* ---------- Fiches exercices ----------
 id, n nom, d catégorie, z zone, l niveau (1-3), eq matériel requis (tous), any (au moins un), sol (au sol),
 imp (impact/sauts), m (t = au temps, r = répétitions), r (repères), cues, easy/hard (variantes), err, prec, anim, ph, hz (vue horizontale), sc (décor) */
const EX = [
 // ---- Allures (marche / course)
 {id:"marche_lente", n:"Marche tranquille", d:"allure", z:"allure", l:1, m:"t", cues:["Pas souples, épaules relâchées","Respire par le nez si tu peux","Tu dois pouvoir chanter"], err:["Partir trop vite"], prec:"Adapte l'allure au terrain.", anim:["walkA","walkB"], ph:["Pas gauche","Pas droit"], easy:null, hard:"marche_active"},
 {id:"marche_active", n:"Marche active", d:"allure", z:"allure", l:1, m:"t", cues:["Allure soutenue mais confortable","Tu peux parler, pas chanter","Bras qui accompagnent le pas"], err:["Se pencher en avant","Allonger exagérément le pas"], prec:"Ralentis si tu ne peux plus parler.", anim:["walkA","walkB"], ph:["Pas gauche","Pas droit"], easy:"marche_lente", hard:"marche_vive"},
 {id:"marche_vive", n:"Marche vive", d:"allure", z:"allure", l:2, m:"t", cues:["Pas plus rapides, pas plus longs","Respiration plus marquée","Phrases courtes possibles"], err:["Courir sans le vouloir"], prec:"Reviens à la marche active si tu t'essouffles.", anim:["walkA","walkB"], ph:["Pas gauche","Pas droit"], easy:"marche_active", hard:null},
 {id:"course_facile", n:"Course facile", d:"allure", z:"allure", l:1, imp:true, m:"t", cues:["Allure où tu peux parler","Petits pas, pieds sous le corps","Épaules basses, mains relâchées"], err:["Partir trop vite","Attaquer fort du talon"], prec:"Si tu ne peux plus parler, repasse en marche.", anim:["runA","runB"], ph:["Foulée gauche","Foulée droite"], easy:"marche_active", hard:"course_vive"},
 {id:"course_vive", n:"Course un peu plus vite", d:"allure", z:"allure", l:3, imp:true, m:"t", cues:["Un cran au-dessus de l'allure facile","Phrases courtes possibles","Reste en contrôle"], err:["Sprinter"], prec:"Jamais à fond : tu dois finir la séance.", anim:["runA","runB"], ph:["Foulée gauche","Foulée droite"], easy:"course_facile", hard:null},
 // ---- Échauffement / cardio doux
 {id:"genoux_hauts", n:"Marche sur place genoux hauts", d:"cardio", z:"cardio", l:1, m:"t", cues:["Monte le genou à hauteur confortable","Bras qui balancent","Reste bien droit·e"], err:["Se pencher en arrière"], prec:"Garde un appui stable, près d'un mur si besoin.", anim:["marchA","marchB"], ph:["Genou droit","Genou gauche"], easy:null, hard:"course_place"},
 {id:"talons_fesses", n:"Talons-fesses en marchant", d:"cardio", z:"cardio", l:1, m:"t", cues:["Talon vers l'arrière","Genoux sous les hanches","Rythme régulier"], err:["Cambrer le dos"], prec:"Va à ton rythme.", anim:["kickA","kickB"], ph:["Talon droit","Talon gauche"], easy:"genoux_hauts", hard:null},
 {id:"course_place", n:"Course sur place", d:"cardio", z:"cardio", l:2, imp:true, m:"t", cues:["Appuis légers sur l'avant du pied","Bras actifs","Respiration régulière"], err:["Taper fort au sol"], prec:"Remplace par la marche genoux hauts si tu veux éviter les impacts.", anim:["runA","runB"], ph:["Gauche","Droite"], easy:"genoux_hauts", hard:null},
 {id:"squat_bras", n:"Squat bras au ciel", d:"cardio", z:"cardio", l:1, m:"t", cues:["Descends à hauteur confortable","Remonte en tendant les bras","Talons au sol"], err:["Genoux qui rentrent"], prec:"Amplitude réduite si gêne aux genoux.", anim:["squatMid","reachUp"], ph:["Descente","Bras au ciel"], easy:null, hard:"squat"},
 {id:"rameur", n:"Rameur", d:"cardio", z:"cardio", l:1, eq:["rameur"], m:"t", cues:["Jambes, puis buste, puis bras","Retour dans l'ordre inverse","Dos neutre"], err:["Tirer d'abord avec les bras"], prec:"Résistance basse au début.", anim:["rowerA","rowerB"], ph:["Attaque","Fin de tirage"], hz:true, sc:"rower", easy:null, hard:null},
 {id:"velo", n:"Vélo d'appartement", d:"cardio", z:"cardio", l:1, eq:["velo"], m:"t", cues:["Selle à hauteur de hanche","Pédalage souple","Résistance modérée"], err:["Selle trop basse"], prec:"Augmente la résistance progressivement.", anim:["bikeA","bikeB"], ph:["Pédale haute","Pédale basse"], sc:"bike", easy:null, hard:null},
 // ---- Renforcement : bas du corps
 {id:"squat_partiel", n:"Demi-squat", d:"renfo", z:"bas", l:1, m:"r", r:"8–12", cues:["Pieds largeur de hanches","Fesses vers l'arrière, comme pour t'asseoir","Remonte en poussant dans le sol"], err:["Genoux qui rentrent vers l'intérieur"], prec:"Descends seulement là où c'est confortable.", anim:["stand","squatMid"], ph:["Debout","Mi-hauteur"], easy:null, hard:"squat"},
 {id:"assis_debout", n:"Assis-debout sur chaise", d:"renfo", z:"bas", l:1, eq:["chaise"], m:"r", r:"8–12", cues:["Pieds à plat, un peu écartés","Buste vers l'avant pour te lever","Rassieds-toi doucement"], err:["Se laisser tomber sur la chaise"], prec:"Utilise une chaise stable contre un mur.", anim:["sit","sitLean","chairStand","sitLean"], ph:["Assis·e","Transfert","Debout"], sc:"chair", easy:null, hard:"squat"},
 {id:"squat", n:"Squat", d:"renfo", z:"bas", l:2, m:"r", r:"10–15", cues:["Genoux dans l'axe des pieds","Poitrine haute","Talons au sol"], err:["Décoller les talons","Arrondir le dos"], prec:"Amplitude confortable, sans douleur.", anim:["stand","squatMid","squatLow","squatMid"], ph:["Debout","Descente","Position basse"], easy:"squat_partiel", hard:"goblet"},
 {id:"goblet", n:"Goblet squat", d:"renfo", z:"bas", l:2, any:["halteres","kettlebell"], m:"r", r:"10–12", cues:["Charge contre le sternum","Genoux dans l'axe","Remonte en soufflant"], err:["Charge trop lourde"], prec:"Commence léger.", anim:["kbStand","kbMid","kbSquat","kbMid"], ph:["Debout","Descente","Position basse"], easy:"squat", hard:null},
 {id:"fentes", n:"Fentes arrière", d:"renfo", z:"bas", l:2, m:"r", r:"8 / jambe", cues:["Grand pas en arrière","Genou avant au-dessus du pied","Buste droit"], err:["Genou avant qui dépasse beaucoup"], prec:"Tiens une chaise ou un mur pour l'équilibre.", anim:["standfree","lunge"], ph:["Debout","Fente"], easy:"squat_partiel", hard:null},
 {id:"step_up", n:"Montée sur marche", d:"renfo", z:"bas", l:1, eq:["step"], m:"r", r:"8 / jambe", cues:["Pose tout le pied sur la marche","Pousse sur la jambe d'appui","Redescends en contrôle"], err:["Pousser avec la jambe du bas"], prec:"Choisis une marche basse et stable, avec une rampe si possible.", anim:["stepA","stepB"], ph:["Pied sur la marche","En haut"], sc:"step", easy:"squat_partiel", hard:null},
 {id:"mollets", n:"Montées sur pointes", d:"renfo", z:"mollets", l:1, m:"r", r:"12–15", cues:["Monte sur l'avant du pied","Marque une pause en haut","Redescends lentement"], err:["Se balancer"], prec:"Appuie-toi à un mur si besoin.", anim:["stand","toes"], ph:["À plat","Sur pointes"], easy:null, hard:null},
 // ---- Charnière / fessiers
 {id:"pont", n:"Pont fessier", d:"renfo", z:"charniere", l:1, sol:true, m:"r", r:"10–15", cues:["Pieds à plat, genoux pliés","Soulève le bassin en serrant les fessiers","Redescends vertèbre par vertèbre"], err:["Cambrer le bas du dos"], prec:"Monte juste à l'alignement épaules-hanches-genoux.", anim:["bridgeDown","bridgeUp"], ph:["Au sol","Bassin haut"], hz:true, easy:null, hard:null},
 {id:"rdl", n:"Soulevé de terre roumain", d:"renfo", z:"charniere", l:2, any:["halteres","kettlebell"], m:"r", r:"10", cues:["Hanches vers l'arrière","Dos neutre","Charges proches des jambes"], err:["Arrondir le dos"], prec:"Descends jusqu'à mi-tibia maximum.", anim:["standdb","rdl"], ph:["Debout","Charnière"], easy:"pont", hard:null},
 {id:"superman", n:"Superman", d:"renfo", z:"tirer", l:1, sol:true, m:"r", r:"8–10", cues:["Allongé·e sur le ventre","Décolle bras et jambes légèrement","Regard vers le sol"], err:["Relever la tête"], prec:"Petite amplitude suffit.", anim:["superDown","superUp"], ph:["Au sol","Décollé"], hz:true, easy:null, hard:null},
 // ---- Haut du corps : pousser
 {id:"pompes_mur", n:"Pompes contre un mur", d:"renfo", z:"pousser", l:1, m:"r", r:"8–12", cues:["Mains à hauteur d'épaules","Corps aligné","Poitrine vers le mur"], err:["Creuser le dos"], prec:"Plus tes pieds sont proches du mur, plus c'est facile.", anim:["wallA","wallB"], ph:["Bras tendus","Poitrine au mur"], sc:"wall", easy:null, hard:"pompes_genoux"},
 {id:"pompes_genoux", n:"Pompes sur les genoux", d:"renfo", z:"pousser", l:2, sol:true, m:"r", r:"6–10", cues:["Mains sous les épaules","Corps aligné des genoux à la tête","Descente contrôlée"], err:["Hanches en l'air"], prec:"Pose un tapis ou une serviette sous les genoux.", anim:["kneeUp","kneeDown"], ph:["Bras tendus","Poitrine basse"], hz:true, easy:"pompes_mur", hard:"pompes"},
 {id:"pompes", n:"Pompes", d:"renfo", z:"pousser", l:3, sol:true, m:"r", r:"6–12", cues:["Corps gainé","Mains sous les épaules","Descente contrôlée"], err:["Bassin qui s'affaisse"], prec:"Repasse sur les genoux dès que la forme se dégrade.", anim:["pushup","push"], ph:["Bras tendus","Poitrine basse"], hz:true, easy:"pompes_genoux", hard:null},
 {id:"dev_epaules", n:"Développé épaules", d:"renfo", z:"pousser", l:2, eq:["halteres"], m:"r", r:"8–12", cues:["Haltères à hauteur d'épaules","Pousse vers le ciel","Abdos serrés"], err:["Cambrer en poussant"], prec:"Assis·e sur une chaise si tu préfères.", anim:["pressA","pressB"], ph:["Épaules","Bras tendus"], easy:"pompes_mur", hard:null},
 // ---- Haut du corps : tirer
 {id:"tirage_elastique", n:"Tirage à l'élastique", d:"renfo", z:"tirer", l:1, eq:["elastique"], m:"r", r:"12–15", cues:["Élastique accroché devant toi","Coudes vers l'arrière","Serre les omoplates"], err:["Hausser les épaules"], prec:"Vérifie l'accroche de l'élastique.", anim:["bandA","bandB"], ph:["Bras tendus","Coudes en arrière"], sc:"band", easy:null, hard:null},
 {id:"rowing", n:"Rowing haltère", d:"renfo", z:"tirer", l:2, any:["halteres","kettlebell"], m:"r", r:"10–12", cues:["Buste penché, dos neutre","Coude qui recule le long du corps","Épaules basses"], err:["Tourner le buste"], prec:"Appuie une main sur une chaise si besoin.", anim:["rowstart","row"], ph:["Bras tendu","Coude en arrière"], easy:"tirage_elastique", hard:null},
 // ---- Gainage / équilibre
 {id:"equilibre", n:"Équilibre sur une jambe", d:"renfo", z:"gainage", l:1, m:"t", cues:["Regard fixe devant toi","Genou levé à hauteur confortable","Change de jambe à mi-temps"], err:["Bloquer la respiration"], prec:"Garde une main près d'un mur ou d'une chaise.", anim:["stand","balance"], ph:["Appui","Genou levé"], easy:null, hard:null},
 {id:"bird_dog", n:"Bird-dog", d:"renfo", z:"gainage", l:1, sol:true, m:"r", r:"6 / côté", cues:["À quatre pattes, dos plat","Allonge un bras et la jambe opposée","Reviens lentement"], err:["Cambrer"], prec:"Commence par le bras seul, puis la jambe seule.", anim:["quad","birddog"], ph:["Quatre pattes","Allongé·e"], hz:true, easy:null, hard:"gainage"},
 {id:"gainage_genoux", n:"Gainage sur les genoux", d:"renfo", z:"gainage", l:1, sol:true, m:"t", cues:["Coudes sous les épaules","Ligne droite des genoux à la tête","Respire calmement"], err:["Fesses trop hautes"], prec:"Arrête si le bas du dos tire.", anim:["plankKnee","plankKnee2"], ph:["Tenir la position"], hz:true, easy:null, hard:"gainage"},
 {id:"gainage", n:"Gainage", d:"renfo", z:"gainage", l:2, sol:true, m:"t", cues:["Coudes sous les épaules","Ne creuse pas le dos","Respire calmement"], err:["Bloquer la respiration"], prec:"Repasse sur les genoux si besoin.", anim:["plank","plank2"], ph:["Tenir la position"], hz:true, easy:"gainage_genoux", hard:null},
 {id:"farmer", n:"Marche du fermier", d:"renfo", z:"porter", l:2, any:["halteres","kettlebell"], m:"t", cues:["Une charge dans chaque main","Épaules basses, buste droit","Pas courts et contrôlés"], err:["Pencher d'un côté"], prec:"Charges équilibrées et modérées.", anim:["farmerA","farmerB"], ph:["Pas gauche","Pas droit"], easy:null, hard:null},
 // ---- Mobilité / retour au calme
 {id:"cercles_bras", n:"Cercles de bras", d:"mobilite", z:"mobilite", l:1, m:"t", cues:["Grands cercles lents","Change de sens à mi-temps","Épaules relâchées"], err:["Aller trop vite"], prec:"Réduis l'amplitude si l'épaule gêne.", anim:["stand","standFwd","reachUp","armsBack"], ph:["Bas","Devant","Haut","Arrière"], easy:null, hard:null},
 {id:"rotation_buste", n:"Rotations du buste", d:"mobilite", z:"mobilite", l:1, m:"t", cues:["Bassin fixe","Tourne les épaules d'un côté puis de l'autre","Mouvement fluide"], err:["Tourner les hanches"], prec:"Sans à-coups.", anim:["standFwd","armsTwist"], ph:["Face","Rotation"], easy:null, hard:null},
 {id:"chat_vache", n:"Dos rond, dos creux", d:"mobilite", z:"mobilite", l:1, sol:true, m:"t", cues:["À quatre pattes","Arrondis le dos en expirant","Creuse doucement en inspirant"], err:["Forcer l'amplitude"], prec:"Reste dans une zone confortable.", anim:["cat","cow"], ph:["Dos rond","Dos creux"], hz:true, easy:null, hard:null},
 {id:"enfant", n:"Posture de l'enfant", d:"mobilite", z:"mobilite", l:1, sol:true, m:"t", cues:["Fesses vers les talons","Bras allongés devant","Respire dans le dos"], err:["Forcer sur les genoux"], prec:"Un coussin sous les fesses si besoin.", anim:["quad","child"], ph:["Quatre pattes","Posture de l'enfant"], hz:true, easy:null, hard:null},
 {id:"fente_etirement", n:"Étirement avant de hanche", d:"mobilite", z:"mobilite", l:1, sol:true, m:"t", cues:["Genou arrière au sol","Avance doucement le bassin","Change de côté à mi-temps"], err:["Cambrer"], prec:"Coussin sous le genou.", anim:["hipA","hipB"], ph:["Position","Bassin en avant"], easy:null, hard:null},
 {id:"ischios_debout", n:"Étirement arrière des cuisses", d:"mobilite", z:"mobilite", l:1, m:"t", cues:["Talon devant, jambe tendue","Penche le buste dos droit","Change de jambe à mi-temps"], err:["Arrondir le dos"], prec:"Tension légère, jamais de douleur.", anim:["hamA","hamB"], ph:["Debout","Buste penché"], easy:null, hard:null},
 {id:"mollets_etirement", n:"Étirement des mollets", d:"mobilite", z:"mobilite", l:1, m:"t", cues:["Mains contre le mur","Jambe arrière tendue, talon au sol","Change de jambe à mi-temps"], err:["Décoller le talon"], prec:"Progressif, sans à-coups.", anim:["calfA","calfB"], ph:["Position","Appui avant"], sc:"wall", easy:null, hard:null},
 {id:"respiration", n:"Respiration calme", d:"mobilite", z:"mobilite", l:1, m:"t", cues:["Inspire en montant les bras","Expire lentement en les redescendant","Laisse le cœur ralentir"], err:["Retenir son souffle"], prec:"Assis·e si tu préfères.", anim:["stand","reachUp"], ph:["Expire","Inspire"], easy:null, hard:null}
];
const EXI = Object.fromEntries(EX.map(e => [e.id, e]));

/* ---------- Poses (vue de profil, sol à y=0, tournée vers la droite) ---------- */
const POSES = {
 stand:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[4,-108],a:[6,-84]},
 standFwd:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[26,-131],a:[50,-129]},
 reachUp:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[4,-160],a:[6,-186]},
 armsBack:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[-22,-148],a:[-40,-164]},
 armsTwist:{h:[2,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[-24,-131],a:[-48,-129]},
 squatMid:{h:[14,-132],n:[6,-114],p:[-14,-64],k:[16,-46],f:[0,0],e:[30,-112],a:[54,-110]},
 squatLow:{h:[24,-110],n:[12,-94],p:[-26,-46],k:[22,-46],f:[0,0],e:[36,-94],a:[60,-94]},
 sit:{h:[-12,-120],n:[-18,-101],p:[-28,-50],k:[12,-50],f:[12,0],e:[6,-100],a:[30,-100]},
 sitLean:{h:[22,-122],n:[10,-106],p:[-14,-62],k:[14,-46],f:[12,0],e:[32,-106],a:[54,-104]},
 chairStand:{h:[10,-153],n:[6,-134],p:[4,-82],k:[10,-42],f:[12,0],e:[28,-130],a:[52,-128]},
 kbStand:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[12,-112],a:[18,-124],o:"kb"},
 kbMid:{h:[10,-134],n:[5,-116],p:[-12,-62],k:[14,-42],f:[0,0],e:[18,-96],a:[23,-106],o:"kb"},
 kbSquat:{h:[16,-114],n:[9,-97],p:[-24,-42],k:[24,-44],f:[0,0],e:[22,-78],a:[27,-89],o:"kb"},
 standdb:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[4,-108],a:[6,-84],o:"db"},
 rdl:{h:[52,-98],n:[36,-92],p:[-8,-82],k:[4,-42],f:[0,0],e:[36,-68],a:[36,-46],o:"db"},
 standfree:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],k2:[-2,-42],f2:[-4,0],e:[10,-104],a:[2,-84]},
 lunge:{h:[4,-128],n:[2,-110],p:[0,-58],k:[28,-36],f:[28,0],k2:[-22,-10],f2:[-52,0],e:[10,-84],a:[2,-62]},
 stepA:{h:[12,-151],n:[6,-132],p:[0,-82],k:[26,-64],f:[28,-30],k2:[-1,-42],f2:[-4,0],e:[10,-107],a:[12,-83]},
 stepB:{h:[30,-181],n:[26,-162],p:[24,-110],k:[28,-70],f:[28,-30],k2:[16,-74],f2:[8,-38],e:[28,-137],a:[30,-113]},
 toes:{h:[4,-162],n:[0,-143],p:[0,-91],k:[3,-51],f:[0,-9],e:[4,-117],a:[6,-93]},
 bridgeDown:{h:[-74,-10],n:[-56,-10],p:[-4,-10],k:[24,-40],f:[40,0],e:[-30,-4],a:[-8,-3]},
 bridgeUp:{h:[-72,-11],n:[-54,-14],p:[0,-38],k:[32,-46],f:[40,0],e:[-30,-4],a:[-8,-3]},
 superDown:{h:[70,-10],n:[52,-10],p:[0,-10],k:[-40,-8],f:[-80,-6],e:[76,-10],a:[100,-10]},
 superUp:{h:[70,-26],n:[52,-20],p:[0,-11],k:[-40,-16],f:[-78,-24],e:[76,-28],a:[98,-36]},
 wallA:{h:[52,-144],n:[44,-126],p:[26,-80],k:[14,-40],f:[0,0],e:[60,-110],a:[74,-118]},
 wallB:{h:[66,-134],n:[56,-120],p:[30,-78],k:[16,-40],f:[0,0],e:[52,-98],a:[74,-118]},
 kneeUp:{h:[84,-64],n:[68,-58],p:[12,-30],k:[-18,-4],f:[-46,-18],e:[66,-30],a:[66,0]},
 kneeDown:{h:[84,-40],n:[68,-34],p:[12,-18],k:[-18,-4],f:[-46,-18],e:[50,-18],a:[66,0]},
 pushup:{h:[82,-64],n:[66,-58],p:[10,-36],k:[-24,-21],f:[-56,-6],e:[66,-30],a:[66,0]},
 push:{h:[82,-44],n:[66,-38],p:[10,-26],k:[-24,-16],f:[-56,-6],e:[50,-20],a:[66,0]},
 plank:{h:[84,-40],n:[68,-34],p:[10,-24],k:[-24,-15],f:[-58,-6],e:[66,-4],a:[84,-2]},
 plank2:{h:[84,-41],n:[68,-35],p:[10,-27],k:[-24,-16],f:[-58,-6],e:[66,-4],a:[84,-2]},
 plankKnee:{h:[80,-36],n:[64,-30],p:[10,-18],k:[-20,-4],f:[-48,-18],e:[62,-4],a:[80,-2]},
 plankKnee2:{h:[80,-37],n:[64,-31],p:[10,-20],k:[-20,-4],f:[-48,-18],e:[62,-4],a:[80,-2]},
 pressA:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[14,-112],a:[10,-138],o:"db"},
 pressB:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[6,-160],a:[4,-186],o:"db"},
 bandA:{h:[4,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[24,-126],a:[48,-124],o:"band"},
 bandB:{h:[2,-153],n:[0,-134],p:[0,-82],k:[3,-42],f:[0,0],e:[-16,-120],a:[8,-122],o:"band"},
 rowstart:{h:[50,-94],n:[34,-88],p:[-8,-74],k:[6,-38],f:[0,0],e:[38,-66],a:[40,-44],o:"db"},
 row:{h:[50,-94],n:[34,-88],p:[-8,-74],k:[6,-38],f:[0,0],e:[20,-70],a:[30,-60],o:"db"},
 balance:{h:[4,-153],n:[0,-134],p:[0,-82],k:[22,-74],f:[22,-36],k2:[1,-42],f2:[0,0],e:[24,-124],a:[46,-120]},
 quad:{h:[66,-66],n:[50,-60],s:[20,-62],p:[-8,-60],k:[-10,-4],f:[-44,-2],e:[50,-32],a:[52,-2]},
 cat:{h:[60,-46],n:[50,-58],s:[20,-80],p:[-8,-60],k:[-10,-4],f:[-44,-2],e:[50,-32],a:[52,-2]},
 cow:{h:[68,-76],n:[50,-60],s:[20,-48],p:[-8,-62],k:[-10,-4],f:[-44,-2],e:[50,-32],a:[52,-2]},
 birddog:{h:[66,-66],n:[50,-60],s:[20,-62],p:[-8,-60],k:[-40,-62],f:[-76,-64],k2:[-10,-4],f2:[-44,-2],e:[74,-64],a:[98,-66],e2:[50,-32],a2:[52,-2]},
 child:{h:[46,-12],n:[30,-22],s:[4,-38],p:[-22,-24],k:[6,-4],f:[-30,-4],e:[58,-8],a:[84,-4]},
 hipA:{h:[10,-117],n:[6,-98],p:[0,-46],k:[30,-40],f:[34,0],k2:[-22,-4],f2:[-56,-2],e:[18,-74],a:[28,-46]},
 hipB:{h:[16,-113],n:[12,-94],p:[8,-40],k:[34,-38],f:[34,0],k2:[-22,-4],f2:[-56,-2],e:[24,-70],a:[32,-44]},
 hamA:{h:[2,-153],n:[-2,-134],p:[-6,-82],k:[12,-40],f:[30,0],k2:[-8,-42],f2:[-12,0],e:[0,-108],a:[4,-84]},
 hamB:{h:[44,-128],n:[30,-118],p:[-10,-80],k:[12,-40],f:[30,0],k2:[-10,-42],f2:[-14,0],e:[36,-94],a:[30,-70]},
 calfA:{h:[50,-140],n:[40,-124],p:[8,-80],k:[38,-40],f:[28,0],k2:[-14,-40],f2:[-36,0],e:[60,-114],a:[76,-120]},
 calfB:{h:[56,-136],n:[46,-120],p:[12,-78],k:[42,-38],f:[28,0],k2:[-14,-40],f2:[-36,0],e:[62,-108],a:[76,-120]},
 marchA:{h:[4,-153],n:[0,-134],p:[0,-82],k:[22,-74],f:[18,-36],k2:[0,-42],f2:[-2,0],e:[-10,-108],a:[-4,-86]},
 marchB:{h:[4,-153],n:[0,-134],p:[0,-82],k:[0,-42],f:[-2,0],k2:[22,-74],f2:[18,-36],e:[14,-110],a:[22,-90]},
 kickA:{h:[4,-153],n:[0,-134],p:[0,-82],k:[-2,-42],f:[-30,-58],k2:[1,-42],f2:[0,0],e:[10,-110],a:[16,-90]},
 kickB:{h:[4,-153],n:[0,-134],p:[0,-82],k:[1,-42],f:[0,0],k2:[-2,-42],f2:[-30,-58],e:[-8,-110],a:[-4,-88]},
 walkA:{h:[6,-152],n:[2,-133],p:[0,-82],k:[12,-43],f:[18,0],k2:[-8,-43],f2:[-16,0],e:[-8,-110],a:[-12,-88]},
 walkB:{h:[6,-152],n:[2,-133],p:[0,-82],k:[-8,-43],f:[-16,0],k2:[12,-43],f2:[18,0],e:[10,-110],a:[18,-88]},
 runA:{h:[14,-150],n:[8,-132],p:[0,-82],k:[26,-62],f:[16,-28],k2:[-10,-42],f2:[-26,0],e:[-14,-112],a:[-2,-96]},
 runB:{h:[14,-150],n:[8,-132],p:[0,-82],k:[-10,-42],f:[-26,0],k2:[26,-62],f2:[16,-28],e:[22,-114],a:[34,-100]},
 rowerA:{h:[22,-86],n:[12,-70],p:[-6,-20],k:[22,-50],f:[44,-14],e:[30,-56],a:[48,-42]},
 rowerB:{h:[-50,-82],n:[-46,-64],p:[-30,-20],k:[6,-22],f:[44,-14],e:[-34,-40],a:[-14,-44]},
 bikeA:{h:[26,-144],n:[14,-128],p:[-12,-84],k:[22,-74],f:[6,-44],k2:[18,-52],f2:[6,-16],e:[30,-108],a:[46,-98]},
 bikeB:{h:[26,-144],n:[14,-128],p:[-12,-84],k:[18,-52],f:[6,-16],k2:[22,-74],f2:[6,-44],e:[30,-108],a:[46,-98]},
 farmerA:{h:[3,-153],n:[0,-134],p:[0,-82],k:[8,-42],f:[14,0],k2:[-6,-42],f2:[-14,0],e:[2,-106],a:[4,-80],o:"kb"},
 farmerB:{h:[3,-153],n:[0,-134],p:[0,-82],k:[-6,-42],f:[-14,0],k2:[8,-42],f2:[14,0],e:[2,-106],a:[4,-80],o:"kb"}
};

/* ---------- Événements : exemples fictifs pour le prototype ----------
 Aucun de ces événements n'existe. Dates calculées à partir d'aujourd'hui pour que la démo reste utilisable.
 off = jours à partir d'aujourd'hui ; null = date inconnue (jamais inventée). */
const DEMO_EVENTS = [
 {id:"d1", t:"Course des Berges", sport:"course", fmt:"5 km", dist:5, city:"Toulouse", dep:"31", off:63, price:12, lvl:"Débutant bienvenu", kind:"Course", access:"Parcours plat, poussettes acceptées (déclaré)", status:"ok"},
 {id:"d2", t:"Les 10 km de la Cité", sport:"course", fmt:"10 km", dist:10, city:"Carcassonne", dep:"11", off:98, price:18, lvl:"Intermédiaire", kind:"Course", access:"Pavés sur 1 km (déclaré)", status:"ok"},
 {id:"d3", t:"Marche solidaire du Thoré", sport:"marche", fmt:"8 km", dist:8, city:"Castres", dep:"81", off:24, price:0, lvl:"Tous niveaux", kind:"Marche", access:"Boucle de 3 km accessible en fauteuil (déclaré)", status:"ok"},
 {id:"d4", t:"Fitness race découverte", sport:"hybride", fmt:"Duo · 8 ateliers", dist:null, city:"Montpellier", dep:"34", off:77, price:35, lvl:"Débutant bienvenu", kind:"Fitness race", access:"Ateliers adaptables (déclaré)", status:"ok"},
 {id:"d5", t:"Rando des coteaux", sport:"marche", fmt:"12 km", dist:12, city:"Albi", dep:"81", off:45, price:5, lvl:"Intermédiaire", kind:"Randonnée", access:"Dénivelé modéré", status:"ok"},
 {id:"d6", t:"Course nature d'automne", sport:"course", fmt:"7 km nature", dist:7, city:"Foix", dep:"09", off:null, price:15, lvl:"Intermédiaire", kind:"Trail", access:"Chemins, racines", status:"unknown"},
 {id:"d7", t:"Portes ouvertes d'un club d'athlé", sport:"course", fmt:"Initiation", dist:null, city:"Narbonne", dep:"11", off:10, price:0, lvl:"Tous niveaux", kind:"Découverte", access:"Stade accessible (déclaré)", status:"ok"},
 {id:"d8", t:"Défi 30 jours de marche", sport:"marche", fmt:"Défi virtuel", dist:null, city:"En ligne", dep:"—", off:6, price:0, lvl:"Tous niveaux", kind:"Défi virtuel", access:"À ton rythme, où tu veux", status:"ok"},
 {id:"d9", t:"Course de nuit des remparts", sport:"course", fmt:"6 km", dist:6, city:"Carcassonne", dep:"11", off:35, price:14, lvl:"Tous niveaux", kind:"Course", access:"Éclairage partiel", status:"cancelled"}
];

const REAL_SOURCES = [
 {t:"Calendrier FFA (athlétisme, courses)", u:"https://www.athle.fr/base/calendrier"},
 {t:"Finishers — fitness races et courses", u:"https://www.finishers.com/fr/thematiques/fitness-race"},
 {t:"HYROX — trouver une course", u:"https://hyrox.com/find-my-race/"}
];
