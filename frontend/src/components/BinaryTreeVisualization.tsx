import React, { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import { Operation } from './VisualizationPage';

interface TreeNode {
  id: number;
  value: number | null;
  left?: TreeNode;
  right?: TreeNode;
  isEditing?: boolean;
  x?: number;
  y?: number;
}

interface BinaryTreeVisualizationProps {
  onOperation: (operation: Operation, data: any) => void;
}

const BinaryTreeVisualization: React.FC<BinaryTreeVisualizationProps> = ({ onOperation }) => {
  const [root, setRoot] = useState<TreeNode | null>({
    id: 1,
    value: 50,
    left: {
      id: 2,
      value: 30,
      left: { id: 4, value: 20 },
      right: { id: 5, value: 40 }
    },
    right: {
      id: 3,
      value: 70,
      left: { id: 6, value: 60 },
      right: { id: 7, value: 80 }
    }
  });
  const [searchValue, setSearchValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [traversalNodes, setTraversalNodes] = useState<{id: number, value: number}[]>([]);
  const [traversalIndex, setTraversalIndex] = useState<number>(-1);
  // Traversal algorithms (return array of {id, value})
  const getInorder = (node: TreeNode | null, result: {id: number, value: number}[] = []): {id: number, value: number}[] => {
    if (!node) return result;
    getInorder(node.left || null, result);
    if (node.value !== null) result.push({ id: node.id, value: node.value });
    getInorder(node.right || null, result);
    return result;
  };

  const getPreorder = (node: TreeNode | null, result: {id: number, value: number}[] = []): {id: number, value: number}[] => {
    if (!node) return result;
    if (node.value !== null) result.push({ id: node.id, value: node.value });
    getPreorder(node.left || null, result);
    getPreorder(node.right || null, result);
    return result;
  };

  const getPostorder = (node: TreeNode | null, result: {id: number, value: number}[] = []): {id: number, value: number}[] => {
    if (!node) return result;
    getPostorder(node.left || null, result);
    getPostorder(node.right || null, result);
    if (node.value !== null) result.push({ id: node.id, value: node.value });
    return result;
  };

  // Animate traversal
  const animateTraversal = (nodes: {id: number, value: number}[]) => {
    setTraversalNodes(nodes);
    setTraversalIndex(0);
    if (nodes.length === 0) return;
    setHighlightedNode(nodes[0].id);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < nodes.length) {
        setTraversalIndex(i);
        setHighlightedNode(nodes[i].id);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setHighlightedNode(null);
          setTraversalIndex(-1);
        }, 800);
      }
    }, 800);
  };
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const calculatePositions = (node: TreeNode | null, x: number, y: number, spacing: number): TreeNode | null => {
    if (!node) return null;
    
    const newNode = { ...node, x, y };
    
    if (node.left) {
      const leftPos = calculatePositions(node.left, x - spacing, y + 80, spacing / 2);
      newNode.left = leftPos === null ? undefined : leftPos;
    }
    if (node.right) {
      const rightPos = calculatePositions(node.right, x + spacing, y + 80, spacing / 2);
      newNode.right = rightPos === null ? undefined : rightPos;
    }
    
    return newNode;
  };

  const positionedRoot = root ? calculatePositions(root, 400, 50, 120) : null;

  const insertNode = (parentId: number, side: 'left' | 'right') => {
    // Find parent node value
    let parentValue: number | null = null;
    const findParent = (node: TreeNode | null): void => {
      if (!node) return;
      if (node.id === parentId) {
        parentValue = node.value;
        return;
      }
      findParent(node.left || null);
      findParent(node.right || null);
    };
    findParent(root);

    // Store BST constraints for editing
    let minValue: number | null = null;
    let maxValue: number | null = null;
    if (parentValue !== null) {
      if (side === 'left') {
        maxValue = parentValue - 1;
      } else {
        minValue = parentValue + 1;
      }
    }

    const newNode: TreeNode = { id: Date.now(), value: null, isEditing: true, x: undefined, y: undefined };
    // Attach constraints for editing
    (newNode as any).minValue = minValue;
    (newNode as any).maxValue = maxValue;

    const insertInTree = (node: TreeNode | null): TreeNode | null => {
      if (!node) return null;
      if (node.id === parentId) {
        const updatedNode = { ...node };
        if (side === 'left') {
          updatedNode.left = newNode;
        } else {
          updatedNode.right = newNode;
        }
        return updatedNode;
      }
      return {
        ...node,
        left: node.left ? insertInTree(node.left) ?? undefined : undefined,
        right: node.right ? insertInTree(node.right) ?? undefined : undefined
      };
    };
    setRoot(insertInTree(root));
    setEditingValue('');
    onOperation('insert-middle', { value: null, parentId, side, pending: true, minValue, maxValue });
  };

  const confirmNodeValue = (nodeId: number) => {
    const value = parseInt(editingValue);
    if (isNaN(value)) return;

    // Find node and constraints
    let minValue: number | null = null;
    let maxValue: number | null = null;
    const findNodeAndConstraints = (node: TreeNode | null): void => {
      if (!node) return;
      if (node.id === nodeId) {
        minValue = (node as any).minValue ?? null;
        maxValue = (node as any).maxValue ?? null;
        return;
      }
      findNodeAndConstraints(node.left || null);
      findNodeAndConstraints(node.right || null);
    };
    findNodeAndConstraints(root);

    // Enforce BST constraints
    if ((minValue !== null && value < minValue) || (maxValue !== null && value > maxValue)) {
      alert(`Value must be ${minValue !== null ? '≥ ' + minValue : ''}${minValue !== null && maxValue !== null ? ' and ' : ''}${maxValue !== null ? '≤ ' + maxValue : ''}`);
      return;
    }

    const updateNodeValue = (node: TreeNode | null): TreeNode | null => {
      if (!node) return null;
      if (node.id === nodeId) {
        // Remove constraints after editing
        const { minValue, maxValue, ...rest } = node as any;
        return { ...rest, value, isEditing: false };
      }
      return {
        ...node,
        left: node.left ? updateNodeValue(node.left) ?? undefined : undefined,
        right: node.right ? updateNodeValue(node.right) ?? undefined : undefined
      };
    };
    setRoot(updateNodeValue(root));
    onOperation('insert-middle', { value, nodeId });
    setEditingValue('');
  };

  const cancelNodeEdit = (nodeId: number) => {
    const removeNode = (node: TreeNode | null): TreeNode | null => {
      if (!node) return null;
      
      if (node.left?.id === nodeId) {
        return { ...node, left: undefined };
      }
      if (node.right?.id === nodeId) {
        return { ...node, right: undefined };
      }
      
      return {
        ...node,
        left: node.left ? removeNode(node.left) ?? undefined : undefined,
        right: node.right ? removeNode(node.right) ?? undefined : undefined
      };
    };

    setRoot(removeNode(root));
    setEditingValue('');
  };

  const deleteNode = (nodeId: number) => {
    const findAndDelete = (node: TreeNode | null, targetId: number): TreeNode | null => {
      if (!node) return null;
      
      if (node.id === targetId) {
        if (!node.left && !node.right) return null;
        if (!node.left) return node.right || null;
        if (!node.right) return node.left || null;
        
        // Find inorder successor
        let successor = node.right;
        while (successor?.left) {
          successor = successor.left;
        }
        
        return {
          ...node,
          value: successor?.value || null,
          right: node.right ? findAndDelete(node.right, successor?.id || 0) ?? undefined : undefined
        };
      }
      
      return {
        ...node,
        left: node.left ? findAndDelete(node.left, targetId) ?? undefined : undefined,
        right: node.right ? findAndDelete(node.right, targetId) ?? undefined : undefined
      };
    };

    setRoot(findAndDelete(root, nodeId));
    onOperation('delete-middle', { nodeId });
  };

  const searchNode = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;
    
    const findNode = (node: TreeNode | null): TreeNode | null => {
      if (!node) return null;
      if (node.value === value) return node;
      
      const leftResult = findNode(node.left || null);
      if (leftResult) return leftResult;
      
      return findNode(node.right || null);
    };

    const foundNode = findNode(positionedRoot);
    if (foundNode) {
      setHighlightedNode(foundNode.id);
      setTimeout(() => setHighlightedNode(null), 3000);
    }
    
    onOperation('search', { value, found: !!foundNode });
  };

  const renderNode = (node: TreeNode): JSX.Element => {
    // Determine if node is selected
    const isSelected = selectedNode === node.id;
    // Odd color for selected node (magenta)
  const oddColor = 'rgb(215,38,96)';
    // Upscale radius if selected
    const nodeRadius = isSelected ? 28 : highlightedNode === node.id ? 24 : 20;
    return (
      <g key={node.id}>
        {/* Connections */}
        {node.left && (
          <line
            x1={node.x}
            y1={node.y! + nodeRadius - 5}
            x2={node.left.x}
            y2={node.left.y! - (nodeRadius - 5)}
            stroke="rgb(100,116,139)"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y! + nodeRadius - 5}
            x2={node.right.x}
            y2={node.right.y! - (nodeRadius - 5)}
            stroke="rgb(100,116,139)"
            strokeWidth="2"
          />
        )}
        {/* Node */}
        <g>
          <circle
            cx={node.x}
            cy={node.y}
            r={nodeRadius}
            fill={
              isSelected
                ? oddColor
                : highlightedNode === node.id
                ? 'rgb(255,255,0)'
                : node.isEditing
                ? 'rgb(241,245,249)'
                : 'rgb(209,250,229)'
            }
            stroke={
              isSelected
                ? 'rgb(108,33,136)'
                : highlightedNode === node.id
                ? 'rgb(16,185,129)'
                : node.isEditing
                ? 'rgb(148,163,184)'
                : 'rgb(16,185,129)'
            }
            strokeWidth={isSelected ? 4 : 2}
            className="cursor-pointer hover:stroke-emerald-600"
            onClick={() => setSelectedNode(node.id)}
            style={{ transition: 'all 0.2s cubic-bezier(.4,2,.3,1)' }}
          />
          {node.isEditing ? (
            <foreignObject x={node.x! - 25} y={node.y! - 25} width="50" height="50">
              <div className="flex flex-col items-center justify-center h-full" >
                <input
                  type="number"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  className="w-8 h-6 text-center border border-slate-300 rounded text-xs"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') confirmNodeValue(node.id);
                  }}
                />
                <div className="flex space-x-1 mt-1">
                  <button
                    onClick={() => confirmNodeValue(node.id)}
                    className="p-0.5 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <Check className="w-2 h-2" />
                  </button>
                  <button
                    onClick={() => cancelNodeEdit(node.id)}
                    className="p-0.5 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              </div>
            </foreignObject>
          ) : (
            <text
              x={node.x}
              y={node.y! + 5}
              textAnchor="middle"
              className="text-sm font-bold fill-slate-800"
              style={{ pointerEvents: 'none' }}
            >
              {node.value}
            </text>
          )}
          {/* Add buttons */}
          {!node.isEditing && (
            <g className="opacity-0 hover:opacity-100 transition-opacity">
              {!node.left && (
                <g>
                  <circle
                    cx={node.x! - 30}
                    cy={node.y! + 30}
                    r="8"
                    fill="rgba(9,213,200,1)"
                    className="cursor-pointer hover:fill-emerald-600"
                    onClick={() => insertNode(node.id, 'left')}
                  />
                  <text
                    x={node.x! - 30}
                    y={node.y! + 34}
                    textAnchor="middle"
                    className="text-xs fill-white cursor-pointer"
                    onClick={() => insertNode(node.id, 'left')}
                  >
                    +
                  </text>
                </g>
              )}
              {!node.right && (
                <g>
                  <circle
                    cx={node.x! + 30}
                    cy={node.y! + 30}
                    r="8"
                    fill="rgb(16,185,129)"
                    className="cursor-pointer hover:fill-emerald-600"
                    onClick={() => insertNode(node.id, 'right')}
                  />
                  <text
                    x={node.x! + 30}
                    y={node.y! + 34}
                    textAnchor="middle"
                    className="text-xs fill-white cursor-pointer"
                    onClick={() => insertNode(node.id, 'right')}
                  >
                    +
                  </text>
                </g>
              )}
              {/* Delete button */}
              <g>
                <circle
                  cx={node.x! + 25}
                  cy={node.y! - 25}
                  r="8"
                  fill="rgb(239,68,68)"
                  className="cursor-pointer hover:fill-red-600"
                  onClick={() => deleteNode(node.id)}
                />
                <text
                  x={node.x! + 25}
                  y={node.y! - 21}
                  textAnchor="middle"
                  className="text-xs fill-white cursor-pointer"
                  onClick={() => deleteNode(node.id)}
                >
                  ×
                </text>
              </g>
            </g>
          )}
        </g>
        {/* Render children */}
        {node.left && renderNode(node.left)}
        {node.right && renderNode(node.right)}
      </g>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search value"
            className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-32"
          />
          <button
            onClick={searchNode}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { onOperation('inorder', { root }); animateTraversal(getInorder(root)); }}
            className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
          >
            Inorder Traversal
          </button>
          <button
            onClick={() => { onOperation('preorder', { root }); animateTraversal(getPreorder(root)); }}
            className="px-3 py-1 bg-teal-500 text-white rounded hover:bg-teal-600 text-sm"
          >
            Preorder Traversal
          </button>
          <button
            onClick={() => { onOperation('postorder', { root }); animateTraversal(getPostorder(root)); }}
            className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm"
          >
            Postorder Traversal
          </button>
        </div>
        <div className="text-sm text-slate-600">
          Click + buttons to add nodes, × to delete
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="flex-1 overflow-auto">
        <svg width="800" height="500" className="w-full h-full">
          {positionedRoot && renderNode(positionedRoot)}
        </svg>
        {/* Traversal order display */}
        {traversalNodes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {traversalNodes.map((node, idx) => (
              <span
                key={node.id}
                className={`px-3 py-1 rounded font-bold text-white ${idx === traversalIndex ? 'bg-yellow-500' : 'bg-slate-500'}`}
              >
                {node.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BinaryTreeVisualization; 