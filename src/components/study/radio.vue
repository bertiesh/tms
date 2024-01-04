<template>
  <div>
    <!-- 单选题 -->
    <!-- 非bianji状态 -->
    <div class="radio" v-if="!isredact" @click="isredact = true">
      <!-- 题目 -->
      <div class="radio-title">
        <span
          >{{ radiodata.questionTitle
          }}<el-image
            v-if="radiodata.images"
            style="max-width: 100px; max-height: 50px"
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
      <!-- 题目说明 -->
      <div class="annotation">{{ radiodata.questionDescription }}</div>
      <!-- 答案选项 -->
      <div
        class="item"
        v-for="(item, index) in radiodata.answer.possibleAnswers"
        :key="index"
      >
        <el-radio disabled></el-radio>
        <p class="item-text" v-html="item"></p>
      </div>
      <!-- 答案解析 -->
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
        ></el-input>
      </div>
      <div class="annotation" v-if="radiodata.answer.possibleAnswers == false">
        <span>新增选项 </span>
        <el-button
          type="primary"
          size="mini"
          plain
          icon="el-icon-plus"
          title="新增"
          @click="add"
        ></el-button>
      </div>
      <!-- 选项 -->
      <span v-show="false">{{ a }}</span>
      <div
        class="option"
        v-for="(item, index) in radiodata.answer.possibleAnswers"
        :key="item"
      >
        <div class="titleInput">
          <div class="item">
            <el-radio disabled></el-radio>
            <p
              class="item-text"
              v-html="item"
              @click="
                (radioindex.index = index),
                  (radioindex.explain = !radioindex.explain)
              "
            ></p>
          </div>
          <div>
            <el-button
              type="primary"
              size="mini"
              plain
              icon="el-icon-plus"
              title="新增"
              @click="add"
            ></el-button>
            <el-button
              type="primary"
              size="mini"
              plain
              icon="el-icon-minus"
              title="减少"
              @click="reduce(index)"
            ></el-button>
          </div>
        </div>
        
        <Editor
          v-if="radioindex.index == index && radioindex.explain"
          class="editor"
          :mdcontent="item"
          @getrender="geteditor($event, index)"
        />
      </div>
      <!-- 正确答案 -->
      <div class="annotation">
        <span>正确答案 </span>
        <el-select
          v-model="radiodata.answer.correctAnswers[0]"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in radiodata.answer.possibleAnswers"
            :key="item"
            :label="item"
            :value="item"
          >
            {{ item }}
          </el-option>
        </el-select>
      </div>
      <div class="annotation">
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
import {
  addquestion,
} from "@/api/study/question";
import {addAnswer } from "@/api/study/answer";
import Editor from "../editor.vue";
export default {
  name: "",
  components: { Editor },
  props: {
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
    projectdata: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      radiodata: this.data,
      isredact: false, //是否为编辑状态
      explain: false, //题目说明
      answerexplain: false, //答案说明
      radioindex: { index: null, explain: false },
      a: "",
    };
  },
  mounted() {
  },
  methods: {
    // 删除
    open() {
      this.$emit("deleteitem", this.radiodata);
    },
    
    // 获取选项内容
    geteditor(value, item) {
      this.radiodata.answer.possibleAnswers[item] = value;
      this.a = value;
    },
    // 图片上传成功后
    imgHandleSuccess(res) {
      this.radiodata.images = [res.data];
    },
    //   增加选项
    add() {
      let num;
      if (this.radiodata.answer.possibleAnswers) {
        num = this.radiodata.answer.possibleAnswers.length + 1;
      } else {
        num = 1;
        this.radiodata.answer.possibleAnswers = [];
      }
      this.radiodata.answer.possibleAnswers.push("新增选项" + num);
      this.a=this.radiodata.answer.possibleAnswers
    },
    reduce(index) {
      this.radiodata.answer.possibleAnswers.splice(index, 1);
      this.a=this.radiodata.answer.possibleAnswers
    },
    //   确定
    async confirm() {
      const list={...this.radiodata}
       if (list.images) list.images = JSON.stringify(list.images);
      await addquestion(list);
      const answer = { ...this.radiodata.answer };
      answer.possibleAnswers = JSON.stringify(answer.possibleAnswers);
      answer.correctAnswers = JSON.stringify(answer.correctAnswers);
      await addAnswer(answer);
    },
  },
};
</script>
<style lang='scss' scoped>
.radio{
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
    margin-top: 5px;
  }
  .item {
    display: flex;
    align-items: center;
    margin: 10px 0;
    .el-radio {
      margin-right: 0;
    }
    .item-text {
      cursor: pointer;
    }
    :deep(img){
      width: 100px;
    }
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
    justify-content: space-between;
    align-items: center;
    .el-input {
      margin-right: 15px;
    }
    .upload {
      margin-right: 15px;
      background: #b3d8ff;
    }
    .item {
      display: flex;
      align-items: center;
      margin: 10px 0;
      .el-radio {
        margin-right: 0;
      }
      .item-text {
        cursor: pointer;
      }
    }
  }
  .annotation {
    padding: 10px;
    span {
      font-size: 13px;
      margin-left: 10px;
    }
    .editor {
      margin-top: 10px;
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