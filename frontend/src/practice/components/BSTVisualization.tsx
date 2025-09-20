import { Card } from '../components/ui/card';
import { BSTNode } from '../types/DataStructures';
import { useMemo } from 'react';

interface BSTVisualizationProps {
  nodes: BSTNode[];
  readonly?: boolean;
  onNodeRemove?: (nodeId: string) => void;
}

export const BSTVisualization = ({ nodes, readonly = false, onNodeRemove }: BSTVisualizationProps) => {
  // Calculate positions for tree layout
  const positionedNodes = useMemo(() => {
    if (nodes.length === 0) return [];
    
    const root = nodes.find(n => n.isRoot) || nodes[0];
    const positioned: (BSTNode & { x: number; y: number; level: number })[] = [];
    
    const calculatePositions = (node: BSTNode, x: number, y: number, level: number, spacing: number) => {
      positioned.push({ ...node, x, y, level });
      
      const leftChild = nodes.find(n => n.id === node.left);
      const rightChild = nodes.find(n => n.id === node.right);
      
      if (leftChild) {
        calculatePositions(leftChild, x - spacing, y + 80, level + 1, spacing / 2);
      }
      
      if (rightChild) {
        calculatePositions(rightChild, x + spacing, y + 80, level + 1, spacing / 2);
      }
    };
    
    calculatePositions(root, 300, 50, 0, 120);
    return positioned;
  }, [nodes]);

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">🌳</div>
          <p>No BST nodes to display</p>
          <p className="text-sm">Execute your code to see the BST visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="relative" style={{ minHeight: '400px', minWidth: '600px' }}>
        {/* Draw connections first */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {positionedNodes.map(node => {
            const leftChild = positionedNodes.find(n => n.id === node.left);
            const rightChild = positionedNodes.find(n => n.id === node.right);
            
            return (
              <g key={`connections-${node.id}`}>
                {leftChild && (
                  <line
                    x1={node.x + 32}
                    y1={node.y + 32}
                    x2={leftChild.x + 32}
                    y2={leftChild.y + 32}
                    stroke="black"
                    strokeWidth="2"
                  />
                )}
                {rightChild && (
                  <line
                    x1={node.x + 32}
                    y1={node.y + 32}
                    x2={rightChild.x + 32}
                    y2={rightChild.y + 32}
                    stroke="black"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Draw nodes */}
        {positionedNodes.map(node => (
          <Card
            key={node.id}
            className={`absolute w-16 h-16 flex items-center justify-center transition-all cursor-pointer group border-2 border-black ${
              node.highlighted 
                ? 'bg-yellow-300 text-black shadow-glow' 
                : node.isRoot 
                  ? 'bg-blue-400 text-black shadow-glow' 
                  : 'bg-green-400 text-black hover:shadow-medium'
            }`}
            style={{ 
              left: node.x, 
              top: node.y,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => !readonly && onNodeRemove?.(node.id)}
          >
            <div className="text-center">
              <div className="font-bold text-lg">{node.value}</div>
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
      
      {nodes.length > 0 && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          BST nodes: {nodes.length}
        </div>
      )}
    </div>
  );
};