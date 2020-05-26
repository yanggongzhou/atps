<style scoped>
  .sceneEditBox{
    padding: 10px 20px 20px 20px;
  }
  .scene-radio{
    height: 32px;
    line-height: 32px;
  }
  .scene-content1{
    padding: 0 20px;
  }
  .scene-content{
    padding: 20px 20px 0 20px;
  }
  .scene-title{
    background: #515a6e;
    padding: 7px 15px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-radius: 2px;
    letter-spacing: 2px;
  }
  .scene-add{
    border: 1px dashed #999;
    padding: 6px;
    text-align: center;
    border-radius: 5px;
    background-color: #eef1ef;
  }
  .scene-add:hover{
    cursor: pointer;
    background-color: #c9c9ca;
    transition: all .5s;
  }
</style>
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">延迟时间配置</span>
    </div>
    <Row :gutter="20" class="scene-content1">
      <i-col :span="16" style="min-width: 670px">
        <Card class="mt20">
          <span slot="title" class="scene-title">延迟时间策略</span>
          <RadioGroup class="scene-radio" v-model="delayPolicy" @on-change="policyChange">
            <Radio class="mr10" size="large" v-for="(val,ind) in scenePolicyData" :key="ind+'策略'" :label="val.code">
              <!--<Icon type="ios-at"></Icon>-->
              <span>{{val.name}}</span>
            </Radio>
          </RadioGroup>
        </Card>
      </i-col>
      <i-col :span="8" style="min-width: 220px">
        <Card class="mt20">
          <span slot="title" class="scene-title">系统默认延迟时间</span>
          <InputNumber class="w100" :min="0" v-model="defaultDelay"  :formatter="value => `${value}ms`"
                        :parser="value => value.replace('ms', '')"></InputNumber>
        </Card>
      </i-col>
      <i-col class="scene-content" :span="24">
        <Card v-if="tableVisible">
          <span slot="title" class="scene-title">策略数据</span>
          <Table
            class="tableBox"
            stripe
            border
            :loading="tableLoading"
            :columns="tableColumns"
            :data="tableData">
            <template slot="delay" slot-scope="{row,index}">
              <InputNumber class="w100" :min="0"
                           v-model="tableData[index].delay"
                           :formatter="value => `${value}ms`"
                           :parser="value => value.replace('ms', '')"></InputNumber>
              <!--<Input v-model="tableData[index].delay" type="number"/>-->
            </template>
            <template slot="noList" slot-scope="{row,index}">
              <Input v-model="tableData[index].noList"/>
            </template>
            <template slot="isEnabled" slot-scope="{row,index}">
              <i-switch v-model="tableData[index].isEnabled" size="large">
                <span slot="open">{{$global.sceneListState[0].label}}</span>
                <span slot="close">{{$global.sceneListState[1].label}}</span>
              </i-switch>
            </template>
          </Table>
          <div class="scene-add" v-if="!tableLoading" @click="addBtn">
            <Icon type="md-add" />  新增
          </div>
        </Card>
      </i-col>
    </Row>
    <div class="clearfix sceneEditBox"  v-if="!tableLoading">
      <Button class="left mr10"  @click="cancelBtn">重置</Button>
      <Button class="left" :loading="isLoading" type="primary" @click="saveBtn">保存</Button>
    </div>
  </div>
