export default isTel = (rule,value,callback) => {
    const RegExp=/^1[3456789]\d{9}$/;
    if(RegExp.test(value)){
      callback();
    }else{
      throw new Error('手机号验证错误');
    }
};