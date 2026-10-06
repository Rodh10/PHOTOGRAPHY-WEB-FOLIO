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











/* =========================
   DISPARITION AU SCROLL
   ========================= */

const infoBlocks = document.querySelectorAll(".info-block");

window.addEventListener("wheel", (event) => {

    if (event.deltaY <= 0) return;

    infoBlocks.forEach((block, index) => {

        const title = block.querySelector("h2");
        const paragraph = block.querySelector("p");


        /* =========================
           TITRE
           ========================= */

        setTimeout(() => {

            title.querySelector("span").style.transform =
                "translateY(-100%)";

        }, index * 80);


        /* =========================
           PARAGRAPHE
           ========================= */

        setTimeout(() => {

            paragraph.querySelector("span").style.transform =
                "translateY(-100%)";

            const move = -paragraph.offsetHeight;

            paragraph.style.setProperty("--move", `${move}px`);

        }, 150 + index * 80);

    });

});







/* =========================
   APPARITION DES DESCRIPTIONS
   ========================= */

const descriptions =
    document.querySelectorAll(".description-grid p");

function showDescriptions() {

    descriptions.forEach((paragraph, index) => {

        setTimeout(() => {

            paragraph.querySelector("span").style.transform =
                "translateY(0)";

        }, index * 80);

    });

}





const photos =
    document.querySelectorAll(".photo-grid .image-item img");



function showPhotos() {

    photos.forEach((image, index) => {

        setTimeout(() => {

            image.style.transform =
                "translateY(0)";

        }, index * 80);

    });

}











/* =========================
   RATIOS ALÉATOIRES DES IMAGES
   ========================= */

const imageBlocks = document.querySelectorAll(".image-block");
const imageTitles =document.querySelectorAll(".image-block h3");

imageBlocks.forEach(block => {

    const image =
        block.querySelector("img");


    /* =========================
       LARGEUR DE L'IMAGE
       ========================= */

    const imageWidth =
        block.getBoundingClientRect().width * 0.6;

    image.style.width =
        `${imageWidth}px`;


    /* =========================
       HAUTEUR ORIGINELLE
       ========================= */

    const originalHeight =
        imageWidth *
        (image.naturalHeight / image.naturalWidth);


    block.dataset.originalHeight =
        originalHeight;


    /* =========================
       RATIO ALÉATOIRE
       ========================= */

    const ratios = [
        16 / 9,
        4 / 3,
        3 / 2,
        5 / 4,
    ];

    const ratio =
        ratios[Math.floor(Math.random() * ratios.length)];


    block.dataset.ratio =
        ratio;


    /* =========================
       HAUTEUR CROPÉE
       ========================= */

    const croppedHeight =
        imageWidth * ratio;


    block.dataset.croppedHeight =
        croppedHeight;


    /* =========================
       TAILLE INITIALE VISIBLE
       ========================= */

    image.style.height =
        `${Math.min(originalHeight, croppedHeight)}px`;

});

/* =========================
   ANIMATION DES IMAGES AU SCROLL
   ========================= */

let imagesAnimated = false;
let imageAnimationFinished = false;
let imagesDisappeared = false;


