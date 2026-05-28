# 前端高级工程师题集（针对畅一凡简历定制）

> 6 年 Vue 技术栈 + 复杂 B 端经验 · 方向：高级前端工程师 / 前端技术专家
>
> **使用方式**：把这份当 checklist，每题在心里能讲出"是什么 / 为什么 / 怎么做 / 边界情况"四层即合格。
> **难度标记**：⭐ 基础 · ⭐⭐ 中等 · ⭐⭐⭐ 深度 · ⭐⭐⭐⭐ 原理级（高级岗必答）

---

## 第一部分：通用高级前端必考题

### 一、JavaScript 深度

#### 1.1 类型与判断
1. `typeof null === 'object'` 的历史原因？ ⭐⭐
2. 如何精准判断一个值的类型（包括 NaN / Symbol / Map / Set）？ ⭐⭐
3. `Object.prototype.toString.call(x)` 的内部机制？为什么这种方式最可靠？ ⭐⭐⭐
4. `==` 的完整比较算法（含对象 → 原始值的转换链路）？ ⭐⭐⭐
5. `0.1 + 0.2 !== 0.3` 的根因（IEEE 754）以及如何在金融场景规避？ ⭐⭐⭐

#### 1.2 原型与继承
1. 画出 `function Foo(){}` 的原型链（Foo / Foo.prototype / Foo.__proto__ / new Foo()）⭐⭐⭐
2. ES5 几种继承方案的差异（原型链、构造函数、组合、寄生组合、ES6 class）？ ⭐⭐⭐
3. `class A extends B` 编译后 ES5 的实现长什么样？`super` 如何工作？ ⭐⭐⭐⭐
4. `new` 操作符的完整执行步骤（4 步）？手写一个 `myNew`？ ⭐⭐⭐
5. `Object.create(null)` 创建的对象与普通对象的差异、应用场景？ ⭐⭐⭐

#### 1.3 作用域与闭包
1. let / const / var 的差异（变量提升、TDZ、块级作用域、重复声明）⭐⭐
2. 闭包的本质是什么？V8 是如何实现闭包变量保留的？ ⭐⭐⭐⭐
3. 闭包的常见内存泄漏场景 + 排查思路（Chrome Memory 面板）⭐⭐⭐
4. 立即执行函数（IIFE）在 ES6 之后是否还有意义？ ⭐⭐
5. `this` 的 4 种绑定规则 + 箭头函数为什么不能被 `bind`？ ⭐⭐⭐

#### 1.4 Promise / 异步
1. Promise A+ 规范的核心要点（状态机、then 链、值穿透）⭐⭐⭐
2. 手写一个符合 A+ 规范的 Promise ⭐⭐⭐⭐
3. `Promise.all` / `Promise.allSettled` / `Promise.race` / `Promise.any` 差异？ ⭐⭐
4. 实现一个带并发上限的 `Promise.all`（如最多 3 个并发）⭐⭐⭐
5. async/await 的本质（generator + co）？错误冒泡机制？ ⭐⭐⭐
6. 实现一个可取消的 Promise（结合 AbortController）⭐⭐⭐

#### 1.5 事件循环（EventLoop）
1. 浏览器 EventLoop vs Node.js EventLoop 的差异（6 个阶段）？ ⭐⭐⭐⭐
2. 宏任务 / 微任务的具体类型？`queueMicrotask` 的应用场景？ ⭐⭐⭐
3. `requestAnimationFrame` / `requestIdleCallback` 在 EventLoop 中的时机？ ⭐⭐⭐
4. 给一段含 setTimeout / Promise / async / DOM 渲染的代码，写出执行顺序 ⭐⭐⭐
5. 浏览器渲染流水线和 EventLoop 是怎么交织的？ ⭐⭐⭐⭐

#### 1.6 ES6+ 关键特性
1. Symbol 的应用场景（不可枚举属性、Well-known Symbol、私有标识）⭐⭐⭐
2. Proxy + Reflect 能做什么是 Object.defineProperty 做不到的？ ⭐⭐⭐
3. Generator 的本质（状态机 + 协程）？iterator 协议？ ⭐⭐⭐
4. WeakMap / WeakSet 的应用场景（缓存、私有数据、防内存泄漏）⭐⭐⭐
5. 顶层 `await`（ES2022）能用在哪里？打包工具如何处理？ ⭐⭐⭐

### 二、Vue 2 / 3 原理与实践

