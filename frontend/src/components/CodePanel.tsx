import React, { useState } from "react";
import { DataStructure, Operation } from "./VisualizationPage";

type Language = "c" | "java" | "python";

interface CodePanelProps {
  structure: DataStructure;
  currentOperation: { operation: Operation; data: any } | null;
}

const arrayCodes: Record<Language, Record<string, string>> = {
  c: {
    "insert-head": `// Insert at beginning (shift elements)\nvoid insertAtBeginning(int arr[], int *size, int value, int capacity) {\n    if (*size >= capacity) return;\n    for (int i = *size; i > 0; i--) {\n        arr[i] = arr[i-1];\n    }\n    arr[0] = value;\n    (*size)++;\n}`,
    "insert-tail": `// Insert at end\nvoid insertAtEnd(int arr[], int *size, int value, int capacity) {\n    if (*size >= capacity) return;\n    arr[*size] = value;\n    (*size)++;\n}`,
    "insert-middle": `// Insert at position\nvoid insertAtPosition(int arr[], int *size, int value, int position, int capacity) {\n    if (*size >= capacity || position > *size) return;\n    for (int i = *size; i > position; i--) {\n        arr[i] = arr[i-1];\n    }\n    arr[position] = value;\n    (*size)++;\n}`,
    "delete-head": `// Delete from beginning\nvoid deleteFromBeginning(int arr[], int *size) {\n    if (*size <= 0) return;\n    for (int i = 0; i < *size - 1; i++) {\n        arr[i] = arr[i+1];\n    }\n    (*size)--;\n}`,
    "delete-tail": `// Delete from end\nvoid deleteFromEnd(int arr[], int *size) {\n    if (*size <= 0) return;\n    (*size)--;\n}`,
    "delete-middle": `// Delete from position\nvoid deleteFromPosition(int arr[], int *size, int position) {\n    if (*size <= 0 || position >= *size) return;\n    for (int i = position; i < *size - 1; i++) {\n        arr[i] = arr[i+1];\n    }\n    (*size)--;\n}`,
    search: `// Linear search\nint linearSearch(int arr[], int size, int key) {\n    for (int i = 0; i < size; i++) {\n        if (arr[i] == key) {\n            return i;\n        }\n    }\n    return -1;\n}`,
  },
  java: {
    "insert-head": `// Insert at beginning\npublic void insertAtBeginning(int[] arr, int value) {\n    // Note: Arrays are fixed size in Java, would need ArrayList\n    // For demonstration:\n    System.arraycopy(arr, 0, arr, 1, arr.length - 1);\n    arr[0] = value;\n}`,
    "insert-tail": `// Insert at end\npublic void insertAtEnd(int[] arr, int value, int size) {\n    if (size < arr.length) {\n        arr[size] = value;\n    }\n}`,
    "insert-middle": `// Insert at position\npublic void insertAtPosition(int[] arr, int value, int position, int size) {\n    if (position <= size && size < arr.length) {\n        System.arraycopy(arr, position, arr, position + 1, size - position);\n        arr[position] = value;\n    }\n}`,
    "delete-head": `// Delete from beginning\npublic void deleteFromBeginning(int[] arr, int size) {\n    if (size > 0) {\n        System.arraycopy(arr, 1, arr, 0, size - 1);\n    }\n}`,
    "delete-tail": `// Delete from end\npublic void deleteFromEnd(int[] arr, int size) {\n    // Simply reduce size\n}`,
    "delete-middle": `// Delete from position\npublic void deleteFromPosition(int[] arr, int position, int size) {\n    if (position < size) {\n        System.arraycopy(arr, position + 1, arr, position, size - position - 1);\n    }\n}`,
    search: `// Linear search\npublic int linearSearch(int[] arr, int size, int key) {\n    for (int i = 0; i < size; i++) {\n        if (arr[i] == key) {\n            return i;\n        }\n    }\n    return -1;\n}`,
  },
  python: {
    "insert-head": `# Insert at beginning\narr.insert(0, value)`,
    "insert-tail": `# Insert at end\narr.append(value)`,
    "insert-middle": `# Insert at position\narr.insert(position, value)`,
    "delete-head": `# Delete from beginning\ndel arr[0]`,
    "delete-tail": `# Delete from end\narr.pop()`,
    "delete-middle": `# Delete from position\ndel arr[position]`,
    search: `# Linear search\ntry:\n    index = arr.index(key)\nexcept ValueError:\n    index = -1`,
  },
};

