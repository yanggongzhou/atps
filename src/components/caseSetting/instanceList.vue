<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">全部实例</span>
    </div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :label-width="60"
      :rules="ruleInline"
      class="peopleSearchBox"
      style=" min-width:800px "
      @submit.native.prevent>
      <FormItem prop="ip" label="IP">
        <Input type="text" v-model="formInline.ip" placeholder="搜索IP"/>
      </FormItem>
      <FormItem prop="state" label="状态">
        <Select v-model="formInline.state" placeholder="搜索状态">
          <Option v-for="(val,ind) in formInlineStateData" :key="ind+'查询'" :value="val.code" :label="val.name"></Option>
        </Select>
      </FormItem>
      <!--<FormItem prop="type" label="测试类型">-->
        <!--<Select v-model="formInline.type" placeholder="搜索类型">-->
          <!--<Option v-for="(val,ind) in $global.typeData" :key="ind+'类型'" :value="val.type" :label="val.label"></Option>-->
        <!--</Select>-->
      <!--</FormItem>-->
      <FormItem :label-width="0">
        <Button type="primary" @click="onSearch('formInline')">查询</Button>
        <Button type="info" @click="reSearch('formInline')">重置</Button>
      </FormItem>
    </Form>
    <!--列表-->
    <Table
      class="tableBox"
      stripe
      border
      :loading="tableLoading"
      :columns="tableColumns"
      :data="tableData"></Table>

    <!--分页-->
    <div class="clearfix">
      <Page  @on-change="goPage" class="pageSizeBox right" :total="totalPage" :page-size="$global.pageSize" :current="currentPage" show-total></Page>
    </div>
    <!--修改密码-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">修改密码</div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="90" @submit.native.prevent>
        <FormItem label="密码" prop="userPwd">
          <Input v-model="formValidate.userPwd" placeholder="请输入密码"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="formVisible=false">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="saveBtn('formValidate')">确认修改</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
  import {requestServices} from '../../api/api.js'
  export default {
    data () {
      return {
        //查询
        formInline: {
          ip: '',
          state:'',
//          type:'',
        },
        ruleInline: {},
        //列表数据
        tableColumns: [
          {
            title: '#',
            type:'index',
            fixed:'left',
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
//          {
//            title: '测试类型',
//            key: 'type',
//            minWidth:90,
//            align: 'center',
//            render: (h, params) => {
//              let self = this,typeName;
//              self.$global.typeData.forEach(val=>{
//                if(val.type===params.row.type){
//                  typeName=val.label
//                }
//              });
//              return h('div', typeName);
//            },
//            tooltip:true,
//          },
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
          {
            title: '操作',
            minWidth: 80,
            maxWidth:120,
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
                      this.changePwd(params)
                    }
                  }
                }, '修改密码')
              ]);
            }
          }
        ],
        tableData: [],
        formInlineStateData:[],
        //弹框
        formVisible:false,
        saveLoading:false,
        formValidate:{
          id:'',
          userName:'',
          machineId:'',
          userPwd:'',
        },
        ruleForm:{
          userPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
        },
        instanceStateData:[],
        tableLoading:false,//列表数据加载
        //分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    created(){
      //获取状态码
      let val;
      for (val in this.$global.instanceState){
        this.instanceStateData.push({code:parseInt(val),name:this.$global.instanceState[val]})
      }

      this.instanceStateData.forEach((val)=>{
        if(val.name!=="已删除"){
          this.formInlineStateData.push(val)
        }
      });
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
        requestServices.instanceAllList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          ip:this.formInline.ip,
          state:this.formInline.state,
//          type:this.formInline.type
//          type:parseInt(this.formInline.type)
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      //修改密码
      changePwd (params) {
        this.formVisible=true;
        this.formVisible=true;
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formValidate.id = params.row.id;
        this.formValidate.machineId = params.row.machineId;
        this.formValidate.userName = params.row.userName;
        this.formValidate.userPwd = params.row.userPwd;
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
            requestServices.changePasswd(self.formValidate)
              .then((res)=>{
                if(res.code===0){
                  self.$Message.success('修改成功！');
                  self.formVisible=false;
                  self.saveLoading=false;
                  clearTimeout(aab);
                  self.getList();
                }
              })
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