#### 2.1 响应式系统
1. Vue 2 的响应式实现（Object.defineProperty + Dep + Watcher）流程？ ⭐⭐⭐
2. Vue 2 为什么不能监听数组 push / 数组索引赋值 / 对象属性新增？ ⭐⭐⭐
3. Vue 3 用 Proxy 重写响应式的优势（深层代理、Map/Set 支持、数组监听）？ ⭐⭐⭐
4. Vue 3 的 `reactive` / `ref` / `shallowRef` / `toRef` / `toRefs` 差异？ ⭐⭐⭐
5. `effect` / `track` / `trigger` 的内部数据结构（targetMap → depsMap → dep）⭐⭐⭐⭐
6. Vue 3 调度器（scheduler）如何实现批量更新 + nextTick？ ⭐⭐⭐⭐
7. `computed` 的懒求值 + 脏检查机制 ⭐⭐⭐

#### 2.2 虚拟 DOM / Diff
1. Vue 2 的双端 diff 算法（首尾 + 首尾交叉 + key 查找）流程？ ⭐⭐⭐⭐
2. Vue 3 的快速 diff（最长递增子序列）相比 Vue 2 的提升点？ ⭐⭐⭐⭐
3. `key` 的作用？为什么不能用 index 作 key？ ⭐⭐⭐
4. 编译时优化：静态提升（hoistStatic）、补丁标志（PatchFlag）、块树（Block Tree）⭐⭐⭐⭐
5. `v-for` 和 `v-if` 同时使用为什么不推荐？Vue 2 和 Vue 3 的差异？ ⭐⭐

#### 2.3 组件 & 编译
1. SFC（单文件组件）的编译过程（template → AST → render function）⭐⭐⭐
2. Vue 3 Composition API 解决了 Options API 的什么痛点？ ⭐⭐
3. `<script setup>` 的编译产物 vs 普通 `setup()` 函数？ ⭐⭐⭐
4. provide / inject 的响应式注意事项 ⭐⭐
5. 自定义指令的 7 个生命周期（Vue 3）⭐⭐
6. Teleport / Suspense / Fragment 的实现原理 ⭐⭐⭐
7. KeepAlive 的缓存原理（include / exclude / max 的内部 LRU 实现）⭐⭐⭐⭐

#### 2.4 路由 / 状态管理
1. Vue Router 4 的 hash / history 模式底层 API（hashchange / pushState）⭐⭐
2. `router.beforeEach` 拦截器的执行流程？next 的几种调用方式陷阱？ ⭐⭐⭐
3. 动态路由（`router.addRoute`）+ 权限路由的最佳实践？刷新后路由丢失怎么处理？ ⭐⭐⭐
4. Pinia vs Vuex 的设计差异？为什么 Vue 3 推荐 Pinia？ ⭐⭐⭐
5. Pinia 的 store 是基于 reactive 还是 ref 实现？ ⭐⭐⭐

### 三、TypeScript

1. interface 和 type 的本质差异（声明合并、扩展性、原始类型支持）⭐⭐
2. 泛型约束（extends）、条件类型、`infer` 关键字应用 ⭐⭐⭐
3. 工具类型实现：`Partial` / `Required` / `Pick` / `Omit` / `Record` 手写 ⭐⭐⭐
4. `keyof` / `typeof` / `in` 操作符的组合应用（如对象 key 映射类型）⭐⭐⭐
5. `unknown` / `never` / `any` 的差异和使用场景 ⭐⭐
6. 协变（covariant）与逆变（contravariant）—— 函数参数的双向赋值问题 ⭐⭐⭐⭐
7. 装饰器（Decorator）的工作原理 + 应用场景 ⭐⭐⭐
8. 模块声明（`declare module`）& 第三方库无类型声明的处理 ⭐⭐⭐
9. `as const` / 字面量类型 / 字符串模板字面量类型的用法 ⭐⭐⭐
10. tsconfig 关键配置：`strict` 各子项、`paths`、`module`、`target` 的含义 ⭐⭐⭐

### 四、CSS

1. BFC 是什么？触发条件？解决什么问题（清除浮动、外边距合并）？ ⭐⭐
2. flex: 1 的完整含义（flex-grow / flex-shrink / flex-basis）⭐⭐
3. Grid 布局相比 Flex 的优势？什么场景该用 Grid？ ⭐⭐
4. position 5 个值的差异，sticky 的边界条件 ⭐⭐
5. CSS 优先级计算规则 + 选择器权重 ⭐⭐
6. 圣杯布局 / 双飞翼布局 / 三栏自适应布局的多种实现方式 ⭐⭐⭐
7. 1px 边框问题的解决方案（transform / svg / box-shadow / postcss）⭐⭐⭐
8. CSS 变量（custom properties）的运行时特性 vs Sass 变量的编译时 ⭐⭐⭐
9. 重排（reflow）vs 重绘（repaint）的触发条件和优化 ⭐⭐⭐
10. CSS 动画 vs JS 动画的性能差异（合成线程 / 主线程）⭐⭐⭐

