import * as THREE from 'three';

export default class RendererController {
    #renderer: THREE.WebGLRenderer;
    #canvas: HTMLCanvasElement;
    #camera: THREE.PerspectiveCamera | null = null;
    #scene: THREE.Scene | null = null;
    #animationLoop: CallableFunction | null = null;
    #targetFps: number = 30;
    #previousFrameTime: number = 0;

    constructor(
        canvasElementName: string,
    ) {
        const canvas = document.querySelector(canvasElementName);
        if (canvas instanceof HTMLCanvasElement) {
            this.#canvas = canvas;
        } else {
            throw new Error(`Canvas element not found using ${canvasElementName} name.`);
        }

        this.#renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    }

    set camera(camera: THREE.PerspectiveCamera) { this.#camera = camera; }

    set scene(scene: THREE.Scene) { this.#scene = scene; }

    set animationLoop(animationLoop: CallableFunction) { this.#animationLoop = animationLoop; }

    set targetFps(targetFps: number) { this.#targetFps = targetFps; }

    /**
     * Start animation loop for ever browser animation tick.
     */
    render = (currentFrameTime: number = 0) => {
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
     * @param delta - in seconds.
     */
    #updateGameTick(delta: number) {
        if (this.#resizeRendererToDisplaySize() && this.#camera) {
            this.#camera.aspect = this.#canvas.clientWidth / this.#canvas.clientHeight;
            this.#camera.updateProjectionMatrix();
        }

        if (this.#animationLoop) {
            this.#animationLoop(delta);
        } else {
            console.log(`WARNING::RendererController::Animation loop is not set.`);
        }

        if (this.#scene && this.#camera) {
            this.#renderer.render(this.#scene, this.#camera);
        } else {
            console.log(`WARNING::RendererController::Camera or Scene is not set.`);
        }
    }

    /**
     * Resizes rendered canvas to be same as layout canvas.
     *
     * @returns Returns true if needed resizing.
     */
    #resizeRendererToDisplaySize(): boolean {
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
