# Chronos - 风尘录

沉浸式历史教育应用，通过文字冒险游戏的方式带领用户穿越古今、体验历史。

## 功能特性

- **中国历史**：从远古传说到新中国建设，覆盖小学/初中/高中/大学四个阶段
- **世界历史**：从古代文明到当代世界，支持中英文双语切换（高中及以上）
- **沉浸式叙事**：文字冒险游戏式的历史学习体验，NPC 对话 + 玩家选择 + 历史碎片评分
- **平行世界**：AI 生成的平行世界探索，包含序章/阵营/人物弧线/科技树/世界传说
- **水墨古风设计**：融合中国传统水墨美学的 UI 设计系统

## 技术栈

- **框架**：Next.js 14.2.15 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS 3.4 + 自定义 CSS 变量
- **运行时**：Node.js 18+

## 运行说明

### 环境要求

- Node.js >= 18
- npm >= 9（或 yarn / pnpm）

### 安装

```bash
git clone <your-repo-url>
cd chronos-app
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问 http://localhost:3000

### 生产构建

```bash
npm run build
npm run start
```

### 自定义启动端口

```bash
npx next dev -p 3001
```

## 项目结构

```
chronos-app/
├── public/
│   └── data/
│       └── narratives/        # 叙事 JSON 数据（中文 + 英文）
├── src/
│   ├── app/
│   │   ├── page.tsx            # 首页
│   │   ├── era/page.tsx        # 时代选择页
│   │   ├── immersive/page.tsx  # 沉浸式叙事页
│   │   ├── roleplay/page.tsx   # 角色扮演页
│   │   ├── world/              # 平行世界模块
│   │   │   ├── page.tsx        # 世界列表/创建
│   │   │   ├── [id]/page.tsx   # 世界详情
│   │   │   └── adventure/page.tsx # 文字冒险游戏
│   │   └── layout.tsx          # 全局布局
│   ├── components/             # 公共组件
│   ├── data/
│   │   ├── curriculum.json     # 课程数据（中国历史 + 世界历史）
│   │   ├── characters.ts       # 角色定义
│   │   ├── sample-worlds.ts    # 平行世界样板数据
│   │   └── world-data.ts       # 平行世界类型定义
│   ├── lib/
│   │   ├── data.ts             # 数据访问层
│   │   └── lang-context.tsx    # 语言上下文
│   └── styles/
│       └── globals.css         # 全局样式（水墨设计系统）
├── docs/                       # 数据生成脚本
├── package.json
└── README.md
```

## 数据格式

叙事数据为 JSON 文件，存放在 `public/data/narratives/` 目录。

中文文件命名：`{eraId}.json`（如 `sw-ancient-civilizations.json`）
英文文件命名：`{eraId}.en.json`（如 `sw-ancient-civilizations.en.json`）

## License

Private
