<template>
  <div v-cloak>
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="22">
          <div class="grid-content bg-purple">
            <div>
              <img :src="systemLogo" class="headerLogo" align="middle">
              <span class="headerSystemName">{{systemName}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">管理员
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" split-button>
                <el-dropdown-item class="exit" command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import * as commonServices from '../../mock/commonServices'
  import UrlHelper from "js-url-helper";

  const urlHelper = new UrlHelper(location);
  export default {
    name: 'Header',
    data() {
      return {
        systemLogo: localStorage.SystemLogo,
        systemName: localStorage.SystemName,
        terminalName: localStorage.TerminalName,
        userTrueName: localStorage.UserTrueName,
      }
    },
    watch: {},
    computed: {},
    created() {
    },
    mounted() {
    },
    activated() {
    },
    methods: {
      /**
       * 触发登出弹框
       */
      handleCommand(command) {
        if (command === 'logout') {
          this.logout()
        }
      },
      /**
       * 登出
       */
      logout() {
        const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('span', null, '是否退出当前登录')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(action => {
          let loading = this.$layer.msg('正在退出登录...', {
            icon: 16,
            shade: 0.3,
            time: 0
          });
          commonServices.LogOut({
            payload: {}
          }).then(data => {
            this.$layer.close(loading);
            if (data.ReturnEntity === 1) {
              this.$layer.msg('退出成功', {icon: 1, time: 1000}, () => {
                urlHelper.jump({
                  path: '/Content/login.html'
                });
              });
            } else {
              this.$layer.msg('退出失败', {icon: 2, time: 1000}, () => {
              })
            }
          });
        }).catch(() => {
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import '../../scss/global.scss';

  .header {
    background: #1383f2;
    height: 48px;
    line-height: 48px;
    .headerLogo {
      width: 48px;
      height: 48px;
      vertical-align: top;
    }
    .headerSystemName {
      line-height: 48px;
      color: $white;
      font-size: 16px;
      vertical-align: middle;
    }
    .el-dropdown-link {
      color: white;
      text-align: right;
    }
  }

  .el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .exit {
    padding: 4px 15px;
    top: 0
  }
</style>
<style>
  .el-header {
    height: 0;
    border-bottom: 1px solid #e6e6e6;
  }

  .header .el-col-2 {
    text-align: right;
  }
</style>
