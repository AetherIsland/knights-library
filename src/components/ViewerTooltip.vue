<script setup lang="ts">
import type { Commit } from '@/library-collection';
import { NA, NFlex, NP, NPopover, NText, NTime, useThemeVars } from 'naive-ui';

defineProps<{
    commit?: Commit;
    content?: {
        label: string;
        description: string;
    };
    githubRepoURL?: string;
    path?: string;
}>();

const themeVars = useThemeVars();
</script>

<template>
    <template v-if="commit">
        <span><NTime :time="new Date(commit.date)" type="date" /></span>
        <span> (</span>
        <NPopover>
            <template #trigger>
                <span :class="$style.underline">{{ commit.hash.substring(0, 7) }}</span>
            </template>
            <template #header>
                <NP>
                    <span>提交：</span>
                    <NText code>
                        {{ commit.hash }}
                    </NText>
                </NP>
                <NP>
                    <span>日期：</span>
                    <NText code>
                        {{ commit.date }}
                    </NText>
                </NP>
            </template>
            <template #default>
                <NP v-if="commit.message">
                    {{ commit.message }}
                </NP>
                <NP v-if="commit.body">
                    {{ commit.body }}
                </NP>
            </template>
            <template v-if="githubRepoURL" #footer>
                <NFlex>
                    <NA :href="`${githubRepoURL}/commit/${commit.hash}`" target="_blank">
                        查看提交
                    </NA>
                    <NA v-if="path" :href="`${githubRepoURL}/tree/${commit.hash}/${path}`" target="_blank">
                        查看树
                    </NA>
                </NFlex>
            </template>
        </NPopover>
        <span>)</span>
    </template>
    <template v-if="content">
        <NPopover>
            <template #trigger>
                <span :class="$style.underline">{{ content.label }}</span>
            </template>
            <template #default>
                {{ content.description }}
            </template>
        </NPopover>
    </template>
</template>

<style module>
.underline {
    text-decoration-line: underline;
    text-decoration-style: dashed;
    text-decoration-color: v-bind('themeVars.textColor3');
}
</style>
