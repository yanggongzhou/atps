import Vue from 'vue'
import Router from 'vue-router'
// 组件
import home from '@/components/home/home'
import test from '@/components/test'
//模拟器类型管理
import unpack from '@/components/type/unpack'
import search from '@/components/type/search'
import sec from '@/components/type/sec'
import simu from '@/components/type/simu'
//模拟器实例管理
import instanceList from '@/components/caseSetting/instanceList'
import instance from '@/components/caseSetting/instance'
import applyList from '@/components/caseSetting/applyList'
import repeatApplyList from '@/components/caseSetting/repeatApplyList'
//模拟器实例配置
import Select from '@/components/caseConfig/Select'
import args from '@/components/caseConfig/args'
import message from '@/components/caseConfig/message/message'
import argsFile from '@/components/caseConfig/argsFile'
import scene from '@/components/caseConfig/scene'
import statistics from '@/components/caseConfig/statistics/index'
import logs from '@/components/caseConfig/logs'
import history from '@/components/caseConfig/history'
//系统配置
import machine from '@/components/setting/machine'
import kmc from '@/components/setting/kmc'
import user from '@/components/setting/user'
import plugin from '@/components/setting/plugin'
//模拟器申请
import index from '@/components/taskModel/index'
//个人信息
import userMessage from '@/components/other/userMessage'
import manual from '@/components/other/manual'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'taskModel/index'
    },
    // {
    //   path: '/index',
    //   name:'index',
    //   component: index,
    // },
    {
      path: '/',
      component: home,
      children:[
        {
          path: '/test',
          name: 'test',
          component: test,
        },
        //模拟器类型管理
        {
          path: 'type/unpack',
          name: 'unpack',
          meta:{requiresAuth:true},
          component: unpack
        },
        {
          path: 'type/search',
          name: 'search',
          meta:{requiresAuth:true},
          component: search
        },
        {
          path: 'type/sec',
          name: 'sec',
          meta:{requiresAuth:true},
          component: sec
        },
        {
          path: 'type/simu',
          name: 'simu',
          meta:{requiresAuth:true},
          component: simu
        },
        //模拟器实例管理
        {
          path: 'caseSetting/instanceList',
          name: 'instanceList',
          meta:{requiresAuth:true},
          component: instanceList
        },
        {
          path: 'caseSetting/instance',
          name: 'instance',
          meta:{requiresAuth:true},
          component: instance
        },
        {
          path: 'caseSetting/applyList',
          name: 'applyList',
          meta:{requiresAuth:true},
          component: applyList
        },
        {
          path: 'caseSetting/repeatApplyList',
          name: 'repeatApplyList',
          meta:{requiresAuth:true},
          component: repeatApplyList
        },
        //模拟器实例配置
        {
          path: '/',
          component: Select,
          children:[
            {
              path: 'caseConfig/args',
              name: 'args',
              meta:{requiresAuth:true},
              component: args
            },
            {
              path: 'caseConfig/argsFile',
              name: 'argsFile',
              meta:{requiresAuth:true},
              component: argsFile
            },
            {
              path: 'caseConfig/message',
              name: 'message',
              meta:{requiresAuth:true},
              component: message
            },
            {
              path: 'caseConfig/scene',
              name: 'scene',
              meta:{requiresAuth:true},
              component: scene
            },
            {
              path: 'caseConfig/statistics',
              name: 'statistics',
              meta:{requiresAuth:true},
              component: statistics
            },
            {
              path: 'caseConfig/logs',
              name: 'logs',
              meta:{requiresAuth:true},
              component: logs
            },
            {
              path: 'caseConfig/history',
              name: 'history',
              meta:{requiresAuth:true},
              component: history
            },
          ]
        },
        //系统配置
        {
          path: 'setting/machine',
          name: 'machine',
          meta:{requiresAuth:true},
          component: machine
        },
        {
          path: 'setting/kmc',
          name: 'kmc',
          meta:{requiresAuth:true},
          component: kmc
        },
        {
          path: 'setting/user',
          name: 'user',
          meta:{requiresAuth:true},
          component: user
        },
        {
          path: 'setting/plugin',
          name: 'plugin',
          meta:{requiresAuth:true},
          component: plugin
        },
        //模拟器申请
        {
          path: 'taskModel/index',
          name: 'index',
          meta:{requiresAuth:true},
          component: index
        },
        //个人信息
        {
          path: 'other/userMessage',
          name: 'userMessage',
          meta:{requiresAuth:true},
          component: userMessage
        },
        {
          path: 'other/manual',
          name: 'manual',
          meta:{requiresAuth:true},
          component: manual
        }
      ]
    },
  ]
})
router.beforeEach((to, from, next) => {
  if(to.path === '/login') {
    // auth.removeToken();
    next()
  }else {
    // let token = auth.getToken();
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // if (!token) {
      //   next({
      //     path: '/login',
      //     query: { redirect: to.fullPath }
      //   })
      // }else {
      //   next()
      // }
      next()
    } else {
      next()
    }
  }
})
export default router;
