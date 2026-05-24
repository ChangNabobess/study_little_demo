# [dataplatformapp](D:\work\DataPlatForm\dataplatformapp)项目亮点

> **项目背景**：Vue 2.7 + TypeScript + ABP Framework 多租户企业级实验室数据管理平台

---

## 一、动态路由 + 细粒度权限系统

路由表不是静态配置的，而是在用户登录后由后端返回。前端调用 `/GetAllMenu` 接口获取菜单树，通过 `filterAsyncRoutes()` 将其递归转换为 Vue Router 路由对象，再通过 `router.addRoute()` 在运行时动态注册，实现了菜单即路由的设计。

路由守卫（`beforeEach`）中内置了容错逻辑：若路由表为空（如页面刷新导致内存状态丢失），自动重新请求菜单并完成路由注册，保证刷新后权限状态不丢失。

在页面级权限之上，还实现了**按钮级权限控制**：通过 `getMenuItemByrouteName()` 从原始菜单树中提取对应页面的 `buttonCode` 列表，在组件内按需控制操作按钮的渲染。

**简历描述：**
> 设计并实现基于后端菜单树的动态路由系统，登录后运行时调用 `router.addRoute()` 动态注册路由，结合路由守卫实现页面级 + 按钮级双层权限控制，并处理了刷新后路由丢失的容错场景。

---

## 二、SSO 单点登录流程闭环

系统同时支持两套登录模式并存：**域账号 SSO 登录**（从 URL 中获取 `code` 换取 token）和**平台账号密码登录**。

SSO 流程中，用 `localStorage` 记录已使用的 `code` 值（`OssLoginAuthCode`），防止同一个 code 被重复消费带来的幂等性问题。域账号登录流程为：先用 code 换取用户信息和临时凭证，再通过密码登录接口（密码经 AES 加密传输）完成 ABP token 初始化。整套流程串联在 Vuex action 链中（`LoginByAddressCode` → dispatch `login`），对调用方完全透明。

**简历描述：**
> 实现 SSO 单点登录与平台账号双模式登录流程，处理了 OAuth code 重复消费防幂等、AES 加密密码传输、token 多级存储（Cookie + SessionStorage）等细节，登录逻辑完整封装于 Vuex action 链中。

---

## 三、企业级 Axios 封装 —— Token 滑动续期机制

封装了统一的 Axios 实例，在请求拦截器中自动注入 `Authorization`、`Abp.TenantId`、`.AspNetCore.Culture` 三个请求头，屏蔽了所有业务代码对多租户和认证细节的感知。

在响应拦截器中实现了 **Token 滑动续期**：每次请求成功后调用 `abp.auth.setRefreshToken()` 将 Cookie 有效期延长 24 小时。这解决了一个实际 Bug——若不做续期，浏览器会在 Cookie 到期后静默清除 token，下一次请求头中 token 为空，后端返回 401，用户表现为"还在操作中突然掉线"的假失效问题。

错误处理统一在拦截器中完成：401 弹窗提示并清空所有存储状态、403 提示权限不足、网络异常提示重试，组件层无需关心任何错误分支。

**简历描述：**
> 封装统一 Axios 实例，在响应拦截器中实现 Token 滑动续期（每次请求成功自动延长 24 小时），解决了浏览器 Cookie 静默过期导致的"假登录态"问题；同时统一处理 401/403/网络错误，屏蔽了业务组件层的错误处理逻辑。

---

## 四、多标签页 + Keep-Alive 精细缓存管理

实现了仿浏览器多标签页的导航系统，通过 Vuex 的 `pageOpenedList`（已打开标签列表）和 `cachePage`（keep-alive 组件名白名单）双状态协同驱动。每次路由跳转后，`afterEach` 钩子自动调用 `openNewPage()` 维护标签状态。

`cachePage` 在每次变更时同步持久化到 `localStorage`，页面刷新后可完整恢复历史标签。支持"关闭当前页"、"关闭其他页"、"关闭全部"三种操作，每种操作都精确维护 keep-alive 白名单，确保关闭的页面组件实例被真正销毁，避免内存泄漏。

**简历描述：**
> 实现多标签页导航系统，基于 Vue keep-alive + Vuex 状态协同，精确管理页面组件实例的缓存与销毁，标签历史通过 localStorage 持久化，支持页面刷新后自动恢复。

---

## 五、多环境多变体构建体系

维护 7 套 `.env` 文件（`development` / `developmentpb` / `test` / `testshouyi` / `production` / `productionshouyi` / `productionip`），覆盖开发、测试、生产及不同业务变体的全部场景。

通过 `VUE_APP_ENV` 环境变量实现**组件级差异化**：`master` 和 `shouyi` 两种业务变体在应用入口处加载完全不同的首页组件，编译产物互相隔离。

Webpack 配置中以**构建时间戳**替代 `contenthash` 作为 chunk 文件名，解决了在不支持协商缓存的 CDN / Nginx 场景下静态资源无法及时更新的问题。

**简历描述：**
> 搭建多环境 + 多业务变体的工程化构建体系，通过环境变量实现首页组件的条件替换；配置 Webpack 时间戳 chunk 命名策略，解决生产环境静态资源强缓存更新问题。

---

## 六、ABP Framework 多租户企业系统集成

应用启动时，先调用 `/AbpUserConfiguration/GetAll` 拉取全局配置（权限、本地化、多租户信息等），通过深度合并（`extend(true, window.abp, data)`）注入到全局 `abp` 对象后，才挂载 Vue 实例。这保证了组件树中任何代码执行时，`abp` 的配置状态已就绪。

