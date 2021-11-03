<template>
  <div class='dimension'>
    <el-table
      class="customer-table"
      :cell-style='cellStyle'
      :header-cell-style='cellStyle'
      :data="tableData">
      <el-table-column label="操作" width="100">
        <template slot="header">
          <div>
            <p class="rightp">单位区划</p>
            <p class="centerp"></p>
            <p class='leftp'>平均耗时</p>
          </div>
        </template>
        <template slot-scope="scope">
          <span>{{ scope.row.timeconsuming }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="采购单位"
        width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="主管单位"
        width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>姓名: {{ scope.row.name }}</p>
            <p>住址: {{ scope.row.address }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="全区"
        width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="全市"
        width="150">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
       tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          timeconsuming: '计划备案',
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          timeconsuming: '合同备案',
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          timeconsuming: '支付时效',
        }]
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      return 'border-bottom: transparent !important;'
    }
  },
  created() {

  },
  mounted() {

  },
}
</script>

<style lang='scss' scoped>
.dimension{
  width: 800px;
  height: 600px;
  .rightp{
    text-align: right;
  }
  .leftp{
    text-align: left;
    position: relative;
  }
  .centerp::before{
    content: ''; // 伪类元素必须有content属性
    position:absolute;
    top:15px;
    left: -0px;
    width:0px;
    height:0px;
    border-top: 55px solid transparent;
    border-left: 100px solid #ddd;
    border-bottom: 0px solid transparent;
  }
  .centerp::after{
    content: ''; // 伪类元素必须有content属性
    position:absolute;
    top:16px;
    left: -0px;
    width:0px;
    height:0px;
    border-top: 55px solid transparent;
    border-left: 100px solid #fff;
    border-bottom: 0px solid transparent;
  }
  .el-table::before{
    width: 0px;
  }
}
.customer-table ::v-deep .el-table__row{
      background: wheat;
    }
</style>