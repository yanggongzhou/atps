<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">已分配实例</span>
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
      <FormItem prop="ip" label="IP">
        <Input type="text" v-model="formInline.ip" placeholder="搜索IP"/>
      </FormItem>
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
  </div>
</template>
<script>
  import {requestServices} from '../../api/api.js'
  export default {
    data () {
      return {
        //查询
        formInline: {
          ip: ''
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
            title: '使用任务名称',
            key: 'taskName',
            minWidth:110,
            align: 'center',
            tooltip:true
          },
          {
            title: '模拟器类型',
            key: 'simuName',
            align: 'center',
            minWidth:100,
          },
          {
            title: '开始日期',
            key: 'beginDate',
            minWidth:90,
            tooltip:true,
            align: 'center'
          },
          {
            title: '结束日期',
            key: 'endDate',
            minWidth:90,
            tooltip:true,
            align: 'center'
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
          {
            title: '操作',
            minWidth: 100,
            maxWidth:120,
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon:'md-trash'
                  },
                  on: {
                    click: () => {
                      this.recoverBtn(params)
                    }
                  }
                }, '回收')
              ]);
            }
          }
        ],
        tableData: [],
        //弹框
        instanceStateData:[],
        tableLoading:false,//列表数据加载

//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    watch:{
      $route() {
        this.getList();
      }
    },
    created(){
      //获取状态码
      let val;
      for (val in this.$global.instanceState){
        this.instanceStateData.push({code:parseInt(val),name:this.$global.instanceState[val]})
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
      //获取列表
      getList(){
        this.tableLoading=true;
        requestServices.instanceList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          ip:this.formInline.ip,
          type:parseInt(this.$route.query.type)
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      //回收
      recoverBtn (params) {
        let self = this;
        this.$Modal.confirm({
          title:'提示',
          content:'回收后将暂停模拟器实例，密码重置将为随机数。 是否回收当前实例数据?',
          onOk:()=>{
            requestServices.instanceRecover(params.row.taskApplyInstRelId)
              .then(res=>{
                if(res.code===0){
                  self.$Message.success('已回收！')
                  self.getList();
                }
              })
          },
          onCancel:()=>{
            self.$Message.info('已取消回收！')
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
