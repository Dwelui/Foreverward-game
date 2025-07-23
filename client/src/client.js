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

let previousFrameTime = 0.0;


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

/** @param {number} frameTime */
function render(frameTime) {
    frameTime *= 0.001; //convert to seconds.
    console.log(`frameTime ${frameTime}`);

    const delta = frameTime - previousFrameTime;
    previousFrameTime = frameTime;
    console.log(`delta: ${delta}`);

    if (resizeRendererToDisplaySize(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);
