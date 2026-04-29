# 竹简文档 (Bamboo Documents)

锋桦 (Frontleaves) 项目的官方文档站点，基于 [Next.js](https://nextjs.org/) + [Fumadocs](https://fumadocs.dev/) 构建。

## 技术栈

- **框架**：Next.js 16 (App Router) + React 19
- **内容引擎**：Fumadocs MDX
- **样式**：Tailwind CSS 4
- **语言**：TypeScript 5

## 开发

本项目使用 [pnpm](https://pnpm.io/) 作为包管理器。

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm types:check

# 代码检查
pnpm lint
```

开发服务器启动后，访问 http://localhost:3000 查看效果。

## 项目结构

```
├── content/docs/          # MDX 文档内容
│   ├── guide/             # 入门指南
│   ├── yggdrasil/         # 锋楪认证（Yggdrasil）
│   │   ├── hmcl/          #   HMCL 连接指南
│   │   └── pcl/           #   PCL 连接指南
│   ├── game/              # Game 模块
│   └── plugin/            # Plugin 模块
├── src/
│   ├── app/               # Next.js App Router 页面
│   ├── components/        # React 组件
│   │   ├── ai/            #   AI 集成（LLM 复制、外部平台跳转）
│   │   └── layout/        #   布局组件（侧边栏、导航）
│   └── lib/               # 工具库（内容源、布局配置）
├── source.config.ts       # Fumadocs MDX 配置
└── next.config.mjs        # Next.js 配置
```

## 文档编写

文档使用 MDX 格式，放在 `content/docs/` 目录下。每个目录通过 `meta.json` 管理页面顺序和分组。

图片资源放在对应 MDX 文件同级目录下，使用相对路径引用：

```mdx
![描述文字](./image.png)
```

## 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Fumadocs 文档](https://fumadocs.dev)
