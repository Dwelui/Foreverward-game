import * as THREE from 'three';
import RendererController from './Controllers/RendererController';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const rendererInstance = new RendererController(document.querySelector('#main-canvas'));
rendererInstance.setCamera(camera);
rendererInstance.setScene(scene);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

rendererInstance.setAnimationLoop((delta) => {
    console.log(delta);
    cube.rotation.x += 1 * delta; // radians per second.
    cube.rotation.y += 1 * delta;
});

rendererInstance.render();

//const fpsSamples = [];
//const maxSamples = 60;

/**
 * @param {number} delta - should be in milliseconds.
 *
 * @returns {number}
 */

/*
function calculateAvgFps(delta) {
    const fps = 1 / delta;
    fpsSamples.push(fps);

    if (fpsSamples.length > maxSamples) {
        fpsSamples.shift();
    }

    return fpsSamples.reduce((a, b) => a + b) / fpsSamples.length;
}
*/
