<template>
  <div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :label-width="100"
      :rules="ruleInline"
      class="searchBox"
      style=" min-width:650px "
      @submit.native.prevent>
      <FormItem prop="taskName" label="任务名称">
        <Input type="text" v-model="formInline.taskName" placeholder="搜索任务名称"/>
      </FormItem>
      <FormItem prop="taskNo" label="任务编号">
        <Input type="text" v-model="formInline.taskNo" placeholder="搜索任务编号"/>
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
            placeholder="多选，任务参与人员"
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
      :width="800">
      <div slot="header">非功能测试——任务信息编辑</div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="90" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="11">
            <FormItem label="任务名称" prop="taskName">
              <Input v-model="formValidate.taskName" placeholder="请输入任务名称"/>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="开始日期" prop="beginDate">
              <DatePicker type="date"
                          placeholder="请选择开始日期"
                          @on-change="beginDateChange"
                          v-model="formValidate.beginDate"
                          style="width: 100%"></DatePicker>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="任务编号" prop="taskNo">
              <Input v-model="formValidate.taskNo" placeholder="请输入任务编号"/>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="结束日期" prop="endDate">
              <DatePicker type="date"
                          placeholder="请选择开始日期"
                          v-model="formValidate.endDate"
                          :options="{
                            disabledDate (date){
                              return date && date.valueOf() < new Date(formValidate.beginDate).getTime();
                            }
                          }"
                          style="width: 100%"></DatePicker>
            </FormItem>
          </i-col>
          <i-col :span="22">
            <FormItem label="备注" prop="remarks">
              <Input
                placeholder="备注信息"
                v-model="formValidate.remarks"
                :autosize="{minRows: 3,maxRows: 6}"
                type="textarea"/>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button  @click="formVisible=false">取消</Button>
        <Button type="success" :loading="saveLoading"  @click="saveBtn('formValidate',$global.editState.commit)">提交</Button>
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
          taskName: '',
          taskNo: '',
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
            title: '参与人员',
            align: 'center',
            slot: 'people',
            minWidth:200,
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
            title: '申请信息',
            type: 'expand',
            align: 'center',
            minWidth:100,
            render: (h, params) => {
              let self=this;
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
          beginDate:'',
          endDate:'',
          taskName:'',
          taskNo:'',
          remarks:'',
        },
        ruleForm: {
          beginDate: { required: true,type:'date', message: '请选择日期', trigger: 'change' },
          endDate: { required: true,type:'date', message: '请选择日期', trigger: 'change' },
          taskName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ]
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
        //获取全部人员
        requestServices.userList()
          .then((res)=>{
            this.userData = res.page.rows
          });
      },
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
      beginDateChange(val){
        if(this.formValidate.endDate){
          if(new Date(this.formValidate.endDate).getTime()<new Date(val).getTime()){
            return this.formValidate.endDate = '';
          }
        }
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
        requestServices.taskList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          taskNo:this.formInline.taskNo,
          taskName:this.formInline.taskName,
          type:parseInt(this.$route.query.type)
        }).then(res=>{
          this.tableLoading=false;
          this.tableData = res.page.rows;
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
          beginDate:'',
          endDate:'',
          taskName:'',
          taskNo:'',
          remarks:'',
        };
      },
      //修改
      editBtn (params) {
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.taskName = params.row.taskName;
        this.formValidate.taskNo = params.row.taskNo;
        this.formValidate.beginDate = params.row.beginDate;
        this.formValidate.endDate = params.row.endDate;
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
      saveBtn(name,num){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.saveLoading=true;
            let aab = setTimeout(function () {
              self.saveLoading = false
            },1000);
            if(self.formValidate.id){
              requestServices.taskUpdate({
                id:self.formValidate.id,
                taskName:self.formValidate.taskName,
                taskNo:self.formValidate.taskNo,
                beginDate:self.formValidate.beginDate,
                endDate:self.formValidate.endDate,
                remarks:self.formValidate.remarks,
                state:num
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
              requestServices.taskSave({
                taskName:self.formValidate.taskName,
                taskNo:self.formValidate.taskNo,
                beginDate:self.formValidate.beginDate,
                endDate:self.formValidate.endDate,
                remarks:self.formValidate.remarks,
                state:num,
                type:parseInt(self.$route.query.type)
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
