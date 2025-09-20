import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '../components/ui/button';
import { CodeEditor } from '../components/CodeEditor';
import { GameStats } from '../components/GameStats';
import { LinkedListVisualization } from '../components/LinkedListVisualization';
import { ArrayVisualization } from '../components/ArrayVisualization';
import { StackVisualization } from '../components/StackVisualization';
import { QueueVisualization } from '../components/QueueVisualization';
import { BSTVisualization } from '../components/BSTVisualization';
import { CodeParser } from '../utils/CodeParser';
import { DataStructureType, VisualizationData } from '../types/DataStructures';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PlayCircle, RotateCcw } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

function getCodeTemplate(type: DataStructureType): string {
  const templates = {
    linkedlist: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    // Your code here - create a linked list
    // Example: Create head node with data = 10
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    head->data = 10;
    head->next = NULL;
    
    // Operations examples:
    // search(10);    // Highlights nodes with value 10
    // delete(10);    // Removes nodes with value 10
    
    return 0;
}`,
    array: `#include <stdio.h>

int main() {
    // Your code here - create an array
    // Example: Initialize an array
    int arr[5] = {10, 20, 30, 40, 50};
    
    // Or declare and assign individually
    // int numbers[3];
    // numbers[0] = 100;
    // numbers[1] = 200;
    // numbers[2] = 300;
    
    // Operations examples:
    // search(30);    // Highlights array elements with value 30
    
    return 0;
}`,
    stack: `#include <stdio.h>

int main() {
    // Your code here - create a stack
    // Example: Initialize stack with values
    int stack[] = {10, 20, 30, 40};
    
    // Or use push operations (conceptual)
    // push(10);
    // push(20);
    // push(30);
    
    // Operations examples:
    // pop();         // Removes top element
    // peek();        // Highlights and returns top element
    
    return 0;
}`,
    queue: `#include <stdio.h>

int main() {
    // Your code here - create a queue
    // Example: Initialize queue with values
    int queue[] = {10, 20, 30, 40};
    
    // Or use enqueue operations (conceptual)
    // enqueue(10);
    // enqueue(20);
    // enqueue(30);
    
    // Operations examples:
    // dequeue();     // Removes front element
    // peek();        // Highlights and returns front element
    
    return 0;
}`,
    bst: `#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
};

