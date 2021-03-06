import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import tableRouter from './modules/table'
import favoriteRouter from './modules/favorite'
import store from '@/store'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  /** When your routing table is too long, you can split it into small modules**/
  {
    path: '/sponsor-images',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/sponsor-images/index'),
        name: 'Sponsor-images',
        meta: { title: '총 등록 광고주', icon: 'component', noCache: true }
      }
    ]
  },

  {
  path: '/ad-table',
  component: Layout,
  redirect: '/table/ad-table',
  name: 'AdTable',
  meta: {
    title: 'AdTable',
    icon: 'table'
  },
  children: [
    {
      path: 'ad-table',
      component: () => import('@/views/table/adTable'),
      name: 'adTable',
      meta: { title: '광고' },
      beforeEnter(to, from, next) {
        store.commit('SET_AD', { } );
        next();
      }
    }
  ]
},
  {
  path: '/ad-influencer-table',
  component: Layout,
  redirect: '/table/ad-influencer-table',
  name: 'AdInfluencerTable',
  meta: {
    title: 'AdInfluencerTable',
    icon: 'table'
  },
  children: [
    {
      path: 'ad-influencer-table',
      component: () => import('@/views/table/adInfluencerTable'),
      name: 'adInfluencerTable',
      meta: { title: '광고-인플루언서' },
      beforeEnter(to, from, next) {
        store.commit('SET_AD_INFLUENCER', { } );
        next();
      }
    }
  ]
},{
  path: '/ad-influencer-calendar-table',
  component: Layout,
  redirect: '/table/ad-influencer-calendar-table',
  name: 'AdInfluencerCalendarTable',
  meta: {
    title: 'AdInfluencerCalendarTable',
    icon: 'table'
  },
  children: [
    {
      path: 'ad-influencer-calendar-table',
      component: () => import('@/views/table/adInfluencerCalendarTable'),
      name: 'adInfluencerCalendarTable',
      meta: { title: '광고 스케쥴표' },
      beforeEnter(to, from, next) {
        store.commit('SET_AD_INFLUENCER', { } );
        next();
      }
    }
  ]
},
  {
  path: '/influencer-table',
  component: Layout,
  redirect: '/table/influencer-table',
  name: 'InfluencerTable',
  meta: {
    title: 'InfluencerTable',
    icon: 'table'
  },
  children: [
    {
      path: 'influencer-table',
      component: () => import('@/views/table/influencerTable'),
      name: 'influencerTable',
      meta: { title: '인플루언서' },
      beforeEnter(to, from, next) {
        store.commit('SET_INFLUENCER', { } );
        next();
      }
    }
  ]
},
  {
  path: '/sponsor-table',
  component: Layout,
  redirect: '/table/sponsor-table',
  name: 'SponsorTable',
  meta: {
    title: 'SponsorTable',
    icon: 'table'
  },
  children: [
    {
      path: 'sponsor-table',
      component: () => import('@/views/table/sponsorTable'),
      name: 'sponsorTable',
      meta: { title: '스폰서' },
      beforeEnter(to, from, next) {
        store.commit('SET_SPONSOR', { } );
        next();
      }
    }
  ]
},
  {
  path: '/tester-table',
  component: Layout,
  redirect: '/table/tester-table',
  name: 'TesterTable',
  meta: {
    title: 'TesterTable',
    icon: 'table'
  },
  children: [
    {
      path: 'tester-table',
      component: () => import('@/views/table/testerTable'),
      name: 'testerTable',
      meta: { title: '영향력 테스터' },
      beforeEnter(to, from, next) {
        store.commit('SET_TESTER', { } );
        next();
      }
    }
  ]
},
  tableRouter,
  favoriteRouter,

  { path: '*', redirect: '/404', hidden: true }
]
