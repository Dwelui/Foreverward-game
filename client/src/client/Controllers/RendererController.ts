import * as THREE from 'three';

export default class RendererController {
    #canvas: HTMLCanvasElement;
    #camera: THREE.PerspectiveCamera;
    #scene: THREE.Scene;
    #renderer: THREE.WebGLRenderer;
    #animationLoop: CallableFunction | null = null;
    #targetFps: number = 30;
    #previousFrameTime: number = 0;

    constructor(
        canvas: HTMLCanvasElement,
        camera: THREE.PerspectiveCamera,
        scene: THREE.Scene
    ) {
        this.#canvas = canvas;
        this.#camera = camera;
        this.#scene = scene;

        this.#renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    }

    /**
     * Set animation loop that will be called each game tick.
     */
    setAnimationLoop(animationLoop: CallableFunction) { this.#animationLoop = animationLoop; }


    /**
     * Set target fps for game tick target.
     *
     * @param targetFps - Value must be positive. Default value is 30.
     *
     * @returns Returns false if range is not respected.
     */
    setTargetFps(targetFps: number): boolean {
        if (targetFps <= 0) {
            return false;
        }

        this.#targetFps = targetFps;
        return true;
    }

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
        if (this.#resizeRendererToDisplaySize()) {
            this.#camera.aspect = this.#canvas.clientWidth / this.#canvas.clientHeight;
            this.#camera.updateProjectionMatrix();
        }

        if (this.#animationLoop) {
            this.#animationLoop(delta);
        } else {
            console.log(`WARNING::RendererController::Animation loop is not set.`);
        }

        this.#renderer.render(this.#scene, this.#camera);
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
