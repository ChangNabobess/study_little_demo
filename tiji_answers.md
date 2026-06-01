# 前端高级工程师面试题集（含参考答案）

> 6 年 Vue 技术栈 + 复杂 B 端经验 · 方向：高级前端工程师 / 前端技术专家
>
> **使用方式**：每题先自己回答，再对照参考答案补充；口语化讲出"是什么 / 为什么 / 怎么做 / 边界情况"四层即合格。
> **难度标记**：⭐ 基础 · ⭐⭐ 中等 · ⭐⭐⭐ 深度 · ⭐⭐⭐⭐ 原理级
> **重点优先级**：🔴 第二部分（简历深挖）> Vue 原理 > JS 进阶 > 工程化

---
## 第一部分：通用高级前端必考题


---

## 一、JavaScript 基础原理

### 1.1 类型与判断

**A1.1.1** `typeof null === 'object'` 的历史原因

这是 JS 最早期的一个 bug，从未修复是因为改了会破坏大量现有代码。底层原因：JS 早期用 32 位表示值，低 3 位是类型标签，`000` 代表 object。`null` 在内存里就是全 0（空指针），低 3 位也是 `000`，所以被误判成 object。MDN 直接标注为"已知 bug"。实际工作中判断 null 用严格等于 `=== null`，别用 typeof。

**A1.1.2** 精准判断类型

```js
function getType(x) {
  if (x !== x) return 'NaN'                    // NaN 唯一不等于自身
  if (x === null) return 'null'
  if (typeof x === 'symbol') return 'symbol'
  return Object.prototype.toString.call(x)     // [object Map] [object Set] 等
    .slice(8, -1).toLowerCase()
}
// 或者直接用 toString：
// [object Number] [object String] [object Map] [object Set] [object Null] 都能搞定
```

核心思路：`typeof` 只能区分原始类型（但 null/函数有特殊情况），精准判断必须走 `Object.prototype.toString`，NaN 用 `!== 自身` 是最简洁的。

**A1.1.3** `Object.prototype.toString.call(x)` 内部机制

规范里叫 `@@toStringTag`，ES2015 之前引擎内部维护了一张 `[[Class]]` 属性表，每种内置类型（Array/Date/Map 等）都有预设值，toString 读的就是这个内部槽。ES6 后可以用 `Symbol.toStringTag` 自定义：

```js
class MyClass {
  get [Symbol.toStringTag]() { return 'MyClass' }
}
Object.prototype.toString.call(new MyClass()) // "[object MyClass]"
```

为什么最可靠：它读的是对象内部的 `[[Class]]`/`toStringTag`，不受原型链污染；而 `instanceof` 依赖原型链，跨 iframe 会失效（不同 realm 的 Array 原型不同）。

**A1.1.4** `==` 的完整比较算法

核心规则按优先级：
1. 类型相同 → 直接用 `===`（NaN !== NaN）
2. `null == undefined` → true，其余情况 null/undefined 与任何非 null/undefined 都是 false
3. **数字 vs 字符串** → 字符串转数字再比
4. **任意 vs 布尔** → 布尔先转数字（`true→1, false→0`），再重走规则
5. **对象 vs 原始值** → 对象调 `ToPrimitive`：先 `valueOf()`，返回原始值则用，否则调 `toString()`

```js
[] == false
// [] → ToPrimitive → "" → 0；false → 0；0 == 0 → true
{} == "[object Object]"  // {} ToPrimitive → "[object Object]" → true
```

面试直接说：**能不用 `==` 就别用**，项目里 ESLint 强制 eqeqeq。

**A1.1.5** `0.1 + 0.2 !== 0.3` 的根因与金融处理

IEEE 754 双精度浮点，用二进制表示小数，`0.1` 和 `0.2` 在二进制里都是无限循环小数，64 位截断后精度丢失，相加结果是 `0.30000000000000004`。

金融场景规避方案：
```js
// 方案1：转整数运算（推荐）
const add = (a, b) => {
  const factor = Math.pow(10, Math.max(
    (a.toString().split('.')[1] || '').length,
    (b.toString().split('.')[1] || '').length
  ))
  return (Math.round(a * factor) + Math.round(b * factor)) / factor
}

// 方案2：用 toFixed + parseFloat（注意 toFixed 也有坑）
parseFloat((0.1 + 0.2).toFixed(10))

// 方案3：用 decimal.js / big.js 库（生产推荐）
```
<span style="color: red;">Java中支持金融相关数据类型是BigDecimal</span>

真实项目中金额计算一律用 `decimal.js`，不手写。

---

### 1.2 原型与继承

**A1.2.1** `function Foo(){}` 的原型链

```
Foo 实例
  └──[[Prototype]]──▶ Foo.prototype
                         └──[[Prototype]]──▶ Object.prototype
                                               └──[[Prototype]]──▶ null

Foo（函数本身）
  └──[[Prototype]]──▶ Function.prototype
                         └──[[Prototype]]──▶ Object.prototype

Foo.prototype.constructor === Foo  // true
Foo.__proto__ === Function.prototype  // true
Function.prototype.__proto__ === Object.prototype  // true
```
 `prototype`<span style="color: yellow;">（原型对象）</span>
 `__proto__`<span style="color: yellow;">（隐式原型）</span>

关键点：**函数既是对象（有 `[[Prototype]]` 链向 `Function.prototype`），也有 `prototype` 属性**（供实例继承用）。两条链不要混。

**A1.2.2** ES5 继承方案差异

| 方案 | 原型链 | 构造函数属性 | 实例独立属性 |
|------|--------|------------|------------|
| 原型链继承 | ✅ | 子类不调父构造 | 引用属性共享（坑） |
| 构造函数继承 | ❌无父方法 | ✅ | ✅ |
| 组合继承 | ✅ | ✅ | ✅但父构造调两次 |
| 寄生组合继承 | ✅ | ✅ | ✅ 最优 |

```js
// 寄生组合继承（最优方案）
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype)
  Child.prototype.constructor = Child
}
function Parent(name) { this.name = name }
function Child(name, age) {
  Parent.call(this, name)  // 借用构造函数，属性独立
  this.age = age
}
inherit(Child, Parent)
```

为什么寄生组合最好：只调一次父构造函数，原型链完整，实例属性独立。class 语法糖底层就是这个。

**A1.2.3** `class A extends B` 编译后实现 + super 工作原理

```js
// class A extends B 编译后核心逻辑
function _inherits(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype, {
    constructor: { value: subClass }
  })
  Object.setPrototypeOf(subClass, superClass)  // 静态方法也继承！
}

function A(x) {
  // super(x) 编译为：
  var _this = _callSuper(this, A, [x])  // 调 B.call(this, x)
  _this.ownProp = 'xxx'
  return _this
}
```

super 两种用途：1) 构造器里 `super()` = 调父类构造函数，**ES6 子类必须先调 super 才能用 this**（因为 this 由父类创建）；2) 方法里 `super.method()` = 沿原型链找父类方法。

**A1.2.4** new 操作符的完整执行步骤

```js
function myNew(Ctor, ...args) {
  // 1. 创建新对象，原型指向构造函数的 prototype
  const obj = Object.create(Ctor.prototype)
  // 2. 执行构造函数，绑定 this
  const result = Ctor.apply(obj, args)
  // 3. 如果构造函数返回了对象类型，用那个对象；否则用新创建的 obj
  return (typeof result === 'object' && result !== null) || typeof result === 'function'
    ? result : obj
}
```

4 步：**创建空对象** → **设置原型** → **执行构造函数** → **返回（优先构造函数返回的对象）**。第 3 步的返回值判断是很多人忘的细节。

**A1.2.5** `Object.create(null)` 的差异和应用

`Object.create(null)` 创建的对象没有任何原型（`__proto__` 为 null），不继承 `toString/hasOwnProperty` 等方法。

应用场景：
- **纯字典/Map** 场景：当 key 可能是 `constructor/toString/hasOwnProperty` 这类字符串时，用普通对象会出 bug
- **Vue 2/3 源码**大量用来存内部缓存对象，避免原型污染
- **防原型链攻击**：JSON 解析不可信数据时，用 `Object.create(null)` 接收避免原型投毒

```js
const dict = Object.create(null)
dict['toString'] = 'hello'  // 安全，不会覆盖原型方法
```

---

### 1.3 作用域与闭包

**A1.3.1** let/const/var 差异

| | var | let | const |
|---|---|---|---|
| 变量提升 | 提升+初始化为 undefined | 提升但 TDZ，访问报错 | 同 let |
| 块级作用域 | ❌ | ✅ | ✅ |
| 重复声明 | ✅ | ❌ | ❌ |
| 全局挂载 | 挂到 window | ❌ | ❌ |
| 重新赋值 | ✅ | ✅ | ❌（绑定不可变，值可变） |

TDZ（Temporal Dead Zone）：let/const 声明前的区域，**变量已在作用域登记但不可访问**，访问抛 ReferenceError。这是引擎在编译阶段就扫描到了声明，但运行时在初始化语句之前设置了不可访问标记。

**A1.3.2** 闭包的本质 + V8 实现

闭包本质：**函数 + 其词法环境的引用**。即一个函数能访问并"记住"定义时所在作用域的变量，即使那个作用域已执行完毕。

V8 实现：V8 不会保留整个作用域对象，而是在编译阶段分析哪些变量被闭包引用，只把这些变量存进 **Context（堆上的上下文对象）**，函数对象持有指向 Context 的指针。没被引用的变量仍在栈帧上，函数返回后正常回收。

```js
function outer() {
  let x = 1    // 被闭包引用 → 分配到 Context（堆）
  let y = 2    // 未被引用 → 栈上，outer 返回后回收
  return function inner() { return x }
}
const fn = outer()  // outer 栈帧销毁，但 Context{x:1} 存活，fn 持有引用
```

这就是为什么闭包变量不会被 GC 回收——只要函数引用存在，Context 就存活。

**A1.3.3** 闭包内存泄漏场景 + 排查

常见场景：
1. **定时器/事件监听忘记清除**：回调闭包了大对象，timer 不清除就一直占内存
2. **全局变量意外持有**：`window.xxx = function(){ /* 闭包了大数据 */ }`
3. **Vue 组件 `beforeDestroy` 没清监听**：事件回调闭包了 vm 实例，组件销毁了但回调还在

```js
// 泄漏例子
function createLeak() {
  const bigData = new Array(1000000).fill('x')
  document.addEventListener('click', function handler() {
    console.log(bigData[0])  // bigData 永远不释放
  })
  // 忘记 removeEventListener
}

// 排查：Chrome DevTools → Memory → Heap Snapshot
// 对比两次快照，找 Detached DOM Tree 和意外增长的对象
```

排查工具：Chrome Memory 面板，Heap Snapshot，Allocation Timeline。

**A1.3.4** IIFE 在 ES6 后是否还有意义

大部分场景 ES6 模块+块级作用域已经替代了 IIFE，但还有用处：
- **立即执行的逻辑块**：需要 `await` 在顶层模块外用（不过顶层 await 已支持）
- **库打包**：UMD 格式的包还在用 IIFE 包裹整个模块，避免全局污染
- **避免污染 polyfill/脚本环境**：`<script>` 标签里没用模块系统的老代码

ES6 模块天然有自己的作用域，在模块系统里 IIFE 基本无意义了。工程里基本只在打包产物和 polyfill 里见。

**A1.3.5** this 的 4 种绑定规则 + 箭头函数

```
1. 默认绑定：普通调用 fn()，非严格 → window/global，严格 → undefined
2. 隐式绑定：obj.fn()，this → obj
3. 显式绑定：fn.call/apply/bind(ctx)，this → ctx
4. new 绑定：new Fn()，this → 新创建的实例
优先级：new > 显式 > 隐式 > 默认
```

箭头函数为什么不能 bind：箭头函数没有自己的 `this`，它捕获的是**定义时外层词法作用域的 this**，这个在函数创建时就固定了。`bind/call/apply` 的机制是修改函数内部的 `[[ThisValue]]`，但箭头函数根本没有这个内部槽，调用 `bind` 不会报错，但 this 不会变化。

---

### 1.4 Promise / 异步

**A1.4.1** Promise A+ 规范核心要点

三要素：
1. **状态机**：pending → fulfilled 或 pending → rejected，状态一旦改变不可逆
2. **then 链**：`then` 返回新 Promise，支持链式调用；回调里 return 的值会被 resolve，throw 会 reject
3. **值穿透**：`then(null, null)` 时，值/错误穿透到下一个 then；确保 Promise 可以被跳过转发

异步执行保证：then 的回调**必须异步执行**（微任务），即使 Promise 已 resolved，也不能同步调用回调，这保证了行为一致性。

**A1.4.2** 手写 Promise（符合 A+ 规范核心）

```js
class MyPromise {
  constructor(executor) {
    this.state = 'pending'; this.value = undefined
    this.callbacks = []  // [{onFulfilled, onRejected, resolve, reject}]
    const resolve = val => {
      if (this.state !== 'pending') return
      this.state = 'fulfilled'; this.value = val
      queueMicrotask(() => this.callbacks.forEach(cb => this._handle(cb)))
    }
    const reject = reason => {
      if (this.state !== 'pending') return
      this.state = 'rejected'; this.value = reason
      queueMicrotask(() => this.callbacks.forEach(cb => this._handle(cb)))
    }
    try { executor(resolve, reject) } catch(e) { reject(e) }
  }
  _handle({ onFulfilled, onRejected, resolve, reject }) {
    const fn = this.state === 'fulfilled' ? onFulfilled : onRejected
    if (typeof fn !== 'function') {
      return this.state === 'fulfilled' ? resolve(this.value) : reject(this.value)
    }
    try { resolve(fn(this.value)) } catch(e) { reject(e) }
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const cb = { onFulfilled, onRejected, resolve, reject }
      if (this.state === 'pending') this.callbacks.push(cb)
      else queueMicrotask(() => this._handle(cb))
    })
  }
}
```

**A1.4.3** Promise.all/allSettled/race/any 差异

| 方法 | 成功条件 | 失败条件 | 返回值 |
|------|--------|--------|--------|
| all | 全部 fulfilled | 任一 rejected | fulfilled 数组 / 第一个 rejection |
| allSettled | 全部结束（不管结果） | 永不 reject | `[{status, value/reason}]` |
| race | 第一个结束 | 第一个 reject | 第一个结果 |
| any | 任一 fulfilled | 全部 rejected | 第一个 fulfilled / AggregateError |

项目场景：`allSettled` 做并行请求时不想因一个失败而中断；`any` 做多源容灾（哪个 CDN 先响应用哪个）。

**A1.4.4** 带并发上限的 Promise.all

```js
async function limitConcurrency(tasks, limit = 3) {
  const results = []
  const executing = new Set()
  for (const [i, task] of tasks.entries()) {
    const p = Promise.resolve().then(() => task()).then(r => {
      results[i] = r
      executing.delete(p)
    })
    executing.add(p)
    if (executing.size >= limit) await Promise.race(executing)
  }
  await Promise.allSettled(executing)
  return results
}
// 用法：limitConcurrency([() => fetch(url1), () => fetch(url2)...], 3)
```

核心思路：维护一个"运行中"的 Set，满了就 `race` 等最快的一个完成，再继续推入。

**A1.4.5** async/await 的本质 + 错误冒泡

async/await 是 **generator + 自动执行器（co 库思路）** 的语法糖。babel 把 async 函数编译成 generator，用 `_asyncToGenerator` 包装：每次 `yield` 一个 Promise，等 resolve 后 `gen.next(value)` 继续执行；reject 则 `gen.throw(error)`。

错误冒泡：`await` 的 Promise reject 会在当前 async 函数里抛出异常，没有 try/catch 则冒泡给调用方的 Promise 链。实际项目中：
```js
// 推荐：统一错误处理
async function safeCall(promise) {
  try { return [await promise, null] }
  catch(e) { return [null, e] }
}
const [data, err] = await safeCall(fetchUser())
```

**A1.4.6** 可取消的 Promise（AbortController）

```js
function cancellableRequest(url) {
  const controller = new AbortController()
  const promise = fetch(url, { signal: controller.signal })
    .then(r => r.json())
  return {
    promise,
    cancel: () => controller.abort()
  }
}

// 使用
const { promise, cancel } = cancellableRequest('/api/data')
// 路由跳转时取消
onBeforeUnmount(() => cancel())
```

AbortController 是原生取消机制，fetch/XHR/EventListener 都支持 signal。自定义 Promise 无法真正"停止"，但可通过 signal 约定取消行为（如不 resolve/reject）。

---

### 1.5 事件循环（EventLoop）

**A1.5.1** 浏览器 EventLoop vs Node.js EventLoop

**浏览器**：宏任务队列 + 微任务队列，每个宏任务执行完清空所有微任务，然后考虑渲染，再取下一个宏任务。

**Node.js** 有 6 个阶段（libuv 驱动）：
1. **timers**：执行 setTimeout/setInterval
2. **pending callbacks**：系统回调（TCP 错误等）
3. **idle/prepare**：内部使用
4. **poll**：I/O 回调，阻塞等待
5. **check**：setImmediate 回调
6. **close callbacks**：socket.on('close') 等

Node.js 微任务（nextTick + Promise）在**每个阶段切换时**清空，`process.nextTick` 优先于 Promise 微任务。v11 后 Node 行为对齐浏览器，每个宏任务后立即清微任务。

**A1.5.2** 宏任务/微任务类型 + queueMicrotask

宏任务：`setTimeout` `setInterval` `setImmediate`(Node) `MessageChannel` `I/O` `UI渲染` `script标签`
微任务：`Promise.then/catch/finally` `queueMicrotask` `MutationObserver` `process.nextTick`(Node，最优先)

`queueMicrotask` 应用场景：需要在当前同步代码执行完、DOM 更新前插入逻辑，比如 Vue 2 的 `nextTick` 降级实现，或者需要比 Promise 更轻量的微任务调度（不需要错误处理时）。

**A1.5.3** rAF/rIC 在 EventLoop 中的时机

- **requestAnimationFrame（rAF）**：在浏览器**渲染前**执行，和渲染流水线绑定，每帧开始时（Layout 前），适合做动画/DOM 更新
- **requestIdleCallback（rIC）**：在**一帧渲染完成后**如果还有空闲时间（帧剩余时间 > 0）才执行，适合做低优先级任务（日志上报、预加载）

时序：`宏任务 → 微任务 → rAF → 渲染(Layout+Paint) → rIC（空闲时）`

注意：rIC 有 `deadline.timeRemaining()`，超时要主动让出，React Scheduler 的时间切片就是基于这个原理（实际用 MessageChannel 模拟，兼容性更好）。

**A1.5.4** 混合代码的执行顺序

```js
console.log('1')                           // 同步
setTimeout(() => console.log('2'), 0)      // 宏任务
Promise.resolve().then(() => console.log('3'))  // 微任务
async function fn() {
  console.log('4')
  await Promise.resolve()
  console.log('5')  // await 后 = then 回调 = 微任务
}
fn()
console.log('6')
// 输出顺序：1 → 4 → 6 → 3 → 5 → 2
```