### 五、浏览器与网络

#### 5.1 浏览器原理
1. 从输入 URL 到页面渲染的完整流程（细到 TCP / DNS / TLS）⭐⭐⭐⭐
2. 浏览器渲染流水线：DOM → CSSOM → Render Tree → Layout → Paint → Composite ⭐⭐⭐
3. 合成层（Composite Layer）的触发条件 + GPU 加速？ ⭐⭐⭐
4. Service Worker 的生命周期 + 应用场景（PWA / 离线缓存 / 推送）⭐⭐⭐
5. Web Worker / Shared Worker / Service Worker 三者的差异和通信方式 ⭐⭐⭐⭐
6. 浏览器存储：cookie / localStorage / sessionStorage / IndexedDB / Cache API 的容量、性能、适用场景 ⭐⭐⭐

#### 5.2 HTTP / 网络
1. HTTP 1.1 / HTTP 2 / HTTP 3 的核心差异（多路复用、队头阻塞、QUIC）⭐⭐⭐⭐
2. HTTPS 握手过程（TLS 1.2 vs 1.3）⭐⭐⭐
3. 强缓存（Expires / Cache-Control）vs 协商缓存（ETag / Last-Modified）的完整决策流程 ⭐⭐⭐
4. CORS 跨域：简单请求 / 复杂请求的差异？预检（OPTIONS）的作用？ ⭐⭐⭐
5. 同源策略限制的具体内容？哪些标签可以跨域加载？ ⭐⭐⭐
6. WebSocket vs SSE vs 长轮询的对比 ⭐⭐⭐
7. CSRF / XSS / 点击劫持的攻击原理与防御 ⭐⭐⭐

### 六、工程化

#### 6.1 Webpack
1. Webpack 的整体构建流程（compiler → compilation → module → chunk → asset）⭐⭐⭐⭐
2. Loader vs Plugin 的本质差异？分别在哪个阶段执行？ ⭐⭐⭐
3. Tree Shaking 的实现原理（ES Module 静态分析）+ sideEffects 配置 ⭐⭐⭐
4. SplitChunks 的 chunks: 'all' / 'async' / 'initial' 的含义 ⭐⭐⭐
5. 手写一个简单的 Loader / Plugin ⭐⭐⭐
6. Webpack 5 的 Module Federation 解决什么问题？ ⭐⭐⭐
7. HMR 的实现原理（websocket + module.hot.accept）⭐⭐⭐⭐
8. Webpack 优化清单：构建速度（cache / thread-loader / 缩小搜索范围）+ 体积（gzip / 分包 / tree-shaking）⭐⭐⭐

#### 6.2 Vite
1. Vite 为什么比 Webpack dev server 快？（ESM + esbuild 预构建）⭐⭐⭐
2. Vite 生产构建为什么不用 esbuild 而用 Rollup？ ⭐⭐⭐
3. Vite 插件机制 vs Webpack 插件机制（基于 Rollup 的扩展）⭐⭐⭐
4. Vite 的依赖预构建（dep optimization）做了什么？ ⭐⭐⭐

#### 6.3 Babel
1. Babel 的转译流程（parse → transform → generate）⭐⭐⭐
2. Babel preset-env + browserslist 的配合机制 ⭐⭐⭐
3. `@babel/plugin-transform-runtime` 解决了什么问题？ ⭐⭐⭐
4. polyfill 的几种引入方式（useBuiltIns: entry / usage）的差异 ⭐⭐⭐

### 七、性能优化

1. Web Vitals 三个核心指标：LCP / FID（INP）/ CLS 的含义和优化方向 ⭐⭐⭐
2. 首屏优化的完整清单（资源 / 网络 / 渲染 / 缓存 4 个层面）⭐⭐⭐
3. 大列表渲染：虚拟滚动的实现原理 + 边界问题（不定高度）⭐⭐⭐
4. 图片优化：webp / avif / 响应式图片 / 懒加载 / 占位符 ⭐⭐
5. 代码层面：debounce / throttle 的实现差异 + 应用场景 ⭐⭐
6. requestIdleCallback 实现"时间切片"的原理 ⭐⭐⭐
7. 内存泄漏的常见场景：全局变量 / 定时器 / 监听器 / DOM 引用 / 闭包 ⭐⭐⭐
8. Performance API：Navigation Timing / Resource Timing / Long Tasks API ⭐⭐⭐

