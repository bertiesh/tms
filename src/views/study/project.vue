<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>项目：</span>
          <el-input
            placeholder="请输入题目"
            v-model="search.keywords"
            size="small"
            clearable
          >
          </el-input>
          <span>项目模式：</span>
          <el-select
            v-model="search.status"
            placeholder="请选择题目模式"
            size="small"
          >
            <el-option label="问卷" :value="1"> </el-option>
            <el-option label="练习" :value="2"> </el-option>
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
          v-loading="loading"
            ref="articletable"
            :data="tableData"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }"
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="selection" width="60"> </el-table-column>
            <el-table-column prop="name" label="项目名称"> </el-table-column>
            <el-table-column label="项目模式">
              <template slot-scope="scope">
                {{ scope.row.status == 1 ? "问卷" : "练习" }}{{scope.row.id}}
              </template>
            </el-table-column>
            <el-table-column label="项目封面">
              <template slot-scope="scope">
                <el-image
                v-if="scope.row.cover"
                  style="cursor: pointer"
                  lazy
                  :src="`/api/photos/display?photoPath=${scope.row.cover}`"
                  fit="cover"
                  @click="magnify(scope.row.cover)"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="questionBackDTOS.length" label="项目题数">
            </el-table-column>
            <el-table-column prop="description" label="项目描述">
            </el-table-column>
            <el-table-column label="统计">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="count(scope.row)"
                  >统计分析</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="look(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >查看详情</el-button
                >
                
                <el-button
                  type="text"
                  @click.native.prevent="userUpdate(scope.row)"
                  v-if="scope.row.isDelete == 0"
                  >编辑</el-button
                >
                <el-button type="text" @click.native.prevent="check(scope.row)"
                  >{{scope.row.isDelete== 0?'删除':'恢复'}}</el-button
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
        <!-- 查看详情 -->
        <el-dialog title="查看" :visible.sync="userlook">
          <el-descriptions :border="true" :column="2">
            <el-descriptions-item label="生成方式">
              {{ rowdata.isRandom ? "随机生成" : "手动生成" }}
            </el-descriptions-item>
            <el-descriptions-item label="答案解析">
              {{ rowdata.answerAnalysis ? "展示" : "不展示" }}
            </el-descriptions-item>
            <el-descriptions-item label="答题卡">
              {{ rowdata.answerSheetVisible ? "可见" : "不可见" }}
            </el-descriptions-item>
            <el-descriptions-item label="自动保存">
              {{ rowdata.autoSave ? "是" : "否" }}
            </el-descriptions-item>
            <el-descriptions-item label="用户拷贝">
              {{ rowdata.copyEnabled ? "是" : "否" }}
            </el-descriptions-item>
            <el-descriptions-item label="修改答案">
              {{ rowdata.enableUpdate ? "是" : "否" }}
            </el-descriptions-item>
            <el-descriptions-item label="开始时间">
              {{ rowdata.startTime ? rowdata.startTime : "——" }}
            </el-descriptions-item>
            <el-descriptions-item label="结束时间">
              {{ rowdata.endTime ? rowdata.endTime : "——" }}
            </el-descriptions-item>
            <el-descriptions-item label="是否开放">
              {{ rowdata.isActive ? "是" : "否" }}
            </el-descriptions-item>
            <el-descriptions-item label="答题进度">
              {{ rowdata.progressBar ? "显示" : "不显示" }}
            </el-descriptions-item>
            <el-descriptions-item label="随机标签">
              {{ rowdata.isRandom ? rowdata.tagIds : "非随机产生" }}
            </el-descriptions-item>
            <el-descriptions-item label="随机题型">
              {{ rowdata.isRandom ? rowdata.types : "非随机产生" }}
            </el-descriptions-item>
          </el-descriptions>
        </el-dialog>
        <!-- 弹出框（编辑 添加） -->
        <el-dialog :visible.sync="userform">
          <template slot="title">
             添加
          </template>
          <el-form
            :model="rowdata"
            :rules="formrules"
            label-width="90px"
            :inline="true"
            size="small"
            ref="userform"
          >
          <el-form-item label="生成方式" prop="isRandom">
              <el-radio-group v-model="rowdata.isRandom" style="width: 200px">
                <el-radio :label="true">随机生成</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目名称" prop="name">
              <el-input
                v-model="rowdata.name"
                placeholder="请输入项目名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="随机题数" prop="questionNum">
              <el-input
                v-model="rowdata.questionNum"
                placeholder="请输入随机题数"
              ></el-input>
            </el-form-item>
            <el-form-item label="随机标签" prop="tagIds">
              <el-select
                multiple
                filterable
                allow-create
                v-model="rowdata.tagIds"
                placeholder="请选择题目标签"
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
            </el-form-item>
            <el-form-item label="随机题型" prop="types">
              <el-select
                multiple
                filterable
                allow-create
                v-model="rowdata.types"
                placeholder="请选择题目类型"
                size="small"
              >
                <el-option label="单选" :value="1"> </el-option>
                <el-option label="多选" :value="2"> </el-option>
                <el-option label="填空" :value="3"> </el-option>
                <el-option label="文本" :value="4"> </el-option>
                <el-option label="下拉" :value="5"> </el-option>
                <el-option label="打分" :value="7"> </el-option>
                <el-option label="上传" :value="8"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker
                style="width: 200px"
                v-model="rowdata.startTime"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                style="width: 200px"
                v-model="rowdata.endTime"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="项目描述">
              <el-input
                v-model="rowdata.description"
                placeholder="请输入模板描述"
              ></el-input>
            </el-form-item>
            <el-form-item label="项目模式" prop="status">
              <el-radio-group v-model="rowdata.status" style="width: 200px">
                <el-radio :label="1">问卷</el-radio>
                <el-radio :label="2">练习</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="答案解析">
              <el-radio-group
                v-model="rowdata.answerAnalysis"
                style="width: 200px"
              >
                <el-radio :label="true">展示</el-radio>
                <el-radio :label="false">不展示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="答题卡">
              <el-radio-group
                v-model="rowdata.answerSheetVisible"
                style="width: 200px"
              >
                <el-radio :label="true">可见</el-radio>
                <el-radio :label="false">不可见</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="自动保存">
              <el-radio-group v-model="rowdata.autoSave" style="width: 200px">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用户拷贝">
              <el-radio-group
                v-model="rowdata.copyEnabled"
                style="width: 200px"
              >
                <el-radio :label="true">允许</el-radio>
                <el-radio :label="false">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="修改答案">
              <el-radio-group
                v-model="rowdata.enableUpdate"
                style="width: 200px"
              >
                <el-radio :label="true">允许</el-radio>
                <el-radio :label="false">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="对用户开发">
              <el-radio-group v-model="rowdata.isActive" style="width: 200px">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="答题进度">
              <el-radio-group
                v-model="rowdata.progressBar"
                style="width: 200px"
              >
                <el-radio :label="true">显示</el-radio>
                <el-radio :label="false">不显示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="项目封面">
              <el-upload
                class="upload-demo"
                action="/api/admin/questions/images"
                multiple
                :on-success="handleAvatarSuccess"
                :file-list="fileList"
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
    <!-- 查看图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <el-image
        :src="`/api/photos/display?photoPath=${imgrul}`"
        fit="cover"
      ></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { alertMessage } from "@/util/alert";
