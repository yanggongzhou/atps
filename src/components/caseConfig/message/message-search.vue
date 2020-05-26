<style>
.msg-search-table{
  width: 685px;
}
  .messageSearchBox{
    position: relative;
    top: -1px;
  }
</style>
<template>
  <div class="dilb messageSearchBox">
    <Button
      type="default"
      size="small"
      @click="editBtn"
      ghost
      title="全部交易文件"
      icon="ios-search">搜索添加</Button>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      @on-cancel="closeEvent"
      :mask-closable="false"
      :width="800">
      <div slot="header">搜索添加交易文件</div>
      <div class="">
        <!--查询-->
        <Form
          :inline="true"
          :label-width="75"
          @submit.native.prevent>
          <FormItem label="交易码搜索">
            <Input type="text" v-model="searchFileName" placeholder="输入交易码" search enter-button @on-search="searchInput"/>
          </FormItem>
          <FormItem label="交易文件">
            <Table
              class="simu-modal-table msg-search-table"
              stripe
              border
              size="small"
              :loading="fileTableLoading"
              :columns="fileColumns"
              :data="fileData">
              <template slot-scope="{ row, index }" slot="active">
                <Button type="primary" size="small" style="margin-right: 5px" @click="checkTaskBtn(row)">详情</Button>
                <Button type="success" size="small" style="margin-right: 5px" title="复刻交易文件至当前模拟器实例下" @click="copyTransBtn(row)">一键复刻</Button>
              </template>
            </Table>
            <!--分页-->
            <div class="clearfix">
              <Page  @on-change="goPage" class="pageSizeBox right" :total="totalPage" :page-size="$global.pageSize" :current="currentPage" show-total></Page>
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="padding: 0">  </div>
    </Modal>
    <Modal
      class="ModalBox"
      v-model="checkVisible"
      closable
      :mask-closable="false"
      :width="600">
      <div slot="header">交易文件详细信息</div>
      <div class="">
        <Form
          :label-width="60"
          @submit.native.prevent>

          <FormItem label="交易报文">
            <MyEditor
              ref="ruledialogtree"
              class="msg-monaco"
              Mheight="200px"
              theme="hc-black"
              language="xml"
              :codes="msgConfig"
              @onMounted="xmlOnMounted1"
              @onCodeChange="xmlOnCodeChange1" />
          </FormItem>
          <FormItem label="交易规则" v-show="dynConfVisible">
            <MyEditor
              ref="ruledialogtree2"
              class="msg-monaco"
              Mheight="200px"
              theme="hc-black"
              language="xml"
              :codes="dynConf"
              @onMounted="xmlOnMounted"
              @onCodeChange="xmlOnCodeChange" />
          </FormItem>
        </Form>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import {requestServices} from '../../../api/api.js'

  import MyEditor from '../../home/monaco'
  export default {
    components:{
      MyEditor,
    },
    data(){
      return{
        xmlEditor:null,
        //弹框
        formVisible:false,//编辑表单显示
        checkVisible:false,
        //form表单数据
        msgConfig:'',
        dynConf:'',
        dynConfVisible:false,
        searchFileName:'',
        fileTableLoading:false,
        userData:[],
        fileColumns:[
          {
            title: '#',
            fixed:'left',
            type:'index',
            align: 'center',
            width:50
          },
          {
            title: '文件名',
            key: 'tranCode',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '类型',
            align: 'center',
            width:120,
            render: (h, params) => {
              let self = this;
              const color = params.row.isdyn === parseInt( Object.keys(self.$global.messageIsDyn)[0]) ? 'success' : 'primary';
              return h('Tag', {
                props: {
                  type:"dot",
                  color: color
                }
              }, self.$global.messageIsDyn[params.row.isdyn]);
            },
            tooltip:true
          },
          {
            title: '上传者',
            align: 'center',
            width:80,
            render:(h,params)=>{
              let self = this,userName='';
              self.userData.forEach(val=>{
                if(val.id===params.row.creator){
                  return userName = val.userName
                }
              });
              return h('span',userName)
            },
            tooltip:true,
          },
          {
            title: '上传时间',
            key: 'lastUploadTime',
            align: 'center',
            width:160,
            tooltip:true,
          },
          {
            title: '任务名称',
            key: 'taskName',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '任务编号',
            key: 'taskNo',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '起止日期',
            minWidth:180,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                params.row.beginDate+' 至 '+params.row.endDate
              ]);
            }
          },
          {
            title: '操作',
            fixed:'right',
            width: 155,
            slot:'active',
            align: 'center'
          }
        ],
        fileData:[],
        //        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    mounted(){
      requestServices.userList()
        .then((res)=>{
          this.userData = res.page.rows
        });
    },
    methods:{
      xmlOnMounted1(edit){
        this.xmlEditor = edit;
      },
      xmlOnCodeChange1(value,event){
        this.msgConfig=value;
      },

      xmlOnMounted(edit){
        this.xmlEditor = edit;
      },
      xmlOnCodeChange(value,event){
        this.dynConf=value;
      },

      editBtn(){
        this.formVisible=true;
        let self = this;
        this.$nextTick(function () {
          self.$refs.ruledialogtree.initEditor();
        });
        this.$nextTick(function () {
          self.$refs.ruledialogtree2.initEditor();
        });
      },

      searchInput(){
        if(!this.searchFileName){
          this.$Message.error("请输入文件名")
          return false;
        }
        this.fileTableLoading=true;
        requestServices.messageTranCode({
          tranCode:this.searchFileName,
          page:this.currentPage,
          limit:this.$global.pageSize,
        }).then(res=>{
          this.fileData=res.page.rows;
          this.totalPage = res.page.total;
          this.fileTableLoading=false;
        })
      },

      //查看所属任务
      checkTaskBtn(val){
        this.checkVisible = true;
        let self = this;
        requestServices.getContent(val.id)
          .then(res=>{
            this.msgConfig=res.content;
            this.$refs.ruledialogtree.monacoEditor.setValue(res.content);
            this.$nextTick(function () {
              self.$refs.ruledialogtree.initEditor();
            });
          });
//        parseInt(Object.keys(self.$global.messageIsDyn)[0]) 动态文件
        if(val.isdyn===parseInt(Object.keys(self.$global.messageIsDyn)[0])){
          this.dynConf=val.dynConf;
          this.dynConfVisible = true;
          this.$refs.ruledialogtree2.monacoEditor.setValue(this.dynConf);
          this.$nextTick(function () {
            self.$refs.ruledialogtree2.initEditor();
          });
        }else{
          this.dynConfVisible = false;
        }
      },
      copyTransBtn(val){
        requestServices.copyTrans(val.confId,val.id)
          .then(res=>{
           if(res.code===0){
             this.$Message.success(res.msg);
           }
          })
      },
      closeEvent(){
        this.$emit("copyTransOk")
      },
      goPage(val){
        this.currentPage=val;
        this.searchInput()
      },
    }
  }
</script>
