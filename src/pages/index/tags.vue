<template>
  <div class="tag">
  <div class="tabs">
    <el-tabs v-model="active" @edit="handleTabsEdit"  @tab-click="openTag">
  <el-tab-pane
    :key="item.value"
    v-for="(item) in tagList"
    :label="item.label"
    :name="item.value"
    :closable="item.label!=='首页'"
  >
  </el-tab-pane>
</el-tabs>
  </div>
  <div class="btn">
    <el-dropdown>
  <el-button type="primary" size="mini">
    更多
    <i class="el-icon-arrow-down el-icon--right"></i>
  </el-button>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item @click.native="closeAllTags">关闭所有</el-dropdown-item>
    <el-dropdown-item @click.native="closeOthersTags">关闭其他</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
  </div>
    

  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "tags",
  components: {},
  data() {
    return {
        active: "/wel/index",
      }
    
  },
   watch: {
    tag() {
      this.setActive();
    },
  },
  computed:{
     ...mapGetters(["tagWel", "tagList", "tag", "website"]),
     tagLen() {
      return this.tagList.length || 0;
    }
  },
  mounted() {
    this.setActive();
  },
  methods: {
    //激活当前选项
    setActive() {
      this.active = this.tag.value;
    },
      handleTabsEdit(value, action) {
       if (action === "remove") {
        let { tag, key } = this.findTag(value);
        this.$store.commit("DEL_TAG", tag);
        if (tag.value === this.tag.value) {
          tag = this.tagList[key === 0 ? key : key - 1]; //如果关闭本标签让前推一个
          this.openTag(tag);
        }
      }
      },
      findTag(value) {
      let tag, key;
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item;
          key = index;
        }
      });
      return { tag: tag, key: key };
    },
    closeOthersTags() {
      this.contextmenuFlag = false;
      this.$store.commit("DEL_TAG_OTHER");
    },
    closeAllTags() {
      this.contextmenuFlag = false;
      this.$store.commit("DEL_ALL_TAG");
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          src: this.tagWel.value
        }),
        query: this.tagWel.query
      });
    },
     openTag(item) {
      let tag;
      if (item.name) {
        tag = this.findTag(item.name).tag;
      } else {
        tag = item;
      }
      this.$router.push({
        path:tag.value,
      });
    },
  }
};
</script>
<style lang='scss' scoped>
::v-deep.tag{
    display: flex;
    justify-content:space-between;
    align-items:center;
.tabs{
  max-width: calc(100% - 110px);
}
.el-tabs__header{
  margin: 0;
  user-select:none; 
}
.el-tabs__nav-wrap::after{
    background-color: rgba(189, 32, 32, 0);
}
.el-tabs__item {
    box-shadow: none !important;
  }
}

</style>