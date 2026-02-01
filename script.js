

// initialize stats
const maxStats = 100;
let hunger, happiness, energy, health = 100;
let money = 0;

const cat = document.getElementById("cat");
const healthBar = document.getElementById("health-bar");
const hungerBar = document.getElementById("hunger-bar");
const energyBar = document.getElementById("energy-bar");

const feedBtn = document.getElementById("feed");
const playBtn = document.getElementById("play");
const sleepBtn = document.getElementById("sleep");

let isSleeping = false;
let currentTimeout = null;
let isLocked = false; 
// gifs for different cat states
const catGifs = {
    happy: "imgs/HappyCat.gif",
    sleeping: "imgs/CatSleep.gif",
    eating: "imgs/CatEat.gif",
    meowing: "imgs/MeowCat.gif",
    cute: "imgs/CuteCat.gif",
    dead: "imgs/DeadCat.gif"
}
// gotta keep track of how long these gifs last for proper animation
const gifDuration = {
    sleeping: 2500,
    eating: 6200,
    cute: 3250,
    happy: 3000,
    dead: 400,
    meowing: 3000
}

function updateBar(barStats, bar) {
    const percentage = ((barStats/maxStats) * 100);
    bar.style.width = percentage + "%";

    if (percentage < 25) {
        bar.style.backgroundColor = "firebrick";
    } else if (percentage < 50) {
        bar.style.backgroundColor = "goldenrod";
    }  else {
        bar.style.backgroundColor = "#4CAF50";
    }
}

function changeImage(action) {
    if (isLocked) return;
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    cat.src = catGifs[action];

    if (action == "eating" || action == "cute") {
        // imma keep it as happy, but will change based on bar stats
        isLocked = true;
        setTimeout(() => {
            isLocked = false;
            cat.src = catGifs.happy;
        }, gifDuration[action]);
        
    } else {
        return;
    }
}

feedBtn.onclick = function() {
    changeImage("eating");
}

playBtn.onclick = function() {
    changeImage("cute");
}




hunger = 30;
updateBar(hunger, hungerBar);









