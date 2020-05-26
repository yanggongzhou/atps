<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">安全组件管理</span>
    </div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :rules="ruleInline"
      :label-width="90"
      class="searchBox"
      style=" min-width:560px "
      @submit.native.prevent>
      <FormItem prop="secType" label="安全类型">
        <Select v-model="formInline.secType" placeholder="搜索安全类型">
          <Option v-for="(val,ind) in formStateData" :key="ind+'查询'" :value="val.code" :label="val.name"></Option>
        </Select>
      </FormItem>
      <FormItem prop="secName" label="安全名称">
        <Input type="text" v-model="formInline.secName" placeholder="搜索安全名称"/>
      </FormItem>
      <FormItem :label-width="0">
        <Button type="primary" @click="onSearch('formInline')">查询</Button>
        <Button type="info" @click="reSearch('formInline')">重置</Button>
      </FormItem>
    </Form>
    <!--列表-->
    <div class="mb10">
      <Button type="success" @click="addBtn">新增</Button>
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
    </Table>
    <!--表格内文件上传-->
    <Modal
      class="ModalBox"
      v-model="tableFileVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">安全介质文件</div>
      <Table
        size="small"
        :columns="fileTableColumns"
        :loading="fileTableLoading"
        :data="fileTableData">
      </Table>
      <!---->
      <!--分页-->
      <div class="clearfix">
        <Page
          size="small"
          @on-change="goFilePage"
          class="m10 right"
          :total="totalFilePage"
          :page-size="$global.pageSize"
          :current="currentFilePage"
          show-total></Page>
      </div>
      <div class="clearfix">
        <Upload
          class="left mr10"
          action="Hi:HowAreYou!"
          :before-upload="tableFileUpload">
          <Input v-model="fileForm.fileName" readonly placeholder="可上传tar文件">
          <Button slot="append" ghost icon="md-attach">选择文件</Button>
          </Input>
        </Upload>
        <Button class="left" type="success" icon="md-cloud-upload" :loading="fileSaveLoading" @click="fileSaveBtn">上传</Button>
      </div>
      <div slot="footer">
        <Button  @click="tableFileVisible=false">关闭</Button>
      </div>
    </Modal>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="800">
      <div slot="header">安全组件信息编辑</div>

      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="11">
            <FormItem label="安全名称" prop="secName">
              <Input v-model="formValidate.secName" placeholder="请输入安全名称"/>
            </FormItem>
            <FormItem label="安全类型" prop="secType">
              <Select v-model="formValidate.secType" placeholder="请选择安全类型">
                <Option v-for="(val,ind) in formStateData" :key="ind" :value="val.code" :label="val.name"></Option>
              </Select>
            </FormItem>
            <FormItem label="安全变量名" prop="installVar">
              <Input v-model="formValidate.installVar" placeholder="请输入安全变量名称"/>
            </FormItem>
            <FormItem label="处理类" prop="processor">
              <Input v-model="formValidate.processor" placeholder="请输入处理类"/>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="安装脚本" prop="installShell">
              <Upload
                style="height: 32px;"
                action="Hi:HowAreYou!"
                :before-upload="installShellFileUpload">
                <Input v-model="formValidate.installShell" readonly placeholder="可上传sh文件">
                <Button slot="append" ghost icon="md-attach">选择</Button>
                </Input>
              </Upload>
            </FormItem>
            <FormItem label="启动命令" prop="startCmd">
              <Upload
                style="height: 32px;"
                action="Hi:HowAreYou!"
                :before-upload="startCmdFileUpload">
                <Input v-model="formValidate.startCmd" readonly placeholder="可上传sh文件">
                  <Button slot="append" ghost icon="md-attach">选择</Button>
                </Input>
              </Upload>
            </FormItem>
            <FormItem label="停止命令" prop="stopCmd">
              <Upload
                style="height: 32px;"
                action="Hi:HowAreYou!"
                :before-upload="stopCmdFileUpload">
                <Input v-model="formValidate.stopCmd" readonly placeholder="可上传sh文件">
                  <Button slot="append" ghost icon="md-attach">选择</Button>
                </Input>
              </Upload>
            </FormItem>
            <FormItem label="确认命令" prop="confirmCmd">
              <Upload
                style="height: 32px;"
                action="Hi:HowAreYou!"
                :before-upload="confirmCmdFileUpload">
                <Input v-model="formValidate.confirmCmd" readonly placeholder="可上传sh文件">
                  <Button slot="append" ghost icon="md-attach">选择</Button>
                </Input>
              </Upload>
            </FormItem>
          </i-col>
          <i-col :span="22">
            <FormItem label="环境变量" prop="appendProfile">
              <Input v-model="formValidate.appendProfile"
                     :autosize="{minRows: 3,maxRows: 5}" type="textarea" placeholder="请输入环境变量"/>
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
  import {requestServices} from '../../api/api.js'
  export default {
    data () {
      return {
        //查询
        formInline: {
          secName: '',
          secType: ''
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
            title: '安全名称',
            key: 'secName',
            align: 'center',
            minWidth:90,
            tooltip:true,
          },
          {
            title: '安全类型',
            key: 'secType',
            align: 'center',
            minWidth:90,
            tooltip:true
          },
          {
            title: '安装脚本',
            key: 'installShell',
            align: 'center',
            minWidth:90,
            tooltip:true
          },
          {
            title: '安全变量名',
            key: 'installVar',
            align: 'center',
            minWidth:100,
            tooltip:true
          },
          {
            title: '安全介质',
            fixed:'right',
            align: 'center',
            width: 90,
            render:(h, params)=>{
              return  h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    ghost:true,
                    icon:'ios-folder-open'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.tableFileBtn(params.row)
                    }
                  }
                })
            }
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
          secId:'',
          fileName:"",
        },
        fileTableLoading:false,
        fileTableColumns:[
          {
            type: 'index',
            width: 50,
            align: 'center'
          },
          {
            title: '文件名',
            key: 'fileName',
            align: 'center',
            tooltip:true,
          },
          {
            title: '操作',
            width: 70,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon:'ios-trash-outline',
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delFileBtn(params)
                    }
                  }
                })
              ]);
            }
          }
        ],
        fileTableData:[],
        //文件分页
        totalFilePage:10,//总条数
        currentFilePage:1,//当前页码
        //弹框
        formVisible:false,//编辑表单显示
        tableLoading:false,//列表数据加载
        saveLoading:false,//表单提交加载
        //form表单数据
        formStateData:[],//拆包类型状态码
        formValidate: {
          secName:'',
          secType:'',
          installShell:'',
          installVar:'',
          appendProfile:'',
          startCmd:'',
          stopCmd:"",
          confirmCmd:'',
          processor:''
        },
        ruleForm: {
          secName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          secType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ]
        },
        fileData:new FormData(),
        _fileData:new FormData(),
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    created(){
      //获取安全类型
      let val;
      for (val in this.$global.secTypeData){
        this.formStateData.push({code:val,name:this.$global.secTypeData[val]})
      }
      this.getList();
    },
    methods: {
      //表格内文件按钮
      tableFileBtn(row){
        this.fileForm.secId = row.id;
        this.fileForm.fileName='';
        this.getFileList();
        this.fileSaveLoading=false;
        this.tableFileVisible=true;
        this._fileData = new FormData();
        this._fileData.append("secId",row.id);
      },
      //文件保存按钮
      fileSaveBtn(){
        let self = this;
        this.fileSaveLoading=true;
        let aab = setTimeout(function () {
          self.fileSaveLoading = false
        },1000);
        requestServices.secFileUpload(this._fileData)
          .then(res=>{
            if(res.code===0){
              self.fileSaveLoading=false;
              clearTimeout(aab);
              self.$Message.success('上传文件成功！')
              self.getFileList();
            }
          });
      },
      getFileList(){
        this.fileTableLoading=true;
        requestServices.secFileList({
          secId:this.fileForm.secId,
          page:this.currentFilePage,
          limit:this.$global.pageSize,
        }).then((res)=>{
          this.fileTableData=res.page.rows;
          this.totalFilePage=res.page.total;
          this.fileTableLoading=false;
        })
      },
      delFileBtn(params){
        requestServices.secFileDelete([params.row.id])
          .then((res)=>{
            if(res.code===0){
              this.$Message.success('已删除！')
              this.getFileList();
            }
          })
      },
      goFilePage(val){
        this.currentFilePage=val;
        this.getFileList()
      },
      //选择文件
      tableFileUpload(file){
        const _M50 = file.size<52428801;
        const _tar = file.type==="application/x-tar";
        if(!_tar||!_M50){
          this.$Message.warning({
            content:'请上传.tar类型文件，并限制大小在50M以内',
            duration: 3
          });
          return false;
        }
        this._fileData.delete('file');
        this.fileForm.fileName=file.name;
        this._fileData.append("file",file);
        return false;
      },

      installShellFileUpload(file){
        const _textsh = file.type==="text/x-sh";
        if(!_textsh){
          this.$Message.warning({
            content:'请上传.sh类型文件',
            duration: 3
          });
          return false;
        }
        this.formValidate.installShell=file.name;
        this.fileData.append("installShellFile",file);
        return false;
      },
      startCmdFileUpload(file){
        const _textsh = file.type==="text/x-sh"
        if(!_textsh){
          this.$Message.warning({
            content:'请上传.sh类型文件',
            duration: 3
          });
          return false;
        }
        this.formValidate.startCmd=file.name;
        this.fileData.append("startCmdFile",file);
        return false;
      },
      stopCmdFileUpload(file){
        const _textsh = file.type==="text/x-sh"
        if(!_textsh){
          this.$Message.warning({
            content:'请上传.sh类型文件',
            duration: 3
          });
          return false;
        }
        this.formValidate.stopCmd=file.name;
        this.fileData.append("stopCmdFile",file);
        return false;
      },
      confirmCmdFileUpload(file){
        const _textsh = file.type==="text/x-sh"
        if(!_textsh){
          this.$Message.warning({
            content:'请上传.sh类型文件',
            duration: 3
          });
          return false;
        }
        this.formValidate.confirmCmd=file.name;
        this.fileData.append("confirmCmdFile",file);
        return false;
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
      //获取列表
      getList(){
        this.tableLoading=true;
        requestServices.secList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          secName:this.formInline.secName,
          secType:this.formInline.secType
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      //新增
      addBtn(){
        this.fileData = new FormData();
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this. formValidate= {
          secName:'',
          secType:'',
          installShell:'',
          installVar:'',
          appendProfile:'',
          startCmd:'',
          stopCmd:"",
          confirmCmd:''
        }
      },
      //修改
      editBtn (params) {
        this.fileData = new FormData();
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.secName = params.row.secName;
        this.formValidate.secType = params.row.secType;
        this.formValidate.installShell = params.row.installShell;
        this.formValidate.installVar = params.row.installVar;
        this.formValidate.startCmd = params.row.startCmd;
        this.formValidate.stopCmd = params.row.stopCmd;
        this.formValidate.confirmCmd = params.row.confirmCmd;
        this.formValidate.appendProfile = params.row.appendProfile;
        this.formValidate.processor = params.row.processor;
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
              requestServices.secDelete(self.selectionData)
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
            self.fileData.append('secName',self.formValidate.secName);
            self.fileData.append('secType',self.formValidate.secType);
            self.fileData.append('installShell',self.formValidate.installShell);
            self.fileData.append('installVar',self.formValidate.installVar);
            self.fileData.append('appendProfile',self.formValidate.appendProfile);
            self.fileData.append('processor',self.formValidate.processor);
            if(self.formValidate.id){
              self.fileData.append('id',self.formValidate.id);
              requestServices.secUpdateUpload(self.fileData)
                .then((res)=>{
                  if(res.code===0){
                    self.$Message.success('修改成功！');
                    self.formVisible=false;
                    self.saveLoading=false;
                    clearTimeout(aab);
                    self.getList();
                  }
                })
            }else{
              requestServices.secUpload(self.fileData)
                .then((res)=>{
                  if(res.code===0){
                    self.$Message.success('保存成功！');
                    self.formVisible=false;
                    self.saveLoading=false;
                    clearTimeout(aab);
                    self.getList();
                  }
                })
            }
          } else {
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
