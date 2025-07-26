import * as THREE from 'three';
import RendererController from './Controllers/RendererController.ts';
import FpsCounterController from './Controllers/FpsCounterController.ts';
import CameraControlsController from './Controllers/CameraControlsController.ts';

const canvas = document.querySelector('#main-canvas');
if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("Failed to get #main-canvas element.");
}

canvas.addEventListener("click", async () => {
    if (!document.pointerLockElement) {
        try {
            await canvas.requestPointerLock();
        } catch (e) {
            // Used for avoiding security restriction.
            // SecurityError: The user has exited the lock before this request was completed.
            console.log('WARNING::Tried to lock pointer to quickly after exiting.');
        }
    }
});

document.addEventListener("pointerlockchange", pointerLockChangeHandle, true);

/********************************************************
 *                        SCENE                         *
 ********************************************************/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraControlsIntance = new CameraControlsController(camera);
cameraControlsIntance.setSensitivity(100);

function pointerLockChangeHandle() {
    if (document.pointerLockElement === canvas) {
        cameraControlsIntance.attach();
    } else {
        cameraControlsIntance.deattach();
    }
}

const rendererInstance = new RendererController(canvas, camera, scene);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const fpsCounterInstance = new FpsCounterController();
const gameLoop = (delta: number) => {
    fpsCounterInstance.calculate(delta);

    cameraControlsIntance.update(); // INFO: might want to move camera update to browser update time.

    cube.rotation.x += 1 * delta; // radians per second.
    cube.rotation.y += 1 * delta;
};

rendererInstance.setAnimationLoop(gameLoop);
rendererInstance.render();
