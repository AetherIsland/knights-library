<script setup lang="ts">
import { NA, NDivider, NPopover, NText, NTime } from 'naive-ui';

const buildTime = import.meta.env.VITE_APP_BUILD_TIME;
const commitMessage = import.meta.env.VITE_APP_GIT_MSG;
const commitSHA = import.meta.env.VITE_APP_GIT_SHA;
const version = import.meta.env.VITE_APP_VERSION ?? '开发版本';
</script>

<template>
    <div style="text-align: center;">
        <NDivider style="margin-block-end: 1rem;" />
        <NPopover trigger="hover">
            <template #trigger>
                <NText depth="3">
                    {{ version }}
                </NText>
            </template>
            <template v-if="commitSHA" #header>
                {{ commitSHA }}
            </template>
            <template v-if="commitMessage" #default>
                {{ commitMessage }}
            </template>
            <template v-if="buildTime" #footer>
                <NTime :time="new Date(buildTime)" />
            </template>
        </NPopover>
        <NDivider vertical />
        <NA href="https://github.com/AetherIsland/knights-library" target="_blank">
            <span>源代码</span>
        </NA>
    </div>
</template>
