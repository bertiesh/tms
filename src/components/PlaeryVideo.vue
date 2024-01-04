<template>
    <div id="player"></div>
</template>
<script>
import Player from 'xgplayer';
import 'xgplayer';
import HlsPlayer from 'xgplayer-hls.js';
export default {
  name: "",
  components: {},
   props: {
    // 判断是否为m3u8格式
    ishls:{
      type: Boolean,
      default: false
    },
    // 视频url
    url:{
      type: String,
      default: ''
    },
    // 画中画
    pip:{
      type: Boolean,
      default: true
    },
    // 是否直播
    isLive:{
      type: Boolean,
      default: false
    },
     // mini播放器
    miniplayer:{
      type: Boolean,
      default: false
    },
    // 语言
    lang:{
      type: String,
      default: 'zh-cn'
    },
    // 流式布局
    fluid:{
      type: Boolean,
      default: true
    },
    // 自动播放
    autoplay:{
      type: Boolean,
      default: false
    },
    // 循环播放
    loop:{
      type: Boolean,
      default: true
    },
    // 封面图
    poster:{
      type: String,
      default: ''
    },
    screenShot: {
      type: Object,
      default: ()=> ({
        saveImg: true,
    quality: 0.92,
    type: 'image/png',
    format: '.png'
      })
    },
    // 播放速度
    playbackRate: {
      type: Array,
      default: () => [0.5, 1.0, 1.5, 2.0]
    },
    },
  data() {
    return {
        player: null,
        config: {
            id: 'player',//元素id
    url: this.url,//视频地址 
    lang: this.lang,//设置中文
    pip: this.pip,//开启画中画 | 移动端无画中画模式
    isLive: this.isLive, //直播场景设置为true
    // 迷你播放器功能支持用户在浏览网页其它内容时继续以小窗的形式观看视频，同时可以拖拽改变小窗在页面中的fix位置。
    miniplayer: this.miniplayer,//是否开启迷你播放器
    fluid: this.fluid,//填满屏幕设置为流式布局
    autoplay: this.autoplay,//自动播放
    loop: this.loop,//循环播放
    poster: this.poster,//封面图
    videoInit: true,
    // 移动端重要配置
    // 对于9:16的视频友好
    cssFullscreen: true,
    // 截图
    screenShot:this.screenShot,
    playbackRate: this.playbackRate, //传入倍速可选数组
        }
    };
  },
  mounted() {
    this.onload();
  },
  beforeUpdate() {
    this.onload();
  },
   beforeDestroy() {
    this.player && typeof this.player.destroy === 'function' && this.player.destroy();
  },
  methods: {
    onload(){
if (this.url && this.url !== '') {
  if (this.ishls) {
      this.player = new HlsPlayer(this.config);
  }else{
    this.player = new Player(this.config);
   
  }
      }
    }
  },
};
</script>
<style lang='scss' scoped>
::v-deep.xgplayer-skin-default{
.xgplayer-controls .xgplayer-playbackrate .name{
  background: rgba(102, 51, 153, 0);
}
.xgplayer-controls .xgplayer-pip .name span{
  background: rgba(102, 51, 153, 0);
}
.xgplayer-controls .xgplayer-screenshot .name span{
  background: rgba(102, 51, 153, 0);
}
.xgplayer-controls .xgplayer-progress-played{
  background: #4086ff;
}
}
</style>