每次 HTTP 请求自动注入 `Abp.TenantId`（多租户标识）和 `.AspNetCore.Culture`（国际化语言），业务代码对多租户架构完全无感。

全局工具库 `globalUtil` 通过 Webpack `ProvidePlugin` 注入，项目任意文件无需 `import` 即可调用，同时保留了 TypeScript 类型声明，兼顾了便利性与类型安全。

**简历描述：**
> 负责系统与 ABP Framework 的深度集成，实现全局配置预加载后再挂载 Vue 实例、多租户 Header 自动注入等机制；通过 Webpack ProvidePlugin 封装全局工具库并配套 TypeScript 声明，提升全团队开发效率。

---

## 七、大数据量表格性能优化方案

针对不同数据量场景制定了差异化的表格选型策略：常规管理页面使用 **iView Table**（轻量、交互友好）；在检测申请、报告项管理、工作量统计等数据行数大、渲染压力高的业务页面，统一切换为 **VXE-Table**，利用其虚拟滚动能力只渲染可视区域内的行，避免大数据量下的页面卡顿。

**简历描述：**
> 针对大数据量列表场景，引入 VXE-Table 虚拟滚动方案，与 iView Table 形成轻量/重量两套表格分层使用策略，有效解决数据量过大时的渲染性能问题。

---

## 八、页面卡顿性能排查 —— 跨角色协作定位根因

用户反馈线上页面操作卡顿，通过浏览器 **Performance 面板**录制操作过程的完整性能快照，逐帧分析火焰图，定位到 Long Task 集中出现在 JS 解析和脚本执行阶段，而非组件渲染或接口耗时。

进一步对比本地构建产物与线上产物后，发现线上 JS bundle 的语法降级程度异常，将问题范围缩小到构建环节。排查运维侧 Jenkins 流水线配置后，确认根因是**打包所用的 Node.js 版本过低**，导致部分依赖包无法完成现代语法的正常编译优化，输出了低效的 polyfill 代码，拖慢了主线程执行。升级 Jenkins Node 版本后，页面卡顿问题消除。

此次排查的价值在于：**性能问题不一定出在代码本身**，通过系统性的分层排查（浏览器 → 产物对比 → 构建环境），将问题根因从前端代码层追溯到了 CI/CD 基础设施层。

**简历描述：**
> 主导线上页面卡顿问题排查，借助 Chrome Performance 面板定位 Long Task 集中在 JS 执行阶段，通过对比本地与线上构建产物，最终将根因锁定为 CI/CD 流水线（Jenkins）Node.js 版本过低导致依赖包编译异常，升级 Node 版本后问题消除。

---

## 九、静态资源时间戳命名 —— 发版后用户无感更新

生产环境发版后，用户若不手动强刷浏览器，浏览器会继续使用本地缓存的旧版 JS/CSS 文件，导致新功能不生效或新旧代码混用出现异常，需要人工通知用户刷新，运营成本极高。

通过修改 Webpack 的 `output.filename` 和 `output.chunkFilename` 配置，将默认的 `[contenthash]` 替换为**构建时间戳**，使每次发版的所有静态文件名都不同于上一版本。浏览器请求到新 HTML 后，发现 script src 文件名变化，会强制请求新文件而非使用缓存，实现**发版后用户无需手动刷新、自动加载最新版本**。

```js
// vue.config.js
config.output = {
  filename: `js/[name].${new Date().getTime()}.js`,
  chunkFilename: `js/[name].${new Date().getTime()}.js`,
}
```

相比 `contenthash`，时间戳方案在 Nginx 未配置协商缓存的运维环境下更可靠，与运维侧的部署流程解耦，前端可独立控制缓存失效策略。

**简历描述：**
> 针对发版后用户需手动强刷的问题，将 Webpack chunk 文件名由 `contenthash` 改为构建时间戳，使每次发版的静态资源文件名全部更新，浏览器自动加载最新版本，解决了旧缓存导致的功能异常，实现用户无感更新。

---
## 优先级总览

| 优先级 | 亮点 | 适合场景 |
|---|---|---|
| ⭐⭐⭐ 必写 | 动态路由 + 权限系统 | 简历项目描述、权限设计考题 |
| ⭐⭐⭐ 必写 | Axios 封装 + Token 滑动续期 | 简历项目描述、网络层设计考题 |
| ⭐⭐⭐ 必写 | SSO 单点登录流程 | 简历项目描述、认证方案考题 |
| ⭐⭐ 建议写 | 多标签 + Keep-Alive 管理 | 体现 Vue 原理理解深度 |
| ⭐⭐ 建议写 | 多环境构建体系 | 体现工程化意识 |
| ⭐ 可提及 | ABP 多租户集成 | 聊企业级系统经验时展开 |
| ⭐ 可提及 | VXE-Table 性能优化 | 聊性能优化经历时佐证 |

# [pims-front](D:\work\Pims\pims-front)项目亮点
> **项目背景**：面向医疗机构的病理信息管理系统（PIMS），Vue 3 技术栈，覆盖病理样本全流程管理（登记 / 取材 / 诊断 / 归档），支持多院区、多角色、多主题。

---

## 一、复杂权限体系 + 动态路由架构

