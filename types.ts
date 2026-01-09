
export interface Level {
  id: number;
  balls: { x: number; y: number; color: string }[];
  obstacles: { x: number; y: number; w: number; h: number; angle?: number; type?: 'rect' | 'circle' }[];
  hint?: string;
}

export interface Pen {
  id: string;
  name: string;
  color: string;
  width: number;
  unlockedAt: number;
  icon: string;
}
