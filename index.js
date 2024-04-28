class Cell {
    constructor(blocked) {
        this.blocked = blocked;
        this.isPath  = false;
        this.isVisited = false;
        this.isInQueue = false;
        this.isInStack = false;
        this.isInOrder = false;
        this.isInPriorityQueue = false;
        this.isInClosedSet = false;
        this.cost = null;
        this.start = false;
        this.goal = false
        this.cellStyle = {
            backgroundColor: "white",

        };
    }
    styleCell(){
        if(this.blocked)
            this.cellStyle.backgroundColor = "black";
        else if(this.isPath)
            this.cellStyle.backgroundColor = "pink"
        else if(this.start)
            this.cellStyle.backgroundColor = "yellow";
        else if(this.goal)
            this.cellStyle.backgroundColor = "purple";
        else if(this.isInOrder)
            this.cellStyle.backgroundColor = "red";
        else if(this.isInClosedSet)
            this.cellStyle.backgroundColor = "#333"
        else if (this.isInPriorityQueue)
            this.cellStyle.backgroundColor = "#00008B"
        else if(this.isInStack)
            this.cellStyle.backgroundColor = "blue";
        else if(this.isInQueue)
            this.cellStyle.backgroundColor = "#333333";
        else if(this.isVisited)
            this.cellStyle.backgroundColor = "green";
        else 
            this.cellStyle.backgroundColor = "white";
                return this.cellStyle;
    }
    
}
class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(element, priority) {
        this.elements.push({ element, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.elements.shift().element;
    }

    isEmpty() {
        return this.elements.length === 0;
    }
    includes(data){
        console.log(data);
        for (let i = 0; i < this.elements.length;i++){
            if (this.elements[i].element === data)
                return true;
        }
        return false;
    }
}

function manhattanDistance(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

class Maze {
    constructor(rows = 5 , cols = 5, numBlockedCells = 5) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.initializeGrid(numBlockedCells);
        this.renderGrid()
    }

    initializeGrid(numBlockedCells) {
        const grid = new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));
        const chosenCells = new Set(); // Set to keep track of chosen cells

        // Populate the grid with cells
        for (let i = 0; i < numBlockedCells; i++) {
            let x, y;
            do {
                // Randomly choose coordinates
                x = Math.floor(Math.random() * this.rows);
                y = Math.floor(Math.random() * this.cols);
            } while (chosenCells.has(`${x},${y}`)); // Check if the cell is already chosen

            // Mark the cell as chosen
            chosenCells.add(`${x},${y}`);

            // Set the cell as blocked
            grid[x][y] = new Cell(true);
        }

