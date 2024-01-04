<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>详细地址查询：</span>
          <el-input
          style="width: 220px;"
            placeholder="请输入用户详细地址"
            v-model="search.keywords"
            size="small"
            clearable
          >
          </el-input>
        </div>
        <div class="olog-but">
          <el-tooltip
            v-if="showFullScren"
            effect="dark"
            :content="
              isFullScren ? $t('navbar.screenfullF') : $t('navbar.screenfull')
            "
            placement="bottom"
          >
            <i
              :class="
                isFullScren
                  ? 'iconfont icon-tuichuquanping'
                  : 'iconfont icon-quanping'
              "
              @click="fullScren"
            ></i>
          </el-tooltip>
          <el-button
            type="primary"
            icon="iconfont icon-sousuo"
            @click="searchbtn(search)"
            >搜索</el-button
          >
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
        </div>
      </el-header>
      <el-main>
        <template>
          <!-- 表格 -->
          <el-table
            ref="articletable"
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
          >
            <el-table-column type="index" width="60"> </el-table-column>
            <el-table-column prop="nickname" label="用户昵称"></el-table-column>
            <el-table-column prop="receiverName" label="收货人"></el-table-column>
            <el-table-column prop="phone" label="电话号码"></el-table-column>
            <el-table-column prop="postalCode" label="邮编"></el-table-column>
            <el-table-column prop="optModule" label="省市区">
               <template slot-scope="scope">
                {{scope.row.region.provinceName}}-{{scope.row.region.cityName}}-{{scope.row.region.districtName}}
               </template>
            </el-table-column>
            <el-table-column prop="detailAddress" label="详细地址"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getUserAddress } from "@/api/pshop/address";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
       usercheck: false,
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
    };
  },
  created() {
    this.onLoad();
  },
  watch: {
    $route(to, from) {
      if (to.query.id!=from.query.id) this.onLoad()
      
    },
  },
  computed: {
    ...mapGetters(["isFullScren", "userInfo", "showFullScren"]),
    ...mapState({
      showFullScren: (state) => state.common.showCollapse,
    }),
  },
  methods: {
    // 一页几条
    handleSizeChange(val) {
      this.pagesize = val;
      this.onLoad();
    },
    // 第几页
    handleCurrentChange(val) {
      this.current = val;
      this.onLoad();
    },
    // 添
    // 查询用户
    searchbtn(value) {
      if (value) {
        this.getArticle();
      } else {
        alertMessage(this, "error", "请重新输入");
      }
    },
    // 刷新
    reset() {
      this.search = {};
      this.onLoad();
    },
    // 获取题目列表
    getArticle() {
      const dataobj = {
        size: this.pagesize,
        current: this.current,
        keywords: this.search.keywords,
        userInfoId: this.$route.query.id,
      };
      // 获取题目列表
      getUserAddress(dataobj).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
      });
    },
    // 进入加载
    onLoad() {
      this.getArticle();
    },
    // 全屏
    fullScren() {
      fullscreenToggel();
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/assets/style/index/hometable.scss";
.main-btn {
  display: flex;
  .el-button {
    margin-right: 10px;
  }
}
</style>