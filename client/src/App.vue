<script setup>
import { sharedState } from './sharedState.js';
</script>

<template>
    <p class="text-amber-200">FPS: {{ sharedState.fps }}</p>
</template>
