### 03-29

#### 1、...解构赋值是深拷贝还是浅拷贝？

解构赋值，如果所解构的原对象是一维数组或对象，其本质就是对基本数据类型进行等号赋值，那它就是深拷贝；
如果是多维数组或对象，其本质就是对引用类型数据进项等号赋值，那它就是浅拷贝；

```javascript
<script>
  function deepClone(source){
  const targetObj = source.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
  for(let keys in source){ // 遍历目标
    if(source.hasOwnProperty(keys)){
      if(source[keys] && typeof source[keys] === 'object'){ // 如果值是对象，就递归一下
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        targetObj[keys] = deepClone(source[keys]);
      }else{ // 如果不是，就直接赋值
        targetObj[keys] = source[keys];
      }
    }
  }
  return targetObj;
}
</script>
```

### 04-02

#### 1、input.setSelectionRange(start, end, selectionDirection)的使用;

```javascript
<html>
<input
  type="text"
  id="text-box"
  size="20"
  class="blinking_cursor"
  value="Hello world!"
/>
<button onclick="addEvent()">添加监听</button>
<button onclick="selectText()">Select text</button>
<button onclick="getedit(-1)">光标前移</button>
<button onclick="getedit(1)">光标后移</button>
</html>
<style>
  input {
    caret-color: red;
    caret-shape: block;
  }
</style>
<script>
function addEvent() {
  const input = document.getElementById("text-box");
  input.addEventListener("input", () => {
    console.log(123);
    // getedit(1);
    selectText();
  });
}
function selectText() {
  const input = document.getElementById("text-box");
  input.focus();
  input.setSelectionRange(input.selectionStart, input.selectionEnd + 1);
  // input.select();
}
function getedit(res) {
  const input = document.getElementById("text-box");
  input.focus();
  input.setSelectionRange(input.selectionStart + res, input.selectionEnd + res);
}

</script>
```

### 0411

#### 1、npm config set legacy-peer-deps true