规律：同步 → 微任务（按注册顺序）→ 宏任务。`await` 后面的代码等价于 `.then()` 的回调。

**A1.5.5** 浏览器渲染流水线与 EventLoop 交织

浏览器不是每个宏任务都渲染，只有**屏幕刷新时机（通常 16.7ms/帧）** 才触发渲染。EventLoop 里一帧内可能跑多个宏任务，直到渲染时机到来才做一次渲染。

流程：`EventLoop取宏任务 → 执行 → 清微任务 → (如果到渲染时机) → rAF → Style/Layout/Paint/Composite → rIC → 下一帧`

实践意义：在一个宏任务里批量操作 DOM，引擎会合并（因为渲染是异步的）；但强制读 layout 属性（offsetWidth 等）会触发**强制同步布局**（layout thrashing），性能很差。

---

### 1.6 ES6+ 关键特性

**A1.6.1** Symbol 的应用场景

1. **私有/内部属性**：`for...in` 和 `Object.keys` 不能枚举 Symbol key，做半私有属性
2. **防命名冲突**：给对象加扩展属性时用 Symbol，不污染用户代码
3. **协议实现**：内置 Symbol 协议—`Symbol.iterator` 定义可迭代、`Symbol.toStringTag` 自定义类型名、`Symbol.toPrimitive` 自定义类型转换
4. **单例枚举**：每个 Symbol 唯一，适合做状态枚举常量

```js
const TYPE = {
  ADD: Symbol('add'),
  DELETE: Symbol('delete')
}
// 不会和其他模块的 'add' 字符串冲突
```

**A1.6.2** Proxy + Reflect 比 Object.defineProperty 的优势

| 能力 | defineProperty | Proxy |
|------|---------------|-------|
| 数组索引/length 变化 | ❌ | ✅ |
| 属性新增/删除 | ❌ | ✅（has/deleteProperty） |
| 拦截类型 | 只有 get/set | 13 种 trap |
| 懒初始化嵌套 | 需递归遍历所有属性 | 访问时才创建子 Proxy |
| 非对象类型 | 无法拦截 | Map/Set/数组都支持 |

Reflect 配合 Proxy 的意义：保证拦截后**默认行为语义正确**（Reflect.get 正确处理原型链），同时把"是否操作成功"通过返回值传达，而不是抛异常。

**A1.6.3** Generator 本质 + iterator 协议

Generator 本质是**状态机**：函数体被切割成多段，每次 `next()` 执行到下一个 `yield`，函数暂停并保存执行上下文。底层是协程（coroutine）——比线程更轻，可以手动切换。

Iterator 协议：对象有 `[Symbol.iterator]()` 方法，返回有 `next()` 的迭代器，`next()` 返回 `{value, done}`。Generator 函数自动实现了这个协议。

```js
function* range(start, end) {
  for (let i = start; i < end; i++) yield i
}
// 可用 for...of / 解构 / spread 消费
[...range(0, 5)]  // [0, 1, 2, 3, 4]
```

**A1.6.4** WeakMap/WeakSet 应用场景

弱引用：key（WeakMap）或 value（WeakSet）不阻止 GC 回收，对象被回收后自动从集合移除。

应用场景：
- **DOM 节点关联数据**：`weakMap.set(domEl, metadata)`，DOM 删除后数据自动释放
- **实现私有属性**：类构造器里 `weakMap.set(this, privateData)`，外部无法访问
- **缓存/记忆化**：以对象为 key 缓存计算结果，对象 GC 后缓存自动清除，不用手动管理
- **Vue 3 源码**：`reactiveMap/readonlyMap` 用 WeakMap 存 proxy 映射，target 销毁后自动清理

**A1.6.5** 顶层 await 的适用范围 + 打包工具处理

顶层 await 只能用在 **ES Module**（`type="module"` 的 script 或 `.mjs` 文件），不能在 CJS 模块用（CJS 是同步加载的）。

原理：使用顶层 await 的模块，相当于把整个模块包在一个 async 函数里，依赖这个模块的其他模块会等它 resolve 后才执行。

打包工具处理：
- **Vite**：原生支持（基于 ESM），开发环境直接用，生产环境配置 target 为支持顶层 await 的环境
- **Webpack 5**：设置 `experiments.topLevelAwait: true`，编译为 async 模块
- 注意：如果 target 是老环境，打包工具会把它转为 IIFE async 包裹，有兼容性问题

---

## 二、Vue 2/3 原理与实践

### 2.1 响应式系统

**A2.1.1** Vue 2 响应式实现流程

1. **Observer**：遍历 data 对象，对每个属性调 `Object.defineProperty`，把 getter/setter 替换
2. **Dep**：每个属性对应一个 Dep 实例，管理订阅者列表
3. **Watcher**：组件渲染/computed/watch 各对应一个 Watcher
4. **依赖收集**：getter 触发时（渲染读取数据），当前活跃 Watcher 注册到该属性的 Dep
5. **派发更新**：setter 触发时，Dep 通知所有 Watcher，Watcher 把自己加入异步队列，下一个 tick 批量更新

```
data.x (get) → Dep.depend() → watcher 收集
data.x = y  (set) → Dep.notify() → watcher.update() → queue → nextTick → 重新渲染
```

**A2.1.2** Vue 2 无法监听数组/新增属性的原因

`Object.defineProperty` 只能拦截**已知属性**的 get/set。
- **数组 push/pop/splice**：这些操作不经过属性 setter（length 变了但 defineProperty 拦截不到 length），Vue 2 选择 hack——重写了数组的 7 个变异方法（push/pop/shift/unshift/splice/sort/reverse）
- **索引赋值 `arr[0] = x`**：直接索引赋值绕过了 Vue 的 setter，必须用 `Vue.set(arr, 0, x)`
- **新增属性 `obj.newKey = x`**：defineProperty 时属性不存在，getter/setter 没有被定义，必须用 `Vue.set(obj, 'newKey', x)`

这是 Vue 3 换 Proxy 的核心动力。

**A2.1.3** Vue 3 Proxy 重写响应式的优势

1. **拦截所有操作**：get/set/has/deleteProperty/ownKeys 等 13 种 trap，数组索引和 length 变化都能拦截
2. **懒递归**：访问到嵌套对象时才创建 Proxy（`get` trap 里按需 `reactive(val)`），不需要初始化时递归整个对象树
3. **Map/Set/WeakMap 都能代理**：Vue 3 专门处理了集合类型
4. **更好的性能**：不需要递归 defineProperty，大对象初始化更快

```js
// Vue 3 reactive 核心逻辑（简化）
const handler = {
  get(target, key, receiver) {
    track(target, key)  // 依赖收集
    const res = Reflect.get(target, key, receiver)
    if (isObject(res)) return reactive(res)  // 懒递归
    return res
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)  // 触发更新
    return result
  }
}
```

**A2.1.4** Vue 3 reactive/ref/shallowRef/toRef/toRefs 差异

- **reactive**：深层响应式 Proxy，只能包对象，解构会丢失响应性
- **ref**：包任意类型（原始值用 `RefImpl` 包装，对象内部用 reactive），访问需 `.value`，模板里自动解包
- **shallowRef**：只有 `.value` 的赋值是响应式，value 内部属性变化不触发更新，用于大数据集性能优化
- **toRef**：把 reactive 对象的某个属性转成 ref，**保持响应式连接**，用于单独传递某个属性给子组件
- **toRefs**：把整个 reactive 对象每个属性都转成 ref，解构后不丢失响应性

```js
const state = reactive({ x: 1, y: 2 })
const { x, y } = toRefs(state)  // x.value === state.x，修改同步
```

**A2.1.5** effect/track/trigger 内部数据结构

```
targetMap: WeakMap<target, Map<key, Set<ReactiveEffect>>>
              目标对象 → 属性名 → 该属性的依赖 effect 集合
```

- `track(target, key)`：把当前 activeEffect 加入 `targetMap[target][key]` 这个 Set
- `trigger(target, key)`：找到 `targetMap[target][key]` 里所有 effect，调度执行
- **ReactiveEffect**：包装了副作用函数，有 deps（反向依赖列表）、scheduler（调度器）、dirty 标志

这个结构的精妙：每次 effect 执行前**先清空自己的所有依赖**，执行时重新收集，保证依赖是最新的（条件渲染分支切换时旧分支的依赖会被清除）。

**A2.1.6** Vue 3 调度器批量更新 + nextTick

组件更新 effect 有 scheduler：不直接执行，而是调 `queueJob(job)` 把 job 放入队列，然后调 `queueFlush()` 用 Promise.then 异步刷新队列（微任务）。

```js
// 伪代码
function queueFlush() {
  if (!isFlushing) {
    isFlushing = true
    Promise.resolve().then(flushJobs)  // 微任务批量执行
  }
}
// nextTick 就是在这个 Promise 后面挂一个 then
function nextTick(fn) {
  return fn ? currentFlushPromise.then(fn) : currentFlushPromise
}
```

同一个 tick 里多次修改响应式数据，只会触发一次渲染（job 用 Set 去重）。nextTick 的回调在 flush 完成后执行，此时 DOM 已更新。

**A2.1.7** computed 懒求值 + 脏检查

computed 基于 `ReactiveEffect` 实现，有一个 `dirty` 标志（初始 true）。
- 首次访问或依赖变化后：`dirty = true`，下次 `.value` 时重新计算
- 依赖没变：`dirty = false`，直接返回缓存值，不重新计算
- 依赖变化时：通过 scheduler 把 `dirty` 设回 true，并通知依赖 computed 的 effect

这就是"懒求值"：**不用时不计算，用时才算，算过了缓存，依赖变了才重算**。

---

### 2.2 虚拟 DOM / Diff

**A2.2.1** Vue 2 双端 Diff 算法流程

新旧两个 children 各取头尾 4 个指针（oldStart/oldEnd/newStart/newEnd），每轮比较：
1. 新头 vs 旧头 → 相同则两头指针同时右移
2. 新尾 vs 旧尾 → 相同则两尾指针同时左移
3. 旧头 vs 新尾 → 相同则把旧头节点移到旧尾之后，指针内移
4. 旧尾 vs 新头 → 相同则把旧尾节点移到旧头之前，指针内移
5. 以上都不匹配 → 用 newStart 的 key 在旧节点中查找，找到则移动，没找到则新建

这种双端策略对常见场景（头尾插入、反转列表）做了优化，减少节点移动次数。

**A2.2.2** Vue 3 快速 Diff 相比 Vue 2 的提升

Vue 3 的快速 Diff 核心改进：
1. **预处理**：先从头从尾分别处理相同的前缀/后缀，跳过不需要 diff 的部分
2. **最长递增子序列（LIS）**：对中间乱序部分，找出不需要移动的节点（LIS），**只移动不在 LIS 里的节点**，最小化 DOM 移动次数

```
旧: a b c d e
新: a d b c e
LIS(映射后的索引): [b, c] 不需要动，只需移动 d
```

Vue 2 双端 diff 无法避免多余移动；Vue 3 通过 LIS 算法达到**理论最优移动次数**，大列表性能提升明显。另外配合编译时的 Block Tree 和 PatchFlag，大量跳过不需要 diff 的静态节点。

**A2.2.3** key 的作用 + 为什么不能用 index

key 告诉 diff 算法**哪个新节点对应哪个旧节点**，实现节点复用而非销毁重建。

用 index 作 key 的问题：列表顺序变化时（增删、排序），index 和节点的对应关系变了，diff 会把原本可以复用的节点当成不同节点处理，还可能错误复用（把 A 的 key 给了 B 的节点）导致状态错乱。

```
// 例子：带 input 的列表，用 index 作 key，删第一项
旧: [<input key=0 val="A">, <input key=1 val="B">]
新: [<input key=0 val="B">]  // diff 以为 key=0 的节点没变，复用了 input，val 还是 A！
```

用唯一业务 ID 作 key 才能正确识别节点身份。

**A2.2.4** 编译时优化：静态提升/PatchFlag/Block Tree

- **静态提升（hoistStatic）**：纯静态节点（无绑定）提升到渲染函数外，只创建一次，后续直接复用引用，不重新 createVNode
- **PatchFlag**：编译时标记动态内容类型（`1=text, 2=class, 4=style, 8=props`...），运行时 diff 只检查有 PatchFlag 的内容，跳过静态部分
- **Block Tree**：组件/if/for 等有动态结构的地方创建 Block，Block 用扁平数组收集**内部所有动态子节点**，diff 时直接对这个数组做，不需要逐层递归整棵 vdom 树

本质：把运行时 diff 的工作量**前移到编译期**，运行时只做最少的比较。

**A2.2.5** v-for 和 v-if 同时使用问题

Vue 2：`v-for` 优先级高于 `v-if`，两者同在一个元素上时**先循环再判断**，每次渲染都要把列表全跑一遍再过滤，性能浪费。
Vue 3：`v-if` 优先级高于 `v-for`，`v-if` 里访问不到 `v-for` 的迭代变量，容易出 undefined 错误。

推荐做法：用 `<template>` 包裹分开写，或者提前用 computed 过滤数组：
```html
<!-- 推荐 -->
<ul>
  <template v-for="item in filteredList" :key="item.id">
    <li>{{ item.name }}</li>
  </template>
</ul>
```

---

### 2.3 组件 & 编译

**A2.3.1** SFC 的编译过程

Vue SFC（.vue 文件）编译分两阶段：
1. **@vue/compiler-sfc 解析**：把 `<template>/<script>/<style>` 拆分，各自处理
2. **template 编译**：`compiler-dom` 把模板 AST → 转换优化（静态提升/PatchFlag）→ 生成 render 函数代码字符串
3. **script 处理**：`<script setup>` 由 `compileScript` 做宏处理（defineProps/defineEmits/defineExpose 等转换）
4. **style 处理**：scoped 样式加 hash 属性选择器，CSS Modules 生成 $style 对象

Vite 里 `@vitejs/plugin-vue` 负责这个流程，把 .vue 文件转成 JS 模块。

**A2.3.2** Composition API 解决 Options API 的痛点

1. **逻辑分散**：同一功能的数据/方法/生命周期被强制拆散到各个选项里，代码阅读要跳来跳去
2. **逻辑复用**：Mixin 复用有命名冲突、来源不清晰的问题；Composition API 用 composable 函数，依赖关系显式，可以 tree-shake
3. **TypeScript 友好**：Options API 里 this 类型推断很弱；Composition API 纯函数，TS 类型推断完美
4. **测试友好**：composable 函数可以单独测试，不依赖组件实例

**A2.3.3** `<script setup>` 编译产物 vs 普通 setup()

```vue
<!-- 源码 -->
<script setup>
import { ref } from 'vue'
const props = defineProps({ msg: String })
const count = ref(0)
</script>
```

编译产物核心：
```js
export default {
  setup(__props, { expose }) {
    const props = __props  // defineProps 转为访问 __props
    const count = ref(0)
    expose({})  // 默认不暴露任何内容（隔离性更好）
    return { count }  // 模板用到的变量自动 return
  }
}
```

差异：`<script setup>` 里顶层变量**自动暴露给模板**，不需要手动 return；默认 `expose({})` 隐藏内部实现，父组件 ref 拿到的是空对象（需要 defineExpose 明确暴露）。

**A2.3.4** provide/inject 的响应式注意事项

provide 传入的值**本身不会自动变成响应式**，需要主动传 reactive/ref 对象：

```js
// 正确做法：provide reactive/ref
const theme = ref('dark')
provide('theme', theme)  // 传 ref，inject 收到的是 ref，.value 有响应性

// 如果要防止子组件修改，用 readonly 包装
provide('theme', readonly(theme))
```

inject 没有接收到值时用默认值：`inject('theme', 'light')`。Vue 3 推荐用 Symbol 作 key 避免命名冲突。

**A2.3.5** 自定义指令的 7 个生命周期（Vue 3）

```js
const myDirective = {
  created(el, binding, vnode, prevVnode) {},       // 元素创建，属性绑定前
  beforeMount(el, binding, vnode, prevVnode) {},   // 插入 DOM 前
  mounted(el, binding, vnode, prevVnode) {},       // 插入 DOM 后
  beforeUpdate(el, binding, vnode, prevVnode) {},  // 组件更新前
  updated(el, binding, vnode, prevVnode) {},       // 组件更新后
  beforeUnmount(el, binding, vnode, prevVnode) {}, // 卸载前
  unmounted(el, binding, vnode, prevVnode) {}      // 卸载后
}
```

`binding` 包含：`value`（指令值）、`arg`（指令参数如 `v-dir:arg`）、`modifiers`（修饰符对象）。

**A2.3.6** Teleport/Suspense/Fragment 实现原理

- **Teleport**：渲染时把 vnode 插入到指定的 `to` 容器（可以是 body 等），但逻辑上仍是父组件的子树（props/inject 继承正常），实现了**渲染位置和逻辑位置分离**。用于 Modal/Toast 等需要逃逸 overflow 的场景
- **Suspense**：内部维护两个 slot（default 和 fallback），当 default 里有 async setup/动态 import 未完成时，渲染 fallback；全部完成后切换到 default。本质是捕获子树里的异步 Promise
- **Fragment**：允许组件有多个根节点，编译时把多个根节点包成数组型 vnode，渲染时逐个插入，不需要额外 DOM 容器节点

**A2.3.7** KeepAlive 缓存原理（LRU）

KeepAlive 内部用 `Map` 存缓存（key → vnode），用 `Set` 记录 key 的使用顺序实现 LRU：

```js
// 伪代码
const cache = new Map()  // key → vnode
const keys = new Set()   // 按访问顺序记录 key

// 访问时
if (cache.has(key)) {
  keys.delete(key); keys.add(key)  // 移到最近
  return cache.get(key)
} else {
  cache.set(key, vnode); keys.add(key)
  if (keys.size > max) {
    // 删除最久未使用的（Set 第一个元素）
    const oldestKey = keys.values().next().value
    pruneCacheEntry(oldestKey)
  }
}
```

被缓存的组件不会触发 `mounted/unmounted`，而是触发 `activated/deactivated`。组件实例和 DOM 被保留在内存里，切回来时直接激活。

---

### 2.4 路由 / 状态管理

**A2.4.1** Vue Router 4 的 hash/history 模式底层 API

- **hash 模式**：用 `location.hash` 和 `hashchange` 事件。URL 里 `#` 后面的部分不会发送给服务器，刷新不会 404，但 URL 不美观，SEO 差
- **history 模式**：用 HTML5 `history.pushState/replaceState` 修改 URL（不触发请求），监听 `popstate` 事件（浏览器前进/后退时触发）。URL 干净，但服务器需要配置所有路径返回 index.html

```js
// history 模式核心
history.pushState({ path }, '', url)  // 改 URL 不刷新
window.addEventListener('popstate', handlePop)  // 监听前进/后退
```

**A2.4.2** router.beforeEach 执行流程 + next 的陷阱

守卫执行顺序：`全局beforeEach → 路由独享beforeEnter → 组件内beforeRouteEnter → 全局beforeResolve → 导航确认 → 全局afterEach`

