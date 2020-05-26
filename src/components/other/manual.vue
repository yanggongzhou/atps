<style scoped>
  .manualBox{
    font-size: 13px;
    padding: 10px;
  }
  h2{
    margin:14px 0;
  }
  p{
    font-size: 13px;
    line-height: 20px;
  }
  h4{
    font-size: 14px;
    margin: 10px 0;
  }
  ol{
    margin: 0 15px;
  }
  li{
    padding:5px;
    line-height:18px;
  }
  img{
    width: 90%;
    max-width: 800px;
  }
  .manualAnchor{
    position: fixed;
    right: 15px;
    background-color: #c5c8ce;
    z-index: 100;
    top: 55px;
    border-radius: 5px;
    padding: 10px;
  }
  .manualAnchor-btn{
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1000;
  }
  .manualAnchor-btn-show{
    position: fixed;
    right: 25px;
    top: 65px;
    z-index: 1000;
  }
</style>
<template>
  <div>
    <!--标头-->
    <div class="titleBox">
      <span class="titleSpan">操作手册</span>
    </div>
    <Button id="download" type="primary" icon="md-cloud-download" @click="manualDownloadEvent">下载操作手册</Button>
    <Button v-if="!anchorvisble" size="small" class="manualAnchor-btn-show" type="warning" ghost @click="anchorvisble=true">显示锚点</Button>
    <Anchor v-if="anchorvisble" class="manualAnchor" show-ink>
      <Button size="small" class="manualAnchor-btn" type="warning" ghost @click="anchorvisble=false">隐藏</Button>
      <AnchorLink href="#download" title="下载操作手册"/>
      <AnchorLink href="#introduction" title="1.1简介"/>
      <AnchorLink href="#address" title="1.2服务器访问地址" />
      <AnchorLink href="#explain" title="2.1页面说明">
        <AnchorLink href="#explain_apply" title="2.1.1模拟器申请" />
        <AnchorLink href="#explain_config" title="2.1.2模拟器实例配置" />
      </AnchorLink>
      <AnchorLink href="#apply" title="2.2模拟器申请流程">
        <AnchorLink href="#apply_submit" title="2.2.1任务表单提交" />
        <AnchorLink href="#apply_edit" title="2.2.2申请类型及信息编辑" />
      </AnchorLink>
      <AnchorLink href="#caseConfig" title="2.3模拟器实例操作">
        <AnchorLink href="#caseConfig_args" title="2.3.1实例参数" />
        <AnchorLink href="#caseConfig_args2" title="2.3.2安全参数" />
        <AnchorLink href="#caseConfig_message" title="2.3.3响应报文" />
        <AnchorLink href="#caseConfig_argFile" title="2.3.4关联文件" />
        <AnchorLink href="#caseConfig_scene" title="2.3.5延迟时间" />
        <AnchorLink href="#caseConfig_statistics" title="2.3.6运行统计" />
        <AnchorLink href="#caseConfig_logs" title="2.3.7日志监控" />
      </AnchorLink>
    </Anchor>
    <div class="manualBox">
      <article id="introduction">
        <h2>1.1简介</h2>
        <p>模拟器自动化申请，部署，报文处理，动态配置，延迟处理等操作平台</p>
      </article>
      <article id="address">
        <h2>1.2服务器访问地址</h2>
        <p>ICDP地址：128.196.0.127:8000/mp_f/#/<br/>
          模拟器地址：http://128.196.1.44:8001/<br/>
          ICDP页面访问路径如下：<br/>
        </p>
        <img :src="ptss1" alt="">
      </article>
      <article id="explain">
        <h2>2.1页面说明</h2>
        <img :src="ptss2" alt="">
        <h4 id="explain_apply">模拟器申请模块</h4>
        <Steps :current="6"  size="small">
          <Step title="新增任务" icon="md-add-circle" content="测试人员选择新增"></Step>
          <Step title="提交" icon="md-cloud-done" content="编辑测试任务表单并提交"></Step>
          <Step title="申请信息" icon="md-eye" content="点击任务表格内申请信息可展开"></Step>
          <Step title="新增申请" icon="md-add-circle" content="选择全新申请或复用申请"></Step>
          <Step title="申请提交" icon="md-cloud-done" content="选择模拟器类型提交表单"></Step>
          <Step title="部署" icon="ios-globe" content="等待管理员自动部署"></Step>
          <Step title="进度查看" icon="md-eye" content="部署完成-申请信息栏状态信息呈现"></Step>
        </Steps>
        <h4 id="explain_config">模拟器实例配置模块</h4>
        <p>主要是对申请部署王城的模拟器实例进行配置管理。功能如下：</p>
        <ol>
          <li><b>实例参数配置</b>--可以设置模拟器的端口，线程池范围，以及安全的部署及配置，不使用安全则无需配置</li>
          <li><b>响应报文管理</b>--响应报文主要分为静态报文和动态报文，直接点击上传按钮会上传至静态报文目录下，
          点击设置规则并编辑完后曾此报文会变更为动态报文。动态配置在设置规则下，
          以&lt; rep strategy="increase" begin="1" len="7" fixlen="true" /&gt;
          模板设置动态规则，然后在返回报文中天禧对应的%1$s作替换。</li>
          <li><b>参数文件管理</b>--参数文件主要是针对关联替换文件需求模块</li>
          <li><b>延迟时间配置</b>--延迟配置模块主要是针对模拟器交易进行延迟处理配置，分为系统级别延迟、
          交易级别延迟、系统号延迟、安全节点号延迟。根据需要可选择延迟的方式和延迟的时间。</li>
          <li><b>模拟器运行统计</b>--是观测模拟器实例所在的测试情况的图形展示模块。</li>
          <li><b>日志监控</b>--可以页面查看日志，根据日志级别从左往右依次变为详细，改动日志级别不需要重启模拟器实例</li>
        </ol>
      </article>
      <article id="apply">
        <h2>2.2模拟器申请流程</h2>
        <h4 id="apply_submit">2.2.1模拟器申请--任务表单提交</h4>
        <img :src="ptss3" alt="模拟器申请--任务表单提交">
      </article>

      <article id="apply_edit">
        <h4>2.2.2模拟器申请类型及申请信息填写</h4>
        <p>模拟器申请类型有全新申请和复用申请两种，全新申请是申请新的模拟器，复用申请是申请原来已存在的模拟器</p>
        <h4>·全新申请--提交</h4>
        <img :src="ptss4" alt="">
        <h4>申请流程结束，处于申请中的状态如下，等待模拟器管理员自动分配</h4>
        <img :src="ptss5" alt="">
        <h4>部署完成--模拟器管理员自动化部署完后，模拟器服务器所在的信息会反馈回来。如下</h4>
        <img :src="ptss6" alt="">
      </article>

      <article id="caseConfig">
        <h2>2.3模拟器实例操作</h2>
        <h4 id="caseConfig_args">2.3.1实例参数配置</h4>
        <img :src="ptss7" alt="">
        <h4 id="caseConfig_args2">2.3.2安全参数配置</h4>
        <img :src="ptss8" alt="">
        <h4 id="caseConfig_message">2.3.3响应报文配置</h4>
        <img :src="ptss9" alt="">
        <h4 id="caseConfig_argFile">2.3.4关联文件配置</h4>
        <img :src="ptss10" alt="">
        <h4 id="caseConfig_scene">2.3.5延迟时间配置</h4>
        <img :src="ptss11" alt="">
        <h4 id="caseConfig_statistics">2.3.6运行统计</h4>
        <img :src="ptss12" alt="">
        <h4 id="caseConfig_logs">2.3.7日志监控</h4>
        <img :src="ptss13" alt="">
      </article>
    </div>
    <div style="    text-align: CENTER;
    margin-top: 140px;
    font-size: 28px;
    color: #808695;">
      更多内容待录入......
    </div>
  </div>
</template>
<script>
  import {requestServices} from '../../api/api'
  export default{
    data(){
      return {
        ptss1:require("../../assets/img/ptss1.png"),
        ptss2:require("../../assets/img/ptss2.png"),
        ptss3:require("../../assets/img/ptss3.png"),
        ptss4:require("../../assets/img/ptss4.png"),
        ptss5:require("../../assets/img/ptss5.png"),
        ptss6:require("../../assets/img/ptss6.png"),
        ptss7:require("../../assets/img/ptss7.png"),
        ptss8:require("../../assets/img/ptss8.png"),
        ptss9:require("../../assets/img/ptss9.png"),
        ptss10:require("../../assets/img/ptss10.png"),
        ptss11:require("../../assets/img/ptss11.png"),
        ptss12:require("../../assets/img/ptss12.png"),
        ptss13:require("../../assets/img/ptss13.png"),
        anchorvisble:true,
      }
    },
    methods:{
      //操作手册下载
      manualDownloadEvent(){
        requestServices.manualDownload()
      },
    }
  }
</script>
