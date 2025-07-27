import * as THREE from 'three';

type KeyboardInputState = {
    A: boolean,
    W: boolean,
    S: boolean,
    D: boolean,
}

export default class MovementControlsController {
    #attached: boolean = false;
    #movableObject: THREE.Object3D;
    #speed: number = 50;
    #onKeyboardInput: (e: KeyboardEvent) => void;
    #keyboardInputState: KeyboardInputState

    constructor(
        movableObject: THREE.Object3D
    ) {
        this.#movableObject = movableObject;
        this.#keyboardInputState = {
            A: false,
            W: false,
            S: false,
            D: false
        };

        this.#onKeyboardInput = (e) => this.#inputUpdate(e);
    }

    getSpeed(): number { return this.#speed; }

    /**
     * Set movement controls speed.
     *
     * @param number - Minimum value is 1 and maximum is 100. Default values is 50.
     *
     * @returns Returns false if range is not respected.
     */
    setSpeed(number: number): boolean {
        if (number < 1 || number > 100) {
            return false;
        }

        this.#speed = number;
        return true;
    }

    /**
     * Attaches movement calculation to input events.
     */
    attach() {
        document.addEventListener("keyup", this.#onKeyboardInput, false);
        document.addEventListener("keydown", this.#onKeyboardInput, false);
        this.#attached = true;
        console.info("Movement controls attached.");
    }

    /**
     * Attaches movement calculation to input events.
     */
    deattach() {
        document.removeEventListener("keyup", this.#onKeyboardInput, false);
        document.removeEventListener("keydown", this.#onKeyboardInput, false);
        this.#attached = false;
        console.info("Movement controls deattached.");
    }

    /**
     * Saved input data for movableObject.
     * Which is later updates during game ticks.
     */
    #inputUpdate(e: KeyboardEvent) {
        if (e.type === 'keydown') {
            if (e.code === 'KeyW') { this.#keyboardInputState.W = true; }
            if (e.code === 'KeyS') { this.#keyboardInputState.S = true; }
            if (e.code === 'KeyA') { this.#keyboardInputState.A = true; }
            if (e.code === 'KeyD') { this.#keyboardInputState.D = true; }
        }

        if (e.type === 'keyup') {
            if (e.code === 'KeyW') { this.#keyboardInputState.W = false; }
            if (e.code === 'KeyS') { this.#keyboardInputState.S = false; }
            if (e.code === 'KeyA') { this.#keyboardInputState.A = false; }
            if (e.code === 'KeyD') { this.#keyboardInputState.D = false; }
        }
    }


    update(delta: number) {
        if (!this.#attached) return;

        const newPosition = this.#movableObject.position.clone();
        const upDirection = new THREE.Vector3(0, 1, 0);
        const frontDirection = new THREE.Vector3; this.#movableObject.getWorldDirection(frontDirection);
        const strafeDirection = new THREE.Vector3()
            .crossVectors(frontDirection, upDirection)
            .normalize()
            ;

        const positionDelta = frontDirection.multiplyScalar(delta * this.#speed);
        const strafeDelta = strafeDirection.multiplyScalar(delta * this.#speed);

        if (this.#keyboardInputState.W) { newPosition.add(positionDelta); }
        if (this.#keyboardInputState.S) { newPosition.sub(positionDelta); }
        if (this.#keyboardInputState.A) { newPosition.sub(strafeDelta); }
        if (this.#keyboardInputState.D) { newPosition.add(strafeDelta); }

        this.#movableObject.position.z = newPosition.z;
        this.#movableObject.position.x = newPosition.x;
    }
}
