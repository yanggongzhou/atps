<style>
  .tableFile-tip{
    color: #f90;
    position: relative;
    top: -35px;
    left: 80px;
  }
  .argsFile-tip{
    color: #f90;
    position: absolute;
    top: 0;
    left: 235px;
  }
</style>
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">参数文件管理</span>
    </div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :rules="ruleInline"
      :label-width="80"
      class="searchBox"
      style=" min-width:540px "
      @submit.native.prevent>
      <FormItem prop="fileType" label="文件类型">
        <Select v-model="formInline.fileType" placeholder="筛选文件类型">
          <Option v-for="(val,ind) in $global.argsFileStateData" :key="ind+'查询'" :value="val.code" :label="val.name"></Option>
        </Select>
      </FormItem>
      <FormItem prop="aliasName" label="文件名称">
        <Input type="text" v-model="formInline.aliasName" placeholder="搜索文件名"/>
      </FormItem>
      <FormItem :label-width="0">
        <Button type="primary" @click="onSearch('formInline')">查询</Button>
        <Button type="info" @click="reSearch('formInline')">重置</Button>
      </FormItem>
    </Form>
    <!--列表-->
    <div class="mb10">
      <Button type="success" @click="addBtn($global.argsFileStateData[0].code)" icon="md-add">关联文件</Button>
      <Button type="success" @click="addBtn($global.argsFileStateData[1].code,true)" icon="md-add">参数文件</Button>
      <Button type="error"  @click="delBtn">删除</Button>
    </div>
    <Table
      class="tableBox"
      stripe
      border
      :loading="tableLoading"
      @on-selection-change="selectionChange"
      :columns="tableColumns"
      :data="tableData">
      <template slot-scope="{ row, index }" slot="fileUpload">
        <div>
          <Button type="success" ghost size="small" icon="ios-paper-plane-outline" @click="tableFileBtn(row)" title="上传"></Button>
          <Button type="info" ghost size="small" icon="md-eye" @click="getFileContent(row)" title="预览"></Button>
          <Tooltip :content="row.fileName" placement="right" :max-width="100">
            <span @click="getFileContent(row)" class="table-upload-span">{{row.fileName}}</span>
          </Tooltip>
          <!--<Tooltip content="点击预览" placement="right" :max-width="100">-->
            <!--<Icon type="ios-search"  @click="getFileContent(row)"/>-->
          <!--</Tooltip>-->
        </div>
      </template>
    </Table>
    <!--文件内容预览-->
    <Modal
      class="ModalBox"
      v-model="previewVisible"
      closable
      :mask-closable="false"
      :width="600">
      <div slot="header">{{previewTitle}}文件预览</div>
      <Table
          class="tableBox"
          stripe
          border
          size="small"
          :loading="previewTableLoading"
          :columns="previewColumns"
          :data="previewData">
        </Table>
      <div slot="footer">
        <Button  @click="previewVisible=false">关闭</Button>
      </div>
    </Modal>
    <!--表格内文件上传-->
    <Modal
      class="ModalBox"
      v-model="tableFileVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">文件上传</div>
      <Form :label-width="80"  ref="fileForm" :model="fileForm" @submit.native.prevent>
        <FormItem label="选择文件">
          <Upload
            action="Hi:HowAreYou!"
            :before-upload="tableFileUpload">
            <Input v-model="fileForm.fileName" readonly placeholder="可上传dat、txt、csv文件">
              <Button slot="append" ghost icon="md-attach">替换</Button>
            </Input>
          </Upload>
        </FormItem>
          <span class="tableFile-tip">*文件内容中各字段通过逗号,分割</span>
      </Form>
      <div slot="footer">
        <Button  @click="tableFileVisible=false">取消</Button>
        <Button type="primary" :loading="fileSaveLoading" @click="fileSaveBtn('fileForm')">上传</Button>
      </div>
    </Modal>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="800">
      <div slot="header">文件信息编辑</div>

      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="10">
            <FormItem label="文件名称" prop="aliasName">
              <Input v-model="formValidate.aliasName" placeholder="请输入文件名"/>
            </FormItem>
          </i-col>
          <i-col :span="6">
            <FormItem label="状态" prop="enabled">
              <!--<Checkbox v-model="formValidate.enabled">启用</Checkbox>-->
              <i-switch v-model="formValidate.enabled" size="large">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
          </i-col>
          <i-col :span="6">
            <FormItem label="标题" prop="haveTitle">
              <i-switch v-model="formValidate.haveTitle" size="large">
                <span slot="open">显示</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
          </i-col>
          <i-col :span="22">
            <FormItem v-if="editNoShow" label="选择文件" prop="fileName">
              <Upload
                style="width:229px;"
                action="Hi:HowAreYou!"
                :before-upload="handleUpload">
                <Input v-model="formValidate.fileName" readonly placeholder="可上传dat、txt、csv文件">
                <Button slot="append" ghost icon="md-attach">选择</Button>
                </Input>
              </Upload>
              <span  class="argsFile-tip">*文件内容中各字段通过逗号,分割</span>
            </FormItem>
          </i-col>
          <i-col :span="22" v-if="configVisible">
            <FormItem label="关联配置" prop="relatedConf">
              <MyEditor
                ref="dialogtree"
                Mheight="160px"
                theme="hc-black"
                language="xml"
                :codes="formValidate.relatedConf"
                @onCodeChange="xmlOnCodeChange" />
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button  @click="formVisible=false">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="saveBtn('formValidate')">保存</Button>
      </div>
    </Modal>
    <!--分页-->
    <div class="clearfix">
      <Page @on-change="goPage" class="pageSizeBox right" :total="totalPage" :page-size="$global.pageSize" :current="currentPage" show-total></Page>
    </div>
  </div>
