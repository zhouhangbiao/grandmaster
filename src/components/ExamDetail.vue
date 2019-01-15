<template>
  <div>
    <el-menu collapse-transition
             mode="vertical"
             class="el-menu-vertical-demo"
             @open="handleOpen"
             @close="handleClose"
             :collapse="isCollapse"
             background-color="#edeff0"
             text-color="#4d4d4d"
             active-text-color="#1a1a1a"
             router :default-active="$route.path"
             :default-openeds="['1','2','3','4']">
      <el-menu-item index="" class="isCollapse" @click="toggle">
        <i class="el-icon-menu"></i>
      </el-menu-item>
      <el-menu-item index="/">
        <i class="el-icon-date"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/Announcement">
        <i class="el-icon-menu"></i>
        <span slot="title">公告</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">考试数据包管理</span>
        </template>
        <!-- <el-menu-item index="/MockData">模拟数据</el-menu-item>-->
        <el-menu-item index="/FormalData">正式数据</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location-outline"></i>
          <span slot="title">考试监控</span>
        </template>
        <el-menu-item index="/AuthorizationCodeManage">授权码管理</el-menu-item>
        <el-menu-item index="/DownloadControl">下载数据监控</el-menu-item>
        <el-menu-item index="/UpDownloadControl">上传数据监控</el-menu-item>
        <el-menu-item index="/WrongTopicUpload">错题上传处理</el-menu-item>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">系统设置</span>
        </template>
        <el-menu-item index="/Setting">统一设置</el-menu-item>
        <el-menu-item index="/SetStudentNotice">设置考生须知</el-menu-item>
      </el-submenu>
    </el-menu>
    <div>
    </div>
  </div>
</template>
<script>
  import * as commonServices from '../mock/commonServices'
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  export default {
    name: 'examDetail',
    data() {
      return {
        isCollapse: true,
        openeds: [1, 2, 3, '4'],
        uniqueOpened: false
      }
    },
    watch: {},
    computed: {},
    created() {
    },
    components: {Header, Footer},
    mounted() {
      this.toggle()
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
    min-height: 880px;
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
  }

  .el-submenu li, .announcement {
    height: 56px;
    padding: 0;
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
  .el-menu-item[data-v-27d3db80], .el-submenu li[data-v-27d3db80], .announcement[data-v-27d3db80], .el-menu-item, .el-submenu__title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e6e6e6;
  }

  .el-submenu.is-active .el-submenu__title {
    border-bottom-color: #e6e6e6;
  }
</style>
