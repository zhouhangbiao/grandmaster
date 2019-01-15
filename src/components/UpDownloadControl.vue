<template>
  <div>
    <el-container v-cloak>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <ExamDetail></ExamDetail>
        <el-main>
          <el-row :gutter="20" style="text-align: center">
            <el-col :span="4">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="考试场次" name="1">
                  <div v-for="item in ExamSceneTimeId" @click="handleNodeClick(item)">{{item.ExamSceneTimeName}}</div>
                </el-collapse-item>
              </el-collapse>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple">
                <div class="grid-content bg-purple">
                  <div class="breadcrumbList">
                    <el-breadcrumb separator="/" style="margin-left: 15px;line-height: 60px">
                      <el-breadcrumb-item>考试监控</el-breadcrumb-item>
                      <el-breadcrumb-item>上传数据监控</el-breadcrumb-item>
                    </el-breadcrumb>
                  </div>
                </div>
                <div class="container" style="margin-top: 0">
                  <div class="search-container">
                    <table style="width:100%;">
                      <tr>
                        <td style="width:74px;vertical-align:top;line-height:32px;">地市/县区</td>
                        <td>
                          <el-form :inline="true" :model="searchParam" class="demo-form-inline" size="small">
                            <el-form-item>
                              <el-select @change="handleCityChange" v-model="searchParam.CityId" placeholder="请选择地市"
                                         style="width:120px;">
                                <el-option v-for="item in cityList" :key="item.CityId" :label="item.CityName"
                                           :value="item.CityId">
                                </el-option>
                              </el-select>
                              <el-select :disabled="zoneList.length===0" v-model="searchParam.ZoneId"
                                         placeholder="请选择县区"
                                         style="width:120px;">
                                <el-option v-for="item in zoneList" :key="item.ZoneId" :label="item.ZoneName"
                                           :value="item.ZoneId">
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item>
                              <el-input v-model="searchParam.SchoolName" placeholder="请输入考点名称"
                                        style="width:130px;"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-input v-model="searchParam.RoomNumber" placeholder="请输入机房编号"
                                        style="width:130px;"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <el-select v-model="searchParam.IsUpLoaded" placeholder="请选择状态" style="width:120px;">
                                <el-option v-for="item in uploadedStatusList" :key="item.value" :label="item.text"
                                           :value="item.value">
                                </el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item>
                              <el-date-picker v-model="searchParam.UpdateDateTimeStart" type="date" style="width:130px;"
                                              value-format="yyyy-MM-dd" placeholder="上传时间">
                              </el-date-picker>
                              -
                              <el-date-picker v-model="searchParam.UpdateDateTimeEnd" style="width:130px;" width="130"
                                              value-format="yyyy-MM-dd" placeholder="上传时间">
                              </el-date-picker>
                            </el-form-item>
                          </el-form>
                        </td>
                        <td style="width:60px;vertical-align:top;">
                          <el-button type="primary" size="small" @click="handleSearchBtnClick">查询</el-button>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="list-statistics">
                    考点数据上传统计：<span style="color:#fd3131">{{UploadedExamRoomTotal}}</span> / {{ExamRoomTotal}}
                  </div>
                  <el-table :data="list" height="400px">
                    <el-table-column prop="OrderIndex" label="序号" align="center" width="50"></el-table-column>
                    <el-table-column prop="CityName" label="地市" align="left" width="80"></el-table-column>
                    <el-table-column prop="ZoneName" label="县区" align="left" width="80"></el-table-column>
                    <el-table-column prop="SchoolCode" show-overflow-tooltip label="考点代码"
                                     align="left"></el-table-column>
                    <el-table-column prop="SchoolName" show-overflow-tooltip label="考点名称"
                                     align="left"></el-table-column>
                    <el-table-column prop="RoomNumber" show-overflow-tooltip label="机房编号"
                                     align="left"></el-table-column>
                    <el-table-column prop="DogCode" show-overflow-tooltip label="加密狗编号" align="left"></el-table-column>
                    <el-table-column prop="LastUploadTime" label="上传时间" align="left" width="130"></el-table-column>
                    <el-table-column label="状态" align="center" width="50">
                      <template slot-scope="scope" v-if="scope.row.IsUpLoaded">
                        <i class="el-icon-check" style="color:#409EFF;font-weight:bold;font-size:20px;"></i>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="page-container">
                    <el-pagination @size-change="handleSizeChange" :background="true"
                                   @current-change="handleCurrentChange"
                                   :current-page="pager.currentPage" :page-sizes="[10, 20, 50, 100]"
                                   :page-size="pager.pageSize"
                                   layout="slot,->,prev,pager,next,sizes,jumper" :total="pager.total">
                        <span class="el-pagination__total">显示{{(pager.currentPage-1)*pager.pageSize+1}}-{{pager.currentPage*pager.pageSize>pager.total?pager.total:pager.currentPage*pager.pageSize}}，
                          共{{pager.total}}记录
                        </span>
                    </el-pagination>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
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
  import * as commonServices from '../mock/commonServices'
  import * as authorizationCodeManageServices from '../mock/authorizationCodeManageServices'
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  import ExamDetail from './ExamDetail.vue'
  export default {
    name: 'UpDownloadControl',
    data() {
      return {
        ExamSceneTimeId:'',
        beginTimePickerOptions: {
          disabledDate(time) {
            return time.getTime() > (Date.parse(app.searchParam.UpdateDateTimeEnd) - 28800000)
          },
        },
        endTimePickerOptions: {
          disabledDate(time) {
            return time.getTime() < (Date.parse(app.searchParam.UpdateDateTimeStart) - 28800000)
          },
        },
        isCollapse: true,
        openeds: [1, 2, 3, '4'],
        uniqueOpened: false,
        cityList: [],
        zoneList: [],
        downloadStatusList: [
          {text: "请选择状态", value: "0"},
          {text: "未下载", value: "1"},
          {text: "已下载", value: "2"},
        ],
        uploadedStatusList: [
          {text: "请选择状态", value: "0"},
          {text: "未上传", value: "1"},
          {text: "已上传", value: "2"},
        ],
        tableHeight: 0,
        tableWidth: 0,
        list: [],
        pager: {
          total: 0,
          pageSize: 10,
          currentPage: 1
        },
        searchParam: {
          ExamSceneTimeId: "",
          CityId: "",
          ZoneId: "",
          SchoolName: "",
          RoomNumber: "",
          IsUpLoaded: "",
          UpdateDateTimeStart: "",
          UpdateDateTimeEnd: ""
        },
        searchedParam: {
          ExamSceneTimeId: "",
          CityId: "",
          ZoneId: "",
          SchoolName: "",
          RoomNumber: "",
          IsUpLoaded: "",
          UpdateDateTimeStart: "",
          UpdateDateTimeEnd: ""
        },
        UploadedExamRoomTotal: "",
        ExamRoomTotal: "",
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        ExamSceneTimeList: [],
        activeNames: ['1'],
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
    },
    computed: {},
    created() {
    },
    components: {Header, Footer, ExamDetail},
    mounted() {
      this.toggle();
      this.getCityList();
      this.getExamSceneTime();
      this.GetUploadDataList();
    },
    activated() {
    },
    methods: {
      /**
       * 折叠面板方法
       */
      handleChange(val) {
        console.log(val);
      },
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
       * 获取城市列表
       */
      getCityList() {
        commonServices.GetCityList({
          payload: {}
        }).then((data) => {
          this.cityList = data.ReturnEntity;
          this.cityList.unshift({
            CityId: "0",
            CityName: "请选择地市"
          });
        })
      },
      /**
       * 获取县区列表
       */
      getZoneList(cityId) {
        commonServices.GetZoneList({
          payload: {"CityId": cityId}
        }).then((data) => {
          if (data.ReturnEntity.length > 0) {
            data.ReturnEntity.unshift({
              ZoneId: "0",
              ZoneName: "请选择县区"
            });
            this.zoneList = data.ReturnEntity;
          }
        })
      },
      /**
       * 考试场次tree
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      /**
       * 考试场次tree
       */
      getExamSceneTime() {
        authorizationCodeManageServices.GetExamSceneTime({payload: {}}).then((data) => {
          this.ExamSceneTimeList = [{
            ExamSceneTimeName: "考试场次",
            isRoot: true,
            disabled: true,
            children: data.ReturnEntity
          }];
          this.ExamSceneTimeId=data.ReturnEntity;
          this.searchedParam.ExamSceneTimeId = this.searchParam.ExamSceneTimeId = data.ReturnEntity[0].ExamSceneTimeId;
        });
      },
      /**
       * 节点被点击时回调
       */
      handleNodeClick(data) {
        this.searchedParam.ExamSceneTimeId = this.searchParam.ExamSceneTimeId = data.ExamSceneTimeId;
        this.searchedParam.CityId = this.searchParam.CityId = "";
        this.searchedParam.ZoneId = this.searchParam.ZoneId = "";
        this.searchedParam.SchoolName = this.searchParam.SchoolName = "";
        this.searchedParam.RoomNumber = this.searchParam.RoomNumber = "";
        this.searchedParam.IsUpLoaded = this.searchParam.IsUpLoaded = "";
        this.searchedParam.UpdateDateTimeStart = this.searchParam.UpdateDateTimeStart = "";
        this.searchedParam.UpdateDateTimeEnd = this.searchParam.UpdateDateTimeEnd = "";
        this.pager.currentPage = 1;
        this.GetUploadDataList();
      },
      /**
       * 上传监控数据列表
       */
      GetUploadDataList() {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        authorizationCodeManageServices.GetUploadDataList({
          payload: {
            "ExamSceneTimeId": this.searchedParam.ExamSceneTimeId,
            "CityId": this.searchedParam.CityId,
            "ZoneId": this.searchedParam.ZoneId,
            "SchoolName": this.searchedParam.SchoolName,
            "RoomNumber": this.searchedParam.RoomNumber,
            "IsUpLoaded": this.searchedParam.IsUpLoaded,
            "UpdateDateTimeStart": this.searchedParam.UpdateDateTimeStart,
            "UpdateDateTimeEnd": this.searchedParam.UpdateDateTimeEnd,
            "PageIndex": this.pager.currentPage,
            "PageSize": this.pager.pageSize
          }
        }).then((data) => {
          this.$layer.close(loading);
          this.list = data.ReturnEntity.ExamSceneInfo;
          this.pager.total = Number(data.ReturnEntity.RecordTotal);
          this.UploadedExamRoomTotal = data.ReturnEntity.UploadedExamRoomTotal;
          this.ExamRoomTotal = data.ReturnEntity.ExamRoomTotal;
        })
      },
      /**
       * 地市下拉框改变触发
       */
      handleCityChange() {
        this.getZoneList(this.searchParam.CityId);
        this.zoneList = [];
        this.searchParam.ZoneId = "";
      },
      /**
       * 触发查询
       */
      handleSearchBtnClick() {
        this.searchedParam.CityId = this.searchParam.CityId;
        this.searchedParam.ZoneId = this.searchParam.ZoneId;
        this.searchedParam.SchoolName = this.searchParam.SchoolName;
        this.searchedParam.RoomNumber = this.searchParam.RoomNumber;
        this.searchedParam.IsUpLoaded = this.searchParam.IsUpLoaded;
        this.searchedParam.UpdateDateTimeStart = this.searchParam.UpdateDateTimeStart;
        this.searchedParam.UpdateDateTimeEnd = this.searchParam.UpdateDateTimeEnd;
        this.pager.currentPage = 1;
        this.GetUploadDataList();
      },
      /**
       * 分页下拉框
       */
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.handleSearchBtnClick();
      },
      /**
       * 分页点击
       */
      handleCurrentChange(val) {
        this.pager.currentPage = val;
        this.GetUploadDataList();
      },
    },
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
    overflow: hidden;
    margin: 0 15px;
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
    margin-top: 20px;
  }

  .exam-content .el-tabs__content {
    border-left: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }

  .container {
    border: 1px solid #e6e6e6;
    margin-top: 20px;
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

  .search-container {
    margin: 10px;
  }

  .el-tree-node__content {
    height: 40px !important;
  }

  .el-tree-node.is-current .el-tree-node__content {
    background-color: #ccc !important;
  }

  .main-left {
    overflow: auto;
  }

  .search-container {
    padding-bottom: 0;
  }

  .table-container td {
    padding: 0;
  }

  .treeComponents {
    display: inline-block;
    height: 100%;
  }

  .el-tree {
    font-size: 14px;
  }

  .el-tree-node, .el-tree-node__content {
    line-height: 36px;
    height: 36px;
  }

  .breadcrumbList {
    display: inline-block;
    background: #f7f9fa;
    vertical-align: top;
    width: 100%;
  }
  .el-collapse-item__header,.el-collapse-item__wrap{
    display: block;
  }
</style>
