### 03-29

#### 1、...解构赋值是深拷贝还是浅拷贝？

解构赋值，如果所解构的原对象是一维数组或对象，其本质就是对基本数据类型进行等号赋值，那它就是深拷贝；
如果是多维数组或对象，其本质就是对引用类型数据进项等号赋值，那它就是浅拷贝；

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

### 04-02

#### 1、input.setSelectionRange(start, end, selectionDirection)的使用;

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
   // 使用 context.emit('update:visible', false)，改变父组件visible的值
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

- 2、使用 v-model 传递参数并修改 在子组件中使用 defineModel 接受

> 如果在子组件中需要获取传递到父组件的值，需要在 nexTick 方法中获取

```javascript
<!-- Child.vue -->
<script setup>
const model = defineModel()
function update() {
  model.value++
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

1. 这个框架像是优化 webpack 配置项的另一种形式，也是基于 VUE 框架开发的，有很多自己的库
  1.1. [nuxt-中文](https://nuxt.com.cn/);
  1.2. [nuxt-UI](https:/]ui.nuxt.com/);
  1.3. [VueUse](https://www.vueusejs.com/);
2. nuxt-UI 中一些有意思的 API
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
