<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.id')" v-model="listQuery.id" style="width: 50px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status_text" placeholder="진행 상태" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in statusList" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.target_category" placeholder="카테고리" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in targetCategoryList" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.target_sex" placeholder="성별" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in targetSexList" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>

      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-input v-model="listQuery.sponsor_id" placeholder="광고주 ID" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.email" placeholder="광고주 이메일" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>

      등록 날짜:
      <el-input v-model="listQuery.min_created_at" placeholder="ex)180510" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      ~
      <el-input v-model="listQuery.max_created_at" placeholder="ex)181212" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-if="user_type === 'admin'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>
    <div class="count" style="margin:20px;">
          총: {{ total }} , 어제: {{ yesterday_total }} , 오늘: {{ today_total }}
    </div>

    <el-table
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
      <el-table-column label="광고주 ID" width="100">
        <template slot-scope="scope">
          <span class="link-type" @click="showSponsor(scope.row)">{{ scope.row.sponsor_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="광고주" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.picture_link" style="width:100%;">
        </template>
      </el-table-column>
      <el-table-column label="광고주 이메일" width="150">
        <template slot-scope="scope">
          <span class="link-type" @click="showSponsor(scope.row)">{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="user_type === 'admin'" :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <br><el-button type="warning" size="mini" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>
          <br><el-button type="primary" size="normal" @click="showAdInfluencer(scope.row)">관련 인플루언서</el-button>
          <br><el-button type="warning" size="normal" @click="showRecommendAdInfluencer(scope.row)">추천 인플루언서</el-button>

        </template>
      </el-table-column>
      <el-table-column label="카테고리" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="나이" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="성별" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.target_sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="등록 날짜" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog v-if="user_type === 'admin'" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item label="광고주 ID" prop="sponsor_id">
          <el-input v-model="temp.sponsor_id"/>
        </el-form-item>
        <el-form-item label="카테고리">
          <el-select v-model="temp.target_category" class="filter-item" placeholder="Please select">
            <el-option v-for="item in targetCategoryList" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="카테고리2">
          <el-select v-model="temp.target_category2" class="filter-item" placeholder="Please select">
            <el-option v-for="item in targetCategoryList" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="나이대" placeholder="10세 ~ 60세 이상" >
          <el-input v-model="temp.target_age"/>
        </el-form-item>
        <el-form-item label="성별">
          <el-select v-model="temp.target_sex" class="filter-item" placeholder="Please select">
            <el-option v-for="item in targetSexList" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="필요팔로워수">
          <el-input v-model="temp.required_influencer_follower"/>
        </el-form-item>
        <el-form-item label="기간">
          <el-input v-model="temp.period"/>
        </el-form-item>
        <el-form-item label="예산">
          <el-input v-model="temp.budget"/>
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
import { fetchList, fetchPv, createAd, updateAd, deleteAd } from '@/api/ad'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import moment from 'moment'
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
  name: 'AdTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        paused: 'danger',
        canceled: 'danger',
        completed: 'success',
        started: 'success',
        paid: 'info',
        reviewed: 'info',
        registered: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      yesterday_total: null,
      today_total: null,
      total: 0,
      user_type: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        sponsor_id: undefined,
        email: undefined,
        picture_link: undefined,
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
        sort: '-id'
      },
      statusList:  [
        { label: '검토 대기중', key: 'registered' },
        { label: '검토 완료', key: 'reviewed' },
        { label: '광고 준비중', key: 'paid' },
        { label: '광고 진행중', key: 'started' },
        { label: '광고 완료', key: 'completed' },
        { label: '광고 취소', key: 'canceled' },
      ],
      targetCategoryList:[
        { label: '뷰티', key: '뷰티' },
        { label: '패션', key: '패션' },
        { label: '유아용품', key: '유아용품' },
        { label: '식음료', key: '식음료' },
        { label: '스포츠', key: '스포츠' },
        { label: '전자기기', key: '전자기기' },
        { label: '자동차', key: '자동차' },
        { label: '홈인테리어', key: '홈인테리어' },
        { label: '기타', key: '기타' },
      ],
      targetSexList:[
        { label: '남성', key: '남성' },
        { label: '여성', key: '여성' },
        { label: '모두', key: '모두' },
      ],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [
        { label: 'ID 오름차순', key: '+id' },
        { label: 'ID 내림차순', key: '-id' },
        { label: '광고주 이메일 오름차순', key: '+email' },
        { label: '광고주 이메일 내림차순', key: '-email' },
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
        sponsor_id: undefined,
        email: undefined,
        picture_link: undefined,
        status: undefined,
        status_text: undefined,
        target_category: undefined,
        target_category2: undefined,
        target_age: undefined,
        target_sex: undefined,
        required_influencer_follower: undefined,
        period: undefined,
        budget: undefined,
        created_at: undefined,
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
    this.listQuery.id = this.$store.getters.ad.id;
    this.listQuery.sponsor_id = this.$store.getters.ad.sponsor_id;
    this.listQuery.status_text = this.$store.getters.ad.status_text;
    this.getList()

  },
  // destroyed(){
  //   console.log('destoryed')
  // },
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
          }
          return statusAds;
      },
    getStatusNum(filterAds){
          var statusAds = '';
          if (filterAds === 'registered'){
          statusAds = '0';
          } else if (filterAds === 'reviewed'){
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
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log("response");
        console.log(response);
        this.list = response.data.result
        console.log("this.list");
        console.log(this.list);
        this.total = response.data.count;
        this.yesterday_total = response.data.yesterday_count;
        this.today_total = response.data.today_count;

        if (this.$store.getters.ad_register) {
          this.$store.commit('SET_AD_REGISTER', false);
          this.handleCreate()
        }
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
          createAd(this.temp, token).then(() => {
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
    showAdInfluencer(row) {
      this.$store.commit('SET_AD_INFLUENCER', { 'ad_id': row.id });
      this.$router.push('/table/ad-influencer-table')
    },
    showRecommendAdInfluencer(row) {
      this.$store.commit('SET_AD_INFLUENCER', { 'ad_id': row.id, 'status': 0 });
      this.$router.push('/table/ad-influencer-table')
    },
    showSponsor(row) {
      this.$store.commit('SET_SPONSOR', { 'id': row.sponsor_id });
      this.$router.push('/table/sponsor-table')
    },
    updateData() {
      var token = this.$store.getters.token;
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          this.temp.status = this.getStatusNum(this.temp.status_text);
          updateAd(tempData, token).then(() => {
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
      reviewAd(row) {
      var token = this.$store.getters.token;
      row.status = 1;
      row.status_text = 'reviewed';

      const adData = {
        'id': row.id,
        'status': 1,
        'status_text': 'reviewed',
        'reviewed_at': new Date().toISOString().slice(0,10)
      };

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
    },
      paidAd(row) {
      var token = this.$store.getters.token;
      row.status = 2;
      row.status_text = 'paid';

      const adData = {
        'id': row.id,
        'status': 2,
        'status_text': 'paid',
        'paid_at': new Date().toISOString().slice(0,10)
      };

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
    },
      startAd(row) {
      var token = this.$store.getters.token;
      row.status = 3;
      row.status_text = 'started';

      const adData = {
        'id': row.id,
        'status': 3,
        'status_text': 'started',
        'started_at': new Date().toISOString().slice(0,10)
      };

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
    },
    stopAd(row) {
      var token = this.$store.getters.token;
      row.status = -1;
      row.status_text = 'paused';

      const adData = {
        'id': row.id,
        'status': -1,
        'status_text': 'paused',
        'paused_at': new Date().toISOString().slice(0,10)
      };

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
    },

     finishAd(row) {
      var token = this.$store.getters.token;
      row.status = 4;
      row.status_text = 'completed';

      const adData = {
        'id': row.id,
        'status': 4,
        'status_text': 'completed',
        'completed_at': new Date().toISOString().slice(0,10)
      };

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
    },

    handleDelete(row) {
    if (confirm("삭제 하시겠습니까?")){
        var token = this.$store.getters.token;
        const tempData = Object.assign({}, row);
        deleteAd(tempData, token).then(() => {
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
        const tHeader = ['id', 'sponsor_id', 'email', 'status_text', 'target_category', 'target_age', 'target_sex', 'required_influencer_follower', 'period', 'budget', 'created_at']
        const filterVal = ['id', 'sponsor_id', 'email', 'status_text', 'target_category', 'target_age', 'target_sex', 'required_influencer_follower', 'period', 'budget', 'created_at']
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
    }
  }
}
</script>
