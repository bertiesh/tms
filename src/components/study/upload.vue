<template>
  <div>
    <!-- 填空题和问答题 -->
    <!-- 非bianji状态 -->
    <div class="radio" v-if="!isredact" @click="isredact = true">
      <!-- 题目 -->
      <div class="radio-title">
        <span
          >{{ radiodata.questionTitle
          }}<el-image
            v-if="radiodata.images"
            style="max-width: 100px; max-height: 50px; margin: 0 5px"
            :src="`/api/photos/display?photoPath=${radiodata.images}`"
            fit="scale-down"
          ></el-image
        ></span>
        <!-- 按钮 -->
        <div>
          <i class="el-icon-edit" title="编辑" @click="isredact = true"></i>
          <i class="el-icon-delete" title="删除" @click.stop="open"></i>
        </div>
      </div>
      <!-- 注释 -->
      <div class="annotation">{{ radiodata.questionDescription }}</div>
      <!-- 选项 -->
      <div class="upload-div">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">点击上传</div>
      </div>
      <div>{{radiodata.answer.correctAnswers[0]}}</div>
      <div>
        <span>答案解析：</span
        ><span>{{ radiodata.answer.questionAnalysis }}</span>
      </div>
    </div>
    <!-- 编辑状态 -->
    <div class="redact" v-else>
      <!-- 题目 -->
      <div class="option">
        <div class="titleInput">
          <el-input
            size="small"
            placeholder="请输入内容"
            v-model="radiodata.questionTitle"
          ></el-input>
          <!-- 按钮 -->
          <el-upload
            class="upload"
            action="/api/admin/questions/images"
            :show-file-list="false"
            :on-success="imgHandleSuccess"
          >
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-picture-outline"
              title="上传图片"
            ></el-button>
          </el-upload>
          <el-button size="small" type="success" @click="confirm" plain
            >确定</el-button
          ><el-button size="small" type="danger" plain @click="isredact = false"
            >取消</el-button
          >
        </div>
        <img
          v-if="radiodata.images"
          :src="`/api/photos/display?photoPath=${radiodata.images}`"
        />
      </div>

      <!-- 中间介绍 -->
      <div class="annotation">
        <el-checkbox v-model="explain">说明</el-checkbox>
        <span>题目标签 </span>
        <el-select
          multiple
          filterable
          allow-create
          v-model="radiodata.tagNameList"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in articletag"
            :key="item.id"
            :label="item.tagName"
            :value="item.tagName"
          >
          </el-option>
        </el-select>
        <el-input
          v-if="explain"
          type="textarea"
          size="small"
          placeholder="请输入内容"
          v-model="radiodata.questionDescription"
        ></el-input
        ><br />
<el-upload class="upload-demo" :file-list="fileList" drag action="/api/admin/files/collections/cover" :on-success="handleAvatarSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击上传</em></div>
      </el-upload>
        <el-checkbox v-model="answerexplain">答案解析</el-checkbox>
        <el-input
          v-if="answerexplain"
          type="textarea"
          size="small"
          placeholder="请输入内容"
          v-model="radiodata.answer.questionAnalysis"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { getquestionsList,deletequestion,addquestion,getquestionById } from "@/api/study/question";
import { getAnswerById, getQuestionById,addAnswer } from "@/api/study/answer";
export default {
  name: "",
  components: {},
  props: {
    /* 配置项 */
    articletag: {
      type: Array,
      default: () => {
        return [];
      },
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      radiodata: this.data,
      isredact: false, //是否为编辑状态
      explain: false, //题目说明
      answerexplain: false, //答案说明
      fileList:[{name: this.data.answer.correctAnswers[0], url:this.data.answer.correctAnswers[0]}]
    };
  },
  mounted() {
  },
  methods: {
    open() {
      this.$emit("deleteitem", this.radiodata);
    },
    // 图片上传成功后
    imgHandleSuccess(res) {
      this.radiodata.images = [res.data];
    },
     handleAvatarSuccess(res, file) {
this.radiodata.answer.correctAnswers=res.data
      },
    //   确定
    async confirm() {
       const list={...this.radiodata}
        if (list.images) list.images = JSON.stringify(list.images);
      await addquestion(list)
       const answer={...this.radiodata.answer}
  answer.possibleAnswers = JSON.stringify(answer.possibleAnswers)
  answer.correctAnswers = JSON.stringify(answer.correctAnswers)
  await addAnswer(answer)
    },
  },
};
</script>
<style lang='scss' scoped>
.radio {
  padding: 25px;
  .radio-title {
    display: flex;
    justify-content: space-between;
    i {
      font-size: 20px;
      margin-right: 10px;
    }
  }
  .annotation {
    color: #909399;
    font-size: 15px;
    margin: 5px 0;
  }
  .upload-div{
width: 200px;
    height: 100px;
        border: 1px dashed #d9d9d9;
    border-radius: 6px;
    text-align: center;
    .el-icon-upload{
      font-size: 57px;
      color: #d9d9d9;
    }
  }
}
:deep(.el-upload-dragger) {
    width: 200px;
    height: 100px;
    .el-icon-upload {
      line-height: 0;
      font-size: 60px;
    }
  }
.radio:hover {
  background: #b3d8ff;
  cursor: pointer;
}
.redact {
  background: #d2efe7;
  padding: 20px;
  .titleInput {
    display: flex;
    padding: 10px;
    .el-input {
      margin-right: 15px;
    }
    .upload {
      margin-right: 15px;
      background: #b3d8ff;
    }
  }
  .annotation {
    padding: 10px;
    span {
      font-size: 13px;
      margin-left: 10px;
    }
    .el-textarea {
      margin-top: 10px;
    }
    .upload-demo{
      margin-top: 5px;
    }
  }
  .option {
    img {
      object-fit: cover;
      width: 100px;
    }
  }
}
</style>