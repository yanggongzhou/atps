<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">待审核复用申请</span>
    </div>
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
      <Button type="error"  @click="delBtn">取消申请</Button>
    </div>
    <Table
      class="tableBox"
      stripe
      border
      :loading="tableLoading"
      @on-selection-change="selectionChange"
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
          taskName: '',
          taskNo: '',
        },
        ruleInline: {},
        //列表数据
        saveLoading:false,
        selectionData:[],//复选框id数组
        tableColumns: [
          {
            type: 'selection',
            width: 52,
            fixed:'left',
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
            title: '模拟器类型',
            key:'simuName',
            align: 'center',
            tooltip:true,
            minWidth:100
          },
          {
            title: '适配器类型',
            key:'adapterType',
            align: 'center',
            tooltip:true,
            minWidth:100
          },
          {
            title: '开始日期',
            key: 'beginDate',
            minWidth:100,
            tooltip:true,
            align: 'center'
          },
          {
            title: '结束日期',
            key: 'endDate',
            minWidth:100,
            tooltip:true,
            align: 'center'
          },
          {
            title: '申请人',
            key:'userName',
            align: 'center',
            minWidth:100,
            tooltip:true,
          },
          {
            title: '中文名',
            align: 'center',
            key: 'chsName',
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
          {
            title: '操作',
            minWidth: 130,
            maxWidth:200,
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    loading:this.saveLoading,
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.examineBtn(params)
                    }
                  }
                }, '审核通过')
              ]);
            }
          }
        ],
        tableData: [],
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
        requestServices.repeatApplyList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          type:parseInt(this.$route.query.type)
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },

      //部署
      examineBtn(params){
        let self = this;
        self.saveLoading=true;
        let aab = setTimeout(function () {
          self.saveLoading = false
        },1000);
        requestServices.instanceNewDeploy({
          instanceId:params.row.instanceId,
          adapterType:params.row.adapterType,
          applyId:params.row.id,
          machineId:params.row.machineId,
          remarks:params.row.remarks,
          simuTypeId:params.row.simuTypeId,
          taskId:params.row.taskId,
          userName:params.row.userName,
          userPwd:params.row.userPwd,
          type:parseInt(this.$route.query.type)
        }).then((res)=>{
            if(res.code===0){
              this.$Message.success('已审核！');
              self.saveLoading = false;
              clearTimeout(aab);
              this.getList()
            }
          })
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
            content:'确认取消选中数据的复用申请数据',
            onOk:()=>{
              requestServices.applyDelete(self.selectionData)
                .then(res=>{
                  if(res.code===0){
                    self.$Message.success('已取消！')
                    self.getList();
                  }
                })
            },
            onCancel:()=>{
              self.$Message.info('放弃取消申请！')
            }
          })
        }else{
          self.$Message.warning('请勾选 √ 所要取消申请的数据！');
        }
      },
      goPage(val){
        this.currentPage=val;
        this.getList()
      },
    }
  }
</script>
