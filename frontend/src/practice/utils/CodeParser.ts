import { LinkedListNode } from '../types/LinkedList';
import { ArrayElement, StackElement, QueueElement, BSTNode, DataStructureType, VisualizationData } from '../types/DataStructures';

export class CodeParser {
  // 🔹 New method: remove comments before parsing
  private preprocessCode(code: string): string {
    // Remove block comments (/* ... */)
    code = code.replace(/\/\[\s\S]?\*\//g, "");
    // Remove single-line comments (//...)
    code = code.replace(/\/\/.*$/gm, "");
    return code;
  }
  parseLinkedListCode(code: string): { nodes: LinkedListNode[]; operations: any } {
    const nodes: LinkedListNode[] = [];
    const operations: any = {};

    const cleanedCode = this.preprocessCode(code);
    const lines = cleanedCode.split('\n').map(line => line.trim());
    
    // Simple regex patterns for basic linked list operations
    const nodeCreationPattern = /struct\s+Node\*\s+(\w+)\s*=.*malloc/;
    const dataAssignmentPattern = /(\w+)->data\s*=\s*(\d+)/;
    const nextAssignmentPattern = /(\w+)->next\s*=\s*(\w+|NULL)/;
    const searchPattern = /search\s*\(\s*(\d+)\s*\)/;
    const deletePattern = /delete\s*\(\s*(\d+)\s*\)/;
    
    const nodeMap = new Map<string, Partial<LinkedListNode>>();
    
    // First pass: Find all node creations and data assignments
    for (const line of lines) {
      // Check for search operations
      const searchMatch = line.match(searchPattern);
      if (searchMatch) {
        operations.searchValue = parseInt(searchMatch[1]);
      }
      
      // Check for delete operations  
      const deleteMatch = line.match(deletePattern);
      if (deleteMatch) {
        operations.deleteValue = parseInt(deleteMatch[1]);
      }
      
      // Check for node creation
      const creationMatch = line.match(nodeCreationPattern);
      if (creationMatch) {
        const nodeName = creationMatch[1];
        nodeMap.set(nodeName, {
          id: this.generateId(),
          type: nodeName === 'head' ? 'head' : 'normal',
          next: null
        });
      }
      
      // Check for data assignment
      const dataMatch = line.match(dataAssignmentPattern);
      if (dataMatch) {
        const nodeName = dataMatch[1];
        const dataValue = parseInt(dataMatch[2]);
        
        if (nodeMap.has(nodeName)) {
          const node = nodeMap.get(nodeName)!;
          node.data = dataValue;
        }
      }
    }
    
    // Second pass: Handle next pointer assignments
    for (const line of lines) {
      const nextMatch = line.match(nextAssignmentPattern);
      if (nextMatch) {
        const fromNode = nextMatch[1];
        const toNode = nextMatch[2];
        
        if (nodeMap.has(fromNode)) {
          const fromNodeData = nodeMap.get(fromNode)!;
          if (toNode === 'NULL') {
            fromNodeData.next = null;
          } else if (nodeMap.has(toNode)) {
            const toNodeData = nodeMap.get(toNode)!;
            fromNodeData.next = toNodeData.id!;
          }
        }
      }
    }
    
    // Convert map to array and validate
    for (const [name, nodeData] of nodeMap) {
      if (nodeData.data !== undefined && nodeData.id) {
        const node: LinkedListNode = {
          id: nodeData.id,
          data: nodeData.data,
          next: nodeData.next || null,
          type: nodeData.type || 'normal',
          highlighted: false
        };
        
        // Apply search highlighting
        if (operations.searchValue && nodeData.data === operations.searchValue) {
          operations.highlightedElements = operations.highlightedElements || [];
          operations.highlightedElements.push(node.id);
        }
        
        nodes.push(node);
      }
    }
    
    // Handle delete operation
    if (operations.deleteValue) {
      const deleteIndex = nodes.findIndex(n => n.data === operations.deleteValue);
      if (deleteIndex >= 0) {
        const deletedNode = nodes[deleteIndex];
        nodes.splice(deleteIndex, 1);
        
        // Fix pointers after deletion
        const prevNode = nodes.find(n => n.next === deletedNode.id);
        if (prevNode) {
          prevNode.next = deletedNode.next;
        }
      }
    }
    
    // Sort nodes to put head first
    nodes.sort((a, b) => {
      if (a.type === 'head' && b.type !== 'head') return -1;
      if (a.type !== 'head' && b.type === 'head') return 1;
      return 0;
    });
    
    return { nodes, operations };
  }
  
  parseArrayCode(code: string): { elements: ArrayElement[]; operations: any } {
    const elements: ArrayElement[] = [];
    const operations: any = {};

    const cleanedCode = this.preprocessCode(code);
    const lines = cleanedCode.split('\n').map(line => line.trim());
    
    // Patterns for array operations
    const arrayDeclarationPattern = /int\s+(\w+)\[(\d+)\]/;
    const arrayAssignmentPattern = /(\w+)\[(\d+)\]\s*=\s*(\d+)/;
    const arrayInitPattern = /int\s+(\w+)\[\]\s*=\s*\{([^}]+)\}/;
    const searchPattern = /search\s*\(\s*(\d+)\s*\)/;
    
    let arrayName = '';
    let arraySize = 0;
    
    for (const line of lines) {
      // Check for search operations
      const searchMatch = line.match(searchPattern);
      if (searchMatch) {
        operations.searchValue = parseInt(searchMatch[1]);
      }
      
      // Check for array declaration
      const declMatch = line.match(arrayDeclarationPattern);
      if (declMatch) {
        arrayName = declMatch[1];
        arraySize = parseInt(declMatch[2]);
      }
      
      // Check for array initialization
      const initMatch = line.match(arrayInitPattern);
      if (initMatch) {
        arrayName = initMatch[1];
        const values = initMatch[2].split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        values.forEach((value, index) => {
          const element: ArrayElement = {
            id: this.generateId(),
            value,
            index,
            highlighted: operations.searchValue === value
          };
          elements.push(element);
          
          if (element.highlighted) {
            operations.highlightedElements = operations.highlightedElements || [];
            operations.highlightedElements.push(element.id);
          }
        });
      }
      
      // Check for individual assignments
      const assignMatch = line.match(arrayAssignmentPattern);
      if (assignMatch && assignMatch[1] === arrayName) {
        const index = parseInt(assignMatch[2]);
        const value = parseInt(assignMatch[3]);
        
        // Remove existing element at this index if any
        const existingIndex = elements.findIndex(e => e.index === index);
        if (existingIndex >= 0) {
          elements.splice(existingIndex, 1);
        }
        
        const element: ArrayElement = {
          id: this.generateId(),
          value,
          index,
          highlighted: operations.searchValue === value
        };
        elements.push(element);
        
        if (element.highlighted) {
          operations.highlightedElements = operations.highlightedElements || [];
          operations.highlightedElements.push(element.id);
        }
      }
    }
    
    return { elements: elements.sort((a, b) => a.index - b.index), operations };
  }
  
