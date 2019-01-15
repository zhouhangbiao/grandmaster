<template>
  <div>
    <el-container v-cloak>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <ExamDetail></ExamDetail>
        <el-main>
          <div class="newAdd clearfix">
            <div class="fl announcement">公告</div>
            <div class="fr">
              <el-button type="primary newAddBtn" @click="dialogVisible = true">新增</el-button>
            </div>
          </div>
          <div class="table">
            <el-table
              element-loading-text="加载中..."
              :data="Announcement"
              :row-style="tableRowStyle"
              :header-cell-style="tableHeaderColor"
              height="500"
              size="mini"
              row-class-name="tableRow"
              class="spHeight"
              empty-text="暂无数据"
              style="width: 100%">
              <el-table-column
                prop="AnnouncementTitle"
                label="标题">
                <template slot-scope="scope">
                  <div @click="getTitle(scope.row)">{{scope.row.AnnouncementTitle}}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="PublishTime"
                label="发布时间">
              </el-table-column>
              <el-table-column
                :formatter="typeFormat"
                prop='ExamRoomRead'
                label="阅读情况">
                <template slot-scope="scope">
                  <div @click="getReading(scope.row,scope.$index)"><strong style="color: #1383f2">{{scope.row.ExamRoomRead}}</strong>/<strong>{{scope.row.ExamRoomTotal}}</strong>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :formatter="statusFormat"
                prop="IsPublished"
                label="状态">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope" v-if="scope.row.IsPublished===1">
                  <el-button @click="dialogVisible = true" type="text" size="small">
                    修改
                  </el-button>
                  <el-button type="text" size="small" @click="publishEvent=true">发布</el-button>
                  <el-button type="text" size="small" @click="deleteEvent=true">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block clearfix">
            <span class="fl reveal">显示{{merge}}</span>
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :pager-count="5"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="AnnouncementTotal">
            </el-pagination>
          </div>
        </el-main>
      </el-container>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
    <div>
    </div>
    <el-dialog
      title="新增公告"
      :visible.sync="dialogVisible"
      @close='closeDialog("ruleForm2")'
      width="60%"
      :before-close="handleClose">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
        <el-form-item label="公告标题" prop="age">
          <el-input v-model.number="ruleForm2.age" ref="inputValue"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="a_content">
          <div class="edit_container">
            <quill-editor v-model="ruleForm2.a_content"
                          ref="myQuillEditor"
                          @change="onEditorChange($event)"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="submitForm('ruleForm2')">发布</el-button>
          <el-button size="mini" type="primary" @click="saveSubmitForm('ruleForm2')">暂存</el-button>
          <el-button size="mini" @click="canCleDialog('ruleForm2')">取消</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
    <el-dialog
      title="查看阅读情况"
      :visible.sync="reading"
      width="50%"
      class="reading"
      :before-close="handleClose">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="已读" name="first">
          <el-table
            :data="AnnouncementReadInfoList"
            height="500"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="CityName"
              label="区域"
              width="200">
            </el-table-column>
            <el-table-column
              prop="SchoolCode"
              label="考点代码"
              width="150">
            </el-table-column>
            <el-table-column
              prop="SchoolName"
              label="考点名称"
              width="250">
            </el-table-column>
            <el-table-column
              prop="RoomName"
              label="机房名称"
              width="150">
            </el-table-column>
          </el-table>
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="grid-content bg-purple fl reveal">显示{{dialogMerge}}</div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple">
                <el-pagination
                  @size-change="readingSizeChange"
                  @current-change="readingCurrentChange"
                  :current-page="dialogPageIndex"
                  :pager-count="5"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="dialogPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="RecordTotal">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="未读" name="second">
          <el-table
            :data="AnnouncementReadInfoList"
            height="500"
            border
            style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column
              prop="CityName"
              label="区域"
              width="200">
            </el-table-column>
            <el-table-column
              prop="SchoolCode"
              label="考点代码"
              width="150">
            </el-table-column>
            <el-table-column
              prop="SchoolName"
              label="考点名称"
              width="250">
            </el-table-column>
            <el-table-column
              prop="RoomName"
              label="机房名称"
              width="150">
            </el-table-column>
          </el-table>
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="grid-content bg-purple fl reveal">显示{{dialogMerge}}</div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple">
                <el-pagination
                  @size-change="readingSizeChange"
                  @current-change="readingCurrentChange"
                  :current-page="dialogPageIndex"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="dialogPageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="RecordTotal">
                </el-pagination>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <span class="readSituation">阅读情况 : {{ExamRoomRead}}/{{ExamRoomTotal}}</span>
      <span slot="footer" class="dialog-footer clearfix">
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="publishEvent"
      width="30%"
      :before-close="handleClose">
      <span>确定要发布吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="publishEvent = false">取 消</el-button>
    <el-button type="primary" @click="publish">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="deleteEvent"
      width="30%"
      :before-close="handleClose">
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteEvent = false">取 消</el-button>
    <el-button type="primary" @click="isDelete">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import * as noticeServices from '../mock/noticeServices'
  import {quillEditor} from 'vue-quill-editor'
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  import ExamDetail from './ExamDetail.vue'
  import editor from './editor.vue'
  export default {
    name: 'Announcement',
    data() {
      let checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请填写公告标题'));
        } else if (value.length > 100) {
          alert('不能输入大于100字符')
        }
        callback()
      };
      let fulltext = (rule, value, callback) => {
        console.log(rule);
        if (!value) {
          return callback(new Error('请填写公告标题1'));
        } else if (this.editorValue.length > 2000) {
          alert('不能输入大于2000字符')
        }
        callback()
      };
      return {
        pageIndex: 1,
        pageSize: 10,
        dialogPageIndex: 1,
        dialogPageSize: 10,
        Announcement: [],
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
        currentPage1: 1,
        merge: '',
        dialogMerge: '',
        dialogVisible: false,
        ruleForm2: {
          pass: '',
          checkPass: '',
          age: '',
          a_content: '',
          editorOption: {}
        },
        rules2: {
          age: [
            {validator: checkAge, required: true, trigger: 'blur', message: '请输入公告标题',}
          ],
          a_content: [
            {validator: fulltext, required: true, message: '请输入详细内容', trigger: 'blur'}
          ]
        },
        content: null,
        editorValue: '',
        IsPublished: '',
        getA: false,
        row: '',
        AnnouncementTitle: '',
        PublishTime: '',
        reading: false,
        activeName2: 'first',
        AnnouncementReadInfoList: [],
        ExamRoomRead: '',
        ExamRoomTotal: '',
        RecordTotal: '',
        currentPage: 1,
        publishEvent: false,
        deleteEvent: false,
        AnnouncementTotal: 0
      }
    },
    watch: {},
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    created() {
      this.merge = (this.pageIndex - 1) * this.pageSize + 1 + "-" + this.pageIndex * this.pageSize;
      this.dialogMerge = (this.dialogPageIndex - 1) * this.dialogPageSize + 1 + "-" + this.dialogPageIndex * this.dialogPageSize
    },
    components: {Header, Footer, ExamDetail, quillEditor, editor},
    mounted() {
      this.toggle();
      this.getList();
      this.GetSchoolReadList();
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
      /**
       * dialog右上角 x 关闭按钮
       */
      handleClose(done) {
        done();
        this.dialogVisible = false
      },
      /**
       * dialog关闭清除验证条件
       */
      closeDialog(formRule) {
        this.$refs[formRule].resetFields();
      },
      /**
       * 修改逻辑
       */
      changeClick(row) {
        console.log(row);
      },
      /**
       * 获取公告列表
       */
      getList() {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3
        });
        noticeServices.GetList({
          payload: {
            "PageIndex": this.pageIndex,
            "PageSize": this.pageSize
          }
        }).then(data => {
          this.$layer.close(loading);
          this.Announcement = data.ReturnEntity.AnnouncementInfo;
          this.AnnouncementTotal = data.ReturnEntity.AnnouncementTotal;
        })
      },
      /**
       * 点击第几页回调
       * @param val
       */
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.merge = (this.pageIndex - 1) * this.pageSize + 1 + "-" + this.pageIndex * this.pageSize;
        this.getList()
      },
      /**
       * 点击每页显示数量回调
       * @param val
       */
      handleSizeChange(val) {
        this.pageSize = val;
        this.merge = (this.pageIndex - 1) * this.pageSize + 1 + "-" + this.pageIndex * this.pageSize;
        this.getList()
      },
      /**
       * 点击阅读情况弹窗分页第几页回调
       * @param val
       */
      readingCurrentChange(val) {
        this.dialogPageIndex = val;
        this.dialogMerge = (this.dialogPageIndex - 1) * this.dialogPageSize + 1 + "-" + this.dialogPageIndex * this.dialogPageSize;
        this.GetSchoolReadList()
      },
      /**
       * 点击阅读情况弹窗分页每页显示数量回调
       * @param val
       */
      readingSizeChange(val) {
        this.dialogPageSize = val;
        this.dialogMerge = (this.dialogPageIndex - 1) * this.dialogPageSize + 1 + "-" + this.dialogPageIndex * this.dialogPageSize;
        this.GetSchoolReadList()
      },
      /**
       * 列表单元格式化
       */
      typeFormat(row, column, cellValue, index) {
        return row.ExamRoomRead + "/" + row.ExamRoomTotal;
      },
      /**
       * 状态格式化
       */
      statusFormat(row, column, cellValue, index) {
        this.IsPublished = cellValue;
        if (row.IsPublished === 0) {
          return '已发布'
        } else if (row.IsPublished === 1) {
          return '暂存'
        }
      },
      /**
       * 新增发布提交
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.publish();
            this.dialogVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 新增暂存提交
       */
      saveSubmitForm(formName) {
        console.log(this.$refs.inputValue.value);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.publish();
            this.dialogVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 模态框
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /**
       * -富文本回调
       */
      onEditorReady(editor) {
        console.log(editor.root.innerText);
      },
      /**
       * 模态框取消回调
       */
      canCleDialog(formRule) {
        this.$refs[formRule].resetFields();
        this.dialogVisible = false
      },
      /**
       * 获取富文本内容
       */
      onEditorChange(value) {//内容改变事件
        console.log(value.text);
        this.editorValue = value.text;
      },
      /**
       * 点击标题内容弹窗
       */
      getTitle(row) {
        console.log(row);
        this.AnnouncementTitle = row.AnnouncementTitle;
        this.PublishTime = row.PublishTime;
        this.$alert(row.AnnouncementTitle + '<br/>' + row.PublishTime + '<br/>' + '公告内容', '查看公告', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        }).then(() => {
          // 点击确认
        }, () => {
          // 点击取消 ----- 加入这部分就可以了
        });
      },
      /**
       * 点击阅读情况弹窗
       */
      getReading(row,index) {
        this.reading = true
      },
      /**
       * 点击阅读情况tab
       */
      handleClick(tab, event) {
        let tabId = event.target.getAttribute('id');
        console.log(event.target.getAttribute('id')); //获取到当前元素的id
        if (tabId === 'tab-first') {
          this.GetSchoolReadList()
        } else if (tabId === 'tab-second') {
          this.GetSchoolReadList()
        }
      },
      /**
       * 点击阅读情况列表接口
       */
      GetSchoolReadList() {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        noticeServices.GetSchoolReadList({
          payload: {
            "AnnouncementId": "",//公告Id
            "IsRead": 1,//1 已读，2 未读
            "PageIndex": this.dialogPageIndex,
            "PageSize": this.dialogPageSize
          }
        }).then(data => {
          this.$layer.close(loading);
          this.AnnouncementReadInfoList = data.ReturnEntity.AnnouncementReadInfoList;
          this.ExamRoomRead = data.ReturnEntity.ExamRoomRead;
          this.ExamRoomTotal = data.ReturnEntity.ExamRoomTotal;
          this.RecordTotal = data.ReturnEntity.RecordTotal;
        })
      },
      /**
       * 发布
       */
      publish() {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        noticeServices.Publish({
          payload: {
            "AnnouncementId": ''
          }
        }).then((data) => {
          this.$layer.close(loading);
          if (data.ResultType !== 1) {
            return;
          }
          if (data.ReturnEntity === 1) {
            this.publishEvent = false;
            this.$layer.msg('发布成功', {icon: 1, time: 1, shade: 0.3}, () => {
              this.getList();
            });
          } else {
            this.$layer.msg('发布失败', {icon: 2, time: 1, shade: 0.3});
          }
        });
      },
      /**
       * 删除
       */
      isDelete() {
        let loading = this.$layer.msg('删除中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        noticeServices.Delete({
          payload: {
            "AnnouncementId": ''
          }
        }).then(data => {
          this.$layer.close(loading);
          if (data.ReturnEntity === 1) {
            this.deleteEvent = false;
            this.$layer.msg('删除成功', {icon: 1, time: 1, shade: 0.3}, () => {
              this.getList();
            });
          } else {
            this.$layer.msg('删除失败', {icon: 2, time: 1, shade: 0.3});
          }
        })
      },
      /**
       *
       * 新增暂存接口
       */
      Save() {
        let loading = layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        noticeServices.Save({
          payload: {
            "AnnouncementId": '',
            "AnnouncementTitle": this.$refs.inputValue.value,
            "AnnouncementContent": this.editorValue,
            "OperationType": ''
          }
        }).then((data) => {
          this.$layer.close(loading);
          if (data.ResultType !== 1) {
            return;
          }
          if (data.ReturnEntity.SaveState === 1) {
            this.getList();
            this.$layer.msg('保存成功', {icon: 1, time: 3});
            this.dialogVisible = false
          }
          else {
            this.$layer.msg('保存失败', {icon: 2, time: 3});
          }
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../scss/global.scss';

  .el-header {
    height: 50px !important;
  }

  .el-main {
    padding: 20px 12px 16px 16px;
  }

  .newAdd {
    .announcement {
      color: $color-1a;
      font-size: $font-16;
    }
    .newAddBtn {
      width: 60px;
      height: 32px;
      font-size: $font-14;
      color: $white;
      vertical-align: middle;
      padding: 0;
    }
  }

  .table {
    margin-top: 16px;
    border: 1px solid #e6e6e6;
  }

  .has-gutter tr {
    background: #edeff0;
  }

  .el-pagination {
    margin-top: 16px;
    font-size: $font-14;
  }

  .reveal {
    font-size: $font-14;
    color: $color-4d;
    line-height: $line-height-32;
    margin-top: 16px;
  }
</style>
<style>
  .tableRow {
    height: 40px;
    line-height: 40px;
  }

  .el-button--text {
    color: #1383f2;
  }

  .el-button--text:last-child {
    color: #fd3131;
  }

  .el-pagination:first-child {
    float: left;
  }

  .el-pagination:nth-child(2) {
    float: right !important;
  }

  .el-table__body tr {
    color: #4d4d4d;
    height: 40px;
  }

  .el-table__row {
    height: 40px;
    line-height: 40px;
  }

  .spHeight td, .spHeight th {
    padding: 0 !important;
    height: 40px;
    line-height: 40px;
  }

  .ql-container {
    height: 300px;
  }

  .el-dialog__body {
    padding: 0 30px 10px 10px;
  }

  .el-form-item__content button {
    float: right;
    margin-left: 10px;
  }

  .vl-notify.vl-notify-msg, .vl-notify.vl-notify-tips {
    z-index: 10000;
  }

  .el-dialog__footer {
    padding-bottom: 0;
    padding-top: 0;
    height: 50px;
  }

  .reading {

  }

  .reading .el-dialog {
    padding: 10px 0 10px 20px;
  }

  .reading .el-dialog__header {
    padding: 0 10px 20px 10px;
  }

  .reading .el-tabs__header {
    float: left;
    margin-bottom: 0;
  }

  .reading .el-tabs__content {
    width: 100%;
  }

  .reading .el-tabs__item {
    width: 88px;
    height: 36px;
    text-align: center;
  }

  .reading .el-tabs__item.is-active {
    background: #edeff0;
  }

  .readSituation {
    position: absolute;
    right: 30px;
    top: 62px;
  }
</style>
