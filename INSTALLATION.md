# 📖 Guide d'Installation Complet

## Étape 1: Prérequis

Installer Node.js depuis https://nodejs.org/

Vérifier:
```bash
node --version
npm --version
```

## Étape 2: Installation

```bash
npm install
```

(Cela prend 1-3 minutes)

## Étape 3: Lancer

```bash
npm start
```

L'app s'ouvre sur http://localhost:3000

## 🎮 Comment Jouer

1. Sélectionne une histoire
2. Clique "Écouter" pour la narration vocale
3. Fais tes choix en cliquant les boutons
4. Découvre les différentes fins!

## 💾 Sauvegarde Automatique

Les données sont sauvegardées automatiquement:
- Nombre de jeux joués
- Nombre de choix faits
- Fins découvertes
- Points accumulés
- Histoires aimées

## 🆘 Problèmes?

### "npm: command not found"
→ Installer Node.js depuis https://nodejs.org

### L'app est lente au démarrage
→ C'est normal! La première fois prend 10-30 secondes

### Les voix ne fonctionnent pas
→ Essayer Firefox ou Chrome

### Port 3000 utilisé?
```bash
npm start -- --port 3001
```

## 📝 Autres commandes

```bash
# Build pour production
npm run build

# Lancer les tests
npm test

# Arrêter l'app
Ctrl+C (dans le terminal)
```

Bon jeu! 🚀✨
