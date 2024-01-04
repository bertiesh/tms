<template>
  <div class="index">
    <el-container>
      <el-main>
        <template>
          <div class="main-btn">
            <el-button
              type="primary"
              icon="iconfont icon-icon_tianjia"
              @click.native.prevent="addUser()"
              >积分补偿</el-button
            >
          </div>

          <!-- 表格 -->
          <el-table
            ref="articletable"
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" width="60"> </el-table-column>
            <el-table-column prop="userId" label="用户ID">
            </el-table-column>
            <el-table-column prop="event" label="产生事件"> </el-table-column
            ><el-table-column prop="points" label="积分"> </el-table-column
            ><el-table-column prop="totalPoints" label="总积分"> </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
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
        <!-- 弹出框（编辑 添加） -->
        <el-dialog title="积分补偿" :visible.sync="userform">
          <el-form
            :model="rowdata"
            :rules="formrules"
            label-width="80px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item label="用户ID" prop="userId">
              <el-input
               disabled
                v-model="rowdata.userId"
                placeholder="请输入用户ID"
              ></el-input>
            </el-form-item>
              <el-form-item label="补偿原因" prop="event">
              <el-input
                v-model="rowdata.event"
                placeholder="请输入补偿原因"
              ></el-input>
            </el-form-item>
              <el-form-item label="补偿积分" prop="points">
              <el-input
                v-model="rowdata.points"
                placeholder="请输入补偿积分"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getUserIntegral,addUserIntegral } from "@/api/pshop/integral";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      userform: false,
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      formrules: {
        userId: [
          { required: true, message: "请输入用户ID", trigger: "blur" },
        ],
        event: [
          { required: true, message: "请输入补偿原因", trigger: "blur" },
        ],
        points: [
          { required: true, message: "请输入补偿积分", trigger: "blur" },
        ],
      },
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
    // 动态添加行类名
    tableRowClassName({ row }) {
      if (row.isDelete == 1) {
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
    // 添加用户信息
    addUser() {
      this.rowdata = {};
      this.rowdata.userId = this.$route.query.id
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
    },
    // 确定选框
    send(data) {
      this.$refs.userform.validate((valid) => {
        if (valid) {
            addUserIntegral(data)
              .then((res) => {
                alertMessage(this, "success", "编辑操作成功");
                this.onLoad();
              })
              .catch((err) => {
                alertMessage(this, "error", err);
              });
          this.userform = false;
        }
      });
    },
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
        userInfoId: this.$route.query.id,
      };
      // 获取题目列表
      getUserIntegral(dataobj).then((res) => {
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
.el-dialog {
  .el-form {
    display: flex;
    flex-direction: column;
    :deep(.el-form-item__content) {
      width: 80%;
    }
  }
}
</style>