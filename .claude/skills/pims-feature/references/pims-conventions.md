# PIMS 约定速查（pims-feature skill 用）

skill 阶段 ②（定位+方案）、③（编码）、④（自测）的依据。

## 1. 架构约定（落地遵循）

- 页面/组件用 `<script setup>` + Composition API。
- 业务逻辑抽到 `use*` composable（放 `common/composition/` 或页面同目录）。
- API 调用封装进 `*.service.js`，继承 `ServiceGenerator`。
- 跨组件通信优先 mitt（全局 `$bus`，或模块内独立 mitt 实例，如 `register.mitt.js`）。
- 路径别名 `@` → `src`。
- 多主题：样式走 `style/theme/`，不硬编码颜色。
- i18n：文案走 vue-i18n，不写死中文。
- **禁止同名遮蔽（shadowing）**：函数/变量命名不得与同作用域内引入的 composable 返回值、import、外层变量同名。
- 提交规范（用户自行提交时遵循）：Conventional Commits `<type>(<scope>): <中文描述>`。

## 2. 需求类型 → 改哪些文件

| 需求类型 | 通常要动的位置 |
|---------|--------------|
| 新增业务页面/菜单 | `page/manage/xxx/` + `router/module/` + `router/components.js`(懒加载映射) + 可能加 store 模块 |
| 新增/改接口调用 | 对应 `*.service.js` |
| 新增全局状态 | `store/<模块>/` + 根 store 注册 |
| 新增可复用组件 | `common/components/` |
| 新增业务常量 | `consts/` |
| 新增自定义指令/插件 | `plugins/` |

## 3. 关键机制提示（易踩坑）

- **动态路由**：菜单从接口来，经 `transformToRoute()` 注入；新页面必须在 `router/components.js` 登记懒加载映射，否则路由找不到组件。
- **路由守卫**：锁屏 `isLock`、白名单路由、鉴权重定向逻辑都在 `router/index.js`。
- **持久化**：LocalStorage 存 identification/language/theme；IndexedDB 通过 `localCacheDB` 插件缓存用户列表、颜色配置。

## 4. 自测命令清单

**测试分工（按需求性质选）：**
- **单页面 → Jest 单测**（`npm test`）：测试范围只在单个页面内部——组件渲染、页内交互、composable/工具函数逻辑。
- **跨页面流程 → pytest + Playwright 端到端**：涉及页面跳转、多页面间数据传递/调用的业务流程，验证整条链路真的跑通。

E2E 脚手架已就绪：用例在 `tests/e2e/`，配置在根目录 `pytest.ini`，依赖见 `requirements-e2e.txt`，详细说明见 `tests/e2e/README.md`。

首次准备（装一次）：

```bash
pip install -r requirements-e2e.txt
playwright install chromium
```

> 本机注意：`python` / `pip` 命令被 Windows App 执行别名占位，用 `py` 代替：
> `py -m pip install -r requirements-e2e.txt`、`py -m playwright install chromium`。

跑自测：

1. 起服务（另一个终端/后台）：`npm run dev`，等 dev server 就绪（默认 http://localhost:3011/#/login?redirect=/manage，**dev 是 hash 路由 `/#/xxx`**）。
2. 跑端到端用例：`pytest`（本机用 `py -m pytest`），按需指定文件 `py -m pytest tests/e2e/test_xxx.py -v`。新用例参照 `tests/e2e/test_login.py` 写法。
3. 静态检查保留：`npm run lint`（必要时 `npm run lint-fix`）。
4. webpack 怪错时：`npm run clean:cache`。

> 判定口诀：验收标准只在**一个页面内**就能验证 → Jest；需要**从 A 页面走到 B 页面**（跳转、带参、跨页调用）才能验证 → E2E。
> 本地 E2E 登录统一用 `/#/login2`（不走 SSO，账号密码直登，最稳定可复现）。