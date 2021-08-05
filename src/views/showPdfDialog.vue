<template>
  <div class=''>
    <el-dialog
      title="预览pdf模板"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
      v-dialogDrag
      ref="dialog__wrapper">
      <div class="dialog__wrapper" v-dialogDragWidth="$refs.dialog__wrapper">
          <div class="tools">
            <el-button :theme="'default'" type="submit" :title="'基础按钮'" @click.stop="prePage" class="mr10"> 上一页</el-button>
            <el-button :theme="'default'" type="submit" :title="'基础按钮'" @click.stop="nextPage" class="mr10"> 下一页</el-button>
            <el-button :theme="'default'" type="submit" :title="'基础按钮'" @click.stop="clock" class="mr10"> 顺时针</el-button>
            <el-button :theme="'default'" type="submit" :title="'基础按钮'" @click.stop="counterClock" class="mr10"> 逆时针</el-button>
            <div class="page">{{pageNum}}/{{pageTotalNum}} </div>
          </div>
          <pdf ref="pdf" 
              :src="url" 
              :page="pageNum"
              :rotate="pageRotate"  
              @progress="loadedRatio = $event"
              @page-loaded="pageLoaded($event)" 
              @num-pages="pageTotalNum=$event" 
              @error="pdfError($event)" 
              @link-clicked="page = $event">
          </pdf>
    </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  props:{
    pdfshow:{
      default:false,
      type:Boolean
    }
  },
  data() {
    return {
      url: "http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf",
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0,
      dialogVisible:false
    };
  },
  computed: {},
  watch: {
    pdfshow:{
      deep:true,
      immediate:true,
      handler(newVal,oldVal){
        this.dialogVisible=newVal;
      }
    },
    dialogVisible(newVal,oldVal){
      if(newVal==false){
        this.$emit('pdfDialogClose',false);
      }
    }
  },
  methods: {
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.dialogVisible=false;
          })
          .catch(_ => {});
      },
     prePage() {// 上一页函数，
      var page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },   
    nextPage() {// 下一页函数
      var page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },
    clock() {// 页面顺时针翻转90度。
      this.pageRotate += 90
    },
    counterClock() {// 页面逆时针翻转90度。
      this.pageRotate -= 90
    },
    pageLoaded(e) {// 页面加载回调函数，其中e为当前页数
      this.curPageNum = e
    },
    pdfError(error) {// 其他的一些回调函数。
      console.error(error)
    },
    pdfPrintAll() {// 打印全部
      this.$refs.pdf.print()
        },
    pdfPrint() {// 打印指定部分
      this.$refs.pdf.print(100, [1, 2])
      },
  },
  created() {

  },
  mounted() {

  },
  components:{
    pdf,
  }
}
</script>

<style lang='scss' scoped>
</style>