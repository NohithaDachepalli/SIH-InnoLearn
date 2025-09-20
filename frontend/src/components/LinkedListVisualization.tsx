import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Trash2 } from "lucide-react";
import { Operation } from "./VisualizationPage"; // your operations

interface Node {
  id: number;
  value: number;
}

const ItemTypes = {
  NODE: "node",
};

// Draggable node component
interface DraggableNodeProps {
  value: number;
}
const DraggableNode: React.FC<DraggableNodeProps> = ({ value }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.NODE,
      item: { value }, // latest value captured
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [value] // re-run useDrag whenever value changes
  );

  return (
    <div
      ref={drag}
      className={`px-4 py-2 rounded-lg border cursor-grab font-medium ${
        isDragging ? "opacity-50" : "bg-blue-500 text-white"
      }`}
    >
      {value}
    </div>
  );
};

// DropZone component
interface DropZoneProps {
  onDrop: (value: number) => void;
}
const DropZone: React.FC<DropZoneProps> = ({ onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.NODE,
    drop: (item: any) => onDrop(item.value),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`mx-1 transition-all rounded-lg border-2 border-dashed border-slate-300
        ${isOver ? "bg-emerald-200 border-emerald-500 opacity-100" : "opacity-0"}`}
      style={{ width: "4rem", minHeight: "6rem" }}
    />
  );
};

// Main Linked List Visualizer
const LinkedListVisualizer: React.FC<{ onOperation: (op: Operation, data: any) => void }> = ({
  onOperation,
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [newValue, setNewValue] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  // Search node by value
  const searchNode = () => {
    const value = Number(searchValue);
    if (isNaN(value)) return;
    const idx = nodes.findIndex(n => n.value === value);
    setHighlightedIndex(idx >= 0 ? idx : null);
    onOperation('search', { value, found: idx >= 0, position: idx });
    if (idx >= 0) {
      setTimeout(() => setHighlightedIndex(null), 2500);
    }
  };

  // Insert node at any index
  const insertAt = (index: number, value: number) => {
    const newNode: Node = { id: Date.now(), value };

    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];
      newNodes.splice(index, 0, newNode);

      // Determine operation type
      let operationType: Operation;
      if (index === 0) operationType = "insert-head";
      else if (index === prevNodes.length) operationType = "insert-tail";
      else operationType = "insert-middle";

      onOperation(operationType, { value, position: index });
      return newNodes;
    });
  };

  // Delete node at index
  const deleteNode = (index: number) => {
    setNodes((prevNodes) => {
      const deletedValue = prevNodes[index].value;
      const newNodes = prevNodes.filter((_, i) => i !== index);

      let operationType: Operation;
      if (index === 0) operationType = "delete-head";
      else if (index === prevNodes.length - 1) operationType = "delete-tail";
      else operationType = "delete-middle";

      onOperation(operationType, { value: deletedValue, position: index });
      return newNodes;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        {/* Input for new node */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(Number(e.target.value))}
            className="px-3 py-2 border rounded w-32"
            placeholder="Enter value"
          />
          <span className="text-slate-500">→ Drag this node</span>
        </div>

        {/* Draggable node */}
        <div className="flex space-x-4 mt-2">
          <DraggableNode value={newValue} />
        </div>

        {/* Search input */}
        <div className="flex items-center space-x-2 mt-4">
          <input
            type="number"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="px-3 py-2 border rounded w-32"
            placeholder="Search value"
          />
          <button
            onClick={searchNode}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Search
          </button>
        </div>

        {/* Linked List Area */}
        <div className="flex items-center space-x-2 overflow-x-auto p-6 bg-slate-50 rounded-lg border">
          {/* Head drop zone */}
          <DropZone onDrop={(val) => insertAt(0, val)} />

          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              {/* Node */}
              <div className="relative flex flex-col items-center">
                <div className={`w-20 h-20 flex items-center justify-center border rounded-lg font-bold ${highlightedIndex === index ? 'bg-yellow-300 border-yellow-500' : 'bg-emerald-100'}`}>
                  {node.value}
                </div>
                <button
                  onClick={() => deleteNode(index)}
                  className="absolute -top-3 -right-3 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <div className="w-12 h-1 bg-slate-400 relative">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-400 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              </div>

              {/* Drop zone after this node */}
              <DropZone onDrop={(val) => insertAt(index + 1, val)} />
            </React.Fragment>
          ))}

          {/* NULL at the end */}
          {nodes.length > 0 && (
            <div className="w-16 h-16 flex items-center justify-center text-slate-400 font-medium border-2 border-dashed rounded-lg">
              NULL
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default LinkedListVisualizer;
