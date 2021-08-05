<template>
  <div class="main-wrap main-index"  id="touchstartdiv">
    <el-row>
      <el-col :span="6">
        <el-row>
          <div class="map-section">
            <Mapdetails
              :mapList='mapList'
              :itemData='itemData'
              ref="Mapdetails"
              @changeSort='changeSort'
            ></Mapdetails>
          </div>
        </el-row>
      </el-col>
      <el-col :span="14">
        <el-row>
          <div class="map-section">
            <el-row>
              <p @click="changePage(index)" class="title-p" v-for="(item,index) in moneyList" :key="index" :class="(index % 2 == 0) ? 'mapleft' : 'mapright'">
                <span v-if="index == 0">采购预算</span>
                <span v-else>交易规模</span>
                <span class="title-num">{{item.num}}</span>
                <span>笔</span>
              </p>
            </el-row>
            <el-row>
              <div class="map-section-map">
                <mapContainer
                  :mapList="mapList"
                  @mapArea="mapArea"
                  @itemData='getitemData'
                  @closeShowBox='closeShowBox'
                  :fliterInfo="false"
                  :showBox='showBox'
                  ref="mapContainer"
                ></mapContainer>
              </div>
            </el-row>
            <el-row>
              <el-col :span="24">
                  <el-row type="flex" justify="space-between" :gutter="10">
                    <el-col :span="6" v-for="(item, index) in userList" :key="index">
                      <el-card class="box-card user-type">
                        <el-col :span="24">
                          <div class="box-card-bottom">
                            <p>{{ userListType[item.userType] }}</p>
                            <p style="line-height:1.5;">
                              <span class="box-card-number">
                              {{ item.value }}
                              </span>
                              <span class="tail">
                                <span  v-if="item.userType == 3">位</span>
                                <span v-else>家</span>
                              </span>
                            </p>
                          </div>
                        </el-col>
                      </el-card>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </el-col>
      <el-col :span="4">
        <div class="map-section">
          <div class="itemAndMall">
              <itemAndMallstatistics blockTitle='项目采购' :itemAndMallObj='itemAndMallObj'></itemAndMallstatistics>
              <itemAndMallstatistics blockTitle='电子卖场' :itemAndMallObj='itemAndMallObj'></itemAndMallstatistics>
          </div>
          <div @click="goItemModel" class="change-page"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import mapContainer from '@/views/map/index-map2'
import Mapdetails from '@/views/map/mapdetails'
import { mapState } from 'vuex'
import companyInfo from './companyInfo'
import areaBuss from './areaBuss'
import { unitName, userListType } from '@/views/main/const'
import { bussPurchaseType } from '@/views/index1/const'
import { getRegionRank } from '@/api/overall-analysis'
import { getUserList, getItemAndMallProjectInfo } from '@/api/main'
import { regionType, differentTypeTitle } from '@/const/constant'
import { verifyResIsSuccess, number_set, sy_number_format } from '@/util/util'
import DigitRoll from '@huoyu/vue-digitroll'
import itemAndMallstatistics from '@/views/component/itemAndMallstatistics'
import Screenfull from '@/components/Screenfull'

