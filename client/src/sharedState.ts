import { reactive } from 'vue';

interface SharedState {
    fps: number
}

export const sharedState = reactive<SharedState>({
    fps: 0
});
