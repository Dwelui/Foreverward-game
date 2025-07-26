import { sharedState } from "../../sharedState.ts";

export default class FpsCounterController {
    #maxSamplesCount: number = 60;
    #fpsSamples: number[] = [];

    get maxSamplesCount() { return this.#maxSamplesCount; }
    set maxSamplesCount(count: number) {
        if (count <= 0) {
            throw new Error("maxSamplesCount must be positive number.");
        }
        this.#maxSamplesCount = count;
    }

    /**
     * Calculate average framerate and set sharedState.
     *
     * @param {number} delta - should be in milliseconds.
     *
     * @returns {void}
     */
    calculate(delta: number): void {
        const fps = 1 / delta;
        this.#fpsSamples.push(fps);

        if (this.#fpsSamples.length > this.#maxSamplesCount) {
            this.#fpsSamples.shift();
        }

        const avgFps = this.#fpsSamples.reduce((a, b) => a + b) / this.#fpsSamples.length;

        const roundedAvgFps = Math.round(avgFps);
        if (sharedState.fps !== roundedAvgFps) {
            sharedState.fps = roundedAvgFps;
        }
    }
}