</template>
<script>
  import {auth} from '../../api/auth'
  import {requestServices} from '../../api/api.js'
  import MyEditor from '../home/monaco'
  export default {
    components:{
      MyEditor
    },
    data () {
      return {

        //查询
        formInline: {
          aliasName: '',
          fileType: ''
        },
        ruleInline: {},
        //列表数据
        selectionData:[],//复选框id数组
        tableColumns: [
          {
            type: 'selection',
            width: 52,
            fixed:'left',
            align: 'center'
          },
          {
            title: '文件名称',
            key: 'aliasName',
            align: 'center',
            minWidth: 90,
            maxWidth:150,
            tooltip:true,
          },
          {
            title: '文件类型',
            align: 'center',
            minWidth: 90,
            maxWidth:150,
            render:(h,params)=>{
              var _fileType;
              this.$global.argsFileStateData.forEach(val=>{
                if(val.code===params.row.fileType){
                  _fileType = val.name;
                }
              });
              return h('span',_fileType)
            }
          },
          {
            title: '使用状态',
            key: 'enabled',
            align: 'center',
            width: 120,
            render: (h, params) => {
              const color = params.row.enabled ?  'success':'error' ;
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, params.row.enabled);
            }
          },
          {
            title: '有无标题',
            key: 'haveTitle',
            align: 'center',
            width:120,
            render: (h, params) => {
              const color = params.row.haveTitle ?  'success':'error' ;
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, params.row.haveTitle);
            }
          },
          {
            title: '关联配置',
            key: 'relatedConf',
            align: 'center',
            tooltip:true,
            minWidth:150
          },
          {
            title: '文件',
            slot: 'fileUpload',
            fixed:'right',
            align: 'center',
            width: 170
          },
          {
            title: '操作',
            fixed:'right',
            width: 90,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editBtn(params)
                    }
                  }
                }, '编辑')
              ]);
            }
          }
        ],
        tableData: [],
        //表格内文件上传
        tableFileVisible:false,
        fileSaveLoading:false,
        fileForm:{
          id:'',
          fileName:"",
        },
        //文件预览
        previewTitle:'',
        previewVisible:false,
        previewTableLoading:false,
        previewData:[],
        previewColumns: [
          {
            title: '#',
            type:'index',
            align: 'center',
            width:50
          },
          {
            title: '内容',
            key: 'content',
            align: 'center',
            minWidth: 90,
            tooltip:true,
          },
        ],
        //弹框
        formVisible:false,//编辑表单显示
        tableLoading:false,//列表数据加载
        saveLoading:false,//表单提交加载
        configVisible:true,//配置框显示
        editNoShow:true,//编辑时候不显示文件上传
        //form表单数据
        formValidate: {
          fileName:'',
          aliasName:'',
          fileType:'',
          enabled:true,
          haveTitle:true,
          relatedConf:'',
          specialConf:'',
        },
        fileData:new FormData(),
        _fileData:new FormData(),
        ruleForm: {
//          aliasName: [
//            { required: true, message: '请输入名称', trigger: 'blur' }
//          ],
        },
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
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
      isInstanceId(newVal,oldVal) {
        this.getList();
      },
    },
    mounted(){
      if(this.instanceItem.confId){
        this.getList();
      }
    },
    methods: {
      xmlOnCodeChange(value,event){
        this.formValidate.relatedConf=value;
      },

      xmlOnCodeChangeOwn(value,event){
        this.formValidate.specialConf=value;
      },
      //查询
      onSearch(name) {
        this.getList();
      },
      //重置
      reSearch(name){
        this.$refs[name].resetFields();
        this.getList();
      },
      //文件预览
      getFileContent(row){
        this.previewTitle=row.fileName;
        this.previewData =[];
        this.previewVisible=true;
        this.previewTableLoading=true;
        requestServices.argsFilePreview(row.id)
          .then(res=>{
            if(res.code===0){
                res.content.split(',').forEach((val)=>{
                  this.previewData.push({content:val});
              });
              this.previewTableLoading=false;
            }
          })
      },
      //获取列表
      getList(){
        this.tableLoading=true;
        requestServices.argsFileList({
          confId:this.instanceItem.confId,
          page:this.currentPage,
          limit:this.$global.pageSize,
          aliasName:this.formInline.aliasName,
          fileType:this.formInline.fileType
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      //新增
      addBtn(code,boo){
        this.editNoShow=true;
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this. formValidate= {
          fileName:'',
          aliasName:'',
          fileType:code,
          enabled:true,
          haveTitle:true,
          relatedConf:'',
          specialConf:'',
        };
        this.fileData = new FormData();
        let self = this;
        if(boo){
          this.configVisible=false;
        }else{
          this.configVisible=true;
          this.$nextTick(function () {
            self.$refs.dialogtree.initEditor();
          });
        }
      },
      //修改
      editBtn (params) {
        let self = this;
        this.editNoShow=false;
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.aliasName = params.row.aliasName;
        this.formValidate.fileType = params.row.fileType;
        this.formValidate.enabled = params.row.enabled;
        this.formValidate.haveTitle = params.row.haveTitle;
        this.formValidate.relatedConf = params.row.relatedConf;
        this.formValidate.specialConf = params.row.specialConf;
        if(params.row.fileType===2){
          this.configVisible=false;
        }else{
          this.configVisible=true;
          //目的为了显示编译器
          this.$nextTick(function () {
            self.$refs.dialogtree.initEditor();
          });
        }
      },
      //表格内文件按钮
      tableFileBtn(row){
        this.fileSaveLoading=false;
        this.tableFileVisible=true;
        this.fileForm.fileName=row.fileName;
        this._fileData = new FormData();
        this._fileData.append("id",row.id);
      },
      //文件保存按钮
      fileSaveBtn(){
        let self = this;
        this.fileSaveLoading=true;
        let aab = setTimeout(function () {
          self.fileSaveLoading = false
        },1000);
        requestServices.argsTableFileUpload(this._fileData)
          .then(res=>{
            if(res.code===0){
              self.tableFileVisible=false;
              self.fileSaveLoading=false;
              self.$Message.success('文件已更换！');
              self.getList();
              clearTimeout(aab);
            }
          });
      },
      //选择文件
      tableFileUpload(file){
        const _M50 = file.size<52428801;
        var hzArr = file.name.split('.');
        const _dat = hzArr[hzArr.length-1]==='dat';
        const _txt = file.type==="text/plain";
        const _csv = file.type==="application/vnd.ms-excel";
        if(!_txt&&!_csv&&!_dat){
          this.$Message.warning({
            content:'请上传csv、dat、text类型文件',
            duration: 3
          });
          return false;
        }
        if(!_M50){
          this.$Message.warning({
            content:'文件大小限制在50M以内',
            duration: 3
          });
          return false;
        }
        this.fileForm.fileName=file.name;
        this._fileData.append("file",file);
        return false;
      },
      //选择文件
      handleUpload(file){
        const _M50 = file.size<52428801;
        var hzArr = file.name.split('.');
        const _dat = hzArr[hzArr.length-1]==='dat';
        const _text = file.type==="text/plain";
        const _csv = file.type==="application/vnd.ms-excel";
        if(!_txt&&!_csv&&!_dat){
          this.$Message.warning({
            content:'请上传csv、dat、text类型文件',
            duration: 3
          });
          return false;
        }
        if(!_M50){
          this.$Message.warning({
            content:'文件大小限制在50M以内',
            duration: 3
          });
          return false;
        }
        this.fileData.append("file",file);
        this.formValidate.fileName=file.name;
        return false;
      },
      //多选改变时触发，获取选中数据id
      selectionChange(val){
        this.selectionData=[];
        if(val.length){
          val.forEach(value=>{
            this.selectionData.push(value.id)
          })
        }
      },
      //删除
      delBtn(){
        let self = this;
        if(this.selectionData.length){
          this.$Modal.confirm({
            title:'提示',
            content:'是否删除选中数据',
            onOk:()=>{
              requestServices.argsFileDelete({ids:self.selectionData})
                .then(res=>{
                  if(res.code===0){
                    self.$Message.success('已删除！')
                    self.getList();
                  }
                })
            },
            onCancel:()=>{
              self.$Message.info('删除已取消！')
            }
          })
        }else{
          self.$Message.warning('请勾选 √ 所要删除的数据！');
        }
      },
      //保存
      saveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.saveLoading=true;
            let aab = setTimeout(function () {
              self.saveLoading = false
            },1000);
            if(self.formValidate.id){
              requestServices.argsFileUpdate({
                id:self.formValidate.id,
                aliasName:self.formValidate.aliasName,
                fileType:self.formValidate.fileType,
                enabled:self.formValidate.enabled,
                haveTitle:self.formValidate.haveTitle,
                relatedConf:self.formValidate.relatedConf,
                specialConf:self.formValidate.specialConf,
                creator:auth.getCookie('userId'),
                isOver:false
              }).then((res)=>{
                  self.saveLoading=false;
                  if(res.code===0){
                    self.$Message.success('修改成功！');
                    self.formVisible=false;
                    self.getList();
                    clearTimeout(aab);
                  }
                })
            }else{
              this.fileData.append("confId",self.instanceItem.confId);
              this.fileData.append("aliasName",self.formValidate.aliasName);
              this.fileData.append("fileType",self.formValidate.fileType);
              this.fileData.append("enabled",self.formValidate.enabled);
              this.fileData.append("haveTitle",self.formValidate.haveTitle);
              this.fileData.append("relatedConf",self.formValidate.relatedConf);
              this.fileData.append("specialConf",self.formValidate.specialConf);
              this.fileData.append("creator",auth.getCookie('userId'));
              this.fileData.append("isOver",false);
              requestServices.argsFileUpload(self.fileData)
                .then((res)=>{
                  self.saveLoading=false;
                if(res.code===0){
                  self.$Message.success('保存成功！');
                  self.formVisible=false;
                  self.getList();
                  clearTimeout(aab);
                }
              })
            }
          }else{
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      },
      goPage(val){
        this.currentPage=val;
        this.getList()
      },
    }
  }
</script>
