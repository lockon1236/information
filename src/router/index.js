import Vue from 'vue'
import Router from 'vue-router'
import MB from '@/components/MB/MB'
import MyMB from '@/components/MyMB'
import Analyze from '@/components/MB/Analyze'
import Graph from '@/components/Graph/Graph'
import GraphIndex from '@/components/Graph/GraphIndex'
import GraphSearch from '@/components/Graph/GraphSearch'
import GraphAnalyze from '@/components/Graph/GraphAnalyze'
import GraphDoc from '@/components/Graph/GraphDoc'
import GraphExcel from '@/components/Graph/GraphExcel'
import GraphVisio from '@/components/Graph/GraphVisio'
import GraphManage from '@/components/Graph/GraphManage'
import GraphMap from '@/components/Graph/GraphMap'
// GraphManage
import ModelManage from '@/components/Graph/manage/modelManage.vue';
import SynonymsManage from '@/components/Graph/manage/synonymsManage.vue';
import KeyManage from '@/components/Graph/manage/keyManage.vue';
import RouterManage from '@/components/Graph/manage/routerManage.vue';
// //////////////////////////////////////////
import Login from '@/components/login'
import Register from '@/components/register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/MyMB',
      name: 'MyMB',
      component: MyMB
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    // {
    //   path: '/register',
    //   name: 'Register',
    //   component: Register
    // },
    {
      path: '/MB',
      name: 'MB',
      component: MB,
    },
    {
      path: '/analyze',
      name: 'Analyze',
      component: Analyze,
    },
    {
      path: '/Graph',
      name: 'Graph',
      component: Graph,
      children: [
        {
          path: 'graphindex',
          component: GraphIndex
        },
        {
          path: 'graphsearch',
          component: GraphSearch
        },
        {
          path: 'graphanalyze',
          component: GraphAnalyze
        },
        {
          path: 'graphdoc',
          component: GraphDoc
        },
        {
          path: 'graphexcel',
          component: GraphExcel
        },
        {
          path: 'graphvisio',
          component: GraphVisio
        },
        {
          path: 'graphmanage',
          name: 'GraphManage',
          component: GraphManage,
          children: [
            {
              path: 'modelManage',
              component: ModelManage
            },
            {
              path: 'synonymsManage',
              component: SynonymsManage
            },
            {
              path: 'keyManage',
              component: KeyManage
            },
            {
              path: 'routerManage',
              component: RouterManage
            }
          ]
        },
        {
          path: 'graphmap',
          component: GraphMap
        },

      ]
    },
  ]
})