**技术细节：**
- 实现了**四层路由体系**：白名单路由 → 接口返回菜单动态生成路由 → 按角色（admin / operation / station）条件挂载路由 → 业务模块独立路由文件
- 登录后通过 `forkJoin` 并行拉取用户信息、菜单、全局配置，再用 `transformToRoute()` 动态注入 `router.addRoute()`，实现真正的**接口驱动的权限路由**
- 路由守卫中额外处理了锁屏状态、token 失效重定向、chunk 加载失败自动刷新等边界场景

**简历表述**：设计并实现基于后端接口的动态权限路由系统，支持多角色差异化菜单，路由守卫覆盖 token 鉴权、锁屏拦截、版本更新自动刷新等完整的边界场景。

---

## 二、大文件分片上传 + Web Worker 卸载主线程

**技术细节：**
- 大文件上传完全运行在 **`upload.worker.js`（Dedicated Worker）** 中，不阻塞 UI 线程
- 上传前用 **SparkMD5** 计算文件整体 MD5（用于秒传 / 断点续传校验），每个 chunk 上传前再计算分块 MD5 做完整性校验
- 实现了**断点续传**：服务端返回 `lack` 数组指定缺失分片，客户端按序补传；连续失败 5 次才判定上传失败
- 上传进度通过 `postMessage` 推送，配合 RxJS `Subject` 做响应式进度流

**简历表述**：基于 Web Worker + SparkMD5 实现大文件分片上传方案，文件整体与分块双重 MD5 校验，支持断点续传，上传逻辑完全脱离主线程，不影响页面交互体验。

---

## 三、SharedWorker 实现多 Tab 状态同步

**技术细节：**
- 用 **`login.sharedworker.js`（SharedWorker）** 在所有同域 Tab 之间共享 token 和用户信息
- 任一 Tab 登录 / 登出，通过 Worker 广播给所有其他 Tab，实现**多标签页状态实时同步**
- `common.sharedworker.js` 作为通用跨 Tab 消息总线

**简历表述**：引入 SharedWorker 解决多 Tab 场景下的登录态同步问题，任意标签页的登录 / 登出操作实时广播至所有同域页面，无需轮询 localStorage。

---

## 四、命令式弹窗组件（Headless Dialog Service）

**技术细节：**
- `hzztDialog` 基于 Vue 3 的 **`render` 函数 + `createApp`** 实现**命令式调用弹窗**，脱离模板声明
- 手动注入 `vNode.appContext = window.hzztApp._context`，使弹窗内部可以正常使用 `$t`、全局组件等上下文
- 在此基础上封装了 `hzztFormDialog`（带表单校验）、`hzztTableDialog`（带表格）、`hzztCameraDialog`（文件管理）等高阶弹窗
- 弹窗关闭时 `render(null, container)` 主动卸载 vNode 防止内存泄漏

**简历表述**：基于 Vue 3 render 函数封装命令式弹窗服务，支持 JS 调用动态挂载 / 卸载 Vue 组件树，手动接管 appContext 保证全局插件可用，并在此基础上派生出表单弹窗、表格弹窗等多个高阶组件。

---

## 五、IndexedDB 封装 + 多维度本地缓存策略

**技术细节：**
- 自封装了一套完整的 **IndexedDB Promise 化 ORM**，支持建表、索引、增删改查、upsert 等操作，并有自动降级逻辑（打开失败则删库重建）
- 实际业务中缓存了搜索历史、报告草稿、棋盘缓存、最近病例、打印机配置、视频上传状态、全局配置等 **20+ 个 ObjectStore**
- 分层缓存策略：高频访问数据（用户列表、颜色配置）走 IndexedDB，会话级数据走 SessionStorage，偏好设置走 LocalStorage

**简历表述**：自主封装 IndexedDB Promise 工具类，支持多表、索引、upsert 等 ORM 式操作，结合 LocalStorage / SessionStorage 实现分层本地缓存策略，有效降低重复请求，提升离线可用性。

---

## 六、RxJS 在非数据流场景的精准应用

**技术细节：**
- HTTP 层用 RxJS `Subject` + `throttleTime(100)` 对错误 toast **防重复抖动**，避免并发报错刷屏
- 路由守卫用 `forkJoin` 并行发起多个初始化请求，完成后统一处理
- POST / PATCH / PUT 请求拦截器中用 Map + setTimeout 做**幂等锁**，防止 1s 内重复提交
- STOMP WebSocket 服务用 `distinctUntilChanged`、`map` 做连接状态流转

**简历表述**：在 HTTP 拦截、WebSocket、请求防重等场景中精准引入 RxJS，用 Subject + throttleTime 解决并发错误提示抖动，用 forkJoin 并行初始化，用请求幂等锁防止重复提交。

---

## 七、医学影像（DICOM）集成

**技术细节：**
- 集成 **Cornerstone.js** 整套生态（core / math / tools / wado-image-loader）实现浏览器端 DICOM 图像渲染
- 对接 KFB 数字切片专有格式查看器
- 结合 WebSocket（STOMP）实现影像状态实时推送

**简历表述**：在 B 端系统中集成 Cornerstone.js 实现 DICOM 医学影像的浏览器端渲染，支持 WADO 协议图像加载及 KFB 数字切片格式，为病理诊断场景提供在线影像浏览能力。

---

## 量化数据参考

| 维度 | 数据 |
|---|---|
| 项目规模 | 30+ 业务模块，支持多院区多角色 |
| 本地缓存 | IndexedDB 20+ 个 ObjectStore |
| 技术难点 | 大文件分片上传、SharedWorker 多 Tab 同步、命令式弹窗服务 |
| 架构设计 | 动态权限路由、分层缓存体系、Web Worker 卸载主线程 |
| 特殊领域 | DICOM 医学影像渲染（B 端稀缺能力） |
---

