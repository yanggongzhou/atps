<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">机器管理</span>
    </div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :label-width="40"
      :rules="ruleInline"
      class="machineSearchBox"
      style=" min-width:840px "
      @submit.native.prevent>
      <FormItem prop="ip" label="IP">
        <Input type="text" v-model="formInline.ip" placeholder="搜索IP"/>
      </FormItem>
      <FormItem prop="state" label="状态">
        <Select v-model="formInline.state" placeholder="搜索状态">
          <Option v-for="(val,ind) in formStateData" :key="ind+'状态'" :value="val.code" :label="val.name"></Option>
        </Select>
      </FormItem>
      <FormItem prop="site" label="位置">
        <Select v-model="formInline.site" placeholder="搜索位置">
          <Option v-for="(val,ind) in siteData" :key="ind+'位置'" :value="val.site" :label="val.label"></Option>
        </Select>
      </FormItem>
      <FormItem prop="type" label="类型">
        <Select v-model="formInline.type" placeholder="搜索类型">
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
      <div slot="header">机器信息编辑</div>

      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="11">
            <FormItem label="IP" prop="ip">
              <Input v-model="formValidate.ip" placeholder="请输入IP"/>
            </FormItem>

            <FormItem label="状态" prop="state">
              <Select v-model="formValidate.state" placeholder="请选择机器状态">
                <Option v-for="(val,ind) in formStateData" :key="ind" :value="val.code" :label="val.name"></Option>
              </Select>
            </FormItem>
            <FormItem prop="site" label="位置">
              <Select v-model="formValidate.site" placeholder="请选择机器位置">
                <Option v-for="(val,ind) in siteData" :key="ind+'位置'" :value="val.site" :label="val.label"></Option>
              </Select>
            </FormItem>
            <FormItem prop="type" label="类型">
              <Select v-model="formValidate.type" placeholder="请选择所属类型">
                <Option v-for="(val,ind) in $global.typeData" :key="ind+'类型'" :value="val.type" :label="val.label"></Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="CPU" prop="cpu">
              <Input v-model="formValidate.cpu" number placeholder="请输入CPU">
              <span slot="append">单位/核数</span>
              </Input>
            </FormItem>
            <FormItem label="内存" prop="mem">
              <Input v-model="formValidate.mem" number placeholder="请输入内存">
                <span slot="append">单位/G</span>
              </Input>
            </FormItem>
            <FormItem label="root密码" prop="rootPasswd">
              <Input v-model="formValidate.rootPasswd" type="password" placeholder="请输入密码"/>
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
      const checkIPValidator = (rule,value,callback)=>{
        let params = {
          ip:value,
          id:this.formValidate.id
        }
        requestServices.machineCheckIP(params)
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
        siteData:[],
        formInline: {
          ip: '',
          state: '',
          type:'',
          site:''
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
            title: 'IP',
            key: 'ip',
            align: 'center',
            minWidth:120,
            tooltip:true,
          },
          {
            title: 'CPU (核)',
            key: 'cpu',
            align: 'center',
            minWidth:80,
          },
          {
            title: '内存(G)',
            key: 'mem',
            minWidth:80,
            align: 'center'
          },
          {
            title: '机器状态',
            key: 'state',
            align: 'center',
            minWidth:110,
            render: (h, params) => {
              let self = this;
              const color = params.row.state === parseInt( Object.keys(self.$global.machineState)[0]) ? 'error' : 'success';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, self.$global.machineState[params.row.state]);
            }
          },
          {
            title: '位置',
            key: 'site',
            minWidth:80,
            align: 'center',
            render: (h, params) => {
              let self = this,siteName;
              self.siteData.forEach(val=>{
                if(val.site===params.row.site){
                  siteName=val.label
                  return false;
                }
              });
              return h('div', siteName);
            },
            tooltip:true
          },
          {
            title: '测试类型',
            key: 'type',
            minWidth:80,
            align: 'center',
            render: (h, params) => {
              let self = this,typeName;
              self.$global.typeData.forEach(val=>{
                if(val.type===params.row.type){
                  typeName=val.label
                }
              });
              return h('div', typeName);
            },
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
        formStateData:[],//机器状态码
        formValidate: {
          ip:'',
          cpu:'',
          mem:'',
          state:'',
          type:'',
          site:'',
          rootPasswd:'',
        },
        ruleForm: {
          ip: [
            { required: true, message: '请输入ip', trigger: 'blur' },
            {validator:checkIPValidator,trigger: 'blur' }
          ],
          cpu: [
            { required: true, type:'number', message: '请输入cpu核数', trigger: 'blur' }
          ],
          type:[
            { required: true, type:'number', message: '请选择所属类型', trigger: 'change' }
          ],
          site:[
            { required: true, type:'number', message: '请选择机器位置', trigger: 'change' }
          ],
          mem: [
            { required: true,type:'number', message: '请输入内存大小', trigger: 'blur' }
          ],
          state: [
            { required: true, type:'number', message: '请选择机器状态', trigger: 'change' }
          ],
          rootPasswd: [
            { required: true, message: '请输入root密码', trigger: 'blur' }
          ]
        },
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    created(){
      //获取机器状态码
      let val;
      for (val in this.$global.machineState){
        this.formStateData.push({code:parseInt(val),name:this.$global.machineState[val]})
      }
      this.getList();
      this.getSiteList();
    },
    methods: {
      //获取位置
      getSiteList(){
        requestServices.siteList()
          .then(res=>{
            res.siteList.forEach(val=>{
              let key = Object.keys(val)[0]
              this.siteData.push({site:parseInt(key),label:val[key]})
            })
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
        requestServices.machineList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          ip:this.formInline.ip,
          state:this.formInline.state,
          type:this.formInline.type,
          site:this.formInline.site
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
          ip:'',
          cpu:'',
          mem:'',
          state:0,
          type:'',
          site:'',
          rootPasswd:'',
        }
      },
      //修改
      editBtn (params) {
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.ip = params.row.ip;
        this.formValidate.cpu = params.row.cpu;
        this.formValidate.mem = params.row.mem;
        this.formValidate.site = params.row.site;
        this.formValidate.type = params.row.type;
        this.formValidate.state = params.row.state;
        this.formValidate.rootPasswd = params.row.rootPasswd;
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
              requestServices.machineDelete(self.selectionData)
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
              requestServices.machineUpdate(self.formValidate)
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
              requestServices.machineSave(self.formValidate)
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
