# AGENTS.md

Always respond in Chinese. 请始终使用中文进行回复、解释和编写代码注释。

## 项目规范（henry-chat）

## 一、技术栈

| 领域          | 技术                                     | 说明                                   |
| ------------- | ---------------------------------------- | -------------------------------------- |
| 框架          | Next.js 16.2.4                           | App Router，默认 **RSC（服务端组件）** |
| UI            | React 19.2.4                             | 已启用 `reactCompiler: true`           |
| 样式          | Tailwind CSS v4 + shadcn/ui              | `radix-nova` 风格，CSS 变量主题        |
| 数据请求      | TanStack Query v5                        | 缓存、SSE 流式、自动重试               |
| 认证          | better-auth                              | 邮箱密码 + Google/Facebook 社交登录    |
| 数据库        | drizzle-orm + Neon (Serverless Postgres) | 通过 `@neondatabase/serverless`        |
| i18n          | next-i18next                             | 支持 `zh` / `en`                       |
| 类型          | TypeScript 5.9                           | `strict: true`                         |
| Lint / 格式化 | oxlint / oxfmt                           | 见 `.oxlintrc.json`、`.oxfmtrc.json`   |

## 二、通用约定

1. **语言**：所有回复、解释、代码注释一律使用中文。
2. **路径别名**：一律使用 `@/*` 指向项目根目录，禁止相对路径 `../../`。
3. **包管理器**：使用 `pnpm`（存在 `pnpm-lock.yaml` 与 `pnpm-workspace.yaml`）。
4. **提交前自检**：
   - `pnpm lint`（oxlint）必须通过
   - `pnpm fmt:check`（oxfmt）必须通过，或先 `pnpm fmt` 格式化

## 三、代码风格（由 oxfmt 强制）

- `printWidth: 100`，`tabWidth: 2`，无分号（`semi: false`），单引号（`singleQuote: true`）
- `trailingComma: "all"`，`arrowParens: "always"`，`bracketSpacing: true`
- JSX 属性每行一个（`singleAttributePerLine: true`）
- import 自动排序并分组，分组顺序固定（见 `.oxfmtrc.json` 的 `sortImports`）：
  `react 系` → `next 系` → `type-import` → `外部依赖` → `内部 type` → `内部值` → `父级/兄弟/当前目录` → `其他`
- 依赖交给 `pnpm fmt` 处理，**不要手写 import 顺序**。

## 四、目录结构与文件约定

```text
app/                  # Next.js 路由（App Router）
  (auth)/             # 认证路由组：login / signup / forgot-password
  chat-ai/            # AI 聊天
    _components/      # 该路由私有组件
    hooks/            # 该模块专用 hooks
    constants.ts      # 模块常量
  rankings/           # 排行榜
  token-hub/          # Token Hub
components/           # 全局可复用组件
  ui/                 # shadcn/ui 基础组件（勿手写，用 shadcn CLI 添加）
  theme/              # 主题切换
  markdown/           # Markdown 渲染
lib/                  # 基础设施
  db/                 # drizzle schema 与实例
  request/            # HTTP 客户端封装（ClientRequest）
services/             # 业务服务层（按领域：auth / chat / ranking）
providers/            # React Context Provider（Query / Theme）
types/                # 全局命名空间类型声明（*.d.ts）
i18n/                 # 语言配置与 locale 资源（zh / en）
drizzle/              # 数据库迁移文件（勿手改）
```

## 五、组件与页面约定

1. **RSC 优先**：组件默认作为服务端组件（无 `'use client'`）。仅在需要 hooks / 事件 / 浏览器 API 时才在文件顶部加 `'use client'`。
2. **页面私有组件**：路由专属组件放 `app/<route>/_components/`，命名用 kebab-case 文件名（如 `home-promo-carousel.tsx`）。
3. **共享组件**：跨路由复用的组件放 `components/`，导出用**具名导出**（`export function AppHeader()`），避免 default export（lint 有 `import/no-anonymous-default-export` 警告）。布局/页面文件按 Next.js 要求使用 default export。
4. **shadcn 组件**：基础 UI 组件放 `components/ui/`，通过 `pnpm dlx shadcn@latest add <name>` 添加, 能用 shadcn/ui 组件实现的用组件实现，不手写；图标用 `lucide-react`,=。
5. **样式**：优先用 Tailwind 工具类 + `cn()`（`@/lib/utils`）组合；`components.json` 中 `rsc: true`、`tsx: true`、`style: radix-nova`、`baseColor: neutral`。涉及图表/可视化时先读 `dataviz` skill。

