/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: '현재 테이블',
    icon: 'table'
  },
  children: [
    {
      path: 'ad-table',
      component: () => import('@/views/table/adTable'),
      name: 'currentAdTable',
      meta: { title: '광고' }
    },
    {
      path: 'ad-influencer-table',
      component: () => import('@/views/table/adInfluencerTable'),
      name: 'currentAdInfluencerTable',
      meta: { title: '광고-인플루언서' }
    },
    {
      path: 'influencer-table',
      component: () => import('@/views/table/influencerTable'),
      name: 'currentInfluencerTable',
      meta: { title: '인플루언서' }
    },
    {
      path: 'sponsor-table',
      component: () => import('@/views/table/sponsorTable'),
      name: 'currentSponsorTable',
      meta: { title: '스폰서' }
    },
    {
      path: 'tester-table',
      component: () => import('@/views/table/testerTable'),
      name: 'currentTesterTable',
      meta: { title: '테스터' }
    }
  ]
}
export default tableRouter
