<style>
  .uploadTip{
    color: #f90;
  }
  .content-save-btn .iconfont{
    font-size: 13px!important;
  }
  .splitBox{
    min-width: 800px;
    max-width: 1200px;
    margin: 0 auto;
    height: 400px;
    min-height: 400px;
    padding: 2px;
    /*border: .5px dashed #627284;*/
    background: #c2c5c7;
    border-radius: 3px;
  }

  .split-leftBox{
    min-width: 240px;
    height: 100%;
    border-radius: 3px;
    background: #ffffff;
  }
  .msg-item-title-error{
    min-width: 330px;
    text-align: center;
    height:100%;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-orient: vertical;
    font-size: 18px;
    font-weight: 600;
  }
  .msg-item-title{
    height: 40px;
    padding: 7px 10px;
    background: #515a6e;
    font-size: 14px;
    font-weight: bolder;
    line-height: 24px;
    color: #fcfdff;
    border-radius: 2px 2px 0 0;
  }
  .split-rightBox{
    min-width: 480px;
    height: 100%;
    background: #ffffff;
    margin-left: 6px;
  }
  .msg-radioBox{
    width: 100%;
    padding: 10px
  }
  .msg-radioBox .ivu-radio-wrapper{
    width: 100%;
    border: 1px solid transparent;
    border-radius: 3px!important;
  }
  .msg-radioBox .ivu-radio-group-button .ivu-radio-wrapper:after, .ivu-radio-group-button .ivu-radio-wrapper:before{
    display: none;
  }
  .msg-radioBox .ivu-radio-wrapper:first-child{
    border-radius: 0;
  }
  .msg-radioBox .ivu-radio-wrapper-checked {
    background: #abccef;
    border: 1px solid #2d8cf0;
    color: white;
    box-shadow:none;
  }
  .msg-radioBox .ivu-radio-focus{
    box-shadow: none!important;
  }
  .hcalc38{
    height: calc(100% - 38px);
    overflow: auto;
    background: #ccc;
  }
  .hcalc38::-webkit-scrollbar
  {
    width: 10px;
    height:10px;
    background-color:#b5b1b1;
  }
  .hcalc38::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color:#efefef;
  }
  .hcalc38::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color:#b5b1b1;
  }

  .uploadBox .ivu-upload-list {
    position: absolute;
    z-index: 20;
    background-color: #ffcb7d;
    opacity: 0.8;
    border-radius: 5px;
  }
  .msg-monaco{
    border-radius: 2px;
    overflow: hidden;
  }
  .msg-monaco-header{
    padding: 7px 20px;
    font-size: 14px;
    font-weight: bolder;
    line-height: 23px;
  }
  .msg-collapse{
    margin-bottom: 45px;
  }
  .msg-collapse .ivu-collapse-content{
    padding: 0;
  }
  .msg-collapse .ivu-collapse-content>.ivu-collapse-content-box{
    padding: 0;
  }
