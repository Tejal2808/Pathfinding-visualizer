
export function dijkstra(grid, startNode, finishNode, isWeightedGraph) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, isWeightedGraph);
  }

  return visitedNodesInOrder;
}

  function updateUnvisitedNeighbors(node, grid, isWeightedGraph) {
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
      const effectiveWeight = isWeightedGraph ? neighbor.weight : 1;
      const distance = node.distance + effectiveWeight;
  
      if (distance < neighbor.distance) {
        neighbor.distance = distance;
        neighbor.previousNode = node;
      }
    }
  }
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
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