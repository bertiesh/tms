<template>
  <div class="index">
    <div class="side-title">
      <div>
            <i
            :class="[
              !isCollapse
                ? 'iconfont icon-shouqicaidan'
                : 'iconfont icon-zhankaicaidan',
            ]"
            @click="change"
          ></i>
          
          <img src="@/assets/login/logo.png" alt="" />
          <span slot="title">培训后台管理系统</span>
            </div>
          
         
        <div
          ><el-avatar :src="imageUrl"> </el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ name }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/info/index">{{
                  $t("navbar.userinfo")
                }}</router-link>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown></div
        >
    </div>
    <levelitem v-show="isCollapse" :menu="menu" :active="nowTagValue" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import levelitem from "./levelitem.vue";
// import { getDisplay } from "@/api/setup/user";
export default {
  name: "sidebar",
  components: { levelitem },
  data() {
    return {
      imageUrl: "",
      name: "",
      sideWidth: "200px",
    };
  },
  created() {
    this.onload();
    this.name = this.userInfo.username;

  },
  computed: {
    ...mapGetters(["menu", "isCollapse", "userInfo"]),
    nowTagValue: function () {
       
      // 获取当前菜单路由
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
  methods: {
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            this.$router.push({ path: "/login" });
          });
        })
        .catch(() => {});
    },
    change() {
      this.$store.commit("SET_COLLAPSE");
    },
    onload() {
      const loading = this.$loading({
            lock: true,
            text: "加载,请稍后。。。",
            spinner: "el-icon-loading",
            background:"rgba(0, 0, 0, 0.8)"
          });
      this.$store.dispatch("GetMenu").then((data) => {
        if (data.length === 0) return;
        // 动态添加路由
        this.$router.$avueRouter.formatRoutes(data, true,"l");
      });
          if (this.menu) {
            loading.close();
          }
    },
  },
};
</script>
<style lang='scss' scoped>
.index {
  .side-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    
div{
  display: flex;
    align-items: center;
    color: #aaaaaa;
    img {
      width: 35px;
      height: 35px;
      margin-right: 10px;
    }
    .iconfont {
    font-size: 24px;
    margin-right: 10px;
  }
  .el-avatar{
    margin-right: 5px;
  }
}
    }
  }
  

</style>