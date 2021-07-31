import {BOMBSNR, ROWSNR, COLSNR, FLAG, BOMB, BOMBID, HIDDENID } from "./constants.js";
const boardDiv = document.querySelector('#board');
const flagsElem = document.querySelector('#flags');
const message = document.querySelector('#message');
let flagsNr = BOMBSNR;
let gameBoard = new Array(ROWSNR).fill().map(() => new Array(COLSNR).fill(HIDDENID));
const updateFlagsDiv = () => flagsElem.innerText = `${FLAG}:${flagsNr}`;

const getLineAndCol = btn => {
    const { id } = btn;
    let i;
    let line = 0;
    for (i = 4; id[i] !== '-'; i++) {
        line = 10 * line + Number(id[i]);
    }
    while (id[i] != 'l') {
        i++;
    }
    i++
    let col = 0;
    for (; id[i]; i++) {
        col = 10 * col + Number(id[i]);
    }
    return { line, col };
}

const updateUserBoard = () => {
    for (let i = 0; i < ROWSNR; i++) {
        for (let j = 0; j < COLSNR; j++) {
            let btn = document.querySelector(`#line${i}-col${j}`);
            if (gameBoard[i][j] === HIDDENID || gameBoard[i][j] == BOMBID) {
                continue;
            }
            btn.style.backgroundColor = 'green';
            if (gameBoard[i][j]) {
                btn.innerText = `${gameBoard[i][j]}`;
            }
        }
    }
}

const checkWin = () => {
    for (let i = 0; i < ROWSNR; i++) {
        for (let j = 0; j < COLSNR; j++) {
            if (gameBoard[i][j] === HIDDENID) {
                return false;
            }
        }
    }
    return true;
}

const finishGame = (isWin) => {
    for (let i = 0; i < ROWSNR; i++) {
        for (let j = 0; j < COLSNR; j++) {
            let btn = document.querySelector(`#line${i}-col${j}`);
            btn.disabled = true;
            if (gameBoard[i][j] == BOMBID) {
                btn.innerText = BOMB;
            }
        }
    }
    if (isWin) {
        message.innerText = 'you won';
        message.style.color = 'green';
    } else {
        message.innerText = 'you lost';
        message.style.color = 'red';
    }
}

const handleLeftClick = e => {
    const { line, col } = getLineAndCol(e.target);
    if (gameBoard[line][col] === BOMBID) {
        finishGame(false);
        return;
    }
    gameBoard[line][col] = 0;
    for (let dirI = -1; dirI <= 1; dirI++) {
        for (let dirJ = -1; dirJ <= 1; dirJ++) {
            let newI = line + dirI;
            let newJ = col + dirJ;
            if (!(newI >= 0 && newJ >= 0 && newI < ROWSNR && newJ < COLSNR)) {
                continue;
            }
            if (gameBoard[newI][newJ] === BOMBID) {
                gameBoard[line][col]++;
            }
        }
    }
    updateUserBoard();
    if (checkWin()) {
        finishGame(true);
    }
}

const handleRightClick = e => {
    if (!flagsNr) {
        //return;
    }
    let btn = e.target;
    if (btn.innerText) {
        btn.innerText = '';
        flagsNr++;
    } else {
        btn.innerText = `${FLAG}`;
        flagsNr--;//*/
    }
    updateFlagsDiv();
}

//#region draw boad
for (let i = 0; i < ROWSNR; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < COLSNR; j++) {
        let btn = document.createElement('button');
        btn.id = `line${i}-col${j}`;
        btn.onmousedown = e => !e.button ? handleLeftClick(e) : handleRightClick(e);
        let td = document.createElement('td');
        td.appendChild(btn);
        tr.appendChild(td);
    }
    boardDiv.appendChild(tr);
}
//#endregion
window.oncontextmenu = () => {
    return false;
}
//#region init board
let remBombs = BOMBSNR;
const fillBoard = () => {
    const toBeBombChance = 15 / 100;//distribution of bombs
    for (let i = 0; i < ROWSNR && remBombs; i++) {
        for (let j = 0; j < COLSNR && remBombs; j++) {
            if (gameBoard[i][j] === BOMBID) {
                continue;
            }
            let r = Math.random();
            if (r <= toBeBombChance) {
                gameBoard[i][j] = BOMBID;
                remBombs--;
            }
        }
    }
};

while (remBombs) {
    fillBoard();
}
updateFlagsDiv();
console.assert(!remBombs);
//*/
//#endregion