import { getArticleTags } from "@/api/article/articletag";
import { getProjectsList, addProjects } from "@/api/study/project";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {  },
  data() {
    
    return {
      dialogVisible: false, //大图片弹窗
      imgrul: "", //图片地址（放大后）
      userform: false, //编辑表单
      userlook: false, //查看详情
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      questiondata: [], //题目数据
      articletag: [], //标签
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      multipleSelection: [], // 选中的数据
      isDelete: 0, //是否删除
      fileList: [], //图片地址
      formrules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        status: [
          { required: true, message: "请选择模板状态", trigger: "blur" },
        ],
        questionNum: [
          { message: "请选择模板状态", required: true, trigger: "blur" },
        ],
        isRandom: [
          {
            required: true,
            message: "请输入随机标签",
            trigger: "blur",
          },
        ],
        tagIds: [
          {
            type: "array",
            required: true,
            message: "请输入随机标签",
            trigger: "blur",
          },
        ],
        types: [
          {
            type: "array",
            required: true,
            message: "请输入随机题型",
            trigger: "blur",
          },
        ],
      },
      loading:true
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
    magnify(url) {
      this.imgrul = url;
      this.dialogVisible = true;
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
    // 查看详情
    look(item) {
      this.rowdata = item;
      this.userlook = true;
    },
    // 编辑用户信息
    userUpdate(item) {
       this.$router.push({
        path:"/study/questionnaire",
        query:{id:item.id,name:"编辑问卷"}
      });
    },
    // 添加用户信息
    addUser() {
      this.$confirm('请选择创建方式', '提示信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '随机生成',
          cancelButtonText: '自定义'
        })
          .then(() => {
      this.rowdata = {};
      this.rowdata.isRandom=true
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
      this.isadd = true;
          })
          .catch(action => {
            this.$router.push({
        path:"/study/questionnaire",
      });
          });
     
    },
    handleAvatarSuccess(res, file, fileList) {
      if (res.code == 510) {
        file.status = "error";
        alertMessage(this, "error", file.name + "上传服务器失败请重新上传");
      } else {
        alertMessage(this, "success", file.name + "上传服务器成功");
        this.rowdata.cover = res.data;
      }
    },
    // 确定选框
    send(value) {
      const data = {...value}
      data.tagIds = JSON.stringify(data.tagIds);
      data.types = JSON.stringify(data.types);
      if (data.questions) data.questions = JSON.stringify(data.questions);
      this.$refs.userform.validate((valid) => {
        if (valid) {
          addProjects(data).then((res) => {
                  alertMessage(
                    this,
                    "success",
                    this.isadd ? "添加操作成功!" : "编辑操作成功"
                  );
                  this.onLoad();
                  this.userform = false;
                }).catch((err)=>{
                   alertMessage(
                    this,
                    "error",
                    err
                  );
                });
          this.userform = false;
        }
      });
    },
    //恢复
    check(row) {
      this.$confirm("确定删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          row.isDelete = 1;
          addProjects(row).then(
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
    // 用户统计
    count(value){
this.$router.push({
        path:"/study/analyse",
        query:{id:value.id,keyword:value.name}
      });
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
      };
      // 获取题目列表
      getProjectsList(dataobj).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
        this.total = data.count;
        this.loading=false
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
  display: flex;
  .el-button {
    margin-right: 10px;
  }
  :deep(.upload-demo) {
    align-items: center;
    display: flex;
  }
}
</style>