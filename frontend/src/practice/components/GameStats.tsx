import { Badge, Star, Trophy, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';

interface GameStatsProps {
  points: number;
  mode: 'learning' | 'practice';
}

export const GameStats = ({ points, mode }: GameStatsProps) => {
  const getLevel = (points: number) => Math.floor(points / 100) + 1;
  const getProgressToNextLevel = (points: number) => (points % 100) / 100 * 100;

  const badges = [
    { name: 'First Steps', icon: Star, earned: points >= 10, type: 'bronze' as const },
    { name: 'Code Master', icon: Trophy, earned: points >= 100, type: 'silver' as const },
    { name: 'Linked List Pro', icon: Badge, earned: points >= 500, type: 'gold' as const },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Points Display */}
      <Card className="px-4 py-2 gradient-card shadow-soft">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-points" />
          <div>
            <div className="text-sm font-medium text-card-foreground">Points</div>
            <div className="text-lg font-bold text-points">{points}</div>
          </div>
        </div>
      </Card>

      {/* Level Display */}
      <Card className="px-4 py-2 gradient-card shadow-soft">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <div>
            <div className="text-sm font-medium text-card-foreground">Level</div>
            <div className="text-lg font-bold text-primary">{getLevel(points)}</div>
          </div>
        </div>
      </Card>

      {/* Progress Bar */}
      <Card className="px-4 py-2 gradient-card shadow-soft min-w-[200px]">
        <div className="text-sm font-medium text-card-foreground mb-1">Progress to Next Level</div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressToNextLevel(points)}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {Math.round(getProgressToNextLevel(points))}% complete
        </div>
      </Card>

      {/* Badges */}
      <div className="flex items-center gap-2">
        {badges.map((badge) => {
          const IconComponent = badge.icon;
          return (
            <div
              key={badge.name}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full transition-all
                ${badge.earned 
                  ? `bg-badge-${badge.type} text-white shadow-glow` 
                  : 'bg-muted text-muted-foreground'
                }
              `}
              title={badge.earned ? `Earned: ${badge.name}` : `Locked: ${badge.name}`}
            >
              <IconComponent className="w-4 h-4" />
            </div>
          );
        })}
      </div>

      {/* Mode Indicator */}
      <Card className="px-3 py-1 gradient-card shadow-soft">
        <div className="text-xs font-medium text-card-foreground uppercase tracking-wide">
          {mode} Mode
        </div>
      </Card>
    </div>
  );
};