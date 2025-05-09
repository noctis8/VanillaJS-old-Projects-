let workMinutesValue = document.querySelector(".workMins");
let workSecondesValue = document.querySelector(".workSecs");
let breakMinutesValue = document.querySelector(".breakMins");
let breakSecondesValue = document.querySelector(".breakSecs");
let secondSection = document.querySelector(".countDown");  //for changing the background
let caption = document.querySelector(".caption h3");
let secs = document.querySelector(".secondesCountDown");
let verule = document.querySelector(".vergule");
let mins = document.querySelector(".minutesCountDown");
let remainingTime = document.querySelector(".remaining");
let toUpButton = document.querySelector(".toUp");
let totalSecondes = 0;
let secondesPassedCounter = 0;
let countdown1, countdown2;
let arrowClickable = true; // Variable to track arrow clickability
const notificationSound = new Audio('service-bell_daniel_simion.mp3');
//related to the alert
let alerto = document.querySelector(".alertContent");
let allAfterAlert = document.querySelectorAll(".alertContent ~ *");
let alertClose = document.querySelector(".alertContent .infos .close");
let repeatButton = document.querySelector(".repeat");

// move to the top of the page for every reload
function scrollToTopOnReload() {
    // Temporarily remove the scroll prevention
    window.removeEventListener('scroll', preventScroll);
    setTimeout(() => {
        window.scrollTo(0, 0);      // lezmha tkoun inside the setTimeOut bch tekhdm sinon laa khater lzmk tet2kd enek na7it el scroll prevention 100% wmatejm tet2kd kounchi ithaa t7otha inside the setTime 
        // Re-enable the scroll prevention
        window.addEventListener('scroll', preventScroll);
    }, 10);
}

window.onload = scrollToTopOnReload;


function checkingInputsValues() {
    let returned = false;
    //for work only
    if (workMinutesValue.value !== "" && workSecondesValue.value !== ""  && 0 <= parseInt(workSecondesValue.value) && parseInt(workSecondesValue.value) < 60 
    && 0 <= parseInt(workMinutesValue.value) && window.scrollY <= window.innerHeight) {
        returned = true;
    }
    //for break only
    if (breakMinutesValue.value !== "" && breakSecondesValue.value !== ""  && 0 <= parseInt(breakMinutesValue.value) 
    && 0 <= parseInt(breakSecondesValue.value) && parseInt(breakSecondesValue.value) < 60 && window.scrollY > window.innerHeight && window.scrollY < 2 * window.innerHeight) {
        returned = true;
    }
    return returned
}

function showAlert() {
    alerto.style.top = `${(window.innerHeight / 2) + window.scrollY}px`;   //!important to know 
    alerto.style.transform = "translate(-50%, -50%) scale(1)";
    alerto.style.visibility = "visible";
    test = false;
    allAfterAlert.forEach((ele) => {
        ele.classList.add("hide");
    });
    // Add an event listener to close the alert when clicking outside of it wlzmha tkon baad el execution te3 el code eli fou9 heka alh hatineha f setTimeout khatr kn manhotouhech el nazla 3al i (eli normalement bch tjiblna el alert bch tet7sb hya el even.target eli sakret el alert) that will happens quickly so that's why we wanna avoid this case
    setTimeout(() => {
        document.addEventListener("click", clickOutsideAlert);
    }, 300)
}

alertClose.onclick = closeAlert;

function clickOutsideAlert(event) {
    // Close the alert if clicked outside of it
    if (alerto.style.visibility === "visible" && !alerto.contains(event.target) && !event.target.classList.contains("button")) {
        closeAlert();
    }
}

function closeAlert() {
    test = true;
    alerto.style.top = "0%";
    alerto.style.transform = "translate(-50%, -50%) scale(0.1)";
    alerto.style.visibility = "hidden";
    allAfterAlert.forEach((ele) => {
        ele.classList.remove("hide");
    });
    document.removeEventListener("click", clickOutsideAlert);
}