export default {
  name: 'mainIndex',
  components: {
    mapContainer,
    Mapdetails,
    companyInfo,
    areaBuss,
    DigitRoll,
    itemAndMallstatistics,
    Screenfull
  },
  props: {
    year: [String, Number],
    moneyList: Array
  },
  watch: {
    year(newVal, oldVal) {
      if (oldVal != '') {
        this.getBussFun()
      }
    },
    transFrom(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getMapDataRequest()
      }
    },
    'moneyList': {
      deep: true
    }
  },
  data() {
    return {
      unitName,
      number_set,
      userListType,
      sy_number_format,
      bussPurchaseType,
      showBoole: true,
      userList: [],
      mapData: {},
      mpInit: false, // 点击时
      mapList: [],
      regionguid: '',
      localArea: '',
      title: '政府采购大数据',
      interval: '',
      interval2: '',
      regionType,
      showBox: false,
      itemData: [], // 地图高亮时展示数据
      computeNumber: [],
      showPoint: true,
      transFrom: true,
      itemAndMallObj: {},
      startX: 0, // 滑动屏幕起始位置
      endX: 0,  // 滑动屏幕结束位置
      movePageNum: 0
    }
  },
  mounted() {
    this.getMapDataRequest()
    this.getBussFun()
    window.addEventListener('resize', this.resize)
    this.movePage()
  },
  destroyed() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    funfilter(value) {
      return sy_number_format(number_set(value), 0, '.', ',', 'floor')
    },
    getBussFun() {
      getUserList().then(res => {
        if (verifyResIsSuccess(res)) {
          this.userList = res.data.data
        }
      })
    },
    mapArea(val) {
      this.regionguid = val + ''
      this.localArea = val
    },
    getitemData(data) {
      this.showBox = true
      this.itemData = data
    },
    closeShowBox(type) {
      setTimeout(() => {
        this.showBox = type
      }, 5500)
    },
    // 获取地图数据
    getMapDataRequest() {
      const params = {
        sort: ''
      }
      if (this.transFrom) {
        params.sort = 'projectMoney'
      } else {
        params.sort = 'projectNum'
      }
      getRegionRank(params).then(res => {
        if (!this.mpInit) {
          if (res.data.data && res.data.data.childList) {
            const result = res.data.data.childList
            if (res.data.data.regionGuid) {
              result.unshift({
                regionGuid: res.data.data.regionGuid,
                regionName: res.data.data.regionName,
                projectNum: res.data.data.projectNum,
                projectMoney: res.data.data.projectMoney,
                buyplanMoney: res.data.data.buyplanMoney,
                buyplanNum: res.data.data.buyplanNum
              })
            }
            this.mapList = result
          }
        }
      })
    },
    resize() {
      if (this.$refs.mapContainer.myChart) {
        this.$refs.mapContainer.myChart.resize()
      }
    },
    changeNowPage() {
      this.$router.push({
        query: {
          page: 'governmentTender',
          type: '广东省政府采购实时交易情况',
          // 广东政府采购实时交易情况
          year: this.year
        }
      })
    },
    filterMoney(val, type) {
      const arr1 = val.split('.')
      if (arr1 && arr1.length > 0) {
        this.showPoint = true
        if (type == 1) {
          return arr1[0]
        } else if (type == 2) {
          return arr1[1]
        }
      } else {
        this.showPoint = false
      }
    },
    goItemModel() {
      this.$router.push({ query: { page: 'first' }})
    },
    changeSort(type) {
      this.transFrom = type
    },
    getItemAndMallProjectInfo() {
      getItemAndMallProjectInfo().then(res => {
        if (verifyResIsSuccess(res)) {
          this.itemAndMallObj = res.data.data
        }
      })
    },
    changePage(index) {
      if (index == 1) {
        this.$router.push({ query: {
          page: 'governmentTender',
          type: differentTypeTitle.mallAndItem,
          year: this.year
        }})
      }
    },
    movePage() {
      const moveElm = document.getElementById('touchstartdiv')
      moveElm.addEventListener('touchstart', (event) => {
        event.preventDefault()
        if (event.targetTouches.length == 1) {
          this.startX = event.targetTouches[0].clientX
        }
      })
      moveElm.addEventListener('touchend', (event) => {
        if (event.changedTouches && event.changedTouches.length > 0) {
          this.endX = event.changedTouches[0].clientX
          if (Number(this.startX) - Number(this.endX) < 0) {
            this.movePageNum++
            if (this.movePageNum > 4) {
              this.movePageNum = 0
            }
            console.log(this.movePageNum)
          } else if (Number(this.startX) - Number(this.endX) > 0) {
            this.movePageNum--
            if (this.movePageNum < 0) {
              this.movePageNum = 4
            }
            console.log(this.movePageNum)
          } else {
            if (event.target.classList.contains('title-num')) {
              this.changePage(1)
            } else if (event.target.classList.contains('itemBlock')) {
              this.$router.push({ query: {
                page: 'governmentTender',
                type: differentTypeTitle.itemBlockTitle
              }})
            } else if (event.target.classList.contains('mallBlock')) {
              this.$router.push({ query: {
                page: 'governmentTender',
                type: differentTypeTitle.mallBlockTitle
              }})
            } else if (event.target.classList.contains('change-page')) {
              this.goItemModel()
            }
          }
        }
        event.stopPropagation()
      })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    this.getItemAndMallProjectInfo()
  }
}
</script>

<style scoped lang="scss">
@font-face
{
  font-family: myFirstFont;
  src: url('../../assets/family/Digital-7Mono.ttf') /* IE9+,可以是具体的实际链接 */
}
@font-face
{
  font-family: huawenHuPo;
  src: url('../../assets/family/STHUPO.ttf') /* IE9+,可以是具体的实际链接 */
}
.main-index {
  padding: 25px 70px 0px 70px;
  .boxCon {
    margin-top: 30px;
    width: 100%;
    height: calc((100vh - 290px)/2);
  }
  .map-section {
    width: 100%;
    height: calc(100vh - 300px);
    position: relative;
    z-index: 9999;
    .map-section-map{
      z-index: 9999;
      height: calc(100vh - 385px);
      width: 100%;
    }
    .title-p{
      z-index: 9999;
      span {
        color: white;
        font-size: 12px;
      }
      .title-num{
        color: $mainTextColor;
        font-size: 35px;
        font-family: myFirstFont;
      }
    }
    .mapleft{
        position: absolute;
        left: 50px;
        top: 0px;
      }
    .mapright{
      cursor: pointer;
      position: absolute;
      right: 15%;
      top: 0px;
    }
    .itemAndMall{
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      height: 90%;
    }
  }
  .change-page{
    position: absolute;
    bottom: -20px;
    right: 70px;
    font-size: 20px;
    width: 55px;
    height: 28px;
    cursor: pointer;
    background-image: url("../../assets/img/changepage.png");
    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
    background-size: 55px 28px;
  }
  .itemAndMall{
    min-height: calc(100vh - 850px);
  }
  .box-card {
    line-height: 1;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    .box-card-bottom {
      p {
        text-align: left;
        color: $mainTextColor;
      }
      min-height: 70px;
      display: flex !important;
      flex-direction: column;
      justify-content: left;
      width: 100%;
      .box-card-number{
        font-size: 45px;
        font-weight: bold;
        letter-spacing: 0px;
      }
    }
    .box-card-bottom p:nth-child(1) {
      font-size: 16px;
      letter-spacing: 1px;
      font-weight: 800;
      // font-family: huawenHuPo;
    }
    .box-card-bottom p:nth-child(2) {
      .tail {
        font-size: 20px;
      }
      font-size: 45px;
      font-weight: bold;
      font-family: myFirstFont;
    }
  }
  .el-card {
     border: none;
     color: white;
     background-color: rgba(0,0,0,0);
  }
}
</style>

