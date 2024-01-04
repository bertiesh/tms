<template>
  <div class="menubox">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="vertical"
      background-color="#333333"
      text-color="#aaaaaa"
      active-text-color="#409EFF"
    >
      <template v-for="item in menu">
        <el-submenu :index="item.path" :key="item.name">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <el-menu-item-group
            v-for="(items, index) in item.children"
            :key="index"
          >
            <el-menu-item
              :index="items.path"
              :key="items.name"
              @click="open(items)"
            >
              <i :class="items.icon"></i>
              <span slot="title">{{ items.name }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "",
  components: {},
  props: {
    menu: {
      type: Array,
    },
    active: {
      type: String,
    },
  },
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
    };
  },
  methods: {
    open(item) {
      this.$store.commit("SET_COLLAPSE");
      const nowpath = this.$router.$avueRouter.getPath({
        name: item.name,
        src: item.path,
        i18n: (item.meta || {}).i18n,
      });
      if (nowpath == "/monitoring/grafana") {
        window.open("https://10.32.20.50:3001/dashboards?query=", "_blank");
      } else {
        this.$router.push({
          path: nowpath,
        });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.menubox {
  width: 100%;
  .el-menu {
    width: 100%;
    z-index: 400;
  }
}
.iconfont {
  margin-right: 5px;
}
</style>