next 的陷阱（Vue Router 3）：
- 必须调 `next()`，忘了调会导致导航永久挂起
- `next(false)` 取消，`next('/path')` 跳转，`next(error)` 抛错

Vue Router 4 已改进：可以直接 return，`return false` 取消，`return '/path'` 跳转，不用 next，更符合直觉：
```js
router.beforeEach((to, from) => {
  if (!isAuthenticated()) return '/login'  // 不用 next
})
```

**A2.4.3** 动态路由 + 权限路由最佳实践

推荐方案：
1. 登录后获取用户权限，根据权限**过滤路由表**
2. 用 `router.addRoute()` 动态添加路由
3. 权限路由信息存 store，**同时持久化到 localStorage/sessionStorage**

刷新路由丢失的原因：`addRoute` 是运行时操作，刷新后重新初始化路由表只有静态路由。解决方案：
```js
// 路由守卫里检查
router.beforeEach(async (to) => {
  if (!store.routesAdded && isLoggedIn()) {
    await store.loadPermissions()
    store.dynamicRoutes.forEach(r => router.addRoute(r))
    return to.fullPath  // 重定向到当前路径，使动态路由生效
  }
})
```

**A2.4.4** Pinia vs Vuex 设计差异

| | Vuex | Pinia |
|---|---|---|
| 模块化 | namespaced modules，繁琐 | 每个 store 独立，天然模块化 |
| mutation | 必须通过 mutation 修改 | 直接修改 state，去掉 mutation |
| TypeScript | 类型推断很弱 | 完美 TS 支持，自动推断 |
| Devtools | ✅ | ✅（更好的时间旅行） |
| 体积 | 较大 | 约 1KB，tree-shakable |
| API 风格 | 选项式 | 支持选项式和组合式两种 |

Pinia 去掉 mutation 是因为 mutation 的唯一价值是"追踪状态变更"，Devtools 已经可以通过 Proxy 追踪了，mutation 成了纯样板代码。

**A2.4.5** Pinia 的 store 实现原理

Pinia 的 store 底层基于 `reactive()`（选项式 store）或直接使用组合式 API：

```js
// 选项式 store 底层简化
function defineStore(id, options) {
  return function useStore() {
    const state = reactive(options.state())  // state 用 reactive 包装
    const getters = {}
    for (const key in options.getters) {
      getters[key] = computed(() => options.getters[key].call(state, state))
    }
    return markRaw({ ...state, ...getters, ...options.actions })
  }
}
```

组合式 store 本质：就是 `setup()` 函数，ref/reactive/computed 自由使用，return 出去就是 store 的内容。`$patch` 实现批量更新，底层是 `reactive` 的属性赋值。

---

## 三、TypeScript

**A3.1** interface 和 type 的本质差异

```ts
// interface: 描述对象"形状"，可声明合并（augmentation）
interface User { name: string }
interface User { age: number }  // 合并！User 同时有 name 和 age

// type: 类型别名，可以是任意类型，不能合并
type ID = string | number  // union，interface 做不到
type Tuple = [string, number]  // 元组
```

核心区别：
- interface **可以被 implements**（类实现），type 可以但不推荐
- interface **支持声明合并**，适合给第三方库扩展类型
- type 可以表达 **union/intersection/tuple/mapped types** 等复杂类型
- 工程上：对象形状用 interface，复杂类型组合用 type

**A3.2** 泛型约束 + 条件类型 + infer

```ts
// 泛型约束
function getKey<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

// 条件类型
type IsArray<T> = T extends any[] ? true : false

// infer：在条件类型中推断类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
type UnpackPromise<T> = T extends Promise<infer U> ? U : T

// 分布式条件类型：T 是 union 时会被分发
type ToArray<T> = T extends any ? T[] : never
// ToArray<string | number> => string[] | number[]
```

infer 的核心作用：在"匹配模式"里挖出你想要的类型片段，像正则的捕获组。

**A3.3** 工具类型手写

```ts
type MyPartial<T> = { [K in keyof T]?: T[K] }
type MyRequired<T> = { [K in keyof T]-?: T[K] }  // -? 去掉可选
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }
type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>
type MyRecord<K extends keyof any, V> = { [P in K]: V }
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }

// Exclude/Extract 基于分布式条件类型
type MyExclude<T, U> = T extends U ? never : T
type MyExtract<T, U> = T extends U ? T : never
```

**A3.4** keyof/typeof/in 组合应用

```ts
const config = { host: 'localhost', port: 3000 }

type Config = typeof config           // { host: string; port: number }
type ConfigKey = keyof Config         // "host" | "port"

// 映射类型用 in 遍历 union
type Stringify<T> = { [K in keyof T]: string }

// 实际应用：类型安全的事件系统
type EventMap = { click: MouseEvent; keydown: KeyboardEvent }
function on<K extends keyof EventMap>(event: K, handler: (e: EventMap[K]) => void) {}
on('click', e => e.clientX)  // e 自动推断为 MouseEvent
```

**A3.5** unknown/never/any 差异

- **any**：类型系统逃逸口，关闭类型检查，不安全，不要乱用
- **unknown**：类型安全的 any，**使用前必须收窄类型**（typeof/instanceof/类型断言），用于不知道类型的外部输入（JSON.parse 返回值等）
- **never**：表示不可能存在的类型，穷举检查的利器，函数永不返回（死循环/throw）时返回 never

```ts
// unknown 收窄
function process(val: unknown) {
  if (typeof val === 'string') val.toUpperCase()  // 收窄后才能操作
}

// never 穷举检查
type Shape = 'circle' | 'square'
function draw(shape: Shape) {
  if (shape === 'circle') return
  if (shape === 'square') return
  const _exhausted: never = shape  // 如果 Shape 新增类型，这里编译报错
}
```

**A3.6** 协变与逆变

协变（Covariant）：子类型可以赋给父类型 → **返回值类型是协变的**
逆变（Contravariant）：父类型可以赋给子类型 → **函数参数类型是逆变的**

```ts
type Animal = { name: string }
type Dog = { name: string; bark(): void }  // Dog extends Animal

// 函数返回值：协变（可以返回更具体的类型）
type GetAnimal = () => Animal
type GetDog = () => Dog
const f: GetAnimal = (() => ({ name: 'dog', bark(){} })) as GetDog  // ✅ 安全

// 函数参数：逆变（接受更宽泛的参数才安全）
type HandleDog = (d: Dog) => void
type HandleAnimal = (a: Animal) => void
const h: HandleDog = ((a: Animal) => {}) as HandleAnimal  // ✅ 安全，反之不安全
```

TS 默认对方法参数是双向协变（`strictFunctionTypes` 关闭），开启严格模式后函数参数才是逆变的。

**A3.7** 装饰器工作原理 + 应用场景

装饰器本质是**高阶函数**，在类/方法/属性定义时执行（不是实例化时），接收 target/key/descriptor 等参数。

```ts
// 方法装饰器示例
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function(...args: any[]) {
    console.log(`calling ${key} with`, args)
    return original.apply(this, args)
  }
  return descriptor
}

class Service {
  @log
  getData(id: number) { /* ... */ }
}
```

应用场景：NestJS 里 `@Injectable/@Controller/@Get` 做依赖注入和路由注册；`@observable/@computed`（MobX）；权限校验、日志、缓存、性能监控等 AOP 场景。

**A3.8** declare module & 第三方库无类型声明处理

```ts
// 给 window 扩展属性
declare global {
  interface Window { __APP_CONFIG__: Record<string, string> }
}

// 给第三方模块补类型
declare module 'some-untyped-lib' {
  export function doSomething(x: string): number
  export default class MyLib { constructor(opts: object) }
}

// .d.ts 文件放哪：tsconfig 的 typeRoots 或 types 字段，
// 或在文件里直接 /// <reference types="xxx" />
```

实践：npm 上先找 `@types/xxx`，没有则自己写 `src/types/xxx.d.ts`，宁可写宽松的 `declare module 'xxx'` 也不要 `ts-ignore` 满天飞。

**A3.9** as const / 字面量类型 / 模板字面量类型

```ts
// as const：推断为最窄的字面量类型，且 readonly
const config = { env: 'production', port: 3000 } as const
// 推断为 { readonly env: "production"; readonly port: 3000 }

// 字面量类型
type Direction = 'left' | 'right' | 'up' | 'down'

// 模板字面量类型（TS 4.1+）
type EventName = 'click' | 'focus'
type Handler = `on${Capitalize<EventName>}`  // "onClick" | "onFocus"

// 实际应用：生成类型安全的 CSS 变量名
type CSSVar<T extends string> = `--${T}`
type Colors = CSSVar<'primary' | 'secondary'>  // "--primary" | "--secondary"
```

**A3.10** tsconfig 关键配置

```json
{
  "compilerOptions": {
    "target": "ES2020",           // 编译产物语法版本
    "module": "ESNext",           // 模块系统
    "moduleResolution": "bundler",// 模块解析策略，Vite/Webpack 用 bundler
    "strict": true,               // 开启所有严格检查（必须）
    "noUncheckedIndexedAccess": true, // 索引访问包含 undefined
    "paths": { "@/*": ["src/*"] },// 路径别名
    "baseUrl": ".",
    "types": ["vite/client"],     // 手动指定 @types 包
    "isolatedModules": true,      // 每文件独立编译（Vite/esbuild 需要）
    "skipLibCheck": true          // 跳过 .d.ts 类型检查，提速
  }
}
```

`strict` 包含：`noImplicitAny/strictNullChecks/strictFunctionTypes` 等 7 项，新项目必开。

---

## 四、CSS

**A4.1** BFC 是什么

BFC（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素布局不影响外部。

触发条件：`overflow` 非 visible、`float` 非 none、`position: absolute/fixed`、`display: flex/grid/inline-block`、`contain: layout`

解决的问题：
- **清除浮动**：BFC 内的 float 不会溢出到父元素外（父元素高度塌陷问题）
- **阻止 margin 合并**：BFC 和外部元素的 margin 不会合并
- **阻止被 float 遮盖**：BFC 区域不与 float 元素重叠，实现自适应两栏布局

**A4.2** flex: 1 的完整含义

`flex: 1` 是简写，完整是 `flex: 1 1 0`，即：
- `flex-grow: 1`：有剩余空间时等比扩展
- `flex-shrink: 1`：空间不足时等比收缩
- `flex-basis: 0`：基础尺寸为 0（从 0 开始分配，而非从内容尺寸开始）

注意：`flex: 1` 和 `flex: auto`（= `1 1 auto`）的区别在于 basis：`flex: 1` 所有子项平分空间；`flex: auto` 先考虑内容尺寸再按比例分剩余空间。

**A4.3** Grid vs Flex 优势 + 使用场景

Flex 是**一维布局**（行或列），适合组件内部对齐、导航栏、按钮组等线性布局。
Grid 是**二维布局**（行+列同时控制），适合整体页面布局、棋盘式卡片、复杂表单。

```css
/* Grid 更适合：复杂网格布局 */
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 40px;
  grid-template-areas: "header header" "sidebar main" "footer footer";
}
```

什么时候选 Grid：需要同时控制行列对齐、跨行跨列、响应式瀑布流，这些用 Flex 很难实现。

**A4.4** position 5 个值 + sticky 边界条件

- `static`：默认，不定位
- `relative`：相对自身正常位置偏移，**占据原空间**
- `absolute`：相对最近的**非 static 祖先**定位，脱离文档流
- `fixed`：相对**视口**定位，脱离文档流，滚动不动
- `sticky`：滚动到阈值前是 relative，超过后是 fixed（相对最近滚动容器）

sticky 失效的常见原因：
- 父元素有 `overflow: hidden/auto/scroll`（破坏粘性上下文）
- 没有设置 `top/left/bottom/right` 阈值
- 父元素高度不够（sticky 元素没有滚动空间）

**A4.5** CSS 优先级计算

优先级从高到低：`!important > inline style > ID > class/伪类/属性 > 元素/伪元素 > * > 继承`

权重（a, b, c, d）：
- a: `!important`
- b: inline style（1000）
- c: ID 选择器（100）
- d: class/伪类/属性（10）
- e: 元素/伪元素（1）
- 通配符 `*`（0）

```css
#nav .item:hover { }  /* 100 + 10 + 10 = 120 */
.container .item { }  /* 10 + 10 = 20 */
```

同权重按**出现顺序**，后面覆盖前面。

**A4.6** 三栏布局实现

```css
/* 方案1：Flex（推荐） */
.container { display: flex; }
.left { width: 200px; flex-shrink: 0; }
.right { width: 200px; flex-shrink: 0; }
.main { flex: 1; }

/* 方案2：Grid */
.container { display: grid; grid-template-columns: 200px 1fr 200px; }

/* 方案3：圣杯（float + margin 负值） */
.main { float: left; width: 100%; padding: 0 200px; }
.left { float: left; width: 200px; margin-left: -100%; position: relative; right: 200px; }
.right { float: left; width: 200px; margin-left: -200px; position: relative; left: 200px; }
```

实际工作用 Flex 或 Grid，圣杯/双飞翼了解原理即可，现在不会真的用。

**A4.7** 1px 边框问题

原因：Retina 屏 dpr=2，CSS 1px 对应物理 2px，视觉上偏粗。

解决方案：
```css
/* 方案1：transform 缩放（推荐） */
.border::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid #ccc;
  transform: scale(0.5);
  transform-origin: 0 0;
  width: 200%; height: 200%;
}

/* 方案2：viewport meta 设置 initial-scale=0.5（影响全局） */
/* 方案3：border-image 用 1px 图片 */
/* 方案4：box-shadow 模拟 */
.item { box-shadow: 0 0 0 0.5px #ccc; }
```

**A4.8** CSS 变量 vs Sass 变量

| | CSS 变量（自定义属性） | Sass 变量 |
|---|---|---|
| 运行时 | ✅ 可 JS 动态修改 | ❌ 编译时确定 |
| 作用域 | DOM 树继承（`:root` 全局） | 文件作用域 |
| 响应媒体查询 | ✅ 可在 @media 里覆盖 | ❌ |
| 浏览器支持 | IE 不支持 | 编译为普通 CSS，全支持 |

CSS 变量实现主题切换：`document.documentElement.style.setProperty('--primary', '#f00')` 一行搞定，Sass 变量做不到运行时切换。

**A4.9** 重排 vs 重绘

- **重排（Reflow）**：几何属性变化（width/height/top/padding/font-size...），需要重新计算布局，**触发重排必然触发重绘**，代价高
- **重绘（Repaint）**：外观变化但不影响布局（color/background/visibility...），只重新绘制，代价中

优化：
```js
// 批量读写，避免强制同步布局
const width = el.offsetWidth  // 读（触发 flush layout）
el.style.width = width + 10 + 'px'  // 写

// 用 class 批量修改样式（不是一条条 style）
// 用 documentFragment 批量 DOM 操作
// 动画元素用 position: absolute/fixed 脱离文档流
// 用 transform/opacity（只触发合成，不重排不重绘）
```

**A4.10** CSS 动画 vs JS 动画性能

- **CSS 动画**：`transform/opacity` 变化由**合成线程**处理，不经过主线程，主线程阻塞也不影响动画；`will-change: transform` 提前创建合成层
- **JS 动画**：运行在主线程，JS 忙时会卡，但逻辑可控（暂停/反转/基于数据驱动）

最佳实践：**纯 UI 动画用 CSS（transform/opacity），需要交互/物理/逻辑的用 JS 配合 rAF**。GSAP 等库在 JS 动画里也会优先用 transform/opacity 保证性能。

---

## 五、浏览器与网络

### 5.1 浏览器原理

**A5.1.1** 从输入 URL 到页面渲染完整流程

1. **URL 解析**：确认协议、域名、路径
2. **DNS 解析**：浏览器缓存 → OS 缓存 → 本地 hosts → 递归 DNS 查询
3. **TCP 三次握手**（HTTPS 还有 TLS 握手）
4. **HTTP 请求/响应**
5. **HTML 解析**：边下载边解析，构建 DOM 树；遇到 CSS 下载解析 CSSOM；遇到 JS 默认阻塞（defer/async 可并行）
6. **渲染树构建**：DOM + CSSOM → Render Tree（不含 display:none）
7. **Layout（回流）**：计算每个节点的几何信息
8. **Paint（绘制）**：生成绘制指令
9. **Composite（合成）**：分层合成，GPU 加速，提交屏幕

关键路径优化：减少阻塞资源（CSS 放头部/JS 放底部/defer）、减少 RTT（CDN/HTTP2 多路复用）。

**A5.1.2** 浏览器渲染流水线

```
DOM → CSSOM → Render Tree → Layout → Paint → Composite → 屏幕
```

- **Style**：将 CSS 规则匹配到 DOM 节点，计算 computed style
- **Layout**：计算每个元素的位置尺寸（box model）
- **Paint**：把元素绘制成位图，分层（Layer）
- **Composite**：把各 Layer 合并提交给 GPU 显示

`transform/opacity` 直接在 Composite 阶段处理，跳过 Layout 和 Paint，所以最高效。

**A5.1.3** 合成层触发条件 + GPU 加速

触发合成层（独立 Layer）：
- `will-change: transform/opacity`
- `transform: translateZ(0)` 或 `translate3d`（hack 方法）
- `opacity` 动画、`filter` 动画
- `position: fixed`
- `iframe/video/canvas`

GPU 加速原理：合成层的渲染由 GPU 线程负责，不占用主线程，滚动/动画更流畅。但每个合成层需要额外内存（上传纹理），层爆炸（layer explosion）会导致内存暴涨，要谨慎。

**A5.1.4** Service Worker 生命周期 + 应用场景

生命周期：`install（安装，缓存静态资源）→ waiting（等待旧 SW 失效）→ activate（激活，清理旧缓存）→ fetch（拦截请求）`

```js
self.addEventListener('install', e => {
  e.waitUntil(caches.open('v1').then(c => c.addAll(['/index.html', '/app.js'])))
})
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)))
})
```

应用场景：PWA 离线缓存、资源预加载、后台同步、推送通知。注意：只能在 HTTPS 下工作，同一页面只有一个 SW 生效。

**A5.1.5** Web Worker/Shared Worker/Service Worker 差异

| | Web Worker | Shared Worker | Service Worker |
|---|---|---|---|
| 作用域 | 单个页面 | 多个页面共享 | 代理网络请求 |
| 生命周期 | 随页面 | 随最后一个连接页面 | 独立，可后台运行 |
| 通信 | postMessage | port.postMessage | postMessage/客户端 |
| 访问 DOM | ❌ | ❌ | ❌ |
| 主要用途 | CPU 密集计算 | 多 tab 共享状态 | 缓存/推送/离线 |

**A5.1.6** 浏览器存储对比

| | cookie | localStorage | sessionStorage | IndexedDB | Cache API |
|---|---|---|---|---|---|
| 大小 | 4KB | 5MB | 5MB | 数百MB | 动态 |
| 过期 | 可设置 | 永久 | 标签关闭 | 永久 | 手动管理 |
| 随请求 | ✅（HttpOnly/Secure） | ❌ | ❌ | ❌ | ❌ |
| 主要用途 | 会话/认证 | 用户设置 | 临时状态 | 大量结构化数据 | SW 缓存资源 |

