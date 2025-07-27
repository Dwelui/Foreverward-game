import * as THREE from 'three';
import RendererController from './Controllers/RendererController.ts';
import FpsCounterController from './Controllers/FpsCounterController.ts';
import CameraControlsController from './Controllers/CameraControlsController.ts';
import SampleStaticScene from './Samples/SampleStaticScene.ts';
import MovementControlsController from './Controllers/MovementControlsController.ts';

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

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraControlsInstance = new CameraControlsController(camera);

const movementControlsInstance = new MovementControlsController(camera);
movementControlsInstance.setSpeed(20);

function pointerLockChangeHandle() {
    if (document.pointerLockElement === canvas) {
        cameraControlsInstance.attach();
        movementControlsInstance.attach();
    } else {
        cameraControlsInstance.deattach();
        movementControlsInstance.deattach();
    }
}

const scene = new THREE.Scene();
const rendererInstance = new RendererController(canvas, camera, scene);
rendererInstance.setTargetFps(60);

new SampleStaticScene(scene);

camera.position.z = 5;

const fpsCounterInstance = new FpsCounterController();
const gameLoop = (delta: number) => {
    fpsCounterInstance.update(delta); // TODO: should rename to update

    cameraControlsInstance.update();
    movementControlsInstance.update(delta);
};

rendererInstance.setAnimationLoop(gameLoop);
rendererInstance.render();
