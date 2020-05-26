<style>
  .loginName-show{
    display: inline-block;
    background: #808695;
    border-radius: 2px;
    font-weight: 600;
    color: white;
    padding: 0 10px;
  }
</style>
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">人员管理</span>
    </div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :rules="ruleInline"
      :label-width="60"
      class="peopleSearchBox"
      style=" min-width:700px "
      @submit.native.prevent>
      <FormItem prop="userName" label="姓名">
        <Input type="text" v-model="formInline.userName" placeholder="请输入姓名"/>
      </FormItem>
      <FormItem prop="isSuper" label="管理权限">
        <Select v-model="formInline.isSuper" placeholder="请选择权限">
          <Option v-for="(val,ind) in formStateData" :key="ind+'查询'" :value="val.code" :label="val.name"></Option>
        </Select>
      </FormItem>
      <FormItem prop="defaultType" label="测试类型">
        <Select v-model="formInline.defaultType" placeholder="搜索类型">
          <Option v-for="(val,ind) in $global.typeData" :key="ind+'类型'" :value="val.type" :label="val.label"></Option>
        </Select>
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
      :columns="tableColumns"
      @on-selection-change="selectionChange"
      :data="tableData"></Table>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="800">
      <div slot="header">人员信息编辑</div>

      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="11">
            <FormItem label="登录名" prop="loginName">
              <Input v-if="loginNameShow" v-model="formValidate.loginName" placeholder="请输入登录名"/>
              <div class="loginName-show" v-if="!loginNameShow">{{formValidate.loginName}}</div>
            </FormItem>
            <FormItem label="登录密码" prop="password">
              <Input v-model="formValidate.password" placeholder="请输入登录密码"/>
            </FormItem>
            <FormItem prop="isSuper" label="管理权限">
              <Select v-model="formValidate.isSuper" placeholder="请选择权限">
                <Option v-for="(val,ind) in formStateData" :key="ind+'查询'" :value="val.code" :label="val.name"></Option>
              </Select>
            </FormItem>
            <FormItem prop="defaultType" label="测试类型">
              <Select v-model="formValidate.defaultType" placeholder="请选择所属类型">
                <Option v-for="(val,ind) in $global.typeData" :key="ind+'类型'" :value="val.type" :label="val.label"></Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="姓名" prop="userName">
              <Input v-model="formValidate.userName" placeholder="请输入姓名"/>
            </FormItem>
            <FormItem label="邮箱" prop="email">
              <Input v-model="formValidate.email" placeholder="请输入邮箱"/>
            </FormItem>
            <FormItem label="电话" prop="mobileNum">
              <Input v-model="formValidate.mobileNum" placeholder="请输入电话号"/>
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
      <Page  @on-change="goPage" class="pageSizeBox right" :total="totalPage" :page-size="$global.pageSize" :current="currentPage" show-total></Page>
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
          userName: '',
          isSuper: '',
          defaultType:''
        },
        ruleInline: {},
        //列表数据
        tableColumns: [
          {
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            title: '登录名',
            minWidth:60,
            key: 'loginName',
            align: 'center',
            tooltip:true,
          },
          {
            title: '姓名',
            minWidth:50,
            key: 'userName',
            align: 'center',
            tooltip:true,
          },
          {
            title: '管理权限',
            align: 'center',
            minWidth:70,
            render:(h,params)=>{
              let self = this;
              return h('span',self.$global.isSuper[params.row.isSuper])
            }
          },
          {
            title: '测试类型',
            key: 'defaultType',
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              let self = this,typeName;
              self.$global.typeData.forEach(val=>{
                if(val.type===params.row.defaultType){
                  typeName=val.label
                }
              });
              return h('div', typeName);
            },
            tooltip:true,
          },
          {
            title: '电话',
            minWidth:90,
            key: 'mobileNum',
            align: 'center',
            tooltip:true,
          },
          {
            title: '邮箱',
            minWidth:90,
            key: 'email',
            align: 'center',
            tooltip:true,
          },
          {
            title: '操作',
            width: 80,
            fixed:'right',
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
        selectionData:[],
        //弹框
        tableLoading:false,//列表数据加载
        //form表单数据
        formVisible:false,//编辑表单显示
        saveLoading:false,//表单提交加载
        loginNameShow:true,//登录名不能修改
        formValidate: {
          loginName:'',
          password:'',
          userName:'',
          isSuper:'',
          mobileNum:"",
          email:"",
          defaultType:'',
        },
        ruleForm: {
          loginName: [
            { required: true, message: '请输入登录名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          isSuper: [
            { required: true, type:'number', message: '请选择权限', trigger: 'change' }
          ],
          defaultType:[
            { required: true, type:'number', message: '请选择测试类型', trigger: 'change' }
          ],
        },
        formStateData:[],//人员权限类型
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    created(){
      //获取用户权限
      let val;
      for (val in this.$global.isSuper){
        this.formStateData.push({code:parseInt(val),name:this.$global.isSuper[val]})
      }
      this.getList();
    },
    methods: {
      //查询
      onSearch(name) {
        this.getList();
      },
      //重置
      reSearch(name){
        this.$refs[name].resetFields();
        this.getList();
      },
      //新增
      addBtn(){
        this.loginNameShow=true;
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this. formValidate= {
          loginName:'',
          password:'',
          userName:'',
          isSuper:'',
          mobileNum:"",
          email:"",
          defaultType:''
        }
      },
      //修改
      editBtn (params) {
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.loginNameShow=false;
        this.formValidate.id = params.row.id;
        this.formValidate.loginName = params.row.loginName;
        this.formValidate.password = params.row.password;
        this.formValidate.userName = params.row.userName;
        this.formValidate.isSuper = params.row.isSuper;
        this.formValidate.email = params.row.email;
        this.formValidate.mobileNum = params.row.mobileNum;
        this.formValidate.defaultType = params.row.defaultType;
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
              requestServices.userDelete(self.selectionData)
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
              requestServices.userUpdate(self.formValidate)
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
              requestServices.userSave(self.formValidate)
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
      //获取列表
      getList(){
        this.tableLoading=true;
        requestServices.userList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          userName:this.formInline.userName,
          isSuper:this.formInline.isSuper,
          defaultType:this.formInline.defaultType
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      goPage(val){
        this.currentPage=val;
        this.getList()
      },
    }
  }
</script>
