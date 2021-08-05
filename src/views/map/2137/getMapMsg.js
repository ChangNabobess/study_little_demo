import guangdong from './guangdong.json'
import guangzhou from './guangzhou.json'
import heyuan from './heyuan.json'
import huizhou from './huizhou.json'
import jiangmen from './jiangmen.json'
import jieyang from './jieyang.json'
import maoming from './maoming.json'
import meizhou from './meizhou.json'
import qingyuan from './qingyuan.json'
import shantou from './shantou.json'
import shanwei from './shanwei.json'
import shaoguan from './shaoguan.json'
import shenzhen from './shenzhen.json'
import yangjiang from './yangjiang.json'
import yunfu from './yunfu.json'
import zhanjiang from './zhanjiang.json'
import zhongshan from './zhongshan.json'
import zhuhai from './zhuhai.json'
import chaozhou from './chaozhou.json'
import dongguan from './dongguan.json'
import fuoshan from './fuoshan.json'
import fuqing from './fuqing.json'


const cityArea = [
  '潮州市', '东莞市',
  '佛山市', '广州市',
  '河源市', '惠州市',
  '江门市', '揭阳市',
  '茂名市', '梅州市',
  '清远市', '汕头市',
  '汕尾市', '韶关市',
  '深圳市', '阳江市',
  '云浮市', '湛江市',
  '肇庆市', '中山市',
  '珠海市'
]
let areaDate = [
  {name:'广东', ...guangdong},
  {name:'广州', ...guangzhou},
  {name:'河源', ...heyuan},
  {name:'惠州', ...huizhou},
  {name:'江门', ...jiangmen},
  {name:'揭阳', ...jieyang},
  {name:'茂名', ...maoming},
  {name:'梅州', ...meizhou},
  {name:'阳江', ...yangjiang},
  {name:'清远', ...qingyuan},
  {name:'汕头', ...shantou},
  {name:'汕尾', ...shanwei},
  {name:'韶关', ...shaoguan},
  {name:'深圳', ...shenzhen},
  {name:'云浮', ...yunfu},
  {name:'湛江', ...zhanjiang},
  {name:'中山', ...zhongshan},
  {name:'珠海', ...zhuhai},
  {name:'潮州', ...chaozhou},
  {name:'东莞', ...dongguan},
  {name:'佛山', ...fuoshan},
  {name:'肇庆', ...fuqing}
]
// console.log(areaDate)
export default {
  areaDate
}