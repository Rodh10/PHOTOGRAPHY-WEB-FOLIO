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

descriptions.forEach(paragraph => {

    paragraph.querySelector("span").style.opacity = "0";

});


function showDescriptions() {

    descriptions.forEach((paragraph, index) => {

        setTimeout(() => {

            paragraph.querySelector("span").style.transform =
                "translateY(0)";

            paragraph.querySelector("span").style.opacity =
                "1";

        }, index * 80);

    });

}






/* =========================
   PROTECTION DES PHOTOS
   ========================= */



const photos =
    document.querySelectorAll(".photo-grid .image-item img");

const photoNumbers =
    document.querySelectorAll(".photo-grid .image-item h1");



photos.forEach(image => {

    image.addEventListener("contextmenu", e => {
        e.preventDefault();
    });

    image.addEventListener("dragstart", e => {
        e.preventDefault();
    });

});


/* =========================
   AFFICHAGE DES PHOTOS
   ========================= */


function showPhotos() {

    const photoGrid = document.querySelector(".photo-grid");

    const limitTop = 150;

    const gridTop =
        photoGrid.getBoundingClientRect().top;

    const moveY =
        limitTop - gridTop;

    photoGrid.style.transform =
        `translateY(${moveY}px)`;


    photos.forEach((image, index) => {

        setTimeout(() => {

            image.style.transform =
                "translateY(0)";

            photoNumbers[index].style.transform =
                "translateY(0)";

        }, index * 80);

    });

}




/* =========================
   BOUCLE DES PHOTOS
   ========================= */

let photoLoopStarted = false;

