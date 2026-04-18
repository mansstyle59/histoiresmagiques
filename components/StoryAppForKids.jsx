import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Play, Pause, Volume2, VolumeX, Home, Save, Zap, ChevronRight, Trophy, BarChart3, Moon, Sun, Heart } from 'lucide-react';

export default function StoryAppForKids() {
  const [screen, setScreen] = useState('menu');
  const [theme, setTheme] = useState('dark');
  const [storyId, setStoryId] = useState(null);
  const [nodeId, setNodeId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [voice, setVoice] = useState(0);
  const [voices, setVoices] = useState([]);
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('kidsStats');
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      choices: 0,
      endings: 0,
      points: 0,
      favorites: [],
      achievements: []
    };
  });
  const [showStats, setShowStats] = useState(false);

  const synthRef = useRef(window.speechSynthesis);
  const audioRef = useRef(null);

  // ====== HISTOIRES VRAIES POUR ENFANTS ======

  const stories = {
    1: {
      title: "🐱 Luna la Petite Chatte Courageuse",
      desc: "Une chatte perdue doit retrouver sa maison",
      color: "from-orange-600 to-pink-800",
      difficulty: "⭐"
    },
    2: {
      title: "🌱 Le Secret du Jardin Magique",
      desc: "Découvre un jardin caché rempli de secrets",
      color: "from-green-600 to-emerald-800",
      difficulty: "⭐⭐"
    },
    3: {
      title: "⭐ Stella la Princesse Courageuse",
      desc: "Une princesse qui préfère l'aventure aux châteaux",
      color: "from-purple-600 to-pink-800",
      difficulty: "⭐⭐"
    },
    4: {
      title: "🦁 Léo le Lion Gentil",
      desc: "Un lion qui a peur mais devient un héros",
      color: "from-yellow-600 to-orange-800",
      difficulty: "⭐"
    },
    5: {
      title: "🌊 Océane la Sirène Musicienne",
      desc: "Une sirène découvre le monde des humains",
      color: "from-cyan-600 to-blue-800",
      difficulty: "⭐⭐"
    },
    6: {
      title: "🧙 Merlin le Jeune Magicien",
      desc: "Un garçon découvre ses pouvoirs magiques",
      color: "from-indigo-600 to-purple-800",
      difficulty: "⭐⭐⭐"
    },
    7: {
      title: "🦅 Maya l'Aigle des Montagnes",
      desc: "Un aigle orphelin apprend à voler et à vivre",
      color: "from-amber-600 to-orange-800",
      difficulty: "⭐⭐"
    },
    8: {
      title: "🏰 Théo et le Château Enchanté",
      desc: "Un garçon découvre un château rempli de magie",
      color: "from-slate-700 to-slate-900",
      difficulty: "⭐⭐⭐"
    },
    9: {
      title: "🦋 Fleur et les Papillons Arc-en-ciel",
      desc: "Une fille qui sauve une forêt enchantée",
      color: "from-pink-600 to-rose-800",
      difficulty: "⭐⭐"
    },
    10: {
      title: "🎸 Tom le Musicien Rêveur",
      desc: "Un garçon qui rêve de devenir musicien",
      color: "from-red-600 to-orange-700",
      difficulty: "⭐⭐⭐"
    }
  };

  // ====== NŒUDS D'HISTOIRES VRAIES ET COMPLÈTES ======

  const nodes = {
    // HISTOIRE 1: Luna la Petite Chatte
    start1: {
      text: "Luna est une petite chatte orange toute mignonne. Un jour, en jouant avec un papillon, elle s'est perdue dans la grande forêt près de sa maison. Elle miaule très fort, son petit cœur a peur. C'est déjà la fin de l'après-midi, et bientôt il fera noir. Que fait Luna?",
      choices: [
        { text: "Chercher un endroit sûr pour dormir", node: 'luna_abri', points: 15 },
        { text: "Suivre les bruits familiers vers la maison", node: 'luna_maison', points: 25 },
        { text: "Crier pour que quelqu'un l'entende", node: 'luna_crier', points: 20 }
      ]
    },
    luna_abri: {
      text: "Luna trouve une petite grotte sous une racine d'arbre. C'est sec et douillet. Elle se couche en boule et attend le matin. Elle rêve de sa maison et de sa maman qui lui prépare du lait chaud. Le matin, elle se sent beaucoup mieux et plus courageuse.",
      choices: [
        { text: "Partir vers le chant des oiseaux", node: 'luna_oiseaux', points: 20 },
        { text: "Suivre l'odeur de la maison", node: 'luna_retour', points: 25 }
      ]
    },
    luna_maison: {
      text: "Luna suit les sons qu'elle reconnaît - le ruisseau près de chez elle ! Elle marche le long du ruisseau pendant une heure. L'eau fraîche soulage ses petites pattes. Elle voit les maisons au loin !",
      choices: [
        { text: "Courir aussi vite que possible", node: 'fin1_reunion', points: 50 },
        { text: "Miaouler pour montrer où elle est", node: 'fin1_reunion', points: 50 }
      ]
    },
    luna_crier: {
      text: "Luna crie et miaule aussi fort qu'elle peut. Ses miaous résonnent dans la forêt. Après un moment, elle entend une voix familière... C'est son petit ami Lucas ! Il l'a cherchée partout. Il la prend dans ses bras et la ramène à la maison.",
      choices: [
        { text: "🔄 Recommencer", node: 'start1', points: 0 }
      ],
      isEnding: true
    },
    luna_oiseaux: {
      text: "Luna suit les oiseaux qui chantent. Ils la conduisent à travers la forêt. Elle reconnaît l'arbre du jardin, puis le potager, puis... sa maison ! Sa maman la découvre et la serre très fort dans ses bras. Luna a appris qu'être courageux peut t'aider à trouver ton chemin.",
      choices: [
        { text: "🔄 Recommencer", node: 'start1', points: 0 }
      ],
      isEnding: true
    },
    luna_retour: {
      text: "Luna suit l'odeur de sa maison. C'est comme une carte invisible pour elle. Elle marche, saute, grimpe. Finalement, elle arrive à la barrière du jardin. Sa famille la cherchait partout ! Quand elle arrive, tout le monde crie de joie. Luna saute dans les bras de Lucas et ronronne très fort.",
      choices: [
        { text: "🔄 Recommencer", node: 'start1', points: 0 }
      ],
      isEnding: true
    },
    fin1_reunion: {
      text: "Luna rentre à la maison ! Sa maman la serre très fort dans ses bras. Elle est si contente de la revoir. Lucas lui prépare un repas délicieux. Cette nuit, Luna dort près de Lucas et fait des rêves heureux. Elle a appris que même quand on a peur, la courage et l'espoir peuvent nous ramener à la maison. FIN - Luna a retrouvé sa famille!",
      choices: [
        { text: "🔄 Recommencer", node: 'start1', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 2: Le Jardin Magique
    start2: {
      text: "Tu trouves une vieille clé rouillée derrière la maison de ta grand-mère. Elle est suspendue à un ruban violet usé. Tu n'as jamais vu cette clé avant. Curieux, tu explores le jardin et tu découvres une petite porte en bois cachée derrière les buissons de roses. La clé est juste à la bonne taille! Que fais-tu?",
      choices: [
        { text: "Ouvrir la porte et explorer", node: 'jardin_entrer', points: 30 },
        { text: "Demander à ta grand-mère d'abord", node: 'jardin_grandmere', points: 25 },
        { text: "Appeler ton ami pour avoir du courage", node: 'jardin_ami', points: 20 }
      ]
    },
    jardin_entrer: {
      text: "Tu ouvres la porte. À l'intérieur... c'est incroyable! Un jardin magique apparaît devant toi. Il y a des fleurs de toutes les couleurs, des arbres qui touchent les nuages, et des papillons iridescents de la taille de ta main. L'air sent les myrtilles et le miel. Tu vois un petit sentier avec des galets brillants. Où tu vas?",
      choices: [
        { text: "Suivre le sentier brillant", node: 'jardin_sentier', points: 25 },
        { text: "Cueillir une fleur pour la montrer à ta grand-mère", node: 'jardin_fleur', points: 20 }
      ]
    },
    jardin_grandmere: {
      text: "Tu vas chercher ta grand-mère. Quand tu lui montres la clé et la porte, ses yeux deviennent brillants. Elle sourit mystérieusement et dit: 'Je t'attendais! Cette clé t'appartient maintenant. Ce jardin était mon secret quand j'avais ton âge. Je t'y emmène!' Elle prend ta main et ensemble, vous explorez les merveilles du jardin magique.",
      choices: [
        { text: "🔄 Recommencer", node: 'start2', points: 0 }
      ],
      isEnding: true
    },
    jardin_ami: {
      text: "Tu appelles ton ami. Il arrive rapidement, tout excité. Ensemble, vous ouvrez la porte et découvrez le jardin magique. Vous explorez chaque coin avec émerveillement. Vous trouvez un petit lac avec des poissons argentés, un arbre qui produit des fruits bonbons, et une clairière où les papillons dansent comme des acrobates.",
      choices: [
        { text: "🔄 Recommencer", node: 'start2', points: 0 }
      ],
      isEnding: true
    },
    jardin_sentier: {
      text: "Tu suis le sentier brillant. Il te mène à une clairière secrète au cœur du jardin. Au centre se trouve un arbre ancien et majestueux. Ses racines forment un trône naturel. Quand tu t'assieds dessus, tu entends une voix douce et sage qui te parle. C'est l'esprit de la nature! Il te dit que ce jardin est maintenant ton refuge secret.",
      choices: [
        { text: "🔄 Recommencer", node: 'start2', points: 0 }
      ],
      isEnding: true
    },
    jardin_fleur: {
      text: "Tu cueilles une fleur d'or scintillante. Elle brille dans ta main comme une lumière douce. Quand tu la montres à ta grand-mère, elle te raconte l'histoire du jardin magique. C'était son jardin secret depuis 50 ans! Elle t'explique que certains endroits du monde sont restés magiques pour les enfants courageux qui savent les regarder avec le cœur. FIN - Tu as découvert la magie!",
      choices: [
        { text: "🔄 Recommencer", node: 'start2', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 3: Stella la Princesse
    start3: {
      text: "Stella est une princesse, mais elle n'aime pas rester au château. Elle préfère l'aventure! Un jour, elle voit un parchemin qui tombe du ciel. Il dit: 'Il existe une montagne cachée remplie de cristaux magiques. Mais attention: les épreuves sont dangereuses!' Stella prend une profonde respiration. Que fait-elle?",
      choices: [
        { text: "Partir seule découvrir la montagne", node: 'stella_seule', points: 30 },
        { text: "Chercher les guerriers les plus forts du royaume", node: 'stella_guerriers', points: 25 },
        { text: "Consulter la sorcière sage de la forêt", node: 'stella_sorciere', points: 35 }
      ]
    },
    stella_seule: {
      text: "Stella s'habille comme une aventurière et part seule. Elle est nerveuse mais déterminée. Elle traverse des rivières, escalade des collines, et traverse une forêt mystérieuse. En chemin, elle aide un renard piégé. Le renard reconnaissant la guide jusqu'à la montagne cachée.",
      choices: [
        { text: "🔄 Recommencer", node: 'start3', points: 0 }
      ],
      isEnding: true
    },
    stella_guerriers: {
      text: "Stella rassemble les meilleurs guerriers du royaume. Ensemble, ils forment une équipe puissante. Pendant leur voyage, ils apprennent que la vraie force vient du travail d'équipe et de l'amitié, pas seulement de la force physique.",
      choices: [
        { text: "🔄 Recommencer", node: 'start3', points: 0 }
      ],
      isEnding: true
    },
    stella_sorciere: {
      text: "La sorcière sage lui donne un cristal protecteur et des conseils précieux. Elle explique à Stella que le vrai courage c'est d'avoir peur mais d'avancer quand même. Stella arrive à la montagne et trouve les cristaux magiques. Elle devient une légende - la princesse aventurière. FIN - Stella a trouvé sa vraie destinée!",
      choices: [
        { text: "🔄 Recommencer", node: 'start3', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 4: Léo le Lion
    start4: {
      text: "Léo est un petit lion. Tous les autres animaux pensent que les lions sont féroces et courageux. Mais Léo a un secret: il a peur de tout! Il a peur du tonnerre, de l'obscurité, même des souris! Un jour, un enfant humain tombe dans le ravin. Personne ne peut l'aider. Léo regarde l'enfant tremblant. Que fait Léo?",
      choices: [
        { text: "Surmonter sa peur et aider l'enfant", node: 'leo_aide', points: 40 },
        { text: "Demander l'aide aux autres animaux", node: 'leo_aide2', points: 30 },
        { text: "Cacher sa peur et prétendre être courageux", node: 'leo_prétend', points: 25 }
      ]
    },
    leo_aide: {
      text: "Léo prend une profonde respiration. Il a peur, mais il sait qu'il doit aider. Il descend dans le ravin lentement. Ses pattes tremblent, mais il continue. Finalement, il atteint l'enfant. Ensemble, ils remontent. Léo a appris quelque chose d'important: le courage n'est pas l'absence de peur. C'est d'agir même quand on a peur!",
      choices: [
        { text: "🔄 Recommencer", node: 'start4', points: 0 }
      ],
      isEnding: true
    },
    leo_aide2: {
      text: "Léo appelle les autres animaux. Ensemble, ils forment une chaîne et sauvent l'enfant. Léo réalise que c'est bon de demander de l'aide. Après cela, les autres animaux respectent Léo non pas parce qu'il est courageux tout seul, mais parce qu'il fait le bon choix.",
      choices: [
        { text: "🔄 Recommencer", node: 'start4', points: 0 }
      ],
      isEnding: true
    },
    leo_prétend: {
      text: "Léo saute dans le ravin en rugissant, même s'il a peur. Finalement, il aide l'enfant à remonter. L'enfant remarque que Léo tremble. Il dit: 'Merci d'avoir eu peur et de m'avoir aidé quand même. Tu es vraiment courageux!' Léo comprend alors que le vrai courage c'est d'être honnête. FIN - Léo devient un vrai héros!",
      choices: [
        { text: "🔄 Recommencer", node: 'start4', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 5: Océane la Sirène
    start5: {
      text: "Océane est une jeune sirène avec une voix magnifique. Elle vit dans la cité sous-marine de Perl, sous l'océan. Mais elle rêve du monde des humains qu'elle a aperçu à travers les vagues. Un jour, une bouteille avec un message tombe du ciel. Elle dit: 'Si tu es assez courageuse, viens me rencontrer sur la plage.' Que fait Océane?",
      choices: [
        { text: "Nager jusqu'à la plage secrète", node: 'ocean_plage', points: 30 },
        { text: "Consulter l'ancien dauphin sage", node: 'ocean_dauphin', points: 35 },
        { text: "Convaincre ses amies de venir aussi", node: 'ocean_amies', points: 25 }
      ]
    },
    ocean_plage: {
      text: "Océane nage seule vers la plage. Elle a peur mais elle est aussi excitée. En arrivant, elle découvre un garçon musicien qui jouait de la guitare. Il voulait rencontrer quelqu'un qui aime la musique autant que lui. Océane et le garçon passent des heures à chanter ensemble. C'est le début d'une belle amitié entre les mondes.",
      choices: [
        { text: "🔄 Recommencer", node: 'start5', points: 0 }
      ],
      isEnding: true
    },
    ocean_dauphin: {
      text: "Le dauphin sage lui raconte des histoires du monde des humains. Il lui explique qu'il y a une magie quand deux mondes différents se rencontrent. Il l'encourage à aller à la plage. Océane y va et trouve une amitié magique avec une enfant qui adore l'océan. FIN - Océane a trouvé sa place entre deux mondes!",
      choices: [
        { text: "🔄 Recommencer", node: 'start5', points: 0 }
      ],
      isEnding: true
    },
    ocean_amies: {
      text: "Ses amies hésitent d'abord, mais elles viennent avec elle. À la plage, elles rencontrent un groupe d'enfants humains. Ensemble, ils créent une célébration de la mer et de la musique. Les deux mondes deviennent amis.",
      choices: [
        { text: "🔄 Recommencer", node: 'start5', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 6: Merlin le Jeune Magicien
    start6: {
      text: "Merlin a 12 ans et vient de découvrir qu'il a des pouvoirs magiques! Son premier sortilège a fait exploser la lampe du salon. Sa grand-mère révèle qu'elle aussi est une magicienne. Elle lui donne un choix: apprendre la magie pour aider les gens, ou apprendre la magie pour avoir du pouvoir. Quel chemin Merlin choisit-il?",
      choices: [
        { text: "Apprendre pour aider les autres", node: 'merlin_aide', points: 40 },
        { text: "Apprendre pour devenir puissant", node: 'merlin_pouvoir', points: 30 },
        { text: "Rejeter la magie et vivre normalement", node: 'merlin_normal', points: 25 }
      ]
    },
    merlin_aide: {
      text: "Merlin décide d'utiliser sa magie pour aider les gens. Sa grand-mère lui enseigne des sortilèges de guérison, de protection, et de joie. Merlin aide ses amis, sa communauté, et même des étrangers. Il découvre que la magie la plus puissante c'est celle qui apporte du bonheur. FIN - Merlin devient un magicien du cœur!",
      choices: [
        { text: "🔄 Recommencer", node: 'start6', points: 0 }
      ],
      isEnding: true
    },
    merlin_pouvoir: {
      text: "Merlin veut devenir très puissant. Mais sa grand-mère lui dit une vérité importante: le pouvoir sans compassion apporte la solitude. Elle lui enseigne des sorts puissants, mais aussi la sagesse. Finalement, Merlin découvre que le vrai pouvoir est de faire le bien.",
      choices: [
        { text: "🔄 Recommencer", node: 'start6', points: 0 }
      ],
      isEnding: true
    },
    merlin_normal: {
      text: "Merlin rejette d'abord la magie. Mais il voit une fille dans sa classe avoir des problèmes. Il réalise qu'il pourrait utiliser sa magie pour l'aider. Il change d'avis et accepte d'apprendre la magie. Il comprend que rejeter ses talents c'est aussi rejeter sa responsabilité.",
      choices: [
        { text: "🔄 Recommencer", node: 'start6', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 7: Maya l'Aigle
    start7: {
      text: "Maya est une petite aigle orpheline. Elle a perdu sa mère et ne sait pas comment voler. Elle se cache dans un nid au sommet d'une montagne, effrayée. Un jour, une tempête arrive. Le nid commence à se détériorer. Maya doit choisir entre rester en sécurité et apprendre à voler pour survivre. Que fait Maya?",
      choices: [
        { text: "Apprendre à voler coûte que coûte", node: 'maya_vole', points: 40 },
        { text: "Demander l'aide aux autres aigles", node: 'maya_aide', points: 35 },
        { text: "Chercher un refuge plus sûr", node: 'maya_refuge', points: 25 }
      ]
    },
    maya_vole: {
      text: "Maya prend son courage à deux mains... deux ailes! Elle saute du nid. Elle tombe, tombe, puis... ses ailes se déploient! Elle vole pour la première fois! C'est difficile, elle ne contrôle pas bien ses mouvements. Mais elle vole! Elle atterrit sur une branche, exténuée mais vivante. Maya a appris que parfois on doit sauter pour découvrir qu'on peut voler.",
      choices: [
        { text: "🔄 Recommencer", node: 'start7', points: 0 }
      ],
      isEnding: true
    },
    maya_aide: {
      text: "Maya appelle pour l'aide. Les autres aigles entendent et viennent. Ils l'enseignent patiemment à voler. Ils lui montrent comment créer les courants d'air. Peu à peu, Maya devient une aigle forte et libre. Elle apprend que demander de l'aide n'est pas une faiblesse. FIN - Maya vole vers son avenir!",
      choices: [
        { text: "🔄 Recommencer", node: 'start7', points: 0 }
      ],
      isEnding: true
    },
    maya_refuge: {
      text: "Maya trouve une grotte plus protégée. Mais elle se rend compte qu'elle ne peut pas rester cachée pour toujours. Elle observe les autres aigles voler et décide d'essayer. Elle tombe plusieurs fois avant de réussir. Finalement, elle vole avec grâce à travers le ciel.",
      choices: [
        { text: "🔄 Recommencer", node: 'start7', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 8: Théo et le Château Enchanté
    start8: {
      text: "Théo explore la forêt derrière sa maison et découvre un château magnifique caché entre les arbres. Il n'était pas là hier! Il est brillant, scintille, et l'appelle. Théo s'approche lentement. Une voix douce vient d'une fenêtre: 'Bienvenue Théo. Je t'attendais.' Que fait Théo?",
      choices: [
        { text: "Entrer dans le château", node: 'theo_entrer', points: 35 },
        { text: "Demander qui l'appelle", node: 'theo_question', points: 30 },
        { text: "Retourner à la maison chercher ses parents", node: 'theo_parents', points: 25 }
      ]
    },
    theo_entrer: {
      text: "Théo entre. L'intérieur est encore plus magique que l'extérieur! Il y a des escaliers qui montent dans les nuages, des portes qui mènent à d'autres mondes, des salles remplies de merveilles. Il découvre qu'il y a une magie à l'intérieur de lui aussi. Le château l'a appelé parce que c'est le seul endroit où sa magie peut s'épanouir. FIN - Théo a trouvé sa destinée magique!",
      choices: [
        { text: "🔄 Recommencer", node: 'start8', points: 0 }
      ],
      isEnding: true
    },
    theo_question: {
      text: "La voix répond: 'Je suis l'esprit du château. Je cherche quelqu'un de bon pour prendre soin de moi. Théo, tu es celui que j'attendais.' Théo devient le gardien du château enchanté. Il y apprend la magie, l'histoire, et les secrets de la nature.",
      choices: [
        { text: "🔄 Recommencer", node: 'start8', points: 0 }
      ],
      isEnding: true
    },
    theo_parents: {
      text: "Théo court chercher ses parents. Mais quand il revient avec eux, le château a disparu! Ses parents ne le voient pas. Théo comprend que c'était une magie juste pour lui. Il peut retourner au château seul chaque fois qu'il veut. C'est son secret magique.",
      choices: [
        { text: "🔄 Recommencer", node: 'start8', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 9: Fleur et les Papillons
    start9: {
      text: "Fleur est une fille de 10 ans qui adore la nature. Elle découvre que la Forêt Enchantée de papillons arc-en-ciel disparaît! Les humains coupent les arbres, il n'y a plus de fleurs. Les papillons meurent. Fleur est la seule qui peut les sauver. Elle doit choisir comment le faire.",
      choices: [
        { text: "Convaincre sa communauté de planter des arbres", node: 'fleur_communaute', points: 40 },
        { text: "Utiliser la magie pour sauver la forêt seule", node: 'fleur_magie', points: 35 },
        { text: "Créer une réserve secrète pour les papillons", node: 'fleur_reserve', points: 30 }
      ]
    },
    fleur_communaute: {
      text: "Fleur parle à tout le monde - à l'école, à la mairie, aux enfants. Elle montre des images des papillons mourants. Elle organise des journées de plantation d'arbres. Petit à petit, les gens comprennent. Ensemble, ils replantent une nouvelle forêt magnifique. Les papillons reviennent! FIN - Fleur a sauvé la forêt avec l'aide de tous!",
      choices: [
        { text: "🔄 Recommencer", node: 'start9', points: 0 }
      ],
      isEnding: true
    },
    fleur_magie: {
      text: "Fleur découvre qu'elle a des pouvoirs magiques. Elle fait repousser les arbres, revenir les fleurs. Mais elle réalise que la magie seule ne peut pas résoudre le problème. Elle a besoin de l'aide des humains pour empêcher que ça ne se reproduise.",
      choices: [
        { text: "🔄 Recommencer", node: 'start9', points: 0 }
      ],
      isEnding: true
    },
    fleur_reserve: {
      text: "Fleur crée une réserve secrète dans la forêt. Elle cache les papillons et les fleurs. Elle les soigne. Mais elle se rend compte que ça ne suffit pas. Elle doit protéger non seulement les papillons mais leur maison aussi.",
      choices: [
        { text: "🔄 Recommencer", node: 'start9', points: 0 }
      ],
      isEnding: true
    },

    // HISTOIRE 10: Tom le Musicien
    start10: {
      text: "Tom a toujours rêvé de devenir musicien. Ses parents veulent qu'il devienne docteur ou avocat. Tom trouve une vieille guitare dans le grenier de sa grand-mère. Elle joue une mélodie toute seule! Tom entend une voix: 'Apprends-moi à jouer et tu verras ta destinée.' Tom doit choisir son chemin.",
      choices: [
        { text: "Apprendre la guitare malgré les parents", node: 'tom_musique', points: 40 },
        { text: "Chercher un compromis avec ses parents", node: 'tom_compromis', points: 35 },
        { text: "Suivre les rêves de ses parents d'abord", node: 'tom_parents', points: 25 }
      ]
    },
    tom_musique: {
      text: "Tom apprend la guitare en secret la nuit. Il y met tout son cœur et toute son âme. Quelques mois plus tard, il joue une chanson si belle que sa famille sort pour écouter. Ses parents pleurent. Ils réalisent que le rêve de Tom est au moins aussi important que leurs rêves pour lui. Ils le soutiennent.",
      choices: [
        { text: "🔄 Recommencer", node: 'start10', points: 0 }
      ],
      isEnding: true
    },
    tom_compromis: {
      text: "Tom parle à ses parents. Il leur dit: 'Je vous aime, mais je dois aussi m'aimer moi-même. La musique est une partie de moi.' Ses parents réfléchissent. Finalement, ils acceptent qu'il suive des cours de musique tout en allant à l'école. Tom devient un musicien heureux avec le soutien de sa famille.",
      choices: [
        { text: "🔄 Recommencer", node: 'start10', points: 0 }
      ],
      isEnding: true
    },
    tom_parents: {
      text: "Tom cache sa passion. Mais chaque jour, il se demande 'et si?'. Finalement, en étudiant pour devenir docteur, il joue de la guitare pour les patients. Il combine sa passion avec le travail. Il réalise qu'on peut avoir plusieurs rêves. FIN - Tom a trouvé son chemin personnel!",
      choices: [
        { text: "🔄 Recommencer", node: 'start10', points: 0 }
      ],
      isEnding: true
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const frenchVoices = allVoices.filter(v => v.lang.includes('fr'));
      setVoices(frenchVoices.length > 0 ? frenchVoices : allVoices.slice(0, 3));
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    if (!audioRef.current) {
      try {
        audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {}
    }

    return () => {
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const playSound = (freq = 440, dur = 200) => {
    if (isMuted || !audioRef.current) return;
    try {
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + dur / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + dur / 1000);
    } catch (e) {}
  };

  const speakText = (text) => {
    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      return;
    }
    playSound(523.25, 150);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[voice] || voices[0];
    utterance.rate = speechRate;
    utterance.lang = 'fr-FR';
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      playSound(659.25, 200);
    };
    synthRef.current.cancel();
    synthRef.current.speak(utterance);
  };

  const stopAudio = () => {
    synthRef.current.cancel();
    setIsPlaying(false);
    playSound(349.23, 100);
  };

  const startStory = (id) => {
    playSound(523.25, 150);
    setStoryId(id);
    setNodeId(`start${id}`);
    setScreen('game');
    const newStats = { ...stats, gamesPlayed: stats.gamesPlayed + 1 };
    setStats(newStats);
    localStorage.setItem('kidsStats', JSON.stringify(newStats));
  };

  const makeChoice = (nextNode, points) => {
    playSound(659.25, 150);
    stopAudio();
    setNodeId(nextNode);
    const newStats = {
      ...stats,
      choices: stats.choices + 1,
      points: stats.points + points,
      endings: nodes[nextNode]?.isEnding ? stats.endings + 1 : stats.endings
    };
    setStats(newStats);
    localStorage.setItem('kidsStats', JSON.stringify(newStats));
  };

  const toggleFavorite = (id) => {
    const newFav = stats.favorites.includes(id)
      ? stats.favorites.filter(f => f !== id)
      : [...stats.favorites, id];
    const newStats = { ...stats, favorites: newFav };
    setStats(newStats);
    localStorage.setItem('kidsStats', JSON.stringify(newStats));
    playSound(659.25, 150);
  };

  const goHome = () => {
    playSound(349.23, 100);
    stopAudio();
    setScreen('menu');
    setStoryId(null);
    setNodeId(null);
  };

  const bgColor = theme === 'dark'
    ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
    : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-slate-900';

  // MENU
  if (screen === 'menu') {
    return (
      <div className={`min-h-screen ${bgColor} p-4 font-sans transition-all`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-3 rounded-full ${theme === 'dark' ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-yellow-400'}`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="text-center mb-12">
            <BookOpen className={`w-20 h-20 mx-auto ${theme === 'dark' ? 'text-yellow-400' : 'text-purple-600'} mb-4`} />
            <h1 className={`text-5xl font-black mb-2 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' : 'text-purple-800'}`}>
              📚 HISTOIRES MAGIQUES 📚
            </h1>
            <p className={theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}>
              {stats.gamesPlayed} histoires • {stats.endings} finales découvertes
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-300'} p-6 rounded-2xl text-center`}>
              <p className="text-3xl font-black">{stats.gamesPlayed}</p>
              <p className="text-sm mt-2">Histoires</p>
            </div>
            <div className={`${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-300'} p-6 rounded-2xl text-center`}>
              <p className="text-3xl font-black">{stats.points}</p>
              <p className="text-sm mt-2">Points</p>
            </div>
            <div className={`${theme === 'dark' ? 'bg-pink-900' : 'bg-pink-300'} p-6 rounded-2xl text-center`}>
              <p className="text-3xl font-black">{stats.endings}</p>
              <p className="text-sm mt-2">Fins</p>
            </div>
            <div className={`${theme === 'dark' ? 'bg-orange-900' : 'bg-orange-300'} p-6 rounded-2xl text-center`}>
              <p className="text-3xl font-black">{stats.favorites.length}</p>
              <p className="text-sm mt-2">Aimées</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(stories).map(([id, story]) => (
              <div key={id} className={`bg-gradient-to-r ${story.color} p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-white mb-1">{story.title}</h2>
                    <p className="text-white text-opacity-90 mb-1">{story.desc}</p>
                    <p className="text-white text-opacity-80 text-sm">{story.difficulty}</p>
                  </div>
                  <button onClick={() => toggleFavorite(parseInt(id))} className="ml-4">
                    {stats.favorites.includes(parseInt(id)) ? 
                      <Heart className="w-8 h-8 text-red-500 fill-red-500" /> :
                      <Heart className="w-8 h-8 text-white" />
                    }
                  </button>
                </div>
                <button
                  onClick={() => startStory(parseInt(id))}
                  className="w-full bg-white text-black font-black text-lg py-3 rounded-xl mt-4 hover:bg-gray-200 transition-all"
                >
                  ▶️ COMMENCER L'HISTOIRE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // JEU
  if (screen === 'game' && nodeId && nodes[nodeId]) {
    const currentNode = nodes[nodeId];
    const story = stories[storyId];
    return (
      <div className={`min-h-screen ${bgColor} p-4 font-sans transition-all`}>
        <div className="max-w-3xl mx-auto pb-20">
          <div className="flex gap-2 mb-6 flex-wrap justify-between">
            <button
              onClick={goHome}
              className={`flex items-center gap-2 ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-400 hover:bg-red-500'} text-white font-bold px-6 py-2 rounded-full shadow-lg`}
            >
              <Home className="w-5 h-5" /> Menu
            </button>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2 rounded-full ${theme === 'dark' ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-yellow-400'}`}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className={`${theme === 'dark' ? 'bg-slate-800 border-purple-500' : 'bg-white border-purple-400'} border-2 rounded-3xl shadow-2xl p-8 mb-6`}>
            <h2 className={`text-3xl font-black text-center mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' : 'text-purple-800'}`}>
              {story.title}
            </h2>

            <div className={`bg-gradient-to-r ${story.color} rounded-2xl p-6 mb-8 shadow-lg text-white`}>
              <h3 className="text-lg font-bold mb-4">🎧 Écoute l'histoire</h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                <button
                  onClick={() => speakText(currentNode.text)}
                  className="flex items-center gap-2 bg-white text-purple-600 font-bold px-6 py-3 rounded-full hover:scale-110 transition-transform shadow-lg"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  {isPlaying ? 'Pause' : 'Écouter'}
                </button>
                <button
                  onClick={stopAudio}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-3 rounded-full transition-all shadow-lg"
                >
                  Arrêt
                </button>
                <button
                  onClick={() => {
                    playSound(440, 100);
                    setIsMuted(!isMuted);
                  }}
                  className={`font-bold px-4 py-3 rounded-full transition-all shadow-lg ${
                    isMuted ? 'bg-red-500 text-white' : 'bg-green-400 text-black'
                  }`}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Voix</label>
                  <select
                    value={voice}
                    onChange={(e) => {
                      playSound(392, 100);
                      setVoice(parseInt(e.target.value));
                    }}
                    className="w-full p-2 rounded text-slate-900 font-bold text-sm"
                  >
                    {voices.map((v, i) => (
                      <option key={i} value={i}>{v.name || `Voix ${i + 1}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Vitesse: {speechRate.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechRate}
                    onChange={(e) => {
                      setSpeechRate(parseFloat(e.target.value));
                      playSound(440 + parseFloat(e.target.value) * 100, 50);
                    }}
                    className="w-full rounded"
                  />
                </div>
              </div>
            </div>

            <div className={`${theme === 'dark' ? 'bg-slate-700 border-purple-400' : 'bg-slate-200 border-purple-300'} border-l-4 p-6 rounded-xl mb-8 shadow-lg`}>
              <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {currentNode.text}
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <p className={`text-sm font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>⭐ Tes choix:</p>
              {currentNode.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => makeChoice(choice.node, choice.points)}
                  className={`w-full ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700' : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600'} text-white font-bold py-4 rounded-xl shadow-lg transform transition-all hover:scale-105 flex items-center justify-between px-6`}
                >
                  <span>{choice.text}</span>
                  <span className="text-sm">+{choice.points}pts</span>
                </button>
              ))}
            </div>

            {currentNode.isEnding && (
              <div className={`bg-gradient-to-r from-yellow-600 to-orange-600 border-2 border-yellow-300 p-6 rounded-xl text-center shadow-lg text-white`}>
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <p className="font-black text-xl">🎉 FIN DE L'HISTOIRE!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}