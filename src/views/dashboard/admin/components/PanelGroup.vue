<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showStartedAdList()">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">현재 진행 SIM 서비스</div>
          전일: <count-to :start-val="0" :end-val="yesterday_started_ad_influencer" :duration="2600" class="card-panel-num"/>
          오늘: <count-to :start-val="0" :end-val="today_started_ad_influencer" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showRegisteredAdList()">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">신규 SIM 서비스 신청</div>
          전일: <count-to :start-val="0" :end-val="yesterday_ad" :duration="3000" class="card-panel-num"/>
          오늘: <count-to :start-val="0" :end-val="today_ad" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="$router.push('/sponsor-table/sponsor-table')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">신규 등록 광고주</div>
          전일: <count-to :start-val="0" :end-val="yesterday_sponsor" :duration="3200" class="card-panel-num"/>
          오늘: <count-to :start-val="0" :end-val="today_sponsor" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="$router.push('/influencer-table/influencer-table')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">신규 등록 인플루언서</div>
          전일: <count-to :start-val="0" :end-val="yesterday_influencer" :duration="3600" class="card-panel-num"/>
          오늘: <count-to :start-val="0" :end-val="today_influencer" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="$router.push('/tester-table/tester-table')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">영향력 테스트 수</div>
          전일: <count-to :start-val="0" :end-val="yesterday_tester" :duration="3600" class="card-panel-num"/>
          오늘: <count-to :start-val="0" :end-val="today_tester" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="$router.push('/sponsor-images/index')">
        <div class="card-panel-description-center">
          <div class="card-panel-text">총 등록 광고주</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showStartedAdInfluencerList()">
        <div class="card-panel-description-center">
          <div class="card-panel-text">현재 Sim 진행 인플루언서</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="$router.push('/influencer-table/influencer-table');">
        <div class="card-panel-description-center">
          <div class="card-panel-text">총 등록 인플루언서</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showCompletedAdList()">
        <div class="card-panel-description-center">
          <div class="card-panel-text">누적 SIM 진행 광고주</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showComplatedAdInfluencerList()">
        <div class="card-panel-description-center">
          <div class="card-panel-text">누적 SIM 진행 인플루언서</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showComplatedAdInfluencerList()">
        <div class="card-panel-description-center">
          <div class="card-panel-text">총 누적 파라미터</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showFakeInfluencerList()">
        <div class="card-panel-description-center">
          <div class="card-panel-text">부정프로그램 사용 인플루언서</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showReviewedAdInfluencerList()">
        <div class="card-panel-description-center">
          <div class="card-panel-text">결제 예정액 및 광고주 리스트</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="registerAd()">
        <div class="card-panel-description-center">
          <div class="card-panel-text">신규 광고 입력</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="showRevenue()">
        <div class="card-panel-description-center">
          <div class="card-panel-text">년, 월, 주 매출액</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="$router.push('/tester-table/tester-table')">
        <div class="card-panel-description-center">
          <div class="card-panel-text">월, 주별 인플루언서 테스트</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="$router.push('/ad-influencer-calendar-table/ad-influencer-calendar-table')">
        <div class="card-panel-description-center">
          <div class="card-panel-text">광고 스케줄 표</div>
        </div>
      </div>
    </el-col>

  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { fetchList as fetchAdList} from '@/api/ad'
import { fetchList as fetchAdInfluencerList } from '@/api/adInfluencer'
import { fetchList as fetchInfluencerList } from '@/api/influencer'
import { fetchList as fetchSponsorList } from '@/api/sponsor'
import { fetchList as fetchTesterList } from '@/api/tester'

export default {
  data() {
    return {
      today_ad: 0,
      yesterday_ad: 0,
      today_started_ad_influencer: 0,
      yesterday_started_ad_influencer: 0,
      today_influencer: 0,
      yesterday_influencer: 0,
      today_sponsor: 0,
      yesterday_sponsor: 0,
      today_tester: 0,
      yesterday_tester: 0,
    }
  },
  components: {
    CountTo
  },
  created() {
    this.getList()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    getList() {
      fetchAdList({}).then(response => {
        this.yesterday_ad = response.data.yesterday_count;
        this.today_ad = response.data.today_count;
      });
      fetchAdInfluencerList({'count_column': 'started_at' }).then(response => {
        this.yesterday_started_ad_influencer = response.data.yesterday_count;
        this.today_started_ad_influencer = response.data.today_count;
      });
      fetchInfluencerList({}).then(response => {
        this.yesterday_influencer = response.data.yesterday_count;
        this.today_influencer = response.data.today_count;
      });
      fetchSponsorList({}).then(response => {
        this.yesterday_sponsor = response.data.yesterday_count;
        this.today_sponsor = response.data.today_count;
      });
      fetchTesterList({}).then(response => {
        this.yesterday_tester = response.data.yesterday_count;
        this.today_tester = response.data.today_count;
      });
    },
    showStartedAdList() {
      this.$store.commit('SET_AD', { 'status_text': 'started'});
      this.$router.push('/table/ad-table');
    },
    showRegisteredAdList() {
      this.$store.commit('SET_AD', { 'status_text': 'registered'});
      this.$router.push('/table/ad-table');
    },
    showStartedAdInfluencerList() {
      this.$store.commit('SET_AD_INFLUENCER', { 'status_text': 'started'});
      this.$router.push('/table/ad-influencer-table');
    },
    showCompletedAdList() {
      this.$store.commit('SET_AD', { 'status_text': 'completed'});
      this.$router.push('/table/ad-influencer-table');
    },
    showComplatedAdInfluencerList() {
      this.$store.commit('SET_AD_INFLUENCER', { 'status_text': 'completed'});
      this.$router.push('/table/ad-influencer-table');
    },
    showFakeInfluencerList() {
      this.$store.commit('SET_INFLUENCER', { 'is_fake_instagram': 1});
      this.$router.push('/table/influencer-table');
    },
    showReviewedAdInfluencerList() {
      this.$store.commit('SET_AD_INFLUENCER', { 'status_text': 'reviewed'});
      this.$router.push('/table/ad-influencer-table');
    },
    registerAd() {
      this.$store.commit('SET_AD_REGISTER', true);
      this.$router.push('/table/ad-table');
    },
    showRevenue() {
      this.$router.push('/ad-influencer-table/ad-influencer-table');
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
    .card-panel-description-center {
      text-align: center;
      font-weight: bold;
      margin: 40px 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
