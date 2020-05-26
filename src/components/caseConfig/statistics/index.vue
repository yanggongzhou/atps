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
  .myChart{
    width: 100%;
    height: 385px;
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
        <Card>
          <div id="myChart" class="myChart"></div>
        </Card>
      </i-col>
      <i-col class="mt10" :span="12">
        <Card>
          <div id="myChart2" class="myChart"></div>
        </Card>
      </i-col>
      <i-col class="mt10" :span="12">
        <Card>
          <div id="myChart3" class="myChart"></div>
        </Card>
      </i-col>
      <i-col class="mt10" :span="12">
        <Card>
          <div id="myChart4" class="myChart"></div>
        </Card>
      </i-col>
    </Row>

  </div>
</template>
<script>
  import {requestServices} from '../../../api/api'
  // 引入基本模板
  let echarts = require('echarts');
  var colorList = [
    '#4095df', '#E87C25', '#F3A43B', '#FE8463','#efa88e','#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3','#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'
  ];
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
            }
          ]
        },
        myChart:'',
        myChart2:'',
        myChart3:'',
        myChart4:'',
        dealTimeOption :{
          title: {
            text: '响应时间（毫秒）',
            textStyle:{
              fontSize:16,
            },
            left: '25%',
          },
          legend:{
            type:'scroll',
            orient:'horizontal',
            top:35,
            left:'5%',
            padding:5,
            icon:'roundRect',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            confine:true,
            transitionDuration:0.2,
            backgroundColor:'rgba(238, 238, 238)',
            padding:10,
            textStyle:{
              color:'#333',
            },
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

          grid: {
            show:true,
            top:70,
            left:'8%',
            width: '84%',
            backgroundColor:'rgb(225, 241, 249)',
          },
          xAxis:{
//            name:'时间',
            type: 'time',
            minInterval: 1,
//            maxInterval: 3600 * 1000,//最大时间间隔
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
        tpsOption :{
          title: {
            text: 'TPS（笔/秒）',
            textStyle:{
              fontSize:16,
            },
            left: '25%',
          },
          legend:{
            type:'scroll',
            orient:'horizontal',
            top:35,
            left:'5%',
            padding:5,
            icon:'roundRect',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            confine:true,
            transitionDuration:0.2,
            backgroundColor:'rgba(238, 238, 238)',
            padding:10,
            textStyle:{
              color:'#333',
            },
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

          grid: {
            show:true,
            top:70,
            left:'8%',
            width: '84%',
            backgroundColor:'rgb(225, 241, 249)',
          },
          xAxis:{
//            name:'时间',
            type: 'time',
            minInterval: 1,
//            maxInterval: 3600 * 1000,//最大时间间隔
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
        sceneOption :{},
        outOption :{
          title: {
            text: '交易超时数',
            textStyle:{
              fontSize:16,
            },
            left: '25%',
          },
          legend:{
            type:'scroll',
            orient:'horizontal',
            top:35,
            left:'5%',
            padding:5,
            icon:'roundRect',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            confine:true,
            transitionDuration:0.2,
            backgroundColor:'rgba(238, 238, 238)',
            padding:10,
            textStyle:{
              color:'#333',
            },
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

          grid: {
            show:true,
            top:70,
            left:'8%',
            width: '84%',
            backgroundColor:'rgb(225, 241, 249)',
          },
          xAxis:{
//            name:'时间',
            type: 'time',
            minInterval: 1,
//            maxInterval: 3600 * 1000,//最大时间间隔
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
            type: 'solid',
            width:1.3,
          },
          itemStyle: {
            normal : {
              borderWidth : 6
            }
          },
          symbol:"emptyCircle",//标记的图形
          showSymbol: false,
          hoverAnimation: false,
          data: []
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
        this.getInfluxList();
      },
      //清空数据
      clearSeries(){
        this.dealTimeOption.series=[];
        this.tpsOption.series=[];
        this.outOption.series=[];
        this.myChart.setOption(this.dealTimeOption,true);
        this.myChart2.setOption(this.tpsOption,true);
//        this.myChart3.setOption(this.dealTimeOption,true);
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
          this.dealTimeOption.dataZoom[0].minValueSpan=parseInt(res.step);
          this.tpsOption.dataZoom[0].minValueSpan=parseInt(res.step);
          this.outOption.dataZoom[0].minValueSpan=parseInt(res.step);
          if(res.dealTimeList){
            res.dealTimeList.forEach((val,index)=>{
              let seriesObj = JSON.parse(JSON.stringify(this.commonSeries));
              seriesObj.name=val.tags.TxCode;
              seriesObj.data = val.values;
              seriesObj.itemStyle.normal.color=colorList[index];
              seriesObj.itemStyle.normal.borderColor=colorList[index];
              this.dealTimeOption.series.push(seriesObj)
            });
          }
          if(res.outTimeList){
            res.outTimeList.forEach((val,index)=>{
              let seriesObj = JSON.parse(JSON.stringify(this.commonSeries));
              seriesObj.name=val.tags.TxCode;
              seriesObj.data = val.values;
              seriesObj.itemStyle.normal.color=colorList[index];
              seriesObj.itemStyle.normal.borderColor=colorList[index];
              this.outOption.series.push(seriesObj)
            });
          }
          if(res.TPSList){
            res.TPSList.forEach((val,index)=>{
              let seriesObj = JSON.parse(JSON.stringify(this.commonSeries));
              seriesObj.name=val.tags.TxCode;
              seriesObj.data = val.values;
              seriesObj.itemStyle.normal.color=colorList[index];
              seriesObj.itemStyle.normal.borderColor=colorList[index];
              this.tpsOption.series.push(seriesObj)
            });
          }
          setTimeout(function () {
            self.myChart.setOption(self.dealTimeOption,true);
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

        this.myChart.setOption(this.dealTimeOption,true);
        this.myChart2.setOption(this.tpsOption,true);
        this.myChart4.setOption(this.outOption,true);
      },
    }
  }
</script>


