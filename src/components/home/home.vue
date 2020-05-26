<style>
  .container{
    background: #f5f7f9;
    border-radius: 4px;
    position: absolute;
    top:40px;
    height: calc(100% - 40px);
    width: 100%;
  }
  .right-box{
    width: calc(100% - 180px);
  }
  .right-content{
    min-height: 480px;
    margin: 15px;
    box-shadow: 0 0 10px #95a8b1;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
    padding: 15px;
    min-width: 760px;
  }
  .headerV{
    position: fixed!important;
    min-width: 1220px!important;
    z-index: 1000!important;
  }
  .headerV .ivu-menu-horizontal{
    line-height: 40px !important;
  }
  .headerV .h_menu,
  .headerBox .h_menu{
    font-family: 'Microsoft YaHei' !important;
    margin: 0 auto !important;
    padding-left: 0 !important;
    float: none !important;
    background: none !important;
    width: auto !important;
    position: absolute !important;
    left: 130px !important;
    min-width: 900px !important;
  }
  .header .h_menu > li a, .headerBox .h_menu >li a{
    font-size: 1.1em !important;
  }
  .header .h_menu li[data-v-c5f8cc78]{
    padding:0 8px;
    box-shadow: 0 0 8px #9393c3;
  }
</style>
<template>
  <div>
    <headerNode class="headerV" :apptype="apptype"></headerNode>
    <!--<header-local class="headerV"></header-local>-->
    <div class="container clearfix">
      <nav-bar></nav-bar>
      <div class="right-box right">
        <div class="right-content">
          <!--<keep-alive>-->
            <router-view></router-view>
          <!--</keep-alive>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import headerNode from 'header'
//  import headerLocal from './header.vue'
  import nav from './nav'
  export default {
    data () {
      return {
        caseSettingStyle:false,
        apptype:'app27'//'app27'--测试，'app23'--生产
      }
    },
    mounted(){

    },
    components:{
      'nav-bar': nav,
//      'header-local':headerLocal,
      headerNode
    },
    methods: {

    }
  }
</script>
