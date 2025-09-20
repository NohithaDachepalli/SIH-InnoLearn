import React, { useState } from 'react';
import { Plus, Trash2, Search, Check, X } from 'lucide-react';
import { Operation } from './VisualizationPage';

interface ArrayVisualizationProps {
  onOperation: (operation: Operation, data: any) => void;
}

const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({ onOperation }) => {
  const [array, setArray] = useState<number[]>([10, 20, 30]);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const addElement = (index: number | null) => {
    const newArray = [...array];
    if (index === null || index >= newArray.length) {
      newArray.push(null as any);
      setEditingIndex(newArray.length - 1);
      onOperation('insert-tail', { value: null, position: newArray.length - 1, pending: true });
    } else {
      newArray.splice(index, 0, null as any);
      setEditingIndex(index);
      onOperation('insert-middle', { value: null, position: index, pending: true });
    }
    setArray(newArray);
    setEditingValue('');
  };

  const confirmEdit = (index: number) => {
    const value = parseInt(editingValue);
    if (isNaN(value)) return;
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
    setEditingIndex(null);
    onOperation('insert-middle', { value, position: index });
    setEditingValue('');
  };

  const cancelEdit = (index: number) => {
    const newArray = [...array];
    newArray.splice(index, 1);
    setArray(newArray);
    setEditingIndex(null);
    setEditingValue('');
  };

  const deleteElement = (index: number) => {
    const deletedValue = array[index];
    const newArray = array.filter((_, i) => i !== index);
    setArray(newArray);
    onOperation('delete-middle', { value: deletedValue, position: index });
  };

  const searchElement = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;
    const foundIndex = array.findIndex((el) => el === value);
    if (foundIndex !== -1) {
      setHighlightedIndex(foundIndex);
      setTimeout(() => setHighlightedIndex(null), 3000);
    }
    onOperation('search', { value, found: foundIndex !== -1, position: foundIndex });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search Controls */}
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
        </div>
        <button
          onClick={() => addElement(null)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Element</span>
        </button>
      </div>

      {/* Visualization */}
      <div className="flex-1 flex items-center justify-center overflow-x-auto" style={{ padding: '2rem 0' }}>
        <div className="flex items-center space-x-6 p-8 min-w-max" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          {array.length === 0 ? (
            <div className="text-slate-500 text-lg">Empty Array - Add some elements!</div>
          ) : (
            array.map((value, index) => (
              <div key={index} className="relative group">
                <div
                  className={`w-24 h-24 rounded-xl border-3 flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    highlightedIndex === index
                      ? 'bg-yellow-200 border-yellow-400 scale-110 shadow-lg'
                      : 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200 group-hover:scale-105 shadow-md'
                  }`}
                >
                  {editingIndex === index ? (
                    <div className="flex flex-col items-center space-y-2">
                      <input
                        type="number"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="w-16 h-8 text-center border border-slate-300 rounded text-sm"
                        placeholder="Value"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') confirmEdit(index);
                        }}
                      />
                      <div className="flex space-x-1">
                        <button
                          onClick={() => confirmEdit(index)}
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => cancelEdit(index)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    value
                  )}
                </div>

                {/* Controls */}
                {!editingIndex && (
                  <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-lg border p-2 flex space-x-1">
                    <button
                      onClick={() => deleteElement(index)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      title="Delete element"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingIndex(index);
                        setEditingValue(value !== null ? value.toString() : '');
                      }}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      title="Edit element"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => addElement(index + 1)}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      title="Insert element after"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Index label */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 bg-white px-2 py-1 rounded shadow">
                  [{index}]
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualization;