const stackCodes: Record<Language, Record<string, string>> = {
  c: {
    "insert-tail": `// Push to stack\nvoid push(struct Stack* stack, int value) {\n    if (stack->top >= stack->capacity - 1) return;\n    stack->arr[++stack->top] = value;\n}`,
    "delete-tail": `// Pop from stack\nint pop(struct Stack* stack) {\n    if (stack->top < 0) return -1;\n    return stack->arr[stack->top--];\n}`,
    search: `// Search in stack\nint search(struct Stack* stack, int key) {\n    for (int i = 0; i <= stack->top; i++) {\n        if (stack->arr[i] == key) {\n            return i;\n        }\n    }\n    return -1;\n}`,
  },
  java: {
    "insert-tail": `// Push to stack\npublic void push(int value) {\n    stack.add(value);\n}`,
    "delete-tail": `// Pop from stack\npublic int pop() {\n    if (!stack.isEmpty()) {\n        return stack.remove(stack.size() - 1);\n    }\n    return -1;\n}`,
    search: `// Search in stack\npublic int search(int key) {\n    return stack.indexOf(key);\n}`,
  },
  python: {
    "insert-tail": `# Push to stack\nstack.append(value)`,
    "delete-tail": `# Pop from stack\nif stack:\n    value = stack.pop()`,
    search: `# Search in stack\ntry:\n    index = stack.index(key)\nexcept ValueError:\n    index = -1`,
  },
};

const queueCodes: Record<Language, Record<string, string>> = {
  c: {
    "insert-tail": `// Enqueue\nvoid enqueue(struct Queue* queue, int value) {\n    if (queue->rear >= queue->capacity - 1) return;\n    queue->arr[++queue->rear] = value;\n}`,
    "delete-head": `// Dequeue\nint dequeue(struct Queue* queue) {\n    if (queue->front > queue->rear) return -1;\n    return queue->arr[queue->front++];\n}`,
    search: `// Search in queue\nint search(struct Queue* queue, int key) {\n    for (int i = queue->front; i <= queue->rear; i++) {\n        if (queue->arr[i] == key) {\n            return i - queue->front;\n        }\n    }\n    return -1;\n}`,
  },
  java: {
    "insert-tail": `// Enqueue\npublic void enqueue(int value) {\n    queue.add(value);\n}`,
    "delete-head": `// Dequeue\npublic int dequeue() {\n    if (!queue.isEmpty()) {\n        return queue.remove(0);\n    }\n    return -1;\n}`,
    search: `// Search in queue\npublic int search(int key) {\n    return queue.indexOf(key);\n}`,
  },
  python: {
    "insert-tail": `# Enqueue\nqueue.append(value)`,
    "delete-head": `# Dequeue\nif queue:\n    value = queue.pop(0)`,
    search: `# Search in queue\ntry:\n    index = queue.index(key)\nexcept ValueError:\n    index = -1`,
  },
};

