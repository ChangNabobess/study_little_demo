<template>
  <div class=''>
    <template>
      <el-row style="margin-top:20px;">
        <el-col :span="12">
          <el-form :model="biddingForm" :rules="rules" ref="biddingForm" label-width="150px">
            <el-form-item label="选项一" prop="inputVala" ref="inputVala">
              <el-input type="primary" v-model="biddingForm.inputVala"></el-input>
            </el-form-item>
            <el-form-item label="选项二" prop="inputValb" ref="inputValb">
              <el-input type="primary" v-model="biddingForm.inputValb"></el-input>
            </el-form-item>
            <el-form-item label="选项三" prop="inputValc" ref="inputValc">
              <el-input type="primary" v-model="biddingForm.inputValc"></el-input>
            </el-form-item>
            <el-form-item label="选项四" prop="inputVald" ref="inputVald">
              <el-input type="primary" v-model="biddingForm.inputVald"></el-input>
            </el-form-item>
            <el-form-item label="选项五" prop="inputVale" ref="inputVale">
              <el-input type="primary" v-model="biddingForm.inputVale"></el-input>
            </el-form-item>
            <el-form-item label="选项六" prop="inputValf" ref="inputValf">
              <el-input type="primary" v-model="biddingForm.inputValf"></el-input>
            </el-form-item>
            <el-form-item label="选项七" prop="inputValg" ref="inputValg">
              <el-input type="primary" v-model="biddingForm.inputValg"></el-input>
            </el-form-item>
            <el-form-item label="选项八" prop="inputValh" ref="inputValh">
              <el-input type="primary" v-model="biddingForm.inputValh"></el-input>
            </el-form-item>
            <el-form-item label="选项九" prop="inputVali" ref="inputVali">
              <el-input type="primary" v-model="biddingForm.inputVali"></el-input>
            </el-form-item>
            <el-form-item label="选项十" prop="inputValj" ref="inputValj">
              <el-input type="primary" v-model="biddingForm.inputValj"></el-input>
            </el-form-item>
            <el-form-item label="选项十一" prop="inputValk" ref="inputValk">
              <el-input type="primary" v-model="biddingForm.inputValk"></el-input>
            </el-form-item>
            <el-form-item label="选项十二" prop="inputVall" ref="inputVall">
              <el-input type="primary" v-model="biddingForm.inputVall"></el-input>
            </el-form-item>
            <el-form-item label="选项十三" prop="inputValm" ref="inputValm">
              <el-input type="primary" v-model="biddingForm.inputValm"></el-input>
            </el-form-item>
            <el-form-item label="选项十四" prop="inputValn" ref="inputValn">
              <el-input type="primary" v-model="biddingForm.inputValn"></el-input>
            </el-form-item>
            <el-form-item label="选项十五" prop="inputValo" ref="inputValo">
              <el-input type="primary" v-model="biddingForm.inputValo"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="saveForm">测试提交</el-button>
        </el-col>
        <el-col :span="12">
          <TextElTag />
          <!-- 下拉树 -->
          <template>
            <el-select ref="selectBulr" v-model="mineStatus" placeholder="请选择城市名称">
              <el-option :value="mineStatusValue" style="height:auto;width:100%;padding: 0px !important;">
                  <el-tree :data="protocolList"
                            node-key="id" 
                            ref="tree" 
                            :props="defaultProps" 
                            @node-click="handleNodeClick" />
              </el-option>
            </el-select>
          </template>
          <div v-for="(item, index) in stepArr" :key="index">
            <StepDemo :nowClass='item.nowClass'>
              <template v-slot:stepLeft>
                <div>
                  {{item.name}}
                </div>
              </template>
              <template v-slot:stepRight>
                <div v-for="(innerItem, innerIndex) in item.rightList" :key="innerIndex" class="slotRightcontent">
                    <div>{{innerItem.innerName}}</div>
                    <div>{{innerItem.innerContent}}</div>
                </div>
              </template>
            </StepDemo>
          </div>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import TextElTag from '@/components/TextElTag'
