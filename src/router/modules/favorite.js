/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

import store from '@/store'

const favoriteRouter = {
  path: '/favorite',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Favorite',
  meta: {
    title: 'Favorite',
    icon: 'table'
  },
  children: [
    {
      path: 'top100-fassion-like',
      component: () => import('@/views/table/influencerTable'),
      name: 'top100_fassion_like',
      meta: { title: '패션 좋아요수 탑 100' },
      beforeEnter(to, from, next) {
        store.commit('SET_INFLUENCER', {
          'category': '패션',
          'sort': '-total_like_count',
          'limit': 100
        } );
        next();
      }
    },
    {
      path: 'top100-fassion-comment',
      component: () => import('@/views/table/influencerTable'),
      name: 'top100_fassion_comment',
      meta: { title: '패션 댓글수 탑 100' },
      beforeEnter(to, from, next) {
        store.commit('SET_INFLUENCER', {
          'category': '패션',
          'sort': '-total_comment_count',
          'limit': 100
        } );
        next();
      }
    }
  ]
}
export default favoriteRouter
