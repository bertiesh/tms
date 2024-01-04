<template>
  <div class="index">
    <el-container>
      <el-main>
        <p class="annotation">注：带<i class="el-icon-star-on" style="color:red"></i>标签可点击查看详细信息</p>
        <el-row :gutter="20">
  <el-col :span="6"><div @click="opentable(false)">
          <el-statistic :value="tableData.viewsCount" title="浏览人数">
          </el-statistic>
        </div></el-col>
  <el-col :span="6"><div @click="opentable(false)">
          <el-statistic :value="tableData.userCount" title="用户量">
          </el-statistic>
        </div></el-col>
  <el-col :span="6"><div @click="opentable(false)">
          <el-statistic :value="tableData.articleCount" title="文章总数">
          </el-statistic>
        </div></el-col>
  <el-col :span="6"><div @click="opentable(tableData.categoryDTOList,'文章类别')">
          <el-statistic :style="{background:tabletitle=='文章类别'?'rgba(240, 240, 240, 0.753)':''}" :value="tableData.classnum
" title="文章类别">
            <template slot="suffix">
              <i class="el-icon-star-on" style="color:red"></i>
            </template>
          </el-statistic>
        </div></el-col>
</el-row>
 <el-row :gutter="20">
  <el-col :span="6"><div @click="opentable(tableData.tagDTOList,'标签数量')">
          <el-statistic :style="{background:tabletitle=='标签数量'?'rgba(240, 240, 240, 0.753)':''}" :value="tableData.tagnum" title="标签数量">
            <template slot="suffix">
                <i class="el-icon-star-on" style="color:red"></i>
            </template>
          </el-statistic>
        </div></el-col>
  <el-col :span="6"><div @click="opentable(tableData.articleStatisticsList,'近3天发表量')">
          <el-statistic :style="{background:tabletitle=='近3天发表量'?'rgba(240, 240, 240, 0.753)':''}" title="近3天发表量">
            <template slot="suffix">
                <i class="el-icon-star-on" style="color:red"></i>
            </template>
          </el-statistic>
        </div></el-col>
  <el-col :span="6"><div  @click="opentable(tableData.uniqueViewDTOList,'近5天浏览量')" >
          <el-statistic :style="{background:tabletitle=='近5天浏览量'?'rgba(240, 240, 240, 0.753)':''}" title="近5天浏览量">
            <template slot="suffix">
               <i class="el-icon-star-on" style="color:red"></i>
            </template>
          </el-statistic>
        </div></el-col>
  <el-col :span="6"><div @click="opentable(tableData.articleRankDTOList,'最热文章')">
          <el-statistic :style="{background:tabletitle=='最热文章'?'rgba(240, 240, 240, 0.753)':''}" title="最热文章" >
            <template slot="suffix">
              <i class="el-icon-star-on" style="color:red"></i>
            </template>
          </el-statistic>
        </div></el-col>
</el-row>
 <el-row :gutter="20">
  <el-col :span="6"><div @click="opentable('lineuser','在线用户')">
          <el-statistic :style="{background:tabletitle=='在线用户'?'rgba(240, 240, 240, 0.753)':''}"  title="在线用户">
            <template slot="suffix">
                <i class="el-icon-star-on" style="color:red"></i>
            </template>
          </el-statistic>
        </div></el-col>
  <el-col :span="6"><div @click="opentable('area','区域分析')">
          <el-statistic :style="{background:tabletitle=='区域分析'?'rgba(240, 240, 240, 0.753)':''}" title="区域分析">
            <template slot="suffix">
                <i class="el-icon-star-on" style="color:red"></i>
            </template>
          </el-statistic>
        </div></el-col>
</el-row>
<div class="search" v-if="tabletitle=='在线用户'">
        <div class="olog-inpt">
          <span>用户名称：</span>
          <el-input
            placeholder="请输入题目"
            v-model="keywords"
            size="small"
            clearable
          >
          </el-input>
        </div>
        <div class="olog-but">
          <el-button
            type="primary"
            icon="iconfont icon-sousuo"
            @click="searchbtn(keywords)"
            >搜索</el-button
          >
          <el-button type="primary" icon="iconfont icon-shuaxin" @click="reset"
            >刷新</el-button
          >
        </div>
      </div>
 <el-table
v-if="tabletitle!='区域分析'"
    ref="articletable"
            :data="tablelist"
            :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center', padding: '8px' }">
    <el-table-column
      :label="tabletitle">
      <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column
      v-if="tabletitle=='文章类别'"
      property="categoryName"
      label="类别名称">
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='文章类别'"
      property="articleCount"
      label="引用数量">
    </el-table-column>
<el-table-column
      v-if="tabletitle=='标签数量'"
      property="tagName"
      label="标签名称">
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='近3天发表量'"
      property="count"
      label="浏览量">
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='近3天发表量'"
      property="date"
      label="日期">
    </el-table-column>
    
    <el-table-column
    v-if="tabletitle=='近5天浏览量'"
      property="viewsCount"
      label="浏览量">
    </el-table-column>
     <el-table-column
    v-if="tabletitle=='近5天浏览量'"
      property="day"
      label="日期">
    </el-table-column>
    
    <el-table-column
    v-if="tabletitle=='最热文章'"
      property="articleTitle"
      label="文章标题">
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='最热文章'"
      property="viewsCount"
      label="浏览量">
    </el-table-column>

    <el-table-column
    v-if="tabletitle=='在线用户'"
      property="nickname"
      label="用户名称">
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='在线用户'"
      label="用户头像">
      <template slot-scope="scope">
                <el-image
                v-if="scope.row.avatar"
                  style="cursor: pointer"
                  lazy
                  :src="`/api/photos/display?photoPath=${scope.row.avatar}`"
                  fit="cover"
                ></el-image>
              </template>
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='在线用户'"
      property="ipAddress"
      label="ip地址">
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='在线用户'"
      property="ipSource"
      label="ip网络">
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='在线用户'"
      property="os"
      label="操作系统">
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='在线用户'"
      label="操作">
       <template slot-scope="scope">
                <el-button
                  type="text"
                  @click.native.prevent="unline(scope.row)"
                  >强制下线</el-button
                ></template>
    </el-table-column>
    <el-table-column
    v-if="tabletitle=='在线用户'"
      property="lastLoginTime"
      label="登录时间">
    </el-table-column>
    </el-table-column>
    
  </el-table>
  <el-pagination
  v-if="tabletitle=='在线用户'"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
  <div class="echart" v-show="tabletitle=='区域分析'">
    <div ref="pie" class="pie"></div>
