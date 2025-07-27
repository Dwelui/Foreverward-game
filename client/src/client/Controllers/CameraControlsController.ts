import * as THREE from 'three';

export default class CameraControlsController {
    #camera: THREE.PerspectiveCamera;
    #attached: boolean = false;
    #onMouseMove: (e: MouseEvent) => void;
    #cameraEuler: THREE.Euler;
    #sensitivity: number = 50;

    constructor(
        camera: THREE.PerspectiveCamera
    ) {
        this.#camera = camera;

        this.#cameraEuler = new THREE.Euler();
        this.#cameraEuler.order = 'YXZ';

        this.#onMouseMove = (e) => this.#calculateUpdate(e);
    }

    getSensitivity(): number { return this.#sensitivity };

    /**
     * Set camera controls sensitivity.
     *
     * @param number - Minimum value is 1 and maximum is 100. Default values is 50.
     *
     * @returns Returns false if range is not respected.
     */
    setSensitivity(number: number): boolean {
        if (number < 1 || number > 100) {
            return false;
        }

        this.#sensitivity = number;
        return true;
    }

    /**
     * Attaches camera calculation to input events.
     */
    attach() {
        this.#attached = true;
        document.addEventListener("mousemove", this.#onMouseMove, false);
        console.info("Camera controls attached.");
    }

    /**
     * Deattaches camera's calculation from `mousemove` event.
     */
    deattach() {
        this.#attached = false;
        document.removeEventListener("mousemove", this.#onMouseMove, false);
        console.info("Camera controls deattached.");
    }

    /**
     * Calculates and saves data for camera.
     * Which is later updates during game ticks.
     */
    #calculateUpdate(e: MouseEvent) {
        // Swapped x and y.
        this.#cameraEuler.y -= e.movementX * this.#sensitivity * 0.0001;
        this.#cameraEuler.x -= e.movementY * this.#sensitivity * 0.0001;

        if (this.#cameraEuler.x > Math.PI / 2) {
            this.#cameraEuler.x = Math.PI / 2;
        }

        if (this.#cameraEuler.x < -Math.PI / 2) {
            this.#cameraEuler.x = -Math.PI / 2;
        }
    }

    /**
     * Updates camera using saved data.
     * Should usually called during game ticks.
     */
    update() {
        if (!this.#attached) return;

        this.#camera.setRotationFromEuler(this.#cameraEuler);
    }
}