当前 npm 版本 V8.11.0
[参考文章](https://zhuanlan.zhihu.com/p/666691309)
在 npm 7 之前，npm 不会自动安装 peer dependencies。而在 npm 7 中，npm 改变了这个行为，开始尝试自动安装所有的 peer dependencies
主要用于解决 npm 7 及以上版本 在处理 peer dependencies 时的一些问题
可以让 npm 回退到旧的行为，即不自动安装 peer dependencies，避免了版本冲突的问题
暂时解决包版本不匹配的问题，但是运行起来版本不匹配的问题还会存在

#### 2、Provider react-redux 根组件

<Provider> 组件使 Redux store 可用于任何需要访问 Redux store 的嵌套组件
一般放在根组件里

#### 3、Suspense

<Suspense> 允许在子组件完成加载前展示后备方案。

### 0415

#### 1、https://gitee.com/vdpadmin/variant-form Vue 低代码可视化表单

### 0419

#### JavaScript 中获取光标位置

主要 API：selectionStart、selectionEnd、setSelectionRange
HtmlElement 元素包含了以上方法，在获取 Dom 元素之后是可以直接通过这些 API 获取光标位置的
如果使用 Ref 获取的 Dom 元素，可能会拿不到实时的位置数据，可以试一下 click、input 自动带出的 HtmlElement 元素去取值，或者直接用 Dom 方法获取元素再试试

[参考文档](https://cloud.tencent.com/developer/article/1753347)

```html
<html>
  <head>
    <title>JavaScript 中获取光标位置</title>
  </head>
  <body>
    <p>
      <label>输入框测试:</label>
      <input
        type="text"
        style="width:220px"
        onclick="getCursortPosition(event);"
      />
      <span>光标位置:</span>
      <span></span>
    </p>
    <p>
      <label>文本框测试:</label>
      <textarea
        rows="5"
        style="width:220px"
        onclick="getCursortPosition(event);"
      ></textarea>
      <span>光标位置:</span>
      <span></span>
    </p>
    <div>
      <label>可编辑div:</label>
      <div
        contenteditable="true"
        class="edit-div"
        onclick="getCursortPosition(event);"
      ></div>
      <span>光标位置:</span>
      <span></span>
    </div>
  </body>
</html>
<style>
  p {
    display: flex;
    flex-direction: row;
  }

  .btn {
    height: 24px;
    margin: 0 10px;
  }

  .edit-div {
    display: inline-block;
    width: 225px;
    border: 1px solid #decdcd;
  }
</style>
```

```javascript
<script>

        function getCursortPosition(e) {
            // 获取父级元素
            var eleP = e.target.parentNode;
            var pos = 0;
            if (e.target.nodeName == "DIV") {
                pos = getDivPosition(e.target);
            } else {
                pos = getPosition(e.target);
            }
            var spanEle = (eleP.childNodes)[7];
            spanEle.innerText = pos;
        }

        // 可编辑div获取坐标
        const getDivPosition = function (element) {
            var caretOffset = 0;
            var doc = element.ownerDocument || element.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel;
            // 谷歌、火狐
            if (typeof win.getSelection != "undefined") {
                sel = win.getSelection();
                // 选中的区域
                if (sel.rangeCount > 0) {
                    var range = win.getSelection().getRangeAt(0);
                    // 克隆一个选中区域
                    var preCaretRange = range.cloneRange();
                    // 设置选中区域的节点内容为当前节点
                    preCaretRange.selectNodeContents(element);
                    // 重置选中区域的结束位置
                    preCaretRange.setEnd(range.endContainer, range.endOffset);
                    caretOffset = preCaretRange.toString().length;
                }
                // IE
            } else if ((sel = doc.selection) && sel.type != "Control") {
                var textRange = sel.createRange();
                var preCaretTextRange = doc.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint("EndToEnd", textRange);
                caretOffset = preCaretTextRange.text.length;
            }
            return caretOffset;
        }

        // 输入框获取光标
        const getPosition = function (element) {
            let cursorPos = 0;
            // IE
            if (document.selection) {
                var selectRange = document.selection.createRange();
                selectRange.moveStart('character', -element.value.length);
                cursorPos = selectRange.text.length;
            } else if (element.selectionStart || element.selectionStart == '0') {
                cursorPos = element.selectionStart;
            }
            return cursorPos;
        }


    </script>
```

#### [Markdown.com.cn（editor）](https://markdown.com.cn/editor/)

### 0506

#### Vue2

选项式 API

- 1、渲染 App
  new 一个新的 vue 实例

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

```javascript
// app.vue
<template>
  <h1>这是一段示范文字</h1>
</template>
<script>
export default {
  name: 'App'
}
</script>
// main.js
import Vue from 'vue'
import App from './App.vue'
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})

```

#### Vue3

- 1、组合式 API

```javascript
// 组合式API写法，可以vue2、vue3混合使用
// 需要声明defineComponent
<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
export default defineComponent({
 name: 'mediaDialog',
 props: {
   name: String,
   visible: Boolean
 },
 setup(props, context) {
   // 使用 context.emit('update:visible', false)，改变父组件v-model='visible'的值
   const handleClose = function() {
     context.emit('update:visible', false)
   }
   return { handleClose }
 }
})
</script>
// 这个 setup attribute 是一个标识，告诉 Vue 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API
<script setup name='searchPage'></script>
```

- 2、使用 v-model 传递参数并修改

> 如果在子组件中需要获取传递到父组件的值，需要在 nexTick 方法中获取

```javascript
/*
  1、emit('update:propsDate')(ps:0506 1、组合式 API)
  2、在子组件中使用 defineModel 接收(ps:如下)
*/
<!-- Child.vue -->
<script setup>
const model = defineModel()
function update() {
  model.value++;
  nexTick(() => {
  console.log(model.value)
  })
}
</script>
<template>
  <div>parent bound v-model is: {{ model }}</div>
</template>
<!-- Parent.vue -->
<Child v-model="countModel" />
```

- 3、渲染 App

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

```javascript
// app.vue
<template>
  <h1>这是一段示范文字</h1>
</template>;
// main.js
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

### 0507

#### vue3

- 1、resolveComponent
  > 按名称手动解析已注册的组件 备注：如果你可以直接引入组件就不需使用此方法

```javascript
// 类型
function resolveComponent(name: string): Component | string;
// 使用示例
<script setup lang="ts">
import { SomeComponent } from '@/components/SomeComponent';
const MyButton = resolveComponent('MyButton');
</script>

<template>
  <component :is="clickable ? MyButton : 'div'" />
  <component :is="SomeComponent" />
</template>
```

- 2、resolveDirective
  > 按名称手动解析已注册的指令

```javascript
function resolveDirective(name: string): Directive | undefined;
```

- 3、withDirectives

```javascript
// 类型
function withDirectives(
  vnode: VNode,
  directives: DirectiveArguments
): VNode

// [Directive, value, argument, modifiers]
type DirectiveArguments = Array<
  | [Directive]
  | [Directive, any]
  | [Directive, any, string]
  | [Directive, any, string, DirectiveModifiers]
>
// 示例
import { h, withDirectives } from 'vue'

// 一个自定义指令
const pin = {
  mounted() {
    /* ... */
  },
  updated() {
    /* ... */
  }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

### 0508

#### git 提交命令行

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `workflow` 工作流改进
- `ci` 持续集成
- `types` 类型定义文件更改
- `wip` 开发中
- `Revert` 还原

### 0509

#### NUXT demo

这个框架像是优化 webpack 配置项的另一种形式，
页面框架是基于 VUE 框架开发的，有很多自己的私有库
但是好多页面样式组件都是已经封装好的，这样使用下来不太方便，没有办法个性化设置，针对公司业务开发的话也不能很方便的自定义开发。
不过一些好用的 API 可以借鉴一下

不仅是对 webPack 配置项的封装优化，还有好多方便操作 dom 的方法

1. Nuxt 常用文档地址

- 1.1 [nuxt-中文](https://nuxt.com.cn/)
- 1.2 [nuxt-UI](https:/]ui.nuxt.com/)
- 1.3 [VueUse](https://www.vueusejs.com/)

2. nuxt-UI 中一些有意思的 API
   他对快捷键设置到时挺全的，随处可见
   defineShortcuts
   This module provides a defineShortcuts composable that allows you to define keyboard shortcuts in your app really easily.
   > 可以很方便的定义一些快捷键设置，ps:ctrl、command、?、/ 等等。省去 document 监听 keyboard 事件，挺方便的

```javascript
<template>
<UModal v-model="isOpen" />
</template>

<script setup lang="ts">
const isOpen = ref(false)

defineShortcuts({
meta_k: {
  {/*
    1、Prop: usingInput?: string | boolean
    2、默认情况下，usingInput为false，这意味着它只会在没有输入被聚焦时触发。当设置为true时，当任何输入聚焦时，快捷方式也会触发。
   */}
  usingInput: true,
  {/*
    1、Prop: whenever?: WatchSource<boolean>[]
   */}
  whenever: [isOpen],
  handler: () => {
    isOpen.value = !isOpen.value
  }
}
})
</script>

```

3. Shortcuts keys are written as the literal keyboard key value. Combinations are made with \_ separator. Chained shortcuts are made with - separator.
   > Modifiers are also available:

- meta: acts as Command for MacOS and Control for others
- ctrl: acts as Control
- shift: acts as Shift and is only necessary for alphabetic keys
  > Examples of keys:
- escape: will trigger by hitting Esc
- meta_k: will trigger by hitting ⌘ and K at the same time on MacOS, and Ctrl and K on Windows and Linux
- ctrl_k: will trigger by hitting Ctrl and K at the same time on MacOS, Windows and Linux
- shift_e: will trigger by hitting Shift and E at the same time on MacOS, Windows and Linux
- ?: will trigger by hitting ? on some keyboard layouts, or for example Shift and /, which results in ? on US Mac keyboards
- g-d: will trigger by hitting g then d with a maximum delay of 800ms by default
- arrowleft: will trigger by hitting ← (also: arrowright, arrowup, arrowdown)

4. useShortcuts
   > To display shortcuts in your app according to the user's OS, you can use the useShortcuts composable.
   > 要在应用中根据用户的操作系统显示快捷方式，你可以使用 usesshortcuts 组合项。

```javascript
<script setup lang="ts">
const { metaSymbol } = useShortcuts()
</script>

<template>
  <UKbd>{{ metaSymbol }}</UKbd>
</template>
```

#### command 命令行

### 0511

#### Nuxt 好用的 API 参考

1、 DashboardSearchButton <--> DashboardSearch
这两个组件看起来没什么关联，但是可以用**[useUIState](https://ui.nuxt.com/pro/components/content-search-button#usage)**把两个单独的 UI 组件关联起来

```javascript
<script setup lang="ts">
  {/*
    isDocsSearchModalOpen用来控制DashboardSearch面板的显隐
    这样无论这两个组件放在哪里都可以方便操作打开关闭
   */}
const { toggleDocsSearch, isDocsSearchModalOpen } = useUIState()
</script>

<template>
  <UButton label="Open" @click="toggleDocsSearch" />
</template>
```

2、nuxt 使用 fetch 分发接口请求 **[useFetch](https://nuxt.com.cn/docs/api/composables/use-fetch)**

```javascript
<script setup>
const route = useRoute()

const { data, pending, error, refresh } = await useFetch(`https://api.nuxtjs.dev/mountains/${route.params.slug}`, {
  pick: ['title']
})
</script>

```

3、**[server](https://nuxt.com.cn/docs/guide/directory-structure/server)** 目录也挺有意思的，但是，这有啥用？

> server/目录用于在应用程序中注册 API 和服务器处理程序。
> 每个文件应该导出一个使用 defineEventHandler()或 eventHandler()（别名）定义的默认函数。

```javascript
-| server/
---| api/
-----| hello.ts      # /api/hello
---| routes/
-----| bonjour.ts    # /bonjour
---| middleware/
-----| log.ts        # 记录所有请求

```

4、vueUse 方法
4.1 **[formatTimeAgo](https://vueuse.org/core/useTimeAgo/#non-reactivity-usage)**

> In case you don't need the reactivity, you can use the formatTimeAgo function to get the formatted string instead of a Ref. formatted string(格式化时间为字符串)

### 0513

#### @vueuse/core **[useBreakpoints](https://www.vueusejs.com/core/useBreakpoints/)**

> 响应式获取视口断点

```javascript
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);
const smAndLarger = breakpoints.greaterOrEqual("sm"); // sm and larger
const largerThanSm = breakpoints.greater("sm"); // only larger than sm
const lgAndSmaller = breakpoints.smallerOrEqual("lg"); // lg and smaller
const smallerThanLg = breakpoints.smaller("lg"); // only smaller than lg
if (smallerThanLg) {
  console.log("超小视口");
}
```

#### Vue **[defineOptions](https://cn.vuejs.org/guide/components/attrs.html#disabling-attribute-inheritance)**

1. 透传进来的 attribute 可以在模板的表达式中直接用 $attrs 访问到。

```javascript
<script setup>
defineOptions({
  inheritAttrs: false // 禁用 Attributes 继承
})
</script>
<span>Fallthrough attribute: {{ $attrs }}</span>
```

2. 示例

```javascript
/* 
  在单根节点组件
  我们可以通过设定 inheritAttrs: false 和使用 v-bind="$attrs" 来实现
  所有像 class 和 v-on 监听器这样的透传 attribute 都应用在内部的 <button> 上而不是外层的 <div> 上
*/
/* children component */
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">
    Click Me
  </button>
</div>
```

3. 在 JavaScript 中访问透传 Attributes

```javascript
// vue3.x 组合式API获取透传属性
<script setup>import {useAttrs} from 'vue'; const attrs = useAttrs()</script>;
// Vue3.x 选项是API获取透传属性
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs);
  },
};
```

### 0514

#### [Intl](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl)

> Intl 对象是 ECMAScript 国际化 API 的一个命名空间，它提供了精确的字符串对比、数字格式化，和日期时间格式化.
> Collator，NumberFormat 和 DateTimeFormat 对象的构造函数是 Intl 对象的属性.

```javascript
Intl.NumberFormat(locales, options);
// maximumFractionDigits 要使用的分数位数的最大数目
const formatNumber = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format;
locales:
  ['区域设置']-('de-DE','ja-JP', 'en-IN');
