import type { Meta, StoryObj } from '@storybook/react';
import { HexagonMap } from './HexagonMap';
import { HexagonalTableau, Kase2D } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';

class SimpleKaseLandscape extends Kase2D implements KaseLandscape {
  content?: string;
  scale: number = 1;

  constructor(x: number, y: number, content?: string) {
    super(x, y);
    this.content = content || 'zone';
  }
}

// Fonction helper pour créer un petit tableau de test
function createTestTableau(size: number = 5): HexagonalTableau<KaseLandscape> {
  const kases: KaseLandscape[][] = [];
  
  for (let x = 0; x < size; x++) {
    kases[x] = [];
    for (let y = 0; y < size; y++) {
      kases[x][y] = new SimpleKaseLandscape(x, y, 'zone');
    }
  }

  const tableau = new HexagonalTableau(kases);
  
  // Ajouter quelques terrains variés
  if (size >= 3) {
    tableau.getKase(1, 1)!.content = 'water';
    tableau.getKase(2, 2)!.content = 'mountain';
    tableau.getKase(3, 1)!.content = 'tree';
  }
  
  return tableau;
}

// Fonction pour créer un grand tableau
function createLargeTableau(): HexagonalTableau<KaseLandscape> {
  const kases: KaseLandscape[][] = [];
  
  for (let x = -5; x < 5; x++) {
    kases[x + 5] = [];
    for (let y = -5; y < 5; y++) {
      const content = ['zone', 'water', 'mountain', 'tree', 'rock', 'sand', 'grass'][
        Math.floor(Math.random() * 7)
      ];
      kases[x + 5][y + 5] = new SimpleKaseLandscape(x, y, content);
    }
  }

  return new HexagonalTableau(kases);
}

const meta = {
  title: 'Map/HexagonMap',
  component: HexagonMap,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HexagonMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallMap: Story = {
  args: {
    tableau: createTestTableau(5),
    hexSize: 40,
    showGrid: true,
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px', background: '#1a1a1a' }}>
      <HexagonMap {...args} />
    </div>
  ),
};

export const MediumMap: Story = {
  args: {
    tableau: createTestTableau(10),
    hexSize: 30,
    showGrid: true,
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px', background: '#1a1a1a' }}>
      <HexagonMap {...args} />
    </div>
  ),
};

export const LargeRandomMap: Story = {
  args: {
    tableau: createLargeTableau(),
    hexSize: 25,
    showGrid: true,
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px', background: '#1a1a1a' }}>
      <HexagonMap {...args} />
    </div>
  ),
};

export const NoGrid: Story = {
  args: {
    tableau: createTestTableau(8),
    hexSize: 35,
    showGrid: false,
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px', background: '#1a1a1a' }}>
      <HexagonMap {...args} />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    tableau: createTestTableau(6),
    hexSize: 40,
    showGrid: true,
    onKaseClick: (kase) => console.log('Clicked:', kase),
    onKasePaint: (kase) => console.log('Painted:', kase),
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px', background: '#1a1a1a' }}>
      <HexagonMap {...args} />
    </div>
  ),
};

export const SmallHexagons: Story = {
  args: {
    tableau: createLargeTableau(),
    hexSize: 15,
    showGrid: true,
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px', background: '#1a1a1a' }}>
      <HexagonMap {...args} />
    </div>
  ),
};

export const LargeHexagons: Story = {
  args: {
    tableau: createTestTableau(4),
    hexSize: 60,
    showGrid: true,
  },
  render: (args) => (
    <div style={{ width: '100%', height: '600px', background: '#1a1a1a' }}>
      <HexagonMap {...args} />
    </div>
  ),
};