## 六、数据请求规范

1. **业务接口统一走 `services/`**：每个领域一个文件，导出 `XxxService` 对象 + `useXxxQuery` hook + 稳定的 `QUERY_KEYS`。

   ```ts
   // services/chat/index.ts
   import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
   import { request } from '@/lib/request'

   export const ChatService = {
     getModels: () => request.get<Chat.ModelsResponse>('/v1/models'),
   }

   export const CHAT_QUERY_KEYS = { getModels: ['getModels'] }

   export const createModelsQueryOptions = () => queryOptions({ queryKey: CHAT_QUERY_KEYS.getModels, queryFn: ChatService.getModels })

   export function useModelsQuery() {
     return useSuspenseQuery(createModelsQueryOptions())
   }
   ```

2. **底层 HTTP**：使用 `@/lib/request` 导出的 `request` 实例（`ClientRequest`），已内置超时、拦截器（Token 注入 / 401 跳登录 / 网络异常降级）。不要直接裸用 `fetch` 做 JSON 请求。
3. **流式请求**：SSE 用 `request.post(..., { stream: true })` 拿到原生 `Response`，再交给 `@/lib/sse` 的 `parseStream` 处理。
4. **类型**：请求/响应类型定义在 `types/*.d.ts` 的命名空间里，直接引用（见下）。

## 七、类型定义约定

1. **全局命名空间类型**：领域类型放在 `types/*.d.ts`，用 `declare namespace Xxx` 声明，**无需 import 即可全局使用**。

   ```ts
   // types/chat.d.ts
   declare namespace Chat {
     export interface Message {
       id: string
       role: MessageRole
       content: string
       // ...
     }
     export type MessageRole = 'user' | 'assistant' | 'system'
   }
   ```

   用法：`Chat.Message`、`Chat.ModelConfig`、`Ranking.Period`、`Auth.SignupRequestBody`。

2. **跨文件复用的 type/interface**：若不属于某个领域命名空间，用显式 `export` 放在具体模块内（如 `@/lib/request`、`types/request.d.ts`）。
3. 接口字段必须写**中文 JSDoc 注释**（`/** 消息内容 */`），尤其是命名空间内的公共类型。

## 八、hooks 约定

1. 模块专用 hook 放在该路由下的 `hooks/` 目录（如 `app/chat-ai/hooks/useChat.ts`）。
2. 遵循 `react/rules-of-hooks`（error 级）与 `react/exhaustive-deps`（warn 级）。
3. 保持纯函数心智，注意 React Compiler 约束（无副作用于渲染期）。

## 九、i18n 约定

1. 新增文案放 `i18n/locales/{zh,en}/<namespace>.json`，命名空间需登记在 `i18n.config.ts` 的 `ns` 数组。
2. 现有命名空间：`common`、`rankings`、`auth`。
3. 组件内通过 `next-i18next` 的 `useTranslation` / 服务端 `getT()` 获取文案，**不要硬编码用户可见文案**。

## 十、数据库约定

1. schema 定义在 `lib/db/auth-schema.ts`，用 drizzle-orm `pgTable` + `relations`。
2. 修改 schema 后：`pnpm db:generate` 生成迁移 → `pnpm db:migrate` 执行（或开发期 `pnpm db:push`）。**不要手写 `drizzle/` 下的迁移文件**。
3. 数据库实例 `db` 从 `@/lib/db` 导入，勿重复创建连接。

## 十一、环境变量

- 新增环境变量需在 `.env.example`（或对应 `.env*`）中登记；服务端私密变量**必须**通过 `process.env.X!` 非空断言（如 `lib/auth.ts`），客户端变量用 `NEXT_PUBLIC_` 前缀。
- 现有变量（见 `.env` / `.env.development`）：`DATABASE_URL`、`BETTER_AUTH_SECRET`、`BETTER_AUTH_URL`、`GOOGLE_CLIENT_ID/SECRET`、`FACEBOOK_CLIENT_ID/SECRET`、`NEXT_PUBLIC_SERVER_URL`、`NEXT_PUBLIC_API_KEY`、`NEXT_PUBLIC_HOST_URL` 等。

---

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