# [fance_minprogram](D:\work\study\fance\minProgram)
> 项目背景：基于 Vue2 + UNI-APP 开发的 Dell / Alienware 品牌电商小程序，支持微信小程序、百度小程序、H5 三端同构，具备完整的电商交易链路（商品、购物车、订单、优惠券、VIP会员、直播等）。

---

## 一、多品牌 × 多平台一码多发架构

- 使用 UNI-APP 条件编译（`#ifdef DELL / ALW / MP-WEIXIN / MP-BAIDU / H5`）实现**一套代码库同时支持 2 个品牌 × 3 个平台 = 6 套产物**的编译输出，避免了维护多个独立仓库的成本。
- 品牌差异（主题色、AppID、tenantId、功能开关）通过构建时环境变量注入，运行时零切换成本。
- 在 `vue.config.js` 和自定义 `build.js` 中封装了多品牌打包脚本，一条命令完成"修改 AppID → 编译 → 输出指定目录"全流程，显著提升了多品牌发布效率。

**简历关键词**：跨端开发、多品牌工程化、条件编译、构建脚本定制

---

## 二、统一请求层设计：认证 + 自动续签 + 环境路由

在 `src/common/js/request.js` 中封装了一套完整的请求中间件，核心能力：

- **动态环境路由**：根据小程序版本（开发版 / 体验版 / 正式版）和品牌 AppID 自动切换 API BaseURL，彻底消除了硬编码环境变量带来的误发布风险。
- **Token 自动续签**：收到 401 响应后，自动触发静默登录并重试原请求；通过 `autoLoginLoading` 标志位实现并发请求的"请求锁"，避免多个接口同时过期时触发多次重登录。
- **请求头自动注入**：每次请求自动携带 token、tenantId、平台类型、设备信息、神策 utm 归因参数等 12 个字段，业务层调用时无需关心鉴权细节。

**简历关键词**：请求封装、Token 无感刷新、并发控制、多环境路由

---

## 三、多套埋点 SDK 的统一接入与治理

项目同时接入了 4 套数据上报体系：神策（Sensors）、EUB、JiNGsocial、SR SDK，分散在不同平台有各自的初始化逻辑。通过以下方式统一治理：

- 在 `getUserInfo` action 中完成登录后集中初始化所有 SDK，并同步用户身份（`identify`、`login`、`register`）及 VIP 属性，保证用户画像数据的一致性。
- 在全局 mixin 的 `onLoad` 生命周期中统一处理 UTM 归因参数的读取、Session 刷新、页面曝光上报等逻辑，业务页面无需重复实现。
- 通过 `observeExpOnce` 方法封装 `IntersectionObserver`，实现商品卡片的**精准曝光埋点**（进入视口才上报，且只上报一次），替代了滚动事件估算的低精度方案。

**简历关键词**：多 SDK 治理、用户行为埋点、曝光精准上报、IntersectionObserver

---

## 四、复杂会员体系的前端状态管理

VIP 会员模块涉及多个异步状态（登录态、手机号绑定、昵称授权、VIP 等级、积分），通过 Vuex 集中管理并做到：

- **登录态分层**：区分"微信静默登录（有 token）"和"绑定手机号（有交易权限）"两个层级，路由拦截和按钮权限按层级判断，减少不必要的强制登录打扰。
- **状态持久化**：敏感状态（token、VIP 标识、手机绑定状态）同步写入 `localStorage`，冷启动时直接恢复，避免白屏期间的权限闪烁。
- **全局定时器复用**：通过 `timerIdent` 单一全局定时器，供多个需要定时刷新的组件共同监听，避免多页面同时开启多个 `setInterval` 造成的性能问题。

**简历关键词**：Vuex 状态设计、权限分层、持久化、性能优化

---

## 五、小程序订阅消息的工程化管理

微信订阅消息涉及 20+ 种消息类型（支付成功、优惠券到期、活动开奖、积分变更等），且每个品牌（Dell / Alienware）的测试环境和生产环境有各自的 `tmplId`，共计维护近百个 ID。

- 在 `const.js` 中以**二维映射表**（消息类型 × 品牌环境）统一管理所有 tmplId，新增消息类型只需在一处维护。
- 在全局 mixin 的 `requestSubsMes` 方法中封装订阅请求，自动根据当前品牌和环境读取正确的 tmplId，并在用户授权后上报神策事件，调用方只需传消息类型名称。

**简历关键词**：小程序订阅消息、配置集中化、多环境管理

---

## 六、Canvas 海报生成能力

在 mixin 中封装了基于小程序 Canvas API 的**分享海报生成工具**，支持：

- 自定义圆角矩形绘制（`roundRect` 方法，兼容小程序 Canvas 不支持 `border-radius` 的限制）
- 多行文本自动截断与省略号处理（`drawText` 方法，按字符宽度逐字计算换行）
- 远程图片转 base64 后绘制（绕过小程序 Canvas 跨域限制）

**简历关键词**：Canvas 海报生成、小程序图形渲染、原生 API 兼容性处理

---

## 七、跨小程序导航与 H5 降级适配

`navTo` 导航方法统一处理了页面跳转的所有场景：

- 普通页面、TabBar 页面、跨小程序跳转（`navigateToMiniProgram`）三种模式自动分发。
- 百度小程序和 H5 环境下，跨小程序跳转降级为 AppID 映射表 → H5 域名重定向，保证多平台用户链路可达。
- 内置防抖（300ms throttle），避免用户快速点击触发多次跳转。

