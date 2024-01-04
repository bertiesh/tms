<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
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
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
        </div>
      </el-header>
      <el-main>
        <template>
          <!-- 表格 -->
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" label="序号" width="70">
            </el-table-column>
            <el-table-column prop="content" label="动态内容"> </el-table-column>
             <el-table-column prop="id" label="评论ID">
            </el-table-column>
            <el-table-column prop="commentContent" label="评论内容">
            </el-table-column>
            <el-table-column prop="nickname" label="发布人"> </el-table-column>
             <el-table-column prop="replyNickname" label="被评论人"> </el-table-column>
             <el-table-column prop="createTime" label="发布时间"> </el-table-column>
            <el-table-column label="操作" width="190">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="deleteRow(scope.row)"
                  >删除</el-button
                >
                <el-button type="text" @click.native.prevent="check(scope.row)"
                  >{{ scope.row.isReview == 1 ? "禁用" : "解禁" }}</el-button
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
  </div>
</template>

<script>
import {
  getUserTalks,
  deleteUserTalk,
  getTalkById,
  reviewTalk,
} from "@/api/comment/talk";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      search: {},
      rowdata: {},
      tableData: [],
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
    // 动态添加行类名
    tableRowClassName({ row }) {
      if (row.isReview == 0) {
        return "disable";
      }
    },
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
    //删除
    deleteRow(row) {
      this.$confirm("确定要删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          deleteUserTalk([row.id]).then(
            (res) => {
              alertMessage(this, "success", "操作成功!");
              this.onLoad();
            },
            (error) => {
              alertMessage(this, "error", "操作出错!");
            }
          );
        })
        .catch(() => {});
    },
    //审核
    check(row) {
      const data = {
        idList: [row.id],
        isReview: row.isReview==0?1:0,
      };
      reviewTalk(data).then((res) => {
        alertMessage(this, "success", "操作成功!");
        row.isReview=row.isReview==0?1:0
      });
    },
    // 刷新
    reset() {
      this.search = {};
      this.onLoad();
    },
    // 进入加载
    onLoad() {
      const pagesize = this.pagesize;
      const current = this.current;
      getUserTalks(pagesize, current).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.tableData.forEach((el) => {
          el.createTime = el.createTime.split("T")[0];
        });
        this.total = data.count;
      });
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
</style>