<template>
    <icon ref="icon" value="icon-keyboard" :style="{
        fontSize: `${size}px`,
        color: 'blue',
        backgroundColor: 'red'
    }"></icon>
</template>

<script setup>
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
const icon = useTemplateRef('icon');
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