import StepDemo from '@/components/StepDemo'
export default {
  data() {
    return {
      arr:[
        {code: 'A1', index: 1, groupNo: '1'},
        {code: 'A2', index: 2, groupNo: '1'},
        {code: 'A3', index: 3, groupNo: '1'},
        {code: 'B1', index: 4, groupNo: '2'},
        {code: 'B2', index: 5, groupNo: '2'},
        {code: 'C1', index: 5, groupNo: '3'},
        {code: 'D1', index: 5, groupNo: '4'},
        {code: 'C2', index: 5, groupNo: '3'},
      ],
      arr2:[
         {
          title: '系统管理',
          parentName: '',
          parentId: 0,
          id: 1,
      },
      {
          title: '菜单管理',
          parentName: '系统管理',
          parentId: 1,
          id: 11,
      },
      {
          title: '菜单新增',
          parentName: '菜单管理',
          parentId: 11,
          id: 111,
      },
      {
          title: '菜单编辑',
          parentName: '菜单管理',
          parentId: 11,
          id: 112,
      },
      {
          title: '菜单删除',
          parentName: '菜单管理',
          parentId: 11,
          id: 113,
      },
      {
          title: '角色管理',
          parentName: '系统管理',
          parentId: 1,
          id: 22,
      },
      {
          title: '角色新增',
          parentName: '角色管理',
          parentId: 22,
          id: 221,
      },
      {
          title: '角色编辑',
          parentName: '角色管理',
          parentId: 22,
          id: 222,
      },
      {
          title: '角色删除',
          parentName: '角色管理',
          parentId: 22,
          id: 223,
      },
      {
          title: '用户管理',
          parentName: '系统管理',
          parentId: 1,
          id: 33,
      },
      {
          title: '用户新增',
          parentName: '用户管理',
          parentId: 33,
          id: 331,
      },
      {
          title: '用户编辑',
          parentName: '用户管理',
          parentId: 33,
          id: 332,
      },
      {
          title: '用户删除',
          parentName: '用户管理',
          parentId: 33,
          id: 333,
      }
        ],
      mineStatus:'',
      mineStatusValue:[],
      protocolList: [],
      defaultProps:{
          children: 'supplieragreementlist',
          label: 'label',
      },
      biddingForm:{
        inputVala:'',
        inputValb:'',
        inputValc:'',
        inputVald:'',
        inputVale:'',
        inputValf:'',
        inputValg:'',
        inputValh:'',
        inputVali:'',
        inputValj:'',
        inputValk:'',
        inputVall:'',
        inputValm:'',
        inputValn:'',
        inputValo:'',
      },
      rules:{
        inputVala:[{ required: true, message: '请输入选项一名称', trigger: 'blur' },],
        inputValb:[{ required: true, message: '请输入选项二名称', trigger: 'blur' },],
        inputValc:[{ required: true, message: '请输入选项三名称', trigger: 'blur' },],
        inputVald:[{ required: true, message: '请输入选项四名称', trigger: 'blur' },],
        inputVale:[{ required: true, message: '请输入选项五名称', trigger: 'blur' },],
        inputValf:[{ required: true, message: '请输入选项六名称', trigger: 'blur' },],
        inputValg:[{ required: true, message: '请输入选项七名称', trigger: 'blur' },],
        inputValh:[{ required: true, message: '请输入选项八名称', trigger: 'blur' },],
        inputVali:[{ required: true, message: '请输入选项九名称', trigger: 'blur' },],
        inputValj:[{ required: true, message: '请输入选项十名称', trigger: 'blur' },],
        inputValk:[{ required: true, message: '请输入选项十一名称', trigger: 'blur' },],
        inputVall:[{ required: true, message: '请输入选项十二名称', trigger: 'blur' },],
        inputValm:[{ required: true, message: '请输入选项十三名称', trigger: 'blur' },],
        inputValn:[{ required: true, message: '请输入选项十四名称', trigger: 'blur' },],
        inputValo:[{ required: true, message: '请输入选项十五名称', trigger: 'blur' },],
      },
      stepArr:[
        {
          name: '项目采购',
          nowClass: 'unActiveClass',
          rightList:[
            {
              innerName: '右边项目名称1',
              innerContent: '花开又见花落 时间太匆忙 春去春来昔年同 往事已成空 一缕轻风吹四季 花落时不慢 花开时也不早 此时触景最相思 孤寂者的灵魂 伤感落寞 我一次次彷徨 浮生多少梦魂事 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            },
            {
              innerName: '右边项目名称2',
              innerContent: '花开又见花落 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            },
            {
              innerName: '右边项目名称2',
              innerContent: '花开又见花落 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            },
            {
              innerName: '右边项目名称2',
              innerContent: '花开又见花落 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            },
            {
              innerName: '右边项目名称2',
              innerContent: '花开又见花落 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            },
            {
              innerName: '右边项目名称2',
              innerContent: '花开又见花落 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            },
            {
              innerName: '右边项目名称2',
              innerContent: '花开又见花落 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            }
          ]
        },
        {
          name: '电子卖场',
          nowClass: 'activeClass',
          rightList:[
            {
              innerName: '右边项目名称1',
              innerContent: '花开又见花落 时间太匆忙 春去春来昔年同 往事已成空 一缕轻风吹四季 花落时不慢 花开时也不早 此时触景最相思 孤寂者的灵魂 伤感落寞 我一次次彷徨 浮生多少梦魂事 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            },
            {
              innerName: '右边项目名称2',
              innerContent: '花开又见花落 时间太匆忙 此时触景最相思 孤寂者的灵魂 伤感落寞 我一次次彷徨 浮生多少梦魂事 花开又见花落 几度夕阳几度逢 红尘深处 遗落一世的情缘...'
            }
          ]
        }
      ],
      computedNumArr:[1,2,3,4,5,6,7,8,9]
    };
  },
  computed: {},
  watch: {},
  methods: {
    jsonToTree(lists, id, parentId) {
        var idList = {},
            treeList = [];
        for (var i = 0, len = lists.length; i < len; i++) {
            //生成一个以id为键的对象
            idList[lists[i][id]] = lists[i]
        }
        for (var j = 0, len1 = lists.length; j < len1; j++) {
            var aVal = lists[j];
            var aValParent = idList[aVal[parentId]];
            //如果aValParent存在；就说明当前的aVal是aValParent的孩子
            if (aValParent) {
                if ('chindren' in aValParent) {
                    aValParent['children'].push(aVal)
                } else {
                    aValParent['children'] = [];
                    aValParent['children'].push(aVal)
                }
            } else {
                treeList.push(aVal)
            }
        }
        return treeList
    },
     _changeArr2(){
    // 网上大神给的方法 小白一时没看懂
      let arr=this.arr;
      /* const b  = arr.reduce((r, x) => ((r[x.groupNo] || (r[x.groupNo] = []) ).push(x), r)
      , {});
      console.log(b); */
      //  自己转换
      const d = arr.reduce((prev, cur) => {
        if (!prev[cur.groupNo]) {
          prev[cur.groupNo] = [];
        }
        prev[cur.groupNo].push(cur);
        return prev;
      }, {});
      // console.log(d);
    },
    handleNodeClick(data) {//入围协议选中事件
    // console.log(data);
      if(data.code){
        this.mineStatusValue.push(data);
        this.mineStatus = data.label;
        this.$refs.selectBulr.blur();
      }else{};
    },
    getprotocolList(){//获取入围协议方法
      this.$axios.get('./json/test.json').then(res=>{
        if(res.data.code==200){
          let arr=[];
          res.data.data.forEach((item)=>{
            let itemArr=[];
            item.supplieragreementlist.forEach((item,val)=>{
              let itemObj=item;
              itemObj.label=item.name;
              itemArr.push(itemObj);
            });
            let itemObj={
              label:item.regionname,
              supplieragreementlist:itemArr
            };
            arr.push(itemObj);
          });
          this.protocolList=arr;
        }else{}
      });
    }, 
    saveForm() { // 提交表单
      const callback =  (valid, object) => {
        if (valid) {
          console.log(111);
        } else { // 校验自动滚动
          for (let i in object) {
            let dom = this.$refs[i];
            dom.$el.scrollIntoView({ //滚动到指定节点
              block: 'center', //值有start,center,end，nearest，当前显示在视图区域中间
              behavior: 'smooth' //值有auto、instant,smooth，缓动动画（当前是慢速的）
            })
            break
          }; 
        }
      }
      // 校验之后回调
      this.$refs.biddingForm.validate(callback)
    },
    compose(...args) {
      var len = args.length // args函数的个数
      var count = len - 1
      var result
      return function func(...args1) {
        // func函数的args1参数枚举
        result = args[count].call(null, args1) // 以n的运算结果为参数，执行n-1的方法
        // console.log(result); // jack---hello jack---HELLO JACK 
        if (count > 0) {
          count--
          return func.call(null, result) // result 改变this指向输出n的运算结果
        } else {
          //回复count初始状态
          count = len - 1
          return result
        }
      }
    },
    computedMaxNum(){
      let arr = this.computedNumArr
      let val = Math.max.apply(null,arr)
      // console.log('使用Math.apply计算数组最大值:', val);
      let reduceVal = arr.reduce((a,b) => {
        return a > b ? a : b
      })
      // console.log('使用reduce方式计算数组最大值', reduceVal)
      var greeting = (name) =>  {
        let num = name.length - 1
        return `Hello ${name[num]}`
      }
      var toUpper = (str) => {
        let num = str.length - 1
        return str[num].toUpperCase()
      }
      var fn = this.compose(toUpper, greeting)
      // console.log(fn('jack'))
    }
  },
  created() {},
  mounted() {
    this._changeArr2();
    this.getprotocolList();
    this.computedMaxNum();
  },
  components:{
    TextElTag,
    StepDemo
  }
}
</script>

<style lang='scss' scoped>
.el-select{
  margin-top: 50px;
}
.slotRightcontent{
  display: flex;
  flex-direction: row;
  div:nth-child(1){
    width: 30%;
  }
  div:nth-child(2){
    width: 70%;
  }
}
</style>