---

### 5.2 HTTP / 网络

**A5.2.1** HTTP 1.1/2/3 核心差异

- **HTTP 1.1**：持久连接（keep-alive）、管道化（不实用）、队头阻塞（一个请求慢了后面全堵）
- **HTTP 2**：多路复用（一个 TCP 连接并发多请求）、头部压缩（HPACK）、服务端推送、二进制分帧。TCP 层仍有队头阻塞
- **HTTP 3**：基于 QUIC（UDP 上实现可靠传输），彻底解决队头阻塞（每个流独立），0-RTT 握手，连接迁移（换 IP 不断连）

实际工程：nginx 开 http2 是标配，http3 正在推进中（Chrome 已支持）。

**A5.2.2** HTTPS 握手（TLS 1.2 vs 1.3）

TLS 1.2（2-RTT）：
1. Client Hello（支持的算法列表）
2. Server Hello + 证书 + Server Key Exchange
3. Client Key Exchange（协商密钥）
4. 双方 Finished → 开始加密通信

TLS 1.3（1-RTT，0-RTT 复用）：
- 合并了多个消息，ClientHello 直接带密钥交换参数
- 只支持 ECDHE 等前向保密算法，废弃了 RSA 密钥交换
- 0-RTT 复用：已建立过连接的客户端可以在 ClientHello 里带加密数据（但有重放攻击风险，GET 只读请求才用）

**A5.2.3** 强缓存 vs 协商缓存决策流程

```
请求 → 有缓存？
  → 检查强缓存：Cache-Control: max-age / Expires
    → 未过期 → 直接用（200 from cache）
    → 已过期 → 协商缓存：
      → 发请求带 If-None-Match（ETag）或 If-Modified-Since（Last-Modified）
        → 服务器未变 → 304 Not Modified（用本地缓存）
        → 服务器已变 → 200 + 新内容
```

实践：HTML 用 `no-cache`（每次协商），JS/CSS 文件名带 hash 用 `max-age=31536000`（强缓存），内容变了 hash 变文件名就变。

**A5.2.4** CORS：简单/复杂请求差异 + 预检

**简单请求**：GET/HEAD/POST + 普通头部（不能自定义）+ Content-Type 限于几种，浏览器直接发，响应里看 `Access-Control-Allow-Origin`。

**复杂请求**：有自定义头（`Authorization`）或非简单方法（PUT/DELETE），先发 **OPTIONS 预检请求**，服务器返回允许的方法/头/origin，通过后才发真实请求。

预检的意义：保护不支持 CORS 的老服务器（如支付接口），让服务器有机会拒绝跨域写操作。

```
OPTIONS /api/data
Origin: https://a.com
Access-Control-Request-Method: DELETE
→
Access-Control-Allow-Origin: https://a.com
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Max-Age: 86400  // 缓存预检结果
```

**A5.2.5** 同源策略 + 可跨域加载的标签

同源：**协议 + 域名 + 端口**三者相同。限制：JS 读跨域请求的响应内容、操作跨域的 DOM（iframe）、读取跨域 Cookie。

**不受同源限制**（可跨域加载）：
- `<script src>` - CDN JS
- `<link href>` - CDN CSS
- `<img src>` - 图片
- `<video/audio src>` - 媒体
- `<iframe src>` - 嵌入页面（但 JS 不能操作其 DOM）
- `@font-face`（CSS 引入字体，但服务器要配 CORS 头）

**A5.2.6** WebSocket vs SSE vs 长轮询

| | 长轮询 | SSE | WebSocket |
|---|---|---|---|
| 全双工 | ❌ | ❌（单向：服务器推客户端） | ✅ |
| 协议 | HTTP | HTTP（text/event-stream） | ws:// 升级协议 |
| 断线重连 | 手动 | 浏览器原生支持 | 手动 |
| 二进制 | 可以 | ❌（纯文本） | ✅ |
| 适用 | 简单通知 | 数据推送（日志/AI流式） | 实时聊天/协同 |

SSE 用在 AI 对话的流式输出是近几年很常见的场景，简单够用。

**A5.2.7** CSRF/XSS/点击劫持攻击与防御

**XSS（跨站脚本）**：注入可执行 JS，窃取 Cookie/token。
防御：CSP（Content-Security-Policy）、输入过滤/输出转义、HttpOnly Cookie（JS 不能读）

**CSRF（跨站请求伪造）**：借用用户 Cookie 发恶意请求。
防御：**SameSite Cookie**（Lax/Strict）、CSRF Token（表单带随机 token 校验）、验证 Referer/Origin 头

**点击劫持**：透明 iframe 覆盖诱骗点击。
防御：`X-Frame-Options: DENY/SAMEORIGIN` 或 CSP `frame-ancestors`

```http
# 防御头部配置
Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com
X-Frame-Options: SAMEORIGIN
Set-Cookie: sessionId=xxx; HttpOnly; Secure; SameSite=Strict
```


---


# 第一部分：工程化

## 六、工程化

### 6.1 Webpack

**A1（Webpack 整体构建流程）**

整体分五个阶段：初始化 → 构建 → 优化 → 输出。
1. **Compiler** 是全局单例，读取 webpack.config.js 生成配置对象，挂载所有 Plugin（plugin.apply(compiler)）
2. **Compilation** 由 compiler.compile() 创建，每次构建/HMR 都生成新的 compilation 实例，负责本次构建上下文
3. **Module**：从 entry 出发，用 loader 链处理文件（loader-runner），递归解析依赖，生成 module graph
4. **Chunk**：将 module graph 按照 entry/splitChunks/动态import 分组，形成 chunk
5. **Asset**：对 chunk 进行代码生成（seal → emit），输出 bundle 文件

关键钩子：`make → buildModule → seal → emit`，plugin 通过 tapable 钩子在各阶段介入。

---

**A2（Loader vs Plugin）**

- **Loader** 是文件转换器，本质是一个函数 `(source) => transformedSource`，在 module 构建阶段将非 JS 资源（css/ts/vue）转成 webpack 能处理的 JS 模块
- **Plugin** 是事件监听器，通过 tapable 钩子介入整个构建生命周期，能做 Loader 做不到的事：优化 chunk、生成 HTML、环境变量注入等

```js
// Loader 本质
module.exports = function(source) {
  return source.replace('foo', 'bar')
}

// Plugin 本质
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('MyPlugin', (compilation, cb) => {
      // 操作 compilation.assets
      cb()
    })
  }
}
```

执行时机：Loader 在 `buildModule` 阶段；Plugin 可在任意钩子点（make/seal/emit 等）。

---

**A3（Tree Shaking）**

Tree Shaking 依赖 **ES Module 的静态结构**（import/export 在编译期确定），CommonJS 是动态 require 无法静态分析。

Webpack 会标记未使用的 export 为 `unused harmony export`，Terser 压缩时将其删除。

`sideEffects` 告诉 webpack 哪些模块/文件有副作用，不能整体删除：

```json
// package.json
{
  "sideEffects": ["*.css", "src/polyfill.js"]
  // 设为 false 表示整个包无副作用，可放心 tree-shake
}
```

注意：Babel 如果把 ESM 转成 CommonJS（`@babel/preset-env` modules: 'auto'），会破坏 Tree Shaking，需确保 modules: false。

---

**A4（SplitChunks chunks 含义）**

- `initial`：只对入口（同步）chunk 做分包，异步动态 import 不管
- `async`（默认）：只对动态 import 产生的异步 chunk 做分包
- `all`：同步 + 异步都做分包，共享 vendor chunk 效果最好

工程上一般用 `all`，再配合 `cacheGroups` 精细控制：

```js
splitChunks: {
  chunks: 'all',
  cacheGroups: {
    vendors: { test: /node_modules/, priority: 10, name: 'vendors' },
    common: { minChunks: 2, priority: 5, name: 'common' }
  }
}
```

---

**A5（手写 Loader / Plugin）**

```js
// 简单 Loader：给每个 JS 文件头部追加注释
module.exports = function(source) {
  const comment = `/* built at ${Date.now()} */\n`
  return comment + source
}

// 简单 Plugin：构建完成后打印资源大小
class AssetLogPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('AssetLogPlugin', (compilation) => {
      for (const [name, asset] of Object.entries(compilation.assets)) {
        console.log(`${name}: ${asset.size()} bytes`)
      }
    })
  }
}
module.exports = AssetLogPlugin
```

Loader 需要注意：异步 loader 用 `this.async()`；传递 sourceMap 用第二个参数；`this.cacheable()` 开启缓存。

---

**A6（Module Federation）**

解决**多个独立部署的应用共享模块**的问题，是微前端的底层基础设施。

核心思路：应用 A（host）在运行时动态拉取应用 B（remote）暴露的模块，像 import 本地模块一样使用，同时避免 React/Vue 等公共依赖重复加载（shared 配置）。

对比传统 npm 包：npm 包发版需要重新构建，MF 可以让 remote 独立部署、host 实时消费，真正做到**运行时集成**。

```js
// webpack.config.js (remote)
new ModuleFederationPlugin({
  name: 'remoteApp',
  exposes: { './Button': './src/Button.vue' },
  shared: ['vue']
})

// webpack.config.js (host)
new ModuleFederationPlugin({
  remotes: { remoteApp: 'remoteApp@http://cdn.com/remoteEntry.js' },
  shared: ['vue']
})
```

---

**A7（HMR 实现原理）**

HMR 全流程：
1. webpack-dev-server 启动时，在 bundle 中注入 HMR runtime，并与浏览器建立 **WebSocket** 连接
2. 文件变更时，webpack 重新编译受影响的模块，生成新的 **hash** 和 **patch（.hot-update.json/.js）**
3. dev-server 通过 WebSocket 推送 `{ type: 'update', hash }` 消息
4. 浏览器 HMR runtime 收到消息，根据 hash 用 JSONP 拉取 hot-update.js（diff patch）
5. runtime 执行 patch，调用 `module.hot.accept` 回调，局部替换模块，不刷新页面

```js
// vue-loader 会自动注入，手动写法：
if (module.hot) {
  module.hot.accept('./foo.js', () => {
    const newFoo = require('./foo.js')
    // 用新模块做局部更新
  })
}
```

如果没有 accept 处理，HMR 会向上冒泡到 entry，最终触发全页面刷新（fallback）。

---

**A8（Webpack 优化清单）**

**构建速度：**
- `cache: { type: 'filesystem' }` 开启持久化缓存（webpack5）
- `thread-loader` 多线程处理 babel-loader
- `resolve.alias` 减少模块解析路径；`resolve.extensions` 精简后缀
- `include/exclude` 限制 loader 作用范围
- DLL（webpack4）/ 持久化缓存（webpack5 更优）

**体积：**
- `TerserPlugin` 压缩 JS；`CssMinimizerPlugin` 压缩 CSS
- `splitChunks` 分包提高缓存命中
- Tree Shaking + sideEffects
- 图片用 `image-minimizer-webpack-plugin`
- 按需引入组件库（babel-plugin-import）
- `gzip/brotli` 压缩（`CompressionPlugin`）
- `BundleAnalyzerPlugin` 可视化定位大包

---

### 6.2 Vite

**A1（Vite 为什么快）**

核心原因：**开发模式不打包**。

- Webpack dev server 启动时需要把所有模块打成 bundle，项目大了启动几十秒
- Vite 利用浏览器原生 **ESM**，dev server 只做请求拦截，按需编译被请求的文件（用 esbuild 转 TS/JSX，速度极快）
- 模块数量再多，启动时间也是固定的（只处理入口 HTML），HMR 也只需重新处理变化的单个模块

本质差异：webpack 是"**先构建再服务**"，Vite 是"**按需编译，请求时服务**"。

---

**A2（Vite 生产用 Rollup 而非 esbuild）**

esbuild 打包能力有局限：
1. **代码分割**支持不完善，动态 import 的 chunk 策略不如 Rollup 灵活
2. **CSS 处理**和 **plugin 生态**不如 Rollup 成熟
3. esbuild 的 **Tree Shaking** 在某些复杂场景（重导出/side-effect 标记）不够精准
4. Rollup 输出格式更多（ESM/CJS/UMD），对库开发友好

Vite 的设计哲学：dev 快（用 esbuild），prod 稳（用 Rollup），未来等 esbuild 打包能力成熟可能会切换。

---

**A3（Vite 插件机制 vs Webpack 插件机制）**

Vite 插件基于 **Rollup 插件接口**扩展，兼容大部分 Rollup 插件：

```js
// Vite 插件
export default function myPlugin() {
  return {
    name: 'my-plugin',
    transform(code, id) { /* 转换代码 */ },
    load(id) { /* 自定义模块加载 */ },
    configureServer(server) { /* 操作 dev server */ }, // Vite 专有
  }
}
```

Webpack 插件基于 **tapable**，钩子体系更重，API 更复杂，和 webpack 强耦合。

Vite 优势：插件写法简单、Rollup 生态可复用；劣势：dev 和 prod 两套 pipeline，插件要同时处理两种上下文。

---

**A4（Vite 依赖预构建）**

解决两个问题：
1. **CommonJS/UMD 转 ESM**：浏览器只能用 ESM，第三方包很多还是 CJS 格式（如 lodash）
2. **减少请求数**：lodash-es 有几百个小文件，每个都走 HTTP 请求会触发几百次，预构建把它合成一个文件

预构建用 **esbuild** 完成（比 webpack 快 10-100x），产物缓存在 `node_modules/.vite/deps` 中，lock 文件/依赖版本变化才重新构建。

首次启动慢 = 在做预构建；之后启动快 = 直接用缓存。

---

### 6.3 Babel

**A1（Babel 转译流程）**

三步：**Parse → Transform → Generate**

1. **Parse**：源代码 → AST（抽象语法树），分词法分析（Lexer）和语法分析（Parser），用 `@babel/parser`（基于 acorn）
2. **Transform**：遍历 AST，各 plugin/preset 通过 visitor 模式修改节点（如 `ArrowFunctionExpression` 转成普通 function）
3. **Generate**：修改后的 AST → 目标代码字符串，同时生成 sourceMap，用 `@babel/generator`

```js
const babel = require('@babel/core')
// 底层等价于：
const ast = babel.parse(code)
babel.traverse(ast, { ArrowFunctionExpression(path) { /* 改 AST */ } })
const { code: output } = babel.generate(ast)
```

---

**A2（preset-env + browserslist）**

`@babel/preset-env` 根据目标浏览器按需转译语法，不是无脑降级到 ES5。

browserslist 定义目标环境（在 `.browserslistrc` 或 `package.json` 的 `browserslist` 字段），preset-env 读取这个配置，查询 `compat-table` 数据库，判断哪些语法/API 需要转换：

```json
// .browserslistrc
last 2 Chrome versions
last 2 Firefox versions
> 1%
not dead
```

好处：现代浏览器占比高的项目，输出代码体积更小，不用转译已原生支持的 async/await。

---

**A3（@babel/plugin-transform-runtime）**

解决两个问题：
1. **辅助函数重复注入**：Babel 转译每个文件时会在文件头注入 `_classCallCheck`、`_extends` 等 helper，100 个文件就有 100 份重复代码。`transform-runtime` 改为从 `@babel/runtime` 统一 import，节省体积
2. **污染全局作用域**：直接引入 `core-js` polyfill 会修改 `Array.prototype` 等全局对象，库开发时不应该这样做。`transform-runtime` 用沙箱方式（局部替换）避免污染

```json
["@babel/plugin-transform-runtime", {
  "corejs": 3,
  "helpers": true
}]
```

注意：`transform-runtime` 适合**库开发**；应用开发用 `useBuiltIns: usage` 更方便。

---

**A4（polyfill 引入方式差异）**

| 方式 | 说明 | 适用 |
|------|------|------|
| `useBuiltIns: 'entry'` | 在入口文件 import 'core-js'，根据 browserslist 替换成该浏览器缺少的所有 polyfill | 想全量保底 |
| `useBuiltIns: 'usage'` | 自动检测代码中实际用到的 API，按需注入 polyfill | 体积最优 |
| 不配置 | 自行手动 import，灵活但繁琐 | 特殊场景 |

`usage` 是推荐方式，体积更小；`entry` 更保险，适合兜底。都会污染全局，库开发应用 `transform-runtime + corejs: 3`。

---

# 第二部分：性能优化

## 七、性能优化

**A1（Web Vitals 三个核心指标）**

- **LCP（Largest Contentful Paint）**：最大内容元素的渲染时间，衡量加载性能，目标 < 2.5s。优化方向：SSR/预渲染、CDN 加速、图片优化、预加载关键资源（`<link rel="preload">`）
- **FID → INP（Interaction to Next Paint）**：用户交互到浏览器响应的延迟，衡量交互响应性，目标 < 200ms。优化方向：减少主线程长任务、code splitting、Web Worker 处理耗时逻辑
- **CLS（Cumulative Layout Shift）**：页面生命周期内的累积布局偏移，衡量视觉稳定性，目标 < 0.1。优化方向：给图片/视频设置固定宽高、避免动态插入内容、字体加载用 `font-display: optional`

工程上用 Chrome DevTools / Lighthouse / web-vitals.js 采集上报。

---

**A2（首屏优化完整清单）**

**资源层：**
- JS/CSS 压缩（Terser/CssMinimizer）、Tree Shaking、代码分割
- 图片：WebP/AVIF 格式、压缩、懒加载、响应式（srcset）
- 字体：仅加载用到的字重、`font-display: swap`

**网络层：**
- CDN 分发静态资源
- HTTP/2 多路复用
- `preload` 关键资源，`prefetch` 非关键资源
- 开启 gzip/brotli 压缩
- 减少重定向，合并 DNS 查询

**渲染层：**
- SSR / SSG 减少白屏时间
- 关键 CSS 内联（critical CSS）
- 避免 render-blocking 资源（async/defer）
- 骨架屏提升感知速度

**缓存层：**
- 强缓存（Cache-Control: max-age）配合 contenthash 文件名
- Service Worker 离线缓存
- 接口数据缓存（SWR 策略）

---

**A3（虚拟滚动原理 + 不定高度）**

核心思路：只渲染**可视区域**内的 DOM，其余用占位撑高度。

**定高虚拟滚动：**
```js
// 可见条目：visibleStart = Math.floor(scrollTop / itemHeight)
// 渲染范围：[visibleStart - buffer, visibleStart + visibleCount + buffer]
// 偏移：transform: translateY(visibleStart * itemHeight)
```

**不定高度方案（难点）：**
1. **预估高度**：初始用预估值占位，渲染后用 ResizeObserver 测量真实高度，更新 positions 数组
2. **二分查找**：维护前缀和数组，用二分查找定位 scrollTop 对应的起始条目（O(logN)）
3. **缓冲区**：上下各预渲染 3-5 条防止快速滚动白屏

边界问题：滚动跳动（高度更新后重新计算位置）、滚动到底部加载更多、键盘导航、动态内容变化。

成熟库：`vue-virtual-scroller`、`@tanstack/virtual`。

---

**A4（图片优化）**

