<script setup lang="ts">
import { LogoGithub, OpenOutline } from '@vicons/ionicons5';
import { NA, NAvatar, NButton, NCard, NIcon, NSkeleton, NText, NThing } from 'naive-ui';

defineProps<{
    repo: string;
    owner: string;
    description: string;
    revision: string | null;
}>();
</script>

<template>
    <NCard>
        <NThing>
            <template #avatar>
                <NAvatar><NIcon><LogoGithub /></NIcon></NAvatar>
            </template>
            <template #header>
                {{ repo }}
            </template>
            <template #header-extra>
                <NButton size="small" tag="a" :href="`https://github.com/${owner}/${repo}`" target="_blank">
                    <template #icon>
                        <NIcon><OpenOutline /></NIcon>
                    </template>
                </NButton>
            </template>
            <template #description>
                {{ owner }}
            </template>
            <template #default>
                {{ description }}
            </template>
            <template #footer>
                构建时版本：
                <template v-if="revision">
                    <NA :href="`https://github.com/${owner}/${repo}/commit/${revision}`" target="_blank">
                        <NText code>
                            {{ revision }}
                        </NText>
                    </NA>
                </template>
                <template v-else>
                    <NSkeleton text width="20em" />
                </template>
            </template>
        </NThing>
    </NCard>
</template>