### 八、设计模式 & 代码质量

1. 单例模式 / 工厂模式 / 观察者 vs 发布订阅 / 代理模式 / 策略模式 应用场景 ⭐⭐⭐
2. 高内聚低耦合 / 单一职责 / 开闭原则在前端组件设计中的应用 ⭐⭐⭐
3. Vue 自定义组件设计：受控 vs 非受控、命令式 vs 声明式 API ⭐⭐⭐
4. 函数式编程：纯函数 / 柯里化 / 组合（compose）⭐⭐⭐
5. RxJS 的核心概念（Observable / Operator / Subject / Scheduler）⭐⭐⭐

---

## 第二部分：针对你简历亮点的深挖题（必答）

> 这部分是你简历里写过的技术，官**一定**会让你深入讲。提前准备 STAR 答法（场景 / 任务 / 行动 / 结果）。

### A. Web Worker + SparkMD5 大文件分片上传

1. 为什么选 Worker 而不是 async + setTimeout 来切片？主线程开销对比？ ⭐⭐⭐
2. SparkMD5 增量计算 vs 一次性计算的内存差异？为什么 GB 级文件必须增量？ ⭐⭐⭐
3. Worker 和主线程之间的通信开销大吗？传递大文件用 postMessage 还是 Transferable Objects？ ⭐⭐⭐⭐
4. 断点续传服务端 `lack` 数组的设计：为什么按 hash 而不是按 index？ ⭐⭐⭐
5. 分片并发上传的策略：固定并发数 vs 滑动窗口？带宽自适应？ ⭐⭐⭐
6. 失败重试 5 次的设计：指数退避？立即重试？ ⭐⭐⭐
7. 如果分片上传到一半浏览器关闭，下次怎么续传？localStorage 持久化什么？ ⭐⭐⭐
8. 用 RxJS Subject 推送进度 vs EventEmitter 的差异？为什么选 RxJS？ ⭐⭐⭐

### B. SharedWorker 多 Tab 登录态同步

1. 为什么不用 localStorage + storage 事件？SharedWorker 的优势？ ⭐⭐⭐
2. SharedWorker 的生命周期？什么时候销毁？多 Tab 关闭最后一个会怎样？ ⭐⭐⭐
3. SharedWorker 在 Safari / 移动端的兼容性？降级方案？ ⭐⭐⭐
4. SharedWorker 内部如何区分不同 Tab？端口（port）管理？ ⭐⭐⭐⭐
5. 如果 SharedWorker 自身崩溃，多 Tab 状态如何恢复？ ⭐⭐⭐

### C. IndexedDB Promise 化 ORM

1. 你的 ORM 封装了哪些核心 API？跟原生 IndexedDB 比简化了什么？ ⭐⭐⭐
2. IndexedDB 的事务（transaction）模型，readonly / readwrite 的差异？ ⭐⭐⭐
3. IndexedDB 的索引（index）和主键（keyPath）的设计原则？ ⭐⭐⭐
4. 升级数据库版本（onupgradeneeded）的迁移策略？ ⭐⭐⭐
5. 你的 20+ ObjectStore 里有没有性能瓶颈？查询慢怎么排查？ ⭐⭐⭐
6. IndexedDB 与 localStorage 的容量、API、性能对比 ⭐⭐
7. 隐私模式 / Quota 限制下的容错（你提到的"打开失败删库重建"）⭐⭐⭐

### D. Vue 3 命令式弹窗 hzztDialog

1. `createApp` 单独挂载 vs 在主 App 内挂载的区别？ ⭐⭐⭐
2. 为什么必须手动注入 `appContext`？不注入会丢失什么？ ⭐⭐⭐⭐
3. 弹窗内的 i18n / 全局组件 / pinia store 是如何拿到的？ ⭐⭐⭐
4. `render(null, container)` 卸载组件的内部机制？为什么能防内存泄漏？ ⭐⭐⭐
5. 命令式 vs 声明式弹窗的取舍？什么场景该用哪个？ ⭐⭐⭐
6. 多个弹窗叠加的 z-index 管理？焦点管理？ESC 关闭策略？ ⭐⭐⭐

