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

<script>
  // 删除申请单脏数据
  abolishFun() {
    const vm = this;
    let idList: Array<string> = [],
      tipsMsg: string = "";
    let { rowId, statusflag } = this.sendData;
    let chooseReqidList: Array<any> = (
      vm.$refs.leftTabRef as any
    ).getCheckboxRecords();
    if (chooseReqidList && chooseReqidList.length) {
      idList = chooseReqidList.map((reqItem, reqIndex) => {
        tipsMsg += `${reqItem.reqid}${
          reqIndex == chooseReqidList.length - 1 ? "" : "、"
        }`;
        return reqItem.reqid;
      });
    } else {
      tipsMsg = `${this.sendData.rowId}`;
      idList = [this.sendData.rowId];
    }
    if (rowId) {
      if (statusflag < 3) {
        this.$Modal.confirm({
          title: "提示",
          content: `是否删除申请单${tipsMsg}?`,
          okText: "确认",
          cancelText: "取消",
          onOk: async () => {
            this.abolishLoading = true;
            let sendParams = {
              idList,
              userName: this.userName,
              labcode: this.sendData.chooseExcqcompid,
            };
            CancelStatusListForOrgApply(sendParams)
              .then((res) => {
                if (res.code) {
                  this.$Message.success("废除申请单操作成功");
                  this.searchFun();
                }
              })
              .catch((err) => {})
              .finally(() => {
                this.abolishLoading = false;
              });
          },
        });
      } else {
        this.$Message.error("当前申请单已导入，不能删除");
      }
    } else {
      this.$Message.error("请选择申请单");
    }
  }
</script>