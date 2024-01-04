<template>
  <div class="top">
    <div class="top-left">
      <i
        :class="[
          !isCollapse
            ? 'iconfont icon-shouqicaidan'
            : 'iconfont icon-zhankaicaidan',
        ]"
        style="margin-right: 20px"
        @click="change"
      ></i>
      <i class="iconfont icon-shouye" style="margin-right: 7px"></i>
      <router-link to="/wel/index">首页</router-link>
    </div>
    <div class="top-right">
      <el-tooltip v-if="true"
                  effect="dark"
                  :content="$t('navbar.lock')"
                  placement="bottom">
        <div class="top-bar__item">
        </div>
      </el-tooltip>
      
      <el-image :src="`/api/photos/display?photoPath=${imageUrl}`" fit="cover"> </el-image>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="info">
             {{$t("navbar.userinfo")}}
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import {listenfullscreen } from "@/util/util";
import { mapGetters } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      imageUrl: "",
      name: "",
    };
  },
  created() {
    this.getavatar();
    
  },
  mounted() {
    
    listenfullscreen(this.setScreen);
  },
  computed: { ...mapGetters(["isCollapse","userInfo"]) },
  methods: {
    setScreen() {
      this.$store.commit("SET_FULLSCREN");
    },
    change() {
      this.$store.commit("SET_COLLAPSE");
    },
    // 个人信息
    info(){
      this.$router.push({ path: "/info/index" });
    },
    // 退出登录
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
    // 加载头像
    async getavatar() {
      const user = await this.$store.dispatch(
        "GetUserInfo",
        this.userInfo.userInfoId
      );
      this.imageUrl = user.userInfoDTO.avatar
      this.name = user.userInfoDTO.nickname;
    },
  },
};
</script>
<style lang='scss' scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .top-left {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .top-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-image{
      width: 35px;
      height: 35px;
      border-radius: 25px;
    }
  }
}
.el-dropdown {
  float: right;
  cursor: pointer;
  margin-left: 8px;
}

.router-link-exact-active {
  color: #409eff;
}
.el-avatar{
  margin-left: 8px;
}
.iconfont{
    font-size: 24px;
    
  }
  .icon-shouye{
      font-size: 16px;
    }
  .top-bar__item{
    margin-right: 10px;
  }
</style>