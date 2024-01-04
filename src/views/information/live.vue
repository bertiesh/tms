<template>
  <div class="index">
    <el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
          <span>直播间名：</span>
          <el-input
            placeholder="请输入直播间名"
            v-model="search.keywords"
            size="small"
            clearable
          >
          </el-input>
          <span>直播间类型：</span>
           <el-select v-model="search.type" placeholder="请选择直播间类型" size="small">
    <el-option
      
      label="内窥镜"
      value="1">
    </el-option>
    <el-option
      label="三方"
      value="2">
    </el-option>
  </el-select>
          <span>直播间状态：</span>
           <el-select v-model="search.status" placeholder="请选择直播间类型" size="small">
            <el-option
      label="预告"
      value="0">
    </el-option>
    <el-option
      label="直播中"
      value="1">
    </el-option>
    <el-option
      label="结束"
      value="2">
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
          <el-button type="primary" @click="alldelete">{{
            isDelete ? "所有通知" : "垃圾桶"
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
            <el-table-column prop="name" label="直播名称">
            </el-table-column>
            <el-table-column prop="userInfoDTO.nickname" label="主播昵称">
            </el-table-column>
            <el-table-column prop="cover" label="封面">
              <template slot-scope="scope">
 <el-image
  style="cursor:pointer;height: 80px;"
  lazy
  v-if="scope.row.cover"
      :src="`/api/photos/display?photoPath=${scope.row.cover}`"
      fit="cover"
      @click="magnify(scope.row.cover)"></el-image>
                 </template>
            </el-table-column>
            <el-table-column prop="startTime" label="开始时间">
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间">
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
                  >{{ isDelete ? "恢复" : "删除" }}</el-button
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
            <el-form-item label="直播名称" prop="name">
              <el-input
                v-model="rowdata.name"
                placeholder="请输入直播名称"
              ></el-input>
            </el-form-item>
             <el-form-item label="主播昵称" prop="nickname">
             <el-autocomplete
             style="width: 100%"
  v-model="rowdata.nickname"
  :fetch-suggestions="querySearchAsync"
  placeholder="请输入主播昵称"
   @select="handleSelect"
></el-autocomplete>
            </el-form-item>
             <el-form-item label="直播封面" prop="cover">
              <el-upload
                class="upload-demo"
                action="/api/admin/lives/cover"
                multiple
                :on-success="handleAvatarSuccess"
                :file-list="fileList"
              >
                <el-button>选择图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="直播链接" prop="liveUrl">
              <el-input
                v-model="rowdata.liveUrl"
                placeholder="请上传"
              ></el-input>
            </el-form-item>
            <el-form-item label="直播类型" prop="type">
             <el-radio-group v-model="rowdata.type">
      <el-radio :label="1">内窥镜</el-radio>
      <el-radio :label="2">三方</el-radio>
    </el-radio-group>
            </el-form-item>
            <el-form-item label="屏幕类型" prop="screenType">
              <el-radio-group v-model="rowdata.screenType">
      <el-radio :label="1">横屏</el-radio>
      <el-radio :label="2">竖屏</el-radio>
    </el-radio-group>
            </el-form-item>
            <el-form-item label="直播评论">
               <el-radio-group v-model="rowdata.displayComment">
      <el-radio :label="0">禁止评论</el-radio>
      <el-radio :label="1">允许评论</el-radio>
    </el-radio-group>
            </el-form-item>
             
             <el-form-item label="直播权重">
             <el-input-number style="width: 100%;" v-model="rowdata.isTop" :max='9' :min="0"></el-input-number>
            </el-form-item>
             <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
              style="width: 100%;"
      v-model="rowdata.startTime"
      type="datetime"
      placeholder="请选择开始时间">
    </el-date-picker>
            </el-form-item>
             <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
               style="width: 100%;"
      v-model="rowdata.endTime"
      type="datetime"
      placeholder="请选择结束时间">
    </el-date-picker>
            </el-form-item>
            <el-form-item label="直播描述">
              <el-input
              type="textarea"
                :rows="4"
                v-model="rowdata.description"
                placeholder="请输入直播描述"
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
    <!--查看通知内容 -->
    <el-dialog :visible.sync="dialogVisible" :width="videourl?'90%':''">
        <el-image
        v-if="imgrul"
      :src="`/api/photos/display?photoPath=${imgrul}`"
      fit="cover"></el-image>
       
      <el-descriptions :border="true" :column="1" v-else>
            <el-descriptions-item label="视频回放">
            <el-button
                  type="text"
                  @click.native.prevent="checkvideo(rowdata)"
                  >查看</el-button
                >
            </el-descriptions-item>
            <el-descriptions-item label="评论">
              {{ rowdata.displayComment?'允许评论':'禁止评论' }}
            </el-descriptions-item>
            <el-descriptions-item label="直播状态">
              {{ rowdata.isLive==0?'未开始':'' }}
              {{ rowdata.isLive==1?'直播中':'' }}
              {{ rowdata.isLive==2?'已结束':'' }}
            </el-descriptions-item>
            <el-descriptions-item label="屏幕类型">
              {{rowdata.screenType==1?'横屏':'竖屏'}}
            </el-descriptions-item>
            <el-descriptions-item label="直播描述" v-if="!videourl">
              {{rowdata.description}}
            </el-descriptions-item>
          </el-descriptions>
          <video v-if="videourl" :src="`/api/photos/display?photoPath=${videourl}`" controls="controls"></video>
    </el-dialog>
  </div>
</template>

<script>
import { getLiveList,getUserList,updateLiveList } from "@/api/information/live";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    var check = (rule, value, callback) => {
     if (this.rowdata.cover) {
            callback();
        }else{
            callback(new Error('请上传直播封面'));
        }
    };
    return {
      userform: false,
      isadd: true,
      dialogVisible: false,
      imgrul:'',//图片地址（放大后）
      videourl:'',//视频地址
      search: {}, //用户搜索字段
      rowdata: {}, //查看字段
      tableData: [], //表格数据
      userlist:[],//用户列表
      fileList: [], //图片地址
      total: 0,
      pagesize: 10, //条数
      current: 1, //页码
      isDelete: 0, //是否删除
      formrules: {
        name: [
          { required: true, message: "请输入直播名称", trigger: "blur" },
        ],
        nickname: [
          { required: true, message: "请选择主播昵称", trigger: "blur" },
        ],
        cover: [
          { validator: check,required: true, trigger: "blur" },
        ],
        liveUrl: [
          { required: true, message: "请输入直播链接", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择直播类型", trigger: "blur" },
        ],
        screenType: [
          { required: true, message: "请选择屏幕类型", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
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
// 放大图片
    magnify(url){
        this.imgrul = url
        this.dialogVisible = true
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
      this.imgrul = ''
      this.videourl=''
      this.dialogVisible = true;
    },
    // 查看视频
    checkvideo(data){
this.videourl = data.liveUrl
        this.dialogVisible = true
    },
    // 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
      this.rowdata.nickname = item.userInfoDTO.nickname
      if (item.cover!=null) this.fileList[0] = { name: item.cover };
      this.userform = true;
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.isadd = false;
    },
    // 添加用户信息
    addUser() {
      this.rowdata = {};
      this.fileList=[]
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
      this.userform = true;
      this.isadd = true;
    },
    // 远程搜索主播名
     querySearchAsync(queryString, cb) {
if (queryString) {
  getUserList({keywords:queryString}).then((res) => {
       const data = res.data.data.recordList.map((terminal) => {
        return {
          value: terminal.nickname,
          id:terminal.userInfoId
        };
      });
        cb(data)
      });
}
     },
    //  最终选定的值
     handleSelect(item) {
        this.rowdata.userInfoId = item.id
      },
      // 长传图片
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
    send(data) {
      this.$refs.userform.validate((valid) => {
        if (valid) {
            updateLiveList(data)
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
    //恢复
    check(row) {
      const title = this.isDelete?"确定恢复吗":'确定删除吗'
      this.$confirm(title, this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          row.isDelete = this.isDelete == 0 ? 1 : 0;
          updateLiveList(row)
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
        status:this.search.status,
        type:this.search.type,
        isDelete: this.isDelete,
      };
      // 获取题目列表
      getLiveList(dataobj).then((res) => {
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