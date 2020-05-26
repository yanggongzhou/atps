
<style>
  .sta-title{
    background: #515a6e;
    padding: 8px 15px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    border-radius: 2px;
    letter-spacing: 2px;
    display: inline-block;
    height: 32px;
  }
  .sta-expand{
    width: 0;
    height: 0;
    border-top: 40px solid ;
    border-left: 50px solid transparent;
    position: absolute;
    top: 0;
    right: 0;
  }
  .sta-expand:hover{
    /*cursor: ew-resize;*/
    cursor: pointer;
    border-top: 40px solid #2d8cf0;
    transition: .5s all;
  }
  .sta-expand-icon{
    position: relative;
    top: -38px;
    left: -23px;
  }
  .myChart{
    width: 100%;
    height: 300px;
  }
</style>
<template>
  <div>
    <div class="titleBox">
      <span class="titleSpan">运行统计</span>
    </div>
    <!--<timeExpend></timeExpend>-->
    <div>
      <span class="sta-title">日期时间</span>
      <DatePicker
        v-model="timeValue"
        type="datetimerange"
        :options="pickerOptions"
        @on-ok="timeSelect"
        @on-clickoutside="timeSelect"
        style="width: 350px"></DatePicker>
      <Button type="info" icon="md-refresh" @click="getInfluxList">刷新</Button>
    </div>
    <Row :gutter="10">
      <i-col class="mt10" :span="12">
        <!--<P slot="title">响应时间 (ms) </P>-->
        <Card>
          <!--<div class="sta-expand" title="扩展/还原"  @click="expand(1)">-->
          <!--<Icon size="17" color="#fff" type="md-barcode" class="sta-expand-icon"/>-->
          <!--</div>-->
          <div id="myChart" class="myChart"></div>
        </Card>
      </i-col>
      <i-col class="mt10" :span="12">
        <!--<P slot="title">TPS (笔/秒) </P>-->
        <Card>
          <!--<div class="sta-expand" title="扩展/还原" @click="expand(2)">-->
          <!--<Icon size="17" color="#fff" type="md-barcode" class="sta-expand-icon"/>-->
          <!--</div>-->
          <div id="myChart2" class="myChart"></div>
        </Card>
      </i-col>
      <i-col class="mt10" :span="12">
        <!--<P slot="title">交易时间对比 </P>-->
        <Card>
          <!--<div class="sta-expand" title="扩展/还原" @click="expand(3)">-->
          <!--<Icon size="17" color="#fff" type="md-barcode" class="sta-expand-icon"/>-->
          <!--</div>-->
          <div id="myChart3" class="myChart"></div>
        </Card>
      </i-col>
      <i-col class="mt10" :span="12">
        <!--<P slot="title">交易超时纪录 </P>-->
        <Card>
          <!--<div class="sta-expand" title="扩展/还原" @click="expand(4)">-->
          <!--<Icon size="17" color="#fff" type="md-barcode" class="sta-expand-icon"/>-->
          <!--</div>-->
          <div id="myChart4" class="myChart"></div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
  //  import moment from "moment"
  import {requestServices} from '../api/api'
  // 引入基本模板
  let echarts = require('echarts');
  export default {
    data() {
      let self = this;
      return {
        timeValue:'',
        pickerOptions: {
          shortcuts: [
            {
              text: '5分钟前',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 5*60*1000)
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '15分钟前',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 15*60*1000)
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '30分钟前',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 30*60*1000)
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '1小时前',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 60*60*1000)
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '3小时前',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3*60*60*1000)
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '6小时前',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 6*60*60*1000)
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '12小时前',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 12*60*60*1000)
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '24小时前',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 24*60*60*1000)
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
                self.timeValue = [start, end];
//              picker.$emit('dates', [start, end])
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const end = new Date(new Date(new Date().toLocaleDateString()).getTime());
                const start =new Date(new Date(new Date().toLocaleDateString()).getTime())
                start.setTime(start.getTime() - 3600 * 1000 * 24)
                end.setTime(end.getTime() - 1)
                self.timeValue = [start, end];
//              picker.$emit('pick', [start, end])
              }
            },