- **格式**：WebP 比 JPEG 体积小 25-34%；AVIF 更小但兼容性差，用 `<picture>` 做降级
- **响应式**：`<img srcset="img-400.webp 400w, img-800.webp 800w" sizes="(max-width: 600px) 400px, 800px">`
- **懒加载**：原生 `loading="lazy"`（兼容性好）或 IntersectionObserver 手动实现
- **占位符**：低质量模糊图（LQIP）先加载，真图加载完后替换；或用主色调 CSS 占位
- **CDN 图片处理**：阿里云 OSS/七牛等支持 URL 参数动态裁剪缩放，避免大图下载

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" loading="lazy" width="800" height="600">
</picture>
```

---

**A5（debounce vs throttle）**

- **debounce（防抖）**：连续触发只执行最后一次，等待 n ms 没有新触发才执行。适合：搜索框输入、窗口 resize 结束后计算
- **throttle（节流）**：n ms 内最多执行一次，保证执行频率上限。适合：滚动事件、鼠标移动、游戏帧更新

```js
// debounce
function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// throttle（时间戳版）
function throttle(fn, interval) {
  let last = 0
  return (...args) => {
    const now = Date.now()
    if (now - last >= interval) { last = now; fn(...args) }
  }
}
```

区别记忆：debounce 是"等你停下来再说"，throttle 是"每隔一段时间说一次"。

---

**A6（requestIdleCallback 时间切片）**

主线程长任务（> 50ms）会阻塞渲染，导致 INP 变差。时间切片的思路是把大任务拆成小块，利用浏览器空闲时间分批执行。

```js
function processInChunks(tasks) {
  function runChunk(deadline) {
    // deadline.timeRemaining() 返回当前帧剩余空闲时间（ms）
    while (tasks.length > 0 && deadline.timeRemaining() > 1) {
      const task = tasks.shift()
      task() // 执行一个小任务
    }
    if (tasks.length > 0) {
      requestIdleCallback(runChunk) // 还有任务，下一帧继续
    }
  }
  requestIdleCallback(runChunk)
}
```

React Fiber 的 Scheduler 也是类似思路（用 MessageChannel 模拟，因为 rIC 优先级太低）。注意：rIC 不适合做动画（用 rAF），适合低优先级后台任务（预加载、数据处理）。

---

**A7（内存泄漏常见场景）**

1. **全局变量**：意外的 `window.xxx = largeData`，随页面生命周期存活
2. **定时器未清除**：组件销毁后 setInterval 仍在跑，回调里持有组件引用
3. **事件监听器未移除**：`addEventListener` 后忘记 `removeEventListener`，尤其在 Vue 的 beforeUnmount/unmounted 钩子里
4. **DOM 引用**：JS 变量持有已从 DOM 树移除的节点引用，节点及其子树无法 GC
5. **闭包循环引用**：闭包持有外部大对象，外部对象又引用闭包，形成环

```js
// Vue 中正确清理
onMounted(() => {
  const handler = () => { /* 使用了 vm 实例 */ }
  window.addEventListener('resize', handler)
  onUnmounted(() => window.removeEventListener('resize', handler))
})
```

排查工具：Chrome DevTools Memory 面板，对比两次 Heap Snapshot，找 Detached DOM nodes 和不断增长的对象。

---

**A8（Performance API）**

```js
// Navigation Timing：页面加载各阶段耗时
const [nav] = performance.getEntriesByType('navigation')
const ttfb = nav.responseStart - nav.requestStart     // TTFB
const domReady = nav.domContentLoadedEventEnd - nav.startTime

// Resource Timing：各资源加载耗时
performance.getEntriesByType('resource').forEach(r => {
  console.log(r.name, r.duration, r.transferSize)
})

// Long Tasks API：监控主线程长任务（> 50ms）
const observer = new PerformanceObserver(list => {
  list.getEntries().forEach(entry => {
    console.log('Long task:', entry.duration, entry.startTime)
  })
})
observer.observe({ type: 'longtask', buffered: true })
```

工程上结合 `web-vitals` 库采集 LCP/CLS/INP，通过 `navigator.sendBeacon` 上报到后端，做性能监控大盘。

---

# 第三部分：设计模式 & 代码质量

## 八、设计模式 & 代码质量

**A1（设计模式应用场景）**

- **单例**：全局状态管理（Vuex/Pinia store）、全局 EventBus、axios 实例、WebSocket 连接
- **工厂**：根据类型创建不同组件/处理器，如表单字段渲染器（type: 'input'|'select'|'date' → 对应组件）
- **观察者 vs 发布订阅**：观察者是直接依赖（Subject 直接通知 Observer），发布订阅有中间 EventBus 解耦（Publisher 不知道 Subscriber）。Vue 的响应式是观察者；mitt/EventBus 是发布订阅
- **代理**：Vue3 的响应式系统（Proxy 拦截 get/set）；axios 拦截器（请求/响应代理）
- **策略**：表单校验规则（不同校验策略可替换）；不同支付方式（微信/支付宝/银行卡）

---

**A2（高内聚低耦合在组件设计中的应用）**

- **单一职责**：一个组件只做一件事。`<UserAvatar>` 只管头像展示，不管用户数据获取。数据获取放在 composable（`useUser`）里
- **开闭原则**：组件对扩展开放，对修改关闭。通过 props/slots/provide-inject 扩展行为，而不是修改源码。比如 `<Table>` 组件通过 slot 支持自定义列渲染
- **高内聚**：一个 composable 把相关状态和逻辑放在一起（状态、getter、action 内聚到 `useCart`）
- **低耦合**：父子通过 props/emit 通信，不直接操作对方内部；跨层通信用 provide/inject 或 Pinia，不用 $parent/$children

---

**A3（Vue 自定义组件设计）**

- **受控**：状态完全由父组件管理，子组件只通过 emit 上报变化。适合需要父组件干预的场景（表单联动）
  ```vue
  <!-- 受控：父传 modelValue，子 emit update:modelValue -->
  <MyInput :model-value="val" @update:model-value="val = $event" />
  ```
- **非受控**：状态在组件内部管理，父组件不关心中间状态，只关心最终结果（ref 获取值）
- **命令式 API**：通过 `ref` + `expose` 暴露方法，父组件主动调用（`modal.open()`）。适合对话框、Toast、消息确认
- **声明式 API**：通过 props 驱动行为（`<Modal :visible="show">`）。更 Vue 哲学，更易测试

工程上：UI 组件优先声明式；弹窗/通知类用命令式更符合使用习惯（`this.$confirm(...)`）。

---

**A4（函数式编程）**

- **纯函数**：相同输入永远得到相同输出，无副作用。好处：可测试、可缓存（memoize）、可并行
- **柯里化**：把多参函数转成单参函数链，支持部分应用

```js
// 柯里化
const add = a => b => a + b
const add5 = add(5)
add5(3) // 8

// compose：从右到左组合函数
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)
const process = compose(format, validate, parse)
```

在 Vue 中的应用：`computed` 本质是纯函数；Pinia actions 尽量写纯函数；管道式数据处理（`array.filter().map().reduce()`）。

---

**A5（RxJS 核心概念）**

- **Observable**：可观察的数据流（异步或同步序列），懒执行，subscribe 才开始
- **Operator**：纯函数，对 Observable 做变换（`map/filter/mergeMap/debounceTime`），链式调用
- **Subject**：既是 Observable 又是 Observer，可多播（一对多），常用于手动触发事件
- **Scheduler**：控制执行时机（同步/异步/animationFrame），一般不需要手动指定

```js
import { fromEvent } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

fromEvent(input, 'input').pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(e => searchApi(e.target.value)) // 取消前一次未完成的请求
).subscribe(results => render(results))
```

适合复杂异步场景（取消请求、多流合并、实时搜索），Vue 项目中不常用，但理解其思想对复杂状态管理有帮助。

---

# 第三部分：场景题 / 开放题

## 答题框架

**场景1：微前端架构方案评估**

答题维度框架：
1. **隔离性**：JS 沙箱（快照沙箱/Proxy沙箱）、CSS 隔离（shadow DOM/scoped）
2. **通信机制**：全局状态共享、CustomEvent、URL 参数
3. **性能开销**：iframe 最重（独立上下文）；qiankun/wujie 次之；Module Federation 最轻（shared 依赖）
4. **接入成本**：iframe 改造最小但体验差；qiankun 需要子应用改造 lifecycle；MF 需要 webpack5
5. **部署复杂度**：是否需要主应用统一调度，还是各自独立部署

评估点：
- qiankun：生产验证充分，JS 沙箱成熟，但 CSS 隔离有坑（动态样式）
- wujie：基于 iframe + Web Component，隔离彻底，通信便捷，新项目推荐
- Module Federation：不是严格意义微前端，适合同技术栈模块共享，运行时集成
- iframe：上古方案，体验差（弹窗/路由同步问题），但某些强隔离场景仍是最优解

---

**场景2：SPA 版本更新提示**

问题分析：旧版 bundle 文件被缓存，新版接口可能 breaking change，路由 hash 不匹配导致 404 动态资源。

解决方案框架：
1. **轮询检测**：前端定期（5min）请求 `/version.json`，对比构建时写入的版本号，不一致则提示用户刷新
2. **WebSocket 推送**：服务端发布后主动通知，实时性更好
3. **路由守卫检测**：每次路由跳转时检测（`router.beforeEach`），减少轮询
4. **Chunk 加载失败兜底**：动态 import 失败（`ChunkLoadError`）时自动 reload

```js
// 方案1：轮询版本号
async function checkVersion() {
  const { version } = await fetch('/version.json').then(r => r.json())
  if (version !== window.__APP_VERSION__) {
    showUpdateBanner() // 提示用户，不强制刷新
  }
}
setInterval(checkVersion, 5 * 60 * 1000)
```

提示用户要优雅，建议 banner 提示而非强制刷新，避免用户丢失未保存的表单数据。

---

**场景3：前端埋点 SDK 设计**

技术选型框架：

**自动埋点：**
- 利用事件冒泡，在 `document` 上统一监听 `click/submit`，通过 `data-track-*` 属性标记元素
- MutationObserver 监听 DOM 变化，自动收集曝光事件（PV）
- 路由变化监听（`popstate` / Vue Router afterEach）

**手动埋点：**
- 暴露简洁 API：`track.event(name, props)`、`track.page(name)`、`track.setUser(id)`

**性能监控：**
- `PerformanceObserver` 采集 LCP/CLS/INP、Long Tasks
- `Navigation Timing` 采集 TTFB/DOMReady/Load

**错误监控：**
- `window.onerror` + `unhandledrejection` 兜底
- Vue 的 `app.config.errorHandler`
- SourceMap 还原（sentry-cli 上传）

**上报策略：**
- `navigator.sendBeacon`（页面卸载安全上报）
- 批量上报（LocalStorage 暂存 + 合并上报）
- 采样率控制（千分之 N 上报，降低后端压力）

---

**场景4：B端低代码平台前端架构**

分层设计框架：
1. **元数据层**：Schema 定义（JSON Schema 描述组件配置）；物料库（原子组件 + 业务组件）
2. **设计器层**：拖拽引擎（拖放 API / interactjs）；属性面板（动态表单，根据 Schema 渲染）；画布（组件树渲染 + 选中高亮 + 辅助线）
3. **渲染引擎层**：Schema → 真实 Vue 组件树（`resolveComponent` + 动态渲染）；表达式引擎（`new Function` / expr-eval）；数据绑定（变量系统 + 接口配置）
4. **存储层**：页面 Schema 版本化存储；Undo/Redo（命令模式）

技术选型建议：Vue3 + Pinia（设计器状态复杂）；VueDraggablePlus（拖拽）；Monaco Editor（表达式编辑）；JSON Schema Form（属性面板自动生成）

---

**场景5：大表单（100+字段）性能优化**

瓶颈分析：Vue 为每个表单字段建立响应式依赖，字段多时每次输入触发大量 watcher 重新计算。

优化思路：
1. **分步/分标签页渲染**：只渲染当前激活的字段组，v-if 销毁非活跃组件
2. **按需响应**：不需要实时联动的字段用 `v-model.lazy`（失焦才更新）
3. **冻结静态数据**：下拉选项等静态数据用 `Object.freeze()` 阻止响应式代理
4. **虚拟化字段列表**：动态字段列表（数组）用虚拟滚动
5. **Debounce 校验**：避免每次击键都触发全量校验
6. **组件拆分**：大表单拆成多个子组件，利用 Vue 的组件边界隔离 re-render 范围

---

**场景6：代码体积 10MB+ 首屏过慢的定位和优化**

**定位流程：**
1. `webpack-bundle-analyzer` 可视化 bundle，找最大的包
2. Chrome DevTools Coverage 面板，看首屏实际执行的 JS 比例
3. Network 面板看请求瀑布图，定位 blocking 资源
4. Lighthouse 跑一遍，看具体建议

**常见大包原因和处理：**
- `moment.js`（500KB）→ 换 `dayjs`（2KB）
- 组件库全量引入 → 按需引入（`unplugin-vue-components`）
- 没有动态 import → 路由懒加载（`() => import('./Page.vue')`）
- 大型工具库（lodash）→ 按需引入或用 `lodash-es` + Tree Shaking
- 首屏不需要的大图/字体 → 懒加载

**网络层：**
- CDN 加速、HTTP/2、开启 gzip/brotli
- 将 vendor chunk 设置长期缓存（contenthash + max-age 365d）

---

**场景7：推动代码规范和 Code Review**

不是靠说教，是靠工具 + 流程固化：

**工具层：**
- ESLint + Prettier + husky pre-commit 钩子（提交时自动格式化，不过关不让提交）
- commitlint 规范提交信息（feat/fix/chore/...）
- CI 流水线中跑 lint，不通过不让合并

**流程层：**
- 制定团队 Code Review Checklist（可读性/安全/性能/测试几个维度）
- 小 PR 原则：每个 PR 不超过 300 行，降低 review 成本
- 每周技术分享：复盘 review 中发现的典型问题
- 结对编程：新人和老人配对，传帮带

**推动方式：**
- 先在自己的 PR 上展示规范效果，用结果说话
- 和 TL 对齐价值（减少 bug、降低维护成本），争取支持
- 渐进式推行，不要一次全改，先从 lint 开始

---

**场景8：设计组件库**

**架构层：**
- Monorepo（pnpm workspace）：核心组件包 + 主题包 + 文档包 + 工具包分离
- CSS 变量 + Design Token 系统，支持主题定制
- 按需引入：每个组件独立 package，或用 `unplugin-vue-components` 自动导入

**文档层：**
- VitePress / Storybook 构建组件文档，每个组件有 Props 表格、代码示例、Playground
- Changelog 自动生成（conventional-changelog）

**版本管理：**
- Semver（主版本 breaking change，次版本新特性，补丁版本 bug fix）
- Changesets 管理多包版本发布
- 发版前跑全量测试 + 视觉回归测试

**测试层：**
- Vitest 单元测试（组件逻辑）
- Vue Testing Library 集成测试（用户行为）
- Playwright 视觉回归测试（截图对比）
- 覆盖率要求：核心组件 > 80%

---

**场景9：并发 100 个接口 token 失效的 Axios 拦截器问题**

问题：100 个请求同时 401，拦截器会触发 100 次刷新 token 的逻辑，发 100 次刷新请求。

解决方案：**请求队列 + 标志位**

```js
let isRefreshing = false
let pendingQueue = []

