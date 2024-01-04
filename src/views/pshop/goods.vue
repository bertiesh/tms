<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>商品名称：</span>
          <el-input
            placeholder="请输入商品名称"
            v-model="search.keywords"
            size="small"
            clearable
          >
          </el-input>
          <span>商品状态：</span>
          <el-select v-model="search.ison" placeholder="请选择商品状态" size="small">
            <el-option label="上架" :value="1"> </el-option>
            <el-option label="未上架" :value="0"> </el-option>
          </el-select>
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
            isDelete ? "所有商品" : "垃圾桶"
          }}</el-button>
        </div>
      </el-header>
      <el-main>
        <template>
          <div class="main-btn">
            <el-button
              type="primary"
              icon="iconfont icon-icon_tianjia"
              @click.native.prevent="addUser()"
              >添加</el-button
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
            <el-table-column prop="name" label="商品名称"> </el-table-column>
            <el-table-column label="商品图片">
              <template slot-scope="props">
                <el-image
                  v-for="item in props.row.pictureList"
                  :key="item"
                  style="cursor: pointer; height: 80px; margin-left: 10px"
                  lazy
                  :src="`/api/photos/display?photoPath=${item}`"
                  fit="cover"
                  @click="magnify(item)"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="viewsCount" label="浏览量">
            </el-table-column>
            <el-table-column prop="salesCount" label="销售量">
            </el-table-column>
            <el-table-column label="是否上架">
              <template slot-scope="props">
                {{ props.row.isOn ? "上架" : "未上架" }}
              </template>
            </el-table-column>
            <el-table-column label="商品规格" width="220">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="checksize(scope.row.id)"
                  :disabled="scope.row.isDelete"
                  >查看商品规格</el-button
                ></template
              >
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="userUpdate(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="check(scope.row)"
                  >{{ scope.row.isDelete ? "恢复" : "删除" }}</el-button
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
            <el-form-item label="商品名称" prop="name">
              <el-input
                v-model="rowdata.name"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品图片">
              <el-upload
                class="upload-demo"
                action="#"
                multiple
                :file-list="fileList"
                :auto-upload="false"
                :on-change="handlePreview"
              >
                <el-button>选择图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="商品备注" prop="description">
              <el-input
                type="textarea"
                :rows="4"
                v-model="rowdata.description"
                placeholder="请输入商品备注"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否上架">
              <el-radio-group v-model="rowdata.isOn" style="width: 200px">
                <el-radio :label="true">上架</el-radio>
                <el-radio :label="false">不上架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否顶置">
              <el-input-number
                :min="0"
                :max="9"
                size="small"
                v-model="rowdata.isTop"
              ></el-input-number>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
    <!-- 查看图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <el-image
        v-if="imgrul"
        :src="`/api/photos/display?photoPath=${imgrul}`"
        fit="cover"
      ></el-image>
      <el-descriptions :border="true" :column="1" v-else>
        <el-descriptions-item label="商品名称">
          {{ rowdata.name }}
        </el-descriptions-item>
        <el-descriptions-item label="商品备注">
          {{ rowdata.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getAllGoodsList, addGoodsImg, addGoods } from "@/api/pshop/goods";
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
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      fileList: [], //图片地址
      dialogVisible: false, //大图片弹窗
      imgrul: "", //图片地址（放大后）
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      isDelete: 0, //是否删除
      formrules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入商品备注", trigger: "blur" },
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
    // 放大图片
    magnify(url) {
      this.imgrul = url;
      this.dialogVisible = true;
    },
    // 查看商品规格
    checksize(id) {
      this.$router.push({
        path: "/pshop/goodsize",
        query: { id },
      });
    },
    // 查看用户信息
    userCheck(item) {
      this.rowdata = item;
      this.imgrul = "";
      this.dialogVisible = true;
    },
    // 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
      item.pictureList.forEach((el, index) => {
        this.fileList[index] = { name: el };
      });
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
      this.isadd = false;
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
    // 上传文档封面之前
    handlePreview(file, fileList) {
      this.fileList = fileList;
    },
    // 上传商品
    update(data) {
      addGoods(data)
        .then((res) => {
          this.$message({
            message: this.isadd ? "添加商品成功" : "编辑商品成功",
            type: "success",
          });
          this.onLoad();
        })
        .catch((err) => {
          alertMessage(this, "error", err);
        });
    },
    // 确定选框
    send(data) {
      this.$refs.userform.validate((valid) => {
        if (valid) {
          // 创建一个序列化表单
          let imagelist = new FormData();
          // 处理文件队列中的文件将待上传文件加入序列化表单
          this.fileList.forEach((element) => {
            if (element.status == "ready")
              imagelist.append("file", element.raw);
          });
          // 判断是否有文件需要上传
          if (imagelist.getAll("file").length != 0) {
            addGoodsImg(imagelist)
              .then((res) => {
                this.$message({
                  message: "文件上传服务器成功",
                  type: "success",
                });
                data.pictures = res.data.data;
                // 将上传和没上传的文件放在一个数组
                this.fileList.forEach((element) => {
                  if (element.status == "success")
                    data.pictures.push(element.name);
                });
                data.pictures = JSON.stringify(data.pictures);
                this.update(data);
              })
              .catch((err) => {
                alertMessage(this, "error", err);
              });
          } else {
            this.update(data);
          }
          this.userform = false;
        }
      });
    },
    //恢复
    check(row) {
      this.$confirm("确定吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          row.isDelete = this.isDelete == 0 ? 1 : 0;
          addGoods(row)
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
        isOn: this.search.ison,
      };
      // 获取题目列表
      getAllGoodsList(dataobj).then((res) => {
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