//            {
//            text: '上周',
//            onClick(picker) {
//              const start = moment(moment().week(moment().week() - 1).startOf('week').add(1, 'days').valueOf()).format("YYYY-MM-DD HH:mm:ss")
//              const end = moment(moment().week(moment().week() - 1).endOf('week').add(1, 'days').valueOf()).format("YYYY-MM-DD HH:mm:ss");
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '本周',
//            onClick(picker) {
//              const start = moment(moment().week(moment().week()).startOf('week').add(1, 'days').valueOf()).format("YYYY-MM-DD HH:mm:ss")
//              const end = moment(moment().week(moment().week()).endOf('week').add(1, 'days').valueOf()).format("YYYY-MM-DD HH:mm:ss");
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '上月',
//            onClick(picker) {
//              const start = moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYY-MM-DD');
//              const end = moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format('YYYY-MM-DD');
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '本月',
//            onClick(picker) {
//              const start = moment(moment().month(moment().month()).startOf('month').valueOf()).format('YYYY-MM-DD');
//              const end = moment(moment().month(moment().month()).endOf('month').valueOf()).format('YYYY-MM-DD');
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '最近一周',
//            onClick(picker) {
//              const end = new Date();
//              const start = new Date();
//              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '最近一月',
//            onClick(picker) {
//              const end = new Date()
//              const start = new Date()
//              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '上季度',
//            onClick(picker) {
//              const start = moment(moment().quarter(moment().quarter() - 1).startOf('quarter').valueOf()).format('YYYY-MM-DD');
//              const end = moment(moment().quarter(moment().quarter() - 1).endOf('quarter').valueOf()).format('YYYY-MM-DD');
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '本季度',
//            onClick(picker) {
//              const start = moment(moment().quarter(moment().quarter()).startOf('quarter').valueOf()).format('YYYY-MM-DD');
//              const end = moment(moment().quarter(moment().quarter()).endOf('quarter').valueOf()).format('YYYY-MM-DD');
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '去年',
//            onClick(picker) {
//              const start = moment(moment().year(moment().year() - 1).startOf('year').valueOf()).format('YYYY-MM-DD');
//              const end = moment(moment().year(moment().year() - 1).endOf('year').valueOf()).format('YYYY-MM-DD');
//              picker.$emit('pick', [start, end])
//            }
//          },
//            {
//            text: '今年',
//            onClick(picker) {
//              const start = moment(moment().year(moment().year()).startOf('year').valueOf()).format('YYYY-MM-DD');
//              const end = moment(moment().year(moment().year()).endOf('year').valueOf()).format('YYYY-MM-DD');
//              picker.$emit('pick', [start, end])
//            }
//          }
          ]
        },
        myChart:'',
        myChart2:'',
        myChart3:'',
        myChart4:'',
        responseOption :{
          title: {
            text: '响应时间（毫秒）',
//            subtext: 'yyyy.MM.dd 09:00:00 - 2019.09.18 08:00:00',
            x:'left',
            textStyle:{
              fontSize:15,
            }
          },
          legend:{
//            show:false,
            type:'scroll',
            orient:'vertical',
            top:55,
            right:0,
//            backgroundColor:"#95a8b1"
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
//            backgroundColor:'rgba(238, 238, 238)',
//            padding:10,
//            textStyle:{
//              color:'#333',
//            },
//            formatter: function (params) {
//              let res = "<div>"+params[0].axisValueLabel+"</div><div>"+params[0].seriesName+"："+ params[0].value[1]+"ms</div>";
//              return res;
//            }
          },
          toolbox:{
            show: true,
            feature: {
              dataZoom: {
                show:false,
              },
              dataView: {readOnly: false},
              magicType: {type: ['line']},
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom:[
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              minSpan :1,
              start: 0,
              end: 100
            },
            {
              type: 'inside',
              show: true,
              xAxisIndex: [0],
              start: 0,
              end: 100
            }
          ],
          grid: { left:'15%', width: '60%'},
          xAxis:{
//            name:'时间',
            type: 'time',
            axisLine:{
              show:false,
              lineStyle:{
                color:'gray'
              }
            },
            axisPointer: {
              label:{
                show:true,
                formatter: function (params) {
                  return echarts.format.formatTime('yyyy-MM-dd  hh:mm:ss', params.value);
                },
                backgroundColor: '#004E52'
              },
              lineStyle:{
                color:'#477d62',
              }
            },
            axisTick:{
              show:false,
            },
            splitLine: {
              show: true,
              lineStyle:{
                type:'solid'
              }
            }
          },
          yAxis:{
            type: 'value',
            axisLine:{
              show:false
            },
            axisTick:{
              show:false,
            },
            boundaryGap: [0, '100%'],
            splitLine: {//分隔线
              show: true,
              lineStyle:{
                type:'solid'
              }
            }
          },
          series: []
        },
        commonSeries:{
          name: ' ',
          type: 'line',
          smoothMonotone:'x',
          lineStyle: {
            type: 'solid'
          },
//          itemStyle: {
//            color: function (params) {
//              var colorList = [
//                '#4095df', '#E87C25', '#F3A43B', '#FE8463'
//              ];
//              return colorList[params.dataIndex]
//            },
//          },
          symbol:"emptyCircle",//标记的图形
          showSymbol: false,
          hoverAnimation: false,
          data: []
        },

        tpsOption :{
          title: {
            text: 'TPS（笔/秒）',
            x:'left',
            textStyle:{
              fontSize:15,
            }
          },
          legend:{
//            show:false,
            type:'scroll',
            orient:'vertical',
            top:55,
            right:0,
//            backgroundColor:"#95a8b1"
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
//            backgroundColor:'rgba(238, 238, 238)',
//            padding:10,
//            textStyle:{
//              color:'#333',
//            },
//            formatter: function (params) {
//              let res = "<div>"+params[0].axisValueLabel+"</div><div>"+params[0].seriesName+"："+ params[0].value[1]+"ms</div>";
//              return res;
//            }
          },
          toolbox:{
            show: true,
            feature: {
              dataZoom: {
                show:false,
              },
              dataView: {readOnly: false},
              magicType: {type: ['line']},
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom:[
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              minSpan :1,
              start: 0,
              end: 100
            },
            {
              type: 'inside',
              show: true,
              xAxisIndex: [0],
              start: 0,
              end: 100
            }
          ],
          grid: { left:'15%', width: '60%'},
          xAxis: {
//            name:'时间',
            type: 'time',
            axisLine:{
              show:false,
              lineStyle:{
                color:'gray'
              }
            },
            axisTick:{
              show:false,
            },
            axisPointer: {
              label:{
                show:true,
                formatter: function (params) {
                  return echarts.format.formatTime('yyyy-MM-dd  hh:mm:ss', params.value);
                },
                backgroundColor: '#004E52'
              },
              lineStyle:{
                color:'#477d62',
              }
            },
            splitLine: {
              show: true,
              lineStyle:{
                type:'solid'
              }
            }
          },
          yAxis:{
            type: 'value',
            axisLine:{
              show:false
            },
            axisTick:{
              show:false,
            },
            boundaryGap: [0, '100%'],
            splitLine: {//分隔线
              show: true,
              lineStyle:{
                type:'solid'
              }
            }
          },
          series: []
        },
        sceneOption :{},
        outOption :{
          title: {
            text: '交易超时数量',
            x:'left',
            textStyle:{
              fontSize:15,
            }
          },
          legend:{
//            show:false,
            type:'scroll',
            orient:'vertical',
            top:55,
            right:0,
//            backgroundColor:"#95a8b1"
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
//            backgroundColor:'rgba(238, 238, 238)',
//            padding:10,
//            textStyle:{
//              color:'#333',
//            },
//            formatter: function (params) {
//              let res = "<div>"+params[0].axisValueLabel+"</div><div>"+params[0].seriesName+"："+ params[0].value[1]+"ms</div>";
//              return res;
//            }
          },
          toolbox:{
            show: true,
            feature: {
              dataZoom: {
                show:false,
              },
              dataView: {readOnly: false},
              magicType: {type: ['line']},
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom:[
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              minSpan :1,
              start: 0,
              end: 100
            },
            {
              type: 'inside',
              show: true,
              xAxisIndex: [0],
              start: 0,
              end: 100
            }
          ],
          grid: { left:'15%', width: '60%'},
          xAxis: {
//            name:'时间',
            type: 'time',
            axisLine:{
              show:false,
              lineStyle:{
                color:'gray'
              }
            },
            axisTick:{
              show:false,
            },
            axisPointer: {
              label:{
                show:true,
                formatter: function (params) {
                  return echarts.format.formatTime('yyyy-MM-dd  hh:mm:ss', params.value);
                },
                backgroundColor: '#004E52'
              },
              lineStyle:{
                color:'#477d62',
              }
            },
            splitLine: {
              show: true,
              lineStyle:{
                type:'solid'
              }
            }
          },
          yAxis:{
            type: 'value',
            axisLine:{
              show:false
            },
            axisTick:{
              show:false,
            },
            boundaryGap: [0, '100%'],
            splitLine: {//分隔线
              show: true,
              lineStyle:{
                type:'solid'
              }
            }
          },
          series: []
        },
        screenWidth:document.body.clientWidth,//当前屏幕的可见区域的宽度
        timer:false,
      }
    },
    computed:{
      isInstanceId(){
        return this.$store.state.isInstanceId
      }
    },
    watch:{
      isInstanceId() {
        this.getInfluxList();
      },
      screenWidth(val){
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if(!this.timer){
          // 一旦监听到的screenHeight值改变，就将其重新赋给data里的screenHeight
          this.screenWidth = val;
          this.timer = true;
          let self = this;
          setTimeout(function(){
            self.refreshView();
            self.timer = false
          },400)
        }
      }
    },
    mounted() {
      let self = this;
      window.onresize = () => {
        return (() => {
          self.screenWidth = document.body.clientWidth;
        })()
      };
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById('myChart'));
      this.myChart2 = echarts.init(document.getElementById('myChart2'));
      this.myChart3 = echarts.init(document.getElementById('myChart3'));
      this.myChart4 = echarts.init(document.getElementById('myChart4'));

      let end = new Date();
      let start = new Date(new Date(new Date().toLocaleDateString()).getTime());
      this.timeValue = [start,end]

      setTimeout(function () {
        self.getInfluxList();
      },300);
    },
    methods: {
      //时间选择
      timeSelect(){
//        console.log(new Date(this.timeValue[0]).getTime(),new Date(this.timeValue[1]).getTime());
        this.getInfluxList();
      },
      //清空数据
      clearSeries(){
        this.responseOption.series=[];
        this.tpsOption.series=[];
        this.outOption.series=[];
        this.myChart.setOption(this.responseOption,true);
        this.myChart2.setOption(this.tpsOption,true);
        this.myChart4.setOption(this.outOption,true);
      },
//      获取数据
      getInfluxList(){
        let self = this;
        requestServices.influxList({
          begin:new Date(this.timeValue[0]).getTime(),
          end:new Date(this.timeValue[1]).getTime(),
          instanceId:this.$store.state.instanceId
        }).then(res=>{
          this.clearSeries();
          //确定单位
          this.responseOption.dataZoom[0].minValueSpan=parseInt(res.step);
          this.tpsOption.dataZoom[0].minValueSpan=parseInt(res.step);
          this.outOption.dataZoom[0].minValueSpan=parseInt(res.step);
          if(res.dealTimeList){
            res.dealTimeList.forEach((val)=>{
              let seriesObj = JSON.parse(JSON.stringify(this.commonSeries));
              seriesObj.name=val.tags.TxCode;
              seriesObj.data = val.values;
              this.responseOption.series.push(seriesObj)
            });
          }
          if(res.TPSList){
            res.TPSList.forEach((val)=>{
              let seriesObj = JSON.parse(JSON.stringify(this.commonSeries));
              seriesObj.name=val.tags.TxCode;
              seriesObj.data = val.values;
              this.tpsOption.series.push(seriesObj)
            });
          }
          if(res.outTimeList){
            res.outTimeList.forEach((val)=>{
              let seriesObj = JSON.parse(JSON.stringify(this.commonSeries));
              seriesObj.name=val.tags.TxCode;
              seriesObj.data = val.values;
              this.outOption.series.push(seriesObj)
            });
          }
          setTimeout(function () {
            self.myChart.setOption(self.responseOption,true);
            self.myChart2.setOption(self.tpsOption,true);
            self.myChart4.setOption(self.outOption,true);
          },300);

        })
      },
      //刷新图表
      refreshView(){
        this.myChart.resize({
          width: "auto"
        });
        this.myChart2.resize({
          width: "auto"
        });
        this.myChart3.resize({
          width: "auto"
        });
        this.myChart4.resize({
          width: "auto"
        });
        this.myChart.setOption(this.responseOption,true);
        this.myChart2.setOption(this.tpsOption,true);
//        this.myChart3.setOption(this.sceneOption,true);
        this.myChart4.setOption(this.outOption,true);
      },
    }
  }
</script>
