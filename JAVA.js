const menuItems = document.querySelectorAll(".menu-item");


/* =========================
   CRÉATION DES LETTRES
   ========================= */

menuItems.forEach(item => {

    const text = item.textContent;

    item.textContent = "";

    [...text].forEach(letter => {

        const span = document.createElement("span");

        span.classList.add("menu-letter");
        span.textContent = letter;

        item.appendChild(span);
    });
});


/* =========================
   ROTATION ALÉATOIRE
   ========================= */

const letters = document.querySelectorAll(".menu-letter");

letters.forEach(letter => {

    // 25% de chance d'être renversée
    if (Math.random() < 0.25) {

        const rotations = [
            "90deg",
            "-90deg"
        ];

        const rotation =
            rotations[Math.floor(Math.random() * rotations.length)];

        letter.style.setProperty("--rotation", rotation);

    } else {

        letter.style.setProperty("--rotation", "0deg");
    }
});


/* =========================
   ANIMATION D'UNE LETTRE
   ========================= */

function glitchLetter(letter) {

    const rotation =
        letter.style.getPropertyValue("--rotation").trim();


    // Lettre normale
    if (rotation === "0deg") {

        const rotations = [
            "90deg",
            "-90deg"
        ];

        const glitchRotation =
            rotations[Math.floor(Math.random() * rotations.length)];

        letter.style.setProperty(
            "--glitch-rotation",
            glitchRotation
        );
    }


    // Lettre renversée
    else {

        // Animation inverse
        letter.style.setProperty(
            "--glitch-rotation",
            "0deg"
        );
    }


    // Relance l'animation
    letter.classList.remove("glitch");

    void letter.offsetWidth;

    letter.classList.add("glitch");
}


/* =========================
   VAGUE D'ANIMATIONS
   ========================= */

function glitchWave() {

    // Nombre aléatoire de lettres
    const amount =
        Math.floor(Math.random() * 5) + 3;

    const selected = [];


    // Sélection aléatoire sans doublon
    while (selected.length < amount) {

        const letter =
            letters[Math.floor(Math.random() * letters.length)];

        if (!selected.includes(letter)) {
            selected.push(letter);
        }
    }


    // Lance les animations avec de petits décalages
    selected.forEach((letter, index) => {

        const delay =
            Math.random() * 250 + index * 40;

        setTimeout(() => {
            glitchLetter(letter);
        }, delay);
    });


    // Prochaine vague entre 500ms et 2 secondes
    const nextWave =
        Math.random() * 1500 + 500;

    setTimeout(glitchWave, nextWave);
}


glitchWave();