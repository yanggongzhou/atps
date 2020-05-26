<style>
  .log-title{
    background: #515a6e;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-radius: 2px;
    letter-spacing: 2px;
    display: inline-block;
    height: 32px;
  }
  /*.log-content{*/
    /*position: relative;*/
    /*background: #e6eef7;*/
    /*padding: 30px;*/
    /*min-height: 350px;*/
    /*!*max-height: 850px;*!*/
    /*line-height: 22px;*/
  /*}*/
  .log-content2{
    position: relative;
    top: -10px;
    padding: 0 10px 10px 10px;
    text-align: right;
  }
  .content-refresh{
    position: relative;
    top: 33px;
    right: 0;
    z-index: 100;
  }
  .logRadioBox .ivu-radio-group-button,
  .logRadioBox .ivu-radio-wrapper{
    font-weight: 600;
  }
  .logRadioBox .ivu-radio-wrapper-checked:hover{
    border-color: #2d8cf0;
    box-shadow: none;
    color: white;
    font-weight: 600;
  }
  .logRadioBox .ivu-radio-group-button,
  .logRadioBox .ivu-radio-wrapper-checked{
    border-color: #2d8cf0;
    background: #2d8cf0;
    color: white;
    font-weight: 600;
  }
</style>
<template>
  <div class="h100">
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">日志监控</span>
    </div>
    <div  class="p10">
      <span class="log-title">当前日志级别</span>
      <RadioGroup class="logRadioBox" v-model="logType" type="button" @on-change="radioChange">
        <Radio label="error"></Radio>
        <Radio label="warn"></Radio>
        <Radio label="info"></Radio>
        <Radio label="debug"></Radio>
        <Radio label="trace"></Radio>
      </RadioGroup>
    </div>
   <div class="log-content2">
     <Button class="content-refresh" type="primary" icon="md-refresh" @click="getPtssLog" :loading="isLoading"></Button>
     <Input v-model="content" type="textarea" :rows="4" :autosize="{ minRows: 10, maxRows: 20}" />
   </div>

    <!--<div class="log-content">-->
      <!--<Button class="content-refresh" type="primary" icon="md-refresh" @click="getPtssLog"></Button>-->
      <!--<p v-html="content"></p>-->
    <!--</div>-->
  </div>
</template>
<script>
  import {requestServices} from '../../api/api'
  export default{
    data(){
      return{
        logType:"",
        logTypeCopy:'',
        content:'',
        timer:false,
        isLoading:false,
      }
    },
    mounted(){
      let self = this;
      setTimeout(function () {
        self.getLogLevel();
      },500);
    },
    computed:{
      isInstanceId(){
        return this.$store.state.isInstanceId
      }
    },
    watch:{
      isInstanceId() {
        this.content="";
        this.getLogLevel();
      },
//      logType(newVal,oldVal){
//        if(!this.timer){
//          this.timer = true;
//          let self = this;
//          setTimeout(function(){
//            self.getLogLevel();
//            self.timer = false
//          },500)
//        }
//      },

    },
    methods:{
      getLogLevel(){
        requestServices.logLevel(this.$store.state.instanceId)
          .then(res=>{
            if(res.code===0){
              this.logType=res.level;
              this.logTypeCopy=res.level;
            }
          })
      },
      radioChange(){
        this.$Modal.confirm({
          title:'提示',
          content:'是否切换当前实例的日志级别？',
          onOk:()=>{
            this.getUpdateLevel();
          },
          onCancel:()=>{
            this.logType=this.logTypeCopy;
            this.$Message.info('已取消切换！')
          }
        })
      },
      getUpdateLevel(){
        let formData = new FormData();
        formData.append('id',this.$store.state.instanceId);
        formData.append('level',this.logType);
        requestServices.updateLevel(formData)
          .then(res=>{
          if(res.code===0){
            this.$Message.success('日志级别已更新！');
            this.logType=res.level;
          }
        });
        if(!this.timer){
          this.timer = true;
          let self = this;
          setTimeout(function(){
            self.getLogLevel();
            self.timer = false
          },500)
        }
      },
      getPtssLog(){
        let self = this;
        self.isLoading=true;
        let aab = setTimeout(function () {
          self.isLoading = false
        },1000)
        requestServices.ptssLog(this.$store.state.instanceId)
          .then(res=>{
            if(res.code===0){
              this.content = res.content;
//              this.content = res.content.replace(/\n/g,"<br/>");
              this.$Message.success('日志内容已更新！')
              self.isLoading=false;
              clearTimeout(aab);
            }
          })
      },
    }
  }
</script>
