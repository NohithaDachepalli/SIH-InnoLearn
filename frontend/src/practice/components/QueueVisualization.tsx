import { Card } from '../components/ui/card';
import { QueueElement } from '../types/DataStructures';

interface QueueVisualizationProps {
  elements: QueueElement[];
  readonly?: boolean;
  onElementRemove?: (elementId: string) => void;
}

export const QueueVisualization = ({ elements, readonly = false, onElementRemove }: QueueVisualizationProps) => {
  if (elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">🚶‍♂️</div>
          <p>No queue elements to display</p>
          <p className="text-sm">Execute your code to see the queue visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-sm text-muted-foreground font-mono">FRONT →</div>
          <div className="text-sm text-muted-foreground font-mono">← REAR</div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center justify-center max-w-4xl">
          {elements
            .sort((a, b) => a.position - b.position)
            .map((element, displayIndex) => (
              <div key={element.id} className="flex items-center">
                <Card 
                  className={`relative p-4 min-w-16 min-h-16 flex items-center justify-center ${element.highlighted ? 'bg-yellow-300' : 'bg-blue-400'} text-white hover:shadow-medium transition-all cursor-pointer group border-2 border-black`}
                  onClick={() => !readonly && onElementRemove?.(element.id)}
                >
                  <div className="text-center">
                    <div className="font-bold text-lg">{element.value}</div>
                    <div className="text-xs opacity-75">pos: {element.position}</div>
                  </div>
                  {!readonly && (
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-xs text-white">
                        ×
                      </div>
                    </div>
                  )}
                </Card>
                {displayIndex < elements.length - 1 && (
                  <div className="mx-2 text-muted-foreground">→</div>
                )}
              </div>
            ))}
        </div>
      </div>
      
      {elements.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Queue size: {elements.length}
        </div>
      )}
    </div>
  );
};