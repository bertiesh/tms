<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>物流公司：</span>
          <el-input
            placeholder="请输入物流公司"
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

          <!-- 表格 -->
          <el-table
            ref="articletable"
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="index" width="60"> </el-table-column>
            <el-table-column prop="freightBrand" label="物流公司">
            </el-table-column>
            <el-table-column prop="freightCode" label="物流单号">
            </el-table-column>
            <el-table-column prop="price" label="单价">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="220" v-if="!isDelete&&$route.query.id!=undefined">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userUpdate(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >编辑</el-button
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
        <el-dialog title="编辑" :visible.sync="userform">
          <el-form
            :model="rowdata"
            :rules="formrules"
            label-width="80px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item label="快递公司" prop="freightBrand">
              <el-input
                v-model="rowdata.freightBrand"
                placeholder="请输入快递公司"
              ></el-input>
            </el-form-item>
            <el-form-item label="快递单号" prop="freightCode">
              <el-input
                v-model="rowdata.freightCode"
                placeholder="请输入快递单号"
              ></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input-number style="width: 100%;" v-model="rowdata.price" :precision="2" :step="0.1" :min="0"></el-input-number>
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
import { updateOrderList } from "@/api/pshop/order";
import { getLogisticsList } from "@/api/pshop/logistics";
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
      isDelete: 0, //是否删除
      formrules: {
        freightBrand: [{ required: true, message: "请输入快递公司", trigger: "blur" }],
        freightCode: [
          { required: true, message: "请输入快递编号", trigger: "blur" },
        ],
         price: [
          { required: true, message: "请输入快递价格", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.onLoad();
  },
  watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) this.onLoad();
    },
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
    // 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
      this.userform = true;
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
    },
    // 确定选框
    send(data) {
      const list = {
        id:this.$route.query.id*1,
        status:2,
        freights:[data]
      }
      this.$refs.userform.validate((valid) => {
        if (valid) {
            updateOrderList(list)
              .then((res) => {
                alertMessage(this, "success", "添加操作成功!");
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
        keywords: this.search.keywords,
        isDelete: this.isDelete,
        freightId:this.$route.query.freightId,
      };
      // 获取题目列表
      getLogisticsList(dataobj).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
        if (this.$route.query.freightId) {
            this.rowdata = this.tableData[0]
            this.userform=true
        }
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