        // Fill the remaining cells as unblocked and assign cost
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (grid[i][j] === null) {
                    const cost = Math.floor(Math.random() * 10) + 1; // Generate a random cost from 1 to 20
                    grid[i][j] = new Cell(false);
                    grid[i][j].cost = cost;
                }
            }
        }

        return grid;
    }
    renderGrid() {
        const container = document.getElementById("maze-container");
        if (!container) {
            console.error(`Container with ID ${"maze-container"} not found.`);
            return;
        }
        container.innerHTML = ""; // Clear previous content
        for (let i = 0; i < this.rows; i++) {
            const rowDiv = document.createElement("div");
            rowDiv.className = "cell"
            
            rowDiv.classList.add("row");
            


            for (let j = 0; j < this.cols; j++) {
                const cell = this.grid[i][j];
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");
                cellDiv.id  = `${i}-${j}`
                cellDiv.style.display = "flex"
                cellDiv.style.justifyContent = "center"
                cellDiv.style.alignItems = "center"
                cellDiv.textContent = this.grid[i][j].cost
                const cellStyle = cell.styleCell();
                for (const [key, value] of Object.entries(cellStyle)) {
                    cellDiv.style[key] = value;
                }
                rowDiv.appendChild(cellDiv);
            }
            container.appendChild(rowDiv);
        }
    }
    dfs(start, goal){
        this.grid[start[0]][start[1]].start = true;
        this.grid[goal[0]][goal[1]].goal = true;
        const stack = [[start[0], start[1]]];
        const path = [];
        let i = 0; // Counter for the current iteration
        this.renderGrid();
        const dfsStep = () => {
            if (stack.length) {
                const [x, y] = stack.pop();
    
                // Update the cell properties
                this.grid[x][y].isInStack = false;
                this.grid[x][y].isInOrder = true;
                this.grid[x][y].isVisited = true;
    
                // Add the coordinates to the path
                path.push([x, y]);
                if (x === goal[0] && y === goal[1]) {
                    return path;
                }
    
                // Explore neighboring cells
                const neighbors = [];
                if (y + 1 < this.cols && !this.grid[x][y + 1].blocked && !this.grid[x][y + 1].isVisited) {
                    neighbors.push([x, y + 1]); // Right
                }
                if (x + 1 < this.rows && !this.grid[x + 1][y].blocked && !this.grid[x + 1][y].isVisited) {
                    neighbors.push([x + 1, y]); // Down
                }
                if (y - 1 >= 0 && !this.grid[x][y - 1].blocked && !this.grid[x][y - 1].isVisited) {
                    neighbors.push([x, y - 1]); // Left
                }
                if (x - 1 >= 0 && !this.grid[x - 1][y].blocked && !this.grid[x - 1][y].isVisited) {
                    neighbors.push([x - 1, y]); // Up
                }
    
                // Push neighbors to the stack
                for (const neighbor of neighbors) {
                    stack.push(neighbor);
                    this.grid[neighbor[0]][neighbor[1]].isInStack = true;
                    this.grid[neighbor[0]][neighbor[1]].isVisited = true;
                }
    
                // Render the grid after each iteration
                this.renderGrid();
                this.grid[x][y].inOrder = false;
    
                i++; // Move to the next iteration
                setTimeout(dfsStep, 300); // Call dfsStep again after 1000 milliseconds (1 second)
            }
        };
    
        return dfsStep(); // Start the depth-first search
        
             
    }
    bfs(start, goal) {
        this.grid[start[0]][start[1]].start = true;
        this.grid[goal[0]][goal[1]].goal = true;
        const queue = [[start[0], start[1]]];
        const path = [];
        let i = 0; // Counter for the current iteration
        this.renderGrid();
    
        const bfsStep = () => {
            if (queue.length) {
                const [x, y] = queue.shift(); // Dequeue the first element from the queue
    
                // Update the cell properties
                this.grid[x][y].isInQueue = false;
                this.grid[x][y].inOrder = true;
                this.grid[x][y].isVisited = true;
    
                // Add the coordinates to the path
                path.push([x, y]);
                if (x === goal[0] && y === goal[1]) {
                    return path;
                }
    
                // Explore neighboring cells
                const neighbors = [];
                if (y + 1 < this.cols && !this.grid[x][y + 1].blocked && !this.grid[x][y + 1].isVisited) {
                    neighbors.push([x, y + 1]); // Right
                }
                if (x + 1 < this.rows && !this.grid[x + 1][y].blocked && !this.grid[x + 1][y].isVisited) {
                    neighbors.push([x + 1, y]); // Down
                }
                if (y - 1 >= 0 && !this.grid[x][y - 1].blocked && !this.grid[x][y - 1].isVisited) {
                    neighbors.push([x, y - 1]); // Left
                }
                if (x - 1 >= 0 && !this.grid[x - 1][y].blocked && !this.grid[x - 1][y].isVisited) {
                    neighbors.push([x - 1, y]); // Up
                }
    
                // Push neighbors to the queue
                for (const neighbor of neighbors) {
                    queue.push(neighbor);
                    this.grid[neighbor[0]][neighbor[1]].isInQueue = true;
                    this.grid[neighbor[0]][neighbor[1]].isVisited = true;
                }

                // Render the grid after each iteration
                this.renderGrid();
                this.grid[x][y].inOrder = false;
    
                i++; // Move to the next iteration
                setTimeout(bfsStep, 3000); // Call bfsStep again after 1000 milliseconds (1 second)
            }
        };
        this.renderGrid()
        return bfsStep(); // Start the breadth-first search
    }
    aStar(start, goal) {
        // Initialize open set, closed set, and maps
        this.grid[start[0]][start[1]].start = true;
        this.grid[goal[0]][goal[1]].goal = true;
        const openSet = new PriorityQueue();
        openSet.enqueue(JSON.stringify(start), 0);
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        gScore.set(JSON.stringify(start), 0);
        fScore.set(JSON.stringify(start), this.heuristic(start, goal));
        this.renderGrid()
        // Start the search
        const aStarStep = () => {
            while(!openSet.isEmpty()) {
                const current  = JSON.parse(openSet.dequeue());
                if (JSON.stringify(current) === JSON.stringify(goal)){
                    return this.reconstructPath(cameFrom, current);
                }
                console.log(current)
                this.grid[current[0]][current[1]].isInOrder = true;
                this.renderGrid()
                console.log("current : " , current)
                const [x,y] = current
                const neighbors = [];
                    if (y + 1 < this.cols && !this.grid[x][y + 1].blocked) {
                        neighbors.push([x, y + 1]); // Right
                    }
                    if (x + 1 < this.rows && !this.grid[x + 1][y].blocked) {
                        neighbors.push([x + 1, y]); // Down
                    }
                    if (y - 1 >= 0 && !this.grid[x][y - 1].blocked) {
                        neighbors.push([x, y - 1]); // Left
                    }
                    if (x - 1 >= 0 && !this.grid[x - 1][y].blocked) {
                        neighbors.push([x - 1, y]); // Up
                    }
                for (let neighbor of neighbors){
                    const tentativeGScore = gScore.get(JSON.stringify(current)) + this.grid[x][y].cost;
                    if (!gScore.has(JSON.stringify(neighbor)) || tentativeGScore < gScore.get(JSON.stringify(neighbor))){
                        cameFrom.set(JSON.stringify(neighbor), current);
                        gScore.set(JSON.stringify(neighbor), tentativeGScore);
                        fScore.set(JSON.stringify(neighbor), gScore.get(JSON.stringify(neighbor)) + this.heuristic(neighbor, goal));
                        if (!openSet.includes(JSON.stringify(neighbor)))
                            openSet.enqueue(JSON.stringify(neighbor), fScore.get(JSON.stringify(neighbor)))
                    }
                }
        };
        this.renderGrid()
        setTimeout(aStarStep, 500); // Call aStarStep again after 1000 milliseconds (1 second)
        // Start the search
    }
    return aStarStep();
}
    // Helper function to calculate heuristic (Manhattan distance)
    reconstructPath(cameFrom, current) {
        const totalPath = [current];
        while (cameFrom.has(JSON.stringify(current))) {
            current = cameFrom.get(JSON.stringify(current));
            totalPath.unshift(current);
        }
        console.log("Total path: ", totalPath);
        return totalPath;
    
    }
    heuristic(a, b) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }
    color_path(path){
        for (let node of path){
            console.log(node)
            const [x , y] = node;
            this.grid[x][y].isPath = true
        }
        this.renderGrid()
    }
        navigateMaze(start, goal, navigationFunction) {

            let path = null
            if (navigationFunction === "dfs") 
                path = this.dfs(start, goal);
            else if (navigationFunction === "bfs")
                path = this.bfs(start, goal);
            else if(navigationFunction === "astar")
                path = this.aStar(start, goal);
            if (path){
                this.color_path(path)
                console.log("Path found:", path);
            }
            else 
                console.log("Path not found.");
            
            return path;
        }

    }


// Example usage:
function init()
{
    maze = new Maze(10, 10  , 15)
}
