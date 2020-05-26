<style>
  .quick-ranges{
    margin-left: 20px;
    max-width: 500px;
  }
  .quick-ranges-item{
    width: 120px;
    display: inline-block;
  }
  .rangesBox{
    width: 690px;
    background: #edf2f7;
  }
</style>
<template>
  <div>
    <h2>TIME CASE2</h2>
    <Poptip trigger="hover" :content="formValidate.startDate+formValidate.startTime+' \n'+formValidate.endDate+formValidate.endTime">
      <Button
        icon="ios-alarm-outline"
        type="primary"
        @click="formVisible=!formVisible"
      >{{formValidate.startDate}} {{formValidate.startTime}} to {{formValidate.endDate}} {{formValidate.endTime}}</Button>
    </Poptip>
    <Card v-if="formVisible" class="clearfix rangesBox">
      <Form
        class="left"
        style="width: 360px"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleForm"
        :label-width="70"
        @submit.native.prevent>
        <h4 class="mb10">Custom Ranges</h4>
        <FormItem label="From">
          <Row>
            <i-col span="11">
              <FormItem :label-width="0" prop="startDate">
                <DatePicker :clearable="false" type="date" placeholder="Select date" :value="formValidate.startDate"></DatePicker>
              </FormItem>
            </i-col>
            <i-col span="1" style="text-align: center">-</i-col>
            <i-col span="11">
              <FormItem :label-width="0" prop="startTime">
                <TimePicker type="time" :clearable="false" placeholder="Select time" v-model="formValidate.startTime"></TimePicker>
              </FormItem>
            </i-col>
          </Row>
        </FormItem>
        <FormItem label="To">
          <Row>
            <i-col span="11">
              <FormItem :label-width="0" prop="endDate">
                <DatePicker type="date" :clearable="false" placeholder="Select date" :value="formValidate.endDate"></DatePicker>
              </FormItem>
            </i-col>
            <i-col span="1" style="text-align: center">-</i-col>
            <i-col span="11">
              <FormItem :label-width="0" prop="endTime">
                <TimePicker type="time" :clearable="false" placeholder="Select time" v-model="formValidate.endTime"></TimePicker>
              </FormItem>
            </i-col>
          </Row>
        </FormItem>
        <FormItem>
          <div>
            <Button  @click="formVisible=false">Cancel</Button>
            <Button type="primary" :loading="saveLoading" @click="saveBtn('formValidate')">Apply</Button>
          </div>
        </FormItem>
      </Form>
      <div class="left quick-ranges">
        <h4>Quick Ranges</h4>
        <div class="quick-ranges-item">
          <Button
            v-for="(val,index) in quickRanges1"
            :key="index"
            @click="quickRangesClick(val.time)"
            type="text">{{val.label}}</Button>
        </div>
        <div class="quick-ranges-item">
          <Button
            v-for="(val,index) in quickRanges2"
            :key="index"
            @click="quickRangesClick(val.time)"
            type="text">{{val.label}}</Button>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        saveLoading:false,
        quickRanges1:[
          {time:1,label:'Last 5 minutes'},
          {time:2,label:'Last 15 minutes'},
          {time:3,label:'Last 30 minutes'},
          {time:4,label:'Last 1 hour'},
          {time:5,label:'Last 3 hours'},
        ],
        quickRanges2:[
          {time:6,label:'Last 6 hours'},
          {time:7,label:'Last 12 hours'},
          {time:8,label:'Last 24 hours'},
          {time:9,label:'Today'},
          {time:10,label:'Yesterday'},
        ],
        formVisible:false,
        formValidate:{
          startDate:"2019-12-04",
          startTime:"10:00:00",
          endDate:"2019-12-20",
          endTime:"08:00:00",
        },
        ruleForm:{},
      };
    },
    mounted () {
      let end = new Date();
      let start = new Date(new Date(new Date().toLocaleDateString()).getTime());
      this.formValidate.startDate=start.toLocaleDateString()
      this.formValidate.startTime=start.toTimeString().split(" ")[0];
      this.formValidate.endDate=end.toLocaleDateString()
      this.formValidate.endTime=end.toTimeString().split(" ")[0]
    },
    methods:{
      //保存
      saveBtn(name){
        let self = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            self.saveLoading=true;
            let aab = setTimeout(function () {
              self.saveLoading = false
            },1000);
            let start  = new Date(this.formValidate.startDate+' '+this.formValidate.startTime).getTime();
            let end = new Date(this.formValidate.endDate+' '+this.formValidate.endTime).getTime();


          } else {
            this.$Message.error('提交失败,请确认时间无误！');
          }
        })
      },
      quickRangesClick(time){
        switch(time){
          case 1:
            this.min5();
            break;
          case 2:
            this.mim15();
            break;
          case 3:
            this.mim30();
            break;
          case 4:
            this.hour1();
            break;
          case 5:
            this.hour3();
            break;
          case 6:
            this.hour6();
            break;
          case 7:
            this.hour12();
            break;
          case 8:
            this.hour24();
            break;
          case 9:
            this.today();
            break;
          case 10:
            this.yesterday();
            break;
        }
      },
      getTime(start,end){
        this.formValidate.startDate=start.toLocaleDateString()
        this.formValidate.startTime=start.toTimeString().split(" ")[0];
        this.formValidate.endDate=end.toLocaleDateString()
        this.formValidate.endTime=end.toTimeString().split(" ")[0]
      },
      min5(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 5*60*1000)
        this.getTime(start,end);
      },
      mim15(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 15*60*1000)
        this.getTime(start,end);
      },
      mim30(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 30*60*1000)
        this.getTime(start,end);
      },
      hour1(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 60*60*1000)
        this.getTime(start,end);
      },
      hour3(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3*60*60*1000)
        this.getTime(start,end);
      },
      hour6(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 6*60*60*1000)
        this.getTime(start,end);
      },
      hour12(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 12*60*60*1000)
        this.getTime(start,end);
      },
      hour24(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 24*60*60*1000)
        this.getTime(start,end);
      },
      today(){
        const end = new Date();
        const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
        this.getTime(start,end);
      },
      yesterday(){
        const end = new Date(new Date(new Date().toLocaleDateString()).getTime());
        const start =new Date(new Date(new Date().toLocaleDateString()).getTime())
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        end.setTime(end.getTime() - 1)
        this.getTime(start,end);
      }
    }
  };
</script>
