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
        <NP>这是一个可以浏览 XXMI 资产中的哈希信息的各个版本的工具，能够帮助你制作模组或编辑配置文件。通过手动编辑配置文件中的哈希，你可以实现将现有模组应用于不同版本的游戏客户端。</NP>
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