options.style:
  The formatting style to use.
    "decimal" (default)
    For plain number formatting.
    "currency"
    For currency formatting.
    "percent"
    For percent formatting.
    "unit"
    For unit formatting.
options.currency:
    "USD"
    For the dollar.
    "EUR"
    For the euro.
    "CNY"
    For Chinese RMB.
    "JPY"
    For Japanese yen.
options.currencyDisplay:
  How to display the currency in currency formatting.
    "code"
    Use the ISO currency code.
    "symbol" (default)
    Use a localized currency symbol such as €.
    "narrowSymbol"
    Use a narrow format symbol ("$100" rather than "US$100").
    "name"
    Use a localized currency name such as "dollar".
```

### 0515

#### **_[useAsyncData](https://nuxt.com.cn/docs/api/composables/use-async-data)_**

> 获取异步解析的数据
> useAsyncData 是一种组合式，可以直接在设置函数、插件或路由中调用。
> 它返回响应式的组合式，并处理将响应添加到 Nuxt 负载中，以便在页面水合时从服务器传递到客户端，而不需要在客户端重新获取数据。

```javascript
<script setup>
  const {(data, pending, error, refresh)} = await useAsyncData( 'mountains', ()
  => $fetch('https://api.nuxtjs.dev/mountains') )
</script>
```

#### **_[@unovis/vue](https://unovis.dev)_**

1. 一个新的图表插件，和 Echarts 相比的话，功能都差不多，但是有一些模块挺好玩的，可以借鉴

2. 这个图标组件库好像是单独模块开发，组合使用的，拼凑性的[dashboard-Nuxt]()项目有延时，可以参考一下

```javascript
/* 
  1、Graph
  2、Brush
  3、Free Brush
  4、Timeline
*/
```

### 0517

#### **_[css 属性 attr 使用小技巧](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after)_**

- data-[数据属性](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Howto/Use_data_attributes)

```html
<p>
  这里我们有包含了一些<span tabindex="0" data-descr="鼠标悬停时出现的小弹出窗口"
    >工具提示</span
  >的<span tabindex="0" data-descr="文字和标点符号的集合">文字</span>。
</p>
```

```css
span[data-descr] {
  position: relative;
  text-decoration: underline;
  color: #00f;
  cursor: help;
}

