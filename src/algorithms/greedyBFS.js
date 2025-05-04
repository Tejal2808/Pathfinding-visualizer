// Heuristic function - Manhattan distance
function getManhattanDistance(node, finishNode) {
  return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
}

export function greedyBFS(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = []; // Priority queue
  
  // Initialize distances
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.isVisited = false;
      node.previousNode = null;
    }
  }
  
  startNode.distance = 0;
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length > 0) {
    // Sort by heuristic (Manhattan distance to finish)
    unvisitedNodes.sort((a, b) => 
      getManhattanDistance(a, finishNode) - getManhattanDistance(b, finishNode)
    );
    const closestNode = unvisitedNodes.shift();

    // If we encounter a wall, skip it
    if (closestNode.isWall) continue;

    // If we're trapped, return
    if (getManhattanDistance(closestNode, finishNode) === Infinity) {
      return visitedNodesInOrder;
    }

    // Mark node as visited
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // If we found the finish node, we're done
    if (closestNode === finishNode) {
      return visitedNodesInOrder;
    }

    // Update all neighbors
    const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      if (!neighbor.isVisited && !unvisitedNodes.includes(neighbor)) {
        neighbor.previousNode = closestNode;
        neighbor.distance = closestNode.distance + (neighbor.isWeighted ? neighbor.weight : 1);
        unvisitedNodes.push(neighbor);
      }
    }
  }
  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  // Check all four directions
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
} 