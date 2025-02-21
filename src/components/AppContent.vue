<script setup lang="ts">
import type { CollectionName, ModUnitId } from '@/library-collection';
import { ref } from 'vue';
import Intro from './Intro.vue';
import UnitSelect from './UnitSelect.vue';
import Viewer from './Viewer.vue';

const collection = ref<CollectionName | null>(null);
const id = ref<ModUnitId | null>(null);
</script>

<template>
    <UnitSelect
        :class="$style['limit-width']"
        @change="(c, i) => { collection = c, id = i; }"
    />
    <Viewer v-if="collection && id" :id style="margin-block-start: 1rem;" :collection />
    <Intro v-else :class="$style['limit-width']" style="margin-block-start: 2rem;" />
</template>

<style module>
.limit-width {
    max-width: 32rem;
    margin-inline: auto;
}
</style>