const linkedListCodes: Record<Language, Record<string, string>> = {
  c: {
    "insert-head": `// Insert at head\nvoid insertAtHead(struct Node** head, int data) {\n    struct Node* newNode = malloc(sizeof(struct Node));\n    newNode->data = data;\n    newNode->next = *head;\n    *head = newNode;\n}`,
    "insert-tail": `// Insert at tail\nvoid insertAtTail(struct Node** head, int data) {\n    struct Node* newNode = malloc(sizeof(struct Node));\n    newNode->data = data;\n    newNode->next = NULL;\n    if (*head == NULL) {\n        *head = newNode;\n        return;\n    }\n    struct Node* temp = *head;\n    while (temp->next != NULL) {\n        temp = temp->next;\n    }\n    temp->next = newNode;\n}`,
    "insert-middle": `// Insert at position\nvoid insertAtPosition(struct Node** head, int data, int position) {\n    struct Node* newNode = malloc(sizeof(struct Node));\n    newNode->data = data;\n    if (position == 0) {\n        newNode->next = *head;\n        *head = newNode;\n        return;\n    }\n    struct Node* temp = *head;\n    for (int i = 0; temp != NULL && i < position - 1; i++) {\n        temp = temp->next;\n    }\n    if (temp == NULL) {\n        free(newNode);\n        return;\n    }\n    newNode->next = temp->next;\n    temp->next = newNode;\n}`,
    "delete-head": `// Delete head\nvoid deleteHead(struct Node** head) {\n    if (*head == NULL) return;\n    struct Node* temp = *head;\n    *head = (*head)->next;\n    free(temp);\n}`,
    "delete-tail": `// Delete tail\nvoid deleteTail(struct Node** head) {\n    if (*head == NULL) return;\n    if ((*head)->next == NULL) {\n        free(*head);\n        *head = NULL;\n        return;\n    }\n    struct Node* temp = *head;\n    while (temp->next->next != NULL) {\n        temp = temp->next;\n    }\n    free(temp->next);\n    temp->next = NULL;\n}`,
    "delete-middle": `// Delete node at position\nvoid deleteAtPosition(struct Node** head, int position) {\n    if (*head == NULL) return;\n    if (position == 0) {\n        struct Node* temp = *head;\n        *head = (*head)->next;\n        free(temp);\n        return;\n    }\n    struct Node* temp = *head;\n    for (int i = 0; temp != NULL && i < position - 1; i++) {\n        temp = temp->next;\n    }\n    if (temp == NULL || temp->next == NULL) return;\n    struct Node* nodeToDelete = temp->next;\n    temp->next = nodeToDelete->next;\n    free(nodeToDelete);\n}`,
  search: `// Search for value\nstruct Node* search(struct Node* head, int key) {\n    struct Node* current = head;\n    while (current != NULL) {\n        if (current->data == key) {\n            return current;\n        }\n        current = current->next;\n    }\n    return NULL;\n}`,
  },
  java: {
    "insert-head": `// Insert at head\npublic void insertAtHead(int data) {\n    Node newNode = new Node(data);\n    newNode.next = head;\n    head = newNode;\n}`,
    "insert-tail": `// Insert at tail\npublic void insertAtTail(int data) {\n    Node newNode = new Node(data);\n    if (head == null) {\n        head = newNode;\n        return;\n    }\n    Node current = head;\n    while (current.next != null) {\n        current = current.next;\n    }\n    current.next = newNode;\n}`,
    "insert-middle": `// Insert at position\npublic void insertAtPosition(int data, int position) {\n    Node newNode = new Node(data);\n    if (position == 0) {\n        newNode.next = head;\n        head = newNode;\n        return;\n    }\n    Node temp = head;\n    for (int i = 0; temp != null && i < position - 1; i++) {\n        temp = temp.next;\n    }\n    if (temp == null) return;\n    newNode.next = temp.next;\n    temp.next = newNode;\n}`,
    "delete-head": `// Delete head\npublic void deleteHead() {\n    if (head == null) return;\n    head = head.next;\n}`,
    "delete-tail": `// Delete tail\npublic void deleteTail() {\n    if (head == null) return;\n    if (head.next == null) {\n        head = null;\n        return;\n    }\n    Node temp = head;\n    while (temp.next.next != null) {\n        temp = temp.next;\n    }\n    temp.next = null;\n}`,
    "delete-middle": `// Delete node at position\npublic void deleteAtPosition(int position) {\n    if (head == null) return;\n    if (position == 0) {\n        head = head.next;\n        return;\n    }\n    Node temp = head;\n    for (int i = 0; temp != null && i < position - 1; i++) {\n        temp = temp.next;\n    }\n    if (temp == null || temp.next == null) return;\n    temp.next = temp.next.next;\n}`,
  search: `// Search for value\npublic Node search(int key) {\n    Node current = head;\n    while (current != null) {\n        if (current.data == key) {\n            return current;\n        }\n        current = current.next;\n    }\n    return null;\n}`,
  },
  python: {
    "insert-head": `# Insert at head\ndef insert_at_head(self, data):\n    new_node = Node(data)\n    new_node.next = self.head\n    self.head = new_node`,
    "insert-tail": `# Insert at tail\ndef insert_at_tail(self, data):\n    new_node = Node(data)\n    if not self.head:\n        self.head = new_node\n        return\n    current = self.head\n    while current.next:\n        current = current.next\n    current.next = new_node`,
    "insert-middle": `# Insert at position\ndef insert_at_position(self, data, position):\n    new_node = Node(data)\n    if position == 0:\n        new_node.next = self.head\n        self.head = new_node\n        return\n    current = self.head\n    for _ in range(position - 1):\n        if not current:\n            return\n        current = current.next\n    if not current:\n        return\n    new_node.next = current.next\n    current.next = new_node`,
    "delete-head": `# Delete head\ndef delete_head(self):\n    if not self.head:\n        return\n    self.head = self.head.next`,
    "delete-tail": `# Delete tail\ndef delete_tail(self):\n    if not self.head:\n        return\n    if not self.head.next:\n        self.head = None\n        return\n    current = self.head\n    while current.next and current.next.next:\n        current = current.next\n    current.next = None`,
    "delete-middle": `# Delete node at position\ndef delete_at_position(self, position):\n    if not self.head:\n        return\n    if position == 0:\n        self.head = self.head.next\n        return\n    current = self.head\n    for _ in range(position - 1):\n        if not current.next:\n            return\n        current = current.next\n    if not current.next:\n        return\n    current.next = current.next.next`,
  search: `# Search for value\ndef search(self, key):\n    current = self.head\n    while current:\n        if current.data == key:\n            return current\n        current = current.next\n    return None`,
  },
};

