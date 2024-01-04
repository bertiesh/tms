<template>
  <div>
    <el-form :rules="loginRules" :model="loginForm" ref="loginForm" @keyup.enter.native="login()">
      <div class="title-container">
        <img src="@/assets/login/logo.png" alt="" />
        <p class="title">{{ website.title }}</p>
      </div>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          size="large"
          :placeholder="$t('login.username')"
        >
          <i slot="prefix" class="iconfont icon-dengluyonghuming"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          show-password
          :placeholder="$t('login.password')"
        >
          <i slot="prefix" class="iconfont icon-mima"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="verCode">
        <el-row :span="22">
          <el-col :span="14">
            <el-input
              size="small"
              v-model="loginForm.verCode"
              auto-complete="off"
              :placeholder="$t('login.code')"
            >
              <i slot="prefix" class="iconfont icon-yanzheng" />
            </el-input>
          </el-col>
          <!-- 验证码 -->
          <el-col :span="8">
            <div class="login-code">
              <img
              @click="onload"
              :src="image"
                class="login-code-img"
              />
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="hint">注意区分大小写</div>
      <div class="login-button">
        <el-button type="primary" @click="handleLogin">{{
          $t("login.submit")
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCaptcha,verifyCaptcha } from "@/api/user";
import {getToken} from '@/util/auth'
export default {
  name: "userlogin",
  components: { },
  data() {
    return {
      pass: "",
      loginForm: {
        //用户名
        username: "admin@qq.com",
        //密码
        password: "12qw@@",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, message: "密码长度最少为6位", trigger: "blur" },
        ],
        verCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
      image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    };
  },
  computed: {
    ...mapGetters(["website", "tagWel"]),
  },
  created() {
  },
  mounted() {
    this.onload()
  },
  methods: {
    // 登录
    handleLogin() {
      //   加载
       this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // $loading弹窗遮盖
          const loading = this.$loading({
            lock: true,
            text: "登录中,请稍后。。。",
            spinner: "el-icon-loading",
          });
          // 验证验证码
          const data ={
           checkCode: this.loginForm.verCode,
           captchaOwner:getToken('captchaOwner')
          }
          verifyCaptcha(data).then((res)=>{
 // 将表单信息发送post请求
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then((res) => {
              const role = res.data.data.roleList
              if (role.includes("admin")) {
                this.$router.$avueRouter.routerList=[];
               this.$router.resetRouter(this.$router)
                this.$router.push({ path: this.tagWel.value });
              }else{
 this.$message.error('你没有权限！');
              }
            })
            .catch((err) => {
              this.$message.error(err);
              loading.close();
            });
            loading.close();
          }).catch(err=>{
             this.$message.error(err);
loading.close(); 
          })
          
         
        }
      });
    },
    onload(){
getCaptcha().then((res)=>{
this.image = window.URL.createObjectURL(res.data)
})
    }
  },
};
</script>
<style lang='scss' scoped>
@import "@/assets/style/index/login.scss";
.hint{
  color: #E6A23C;
  font-size: 13px;
  width: 240px;
  margin: 0 auto;
}
</style>