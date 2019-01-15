<template>
  <div>
    <el-container v-cloak>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <ExamDetail></ExamDetail>
        <el-main>
          <el-breadcrumb separator="/" style="margin-left: 15px;line-height: 60px">
            <el-breadcrumb-item>考试数据包管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{Title}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class='exam-content'>
            <el-tabs v-model="activeName" type="card">
              <el-tab-pane label="公共数据" name="first">
                <template>
                  <el-table :data="commonDataList">
                    <el-table-column fixed prop="DataName" label="数据名称" align="left">
                    </el-table-column>
                    <el-table-column prop="DataSize" label="数据大小" align="left">
                      <template slot-scope="scope">
                        {{ scope.row.DataSize }}
                      </template>
                    </el-table-column>
                    <el-table-column label="最新生成时间" align="left">
                      <template slot-scope="scope">
                        {{ scope.row.LastCreateDataTime}}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" align="left">
                      <template slot-scope="scope">
                        <template>
                          <el-button type="text" @click.native.prevent="generateCommonData(scope.row.DataType)">生成
                          </el-button>
                          <el-button type="text"
                                     @click.native.prevent="handleExportCommonDataBtnClick(scope.row.DataType)">导出
                          </el-button>
                          <el-button @click.native.prevent="enableCommonData()" type="text">启用</el-button>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
              <el-tab-pane label="考点数据" name="second">
                <div class="search-container">
                  <el-form :inline="true" :model="schoolDataSearchParam" class="demo-form-inline" size="small">
                    <el-form-item label="地市/县区">
                      <el-select @change="handleCityChange" v-model="schoolDataSearchParam.CityId" placeholder="请选择地市"
                                 style="width:110px;">
                        <el-option v-for="item in cityList" :key="item.CityId" :label="item.CityName"
                                   :value="item.CityId">
                        </el-option>
                      </el-select>
                      <el-select :disabled="zoneList.length===0" v-model="schoolDataSearchParam.ZoneId"
                                 placeholder="请选择县区"
                                 style="width:110px;">
                        <el-option v-for="item in zoneList" :key="item.ZoneId" :label="item.ZoneName"
                                   :value="item.ZoneId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input v-model="schoolDataSearchParam.SchoolCode" placeholder="请输入考点代码"
                                style="width:130px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-input v-model="schoolDataSearchParam.SchoolName" placeholder="请输入考点名称"
                                style="width:130px;"></el-input>
                    </el-form-item>
                    <el-form-item style="float:right;">
                      <el-button type="primary" @click="handleSearchBtnClick()">查询</el-button>
                      <el-button type="primary" @click="handleGenerateAllBtnClick()">生成考点数据</el-button>
                      <el-button type="primary" @click="handleExportAllSchoolDataBtnClick">导出考点数据</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <div class="list-statistics">
                  考点数据生成情况：<span style="color:#fd3131">{{CreatedSchoolTotal}}</span> / {{SchoolTotal}}
                </div>
                <template>
                  <el-table :data="schoolDataList">
                    <el-table-column prop="OrderIndex" label="序号" align="center" width="50"></el-table-column>
                    <el-table-column prop="CityName" label="地市" align="left" width="100"></el-table-column>
                    <el-table-column prop="ZoneName" label="县区" align="left" width="100"></el-table-column>
                    <el-table-column prop="SchoolCode" show-overflow-tooltip label="考点代码"
                                     align="left"></el-table-column>
                    <el-table-column prop="SchoolName" show-overflow-tooltip label="考点名称"
                                     align="left"></el-table-column>
                    <el-table-column label="最新生成时间" align="left" width="150">
                      <template slot-scope="scope">{{scope.row.LastCreateTime}}</template>
                    </el-table-column>
                    <el-table-column label="操作" align="left" width="200">
                      <template slot-scope="scope">
                        <el-button @click.native.prevent="handleRowGenerateBtnClick(scope.row.SchoolId)"
                                   type="text">生成
                        </el-button>
                        <el-button @click.native.prevent="handleExportSchoolDataBtnClick(scope.row.SchoolId)"
                                   type="text">导出
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
                <template>
                  <div class="page-container">
                    <el-pagination @size-change="handleSizeChange" :background="true"
                                   @current-change="handleCurrentChange"
                                   :current-page="schoolData.currentPage" :page-sizes="[10, 20, 50, 100]"
                                   :page-size="schoolData.pageSize"
                                   layout="slot,->,prev,pager,next,sizes,jumper" :total="schoolData.total">
                      <span class="el-pagination__total">显示{{(schoolData.currentPage-1)*schoolData.pageSize+1}}-{{schoolData.currentPage*schoolData.pageSize>schoolData.total?schoolData.total:schoolData.currentPage*schoolData.pageSize}}，
                        共{{schoolData.total}}记录
                      </span>
                    </el-pagination>
                  </div>
                </template>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-main>
      </el-container>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
    <div>
    </div>
  </div>
