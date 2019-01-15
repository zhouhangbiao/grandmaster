<template>
  <div>
    <el-container v-cloak>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <ExamDetail></ExamDetail>
        <el-main>模拟数据</el-main>
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
  import Header from './layout/Header.vue'
  import Footer from './layout/Footer.vue'
  import ExamDetail from './ExamDetail.vue'
  export default {
    name: 'MockData',
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
    components: {Header, Footer, ExamDetail},
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
