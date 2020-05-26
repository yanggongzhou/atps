<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">模拟器拆包管理</span>
    </div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :rules="ruleInline"
      :label-width="80"
      class="searchBox"
      style=" min-width:560px "
      @submit.native.prevent>
      <FormItem prop="unpackType" label="拆包类型">
        <Select v-model="formInline.unpackType" placeholder="搜索拆包类型">
          <Option v-for="(val,ind) in formStateData" :key="ind+'查询'" :value="val.type" :label="val.type"></Option>
        </Select>
      </FormItem>
      <FormItem prop="unpackName" label="拆包名称">
        <Input type="text" v-model="formInline.unpackName" placeholder="搜索拆包名称"/>
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
      :data="tableData"></Table>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="800">
      <div slot="header">模拟器拆包信息编辑</div>

      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="11">
            <FormItem label="类型" prop="unpackType">
              <Select v-model="formValidate.unpackType" @on-change="typeChange" placeholder="请选择类型">
                <Option v-for="(val,ind) in formStateData" :key="ind" :value="val.type" :label="val.type"></Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="名称" prop="unpackName">
              <Input v-model="formValidate.unpackName" placeholder="请输入名称"/>
            </FormItem>
          </i-col>
          <i-col :span="22">
            <FormItem label="配置" prop="unpackConf">
              <vue-json-editor
                v-model="formValidate.unpackConf"
                :mode="'code'"
                @json-change="onJsonChange"
                lang="zh">
              </vue-json-editor>
            </FormItem>
          </i-col>
          <i-col :span="22">
            <FormItem label="备注" prop="remarks">
              <Input v-model="formValidate.remarks" :autosize="{minRows: 3,maxRows: 5}" type="textarea" placeholder="备注信息"/>
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
  import vueJsonEdit from 'vue-json-editor'
  import {requestServices} from '../../api/api.js'
  export default {
    components:{
      'vue-json-editor':vueJsonEdit,
    },
    data () {
      return {
        //查询
        formInline: {
          unpackName: '',
          unpackType: ''
        },
        ruleInline: {},
        //列表数据
        selectionData:[],//复选框id数组
        tableColumns: [
          {
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            title: '名称',
            key: 'unpackName',
            align: 'center',
            maxWidth:150,
            minWidth:80,
            tooltip:true,
          },
          {
            title: '类型',
            key: 'unpackType',
            align: 'center',
            maxWidth:150,
            minWidth:80
          },
          {
            title: '配置',
            key: 'unpackConf',
            align: 'center',
            tooltip:true,
            minWidth:150
          },
          {
            title: '备注',
            key: 'remarks',
            minWidth:150,
            tooltip:true,
            align: 'center'
          },
          {
            title: '操作',
            fixed:'right',
            minWidth: 80,
            maxWidth:120,
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
        //弹框
        formVisible:false,//编辑表单显示
        tableLoading:false,//列表数据加载
        saveLoading:false,//表单提交加载
        //form表单数据
        formStateData:[],//拆包类型状态码
        formValidate: {
          unpackName:'',
          unpackConf:'',
          remarks:'',
          unpackType:'',
        },
        ruleForm: {
          unpackName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          unpackType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ]
        },
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    created(){
      this.getList();
      this.getTypeList();
    },
    methods: {
      getTypeList(type,conf){
        //获取拆包类型
        requestServices.unpackTypeList()
          .then(res=>{
            this.formStateData = res.unpackTypeList;
            if(type){
              this.formStateData.forEach((val)=>{
                if(val.type===type){
                  val.jsonConf = conf;
                  return false;
                }
              })
            }
          })
      },
      //类型改变，替换配置信息
      typeChange(value){
        this.formStateData.forEach((val)=>{
          if(val.type===value){
            this.formValidate.unpackConf=JSON.parse(val.jsonConf);
            return false;
          }
        })
      },
      //配置JSON
      onJsonChange(value){
        this.formStateData.forEach((val)=>{
          if(val.type===this.formValidate.unpackType){
            val.jsonConf = JSON.stringify(value);
            return false;
          }
        })
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
        requestServices.unpackList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          unpackName:this.formInline.unpackName,
          unpackType:this.formInline.unpackType
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      //新增
      addBtn(){
        this.getTypeList();
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this. formValidate= {
          unpackName:'',
          unpackConf:'',
          remarks:'',
          unpackType:'',
        }
      },
      //修改
      editBtn (params) {
        this.getTypeList(params.row.unpackType,params.row.unpackConf);
        this.formVisible=true;
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formValidate.id = params.row.id;
        this.formValidate.unpackName = params.row.unpackName;
        this.formValidate.unpackConf = JSON.parse(params.row.unpackConf);
        this.formValidate.remarks = params.row.remarks;
        this.formValidate.unpackType = params.row.unpackType;
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
              requestServices.unpackDelete(self.selectionData)
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
              requestServices.unpackUpdate({
                id:self.formValidate.id,
                unpackName:self.formValidate.unpackName,
                unpackConf:JSON.stringify(self.formValidate.unpackConf),
                remarks:self.formValidate.remarks,
                unpackType:self.formValidate.unpackType,
              })
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
              requestServices.unpackSave({
                unpackName:self.formValidate.unpackName,
                unpackConf:JSON.stringify(self.formValidate.unpackConf),
                remarks:self.formValidate.remarks,
                unpackType:self.formValidate.unpackType,
              }).then((res)=>{
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
