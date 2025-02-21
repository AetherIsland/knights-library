import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import tsconfigPaths from 'vite-tsconfig-paths';
import process from 'node:process';
import gitRepoInfo from 'git-repo-info';

const gitInfo = gitRepoInfo();

process.env.VITE_APP_BUILD_TIME = new Date().toISOString();
process.env.VITE_APP_GIT_MSG = gitInfo.commitMessage;
process.env.VITE_APP_GIT_SHA = gitInfo.sha;
process.env.VITE_APP_VERSION = gitInfo.abbreviatedSha;

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
