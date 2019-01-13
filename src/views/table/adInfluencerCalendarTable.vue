<template>
  <div class="app-container">
    <full-calendar :config="config" :events="events"  @event-selected="eventSelected"/>
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 50px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.ad_id" placeholder="광고 ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.influencer_id" placeholder="인플루언서 ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.hashtag" placeholder="해쉬태그" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.email" placeholder="인플루언서 Email" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.instagram" placeholder="인플루언서 인스타그램" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.status_text" placeholder="진행 상태" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in statusList" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <br>
      등록 날짜:
      <el-input v-model="listQuery.min_created_at" placeholder="ex)180510" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      ~
      <el-input v-model="listQuery.max_created_at" placeholder="ex)181212" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <br>
      광고 시작 날짜:
      <el-input v-model="listQuery.min_ad_start_at" placeholder="ex)180510" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      ~
      <el-input v-model="listQuery.max_ad_start_at" placeholder="ex)181212" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <br>
      광고 종료 날짜:
      <el-input v-model="listQuery.min_ad_end_at" placeholder="ex)180510" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      ~
      <el-input v-model="listQuery.max_ad_end_at" placeholder="ex)181212" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-if="user_type === 'admin'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>
    <div class="count" style="margin:20px;">
         매출액 총합 [ {{ sumPrice }} ]   ,  광고 진행자 수 [ 총 : {{ total }} , 어제: {{ yesterday_total }} , 오늘: {{ today_total }} ]
    </div>

    <el-table
      id="ad-influencer-table-data"
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="광고 ID" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span class="link-type" @click="showAd(scope.row)">{{ scope.row.ad_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="인플루언서 ID" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span class="link-type" @click="showInfluencer(scope.row)">{{ scope.row.influencer_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="해쉬태그" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.hashtag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="인플루언서" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.picture_link" style="width:100%;">
        </template>
      </el-table-column>
      <el-table-column label="인플루언서 이메일" width="150">
        <template slot-scope="scope">
          <span class="link-type" @click="showInfluencer(scope.row)">{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="인플루언서 인스타그램" width="150">
        <template slot-scope="scope">
          <span class="link-type" @click="showInfluencer(scope.row)">{{ scope.row.instagram }}</span>
        </template>
      </el-table-column>
      <el-table-column label="진행 상태" class-name="status-col" width="150">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status_text | statusFilter">{{ getStatus(scope.row.status_text) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="user_type === 'admin'" :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <br><el-button type="warning" size="mini" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
          <br v-if="scope.row.status_text === 'recommended'"><el-button v-if="scope.row.status_text === 'recommended'" type="error" size="mini" @click="reviewAd(scope.row)">플래거 추천</el-button>
          <br v-if="scope.row.status_text === 'chosen'"><el-button v-if="scope.row.status_text === 'chosen'" type="error" size="mini" @click="paidAd(scope.row)">결재 확인</el-button>
          <br v-if="scope.row.status_text === 'paid'"><el-button v-if="scope.row.status_text === 'paid'" type="error" size="mini" @click="startAd(scope.row)">광고 시작</el-button>
          <br v-if="scope.row.status_text === 'started'"><el-button v-if="scope.row.status_text === 'started'" type="error" size="mini" @click="stopAd(scope.row)">광고 중지</el-button>
          <br v-if="scope.row.status_text === 'started'"><el-button v-if="scope.row.status_text === 'started'" type="error" size="mini" @click="finishAd(scope.row)">광고 완료</el-button>

        </template>
      </el-table-column>
      <el-table-column label="광고 비용" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="계약 월" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.paid_month }}</span>
        </template>
      </el-table-column>
      <el-table-column label="총 계약 기간" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ad_month }}</span>
        </template>
      </el-table-column>
      <el-table-column label="광고 시작" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ad_start_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="광고 마감" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ad_end_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Like 수" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_like_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Post 수" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_post_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="동영상 수" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_movie_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="댓글 수" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_comment_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="재생 수" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_play_count }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog v-if="user_type === 'admin'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item label="광고 ID" prop="email">
          <el-input v-model="temp.ad_id"/>
        </el-form-item>
        <el-form-item label="인플루언서 ID" prop="email">
          <el-input v-model="temp.influencer_id"/>
        </el-form-item>
        <el-form-item label="해쉬태그" prop="email">
          <el-input v-model="temp.hashtag"/>
        </el-form-item>
        <el-form-item label="상태">
          <el-select v-model="temp.status_text" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusList" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="기간">
          <el-input v-model="temp.period"/>
        </el-form-item>
        <el-form-item label="가격">
          <el-input v-model="temp.price"/>
        </el-form-item>
        <el-form-item label="지급 개월">
          <el-input v-model="temp.paid_month"/>
        </el-form-item>
        <el-form-item label="총 광고 개월">
          <el-input v-model="temp.ad_month"/>
        </el-form-item>
        <el-form-item label="광고 시작">
          <el-input v-model="temp.ad_start_at"/>
        </el-form-item>
        <el-form-item label="광고 마감">
          <el-input v-model="temp.ad_end_at"/>
        </el-form-item>
        <el-form-item label="노출 수">
          <el-input v-model="temp.target_impression_count"/>
        </el-form-item>
        <el-form-item label="도달 수">
          <el-input v-model="temp.target_reach_count"/>
        </el-form-item>
        <el-form-item label="포스트 수">
          <el-input v-model="temp.target_post_count"/>
        </el-form-item>
        <el-form-item label="좋아요 수">
          <el-input v-model="temp.target_like_count"/>
        </el-form-item>
        <el-form-item label="댓글 수">
          <el-input v-model="temp.target_comment_count"/>
        </el-form-item>
        <el-form-item label="저장 수">
          <el-input v-model="temp.target_save_count"/>
        </el-form-item>
        <el-form-item label="동영상 수">
          <el-input v-model="temp.target_movie_count"/>
        </el-form-item>
        <el-form-item label="재생 수">
          <el-input v-model="temp.target_play_count"/>
        </el-form-item>
        <el-form-item label="인바운드 수">
          <el-input v-model="temp.target_inbound_count"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { updateAd } from '@/api/ad'
