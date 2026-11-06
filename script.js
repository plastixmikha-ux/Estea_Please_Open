const video = document.getElementById("gameVideo");
const bgm = document.getElementById("bgm");
const overlay = document.getElementById("overlay");

let gameStarted = false;
let incisionWaiting = false;
let incisionDone = false;
let currentOverlay = null;

video.autoplay = false;
video.pause();

overlay.classList.add("hidden");

function getVideoRect() {
    const rect = video.getBoundingClientRect();
    const videoRatio = video.videoWidth / video.videoHeight;
    const boxRatio = rect.width / rect.height;

    let width, height, left, top;

    if (boxRatio > videoRatio) {
        height = rect.height;
        width = height * videoRatio;
        left = rect.left + (rect.width - width) / 2;
        top = rect.top;
    } else {
        width = rect.width;
        height = width / videoRatio;
        left = rect.left;
        top = rect.top + (rect.height - height) / 2;
    }

    return { left, top, width, height };
}

function positionElement(element, x, y, width, height) {
    const rect = getVideoRect();

    element.style.left = `${rect.left + rect.width * x}px`;
    element.style.top = `${rect.top + rect.height * y}px`;
    element.style.width = `${rect.width * width}px`;
    element.style.height = `${rect.height * height}px`;
}

function clearOverlay() {
    if (currentOverlay) {
        currentOverlay.remove();
        currentOverlay = null;
    }

    overlay.classList.add("hidden");
}

function showStartButton() {
    overlay.classList.remove("hidden");

    const button = document.createElement("button");
    button.className = "game-start-button";
    button.textContent = "";

    overlay.appendChild(button);
    currentOverlay = button;

    function reposition() {
        positionElement(button, 0.35, 0.75, 0.30, 0.20);
    }

    reposition();
    window.addEventListener("resize", reposition);

    button.addEventListener("click", async () => {
        if (gameStarted) return;

        gameStarted = true;
        clearOverlay();

        bgm.volume = 0.35;
        bgm.currentTime = 0;

        try {
            await bgm.play();
        } catch (error) {
            console.log("BGM gagal diputar:", error);
        }

        video.play();
    });
}

function showIncision() {
    overlay.classList.remove("hidden");

    const area = document.createElement("div");
    area.className = "incision-overlay";

    area.innerHTML = `
        <div class="incision-guide"></div>
        <div class="incision-handle top"></div>
        <div class="incision-handle bottom"></div>
        <div class="incision-hint">DRAG DOWN</div>
    `;

    overlay.appendChild(area);
    currentOverlay = area;

    function reposition() {
        positionElement(area, 0.42, 0.56, 0.16, 0.27);
    }

    reposition();
    window.addEventListener("resize", reposition);

    let dragging = false;
    let startY = 0;

    area.addEventListener("pointerdown", (event) => {
        event.preventDefault();

        dragging = true;
        startY = event.clientY;

        area.setPointerCapture(event.pointerId);
        area.classList.add("dragging");
    });

    area.addEventListener("pointermove", (event) => {
        if (!dragging) return;

        const distance = event.clientY - startY;

        if (distance >= area.clientHeight * 0.60) {
            dragging = false;
            incisionDone = true;
            incisionWaiting = false;

            clearOverlay();
            video.play();
        }
    });

    area.addEventListener("pointerup", () => {
        dragging = false;
        area.classList.remove("dragging");
    });

    area.addEventListener("pointercancel", () => {
        dragging = false;
        area.classList.remove("dragging");
    });
}

// Tampilkan tombol saat video siap.
video.addEventListener("loadedmetadata", () => {
    video.currentTime = 0;
    video.pause();
    showStartButton();
});

// Pause saat mencapai adegan sayatan.
video.addEventListener("timeupdate", () => {
    if (!gameStarted || incisionDone || incisionWaiting) return;

    if (video.currentTime >= 4) {
        video.pause();
        incisionWaiting = true;
        showIncision();
    }
});

// Akhir permainan.
video.addEventListener("ended", () => {
    bgm.pause();
    bgm.currentTime = 0;
    clearOverlay();
});video.addEventListener("ended", () => {
    bgm.pause();
    bgm.currentTime = 0;
    clearOverlay();

    overlay.classList.remove("hidden");

    const card = document.createElement("div");
    card.className = "birthday-card";

    card.innerHTML = `
        <h1>HAPPY BIRTHDAY, ESTEAA! ❤️</h1>

        <p>
            You know, even though my talent is just as
            questionable as my gameplay in HOK,
            I still wanted to wish you a genuinely happy birthday.
        </p>

        <p>
            I hope this silly little greeting card makes you smile. 😏
        </p>

        <div class="final-wish">
            Happy Birthday, Esteaa! ❤️
        </div>
    `;

    overlay.appendChild(card);
});