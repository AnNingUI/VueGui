<template>
    <icon class="icon" ref="icon" value="icon-keyboard" :style="{
        fontSize: `${size}px`,
    }" @click="console.log('123')"></icon>
</template>

<script setup>
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { Icon } from '../../src/ICharacter';
const icon = useTemplateRef < Icon > ('icon');
const size = ref(30);
let intervalId;
onMounted(() => {
    intervalId = setInterval(() => {
        if (size.value < 100) {
            console.log(icon.value)
            size.value += 10;
        } else {
            clearInterval(intervalId);
        }
    }, 1000);
});
onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<style>
.icon {
    color: red;
    background-color: blue;
}
</style>