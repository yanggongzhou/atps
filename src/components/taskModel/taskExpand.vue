<style>
  .simulist-tip{
    margin-top: 10px;
    display: inline-block;
    color: #ff9900;
  }
</style>
<template>
  <div class="taskExpandAll">
    <!--<div class="sb-title title-font-one">-->
      <!--<span class="sb-title-span">申请信息</span>-->
    <!--</div>-->
    <div class="taskExpand-header">
      <span class="taskExpand-title">申请信息</span>
      <div class="taskExpandBox-edit">
        <Button type="success" size="small" @click="addBtn">全新申请</Button>
        <Button type="success" size="small" @click="againBtn">复用申请</Button>
        <Button type="error" size="small"  @click="delBtn">删除申请</Button>
      </div>
    </div>
    <div class="taskExpandBox">
      <Table
        class="tableApplyBox"
        stripe
        border
        size="small"
        @on-selection-change="selectionChange"
        :columns="tableColumns"
        :data="applyList"></Table>
      <!--分割线-->
      <!--<div style="border-bottom: 1px dashed #0e82fd;padding-bottom: 20px;"></div>-->
      <!--全新申请-->
      <Modal
        class="ModalBox"
        v-model="formVisible"
        closable
        :mask-closable="false"
        :width="800">
        <div slot="header"> 申请信息编辑</div>
        <!--查询-->
        <Form
          v-if="listShow"
          ref="formInline"
          :model="formInline"
          :inline="true"
          :label-width="130"
          style="margin-left: 40px"
          @submit.native.prevent>
          <FormItem label="关键字" prop="key">
            <Input size="small" type="text" v-model="formInline.key" placeholder="筛选模拟器类型列表"/>
          </FormItem>
          <FormItem :label-width="0">
            <Button size="small" type="primary" @click="onSearch('formInline')">查询</Button>
            <Button size="small" type="info" @click="reSearch('formInline')">重置</Button>
          </FormItem>
          <span class="simulist-tip" >*单击选中模拟器类型</span>
        </Form>
        <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="90" @submit.native.prevent>
          <Row :gutter="20">
            <i-col :span="24">
              <FormItem v-if="listShow" label="模拟器类型" prop="simuTypeId">
                <div>
                  <!--模拟器类型列表-->
                  <Table
                    class="simu-modal-table"
                    highlight-row
                    stripe
                    border
                    size="small"
                    ref="currentRowTable"
                    :loading="simuTableVisible"
                    @on-current-change="simuSelectChange"
                    :columns="simuColumns"
                    :data="simuData"></Table>
                  <!--分页-->
                  <div class="clearfix">
                    <Page size="small" @on-change="goPage" class="right" :total="totalPage" :page-size="$global.pageSize/2" :current="currentPage" show-total></Page>
                  </div>
                </div>
                <!--<Input readonly v-model="formValidate.simuName" placeholder="Please Select Type"/>-->
              </FormItem>
              <FormItem v-if="!listShow" label="模拟器类型">
                <span>{{chsName}} - {{simuName}}</span>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="TPS" prop="maxTps">
                <Input v-model="formValidate.maxTps" number placeholder="请输入最大TPS"/>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="最大并发数" prop="expectThread">
                <Input v-model="formValidate.expectThread" number placeholder="请输入最大并发数"/>
              </FormItem>
            </i-col>
            <i-col :span="24">
              <FormItem label="备注" prop="remarks">
                <Input
                  placeholder="备注信息"
                  v-model="formValidate.remarks"
                  :autosize="{minRows: 3,maxRows: 5}"
                  type="textarea"/>
              </FormItem>
            </i-col>
          </Row>
        </Form>
        <div slot="footer">
          <Button  @click="formVisible=false">取消</Button>
          <Button type="primary" :loading="saveLoading" @click="saveBtn('formValidate',$global.editState.save)">保存</Button>
          <Button type="success" :loading="saveLoading"  @click="saveBtn('formValidate',$global.editState.commit)">提交</Button>
        </div>
      </Modal>

      <!--复用申请-->
      <Modal
        class="ModalBox"
        v-model="formVisibleA"
        closable
        :mask-closable="false"
        :width="800">
        <div slot="header"> 复用申请信息编辑</div>
        <!--查询-->
        <Form
          ref="formInlineA"
          :model="formInlineA"
          :inline="true"
          :label-width="130"
          style="margin-left: 40px"
          @submit.native.prevent>
          <FormItem label="关键字" prop="key">
            <Input size="small" type="text" v-model="formInlineA.key" placeholder="筛选模拟器实例列表"/>
          </FormItem>
          <FormItem :label-width="0">
            <Button size="small" type="primary" @click="onSearchA('formInlineA')">查询</Button>
            <Button size="small" type="info" @click="reSearchA('formInlineA')">重置</Button>
          </FormItem>
          <span class="simulist-tip">*单击选中模拟器类型</span>
        </Form>
        <Form ref="formValidateA" :model="formValidateA" :rules="ruleFormA" :label-width="90" @submit.native.prevent>
          <Row :gutter="20">
            <i-col :span="24">
              <FormItem label="模拟器实例" prop="instanceId">
                <div>
                  <!--模拟器实例列表-->
                  <Table
                    class="simu-modal-table"
                    highlight-row
                    stripe
                    border
                    size="small"
                    ref="currentRowTableA"
                    :loading="instanceVisible"
                    @on-current-change="instanceSelectChange"
                    :columns="instanceColumns"
                    :data="instanceData"></Table>
                  <!--分页-->
                  <div class="clearfix">
                    <Page size="small" @on-change="goPage" class="right" :total="instanceTotalPage" :page-size="$global.pageSize/2" :current="currentPage" show-total></Page>
                  </div>
                </div>
                <!--<Input readonly v-model="formValidate.simuName" placeholder="Please Select Type"/>-->
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="TPS" prop="maxTps">
                <Input v-model="formValidateA.maxTps" number placeholder="请输入最大TPS"/>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="最大并发数" prop="expectThread">
                <Input v-model="formValidateA.expectThread" number placeholder="请输入最大并发数"/>
              </FormItem>
            </i-col>
            <i-col :span="24">
              <FormItem label="备注" prop="remarks">
                <Input
                  placeholder="备注信息"
                  v-model="formValidateA.remarks"
                  :autosize="{minRows: 3,maxRows: 5}"
                  type="textarea"/>
              </FormItem>
            </i-col>
          </Row>
        </Form>
        <div slot="footer">
          <Button  @click="formVisibleA=false">取消</Button>
          <Button type="primary" :loading="saveLoading" @click="saveABtn('formValidateA',$global.editState.save)">保存</Button>
          <Button type="success" :loading="saveLoading"  @click="saveABtn('formValidateA',$global.editState.commit)">提交</Button>
        </div>
      </Modal>
    </div>
  </div>