### E. RxJS 在 HTTP / WebSocket / 防重复提交场景

1. Subject / BehaviorSubject / ReplaySubject / AsyncSubject 差异？ ⭐⭐⭐
2. `throttleTime(100)` 合并错误 toast 的具体实现？为什么不用 lodash.throttle？ ⭐⭐⭐
3. Map + setTimeout 实现幂等锁的代码逻辑？为什么不用 RxJS exhaustMap？ ⭐⭐⭐
4. `distinctUntilChanged` 在 WebSocket 状态流转中的作用？比较函数怎么写？ ⭐⭐⭐
5. RxJS 操作符的"热"和"冷"Observable 的差异 ⭐⭐⭐⭐
6. 退订（unsubscribe）的时机？Vue 组件中如何避免泄漏？ ⭐⭐⭐

### F. 四层动态路由权限系统

1. 后端菜单树 → Vue Router 路由对象的递归转换算法？ ⭐⭐⭐
2. `router.addRoute` 在 Vue Router 4 中是同步还是异步？刷新后路由丢失的根因？ ⭐⭐⭐
3. 按钮级权限的 3 种实现方案（v-if / 自定义指令 / 函数封装）对比 ⭐⭐⭐
4. 动态路由 + chunk 按需加载，404 fallback 怎么设计？ ⭐⭐⭐
5. 多角色用户切换时的路由清理策略？ ⭐⭐⭐

### G. Token 滑动续期 Axios 封装

1. "假登录态突然掉线"问题的完整复现路径（用户感知 vs 实际状态）？ ⭐⭐⭐
2. 每次请求成功都续期 vs 定时续期 vs 临近过期才续期的取舍 ⭐⭐⭐
3. 401 静默刷新 token 时，**并发请求**怎么处理（队列收集 + 统一 replay）？手写一下伪代码 ⭐⭐⭐⭐
4. refresh_token 如果也过期怎么办？降级到登录页的 UX 设计？ ⭐⭐⭐
5. 为什么用 Cookie 存 token 而不是 localStorage？HttpOnly / SameSite 的安全性？ ⭐⭐⭐
6. CancelToken 全局取消 + axios.CancelToken 在 0.x 和 1.x 版本的 API 差异 ⭐⭐

### H. DICOM 医学影像集成（cornerstone.js）

1. WADO 协议是什么？跟 DICOM 文件直接加载的差异？ ⭐⭐⭐
2. 窗宽窗位（Window / Level）的本质是什么？为什么医学影像需要这个？ ⭐⭐⭐
3. cornerstone 的 enabledElement 状态管理 + 内存释放的注意事项 ⭐⭐⭐
4. KFB 数字切片和 DICOM 标准的差异？为什么需要适配层？ ⭐⭐⭐
5. STOMP WebSocket 和原生 WebSocket 的差异？为什么选 STOMP？ ⭐⭐⭐

### I. Vue 2 SSR 同构渲染

1. SSR vs CSR vs SSG 的差异？什么场景该用 SSR？ ⭐⭐⭐
2. 双入口（entry-client / entry-server）的代码同构原则？哪些 API 不能用？ ⭐⭐⭐⭐
3. `window.__INITIAL_STATE__` hydration 时如何避免 XSS（序列化注入风险）？ ⭐⭐⭐
4. LRU 组件级缓存的失效策略（max / TTL）？什么组件不能缓存？ ⭐⭐⭐
5. SSR 内存泄漏的常见场景（单例污染、闭包持有 req/res）⭐⭐⭐⭐
6. asyncData 静态方法 vs Nuxt 的 `setup` 异步预取的演进 ⭐⭐⭐

### J. ECharts 大屏地图多级下钻

1. ECharts 自定义系列 / 自定义 series-map 渲染的扩展点？ ⭐⭐⭐
2. 多个 ECharts 实例的内存管理（dispose / resize 监听） ⭐⭐⭐
3. 千级数据点的渲染性能瓶颈？大数据量优化方案（progressive）？ ⭐⭐⭐
4. 大屏适配方案对比：rem / vw / scale transform / 各自的优劣 ⭐⭐⭐

### K. CI/CD 卡顿排查（你的故事）

1. Chrome Performance 面板每个泳道的含义（Main / Network / Frames / Memory）⭐⭐⭐
2. Long Task 的定义？如何用 Long Tasks API 监控线上？ ⭐⭐⭐
3. JS bundle 语法降级异常具体表现是什么？怎么对比本地和线上产物？ ⭐⭐⭐⭐
4. browserslist + babel-preset-env 和 Node.js 版本的关联点？ ⭐⭐⭐
5. 如果让你建立"线上性能监控告警"机制，从 0 到 1 怎么做？ ⭐⭐⭐

