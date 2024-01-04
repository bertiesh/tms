<template>
  <div class="home" >
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside :width="!keyCollapse?'200PX':'60PX'" v-show="isscreen">
        <verticalmenu/>
      </el-aside>
      <el-container>
        <!-- 上方导航栏 -->
        <el-header :style="{'height':!screen==0?'50px':'60px','background-color':!screen==0?'white':'#333333'}" v-show="!isFullScren">
          <top v-show="!screen==0"/>
          <levelmenu v-show="screen==0"/>
        </el-header>
        <!-- 标签 -->
        
        <el-header style="height: 40px;" v-show="isscreen">
<tags />
          
        </el-header>
        
        <!-- 主要部分 -->
        <el-main>
          <div @click="close" class="mainbox">
            <keep-alive>
            <router-view></router-view>
            </keep-alive>
          </div>
              
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import verticalmenu from "./sidebar/verticalmenu.vue";
import levelmenu from "./sidebar/levelmenu.vue";
import top from "./tops";
import tags from "./tags";
import admin from "@/util/admin";
import { mapGetters } from "vuex";
export default {
  name: "home",
  components: {
    verticalmenu,
    levelmenu,
    top,
    tags
  },
  data() {
    return {
      isscreen:true,
    };
  },
  
computed: mapGetters(["keyCollapse","screen","isFullScren","isCollapse"]),
  mounted() {
    this.init();
    // 
  },
  watch:{
    screen:{
      handler(n,o){
if (this.screen==0||this.isFullScren) {
  this.isscreen = false
}else{
  this.isscreen = true
}
      }
    },
       isFullScren:{
      handler(n,o){
if (n||this.screen==0) {
  this.isscreen = false
}else{
  this.isscreen = true
}
      }
      
    }
  },
  methods: {
    close(){
      if (this.isCollapse) {
        this.$store.commit("SET_COLLAPSE");
      }

    },
      init() {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
    
  },
};
</script>
<style lang='scss' scoped>
@import "../../assets/style/index/main.scss";
.tagsbox{
  background: red;
  width: 130px;
  overflow: auto;
}
</style>