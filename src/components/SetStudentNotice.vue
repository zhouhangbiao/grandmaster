<template>
  <div>
    <el-container v-cloak>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <ExamDetail></ExamDetail>
        <el-main>
          <div class="clearfix">
            <el-breadcrumb separator="/" class="fl" style="line-height: 60px;margin-left: 15px">
              <el-breadcrumb-item>系统设置</el-breadcrumb-item>
              <el-breadcrumb-item>设置考生须知</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class="fr changeBtn" :disabled="changeDisabled" type="primary" size="small"
                       @click="dialogVisible = true">修改
            </el-button>
          </div>
          <div class="studentContent" v-html="content" v-if="hasData===true"></div>
          <div class="noData" v-else="hasData===false">暂无数据</div>
          <el-dialog
            title="设置考生须知"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose">
            <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px"
                     class="demo-ruleForm">
              <el-form-item label="内容" prop="a_content">
                <div class="edit_container">
                  <quill-editor v-model="ruleForm2.a_content"
                                :content="content"
                                ref="myQuillEditor"
                                @change="onEditorChange($event)"
                                @focus="onEditorFocus($event)"
                  >
                  </quill-editor>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary" @click="saveSubmitForm('ruleForm2')">保存</el-button>
                <el-button size="mini" @click="canCleDialog('ruleForm2')">取消</el-button>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
  </span>
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
  import {quillEditor} from 'vue-quill-editor'
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  import ExamDetail from './ExamDetail.vue'
  export default {
    name: 'SetStudentNotice',
    data() {
      let fulltext = (rule, value, callback) => {
        console.log(rule);
        if (!value) {
          return callback(new Error('请填写考生须知'));
        } else if (this.editorValue.length > 2000) {
          alert('不能输入大于2000字符')
        }
        callback()
      };
      return {
        isCollapse: true,
        openeds: [1, 2, 3, '4'],
        uniqueOpened: false,
        content: '',
        isTimeout: '',
        dialogVisible: false,
        ruleForm2: {
          a_content: '',
        },
        rules2: {
          a_content: [
            {validator: fulltext, required: true, message: '请修改考生须知', trigger: 'blur'}
          ]
        },
        editorValue: '',
        hasData: true,
        changeDisabled: false
      }
    },
    watch: {},
    computed: {},
    created() {
    },
    components: {Header, Footer, ExamDetail, quillEditor},
    mounted() {
      this.toggle();
      this.GetNoticeToStudent()
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
      handleClose(done) {
        done();
        this.dialogVisible = false
      },
      /**
       * 考生须知内容
       */
      GetNoticeToStudent() {
        commonServices.GetNoticeToStudent({
          payload: {}
        }).then((data) => {
          if (data.ReturnEntity.AnnouncementContent) {
            this.hasData = true;
            this.changeDisabled = false;
            this.content = data.ReturnEntity.AnnouncementContent;
            this.isTimeout = data.ReturnEntity.IsTimeout
          } else {
            this.hasData = false;
            this.changeDisabled = true;
          }
        });
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
       * 新增暂存提交
       */
      saveSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.studentPublish();
            this.dialogVisible = false
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 保存
       */
      studentPublish() {
        let loading = this.$layer.msg('加载中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        commonServices.SaveNoticeToStudent({
          payload: {
            NoticeContent: this.editorValue
          }
        }).then((data) => {
          this.$layer.close(loading);
          if (data.ReturnEntity === 1) {
            this.dialogVisible = false;
            this.GetNoticeToStudent();
            this.$layer.msg('保存成功', {icon: 1, time: 1, shade: 0.3});
          } else {
            this.$layer.msg('保存失败', {icon: 2, time: 1, shade: 0.3});
          }
        });
      },
      /**
       * 富文本获得焦点事件
       */
      onEditorFocus(value) {
        value = this.content
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
</style>
<style>
  .changeBtn {
    margin: 12px 12px 0 0;
  }

  .studentContent {
    width: 100%;
    height: 100%;
  }

  .studentContent p {
    display: block;
    margin-left: 12px;
  }

  .noData {
    text-align: center;
    margin-top: 200px;
  }
  [v-cloak] {
    display: none;
  }
</style>
