import React, { useState } from 'react';
import { Plus, Trash2, Search, Eye } from 'lucide-react';
import { Operation } from './VisualizationPage';

interface QueueVisualizationProps {
  onOperation: (operation: Operation, data: any) => void;
}

const QueueVisualization: React.FC<QueueVisualizationProps> = ({ onOperation }) => {
  const [queue, setQueue] = useState<number[]>([10, 20, 30]);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const enqueueElement = () => {
    if (editingValue === '') return;
    const value = parseInt(editingValue);
    if (isNaN(value)) return;
    const newQueue = [...queue, value];
    setQueue(newQueue);
    setEditingValue('');
    setIsEditing(false);
    onOperation('insert-tail', { value });
  };

  const dequeueElement = () => {
    if (queue.length === 0) return;
    const dequeuedValue = queue[0];
    const newQueue = queue.slice(1);
    setQueue(newQueue);
    onOperation('delete-head', { value: dequeuedValue });
  };

  const frontElement = () => {
    if (queue.length === 0) return;
    const frontValue = queue[0];
    setHighlightedIndex(0);
    setTimeout(() => setHighlightedIndex(null), 3000);
    onOperation('search', { value: frontValue, found: true, position: 0 });
  };

  const searchElement = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;
    const foundIndex = queue.indexOf(value);
    if (foundIndex !== -1) {
      setHighlightedIndex(foundIndex);
      setTimeout(() => setHighlightedIndex(null), 3000);
    }
    onOperation('search', { value, found: foundIndex !== -1, position: foundIndex });
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
            onClick={searchElement}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={frontElement}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Front</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            placeholder="Value to enqueue"
            className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-32"
            onKeyDown={(e) => {
              if (e.key === 'Enter') enqueueElement();
            }}
          />
          <button
            onClick={enqueueElement}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Enqueue</span>
          </button>
          <button
            onClick={dequeueElement}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Dequeue</span>
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex-1 flex items-center justify-center overflow-x-auto" style={{ padding: '2rem 0' }}>
        <div className="flex items-center space-x-6 p-8 min-w-max" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          {queue.length === 0 ? (
            <div className="text-slate-500 text-lg">Empty Queue - Enqueue some elements!</div>
          ) : (
            queue.map((value, index) => (
              <div key={index} className="relative group">
                <div
                  className={`w-24 h-24 rounded-xl border-3 flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    highlightedIndex === index
                      ? 'bg-yellow-200 border-yellow-400 scale-110 shadow-lg'
                      : 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200 group-hover:scale-105 shadow-md'
                  }`}
                >
                  {value}
                </div>

                {/* Index label */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 bg-white px-2 py-1 rounded shadow">
                  [{index}]
                </div>

                {/* Front/Rear indicators */}
                {index === 0 && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-slate-600 bg-white px-2 py-1 rounded shadow font-semibold">
                    FRONT
                  </div>
                )}
                {index === queue.length - 1 && (
                  <div className="absolute -top-8 right-1/2 transform translate-x-1/2 text-xs text-slate-600 bg-white px-2 py-1 rounded shadow font-semibold">
                    REAR
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueVisualization;
