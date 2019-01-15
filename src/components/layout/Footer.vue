<template>
  <div v-cloak>
    <div class="footer">
      <div>{{copyrightInformation}}</div>
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
        copyrightInformation: '版权信息：' + window.localStorage.CopyrightInformation || '版权信息：江西省南昌市考试院2018'
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
    methods: {}
  }
</script>
<style lang="scss" scoped>
  @import '../../scss/global.scss';

  .footer {
    width: 100%;
    height: 40px;
    position: fixed;
    background: #edeff0;
    bottom: 0;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }
</style>
