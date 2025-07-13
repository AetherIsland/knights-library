<script setup lang="ts">
import type { DataTableColumn, DataTableRowData } from 'naive-ui';
import type { CollectionName, ModUnitId } from '@/library-collection';
import { LogoGithub } from '@vicons/ionicons5';
import { computedAsync } from '@vueuse/core';
import { NAlert, NButton, NDataTable, NDivider, NFlex, NIcon, NSpin, NText, useThemeVars } from 'naive-ui';
import { computed, ref, watchEffect } from 'vue';
import { getCommitMap, getModUnitInfo, githubRepo } from '@/library-collection';
import { modUnitToDataTable } from '@/transformer';

const props = defineProps<{
    collection: CollectionName;
    id: ModUnitId;
}>();

const themeVars = useThemeVars();

const githubRepoURL = computed(() => {
    const { repo, owner } = githubRepo[props.collection];
    return `https://github.com/${owner}/${repo}`;
});

const commitMapEvaluating = ref(false);
const infoEvaluating = ref(false);
const commitMap = computedAsync(() => getCommitMap(props.collection).catch((reason) => {
    console.error(reason);
    return undefined;
}), undefined, commitMapEvaluating);
const info = computedAsync(() => getModUnitInfo(props.collection, props.id).catch((reason) => {
    console.error(reason);
    return undefined;
}), undefined, infoEvaluating);
const loading = computed(() => commitMapEvaluating.value || infoEvaluating.value);

const columns = ref<DataTableColumn[]>();
const components = ref<Record<string, DataTableRowData[]>>();
const error = ref(false);
const githubTreeURL = ref<string>();
const hasNull = ref(false);
const scrollX = ref<number>();
watchEffect(() => {
    if (loading.value) {
        error.value = false;
    }
    else {
        if (info.value && commitMap.value) {
            ({
                columns: columns.value,
                components: components.value,
            } = modUnitToDataTable(info.value, commitMap.value, githubRepoURL.value));
            githubTreeURL.value = `${githubRepoURL.value}/tree/HEAD/${info.value.path}`;
            hasNull.value = info.value.revisions.some(revision => revision.content === null);
            if (typeof columns.value[0].width === 'number') {
                scrollX.value = columns.value[0].width + info.value.revisions.length * 250;
            }
            else {
                scrollX.value = (info.value.revisions.length + 1) * 250;
            }
        }
        else {
            error.value = true;
            columns.value = undefined;
            components.value = undefined;
            githubTreeURL.value = undefined;
            scrollX.value = undefined;
        }
    }
});
</script>

<template>
    <NFlex vertical align="center">
        <NAlert v-if="error" title="加载失败" type="error">
            请检查网络连接或刷新页面。
        </NAlert>
        <NSpin :show="loading">
            <NFlex vertical align="center">
                <NText v-if="info">
                    {{ $props.collection }}：{{ info.path }}
                </NText>
                <NButton v-if="githubTreeURL" text tag="a" :href="githubTreeURL" target="_blank">
                    <template #icon>
                        <NIcon><LogoGithub /></NIcon>
                    </template>
                    <template #default>
                        在 GitHub 上查看
                    </template>
                </NButton>
                <NFlex>
                    <NAlert v-if="info?.seenInHead === false" title="不在最新版本中" type="warning">
                        没有在数据源的
                        <NText code>
                            HEAD
                        </NText>
                        树中发现此单元，可能是被移除或重命名。
                    </NAlert>
                    <NAlert v-if="hasNull" title="发现空数据" type="warning">
                        部分历史版本数据内容为空，可能是文件不存在或内容异常。
                    </NAlert>
                </NFlex>
            </NFlex>
        </NSpin>
        <template v-if="components">
            <template v-for="(component, name, index) in components" :key="$props.collection + $props.id + name">
                <NDivider>组件 {{ index + 1 }}：{{ name || '（未命名）' }}</NDivider>
                <NDataTable
                    :style="{ fontFamily: themeVars.fontFamilyMono }"
                    :columns
                    :data="component"
                    default-expand-all
                    :loading
                    :scroll-x
                    :single-column="false"
                    :single-line="false"
                />
            </template>
        </template>
    </NFlex>
</template>
