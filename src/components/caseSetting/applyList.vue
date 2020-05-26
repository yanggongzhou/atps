<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">待分配申请</span>
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
    <!--&lt;!&ndash;全新部署&ndash;&gt;-->
    <!--<Drawer-->
      <!--class="apply-drawer"-->
      <!--v-model="deployFormVisible"-->
      <!--placement="left"-->
      <!--:closable="false"-->
      <!--width="500"-->
      <!--:mask-closable="false">-->
      <!--<div slot="header">全新部署模拟器实例</div>-->
      <!--<Form ref="deployFormValidate" :model="deployFormValidate" :rules="deployRule" :label-width="90" @submit.native.prevent>-->
        <!--<FormItem label="模拟器类型" prop="simuName">-->
          <!--<Input readonly v-model="deployFormValidate.simuName" @on-focus="simuSelect" placeholder="Enter Your IP"/>-->
        <!--</FormItem>-->
        <!--<FormItem label="部署套数" prop="expectProgressNum">-->
          <!--<Input v-model="deployFormValidate.expectProgressNum" number placeholder="Enter Your expectProgressNum"/>-->
        <!--</FormItem>-->
        <!--<FormItem label="TPS" prop="maxTps">-->
          <!--<Input v-model="deployFormValidate.maxTps" number placeholder="Enter Your maxTps"/>-->
        <!--</FormItem>-->
        <!--<FormItem label="最大并发数" prop="expectThread">-->
          <!--<Input v-model="deployFormValidate.expectThread" number placeholder="Enter Your expectThread"/>-->
        <!--</FormItem>-->
        <!--<FormItem label="备注" prop="remarks">-->
          <!--<Input-->
            <!--v-model="deployFormValidate.remarks"-->
            <!--:autosize="{minRows: 3,maxRows: 5}"-->
            <!--type="textarea"-->
            <!--placeholder="Enter your Describe"/>-->
        <!--</FormItem>-->
      <!--</Form>-->
      <!--<div class="apply-drawer-footer">-->
        <!--<Button  @click="deployFormVisible=false">取消</Button>-->
        <!--<Button type="primary" :loading="saveLoading" @click="saveBtn('deployFormValidate',-1)">保存</Button>-->
        <!--<Button type="success" :loading="saveLoading"  @click="saveBtn('deployFormValidate',0)">提交</Button>-->
      <!--</div>-->
    <!--</Drawer>-->

    <!--部署空闲或已回收的实例--复用部署-->
    <Modal
      class="ModalBox"
      v-model="deployFormVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">复用部署模拟器实例</div>
      <Form ref="deployFormValidate" :model="deployFormValidate" :rules="deployRule" :label-width="90" @submit.native.prevent>
        <FormItem label="模拟器实例" prop="instanceId">
          <Select v-model="deployFormValidate.instanceId" filterable placeholder="请选择实例">
            <Option
              v-for="(val,ind) in instanceSpaceData"
              :key="ind+'空闲实例'"
              :value="val.id"
              :label="val.userName+' '+val.ip+' '+val.adapterType">
              <span>{{val.userName}}</span>
              <span>{{val.ip}}</span>
              <span>{{val.adapterType}}</span>
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="deployFormVisible=false">取消</Button>
        <Button type="primary" :loading="deploySaveLoading" @click="deploySaveBtn('deployFormValidate')">部署</Button>
      </div>
    </Modal>
    <!--全新部署-->
    <Modal
      class="ModalBox"
      v-model="newDeployFormVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">全新部署模拟器实例</div>
      <Form ref="newDeployFormValidate" :model="newDeployFormValidate" :rules="newDeployRule" :label-width="90" @submit.native.prevent>
        <FormItem label="机器" prop="machineId">
          <Select v-model="newDeployFormValidate.machineId" filterable placeholder="请选择机器">
            <Option v-for="(val,ind) in machineData"
                    :key="ind+'机器'"
                    :value="val.id"
                    :label="'IP'+val.ip+'   /   CPU'+val.cpu+'   /   '+val.mem+'G'"></Option>
          </Select>
        </FormItem>
          <FormItem label="实例用户名" prop="userName">
            <Input v-model="newDeployFormValidate.userName" placeholder="请输入实例用户名"/>
          </FormItem>
          <FormItem label="实例密码" prop="userPwd">
            <Input v-model="newDeployFormValidate.userPwd" placeholder="请输入实例密码"/>
          </FormItem>
          <FormItem label="备注" prop="remarks">
            <Input
              v-model="newDeployFormValidate.remarks"
              :autosize="{minRows: 3,maxRows: 5}"
              type="textarea"
              placeholder="备注信息"/>
          </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="newDeployFormVisible=false">取消</Button>
        <Button type="primary" :loading="newDeploySaveLoading" @click="newDeploySaveBtn('newDeployFormValidate')">部署</Button>
        <Button type="success" :loading="newDeploySaveLoading" @click="migrationSaveBtn('newDeployFormValidate')">迁移部署</Button>
      </div>
    </Modal>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">待分配模拟器申请信息编辑</div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="90" @submit.native.prevent>
        <FormItem label="任务名称" prop="taskName">
          <Input v-model="formValidate.taskName" placeholder="请输入任务名称"/>
        </FormItem>
        <FormItem label="起止日期" prop="timeArea">
          <DatePicker
            v-model="formValidate.timeArea"
            @on-change="beginDateAreaChange"
            type="daterange"
            show-week-numbers
            placement="bottom-end"
            placeholder="请选择起止日期"
            style="width: 100%">
          </DatePicker>
        </FormItem>
        <FormItem label="模拟器类型" prop="simuTypeId">
          <Select v-model="formValidate.simuTypeId" filterable placeholder="请选择模拟器类型">
            <Option
              v-for="(val,ind) in simuData"
              :key="ind+'模拟器'"
              :value="val.id"
              :label="val.chsName+'('+val.name+')'+'- -'+val.adapterType"></Option>
          </Select>
        </FormItem>
        <FormItem label="任务编码" prop="taskNo">
          <Input v-model="formValidate.taskNo" placeholder="请输入任务编码"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="formVisible=false">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="saveBtn('formValidate',$global.editState.save)">保存</Button>
        <Button type="success" :loading="saveLoading"  @click="saveBtn('formValidate',$global.editState.commit)">提交</Button>
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
            title: '预估并发用户数',
            align: 'center',
            key: 'expectThread',
            width:125
          },
          {
            title: '部署',
            width: 130,
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    ghost:true
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.newDeployBtn(params)
                    }
                  }
                }, '全新'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    ghost:true
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.deployBtn(params)
                    }
                  }
                }, '复用')
              ]);
            }
          },
          {
            title: '操作',
            width: 90,
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
        newDeployFormVisible:false,
        newDeploySaveLoading:false,
        migrationSaveLoading:false,
        machineData:[],
        newDeployFormValidate:{
          applyId:'',
          taskId:'',
          machineId:'',
          userName:'',
          userPwd:'',
          adapterType:'',
          remarks:'',
          simuTypeId:'',
        },
        newDeployRule:{
          machineId: [
            { required: true,type:'number', message: '请选择机器', trigger: 'change' }
          ],
          userName: [
            { required: true, message: '请输入实例用户名', trigger: 'blur' }
          ],
          userPwd: [
            { required: true, message: '请输入实例密码', trigger: 'blur' }
          ]
        },
        instanceSpaceData:[],//空闲实例
        deployFormVisible:false,
        deploySaveLoading:false,
        deployFormValidate:{
          id:'',
          instanceId:'',
        },
        deployRule:{
          instanceId: [
            { required: true,type:'number', message: '请选择模拟器实例', trigger: 'change' }
          ]
        },

        simuData:[],//全部模拟器类型
        formVisible:false,//编辑表单显示
        tableLoading:false,//列表数据加载
        saveLoading:false,//表单提交加载
        //form表单数据
        formValidate: {
          taskName:'',
          taskNo:'',
          timeArea:[],
          simuTypeId:'',
        },
        ruleForm: {
          taskName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' }
          ],
          taskNo: [
            { required: true, message: '请输入编码', trigger: 'blur' }
          ],
          timeArea:[
            { required: true, type:'array', message: '请选择时间范围', trigger: 'blur' }
          ],
          simuTypeId: [
            { required: true,type:'number', message: '请选择模拟器', trigger: 'change' }
          ],
        },
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
      requestServices.simuList()
        .then((res)=>{
          this.simuData = res.page.rows
        });
      requestServices.machineList()
        .then((res)=>{
          this.machineData = res.page.rows
        });
      let space = parseInt(Object.keys(this.$global.instanceState)[0])
      requestServices.instanceAllList({
        state:space
      }).then(res=>{
        this.instanceSpaceData = res.page.rows;
      });
      this.getList();
    },
    methods: {
      beginDateAreaChange(val){
//        console.log(val)
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
        requestServices.applyList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          type:parseInt(this.$route.query.type)
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      //修改
      editBtn (params) {
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.taskName = params.row.taskName;
        this.formValidate.taskNo = params.row.taskNo;
        this.formValidate.timeArea.length = 0;
        this.formValidate.timeArea.push(params.row.beginDate);
        this.formValidate.timeArea.push(params.row.endDate);

        this.formValidate.userName = params.row.userName;
        this.formValidate.simuTypeId=params.row.simuTypeId;
      },
      //复用部署
      deployBtn(params){
        this.deployFormVisible=true;
        this.deploySaveLoading=false;
        this.deployFormValidate.id=params.row.id;
        this.deployFormValidate.instanceId=''
      },
      deploySaveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.deploySaveLoading=true;
            let aab = setTimeout(function () {
              self.deploySaveLoading = false
            },1000);
            requestServices.instanceDeploy({
              id:this.deployFormValidate.id,
              instanceId:this.deployFormValidate.instanceId,
              type:parseInt(this.$route.query.type)
            }).then(res=>{
              this.deploySaveLoading=false;
              clearTimeout(aab);
              if(res.code=0){
                self.deployFormVisible=false;
                self.$Message.success('部署成功！');
                self.getList();
              }else{
                self.$Message.error('部署失败！');
              }
            })
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      },
      //全新部署
      newDeployBtn(params){
        this.newDeployFormVisible=true;
        this.newDeploySaveLoading=false;
        this.newDeployFormValidate = {
            applyId:'',
            taskId:'',
            machineId:'',
            userName:'',
            userPwd:'',
            adapterType:'',
            remarks:'',
            simuTypeId:'',
            type:'',
          };
        this.newDeployFormValidate.applyId=params.row.id;
        this.newDeployFormValidate.taskId=params.row.taskId;
        this.newDeployFormValidate.adapterType=params.row.adapterType;
        this.newDeployFormValidate.simuTypeId=params.row.simuTypeId;
        this.newDeployFormValidate.type=parseInt(this.$route.query.type)
      },
      //全新部署保存
      newDeploySaveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.newDeploySaveLoading=true;
            let aab = setTimeout(function () {
              self.newDeploySaveLoading = false
            },1000);
            requestServices.instanceNewDeploy(this.newDeployFormValidate)
              .then((res)=>{
                self.newDeploySaveLoading=false;
                clearTimeout(aab)
                if(res.code===0){
                  self.$Message.success('部署成功！');
                  self.newDeployFormVisible=false;
                  self.getList()
                }else{
                  this.$Message.error('部署失败！');
                }
              })
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
          }
        })
      },
      //迁移部署保存
      migrationSaveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.migrationSaveLoading=true;
            let aab = setTimeout(function () {
              self.migrationSaveLoading = false
            },3000);
            requestServices.instanceMigration(this.newDeployFormValidate)
              .then((res)=>{
                self.migrationSaveLoading=false;
                clearTimeout(aab)
                if(res.code===0){
                  self.$Message.success('部署成功！');
                  self.newDeployFormVisible=false;
                  self.getList()
                }else{
                  this.$Message.error('部署失败！');
                }
              })
          } else {
            this.$Message.error('提交失败,请确认表单信息！');
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
            content:'确认取消选中数据的申请信息',
            onOk:()=>{
              requestServices.applyDelete(self.selectionData)
                .then(res=>{
                  if(res.code===0){
                    self.$Message.success('已取消申请！')
                    self.getList();
                  }
                })
            },
            onCancel:()=>{
              self.$Message.info('放弃操作！')
            }
          })
        }else{
          self.$Message.warning('请勾选 √ 所要取消申请的数据！');
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
            requestServices.applyUpdate({
              id:self.formValidate.id,
              simuTypeId:self.formValidate.simuTypeId,
              taskNo:self.formValidate.taskNo,
              beginDate:self.formValidate.timeArea[0],
              endDate:self.formValidate.timeArea[1],
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
