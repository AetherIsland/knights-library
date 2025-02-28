# 骑士团图书馆 Knights' Library

## 开发与构建

使用最新的 Node.js LTS 版本和 pnpm 包管理工具。注意需要仓库中有 Git 子模块。

```shell
# 安装依赖
pnpm install

# 启动本地开发服务器
pnpm run dev

# 运行 ESLint
pnpm run lint

# 构建生产版本
pnpm run build
```

## 数据流向

```
┌────────────────────────────┐
│  ??-Model-Importer-Assets  │
└─┬──────────────────────────┘
  │
  │ lisa
  │
  ▼
┌──────────────────────┐
│  library-collection  │
└─┬────────────────────┘
  │
  │ Git submodule
  │
  ▼
┌───────────────────┐
│  knights-library  │
└───────────────────┘
```