</template>
<script>
  import {requestServices} from '../../api/api.js'
  import {auth} from '../../api/auth.js'
  export default {
    props: {
      row: Object,
    },
    data(){
      return{
        //模拟器类型查询
        formInline: {
          key: ''
        },
        simuData:[],//全部模拟器类型
        simuTableVisible:false,

        applyList:[],
        tableColumns:[
          {
            type: 'selection',
            width: 55,
            fixed:'left',
            align: 'center'
          },
          {
            title: '模拟器类型',
            align: 'center',
            key: 'chsName',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '最高tps',
            key: 'maxTps',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '预估并发数',
            key: 'expectThread',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '状态',
            key: 'state',
            align: 'center',
            minWidth:100,
            render: (h, params) => {
              let self = this;
              return h('span',self.$global.applyState[params.row.state]);
            }
          },
          {
            title: 'IP',
            key: 'ip',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '用户名',
            key: 'userName',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '密码',
            key: 'userPwd',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '操作',
            fixed:'right',
            minWidth: 80,
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

        //列表数据
        selectionData:[],//复选框id数组
        listShow:true,
        simuName:'',
        chsName:'',
        formVisible:false,
        formValidate: {
          simuTypeId:'',
          simuName:'',
          taskId:'',
          maxTps:'',
          expectThread:'',
          expectProgressNum:1,
          remarks:'',
        },
        ruleForm:{
          simuTypeId:[
            { required: true, type:'number', message: '请选择模拟器类型', trigger: 'change' }
          ]
        },

        simuColumns:[
          {
            title: '#',
            type: 'index',
            width: 50,
            align: 'center'
          },
          {
            title: '系统简称',
            key: 'name',
            align: 'center',
            minWidth:90,
            tooltip:true,
          },
          {
            title: '中文名称',
            key: 'chsName',
            align: 'center',
            minWidth:90,
            tooltip:true,
          },
          {
            title: '适配器类型',
            key: 'adapterType',
            align: 'center',
            minWidth:90
          },
          {
            title: '配置',
            key: 'jsonConf',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '备注',
            key: 'remarks',
            minWidth:80,
            tooltip:true,
            align: 'center'
          }
        ],
        saveLoading:false,
        //        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
        //   实例分页
        instanceTotalPage:10,//总条数

        //复用实例列表
        instanceVisible:false,
        instanceColumns:[
          {
            title: '#',
            type:'index',
            align: 'center',
            width:50
          },
          {
            title: 'IP地址',
            key: 'ip',
            align: 'center',
            minWidth:135,
            render: (h, params) => {
              return h('div', [
                h('strong', params.row.ip)
              ]);
            }
          },
          {
            title: '模拟器类型',
            key: 'simuName',
            align: 'center',
            minWidth:100,
          },
          {
            title: '状态',
            key: 'state',
            minWidth:90,
            align: 'center',
            render: (h, params) => {
              let self = this;
              return h('div', [
                self.$global.instanceState[params.row.state]
              ])
            }
          },
          {
            title: '用户名',
            key: 'userName',
            align: 'center',
            minWidth:90,
            tooltip:true,
          },
          {
            title: '密码',
            key: 'userPwd',
            align: 'center',
            minWidth:90,
            tooltip:true,
          },
        ],
        instanceData:[],
        formVisibleA:false,
        formValidateA: {
          instanceId:'',
          simuTypeId:'',
          simuName:'',
          taskId:'',
          maxTps:'',
          expectThread:'',
          remarks:'',
        },
        ruleFormA:{
          instanceId:[
            { required: true, type:'number', message: '请选择模拟器实例', trigger: 'change' }
          ]
        },
        formInlineA:{
          key:''
        },
      }
    },
    created(){
      this.getList();
      this.getSimuList();
      this.getInstanceListForReuse();
    },
    methods:{
      //查询
      onSearchA(name) {
        this.getInstanceListForReuse(this.formInlineA.key);
      },
      //重置
      reSearchA(name){
        this.$refs[name].resetFields();
        this.getInstanceListForReuse();
      },
      //复用申请实例列表单选
      instanceSelectChange(val){
        this.formValidateA.instanceId=val.instanceId;
        this.formValidateA.simuTypeId=val.simuTypeId;
        this.formValidateA.simuName=val.simuName;
      },
      //曾经使用过的实例列表供复用申请选择
      getInstanceListForReuse(key){
        requestServices.instanceListForReuse({
          creator:auth.getCookie('userId'),
          key:key,
          page:this.currentPage,
          limit:this.$global.pageSize/2,
        }).then(res=>{
          this.instanceVisible=false;
          this.instanceData = res.page.rows;
          this.instanceTotalPage = res.page.total;
        })
      },
      //添加复用申请
      againBtn(){
        this.currentPage=1;
        this.saveLoading=false;
        this.formVisibleA=true;
        this.$refs.currentRowTableA.clearCurrentRow();
        this.$refs.formValidateA.resetFields();
        this. formValidateA= {
          instanceId:'',
          simuTypeId:'',
          simuName:'',
          taskId:'',
          maxTps:'',
          expectThread:'',
          remarks:'',
        }
      },
      saveABtn(name,num){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.saveLoading=true;
            let aab = setTimeout(function () {
              self.saveLoading = false
            },1000);
            if(self.formValidateA.id){
              requestServices.taskApplyUpdate({
                id:self.formValidateA.id,
                instanceId:self.formValidateA.instanceId,
                simuTypeId:self.formValidateA.simuTypeId,
                taskId:self.row.id,
                maxTps:self.formValidateA.maxTps,
                expectThread:self.formValidateA.expectThread,
                remarks:self.formValidateA.remarks,
                state:num
              }).then((res)=>{
                  if(res.code===0){
                    self.$Message.success('修改成功！');
                    self.formValidateA=false;
                    self.saveLoading=false;
                    clearTimeout(aab);
                    self.getList();
                  }
                })
            }else{
              requestServices.taskApplySave({
                instanceId:self.formValidateA.instanceId,
                simuTypeId:self.formValidateA.simuTypeId,
                taskId:self.row.id,
                maxTps:self.formValidateA.maxTps,
                expectThread:self.formValidateA.expectThread,
                remarks:self.formValidateA.remarks,
                state:num,
                type:parseInt(self.$route.query.type)
              }).then((res)=>{
                if(res.code===0){
                  self.$Message.success('保存成功！');
                  self.formValidateA=false;
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
      //查询
      onSearch(name) {
        this.getSimuList(this.formInline.key);
      },
      //重置
      reSearch(name){
        this.$refs[name].resetFields();
        this.getSimuList();
      },
      //获取模拟器类型列表
      getSimuList(key){
        this.simuTableVisible=true;
        requestServices.simuList({
          key:key,
          page:this.currentPage,
          limit:this.$global.pageSize/2,
        }).then((res)=>{
          this.simuTableVisible=false;
            this.simuData = res.page.rows;
            this.totalPage = res.page.total;
          });
      },
      //模拟器列表单选
      simuSelectChange(val){
        this.formValidate.simuTypeId=val.id;
        this.formValidate.simuName=val.name;
      },
      //获取列表
      getList(){
        requestServices.taskApplyList(this.row.id)
          .then(res=>{
          this.applyList = res.applyList;
        });
      },
      //新增
      addBtn(){
        this.listShow =true;
        this.currentPage=1;
        this.saveLoading=false;
        this.formVisible=true;
        this.$refs.currentRowTable.clearCurrentRow();
        this.$refs.formValidate.resetFields();
        this. formValidate= {
          simuTypeId:'',
          simuName:'',
          taskId:'',
          maxTps:'',
          expectThread:'',
          remarks:'',
        }
      },
      //修改
      editBtn (params) {
        this.saveLoading=false;
        this.formVisible=true;
        this.listShow =false;
        this.$refs.formValidate.resetFields();
        this.chsName= params.row.chsName;
        this.simuName= params.row.simuName;
        this.formValidate.id = params.row.id;
        this.formValidate.simuTypeId = params.row.simuTypeId;
        this.formValidate.simuName = params.row.simuName;
        this.formValidate.taskId = params.row.taskId;
        this.formValidate.maxTps = params.row.maxTps;
        this.formValidate.expectThread = params.row.expectThread;
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
              requestServices.taskApplyDelete(self.selectionData)
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
              requestServices.taskApplyUpdate({
                id:self.formValidate.id,
                simuTypeId:self.formValidate.simuTypeId,
                taskId:self.row.id,
                maxTps:self.formValidate.maxTps,
                expectThread:self.formValidate.expectThread,
                remarks:self.formValidate.remarks,
                state:num
              }).then((res)=>{
                  if(res.code===0){
                    self.$Message.success('修改成功！');
                    self.formVisible=false;
                    self.saveLoading=false;
                    clearTimeout(aab);
                    self.getList();
                  }
                })
            }else{
              requestServices.taskApplySave({
                simuTypeId:self.formValidate.simuTypeId,
                taskId:self.row.id,
                maxTps:self.formValidate.maxTps,
                expectThread:self.formValidate.expectThread,
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
        this.getSimuList(this.formInline.key)
      },
    }
  };
</script>
