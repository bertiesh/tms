<template>
  <div class="box">
    <div class="savebtn">
      <el-button size="small" type="primary">返回列表</el-button>
      <div>
        <el-button size="small" type="success" plain @click="dialogVisible=true"
          >添加逻辑</el-button
        >
        <el-button size="small" type="success" @click="drawer = true" plain
          >问卷设置</el-button
        >
      </div>
    </div>
    <div class="con1">
      <div class="left-box">
        <p class="title">题型</p>
        <ul>
          <li>
            <span @click="addquestion(1)">单选题</span>
            <span @click="addquestion(2)">多选题</span>
          </li>
          <li>
            <span @click="addquestion(3)">填空题</span>
            <span @click="addquestion(5)">下拉选框</span>
          </li>
          <li>
            <span @click="addquestion(8)">文件上传</span>
            <span @click="addquestion(7)">评分题</span>
          </li>
          <li><span @click="addquestion(4)">问答题</span></li>
        </ul>
        <p class="title">个人信息</p>
        <ul>
          <li>
            <span @click="addquestion(4, 'name')">姓名</span>
            <span @click="addquestion(1, 'sex')">性别</span>
          </li>
          <li><span @click="addquestion(1, 'age')">年龄</span></li>
        </ul>
        <el-button size="medium" @click="dialogTableVisible=true">问题模板</el-button>
      </div>
      <div class="right-box" >
        <!-- 标题 -->
        <h1 v-show="!isredact" class="title" @click="isredact = true">
          {{ projectdata.name }}
        </h1>
        <div class="titleInput" v-show="isredact">
          <el-input
            size="small"
            placeholder="请输入内容"
            v-model="projectdata.name"
          ></el-input>
          <el-button size="small" type="success" @click="isredact = false" plain
            >确定</el-button
          ><el-button size="small" type="danger" plain @click="isredact = true">取消</el-button>
        </div>
        <selectoption
          style="margin: 10px 0"
          v-for="item in questiondata"
          :key="item.id"
          :question="item"
          :articletag="articletag"
          @change="getvalue"
          @deleteitem="deleteitem"
        />
      </div>
    </div>
    <!-- 项目设置 -->
    <el-drawer
      title="项目设置"
      :close-on-press-escape="false"
      :visible.sync="drawer"
      custom-class="demo-drawer"
      size="50%"
    >
      <div class="demo-drawer__content">
        <el-form
          :model="projectdata"
          :rules="formrules"
          label-width="90px"
          :inline="true"
          size="small"
          ref="userform"
        >
          <el-form-item label="生成方式">
            <el-radio-group v-model="projectdata.isRandom" style="width: 200px">
              <el-radio :label="false">自定义生成</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="项目名称" prop="name">
            <el-input
              v-model="projectdata.name"
              placeholder="请输入项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              style="width: 200px"
              v-model="projectdata.startTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              style="width: 200px"
              v-model="projectdata.endTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目描述">
            <el-input
              v-model="projectdata.description"
              placeholder="请输入模板描述"
            ></el-input>
          </el-form-item>
          <el-form-item label="项目模式" prop="status">
            <el-radio-group v-model="projectdata.status" style="width: 200px">
              <el-radio :label="1">问卷</el-radio>
              <el-radio :label="2">练习</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="答案解析">
            <el-radio-group
              v-model="projectdata.answerAnalysis"
              style="width: 200px"
            >
              <el-radio :label="true">展示</el-radio>
              <el-radio :label="false">不展示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="答题卡">
            <el-radio-group
              v-model="projectdata.answerSheetVisible"
              style="width: 200px"
            >
              <el-radio :label="true">可见</el-radio>
              <el-radio :label="false">不可见</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自动保存">
            <el-radio-group v-model="projectdata.autoSave" style="width: 200px">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户拷贝">
            <el-radio-group
              v-model="projectdata.copyEnabled"
              style="width: 200px"
            >
              <el-radio :label="true">允许</el-radio>
              <el-radio :label="false">禁止</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="修改答案">
            <el-radio-group
              v-model="projectdata.enableUpdate"
              style="width: 200px"
            >
              <el-radio :label="true">允许</el-radio>
              <el-radio :label="false">禁止</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="对用户开发">
            <el-radio-group v-model="projectdata.isActive" style="width: 200px">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="答题进度">
            <el-radio-group
              v-model="projectdata.progressBar"
              style="width: 200px"
            >
              <el-radio :label="true">显示</el-radio>
              <el-radio :label="false">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="项目封面">
            <el-upload
              class="upload-demo"
              action="/api/admin/questions/images"
              multiple
              :on-success="handleAvatarSuccess"
            >
              <el-button>选择图片</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button type="primary" @click="send(projectdata)">确 定</el-button>
        </div>
      </div>
    </el-drawer>
    <!-- 逻辑设置 -->
    <el-dialog title="设置逻辑" :visible.sync="dialogVisible" width="60%">
      
      <div v-for="(item, index) in questiondata" :key="index">
        <div v-if="item.type == 1 || item.type == 2">
          <div class="radio-title">
            <span
              >{{ item.questionTitle
              }}<el-image
                v-if="item.images"
                style="max-width: 100px; max-height: 50px"
                :src="`/api/photos/display?photoPath=${item.images}`"
                fit="scale-down"
              ></el-image
            ></span>
          </div>
          <!-- 答案选项 -->
          <div v-if="item.answer">
            <div
            class="item"
            v-for="(items, index) in item.answer.possibleAnswers"
            :key="index"
          >
            <div class="radio-box">
              <el-radio disabled></el-radio>
              <p class="item-text" v-html="items"></p>
              <p style="margin-left: 10px;">关联选项：</p>
              <el-select size="mini" v-model="item.luoji[index]" placeholder="请选择" v-if="item.luoji">
    <el-option
      v-for="items in questiondata"
      :key="items.id"
      :label="items.questionTitle"
      :value="items.id"
      :disabled="items.id==item.id">
    </el-option>
  </el-select>
            </div>

          </div>
          </div>
          
        </div>
      </div>
      <el-button plain size="small" @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" size="small" @click="confirmlj(questiondata)">确定</el-button>
    </el-dialog>
    <!-- 题库问题 -->
    <el-dialog title="查看题库" :visible.sync="dialogTableVisible">
      <div class="all">
        <el-checkbox-group v-model="examplexz">
    <el-checkbox :label="item.id" v-for="item in exampledata" :key="item.id">{{item.questionTitle}}
    </el-checkbox>
  </el-checkbox-group>
      </div>
       
  <el-button plain size="small" @click="dialogTableVisible=false">取消</el-button>
      <el-button type="primary" size="small" @click="confirmtk(examplexz)">确定</el-button>
