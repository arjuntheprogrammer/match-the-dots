
import { Level, Pen } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const PENS: Pen[] = [
  { id: 'pencil-black', name: 'Pencil', color: '#333333', width: 3, unlockedAt: 0, icon: '✏️' },
  { id: 'crayon-red', name: 'Crayon Red', color: '#ff4d4d', width: 8, unlockedAt: 1, icon: '🖍️' },
  { id: 'crayon-blue', name: 'Crayon Blue', color: '#4d79ff', width: 8, unlockedAt: 2, icon: '🖍️' },
  { id: 'marker-green', name: 'Marker Green', color: '#2ecc71', width: 5, unlockedAt: 3, icon: '🖋️' },
  { id: 'marker-yellow', name: 'Marker Yellow', color: '#f1c40f', width: 5, unlockedAt: 5, icon: '🖋️' },
  { id: 'heavy-purple', name: 'Heavy Purple', color: '#9b59b6', width: 12, unlockedAt: 8, icon: '🖌️' },
  // ... can be expanded to 25+
];

export const LEVELS: Level[] = [
  {
    id: 1,
    balls: [
      { x: 200, y: 300, color: '#3498db' }, // Blue
      { x: 600, y: 300, color: '#e74c3c' }  // Red
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 } // Ground
    ],
    hint: "Draw a curve under the balls!"
  },
  {
    id: 2,
    balls: [
      { x: 100, y: 100, color: '#3498db' },
      { x: 700, y: 100, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 400, w: 200, h: 40, angle: 0.1 } // Middle ramp
    ],
    hint: "Use the middle platform."
  },
  {
    id: 3,
    balls: [
      { x: 150, y: 400, color: '#3498db' },
      { x: 650, y: 400, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 300, w: 40, h: 400 } // Central wall
    ],
    hint: "Draw a bridge over the wall."
  },
  {
    id: 4,
    balls: [
      { x: 100, y: 500, color: '#3498db' },
      { x: 700, y: 500, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 100, y: 550, w: 150, h: 20 },
      { x: 700, y: 550, w: 150, h: 20 },
      { x: 400, y: 580, w: 800, h: 40 }
    ],
    hint: "Connect the gaps."
  },
  {
    id: 5,
    balls: [
      { x: 200, y: 100, color: '#3498db' },
      { x: 600, y: 500, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 200, y: 250, w: 100, h: 20, angle: -0.5 },
      { x: 600, y: 350, w: 100, h: 20, angle: 0.5 }
    ],
    hint: "Timing is everything."
  }
];