<div ref="line" class="line"></div>
  </div>
  
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getStatisticsList,getOnLineUser,getUserArea,unLineUser } from "@/api/web/statistics";
import * as echarts from "echarts";
import { fullscreenToggel } from "@/util/util";
import { mapGetters, mapState } from "vuex";
export default {
  name: "",
  components: {},
  data() {
    return {
      tableData: {}, //表格数据
      like:true,
      tablelist:[],
      tabletitle:'',
      userdata:[],
      current:1,
        size:10,
        total:0,
        keywords:'',
      piedata: [],
      linedata:[],
      // 视图
       chartPie: null,
       chartLine: null,
    }
  },
  created() {
    this.onLoad();
  },
  computed: {
    ...mapGetters(["isFullScren", "userInfo", "showFullScren"]),
    ...mapState({
      showFullScren: (state) => state.common.showCollapse,
    }),
    // 饼图配置
    optionPie() {
      return {
        title: {
          text: `用户区域分析饼图`,
          left: "center",
          subtext: '区域分析',
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "bottom",
        },
        series: [
          {
            type: "pie",
            radius: "70%",
            data: this.piedata,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    },
    // 折线图
    optionLine() {
       return {
        title: {
          text: "手术时间段分布图",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
          grid: {
    left: '4%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
        xAxis:{ 
    type: 'category',
    data: this.linedata[0]
  },
        yAxis: {
          type: "value",
        },
        series:  {
      data: this.linedata[1],
      type: 'line'
    },
      };
    },
  },
  methods: {
    // 切换标签
    opentable(data,title){
      if (!data) {
        this.$message({
          message: '没有这种选项哦！',
          type: 'warning'
        });
      }else{
        this.tabletitle = title;
        if (typeof data=='string') {
this.tablelist =this.userdata
        }else{
          
this.tablelist = data
        }

      }
    },
    // 饼图
    showPie() {
      if (this.chartPie) this.chartPie.dispose();
      this.chartPie = echarts.init(this.$refs.pie);
      this.chartPie.setOption(this.optionPie);
    },
    // 折线图
    showLine() {
      if (this.chartLine)this.chartLine.dispose();
      this.chartLine = echarts.init(this.$refs.line);
      this.chartLine.setOption(this.optionLine);
      // 图表随着窗口大小自适应调整的时候
      // 是调整窗口大小加载事件，当触发时就调用的处理函数
      window.onresize = ()=> {
        this.chartPie.resize();
        this.chartLine.resize();
	    }
    },
    // 一页几条
    handleSizeChange(val) {
      this.pagesize = val;
      this.getArticle();
    },
    // 第几页
    handleCurrentChange(val) {
      this.current = val;
      this.getArticle();
      
    },
    searchbtn(){
      this.getArticle();
    },
    reset(){
      this.current=1;
      this.size=10;
      this.keywords =''
      this.getArticle();
    },
    // 强制下线
    unline(value){
unLineUser(value.userInfoId).then((res) => {
  this.getArticle();
  this.$message.success(`用户${value.nickname}强制下线成功`)
})
    },
    // 获取题目列表
    getArticle() {
      const data ={
        current:this.current,
        size:this.size,
        keywords:this.keywords
      }
      getOnLineUser(data).then((res) => {
  this.userdata = res.data.data.recordList;
  this.total = res.data.data.count
  this.opentable('lineuser','在线用户')
})
    },
    // 进入加载
    onLoad() {
        this.getArticle();
        getStatisticsList().then((res) => {
        const data = res.data.data;
        this.tableData = data;
        this.tableData.classnum = data.categoryDTOList.length
        this.tableData.tagnum = data.tagDTOList.length
        this.tabletitle = '文章类别',
        this.tablelist = data.categoryDTOList
      });
getUserArea().then((res) => {
  this.piedata = res.data.data
  this.showPie();
  this.linedata=[[],[]]
  this.piedata.forEach(el => {
    this.linedata[0].push(el.name);
    this.linedata[1].push(el.value);
  });
  this.linedata={...this.linedata}
  this.showLine()
})
    },
    // 全屏
    fullScren() {
      fullscreenToggel();
    },
  },
};
</script>
<style lang='scss' scoped>
@import "@/assets/style/index/hometable.scss";
.annotation{
margin-bottom: 20px;
}
.search{
  width: 100%;
  display: flex;
  align-items: center;
    justify-content: space-between;
    padding: 20px 0;
  .olog-inpt{
    display: flex;
    align-items: center;
    span{
      width: 110px;
    }
  }
}
.el-row{
    margin-bottom: 10px;
    .el-statistic{
        padding: 20px 0;
        border: 1px solid rgb(219, 219, 219);
        border-radius: 5px;
        cursor: pointer;
    }
    .el-statistic:hover{
      background: rgba(240, 240, 240, 0.753);
    }
}
.echart{
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
.pie{
  width: 400px;
  height: 400px;
}
.line{
  width: 600px;
  height: 400px;
}
}

</style>