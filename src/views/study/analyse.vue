<template>
    <div class="index">
<el-container>
      <!-- 搜索框 -->
      <el-header>
        <div class="olog-inpt">
            <span>试卷名：</span>{{projectname}}
        </div>
        <div class="olog-but">
          <el-tooltip
            v-if="showFullScren"
            effect="dark"
            :content="
              isFullScren ? $t('navbar.screenfullF') : $t('navbar.screenfull')
            "
            placement="bottom"
          >
            <i
              :class="
                isFullScren
                  ? 'iconfont icon-tuichuquanping'
                  : 'iconfont icon-quanping'
              "
              @click="fullScren"
            ></i>
          </el-tooltip>
        </div>
      </el-header>
      <el-main v-loading="loading">
        <div class="con"  v-if="analysedata.length">
         <div v-for="item in analysedata"
          :key="item.id" class="qs">
            <div class="qname">{{item.questionTitle}}--{{item.id}}</div>
            <div class="progress" v-if="item.analysisDTO.correctness!='NaN'"><span> 正确率：</span><el-progress :percentage="item.analysisDTO.correctness*100"></el-progress></div>
            <el-table
            v-if="item.analysisDTO.possibleAnswers"
    :data="item.analysisDTO.possibleAnswers"
    border
    style="width: 100%">
    <el-table-column
      label="选项"
      width="180">
      <template slot-scope="scope">
                {{scope.row}}
              </template>
    </el-table-column>
    <el-table-column
      label="百分比"
      >
      <template slot-scope="scope">
        <el-progress :percentage="item.analysisDTO.possibleAnswerList.find((item)=>Object.keys(item)[0]==scope.row)[scope.row]*100"></el-progress>
              </template>
    </el-table-column>
  </el-table>
  <div v-else><el-button type="text" @click="getresult(item.analysisDTO)">查看结果</el-button></div>
         </div>
        </div>
        <el-empty description="没有内容" v-else></el-empty>
      </el-main>
</el-container>
<el-dialog :visible.sync="dialogVisible">
      <el-table
    :data="rowdata"
    border
    style="width: 100%">
    <el-table-column
      label="内容"
      width="180"
      prop="value">
    </el-table-column>
    <el-table-column
      prop="num"
      label="人数"
      >
    </el-table-column>
  </el-table>
    </el-dialog>
    </div>
</template>

<script>
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
import { getProjectAnalyse ,getProjectById} from "@/api/study/project";
export default {
    name: '',
    components: {},
    data () {
    return {
        analysedata:[],
        projectname:'', 
        dialogVisible:false,
        rowdata:[],
        loading:true
    }
    },
     watch: {
    $route(to, from) {
      if (to.name=="用户分析") {
        this.onload();
      }
    },
  },
      computed: {
    ...mapGetters(["isFullScren", "userInfo", "showFullScren"]),
    ...mapState({
      showFullScren: (state) => state.common.showCollapse,
    }),
  },
    mounted () {
        this.onload()
    },
    methods: {
        getresult(item){
          if (item.submits==null||Object.keys(item.submits).length == 0) {
            this.$message.warning('此题暂无用户回答');
          }else{
            this.rowdata = []
          for (var key in item.submits) {
            this.rowdata.push({
              value:key,
              num:item.submits[key]
            })
          }
          this.dialogVisible = true
          }
          
        },
onload(){
this.projectname = this.$route.query.keyword
    getProjectAnalyse(this.$route.query.id).then((res)=>{
this.analysedata=res.data.data
this.analysedata.forEach(el => {
  el.analysisDTO.possibleAnswers= JSON.parse(el.analysisDTO.possibleAnswers)
});
this.loading=false
    })
},
// 全屏
    fullScren() {
      fullscreenToggel();
    },
    }
}
</script>
<style lang='scss' scoped>
@import "@/assets/style/index/hometable.scss";
.con{
   border: 1px solid #ccccdd; 
   min-height: calc(100% - 5px);
   padding: 5px;
   .qs{
    padding-bottom: 20px;
    .qname{
        margin: 10px 0;
        font-weight: 600;
    }
    .progress{
      .el-progress{
        width: 400px;
      }
display: flex;
padding: 10px 0;
color: #E6A23C;
    }
   }
}
</style>