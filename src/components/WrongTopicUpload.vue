<template>
  <div>
    <el-container v-cloak>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <ExamDetail></ExamDetail>
        <el-main>
          <div class="wrongTestHead">
            <el-row :gutter="20">
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <el-form :inline="true" :model="searchParam" class="demo-form-inline" size="small">
                    <el-form-item>
                      <el-select v-model="searchParam.ExamSceneId" placeholder="请选择考试场次">
                        <el-option v-for="item in ExamSceneList" :key="item.ExamSceneTimeId"
                                   :label="item.ExamSceneTimeName"
                                   :value="item.ExamSceneTimeId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select @change="handleQuestionCategoryChange" v-model="searchParam.CourseId"
                                 placeholder="请选择学科"
                                 style="width:115px;">
                        <el-option v-for="item in CourseList" :key="item.CourseId" :label="item.CourseName"
                                   :value="item.CourseId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="searchParam.QuestionCategoryId" placeholder="请选择题型"
                                 :disabled="testDisabledInput" style="width:115px;">
                        <el-option v-for="item in QuestionCategoryList" :key="item.QuestionCategoryId"
                                   :label="item.QuestionCategoryName"
                                   :value="item.QuestionCategoryId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-select v-model="searchParam.Status" placeholder="请选择状态" style="width:115px;">
                        <el-option v-for="item in StatusList" :key="item.value" :label="item.text" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-date-picker v-model="searchParam.BeginDateTime" type="date" style="width:130px;"
                                      value-format="yyyy-MM-dd" placeholder="上报时间">
                      </el-date-picker>
                      -
                      <el-date-picker v-model="searchParam.EndDateTime" style="width:130px;" width="130"
                                      value-format="yyyy-MM-dd" placeholder="上报时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content bg-purple" style="text-align: right">
                  <el-button size="small" type="primary" @click="queryWrongTest">查询</el-button>
                  <el-button size="small" type="primary">导入</el-button>
                  <el-button size="small" type="primary" @click="handleExportBtnWrongTest">导出错题包</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="wrongTestContent">
            <template>
              <el-table
                :data="wrongList"
                style="width: 100%">
                <el-table-column
                  prop="SceneName"
                  label="考试场次">
                </el-table-column>
                <el-table-column
                  prop="CourseName"
                  label="学科">
                </el-table-column>
                <el-table-column
                  prop="SchoolName"
                  label="考点名称">
                </el-table-column>
                <el-table-column
                  prop="Dog"
                  label="加密狗">
                </el-table-column>
                <el-table-column
                  prop="CategoryName"
                  label="题型">
                </el-table-column>
                <el-table-column
                  prop="QuestionId"
                  label="试题ID">
                  <template slot-scope="scope">
                    <el-button @click.native.prevent="openDialogTestID(scope.row.WrongQuestionId)" type="text"
                               size="small">
                      {{scope.row.QuestionId}}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="ReportTime"
                  label="上报时间">
                </el-table-column>
                <el-table-column
                  prop="Status"
                  :formatter="TypeFormatStatus"
                  label="状态">
                </el-table-column>
              </el-table>
              <div class="block clearfix" style="margin: 10px 0">
                <span class="fl reveal">显示{{wrongMergePage}}</span>
                <el-pagination
                  background
                  @size-change="wrongSizeChanger"
                  @current-change="wrongCurrentChanger"
                  :current-page="1"
                  :page-sizes="[10, 20, 50, 100]"
                  :pager-count="5"
                  :page-size="wrongPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="wrongTotal">
                </el-pagination>
              </div>
            </template>
          </div>
          <el-dialog
            title="错题上报"
            :visible.sync="newAddWrong"
            width="60%"
            :before-close="handleClose">
            <el-card style="max-height:300px;margin-bottom:10px;overflow: auto;text-align: center;">
              <img style="max-width:100%;" :src="form.Content" v-if="form.Content.length>0"/>
              <br/>
              <img style="max-width:100%;" :src="form.GroupContent" v-if="form.GroupContent.length>0"/>
            </el-card>
            <el-form :model="form" :rules="rules" label-width="100px" ref="ruleForm" size="small">
              <el-form-item label="错题类型：">
                {{form.ReportingTypeName}}
              </el-form-item>
              <el-form-item label="错题描述：">
                {{form.ReportComment}}
              </el-form-item>
              <hr style="background: #eeeeee;height:1px; border:none;">
              <el-form-item label="处理意见：" v-if="!form.isReadonly" prop="ProcessType">
                <el-radio-group v-model="form.ProcessType">
                  <el-radio :label="2">确认有效</el-radio>
                  <el-radio :label="3">无效,不作处理</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="处理意见：" v-else>
                {{form.ProcessType | processTypeFilter}}
              </el-form-item>
              <el-form-item label="说明：" v-if="!form.isReadonly">
                <el-input type="textarea" :rows="2" maxlength="100" placeholder="请输入不超过100字的说明"
                          v-model="form.ProcessComment">
                </el-input>
              </el-form-item>
              <el-form-item label="说明：" v-else>
                {{form.ProcessComment}}
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <template v-if="!form.isReadonly">
                <el-button @click="newAddWrong = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')" size="small">确 定</el-button>
              </template>
              <template v-else>
                <el-button type="primary" @click="newAddWrong = false" size="small">关闭</el-button>
              </template>
            </div>
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
  import * as commonServices from '../mock/commonServices'
  import * as wrongQuestionServices from '../mock/wrongQuestionServices'
  import DownloadFile from "../components/DownloadFile";
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  import ExamDetail from './ExamDetail.vue'
  export default {
    name: 'WrongTopicUpload',
    data() {
      return {
        newAddWrong: false,
        wrongPageIndex: 1,
        wrongPageSize: 10,
        wrongMergePage: '',
        wrongList: [],
        wrongTotal: 0,
        searchParam: {
          ExamSceneId: "",
          CourseId: "",
          QuestionCategoryId: "",
          Status: "",
          BeginDateTime: "",
          EndDateTime: "",
        },
        searchedParam: {
          ExamSceneId: "",
          CourseId: "",
          QuestionCategoryId: "",
          Status: "",
          BeginDateTime: "",
          EndDateTime: "",
        },
        isCollapse: true,
        openeds: [1, 2, 3, '4'],
        uniqueOpened: false,
        testDisabledInput: true,
        region: '',
        zone: '',
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
        options: [{
          value: '选项1',
          label: '请选择'
        }, {
          value: '选项2',
          label: '待确认'
        }, {
          value: '选项3',
          label: '已确认'
        }, {
          value: '选项4',
          label: '不作处理'
        }],
        upLoadTime1: '',
        upLoadTime2: '',
        ExamSceneList: [],
        CourseList: [],
        QuestionCategoryList: [],
        StatusList: [
          {text: "全部", value: "0"},
          {text: "待确认", value: "1"},
          {text: "已确认", value: "2"},
          {text: "不做处理", value: "3"}
        ],
        form: {
          "isReadonly": false,
          "WrongQuestionId": "",
          "Content": "",
          "GroupContent": "",
          "ReportingTypeName": "",
          "ReportComment": "",
          "ProcessType": "",
          "ProcessComment": "",
        },
      }
    },
    watch: {},
    computed: {},
    created() {
      this.wrongMergePage = (this.wrongPageIndex - 1) * this.wrongPageSize + 1 + "-" + this.wrongPageIndex * this.wrongPageSize
    },
    components: {Header, Footer, ExamDetail},
    mounted() {
      this.toggle();
      this.wrongQuestionList();
      this.GetExamSceneTimeInfo();
      this.GetExamCourse();
      this.GetCourseCategory()
    },
    activated() {
    },
    methods: {
      /**
       * 状态类型转换
       */
      TypeFormatStatus(row, column, cellValue, index) {
        switch (cellValue.toString()) {
          case "1":
            return "待确认";
          case "2":
            return "已确认";
          case "3":
            return "不作处理";
          default:
            return "";
        }
      },
      /**
       * 展开隐藏抽屉组件
       */
      toggle() {
        this.isCollapse = !this.isCollapse
      },
      /**
       * 学科下拉框改变触发
       */
      handleQuestionCategoryChange() {
        this.GetCourseCategory(this.searchParam.CourseId);
        this.QuestionCategoryList = [];
        this.searchParam.QuestionCategoryId = "";
        this.testDisabledInput = false
      },
      /**
       * 考试场次下拉框
       */
      GetExamSceneTimeInfo() {
        commonServices.GetExamSceneTimeInfo({
          payload: {}
        }).then((data) => {
          if (data.ResultType === 1 && data.ReturnEntity.length > 0) {
            this.ExamSceneList = data.ReturnEntity;
            this.ExamSceneList.unshift({
              ExamSceneTimeId: "0",
              ExamSceneTimeName: "请选择考试场次"
            });
          }
        });
      },
      /**
       * 学科下拉框
       */
      GetExamCourse() {
        commonServices.GetExamCourse({
          payload: {}
        }).then((data) => {
          if (data.ResultType === 1 && data.ReturnEntity.length > 0) {
            this.CourseList = data.ReturnEntity;
            this.CourseList.unshift({
              CourseId: "0",
              CourseName: "请选择学科"
            });
          }
        });
      },
      /**
       * 题型下拉框
       */
      GetCourseCategory(courseId) {
        commonServices.GetCourseCategory({
          payload: {"CourseId": courseId}
        }).then((data) => {
          if (data.ResultType === 1 && data.ReturnEntity.length > 0) {
            this.QuestionCategoryList = data.ReturnEntity;
            this.QuestionCategoryList.unshift({
              QuestionCategoryId: "0",
              QuestionCategoryName: "请选择题型"
            });
          }
        });
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        this.newAddWrong = false;
        console.log(key, keyPath);
      },
      /**
       * 点击第几页回调
       * @param val
       */
      wrongCurrentChanger(val) {
        this.wrongPageIndex = val;
        this.wrongMergePage = (this.wrongPageIndex - 1) * this.wrongPageSize + 1 + "-" + this.wrongPageIndex * this.wrongPageSize
        this.wrongQuestionList()
      },
      /**
       * 点击每页显示数量回调
       * @param val
       */
      wrongSizeChanger(val) {
        this.wrongPageSize = val;
        this.wrongMergePage = (this.wrongPageIndex - 1) * this.wrongPageSize + 1 + "-" + this.wrongPageIndex * this.wrongPageSize
        this.wrongQuestionList()
      },
      /**
       * 错题列表
       */
      wrongQuestionList() {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        wrongQuestionServices.GetQuestionList({
          payload: {
            "ExamSceneId": this.searchedParam.ExamSceneId,
            "CourseId": this.searchedParam.CourseId,
            "QuestionCategoryId": this.searchedParam.QuestionCategoryId,
            "Status": this.searchedParam.Status,
            "BeginDateTime": this.searchedParam.BeginDateTime,
            "EndDateTime": this.searchedParam.EndDateTime,
            "PageIndex": this.wrongPageIndex,
            "PageSize": this.wrongPageSize
          }
        }).then((data) => {
          if (data.ResultType === 1) {
            this.$layer.close(loading);
            this.wrongList = data.ReturnEntity.WrongQuestions;
            this.wrongTotal = Number(data.ReturnEntity.TotalCount);
          }
        });
      },
      /**
       * 导出错题包
       */
      handleExportBtnWrongTest() {
        wrongQuestionServices.ExportWrongQuestion({
          payload: {}
        }).then(DownloadFile);
      },
      /**
       * 查询错题
       */
      queryWrongTest() {
        this.searchedParam.ExamSceneId = this.searchParam.ExamSceneId;
        this.searchedParam.CourseId = this.searchParam.CourseId;
        this.searchedParam.QuestionCategoryId = this.searchParam.QuestionCategoryId;
        this.searchedParam.Status = this.searchParam.Status;
        this.searchedParam.BeginDateTime = this.searchParam.BeginDateTime;
        this.searchedParam.EndDateTime = this.searchParam.EndDateTime;
        this.wrongQuestionList();
      },
      /**
       * 错题上报查看弹窗
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let loading = this.$layer.msg('加载中...', {
              icon: 16,
              shade: 0.3,
              time: 0
            });
            wrongQuestionServices.SubmitQuestionProcess({
              payload: {
                "WrongQuestionId": this.form.WrongQuestionId,//加密的错题id
                "ProcessType": this.form.ProcessType,//处理意见id，2确认有效，3不作处理
                "Comment": this.form.ProcessComment//说明
              }
            }).then((data) => {
              if (data.ResultType === 1) {
                this.$layer.close(loading);
                this.newAddWrong = false;
                this.wrongQuestionList();
              }
            });
          } else {
            return false;
          }
        });
      },
      /**
       * 试题ID点击
       */
      openDialogTestID(id) {
        this.newAddWrong = true;
        this.GetQuestionDetail(id);
      },
      /**
       * 试题ID点击回调
       */
      GetQuestionDetail(wrongQuestionId) {
        wrongQuestionServices.GetQuestionDetail({
          payload: {
            "WrongQuestionId": wrongQuestionId
          }
        }).then((data) => {
          if (data.ResultType === 1) {
            this.form.isReadonly = data.ReturnEntity.ProcessType === 1 ? false : true;
            this.form.WrongQuestionId = data.ReturnEntity.WrongQuestionId;
            this.form.Content = data.ReturnEntity.Content;
            this.form.GroupContent = data.ReturnEntity.GroupContent;
            this.form.ReportingTypeName = data.ReturnEntity.ReportingTypeName;
            this.form.ReportComment = data.ReturnEntity.ReportComment;
            this.form.ProcessType = data.ReturnEntity.ProcessType === 1 ? "" : data.ReturnEntity.ProcessType;
            this.form.ProcessComment = data.ReturnEntity.ProcessComment;
          }
        });
      },
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

  .reveal {
    font-size: $font-14;
    color: $color-4d;
    line-height: $line-height-32;
    margin-top: 10px;
  }

  .el-pagination {
    float: right;
    padding-top: 10px;
  }
</style>
<style>
  .el-select {
    width: 130px;
    margin-bottom: 10px;
  }

  .el-row {
    margin: 0 !important;
  }

  .el-date-editor.el-input {
    width: 130px;
  }

  .wrongTestHead {
    margin: 15px 0;
  }

  .wrongTestContent {
    margin: 0 10px;
    border: 1px solid #e6e6e6;
  }

  .wrong {
    color: red;
  }
</style>
