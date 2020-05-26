<style>
  .searchunpackname{
    margin-top: 7px;
    float: left;
    width: calc(100% - 33px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .simuconf-content{
    display: inline-block;
    width: 100%;
    word-wrap: break-word;
  }
</style>
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">模拟器类型组装</span>
    </div>
    <!--查询-->
    <Form
      ref="formInline"
      :model="formInline"
      :inline="true"
      :rules="ruleInline"
      :label-width="80"
      class="searchBox"
      style=" min-width:1200px "
      @submit.native.prevent>
      <FormItem prop="adapterType" label="适配器">
        <Select v-model="formInline.adapterType" placeholder="筛选适配器类型">
          <Option v-for="(val,ind) in formStateData" :key="ind+'查询'" :value="val.type" :label="val.type"></Option>
        </Select>
      </FormItem>
      <FormItem prop="chsName" label="中文名">
        <Input type="text" v-model="formInline.chsName" placeholder="搜索中文名"/>
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
      :data="tableData">
      <template slot="jsonConf" slot-scope="{row,index}">
        <Tooltip max-width="500" placement="left" :content="row.jsonConf">
          <Icon type="ios-alert"/>
        </Tooltip>
      </template>
    </Table>
    <!--交易类型查看-->
    <Modal
      class="ModalBox"
      v-model="searchVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">交易码识别信息</div>

      <Form :model="searchForm" :label-width="80" @submit.native.prevent>
        <FormItem label="名称:" prop="searchName">
          <span>{{searchForm.searchName}}</span>
        </FormItem>
        <FormItem label="类型:" prop="searchType">
          <span>{{searchForm.searchType}}</span>
        </FormItem>
        <FormItem label="配置:" prop="searchConf">
          <span class="simuconf-content">{{searchForm.searchConf}}</span>
        </FormItem>
        <FormItem label="备注:" prop="remarks">
          <span>{{searchForm.remarks}}</span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="searchVisible=false">确定</Button>
      </div>
    </Modal>
    <!--拆包类型查看-->
    <Modal
      class="ModalBox"
      v-model="unpackVisible"
      closable
      :mask-closable="false"
      :width="400">
      <div slot="header">拆包类型信息</div>

      <Form :model="unpackForm" :label-width="80" @submit.native.prevent>
        <FormItem label="名称:" prop="unpackName">
          <span>{{unpackForm.unpackName}}</span>
        </FormItem>
        <FormItem label="类型:" prop="unpackType">
          <span>{{unpackForm.unpackType}}</span>
        </FormItem>
        <FormItem label="配置:" prop="unpackConf">
          <span class="simuconf-content">{{unpackForm.unpackConf}}</span>
        </FormItem>
        <FormItem label="备注:" prop="remarks">
          <span>{{unpackForm.remarks}}</span>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="unpackVisible=false">确定</Button>
      </div>
    </Modal>
    <!--安全组件查看-->
    <Modal
      class="ModalBox"
      v-model="secVisible"
      closable
      :mask-closable="false"
      :width="800">
      <div slot="header">安全组件信息</div>
      <Form :model="secForm" :label-width="80" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="11">
            <FormItem label="名称:" prop="secName">
              <span>{{secForm.secName}}</span>
            </FormItem>
            <FormItem label="类型:" prop="secType">
              <span>{{secForm.secType}}</span>
            </FormItem>
            <FormItem label="shell脚本:" prop="installShell">
              <span>{{secForm.installShell}}</span>
            </FormItem>
            <FormItem label="变量名:" prop="installVar">
              <span  class="simuconf-content">{{secForm.installVar}}</span>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem label="启动命令:" prop="startCmd">
              <span>{{secForm.startCmd}}</span>
            </FormItem>
            <FormItem label="停止命令:" prop="stopCmd">
              <span>{{secForm.stopCmd}}</span>
            </FormItem>
            <FormItem label="确认命令:" prop="confirmCmd">
              <span>{{secForm.confirmCmd}}</span>
            </FormItem>
            <FormItem label="环境变量:" prop="appendProfile">
              <span class="simuconf-content">{{secForm.appendProfile}}</span>
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <div slot="footer">
        <Button  @click="secVisible=false">确定</Button>
      </div>
    </Modal>
    <!--编辑-->
    <Modal
      class="ModalBox"
      v-model="formVisible"
      closable
      :mask-closable="false"
      :width="800">
      <div slot="header">模拟器类型组装</div>

      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="80" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="7">
            <FormItem label="类型" prop="adapterType">
              <Select v-model="formValidate.adapterType" @on-change="typeChange" placeholder="请选择适配器类型">
                <Option v-for="(val,ind) in formStateData" :key="ind+'适配器'" :value="val.type" :label="val.type"></Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="7">
            <FormItem label="英文名" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入英文名"/>
            </FormItem>
          </i-col>
          <i-col :span="7">
            <FormItem label="中文名" prop="chsName">
              <Input v-model="formValidate.chsName" placeholder="请输入中文名"/>
            </FormItem>
          </i-col>
          <i-col :span="22">
            <FormItem label="配置" prop="jsonConf">
              <vue-json-editor
                v-model="formValidate.jsonConf"
                :mode="'code'"
                @json-change="onJsonChange"
                lang="zh">
              </vue-json-editor>
            </FormItem>
          </i-col>
          <i-col :span="7">
            <FormItem label="交易识别" prop="searchId">
             <Select v-model="formValidate.searchId" filterable placeholder="请选择交易识别方式">
               <Option v-for="(val,ind) in searchData" :key="ind+'交易识别类型'" :value="val.id" :label="val.searchName"></Option>
             </Select>
            </FormItem>
          </i-col>
          <i-col :span="7">
            <FormItem label="拆包类型" prop="unpackId">
              <Select v-model="formValidate.unpackId" filterable placeholder="请选择拆包类型">
                <Option v-for="(val,ind) in unpackData" :key="ind+'拆包类型'" :value="val.id" :label="val.unpackName"></Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="7">
            <FormItem label="安全组件" prop="secId">
              <Select v-model="formValidate.secId" filterable placeholder="请选择安全组件">
                <Option v-for="(val,ind) in secData" :key="ind+'安全组件'" :value="val.id" :label="val.secName"></Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="7">
            <FormItem label="编码" prop="isEBCDIC">
              <Checkbox v-model="formValidate.isEBCDIC">EBCDIC编码</Checkbox>
            </FormItem>
          </i-col>
          <i-col :span="7">
            <FormItem label="编码方式" prop="encode">
              <Input v-model="formValidate.encode" placeholder="请输入编码方式"/>
            </FormItem>
          </i-col>
          <i-col :span="22">
            <FormItem label="备注" prop="remarks">
              <Input v-model="formValidate.remarks" :autosize="{minRows: 3,maxRows: 5}" type="textarea" placeholder="备注信息"/>
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
  import vueJsonEdit from 'vue-json-editor'
  import {requestServices} from '../../api/api.js'
  export default {
    components:{
      'vue-json-editor':vueJsonEdit,
    },
    data () {
      return {
        //查询
        formInline: {
          adapterType: '',
          chsName:''
        },
        ruleInline: {},
        //列表数据
        selectionData:[],//复选框id数组
        tableColumns: [
          {
            type: 'selection',
            width: 52,
            fixed:'left',
            align: 'center'
          },
          {
            title: '英文名',
            key: 'name',
            align: 'center',
            minWidth:80,
            maxWidth:150,
            tooltip:true,
          },
          {
            title: '中文名',
            key: 'chsName',
            align: 'center',
            minWidth:80,
            maxWidth:150,
            tooltip:true,
          },
          {
            title: '适配器类型',
            key: 'adapterType',
            align: 'center',
            minWidth:100,
            maxWidth:150,
            tooltip:true,
          },
          {
            title: '交易码识别类型',
            align: 'center',
            minWidth:150,
            maxWidth:180,
            tooltip:true,
            render: (h, params) => {
              let self = this;
              let _searchName;
              self.searchData.forEach(val=>{
                if(val.id===params.row.searchId){
                  _searchName=val.searchName;
                }
              });
              if(_searchName){
                return  h('div',[
                  h('Button', {
                    props: {
                      type:'info',
                      size: 'small',
                      ghost:true,
                      icon:'md-eye',
                      title:'点击预览'
                    },
                    style: {
                      float:'left',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.searchBtn(params)
                      }
                    }
                  }),
                  h('span',{class:'searchunpackname'}, _searchName)
                ])
              }else{
                return  h('div','空')
              }
            }
          },
          {
            title: '拆包类型',
            align: 'center',
            minWidth:150,
            maxWidth:180,
            tooltip:true,
            render: (h, params) => {
              let self = this;
              let _unpackName;
              self.unpackData.forEach(val=>{
                if(val.id===params.row.unpackId){
                  _unpackName=val.unpackName;
                }
              });
                if(_unpackName){
                  return  h('div',{
                    class:'clearflex'
                  }, [
                    h('Button', {
                      props: {
                        type:'info',
                        size: 'small',
                        ghost:true,
                        icon:'md-eye',
                        title:'点击预览'
                      },
                      style: {
                        float:'left',
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.unpackBtn(params)
                        }
                      }
                    }),
                    h('span', {class:'searchunpackname'},_unpackName)
                  ])
                }else{
                  return  h('div','空')
                }
            }
          },
          {
            title: '安全组件',
            align: 'center',
            minWidth:150,
            maxWidth:180,
            tooltip:true,
            render: (h, params) => {
              let self = this;
              let _secName;
              self.secData.forEach(val=>{
                if(val.id===params.row.secId){
                  _secName=val.secName;
                }
              });
              if(_secName){
                return  h('div',{
                  class:'clearflex'
                },[
                  h('Button', {
                    props: {
                      type:'info',
                      size: 'small',
                      ghost:true,
                      icon:'md-eye',
                      title:'点击预览'
                    },
                    style: {
                      float:'left',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.secBtn(params)
                      }
                    }
                  }),
                  h('span', {class:'searchunpackname'},_secName)
                ])
              }else{
                return  h('div','空')
              }
            }
          },
          {
            title: '具体配置',
            slot: 'jsonConf',
            align: 'center',
            width:100
          },
//          {
//            title: '备注',
//            key: 'remarks',
//            minWidth:150,
//            tooltip:true,
//            align: 'center'
//          },
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
                      this.editBtn(params)
                    }
                  }
                }, '编辑')
              ])
            }
          }
        ],
        tableData: [],
        //弹框
        formVisible:false,//编辑表单显示
        tableLoading:false,//列表数据加载
        saveLoading:false,//表单提交加载
        //form表单数据
        formStateData:[],//适配器类型状态码
        searchData:[],
        unpackData:[],
        secData:[],
        formValidate: {
          name:'',
          superType:'',
          chsName:'',
          jsonConf:'',
          remarks:'',
          adapterType:'',
          searchId:'',
          unpackId:'',
          secId:'',
          isEBCDIC:false,
          encode:'utf-8'
        },
        ruleForm: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          chsName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          adapterType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          searchId:[
            { required: true, type:'number', message: '请选择类型', trigger: 'change' }
          ],

        },
        searchForm:{},
        searchVisible:false,
        unpackForm:{},
        unpackVisible:false,
        secForm:{},
        secVisible:false,