**简历关键词**：跨小程序通信、多平台导航适配、防抖节流

---

## 八、业务规模

- 覆盖完整电商链路：商品列表/详情、SKU 选择、购物车、结算、订单全状态流转、退换货、评价。
- 特殊业务模块：EPP/SPP 员工/学生采购专项、VIP 积分与等级体系、直播间浮层、优惠券/券包领取、以旧换新。
- API 接口 100+ 个，页面模块 10+ 个分类目录，组件体系覆盖通用交互场景。

**简历关键词**：大型电商小程序、复杂业务场景、全链路交易
---
# [fance_bg](D:\work\study\fance\bc)
> Fancy BOS 电商后台管理系统

## 一、动态权限路由系统

基于服务端返回的菜单数据，在运行时动态生成可访问路由表。

- 登录后通过 `router.beforeEach` 全局守卫拦截导航，异步拉取用户信息与菜单权限
- 在 Vuex `permission` 模块中，将后端菜单列表与前端静态 `asyncRouterMap` 做递归匹配过滤，
  同时从菜单接口回写路由的 `title`、`icon`、`hidden`、`sort` 字段，实现菜单展示由服务端动态配置
- 过滤完成后执行 `router.addRoutes()` 动态挂载路由，并对菜单层级做排序，保证顺序与后台配置一致
- 路由守卫中加入路径合法性校验（`pathInRouters`），若当前目标路径不在已授权路由中，
  自动跳转至第一个有权限的菜单项，避免 404 白屏

> 亮点关键词：**前端动态鉴权**、**运行时路由注入**、**菜单服务端可配置**

---

## 二、多租户架构支持

系统支持多租户切换，用户可在同一账号下切换不同租户身份访问对应数据。

- Vuex `user` 模块维护 `selectedTenant` 状态，切换租户后持久化至 `localStorage`，
  页面刷新后自动恢复上次选中的租户
- Axios 请求拦截器统一注入 `tenantId` 请求头，所有接口调用自动携带当前租户上下文，
  无需业务代码手动处理
- 登录后 `GetInfo` 阶段根据 `tenantId` 字段自动还原租户选中状态，做到无感切换

> 亮点关键词：**多租户数据隔离**、**租户上下文自动透传**

---

## 三、Axios 统一请求层设计

封装了完整的请求/响应拦截器链路，将鉴权、租户标识、错误处理、文件下载等横切逻辑统一收敛。

- **请求拦截**：自动注入 `Authorization`（JWT）、`roleId`、`tenantId` 三个请求头
- **响应拦截**：
  - 识别 `Content-Type` 为 `application/octet-stream` / `officedocument` 时，直接透传完整 response，
    供调用方从 Header 读取文件名并触发下载
  - 业务错误码统一弹 `Message` 提示；`401` 时弹 `MessageBox` 确认框，用户确认后执行登出并刷新页面
- **请求取消**：利用 `axios.CancelToken` 为每个请求注册取消函数，
  存入全局 `window._axiosPromiseArr`，路由切换时统一调用，避免跨页面的异步竞态问题

> 亮点关键词：**统一请求封装**、**请求取消防竞态**、**文件流下载识别**

---

## 四、OSS 客户端直传

图片/文件上传采用前端直传 OSS 方案，规避文件流经过服务端中转的性能瓶颈。

- 上传前调后端接口获取带签名的临时 Policy（包含 `policy`、`signature`、`accessKeyId`、`dir`、`host`）
- 以获取到的凭证作为 `formData` 附加字段，直接 POST 文件至 OSS Bucket，服务器零流量参与
- 文件名做特殊字符清洗（`replace(/[^\.|0-9|a-z|A-Z]/g, '')`），加时间戳前缀防重名
- 同时支持 MinIO 私有存储的无策略直传模式，通过 `useOss` 标志位切换两套上传逻辑

> 亮点关键词：**OSS 直传**、**临时签名鉴权**、**双存储适配**

---

## 五、多环境 Webpack 工程化配置

基于 Webpack 3 手工搭建，维护四套独立环境的构建链路，无 Vue CLI 脚手架依赖。

- `dev` / `test` / `pre` / `prod` 四套 `config/*.env.js`，分别注入不同的 `BASE_API`、
  `OSS_BUCKET_URL`、`LIVE_URL` 环境变量
- `build/` 目录下每套环境对应独立的 webpack 配置文件，生产/预发布开启 `UglifyJS` 压缩、
  `Bundle Analyzer` 体积分析，开发环境保留 `cheap-module-eval-source-map` 加速构建
- PostCSS 集成 `autoprefixer`，Babel 配置 `stage-2` + Vue JSX 支持

> 亮点关键词：**多环境构建链路**、**手工 Webpack 配置**、**工程化搭建能力**

---

## 六、可复用业务组件沉淀

沉淀了一套贯穿全业务的通用组件库，提升跨模块复用率。

| 组件 | 能力 |
|---|---|
| `multiUpload` / `singleUpload` | 支持 OSS/MinIO 双模式的图片上传，含数量限制、大小校验、预览 |
| `draggableUpload` | 支持拖拽排序的图片上传列表 |
| `videoUpload` / `liveUpload` | 视频和直播素材上传 |
| `Tinymce` | 集成富文本编辑器，含图片上传扩展 |
| `excelExport` | 基于 `xlsx` + `require.ensure` 按需加载的表格数据导出 |
| `choose-goods` | 商品选择弹窗（跨模块复用的选品组件） |
| `SelectShop` | 多店铺选择器，支持自定义渲染 |
| `statisticDate` | 统一的数据统计时间范围选择器（支持自然日/周/月/近 N 天/自定义等多种粒度） |