span[data-descr]:hover::after,
span[data-descr]:focus::after {
  content: attr(data-descr);
  position: absolute;
  left: 0;
  top: 24px;
  min-width: 200px;
  border: 1px #aaaaaa solid;
  border-radius: 10px;
  background-color: #ffffcc;
  padding: 12px;
  color: #000000;
  font-size: 14px;
  z-index: 1;
}
```

![演示结果](https://adicon-cro-test.oss-cn-hangzhou.aliyuncs.com/154416e5228b4a918f4873dc0068efaf.png)

### 0520

```css
// 消除input元素 type="number" 时默认的 加减按钮
/deep/ .ivu-input::-webkit-outer-spin-button,
/deep/ .ivu-input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
```

### 0708

`GitHub 优化搜索快捷方式`
[参考网址](https://www.cnblogs.com/mq0036/p/18047518)
1、awesome 加强搜索

- awesome 往往整合了大量的同一领域的资料，收集学习、工具、书籍类相关的项目，方便大家更好的学习。

### 0709 前端导出 PDF\Word\Excel

1. [使用 docxtemplater 导出 word 文档](https://segmentfault.com/a/1190000041301193)

2. [docxtemplater 官网](https://docxtemplater.com/)
   [docxtemplater API](https://docxtemplater.com/docs/api/)
   [docxtemplater 示例](https://stackblitz.com/edit/vuejs-docxtemplater-example-wc8qpa?file=button.component.js)

3. [webodf 官网](https://webodf.org/)
   [webodf GitHub](https://github.com/webodf/WebODF)

### 0711

1. [后端处理文件插件 aspose](https://metrics.aspose.com/)

### 0723

1. [JAVA 开源项目目录结构](https://segmentfault.com/a/1190000022110134)

### 0724

1. [jave spring-reading ](https://github.com/xuchengsheng/spring-reading)
2. [hellogithub](https://hellogithub.com/periodical/volume/99)

### 0726

1. [Word 文档转换成 HTML 文档 参考范例](https://segmentfault.com/a/1190000023212724)
   mammoth 插件地址:https://github.com/mwilliamson/mammoth.js

这也是前端实现在线编辑、预览 word 文件的一种思路
但是相比 docxtemplater 插件来说 mammoth 插件的限制还是挺多的，不好用，不推荐

1、word 文件转换为 html 的格式是否和源文件保持一致? mommoth 组件有一些标签和 word 文档是不适配的，可以自定义一些，但是不推荐，局限太多了
1.1 当前 Mammoth 支持以下主要特性
·Headings
·Lists，Table
·Images
·Bold, italics, underlines, strikethrough, superscript and subscript
·Links，Line breaks
·Footnotes and endnotes
1.2 可以通过提供适当的样式映射将 WarningHeading 转换为 h1.warning

2、在拿到 html 内容之后再预览，需要在第三方预览组件中展示内容，需要再转换一边，不能保证文件内容样式的准确性
展示 html 的容器-markdown、v-html

```javascript
// 简单步骤实现word转Html
// 1、首先通过FileReader实例获取word文件模板内容
export function readFileInputEventAsArrayBuffer(event, callback) {
  const file = event.target.files[0];

  const reader = new FileReader();

  reader.onload = function (loadEvent: Event) {
    const arrayBuffer = loadEvent.target["result"];
    callback(arrayBuffer);
  };

  reader.readAsArrayBuffer(file);
}
// 2、调用mammoth.convertToHtml 方法获取html数据项
mammoth.convertToHtml({ arrayBuffer });
```

```javascript
// 针对mammoth插件可优化项-图片
/* 
    1、在mammoth插件中图片是以base64格式嵌入文档内的
*/
let options = {
  convertImage: mammoth.images.imgElement(function (image) {
    return image.read("base64").then(function (imageBuffer) {
      return {
        src: "data:" + image.contentType + ";base64," + imageBuffer,
      };
    });
  }),
};
/* 
  2、针对多图或大图的情况，一种比较好的方案是把图片提交到文件资源服务器上
*/
const mammothOptions = {
  convertImage: mammoth.images.imgElement(function (image) {
    return image.read("base64").then(async (imageBuffer) => {
      const result = await uploadBase64Image(imageBuffer, image.contentType);
      return {
        src: result.data.path, // 获取图片线上的URL地址
      };
    });
  }),
};
/* 
  3、上传图片文件示例
*/
async function uploadBase64Image(base64Image, mime) {
  const formData = new FormData();
  formData.append("file", base64ToBlob(base64Image, mime));

  return await axios({
    method: "post",
    url: "http://localhost:3000/uploadfile", // 本地图片上传的API地址
    data: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  });
}
```

2. [turndown Html 文件转化为 markdown 文档](https://github.com/domchristie/turndown)
   可以结合 mammoth 组件先生成 html 文件之后在转换 markdown 文档

3. 前端也能够自己生成 word 文档(纯代码生产那种)，参考插件：docx 或 html-docx-js

```javascript
// 参看文档 https://github.com/domchristie/turndown
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
  </head>
  <body>
    <h1>阿宝哥 - 动态生成 Word 文档示例</h1>
    <button type="button" onclick="generate()">
      点击生成 Docx 文档
    </button>
    <script src="https://unpkg.com/docx@5.0.2/build/index.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js"></script>
    <script>
      async function generate() {
        const doc = new docx.Document();

        const imageBuffer = await fetch(
          "https://avatars3.githubusercontent.com/u/4220799"
        ).then((response) => response.arrayBuffer());

        const image = docx.Media.addImage(doc, imageBuffer, 230, 230);

        doc.addSection({
          properties: {},
          children: [
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: "全栈修仙之路，",
                  bold: true,
                }),
                new docx.TextRun({
                  text:
                    "聚焦全栈，专注分享 TypeScript、Web API、Node.js、Deno 等全栈干货。",
                }),
              ],
            }),
            new docx.Paragraph(image),
          ],
        });

        docx.Packer.toBlob(doc).then((blob) => {
          console.log(blob);
          saveAs(blob, "abao.docx");
          console.log("文档生成成功");
        });
      }
    </script>
  </body>
