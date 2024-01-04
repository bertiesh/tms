<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>合集名称：</span>
          <el-input
            placeholder="请输入合集名称"
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
            @click="searchbtn"
            >搜索</el-button
          >
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
        </div>
      </el-header>
      <el-main>
        <template>
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
            <el-table-column prop="collectionName" label="合集名称"> </el-table-column>
             <el-table-column prop="collectionDesc" label="合集描述">
            </el-table-column>
            <el-table-column label="合集封面">
                 <template slot-scope="scope">
 <el-image
  style="cursor:pointer"
  lazy
  v-if="scope.row.collectionCover"
      :src="`/api/photos/display?photoPath=${scope.row.collectionCover}`"
      fit="cover"
      @click="magnify(scope.row.collectionCover)"></el-image>
                 </template>
            </el-table-column>
            <el-table-column prop="fileCount" label="视频数目">
            </el-table-column>
            <el-table-column label="习题名称">
              <template slot-scope="scope">
                {{scope.row.projects==null?'——':scope.row.projects[0].name}}
              </template>
            </el-table-column>
            <el-table-column  width="90">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="openfile(scope.row)"
                  >管理视频</el-button
                >
              </template>
             </el-table-column>
            <el-table-column label="操作" width="140">
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
            <el-form-item label="视频名称" prop="collectionName">
              <el-input
                v-model="rowdata.collectionName"
                placeholder="请输入视频名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="视频描述" prop="collectionDesc">
              <el-input
                v-model="rowdata.collectionDesc"
                placeholder="请输入视频描述"
              ></el-input>
            </el-form-item>
            <el-form-item label="视频状态" prop="status">
              <el-radio-group v-model="rowdata.status">
    <el-radio :label="1">公开</el-radio>
    <el-radio :label="2">私密</el-radio>
  </el-radio-group>
            </el-form-item>
            <el-form-item label="视频封面" prop="collectionCover">
              <el-upload
              ref="upload"
  action="/api/admin/files/collections/cover"
  list-type="picture-card"
  :show-file-list="false"
   :auto-upload="false"
   :on-change="handlePreview"
   :on-success="handleAvatarSuccess"
  >
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <img v-if="!isadd&&!imageUrl" :src="`/api/photos/display?photoPath=${rowdata.collectionCover}`" class="avatar">
  
  <i class="el-icon-plus" v-if="isadd"></i>
  
</el-upload>
            </el-form-item>
            <el-form-item label="视频类型" v-show="false">
                {{rowdata.type=2}}
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
import { getDocumentList,addDocument,deleteDocument } from "@/api/document/file";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    var validatePass2 = (rule, value, callback) => {
        if (this.rowdata.collectionCover) {
            callback();
        }else{
            callback(new Error('请上传视频封面'));
        }
      };
    return {
      usercheck: false,
      search: {},
      rowdata: {},
      tableData: [],
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      dialogVisible:false,//大图片弹窗
      imgrul:'',//图片地址（放大后）
      imageUrl:'',
      userform: false,
      isadd: true,
formrules: {
        collectionName: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
        collectionDesc: [{ required: true, message: "请输入视频描述", trigger: "blur" }],
        status: [
         { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        collectionCover:[{ validator: validatePass2, trigger: "blur" }],
        
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
    //删除
    deleteRow(row) {
      this.$confirm("确定要删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          deleteDocument(row.id).then(
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
    
    // 放大图片
    magnify(url){
        this.imgrul = url
        this.dialogVisible = true
    },
// 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
      this.imageUrl=''
      this.userform = true;
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
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
    // 上传视频封面之前
      handlePreview(file) {
        this.imageUrl= URL.createObjectURL(file.raw);
      },
    //   上传封面成功后
    handleAvatarSuccess(res, file){
this.imageUrl= URL.createObjectURL(file.raw);
this.rowdata.collectionCover = res.data[0]
this.addupdate(this.rowdata)
    },
    // 添加函数
    addupdate(data){
this.$refs.userform.validate((valid) => {
          if (valid) {
          addDocument(data).then((res)=>{
    this.$message({
          message:this.isadd?'添加成功':"更新成功",
          type: 'success'
        });
        this.onLoad()
        
 }).catch((err) => {
              alertMessage(this, "error", err);
            });
this.userform = false;
 }
     })
    },
    // 新增确认
   send(data){
      if (this.imageUrl) {
        this.$refs.upload.submit();
      }else{
         this.addupdate(data)
      }
    },
    // 查询用户
    searchbtn() {
      if (this.search) {
       this.onLoad()
      } else {
        alertMessage(this, "error", "请重新输入");
      }
    },
    // 刷新
    reset() {
      this.search = {};
      this.onLoad();
    },
// 进入文件管理页面
    openfile(list){
this.$router.push({ path: '/document/videolist',query:{id:list.id} });
    },
    // 进入加载
    onLoad() {
      const data = {
        size:this.pagesize,
        current:this.current,
        keywords:this.search.keywords,
        type:2
      }
       getDocumentList(data).then((res) => {
        const data = res.data.data;
        this.tableData = data.recordList;
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
.el-dialog{
    .el-form{
        display: flex;
            flex-direction: column;
.el-form-item{
     :deep(.el-upload--picture-card) {
        width: 198px;
        height: 120px;
      }
      :deep(.el-icon-plus) {
        text-align: center;
        position: relative;
        bottom: 10px;
      }
      .avatar {
    width: 196px;
        height: 118px;
            border-radius: 6px;
  }
}
           
    }
}
</style>