const binaryTreeCodes: Record<Language, Record<string, string>> = {
  c: {
    "insert-middle": `// Insert node in binary tree\nstruct TreeNode* insertNode(struct TreeNode* root, int data) {\n    if (root == NULL) {\n        struct TreeNode* newNode = malloc(sizeof(struct TreeNode));\n        newNode->data = data;\n        newNode->left = newNode->right = NULL;\n        return newNode;\n    }\n    if (data < root->data) {\n        root->left = insertNode(root->left, data);\n    } else {\n        root->right = insertNode(root->right, data);\n    }\n    return root;\n}`,
    "delete-middle": `// Delete node from binary tree\nstruct TreeNode* deleteNode(struct TreeNode* root, int key) {\n    if (root == NULL) return root;\n    if (key < root->data) {\n        root->left = deleteNode(root->left, key);\n    } else if (key > root->data) {\n        root->right = deleteNode(root->right, key);\n    } else {\n        if (root->left == NULL) {\n            struct TreeNode* temp = root->right;\n            free(root);\n            return temp;\n        } else if (root->right == NULL) {\n            struct TreeNode* temp = root->left;\n            free(root);\n            return temp;\n        }\n        struct TreeNode* temp = root->right;\n        while (temp->left != NULL) temp = temp->left;\n        root->data = temp->data;\n        root->right = deleteNode(root->right, temp->data);\n    }\n    return root;\n}`,
    search: `// Search in binary tree\nstruct TreeNode* search(struct TreeNode* root, int key) {\n    if (root == NULL || root->data == key) {\n        return root;\n    }\n    if (key < root->data) {\n        return search(root->left, key);\n    }\n    return search(root->right, key);\n}`,
    "inorder": `// Inorder traversal\nvoid inorder(struct TreeNode* root) {\n    if (root == NULL) return;\n    inorder(root->left);\n    printf("%d ", root->data);\n    inorder(root->right);\n}`,
    "preorder": `// Preorder traversal\nvoid preorder(struct TreeNode* root) {\n    if (root == NULL) return;\n    printf("%d ", root->data);\n    preorder(root->left);\n    preorder(root->right);\n}`,
    "postorder": `// Postorder traversal\nvoid postorder(struct TreeNode* root) {\n    if (root == NULL) return;\n    postorder(root->left);\n    postorder(root->right);\n    printf("%d ", root->data);\n}`,
  },
  java: {
    "insert-middle": `// Insert node in binary tree\npublic TreeNode insert(TreeNode root, int data) {\n    if (root == null) return new TreeNode(data);\n    if (data < root.data) {\n        root.left = insert(root.left, data);\n    } else {\n        root.right = insert(root.right, data);\n    }\n    return root;\n}`,
    "delete-middle": `// Delete node from binary tree\npublic TreeNode deleteNode(TreeNode root, int key) {\n    if (root == null) return null;\n    if (key < root.data) {\n        root.left = deleteNode(root.left, key);\n    } else if (key > root.data) {\n        root.right = deleteNode(root.right, key);\n    } else {\n        if (root.left == null) return root.right;\n        if (root.right == null) return root.left;\n        TreeNode successor = root.right;\n        while (successor.left != null) {\n            successor = successor.left;\n        }\n        root.data = successor.data;\n        root.right = deleteNode(root.right, successor.data);\n    }\n    return root;\n}`,
    search: `// Search in binary tree\npublic TreeNode search(TreeNode root, int key) {\n    if (root == null || root.data == key) {\n        return root;\n    }\n    if (key < root.data) {\n        return search(root.left, key);\n    }\n    return search(root.right, key);\n}`,
    "inorder": `// Inorder traversal\npublic void inorder(TreeNode root) {\n    if (root == null) return;\n    inorder(root.left);\n    System.out.print(root.data + " ");\n    inorder(root.right);\n}`,
    "preorder": `// Preorder traversal\npublic void preorder(TreeNode root) {\n    if (root == null) return;\n    System.out.print(root.data + " ");\n    preorder(root.left);\n    preorder(root.right);\n}`,
    "postorder": `// Postorder traversal\npublic void postorder(TreeNode root) {\n    if (root == null) return;\n    postorder(root.left);\n    postorder(root.right);\n    System.out.print(root.data + " ");\n}`,
  },
  python: {
    "insert-middle": `# Insert node in binary tree\ndef insert(self, root, data):\n    if not root:\n        return TreeNode(data)\n    if data < root.data:\n        root.left = self.insert(root.left, data)\n    else:\n        root.right = self.insert(root.right, data)\n    return root`,
    "delete-middle": `# Delete node from binary tree\ndef delete_node(self, root, key):\n    if not root:\n        return None\n    if key < root.data:\n        root.left = self.delete_node(root.left, key)\n    elif key > root.data:\n        root.right = self.delete_node(root.right, key)\n    else:\n        if not root.left:\n            return root.right\n        if not root.right:\n            return root.left\n        successor = root.right\n        while successor.left:\n            successor = successor.left\n        root.data = successor.data\n        root.right = self.delete_node(root.right, successor.data)\n    return root`,
    search: `# Search in binary tree\ndef search(self, root, key):\n    if not root or root.data == key:\n        return root\n    if key < root.data:\n        return self.search(root.left, key)\n    return self.search(root.right, key)`,
    "inorder": `# Inorder traversal\ndef inorder(self, root):\n    if not root:\n        return\n    self.inorder(root.left)\n    print(root.data, end=" ")\n    self.inorder(root.right)`,
    "preorder": `# Preorder traversal\ndef preorder(self, root):\n    if not root:\n        return\n    print(root.data, end=" ")\n    self.preorder(root.left)\n    self.preorder(root.right)`,
    "postorder": `# Postorder traversal\ndef postorder(self, root):\n    if not root:\n        return\n    self.postorder(root.left)\n    self.postorder(root.right)\n    print(root.data, end=" ")`,
  },
};

