//storage
let collectedSheetDB = []; //contains all SheetDB
let sheetDB = []; //1D array

{
    let addSheetBtn = document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
}

/*
for(let i = 0; i < rows; i++) {
    let sheetRow = [];
    for(let j = 0; j < cols; j++) {
        //creating an object for each cell properties
        let cellProp = {
            //just for indication purposes
            bold: false,
            italic: false,
            underline: false,
            alignment: "left",
            fontFamily: "monospace",
            fontSize: "14",
            fontColor: "#000000",
            bgColor: "#000000",
            value: "",
            formula: "",
            children: [],
        }
        sheetRow.push(cellProp);
    }
    sheetDB.push(sheetRow);
}
*/

//selectors for cell properties

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");

let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];

let fontFamily = document.querySelector(".font-family-prop");
let fontSize = document.querySelector(".font-size-prop");

let fontColor = document.querySelector(".font-color-prop");
let backgroundColor = document.querySelector(".background-color-prop");

//no need to declare address bar once again as it is first declared in grid.js
//let addressBar = document.querySelector(".address-bar");

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

//application of 2-way binding
//attach property listeners

//1. bold property
bold.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.bold = !cellProp.bold; //data change
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal"; //UI change part 1/2
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp; //UI change part 2/2

});

//2. italic property
italic.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.italic = !cellProp.italic; //data change
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal"; //UI change part 1/2
    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp; //UI change part 2/2

});

//3. underline property
underline.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.underline = !cellProp.underline; //data change
    cell.style.textDecoration = cellProp.underline ? "underline" : "none"; //UI change part 1/2
    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp; //UI change part 2/2

});

//4. font size property
fontSize.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.fontSize = fontSize.value; //data change
    cell.style.fontSize = cellProp.fontSize + "px"; //UI change part 1/2
    fontSize.value = cellProp.fontSize; //UI change part 2/2
});

//5. font family property
fontFamily.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.fontFamily = fontFamily.value; //data change
    cell.style.fontFamily = cellProp.fontFamily; //UI change part 1/2
    fontFamily.value = cellProp.fontFamily; //UI change part 2/2
});

//6. font color property
fontColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.fontColor = fontColor.value; //data change
    cell.style.color = cellProp.fontColor; //UI change part 1/2
    fontColor.value = cellProp.fontColor; //UI change part 2/2
});

//7. background color property
backgroundColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    //modification
    cellProp.backgroundColor = backgroundColor.value; //data change
    cell.style.backgroundColor = cellProp.backgroundColor; //UI change part 1/2
    backgroundColor.value = cellProp.backgroundColor; //UI change part 2/2
});

//8. alignment property
alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; //data change
        cell.style.textAlign = cellProp.alignment; //UI change part 1/2

        switch(alignValue) { //UI change part 2/2
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
    });
});

//function for showing what property values are present, when a cell
//is clicked, on any cell in the cell property row on our website
//if this not done then we get last cell modified properties
let allCells = document.querySelectorAll(".cell");
for(let i = 0; i < allCells.length; i++) {
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
    //work
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeAddress(address);
        let cellProp = sheetDB[rid][cid];

        //apply cell properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.backgroundColor;
        cell.style.textAlign = cellProp.alignment;

        //Apply properties to UI props container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontColor.value = cellProp.fontColor;
        backgroundColor.value = cellProp.backgroundColor;
        switch(cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;
    });
}


//function for get cell address
function getCellAndCellProp(address) {
    let [rid, cid] = decodeAddress(address);

    //access cell & storage object
    let cell = document.querySelector(`.cell[rid = "${rid}"][cid = "${cid}"]`);

    let cellProp = sheetDB[rid][cid];

    return [cell, cellProp]; //UI change using cell & data change using cellProp -> 2-way binding
}

//get address back from the string val present in address bar
function decodeAddress(address) {
    //address -> "A1"
    let rid = Number(address.slice(1) - 1); //"1" -> 0
    let cid = Number(address.charCodeAt(0)) - 65; //"A" -> 65

    return [rid, cid];
}