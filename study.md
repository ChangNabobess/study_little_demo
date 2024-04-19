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

主要 API：selectionStart、selectionStart、setSelectionRange
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
