# Comment Ajouter Export/Import à MapEditorPage

## 1. Importer les fonctions

```typescript
import { 
  downloadMap, 
  copyMapToClipboard,
  loadMapFromFile,
  getMapStatistics 
} from '@utils/mapSerializer';
```

## 2. Ajouter un Input File (invisible)

```typescript
const fileInputRef = useRef<HTMLInputElement>(null);

// Dans le JSX, avant le return:
<input
  ref={fileInputRef}
  type="file"
  accept=".json"
  style={{ display: 'none' }}
  onChange={handleFileLoad}
/>
```

## 3. Ajouter les Handlers

```typescript
// Export JSON
const handleExport = () => {
  downloadMap(tableau, 'my-map.json', {
    name: 'My Custom Map',
    author: 'Your Name',
    description: 'Created with Hex Map Editor'
  });
};

// Copy to Clipboard
const handleCopy = async () => {
  try {
    await copyMapToClipboard(tableau);
    alert('Map copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};

// Import JSON
const handleImport = () => {
  fileInputRef.current?.click();
};

const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const mapData = await loadMapFromFile(file);
    
    // TODO: Reconstruire le tableau à partir de mapData
    // Créer un nouveau HexagonalTableau avec les données
    // const newKases: KaseLandscape[][] = ...
    // setTableau(new HexagonalTableau(newKases));
    
    alert(`Map loaded: ${mapData.metadata?.name || 'Unnamed'}`);
  } catch (error) {
    console.error('Failed to load map:', error);
    alert('Failed to load map file');
  }
};
```

## 4. Ajouter les Boutons UI

```typescript
<section className="editor-section">
  <h2>File</h2>
  <div className="file-buttons">
    <button onClick={handleExport} className="file-button">
      💾 Export JSON
    </button>
    <button onClick={handleImport} className="file-button">
      📂 Import JSON
    </button>
    <button onClick={handleCopy} className="file-button">
      📋 Copy to Clipboard
    </button>
  </div>
</section>
```

## 5. Ajouter les Styles CSS

```css
.file-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-button {
  padding: 0.75rem 1rem;
  background: #3a3a3a;
  color: #fff;
  border: 1px solid #555;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  text-align: left;
  transition: all 0.2s;
}

.file-button:hover {
  background: #444;
  border-color: #6aa9f0;
}

.file-button:active {
  transform: scale(0.98);
}
```

## 6. Fonction de Reconstruction du Tableau

```typescript
function reconstructTableau(mapData: SerializedMap): HexagonalTableau<KaseLandscape> {
  // Créer une structure de tableau vide
  const kases: KaseLandscape[][] = [];
  
  // Initialiser avec des cases vides
  for (let x = 0; x < mapData.width; x++) {
    kases[x] = [];
    for (let y = 0; y < mapData.height; y++) {
      const kase = new KaseLandscape(x, y);
      kase.content = 'zone';
      kase.scale = 1;
      kases[x][y] = kase;
    }
  }
  
  // Remplir avec les données importées
  mapData.cells.forEach((cellData) => {
    if (kases[cellData.x] && kases[cellData.x][cellData.y]) {
      kases[cellData.x][cellData.y].content = cellData.content;
      kases[cellData.x][cellData.y].scale = cellData.scale;
    }
  });
  
  return new HexagonalTableau(kases);
}
```

## 7. Utilisation Complète

```typescript
const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const mapData = await loadMapFromFile(file);
    const newTableau = reconstructTableau(mapData);
    
    // Mettre à jour le state
    setTableau(newTableau);
    setSelectedKase(null);
    forceUpdate();
    
    const stats = getMapStatistics(newTableau);
    console.log('Map loaded:', mapData.metadata?.name);
    console.log('Statistics:', stats);
    
    alert(`Map loaded successfully!\nTotal cells: ${stats.totalCells}`);
  } catch (error) {
    console.error('Failed to load map:', error);
    alert('Failed to load map file');
  }
};
```

## Exemple de Fichier JSON Exporté

```json
{
  "width": 20,
  "height": 20,
  "cells": [
    { "x": 0, "y": 0, "content": "zone", "scale": 1 },
    { "x": 0, "y": 1, "content": "water", "scale": 1.5 },
    { "x": 1, "y": 0, "content": "mountain", "scale": 2.3 }
  ],
  "metadata": {
    "name": "My Custom Map",
    "author": "Your Name",
    "created": "2026-06-22T10:30:00.000Z",
    "description": "Created with Hex Map Editor"
  }
}
```

## Features Avancées

### Undo/Redo

```typescript
const [history, setHistory] = useState<SerializedMap[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);

const saveToHistory = () => {
  const snapshot = serializeMap(tableau);
  const newHistory = history.slice(0, historyIndex + 1);
  setHistory([...newHistory, snapshot]);
  setHistoryIndex(historyIndex + 1);
};

const undo = () => {
  if (historyIndex > 0) {
    const previousState = history[historyIndex - 1];
    setTableau(reconstructTableau(previousState));
    setHistoryIndex(historyIndex - 1);
    forceUpdate();
  }
};

const redo = () => {
  if (historyIndex < history.length - 1) {
    const nextState = history[historyIndex + 1];
    setTableau(reconstructTableau(nextState));
    setHistoryIndex(historyIndex + 1);
    forceUpdate();
  }
};
```

### Auto-Save

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    const snapshot = serializeMap(tableau, { name: 'Auto-save' });
    localStorage.setItem('hexmap-autosave', JSON.stringify(snapshot));
    console.log('Auto-saved');
  }, 30000); // Every 30 seconds

  return () => clearInterval(interval);
}, [tableau]);

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('hexmap-autosave');
  if (saved) {
    try {
      const mapData = parseMapJSON(saved);
      const restored = reconstructTableau(mapData);
      setTableau(restored);
      console.log('Restored from auto-save');
    } catch (error) {
      console.error('Failed to restore auto-save');
    }
  }
}, []);
```

