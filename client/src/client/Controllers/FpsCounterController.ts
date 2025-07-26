import { sharedState } from "../../sharedState.ts";

export default class FpsCounterController {
    #maxSamplesCount: number = 60;
    #fpsSamples: number[] = [];

    getMaxSamplesCount() { return this.#maxSamplesCount; }

    /**
     * Set max sample count used for averaging fps.
     *
     * @param count - Value must be positive. Default value is 60.
     *
     * @returns Returns false if range is not respected.
     */
    setMaxSamplesCount(count: number): boolean {
        if (count <= 0) {
            return false;
        }

        this.#maxSamplesCount = count;
        return true;
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