### L. 工程化（多环境构建 / OSS 直传 / 通用组件库）

1. 时间戳 chunk 替代 contenthash 在长效缓存上的副作用？ ⭐⭐⭐
2. OSS 直传中临时 Policy 的安全设计（过期时间 / 范围限制）⭐⭐⭐
3. 通用业务组件的可复用性边界？什么应该抽组件，什么不该？ ⭐⭐⭐
4. UNI-APP 条件编译的实现机制？跟 Vue CLI 的 ifdef 有什么差异？ ⭐⭐⭐
5. 7 套 .env 维护的痛点？有没有更好的方案（envalid / dotenv-flow）？ ⭐⭐⭐

---

## 第三部分：场景题 / 开放题（高级岗高频）

1. 如果让你设计一个**前端微前端架构**，你会从哪些维度评估方案（qiankun / wujie / Module Federation / iframe）？
2. 一个 SPA 页面发布新版本后，用户停留在旧版本不刷新会有什么问题？如何提示更新？
3. 设计一个**前端埋点 SDK**：自动埋点 + 手动埋点 + 性能监控 + 错误监控，技术选型？
4. 让你从零搭建一个**B 端低代码平台**，前端架构怎么设计（拖拽 / Schema / 渲染器 / 物料）？
5. 大表单（100+ 字段）的性能瓶颈和优化思路（拆分 / 懒加载 / shouldUpdate）？
6. 一个项目代码体积 10MB+ 首屏过慢，怎么定位和优化？
7. 团队代码风格不统一 / Code Review 流于形式，作为高级工程师你会怎么推动？
8. 让你**设计一个组件库**（如内部团队用的），从架构、文档、版本管理、测试角度展开？
9. 在并发 100 个接口的页面上 token 失效了，你的 Axios 拦截器会发生什么？怎么修？
10. **降本增效**：让你减少团队前端开发人力 30%，技术上能怎么做？

---

## 第四部分：软技能 / HR 面常考

1. 介绍一下你最有成就感的一个项目（用 STAR 法回答，建议讲 **PIMS 的 Web Worker 上传** 或 **CI/CD 卡顿排查**）
2. 你遇到过最难解决的技术问题是什么？怎么定位和解决的？
3. 跟产品 / 后端 / 设计有过冲突吗？怎么处理？
4. 为什么从上家公司离职？为什么选我们公司？
5. 5 年后的职业规划？想做技术专家还是技术管理？
6. 你的优势和短板？短板怎么改进？
7. 如何持续学习？最近在看什么书 / 关注什么社区？
8. 加班和工作生活平衡你怎么看？
9. 你期望的薪资是多少？（**重点准备**：基于市场行情 + 自身价值 + 期望涨幅）
10. 反问环节准备 3-5 个有质量的问题（团队规模 / 技术栈 / 业务方向 / 成长机会 / OKR 文化）

---

## 准备建议

### 重点准备清单（按优先级）

| 优先级 | 内容 | 时间分配 |
|---|---|---|
| 🔴 必准备 | 第二部分（简历亮点深挖）| 60% |
| 🔴 必准备 | Vue 2/3 响应式 + Diff 原理 | 15% |
| 🟡 强化 | JS 基础进阶（闭包 / 原型 / Promise / EventLoop）| 10% |
| 🟡 强化 | 工程化 + 性能优化 | 10% |
| 🟢 加分 | TypeScript 高级类型 / 设计模式 | 5% |

### 模拟建议

1. 找朋友模拟 2-3 次，每次 60 分钟，全程录音回放
2. 重点训练 **STAR 法表达**：背景（为什么做）→ 任务（要解决什么）→ 行动（具体怎么做）→ 结果（量化收益）
3. 准备 **3-5 段标准故事**：技术亮点 / 难题攻坚 / 团队协作 / 失败教训 / 职业规划，每段控制在 2-3 分钟

### 常见踩坑

- ❌ 只讲"用了什么"，不讲"为什么这么选 / 别的方案为什么不行"
- ❌ 量化数据没有 → 简历里写的 35%、99% 等数字一定要能讲来源
- ❌ 八股文背了但讲不出工程实践 → 高级岗最忌讳
- ❌ 反问环节问薪资 / 加班 / 福利 → 反问要问业务和技术

---

**祝顺利 🎯**
