<template>
  <div class="icons-container">
    <p class="warn-content">
      <a href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html" target="_blank">Add and use
      </a>
    </p>
    <div class="icons-wrapper">
      <div v-for="item of list" v-bind="item">
        <el-tooltip placement="top">
          <div slot="content" @click="showAd(item)">
            {{ item.instagram }}
          </div>
          <div class="icon-item">
             <img :src="item.picture_link" style="width: 100px; height: 100px;" @click="showAd(item)">
            <span>{{ item.instagram }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/sponser'

export default {
  name: 'Icons',
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 1000,
        id: undefined,
        sponser_id: undefined,
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
        sort: '+id'
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
        this.list = response.data.result
        console.log("this.list");
        console.log(this.list);

      })
    },
    showAd(row) {
      this.$store.commit('SET_AD', { 'sponser_id': row.id});
      this.$router.push('/table/ad-table')
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 20px;
    height: 110px;
    text-align: center;
    width: 110px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 24px;
    margin-top: 10px;
  }
  .disabled{
    pointer-events: none;
  }
}
</style>