</html>
```

### 0812

#### React [普通组件](https://react.docschina.org/reference/react-dom/components/common#common-props)

- 所有的内置浏览器组件(特殊的 React 属性适用于所有内置组件)，例如 div，都支持一些常见的属性和事件(参考-不全)
  类似 React 把 html 元素有重新封装一遍，增加了一些自己定义的特定属性，方便用户使用，然后所有的 UI 组件库都是支持这些内置组件的

1. 通用组件（例如 div）
2. ref 回调函数
3. React 事件对象
4. AnimationsEvent 处理函数
5. ClipboardEvent 处理函数
6. CompositionEvent 处理函数
7. DragEvent 事件处理函数
8. FocusEvent 处理函数
9. Event 处理函数
10. InputEvent 处理函数
11. KeyboardEvent 处理函数
12. MouseEvent 处理函数
13. PointerEvent 处理函数
14. TouchEvent 处理函数
15. TransitionEvent 处理函数
16. UIEvent 处理函数
17. WheelEvent 处理函数
    ...

- 注意
  你不能同时传递 children 和 dangerouslySetInnerHTML。
  有些事件，如 onAbort 和 onLoad，在浏览器中不冒泡，但是在 React 中仍然会冒泡。

### 0814

#### React 内置节点 portal 传送组件

- 使用 [creatPortal](https://react.docschina.org/reference/react-dom/createPortal)
  方法创建的可以在页面上任意 Dom 节点中渲染内容 createPortal 允许你将 JSX 作为 children 渲染至 DOM 的不同部分。

1. creatPortal-基础使用

```javascript
import { createPortal } from "react-dom";

<div>
  <p>这个子节点被放置在父节点 div 中。</p>
  {createPortal(<p>这个子节点被放置在 document body 中。</p>, document.body)}
