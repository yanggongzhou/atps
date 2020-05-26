import axios from 'axios'
import qs from 'qs'
import {Modal,Notice,Message} from 'iview';//提示框

import { auth } from './auth'

const _baseURL = "http://localhost:8080/"
const instance = axios.create({
  baseURL:_baseURL
});
// baseURL:"http://localhost:8080/"
//baseURL:"http://128.195.0.6:8005/" //测试服务器
//baseURL:"http://128.196.1.45:8005/" //生产服务器

const prevHandler = ({data}) => {
  if(data.code===-1){
    Message.error({content:data.msg, duration: 3})
  }else{
    switch (data.code) {
      case 500:
        Notice.error({title:data.msg});
        break;
      case 403:
        Notice.error({title:data.msg});
        break;
      case 401:
        Notice.error({title:data.msg});
        // location.reload();
      case 400:
        Notice.error({title:data.msg});
      default:
    }
  }
  return data
};

//错误弹出框
function errorMess(response){
    Notice.error({
      title:response.status,
      desc:response.request.responseURL+' \r\n ('+response.statusText+')',
      duration:4.5
    })
}

const prevErrHandler = ({response}) => {
    switch (response.status) {
        case 404:
          errorMess(response);
            break;
        case 401:
          Notice.error({title:"未登录/认证失败，请重新登录",duration:4.5 });
          // errorMess(response);
          //   location.reload();
            break;
        case 500:
          errorMess(response);
            break;
        default:
    }
    throw new Error('系统异常');
};

