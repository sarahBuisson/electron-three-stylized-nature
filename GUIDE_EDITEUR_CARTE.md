# Guide d'Utilisation - Éditeur de Carte Hexagonale

## Accès à l'Éditeur

1. Lancez l'application
2. Dans le menu principal, sélectionnez **"Editeur de Carte"**
3. L'éditeur s'ouvre avec une carte hexagonale pré-générée

## Interface Utilisateur

### Panneau Latéral Gauche

#### ️ Tools (Outils)
- **️ Brush** : Peindre case par case (cliquez ou glissez)
- ** Bucket** : Remplir une zone (remplissage par propagation)

####  Terrain Types (Types de Terrain)
8 types de terrain disponibles :
- **Zone** (beige clair) - Terrain par défaut
- **Water** (bleu) - Eau
- **Mountain** (marron) - Montagne
- **Tree** (vert foncé) - Forêt
- **Rock** (gris) - Rocher
- **Sand** (beige) - Sable
- **Grass** (vert) - Herbe
- **Purple** (violet) - Marqueur spécial

#### ⚙️ Options
- **Show Grid** : Afficher/masquer la grille et les coordonnées

####  Statistics
- Compteur en temps réel de chaque type de terrain
- Total de cases par type

#### ℹ️ Selected Cell
- Position (x, y) de la case sélectionnée
- Type de contenu
- Échelle (scale)

### Zone Centrale - Canvas

- **Affichage** : Grille hexagonale avec couleurs distinctes par terrain
- **Navigation** : Scrollez pour voir toute la carte
- **Interaction** : Cliquez ou glissez selon l'outil actif

## Workflow de Peinture

### Mode Pinceau (Brush) ️

1. Cliquez sur le bouton **Brush**
2. Sélectionnez un type de terrain dans la palette
3. **Cliquez** sur une case pour la peindre
4. **Maintenez et glissez** pour peindre plusieurs cases d'affilée

**Idéal pour :** Détails précis, corrections, créations artistiques

### Mode Seau (Bucket) 

1. Cliquez sur le bouton **Bucket**
2. Sélectionnez un type de terrain dans la palette
3. **Cliquez** sur une case pour remplir toute la zone connectée du même type

**Idéal pour :** Remplir de grandes zones rapidement, changer de biomes entiers

## Exemples d'Utilisation

### Créer un Lac

1. **Outil** : Bucket 
2. **Terrain** : Water (bleu)
3. **Action** : Cliquez au centre de la zone désirée
4. Toutes les cases "zone" connectées deviennent de l'eau

### Dessiner une Forêt

1. **Outil** : Brush ️
2. **Terrain** : Tree (vert foncé)
3. **Action** : Cliquez-glissez pour dessiner la forme de la forêt

### Créer une Chaîne de Montagnes

1. **Outil** : Brush ️
2. **Terrain** : Mountain (marron)
3. **Action** : Dessinez une ligne ou une forme de chaîne montagneuse

### Remplacer un Biome Entier

1. **Outil** : Bucket 
2. **Terrain** : Grass (vert)
3. **Action** : Cliquez sur la zone à transformer

## Raccourcis et Astuces

### Navigation
- **Scroll vertical/horizontal** : Déplacer la vue
- **Hover** : Aperçu blanc translucide sur la case survolée
- **Clic** : Sélectionne la case (info dans le panneau)

### Peinture Efficace
- **Brush + Drag** : Peindre rapidement plusieurs cases
- **Bucket** : Remplir de grandes zones en un clic
- **Alternez les outils** : Bucket pour les grandes zones, Brush pour les détails

### Visualisation
- **Désactivez la grille** : Vue plus propre pour apprécier le design
- **Statistics** : Vérifier l'équilibre des types de terrain

## Architecture Hexagonale

### Système de Coordonnées

La carte utilise un **système hexagonal axial** :
- Chaque hexagone a **6 voisins**
- Coordonnées : `(x, y)`
- Les hexagones sont à sommet plat (flat-topped)

### Voisinage

Un hexagone à la position `(x, y)` a pour voisins :
- `(x-1, y)` : Gauche
- `(x+1, y)` : Droite
- `(x-1, y+1)` : Bas-gauche
- `(x, y+1)` : Bas-droite
- `(x, y-1)` : Haut-droite
- `(x+1, y-1)` : Haut-gauche

### Algorithme de Remplissage

Le **Bucket Tool** utilise un algorithme de **flood fill** :
1. Commence à la case cliquée
2. Vérifie le type de contenu original
3. Propage aux 6 voisins ayant le même type
4. Continue récursivement jusqu'à épuisement

## Cas d'Usage

### Level Design
- Créer des niveaux de jeu avec différents biomes
- Définir des zones d'objectifs (purple markers)
- Équilibrer la difficulté avec des obstacles (mountains, water)

### Génération de Monde
- Prototype de cartes procédurales
- Test de répartition de terrains
- Visualisation de systèmes de biomes

### Art/Design
- Création de motifs hexagonaux
- Expérimentation de palettes de couleurs
- Design de patterns géométriques

## Intégration Future

La carte créée utilise `HexagonalTableau<KaseLandscape>` qui peut être :
- **Exportée en JSON** (futur feature)
- **Chargée en 3D** dans une scène Three.js
- **Utilisée pour la génération de niveaux**
- **Convertie en mesh 3D** avec hauteurs basées sur `scale`

## Troubleshooting

### La carte ne s'affiche pas
- Vérifiez que le tableau est correctement initialisé
- Rechargez la page

### Le Bucket ne remplit pas
- Assurez-vous que les cases sont bien connectées (même type)
- Vérifier que vous ne remplissez pas avec la même couleur

### Performance lente
- Réduisez la taille du tableau
- Désactivez la grille pour de grandes cartes

## Retour au Menu

Cliquez sur **← Back to Menu** en haut à gauche pour retourner au menu principal.

---

**Note** : L'éditeur fonctionne entièrement en mémoire. Les modifications ne sont pas sauvegardées automatiquement. Une fonctionnalité de sauvegarde/chargement sera ajoutée dans une future version.