</template>
<script>
  import {requestServices} from '../../api/api.js'
  export default {
    data () {
      return {
        sceneId:'',
        delayPolicy: 2,
        delayPolicyCopy: 2,
        defaultDelay:200,
        isLoading:false,
        scenePolicyData:[],
        //列表数据
        tableVisible:false,
        tableColumns: [
          {
            type: 'index',
            width: 50,
            align: 'center'
          },
          {
            title: '延迟时间',
            slot:'delay',
            align: 'center',
            minWidth:120,
            maxWidth:180,
          },
          {
            title: '交易码',
            slot: 'noList',
            align: 'center',
            tooltip:true,
            minWidth:200,
          },
          {
            title: '状态',
            slot: 'isEnabled',
            align: 'center',
            minWidth:100,
            width:120,
          },
          {
            title: '操作',
            width:120,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delBtn(params)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ],
        tableData: [],
        tableData2:[],
        tableData3:[],
        tableData4:[],
        //弹框
        tableLoading:false,//列表数据加载
      }
    },
    props:{
      instanceItem:Object,
    },
    computed:{
      isInstanceId(){
        return this.$store.state.isInstanceId
      }
    },
    watch:{
      isInstanceId() {
        this.getScenePage();
      },
    },
    mounted(){
      //根据策略改变表头
      let _label = this.$global.scenePolicy[this.delayPolicy].label;
      this.tableColumns[2].title = _label;
      this.tableVisible = this.$global.scenePolicy[this.delayPolicy].visible;
      //获取策略状态码
      let val;
      for (val in this.$global.scenePolicy){
        this.scenePolicyData.push({code:parseInt(val),name:this.$global.scenePolicy[val].name})
      }

      let self = this;

      setTimeout(function () {
        self.getScenePage();
      },300);
    },
    methods: {
      //获取策略及其列表数据
      getScenePage(){
        let self = this;
        this.tableLoading=true;
        requestServices.scenePage(this.instanceItem.confId)
          .then(res=>{
            this.sceneId = res.scene.id;
            this.delayPolicy = res.scene.delayPolicy;
            this.delayPolicyCopy = res.scene.delayPolicy;

            this.defaultDelay = res.scene.defaultDelay;
            this.tableData2 = res.txCodeSceneLists;
            this.tableData3 = res.sysNoSceneLists;
            this.tableData4 = res.secNoSceneLists;
            let _delayPolicyArry =Object.keys(this.$global.scenePolicy);

            this.tableVisible = this.$global.scenePolicy[this.delayPolicy].visible;
            if(res.scene.delayPolicy===parseInt(_delayPolicyArry[1])){
              self.tableColumns[2].title = self.$global.scenePolicy[self.delayPolicy].label;
              this.tableData = this.tableData2;
            }else if(res.scene.delayPolicy===parseInt(_delayPolicyArry[2])){
              this.tableData = this.tableData3;
              self.tableColumns[2].title = self.$global.scenePolicy[self.delayPolicy].label;
            }else if(res.scene.delayPolicy===parseInt(_delayPolicyArry[3])){
              this.tableData = this.tableData4;
              self.tableColumns[2].title = self.$global.scenePolicy[self.delayPolicy].label;
            }else{
              this.tableData =[];
              self.tableVisible=false;
            }
            this.tableLoading=false;
          });
      },

      //延迟策略切换
      policyChange(val){
        //把各个策略对应的列表数据缓存在本页面
        let _delayPolicyArry =Object.keys(this.$global.scenePolicy);
        if(this.delayPolicyCopy===parseInt(_delayPolicyArry[1])){
          this.tableData2 = this.tableData;
        }else if(this.delayPolicyCopy===parseInt(_delayPolicyArry[2])){
          this.tableData3 = this.tableData;
        }else if(this.delayPolicyCopy===parseInt(_delayPolicyArry[3])){
          this.tableData4 = this.tableData;
        }else{}
        //把备份策略刷新
        this.delayPolicyCopy = val;
        //刷新数据列表
        this.tableData =[];
        if(val===parseInt(_delayPolicyArry[1])){
          this.tableData = this.tableData2;
        }else if(val===parseInt(_delayPolicyArry[2])){
          this.tableData = this.tableData3;
        }else if(val===parseInt(_delayPolicyArry[3])){
          this.tableData = this.tableData4;
        }
        let _label = this.$global.scenePolicy[this.delayPolicy].label;
        this.tableColumns[2].title = _label
        this.tableVisible = this.$global.scenePolicy[this.delayPolicy].visible;
      },
      //新增
      addBtn(){
        let self = this;
        this.tableData.push(
          {
            sceneId:self.sceneId,
            delay:self.defaultDelay,
            noList:'',
            isEnabled:true,
            delayPolicy:self.delayPolicy,
          }
        )
      },
      //删除一行
      delBtn(params){
        this.tableData.splice(params.index,1);
      },
      //保存
      saveBtn(){
        let self = this;
        self.isLoading=true;
        let aab = setTimeout(function () {
          self.isLoading = false
        },1000)
        requestServices.scenePolicyUpdate({
          id:this.sceneId,
          confId:this.instanceItem.confId,
          delayPolicy: this.delayPolicy,
          defaultDelay:this.defaultDelay,
          sceneLists:this.tableData
        }).then((res)=>{
            if(res.code===0){
              self.$Message.success('修改成功！');
              self.getScenePage();
              self.isLoading=false;
              clearTimeout(aab);
            }
          })
      },
      //重置
      cancelBtn(){
        this.getScenePage();
      }
    }
  }
</script>

