<script setup lang="ts">
import { NA, NDivider, NPopover, NText, NTime } from 'naive-ui';
</script>

<template>
    <div style="text-align: center;">
        <NDivider style="margin-block-end: 1rem;" />
        <NPopover trigger="hover">
            <template #trigger>
                <NText depth="3">
                    {{ '{版本}' }}
                </NText>
            </template>
            <template #header>
                <NTime :time="Date.now()" />
            </template>
            <span>{{ '{commit message}' }}</span>
        </NPopover>
        <NDivider vertical />
        <NA href="https://github.com/AetherIsland/knights-library" target="_blank">
            <span>源代码</span>
        </NA>
    </div>
</template>
