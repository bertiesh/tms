<template>
  <div class="index">
    <div class="side-title">
      <img src="@/assets/login/logo.png" alt="" />
      <span slot="title" v-show="!keyCollapse">培训后台管理系统</span>
    </div>
    <sideitem
      :collapse="keyCollapse"
      :menu="menu"
      :active="nowTagValue"
    ></sideitem>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Sideitem from "./sideitem.vue";
export default {
  name: "sidebar",
  components: { Sideitem },
  data() {
    return {
      sideWidth: "200px",
    };
  },
  created() {
    const loading = this.$loading({
            lock: true,
            text: "加载,请稍后。。。",
            spinner: "el-icon-loading",
            background:"rgba(0, 0, 0, 0.8)"
          });
          if (this.menu) {
            loading.close();
          }
  },
  computed: {
    ...mapGetters(["menu","keyCollapse"]),
    nowTagValue() {
      // 获取当前菜单路由
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
};
</script>
<style lang='scss' scoped>
.side-title {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 70px;
  color: #aaaaaa;
  padding: 0 10px;
  img {
    width: 35px;
    height: 35px;
  }
}
</style>