</template>
<script>
  import * as service from '../mock/examPackageManageServices'
  import * as commonService from '../mock/commonServices'
  import {MessageBox} from 'element-ui';
  import DownloadFile from "../components/DownloadFile";
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  import ExamDetail from './ExamDetail.vue'
  let returnEnum = {
    success: 1,
    error: 2
  };
  export default {
    name: 'FormalData',
    data() {
      return {
        isCollapse: true,
        openeds: [1, 2, 3, '4'],
        uniqueOpened: false,
        Title: "正式数据",
        activeName: "first",
        commonDataList: [],
        schoolDataList: [],
        schoolData: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        schoolDataSearchParam: {
          CityId: "",
          ZoneId: "",
          SchoolCode: "",
          SchoolName: ""
        },
        schoolDataSearchedParam: {
          CityId: "",
          ZoneId: "",
          SchoolCode: "",
          SchoolName: ""
        },
        cityList: [],
        zoneList: [],
        SchoolTotal: "0",
        CreatedSchoolTotal: "0",
      }
    },
    watch: {},
    computed: {},
    created() {
    },
    components: {Header, Footer, ExamDetail},
    mounted() {
      this.toggle();
      this.getCommonDataList();
      this.handleSearchBtnClick();
      this.getCityList();
      if (window.localStorage.ExamSceneId === 1) {
        this.pageTitle = "正式数据";
      } else if (window.localStorage.ExamSceneId === 2) {
        this.pageTitle = "模拟数据";
      }
    },
    activated() {
    },
    methods: {
      /**
       * 展开隐藏抽屉组件
       */
      toggle() {
        this.isCollapse = !this.isCollapse
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      /**
       * 公共列表分页下拉框
       */
      handleSizeChange(val) {
        this.schoolData.pageSize = val;
        this.handleSearchBtnClick();
      },
      /**
       * 公共列表分页点击
       */
      handleCurrentChange(val) {
        this.schoolData.currentPage = val;
        this.getSchoolDataList();
      },
      /**
       * 公共数据生成
       */
      generateCommonData(dataType) {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        service.GenerateCommonData({
          payload: {
            "DataType": dataType
          }
        }).then((data) => {
          this.$layer.close(loading);
          if (data.ReturnEntity === 1) {
            this.getCommonDataList();
          }
        })
      },
      getCommonDataList() {
        service.GetCommonDataList({
          payload: {}
        }).then((data) => {
          this.commonDataList = data.ReturnEntity
        })
      },
      /**
       * 启用数据
       */
      enableCommonData() {
        MessageBox.confirm('确定要启用备用数据吗？ 启用后将替换掉原公共数据', '备用数据启用确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let loading = this.$layer.msg('加载中...', {
            icon: 16,
            shade: 0.3,
            time: 0
          });
          service.EnableCommonData({
            payload: {}
          }).then((data) => {
            this.$layer.close(loading);
            if (data.ReturnEntity === returnEnum.success) {
              this.$layer.msg('启用成功', {icon: 1, time: 3});
              this.getCommonDataList();
            } else {
              this.$layer.msg('启用失败', {icon: 2, time: 3});
            }
          })
        }).catch(() => {
        });
      },
      /**
       * 导出公共数据
       */
      handleExportCommonDataBtnClick(dataType) {
        service.ExportCommonData({
          payload: {"DataType": dataType}
        }).then(DownloadFile);
      },
      /**
       * 获取城市列表
       */
      getCityList() {
        commonService.GetCityList({
          payload: {}
        }).then((data) => {
          this.cityList = data.ReturnEntity;
          this.cityList.unshift({
            CityId: "0",
            CityName: "请选择地市"
          })
        })
      },
      /**
       * 获取县区列表
       */
      getZoneList(cityId) {
        commonService.GetZoneList({
          payload: {"CityId": cityId}
        }).then((data) => {
          if (data.ReturnEntity.length > 0) {
            this.zoneList = data.ReturnEntity;
            this.zoneList.unshift({
              ZoneId: "0",
              ZoneName: "请选择县区"
            })
          }
        })
      },
      /**
       * 地市下拉框
       */
      handleCityChange() {
        this.getZoneList(this.schoolDataSearchParam.CityId);
        this.zoneList = [];
        this.schoolDataSearchParam.ZoneId = "";
      },
      /**
       * 查询
       */
      handleSearchBtnClick() {
        this.schoolDataSearchedParam.CityId = this.schoolDataSearchParam.CityId;
        this.schoolDataSearchedParam.ZoneId = this.schoolDataSearchParam.ZoneId;
        this.schoolDataSearchedParam.SchoolCode = this.schoolDataSearchParam.SchoolCode;
        this.schoolDataSearchedParam.SchoolName = this.schoolDataSearchParam.SchoolName;
        this.schoolData.currentPage = 1;
        this.getSchoolDataList();
      },
      /**
       * 获取考点列表
       */
      getSchoolDataList() {
        let param = {
          "CityId": this.schoolDataSearchedParam.CityId,
          "ZoneId": this.schoolDataSearchedParam.ZoneId,
          "SchoolCode": this.schoolDataSearchedParam.SchoolCode,
          "SchoolName": this.schoolDataSearchedParam.SchoolName,
          "PageIndex": this.schoolData.currentPage,
          "PageSize": this.schoolData.pageSize
        };
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        service.GetSchoolDataList({
          payload: param
        }).then((data) => {
          this.$layer.close(loading);
          this.schoolDataList = data.ReturnEntity.SchoolInfo;
          this.CreatedSchoolTotal = data.ReturnEntity.CreatedSchoolTotal;
          this.SchoolTotal = data.ReturnEntity.SchoolTotal;
          this.schoolData.total = Number(data.ReturnEntity.RecordTotal);
        })
      },
      /**
       * 生成全部按钮点击
       */
      handleGenerateAllBtnClick() {
        MessageBox.confirm('确定要生成全部考点数据吗?', '考点数据批量生成提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let loading = this.$layer.msg('加载中...', {
            icon: 16,
            shade: 0.3,
            time: 0
          });
          service.GenerateSchoolData({
            payload: {"SchoolId": ""}
          }).then((data) => {
            this.$layer.close(loading);
            if (data.ReturnEntity === returnEnum.success) {
              this.getSchoolDataList()
            }
          });
        }).catch(() => {
        });
      },
      /**
       * 生成全部按钮点击
       */
      handleRowGenerateBtnClick(schoolId) {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        service.GenerateSchoolData({
          payload: {"SchoolId": schoolId}
        }).then((data) => {
          this.$layer.close(loading);
          if (data.ReturnEntity === returnEnum.success) {
            this.getSchoolDataList();
          }
        });
      },
      /**
       * 批量导出考点数据
       */
      handleExportAllSchoolDataBtnClick() {
        MessageBox.confirm('确定要导出全部考点数据吗？', '考点数据批量导出提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          service.ExportSchoolData({
            payload: {
              "SchoolId": ''
            }
          }).then(DownloadFile);
        }).catch(() => {
        });
      },
      /**
       * 导出考点数据
       */
      handleExportSchoolDataBtnClick(schoolId) {
        service.ExportSchoolData({
          payload: {
            "SchoolId": schoolId
          }
        }).then(DownloadFile);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../scss/global.scss';

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
    min-height: 879px;
    min-width: 60px;
    display: inline-block;
  }

  .toggle {
    width: 180px;
    font-size: 20px;
    text-align: center;
    color: $color-4d;
  }

  .el-menu--collapse {
    min-height: 870px;
    min-width: 60px;
  }

  .el-menu {
    display: inline-block;
    float: left;
  }

  .el-menu .el-submenu__title {
    padding: 0 !important;
    color: $color-1a;
  }

  .isCollapse {
    text-align: center;
    padding-left: 0 !important;
    border-bottom: 1px solid #e6e6e6;
  }

  .el-main {
    padding: 0;
  }

  .el-header {
    height: 50px !important;
  }

  .el-footer {
    height: 40px !important;
  }

  .el-submenu [class^=el-icon-] {
    margin-right: 0;
  }

  .el-menu-item {
    color: $color-4d;
    padding-left: 25px;
    line-height: 56px;
    border-top: 1px solid #e6e6e6;
  }

  .el-submenu li, .announcement {
    height: 56px;
    padding: 0;
    border-bottom: 1px solid #e6e6e6;
    line-height: 56px;
  }

  .el-submenu li {
    min-width: 180px;
    font-size: 12px;
  }

  /*菜单关闭*/
  .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
    -webkit-transform: rotateZ(-90deg);
    -ms-transform: rotate(-90deg);
    transform: rotateZ(-90deg);
  }

  /*菜单展开*/
  .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
    -webkit-transform: rotateZ(0deg);
    -ms-transform: rotate(0deg);
    transform: rotateZ(0deg);
  }
</style>
<style>
  .search-container {
    height: 60px;
    padding: 12px 0 0 10px;
  }

  .el-breadcrumb__inner,
  .el-breadcrumb__separator {
    color: #4d4d4d !important;
    font-size: 16px !important;
  }

  .el-breadcrumb__item[aria-current="page"] .el-breadcrumb__inner {
    color: #1a1a1a !important;
  }

  .el-tabs__header {
    margin-bottom: 0 !important;
  }

  .exam-content {
    margin: 0 10px;
  }

  .exam-content .el-tabs__content {
    border-left: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }

  .search-container .el-form-item--mini.el-form-item,
  .search-container .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }

  .page-container {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .list-statistics {
    font-size: 14px;
    color: #1a1a1a;
    line-height: 40px;
    padding-left: 12px;
    padding-right: 12px;
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }

  [v-cloak] {
    display: none;
  }

  .muted {
    color: #a7a7a7
  }

  .el-table td {
    padding: 0;
  }

  .el-table thead {
    background: #edeff0 !important;
  }

  .el-tabs__item.is-active {
    background: white;
  }

  .el-tabs__item {
    background: #edeff0;
  }
</style>
