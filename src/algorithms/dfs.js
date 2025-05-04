export function dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    let found = false;
  
    function dfsVisit(node) {
      if (!node || node.isWall || node.isVisited || found) return;
  
      node.isVisited = true;
      visitedNodesInOrder.push(node);
  
      if (node === finishNode) {
        found = true;
        return;
      }
  
      const neighbors = getUnvisitedNeighbors(node, grid);
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited) {
          neighbor.previousNode = node;
          dfsVisit(neighbor);
          if (found) break; // Stop exploring once finish is found
        }
      }
    }
  
    dfsVisit(startNode);
    return visitedNodesInOrder;
  }
  

  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { row, col } = node;
  
    // Adjust neighbor order to prioritize depth toward the finish
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);   // Down
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); // Right
    if (row > 0) neighbors.push(grid[row - 1][col]);                 // Up
    if (col > 0) neighbors.push(grid[row][col - 1]);                 // Left
  
    return neighbors.filter(n => !n.isVisited && !n.isWall);
  }
  
  
  