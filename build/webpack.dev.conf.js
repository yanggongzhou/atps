'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    after(app){
      app.get(`/api/checkLogin`, function (req, res) {
        res.send({code: 0, isSuper: 1, userId: 11})
      });

      app.get(`/user/getUserPermissions`, function (req, res) {
        //当前用户角色（测试、管理员）
        res.send({code: 0, isSuper: 1, userId: 11,defaultType:2})
      });
      //拆包
      app.get(`/unpack/typeList`, function (req, res) {
        res.send({code: 0, unpackTypeList: [{type: "w"}, {type: 'e'}]})
      });
      app.get('/unpack', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                unpackName: '名字',
                unpackConf: '{"con":"fig1"}',
                unpackType: 'w',
                desc: '备注',
                state: 0
              },
              {
                id: 111,
                unpackName: '名字1',
                unpckConf: '{"con":"fig2"}',
                desc: '备注',
                unpackType: 'w',
                state: 1
              },
              {
                id: 11,
                unpackName: '名字2',
                unpackConf: '{"con":"fig3"}',
                desc: '备注',
                unpackType: 'w',
                state: 2
              }
            ],
            total: 10
          }
        })
      });
      //交易识别
      app.get(`/search/typeList`, function (req, res) {
        res.send({
          code: 0,
          searchTypeList: [{type: 'jsonPath', jsonConf: '{"name":1}'}, {type: 'reg', jsonConf: '{"age":2}'}]
        })
      });

      app.get('/sec', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                secName: '安全名称1',
                secType: '新一代安全',
                installShell: 'shell脚本1',
                installVar: '变量名1',
                appendProfile: '环境变量1',
                startCmd: '启动命令1',
                stopCmd: "停止命令1",
                confirmCmd: '确认命令1'
              },
              {
                id: 2,
                secName: '安全名称2',
                secType: 'CSSP',
                installShell: 'shell脚本2',
                installVar: '变量名2',
                appendProfile: '环境变量2',
                startCmd: '启动命令2',
                stopCmd: "停止命令2",
                confirmCmd: '确认命令2'
              }
            ],
            total: 10
          }
        })
      });
      app.get('/search', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                searchName: '名字',
                config: 'config',
                desc: '备注',
                state: 0
              },
              {
                id: 111,
                searchName: '名字1',
                config: 'config1',
                desc: '备注',
                state: 1
              },
              {
                id: 11,
                searchName: '名字2',
                config: 'config2',
                desc: '备注',
                state: 2
              }
            ],
            total: 10
          }
        })
      });
      app.get('/simu/typeList', function (req, res) {
        res.send({
          code: 0,
          adapterTypeList: [{type: "w"}, {type: 'e'}]
        })
      });
      app.get('/simu', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                name: 'xitomng',
                adapterType: 'tcp',
                chsName: '名字',
                jsonConf: 'configaskcewfnwnovnernvkfdnvfnvjfnvlnlenvlrenovnrnvlnvjfnvjnfvndnvjdfnjvnskjnfnv;odfnvofnvnfndfnvvfdnvndf' +
                'cbibcneroncoernconcrcnirncirncirnicnirencirniprencripcnsldk/cnakdvnkajbvkbsakvbdkbdvabsjvbasbdvjlbvjlsd' +
                'dcsakcbidsbcdsnlcnsalkcnlkdsnckldnkvlndlkvndfklnvldsnvdnl',
                remarks: '备注',
                state: 0
              },
              {
                id: 111,
                name: 'xitomng2',
                adapterType: 'tcp1',
                chsName: '名字1',
                jsonConf: 'configaskcewfnwnovnernvkfdnvfnvjfnvlnlenvlrenovnrnvlnvjfnvjnfvndnvjdfnjvnskjnfnv;odfnvofnvnfndfnvvfdnvndf' +
                'cbibcneroncoernconcrcnirncirncirnicnirencirniprencripcnsldk/cnakdvnkajbvkbsakvbdkbdvabsjvbasbdvjlbvjlsd' +
                'dcsakcbidsbcdsnlcnsalkcnlkdsnckldnkvlndlkvndfklnvldsnvdnl',
                remarks: '备注',
                state: 1
              },
              {
                id: 11,
                adapterType: 'tcp2',
                chsName: '名字2',
                jsonConf: 'configaskcewfnwnovnernvkfdnvfnvjfnvlnlenvlrenovnrnvlnvjfnvjnfvndnvjdfnjvnskjnfnv;odfnvofnvnfndfnvvfdnvndf' +
                'cbibcneroncoernconcrcnirncirncirnicnirencirniprencripcnsldk/cnakdvnkajbvkbsakvbdkbdvabsjvbasbdvjlbvjlsd' +
                'dcsakcbidsbcdsnlcnsalkcnlkdsnckldnkvlndlkvndfklnvldsnvdnl',
                remarks: '备注',
                state: 2
              }
            ],
            total: 10
          }
        })
      });
      app.get('/instanceList', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                confId: 1,
                ip: '128.196.128.144',
                chsName: 'chsName',
                simuName: 'MQceshi',
                taskName: '个人客户综合积分',
                taskNo: 'a12',
                userName: '实例名字',
                userPwd: 'wondon',
                adapterType: 'Http',
                state: 8,
                perfJsonConf: '{"serverPort":1,"minThread":90,"maxThread":100,"maxIdleTime":5,"acceptThread":66}',
                secId: 1,
                secFileId: 1,
                secConf: '{"localSecNodeId":1,"secType":1,"msgHeaderType":1,"isIgnore":true}'
              },
              {
                id: 2,
                confId: 2,
                ip: '128.196.128.134',
                chsName: 'chsName2',
                simuName: 'MQceshi2',
                taskName: 'taskName2',
                taskNo: 'a12',
                userName: '实例名字2',
                userPwd: 'wondon2',
                adapterType: 'TcpShort',
                state: 1,
                perfJsonConf: '{"serverPort":8080,"dealThreadCnt":23,"retIpPorts":2}',
                secId: 2,
                secFileId: 2,
                secConf: '{"localSecNodeId":222,"secType":2,"msgHeaderType":2,"isIgnore":false}'
              },
              {
                id: 3,
                confId: 3,
                ip: '128.196.128.14',
                chsName: 'chsName3',
                simuName: 'MQceshi3',
                taskName: 'taskName3',
                taskNo: 'a13',
                userName: '实例名字3',
                userPwd: 'wondon3',
                adapterType: 'WebShpereMQ',
                state: 9,
                secId: 3,
                perfJsonConf: '{"serverPort":8080,"maxThread":23,"retIpPorts":2,"isLast":false}'
              },
              {
                id: 4,
                confId: "c4",
                ip: '128.196.128.14',
                chsName: 'chsName3',
                simuName: 'MQceshi3',
                taskName: 'taskName3',
                taskNo: 'a13',
                userName: '实例名字3',
                userPwd: 'wondon3',
                adapterType: 'ActiveMQ',
                state: 4,
                secId: 4,
                perfJsonConf: '{"serverPort":8080,"maxThread":23,"retIpPorts":2,"isLast":false}'
              },
              {
                id: 4,
                confId: 4,
                ip: '128.196.128.114',
                chsName: 'chsName3fsdf',
                simuName: 'MQceshi3fsdf',
                taskName: 'taskName3fsdf',
                taskNo: 'a13',
                userName: '实例名字sdfs',
                userPwd: 'wondon3',
                adapterType: 'ActiveMQ',
                state: 4,
                perfJsonConf: '{"serverPort":8080,"maxThread":23,"retIpPorts":2,"isLast":false}'
              },
            ],
            total: 10
          }
        })
      });
      app.get('/instance', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                confId: 1,
                ip: '128.196.128.144',
                chsName: 'chsName',
                simuName: 'MQceshi',
                taskName: '个人客户综合积分',
                taskNo: 'a12',
                userName: '实例名字',
                userPwd: 'wondon',
                adapterType: 'Http',
                state: 8,
                perfJsonConf: '{"serverPort":1,"minThread":90,"maxThread":100,"maxIdleTime":5,"acceptThread":66}',
                secId: 1,
                secFileId: 1,
                secConf: '{"localSecNodeId":1,"secType":1,"msgHeaderType":1,"isIgnore":true}'
              },
              {
                id: 2,
                confId: 2,
                ip: '128.196.128.134',
                chsName: 'chsName2',
                simuName: 'MQceshi2',
                taskName: 'taskName2',
                taskNo: 'a12',
                userName: '实例名字2',
                userPwd: 'wondon2',
                adapterType: 'TcpShort',
                state: 1,
                perfJsonConf: '{"serverPort":8080,"dealThreadCnt":23,"retIpPorts":2}',
                secId: 2,
                secFileId: 2,
                secConf: '{"localSecNodeId":222,"secType":2,"msgHeaderType":2,"isIgnore":false}'
              },
              {
                id: 3,
                confId: 3,
                ip: '128.196.128.14',
                chsName: 'chsName3',
                simuName: 'MQceshi3',
                taskName: 'taskName3',
                taskNo: 'a13',
                userName: '实例名字3',
                userPwd: 'wondon3',
                adapterType: 'WebShpereMQ',
                state: 9,
                secId: 3,
                perfJsonConf: '{"serverPort":8080,"maxThread":23,"retIpPorts":2,"isLast":false}'
              },
              {
                id: 4,
                confId: "c4",
                ip: '128.196.128.14',
                chsName: 'chsName3',
                simuName: 'MQceshi3',
                taskName: 'taskName3',
                taskNo: 'a13',
                userName: '实例名字3',
                userPwd: 'wondon3',
                adapterType: 'ActiveMQ',
                state: 4,
                secId: 4,
                perfJsonConf: '{"serverPort":8080,"maxThread":23,"retIpPorts":2,"isLast":false}'
              },
              {
                id: 4,
                confId: 4,
                ip: '128.196.128.114',
                chsName: 'chsName3fsdf',
                simuName: 'MQceshi3fsdf',
                taskName: 'taskName3fsdf',
                taskNo: 'a13',
                userName: '实例名字sdfs',
                userPwd: 'wondon3',
                adapterType: 'ActiveMQ',
                state: 4,
                perfJsonConf: '{"serverPort":8080,"maxThread":23,"retIpPorts":2,"isLast":false}'
              },
            ],
            total: 10
          }
        })
      });
      app.put('/instance', function (req, res) {
        res.send({
          code: 0,
        })
      });
      app.get('/instance/2/secConfirm', function (req, res) {
        res.send({
          code: 0,
          isStart: false,
        })
      });
      app.get('/instance/1/secConfirm', function (req, res) {
        res.send({
          code: 0,
          isStart: true,
        })
      });
      app.get('/instance/instanceList', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                ip: '128.196.128.144',
                adapterType: 'shipeiqi',
                perfJsonConf: '{peizhi:1}',
                userName: 'yonghuming',
                userPwd: 'mima'
              },
              {
                id: 2,
                ip: '128.196.128.134',
                adapterType: 'shipeiqi2',
                perfJsonConf: '{peizhi:1}',
                userName: 'username',
                userPwd: 'mima'
              },
            ],
            total: 10
          }
        })
      });
      app.post('/instance/migration', function (req, res) {
        res.send({
          code: 0,
        })
      });
      app.get('/task/applyList', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                taskId: 14,
                taskName: '个人客户人物名',
                taskNo: '任务编号a12',
                userName: '申请人名',
                state: 0,
                simuTypeId: 1,
                simuName: '模拟器类型名MQceshi',
                adapterType: 'TCP',
                chsName: 'chsName',
                beginDate: '2019-08-01',
                endDate: '2019-08-01',
                expectProgressNum: 1,//部署套数
                expectThread: 2,//预估并发数
                maxTps: 2,//最大tps
              }
            ],
            total: 10
          }
        })
      });
      app.get('/task/repeatApplyList', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                taskId: 14,
                taskName: '个人客户人物名',
                taskNo: '任务编号a12',
                userName: '申请人名',
                state: 1,
                simuTypeId: 1,
                simuName: '模拟器类型名MQceshi',
                adapterType: 'TCP',
                chsName: 'chsName',
                beginDate: '2019-08-01',
                endDate: '2019-08-01',
                userPwd: 'wondon',
                perfJsonConf: '{"serverPort":1,"minThread":90,"maxThread":100,"maxIdleTime":5,"acceptThread":66}'
              }
            ],
            total: 10
          }
        })
      });

      app.get('/argsFile', function (req, res) {
        res.send({
          code: 0,
          page: {
            rows: [
              {
                id: 1,
                instanceId: 2,
                aliasName: '测试关联文件1',
                haveTitle: false,
                enabled: true,
                fileName: '测试关联文件.xml',
                fileType: 1,
                creater: 11,
                relatedConf: '<xml>得分热风</xml>',
                specialConf: '<xml>特殊配置</xml>',
                url: 'http://sdefre'
              },
              {
                id: 2,
                instanceId: 1,
                aliasName: '测试参数文件2',
                fileName: '测试参数文件.xml',
                haveTitle: true,
                enabled: false,
                fileType: 2,
                creater: 11,
                relatedConf: '<xml>得分热风1</xml>',
                specialConf: '<xml>特殊配置1</xml>',
                url: 'http://sdefre'
              }
            ],
            total: 10
          }
        })
      });
      app.get('/argsFile/1/getContent', function (req, res) {
        res.send({
          code: 0,
          content: 'usr_id/lan/cnvfhosdoc/038879rfrhkhiuefkihaclnlnlanldcl723979379,kdcfk/frehins/2163923169293682634hi3278123213'
        })
      });
      app.get('/argsFile/2/getContent', function (req, res) {
        res.send({
          code: 0,
          content: 'fwkehk/lan/cnvfhosdoc/038879rfrhsdfhuefkihaclnlnlanldcl723979379,kdcfk/frehins/2163923169293682634hi3278123213'
        })
      });

      app.get('/influx',function(req,res) {
        res.send({
          code: 0,
          step: "3000",
          TPSList: [
            {
              name: "ptssTrans",
              colunms: ['time', "TPS"],
              tags: {TxCode: 'SA0100900'},
              values: [
                [1575942051000, 20],
                [1575942054000, 74],
                [1575942057000, 75],
                [1575942060000, 50],
              ]
            }
          ],
          dealTimeList: [//处理时间
            {
              name: "ptssTrans",
              colunms: ['time', "mean"],
              tags: {TxCode: 'SA0100900'},
              values: [
                [1575942051000, 55.555],
                [1575942054000, 59.620],
                [1575942057000, 23.506],
                [1575942060000, 30.440],
              ],
            },
            {
              name: "ptssTrans1",
              colunms: ['time', "mean"],
              tags: {TxCode: 'SA0200111'},
              values: [
                [1575942051000, 45.555],
                [1575942054000, 49.620],
                [1575942057000, 13.506],
                [1575942060000, 33.440],
              ],
            },
            {
              name: "ptssTrans2",
              colunms: ['time', "mean"],
              tags: {TxCode: 'SA02001331'},
              values: [
                [1575942051000, 95.555],
                [1575942054000, 109.620],
                [1575942057000, 13.506],
                [1575942060000, 53.440],
              ],
            },
            {
              name: "ptssTrans3",
              colunms: ['time', "mean"],
              tags: {TxCode: 'SA021331'},
              values: [
                [1575942051000, 195.555],
                [1575942054000, 19.620],
                [1575942057000, 153.506],
                [1575942060000, 43.440],
              ],
            },
            {
              name: "ptssTrans4",
              colunms: ['time', "mean"],
              tags: {TxCode: 'SA0219931'},
              values: [
                [1575942051000, 95.555],
                [1575942054000, 9.620],
                [1575942057000, 163.506],
                [1575942060000, 143.440],
              ],
            }
          ],
          outTimeList: [
            {
              name: "ptssTrans",
              colunms: ['time', "overCnt"],
              tags: {TxCode: 'SA0100900'},
              values: [
                [1575942051000, 5],
                [1575942054000, 29],
                [1575942057000, 11],
                [1575942060000, 12],
              ],
            }
          ],
          sceneList: [
            {
              name: "ptssTrans",
              colunms: ['time', "okavg", "delayAvg"],
              tags: {TxCode: 'SA0100900'},
              values: [
                [1575942051000, 55.555, 50],
                [1575942054000, 59.620, 50],
                [1575942057000, 23.506, 50],
                [1575942060000, 30.440, 50],
              ],
            }
          ],
          totalList: [
            {
              name: "ptssTrans",
              colunms: ['time', "total"],
              tags: {TxCode: 'SA0100900'},
              values: [
                [1575942052010, 219]
              ],
            }
          ]
        });
      });
      app.get('/ptssLog/1/logLevel',function(req,res) {
        res.send({
          code: 0,
          level:'error'
        });
      });
      app.get('/ptssLog/2/logLevel',function(req,res) {
        res.send({
          code: 0,
          level:'info'
        });
      });
      app.get('/ptssLog/1/ptssLog',function(req,res) {
        res.send({
          code: 0,
          content:'info\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\n' +
          'info\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\n' +
          'info\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\n' +
          'info\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\n' +
          'info\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\ninfo\nerror\n\rwarn\n'
        });
      });
      app.get('/ptssLog/2/ptssLog',function(req,res) {
        res.send({
          code: 0,
          content:'info2\nerror2\n\rwarn2'
        });
      });
      app.put('/ptssLog/updateLevel',function(req,res) {
        res.send({
          code: 0,
          level:'info'
        });
      });
      app.get('/machine',function(req,res){
        res.send({
          code:0,
          page:{
            rows:[
              {
                id:1,
                ip: '128.196.128.144',
                cpu: 18,
                mem:16,
                state:0,
                rootPasswd: 'London'
              },
              {
                id:2,
                ip: '128.196.128.143',
                cpu: 24,
                mem:8,
                state:0,
                rootPasswd: 'Londonk'
              },
              {
                id:3,
                ip: '128.196.128.142',
                cpu: 30,
                mem:8,
                state:1,
                rootPasswd: 'Park'
              },
              {
                id:4,
                ip: '128.196.128.141',
                cpu: 26,
                mem:128,
                state:1,
                rootPasswd: 'rk'
              }
            ],
            total:10
          }
        })
      });
      app.post('/machine',function(req,res){
        res.send({code:0})
      });
      app.put('/machine',function(req,res){
        res.send({code:0})
      });
      app.post('/machine/batchRemove',function(req,res){
        res.send({code:0})
      });
      app.get('/plugin',function(req,res){
        res.send({
          code:0,
          page:{
            rows:[
              {
                id:1,
                fileName:'文件1.jar',
                type:'sys',
                relatedFeild:'关联字段1',
                userName:"上传者1",
                updateTime:'2019-01-03 09:00:00',
                url:'xxx'
              },
              {
                id:2,
                fileName:'文件2.jar',
                type:'sysType',
                relatedFeild:'关联字段2',
                userName:"上传者2",
                updateTime:'2019-01-03 19:00:00',
                url:'xxx'
              },
            ],
            total:10
          }
        })
      });

      app.get('/kmc',function(req,res){
        res.send({
          code:0,
          page:{
            rows: [
              {
                id:1,
                kmcIp: '128.196.128.144',
                node: 18,
                port:16,
                authCode:0,
                startupPassword: 'London'
              },
              {
                id:2,
                kmcIp: '128.196.128.143',
                node: 24,
                port:8,
                authCode:0,
                startupPassword: 'Londonk'
              },
              {
                id:3,
                kmcIp: '128.196.128.142',
                node: 30,
                port:8,
                authCode:1,
                startupPassword: 'Park'
              },
              {
                id:4,
                kmcIp: '128.196.128.141',
                node: 26,
                port:128,
                authCode:1,
                startupPassword: 'rk'
              }
            ],
            total:10
          }
        })
      });
      app.get('/task',function(req,res){
        res.send({
          code:0,
          page:{
            rows: [
              {
                id:1,
                taskNo:'bianhao123',
                taskName:'任务名称',
                beginDate:'2019-08-15',
                endDate:'2019-08-18',
                taskUsers:[
                  {id:1,
                    userId:11,
                    userName:'孙清月',
                    loginName:"sunqingyue.zh",
                    manager:true,
                  },
                  {id:2,
                    userId:12,
                    userName:'住小明',
                    loginName:"zhuxiaoming.zh"
                  }
                ],
                desc:'备注描述'
              },
              {
                id:2,
                taskNo:'2ba123',
                taskName:'任务名称2',
                beginDate:'2019-08-15',
                endDate:'2019-08-25',
                taskUsers:[
                  {id:1,
                    userId:11,
                    userName:'孙清月',
                  },
                  {id:2,
                    userId:12,
                    userName:'住小明',
                  }
                ],
                desc:'2备注描述'
              }
            ],
            total:10
          },
        })
      });
      app.get('/project/itmList',function(req,res){
        res.send({
          code:0,
          list:[
            {
              id:1,
              name:'新一代X86资源池管理系统',
              abbr:'X86MS',
              sys_id:'TA2051',
              en_name:'X86MS',
              app_level_code:"c",
              cloud_id:32332,
              comp_type_code:'统一通讯|通用基础组件',
              kfzx:'中国建设银行股份有限公司运营数据中心',
              logicsystem_abbr:'',
              logicsystem_name:'',
              logicsystem_sysid:'',
            },
            {
              id:2,
              name:'远程银行',
              abbr:'X86MS',
              sys_id:'TA2051',
              en_name:'X86MS',
              app_level_code:"c",
              cloud_id:32332,
              comp_type_code:'统一通讯|通用基础组件',
              kfzx:'中国建设银行股份有限公司运营数据中心',
              logicsystem_abbr:'',
              logicsystem_name:'',
              logicsystem_sysid:'',
            },
            {
              id:3,
              name:'统一风险视图',
              abbr:'X86MS',
              sys_id:'TA2051',
              en_name:'X86MS',
              app_level_code:"c",
              cloud_id:32332,
              comp_type_code:'统一通讯|通用基础组件',
              kfzx:'中国建设银行股份有限公司运营数据中心',
              logicsystem_abbr:'',
              logicsystem_name:'',
              logicsystem_sysid:'',
            }
          ]
        })
      });
      app.get('/project',function(req,res){
        res.send({
          code:0,
          page:{
            rows: [
              {
                id:1,
                creator:1,
                creatTime:'2019-08-15 16:50:43',
                endDate:'2019-08-18',
                taskState:8,
                itemId:1,
                taskNo:'wqd',
                taskName:'新一代1项目',
                taskUsers:[
                  {id:1,
                    userId:11,
                    userName:'孙清月',
                    loginName:"sunqingyue.zh",
                    manager:true,
                  },
                  {id:2,
                    userId:12,
                    userName:'住小明',
                    loginName:"zhuxiaoming.zh"
                  }
                ],
                remark:'备注描述'
              },
              {
                id:2,
                creator:12,
                creatTime:'2019-08-15 16:50:43',
                endDate:'2019-08-18',
                itemId:2,
                taskNo:'wqd2',
                taskName:'新一代2项目',
                taskUsers:[
                  {id:1,
                    userId:11,
                    userName:'孙清月',
                  },
                  {id:2,
                    userId:12,
                    userName:'住小明',
                  }
                ],
                remark:'备注描述2'
              }
            ],
            total:10
          },
        })
      });

      app.get('/user',function(req,res){
        res.send({
          code:0,
          page:{
            rows: [
              {
                id:1,
                isSuper:1,
                userName:'孙清月',
                password:'123',
                loginName:'sunqingyue.zh',
                email:'123@qq.com',
                mobileNum:'1861',
              },
              {
                id:2,
                userName:'猪小明',
                password:'123',
                isSuper:2,
                loginName:'sunqingyue.zh',
                email:'123@qq.com',
                mobileNum:'1861',
              }
            ],
            total:10
          },
        })
      });
      app.get('/task/1/applyList',function(req,res){
        res.send({
          code:0,
          applyList:[
            {
              id:1,
              ip:'1',
            },
            {
              id:2,
              ip:'2',
            }
          ],
        })
      });
      app.get('/task/2/applyList',function(req,res){
        res.send({
          code:0,
          applyList:[
            {
              id:1,
              ip:'11',
            },
            {
              id:2,
              ip:'22',
            }
          ],
        })
      });
      //响应文件
      app.get('/message/1/list',function(req,res){
        res.send({
          code:0,
          staList:[
            {
              id:1,
              instanceId:1,
              messageType:2,
              tranCode:'2000_02330',
              url:'http://128.192.1.1',
              content:null,
              lastUploadTime:'2019-09-20T10:09:41.000+0000'
            },
            {
              id:2,
              instanceId:1,
              messageType:2,
              tranCode:'Aw2124141',
              url:'http://128.192.1.1',
              content:null,
              lastUploadTime:'2019-09-20T10:09:41.000+0000'
            },
          ],
          dynList:[
            {
              id:3,
              instanceId:1,
              messageType:2,
              tranCode:'AU2000_02330',
              url:'http://128.192.1.1',
              content:null,
              lastUploadTime:'2019-09-20T10:09:41.000+0000'
            },
            {
              id:4,
              instanceId:1,
              messageType:2,
              tranCode:'AM2124141',
              url:'http://128.192.1.1',
              content:null,
              lastUploadTime:'2019-09-20T10:09:41.000+0000'
            },
          ]
        })
      });
      app.get('/message/2/list',function(req,res){
        res.send({
          code:0,
          staList:[
            {
              id:1,
              instanceId:1,
              messageType:2,
              tranCode:'www2000_02330',
              url:'http://128.192.1.1',
              dynConf:'',
              content:null,
              lastUploadTime:'2019-09-20T10:09:41.000+0000'
            },
            {
              id:2,
              instanceId:1,
              messageType:2,
              tranCode:'rrr2124141',
              url:'http://128.192.1.1',
              content:null,
              dynConf:'',
              lastUploadTime:'2019-09-20T10:09:41.000+0000'
            },
          ],
          dynList:[
            {
              id:3,
              instanceId:1,
              messageType:2,
              tranCode:'EU2000_02330',
              url:'http://128.192.1.1',
              content:null,
              dynConf:"<xml>规则测试3</xml> \r\n <xml>规则测试3</xml>",
              lastUploadTime:'2019-09-20T10:09:41.000+0000'
            },
            {
              id:4,
              instanceId:1,
              messageType:2,
              tranCode:'YM2124141',
              url:'http://128.192.1.1',
              content:null,
              dynConf:"<xml>规则测试4</xml> \r\n <xml>规则测试4</xml>",
              lastUploadTime:'2019-09-20T10:09:41.000+0000'
            },
          ]
        })
      });
      app.get('/message/3/list',function(req,res){
        res.send({
          code:0,
          staList:[],
          dynList:[]
        })
      });
      app.get('/message/1/getContent',function(req,res){
        res.send(
          {
            content:"<xml></xml> \r\n <xml></xml> "
          }
        )
      });
      app.get('/message/3/getContent',function(req,res){
        res.send(
          {
            content:"<xml>测试3</xml> \r\n <xml>测试3</xml> "
          }
        )
      });
      app.get('/message/4/getContent',function(req,res){
        res.send(
          {
            content:"<xml>测试4</xml> \r\n <xml>测试4</xml> "
          }
        )
      });
      app.get('/message',function(req,res){
        res.send(
          {
            page:{
              rows: [
                {
                  id:1,
                  isdyn:2,
                  lastUploadTime:'2019-2'
                },
                {
                  id:2,
                  isdyn:1,
                  lastUploadTime:'2019-21'
                },
              ],
              total:10
            },
            total:10,

          }
        )
      });
      //实例启动状态
      app.get('/instance/1/isStart',function(req,res){
        res.send({
          code:0,
          isStart:0,
        })
      });
      //实例启动状态
      app.get('/instance/2/isStart',function(req,res){
        res.send({
          code:0,
          isStart:1,
        })
      });
      app.get('/instance/3/isStart',function(req,res){
        res.send({
          code:0,
          isStart:2,
        })
      });
      //延迟时间
      app.get('/instance/1/scene',function(req,res){
        res.send({
          code:0,
          scene:{
            id:1,
            instanceId:1,
            delayPolicy:1,
            defaultDelay:200,
            sceneLists:null
          },
          txCodeSceneLists:[
            {
              delayPolicy:2,
              noList:'sss1',
              isEnabled:true,
              delay:100,
              id:1,
              sceneId:2,
            },
            {
              delayPolicy:2,
              noList:'sss2',
              isEnabled:false,
              delay:300,
              id:3,
              sceneId:2,
            },
          ],
          sysNoSceneLists:[
            {
              delayPolicy:3,
              noList:'yy1',
              isEnabled:false,
              delay:1010,
              id:1,
              sceneId:2,
            },
            {
              delayPolicy:3,
              noList:'yy2',
              isEnabled:false,
              delay:300,
              id:3,
              sceneId:2,
            },
          ],
          secNoSceneLists:[
            {
              delayPolicy:4,
              noList:'uu1',
              isEnabled:true,
              delay:1100,
              id:1,
              sceneIds:2,
            }
          ],
        })
      });
      app.get('/instance/2/scene',function(req,res){
        res.send({
          code:0,
          scene:{
            id:2,
            instanceId:2,
            delayPolicy:2,
            defaultDelay:202,
            sceneLists:null
          },
          txCodeSceneLists:[
            {
              delayPolicy:2,
              noList:'sss1',
              isEnabled:true,
              delay:100,
              id:1,
              sceneId:2,
            },
            {
              delayPolicy:2,
              noList:'sss2',
              isEnabled:false,
              delay:300,
              id:3,
              sceneId:2,
            },
          ],
          sysNoSceneLists:[
            {
              delayPolicy:3,
              noList:'yy1',
              isEnabled:false,
              delay:1010,
              id:1,
              sceneId:2,
            },
            {
              delayPolicy:3,
              noList:'yy2',
              isEnabled:false,
              delay:300,
              id:3,
              sceneId:2,
            },
          ],
          secNoSceneLists:[
            {
              delayPolicy:4,
              noList:'uu1',
              isEnabled:true,
              delay:1100,
              id:1,
              sceneIds:2,
            }
          ],
        })
      });
    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