function toDown(amplitude) {
    if(checkingInputsValues()) {
        // adding 0 to the right if the length of the value equal to 1
        if (workSecondesValue.value.length == 1) workSecondesValue.value = "0" + workSecondesValue.value;
        if (breakSecondesValue.value.length == 1) breakSecondesValue.value = "0" + breakSecondesValue.value;
        if (workMinutesValue.value.length == 1) workMinutesValue.value = "0" + workMinutesValue.value;
        if (breakMinutesValue.value.length == 1) breakMinutesValue.value = "0" + breakMinutesValue.value;
        window.scrollTo({
            top: window.innerHeight * amplitude,
            left: 0,
            behavior: 'smooth'
        });
        if (amplitude === 2.1) {
            Starting();
            arrowClickable = false; // Disable arrow click
        }
    } else showAlert()
}

function toDownAndChoose() {
    toDown(1);
}

function toDownAndStart() {
    toDown(2.1);
}
function Starting() {
    caption.innerHTML = 'Start in';
    secondSection.style.backgroundColor = `rgb(60 60 60)`;
    verule.innerHTML = '';
    mins.innerHTML = '';
    remainingTime.style.width = "0%";
    secs.textContent = 3;
    let counter = parseInt(secs.textContent);
    countdown1 = setInterval(() => {
        counter -= 1;
        secs.textContent = counter;
        if (counter === 0) {
            clearInterval(countdown1);
            Work();
        }
    }, 1000);
}

function Work() {
    secondSection.style.backgroundColor = `#2169f2`;
    toUpButton.style.visibility = "hidden";
    caption.innerHTML = 'WORK';
    verule.innerHTML = ' : ';
    secs.innerHTML = workSecondesValue.value;
    mins.innerHTML = workMinutesValue.value;
    countDown(parseInt(workSecondesValue.value), parseInt(workMinutesValue.value), "work");
}

function Break() {
    secondSection.style.backgroundColor = `#009688`;
    caption.innerHTML = 'BREAK';
    secs.innerHTML = breakSecondesValue.value;
    mins.innerHTML = breakMinutesValue.value;
    countDown(parseInt(breakSecondesValue.value), parseInt(breakMinutesValue.value), "break");
}

// Wait for the audio to be loaded before checking the duration
notificationSound.addEventListener('loadedmetadata', () => {
    audioDuration = notificationSound.duration;
});

function countDown(sec, min, context) {
    repeatButton.style.visibility = "hidden";
    toUpButton.style.visibility = "hidden";
    if (context === "work") totalSecondes = parseInt(workSecondesValue.value) + (parseInt(workMinutesValue.value) * 60);
    else totalSecondes = parseInt(breakSecondesValue.value) + (parseInt(breakMinutesValue.value) * 60);
    secondesPassedCounter = 0;
    remainingTime.style.width = "0%";
    countdown2 = setInterval(() => {
        secondesPassedCounter += 1
        remainingTime.style.width = `${(secondesPassedCounter / totalSecondes) * 100}%`;
        if (sec === 0 && min !== 0) {
            min -= 1;
            mins.innerHTML = min < 10 ? '0' + min : min;
            sec = 60;
        }
        if(sec > 0) {
            sec -= 1;
            secs.innerHTML = sec < 10 ? '0' + sec : sec;
        }
        if (min === 0 && sec === 0) {
            remainingTime.style.width = "100%";
            clearInterval(countdown2);
            // Delay sound effect for 0.5 second after the finishing of work
            if(context === "work") {
                setTimeout(() => {
                    notificationSound.play();
                }, 500);
                // Delay Break function for 3 second (untill the notificationSound finish)
                setTimeout(() => {
                    Break();
                }, audioDuration + 3000);
            } else {
                notificationSound.play();
                toUpButton.style.visibility = "visible";
                repeatButton.style.visibility = "visible";
                test = true;
            }
        }
    }, 1000);
}

let test = false;
window.addEventListener("scroll", () => {
    if (window.scrollY >= window.innerHeight - 20 && window.scrollY < 2 * window.innerHeight) {
        test = true;
        toUpButton.style.visibility = "visible";
    } else {
        test = false;
        toUpButton.style.visibility = "hidden";
    }
})

toUpButton.addEventListener("click", scrollToUp);
function scrollToUp() {
    repeatButton.style.visibility = "hidden";
    if (test) {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
}

// Function to block scroll event
function preventScroll(event) {
    event.preventDefault();
}
window.addEventListener('scroll', preventScroll);

repeatButton.onclick = Work;