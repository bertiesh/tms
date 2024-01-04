<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>分类名：</span>
          <el-input
            placeholder="请输入标签名"
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
          <el-button type="primary" icon="iconfont icon-sousuo" @click="searchbtn"
            >搜索</el-button
          >
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
        </div>
      </el-header>
      <el-main>
        <template>
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            icon="iconfont icon-icon_tianjia"
            @click.native.prevent="addUser()"
            >添加</el-button
          >
          <!-- 表格 -->
          <el-table
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
          >
            <el-table-column type="index" label="序号" width="70">
            </el-table-column>
            <el-table-column prop="categoryName" label="分类名">
            </el-table-column>
            <el-table-column prop="id" label="分类ID">
            </el-table-column>
            <el-table-column prop="articleCount" label="引用数量"></el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userUpdate(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="deleteRow(scope.row)"
                  >删除</el-button
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
            <el-form-item label="标签名" prop="categoryName">
              <el-input v-model="rowdata.categoryName"></el-input>
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
import { getArticleClass,addArticleClass,deleteArticleClass} from "@/api/article/articleclass";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      userform: false,
      isadd: true,
      search:{},
      rowdata: {},
      tableData: [],
      total: 0,
      pagesize: 10,
      current: 1,
      formrules: {
        categoryName: [
          { required: true, message: "请输入标签名", trigger: "blur" },
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
     clearformValidate(){
this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
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
    // 编辑表单确定按钮
    send(data) {
      this.$refs.userform.validate((valid) => {
        if (valid) {
            addArticleClass(data).then(
              (res) => {
                this.onLoad();
                alertMessage(this,"success", "操作成功!");
              }
            ).catch((err) => {
              alertMessage(this, "error", err);
            });;
          this.userform = false;
        }
      });
    },
    // 添加
    addUser() {
      this.rowdata = {};
      this.userform = true;
      this.clearformValidate()
      this.isadd = true;
    },
    // 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
      this.userform = true;
      this.clearformValidate()
      this.isadd = false;
    },
    // 删除用户信息
    deleteRow(row) {
      this.$confirm("确定要删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
            deleteArticleClass([row.id]).then(
              (res) => {
                alertMessage(this, "success", "删除标签成功!");
                this.onLoad();
              }
            ).catch((err) => {
               alertMessage(this, "error", err);
            });
        })
        .catch(() => {});
    },
    // 查询用户
    searchbtn() {
      if (this.search) {
        this.onLoad()
      } 
      else {
        alertMessage(this, "error", "请重新输入");
      }
    },
    // 刷新
    reset() {
      this.search= {};
      this.onLoad();
    },
    // 进入加载
    onLoad() {
      const dataobj = {
        size: this.pagesize,
        current: this.current,
        keywords: this.search.keywords,
      };
      getArticleClass(dataobj).then((res) => {
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