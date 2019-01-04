<template>
  <div class="icons-container">
    <p class="warn-content">
      <a href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html" target="_blank">Add and use
      </a>
    </p>

      <vue-ads-pagination
          :page="0"
          :itemsPerPage="40"
          :maxVisiblePages="6"
          :totalItems="count"
          @page-change="pageChange"
      />
    <div class="icons-wrapper">
      <div v-for="item of list" v-bind="item">
        <el-tooltip placement="top">
          <div slot="content" @click="showAd(item)">
            {{ item.instagram }}
          </div>
          <div class="icon-item">
             <img :src="item.picture_link" style="width: 60px; height: 60px;" @click="showAd(item)">
            <span>{{ item.instagram }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/sponsor'
import VueAdsPagination from 'vue-ads-pagination';
export default {
  name: 'Icons',
   components: {
        VueAdsPagination,
    },
  data() {
    return {
      count: 7,
      listQuery: {
        page: 1,
        limit: 40,
        id: undefined,
        sponsor_id: undefined,
        email: undefined,
        picture_link: undefined,
        instagram: undefined,
        status: undefined,
        status_text: undefined,
        target_category: undefined,
        target_category2: undefined,
        target_age: undefined,
        target_sex: undefined,
        importance: undefined,
        title: undefined,
        type: undefined,
        required_influencer_follower: undefined,
        period: undefined,
        budget: undefined,
        min_created_at: undefined,
        max_created_at: undefined,
        created_at: undefined,
        sort: '+instagram'
      },
      list: null,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result;
        this.count = response.data.count;

      })
    },
    showAd(row) {
      this.$store.commit('SET_AD', { 'sponsor_id': row.id});
      this.$router.push('/table/ad-table')
    },
    pageChange (page, range) {
        console.log(page, range);
        this.listQuery = {
                'page': page + 1,
                'limit': 40,
          'sort': '+instagram'
            };
        this.getList();
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 20px;
    height: 110px;
    text-align: center;
    width: 60px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 15px;
    margin-top: 10px;
  }
  .disabled{
    pointer-events: none;
  }
}
</style>
