

// initialize stats
const maxStats = 100;
let hunger = 100;
let happiness = 100;
let energy = 100;
let health = 100;
let money = 0;

const cat = document.getElementById("cat");
const healthBar = document.getElementById("health-bar");
const hungerBar = document.getElementById("hunger-bar");
const energyBar = document.getElementById("energy-bar");
const happyBar = document.getElementById("happiness-bar");
const feedBtn = document.getElementById("feed");
const playBtn = document.getElementById("play");
const sleepBtn = document.getElementById("sleep");

const moodText = document.getElementById("mood-text");

let isSleeping = false;
let isEating = false;
let isPlaying = false;
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
    sleeping: 3000,
    eating: 6150,
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
    if (isLocked && action != "sleep") return;

    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    cat.src = catGifs[action];
    cat.src = catGifs[action] + "?t=" + Date.now();


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

function updateHealth() {
    let change = 0;
    //hunger influence
    if (hunger < 5) {
        change -= 2;
        happiness = Math.max(0, happiness - 1);
    } else if (hunger < 15) {
        change -= 1;
    } else if (hunger < 30) {
        change -= 0.5;
    } else if (hunger >= 60 && hunger < 80) {
        change += 0.5;
    } else if (hunger >= 80) {
        change += 1;
    }
    //happiness influence
    if (happiness < 10) {
        change -= 1;
    } else if (happiness < 25) {
        change -= 0.5;
    } else if (happiness >= 60 && happiness < 80) {
        change += 0.5;
    } else if (happiness >= 80) {
        change += 1;
    }

    //energy influence
    if (energy < 5) {
        change -= 2;
        happiness = Math.max(0, happiness - 1);

    } else if (energy < 15) {
        change -= 1;
    } else if (energy < 25) {
        change -= 0.5;
    } else if (energy >= 60 && energy < 80) {
        change += 0.5;
    } else if (energy >= 80) {
        change += 1;
    }

    health = Math.max(0, Math.min(100, health + change));
}


let sleepInterval = null;

function getMood() {
    let tags = [];

    //hunger
    if (hunger < 15)  {
        tags.push("starving");
    } else if (hunger < 30) {
        tags.push("hungry");
    }

    //energy
    if (energy < 15 ) {
        tags.push("exhausted");
    } else if (energy < 25) {
        tags.push("sleepy");
    }

    //happiness
    if (happiness < 10) {
        tags.push("sad");
    } else if (happiness < 25) {
        tags.push("bored");
    }
    //main mood (based on overall wellbeing)
    const avg = (hunger + happiness + energy) / 3;

    let mainMood = "neutral";

    if (avg > 75) {
        mainMood = "happy";
    } else if (avg > 55) {
        mainMood = "content";
    } else if (avg < 35) {
        mainMood = "grumpy";
    }

    if (mainMood == "happy" && tags.length > 0) {
        mainMood = "content";
    }

    if (tags.length > 0) {
        return mainMood + " (" + tags.join(", ") + ")";
    }

    return mainMood;

}

function moodDisplay() {
    moodText.textContent = getMood();
}

function startSleep() {
    if (isSleeping) return;
    isSleeping = true;
    changeImage("sleeping");
    sleepBtn.innerText = "Wake";

    sleepInterval = setInterval(() => {
        energy = Math.min(100, energy + 1);
    }, 500);

    feedBtn.disabled = true;
    playBtn.disabled = true;


    if (energy >= 100) {
        stopSleep();
    }
}

function stopSleep() {
    if (!isSleeping) return;
    feedBtn.disabled = false;
    playBtn.disabled = false;
    isSleeping = false;
    clearInterval(sleepInterval);
    sleepInterval = null;
    changeImage("happy");
    sleepBtn.innerText = "Sleep";

}

const hungerInterval = setInterval(function() {
    if (hunger > 0) {
        hunger -= 1;
    }
}, 15000);

const happyInterval = setInterval(function() {
    if (happiness > 0) {
        happiness -= 1;
    }
}, 20000);

const energyInterval = setInterval(function() {
    if (energy > 0) {
        energy -= 1 ;
    }
}, 25000);

setInterval(() => {
    updateBar(happiness, happyBar);
    updateBar(energy, energyBar);
    updateBar(hunger, hungerBar);
    updateBar(health, healthBar);
    moodDisplay();
    console.log(health);
    if (energy >= 100) {
        stopSleep();
    }

}, 250);

let trackHealth = setInterval (() => {
    updateHealth();
}, 1000);

feedBtn.onclick = function() {
    if (isEating) return;
    if (hunger >= 100) return;
    playBtn.disabled = true;
    sleepBtn.disabled = true;
    isEating = true;
    changeImage("eating");
    hunger = Math.min(100, hunger + 25);
    setTimeout(() => {
        playBtn.disabled = false;
        sleepBtn.disabled = false;
        isEating = false;
    }, gifDuration.eating);
    
}

playBtn.onclick = function() {
    if (isPlaying) return;
    if (happiness >= 100) return;
    feedBtn.disabled = true;
    sleepBtn.disabled = true;
    isPlaying = true;
    changeImage("cute"); 
    happiness = Math.min(100, happiness + 25);
    energy = Math.max(0, energy - 10);
    hunger = Math.max(0, hunger - 10);
    setTimeout(() => {
        feedBtn.disabled = false;
        sleepBtn.disabled = false;
        isPlaying = false;
    }, gifDuration.cute);
    
};
sleepBtn.onclick = function() {
    if (!isSleeping) {
        startSleep();
    } else {
        stopSleep();
    }
    
}