</el-dialog>
  </div>
</template>

<script>
import selectoption from "@/components/study/selectoption.vue";
import { getArticleTags } from "@/api/article/articletag";
import {  addProjects,getProjectById } from "@/api/study/project";
import { getquestionsList} from "@/api/study/question";
export default {
  name: "",
  components: { selectoption },
  data() {
    return {
      articletag: [], //题目标签
      isredact: false, //标题是否为编辑状态
      drawer: false, //项目设置
      rowdata: {}, //查看字段
      projectdata: {}, //项目数据
      questiondata: [], //题目数据
      question: {}, //此时添加的题目数据
      formrules: {
        name: [{ required: true, message: "请输入标题", trigger: "blur" }],
        status: [
          { required: true, message: "请选择题目状态", trigger: "blur" },
        ],
      },
      dialogVisible: false,
      dialogTableVisible:false,
      exampledata:[],//题库数据
      examplexz:[],//选中的数据
      total: 0,
      pagesize: 10, //条数
      current: 3, //页码
      loading:true,
      }
  },
   watch: {
    $route(to, from) {
      if (to.name=="创建问卷") {
        this.onload();
      }
    },
  },
  mounted() {
    this.onload();
  },
  methods: {
    // 批量导入确定
    confirmtk(value) {
      if (this.projectdata.id) {
      const data={...this.projectdata}
    data.questions=[...new Set(data.questions.concat(value))]
      data.questions = JSON.stringify(data.questions);
  data.cascades = JSON.stringify(data.cascades);
  this.creation(data);
  this.dialogTableVisible=false
  }else{
 this.$message({
          message: '请先创建项目',
          type: 'warning'
        });
      }
    },
    // 确定逻{辑
    confirmlj(value) {
      let list = {};
      value.forEach(el => {
          list[el.id]={...el.luoji}
      });
      this.projectdata.cascades=list
 const data={...this.projectdata}
  data.questions = JSON.stringify(data.questions);
  data.cascades = JSON.stringify(data.cascades);
  this.creation(data);
  this.dialogVisible = false
    },
    // 创建项目
    send(value) {
       const data={...value}
  data.questions = JSON.stringify(data.questions);
  data.cascades = JSON.stringify(data.cascades);
      this.$refs.userform.validate((valid) => {
        if (valid) {
          addProjects(data)
            .then((res) => {
              this.drawer = false;
            })
            .catch((err) => {
              this.$message.error(err);
            });
        }
      });
    },
    handleAvatarSuccess(res, file, fileList) {
      if (res.code == 510) {
        file.status = "error";
       this.$message.error(file.name + "上传服务器失败请重新上传");
      } else {
       this.$message.success(file.name + "上传服务器成功");
        this.projectdata.cover = res.data;
      }
    },
    // 新增题
    addquestion(type, msg) {
      this.question={}
      if (this.projectdata.id) {
        if (this.projectdata.status==1&&type==8) {
    this.$message.error('问卷不可用');
        }else{
 this.question.type = type;
      this.question.status = this.projectdata.status;
      this.question.add = true;
      this.question.id = type;
      if (msg) this.question.msg = msg;
      this.questiondata.push(this.question);
        }
      
      }else{
 this.$message({
          message: '请先创建项目',
          type: 'warning'
        });
      }
    },
    // 删除题目
    deleteitem(value){
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.questiondata.forEach((el,index) => {
        if (value.id==el.id) {
          this.questiondata.splice(index, 1)
        }
      });
const data=this.projectdata
if (data.cascades) delete data.cascades[value.id]
let questions =new Set(data.questions)
questions.delete(value.id)
data.questions=[...questions]
const arry ={...data}
  arry.questions = JSON.stringify(arry.questions);
  arry.cascades = JSON.stringify(arry.cascades);
  this.creation(arry);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
    // 添加题目或编辑后获取返回值
    getvalue(value) {
      this.questiondata[this.questiondata.length - 1] = value;
      if (this.projectdata.questions==null) this.projectdata.questions=[]
      this.projectdata.questions.push(value.id);
      const data = {...this.projectdata}
      data.questions = JSON.stringify(data.questions);
      data.cascades = JSON.stringify(data.cascades);
      this.creation(data);
    },
    // 更新项目（添加题目后）
    creation(data) {
      addProjects(data)
        .catch((err) => {
          this.$message.error(err);
        });
    },
    async onload() {
      if (this.$route.query.id) {
        this.questiondata=[]
        const Project = await getProjectById(this.$route.query.id);
        if (Project.data.data.isRandom) {
          Project.data.data.isRandom=false;
          Project.data.data.questionNum=0
          Project.data.data.tagIds=""
          Project.data.data.types=""
        }
      let list = Project.data.data;
      if (list.tagIds != "") list.tagIds = JSON.parse(list.tagIds);
      if (list.types != "") list.types = JSON.parse(list.types);
      if (typeof list.questions == "string")
        list.questions = JSON.parse(list.questions);
       if (typeof list.cascades == "string"&&list.cascades !="") list.cascades= JSON.parse(list.cascades);
      this.projectdata = list;
      if (this.projectdata.questionBackDTOS!=null) {
        this.projectdata.questionBackDTOS.forEach((el) => {
        let luoji=[]
        if (this.projectdata.cascades) {
          luoji={...this.projectdata.cascades[el.id]}
        }
     // 处理问题luoji
        const item = {
          questionTitle: el.questionTitle,
          status: el.status,
          type: el.type,
          tagNameList: el.tagDTOList.map((li) => li.tagName),
          questionDescription: el.questionDescription,
          id: el.id,
          luoji,
          answer:el.answerBackDTO
        };
        if (el.images!=null) {
          item.images=el.images
        }
      
       item.answer.id = el.id;
        item.answer.possibleAnswers = JSON.parse(item.answer.possibleAnswers);
          item.answer.correctAnswers = JSON.parse(item.answer.correctAnswers);
         if (item.images) item.images = JSON.parse(item.images);
          this.questiondata.push(item);
      });
       this.drawer=true;
      }
      }else{
        this.projectdata={},
        this.questiondata=[],
        this.question={},
        this.rowdata={}
        this.drawer=true;
      }
      // 获取所有问题
      const dataobj = {
        isDelete: 0,
      };
      getquestionsList(dataobj).then((res) => {
        const data = res.data.data;
this.exampledata=data.recordList;
this.total = data.count;
      });
      // 获取文章标签列表
      getArticleTags().then((res) => {
        this.articletag = res.data.data.recordList;
      });
      setTimeout(() => {
          this.loading=false
        }, 500);
    },
  },
};
</script>
<style lang='scss' scoped>
.box {
  height: 100%;
  .savebtn {
    margin-bottom: 10px;
    margin-left: 5px;
    padding: 10px;
    background: white;
    display: flex;
    justify-content: space-between;
  }
  .con1 {
    height: calc(100% - 62px);
    display: flex;
    justify-content: space-between;
    .left-box {
      height: 100%;
      width: 270px;
      background: white;
      overflow-y: scroll;
      overflow-x: hidden;
      .title {
        padding: 20px 20px;
      }
      ul {
        list-style: none;
        padding: 0 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ebeef5;
        li {
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          span {
            padding: 5px 10px;
            border-radius: 10px;
          }
          span:hover {
            cursor: pointer;
            background: #409eff;
          }
        }
      }
      .el-button {
        width: 200px;
        margin: 20px 35px;
      }
    }
    .right-box {
      width: calc(100% - 280px);
      background: white;
      height: 100%;
      overflow-y: scroll;
      .title {
        font-size: 35px;
        text-align: center;
        margin-top: 10px;
      }
      .title:hover {
        background: #b3d8ff;
        cursor: pointer;
      }
      .titleInput {
        padding: 20px;
        display: flex;
        background: #d2efe7;
        .el-input {
          margin-right: 15px;
        }
      }
    }
  }
  .demo-drawer__content {
    text-align: center;
  }
  .el-dialog {
    .radio-title{
      display: flex;
          justify-content: space-between;
    align-items: center;
    
    }
    .item {
      margin: 20px 0;
      .radio-box {
        display: flex;
        align-items: center;
        .el-radio {
          margin-right: 0;
        }
      }
    }
    .all{
      height: 400px;
      overflow-y: scroll;
      margin-bottom: 10px;
      .el-checkbox-group{
      display: flex;
          flex-direction: column;
          .el-checkbox{
            margin: 7px 0;
          }
    }
    }
    
  }
}
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(116, 116, 116, 0.473);
  border-style: dashed;
  border-color: transparent;
  border-width: 2px;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(63, 63, 63, 0.7);
}
</style>