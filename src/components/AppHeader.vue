<script setup lang="ts">
import { NH1, NH2, NText } from 'naive-ui';
</script>

<template>
    <NH1 :class="$style.title">
        骑士团图书馆
    </NH1>
    <NH2 :class="$style.title">
        <NText depth="3">
            Knights' Library
        </NText>
    </NH2>
</template>

<style module>
.title {
    margin-block: 0;
    text-align: center;
}
</style>