</div>;
```

2. creatPortal-模态框使用

```javascript
// createPortal(children, domNode, key?)
import { useState } from "react";
import { createPortal } from "react-dom";
export default function App() {
  const PortalExample = () => {
    const [showModal, setShowModal] = false;
    return (
      <>
        <button onClick={() => setShowModal(true)}>
          使用 portal 展示模态（motal）
        </button>
        {showModal &&
          createPortal(
            <div className="modal">
              <div>这是一个模态对话框</div>
              <button onClick={setShowModal(false)}>关闭</button>
            </div>,
            document.body
          )}
      </>
    );
  };
  return (
    <>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

3. creatPortal-地图弹框(将 React 组件渲染在非 ReactDom 组件中)

- 用法 createPortal(children, domNode, key?)
  children：React 可以渲染的任何内容，如 JSX 片段（<div /> 或 <SomeComponent /> 等等）、Fragment（<>...</>）、字符串或数字，以及这些内容构成的数组。

  domNode：某个已经存在的 DOM 节点，例如由 document.getElementById() 返回的节点。在更新过程中传递不同的 DOM 节点将导致 portal 内容被重建。

  可选参数 key：用作 portal key 的独特字符串或数字。

```javascript
// App.js
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createMapWidget, addPopupToMapWidget } from "./map-widget.js";

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null &&
        createPortal(<p>来自 React 的你，你好！</p>, popupContainer)}
    </div>
  );
}
```

```javascript
// map-widget.js
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement("div");
  L.popup().setLatLng([0, 0]).setContent(popupDiv).openOn(map);
  return popupDiv;
}
```

#### React 插槽使用 slot

- 演示项目 mobile_Chat-To-main

> 父组件 AppWrapper

```javascript
import Cookies from "universal-cookie";
const cookies = new Cookies();
export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat }) => {
  const signUserOut = async () => {
    cookies.remove("auth-token");
    setIsAuth(false);
    setIsInChat(false);
  };
  return (
    <div className="App">
      <div className="app-header">
        <h1>演示React-slot</h1>
      </div>
      <div className="app-container">{children}</div>
    </div>
  );
};
```

> 子组件

```javascript
import React, { useState } from "react";
import { Chat } from "./components/Chat";
import { Auth } from "./components/Auth";
import { AppWrapper } from "./components/AppWrapper";
import { CallRoom } from "./components/CallRoom"; // Import CallRoom as default
import Cookies from "universal-cookie";
import "./App.css";
const cookies = new Cookies();
function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [isInChat, setIsInChat] = useState(true);
  const [room, setRoom] = useState("");
  const [isInCall, setIsInCall] = useState(false); // Track if in a call
  const [callRoomId, setCallRoomId] = useState(""); // Store call room ID
  const startCall = (roomId) => {
    setCallRoomId(roomId);
    setIsInCall(true);
  };
  const endCall = () => {
    setIsInCall(false);
    setCallRoomId("");
  };
  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth} setIsInChat={setIsInChat}>
      {isInCall ? (
        <CallRoom roomId={callRoomId} onEndCall={endCall} />
      ) : !isInChat ? (
        <div className="room">
          <label>Type Room ID:</label>
          <input onChange={(e) => setRoom(e.target.value)} value={room} />
          <button
            onClick={() => {
              setIsInChat(true);
            }}
          >
            Enter Chat
          </button>
          <button
            onClick={() => startCall(room)} // Start call with the room ID
          >
            Start Video Call
          </button>
        </div>
      ) : (
        <Chat room={room} />
      )}
    </AppWrapper>
  );
}
export default ChatApp;
```

### 0914

#### Vue3.x 项目

1. 模块化、组件化开发（软件开发思想）体现的非常好
   不理解为什么要单独用 render 函数重写很多 UI 组件？
2. [现代软件开发：架构模式、编程范式、设计模式及云原生方法论](https://cloud.tencent.com/developer/article/2368574)
3. [软件设计思想](https://developer.aliyun.com/article/868673)
4. Vue3.x vnode

   > 4.1 封装通用 dialog 确认弹框
   > 4.1.2 知识点[渲染插槽](https://cn.vuejs.org/guide/extras/render-function#rendering-slots)
   > 4.1.3 知识点[JSX / TSX](https://cn.vuejs.org/guide/extras/render-function#jsx-tsx)
   > 4.1.4 知识点[声明渲染函数](https://cn.vuejs.org/guide/extras/render-function#declaring-render-function)

```javascript
/* 
    传递插槽
    slots：在vue3.x中使用JSX语法传递子元素给组件 (比如 slots) 
    我们需要传递一个插槽函数或者是一个包含插槽函数的对象而非是数组
    插槽函数的返回值同一个正常的渲染函数的返回值一样——并且在子组件中被访问时总是会被转化为一个 vnodes 数组。
*/
const vnode = h("div", { id: "foo" }, []);
vnode.type; // 'div'
vnode.props; // { id: 'foo' }
vnode.children; // []
vnode.key; // null
export function confirmComponentService(options = {}) {
  const {
    title = "",
    width = "50%",
    propsValue = {},
    component = {
      render() {
        return h("div", "组件");
      },
    },
    dialogClass = "no-padding-top-dialog",
    dialogProps = {},
    showFooter = true,
    showCancelButton = true,
    showConfirmButton = true,
    cancelButtonText = "取消",
    confirmButtonText = "确认",
    footer,
    onCancel = () => ({}),
    onConfirm = () => ({}),
    onClose = () => ({}),
  } = options;
  const container = document.createElement("div");
  const userOnClose = onClose;
  const lang = localStorage.getItem("lang") || "zh-CN";

  const slots = {
    default: () =>
      h(
        ElConfigProvider,
        {
          size: "small",
          zIndex: 2000,
          locale: lang === "zh-CN" ? zhCn : enUs,
        },
        {
          default: () =>
            h(component, {
              ...propsValue,
            }),
        }
      ),
    // 但是，这个footer渲染的slot怎么能是数组呢？不是只要插槽函数 || 包含插槽函数的对象吗？
    // 哦，插槽只能是插槽函数或者包含插槽函数的对象，但是Vnodes节点是可以传递数组渲染多个子节点的
    footer: () =>
      showFooter
        ? footer
          ? footer(handler)
          : h("div", { class: "flex justify-content-end" }, [
              showCancelButton
                ? h(
                    ElButton,
                    {
                      size: "small",
                      onClick: () => {
                        handler();
                        onCancel();
                      },
                    },
                    () => cancelButtonText || "取消"
                  )
                : null,
              showConfirmButton
                ? h(
                    ElButton,
                    {
                      type: "primary",
                      size: "small",
                      onClick: debounce(
                        () => {
                          new Promise((resolve, reject) => {
                            onConfirm(reject); // 控制弹窗是否关闭
                            resolve();
                          }).then(() => {
                            handler();
                          });
                        },
                        500,
                        { leading: true, trailing: false }
                      ),
                    },
                    () => confirmButtonText || "确定"
                  )
                : null,
            ])
        : null,
  };
  // 获取vnode
  const vnode = h(
    ElDialog,
    {
      title: title,
      modelValue: true,
      width: width || "80%",
      class: dialogClass,
      onClose: () => {
        userOnClose();
        // 释放元素，避免内存溢出
        // console.dir(container);
        render(null, container);
      },
      ...dialogProps,
    },
    slots
  );
  // 重置上下文环境为整个app，否则类似$t这种全局的方法调用会报错
  vnode.appContext = window.rcApp._context;
  // 将组件渲染到容器中
  render(vnode, container);
  // 将渲染的组件内容添加到body中
  document.body.appendChild(container.firstElementChild);
  const vm = vnode.component;

  function handler() {
    vm.exposed.close();
  }

  vm.close = handler;

  return vm;
}
```

> 4.2 确认弹框使用

```javascript
const vm = confirmComponentService({
  title: "图片预览",
  width: pxToRem(800),
  dialogProps: {
    top: "2vh",
  },
  component: () => <ImageView src={src} onRotate={(val) => rotate(val, row)} />,
  showCancelButton: false,
  showConfirmButton: false,
});
```

#### 思考

vue 项目中直接用 vue 文件 export 方式创建组件和使用 js 文件的 render 方式创建组件有什么不一样？

1. 使用 .vue 文件创建组件
   语法简洁：.vue 文件是 Vue 的单文件组件（SFC，Single File Component），支持模板、脚本和样式的分离。代码更直观易读，便于维护。
   开发效率高：.vue 文件允许你直接使用模板语法，开发体验更好，特别适合使用 Vue 的指令（如 v-if, v-for 等）。大部分 Vue 项目中更倾向于使用这种方式来创建组件。
   文件组织清晰：.vue 文件可以包含 template、script 和 style 三个部分，组件的结构清晰，易于维护和复用。
   热重载支持好：Vue CLI 提供的开发环境对 .vue 文件的热重载支持很好，开发过程中修改 .vue 文件的内容能立即看到效果。

2. 使用 .js 文件的 render 函数创建组件
   灵活性高：render 函数提供了更底层的渲染控制。你可以完全掌控 DOM 元素的渲染逻辑，适用于复杂场景或需要动态创建 DOM 结构的场景。
   没有模板的限制：render 函数允许你用纯 JavaScript 来描述 DOM 结构，虽然失去了模板的直观性，但可以利用 JavaScript 的所有特性（如变量、函数、条件逻辑等），让代码在复杂情况下更具灵活性。
   性能优化：有时使用 render 函数可以带来性能上的一些优势，因为它减少了对模板编译的依赖。

3. 主要区别总结开发体验：
   .vue 文件更适合大多数开发者，提供了直观的模板语法和分离的结构。
   render 函数虽然灵活，但书写复杂度较高，适合 需要自定义渲染逻辑的场景。
   性能：虽然两者性能差别不大，但在一些特定场景下，render 函数可以通过减少模板编译步骤获得略微的性能提升。
   代码可维护性：.vue 文件结构化更好，便于维护，尤其是在大型项目中。而 render 函数往往会带来更复杂的逻辑，不适合频繁使用。一般来说，Vue 项目中以 .vue 文件为主，render 函数适合在需要灵活控制 DOM 渲染或模板不适用的情况下使用。

### 0918

#### new Object [Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

```javascript
/* 
  1、map的基础使用方法
*/
const map1 = new Map();

map1.set("a", 1);
map1.set("b", 2);
map1.set("c", 3);

console.log(map1.get("a"));
// Expected output: 1

map1.set("a", 97);

console.log(map1.get("a"));
// Expected output: 97

console.log(map1.size);
// Expected output: 3

map1.delete("b");

console.log(map1.size);
// Expected output: 2

/* 
  2、遍历map
*/
const myMap = new Map();
myMap.set(0, "zero");
myMap.set(1, "one");
// 使用 for of 便利map值
for (const [key, value] of myMap) {
  console.log(`${key} = ${value}`);
}
// 0 = zero
// 1 = one

// 使用forEach遍历map值
myMap.forEach((value, key) => {
  console.log(`${key} = ${value}`);
});
// 0 = zero
// 1 = one

/* 
  3、map转换为数组
*/
const kvArray = [
  ["key1", "value1"],
  ["key2", "value2"],
];

// 使用常规的 Map 构造函数可以将一个二维的键值对数组转换成一个 Map 对象
const myMap = new Map(kvArray);

console.log(myMap.get("key1")); // "value1"

// 使用 Array.from 函数可以将一个 Map 对象转换成一个二维的键值对数组
console.log(Array.from(myMap)); // 输出和 kvArray 相同的数组
```

### 0920

#### axios 两种使用方法

1. 统一封装 axios 请求发送、拦截处理逻辑。每个使用到的页面单独引入封装好的 axios;

```javascript
/* 
  1、封装axios方法，在Utils->request文件路径中(Demo：CRO)
*/
import axios, { AxiosRequestConfig } from "axios";
const request = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 300 * 1000,
});
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {},
  (err) => {}
);

request.interceptors.response.use(
  (res: any) => {},
  (error) => {}
);

export default request;

/* 
  2、在单文件总是导入封装好的axios使用
*/
import request from "@/utils/request";
export const archivesAll = (params) => {
  return request({
    url: "/alones/archives/find/all",
    method: "get",
    params,
  });
};
```

2. 通过注册插件方式使用，每个使用到的页面直接导入 axios 使用;

```javascript
/*
  1、封装axios方法，在Plugin->axios->index.js文件路径中(Demo：远程病理)
*/
import axios, { AxiosRequestConfig } from "axios";
const request = axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 300 * 1000,
});
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {},
  (err) => {}
);

request.interceptors.response.use(
  (res: any) => {},
  (error) => {}
);

export default {
  install: (app) => {
    app.config.globalProperties.$http = axios;
  },
};

/*
  2、在Plugin->index.js中引入
*/
import axiosPlugin from './axios';

export default {
  install: (app) => {
    app.use(axiosPlugin);
  },
};

/*
  3、在入口文件main.js中注册使用
*/
import customPlugins from '@/plugins';
app.use(customPlugins);
```

#### axios 总结

> 1、通过插件注册机制对 axios 进行的修改是全局的
> 2、直接引入 axios 时，会自动使用之前配置过的拦截器和设置
> 3、当你在插件中通过 axios.interceptors.request.use()或 axios.interceptors.response.use()等方法添加拦截器时，修改的是全局 axios 实例。无论在哪里引入 axios，这些全局配置都会生效，因为 axios 的拦截器、默认配置等都作用于这个共享的实例。

### 0923

#### Vue3.x 组合式 API useTemplateRef

```javascript
// 定义
function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
// 使用
<script setup>
import { useTemplateRef, onMounted } from 'vue'

const inputRef = useTemplateRef('input')

onMounted(() => {
  inputRef.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

#### Vue3.x 透传 [Attributes](https://cn.vuejs.org/guide/components/attrs#attribute-inheritance)

1. 关闭透传 Attributes 功能

```javascript
/*
    1、宏定义defineOptions
    2、这个宏可以用来直接在 <script setup> 中声明组件选项，而不必使用单独的 <script> 块：
    defineOptions({
        inheritAttrs: false,
        customOptions: {
          /* ... */
        }
    })
*/
<script setup>
import {defineOptions} from 'vue';

defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
</script>
```

2. 如何使用

```javascript
<script setup>import {useAttrs} from 'vue' const attrs = useAttrs()</script>;
// 如果没有使用 <script setup>，attrs 会作为 setup() 上下文对象的一个属性暴露：
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs);
  },
};
```

3. 使用技巧 控制透传的元素使用范围

```javascript
/*
  想要所有像 class 和 v-on 监听器这样的透传 attribute 都应用在内部的 <button> 上而不是外层的 <div> 上。
  可以通过设定 inheritAttrs: false 和使用 v-bind="$attrs" 来实现,如下实例
*/
<template>
  <div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
</template>
<script setup>
import {defineOptions} from 'vue'
defineOptions({
  inheritAttrs:false
})
  </script>
```

4. Vue3.3 新增宏定义 defineModel

```javascript
// parent Component
<script setup>
  import childComponent from './childComponent.vue';
  let childrenName = ref('');
</script>
<templete>
  <childrenComponent v-model:name=childrenName />
</templete>

// children Component
<script setup>
  {/*  plan A */}
  let name = defineModel("name", {type: String, default: ''});
  {/* plan B */}
  {/* const name = defineModel<string>({ required: true }) */}
</script>
<templete>
  <input v-model="name"/>
</templete>
```

5. defineModel 修饰符和转换器

```javascript
/* 
  修饰符和转换器
  当存在修饰符时，我们可能需要在读取或将其同步回父组件时对其值进行转换。我们可以通过使用 get 和 set 转换器选项来实现这一点：
*/
const [modelValue, modelModifiers] = defineModel({
  // get() 省略了，因为这里不需要它
  set(value) {
    // 如果使用了 .trim 修饰符，则返回裁剪过后的值
    if (modelModifiers.trim) {
      return value.trim();
    }
    // 否则，原样返回
    return value;
  },
});
```

### 0925

#### 前端数据库[window.indexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)

### 0927

#### [mitt](https://www.npmjs.com/package/mitt)

#### Base64 convert File

> 源码来源 telepathology->telepathology_ui->adk->adk_back

```javascript
export function covertBase64UrlToFile(urlData) {
  const arr = urlData.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bytes = window.atob(urlData.split(",")[1]); // 对用base64编码过的字符串进行解码
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new File(
    [ab],
    `${new Date().getTime()}.${mime.split("/")?.last || "png"}`,
    {
      type: mime || "image/png",
      lastModified: new Date(),
    }
  );
}
```

### 1010

#### 查看 npm 镜像源地址(总是记不住，所以记下来)

[查看更改 npm 镜像源](https://www.cnblogs.com/xuhongfei/p/17769162.html)

```javascript
npm config get registry
```

### 1011

#### encodeURLComponent 转义字符串，简单加密

- (encodeURIComponent 参考地址)[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent]

#### Vue3.x 内置传送组件

- [<Teleport>](https://cn.vuejs.org/guide/built-ins/teleport.html#teleport) 是一个内置组件，
  它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。
  通常使用场景比较多的地方在模态框

```JavaScript
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

- 可选参数

1. to: <Teleport> 接收一个 to prop 来指定传送的目标。to 的值可以是一个 CSS 选择器字符串，也可以是一个 DOM 元素对象。这段代码的作用就是告诉 Vue“把以下模板片段传送到 body 标签下”。
2. disabled: 在某些情况下禁用 Teleport
3. defer: 延迟加载 Teleport

### 1016

#### Vue3.x 响应式核心理论补充

组合式 API
响应性状态管理

- 1、 ref() 函数、reactive()
  深层响应性：修改嵌套对象或数组的时候也能监听到，非原始值需要深层响应的时候使用 reactive()函数

非响应性状态管理

- 2、ShallowRef()、shallowReactive() [官方文档](https://cn.vuejs.org/api/reactivity-advanced#shallowref)
  ref()、reactive()的浅层作用形式

```javascript
/* 
  1、是说修改复杂结构、深层次引用数据对象类型的时候不会触发视图更新，但是修改整个数据对象的时候会触发更新视图
*/
const shallowArray = shallowRef([
  /* 巨大的列表，里面包含深层的对象 */
]);
// 这不会触发更新...
shallowArray.value.push(newObject);
// 这才会触发更新
shallowArray.value = [...shallowArray.value, newObject];
// 这不会触发更新...
shallowArray.value[0].foo = 1;
// 这才会触发更新
shallowArray.value = [
  {
    ...shallowArray.value[0],
    foo: 1,
  },
  ...shallowArray.value.slice(1),
];
```

> 2.1 shallowRef() 搭配 triggerRef() 一起使用
> 结合不可变数据结构使用[官网示例](https://cn.vuejs.org/guide/extras/reactivity-in-depth#immutable-data)
> 推荐结合 Immer 插件一起使用

**问题：结合不可变数据结构使用是什么意思啊，看不懂，是说要在不改变原始数据的情况下修改视图吗？**

```javascript
const shallow = shallowRef({
  greet: "Hello, world",
});

// 触发该副作用第一次应该会打印 "Hello, world"
watchEffect(() => {
  console.log(shallow.value.greet);
});

// 这次变更不应触发副作用，因为这个 ref 是浅层的
shallow.value.greet = "Hello, universe";

// 打印 "Hello, universe"
triggerRef(shallow);
```

- 3、customRef() 自定义 ref()

> 3.1 curstomRef()-类型定义

```javascript
function customRef<T>(factory: CustomRefFactory<T>): Ref<T>

type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
```

> 3.2 curstomRef()-应用实例,节流函数

```javascript
import { customRef } from "vue";

export function useDebouncedRef(value, delay = 200) {
  let timeout;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
```

> 3.3 useDebouncedRef()-在组件中使用

```javascript
<script setup>
import { useDebouncedRef } from './debouncedRef'
const text = useDebouncedRef('hello')
</script>

<template>
  <input v-model="text" />
</template>
```

- 4、 watchEffect() **立即运行一个函数，同时响应式地追踪其依赖**，并在依赖更改时重新执行
  [官方文档](https://cn.vuejs.org/api/reactivity-core.html#watcheffect)

> 4.1 watchEffect() 类型定义

```javascript
/*
  第一个参数就是要运行的副作用函数。这个副作用函数的参数也是一个函数，用来注册清理回调。
  清理回调会在该副作用下一次执行前被调用，可以用来清理无效的副作用，例如等待中的异步请求 (参见下面的示例)。

  第二个参数是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖
*/
function watchEffect(
  effect: (onCleanup: OnCleanup) => void,
  options?: WatchEffectOptions
): WatchHandle

type OnCleanup = (cleanupFn: () => void) => void

interface WatchEffectOptions {
  /*
    'pre'(组件渲染之前) defaultProps;
    'post'(组件渲染之后)[别名:watchPostEffect];
    'sync'(响应式依赖发生改变时)[别名:watchSyncEffect];
  */
  flush?: 'pre' | 'post' | 'sync'
  /*
    onTrack、onTrigger调试侦听器的依赖，仅会在开发模式下工作。
  */
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

interface WatchHandle {
  (): void // 可调用，与 `stop` 相同
  pause: () => void // 暂停
  resume: () => void // 恢复
  stop: () => void // 停止
}
```

> 4.2 watchEffect() 示例

```javascript
import { onWatcherCleanup } from "vue";
/* 
  onCleanup 函数在Vue@3.5 版本之后直接注入vue实例作为组合式函数使用了
*/
watchEffect(
  {
    flush: "post",
    onTrack(e) {
      debugger;
    },
    onTrigger(e) {
      debugger;
    },
  },
  async (onCleanup) => {
    const { response, cancel } = doAsyncWork(newId);
    // watchEffect 副作用清理
    // 如果 `id` 变化，则调用 `cancel`，
    // 如果之前的请求未完成，则取消该请求
    onCleanup(cancel); // vue@3.5之前
    // onWatcherCleanup(cancel); // vue@3.5之后
    data.value = await response;
  }
);
```

- 5、watch() 侦听一个或多个响应式数据源，并**在数据源变化时调用所给的回调函数**。
  [官方文档](https://cn.vuejs.org/api/reactivity-core.html#watch)

> 5.1 watch 类型定义

```javascript
// 侦听单个来源
function watch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  options?: WatchOptions
): WatchHandle

// 侦听多个来源
function watch<T>(
  sources: WatchSource<T>[],
  callback: WatchCallback<T[]>,
  options?: WatchOptions
): WatchHandle

type WatchCallback<T> = (
  value: T,
  oldValue: T,
  onCleanup: (cleanupFn: () => void) => void
) => void

type WatchSource<T> =
  | Ref<T> // ref
  | (() => T) // getter
  | T extends object
  ? T
  : never // 响应式对象

interface WatchOptions extends WatchEffectOptions {
  immediate?: boolean // 默认：false
  deep?: boolean | number // 默认：false
  flush?: 'pre' | 'post' | 'sync' // 默认：'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  once?: boolean // 默认：false (3.4+)
}

interface WatchHandle {
  (): void // 可调用，与 `stop` 相同
  pause: () => void
  resume: () => void
  stop: () => void
}
```

> 5.2 watch 示例

```javascript
import { onWatcherCleanup } from "vue";
// 侦听多个监听源
watch(
  [fooRef, barRef],
  ([foo, bar], [prevFoo, prevBar]) => {
    let cancel = null;
    if (foo == bar) {
      cancel = () => {
        /* Do Somthing */
      };
    }
    onWatcherCleanup(cancel);
  },
  {
    deep: true,
    immediate: true,
    flush: "pre",
    onTrack(e) {
      debugger;
    },
    onTrigger(e) {
      debugger;
    },
  }
);
```

**与 watchEffect() 相比**watch() 使我们可以:

1、懒执行副作用；
2、更加明确是应该由哪个状态触发侦听器重新执行；
3、可以访问所侦听状态的前一个值和当前值。
