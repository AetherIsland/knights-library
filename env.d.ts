/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_BUILD_TIME?: string;
    readonly VITE_APP_GIT_MSG?: string;
    readonly VITE_APP_GIT_SHA?: string;
    readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