const defaultCodes: Record<
  "binarytree" | "linkedlist" | "array" | "stack" | "queue",
  Record<Language, string>
> = {
  binarytree: {
    c: `// Binary Tree Structure\nstruct TreeNode {\n    int data;\n    struct TreeNode* left;\n    struct TreeNode* right;\n};\n\n// Create a new tree node\nstruct TreeNode* createNode(int data) {\n    struct TreeNode* newNode = malloc(sizeof(struct TreeNode));\n    newNode->data = data;\n    newNode->left = newNode->right = NULL;\n    return newNode;\n}`,
    java: `// Binary Tree Node Class\nclass TreeNode {\n    int data;\n    TreeNode left, right;\n    \n    TreeNode(int data) {\n        this.data = data;\n        left = right = null;\n    }\n}\n\n// Binary Tree Class\npublic class BinaryTree {\n    TreeNode root;\n    \n    public BinaryTree() {\n        root = null;\n    }\n}`,
    python: `# Binary Tree Node Class\nclass TreeNode:\n    def __init__(self, data):\n        self.data = data\n        self.left = None\n        self.right = None\n\n# Binary Tree Class\nclass BinaryTree:\n    def __init__(self):\n        self.root = None`,
  },
  linkedlist: {
    c: `// Linked List Structure\nstruct Node {\n    int data;\n    struct Node* next;\n};\n\n// Create a new node\nstruct Node* createNode(int data) {\n    struct Node* newNode = malloc(sizeof(struct Node));\n    newNode->data = data;\n    newNode->next = NULL;\n    return newNode;\n}`,
    java: `// Linked List Node Class\nclass Node {\n    int data;\n    Node next;\n    \n    Node(int data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\n// LinkedList Class\npublic class LinkedList {\n    Node head;\n    \n    public LinkedList() {\n        head = null;\n    }\n}`,
    python: `# Linked List Node Class\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\n# LinkedList Class\nclass LinkedList:\n    def __init__(self):\n        self.head = None`,
  },
  array: {
    c: `// Array Declaration\n#define MAX_SIZE 100\nint arr[MAX_SIZE];\nint size = 0;\n\n// Initialize array\nvoid initializeArray(int arr[], int *size) {\n    *size = 0;\n}`,
    java: `// Array Declaration\nint[] arr = new int[100];\nint size = 0;\n\n// Or using ArrayList for dynamic size\nArrayList<Integer> list = new ArrayList<>();`,
    python: `# Array (List in Python)\narr = []\n\n# Or fixed size\narr = [0] * 100\nsize = 0`,
  },
  stack: {
    c: `// Stack Structure\nstruct Stack {\n    int top;\n    unsigned capacity;\n    int* arr;\n};\n\n// Create a stack\nstruct Stack* createStack(unsigned capacity) {\n    struct Stack* stack = malloc(sizeof(struct Stack));\n    stack->capacity = capacity;\n    stack->top = -1;\n    stack->arr = malloc(stack->capacity * sizeof(int));\n    return stack;\n}`,
    java: `// Stack using ArrayList\nArrayList<Integer> stack = new ArrayList<>();\n\n// Or using Stack class\nStack<Integer> stack = new Stack<>();`,
    python: `# Stack using list\nstack = []`,
  },
  queue: {
    c: `// Queue Structure\nstruct Queue {\n    int front, rear, size;\n    unsigned capacity;\n    int* arr;\n};\n\n// Create a queue\nstruct Queue* createQueue(unsigned capacity) {\n    struct Queue* queue = malloc(sizeof(struct Queue));\n    queue->capacity = capacity;\n    queue->front = queue->size = 0;\n    queue->rear = capacity - 1;\n    queue->arr = malloc(queue->capacity * sizeof(int));\n    return queue;\n}`,
    java: `// Queue using LinkedList\nQueue<Integer> queue = new LinkedList<>();\n\n// Or using ArrayDeque\nArrayDeque<Integer> queue = new ArrayDeque<>();`,
    python: `# Queue using list\nqueue = []`,
  },
};

