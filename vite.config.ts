import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    base: '',
    publicDir: false,
    plugins: [
        tsconfigPaths(),
        vue(),
        vueDevTools(),
    ],
    json: {
        namedExports: false,
        stringify: true,
    },
    appType: 'mpa',
});
