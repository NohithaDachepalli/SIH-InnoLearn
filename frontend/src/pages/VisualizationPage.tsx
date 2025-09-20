import React, { useState } from 'react';
import LinkedListVisualization from '../components/LinkedListVisualization';
import BinaryTreeVisualization from '../components/BinaryTreeVisualization';
import ArrayVisualization from '../components/ArrayVisualization';
import StackVisualization from '../components/StackVisualization';
import QueueVisualization from '../components/QueueVisualization';
import CodePanel from '../components/CodePanel';
import ExplanationPanel from '../components/ExplanationPanel';
import InstructionBox from '../components/InstructionBox';

export type DataStructure = 'linkedlist' | 'array' | 'stack' | 'queue' | 'binarytree';
export type Operation =
  | 'insert-head'
  | 'insert-tail'
  | 'insert-middle'
  | 'delete-head'
  | 'delete-tail'
  | 'delete-middle'
  | 'search'
  | 'inorder'
  | 'preorder'
  | 'postorder';

const VisualizationPage: React.FC = () => {
  const [selectedStructure, setSelectedStructure] = useState<DataStructure>('linkedlist');
  const [currentOperation, setCurrentOperation] = useState<{ operation: Operation; data: any } | null>(null);

  const structures = [
    { id: 'linkedlist' as DataStructure, name: 'Linked List' },
    { id: 'binarytree' as DataStructure, name: 'Binary Tree' },
    { id: 'array' as DataStructure, name: 'Array' },
    { id: 'stack' as DataStructure, name: 'Stack' },
    { id: 'queue' as DataStructure, name: 'Queue' },
  ];

  const handleOperation = (operation: Operation, data: any) => {
    setCurrentOperation({ operation, data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Interactive Data Structure Visualization</h1>
        <p className="text-lg text-slate-600">Explore data structures through interactive visualizations and real-time code generation</p>
      </div>

      {/* Structure Selector */}
      <div className="flex justify-center space-x-2 mb-8">
        {structures.map(({ id, name }) => (
          <button
            key={id}
            onClick={() => setSelectedStructure(id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedStructure === id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Visualization Panel - More Flexible and Larger */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 mb-10 flex flex-col" style={{ minHeight: '600px' }}>
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Interactive Visualization</h2>
        <div className="flex-1 flex flex-col items-center justify-center w-full h-full space-y-4">
          <InstructionBox structure={selectedStructure} />
          <div className="flex-1 flex items-center justify-center w-full h-full">
            {selectedStructure === 'linkedlist' && (
              <LinkedListVisualization onOperation={handleOperation} />
            )}
            {selectedStructure === 'binarytree' && (
              <BinaryTreeVisualization onOperation={handleOperation} />
            )}
            {selectedStructure === 'array' && (
              <ArrayVisualization onOperation={handleOperation} />
            )}
            {selectedStructure === 'stack' && (
              <StackVisualization onOperation={handleOperation} />
            )}
            {selectedStructure === 'queue' && (
              <QueueVisualization onOperation={handleOperation} />
            )}
          </div>
        </div>
      </div>

      {/* Explanation and Code Panels Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex-1">
          <ExplanationPanel 
            structure={selectedStructure} 
            currentOperation={currentOperation}
          />
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex-1">
          <CodePanel 
            structure={selectedStructure} 
            currentOperation={currentOperation}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualizationPage;