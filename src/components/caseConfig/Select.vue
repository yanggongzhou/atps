<style>
  .instanceSelectBox{
    position: absolute;
    top: 18px;
    right: 30px;
    z-index: 20;
    padding: 3px 10px;
    background-color: #6e6e6f;
    border-radius: 3px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    width: 600px;
    /*margin-bottom: 10px;*/
    text-align: center;
    box-shadow: 3px 3px 10px #8c9298;
  }
  .instance-label{
    margin-right: 10px;
    letter-spacing: 2px
  }
  .instance-select{
    width: 300px;
    text-align: center;
  }

</style>
<template>
  <div>
    <div class="instanceSelectBox">
    <span class="instance-label">
   <Icon style="font-size: 30px" type="ios-cog-outline" />
      模拟器实例
    </span>
      <Badge :type="badgeObj.type" :text="badgeObj.text" :title="badgeObj.title">
        <Select
          filterable
          class="instance-select"
          v-model="instanceId"
          @on-change="instanceIdChange">
          <Option
            v-for="(val,ind) in instanceData"
            :key="ind+'实例'"
            :value="val.id"
            :label="val.chsName+' '+val.ip+' '+val.userName">
            <span>{{val.chsName}}</span>
            <span>{{val.userName}}</span>
            <span>{{val.ip}}</span>
            <span>{{$global.instanceState[val.state]}}</span>
          </Option>
        </Select>
      </Badge>
      <!--输入框小点显示启动状态-->
      <span>
        <Button type="info" size="small" @click="getInstanceRefresh" :disabled="isStartDisable">刷新</Button>
        <Button type="success" size="small" @click="getInstanceStart" :disabled="startState">启动</Button>
        <Button type="error" size="small" @click="getInstanceStop" :disabled="isStartDisable">停止</Button>
      </span>
    </div>
    <router-view
      v-if="!errorMsgVisible"
      @upadteInstanceList="getArgsInstanceList"
      :instanceItem="instanceItem"
    ></router-view>
    <div style="    text-align: center;
    font-size: 30px;
    height: 500px;
    line-height: 500px;" v-if="errorMsgVisible">
      当前没有可配置模拟器实例......
    </div>
  </div>
