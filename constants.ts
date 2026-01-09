
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
  },
  {
    id: 6,
    balls: [
      { x: 150, y: 120, color: '#3498db' },
      { x: 650, y: 120, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 250, y: 360, w: 220, h: 20, angle: 0.3 },
      { x: 550, y: 360, w: 220, h: 20, angle: -0.3 },
      { x: 400, y: 460, w: 120, h: 20 }
    ],
    hint: "Let the ramps guide them inward."
  },
  {
    id: 7,
    balls: [
      { x: 120, y: 460, color: '#3498db' },
      { x: 680, y: 160, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 300, w: 40, h: 400 },
      { x: 180, y: 260, w: 160, h: 20 },
      { x: 620, y: 260, w: 160, h: 20 }
    ],
    hint: "Bridge the center wall."
  },
  {
    id: 8,
    balls: [
      { x: 120, y: 120, color: '#3498db' },
      { x: 680, y: 480, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 260, y: 420, w: 180, h: 20 },
      { x: 540, y: 300, w: 180, h: 20, angle: -0.2 },
      { x: 400, y: 220, w: 140, h: 20, angle: 0.2 }
    ],
    hint: "Think in steps."
  },
  {
    id: 9,
    balls: [
      { x: 200, y: 520, color: '#3498db' },
      { x: 600, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 120, w: 800, h: 20 },
      { x: 400, y: 360, w: 60, h: 320 }
    ],
    hint: "Use the ceiling as a guide."
  },
  {
    id: 10,
    balls: [
      { x: 180, y: 220, color: '#3498db' },
      { x: 620, y: 220, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 400, w: 200, h: 20 },
      { x: 260, y: 300, w: 140, h: 20, angle: 0.4 },
      { x: 540, y: 300, w: 140, h: 20, angle: -0.4 }
    ],
    hint: "A gentle funnel works."
  },
  {
    id: 11,
    balls: [
      { x: 120, y: 500, color: '#3498db' },
      { x: 680, y: 100, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 150, y: 300, w: 200, h: 20, angle: 0.2 },
      { x: 650, y: 320, w: 200, h: 20, angle: -0.2 },
      { x: 400, y: 250, w: 60, h: 140 }
    ],
    hint: "Stagger the ramps."
  },
  {
    id: 12,
    balls: [
      { x: 400, y: 120, color: '#3498db' },
      { x: 400, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 220, y: 320, w: 140, h: 20 },
      { x: 580, y: 320, w: 140, h: 20 },
      { x: 400, y: 320, w: 60, h: 200 }
    ],
    hint: "Break the vertical drop."
  },
  {
    id: 13,
    balls: [
      { x: 150, y: 160, color: '#3498db' },
      { x: 650, y: 440, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 300, y: 260, w: 200, h: 20, angle: 0.2 },
      { x: 500, y: 380, w: 200, h: 20, angle: -0.2 },
      { x: 400, y: 300, w: 80, h: 160 }
    ],
    hint: "Use staggered platforms."
  },
  {
    id: 14,
    balls: [
      { x: 200, y: 480, color: '#3498db' },
      { x: 600, y: 160, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 260, w: 220, h: 20 },
      { x: 250, y: 420, w: 140, h: 20, angle: -0.3 },
      { x: 550, y: 420, w: 140, h: 20, angle: 0.3 }
    ],
    hint: "Balance both sides."
  },
  {
    id: 15,
    balls: [
      { x: 100, y: 260, color: '#3498db' },
      { x: 700, y: 260, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 320, w: 300, h: 20 },
      { x: 400, y: 180, w: 300, h: 20 }
    ],
    hint: "A simple tunnel works."
  },
  {
    id: 16,
    balls: [
      { x: 180, y: 120, color: '#3498db' },
      { x: 620, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 240, y: 380, w: 180, h: 20, angle: 0.4 },
      { x: 560, y: 260, w: 180, h: 20, angle: -0.4 }
    ],
    hint: "Cross the paths."
  },
  {
    id: 17,
    balls: [
      { x: 400, y: 140, color: '#3498db' },
      { x: 400, y: 460, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 200, y: 300, w: 160, h: 20, angle: 0.2 },
      { x: 600, y: 300, w: 160, h: 20, angle: -0.2 }
    ],
    hint: "Angle the landing pads."
  },
  {
    id: 18,
    balls: [
      { x: 160, y: 520, color: '#3498db' },
      { x: 640, y: 120, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 420, w: 260, h: 20 },
      { x: 400, y: 240, w: 120, h: 20, angle: 0.4 }
    ],
    hint: "Build a mid-air catch."
  },
  {
    id: 19,
    balls: [
      { x: 120, y: 180, color: '#3498db' },
      { x: 680, y: 180, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 320, w: 120, h: 240 },
      { x: 260, y: 420, w: 140, h: 20 },
      { x: 540, y: 420, w: 140, h: 20 }
    ],
    hint: "Split, then reconnect."
  },
  {
    id: 20,
    balls: [
      { x: 200, y: 140, color: '#3498db' },
      { x: 600, y: 140, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 340, w: 220, h: 20, angle: 0.15 },
      { x: 400, y: 260, w: 220, h: 20, angle: -0.15 },
      { x: 400, y: 460, w: 120, h: 20 }
    ],
    hint: "Finish with a gentle pinch."
  },
  {
    id: 21,
    balls: [
      { x: 140, y: 120, color: '#3498db' },
      { x: 660, y: 120, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 260, y: 360, w: 180, h: 20, angle: 0.35 },
      { x: 540, y: 360, w: 180, h: 20, angle: -0.35 }
    ],
    hint: "Mirror the ramps."
  },
  {
    id: 22,
    balls: [
      { x: 180, y: 480, color: '#3498db' },
      { x: 620, y: 180, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 260, w: 240, h: 20 },
      { x: 400, y: 420, w: 120, h: 20, angle: -0.2 }
    ],
    hint: "Catch the fall."
  },
  {
    id: 23,
    balls: [
      { x: 100, y: 260, color: '#3498db' },
      { x: 700, y: 360, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 300, w: 80, h: 260 },
      { x: 240, y: 200, w: 160, h: 20 },
      { x: 560, y: 440, w: 160, h: 20 }
    ],
    hint: "Thread the center post."
  },
  {
    id: 24,
    balls: [
      { x: 160, y: 140, color: '#3498db' },
      { x: 640, y: 500, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 280, y: 340, w: 200, h: 20, angle: 0.25 },
      { x: 520, y: 260, w: 200, h: 20, angle: -0.25 },
      { x: 400, y: 420, w: 120, h: 20 }
    ],
    hint: "Stagger the platforms."
  },
  {
    id: 25,
    balls: [
      { x: 120, y: 520, color: '#3498db' },
      { x: 680, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 140, w: 800, h: 20 },
      { x: 400, y: 360, w: 120, h: 220 }
    ],
    hint: "Use the ceiling drop."
  },
  {
    id: 26,
    balls: [
      { x: 220, y: 200, color: '#3498db' },
      { x: 580, y: 200, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 420, w: 260, h: 20 },
      { x: 260, y: 320, w: 140, h: 20, angle: 0.4 },
      { x: 540, y: 320, w: 140, h: 20, angle: -0.4 }
    ],
    hint: "Form a funnel."
  },
  {
    id: 27,
    balls: [
      { x: 140, y: 420, color: '#3498db' },
      { x: 660, y: 140, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 300, w: 60, h: 260 },
      { x: 200, y: 240, w: 160, h: 20 },
      { x: 600, y: 360, w: 160, h: 20 }
    ],
    hint: "Swing around the spine."
  },
  {
    id: 28,
    balls: [
      { x: 200, y: 120, color: '#3498db' },
      { x: 600, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 300, y: 300, w: 200, h: 20, angle: -0.2 },
      { x: 500, y: 420, w: 200, h: 20, angle: 0.2 }
    ],
    hint: "Cross the diagonals."
  },
  {
    id: 29,
    balls: [
      { x: 120, y: 180, color: '#3498db' },
      { x: 680, y: 180, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 320, w: 180, h: 20 },
      { x: 400, y: 240, w: 180, h: 20 },
      { x: 400, y: 400, w: 80, h: 140 }
    ],
    hint: "Break up the drop."
  },
  {
    id: 30,
    balls: [
      { x: 180, y: 520, color: '#3498db' },
      { x: 620, y: 120, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 260, y: 360, w: 180, h: 20, angle: 0.2 },
      { x: 540, y: 260, w: 180, h: 20, angle: -0.2 },
      { x: 400, y: 460, w: 120, h: 20 }
    ],
    hint: "Aim for the center pad."
  },
  {
    id: 31,
    balls: [
      { x: 400, y: 120, color: '#3498db' },
      { x: 400, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 220, y: 320, w: 140, h: 20 },
      { x: 580, y: 320, w: 140, h: 20 },
      { x: 400, y: 320, w: 80, h: 200 }
    ],
    hint: "Split the fall."
  },
  {
    id: 32,
    balls: [
      { x: 120, y: 420, color: '#3498db' },
      { x: 680, y: 420, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 240, w: 120, h: 160 },
      { x: 200, y: 320, w: 160, h: 20 },
      { x: 600, y: 320, w: 160, h: 20 }
    ],
    hint: "Navigate the center pillar."
  },
  {
    id: 33,
    balls: [
      { x: 200, y: 160, color: '#3498db' },
      { x: 600, y: 160, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 360, w: 220, h: 20, angle: 0.25 },
      { x: 400, y: 260, w: 220, h: 20, angle: -0.25 }
    ],
    hint: "A small funnel helps."
  },
  {
    id: 34,
    balls: [
      { x: 140, y: 520, color: '#3498db' },
      { x: 660, y: 220, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 240, y: 340, w: 180, h: 20, angle: -0.35 },
      { x: 560, y: 340, w: 180, h: 20, angle: 0.35 }
    ],
    hint: "Use opposing ramps."
  },
  {
    id: 35,
    balls: [
      { x: 200, y: 120, color: '#3498db' },
      { x: 600, y: 500, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 320, y: 320, w: 200, h: 20 },
      { x: 480, y: 420, w: 200, h: 20, angle: 0.25 }
    ],
    hint: "Catch and release."
  },
  {
    id: 36,
    balls: [
      { x: 120, y: 300, color: '#3498db' },
      { x: 680, y: 300, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 360, w: 300, h: 20 },
      { x: 400, y: 240, w: 300, h: 20 }
    ],
    hint: "Guide them through the tunnel."
  },
  {
    id: 37,
    balls: [
      { x: 140, y: 160, color: '#3498db' },
      { x: 660, y: 420, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 260, y: 260, w: 180, h: 20, angle: 0.3 },
      { x: 540, y: 380, w: 180, h: 20, angle: -0.3 },
      { x: 400, y: 320, w: 60, h: 140 }
    ],
    hint: "Use the staggered ledges."
  },
  {
    id: 38,
    balls: [
      { x: 220, y: 520, color: '#3498db' },
      { x: 580, y: 120, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 260, w: 200, h: 20 },
      { x: 400, y: 420, w: 200, h: 20, angle: -0.2 }
    ],
    hint: "Bounce off the shelf."
  },
  {
    id: 39,
    balls: [
      { x: 120, y: 120, color: '#3498db' },
      { x: 680, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 300, y: 320, w: 200, h: 20, angle: -0.2 },
      { x: 500, y: 400, w: 200, h: 20, angle: 0.2 }
    ],
    hint: "Cross over diagonally."
  },
  {
    id: 40,
    balls: [
      { x: 180, y: 200, color: '#3498db' },
      { x: 620, y: 200, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 340, w: 160, h: 20 },
      { x: 400, y: 260, w: 160, h: 20 },
      { x: 400, y: 420, w: 80, h: 120 }
    ],
    hint: "Guide them inward."
  },
  {
    id: 41,
    balls: [
      { x: 160, y: 480, color: '#3498db' },
      { x: 640, y: 140, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 240, y: 360, w: 160, h: 20, angle: 0.3 },
      { x: 560, y: 280, w: 160, h: 20, angle: -0.3 },
      { x: 400, y: 460, w: 120, h: 20 }
    ],
    hint: "Set up a meeting ledge."
  },
  {
    id: 42,
    balls: [
      { x: 220, y: 140, color: '#3498db' },
      { x: 580, y: 500, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 320, y: 260, w: 200, h: 20, angle: 0.2 },
      { x: 480, y: 360, w: 200, h: 20, angle: -0.2 },
      { x: 400, y: 420, w: 80, h: 160 }
    ],
    hint: "Use the offset ramps."
  },
  {
    id: 43,
    balls: [
      { x: 120, y: 260, color: '#3498db' },
      { x: 680, y: 260, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 260, w: 80, h: 280 },
      { x: 260, y: 380, w: 160, h: 20 },
      { x: 540, y: 380, w: 160, h: 20 }
    ],
    hint: "Split and reunite."
  },
  {
    id: 44,
    balls: [
      { x: 180, y: 520, color: '#3498db' },
      { x: 620, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 160, w: 800, h: 20 },
      { x: 400, y: 360, w: 100, h: 260 }
    ],
    hint: "Use the top shelf."
  },
  {
    id: 45,
    balls: [
      { x: 120, y: 120, color: '#3498db' },
      { x: 680, y: 420, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 260, y: 280, w: 180, h: 20, angle: 0.35 },
      { x: 540, y: 360, w: 180, h: 20, angle: -0.35 }
    ],
    hint: "Lead with angled shelves."
  },
  {
    id: 46,
    balls: [
      { x: 200, y: 480, color: '#3498db' },
      { x: 600, y: 180, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 300, w: 200, h: 20 },
      { x: 400, y: 420, w: 140, h: 20, angle: 0.2 }
    ],
    hint: "Stabilize the landing."
  },
  {
    id: 47,
    balls: [
      { x: 160, y: 140, color: '#3498db' },
      { x: 640, y: 520, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 300, y: 340, w: 200, h: 20, angle: -0.25 },
      { x: 500, y: 260, w: 200, h: 20, angle: 0.25 },
      { x: 400, y: 440, w: 120, h: 20 }
    ],
    hint: "Pinch the path."
  },
  {
    id: 48,
    balls: [
      { x: 140, y: 300, color: '#3498db' },
      { x: 660, y: 300, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 260, w: 300, h: 20 },
      { x: 400, y: 420, w: 300, h: 20 }
    ],
    hint: "Stay between the rails."
  },
  {
    id: 49,
    balls: [
      { x: 200, y: 160, color: '#3498db' },
      { x: 600, y: 440, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 280, y: 260, w: 200, h: 20, angle: 0.2 },
      { x: 520, y: 380, w: 200, h: 20, angle: -0.2 },
      { x: 400, y: 320, w: 80, h: 160 }
    ],
    hint: "Meet near the center."
  },
  {
    id: 50,
    balls: [
      { x: 160, y: 520, color: '#3498db' },
      { x: 640, y: 120, color: '#e74c3c' }
    ],
    obstacles: [
      { x: 400, y: 580, w: 800, h: 40 },
      { x: 400, y: 260, w: 220, h: 20, angle: 0.2 },
      { x: 400, y: 360, w: 220, h: 20, angle: -0.2 },
      { x: 400, y: 460, w: 120, h: 20 }
    ],
    hint: "Finish the marathon!"
  }
];
