import { Card } from '../components/ui/card';
import { StackElement } from '../types/DataStructures';

interface StackVisualizationProps {
  elements: StackElement[];
  readonly?: boolean;
  onElementRemove?: (elementId: string) => void;
}

export const StackVisualization = ({ elements, readonly = false, onElementRemove }: StackVisualizationProps) => {
  if (elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p>No stack elements to display</p>
          <p className="text-sm">Execute your code to see the stack visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="text-sm text-muted-foreground mb-2 font-mono">← TOP</div>
        
        <div className="flex flex-col-reverse gap-1 min-h-0">
          {elements
            .sort((a, b) => a.position - b.position)
            .map((element, displayIndex) => (
               <Card 
                key={element.id}
                className={`relative p-4 w-32 h-16 flex items-center justify-center ${element.highlighted ? 'bg-yellow-300' : 'gradient-tertiary'} text-black hover:shadow-medium transition-all cursor-pointer group border-2 border-black`}
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
            ))}
        </div>
        
        <div className="text-sm text-muted-foreground mt-2 font-mono">← BOTTOM</div>
      </div>
      
      {elements.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Stack size: {elements.length}
        </div>
      )}
    </div>
  );
};