> 亮点关键词：**组件封装与复用**、**按需加载**、**业务组件标准化**

---

## 七、多标签页（TagsView）导航

实现了类浏览器多标签的页面导航体验。

- 路由变化时自动将当前页写入 Vuex `tagsView` 模块，标签栏实时同步
- 支持**中键点击**关闭标签、**右键菜单**（关闭当前/关闭其他/关闭全部）
- 切换标签后自动横向滚动定位至当前激活标签（`ScrollPane` 组件实现）
- 通过全局 `$bus` 事件总线支持外部模块触发"关闭全部标签"

> 亮点关键词：**多页签体验**、**Vuex 状态驱动导航**、**事件总线跨组件通信**

---

## 八、复杂数据可视化看板

集成多维度数据分析模块，涵盖电商核心指标的图表展示。

- 使用 `v-charts`（ECharts 封装）构建流量分析、交易数据、营销效果、商品分析等多个看板页面
- 集成 `heatmap.js` 实现页面热力图功能，可视化用户点击行为分布
- 数据统计模块抽取 `mixin/data.js`，统一管理日期维度选项（自然日/戴尔周/近 7 天/近 30 天/自定义）
  及筛选头部吸顶逻辑（`scroll` 事件监听 + `offsetTop` 判断），多个统计页面复用

> 亮点关键词：**数据可视化**、**ECharts**、**热力图**、**Mixin 复用**

---

## 九、大型多模块电商后台全链路覆盖

系统覆盖完整电商业务链路，模块体量大、业务逻辑复杂：

- **商品管理（PMS）**：SPU/SKU 管理、批量调价、属性配置
- **订单管理（OMS）**：订单处理、退款、物流
- **营销管理（SMS）**：优惠券、促销活动、秒杀
- **内容管理（CMS）**：文章、专题、帮助中心
- **用户与权限（UMS）**：管理员、角色、权限配置
- **会员体系**：积分、奖励、问卷活动
- **直播模块**：直播管理与素材上传
- **数据分析**：实时数据、流量分析、营销数据、商品分析多维看板

路由文件（`src/router/index.js`）近 2300 行，API 层（`src/api/`）按业务域分目录维护，
体现了对复杂大型前端工程的组织与拆分能力。

> 亮点关键词：**大型复杂前端项目**、**多模块业务覆盖**、**工程组织能力**
---
# [boss_mobile](D:\work\study\shujufenzxi\mobile)
> 项目：政采大数据分析平台（移动端）
> 技术栈：Vue 2.6 / Vuex / Vue Router / Webpack 2 / Express / ECharts / Axios

---

## 一、Vue SSR 同构渲染架构

- 基于 `vue-server-renderer` 实现完整的服务端渲染方案，搭建双入口（`entry-client.js` / `entry-server.js`）+ 双 Webpack bundle（client/server）的同构架构
- 服务端通过递归遍历匹配组件的 `asyncData` 钩子，使用 `Promise.all()` 并行预取数据，将结果序列化注入 `window.__INITIAL_STATE__`，客户端 hydration 时直接复用，避免二次请求
- SSR 配置 `runInNewContext: false`，复用 VM 上下文而非每次渲染创建新实例，有效降低内存压力与 GC 频率

---

## 二、多级缓存策略提升服务端吞吐

- Express 服务层实现两级缓存：组件级 LRU 缓存（上限 1000 个实例，TTL 15 分钟）+ URL 级 Micro-cache（1 秒短缓存），在保证数据时效性的前提下显著降低渲染开销
- 集成 `clientManifest`，服务端渲染时自动注入资源预加载（preload/prefetch）标签，消除客户端资源瀑布请求
- 生产/开发双模式切换：生产环境读取预编译 bundle，开发环境接入 webpack-dev-middleware + HMR，无需重启服务

---

## 三、Webpack 构建优化

- 针对 SSR 场景设计差异化构建配置：server bundle 使用 `target: 'node'` + `webpack-node-externals` 剔除 Node 原生模块，client bundle 使用 `VueSSRClientPlugin` 生成资产清单
- 生产配置采用三段式 CommonsChunkPlugin 拆包策略：vendor（三方库）、manifest（runtime）、async-commons（异步块公共代码，minChunks: 3），结合 `[chunkhash]` 命名实现长效缓存，业务代码更新不影响 vendor 缓存
- UglifyJS 开启多线程并行压缩，CSS 通过 OptimizeCSSPlugin 跨模块去重

---

## 四、自适应 REM 缩放方案

- 在 `index.html` 内联脚本中实现视口感知的动态 rem 基准值计算，覆盖 1600px 以下、1600–1920px、1920–2800px、2800px 以上四个断点，缩放倍率上限硬限为 2x，防止超宽屏下出现失控放大
- PostCSS 配置 `postcss-pxtorem`（rootValue: 37.5）全局自动将 px 转换为 rem，同时通过 `selectorBlackList` 排除 Vant 组件库，保留其原始尺寸逻辑

---

## 五、ECharts 地图多级下钻可视化

- 封装自定义 `extendsMap()` 方法扩展 ECharts 地理渲染能力，支持省 → 市 → 县三级地图下钻
- 地图 GeoJSON 数据按需异步 `import()`，结合 ECharts `registerMap` 动态注册，避免首屏加载全量地理数据
- 下钻/回溯时的缩放动画基于 `requestAnimationFrame` 递归驱动，保证 60fps 流畅过渡

