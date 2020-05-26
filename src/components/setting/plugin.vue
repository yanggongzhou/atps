
<template>
  <div>
    <!--<div style="    text-align: center;-->
    <!--font-size: 30px;-->
    <!--height: 500px;-->
    <!--line-height: 500px;">开发中......</div>-->
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">插件管理</span>
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
      <FormItem prop="type" label="插件类型">
        <Select v-model="formInline.type" placeholder="搜索插件类型">
          <Option v-for="(val,ind) in formStateData" :key="ind+'查询'" :value="val.code" :label="val.name"></Option>
        </Select>
      </FormItem>
      <FormItem prop="fileName" label="文件名称">
        <Input type="text" v-model="formInline.fileName" placeholder="搜索文件名称"/>
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
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">插件信息编辑</div>
      <Form style="width: 319px" ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <FormItem label="选择文件" prop="fileName">
          <Upload
            style="height: 32px;"
            action="Hi:HowAreYou!"
            :before-upload="fileUpload">
            <Input v-model="formValidate.fileName" readonly placeholder="可上传.jar文件">
            <Button slot="append" ghost icon="md-attach">选择</Button>
            </Input>
          </Upload>
        </FormItem>
        <FormItem label="插件类型" prop="type">
          <Select v-model="formValidate.type" placeholder="请选择插件类型">
            <Option v-for="(val,ind) in formStateData" :key="ind" :value="val.code" :label="val.name"></Option>
          </Select>
        </FormItem>
        <FormItem label="关联字段" prop="relatedField">
          <Input v-model="formValidate.relatedField"
                  :autosize="{minRows: 3,maxRows: 5}" type="textarea" placeholder="请输入关联字段"/>
        </FormItem>
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
          fileName: '',
          type: ''
        },
        ruleInline: {},
        //列表数据
        tableLoading:false,//列表数据加载
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
            key: 'fileName',
            align: 'center',
            minWidth:90,
            tooltip:true,
          },
          {
            title: '插件类型',
            key: 'type',
            align: 'center',
            minWidth:110,
            render:(h,params)=>{
              let self = this;
              return h('span',self.$global.pluginTypeData[params.row.type])
            }
          },
          {
            title: '关联字段',
            key: 'relatedField',
            align: 'center',
            minWidth:90,
            tooltip:true
          },
          {
            title: '上传人员',
            key: 'userName',
            align: 'center',
            minWidth:90,
            tooltip:true
          },
          {
            title: '更新日期',
            key: 'updateTime',
            align: 'center',
            minWidth:150,
            tooltip:true
          },
          {
            title: '操作',
            fixed:'right',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon:'md-cloud-download',
                    ghost:true,
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.downloadBtn(params)
                    }
                  }
                }, '下载'),
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

        //弹框
        formVisible:false,//编辑表单显示
        saveLoading:false,//表单提交加载
        //form表单数据
        formStateData:[],//插件类型状态码
        formValidate: {
          fileName:'',
          type:'',
          relatedField:''
        },
        ruleForm: {
          fileName: [
            { required: true, message: '请选择文件', trigger: 'blur' }
          ],
          relatedField: [
            { required: true, message: '请输入关联字段', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ]
        },
        fileData:new FormData(),
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    created(){
      //获取插件类型
      let val;
      for (val in this.$global.pluginTypeData){
        this.formStateData.push({code:val,name:this.$global.pluginTypeData[val]})
      }
      this.getList();
    },
    methods: {
      //下载文件
      downloadBtn(params){
        requestServices.pluginDownload({
          filePath:params.row.url
        }).then(res=>{
//          const blob = new Blob([res])
//          if ('download' in document.createElement('a')) { // 非IE下载
//            const elink = document.createElement('a')
//            elink.download = params.row.fileName
//            elink.style.display = 'none'
//            elink.href = URL.createObjectURL(blob)
//            document.body.appendChild(elink)
//            elink.click()
//            URL.revokeObjectURL(elink.href) // 释放URL 对象
//            document.body.removeChild(elink)
//          } else { // IE10+下载
//            navigator.msSaveBlob(blob, fileName)
//          }
//        })
          if(params.row.url){
            const elink = document.createElement('a');
            elink.download = params.row.fileName;
            elink.style.display = 'none';
            elink.href = requestServices.baseURL+"download?filePath="+params.row.url;
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink)
          }else{
            this.$Message.error('数据异常！')
          }
        })
      },
      //选择文件
      fileUpload(file){
        const _M50 = file.size<52428801;
        let hzArr = file.name.split('.');
        const _jar = hzArr[hzArr.length-1]==='jar';
        if(!_jar){
          this.$Message.warning({
            content:'请上传.jar类型文件',
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
        this.formValidate.fileName=file.name;
        this.fileData.append("file",file);
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
        requestServices.pluginList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          fileName:this.formInline.fileName,
          type:this.formInline.type
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
          fileName:'',
          type:'',
          relatedField:''
        }
      },
      //修改
      editBtn (params) {
        this.fileData = new FormData();
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.fileName = params.row.fileName;
        this.formValidate.type = params.row.type;
        this.formValidate.relatedField = params.row.relatedField;
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
              requestServices.pluginDelete(self.selectionData)
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
            self.fileData.append('type',self.formValidate.type);
            self.fileData.append('relatedField',self.formValidate.relatedField);
            if(self.formValidate.id){
              self.fileData.append('id',self.formValidate.id);
              requestServices.pluginUpdate(self.fileData)
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
              requestServices.pluginSave(self.fileData)
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