import { fetchSumPrice } from '@/api/adInfluencer'
import { fetchList, fetchPv, createAdInfluencer, updateAdInfluencer } from '@/api/adInfluencer'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'AdInfluencerTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        recommended: 'danger',
        chosen: 'success',
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      	events: [],
			config: {
        defaultView: 'month',
				eventRender: function(event, element) {
        	console.log(event)
    		}
      },
      tableKey: 0,
      user_type: null,
      list: null,
      yesterday_total: null,
      today_total: null,
      total: 0,
      sumPrice: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        ad_id: undefined,
        influencer_id: undefined,
        hashtag: undefined,
        email: undefined,
        instagram: undefined,
        picture_link: undefined,
        status: undefined,
        status_text: undefined,
        period: undefined,
        created_at: undefined,
        updated_at: undefined,
        started_at: undefined,
        paused_at: undefined,
        completed_at: undefined,
        is_recommended: undefined,
        is_selected: undefined,
        is_deposited: undefined,
        is_deposit_requested: undefined,
        is_paid: undefined,
        price: undefined,
        payment_method: undefined,
        paid_month: undefined,
        ad_month: undefined,
        ad_start_at: undefined,
        min_ad_start_at: undefined,
        max_ad_start_at: undefined,
        ad_end_at: undefined,
        min_ad_end_at: undefined,
        max_ad_end_at: undefined,
        duplicate_follower_count: undefined,
        target_impression_count: undefined,
        target_reach_count: undefined,
        target_post_count: undefined,
        target_like_count: undefined,
        target_comment_count: undefined,
        target_save_count: undefined,
        target_movie_count: undefined,
        target_play_count: undefined,
        target_inbound_count: undefined,
        sort: '-id'
      },
      statusList:  [
        { label: '광고주 선택', key: 'recommended' },
        { label: '검토 완료', key: 'reviewed' },
        { label: '플래거 추천', key: 'chosen' },
        { label: '광고 준비중', key: 'paid' },
        { label: '광고 진행중', key: 'started' },
        { label: '광고 완료', key: 'completed' },
        { label: '광고 취소', key: 'canceled' },
      ],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID 오름차순', key: '+id' },
        { label: 'ID 내림차순', key: '-id' },
        { label: '인플루언서 인스타그램 오름차순', key: '+instagram' },
        { label: '인플루언서 인스타그램 내림차순', key: '-instagram' },
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        ad_id: undefined,
        influencer_id: undefined,
        hashtag: undefined,
        email: undefined,
        instagram: undefined,
        picture_link: undefined,
        status: undefined,
        status_text: undefined,
        period: undefined,
        created_at: undefined,
        updated_at: undefined,
        started_at: undefined,
        paused_at: undefined,
        completed_at: undefined,
        is_recommended: undefined,
        is_selected: undefined,
        is_deposited: undefined,
        is_deposit_requested: undefined,
        is_paid: undefined,
        price: undefined,
        payment_method: undefined,
        paid_month: undefined,
        ad_end_at: undefined,
        ad_month: undefined,
        ad_start_at: undefined,
        duplicate_follower_count: undefined,
        target_impression_count: undefined,
        target_reach_count: undefined,
        target_post_count: undefined,
        target_like_count: undefined,
        target_comment_count: undefined,
        target_save_count: undefined,
        target_movie_count: undefined,
        target_play_count: undefined,
        target_inbound_count: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.user_type = this.$store.getters.user_type;
    this.listQuery.id = this.$store.getters.ad_influencer.id;
    this.listQuery.ad_id = this.$store.getters.ad_influencer.ad_id;
    this.listQuery.influencer_id = this.$store.getters.ad_influencer.influencer_id;
    this.listQuery.status_text = this.$store.getters.ad_influencer.status_text;
    this.getList()
    this.getAllAds()

  },
  methods: {
    getStatus(filterAds){
          var statusAds = '';
          if (filterAds === 'registered'){
          statusAds = '검토 대기중';
          } else if (filterAds === 'reviewed'){
              statusAds = '검토 완료';
          } else if (filterAds === 'paid'){
              statusAds = '광고 준비중';
          } else if (filterAds === 'started'){
              statusAds = '광고 진행중';
          } else if (filterAds === 'completed'){
            statusAds = '광고 완료';
          } else if (filterAds === 'canceled'){
            statusAds = '광고 취소';
          } else if (filterAds === 'paused'){
            statusAds = '광고 일시중지';
          } else if (filterAds === 'recommended'){
            statusAds = '광고주 선택';
          } else if (filterAds === 'chosen'){
            statusAds = '플래거 추천';
          }
          return statusAds;
      },
    getStatusNum(filterAds){
          var statusAds = '';
          if (filterAds === 'recommended'){
          statusAds = '0';
          } else if (filterAds === 'chosen'){
              statusAds = '1';
          } else if (filterAds === 'paid'){
              statusAds = '2';
          } else if (filterAds === 'started'){
              statusAds = '3';
          } else if (filterAds === 'completed'){
            statusAds = '4';
          } else if (filterAds === 'paused'){
            statusAds = '-1';
          } else if (filterAds === 'canceled'){
            statusAds = '-2';
          }
          return statusAds;
      },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getAllAds() {
      var allAds = null;
      var events = []
      var today = new Date();
      for (var i = 0; i <= 180; i++) {
          var nextDate = new Date();
          nextDate.setDate(today.getDate()+ i);
          events.push({
            title: 0,
            start: nextDate.toISOString().split('T')[0],
            end: nextDate.toISOString().split('T')[0],
            dateObject: nextDate,
          })
      }

      fetchList({status: 3}).then(response => {
        allAds = response.data.result;

        allAds.forEach(function(val){
          var ad_start_at_split = val.ad_start_at.split(' ')[0].split('-');
          var ad_start_at = new Date(ad_start_at_split[0],ad_start_at_split[1] - 1,ad_start_at_split[2]);
          var ad_end_at_split = val.ad_end_at.split(' ')[0].split('-');
          var ad_end_at = new Date(ad_end_at_split[0],ad_end_at_split[1] - 1,ad_end_at_split[2]);
          events.forEach(function(event){

            if(event.dateObject > ad_start_at && event.dateObject < ad_end_at){
              event.title = event.title + 1;
            }

          });
        });

        this.events = events;
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result
        this.total = response.data.count;
        this.yesterday_total = response.data.yesterday_count;
        this.today_total = response.data.today_count;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      fetchSumPrice(this.listQuery).then(response => {
        this.sumPrice = this.numberWithCommas(response.data.result);
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      var token = this.$store.getters.token;
      this.temp.status = this.getStatusNum(this.temp.status_text);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createAdInfluencer(this.temp, token).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '성공',
              message: '등록 완료',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    showAd(row) {
      this.$store.commit('SET_AD', { 'id': row.ad_id } );
      this.$router.push('/table/ad-table')
    },
    showInfluencer(row) {
      this.$store.commit('SET_INFLUENCER', { 'id': row.influencer_id} );
      this.$router.push('/table/influencer-table')
    },
    reviewAd(row) {
      var token = this.$store.getters.token;
      row.status = 1;
      row.status_text = 'chosen';

      const adInfluencerData = {
        'id': row.id,
        'status': 1,
        'status_text': 'chosen',
        'reviewed_at': new Date().toISOString().slice(0,10)
      };

      updateAdInfluencer(adInfluencerData, token).then(() => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: '성공',
            message: '업데이트 완료',
            type: 'success',
            duration: 2000
          })
      })
    },
    paidAd(row) {
      var token = this.$store.getters.token;
      row.status = 2;
      row.status_text = 'paid';

      const adInfluencerData = {
        'id': row.id,
        'status': 2,
        'status_text': 'paid',
        'paid_at': new Date().toISOString().slice(0,10)
      };

      updateAdInfluencer(adInfluencerData, token).then(() => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: '성공',
            message: '업데이트 완료',
            type: 'success',
            duration: 2000
          })
      })
    },
    startAd(row) {
      var token = this.$store.getters.token;
      row.status = 3;
      row.status_text = 'started';

      const adInfluencerData = {
        'id': row.id,
        'status': 3,
        'status_text': 'started',
        'started_at': new Date().toISOString().slice(0,10)
      };
      const adData = {
        'id': row.ad_id,
        'status': 3,
        'status_text': 'started',
        'started_at': new Date().toISOString().slice(0,10)
      };

      updateAdInfluencer(adInfluencerData, token).then(() => {
        updateAd(adData, token).then(() => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: '성공',
            message: '업데이트 완료',
            type: 'success',
            duration: 2000
          })
        })
      })
    },

    stopAd(row) {
      var token = this.$store.getters.token;
      row.status = -1;
      row.status_text = 'paused';

      const adInfluencerData = {
        'id': row.id,
        'status': -1,
        'status_text': 'paused',
        'paused_at': new Date().toISOString().slice(0,10)
      };

      updateAdInfluencer(adInfluencerData, token).then(() => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: '성공',
            message: '업데이트 완료',
            type: 'success',
            duration: 2000
        })
      })
    },

     finishAd(row) {
      var token = this.$store.getters.token;
      row.status = 4;
      row.status_text = 'completed';

      const adInfluencerData = {
        'id': row.id,
        'status': 4,
        'status_text': 'completed',
        'completed_at': new Date().toISOString().slice(0,10)
      };

      updateAdInfluencer(adInfluencerData, token).then(() => {
          for (const v of this.list) {
            if (v.id === this.temp.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, this.temp)
              break
            }
          }
          this.dialogFormVisible = false
          this.$notify({
            title: '성공',
            message: '업데이트 완료',
            type: 'success',
            duration: 2000
          })
      })
    },



    updateData() {
      var token = this.$store.getters.token;
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          this.temp.status = this.getStatusNum(this.temp.status_text);
          updateAdInfluencer(tempData, token).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '성공',
              message: '업데이트 완료',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
    if (confirm("삭제 하시겠습니까?")){
        var token = this.$store.getters.token;
        const tempData = Object.assign({}, row);
        deleteAdInfluencer(tempData, token).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '성공',
                message: '삭제 완료',
                type: 'success',
                duration: 2000
              })
            })

        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'ad_id', 'influencer_id', 'hashtag', 'email', 'instagram', 'status_text', 'period', 'created_at', 'updated_at', 'started_at', 'paused_at', 'completed_at', 'price', 'payment_method', 'paid_month', 'ad_start_at', 'ad_end_at', 'ad_month', 'duplicate_follower_count', 'target_impression_count', 'target_reach_count', 'target_post_count', 'target_like_count', 'target_comment_count', 'target_save_count', 'target_movie_count', 'target_play_count', 'target_inbound_count']
        const filterVal = ['id', 'ad_id', 'influencer_id', 'hashtag', 'email', 'instagram', 'status_text', 'period', 'created_at', 'updated_at', 'started_at', 'paused_at', 'completed_at', 'price', 'payment_method', 'paid_month', 'ad_start_at', 'ad_end_at', 'ad_month', 'duplicate_follower_count', 'target_impression_count', 'target_reach_count', 'target_post_count', 'target_like_count', 'target_comment_count', 'target_save_count', 'target_movie_count', 'target_play_count', 'target_inbound_count']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    eventSelected(event, jsEvent, view){
      console.log(event.start);
      var start = event.start._i.split('-');
        console.log(start[0].substring(2,4));
      this.listQuery.max_ad_start_at = start[0].substring(2,4) + start[1] + start[2];
      this.listQuery.min_ad_end_at = start[0].substring(2,4) + start[1] + start[2];
      this.listQuery.status = 3;
      this.getList();
      window.location.href="#ad-influencer-table-data";
    }
  }
}
</script>
<style>
  .fc-event {
    border: 0px;
  }
  .fc-event,
  .fc-event :hover{

      text-align: center;
    font-size: 30px;
    color: green;
    background-color: transparent;
  }
</style>

