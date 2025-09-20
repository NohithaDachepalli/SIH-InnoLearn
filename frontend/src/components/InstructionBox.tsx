import React from 'react';

interface InstructionBoxProps {
  structure: string;
}

const instructions: Record<string, string> = {
  linkedlist: 'Click on nodes to select. Use the operation buttons to insert or delete nodes. Hover over nodes for details.',
  binarytree: 'Click on nodes to select and highlight. Use insert/delete buttons to modify the tree. Traversal is dynamic.',
  array: 'Click on the array to add elements. Use the arrows to insert or delete at specific positions. Search highlights elements.',
  stack: 'Click "Push" to add an empty node on top, then enter value dynamically. Click "Pop" to remove top node. Peek highlights top.',
  queue: 'Click "Enqueue" to add an empty node at rear, then enter value dynamically. Click "Dequeue" to remove front node. Front highlights front.',
};

const InstructionBox: React.FC<InstructionBoxProps> = ({ structure }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-w-md text-slate-700 text-sm leading-relaxed">
      <h4 className="font-semibold mb-2">How to Interact</h4>
      <p>{instructions[structure] || 'Use the controls and visualization to interact with the data structure.'}</p>
    </div>
  );
};

export default InstructionBox;
