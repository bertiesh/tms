<template>
  <div class="index">
    <el-menu
      class="sidear_container"
      :collapse="collapse"
      :collapse-transition="true"
      :default-active="active"
      background-color="#333333"
      mode="vertical"
      text-color="#AAAAAA"
      :style="{ width: !collapse ? '200PX' : '60PX' }"
    >
      <template v-for="item in menu">
        <el-submenu :index="item.path" :key="item.name" v-if="!item.hidden">
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
              v-if="!items.hidden"
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
  name: "sideitem",
  components: {},
  data() {
    return {};
  },
  props: {
    menu: {
      type: Array,
    },
    active: {
      type: String,
    },
    collapse: {
      type: Boolean,
    },
  },
  mounted() {
  },
  methods: {
    open(item) {
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
::v-deep .el-menu {
  user-select: none;
  border-right: none;
}
.sidear_container {
  overflow-y: auto;
  height: calc(100% - 70px);
}

::v-deep.el-menu-item-group {
  .el-menu-item-group__title {
    padding: 0 !important;
  }
}

::-webkit-scrollbar {
  width: 5px;
  height: 0px;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:vertical {
  height: 1px;
  background-color: rgba(231, 225, 225, 0.342);
  border-radius: 5px;
}
.iconfont {
  margin-right: 5px;
}
</style>