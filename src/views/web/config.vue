<template>
  <div class="index">
    <el-container>
      <el-main>
        <template>
          <!-- 表格 -->
          <el-descriptions title="配置信息" :column="2" border>
            <template slot="extra">
              <el-button
                type="primary"
                size="small"
                @click.native.prevent="userUpdate(tableData)"
                >编辑</el-button
              >
            </template>
            <el-descriptions-item label="网站logo">
              <el-image
                style="cursor: pointer; width: 100px"
                lazy
                v-if="tableData.websiteAvatar"
                :src="`/api/photos/display?photoPath=${tableData.websiteAvatar}`"
                fit="cover"
                @click="magnify(tableData.websiteAvatar)"
              ></el-image>
            </el-descriptions-item>
            <el-descriptions-item label="网站名字">{{
              tableData.websiteName
            }}</el-descriptions-item>
            <el-descriptions-item label="网站作者">{{
              tableData.websiteAuthor
            }}</el-descriptions-item>
            <el-descriptions-item label="网站介绍"
              >{{ tableData.websiteIntro }}
            </el-descriptions-item>
            <el-descriptions-item label="网站注意事项">{{
              tableData.websiteNotice
            }}</el-descriptions-item>
            <el-descriptions-item label="网站创建时间">{{
              tableData.websiteCreateTime
            }}</el-descriptions-item>
            <el-descriptions-item label="网站备案号">{{
              tableData.websiteRecordNo
            }}</el-descriptions-item>
            <el-descriptions-item label="GitHub">{{
              tableData.github
            }}</el-descriptions-item>
            <el-descriptions-item label="Gitee">{{
              tableData.gitee
            }}</el-descriptions-item>
            <el-descriptions-item label="默认密码">{{
              tableData.defaultPassword
            }}</el-descriptions-item>

            <el-descriptions-item label="用户默认头像">
              <el-image
                style="cursor: pointer; width: 100px"
                lazy
                v-if="tableData.userAvatar"
                :src="`/api/photos/display?photoPath=${tableData.userAvatar}`"
                fit="cover"
                @click="magnify(tableData.userAvatar)"
              ></el-image>
            </el-descriptions-item>
            <el-descriptions-item label="默认封面">
              <el-image
                style="cursor: pointer; width: 100px"
                lazy
                v-if="tableData.articleCover"
                :src="`/api/photos/display?photoPath=${tableData.articleCover}`"
                fit="cover"
                @click="magnify(tableData.articleCover)"
              ></el-image>
            </el-descriptions-item>
            <el-descriptions-item label="网站问卷"
              >{{defaultSurvey}}</el-descriptions-item
            >
            <el-descriptions-item label="是否审核评论">{{
              tableData.isChatRoom ? "是" : "否"
            }}</el-descriptions-item>
            <el-descriptions-item label="是否发邮件通知">{{
              tableData.isChatRoom ? "是" : "否"
            }}</el-descriptions-item>
            <el-descriptions-item label="是否开启聊天功能">{{
              tableData.isChatRoom ? "是" : "否"
            }}</el-descriptions-item>
            <el-descriptions-item label="聊天功能url">{{
              tableData.websocketUrl
            }}</el-descriptions-item>
            <el-descriptions-item label="是否开启网站媒体功能">{{
              tableData.isMusicPlayer ? "是" : "否"
            }}</el-descriptions-item>
          </el-descriptions>
        </template>
        <!-- 弹出框（编辑 添加） -->
        <el-dialog title="编辑" :visible.sync="userform">
          <el-form
            :model="rowdata"
            :rules="formrules"
            label-width="100px"
            :inline="true"
            size="small"
            ref="userform"
          >
            <el-form-item label="网站logo" prop="websiteAvatar">
              <el-upload
                class="upload-demo"
                action="/api/admin/config/images"
                list-type="picture"
                multiple
                :file-list="websiteAvatarfile"
                :on-success="handlewebsiteAvatarSuccess"
              >
                <el-button>选择图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="网站名字" prop="websiteName">
              <el-input
                v-model="rowdata.websiteName"
                placeholder="请输入答案"
              ></el-input>
            </el-form-item>
            <el-form-item label="网站作者" prop="websiteAuthor">
              <el-input
                v-model="rowdata.websiteAuthor"
                placeholder="请输入问题分类"
              ></el-input>
            </el-form-item>
            <el-form-item label="网站介绍" prop="websiteIntro">
              <el-input
                v-model="rowdata.websiteIntro"
                placeholder="请输入问题目的"
              ></el-input>
            </el-form-item>
            <el-form-item label="注意事项" prop="websiteNotice">
              <el-input
                v-model="rowdata.websiteNotice"
                placeholder="请输入问题目的"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="websiteCreateTime">
              <el-date-picker
                style="width: 100%"
                v-model="rowdata.websiteCreateTime"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="网站备案号" prop="websiteRecordNo">
              <el-input
                v-model="rowdata.websiteRecordNo"
                placeholder="请输入问题目的"
              ></el-input>
            </el-form-item>
            <el-form-item label="GitHub" prop="github">
              <el-input
                v-model="rowdata.github"
                placeholder="请输入问题目的"
              ></el-input>
            </el-form-item>
            <el-form-item label="Gitee" prop="gitee">
              <el-input
                v-model="rowdata.gitee"
                placeholder="请输入问题目的"
              ></el-input>
            </el-form-item>
            <el-form-item label="默认密码">
              <el-input
                v-model="rowdata.defaultPassword"
                placeholder="请输入默认密码"
              ></el-input>
            </el-form-item>
            <el-form-item label="用户默认头像" prop="userAvatar">
              <el-upload
                class="upload-demo"
                action="/api/admin/config/images"
                list-type="picture"
                multiple
                :file-list="userAvatarfile"
                :on-success="handleuserAvatarSuccess"
              >
                <el-button>选择图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="默认封面" prop="articleCover">
              <el-upload
                class="upload-demo"
                action="/api/admin/config/images"
                list-type="picture"
                multiple
                :file-list="articleCoverfile"
                :on-success="handlearticleAvatarSuccess"
              >
                <el-button>选择图片</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="网站问卷">
              <el-select v-model="rowdata.defaultSurvey" placeholder="请选择" multiple style="width: 100%;">
    <el-option
      v-for="item in projectdata"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select> </el-form-item
            >
            <el-form-item label="审核评论" prop="isCommentReview">
              <el-radio-group
                v-model="rowdata.isCommentReview"
                style="width: 200px"
              >
                <el-radio :label="1">审核</el-radio>
                <el-radio :label="0">不审核</el-radio>
              </el-radio-group> </el-form-item
            ><el-form-item label="邮件通知" prop="isEmailNotice">
              <el-radio-group
                v-model="rowdata.isEmailNotice"
                style="width: 200px"
              >
                <el-radio :label="1">通知</el-radio>
                <el-radio :label="0">不通知</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="聊天功能" prop="isChatRoom">
              <el-radio-group v-model="rowdata.isChatRoom" style="width: 200px">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">不开启</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="聊天url"
              prop="websocketUrl"
              v-show="rowdata.isChatRoom"
            >
              <el-input
                v-model="rowdata.websocketUrl"
                placeholder="请输入问题目的"
              ></el-input>
            </el-form-item>
            <el-form-item label="媒体功能" prop="isMusicPlayer">
              <el-radio-group
                v-model="rowdata.isMusicPlayer"
                style="width: 200px"
              >
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">不开启</el-radio>
              </el-radio-group>
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
import { getProjectById,getProjectsList } from "@/api/study/project";
import { getConfitList, updateConfitList } from "@/api/web/config";
import { alertMessage } from "@/util/alert";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      userform: false,
      rowdata: {}, //查看字段
      tableData: {}, //表格数据
      dialogVisible: false, //大图片弹窗
      imgrul: "", //图片地址（放大后）
      projectdata: [],
      defaultSurvey:[],
      websiteAvatarfile: [],
      articleCoverfile: [],
      userAvatarfile: [],
      formrules: {
        linkName: [
          { required: true, message: "请输入链接标题", trigger: "blur" },
        ],
        linkIntro: [
          { required: true, message: "请输入链接介绍", trigger: "blur" },
        ],
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
    magnify(url) {
      this.imgrul = url;
      this.dialogVisible = true;
    },
    handle(res, file, fileList, tilte) {
      if (res.code == 510) {
        file.status = "error";
        alertMessage(this, "error", file.name + "上传服务器失败请重新上传");
      } else {
        alertMessage(this, "success", file.name + "上传服务器成功");
        this[tilte] = [fileList[1]];
        // const
        this.rowdata[tilte.split("file")[0]] = res.data;
      }
    },
    handlewebsiteAvatarSuccess(res, file, fileList) {
      this.handle(res, file, fileList, "websiteAvatarfile");
    },
    handleuserAvatarSuccess(res, file, fileList) {
      this.handle(res, file, fileList, "userAvatarfile");
    },
    handlearticleAvatarSuccess(res, file, fileList) {
      this.handle(res, file, fileList, "articleCoverfile");
    },
    // 编辑用户信息
    userUpdate(item) {
      this.rowdata = item;
      this.websiteAvatarfile = [
        {
          url: `/api/photos/display?photoPath=${item.websiteAvatar}`,
          name: item.websiteAvatar,
        },
      ];
      this.articleCoverfile = [
        {
          name: item.articleCover,
          url: `/api/photos/display?photoPath=${item.articleCover}`,
        },
      ];
      this.userAvatarfile = [
        {
          name: item.userAvatar,
          url: `/api/photos/display?photoPath=${item.articleCover}`,
        },
      ];
      this.userform = true;
      this.$nextTick(() => {
        this.$refs["userform"].clearValidate();
      });
    },
    // 确定选框
    send(data) {
      this.$refs.userform.validate((valid) => {
        if (valid) {
          updateConfitList(data)
            .then((res) => {
              alertMessage(this, "success", "编辑操作成功");
              this.onLoad();
            })
            .catch((err) => {
              alertMessage(this, "error", err);
            });
          this.userform = false;
        }
      });
    },
    // 获取题目列表
    async getArticle() {
      // 获取题目列表
      const res = await getConfitList();
      this.tableData = res.data.data;
const dataobj = {
        status: 1,
      };
      // 获取题目列表
      getProjectsList(dataobj).then((res) => {
        const data = res.data.data;
        this.projectdata = data.recordList;
        this.tableData.defaultSurvey.forEach(el => {
         const list= this.projectdata.filter((items)=>items.id==el)
         this.defaultSurvey.push(list[0].name)
        });
 
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
  :deep(.upload-demo) {
    align-items: center;
    display: flex;
  }
}
.linka:hover {
  color: #409eff;
}
.el-dialog {
  .el-form {
    display: flex;
    flex-direction: column;
    :deep(.el-form-item__content) {
      width: 80%;
    }
    :deep(.el-upload-list--picture .el-upload-list__item) {
      img {
        object-fit: cover;
      }
    }
  }
}
</style>