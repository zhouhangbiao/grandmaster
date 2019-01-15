<template>
  <div v-cloak class="finish-wrap">
    <div>
      <img :src="systemLogo" class="logo" align="middle">
      <span class="systemName">{{systemName}}</span>
    </div>
    <div class="login">
      <div class="SystemTerminalName text-c">{{systemTerminalName}}</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="name">
          <el-input v-model="ruleForm.name" prefix-icon="el-icon-circle-check-outline"></el-input>
        </el-form-item>
        <el-form-item prop="region">
          <el-input v-model="ruleForm.region" prefix-icon="el-icon-goods"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
    </div>
  </div>
</template>
<script>
  import * as commonServices from '../mock/commonServices'
  import encrypt from "../utils/encrypt";
  import Header from './layout/Header.vue'
  let secretKey = '';
  export default {
    name: 'Login',
    data() {
      return {
        collapsed: false,
        examSceneId: '',
        systemName: '',
        systemLogo: '',
        systemTerminalName: '',
        copyrightInformation: '',
        ruleForm: {
          name: '',
          region: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    watch: {},
    computed: {},
    created() {
    },
    components: {Header},
    mounted() {
      this.getSystemConfig();
      this.getExamType()
    },
    activated() {
    },
    methods: {
      /**
       * 设置cookie
       */
      setUserInfoStorage(userTrueName, serverDateTime) {
        localStorage.setItem('ServerDateTime', serverDateTime);
        localStorage.setItem('SystemName', this.systemName);
        localStorage.setItem('systemLogo', this.systemLogo);
        localStorage.setItem('SystemTerminalName', this.systemTerminalName);
        localStorage.setItem('CopyrightInformation', this.copyrightInformation);
        localStorage.setItem('UserTrueName', userTrueName);
      },
      /**
       * 获取系统配置信息
       */
      getSystemConfig() {
        commonServices.GetSystemConfig({
          payload: {}
        }).then(data => {
          this.systemName = data.ReturnEntity.SystemName,
            this.systemLogo = data.ReturnEntity.SystemLogo,
            this.systemTerminalName = data.ReturnEntity.SystemTerminalName,
            this.copyrightInformation = data.ReturnEntity.CopyrightInformation
        })
      },
      /**
       * 登陆
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getSecretKey(this.ruleForm.name);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      /**
       * 获取考试模式
       */
      getExamType() {
        commonServices.GetExamType({
          payload: {}
        }).then(data => {
          localStorage.setItem('ExamSceneId', data.ReturnEntity);
        })
      },
      /**
       * 获取密匙
       * @param valid form表单值 用户名 密码
       */
      getSecretKey(valid) {
        commonServices.GetSecretKey({
          payload: {"userName": valid}
        }).then(data => {
          secretKey = data.ReturnEntity.SecretKey || secretKey;
          this.login(secretKey)
        })
      },
      /**
       * 登录接口
       * @param secretKey;
       */
      login(secretKey) {
        let loading = this.$layer.msg('登录中...', {
          icon: 16,
          shade: 0.3,
          time: 0
        });
        commonServices.Login({
          payload: {
            "UserName": this.ruleForm.name,
            "Password": encrypt.encryptByTripleDES(encrypt.encryptByMD5(this.ruleForm.region), secretKey)
          }
        }).then(data => {
          this.$layer.close(loading);
          if (data.ReturnEntity && data.ReturnEntity.LoginState === 1) {
            this.getExamType();
            this.setUserInfoStorage(data.ReturnEntity.UserTrueName, data.ReturnEntity.ServerDateTime)
            this.$router.push('/Announcement');
          } else {
            this.$layer.msg('用户名或密码错误', {icon: 2, time: 2});
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '../scss/global.scss';

  .finish-wrap {
    background-color: #1383f2;
    height: 100%;
    position: fixed;
    width: 100%;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .systemName {
    line-height: 60px;
    color: $white;
    font-size: 20px;
    vertical-align: middle;
  }

  .login {
    width: 400px;
    height: 320px;
    background: $white;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -160px;
    padding: 0 20px;
    .SystemTerminalName {
      height: 90px;
      line-height: 90px;
      font-weight: bold;
    }
    .el-button--primary {
      width: 100%;
      font-size: 16px;
    }
  }
</style>
