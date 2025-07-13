<script setup lang="ts">
import { darkTheme, dateZhCN, NConfigProvider, NGlobalStyle, useOsTheme, zhCN } from 'naive-ui';
import { computed } from 'vue';
import AppContent from '@/components/AppContent.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';

const osTheme = useOsTheme();

const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null));
</script>

<template>
    <NConfigProvider :theme :locale="zhCN" :date-locale="dateZhCN">
        <NGlobalStyle />
        <header :class="$style.container">
            <AppHeader />
        </header>
        <main :class="$style.container">
            <AppContent />
        </main>
        <footer :class="$style.container">
            <AppFooter />
        </footer>
    </NConfigProvider>
</template>

<style module>
.container {
    padding: 1rem;
}
</style>
