<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>问题：</span>
          <el-input
            placeholder="请输入题目"
            v-model="search.keywords"
            size="small"
            clearable
          >
          </el-input>
          <span>问题类型：</span>
          <el-select
            v-model="search.status"
            placeholder="请选择题目模式"
            size="small"
          >
            <el-option label="常见问题" :value="1"> </el-option>
            <el-option label="普通问题" :value="0"> </el-option>
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
          <el-button type="primary" @click="alldelete"
            >{{isDelete?'所有题目':"垃圾桶"}}</el-button
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
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="selection" width="60"> </el-table-column>
            <el-table-column prop="question" label="问题">
            </el-table-column>
            <el-table-column prop="intention" label="问题目的">
            </el-table-column>
            <el-table-column prop="category" label="问题分类">
            </el-table-column>
             <el-table-column label="相似问题">
              <template slot-scope="scope">
                <span class="helpid" v-for="item in scope.row.synonymicQuestions"
              :key="item" @click="searchid(item)">{{item}} </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >详细答案</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="userUpdate(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="deleteRow(scope.row)"
                  v-if="scope.row.isDelete == 1"
                  >数据库删除</el-button
                >
                <el-button
                  type="text"
                  @click.native.prevent="check(scope.row)"
                  >{{isDelete?'恢复':"删除"}}</el-button
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
        <!-- 查看 -->
        <el-dialog title="查看详细答案" :visible.sync="usercheck">
          <el-descriptions :border="true" :column="1">
            <el-descriptions-item label="问题">
              {{ rowdata.question }}
            </el-descriptions-item>
            <el-descriptions-item label="答案">
              {{ rowdata.answer }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
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
            <el-form-item label="问题" prop="question">
              <el-input
                v-model="rowdata.question"
                placeholder="请输入问题"
              ></el-input>
            </el-form-item>
            <el-form-item label="答案" prop="answer">
              <el-input
              type="textarea"
              :rows="4"
                v-model="rowdata.answer"
                placeholder="请输入答案"
              ></el-input>
            </el-form-item>
            <el-form-item label="问题分类" prop="category">
              <el-input
                v-model="rowdata.category"
                placeholder="请输入问题分类"
              ></el-input>
            </el-form-item>
            <el-form-item label="问题目的" prop="intention">
              <el-input
                v-model="rowdata.intention"
                placeholder="请输入问题目的"
              ></el-input>
            </el-form-item>
            <el-form-item label="相似问题" prop="synonymicQuestions">
             <el-select
             multiple
                filterable
                allow-create
             style="width: 100%;"
            v-model="rowdata.synonymicQuestions"
            placeholder="请选择相似问题"
            size="small"
          >
            <el-option
              v-for="item in alltableData"
              :key="item.id"
              :label="item.question"
              :value="item.id"
            >
            </el-option>
          </el-select>
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
import { getHelpList,addHelp,deleteHelp } from "@/api/information/assist";
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
      usercheck: false, //用户查看按钮
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      alltableData:[],//所有问题
      questiondata:[],
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      isDelete: 0, //是否删除
      formrules: {
        question: [{ required: true, message: "请输入问题", trigger: "blur" }],
        answer: [{ required: true, message: "请输入答案", trigger: "blur" }],
        category: [
          { required: true, message: "请输入问题分类", trigger: "blur" },
        ],
         intention: [
          { required: true, message: "请输入问题目的", trigger: "blur" },
        ],
         synonymicQuestions: [
          { required: true, message: "请选择相似问题", trigger: "blur" },
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
alldelete(){
    this.isDelete = this.isDelete==0?1:0,
    this.onLoad()
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
      this.usercheck = true;
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
      data.synonymicQuestions = data.synonymicQuestions.join(",")
      this.$refs.userform.validate((valid) => {
          if (valid) {
addHelp(data).then((res)=>{
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
          deleteHelp([row.id]).then(
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
    //恢复
    check(row) {
      row.isDelete=this.isDelete==0?1:0
      this.$confirm("确定吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          addHelp(row).then(
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
    // 相似问题
    searchid(id){
      this.search.id = id
      this.searchbtn(this.search)
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
        status: this.search.status,
        isDelete: this.isDelete,
        helpId:this.search.id
      };
      // 获取题目列表
      getHelpList(dataobj).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.tableData.forEach(el => {
if (el.synonymicQuestions) el.synonymicQuestions=el.synonymicQuestions.split(",")
        });
        
        this.total = data.count;
      });
    },
    // 进入加载
    onLoad() {
        this.getArticle();
        getHelpList().then((res) => {
        const data = res.data.data;
        this.alltableData = data.recordList;
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
.main-btn{
  display: flex;
  .el-button{
    margin-right: 10px;
  }
  :deep(.upload-demo){
    align-items: center;
    display: flex;
    cursor: pointer;
  }
  
}
.helpid{
    cursor: pointer;
  }
 .helpid:hover{
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