<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>文章标题：</span>
          <el-input
            placeholder="请输入文章标题"
            v-model="search.keywords"
            size="small"
            clearable
          >
          </el-input>
          <span>文章标签：</span>
          <el-select
            v-model="search.tagId"
            placeholder="请选择文章标签"
            size="small"
          >
            <el-option
              v-for="item in articletag"
              :key="item.id"
              :label="item.tagName"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <span>文章分类：</span>
          <el-select
            v-model="search.categoryId"
            placeholder="请选择文章分类"
            size="small"
          >
            <el-option
              v-for="item in articleclass"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            >
            </el-option>
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
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="backup"
            >一键备份</el-button
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
            :row-class-name="tableRowClassName"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
          <el-table-column
      type="selection"
      width="60">
    </el-table-column>
            <el-table-column prop="articleTitle" label="文章标题">
            </el-table-column>
            <el-table-column prop="categoryName" label="文章类型">
            </el-table-column>
            <el-table-column prop="tag" label="文章标签"> </el-table-column>
            <el-table-column label="点赞数">
              <template slot-scope="scope">
                {{ scope.row.likeCount == null ? 0 : scope.row.likeCount }}
              </template>
            </el-table-column>
            <el-table-column prop="tag" label="浏览量"> <template slot-scope="scope">
                {{ scope.row.viewsCount == null ? 0 : scope.row.viewsCount }}
              </template></el-table-column>
            <el-table-column label="文章状态">
               <template slot-scope="scope">
                {{scope.row.status==1?'公开':''}}
        {{scope.row.status==2?'草稿箱':''}}
        {{scope.row.status==3?'评论可见':''}}
               </template>
            </el-table-column>
            <el-table-column label="审核状态">
               <template slot-scope="scope">
               {{scope.row.isReview==1?'待审核':''}}
        {{scope.row.isReview==2?'未通过':''}}
        {{scope.row.isReview==3?'通过':''}}
               </template>
            </el-table-column>
            <el-table-column prop="createTime" label="发布时间">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  >阅读文章</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="deleteRow(scope.row)"
                  v-if="scope.row.isDelete==0"
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
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {
  getArticleList,
  deleteArticle,
  backupArticleToHdfs
} from "@/api/article/userarticle";
import { getArticleTags } from "@/api/article/articletag";
import { getArticleClass } from "@/api/article/articleclass";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      articletag: [], //文章标签
      articleclass: [], //文章分类
      multipleSelection:[], // 选中的数据
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
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 备份至hdfs
      backup(){
        if (this.multipleSelection.length!=0) {
          let data =[]
this.multipleSelection.forEach(element => {
  data.push(element.id)
});
backupArticleToHdfs(data).then((res)=>{
  this.$message.success("文章备份成功!");
})
        }else{
          this.$message({
          message: '请选择数据',
          type: 'warning'
        });
        }
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
      this.$router.push({ path: '/article/readarticle',query:{id:item.id,userId:item.userId} });
    },
    //删除
    deleteRow(row) {
      this.$confirm("确定要删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          deleteArticle(row.id).then(
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
        this.getArticle()
      }else {
        alertMessage(this, "error", "请重新输入");
      }
    },
    // 刷新
    reset() {
      this.search = {};
      this.onLoad();
    },
    // 获取文章列表
    getArticle(){
const dataobj = {
        size: this.pagesize,
        current: this.current,
        keywords: this.search.keywords,
        categoryId: this.search.categoryId,
        tagId: this.search.tagId,
      };
      // 获取文章列表
      getArticleList(dataobj).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        if (this.tableData) {
          this.tableData.forEach((el) => {
          if (el.tagDTOList.length != 0) {
            let taglist = [];
            el.tagDTOList.forEach((element) => {
              taglist.push(element.tagName);
            });
            el.tag = taglist.join(",");
          } else {
            el.tag = "——";
          }
          el.createTime = el.createTime.split("T")[0];
        });
        }
        
        this.total = data.count;
      });
    },
    // 进入加载
    onLoad() {
      this.getArticle()
      // 获取文章标签列表
      getArticleTags().then((res) => {
        this.articletag = res.data.data.recordList;
      });
      // 获取文章分类
      getArticleClass().then((res) => {
        this.articleclass = res.data.data.recordList;
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