export interface LinkedListNode {
  highlighted: boolean;
  id: string;
  data: number;
  next: string | null; // ID of the next node
  type: 'head' | 'normal';
  x?: number; // Position for visualization
  y?: number;
}

export interface NodePaletteItem {
  id: string;
  type: 'head' | 'normal';
  label: string;
  description: string;
  icon: string;
}

export interface GameState {
  points: number;
  badges: Badge[];
  currentLevel: number;
  completedChallenges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  type: 'bronze' | 'silver' | 'gold';
  earned: boolean;
  earnedAt?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  targetNodes: number;
  completed: boolean;
}