
export function dijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
  
    while (unvisitedNodes.length) {
      // Sort by distance
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift();
  
      // Skip walls
      if (closestNode.isWall) continue;
  
      // Stop if unreachable
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
  
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
  
      // Stop if we reached the finish
      if (closestNode === finishNode) return visitedNodesInOrder;
  
      updateUnvisitedNeighbors(closestNode, grid);
    }
  
    return visitedNodesInOrder;
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    const neighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of neighbors) {
      if (!neighbor.isWall) { // Only update non-wall nodes
        const weight = neighbor.isWeighted ? neighbor.weight : 1;
        const tentativeDistance = node.distance + weight;
        
        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.previousNode = node;
        }
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
  