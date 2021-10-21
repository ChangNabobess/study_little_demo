export const tokenKey = 'access_token'; // 普通取值token 
export const stongTokenKey = 'token'; // 延期token
export const errorCode = { // 错误代码
  '478': '验证码错误,请重新输入',
  '479': '演示环境，没有权限操作',
  '401': '当前操作没有权限',
  '403': '当前操作没有权限',
  '400': '用户名不存在或密码错误',
  'default': '系统未知错误,请反馈给管理员'
}
export const errorCodeWhiteList = ['5560'] // 不统一提示错误的白名单
export const responseCode = {
  success: '200',
  errorCode: errorCode,
  // 不统一提示错误的：白名单
  errorCodeWhiteList: errorCodeWhiteList
}