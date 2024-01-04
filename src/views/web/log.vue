<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>操作：</span>
          <el-input
          style="width: 220px;"
            placeholder="请输入操作模块或操作描述"
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
            <el-table-column prop="ipAddress" label="操作IP"> </el-table-column>
            <el-table-column prop="ipSource" label="操作地址"></el-table-column>
            <el-table-column prop="nickname" label="用户昵称"></el-table-column>
            <el-table-column prop="optModule" label="操作模块"></el-table-column>
            <el-table-column prop="optUrl" label="操作url"></el-table-column>
            <el-table-column prop="optType" label="操作类型"></el-table-column>
            <el-table-column prop="optDesc" label="操作描述"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
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
     <!-- 查看 -->
        <el-dialog title="查看" :visible.sync="usercheck">
          <el-descriptions :border="true" :column="1">
            <el-descriptions-item label="操作方法">
              {{ rowdata.optMethod }}
            </el-descriptions-item>
            <el-descriptions-item label="请求方式">
              {{ rowdata.requestMethod }}
            </el-descriptions-item>
            <el-descriptions-item label="请求参数">
              {{ rowdata.requestParam }}
            </el-descriptions-item>
            <el-descriptions-item label="响应数据">
              {{ rowdata.responseData }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ rowdata.createTime }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
  </div>
</template>

<script>
import { getLogstList } from "@/api/web/log";
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
    // 查看用户信息
    userCheck(item) {
      this.rowdata = item;
      this.usercheck = true;
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
      };
      // 获取题目列表
      getLogstList(dataobj).then((res) => {
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