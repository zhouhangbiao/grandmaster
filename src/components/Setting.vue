<template>
  <div>
    <el-container v-cloak>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <ExamDetail></ExamDetail>
        <el-main>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item>系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>统一设置</el-breadcrumb-item>
          </el-breadcrumb>
          <div class='exam-content'>
            <el-tabs v-model="activeName" type="card">
              <el-tab-pane label="教师机设置" name="first">
                <ul class="setting-list">
                  <li>
                    <div>1、教师机登录设置</div>
                    <div class="setting-content">
                      <el-radio-group v-model="form1.MonitorLoginSetting">
                        <el-radio :label="'1'">允许教师机登录</el-radio>
                        <el-radio :label="'2'">禁止教师机登录</el-radio>
                        <el-radio :label="'3'">允许登录时间段</el-radio>
                      </el-radio-group>
                      <el-date-picker size="mini" :disabled="form1.MonitorLoginSetting!==3"
                                      v-model="form1.AllowMonitorLoginTime"
                                      type="datetimerange" :default-time="['00:00:00', '23:59:59']" range-separator="-"
                                      start-placeholder="选择日期时间" end-placeholder="选择日期时间">
                      </el-date-picker>
                      <!-- <el-date-picker :disabled="form1.MonitorLoginSetting!=3" v-model="form1.AllowMonitorLoginBeginTime"
                        style="width:155px" type="datetime" placeholder="选择日期时间" size="mini"></el-date-picker>
                      -
                      <el-date-picker :disabled="form1.MonitorLoginSetting!=3" v-model="form1.AllowMonitorLoginEndTime"
                        style="width:155px" type="datetime" placeholder="选择日期时间" size="mini"></el-date-picker> -->
                      <span class="setting-error">{{error.e1}}</span>
                    </div>
                  </li>
                  <li>
                    <div>2、系统当天开放时间段</div>
                    <div class="setting-content">
                      <el-time-picker is-range size="mini" v-model="form1.AllowMonitorSystemLoginTime"
                                      start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm"
                                      format="HH:mm">
                      </el-time-picker>
                    </div>
                    <span class="setting-error">{{error.e9}}</span>
                  </li>
                  <li>
                    <div>3、考试启动设置</div>
                    <div class="setting-content">
                      <el-radio-group v-model="form1.ExamOpenModel" @change="handleExamOpenModelChange">
                        <el-radio :label="'1'" style="width:200px;">手动启动</el-radio>
                        <el-radio :label="'2'">自动开启</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="setting-content">
                      <el-radio :label="'1'" :disabled="form1.ExamOpenModel!==1" v-model="form1.OpenExamTimeSetting"
                                class="child-radio">始终允许
                      </el-radio>
                    </div>
                    <div class="setting-content">
                      <el-radio :label="'2'" :disabled="form1.ExamOpenModel!==1" v-model="form1.OpenExamTimeSetting"
                                class="child-radio">考试前后
                        <el-input v-model.number="form1.AroundExamMinuteAllowOpen"
                                  :disabled="!(form1.ExamOpenModel===1&&form1.OpenExamTimeSetting===2)"
                                  @change="handleAroundExamMinuteAllowOpenChange" style="width:50px;"
                                  size="mini"></el-input>
                        分钟方可开启
                      </el-radio>
                      <span class="setting-error">{{error.e2}}</span>
                    </div>
                  </li>
                  <li>
                    <div>4、考试关闭设置</div>
                    <div class="setting-content">
                      <el-radio-group v-model="form1.ExamCloseModel" :disabled="true">
                        <el-radio :label="'1'" style="width:200px;">手动关闭</el-radio>
                        <el-radio :label="'2'">自动关闭</el-radio>
                      </el-radio-group>
                    </div>
                  </li>
                  <li>
                    <div>5、延考设置</div>
                    <div class="setting-content">
                      <el-radio-group v-model="form1.IsAllowDelayExam">
                        <el-radio :label="'1'" style="width:200px;">允许延考</el-radio>
                        <el-radio :label="'2'">不允许延考</el-radio>
                      </el-radio-group>
                    </div>
                  </li>
                  <li>
                    <div>6、重考设置</div>
                    <div class="setting-content">
                      <el-radio-group v-model="form1.IsAllowReexamination">
                        <el-radio :label="'1'" style="width:200px;">允许重考</el-radio>
                        <el-radio :label="'2'">不允许重考</el-radio>
                      </el-radio-group>
                    </div>
                    <div class="setting-content">
                      <el-radio :label="'1'" :disabled="form1.IsAllowReexamination!==1"
                                v-model="form1.IsReexaminationChangePaper"
                                class="child-radio">重考换卷
                      </el-radio>
                    </div>
                    <div class="setting-content">
                      <el-radio :label="'2'" :disabled="form1.IsAllowReexamination!==1"
                                v-model="form1.IsReexaminationChangePaper"
                                class="child-radio">不换卷
                      </el-radio>
                    </div>
                  </li>
                  <li>
                    <div>7、缺考时长设置</div>
                    <div class="setting-content">
                      <el-radio :label="'1'" v-model="form1.MissExamTimeLengthSetting" style="width:200px;">不限制
                      </el-radio>
                      <el-radio :label="'2'" v-model="form1.MissExamTimeLengthSetting">开考后
                        <el-input :disabled="form1.MissExamTimeLengthSetting!==2"
                                  v-model.number="form1.MissExamTimeThreshold"
                                  @change="handleMissExamTimeThresholdChange" style="width:50px;"
                                  size="mini"></el-input>
                        分钟未开始，自动标记缺考
                      </el-radio>
                      <span class="setting-error">{{error.e3}}</span>
                    </div>
                  </li>
                  <li>
                    <div>8、传输设置</div>
                    <table>
                      <tr>
                        <td>
                          <div class="setting-content">
                            下载：
                          </div>
                        </td>
                        <td style="width:250px;">
                          <div class="setting-content">
                            <el-radio :label="'1'" :disabled="true" v-model="form1.TransmissionDownloadSetting">不限速
                            </el-radio>
                          </div>
                        </td>
                        <td>
                          <div class="setting-content">
                            上传：
                          </div>
                        </td>
                        <td>
                          <div class="setting-content">
                            <el-radio :label="'1'" :disabled="true" v-model="form1.TransmissionUploadSetting">不限速
                            </el-radio>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <div class="setting-content">
                            <el-radio :label="'2'" :disabled="true" v-model="form1.TransmissionDownloadSetting">限速为
                              <el-input :disabled="true||form1.TransmissionDownloadSetting!==2"
                                        v-model.number="form1.TransmissionDownloadLimit"
                                        @change="handleTransmissionDownloadLimitChange" style="width:50px;"
                                        size="mini"></el-input>
                              KB/s
                            </el-radio>
                          </div>
                        </td>
                        <td></td>
                        <td>
                          <div class="setting-content">
                            <el-radio :label="'2'" :disabled="true" v-model="form1.TransmissionUploadSetting">限速为
                              <el-input :disabled="true||form1.TransmissionUploadSetting!==2"
                                        v-model.number="form1.TransmissionUploadLimit"
                                        @change="handleTransmissionUploadLimitChange" style="width:50px;"
                                        size="mini"></el-input>
                              KB/s
                            </el-radio>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </li>
                  <li>
                    <div>9、下载线程设置</div>
                    <div class="setting-content">
                      <el-radio-group v-model="form1.DownloadThreadCountSetting" :disabled="true">
                        <el-radio :label="'1'" style="width:200px;">不限制</el-radio>
                        <el-radio :label="'2'">最大线程数：
                          <el-input :disabled="true||form1.DownloadThreadCountSetting!==2"
                                    v-model.number="form1.DownloadThreadCount"
                                    @change="handleDownloadThreadCountChange" style="width:50px;"
                                    size="mini"></el-input>
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </li>
                  <li>
                    <div>10、考试倒计时提醒</div>
                    <div class="setting-content">
                      <el-radio :label="'1'" v-model="form1.MonitorRemindTimeSetting" style="width:200px;">不提醒
                      </el-radio>
                      <el-radio :label="'2'" v-model="form1.MonitorRemindTimeSetting">提前
                        <el-input :disabled="form1.MonitorRemindTimeSetting!==2"
                                  v-model.number="form1.MonitorRemindTimeLength"
                                  @change="handleMonitorRemindTimeLengthChange" style="width:50px;"
                                  size="mini"></el-input>
                        分钟提醒
                      </el-radio>
                      <span class="setting-error">{{error.e7}}</span>
                    </div>
                  </li>
                  <li>
                    <div>11、组卷方式</div>
                    <div class="setting-content">
                      <el-radio-group v-model="form1.GeneratePaperSetting" :disabled="true">
                        <el-radio :label="'1'" style="width:200px;">提前组卷</el-radio>
                        <el-radio :label="'2'">实时组卷
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </li>
                  <li>
                    <div>12、多选题漏选是否得分</div>
                    <div class="setting-content">
                      <el-radio-group v-model="form1.IsMultiSectionSelLessScored">
                        <el-radio :label="'1'" style="width:200px;">得分</el-radio>
                        <el-radio :label="'0'">不得分
                        </el-radio>
                      </el-radio-group>
                    </div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="考试机设置" name="second">
                <div class='exam-content'>
                  <ul class="setting-list">
                    <li>
                      <div>1、系统当天开放时间段</div>
                      <div class="setting-content">
                        <el-time-picker is-range size="mini" v-model="form1.AllowExamineSystemLoginTime"
                                        start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm"
                                        format="HH:mm">
                        </el-time-picker>
                      </div>
                      <span class="setting-error">{{error.e10}}</span>
                    </li>
                    <li>
                      <div>2、考试机答题界面样式设置</div>
                      <div class="setting-content">
                        <el-radio-group v-model="form1.AnswerModel">
                          <el-radio :label="'1'" style="width:200px;">单题模式</el-radio>
                          <el-radio :label="'2'">整卷模式</el-radio>
                        </el-radio-group>
                      </div>
                    </li>
                    <li>
                      <div>3、考试机上下题切换设置</div>
                      <div class="setting-content">
                        <el-radio-group v-model="form1.IsChangeSwitch">
                          <el-radio :label="'1'" style="width:200px;">允许切换</el-radio>
                          <el-radio :label="'0'">禁止切换</el-radio>
                        </el-radio-group>
                      </div>
                      <div class="setting-content">
                        <el-radio :label="'1'" :disabled="form1.IsChangeSwitch!==0" v-model="form1.IsQuestionCountDown"
                                  class="child-radio-right">开启单题时间
                        </el-radio>
                      </div>
                      <div class="setting-content">
                        <el-radio :label="'2'" :disabled="form1.IsChangeSwitch!==0" v-model="form1.IsQuestionCountDown"
                                  class="child-radio-right">关闭单题时间
                        </el-radio>
                      </div>
                    </li>
                    <li>
                      <div>4、考试倒计时提醒</div>
                      <div class="setting-content">
                        <el-radio :label="'1'" v-model="form1.StudentRemindTimeSetting" style="width:200px;">不提醒
                        </el-radio>
                        <el-radio :label="'2'" v-model="form1.StudentRemindTimeSetting">提前
                          <el-input :disabled="form1.StudentRemindTimeSetting!==2"
                                    v-model.number="form1.StudentRemindTimeLength"
                                    @change="handleStudentRemindTimeLengthChange" style="width:50px;"
                                    size="mini"></el-input>
                          分钟提醒
                        </el-radio>
                        <span class="setting-error">{{error.e8}}</span>
                      </div>
                    </li>
                    <li>
                      <div>5、座位号是否启用</div>
                      <div class="setting-content">
                        <el-radio-group v-model="form1.IsSeatingPlanEnabled">
                          <el-radio :label="'1'" style="width:200px;">启用</el-radio>
                          <el-radio :label="'0'">禁用</el-radio>
                        </el-radio-group>
                      </div>
                    </li>
                    <li>
                      <div>6、考试过程中键盘是否启用</div>
                      <div class="setting-content">
                        <el-radio-group v-model="form1.IsAllowToUseKeyBoardWhenExaming">
                          <el-radio :label="'1'" style="width:200px;">启用</el-radio>
                          <el-radio :label="'0'">禁用</el-radio>
                        </el-radio-group>
                      </div>
                    </li>
                    <li>
                      <div>7、同场连考考试顺序限制</div>
                      <div class="setting-content">
                        <el-radio-group v-model="form1.IsExamingNeedCoursesOrder">
                          <el-radio :label="'0'" style="width:200px;">可同时考试</el-radio>
                          <el-radio :label="'1'">先后考试</el-radio>
                        </el-radio-group>
                      </div>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>
            <div class="setting-footer">
              <el-button type="primary" size="small" @click="submitForm()" :disabled="IsTimeout===1"
                         :title="IsTimeout===1?'当前时间段，不允许再修改设置。':''">保存
              </el-button>
            </div>
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
  import * as commonService from '../mock/commonServices';
  import $ from 'jquery'
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  import ExamDetail from './ExamDetail.vue'
  export default {
    name: 'Setting',
    data() {
      return {
        isCollapse: true,
        openeds: [1, 2, 3, '4'],
        uniqueOpened: false,
        activeName: "first",
        IsTimeout: "0",
        form1: {
          MonitorLoginSetting: "",
          AllowMonitorLoginTime: "",
          AllowMonitorLoginBeginTime: "",
          AllowMonitorLoginEndTime: "",
          ExamOpenModel: "",
          OpenExamTimeSetting: "",
          AroundExamMinuteAllowOpen: "",
          ExamCloseModel: "",
          IsAllowDelayExam: "",
          IsAllowReexamination: "",
          IsReexaminationChangePaper: "",
          MissExamTimeLengthSetting: "",
          MissExamTimeThreshold: "",
          TransmissionDownloadSetting: "",
          TransmissionDownloadLimit: "",
          TransmissionUploadSetting: "",
          TransmissionUploadLimit: "",
          DownloadThreadCountSetting: "",
          DownloadThreadCount: "",
          MonitorRemindTimeSetting: "",
          MonitorRemindTimeLength: "",
          GeneratePaperSetting: "",
          IsMultiSectionSelLessScored: "",
          AllowMonitorSystemLoginTime: "",
          AllowMonitorSystemLoginBeginTime: "",
          AllowMonitorSystemLoginEndTime: "",
          AnswerModel: "",
          IsChangeSwitch: "",
          IsQuestionCountDown: "",
          StudentRemindTimeSetting: "",
          StudentRemindTimeLength: "",
          IsSeatingPlanEnabled: "",
          AllowExamineSystemLoginTime: "",
          AllowExamineSystemLoginBeginTime: "",
          AllowExamineSystemLoginEndTime: "",
          IsAllowToUseKeyBoardWhenExaming: "",
          IsExamingNeedCoursesOrder: ""
        },
        error: {
          e1: "",
          e2: "",
          e3: "",
          e4: "",
          e5: "",
          e6: "",
          e7: "",
          e8: "",
          e9: "",
          e10: ""
        }
      }
    },
    watch: {},
    computed: {},
    created() {
    },
    components: {Header, Footer, ExamDetail},
    mounted() {
      let self = this;
      self.toggle();
      /**
       * 获取统一设置信息
       */
      commonService.GetInfo({
        payload: {}
      }).then((data) => {
        if (data.ResultType !== 1) {
          return;
        }
        self.IsTimeout = JSON.parse(data.ReturnEntity.IsTimeout);
        if (data.ReturnEntity.CommonConfigInfo.length > 0) {
          //self.IsTimeout.forEach((e,i)=>{
          $(data.ReturnEntity.CommonConfigInfo).each(function (i, e) {
            switch (e.ItemName) {
              case "AllowMonitorLoginBeginTime":
              case "AllowMonitorLoginEndTime":
                if (new Date(e.ItemValue) === "Invalid Date") {
                  self.form1[e.ItemName] = "";
                } else {
                  self.form1[e.ItemName] = e.ItemValue;
                }
                break;
              case "AroundExamMinuteAllowOpen":
              case "MissExamTimeThreshold":
              case "MonitorRemindTimeLength":
              case "StudentRemindTimeLength":
                self.form1[e.ItemName] = parseInt(e.ItemValue / 60);
                break;
              default:
                self.form1[e.ItemName] = e.ItemValue;
                break;
            }
          });
          if (self.form1["AllowMonitorLoginBeginTime"] && self.form1["AllowMonitorLoginEndTime"]) {
            self.form1["AllowMonitorLoginTime"] = [self.form1["AllowMonitorLoginBeginTime"], self.form1["AllowMonitorLoginEndTime"]];
          }
          if (self.form1["AllowExamineSystemLoginBeginTime"] && self.form1["AllowExamineSystemLoginEndTime"]) {
            self.form1["AllowExamineSystemLoginTime"] = [self.form1["AllowExamineSystemLoginBeginTime"], self.form1["AllowExamineSystemLoginEndTime"]];
          }
          if (self.form1["AllowMonitorSystemLoginBeginTime"] && self.form1["AllowMonitorSystemLoginEndTime"]) {
            self.form1["AllowMonitorSystemLoginTime"] = [self.form1["AllowMonitorSystemLoginBeginTime"], self.form1["AllowMonitorSystemLoginEndTime"]];
          }
        }
      });
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
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleAroundExamMinuteAllowOpenChange(val) {
        this.form1.AroundExamMinuteAllowOpen = val.replace(/\D/g, '');
      },
      handleMissExamTimeThresholdChange(val) {
        this.form1.MissExamTimeThreshold = val.replace(/\D/g, '');
      },
      handleTransmissionDownloadLimitChange(val) {
        this.form1.TransmissionDownloadLimit = val.replace(/\D/g, '');
      },
      handleTransmissionUploadLimitChange(val) {
        this.form1.TransmissionUploadLimit = val.replace(/\D/g, '');
      },
      handleDownloadThreadCountChange(val) {
        this.form1.DownloadThreadCount = val.replace(/\D/g, '');
      },
      handleMonitorRemindTimeLengthChange(val) {
        this.form1.MonitorRemindTimeLength = val.replace(/\D/g, '');
      },
      handleStudentRemindTimeLengthChange(val) {
        this.form1.StudentRemindTimeLength = val.replace(/\D/g, '');
      },
      validForm1() {
        let count = 0;
        // if (this.form1.MonitorLoginSetting == 3
        //   && (this.form1.AllowMonitorLoginBeginTime == "" || this.form1.AllowMonitorLoginEndTime == "")) {
        //   this.error.e1 = "请填写完整时间段";
        //   count++;
        // } else {
        //   this.error.e1 = "";
        // }
        if (this.form1.MonitorLoginSetting === 3
          && (this.form1.AllowMonitorLoginTime === "" || this.form1.AllowMonitorLoginTime == null)) {
          this.error.e1 = "请填写完整时间段";
          count++;
        } else {
          this.error.e1 = "";
        }

        if (this.form1.ExamOpenModel === 1
          && this.form1.OpenExamTimeSetting === 2
          && this.form1.AroundExamMinuteAllowOpen === "") {
          this.error.e2 = "请填写分钟数";
          count++;
        } else {
          this.error.e2 = "";
        }

        if (this.form1.MissExamTimeLengthSetting === 2 && this.form1.MissExamTimeThreshold.toString() === "") {
          this.error.e3 = "请填写分钟数";
          count++;
        } else {
          this.error.e3 = "";
        }
        //代码不能删除以后要用
        // if (this.form1.TransmissionDownloadSetting == 2 && this.form1.TransmissionDownloadLimit.toString() == "") {
        //   this.error.e4 = "请填写传输数值";
        //   count++;
        // } else {
        //   this.error.e4 = "";
        // }

        // if (this.form1.TransmissionUploadSetting == 2 && this.form1.TransmissionUploadLimit.toString() == "") {
        //   this.error.e5 = "请填写传输数值";
        //   count++;
        // } else {
        //   this.error.e5 = "";
        // }

        if (this.form1.DownloadThreadCountSetting === 2 && this.form1.DownloadThreadCount.toString() === "") {
          this.error.e6 = "请填写线程数";
          count++;
        } else {
          this.error.e6 = "";
        }

        if (this.form1.MonitorRemindTimeSetting === 2 && this.form1.MonitorRemindTimeLength.toString() === "") {
          this.error.e7 = "请填写分钟数";
          count++;
        } else {
          this.error.e7 = "";
        }
        if (!this.form1.AllowMonitorSystemLoginTime) {
          this.error.e9 = "请填写完整时间段";
          count++;
        } else {
          this.error.e9 = "";
        }
        return count === 0;
      },
      validForm2() {
        let count = 0;
        if (this.form1.StudentRemindTimeSetting === 2 && this.form1.StudentRemindTimeLength.toString() === "") {
          this.error.e8 = "请填写分钟数";
          count++;
        } else {
          this.error.e8 = "";
        }
        if (!this.form1.AllowExamineSystemLoginTime) {
          this.error.e10 = "请填写完整时间段";
          count++;
        } else {
          this.error.e10 = "";
        }
        return count === 0;
      },
      dateFormat(date, format) { //author: meizz
        date = new Date(date);
        let o = {
          'M+': date.getMonth() + 1, //month
          'd+': date.getDate(), //day
          'H+': date.getHours(), //hour+8小时
          'm+': date.getMinutes(), //minute
          's+': date.getSeconds(), //second
          'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
          'S': date.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format))
          format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

        for (let k in o)
          if (new RegExp('(' + k + ')').test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));

        return format;

      },
      /**
       * 保存统一设置
       */
      submitForm() {
        if (this.activeName === "first") {
          if (this.validForm1()) {

            let loading = this.$layer.msg('加载中...', {
              icon: 16,
              shade: 0.3,
              time: 0
            });

            let beginTime = "";
            let endTime = "";
            // if (this.form1.AllowMonitorLoginBeginTime != "") {
            //   beginTime = this.dateFormat(new Date(this.form1.AllowMonitorLoginBeginTime), "yyyy-MM-dd HH:mm:ss");
            // }
            // if (this.form1.AllowMonitorLoginEndTime != "") {
            //   endTime = this.dateFormat(new Date(this.form1.AllowMonitorLoginEndTime), "yyyy-MM-dd HH:mm:ss");
            // }
            if (this.form1.AllowMonitorLoginTime) {
              beginTime = this.dateFormat(this.form1.AllowMonitorLoginTime[0], "yyyy-MM-dd HH:mm:ss");
              endTime = this.dateFormat(this.form1.AllowMonitorLoginTime[1], "yyyy-MM-dd HH:mm:ss");
            }
            commonService.Save({
              payload: [{
                "ItemName": "MonitorLoginSetting",
                "ItemValue": this.form1.MonitorLoginSetting
              }, {
                "ItemName": "AllowMonitorLoginBeginTime",
                "ItemValue": beginTime
              }, {
                "ItemName": "AllowMonitorLoginEndTime",
                "ItemValue": endTime
              }, {
                "ItemName": "ExamOpenModel",
                "ItemValue": this.form1.ExamOpenModel
              }, {
                "ItemName": "OpenExamTimeSetting",
                "ItemValue": this.form1.OpenExamTimeSetting
              }, {
                "ItemName": "AroundExamMinuteAllowOpen",
                "ItemValue": parseInt(this.form1.AroundExamMinuteAllowOpen * 60)
              }, {
                "ItemName": "ExamCloseModel",
                "ItemValue": this.form1.ExamCloseModel
              }, {
                "ItemName": "IsAllowDelayExam",
                "ItemValue": this.form1.IsAllowDelayExam
              }, {
                "ItemName": "IsAllowReexamination",
                "ItemValue": this.form1.IsAllowReexamination
              }, {
                "ItemName": "IsReexaminationChangePaper",
                "ItemValue": this.form1.IsReexaminationChangePaper //
              }, {
                "ItemName": "MissExamTimeLengthSetting",
                "ItemValue": this.form1.MissExamTimeLengthSetting
              }, {
                "ItemName": "MissExamTimeThreshold",
                "ItemValue": parseInt(this.form1.MissExamTimeThreshold * 60)
              }, {
                "ItemName": "TransmissionDownloadSetting",
                "ItemValue": this.form1.TransmissionDownloadSetting
              }, {
                "ItemName": "TransmissionDownloadLimit",
                "ItemValue": this.form1.TransmissionDownloadLimit
              }, {
                "ItemName": "TransmissionUploadSetting",
                "ItemValue": this.form1.TransmissionUploadSetting
              }, {
                "ItemName": "TransmissionUploadLimit",
                "ItemValue": this.form1.TransmissionUploadLimit
              }, {
                "ItemName": "DownloadThreadCountSetting",
                "ItemValue": this.form1.DownloadThreadCountSetting
              }, {
                "ItemName": "DownloadThreadCount",
                "ItemValue": this.form1.DownloadThreadCount
              }, {
                "ItemName": "MonitorRemindTimeSetting",
                "ItemValue": this.form1.MonitorRemindTimeSetting
              }, {
                "ItemName": "MonitorRemindTimeLength",
                "ItemValue": parseInt(this.form1.MonitorRemindTimeLength * 60)
              }, {
                "ItemName": "GeneratePaperSetting",
                "ItemValue": this.form1.GeneratePaperSetting
              }, {
                "ItemName": "IsMultiSectionSelLessScored",
                "ItemValue": this.form1.IsMultiSectionSelLessScored
              }, {
                "ItemName": "AllowMonitorSystemLoginBeginTime",
                "ItemValue": this.form1.AllowMonitorSystemLoginTime[0]
              }, {
                "ItemName": "AllowMonitorSystemLoginEndTime",
                "ItemValue": this.form1.AllowMonitorSystemLoginTime[1]
              }]
            }).then((data) => {
              this.$layer.close(loading);
              if (data.ReturnEntity === 1) {
                this.$layer.msg('保存成功', {icon: 1, time: 3});
              } else {
                this.$layer.msg('保存失败', {icon: 2, time: 3});
              }
            });
          }
        }
        else {
          if (this.validForm2()) {

            let loading = this.$layer.msg('加载中...', {
              icon: 16,
              shade: 0.3,
              time: 0
            });
            commonService.Save({
              payload: [{
                "ItemName": "AnswerModel",
                "ItemValue": this.form1.AnswerModel
              }, {
                "ItemName": "IsChangeSwitch",
                "ItemValue": this.form1.IsChangeSwitch
              }, {
                "ItemName": "IsQuestionCountDown",
                "ItemValue": this.form1.IsQuestionCountDown
              }, {
                "ItemName": "StudentRemindTimeSetting",
                "ItemValue": this.form1.StudentRemindTimeSetting
              }, {
                "ItemName": "StudentRemindTimeLength",
                "ItemValue": parseInt(this.form1.StudentRemindTimeLength * 60)
              }, {
                "ItemName": "IsSeatingPlanEnabled",
                "ItemValue": this.form1.IsSeatingPlanEnabled
              }, {
                "ItemName": "AllowExamineSystemLoginBeginTime",
                "ItemValue": this.form1.AllowExamineSystemLoginTime[0]
              }, {
                "ItemName": "AllowExamineSystemLoginEndTime",
                "ItemValue": this.form1.AllowExamineSystemLoginTime[1]
              }, {
                "ItemName": "IsAllowToUseKeyBoardWhenExaming",
                "ItemValue": this.form1.IsAllowToUseKeyBoardWhenExaming
              }, {
                "ItemName": "IsExamingNeedCoursesOrder",
                "ItemValue": this.form1.IsExamingNeedCoursesOrder
              }]
            }).then((data) => {
              this.$layer.close(loading);
              if (data.ReturnEntity === 1) {
                this.$layer.msg('保存成功', {icon: 1, time: 3});
              } else {
                this.$layer.msg('当前时间段，不允许再修改设置。', {icon: 2, time: 3});
              }
            });
          }
        }
      },
      handleExamOpenModelChange(val) {
        if (val === 1) {
          this.form1.ExamCloseModel = "1";
        } else {
          this.form1.ExamCloseModel = "2";
        }
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
    margin: 20px 12px;
  }

  .exam-content .el-tabs__content {
    border: 1px solid #e6e6e6;
    border-top: 0;
    background: #fff;
    padding: 0 15px;
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

  .setting-list {
    margin: 0 20px;
    padding: 0;
  }

  .setting-list li {
    padding: 30px 0;
    border-bottom: 1px solid #e6e6e6;
  }

  .setting-list li:last-child {
    border-bottom: none;
  }

  .child-radio {
    margin-left: 20px !important;
  }

  .child-radio-right {
    margin-left: 250px !important;
  }

  .setting-content {
    margin-top: 10px;
  }

  .setting-footer {
    text-align: center;
    margin-top: 20px;
  }

  .setting-error {
    color: #fd3131;
  }

  [v-cloak] {
    display: none;
  }

  .el-time-range-picker__body.el-time-panel__content {
    height: 192px;
  }

  .el-time-panel__content {
    height: 190px;
  }

  .breadcrumb {
    padding: 20px 0 0 12px;
  }
</style>
