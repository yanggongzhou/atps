<style>
  .taskTableBox td.ivu-table-expanded-cell{
    padding: 5px 50px;
  }
  .user-show{
    display: inline-block;
  }
  .user-del-icon{
    color: #ff0505;
    margin-bottom: 2px;
    margin-right: 6px;
  }
  .user-del-icon:hover{
    color: #d4e9ff;
    background: #cc3627;
    border-radius: 2px;
  }
  .user-manager-icon{
    color: #728d90;
    font-size: 16px;
    margin-bottom: 2px;
    margin-right: 6px;
  }
</style>
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">模拟器申请</span>
    </div>
    <div v-if="initVisible">
      <!--<keep-alive>-->
      <task v-if="taskShow"></task>
      <project v-if="!taskShow"></project>
      <!--</keep-alive>-->
    </div>
 </div>
</template>
<script>
  import task from './task'
  import project from './project'
  export default {
    components: {
      task,
      project
    },
    data () {
      return {
        initVisible:false,
        taskShow:true,
      }
    },
    watch:{
      $route(val) {
        this.nameWatch();
      },
    },
    mounted(){
      this.nameWatch();
    },
    methods: {
      //功能非功能判断
      nameWatch(){
        if(this.$route.query.type==='1'){
          this.initVisible=true;
          this.taskShow=true;
        }else if(this.$route.query.type=='2'){
          this.initVisible=true;
          this.taskShow=false;
        }
      },
    }
  }
</script>
