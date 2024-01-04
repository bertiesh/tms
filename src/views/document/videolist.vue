<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column
      type="selection"
      width="60">
    </el-table-column>
            <el-table-column type="index" label="序号" width="70">
            </el-table-column>
            <el-table-column prop="fileName" label="视频标题"> </el-table-column>
             <el-table-column prop="fileDesc" label="视频描述">
            </el-table-column>
            <el-table-column prop="id" label="视频id"> </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  >查看视频</el-button
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
     <!-- 弹出框（编辑 添加） -->
        <el-dialog title="添加" :visible.sync="userform">
          <el-form
            :model="rowdata"
            label-width="80px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item>
              <el-upload
              ref="upload"
  action="#"
  multiple
   :auto-upload="false"
   :on-change="handlePreview"
  >
 <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
</el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userform = false">取 消</el-button>
            <el-button type="primary" @click="send(rowdata)">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog
  title="查看视频"
  width="90%"
  :visible.sync="dialogVisible">
  <videoPlayer  :url="`/api/files/display?filePath=${videourl}`"></videoPlayer>
</el-dialog>
  </div>
</template>

<script>
import { getDocumentFile,deleteDocumentFile,addDocumentFileToServer,addDocumentFile } from "@/api/document/filelist";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
import videoPlayer from "@/components/PlaeryVideo.vue";
export default {
  name: "",
  components: {videoPlayer},
  data() {
    return {
      userform: false,
      search: {},
      rowdata: {},
      tableData: [],
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      multipleSelection:[],//多选数据
      fileList:[],//上传文件列表
      dialogVisible:false,//查看视频
      videourl:'',//视频地址
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
    handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    //删除
    deleteRow(row) {
      if (row.length!=0) {
        const arr = this.tableData.filter(x => !row.some(y => y.id  === x.id ))
        const idlist = []
        arr.forEach(el => {
          idlist.push(el.id)
        });
        const data={
            collectionId:this.$route.query.id,
            fileIdList:idlist
          }
this.$confirm("确定要删除吗？", this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          deleteDocumentFile(data).then(
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
      }else{
        this.$message({
            type: 'warning',
            message: '请至少选择一条数据'
          });
      }
      
    },
    // 查看视频
    userCheck(row){
        this.videourl = row.fileSrc
        this.dialogVisible = true
    },
    // 刷新
    reset() {
      this.search = {};
      this.onLoad();
    },
    // 上传视频封面之前
      handlePreview(file,fileList) {
        this.fileList = fileList
      },
     // 新增确认
   send(){
    if (this.fileList.length!=0) {
      let imagelist =new FormData()
this.fileList.forEach((element) => {
  imagelist.append("file", element.raw)
})
addDocumentFileToServer(imagelist).then((res)=>{
  this.$message({
          message: '文件上传服务器成功',
          type: 'success'
        });
addDocumentFile(res.data.data,this.$route.query.id).then((res)=>{
  this.$message({
          message: '添加文件成功',
          type: 'success'
        });
        this.onLoad();
        
  }).catch((err) => {
              alertMessage(this, "error", err);
            });
            this.userform=false
}).catch((err) => {
              alertMessage(this, "error", err);
            });
    }else{
       this.$message({
          message: '请选择文件',
          type: 'warning'
        });
    }
        
    },
    // 添加视频合集
    addUser(){
      this.rowdata = {};
      this.fileList = []
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
    },
    // 进入加载
    onLoad() {
      const data = {
        size:this.pagesize,
        current:this.current,
        albumId:this.$route.query.id,
        type:2,
        isDelete:0
      }
       getDocumentFile(data).then((res) => {
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
    video{
        width: 100%;
    }
}
</style>