instance.interceptors.response.use(prevHandler,prevErrHandler);
instance.interceptors.request.use(
    config => {
      // let token = auth.getCookie('token');
      // if (token&&token!=="undefined") {
      //   //请求报文添加Authorization，用于用户身份验证
      //   config.headers['Authorization'] = "Bearer "+token;
      // }
      config.headers['Content-type'] = 'application/json';
      return config;
    },
    err => {
        return Promise.reject(err);
    }
);
export const requestServices={
  baseURL:_baseURL,
  //获取用户token
  getUserPomissions(params){
    return instance.get(`/user/getUserPermissions`,{params:params}).then((res) => res)
  },
  //模拟器拆包类型管理
  unpackList(params){
    return instance.get(`/unpack`,{params:params}).then((res) => res)
  },
  unpackTypeList(){//拆包路径类型
    return instance.get(`/unpack/typeList`).then((res) => res)
  },
  unpackSave(params){
    return instance.post(`/unpack`,params).then((res) => res)
  },
  unpackUpdate(params){
    return instance.put(`/unpack`,params).then((res) => res)
  },
  unpackDelete(params){
    return instance.delete(`/unpack/batchRemove/${params}`).then((res) => res)
  },
  //安全组件管理
  secList(params){
    return instance.get(`/sec`,{params:params}).then((res) => res)
  },
  secUpload(params){//增
    let config = {
      headers:{'Content-Type': 'multipart/form-data'}
    };
    return instance.post(`/sec/upload`,params,config).then((res) => res)
  },
  secUpdateUpload(params){//改
    let config = {
      headers:{'Content-Type': 'multipart/form-data'}
    };
    return instance.post(`/sec/updateUpload`,params,config).then((res) => res)
  },
  secDelete(params){
    return instance.delete(`/sec/batchRemove`,{data:params}).then((res) => res)
  },

  secFileList(params){
    return instance.get(`/sec/file`,{params:params}).then((res) => res)
  },
  secFileDelete(params){
    return instance.delete(`/sec/file/batchRemove`,{data:params}).then((res) => res)
  },
  secFileUpload(params){
    let config = {
      headers:{'Content-Type': 'multipart/form-data'}
    };
    return instance.post(`/sec/file/upload`,params,config).then((res) => res)
  },
  //交易识别管理
  searchList(params){
    return instance.get(`/search`,{params:params}).then((res) => res)
  },
  searchTypeList(){//交易识别类型
    return instance.get(`/search/typeList`).then((res) => res)
  },
  searchSave(params){
    return instance.post(`/search`,params).then((res) => res)
  },
  searchUpdate(params){
    return instance.put(`/search`,params).then((res) => res)
  },
  searchDelete(params){
    return instance.delete(`/search/batchRemove/${params}`).then((res) => res)
  },
  //模拟器类型组装
  simuList(params){
    return instance.get(`/simu`,{params:params}).then((res) => res)
  },
  simuTypeList(){//适配器类型
    return instance.get(`/simu/typeList`).then((res) => res)
  },
  simuSave(params){
    return instance.post(`/simu`,params).then((res) => res)
  },
  simuUpdate(params){
    return instance.put(`/simu`,params).then((res) => res)
  },
  simuDelete(params){
    return instance.delete(`/simu/batchRemove/${params}`).then((res) => res)
  },
  //修改密码
  changePasswd(params){
    return instance.put(`/instance/changePasswd`,params).then((res) => res)
  },
  //模拟器实例管理--已分配实例
  instanceList(params){
    return instance.get(`/instance`,{params:params}).then((res) => res)
  },
  instanceUpdate(params){
    return instance.put(`/instance`,params).then((res) => res)
  },
  instanceRecover(params){
    return instance.post(`/instance/recover/${params}`).then((res) => res)
  },
  instanceStart(params){
    return instance.get(`/instance/${params}/start`).then((res) => res)
  },
  instanceStop(params){
    return instance.get(`/instance/${params}/stop`).then((res) => res)
  },
  instanceRefresh(params){
    return instance.get(`/instance/${params}/refresh`).then((res) => res)
  },
  instanceIsStart(params){
    return instance.get(`/instance/${params}/isStart`).then((res) => res)
  },
  //模拟器实例管理--待分配申请
  applyList(params){
    return instance.get(`/task/applyList`,{params:params}).then((res) => res)
  },
  applyUpdate(params){
    return instance.put(`/task/apply`,params).then((res) => res)
  },
  applyDelete(params){
    return instance.delete(`/task/batchRemove/apply/${params}`).then((res) => res)
  },
  instanceAllList(params){//空闲的实例（未分配/回收的）--复用部署
    return instance.get(`/instance/instanceList`,{params:params}).then((res) => res)
  },
  instanceDeploy(params){//部署实例
    return instance.post(`/instance/instanceList`,params).then((res) => res)
  },
  instanceNewDeploy(params){//全新部署
    return instance.post(`/instance`,params).then((res) => res)
  },
  instanceMigration(params){//迁移部署
    return instance.post(`/instance/migration`,params).then((res) => res)
  },
  //模拟器实例管理--待审核复用申请
  repeatApplyList(params){
    return instance.get(`/task/repeatApplyList`,{params:params}).then((res) => res)
  },
  //安装
  installSec(params){
    return instance.post(`/instance/installSec`,params).then((res) => res)
  },
  //操作手册下载
  manualDownload(){
    return instance.get(`/download/manual`).then((res) => res)
  },
  //获取安全日志级别
  secLogLevel(instanceId){
    return instance.get(`/sec/${instanceId}/logLevel`).then((res) => res)
  },
  //更新安全日志级别
  secUpdateLevel(instanceId,level){
    return instance.get(`/sec/${instanceId}/updateLevel/${level}`).then((res) => res)
  },
  //启动/停止
  secCmd(params,type){
    return instance.get(`/instance/${params}/secCmd/${type}`).then((res) => res)
  },
  //确认状态
  secConfirm(params){
    return instance.get(`/instance/${params}/secConfirm`).then((res) => res)
  },
  //实例参数
  // argsList(params){
  //   if(!params){
  //     return false
  //   }
  //   return instance.get(`/instance/${params}/args`)
  // },
  // argsUpdate(params){
  //   return instance.put(`/instance/updateArgs`,params).then((res) => res)
  // },

  //响应报文管理
  messageList(params){
    if(!params){return false}
    return instance.get(`/message/${params}/list`).then((res) => res)
  },
  messageDelete(params){
    if(!params){return false}
    return instance.delete(`/message/batchRemove`,{data:params}).then((res) => res)
  },
  tranCodeSave(params){
    return instance.post(`/message`,params).then((res) => res)
  },
  tranCodeUpdate(params){
    return instance.put(`/message/editTranCode`,params).then((res) => res)
  },
  getContent(params){
    if(!params){return false}
    return instance.get(`/message/${params}/getContent`).then((res) => res)
  },
  updateContent(params){
    return instance.put(`/message/updateContent`,params).then((res) => res)
  },
  messageUpload(params){
    let config = {
      headers:{'Content-Type': 'multipart/form-data'}
    };
    return instance.post(`/message/upload`,params,config).then((res) => res)
  },
  //全局响应报文文件交易码查询
  messageTranCode(params){
    if(!params){return false}
    return instance.get(`/message`,{params:params}).then((res) => res)
  },
  // //报文所属任务
  // taskTranCode(params){
  //   if(!params){return false}
  //   return instance.get(`/message/getTaskByTranCode`,{params:params}).then((res) => res)
  // },
  //一键复刻
  copyTrans(confId,id){
    return instance.get(`/message/${confId}/copyTrans/${id}`).then((res) => res)
  },
  //响应报文管理--文件规则
  messageUpdateDynConf(params){
    return instance.post(`/message/updateDynConf`,params).then((res) => res)
  },
  // msgRuleTypeList(){
  //   return instance.get(`/dynamic/typeList`).then((res) => res)
  // },
  // msgRuleList(params){
  //   if(!params){return false}
  //   return instance.get(`/dynamic/${params}/list`).then((res) => res)
  // },
  // msgRuleSave(params){
  //   return instance.post(`/dynamic`,params).then((res) => res)
  // },
  // msgRuleUpdate(params){
  //   return instance.put(`/dynamic`,params).then((res) => res)
  // },
  // msgRuleDelete(params){
  //   if(!params){return false}
  //   return instance.delete(`/dynamic/batchRemove`,{data:params}).then((res) => res)
  // },
  ////规则--正则表达式
  // regList(params){
  //   return instance.get(`/dynamic/${params}/reg/list`).then((res) => res)
  // },
  // regSave(params){
  //   return instance.post(`/dynamic/updateBatchRegOrLen`,params).then((res) => res)
  // },

  //参数文件管理
  argsFileList(params){
    if(!params){return false}
    return instance.get(`/argsFile`,{params:params}).then((res) => res)
  },
  argsFileDelete(params){
    if(!params){return false}
    return instance.delete(`/argsFile/batchRemove`,{data:params}).then((res) => res)
  },
  argsFileUpdate(params){
    return instance.put(`/argsFile`,params).then((res) => res)
  },
  argsFileUpload(params){
    let config = {
      headers:{'Content-Type': 'multipart/form-data'}
    };
    return instance.post(`/argsFile/upload`,params,config).then((res) => res)
  },
  argsTableFileUpload(params){//表格内上传
    let config = {
      headers:{'Content-Type': 'multipart/form-data'}
    };
    return instance.post(`/argsFile/updateUpload`,params,config).then((res) => res)
  },
  argsFilePreview(params){
    return instance.get(`/argsFile/${params}/getContent`).then((res) => res)
  },
  //延迟时间配置
  scenePage(params){
    if(!params){
      return false
    }
    return instance.get(`/instance/${params}/scene`).then((res) => res)
  },
  scenePolicyUpdate(params){
    return instance.put(`/instance/updateScene`,params).then((res) => res)
  },
  // sceneList(params1,params2){
  //   return instance.get(`/instance/${params1}/sceneList/${params2}`).then((res) => res)
  // },

  //9月25注释掉，为把延迟策略列表改为表内编辑并且
  // sceneSave(params){
  //   return instance.post(`/instance/scene/sceneList`,params).then((res) => res)
  // },
  // sceneUpdate(params){
  //   return instance.put(`/instance/scene/sceneList`,params).then((res) => res)
  // },
  // sceneDelete(params){
  //   return instance.delete(`/instance/scene/batchRemove/${params}`).then((res) => res)
  // },

  //运行统计
  influxList(params){
    return instance.get(`/influx`,{params:params}).then((res) => res)
  },
  //日志
  logLevel(params){
    return instance.get(`/ptssLog/${params}/logLevel`).then((res) => res)
  },
  ptssLog(params){
    return instance.get(`/ptssLog/${params}/ptssLog`).then((res) => res)
  },
  updateLevel(params){
    return instance.put(`/ptssLog/updateLevel`,params).then((res) => res)
  },

  //机器管理
  machineList(params){
    return instance.get(`/machine`,{params:params}).then((res) => res)
  },
  machineCheckIP(params){//检查机器IP冲突与否
    return instance.get(`/machine/checkIP`,{params:params}).then((res) => res)
  },
  machineSave(params){
    return instance.post(`/machine`,params).then((res) => res)
  },
  machineUpdate(params){
    return instance.put(`/machine`,params).then((res) => res)
  },
  machineDelete(params){
    return instance.delete(`/machine/batchRemove/${params}`).then((res) => res)
  },
  siteList(){//所有位置
    return instance.get(`/machine/siteList`).then((res) => res)
  },
  //KMC
  kmcList(params){
    return instance.get(`/kmc`,{params:params}).then((res) => res)
  },
  kmcCheckIP(params){//检查IP冲突与否
    return instance.get(`/machine/checkIP`,{params:params}).then((res) => res)
  },
  kmcSave(params){
    return instance.post(`/kmc`,params).then((res) => res)
  },
  kmcUpdate(params){
    return instance.put(`/kmc`,params).then((res) => res)
  },
  kmcDelete(params){
    return instance.delete(`/kmc/batchRemove/${params}`).then((res) => res)
  },
  //人员管理
  userList(params){
    return instance.get(`/user`,{params:params}).then((res) => res)
  },
  userSave(params){
    return instance.post(`/user`,params).then((res) => res)
  },
  userUpdate(params){
    return instance.put(`/user`,params).then((res) => res)
  },
  userDelete(params){
    return instance.delete(`/user/batchRemove`,{data:params}).then((res) => res)
  },
  //安全组件管理
  pluginList(params){
    return instance.get(`/plugin`,{params:params}).then((res) => res)
  },
  pluginDownload(params){
    // let config = {
    //   headers :{
    //     responseType: 'blob'
    //   }
    // };
    return instance.get(`/download`,{params:params}).then((res) => res)
  },
  pluginSave(params){//增
    let config = {
      headers:{'Content-Type': 'multipart/form-data'}
    };
    return instance.post(`/plugin`,params,config).then((res) => res)
  },
  pluginUpdate(params){//改
    let config = {
      headers:{'Content-Type': 'multipart/form-data'}
    };
    return instance.put(`/plugin`,params,config).then((res) => res)
  },
  pluginDelete(params){
    return instance.delete(`/plugin/batchRemove`,{data:params}).then((res) => res)
  },
  //任务申请（模拟器申请）
      //任务
  taskList(params){
    return instance.get(`/task`,{params:params}).then((res) => res)
  },
  taskSave(params){
    return instance.post(`/task`,params).then((res) => res)
  },
  taskUpdate(params){
    return instance.put(`/task`,params).then((res) => res)
  },
  taskDelete(params){
    return instance.delete(`/task/batchRemove/${params}`).then((res) => res)
  },
  taskUserSave(params){
    return instance.post(`/task/updateUser`,params).then((res) => res)
  },
  taskUserDel(params){
    return instance.post(`/task/updateUser`,params).then((res) => res)
  },
    //项目
  projectItemList:()=>instance.get(`/project/itmList`),
  projectList(params){
    return instance.get(`/project`,{params:params}).then((res) => res)
  },
  projectSave(params){
    return instance.post(`/project`,params).then((res) => res)
  },
  projectUpdate(params){
    return instance.put(`/project`,params).then((res) => res)
  },

    //申请
  taskApplyList(params){
    return instance.get(`/task/${params}/applyList`).then((res) => res)
  },
  taskApplySave(params){
    return instance.post(`/task/apply`,params).then((res) => res)
  },
  taskApplyUpdate(params){
    return instance.put(`/task/apply`,params).then((res) => res)
  },
  taskApplyDelete(params){
    // let config = {
    //   headers:{'Content-Type':'application/x-www-form-urlencoded '}
    // };
    return instance.delete(`/task/batchRemove/apply/${params}`).then((res) => res)
  },
  instanceListForReuse(params){//曾经使用过的实例列表供复用申请选择
    return instance.get(`/instance/instanceListForReuse`,{params:params}).then((res) => res)
  },
};