axios.interceptors.response.use(null, async (error) => {
  if (error.response?.status !== 401) return Promise.reject(error)

  const originalRequest = error.config
  if (originalRequest._retry) return Promise.reject(error) // 刷新后仍 401，登出

  if (isRefreshing) {
    // 刷新中：把请求加入等待队列
    return new Promise((resolve, reject) => {
      pendingQueue.push({ resolve, reject })
    }).then(token => {
      originalRequest.headers.Authorization = `Bearer ${token}`
      return axios(originalRequest)
    })
  }

  isRefreshing = true
  originalRequest._retry = true
  try {
    const { token } = await refreshTokenApi()
    setToken(token)
    pendingQueue.forEach(p => p.resolve(token))
    pendingQueue = []
    originalRequest.headers.Authorization = `Bearer ${token}`
    return axios(originalRequest)
  } catch (e) {
    pendingQueue.forEach(p => p.reject(e))
    logout()
  } finally {
    isRefreshing = false
  }
})
```

---

**场景10：减少团队前端开发人力 30%**

框架维度（技术 + 管理结合）：

**提效工具：**
- 脚手架/项目模板（CLI 一键创建规范项目）
- 业务组件库（复用率高的业务场景沉淀为组件，避免重复开发）
- 接口代码生成（OpenAPI → TypeScript 类型 + 请求函数，减少手写 service 层）
- 低代码平台承接标准化页面（CRUD/表单/报表）

**流程提效：**
- 设计稿还原：Figma D2C（Design to Code）工具辅助生成基础代码
- AI 辅助编码（GitHub Copilot）：减少样板代码编写时间
- 测试自动化：减少手动回归测试人力

**架构层：**
- BFF（Backend for Frontend）让前端不用等后端接口聚合
- 微前端让团队并行开发，减少协同等待

---

# 第四部分：软技能 / HR 面常考

## 答题框架（结合个人背景）

**Q1：最有成就感的项目（STAR 法）**

**建议讲：PIMS 医疗影像系统的 Web Worker 大文件分片上传**

- **S（Situation）**：PIMS 系统需要上传 CT/MRI 影像文件，单个 DICOM 序列可达 500MB-2GB，原有上传方案在主线程中处理，界面卡顿，且断网后整体失败，用户体验极差
- **T（Task）**：负责重构上传模块，目标：不阻塞 UI、支持断点续传、上传速度提升
- **A（Action）**：
  1. 将分片切割、MD5 计算移到 Web Worker（`worker.postMessage`），释放主线程
  2. 前端分 4MB/片，并发 3 个分片，IndexedDB 记录已上传分片（ORM 层封装）
  3. 服务端实现分片合并接口，支持秒传（文件 MD5 已存在则跳过上传）
  4. 上传进度通过 `postMessage` 回传，精确到每个分片
- **R（Result）**：上传速度提升约 40%（并发分片），界面 0 卡顿，网络中断后续传成功率接近 100%，获得项目组认可

关键词：Web Worker、IndexedDB、断点续传、并发控制、MD5 秒传

---

**Q2：最难解决的技术问题**

**建议讲：CI/CD 流水线卡顿排查**

答题框架：
- **现象**：描述具体症状（某次上线 CI 时间从 5min 变成 45min）
- **排查过程**：
  1. 查 CI 日志，定位到 webpack 构建阶段
  2. 对比 commit 记录，找到引入大依赖的那次提交
  3. bundle-analyzer 分析，发现某个工具库没有 tree-shake（CJS 格式）
  4. 同时发现 node_modules 缓存策略不对，每次 CI 都重新 install
- **解决方案**：换 ESM 版依赖 + 修复缓存 key（基于 package-lock.json hash）
- **结果**：CI 时间恢复到 6min，并沉淀为团队 CI 优化最佳实践文档

体现：系统化排查能力、工具使用（profiling/日志）、有结果导向

---

**Q3：与产品/后端/设计的冲突处理**

答题框架（不要说没有冲突）：
- 举具体例子：产品临时加需求、后端接口 breaking change、设计稿不合理
- 处理方式：**理解对方诉求 → 量化影响 → 提方案 → 寻求共识**
- 重点体现：专业度（用数据/工期说话）+ 协作姿态（不是对立，是一起解决问题）

例子参考：设计要求某动画效果，性能测试后 INP 超标，和设计师一起看数据，提出降级方案（减少同时运动元素），最终达成既好看又不卡的方案。

---

**Q4：离职原因 + 选择新公司**

离职原因（正向包装，避免负面）：
- "当前项目阶段性完成，个人在技术深度和广度上遇到了瓶颈，希望到更有挑战性的平台继续成长"
- "团队技术栈比较固定，想接触更丰富的技术场景"
- 避免说：老板/团队问题、薪资（可以是原因之一但别直说）

选择新公司（结合岗位真实思考）：
- 技术氛围（团队用什么技术栈、有没有技术分享）
- 产品方向是否有成长空间
- 团队规模和协作方式（偏好 15-30 人的前端团队）
- 个人发展路径是否清晰

---

**Q5：5年职业规划**

不要太具体也不要太空洞，结合当前阶段：

- **短期（1-2年）**：在当前方向做深，达到"某个垂直领域（比如可视化/低代码/性能优化）的团队内专家"水平；同时补齐全栈能力（Node/云服务）
- **中期（3-5年）**：技术专家方向，负责某个技术域的规划和落地；或技术 TL，带 5-8 人小组，培养新人
- 坦诚说：目前更倾向技术专家路线，喜欢深入解决难题；如果机会合适也不排斥带人

关键：展示方向性思考，不是死背答案，面试官更想看你对自己的认知。

---

**Q6：优势和短板**

优势（结合简历）：
- Vue 生态深度：从响应式原理到工程化全栈掌握
- 有跨领域经验（医疗影像、IndexedDB ORM 等复杂场景）
- 有工程化意识（CI/CD 优化、Web Worker、性能监控）
- 喜欢把复杂问题系统化（构建工具/框架原理理解深）

短板（真实但可控，展示改进中）：
- "英文技术文档阅读够用，但技术写作（英文文章/开源贡献）还不够"→ 在改进：开始写博客/参与开源
- "在纯管理（项目进度管理、跨团队协调）方面经验不足"→ 正在通过带实习生逐步积累

---

**Q7：如何持续学习**

个性化角度（不要说"刷掘金"这种套话）：

- **源码阅读**：读过 Vue3 响应式、Pinia、Vue Router 的核心实现，理解设计思路
- **实践驱动**：遇到问题深挖原理，比如 Web Worker 上传时深入研究了 SharedArrayBuffer 和 Transferable Objects
- **社区关注**：Vue RFC（了解官方设计决策）、TC39（JS 新特性）、web.dev（Chrome 团队性能最佳实践）
- **书籍**：《你不知道的 JavaScript》《Clean Code》《凤凰架构》
- **总结输出**：把项目中的踩坑写成团队内部文档或个人博客，教是最好的学

---

**Q8：加班和工作生活平衡**

成熟答法（不要装不在乎加班，也不要表现得完全没边界）：

- "我理解互联网行业有阶段性的高强度，项目冲刺期我愿意投入，这没问题"
- "但我认为长期高强度加班是效率问题的信号，不是解决方案——我更关注的是通过工程化、自动化、清晰的需求对齐来提高效率"
- "在平衡方面，我会在非加班时间主动学习充电，保证精力持续"

---

**Q9：期望薪资**

答题框架（不要直接报数字，要有依据）：

1. **了解市场行情**：6年Vue前端在当地市场大致区间（先调研 Boss直聘/拉勾数据）
2. **锚定当前薪资 + 合理涨幅**：一般期望涨幅 20-30%，可以说"我现在是 X，期望在 X * 1.2-1.3 左右，具体可以根据岗位 JD 和 package 细聊"
3. **转移焦点**：先了解岗位职责和发展空间，如果匹配度高，薪资上有一定弹性
4. **不要过早报数**：如果 HR 第一轮问，可以说"我更想先了解岗位的具体情况和技术方向，再来谈这个"

---

**Q10：反问环节（3-5个高质量问题）**

1. **技术栈和架构**："目前团队前端主要用什么技术栈？有没有在推进的技术升级方向（比如 Vue2 → Vue3）？"
2. **团队现状**："前端团队现在多少人？分工怎么划分（业务线 or 平台/基础设施）？"
3. **成长空间**："这个岗位在 1-2 年内比较典型的成长路径是什么？有没有机会接触偏架构/技术规划的工作？"
4. **痛点诚询**："团队目前在技术上有哪些挑战或者待解决的问题？这个岗位招人主要是为了补强哪个方向？"
5. **文化氛围**："团队有没有定期的技术分享或 Code Review 文化？"

避免问：待遇（HR 面再谈）、公司有没有加班（换个方式问项目节奏）、能不能远程（除非是硬需求）。


---

## 第二部分：针对简历亮点的深挖题（必答）

> 🔴 最重要！面试官一定会深挖，结合 STAR 法答。


## A. Web Worker + SparkMD5 大文件分片上传

**A1** 为什么选 Worker 而不是 async + setTimeout 来切片？

async/await + setTimeout 仍然跑在主线程，切片过程中 `file.slice()` 是同步 Blob 操作，SparkMD5 的 hash 计算是纯 CPU 密集型，哪怕分批执行也会持续占用主线程，导致 UI 掉帧、进度条卡顿。Web Worker 运行在独立线程，hash 计算期间主线程完全不受影响。实测一个 500MB 文件在主线程增量 hash 会出现 200-400ms 的 Long Task，Chrome Performance 面板上红色 Task 连片；Worker 计算期间主线程 FPS 稳定在 60。

**A2** SparkMD5 增量计算 vs 一次性计算的内存差异？

一次性计算需要将整个文件读入内存：`FileReader.readAsArrayBuffer(file)` 对 1GB 文件会申请 1GB+ 连续堆内存，极易触发 OOM 崩溃。增量计算核心是 `spark.append(chunkBuffer)` 逐块喂入，每次只需一个分片（通常 2-5MB）的 ArrayBuffer 存活，计算完即可 GC 回收。PIMS 项目分片大小设为 2MB，峰值内存占用始终 < 5MB，而一次性计算 1GB 文件会导致 Chrome 标签崩溃。

```js
// Worker 内增量计算
const spark = new SparkMD5.ArrayBuffer();
for (let i = 0; i < totalChunks; i++) {
  const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
  const buf = await chunk.arrayBuffer();
  spark.append(buf);
  postMessage({ type: 'progress', percent: (i + 1) / totalChunks });
}
const hash = spark.end();
```

**A3** Worker 和主线程的通信开销？Transferable Objects？⭐⭐⭐⭐

`postMessage` 默认走**结构化克隆**，传递 ArrayBuffer 会完整拷贝一份，2MB 分片来回拷贝一次就额外消耗 2MB 内存和 ~2ms 序列化时间。使用 `Transferable Objects` 可以零拷贝转移所有权：

```js
// 主线程把 ArrayBuffer 转移给 Worker，主线程自身引用失效
worker.postMessage({ chunk: arrayBuffer }, [arrayBuffer]);
// Worker 算完把结果 hash 字符串传回（字符串本来就是克隆，无需 transfer）
```

在 PIMS 项目里，主线程用 `file.slice().arrayBuffer()` 读好分片后，把 ArrayBuffer transfer 给 Worker；Worker hash 后只回传一个 hash 字符串，所以通信开销极低。如果反过来让 Worker 自己读 File（Worker 也可以访问 File/Blob），则完全不需要主线程传数据，通信开销为零，这是更优方案。

**A4** 服务端 `lack` 数组为什么按 hash 而不是按 index？

按 index 设计的问题：如果用户上传了一半换了台电脑，或者文件被重新选择过，index 相同但 content 不同，服务端没法验证完整性。按分片 hash 设计，服务端收到每片后存 `chunkHash → 已接收`，`lack` 数组返回"还缺哪些 hash"，前端只需重传这些 hash 对应的分片。同时整个文件也有 fullHash，合并后服务端再做一次全量校验，防止中间人篡改。这样即使分片乱序到达、网络重传，服务端都能正确去重和验证。

**A5** 分片并发上传策略：固定并发 vs 滑动窗口？

PIMS 项目使用**固定并发数（concurrency = 4）+ 失败队列**。纯滑动窗口实现复杂，且医院内网带宽稳定，固定 4 并发已能跑满。实现用 `Promise.allSettled` + 分批：每批取 4 个分片并发上传，全部落定后取下一批；失败的加入 retryQueue。带宽自适应方案（动态调整 concurrency）理论更优，实现上可记录每批的吞吐量，若下降超 20% 则减并发，但 PIMS 没有实现这一步，是后续优化点。

**A6** 失败重试 5 次的设计：指数退避？

采用**指数退避 + 抖动**：第 n 次重试等待 `min(2^n * 200ms, 10000ms) + random(0, 1000ms)`。纯立即重试在弱网环境下会瞬间打满服务器并全部失败；固定间隔浪费恢复时间；指数退避让服务器有喘息时间，抖动避免雪崩。代码上用递归 + `await sleep(delay)` 实现，最终 5 次均失败则 reject，上层把该分片加入永久失败列表并通知用户。

**A7** 浏览器关闭后如何续传？持久化什么？

在 `localStorage`（或 IndexedDB，大 hash 列表用 IDB 更合适）持久化：`{ fileHash, fileName, fileSize, uploadedChunks: Set<chunkHash>, createTime }`。每当一个分片上传成功，立即把 chunkHash 追加到 uploadedChunks 并持久化。下次重新打开页面，用户选择同一文件后先算 fileHash，再从存储里查有无匹配记录，有则取 uploadedChunks 和服务端的 lack 数组求交集，跳过已传分片。PIMS 同时在服务端也保留分片状态，以客户端+服务端双重确认为准，防止客户端存储被清除导致重复上传。

**A8** RxJS Subject 推送进度 vs EventEmitter 的差异？

EventEmitter 是 Node.js 生态，浏览器需要 polyfill 或自己封一层，没有操作符支持。用 RxJS `Subject` 的好处：① 可以接管 `pipe(throttleTime(100))` 避免进度更新太频繁重渲染 UI；② 组件销毁时只需 `subject.unsubscribe()` 一次性释放，不用手动 `removeEventListener`；③ `BehaviorSubject` 还能让后注册的订阅者立即拿到当前进度（比如弹窗打开晚于上传开始）。PIMS 中用 `BehaviorSubject<number>(0)` 持有当前进度百分比，进度条组件订阅后立即渲染当前值，上传结束后 `subject.complete()`。

---

## B. SharedWorker 多 Tab 登录态同步

**B1** 为什么不用 localStorage + storage 事件？SharedWorker 的优势？

`storage` 事件只在**其他标签**修改时触发，自身页面修改不触发；而且每次读写都是字符串序列化，无法保存函数或复杂状态。最关键的是：`storage` 事件是广播式、无状态的，无法做集中式 token 刷新——如果 3 个 Tab 同时检测到 401，会各自触发 3 次 refresh 请求，引发 Race Condition。SharedWorker 是单一进程持有 token，天然解决并发刷新问题；同时 Worker 线程常驻，可以做心跳、定时续期，而不依赖某个 Tab 的 JS 环境。

**B2** SharedWorker 的生命周期？最后一个 Tab 关闭会怎样？

SharedWorker 在**第一个** connect 端口注册时启动，在**所有** connect 端口都断开（Tab 关闭/导航离开）后由浏览器垃圾回收，没有明确的"销毁回调"。最后一个 Tab 关闭后，Worker 线程会在浏览器认为合适时终止，持有的内存状态全部丢失。因此不能把 token 只存在 Worker 内存里，需要配合 Cookie（HttpOnly）或 sessionStorage 做持久化。重新打开 Tab 时 Worker 重启，通过 `connect` 事件重新同步状态。

**B3** Safari / 移动端兼容性？降级方案？

Safari 15.4 之前完全不支持 SharedWorker，iOS Safari 至今（2024）仍不支持。降级方案：检测 `typeof SharedWorker === 'undefined'`，降级到 `BroadcastChannel`（Safari 15.4+ 支持），再降级到 `localStorage + storage 事件`。BroadcastChannel 虽然是广播式但比 storage 事件更可靠，且 API 更干净。PIMS 项目对 Safari 的降级路径：SharedWorker → BroadcastChannel → storage 事件，用策略模式封装，上层调用无感。

**B4** SharedWorker 内部如何区分不同 Tab？端口管理？⭐⭐⭐⭐

```js
// shared-worker.js
const ports = new Set();
self.onconnect = (e) => {
  const port = e.ports[0];
  ports.add(port);
  port.onmessage = ({ data }) => {
    if (data.type === 'LOGOUT') {
      // 广播给所有其他 Tab
      ports.forEach(p => p !== port && p.postMessage({ type: 'FORCE_LOGOUT' }));
    }
    if (data.type === 'REFRESH_TOKEN') { /* 统一刷新逻辑 */ }
  };
  port.onclose = () => ports.delete(port); // Chrome 支持，Safari 不触发
  port.start();
};
```

每个 Tab 连接时得到独立 `MessagePort`，Worker 内用 `Set<MessagePort>` 维护活跃连接。Tab 关闭时 `onclose` 触发（注意 Safari 不触发此事件，需用心跳超时清理）。广播时遍历 ports 逐个 postMessage，可按需跳过发送方。

**B5** SharedWorker 崩溃后多 Tab 状态如何恢复？

Worker 崩溃后各 Tab 的 port 通信静默失败（postMessage 无响应）。可用心跳机制检测：主线程每 10s 向 Worker 发 `PING`，若 5s 内无 `PONG` 则判定 Worker 死亡，此时 `new SharedWorker(url)` 会自动重启（URL 相同时浏览器会复用已有实例或创建新实例）。重启后各 Tab 重新 connect，Worker 从 Cookie 中重新读取 token 状态。关键是 token 的 source of truth 在 Cookie（HttpOnly），Worker 只是状态广播中枢，崩溃不影响数据持久性。

---

## C. IndexedDB Promise 化 ORM

**C1** ORM 封装的核心 API？简化了什么？

原生 IDB 完全基于事件回调：`request.onsuccess`、`request.onerror`、`transaction.oncomplete`，嵌套多层后极难维护。ORM 封装的核心方法：

```js
db.get(storeName, key)           // → Promise<value>
db.put(storeName, value)         // → Promise<key>
db.delete(storeName, key)        // → Promise
db.getAll(storeName, query?)     // → Promise<value[]>
db.getByIndex(store, index, val) // → Promise<value[]>
db.batchPut(storeName, records)  // → Promise（单事务批量写）
```

封装消除了：① 手动打开事务的样板代码；② 事件转 Promise 的重复模式；③ 事务范围管理（自动根据操作推断 readwrite/readonly）；④ 版本升级的迁移 DSL。20+ ObjectStore 的表定义用 schema JSON 统一声明，初始化时自动创建。

**C2** IDB 事务模型：readonly vs readwrite 差异？

`readonly` 事务可以并发执行（浏览器可优化为并行读），不阻塞其他 readonly 事务；`readwrite` 事务是排他的，同一 ObjectStore 上同一时间只有一个 readwrite 事务活跃，其他 readwrite 事务进入队列等待。误用 readwrite 做只读查询会造成不必要的锁竞争，PIMS 的影像加载模块有大量并发读，必须用 readonly。事务的另一个特性：一旦事务内有异步操作（如 await 后再操作 cursor），事务可能已经自动提交/中止，需要在同一个微任务链内完成所有 IDB 操作。

**C3** index 和 keyPath 的设计原则？

`keyPath` 是主键，应选择唯一稳定的业务 ID（如 dicomUID、patientId）；避免用自增数字主键（IDB 支持 autoIncrement 但业务上难以关联）。`index` 用于辅助查询，建在高选择性字段上（如 studyDate、patientName），避免在布尔值或低基数字段建索引。复合索引（`multiEntry: false`）可用 `[field1, field2]` 数组 keyPath，但查询时必须提供完整 key range。PIMS 有按检查日期范围查询的需求，在 `studyDate` 上建 IDBKeyRange 索引，避免全表扫描。

**C4** `onupgradeneeded` 的迁移策略？

```js
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  const oldVersion = e.oldVersion;
  // 顺序执行每个版本的迁移步骤
  if (oldVersion < 2) { db.createObjectStore('reports', { keyPath: 'id' }); }
  if (oldVersion < 3) {
    const store = e.target.transaction.objectStore('reports');
    store.createIndex('byDate', 'reportDate');
  }
  if (oldVersion < 4) { db.deleteObjectStore('legacyCache'); }
};
```

关键点：迁移必须幂等，每步判断 `oldVersion < N`；只能在 `onupgradeneeded` 内部的隐式事务里做 DDL 操作；不能在迁移事务里做异步操作（不能 await fetch 数据），数据迁移逻辑放到应用启动阶段另起事务处理。

**C5** 20+ ObjectStore 的性能瓶颈？查询慢如何排查？

瓶颈通常出现在：① 大 ObjectStore 全量 `getAll` 无索引过滤；② 高频写入 readwrite 事务串行化；③ 存储的 value 对象过大（如把整个 DICOM 二进制存 IDB）。排查路径：Chrome DevTools → Application → IndexedDB 看各 store 的记录数和大小；Performance 面板看 IDB 相关的 Task 耗时；在代码层打点记录 `transaction.oncomplete` 时间。PIMS 发现影像缓存 store 存的是原始 ArrayBuffer（每条 1-5MB），改为只存缩略图 Base64，完整数据按需从 WADO 重新拉取，查询时间从 ~300ms 降到 ~20ms。

**C6** IDB vs localStorage 对比

| 维度 | localStorage | IndexedDB |
|------|-------------|-----------|
| 容量 | 5-10MB | 几百MB~GB（按磁盘比例） |
| API | 同步字符串 KV | 异步事务式，支持结构化数据 |
| 数据类型 | 只能字符串 | 二进制、对象、Blob |
| 索引 | 无 | 支持多索引、范围查询 |
| 事务 | 无 | 支持 ACID 事务 |
| 性能 | 同步阻塞主线程 | 异步非阻塞 |

localStorage 适合简单配置（<50KB）；IDB 适合结构化数据、离线缓存、大文件元数据。

**C7** 隐私模式 / Quota 限制下的容错（打开失败删库重建）

```js
async function openDB() {
  try {
    return await initIndexedDB();
  } catch (e) {
    // QuotaExceededError 或 SecurityError（隐私模式 Safari）
    console.warn('IDB open failed, rebuilding...', e);
    await new Promise((res, rej) => {
      const req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = res;
      req.onerror = rej;
    });
    return await initIndexedDB(); // 重建空库
  }
}
```

Safari 隐私模式下 IDB 存在但 Quota 为 0，写入时抛 `QuotaExceededError`。容错策略：捕获所有 IDB 初始化错误，先尝试删库重建，若再次失败则降级为纯内存 Map（数据不持久，但功能可用）。PIMS 在重建后向用户提示"离线缓存已重置"，不影响正常业务流程。

---

## D. Vue 3 命令式弹窗 hzztDialog

**D1** createApp 单独挂载 vs 在主 App 内挂载的区别？

`createApp` 创建完全独立的 Vue 应用实例，有自己的组件树、provide/inject 树、app.config、插件注册，与主 App 隔离。在主 App 内用 `Teleport` 或动态组件挂载，则共享同一个应用上下文，可以直接访问全局注册的组件、i18n、pinia 等。命令式弹窗选择 `createApp` 是因为需要在任意地方（包括非 Vue 环境，如工具函数）调用，代价是需要手动同步 appContext；而 Teleport 方案更简单但只能在组件内使用。

**D2** 为什么必须手动注入 appContext？不注入会丢失什么？⭐⭐⭐⭐

`createApp` 新建的实例没有任何插件，不注入 appContext 会丢失：① 全局注册的组件（如 `<HzztButton>`、`<ElButton>` 等 Element Plus 组件）—— 弹窗内无法解析，渲染报警告；② i18n 插件 —— `$t()` 调用报错；③ pinia store —— `useXxxStore()` 拿到的是新实例的 pinia，与全局 store 隔离；④ `app.provide` 注入的全局依赖（如 axios 实例、权限对象）。

```js
export function hzztDialog(options) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp(DialogComponent, options);
  // 关键：注入主应用的 appContext
  app._context = mainApp._context; // 或通过 provide 传入
  app.mount(container);
}
```

**D3** 弹窗内的 i18n / 全局组件 / pinia store 如何拿到？

三种方式：① 注入整个 `appContext`（`app._context = mainApp._context`）是最彻底的方式，全局注册的组件、插件、provide 全部继承；② 手动 `app.use(i18n).use(pinia)` 逐个安装，安全但冗余；③ 在 `DialogComponent` 的 props 中传入需要的 store/方法，最解耦但使用繁琐。PIMS 采用方案①，在应用启动时把 `mainApp` 实例挂到全局变量，命令式弹窗初始化时直接复用其 `_context`。

**D4** `render(null, container)` 的内部机制？为什么能防内存泄漏？

`render(null, container)` 触发 Vue 的 patch 算法：旧 vnode 存在、新 vnode 为 null，进入 `unmount` 流程——递归调用所有子组件的 `onBeforeUnmount`、`onUnmounted` 钩子，清理 `watchEffect`/`watch` 的副作用，解绑所有事件监听器，最后清空 DOM。相比直接 `container.remove()`，它走完了完整的卸载生命周期，确保所有响应式引用被释放，避免组件实例在内存中游离。`app.unmount()` 效果类似但必须是 `createApp` 创建的实例；`render(null)` 对 `render()` 创建的匿名 vnode 树适用。

**D5** 命令式 vs 声明式弹窗的取舍？

声明式（`v-model:visible`）适合：与当前组件数据强绑定、需要复杂双向交互的弹窗（编辑表单）；生命周期随父组件管理，理解成本低。命令式适合：从工具函数/Vuex action/路由守卫中触发的弹窗（如登录态失效提示）；跨组件层级调用；只需要 Promise 回调（`await hzztDialog.confirm()`）而不关心内部状态。PIMS 的删除确认、错误提示、loading 遮罩都用命令式，表单编辑弹窗用声明式，两者混用。

**D6** 多弹窗叠加的 z-index 管理？焦点管理？ESC 关闭？

z-index 用全局计数器：每次弹窗打开取 `zIndexManager.next()`（从 2000 起步，每次 +10），存到弹窗实例上；关闭时归还计数（或不归还，重置条件是弹窗全部关闭）。焦点管理：弹窗打开时 `focus()` 弹窗容器，关闭后 `focus()` 触发元素，避免焦点丢失；同时用 `focus-trap` 把 Tab 键限制在弹窗内（无障碍要求）。ESC 关闭：在弹窗 `onMounted` 里监听 `document.keydown`，匹配 `Escape` 键关闭最顶层弹窗（z-index 最大的那个），`onUnmounted` 移除监听。

---

## E. RxJS 在 HTTP / WebSocket / 防重复提交场景

**E1** Subject/BehaviorSubject/ReplaySubject/AsyncSubject 差异？

| 类型 | 初始值 | 新订阅者收到 | 完成后订阅 |
|------|--------|------------|-----------|
| Subject | 无 | 只收订阅后的值 | 空 |
| BehaviorSubject | 必须有 | 当前值 + 后续值 | 最后一个值 |
| ReplaySubject(n) | 无 | 最近 n 个值 + 后续值 | 最近 n 个值 |
| AsyncSubject | 无 | 只有 complete 时的最后一个值 | 最后一个值 |

PIMS 用 `BehaviorSubject` 持有登录状态（初始为 null），任何组件订阅后立即得到当前状态；用 `Subject` 作为错误 toast 的事件总线；用 `ReplaySubject(1)` 缓存最新 WebSocket 心跳状态，给延迟初始化的组件。

**E2** throttleTime(100) 合并错误 toast 的具体实现？

```js
const errorSubject = new Subject<string>();

