<script setup lang="ts">
import type { CollectionName } from '@/library-collection';
import { collectionNames, getMetadata, githubRepo } from '@/library-collection';
import { NFlex, NH3, NP } from 'naive-ui';
import { ref } from 'vue';
import RepoCard from './RepoCard.vue';

const revisions = ref<Record<CollectionName, string | null>>({
    GIMI: null,
    SRMI: null,
    HIMI: null,
    ZZMI: null,
});

for (const name of collectionNames) {
    getMetadata(name).then((metadata) => {
        revisions.value[name] = metadata.head;
    }).catch((reason) => {
        console.error(reason);
        revisions.value[name] = 'ERROR';
    });
}
</script>

<template>
    <div>
        <NH3 prefix="bar">
            这是什么
        </NH3>
        <NP>这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么这是什么</NP>
        <NH3 prefix="bar">
            数据来源
        </NH3>
        <NFlex vertical>
            <RepoCard
                v-for="name in collectionNames"
                :key="name"
                :repo="githubRepo[name].repo"
                :owner="githubRepo[name].owner"
                :description="githubRepo[name].description ?? '（没有描述）'"
                :revision="revisions[name]"
            />
        </NFlex>
    </div>
</template>