function startPhotoLoop() {

    if (photoLoopStarted) return;

    photoLoopStarted = true;

    const photoGrid =
        document.querySelector(".photo-grid");

    const items =
        [...photoGrid.querySelectorAll(".image-item")];

    const duration = 200;

    /* =========================
       PAUSE ENTRE LES CYCLES
       ========================= */

    const pauseDuration = 10000;

    /* =========================
       DÉCALAGE ENTRE LES IMAGES
       ========================= */

    const activationDelay = 40;

    /* =========================
       PHOTO ACTIVE
       ========================= */

    const activeScale = 4;

    /*
       TOP FIXE DE LA PHOTO ACTIVE
    */

    const activeTop = 170;

    /*
       TOP FIXE DU NUMÉRO ACTIF
    */

    const numberTop = 120;

    /*
    DÉCALAGE HORIZONTAL DES ÉLÉMENTS ACTIFS
    */

    const activeLeft = 950;

    function moveOnePhoto(index) {

        if (index <= 0) {

            const firstItem =
                items[0];

            const firstImage =
                firstItem.querySelector("img");

            const firstNumber =
                firstItem.querySelector("h1");


            /* =========================
               PREMIÈRE IMAGE QUI SORT
               ========================= */

            firstItem.style.transition =
                `transform ${duration}ms ms ease-out`;

            firstItem.style.transform =
                "translateX(-100%)";


            setTimeout(() => {

                /* =========================
                   001 PASSE À LA FIN
                   ========================= */

                items.shift();

                items.push(firstItem);

                items.forEach(item => {
                    photoGrid.appendChild(item);
                });


                /* =========================
                   RESET
                   ========================= */

                items.forEach(item => {

                    item.style.transition =
                        "none";

                    item.style.transform =
                        "translateX(0)";

                    item.style.opacity =
                        "1";

                });


                /* =========================
                   PHOTO ACTIVE
                   ========================= */

                firstItem.style.zIndex =
                    "50";

                firstImage.style.transition =
                    "none";

                firstNumber.style.transition =
                    "none";




                /* =========================
                IMAGE ACTIVE
                ========================= */

                const imageRect =
                    firstImage.getBoundingClientRect();

                const scaleCorrection =
                    (imageRect.height * (activeScale - 1)) / 2;

                const activeTranslateY =
                    activeTop -
                    imageRect.top +
                    scaleCorrection;

                const activeTranslateX =
                    activeLeft -
                    imageRect.left +
                    (imageRect.width * (activeScale - 1)) / 2;


                firstImage.style.transform =
                    `translate(
                        ${activeTranslateX}px,
                        ${activeTranslateY}px
                    )
                    scale(${activeScale})`;



                /* =========================
                NUMÉRO ACTIF
                ========================= */

                const numberRect =
                    firstNumber.getBoundingClientRect();

                const numberScaleCorrection =
                    (numberRect.height * (activeScale - 1)) / 2;

                const numberTranslateY =
                    numberTop -
                    numberRect.top +
                    numberScaleCorrection;

                const numberTranslateX =
                    activeLeft -
                    numberRect.left +
                    (numberRect.width * (activeScale - 1)) / 2;


                firstNumber.style.transform =
                    `translate(
                        ${numberTranslateX}px,
                        ${numberTranslateY}px
                    )
                    scale(${activeScale})`;


                /*
                   Pause pendant laquelle
                   la photo et son numéro
                   restent grands
                */

                setTimeout(() => {

                    /* =========================
                       PHOTO + NUMÉRO REPRENNENT
                       LEUR TAILLE NORMALE
                       ========================= */

                    firstImage.style.transition =
                        `transform ${duration}ms cubic-bezier(0.77, 0, 0.18, 1)`;

                    firstNumber.style.transition =
                        `transform ${duration}ms cubic-bezier(0.77, 0, 0.18, 1)`;


                    firstImage.style.transform =
                        "translate(0, 0) scale(1)";

                    firstNumber.style.transform =
                        "translate(0, 0) scale(1)";


                    setTimeout(() => {

                        firstImage.style.width =
                            "";

                        firstImage.style.height =
                            "";

                        firstImage.style.maxWidth =
                            "";

                        firstImage.style.maxHeight =
                            "";

                        firstImage.style.objectFit =
                            "";

                        firstItem.style.overflow =
                            "";

                        firstItem.style.zIndex =
                            "20";

                    }, duration);


                    /*
                       Petit délai pour laisser
                       la photo rejoindre le fil
                    */

                    setTimeout(() => {

                        moveOnePhoto(
                            items.length - 1
                        );

                    }, duration);

                }, pauseDuration);

            }, duration);

            return;
        }


        const currentItem =
            items[index];

        const previousItem =
            items[index - 1];


        /*
           La première image de la
           deuxième ligne correspond
           à l'index 8.
        */

        const isStartOfSecondRow =
            index === 8;


        /* =========================
           IMAGE ACTUELLE
           ========================= */

        if (isStartOfSecondRow) {

            currentItem.style.transition =
                `transform ${duration}ms cubic-bezier(0.77, 0, 0.18, 1),
                 opacity ${duration}ms ease`;

            currentItem.style.transform =
                "translateX(-100%)";

            currentItem.style.opacity =
                "0";

        } else {

            currentItem.style.transition =
                `transform ${duration}ms cubic-bezier(0.77, 0, 0.18, 1)`;

            currentItem.style.transform =
                "translateX(-100%)";

        }


        /* =========================
           IMAGE PRÉCÉDENTE
           ========================= */

        setTimeout(() => {

            previousItem.style.transition =
                `transform ${duration}ms cubic-bezier(0.77, 0, 0.18, 1)`;

            previousItem.style.transform =
                "translateX(-100%)";


            /* =========================
               PASSAGE 2e → 1re LIGNE
               ========================= */

            if (isStartOfSecondRow) {

                currentItem.style.transition =
                    "none";

                currentItem.style.transform =
                    "translateX(0)";

                currentItem.style.opacity =
                    "0";
            }


            /* =========================
               IMAGE SUIVANTE
               ========================= */

            moveOnePhoto(index - 1);

        }, activationDelay);

    }


    /* =========================
       PREMIER CYCLE
       ========================= */

    setTimeout(() => {

        moveOnePhoto(
            items.length - 1
        );

    }, 1000);

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


/* =========================
   DISPARITION DES IMAGES
   ========================= */

function disappearImages() {

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

}


/* =========================
   DISPARITION DES DESCRIPTIONS
   ========================= */

function disappearDescriptions() {

    descriptions.forEach((paragraph, index) => {

        const span =
            paragraph.querySelector("span");

        setTimeout(() => {

            span.style.transform =
                "translateY(-100%)";

        }, index * 80);

        setTimeout(() => {

            span.style.opacity =
                "0";

        }, index * 80 + 200);

    });

}


/* =========================
   DÉPLACEMENT HORIZONTAL
   DES TITRES
   ========================= */

function moveTitlesHorizontal() {

    const titleMoves = [0, 350, 230, 100];

    imageTitles.forEach((title, index) => {

        if (index === 0) return;

        setTimeout(() => {

            title.style.transform =
                `translateX(${titleMoves[index]}px)`;

        }, index * 80);

    });

}


/* =========================
   REMONTÉE DES TITRES
   ========================= */

function moveTitlesTop() {

    const titleMoves = [0, 350, 230, 100];
    const limitTop = 40;

    imageTitles.forEach((title, index) => {

        const titleTop =
            title.getBoundingClientRect().top;

        const moveY =
            limitTop - titleTop;

        title.style.transform =
            `translate(${titleMoves[index]}px, ${moveY}px)`;

        title.style.zIndex = "15";

    });

}



function animateTitles() {

    setTimeout(() => {

        moveTitlesHorizontal();

    }, 100);


    setTimeout(() => {

        moveTitlesTop();

    }, 500);

    setTimeout(() => {

        showPhotos();

        setTimeout(() => {

            startPhotoLoop();

        }, 3000);

    }, 700);

}


/* =========================
   PREMIÈRE PHASE DES IMAGES
   ========================= */

function animateImageStart() {

    imageBlocks.forEach((block, index) => {

        const image =
            block.querySelector("img");

        const croppedHeight =
            parseFloat(
                block.dataset.croppedHeight
            );

        const originalHeight =
            parseFloat(
                block.dataset.originalHeight
            );


        image.style.height =
            `${Math.min(
                originalHeight,
                croppedHeight
            )}px`;


        setTimeout(() => {

            image.style.height =
                `${originalHeight}px`;


            setTimeout(() => {

                image.style.transform =
                    "translateY(-300px)";

            }, 50);

        }, index * 50);

    });

}


/* =========================
   ALIGNEMENT DES IMAGES
   ========================= */

function alignImages() {

    const tops =
        [...imageBlocks].map(block => {

            const image =
                block.querySelector("img");

            return image.getBoundingClientRect().top;

        });


    const targetTop =
        Math.min(...tops);


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


    setTimeout(() => {

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

}


/* =========================
   ANIMATION COMPLÈTE
   DES IMAGES
   ========================= */

function animateImages() {

    animateImageStart();


    const totalDelay =
        (imageBlocks.length - 1) * 100
        + 500;


    setTimeout(() => {

        alignImages();

    }, totalDelay);

}


/* =========================
   PREMIER SCROLL
   ========================= */

function startImageAnimation() {

    imagesAnimated = true;

    animateImages();

    setTimeout(() => {

        showDescriptions();

    }, 500);

}


/* =========================
   DEUXIÈME SCROLL
   ========================= */

function disappearContent() {

    imagesDisappeared = true;

    disappearImages();

    disappearDescriptions();

    animateTitles();

}


/* =========================
   SCROLL
   ========================= */

window.addEventListener("wheel", (event) => {

    if (event.deltaY <= 0) return;


    /* =========================
       DEUXIÈME SCROLL
       ========================= */

    if (
        imagesAnimated &&
        imageAnimationFinished &&
        !imagesDisappeared
    ) {

        disappearContent();

        return;

    }


    /* =========================
       PREMIER SCROLL
       ========================= */

    if (imagesAnimated) return;

    startImageAnimation();

});









