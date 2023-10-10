//storage -> 2D array (Basic needed)
let collectedGraphComponent = [];
let graphComponentMatrix = [];
/*
for(let i = 0; i < rows; i++) {
    let row = [];
    for(let j = 0; j < cols; j++) {
        //why pushing array? since more than 1 child relation may be present(dependency)
        row.push([]);
    }
    graphComponentMatrix.push(row);
}
*/

//below function return TRUE: cyclic, FALSE: not cyclic
function isGraphCyclic(graphComponentMatrix) {
    //dependency -> visited, dfsVisited (2D array)
    let visited = []; //node visit trace
    let dfsVisited = []; //stack visit trace

    for(let i = 0; i < rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if(visited[i][j] === false) {
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if(response === true) return [i, j]; //found cycle, so return true immediately
            }
        }
    }

    return null;
}

//start -> vis(TRUE) dfsVis(TRUE)
//end -> dfsVis(FALSE)
//if(vis[i][j]) -> already explored path, so go back no use to explore again
//cycle detection condition -> if (vis[i][j] == true && dfsVis[i][j] == true) => cycle
//Return type: True/False (boolean)
//True -> cyclic, False -> not cyclic
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    for(let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        //nbrr - neighbour row & nbrc - neighbour column
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];

        if(visited[nbrr][nbrc] === false) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if(response === true) return true; //found cycle anywhere, so return true immediately
        }

        else if(visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) return true;
    }

    dfsVisited[srcr][srcc] = false;
    return false;
}