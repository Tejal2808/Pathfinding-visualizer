import React, { Component } from "react";
import "./PathfindingVisualizer.css";
import Node from "./Node";
import {
  visualizeDijkstra,
  visualizeBFS,
  visualizeDFS,
  visualizeGreedyBFS,
  visualizeaStarSearch
} from './visualizationHandlers'; 

const START_NODE_ROW = 10; 
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10; 
const FINISH_NODE_COL = 55;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNode: {
        row: START_NODE_ROW,
        col: START_NODE_COL
      },
      finishNode: {
        row: FINISH_NODE_ROW,
        col: FINISH_NODE_COL
      },
      isSettingStart: false,
      isSettingFinish: false,
      isSettingWeight: false,
      isWeighted: false,
      currentWeight: 'Weight',
      isCustomWeight: false,
      isWeightedGraph: false,
      weightInputPosition: null,
      isVisualizing: false,
      activeAlgorithm: null,
      selectedWeight: 'weight',
      isRunning: false,
      shouldStop: false,
      infoMessage: "", 
      
    };
  
  }
  handleNodeClick = (row, col) => {
    this.setState({ weightInputPosition: { row, col } });
  };
  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const { isSettingStart, isSettingFinish, isSettingWeight, grid } = this.state;
  
    if (isSettingStart) {
      const newGrid = grid.slice();
      // Remove old start
      for (let r of newGrid) {
        for (let node of r) {
          if (node.isStart) node.isStart = false;
        }
      }
      newGrid[row][col].isStart = true;
      this.setState({ grid: newGrid, startNode: { row, col }, isSettingStart: false });
    } 
    else if (isSettingFinish) {
      const newGrid = grid.slice();
      // Remove old finish
      for (let r of newGrid) {
        for (let node of r) {
          if (node.isFinish) node.isFinish = false;
        }
      }
      newGrid[row][col].isFinish = true;
      this.setState({ grid: newGrid, finishNode: { row, col }, isSettingFinish: false });
    } 
    else if (isSettingWeight) {
      this.handleWeightInput(row, col);
    } 
    else {
      const newGrid = this.getNewGridWithWallToggled(grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }
  

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  handleVisualizationStart = (algorithm) => {
    this.setState({ 
      isVisualizing: true,
      activeAlgorithm: algorithm 
    });
  };

  handleVisualizationEnd = () => {
    this.setState({ 
      isVisualizing: false,
      activeAlgorithm: null
    });
  };

  handleVisualizeDijkstra = () => {
    visualizeDijkstra(this.state, this.setState.bind(this), this.resetGridForNewAlgorithm, this.getNodesInShortestPathOrder, this.animateAlgorithm);
  }
  
  handleVisualizeBFS = () => {
    visualizeBFS(this.state, this.setState.bind(this), this.resetGridForNewAlgorithm, this.getNodesInShortestPathOrder, this.animateAlgorithm);
  }
  handleVisualizeDFS = () => {
    visualizeDFS(this.state, this.setState.bind(this), this.resetGridForNewAlgorithm, this.getNodesInShortestPathOrder, this.animateAlgorithm);
  }
  
  handleVisualizeGreedyBFS = () => {
    visualizeGreedyBFS(this.state, this.setState.bind(this), this.resetGridForNewAlgorithm, this.getNodesInShortestPathOrder, this.animateAlgorithm);
  }
  handleVisualizeaStarSearch = () => {
    visualizeaStarSearch(this.state, this.setState.bind(this), this.resetGridForNewAlgorithm, this.getNodesInShortestPathOrder, this.animateAlgorithm);
  }
  resetGridForNewAlgorithm = () => {
    // Clear all timeouts first
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    }, 0);

    // Reset grid properties while preserving walls, weights, and start/finish nodes
    const newGrid = this.state.grid.map(row => 
      row.map(node => ({
        ...node,
        distance: Infinity,
        isVisited: false,
        previousNode: null,
      }))
    );

    // Reset visual classes
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[0].length; col++) {
        const node = newGrid[row][col];
        const element = document.getElementById(`node-${node.row}-${node.col}`);
        if (element) {
          if (node.isStart) {
            element.className = 'node node-start';
          } else if (node.isFinish) {
            element.className = 'node node-finish';
          } else if (node.isWall) {
            element.className = 'node node-wall';
          } else {
            element.className = `node ${node.weight > 1 ? 'node-weighted' : ''}`;
          }
        }
      }
    }
    this.setState({ infoMessage: "" });
    return newGrid;
  };

  animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    let finishNodeFound = false;
  
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (this.state.shouldStop) {
        this.setState({ isRunning: false, isVisualizing: false });
        return;
      }
  
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
          // Check if finish node was found
          if (!finishNodeFound) {
            alert("Finish node not found.");
          }
        }, 5 * i);
        return;
      }
  
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
        // Check if the current node is the finish node
        if (node.isFinish) {
          finishNodeFound = true;
        }
      }, 5 * i);
    }
  };
  
  animateShortestPath = (nodesInShortestPathOrder) => {
    if (nodesInShortestPathOrder.length === 0) {
      this.setState({ 
        isRunning: false, 
        isVisualizing: false,
        activeAlgorithm: null
      });
      return;
    }
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (this.state.shouldStop) {
        this.setState({ isRunning: false, isVisualizing: false });
        return;
      }

      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-shortest-path';
        }

        // Reset states after animation completes
        if (i === nodesInShortestPathOrder.length - 1) {
          this.setState({ 
            isRunning: false, 
            isVisualizing: false,
            activeAlgorithm: null
          });
        }
      }, 5 * i);
    }
  };
  handleDirectWeightChange = (row, col, weight) => {
    const newGrid = this.state.grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWeighted: true,
      weight,
    };
    newGrid[row][col] = newNode;
    this.setState({ grid: newGrid, weightInputNode: null });
  };
  
  