//        分页
        totalPage:10,//总条数
        currentPage:1,//当前页码
      }
    },
    created(){
      requestServices.searchList()
        .then(res=>{
          this.searchData=res.page.rows
        });
      requestServices.unpackList()
        .then(res=>{
          this.unpackData=res.page.rows
        });
      requestServices.secList()
        .then(res=>{
          this.secData=res.page.rows
        });
      this.getList();
      this.getTypeList();
    },
    methods: {
      //交易查看
      searchBtn(params){
        if(!params.row.searchId){
          this.$Message.warning('信息异常!');
          return false;
        }
        this.searchData.forEach(val=>{
          if(val.id===params.row.searchId){
            this.searchForm = val;
            this.searchVisible=true;
            return false;
          }
        });
        if(JSON.stringify(this.searchForm)==="{}"){
          this.$Message.warning('无对应数据!');
        }
      },
      //拆包查看
      unpackBtn(params){
        if(!params.row.unpackId){
          this.$Message.warning('信息异常!');
          return false;
        }
        this.unpackData.forEach(val=>{
          if(val.id===params.row.unpackId){
            this.unpackForm = val;
            this.unpackVisible=true;
            return false;
          }
        });
        if(JSON.stringify(this.unpackForm)==="{}"){
          this.$Message.warning('无对应数据!');
        }
      },
      //安全组件查看
      secBtn(params){
        if(!params.row.secId){
          this.$Message.warning('信息异常!');
          return false;
        }
        this.secData.forEach(val=>{
          if(val.id===params.row.secId){
            this.secForm = val;
            this.secVisible=true;
            return false
          }
        });
        if(JSON.stringify(this.secForm)==="{}"){
          this.$Message.warning('无对应数据!');
        }
      },
      //获取适配器类型
      getTypeList(type,conf){
        requestServices.simuTypeList()
          .then(res=>{
            this.formStateData = res.adapterTypeList
            if(type){
              this.formStateData.forEach((val)=>{
                if(val.type===type){
                  val.jsonConf = conf;
                  return false;
                }
              })
            }
          })
      },
      //类型改变，替换配置信息
      typeChange(value){
        this.formStateData.forEach((val)=>{
          if(val.type===value){
            this.formValidate.superType=val.superType;
            this.formValidate.jsonConf=JSON.parse(val.jsonConf);
            return false;
          }
        })
      },
      //配置JSON
      onJsonChange(value){
        console.log(value)
        this.formStateData.forEach((val)=>{
          if(val.type===this.formValidate.unpackType){
            val.jsonConf = JSON.stringify(value);
            return false;
          }
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
        requestServices.simuList({
          page:this.currentPage,
          limit:this.$global.pageSize,
          chsName:this.formInline.chsName,
          adapterType:this.formInline.adapterType,
        }).then(res=>{
          this.tableData = res.page.rows;
          this.totalPage = res.page.total;
          this.tableLoading=false;
        })
      },
      //新增
      addBtn(){
        this.getTypeList();
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this. formValidate= {
          name:'',
          chsName:'',
          jsonConf:'',
          superType:'',
          remarks:'',
          adapterType:'',
          searchId:'',
          unpackId:'',
          secId:'',
          isEBCDIC:false,
          encode:'utf-8'
        }
      },
      //修改
      editBtn (params) {
        this.getTypeList(params.row.adapterType,params.row.jsonConf);
        this.saveLoading=false;
        this.$refs.formValidate.resetFields();
        this.formVisible=true;
        this.formValidate.id = params.row.id;
        this.formValidate.name = params.row.name;
        this.formValidate.searchId = params.row.searchId;
        this.formValidate.unpackId = params.row.unpackId;
        this.formValidate.secId = params.row.secId;
        this.formValidate.superType = params.row.superType;
        this.formValidate.chsName = params.row.chsName;
        this.formValidate.jsonConf = JSON.parse(params.row.jsonConf);
        this.formValidate.remarks = params.row.remarks;
        this.formValidate.adapterType = params.row.adapterType;
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
              requestServices.simuDelete(self.selectionData)
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
              requestServices.simuUpdate({
                id:self.formValidate.id,
                name:self.formValidate.name,
                chsName:self.formValidate.chsName,
                jsonConf:JSON.stringify(self.formValidate.jsonConf),
                remarks:self.formValidate.remarks,
                adapterType:self.formValidate.adapterType,
                searchId:self.formValidate.searchId,
                superType:self.formValidate.superType,
                unpackId:self.formValidate.unpackId,
                secId:self.formValidate.secId
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
              requestServices.simuSave({
                name:self.formValidate.name,
                chsName:self.formValidate.chsName,
                jsonConf:JSON.stringify(self.formValidate.jsonConf),
                remarks:self.formValidate.remarks,
                adapterType:self.formValidate.adapterType,
                searchId:self.formValidate.searchId,
                superType:self.formValidate.superType,
                unpackId:self.formValidate.unpackId,
                secId:self.formValidate.secId
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
        this.getList()
      },
    }
  }
</script>
