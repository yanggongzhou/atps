<style>
  .rulecase{
    position: relative;
    right: 495px;
  }
</style>
<template>
  <div class="">
    <Button
      size="small"
      type="default"
      @click="editBtn"
      ghost
      icon="ios-alarm-outline">设置规则</Button>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="750">
      <div slot="header">动态替换规则信息编辑</div>
      <div class="">
          <MyEditor
            ref="ruledialogtree"
            class="msg-monaco"
            Mheight="300px"
            theme="hc-black"
            language="xml"
            :codes="formValidate.dynConf"
            @onMounted="xmlOnMounted"
            @onCodeChange="xmlOnCodeChange" />
      </div>
      <div slot="footer">
        <Button class="rulecase" type="info" ghost size="small" icon="md-git-compare" @click="ruleCase=!ruleCase">规则样例</Button>
        <Button  @click="formVisible=false">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="saveBtn">保存</Button>
      </div>
    </Modal>

    <Modal
      v-model="ruleCase"
      footer-hide
      draggable
      scrollable
      title="规则样例">
      <div slot="header">
        <p>规则样例 <span style="color:#f90;font-size: 12px">*可点击拖动</span></p>
      </div>
      <div>
        <h4>Xpath路径：</h4>
        <!--<rep strategy="xpth" path="TX/TX_BODY/ENTITY/EBank_AR_ID" />-->
        <!--<rep strategy="randon" begin="1" end="1000000000000" len="11" />-->
        <!--<rep strategy="increase" begin="1" len="7" fixlen="true" />-->
        <pre>
          &lt; rep strategy="xpth" path="TX/TX_BODY/ENTITY/EBank_AR_ID" /&gt;
        </pre>
        <h4>Randon随机：</h4>
        <pre>
           &lt; rep strategy="xpth" path="TX/TX_BODY/ENTITY/EBank_AR_ID" /&gt;
        </pre>
        <h4>Increase自增：</h4>
        <pre>
          &lt;rep strategy="increase" begin="1" len="7" fixlen="true" /&gt;
        </pre>

      </div>
    </Modal>
  </div>
</template>
<script>
  import {requestServices} from '../../../api/api.js'
  import {auth} from '../../../api/auth'
  import MyEditor from '../../home/monaco'
  import Page from "../../../../node_modules/iview/src/components/page/page";
  export default {
    components:{
      Page, MyEditor,
    },
    data(){
      return{
        ruleCase:false,

        xmlEditor:null,
        //弹框
        formVisible:false,//编辑表单显示
        saveLoading:false,//表单提交加载
        //form表单数据
        formValidate: {
          id:'',
          dynConf:''
        },
      }
    },
    props:[
      'messageId',
      'dynConf'
    ],
    methods:{
      xmlOnMounted(edit){
        this.xmlEditor = edit;
      },
      xmlOnCodeChange(value,event){
        this.formValidate.dynConf=value;
      },
      //编辑规则
      editBtn(){
//        console.log(this.dynConf)
        this.formVisible=true;
        this.formValidate.id=this.messageId;
        this.formValidate.dynConf=this.dynConf;
        let self = this;
        this.$nextTick(function () {
          self.$refs.ruledialogtree.initEditor();
        });
        this.saveLoading=false;
      },
      //保存
      saveBtn(){
        let self = this;
        this.saveLoading=true;
        let aab = setTimeout(function () {
          self.saveLoading = false
        },1000)
        requestServices.messageUpdateDynConf(self.formValidate)
          .then((res)=>{
            if(res.code===0){
              self.$Message.success('修改成功！');
              self.formVisible=false;
              self.saveLoading=false;
              self.$emit("updateFileList");
              clearTimeout(aab)
            }
          });
      },
    }
  }
</script>
