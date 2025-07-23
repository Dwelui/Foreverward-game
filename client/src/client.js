import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector('#main-canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

/**
 * @param {THREE.WebGLRenderer} renderer
 *
 * @returns {boolean}
 */
function resizeRendererToDisplaySize(renderer) {
    const rendererCanvas = renderer.domElement;
    const needResize =
        rendererCanvas.width !== canvas.clientWidth ||
        rendererCanvas.height !== canvas.clientHeight
        ;

    if (needResize) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    }

    return needResize;
}

const fpsSamples = [];
const maxSamples = 60;

/**
 * @param {number} delta - should be in milliseconds.
 *
 * @returns {number}
 */
function calculateAvgFps(delta) {
    const fps = 1 / delta;
    fpsSamples.push(fps);

    if (fpsSamples.length > maxSamples) {
        fpsSamples.shift();
    }

    return fpsSamples.reduce((a, b) => a + b) / fpsSamples.length;
}

/**
 * @param {number} delta - in seconds.
 */
function updateScene(delta) {
    const avgFps = calculateAvgFps(delta);
    console.log(`fps: ${avgFps.toFixed(1)}`);

    if (resizeRendererToDisplaySize(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    cube.rotation.x += 1 * delta; // redians per second.
    cube.rotation.y += 1 * delta;
    renderer.render(scene, camera);
}

const targetFps = 250;
const targetFrameDuration = 1 / targetFps;
let previousFrameTime = 0;

/** @param {number} currentFrameTime */
function render(currentFrameTime) {
    currentFrameTime *= 0.001; // in seconds.

    const realFrameDuration = currentFrameTime - previousFrameTime;
    if (realFrameDuration >= targetFrameDuration) {
        previousFrameTime = currentFrameTime;
        updateScene(realFrameDuration);
    }

    requestAnimationFrame(render);
}
requestAnimationFrame(render);
