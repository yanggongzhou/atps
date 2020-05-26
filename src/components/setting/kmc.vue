<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">KMC管理</span>
    </div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :label-width="60"
      :rules="ruleInline"
      class="searchBox"
      style=" min-width:560px "
      @submit.native.prevent>
      <FormItem prop="kmcIp" label="KMC IP">
        <Input type="text" v-model="formInline.kmcIp" placeholder="请输入KMC对应IP"/>
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
      <div slot="header">KMC信息编辑</div>

      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="11">
            <FormItem label="KMC IP" prop="kmcIp">
              <Input v-model="formValidate.kmcIp" placeholder="请输入KMC对应IP"/>
            </FormItem>
            <FormItem label="节点" prop="kmcNodeId">
              <Input v-model="formValidate.kmcNodeId" placeholder="请输入节点"/>
            </FormItem>
            <FormItem label="授权码" prop="auth">
              <Input v-model="formValidate.auth" number placeholder="请输入授权码"/>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="启动口令" prop="p12Ping">
              <Input v-model="formValidate.p12Ping" placeholder="请输入启动口令"/>
            </FormItem>
            <FormItem label="端口" prop="kmcPort">
              <Input v-model="formValidate.kmcPort" number placeholder="请输入端口"/>
            </FormItem>
          </i-col>
          <i-col :span="22">
            <FormItem label="备注" prop="remarks">
              <Input v-model="formValidate.remarks" :autosize="{minRows: 3,maxRows: 5}" type="textarea"/>
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
      const checkIPValidator = (rule,value,callback)=>{
        let params = {
          ip:value,
          id:this.formValidate.id
        }
        requestServices.kmcCheckIP(params)
          .then((res)=>{
            if(res.code===-1){
              callback(new Error(res.msg))
            }else{
              callback()
            }
          })
      };
      return {
        //查询
        formInline: {
          kmcIp: ''
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
            title: 'KMC IP',
            key: 'kmcIp',
            align: 'center',
            minWidth:110,
            tooltip:true,
          },
          {
            title: '端口',
            key: 'kmcPort',
            align: 'center',
            minWidth:80,
          },
          {
            title: '节点',
            key: 'kmcNodeId',
            minWidth:80,
            align: 'center'
          },
          {
            title: '授权码',
            key: 'auth',
            align: 'center',
            minWidth:80,
            tooltip:true,
          },
          {
            title: '启动口令',
            key: 'p12Ping',
            align: 'center',
            minWidth:90,
            tooltip:true,
          },
          {
            title: '操作',
            minWidth: 80,
            maxWidth:150,
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
        //弹框
        formVisible:false,//编辑表单显示
        tableLoading:false,//列表数据加载
        saveLoading:false,//表单提交加载
        //form表单数据
        formValidate: {
          kmcIp:'',
          kmcNodeId:'',
          kmcPort:'',
          auth:'',
          p12Ping:'',
          remarks:''
        },
        ruleForm: {
          kmcIp: [
            { required: true, message: '请输入kmcIp', trigger: 'blur' },
            {validator:checkIPValidator,trigger: 'blur' }
          ],
          kmcNodeId: [
            { required: true, message: '请输入节点', trigger: 'blur' }
          ],
          kmcPort: [
            { required: true,type:'number', message: '请输入端口号', trigger: 'blur' }
          ],
          auth: [
            { required:true, type:'number',  message: '请输入授权码', trigger: 'blur' }
          ],
          p12Ping: [
            { required: true, message: '请输入启动口令', trigger: 'blur' }
          ]
        },
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    created(){
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
      //获取列表
      getList(){
        this.tableLoading=true;
        requestServices.kmcList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          kmcIp:this.formInline.kmcIp
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      //新增
      addBtn(){
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this. formValidate= {
          kmcIp:'',
          kmcNodeId:'',
          kmcPort:'',
          auth:'',
          p12Ping:'',
          remarks:''
        }
      },
      //修改
      editBtn (params) {
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.kmcIp = params.row.kmcIp;
        this.formValidate.kmcNodeId = params.row.kmcNodeId;
        this.formValidate.kmcPort = params.row.kmcPort;
        this.formValidate.auth = params.row.auth;
        this.formValidate.p12Ping = params.row.p12Ping;
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
              requestServices.kmcDelete(self.selectionData)
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
              requestServices.kmcUpdate(self.formValidate)
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
              requestServices.kmcSave(self.formValidate)
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
