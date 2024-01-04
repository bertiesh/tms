<template>
  <div class="index">
    <el-container>
      <el-main>
        <el-tabs type="card"  v-model="activeName" >
          <!-- 头像 -->
          <el-tab-pane label="修改头像">
                <pup></pup>
                
          </el-tab-pane>
          <!-- 个人信息 -->
          <el-tab-pane label="个人信息" name="个人信息">
            <el-form ref="form" :model="form" label-width="100px" size="small">
              <el-form-item label="姓名">
                <el-input v-model="form.nickname"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="handle(form)"
                  >提交</el-button
                >
                <el-button size="small" @click="clear">清空</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          
          <!-- 密码 -->
          <el-tab-pane label="修改密码">
            <el-form
              :model="password"
              status-icon
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
            >
              <el-form-item label="原密码：" prop="oldPassword">
                <el-input
                  v-model="password.oldPassword"
                  placeholder="请输入密码"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="newPassword">
                <el-input
                  v-model="password.newPassword"
                  autocomplete="off"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input
                  v-model="password.checkPass"
                  autocomplete="off"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="sumbitPass(password)"
                  >提交</el-button
                >
                <el-button @click="password={}">清空</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import {update, updatePassword } from "@/api/setup/users";
import { alertMessage } from "@/util/alert";
import pup from "@/components/pup.vue";
import { mapGetters } from "vuex";
import { validatepass } from "@/util/validate";
export default {
  name: "",
  components: {
    pup,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.password.oldPass==value) {
          callback(new Error("新密码不能与旧密码一样"));
        }else{
if(validatepass(value)){
        
        }else{
callback(new Error("密码必须包含数字、英文字母、特殊符号且6位以上"));
        }
        if (this.password.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
        }
        
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.password.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      activeName:'个人信息',
      form: {},
      fileup:false,
      username:"",
      newuserInfo:[],
      password: {
        oldPassword: "",
        newPassword: "",
        checkPass: "",
      },
      rules: {
        oldPassword: [{ required: true, message: "请输入密码", trigger: "blur" }],
        newPassword: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  created() {
    this.handleWitch();
  },
  mounted() {},
  computed: {
    ...mapGetters(["userInfo","website"]),
  },
  methods: {
    // 获取个人信息
   async handleWitch() {
      const userInfo = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
      this.form = userInfo.userInfoDTO;
    },
    // 确认修改
    handle(form) {
      update(form).then(
        (res) => {
          alertMessage(this, "success", "修改信息成功!");
          this.handleWitch();
        },
        (error) => {
          alertMessage(this, "error", "修改信息出错!");
        }
      );
    },
    // 清空选项
    clear() {
      this.form = {};
      this.form.username=this.username
    },

    // 修改密码
    sumbitPass(password) {

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          updatePassword(password).then(
            (res) => {
                alertMessage(this, "success", "密码修改成功!");
              setTimeout(() => {
                this.$store.dispatch("LogOut").then(() => {
                  this.$router.push({ path: "/login" });
                });
              }, 1000);
              
            },
            (error) => {
              alertMessage(this, "error", error);
            }
          );
        }
      });
    },

  },
};
</script>
<style lang='scss' scoped>
@import "@/assets/style/index/hometable.scss";
.el-tabs {
  text-align: left;
  .el-input {
    width: 300px;
  }
}
</style>
