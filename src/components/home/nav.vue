<style>
  .layout-ceiling-main a{
    color: #9ba7b5;
  }
  .layout-hide-text .layout-text{
    display: none;
  }
  .left-nav{
    display: flex;
    background: #4b5869;
    width: 180px;
    position: fixed;
    height: 100%;
    z-index: 100;
  }
  .left-sub-menu-item{
    padding-left: 30px !important;
  }
  .left-sub-menu .ivu-menu-submenu-title{
    padding: 10px !important;
    text-align: left;
    font-size: 14px;
    color: #ebf7f7 !important;
  }
  .left-sub-menu .ivu-menu-submenu-title-icon{
    right: 8px !important;
  }
  .layout-logo-left{
    width: 90%;
    background: #818a9c;
    border-radius: 3px;
    margin: 10px auto;
    color:#fff;
  }
  .left-nav-menu{
    overflow: scroll;
  }
  .left-nav-menu::-webkit-scrollbar
    {
      width: 2px;
      height:10px;
      background-color:#b5b1b1;
    }
  .left-nav-menu::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color:#515a6e;
  }
  .left-nav-menu::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color:#b5b1b1;
  }
</style>
<template>
  <div class="left-nav">
    <Menu class="left-nav-menu" @on-select="menuSelect" ref="menuNav" :active-name="activeName" :open-names="openNames" theme="dark" width="100%">
      <div class="layout-logo-left">
        <Dropdown :transfer="true" class="w100" @on-click="dropdownChange">
          <Button type="default" ghost long>
            <span v-if="dropdownSelected==='1'">非功能测试</span>
            <span v-if="dropdownSelected==='2'">功能测试</span>
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem name="1" :selected="dropdownSelected==='1'">非功能测试</DropdownItem>
            <DropdownItem name="2" :selected="dropdownSelected==='2'">功能测试</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Submenu
        class="left-sub-menu"
        v-for="(val,ind) in menus"
        :key="val.id"
        :name="val.path">
        <template slot="title">
          <Icon :type="val.icon"></Icon>
          <span class="layout-text">{{val.label}}</span>
        </template>
        <!--<router-link v-for="(value,index) in val.children" :key="value.id" :to="{name:value.path}">-->
          <!--<Menu-item-->
            <!--class="left-sub-menu-item"-->
            <!--:name="value.path">-->
            <!--<Icon :type="value.icon"></Icon>-->
            <!--·-->
            <!--<span class="layout-text">{{value.label}}</span>-->
          <!--</Menu-item>-->
        <!--</router-link>-->
        <!--<router-link v-for="(value,index) in val.children" :key="value.id" :to="{name:value.path}">-->
          <Menu-item
            v-for="(value,index) in val.children" :key="value.id"
            class="left-sub-menu-item"
            :name="value.path">
            <Icon :type="value.icon"></Icon>
            ·
            <span class="layout-text">{{value.label}}</span>
          </Menu-item>
        <!--</router-link>-->
      </Submenu>
      <div style="margin: 40px 0;"></div>
    </Menu>
  </div>
</template>
<script>
  import {auth} from '../../api/auth'
  import axios from 'axios'
  import global_ from 'header/global'
  import {requestServices} from '../../api/api'
  export default {
    data () {
      return {
        activeName:'',//菜单当前页面节点
        openNames:[],//需要展开的节点
        menus:[],
        dropdownSelected:'1',//当前选择的默认菜单
        isSuper:''
      }
    },
    created(){
      let userName = auth.getCookie("username")
      if(!userName){
        axios.get(global_.login2_url+'/api/checkLogin')
          .then(res=>{
            auth.setCookie('nickname',res.data.nickname,'h8');
            auth.setCookie('username',res.data.username,'h8');
            this.getMyAuth(res.data.username)
          })
      }else{
        this.getMyAuth(userName)
      }
    },
    mounted(){
      this.pageNav();
    },
    watch:{
      $route(to,from){
        this.pageNav();
      }
    },
    methods: {
      //功能非功能测试切换
      dropdownChange(val){
        this.dropdownSelected=val;
        this.$router.push({
          name:this.$route.name,
          query:{type:val}
        })
        if(this.isSuper===1){
          if(val==="1"){
            this.menus=this.$global.adminMenus;
          }else{
            this.menus=this.$global.adminMenusFt;
          }
        }else{
          if(val==="1"){
            this.menus=this.$global.managerMenus;
          }else{
            this.menus=this.$global.managerMenusFt;
          }
        }
      },
      //菜单选择跳转页面
      menuSelect(val){
//        let _query = this.$route.query;
        this.$router.push({
          name:val,
          query:{type:this.dropdownSelected}
        })
      },
      //获取当前权限角色
      getMyAuth(username){
        let self = this;
        requestServices.getUserPomissions({userId:username})
          .then(res=>{
            auth.setCookie('userId',res.userId,'h8');
            auth.setCookie('isSuper',res.isSuper,'h8');
            this.isSuper = res.isSuper;
            //设置默认菜单类型
            if(res.defaultType){
              this.dropdownSelected=String(res.defaultType);
            }
              this.$router.push({
                name:this.$route.name,
                query:{type:self.dropdownSelected}
              })
            //设置显示权限
            if(res.isSuper===1&&res.defaultType===1){
              self.menus=self.$global.adminMenus
            }else if(res.isSuper!==1&&res.defaultType===1){
              self.menus=self.$global.managerMenus;
            }else if(res.isSuper===1&&res.defaultType!==1){
              self.menus=self.$global.adminMenusFt
            }else{
              self.menus=self.$global.managerMenusFt
            }
            //更新菜单的展开与选中
            self.$nextTick(() => {
              self.$refs.menuNav.updateOpened();
              self.$refs.menuNav.updateActiveName();
            });
          })
      },
      //当前路由对应的导航
      pageNav(){
        let pathArr = this.$route.path.split('/');
        this.activeName = pathArr[pathArr.length-1];
        if(pathArr.length>=3){
          this.openNames.length=0;
          this.openNames.push(pathArr[1]);
          this.$nextTick(() => {
            this.$refs.menuNav.updateOpened();
            this.$refs.menuNav.updateActiveName();
          })
        }
      }
    }
  }
</script>