</template>
<script>
  import {requestServices} from '../../api/api'
  export default{
    data(){
      return{
        routerType:'',//路由参数
        errorMsgVisible:false,
        instanceId:'',//实例instanceId
        instanceData:[],
        instanceItem:{},
        isStartDisable:true,//操作机器启动状态
        startState:false,
        badgeObj:{},
        badgeStart:{
          type:'success',
          text:' ',
          title:'该实例已开始运行'
        },
        badgeStartLoading:{
          type:'warning',
          text:' ',
          title:'实例启动中'
        },
        badgeStop:{
          type:'error',
          text:' ',
          title:'该实例已停止运行'
        },
        badgeBad:{
          type:'normal',
          text:' ',
          title:'实例状态未知'
        },
      }
    },
    watch:{
      $route() {
        this.routerType= this.$route.query.type;
      },
      routerType(){
        let self =this;
        this.startState = true;
        this.isStartDisable=true;
        this.badgeObj=this.badgeBad;
        requestServices.instanceList({
          type:parseInt(this.$route.query.type)
        }).then(res=>{
          this.instanceData= res.page.rows;
          if(res.page.rows.length===0){
            this.errorMsgVisible = true;
          }else{
            this.$store.commit('newInstanceId',this.instanceData[0].id);
            this.instanceItem = this.instanceData[0];
            this.instanceId = this.instanceData[0].id;
            this.getInstanceIsStart(self.instanceData[0].id);
          }
        })
      }
    },
    created(){
      this.getInstanceList();
    },
    mounted(){
      let self =this;
      this.timer = setInterval(function () {
        self.getInstanceIsStart(self.$store.state.instanceId);
      },60000)
    },
    destroyed(){
      clearInterval(this.timer)
    },
    methods:{
      //实例启动
      getInstanceStart(){
        let self = this;
        if(!this.instanceId){
          this.$Message.success('暂未选中模拟器实例！');
          return false;
        }
        this.startState = true;
        this.isStartDisable=true;
        this.badgeObj=this.badgeBad;
        requestServices.instanceStart(this.instanceId)
          .then((res)=>{
            if(res.code===0){
              this.judgeState(res);
              this.$Message.success('启动命令已执行！');
            }
          })
      },
      //实例停止
      getInstanceStop(){
        let self = this;
        if(!this.instanceId){
          this.$Message.success('暂未选中模拟器实例！');
          return false;
        }
        this.$Modal.confirm({
          title:'提示',
          content:'是否停止运行该模拟器实例？',
          onOk:()=>{
            this.startState = true;
            this.isStartDisable=true;
            this.badgeObj=this.badgeBad;
            requestServices.instanceStop(self.instanceId)
              .then((res)=>{
                if(res.code===0){
                  this.judgeState(res);
                  self.$Message.success('停止命令已执行！');
                }
              })
          },
          onCancel:()=>{
            self.$Message.info('已取消操作！')
          }
        })
      },
      //实例刷新
      getInstanceRefresh(){
        if(!this.instanceId){
          this.$Message.success('暂未选中模拟器实例！');
          return false;
        }
        this.startState = true;
        this.isStartDisable=true;
        this.badgeObj=this.badgeBad;
        requestServices.instanceRefresh(this.instanceId)
          .then((res)=>{
            if(res.code===0){
              this.judgeState(res);
              this.$Message.success('刷新命令已执行！');
            }
          })
      },
      //实例是否启动
      getInstanceIsStart(val){
        this.startState = true;
        this.isStartDisable=true;
        this.badgeObj=this.badgeBad;
        if(!val){return false}
        requestServices.instanceIsStart(val)
          .then((res)=>{
            this.judgeState(res);
          })
      },
      //判断状态
      judgeState(res){
        if(res.isStart===0){
          this.badgeObj=this.badgeStart;
          this.startState = true;
          this.isStartDisable=false;
        }else if(res.isStart===1){
          this.badgeObj=this.badgeStop;
          this.startState = false;
          this.isStartDisable=true;
        }else if(res.isStart===2){
          this.badgeObj=this.badgeStartLoading;
          this.startState = true;
          this.isStartDisable=true;
        }else{
          this.startState = true;
          this.isStartDisable=true;
          this.badgeObj=this.badgeBad;
        }
      },
      getArgsInstanceList(){
        let self =this;
        requestServices.instanceList({
          type:parseInt(this.$route.query.type)
        }).then(res=>{
            this.instanceData= res.page.rows;
            this.instanceData.forEach(value=>{
              if(value.id===self.instanceId){
                self.instanceItem = value;
              }
            });
            self.instanceItem.argsAgain=true;
          })
      },
      getInstanceList(){
        let self =this;
        this.startState = true;
        this.isStartDisable=true;
        this.badgeObj=this.badgeBad;
        requestServices.instanceList({
          type:parseInt(this.$route.query.type)
        }).then(res=>{
            this.instanceData= res.page.rows;
            if(res.page.rows.length===0){
              this.errorMsgVisible = true;
              return false
            }
            if(this.$store.state.instanceId){
              this.instanceId = this.$store.state.instanceId;
              this.getInstanceIsStart(self.$store.state.instanceId);
              this.instanceData.forEach(value=>{
                if(value.id===self.$store.state.instanceId){
                  self.instanceItem = value;
                }
              })
            }else{
              this.$store.commit('newInstanceId',this.instanceData[0].id);
              this.instanceItem = this.instanceData[0];
              this.instanceId = this.instanceData[0].id;
              this.getInstanceIsStart(self.instanceData[0].id);
            }
          })
      },
      instanceIdChange(val){
        let self = this;
        this.$store.commit('newInstanceId',val);
//        this.bus.$emit('update',val)
        this.instanceData.forEach(value=>{
          if(value.id===val){
//            this.$store.commit('newInstanceAdapter',value.adapterType);
//            this.$store.commit('newInstanceItem',value);
            self.instanceItem = value;
          }
        });
        this.getInstanceIsStart(val);
      }
    }
  }
</script>
