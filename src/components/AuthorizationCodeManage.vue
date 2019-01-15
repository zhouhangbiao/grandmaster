<template>
  <div>
    <el-container v-cloak>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <ExamDetail></ExamDetail>
        <el-main>
          <div class="authorization">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item>考试监控</el-breadcrumb-item>
              <el-breadcrumb-item>授权码管理</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="reactSelect">
              <el-row :gutter="20">
                <el-col :span="18">
                  <div class="grid-content bg-purple">
                    <span class="city">地市/县区</span>
                    <el-select size="small" v-model="region" placeholder="请选择地市" @change="regionToDisabled(region)">
                      <el-option v-for="item in formCityList" :key="item.CityId" :label="item.CityName"
                                 :value="item.CityName"></el-option>
                    </el-select>
                    <el-select size="small" v-model="zone" placeholder="请选择县区" :disabled="zoneDisabledInput">
                      <el-option v-for="item in formZoneList" :key="item.ZoneId" :label="item.ZoneName"
                                 :value="item.ZoneName"></el-option>
                    </el-select>
                    <el-select size="small" v-model="valueType" placeholder="请选择类型">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.text">
                      </el-option>
                    </el-select>
                    <el-input size="small" v-model="inputName" placeholder="请输入考点铝名称"></el-input>
                    <el-input size="small" v-model="inputCode" placeholder="请输入机房编号"></el-input>
                    <el-input size="small" v-model="inputDog" placeholder="请输入加密狗"></el-input>
                    <el-date-picker
                      size="small"
                      v-model="valueDate"
                      type="datetimerange"
                      start-placeholder="有效期"
                      end-placeholder="有效期"
                      :default-time="['12:00:00']">
                    </el-date-picker>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <el-button size="small" type="primary" @click="handleSearchBtnClick">查询</el-button>
                    <el-button size="small" type="primary" @click="newAddAuthorization = true">新增授权码</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="authorizationContent">
              <el-table
                element-loading-text="加载中..."
                :data="list"
                :row-style="tableRowStyle"
                :header-cell-style="tableHeaderColor"
                height="400"
                size="mini"
                row-class-name="tableRow"
                class="spHeight"
                empty-text="暂无数据"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="CityName"
                  label="地市">
                </el-table-column>
                <el-table-column
                  prop="ZoneName"
                  label="县区">
                </el-table-column>
                <el-table-column
                  prop='SchoolCode'
                  label="考点代码">
                </el-table-column>
                <el-table-column
                  prop="SchoolName"
                  label="考点名称">
                </el-table-column>
                <el-table-column
                  prop="RoomNumber"
                  label="机房编号">
                </el-table-column>
                <el-table-column
                  prop="DogCode"
                  label="加密狗编号">
                </el-table-column>
                <el-table-column
                  prop="CreateDateTime"
                  label="生成时间">
                </el-table-column>
                <el-table-column
                  prop="BeginTime"
                  label="有效期">
                </el-table-column>
                <el-table-column
                  prop="OperationType"
                  :formatter="TypeFormat"
                  label="类型">
                </el-table-column>
                <el-table-column
                  label="授权码">
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="handleExportBtn(scope.row.AuthorizationCodeRecordId)" type="text"
                               size="small">
                      导出
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block clearfix" style="margin: 10px 0">
                <span class="fl reveal">显示{{mergePage}}</span>
                <el-pagination
                  background
                  @size-change="handleSizeChanger"
                  @current-change="handleCurrentChanger"
                  :current-page="1"
                  :page-sizes="[10, 20, 50, 100]"
                  :pager-count="5"
                  :page-size="10"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="Record">
                </el-pagination>
              </div>
            </div>
          </div>
          <el-dialog
            title="生成授权码"
            :visible.sync="newAddAuthorization"
            width="60%"
            :before-close="handleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="类型" prop="resource">
                <el-radio-group v-model="ruleForm.resource">
                  <el-radio label="脱机码"></el-radio>
                  <el-radio label="开考码"></el-radio>
                  <el-radio label="延考码"></el-radio>
                  <el-radio label="重考码"></el-radio>
                  <el-radio label="重开码"></el-radio>
                  <el-radio label="统开码"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="地市/县区" prop="region" style="display: inline-block">
                <el-select v-model="ruleForm.region" placeholder="请选择地市" @change="inputToDisabled(ruleForm.region)">
                  <el-option v-for="item in formCityList" :key="item.CityId" :label="item.CityName"
                             :value="item.CityName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="zone" style="display: inline-block">
                <el-select v-model="ruleForm.zone" placeholder="请选择县区" :disabled="disabledInput"
                           @change="zoneToDisabled(ruleForm.zone)">
                  <el-option v-for="item in formZoneList" :key="item.ZoneId" :label="item.ZoneName"
                             :value="item.ZoneName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考点名称" prop="name">
                <el-select v-model="ruleForm.name" placeholder="请选择考点名称" :disabled="nameToDisabled"
                           @change="schoolToDisabled(ruleForm.name)">
                  <el-option v-for="item in formSchoolList" :key="item.SchoolId" :label="item.SchoolName"
                             :value="item.SchoolName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="考点代码" prop="code">
                <span>{{SchoolCode}}</span>
              </el-form-item>
              <el-form-item label="机房编号" prop="number">
                <el-select v-model="ruleForm.number" placeholder="请选择杋编号" :disabled="numberToDisabled">
                  <el-option v-for="item in formRoomList" :key="item.RoomId" :label="item.RoomName"
                             :value="item.RoomName"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="加密狗编号" prop="dogCode">
                <span></span>
              </el-form-item>
              <el-form-item label="有效期" required>
                <el-col :span="11">
                  <el-date-picker
                    v-model="ruleForm.value11"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-date-picker
                    v-model="ruleForm.value22"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="脱机码" prop="typeCode">
                <span>保存后系统自动生成</span>
              </el-form-item>
              <el-form-item>
                <el-button @click="newAddAuthorization = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
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
  import * as authorizationCodeManageServices from '../mock/authorizationCodeManageServices'
  import * as commonServices from '../mock/commonServices'
  import DownloadFile from "../components/DownloadFile";
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  import ExamDetail from './ExamDetail.vue'
  let returnEnum = {
    success: 1,
    error: 2
  };
  export default {
    name: 'AuthorizationCodeManage',
    data() {
      return {
        ruleForm: {
          resource: '',
          region: '',
          name: '',
          date1: '',
          date2: '',
          value11: '',
          value22: '',
        },
        rules: {
          resource: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ], region: [
            {required: true, message: '请选择地市', trigger: 'change'}
          ], zone: [
            {required: true, message: '请选择县区', trigger: 'change'}
          ], name: [
            {required: true, message: '请选择考点名称', trigger: 'change'}
          ], number: [
            {required: true, message: '请选择机房编号', trigger: 'change'}
          ], date1: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ], date2: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
        },
        options: [{text: "请选择类型", value: "0"},
          {text: "脱机码", value: "1"},
          {text: "开考码", value: "2"},
          {text: "延考码", value: "3"},
          {text: "重考码", value: "4"},
          {text: "重开码", value: "5"},
          {text: "统开码", value: "6"}],
        region: '',
        zone: '',
        cityValue: '',
        valueCounty: '',
        valueType: '',
        inputName: '',
        authorizationPageIndex: 1,
        authorizationPageSize: 10,
        inputCode: '',
        inputDog: '',
        valueDate: '',
        list: [],
        tableRowStyle: {
          color: "#4d4d4d",
          fontSize: "14px",
          height: "40px",
          lineHeight: '40px'
        },
        tableHeaderColor: {
          backgroundColor: '#edeff0',
          color: "#1a1a1a",
          fontSize: "14px",
          height: "40px",
          lineHeight: '40px'
        },
        mergePage: '',
        Record: null,
        newAddAuthorization: false,
        formCityList: [],
        formZoneList: [],
        formSchoolList: [],
        formRoomList: [],
        disabledInput: true,
        nameToDisabled: true,
        numberToDisabled: true,
        zoneDisabledInput: true,
        SchoolCode: '',
        //点击查询时的记录的查询参数
        searchedParam: {
          CityId: "",
          ZoneId: "",
          OperationType: "",
          SchoolName: "",
          RoomNumber: "",
          DogCode: "",
          BeginTime: "",
          EndTime: ""
        },
      }
    },
    watch: {},
    computed: {},
    created() {
      this.mergePage = (this.authorizationPageIndex - 1) * this.authorizationPageSize + 1 + "-" + this.authorizationPageIndex * this.authorizationPageSize
    },
    components: {Header, Footer, ExamDetail},
    mounted() {
      this.toggle();
      this.getAuthorizationList();
      this.GetCityList();
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
        this.newAddAuthorization = false;
        console.log(key, keyPath);
      },
      /**
       * 授权码管理列表
       */
      getAuthorizationList() {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0,
        });
        authorizationCodeManageServices.GetList({
          payload: {
            "CityId": this.searchedParam.CityId,//地市ID
            "ZoneId": this.searchedParam.ZoneId,//县区ID
            "OperationType": this.searchedParam.OperationType,// 类型 1.脱机码 2.开考码 3.重考码 4.延考码 5.重新开启考试码 6.统开码
            "SchoolName": this.searchedParam.SchoolName,//考点名称
            "RoomNumber": this.searchedParam.RoomNumber,//机房编号
            "DogCode": this.searchedParam.DogCode,//加密狗编号
            "BeginTime": this.searchedParam.BeginTime,//开始日期 2018-08-01
            "EndTime": this.searchedParam.EndTime,//结束日期 2018-08-01
            "PageIndex": this.authorizationPageIndex,
            "PageSize": this.authorizationPageSize
          }
        }).then((data) => {
          this.$layer.close(loading);
          this.list = data.ReturnEntity.AuthorizationCodeInfo;
          this.Record = data.ReturnEntity.RecordTotal;
        })
      },
      /**
       * 点击第几页回调
       * @param val
       */
      handleCurrentChanger(val) {
        this.authorizationPageIndex = val;
        this.mergePage = (this.authorizationPageIndex - 1) * this.authorizationPageSize + 1 + "-" + this.authorizationPageIndex * this.authorizationPageSize
        this.getAuthorizationList()
      },
      /**
       * 点击每页显示数量回调
       * @param val
       */
      handleSizeChanger(val) {
        this.authorizationPageSize = val;
        this.mergePage = (this.authorizationPageIndex - 1) * this.authorizationPageSize + 1 + "-" + this.authorizationPageIndex * this.authorizationPageSize
        this.getAuthorizationList()
      },
      /**
       * 新增授权提交
       * @param formName
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let loading = this.$layer.msg('加载中...', {
              icon: 16,
              shade: 0.3,
              time: 0
            });
            authorizationCodeManageServices.Add({
              payload: {
                "OperationType": '',
                "RoomId": '',
                "BeginTime": '',
                "EndTime": '',
                "LeftTimeLength": ''
              }
            }).then((data) => {
              this.$layer.close(loading);
              if (data.ReturnEntity === returnEnum.success) {
                this.newAddAuthorization = false;
                this.getAuthorizationList();
                this.$layer.msg('保存成功', {icon: 1, time: 3});
              } else {
                this.$layer.msg('保存失败', {icon: 2, time: 3});
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * 弹窗地市
       */
      GetCityList() {
        commonServices.GetCityList({
          payload: {}
        }).then((data) => {
          this.formCityList = data.ReturnEntity;
        })
      },
      /**
       * 弹窗县区
       */
      GetZoneList(cityId) {
        commonServices.GetZoneList({
          payload: {"CityId": cityId}
        }).then((data) => {
          this.formZoneList = data.ReturnEntity;
        })
      },
      /**
       * 弹窗考点名称
       */
      GetSchoolList(zoneId) {
        authorizationCodeManageServices.GetSchoolList({
          payload: {"ZoneId": zoneId}
        }).then((data) => {
          this.formSchoolList = data.ReturnEntity;
          for (let i = 0; i < data.ReturnEntity.length; i++) {
            if (zoneId === data.ReturnEntity[i].SchoolName) {
              this.SchoolCode = data.ReturnEntity[i].SchoolCode
            }
          }
        })
      },
      /**
       * 弹窗机房编号代码
       */
      GetExamRoomList(schoolId) {
        authorizationCodeManageServices.GetExamRoomList({
          payload: {"SchoolId": schoolId}
        }).then((data) => {
          this.formRoomList = data.ReturnEntity;
        })
      },
      /**
       * 解封列表县区
       */
      regionToDisabled(cityId) {
        this.zoneDisabledInput = false;
        this.GetZoneList(cityId);
      }, /**
       * 解封县区
       */
      inputToDisabled(cityId) {
        this.disabledInput = false;
        this.GetZoneList(cityId);
        console.log(cityId);
      },
      /**
       * 解封考点名称
       */
      zoneToDisabled(zoneId) {
        this.nameToDisabled = false;
        this.GetSchoolList(zoneId);
        console.log(zoneId);
      },
      /**
       * 根据考点名称获取考点代码
       */
      schoolToDisabled(schoolId) {
        this.numberToDisabled = false;
        this.GetSchoolList(schoolId);
        this.GetExamRoomList(schoolId);
        console.log(schoolId);
      },
      /**
       * 触发查询
       */
      handleSearchBtnClick() {
        this.searchedParam.CityId = '';
        this.searchedParam.ZoneId = '';
        this.searchedParam.OperationType = '';
        this.searchedParam.SchoolName = '';
        this.searchedParam.RoomNumber = '';
        this.searchedParam.DogCode = '';
        this.searchedParam.BeginTime = '';
        this.searchedParam.EndTime = '';
        this.authorizationPageIndex = '';
        this.authorizationPageSize = '';
        this.getAuthorizationList();
      },
      /**
       * 触发查询
       */
      handleExportBtn: function (authorizationCodeRecordId) {
        authorizationCodeManageServices.Export({
          payload: {
            "AuthorizationCodeRecordId": authorizationCodeRecordId
          }
        }).then(DownloadFile)
      },
      /**
       * 类型转换
       */
      TypeFormat(row, column, cellValue, index) {
        switch (cellValue.toString()) {
          case "1":
            return "脱机码";
          case "2":
            return "开考码";
          case "3":
            return "延考码";
          case "4":
            return "重考码";
          case "5":
            return "重开码";
          case "6":
            return "统开码";
          default:
            return "";
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../scss/global.scss';

  .reveal {
    font-size: $font-14;
    color: $color-4d;
    line-height: $line-height-32;
    margin-top: 23px;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 180px;
    min-height: 880px;
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
  .authorization {
    padding: 0 15px;
  }

  .el-breadcrumb {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
  }

  .el-breadcrumb__inner {
    color: #4d4d4d;
  }

  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #1a1a1a;
  }

  .city {
    font-size: 14px;
    color: #4d4d4d;
  }

  .reactSelect .el-select, .reactSelect .el-input {
    width: 130px;
    margin-bottom: 10px;
  }

  .el-input__inner {
    padding: 0 10px;
  }

  .el-range-editor--small.el-input__inner {
    width: 260px;
  }

  .el-pagination:nth-child(2) {
    padding-top: 15px;
    float: right;
  }

  .authorizationContent {
    border: 1px solid #e6e6e6;
    height: 100%;
  }

  .reactSelect {
    margin: 20px 0;
  }

  .el-form-item {
    margin-bottom: 14px;
  }

  .el-form-item__error {
    padding-top: 0;
  }
</style>
