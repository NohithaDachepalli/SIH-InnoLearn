import React from 'react';
import { DataStructure, Operation } from './VisualizationPage';
import { ArrowDownCircle, ArrowUpCircle, Search, Trash2, PlusCircle, Info, Trees, ListTree, ListChecks } from 'lucide-react';

interface ExplanationPanelProps {
	structure: DataStructure;
	currentOperation: { operation: Operation | 'inorder' | 'preorder' | 'postorder'; data: any } | null;
}


const operationMeta: Record<string, { icon: React.ReactNode; label: string }> = {
	'insert-head': { icon: <ArrowUpCircle className="w-6 h-6 text-emerald-500" />, label: 'Insert at Head' },
	'insert-tail': { icon: <ArrowDownCircle className="w-6 h-6 text-blue-500" />, label: 'Insert at Tail' },
	'insert-middle': { icon: <PlusCircle className="w-6 h-6 text-purple-500" />, label: 'Insert at Position' },
	'delete-head': { icon: <Trash2 className="w-6 h-6 text-red-500" />, label: 'Delete Head' },
	'delete-tail': { icon: <Trash2 className="w-6 h-6 text-red-500" />, label: 'Delete Tail' },
	'delete-middle': { icon: <Trash2 className="w-6 h-6 text-red-500" />, label: 'Delete Node' },
	'search': { icon: <Search className="w-6 h-6 text-yellow-500" />, label: 'Search' },
	'inorder': { icon: <ListTree className="w-6 h-6 text-orange-500" />, label: 'Inorder Traversal' },
	'preorder': { icon: <Trees className="w-6 h-6 text-teal-500" />, label: 'Preorder Traversal' },
	'postorder': { icon: <ListChecks className="w-6 h-6 text-pink-500" />, label: 'Postorder Traversal' },
};

const explanations: Record<DataStructure, Record<string, string>> = {
	linkedlist: {
		'insert-head': 'A new node is created and placed at the beginning of the list. The previous head becomes the next node.',
		'insert-tail': 'A new node is appended to the end of the list. The last node points to the new node.',
		'insert-middle': 'A new node is inserted at a specific position. Pointers are updated to maintain the list.',
		'delete-head': 'The head node is removed. The next node becomes the new head.',
		'delete-tail': 'The last node is removed. The second last node points to NULL.',
		'delete-middle': 'A node at a specific position is removed. Pointers are updated to maintain the list.',
	'search': 'Each node is checked sequentially from the head. If the target value is found, the node is highlighted; otherwise, the search continues until the end of the list.'
	},
	binarytree: {
		'insert-head': '',
		'insert-tail': '',
		'insert-middle': 'A new node is inserted into the tree. Traverses left or right based on value.',
		'delete-head': '',
		'delete-tail': '',
		'delete-middle': 'Removes a node from the tree. Handles leaf, one child, or two children cases.',
		'search': 'Traverses the tree to find the node with the target value.',
		'inorder': 'Inorder traversal visits nodes in ascending order: left subtree, root, then right subtree. Used to get sorted order of BST.',
		'preorder': 'Preorder traversal visits nodes in the order: root, left subtree, then right subtree. Useful for copying the tree.',
		'postorder': 'Postorder traversal visits nodes in the order: left subtree, right subtree, then root. Useful for deleting the tree.',
	},
	array: {
		'insert-head': 'Elements are shifted to the right to make space at the beginning. The new element is inserted at index 0.',
		'insert-tail': 'The new element is appended to the end of the array.',
		'insert-middle': 'Elements after the insertion point are shifted to the right. The new element is placed at the specified index.',
		'delete-head': 'The first element is removed. All subsequent elements are shifted to the left.',
		'delete-tail': 'The last element is removed from the array.',
		'delete-middle': 'The element at the specified index is removed. All subsequent elements are shifted to the left.',
		'search': 'Each element is checked sequentially from index 0 until the target value is found or the end is reached.'
	},
	stack: {
		'insert-head': '',
		'insert-tail': 'A new element is added to the top of the stack (push operation).',
		'insert-middle': '',
		'delete-head': '',
		'delete-tail': 'The top element is removed from the stack (pop operation).',
		'delete-middle': '',
		'search': 'The stack is searched from top to bottom for the target value.'
	},
	queue: {
		'insert-head': '',
		'insert-tail': 'A new element is added to the rear of the queue (enqueue operation).',
		'insert-middle': '',
		'delete-head': 'The front element is removed from the queue (dequeue operation).',
		'delete-tail': '',
		'delete-middle': '',
		'search': 'The queue is searched from front to rear for the target value.'
	}
};

const defaultText: Record<DataStructure, string> = {
	linkedlist: 'A linked list is a linear data structure where each element points to the next. Common operations include insertion, deletion, and search.',
	binarytree: 'A binary tree is a hierarchical data structure with nodes having up to two children. Common operations include insertion, deletion, and search.',
	array: 'An array is a collection of elements identified by index. Common operations include insertion, deletion, and search.',
	stack: 'A stack is a LIFO (last-in, first-out) data structure. Common operations include push, pop, peek, and search.',
	queue: 'A queue is a FIFO (first-in, first-out) data structure. Common operations include enqueue, dequeue, front, and search.'
};

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ structure, currentOperation }) => {
	let explanation = defaultText[structure];
	let opMeta: typeof operationMeta[keyof typeof operationMeta] | null = null;
	if (currentOperation && explanations[structure][currentOperation.operation]) {
		explanation = explanations[structure][currentOperation.operation];
		opMeta = operationMeta[currentOperation.operation];
	}

	return (
		<div className="h-full flex flex-col">
			<h3 className="text-xl font-bold text-slate-900 mb-4">Operation Explanation</h3>
			<div className="flex-1 text-slate-700 text-base leading-relaxed">
				{opMeta ? (
					<div className="flex items-center mb-3 space-x-3">
						{opMeta.icon}
						<span className="font-semibold text-lg text-slate-800">{opMeta.label}</span>
					</div>
				) : (
					<div className="flex items-center mb-3 space-x-3">
						<Info className="w-6 h-6 text-slate-400" />
						<span className="font-semibold text-lg text-slate-800">Overview</span>
					</div>
				)}
				<span>{explanation || 'No explanation available for this operation.'}</span>
			</div>
		</div>
	);
};

export default ExplanationPanel;