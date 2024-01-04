<template>
  <div class="index">
    <el-container>
      <el-header>欢迎使用培训后台管理系统</el-header>
      <el-main><el-collapse v-model="activeNames">
          <el-collapse-item title="欢迎使用培训后台管理系统" name="1">
            <div>
              1.培训管理系统是针对用户对以诺康手术机器人的操作手册、注意事项的学习，以及用户之间的交流。
            </div>
            <div>
              2.主要模块为
              <span v-for="(item,index) in menu" :key="index">{{item.name}}，</span>
            </div>
          </el-collapse-item>
          <el-collapse-item v-for="(item,index) in menu" :key="index" :title="item.name" :name="item.name">
            <div v-for="(items,index) in item.children" :key="index" >
             {{items.name}}
            </div>
          </el-collapse-item>
        </el-collapse></el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      activeNames: ["1"],
    };
  },
  mounted() {},
   computed:{
...mapGetters(["menu"]),
  },
  methods: {},
};
</script>
<style lang='scss' scoped>
@import "@/assets/style/index/hometable.scss";
</style>