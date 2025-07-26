import * as THREE from 'three';
import RendererController from './Controllers/RendererController.ts';
import FpsCounterController from './Controllers/FpsCounterController.ts';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const rendererInstance = new RendererController('#main-canvas');
rendererInstance.camera = camera;
rendererInstance.scene = scene;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const fpsCounterInstance = new FpsCounterController();
rendererInstance.animationLoop = (delta: number) => {
    fpsCounterInstance.calculate(delta);

    cube.rotation.x += 1 * delta; // radians per second.
    cube.rotation.y += 1 * delta;
};

rendererInstance.render();
