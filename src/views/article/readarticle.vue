<template>
    <div class="box">
<h3 class="title">
{{article.articleTitle}} <span v-if="article.isDelete==1">违规或删除文章</span>
</h3>
<p class="type">文章类型：{{article.type}}</p>
<p class="type">文章作者：{{author.nickname}}</p>
<p class="type">作者邮箱：{{author.email}}</p>
 <el-image
 v-if="article.articleCover"
      :src="`/api/photos/display?photoPath=${article.articleCover}`"
       style="width: 95%; height: 300px"
      fit="cover" lazy></el-image>
<div class="body" v-html="article.articleContent">
</div>
<div class="bottom">
    <div class="status">文章状态：{{article.status==1?'公开':''}}
        {{article.status==2?'草稿箱':''}}
        {{article.status==3?'评论可见':''}}
        <span v-if="article.status==1">
            {{article.isReview==1?'文章待审核':''}}
        {{article.isReview==2?'文章审核未通过':''}}
        {{article.isReview==3?'文章审核通过':''}}
        </span>
        
    </div>
<el-button slot="reference" size="small" type="primary" @click="check(3)" v-if="article.isReview==1&&article.status==1">审核通过</el-button>
<el-button slot="reference" size="small" type="danger" @click="check(2)" v-if="article.isReview==1&&article.status==1">审核不通过</el-button>
     <el-button type="danger" size="small" @click="nopass(article.id)" v-if="article.isDelete==0">判定违规</el-button>
     <el-button type="primary" size="small" @click="pass(article.id)" v-if="article.isDelete==1">申诉成功</el-button>
</div>
    </div>
</template>

<script>
import { getArticleById,checkArticle,disableArticle } from "@/api/article/userarticle";
export default {
    name: '',
    components: {},
    data () {
    return {
        article:{},//用户文章
        id:"",
        author:{},//文章作者
    }
    },
    mounted () {
        this.onload()
    },
    watch: {
    $route(to, from) {
      if (to.query.id != from.query.id) this.onload();
    },
  },
    methods: {
        // 审核文章
        check(review){
                const data ={
    id:this.$route.query.id,
    isReview:review
            }
this.$confirm('确定要通过审核吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
checkArticle(data).then((res)=>{
     this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.onload()
})
}).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        // 违规文章
        nopass(id){
            this.$confirm('确定要判为违规文章吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const data = {
        idList: [id],
        isDelete:1,
      };
      disableArticle(data).then((res) => {
        this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.onload()
      });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

        },
        // 申诉成功
        pass(id) {
      const data = {
        idList: [id],
        isDelete:0,
      };
      disableArticle(data).then((res) => {
        this.$message.success("申诉成功!");
        this.onload()
      });
    },
        // 加载文章
        onload(){
            if (this.$route.query.id) {
                getArticleById(this.$route.query.id).then((res)=>{
    
    this.article = res.data.data
switch(this.article.type)
{
    case 1:
        this.article.type="原创"
        break;
    case 2:
        this.article.type="转载"
        break;
         case 3:
        this.article.type="翻译"
        break;

}

})
this.$store.dispatch(
        "GetUserInfo",
        this.$route.query.userId
      ).then((res)=>{
        this.author = res.userInfoDTO
      });
            }

        }
    }
}
</script>
<style lang='scss' scoped>
.box{
    background: white;
    min-height: 100%;
    padding: 10px;
    text-align: center;
    .title{
padding: 20px;
font-size: 26px;
text-align: left;
span{
    color: #f56c6c;
}
    }
    .type{
text-align: left;
padding-bottom: 20px;
padding-left: 20px;
color: rgb(78, 78, 78);
    }
    .body{
        text-align: left;
        padding: 20px;
        :deep(img){
            width: 80%;
        }
    }
    .bottom{
        text-align: right;
        border-top: 1px solid #e4e6eb;
        padding: 20px;
        :deep(.check){
            margin-bottom: 20px;
        }
        .status{
            padding: 15px 0;
        }
        .el-button{
            margin-left: 20px;
        }
    }
}
</style>