---

## 六、移动端多点触控手势（捏合缩放）

- 手动实现 pinch-to-zoom：通过 `touchstart/touchmove` 事件捕获双指触点，使用欧几里得距离公式（`Math.hypot`）计算缩放比，结合 `requestAnimationFrame` 驱动 CSS transform 动画，避免 setTimeout 造成的帧率抖动
- 处理边界异常：第二手指在移动开始后加入时忽略，防止误触发缩放；缩放比硬限 [1, 3]，防止越界

---

## 七、Axios 请求层统一治理

- 封装全局 Axios 实例，请求拦截器自动从 Cookie 读取 `access_token` 并注入 Header，同时从 localStorage 读取 `regionGuid`、`year` 追加至所有请求参数，业务代码零感知
- 响应拦截器统一处理业务异常：5563 触发 WeChat OAuth 静默授权重定向（携带 `encodeURIComponent` 编码的回调地址），4009 静默吞掉防止重复提示，其余错误统一 toast 展示

---

## 八、路由级 keep-alive 与过渡动画

- `App.vue` 根据 `$route.meta.keepAlive` 条件渲染 `<keep-alive>` 包裹层，按需缓存高频页面，低频页面保持每次重新初始化，兼顾内存与体验
- 监听全局 `popstate` 事件检测浏览器回退行为，动态切换 slide-left / slide-right 过渡动画，提升移动端原生感；路由跳转后重置标记，防止状态污染

---

## 九、可拖拽仪表盘与布局持久化

- 使用 `vuedraggable` 实现仪表盘卡片自由拖拽排序，配置 `delay: 500` 防误触、`animation: 1000` 保证视觉流畅
- 拖拽结束后读取 DOM 渲染结果提取新顺序，持久化至 localStorage，下次进入页面自动恢复用户自定义布局

---

## 十、浮点精度修正与多尺度数字格式化

- 自定义 `toFixedFix` 函数：通过 2 倍精度中间值 + 可配置取整方式（ceil/floor/round）修正 JS 原生浮点运算误差，解决金额展示精度问题
- 千分位格式化采用循环正则替换方案，支持任意位数整数，无字符串长度限制
- 实现万/亿量级自动换算过滤器，输出"尾数 + 单位"结构，适配政务数据大数字展示场景

---
# [boss_web](D:\work\study\shujufenzxi\web)
> （政府采购大数据分析平台） 以下亮点按技术含金量排序，每条均有代码支撑，可按需裁剪后写入简历。

---

## 一、Vue 2 SSR 同构渲染架构

**可写方向：** 主导/参与搭建前端 SSR 同构方案，提升首屏性能与 SEO 能力。

**技术细节：**
- 基于 `vue-server-renderer` + Express，采用**双入口 Webpack 构建**（`entry-client.js` 负责客户端水合，`entry-server.js` 负责服务端预取数据），客户端通过 `window.__INITIAL_STATE__` 接管服务端 Vuex 状态，实现零白屏切换。
- 服务端使用 **LRU 组件级缓存**（max 1000 条，TTL 15 分钟）+ **路由级 Micro-Cache**（1 秒粒度），在不牺牲数据实时性的前提下显著降低服务端渲染压力。
- 开发环境自研 HMR 方案（`setup-dev-server.js`）：Client 编译器走 `webpack-hot-middleware`，Server 编译器输出写入内存文件系统（`memory-fs`），配合 `chokidar` 监听 HTML 模板变更，双编译器同时热更新，实现 SSR 下的完整开发体验。
- 页面组件通过静态方法 `asyncData(store, route)` 声明服务端数据预取逻辑，服务端 `Promise.all` 并行执行后再渲染，避免客户端二次请求。

**一句话提炼：**
> 搭建 Vue2 SSR 同构渲染体系，结合 LRU 组件缓存与路由级 Micro-Cache，首屏时间减少约 XX%（填写实际数据），支持 SEO 需求。

---

## 二、ECharts 可视化地图深度定制——多级下钻 + 动态数据联动

**可写方向：** 深度封装 ECharts，实现带下钻、动画、实时数据轮播的可交互大屏地图组件。

**技术细节：**
- **扩展 ECharts 核心**：在 `this.$echarts` 上挂载自定义方法 `extendsMap`，内部维护层级状态、坐标映射、事件绑定，外部只需传入配置项，实现"开箱即用的可下钻地图"。
- **多级地图下钻**：省 → 市 → 区县三级下钻，基于 GeoJSON 动态注册（`echarts.registerMap`），用 `dynamic import` 按需加载各省区划文件，避免首包过大；点击区域后通过 `requestAnimationFrame` 实现 zoom 缩放入场动画。
- **数据自动轮播**：`setInterval` 按排名顺序依次高亮各城市，配合 `effectScatter` 涟漪动效，同步向父组件 emit 当前城市数据，驱动右侧统计面板刷新，形成地图与图表联动的大屏效果。
- **多业态 Rich Text 标注**：同一地图组件支持"总体分析/主题分析/交易过程/采购单位"等多种业务模式，通过 `bussType` prop 切换，ECharts `label.formatter` 内构建不同结构的 Rich Text 字符串（含亿/万元自动换算、特殊字体渲染），无需多套组件。
- **权限感知渲染**：根据用户 `provinceGuid` 动态决定加载哪套区划数据，省级/市级/区县级用户看到不同层级的初始地图，地图下钻深度也随用户权限自适应。

