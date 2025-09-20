import { Card } from '../components/ui/card';
import { ArrayElement } from '../types/DataStructures';

interface ArrayVisualizationProps {
  elements: ArrayElement[];
  readonly?: boolean;
  onElementRemove?: (elementId: string) => void;
}

export const ArrayVisualization = ({ elements, readonly = false, onElementRemove }: ArrayVisualizationProps) => {
  if (elements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p>No array elements to display</p>
          <p className="text-sm">Execute your code to see the array visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {elements
          .sort((a, b) => a.index - b.index)
          .map((element, displayIndex) => (
            <div key={element.id} className="flex flex-col items-center gap-2">
              <Card 
                className={`border-black relative p-4 min-w-16 min-h-16 flex items-center justify-center ${element.highlighted ? 'gradient-primary' : 'gradient-secondary'} text-black hover:shadow-medium transition-all cursor-pointer group`}
                onClick={() => !readonly && onElementRemove?.(element.id)}
              >
                <div className="text-center">
                  <div className="font-bold text-lg">{element.value}</div>
                </div>
                {!readonly && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-xs text-black">
                      ×
                    </div>
                  </div>
                )}
              </Card>
              <div className="text-xs text-muted-foreground font-mono">
                [{element.index}]
              </div>
            </div>
          ))}
      </div>
      
      {elements.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Array size: {elements.length}
        </div>
      )}
    </div>
  );
};