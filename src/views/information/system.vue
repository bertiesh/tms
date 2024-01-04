<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>通知内容：</span>
          <el-input
            placeholder="请输入通知内容"
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
          <el-button type="primary" @click="alldelete">{{
            isDelete ? "所有通知" : "垃圾桶"
          }}</el-button>
        </div>
      </el-header>
      <el-main>
        <template>
          <div class="main-btn">
            <el-button
              type="primary"
              icon="iconfont icon-icon_tianjia"
              @click.native.prevent="addUser"
              >添加</el-button
            >
            <el-button
              type="primary"
              @click.native.prevent="addmail"
              >邮箱通知</el-button
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
            <el-table-column type="selection" width="60"> </el-table-column>
            <el-table-column prop="conversationCode" label="通知类型">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column prop="messageContent" label="通知内容">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >查看内容</el-button
                ></template
              >
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userUpdate(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="check(scope.row)"
                  >{{ isDelete ? "恢复" : "删除" }}</el-button
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
        <!-- 弹出框（编辑 添加） -->
        <el-dialog :title="isadd ? '添加' : '编辑'" :visible.sync="userform">
          <el-form
            :model="rowdata"
            :rules="formrules"
            label-width="80px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item label="系统通知" prop="messageContent">
              <el-input
                type="textarea"
                :rows="6"
                v-model="rowdata.messageContent"
                placeholder="请输入系统通知"
              ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="新增邮箱通知" :visible.sync="mailform">
          <el-form
            :model="maildata"
            :rules="mailrules"
            label-width="80px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item label="邮件标题" prop="subject">
              <el-input
                v-model="maildata.subject"
                placeholder="请输入邮件标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮件内容" prop="message">
              <el-input
              type="textarea"
                :rows="6"
                v-model="maildata.message"
                placeholder="请输入邮件内容"
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
    <!--查看通知内容 -->
    <el-dialog title="查看通知" :visible.sync="dialogVisible">
      <div v-html="rowdata.messageContent" class="message"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSystemInform,
  addSystemInform,
  updateSystemInform,
} from "@/api/information/system";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      userform: false,
      mailform: false,
      isadd: true,
      dialogVisible: false,
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      maildata:{},//邮箱通知
      tableData: [], //表格数据
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      isDelete: 0, //是否删除
      formrules: {
        messageContent: [
          { required: true, message: "请输入通知内容", trigger: "blur" },
        ],
      },
      mailrules: {
        subject: [
          { required: true, message: "请输入邮件标题", trigger: "blur" },
        ],
        message: [
          { required: true, message: "请输入邮件内容", trigger: "blur" },
        ],
      },
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
    // 查看删除的文件
    alldelete() {
      (this.isDelete = this.isDelete == 0 ? 1 : 0), this.onLoad();
    },

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
    // 查看用户信息
    userCheck(item) {
      this.rowdata = item;
      this.dialogVisible = true;
    },
    // 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
      this.userform = true;
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.isadd = false;
    },
    // 邮箱通知
    addmail() {
      // this.$nextTick(() => {
      //   this.$refs["userform"].clearValidate();
      // });
      this.maildata = {}
      this.mailform = true;
      
    },
    // 添加用户信息
    addUser() {
      this.rowdata = {};
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
      this.isadd = true;
    },
    // 确定选框
    send(data) {
      this.$refs.userform.validate((valid) => {
        if (valid) {
          if (this.isadd) {
            addSystemInform(data)
              .then((res) => {
                alertMessage(this, "success", "添加操作成功!");
                this.onLoad();
              })
              .catch((err) => {
                alertMessage(this, "error", err);
              });
          } else {
            updateSystemInform(data)
              .then((res) => {
                alertMessage(this, "success", "编辑操作成功");
                this.onLoad();
              })
              .catch((err) => {
                alertMessage(this, "error", err);
              });
          }

          this.userform = false;
        }
      });
    },
    //恢复
    check(row) {
      row.isDelete = this.isDelete == 0 ? 1 : 0;
      this.$confirm("确定吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          updateSystemInform(row)
            .then((res) => {
              alertMessage(this, "success", "操作成功!");
              this.onLoad();
            })
            .catch((err) => {
              alertMessage(this, "error", err);
            });
        })
        .catch(() => {});
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
        keywords: this.search.keywords,
        isDelete: this.isDelete,
      };
      // 获取题目列表
      getSystemInform(dataobj).then((res) => {
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