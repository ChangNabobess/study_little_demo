<template>
  <div class=''>
    <template>
      <el-row>
        <el-col :span="6">
            <p>这里是主界面</p>
        </el-col>
        <el-col :span="12">
            <el-table
                :data="tableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border
                default-expand-all
                :tree-props="{children: 'childList', hasChildren: 'hasChildren'}">
                <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
                <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
            </el-table>
            <ul class="test-ul">
                <li v-for="(i,index) in 10" :key="index" :class="'test-' + i">跳转{{i}}界面</li>
            </ul>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="changPage">跳转测试界面</el-button>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tempIndex: [],
      // el-table设置树形结构展开时一级一级向下展开，不会产生粘连收缩，必须保持每一级可收缩父级对象的id不相同
      tableData: [
        {
            id: 1,
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
        }, {
            id: 2,
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
        }, {
            id: 3,
            date: '市辖区',
            name: '',
            address: '',
            childList: [{
                id: 31,
                date: '市辖区',
                name: '广州市农业农村局',
                address: '',
                childList:[{
                    id: 311,
                    date: '市辖区',
                    name: '广州市农业农村局副局',
                    address: '上海市普陀区金沙江路 151911 弄',
                    childList:[]
                },{
                    id: 312,
                    date: '市辖区',
                    name: '广州市农业局',
                    address: '上海市普陀区金沙江路 151912 弄',
                    childList:[]
                }]
                }, {
                id: 32,
                date: '市辖区',
                name: '广州市公安局',
                address: '',
                childList:[]
            }]
        }, {
            id: 4,
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      timerId: ''
    };
  },
  computed: {},
  watch: {
      
  },
  methods: {
    changPage() {
      this.$router.push({query:{page:'newPage'}})
    },
    // 从 tempIndex 获取当前 row 需要合并的行数
    handleSameMerge({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
            return {
                rowspan: this.tempIndex[rowIndex],
                colspan: 1
            };
        }
    },
    setMergecolum() {
        let arr = [];
            let tempMergeIndex = [];
            let pos;
            this.tableData.forEach((item, i) => {
                if (item.source && item.source.length) {
                    let sourceArr = item.source.map(_ => {
                        return {
                            ..._,
                            flag: i + '',
                            class_label: item.class_label
                        };
                    });
                    arr.push(...sourceArr);
                } else {
                    arr.push(item);
                }
            });
            this.tableData = arr;
            console.log(arr);
            // 处理arr，生成一个与行数相同的数组记录每一行设置的合并数
            for (let i = 0; i < arr.length; i++) {
                if (i === 0) {
                    tempMergeIndex.push(1);
                    pos = 0;
                } else {
                    if (arr[i].flag && (arr[i].flag === arr[i - 1].flag)) {
                        tempMergeIndex[pos] += 1;
                        tempMergeIndex.push(0);
                    } else {
                        tempMergeIndex.push(1);
                        pos = i;
                    }
                }
            }
            this.tempIndex = tempMergeIndex;
    },
    justifyPos() {
        if(this.timerId) clearTimeout(this.timerId)
        this.timerId = setTimeout(() => {
            this.$route.meta.y = window.pageYOffset
            console.log(window.pageYOffset);
        },300)
    },
    getURLParameters(url){ // 获取urlparams信息
       return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
            (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a),{}
        )
    },
    test() {
        const smallArray = [0, 2];
        const largeArray = Array.from({ length: 1000 }, (_, i) => i);
        console.log(largeArray);
    }
    },
  created() {
      this.test()
  },
  mounted() {
      this.setMergecolum()
      console.log(this.tempIndex);
      window.onscroll = this.justifyPos()
      console.log(111)
      console.log(this.getURLParameters('google.com'))
      console.log(this.getURLParameters('http://url.com/page?name=Adam&surname=Smith'))
      console.log('______________________________________________________________');
  },
}
</script>

<style lang='scss' scoped>
.test-ul{
    li{
        width: 100%;
        min-height: 200px;
        list-style: none;
        text-align: center;
        padding: 20px 0px;
        font-size: 25px;
    }
    .test-1{
        background-color: #FFB6C1;
    }
    .test-2{
        background-color: #DB7093;
    }
    .test-3{
        background-color:#FF69B4;
    }
    .test-4{
        background-color: #C71585;
    }
    .test-5{
        background-color: #EE82EE;
    }
    .test-6{
        background-color: #FF00FF;
    }
    .test-7{
        background-color: #BA55D3;
    }
    .test-8{
        background-color: #8A2BE2;
    }
    .test-9{
        background-color: #00BFFF;
    }
    .test-10{
        background-color: #00FFFF;
    }
}
</style>