errorSubject.pipe(
  throttleTime(100, asyncScheduler, { leading: true, trailing: false })
).subscribe(msg => ElMessage.error(msg));

// Axios 拦截器内
axios.interceptors.response.use(null, (err) => {
  errorSubject.next(err.response?.data?.message ?? '请求失败');
  return Promise.reject(err);
});
```

100ms 内多次网络错误只展示第一条。不用 `lodash.throttle` 的原因：① RxJS 的 throttleTime 可以组合其他操作符（如后续加 `distinctUntilChanged` 去重相同错误信息）；② 可以在 pipe 里统一处理订阅生命周期；③ 无需手动创建闭包持有 timer 引用。

**E3** Map + setTimeout 实现幂等锁的代码逻辑？为什么不用 exhaustMap？

```js
const pendingMap = new Map<string, boolean>();

async function submitWithLock(key: string, fn: () => Promise<any>) {
  if (pendingMap.get(key)) return; // 已有相同请求进行中
  pendingMap.set(key, true);
  try {
    return await fn();
  } finally {
    // 延迟 500ms 解锁，防止快速二次点击
    setTimeout(() => pendingMap.delete(key), 500);
  }
}
```

`exhaustMap` 不用是因为这个锁需要**跨组件实例**（多个按钮可能触发同一接口），RxJS 的 exhaustMap 依赖 Observable 链路，需要把所有触发点汇聚成同一个 Observable 才能用，改造成本高。Map 方案更通用，任何地方调用 `submitWithLock(apiKey, ...)` 即可互斥。

**E4** distinctUntilChanged 在 WebSocket 状态流转中的作用？

WebSocket 连接状态（connecting/connected/disconnected）可能频繁重复推送相同状态，导致 UI 重复刷新或重复触发重连逻辑。`distinctUntilChanged` 过滤掉连续相同的值：

```js
wsStatus$.pipe(
  distinctUntilChanged((prev, curr) => prev.code === curr.code)
).subscribe(status => updateConnectionUI(status));
```

比较函数自定义，只比较 `code` 字段，忽略 `timestamp` 等噪声字段的变化。没有这个操作符，每次 WebSocket 心跳都会重新渲染连接状态 badge，肉眼可见闪烁。

**E5** "热"和"冷" Observable 的差异？⭐⭐⭐⭐

冷 Observable：每次 `subscribe` 都独立执行生产者逻辑（如 `from(fetch(url))`），每个订阅者收到完整的数据序列，互不干扰。热 Observable：生产者独立于订阅者存在（如 `fromEvent(document, 'click')`），订阅者只收到订阅后发生的事件，多个订阅者共享同一生产者。Subject 是热的；`Observable.create` 默认冷的；`share()`/`shareReplay()` 可把冷变热（多播）。实际影响：Axios 请求封装成 Observable 是冷的，每次订阅都重新发请求；WebSocket 消息流是热的，多个组件共享同一连接。PIMS 用 `shareReplay(1)` 把登录态检查请求转为热的，避免多组件同时订阅发出多个 `/me` 请求。

**E6** 退订时机？Vue 组件中如何避免泄漏？

```js
// Vue 3 Composition API 最佳实践
const subscription = new Subscription();

onMounted(() => {
  subscription.add(
    wsStatus$.pipe(distinctUntilChanged()).subscribe(updateUI)
  );
  subscription.add(
    errorSubject.pipe(throttleTime(100)).subscribe(showToast)
  );
});

onUnmounted(() => subscription.unsubscribe()); // 一次性清理所有
```

用 `Subscription` 收集多个订阅，`onUnmounted` 统一退订。也可用 `takeUntil(destroy$)` 模式，在 `onUnmounted` 里 `destroy$.next()`。注意 `async pipe`（Vue 没有，Angular 有）在框架层自动退订；Vue 中必须手动管理。全局 Subject（如 errorSubject）的订阅如果不退订，组件销毁后 Subject 仍持有组件闭包引用，造成泄漏。

---

## F. 四层动态路由权限系统

**F1** 后端菜单树 → Vue Router 路由对象的递归转换算法？

```js
const modules = import.meta.glob('../views/**/*.vue');

function buildRoutes(menuTree, parent = null) {
  return menuTree.map(menu => ({
    path: menu.path,
    name: menu.name,
    component: menu.component
      ? modules[`../views/${menu.component}.vue`]
      : () => import('../layout/RouterView.vue'),
    meta: { title: menu.title, icon: menu.icon, permission: menu.permission },
    children: menu.children?.length ? buildRoutes(menu.children, menu) : undefined,
  })).filter(Boolean);
}
// 调用：router.addRoute(buildRoutes(menuTree)[0])
```

四层结构：顶层 Layout → 模块页（如"检验" "影像"）→ 功能页 → 详情/弹窗路由。`import.meta.glob` 懒加载组件，避免打包时把所有页面代码都打入同一 chunk。

**F2** `router.addRoute` 是同步还是异步？刷新后路由丢失的根因？

`router.addRoute` 是**同步**的，调用后路由立即生效。刷新丢失的根因：动态路由存在 store（内存）里，页面刷新后 store 重置，路由未重新添加，用户直接访问 `/someModule/detail` 时匹配不到任何路由，跳转到 404。解决方案：在全局路由守卫 `beforeEach` 里判断 `store.routes.length === 0`，重新拉取菜单并 `addRoute`，然后 `return { ...to, replace: true }` 重新导航到目标路由（触发一次重定向让新加的路由生效）。

**F3** 按钮级权限的 3 种实现方案对比

| 方案 | 实现 | 优点 | 缺点 |
|------|------|------|------|
| `v-if` + 工具函数 | `v-if="hasPermission('btn:delete')"` | 最直接 | 逻辑散落各处 |
| 自定义指令 `v-permission` | `el.remove()` 或 `el.style.display` | 集中，DSL 友好 | 指令销毁时机需注意 |
| 函数式封装 | `renderIfPermission(perm, <Button/>)` | TSX 类型安全 | 可读性稍差 |

PIMS 用自定义指令：`v-permission="['btn:delete', 'btn:edit']"` 支持数组，指令内 `Array.isArray` 判断；无权限时移除 DOM 节点而非隐藏（防止用户用 DevTools 改 display 绕过）。

**F4** 动态路由 + 按需加载，404 fallback 设计？

静态路由里最后加 `{ path: '/:pathMatch(.*)*', component: NotFound }`，但这条规则在动态路由加载**完成前**已经匹配，会误拦截合法路由。解决：404 路由延迟添加，在菜单接口返回、`addRoute` 完成后再 `addRoute('404-fallback', { path: '/:pathMatch(.*)*' })`。菜单未加载时（刷新瞬间）重定向到 loading 页或保持当前页直到菜单就绪，加载失败才跳 404。

**F5** 多角色用户切换时的路由清理策略？

Vue Router 4 没有 `removeRoutes`（全量），只有 `removeRoute(name)` 单条删除。策略：切换角色时，遍历当前动态路由列表逐一 `router.removeRoute(name)` 删除；再根据新角色菜单重新 `addRoute`。关键是要在 store 里维护"当前已添加的动态路由 name 列表"，才能精确删除。另一种简单方案：刷新页面（`window.location.reload()`），以重置整个 JS 状态，代价是体验不连续，适合角色切换不频繁的系统。

---

## G. Token 滑动续期 Axios 封装

**G1** "假登录态突然掉线"问题的完整复现路径？

用户感知：正在使用系统，突然所有请求报错，页面跳回登录。实际状态：access_token 已过期，但用户页面没有任何提示，直到发起下一个请求才触发 401。复现路径：① 用户登录，access_token 有效期 30min；② 用户离开电脑 35min（或 Tab 在后台超时）；③ 回来继续操作，前端 store 里 isLoggedIn=true（基于本地 token 判断，未做过期校验）；④ 发起请求 → 服务端返回 401；⑤ 未配置静默刷新时，直接跳登录页。根因：前端登录态判断依赖内存/localStorage 里的 token 存在性，而非 token 有效性。

**G2** 每次请求续期 vs 定时续期 vs 临近过期才续期的取舍

每次请求续期（滑动窗口）：用户活跃时永不过期，最佳 UX；服务端压力最大，每次请求都要更新 token 过期时间，并发高时有竞态。定时续期（固定间隔 refresh）：实现简单，但可能在用户不活跃时无谓续期，刷新请求本身也消耗服务端资源。临近过期才续期（提前 5min 检测）：后端压力最小；缺点是需要前端解析 token 过期时间（JWT），或额外维护过期时间戳，且 Tab 不活跃时无法触发。PIMS 采用**每次请求成功响应头带新 token**（服务端签发）+ 前端无条件替换的滑动续期，实现最简单，服务端做了 token 版本控制防重放。

**G3** 401 静默刷新 + 并发请求队列的伪代码⭐⭐⭐⭐

```js
let isRefreshing = false;
let waitQueue: Array<(token: string) => void> = [];

