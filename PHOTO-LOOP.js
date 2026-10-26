
/* =========================
   PHOTO LOOP — THREE.JS
   Affichage de 14 photos en 2 lignes
   Activation au troisième scroll
   ========================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class PhotoLoop {

    constructor() {
        this.container = document.querySelector(".photo-grid");

        if (!this.container) {
            throw new Error("PhotoLoop : .photo-grid introuvable.");
        }

        this.items = [];
        this.started = false;

        this.init();
    }


    /* =========================
       INITIALISATION
       ========================= */

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(
            0,
            window.innerWidth,
            0,
            window.innerHeight,
            0.1,
            100
        );

        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio || 1, 2)
        );

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        Object.assign(this.renderer.domElement.style, {
            position: "fixed",
            inset: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: "20"
        });

        document.body.appendChild(this.renderer.domElement);

        this.createPhotos();

        window.addEventListener("resize", () => {
            this.resize();
        });

        this.render();
    }


    /* =========================
       CRÉATION DES 14 PHOTOS
       ========================= */

    createPhotos() {
        const elements = [
            ...this.container.querySelectorAll(".image-item")
        ].slice(0, 14);

        elements.forEach(item => {
            const image = item.querySelector("img");
            const number = item.querySelector("h1");

            if (!image) return;

            const texture = new THREE.Texture(image);
            texture.colorSpace = THREE.SRGBColorSpace;

            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                depthTest: false
            });

            const geometry = new THREE.PlaneGeometry(1, 1);
            const mesh = new THREE.Mesh(geometry, material);

            mesh.renderOrder = 1;
            this.scene.add(mesh);

            if (image.complete && image.naturalWidth > 0) {
                texture.needsUpdate = true;
            } else {
                image.addEventListener("load", () => {
                    texture.needsUpdate = true;
                    this.layout();
                }, { once: true });
            }

            let numberMesh = null;

            if (number) {
                const canvas = document.createElement("canvas");
                canvas.width = 256;
                canvas.height = 64;

                const context = canvas.getContext("2d");
                context.fillStyle = "#fff";
                context.font = "22px monospace";
                context.textBaseline = "middle";

                context.fillText(
                    number.textContent.trim(),
                    0,
                    32
                );

                const numberTexture = new THREE.CanvasTexture(canvas);

                const numberMaterial = new THREE.MeshBasicMaterial({
                    map: numberTexture,
                    transparent: true,
                    depthTest: false
                });

                numberMesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(1, 1),
                    numberMaterial
                );

                numberMesh.renderOrder = 2;
                this.scene.add(numberMesh);

                number.style.visibility = "hidden";
            }

            image.style.visibility = "hidden";

            this.items.push({
                image,
                number,
                texture,
                mesh,
                numberMesh
            });
        });

        this.layout();
    }


    /* =========================
       DISPOSITION EN 2 LIGNES
       ========================= */

    layout() {
        if (!this.items.length) return;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const columns = 7;
        const rows = 2;

        const marginX = screenWidth * 0.08;
        const gapX = screenWidth * 0.015;
        const gapY = screenHeight * 0.04;

        const availableWidth =
            screenWidth - marginX * 2 - gapX * (columns - 1);

        const cellWidth = availableWidth / columns;
        const cellHeight = cellWidth * 0.7;

        const totalHeight = rows * cellHeight + gapY;
        const startY = (screenHeight - totalHeight) / 2;

        this.items.forEach((entry, index) => {
            const column = index % columns;
            const row = Math.floor(index / columns);

            const x = marginX + column * (cellWidth + gapX);
            const y = startY + row * (cellHeight + gapY);

            const image = entry.image;

            const imageWidth = image.naturalWidth || cellWidth;
            const imageHeight = image.naturalHeight || cellHeight;
            const ratio = imageWidth / imageHeight;

            let width = cellWidth;
            let height = width / ratio;

            if (height > cellHeight) {
                height = cellHeight;
                width = height * ratio;
            }

            entry.mesh.scale.set(width, height, 1);
            entry.mesh.position.set(
                x + cellWidth / 2,
                y + cellHeight / 2,
                0
            );

            if (entry.numberMesh) {
                entry.numberMesh.scale.set(70, 18, 1);
                entry.numberMesh.position.set(
                    x + 35,
                    y - 12,
                    0
                );
            }

            entry.mesh.visible = this.started;
            if (entry.numberMesh) {
                entry.numberMesh.visible = this.started;
            }
        });
    }


    /* =========================
       AFFICHAGE
       ========================= */

    start() {
        if (this.started) return;

        this.started = true;
        this.layout();
    }


    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.setSize(width, height);

        this.camera.left = 0;
        this.camera.right = width;
        this.camera.top = 0;
        this.camera.bottom = height;

        this.camera.updateProjectionMatrix();

        this.layout();
    }


    render() {
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(() => this.render());
    }
}


/* =========================
   PROTECTION DES PHOTOS
   ========================= */

document.addEventListener("contextmenu", event => {
    if (event.target.closest(".photo-grid img")) {
        event.preventDefault();
    }
});

document.addEventListener("dragstart", event => {
    if (event.target.closest(".photo-grid img")) {
        event.preventDefault();
    }
});


/* =========================
   ACTIVATION AU TROISIÈME SCROLL
   ========================= */

const photoLoop = new PhotoLoop();

let downwardScrollCount = 0;
let scrollGestureActive = false;
let scrollResetTimer = null;

function handlePhotoScroll(event) {
    if (event.deltaY <= 0) return;

    if (scrollGestureActive) {
        clearTimeout(scrollResetTimer);

        scrollResetTimer = setTimeout(() => {
            scrollGestureActive = false;
        }, 200);

        return;
    }

    scrollGestureActive = true;

    scrollResetTimer = setTimeout(() => {
        scrollGestureActive = false;
    }, 200);

    downwardScrollCount++;

    if (downwardScrollCount === 3) {
        window.removeEventListener("wheel", handlePhotoScroll);
        photoLoop.start();
    }
}

window.addEventListener("wheel", handlePhotoScroll, {
    passive: true
});

