const blocksContainer = document.querySelector(".game-blocks");

const gameBlocks = [...document.querySelectorAll(".game-block")];

const successAudio = document.getElementById("success");

const failureAudio = document.getElementById("failure");

const startBtn = document.getElementById("start-btn");

let duration = 1000;

let wrongTries = 0;

startBtn.addEventListener("click", function () {

    let name = prompt("What's Your Name?");

    if (name === null || name === "") name = "Unknown";

    const welcomeMsg = document.getElementById("welcome-msg");

    welcomeMsg.innerHTML = `Hello ${name.trim()}`;

    this.parentElement.remove();

});

gameBlocks.forEach((gameBlock, index) => {

    gameBlock.style.order = shuffle()[index];
    
    gameBlock.addEventListener("click", () => {

        flipBlock(gameBlock);

        const m = gameBlocks.filter(block => block.classList.contains("has-match"));

        if (m.length === 20) generate_results();

    });

});

shuffle();

function shuffle() {

    const indexes = [...gameBlocks.keys()];

    let current = gameBlocks.length;

    while (current > 0) {

        let randomIndex = Math.floor(Math.random() * current);

        current--;

        let tmp = indexes[current];

        indexes[current] = indexes[randomIndex];

        indexes[randomIndex] = tmp;

    }

    return indexes;

}

function flipBlock(selectBlock) {

    selectBlock.classList.add("flipped");

    let fbs = gameBlocks.filter(block => block.classList.contains("flipped"));

    if (fbs.length === 2) {

        stopClicking();

        checkMatchedBlocks(fbs[0], fbs[1]);

    }

}

function stopClicking() {

    blocksContainer.classList.add("no-click");

    window.setTimeout(() => blocksContainer.classList.remove("no-click"), duration);

}

function checkMatchedBlocks(flipBlock1, flipBlock2) {

    if (flipBlock1.dataset.tech === flipBlock2.dataset.tech) {

        flipBlock1.classList.remove("flipped");

        flipBlock2.classList.remove("flipped");

        flipBlock1.classList.add("has-match");

        flipBlock2.classList.add("has-match");

        successAudio.play();

    } else {

        generate_wrong_tries();

        failureAudio.play();

        window.setTimeout(() => {

            flipBlock1.classList.remove("flipped");

            flipBlock2.classList.remove("flipped");

        }, duration);

    }

}

function generate_wrong_tries() {

    const wrongTriesEl = document.getElementById("wrong-tries");

    wrongTries++;

    wrongTries = wrongTries < 10 ? `0${wrongTries}` : wrongTries;

    wrongTriesEl.innerHTML = `Wrong Tries: ${wrongTries}`

}

function generate_results() {

    const popup = document.createElement("popup");

    popup.className = "popup";

    let msg;

    if (wrongTries > 10) msg = `Bad, Your Wrong Tries Are ${wrongTries}`;

    else msg = `Good, Your Wrong Tries Are Just ${wrongTries}`;

    popup.appendChild(document.createTextNode(msg));

    let newGameBtn = document.createElement("span");

    newGameBtn.innerText = "Start New Game";

    newGameBtn.addEventListener("click", function() {

        wrongTries = -1;

        generate_wrong_tries();

        this.parentElement.remove();

        gameBlocks.forEach((gameBlock, index) => {

            gameBlock.classList.remove("has-match");
            
            gameBlock.style.order = shuffle()[index];

        });

    });

    popup.appendChild(newGameBtn);

    document.body.appendChild(popup);

}