  parseStackCode(code: string): { elements: StackElement[]; operations: any } {
    const elements: StackElement[] = [];
    const operations: any = {};

    const cleanedCode = this.preprocessCode(code);
    const lines = cleanedCode.split('\n').map(line => line.trim());
    
    // Patterns for stack operations
    const pushPattern = /push\s*\(\s*(\d+)\s*\)/;
    const popPattern = /pop\s*\(\s*\)/;
    const peekPattern = /peek\s*\(\s*\)/;
    const stackArrayPattern = /int\s+stack\[\]\s*=\s*\{([^}]+)\}/;
    
    let position = 0;
    
    for (const line of lines) {
      // Check for pop operations
      const popMatch = line.match(popPattern);
      if (popMatch) {
        operations.popOperation = true;
      }
      
      // Check for peek operations
      const peekMatch = line.match(peekPattern);
      if (peekMatch) {
        operations.peekOperation = true;
      }
      
      // Check for push operations
      const pushMatch = line.match(pushPattern);
      if (pushMatch) {
        const value = parseInt(pushMatch[1]);
        elements.push({
          id: this.generateId(),
          value,
          position
        });
        position++;
      }
      
      // Check for stack initialization
      const stackMatch = line.match(stackArrayPattern);
      if (stackMatch) {
        const values = stackMatch[1].split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        values.forEach((value) => {
          elements.push({
            id: this.generateId(),
            value,
            position
          });
          position++;
        });
      }
    }
    
