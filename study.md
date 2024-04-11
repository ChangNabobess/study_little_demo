03-29

### 1、...解构赋值是深拷贝还是浅拷贝？

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

04-02

### 2、input.setSelectionRange(start, end, selectionDirection)的使用;

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
