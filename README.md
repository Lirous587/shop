# Shop Admin — 电商后台管理系统

> 基于 Vue 3 全家桶开发的电商后台管理系统，涵盖商品、订单、用户、权限等完整业务模块，纯前端实现。

**[在线预览 →](https://shop.projects.lirous.com/)**

---

## 项目亮点

- **动态路由 + RBAC 权限控制**：菜单与路由根据后端接口动态注册，配合自定义指令 `v-permission` 实现按钮级权限粒度控制
- **Composition API 封装复用**：抽取 `useCommon`、`useSku`、`useTabList` 等通用 Composables，减少重复代码
- **ECharts 数据可视化**：首页集成折线图、动态数据卡片、数字滚动动效（anime.js / GSAP）
- **富文本 & Markdown 编辑器**：商品详情页集成 md-editor-v3，支持实时预览
- **Axios 统一封装**：拦截器统一处理 Token 注入、错误提示、NProgress 加载条

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3.5 + Composition API |
| 构建工具 | Vite 6 |
| UI 组件库 | Element Plus 2.9 |
| 样式方案 | WindiCSS（Utility-first CSS） |
| 路由 | Vue Router 4（动态路由） |
| 状态管理 | Vuex 4 |
| HTTP | Axios 1.9 |
| 数据可视化 | ECharts 5 |
| 动效 | GSAP 3 + Anime.js 3 |
| 工具库 | VueUse 10 |
| 编辑器 | md-editor-v3 |
| 其他 | NProgress、universal-cookie |

---

## 功能模块

```
后台首页        数据看板（数据卡片 + ECharts 图表）
商品管理        商品列表 / 规格配置 / 轮播图 / 详情编辑
分类管理        多级分类树形结构，支持嵌套增删改
订单管理        订单列表 / 发货 / 详情查看 / Excel 导出
评论管理        评论审核
用户管理        用户列表 / 会员等级配置
优惠券管理      优惠券创建与管理
公告管理        站内公告发布
图库管理        图片分类上传与管理
权限管理        菜单 / 角色 / 管理员 — 三层 RBAC 权限体系
规格管理        商品 SKU 属性与值管理
系统设置        基础配置 / 交易设置 / 物流设置
分销管理        分销员列表 / 分销配置
```

---

## 项目结构

```
src/
├── api/            接口层（按业务模块拆分）
├── components/     公共组件（FormDrawer、ChooseImage、Editor…）
├── composables/    组合式函数（useCommon、useSku、useTabList…）
├── directives/     自定义指令（v-permission 按钮权限）
├── layout/         布局骨架（顶栏、菜单、标签页）
├── pages/          业务页面（按模块目录组织）
├── router/         路由配置（静态路由 + 动态路由注册）
├── store/          Vuex 全局状态
├── axios.js        Axios 封装（拦截器）
└── permission.js   路由守卫（登录鉴权 + 动态路由加载）
```

---

## 快速开始

**环境要求**：Node.js ≥ 18、pnpm

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生产构建
pnpm build

# 本地预览构建产物
pnpm preview
```

---

## 部分截图

> 在线地址：**https://shop.projects.lirous.com/**

| 登录页 | 数据看板 | 商品管理 |
|--------|----------|----------|
| 账号密码登录，Token 持久化 | ECharts 图表 + 数字滚动 | SKU 规格矩阵 + 图片上传 |

---

## License

MIT