axios.interceptors.response.use(null, async (error) => {
  const originalReq = error.config;
  if (error.response?.status !== 401 || originalReq._retry) {
    return Promise.reject(error);
  }
  if (isRefreshing) {
    // 并发请求排队等待新 token
    return new Promise(resolve => {
      waitQueue.push((newToken) => {
        originalReq.headers['Authorization'] = `Bearer ${newToken}`;
        resolve(axios(originalReq)); // replay
      });
    });
  }
  isRefreshing = true;
  originalReq._retry = true;
  try {
    const { data } = await refreshTokenApi();
    const newToken = data.access_token;
    store.setToken(newToken);
    waitQueue.forEach(cb => cb(newToken)); // 统一 replay
    waitQueue = [];
    originalReq.headers['Authorization'] = `Bearer ${newToken}`;
    return axios(originalReq);
  } catch {
    waitQueue = [];
    router.push('/login');
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
});
```

**G4** refresh_token 也过期怎么办？降级 UX 设计？

refresh_token 过期（通常 7-30 天，代表用户长时间未活跃）：① 清除所有本地 token 存储；② 取消所有 pending 的 waitQueue 请求（reject 掉）；③ 弹出友好提示 Modal（"您已长时间未操作，请重新登录"）而非直接跳转，让用户保存当前表单数据；④ 用户点确认后跳登录页，并把当前路由 path 存到 `redirect` query 参数，登录成功后 redirect 回来，减少用户重复操作。

**G5** Cookie 存 token vs localStorage 的安全性？

`HttpOnly Cookie`：JS 无法读取，防 XSS 窃取 token；`SameSite=Strict/Lax` 防 CSRF；通过 HTTPS 传输加 `Secure` 标记。localStorage：JS 可读，XSS 注入脚本可直接 `localStorage.getItem('token')` 窃取，一旦有 XSS 漏洞即 token 泄漏。PIMS 医疗系统数据敏感，采用 HttpOnly Cookie 存 refresh_token，access_token 短期有效（15min）存内存（JS 变量），不持久化，刷新页面靠 refresh_token 换新的 access_token。这样即使 XSS，攻击者最多拿到 15min 有效的 access_token，且无法拿到 refresh_token。

**G6** CancelToken 在 Axios 0.x vs 1.x 的 API 差异

Axios 0.x：`axios.CancelToken.source()` 创建 `{ token, cancel }` 对；请求配置传 `cancelToken: source.token`，调用 `source.cancel('reason')` 取消。Axios 1.x：推荐使用标准 `AbortController`：`const controller = new AbortController()`，配置传 `signal: controller.signal`，调用 `controller.abort()` 取消；`CancelToken` API 仍保留但标记为 deprecated。PIMS 升级到 Axios 1.x 后统一改用 `AbortController`，路由切换时取消所有 pending 请求，在路由守卫 `beforeEach` 里 `controller.abort()` 并创建新实例。

---

## H. DICOM 医学影像集成（cornerstone.js）

**H1** WADO 协议是什么？跟 DICOM 文件直接加载的差异？

WADO（Web Access to DICOM Objects）是 DICOM 标准的 Web 访问协议，通过 HTTP GET 请求从 PACS 服务器检索 DICOM 实例，URL 格式如 `?requestType=WADO&studyUID=...&seriesUID=...&objectUID=...`。WADO-RS（RESTful）是更现代的版本，返回 multipart/related 响应。直接加载 DICOM 文件需要本地文件系统访问（`<input type=file>` 或 Electron），而 WADO 是 HTTP 协议，医院 PACS 系统直接暴露 WADO 接口，前端通过 URL 即可检索任意影像，无需文件传输。cornerstone 的 `wadouri` imageLoader 直接解析 WADO URL，处理 HTTP 请求和 DICOM 解码。

**H2** 窗宽窗位（Window/Level）的本质？

DICOM 影像灰度值通常是 12-16 bit（0-4095 或更大范围），直接显示到 8bit 显示器只能取低 8 位，大量信息丢失。窗宽（Window Width，WW）和窗位（Window Level/Center，WL）定义了一个灰度映射区间：WL±WW/2 范围内的 HU 值线性映射到 0-255，范围外截断为纯黑或纯白。医学意义：肺窗（WW=1500，WL=-600）显示肺组织细节；骨窗（WW=2000，WL=500）显示骨骼。同一张影像通过调整窗宽窗位，医生可以观察不同组织的对比度，这是医学影像诊断的基础操作。

**H3** cornerstone 的 enabledElement 状态管理 + 内存释放？

```js
// 初始化
cornerstone.enable(element);
cornerstone.loadAndCacheImage(wadoUrl).then(image => {
  cornerstone.displayImage(element, image);
});

// 组件销毁时必须释放
onUnmounted(() => {
  cornerstone.disable(element); // 清理 enabledElement 注册
  cornerstoneTools.clearToolState(element, 'Length'); // 清理测量工具状态
  cornerstoneWADOImageLoader.webWorkerManager.terminate(); // Worker 池
});
```

`enabledElement` 是 cornerstone 内部维护的 DOM 元素 → 渲染上下文映射表，不 `disable` 就永久持有 DOM 引用。图像缓存（`imageCache`）有 maxCacheSize 限制，超出时 LRU 淘汰；但可调用 `cornerstone.imageCache.purgeCache()` 手动清理。PIMS 在切换检查序列时主动 purge，避免大量 DICOM 影像在内存积压。

**H4** KFB 数字切片和 DICOM 标准的差异？为什么需要适配层？

KFB 是科慧生物的私有病理切片格式，基于多分辨率金字塔图像（类似 WSI），不属于 DICOM 标准。差异：① DICOM 有严格的元数据标签（Tag）规范，KFB 用私有 header；② DICOM 影像通过 WADO 协议访问，KFB 需要专有 SDK 解析；③ 渲染方式不同：DICOM 是单帧/多帧，KFB 需要 tile-based 瓦片渲染（类似地图）。适配层做的事：用 KFB SDK（WASM 版本）解析私有格式后，将 tile 数据转换为 cornerstone 可消费的 `Image` 对象，注册自定义 `imageLoader`，让 cornerstone 对 KFB 的处理路径透明。

**H5** STOMP WebSocket vs 原生 WebSocket 的差异？

原生 WebSocket 只有 `send(string|blob)` 和 `onmessage`，是二进制/文本帧协议，无订阅、无消息路由、无心跳标准。STOMP（Simple Text Oriented Message Protocol）是在 WebSocket 之上的应用层协议，提供：① 订阅/发布模型（`subscribe('/topic/dicom-ready', callback)`）；② 消息目的地（destination）路由；③ 标准化的 CONNECT/SUBSCRIBE/SEND 帧格式；④ 内置 ACK 机制。PIMS 影像处理完成后，PACS 通过 STOMP 推送 `/topic/studyReady/{studyUID}`，前端订阅对应 topic，收到后触发 cornerstone 加载，无需轮询接口。

---

## I. Vue 2 SSR 同构渲染

**I1** SSR vs CSR vs SSG 的差异？什么场景用 SSR？

CSR：服务端返回空 HTML + JS bundle，浏览器执行 JS 渲染，首屏白屏时间长，SEO 差。SSR：服务端执行 Vue/React，返回完整 HTML，浏览器 hydration 后接管交互，首屏快、SEO 好，但服务端有计算压力。SSG：构建时预渲染为静态 HTML，无服务端运行时，适合内容不频繁变化的页面（文档、博客）。选 SSR 的场景：内容动态（依赖用户身份/实时数据）+ 首屏性能/SEO 要求高，如医院信息门户的检验报告查询页（需要 SEO + 动态数据）。

**I2** 双入口代码同构原则？哪些 API 不能用？⭐⭐⭐⭐

同构原则：一份代码，通过 entry-server.js 和 entry-client.js 两个入口分别在 Node.js 和浏览器运行。禁用的 API：① `window`/`document`/`localStorage`/`navigator`——Node.js 没有；② `setTimeout`/`setInterval` 在服务端可能造成内存泄漏（请求处理完后 timer 仍持有引用）；③ 第三方库的浏览器专属代码（需用 `process.env.VUE_ENV === 'server'` guard 或动态 import）；④ `mounted` 钩子（SSR 不执行，只执行 `created`/`beforeCreate`）——DOM 操作只能在 `mounted` 里。同构代码用 `process.client` 判断，browserOnly 代码包裹在 `if (process.client)` 中。

**I3** `window.__INITIAL_STATE__` hydration 时的 XSS 风险？

服务端注入：`<script>window.__INITIAL_STATE__ = ${JSON.stringify(state)}</script>`。如果 state 里有用户输入的内容包含 `</script>`，会提前关闭 script 标签，后续内容被解析为 HTML，攻击者可注入任意 script。防御方案：不用 `JSON.stringify`，改用 `serialize-javascript` 库，它会转义 `</`、`<!--` 等危险序列：

```js
const serialize = require('serialize-javascript');
`window.__INITIAL_STATE__ = ${serialize(state, { isJSON: true })}`;
// 输出: window.__INITIAL_STATE__ = {"content":"\\u003C/script\\u003E"}
```

**I4** LRU 组件级缓存的失效策略？什么组件不能缓存？

```js
const microCache = LRU({ max: 100, maxAge: 1000 * 60 }); // 100条，1分钟TTL
serverRenderer.renderToString(context, (err, html) => {
  const cacheKey = getCacheKey(context); // URL + 用户等级 等维度
  microCache.set(cacheKey, html);
});
```

不能缓存的组件：① 含用户个性化数据（用户名、余额、权限）；② 含实时数据（股票价格、报警状态）；③ 含 CSRF token；④ 含随机数/时间戳。PIMS 只缓存纯展示型的公共组件（医院公告、科室列表），缓存 key 不含用户 ID，TTL 60s。用户信息相关页面绕过缓存，每次服务端渲染。

**I5** SSR 内存泄漏的常见场景⭐⭐⭐⭐

① 单例污染：在模块顶层创建单例（store、router），多个请求共享同一实例，A 请求的数据泄漏给 B 请求。解决：每次请求创建新的 store/router 实例（工厂函数模式）。② 全局事件监听器：在 `created` 里 `EventBus.$on`，SSR 不执行 `destroyed`，监听器积累不释放。③ 闭包持有 req/res：中间件闭包意外持有请求对象，请求完成后 GC 无法回收。④ 定时器：`setInterval` 在请求处理函数里注册，请求结束后 timer 仍运行，持有闭包。PIMS 排查泄漏工具：`--expose-gc` + `global.gc()` + heapdump，对比两次快照的对象增量。

**I6** asyncData 静态方法 vs Nuxt 的 setup 异步预取的演进

Vue 2 SSR 的 asyncData：挂载为组件静态方法 `Component.asyncData({ store, route })`，服务端渲染时 router 匹配到组件后手动调用，await 结果注入 store，组件 created 时从 store 取数据，客户端 hydration 后不重复请求（利用 `__INITIAL_STATE__`）。Nuxt 3 的 `useAsyncData`/`useFetch` composable：在 `setup()` 里调用，运行时自动判断服务端/客户端，自动处理 hydration 状态同步，API 更符合 Vue 3 风格，不需要静态方法约定。演进方向：从"框架约定的静态方法"到"运行时 composable"，开发体验更好，类型推断更完整。

---

## J. ECharts 大屏地图多级下钻

**J1** ECharts 自定义系列/自定义 series-map 渲染的扩展点？

ECharts 的 `series-custom` 通过 `renderItem` 函数暴露低级渲染接口，可以用 `graphic` 元素（rect/circle/path/group）组合绘制任意图形。地图下钻的自定义点：① 自定义 tooltip 格式（`formatter` 返回 HTML 字符串）；② 自定义地图边界样式（`itemStyle` + `emphasis`）；③ 自定义数据标注（`series-effectScatter` 做呼吸灯效果）；④ 自定义 legend 交互（`legendselectchanged` 事件联动多图）。PIMS 大屏用 `series-map` + `series-effectScatter` 叠加，effectScatter 做重点地区标注，地图点击事件触发下钻。

**J2** 多个 ECharts 实例的内存管理？

```js
const chartInstances = new Map<string, EChartsType>();

function initChart(el: HTMLElement, id: string) {
  const chart = echarts.init(el, null, { renderer: 'canvas' });
  chartInstances.set(id, chart);
  return chart;
}

// 组件销毁
onUnmounted(() => {
  chartInstances.forEach(chart => chart.dispose());
  chartInstances.clear();
});

// 响应窗口 resize（防抖）
const handleResize = debounce(() => {
  chartInstances.forEach(chart => chart.resize());
}, 300);
window.addEventListener('resize', handleResize);
onUnmounted(() => window.removeEventListener('resize', handleResize));
```

`dispose` 释放 ECharts 内部的 canvas、事件监听、定时器，不调用会导致 DOM 已移除但 ECharts 仍持有引用的内存泄漏。

**J3** 千级数据点的渲染性能优化？

① `progressive: 400` + `progressiveThreshold: 3000`：超过阈值时分批渐进渲染，避免一次性渲染卡帧；② `large: true` + `largeThreshold: 2000`（scatter/lines 系列支持）：启用 WebGL 加速渲染；③ 数据降采样：前端用 LTTB 算法（最大三角形三桶）把 10000 点降到 1000 点，视觉损失极小；④ 切换到 SVG renderer（数据点少但需要清晰度）或 Canvas renderer（大数据量）；⑤ 地图关闭 `hoverLayerThreshold`（默认 3000），减少 hover 重绘开销。PIMS 大屏在 10000+ 检测点时用了 `large: true` + 数据预聚合（省/市级别合并），渲染时间从 800ms 降到 80ms。

**J4** 大屏适配方案对比：rem/vw/scale transform

| 方案 | 原理 | 优点 | 缺点 |
|------|------|------|------|
| rem | root font-size 按屏宽动态设置 | 字体缩放友好 | 需要 px→rem 转换，设计稿换算麻烦 |
| vw/vh | 相对视口百分比 | 原生 CSS，无 JS | 不支持固定宽高比；多媒体查询复杂 |
| scale transform | 固定设计稿尺寸，整体缩放 | 实现最简单，与设计稿 1:1 | 字体模糊（位图缩放），点击事件坐标需修正 |

PIMS 大屏固定设计尺寸 1920×1080，用 `transform: scale(ratio)` + `transform-origin: 0 0` 整体缩放，ratio = `Math.min(window.innerWidth/1920, window.innerHeight/1080)`。ECharts 在 scale 后也需要 `chart.resize({ width: 1920, height: 1080 })` 保持内部坐标系正确。

---

## K. CI/CD 卡顿排查（你的故事）

**K1** Chrome Performance 面板各泳道的含义？

- **Network**：资源加载时序（蓝=HTML，紫=CSS，黄=JS，绿=图片），查看 TTFB 和加载顺序
- **Frames**：每帧耗时和截图，帧率低于 60fps 时帧变红
- **Main**：主线程任务时间线，每个 Task 方块，红色三角=Long Task（>50ms），展开可看调用栈
- **Compositor**：合成线程，处理 CSS transform/opacity 动画
- **GPU**：GPU 内存占用（光栅化、图层合成）
- **Memory**：JS Heap/DOM 节点/事件监听数，用于内存泄漏分析

排查卡顿主要看 Main 泳道：找红色 Long Task，展开调用栈定位是脚本执行、样式计算还是 Layout。

**K2** Long Task 的定义？如何线上监控？

Long Task 定义：主线程上执行超过 **50ms** 的任务（W3C Long Tasks API 规范）。线上监控：

```js
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach(entry => {
    // entry.duration 是任务耗时（ms）
    if (entry.duration > 100) { // 只上报严重 Long Task
      analytics.track('long_task', {
        duration: entry.duration,
        startTime: entry.startTime,
        url: location.href,
      });
    }
  });
});
observer.observe({ entryTypes: ['longtask'] });
```

结合 `navigator.sendBeacon` 上报到日志系统，聚合后按 P95/P99 统计，设置阈值告警。

**K3** JS bundle 语法降级异常的具体表现？如何对比本地和线上产物？⭐⭐⭐⭐

表现：线上 bundle 包含了 ES6+ 语法（如 `??` null coalescing、`?.` optional chaining、`async generator`），在低版本 Chrome（如 Chrome 72 以下）执行时抛 `SyntaxError: Unexpected token`，导致整个 chunk 加载失败，页面白屏。但奇怪的是本地 dev 和本地 build 没有问题，因为本地 Chrome 版本高。对比方法：① `npx source-map-explorer dist/js/*.js` 可视化 bundle 内容；② 直接用 `grep -r "??\|?\..*(" dist/` 搜索降级目标；③ 用 `acorn --ecma2015` 尝试解析 bundle，遇到 ES2020 语法报错说明降级失败；④ CI 环境的 Node.js 版本不同会影响 `@babel/preset-env` 的 target 解析（某些版本 bug 导致 browserslist 查询结果不同）。PIMS 排查发现 CI 用 Node 16，本地 Node 18，某个 babel 插件在 Node 16 下解析 browserslist 时忽略了 `.browserslistrc`，导致 target 降级到 modern 模式。

**K4** browserslist + babel-preset-env 和 Node.js 版本的关联？

`babel-preset-env` 依赖 `browserslist` 解析目标浏览器列表（`.browserslistrc` 或 `package.json` 的 `browserslist` 字段），再查 `@babel/compat-data` 决定需要 polyfill 和转译的语法特性。Node.js 版本的关联点：① `browserslist` 的 `defaults` query 依赖 `caniuse-lite` 数据库，旧版 Node 可能使用旧版 caniuse-lite，数据不同导致目标集不同；② 部分 babel 插件在不同 Node 版本下有 bug（如 `@babel/plugin-transform-optional-chaining` 的某个版本在 Node 14 下输出不正确）；③ CI 和本地 Node 版本不一致是根因，解决方案：在 `.nvmrc`/`.node-version` 固定 Node 版本，CI pipeline 也使用相同版本。

**K5** 从 0 到 1 建立线上性能监控告警？

① **采集层**：在页面入口注入 Performance SDK，采集 FCP/LCP/FID/CLS（Web Vitals）+ Long Task + 资源加载耗时 + JS 错误，用 `navigator.sendBeacon` 批量上报（离开页面不丢数据）。② **存储层**：日志写入 ClickHouse（高吞吐列存），按 `(url, device, date)` 分区。③ **计算层**：定时任务每 5 分钟聚合计算 P50/P75/P95/P99，写入告警指标表。④ **告警层**：规则引擎监控指标，LCP P75 > 2500ms 或 Long Task 频率 > 5次/分 触发钉钉/邮件告警，附上 Session Replay 链接。⑤ **归因层**：结合 source-map 把错误堆栈还原到源码行，关联 Git commit 定位引入时间点。

---

## L. 工程化（多环境构建/OSS 直传/通用组件库）

**L1** 时间戳 chunk 替代 contenthash 在长效缓存上的副作用？

`contenthash` 只在文件内容变化时改变 hash，未修改的 chunk 可以被浏览器/CDN 长期缓存（Cache-Control: max-age=31536000）。用构建时间戳（如 `chunk.[timestamp].js`）的副作用：每次构建所有 chunk 文件名都改变，即使没有代码变动，CDN 缓存全部失效，用户每次部署后需要重新下载所有 JS 文件，带宽浪费，首屏变慢。时间戳方案的唯一合理场景：开发/测试环境强制刷新，防止 CDN 缓存旧版本。生产环境必须用 `contenthash`，同时把 `runtime chunk` 单独抽取（运行时每次构建都变，但体积很小）。

**L2** OSS 直传的临时 Policy 安全设计？

```js
// 服务端签发（Node.js）
const policy = {
  expiration: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5分钟有效
  conditions: [
    ['content-length-range', 0, 50 * 1024 * 1024], // 限制 50MB
    ['starts-with', '$key', `uploads/${userId}/`],   // 限制上传路径
    { bucket: 'pims-uploads' },
  ],
};
const base64Policy = Buffer.from(JSON.stringify(policy)).toString('base64');
const signature = hmacSha1(base64Policy, OSS_SECRET);
// 返回 {policy, signature, OSSAccessKeyId, host} 给前端
```

安全要点：① 过期时间短（5min）防 Policy 泄漏后被滥用；② `starts-with` 限制上传路径到用户自己的目录，防越权上传；③ `content-length-range` 限制文件大小，防 DoS；④ Policy 由服务端用 OSS_SECRET 签名，前端无法伪造；⑤ OSS Bucket 设为私有，生成的 URL 需带签名才能访问。

**L3** 通用业务组件的可复用性边界？什么应该抽，什么不该？

应该抽：① 多处使用（>=3 个页面）的相同交互模式（搜索表单、数据表格、分页）；② 业务无关的 UI 原子（状态标签、金额展示、文件预览）；③ 复杂交互封装（富文本、图片裁剪、签名板）。不应该抽：① 仅一处使用的组件，抽象成本 > 收益；② 业务数据强耦合的组件（组件内直接 `useXxxStore()` 拉数据），会造成组件对 store 的隐式依赖；③ 过于简单的展示逻辑，用 CSS class 就够了。可复用边界原则：组件通过 props 接收数据，通过 emits 发出事件，不直接访问全局 store，可以在 Storybook 里独立渲染测试。

**L4** UNI-APP 条件编译的实现机制？跟 Vue CLI ifdef 的差异？

UNI-APP 条件编译是**预处理层面**的代码剔除，语法如：

```js
// #ifdef H5
console.log('仅 H5 平台');
// #endif
// #ifndef APP-PLUS
import { xxx } from 'h5-only-lib'; // 非 App 端才引入
// #endif
```

编译器（基于 webpack/vite 插件）在 parse 阶段扫描这些注释标记，根据当前构建平台（`UNI_PLATFORM` 环境变量）决定保留或删除代码块，最终产物中不包含其他平台代码。与 Vue CLI 的 `@vue/babel-plugin-transform-vue-jsx` 的 ifdef 对比：UNI-APP 的条件编译作用于源码的注释层（JS/CSS/template 都支持），webpack DefinePlugin + 三元判断的方式会在产物里保留死代码；UNI-APP 方案产物更干净，但 IDE 类型检查对被剔除代码无感知，容易有 lint 误报。

**L5** 7 套 .env 维护的痛点？更好的方案？

痛点：① 文件数量多，新增环境变量要改 7 个文件，容易漏改；② 不同环境的差异分散在各文件，难以一眼看出 staging 和 prod 的差异；③ `.env.*` 文件可能被意外提交（含密钥），`.gitignore` 配置容易出错；④ 类型不安全，`import.meta.env.VITE_API_URL` 是 `string | undefined`。改进方案：① `dotenv-flow`：只维护 `.env`（共用）+ `.env.[environment]`（差量），减少重复；② `envalid`：在启动时 validate 所有 env 变量（类型检查、必填校验），缺少变量立即报错而非运行时 undefined；③ 配置中心（Consul/Apollo）：敏感配置不放文件，通过 CI 注入或运行时拉取，彻底解决密钥提交风险；④ 生成 TypeScript 类型定义文件（`vite-plugin-env-compatible`），env 变量有自动补全和类型检查。


---

## 准备建议

### 重点准备清单（按优先级）

| 优先级 | 内容 | 时间分配 |
|---|---|---|
| 🔴 必准备 | 第二部分（简历亮点深挖 A-L）| 60% |
| 🔴 必准备 | Vue 2/3 响应式 + Diff 原理 | 15% |
| 🟡 强化 | JS 基础进阶（闭包 / 原型 / Promise / EventLoop）| 10% |
| 🟡 强化 | 工程化 + 性能优化 | 10% |
| 🟢 加分 | TypeScript 高级类型 / 设计模式 | 5% |

### 常见踩坑

- ❌ 只讲"用了什么"，不讲"为什么这么选 / 别的方案为什么不行"
- ❌ 量化数据没有 → 简历里写的 35%、99% 等数字一定要能讲来源
- ❌ 八股文背了但讲不出工程实践 → 高级岗最忌讳
- ❌ 反问环节问薪资 / 加班 / 福利 → 反问要问业务和技术

---

**祝顺利 🎯**
