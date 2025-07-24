import * as THREE from 'three';

export default class RendererController {
    /** @type {THREE.WebGLRenderer} */
    #renderer;

    /** @type {HTMLCanvasElement} */
    #canvas;

    /** @type {THREE.PerspectiveCamera} */
    #camera = null;

    /** @type {THREE.Scene} */
    #scene = null;

    /** @type {CallableFunction} */
    #animationLoop = null;

    /** @type {number} */
    #targetFps = 30;

    /** @type {number} */
    #previousFrameTime = 0;

    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(
        canvas,
    ) {
        this.#canvas = canvas;
        this.#renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    }

    /** @param {THREE.PerspectiveCamera} camera */
    setCamera(camera) {
        this.#camera = camera;
    }

    /** @param {THREE.Scene} scene */
    setScene(scene) {
        this.#scene = scene;
    }

    /** @param {CallableFunction} */
    setAnimationLoop(animationLoop) {
        this.#animationLoop = animationLoop;
    }

    /** @param {number} targetFps */
    setTargetFps(targetFps) {
        this.#targetFps = targetFps;
    }

    /**
     * Start animation loop for ever browser animation tick.
     *
     * @param {number} currentFrameTime
     */
    render = (currentFrameTime) => {
        const targetFrameDuration = 1 / this.#targetFps;
        currentFrameTime *= 0.001; // in seconds.

        const realFrameDuration = currentFrameTime - this.#previousFrameTime;
        if (realFrameDuration >= targetFrameDuration) {
            this.#previousFrameTime = currentFrameTime;
            this.#updateGameTick(realFrameDuration);
        }

        requestAnimationFrame(this.render);
    }

    /**
     * Updates every game tick.
     *
     * @param {number} delta - in seconds.
     */
    #updateGameTick(delta) {
        if (this.#resizeRendererToDisplaySize()) {
            this.#camera.aspect = this.#canvas.clientWidth / this.#canvas.clientHeight;
            this.#camera.updateProjectionMatrix();
        }

        this.#animationLoop(delta);

        this.#renderer.render(this.#scene, this.#camera);
    }

    /**
     * Resizes rendered canvas to be same as layout canvas.
     *
     * @returns {boolean} - Returns true if needed resizing.
     */
    #resizeRendererToDisplaySize() {
        const rendererCanvas = this.#renderer.domElement;
        const needResize =
            rendererCanvas.width !== this.#canvas.clientWidth ||
            rendererCanvas.height !== this.#canvas.clientHeight
            ;

        if (needResize) {
            this.#renderer.setSize(this.#canvas.clientWidth, this.#canvas.clientHeight, false);
        }

        return needResize;
    }
}