    // Handle pop operation
    if (operations.popOperation && elements.length > 0) {
      elements.pop(); // Remove top element
    }
    
    // Handle peek operation (highlight top element)
    if (operations.peekOperation && elements.length > 0) {
      const topElement = elements[elements.length - 1];
      topElement.highlighted = true;
      operations.highlightedElements = [topElement.id];
      operations.operationResult = `Peek result: ${topElement.value}`;
    }
    
    return { elements, operations };
  }
  
  parseQueueCode(code: string): { elements: QueueElement[]; operations: any } {
    const elements: QueueElement[] = [];
    const operations: any = {};

    const cleanedCode = this.preprocessCode(code);
    const lines = cleanedCode.split('\n').map(line => line.trim());
    
    // Patterns for queue operations
    const enqueuePattern = /enqueue\s*\(\s*(\d+)\s*\)/;
    const dequeuePattern = /dequeue\s*\(\s*\)/;
    const peekPattern = /peek\s*\(\s*\)/;
    const queueArrayPattern = /int\s+queue\[\]\s*=\s*\{([^}]+)\}/;
    
    let position = 0;
    
    for (const line of lines) {
      // Check for dequeue operations
      const dequeueMatch = line.match(dequeuePattern);
      if (dequeueMatch) {
        operations.dequeueOperation = true;
      }
      
      // Check for peek operations
      const peekMatch = line.match(peekPattern);
      if (peekMatch) {
        operations.peekOperation = true;
      }
      
      // Check for enqueue operations
      const enqueueMatch = line.match(enqueuePattern);
      if (enqueueMatch) {
        const value = parseInt(enqueueMatch[1]);
        elements.push({
          id: this.generateId(),
          value,
          position
        });
        position++;
      }
      
      // Check for queue initialization
      const queueMatch = line.match(queueArrayPattern);
      if (queueMatch) {
        const values = queueMatch[1].split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
        values.forEach((value) => {
          elements.push({
            id: this.generateId(),
            value,
            position
          });
          position++;
        });
      }
    }
    
    // Handle dequeue operation
    if (operations.dequeueOperation && elements.length > 0) {
      elements.shift(); // Remove front element
      // Reindex remaining elements
      elements.forEach((el, index) => {
        el.position = index;
      });
    }
    
    // Handle peek operation (highlight front element)
    if (operations.peekOperation && elements.length > 0) {
      const frontElement = elements[0];
      frontElement.highlighted = true;
      operations.highlightedElements = [frontElement.id];
      operations.operationResult = `Peek result: ${frontElement.value}`;
    }
    
    return { elements, operations };
  }
  
  parseBSTCode(code: string): { nodes: BSTNode[]; operations: any } {
    const nodes: BSTNode[] = [];
    const operations: any = {};

    const cleanedCode = this.preprocessCode(code);
    const lines = cleanedCode.split('\n').map(line => line.trim());
    
    // Patterns for BST operations
    const nodeCreationPattern = /struct\s+TreeNode\*\s+(\w+)\s*=.*malloc/;
    const dataAssignmentPattern = /(\w+)->data\s*=\s*(\d+)/;
    const leftAssignmentPattern = /(\w+)->left\s*=\s*(\w+|NULL)/;
    const rightAssignmentPattern = /(\w+)->right\s*=\s*(\w+|NULL)/;
    const insertPattern = /insert\s*\(\s*(\d+)\s*\)/;
    const searchPattern = /search\s*\(\s*(\d+)\s*\)/;
    const deletePattern = /delete\s*\(\s*(\d+)\s*\)/;
    
    const nodeMap = new Map<string, Partial<BSTNode>>();
    const insertedValues: number[] = [];
    
    // First pass: Find all node creations and data assignments
    for (const line of lines) {
      // Check for search operations
      const searchMatch = line.match(searchPattern);
      if (searchMatch) {
        operations.searchValue = parseInt(searchMatch[1]);
      }
      
      // Check for delete operations
      const deleteMatch = line.match(deletePattern);
      if (deleteMatch) {
        operations.deleteValue = parseInt(deleteMatch[1]);
      }
      
      // Check for node creation
      const creationMatch = line.match(nodeCreationPattern);
      if (creationMatch) {
        const nodeName = creationMatch[1];
        nodeMap.set(nodeName, {
          id: this.generateId(),
          isRoot: nodeName === 'root',
          left: null,
          right: null,
          parent: null
        });
      }
      
      // Check for data assignment
      const dataMatch = line.match(dataAssignmentPattern);
      if (dataMatch) {
        const nodeName = dataMatch[1];
        const dataValue = parseInt(dataMatch[2]);
        
        if (nodeMap.has(nodeName)) {
          const node = nodeMap.get(nodeName)!;
          node.value = dataValue;
        }
      }
      
      // Check for insert operations (simplified BST)
      const insertMatch = line.match(insertPattern);
      if (insertMatch) {
        const value = parseInt(insertMatch[1]);
        insertedValues.push(value);
      }
    }
    
    // Handle insert operations by creating a simple BST
    if (insertedValues.length > 0) {
      const root: BSTNode = {
        id: this.generateId(),
        value: insertedValues[0],
        left: null,
        right: null,
        parent: null,
        isRoot: true
      };
      nodes.push(root);
      
      for (let i = 1; i < insertedValues.length; i++) {
        this.insertIntoBST(nodes, insertedValues[i]);
      }
    } else {
      // Second pass: Handle left/right pointer assignments
      for (const line of lines) {
        const leftMatch = line.match(leftAssignmentPattern);
        if (leftMatch) {
          const fromNode = leftMatch[1];
          const toNode = leftMatch[2];
          
          if (nodeMap.has(fromNode)) {
            const fromNodeData = nodeMap.get(fromNode)!;
            if (toNode === 'NULL') {
              fromNodeData.left = null;
            } else if (nodeMap.has(toNode)) {
              const toNodeData = nodeMap.get(toNode)!;
              fromNodeData.left = toNodeData.id!;
              toNodeData.parent = fromNodeData.id!;
            }
          }
        }
        
        const rightMatch = line.match(rightAssignmentPattern);
        if (rightMatch) {
          const fromNode = rightMatch[1];
          const toNode = rightMatch[2];
          
          if (nodeMap.has(fromNode)) {
            const fromNodeData = nodeMap.get(fromNode)!;
            if (toNode === 'NULL') {
              fromNodeData.right = null;
            } else if (nodeMap.has(toNode)) {
              const toNodeData = nodeMap.get(toNode)!;
              fromNodeData.right = toNodeData.id!;
              toNodeData.parent = fromNodeData.id!;
            }
          }
        }
      }
      
      // Convert map to array and validate
      for (const [name, nodeData] of nodeMap) {
        if (nodeData.value !== undefined && nodeData.id) {
          const node: BSTNode = {
            id: nodeData.id,
            value: nodeData.value,
            left: nodeData.left || null,
            right: nodeData.right || null,
            parent: nodeData.parent || null,
            isRoot: nodeData.isRoot || false
          };
          
          // Apply search highlighting
          if (operations.searchValue && nodeData.value === operations.searchValue) {
            node.highlighted = true;
            operations.highlightedElements = operations.highlightedElements || [];
            operations.highlightedElements.push(node.id);
          }
          
          nodes.push(node);
        }
      }
    }
    
    // Handle search highlighting for inserted nodes
    if (operations.searchValue) {
      nodes.forEach(node => {
        if (node.value === operations.searchValue) {
          node.highlighted = true;
          operations.highlightedElements = operations.highlightedElements || [];
          operations.highlightedElements.push(node.id);
        }
      });
    }
    
    // Handle delete operation
    if (operations.deleteValue) {
      const deleteIndex = nodes.findIndex(n => n.value === operations.deleteValue);
      if (deleteIndex >= 0) {
        const deletedNode = nodes[deleteIndex];
        nodes.splice(deleteIndex, 1);
        
        // Fix BST structure after deletion (simplified)
        nodes.forEach(node => {
          if (node.left === deletedNode.id) {
            node.left = null;
          }
          if (node.right === deletedNode.id) {
            node.right = null;
          }
          if (node.parent === deletedNode.id) {
            node.parent = null;
          }
        });
      }
    }
    
    return { nodes, operations };
  }
  
  private insertIntoBST(nodes: BSTNode[], value: number): void {
    const newNode: BSTNode = {
      id: this.generateId(),
      value,
      left: null,
      right: null,
      parent: null,
      isRoot: false
    };
    
    if (nodes.length === 0) {
      newNode.isRoot = true;
      nodes.push(newNode);
      return;
    }
    
    const root = nodes.find(n => n.isRoot)!;
    let current = root;
    
    while (true) {
      if (value < current.value) {
        const leftChild = nodes.find(n => n.id === current.left);
        if (!leftChild) {
          current.left = newNode.id;
          newNode.parent = current.id;
          break;
        } else {
          current = leftChild;
        }
      } else {
        const rightChild = nodes.find(n => n.id === current.right);
        if (!rightChild) {
          current.right = newNode.id;
          newNode.parent = current.id;
          break;
        } else {
          current = rightChild;
        }
      }
    }
    
    nodes.push(newNode);
  }
  
  parseCode(code: string, type: DataStructureType): VisualizationData {
    const result: VisualizationData = { type };
    
    switch (type) {
      case 'linkedlist':
        const { nodes, operations: llOps } = this.parseLinkedListCode(code);
        result.linkedList = nodes;
        result.highlightedElements = llOps.highlightedElements;
        result.operationResult = llOps.operationResult;
        break;
      case 'array':
        const { elements, operations: arrOps } = this.parseArrayCode(code);
        result.array = elements;
        result.highlightedElements = arrOps.highlightedElements;
        result.operationResult = arrOps.operationResult;
        break;
      case 'stack':
        const { elements: stackElements, operations: stackOps } = this.parseStackCode(code);
        result.stack = stackElements;
        result.highlightedElements = stackOps.highlightedElements;
        result.operationResult = stackOps.operationResult;
        break;
      case 'queue':
        const { elements: queueElements, operations: queueOps } = this.parseQueueCode(code);
        result.queue = queueElements;
        result.highlightedElements = queueOps.highlightedElements;
        result.operationResult = queueOps.operationResult;
        break;
      case 'bst':
        const { nodes: bstNodes, operations: bstOps } = this.parseBSTCode(code);
        result.bst = bstNodes;
        result.highlightedElements = bstOps.highlightedElements;
        result.operationResult = bstOps.operationResult;
        break;
    }
    
    return result;
  }
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Validate if the linked list structure is correct
  validateLinkedList(nodes: LinkedListNode[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check if there's exactly one head node
    const headNodes = nodes.filter(n => n.type === 'head');
    if (headNodes.length === 0) {
      errors.push('No head node found');
    } else if (headNodes.length > 1) {
      errors.push('Multiple head nodes found');
    }
    
    // Check for circular references (simplified)
    const visited = new Set<string>();
    let current = headNodes[0];
    
    while (current && current.next) {
      if (visited.has(current.id)) {
        errors.push('Circular reference detected');
        break;
      }
      visited.add(current.id);
      current = nodes.find(n => n.id === current.next) as LinkedListNode;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}