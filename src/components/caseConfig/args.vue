<style>
  .editform{
    background-color: #515a6e;
    text-align: center;
    color: #fff;
    font-weight: 600;
    letter-spacing: 2px;
    box-shadow: 0 3px 9px #808EA4;
    border-radius: 3px;
    padding: 10px;
    height: 40px;
    line-height: 20px;
    font-size: 15px;
  }
  .content-item{
    background: #f9fcff;
    padding: 20px 30px 10px 30px;
    border-radius: 2px;
    box-shadow: 3px 3px 10px #8c9298;
  }
  .AgreementBox{
    max-width: 800px;
    margin: 0 auto;
  }
  .save-btn .iconfont{
    font-size: 13px!important;
  }
  .secBox{
    max-width: 800px;
    margin: 20px auto ;
  }
  .iconState:hover{
    cursor: pointer;
    color: #95b3d2;
  }
  .nInstall{
    color: #ff8259;
  }
</style>
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">实例参数配置</span>
    </div>
    <!--http-->
    <div class="AgreementBox" v-if="httpFormVisible">
      <div class="editform">
        <span>HTTP</span>
        <span style="font-size: 12px">(超文本传输协议)</span>
        <Button :disabled="authorVisible" class="ml20" icon="md-repeat" size="small" @click="resetForm('http')">重置</Button>
        <Button :disabled="authorVisible" class="save-btn" @click="saveAgreement('httpForm')" :loading="saveAgreementLoading" size="small" icon=" bank-save iconfont">保存</Button>
      </div>
      <div class="content-item">
        <Form ref="httpForm" :model="httpForm" :rules="httpRules" :label-width="100" @submit.native.prevent>
          <Row :gutter="20">
            <i-col :span="8">
              <FormItem label="端口号" prop="serverPort">
                <Input :disabled="authorVisible" v-model="httpForm.serverPort" number placeholder="请输入端口号"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="最小线程数" prop="minThread">
                <Input :disabled="authorVisible" v-model="httpForm.minThread" number placeholder="请输入最小线程数"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="最大线程数" prop="maxThread">
                <Input :disabled="authorVisible" v-model="httpForm.maxThread" number placeholder="请输入最大线程数"/>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </div>
    <!--tcp-->
    <div class="AgreementBox" v-if="tcpFormVisible">
      <div class="editform">
        <span>TCP</span>
        <span style="font-size: 12px">(传输控制协议)</span>
        <Button :disabled="authorVisible" class="ml20" icon="md-repeat" size="small" @click="resetForm('tcp')">重置</Button>
        <Button :disabled="authorVisible" class="save-btn" @click="saveAgreement('tcpForm')" :loading="saveAgreementLoading" size="small" icon=" bank-save iconfont">保存</Button>
      </div>
      <div class="content-item">
        <Form ref="tcpForm" :model="tcpForm" :rules="tcpRules" :label-width="100" @submit.native.prevent>
          <Row :gutter="20">
            <i-col :span="8">
              <FormItem label="端口号" prop="serverPort">
                <Input :disabled="authorVisible" v-model="tcpForm.serverPort" number placeholder="端口号之间用,分隔"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="处理线程数" prop="dealThreadCnt">
                <Input :disabled="authorVisible" v-model="tcpForm.dealThreadCnt" number placeholder="请输入线程数"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="对端地址" prop="retIpPorts">
                <Input :disabled="authorVisible" v-model="tcpForm.retIpPorts" number placeholder="请输入对端地址"/>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </div>
    <!--ActiveMQ-->
    <div class="AgreementBox" v-if="activemqFormVisible">
      <div class="editform">
        <span>ActiveMQ</span>
        <Button :disabled="authorVisible" class="ml20" icon="md-repeat" size="small" @click="resetForm('activemqForm')">重置</Button>
        <Button :disabled="authorVisible" class="save-btn" @click="saveAgreement('activemqForm')" :loading="saveAgreementLoading" size="small" icon=" bank-save iconfont">保存</Button>
      </div>
      <div class="content-item">
        <Form ref="activemqForm" :model="activemqForm" :rules="activemqRule" :label-width="100" @submit.native.prevent>
          <Row :gutter="20">
            <i-col :span="8">
              <FormItem label="MQ地址" prop="serverHost">
                <Input :disabled="authorVisible" v-model="activemqForm.serverHost" placeholder="请输入协议地址"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="端口号" prop="serverPort">
                <Input :disabled="authorVisible" v-model="activemqForm.serverPort" number placeholder="请输入端口号"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="处理线程数" prop="dealThreadCnt">
                <Input :disabled="authorVisible" v-model="activemqForm.dealThreadCnt" number placeholder="请输入数字"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="输入队列" prop="qIn">
                <Input :disabled="authorVisible" v-model="activemqForm.qIn" placeholder="请填写输入队列"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="输出队列" prop="qOut">
                <Input :disabled="authorVisible" v-model="activemqForm.qOut" placeholder="请填写输出队列"/>
              </FormItem>
            </i-col>
            <i-col :span="8" :offset="8" :pull="8">
              <FormItem label="用户名" prop="userName">
                <Input :disabled="authorVisible" v-model="activemqForm.userName" placeholder="请输入用户名"/>
              </FormItem>
            </i-col>
            <i-col :span="8" :pull="8">
              <FormItem label="密码" prop="password">
                <Input :disabled="authorVisible" v-model="activemqForm.password" placeholder="请输入密码"/>
              </FormItem>
            </i-col>
          </Row>
        </Form>
      </div>
    </div>
    <!--mq-->
    <div class="AgreementBox" v-if="mqFormVisible">
      <div class="editform">
        <span>WebSphere MQ</span>
        <Button :disabled="authorVisible" class="ml20" icon="md-repeat" size="small" @click="resetForm('mq')">重置</Button>
        <Button :disabled="authorVisible" class="save-btn" @click="saveAgreement('mq')" :loading="saveAgreementLoading" size="small" icon=" bank-save iconfont">保存</Button>
      </div>
      <div class="content-item">
        <Form ref="mqForm" :model="mqForm" :rules="mqRules" :label-width="100" @submit.native.prevent>
          <Row :gutter="20">
            <i-col :span="8">
              <FormItem label="MQ地址" prop="serverHost">
                <Input :disabled="authorVisible" v-model="mqForm.serverHost" placeholder="请填写协议地址"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="端口号" prop="serverPort">
                <Input :disabled="authorVisible" v-model="mqForm.serverPort" number placeholder="请填写端口号"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="通道名称" prop="channel">
                <Input :disabled="authorVisible" v-model="mqForm.channel" placeholder="请填写通道名称"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="输入队列管理器" prop="qqmIn">
                <Input :disabled="authorVisible" v-model="mqForm.qqmIn" placeholder="请填写输入队列管理器"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="输入队列" prop="qIn">
                <Input :disabled="authorVisible" v-model="mqForm.qIn" placeholder="请填写输入队列"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="处理线程数" prop="dealThreadCnt">
                <Input :disabled="authorVisible" v-model="mqForm.dealThreadCnt" number placeholder="请填写数字"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="输出队列管理器" prop="qmOut">
                <Input :disabled="authorVisible" v-model="mqForm.qmOut" placeholder="请填写输出队列管理器"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="输出队列" prop="qOut">
                <Input :disabled="authorVisible" v-model="mqForm.qOut" placeholder="请填写输出队列"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="通道连接数" prop="connThreadCnt">
                <Input :disabled="authorVisible" v-model="mqForm.connThreadCnt" number placeholder="请填写数字"/>
              </FormItem>
            </i-col>
            <i-col :span="8">
              <FormItem label="CCSID" prop="ccsId">
                <Input :disabled="authorVisible" v-model="mqForm.ccsId" number placeholder="请填写CCSID"/>
              </FormItem>
            </i-col>
          </Row>
          <!--<FormItem label="请求队列打开参数" prop="qInOpenOptions">-->
          <!--<Select v-model="mqForm.qInOpenOptions" placeholder="Enter your qInOpenOptions">-->
          <!--<Option value="MQC.MQOO_INPUT_SHARED" label="MQGMO_SYNCPOINT"></Option>-->
          <!--<Option value="MQC.MQOO_FAIL_IF_QUIESCING" label="MQC.MQOO_FAIL_IF_QUIESCING"></Option>-->
          <!--</Select>-->
          <!--</FormItem>-->
          <!--<FormItem label="请求队列获取参数" prop="qInGetOptions">-->
          <!--<Select v-model="mqForm.qInGetOptions" placeholder="Enter your qInGetOptions">-->
          <!--<Option value="MQGMO_SYNCPOINT" label="MQGMO_SYNCPOINT"></Option>-->
          <!--<Option value="MQGMO_WAIT" label="MQGMO_WAIT"></Option>-->
          <!--<Option value="MQGMO_FAIL_IF_QUIESCING" label="MQGMO_FAIL_IF_QUIESCING"></Option>-->
          <!--</Select>-->
          <!--</FormItem>-->
          <!--<FormItem label="请求队列匹配参数" prop="qInMatchOptions">-->
          <!--<Input v-model="mqForm.qInMatchOptions" number placeholder="Enter your qInMatchOptions"/>-->
          <!--</FormItem>-->
        </Form>
      </div>
    </div>
    <!--新一代安全-->
    <div class="secBox" v-if="formVisible">
      <div class="editform">
        <span>新一代安全参数</span>
      </div>
      <div class="content-item">
        <Row :gutter="20">
          <i-col :span="12">
            <Card>
              <p slot="title">
                <Icon type="md-options"></Icon>
                安装配置
             </p>
              <div slot="extra">
                <Button type="default" icon="md-repeat" size="small" @click="getArgsSecLeft">重置</Button>
                <Button type="primary" size="small" icon="md-aperture" @click="getInstallSec('installForm')" :loading="secLoading">安装</Button>
              </div>
              <!--安装、启动、停止-->
              <Form ref="installForm" :model="installForm" :rules="ruleInstall" :label-width="100" @submit.native.prevent>
                <FormItem label="安装状态">
                  <span>
                    <i-switch
                           v-if="instanceItem.secFileId"
                           size="large"
                           @on-change="installStateChange"
                           v-model="isStart">
                    <span slot="open">启动</span>
                    <span slot="close">停止</span>
                  </i-switch>
                    <span class="nInstall" v-if="!instanceItem.secFileId">未安装</span>
                    <Icon v-if="instanceItem.secFileId"
                          type="ios-refresh-circle"
                          class="iconState"
                          color="#829fbd"
                          @click="getSecConfirm"
                          title="刷新安装状态"/>
                  </span>
                </FormItem>
                <FormItem label="安全版本文件" prop="secFileId">
                  <Select v-model="installForm.secFileId"  placeholder="请选择安全版本">
                    <Option v-for="(value,index) in secFileData" :key="index+'安全'" :value="value.id" :label="value.fileName"></Option>
                  </Select>
                </FormItem>
                <FormItem label="KMC" prop="envId">
                  <Select v-model="installForm.envId"  placeholder="请选择KMC">
                    <Option v-for="(value,index) in kmcData"
                            :key="index+'KMC'"
                            :value="value.id"
                            :label="value.kmcIp+':'+value.kmcPort+' '+value.kmcNodeId">
                      <div class="clearfix">
                        <span class="left">{{value.kmcIp}}:{{value.kmcPort}}</span>
                        <span class="right">节点{{value.kmcNodeId}}</span>
                      </div>
                    </Option>
                  </Select>
                </FormItem>
                <FormItem label="本地安全节点" prop="localNodeId">
                  <Input v-model="installForm.localNodeId" placeholder="请输入本地安全节点"/>
                </FormItem>
              </Form>
            </Card>
          </i-col>
          <i-col :span="12">
            <Card>
              <p slot="title">
                <Icon type="md-list"></Icon>
                安全参数
             </p>
              <div slot="extra">
                <Button type="default" icon="md-repeat" size="small" @click="getArgsSecRight">重置</Button>
                <Button class="save-btn" type="primary" @click="saveBtn('formValidate')" size="small" icon=" bank-save iconfont">保存</Button>
              </div>
              <!--安全参数-->
              <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="100" @submit.native.prevent>
                <FormItem label="加解密方式" prop="secType">
                  <Select v-model="formValidate.secType" clearable placeholder="请输入加解密方式">
                    <Option v-for="(value,index) in secTypeData" :key="index+'加解密'" :value="value.code" :label="value.name"></Option>
                  </Select>
                </FormItem>
                <FormItem label="报文头类型" prop="headType">
                  <Select v-model="formValidate.headType" clearable placeholder="请选择报文头类型">
                    <Option v-for="(value,index) in headTypeData" :key="index+'报文'" :value="value.code" :label="value.name"></Option>
                  </Select>
                </FormItem>
                <FormItem label="解密过程" prop="ignoreDecryp">
                  <Checkbox v-model="formValidate.ignoreDecryp">忽略</Checkbox>
                </FormItem>
                <FormItem label="安全" prop="enabled">
                  <i-switch size="large" v-model="formValidate.enabled">
                    <span slot="open">启用</span>
                    <span slot="close">禁用</span>
                  </i-switch>
                </FormItem>
              </Form>
            </Card>
          </i-col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
  import {requestServices} from '../../api/api.js'
  import {auth} from '../../api/auth.js'
  export default {
    data () {
      return {
        authorVisible:false,//管理权限
        secTypeData:[],
        headTypeData:[],
        saveAgreementLoading:false,
        httpFormVisible:false,
        httpForm:{
          serverPort:'',
          minThread:'',
          maxThread:'',
          maxIdleTime:'',
          acceptThread:'',
        },
        httpRules:{},
        tcpFormVisible:false,
        tcpForm:{
          serverPort:'',
          dealThreadCnt:'',
          retIpPorts:[]
        },
        tcpRules:{},
        activemqFormVisible:false,
        activemqForm:{
          serverHost:"",
          serverPort:"",
          userName:"",
          password:"",
          qIn:"",
          qOut:"",
          dealThreadCnt:"",
          connThreadCnt:"",
        },
        activemqRule:{},
        mqFormVisible:false,
        mqForm:{
          ccsId:'',
          channel:"",
          connThreadCnt:'',
          qqmIn:'',
          qIn:'',
          qmOut:'',
          qOut:'',
//          qInGetOptions:'',
//          qInMatchOptions:0,
//          qInOpenOptions:'',
          serverHost:'',
          serverPort:'',
          dealThreadCnt:'',
        },
        mqRules:{},
        //新一代form表单数据
        formVisible:false,
        secFileData:[],
        kmcData:[],
//        stateShow:true,
        isStart:false,
        secLoading:false,//安装加载
        installForm:{
          id:'',
          secFileId:'',
          envId:'',
          localNodeId:"",
        },
        ruleInstall:{
          secFileId: [
            { required:true, type:'number', message: '请选择', trigger: 'change' }
          ]
        },
        formValidate: {
          secType:'',
          headType:'',
          ignoreDecryp:false,
          enabled:false,
        },
        ruleForm: {
          secType: [
            { required:true, type:'number', message: '请选择', trigger: 'change' }
          ],
          headType: [
            { required:true, type:'number', message: '请选择', trigger: 'change' }
          ]
        }
      }
    },
    watch:{
      instanceItem(val){
        let self = this;
        this.setFormValue();
        if(val.argsAgain){
          if(val.secId){
            self.getArgsSec();
            if(val.secFileId){
              self.getSecConfirm();
            }
          }
          return false;
        }
        //secFileId判断实例有没有新一代安全，新一代安全的表单要不要显示
        if(val.secId){
          this.formVisible=true;
          this.getSecFileKmcList();
          this.getArgsSec();
          if(val.secFileId){
            self.getSecConfirm();
          }
        }else{
          this.formVisible=false;
        }
      },
      $route(to,from){
        this.authCheck();
      }
    },
    props:{
      instanceItem:Object,
    },
    mounted(){
      this.authCheck();
      let val;
      for (val in this.$global.ArgsSecTypeData){
        this.secTypeData.push({code:parseInt(val),name:this.$global.ArgsSecTypeData[val]})
      }
      let valt;
      this.headTypeData.length=0;
      for (valt in this.$global.headTypeData){
        this.headTypeData.push({code:parseInt(valt),name:this.$global.headTypeData[valt]})
      }
      if(this.instanceItem.secId){
        this.formVisible=true;
      }else{
        this.formVisible=false;
      }
      this.setFormValue();
      this.getSecFileKmcList();
      this.getArgsSec();
      if(this.instanceItem.secFileId){
        this.getSecConfirm();
      }
//      this.bus.$on('update',function (val) {
//        console.log('val')
//      })
    },
    methods: {
      //只有在功能测试&测试人员权限的时候禁止操作协议
      authCheck(){
        if(auth.getCookie("isSuper")!="1"&&this.$route.query.type=="2"){
          this.authorVisible = true;
        }else{
          this.authorVisible = false;
        }
      },
      //重置
      resetForm(str){
        let formConf =JSON.parse(this.instanceItem.perfJsonConf);
        if(str==='http'){
          this.httpForm = formConf;
        }else if(str==='tcp'){
          this.tcpForm = formConf;
        }else if(str === 'WebShpereMQ'){
          this.mqForm = formConf;
        }else{
          this.activemqForm = formConf;
        }
      },
      saveAgreement(name){
        let self = this,_Conf;
        if(name==='httpForm'){
          _Conf = this.httpForm;
        }else if(name==='tcpForm'){
          _Conf = this.tcpForm;
        }else if(name==='activemqForm'){
          _Conf = this.activemqForm;
        }else{
          _Conf = this.mqForm;
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.saveAgreementLoading=true;
            let aab = setTimeout(function () {
              self.saveAgreementLoading = false
            },1000);
            requestServices.instanceUpdate({
              id:self.instanceItem.id,
              perfJsonConf:JSON.stringify(_Conf)
            }).then((res)=>{
                if(res.code===0){
                  self.$Message.success('保存成功！');
                  self.$emit("upadteInstanceList");
                  self.setFormValue();
                  self.saveAgreementLoading = false
                  clearTimeout(aab)
                }
              })
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      },
      //给动态表单赋值
      setFormValue(){
        this.httpFormVisible=false;
        this.tcpFormVisible=false;
        this.activemqFormVisible=false;
        this.mqFormVisible=false;
        let formType = this.$global.adapterTypeData[this.instanceItem.adapterType];
        let formConf =JSON.parse(this.instanceItem.perfJsonConf);
        if(formType==='http'){
          this.httpFormVisible=true;
          this.httpForm = formConf;
        }else if(formType === 'tcp'){
          this.tcpFormVisible=true;
          this.tcpForm = formConf;
        }else if(formType === 'WebShpereMQ'){
          this.mqFormVisible=true;
          this.mqForm = formConf;
        }else if(formType === 'ActiveMQ'){
          this.activemqFormVisible=true;
          this.activemqForm = formConf;
        }else{
          this.$Message.warning('数据异常')
        }
      },

      //获取新一代参数表单数据
      getArgsSec(){
        if(this.instanceItem.secConf){
          this.formValidate = JSON.parse(this.instanceItem.secConf);
        }
        this.installForm.id = this.instanceItem.id;
        this.installForm.localNodeId = this.instanceItem.localNodeId;
        this.installForm.secFileId = this.instanceItem.secFileId;
        this.installForm.envId = this.instanceItem.envId;
      },
      //安全右边重置
      getArgsSecRight(){
        if(this.instanceItem.secConf){
          this.formValidate = JSON.parse(this.instanceItem.secConf);
        }
      },
      //安全左边重置
      getArgsSecLeft(){
        this.installForm.id = this.instanceItem.id;
        this.installForm.localNodeId = this.instanceItem.localNodeId;
        this.installForm.secFileId = this.instanceItem.secFileId;
        this.installForm.envId = this.instanceItem.envId;
      },
      getSecFileKmcList(){
        requestServices.secFileList({secId:this.instanceItem.secId})
          .then(res=>{
            this.secFileData=res.page.rows;
          });
        requestServices.kmcList()
          .then(res=>{
            this.kmcData = res.page.rows;
          });
      },
      //安装switch状态
      installStateChange(val){
        let self = this;
        val? self.getSecCmd(self.$global.secCmdData.start):self.getSecCmd(self.$global.secCmdData.stop);
      },
      //安装
      getInstallSec(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.secLoading=true;
            let aab = setTimeout(function () {
              self.secLoading = false
            },1000);
            requestServices.installSec(this.installForm)
              .then(res=>{
              self.secLoading = false;
              clearTimeout(aab);
                if(res.code===0){
                  self.$Message.success('安装成功！');
                  self.$emit("upadteInstanceList");
                }
              });
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      },
      //确认状态
      getSecConfirm(){
//        this.stateShow=false;
        requestServices.secConfirm(this.instanceItem.id)
          .then(res=>{
            this.isStart=res.isStart;
//            this.stateShow=true;
          })
      },
      //启动停止
      getSecCmd(type){
//        this.isStart=true;
        requestServices.secCmd(this.instanceItem.id,type)
          .then(res=>{
            if(res.code===0){
              if(res.success){
                this.isStart=res.isStart;
                this.$Message.success('命令执行成功！');
              }else{
                this.isStart=!this.isStart;
                this.$Message.error('命令执行失败！');
              }
            }
          })
      },
      //保存新一代参数表单数据
      saveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.saveLoading=true;
            let aab = setTimeout(function () {
              self.saveLoading = false
            },1000);
            requestServices.instanceUpdate({
                id:this.instanceItem.id,
                secConf:JSON.stringify(this.formValidate)
              }).then((res)=>{
                if(res.code===0){
                  self.$Message.success('保存成功！');
                  self.$emit("upadteInstanceList");
                  self.saveLoading = false
                  clearTimeout(aab)
                }
              })
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      }
    }
  }
</script>
