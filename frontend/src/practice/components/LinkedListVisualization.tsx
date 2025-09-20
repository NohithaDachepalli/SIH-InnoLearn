import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LinkedListNode } from '../types/LinkedList';
import { useDrop } from 'react-dnd';
import { Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';

interface LinkedListVisualizationProps {
  nodes: LinkedListNode[];
  onNodeRemove?: (nodeId: string) => void;
  readonly?: boolean;
}

export const LinkedListVisualization = ({ 
  nodes, 
  onNodeRemove, 
  readonly = false 
}: LinkedListVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'node',
    drop: (item: any, monitor) => {
      if (readonly) return;
      
      const offset = monitor.getClientOffset();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (offset && containerRect) {
        const x = offset.x - containerRect.left;
        const y = offset.y - containerRect.top;
        
        // Handle drop logic here - you can call a parent handler
        console.log('Node dropped at:', { x, y, item });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) {
      // Clear SVG if no nodes
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove();
      }
      return;
    }

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    // Calculate positions for nodes
    const nodeWidth = 80;
    const nodeHeight = 50;
    const spacing = 120;
    const startX = 50;
    const startY = height / 2;

    // Position nodes in a line
    nodes.forEach((node, index) => {
      node.x = startX + index * spacing;
      node.y = startY;
    });

    // Create group for each node
    const nodeGroups = svg
      .selectAll('.node-group')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Draw node rectangles
    nodeGroups
      .append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 8)
      .attr('x', -nodeWidth / 2)
      .attr('y', -nodeHeight / 2)
  .attr('fill', (d: LinkedListNode) => d.type === 'head' ? 'rgb(0,123,255)' : 'rgb(40,167,69)')
  .attr('stroke', 'rgb(52,58,64)')
      .attr('stroke-width', 2)
      .style('cursor', readonly ? 'default' : 'pointer')
      .style('filter', 'drop-shadow(0 4px 6px hsl(var(--primary) / 0.1))')
      .on('mouseover', function(event, d: LinkedListNode) {
        if (!readonly) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', d.type === 'head' ? 'rgb(0,180,255)' : 'rgb(72,201,176)');
        }
      })
      .on('mouseout', function(event, d: LinkedListNode) {
        if (!readonly) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('fill', d.type === 'head' ? 'rgb(0,123,255)' : 'rgb(40,167,69)');
        }
      });

    // Add node labels (data values)
    nodeGroups
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '14px')
      .text((d: LinkedListNode) => d.data);

    // Add node type labels
    nodeGroups
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-1.5em')
  .attr('fill', 'rgb(108,117,125)')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .text((d: LinkedListNode) => d.type === 'head' ? 'Head' : 'Node');

    // Draw connections (arrows)
    const connections = nodes.filter(node => node.next);
    
    connections.forEach(fromNode => {
      const toNode = nodes.find(n => n.id === fromNode.next);
      if (toNode && fromNode.x !== undefined && fromNode.y !== undefined && 
          toNode.x !== undefined && toNode.y !== undefined) {
        
        // Arrow line
        svg
          .append('line')
          .attr('x1', fromNode.x + nodeWidth / 2)
          .attr('y1', fromNode.y)
          .attr('x2', toNode.x - nodeWidth / 2)
          .attr('y2', toNode.y)
          .attr('stroke', 'rgb(255,140,0)')
          .attr('stroke-width', 3)
          .attr('marker-end', 'url(#arrowhead)');
      }
    });

    // Define arrow marker
    const defs = svg.append('defs');
    defs
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
  .attr('fill', 'rgb(255,140,0)');

    // Add delete buttons if not readonly
    if (!readonly && onNodeRemove) {
      nodeGroups
        .append('circle')
        .attr('cx', nodeWidth / 2 - 8)
        .attr('cy', -nodeHeight / 2 + 8)
        .attr('r', 8)
  .attr('fill', 'rgb(220,53,69)')
        .style('cursor', 'pointer')
        .style('opacity', 0)
        .on('mouseover', function() {
          d3.select(this).style('opacity', 1);
        })
        .on('mouseout', function() {
          d3.select(this).style('opacity', 0);
        })
        .on('click', (event, d: LinkedListNode) => {
          event.stopPropagation();
          onNodeRemove(d.id);
        });

      nodeGroups
        .append('text')
        .attr('x', nodeWidth / 2 - 8)
        .attr('y', -nodeHeight / 2 + 8)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-size', '10px')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .text('×');
    }

  }, [nodes, readonly, onNodeRemove]);

  if (nodes.length === 0) {
    return (
      <div 
        ref={drop}
        className={`
          flex items-center justify-center h-full rounded-lg border-2 border-dashed
          ${isOver ? 'border-primary bg-accent/50' : 'border-muted-foreground/30'}
          ${readonly ? 'bg-muted/20' : ''}
        `}
      >
        <div className="text-center text-muted-foreground">
          {readonly ? (
            <div>
              <div className="text-lg font-medium mb-2">No Visualization Yet</div>
              <p className="text-sm">Execute your code to see the linked list structure</p>
            </div>
          ) : (
            <div>
              <div className="text-lg font-medium mb-2">Empty Linked List</div>
              <p className="text-sm">Drag nodes here to start building</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <div ref={drop} className="w-full h-full">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{ minHeight: '200px' }}
        />
      </div>
    </div>
  );
};