const spreadsheetContainer = document.querySelector("#spreadsheet-container");
const exportButton = document.querySelector("#export-button");

const ROWS = 10;
const COLS = 10;
const spreadsheet = [];

class Cell {
  constructor(
    isHeader,
    disabled,
    data,
    row,
    column,
    rowName,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.column = column;
    this.rowName = rowName;
    this.columnName = columnName;
    this.active = active;
  }
}

initSpreadsheet();
drawSheet();

exportButton.onclick = function () {
  let csv = "";
  for (let i = 0; i < spreadsheet.length; i++) {
    csv +=
      spreadsheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n";
  }

  const csvObj = new Blob([csv]);
  const csvUrl = URL.createObjectURL(csvObj);

  const a = document.createElement("a");
  a.href = csvUrl;
  a.download = "spreadsheet name.csv";
  a.click();
};

function initSpreadsheet() {
  for (let i = 0; i < ROWS; i++) {
    let spreadsheetRow = [];
    let isHeader = true;
    let disabled = true;
    for (let j = 0; j < COLS; j++) {
      let rowHeader = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
      ];
      let cellData = "";

      if (j === 0) {
        cellData = i;
      }

      if (i === 0) {
        cellData = rowHeader[j - 1];
      }

      if (cellData <= 0) {
        cellData = "";
        isHeader = false;
        disabled = false;
      }

      if (!cellData) {
        cellData = "";
      }

      const rowName = i;
      const columnName = rowHeader[j - 1];

      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        j,
        rowName,
        columnName,
        false
      );
      spreadsheetRow.push(cell);
    }
    spreadsheet.push(spreadsheetRow);
  }
}

function creatCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = cell.isHeader ? "cell header" : "cell";

  cellEl.id = "cell_" + cell.row + cell.column;
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;

  cellEl.onclick = () => handelCellClick(cell);
  cellEl.onchange = (e) => handleCellValueChange(e.target.value, cell);

  return cellEl;
}

function handleCellValueChange(data, cell) {
  cell.data = data;
}

function handelCellClick(cell) {
  const columnHeaderCell = spreadsheet[0][cell.column];
  const rowHeaderCell = spreadsheet[cell.row][0];
  const cellStatus = document.querySelector("#cell-status");
  const columnHeaderEl = getElFromRowCol(
    columnHeaderCell.row,
    columnHeaderCell.column
  );
  const rowHeaderEl = getElFromRowCol(rowHeaderCell.row, rowHeaderCell.column);

  clearHeaderActive();

  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");

  cellStatus.textContent = `${cell.rowName} - ${cell.columnName}`;
}

function getElFromRowCol(row, column) {
  return document.querySelector("#cell_" + row + column);
}

function clearHeaderActive() {
  const headers = document.querySelectorAll(".header");
  headers.forEach((header) => {
    header.classList.remove("active");
  });
}

function drawSheet() {
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainer = document.createElement("div");

    rowContainer.className = "cell-row";
    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];

      rowContainer.append(creatCellEl(cell));
    }
    spreadsheetContainer.append(rowContainer);
  }
}
