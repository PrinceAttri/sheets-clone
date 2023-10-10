let rows = 100;
let cols = 26; //26 alphabets

//col for numbering 1-100
let addressColCont = document.querySelector(".address-col-cont");
for(let i = 1; i <= rows; i++) {
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class", "address-col")
    addressCol.innerText = i;
    addressColCont.appendChild(addressCol);
}

//row for numbering A-Z
let addressRowCont = document.querySelector(".address-row-cont");
for(let i = 1; i <= cols; i++) {
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class", "address-row")
    addressRow.innerText = String.fromCharCode(65 + (i-1)); //65 is ascii value of A
    addressRowCont.appendChild(addressRow);
}

//creating cells [100][26]
let cellsCont = document.querySelector(".cells-cont");
for(let i = 0; i < rows; i++) {
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "row-cont");
    for(let j = 0; j < cols; j++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true"); //so as to type in a cell

        //for not checking correct spelling - disabling red underline
        cell.setAttribute("spellcheck", false);

        //for row and cell identification used in cell-properties
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);

        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j); //so as to see the address of any cell in the address bar
    }
    cellsCont.appendChild(rowCont);
}

//to get the address of current cell in address bar
let addressBar = document.querySelector(".address-bar");
function addListenerForAddressBarDisplay(cell, i, j) {
    cell.addEventListener("click", (e) => {
        let rowID = i+1;
        let colID = String.fromCharCode(65 + (j));

        addressBar.value = `${colID}${rowID}`; //remember that here back-tick is used
    });
}
