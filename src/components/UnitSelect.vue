<script setup lang="ts">
import type { CollectionName, ModUnitId } from '@/library-collection';
import type { SelectGroupOption, SelectOption } from 'naive-ui';
import { collectionNames, getMetadata } from '@/library-collection';
import { computedAsync, isDefined } from '@vueuse/core';
import { NSelect } from 'naive-ui';

const emit = defineEmits<{
    change: [collection: CollectionName | null, id: ModUnitId | null];
}>();

const options = computedAsync(() => Promise.all<SelectGroupOption>(collectionNames.map(async name => ({
    type: 'group',
    label: name,
    key: name,
    children: (await getMetadata(name)).index.map<SelectOption>(item => ({
        label: item.displayName,
        value: `${name}/${item.id}`,
    })),
}))).catch<SelectOption[]>((reason) => {
    console.error(reason);
    return [{
        disabled: true,
        label: '数据加载失败',
        value: '_error',
    }];
}));

function onUpdate(value: string) {
    if (value) {
        const [collection, id] = value.split('/');
        emit('change', collection as CollectionName, id as ModUnitId);
    }
    else {
        emit('change', null, null);
    }
}
</script>

<template>
    <NSelect clearable filterable :options :loading="!isDefined(options)" @update:value="onUpdate" />
</template>
