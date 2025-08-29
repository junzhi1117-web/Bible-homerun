
export type HitType = '1B' | '2B' | '3B' | 'HR';
export type BattingStrategy = 'normal' | 'power';
export type GameState = 'setup' | 'playing' | 'gameover';

export interface Question {
  id: number;
  type: HitType;
  question: string;
  answer: string;
}

export type LastScoreInfo = { team: 'home' | 'away'; runs: number; key: number } | null;

export type RunnerIconType = 'default' | 'blue' | 'red' | 'yellow';

export interface TeamIcons {
  away: RunnerIconType;
  home: RunnerIconType;
}