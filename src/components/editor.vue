<template>
    <div>
  <mavon-editor
      v-model="content"
      ref="md"
      @change="change"
      @save="save"
      @imgAdd="$imgAdd"
      @imgDel="$imgDel"
    />
    </div>
</template>

<script>
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { uploadPicture } from "@/api/study/questionnaire";
export default {
    name: '',
    components: {mavonEditor},
    props: {
    mdcontent: {
      type: String,
      default: () => {
        return '';
      },
    },
    },
    data () {
     const TurndownService = require("turndown").default;
    return {
      turndownService:new TurndownService(),
       content: '', // 输入的markdown
    }
    },
    mounted () {
    this.onload()
    },
    methods: {
        change(value, render) {
      this.$emit('getrender', render);
    },
      // 保存文档
    save(){
this.$notify({
          message: '本地保存成功',
          type: 'success'
        });
    },
    // 上传图片
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      uploadPicture($file).then((res) => {
        const url = "/api/photos/display?photoPath="+res.data.data;
        this.$refs.md.$img2Url(pos, url);
      });
    },
    // 删除图片
    $imgDel(pos) {
      delete this.img_file[pos];
    },
    onload(){
     this.content = this.turndownService.turndown(this.mdcontent)   
    },
    }
}
</script>
<style lang='scss' scoped>
</style>