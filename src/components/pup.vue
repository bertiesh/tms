<template>
  <div>
    <el-form ref="form" label-width="100px">
      <el-form-item label="头像："> </el-form-item>
      <el-form-item>
        <el-upload
          class="avatar-uploader"
          ref="upload"
          action="/api/users/avatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-change="filechange"
          :auto-upload="false"
          :data="filemsg"
        >
          <img v-if="imageUrl" :src="`/api/photos/display?photoPath=${imageUrl}`" class="avatar" fit="cover" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="uploaded">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "pup",
  components: {},
  data() {
    return {
      imageUrl: "",
      filemsg: {},
      isup: false,
    };
  },
  created() {
    this.getavatar();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 上传头像
    uploaded() {
      this.submitUpload();
    },
    // 发送
    submitUpload() {
      if (this.isup) {
        this.$refs.upload.submit();
      } else {
        this.$message({
          message: "请选择图片",
          type: "error",
        });
      }
    },
    // 文件状态改变
    filechange(file) {
      this.isup = !this.isup;
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 发送成功后
    handleAvatarSuccess(res, file) {
      this.$message({
        message: "上传成功",
        type: "success",
      });
      window.location.reload();
    },
    // 上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 加载头像
    async getavatar() {
      const userInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
      this.imageUrl = userInfo.userInfoDTO.avatar
    },
  },
};
</script>
<style lang='scss'>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>