int main() {
    // Your code here - create a BST
    // Example: Create root node
    struct TreeNode* root = (struct TreeNode*)malloc(sizeof(struct TreeNode));
    root->data = 50;
    root->left = NULL;
    root->right = NULL;
    
    // Or use insert operations (conceptual)
    // insert(50);
    // insert(30);
    // insert(70);
    // insert(20);
    
    // Operations examples:
    // search(30);    // Highlights nodes with value 30
    // delete(30);    // Removes nodes with value 30
    
    return 0;
}`
  };
  
  return templates[type];
}

function getElementCount(data: VisualizationData): number {
  switch (data.type) {
    case 'linkedlist':
      return data.linkedList?.length || 0;
    case 'array':
      return data.array?.length || 0;
    case 'stack':
      return data.stack?.length || 0;
    case 'queue':
      return data.queue?.length || 0;
    case 'bst':
      return data.bst?.length || 0;
    default:
      return 0;
  }
}

const PracticeMode = () => {
  const [currentType, setCurrentType] = useState<DataStructureType>('linkedlist');
  const [code, setCode] = useState(getCodeTemplate('linkedlist'));
  const [visualizationData, setVisualizationData] = useState<VisualizationData>({ type: 'linkedlist' });
  const [points, setPoints] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleTypeChange = (type: DataStructureType) => {
    setCurrentType(type);
    setCode(getCodeTemplate(type));
    setVisualizationData({ type });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const executeCode = async () => {
    setIsExecuting(true);
    
    try {
      const parser = new CodeParser();
      const parsedData = parser.parseCode(code, currentType);
      
      setVisualizationData(parsedData);
      
      const elementCount = getElementCount(parsedData);
      setPoints(prev => prev + 20); // Award points for successful execution
      
      toast({
        title: "Code Executed Successfully!",
        description: `Created ${currentType} with ${elementCount} elements. +20 points!`,
      });
      
    } catch (error) {
      toast({
        title: "Code Parsing Error",
        description: error instanceof Error ? error.message : "Failed to parse the code",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const resetCode = () => {
    setCode(getCodeTemplate(currentType));
    setVisualizationData({ type: currentType });
  };

  const handleElementRemove = (elementId: string) => {
    const newData = { ...visualizationData };
    
    switch (currentType) {
      case 'linkedlist':
        if (newData.linkedList) {
          newData.linkedList = newData.linkedList.filter(n => n.id !== elementId);
        }
        break;
      case 'array':
        if (newData.array) {
          newData.array = newData.array.filter(e => e.id !== elementId);
        }
        break;
      case 'stack':
        if (newData.stack) {
          newData.stack = newData.stack.filter(e => e.id !== elementId);
        }
        break;
      case 'queue':
        if (newData.queue) {
          newData.queue = newData.queue.filter(e => e.id !== elementId);
        }
        break;
      case 'bst':
        if (newData.bst) {
          newData.bst = newData.bst.filter(n => n.id !== elementId);
        }
        break;
    }
    
    setVisualizationData(newData);
  };

  const renderVisualization = () => {
    switch (currentType) {
      case 'linkedlist':
        return (
          <LinkedListVisualization 
            nodes={visualizationData.linkedList || []} 
            onNodeRemove={handleElementRemove}
            readonly={true}
          />
        );
      case 'array':
        return (
          <ArrayVisualization 
            elements={visualizationData.array || []} 
            onElementRemove={handleElementRemove}
            readonly={true}
          />
        );
      case 'stack':
        return (
          <StackVisualization 
            elements={visualizationData.stack || []} 
            onElementRemove={handleElementRemove}
            readonly={true}
          />
        );
      case 'queue':
        return (
          <QueueVisualization 
            elements={visualizationData.queue || []} 
            onElementRemove={handleElementRemove}
            readonly={true}
          />
        );
      case 'bst':
        return (
          <BSTVisualization 
            nodes={visualizationData.bst || []} 
            onNodeRemove={handleElementRemove}
            readonly={true}
          />
        );
      default:
        return <div>Select a data structure</div>;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
    <div className="min-h-screen bg-background">      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Tabs value={currentType} onValueChange={(value: string) => handleTypeChange(value as DataStructureType)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="linkedlist">Linked List</TabsTrigger>
              <TabsTrigger value="array">Array</TabsTrigger>
              <TabsTrigger value="stack">Stack</TabsTrigger>
              <TabsTrigger value="queue">Queue</TabsTrigger>
              <TabsTrigger value="bst">BST</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mb-6 flex items-center justify-between">
          <GameStats points={points} mode="practice" />
          
          <div className="flex gap-3">
            <Button
              onClick={resetCode}
              className="flex items-center gap-2 btn-outline"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              onClick={executeCode}
              disabled={isExecuting}
              className="flex items-center gap-2 gradient-primary text-black hover:shadow-glow transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              {isExecuting ? 'Executing...' : 'Execute Code'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Code Editor */}
          <div className="h-full">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language="c"
              theme="vs-dark"
            />
          </div>

          {/* Visualization Area */}
          <div className="h-full bg-card rounded-xl shadow-soft border">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-card-foreground">Generated Visualization</h2>
              <p className="text-sm text-muted-foreground">
                Execute your code to see the {currentType} visualization
              </p>
              {visualizationData.operationResult && (
                <div className="mt-2 p-2 bg-primary/10 rounded-md border border-primary/20">
                  <p className="text-sm font-medium text-primary">{visualizationData.operationResult}</p>
                </div>
              )}
            </div>
            <div className="p-4 h-[calc(100%-80px)]">
              {renderVisualization()}
            </div>
          </div>
        </div>
      </div>
    </div>
    </DndProvider>
  );
};

export default PracticeMode;