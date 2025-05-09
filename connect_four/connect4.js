const possibleMoveI = [1, -1, 0, 0, 1, 1, -1, -1];
const possibleMoveJ = [0, 0, 1, -1, 1, -1, 1, -1];
let columns = document.querySelectorAll(".board .column");
let circles = document.querySelectorAll(".board .column .circle-container .circle");
let cover = document.querySelector(".cover");
let resButton = document.querySelector(".restart");
let playersCounter = 0;
let currentHoverdElement;
let board = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '']
];
let pointsWinningCords = [];

function canMove(i, j) {
    return i >= 0 && j >= 0 && i < 6 && j < 7;
}
// hovering section
function hover(j) {
    for (let i = board.length - 1; i >= 0; i--) {
        if (board[i][j] === '') {
            currentHoverdElement = document.querySelector(`.column[data-coordinated="${j + 1}"] .circle[data-abscissa="${i + 1}"]`);
            createCircle(currentHoverdElement)
            break
        }
    }
}
function stopHover(ele) {
    if (ele) {      // to check if ele in null or no in case of full column/row
        (playersCounter % 2 === 0) ? ele.classList.remove("player1") : ele.classList.remove("player2");
    }
}

// start hovering
columns.forEach((ele) => {
    ele.addEventListener("mouseenter", () => {
        hover((ele.dataset.coordinated) - 1);
    })
})

// end hovering
columns.forEach((ele) => {
    ele.addEventListener("mouseleave", () => {
        stopHover(currentHoverdElement);
    })
})

// checking result section
function checkingWin(circle, columnClicked) {
    if (checkingDraw() === false) {
        for (let k = 0; k < possibleMoveJ.length; k++) {
            pointsWinningCords = [];
            let i = parseInt(circle.dataset.abscissa) - 1;
            let j = parseInt(columnClicked.dataset.coordinated) - 1;
            let color = board[i][j];
            pointsWinningCords.push([i, j]);
            let counter = 1;
            let Continue = true;
            while (counter < 4 && Continue) {
                stepI = possibleMoveI[k];
                stepJ = possibleMoveJ[k];
                let nextI = i + stepI;
                let nextJ = j + stepJ;
                if (canMove(nextI, nextJ)) {
                    if (board[nextI][nextJ] !== '' && board[nextI][nextJ] === color) {
                            i = nextI;
                            j = nextJ;
                            pointsWinningCords.push([i, j]);
                            counter += 1;
                    } else Continue = false
                } else Continue = false
            }
            if (counter === 4) return true;
        }
        return false;
    } else {
        console.log("DRAWW");
        coveringAndRestart();
    }
}
function coloringWinnerPoints() {
    for (let i = 0; i < pointsWinningCords.length; i++) {
        let currentHoverdElement = document.querySelector(`.column[data-coordinated="${pointsWinningCords[i][1] + 1}"] .circle[data-abscissa="${pointsWinningCords[i][0] + 1}"]`);
        currentHoverdElement.classList.add("winner")
    }
    coveringAndRestart();
}
function checkingDraw() {
    console.log(board)
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] == "") return false 
        }
    }
    return true
}
function coveringAndRestart() {
    cover.style.display = "block";
    let width = (document.querySelector(".board .column .circle-container .circle")).offsetWidth;
    console.log(width)
    resButton.style.width = `${width}px`;
}
// coloring and create circles section
function createCircle(ele) {
    if (ele) {      // to check if ele in null or no in case of full column/row
        (playersCounter % 2 === 0) ? ele.classList.add("player1") : ele.classList.add("player2");
    }
}
function play(circle, columnClicked) {
    createCircle(circle);
    let i = (circle.dataset.abscissa) - 1;
    let j = (columnClicked.dataset.coordinated) - 1;
    if (playersCounter % 2 === 0) board[i][j] = 1;
    else board[i][j] = 2;
    playersCounter += 1;
    if (canMove(i, j)) currentHoverdElement = document.querySelector(`.column[data-coordinated="${j + 1}"] .circle[data-abscissa="${i}"]`);
    if (checkingWin(circle, columnClicked)) coloringWinnerPoints();
}
columns.forEach((ele) => {
    ele.addEventListener("click", () => {
        play(currentHoverdElement, ele);
    });
});

// restart the game
resButton.onclick = () => {
    cover.style.display = "none";
    board = [
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '']
    ];
    playersCounter = 0;
    circles.forEach((ele) => {
        if (ele.classList.contains("player1")) ele.classList.remove("player1");
        if (ele.classList.contains("player2")) ele.classList.remove("player2");
        if (ele.classList.contains("winner")) ele.classList.remove("winner");
    })
}