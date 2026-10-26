
import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


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

    if (!photoGrid) return;

    const limitTop = 150;

    const gridTop =
        photoGrid.getBoundingClientRect().top;

    const moveY =
        limitTop - gridTop;

    photoGrid.style.transform =
        `translateY(${moveY}px)`;

    photos.forEach((image, index) => {

        // Photos invisibles avant leur tour.
        image.style.opacity = "0";

        setTimeout(() => {

            // Active l'affichage de la photo.
            image.style.opacity = "1";

            image.style.visibility = "visible";

            image.style.transform =
                "translateY(0)";

            // Conserve les numéros affichés.
            photoNumbers[index].style.transform =
                "translateY(0)";

        }, (photos.length - 1 - index) * 40);

    });

}




/* =========================
   PHOTO LOOP — THREE.JS
   Cycle strict en 5 étapes
   ========================= */

let photoLoopStarted = false;

function startPhotoLoop() {

    if (photoLoopStarted) return;

    const photoGrid = document.querySelector(".photo-grid");

    if (!photoGrid) return;

    const items = [
        ...photoGrid.querySelectorAll(".image-item")
    ];

    if (!items.length) return;

    photoLoopStarted = true;

    const duration = 60;
    const pauseDuration = 10000;
    const activationDelay = 20;

    const activeScale = 4;
    const activeTop = 170;
    const numberTop = 120;
    const activeLeft = 1050;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(
        0,
        window.innerWidth,
        0,
        window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    Object.assign(renderer.domElement.style, {
        position: "fixed",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "900"
    });

    document.body.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const photos = [];

    let rows = [];
    let slotRows = [];
    let cycleRunning = false;

    /* =========================
       OUTILS DE POSITION
       ========================= */

    function getRect(element) {
        return element.getBoundingClientRect();
    }

    function getCenter(rect) {
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }



    function setPosition(photo, x, y) {

        photo.mesh.position.x = x;
        photo.mesh.position.y = y;

        const dx = x - photo.home.x;
        const dy = y - photo.home.y;

        // Déplace le numéro.
        photo.number.style.transform =
            `translate(${dx}px, ${dy}px)`;

        // Déplace aussi l'image HTML.
        photo.image.style.transform =
            `translate(${dx}px, ${dy}px)`;
    }



    function setOpacity(photo, opacity) {
        photo.mesh.material.opacity = opacity;
    }

    function wait(time) {
        return new Promise(resolve =>
            setTimeout(resolve, time)
        );
    }

    /* =========================
       ANIMATION THREE.JS
       ========================= */


    function animate(time, update) {

        return new Promise(resolve => {

            const start = performance.now();

            function frame(now) {

                const progress = Math.min(
                    (now - start) / time,
                    1
                );

            const eased =
                progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                // Animation existante de Three.js.
                update(eased, progress);

                // Synchronisation des images HTML.
                photos.forEach(photo => {

                    const dx =
                        photo.mesh.position.x - photo.home.x;

                    const dy =
                        photo.mesh.position.y - photo.home.y;

                    const scaleX =
                        photo.mesh.scale.x / photo.home.width;

                    const scaleY =
                        photo.mesh.scale.y / photo.home.height;

                    photo.image.style.transform =
                        `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;

                });

                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(frame);
        });
    }


    function movePhoto(photo, target, time = duration) {

        const startX = photo.mesh.position.x;
        const startY = photo.mesh.position.y;

        return animate(time, progress => {

            setPosition(
                photo,
                startX + (target.x - startX) * progress,
                startY + (target.y - startY) * progress
            );
        });
    }

    /* =========================
       CHARGEMENT DES PHOTOS
       ========================= */

    const loadPromises = items.map(item => {

        const image = item.querySelector("img");
        const number = item.querySelector("h1");

        if (!image || !number) {
            return Promise.resolve();
        }

        return new Promise(resolve => {

            loader.load(
                image.currentSrc || image.src,

                texture => {

                    texture.colorSpace = THREE.SRGBColorSpace;

                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        opacity: 1,
                        depthTest: false,
                        depthWrite: false
                    });

                    const mesh = new THREE.Mesh(
                        new THREE.PlaneGeometry(1, 1),
                        material
                    );

                    mesh.renderOrder = 1;

                    scene.add(mesh);

                    const rect = getRect(image);
                    const center = getCenter(rect);
                    const numberRect = getRect(number);

                    mesh.position.set(
                        center.x,
                        center.y,
                        1
                    );

                    mesh.scale.set(
                        rect.width,
                        rect.height,
                        1
                    );

                    const photo = {
                        item,
                        image,
                        number,
                        mesh,
                        texture,

                        home: {
                            x: center.x,
                            y: center.y,
                            width: rect.width,
                            height: rect.height
                        },

                        numberHome: {
                            left: numberRect.left,
                            top: numberRect.top,
                            width: numberRect.width,
                            height: numberRect.height
                        },

                        active: false
                    };

                    photos.push(photo);

                    resolve();
                },

                undefined,

                () => {
                    // En cas d'erreur, l'image HTML reste visible.
                    image.style.visibility = "visible";
                    resolve();
                }
            );
        });
    });

    /* =========================
       RENDU
       ========================= */

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    /* =========================
       IDENTIFICATION DES LIGNES
       ========================= */

    function identifyRows() {

        const sorted = [...photos].sort((a, b) => {

            const rectA = getRect(a.image);
            const rectB = getRect(b.image);

            return rectA.top - rectB.top ||
                   rectA.left - rectB.left;
        });

        const grouped = [];

        sorted.forEach(photo => {

            const rect = getRect(photo.image);

            let row = grouped.find(group =>
                Math.abs(group.top - rect.top) < 20
            );

            if (!row) {
                row = {
                    top: rect.top,
                    photos: []
                };

                grouped.push(row);
            }

            row.photos.push(photo);
        });

        grouped.forEach(row => {

            row.photos.sort((a, b) =>
                getRect(a.image).left -
                getRect(b.image).left
            );
        });

        grouped.sort((a, b) => a.top - b.top);

        rows = grouped.map(row => row.photos);
    }

    /* =========================
       PHOTO ACTIVE
       ========================= */

    async function activatePhoto(photo, returnSlot) {

        photo.active = true;

        const startX = photo.mesh.position.x;
        const startY = photo.mesh.position.y;

        const startWidth = photo.mesh.scale.x;
        const startHeight = photo.mesh.scale.y;

        const targetWidth =
            photo.home.width * activeScale;

        const targetHeight =
            photo.home.height * activeScale;

        const targetX =
            activeLeft + targetWidth / 2;

        const targetY =
            activeTop + targetHeight / 2;

        photo.mesh.renderOrder = 10;
        photo.number.style.zIndex = "50";
        photo.number.style.transition = "none";

        const numberDX =
            activeLeft -
            photo.numberHome.left +
            photo.numberHome.width * (activeScale - 1) / 2;

        const numberDY =
            numberTop -
            photo.numberHome.top +
            photo.numberHome.height * (activeScale - 1) / 2;

        photo.number.style.transform =
            `translate(${numberDX}px, ${numberDY}px) scale(${activeScale})`;

        // Agrandissement
        await animate(duration, progress => {

            photo.mesh.position.x =
                startX + (targetX - startX) * progress;

            photo.mesh.position.y =
                startY + (targetY - startY) * progress;

            photo.mesh.scale.x =
                startWidth +
                (targetWidth - startWidth) * progress;

            photo.mesh.scale.y =
                startHeight +
                (targetHeight - startHeight) * progress;
        });

        // Pause
        await wait(pauseDuration);

        // Retour à son nouvel emplacement
        await animate(duration, progress => {

            photo.mesh.position.x =
                targetX +
                (returnSlot.x - targetX) * progress;

            photo.mesh.position.y =
                targetY +
                (returnSlot.y - targetY) * progress;

            photo.mesh.scale.x =
                targetWidth +
                (photo.home.width - targetWidth) * progress;

            photo.mesh.scale.y =
                targetHeight +
                (photo.home.height - targetHeight) * progress;
        });

        photo.active = false;
        photo.mesh.renderOrder = 1;

        photo.number.style.zIndex = "";
        photo.number.style.transition = "none";

        setPosition(
            photo,
            returnSlot.x,
            returnSlot.y
        );
    }

    /* =========================
       CYCLE EN 5 ÉTAPES
       ========================= */

    async function runCycle() {

        if (cycleRunning || rows.length < 2) return;

        cycleRunning = true;

        const upperRow = rows[0];
        const lowerRow = rows[1];

        if (!upperRow.length || !lowerRow.length) {
            cycleRunning = false;
            return;
        }

        const upperSlots = slotRows[0];
        const lowerSlots = slotRows[1];

        const exitingPhoto = lowerRow[0];

        /* =========================
           1. LIGNE INFÉRIEURE
           Déplacement de droite à gauche
           ========================= */

        for (let i = lowerRow.length - 1; i >= 1; i--) {

            await movePhoto(
                lowerRow[i],
                lowerSlots[i - 1]
            );

            await wait(activationDelay);
        }

        await movePhoto(exitingPhoto, {
            x: lowerSlots[0].x - exitingPhoto.home.width,
            y: lowerSlots[0].y
        });

        /* =========================
           2. DISPARITION INSTANTANÉE
           ========================= */

        setOpacity(exitingPhoto, 0);

        /* =========================
           3. RÉAPPARITION À DROITE
           DE LA LIGNE SUPÉRIEURE
           ========================= */

        const lastUpperSlot =
            upperSlots[upperSlots.length - 1];

        setPosition(
            exitingPhoto,
            lastUpperSlot.x,
            lastUpperSlot.y
        );

        exitingPhoto.mesh.scale.set(
            exitingPhoto.home.width,
            exitingPhoto.home.height,
            1
        );

        exitingPhoto.mesh.position.z = 5;
        exitingPhoto.mesh.renderOrder = 5;

        setOpacity(exitingPhoto, 1);

        await wait(duration);

        /* =========================
           4. LIGNE SUPÉRIEURE
           Déplacement de droite à gauche
           ========================= */

        for (let i = upperRow.length - 1; i >= 1; i--) {

            await movePhoto(
                upperRow[i],
                upperSlots[i - 1]
            );

            await wait(activationDelay);
        }

        const upperExit = upperRow[0];

        await movePhoto(upperExit, {
            x: upperSlots[0].x - upperExit.home.width,
            y: upperSlots[0].y
        });

        /* =========================
           5. PHOTO ACTIVE
           ========================= */

        setOpacity(upperExit, 1);

        const returnSlot =
            lowerSlots[lowerSlots.length - 1];

        await activatePhoto(upperExit, returnSlot);

        /* =========================
           ROTATION LOGIQUE
           ========================= */

        rows = [
            upperRow.slice(1).concat(exitingPhoto),
            lowerRow.slice(1).concat(upperExit)
        ];

        // Toutes les photos reprennent une profondeur normale.
        photos.forEach(photo => {

            setOpacity(photo, 1);

            photo.mesh.position.z = 1;
            photo.mesh.renderOrder = 1;
        });

        cycleRunning = false;

        setTimeout(runCycle, duration);
    }

    /* =========================
       DÉMARRAGE
       ========================= */


    Promise.all(loadPromises).then(() => {

        identifyRows();

        if (rows.length < 2) {
            photoLoopStarted = false;
            return;
        }

        slotRows = rows.map(row =>
            row.map(photo => ({
                x: photo.home.x,
                y: photo.home.y
            }))
        );

        // Affiche les photos Three.js.
        render();

        // Attend que le navigateur ait rendu le canvas.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {



                // Lance le cycle.
                setTimeout(runCycle, 1000);
            });
        });
    });


    /* =========================
       REDIMENSIONNEMENT
       ========================= */

    window.addEventListener("resize", () => {

        camera.left = 0;
        camera.right = window.innerWidth;
        camera.top = 0;
        camera.bottom = window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
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









