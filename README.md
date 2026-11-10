# StellarTrace 星溯智能科技官网

> 以星辰为锚点，以数据为轨迹。数据有光，智能无界；追溯数据星辰，解码智能未来。

星溯智能科技官方网站，包含对外展示门户与后台 CMS 内容管理系统。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Vue 3 + TypeScript + Vuex + Vue Router + Element Plus + Three.js |
| 构建 | Vue CLI 4 + Sass（px2rem 等比适配，基准 14px） |
| 后端 | Node.js + Express + MySQL2 + JWT + bcryptjs |
| 数据库 | MySQL（库名 `stellar_trace`） |

## 项目结构

```
├── public/            # 静态资源
├── src/               # 前端源码
│   ├── api/           # 接口封装（axios）
│   ├── assets/        # 样式与图片资源
│   ├── layout/        # 布局组件
│   ├── router/        # 路由
│   ├── store/         # Vuex 状态管理
│   ├── utils/         # 工具函数
│   └── views/         # 页面（门户 + 后台）
├── server/            # 后端 API 服务
│   ├── app.js         # 服务入口（默认端口 1086）
│   ├── db.js          # MySQL 连接池
│   ├── middleware/    # 鉴权 / 限流中间件
│   ├── routes/        # 业务路由（auth、CMS 各模块）
│   ├── utils/         # 验证码等工具
│   ├── setup-db.js    # 初始化数据库（建库建表 + 种子数据）
│   └── reset-password.js  # 密码重置脚本
└── sql/               # schema.sql / seed.sql
```

## 快速开始

### 1. 环境要求

- Node.js 14+（项目使用 `--openssl-legacy-provider`，Node 17+ 需保留该脚本设置）
- MySQL 5.7+

### 2. 配置数据库

后端通过环境变量或 `server/db.js` 中的默认值连接数据库：

| 变量 | 默认值 |
| --- | --- |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `6612` |
| `DB_USER` | `ZnSoft` |
| `DB_PASS` | `MySQL@ZnSoft` |
| `DB_NAME` | `stellar_trace` |

按需修改默认值或在启动时设置环境变量。

### 3. 初始化数据库

```bash
cd server
npm install
npm run setup
```

### 4. 启动后端

```bash
cd server
npm start        # API 服务运行在 http://localhost:1086
```

### 5. 启动前端

```bash
npm install
npm run serve    # 开发服务器运行在 http://localhost:80，/api 已代理到 1086
```

## 忘记密码 / 重置密码

管理员密码使用 BCrypt 加密存储，忘记密码可通过以下方式重置。

### 方式一：重置脚本（推荐）

```bash
cd server

# 交互式输入用户名和新密码（密码输入不回显）
npm run reset-password

# 或直接指定：重置 admin，新密码为 NewPass@123
npm run reset-password -- admin NewPass@123

# 只指定用户名，密码重置为默认的 123456
npm run reset-password -- admin
```

### 方式二：手动执行 SQL

用已知密码（如 `123456`）的 BCrypt 哈希替换，或使用任意 BCrypt 生成工具生成新哈希后执行：

```sql
UPDATE stellar_trace.sys_user SET password = '<BCrypt哈希>' WHERE username = 'admin';
```

> 初始种子数据的默认密码均为 `123456`（用户 `admin` / `editor`）。首次登录后请尽快修改。

## 后端接口概览

| 模块 | 路径 | 鉴权 |
| --- | --- | --- |
| 登录 / 验证码 / 用户信息 / 登出 | `/api/auth/*` | 登录、登出需 Token |
| 站点配置 | `/api/site-config` | 公开 |
| 联系留言 | `/api/contact-message` | 提交公开（限流） |
| 首页横幅、创始人、核心技术、AI 能力、看板、意象解析、技术哲学、里程碑、跨生态、联系方式、AI 回复模板、仪表盘 | `/api/*` | 需要 Token |

公开接口均带有限流保护；管理接口通过 JWT 鉴权（有效期 24h）。

## 构建与部署

```bash
npm run build    # 产物输出至 dist/
```

生产部署建议：

1. 前端产物 `dist/` 交由 Nginx 托管，并将 `/api` 反向代理至 Node 服务（端口 1086）。
2. Tailwind 与 Font Awesome 已本地化至 `public/vendor/`（`index.html` 静态引入），不依赖外网 CDN；若需更新版本，重新下载对应文件覆盖即可。
2. 通过环境变量注入数据库配置，避免在代码中硬编码数据库密码。
3. 修改 JWT 密钥：设置环境变量 `JWT_SECRET` 为高强度随机值（当前默认值写在 `server/middleware/auth.js` 中）。

## Git 提交规范

| 类型 | 说明 |
| --- | --- |
| `feat` | 新功能（feature） |
| `fix` | 修补 bug |
| `docs` | 文档（documentation） |
| `style` | 格式（不影响代码运行的变动） |
| `refactor` | 重构（既不是新增功能，也不是修改 bug 的代码变动） |
| `chore` | 构建过程或辅助工具的变动 |
| `revert` | 撤销，版本回退 |
| `perf` | 性能优化 |
| `test` | 测试 |
| `improvement` | 改进 |
| `build` | 打包 |
| `ci` | 持续集成 |

示例：`git commit -m "[fix]系统业务模块 用户删除失败"`

## License

[MIT](./LICENSE)
