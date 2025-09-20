export interface ArrayElement {
  id: string;
  value: number;
  index: number;
  highlighted?: boolean;
}

export interface StackElement {
  id: string;
  value: number;
  position: number; // 0 is top of stack
  highlighted?: boolean;
}

export interface QueueElement {
  id: string;
  value: number;
  position: number; // 0 is front of queue
  highlighted?: boolean;
}

export interface BSTNode {
  id: string;
  value: number;
  left: string | null; // ID of left child
  right: string | null; // ID of right child
  parent: string | null; // ID of parent node
  isRoot?: boolean;
  x?: number; // Position for visualization
  y?: number;
  highlighted?: boolean;
}

export type DataStructureType = 'linkedlist' | 'array' | 'stack' | 'queue' | 'bst';

export interface VisualizationData {
  type: DataStructureType;
  linkedList?: import('./LinkedList').LinkedListNode[];
  array?: ArrayElement[];
  stack?: StackElement[];
  queue?: QueueElement[];
  bst?: BSTNode[];
  highlightedElements?: string[];
  operationResult?: string;
}