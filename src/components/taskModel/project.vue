<template>
  <div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :rules="ruleInline"
      class="searchBox"
      style=" min-width:800px "
      @submit.native.prevent>
      <FormItem style="width: 50%" :label-width="100" label="项目名称" prop="kw">
        <Select
          placeholder="输入选择项目"
          v-model="formInline.kw"
          remote
          filterable>
          <Option v-for="(val,index) in projectItemData"
                  :value="val.name" :key="index+'项目'"
                  :label="val.name+'('+val.abbr+')'">
            <div class="center">
              <span>{{val.name}}</span>
              ---
              <span>{{ val.abbr }}</span>
            </div>
          </Option>
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
      class="tableBox taskTableBox"
      stripe
      border
      :loading="tableLoading"
      @on-selection-change="selectionChange"
      :columns="tableColumns"
      :data="tableData">
      <template slot-scope="{ row, index }" slot="people">
        <span class="user-show" v-for="(val,index) in row.taskUsers" :key="index+'人员标签'">
          <span :title="val.loginName">{{val.userName}}</span>
          <Icon v-if="!val.manager" class="user-del-icon" @click="userDelBtn(val)" type="md-close" />
          <Icon v-if="val.manager" class="user-manager-icon" type="ios-alert" title="当前任务申请人" />
        </span>
        <Button type="primary" ghost size="small" icon="md-add" style="margin-right: 5px" @click="userAddBtn(row)"></Button>
      </template>
    </Table>
    <Modal
      class="ModalBox"
      v-model="userFormVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">任务组员选择</div>
      <Form ref="userFormValidate" :model="userFormValidate"  :rules="userRuleForm" :label-width="90" @submit.native.prevent>
        <FormItem label="选择成员" prop="userIds">
          <Select
            placeholder="任务参与人员"
            v-model="userFormValidate.userIds"
            remote
            :remote-method="getSearchUser"
            filterable>
            <Option v-for="(user,index) in userData"
                    :value="user.id" :key="index+'人员'"
                    :label="user.loginName+'('+user.userName+')'">
              <div class="center">
                <span>{{user.loginName}}</span>
                ---
                <span>{{ user.userName }}</span>
              </div>
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="userFormVisible=false">取消</Button>
        <Button type="success" @click="userSaveBtn('userFormValidate')">确认</Button>
      </div>
    </Modal>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="500">
      <div slot="header">功能测试——项目信息编辑</div>
      <Form class="mr20" ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="90" @submit.native.prevent>
            <FormItem label="选择项目" prop="itemId">
              <Select
                placeholder="输入选择项目"
                v-model="formValidate.itemId"
                remote
                filterable>
                <Option v-for="(val,ind) in projectItemData"
                        :value="val.id" :key="ind+'项目'"
                        :label="val.name+'('+val.abbr+')'">
                  <div class="center">
                    <span>{{val.name}}</span>
                    ---
                    <span>{{ val.abbr }}</span>
                  </div>
                </Option>
              </Select>
            </FormItem>
            <FormItem label="备注信息" prop="remarks">
              <Input
                v-model="formValidate.remarks"
                :autosize="{minRows: 5,maxRows: 8}"
                type="textarea"/>
            </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="formVisible=false">取消</Button>
        <Button type="success" :loading="saveLoading"  @click="saveBtn('formValidate')">提交</Button>
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
  import taskExpand from './taskExpand'
  export default {
    components: { taskExpand },
    data () {
      return {
        //查询
        formInline: {
          kw: '',
        },
        ruleInline: {},
        //列表数据
        projectItemData:[],//全部项目
        selectionData:[],//复选框id数组
        tableColumns:  [
          {
            type: 'selection',
            width: 50,
            align: 'center'
          },
          {
            title: '项目名称',
            key:'taskName',
            align: 'center',
            minWidth:120,
            tooltip:true,
          },
          {
            title: '项目编号',
            key:'taskNo',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '参与人员',
            align: 'center',
            slot: 'people',
            minWidth:200,
          },
          {
            title: '申请信息',
            type: 'expand',
            align: 'center',
            minWidth:100,
            render: (h, params) => {
              return h(taskExpand, {
                props: {
                  row: params.row
                },
              })
            }
          },
          {
            title: '操作',
            minWidth: 100,
            maxWidth: 120,
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
        userData:[],//全部人员
        userFormVisible:false,
        userFormValidate:{
          taskId:'',
          userIds:'',
        },
        userRuleForm:{
          userIds: [
            { required: true, type:'number', message: '请选择测试人员', trigger: 'change' }
          ],
        },
        formVisible:false,//编辑表单显示
        tableLoading:false,//列表数据加载
        saveLoading:false,//表单提交加载
        //form表单数据
        formValidate: {
          itemId:'',
          remarks:'',
        },
        ruleForm: {
          itemId:[
            { required: true, type:'number', message: '请选择项目', trigger: 'change' }
          ],
        },
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    mounted(){
      this.initList();
      this.getList(true);
    },
    methods: {
      //初始请求数据
      initList(){
        //获取全部项目
        requestServices.projectItemList()
          .then(res=>{
            this.projectItemData=res.list
          })
        //获取全部人员
        requestServices.userList()
          .then((res)=>{
            this.userData = res.page.rows
          });
      },
      //参与人员
      userAddBtn(row){
        this.userFormVisible=true;
        this.userFormValidate.taskId=row.id;
        this.userFormValidate.userIds='';
      },
      userDelBtn(val){
        requestServices.taskUserDel({ids:[val.id]})
          .then(res=>{
            this.getList();
          })
      },
      userSaveBtn(name){
        this.$refs[name].validate((valid) => {
          if (valid) {
            requestServices.taskUserSave({
              userIds:[parseInt(this.userFormValidate.userIds)],
              taskId:this.userFormValidate.taskId
            }).then(res=>{
              this.userFormVisible=false;
              this.getList();
            });
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      },
      //加载查询参与人员
      getSearchUser(){
        console.log(123)
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
      getList(buer){
        this.tableLoading=true;
        requestServices.projectList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          kw:this.formInline.kw,
        }).then(res=>{
          this.tableLoading=false;
          this.tableData=res.page.rows;
          if(this.tableData.length&&buer){
            this.tableData[0]._expanded=true;
          }
          this.totalPage = res.page.total;
        })
      },
      //新增
      addBtn(){
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate= {
          itemId:'',
          remarks:'',
        };
      },
      //修改
      editBtn (params) {
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.itemId = params.row.itemId;
        this.formValidate.remarks = params.row.remarks;
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
              requestServices.taskDelete(self.selectionData)
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
              requestServices.projectUpdate({
                id:self.formValidate.id,
                itemId:self.formValidate.itemId,
                remarks:self.formValidate.remarks,
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
              requestServices.projectSave({
                itemId:self.formValidate.itemId,
                remarks:self.formValidate.remarks,
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
        this.getList(true)
      },
    }
  }
</script>
