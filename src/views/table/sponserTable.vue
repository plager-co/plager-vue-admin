<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 50px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.email" placeholder="Email" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.instagram" placeholder="인스타그램" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.company_category" placeholder="카테고리" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in targetCategoryList" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      등록 날짜:
      <el-input v-model="listQuery.min_created_at" placeholder="ex)180510" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      ~
      <el-input v-model="listQuery.max_created_at" placeholder="ex)181212" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="광고주" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.picture_link" style="width:100%;">
        </template>
      </el-table-column>
      <el-table-column label="이메일" width="150">
        <template slot-scope="scope">
          <span class="link-type" @click="">{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="인스타그램" width="150">
        <template slot-scope="scope">
          <span class="link-type" @click="">{{ scope.row.instagram }}</span>
        </template>
      </el-table-column>
      <el-table-column label="카테고리" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company_category }}</span>
        </template>
      </el-table-column>
      <el-table-column label="회사명" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="담당자" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.officer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="연락처" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contact }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item label="Password" prop="email">
          <el-input v-model="temp.password"/>
        </el-form-item>
        <el-form-item label="Instagram" prop="email">
          <el-input v-model="temp.instagram"/>
        </el-form-item>
        <el-form-item label="카테고리">
          <el-select v-model="temp.company_category" class="filter-item" placeholder="Please select">
            <el-option v-for="item in targetCategoryList" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="카테고리2">
          <el-select v-model="temp.company_category2" class="filter-item" placeholder="Please select">
            <el-option v-for="item in targetCategoryList" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="회사명">
          <el-input v-model="temp.company_name"/>
        </el-form-item>
        <el-form-item label="담당자 이름">
          <el-input v-model="temp.officer_name"/>
        </el-form-item>
        <el-form-item label="세금 발급용 이메일">
          <el-input v-model="temp.tax_email"/>
        </el-form-item>
        <el-form-item label="연락처">
          <el-input v-model="temp.contact"/>
        </el-form-item>
        <el-form-item label="회사 웹사이트">
          <el-input v-model="temp.company_website"/>
        </el-form-item>
        <el-form-item label="사업자 등록증">
          <el-input v-model="temp.document_link"/>
        </el-form-item>
        <el-form-item label="인스타그램">
          <el-input v-model="temp.instagram"/>
        </el-form-item>
        <el-form-item label="페이스북">
          <el-input v-model="temp.facebook"/>
        </el-form-item>
        <el-form-item label="소셜 아이디">
          <el-input v-model="temp.social"/>
        </el-form-item>
        <el-form-item label="국가">
          <el-input v-model="temp.country"/>
        </el-form-item>
        <el-form-item label="대표 이미지 URL" prop="email">
          <el-input v-model="temp.picture_link"/>
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
import { fetchList, fetchPv, createSponser, updateSponser } from '@/api/sponser'
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
  name: 'SponserTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        email: undefined,
        password: undefined,
        instagram: undefined,
        picture_link: undefined,
        name: undefined,
        country: undefined,
        created_at: undefined,
        updated_at: undefined,
        company_name: undefined,
        company_category: undefined,
        company_category2: undefined,
        officer_name: undefined,
        tax_email: undefined,
        contact: undefined,
        company_website: undefined,
        document_link: undefined,
        facebook: undefined,
        social: undefined,
        sort: '+id'
      },
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
      statusList:  [
        { label: '광고주 추천', key: 'recommended' },
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
        { label: '인스타그램 ID 오름차순', key: '+instagram' },
        { label: '인스타그램 ID 내림차순', key: '-instagram' },
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
        email: undefined,
        password: undefined,
        instagram: undefined,
        picture_link: undefined,
        created_at: undefined,
        updated_at: undefined,
        company_name: undefined,
        company_category: undefined,
        company_category2: undefined,
        officer_name: undefined,
        tax_email: undefined,
        contact: undefined,
        company_website: undefined,
        document_link: undefined,
        facebook: undefined,
        social: undefined,
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
    this.getList()
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
            statusAds = '광고주 추천';
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
      this.temp.created_at = new Date().toISOString().slice(0,10);
      this.temp.updated_at = new Date().toISOString().slice(0,10);
      this.temp.user_type = 'sponser';
      console.log("this.temp.created_at");
      console.log(this.temp.created_at);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSponser(this.temp, token).then(() => {
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
    updateData() {
      var token = this.$store.getters.token;
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          this.temp.status = this.getStatusNum(this.temp.status_text);
          updateSponser(tempData, token).then(() => {
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
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
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
        const tHeader = ['id', 'email', 'status_text', 'category', 'target_age', 'target_sex', 'created_at']
        const filterVal = ['id', 'email', 'status_text', 'category', 'target_age', 'target_sex', 'created_at']
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
