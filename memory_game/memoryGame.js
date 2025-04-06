let wrongTries = document.querySelector(".captions .currentTries span");
let bestTry = document.querySelector(".best span");
let cardsContainer = document.querySelector(".cards-container");
let restart = document.querySelector(".reset")
let wrongTriesCounter = 0;
let clickedCounter = 0;
let cardClickable = false;
let attributeName = "data-type";
var allCards;
let compare;
let typeArr = [
    ["fa-solid", "fa-chess-king", "king"],
    ["fa-solid", "fa-droplet", "droplet"],
    ["fa-solid", "fa-terminal", "terminal"],
    ["fa-solid", "fa-skull-crossbones", "crossbones"],
    ["fa-solid", "fa-meteor", "meteor"],
    ["fa-solid", "fa-dragon", "dragon"],
    ["fa-solid", "fa-poop", "poop"],
    ["fa-solid", "fa-user-astronaut", "astronaut"],
    ["fa-solid", "fa-meteor", "meteor"],
    ["fa-solid", "fa-dragon", "dragon"],
    ["fa-solid", "fa-terminal", "terminal"],
    ["fa-solid", "fa-chess-king", "king"],
    ["fa-solid", "fa-droplet", "droplet"],
    ["fa-solid", "fa-skull-crossbones", "crossbones"],
    ["fa-solid", "fa-poop", "poop"],
    ["fa-solid", "fa-user-astronaut", "astronaut"]
];

//putting best score of try of all time in the page
if (window.localStorage.getItem("besto"))bestTry.innerHTML = window.localStorage.getItem("besto"); 
else window.localStorage.setItem("besto", 2);

function reset() {
    location.reload();
}

function randomCreation() {
    //let subArr = typeArr;    //this consider as a shallow copy so when u delete/modify something in subArr, typeArr also wll be deleted/modified
    let subArr = typeArr.slice();
    console.log(`original array before loop ${typeArr}`);
    console.log(`copied array  before loop ${subArr}`);
    let repetion = typeArr.length;
    for (let i = 0; i < repetion; i++) {
        //creation of card (father)
        let card = document.createElement("div");
        card.classList.add("card");
        //creation and append of front div and it's i (?)
        let frontDiv = document.createElement("div");
        frontDiv.classList.add("front"); 
        let iFront = document.createElement("i");
        iFront.classList.add("fa-solid", "fa-question");
        frontDiv.appendChild(iFront);
        //creation and append of back div and it's i (random)
        let backDiv = document.createElement("div");
        backDiv.classList.add("back");
        let randomNumber = Math.floor((Math.random() * subArr.length));
        let iBack = document.createElement("i");
        iBack.classList.add(subArr[randomNumber][0], subArr[randomNumber][1]);
        card.setAttribute(attributeName, subArr[randomNumber][2]);
        subArr.splice(randomNumber, 1);
        backDiv.appendChild(iBack);
        //append backDiv & frontDiv in card
        card.appendChild(frontDiv);
        card.appendChild(backDiv);
        card.classList.add("active");               //they will be created already active
        cardsContainer.appendChild(card);
    }
    console.log(`original array after loop ${typeArr}`);
    console.log(`copied array  after loop ${subArr}`);
    allCards = document.querySelectorAll(".card");
    hideAllCards();
}

function hideAllCards() {
    setTimeout(() => {
        allCards.forEach((ele) => {
            ele.classList.remove("active");
        });
    }, 2000)
    cardClickable = true;
}

// Call randomCreation before trying to use allCards
randomCreation();

console.log(allCards)
allCards.forEach((ele) => {
    ele.addEventListener("click", function () {
        console.log(this)
        cardClick(this);
    });
});

function cardClick(t) {
    if(cardClickable && (t.classList.contains("active") === false)) {
        clickedCounter += 1;
        showingClickedCard(clickedCounter, t);
    }
}

function showingClickedCard(c, t) {
    if (c === 1) {
        t.classList.add("active");
        compare = t.dataset.type;
        cardClickable = true;
    } else {
        cardClickable = false;
        t.classList.add("active");
        if (compare != t.dataset.type) {
            //in html change wrongTriesCounter
            wrongTriesCounter += 1;
            setTimeout(() => {
                wrongTries.innerHTML = wrongTriesCounter;
                // remove active class from both selected cards
                document.querySelectorAll(`.active[data-type="${compare}"]`)[0].classList.remove("active");
                t.classList.remove("active");
                cardClickable = true;
            }, 750)
        } else {
            cardClickable = true;
            if (checkingend()) {
                let x = wrongTriesCounter < window.localStorage.getItem("besto") ? wrongTriesCounter : window.localStorage.getItem("besto")
                window.localStorage.setItem("besto", x);
            }
        }
        clickedCounter = 0;
    }
}

function checkingend() {
    let finish = true;
    allCards.forEach((ele) => {
        if (!ele.classList.contains("active")) {
            finish = false;
        }
    });
    return finish;
}

restart.addEventListener("click", reset);
