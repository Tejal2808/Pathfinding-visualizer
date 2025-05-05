// Heuristic function - Manhattan distance
function getManhattanDistance(node, finishNode) {
  return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
}

// A* Search Algorithm
export function aStarSearch(grid, startNode, finishNode, isWeightedGraph ) {
  const visitedNodesInOrder = [];
  const unvisitedNodes = []; // Priority queue

  // Initialize nodes
  for (const row of grid) {
    for (const node of row) {
      node.gCost = Infinity; // Distance from start node
      node.hCost = getManhattanDistance(node, finishNode); // Heuristic to goal
      node.fCost = Infinity; // Total cost = g + h
      node.isVisited = false;
      node.previousNode = null;
    }
  }

  startNode.gCost = 0;
  startNode.fCost = startNode.hCost;
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length > 0) {
    // Sort nodes by fCost (lowest total cost first)
    unvisitedNodes.sort((a, b) => a.fCost - b.fCost);
    const currentNode = unvisitedNodes.shift();

    if (currentNode.isWall) continue;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;

      // Use weights only if it's a weighted graph
      const costToNeighbor = isWeightedGraph ? neighbor.weight : 1;
      const tentativeG = currentNode.gCost + costToNeighbor;

      if (tentativeG < neighbor.gCost) {
        neighbor.previousNode = currentNode;
        neighbor.gCost = tentativeG;
        neighbor.hCost = getManhattanDistance(neighbor, finishNode);
        neighbor.fCost = neighbor.gCost + neighbor.hCost;

        if (!unvisitedNodes.includes(neighbor)) {
          unvisitedNodes.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

// Helper function to get unvisited neighbors
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
}
