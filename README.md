# Richtig oder Falsch: Migros Produkte

Pack complet pour un petit jeu web (interface en allemand) prêt pour GitHub Pages.

## Contenu
- `index.html` — page principale
- `style.css` — styles (fond blanc, texte noir)
- `script.js` — logique, timer, sauvegarde dans localStorage
- `assets/music/bg.mp3` — placeholder (remplace par un MP3 libre de droits)

## Fonctionnalités
- 3 niveaux (Einfach, Mittlere, Schwierig)
- Temps par question: 15s / 10s / 5s
- Timer change de couleur (>10s vert, 6-10s orange, <=5s rouge)
- Réponses uniquement Richtig / Falsch (pour les questions ambigües, les deux réponses comptent)
- Sauvegarde automatique pour reprendre avec "Spielen"
- Affichage du score final avec couleur (>=50% vert, <50% rouge)
- Prêt pour GitHub Pages

## Installation & mise en ligne
1. Crée un nouveau dépôt GitHub.
2. Dépose tous les fichiers (racine) et le dossier `assets` dans le dépôt.
3. Dans GitHub → Settings → Pages, sélectionne la branche `main` et le dossier `/ (root)` puis Active.
4. Ton jeu sera disponible en `https://<ton-username>.github.io/<nom-du-repo>/`

## Personnalisation
- Remplace `assets/music/bg.mp3` par un fichier MP3 libre de droits.
- Tu peux modifier les questions dans `script.js`.

---
J'ai inclus un fichier placeholder dans `assets/music/` — remplace-le par un vrai MP3.
