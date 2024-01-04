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
          <el-button type="primary" icon="iconfont icon-chaxun" @click="alldelete"
            >{{isDelete?'查看文件':"查看删除的文件"}}</el-button
          >
        </div>
      </el-header>
      <el-main>
        <template>
           <el-button
            type="primary"
            icon="iconfont icon-delete"
            @click.native.prevent="deleteRow(multipleSelection)"
            >{{isDelete?'批量恢复':"批量删除"}}</el-button
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
            <el-table-column prop="fileName" label="文档标题"> </el-table-column>
             <el-table-column prop="fileDesc" label="文档描述">
            </el-table-column>
            <el-table-column prop="id" label="文档id">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="userCheck(scope.row)"
                  >阅读文件</el-button
                >
              </template>
             </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="deleteRow([scope.row])"
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
      </el-main>
    </el-container>
     <el-dialog
  title="查看文件"
  fullscreen
  :visible.sync="dialogVisible">
  <iframe :src="fileurl" frameborder="0" width="100%" height="100%"></iframe>
</el-dialog>
  </div>
</template>

<script>
import { getDocumentFile,deleteDocumentFile,getDocumentFileBlob} from "@/api/document/allfile";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      search: {},
      tableData: [],
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      multipleSelection:[],//多选数据
      isDelete:0,
       dialogVisible:false,//查看视频
      fileurl:'',//视频地址
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
              // 查看文件
    userCheck(row){
getDocumentFileBlob(row.fileSrc).then((res)=>{
    const blob = new Blob([res.data],{ type: res.data.type});
              this.fileurl = window.URL.createObjectURL(blob);
})
        this.dialogVisible = true
    },
    //删除
    deleteRow(row) {
      if (row.length!=0) {
        const idlist = []
        row.forEach(el => {
          idlist.push(el.id)
        });
        const data={
            isDelete:this.isDelete==0?1:0,
            idList:idlist
          }
this.$confirm("确定吗？", this.$t("tip"), {
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
    // 查看删除的文件
alldelete(){
    this.isDelete = this.isDelete==0?1:0,
    this.onLoad()
},
    // 进入加载
    onLoad() {
      const data = {
        size:this.pagesize,
        current:this.current,
        type:1,
        isDelete:this.isDelete
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
::v-deep .el-dialog{
  .el-dialog__body{
    height: calc(100% - 58px);
    padding: 0;
    padding-left: 30px;
  }
  iframe{
    height: 100%;
  }
}
</style>