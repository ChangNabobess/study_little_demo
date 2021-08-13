<template>
  <div class='todo-list'>
    <header>
      待办事项列表
      <input type="text"
            class="input-class"
            placeholder="添加ToDo">
    </header>
    <article> 
      <ul class="doing">
        <li>
          <span class="test">正在进行</span>
          <span class="testspan num1"></span>
        </li>
      </ul>
      <ul class="over">
        <li>
          <span class="test">已经完成</span>
          <span class="testspan num2"></span>
        </li>
      </ul>
    </article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputDom: null,
      doingUl: null,
      overUl: null,
      liDom: null
    };
  },
  computed: {},
  watch: {},
  methods: {
    initFun(){
      this.doingUl = document.getElementsByClassName('doing')
      this.overUl = document.getElementsByClassName('over')
      this.inputDom = document.getElementsByClassName('input-class')
      window.addEventListener('keyup',(e) => {
        if((e.keyCode == 13) && (this.inputDom[0].value.trim() !== '')) {
          this.addDom()
          this.inputDom[0].value = ''
        }
      })
    },
    addDom(){
      this.liDom = document.createElement('li')
      Object.assign(this.liDom.style,{
        "width" : '80%',
        "height": "32px",
        "line-height": "32px",
        "background": "#fff",
        "position": "relative",
        "margin": "10px 0px 10px 40px",
        "padding": "0 10px",
        "border-radius": "3px",
        "border-left": "5px solid #629A9C",
        "box-shadow": "0 1px 2px rgb(0, 0, 0 , 7%)",
        "text-align": "left",
      })
      this.doingUl[0].appendChild(this.liDom)
      let checkDom = document.createElement('input')
      Object.assign(checkDom.style,{
        "background-color":"#629A9C",
        "cursor": "pointer",
        "appearance": "auto",
        "box-sizing": "border-box",
        "margin": "3px 10px 3px 4px",
        "padding": "initial",
        "border": "initial",
      })
      checkDom.type = 'checkbox'
      checkDom.addEventListener('click',this.checkBoxClickHandler)
      this.liDom.appendChild(checkDom)
      let textNode = document.createTextNode(this.inputDom[0].value)
      this.liDom.append(textNode)
      let deleteDom = document.createElement('span')
      Object.assign(deleteDom.style,{
        "display":'inline-block',
        "position": "absolute",
        "top": "2px",
        "right": "5px",
        "display": "inline-block",
        "width": "14px",
        "height": "12px",
        "border-radius": "14px",
        "border": "6px double #FFF",
        "background": "#CCC",
        "line-height": "14px",
        "text-align": "center",
        "color": "#FFF",
        "font-weight": "bold",
        "font-size": "14px",
        "cursor": "pointer",
      })
      deleteDom.addEventListener('click',this.deleteClickHandler)
      this.liDom.appendChild(deleteDom)
      this.setcheckNum()
    },
    checkBoxClickHandler(e) {
      if(e.target.checked){
        Object.assign(e.target.parentElement.style,{
          "border-left": "5px solid #999",
          "opacity": "0.5"
        })
        this.overUl[0].appendChild(e.target.parentElement)
      } else {
        Object.assign(e.target.parentElement.style,{
          "border-left": "5px solid #629A9C",
          "opacity": ""
        })
        this.doingUl[0].appendChild(e.target.parentElement)
      }
      this.setcheckNum()
    },
    setcheckNum() {
      document.querySelector('.num1').textContent = this.doingUl[0].children.length - 1
      document.querySelector('.num2').textContent = this.overUl[0].children.length - 1
    },
    deleteClickHandler(e){
      e.target.parentElement.remove()
      this.setcheckNum()
    }
  },
  created() {

  },
  mounted() {
    this.initFun()
  },
}
</script>

<style lang='scss' scoped>
.todo-list{
  min-height: 5rem;
  width: 8rem;
  margin: auto;
  background-color: #ddd;
}
header{
  height: calc(100vh - 95vh);
  background-color: rgb(0, 0, 0);
  color: rgba($color: #ffffff, $alpha: 1.0);
  line-height: calc(100vh - 95vh);
  input[type="text"]{
    border-radius: .05rem;
    font-size: .15rem;
    margin-left: .5rem;
    outline: none;
    height: calc(100vh - 98vh);
    width: 40%;
  }
}
article{
  width: 70%;
  margin: auto;
  margin-top: .2rem;
  margin-bottom: .5rem;
  ul{
    padding: 0px;
    margin: .2rem 0px 0px 0px;
    list-style: none;
    li{
      span{
        display: inline-block;
      }
      text-align: lefts;
    } 
  }
  .test{
    font-weight: bolder;
    color: rgb(0, 0, 0);
  }
  .testspan{
    cursor: pointer;
    width: .2rem;
    height: .2rem;
    border: .01rem solid #ddd;
    border-radius: 50%;
    background-color: #E6E6FA;
    margin-left: 3.9rem;
  }
}
</style>