const CodePanel: React.FC<CodePanelProps> = ({
  structure,
  currentOperation,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("c");
  const languages = [
    { id: "c" as Language, name: "C" },
    { id: "java" as Language, name: "Java" },
    { id: "python" as Language, name: "Python" },
  ];
  const getCode = (): string => {
    if (!currentOperation) {
      return getDefaultCode();
    }
    const { operation } = currentOperation;
    if (structure === "binarytree") {
      return binaryTreeCodes[selectedLanguage][operation] || getDefaultCode();
    }
    if (structure === "linkedlist") {
      return linkedListCodes[selectedLanguage][operation] || getDefaultCode();
    }
    if (structure === "array") {
      return arrayCodes[selectedLanguage][operation] || getDefaultCode();
    }
    if (structure === "stack") {
      return stackCodes[selectedLanguage][operation] || getDefaultCode();
    }
    if (structure === "queue") {
      return queueCodes[selectedLanguage][operation] || getDefaultCode();
    }
    return getDefaultCode();
  };
  const getDefaultCode = (): string => {
    if (structure === "binarytree") {
      return defaultCodes.binarytree[selectedLanguage];
    }
    if (structure === "linkedlist") {
      return defaultCodes.linkedlist[selectedLanguage];
    }
    if (structure === "array") {
      return defaultCodes.array[selectedLanguage];
    }
    if (structure === "stack") {
      return defaultCodes.stack[selectedLanguage];
    }
    if (structure === "queue") {
      return defaultCodes.queue[selectedLanguage];
    }
    return "// No code available for this data structure.";
  };
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">
          Live Code Generation
        </h3>
        <div className="flex space-x-1">
          {languages.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => setSelectedLanguage(id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedLanguage === id
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-slate-900 rounded-lg p-4 overflow-y-auto">
        <pre className="text-sm text-slate-100 font-mono leading-relaxed whitespace-pre-wrap">
          {getCode()}
        </pre>
      </div>
    </div>
  );
};

export default CodePanel;
