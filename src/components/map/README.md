# Map Editor - Hexagonal Map Editor

## Description

An interactive hexagonal map editor for creating and editing game levels using a hexagonal grid system. The editor provides intuitive painting tools similar to image editors.

## Features

###  Painting Tools

1. **Brush Tool** ️
   - Paint individual cells by clicking or dragging
   - Ideal for detailed, precise editing
   - Shortcut: Click on "Brush" button

2. **Bucket Tool** 
   - Fill entire connected regions with the same terrain type
   - Uses flood fill algorithm
   - Fills all adjacent cells of the same type
   - Shortcut: Click on "Bucket" button

###  Terrain Types

The editor supports 8 different terrain types:

- **Zone** (Beige) - Default terrain
- **Water** (Blue) - Water bodies
- **Mountain** (Brown) - Mountain ranges
- **Tree** (Dark Green) - Forests
- **Rock** (Gray) - Rocky areas
- **Sand** (Light Beige) - Beaches/deserts
- **Grass** (Green) - Grasslands
- **Purple** - Special marker terrain

### ️ Map Display

- **Hexagonal Grid** - True hexagonal layout with proper neighbors
- **Grid Toggle** - Show/hide grid lines and coordinates
- **Cell Selection** - Visual feedback on hover and selection
- **Color Coding** - Each terrain type has a distinct color

###  Statistics Panel

Real-time statistics showing:
- Count of each terrain type
- Selected cell information (position, content, scale)

## Usage

### Navigation

1. From the main menu, select **"Editeur de Carte"**
2. The map editor will open with a pre-generated hexagonal map

### Editing Workflow

1. **Select a Tool**
   - Click "Brush" for painting individual cells
   - Click "Bucket" for filling regions

2. **Select a Terrain Type**
   - Click on any terrain button in the palette
   - The selected terrain is highlighted

3. **Paint the Map**
   - **Brush Mode**: Click or click-and-drag to paint cells
   - **Bucket Mode**: Click on a cell to fill all connected cells of the same type

4. **View Statistics**
   - Check the statistics panel to see terrain distribution
   - Click on a cell to see its details

### Keyboard Shortcuts

- Click and drag: Paint multiple cells (Brush mode only)
- Click: Fill region (Bucket mode only)

## Technical Details

### Components

#### `HexagonMap.tsx`
- SVG-based hexagonal grid renderer
- Handles mouse interactions (click, drag, hover)
- Calculates hexagonal coordinates and positioning
- Provides visual feedback for selection and hover states

#### `MapEditorPage.tsx`
- Main editor page with full UI
- Tool selection and terrain palette
- Statistics and options panel
- Integrates with routing system

#### `floodFill.ts`
- Generic flood fill algorithm for hexagonal grids
- Uses breadth-first search for efficient filling
- Works with any `HexagonalTableau<T>` structure

### Data Structure

The map uses `HexagonalTableau<KaseLandscape>`:

```typescript
class KaseLandscape extends Kase2D {
  content?: string  // Terrain type
  scale: number     // Visual scale (for future 3D rendering)
  x: number         // Grid X coordinate
  y: number         // Grid Y coordinate
}
```

### Hexagonal Grid System

The editor uses a **flat-topped hexagonal grid** with axial coordinates:

- Each hexagon has 6 neighbors
- Coordinates: `(x, y)` where y offset depends on x
- Pixel conversion: `hexToPixel(x, y, size)`

### Color Palette

Colors are defined in `CONTENT_COLORS` object and can be customized:

```typescript
const CONTENT_COLORS: Record<string, string> = {
  zone: '#e8d5b7',
  water: '#4a90e2',
  mountain: '#8b7355',
  tree: '#2d5016',
  rock: '#6b6b6b',
  sand: '#f4e4c1',
  grass: '#7cb342',
  purple: '#9c27b0',
}
```

## Future Enhancements

Potential features to add:

- [ ] Save/Load map to file
- [ ] Undo/Redo functionality
- [ ] Custom terrain types
- [ ] Resize map dimensions
- [ ] Export to 3D scene
- [ ] Layer support (terrain, objects, decoration)
- [ ] Eyedropper tool (pick terrain from map)
- [ ] Selection tools (rectangle, circle)
- [ ] Procedural generation tools

## Integration

The map editor is integrated into the main application:

1. **Route**: `/map-editor`
2. **Menu Item**: "Editeur de Carte"
3. **Navigation**: Uses React Router for seamless transitions

To access programmatically:

```typescript
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/map-editor')
```

## Performance

- SVG-based rendering for crisp visuals at any zoom level
- Efficient flood fill algorithm with visited set
- Memoized calculations for hexagon rendering
- Minimal re-renders with React optimization hooks
