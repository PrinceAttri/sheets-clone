for(let i = 0; i < rows; i++) {
    for(let j = 0;  j < cols; j++) {
        let cell = document.querySelector(`.cell[rid = "${i}"][cid = "${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);

            let enteredData = activeCell.innerText;

            if(enteredData === cellProp.value) return;

            cellProp.value = enteredData;

            //if data modified, remove parent-child relation, empty formula
            //update children with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        });
    }
}

let formulaBar = document.querySelector(".formula-bar");
//if Enter key is pressed on keyboard
//then evaluate the formula
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if(e.key === "Enter" && inputFormula) {

        //checking if new formula is unequal to the old formula
        //if yes then breaking the parent-child relationship,
        //evaluate new formula, add new parent-child relationship
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        //breaking parent-child relationship to make new relationship
        //cellProp.formula is the old formula
        if(inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        addChildToGraphComponent(inputFormula, address);
        //check formula is cyclic or not, then only evaluate
        //below function return TRUE: cyclic, FALSE: not cyclic
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if(cycleResponse) {
            //alert("Your formula is cyclic!");
            let response = confirm("Your formula is cyclic. Do you want to trace your path?");
            while(response === true) {
                //keep on tracking until user is satisfied
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse); //want to complete full iteration of color tracking, so attach wait
                response = confirm("Your formula is cyclic. Do you want to trace your path?");
            }

            //break the p-c relationship
            removeChildFromGraphComponent(inputFormula, address);

            return;
        }

        //evaluating formula
        let evaluatedValue = evaluateFormula(inputFormula);

        //to update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);

        //relationship b/w parent-child
        addChildToParent(inputFormula);

        updateChildrenCells(address);

    }
});

//for adding child address value to check whether graph is cyclic
function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeAddress(encodedFormula[i]);

            //putting child address value in parent graph component
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

//for removing p-c relationship is graph is cyclic
function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeAddress(encodedFormula[i]);

            //removing child address value from parent graph component
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for(let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);

        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);

        //recursive call to itself for all the parents
        //base condition is already the for loop, stops at children.length == 0
        updateChildrenCells(childAddress);
    }
}

//adding children address to the parent class
function addChildToParent(formula) {
    //current child address
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            //decoding
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

//removing children address from the parent class
//if in case any children changes its formula
//and gets new parent
function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for(let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            //decoding
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1); //splicing only 1 element at index idx
        }
    }
}


function evaluateFormula(formula) {
    let encodedFormula = formula.split(" "); //splitting on the basis of a space
    for(let i = 0; i < encodedFormula.length; i++) {
        //checking whether it is dependency formula or normal expression
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            //if it lies between 'A' && 'Z'
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }

    let decodedFormula = encodedFormula.join(" ");

    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {

    let [cell, cellProp] = getCellAndCellProp(address);

    //UI update
    cell.innerText = evaluatedValue;
    //DB update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}