handleWeightInput(row, col) {
  const { grid, selectedWeight, isSettingWeight } = this.state;

  if (!isSettingWeight) {
    return;
  }

  const newGrid = grid.slice();
  const node = newGrid[row][col];

  // Don't allow weights on start, finish nodes, or walls
  if (node.isStart || node.isFinish || node.isWall) return;

  if (selectedWeight === 'weight' || selectedWeight === '') {
    this.setState({ weightInputPosition: { row, col } });
  } else if (!isNaN(selectedWeight)) {
    const newNode = {
      ...node,
      isWeighted: true,
      weight: parseInt(selectedWeight, 10),
    };
    newGrid[row][col] = newNode;
    this.setState({ grid: newGrid });
  } else {
    alert('Please select a valid weight or select "weight" to enter manually.');
  }
}



  handleWeightChange = (event) => {
    this.setState({ selectedWeight: event.target.value });
  };

  toggleWeight() {
    this.setState((prevState) => ({
      isSettingWeight: !prevState.isSettingWeight,
      isCustomWeight: !prevState.isCustomWeight,
    }));
  }

  getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 29; row++) {
      const currentRow = [];
      for (let col = 0; col < 60; col++) {
        currentRow.push({
          col,
          row,
          isStart: row === START_NODE_ROW && col === START_NODE_COL,
          isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
          isWeighted: false,
          weight: 1,
        });
      }
      grid.push(currentRow);
    }
    return grid;
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }
  stopAlgorithm = () => {
    if (this.state.isRunning) {
      let highestId = window.setTimeout(() => {});
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
  
      for (let row = 0; row < this.state.grid.length; row++) {
        for (let col = 0; col < this.state.grid[0].length; col++) {
          const node = this.state.grid[row][col];
          const element = document.getElementById(`node-${node.row}-${node.col}`);
          if (element && !node.isStart && !node.isFinish && !node.isWall) {
            element.className = `node ${node.weight > 1 ? 'node-weighted' : ''}`;
          }
        }
      }
  
      // Reset state and grid
      const newGrid = this.state.grid.map(row =>
        row.map(node => ({
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null
        }))
      );
  
      this.setState({
        shouldStop: false,
        isRunning: false,
        isVisualizing: false,
        activeAlgorithm: null,
        grid: newGrid
      });
    }
  };

  clearEverything = () => {
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearTimeout(i);
      }
    }, 0);

    const grid = [];
    for (let row = 0; row < 35; row++) {
      const currentRow = [];
      for (let col = 0; col < 70; col++) {
        currentRow.push({
          col,
          row,
          isStart: row === START_NODE_ROW && col === START_NODE_COL,
          isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
          distance: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
          isWeighted: false,
          weight: 1,
          
        });
      }
      grid.push(currentRow);
    }

    // Reset visual classes but preserve start and finish nodes
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const element = document.getElementById(`node-${row}-${col}`);
        if (element) {
          if (row === START_NODE_ROW && col === START_NODE_COL) {
            element.className = 'node node-start';
          } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
            element.className = 'node node-finish';
          } else {
            element.className = 'node';
          }
        }
      }
    }

    // Reset state but keep start and finish nodes
    this.setState({
      grid: grid,
      mouseIsPressed: false,
      startNode: {
        row: START_NODE_ROW,
        col: START_NODE_COL
      },
      finishNode: {
        row: FINISH_NODE_ROW,
        col: FINISH_NODE_COL
      },
      infoMessage: "",
      isSettingStart: false,
      isSettingFinish: false,
      isSettingWeight: false,
      isWeighted: false,
      isRunning: false,
      shouldStop: false,
      isVisualizing: false,
      activeAlgorithm: null,
      selectedWeight: 'weight'
    });
  };

  render() {
    const { 
      grid, 
      mouseIsPressed, 
      isSettingStart, 
      isSettingFinish, 
      isSettingWeight,
      isVisualizing,
      activeAlgorithm,
      isRunning
    } = this.state;

    return (
      <div>
        {/* Buttons */}
        <div className="buttons">
          <button 
            onClick={() => this.handleVisualizeDijkstra()}
            className={`${activeAlgorithm === 'dijkstra' ? 'active' : ''} ${isVisualizing ? 'disabled' : ''}`}
            disabled={isVisualizing}
          >
            Visualize Dijkstra
          </button>
          <button 
            onClick={() => this.handleVisualizeBFS()}
            className={`${activeAlgorithm === 'bfs' ? 'active' : ''} ${isVisualizing ? 'disabled' : ''}`}
            disabled={isVisualizing}
          >
            Visualize BFS
          </button>
          <button 
            onClick={() => this.handleVisualizeDFS()}
            className={`${activeAlgorithm === 'dfs' ? 'active' : ''} ${isVisualizing ? 'disabled' : ''}`}
            disabled={isVisualizing}
          >
            Visualize DFS
          </button>
          <button 
            onClick={() => this.handleVisualizeGreedyBFS()}
            className={`${activeAlgorithm === 'greedyBFS' ? 'active' : ''} ${isVisualizing ? 'disabled' : ''}`}
            disabled={isVisualizing}
          >
            Visualize Greedy BFS
          </button>
          <button 
            onClick={() => this.handleVisualizeaStarSearch()}
            className={`${activeAlgorithm === 'aStarSearch' ? 'active' : ''} ${isVisualizing ? 'disabled' : ''}`}
            disabled={isVisualizing}
          >
            Visualize A* Search
          </button>
          <button 
            onClick={() => this.setState({ 
              isSettingStart: !isSettingStart, 
              isSettingFinish: false, 
              isSettingWeight: false 
            })}
            className={`${isSettingStart ? 'active' : ''} ${isVisualizing ? 'disabled' : ''}`}
            disabled={isVisualizing}
          >
            Set Start Node
          </button>
          <button 
            onClick={() => this.setState({ 
              isSettingStart: false, 
              isSettingFinish: !isSettingFinish, 
              isSettingWeight: false 
            })}
            className={`${isSettingFinish ? 'active' : ''} ${isVisualizing ? 'disabled' : ''}`}
            disabled={isVisualizing}
          >
            Set End Node
          </button>
          <div className="weight-controls">
            <button
              className={`button ${this.state.isSettingWeight ? 'active' : ''}`}
              onClick={() => this.toggleWeight()}
              disabled={isRunning}
            >
              Set Weight
            </button>
            <select 
              value={this.state.selectedWeight}
              onChange={this.handleWeightChange}
              style={{ 
                width: '70px',  
                height: '28px' 
              }} 
              disabled={isRunning}
            >
                <option value="weight">weight</option>
                {[...Array(98)].map((_, i) => (
                  <option key={i + 2} value={i + 2}>{i + 2}</option> // starts from 2
                ))}
            </select>
            <label className={isVisualizing ? 'disabled' : ''}>
              <input
                type="checkbox"
                checked={this.state.isWeightedGraph}
                onChange={(e) => this.setState({ isWeightedGraph: e.target.checked })}
                disabled={isRunning}
              />
              Use Weighted Graph
            </label>
            <button
            className="button"
            onClick={this.clearEverything}
            disabled={this.state.isRunning}
          >
            Erase
          </button>
          <div className="stop-button">
          <button
            // className="stop-button"
            onClick={this.stopAlgorithm}
            disabled={!this.state.isRunning}
          >
            Stop
          </button>
          </div>
          </div>
          {this.state.infoMessage && (
           <div style={{
              backgroundColor: "rgb(63, 134, 144)",
              // border: "1px solid #ffeeba",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              textAlign: "center",
              opacity: 1
              // fontWeight: "bold"
            }}>
              {this.state.infoMessage}
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isStart, isFinish, isWall, isWeighted, weight } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      isWeighted={isWeighted}
                      weight={weight}
                      isSettingWeight={isSettingWeight}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      isWeightInput={
                        this.state.weightInputPosition &&
                        this.state.weightInputPosition.row === row &&
                        this.state.weightInputPosition.col === col
                      }
                      
                      onWeightChange={this.handleDirectWeightChange}
                      onClick={() => this.handleWeightInput(row, col)}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
