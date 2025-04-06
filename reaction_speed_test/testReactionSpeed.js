const waitToCLick = document.querySelector(".header .waitToClickPart");
const waitToCLickH1 = document.querySelector(".header .waitToClickPart h1");
const waitPart = document.querySelector(".header .waitPart");
const radomkPart = document.querySelector(".header .radomkPart");
const icon = document.querySelector(".header .waitToClickPart i");
const cap = document.querySelector(".header .waitToClickPart .caption");
const spans = document.querySelectorAll(".waitPart .dotsContainer span");
let arr = [];
let maxArrRepetition = [];
let staticCounter = 0;
let counter = 0;
const buttons = document.querySelector(".header .waitToClickPart .buttons");
const inp1 = document.querySelector(".header .waitToClickPart .buttons input:first-of-type");
const inp2 = document.querySelector(".header .waitToClickPart .buttons input:last-of-type");
const satatsContainer = document.querySelector(".stats");
const canvas = document.querySelector(".stats #myChart");
let maxRepetition = 3;

function changingBackGrounds(deleted, added) {
    deleted.classList.remove("hidden");
    added.classList.add("hidden");
}

waitToCLick.addEventListener("click", () => {
    // checking here fi u reached the last try or no if yes u must click on the retry button, u cannot replay the game in the normal way (use the button!)
    if (counter < maxRepetition) {
        changingBackGrounds(waitPart, waitToCLick)
        randomShow();
    }
})

function toggleLoadingAnimation(rand, pauseStatus) {
    if (pauseStatus === true) situation = "paused";
    else situation = "running";
    let delay = 0;
    spans.forEach((ele) => {
        ele.style.animation = `loading 1s ${delay} ${situation} alternate ${Math.ceil(rand)}`;
        delay +=  0.333;
    })
}

function randomShow() {
    cap.style.display = "block";
    cap.innerHTML = "click to keep going";
    // take a random duration between 1.00 to 7.00 seconds
    let rand = -1;
    while (!(rand >= 1 && rand <= 3)) {
        rand = Math.random() * 10;
    }
    toggleLoadingAnimation(rand, false);
    // checking if there's a click while the green part have not showed yet
    waitPart.onclick = () => {
        toggleLoadingAnimation(rand, true);
        changingBackGrounds(waitToCLick, waitPart);
        buttons.style.display = "none";
        icon.style.display = "none";
        waitToCLickH1.innerHTML = "Too Soon !";
        cap.innerHTML = "click to try again";
        clearTimeout(timeoutId);
        return;
    }
    // calculate the duration of the reaction and increment the try counter
    let timeoutId = setTimeout(() => {
        toggleLoadingAnimation(rand, true);
        counter++;
        changingBackGrounds(radomkPart, waitPart);
        startTime = Date.now();
        radomkPart.onclick = () => {
            endTime = Date.now();
            changingBackGrounds(waitToCLick, radomkPart)
            arr.push(endTime - startTime);
            if (counter < maxRepetition) {
                waitToCLickH1.innerHTML = endTime - startTime + " ms";
                icon.style.display = "block";
                buttons.style.display = "none";
            }
            else calculeAVG();
        }
    }, rand * 1000)
}

function calculeAVG() {
    let sum = 0;
    for (i of arr) {
        sum += i;
    }
    // pushing the arr in another array (maxArrRepetition) that we will use to create multiple charts at the same time
    staticCounter ++;
    if (staticCounter == 6) {       // 5 is the max number of charts allowed (u have 5 GrandTrys for each try there's maxRepetition try)
        maxArrRepetition = [];
        staticCounter = 1;
    }
    maxArrRepetition.push(arr);
    waitToCLickH1.innerHTML = "Average : " + Math.ceil(sum / maxRepetition) + " ms";
    editelements();
}

function editelements() {
    icon.style.display = "none";
    buttons.style.display = "block";
    cap.style.display = "none";
    waitToCLick.style.cursor = "default";
    inp1.onclick = (e) => {
        waitToCLick.style.cursor = "pointer";
        e.stopPropagation();
        counter = 0;
        arr = [];
        icon.style.display = "block";
        buttons.style.display = "none";
        waitToCLickH1.innerHTML = "test your reaction !";
        cap.style.display = "block";
        cap.innerHTML = "click to keep going";
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        })
    }
    inp2.onclick = () => {
        showStats();
        satatsContainer.style.marginTop = "28vh";
        satatsContainer.style.marginBottom = "10vh";
        window.scrollTo({
            top: window.innerHeight * 150,
            left: 0,
            behavior: "smooth",
        })
    }
}

function showStats() {
    canvas.style.marginInline = "0";
    const ctx = document.getElementById('myChart');
    let chartStatus = Chart.getChart("myChart"); // <canvas> id 
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    // puisque a7na bch nesn3o multiple charts (5 maximum) inside the datasets lzm ykon fama at least one obj yjm ykon 3/4.. so u need for loop, however 
    //u cannot create a for loop inside an object heka alh amlneha el bara ml obj el for loop baad sabina el objs in an array and this array bch yekhtho el datasets
    let datasetsArray = [];
    for (let i = 0; i < staticCounter; i++) {
        let obj = {
            label: ` reaction duration for chart ${i + 1}`,
            data: maxArrRepetition[i],
            borderWidth: 1,
            lineTension: 0,
        }
        datasetsArray.push(obj);
    }
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: maxRepetition }, (_, j) => j + 1),
            datasets: datasetsArray,
            },
            options: {
                plugins: {
                    legend: {
                        position: 'top',
                        title: {
                            display: true,
                            text: 'charts : ',
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMin: 0,
                        // max: 3000,
                        // ticks: {
                        //     stepSize: 300 
                        // }
                    }
                }
            }
        });
        canvas.style.marginInline = "auto";
}