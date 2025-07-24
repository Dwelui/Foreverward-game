import { sharedState } from "../../sharedState";

export default class FpsCounterController {
    /** @type {number} */
    #maxSamplesCount = 60;

    /** @type {number[]} */
    #fpsSamples = [];

    /** @type {number} */
    setMaxSamplesCount(maxSamples) {
        this.#maxSamplesCount = maxSamples;
    }

    /**
     * Calculate average framerate and set sharedState.
     *
     * @param {number} delta - should be in milliseconds.
     *
     * @returns {number}
     */
    calculate(delta) {
        const fps = 1 / delta;
        this.#fpsSamples.push(fps);

        if (this.#fpsSamples.length > this.#maxSamplesCount) {
            this.#fpsSamples.shift();
        }

        const avgFps = this.#fpsSamples.reduce((a, b) => a + b) / this.#fpsSamples.length;

        if (sharedState.fps !== avgFps) {
            sharedState.fps = avgFps.toFixed(0);
        }
    }
}
