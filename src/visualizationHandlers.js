import { dijkstra } from "./algorithms/dijkstra";
import { bfs} from "./algorithms/bfs"; 
import { dfs } from "./algorithms/dfs";
import { greedyBFS } from "./algorithms/greedyBFS";
import { aStarSearch } from "./algorithms/aStarSearch";

export function visualizeDijkstra(state, setState, resetGrid, getPath, animate) {
    const { startNode, finishNode } = state;
    if (!startNode || !finishNode) {
      alert("Please set both start and finish nodes before visualizing!");
      return;
    }
  
    const newGrid = resetGrid();
    setState({
      grid: newGrid,
      isRunning: true,
      shouldStop: false,
      isVisualizing: true,
      activeAlgorithm: 'dijkstra',
      infoMessage:" Dijkstra Algorithm is weighted and guarantees the shortest path"
    }, () => {
      const grid = newGrid;
      const start = grid[startNode.row][startNode.col];
      const finish = grid[finishNode.row][finishNode.col];
      start.distance = 0;
      const visitedNodesInOrder = dijkstra(grid, start, finish);
      const nodesInShortestPathOrder = getPath(finish);
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }
  
  export function visualizeBFS(state, setState, resetGrid, getPath, animate) {
    const { startNode, finishNode } = state;
    if (!startNode || !finishNode) {
      alert("Please set both start and finish nodes before visualizing!");
      return;
    }
  
    const newGrid = resetGrid();
    setState({
      grid: newGrid,
      isRunning: true,
      shouldStop: false,
      isVisualizing: true,
      activeAlgorithm: 'bfs',
      infoMessage: "Breath-first Search is unweighted and guarantee the shortest path!",
    }, () => {
      const grid = newGrid;
      const start = grid[startNode.row][startNode.col];
      const finish = grid[finishNode.row][finishNode.col];
      const visitedNodesInOrder = bfs(grid, start, finish);
      const nodesInShortestPathOrder = getPath(finish);
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }
  
  export function visualizeDFS(state, setState, resetGrid, getPath, animate) {
    const { startNode, finishNode } = state;
    if (!startNode || !finishNode) {
      alert("Please set both start and finish nodes before visualizing!");
      return;
    }
  
    const newGrid = resetGrid();
    setState({
      grid: newGrid,
      isRunning: true,
      shouldStop: false,
      isVisualizing: true,
      activeAlgorithm: 'dfs',
      infoMessage: "Depth-first Search is unweighted and does not guarantee the shortest path",
    }, () => {
      const grid = newGrid;
      const start = grid[startNode.row][startNode.col];
      const finish = grid[finishNode.row][finishNode.col];
      const visitedNodesInOrder = dfs(grid, start, finish);
      const nodesInShortestPathOrder = getPath(finish);
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }
  
  export function visualizeGreedyBFS(state, setState, resetGrid, getPath, animate) {
    const { startNode, finishNode } = state;
    if (!startNode || !finishNode) {
      alert("Please set both start and finish nodes before visualizing!");
      return;
    }
  
    const newGrid = resetGrid();
    setState({
      grid: newGrid,
      isRunning: true,
      shouldStop: false,
      isVisualizing: true,
      activeAlgorithm: 'greedyBFS',
      infoMessage:"Greedy Best-first Search is weighted and does not guarantee the shortest path"
    }, () => {
      const grid = newGrid;
      const start = grid[startNode.row][startNode.col];
      const finish = grid[finishNode.row][finishNode.col];
      const visitedNodesInOrder = greedyBFS(grid, start, finish);
      const nodesInShortestPathOrder = getPath(finish);
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }
  export function visualizeaStarSearch(state, setState, resetGrid, getPath, animate) {
    const { startNode, finishNode } = state;
    if (!startNode || !finishNode) {
      alert("Please set both start and finish nodes before visualizing!");
      return;
    }
  
    const newGrid = resetGrid();
    setState({
      grid: newGrid,
      isRunning: true,
      shouldStop: false,
      isVisualizing: true,
      activeAlgorithm: 'aStarSearch',
      infoMessage:"A* Search is weighted and guarantees the shortest path "
    }, () => {
      const grid = newGrid;
      const start = grid[startNode.row][startNode.col];
      const finish = grid[finishNode.row][finishNode.col];
      const visitedNodesInOrder = aStarSearch(grid, start, finish);
      const nodesInShortestPathOrder = getPath(finish);
      animate(visitedNodesInOrder, nodesInShortestPathOrder);
    });
  }