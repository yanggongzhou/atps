
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">个人信息</span>
    </div>
    <Card style="width:800px;margin: 0 auto" :border="false">

      <p slot="title">
        <Icon type="md-person"></Icon>
        {{formValidate.loginName}}
         <Icon class="ml10" type="md-time"></Icon>
        最近一次登录时间：
        <span v-if="showData.lastlogin">{{showData.lastlogin}}</span>
        <span v-if="!showData.lastlogin">无</span>
      </p>
      <div slot="extra" >
        <Button size="small" type="primary" :loading="saveLoading" @click="saveBtn('formValidate')">保存</Button>
      </div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleForm" :label-width="90" @submit.native.prevent>
        <Row :gutter="20">
          <i-col :span="11">
            <FormItem label="姓名" prop="userName">
              <Input v-model="formValidate.userName"/>
            </FormItem>
            <FormItem label="密码" prop="password">
              <Input v-model="formValidate.password"/>
            </FormItem>
            <FormItem prop="isSuper" label="权限">
              <Select :disabled="authorVisible" v-model="formValidate.isSuper">
                <Option v-for="(val,ind) in formStateData" :key="ind+'查询'" :value="val.code" :label="val.name"></Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col :span="11">
            <FormItem prop="defaultType" label="默认菜单">
              <Select v-model="formValidate.defaultType">
                <Option v-for="(val,ind) in $global.typeData" :key="ind+'菜单'" :value="val.type" :label="val.label"></Option>
              </Select>
            </FormItem>
            <FormItem label="邮箱" prop="email">
              <Input v-model="formValidate.email"/>
            </FormItem>
            <FormItem label="电话" prop="mobileNum">
              <Input v-model="formValidate.mobileNum"/>
            </FormItem>
          </i-col>
        </Row>
      </Form>
    </Card>

  </div>
</template>
<script>
  import {requestServices} from '../../api/api.js'
  import {auth} from '../../api/auth'
  export default {
    data () {
      return {
        authorVisible:true,
        formVisible:false,
        showData:{},
        formValidate: {
          loginName:'',
          password:'',
          userName:'',
          isSuper:'',
          mobileNum:"",
          email:"",
          defaultType:'',
          id:''
        },
        ruleForm: {
          loginName: [
            { required: true, message: '请输入登录名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          isSuper: [
            { required: true, type:'number', message: '请选择权限', trigger: 'change' }
          ],
          defaultType:[
            { required: true, type:'number', message: '请选择默认菜单', trigger: 'change' }
          ],
        },
        formStateData:[],//人员权限类型
      }
    },
    created(){
      //获取用户权限
      let val;
      for (val in this.$global.isSuper){
        this.formStateData.push({code:parseInt(val),name:this.$global.isSuper[val]})
      }
      this.getList();
    },
    mounted(){
      if(auth.getCookie('isSuper')=="1"){
        this.authorVisible = false;
      }
    },
    methods: {
      //获取列表
      getList(){
        this.tableLoading=true;
        requestServices.userList({
          id: parseInt(auth.getCookie('userId'))
        }).then(res=>{
          let data = res.page.rows[0];
          this.formValidate.id = data.id;
          this.formValidate.loginName = data.loginName;
          this.formValidate.password = data.password;
          this.formValidate.userName = data.userName;
          this.formValidate.isSuper = data.isSuper;
          this.formValidate.mobileNum = data.mobileNum;
          this.formValidate.email = data.email;
          this.formValidate.defaultType = data.defaultType;
          this.showData = data;
          this.showData.isSuperName = this.$global.isSuper[data.isSuper];
          this.$global.typeData.forEach((val=>{
            if(val.type===data.defaultType){
              this.showData.defaultTypeName =val.label;
            }
          }));
          this.tableLoading=false;
        })
      },
      //更新
      saveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.saveLoading=true;
            let aab = setTimeout(function () {
              self.saveLoading = false
            },1000);
            requestServices.userUpdate(self.formValidate)
              .then((res)=>{
                if(res.code===0){
                  self.$Message.success('个人信息修改成功！');
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
    }
  }
</script>