**一句话提炼：**
> 深度封装 ECharts 地图组件，支持省市区三级下钻、数据轮播动效与多业态 Rich Text 标注，单组件复用于全系统 5+ 大屏页面。

---

## 三、通用异步表格组件封装

**可写方向：** 封装二次开发级别的通用表格组件，统一异步请求、分页、取消重复请求等能力。

**技术细节：**
- **双模式数据源**：同一组件支持传入 `url`（自动发起 HTTP 请求）或 `data`（直接渲染本地数据），外部 API 无差别，消费方无需关心数据来源。
- **请求竞态处理**：使用 `axios.CancelToken` 在每次发起新请求前取消上一次未完成的请求，彻底避免快速切换查询条件时的数据错乱问题。
- **防抖节流**：查询参数变更触发更新时内置 300ms 防抖，减少无效请求。
- **透传设计**：通过 `v-bind="$attrs"` 将未声明 prop 透传给底层 `el-table`，保留 Element UI 原生所有能力，同时通过 `slot` 支持自定义列，做到"扩展不破坏"。
- **分页自适应**：总数 ≤ 每页数量时自动隐藏页码跳转区域，保持 UI 整洁。

**一句话提炼：**
> 封装支持 URL/本地双模式、CancelToken 竞态防护、300ms 防抖的通用分页表格组件，在项目中统一替代重复的数据请求逻辑。

---

## 四、权限驱动的动态路由注入

**可写方向：** 实现基于后端菜单数据的运行时动态路由方案，支持按钮级权限控制。

**技术细节：**
- 登录后从接口获取菜单树，通过 `formatRoutes()` 递归将菜单节点转换为 Vue Router 路由配置，组件路径使用 Webpack `require([...], resolve)` 实现**异步懒加载**，按需分包。
- 通过 `router.addRoutes()` 在运行时动态注入路由，基础路由（登录页、404）与业务路由完全分离，菜单结构变更无需重新发布前端。
- Vuex `user` 模块维护 `permissions` 字典（`{ 'sys:user:add': true }`），在组件/指令层面做按钮级鉴权，与路由级鉴权形成双重防护。

**一句话提炼：**
> 实现菜单数据驱动的运行时路由注入 + 按钮级权限鉴权，支持多租户场景下不同用户看到不同菜单结构。

---

## 五、生产级 Axios 封装——全局上下文自动注入

**可写方向：** 封装全局 HTTP 层，统一处理鉴权、业务参数注入、IE 兼容及错误白名单。

**技术细节：**
- **请求拦截器**：自动向每个请求注入 `regionGuid`（地区标识，优先从 Cookie 读取）、`year`（从 Vuex 读取当前选中年份）、`_t`（时间戳，解决 IE 对 GET 请求的强缓存问题），业务代码完全无感知。
- **错误白名单机制**：响应拦截器内支持配置错误码白名单（支持字符串精确匹配和正则模式），白名单内的业务错误码不弹出全局提示，由各页面自行处理，避免"一刀切"的全局错误提示影响用户体验。
- **NProgress 进度条**：请求开始/结束自动控制顶部加载进度条，零侵入。

---

## 六、工具函数体系——加密、数据格式化、性能优化

**可写方向：** 建立团队级工具函数库，覆盖安全、展示、性能三个维度。

**技术细节：**
- **数据安全**：封装 `encryption()` 支持 AES-CBC 模式加密（`crypto-js`）和 Base64 两种策略；`md5()` 解决前后端中文字符集不一致导致的 MD5 值差异问题（先 UTF-8 decode 再计算）。
- **大数字展示**：`sy_number_format()` 实现金额自动分段，超过 1 万位时拆分为"亿+万元"两段分别展示，配合数码管字体渲染，满足政务大屏的可读性要求。
- **性能工具**：手写 `throttle`（固定间隔必触发）和 `debounce`（延迟触发）；`buildTree()` 用哈希映射将 O(n²) 的递归树构建优化到 O(n)。
- **浏览器兼容**：`fullscreenToggle()` 封装全屏 API 的四个厂商前缀，`IEVersion()` 精确识别 IE6～11 及 Edge，针对性降级。

---

## 七、响应式大屏适配方案

**可写方向：** 基于 `lib-flexible` + `px2rem-loader` 实现设计稿像素到多分辨率的自动适配。

**技术细节：**
- Webpack 构建期将 SCSS/CSS 中所有 `px` 值自动转换为 `rem`，`lib-flexible` 在运行时根据设备宽度动态设置 `html` 字体大小，实现"一套代码适配多种大屏分辨率"，无需为每个断点单独写媒体查询。
- 配合 `resize` 事件监听，ECharts 实例调用 `.resize()` 保持图表与容器同步缩放，避免图形错位。

---

## 参考提炼话术（可直接套用）

| 场景 | 话术 |
|------|------|
| 项目定性 | 面向政务场景的数据可视化分析平台，覆盖政府采购全流程数据的多维度分析展示 |
| 技术亮点 | Vue2 SSR 同构渲染 / ECharts 地图多级下钻 / 通用组件封装 / 动态权限路由 |
| 团队贡献 | 主导/负责 前端架构设计与核心组件封装，统一项目中 XX 个页面的数据请求与图表渲染规范 |
| 难点描述 | SSR 场景下的状态同步与 HMR 调试；地图组件多业态复用与下钻动画的性能优化 |
---