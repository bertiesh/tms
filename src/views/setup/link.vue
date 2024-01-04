<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>标题：</span>
          <el-input
            placeholder="请输入题目"
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
          >
            <el-table-column type="selection" width="60"> </el-table-column>
            <el-table-column prop="linkName" label="链接标题">
            </el-table-column>
            <el-table-column label="链接封面">
                <template slot-scope="scope">
 <el-image
  style="cursor:pointer"
  lazy
  v-if="scope.row.linkPhoto"
      :src="scope.row.linkPhoto"
      fit="cover"
      @click="magnify(scope.row.linkPhoto)"></el-image>
                 </template>
            </el-table-column>
            <el-table-column label="链接地址">
                 <template slot-scope="scope">
                    <a class="linka" :href="scope.row.linkAddress" target="blank">{{scope.row.linkAddress}}</a>
              </template>
            </el-table-column>
             <el-table-column prop="linkIntro" label="链接介绍">
            </el-table-column>
             <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column label="操作" width="220">
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
            <el-form-item label="链接标题" prop="linkName">
              <el-input
                v-model="rowdata.linkName"
                placeholder="请输入问题"
              ></el-input>
            </el-form-item>
            <el-form-item label="链接介绍" prop="linkIntro">
              <el-input
                v-model="rowdata.linkIntro"
                placeholder="请输入答案"
              ></el-input>
            </el-form-item>
            <el-form-item label="链接地址" prop="linkAddress">
              <el-input
                v-model="rowdata.linkAddress"
                placeholder="请输入问题分类"
              ></el-input>
            </el-form-item>
            <el-form-item label="链接图片" prop="linkPhoto">
              <el-input
                v-model="rowdata.linkPhoto"
                placeholder="请输入问题目的"
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
    <!-- 查看图片 -->
<el-dialog
  :visible.sync="dialogVisible"
  >
<el-image
      :src="`/api/photos/display?photoPath=${imgrul}`"
      fit="cover"></el-image>
</el-dialog>
  </div>
</template>

<script>
import { getLinksList,addLink,deleteLink } from "@/api/setup/link";
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
      dialogVisible:false,//大图片弹窗
      imgrul:'',//图片地址（放大后）
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      formrules: {
        linkName: [{ required: true, message: "请输入链接标题", trigger: "blur" }],
        linkIntro: [{ required: true, message: "请输入链接介绍", trigger: "blur" }],
        linkAddress: [
          { required: true, message: "请输入链接地址", trigger: "blur" },
        ],
        linkPhoto: [
          { required: true, message: "请上传链接图片", trigger: "blur" },
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
    // 放大图片
    magnify(url){
        this.imgrul = url
        this.dialogVisible = true
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
      this.isadd = false;
    },
    // 添加用户信息
    addUser() {
      this.rowdata = {};
      this.rowdata.images=[]
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
      this.isadd = true;
    },
    // 确定选框
    send(data){
      this.$refs.userform.validate((valid) => {
          if (valid) {
addLink(data).then((res)=>{
  alertMessage(this, "success", this.isadd?"添加操作成功!":'编辑操作成功');
   this.onLoad();
  
}).catch((err) => {
              alertMessage(this, "error", err);
            });
            this.userform = false
          }
      })
    },
    //删除
    deleteRow(row) {
      this.$confirm("确定要删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          deleteLink([row.id]).then(
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
      getLinksList(dataobj).then((res) => {
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
.main-btn{
  display: flex;
  .el-button{
    margin-right: 10px;
  }
  :deep(.upload-demo){
    align-items: center;
    display: flex;
  }
}
.linka:hover{
    color: #409EFF;
}
.el-dialog{
    .el-form{
        display: flex;
        flex-direction: column;
        :deep(.el-form-item__content){
            width: 80%;
        }
    }
}
</style>