/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      component: () => import('@/views/table/dynamicTable/index'),
      name: 'DynamicTable',
      meta: { title: 'dynamicTable' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/table/dragTable'),
      name: 'DragTable',
      meta: { title: 'dragTable' }
    },
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inlineEditTable'),
      name: 'InlineEditTable',
      meta: { title: 'inlineEditTable' }
    },
    {
      path: 'tree-table',
      component: () => import('@/views/table/treeTable/treeTable'),
      name: 'TreeTableDemo',
      meta: { title: 'treeTable' }
    },
    {
      path: 'custom-tree-table',
      component: () => import('@/views/table/treeTable/customTreeTable'),
      name: 'CustomTreeTableDemo',
      meta: { title: 'customTreeTable' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complexTable'),
      name: 'ComplexTable',
      meta: { title: 'complexTable' }
    },
    {
      path: 'ad-table',
      component: () => import('@/views/table/adTable'),
      name: 'adTable',
      meta: { title: 'adTable' }
    },
    {
      path: 'ad-influencer-table',
      component: () => import('@/views/table/adInfluencerTable'),
      name: 'adInfluencerTable',
      meta: { title: 'adInfluencerTable' }
    },
    {
      path: 'influencer-table',
      component: () => import('@/views/table/influencerTable'),
      name: 'influencerTable',
      meta: { title: 'influencerTable' }
    },
    {
      path: 'sponsor-table',
      component: () => import('@/views/table/sponsorTable'),
      name: 'sponsorTable',
      meta: { title: 'sponsorTable' }
    },
    {
      path: 'tester-table',
      component: () => import('@/views/table/testerTable'),
      name: 'testerTable',
      meta: { title: 'testerTable' }
    }
  ]
}
export default tableRouter