</style>
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">响应报文管理</span>
    </div>

    <!--文件&数据-->
    <div class="splitBox" :style="styleHeight">
      <Split @on-move-end="splitEnd" v-model="splitBoss" min="160px" max="220px">
        <div slot="left" class="split-leftBox">
          <div class="msg-item-title clearfix">
            <span class="left">交易文件</span>

            <!--<messageSearch class="right ml10"></messageSearch>-->
            <Button
              class="right ml10"
              size="small"
              type="default"
              @click="addBtn"
              ghost
              icon="md-add">新增</Button>
            <Button
              class="right ml10"
              size="small"
              type="default"
              @click="uploadBtn"
              ghost
              icon="ios-cloud-upload-outline">上传</Button>
            <messageSearch class="right" @copyTransOk="getFileList"></messageSearch>
          </div>
          <div class="hcalc38">
            <!--查询-->
            <Form
              :inline="true"
              :label-width="50"
              style=" min-width:220px;height: 44px;padding-top: 5px; "
              @submit.native.prevent>
              <FormItem label="筛选">
                <Input type="text" v-model="searchFileName" placeholder="输入文件名">
                <Icon slot="prefix" type="ios-search"></Icon>
                </Input>
              </FormItem>
            </Form>
            <Collapse v-model="value1" class="msg-collapse">
              <Panel name="1">
                <span>静态交易</span>
                <RadioGroup slot="content" class="msg-radioBox" v-model="radioMessageId" @on-change="getMessageContent" type="button" >
                  <Radio
                    v-for="(val,ind) in staData"
                    :key="ind+'文件2'"
                    :label="val.id">
                    <Icon color="" custom="iconfont bank-wenjian" ></Icon>
                    <span class="radioBox-text">{{val.tranCode}}</span>
                    <!--<Icon :size="14" @click.stop="editBtn(val)" type="md-create" ></Icon> 修改-->
                    <!--<Icon :size="14" @click="delBtn(val)" type="md-trash"></Icon> 删除-->
                    <Poptip
                      class="right"
                      :width="100"
                      placement="bottom-end">
                      <a href="javascript:void(0)">
                        <Icon :size="20" type="ios-settings" ></Icon>
                      </a>
                      <div slot="content">
                        <Button type="text" icon="md-create" @click.stop="editBtn(val)" long>修改</Button>
                        <br>
                        <Button type="text" icon="md-trash" @click.stop="delBtn(val)" long>删除</Button>
                      </div>
                    </Poptip>
                  </Radio>
                </RadioGroup>
              </Panel>
              <Panel name="2">
                <span>动态交易</span>
                <RadioGroup slot="content" class="msg-radioBox" @on-change="getMessageContent" v-model="radioMessageId" type="button" >
                  <Radio
                    class="clearfix"
                    v-for="(val,ind) in dynData"
                    :key="ind+'文件1'"
                    :label="val.id">
                    <Icon color="" custom=" iconfont bank-wenjian" ></Icon>
                    <span class="radioBox-text">{{val.tranCode}}</span>
                    <!--<Icon class="right" @click="delBtn(val)" custom=" iconfont bank-del" ></Icon>-->
                    <Poptip
                      class="right"
                      :width="100"
                      placement="bottom-end">
                      <a href="javascript:void(0)">
                        <Icon :size="20" type="ios-settings" ></Icon>
                      </a>
                      <div slot="content">
                        <Button type="text" icon="md-create" @click.stop="editBtn(val)" long>修改</Button>
                        <br>
                        <Button type="text" icon="md-trash" @click.stop="delBtn(val)" long>删除</Button>
                      </div>
                    </Poptip>
                  </Radio>
                </RadioGroup>
              </Panel>
            </Collapse>
          </div>
        </div>
        <div slot="right" class="split-rightBox">
          <div v-show="showNull" class="msg-item-title-error">
            <p>暂无数据</p>
          </div>
          <div class="h100" v-if="!showNull">
            <div v-show="tabsDisabled" class="msg-item-title-error">
              <p>数据加载中...</p>
              <Button loading shape="circle"></Button>
            </div>
            <div v-show="!tabsDisabled">
              <div class="msg-item-title clearfix">
              <span>
                <Icon type="md-document"/>
                交易报文{{tranCode}}
              </span>
                <span class="msg-monaco-header">
                <Select v-model="Mylanguage" style="width: 66px;" size="small" @on-change="languageChange">
                  <Option
                    v-for="item in languageOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </Option>
                 </Select>
                <Button
                  class="content-save-btn"
                  @click="contentSaveBtn"
                  size="small"
                  ghost
                  :loading="contentSaveLoading"
                  icon=" bank-save iconfont"
                  type="default">
                  保存报文</Button>
              </span>
                <messageRule class="right" :messageId="radioMessageId" :dynConf="dynConf" @updateFileList="getFileList"></messageRule>
              </div>

              <MyEditor
                ref="dialogtree"
                class="msg-monaco"
                :Mheight="monacoHeight"
                :theme="'hc-black'"
                :language="Mylanguage"
                :codes="msgConfig"
                @onMounted="xmlOnMounted"
                @onCodeChange="xmlOnCodeChange" />
            </div>
          </div>

        </div>
      </Split>
    </div>
    <!--上传响应文件-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">上传响应文件</div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <FormItem label="文件选择">
          <Upload
            multiple
            action="Hi:HowAreYou!"
            :default-file-list="defaultList"
            :on-remove="removeFile"
            type="drag"
            :before-upload="handleUpload">
            <div>
              <Icon type="ios-cloud-upload" size="24" style="color: #3399ff"></Icon>
              <p class="uploadTip">*支持上传.dat  .txt  .xml,可多选拖拽上传</p>
            </div>
            </Input>
          </Upload>
        </FormItem>
        <FormItem label="" prop="isOver">
          <Checkbox v-model="formValidate.isOver">覆盖已有交易报文</Checkbox>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="formVisible=false">取消</Button>
        <Button type="primary" :loading="saveLoading" icon="ios-paper-plane-outline" @click="uploadSaveBtn('formValidate')">确定</Button>
      </div>
    </Modal>
    <!--新增修改交易码-->
    <Modal
      class="ModalBox"
      v-model="tranCodeVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">编辑交易文件</div>
      <Form ref="tranCodeValidate" :model="tranCodeValidate" :rules="ruleTranCode" :label-width="80" @submit.native.prevent>
        <FormItem label="交易码" prop="tranCode">
          <Input type="text" v-model="tranCodeValidate.tranCode" placeholder="输入交易码"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="tranCodeVisible=false">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="saveBtn('tranCodeValidate')">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import {requestServices} from '../../../api/api.js'
  import messageRule from './message-rule.vue'
  import messageSearch from './message-search.vue'
  import MyEditor from '../../home/monaco'
  import {auth} from '../../../api/auth'
  export default {
    components:{
      MyEditor,
      messageRule,
      messageSearch
    },
    data () {
      return {
        tranCodeVisible:false,
        tranCodeValidate:{
          tranCode:'',
        },
        ruleTranCode:{
          tranCode:[
            { required: true, message: '请输入交易码', trigger: 'blur' },
          ]
        },
        value1:'1',
        tabsDisabled:true,
        showNull:true,

        xmlEditor:null,
        monacoHeight:'400px',

        //查询
        searchFileName:'',
        //列表数据
        splitBoss: 0.4,
        resultData:{},//静态动态的所有数据，为了过滤而存在的数据暂存栈
        staData:[],//静态数据
        dynData:[],//动态数据
        radioMessageId:null,//文件id
        tranCode:'',//交易码名称
        dynConf:'',//动态规则

        msgConfig:'',//交易码内容
        Mylanguage:'xml',
        languageOption:[
          {
            value:'xml',
            label:'XML'
          },
          {
            value:'json',
            label:'JSON'
          }
        ],
        themeOption:[
          {
            value:'vs',
            label:'默认'
          },
          {
            value:'hc-black',
            label:'高亮'
          },
          {
            value:'vs-dark',
            label:'深色'
          },
        ],

        screenHeight: window.screen.availHeight,//当前屏幕的可见区域的高度
        styleHeight:'',
        timer:false,
        //弹框
        formVisible:false,//编辑表单显示
        formValidate:{
          isdyn:2,//静态2，动态是1
          isOver:true,
        },
        defaultList:[],
        fileList:[],
        fileData:new FormData(),
        ruleForm:{},
        saveLoading:false,//表单提交加载
        contentSaveLoading:false,
      }
    },
    props:{
      instanceItem:Object,
    },
    computed:{
      isInstanceId(){
        return this.$store.state.isInstanceId
      },
    },
    watch:{
      isInstanceId() {
        this.getFileList();
      },
      screenHeight(val){
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if(!this.timer){
          // 一旦监听到的screenHeight值改变，就将其重新赋给data里的screenHeight
          this.screenHeight = val
          this.timer = true
          let that = this
          setTimeout(function(){
            // 打印screenHeight变化的值
//            console.log(that.screenHeight)
            that.styleHeight = 'height:'+(that.screenHeight-222)+'px';
            //message-rule的高度
            that.monacoHeight = (that.screenHeight-268)+'px';
            that.$nextTick(function () {
              that.$refs.dialogtree.initEditor();
            })
            that.timer = false
          },400)
        }
      },
      searchFileName(){
        let that = this;
        setTimeout(function(){
          that.getFilterFile();
          that.timer = false
        },300)
      },
    },
    mounted(){
      let self = this
      this.styleHeight = 'height:'+(this.screenHeight-222)+'px';
      window.onresize = () => {
        return (() => {
          self.screenHeight = window.screen.availHeight;
        })()
      };
      this.monacoHeight = (this.screenHeight-268)+'px';

      setTimeout(function () {
//        self.$nextTick(function () {
//          self.$refs.dialogtree.initEditor();
//        });
        self.getFileList();
        self.$refs.dialogtree.initEditor();
      },300);

    },
    methods: {
      //拖拽结束
      splitEnd(){
        this.$refs.dialogtree.initEditor();
      },
      languageChange(val){
        let self =this;
        this.$nextTick(function () {
          self.$refs.dialogtree.initEditor();
        });
      },
      themeChange(val){
        let self =this;
        this.$nextTick(function () {
          self.$refs.dialogtree.initEditor();
        });
      },
      xmlOnMounted(edit){
        this.xmlEditor = edit;
      },
      xmlOnCodeChange(value,event){
        this.msgConfig=value;
      },

      //过滤
      getFilterFile(){
        let self = this;
        //先恢复原数据再过滤
        this.staData = this.resultData.staList;
        this.dynData = this.resultData.dynList;
        this.staData= this.staData.filter(val=>{
          return val.tranCode.includes(self.searchFileName)
        });
        this.dynData = this.dynData.filter(val=>{
          return val.tranCode.includes(self.searchFileName)
        });
      },
      //获取列表
      getFileList(bol){
        let self =this;
        this.radioMessageId = '';
        requestServices.messageList(this.instanceItem.confId)
          .then(res=>{
            this.resultData = res;
            this.staData=res.staList;
            this.dynData=res.dynList;
            if(this.staData.length===0&&this.dynData.length===0){
              this.showNull = true;
            }else{
              this.showNull = false;
            }
            if(bol){
              let _radioMessageId = auth.getCookie('radioMessageId');
              if(_radioMessageId){
                self.radioMessageId =parseInt(_radioMessageId);
                self.staData.forEach((val)=>{
                  if(val.id===self.radioMessageId){
                    self.getMessageContent(self.radioMessageId);
                    self.dynConf=val.dynConf;
                    self.tranCode = val.tranCode;
                    return false;
                  }
                });
                self.dynData.forEach((val)=>{
                  if(val.id===self.radioMessageId){
                    self.getMessageContent(self.radioMessageId);
                    self.dynConf=val.dynConf;
                    self.tranCode = val.tranCode;
                    return false;
                  }
                });
                return false;
              }
              return false;
            }
            if(res.staList.length!==0){
              self.radioMessageId = res.staList[0].id;
              self.getMessageContent(self.radioMessageId);
              self.staData.forEach((val)=>{
                if(val.id===self.radioMessageId){
                  self.dynConf=val.dynConf;
                  self.tranCode = val.tranCode;
                  return false;
                }
              });
              return false;
            }
            if(res.dynList.length!==0){
              self.radioMessageId = res.dynList[0].id
              self.getMessageContent(self.radioMessageId);
              self.dynData.forEach((val)=>{
                if(val.id===self.radioMessageId){
                  self.dynConf=val.dynConf;
                  self.tranCode = val.tranCode;
                  return false;
                }
              });
              return false;
            }
          })
      },
      //获取文件信息
      getMessageContent(value){
        auth.setCookie('radioMessageId',value,'h8');
        let self = this;
        this.tabsDisabled = true;
        this.msgConfig='';
        requestServices.getContent(value)
          .then(res=>{
            this.msgConfig=res.content;
            this.tabsDisabled = false;
            this.$refs.dialogtree.monacoEditor.setValue(res.content);
            this.$nextTick(function () {
              self.$refs.dialogtree.initEditor();
            });
          });
        self.staData.forEach((val)=>{
          if(val.id===value){
            self.dynConf=val.dynConf;
            self.tranCode = val.tranCode;
            return false;
          }
        });
        self.dynData.forEach((val)=>{
          if(val.id===value){
            self.dynConf=val.dynConf;
            self.tranCode = val.tranCode;
            return false;
          }
        });
//        console.log(self.dynConf)
      },
      //保存文本
      contentSaveBtn(){
        let self = this;
        this.contentSaveLoading=true;
        let aab = setTimeout(function () {
          self.contentSaveLoading = false
        },1000);
        requestServices.updateContent({
          id:this.radioMessageId,
          content:this.msgConfig
        }).then(res=>{
            if(res.code===0){
              self.$Message.success('保存成功！')
              self.getMessageContent(self.radioMessageId);
              self.contentSaveLoading = false;
              clearTimeout(aab);
            }
          })
      },
      //上传按钮
      uploadBtn(){
        this.saveLoading=false;
        this.formVisible=true;
        this.defaultList=[];
        this.fileList=[];
        this.formValidate={
          isdyn:2,
          isOver:true,
        };
        this.fileData=new FormData();
      },
      //移除文件
      removeFile(file,fileList){
        this.fileList.splice(this.fileList.indexOf(file),1);
      },
      //选择文件
      handleUpload(file){
        const _M5 = file.size<5242881;
        var hzArr = file.name.split('.');
        const _dat = hzArr[hzArr.length-1]==='dat';
        const _text = file.type==="text/plain";
        const _xml = file.type==="text/xml";
        if(!_text&&!_xml&&!_dat){
          this.$Message.warning({
            content:'请上传xml、dat、txt类型文件',
            duration: 3
          });
          return false;
        }
        if(!_M5){
          this.$Message.warning({
            content:'文件大小限制在5M以内',
            duration: 3
          });
          return false;
        }
        this.fileData.append('fileList',file)
        this.fileList.push(file);
//        this.defaultList.push({size:file.size,name:file.name});
        this.defaultList.push(file);
        return false;//终止自动上传
      },
      //保存
      uploadSaveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(self.fileList.length===0){
              self.$Message.error("请上传文件！")
              return false
            }
            self.saveLoading=true;
            let aab = setTimeout(function () {
              self.saveLoading = false
            },1000);
//            this.fileData.append("fileList",self.fileList);
            this.fileData.append("confId",self.instanceItem.confId);
            this.fileData.append("isdyn",self.formValidate.isdyn);
            this.fileData.append("isOver",self.formValidate.isOver);
            requestServices.messageUpload(this.fileData)
              .then(res=>{
                self.saveLoading=false;
              if(res.code===0){
                self.formVisible=false;
                self.$Message.success('上传成功！')
                self.getFileList(true);
                clearTimeout(aab);
              }
            })
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      },
      //新增
      addBtn(){
        this.tranCodeVisible=true;
        this.$refs.tranCodeValidate.resetFields();
        this.tranCodeValidate={
          tranCode:'',
        }
      },
      //修改
      editBtn(val){
        this.tranCodeVisible=true;
        this.$refs.tranCodeValidate.resetFields();
        this.tranCodeValidate.id=val.id;
        this.tranCodeValidate.tranCode=val.tranCode;
      },
      //删除
      delBtn(val){
        let self = this;
        let _content = '是否删除'+val.tranCode+'文件';
          this.$Modal.confirm({
            title:'提示',
            content:_content,
            onOk:()=>{
              requestServices.messageDelete({ids:[val.id]})
                .then(res=>{
                  if(res.code===0){
                    self.$Message.success('已删除！')
                    self.getFileList();
                    self.msgConfig='';
                  }
                })
            },
            onCancel:()=>{
              self.$Message.info('删除已取消！')
            }
          })
      },
      saveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.saveLoading=true;
            let aab = setTimeout(function () {
              self.saveLoading = false
            },1000);
            if(self.tranCodeValidate.id){
              requestServices.tranCodeUpdate(self.tranCodeValidate)
                .then(res=>{
                  if(res.code===0){
                    self.$Message.success('修改成功！');
                    self.tranCodeVisible=false;
                    self.saveLoading=false;
                    clearTimeout(aab);
                    self.getFileList(true);
                  }
                })
            }else{
              requestServices.tranCodeSave({
                confId:self.instanceItem.confId,
                isdyn:parseInt(Object.keys(self.$global.messageIsDyn)[1]),
                tranCode:self.tranCodeValidate.tranCode
              }).then(res=>{
                if(res.code===0){
                  self.$Message.success('添加成功！');
                  self.tranCodeVisible=false;
                  self.saveLoading=false;
                  clearTimeout(aab);
                  self.getFileList(true);
                }
              })
            }
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      },
    }
  }
</script>
