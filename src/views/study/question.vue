<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>题目：</span>
          <el-input
            placeholder="请输入题目"
            v-model="search.keywords"
            size="small"
            clearable
          >
          </el-input>
          <span>题目模式：</span>
          <el-select
            v-model="search.status"
            placeholder="请选择题目模式"
            size="small"
          >
            <el-option label="问卷" :value="1"> </el-option>
            <el-option label="练习" :value="2"> </el-option>
          </el-select>
          <span>题目类型：</span>
          <el-select
            v-model="search.type"
            placeholder="请选择题目类型"
            size="small"
          >
            <el-option label="单选" :value="1"> </el-option>
            <el-option label="多选" :value="2"> </el-option>
            <el-option label="填空" :value="3"> </el-option>
            <el-option label="文本" :value="4"> </el-option>
            <el-option label="下拉" :value="5"> </el-option>
            <el-option label="级联" :value="6"> </el-option>
            <el-option label="打分" :value="7"> </el-option>
            <el-option label="上传" :value="8"> </el-option>
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
            isDelete ? "所有题目" : "垃圾桶"
          }}</el-button>
        </div>
      </el-header>
      <el-main>
        <template>
          <div class="main-btn">
            <div>
               <el-button
              type="primary"
              icon="iconfont icon-icon_tianjia"
              @click.native.prevent="addUser()"
              >添加</el-button
            >
            <el-button type="primary" @click="uploadexcel">上传excel题目</el-button>
            
            <a href="/api/files/display?filePath=hdfs://10.32.20.50:9001/training/files/QuestionDao.xlsx" ><el-button
            type="primary"
            >下载excel样表</el-button></a>
            </div>
           
            
          <el-upload
            ref="upload"
              class="upload-demo"
              action="/api/admin/questions/import"
              multiple
              :on-success="handleAvatarSuccess"
            >
            </el-upload>
          </div>

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
            <el-table-column type="selection" width="60"> </el-table-column>
             <el-table-column prop="id" label="题目id"></el-table-column>
            <el-table-column prop="questionTitle" label="题目标题">
            </el-table-column>
            <el-table-column prop="images" label="题目图片"> </el-table-column>
            <el-table-column prop="questionDescription" label="题目描述">
            </el-table-column>
            <el-table-column prop="createTime" label="发布时间">
            </el-table-column>
            <el-table-column label="操作" width="190">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
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
                  v-if="scope.row.isDelete == 1"
                  >恢复</el-button
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
        <el-dialog title="查看与编辑" :visible.sync="usercheck">

          <selectoption
          v-if="usercheck"
            :question="rowdata"
            :articletag="articletag"
            @deleteitem="deleteitem"
          />
        </el-dialog>
        <!-- 弹出框（编辑 添加） -->
        <el-dialog title="添加" :visible.sync="userform">
          <el-form
            :model="rowdata"
            :rules="formrules"
            label-width="80px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item label="题目标题" prop="questionTitle">
              <el-input
                v-model="rowdata.questionTitle"
                placeholder="请输入题目标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="题目描述">
              <el-input
                v-model="rowdata.questionDescription"
                placeholder="请输入题目描述"
              ></el-input>
            </el-form-item>
            <el-form-item label="题目标签">
              <el-select
                multiple
                filterable
                allow-create
                v-model="rowdata.tagNameList"
                placeholder="请选择题目标签"
                size="small"
              >
                <el-option
                  v-for="item in articletag"
                  :key="item.id"
                  :label="item.tagName"
                  :value="item.tagName"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目状态" prop="status">
              <el-radio-group v-model="rowdata.status" style="width: 200px">
                <el-radio :label="1">问卷</el-radio>
                <el-radio :label="2">练习</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="题目类型" prop="type">
              <el-select
                v-model="rowdata.type"
                placeholder="请选择题目类型"
                size="small"
              >
                <el-option label="单选" :value="1"> </el-option>
                <el-option label="多选" :value="2"> </el-option>
                <el-option label="填空" :value="3"> </el-option>
                <el-option label="文本" :value="4"> </el-option>
                <el-option label="下拉" :value="5"> </el-option>
                <el-option label="级联" :value="6"> </el-option>
                <el-option label="打分" :value="7"> </el-option>
                <el-option label="上传" :value="8"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="题目图片">
              <el-upload
                class="upload-demo"
                action="/api/admin/questions/images"
                multiple
                :on-success="handleAvatarSuccess"
              >
                <el-button>选择图片</el-button>
              </el-upload>
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
import {
  getquestionsList,
  deletequestion,
  addquestion,
  getquestionById,
} from "@/api/study/question";
import { getArticleTags } from "@/api/article/articletag";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
import selectoption from "@/components/study/selectoption.vue";
export default {
  name: "",
  components: { selectoption },
  data() {
    return {
      userform: false,
      usercheck: false, //用户查看按钮
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      multipleSelection: [], // 选中的数据
      isDelete: 0, //是否删除
      articletag: [], //标签
      formrules: {
        questionTitle: [
          { required: true, message: "请输入标题", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择题目状态", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择题目类型", trigger: "blur" }],
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查看删除的文件
    alldelete() {
      (this.isDelete = this.isDelete == 0 ? 1 : 0), this.onLoad();
    },

    deleteitem(value) {
      this.check(this.rowdata)
      this.usercheck = true;
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
      this.rowdata = {};
      this.rowdata = {
        questionTitle: item.questionTitle,
        status: item.status,
        type: item.type,
        tagNameList: item.tagDTOList.map((li) => li.tagName),
        questionDescription: item.questionDescription,
        id: item.id,
        answer: item.answerBackDTO,
      };
      if (item.images) this.rowdata.images = JSON.parse(item.images);
      if (item.answerBackDTO == null) {
        this.rowdata.answer = {
          id: item.id,
          questionAnalysis: "",
          status: item.status,
          type: item.type,
          correctAnswers: [""],
          images: "",
        };
        if (item.type == 1 || item.type == 2) {
          this.rowdata.answer.possibleAnswers=[]
        }
      } else {
        this.rowdata.answer.id = item.id;
        this.rowdata.answer.possibleAnswers =
          this.rowdata.answer.possibleAnswerList;
        this.rowdata.answer.correctAnswers =
          this.rowdata.answer.correctAnswerList;
      }
      this.usercheck = true;
    },
    // 添加用户信息
    addUser() {
      this.rowdata = {};
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
    },
    handleAvatarSuccess(res, file, fileList) {
      if (!res.flag) {
        file.status = "error";
        alertMessage(this, "error", file.name + "上传服务器失败请重新上传");
      } else {
        alertMessage(this, "success", file.name + "上传服务器成功");
        if (res.data!=null) this.rowdata.images = [res.data];
        this.onLoad()
      }
    },
      // 上传用户表之前
      uploadexcel() {
        this.$confirm('请确定excel是否为样表样式！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs['upload'].$refs['upload-inner'].handleClick();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消上传'
          });          
        });
      },
    // 确定选框
    send(data) {
      const list={...data}
 if (list.images) {
  list.images = JSON.stringify(list.images);
 } 
      this.$refs.userform.validate((valid) => {
        if (valid) {
          addquestion(list)
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
    //删除
    deleteRow(row) {
      this.$confirm("确定要删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          deletequestion([row.id]).then(
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
      this.$confirm("确定吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          row.isDelete = this.isDelete == 0 ? 1 : 0;
          addquestion(row).then(
            (res) => {
              alertMessage(this, "success", "操作成功!");
              this.onLoad();
            },
            (error) => {
              alertMessage(this, "error", "操作出错!");
            }
          );
        })
        .catch(() => {

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
        status: this.search.status,
        type: this.search.type,
        isDelete: this.isDelete,
      };
      // 获取题目列表
      getquestionsList(dataobj).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
      });
    },
    // 进入加载
    onLoad() {
      this.getArticle();

      // 获取文章标签列表
      getArticleTags().then((res) => {
        this.articletag = res.data.data.recordList;
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
.main-btn {
  // display: flex;
  .el-button {
    margin-right: 10px;
  }
  :deep(.upload-demo) {
    align-items: center;
    display: flex;
  }
}
</style>