window.addEventListener("wheel", (event) => {

    if (event.deltaY <= 0) return;


    /* =========================
       DEUXIÈME SCROLL
       DISPARITION DES IMAGES
       ========================= */

    if (
        imagesAnimated &&
        imageAnimationFinished &&
        !imagesDisappeared
    ) {

        imagesDisappeared = true;

        imageBlocks.forEach((block, index) => {

            const image =
                block.querySelector("img");

            const matrix =
                new DOMMatrix(
                    getComputedStyle(image).transform
                );

            const currentY =
                matrix.m42;

            setTimeout(() => {

                image.style.transform =
                    `translateY(${currentY - window.innerHeight}px)`;

            }, index * 50);

        });


        /* =========================
        DISPARITION DES DESCRIPTIONS
        ========================= */

        descriptions.forEach((paragraph, index) => {

            const span =
                paragraph.querySelector("span");

            setTimeout(() => {

                span.style.transform =
                    "translateY(-100%)";

            }, index * 80);

        });
        

        /* =========================
        DÉPLACEMENT DES TITRES
        ========================= */

        const titleMoves = [0, 300, 200, 100];

        /* PHASE 1 — déplacement horizontal */

        setTimeout(() => {

            imageTitles.forEach((title, index) => {

                if (index === 0) return;

                setTimeout(() => {

                    title.style.transform =
                        `translateX(${titleMoves[index]}px)`;

                }, index * 80);

            });

        }, 100);


        /* PHASE 2 — remontée vers le haut */

        setTimeout(() => {

            imageTitles.forEach((title, index) => {

                title.style.transform =
                    `translate(${titleMoves[index]}px, -450px)`;

                title.style.zIndex = "15";

            });

        }, 500);


        setTimeout(() => {
            showPhotos();
        }, 500);
        
        return;
    }


    /* =========================
       PREMIER SCROLL
       ========================= */

    if (imagesAnimated) return;

    imagesAnimated = true;


    imageBlocks.forEach((block, index) => {

        const image =
            block.querySelector("img");


        /* =========================
           HAUTEUR CROPPÉE
           ========================= */

        const croppedHeight =
            parseFloat(
                block.dataset.croppedHeight
            );


        /* =========================
           HAUTEUR ORIGINELLE
           ========================= */

        const originalHeight =
            parseFloat(
                block.dataset.originalHeight
            );


        /* =========================
           DÉPART
           ========================= */

        image.style.height =
            `${Math.min(
                originalHeight,
                croppedHeight
            )}px`;


        /* =========================
           PHASE 1
           L'IMAGE REGAGNE SA HAUTEUR
           ========================= */

        setTimeout(() => {

            image.style.height =
                `${originalHeight}px`;


            /* =========================
               PHASE 2
               DÉPLACEMENT VERS LE HAUT
               ========================= */

            setTimeout(() => {

                image.style.transform =
                    "translateY(-300px)";

            }, 50);

        }, index * 50);

    });


    /* =========================
       ATTEND QUE TOUTES LES IMAGES
       AIENT FINI LEUR DÉPLACEMENT
       ========================= */

    const totalDelay =
        (imageBlocks.length - 1) * 100
        + 500;


    setTimeout(() => {


        /* =========================
           REPÈRE LE TOP COMMUN
           ========================= */

        const tops =
            [...imageBlocks].map(block => {

                const image =
                    block.querySelector("img");

                return image.getBoundingClientRect().top;

            });


        const targetTop =
            Math.min(...tops);


        /* =========================
           PHASE 3
           RÉDUCTION À LA HAUTEUR
           CROPPÉE
           ========================= */

        imageBlocks.forEach(block => {

            const image =
                block.querySelector("img");


            const croppedHeight =
                parseFloat(
                    block.dataset.croppedHeight
                );


            image.style.height =
                `${croppedHeight}px`;

        });


        /* =========================
           PHASE 4
           ATTEND QUE LA RÉDUCTION
           SOIT TERMINÉE
           ========================= */

        setTimeout(() => {


            /* =========================
               TOUTES LES IMAGES
               VERS LE MÊME TOP
               ========================= */

            imageBlocks.forEach(block => {

                const image =
                    block.querySelector("img");

                const currentTop =
                    image.getBoundingClientRect().top;

                const difference =
                    targetTop - currentTop;

                const currentTransform =
                    image.getBoundingClientRect().top
                    - currentTop
                    - 300
                    + difference;

                image.style.transform =
                    `translateY(${currentTransform}px)`;

            });

            imageAnimationFinished = true;

        }, 700);

    }, totalDelay);


    setTimeout(() => {
        showDescriptions();
    }, 500);

});


